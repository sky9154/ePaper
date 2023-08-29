import { MutableRefObject } from 'react';
import {
  BiPointer,
  BiPencil,
  BiDroplet,
  BiEraser,
  BiMinus,
  BiSquare,
  BiCircle,
  BiText
} from 'react-icons/bi';


class Canvas {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  ctx: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  penSize: number;
  penColor: string;
  tools: {
    name: string;
    icon: JSX.Element;
  }[];
  lastPoint: {
    x: number;
    y: number;
  };

  constructor(
    canvasRef: MutableRefObject<HTMLCanvasElement | null>,
    ctx: CanvasRenderingContext2D | null
  ) {
    this.canvasRef = canvasRef;
    this.ctx = ctx;
    this.width = 0;
    this.height = 0;
    this.penSize = 0;
    this.penColor = '#000000';
    this.lastPoint = { x: 0, y: 0 };
    this.tools = [{
      name: 'pointer',
      icon: <BiPointer />
    }, {
      name: 'pencil',
      icon: <BiPencil />
    }, {
      name: 'droplet',
      icon: <BiDroplet />
    }, {
      name: 'eraser',
      icon: <BiEraser />
    }, {
      name: 'line',
      icon: <BiMinus />
    }, {
      name: 'rectangle',
      icon: <BiSquare />
    }, {
      name: 'ellipse',
      icon: <BiCircle />
    }, {
      name: 'text',
      icon: <BiText />
    }]
  }

  setSize(width: number, height: number, penSize: number) {
    this.width = width;
    this.height = height;
    this.penSize = penSize;
  }

  setPenColor(penColor: string) {
    this.penColor = penColor;
  }

  setLastPoint(lastPoint: { x: number, y: number }) {
    this.lastPoint = lastPoint;
  }

  saveCanvas(setSavedImage: (savedImage: HTMLImageElement) => void) {
    const canvas = this.canvasRef.current;

    if (canvas) {
      const saved = new Image();
      saved.src = canvas.toDataURL('image/png');
      setSavedImage(saved);
    }
  };

  restore(savedImage: HTMLImageElement) {
    const canvas = this.canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(savedImage, 0, 0);
      }
    }
  };

  clearCanvas() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  };


  initCanvas(
    setImageIndex: (index: number) => void,
    setImageArray: (imageArray: HTMLImageElement[]) => void
  ) {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.fillStyle = this.penColor;

      setImageIndex(0);
      setImageArray([]);
    }
  };

  prevDraw(
    array: HTMLImageElement[],
    index: number,
    setImageIndex: (index: number) => void
  ) {
    if (index - 1 > -1) {
      this.clearCanvas();
      this.restore(array[index - 1]);

      setImageIndex(index - 1);
    }
  }

  nextDraw(
    array: HTMLImageElement[],
    index: number,
    setImageIndex: (index: number) => void
  ) {
    if (index + 1 < array.length) {
      this.clearCanvas();
      this.restore(array[index + 1]);

      setImageIndex(index + 1);
    }
  }

  download() {
    const canvas = this.canvasRef.current;
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const fileName = `${year}${month}${day}.png`;

    if (canvas) {
      const imageUrl = document.createElement('a');

      imageUrl.download = fileName;
      imageUrl.href = canvas.toDataURL('image/png');
      imageUrl.click();
    }
  }

  draw() {
    const lastPoint = this.lastPoint;

    if (this.ctx) {
      this.ctx.lineTo(lastPoint.x, lastPoint.y);
    }
  }

  getColor(point: { x: number, y: number }, setPenColor: (penColor: string) => void) {
    if (this.ctx) {
      const imageData = this.ctx.getImageData(point.x, point.y, 1, 1).data;
      const color = {
        red: imageData[0],
        green: imageData[1],
        blue: imageData[2]
      }

      setPenColor(`#${(color.red << 16 || color.green << 8 || color.blue).toString(16).padStart(6, '0')}`);
    }
  }

  clear() {
    const lastPoint = this.lastPoint;

    if (this.ctx) {
      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.lineTo(lastPoint.x, lastPoint.y);
    }
  }

  drawLine(point: { x: number, y: number }) {
    const lastPoint = this.lastPoint;

    if (this.ctx) {
      this.ctx.beginPath();
      this.ctx.moveTo(lastPoint.x, lastPoint.y);
      this.ctx.lineTo(point.x, point.y);
    }
  }

  drawRectangle(point: { x: number, y: number }) {
    const lastPoint = this.lastPoint;

    const width = lastPoint.x - point.x;
    const height = lastPoint.y - point.y;

    if (this.ctx) {
      this.ctx.strokeRect(point.x, point.y, width, height);
    }

  }

  drawOval(point: { x: number, y: number }) {
    const lastPoint = this.lastPoint;

    if (this.ctx) {
      this.ctx.beginPath();
      this.ctx.moveTo(point.x, point.y + (lastPoint.y - point.y) / 2);
      this.ctx.bezierCurveTo(point.x, point.y, lastPoint.x, point.y, lastPoint.x, point.y + (lastPoint.y - point.y) / 2);
      this.ctx.bezierCurveTo(lastPoint.x, lastPoint.y, point.x, lastPoint.y, point.x, point.y + (lastPoint.y - point.y) / 2);
      this.ctx.closePath();
      this.ctx.stroke();
    }
  };

  addText(text: string, point: { x: number, y: number }) {
    if (this.ctx) {
      this.ctx.textBaseline = 'top';
      this.ctx.textAlign = 'left';
      this.ctx.font = `${this.penSize}px sans-serif`;
      this.ctx.fillText(text, point.x, point.y);
    }
  }
}

export default Canvas;