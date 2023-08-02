import { FC, useState, useEffect, FormEvent } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import SubmitButton from './SubmitButton';
import Device from '../api/Device';
import Event from '../api/Event';


type DeviceType = {
  name: string,
  macId: string
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
};

const Home: FC = () => {
  const [deviceMenu, setDeviceMenu] = useState<DeviceType[]>([]);
  const [devices, setDevices] = useState<string[]>([]);
  const [dateTime, setDateTime] = useState<Dayjs | null>(dayjs(new Date()).second(0));

  useEffect(() => {
    Device.get(setDeviceMenu);
  }, []);

  const handleDateTimeChange = (newDateTime: Dayjs | null) => {
    if (newDateTime) {
      setDateTime(dayjs(newDateTime).millisecond(0));
    }
  };

  const handleDevicesChange = (event: SelectChangeEvent<typeof devices>) => {
    const { target: { value } } = event;

    setDevices((typeof (value) === 'string') ? value.split(',') : value);
  };

  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const message = data.get('message');
    const devices = data.get('devices');

    console.table({
      devices: devices,
      dateTime: dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss'),
      message: message
    });

    if (devices || dateTime || message) {
      const date = dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss') as string
      await Event.save(devices as string, date, message as string);
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
          <FormControl>
            <Select
              multiple
              displayEmpty
              id="devices"
              name="devices"
              value={devices}
              onChange={handleDevicesChange}
              input={<OutlinedInput />}
              MenuProps={MenuProps}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {deviceMenu.map((device) => (
                <MenuItem
                  key={device.name}
                  value={device.name}
                >
                  {device.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              value={dateTime}
              onChange={handleDateTimeChange}
              format="YYYY-MM-DD HH:mm:ss"
            />
          </LocalizationProvider>
          <OutlinedInput
            id="message"
            name="message"
            autoComplete="off"
            fullWidth
          />
          <SubmitButton />
        </Stack>
      </Box>
    </Box>
  );
}

export default Home;