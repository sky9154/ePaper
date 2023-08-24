import { FC } from 'react';
import Stack from '@mui/material/Stack';
import MainCanvas from '../components/Canvas';


const Canvas: FC = () => {

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <MainCanvas
        width={800}
        height={480}
      />
    </Stack>

  );
}

export default Canvas;