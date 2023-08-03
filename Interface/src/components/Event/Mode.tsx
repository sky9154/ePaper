import { FC } from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';


interface ModeProps {
  mode: string;
  setMode: (value: string) => void;
}

const Mode: FC<ModeProps> = ({mode, setMode}) => {
  const modeMenu = [{
    name: '文字',
    value: 'text'
  }, {
    name: '會議',
    value: 'meet'
  }, {
    name: '表單',
    value: 'sheet'
  }, {
    name: '命令',
    value: 'command'
  }];

  const handleModeChange = (event: SelectChangeEvent) => {
    setMode(event.target.value);
  }

  return (
    <FormControl>
    <Select
      id="mode"
      name="mode"
      value={mode}
      onChange={handleModeChange}
      input={<OutlinedInput />}
    >
      {modeMenu.map((mode) => (
        <MenuItem
          key={mode.value}
          value={mode.value}
        >
          {mode.name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
  );
}

export default Mode;