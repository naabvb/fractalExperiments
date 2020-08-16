var canvas;
var loadingIcon;
var size;
var trees = [];


function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.hide();
    loadingIcon = document.getElementById('loaderIcon')
    size = random(4, 7);
    // noLoop();
    for (let i = 0; i < size; i++) {
        let root = createVector(random(0, windowWidth), random(height + 70, height + 40));
        trees.push(root);
    }
    setGradient(6)
}

function draw() {
    if (trees.length > 0) {
        for (let i = 0; i < trees.length; i++) {
            drawBranch(random(7, 12), trees[i], 0);
        }
        trees = []
        loadingIcon.style.visibility = 'hidden';
        canvas.show();
    }

}

function mouseClicked() {
    loadingIcon.style.visibility = 'visible';
    print(loadingIcon.style.visibility)
    setup();
    redraw();
}