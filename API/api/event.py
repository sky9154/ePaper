from fastapi import APIRouter, Form, HTTPException
from datetime import datetime
import functions.event as event


router = APIRouter()

@router.get('/get')
async def get ():
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
  event_id = f'{datetime.strftime(datetime.now(), "%Y%m%d")}{str(len(await event.get()) + 1).zfill(4)}'

  await event.create({
    'id': event_id,
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
