
const ceraBigStart = (p) => {
  const CANVAS_SIZE = 1022;
  const C = { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 };
  const PAD = 2;
  const RESET_INTERVAL = 8 * 1000; // 8 секунд
  const GROW_DURATION = 15_000; // Время роста при каждом запуске

  let arms = [];
  let t0;
  let lastReset = 0;

  p.setup = () => {
    p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    resetPattern();
  };

  p.draw = () => {
    const now = p.millis();

    // Проверка на сброс
    if (now - lastReset > RESET_INTERVAL) {
      resetPattern();
    }

    const grow = now - t0 < GROW_DURATION;
    p.noStroke();

    for (let i = arms.length - 1; i >= 0; i--) {
      const a = arms[i];
      a.upd();
      a.show();
      if (grow && a.bReady()) arms.push(a.spawn());
      if (a.dead) arms.splice(i, 1);
    }
  };

  function resetPattern() {
    p.background(0);
    arms = [];
    const startCount = 30; // Больше начальных ветвей
    for (let i = 0; i < startCount; i++) {
      arms.push(new Arm(C.x, C.y, p.random(p.TWO_PI)));
    }
    t0 = p.millis();
    lastReset = t0;
  }

  class Arm {
    constructor(x, y, ang) {
      this.pos = p.createVector(x, y);
      this.ang = ang;
      this.spd = p.random(0.6, 1.2);
      this.rad = 4;
      this.age = 0;
      this.life = p.int(p.random(90, 130));
      this.dead = false;
    }

    upd() {
      this.pos.x += p.cos(this.ang) * this.spd;
      this.pos.y += p.sin(this.ang) * this.spd;
      this.rad += 0.18;
      this.age++;

      if (
        this.age > this.life ||
        this.pos.x < PAD || this.pos.x > p.width - PAD ||
        this.pos.y < PAD || this.pos.y > p.height - PAD
      ) this.dead = true;
    }

    show() {
      const g = p.map(this.age, 0, this.life, 100, 25);
      p.fill(0, 0, g, 80);
      p.ellipse(this.pos.x, this.pos.y, this.rad);
    }

    bReady() {
      return p.random() < 0.03 && this.age > 40;
    }

    spawn() {
      return new Arm(
        this.pos.x,
        this.pos.y,
        this.ang + p.random(-p.PI * 0.45, p.PI * 0.45)
      );
    }
  }
};

// Инициализация при полной загрузке страницы
window.addEventListener('load', () => {
  new p5(ceraBigStart, 'cera');
});
