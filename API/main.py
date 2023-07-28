import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from api.ePaper import router as ePaper


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

app.include_router(ePaper, prefix='/api/ePaper')

HOST = os.getenv('IP')
PORT = int(os.getenv('PORT'))

if __name__ == '__main__':
  uvicorn.run(app, host=HOST, port=PORT)
