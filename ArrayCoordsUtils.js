function getDistance(coords1, coords2) {
	const [x, y] = coords1;
	return Math.sqrt(((x - coords2[0]) ** 2) + ((y - coords2[1]) ** 2));
}

function forCircleNeighbors(centerCoords, distance, callback) {
	const [centerX, centerY] = centerCoords;
	const floorDist = Math.floor(distance);
	for (let y = centerY - floorDist; y <= centerY + floorDist; y += 1) {
		for (let x = centerX - floorDist; x <= centerX + floorDist; x += 1) {
			const dist = getDistance(centerCoords, [x, y]);
			if (dist <= distance) {
				callback(x, y, dist);
			}
		}
	}
}

function addCoords(coords1, coords2) {
	return [coords1[0] + coords2[0], coords1[1] + coords2[1]];
}

function subtractCoords(coords1, coords2) {
	return [coords1[0] - coords2[0], coords1[1] - coords2[1]];
}

export {
	addCoords,
	getDistance,
	forCircleNeighbors,
	subtractCoords,
};
