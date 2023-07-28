import { FC, useState, FormEvent } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SubmitButton from './SubmitButton';
import ePaper from '../api/ePaper';
import { deviceMenu } from '../assets/data';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    },
  },
};

const Home: FC = () => {
  const [deviceList, setDeviceList] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof deviceList>) => {
    const { target: { value } } = event;

    setDeviceList(
      (typeof (value) === 'string') ? value.split(',') : value
    );
  };
  
  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const message = data.get('message');
    const deviceList = data.get('deviceList');

    if (message || deviceList) {
      await ePaper.send(deviceList as string, message as string);
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
              id="deviceList"
              name="deviceList"
              value={deviceList}
              onChange={handleChange}
              input={<OutlinedInput />}
              MenuProps={MenuProps}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {deviceMenu.map((device) => (
                <MenuItem
                  key={device.name}
                  value={device.mac}
                >
                  {device.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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