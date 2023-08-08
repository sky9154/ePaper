import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';


interface Props {
  children: ReactNode;
}

const AppBar = ({ children }: Props) => {
  const navigate = useNavigate();

  return (
    <Box sx={{
      height: '100vh',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="stretch"
        p={4}
      >
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={2}
          p={4}
        >
          <Button
            variant="contained"
            onClick={() => navigate('/device')}
          >
            裝置管理
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/event')}
          >
            事件管理
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/event/create')}
          >
            新增排程
          </Button>
        </Stack>
        <Box>
          {children}
        </Box>
      </Stack>
    </Box>
  );
}

export default AppBar;