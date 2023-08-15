#ifndef MANAGER_H
#define MANAGER_H

#include <PubSubClient.h>
#include <WiFiManager.h>
#include <ESPmDNS.h>
#include <WebServer.h>


#define AP_SSID           "ESP32AP"
#define AP_PASSWORD       NULL
#define AP_HOSTNAME       "ESP32AP"
#define TRIGGER_PIN       0

extern unsigned int       timeout;
extern unsigned int       startTime;
extern bool               portalRunning;
extern bool               startAP;

#define serverName        "http://192.168.0.38:5000"

extern WebServer          webServer;
extern WiFiManager        wifiManager;

class Manager {
  public:
    void init();
    void web();
    void start();
};

#endif
