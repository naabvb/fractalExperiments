var canvas;
var loadingIcon;
var forestSize;
var treeRoots = [];
var trunkCoordinates = [];
var createdTrees = [];
var leafs = [];
var landscapeCoordinates = [];
var mountainTopCoordinates = [];

var field;
var scale;
var bounds;

var setupDone = false;
var startPerlin = false;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.hide();

    // Set background gradient based on presets in background.js
    setGradient(20);

    loadingIcon = document.getElementById('loaderIcon');

    // Probably unnecessary scaling
    if (windowWidth < 100) forestSize = 2;
    else forestSize = random(4, 7);

    let root;

    // Calculate tree root coordinates
    for (let i = 0; i < forestSize; i++) {
        root = createVector(random(0, windowWidth), random(height - 80, height));
        sz = random(5, 10);
        trunkCoordinates.push({ 'root': { ...root }, 'sz': sz }); // Hack to create a shallow copy for shadows since the original root values need to get changed.
        treeRoots.push({ 'root': root, 'sz': sz });
    }
    treeRoots.sort((a, b) => (a.root.y > b.root.y) ? 1 : -1); // Sort both arrays so that trees get build in an order based on y-axis
    trunkCoordinates.sort((a, b) => (a.root.y > b.root.y) ? 1 : -1);

    for (let i = 0; i < treeRoots.length; i++) {
        createdTrees.push(new Branch(treeRoots[i]['sz'], treeRoots[i]['root'], 0, i));
    }
    scale = random(8e2, 2e3);

    field = new ParticleSystem();
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
        drawClouds();
    }

    // If mouse clicked, start perlin noise
    if (startPerlin) field.render();
    drawLandscape();
    drawMountainTops();
    drawGround();
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
        landscapeCoordinates.push({ 'x': i, 'y': height - n });
    }
    landscapeCoordinates.push({ 'x': width, 'y': height });
    getMountainTops();
}

// Draw landscape using the previously generated coordinates
function drawLandscape() {
    beginShape();
    fill(color(18, 18, 18))
    for (let i = 0; i < landscapeCoordinates.length; i++) {
        vertex(landscapeCoordinates[i]['x'], landscapeCoordinates[i]['y']);
    }
    endShape();
}

// Overly complicated function to get safe areas for mountain tops without drawing over nothing
function getMountainTops() {
    let minmax = getMinMax();
    let tresh = (minmax.max - minmax.min) * 0.10 + minmax.min;
    let areas = [];
    let index1 = 0;
    let index2 = 0;
    for (let i = 0; i < landscapeCoordinates.length; i++) {
        if (landscapeCoordinates[i].y < tresh) {
            index1 = i;
            let previous = landscapeCoordinates[i].y;
            let highest = Number.NEGATIVE_INFINITY;
            let highest_i = 0;
            for (let j = i; j < landscapeCoordinates.length; j++) {
                if (landscapeCoordinates[j].y > previous) {
                    if (landscapeCoordinates[j].y > highest) {
                        highest = landscapeCoordinates[j].y;
                        highest_i = j;
                    }
                }
                if (landscapeCoordinates[j].y > landscapeCoordinates[index1].y) {
                    index2 = j;
                    i = j + 1;
                    if (landscapeCoordinates[index2].x < width - 3) {
                        areas.push({ 's': index1, 'e': index2 });
                    }
                    index1 = 0;
                    index2 = 0;
                    break;
                }
                if (landscapeCoordinates[index1].y < highest) {
                    index2 = highest_i;
                    i = highest_i + 1;
                    if (landscapeCoordinates[index2].x < width - 3) {
                        areas.push({ 's': index1, 'e': index2 });
                    }
                    index1 = 0;
                    index2 = 0;
                    break;
                }
                previous = landscapeCoordinates[j].y;
            }
        }
    }

    for (let i = 0; i < areas.length; i++) {
        let raw_coords = landscapeCoordinates.slice(areas[i].s, areas[i].e);
        if (raw_coords.length > 1) {
            let done_coords = addNoise(raw_coords);
            mountainTopCoordinates.push(done_coords);
        }
    }
}

// Adds some random noise to mountain tops, could definitely be improved
function addNoise(data) {
    let first = data[0];
    let last = data[data.length - 1];
    let middle = Math.round((first.x + last.x) / 2);
    let middle1 = Math.round((last.x + middle) / 2);
    let middle105 = Math.round((middle1 + last.x) / 2);
    let middle115 = Math.round((middle + middle1) / 2);
    let middle2 = Math.round((first.x + middle) / 2);
    let middle205 = Math.round((middle2 + middle) / 2);
    let middle225 = Math.round((first.x + middle2) / 2);

    data.push({ 'x': middle105, 'y': random(first.y + 10, first.y + 18 + data.length / 1.5) });
    data.push({ 'x': middle1, 'y': random(first.y + 10, first.y + 18 + data.length / 1.5) });
    data.push({ 'x': middle115, 'y': random(first.y + 10, first.y + 18 + data.length / 1.5) });
    data.push({ 'x': middle, 'y': random(first.y + 10, first.y + 18 + data.length / 1.5) });
    data.push({ 'x': middle205, 'y': random(first.y + 10, first.y + 18 + data.length / 1.5) });
    data.push({ 'x': middle2, 'y': random(first.y + 10, first.y + 18 + data.length / 1.5) });
    data.push({ 'x': middle225, 'y': random(first.y + 10, first.y + 18 + data.length / 1.5) });

    return data;
}

function drawMountainTops() {
    for (let i = 0; i < mountainTopCoordinates.length; i++) {
        drawMountainTop(mountainTopCoordinates[i]);
    }
}

// Draws a mountain top
function drawMountainTop(tiedot) {
    beginShape();
    fill(110);
    noStroke();
    for (let i = 0; i < tiedot.length; i++) {
        vertex(tiedot[i]['x'], tiedot[i]['y']);
    }
    endShape();
}

function getMinMax() {
    let lowest = Number.POSITIVE_INFINITY;
    let highest = Number.NEGATIVE_INFINITY;
    let tmp;
    for (let i = landscapeCoordinates.length - 1; i >= 0; i--) {
        tmp = landscapeCoordinates[i].y;
        if (tmp < lowest) lowest = tmp;
        if (tmp > highest) highest = tmp;
    }
    return { 'min': lowest, 'max': highest };
}

// Draw some clouds
function drawClouds() {
    let inverseDetail = 5;
    for (let y = 0; y < height; y += inverseDetail) {
        for (let x = 0; x < width; x += inverseDetail) {
            n = noise(x / 200., y / 100., 0);
            fill(70, 83, 117, n * map(y, 0, height * 0.60, 100, 0));
            rect(x, y, inverseDetail, inverseDetail);
        }
    }
}

// Draw foreground
function drawGround() {
    noStroke();
    rectMode(CORNER);
    fill(color(28, 19, 8));
    rect(0, height * 0.90, width, height * 0.85);
    fill(color(28, 19, 8));
}

// Draws the trees previously generated
function drawTrees() {
    for (let i = 0; i < treeRoots.length; i++) {
        drawTree(i);
    }
}

// Draws a tree and all it's branches
function drawTree(a) {
    drawTreeBase(a);
    for (let i = 0; i < createdTrees.length; i++) {
        if (createdTrees[i].treenum == a) {
            createdTrees[i].show();
        }
    }
    drawTreeBase(a);
}

// Draws base on the tree trunk
function drawTreeBase(a) {
    noStroke();
    fill(28, 14, 8);
    ellipseMode(CENTER);
    ellipse(trunkCoordinates[a].root.x, trunkCoordinates[a].root.y + 4, 50, trunkCoordinates[a].sz + 2);
    fill(28, 14, 8);
}

// On mouse click, start perlin noise
function mouseClicked() {
    startPerlin = true;
    fadeOut();
    redraw();
}

function touchStarted() {
    startPerlin = true;
    fadeOut();
    redraw();
}

function fadeOut() {
    let e = document.getElementById('footer_block3');
    e.style.animationDelay = '1s';
    e.style.animation = 'fadeout 2s';
    e.style.webkitAnimation = 'fadeout 2s';
}
