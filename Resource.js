import Random from 'rocket-utility-belt/src/Random.js';
import MapEntity from './MapEntity.js';

const RESOURCE_TYPES = {
	wheat: {
		currency: 'food',
		pickUpSkill: 'harvest',
		amount: 1,
		emoji: '🌾',
		// 🥞🍔🍕🍞🥖🥨🍖🥩🍗🍩🍇🍉🍎🍓🍒🍅🌽🫑🥦🥑🍄🥔🥕🫛🥜🫘',
	},
	discovery: {
		currency: 'science',
		pickUpSkill: 'research',
		amount: 1,
		emoji: '🧪',
		// ⚗️🧪🧫🧬🔬🔭'
	},
	artwork: {
		currency: 'culture',
		pickUpSkill: 'craft',
		amount: 1,
		emoji: '🎭',
		// 🎶🎵🎼🎸🎺🎊🎡🎪🖼️🎨🪅🎳🎣🥍🏏🎾♟️🃏🀄🪇🥁🪘🎷🎺🎸🪕🎻🎹🗿📺📽️🎥🎬📹🏮✏️🖋️🖊️🖌️'
	},
	riches: {
		currency: 'gold',
		pickUpSkill: 'invest',
		amount: 1,
		emoji: '🪙',
		// 💎👑💰💴💵💶💷💳📈'
	},
	production: {
		currency: 'production',
		pickUpSkill: 'produce',
		amount: 1,
		emoji: '⚙️',
		// 🧵🧶🪡🪓🔨⛏️⚒️🛠️🔧🪛🔩🪨🪵🧱🗜️🪚💻🖥️🖨️⌨️📡📊📈📏📐📎🖇️✂️🗄️🗃️'
	},
	corpse: {
		currency: 'blood',
		pickUpSkill: 'produce',
		amount: 1,
		decay: 10,
		emoji: '💀',
	},
};
const PICK_FROM = ['wheat', 'discovery', 'artwork', 'riches', 'production'];

export default class Resource extends MapEntity {
	constructor(coords, type = 'random') {
		super(coords, 'R', ['resource'], 'map-resources');
		this.type = type;
		if (this.type === 'random' || !this.type) this.assignRandomType();
		this.decay = RESOURCE_TYPES[this.type].decay || Infinity;
	}

	assignRandomType() {
		this.type = Random.pickRandom(PICK_FROM);
		return this.type;
	}

	getPickUpSkill() {
		return RESOURCE_TYPES[this.type].pickUpSkill;
	}

	canUnitPickUp(unit) {
		const skill = this.getPickUpSkill();
		return unit.getSkill(skill) > 0;
	}

	unitPicksUp(unit) {
		const gain = {};
		if (!this.canUnitPickUp(unit)) return gain;
		const skill = this.getPickUpSkill();
		const { currency, amount } = RESOURCE_TYPES[this.type];
		gain[currency] = unit.getSkill(skill) * amount;
		return gain;
	}

	getName() {
		return this.type;
	}

	getInnerHtml() {
		return RESOURCE_TYPES[this.type].emoji;
	}
}
