type ModeType = {
  name: string;
  value: string;
}

const get = (setModes: (modes: ModeType[]) => void) => {
  const url = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/mode/get`;

  const requestOptions = {
    method: 'GET'
  };

  fetch(url, requestOptions).then(async (response: Response) => {
    const result = await response.json();

    if (response.ok) {
      setModes(result.mode);
    }
  });
}

const Function = {
  get
}

export default Function;