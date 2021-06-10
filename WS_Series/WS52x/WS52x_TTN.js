/**
 * Payload Decoder for The Things Network
 *
 * Copyright 2021 Milesight IoT
 *
 * @product WS52x
 */
function Decoder(bytes, port) {
    var decoded = {};

    for (var i = 0; i < bytes.length; ) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];

        // VOLTATE
        if (channel_id === 0x03 && channel_type === 0x74) {
            decoded.voltate = readUInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // POWER FACTOR
        else if (channel_id === 0x05 && channel_type === 0x81) {
            decoded.factor = bytes[i];
            i += 1;
        }
        // ENERGY SUM
        else if (channel_id === 0x06 && channel_type == 0x83) {
            decoded.energy_sum = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // CURRENT
        else if (channel_id === 0x07 && channel_type == 0xc9) {
            decoded.current = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // STATE
        else if (channel_id === 0x08 && channel_type == 0x70) {
            decoded.state = bytes[i] == 1 ? "open" : "close";
            i += 1;
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
    var value =
        (bytes[3] << 24) + (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
    return value & 0xffffffff;
}
