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
  data: {
    devices: string,
    date_time: string,
    mode: string,
    message: string
  },
  uploadImage: File | null
) => {
  const url = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/event/create`;
  const formData = new FormData();

  formData.append('devices', data.devices);
  formData.append('date_time', data.date_time);
  formData.append('mode', data.mode);
  formData.append('message', data.message);
  formData.append('image', uploadImage === null ? '' : uploadImage as File);

  const requestOptions = {
    method: 'POST',
    body: formData
  };

  fetch(url, requestOptions).then(() => {
    toast.success(`建立成功!`);
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