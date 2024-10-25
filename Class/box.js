let score = 0;
let whiteBoxes = [];

class Box {
    constructor(x, y, w, h, isWhite = false) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.isDestroyed = false;
        this.velocity = 3;
        this.isWhite = isWhite;
        this.respawn();
    }

    respawn() {
        this.x = random(width - this.w);
        this.y = random(height - this.h);
        this.isDestroyed = false;
    }

    display() {
        push();
        translate(this.x, this.y);
        if (this.isWhite) {
            fill(255);
        } else {
            fill(0);
        }
        rect(0, 0, this.w, this.h);
        pop();
    }

    move() {
        
            this.x += random(-this.velocity, this.velocity);
            this.y += random(-this.velocity, this.velocity);
       
    }

    destroy() {
        if (!this.isWhite) {
            this.isDestroyed = true;
            score++; // Increment the score when the box is destroyed
            this.respawn();
        }
    }
}

// Function to reset the score
function resetScore() {
    score = 0;
}

// Function to add white boxes every five glitch numbers
function addWhiteBoxes() {
    if (glitchIntensity % 5 === 0 && whiteBoxes.length < glitchIntensity / 5) {
        let whiteBox = new Box(random(width), random(height), random(30, 100), random(30, 100), true);
        whiteBoxes.push(whiteBox);
    }
}
