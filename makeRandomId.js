export default function makeRandomId(prefix = '') {
	return [
		prefix, Number(new Date()).toString(36), Math.round(Math.random() * 9999),
	].join('_');
}
