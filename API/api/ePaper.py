from fastapi import APIRouter, Form
from dotenv import load_dotenv
from datetime import datetime
import functions.sheet as sheet
import pandas as pd
import socket
import os
import re


router = APIRouter()

load_dotenv()

SPREADSHEET_ID = os.getenv('SPREADSHEET_ID')
SHEET_ID = os.getenv('SHEET_ID')
API_KEY = os.getenv('API_KEY')

EAPER_HOST = os.getenv('EAPER_HOST')
EAPER_PORT = int(os.getenv('EAPER_PORT'))

@router.post('/send')
async def send (message: str = Form(...)):
  client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  client_socket.connect((EAPER_HOST, EAPER_PORT))
  choice = message

  if choice == 'sheet':
    results = sheet.get()

    for index, result in enumerate(results[1:], start=1):
      data_time = re.sub(r'上午|下午', '', result[0])
      data_time = datetime.strptime(data_time, '%Y/%m/%d  %H:%M:%S')
      data_time = data_time.strftime('%m-%d')
      results[index][0] = data_time

    df = pd.DataFrame(results[1:])
    df.columns = results[0]
    df = df[['時間戳記', '學校 / 使用機關', '單位 / 系所', '使用者 / 老師 姓名']]
    df = df.sort_values(['時間戳記'], ascending=False)
    df = df.head(5)

    table = ''
    for title in ['日期', '使用機關', '單位', '使用者']:
      table += f'{title},'

    for values in df.values.tolist():
      for value in values:
        table += f'{value},'

    client_socket.send(f'C8:F0:9E:EC:78:6C {choice} {table[:-1]}\r'.encode())
  elif choice == 'clear':
    client_socket.send(f'C8:F0:9E:EC:78:6C {choice} \r'.encode())
  else:
    client_socket.send(f'C8:F0:9E:EC:78:6C text {choice}\r'.encode())
  client_socket.close()
