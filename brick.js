class Brick {
    constructor(positionX, positionY) {
        this.x = positionX;
        this.y = positionY;
        this.movementDirection = 1; // 1 for right, -1 for left
        this.width = 50;
        this.height = 10;
        this.radius = this.width / 2; // Radius for rounded corners
    }

    show() {
        fill(150, 75, 0); // Set brick color
        stroke(0); // Set no outline

        // Draw the rounded rectangle (brick)
        rect(this.x, this.y, this.width, this.height, this.radius);

        // uncomment the following lines to add corner arcs
        // arc(this.x + this.radius, this.y + this.radius, this.radius * 2, this.radius * 2, PI, 1.5 * PI);
        // arc(this.x + this.width - this.radius, this.y + this.radius, this.radius * 2, this.radius * 2, 1.5 * PI, TWO_PI);
    }

    move() {
        this.x += this.movementDirection * 10; // Adjust the movement speed as needed
    }

    setDirection(dir) {
        this.movementDirection = dir; // Set the movement direction (1 or -1)
    }

    getX() {
        return this.x; // Get the current X position
    }
}