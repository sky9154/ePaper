import { MutableRefObject } from 'react';
import {
  BiEraser,
  BiPencil,
  BiSquare,
  BiCircle,
  BiMinus,
  BiText
} from 'react-icons/bi';


class Canvas {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  ctx: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  tools: {
    name: string,
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
    this.lastPoint = { x: 0, y: 0 };
    this.tools = [{
      name: 'pencil',
      icon: <BiPencil />
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

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
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

  draw() {
    const lastPoint = this.lastPoint;

    if (this.ctx) {
      this.ctx.lineTo(lastPoint.x, lastPoint.y);
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

  addText(point: { x: number, y: number }) {
    if (this.ctx) {
      this.ctx.fillText("Sample String", point.x, point.y);
    }
  }
}

export default Canvas;