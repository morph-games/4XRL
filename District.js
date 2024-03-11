import MapEntity from './MapEntity.js';

export default class District extends MapEntity {
	constructor(nationId, cityId, coords) {
		super(coords, 'D', ['district'], 'map-districts');
		this.cityId = cityId;
		this.nationId = nationId;
	}
}
