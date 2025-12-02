import { useTranslation } from "react-i18next";
import { Globe } from "phosphor-react";
import styles from "./LanguageSwitcher.module.scss";

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const current = i18n.language.split("-")[0]; // нормализация

  const next = current === "en" ? "ru" : "en";

  const toggleLanguage = () => {
    i18n.changeLanguage(next);
  };

  return (
    <button
      className={styles.languageSwitcher}
      onClick={toggleLanguage}
      aria-label={
        next === "en"
          ? t("language.switchToEnglish")
          : t("language.switchToRussian")
      }
      title={next === "en" ? "English" : "Русский"}
    >
      <Globe size={20} weight="bold" />
      <span className={styles.label}>{current.toUpperCase()}</span>
    </button>
  );
};
