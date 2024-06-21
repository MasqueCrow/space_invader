class Laser {
	constructor(positionX, positionY, color) {
		this.x = positionX;
		this.y = positionY;
		this.radius = 5;
		this.diameter = this.radius * 2;
		this.shouldDelete = false;
		this.color = color;
		this.isMovingUp = true;
	}

	show() {
		noStroke();
		fill(this.color);
		ellipse(this.x, this.y, this.diameter, this.diameter); // Draw a colored ellipse (laser)
	}

	moveUp() {
		this.y -= 20; // Move up along the y-axis
	}

	moveDown() {
		this.y += 20; // Move down along the y-axis
	}

	// Collision detection algorithm
	hit(entity) {
		// Calculate the distance between two points
		const distance = dist(this.x, this.y, entity.x, entity.y);

		// Check if the laser collides with the entity
		if (distance <= this.radius + entity.radius) {
			return true;
		}
		return false;
	}

	remove() {
		this.shouldDelete = true;
	}

	getCoordinate() {
		return [this.x, this.y];
	}
}