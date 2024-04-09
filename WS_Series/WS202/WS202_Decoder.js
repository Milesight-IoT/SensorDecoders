/**
 * Payload Decoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product WS202
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
        // PIR
        else if (channel_id === 0x03 && channel_type === 0x00) {
            decoded.pir = bytes[i] === 0 ? "normal" : "trigger";
            i += 1;
        }
        // DAYLIGHT
        else if (channel_id === 0x04 && channel_type === 0x00) {
            decoded.daylight = bytes[i] === 0 ? "dark" : "light";
            i += 1;
        } else {
            break;
        }
    }

    return decoded;
}
