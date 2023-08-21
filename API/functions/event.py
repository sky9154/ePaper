from dotenv import load_dotenv
from datetime import datetime
from time import sleep
import paho.mqtt.client as mqtt
import functions.mongodb as mongodb
from functions.ePaper import ePaper
import functions.device as device
import json
import os


load_dotenv()

MQTT_HOST = os.getenv('MQTT_HOST')
MQTT_PORT = int(os.getenv('MQTT_PORT'))

async def get () -> list:
  '''
  取得事件
  '''
  
  events = await mongodb.find('event', { 'state': True })

  return events


async def check (event_id: str) -> bool:
  '''
  檢查事件是否存在
  '''

  result = await mongodb.find('event', { 'id': event_id })

  return False if (result == []) else True


async def create (event: dict) -> None:
  '''
  建立事件
  '''

  await mongodb.insert('event', event)


async def remove (event_id: str) -> None:
  '''
  刪除事件
  '''

  await mongodb.update('event', { 
    'id': event_id
  }, { 
    '$set': {
      'state': False
    }
  })


async def update (event_id: str, event: dict) -> None:
  '''
  編輯事件
  '''

  await mongodb.update('event', { 
    'id': event_id
  }, { 
    '$set': event
  })


async def loop ():
  event_list = []

  while True:
    now = datetime.now()
    now = now.replace(microsecond=0)

    events = await mongodb.find('event', { 'datetime': now })

    if (events != [] and events != event_list):
      event_list = events

      for event in events:
        event_id = event['id']
        devices = await device.get_mac(event['devices'])
        mode = event['mode']
        message = event['message']

        await send(event_id, devices, mode, message)

        await remove(event_id)

    sleep(1)


async def send (event_id: str, devices: str, mode: str, message: str) -> None:
  '''
  發送消息
  '''

  client = mqtt.Client()
  client.connect(MQTT_HOST, MQTT_PORT)

  sleep(1)

  payload = {
    'devices': devices,
    'mode': mode,
    'message': event_id
  }

  if (mode == 'text'):
    EPaper = ePaper('ePaper/image/image/bg-img.png')
    EPaper.put_text(message, (10, 10), (0, 0, 0), 40)
    EPaper.save(f'ePaper/image/image/{event_id}.png')

  payload_json = json.dumps(payload, ensure_ascii=False).encode('utf-8')

  client.publish('ePaper/send', payload_json)
