var canvas;
var loadingIcon;
var forestSize;
var treeRoots = [];
var createdTrees = [];
var leafs = [];
var landscapeCoordinates = [];

var field;
var scale;
var bounds;

var setupDone = false
var startPerlin = false

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.hide();

    // Set background gradient based on presets in background.js
    setGradient(20)

    loadingIcon = document.getElementById('loaderIcon')

    // Probably unnecessary scaling
    if (windowWidth < 100) forestSize = 2;
    else forestSize = random(4, 7);

    let root;

    // Calculate tree root coordinates
    for (let i = 0; i < forestSize; i++) {
        root = createVector(random(0, windowWidth), random(height - 90, height))
        treeRoots.push({ 'root': root, 'sz': random(5, 10) });
    }
    for (let i = 0; i < treeRoots.length; i++) {
        createdTrees.push(new Branch(treeRoots[i]['sz'], treeRoots[i]['root'], 0, i));
    }

    scale = random(8e2, 2e3);

    field = new ParticleSystem()
    field.colors = getColor();
    field.build(2000);
    createLandscape();
}

function draw() {
    noStroke();

    // Stop stars after two iterations to create stars
    if (!startPerlin && !setupDone) {
        field.render();
        field.render();
    }

    // If mouse clicked, start perlin noise
    if (startPerlin) field.render();

    drawLandscape();
    drawGround()
    drawTrees();
    drawLeafs();

    // Clear out loading icons and show canvas
    if (!setupDone) {
        setupDone = true;
        loadingIcon.style.visibility = 'hidden';
        canvas.show();
    }
    noStroke();
}

// Draws all leafs
function drawLeafs() {
    for (let i = 0; i < leafs.length; i++) {
        leafs[i].show();
    }
}

// Creates vertex coordinates for the landscape
function createLandscape() {
    let dx = 200;
    let dy = 50;
    let j = 0;
    landscapeCoordinates.push({ 'x': 0, 'y': height })
    for (let i = 0; i <= width; i += 2) {
        n = noise(i / dx, j / dy);
        n = map(n, 0, 1, 0, height / 2 - j);
        landscapeCoordinates.push({ 'x': i, 'y': height - n })
    }
    landscapeCoordinates.push({ 'x': width, 'y': height })
}

// Draw landscape using the previously generated coordinates
function drawLandscape() {
    beginShape();
    fill(color(24, 16, 8))
    for (let i = 0; i < landscapeCoordinates.length; i++) {
        vertex(landscapeCoordinates[i]['x'], landscapeCoordinates[i]['y'])
    }
    endShape();
}

// Draw foreground
function drawGround() {
    fill(color(28, 19, 8))
    rect(0, height - 100, width, height / 10);
    fill(color(28, 19, 8))
}

// Draws the trees previously generated
function drawTrees() {
    for (let i = 0; i < treeRoots.length; i++) {
        drawTree(i);
    }
}

// Draws a tree and all it's branches
function drawTree(a) {
    for (let i = 0; i < createdTrees.length; i++) {
        if (createdTrees[i].treenum == a) {
            createdTrees[i].show()
        }
    }
}

// On mouse click, start perlin noise
function mouseClicked() {
    startPerlin = true;
    redraw();
}

function touchStarted() {
    startPerlin = true;
    redraw();
}
