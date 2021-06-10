/**
 * Payload Decoder for The Things Network
 *
 * Copyright 2021 Milesight IoT
 *
 * @product WS101
 */
function Decode(fPort, bytes) {
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
            switch (bytes[i]) {
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
                    console.log("unsupported");
            }
            i += 1;
        } else {
            break;
        }
    }

    return decoded;
}
