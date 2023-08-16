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

  ePaper.draw("demo.png");
}

void loop() {
  manager.start();
  mqtt.start();
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.println(topic);
}