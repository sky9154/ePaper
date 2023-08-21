import toast from 'react-hot-toast';
import dayjs, { Dayjs } from 'dayjs';


type EventType = {
  id: string;
  devices: string;
  datetime: Dayjs;
  mode: string;
  message: string;
}

const get = (setEvents: (events: EventType[]) => void) => {
  const url = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/event/get`;

  const requestOptions = {
    method: 'GET'
  };

  fetch(url, requestOptions).then(async (response: Response) => {
    const result = await response.json();

    if (response.ok) {
      const events = result.event.map((event: EventType) => {
        return {
          ...event,
          datetime: dayjs(event.datetime, 'YYYY-MM-DDTHH:mm:ss').toDate()
        }
      });

      setEvents(events);
    }
  });
}

const create = (
  now: boolean,
  data: {
    devices: string,
    date_time: string,
    mode: string,
    message: string
  }) => {
  const url = (now) ? 
  `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/event/send` :
  `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/event/create`;

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams((now) ? {
      devices: data.devices,
      mode: data.mode,
      message: data.message
    } : {
      devices: data.devices,
      date_time: data.date_time,
      mode: data.mode,
      message: data.message
    })
  };

  fetch(url, requestOptions).then(() => {
    toast.success(`${(now) ? '發送' : '建立'}成功!`);
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