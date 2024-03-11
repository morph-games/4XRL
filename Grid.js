const NOOP = () => {};
const NW = [-1, -1];
const N = [0, -1];
const NE = [1, -1];
const W = [-1, 0];
const E = [1, 0];
const SW = [-1, 1];
const S = [0, 1];
const SE = [1, 1];
const ZERO = [0, 0];
const DIRECTIONS = [N, NE, E, SE, S, SW, W, NW];

class Grid2D {
	constructor(size = [], initialValue = undefined) {
		this.arr = null;
		this.size = [...size];
		this.arr = this.getBlankArray(initialValue);
	}

	static loopOverGrid(size, cellFn = NOOP, rowStartFn = NOOP, rowEndFn = NOOP) {
		const [sizeX, sizeY] = size;
		for (let y = 0; y < sizeY; y += 1) {
			rowStartFn(y);
			for (let x = 0; x < sizeX; x += 1) {
				cellFn(x, y);
			}
			rowEndFn(y);
		}
	}

	static getFlexibleXYArguments(args) {
		const coords = (args[0] instanceof Array) ? [...args[0]] : [args[0], args[1]];
		return [...coords];
	}

	forEachCell(cellFn = NOOP, rowStartFn = NOOP, rowEndFn = NOOP) {
		return Grid2D.loopOverGrid(this.size, cellFn, rowStartFn, rowEndFn);
	}

	getBlankArray(initialValue) {
		const arr = [];
		this.forEachCell((x, y) => arr[y].push(initialValue), (/* y */) => arr.push([]));
		return arr;
	}

	get(...coordinateArgs) {
		const [x, y] = Grid2D.getFlexibleXYArguments(coordinateArgs);
		try {
			return this.arr[y][x];
		} catch (err) {
			// ignore these errors
			// console.warn('Could not get grid value at', x, y, '\n', err);
		}
		return undefined;
	}

	/** Set value with params like one of:
	 * - x, y, value
	 * - coords, value
	 */
	set(...coordValArgs) {
		const [x, y] = Grid2D.getFlexibleXYArguments(coordValArgs);
		const value = (coordValArgs[0] instanceof Array) ? coordValArgs[1] : coordValArgs[2];
		try {
			this.arr[y][x] = value;
		} catch (err) {
			// ignore these errors - TODO: allow this to be customized?
			// console.warn('Could not set grid value at', x, y, '\n', err);
		}
	}

	clear(initialValue) {
		this.arr = this.getBlankArray(initialValue);
	}

	onEdge(...coordinateArgs) {
		const [x, y] = Grid2D.getFlexibleXYArguments(coordinateArgs);
		if (x === 0 || y === 0) return true;
		const [mapX, mapY] = this.size;
		return (x === mapX - 1 || y === mapY - 1);
	}

	inBounds(...coordinateArgs) {
		const [x, y] = Grid2D.getFlexibleXYArguments(coordinateArgs);
		if (x < 0 || y < 0) return false;
		const [mapX, mapY] = this.size;
		return (x < mapX && y < mapY);
	}
}
Grid2D.DIRECTIONS = DIRECTIONS;
Grid2D.NW = NW;
Grid2D.N = N;
Grid2D.NE = NE;
Grid2D.W = W;
Grid2D.E = E;
Grid2D.SW = SW;
Grid2D.S = S;
Grid2D.SE = SE;
Grid2D.ZERO = ZERO;

export default Grid2D;
