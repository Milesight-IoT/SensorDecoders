/**
 * Payload Decoder for The Things Network
 *
 * Copyright 2023 Milesight IoT
 *
 * @product WS136 / WS156
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
        // PRESS STATE
        else if (channel_id === 0xff && channel_type === 0x34) {
            var id = bytes[i];
            var command = [bytes[i + 2], bytes[i + 1]];
            decoded[`button_${id}`] = "trigger";
            //   decoded[`button_${id}_command`] = command;
            i += 3;
        } else {
            break;
        }
    }

    return decoded;
}
