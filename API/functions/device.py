import functions.mongodb as mongodb


async def get ():
  '''
  取得裝置
  '''

  devices = await mongodb.find('device', { })

  return devices


async def mac_id (device: str):
  '''
  取得裝置的 MAC ID
  '''

  result = await mongodb.find('device', { 'name': device })

  return [] if (result == []) else result[0]


async def get_devices (device_list: str):
  device_list = device_list.split(',')
  devices = ''

  for device in device_list:
    result = await mac_id(device)
    devices += f'{result["macId"]},'

  return '' if devices == '' else devices[:-1]
