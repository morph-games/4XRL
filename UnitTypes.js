const BASE_DEFENSE = {
	attack: 0,
	convert: 0,
	bribe: 0,
};
export default {
	L: {
		name: 'Leader',
		intelligent: 1, // Will be given AI commands (if non player)
		explore: 0.5,
		defense: {
			...BASE_DEFENSE,
			bribe: 2,
			convert: 2,
		},
		// claim: 1,
		harvest: 1,
		// command: 1,
		research: 1,
		craft: 1,
		invest: 1,
		produce: 1,
		specialNotes: 'Can set flags to rally units',
		cost: null, // Cannot be purchased
	},
	W: {
		name: 'Warrior',
		attack: 2,
		defense: {
			...BASE_DEFENSE,
			attack: 1,
			bribe: 2,
		},
		harvest: 0,
		invest: 1,
		produce: 1,
		specialNotes: 'Good vs. Merchants',
		cost: {
			production: 2,
			gold: 1,
		},
	},
	A: {
		name: 'Artist',
		// Combat
		convert: 2,
		defense: {
			...BASE_DEFENSE,
			attack: 2,
			convert: 1,
		},
		// Special
		claim: 1,
		// Harvest
		harvest: 1,
		research: 1,
		craft: 3,
		invest: 1,
		specialNotes: 'Can claim territory; Good vs. Warriors',
		cost: {
			culture: 2,
			production: 1,
		},
	},
	M: {
		name: 'Merchant',
		bribe: 2,
		defense: {
			...BASE_DEFENSE,
			bribe: 1,
			convert: 2,
		},
		harvest: 1,
		research: 1,
		invest: 3,
		craft: 1,
		produce: 1,
		specialNotes: 'Good vs. Artists',
		cost: {
			gold: 2,
			production: 1,
		},
	},
	E: {
		name: 'Scout',
		explore: 1.5,
		defense: { ...BASE_DEFENSE },
		harvest: 1,
		research: 1,
		craft: 1,
		invest: 1,
		produce: 1,
		specialNotes: 'Can remove fog of war 1 square in all directions',
		cost: {
			production: 2,
		},
	},
	B: {
		name: 'Builder',
		defense: { ...BASE_DEFENSE },
		harvest: 2,
		research: 2,
		craft: 1,
		invest: 1,
		produce: 3,
		cost: {
			production: 1,
			culture: 1,
			gold: 1,
		},
	},
	S: {
		name: 'Scientist',
		defense: { ...BASE_DEFENSE },
		harvest: 1,
		research: 3,
		craft: 1,
		invest: 1,
		produce: 1,
		cost: {
			production: 1,
			culture: 1,
			science: 1,
		},
	},
	F: {
		name: 'Farmer',
		defense: { ...BASE_DEFENSE },
		harvest: 3,
		research: 0,
		craft: 1,
		invest: 1,
		produce: 2,
		cost: {
			production: 1,
			culture: 1,
			science: 1,
		},
	},
};
