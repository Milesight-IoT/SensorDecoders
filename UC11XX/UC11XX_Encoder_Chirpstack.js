/**
 * Payload Encoder for Chirpstack and Milesight network server
 *
 * Copyright 2021 Milesight IoT
 *
 * @product UC11 Series
  *Json Format Example: {"dout1": "on","dout2": "off"}
 */
function Encode(fPort, obj) {
    var bytes = [];
    //DOUT
    if (obj.dout1) {
        bytes.push(0x09);
        if (obj.dout1 == "on") {
            bytes.push(0x01);
        } else if(obj.dout1 == "off"){
            bytes.push(0x00);
        }
        bytes.push(0x00);
        bytes.push(0xff);
    }

    // DOUT2 only for UC1114
    if(obj.dout2){
        bytes.push(0x0A);
        if (obj.dout2 == "on") {
            bytes.push(0x01);
        } else if(obj.dout2 == "off"){
            bytes.push(0x00);
        }
        bytes.push(0x00);
        bytes.push(0xff);
    }

    return decoded;
}
