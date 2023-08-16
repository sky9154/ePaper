from PIL import Image, ImageDraw, ImageFont
import numpy as np
import cv2


class ePaper ():
  def __init__ (self, image):
    self.image = cv2.imread(image)


  def put_text (self, text, position, font_color=(0, 0, 0), font_size=30):
    '''
    寫入文字
    '''

    image = self.image

    if (isinstance(image, np.ndarray)):
      image = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))

    draw = ImageDraw.Draw(image)

    fontStyle = ImageFont.truetype('fonts/msjhbd.ttc', font_size, encoding='utf-8')

    draw.text(position, text, font_color, font=fontStyle)

    self.image = cv2.cvtColor(np.asarray(image), cv2.COLOR_RGB2BGR)


  def resize (self, dsize):
    '''
    調整圖像大小
    '''

    self.image = cv2.resize(self.image, dsize)


  def to7color (self):
    '''
    圖像轉成 7 色圖像
    '''

    image = cv2.cvtColor(self.image, cv2.COLOR_BGR2RGB)

    color7 = []

    for column in range(len(image)):
      for row in range(len(image[column])):
        image[column][row][0] = 255 if image[column][row][0] >= 128 else 0
        image[column][row][1] = 255 if image[column][row][1] >= 192 else 128 if image[column][row][1] >= 128 else 0
        image[column][row][2] = 255 if image[column][row][2] >= 128 else 0

        color7.append(list(image[column][row]))

    return color7


  def getEpaper (self, color7):
    '''
    取得電子紙格式的資料
    '''

    color_map = {
      '[0, 0, 0]': 0,
      '[255, 255, 255]': 1,
      '[0, 255, 0]': 2,
      '[0, 0, 255]': 3,
      '[255, 0, 0]': 4,
      '[255, 255, 0]': 5,
      '[255, 128, 0]': 6
    }

    ret = ''

    for color in color7:
      ret += str(color_map[str(color)]) if str(color) in color_map else '1'

    return ret
