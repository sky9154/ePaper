import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BiMenu,
  BiX,
  BiDevices,
  BiCalendarEdit,
  BiCalendarPlus
} from 'react-icons/bi';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Stack from '@mui/material/Stack';


interface Props {
  children: ReactNode;
}

const PageMenu = ({ children }: Props) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const pages = [{
    icon: <BiCalendarEdit />,
    name: '排程管理',
    path: '/event'
  }, {
    icon: <BiCalendarPlus />,
    name: '新增排程',
    path: '/event/create'
  }, {
    icon: <BiDevices />,
    name: '裝置管理',
    path: '/device'
  }]

  return (
    <Box sx={{
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transform: 'translateZ(0px)',
      flexGrow: 1
    }}>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="stretch"
        p={4}
      >
        <SpeedDial
          ariaLabel="PageMenu"
          sx={{ position: 'absolute', bottom: 16, right: 16, }}
          icon={
            <SpeedDialIcon
              icon={<BiMenu style={{  fontSize: '24px' }} />}
              openIcon={<BiX style={{  fontSize: '24px' }} />}
            />
          }
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
        >
          {pages.map((page) => (
            <SpeedDialAction
              key={page.name}
              icon={page.icon}
              tooltipTitle={page.name}
              sx={{ fontSize: '28px' }}
              onClick={() => {
                navigate(page.path);
                handleClose();
              }}
            />
          ))}
        </SpeedDial>
        <Box>
          {children}
        </Box>
      </Stack>
    </Box>
  );
}

export default PageMenu;