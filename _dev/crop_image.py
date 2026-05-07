import os
import subprocess
from pathlib import Path

def process_loot_images(directory, file_type='*.png', target_width=600):
    dir_path = Path(directory)

    # Проверяем существование директории
    if not dir_path.exists():
        print(f"Директория {directory} не найдена.")
        return

    # Список всех .png файлов
    files = list(dir_path.glob(file_type))
    
    if not files:
        print(f"{file_type.replace('*.', '').upper()} файлы в папке отсутствуют.")
        return

    for input_path in files:
        # Формируем путь для выходного файла .webp
        temp_output = input_path.with_name(f"temp_{input_path.name}")

        # Настройки максимального сжатия:
        # -q:v 50: Качество (0-100). 50-75 — золотая середина для мелких деталей.
        # -compression_level 6: Максимальное усилие на поиск лучших алгоритмов сжатия (0-6).
        # -pred 4: Предиктивный фильтр для уменьшения веса.

        if 'chopper' in input_path.name.lower():
            width, height = 759, 574
            left, top = 912, 335
        else:
            # Координаты и размеры
            width, height = 758, 594
            left, top = 954, 128

        # Цепочка фильтров: сначала обрезаем (crop), затем меняем размер (scale)
        # scale=600:-1 автоматически подберет высоту для сохранения пропорций
        filter_chain = f"crop={width}:{height}:{left}:{top},scale={target_width}:-1"
        
        # Команда ffmpeg: crop=w:h:x:y
        command = [
            'ffmpeg',
            '-y',                # Перезаписывать если файл существует
            '-i', input_path,
            '-vf', filter_chain,
            '-c:v', 'libwebp',
            '-q:v', '60',
            '-compression_level', '6',
            '-pred', '4',
            str(temp_output)
        ]

        try:
            # Запускаем процесс
            result = subprocess.run(command, capture_output=True, text=True)
            
            if result.returncode == 0:
                # Если обрезка прошла успешно, удаляем оригинал и переименовываем темп
                input_path.unlink()
                temp_output.rename(input_path)
                print(f"Готово: {input_path.name} -> {temp_output.name} (исходник удален)")
            else:
                print(f"Ошибка в FFmpeg для {input_path.name}: {result.stderr}")
                    
        except Exception as e:
            print(f"Ошибка при обработке {input_path.name}: {e}")

if __name__ == "__main__":
    target_dir = "images/loot"
    process_loot_images(target_dir, '*.png', 600)
    # process_loot_images(target_dir, '*.webp', 600)