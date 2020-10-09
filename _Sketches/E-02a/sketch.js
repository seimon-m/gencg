const backgroundColor = 50;
let circleSize;


function setup() {
    createCanvas(windowWidth, windowHeight);
    var density = displayDensity();
    pixelDensity(density);
    noCursor()
    background(backgroundColor);
}

function draw() {
    background(backgroundColor, 20);
    drawCircles();
}

function drawCircles() {
    let oldRadius;
    for (let i = 1; i < 10; i++) {
        circleSize = (i * i * i * 5) / 40;
        noFill();
        stroke("white");
        circle(mouseX + circleSize / 2, mouseY, circleSize, circleSize);
        oldRadius = mouseX + circleSize / 2
    }
    for (let i = 10; i < 30; i++) {
      circleSize = (i * i * i * 3) / 60;
      fill(randomColor())
      stroke("white");
      circle(mouseX + oldRadius - circleSize / 2, mouseY, circleSize, circleSize);
      oldRadius = mouseX + oldRadius - circleSize / 1000
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
