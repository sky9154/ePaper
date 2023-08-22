import { FC, useState, useEffect, FormEvent } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import DeviceMenu from '../../components/Event/DeviceMenu';
import DateTime from '../../components/Event/DateTime';
import ModeMenu from '../../components/Event/ModeMenu';
import Form from '../../components/Event/Form';
import SubmitButton from '../../components/SubmitButton';
import Device from '../../api/Device';
import Event from '../../api/Event';
import Mode from '../../api/Mode';


type DeviceType = {
  name: string;
  macAddress: string;
}

type ModeType = {
  name: string;
  value: string;
}

const Create: FC = () => {
  const [deviceMenu, setDeviceMenu] = useState<DeviceType[]>([]);
  const [devices, setDevices] = useState<string[]>([]);
  const [mode, setMode] = useState<string>('');
  const [modeMenu, setModeMenu] = useState<ModeType[]>([]);
  const [dateTime, setDateTime] = useState<Dayjs | null>(dayjs(new Date()).second(0));
  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    Device.get(setDeviceMenu);
    Mode.get(setModeMenu);
  }, []);

  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const date = dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss');
    const deviceList = data.get('devices');
    const message = data.get('message');

    if (deviceList || date || mode || message) {
      Event.create({
        devices: deviceList as string,
        date_time: date as string,
        mode: mode as string,
        message: message as string
      }, uploadImage);
    }
  }

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        height: '100%',
        alignItems: 'center',
        borderRadius: 4,
        boxShadow: '0 4px 8px 0 #BDC9D7'
      }}
      onSubmit={send}>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="stretch"
        width="100%"
        spacing={2}
        p={4}
      >
        <DeviceMenu
          deviceMenu={deviceMenu}
          devices={devices}
          setDevices={setDevices}
        />
        <DateTime
          dateTime={dateTime}
          setDateTime={setDateTime}
        />
        <ModeMenu mode={mode} setMode={setMode} modeMenu={modeMenu} />
        {Form({ mode, setImageUrl, imageUrl, setUploadImage })}
        <SubmitButton />
      </Stack>
    </Box>
  );
}

export default Create;