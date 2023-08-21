import { FC } from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';


type ModeType = {
  name: string;
  value: string;
}

interface ModeProps {
  mode: string;
  setMode: (value: string) => void;
  modeMenu: ModeType[]
}

const Mode: FC<ModeProps> = ({ mode, setMode, modeMenu }) => {
  const handleModeChange = (event: SelectChangeEvent) => {
    setMode(event.target.value);
  }

  return (
    <FormControl>
      <Select
        id="mode"
        name="mode"
        defaultValue="default"
        onChange={handleModeChange}
        input={<OutlinedInput />}
      >
        <MenuItem disabled value="default">
          選擇模式
        </MenuItem>
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