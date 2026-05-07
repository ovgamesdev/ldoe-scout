#!/bin/bash

# 1. Сборка проекта
echo "--- Запуск сборки проекта... ---"
npm run build

# Проверка, создалась ли папка _site
if [ ! -d "_site" ]; then
  echo "Ошибка: Папка _site не найдена. Сборка не удалась."
  exit 1
fi

# 2. Переход в папку со сборкой
echo "--- Переход в папку _site... ---"
cd _site

# 3. Инициализация Git, если его еще нет
if [ ! -d ".git" ]; then
  echo "--- Инициализация Git в папке _site... ---"
  git init
  git remote add origin https://github.com/ovgamesdev/ldoe-scout.git
else
  echo "--- Git уже инициализирован. ---"
fi

# 4. Подготовка ветки gh-pages
# -B создает ветку или сбрасывает её, если она существует
git checkout -B gh-pages

# 5. Коммит и отправка
echo "--- Индексация файлов и создание коммита... ---"
git add .
git commit -m "Deploy build: $(date +'%Y-%m-%d %H:%M:%S')"

echo "--- Отправка на GitHub (ветка gh-pages)... ---"
git push origin gh-pages --force

# 6. Возврат в корень проекта
cd ..
echo "--- Деплой успешно завершен! ---"