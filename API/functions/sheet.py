from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from dotenv import load_dotenv
from datetime import datetime
import pandas as pd
import os.path
import os
import re


load_dotenv()

SPREADSHEET_ID = os.getenv('SPREADSHEET_ID')
SHEET_ID = os.getenv('SHEET_ID')

SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

def get () -> str:
  creds = None

  if os.path.exists(os.path.join('key', 'token.json')):
    creds = Credentials.from_authorized_user_file(os.path.join('key', 'token.json'), SCOPES)

  if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
      creds.refresh(Request())
    else:
      flow = InstalledAppFlow.from_client_secrets_file(os.path.join('key', 'credentials.json'), SCOPES)
      creds = flow.run_local_server(port=0)
    with open(os.path.join('key', 'token.json'), 'w') as token:
      token.write(creds.to_json())

  try:
    service = build('sheets', 'v4', credentials=creds)

    sheet = service.spreadsheets()
    result = sheet.values().get(spreadsheetId=SPREADSHEET_ID, range=SHEET_ID).execute()
    addfilterviewrequest = {
      'addFilterView': {
          'filter': {
            'sortSpecs': [{
              'dimensionIndex': 0,
              'sortOrder': 'ASCENDING'
            }]
          }
      }
    }

    values = result.get('values', [addfilterviewrequest])

    if values != []:
      for index, result in enumerate(values[1:], start=1):
        data_time = re.sub(r'上午|下午', '', result[0])
        data_time = datetime.strptime(data_time, '%Y/%m/%d  %H:%M:%S')
        data_time = data_time.strftime('%m-%d')
        values[index][0] = data_time

      df = pd.DataFrame(values[1:])
      df.columns = values[0]
      df = df[['時間戳記', '學校 / 使用機關', '單位 / 系所', '使用者 / 老師 姓名']]
      df = df.sort_values(['時間戳記'], ascending=False)
      df = df.head(5)

      table = ''
      for title in ['日期', '使用機關', '單位', '使用者']:
        table += f'{title},'

      for values in df.values.tolist():
        for value in values:
          table += f'{value},'

      return table
    else:
      return ''
  except HttpError as err:
    print(err)

    return ''
