import { FC } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';


interface DateTimeProps {
  dateTime: Dayjs | null;
  setDateTime: (dateTime: Dayjs | null) => void
}

const DateTime: FC<DateTimeProps> = ({dateTime, setDateTime}) => {
  const handleDateTimeChange = (newDateTime: Dayjs | null) => {
    if (newDateTime) {
      setDateTime(dayjs(newDateTime).millisecond(0));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        value={dateTime}
        onChange={handleDateTimeChange}
        format="YYYY-MM-DD HH:mm:ss"
      />
    </LocalizationProvider>
  );
}

export default DateTime;