

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var container = document.getElementById("canvasContainer");

canvas.width = container.clientWidth;
canvas.height = container.clientHeight;

var pointCount = 10000;

var quadtree = new Quadtree(canvas.width, canvas.height);

context.fillStyle = "#FFFFFF";

for(var i = 0; i < pointCount; i++){
	var point = {
		 x: ~~(Math.random()*canvas.width)
		,y: ~~(Math.random()*canvas.height)
		,colonised: false
		,nearestNeighbor: null
	};
	
	quadtree.insert(point);

	//context.fillRect(point.x, point.y, 1, 1);
}

var tree = [];

var newPoint = quadtree.getNearest(Math.random()*canvas.width, Math.random()*canvas.height).point;
newPoint.color = "#FFFFFF";
addPointToTree(newPoint);

/*newPoint = quadtree.getNearest(Math.random()*canvas.width, Math.random()*canvas.height).point;
newPoint.color = "#FFFF00";
addPointToTree(newPoint);

newPoint = quadtree.getNearest(Math.random()*canvas.width, Math.random()*canvas.height).point;
newPoint.color = "#FF00FF";
addPointToTree(newPoint);

newPoint = quadtree.getNearest(Math.random()*canvas.width, Math.random()*canvas.height).point;
newPoint.color = "#00FF00";
addPointToTree(newPoint);*/

var iterationsPerFrame = 1;

iterate();

function iterate(){

	for(var i = 0; i < iterationsPerFrame; i++){
		grow();
		if(quadtree.getCount() == 0){
			break;
		}
	}
	
	if(quadtree.getCount() > 0){
		requestAnimationFrame(iterate);
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

	next.nearestNeighbor.color = next.color;
	
	context.strokeStyle = next.color;
	context.beginPath();
	context.moveTo(next.x+0.5, next.y+0.5);
	context.lineTo(next.nearestNeighbor.x+0.5, next.nearestNeighbor.y+0.5);
	context.stroke();

	addPointToTree(next.nearestNeighbor);
}


function addPointToTree(point){
	
	point.colonised = true;

	quadtree.remove(point);

	tree.push(point);

	if(quadtree.getCount() == 0){
		return false;
	}

	var nearest = quadtree.getNearestNeighbor(point);
	console.log(nearest);
	point.nearestNeighbor = nearest.point;
	point.nearestDist = nearest.distance;

	updateNeighbors();
}

function updateNeighbors(){
	for(var i = 0; i < tree.length; i++){
		var point = tree[i];
		if(point.nearestNeighbor.colonised){
			var nearest = quadtree.getNearestNeighbor(point);
			point.nearestNeighbor = nearest.point;
			point.nearestDist = nearest.distance;
		}
	}
}






















