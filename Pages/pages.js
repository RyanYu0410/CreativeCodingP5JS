let page = 1;
let img;

let displaceColorsSrc = `
precision highp float;

uniform sampler2D tex0;
varying vec2 vTexCoord;

vec2 zoom(vec2 coord, float amount) {
  vec2 relativeToCenter = coord - 0.5;
  relativeToCenter /= amount; // Zoom in
  return relativeToCenter + 0.5; // Put back into absolute coordinates
}

void main() {
  // Get each color channel using coordinates with different amounts
  // of zooms to displace the colors slightly
  gl_FragColor = vec4(
    texture2D(tex0, vTexCoord).r,
    texture2D(tex0, zoom(vTexCoord, 1.05)).g,
    texture2D(tex0, zoom(vTexCoord, 1.1)).b,
    texture2D(tex0, vTexCoord).a
  );
}
`;

function preload() {
    img = loadImage('2f821b51e7f380f929ee3cf079ef3640.jpg');
}

function setup() {
    createCanvas(800, 800);
    console.log("Setup complete");
}

function draw() {
    fill(img.get(mouseX, mouseY));
    ellipse(mouseX, mouseY, 10, 10);
    let a = random(height);
    let b = random(width);
    fill(img.get(a, b));
    ellipse(a, b, 10, 10);

    let x = mouseX;
    let y = mouseY;
    let px = 0;
    let py = 0;

    if (page === 1) {
        page1(x, y);
    } else if (page === 2) {
        page2(x, y);
    } else if (page === 3) {
        page3(x, y);
    } else if (page === 4) {
        page4(x, y);
    }
}

function page1(x, y) {
    background(220);
    fill(255, 0, 0);
    rect(10, 10, 100, 100);

    px = 10;
    py = 10;
    tint(255, 0, 0);
    enlargeimg(px, py, x, y);
    
}

function page2(x, y) {
    background(220);
    fill(255, 0, 0);
    rect(100, 100, 100, 100);
    
    px = 100;
    py = 100;
    tint(255, 255, 255);
    enlargeimg(px, py, x, y);
}

function page3(x, y) {
    background(220);
    fill(255, 0, 0);
    rect(200, 200, 100, 100);

    displaceColors = createFilterShader(displaceColorsSrc);
    px = 200;
    py = 200;
    enlargeimg(px, py, x, y);
    filter(displaceColors);
    
}

function page4(x, y) {
    background(220);
    fill(255, 0, 0);
    rect(100, 100, 300, 300);

    px = 100;
    py = 300;
    blend(img, mouseX, mouseY, 300, 300, mouseX, mouseY,255, 255, ADD);
}



function mousePressed() {
    page++;
    if (page > 4) {
        page = 1;
    }
    
}

function keyPressed() {
    page--;
    if (page < 1) {
        page = 4;
    }
    
}

function enlargeimg(px, py, x, y) {
    image(img, px, py, x, y);
}