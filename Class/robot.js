class Robot {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
    }

    display() {
        push();
        translate(this.x, this.y);
        
        // Body
        fill(200);
        rect(0, 0, this.size, this.size * 1.5);
        
        // Head
        fill(220);
        rect(this.size * 0.1, -this.size * 0.6, this.size * 0.8, this.size * 0.6);
        
        // Eyes
        fill(0);
        ellipse(this.size * 0.3, -this.size * 0.4, this.size * 0.1);
        ellipse(this.size * 0.7, -this.size * 0.4, this.size * 0.1);
        
        // Mouth
        rect(this.size * 0.3, -this.size * 0.2, this.size * 0.4, this.size * 0.05);
        
        // Arms
        fill(180);
        rect(-this.size * 0.2, 0, this.size * 0.2, this.size * 0.8);
        rect(this.size, 0, this.size * 0.2, this.size * 0.8);
        
        // Legs
        rect(this.size * 0.1, this.size * 1.5, this.size * 0.3, this.size * 0.5);
        rect(this.size * 0.6, this.size * 1.5, this.size * 0.3, this.size * 0.5);
        
        pop();
    }
}
