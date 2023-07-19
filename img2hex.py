from functions import ePaper
import cv2


image = ePaper(cv2.imread('bg_img.jpg'))

image.resize((800, 480))
image.put_text('TEST', (10, 10), 50)
image.to7color()

ret = image.toHex()
image.show()

with open('ePaper/two.c', 'w') as file:
  file.write(ret)
