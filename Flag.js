import MapEntity from './MapEntity.js';

export default class Flag extends MapEntity {
	constructor(nationId, type, classes = [], coords = []) {
		super(coords, 'F', ['flag', ...classes], 'map-flags');
		this.nationId = nationId;
		this.type = type;
		this.followUnitId = null; // TODO: for a targeted flag
		this.magnetizedUnitId = null;
		this.decay = 50;
	}

	magnetize(units) {
		// Do we already have a unit to pull in?
		if (this.magnetizedUnitId && units.get(this.magnetizedUnitId)) {
			// units[this.magnetizedUnitId].flagId = this.id;
			return this.magnetizedUnitId;
		}
		const unitDistances = {};
		// Find a unit for this nation and type, and calculate distance while we're looping
		const nationsUnitsOfType = units.getKeys().filter(
			(unitId) => {
				const unit = units.get(unitId);
				const isOption = (unit.nationId === this.nationId && unit.type === this.type);
				if (isOption) {
					unitDistances[unitId] = unit.getDistance(this.coords);
				}
				return isOption;
			},
		);
		if (nationsUnitsOfType.length === 0) return null;
		nationsUnitsOfType.sort(
			(unitIdA, unitIdB) => (unitDistances[unitIdA] - unitDistances[unitIdB]),
		);
		const [closestUnitId] = nationsUnitsOfType;
		this.magnetizedUnitId = closestUnitId;
		return this.magnetizedUnitId;
	}

	/* ---- for rendering ---- */
	getClassList() {
		return [this.id, ...this.classes];
	}

	getInnerHtml() {
		return `🚩<sup>${this.type}</sup>`;
	}
}
