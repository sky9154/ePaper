from fastapi import APIRouter, HTTPException, Form
import functions.device as device


router = APIRouter()

@router.get('/get')
async def get ():
  return {
    'devices': await device.get()
  }


@router.post('/create')
async def create (name: str = Form(...), mac_id: str = Form(...)):
  if not await device.check_name(name):
    raise HTTPException(400, '裝置名稱已存在')

  if not await device.check_mac_id(mac_id):
    raise HTTPException(400, 'Mac ID 已存在')
  
  await device.create({
    'name': name,
    'macId': mac_id
  })

@router.delete('/remove')
async def remove (name: str = Form(...)):
  if not await device.check_name(name):
    raise HTTPException(400, '無效的裝置')
  
  await device.remove(name)


@router.put('/update')
async def update (
  old_name: str = Form(...),
  new_name: str = Form(...),
  old_mac_id: str = Form(...),
  new_mac_id: str = Form(...)
):
  if old_name != new_name and old_mac_id == new_mac_id:
    if await device.check_name(new_name):
      raise HTTPException(400, '裝置名稱已存在')
  elif old_name == new_name and old_mac_id != new_mac_id:
    if await device.check_mac_id(new_mac_id):
      raise HTTPException(400, 'Mac ID 已存在')
  elif old_name != new_name and old_mac_id != new_mac_id:
    if await device.check_name(new_name):
      raise HTTPException(400, '裝置名稱已存在')
    if await device.check_mac_id(new_mac_id):
      raise HTTPException(400, 'Mac ID 已存在')
  
  await device.update(old_name, {
    'name': new_name,
    'macId': new_mac_id
  })
