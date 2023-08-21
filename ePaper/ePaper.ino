#include <ArduinoJson.h>

#include "Display.h"
#include "Manager.h"
#include "MQTT.h"


Display ePaper;
Manager manager;
MQTT mqtt;

void setup() {
  ePaper.init();
  manager.init();
  manager.web();

  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  mqttClient.setCallback(callback);

  mqtt.init();

  ePaper.draw("START");
}


void loop() {
  manager.start();
  mqtt.start();
}


void callback(char* topic, byte* payload, unsigned int length) {
  StaticJsonDocument<2048> doc;

  deserializeJson(doc, payload, length);
  String devices = doc["devices"];
  String command = doc["mode"];
  String message = doc["message"];

  doc.clear();
  Serial.println(message);

  if (devices.indexOf(WiFi.macAddress()) != -1) {
    if (command == "command") {
      if (message == "clear") {
        ePaper.clear();
      }
    } else {
      ePaper.draw(message);
    }
  }
}