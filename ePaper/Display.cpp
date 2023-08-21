#include "Display.h"


GxEPD2_7C<GxEPD2_730c_GDEY073D46, GxEPD2_730c_GDEY073D46::HEIGHT / 4> display(GxEPD2_730c_GDEY073D46(SS, 17, 16, 4));

String SERVER_HOST = "192.168.0.38";
String SERVER_PORT = "5000";

void Display::init(void) {
  display.init(115200, true, 2, false);
  display.setRotation(0);
}


void Display::clear(void) {
  display.clearScreen();
}


void Display::draw(String image) {
  display.setFullWindow();
  display.drawPaged(imageCallback, (const void*)image.c_str());
}


void Display::imageCallback(const void* pv) {
  const char* imageStr = reinterpret_cast<const char*>(pv);
  String image(imageStr);

  getImage(image);
}


void Display::getImage(String image) {
  HTTPClient http;

  String url = "http://" + SERVER_HOST + ":" + SERVER_PORT + "/api/ePaper/image/" + image;
  http.begin(url);

  int httpCode = http.GET();

  if (httpCode == HTTP_CODE_OK) {
    int len = http.getSize();
    uint8_t buff[256];

    WiFiClient *stream = http.getStreamPtr();
    int width = 0;
    int height = 0;

    while (http.connected() && (len > 0 || len == -1)) {
      size_t size = stream->available();

      if (size) {
        int c = stream->readBytes(buff, min(sizeof(buff), size));

        for (int i = 0; i < c; i ++) {
          char pixelData = buff[i];

          if (pixelData != '"') {
            uint16_t pixelColor = color7(pixelData);
            display.drawPixel(width, height, pixelColor);
            width ++;

            if (width >= display.width()) {
              width = 0;
              height ++;
            }
          }
          len --;
        }
      }
    }
  } else {
    Serial.println("HTTP GET request failed");
  }

  http.end();
}


uint16_t Display::color7(char color) {
  switch (color) {
  case '0':
    return 0x0;
  case '1':
    return 0xFFFF;
  case '2':
    return 0x7E0;
  case '3':
    return 0x1F;
  case '4':
    return 0xF800;
  case '5':
    return 0xFFE0;
  case '6':
    return 0xFC00;
  }
}