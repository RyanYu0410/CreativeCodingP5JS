let waveText = "Quatorze ans que je n'avais pas retrouvé le goût d'un amour impossible. Depuis Nevers. Je t'oublierai. Je t'oublie déjà. Regarde comme je t'oublie. Regarde-moi";
let waveAmplitude = 20;
let waveFrequency = 0.05;
let waveSpeed = 0.02;
let startX;
let startY;
let moveRight = false;
let asciiart_width = 50;
let asciiart_height = 50;
let myAsciiArt;
let gfx;
let ascii_arr;
let img;
let imgRatio;
let galleryImages = [];
let galleryAsciiArts = [];
let galleryCount = 5; 
let imagesLoaded = 0;

function preload() {
    for (let i = 0; i < galleryCount; i++) {
        galleryImages[i] = loadImage(`${i}.png`, (img) => {
            imagesLoaded++;
            if (i === 0) {
                imgRatio = img.width / img.height;
                asciiart_width = img.width;
                asciiart_height = img.height;
            }
        });
    }
}

function setup() {
    createCanvas(asciiart_width * galleryCount * 2 + (galleryCount - 1) * 20 + 1000, asciiart_height * 2 + 100);
    textSize(24);
    fill(255);
    noStroke();
    startX = 50;
    startY = height / 2;
    

    gfx = createGraphics(asciiart_width, asciiart_height);
    gfx.pixelDensity(1);

    myAsciiArt = new AsciiArt(this);
    textAlign(CENTER, CENTER);
    textFont('monospace', 6);
    textStyle(NORMAL);

    for (let i = 0; i < galleryCount; i++) {
        galleryAsciiArts[i] = new AsciiArt(this);
    }
    
}

function draw() {
    background(0);
    let x = startX;
    let y = startY;

    for (let i = 0; i < waveText.length; i++) {
        let letter = waveText.charAt(i);
        let yOffset = sin((x * waveFrequency) + (frameCount * waveSpeed)) * waveAmplitude;
        text(letter, x, y + yOffset);
        x += textWidth(letter);
    }
    if (moveRight) {
        startX += 5;
    }
    if (imagesLoaded === galleryCount) {
        drawAsciiArtGallery();
    } else {
        text("Loading...", width / 2, height / 2);
    }
}

function drawAsciiArtGallery() {
    
    let artX = 1050; // Starting x position for the gallery
    let artY = (height - asciiart_height * 2) / 2; // Centered vertically
    
    for (let i = 0; i < galleryCount; i++) {
        gfx.background(0);
        gfx.image(galleryImages[i], 0, 0, gfx.width, gfx.height);
        ascii_arr = galleryAsciiArts[i].convert(gfx);
        galleryAsciiArts[i].typeArray2d(ascii_arr, this, artX, artY, asciiart_width * 2, asciiart_height * 2); // Adjusted to make the image smaller
        artX += asciiart_width * 2 + 20; // Move to the right for the next image, with some spacing
    }
}

function windowResized() {
    resizeCanvas(asciiart_width * galleryCount * 2 + (galleryCount - 1) * 20 + 1000, asciiart_height * 2 + 100);
}

function mousePressed() {
    moveRight = !moveRight;
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        startX -= 40;
    } else if (keyCode === RIGHT_ARROW) {
        startX += 40;
    }
}
