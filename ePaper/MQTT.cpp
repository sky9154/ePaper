#include "MQTT.h"


WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

void MQTT::init(void) {
  while (!mqttClient.connected()) {
    Serial.println("正在連接至 MQTT 伺服器");

    if (mqttClient.connect("ESP32Client", MQTT_USER, MQTT_PASSWORD)) {
      Serial.println("連接至 MQTT 伺服器");
      mqttClient.subscribe(MQTT_TOPIC);
    } else {
      Serial.print("連接至 MQTT 伺服器失敗, rc= ");
      Serial.print(mqttClient.state());
      Serial.println(" 5 秒後重新連接");
      delay(5000);
    }
  }
}


void MQTT::start(void) {
  if (!mqttClient.connected()) {
    while (!mqttClient.connected()) {
      if (mqttClient.connect("ESP32Client")) {
        Serial.println("重新連接至 MQTT 伺服器");
        mqttClient.subscribe(MQTT_TOPIC);
      } else {
        Serial.println("重新連接至 MQTT 伺服器失敗");
        delay(5000);
      }
    }
  }
  
  mqttClient.loop();
}
