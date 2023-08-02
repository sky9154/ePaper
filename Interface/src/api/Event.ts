import toast from 'react-hot-toast';


const create = async (data: {
  devices: string,
  date_time: string,
  mode: string,
  message: string
}) => {
  const url = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/event/create`;

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      devices: data.devices,
      date_time: data.date_time,
      mode: data.mode,
      message: data.message
    })
  };

  fetch(url, requestOptions).then(() => {
    toast.success('建立成功!');
  });
}

const Event = {
  create
}

export default Event;