#ifndef MQTT_H
#define MQTT_H

#include <WiFi.h>
#include <PubSubClient.h>

#define MQTT_HOST         "192.168.0.38"
#define MQTT_PORT         1883
#define MQTT_TOPIC        "ePaper/send"

#define MQTT_USER         ""
#define MQTT_PASSWORD     ""

extern WiFiClient wifiClient;
extern PubSubClient mqttClient;

class MQTT {
  public:
    void init();
    void start();
};

#endif