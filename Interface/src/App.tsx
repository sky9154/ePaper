import { FC } from 'react';
import { useRoutes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { zhHK as pickerZhHK } from '@mui/x-date-pickers/locales';
import { zhTW as gridZhTW } from '@mui/x-data-grid';
import routes from './routers';


const theme = createTheme({
  typography: {
    fontFamily: [
      'Noto Sans TC',
      'Roboto',
      'sans-serif'
    ].join(',')
  }
},
  pickerZhHK,
  gridZhTW
);

const App: FC = () => {
  const allPages = useRoutes(routes);

  return (
    <ThemeProvider theme={theme}>
      <Toaster />
      {allPages}
    </ThemeProvider>
  );
}

export default App;