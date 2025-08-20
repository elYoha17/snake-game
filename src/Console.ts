import { configs } from "./configs";
import { Direction } from "./Directions";
import Game from "./Game";
import type Point from "./Point";

export default class Console extends HTMLElement {
  
  root: ShadowRoot;
  canvas!: HTMLCanvasElement;
  scoreEl!: HTMLElement;
  lifetimeEl!: HTMLElement;
  context!: CanvasRenderingContext2D|null;

  game!: Game;
  started: boolean = false;
  frames: number = 0;
  delay: number = 20;
  rafId: number|null = null;
  running: boolean = false;

  get css() {
    return `
      :host {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      canvas {
        width: ${configs.wStep * configs.size}px;
        height: ${configs.hStep * configs.size}px;
        border: 3px solid #000000;
        background-color: #f0f0f0;
      }
      
      p {
        font-size: 10px;
        font-family: monospace;
        margin: 0;
      }

      p span {
        font-weight: bold;
      }
    `;
  }
  
  get html() {
    return `
      <canvas></canvas>
      <p>score: <span id="score">0</span></p>
      <p>Lifetime: <span id="lifetime">0</span></p>
    `;
  }

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.initialize();
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this.handleKeydown);
  }

  initialize() {
    this.root.innerHTML = `
        <style>${this.css}</style>
        ${this.html}
    `;

    this.canvas = this.root.querySelector('canvas') as HTMLCanvasElement;
    this.scoreEl = this.root.querySelector('#score')!;
    this.lifetimeEl = this.root.querySelector('#lifetime')!;
    
    this.canvas.width = configs.wStep * configs.size;
    this.canvas.height = configs.hStep * configs.size;
    this.context = this.canvas.getContext('2d');
    
    this.restart();

    document.addEventListener('keydown', this.handleKeydown);
  }

  draw(sketch: Point[]) {
    this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    sketch.forEach(s => {
      if (this.context) {
        this.context.fillStyle = s.style;
        this.context.fillRect(s.x * configs.size, s.y * configs.size, configs.size, configs.size);
      }
    });
  }

  render() {
    this.draw(this.game.sketch);
    this.scoreEl.innerText = String(this.game.score);
    this.lifetimeEl.innerText = String(this.game.lifetime);
  }

  restart() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.started = false;
    this.running = false;
    this.frames = 0;
    this.delay = 20;
    this.rafId = null;
    this.game = new Game();
    
    this.render();
  }

  update = () => {
    if (!this.running || this.game.isOver) return;
    
    if (this.frames % this.delay === 0) {
      this.game.move();
      this.render();
    }

    this.frames++;
    this.rafId = requestAnimationFrame(this.update);
  }

  start() {
    if (!this.running) {
      this.running = true;
      this.rafId = requestAnimationFrame(this.update);
    }
  }

  stop() {
    if (this.running) {
      this.running = false;
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }
  }

  handleAction = () => {
    if (!this.game.isStart) {
      this.game.start();
      this.start();
    } else {
      if (this.game.isOver) {
        this.restart();
      } else {
        if (this.running) {
          this.stop();
        } else {
          this.start();
        }
      }
    }
  }

  handleDirection = (direction: Direction) => {
    if (this.game.isStart && this.running && !this.game.isOver) {
      this.game.direction = direction;
    }
  }

  private handleKeydown = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
      this.handleAction();
    } else if (e.code === 'ArrowUp') {
      e.preventDefault();
      this.handleDirection(Direction.Up);
    } else if (e.code === 'ArrowDown') {
      e.preventDefault();
      this.handleDirection(Direction.Down);
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      this.handleDirection(Direction.Left);
    } else if (e.code === 'ArrowRight') {
      e.preventDefault();
      this.handleDirection(Direction.Right);
    }
  }
}