import {
  useRef,
  useState,
  MouseEvent,
  ChangeEvent
} from 'react';
import {
  BiSolidCircle,
  BiRefresh,
  BiRotateLeft,
  BiRotateRight,
  BiDownload
} from 'react-icons/bi';
import { HexColorPicker } from 'react-colorful';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import CanvasClass from '../functions/Canvas';


interface CanvasProps {
  width: number;
  height: number;
}

const Canvas: React.FC<CanvasProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [colorPicker, setColorPicker] = useState<null | HTMLElement>(null);
  const [point, setPoint] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [tool, setTool] = useState<string>('pencil');
  const [penColor, setPenColor] = useState<string>('#000000');
  const [inputState, setInputState] = useState<boolean>(false);
  const [penSize, setPenSize] = useState<number>(10);
  const [savedImage, setSavedImage] = useState<HTMLImageElement>(new Image());
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [imageArray, setImageArray] = useState<HTMLImageElement[]>([]);

  const canvas = new CanvasClass(canvasRef, ctx);
  canvas.setSize(800, 480, penSize);
  canvas.setPenColor(penColor);

  const handleCanvasRef = (canvas: HTMLCanvasElement | null) => {
    if (canvas) {
      const context = canvas.getContext('2d');

      if (context) {
        if (!ctx) {
          context.fillStyle = '#FFFFFF';
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.fillStyle = penColor;
        }
        setCtx(context);
      }
    }
  };

  const toolSelected = (newTool: string) => {
    if (newTool !== tool) {
      setTool(newTool);
    }
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (drawing && ctx) {
      canvas.setLastPoint({
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY
      });

      canvas.clearCanvas();
      canvas.restore(savedImage);

      switch (tool) {
        case 'pencil':
          canvas.draw();

          break;
        case 'eraser':
          canvas.clear();

          break;
        case 'line':
          canvas.drawLine(point);

          break;
        case 'rectangle':
          canvas.drawRectangle(point);

          break;
        case 'ellipse':
          canvas.drawOval(point);

          break;
      }

      ctx.stroke();
    }
  };

  const startDrawing = (event: MouseEvent<HTMLCanvasElement>) => {
    if (ctx) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penSize;

      setPoint({
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY
      });

      if (tool === 'text' && !inputState) {
        setInputState(true);

        const input = document.createElement('input');

        input.style.position = 'fixed';
        input.style.fontSize = `${penSize}px`;
        input.style.width = `${penSize * 10}px`;
        input.style.maxWidth = '500px';
        input.style.left = `${event.clientX - 4}px`;
        input.style.top = `${event.clientY - 4}px`;
        input.style.zIndex = '100';

        input.onchange = () => {
          canvas.addText(input.value, {
            x: event.nativeEvent.offsetX,
            y: event.nativeEvent.offsetY
          });

          document.body.removeChild(input);

          setInputState(false);
          pushImageArray();
        };

        document.body.appendChild(input);
        input.focus();
      }

      ctx.beginPath();
      ctx.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);

      canvas.saveCanvas(setSavedImage);
      setDrawing(true);
    }
  };

  const endDrawing = () => {
    setDrawing(false);
  };

  if (imageArray.length === 0) {
    const context = canvas.canvasRef.current;

    if (context) {
      const saved = new Image();
      saved.src = context.toDataURL('image/png');
      imageArray.push(saved);
      setImageArray(imageArray);
    }
  }

  const pushImageArray = () => {
    const context = canvas.canvasRef.current;

    if (context) {
      const saved = new Image();
      saved.src = context.toDataURL('image/png');
      const newImageArray = imageArray.push(saved);
      setImageArray(imageArray);
      setImageIndex(newImageArray - 1);
    }
  }

  return (
    <Paper elevation={3} style={{ padding: '16px' }}>
      <canvas
        ref={(node) => {
          canvasRef.current = node;
          handleCanvasRef(node);
        }}
        width={width}
        height={height}
        style={{
          border: '1px solid #cdcdcd',
          borderRadius: 2
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        onMouseUpCapture={pushImageArray}
      />
      <Box>
        <IconButton
          size="large"
          aria-describedby="colorPicker"
          onClick={(event: MouseEvent<HTMLButtonElement>) => setColorPicker(event.currentTarget)}
          sx={{ color: penColor }}
        >
          <BiSolidCircle />
        </IconButton>
        <Popover
          id="colorPicker"
          open={Boolean(colorPicker)}
          anchorEl={colorPicker}
          onClose={() => setColorPicker(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
        >
          <Box m={2}>
            <HexColorPicker color={penColor} onChange={setPenColor} />
          </Box>
        </Popover>
        <OutlinedInput
          type="number"
          value={penSize}
          sx={{ width: 90 }}
          endAdornment={<InputAdornment position="end">px</InputAdornment>}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const size = Number(event.target.value);

            if (size > 0 && size <= 100) {
              setPenSize(size);
            }
          }}
        />
        {canvas.tools.map((item, index) => (
          <IconButton
            size="large"
            key={index}
            onClick={() => toolSelected(item.name)}
            disabled={tool === item.name}
          >
            {item.icon}
          </IconButton>
        ))}
        <IconButton
          size="large"
          onClick={() => canvas.prevDraw(imageArray, imageIndex, setImageIndex)}
        >
          <BiRotateLeft />
        </IconButton>
        <IconButton
          size="large"
          onClick={() => canvas.nextDraw(imageArray, imageIndex, setImageIndex)}
        >
          <BiRotateRight />
        </IconButton>
        <IconButton
          size="large"
          onClick={() => canvas.initCanvas(setImageIndex, setImageArray)}
        >
          <BiRefresh />
        </IconButton>
        <IconButton
          size="large"
          onClick={() => canvas.download()}
        >
          <BiDownload />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default Canvas;