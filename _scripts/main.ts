import * as L from 'leaflet'

type GroupsKeys = 'start' | 'layer_zones' | 'zombie' | 'location' | 'boss' | 'fishing' | 'box' | 'box_pickup' | 'motorcycle' | 'airdrop' | 'c4' | 'axe' | 'crowbar' | 'transistor' | 'shovel' | 'generator' | 'radio' | 'motorcycle_repair' | 'gas_pump' | 'corpse_keys' | 'tripwire_trap' | 'campfire' | 'canceling_alarm';
type IconKeys = 'start' | 'boss' | 'boss_leshen' | 'boss_screech' | 'boss_wendigo' | 'generator' | 'radio' | 'motorcycle' | 'motorcycle_repair' | 'gas_pump' | 'corpse_keys' | 'crowbar' | 'axe' | 'shovel' | 'c4' | 'transistor' | 'campfire' | 'box' | 'box_pickup' | 'airdrop' | 'fishing' | 'tripwire_trap' | 'canceling_alarm' | 'point' | 'zombie' | 'zombie_phantom' | 'zombie_fast_biter' | 'zombie_giant' | 'zombie_boar' | 'zombie_bloater' | 'animal_north_deer';
type LangKeys = GroupsKeys | IconKeys |'loc_outpost' | 'loc_tank' | 'loc_radio' | 'loc_gas_station' | 'loc_air_crash' | 'loc_fishing' | 'loc_parking' | 'loc_fena_outpost' | 'loc_traffic_jam' | 'loc_ritual_zone' | 'loc_crash_site' | 'loc_army_base' | 'loc_ems' | 'loc_farm' | 'loc_camp' | 'loc_parking_lot' | 'loc_trailer_park' | 'loc_supermarket' | 'item_box' | 'item_box_transport' | 'item_box_generator' | 'item_door_transport' | 'item_door_transport_key' | 'item_crowbar' | 'generator_radio' | 'generator_gas' | 'generator_parking' | 'item_motorcycle_repair' | 'item_radio' | 'item_gas_pump' | 'item_corpse_keys' | 'need_corpse_keys' | 'item_campfire' | 'shelf' | 'fishing_pier' | 'item_axe' | 'c4_door' | 'transistor_loader' | 'transistor_door' | 'key_door' | 'loader_box' | 'item_motorcycle' | 'generator_screech' | 'item_canceling_alarm' | 'boss_leshen' | 'boss_screech' | 'boss_wendigo' | 'carrot' | 'item_tripwire_trap' | 'item_airdrop' | 'frozen_box_transport_persistent' | 'frozen_box_transport' | 'quarantine_box_transport_persistent' | 'quarantine_box_transport' | 'greenwood_box_transport_persistent' | 'greenwood_box_transport' | 'elevation' | 'zombie_phantom' | 'zombie_fast_biter' | 'zombie_giant' | 'zombie_bloater' | 'zombie_boar' | 'animal_north_deer' | 'zombie_phantom_generator' | 'zombie_fast_biter_generator' | 'zombie_bloater_generator' | 'zombie_giant_generator' | 'zombie_phantom_or_fast_biter' | 'zombie_phantom_or_bloater' | 'zombie_bloater_or_fast_biter' | 'zombie_fast_biter_airdrop' | 'zombie_bloater_airdrop' | 'zombie_giant_airdrop' | 'zombie_phantom_airdrop' | 'btn_hide' | 'btn_show' | 'map_frozen' | 'map_quarantine' | 'map_greenwood' | 'cursor_pos' | 'out_of_map' | 'loot_example' | 'one' | 'none_or_one' | 'of_the_following' | 'wiki_source' | 'unker_credits' | 'success_screenshot_msg' | 'fail_screenshot_msg' | 'filters';
type LangCratesKeys = "crate_with_oak_logs" | "oak_log" | "charcoal" | "oak_plank" | "crate_with_fur" | "fur" | "tanned_fur" | "crate_with_provision_autumn" | "strong_alcohol" | "berry" | "raw_meat" | "perch" | "trout" | "pike" | "crate_with_provision_summer" | "raw_turkey" | "carp" | "crate_with_provision_winter" | "northern_berry" | "berry_tincture" | "salmon" | "sturgeon" | "crate_with_equipment_autumn" | "mini_uzi" | "colt_python" | "winchester" | "machete" | "katana" | "golf_club" | "m16" | "ak_47" | "rare" | "reinforced_beanie" | "reinforced_jacket" | "reinforced_jeans" | "reinforced_boots" | "tactical_cap" | "tactical_body_armor" | "tactical_trousers" | "tactical_boots" | "crate_with_equipment_summer" | "glock_17" | "crate_with_equipment_winter" | "flare_gun" | "vss_vintorez" | "hammer" | "torch" | "fur_beanie" | "fur_jacket" | "fur_trousers" | "fur_boots" | "crate_with_wool" | "piece_of_wool" | "woolen_fabric" | "crate_with_copper" | "copper_ore" | "copper_bar" | "crate_with_aluminum" | "aluminum_ore" | "aluminium_bar" | "crate_with_thermite" | "thermite" | "crate_with_pine_logs" | "pine_log" | "pine_plank" | "crate_with_stone" | "limestone" | "crate_with_iron" | "iron_bar" | "iron_ore" | "iron_plate" | "crate_with_hides" | "leather" | "animal_rawhide";

// Описываем тип для window, чтобы TS не ругался
declare global {
	interface Window {
		MAP_DATA: {
			ui: {[key in LangKeys]: string}
			crates: {[key in LangCratesKeys]: string}
			url: string
			baseurl: string
			lang: 'en' | 'ru'
			buildVer: string
		}

		openImageModal: (src: string) => void;

		// Добавляем поддержку gtag
		gtag: (command: string, action: string, params?: object) => void;
		dataLayer: any[];
	}
}

const trackEvent = (action: string, category: string, label?: string, value?: number) => {
	if (typeof window.gtag === 'function') {
		window.gtag('event', action, {
			event_category: category,
			event_label: label,
			value: value
		});
	}
};

// Расширяем стандартные интерфейсы Leaflet
declare module 'leaflet' {
    interface MarkerOptions {
        sourceData?: MarkerJSON;
        baseFileName?: string;
        baseSize?: number;
    }
    // Если вы используете кастомные свойства в самих объектах Marker
    interface Marker {
        options: MarkerOptions;
    }
}

// 1. Описываем интерфейс для вашего кастомного контрола
interface CursorControl extends L.Control {
    _div?: HTMLElement;
}

// 2. Создаем класс через L.Control.extend
const CursorCoordsControl = (L.Control.extend({
    onAdd: function(this: CursorControl) {
        this._div = L.DomUtil.create('div', 'coords-info');
        this._div.innerHTML = 'X: 0, Y: 0';
        return this._div;
    }
}));

interface MarkerJSON {
	x: number;
	y: number;
	text: LangKeys
	group: GroupsKeys
	image?: string
	angle?: number
	icon?: string
	crates?: string[];
}
interface ZonesJSON {
	name: LangKeys
	color: string
	coordinates: [number, number][]
}

// Типы для ящиков
export interface CrateItem {
	item_key: LangCratesKeys;
}

export interface CrateContentSingle {
	type: 'single';
	item_key: LangCratesKeys;
	count?: string;
	note_key?: LangCratesKeys;
}

export interface CrateContentGroup {
	type: 'group';
	pool_count: string;
	items: CrateItem[];
	note_key?: LangCratesKeys;
}

export type CrateContent = CrateContentSingle | CrateContentGroup;

export interface CrateData {
	id: string;
	name_key: LangCratesKeys;
	contents: CrateContent[];
}

type CratesDataRegistry = { [crateId: string]: CrateData };

// 

type MapKey = 'frozen' | 'quarantine' | 'greenwood'

interface IMapConfig {
	width: number
	height: number
	json: string
	zonesJson: string
	tilePath: string
	tileSize: number
	minZoom: number
	maxZoom: number
}

type MapConfig = {
	[key in MapKey]: IMapConfig;
}


const urlParams = new URLSearchParams(window.location.search);
const devParam = urlParams.get('dev');
const isLocal = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);

// Режим разработки включен, если явно передано ?dev=1 
// ИЛИ если мы на локалхосте, но при этом нет явного запрета ?dev=0
const isDev = devParam === '1' || (isLocal && devParam !== '0');
let selectedMarker: L.Marker | null = null // Глобальная переменная для выделенного маркера в Dev режиме

// 1. КОНФИГУРАЦИЯ И СЛОВАРИ
const MAP_CONFIG: MapConfig = {
	frozen: {
		width: 80682, height: 80682,
		json: `${window.MAP_DATA.url}${window.MAP_DATA.baseurl}/map-data/frozen/markers.json?v=${window.MAP_DATA.buildVer}`,
		zonesJson: `${window.MAP_DATA.url}${window.MAP_DATA.baseurl}/map-data/frozen/zones.json?v=${window.MAP_DATA.buildVer}`,
		tilePath: `${window.MAP_DATA.url}${window.MAP_DATA.baseurl}/tiles/frozen/{z}/{y}/{x}.webp`,
		tileSize: 512,
		minZoom: 0,
		maxZoom: 8
	},
	quarantine: {
		width: 74475, height: 71079,
		json: `${window.MAP_DATA.url}${window.MAP_DATA.baseurl}/map-data/quarantine/markers.json?v=${window.MAP_DATA.buildVer}`,
		zonesJson: `${window.MAP_DATA.url}${window.MAP_DATA.baseurl}/map-data/quarantine/zones.json?v=${window.MAP_DATA.buildVer}`,
		tilePath: `${window.MAP_DATA.url}${window.MAP_DATA.baseurl}/tiles/quarantine/{z}/{y}/{x}.webp`,
		tileSize: 512,
		minZoom: 0,
		maxZoom: 8,
	},
	greenwood: {
		width: 72120, height: 72144,
		json: `${window.MAP_DATA.url}${window.MAP_DATA.baseurl}/map-data/greenwood/markers.json?v=${window.MAP_DATA.buildVer}`,
		zonesJson: `${window.MAP_DATA.url}${window.MAP_DATA.baseurl}/map-data/greenwood/zones.json?v=${window.MAP_DATA.buildVer}`,
		tilePath: `${window.MAP_DATA.url}${window.MAP_DATA.baseurl}/tiles/greenwood/{z}/{y}/{x}.webp`,
		tileSize: 512,
		minZoom: 0,
		maxZoom: 8,
	},
}

const groupOrder: {[key in GroupsKeys]: number} = {
	start: 95,
	layer_zones: 100,
	zombie: 110,
	location: 200,
	boss: 300,
	fishing: 400,
	box: 500,
	box_pickup: 600,
	motorcycle: 605,
	airdrop: 610,

	c4: 700,
	axe: 800,
	crowbar: 900,
	transistor: 1000,
	shovel: 1100,

	generator: 1200,
	radio: 1300,
	motorcycle_repair: 1400,
	gas_pump: 1500,
	corpse_keys: 1600,

	tripwire_trap: 1700,
	campfire: 1900,
	canceling_alarm: 2000,
}

// ИНИЦИАЛИЗАЦИЯ СОСТОЯНИЯ
// 1. Описываем сигнатуры (правила) для компилятора
function t(key: LangCratesKeys, space: 'crates'): string;
function t(key: LangKeys, space?: 'ui'): string;

// 2. Пишем единую реализацию
function t(key: string, space: 'ui' | 'crates' = 'ui'): string {
    if (space === 'crates') {
        return window.MAP_DATA.crates[key as LangCratesKeys] || key;
    }
    return window.MAP_DATA.ui[key as LangKeys] || key;
}

let isInitialLoad = true;
let currentMapId: MapKey = (localStorage.getItem('user_active_map') || 'frozen') as MapKey
let currentMapSize = MAP_CONFIG[currentMapId]

// --- ЛОГИКА URL ПАРАМЕТРОВ ---

// 1. Получаем данные из URL при старте
const currentMapName = urlParams.get('map')
if (currentMapName && currentMapName in MAP_CONFIG) {
	currentMapId = currentMapName as MapKey
	currentMapSize = MAP_CONFIG[currentMapName as MapKey]
}

// 2. Функция для обновления URL при действиях пользователя
function updateURL() {
	const urlParams = new URLSearchParams(window.location.search);

	// Сохраняем активные фильтры
	const activeFilters = Object.keys(groups).filter(key => {
		const group = groups[key as GroupsKeys];
		return group && map.hasLayer(group);
	});
	
	// Обновляем только параметры карты и фильтров
	urlParams.set('map', currentMapId)
	urlParams.set('filters', activeFilters.join(','));

	// Формируем новый URL и пушим в историю без перезагрузки страницы
	const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
	window.history.replaceState({ path: newUrl }, '', newUrl);
}

// 3. Применяем фильтры из URL (вызывать ПОСЛЕ loadMarkers)
function applyFiltersFromURL() {
	const filterParam = urlParams.get('filters')
	if (filterParam) {
		const activeList = filterParam.split(',') as GroupsKeys[]

		// Сначала скрываем всё, если в URL что-то передано
		Object.values(groups).forEach(g => map.removeLayer(g))

		// Включаем только те, что в URL
		activeList.forEach(key => {
			if (groups[key]) map.addLayer(groups[key])
		})
	}
}


// 3. НАСТРОЙКА КАРТЫ
const map = L.map('map', { crs: L.CRS.Simple })
map.attributionControl.setPrefix('')

if (!L.Browser.mobile && isDev) {
	document.getElementById('map')!.classList.add('desktop-cursor')
}

// Восстановление позиции и зума
const savedZoom = Number(localStorage.getItem('user_map_zoom'))
const savedCenter = JSON.parse(localStorage.getItem('user_map_center') || "null")

const getMapBounds = (config: IMapConfig) => new L.LatLngBounds(
	map.unproject([0, config.height], config.maxZoom),
	map.unproject([config.width, 0], config.maxZoom)
)

function updateMapBounds() {
	if (!currentMapSize) return;
	
	const bounds = getMapBounds(currentMapSize);
	const minZoom = currentMapSize.minZoom || 0;
	const currentZoom = map.getZoom();
	
	if (currentZoom === undefined) return;

	const basePadding = 0.8;
	
	// Разница между текущим и минимальным зумом
	const zoomDiff = Math.max(0, currentZoom - minZoom); 
	
	// Делим базовый отступ на 2 за каждый шаг зума, 
	// чтобы визуальный размер отступа на экране всегда был одинаковым
	const dynamicPadding = basePadding / Math.pow(2, zoomDiff);
	
	map.setMaxBounds(bounds.pad(dynamicPadding));
}

const baseLayers: L.Control.LayersObject = {}
for (const [id, config] of Object.entries(MAP_CONFIG)) {
	const layerName = t(`map_${id as MapKey}`)
	baseLayers[layerName] = L.tileLayer(config.tilePath, {
		bounds: getMapBounds(config),
		noWrap: true,
		tileSize: config.tileSize || 256,
		minZoom: config.minZoom || 0,
		maxZoom: config.maxZoom || 7,
		errorTileUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
	})

	if (id === currentMapId) {
		baseLayers[layerName].addTo(map)
		const bounds = getMapBounds(config)

		if (savedCenter && savedZoom && !Number.isNaN(savedZoom)) {
			map.setView(savedCenter, savedZoom)
		} else {
			map.fitBounds(bounds)
		}

		updateMapBounds()
	}
}

// Сохранение состояния при перемещении/зуме
map.on('moveend zoomend', () => {
	localStorage.setItem('user_map_center', JSON.stringify(map.getCenter()))
	localStorage.setItem('user_map_zoom', String(map.getZoom()))
})

// 4. ИКОНКИ И ГРУППЫ
const iconCache: {[key: string]: L.Icon} = {} // Кэш для оптимизации масштабирования
function getIcon(fileName: string, size = 32) {
	const key = `${fileName}_${size}`
	if (!iconCache[key]) {
		iconCache[key] = L.icon({
			iconUrl: `${window.MAP_DATA.url}${window.MAP_DATA.baseurl}/images/markers/${fileName}`,
			iconSize: [size, size],
			iconAnchor: [size / 2, size / 2],
			popupAnchor: [0, -size / 2]
		})
	}
	return iconCache[key]
}

const iconConfig: {[key in IconKeys]: [string, number]} = {
	start: ['start.webp', 48],
	boss: ['boss.webp', 32],
	boss_leshen: ['leshen.webp', 48],
	boss_screech: ['screech.webp', 48],
	boss_wendigo: ['wendigo.webp', 48],
	generator: ['use.webp', 32],
	radio: ['use.webp', 32],
	motorcycle: ['motorcycle.webp', 32],
	motorcycle_repair: ['use.webp', 32],
	gas_pump: ['use.webp', 32],
	corpse_keys: ['use.webp', 32],
	crowbar: ['crowbar.webp', 32],
	axe: ['axe.webp', 32],
	shovel: ['shovel.webp', 32],
	c4: ['use.webp', 32],
	transistor: ['use.webp', 32],
	campfire: ['use.webp', 32],
	box: ['box.webp', 32],
	box_pickup: ['box_pickup.webp', 32],
	airdrop: ['box.webp', 32],
	fishing: ['fishing.webp', 32],
	tripwire_trap: ['tripwire_trap.webp', 32],
	canceling_alarm: ['use.webp', 32],
	point: ['point.webp', 48],
	zombie: ['zombie.webp', 48],
	zombie_phantom: ['zombie.webp', 48],
	zombie_fast_biter: ['zombie.webp', 48],
	zombie_giant: ['bloater.webp', 48],
	zombie_boar: ['point.webp', 48],
	zombie_bloater: ['bloater.webp', 48],
	animal_north_deer: ['animal.webp', 48],
}

const groups: {[key in GroupsKeys]?: L.LayerGroup} = {}
const locationGroup = L.layerGroup().addTo(map)
map.createPane('locationTitles')
map.getPane('locationTitles')!.style.zIndex = '650'
map.getPane('locationTitles')!.style.pointerEvents = 'none'

const zonesGroup = L.layerGroup().addTo(map)

// TODO update use bogside-outskirts
function updateSingleMarkerIcon(marker: L.Marker) {
	if (marker.options.sourceData?.group === 'location') return

	const zoom = map.getZoom()
	const scale = zoom >= 6 ? 1.5 : 1.0
	const newSize = marker.options.baseSize! * scale
	const angle = marker.options.sourceData!.angle || 0
	const isSelected = isDev && selectedMarker === marker

	const borderStyle = isSelected ? 'filter: drop-shadow(0px 0px 6px red); outline: 2px solid red; outline-offset: 2px; border-radius: 50%; background: rgba(255,0,0,0.3);' : ''

	marker.setIcon(L.divIcon({
		className: 'custom-icon leaflet-marker-icon',
		html: `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; ${borderStyle} box-sizing: border-box; transition: all 0.2s;">
												<img src="${window.MAP_DATA.url}${window.MAP_DATA.baseurl}/images/markers/${marker.options.baseFileName}" style="width: 100%; height: 100%; transform: rotate(${angle}deg); pointer-events: none;">
											</div>`,
		iconSize: [newSize, newSize],
		iconAnchor: [newSize / 2, newSize / 2],
		popupAnchor: [0, -newSize / 2]
	}))
}

function openMarkerProperties(marker: L.Marker) {
	selectedMarker = marker

	const propsPanel = document.getElementById('dev-marker-props')
	if (propsPanel) {
		propsPanel.style.display = 'flex'

		const data = marker.options.sourceData!
		const p = map.project(marker.getLatLng(), currentMapSize.maxZoom)

		document.getElementById('dev-prop-coords')!.innerText = `X: ${Math.round(p.x)}, Y: ${Math.round(p.y)}`;
		(document.getElementById('dev-prop-text') as HTMLInputElement).value = data.text || '';
		(document.getElementById('dev-prop-group') as HTMLInputElement).value = data.group || '';
		(document.getElementById('dev-prop-icon') as HTMLInputElement).value = data.icon || '';
		(document.getElementById('dev-prop-image') as HTMLInputElement).value = data.image || '';

		const angle = data.angle || 0;
		(document.getElementById('dev-marker-angle') as HTMLInputElement).value = String(angle);
		document.getElementById('dev-angle-val')!.innerText = String(angle);

		if (data.group === 'location') {
			(document.getElementById('dev-marker-angle') as HTMLInputElement).disabled = true;
			(document.getElementById('dev-prop-icon') as HTMLInputElement).disabled = true;
			(document.getElementById('dev-prop-image') as HTMLInputElement).disabled = true;
		} else {
			(document.getElementById('dev-marker-angle') as HTMLInputElement).disabled = false;
			(document.getElementById('dev-prop-icon') as HTMLInputElement).disabled = false;
			(document.getElementById('dev-prop-image') as HTMLInputElement).disabled = false;
		}
	}
	updateMarkersScale()
}

function getMarkerPopupContent(data: MarkerJSON) {
	let content = `<div class="popup-container-center"><b class="popup-main-title">${t(data.text)}</b>`

	if (data.image) {
		const isBoss = data.image.includes('boss_');
    const text = isBoss ? '' : `<b class="popup-footer-title">${t('loot_example')}</b>`;
    const aspect = data.image.includes('chopper') ? '600/454' : '600/470';

		content += `
      <div class="popup-image-wrapper">
        <img src="${window.MAP_DATA.url}${window.MAP_DATA.baseurl}/images/loot/${data.image}" 
					onclick="openImageModal(this.src)" 
					class="popup-loot-img" 
					style="aspect-ratio: ${aspect};" 
					alt="Loot">
      </div>
      ${text}
    `;
	}

	// --- Логика рендера содержимого ящиков ---
	if (data.crates && data.crates.length > 0) {
		content += `<div class="popup-loot-body">`;

		data.crates.forEach(crateId => {
			const crate = cratesData[crateId];
			if (!crate) return;

			// Опционально: если хочешь выводить название ящика перед его списком
			content += `<div class="popup-section-title"><b>${t(crate.name_key, 'crates')}</b></div>`;
			
			content += `<ul class="popup-loot-list">`;

			crate.contents.forEach(item => {
				if (item.type === 'single') {
					const countStr = item.count ? (item.count === '1' ? '' :  `: ${item.count} `) : '';
					
					// Переводим название и примечание (например, note_key: "rare" -> "(Rare)")
					const itemName = t(item.item_key, 'crates') || item.item_key;
					const noteStr = item.note_key ? ` (${t(item.note_key, 'crates')})` : '';
					
					content += `<li>• ${itemName}${noteStr}${countStr}</li>`;
				} else if (item.type === 'group') {
					// Обработка группы с пулом
					const poolText = item.pool_count === '1' ? t('one') : item.pool_count === '0-1' ? t('none_or_one') : item.pool_count;

					// Получаем примечание (например, " (Редкое)" или " (Rare)")
					const noteStr = item.note_key ? ` (${t(item.note_key, 'crates')})` : '';
					
					content += `<li>• ${poolText} ${t('of_the_following')}${noteStr}:`;
					content += `<ul class="popup-loot-sublist">`;

					item.items.forEach(subItem => {
						const subItemName = t(subItem.item_key, 'crates') || subItem.item_key;
						content += `<li>• ${subItemName}</li>`;
					});

					content += `</ul></li>`;
				}
			});

			content += `</ul>`;

			// Преобразуем id ящика (например: crate_with_oak_logs) в формат названия страницы Wiki (Crate_with_Oak_Logs)
			const pageName = crateId
				.split('_')
				.map(word => {
					// Особые случаи для правильной вложенности круглых скобок, как в вашем массиве PAGES
					if (word === 'autumn') return '(Autumn)';
					if (word === 'summer') return '(Summer)';
					if (word === 'winter') return '(Winter)';

					// Слово 'with' всегда пишем с маленькой буквы
					if (word === 'with') return 'with';

					// Капитализируем первую букву каждого слова
					return word.charAt(0).toUpperCase() + word.slice(1);
				})
				.join('_');

			const wikiUrl = `https://last-day-on-earth-survival.fandom.com/wiki/${pageName}`;
			
			content += `
				<div class="popup-wiki-wrapper">
					<a href="${wikiUrl}" target="_blank" rel="noopener noreferrer" class="popup-wiki-link">
						${t('wiki_source')}
					</a>
				</div>
			`;
		});

		content += `</div>`;
	}

	content += `</div>`
	return content
}

// Функция для открытия модального окна
function openImageModal(src: string) {
	trackEvent('view_loot_image', 'UI Action', src);
	const modal = document.getElementById('imgModal') as HTMLImageElement
	const modalImg = document.getElementById('modalImg') as HTMLImageElement
	modalImg.src = src
	modal.style.display = 'flex'
}
window.openImageModal = openImageModal;

function addMarker(m: MarkerJSON) {
	const latlng = map.unproject([m.x, m.y], currentMapSize.maxZoom)

	let marker
	if (m.group === 'location') {
		marker = L.marker(latlng, {
			pane: 'locationTitles',
			icon: L.divIcon({
				className: 'location-title',
				html: `<div>${t(m.text)}</div>`,
				iconSize: [200, 40],
				iconAnchor: [100, 20]
			}),
			interactive: isDev,
			draggable: false,
			sourceData: m,
		}).addTo(locationGroup)
	} else {
		if (!groups[m.group]) {
			// Создаем группу
			groups[m.group] = L.layerGroup()
			// Добавляем на карту все группы, кроме zombie
			if (m.group !== 'zombie') {
				groups[m.group]!.addTo(map)
			}
		}

		const [fileName, defaultSize] = iconConfig[m.icon as IconKeys] || iconConfig[m.group as IconKeys] || ['box.webp', 32]
		marker = L.marker<{baseFileName: string}>(latlng, {
			icon: getIcon(fileName, defaultSize),
			baseFileName: fileName, // Сохраняем имя файла для рескейла
			baseSize: defaultSize,
			draggable: false,
			sourceData: m,
		}).bindPopup(() => getMarkerPopupContent(m)).addTo(groups[m.group]!)
	}

	marker.on('popupopen', () => {
		trackEvent('view_marker', 'Engagement', m.text);
	});
	
	// Если мы в dev-режиме, вешаем обработчик обновления координат
	if (isDev) {
		// Обработка клика для выделения маркера
		marker.on('click', function (e) {
			if (document.getElementById('dev-check-edit-mode') && (document.getElementById('dev-check-edit-mode') as HTMLInputElement).checked) {
				L.DomEvent.stopPropagation(e)
				openMarkerProperties(marker)
			}
		})

		marker.on('dragend', function () {
			const p = map.project(marker.getLatLng(), currentMapSize.maxZoom)
			marker.options.sourceData!.x = Math.round(p.x)
			marker.options.sourceData!.y = Math.round(p.y)

			// Если тянем именно выделенный маркер, обновляем координаты в панельке
			if (selectedMarker === marker) {
				const coordsEl = document.getElementById('dev-prop-coords')
				if (coordsEl) coordsEl.innerText = `X: ${Math.round(p.x)}, Y: ${Math.round(p.y)}`
			}
		})
	}
	return marker
}

// 5. ИНТЕРФЕЙС И УПРАВЛЕНИЕ
let layersControl: L.Control<L.ControlOptions>
function updateLayersControl() {
	if (layersControl) map.removeControl(layersControl)

	const overlayMaps: {[key: string]: L.LayerGroup} = {}

	// Добавляем зоны 

	const _groups = { ...groups } // {...groups, layer_zones: zonesGroup}

	Object.keys(_groups)
		.sort((a, b) => (groupOrder[a as GroupsKeys] || 9999999) - (groupOrder[b as GroupsKeys] || 9999999))
		.forEach(key => {

			const group = _groups[key as GroupsKeys]!
			let label = t(key as GroupsKeys)

			// Если это обычная группа (не зоны), считаем количество слоев внутри
			if (key !== 'layer_zones' && group.getLayers) {
				const count = group.getLayers().length
				if (count > 1) {
					label += ` (${count})`
				}
			}

			overlayMaps[label] = _groups[key as GroupsKeys]!
			
			const mobileLabelSpan = document.querySelector(`.mobile-filter-text[data-group="${key}"]`) as HTMLElement;
      if (mobileLabelSpan) {
				mobileLabelSpan.innerText = ` ${label}`; // Добавляем пробел перед иконкой для красоты
      }
		})

	layersControl = L.control.layers(baseLayers, overlayMaps, { collapsed: false }).addTo(map)

	const layersContainer = layersControl.getContainer()
	const myPanel = document.querySelector('.map-controls')
	if (myPanel && layersContainer) {
		myPanel.appendChild(layersContainer)
	}
}

async function loadMarkers() {
	// Полностью очищаем старые слои и объект групп
	Object.values(groups).forEach(g => g.clearLayers())
	for (let key in groups) delete groups[key as GroupsKeys]
	locationGroup.clearLayers()
	selectedMarker = null

	try {
		const response = await fetch(MAP_CONFIG[currentMapId].json)
		const markers: MarkerJSON[] = await response.json()
		markers.forEach(addMarker)
		updateLayersControl()
		updateMarkersScale() // Применяем нужный размер сразу после загрузки
	} catch (error) {
		console.error("Ошибка загрузки маркеров:", error)

		trackEvent('data_load_error', 'Network', `markers_${currentMapId}`);
	}
}

async function loadZones() {
	zonesGroup.clearLayers()
	const config = MAP_CONFIG[currentMapId]

	if (!config.zonesJson) return

	try {
		const response = await fetch(config.zonesJson)
		const zonesData: ZonesJSON[] = await response.json()

		zonesData.forEach(z => {
			const latLngs = z.coordinates.map(p => map.unproject([p[0], p[1]], currentMapSize.maxZoom))
			const polygon = L.polygon(latLngs, {
				color: z.color || '#3388ff',
				weight: 3,
				fillOpacity: 0.2,
				className: 'map-zone'
			})

			if (z.name) {
				polygon.bindPopup(t(z.name))
			}

			polygon.addTo(zonesGroup)
		})

		updateLayersControl()
	} catch (error) {
		console.warn("Файл зон не найден или поврежден для этой карты", error)

		trackEvent('data_load_error', 'Network', `zones_${currentMapId}`);
	}
}

let cratesData: CratesDataRegistry = {};

async function loadCratesData() {
	// Формируем URL по аналогии с вашим MAP_CONFIG
	const cratesUrl = `${window.MAP_DATA.url}${window.MAP_DATA.baseurl}/map-data/crates_data.json?v=${window.MAP_DATA.buildVer}`;

	try {
		const response = await fetch(cratesUrl);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		cratesData = await response.json();
		
		// Вызываем обновление поп-апов для группы box_pickup
		updateBoxPickupMarkers();
	} catch (error) {
		console.error("Ошибка загрузки данных ящиков (crates_data):", error);
		trackEvent('data_load_error', 'Network', `crates_data`);
	}
}

function updateBoxPickupMarkers() {
	// Проходим по всем слоям, добавленным на карту Leaflet
	map.eachLayer((layer) => {
		const marker = layer as L.Marker;
		if (marker.options.sourceData && marker.options.sourceData.group === 'box_pickup') {
			// Генерируем новый контент поп-апа с учетом уже загруженных cratesData
			const newContent = getMarkerPopupContent(marker.options.sourceData);
			// Перепривязываем поп-ап с новым содержимым
			marker.bindPopup(newContent);
		}
	});
}

map.on('overlayadd', function (e) {
	if (isInitialLoad) return;
	const groupKey = Object.keys(groups).find(k => e.name.startsWith(t(k as GroupsKeys)));
	if (groupKey) {
		trackEvent('filter_enable', 'Filters', groupKey);
	}
});

map.on('overlayremove', function (e) {
	if (isInitialLoad) return;
	const groupKey = Object.keys(groups).find(k => e.name.startsWith(t(k as GroupsKeys)));
	if (groupKey) {
		trackEvent('filter_disable', 'Filters', groupKey);
	}
});

map.on('baselayerchange', function (e) {
	const targetId = Object.keys(MAP_CONFIG).find(k => e.name.startsWith(t(`map_${k as MapKey}`))) as MapKey
	if (targetId && targetId !== currentMapId) {
		trackEvent('change_map', 'Map Interaction', targetId);

		currentMapId = targetId
		currentMapSize = MAP_CONFIG[targetId]
		localStorage.setItem('user_active_map', targetId)

		const bounds = getMapBounds(currentMapSize)
		map.fitBounds(bounds)
		updateMapBounds()

		loadMarkers()
		loadZones()
	}
})

map.on('overlayadd overlayremove baselayerchange', function () {
	updateURL()
})

// 6. МАСШТАБИРОВАНИЕ ИКОНОК
function updateMarkersScale() {
	Object.values(groups).forEach(group => {
		group.eachLayer(layer => {
			const marker = layer as L.Marker;
			if (marker.options.baseFileName) {
				updateSingleMarkerIcon(marker)

				if (marker.options.sourceData) {
					marker.setPopupContent(getMarkerPopupContent(marker.options.sourceData!));
				}
			}
		})
	})

	// Подсветка текстовых локаций
	locationGroup.eachLayer(layer => {
		const marker = layer as L.Marker;
		const isSelected = isDev && selectedMarker === marker
		const div = marker.getElement()
		if (div && div.firstChild) {
			const content = div.firstChild as HTMLElement;
			if (isSelected) {
				content.style.border = '2px dashed red'
				content.style.background = 'rgba(255,0,0,0.1)'
			} else {
				content.style.border = 'none'
				content.style.background = 'none'
			}
		}
	})
}

map.on('zoomend', () => {
	updateMarkersScale()
	updateMapBounds()
})

// 7. UI ЭЛЕМЕНТЫ

if (!L.Browser.mobile && isDev) {
	const cursorCoordsLabel = new CursorCoordsControl({ position: 'bottomleft' }) as CursorControl

	cursorCoordsLabel.onAdd = function () {
		this._div = L.DomUtil.create('div', 'coords-info')
		this._div.innerHTML = 'X: 0, Y: 0'
		return this._div
	}
	cursorCoordsLabel.addTo(map)

	map.on('mousemove', function (e) {
		const point = map.project(e.latlng, currentMapSize.maxZoom)
		const x = Math.round(point.x)
		const y = Math.round(point.y)

		// Проверка границ, чтобы не показывать цифры за пределами фото
		if (x >= 0 && x <= currentMapSize.width && y >= 0 && y <= currentMapSize.height) {
			cursorCoordsLabel._div!.innerHTML = t('cursor_pos').replace('{x}', String(x)).replace('{y}', String(y))
		} else {
			cursorCoordsLabel._div!.innerHTML = t('out_of_map')
		}
	})

	map.on('click', function (e) {
		const point = map.project(e.latlng, currentMapSize.maxZoom)
		const text = `{"x": ${Math.round(point.x)}, "y": ${Math.round(point.y)}, "text": "item_name", "group": "group_name"},`
		console.log(text)
		navigator.clipboard.writeText(text)
	})
}

map.on('zoomend', function () {
	if (map.getZoom() > 4) {
		map.removeLayer(locationGroup)
	} else {
		map.addLayer(locationGroup)
	}
})

const toggleControls = new L.Control({ position: 'topright' })
toggleControls.onAdd = function () {
	// Создаем обертку
	const wrapper = L.DomUtil.create('div', 'map-ui-wrapper')

	// 1. Создаем панель управления
	const panel = L.DomUtil.create('div', 'map-controls', wrapper)

	// Блок языков
	const langDiv = L.DomUtil.create('div', 'lang-controls', panel);
	['ru', 'en'].forEach(lang => {
		const btn = L.DomUtil.create('button', 'map-btn', langDiv)
		btn.innerHTML = lang.toUpperCase()
		if (window.MAP_DATA.lang === lang) btn.style.background = '#007bff'
		btn.onclick = () => {
			trackEvent('change_language', 'UI Action', lang);
			const urlParams = new URLSearchParams(window.location.search);
			window.location.href = `${window.MAP_DATA.url}${window.MAP_DATA.baseurl}/ru/?${urlParams.toString()}`;
		}
	})

	// Кнопки Скрыть/Показать
	const hideBtn = L.DomUtil.create('button', 'map-btn', panel)
	hideBtn.innerHTML = `❌ <span>${t('btn_hide')}</span>`
	hideBtn.onclick = () => {
		trackEvent('filters_hide_all', 'UI Action', currentMapId);
		Object.values(groups).forEach(g => map.removeLayer(g))

		if (map.hasLayer(zonesGroup)) {
			map.removeLayer(zonesGroup)
		}

		updateLayersControl()
		updateURL()
	}

	const showBtn = L.DomUtil.create('button', 'map-btn', panel)
	showBtn.innerHTML = `✅ <span>${t('btn_show')}</span>`
	showBtn.onclick = () => {
		trackEvent('filters_show_all', 'UI Action', currentMapId);
		Object.values(groups).forEach(g => map.addLayer(g))

		if (!map.hasLayer(zonesGroup)) {
			map.addLayer(zonesGroup)
		}

		updateLayersControl()
		updateURL()
	}

	const unkerCredits = L.DomUtil.create('div', 'unker-credits', panel);
	unkerCredits.style.marginTop = '10px';
	unkerCredits.style.paddingTop = '5px';
	unkerCredits.style.borderTop = '1px solid #ddd'; // Тонкая полоска-разделитель
	unkerCredits.style.textAlign = 'center';
	unkerCredits.style.fontSize = '12px';
	unkerCredits.style.color = '#555555';
	unkerCredits.style.lineHeight = '1.5';
	
	unkerCredits.innerHTML = `
		${t('unker_credits')}<br>
		<a href="https://www.youtube.com/@UNKER...1" target="_blank" style="color: #E62117; font-weight: bold; text-decoration: none; font-size: 14px; display: inline-block; margin-top: 5px;">
			📺 YouTube — UNKER
		</a>
	`;

	// Детектор размера окна (ResizeObserver)
	const ro = new ResizeObserver(entries => {
		for (let entry of entries) {
			const width = entry.contentRect.width
			const mapContainer = document.getElementById('map')! // Контейнер карты

			if (width < 750) {
				wrapper.classList.remove('ui-wide')
				wrapper.classList.add('ui-compact')

				mapContainer.classList.add('ui-compact-zoom')
			} else {
				wrapper.classList.remove('ui-compact')
				wrapper.classList.add('ui-wide')
				panel.classList.remove('active') // Закрываем меню при расширении

				mapContainer.classList.remove('ui-compact-zoom')
			}
		}
	})

	// Начинаем следить за контейнером карты
	setTimeout(() => ro.observe(document.getElementById('map')!), 100)

	return wrapper
}

toggleControls.addTo(map)


// --- СОЗДАНИЕ МОБИЛЬНОГО ИНТЕРФЕЙСА ---
// Выносим логику отрисовки фильтров в общую функцию
function renderFilters(container: HTMLElement) {
    // 1. Очищаем контейнер от кнопок старой карты
    container.innerHTML = '';

    // 2. Получаем список фильтров, доступных именно для ТЕКУЩЕЙ карты
    const _groups = { ...groups };

    // Генерируем элементы строго по порядку groupOrder, как и в основном меню
    Object.keys(_groups)
      .sort((a, b) => (groupOrder[a as GroupsKeys] || 9999999) - (groupOrder[b as GroupsKeys] || 9999999))
			.forEach(key => {
				const label = L.DomUtil.create('label', 'marker-item', container);
				const cb = L.DomUtil.create('input', '', label) as HTMLInputElement;
				cb.type = 'checkbox';
				cb.dataset.group = key;
				
				const textSpan = L.DomUtil.create('span', 'mobile-filter-text', label);
				textSpan.dataset.group = key;
				textSpan.innerText = ` ${t(key as GroupsKeys)}`;

				// Логика включения/выключения конкретного фильтра
				cb.onchange = (e) => {
					const checked = (e.target as HTMLInputElement).checked;
					const group = groups[key as GroupsKeys];
					if (group) {
						if (checked) map.addLayer(group);
						else map.removeLayer(group);
						updateLayersControl(); // Обновляем и десктопное меню
						updateURL();
					}
				};
			});
}

function initMobileUI() {
    // Проверка, чтобы не создавать элементы дважды
    if (document.querySelector('.mobile-header')) return;

    // 1. Хэдер (Выбор карты и Язык)
    const mobileHeader = L.DomUtil.create('div', 'mobile-header', document.body);

    const mapSelector = L.DomUtil.create('div', 'map-selector', mobileHeader);
    const mapBtn = L.DomUtil.create('button', '', mapSelector);
    mapBtn.id = 'mobile-map-btn';
    // Название карты берем из словаря
    mapBtn.innerHTML = `🗺️ <span id="mobile-map-title">${t(`map_${currentMapId as MapKey}`)}</span> ▾`;

		const mapDropdown = L.DomUtil.create('div', 'map-dropdown-menu', mapSelector);

    // Массив ваших карт. t('map_...') автоматически подтянет локализацию из словаря
    const availableMaps = [
			{ id: 'frozen', label: t('map_frozen' as any) || 'Frozen Island' },
			{ id: 'quarantine', label: t('map_quarantine' as any) || 'Quarantine Zone' },
			{ id: 'greenwood', label: t('map_greenwood' as any) || 'Greenwood' }
    ];

    availableMaps.forEach(mapItem => {
			const link = L.DomUtil.create('a', 'map-dropdown-item', mapDropdown) as HTMLAnchorElement;
			
			// Сохраняем текущие параметры (например, dev=0), но обновляем ID карты
			const urlParams = new URLSearchParams(window.location.search);
			urlParams.set('map', mapItem.id);
			// Фильтры старой карты лучше удалить, так как на новой карте наборы маркеров другие
			urlParams.delete('filters'); 

			link.href = `${window.MAP_DATA.url}/ldoe-scout/${window.MAP_DATA.lang}/?${urlParams.toString()}`;
			link.innerText = mapItem.label;

			// Подсвечиваем текущую активную карту, если мы на ней
			if (currentMapId === mapItem.id) {
				link.classList.add('active');
			}

      link.onclick = (e) => {
        const targetSite = `${window.MAP_DATA.url}/ldoe-scout`;
        
        // Проверяем, запущен ли сайт на проде ldoe-scout или локально на localhost для тестов
        if (window.location.href.includes(targetSite) || window.location.pathname.includes('/ldoe-scout') || window.location.hostname === 'localhost') {
          e.preventDefault(); // Отменяем жесткую перезагрузку страницы

          // Если кликнули на уже активную карту — просто закрываем шторку меню
          if (currentMapId === mapItem.id) {
            mapDropdown.classList.remove('open');
            return;
          }

					// Запоминаем ID предыдущей карты, чтобы корректно удалить её слой тайлов
          const previousMapId = currentMapId;

          // 1. Обновляем глобальный ID текущей карты
          currentMapId = mapItem.id as MapKey;
					currentMapSize = MAP_CONFIG[currentMapId];
					localStorage.setItem('user_active_map', currentMapId);

          // 2. Переключаем активный класс подсветки в меню
          mapDropdown.querySelectorAll('.map-dropdown-item').forEach(el => el.classList.remove('active'));
          link.classList.add('active');

          // 3. Меняем текст на главной мобильной кнопке хэдера
          const titleSpan = document.getElementById('mobile-map-title');
          if (titleSpan) {
            titleSpan.innerText = mapItem.label;
          }

          // 4. Закрываем выпадающий список
          mapDropdown.classList.remove('open');

          // 5. Бесшовно обновляем URL в браузере (сохраняя dev=0/1, но удаляя старые фильтры)
          const nextParams = new URLSearchParams(window.location.search);
          nextParams.set('map', currentMapId);
          nextParams.delete('filters'); 
          const newUrl = `${window.location.pathname}?${nextParams.toString()}`;
          window.history.replaceState({ path: newUrl }, '', newUrl);

          // 6. Стираем с карты старые группы слоев (как вы и просили)
          Object.values(groups).forEach(g => {
            if (g) map.removeLayer(g);
          });

          // 7. Меняем базовый слой тайлов (картинку подложки)
          const oldLayerName = t(`map_${previousMapId}` as any);
          const newLayerName = t(`map_${currentMapId}` as any);
          
          if (baseLayers[oldLayerName]) map.removeLayer(baseLayers[oldLayerName]);
          if (baseLayers[newLayerName]) map.addLayer(baseLayers[newLayerName]);

          // 8. Пересчитываем и устанавливаем новые границы карты (Bounds)
          const bounds = getMapBounds(currentMapSize);
          map.setMaxBounds(bounds);
          map.fitBounds(bounds);

					// 9. Перерисовываем кнопки в шторке под новую карту
          // Передаем туда ваш DOM-элемент `grid` (контейнер фильтров)
					
          // 10. Запускаем отрисовку новых точек и зон (они увидят новые активные фильтры)
          // loadMarkers();
          // loadZones();
					
					Promise.all([loadMarkers(), loadZones(), loadCratesData()]).then(() => {
						if (grid) {
							renderFilters(grid);
						}
							
						// initMobileUI();
					})

        }
      };
    });

    // Логика открытия/закрытия меню по клику на кнопку
    mapBtn.onclick = (e) => {
			e.stopPropagation(); // Предотвращаем закрытие в этот же миг
			mapDropdown.classList.toggle('open');
    };

    // Закрываем меню, если кликнули в любое другое место экрана
    document.addEventListener('click', () => {
			mapDropdown.classList.remove('open');
    });

    const langSelector = L.DomUtil.create('div', 'lang-selector', mobileHeader);
    const langRu = L.DomUtil.create('span', 'lang-tab' + (window.MAP_DATA.lang === 'ru' ? ' active' : ''), langSelector);
    langRu.innerText = 'RU';
    langSelector.appendChild(document.createTextNode(' / '));
    const langEn = L.DomUtil.create('span', 'lang-tab' + (window.MAP_DATA.lang === 'en' ? ' active' : ''), langSelector);
    langEn.innerText = 'EN';

    // Логика переключения языков с сохранением фильтров и параметров
    langRu.onclick = () => {
			const urlParams = new URLSearchParams(window.location.search);
			window.location.href = `${window.MAP_DATA.url}${window.MAP_DATA.baseurl}/ru/?${urlParams.toString()}`;
    };

    langEn.onclick = () => {
			const urlParams = new URLSearchParams(window.location.search);
			window.location.href = `${window.MAP_DATA.url}${window.MAP_DATA.baseurl}/en/?${urlParams.toString()}`;
    };

    // 2. Плавающая кнопка фильтров (FAB)
    const fabBtn = L.DomUtil.create('button', 'fab-filter-btn', document.body);
    fabBtn.innerHTML = `🔍 <span>${t('filters')}</span>`;

    // 3. Нижняя шторка (Bottom Sheet)
    const bottomSheet = L.DomUtil.create('div', 'bottom-sheet', document.body);
    const backdrop = L.DomUtil.create('div', 'bottom-sheet-backdrop', bottomSheet);
    const content = L.DomUtil.create('div', 'bottom-sheet-content', bottomSheet);
    
    L.DomUtil.create('div', 'bottom-sheet-drag-handle', content);

    const header = L.DomUtil.create('div', 'bottom-sheet-header', content);
    const title = L.DomUtil.create('h3', '', header);
    title.innerText = t('filters');

    const quickActions = L.DomUtil.create('div', 'quick-actions', header);
    const btnShow = L.DomUtil.create('button', 'btn-text', quickActions);
    btnShow.innerText = t('btn_show');
    const btnHide = L.DomUtil.create('button', 'btn-text', quickActions);
    btnHide.innerText = t('btn_hide');

    // 4. Сетка с маркерами
    const grid = L.DomUtil.create('div', 'markers-grid', content);
    renderFilters(grid);

    // 5. Подвал шторки
    const footer = L.DomUtil.create('div', 'bottom-sheet-footer', content);
    // const btnReset = L.DomUtil.create('button', 'btn-danger', footer);
    // btnReset.innerText = `⚠️ ${t('reset_all')}`;

    const links = L.DomUtil.create('div', 'footer-links', footer);
    links.innerHTML = `
			<a href="https://www.youtube.com/@UNKER...1" target="_blank">🌐 ${t('unker_credits')}</a>
    `;

    // --- ЛОГИКА РАБОТЫ И АНИМАЦИИ ---

    fabBtn.onclick = () => {
			bottomSheet.classList.add('open');
			// Блокируем карту, чтобы при скролле фильтров она не уезжала
			if (map) map.dragging.disable();
			
			// Синхронизируем чекбоксы со слоями на карте перед открытием шторки
			Object.keys(groups).forEach(key => {
				const cb = grid.querySelector(`input[data-group="${key}"]`) as HTMLInputElement;
				const group = groups[key as GroupsKeys];
				if (cb && group) {
					cb.checked = map.hasLayer(group);
				}
			});

			updateLayersControl();
    };

    backdrop.onclick = () => {
			bottomSheet.classList.remove('open');
			if (map) map.dragging.enable();
    };

    // Привязываем кнопки к вашим уже существующим функциям
    btnShow.onclick = () => {
			trackEvent('filters_show_all', 'UI Action', currentMapId);
			Object.values(groups).forEach(g => map.addLayer(g));
			if (!map.hasLayer(zonesGroup)) map.addLayer(zonesGroup);
			updateLayersControl();
			updateURL();
			// Включаем все чекбоксы
			grid.querySelectorAll('input[type="checkbox"]').forEach(cb => (cb as HTMLInputElement).checked = true);
    };

    btnHide.onclick = () => {
			trackEvent('filters_hide_all', 'UI Action', currentMapId);
			Object.values(groups).forEach(g => map.removeLayer(g));
			if (map.hasLayer(zonesGroup)) map.removeLayer(zonesGroup);
			updateLayersControl();
			updateURL();
			// Выключаем все чекбоксы
			grid.querySelectorAll('input[type="checkbox"]').forEach(cb => (cb as HTMLInputElement).checked = false);
    };

    // btnReset.onclick = () => {
		// 	trackEvent('reset_all_boxes', 'UI Action', currentMapId);
		// 	if (confirm(t('confirm_reset_all'))) {
		// 		markerStatuses.clear();
		// 		saveMarkerStatuses();
		// 		updateMarkersScale();
		// 		updateLayersControl();
		// 		map.closePopup();
		// 		bottomSheet.classList.remove('open'); // Закрываем шторку после сброса
		// 		if (map) map.dragging.enable();
		// 	}
    // };

		// --- ЛОГИКА СВАЙПА (DRAG TO DISMISS) ---
    let startY = 0;
    let currentDeltaY = 0;
    let isDragging = false;

    content.addEventListener('touchstart', (e: TouchEvent) => {
			// Если пользователь скроллит саму сетку фильтров вниз (она не в самом верху), 
			// то мы даем ему скроллить контент, а не тянуть шторку.
			if (grid.scrollTop > 0) return; 

			startY = e.touches?.[0]?.clientY ?? 0;
			isDragging = true;
			
			// Отключаем CSS-анимацию, чтобы шторка моментально прилипла к пальцу
			content.style.transition = 'none';
    }, { passive: true });

    content.addEventListener('touchmove', (e: TouchEvent) => {
			if (!isDragging) return;
			
			const currentY = e.touches?.[0]?.clientY ?? 0;
			currentDeltaY = currentY - startY;

			// Позволяем тянуть шторку только вниз
			if (currentDeltaY > 0) {
				// Предотвращаем стандартный скролл страницы браузером, пока тянем шторку
				if (e.cancelable) e.preventDefault(); 
				
				// Двигаем шторку за пальцем
				content.style.transform = `translateY(${currentDeltaY}px)`;
			}
    }, { passive: false }); // Важно: passive: false позволяет использовать preventDefault()

    content.addEventListener('touchend', () => {
			if (!isDragging) return;
			isDragging = false;

			// Включаем CSS-анимации обратно
			content.style.transition = '';

			// Если пользователь протянул шторку вниз больше чем на 100 пикселей — закрываем её
			if (currentDeltaY > 100) {
				bottomSheet.classList.remove('open');
				if (map) map.dragging.enable();
			}
			
			// Убираем ручной сдвиг, чтобы CSS-классы (скрыто/открыто) снова управляли позицией
			content.style.transform = '';
			currentDeltaY = 0;
    });
}


// Старт
Promise.all([loadMarkers(), loadZones(), loadCratesData()]).then(() => {
	applyFiltersFromURL()
	isInitialLoad = false;
	
	initMobileUI();
})


// --- ПЕРЕХВАТ СКРИНШОТОВ И АВТО-КОПИРОВАНИЕ ССЫЛКИ ---

function handleScreenshotAttempt() {
	const currentUrl = window.location.href;

	navigator.clipboard.writeText(currentUrl)
		.then(() => {
			setTimeout(() => alert(t('success_screenshot_msg')), 300);
		})
		.catch(() => {
			setTimeout(() => alert(t('fail_screenshot_msg')), 300);
		});
}

function checkScreenshotKeys(e: KeyboardEvent) {
	const key = e.key.toLowerCase();
	
	// Одиночный PrintScreen
	const isPrintScreen = key === 'printscreen';
	
	// Windows: Win + Shift + S (в браузерах клавиша Win считывается как metaKey)
	const isSnippingTool = (e.shiftKey && e.metaKey && (key === 's' || key === 'ы'));
	
	// macOS: Cmd + Shift + 3 / 4 / 5
	const isMacScreenshot = (e.shiftKey && e.metaKey && ['3', '4', '5'].includes(key));

	if (isPrintScreen || isSnippingTool || isMacScreenshot) {
		handleScreenshotAttempt();
	}
}

// Навешиваем слушатели на объект window
window.addEventListener('keydown', checkScreenshotKeys);
window.addEventListener('keyup', checkScreenshotKeys);


// --- ИНСТРУМЕНТ РАЗРАБОТЧИКА: РИСОВАНИЕ ЗОН (POLYGON) ---
if (isDev) {
	let isDrawingZone = false;
	let isEditMode = false;
	let zonePoints: [number, number][] = []; // Хранит [x, y]
	
	// Слой для предпросмотра
	const previewPolygon = L.polygon([], {
		color: '#ff0000',
		weight: 2,
		fillColor: '#ff0000',
		fillOpacity: 0.3,
		dashArray: '5, 5' // Пунктирная линия для предпросмотра
	}).addTo(map);

	// Создаем контрол на карте
	const drawControl = new L.Control({position: 'topleft'});
	drawControl.onAdd = function() {
		const div = L.DomUtil.create('div', 'dev-draw-panel');

		// Генерация списка доступных иконок для селекта
		const iconOptions = Object.keys(iconConfig).map(k => `<option value="${k}">${t(k as IconKeys)}</option>`).join('');
		
		div.innerHTML = `
			<div style="text-align:center; margin-bottom:5px; font-weight:bold; color:#4CAF50;">Dev: Zone Builder</div>
			<button id="dev-btn-toggle" class="dev-draw-btn">▶ Start Zone</button>
			<button id="dev-btn-undo" class="dev-draw-btn undo" disabled>↩ Undo Point</button>
			<button id="dev-btn-finish" class="dev-draw-btn" disabled>💾 Copy Zone JSON</button>
			<div id="dev-point-count" class="dev-point-count">Points: 0</div>
			
			<hr style="border:0; border-top:1px solid #555; margin:10px 0;">
			
			<div style="text-align:center; margin-bottom:5px; font-weight:bold; color:#2196F3;">Dev: Marker Editor</div>
			<label style="display:flex; align-items:center; gap:8px; cursor:pointer; background:#333; padding:5px; border-radius:4px; margin-bottom:8px;">
				<input type="checkbox" id="dev-check-edit-mode"> 
				<span>Enable Edit & Dragging</span>
			</label>

			<div style="background:#333; padding:6px; border-radius:4px; margin-bottom:8px; display:flex; flex-direction:column; gap:6px;">
				<label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
					<input type="checkbox" id="dev-check-add-mode"> <span>Click map to Add</span>
				</label>
				<select id="dev-new-marker-group" style="width:100%; background:#222; color:white; border:1px solid #555; padding:4px; border-radius:3px;">
					${iconOptions}
					<option value="location">📍 Location Text</option>
				</select>
			</div>

			<div style="background:#333; padding:6px; border-radius:4px; margin-bottom:8px; display:flex; flex-direction:column; gap:6px;">
				<select id="dev-group-select" style="width:100%; background:#222; color:white; border:1px solid #555; padding:4px; border-radius:3px;">
					${iconOptions}
				</select>
				<button id="dev-delete-group" class="dev-draw-btn stop">🗑️ Delete Group</button>
			</div>

			<div id="dev-marker-props" style="background:#444; padding:8px; border-radius:4px; margin-bottom:8px; display:none; flex-direction:column; gap:6px; border-left: 3px solid #f44336; font-size: 12px;">
				<div style="display:flex; justify-content:space-between; align-items:center; color:#ddd; font-weight:bold; gap: 5px;">
					<span>Selected Marker </span>
					<span id="dev-prop-coords" style="color:#aaa; font-family:monospace;">X: 0, Y: 0</span>
				</div>
				
				<div style="display:flex; flex-direction:column; gap:4px;">
					<label style="display:flex; justify-content:space-between; align-items:center;">Text:
						<input type="text" id="dev-prop-text" style="width:120px; background:#222; color:white; border:1px solid #555; padding:2px 4px; border-radius:3px;">
					</label>
					<label style="display:flex; justify-content:space-between; align-items:center;">Group:
						<input type="text" id="dev-prop-group" style="width:120px; background:#222; color:white; border:1px solid #555; padding:2px 4px; border-radius:3px;">
					</label>
					<label style="display:flex; justify-content:space-between; align-items:center;">Icon:
						<input type="text" id="dev-prop-icon" placeholder="default" style="width:120px; background:#222; color:white; border:1px solid #555; padding:2px 4px; border-radius:3px;">
					</label>
					<label style="display:flex; justify-content:space-between; align-items:center;">Image:
						<input type="text" id="dev-prop-image" style="width:120px; background:#222; color:white; border:1px solid #555; padding:2px 4px; border-radius:3px;">
					</label>
				</div>

				<label style="display:flex; flex-direction:column; gap:4px;">Angle: <span id="dev-angle-val" style="color:#ff9800; font-weight:bold;">0</span>°
					<input type="range" id="dev-marker-angle" min="0" max="360" value="0" style="width:100%;">
				</label>
				<button id="dev-btn-delete-marker" class="dev-draw-btn stop" style="padding:4px;">🗑️ Delete Marker</button>
			</div>

			<button id="dev-btn-export-markers" class="dev-draw-btn" style="background:#2196F3;">💾 Export All Markers</button>
		`;
		
		// Предотвращаем клики по панели от пробивания на карту
		L.DomEvent.disableClickPropagation(div);
		return div;
	};
	drawControl.addTo(map);

	// Функция переключения draggable состояния
	function toggleMarkersDraggable(enabled: boolean) {
		isEditMode = enabled;
		const allGroups = [...Object.values(groups), locationGroup];
		
		allGroups.forEach(group => {
			group.eachLayer(layer => {
				const marker = layer as L.Marker;
				if (marker.dragging) {
					if (enabled) marker.dragging.enable();
					else marker.dragging.disable();
				}
			});
		});

		// Визуальная индикация режима
		document.getElementById('map')!.style.cursor = enabled ? 'move' : '';
	}

	// Слушатель чекбокса
	(document.getElementById('dev-check-edit-mode') as HTMLInputElement).onchange = (e) => {
		const target = e.target as HTMLInputElement;
		toggleMarkersDraggable(target.checked);
		if (!target.checked) {
			selectedMarker = null;
			document.getElementById('dev-marker-props')!.style.display = 'none';
			updateMarkersScale();
		}
	};

	(document.getElementById('dev-check-add-mode') as HTMLInputElement).onchange = (e) => {
		const target = e.target as HTMLInputElement;
		if (target.checked) {
			document.getElementById('map')!.style.cursor = 'crosshair';
		} else {
			document.getElementById('map')!.style.cursor = isEditMode ? 'move' : '';
		}
	};

	// ОБРАБОТЧИКИ ИЗМЕНЕНИЙ СВОЙСТВ МАРКЕРА
	(document.getElementById('dev-prop-text') as HTMLInputElement).oninput = function(e) {
		const target = e.target as HTMLInputElement;
		if (!selectedMarker || !selectedMarker.options.sourceData) return;
		selectedMarker.options.sourceData.text = target.value as LangKeys;
		
		if (selectedMarker.options.sourceData.group === 'location') {
			selectedMarker.setIcon(L.divIcon({
				className: 'location-title',
				html: `<div>${t(target.value as LangKeys)}</div>`,
				iconSize: [200, 40],
				iconAnchor: [100, 20]
			}));
			updateMarkersScale(); // Чтобы вернуть выделение
		} else {
			selectedMarker.setPopupContent(getMarkerPopupContent(selectedMarker.options.sourceData));
		}
	};

	(document.getElementById('dev-prop-group') as HTMLInputElement).onchange = function(e) {
		const target = e.target as HTMLInputElement;
		if (!selectedMarker || !selectedMarker.options.sourceData) return;
		
		const oldGroup = selectedMarker.options.sourceData.group;
		if (oldGroup === target.value || target.value === '') return;
		const newGroup = target.value as GroupsKeys;
		
		selectedMarker.options.sourceData.group = newGroup as GroupsKeys;
		
		if (oldGroup !== 'location' && newGroup !== 'location') {
			if (groups[oldGroup]) groups[oldGroup].removeLayer(selectedMarker);
			
			if (!groups[newGroup]) {
				groups[newGroup] = L.layerGroup().addTo(map);
				updateLayersControl(); 
			}
			groups[newGroup].addLayer(selectedMarker);
		} else {
			alert("Смена типа между 'location' и другими группами требует перезагрузки страницы после сохранения JSON.");
		}
	};

	(document.getElementById('dev-prop-icon') as HTMLInputElement).onchange = function(e) {
		const target = e.target as HTMLInputElement;
		if (!selectedMarker || !selectedMarker.options.sourceData || selectedMarker.options.sourceData.group === 'location') return;
		
		const newIcon = target.value;
		if (newIcon) {
			selectedMarker.options.sourceData.icon = newIcon;
		} else {
			delete selectedMarker.options.sourceData.icon;
		}
		
		const key = newIcon || selectedMarker.options.sourceData.group;
		const [fileName, defaultSize] = iconConfig[key as IconKeys] || ['box.webp', 32];
		selectedMarker.options.baseFileName = fileName;
		selectedMarker.options.baseSize = defaultSize;
		
		updateSingleMarkerIcon(selectedMarker);
	};

	(document.getElementById('dev-prop-image') as HTMLInputElement).onchange = function(e) {
		const target = e.target as HTMLInputElement;
		if (!selectedMarker || !selectedMarker.options.sourceData || selectedMarker.options.sourceData.group === 'location') return;
		
		const newImage = target.value;
		if (newImage) {
			selectedMarker.options.sourceData.image = newImage;
		} else {
			delete selectedMarker.options.sourceData.image;
		}
		
		selectedMarker.setPopupContent(getMarkerPopupContent(selectedMarker.options.sourceData));
	};
		
	(document.getElementById('dev-marker-angle') as HTMLInputElement).oninput = function(e) {
		const target = e.target as HTMLInputElement;
		if (selectedMarker && selectedMarker.options.sourceData) {
			const angle = parseInt(target.value);
			document.getElementById('dev-angle-val')!.innerText = String(angle);
			selectedMarker.options.sourceData.angle = angle;
			updateMarkersScale(); // Перерисовка с новым углом
		}
	};

	(document.getElementById('dev-btn-delete-marker') as HTMLElement).onclick = () => {
		if (selectedMarker) {
			const group = selectedMarker.options.sourceData!.group;
			if (groups[group]) {
				groups[group].removeLayer(selectedMarker);
			} else if (group === 'location') {
				locationGroup.removeLayer(selectedMarker);
			}
			selectedMarker = null;
			document.getElementById('dev-marker-props')!.style.display = 'none';
			updateMarkersScale();
		}
	}

	// Логика экспорта всех маркеров
	(document.getElementById('dev-btn-export-markers') as HTMLInputElement).onclick = () => {
		const allMarkersData: MarkerJSON[] = [];
		
		// Собираем данные из всех категорий групп
		const allGroups = [...Object.values(groups), locationGroup];
		
		allGroups.forEach(group => {
			group.eachLayer(layer => {
				const marker = layer as L.Marker;
				if (marker.options.sourceData) {
					const currentPos = map.project(marker.getLatLng(), currentMapSize.maxZoom);
					const data = {...marker.options.sourceData, x: Math.round(currentPos.x), y: Math.round(currentPos.y) };
					if (!data.angle) delete data.angle; // Убираем пустой угол для чистоты JSON
					if (!data.icon) delete data.icon;

					// Клонируем объект, чтобы не мутировать оригинал при выводе, если нужно
					allMarkersData.push(data);
				}
			});
		});

		const jsonString = JSON.stringify(allMarkersData, null, 4);
		navigator.clipboard.writeText(jsonString).then(() => {
			// alert(`Успех! Данные всех маркеров (${allMarkersData.length} шт.) скопированы в буфер обмена в формате JSON.`);
			console.log("Exported Markers:", allMarkersData);
		});
	};

	// Глобальный перехват клика по карте для Dev Tools
	map.on('click', function(e) {
		if (isDrawingZone) {
			const point = map.project(e.latlng, 8);
			zonePoints.push([Math.round(point.x), Math.round(point.y)]);
			updateDrawUI();
			return;
		}

		const isEditModeChecked = (document.getElementById('dev-check-edit-mode') as HTMLInputElement)?.checked;
		const isAddModeChecked = (document.getElementById('dev-check-add-mode') as HTMLInputElement)?.checked;

		// Логика создания нового маркера
		if (isAddModeChecked) {
			const point = map.project(e.latlng, currentMapSize.maxZoom);
			const group = (document.getElementById('dev-new-marker-group') as HTMLInputElement).value;

			const m: MarkerJSON = {
				x: Math.round(point.x),
				y: Math.round(point.y),
				text: (group === 'location' ? "loc_new" : "item_" + group) as GroupsKeys,
				group: group as GroupsKeys,
				angle: 0
			};

			const newMarker =addMarker(m);
			openMarkerProperties(newMarker);

			if (isEditModeChecked) toggleMarkersDraggable(true); // делаем перетаскиваемым сразу
			return;
		}

		// Логика сброса выделения при клике в пустоту
		if (isEditModeChecked && selectedMarker) {
			selectedMarker = null;
			document.getElementById('dev-marker-props')!.style.display = 'none';
			updateMarkersScale();
			return;
		}
	});
		
	// Временно отключаем твой старый консольный лог при рисовании зон, 
	// чтобы не мешал, если нужно
	// const oldClick = map._events.click.find(fn => fn.ctx === map);
	// (Опционально: можно добавить проверку в твой старый обработчик клика, 
	// чтобы он не срабатывал, если isDrawingZone === true)

	// Остальная логика зон
	const btnToggle = document.getElementById('dev-btn-toggle') as HTMLInputElement;
	const btnUndo = document.getElementById('dev-btn-undo') as HTMLInputElement;
	const btnFinish = document.getElementById('dev-btn-finish') as HTMLInputElement;
	const pointCount = document.getElementById('dev-point-count') as HTMLInputElement;
	const btnDeleteGroup = document.getElementById('dev-delete-group') as HTMLButtonElement;
	const groupSelect = document.getElementById('dev-group-select') as HTMLSelectElement;

	function updateDrawUI() {
		btnUndo.disabled = zonePoints.length === 0;
		btnFinish.disabled = zonePoints.length < 3; // Для полигона нужно минимум 3 точки
		pointCount.innerText = `Points: ${zonePoints.length}`;
		
		// Обновляем полигон на карте
		const latlngs = zonePoints.map(p => map.unproject([p[0], p[1]], 8));
		previewPolygon.setLatLngs(latlngs);
	}

	btnToggle.onclick = () => {
		isDrawingZone = !isDrawingZone;
		if (isDrawingZone) {
			btnToggle.innerText = '⏹ Pause Recording';
			btnToggle.classList.add('stop');
			document.getElementById('map')!.style.cursor = 'crosshair';
		} else {
			btnToggle.innerText = '▶ Resume Recording';
			btnToggle.classList.remove('stop');
			document.getElementById('map')!.style.cursor = '';
		}
	};

	btnUndo.onclick = () => {
		zonePoints.pop();
		updateDrawUI();
	};

	btnFinish.onclick = () => {
		// Копируем в буфер обмена в формате JSON
		const jsonString = JSON.stringify(zonePoints);
		navigator.clipboard.writeText(jsonString).then(() => {
			// alert(`Скопировано ${zonePoints.length} точек в буфер обмена!\n\n${jsonString}`);
			
			// Сброс
			zonePoints = [];
			isDrawingZone = false;
			btnToggle.innerText = '▶ Start Recording';
			btnToggle.classList.remove('stop');
			document.getElementById('map')!.style.cursor = '';
			updateDrawUI();
		});
	};

	btnDeleteGroup.onclick = () => {
    const selectedGroup = groupSelect.value as GroupsKeys;

    if (!selectedGroup) return;

    const confirmDelete = confirm(`Вы уверены, что хотите полностью удалить группу "${selectedGroup}" с карты?`);
    if (!confirmDelete) return;

    // Очищаем маркеры внутри группы с помощью встроенного метода Leaflet
    if (groups[selectedGroup]) {
			groups[selectedGroup]!.clearLayers(); // Удаляет все маркеры этой группы с карты
			updateLayersControl();               // Обновляет интерфейс панели управления слоями
			
			alert(`Группа "${selectedGroup}" успешно очищена.`);
    } else {
			alert(`Группа "${selectedGroup}" пуста или еще не была создана.`);
    }
	};

}
// --- КОНЕЦ ИНСТРУМЕНТА РАЗРАБОТЧИКА ---
