function complexDiscreteFourier(x, freq) {
	let X = new Complex(0,0);
	let N = x.length;
	for(let n=0; n<N; n++){
		let rotation = new Complex(Math.cos(2*Math.PI*freq*n/N), -(Math.sin(2*Math.PI*freq*n/N)));
		X = X.add(x[n].mul(rotation));
	}
	X.x = X.x/N;
	X.y = X.y/N;
	return X;
}
