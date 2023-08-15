import { FC, ChangeEvent } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';


interface DateTimeProps {
  dateTime: Dayjs | null;
  setDateTime: (dateTime: Dayjs | null) => void;
  checked: boolean;
  setChecked: (value: boolean) => void;
}

const DateTime: FC<DateTimeProps> = ({ dateTime, setDateTime, checked, setChecked }) => {
  const handleDateTimeChange = (newDateTime: Dayjs | null) => {
    if (newDateTime) {
      setDateTime(dayjs(newDateTime).millisecond(0));
    }
  };

  const handleCheckChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          value={dateTime}
          onChange={handleDateTimeChange}
          format="YYYY-MM-DD HH:mm:ss"
          disabled={checked}
        />
      </LocalizationProvider>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={handleCheckChange}
          />
        }
        label="立即送出"
      />
    </>
  );
}

export default DateTime;