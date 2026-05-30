# Изменяем кодировку вывода на UTF-8, чтобы кириллица в консоли отображалась корректно
$OutputEncoding = [System.Text.Encoding]::UTF8

# 1. Сборка проекта
Write-Host "--- Запуск сборки проекта... ---" -ForegroundColor Cyan
npm run build

# Проверка, создалась ли папка _site
if (-not (Test-Path "_site")) {
    Write-Error "Ошибка: Папка _site не найдена. Сборка не удалась."
    exit 1
}

# Удаляем .git
# Remove-Item -Recurse -Force _site/.git

Write-Host "--- Копирование тайлов в папку _site... ---" -ForegroundColor Cyan
# Если папка tiles в _site уже существует (например, старая ссылка или папка), удаляем её
if (Test-Path "_site\tiles") {
    Remove-Item -Recurse -Force "_site\tiles"
}

# Копируем папку tiles из корня проекта в _site\tiles
Copy-Item -Recurse -Path ".\tiles" -Destination "_site\tiles"

# 2. Переход в папку со сборкой
Write-Host "--- Переход в папку _site... ---" -ForegroundColor Cyan
Set-Location _site

# 3. Инициализация Git, если его еще нет
if (-not (Test-Path ".git")) {
    Write-Host "--- Инициализация Git в папке _site... ---" -ForegroundColor Cyan
    git init
    git remote add origin https://github.com/ovgamesdev/ldoe-scout.git
} else {
    Write-Host "--- Git уже инициализирован. ---" -ForegroundColor Cyan
}

# 4. Подготовка ветки gh-pages
git checkout -B gh-pages

# 5. Коммит и отправка
Write-Host "--- Индексация файлов и создание коммита... ---" -ForegroundColor Cyan
git add .
$currentDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "Deploy build: $currentDate"

Write-Host "--- Слияние изменений (Git Pull)... ---" -ForegroundColor Cyan
git pull origin gh-pages --no-edit --allow-unrelated-histories

# Проверяем, завершился ли pull с ошибкой и создан ли файл MERGE_HEAD (признак конфликта)
if ($LASTEXITCODE -ne 0 -and (Test-Path ".git\MERGE_HEAD")) {
    Write-Host "⚠️ Обнаружены конфликты слияния! Разрешаем в пользу локальной сборки..." -ForegroundColor Yellow
    
    # Выбираем наши локальные файлы (из только что собранного _site)
    git checkout --ours .
    
    # Добавляем исправленные файлы в индекс
    git add .
    
    # Фиксируем разрешение конфликта (разделитель команд — ';')
    git commit -m "Resolve conflicts keeping local files"
    
    Write-Host "✅ Конфликты успешно разрешены." -ForegroundColor Green
} else {
    Write-Host "--- Слияние прошло без конфликтов. ---" -ForegroundColor Green
}

Write-Host "--- Отправка на GitHub (ветка gh-pages)... ---" -ForegroundColor Cyan
git push origin gh-pages # --force

# 6. Возврат в корень проекта
Set-Location ..

# Удаляем физическую папку, чтобы заменить её на ссылку
if (Test-Path "_site\tiles") {
    Remove-Item -Recurse -Force "_site\tiles"
}

# Восстанавливаем вашу исходную символическую ссылку для локальной работы
Write-Host "--- Восстановление локальной символической ссылки... ---" -ForegroundColor Cyan
# Путь внутри ссылки из папки _site должен вести на уровень вверх к реальной папке tiles
New-Item -ItemType SymbolicLink -Path "_site\tiles" -Value "..\tiles" | Out-Null
# New-Item -ItemType SymbolicLink -Path "D:\User\Documents\ruby\ldoe-scout\_site\tiles" -Target "D:\User\Documents\ruby\ldoe-scout\tiles"

Write-Host "--- Деплой успешно завершен! ---" -ForegroundColor Green