$OutputEncoding = [System.Text.Encoding]::UTF8

# 1. Очистка и сборка проекта
Write-Host "--- Полная очистка старой сборки... ---" -ForegroundColor Cyan
# Теперь jekyll clean безопасен, так как .git лежит в корне репозитория!
npm run clean

Write-Host "--- Запуск сборки проекта... ---" -ForegroundColor Cyan
npm run build

if (-not (Test-Path "_site")) {
    Write-Error "Ошибка: Папка _site не найдена. Сборка не удалась."
    exit 1
}

# 2. Возвращаем историю Git внутрь папки _site
if (Test-Path ".git-pages") {
    Write-Host "--- Возвращаем Git-историю gh-pages в папку сборки... ---" -ForegroundColor Cyan
    Move-Item -Path ".git-pages" -Destination "_site\.git"
}

# 3. Подготовка тайлов
Write-Host "--- Копирование тайлов в папку _site... ---" -ForegroundColor Cyan
if (Test-Path "_site\tiles") {
    Remove-Item -Recurse -Force "_site\tiles"
}
Copy-Item -Recurse -Path ".\tiles" -Destination "_site\tiles"

# 4. Переход в папку со сборкой и проверка Git
Set-Location _site

if (-not (Test-Path ".git")) {
    Write-Host "--- Первичная инициализация Git в папке _site... ---" -ForegroundColor Cyan
    git init
    git remote add origin https://github.com/ovgamesdev/ldoe-scout.git
}

# 5. Обычный процесс деплоя
git checkout -B gh-pages

Write-Host "--- Индексация файлов и создание коммита... ---" -ForegroundColor Cyan
git add .
$currentDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "Deploy build: $currentDate"

Write-Host "--- Слияние изменений (Git Pull)... ---" -ForegroundColor Cyan
git pull origin gh-pages --no-edit --allow-unrelated-histories

if ($LASTEXITCODE -ne 0 -and (Test-Path ".git\MERGE_HEAD")) {
    Write-Host "⚠️ Конфликты! Разрешаем в пользу локальной сборки..." -ForegroundColor Yellow
    git checkout --ours .
    git add .
    git commit -m "Resolve conflicts keeping local files"
}

Write-Host "--- Отправка на GitHub (ветка gh-pages)... ---" -ForegroundColor Cyan
git push origin gh-pages

# 6. Возврат в корень и спасение папки .git
Set-Location ..

Write-Host "--- Прячем папку .git на верхний уровень... ---" -ForegroundColor Cyan
if (Test-Path ".git-pages") {
    Remove-Item -Recurse -Force ".git-pages"
}
# Перемещаем .git из _site обратно в корень и переименовываем
Move-Item -Path "_site\.git" -Destination ".git-pages"

# 7. Наведение порядка с локальными ссылками
if (Test-Path "_site\tiles") {
    Remove-Item -Recurse -Force "_site\tiles"
}

Write-Host "--- Восстановление локальной символической ссылки... ---" -ForegroundColor Cyan
New-Item -ItemType SymbolicLink -Path "_site\tiles" -Value "..\tiles" | Out-Null

Write-Host "--- Деплой успешно завершен! ---" -ForegroundColor Green