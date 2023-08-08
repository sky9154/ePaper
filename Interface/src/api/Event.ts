import toast from 'react-hot-toast';


type EventType = {
  id: string;
  devices: string;
  datetime: string;
  mode: string;
  message: string;
}

const get = (setEvents: (event: EventType[]) => void) => {
  const url = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/event/get`;

  const requestOptions = {
    method: 'GET'
  };

  fetch(url, requestOptions).then(async (response: Response) => {
    const result = await response.json();

    if (response.ok) {
      console.log(result.event);
      
      setEvents(result.event);
    }
  });
}

const create = (data: {
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

const remove = (id: string) => {
  const url = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/event/remove`;

  const requestOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      event_id: id
    })
  };

  fetch(url, requestOptions).then(async (response: Response) => {
    if (response.ok) {
      toast.success('刪除成功!');
    }
  });
}

const Event = {
  get,
  create,
  remove
}

export default Event;