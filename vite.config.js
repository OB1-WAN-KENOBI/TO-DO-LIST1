export default {
  root: ".", // Корень проекта
  base: "/", // Для деплой
  server: {
    port: 3000, // Порт dev-сервера
  },
  build: {
    outDir: "dist", // Папка сборки
  },
  resolve: {
    alias: {
      "@": "/src", // Опционально: алиас для src, чтобы импорты были проще (например, import from '@/js/main.js')
    },
  },
};
