import { FC, FormEvent } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import OutlinedInput from '@mui/material/OutlinedInput';
import SubmitButton from './SubmitButton';
import ePaper from '../api/ePaper';


const Home: FC = () => {
  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const message = data.get('message');

    if (message) {
      await ePaper.send(message as string);
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
          width: '280px',
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