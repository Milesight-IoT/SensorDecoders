/**
 * Payload Decoder for The Things Network
 * 
 * Copyright 2021 Milesight IoT
 * 
 * @product UC11 series
 *Json Example: {"dout1": "on","dout2": "off"}
 */
function Encoder(object, port) {
    var bytes = [];
    //DOUT
    if (object.dout1) {
        bytes.push(0x09);
        if (object.dout1 == "on") {
            bytes.push(0x01);
        } else if(object.dout1 == "off"){
            bytes.push(0x00);
        }
        bytes.push(0x00);
        bytes.push(0xff);
    }

    // DOUT2 only for UC1114
    if(object.dout2){
        bytes.push(0x0A);
        if (object.dout2 == "on") {
            bytes.push(0x01);
        } else if(object.dout2 == "off"){
            bytes.push(0x00);
        }
        bytes.push(0x00);
        bytes.push(0xff);
    }

    return bytes;
}
