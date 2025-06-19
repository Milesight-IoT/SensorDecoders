/**
 * Payload Decoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product VS340 / VS341
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
        // OCCUPANCY
        else if (channel_id === 0x03 && channel_type === 0x00) {
            decoded.occupancy = bytes[i] === 0 ? "vacant" : "occupied";
            i += 1;
        } else {
            break;
        }
    }

    return decoded;
}
