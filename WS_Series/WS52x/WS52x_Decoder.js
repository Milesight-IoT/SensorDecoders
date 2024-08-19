/**
 * Payload Decoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product WS52x
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

        // VOLTAGE
        if (channel_id === 0x03 && channel_type === 0x74) {
            decoded.voltage = readUInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // ACTIVE POWER
        else if (channel_id === 0x04 && channel_type === 0x80) {
            decoded.active_power = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // POWER FACTOR
        else if (channel_id === 0x05 && channel_type === 0x81) {
            decoded.power_factor = bytes[i] / 100;
            i += 1;
        }
        // POWER CONSUMPTION
        else if (channel_id === 0x06 && channel_type == 0x83) {
            decoded.power_consumption = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // CURRENT
        else if (channel_id === 0x07 && channel_type == 0xc9) {
            decoded.current = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // SOCKET STATUS
        else if (channel_id === 0x08 && channel_type == 0x70) {
            var data = bytes[i++];
            decoded.socket_status = (data & 0x01) === 0x01 ? "open" : "close";
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

function readUInt32LE(bytes) {
    var value = (bytes[3] << 24) + (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
    return (value & 0xffffffff) >>> 0;
}
