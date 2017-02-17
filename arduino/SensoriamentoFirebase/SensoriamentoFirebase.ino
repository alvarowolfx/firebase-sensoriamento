
#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>
#include "DHT.h"

// Set these to run example.
#define FIREBASE_HOST "example.firebaseio.com"
#define FIREBASE_AUTH "token_or_secret"
#define WIFI_SSID "HomeViebrantz"
#define WIFI_PASSWORD "casainteligente"

#define LAMP_PIN D3
#define PRESENCE_PIN D4
#define DHT_PIN D5

DHT dht;

void setupPins(){

  pinMode(LAMP_PIN, OUTPUT);
  digitalWrite(LAMP_PIN, LOW);
  
  pinMode(PRESENCE_PIN, INPUT);

  dht.setup(DHT_PIN);  
}

void setupWifi(){
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());
}

void setupFirebase(){
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.setBool("lamp", false);
  Firebase.setBool("presence", false);
}

void setup() {
  Serial.begin(9600);

  setupPins();
  setupWifi();    

  setupFirebase();
}

void loop() {

  // Obtem os dados do sensor DHT e manda para o firebase
  float humidity = dht.getHumidity();
  float temperature = dht.getTemperature();
  
  Firebase.pushFloat("temperature", temperature);
  Firebase.pushFloat("humidity", humidity);  

  // Verifica o valor do sensor de presença
  // LOW sem movimento
  // HIGH com movimento
  int presence = digitalRead(PRESENCE_PIN);  
  Firebase.setBool("presence", presence == HIGH);

  // Verifica o valor da lampada no firebase 
  bool lampValue = Firebase.getBool("lamp");
  digitalWrite(LAMP_PIN, lampValue ? HIGH : LOW);
  
  delay(200);
}
