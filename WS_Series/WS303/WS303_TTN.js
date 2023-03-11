/**
 * Payload Decoder for The Things Network
 *
 * Copyright 2023 Milesight IoT
 *
 * @product WS303
 */
function Decoder(bytes, port) {
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
        // WATER LEAK
        else if (channel_id === 0x03 && channel_type === 0x00) {
            decoded.water_leak = (bytes[i] === 0) ? 'normal' : 'leak';
            i += 1;
        } else {
            break;
        }
    }

    return decoded;
}