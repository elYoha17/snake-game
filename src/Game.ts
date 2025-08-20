import { configs } from "./configs";
import { Direction, opposite } from "./Directions";
import Point from "./Point";

export default class Game {
  private food!: Point;
  private snake: Point[];
  private transposable: boolean;
  private over: boolean;
  private _start: boolean;
  private _score: number;
  private _lifetime: number;
  direction: Direction = configs.direction;

  get isStart() {
    return this._start;
  }

  get sketch() {
    return [...this.snake, this.food];
  }

  get head() {
    return this.snake[this.snake.length - 1];
  }

  get neck() {
    return this.snake[this.snake.length - 2];
  }

  get score() {
    return this._score;
  }

  get lifetime() {
    return this._lifetime;
  }

  get isTransposable() {
    return this.transposable;
  }

  get isOver() {
    return this.over;
  }

  constructor(transposable = false) {
    this._start = false;
    this.transposable = transposable;
    this.over = false;
    this._score = 0;
    this._lifetime = 0;

    this.snake = [];
    for (let x = 0; x < configs.minLength; x++) {
      const s = new Point(x, 0, configs.bodyColor);

      if (x === configs.minLength - 1) {
        s.style = configs.headColor;
      }
      this.snake.push(s);
    }
    this.generateFood();
  }

  start() {
    this._start = true;
  }
  
  private random(style: string = 'black'): Point {
    return new Point(
      Math.random() * (configs.wStep - 1),
      Math.random() * (configs.hStep - 1),
      style,
    );
  }

  private generateFood() {
    let p: Point;
    let retries = configs.wStep * configs.hStep;

    do {
      p = this.random(configs.foodColor);
      retries--;
    } while (retries >= 0 && this.snake.some((s) => s.equal(p)));

    this.food = p;
  }

  

  to(p: Point, direction: Direction, step: number = 1): Point {
    const point = p.clone();

    switch (direction) {
      case Direction.Up:
        point.y -= step;
        break;
      case Direction.Down:
        point.y += step;
        break;
      case Direction.Left:
        point.x -= step;
        break;
      case Direction.Right:
        point.x += step;
        break;
    }

    return point;
  }

  getDirection(): Direction {
    const head = this.head;
    const neck = this.neck;
    const diff = head.difference(neck);
    let dir;

    if (diff.x === 0 && diff.y === -1) dir = Direction.Up;
    else if (diff.x === 0 && diff.y === 1) dir = Direction.Down;
    else if (diff.x === -1 && diff.y === 0) dir = Direction.Left;
    else if (diff.x === 1 && diff.y === 0) dir = Direction.Right;
    else dir = this.direction;

    if (opposite(dir) === this.direction) {
      return dir;
    }
    return this.direction;
  }

  transpose(point: Point): Point {
    const p = point.clone();
    p.x = ((p.x % configs.wStep) + configs.wStep) % configs.wStep;
    p.y = ((p.y % configs.hStep) + configs.hStep) % configs.hStep;
    return p;
  }

  preview(): Point {
    let head = this.to(this.head, this.getDirection()).clone();

    if (this.hitWall(head) && this.transposable) {
      head = this.transpose(head);
    }

    return head;
  }

  hitWall(p: Point) {
    return  p.x < 0 || p.y < 0 || p.x >= configs.wStep || p.y >= configs.hStep;
  }

  move() {
    if (!this._start) return;

    const newHead = this.preview();

    this.over = newHead.x < 0 || newHead.y < 0 || newHead.x >= configs.wStep || newHead.y >= configs.hStep || this.snake.some(s => s.equal(newHead));

    if (!this.over) {
      this.head.style = configs.bodyColor;
      this.snake.push(newHead);
      const eaten = newHead.equal(this.food);
      if (eaten) {
        this._score++;
        this.generateFood();
      } else {
        this.snake.shift();
      }
      this._lifetime++;
    }
  }
}