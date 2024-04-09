/**
 * Payload Decoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product WS50x v1
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

        // SWITCH STATE
        if (channel_id === 0xff && channel_type === 0x29) {
            // payload (0 0 0 0 0 0 0 0)
            //  Switch    3 2 1   3 2 1
            //          ------- -------
            // bit mask  change   state
            decoded.switch_1 = (bytes[i] & 1) == 1 ? "on" : "off";
            decoded.switch_1_change = ((bytes[i] >> 4) & 1) == 1 ? "yes" : "no";

            decoded.switch_2 = ((bytes[i] >> 1) & 1) == 1 ? "on" : "off";
            decoded.switch_2_change = ((bytes[i] >> 5) & 1) == 1 ? "yes" : "no";

            decoded.switch_3 = ((bytes[i] >> 2) & 1) == 1 ? "on" : "off";
            decoded.switch_3_change = ((bytes[i] >> 6) & 1) == 1 ? "yes" : "no";
            i += 1;
        } else {
            break;
        }
    }

    return decoded;
}
