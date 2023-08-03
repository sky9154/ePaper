import asyncio
import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from api.device import router as device
from api.event import router as event
import threading
import functions.event as fevent


load_dotenv()

def create_app ():
  app = FastAPI(debug=True)

  app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
  )

  return app


app = create_app()

app.include_router(device, prefix='/api/device')
app.include_router(event, prefix='/api/event')

HOST = os.getenv('IP')
PORT = int(os.getenv('PORT'))

loop_thread = threading.Thread(target=asyncio.run, args=(fevent.loop(),))

if __name__ == '__main__':
  loop_thread.start()
  uvicorn.run(app, host=HOST, port=PORT)
