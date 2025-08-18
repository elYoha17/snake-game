import { configs } from "./configs";

export default class Console extends HTMLElement {
  
  root: ShadowRoot;
  canvas!: HTMLCanvasElement;
  scoreEl!: HTMLElement;
  context!: CanvasRenderingContext2D|null;

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
    `;
  }

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.initialize();
  }

  initialize() {
    this.root.innerHTML = `
        <style>${this.css}</style>
        ${this.html}
    `;

    this.canvas = this.root.querySelector('canvas') as HTMLCanvasElement;
    this.scoreEl = this.root.querySelector('#score')!;
    
    this.canvas.width = configs.wStep * configs.size;
    this.canvas.height = configs.hStep * configs.size;
    this.context = this.canvas.getContext('2d');
    
  }
}