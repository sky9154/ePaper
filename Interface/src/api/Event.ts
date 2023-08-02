import toast from 'react-hot-toast';


const save = async (devices: string, date: string, message: string) => {
  const url = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/event/create`;
  
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      devices: devices,
      date_time: date,
      message: message
    })
  };

  fetch(url, requestOptions).then(() => {
    toast.success('建立成功!');
  });
}

const Event = {
  save
}

export default Event;