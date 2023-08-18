from fastapi import APIRouter, Form, HTTPException
from datetime import datetime
import functions.event as event
from functions.ePaper import ePaper
import functions.device as device
import os


router = APIRouter()


@router.get('/get')
async def get():
  return {
    'event': await event.get()
  }


@router.post('/create')
async def create (
  devices: str = Form(...),
  date_time: str = Form(...),
  mode: str = Form(...),
  message: str = Form(default='')
):
  await event.create({
    'id': f'{datetime.strftime(datetime.now(), "%Y%m%d")}{str(len(await event.get()) + 1).zfill(4)}',
    'devices': devices,
    'datetime': datetime.strptime(date_time, '%Y-%m-%d %H:%M:%S'),
    'mode': mode,
    'message': message,
    'state': True
  })


@router.delete('/remove')
async def remove (event_id: str = Form(...)):
  if not await event.check(event_id):
    raise HTTPException(400, '事件不存在')

  await event.remove(event_id)


@router.put('/update')
async def update (
  event_id: str = Form(...),
  devices: str = Form(...),
  date_time: str = Form(...),
  mode: str = Form(...),
  message: str = Form(default='')
):
  if not await event.check(event_id):
    raise HTTPException(400, '事件不存在')

  await event.update(event_id, {
    'devices': devices,
    'datetime': date_time,
    'mode': mode,
    'message': message
  })


@router.post('/send')
async def send (
  devices: str = Form(...),
  mode: str = Form(...),
  message: str = Form(default='')
):
  devices = await device.get_mac(devices)

  await event.send(devices, mode, message)


@router.get('/image/{image}')
async def get_image(image: str):
  if os.path.exists(f'ePaper/export/{image}.txt'):
    with open(f'ePaper/export/{image}.txt') as file:
      return file.read()
  else:
    EPaper = ePaper(f'ePaper/image/image/{image}.png')
    EPaper.to7color(f'ePaper/image/bmp/{image}.bmp')
    color7 = EPaper.toText()

    with open (f'ePaper/export/{image}.txt', 'w', newline='') as file:
      print(color7, file=file, end='')
    
    return color7
