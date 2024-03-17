/* eslint-disable no-console */
import { Random } from 'rocket-utility-belt';
import { addCoords, subtractCoords, forCircleNeighbors } from './ArrayCoordsUtils.js';
import { CURRENCIES } from './currencies.js';
import Grid2D from './Grid.js';
import Map from './Map.js';
import Nation from './Nation.js';
import City from './City.js';
import District from './District.js';
import Unit from './Unit.js';
import Resource from './Resource.js';
import Flag from './Flag.js';
import Collection from './Collection.js';

const DIR8DISTANCE = 1.5; // Distance to get all 8 squares ~ Math.hypot(1, 1) rounded up a bit
const MAX_FIND_ATTEMPTS = 200;
const MAP_SIZE = 20;
const TILE_SIZE = 18;
const MAX_RESOURCES = (MAP_SIZE * MAP_SIZE) / 8;
const wait = (ms = 1) => new Promise((resolve) => { setTimeout(resolve, ms); });
// Game data (collections, map)
const nations = new Collection(Nation);
const cities = new Collection(City);
const districts = new Collection(District);
const units = new Collection(Unit);
const resources = new Collection(Resource);
const flags = new Collection(Flag);
const map = new Map(MAP_SIZE, MAP_SIZE, TILE_SIZE);
let selectedAction = '';
const game = {
	turn: 0,
	nations,
	cities,
	districts,
	units,
	resources,
	flags,
	map,
	enemy1: null,
	pc: null, // The player character, e.g., leader, queen, king, president
	freeStuff() {
		CURRENCIES.forEach((currKey) => { playerNation[currKey] += 100; });
	},
};

const playerNation = nations.addNew('player', 'nation0', '#ffff00', map);
game.enemy1 = nations.addNew('enemy', 'nation1', '#ff0000', map);

// TODO: Make this efficient by keeping of all occupied cells?
function getOccupiedCells() {
	const allCoords = [];
	cities.forEach((a) => allCoords.push(a.coords));
	districts.forEach((a) => allCoords.push(a.coords));
	units.forEach((a) => allCoords.push(a.coords));
	resources.forEach((a) => allCoords.push(a.coords));
	flags.forEach((a) => allCoords.push(a.coords));
	return allCoords;
}

function findRandomUnoccupiedCell(occupiedCellsParam, i = 0) {
	if (i > MAX_FIND_ATTEMPTS) return null;
	const occupiedCells = occupiedCellsParam || getOccupiedCells();
	const [mapX, mapY] = map.size;
	const x = Random.randomInt(mapX);
	const y = Random.randomInt(mapY);
	const occupiedMatches = occupiedCells.reduce((sum, coords) => {
		if (coords[0] === x && coords[1] === y) return sum + 1;
		return sum;
	}, 0);
	if (occupiedMatches > 0) return findRandomUnoccupiedCell(occupiedCells, (i + 1)); // Keep trying
	return [x, y];
}

function isOccupied([x, y]) {
	const occupiedCells = getOccupiedCells();
	const matches = occupiedCells.reduce((sum, coords) => {
		if (coords[0] === x && coords[1] === y) return sum + 1;
		return sum;
	}, 0);
	return (matches > 0);
}

function spawnUnitAtCity(nationId, nationalClass, unitType, city, attempt = 0) {
	let dir = Random.pickRandom(Grid2D.DIRECTIONS);
	if (attempt > 20) {
		console.log('Trying to find location to spawn unit', attempt);
	}
	if (attempt > 50) { // Look farther out
		dir = [dir[0] * 2, dir[1] * 2];
	}
	if (attempt > 100) {
		console.error('Could not find spot for unit');
		return null;
	}
	const where = addCoords(city.coords, dir);
	if (isOccupied(where)) {
		return spawnUnitAtCity(nationId, nationalClass, unitType, city, (attempt + 1));
	}
	return units.addNew(nationId, nationalClass, unitType, where);
}

function setupPlayerNation() {
	const cityCoords = map.getRandomCoordinates('G');
	const city = cities.addNew(playerNation.id, cityCoords);
	playerNation.capital = city;
	playerNation.clearFog(cityCoords, 2);
	// resources.addNew([0, 0]);

	game.pc = units.addNew(playerNation.id, 'nation0', 'L', addCoords(city.coords, [-1, 1]), '@');
	game.pc.intelligent = 0;
	['W', 'A', 'M', 'E'].forEach((unitType) => {
		spawnUnitAtCity(playerNation.id, 'nation0', unitType, city);
	});
	units.forEach((unit) => {
		if (unit.nationId !== playerNation.id) return;
		playerNation.clearFog(unit.coords);
	});
	playerNation.claim(city.coords, 2, 0);
}

function setupEnemies() {
	let cityCoords = map.getRandomCoordinates('G');
	if (isOccupied(cityCoords)) cityCoords = map.getRandomCoordinates('G');
	if (isOccupied(cityCoords)) cityCoords = map.getRandomCoordinates('G');
	if (isOccupied(cityCoords)) throw Error('bad coords');
	game.enemy1.capital = cities.addNew(game.enemy1.id, cityCoords);
	game.enemy1.clearFog(cityCoords, 2);
	['L', 'W', 'W', 'E'].forEach((unitType) => {
		spawnUnitAtCity(game.enemy1.id, 'nation1', unitType, game.enemy1.capital);
	});
}

function setupWorld() {
	setupPlayerNation();
	setupEnemies();
}

function spawnUnitFlag(unit, type, coords) {
	if (!map.inBounds(coords[0], coords[1])) {
		console.warn('Cannot create flag here');
		return;
	}
	flags.addNew(unit.nationId, type, [unit.nationalClass], coords);
}

function doCombat(skill, attacker, defender) {
	console.log('COMBAT', skill, attacker, defender);
	// TODO: Do animation
	const attack = attacker.getSkill(skill) + Random.randomInt(2);
	const defend = defender.getDefenseVersusAttack(skill) + Random.randomInt(2);
	console.log(attack, 'vs', defend);
	if (attack > defend) {
		resources.addNew(defender.coords, 'corpse');
		defender.kill();
	}
	// if (defend - attack > ) {
	// 	// TODO: Do combat logic
	// 	resources.addNew(attacker.coords, 'corpse');
	// 	attacker.kill();
	// }
}

async function doUnitCommand(unit) {
	const cmd = unit.popCommand();
	if (!cmd) return false;
	const command = (typeof cmd === 'string') ? cmd : cmd[0];
	// const nation = nations.get(unit.nationId);
	await wait(50);
	if (command === 'move') {
		const [, x, y] = cmd;
		const [newX, newY] = unit.getMove(x, y);
		// console.log('Doing move command', x, y, newX, newY);
		if (!map.inBounds(newX, newY)) return false;
		unit.move(x, y);
		return true;
	}
	if (command === 'spawn') {
		const [, what, type, x, y] = cmd;
		const coords = unit.getMove(x, y);
		if (what === 'flag') spawnUnitFlag(unit, type, coords);
		return true;
	}
	if (command === 'attack') {
		const [, skill, coords] = cmd;
		const targetUnit = units.findAt(coords);
		if (!targetUnit) {
			console.warn(unit.id, 'could not attack', coords, ' - no unit found');
			return false;
		}
		doCombat(skill, unit, targetUnit);
	}
	return false;
}

function planAutoAttack(unit) {
	const attackSkill = unit.getAttackSkill();
	if (!attackSkill) return;
	const neighborEnemyCoords = [];
	forCircleNeighbors(unit.coords, DIR8DISTANCE, (x, y) => {
		const coords = [x, y];
		const neighbor = units.findAt(coords);
		if (!neighbor) return; // No one there
		if (neighbor.nationId === unit.nationId) return; // Friendly
		neighborEnemyCoords.push(coords);
	});
	if (!neighborEnemyCoords.length) return; // No one nearby, so do nothing
	const attackCoords = Random.pickRandom(neighborEnemyCoords);
	unit.clearCommands();
	unit.queueCommand(['attack', attackSkill, attackCoords]);
}

async function doUnitTurn(unit) {
	// Plan for auto-attack
	planAutoAttack(unit);
	// do the command
	await doUnitCommand(unit);
	const nation = nations.get(unit.nationId);
	// Then check if they can pick-up (harvest) a resource
	const resource = resources.findAt(unit.coords);
	if (resource && resource.canUnitPickUp(unit)) {
		const gains = resource.unitPicksUp(unit);
		nation.gain(gains);
		// TODO: If your nation then do animation and play a sound
		resources.remove(resource);
	}
	// Clear fog if possible
	const explore = unit.getSkill('explore');
	if (explore) {
		nation.clearFog(unit.coords, explore);
	}
	// Claim territory if possible
	const claim = unit.getSkill('claim');
	if (claim && map.isLand(unit.coords)) {
		nation.claim(unit.coords);
	}
	if (unit.isIntelligent()) plan(unit);
}

function magnetizeFlag(flag) {
	const unitId = flag.magnetize(units);
	if (!unitId) return;
	const unit = units.get(unitId);
	const [x, y] = subtractCoords(flag.coords, unit.coords);
	if (x === 0 && y === 0) {
		flags.remove(flag.id);
		return;
	}
	unit.queueCommand(['move', x, y]);
}

/** silly name - flags should attempt to draw in at least one unit */
function magnetizeFlags() {
	flags.forEach((flag) => magnetizeFlag(flag));
}

function spawnResources() {
	if (resources.size >= MAX_RESOURCES) {
		// console.warn('at max resources');
		return;
	}
	const coords = findRandomUnoccupiedCell();
	if (!coords) {
		// console.warn('cannot add without coords');
		return;
	}
	if (Random.chance(0.5)) return; // half chance of not spawning
	resources.addNew(coords);
}

function plan(unit) {
	const nation = nations.get(unit.nationId);
	// TODO: If there is a resource nearby then grab it or send a unit to it
	if (Random.chance(0.5)) {
		const coords = findRandomUnoccupiedCell();
		if (!coords) {
			console.warn('cannot plan without coords');
			return;
		}
		const relativeCoords = subtractCoords(coords, unit.coords);
		// console.log('Plan to go to', coords, 'via', relativeCoords);
		unit.queueCommand(['move', relativeCoords[0], relativeCoords[1]]);
		// TODO: add a few other commands to get closer to the destination
	} else {
		const dir = Random.pickRandom(Grid2D.DIRECTIONS);
		const nationalUnitTypes = nation.getNationalUnits(units)
			.filter((u) => !u.isIntelligent()) // only non-intelligent units (i.e., don't get self)
			.map((u) => u.type);
		const type = Random.pickRandom(nationalUnitTypes);
		// console.log(type, nationalUnitTypes);
		unit.queueCommand(['spawn', 'flag', type, dir[0], dir[1]]);
	}
}

function feedCities() {
	cities.forEach((city) => {
		const nation = nations.get(city.nationId);
		const feedCost = { food: 1 };
		if (!nation.canPay(feedCost)) return;
		nation.pay(feedCost);
		city.feed(feedCost);
	});
}

function enemyCheat() {
	const enemyNation = game.enemy1;
	const currKey = Random.pickRandom(CURRENCIES);
	const gains = {};
	gains[currKey] = 1;
	enemyNation.gain(gains);
	if (Random.random() > 0.95) {
		const unitType = Random.pickRandom(['W', 'W', 'W', 'E', 'A', 'M']);
		spawnUnitAtCity(enemyNation.id, enemyNation.nationalClass, unitType, enemyNation.capital);
	}
}

async function advanceTurn() {
	// First - Do player/leader's turn
	await doUnitTurn(game.pc);
	renderUnit(game.pc);
	magnetizeFlags();
	// Do all other unit's turns
	const unitsToGo = units.filter((u) => u !== game.pc);
	for (let i = 0; i < unitsToGo.length; i += 1) {
		const unit = unitsToGo[i];
		await doUnitTurn(unit); // eslint-disable-line no-await-in-loop
		renderUnit(unit);
	}
	// Spawn random resources
	spawnResources();
	enemyCheat();
	feedCities();
	cities.update();
	resources.update();
	units.update();
	flags.update();
	game.turn += 1;
	renderAll();
	checkGameOver();
}

function checkGameOver() {
	const enemyUnits = units.filter((u) => u.nationId === game.enemy1.id);
	if (enemyUnits.length === 0) {
		const mainElt = document.querySelector('main');
		mainElt.classList.add('game-won');
	}
	if (!game.pc.dead && !game.pc.removed) return;
	game.gameOver = true;
	const mainElt = document.querySelector('main');
	mainElt.classList.add('game-over');
}

async function advanceTurns(count = 0) {
	checkGameOver();
	await advanceTurn();
	if (game.pc.hasCommands() || count > 10) await advanceTurns((count + 1));
}

function getCellSize() {
	// const cellSize = getComputedStyle(document.body).getPropertyValue('--cell-size');
	const firstMapCell = document.querySelector('.map-cell');
	const rect = firstMapCell.getBoundingClientRect();
	// return [firstMapCell.offsetWidth, firstMapCell.offsetHeight];
	return [rect.width, rect.height];
}

function renderUI() {
	const moveWho = {
		'flag-E': 'Move Explorer',
		'flag-F': 'Move Farmer',
		'flag-W': 'Move Warrior',
		'flag-M': 'Move Merchant',
		'flag-A': 'Move Artist',
		'flag-B': 'Move Builder',
		'flag-S': 'Move Scientist',
	};
	const directionAction = (selectedAction) ? moveWho[selectedAction] : 'Move Leader';
	document.getElementById('direction-action-text').innerHTML = directionAction;
	playerNation.forEachCurrency((currName, value) => {
		document.getElementById(`stats-${currName}`).innerText = value;
	});
	document.querySelectorAll('.action-list button').forEach((elt) => {
		const { classList } = elt;
		if (selectedAction && classList.contains(selectedAction)) {
			classList.add('selected-action');
		} else {
			classList.remove('selected-action');
		}
	});
	// document.querySelector(`.${selectedAction}`).classList.add('selected-action');
}

function renderUnit(unit) {
	const cellSize = getCellSize();
	unit.render(cellSize);
}

function renderAll() {
	const cellSize = getCellSize();
	cities.render(cellSize);
	units.render(cellSize);
	resources.render(cellSize);
	flags.render(cellSize);
	playerNation.render(map, 'map-player-fog');
	renderUI();
}

function getMainElementClassList() {
	return document.querySelector('main').classList;
}

function showInfo(html) {
	getMainElementClassList().add('show-info');
	const infoElt = document.getElementById('info-content');
	infoElt.innerHTML = html;
}

function hideInfo() {
	const infoElt = document.getElementById('info-content');
	infoElt.innerHTML = '';
	getMainElementClassList().remove('show-info');
}

function showUnitInfo(unit) {
	// TODO: make unit info html
	const html = unit.getInfoHtml();
	showInfo(html);
}

function hideCityInfo() {
	const infoElt = document.getElementById('city-info-content');
	infoElt.innerHTML = '';
	getMainElementClassList().remove('show-city-view');
}

function showCityInfo(city) {
	const nation = nations.get(city.nationId);
	getMainElementClassList().add('show-city-view');
	document.getElementById('city-info-content').innerHTML = city.getInfoHtml();
	document.getElementById('city-interface').innerHTML = city.getInterfaceHtml(nation);
}

/* ---------- Actions ----------- */

function selectAction(n) {
	selectedAction = n;
	renderUI();
}

function doDirectionAction(dir) {
	const [x, y] = dir;
	if (selectedAction) {
		const actionComponents = selectedAction.split('-');
		if (actionComponents[0] === 'flag') {
			game.pc.queueCommand(['spawn', 'flag', actionComponents[1], x, y]);
		}
		selectAction('');
	} else {
		game.pc.queueCommand(['move', x, y]);
	}
	advanceTurns(1);
}

function doCityUnitUpgrade(cityId, unitType) {
	const city = cities.get(cityId);
	const nation = nations.get(city.nationId);
	const cost = city.getUnlockUnitTierCost(unitType);
	if (!nation.canPay(cost)) return;
	nation.pay(cost);
	city.unlockUnitTier(unitType);
	renderAll();
}

function doCityUnitBuild(cityId, unitType) {
	const city = cities.get(cityId);
	const nation = nations.get(city.nationId);
	const cost = city.getUnitBuildCost(unitType);
	if (!nation.canPay(cost)) return;
	nation.pay(cost);
	const unit = spawnUnitAtCity(nation.id, nation.nationalClass, unitType, city);
	unit.tier = city.getUnitTier(unitType);
	renderAll();
}

const CLASS_ACTION_MAP = {
	'dir-up-left': () => { doDirectionAction(Grid2D.NW); },
	'dir-up': () => { doDirectionAction(Grid2D.N); },
	'dir-up-right': () => { doDirectionAction(Grid2D.NE); },
	'dir-left': () => { doDirectionAction(Grid2D.W); },
	'dir-none': () => { doDirectionAction(Grid2D.ZERO); },
	'dir-right': () => { doDirectionAction(Grid2D.E); },
	'dir-down-left': () => { doDirectionAction(Grid2D.SW); },
	'dir-down': () => { doDirectionAction(Grid2D.S); },
	'dir-down-right': () => { doDirectionAction(Grid2D.SE); },
	'flag-E': () => selectAction('flag-E'),
	'flag-F': () => selectAction('flag-F'),
	'flag-W': () => selectAction('flag-W'),
	'flag-M': () => selectAction('flag-M'),
	'flag-A': () => selectAction('flag-A'),
	'flag-B': () => selectAction('flag-B'),
	'flag-S': () => selectAction('flag-S'),
	'move-wait': () => {
		advanceTurns(1);
		selectAction('');
	},
};
const ACTION_CLASSES = Object.keys(CLASS_ACTION_MAP);

const CLICK_EVENTS = [
	{
		selector: '#actions',
		handler: (e) => {
			const matchedClasses = ACTION_CLASSES.filter(
				(className) => e.target.classList.contains(className),
			);
			if (matchedClasses.length) {
				CLASS_ACTION_MAP[matchedClasses[0]](e);
			}
		},
	},
	{
		selector: '#map-units',
		handler: (e) => {
			const unitElt = e.target.closest('.unit');
			if (!unitElt) return;
			const unit = units.get(unitElt.dataset.id);
			showUnitInfo(unit);
		},
	},
	{
		selector: '#map-cities',
		handler: (e) => {
			const cityElt = e.target.closest('.city');
			if (!cityElt) return;
			const city = cities.get(cityElt.dataset.id);
			showCityInfo(city);
		},
	},
	{
		selector: '#city-view',
		handler: (e) => {
			if (e.target.closest('.close-button')) {
				hideCityInfo();
			}
			const buyButton = e.target.closest('.buy-unit');
			if (buyButton) {
				const { city, type } = buyButton.dataset;
				doCityUnitBuild(city, type);
				hideCityInfo();
			}
			const upgradeButton = e.target.closest('.upgrade-unit');
			if (upgradeButton) {
				const { city, type } = upgradeButton.dataset;
				doCityUnitUpgrade(city, type);
				hideCityInfo();
			}
		},
	},
	{
		selector: '#info',
		handler: (e) => {
			if (!e.target.closest('.close-button')) return;
			hideInfo();
		},
	},
];

/** Only run this once */
function setupEvents() {
	CLICK_EVENTS.forEach(({ selector, handler }) => {
		document.querySelector(selector).addEventListener('click', handler);
	});
}

document.addEventListener('DOMContentLoaded', () => {
	setupWorld();
	setupEvents();
	map.render();
	renderAll();
});

// Expose for testing
window.map = map;
window.game = game;
// window.findRandomUnoccupiedCell = findRandomUnoccupiedCell;
