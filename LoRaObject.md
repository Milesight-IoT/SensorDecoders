# Extended usage of the decode function

Get more information from [LoRaObject](#LoRaObject) variable.

## Example


``` javascript
function Decode(fPort, bytes) {
  var decoder = {};
  if (fPort == 85) {
    decoder.sensor = LoRaObject.devEUI;
    decoder.vendor = "Milesight-IoT";
    decoder.time = LoRaObject.time;
    decoder.raw = bytes;
  }
  return decoder;
}
```

Output Result
``` json
{
  "sensor": "24e1641092176759",
  "vendor": "Milesight-IoT",
  "time": "2020-0327T12:39:05.547336Z",
  "raw": "AWcAAAJoAA=="
}
```


## LoRaObject

`LoRaObject` is global variable in javascript
``` json
{
  "applicationID": 1,                   // application ID
  "applicationName": "cloud",           // application name
  "deviceName": "24e1641092176759",     // device name
  "devEUI": "24e1641092176759",         // device EUI
  "time": "2020-0327T12:39:05.547336Z", // uplink receive time
  "rxInfo": [                           // lorawan gateway information related to lora
    {
      "mac": "24e124fffef021be",        // ID of the receiving gateway
      "rssi": -57,                      // signal strength (dBm)
      "loRaSNR": 10,                    // signal to noise ratio
      "name": "local_gateway",          // name of the receiving gateway
      "latitude": 0,                    // latitude of the receiving gateway
      "longitude": 0,                   // longitude of the receiving gateway
      "altitude": 0                     // altitude of the receiving gateway
    }
  ],
  "txInfo": {                           // lorawan node tx info
    "frequency": 868300000,             // frequency used for transmission
    "dataRate": {
      "modulation": "LORA",             // LORA module
      "bandwidth": 125,                 // bandwidth used for transmission
      "spreadFactor": 7                 // spreadFactor used for transmission
    },
    "adr": false,                       // device ADR status
    "codeRate": "4/5"                   // code rate
  },
  "fCnt": 0,                            // frame counter
  "fPort": 85,                          // application port
  "data": "AWcAAAJoAA=="                // base64 encoded payload (decrypted)
}
```
