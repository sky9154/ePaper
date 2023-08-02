from fastapi import APIRouter, Form
from datetime import datetime
import functions.event as event


router = APIRouter()

@router.post('/create')
async def create (
  devices: str = Form(...),
  date_time: str = Form(...),
  message: str = Form(...)
):
  await event.create({
    'devices': devices,
    'datetime': datetime.strptime(date_time, '%Y-%m-%d %H:%M:%S'),
    'message': message,
    'state': False
  })
