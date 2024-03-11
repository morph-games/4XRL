function rand(a = 1, b = 0) {
	return b + Math.random() * (a - b);
}

function randInt(a, b = 0) {
	return Math.floor(rand(a, b));
}

function randId(prefix = '') {
	return [
		prefix, Number(new Date()).toString(36), Math.round(Math.random() * 9999),
	].join('_');
}

export {
	rand,
	randInt,
	randId,
};
