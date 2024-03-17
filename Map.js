import { randInt } from './random.js';
import Grid2D from './Grid.js';

const TERRAIN_TYPES = {
	W: {
		name: 'water',
		land: false,
	},
	G: {
		name: 'ground',
		land: true,
	},
};
// const TERRAIN_TYPE_KEYS = Object.keys(TERRAIN_TYPES);
const NOOP = () => {};

export default class Map {
	constructor(x, y, tileSize = 18) {
		this.size = [x, y];
		this.terrain = new Grid2D(this.size, null);
		this.tileSize = tileSize;
		this.generate();
	}

	getPixelSize() {
		return [this.size[0] * this.tileSize, this.size[1] * this.tileSize];
	}

	loopOverMap(cellFn = NOOP, rowStartFn = NOOP, rowEndFn = NOOP) {
		return this.terrain.forEachCell(cellFn, rowStartFn, rowEndFn);
	}

	inBounds(...coordinateArgs) {
		return this.terrain.inBounds(...coordinateArgs);
	}

	getTerrainTypeObject(coords) {
		return TERRAIN_TYPES[this.terrain.get(coords)];
	}

	isLand(coords) {
		if (!this.inBounds(coords)) return false;
		const typeObj = this.getTerrainTypeObject(coords);
		return typeObj.land;
	}

	generate() {
		const LAND_CHANCE_BONUS = 0.1;
		const [mapX, mapY] = this.size;
		const centerX = mapX / 2;
		const centerY = mapY / 2;
		const maxDistance = Math.hypot(centerX, centerY);
		this.terrain.clear();
		const randTerrKey = (x, y) => {
			const distanceToCenter = Math.hypot(centerX - x, centerY - y);
			const distCenterUnit = distanceToCenter / maxDistance; // 0 at center, 1 at max
			const isLand = (Math.random() + LAND_CHANCE_BONUS > distCenterUnit);
			return isLand ? 'G' : 'W';
		};
		this.loopOverMap((x, y) => {
			this.terrain.set(x, y, randTerrKey(x, y));
		});
		this.loopOverMap((x, y) => {
			if (this.terrain.onEdge(x, y)) this.terrain.set(x, y, 'W');
		});
	}

	render() {
		let mapHtml = '';
		this.loopOverMap(
			(x, y) => {
				const terrKey = this.terrain.get(x, y);
				mapHtml += `<div class="map-cell map-terrain-${terrKey}" id="map-cell-${x}-${y}"></div>`;
			},
			() => {
				mapHtml += '<div class="map-row">';
			},
			() => {
				mapHtml += '</div>';
			},
		);
		document.getElementById('map-terrain').innerHTML = mapHtml;
	}

	getRandomCoordinates(terrType) {
		if (!terrType) {
			const [mapX, mapY] = this.size;
			return [randInt(0, mapX), randInt(0, mapY)];
		}
		const ATTEMPTS = 1000;
		let coords = [0, 0];
		for (let i = 0; i < ATTEMPTS; i += 1) {
			coords = this.getRandomCoordinates();
			const [x, y] = coords;
			if (this.terrain.get(x, y) === terrType) return coords;
		}
		return coords;
	}
}
