import { configs } from "./configs";
import Point from "./Point";

export default class Game {
  private food!: Point;
  private snake: Point[] = [];

  get sketch() {
    return [...this.snake, this.food];
  }

  constructor() {
    this.generateFood();
  }

  generateFood() {
    let p: Point;
    let retries = configs.wStep * configs.hStep;

    do {
      p = Point.random(configs.foodColor);
      retries--;
    } while (retries >= 0 && this.snake.some((s) => s.equal(p)));

    this.food = p;
  }
}