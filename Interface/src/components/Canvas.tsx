import { useRef, useState, MouseEvent, ChangeEvent } from 'react';
import { BiEraser, BiSolidCircle } from 'react-icons/bi';
import { HexColorPicker } from 'react-colorful';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';


interface CanvasProps {
  width: number;
  height: number;
}

const Canvas: React.FC<CanvasProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [colorPicker, setColorPicker] = useState<null | HTMLElement>(null);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [penColor, setPenColor] = useState<string>('#000000');
  const [penSize, setPenSize] = useState<number>(10);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;

    ctx.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    ctx.stroke();
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (ctx) {
      ctx.beginPath();

      ctx.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
      setDrawing(true);
    }
  };

  const endDrawing = () => {
    setDrawing(false);
  };

  const clearCanvas = () => {
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
    }
  };

  const handleCanvasRef = (canvas: HTMLCanvasElement | null) => {
    if (canvas) {
      const context = canvas.getContext('2d');

      if (context) {
        setCtx(context);
      }
    }
  };

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
        <IconButton
          size="large"
          onClick={clearCanvas}
        >
          <BiEraser />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default Canvas;