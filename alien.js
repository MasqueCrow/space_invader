class Alien {
	constructor(positionX, positionY, imageA, imageB, pointValue) {
		this.x = positionX;
		this.y = positionY;
		this.width = 38;
		this.height = 26;
		this.alive = true;
		this.imageA = imageA;
		this.imageB = imageB;
		this.currentImage = 'A';
		this.pts = pointValue;
		this.radius = 20; // Used for collision detection
		this.movementSpeed = 2;
	}

	show() {
		// Display alien when it's alive
		if (this.alive) {
			if (this.currentImage === 'A') {
				image(this.imageA, this.x, this.y, this.width, this.height);
			} else if (this.currentImage === 'B') {
				image(this.imageB, this.x, this.y, this.width, this.height);
			}
		}
	}

	move() {
		this.x += this.movementSpeed;

		// Toggle image animation
		this.currentImage = this.currentImage === 'A' ? 'B' : 'A';
	}

	shoot(color = 'pink') {
		const alienLaser = new Laser(this.x, this.y, color); // Adjust the position as needed
		alien_lasers.push(alienLaser);
	}

	shiftDown() {
		this.movementSpeed = -this.movementSpeed;
		this.y += this.height;
	}

	setPace(speed) {
		this.movementSpeed *= speed;
	}

	getCoordinate() {
		return [this.x, this.y];
	}
}