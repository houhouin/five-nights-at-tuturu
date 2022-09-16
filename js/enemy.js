class Enemy {
  constructor(position, hidden = false) {
    this.position = position;

    setTimeout(() => {
      this.jumpscare = true;
    }, ENEMY_TIME_TO_KILL)
    
    this.shown = false;
    this.jumpscare = false;
    this.vent = hidden;
  }

  draw() {
    if (!this.vent) {
      c.drawImage(mayuriIdleImage, this.position.x, this.position.y, this.position.width, this.position.height);
    }
  }
}