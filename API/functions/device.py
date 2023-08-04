import functions.mongodb as mongodb


async def get ():
  '''
  取得裝置
  '''

  devices = await mongodb.find('device', { })

  for index, device in enumerate(devices, start=1):
    device['id'] = index

  return devices


async def get_device (name: str):
  '''
  取得裝置
  '''

  result = await mongodb.find('device', { 'name': name })

  return [] if (result == []) else result[0]


async def get_mac (device_list: str):
  '''
  裝置名稱轉 Mac Address
  '''

  device_list = device_list.split(',')
  devices = ''

  for device in device_list:
    result = await get_device(device)
    devices += f'{result["macAddress"]},'

  return '' if devices == '' else devices[:-1]


async def create (device: dict):
  '''
  建立裝置
  '''

  await mongodb.insert('device', device)


async def remove (name: str):
  '''
  刪除裝置
  '''

  await mongodb.delete('device', {'name': name})


async def update (mac: str, device: dict):
  '''
  編輯裝置
  '''

  await mongodb.update('device', { 
    'macAddress': mac 
  }, { 
    '$set': device
  })


async def check_name (name: str):
  '''
  檢查裝置名稱是否存在
  '''

  result = await mongodb.find('device', { 'name': name })

  return False if (result == []) else True


async def check_mac (mac: str):
  '''
  檢查 Mac Address 是否存在
  '''

  result = await mongodb.find('device', { 'macAddress': mac })

  return False if (result == []) else True
