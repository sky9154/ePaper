#include "Display.h"


U8G2_FOR_ADAFRUIT_GFX u8g2Fonts;

#define MAX_HEIGHT_7C(EPD) (EPD::HEIGHT <= (MAX_DISPLAY_BUFFER_SIZE) / (EPD::WIDTH / 2) ? EPD::HEIGHT : (MAX_DISPLAY_BUFFER_SIZE) / (EPD::WIDTH / 2))

#define MAX_DISPLAY_BUFFER_SIZE 800
GxEPD2_7C<GxEPD2_730c_GDEY073D46, GxEPD2_730c_GDEY073D46::HEIGHT / 4> display(GxEPD2_730c_GDEY073D46(SS, 17, 16, 4));

#undef MAX_DISPLAY_BUFFER_SIZE
#undef MAX_HEIGHT_7C

void Display::init(void) {
  display.init(115200, true, 2, false);
  display.setRotation(0);

  u8g2Fonts.begin(display);
  u8g2Fonts.setFont(msjh_44);
  u8g2Fonts.setFontMode(1);
  u8g2Fonts.setFontDirection(0);
}


void Display::clear(void) {
  display.setFullWindow();
  display.firstPage();
  
  do {
    display.fillScreen(GxEPD_WHITE);
  } while (display.nextPage());
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


void Display::image() {
  HTTPClient http;

  String url = "http://192.168.0.38:5000/api/event/image";

  http.begin(url);
  
  int httpCode = http.GET();

  if (httpCode == HTTP_CODE_OK) {
    int len = http.getSize();
    Serial.println(len);
    uint8_t buff[200] = { 0 };

    WiFiClient * stream = http.getStreamPtr();

    display.setFullWindow();
    display.firstPage();

    int width = 0;
    int height = 0;

    do {
      while (http.connected() && (len > 0 || len == -1)) {
        size_t size = stream -> available();
    
        if (size) {
          int c = stream -> readBytes(buff, ((size > sizeof(buff)) ? sizeof(buff) : size));
    
          for (int i = 0; i < c; i ++) {
            display.drawPixel(width, height, color7((char)buff[i]));
            width ++;
            
            if (width > 800) {
              width = 0;
              height ++;
            }
          }
    
          if (len > 0) {
            len -= c;
          }
        }
        delay(1);
      }
    } while (display.nextPage());
  } else {
    Serial.println("HTTP GET request failed");
  }

  http.end();
}


uint8_t Display::color7(char color) {
  switch (color) {
  case '0':
    return GxEPD_BLACK;
  case '1':
    return GxEPD_WHITE;
  case '2':
    return GxEPD_GREEN;
  case '3':
    return GxEPD_BLUE;
  case '4':
    return GxEPD_RED;
  case '5':
    return GxEPD_YELLOW;
  case '6':
    return GxEPD_ORANGE;
  }
}
