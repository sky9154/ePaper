import { FC } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';


type DeviceType = {
  name: string,
  macId: string
}

interface DeviceMenuProps {
  deviceMenu: DeviceType[];
  devices: string[];
  setDevices: (value: string[]) => void;
}

const DeviceMenu: FC<DeviceMenuProps> = ({ deviceMenu, devices, setDevices }) => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
      }
    }
  };

  const handleDevicesChange = (event: SelectChangeEvent<typeof devices>) => {
    const { target: { value } } = event;

    setDevices((typeof (value) === 'string') ? value.split(',') : value);
  };

  return (
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
  );
}

export default DeviceMenu;