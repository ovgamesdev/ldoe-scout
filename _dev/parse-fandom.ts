import * as cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'
import YAML from 'yaml'

// Список страниц для парсинга
const PAGES = [
    'Crate_with_Oak_Logs', 'Crate_with_Fur', 'Crate_with_Provision_(Autumn)',
    'Crate_with_Provision_(Summer)', 'Crate_with_Provision_(Winter)',
    'Crate_with_Equipment_(Autumn)', 'Crate_with_Equipment_(Summer)',
    'Crate_with_Equipment_(Winter)', 'Crate_with_Wool', 'Crate_with_Copper',
    'Crate_with_Aluminum', 'Crate_with_Thermite', 'Crate_with_Pine_Logs',
    'Crate_with_Stone', 'Crate_with_Iron', 'Crate_with_Hides'
];

// Хелпер для определения корневой директории
const currentDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

// Путь к файлу кэша
const CACHE_FILE = path.join(currentDir, 'fandom_cache.json');
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 час в миллисекундах

function toKey(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
}

async function parsePage(pageName: string) {
    const url = `https://last-day-on-earth-survival.fandom.com/api.php?action=parse&page=${pageName}&format=json&prop=text&redirects=true`;
    
    try {
        const response = await fetch(url);
        const json: any = await response.json();
        
        if (!json.parse?.text) {
            console.warn(`[Предупреждение] Не удалось получить данные для: ${pageName}`);
            return null;
        }

        const $ = cheerio.load(json.parse.text['*']);
        const englishNames: Record<string, string> = {};

        const originalCrateName = json.parse.title.replace(' - Last Day on Earth: Survival Wiki', '');
        const crateKey = toKey(pageName);
        englishNames[crateKey] = originalCrateName;

        const contents: any[] = []; // Теперь тут могут быть и объекты 'single', и 'group'

        $('table.article-table tr').each((_: number, row: any) => {
            const thText = $(row).find('th').text().trim();
            if (thText === 'Contents') {
                $(row).find('td > ul > li').each((_: number, parentLi: any) => {
                    const liClone = $(parentLi).clone();
                    liClone.find('ul').remove();
                    const parentText = liClone.text().trim();
                    
                    const nestedLis = $(parentLi).find('ul li');
                    
                    // ЕСЛИ ЕСТЬ ВЛОЖЕННЫЙ СПИСОК (ГРУППА)
                    if (nestedLis.length > 0) {
                        let poolCount = '';
                        // Если написано "One of the following:"
                        if (parentText.toLowerCase().includes('one of')) {
                            poolCount = '1';
                        } else {
                            // Если написано "0-2 of the following:"
                            const match = parentText.match(/^([\d,\-\s]+)/);
                            poolCount = match?.[1]?.trim() || '';
                        }

                        const groupItems: { item_key: string }[] = [];
                        nestedLis.each((_: number, childLi: any) => {
                            const itemName = $(childLi).find('a').first().text().trim() || $(childLi).text().trim();
                            const itemKey = toKey(itemName);
                            
                            englishNames[itemKey] = itemName;
                            groupItems.push({ item_key: itemKey });
                        });

                        contents.push({
                            type: 'group',
                            pool_count: poolCount,
                            items: groupItems
                        });
                    } 
                    // ЕСЛИ ЭТО ОДИНОЧНЫЙ ПРЕДМЕТ
                    else {
                        let count = '1';
                        const match = parentText.match(/^([\d,\-\s]+)/);
                        if (match && match[1]) {
                            count = match[1].trim();
                        }

                        // Ищем примечания в скобках, например "(Rare)"
                        let noteName: string | undefined = undefined;
                        const noteMatch = parentText.match(/\((.*?)\)/);
                        if (noteMatch && noteMatch[1]) {
                            noteName = noteMatch[1].trim();
                        }

                        // Очищаем имя предмета от цифр и текста в скобках
                        let rawName = parentText.replace(/^[\d,\-\s]+/, '').replace(/\(.*?\)/, '').trim();
                        const itemName = $(parentLi).find('a').first().text().trim() || rawName;
                        const itemKey = toKey(itemName);
                        
                        englishNames[itemKey] = itemName;
                        
                        const singleItem: any = {
                            type: 'single',
                            item_key: itemKey,
                            count: count
                        };

                        if (noteName) {
                            const noteKey = toKey(noteName)
                            singleItem.note_key = noteKey;
                            englishNames[noteKey] = noteName;
                        }
												
                        contents.push(singleItem);
                    }
                });
            }
        });

        return {
            crateKey,
            data: {
                id: crateKey,
                name_key: crateKey,
                contents
            },
            englishNames
        };
    } catch (e) {
        console.error(`Ошибка при обработке страницы ${pageName}:`, e);
        return null;
    }
}

async function main() { 
    // Пути относительно папки _dev
    const tilesDir = path.resolve(currentDir, '..', 'map-data');
    const dataDir = path.resolve(currentDir, '..', '_data');
    
    if (!fs.existsSync(tilesDir)) fs.mkdirSync(tilesDir, { recursive: true });
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

    let results: any[] = [];
    let useCache = false;

    // Проверяем наличие валидного кэша
    if (fs.existsSync(CACHE_FILE)) {
        try {
            const cacheData = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
            const now = Date.now();
            
            if (cacheData.timestamp && (now - cacheData.timestamp < CACHE_TTL_MS)) {
                console.log(`[Кэш] Используются сохраненные данные из кэша (создан ${new Date(cacheData.timestamp).toLocaleTimeString()})`);
                results = cacheData.results;
                useCache = true;
            }
        } catch (e) {
            console.warn('[Кэш] Не удалось прочитать файл кэша, выполняются новые запросы.');
        }
    }

    // Если кэш невалиден или отсутствует — делаем запросы к API
    if (!useCache) {
        console.log(`[Fandom API] Запуск параллельного парсинга ${PAGES.length} страниц...`);
        results = await Promise.all(PAGES.map(page => parsePage(page)));

        // Сохраняем свежие результаты в кэш
        try {
            fs.writeFileSync(CACHE_FILE, JSON.stringify({
                timestamp: Date.now(),
                results: results
            }, null, 2), 'utf-8');
            console.log(`[Кэш] Результаты парсинга успешно сохранены в fandom_cache.json`);
        } catch (e) {
            console.error('[Кэш] Ошибка при записи файла кэша:', e);
        }
    }

    const cratesRegistry: Record<string, any> = {};
    const wordsToTranslate: Record<string, string> = {};

    for (const res of results) {
        if (!res) continue;
        cratesRegistry[res.crateKey] = res.data;
        Object.assign(wordsToTranslate, res.englishNames);
    }

    fs.writeFileSync(
        path.join(tilesDir, 'crates_data.json'), 
        JSON.stringify(cratesRegistry, null, 2), 
        'utf-8'
    );

    console.log(`[Готово] Данные всех ящиков сохранены в tiles/crates_data.json`);
    
    // Базовый шаблон на случай, если файла ещё нет
    const languages = [{ fileName: 'en.yml', defaultContent: 'crates:\n' },{ fileName: 'ru.yml', defaultContent: 'crates:\n' }]

    // Обрабатываем каждый языковой файл
    for (const lang of languages) {
        const ymlPath = path.join(dataDir, lang.fileName);
        
        let fileContent = lang.defaultContent;
        if (fs.existsSync(ymlPath)) {
            fileContent = fs.readFileSync(ymlPath, 'utf-8');
        }

        // Парсим YAML в AST-документ (сохраняет комментарии и структуру)
        const doc = YAML.parseDocument(fileContent);

        // Гарантируем, что узел crates существует
        if (!doc.has('crates')) {
            doc.set('crates', doc.createNode({}));
        }

        // Добавляем ВСЕ ключи (и ящики, и предметы) строго внутрь группы crates
        let cratesNode = doc.get('crates') as YAML.YAMLMap;
        if (!cratesNode || typeof cratesNode.has !== 'function') {
            doc.set('crates', doc.createNode({}));
            cratesNode = doc.get('crates') as YAML.YAMLMap;
        }

        for (const [key, value] of Object.entries(wordsToTranslate)) {
            if (!cratesNode.has(key)) {
                cratesNode.set(key, value);
            }
        }

        // Формируем YAML строку с принудительными двойными кавычками для всех новых строк
        const yamlString = doc.toString({
            lineWidth: 0, // Отключает нежелательные переносы длинных строк
            defaultStringType: 'QUOTE_DOUBLE', // Все ЗНАЧЕНИЯ принудительно оборачиваем в ""
            defaultKeyType: 'PLAIN'          // Все КЛЮЧИ принудительно оставляем БЕЗ кавычек
        });

        fs.writeFileSync(ymlPath, yamlString, 'utf-8');
        console.log(`[i18n] Локализация сохранена/обновлена в tiles/${lang.fileName}`);
    }
}

main();