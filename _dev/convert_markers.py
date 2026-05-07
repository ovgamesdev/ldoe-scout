import json
import numpy as np

# 1. Параметры смещения (в пикселях новой карты)
# Положительное значение сдвигает маркеры вправо/вниз, отрицательное — влево/вверх
OFFSET_X = 35
OFFSET_Y = -70

# 1. Введите ваши опорные точки (известные координаты на обеих картах)
# Формат: [x_old, y_old] -> [x_new, y_new]
anchors = [
    {"old": [11759, 6522],  "new": [31425, 16469]},   # Точка 1 (например, верхний левый угол здания)
    {"old": [3979, 16302], "new": [10056, 41542]},  # Точка 2 (например, край скалы)
    {"old": [23841, 12580], "new": [64109, 32447]}, # Точка 3 (например, развилка дорог)
    {"old": [16097, 23841],"new": [42792, 61340]}  # Точка 4 (опционально, для точности)
]

def calculate_transform(anchors):
    # Подготовка матриц для решения системы уравнений
    A = []
    B_x = []
    B_y = []
    
    for p in anchors:
        A.append([p['old'][0], p['old'][1], 1])
        B_x.append(p['new'][0])
        B_y.append(p['new'][1])
    
    # Решаем методом наименьших квадратов
    coeffs_x, _, _, _ = np.linalg.lstsq(A, B_x, rcond=None)
    coeffs_y, _, _, _ = np.linalg.lstsq(A, B_y, rcond=None)
    
    return coeffs_x, coeffs_y

def apply_transform(x, y, cx, cy):
    new_x = (cx[0] * x + cx[1] * y + cx[2]) + OFFSET_X
    new_y = (cy[0] * x + cy[1] * y + cy[2]) + OFFSET_Y
    return round(new_x), round(new_y)

# Вычисляем коэффициенты
cx, cy = calculate_transform(anchors)

# Пример конвертации маркеров
def convert_json_data(input_file, output_file, mode='markers'):
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if mode == 'markers':
        for m in data:
            m['x'], m['y'] = apply_transform(m['x'], m['y'], cx, cy)
    elif mode == 'zones':
        for zone in data:
            zone['coordinates'] = [
                list(apply_transform(p[0], p[1], cx, cy)) 
                for p in zone['coordinates']
            ]
            
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# Запуск
convert_json_data('tiles/old_greenwood/markers.json', 'tiles/greenwood/markers.json', 'markers')
convert_json_data('tiles/old_greenwood/zones.json', 'tiles/greenwood/zones.json', 'zones')
print("Трансформация по точкам завершена!")