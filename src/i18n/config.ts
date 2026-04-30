import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "app": {
        "title": "PromptForge",
        "subtitle": "Evolution Laboratory"
      },
      "nav": {
        "dashboard": "Generator",
        "chat": "Conversations",
        "vision": "Vision Analysis",
        "text_tools": "Core Utils",
        "library": "LIBRARY",
        "saved": "Stored Archive",
        "templates": "Forge Templates",
        "my_templates": "Private Lab",
        "marketplace": "Marketplace",
        "analytics": "INSIGHTS",
        "history": "Sequence Log",
        "stats": "Telemetry",
        "admin": "SYSTEM",
        "settings": "Configurations",
        "logout": "Terminate"
      },
      "dashboard": {
        "input_placeholder": "Command Intent...",
        "generate_button": "Launch Forge",
        "optimizing": "Syncing...",
        "result_title": "Output Blueprint",
        "copy_button": "Copy",
        "save_button": "Store",
        "audit": "Quality Audit",
        "auditing": "Scanning...",
        "length": "Output Length",
        "category": "Domain",
        "short": "Short",
        "medium": "Balanced",
        "long": "Detailed",
        "general": "General",
        "engineering": "Engineering",
        "creative": "Creative",
        "academic": "Academic",
        "image_upload": "Vision Ref"
      },
      "settings": {
        "title": "Configurations",
        "language": "Language Interface",
        "theme": "Theme Node",
        "gemini_active": "Engine Status",
        "api_key": "Access Key"
      }
    }
  },
  ru: {
    translation: {
      "app": {
        "title": "PromptForge",
        "subtitle": "Лаборатория Эволюции"
      },
      "nav": {
        "dashboard": "Генератор",
        "chat": "Диалоги",
        "vision": "Анализ Vision",
        "text_tools": "Текстовые утилиты",
        "library": "БИБЛИОТЕКА",
        "saved": "Архив",
        "templates": "Шаблоны",
        "my_templates": "Моя лаборатория",
        "marketplace": "Маркетплейс",
        "analytics": "АНАЛИТИКА",
        "history": "Лог сессий",
        "stats": "Телеметрия",
        "admin": "СИСТЕМА",
        "settings": "Конфигурация",
        "logout": "Выход"
      },
      "dashboard": {
        "input_placeholder": "Введите команду или идею...",
        "generate_button": "Запуск ковки",
        "optimizing": "Синхронизация...",
        "result_title": "Выходной чертеж",
        "copy_button": "Копировать",
        "save_button": "Сохранить",
        "audit": "Проверка качества",
        "auditing": "Сканирование...",
        "length": "Длина результата",
        "category": "Домен",
        "short": "Short",
        "medium": "Balanced",
        "long": "Detailed",
        "general": "Общий",
        "engineering": "Engineering",
        "creative": "Креатив",
        "academic": "Академический",
        "image_upload": "Vision Ref"
      },
      "settings": {
        "title": "Настройки",
        "language": "Язык интерфейса",
        "theme": "Ядро темы",
        "gemini_active": "Статус движка",
        "api_key": "Ключ доступа"
      }
    }
  },
  ua: {
    translation: {
      "app": {
        "title": "PromptForge",
        "subtitle": "Лабораторія Еволюції"
      },
      "nav": {
        "dashboard": "Генератор",
        "chat": "Діалоги",
        "vision": "Аналіз Vision",
        "text_tools": "Текстові утиліти",
        "library": "БІБЛІОТЕКА",
        "saved": "Архів",
        "templates": "Шаблони",
        "my_templates": "Моя лабораторія",
        "marketplace": "Маркетплейс",
        "analytics": "АНАЛІТИКА",
        "history": "Лог сесій",
        "stats": "Телеметрія",
        "admin": "СИСТЕМА",
        "settings": "Конфігурація",
        "logout": "Вийти"
      },
      "dashboard": {
        "input_placeholder": "Введіть команду або ідею...",
        "generate_button": "Запуск кування",
        "optimizing": "Синхронізація...",
        "result_title": "Вихідне креслення",
        "copy_button": "Копіювати",
        "save_button": "Зберегти",
        "audit": "Перевірка якості",
        "auditing": "Сканування...",
        "length": "Довжина результату",
        "category": "Домен",
        "short": "Short",
        "medium": "Balanced",
        "long": "Detailed",
        "general": "Загальний",
        "engineering": "Engineering",
        "creative": "Креатив",
        "academic": "Академічний",
        "image_upload": "Vision Ref"
      },
      "settings": {
        "title": "Налаштування",
        "language": "Мова інтерфейсу",
        "theme": "Ядро теми",
        "gemini_active": "Статус двигуна",
        "api_key": "Ключ доступу"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
