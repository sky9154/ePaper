type DeviceType = {
  name: string,
  macId: string
}

const get = async (setMenu: (value: DeviceType[]) => void) => {
  const url = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/device/get`;

  const requestOptions = {
    method: 'GET'
  };

  fetch(url, requestOptions).then(async (response: Response) => {
    const result = await response.json();

    if (response.ok) {
      setMenu(result.devices);
    }
  });
}

const Device = {
  get
}

export default Device;