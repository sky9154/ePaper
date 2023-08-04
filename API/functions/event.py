from fastapi import APIRouter
from dotenv import load_dotenv
from datetime import datetime
from time import sleep
import paho.mqtt.client as mqtt
import functions.mongodb as mongodb
import functions.sheet as sheet
import functions.device as device
import json
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
        devices = await device.get_mac(event['devices'])
        mode = event['mode']
        message = event['message']

        await send(devices, mode, message)

    sleep(1)


async def send (devices: str, mode: str, message: str):
  '''
  發送消息
  '''

  client = mqtt.Client()
  client.connect(MQTT_HOST, MQTT_PORT)

  sleep(1)

  payload = {
    'devices': devices,
    'mode': mode,
    'message': sheet.get()[:-1] if mode == 'sheet' else message 
  }

  payload_json = json.dumps(payload, ensure_ascii=False).encode('utf8')

  client.publish('ePaper/send', payload_json)
