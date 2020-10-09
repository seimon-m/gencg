const backgroundColor = 40;
let circleSize;
let canvas;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  var density = displayDensity();
  pixelDensity(density);
  
  background(backgroundColor);

  

}

function mousePressed() {
  for (let i = 0; i < 6; i++) {
    createCircle();
  }
}

function createCircle() {
  circleSize = random(200, 600);
  strokeWeight(random(20, 60));
  stroke(randomColor());
  noFill();
  circle(
    random(mouseX - 100, mouseX + 100),
    random(mouseY- 100, mouseY + 100),
    circleSize,
    circleSize
  );
}

function randomColor() {
  const r = random(0, 255);
  const g = 0;
  const b = random(0, 255);
  const a = random(100, 255);
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
