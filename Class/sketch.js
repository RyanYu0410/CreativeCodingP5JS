let myRobots = [];
let boxes = [];
let gameEnded = false;
let endGameButton;
let restartButton;
let resumeButton;
let glitchIntensity = 0;
let glitchPixels = [];

function setup() {
    gameEnded = false;
    glitchIntensity = 0;
    score = 0;
    createCanvas(windowWidth-20, 400);
    initializeGlitchPixels();
    drawGlitchedBackground();
    for (let i = 0; i < 3; i++) {
        myRobots[i] = new Robot(random(width/3, width/3*2), random(height/3, height/3*2), random(5, 40));
    }
   
    // Create multiple random boxes
    for (let i = 0; i < 10; i++) {
        boxes.push(new Box(random(width), random(height), random(10, 80), random(10, 80)));
    }

    endGameButton = createButton('End Game');
    endGameButton.position(width / 2 - 40, height / 2 * 3 - 40);
    endGameButton.mousePressed(endGame);

    restartButton = createButton('Restart');
    restartButton.position(width / 2 - 80, height / 2 + 80);
    restartButton.mousePressed(restartGame);
    restartButton.hide();

    resumeButton = createButton('Resume');
    resumeButton.position(width / 2 + 20, height / 2 + 80);
    resumeButton.mousePressed(resumeGame);
    resumeButton.hide();

}

function draw() {
    if (!gameEnded) {
        if (score >= 200) {
            background(0, 0, 255); // Blue background
            fill(255);
            noStroke();
            // Draw sad face
            ellipse(width/2, height/2, 200, 200); // Face
            fill(0, 0, 255);
            ellipse(width/2 - 40, height/2 - 20, 20, 20); // Left eye
            ellipse(width/2 + 40, height/2 - 20, 20, 20); // Right eye
            noFill();
            stroke(0, 0, 255);
            strokeWeight(10);
            arc(width/2, height/2 + 40, 80, 80, PI, TWO_PI); // Sad mouth
            noStroke();
        } else {
            drawGlitchedBackground();
        }
        
        // Display dash timer at the top
        fill(0);
        textSize(16);
        textAlign(LEFT, TOP);
        let dashTimeLeft = myRobots[0].isDashing ? myRobots[0].dashTimer : myRobots[0].dashDuration;
        let dashText = myRobots[0].isDashing ? "Dashing: " : "Dash Ready: ";
        text(dashText + dashTimeLeft.toFixed(1), 10, 10);
        
        // Loop through all robots instead of using individual variables
        for (let i = myRobots.length - 1; i >= 0; i--) {
            let robot = myRobots[i];
            robot.display();
            robot.move();
            robot.attack();
            robot.stretch();
            robot.dash();
            
            // Check collision with all boxes
            for (let j = boxes.length - 1; j >= 0; j--) {
                if (!boxes[j].isDestroyed && robot.checkCollision(boxes[j])) {
                    boxes[j].destroy();
                    robot.setGreenEffect();
                    boxes.splice(j, 1);
                    updateGlitchIntensity();
                    // Optionally, create a new box to replace the destroyed one
                    boxes.push(new Box(random(width), random(height), random(10, 80), random(10, 80)));
                }
            }

            // Check collision with all white boxes
            for (let k = whiteBoxes.length - 1; k >= 0; k--) {
                if (!whiteBoxes[k].isDestroyed && robot.checkCollision(whiteBoxes[k])) {
                    // Prevent robot from overlapping with white box
                    robot.x = random(width/3, width/3*2);
                    robot.y = random(height/3, height/3*2);
                }
            }

            if (mouseIsPressed && robot.isClicked(mouseX, mouseY)) {
                myRobots.splice(i, 1);
            }
        }
        
        // Display and move all boxes
        for (let box of boxes) {
            if (!box.isDestroyed) {
                box.display();
                box.move();
            }
        }

        // Display and move all white boxes
        for (let whiteBox of whiteBoxes) {
            if (!whiteBox.isDestroyed) {
                whiteBox.display();
                whiteBox.move();
            }
        }

        // Display score
        fill(0);
        textSize(20);
        textAlign(RIGHT, TOP);
        text(`Score: ${score}`, width - 10, 10);
    } else {
        displayEndScreen();
    }
}

function drawGlitchedBackground() {
    background(220);
    push();
    // Apply glitch effect based on score and white boxes
    let glitchMultiplier = 1 + (whiteBoxes.length * 0.5); // Increase glitch intensity with white boxes
    
    for (let i = 0; i < glitchIntensity * glitchMultiplier; i++) {
        let glitch = glitchPixels[i % glitchPixels.length];
        
        // Make glitch more intense with more white boxes
        let glitchSize = map(whiteBoxes.length, 0, 20, 1, 3);
        
        fill(glitch.color);
        noStroke();
        rect(glitch.x, glitch.y, glitch.w * glitchSize, glitch.h * glitchSize);
        
        // Increase random movement probability with more white boxes
        if (random() < 0.1 + (whiteBoxes.length * 0.02)) {
            glitch.x = random(width);
            glitch.y = random(height);
            // Add color shifting based on white boxes
            glitch.color = color(
                random(255),
                random(255),
                random(255),
                map(whiteBoxes.length, 0, 20, 100, 255)
            );
        }
    }
    pop();
}

function updateGlitchIntensity() {
    glitchIntensity = min(floor(score / 2), glitchPixels.length);  // Increase glitch every 2 points, cap at max pixels
    addWhiteBoxes(); // Add white boxes based on glitch intensity
}

function endGame() {
    gameEnded = true;
    endGameButton.hide();
    restartButton.show();
    resumeButton.show();
}

function restartGame() {
    restartButton.hide();
    resumeButton.hide();
    setup();
}

function resumeGame() {
    gameEnded = false;
    endGameButton.show();
    restartButton.hide();
    resumeButton.hide();
}

function displayEndScreen() {
    if (score >= 200) {
        background(0, 0, 255);
        fill(255);
        textSize(32);
        textAlign(CENTER, CENTER);
        textFont('Courier New');
        text("How does it feel to be a robot?", width / 2, height / 2);
    } else {
        background(0);
        fill(255);
        textSize(32);
        textAlign(CENTER, CENTER);
        text(`Final Score: ${score}`, width / 2, height / 2);
    }
}

function initializeGlitchPixels() {
    glitchPixels = [];
    for (let i = 0; i < 100; i++) {
        glitchPixels.push({
            x: random(width),
            y: random(height),
            w: random(5, 20),
            h: random(2, 10),
            color: color(random(255), random(255), random(255))
        });
    }
}
class Robot {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.originalSize = size;
        this.velocity = 0;
        this.gravity = 0.5;
        this.attackAngle = 0;
        this.isAttacking = false;
        this.isStretching = false;
        this.stretchFactor = 1;
        this.greenEffectTimer = 0;
        this.isDashing = false;
        this.dashSpeed = 20;
        this.dashDuration = 10;
        this.dashTimer = 0;
        this.direction = 1; // 1 for right, -1 for left
        this.isMoving = false;
        this.legAngle = 0; // For leg animation
        this.color = color(200); // Default color
    }

    display() {
        push();
        translate(this.x, this.y);
        scale(this.direction, this.stretchFactor);
        
        if (this.isMoving) {
            this.drawSideView();
        } else {
            this.drawFrontView();
        }
        
        if (this.isAttacking) {
            this.drawAttackCurve();
        }
        
        pop();

        if (this.greenEffectTimer > 0) {
            this.greenEffectTimer -= deltaTime / 1000;
        }
    }

    drawFrontView() {
        // Body
        fill(this.isDashing ? color(255, 0, 0) : this.color);
        rect(0, 0, this.size, this.size * 1.5);
        
        // Head
        fill(this.isDashing ? color(255, 50, 50) : color(220));
        rect(this.size * 0.1, -this.size * 0.6, this.size * 0.8, this.size * 0.6);
        
        // Antenna
        stroke(this.greenEffectTimer > 0 ? color(0, 255, 0) : 150);
        line(this.size * 0.5, -this.size * 0.6, this.size * 0.5, -this.size * 0.9);
        noStroke();
        fill(this.greenEffectTimer > 0 ? color(0, 255, 0) : color(255, 0, 0));
        ellipse(this.size * 0.5, -this.size * 0.9, this.size * 0.1);
        
        // Eyes
        fill(0);
        ellipse(this.size * 0.3, -this.size * 0.4, this.size * 0.1);
        ellipse(this.size * 0.7, -this.size * 0.4, this.size * 0.1);
        
        // Mouth
        rect(this.size * 0.3, -this.size * 0.2, this.size * 0.4, this.size * 0.05);
        
        // Arms
        fill(this.isDashing ? color(255, 100, 100) : color(180));
        rect(-this.size * 0.2, 0, this.size * 0.2, this.size * 0.8);
        rect(this.size, 0, this.size * 0.2, this.size * 0.8);
        
        // Legs
        this.drawLegs();
    }

    drawSideView() {
        // Body
        fill(this.isDashing ? color(255, 0, 0) : this.color);
        rect(0, 0, this.size, this.size * 1.5);
        
        // Head
        fill(this.isDashing ? color(255, 50, 50) : color(220));
        rect(this.size * 0.1, -this.size * 0.6, this.size * 0.8, this.size * 0.6);
        
        // Antenna
        stroke(this.greenEffectTimer > 0 ? color(0, 255, 0) : 150);
        line(this.size * 0.5, -this.size * 0.6, this.size * 0.5, -this.size * 0.9);
        noStroke();
        fill(this.greenEffectTimer > 0 ? color(0, 255, 0) : color(255, 0, 0));
        ellipse(this.size * 0.5, -this.size * 0.9, this.size * 0.1);
        
        // Eye (only one visible from side view)
        fill(0);
        ellipse(this.size * 0.7, -this.size * 0.4, this.size * 0.1);
        
        // Mouth
        rect(this.size * 0.5, -this.size * 0.2, this.size * 0.2, this.size * 0.05);
        
        // Arm (only one visible from side view)
        fill(this.isDashing ? color(255, 100, 100) : color(180));
        rect(this.size, 0, this.size * 0.2, this.size * 0.8);
        
        // Legs
        this.drawLegs();
    }

    drawLegs() {
        fill(this.isDashing ? color(255, 100, 100) : color(180));
        // Left leg
        push();
        translate(this.size * 0.3, this.size * 1.5);
        rotate(sin(this.legAngle) * PI / 6);
        rect(-this.size * 0.15, 0, this.size * 0.3, this.size * 0.5);
        pop();

        // Right leg
        push();
        translate(this.size * 0.7, this.size * 1.5);
        rotate(sin(this.legAngle + PI) * PI / 6);
        rect(-this.size * 0.15, 0, this.size * 0.3, this.size * 0.5);
        pop();
    }

    move() {
        this.velocity += this.gravity;
        this.y += this.velocity;

        this.isMoving = false;

        if (keyIsDown(32)) { // Space key
            this.velocity = -10; 
            this.y += this.velocity;
        }

        if (keyIsDown(65)) { // 'A' key
            this.x -= this.isDashing ? this.dashSpeed : 10;
            this.direction = -1;
            this.isMoving = true;
            this.legAngle += this.isDashing ? 0.4 : 0.2;
        }

        if (keyIsDown(68)) { // 'D' key
            this.x += this.isDashing ? this.dashSpeed : 10;
            this.direction = 1;
            this.isMoving = true;
            this.legAngle += this.isDashing ? 0.4 : 0.2;
        }

        if (keyIsDown(87)) { // 'W' key
            this.y -= 10;
        }

        if (this.y > height - this.size * 2 * this.stretchFactor) {
            this.y = height - this.size * 2 * this.stretchFactor;
            this.velocity = 0;
        } else if (keyIsDown(83)) { // 'S' key
            this.y += 10;
        }

        if (this.isDashing) {
            this.dashTimer -= deltaTime / 1000; // Convert milliseconds to seconds
            if (this.dashTimer <= 0) {
                this.isDashing = false;
                this.dashTimer = 0;
            }
        }

        // Reset leg angle when not moving
        if (!this.isMoving) {
            this.legAngle = 0;
        }

        // Keep robot within canvas bounds
        this.x = constrain(this.x, 0, width - this.size);
        this.y = constrain(this.y, 0, height - this.size * 2 * this.stretchFactor);
    }

    attack() {
        if (keyIsDown(74)) { // 'J' key
            this.isAttacking = true;
            this.attackAngle += 0.2;
            if (this.attackAngle >= TWO_PI) {
                this.isAttacking = false;
                this.attackAngle = 0;
            }
        } else {
            this.isAttacking = false;
            this.attackAngle = 0;
        }
    }

    stretch() {
        if (keyIsDown(75)) { // 'K' key
            this.isStretching = true;
            this.stretchFactor = 1.5;
        } else {
            this.isStretching = false;
            this.stretchFactor = 1;
        }
    }

    dash() {
        if (keyIsDown(SHIFT) && !this.isDashing && this.dashTimer <= 0) {
            this.isDashing = true;
            this.dashTimer = this.dashDuration;
        }
    }

    drawAttackCurve() {
        push();
        noFill();
        stroke(this.greenEffectTimer > 0 ? color(0, 255, 0) : color(255, 0, 0));
        beginShape();
        for (let a = -10; a < this.attackAngle; a += 0.1) {
            let x = cos(a) * this.size * 1.5;
            let y = sin(a) * this.size * 1.5;
            vertex(x, y);
        }
        endShape();
        pop();
    }

    checkCollision(box) {
        if (this.isAttacking) {
            for (let a = -10; a < this.attackAngle; a += 0.1) {
                let x = this.x + cos(a) * this.size * 1.5 * this.direction;
                let y = this.y + sin(a) * this.size * 1.5 * this.stretchFactor;
                if (x > box.x && x < box.x + box.w && y > box.y && y < box.y + box.h) {
                    return true;
                }
            }
        }
        return false;
    }

    setGreenEffect() {
        this.greenEffectTimer = 0.2;
    }

    isClicked(mx, my) {
        return mx > this.x - this.size / 2 && mx < this.x + this.size / 2 &&
               my > this.y - this.size * 1.5 && my < this.y + this.size * 1.5;
    }
}