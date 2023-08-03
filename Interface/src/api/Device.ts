import toast from 'react-hot-toast';


type DeviceType = {
  id: number,
  name: string,
  macId: string
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

const update = async (oldName: string, newName: string, oldMacId: string, newMacId: string) => {
  const url = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/device/update`;

  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      old_name: oldName,
      new_name: newName,
      old_mac_id: oldMacId,
      new_mac_id: newMacId
    })
  };

  await fetch(url, requestOptions).then(async (response: Response) => {
    if (response.ok) {
      toast.success('編輯成功!');
    }else {
      const error = await response.text();
      toast.error(JSON.parse(error).detail);
    }
  });
}

const Device = {
  get,
  remove,
  update
}

export default Device;