const WIDTH = 640;
const HEIGHT = 480;
const MAX_VECTORS = 500;
const MIN_VECTORS = 1;

var state = "START";
var time = 0;
var userInput = [];
var initialVectors = [];
var colorPath = [];
var currentVectors;

function mousePressed() {
	if((0<=mouseX&&mouseX<=WIDTH)&&(0<=mouseY&&mouseY<=HEIGHT)){
		background(0);
		state = "USER";
		print("State: "+state);
		time = 0;
		if(userInput.length>0)
			userInput = [];
		colorPath = [];
	}
}

function touchStarted() {
	if((0<=touches[0].x&&touches[0].x<=WIDTH)&&(0<=touches[0].y&&touches[0].y<=HEIGHT)){
		background(0);
		state = "USER";
		print("State: "+state);
		time = 0;
		if(userInput.length>0)
			userInput = [];
		colorPath = [];
		return false;
	}
}

function touchEnded() {
	if(state=="USER"){
		computeFourier();
		state = "ANIMATION";
		print("State: "+state);
		return false;
	}
}

function mouseReleased() {
	if(state=="USER"){
		computeFourier();
		state = "ANIMATION";
		print("State: "+state);
	}
}

function setup() {
	createCanvas(WIDTH, HEIGHT);
	print("Setup.");
	background(0);
}

function draw() {
	switch(state){
		case "USER":
			if(mouseIsPressed){
				userInput.push(new Complex(mouseX-(WIDTH/2),mouseY-(HEIGHT/2)));
				stroke(255);
				noFill();
				line(mouseX,mouseY,pmouseX,pmouseY);
			}
			if(touches.length>0){
				userInput.push(new Complex(touches[0].x-(WIDTH/2),touches[0].y-(HEIGHT/2)));
				stroke(255);
				noFill();
				line(mouseX,mouseY,pmouseX,pmouseY);
			}
		break;
		case "ANIMATION":
			if(vectorsInputValue()!=currentVectors){
				computeFourier();
			}
			background(0);
			translate(WIDTH/2, HEIGHT/2);
			stroke(70);
			strokeWeight(2);
			noFill();
			if(showInputValue())
				drawUserInput();
			strokeWeight(1);
			drawSeriesCircles(initialVectors);
			time += timeInputValue() * TWO_PI / 10000;
		break;
		default:
		break;
	}
}

function resetProgram() {
	background(0);
	state="START";
	time = 0;
	colorPath = [];
	initialVectors = [];
	userInput = [];
}

function vectorsInputValue(){
	return parseInt(document.getElementById("vectors").value);
}

function timeInputValue(){
	return (document.getElementById("time").value);
}

function userInputValue(){
	return (document.getElementById("userData").value);
}

function skipValue(){
	return (document.getElementById("skip").value);
}

function showInputValue(){
	return document.getElementById("showInput").checked;
}

function showVectorsValue(){
	return document.getElementById("showVectors").checked;
}

function computeFourier(){
	initialVectors = [];
	currentVectors = vectorsInputValue();
	currentVectors = currentVectors>MAX_VECTORS?MAX_VECTORS:currentVectors;
	currentVectors = currentVectors<MIN_VECTORS?MIN_VECTORS:currentVectors;
	if(currentVectors%2!=0)
		currentVectors--;
	var tranformedComplex = complexDiscreteFourier(userInput,0);
	initialVectors.push({amp: tranformedComplex.amp(), phase: tranformedComplex.phs(), freq: 0});
	for(var i=1; i<=currentVectors/2; i++){
		tranformedComplex = complexDiscreteFourier(userInput,i);
		initialVectors.push({amp: tranformedComplex.amp(), phase: tranformedComplex.phs(), freq: i});
		tranformedComplex = complexDiscreteFourier(userInput,-i);
		initialVectors.push({amp: tranformedComplex.amp(), phase: tranformedComplex.phs(), freq: -i});
	}
}

function userData(){
	var data = JSON.parse(userInputValue());
	userInput = Complex.fromArray(data);
	computeFourier();
	state = "ANIMATION";
	colorPath = [];
	print(userInput);
}

function testDataButton(){
	var data = JSON.parse(testData);
	userInput = Complex.fromArray(data);
	computeFourier();
	state = "ANIMATION";
	colorPath = [];
	print(userInput);
}

function drawUserInput() {
	beginShape();
	for(var i=0; i<userInput.length; i++){
		vertex(userInput[i].x,userInput[i].y);
	}
	endShape();
}

function traceReset(){
	colorPath = [];
}

function drawSeriesCircles(arr){
	stroke(255,0,0);
	noFill();
	beginShape();
	for(var i=0; i<colorPath.length; i++){
		vertex(colorPath[i].x,colorPath[i].y);
	}
	endShape();
	var x = 0;
	var y = 0;
	for(var i=0; i<arr.length; i++){
		var px = x;
		var py = y;
		
		var amp = arr[i].amp;
		var phase = arr[i].phase;
		var freq = arr[i].freq;
		var phi = TWO_PI;
		noFill();
		stroke(200,200,200,100-((i/arr.length)*100));
		if(showVectorsValue())
			ellipse(x,y,amp*2);
		x += amp * cos(phi*freq*time + phase);
		y += amp * sin(phi*freq*time + phase);
		stroke(255,255,255,0);
		fill(255,255,255);
		if(showVectorsValue()){
			ellipse(x,y,4-((i/arr.length)*4));
			stroke(255,255,255,255);
			line(px,py,x,y);
		}
	}
	colorPath.unshift({x,y});
	if(colorPath.length>userInput.length)
		colorPath.pop();
}
