let heading;
let bgc;
let slider;
let canvas;

function setup() {

    canvas = createCanvas(400, 400);
    heading = select('#myHeading');
    bgc = color(220, 220, 220);

    // Create slider
    slider = createSlider(10, 100, 32);
    slider.position(420, 200);

    // Detect mouse pressed
    createButton('Press me')
        .mousePressed(() => {
            console.log('Button Pressed');
            heading.html('Button Pressed');
        })
        .mouseReleased(() => {
            console.log('Button Released');
            heading.html('Press the Button');
        });
}

function draw() {
    background(bgc);
    heading.style('font-size', slider.value() + 'px');
}

function mousePressed() {
    console.log('Mouse Pressed');
    bgc = color(255, 255, 0);
}

function mouseReleased() {
    console.log('Mouse Released');
    bgc = color(220, 220, 220);
}

function mouseDragged() {
    canvas.size(mouseX, mouseY);
}