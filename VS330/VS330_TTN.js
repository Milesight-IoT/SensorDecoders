/**
 * Payload Decoder for The Things Network
 *
 * Copyright 2023 Milesight IoT
 *
 * @product VS330
 */
function Decoder(bytes, port) {
    var decoded = {};

    for (i = 0; i < bytes.length;) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];

        // BATTERY
        if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = bytes[i];
            i += 1;
        }
        // DISTANCE
        else if (channel_id === 0x02 && channel_type === 0x82) {
            decoded.distance = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // OCCUPY
        else if (channel_id === 0x03 && channel_type === 0X8E) {
            decoded.occupy = (bytes[i] === 0) ? 'normal' : 'occupy';
            i += 1;
        }
        // CALIBRATION
        else if (channel_id === 0x04 && channel_type === 0X8E) {
            decoded.calibration = (bytes[i] === 0) ? 'failed' : 'success';
            i += 1;  
        } else {
            break;
        }
    }

    return decoded;
}

// bytes to number
function readUInt16LE(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return value & 0xFFFF;
}