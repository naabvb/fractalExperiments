class Branch {
    constructor(girth, start, direction, treenum) {
        this.girth = girth;
        this.start = start;
        this.direction = direction;
        this.startx = start.x;
        this.starty = start.y;
        this.endx = '';
        this.endy = '';
        this.treenum = treenum;

        this.show = function () {
           // console.log('drawn')
            strokeWeight(this.girth);
            stroke(this.girth -10);
            line(this.startx, this.starty, this.endx, this.endy);
            //if (done) {
            //    console.log(this.girth);
            //    console.log(this.startx)
            //    console.log(this.starty)
            //    console.log(this.endx)
            //    console.log(this.endy)
            //}
        };

        for(let i = 0; i < random(2,6); i++) {
            let end = createVector(start.x +sin(direction)*girth*2.5, start.y -cos(direction)*girth*2.5);
           // stroke(girth+5);
           // strokeWeight(girth);  
           // line(start.x, start.y, end.x, end.y);
            this.endx = end.x;
            this.endy = end.y
            start.x = end.x;
            start.y = end.y;
            direction += random(0.3)-random(0.3);
        }

        if(girth > 0.6) {
            let branchA = random(0.5,0.99);
            let branchB = 1 -branchA;
            let sign = (int(random(2))*2-1); // -1 or +1
            let angle = random(0.4,1.2) *sign; // angle between branchA and branchB
            let directionA = direction *0.9 +angle*branchB;
            let directionB = direction *0.9 -angle*branchA;
            created.push(new Branch(girth *sqrt(branchA), createVector(start.x, start.y), directionA, this.treenum));
            created.push(new Branch(girth *sqrt(branchB), createVector(start.x, start.y), directionB, this.treenum));
           // if(girth < 1 && random(1) < 0.1) drawFruit(start);
        }





    }


}