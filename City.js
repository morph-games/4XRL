import MapEntity from './MapEntity.js';
import UNIT_TYPES from './UnitTypes.js';
import { CURRENCY_EMOJIS } from './currencies.js';

const MAX_TIER = 9;

export default class City extends MapEntity {
	constructor(nationId, coords) {
		super(coords, 'C', ['city'], 'map-cities');
		this.nationId = nationId;
		this.population = 1;
		this.availableUnitTiers = {
			E: 1,
			W: 1,
			A: 0,
			M: 0,
			B: 0,
			S: 0,
			F: 1,
		};
		this.food = 0;
	}

	getMaxTier() {
		return Math.min(this.population, MAX_TIER);
	}

	static getTieredCost(cost, tier = 1) {
		const finalCost = {};
		Object.keys(cost).forEach((currKey) => {
			finalCost[currKey] = (cost[currKey] || 0) * tier;
		});
		return finalCost;
	}

	getUnitTier(unitType) {
		return this.availableUnitTiers[unitType];
	}

	getUnitBuildCost(unitType) {
		const { cost } = UNIT_TYPES[unitType];
		const tier = this.getUnitTier(unitType);
		const finalCost = City.getTieredCost(cost, tier);
		return finalCost;
	}

	getUnlockUnitTierCost(unitType) {
		const tier = this.getUnitTier(unitType);
		if (tier >= this.getMaxTier()) {
			return {};
		}
		const { cost } = UNIT_TYPES[unitType];
		const finalCost = City.getTieredCost(cost, 1);
		finalCost.science = (finalCost.science || 0) + ((tier + 1) * 2);
		return finalCost;
	}

	unlockUnitTier(unitType) {
		this.availableUnitTiers[unitType] = Math.min(
			this.availableUnitTiers[unitType] + 1,
			this.getMaxTier(),
		);
	}

	getPopFoodThreshold() {
		return this.population * 5;
	}

	feed(resources = {}) {
		this.food += (resources.food || 0);
		const popFoodThreshold = this.getPopFoodThreshold();
		if (this.food <= popFoodThreshold) return;
		this.food -= popFoodThreshold;
		this.population += 1;
	}

	getInfoHtml() {
		return `<h1>City <span class="pop">Pop: ${this.population}</span></h1>
			<div>🌾${this.food}/${this.getPopFoodThreshold()}</div>
		`;
	}

	getInterfaceHtml(nation) {
		const unitKeys = Object.keys(this.availableUnitTiers);
		const getCostHtml = (cost) => Object.keys(cost)
			.map((currKey) => `${cost[currKey]}${CURRENCY_EMOJIS[currKey]}`)
			.join(' ');
		const buildListItems = unitKeys.map((unitTypeKey) => {
			const tier = this.availableUnitTiers[unitTypeKey];
			const unitType = UNIT_TYPES[unitTypeKey];
			const cost = this.getUnitBuildCost(unitTypeKey);
			const disabled = !nation.canPay(cost);
			const buttonHtml = `
				<button type="button"
					${(disabled) ? 'disabled="disabled"' : ''}
					class="buy-unit"
					data-type="${unitTypeKey}"
					data-city="${this.id}"
					data-tier="${tier}"
					>
					<span class="city-unit-cost">${getCostHtml(cost)}</span>
				</button>`;
			return `<li>
				<span>(${unitTypeKey}) ${unitType.name} <span class="tier">${tier}</span></span>
				${(!tier) ? 'N/A' : buttonHtml}
			</li>`;
		});
		const upgradeListItems = unitKeys.map((unitTypeKey) => {
			const tier = this.availableUnitTiers[unitTypeKey];
			const unitTypeObj = UNIT_TYPES[unitTypeKey];
			const cost = this.getUnlockUnitTierCost(unitTypeKey);
			const atMax = (tier === this.getMaxTier());
			const disabled = (atMax) ? true : !nation.canPay(cost);
			const tierHtml = (atMax) ? 'MAX' : `${tier} &rarr; ${tier + 1}`;
			const costHtml = (atMax) ? 'Raise pop' : getCostHtml(cost);
			return `<li>
				<span>(${unitTypeKey}) ${unitTypeObj.name} <span class="tier">${tierHtml}</span></span>
				<button type="button"
					${(disabled) ? 'disabled="disabled"' : ''}
					class="upgrade-unit"
					data-type="${unitTypeKey}"
					data-city="${this.id}"
					>
					${costHtml}
				</button>
			</li>`;
		});
		return `
			<div class="city-units">
				<input type="radio" id="show-build-list" name="show-city-list" checked="checked" />
				<label for="show-build-list">Build</label>
				<input type="radio" id="show-upgrade-list" name="show-city-list" />
				<label for="show-upgrade-list">Upgrade</label>
				<ul id="city-build-list">${buildListItems.join('')}</ul>
				<ul id="city-upgrade-list">${upgradeListItems.join('')}</ul>
			</div>
		`;
	}

	getName() {
		const [x, y] = this.coords;
		return `City (${x}, ${y})`;
	}

	getInnerHtml() {
		return this.population;
	}
}
