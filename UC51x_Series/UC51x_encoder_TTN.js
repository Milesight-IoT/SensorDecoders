/**
 * Payload Encoder for The Things Network
 *
 * Copyright 2020 Milesight IoT
 *
 * @product UC51x
 * Json Format: {"valve":1,"status":"open","index":1,"duration":60,"pulse":6}
 */
function Encoder(object, port) {
    var encoded = [];
    // config package flag
    encoded.push(0xff);
    // config valve control type
    encoded.push(0x1d);

    // config value control mask
    var duration;
    var pulse;
    var control = 0;

    if (object.valve === 1) {
        // control = 0b00;
        control |= 0;
    }

    if (object.valve == 2) {
        // control = 0b01;
        control |= 1;
    }
    if (object.status == "open") {
        //control |= 0b100000;
        control |= 32;
    }

    // [option] time condition
    if (object.duration) {
        //control |= 0b10000000;
        control |= 128;
        duration = writeInt24LE(object.duration);
    }

    // [option] pulse condtion
    if (object.pulse) {
        //control |= 0b1000000;
        control |= 64;
        pulse = writeInt32LE(object.pulse);
    }

    // valve control mask
    encoded.push(control);

    // valve package sequence, 0 means force execute
    encoded.push(object.index);

    // valve duration condition
    if (object.duration) {
        // encoded.concat(duration);
        encoded.push(duration[0]);
        encoded.push(duration[1]);
        encoded.push(duration[2]);
    }
    // valve pulse condition
    if (object.pulse) {
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
