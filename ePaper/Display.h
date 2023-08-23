#ifndef DISPLAY_H
#define DISPLAY_H

#include <GxEPD2_7C.h>
#include <WiFi.h>
#include <HTTPClient.h>


extern String SERVER_HOST;
extern String SERVER_PORT;

class Display {
  public:
    void init();
    void create();
    void clear();
    void draw(String image);

  private:
    static void imageCallback(const void* pv);
    static void getImage(String image);
    static uint16_t color7(char color);
};

#endif