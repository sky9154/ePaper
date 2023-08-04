import { FC, FormEvent } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import SubmitButton from '../../components/SubmitButton';


const Create: FC = () => {
  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const name = data.get('name');
    const mac = data.get('mac');

    if (name || mac) {
      console.table({
        '裝置名稱': name,
        'Mac Address': mac
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
          <TextField
            label="裝置名稱"
            id="name"
            name="name"
            autoComplete="off"
            fullWidth
          />
          <TextField
            label="Mac Address"
            id="mac"
            name="mac"
            autoComplete="off"
            fullWidth
          />
          <SubmitButton />
        </Stack>
      </Box>
    </Box>
  );
}

export default Create;