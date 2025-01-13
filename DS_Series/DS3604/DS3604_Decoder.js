/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product DS3604
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
        // TEMPLATE
        else if (channel_id == 0xff && channel_type == 0x73) {
            decoded.current_template_id = bytes[i] + 1;
            i += 1;
        }
        // TEMPLATE BLOCK CHANNEL DATA
        else if (channel_id == 0xfb && channel_type == 0x01) {
            var template_id = (bytes[i] >> 6) + 1;
            var block_id = bytes[i++] & 0x3f;

            var template_name = "template_" + template_id;
            decoded[template_name] = decoded[template_name] || {};
            var block_name;
            if (block_id < 10) {
                block_name = "text_" + (block_id + 1);
                block_length = bytes[i++];
                decoded[template_name][block_name] = decodeUtf8(bytes.slice(i, i + block_length));
                i += block_length;
            } else if (block_id == 10) {
                block_name = "qrcode";
                block_length = bytes[i++];
                decoded[template_name][block_name] = decodeUtf8(bytes.slice(i, i + block_length));
                i += block_length;
            }
        } else {
            break;
        }
    }

    return decoded;
}

function decodeUtf8(bytes) {
    var str = "";
    var i = 0;
    var byte1, byte2, byte3, byte4;
    while (i < bytes.length) {
        byte1 = bytes[i++];
        if (byte1 <= 0x7f) {
            str += String.fromCharCode(byte1);
        } else if (byte1 <= 0xdf) {
            byte2 = bytes[i++];
            str += String.fromCharCode(((byte1 & 0x1f) << 6) | (byte2 & 0x3f));
        } else if (byte1 <= 0xef) {
            byte2 = bytes[i++];
            byte3 = bytes[i++];
            str += String.fromCharCode(((byte1 & 0x0f) << 12) | ((byte2 & 0x3f) << 6) | (byte3 & 0x3f));
        } else if (byte1 <= 0xf7) {
            byte2 = bytes[i++];
            byte3 = bytes[i++];
            byte4 = bytes[i++];
            codepoint = ((byte1 & 0x07) << 18) | ((byte2 & 0x3f) << 12) | ((byte3 & 0x3f) << 6) | (byte4 & 0x3f);
            codepoint -= 0x10000;
            str += String.fromCharCode((codepoint >> 10) + 0xd800);
            str += String.fromCharCode((codepoint & 0x3ff) + 0xdc00);
        }
    }
    return str;
}
