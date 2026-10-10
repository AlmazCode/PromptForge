'use strict';

import { tasks } from '../data.js';
import { taskTranslations } from './tasks.js';
import { redesignMessages } from './redesign.js';
import { trainingMessages } from './training.js';
import { usabilityMessages } from './usability.js';
import { competitionMessages } from './competition.js';
import { avatarMessages } from './avatars.js';
import { settingsMessages } from './settings.js';

// English source → Russian, Kazakh. Keep placeholders identical across languages.
export const messages = {
  "Interface language": [
    "Язык интерфейса",
    "Интерфейс тілі"
  ],
  "Home": [
    "Главная",
    "Басты бет"
  ],
  "Leaderboard": [
    "Рейтинг",
    "Рейтинг"
  ],
  "How it works": [
    "Как это работает",
    "Қалай жұмыс істейді"
  ],
  "How It Works — PromptForge": [
    "Как это работает — PromptForge",
    "Қалай жұмыс істейді — PromptForge"
  ],
  "Profile": [
    "Профиль",
    "Профиль"
  ],
  "Log in": [
    "Войти",
    "Кіру"
  ],
  "Log In": [
    "Вход",
    "Кіру"
  ],
  "Log out": [
    "Выйти",
    "Шығу"
  ],
  "Register": [
    "Создать аккаунт",
    "Тіркелу"
  ],
  "Pro plan": [
    "Тариф Pro",
    "Pro тарифі"
  ],
  "Try Pro": [
    "Попробовать Pro",
    "Pro қолданып көру"
  ],
  "Skip to content": [
    "К содержимому",
    "Мазмұнға өту"
  ],
  "Show navigation": [
    "Открыть меню",
    "Мәзірді ашу"
  ],
  "Prompt Forge home": [
    "Главная Prompt Forge",
    "Prompt Forge басты беті"
  ],
  "Primary navigation": [
    "Основная навигация",
    "Негізгі навигация"
  ],
  "Footer navigation": [
    "Навигация в подвале",
    "Төменгі навигация"
  ],
  "Guide": [
    "Руководство",
    "Нұсқаулық"
  ],
  "Rules": [
    "Правила",
    "Ережелер"
  ],
  "Privacy": [
    "Конфиденциальность",
    "Құпиялық"
  ],
  "© 2026 Prompt Forge. Practice clear instructions.": [
    "© 2026 Prompt Forge. Учитесь писать ясные инструкции.",
    "© 2026 Prompt Forge. Нақты нұсқаулар жазуды үйреніңіз."
  ],
  "Home — PromptForge": [
    "Главная — PromptForge",
    "Басты бет — PromptForge"
  ],
  "Leaderboard — PromptForge": [
    "Рейтинг — PromptForge",
    "Рейтинг — PromptForge"
  ],
  "Login — PromptForge": [
    "Вход — PromptForge",
    "Кіру — PromptForge"
  ],
  "Register — PromptForge": [
    "Регистрация — PromptForge",
    "Тіркелу — PromptForge"
  ],
  "Profile — PromptForge": [
    "Профиль — PromptForge",
    "Профиль — PromptForge"
  ],
  "Task Workspace — PromptForge": [
    "Рабочая область задачи — PromptForge",
    "Тапсырма жұмыс аймағы — PromptForge"
  ],
  "{title} — PromptForge": [
    "{title} — PromptForge",
    "{title} — PromptForge"
  ],
  "Clear": [
    "Очистить",
    "Тазарту"
  ],
  "Reset": [
    "Сбросить",
    "Қалпына келтіру"
  ],
  "Cancel": [
    "Отмена",
    "Болдырмау"
  ],
  "Confirm": [
    "Подтвердить",
    "Растау"
  ],
  "Delete": [
    "Удалить",
    "Жою"
  ],
  "Name": [
    "Имя",
    "Аты"
  ],
  "Email": [
    "Эл. почта",
    "Эл. пошта"
  ],
  "Phone": [
    "Телефон",
    "Телефон"
  ],
  "Message": [
    "Сообщение",
    "Хабарлама"
  ],
  "Subject": [
    "Тема",
    "Тақырып"
  ],
  "— Select —": [
    "— Выберите —",
    "— Таңдаңыз —"
  ],
  "Other": [
    "Другое",
    "Басқа"
  ],
  "Low": [
    "Низкая",
    "Төмен"
  ],
  "Medium": [
    "Средняя",
    "Орташа"
  ],
  "High": [
    "Высокая",
    "Жоғары"
  ],
  "low": [
    "низкая",
    "төмен"
  ],
  "medium": [
    "средняя",
    "орташа"
  ],
  "high": [
    "высокая",
    "жоғары"
  ],
  "bug": [
    "ошибка",
    "қате"
  ],
  "feature": [
    "предложение",
    "ұсыныс"
  ],
  "other": [
    "другое",
    "басқа"
  ],
  "task": [
    "вопрос о задаче",
    "тапсырма туралы сұрақ"
  ],
  "Report a bug": [
    "Сообщить об ошибке",
    "Қате туралы хабарлау"
  ],
  "Suggest a feature": [
    "Предложить функцию",
    "Функция ұсыну"
  ],
  "Question about a task": [
    "Вопрос о задаче",
    "Тапсырма туралы сұрақ"
  ],
  "Priority (1–5)": [
    "Приоритет (1–5)",
    "Басымдық (1–5)"
  ],
  "Preferred contact date": [
    "Желаемая дата связи",
    "Байланысуға қолайлы күн"
  ],
  "Subscribe to updates": [
    "Подписаться на новости",
    "Жаңалықтарға жазылу"
  ],
  "Review message": [
    "Проверить сообщение",
    "Хабарламаны тексеру"
  ],
  "What happens next": [
    "Что дальше",
    "Әрі қарай не болады"
  ],
  "Continue practising": [
    "Продолжить практику",
    "Жаттығуды жалғастыру"
  ],
  "Your message": [
    "Ваше сообщение",
    "Сіздің хабарламаңыз"
  ],
  "Your message summary is ready.": [
    "Сводка сообщения готова.",
    "Хабарлама қорытындысы дайын."
  ],
  "Form cleared.": [
    "Форма очищена.",
    "Форма тазартылды."
  ],
  "Saved to this site’s database. No email was sent; no callback or newsletter subscription was scheduled.": [
    "Сохранено в базе сайта. Письмо не отправлялось; звонок и подписка на новости не оформлены.",
    "Сайттың дерекқорына сақталды. Электрондық хат жіберілген жоқ; қоңырау немесе жаңалықтарға жазылу жоспарланған жоқ."
  ],
  "{notice} Reference: {reference}": [
    "{notice} Номер: {reference}",
    "{notice} Нөмірі: {reference}"
  ],
  "{count} / 2000 characters": [
    "{count} / 2000 символов",
    "{count} / 2000 таңба"
  ],
  "{topic} · priority {priority} · urgency {urgency}": [
    "{topic} · приоритет {priority} · срочность {urgency}",
    "{topic} · басымдық {priority} · шұғылдық {urgency}"
  ],
  "{name} ({email}): {message}{date}": [
    "{name} ({email}): {message}{date}",
    "{name} ({email}): {message}{date}"
  ],
  " · preferred date: {date}": [
    " · желаемая дата: {date}",
    " · қолайлы күн: {date}"
  ],
  "Create an Account": [
    "Создать аккаунт",
    "Аккаунт ашу"
  ],
  "Free · No credit card required": [
    "Бесплатно · Карта не нужна",
    "Тегін · Банк картасы қажет емес"
  ],
  "Account Information": [
    "Данные аккаунта",
    "Аккаунт деректері"
  ],
  "Full Name *": [
    "Полное имя *",
    "Толық аты-жөні *"
  ],
  "Email Address *": [
    "Эл. почта *",
    "Эл. пошта *"
  ],
  "Phone Number": [
    "Номер телефона",
    "Телефон нөмірі"
  ],
  "Experience (years)": [
    "Опыт (лет)",
    "Тәжірибе (жыл)"
  ],
  "Area of Interest *": [
    "Область интересов *",
    "Қызығушылық саласы *"
  ],
  "Password *": [
    "Пароль *",
    "Құпиясөз *"
  ],
  "Confirm password *": [
    "Подтвердите пароль *",
    "Құпиясөзді растаңыз *"
  ],
  "About you": [
    "О себе",
    "Өзіңіз туралы"
  ],
  "Agreements": [
    "Согласия",
    "Келісімдер"
  ],
  "I agree with the": [
    "Я согласен с",
    "Мен"
  ],
  "community guidelines": [
    "правилами сообщества",
    "қауымдастық ережелерімен келісемін"
  ],
  "and understand that": [
    "и понимаю, что",
    "және"
  ],
  "AI": [
    "ИИ",
    "ЖИ"
  ],
  "can make mistakes": [
    "может ошибаться",
    "қате жіберуі мүмкін екенін түсінемін"
  ],
  "I accept the": [
    "Я принимаю",
    "Мен"
  ],
  "privacy policy": [
    "политику конфиденциальности",
    "құпиялық саясатын қабылдаймын"
  ],
  "Subscribe to weekly task updates": [
    "Получать еженедельные обновления задач",
    "Тапсырма жаңалықтарын апта сайын алу"
  ],
  "Already have an account?": [
    "Уже есть аккаунт?",
    "Аккаунтыңыз бар ма?"
  ],
  "Don't have an account?": [
    "Ещё нет аккаунта?",
    "Аккаунтыңыз жоқ па?"
  ],
  "Create one here": [
    "Зарегистрироваться",
    "Тіркелу"
  ],
  "Your Credentials": [
    "Данные для входа",
    "Кіру деректері"
  ],
  "Welcome back — enter your credentials": [
    "С возвращением — введите данные для входа",
    "Қайта оралуыңызбен — кіру деректерін енгізіңіз"
  ],
  "Open profile": [
    "Открыть профиль",
    "Профильді ашу"
  ],
  "Return to your task": [
    "Вернуться к задаче",
    "Тапсырмаға оралу"
  ],
  "Show password": [
    "Показать пароль",
    "Құпиясөзді көрсету"
  ],
  "Hide password": [
    "Скрыть пароль",
    "Құпиясөзді жасыру"
  ],
  "Password requirements": [
    "Требования к паролю",
    "Құпиясөз талаптары"
  ],
  "Use at least 8 characters.": [
    "Не менее 8 символов.",
    "Кемінде 8 таңба пайдаланыңыз."
  ],
  "8–128 characters": [
    "8–128 символов",
    "8–128 таңба"
  ],
  "Digit": [
    "Цифра",
    "Сан"
  ],
  "Special character": [
    "Специальный символ",
    "Арнайы таңба"
  ],
  "{mark} {requirement}": [
    "{mark} {requirement}",
    "{mark} {requirement}"
  ],
  "Passwords must match exactly.": [
    "Пароли должны полностью совпадать.",
    "Құпиясөздер толық сәйкес болуы керек."
  ],
  "Tell us why PromptForge interests you...": [
    "Расскажите, чем вас заинтересовал PromptForge…",
    "PromptForge несімен қызықтыратынын айтыңыз…"
  ],
  "You are signed in as {name}. You can open your profile or use a different account.": [
    "Вы вошли как {name}. Можно открыть профиль или использовать другой аккаунт.",
    "Сіз {name} ретінде кірдіңіз. Профильді ашуға немесе басқа аккаунтты пайдалануға болады."
  ],
  "Account created for {name}. Your Free plan includes 10 checks per 24 hours. Interest: {interest}; experience: {level}.": [
    "Аккаунт {name} создан. Тариф Free включает 10 проверок за 24 часа. Интерес: {interest}; уровень: {level}.",
    "{name} аккаунты ашылды. Free тарифінде 24 сағатқа 10 тексеру бар. Қызығушылық: {interest}; деңгей: {level}."
  ],
  "Your session is active on this device.": [
    "Вы вошли на этом устройстве.",
    "Осы құрылғыда жүйеге кірдіңіз."
  ],
  "Your account details are ready.": [
    "Данные аккаунта готовы.",
    "Аккаунт деректері дайын."
  ],
  "Sign-in complete. Continue to your practice profile.": [
    "Вход выполнен. Перейдите в профиль.",
    "Жүйеге кірдіңіз. Профильге өтіңіз."
  ],
  "Beginner": [
    "Начальный",
    "Бастапқы"
  ],
  "Intermediate": [
    "Средний",
    "Орта"
  ],
  "Advanced": [
    "Продвинутый",
    "Жоғары"
  ],
  "beginner": [
    "начальный",
    "бастапқы"
  ],
  "intermediate": [
    "средний",
    "орта"
  ],
  "advanced": [
    "продвинутый",
    "жоғары"
  ],
  "Copywriting": [
    "Копирайтинг",
    "Копирайтинг"
  ],
  "Translation": [
    "Перевод",
    "Аударма"
  ],
  "Summarization": [
    "Сводки текстов",
    "Мәтінді қорытындылау"
  ],
  "Brainstorming": [
    "Генерация идей",
    "Идеялар генерациясы"
  ],
  "Role-play": [
    "Ролевые сценарии",
    "Рөлдік сценарийлер"
  ],
  "Extraction": [
    "Извлечение данных",
    "Деректерді алу"
  ],
  "Development": [
    "Разработка",
    "Әзірлеу"
  ],
  "Education": [
    "Образование",
    "Білім беру"
  ],
  "copywriting": [
    "копирайтинг",
    "копирайтинг"
  ],
  "data analysis": [
    "анализ данных",
    "деректерді талдау"
  ],
  "code generation": [
    "генерация кода",
    "код генерациясы"
  ],
  "system design": [
    "проектирование систем",
    "жүйелерді жобалау"
  ],
  "translation": [
    "перевод",
    "аударма"
  ],
  "summarization": [
    "сводки текстов",
    "мәтінді қорытындылау"
  ],
  "brainstorming": [
    "генерация идей",
    "идеялар генерациясы"
  ],
  "role play": [
    "ролевые сценарии",
    "рөлдік сценарийлер"
  ],
  "role-play": [
    "ролевые сценарии",
    "рөлдік сценарийлер"
  ],
  "extraction": [
    "извлечение данных",
    "деректерді алу"
  ],
  "social media": [
    "соцсети",
    "әлеуметтік желілер"
  ],
  "marketing": [
    "маркетинг",
    "маркетинг"
  ],
  "business": [
    "бизнес",
    "бизнес"
  ],
  "chatbot": [
    "чат-бот",
    "чат-бот"
  ],
  "instruction": [
    "инструкции",
    "нұсқаулар"
  ],
  "documentation": [
    "документация",
    "құжаттама"
  ],
  "product": [
    "продукт",
    "өнім"
  ],
  "startup": [
    "стартап",
    "стартап"
  ],
  "meetings": [
    "встречи",
    "кездесулер"
  ],
  "productivity": [
    "продуктивность",
    "өнімділік"
  ],
  "interview": [
    "собеседование",
    "сұхбат"
  ],
  "evaluation": [
    "оценка",
    "бағалау"
  ],
  "email": [
    "эл. почта",
    "эл. пошта"
  ],
  "database": [
    "база данных",
    "дерекқор"
  ],
  "reporting": [
    "отчётность",
    "есеп беру"
  ],
  "multi-agent": [
    "мультиагентность",
    "көп агентті жүйе"
  ],
  "orchestration": [
    "оркестрация",
    "үйлестіру"
  ],
  "analysis": [
    "анализ",
    "талдау"
  ],
  "strategy": [
    "стратегия",
    "стратегия"
  ],
  "legal": [
    "юридические тексты",
    "заң мәтіндері"
  ],
  "support": [
    "поддержка",
    "қолдау"
  ],
  "persona": [
    "персона",
    "кейіп"
  ],
  "Training Tasks": [
    "Задачи для практики",
    "Жаттығу тапсырмалары"
  ],
  "16 exercises · 9 skill areas · Six scoring criteria": [
    "16 задач · 9 направлений · 6 критериев оценки",
    "16 тапсырма · 9 бағыт · 6 бағалау өлшемі"
  ],
  "Catalog": [
    "Каталог",
    "Каталог"
  ],
  "Category": [
    "Категория",
    "Санат"
  ],
  "Difficulty": [
    "Сложность",
    "Күрделілік"
  ],
  "All": [
    "Все",
    "Барлығы"
  ],
  "Available": [
    "Доступные",
    "Қолжетімді"
  ],
  "available": [
    "доступные",
    "қолжетімді"
  ],
  "Solved": [
    "Решено",
    "Шешілді"
  ],
  "solved": [
    "решено",
    "шешілді"
  ],
  "Active": [
    "В работе",
    "Орындалуда"
  ],
  "active": [
    "в работе",
    "орындалуда"
  ],
  "In progress": [
    "В процессе",
    "Орындалуда"
  ],
  "Checked": [
    "Проверено",
    "Тексерілді"
  ],
  "Target Model": [
    "Целевая модель",
    "Мақсатты модель"
  ],
  "Any model": [
    "Любая модель",
    "Кез келген модель"
  ],
  "Text model": [
    "Текстовая модель",
    "Мәтіндік модель"
  ],
  "Any text model": [
    "Любая текстовая модель",
    "Кез келген мәтіндік модель"
  ],
  "Catalog order": [
    "Порядок каталога",
    "Каталог реті"
  ],
  "Title A–Z": [
    "По названию",
    "Атауы бойынша"
  ],
  "Difficulty ↑": [
    "Сложность ↑",
    "Күрделілік ↑"
  ],
  "Difficulty ↓": [
    "Сложность ↓",
    "Күрделілік ↓"
  ],
  "All exercises": [
    "Все задачи",
    "Барлық тапсырмалар"
  ],
  "Clear all": [
    "Сбросить всё",
    "Барлығын тазарту"
  ],
  "16 exercises": [
    "16 задач",
    "16 тапсырма"
  ],
  "{count} of {total} exercises": [
    "Задач: {count} из {total}",
    "Тапсырмалар: {total} ішінен {count}"
  ],
  "Search: {query}": [
    "Поиск: {query}",
    "Іздеу: {query}"
  ],
  "No matching exercises": [
    "Ничего не найдено",
    "Ештеңе табылмады"
  ],
  "Try another skill area or clear your filters.": [
    "Выберите другое направление или сбросьте фильтры.",
    "Басқа бағытты таңдаңыз немесе сүзгілерді тазалаңыз."
  ],
  "Show all exercises": [
    "Показать все задачи",
    "Барлық тапсырмаларды көрсету"
  ],
  "No exercises match these filters. Clear filters or change your search.": [
    "Подходящих задач нет. Сбросьте фильтры или измените запрос.",
    "Сүзгілерге сәйкес тапсырмалар жоқ. Сүзгілерді тазалаңыз немесе сұрауды өзгертіңіз."
  ],
  "Six weighted criteria": [
    "Шесть взвешенных критериев",
    "Салмақтары бар алты өлшем"
  ],
  "6 criteria": [
    "6 критериев",
    "6 өлшем"
  ],
  "Six criteria": [
    "Шесть критериев",
    "Алты өлшем"
  ],
  "total": [
    "всего",
    "барлығы"
  ],
  "Task": [
    "Задача",
    "Тапсырма"
  ],
  "Date": [
    "Дата",
    "Күні"
  ],
  "Status": [
    "Статус",
    "Күйі"
  ],
  "Score": [
    "Балл",
    "Ұпай"
  ],
  "Exercise": [
    "Задача",
    "Тапсырма"
  ],
  "Attempts": [
    "Попытки",
    "Талпыныстар"
  ],
  "Average": [
    "Средний балл",
    "Орташа ұпай"
  ],
  "Best score": [
    "Лучший балл",
    "Үздік ұпай"
  ],
  "History": [
    "История",
    "Тарих"
  ],
  "completed tasks": [
    "завершённых задач",
    "аяқталған тапсырмалар"
  ],
  "no scores yet": [
    "пока нет оценок",
    "әзірге бағалар жоқ"
  ],
  "unfinished attempts": [
    "незавершённых попыток",
    "аяқталмаған талпыныстар"
  ],
  "0 attempts": [
    "0 попыток",
    "0 талпыныс"
  ],
  "0 RECORDS": [
    "0 ЗАПИСЕЙ",
    "0 ЖАЗБА"
  ],
  "Search attempts…": [
    "Поиск по попыткам…",
    "Талпыныстарды іздеу…"
  ],
  "Search attempts": [
    "Поиск попыток",
    "Талпыныстарды іздеу"
  ],
  "Sort attempts": [
    "Сортировка попыток",
    "Талпыныстарды сұрыптау"
  ],
  "Newest first": [
    "Сначала новые",
    "Алдымен жаңалары"
  ],
  "Highest score": [
    "Сначала высокий балл",
    "Алдымен жоғары ұпай"
  ],
  "Lowest score": [
    "Сначала низкий балл",
    "Алдымен төмен ұпай"
  ],
  "Delete attempt for {title}": [
    "Удалить попытку: {title}",
    "Талпынысты жою: {title}"
  ],
  "Delete this attempt? Progress and achievements will be recalculated. This does not restore a daily check.": [
    "Удалить попытку? Прогресс и достижения пересчитаются. Дневная попытка не восстановится.",
    "Талпыныс жойылсын ба? Нәтижелер мен жетістіктер қайта есептеледі. Күндік тексеру қайтарылмайды."
  ],
  "Attempt deleted. Your progress has been recalculated.": [
    "Попытка удалена. Прогресс пересчитан.",
    "Талпыныс жойылды. Нәтижелер қайта есептелді."
  ],
  "No matching attempts. Choose an exercise or reset your search.": [
    "Подходящих попыток нет. Выберите задачу или сбросьте поиск.",
    "Сәйкес талпыныстар жоқ. Тапсырма таңдаңыз немесе іздеуді тазалаңыз."
  ],
  "Log in to see your saved attempts.": [
    "Войдите, чтобы увидеть сохранённые попытки.",
    "Сақталған талпыныстарды көру үшін кіріңіз."
  ],
  "No revision suggestions yet.": [
    "Пока нет рекомендаций.",
    "Әзірге ұсыныстар жоқ."
  ],
  "Display name": [
    "Отображаемое имя",
    "Көрсетілетін аты"
  ],
  "Save profile": [
    "Сохранить профиль",
    "Профильді сақтау"
  ],
  "Your profile changes are saved.": [
    "Изменения профиля сохранены.",
    "Профиль өзгерістері сақталды."
  ],
  "Log in to save your profile and use 10 free AI checks per 24 hours.": [
    "Войдите, чтобы сохранить профиль и получать 10 бесплатных ИИ-проверок за 24 часа.",
    "Профильді сақтау және 24 сағатта 10 тегін ЖИ тексеруін пайдалану үшін кіріңіз."
  ],
  "{email} · {interest} · {plan}": [
    "{email} · {interest} · {plan}",
    "{email} · {interest} · {plan}"
  ],
  "Free plan": [
    "Бесплатный тариф",
    "Тегін тариф"
  ],
  "Pro test plan": [
    "Тестовый тариф Pro",
    "Pro сынақ тарифі"
  ],
  "Choose an exercise, write a prompt and use the feedback to improve.": [
    "Выберите задачу, напишите промпт и улучшите его по рекомендациям.",
    "Тапсырма таңдаңыз, промпт жазыңыз және ұсыныстар бойынша жақсартыңыз."
  ],
  "Tasks solved": [
    "Решено задач",
    "Шешілген тапсырмалар"
  ],
  "Average score": [
    "Средний балл",
    "Орташа ұпай"
  ],
  "Progress points": [
    "Баллы прогресса",
    "Прогресс ұпайлары"
  ],
  "Achievements": [
    "Достижения",
    "Жетістіктер"
  ],
  "{count} of 3 achievements unlocked. A completed exercise means a saved AI check, regardless of score.": [
    "Получено достижений: {count} из 3. Задача завершена после сохранённой ИИ-проверки, независимо от балла.",
    "3 жетістіктің {count} ашылды. Ұпайына қарамастан, сақталған ЖИ тексеруі тапсырманы аяқтайды."
  ],
  "Recent attempts": [
    "Последние попытки",
    "Соңғы талпыныстар"
  ],
  "View all": [
    "Посмотреть всё",
    "Барлығын көру"
  ],
  "No attempts yet.": [
    "Пока нет попыток.",
    "Әзірге талпыныстар жоқ."
  ],
  "Your plan": [
    "Ваш тариф",
    "Сіздің тарифіңіз"
  ],
  "Choose how you practise. All exercises and the same six-criterion AI feedback are included in both plans.": [
    "Выберите режим практики. Все задачи и одинаковая ИИ-оценка по шести критериям доступны на обоих тарифах.",
    "Жаттығу тәсілін таңдаңыз. Екі тарифте де барлық тапсырмалар мен алты өлшем бойынша бірдей ЖИ бағалауы бар."
  ],
  "10 successful AI checks per 24-hour period": [
    "10 успешных ИИ-проверок за 24 часа",
    "24 сағатта 10 сәтті ЖИ тексеруі"
  ],
  "Period starts with your first successful check": [
    "Период начинается с первой успешной проверки",
    "Кезең алғашқы сәтті тексеруден басталады"
  ],
  "All 16 exercises, saved history and progress": [
    "Все 16 задач, история и прогресс",
    "Барлық 16 тапсырма, тарих және нәтижелер"
  ],
  "No daily limit on AI checks": [
    "ИИ-проверки без дневного лимита",
    "ЖИ тексерулеріне күндік шектеу жоқ"
  ],
  "30 days of test access; no automatic renewal": [
    "30 дней тестового доступа без автопродления",
    "Автоматты ұзартусыз 30 күндік сынақ қолжетімділігі"
  ],
  "Same exercises and grading as Free": [
    "Те же задачи и оценка, что на Free",
    "Free тарифіндегідей тапсырмалар мен бағалау"
  ],
  "Create a free account": [
    "Создать бесплатный аккаунт",
    "Тегін аккаунт ашу"
  ],
  "Return to Free": [
    "Вернуться на Free",
    "Free тарифіне оралу"
  ],
  "End test Pro now? Your history remains. Free usage continues in the same 24-hour period; ending Pro does not reset the counter.": [
    "Завершить тестовый Pro сейчас? История сохранится. Free продолжит текущий 24-часовой период; счётчик не сбросится.",
    "Pro сынағын қазір аяқтау керек пе? Тарих сақталады. Free сол 24 сағаттық кезеңді жалғастырады; санауыш қалпына келмейді."
  ],
  "Test Pro ended. Your Free plan is active.": [
    "Тестовый Pro завершён. Действует тариф Free.",
    "Pro сынағы аяқталды. Free тарифі қосылды."
  ],
  "{usage} · reference {reference}": [
    "{usage} · номер {reference}",
    "{usage} · нөмірі {reference}"
  ],
  "Pro · 30 days · no daily check limit": [
    "Pro · 30 дней · без дневного лимита проверок",
    "Pro · 30 күн · тексерулерге күндік шектеу жоқ"
  ],
  "Total due today: 0. No payment method is required.": [
    "К оплате сегодня: 0. Платёжные данные не нужны.",
    "Бүгінгі төлем: 0. Төлем деректері қажет емес."
  ],
  "This is a test activation. No money is charged, and the plan does not renew automatically.": [
    "Это тестовая активация. Деньги не списываются, тариф не продлевается автоматически.",
    "Бұл сынақ іске қосу. Ақша алынбайды және тариф автоматты түрде ұзартылмайды."
  ],
  "Activate test Pro": [
    "Активировать тестовый Pro",
    "Pro сынағын қосу"
  ],
  "Confirm the test subscription before continuing.": [
    "Подтвердите условия тестовой подписки.",
    "Жалғастыру үшін сынақ жазылымының шарттарын растаңыз."
  ],
  "Create a free account for 10 AI checks per 24 hours.": [
    "Создайте бесплатный аккаунт: 10 ИИ-проверок за 24 часа.",
    "Тегін аккаунт ашыңыз: 24 сағатта 10 ЖИ тексеруі."
  ],
  "Pro · unlimited daily checks · active until {date}": [
    "Pro · проверки без дневного лимита · действует до {date}",
    "Pro · күндік шектеусіз тексерулер · {date} дейін белсенді"
  ],
  "Free · {remaining} of 10 checks left · resets {date}": [
    "Free · осталось {remaining} из 10 проверок · обновление {date}",
    "Free · 10 тексерудің {remaining} қалды · жаңаруы {date}"
  ],
  "Free · {remaining} of 10 checks left · your 24-hour period starts with your first check": [
    "Free · осталось {remaining} из 10 проверок · период 24 часа начнётся с первой проверки",
    "Free · 10 тексерудің {remaining} қалды · 24 сағаттық кезең алғашқы тексеруден басталады"
  ],
  "Your next practice session": [
    "Следующая практика",
    "Келесі жаттығу"
  ],
  "Continue: {title}": [
    "Продолжить: {title}",
    "Жалғастыру: {title}"
  ],
  "Try: {title}": [
    "Попробовать: {title}",
    "Байқап көру: {title}"
  ],
  "Compare Free & Pro": [
    "Сравнить Free и Pro",
    "Free және Pro салыстыру"
  ],
  "Manage Pro": [
    "Управление Pro",
    "Pro басқару"
  ],
  "Newcomer": [
    "Новичок",
    "Жаңадан бастаушы"
  ],
  "Practitioner": [
    "Практик",
    "Тәжірибелі"
  ],
  "Master": [
    "Мастер",
    "Шебер"
  ],
  "Grandmaster": [
    "Грандмастер",
    "Гроссмейстер"
  ],
  "{points} pts": [
    "{points} балла",
    "{points} ұпай"
  ],
  "{points} points to {tier}": [
    "До уровня «{tier}»: {points} балла",
    "«{tier}» деңгейіне дейін: {points} ұпай"
  ],
  "No checked exercises yet. Open the catalog to start.": [
    "Проверенных задач пока нет. Начните с каталога.",
    "Әзірге тексерілген тапсырмалар жоқ. Каталогтан бастаңыз."
  ],
  "Exercise not found": [
    "Задача не найдена",
    "Тапсырма табылмады"
  ],
  "This exercise link is invalid. Choose one from the catalog.": [
    "Некорректная ссылка на задачу. Выберите задачу в каталоге.",
    "Тапсырма сілтемесі дұрыс емес. Каталогтан тапсырма таңдаңыз."
  ],
  "Browse exercises": [
    "Открыть каталог",
    "Каталогты ашу"
  ],
  "No extra requirements.": [
    "Дополнительных требований нет.",
    "Қосымша талаптар жоқ."
  ],
  "Evaluator: {model}": [
    "Модель оценки: {model}",
    "Бағалау моделі: {model}"
  ],
  "Write your instruction for “{title}”…": [
    "Напишите инструкцию для задачи «{title}»…",
    "«{title}» тапсырмасына нұсқау жазыңыз…"
  ],
  "Draft saved in this browser. Log in to save it to your account.": [
    "Черновик сохранён в браузере. Войдите, чтобы сохранить его в аккаунте.",
    "Нобай браузерде сақталды. Оны аккаунтқа сақтау үшін кіріңіз."
  ],
  "Draft is only in this tab; browser storage is unavailable.": [
    "Черновик хранится только в этой вкладке: хранилище браузера недоступно.",
    "Нобай тек осы қойындыда: браузер қоймасы қолжетімсіз."
  ],
  "Draft saved to your account.": [
    "Черновик сохранён в аккаунте.",
    "Нобай аккаунтқа сақталды."
  ],
  "Draft kept in this browser.": [
    "Черновик сохранён в браузере.",
    "Нобай браузерде сақталды."
  ],
  "Draft remains only in this tab.": [
    "Черновик остаётся только в этой вкладке.",
    "Нобай тек осы қойындыда қалады."
  ],
  "{saveState} {error}": [
    "{saveState} {error}",
    "{saveState} {error}"
  ],
  "≈{count} (rough estimate)": [
    "≈{count} (приблизительно)",
    "≈{count} (шамамен)"
  ],
  "Checking…": [
    "Проверяем…",
    "Тексерілуде…"
  ],
  "Log in to check": [
    "Войти для проверки",
    "Тексеру үшін кіру"
  ],
  "Daily limit reached": [
    "Дневной лимит исчерпан",
    "Күндік шектеу таусылды"
  ],
  "AI evaluation · {model} · {date}. The prompt was evaluated; its output was not executed.": [
    "ИИ-оценка · {model} · {date}. Оценена инструкция; её результат не генерировался.",
    "ЖИ бағалауы · {model} · {date}. Нұсқау бағаланды; оның нәтижесі орындалған жоқ."
  ],
  "Draft changed. Check it to get an updated evaluation.": [
    "Черновик изменён. Запустите проверку для новой оценки.",
    "Нобай өзгерді. Жаңа баға алу үшін тексеріңіз."
  ],
  "Draft saved in this browser; syncing…": [
    "Черновик сохранён в браузере; синхронизация…",
    "Нобай браузерде сақталды; синхрондалуда…"
  ],
  "Draft changed; saving…": [
    "Черновик изменён; сохранение…",
    "Нобай өзгерді; сақталуда…"
  ],
  "Draft cleared. Previous attempts remain in your history.": [
    "Черновик очищен. Предыдущие попытки остались в истории.",
    "Нобай тазартылды. Алдыңғы талпыныстар тарихта қалды."
  ],
  "Log in or create an account to use your 10 free checks.": [
    "Войдите или создайте аккаунт, чтобы использовать 10 бесплатных проверок.",
    "10 тегін тексеруді пайдалану үшін кіріңіз немесе аккаунт ашыңыз."
  ],
  "Log in and return to this task": [
    "Войти и вернуться к задаче",
    "Кіру және тапсырмаға оралу"
  ],
  "No new result. Your draft is preserved.": [
    "Нового результата нет. Черновик сохранён.",
    "Жаңа нәтиже жоқ. Нобай сақталды."
  ],
  "Revise your prompt, then check it again. Each successful new check uses one attempt.": [
    "Улучшите промпт и проверьте снова. Каждая успешная новая проверка расходует одну попытку.",
    "Промптты жақсартып, қайта тексеріңіз. Әр сәтті жаңа тексеру бір талпынысты жұмсайды."
  ],
  "This attempt is unavailable. It may have been deleted, or belong to another account.": [
    "Попытка недоступна. Возможно, она удалена или принадлежит другому аккаунту.",
    "Талпыныс қолжетімсіз. Ол жойылған немесе басқа аккаунтқа тиесілі болуы мүмкін."
  ],
  "DOCUMENTATION": [
    "ДОКУМЕНТАЦИЯ",
    "ҚҰЖАТТАМА"
  ],
  "EVALUATION SYSTEM": [
    "СИСТЕМА ОЦЕНКИ",
    "БАҒАЛАУ ЖҮЙЕСІ"
  ],
  "How Evaluation Works": [
    "Как работает оценка",
    "Бағалау қалай жұмыс істейді"
  ],
  "Understand what happens after submission, how criteria become a score, and where to find feedback.": [
    "Узнайте, что происходит после отправки, как складывается оценка и где найти рекомендации.",
    "Жібергеннен кейін не болатынын, баға қалай есептелетінін және ұсыныстарды қайдан табуға болатынын біліңіз."
  ],
  "Evaluation": [
    "Оценка",
    "Бағалау"
  ],
  "On this page": [
    "На этой странице",
    "Осы бетте"
  ],
  "Evaluation process": [
    "Процесс оценки",
    "Бағалау барысы"
  ],
  "Scoring criteria": [
    "Критерии оценки",
    "Бағалау өлшемдері"
  ],
  "Glossary": [
    "Словарь",
    "Сөздік"
  ],
  "Prompt example": [
    "Пример промпта",
    "Промпт мысалы"
  ],
  "FAQ": [
    "Частые вопросы",
    "Жиі қойылатын сұрақтар"
  ],
  "Feedback": [
    "Обратная связь",
    "Кері байланыс"
  ],
  "SUPPORT": [
    "ПОДДЕРЖКА",
    "ҚОЛДАУ"
  ],
  "Use the message form to describe a task question and review what to do next.": [
    "Опишите вопрос по заданию в форме и ознакомьтесь с дальнейшими шагами.",
    "Тапсырмаға қатысты сұрағыңызды нысанда жазып, келесі қадамдарды қараңыз."
  ],
  "Go to feedback form": [
    "Перейти к форме обратной связи",
    "Кері байланыс нысанына өту"
  ],
  "01 / PROCESS": [
    "01 / ПРОЦЕСС",
    "01 / БАРЫСЫ"
  ],
  "AFTER SUBMISSION": [
    "ПОСЛЕ ОТПРАВКИ",
    "ЖІБЕРГЕННЕН КЕЙІН"
  ],
  "A complete attempt has a prompt, six criterion scores, a weighted total, and concrete revision advice.": [
    "Каждая проверка сохраняет промпт, оценки по шести критериям, итоговый балл и конкретные рекомендации.",
    "Әр тексеруде промпт, алты өлшем бойынша баға, қорытынды ұпай және нақты ұсыныстар сақталады."
  ],
  "Draft": [
    "Черновик",
    "Жоба"
  ],
  "Read the task and enter a prompt in the workspace.": [
    "Прочитайте задание и введите промпт в рабочем поле.",
    "Тапсырманы оқып, жұмыс өрісіне промпт енгізіңіз."
  ],
  "Review": [
    "Проверка",
    "Тексеру"
  ],
  "Check role, format, length, examples, tone, and clarity.": [
    "Проверьте роль, формат, объём, примеры, тон и ясность.",
    "Рөлді, пішімді, көлемді, мысалдарды, мәнерді және түсініктілікті тексеріңіз."
  ],
  "Rate each criterion from 0 to 10 against the task requirements.": [
    "Каждый критерий оценивается от 0 до 10 с учётом требований задания.",
    "Әр өлшем тапсырма талаптарына сай 0-ден 10-ға дейін бағаланады."
  ],
  "Weight": [
    "Вес",
    "Салмақ"
  ],
  "Multiply each criterion score by its fixed rubric weight.": [
    "Умножьте оценку каждого критерия на его установленный вес.",
    "Әр өлшемнің бағасын оның белгіленген салмағына көбейтіңіз."
  ],
  "Total": [
    "Итог",
    "Қорытынды"
  ],
  "Add the weighted scores. The weights sum to 1.00, so the final score is out of 10.": [
    "Сложите взвешенные оценки. Сумма весов равна 1,00, поэтому максимум — 10 баллов.",
    "Салмақталған бағаларды қосыңыз. Салмақтар қосындысы 1,00 болғандықтан, ең жоғары баға — 10 ұпай."
  ],
  "Revise": [
    "Доработка",
    "Жетілдіру"
  ],
  "Read the criterion feedback, improve your prompt, and compare your next attempt.": [
    "Прочитайте рекомендации, улучшите промпт и сравните результат следующей попытки.",
    "Ұсыныстарды оқып, промптты жақсартыңыз және келесі талпыныстың нәтижесін салыстырыңыз."
  ],
  "02 / RUBRIC": [
    "02 / КРИТЕРИИ",
    "02 / ӨЛШЕМДЕР"
  ],
  "WEIGHTED": [
    "С УЧЁТОМ ВЕСОВ",
    "САЛМАҚТАЛҒАН"
  ],
  "Every exercise uses six criteria, each scored from 0 to 10. The weighted average produces the final score out of 10.": [
    "В каждом задании шесть критериев с оценкой от 0 до 10. Взвешенное среднее даёт итоговый балл из 10.",
    "Әр тапсырмада 0-ден 10-ға дейін бағаланатын алты өлшем бар. Салмақталған орташа мән 10 ұпайлық қорытынды бағаны береді."
  ],
  "Evaluation rubric showing each criterion, what it checks, and example values.": [
    "Таблица критериев оценки, их назначения и примеров.",
    "Бағалау өлшемдері, олардың мақсаты және мысалдары көрсетілген кесте."
  ],
  "Criterion": [
    "Критерий",
    "Өлшем"
  ],
  "What it checks": [
    "Что проверяется",
    "Не тексеріледі"
  ],
  "Example (good)": [
    "Хороший пример",
    "Жақсы мысал"
  ],
  "Role defined": [
    "Определение роли",
    "Рөлді анықтау"
  ],
  "Is there an explicit role for the model?": [
    "Указана ли явная роль модели?",
    "Модельдің рөлі нақты көрсетілген бе?"
  ],
  "Output format": [
    "Формат ответа",
    "Жауап пішімі"
  ],
  "Is the response format specified?": [
    "Задан ли формат ответа?",
    "Жауап пішімі көрсетілген бе?"
  ],
  "Constraints": [
    "Ограничения",
    "Шектеулер"
  ],
  "Are length or content limits set?": [
    "Указаны ли ограничения объёма или содержания?",
    "Көлем не мазмұн шектеулері берілген бе?"
  ],
  "Examples": [
    "Примеры",
    "Мысалдар"
  ],
  "Are few-shot examples provided?": [
    "Есть ли примеры желаемого ответа?",
    "Қажетті жауаптың мысалдары бар ма?"
  ],
  "Tone": [
    "Тон",
    "Мәнер"
  ],
  "Is the communication style defined?": [
    "Определён ли стиль общения?",
    "Қарым-қатынас стилі анықталған ба?"
  ],
  "Task clarity": [
    "Ясность задачи",
    "Тапсырманың түсініктілігі"
  ],
  "Is the main task unambiguous?": [
    "Однозначно ли сформулирована задача?",
    "Негізгі тапсырма бірмәнді тұжырымдалған ба?"
  ],
  "Use the same rubric when drafting a prompt, reading its result, and comparing attempts.": [
    "Используйте эти критерии при составлении промпта, разборе результата и сравнении попыток.",
    "Промпт жазғанда, нәтижені талдағанда және талпыныстарды салыстырғанда осы өлшемдерді қолданыңыз."
  ],
  "03 / TERMS": [
    "03 / ТЕРМИНЫ",
    "03 / ТЕРМИНДЕР"
  ],
  "CORE CONCEPTS": [
    "ОСНОВНЫЕ ПОНЯТИЯ",
    "НЕГІЗГІ ҰҒЫМДАР"
  ],
  "Zero-shot": [
    "Без примеров (zero-shot)",
    "Мысалсыз (zero-shot)"
  ],
  "An instruction without examples of the desired response.": [
    "Инструкция без примеров желаемого ответа.",
    "Қажетті жауаптың мысалдары берілмеген нұсқау."
  ],
  "Few-shot": [
    "С примерами (few-shot)",
    "Мысалдармен (few-shot)"
  ],
  "An instruction that includes examples to demonstrate the desired format or style.": [
    "Инструкция с примерами желаемого формата или стиля.",
    "Қажетті пішімді не стильді көрсететін мысалдары бар нұсқау."
  ],
  "CoT": [
    "Пошаговый подход (CoT)",
    "Қадамдық тәсіл (CoT)"
  ],
  "A step-by-step approach to a task. In these exercises, focus on clear instructions and verifiable results.": [
    "Пошаговый подход к задаче. В этих упражнениях важны чёткие инструкции и проверяемые результаты.",
    "Тапсырманы қадаммен орындау тәсілі. Бұл жаттығуларда нақты нұсқаулар мен тексерілетін нәтижелерге назар аударыңыз."
  ],
  "Temperature": [
    "Температура",
    "Температура"
  ],
  "A model setting that changes output variability. It is separate from the six criteria used to score a prompt.": [
    "Настройка модели, влияющая на разнообразие ответов. Она не входит в шесть критериев оценки промпта.",
    "Жауаптардың алуан түрлілігіне әсер ететін модель параметрі. Ол промптты бағалайтын алты өлшемге кірмейді."
  ],
  "System prompt": [
    "Системный промпт",
    "Жүйелік промпт"
  ],
  "An instruction that sets the role, tone, and constraints for an AI conversation.": [
    "Инструкция, задающая роль, тон и ограничения диалога с ИИ.",
    "ЖИ-мен сөйлесудің рөлін, мәнерін және шектеулерін белгілейтін нұсқау."
  ],
  "04 / EXAMPLE": [
    "04 / ПРИМЕР",
    "04 / МЫСАЛ"
  ],
  "WORKED EXAMPLE": [
    "РАЗБОР ПРИМЕРА",
    "МЫСАЛДЫ ТАЛДАУ"
  ],
  "A quality prompt for “Sales data summarization”:": [
    "Пример хорошего промпта для сводки продаж:",
    "Сатылымдар қорытындысына арналған жақсы промпт мысалы:"
  ],
  "6 CRITERIA": [
    "6 КРИТЕРИЕВ",
    "6 ӨЛШЕМ"
  ],
  "This example includes a role, a clear task, an output format, a constraint, a tone, and examples — covering all six criteria in the rubric.": [
    "Здесь указаны роль, ясная задача, формат, ограничение, тон и примеры — все шесть критериев.",
    "Бұл мысалда рөл, нақты тапсырма, пішім, шектеу, мәнер және мысалдар — барлық алты өлшем қамтылған."
  ],
  "Worked calculation using illustrative criterion scores, not an AI verdict.": [
    "Пример расчёта с условными оценками критериев; это не результат проверки ИИ.",
    "Өлшемдердің шартты бағаларымен есептеу мысалы; бұл ЖИ тексеруінің нәтижесі емес."
  ],
  "Weighted": [
    "Взвешенная оценка",
    "Салмақталған баға"
  ],
  "Role": [
    "Роль",
    "Рөл"
  ],
  "Format": [
    "Формат",
    "Пішім"
  ],
  "Length": [
    "Объём",
    "Көлем"
  ],
  "Clarity": [
    "Ясность",
    "Түсініктілік"
  ],
  "Final": [
    "Итог",
    "Қорытынды"
  ],
  "05 / FAQ": [
    "05 / ВОПРОСЫ",
    "05 / СҰРАҚТАР"
  ],
  "Frequently asked": [
    "Частые вопросы",
    "Жиі қойылатын сұрақтар"
  ],
  "COMMON QUESTIONS": [
    "ПОПУЛЯРНЫЕ ВОПРОСЫ",
    "КӨП ҚОЙЫЛАТЫН СҰРАҚТАР"
  ],
  "Can I improve a prompt more than once?": [
    "Можно ли улучшать промпт несколько раз?",
    "Промптты бірнеше рет жақсартуға бола ма?"
  ],
  "Do I need a particular AI model?": [
    "Нужна ли определённая модель ИИ?",
    "Белгілі бір ЖИ моделі қажет пе?"
  ],
  "No. The exercises teach instruction structure and can be drafted without calling an AI service.": [
    "Нет. Задания учат структуре инструкций: черновик можно составить без обращения к ИИ.",
    "Жоқ. Тапсырмалар нұсқау құрылымын үйретеді, сондықтан жобаны ЖИ қызметін шақырмай-ақ жазуға болады."
  ],
  "How are progress points calculated?": [
    "Как считаются баллы прогресса?",
    "Прогресс ұпайлары қалай есептеледі?"
  ],
  "Keep the best score for each exercise and add those scores. A later, lower-scoring attempt does not remove points.": [
    "Складываются лучшие оценки по каждому заданию. Более низкий результат новой попытки не уменьшает прогресс.",
    "Әр тапсырманың ең жоғары бағалары қосылады. Кейінгі талпыныстың төмен бағасы ұпайларды азайтпайды."
  ],
  "06 / SUPPORT": [
    "06 / ПОДДЕРЖКА",
    "06 / ҚОЛДАУ"
  ],
  "Still have questions?": [
    "Остались вопросы?",
    "Сұрақтарыңыз қалды ма?"
  ],
  "MESSAGE SUMMARY": [
    "СВОДКА СООБЩЕНИЯ",
    "ХАБАРЛАМА ҚОРЫТЫНДЫСЫ"
  ],
  "Describe the task and what you need clarified. The message outcome area contains a summary and the next step; you can continue practising on your own.": [
    "Опишите задание и свой вопрос. После отправки появятся сводка сообщения и следующий шаг; практику можно продолжать самостоятельно.",
    "Тапсырма мен сұрағыңызды сипаттаңыз. Жібергеннен кейін хабарлама қорытындысы мен келесі қадам көрсетіледі; жаттығуды өз бетіңізше жалғастыра аласыз."
  ],
  "Review your message summary here, then return to the guide or choose another exercise. Completing an exercise never depends on a reply.": [
    "Проверьте сводку сообщения, затем вернитесь к справке или выберите задание. Для выполнения задания ответ не требуется.",
    "Хабарлама қорытындысын қарап, анықтамаға оралыңыз не басқа тапсырма таңдаңыз. Тапсырманы орындау үшін жауап күтудің қажеті жоқ."
  ],
  "Community guidelines": [
    "Правила сообщества",
    "Қауымдастық ережелері"
  ],
  "Write your own prompts and explain your choices.": [
    "Пишите собственные промпты и объясняйте свои решения.",
    "Өз промпттарыңызды жазып, шешімдеріңізді түсіндіріңіз."
  ],
  "Use the rubric to review the instruction, not the person who wrote it.": [
    "Оценивайте по критериям саму инструкцию, а не её автора.",
    "Өлшемдер бойынша авторды емес, нұсқаудың өзін бағалаңыз."
  ],
  "Keep prompts respectful and relevant to the exercise.": [
    "Пишите уважительно и по теме задания.",
    "Сыпайы жазыңыз және тапсырма тақырыбынан ауытқымаңыз."
  ],
  "Use the supplied practice data. Do not include private personal or confidential information.": [
    "Используйте учебные данные. Не добавляйте личную или конфиденциальную информацию.",
    "Берілген оқу деректерін қолданыңыз. Жеке не құпия ақпаратты қоспаңыз."
  ],
  "Verify any AI output before relying on it.": [
    "Проверяйте ответы ИИ, прежде чем на них полагаться.",
    "ЖИ жауаптарына сүйенбес бұрын оларды тексеріңіз."
  ],
  "Privacy and form data": [
    "Конфиденциальность и данные форм",
    "Құпиялық және нысан деректері"
  ],
  "How evaluation works sections": [
    "Разделы руководства по оценке",
    "Бағалау нұсқаулығының бөлімдері"
  ],
  "16 original prompt exercises": [
    "16 авторских заданий по промптам",
    "Промпт бойынша 16 авторлық тапсырма"
  ],
  "Master the Art of": [
    "Освойте искусство",
    "Өнерін меңгеріңіз:"
  ],
  "Prompt Engineering": [
    "промпт-инжиниринга",
    "промпт-инжиниринг"
  ],
  "Practice writing clear instructions through exercises in copywriting, data analysis, code generation, and more. Build a record of your own attempts and learn from each result.": [
    "Учитесь писать точные инструкции в заданиях по копирайтингу, анализу данных, генерации кода и другим направлениям. Сохраняйте попытки и учитесь на результатах.",
    "Копирайтинг, деректерді талдау, код жасау және басқа бағыттардағы тапсырмалар арқылы нақты нұсқау жазуды үйреніңіз. Талпыныстарыңызды сақтап, әр нәтижеден сабақ алыңыз."
  ],
  "Start Training": [
    "Начать практику",
    "Жаттығуды бастау"
  ],
  "View Tasks": [
    "Посмотреть задания",
    "Тапсырмаларды қарау"
  ],
  "Exercises": [
    "Задания",
    "Тапсырмалар"
  ],
  "Skill areas": [
    "Направления",
    "Бағыттар"
  ],
  "You are": [
    "Ваша роль —",
    "Сіздің рөліңіз —"
  ],
  "a senior data analyst.": [
    "старший аналитик данных.",
    "аға деректер талдаушысы."
  ],
  "Task:": [
    "Задача:",
    "Тапсырма:"
  ],
  "Summarize the Q3 sales data.": [
    "Подведите итоги продаж за III квартал.",
    "III тоқсан сатылымдарын қорытындылаңыз."
  ],
  "Format:": [
    "Формат:",
    "Пішім:"
  ],
  "numbered list, 5 items max.": [
    "нумерованный список, не более 5 пунктов.",
    "ең көбі 5 тармақтан тұратын нөмірленген тізім."
  ],
  "Tone:": [
    "Тон:",
    "Мәнер:"
  ],
  "professional, concise.": [
    "профессиональный, лаконичный.",
    "кәсіби, ықшам."
  ],
  "Constraint:": [
    "Ограничение:",
    "Шектеу:"
  ],
  "no more than 120 words.": [
    "не более 120 слов.",
    "120 сөзден аспасын."
  ],
  "Example:": [
    "Пример:",
    "Мысал:"
  ],
  "1. Q3 revenue totals $435,000.": [
    "1. Выручка за III квартал — 435 000 долларов.",
    "1. III тоқсандағы кіріс — 435 000 доллар."
  ],
  "2. August has the highest revenue: $158,000.": [
    "2. Самая высокая выручка в августе: 158 000 долларов.",
    "2. Ең жоғары кіріс тамызда: 158 000 доллар."
  ],
  "Worked example: 8.6 / 10": [
    "Пример расчёта: 8,6 / 10",
    "Есептеу мысалы: 8,6 / 10"
  ],
  "Weighted score": [
    "Взвешенная оценка",
    "Салмақталған баға"
  ],
  "Why Choose": [
    "Почему выбирают",
    "Неліктен"
  ],
  "Prompt Forge?": [
    "Prompt Forge?",
    "Prompt Forge таңдайды?"
  ],
  "A purpose-built training ground for prompt engineers — not another generic coding challenge platform.": [
    "Платформа для практики промпт-инжиниринга с заданиями и понятной системой оценки.",
    "Тапсырмалары мен түсінікті бағалау жүйесі бар промпт-инжиниринг жаттығу платформасы."
  ],
  "Practical Tasks": [
    "Практические задания",
    "Практикалық тапсырмалар"
  ],
  "Real-world prompt challenges across copywriting, data analysis, code generation, and system design. No toy examples.": [
    "Задачи из копирайтинга, анализа данных, генерации кода и проектирования систем, приближённые к реальной работе.",
    "Копирайтинг, деректерді талдау, код жасау және жүйелерді жобалау бойынша нақты жұмысқа жақын тапсырмалар."
  ],
  "Browse tasks →": [
    "К заданиям →",
    "Тапсырмаларға →"
  ],
  "Atomic Scoring": [
    "Оценка по критериям",
    "Өлшемдер бойынша бағалау"
  ],
  "Use six independently scored criteria with explicit weights. Review the worked example to see how the final score is calculated.": [
    "Шесть независимых критериев с фиксированными весами. Посмотрите пример расчёта итоговой оценки.",
    "Салмақтары белгіленген алты тәуелсіз өлшем. Қорытынды бағаның есептеу мысалын қараңыз."
  ],
  "See how it works →": [
    "Как это работает →",
    "Қалай жұмыс істейді →"
  ],
  "Instant Feedback": [
    "Быстрые рекомендации",
    "Жедел ұсыныстар"
  ],
  "Review the score breakdown and a concrete suggestion for each criterion before improving your next prompt.": [
    "Изучите оценки и конкретные советы по каждому критерию перед следующей попыткой.",
    "Келесі талпыныс алдында әр өлшемнің бағасы мен нақты ұсыныстарын қараңыз."
  ],
  "View solutions →": [
    "Мои решения →",
    "Шешімдерім →"
  ],
  "Personal Progress": [
    "Личный прогресс",
    "Жеке прогресс"
  ],
  "Track your best attempt for each exercise and use the skill-tier thresholds to set your next goal.": [
    "Следите за лучшими результатами и ставьте новые цели по уровням мастерства.",
    "Ең жақсы нәтижелеріңізді бақылап, шеберлік деңгейлері бойынша жаңа мақсаттар қойыңыз."
  ],
  "View progress →": [
    "Мой прогресс →",
    "Прогресім →"
  ],
  "How It": [
    "Как это",
    "Қалай"
  ],
  "Works": [
    "работает",
    "жұмыс істейді"
  ],
  "The rubric scores six parts of a prompt independently. Their weights sum to 1.00; the worked example below shows the calculation.": [
    "Шесть частей промпта оцениваются независимо. Сумма весов — 1,00; ниже приведён пример расчёта.",
    "Промпттың алты бөлігі тәуелсіз бағаланады. Салмақтар қосындысы — 1,00; төменде есептеу мысалы берілген."
  ],
  "Submit": [
    "Отправка",
    "Жіберу"
  ],
  "Write your prompt and hit \"Check\"": [
    "Напишите промпт и нажмите «Проверить»",
    "Промпт жазып, «Тексеру» түймесін басыңыз"
  ],
  "Parse": [
    "Разбор",
    "Талдау"
  ],
  "System extracts role, format, constraints": [
    "Система определяет роль, формат и ограничения",
    "Жүйе рөлді, пішімді және шектеулерді анықтайды"
  ],
  "Evaluate": [
    "Оценка",
    "Бағалау"
  ],
  "Each criterion scored 0–10 independently": [
    "Каждый критерий оценивается от 0 до 10",
    "Әр өлшем 0-ден 10-ға дейін бағаланады"
  ],
  "Result": [
    "Результат",
    "Нәтиже"
  ],
  "Weighted score + personalized tips": [
    "Итоговый балл и рекомендации",
    "Қорытынды ұпай және жеке ұсыныстар"
  ],
  "Example evaluation": [
    "Пример оценки",
    "Бағалау мысалы"
  ],
  "Format specified": [
    "Задание формата",
    "Пішімді көрсету"
  ],
  "Length constraint": [
    "Ограничение объёма",
    "Көлем шектеуі"
  ],
  "Examples given": [
    "Наличие примеров",
    "Мысалдардың болуы"
  ],
  "Tone specified": [
    "Задание тона",
    "Мәнерді көрсету"
  ],
  "Ready to Forge Your Skills?": [
    "Готовы развивать свои навыки?",
    "Дағдыларыңызды дамытуға дайынсыз ба?"
  ],
  "Choose an exercise, study its requirements, and draft your first prompt.": [
    "Выберите задание, изучите требования и напишите первый промпт.",
    "Тапсырманы таңдап, талаптарын оқыңыз және алғашқы промптыңызды жазыңыз."
  ],
  "Get Started — It's Free": [
    "Начать бесплатно",
    "Тегін бастау"
  ],
  "PromptForge — AI prompt engineering training platform. Practice, compete, and master prompt crafting.": [
    "PromptForge — платформа для практики промпт-инжиниринга. Учитесь создавать эффективные промпты.",
    "PromptForge — промпт-инжиниринг жаттығу платформасы. Тиімді промпт жазуды үйреніңіз."
  ],
  "PERSONAL PRACTICE / BEST ATTEMPTS": [
    "ЛИЧНАЯ ПРАКТИКА / ЛУЧШИЕ ПОПЫТКИ",
    "ЖЕКЕ ЖАТТЫҒУ / ҮЗДІК ТАЛПЫНЫСТАР"
  ],
  "Your practice leaderboard orders your own best attempts by score. Progress points are the sum of the best score for each exercise; the same total appears in your profile.": [
    "Ваш рейтинг содержит лучшие попытки по убыванию оценки. Баллы прогресса — сумма лучших оценок каждого задания; этот же итог показан в профиле.",
    "Рейтингіңіз ең жақсы талпыныстарды бағасы бойынша реттейді. Прогресс ұпайлары — әр тапсырманың ең жоғары бағаларының қосындысы; ол профильде де көрсетіледі."
  ],
  "Your record": [
    "Ваш результат",
    "Нәтижеңіз"
  ],
  "YOUR PROGRESS": [
    "ВАШ ПРОГРЕСС",
    "ПРОГРЕСІҢІЗ"
  ],
  "0 pts": [
    "0 баллов",
    "0 ұпай"
  ],
  "50 points to Practitioner tier": [
    "50 баллов до уровня «Практик»",
    "«Практик» деңгейіне дейін 50 ұпай"
  ],
  "Improve rank": [
    "Повысить уровень",
    "Деңгейді көтеру"
  ],
  "RANKINGS": [
    "РЕЙТИНГ",
    "РЕЙТИНГ"
  ],
  "Your best attempts": [
    "Ваши лучшие попытки",
    "Үздік талпыныстарыңыз"
  ],
  "Your exercises ranked by best score. No other participants are required.": [
    "Ваши задания упорядочены по лучшей оценке. Участие других пользователей не требуется.",
    "Тапсырмаларыңыз ең жоғары бағасы бойынша реттелген. Басқа қатысушылар қажет емес."
  ],
  "No scored attempts yet.": [
    "Оценённых попыток пока нет.",
    "Бағаланған талпыныстар әлі жоқ."
  ],
  "Choose an exercise": [
    "Выбрать задание",
    "Тапсырма таңдау"
  ],
  "RANK SYSTEM": [
    "СИСТЕМА УРОВНЕЙ",
    "ДЕҢГЕЙЛЕР ЖҮЙЕСІ"
  ],
  "Skill tiers": [
    "Уровни мастерства",
    "Шеберлік деңгейлері"
  ],
  "Based on total points": [
    "По сумме баллов",
    "Жалпы ұпай бойынша"
  ],
  "NEXT STEP": [
    "СЛЕДУЮЩИЙ ШАГ",
    "КЕЛЕСІ ҚАДАМ"
  ],
  "Start your first exercise or improve a previous best score to work toward the next tier.": [
    "Начните первое задание или улучшите прежний результат, чтобы приблизиться к следующему уровню.",
    "Алғашқы тапсырманы бастаңыз немесе келесі деңгейге жету үшін бұрынғы нәтижеңізді жақсартыңыз."
  ],
  "Browse Tasks": [
    "Открыть задания",
    "Тапсырмаларды ашу"
  ],
  "Current skill tier": [
    "Текущий уровень мастерства",
    "Қазіргі шеберлік деңгейі"
  ],
  "Distance to Practitioner tier": [
    "Баллы до уровня «Практик»",
    "«Практик» деңгейіне дейінгі ұпай"
  ],
  "Progress to Practitioner tier": [
    "Прогресс до уровня «Практик»",
    "«Практик» деңгейіне ілгерілеу"
  ],
  "After sign-in, return to your profile or your saved attempts. Sign-in feedback appears in this area.": [
    "После входа перейдите в профиль или к сохранённым попыткам. Результат входа появится здесь.",
    "Кіргеннен кейін профиліңізге не сақталған талпыныстарға өтіңіз. Кіру нәтижесі осында көрсетіледі."
  ],
  "PERSONAL WORKSPACE": [
    "ЛИЧНОЕ ПРОСТРАНСТВО",
    "ЖЕКЕ ЖҰМЫС ОРНЫ"
  ],
  "PROGRESS": [
    "ПРОГРЕСС",
    "ПРОГРЕСС"
  ],
  "Review previous attempts, spot recurring weaknesses, and return to active tasks without losing context.": [
    "Просматривайте прошлые попытки, находите слабые места и возвращайтесь к заданиям с сохранением контекста.",
    "Бұрынғы талпыныстарды қарап, әлсіз тұстарды анықтаңыз және контексті жоғалтпай тапсырмаларға оралыңыз."
  ],
  "CURRENT FOCUS": [
    "НАД ЧЕМ ПОРАБОТАТЬ",
    "НАЗАР АУДАРАТЫН ТҰСТАР"
  ],
  "Improvement queue": [
    "Что улучшить",
    "Нені жақсарту керек"
  ],
  "No revision suggestions yet. Review the": [
    "Рекомендаций пока нет. Изучите",
    "Ұсыныстар әлі жоқ. Алғашқы талпынысқа дейін"
  ],
  "six criteria": [
    "шесть критериев",
    "алты өлшемді"
  ],
  "before your first attempt.": [
    "перед первой попыткой.",
    "қарап шығыңыз."
  ],
  "SOLUTION HISTORY": [
    "ИСТОРИЯ РЕШЕНИЙ",
    "ШЕШІМДЕР ТАРИХЫ"
  ],
  "History of prompt submissions with task name, date, score, and status.": [
    "История промптов с названием задания, датой, оценкой и статусом.",
    "Тапсырма атауы, күні, бағасы және күйі көрсетілген промпттар тарихы."
  ],
  "No attempts recorded yet.": [
    "Сохранённых попыток пока нет.",
    "Сақталған талпыныстар әлі жоқ."
  ],
  "Choose your first exercise": [
    "Выбрать первое задание",
    "Алғашқы тапсырманы таңдау"
  ],
  "Build your practice record one exercise at a time.": [
    "Пополняйте историю практики, выполняя задания.",
    "Тапсырмаларды орындап, жаттығу тарихын толықтырыңыз."
  ],
  "Solve Another Task": [
    "Решить ещё одно задание",
    "Тағы бір тапсырма орындау"
  ],
  "Solution overview": [
    "Обзор решений",
    "Шешімдерге шолу"
  ],
  "Your account details and practice record belong here.": [
    "Здесь хранятся данные аккаунта и история практики.",
    "Аккаунт деректері мен жаттығу тарихы осында сақталады."
  ],
  "Choose an exercise to start. Review the six criteria, draft a prompt, and use the feedback to improve your next attempt.": [
    "Выберите задание, изучите шесть критериев, напишите промпт и улучшите следующую попытку по рекомендациям.",
    "Тапсырманы таңдап, алты өлшемді қараңыз, промпт жазыңыз және ұсыныстар бойынша келесі талпынысты жақсартыңыз."
  ],
  "Practice checklist": [
    "План практики",
    "Жаттығу жоспары"
  ],
  "Read the input and the requirements.": [
    "Прочитайте исходные данные и требования.",
    "Бастапқы деректер мен талаптарды оқыңыз."
  ],
  "Draft a prompt with an explicit role and format.": [
    "Напишите промпт с явной ролью и форматом.",
    "Рөлі мен пішімі нақты көрсетілген промпт жазыңыз."
  ],
  "Check all six criteria.": [
    "Проверьте все шесть критериев.",
    "Барлық алты өлшемді тексеріңіз."
  ],
  "Revise the weakest part.": [
    "Доработайте самое слабое место.",
    "Ең әлсіз тұсты жетілдіріңіз."
  ],
  "Badge Guide": [
    "Как получить достижения",
    "Жетістіктерді алу жолы"
  ],
  "Complete one exercise.": [
    "Выполните одно задание.",
    "Бір тапсырманы орындаңыз."
  ],
  "Complete a copywriting exercise.": [
    "Выполните задание по копирайтингу.",
    "Копирайтинг тапсырмасын орындаңыз."
  ],
  "Score at least 9 on a data analysis exercise.": [
    "Наберите минимум 9 баллов в анализе данных.",
    "Деректерді талдау тапсырмасынан кемінде 9 ұпай жинаңыз."
  ],
  "Reach 50 progress points.": [
    "Наберите 50 баллов прогресса.",
    "50 прогресс ұпайын жинаңыз."
  ],
  "MILESTONES": [
    "ДОСТИЖЕНИЯ",
    "ЖЕТІСТІКТЕР"
  ],
  "Complete your first exercise": [
    "Выполните первое задание",
    "Алғашқы тапсырманы орындаңыз"
  ],
  "Complete a copywriting exercise": [
    "Выполните задание по копирайтингу",
    "Копирайтинг тапсырмасын орындаңыз"
  ],
  "Score at least 9 in data analysis": [
    "Наберите минимум 9 баллов в анализе данных",
    "Деректерді талдаудан кемінде 9 ұпай жинаңыз"
  ],
  "No achievements unlocked yet. Your first completed exercise unlocks First Steps.": [
    "Достижений пока нет. Первое выполненное задание откроет «Первые шаги».",
    "Жетістіктер әлі жоқ. Алғашқы орындалған тапсырма «Алғашқы қадамдар» жетістігін ашады."
  ],
  "LATEST": [
    "ПОСЛЕДНИЕ ПОПЫТКИ",
    "СОҢҒЫ ТАЛПЫНЫСТАР"
  ],
  "No attempts yet. Choose an exercise to begin your practice record.": [
    "Попыток пока нет. Выберите задание, чтобы начать практику.",
    "Талпыныстар әлі жоқ. Жаттығуды бастау үшін тапсырма таңдаңыз."
  ],
  "RECOMMENDATIONS": [
    "РЕКОМЕНДАЦИИ",
    "ҰСЫНЫСТАР"
  ],
  "Suggestions for Improvement": [
    "Советы по улучшению",
    "Жақсарту ұсыныстары"
  ],
  "Structure": [
    "Структура",
    "Құрылым"
  ],
  "Add an explicit role definition at the start of every prompt": [
    "Начинайте каждый промпт с явного указания роли",
    "Әр промпттың басында рөлді нақты көрсетіңіз"
  ],
  "Use few-shot examples for classification tasks": [
    "Добавляйте примеры в задачи классификации",
    "Жіктеу тапсырмаларына мысалдар қосыңыз"
  ],
  "Always specify the output format (": [
    "Всегда указывайте формат ответа (",
    "Әрқашан жауап пішімін көрсетіңіз ("
  ],
  ", Markdown, plain text)": [
    ", Markdown, обычный текст)",
    ", Markdown, жай мәтін)"
  ],
  "Start with a beginner exercise and move to a higher difficulty when you can explain each criterion.": [
    "Начните с простого задания и повышайте сложность, когда сможете объяснить каждый критерий.",
    "Жеңіл тапсырмадан бастап, әр өлшемді түсіндіре алған кезде күрделі деңгейге өтіңіз."
  ],
  "Prompt Forge profile mark": [
    "Знак профиля Prompt Forge",
    "Prompt Forge профиль белгісі"
  ],
  "After registration, review your profile and choose an exercise. Your confirmation and any field errors appear in this area.": [
    "После регистрации откройте профиль и выберите задание. Подтверждение и ошибки формы появятся здесь.",
    "Тіркелгеннен кейін профильді қарап, тапсырма таңдаңыз. Растау мен нысан қателері осында көрсетіледі."
  ],
  "Write a prompt that instructs an AI to summarize quarterly sales data into a concise numbered list.": [
    "Напишите промпт, по которому ИИ составит краткую нумерованную сводку продаж за квартал.",
    "ЖИ тоқсандық сатылымдардың қысқа нөмірленген қорытындысын жасайтындай промпт жазыңыз."
  ],
  "criteria": [
    "критериев",
    "өлшем"
  ],
  "character limit": [
    "лимит символов",
    "таңба шектеуі"
  ],
  "your attempts": [
    "ваши попытки",
    "талпыныстарыңыз"
  ],
  "You are given a": [
    "Вам предоставлены",
    "Сізге берілген:"
  ],
  "quarterly sales dataset": [
    "данные продаж за квартал",
    "тоқсандық сатылым деректері"
  ],
  "for a SaaS company. Your goal is to write a prompt that will make an AI produce a": [
    "SaaS-компании. Напишите промпт, по которому ИИ составит",
    "SaaS компаниясы үшін. ЖИ-ға арналған промпт жазыңыз. Ол негізгі нәтижелердің"
  ],
  "brief summary": [
    "краткую сводку",
    "қысқаша қорытындысын"
  ],
  "of the key findings.": [
    "ключевых результатов.",
    "жасауға тиіс."
  ],
  "Requirements": [
    "Требования",
    "Талаптар"
  ],
  "Define the AI's": [
    "Определите",
    "ЖИ-дың"
  ],
  "role": [
    "роль ИИ",
    "рөлін анықтаңыз"
  ],
  "(e.g., data analyst)": [
    "(например, аналитик данных)",
    "(мысалы, деректер талдаушысы)"
  ],
  "Specify the": [
    "Укажите",
    "Көрсетіңіз:"
  ],
  "output format": [
    "формат ответа",
    "жауап пішімі"
  ],
  "— numbered list, max 5 items": [
    "— нумерованный список, максимум 5 пунктов",
    "— ең көбі 5 тармақтан тұратын нөмірленген тізім"
  ],
  "Set a": [
    "Задайте",
    "Белгілеңіз:"
  ],
  "length constraint": [
    "ограничение объёма",
    "көлем шектеуі"
  ],
  "— no more than 150 words": [
    "— не более 150 слов",
    "— 150 сөзден аспасын"
  ],
  "Include a": [
    "Укажите",
    "Белгілеңіз:"
  ],
  "tone": [
    "тон",
    "мәнер"
  ],
  "— professional, concise": [
    "— профессиональный, лаконичный",
    "— кәсіби, ықшам"
  ],
  "Provide at least": [
    "Добавьте хотя бы",
    "Кемінде"
  ],
  "1 example": [
    "1 пример",
    "1 мысал"
  ],
  "of desired output": [
    "желаемого ответа",
    "қажетті жауапқа"
  ],
  "Practice dataset written for this exercise; amounts are in USD.": [
    "Учебные данные для этого задания; суммы в долларах США.",
    "Осы тапсырмаға арналған оқу деректері; сомалар АҚШ долларымен берілген."
  ],
  "Your prompt": [
    "Ваш промпт",
    "Сіздің промптыңыз"
  ],
  "Limit:": [
    "Лимит:",
    "Шектеу:"
  ],
  "characters": [
    "символов",
    "таңба"
  ],
  "Estimated tokens:": [
    "Примерное число токенов:",
    "Токендердің шамамен саны:"
  ],
  "Read hint": [
    "Открыть подсказку",
    "Кеңесті ашу"
  ],
  "Use the requirements and the rubric to draft your prompt. A checked attempt includes a weighted score, criterion feedback, and a suggestion for your next revision.": [
    "Напишите промпт по требованиям и критериям. После проверки вы получите итоговый балл, разбор критериев и совет для следующей попытки.",
    "Талаптар мен өлшемдерге сүйеніп промпт жазыңыз. Тексеруден кейін қорытынды баға, өлшемдер талдауы және келесі талпынысқа ұсыныс беріледі."
  ],
  "Hint": [
    "Подсказка",
    "Кеңес"
  ],
  "Use": [
    "Используйте",
    "Қолданыңыз:"
  ],
  "ROLE → TASK → FORMAT → CONSTRAINT → EXAMPLE": [
    "РОЛЬ → ЗАДАЧА → ФОРМАТ → ОГРАНИЧЕНИЕ → ПРИМЕР",
    "РӨЛ → ТАПСЫРМА → ПІШІМ → ШЕКТЕУ → МЫСАЛ"
  ],
  ": assign a data analyst role, ask for a Q3 summary, request up to five numbered items and 150 words, set a professional tone, and include one example item based on the supplied data.": [
    ": задайте роль аналитика данных, попросите сводку за III квартал объёмом до пяти пунктов и 150 слов, укажите профессиональный тон и приведите пример на основе исходных данных.",
    ": деректер талдаушысы рөлін беріп, III тоқсан қорытындысын бес тармақ пен 150 сөзден асырмай жазуды сұраңыз, кәсіби мәнерді көрсетіп, бастапқы деректерге негізделген мысал қосыңыз."
  ],
  "Evaluation Criteria": [
    "Критерии оценки",
    "Бағалау өлшемдері"
  ],
  "Your prompt will be scored on these criteria. Each is weighted and scored 0–10.": [
    "Промпт оценивается по этим критериям. У каждого свой вес и оценка от 0 до 10.",
    "Промпт осы өлшемдер бойынша бағаланады. Әрқайсының өз салмағы және 0-ден 10-ға дейінгі бағасы бар."
  ],
  "weight: 0.20": [
    "вес: 0,20",
    "салмақ: 0,20"
  ],
  "Does the prompt assign a clear role to the AI?": [
    "Задаёт ли промпт понятную роль ИИ?",
    "Промпт ЖИ-ға нақты рөл бере ме?"
  ],
  "weight: 0.25": [
    "вес: 0,25",
    "салмақ: 0,25"
  ],
  "Is the output format clearly defined?": [
    "Чётко ли определён формат ответа?",
    "Жауап пішімі нақты анықталған ба?"
  ],
  "weight: 0.15": [
    "вес: 0,15",
    "салмақ: 0,15"
  ],
  "Does the prompt include at least one example?": [
    "Есть ли хотя бы один пример?",
    "Кемінде бір мысал бар ма?"
  ],
  "weight: 0.10": [
    "вес: 0,10",
    "салмақ: 0,10"
  ],
  "Is the task unambiguous and well-structured?": [
    "Однозначна ли задача и хорошо ли она структурирована?",
    "Тапсырма бірмәнді және дұрыс құрылымдалған ба?"
  ],
  "Your result": [
    "Ваш результат",
    "Нәтижеңіз"
  ],
  "No prompt checked yet. Review the": [
    "Проверок пока нет. Посмотрите",
    "Тексерулер әлі жоқ. Бағалардың толық жіктелімін көру үшін"
  ],
  "worked example": [
    "пример расчёта",
    "есептеу мысалын"
  ],
  " to see the complete score breakdown.": [
    ", чтобы увидеть подробный разбор оценки.",
    "қараңыз."
  ],
  "to see the complete score breakdown.": [
    ", чтобы увидеть подробный разбор оценки.",
    "қараңыз."
  ],
  "Checking the six criteria…": [
    "Проверяем шесть критериев…",
    "Алты өлшем тексерілуде…"
  ],
  "Results": [
    "Результаты",
    "Нәтижелер"
  ],
  "Final Score": [
    "Итоговый балл",
    "Қорытынды ұпай"
  ],
  "Personalized Tips": [
    "Рекомендации",
    "Жеке ұсыныстар"
  ],
  "Breadcrumb": [
    "Навигационная цепочка",
    "Шарлау жолы"
  ],
  "You are a data analyst. Summarize the table in up to five numbered items…": [
    "Вы — аналитик данных. Составьте сводку таблицы максимум в пяти нумерованных пунктах…",
    "Сіз — деректер талдаушысысыз. Кестені ең көбі бес нөмірленген тармақпен қорытындылаңыз…"
  ],
  "Choose an exercise to open the task workspace. Each card uses the same workspace layout.": [
    "Выберите задание, чтобы открыть рабочую область. Для всех заданий используется общий интерфейс.",
    "Жұмыс орнын ашу үшін тапсырма таңдаңыз. Барлық тапсырманың интерфейсі бірдей."
  ],
  "Enter a name between 2 and 80 characters.": [
    "Введите имя длиной от 2 до 80 символов.",
    "Ұзындығы 2–80 таңба болатын есімді енгізіңіз."
  ],
  "Enter a valid email address.": [
    "Введите корректный email.",
    "Дұрыс email енгізіңіз."
  ],
  "Use 8–128 characters, uppercase, lowercase, a digit and a special character.": [
    "Используйте 8–128 символов, заглавную и строчную буквы, цифру и специальный символ.",
    "8–128 таңба, бас және кіші әріп, сан және арнайы таңба қолданыңыз."
  ],
  "Choose a skill area.": [
    "Выберите направление.",
    "Бағытты таңдаңыз."
  ],
  "Choose your experience level.": [
    "Выберите свой уровень опыта.",
    "Тәжірибе деңгейіңізді таңдаңыз."
  ],
  "Enter a valid phone number or leave it empty.": [
    "Введите корректный номер телефона или оставьте поле пустым.",
    "Дұрыс телефон нөмірін енгізіңіз немесе өрісті бос қалдырыңыз."
  ],
  "Use a whole number from 0 to 100.": [
    "Введите целое число от 0 до 100.",
    "0-ден 100-ге дейінгі бүтін санды енгізіңіз."
  ],
  "Choose a valid birth date between 1900 and today.": [
    "Укажите дату рождения между 1900 годом и сегодняшним днём.",
    "1900 жылдан бүгінге дейінгі дұрыс туған күнді көрсетіңіз."
  ],
  "Keep your introduction under 1,000 characters.": [
    "В описании должно быть не более 1000 символов.",
    "Өзіңіз туралы мәтін 1000 таңбадан аспасын."
  ],
  "Accept the community guidelines.": [
    "Примите правила сообщества.",
    "Қауымдастық ережелерін қабылдаңыз."
  ],
  "Accept the privacy notice.": [
    "Примите условия конфиденциальности.",
    "Құпиялық шарттарын қабылдаңыз."
  ],
  "Enter your password.": [
    "Введите пароль.",
    "Құпиясөзді енгізіңіз."
  ],
  "Use 2–80 characters.": [
    "Используйте от 2 до 80 символов.",
    "2–80 таңба қолданыңыз."
  ],
  "Use at most 1,000 characters.": [
    "Используйте не более 1000 символов.",
    "1000 таңбадан асырмаңыз."
  ],
  "Use a whole number from 1 to 5.": [
    "Введите целое число от 1 до 5.",
    "1-ден 5-ке дейінгі бүтін санды енгізіңіз."
  ],
  "Choose a subject.": [
    "Выберите тему.",
    "Тақырыпты таңдаңыз."
  ],
  "Write 20–2,000 characters.": [
    "Напишите от 20 до 2000 символов.",
    "20–2000 таңба жазыңыз."
  ],
  "Describe the bug and steps to reproduce it in at least 50 characters.": [
    "Опишите ошибку и шаги её воспроизведения минимум в 50 символах.",
    "Қате мен оны қайталау қадамдарын кемінде 50 таңбамен сипаттаңыз."
  ],
  "Choose today or a future date.": [
    "Выберите сегодняшнюю или будущую дату.",
    "Бүгінгі не болашақ күнді таңдаңыз."
  ],
  "Enter a nonblank prompt within the character limit.": [
    "Введите непустой промпт в пределах лимита символов.",
    "Таңба шегінен аспайтын бос емес промпт енгізіңіз."
  ],
  "Send JSON data.": [
    "Отправьте данные в формате JSON.",
    "Деректерді JSON пішімінде жіберіңіз."
  ],
  "The request is too large.": [
    "Запрос слишком большой.",
    "Сұрау тым үлкен."
  ],
  "Invalid JSON request.": [
    "Некорректный JSON-запрос.",
    "JSON сұрауы дұрыс емес."
  ],
  "Log in to save your progress and use your daily checks.": [
    "Войдите, чтобы сохранять прогресс и использовать ежедневные проверки.",
    "Прогресті сақтау және күнделікті тексерулерді пайдалану үшін кіріңіз."
  ],
  "Too many account requests. Please try again in 10 minutes.": [
    "Слишком много запросов к аккаунту. Повторите через 10 минут.",
    "Аккаунтқа сұраулар тым көп. 10 минуттан кейін қайталаңыз."
  ],
  "Method not allowed.": [
    "Метод запроса не поддерживается.",
    "Сұрау әдісіне рұқсат жоқ."
  ],
  "Page not found.": [
    "Страница не найдена.",
    "Бет табылмады."
  ],
  "Cross-site requests are not allowed.": [
    "Запросы с других сайтов запрещены.",
    "Басқа сайттардан сұрау жіберуге рұқсат жоқ."
  ],
  "Please correct the highlighted fields.": [
    "Исправьте выделенные поля.",
    "Белгіленген өрістерді түзетіңіз."
  ],
  "An account already uses this email.": [
    "Аккаунт с этим email уже существует.",
    "Бұл email бар аккаунтқа тиесілі."
  ],
  "This email is already registered. Try logging in.": [
    "Этот email уже зарегистрирован. Попробуйте войти.",
    "Бұл email тіркелген. Кіріп көріңіз."
  ],
  "This email is already registered.": [
    "Этот email уже зарегистрирован.",
    "Бұл email тіркелген."
  ],
  "Try logging in instead.": [
    "Попробуйте войти в существующий аккаунт.",
    "Бар аккаунтқа кіріп көріңіз."
  ],
  "Enter a valid email and password.": [
    "Введите корректный email и пароль.",
    "Дұрыс email мен құпиясөзді енгізіңіз."
  ],
  "Email or password is incorrect.": [
    "Неверный email или пароль.",
    "Email немесе құпиясөз дұрыс емес."
  ],
  "Use a name of 2–80 characters and a bio up to 1,000 characters.": [
    "Имя должно содержать 2–80 символов, а описание — не более 1000.",
    "Есім 2–80 таңбадан тұруы, ал сипаттама 1000 таңбадан аспауы керек."
  ],
  "Invalid task or draft length.": [
    "Некорректное задание или длина черновика.",
    "Тапсырма немесе жоба ұзындығы дұрыс емес."
  ],
  "Choose a valid task and enter a nonblank prompt within its character limit.": [
    "Выберите задание и введите непустой промпт в пределах лимита символов.",
    "Тапсырманы таңдап, таңба шегінен аспайтын бос емес промпт енгізіңіз."
  ],
  "Invalid request reference.": [
    "Некорректный идентификатор запроса.",
    "Сұрау идентификаторы дұрыс емес."
  ],
  "Choose a supported feedback language.": [
    "Выберите поддерживаемый язык ответа.",
    "Қолдау көрсетілетін жауап тілін таңдаңыз."
  ],
  "This request reference belongs to another prompt. Start a new check.": [
    "Этот идентификатор относится к другому промпту. Начните новую проверку.",
    "Бұл идентификатор басқа промптқа тиесілі. Жаңа тексеруді бастаңыз."
  ],
  "AI checks are not configured yet. The site owner must set OPENAI_API_KEY on the server. Your check was not charged.": [
    "Проверки ИИ пока не настроены. Владелец сайта должен задать OPENAI_API_KEY на сервере. Попытка не списана.",
    "ЖИ тексерулері әлі бапталмаған. Сайт иесі серверде OPENAI_API_KEY орнатуы керек. Талпыныс жұмсалмады."
  ],
  "The AI check failed. Try again; your check was not charged.": [
    "Проверка ИИ не удалась. Повторите попытку; лимит не израсходован.",
    "ЖИ тексеруі сәтсіз болды. Қайталап көріңіз; лимит жұмсалмады."
  ],
  "Attempt not found.": [
    "Попытка не найдена.",
    "Талпыныс табылмады."
  ],
  "Confirm that this is a test subscription with no payment.": [
    "Подтвердите, что это тестовая подписка без оплаты.",
    "Бұл төлемсіз сынақ жазылымы екенін растаңыз."
  ],
  "Test subscription management is disabled.": [
    "Управление тестовой подпиской отключено.",
    "Сынақ жазылымын басқару өшірілген."
  ],
  "Enter your name (2–80 characters).": [
    "Введите имя (2–80 символов).",
    "Есіміңізді енгізіңіз (2–80 таңба)."
  ],
  "Enter a valid email.": [
    "Введите корректный email.",
    "Дұрыс email енгізіңіз."
  ],
  "Choose priority 1–5.": [
    "Выберите приоритет от 1 до 5.",
    "1-ден 5-ке дейінгі басымдықты таңдаңыз."
  ],
  "For a bug report, describe what happened and how to reproduce it (at least 50 characters).": [
    "Для сообщения об ошибке опишите проблему и шаги её воспроизведения (минимум 50 символов).",
    "Қате туралы хабарламада мәселені және оны қайталау қадамдарын сипаттаңыз (кемінде 50 таңба)."
  ],
  "Endpoint not found.": [
    "Адрес API не найден.",
    "API мекенжайы табылмады."
  ],
  "A check is already running. Please wait for its result.": [
    "Проверка уже выполняется. Дождитесь результата.",
    "Тексеру жүріп жатыр. Нәтижесін күтіңіз."
  ],
  "You have used all 10 checks in this 24-hour period. Wait for the reset or try Pro.": [
    "Вы использовали все 10 проверок за этот 24-часовой период. Дождитесь обновления лимита или попробуйте Pro.",
    "Осы 24 сағаттағы барлық 10 тексеруді қолдандыңыз. Лимиттің жаңаруын күтіңіз не Pro қолданып көріңіз."
  ],
  "The request failed.": [
    "Не удалось выполнить запрос.",
    "Сұрауды орындау мүмкін болмады."
  ],
  "The AI service is temporarily rate-limited or its API budget is exhausted. Try again later; your check was not charged.": [
    "У сервиса ИИ временный лимит запросов или исчерпан API-бюджет. Повторите позже; попытка не списана.",
    "ЖИ қызметінің сұрау лимиті шектелген немесе API бюджеті таусылған. Кейін қайталаңыз; талпыныс жұмсалмады."
  ],
  "The AI service key is not accepted. Ask the site owner to check its configuration; your check was not charged.": [
    "Сервис ИИ не принял ключ. Попросите владельца сайта проверить настройки; попытка не списана.",
    "ЖИ қызметі кілтті қабылдамады. Сайт иесінен баптауларды тексеруді сұраңыз; талпыныс жұмсалмады."
  ],
  "The AI service is unavailable. Try again later; your check was not charged.": [
    "Сервис ИИ недоступен. Повторите позже; попытка не списана.",
    "ЖИ қызметі қолжетімсіз. Кейін қайталаңыз; талпыныс жұмсалмады."
  ],
  "The AI check did not finish. Try again; your check was not charged.": [
    "Проверка ИИ не завершилась. Повторите; попытка не списана.",
    "ЖИ тексеруі аяқталмады. Қайталаңыз; талпыныс жұмсалмады."
  ],
  "The AI declined to evaluate this prompt. Revise it and try again; your check was not charged.": [
    "ИИ отказался оценивать промпт. Измените его и повторите; попытка не списана.",
    "ЖИ бұл промптты бағалаудан бас тартты. Өзгертіп, қайталаңыз; талпыныс жұмсалмады."
  ],
  "The AI returned an unreadable evaluation. Try again; your check was not charged.": [
    "ИИ вернул некорректный результат. Повторите; попытка не списана.",
    "ЖИ дұрыс емес нәтиже қайтарды. Қайталаңыз; талпыныс жұмсалмады."
  ],
  "Server error. Please try again.": [
    "Ошибка сервера. Повторите попытку.",
    "Сервер қатесі. Қайталап көріңіз."
  ],
  "An unexpected server error occurred. Please try again.": [
    "Непредвиденная ошибка сервера. Повторите попытку.",
    "Күтпеген сервер қатесі. Қайталап көріңіз."
  ],
  "You are a data analyst": [
    "Вы — аналитик данных",
    "Сіз — деректер талдаушысысыз"
  ],
  "Format: numbered list": [
    "Формат: нумерованный список",
    "Пішім: нөмірленген тізім"
  ],
  "no more than 150 words": [
    "не более 150 слов",
    "150 сөзден аспасын"
  ],
  "Example: 1. Revenue grew 12%": [
    "Пример: 1. Выручка выросла на 12%",
    "Мысал: 1. Кіріс 12%-ға өсті"
  ],
  "Tone: professional, no filler": [
    "Тон: профессиональный, без лишних слов",
    "Мәнер: кәсіби, артық сөзсіз"
  ],
  "Write a brief summary": [
    "Напишите краткую сводку",
    "Қысқаша қорытынды жазыңыз"
  ],
  "Attempt history": [
    "История попыток",
    "Талпыныстар тарихы"
  ],
  "Start exercise": [
    "Начать задание",
    "Тапсырманы бастау"
  ],
  "Continue": [
    "Продолжить",
    "Жалғастыру"
  ],
  "Next: {title}": [
    "Далее: {title}",
    "Келесі: {title}"
  ],
  "Choose another exercise": [
    "Выбрать другое задание",
    "Басқа тапсырма таңдау"
  ],
  "Source data": [
    "Исходные данные",
    "Бастапқы деректер"
  ],
  "Check prompt": [
    "Проверить промпт",
    "Промптты тексеру"
  ],
  "Revise prompt": [
    "Доработать промпт",
    "Промптты жетілдіру"
  ],
  "Saved attempts": [
    "Сохранённые попытки",
    "Сақталған талпыныстар"
  ],
  "No saved attempts. Submit a prompt to save the first result.": [
    "Сохранённых попыток нет. Отправьте промпт на проверку, чтобы сохранить первый результат.",
    "Сақталған талпыныстар жоқ. Алғашқы нәтижені сақтау үшін промптты тексеруге жіберіңіз."
  ],
  "AI role": [
    "Роль ИИ",
    "ЖИ рөлі"
  ],
  "Response format": [
    "Формат ответа",
    "Жауап пішімі"
  ],
  "Response length": [
    "Объём ответа",
    "Жауап көлемі"
  ],
  "Response examples": [
    "Примеры ответа",
    "Жауап мысалдары"
  ],
  "Tone and style": [
    "Тон и стиль",
    "Мәнер мен стиль"
  ],
  "Instruction clarity": [
    "Ясность инструкции",
    "Нұсқаудың түсініктілігі"
  ],
  "Does the prompt limit the response length?": [
    "Задан ли объём ответа?",
    "Жауап көлемі шектелген бе?"
  ],
  "Does the prompt specify the tone and style?": [
    "Указаны ли тон и стиль ответа?",
    "Жауаптың мәнері мен стилі көрсетілген бе?"
  ],
  "Compare plans": [
    "Сравнить тарифы",
    "Тарифтерді салыстыру"
  ],
  "View Pro plan": [
    "Открыть тариф Pro",
    "Pro тарифін көру"
  ],
  "Current plan": [
    "Текущий тариф",
    "Ағымдағы тариф"
  ],
  "Free test access": [
    "Бесплатный тестовый доступ",
    "Тегін сынақ қолжетімділігі"
  ],
  "Set up test Pro": [
    "Подключить тестовый Pro",
    "Сынақ Pro тарифін қосу"
  ],
  "Test Pro subscription": [
    "Тестовая подписка Pro",
    "Pro сынақ жазылымы"
  ],
  "I agree to activate test Pro for 30 days at no charge.": [
    "Согласен подключить тестовый Pro на 30 дней бесплатно.",
    "Сынақ Pro тарифін 30 күнге тегін қосуға келісемін."
  ],
  "Test Pro is active until {date}. Activation ID: {reference}. No payment was taken.": [
    "Тестовый Pro действует до {date}. Номер подключения: {reference}. Деньги не списывались.",
    "Сынақ Pro тарифі {date} дейін белсенді. Қосу нөмірі: {reference}. Ақша алынған жоқ."
  ],
  "Earned": [
    "Получено",
    "Алынды"
  ],
  "Not earned yet": [
    "Пока не получено",
    "Әзірге алынған жоқ"
  ],
  "Edit profile": [
    "Редактировать профиль",
    "Профильді өңдеу"
  ],
  "First attempt": [
    "Первая попытка",
    "Алғашқы талпыныс"
  ],
  "Data analysis": [
    "Анализ данных",
    "Деректерді талдау"
  ],
  "Open attempt": [
    "Открыть попытку",
    "Талпынысты ашу"
  ],
  "Current level": [
    "Текущий уровень",
    "Қазіргі деңгей"
  ],
  "Progress to next level": [
    "Прогресс до следующего уровня",
    "Келесі деңгейге дейінгі ілгерілеу"
  ],
  "Highest level reached.": [
    "Достигнут высший уровень.",
    "Ең жоғары деңгейге жеттіңіз."
  ],
  "Yes. Revise your prompt and compare the feedback for each attempt.": [
    "Да. Доработайте промпт и сравните рекомендации к каждой попытке.",
    "Иә. Промптты жетілдіріп, әр талпыныстың ұсыныстарын салыстырыңыз."
  ],
  "Message saved.": [
    "Сообщение сохранено.",
    "Хабарлама сақталды."
  ],
  "Cannot connect to PromptForge. Check your connection and try again.": [
    "Не удалось подключиться к PromptForge. Проверьте соединение и повторите попытку.",
    "PromptForge қызметіне қосылу мүмкін болмады. Байланысты тексеріп, қайталап көріңіз."
  ],
  "The service is unavailable. Try again later.": [
    "Сервис недоступен. Повторите попытку позже.",
    "Қызмет қолжетімсіз. Кейінірек қайталап көріңіз."
  ],
  "The page could not load. Reload it to try again.": [
    "Не удалось загрузить страницу. Обновите её и повторите попытку.",
    "Бет жүктелмеді. Оны жаңартып, қайталап көріңіз."
  ],
  "Prompt checks are temporarily unavailable.": [
    "Проверка промптов временно недоступна.",
    "Промпттарды тексеру уақытша қолжетімсіз."
  ],
  "Use only the supplied data. Mark missing information explicitly.": [
    "Используйте только предоставленные данные. Отмечайте недостающие сведения.",
    "Тек берілген деректерді пайдаланыңыз. Жетіспейтін ақпаратты белгілеңіз."
  ],
  "Example prompts": [
    "Примеры промптов",
    "Промпт мысалдары"
  ],
  "Sort order": [
    "Порядок сортировки",
    "Сұрыптау реті"
  ],
  "Date of birth": [
    "Дата рождения",
    "Туған күні"
  ],
  "Code generation": [
    "Генерация кода",
    "Код генерациясы"
  ],
  "System design": [
    "Проектирование систем",
    "Жүйелерді жобалау"
  ],
  "Search exercises": [
    "Поиск заданий",
    "Тапсырмаларды іздеу"
  ],
  "Search by title or topic": [
    "Название или тема задания",
    "Тапсырма атауы немесе тақырыбы"
  ],
  "Exercises — PromptForge": [
    "Задания — PromptForge",
    "Тапсырмалар — PromptForge"
  ],
  "Attempt history — PromptForge": [
    "История попыток — PromptForge",
    "Талпыныстар тарихы — PromptForge"
  ],
  "Signed in as {name}.": [
    "Вы вошли как {name}.",
    "{name} ретінде кірдіңіз."
  ],
  "8–128 characters: uppercase and lowercase Latin letters, a digit and a symbol.": [
    "От 8 до 128 символов: заглавные и строчные латинские буквы, цифра и специальный символ.",
    "8–128 таңба: бас және кіші латын әріптері, сан және арнайы таңба."
  ],
  "Uppercase Latin letter": [
    "Заглавная латинская буква",
    "Бас латын әрпі"
  ],
  "Lowercase Latin letter": [
    "Строчная латинская буква",
    "Кіші латын әрпі"
  ],
  "Test Pro is currently unavailable.": [
    "Подключение тестового Pro сейчас недоступно.",
    "Сынақ Pro тарифін қосу қазір қолжетімсіз."
  ],
  "PromptForge stores your profile, saved attempts and feedback messages on its server. Passwords are stored in a protected form. Drafts are saved in your browser and synced to your account when you are logged in. Clearing a form does not delete saved records.": [
    "PromptForge хранит профиль, сохранённые попытки и сообщения обратной связи на своём сервере. Пароли хранятся в защищённом виде. Черновики сохраняются в браузере и синхронизируются с аккаунтом после входа. Очистка формы не удаляет сохранённые записи.",
    "PromptForge профильді, сақталған талпыныстарды және кері байланыс хабарламаларын өз серверінде сақтайды. Құпиясөздер қорғалған түрде сақталады. Нобайлар браузерде сақталып, кіргеннен кейін аккаунтпен синхрондалады. Пішімді тазарту сақталған жазбаларды жоймайды."
  ],
  "When you check a prompt, its text and the exercise brief are sent to OpenAI for evaluation. Do not include personal or confidential information. Feedback messages are saved on the PromptForge server; they do not send an email or request a callback.": [
    "При проверке текст промпта и условия задания отправляются в OpenAI для оценки. Не добавляйте личные или конфиденциальные сведения. Сообщения обратной связи сохраняются на сервере PromptForge; они не отправляют письмо и не заказывают обратный звонок.",
    "Тексеру кезінде промпт мәтіні мен тапсырма шарттары бағалау үшін OpenAI қызметіне жіберіледі. Жеке немесе құпия мәліметтерді қоспаңыз. Кері байланыс хабарламалары PromptForge серверінде сақталады; олар электрондық хат жібермейді және кері қоңырауға өтініш бермейді."
  ],
  "Choose from 16 prompt writing exercises. Filter by topic, difficulty and progress.": [
    "Выберите одно из 16 заданий по составлению промптов. Фильтруйте по теме, сложности и прогрессу.",
    "Промпт жазуға арналған 16 тапсырманың бірін таңдаңыз. Тақырып, күрделілік және ілгерілеу бойынша сүзгілеңіз."
  ],
  "Write a prompt, review AI feedback and compare saved attempts.": [
    "Составьте промпт, изучите разбор ИИ и сравните сохранённые попытки.",
    "Промпт жазыңыз, ЖИ талдауын қарап, сақталған талпыныстарды салыстырыңыз."
  ],
  "Find saved attempts, compare results and revise your prompts.": [
    "Находите сохранённые попытки, сравнивайте результаты и дорабатывайте промпты.",
    "Сақталған талпыныстарды тауып, нәтижелерді салыстырыңыз және промпттарды жетілдіріңіз."
  ],
  "Review course progress, levels and your best exercise results.": [
    "Просматривайте прогресс по курсам, уровни и лучшие результаты заданий.",
    "Курстардағы ілгерілеуді, деңгейлерді және үздік тапсырма нәтижелерін қараңыз."
  ],
  "Log in to access your drafts, attempts and subscription.": [
    "Войдите, чтобы открыть черновики, попытки и настройки подписки.",
    "Нобайларды, талпыныстарды және жазылым баптауларын ашу үшін кіріңіз."
  ],
  "Create an account to save your practice results. Free includes 10 checks per 24 hours.": [
    "Создайте аккаунт, чтобы сохранять результаты. На Free доступно 10 проверок за 24 часа.",
    "Нәтижелерді сақтау үшін аккаунт ашыңыз. Free тарифінде 24 сағатқа 10 тексеру беріледі."
  ],
  "Manage your profile and subscription, and review your practice results.": [
    "Настраивайте профиль и подписку, просматривайте результаты практики.",
    "Профиль мен жазылымды басқарып, жаттығу нәтижелерін қараңыз."
  ],
  "Learn how exercises, scoring and free check limits work in PromptForge.": [
    "Узнайте, как устроены задания, оценка и лимиты бесплатных проверок в PromptForge.",
    "PromptForge тапсырмалары, бағалау және тегін тексеру лимиттері туралы біліңіз."
  ],
  "Attempts: {count}": [
    "Попыток: {count}",
    "Талпыныстар: {count}"
  ],
  "Shown: {count} of {total}": [
    "Показано: {count} из {total}",
    "Көрсетілді: {count} / {total}"
  ]
};

Object.assign(messages, redesignMessages, trainingMessages, usabilityMessages, competitionMessages, avatarMessages, settingsMessages);

for (const task of tasks) {
  for (const field of ['title', 'description']) {
    const translated = ['ru', 'kk'].map(code => taskTranslations[code][task.id][field]);
    messages[task[field]] = translated;
    messages[task[field].trim().replace(/\s+/g, ' ')] = translated;
  }
}
