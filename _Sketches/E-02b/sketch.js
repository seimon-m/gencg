const backgroundColor = 50;
let circleSize;
let centerX;
let centerY;

function setup() {
    createCanvas(windowWidth, windowHeight);
    var density = displayDensity();
    pixelDensity(density);
    noCursor();
    centerX = windowWidth / 2;
    centerY = windowHeight / 2;
    background(backgroundColor);
}

function draw() {
    background(backgroundColor, 20);
    drawCircles();
}

function drawCircles() {
    let oldCircle;
    for (let i = 1; i < 10; i++) {
        circleSize = i * 20;
        noFill();
        stroke("white");
        circle(centerX + circleSize / 2, centerY, circleSize, circleSize);
    }
    oldCircle = circleSize;
    for (let i = 10; i < 20; i++) {
        noFill();
        stroke("white");
        circle(
            centerX + oldCircle - circleSize / 2,
            centerY,
            circleSize,
            circleSize
        );
        circleSize = i * 20;
    }
    oldCircle = circleSize;
    for (let i = 20; i < 30; i++) {
        noFill();
        stroke("white");
        circle(
            centerX - oldCircle / 2 + circleSize / 2,
            centerY,
            circleSize,
            circleSize
        );
        circleSize = i * 20;
    }
    oldRadius = circleSize;
    for (let i = 30; i < 40; i++) {
        noFill();
        stroke("white");
        circle(
            centerX + oldCircle - circleSize / 2,
            centerY,
            circleSize,
            circleSize
        );
        circleSize = i * 20;
    }
}

function randomColor() {
    const r = random(0, 255);
    const g = 0;
    const b = random(0, 255);
    const a = 50;
    return color(r, g, b, a);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
    if (key == "s" || key == "S") saveThumb(650, 350);
}

// resize canvas when the window is resized
function windowResized() {
    resizeCanvas(windowWidth, windowHeight, false);
}

// Int conversion
function toInt(value) {
    return ~~value;
}

// Timestamp
function timestamp() {
    return Date.now();
}

// Thumb
function saveThumb(w, h) {
    let img = get(width / 2 - w / 2, height / 2 - h / 2, w, h);
    save(img, "thumb.jpg");
}
