from fastapi import APIRouter, HTTPException, Form
import functions.device as device


router = APIRouter()

@router.get('/get')
async def get ():
  return {
    'devices': await device.get()
  }


@router.post('/create')
async def create (name: str = Form(default=''), mac: str = Form(...)):
  if await device.check_name(name):
    raise HTTPException(400, '裝置名稱已存在')

  if await device.check_mac(mac):
    raise HTTPException(400, 'Mac Address 已存在')
  
  await device.create({
    'name': name,
    'macAddress': mac
  })


@router.delete('/remove')
async def remove (name: str = Form(...)):
  if not await device.check_name(name):
    raise HTTPException(400, '無效的裝置')
  
  await device.remove(name)


@router.put('/update')
async def update (
  mac: str = Form(...),
  name: str = Form(...)
):
  if await device.check_name(name):
    raise HTTPException(400, '裝置名稱已存在')
  
  await device.update(mac, {
    'name': name,
    'macAddress': mac
  })
