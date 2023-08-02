import { FC } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { zhHK } from '@mui/x-date-pickers/locales';
import Home from './components/Home';


const theme = createTheme({
  typography: {
    fontFamily: [
      'Noto Sans TC',
      'Roboto',
      'sans-serif',
    ].join(',')
  }
}, zhHK);

const App: FC = () => {

  return (
    <ThemeProvider theme={theme}>
      <Toaster />
      <Home />
    </ThemeProvider>
  );
}

export default App;