class Ship {
	constructor(color = 'green', positionX = 300, positionY = height - 10) {
		this.x = positionX;
		this.y = positionY;
		this.height = 10;
		this.width = 60;
		this.movementDirection = 0;
		this.life = 4;
		this.radius = 35;
		this.color = color;
	}

	show() {
		fill(this.color);
		noStroke();
		// Draw the horizontal rectangle (ship body)
		rect(this.x, this.y, this.width, this.height); 
		// Draw the vertical square on top of the rectangle (ship cockpit)
		rect(this.x + 20, this.y - 10, 20, 10); 
	}

	move() {
		this.x += this.movementDirection * 10;
	}

	setDirection(dir) {
		this.movementDirection = dir;
	}

	getRemainingLives() {
		return this.life;
	}

	decreaseLife() {
		if (this.life > 0) {
			this.life--;
		}
	}

	getCoordinate() {
		return [this.x, this.y];
	}
}