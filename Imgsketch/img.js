let img;

function preload() {
  img = loadImage('image.png');
}

function setup() {
  createCanvas(img.width, img.height);
  img.resize(width, height);
}

function draw() {
  background(255);
  let blendValue = map(mouseX, 0, width, 0, 255);
  if (mouseX > 300) {
    blend(img, mouseX, mouseY, 300, 300, mouseX, mouseY, 255, 255, ADD);
  }
  console.log(mouseX, mouseY);

  tint(blendValue, 0, 255, 255);
  image(img, 0, 0);
  blend(img, mouseX, mouseY, 300, 300, mouseX, mouseY, 255, 255, ADD);

  let barWidth = width / 10;
  if (mouseIsPressed) {
    for (let i = 0; i < width; i += barWidth) {
      let randomX = random(0, width - barWidth);
      blend(img, randomX, 0, barWidth, height, i, 0, barWidth, height, DIFFERENCE);
    }
  }
}
