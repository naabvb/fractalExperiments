function drawBranch(girth, start, direction) {
	strokeWeight(girth);
	for(let i = 0; i < random(2,6); i++) {
		let end = createVector(start.x +sin(direction)*girth*2.5, start.y -cos(direction)*girth*2.5);
		stroke(girth -50); strokeWeight(girth); line(start.x, start.y, end.x, end.y);
		start.x = end.x;
		start.y = end.y;
		direction += random(0.3) -random(0.3);
	}
	if(girth > 0.6) {
		let branchA = random(0.5, 0.99);
		let branchB = 1 -branchA;
		let sign = (int(random(2))*2-1); // -1 or +1
		let angle = random(0.4, 1.2) *sign; // angle between branchA and branchB
		let directionA = direction *0.9 +angle*branchB;
		let directionB = direction *0.9 -angle*branchA;
		drawBranch(girth *sqrt(branchA), createVector(start.x, start.y), directionA);
		drawBranch(girth *sqrt(branchB), createVector(start.x, start.y), directionB);
		//if(girth < 0.3 && random(1) < 0.1) drawFruit(start);
	}
}

function drawFruit(location) {
	let asd = random(1,10)
	if (asd > 5) {
		fill(255,250,240);
	}
	//else {
	//	fill(0,100,0);
	//}
	let sz = 4
	ellipse(location.x, location.y+6, sz,sz);
}
