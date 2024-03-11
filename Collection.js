export default class Collection extends Map {
	constructor(MyClass) {
		super();
		this.MyClass = MyClass;
	}

	update() {
		this.forEach((item) => {
			if (item.update) item.update();
			if (item.removed) this.remove(item);
		});
	}

	add(item) {
		if (!item.id) throw new Error('Can only add items with an id');
		super.set(item.id, item);
	}

	addNew(...args) {
		const newThing = new this.MyClass(...args);
		if (newThing.setup) newThing.setup();
		this.add(newThing);
		return newThing;
	}

	remove(itemOrId) {
		const id = (typeof itemOrId === 'object') ? itemOrId.id : itemOrId;
		const item = this.get(id);
		// console.log('Removing', item, 'from', this.MyClass.name);
		item.remove();
		this.delete(id);
	}

	getKeys() {
		return Array.from(this.keys());
	}

	findAt(coords = []) {
		let found;
		const [x, y] = coords;
		this.forEach((item) => {
			if (item.coords[0] === x && item.coords[1] === y) found = item;
		});
		return found;
	}

	/** Returns an array of the collection's contents */
	filter(checkFn) {
		const filtered = [];
		this.forEach((item) => {
			if (checkFn(item)) filtered.push(item);
		});
		return filtered;
	}

	render(cellSize) {
		this.forEach((item) => {
			item.render(cellSize);
		});
	}
}
