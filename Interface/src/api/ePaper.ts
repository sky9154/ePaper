import toast from 'react-hot-toast';


const send = async (deviceList: string, message: string) => {
  const url = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/ePaper/send`;

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      device_list: deviceList,
      message: message
    })
  };

  fetch(url, requestOptions).then(() => {
    toast.success('發送成功!');
  });
}

const ePaper = {
  send
}

export default ePaper;