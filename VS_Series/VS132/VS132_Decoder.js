/**
 * Payload Decoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product VS132
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

        // PROTOCOL VESION
        if (channel_id === 0xff && channel_type === 0x01) {
            decoded.protocol_version = bytes[i];
            i += 1;
        }
        // SERIAL NUMBER
        else if (channel_id === 0xff && channel_type === 0x16) {
            decoded.sn = readSerialNumber(bytes.slice(i, i + 8));
            i += 8;
        }
        // HARDWARE VERSION
        else if (channel_id === 0xff && channel_type === 0x09) {
            decoded.hardware_version = readVersion(bytes.slice(i, i + 2));
            i += 2;
        }
        // FIRMWARE VERSION
        else if (channel_id === 0xff && channel_type === 0x1f) {
            decoded.firmware_version = readVersion(bytes.slice(i, i + 4));
            i += 4;
        }
        // TOTAL COUNTER IN
        else if (channel_id === 0x03 && channel_type === 0xd2) {
            decoded.total_counter_in = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // TOTAL COUNTER OUT
        else if (channel_id === 0x04 && channel_type === 0xd2) {
            decoded.total_counter_out = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // PERIODIC COUNTER
        else if (channel_id === 0x05 && channel_type === 0xcc) {
            decoded.periodic_counter_in = readUInt16LE(bytes.slice(i, i + 2));
            decoded.periodic_counter_out = readUInt16LE(bytes.slice(i + 2, i + 4));
            i += 4;
        } else {
            break;
        }
    }

    return decoded;
}

function readUInt16LE(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return value & 0xffff;
}

function readUInt32LE(bytes) {
    var value = (bytes[3] << 24) + (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
    return (value & 0xffffffff) >>> 0;
}

function readVersion(bytes) {
    var temp = [];
    for (var idx = 0; idx < bytes.length; idx++) {
        temp.push((bytes[idx] & 0xff).toString(10));
    }
    return temp.join(".");
}

function readSerialNumber(bytes) {
    var temp = [];
    for (var idx = 0; idx < bytes.length; idx++) {
        temp.push(("0" + (bytes[idx] & 0xff).toString(16)).slice(-2));
    }
    return temp.join("");
}
