/**
 * Payload Eecoder for Chirpstack and Milesight network server
 *
 * Copyright 2021 Milesight IoT
 *
 * @product UC51x
 * Json Format: {"valve":1,"status":"open","index":1,"duration":60,"pulse":6}
 */
function Encode(fPort, obj) {
    var encoded = [];
    // Package flag
    encoded.push(0xff);
    // Valve control type
    encoded.push(0x1d);

    // config valve control mask
    var duration;
    var pulse;
    var control = 0;

    if (obj.valve === 1) {
        // control = 0b00;
        control |= 0;
    }

    if (obj.valve == 2) {
        // control = 0b01;
        control |= 1;
    }
    if (obj.status == "open") {
        //control |= 0b100000;
        control |= 32;
    }

    // [option] time condition(Unit：s)
    if (obj.duration) {
        //control |= 0b10000000;
        control |= 128;
        duration = writeInt24LE(obj.duration);
    }

    // [option] pulse condtion (supported only when pulse meter is connected)
    if (obj.pulse) {
        //control |= 0b1000000;
        control |= 64;
        pulse = writeInt32LE(obj.pulse);
    }

    // valve control mask
    encoded.push(control);

    // valve control package sequence from 1-255
    encoded.push(obj.index);

    // valve duration condition
    if (obj.duration) {
        // encoded.concat(duration);
        encoded.push(duration[0]);
        encoded.push(duration[1]);
        encoded.push(duration[2]);
    }
    // valve pulse condition
    if (obj.pulse) {
        // encoded.concat(pulse);
        encoded.push(pulse[0]);
        encoded.push(pulse[1]);
        encoded.push(pulse[2]);
        encoded.push(pulse[3]);
    }

    return encoded;
}

/* ******************************************
 * numbser to bytes
 ********************************************/
function writeInt32LE(data) {
    var result = [0, 0, 0, 0];
    var index;

    if (data < 0) {
        data = 0xffffffff + data;
    }
    for (index = 0; index < result.length; index++) {
        var byte = data & 0xff;
        result[index] = byte;
        data = (data - byte) / 256;
    }
    return result;
}

function writeInt24LE(data) {
    var result = [0, 0, 0];
    var index;

    if (data < 0) {
        data = 0xffffff + data;
    }
    for (index = 0; index < result.length; index++) {
        var byte = data & 0xff;
        result[index] = byte;
        data = (data - byte) / 256;
    }
    return result;
}
