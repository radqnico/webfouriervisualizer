class Complex {

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	add(z) {
		return new Complex(this.x+z.x, this.y+z.y);
	}

	mul(z) {
		return new Complex(this.x*z.x-this.y*z.y, this.x*z.y+this.y*z.x);
	}

	amp() {
		return Math.sqrt(this.x*this.x + this.y*this.y);
	}

	phs() {
		return Math.atan2(this.y, this.x);
	}

	static fromArray(arr) {
		let ret = [];
		for(let i=0; i<arr.length; i++) {
			ret.push(new Complex(parseInt(arr[i].x), parseInt(arr[i].y)));
		}
		return ret;
	}
}
