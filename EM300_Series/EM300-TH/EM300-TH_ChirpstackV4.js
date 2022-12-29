/*
 * Payload Decoder for Chirpstack and Milesight network server
 *
 * Copyright 2021 Milesight IoT
 * Modified 2022-12-29 Leo Gaggl (leo@opensensing.com) for Chirpstack V4 compliance
 * 
 * @product EM300-TH
 */
function decodeUplink(input) {
    let fPort = input.fPort;
    let bytes = input.bytes;
    let decoded = {};

    for (let i = 0; i < bytes.length;) {
        let channel_id = bytes[i++];
        let channel_type = bytes[i++];

        // BATTERY
        if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = bytes[i];
            i += 1;
        }
        // TEMPERATURE
        else if (channel_id === 0x03 && channel_type === 0x67) {
            // ℃
            decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
            // ℉
            // decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10 1.8 + 32;
            // i +=2;
        }
        // HUMIDITY
        else if (channel_id === 0x04 && channel_type === 0x68) {
            decoded.humidity = bytes[i] / 2;
            i += 1;
        } else {
            break;
        }
    }
    return {data: decoded};
}

/* **
 * bytes to number
 **/
function readUInt16LE(bytes) {
    let value = (bytes[1] << 8) + bytes[0];
    return value & 0xffff;
}

function readInt16LE(bytes) {
    let ref = readUInt16LE(bytes);
    return ref > 0x7fff ? ref - 0x10000 : ref;
}

function readInt16LE(bytes) {
    let ref = readUInt16LE(bytes);
    return ref > 0x7fff ? ref - 0x10000 : ref;
}