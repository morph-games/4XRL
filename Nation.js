import makeRandomId from './makeRandomId.js';
import Grid2D from './Grid.js';
import { forCircleNeighbors } from './ArrayCoordsUtils.js';
import { CURRENCIES } from './currencies.js';

const TWO_PI = Math.PI * 2;

export default class Nation {
	constructor(id, nationalClass, color, map) {
		this.color = color;
		this.nationalClass = nationalClass;
		this.id = id || makeRandomId('N');
		// this.cities = {};
		CURRENCIES.forEach((currName) => {
			this[currName] = 0;
		});
		this.blood = 0; // Not a "real" currency yet.
		this.fog = new Grid2D(map.size, 1);
		this.borders = new Grid2D(map.size, 0);
		this.map = map;
		this.capital = null;
	}

	forEachCurrency(callback) {
		CURRENCIES.forEach((currName) => {
			callback(currName, this[currName]);
		});
	}

	/* gain resources provided in an object */
	gain(gains = {}) {
		this.forEachCurrency((currName) => {
			if (gains[currName]) this[currName] += Number(gains[currName]);
		});
	}

	canPay(cost = {}) {
		let canPay = true;
		this.forEachCurrency((currName) => {
			if (this[currName] < Number(cost[currName] || 0)) {
				canPay = false;
			}
		});
		return canPay;
	}

	/* opposite of gain - reduce national resources */
	pay(cost = {}) {
		this.forEachCurrency((currName) => {
			if (cost[currName]) this[currName] -= Number(cost[currName]);
		});
	}

	claim(coords, size = 0.72, cost = 1) {
		if (this.borders.get(coords) >= size) return false; // already have border there
		if (this.culture < cost) return false; // cannot afford
		this.culture -= cost;
		this.borders.set(coords, size);
		return true;
	}

	clearFog(centerCoords, distance = 0) {
		this.fog.set(centerCoords, 0);
		forCircleNeighbors(centerCoords, distance, (x, y) => {
			this.fog.set(x, y, 0);
		});
	}

	getNationalUnits(unitsCollection) {
		return unitsCollection.filter((u) => u.nationId === this.id);
	}

	renderBorder(pixelSize, tileSize, eltId = 'map-borders') {
		const elt = document.getElementById('map-borders-fill');
		const [w, h] = pixelSize;
		elt.width = w;
		elt.height = h;
		const ctx = elt.getContext('2d');
		ctx.clearRect(0, 0, w, h);
		const halfTileSize = tileSize / 2;
		this.borders.forEachCell((x, y) => {
			if (!this.borders.get(x, y)) return;
			const circleX = (x * tileSize) + halfTileSize;
			const circleY = (y * tileSize) + halfTileSize;
			ctx.beginPath();
			ctx.arc(circleX, circleY, this.borders.get(x, y) * tileSize, 0, TWO_PI);
			ctx.fillStyle = '#fff';
			ctx.fill();
			ctx.closePath();
		});
		// Now figure out the actual borders
		const borderElt = document.getElementById(eltId);
		borderElt.width = w;
		borderElt.height = h;
		const borderCtx = borderElt.getContext('2d');
		borderCtx.clearRect(0, 0, w, h);
		borderCtx.fillStyle = this.color;

		const imageData = ctx.getImageData(0, 0, w, h);
		const { data } = imageData;
		const pixels = w * h;
		const ALPHA_THRESHOLD = 0.8;
		for (let px = 0; px < pixels; px += 1) {
			const i = px * 4;
			const alphaIndex = i + 3;
			const yOffset = w * 4;
			const alpha = data[alphaIndex];
			if (alpha > ALPHA_THRESHOLD) continue; // eslint-disable-line no-continue
			const alphaMinusX = data[alphaIndex - 4]; // Previous -1 x pixel
			const alphaPlusX = data[alphaIndex + 4]; // Next +1 x pixel
			const alphaMinusY = data[alphaIndex - yOffset]; // Previous -1 y pixel
			const alphaPlusY = data[alphaIndex + yOffset]; // Next +1 y pixel
			if ((alphaPlusX && alphaPlusX > ALPHA_THRESHOLD)
				|| (alphaMinusX && alphaMinusX > ALPHA_THRESHOLD)
				|| (alphaPlusY && alphaPlusY > ALPHA_THRESHOLD)
				|| (alphaMinusY && alphaMinusY > ALPHA_THRESHOLD)
			) {
			// if (alphaPlusX || alphaMinusX || alphaPlusY || alphaMinusY) {
				const y = parseInt(px / w, 10);
				const x = px - y * w;
				borderCtx.fillRect(x, y, 1, 1);
			}
			// console.log(r);
		}
		borderCtx.fill();
	}

	/*
			const ALPHA_THRESHOLD = 0.5;
		for (let px = 0; px < pixels; px += 1) {
			const i = px * 4;
			const alphaIndex = i + 3;
			const yOffset = w * 4;
			const alpha = data[alphaIndex];
			// if (alpha > ALPHA_THRESHOLD) return;
			if (alpha !== 0) return;
			const alphaMinusX = data[alphaIndex - 4]; // Previous -1 x pixel
			const alphaPlusX = data[alphaIndex + 4]; // Next +1 x pixel
			const alphaMinusY = data[alphaIndex - yOffset]; // Previous -1 y pixel
			const alphaPlusY = data[alphaIndex + yOffset]; // Next +1 y pixel
			// if (alphaPlusX > ALPHA_THRESHOLD || alphaMinusX > ALPHA_THRESHOLD
			// 	|| alphaPlusY > ALPHA_THRESHOLD || alphaMinusY > ALPHA_THRESHOLD
			// ) {
			if (alphaPlusX || alphaMinusX || alphaPlusY || alphaMinusY) {
				const y = parseInt(px / w, 10);
				const x = px - y * w;
				borderCtx.fillRect(x, y, 1, 1);
			}
			// console.log(r);
		}
		*/

	renderFog(pixelSize, tileSize, eltId = 'map-fog') {
		const elt = document.getElementById(eltId);
		if (!elt) throw Error(`Could not render fog to ${eltId}`);
		const [w, h] = pixelSize;
		elt.width = w;
		elt.height = h;
		const ctx = elt.getContext('2d');
		ctx.clearRect(0, 0, w, h);
		ctx.beginPath();
		this.fog.forEachCell((x, y) => {
			if (!this.fog.get(x, y)) return;
			ctx.rect(x * tileSize, y * tileSize, tileSize, tileSize);
		});
		ctx.fillStyle = '#000'; // `rgba(0, 0, 0, 0.9)`; // ${this.fog[y][x]})`;
		ctx.fill();
		ctx.closePath();
	}

	render(mapParam, fogEltId) {
		const map = mapParam || this.map;
		const pixelSize = map.getPixelSize();
		this.renderFog(pixelSize, map.tileSize, fogEltId);
		this.renderBorder(pixelSize, map.tileSize);
	}
}
