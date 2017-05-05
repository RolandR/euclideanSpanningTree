

/*


	========================================================================
	
	Copyright (C) 2017 Roland Rytz <roland@draemm.li>
	Licensed under the GNU Affero General Public License Version 3
	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as
	published by the Free Software Foundation, either version 3 of the
	License, or (at your option) any later version.
	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
	For more information, see:
	https://draemm.li/various/euclideanSpanningTree/LICENSE
	
	========================================================================


*/

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var container = document.getElementById("canvasContainer");

canvas.width = container.clientWidth;
canvas.height = container.clientHeight;

var pointCount = 10000;

var quadtree = new Quadtree(canvas.width, canvas.height);

context.fillStyle = "#FFFFFF";
context.lineWidth = 1;

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

//var newPoint = quadtree.getNearest(Math.random()*canvas.width, Math.random()*canvas.height).point;
var newPoint = quadtree.getNearest(canvas.width/2, canvas.height/2).point;
newPoint.hue = 0;
addPointToTree(newPoint);

var iterationsPerFrame = 5;

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

	next.nearestNeighbor.hue = (next.hue+0.01)%1;
	
	context.strokeStyle = hueToRGB(next.hue);
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


function hueToRGB(hue) {
	var h = hue, s = 1, v = 1;
    var r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return "rgb("+~~(r * 256)+", "+~~(g * 256)+", "+~~(b * 256)+")";
}






















