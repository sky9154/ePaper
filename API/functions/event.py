from fastapi import APIRouter
from dotenv import load_dotenv
from datetime import datetime
from time import sleep
import paho.mqtt.client as mqtt
import functions.mongodb as mongodb
import functions.sheet as sheet
import functions.device as device
import os



router = APIRouter()

load_dotenv()

MQTT_HOST = os.getenv('MQTT_HOST')
MQTT_PORT = int(os.getenv('MQTT_PORT'))

async def create (event: dict):
  '''
  建立事件
  '''

  await mongodb.insert('event', event)


async def loop ():
  event_list = []

  while True:
    now = datetime.now()
    now = now.replace(microsecond=0)

    events = await mongodb.find('event', { 'datetime': now })

    if (events != [] and events != event_list):
      event_list = events

      
      for event in events:
        devices = await device.get_devices(event['devices'])
        message = event['message']

        print('裝置: ', devices)
        print('訊息: ', message)

        await send(devices, message)

    sleep(1)


async def send (devices, message):
  '''
  發送消息
  '''
  
  client = mqtt.Client()
  client.connect(MQTT_HOST, MQTT_PORT)
  choice = message

  if choice == 'sheet':
    print(sheet.get()[:-1])
    data = f'{devices}_{choice}_{sheet.get()[:-1]}'
    
  elif choice == 'clear':
    data = f'{devices}_{choice}_'
  else:
    data = f'{devices}_text_{choice}'

  sleep(1)
  client.publish('ePaper/send', data)
