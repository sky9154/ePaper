from dotenv import load_dotenv
from datetime import datetime
from time import sleep
import paho.mqtt.client as mqtt
import functions.mongodb as mongodb
from functions.ePaper import ePaper
import functions.device as device
import json
import base64
import cv2
import os


load_dotenv()

MQTT_HOST = os.getenv('MQTT_HOST')
MQTT_PORT = int(os.getenv('MQTT_PORT'))

async def get () -> list:
  '''
  取得事件
  '''
  
  events = await mongodb.find('event', { 'state': True })

  for i in range(len(events)):
    name = events[i]['id']
    mode = events[i]['mode']
    message = events[i]['message']

    if mode == 'command':
      if message == 'clear':
        image = cv2.imread('ePaper/image/image/bg-img.png')
      elif message == 'qrcode':
        image = cv2.imread('ePaper/image/image/START.png')
    else:
      image = cv2.imread(f'ePaper/image/image/{name}.png')

    success, buffer = cv2.imencode('.png', image)

    image = buffer.tobytes()
    image = base64.b64encode(image).decode('utf-8')
    
    events[i]['message'] = image

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
    'message': message if mode == 'command' else event_id
  }

  payload_json = json.dumps(payload, ensure_ascii=False).encode('utf-8')
  print(payload_json)

  client.publish('ePaper/send', payload_json)
