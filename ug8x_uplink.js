// LoRaObject is global variable in javascript

// ”applicationID" ：1                                         //application ID
// "applicationName":"cloud",                                  //application name
// "deviceName":"24e1641092176759",                            // lorawan node device name
// "devEUI":"24e1641092176759",                                // rx lorawan node deveui
// "time": 2020-0327T12:39:05.547336Z                          // uplink receive time
// rxInfo":                                                    // lorawan gateway information related to lora
//  [{
//   "mac":"24e124fffef021be",                                 // ID of the receiving gateway
//   "rssi":-57,                                               // signal strength (dBm)
//   "loRaSNR":10,                                             // signal to noise ratio
//   "name":"local_gateway",                                   // name of the receiving gateway
//   "latitude":0,                                             // latitude of the receiving gateway
//   "longitude":0,                                            // longitude of the receiving gateway
//   "altitude":0                                              // altitude of the receiving gateway
// }],

//  "txInfo":                                                  //lorawan node tx info
//  {
//      "frequency":868300000,                                 //frequency used for transmission
//      “dataRate":
//        {
//          "modulation":"LORA",                               //LORA
//           "bandwidth":125,                                  //bandwidth used for transmission
//           "spreadFactor":7                                  //spreadFactor used for transmission
//        }
//        ,"adr":false,                                        // device ADR status
//        "codeRate":"4/5"                                     //codeRate
//    },

//    "fCnt":0,                                                // frame-counter
//    "fPort":85,                                              // FPort
//    "data":"AWcAAAJoAA==",                                   // base64 encoded payload (decrypted)


//example Decode function :
function Decode(fPort, bytes) {
  var decoder = {};
  if (fPort == 85) {  
  	decoder.sensorsId = LoRaObject.devEUI
  	decoder.flag = "A"
  	decoder.addTime = LoRaObject.time    
  	decoder.value = bytes[0];
  }

  return decoder;
}

//Encoded json :
{
    "sensorsId":"24e1242191336951",
    "addTime":"2020-0327T12:39:05.547336Z",
    "flag":"A",
     "value":255
}
