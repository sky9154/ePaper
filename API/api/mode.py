from fastapi import APIRouter
import functions.mode as mode


router = APIRouter()


@router.get('/get')
async def get ():
  return {
    'mode': await mode.get()
  }
