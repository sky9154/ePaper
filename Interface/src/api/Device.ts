import toast from 'react-hot-toast';


type DeviceType = {
  id: number,
  name: string,
  macAddress: string
}

const get = async (setMenu: (value: DeviceType[]) => void) => {
  const url = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/device/get`;

  const requestOptions = {
    method: 'GET'
  };

  await fetch(url, requestOptions).then(async (response: Response) => {
    const result = await response.json();

    if (response.ok) {
      setMenu(result.devices);
    }
  }).catch(() => {
    toast.error('未取得裝置!');
  });
}

const create = async (name: string, mac: string) => {
  const url = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/device/create`;

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      name: name,
      mac: mac
    })
  };

  await fetch(url, requestOptions).then(async (response: Response) => {
    if (response.ok) {
      toast.success('新增成功!');
    } else {
      const error = await response.text();
      toast.error(JSON.parse(error).detail);
    }
  });
}

const remove = async (name: string) => {
  const url = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/device/remove`;

  const requestOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      name: name
    })
  };

  await fetch(url, requestOptions).then(async (response: Response) => {
    if (response.ok) {
      toast.success('刪除成功!');
    }
  });
}

const update = async (mac: string, name: string) => {
  const url = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/device/update`;

  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      mac: mac,
      name: name
    })
  };

  await fetch(url, requestOptions).then(async (response: Response) => {
    if (response.ok) {
      toast.success('編輯成功!');
    } else {
      const error = await response.text();
      toast.error(JSON.parse(error).detail);
    }
  });
}

const Device = {
  get,
  create,
  remove,
  update
}

export default Device;