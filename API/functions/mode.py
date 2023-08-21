import functions.mongodb as mongodb


async def get () -> list:
  '''
  取得功能列表
  '''

  mode = await mongodb.find('mode', { })

  return mode
