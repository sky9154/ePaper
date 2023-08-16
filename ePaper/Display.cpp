#include "Display.h"


U8G2_FOR_ADAFRUIT_GFX u8g2Fonts;

GxEPD2_7C<GxEPD2_730c_GDEY073D46, GxEPD2_730c_GDEY073D46::HEIGHT / 4> display(GxEPD2_730c_GDEY073D46(SS, 17, 16, 4));

void Display::init(void) {
  display.init(115200, true, 2, false);
  display.setRotation(0);
  u8g2Fonts.begin(display);
  u8g2Fonts.setFont(msjh_44);
  u8g2Fonts.setFontMode(1);
  u8g2Fonts.setFontDirection(0);
}


void Display::clear(void) {
  display.clearScreen();
}


void Display::text(String text, uint16_t font_color, int x, int y) {
  display.setFullWindow();
  display.firstPage();

  u8g2Fonts.setForegroundColor(font_color);

  do {
    display.fillScreen(GxEPD_WHITE);
    
    u8g2Fonts.setCursor(x, y);
    u8g2Fonts.println(text);
  } while (display.nextPage());
}

void Display::draw() {
  display.drawPaged(image, 0);
}


void Display::image(const void*) {
  HTTPClient http;

  String url = "http://192.168.0.38:5000/api/event/image";

  http.begin(url);

  int httpCode = http.GET();

  if (httpCode == HTTP_CODE_OK) {
    int len = http.getSize();
    uint8_t buff[800] = { 0 };

    WiFiClient *stream = http.getStreamPtr();

    int width = 0;
    int height = 0;
    while (http.connected() && (len > 0 || len == -1)) {
      size_t size = stream -> available();

      if (size) {
        int c = stream -> readBytes(buff, ((size > sizeof(buff)) ? sizeof(buff) : size));

        for (int i = 0; i < c; i ++) {
          if ((char)buff[i] != '"') {

            display.drawPixel(width, height, color7((char)buff[i]));
            width ++;

            if (width > 800) {
              width = 0;
              height ++;
            }
          }
        }

        if (len > 0) {
          len -= c;
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
