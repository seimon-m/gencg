const backgroundColor = 50;
let centerX, centerY, gridsize, formsize, counter = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    var density = displayDensity();
    frameRate(30)
    pixelDensity(density);
    noCursor();
    centerX = windowWidth / 2;
    centerY = windowHeight / 2;
    gridsize = 80;
    formsize = (gridsize * 0.58) / 4;
    background(backgroundColor);
    createGrid();
}

function draw() {
    
    drawCondition()
    counter++
}

function drawCondition() {
    if (counter <= 100) {
        counter++
    } else {
        background(backgroundColor);
        createGrid()
        counter = 0
    }
}


function createGrid() {
    let rowCounter = 0;
    for (let gridY = 0; gridY < windowHeight + gridsize; gridY += gridsize * 0.8684) {
        stroke("white");
        noFill();
        strokeWeight(1);
        if (rowCounter % 2 === 0) {
            console.log(rowCounter);
            for (let gridX = 0; gridX < windowWidth +  gridsize; gridX += gridsize) {
                push();
                translate(gridX + gridsize / 2, gridY);
                // rect(0, 0, gridsize, gridsize);
                drawForm(gridsize * 0.58);
                for (let i = gridsize * 0.58; i > 1; i -= formsize) {
                    drawForm(i);
                }
                pop();
            }
        } else {
            for (let gridX = 0; gridX < windowWidth + gridsize; gridX += gridsize) {
                push();
                translate(gridX, gridY);
                // rect(0, 0, gridsize, gridsize);
                drawForm(gridsize * 0.58);
                for (let i = gridsize * 0.58; i > 1; i -= formsize) {
                    drawForm(i);
                }
                
                pop();
            }
        }
        rowCounter++;
    }
}

function drawForm(size) {
    strokeWeight(2);
    fill(randomColor())
    push();
    rotate(frameCount / 98);
    polygon(0, 0, size, 6);
    pop();
}

function randomColor() {
    const r = random(0, 255);
    const g = 0;
    const b = random(0, 255);
    const a = 150;
    return color(r, g, b, a);
}

function polygon(x, y, radius, npoints) {
    let angle = TWO_PI / npoints;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = x + cos(a) * radius;
        let sy = y + sin(a) * radius;
        vertex(sx, sy);
    }
    endShape(CLOSE);
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
