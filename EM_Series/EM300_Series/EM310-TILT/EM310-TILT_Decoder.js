/**
 * Payload Decoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product EM310-TILT
 */
// Chirpstack v4
function decodeUplink(input) {
    var decoded = milesightDeviceDecode(input.bytes);
    return { data: decoded };
}

// Chirpstack v3
function Decode(fPort, bytes) {
    return milesightDeviceDecode(bytes);
}

// The Things Network
function Decoder(bytes, port) {
    return milesightDeviceDecode(bytes);
}

function milesightDeviceDecode(bytes) {
    var decoded = {};

    for (var i = 0; i < bytes.length; ) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];

        // BATTERY
        if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = bytes[i];
            i += 1;
        }
        // ANGLE
        else if (channel_id === 0x03 && channel_type === 0xcf) {
            decoded.angle_x = readInt16LE(bytes.slice(i, i + 2)) / 100;
            decoded.angle_y = readInt16LE(bytes.slice(i + 2, i + 4)) / 100;
            decoded.angle_z = readInt16LE(bytes.slice(i + 4, i + 6)) / 100;
            decoded.threshold_x = (bytes[i + 6] & 0x01) === 0x01 ? "trigger" : "normal";
            decoded.threshold_y = (bytes[i + 6] & 0x02) === 0x02 ? "trigger" : "normal";
            decoded.threshold_z = (bytes[i + 6] & 0x04) === 0x04 ? "trigger" : "normal";
            i += 7;
        } else {
            break;
        }
    }

    return decoded;
}

/* ******************************************
 * bytes to number
 ********************************************/
function readUInt16LE(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return value & 0xffff;
}

function readInt16LE(bytes) {
    var ref = readUInt16LE(bytes);
    return ref > 0x7fff ? ref - 0x10000 : ref;
}
