from fastapi import APIRouter
from functions.ePaper import ePaper
import os


router = APIRouter()

@router.get('/image/{image}')
async def get_image (image: str):
  if os.path.exists(f'ePaper/export/{image}.txt'):
    with open(f'ePaper/export/{image}.txt') as file:
      return file.read()
  else:
    EPaper = ePaper(f'ePaper/image/image/{image}.png')
    EPaper.to7color(f'ePaper/image/bmp/{image}.bmp')
    color7 = EPaper.toText()

    with open (f'ePaper/export/{image}.txt', 'w', newline='') as file:
      print(color7, file=file, end='')
    
    return color7
