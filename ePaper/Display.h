#ifndef DISPLAY_H
#define DISPLAY_H

#include <U8g2_for_Adafruit_GFX.h>
#include <GxEPD2_7C.h>
#include <WiFi.h>
#include <HTTPClient.h>


extern U8G2_FOR_ADAFRUIT_GFX u8g2Fonts;

class Display {
  public:
    void init();
    void clear();
    void text(String text, uint16_t font_color, int x, int y);
    static void draw(String image);
    static uint16_t color7(char color);
  private:
    static void imageCallback(const void* pv);
    static void getImage(String image);
};

#endif