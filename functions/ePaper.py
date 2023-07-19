from PIL import Image, ImageDraw, ImageFont
import numpy as np
import cv2


class ePaper ():
  def __init__ (self, image):
    self.image = image

  def put_text (self, text, position, font_color=(0, 0, 0), font_size=30):
    '''
    寫入文字
    '''

    image = self.image

    if (isinstance(image, np.ndarray)):
      image = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))

    draw = ImageDraw.Draw(image)

    fontStyle = ImageFont.truetype('fonts/NotoSansTC-Medium.otf', font_size, encoding='utf-8')

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

    colors = [
      [0, 0, 0],
      [255, 255, 255],
      [0, 255, 0],
      [0, 0, 255],
      [255, 0, 0],
      [255, 255, 0],
      [255, 128, 0]
    ]

    new_image = np.zeros_like(self.image)

    for color in colors:
      mask = np.all(self.image == color, axis=2)
      new_image[mask] = color

    self.image = new_image


  def toHex (self):
    '''
    圖像轉成 HEX 格式
    '''

    image = np.array(self.image)

    ret = '#include <avr/pgmspace.h>\n\n'
    ret = f'{ret}const unsigned char test[{int(len(image[0]) * len(image) / 2)}] PROGMEM = {{'

    color_map = {
      '[0, 0, 0]': 0x0,
      '[255, 255, 255]': 0x1,
      '[0, 255, 0]': 0x2,
      '[0, 0, 255]': 0x3,
      '[255, 0, 0]': 0x4,
      '[255, 255, 0]': 0x5,
      '[255, 128, 0]': 0x6
    }

    for i in range(len(image)):
      for j in range(0, len(image[0]), 2):
        data_rgb1 = str(image[i][j].tolist())
        data_rgb2 = str(image[i][j + 1].tolist())

        data_hex = hex((color_map[data_rgb1] << 4) + color_map[data_rgb2])

        ret += f'{data_hex},'

    return f'{ret[:-1]}}};'
  
  
  def show (self):
    '''
    顯示圖像
    '''

    cv2.imshow('image', self.image)
    cv2.waitKey(0)
