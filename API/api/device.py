from fastapi import APIRouter, Form
import functions.device as device


router = APIRouter()

@router.get('/get')
async def get ():
  '''
  取得裝置
  '''

  return {
    'devices': await device.get()
  }
