/**
 * Payload Decoder for Milesight Network Server
 *
 * Copyright 2023 Milesight IoT
 *
 * @product DS3604
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
        // TEMPLATE
        else if (channel_id == 0xff && channel_type == 0x73) {
            decoded.template_id = bytes[i] + 1;
            i += 1;
        }
        // TEMPLATE BLOCK CHANNEL DATA
        else if (channel_id == 0xfb && channel_type == 0x01) {
            var template_id = (bytes[i] >> 6) + 1;
            var block_id = bytes[i++] & 0x3f;
            var block_name;
            if (block_id < 10) {
                block_name = "text_" + (block_id + 1);
                block_length = bytes[i++];
                decoded[block_name] = fromUtf8Bytes(bytes.slice(i, i + block_length));
                i += block_length;
            } else if (block_id == 10) {
                block_name = "qrcode";
                block_length = bytes[i++];
                decoded[block_name] = fromUtf8Bytes(bytes.slice(i, i + block_length));
                i += block_length;
            }
            decoded.template = template_id;
        } else {
            break;
        }
    }

    return decoded;
}

function fromUtf8Bytes(bytes) {
    return decodeURIComponent(
        bytes
            .map(function (ch) {
                return "%" + (ch < 16 ? "0" : "") + ch.toString(16);
            })
            .join("")
    );
}
