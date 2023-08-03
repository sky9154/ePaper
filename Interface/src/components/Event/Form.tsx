import { FC } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';


interface FromProps {
  mode: string
}

const Form: FC<FromProps> = ({ mode }) => {
  switch (mode) {
    case 'command':
    case 'text':
      return (
        <OutlinedInput
          id="message"
          name="message"
          autoComplete="off"
          fullWidth
        />
      );
    case 'meet':
      return (
        <>
          <TextField
            label="主題"
            id="topic"
            name="topic"
            autoComplete="off"
            fullWidth
          />
          <TextField
            label="主持"
            id="host"
            name="host"
            autoComplete="off"
            fullWidth
          />
          <TextField
            label="時間"
            id="date"
            name="date"
            autoComplete="off"
            fullWidth
          />
        </>
      );
    default:
      return (
        <></>
      );
  }
}

export default Form;