

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var container = document.getElementById("canvasContainer");

canvas.width = container.clientWidth;
canvas.height = container.clientHeight;

var pointCount = 10000;

var points = [];

context.fillStyle = "#000000";

for(var i = 0; i < pointCount; i++){
	var point = {
		 x: ~~(Math.random()*canvas.width)
		,y: ~~(Math.random()*canvas.height)
		,colonised: false
		,nearestNeighbor: null
	};
	
	points.push(point);

	context.fillRect(point.x, point.y, 1, 1);
}

var tree = [];

var startingPoint = points[~~(Math.random()*points.length)];
startingPoint.starting = true;
addPointToTree(startingPoint);

context.strokeStyle = "#FF0000";

var iterationsPerFrame = 1;

iterate();

function iterate(){

	for(var i = 0; i < iterationsPerFrame; i++){
		grow();
		if(points.length <= 0){
			break;
		}
	}
	
	if(points.length > 0){
		setTimeout(iterate, 0);
	}
}


function grow(){
	var next = tree.sort(function(a, b){
		if (a.nearestDist < b.nearestDist) {
			return -1;
		}
		if (a.nearestDist > b.nearestDist) {
			return 1;
		}
		return 0;
	})[0];

	context.beginPath();
	context.moveTo(next.x+0.5, next.y+0.5);
	context.lineTo(next.nearestNeighbor.x+0.5, next.nearestNeighbor.y+0.5);
	context.stroke();

	//console.log(next.nearestNeighbor);

	addPointToTree(next.nearestNeighbor);
}


function addPointToTree(point){
	//console.log(point);
	
	point.colonised = true;

	points = points.filter(function(e){
		return (!e.colonised);
	});

	tree.push(point);

	if(points.length == 0){
		return false;
	}
	
	point.nearestNeighbor = getNearestPoint(point);
	point.nearestDist = Math.sqrt(Math.pow(point.nearestNeighbor.x - point.x, 2) + Math.pow(point.nearestNeighbor.y - point.y, 2));

	updateNeighbors();
}

function updateNeighbors(){
	for(var i = 0; i < tree.length; i++){
		var point = tree[i];
		if(point.nearestNeighbor.colonised){
			point.nearestNeighbor = getNearestPoint(point);
			point.nearestDist = Math.sqrt(Math.pow(point.nearestNeighbor.x - point.x, 2) + Math.pow(point.nearestNeighbor.y - point.y, 2));
		}
	}
}

function getNearestPoint(point){
	var nearest = points.sort(function(a, b){
		var aDist = Math.sqrt(Math.pow(a.x - point.x, 2) + Math.pow(a.y - point.y, 2));
		var bDist = Math.sqrt(Math.pow(b.x - point.x, 2) + Math.pow(b.y - point.y, 2));
		if(a == point || a.colonised){
			return 1;
		} else if(b == point || b.colonised){
			return -1;
		} else if (aDist < bDist) {
			return -1;
		} else if (aDist > bDist) {
			return 1;
		}
		return 0;
	})[0];

	return nearest;
}






















