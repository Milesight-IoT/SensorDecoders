/**
 * Payload Decoder for Milesight Network Server
 *
 * Copyright 2024 Milesight IoT
 *
 * @product WS101
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
        // PRESS STATE
        else if (channel_id === 0xff && channel_type === 0x2e) {
            var type = bytes[i];
            i += 1;

            switch (type) {
                case 1:
                    decoded.press = "short";
                    break;
                case 2:
                    decoded.press = "long";
                    break;
                case 3:
                    decoded.press = "double";
                    break;
                default:
                    decoded.press = "unknown";
                    break;
            }
        } else {
            break;
        }
    }

    return decoded;
}
