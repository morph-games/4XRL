import makeRandomId from './makeRandomId.js';
import { getDistance } from './ArrayCoordsUtils.js';

export default class MapEntity {
	constructor(coords, letter = 'E', classes = ['thing'], containerId = 'map-cities') {
		this.id = makeRandomId(letter);
		this.coords = coords;
		this.classes = classes;
		this.containerId = containerId;
		this.removed = false;
		this.decay = Infinity;
	}

	update() {
		this.decay -= 1;
		if (this.decay <= 0) this.remove();
	}

	remove() {
		this.removed = true;
		this.derez();
	}

	move(x, y) {
		this.coords[0] += x;
		this.coords[1] += y;
	}

	getMove(x, y) {
		return [this.coords[0] + x, this.coords[1] + y];
	}

	/** Name - only rendered once - Override this */
	getName() { // eslint-disable-line class-methods-use-this
		return '';
	}

	/** Inside html - rendered each time - Override this */
	getInnerHtml() { // eslint-disable-line class-methods-use-this
		return '';
	}

	getDistance(coords) {
		return getDistance(this.coords, coords);
	}

	getClassList() {
		return [
			this.id,
			...this.classes,
		];
	}

	// ---------- Render / DOM methods

	getContainerElement() {
		return document.getElementById(this.containerId);
	}

	getElement(containerEltParam) {
		const containerElt = containerEltParam || this.getContainerElement();
		return (containerElt.querySelector(`.${this.id}`));
	}

	derez() {
		this.removed = true;
		const elt = this.getElement();
		if (elt) elt.remove();
	}

	render(cellSize) {
		if (this.removed) {
			this.derez();
			return;
		}
		const containerElt = this.getContainerElement();
		let elt = this.getElement(containerElt);
		if (!elt) {
			elt = document.createElement('div');
			elt.dataset.id = this.id;
			const name = this.getName();
			if (name) elt.title = name;
			containerElt.appendChild(elt);
		}
		try {
			elt.classList.add(...this.getClassList());
		} catch (err) {
			console.log(elt);
			throw Error(err);
		}
		elt.innerHTML = this.getInnerHtml() || '';
		const [x, y] = this.coords;
		const [cellSizeX, cellSizeY] = cellSize;
		elt.style.transform = `translate(${x * cellSizeX}px, ${y * cellSizeY}px)`;
		// elt.style.left = `${x * cellSizeX}px`;
		// elt.style.top = `${y * cellSizeY}px`;
	}
}
