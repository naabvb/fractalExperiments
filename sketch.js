var canvas;
var loadingIcon;
var size;
var trees = [];
var created = [];
var leafs = [];

var blue = '#325876';
//var blue = color(50, 88, 118);
var dx = 200;
var dy = 50;

let field;

let scale,
    theme,
    bounds;
var start;

var done = false
var remap = false

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    //drawGradient();
    canvas.hide();
    trees = [];
    start = true;
    setGradient(20)
    //noStroke();
    // drawGradient();
    loadingIcon = document.getElementById('loaderIcon')
    if (windowWidth < 100) {
        size = 2
    }
    else {
        size = random(4, 7);
    }
    //  size = random(2, 5);
    // noLoop();
    let root;
    for (let i = 0; i < size; i++) {
        //if (windowWidth < 200) {
        //    root = createVector(random(0, windowWidth), random(height + 10, height + 30));
        //}
        //else {
        //    root = createVector(random(0, windowWidth), random(height + 70, height + 100));
        //}
        root = createVector(random(0, windowWidth), random(height - 90, height))
        // let root = createVector(random(0, windowWidth), random(height + 70, height + 100));
        let sz = random(8, 12)
        trees.push({ 'root': root, 'sz': sz });
    }
    for (let i = 0; i < trees.length; i++) {
        created.push(new Branch(trees[i]['sz'], trees[i]['root'], 0, i));
    }
    //console.log(leafs)


    // for (let i = 0; i < trees.length; i++) {
    //     drawBranch(random(7, 12), trees[i], 0);
    // }
    scale = random(8e2, 2e3);
    // theme = {name: "Night Sky", 
    //				// colors: ["#45217C", "#0799F2", "#FFFFFF"], 
    //				 colors: getColor(),}
    //                // background: color(8,3,20)}; //"#150832"
    //console.log(theme.colors);
    field = new ParticleSystem()
    field.colors = getColor();
    field.build(2000);
    drawClouds();
    //canvas.show();
    //setGradient(6)
}

function draw() {
    // setGradient(6)
    // canvas.show();
    noStroke();
    //field.render();
    if (!remap && !done) {
        field.render();
        field.render();

    }

    if (remap) {
        field.render();
    }
    //drawrect()
    //drawClouds();
    drawmounts();
    drawrect()
    // debugger;
    for (let i = 0; i < trees.length; i++) {
        //console.log(trees[i]['root'].x)
        //console.log(trees.length)
        // fill(0,64,128,48);
        //  ellipseMode(CENTER);
        // console.log(coords[i])
        // ellipse(coords[i].x, coords[i].y, 30, 8);
        //fill(0,64,128,48);
        drawTree(i);
        //fill(0,64,128,48);
        //console.log('drwan')
    }

    for (let i = 0; i< leafs.length; i++) {
        leafs[i].show()
    }

    //drawClouds();

    if (!done) {
        done = true;
        loadingIcon.style.visibility = 'hidden';
        canvas.show();
    }


    noStroke();
    //done = true

    //  if (trees.length > 0 && start) {
    //      noStroke();
    //      field.render();
    //      field.render();
    //      field.render();
    //      debugger;
    //      for (let i = 0; i < trees.length; i++) {
    //          showem();
    //      }
    //      //trees = []
    //      loadingIcon.style.visibility = 'hidden';
    //     // noStroke();
    //     // field.render();
    //     // field.render();
    //     // field.render();
    //      canvas.show();
    //      start = false;
    //  //   // field.render();
    //  }
    //debugger;

    //canvas.show();
    // field.render();
    //drawShit();
    //noStroke();
    // background();
    // field.render();

}

var vertexAR = []

function drawClouds() {
    let j = 0
    //for (let j = 0; j < height/3; j++) {
    
        // montains
        //beginShape();   
       // fill(lerpColor(color(43, 29, 14), color(124, 144, 63), j/height));
        //fill(color(24, 16, 8))
       // vertex(0, height);
        vertexAR.push({'x':0, 'y':height})
        for (let i = 0; i <= width; i +=2) {
          n = noise(i/dx, j/dy);
          n = map(n, 0, 1, 0, height/2 - j);
          vertexAR.push({'x':i, 'y':height-n})
          //vertex(i, height - n);
          //console.log('asd')
        }
        vertexAR.push({'x':width, 'y':height})
        //vertex(width, height);
        //endShape();
        //break;
    //}    
}

function drawmounts() {
    beginShape();
    fill(color(24, 16, 8))
    for (let i = 0; i < vertexAR.length; i++) {
        vertex(vertexAR[i]['x'], vertexAR[i]['y'])
    }
    endShape();
}


function drawClouds2() {
    let j = 0
    //for (let j = 0; j < height/3; j++) {
    
        // montains
        beginShape();   
       // fill(lerpColor(color(43, 29, 14), color(124, 144, 63), j/height));
        fill(color(24, 16, 8))
        vertex(0, height);
        for (let i = 0; i <= width; i +=2) {
          n = noise(i/dx, j/dy);
          n = map(n, 0, 1, 0, height/2 - j);
          vertex(i, height - n);
          console.log('asd')
        }
        vertex(width, height);
        endShape();
        //break;
    //}    
}

function drawrect() {
    fill(color(28, 19, 8))
    rect(0, height - 100, width, height / 10);
    fill(color(28, 19, 8))
}


function drawTree(a) {
    for (let i = 0; i < created.length; i++) {
        if (created[i].treenum == a) {
            created[i].show()
        }
        //console.log(created[0])
    }
}


function mouseClicked() {
    //loadingIcon.style.visibility = 'visible';
    // console.log(items2)
    //setup();
    remap = true;
    redraw();

}