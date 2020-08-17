// Modified particle system generator originally from Processor (@OpenProcessing)

class ParticleSystem {
	constructor(bx, by, bw, bh) {
		this.bx = bx || 0;
		this.by = by || 0;
		this.bw = bw || width;
		this.bh = bh || height;

		this.bounds = { l: this.bx - 50, t: this.by - 50, r: width + 50, b: height + 50 }
		this.bounds.rx = function () { return random(this.l, this.r) }
		this.bounds.ry = function () { return random(this.t, this.b) }

		this.colors = color(100);
		this.particles = [];
	}
	build(qtt) {
		for (let i = 0; i < qtt; i++) {
			let p = this.onAdd(i);
			p.__super = this;
			p.color = random(this.colors);
			this.particles.push(p);
		}
	}
	onAdd() {
		return new Particle(this.bounds.rx(), this.bounds.ry());
	}
	render() {
		for (let p of this.particles) {
			p.update();
			p.render();
		}
	}
}

// Colors used in stars/perlin noise
function getColor() {
	colors = [
		color(69, 33, 124),
		color(7, 153, 242),
		color(255, 255, 255),
		color(0, 174, 255),
		color(6, 109, 224),
		color(58, 197, 255),
		color(129, 255, 250),
	]
	return colors;
}

class Particle {
	constructor(x, y) {
		this.pos = new p5.Vector(x, y);
		this.color = color(255);
		this.r = 1
	}
	update() {
		this.__nn = noise(this.pos.x / scale, this.pos.y / scale);
		this.__dir = this.__nn * TAU * scale;
		this.pos.add(Math.cos(this.__dir) / 3,
			Math.sin(this.__dir) / 3);
	}
	checkBounds() {
		if (this.pos.x < this.__super.bounds.l ||
			this.pos.x > this.__super.bounds.r ||
			this.pos.y < this.__super.bounds.t ||
			this.pos.y * 2 > this.__super.bounds.b) {
			this.pos.set(this.__super.bounds.rx(), this.__super.bounds.ry());
		}
	}
	render() {
		// Gradually change opacity here based on height of the particle (eg. higher is brighter).
		if (this.pos.y > random(windowHeight / 3, windowHeight / 2)) {
			this.color.setAlpha(180);
			fill(this.color);
			if (this.pos.y > random(windowHeight / 5, windowHeight / 4)) {
				this.color.setAlpha(60);
				fill(this.color);
			}
		}
		else {
			this.color.setAlpha(255);
			fill(this.color);
		}
		circle(this.pos.x, this.pos.y, this.r);
	}
}
