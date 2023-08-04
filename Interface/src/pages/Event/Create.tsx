import { FC, useState, useEffect, FormEvent } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import DeviceMenu from '../../components/Event/DeviceMenu';
import DateTime from '../../components/Event/DateTime';
import Mode from '../../components/Event/Mode';
import Form from '../../components/Event/Form';
import SubmitButton from '../../components/SubmitButton';
import Device from '../../api/Device';
import Event from '../../api/Event';


type DeviceType = {
  name: string,
  macAddress: string
}

const Create: FC = () => {
  const [deviceMenu, setDeviceMenu] = useState<DeviceType[]>([]);
  const [devices, setDevices] = useState<string[]>([]);
  const [mode, setMode] = useState<string>('text');
  const [dateTime, setDateTime] = useState<Dayjs | null>(dayjs(new Date()).second(0));

  useEffect(() => {
    Device.get(setDeviceMenu);
  }, []);

  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const date = dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss');
    const deviceList = data.get('devices');
    let message = '';

    switch (mode) {
      case 'meet':
        message = `${data.get('topic')},${data.get('host')},${data.get('date')}`;

        console.table({
          '裝置': deviceList,
          '日期': date,
          '模式': mode,
          '主題': data.get('topic'),
          '主持': data.get('host'),
          '時間': data.get('date')
        });

        break;
      case 'sheet':
        console.table({
          '裝置': deviceList,
          '日期': date,
          '模式': mode
        });

        break;
      default:
        message = data.get('message') as string;

        console.table({
          '裝置': deviceList,
          '日期': date,
          '模式': mode,
          '訊息': message
        });

        break;
    }

    if (deviceList || date || mode || message) {
      await Event.create({
        devices: deviceList as string,
        date_time: date as string,
        mode: mode as string,
        message: message as string
      });
    }
  }

  return (
    <Box sx={{
      height: '100vh',
      width: '100%',
      display: 'flex',
      justifyContent: "center",
      alignItems: "center"
    }}>
      <Box
        component="form"
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: 4,
          boxShadow: '0 4px 8px 0 #BDC9D7'
        }}
        onSubmit={send}>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="stretch"
          width="300px"
          spacing={2}
          p={4}
        >
          <DeviceMenu
            deviceMenu={deviceMenu}
            devices={devices}
            setDevices={setDevices}
          />
          <DateTime dateTime={dateTime} setDateTime={setDateTime} />
          <Mode mode={mode} setMode={setMode} />
          {Form({ mode })}
          <SubmitButton />
        </Stack>
      </Box>
    </Box>
  );
}

export default Create;