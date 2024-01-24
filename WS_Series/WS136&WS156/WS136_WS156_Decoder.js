/**
 * Payload Decoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product WS136 & WS156
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
        // PRESS STATE
        else if (channel_id === 0xff && channel_type === 0x34) {
            var id = bytes[i];
            var btn_mode_name = "button_" + id + "_mode";
            var btn_chn_event_name = "button_" + id + "_event";
            switch (bytes[i + 1]) {
                case 0x00:
                    decoded[btn_mode_name] = ["short_press"];
                    break;
                case 0x01:
                    decoded[btn_mode_name] = ["short_press", "double_press"];
                    break;
                case 0x02:
                    decoded[btn_mode_name] = ["short_press", "long_press"];
                    break;
                case 0x03:
                    decoded[btn_mode_name] = ["short_press", "double_press", "long_press"];
                    break;
                default:
                    decoded[btn_mode_name] = ["unknown"];
            }
            switch (bytes[i + 2]) {
                case 0x00:
                    decoded[btn_chn_event_name] = "short_press";
                    break;
                case 0x01:
                    decoded[btn_chn_event_name] = "double_press";
                    break;
                case 0x02:
                    decoded[btn_chn_event_name] = "long_press";
                    break;
                default:
                    decoded[btn_chn_event_name] = "unknown";
            }
            i += 3;
        } else {
            break;
        }
    }

    return decoded;
}
