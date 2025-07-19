document.addEventListener("DOMContentLoaded", () => {
  // Это значит, что код внутри запустится, когда страница полностью загрузится

  // Получаем элементы из HTML, чтобы с ними работать
  const todoForm = document.getElementById("todo-form"); // Форма для добавления задач
  const todoInput = document.getElementById("todo-input"); // Поле ввода новой задачи
  const todoList = document.getElementById("todo-list"); // Список задач (ul)
  const searchInput = document.getElementById("search-input"); // Поле для поиска задач
  const filterBtns = document.querySelectorAll(".filter-btn"); // Кнопки фильтров (все, активные, завершённые)

  // Загружаем задачи из localStorage (если есть) или создаём пустой массив
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let currentFilter = "all"; // Текущий фильтр по умолчанию - все задачи

  // Функция для сохранения задач в localStorage
  const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks)); // Превращаем массив в строку и сохраняем
  };

  // Проверяем и исправляем старые задачи, если в них ошибки (например, нет id или текст не строка)
  tasks = tasks
    .map((task, index) => ({
      id: task.id || (Date.now() + index).toString(), // Добавляем id, если его нет (используем время + индекс)
      text: typeof task.text === "string" ? task.text : "", // Убеждаемся, что текст - это строка, иначе пустая
      completed: !!task.completed, // Делаем completed булевым (true/false)
    }))
    .filter((task) => task.text.trim() !== ""); // Удаляем задачи с пустым текстом

  saveTasks(); // Сразу сохраняем исправленные задачи

  // Функция для отображения задач на странице
  const renderTasks = () => {
    todoList.innerHTML = ""; // Очищаем список перед добавлением новых элементов
    let filteredTasks = tasks; // Копируем все задачи

    // Применяем фильтр
    if (currentFilter === "active") {
      filteredTasks = tasks.filter((task) => !task.completed); // Только активные (не завершённые)
    } else if (currentFilter === "completed") {
      filteredTasks = tasks.filter((task) => task.completed); // Только завершённые
    }

    // Применяем поиск
    const searchTerm = searchInput.value.toLowerCase(); // Получаем текст поиска в нижнем регистре
    filteredTasks = filteredTasks.filter((task) =>
      task.text.toLowerCase().includes(searchTerm) // Оставляем задачи, где текст содержит поисковый запрос
    );

    // Для каждой задачи создаём элемент списка
    filteredTasks.forEach((task) => {
      const li = document.createElement("li"); // Создаём <li>
      li.classList.add("todo-item"); // Добавляем класс
      li.dataset.id = task.id; // Сохраняем id задачи в data-атрибут

      const checkbox = document.createElement("input"); // Чекбокс для отметки выполненности
      checkbox.type = "checkbox";
      checkbox.checked = task.completed; // Если задача выполнена, чекбокс отмечен
      checkbox.addEventListener("change", () => toggleCompleted(task.id)); // При смене вызываем функцию

      const textSpan = document.createElement("span"); // Текст задачи
      textSpan.classList.add("todo-text");
      textSpan.textContent = task.text;
      if (task.completed) textSpan.classList.add("completed"); // Если выполнена, зачёркиваем

      const editBtn = document.createElement("button"); // Кнопка редактирования
      editBtn.classList.add("edit-btn");
      editBtn.textContent = "✏️";
      editBtn.addEventListener("click", () => editTask(task.id)); // При клике редактируем

      const deleteBtn = document.createElement("button"); // Кнопка удаления
      deleteBtn.classList.add("delete-btn");
      deleteBtn.textContent = "🗑️";
      deleteBtn.addEventListener("click", () => deleteTask(task.id)); // При клике удаляем

      // Добавляем всё в <li> и <li> в список
      li.appendChild(checkbox);
      li.appendChild(textSpan);
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
      todoList.appendChild(li);
    });
  };

  // Добавление новой задачи при отправке формы
  todoForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    const text = todoInput.value.trim(); // Получаем текст, убираем лишние пробелы
    if (text) { // Если текст не пустой
      const id = Date.now().toString(); // Создаём уникальный id по времени
      tasks.push({ id, text, completed: false }); // Добавляем в массив
      saveTasks(); // Сохраняем
      todoInput.value = ""; // Очищаем поле ввода
      renderTasks(); // Перерисовываем список
    }
  });

  // Переключение статуса задачи (выполнена/не выполнена)
  const toggleCompleted = (id) => {
    const task = tasks.find((t) => t.id === id); // Находим задачу по id
    if (task) {
      task.completed = !task.completed; // Меняем статус
      saveTasks(); // Сохраняем
      renderTasks(); // Перерисовываем
    }
  };

  // Редактирование задачи
  const editTask = (id) => {
    const task = tasks.find((t) => t.id === id); // Находим задачу
    if (task) {
      const newText = prompt("Edit task:", task.text); // Показываем prompt для нового текста
      if (newText !== null && newText.trim()) { // Если ввели что-то
        task.text = newText.trim(); // Обновляем текст
        saveTasks(); // Сохраняем
        renderTasks(); // Перерисовываем
      }
    }
  };

  // Удаление задачи
  const deleteTask = (id) => {
    if (confirm("Are you sure?")) { // Подтверждение удаления
      tasks = tasks.filter((t) => t.id !== id); // Удаляем из массива
      saveTasks(); // Сохраняем
      renderTasks(); // Перерисовываем
    }
  };

  // Обработка кликов на кнопки фильтров
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active")); // Убираем активный класс со всех
      btn.classList.add("active"); // Добавляем на нажатую
      currentFilter = btn.dataset.filter; // Обновляем текущий фильтр
      renderTasks(); // Перерисовываем
    });
  });

  // Поиск с задержкой (debounce), чтобы не обновлять на каждый символ
  let debounceTimer; // Таймер для задержки
  const debounce = (func, delay) => {
    clearTimeout(debounceTimer); // Очищаем предыдущий таймер
    debounceTimer = setTimeout(func, delay); // Запускаем новый
  };

  searchInput.addEventListener("input", () => {
    debounce(renderTasks, 300); // Вызываем рендер с задержкой 300 мс
  });

  // Первое отображение задач при загрузке
  renderTasks();
});