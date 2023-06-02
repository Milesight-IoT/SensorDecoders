/**
 * Payload Decoder for Milesight Network Server
 *
 * Copyright 2023 Milesight IoT
 *
 * @product EM500-LGT
 */
function Decode(fPort, bytes) {
    return milesight(bytes);
}

function milesight(bytes) {
    var decoded = {};

    for (var i = 0; i < bytes.length; ) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];
        // BATTERY
        if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = bytes[i];
            i += 1;
        }
        // LIGHT
        else if (channel_id === 0x03 && channel_type === 0x94) {
            decoded.illumination = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // HISTROY DATA
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var point = {};
            point.timestamp = readUInt32LE(bytes.slice(i, i + 4));
            point.illumination = readUInt32LE(bytes.slice(i + 4, i + 8));

            decoded.history = decoded.history || [];
            decoded.history.push(point);
            i += 8;
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

function readUInt32LE(bytes) {
    var value = (bytes[3] << 24) + (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
    return value & 0xffffffff;
}

function readInt32LE(bytes) {
    var ref = readUInt32LE(bytes);
    return ref > 0x7fffffff ? ref - 0x100000000 : ref;
}
