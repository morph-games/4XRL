import { clamp } from 'rocket-utility-belt';
import MapEntity from './MapEntity.js';
import UNIT_TYPES from './UnitTypes.js';

// Artist vs Warrior --> Artist
// Warrior vs Merchanct --> Warrior
// Merchant vs Artist -- > Merchant

const SKILL_NAMES = {
	harvest: '🌾Harvest Food',
	research: '🧪Research Science',
	craft: '🎭Culture Crafting',
	invest: '🪙Invest Coins',
	produce: '⚙️Production',
};

const ATTACK_SKILLS = ['attack', 'convert', 'bribe'];
const HARVEST_SKILLS = ['harvest', 'research', 'craft', 'invest', 'produce'];

export default class Unit extends MapEntity {
	constructor(nationId, nationalClass, type, coords, displayHtml) {
		super(coords, 'U', ['unit'], 'map-units');
		this.nationId = nationId;
		this.nationalClass = nationalClass;
		this.type = type;
		this.displayHtml = displayHtml;
		this.commandQueue = [];
		this.maxAxisMovement = 1; // +/- 1 along one axis. Allows diagnol movement.
		this.tier = 1;
		// this.flagId = null;
		this.dead = false;
	}

	queueCommand(command) {
		this.commandQueue.push(command);
	}

	popCommand() {
		return this.commandQueue.shift();
	}

	clearCommands() {
		this.commandQueue.length = 0;
	}

	hasCommands() {
		return (this.commandQueue.length > 0);
	}

	getSkill(skillName) {
		return (UNIT_TYPES[this.type][skillName] || 0) + (this.tier - 1);
	}

	getAttackSkill() {
		const attackSkills = ATTACK_SKILLS.filter((skill) => this.getSkill(skill));
		return attackSkills[0] || null;
	}

	getDefenseVersusAttack(attackSkill) {
		return (UNIT_TYPES[this.type].defense[attackSkill] || 0) + (this.tier - 1);
	}

	kill() {
		this.dead = true;
		this.remove();
	}

	getName() {
		return UNIT_TYPES[this.type].name;
	}

	getInnerHtml() {
		return this.displayHtml || this.type;
	}

	getInfoHtml() {
		const typeObj = UNIT_TYPES[this.type];
		const { defense } = typeObj;
		const getClassHtml = (val) => {
			let c = '';
			if (val > 1) c = 'good';
			else if (val <= 0) c = 'bad';
			return `class="${c}"`;
		};
		const getValueHtml = (val) => `<span ${getClassHtml(val)}>${val}</span>`;
		const defListItems = Object.keys(defense).map(
			(defKey) => `<li>${defKey}: ${getValueHtml(defense[defKey])}</li>`,
		);
		const harvestListItems = HARVEST_SKILLS.map(
			(skill) => `<li>${SKILL_NAMES[skill]}: x${getValueHtml(this.getSkill(skill))}</li>`,
		);
		const unitAttackSkills = ATTACK_SKILLS.filter((skill) => this.getSkill(skill));
		const attackListItems = (unitAttackSkills.length)
			? unitAttackSkills.map((skill) => `<li>${skill}: ${this.getSkill(skill)}</li>`)
			: ['<li class="bad">No attacks</li>'];
		const html = `
			<h1>${this.getName()} <span class="tier">Tier ${this.tier}</span></h1>
			<div>
				Harvest skills:
				<ul>
					${harvestListItems.join('')}
				</ul>
			</div>
			<div>
				Attacks:
				<ul>
					${attackListItems.join('')}
				</ul>
			</div>
			<div>
				Defense versus...
				<ul>
					${defListItems.join('')}
				</ul>
			</div>
			${typeObj.specialNotes ? `<div>Notes: ${typeObj.specialNotes}</div>` : ''}
		`;
		// console.log(defListItems, harvestListItems, attackListItems, html);
		return html;
	}

	move(x, y) {
		const min = this.maxAxisMovement * -1;
		super.move(
			clamp(x, min, this.maxAxisMovement),
			clamp(y, min, this.maxAxisMovement),
		);
	}

	getMove(x, y) {
		const min = this.maxAxisMovement * -1;
		return super.getMove(
			clamp(x, min, this.maxAxisMovement),
			clamp(y, min, this.maxAxisMovement),
		);
	}

	isIntelligent() {
		return (typeof this.intelligent === 'undefined')
			? (UNIT_TYPES[this.type].intelligent || 0) : this.intelligent;
	}

	/* ---- for rendering ---- */
	getClassList() {
		return [this.id, ...this.classes, this.nationalClass];
	}
}
