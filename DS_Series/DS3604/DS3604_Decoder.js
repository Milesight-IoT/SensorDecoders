/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product DS3604
 */
var RAW_VALUE = 0x00;

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

    for (var i = 0; i < bytes.length;) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];

        // BATTERY
        if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = bytes[i];
            i += 1;
        }
        // BUTTON
        else if (channel_id === 0x02 && channel_type === 0x2e) {
            decoded.button_status = readButtonStatus(bytes[i]);
            i += 1;
        }
        // PROTOCOL VERSION
        else if (channel_id === 0xff && channel_type === 0x01) {
            decoded.ipso_version = readProtocolVersion(bytes[i]);
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
            var block_length;
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
        }
        // UPDATE CONTENT RESULT
        else if (channel_id === 0xfa && channel_type === 0x01) {
            var data = readUInt8(bytes[i]);
            var template_id = (data >> 6) + 1;
            var block_id = data & 0x3f;

            var template_name = "template_" + template_id;
            var block_name;
            if (block_id < 10) {
                block_name = "text_" + (block_id + 1);
            } else if (block_id == 10) {
                block_name = "qrcode";
            }

            var update_content_result = {};
            update_content_result.template_id = template_id;
            update_content_result.block_id = block_id;
            update_content_result.block_name = block_name;
            update_content_result.result = readResultType(readUInt8(bytes[i + 1]));
            i += 2;

            decoded.update_content_result = decoded.update_content_result || [];
            decoded.update_content_result.push(update_content_result);
        }
        // UPDATE IMAGE RESULT
        else if (channel_id === 0xfa && channel_type === 0x02) {
            var data = readUInt8(bytes[i]);
            var template_id = (data >> 6) + 1;
            var block_id = data & 0x3f;

            var template_name = "template_" + template_id;
            var image_name = "image_" + block_id;
            var data_frame = bytes[i + 1];

            var receive_image_data_result = {};
            receive_image_data_result.template_id = template_id;
            receive_image_data_result.block_id = block_id;
            receive_image_data_result.block_name = image_name;
            receive_image_data_result.data_frame = data_frame;
            i += 2;

            decoded.receive_image_data_result = decoded.receive_image_data_result || [];
            decoded.receive_image_data_result.push(receive_image_data_result);
        }
        // UPDATE TEMPLATE RESULT
        else if (channel_id === 0xfa && channel_type === 0x03) {
            var data = readUInt8(bytes[i]);
            var template_id = (data >> 6) + 1;
            var block_id = data & 0x3f;

            var template_name = "template_" + template_id;
            var block_name_offset = { 0: "text_1", 1: "text_2", 2: "text_3", 3: "text_4", 4: "text_5", 5: "text_6", 6: "text_7", 7: "text_8", 8: "text_9", 9: "text_10", 10: "qrcode", 11: "image_1", 12: "image_2", 13: "battery_status", 14: "connect_status" };
            var block_name = block_name_offset[block_id];

            var update_template_result = {};
            update_template_result.template_id = template_id;
            update_template_result.block_id = block_id;
            update_template_result.block_name = block_name;
            update_template_result.result = readResultType(readUInt8(bytes[i + 1]));
            i += 2;

            decoded.update_template_result = decoded.update_template_result || [];
            decoded.update_template_result.push(update_template_result);
        }
        // DOWNLINK RESPONSE
        else if (channel_id === 0xfe || channel_id === 0xff) {
            result = handle_downlink_response(channel_type, bytes, i);
            decoded = Object.assign(decoded, result.data);
            i = result.offset;
        }
        else {
            break;
        }
    }

    return decoded;
}

function handle_downlink_response(channel_type, bytes, offset) {
    var decoded = {};

    switch (channel_type) {
        case 0x03:
            decoded.report_interval = readUInt16LE(bytes.slice(offset, offset + 2));
            offset += 2;
            break;
        case 0x25:
            decoded.button_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x3e:
            decoded.buzzer_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x66:
            decoded.button_visible = readButtonVisibleStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x73:
            decoded.current_template_id = readUInt8(bytes[offset]) + 1;
            offset += 1;
            break;
        case 0x82:
            decoded.multicast_config = readMulticastConfig(bytes[offset]);
            offset += 1;
            break;
        case 0x89:
            // skip 1 byte
            decoded.block_visible = readBlockVisibleStatus(bytes.slice(offset + 1, offset + 3));
            offset += 3;
            break;
        case 0x90:
            decoded.switch_template_button_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        default:
            throw new Error("unknown downlink response");
    }

    return { data: decoded, offset: offset };
}

function readEnableStatus(status) {
    var enable_map = { 0: "disable", 1: "enable" };
    return getValue(enable_map, status);
}

function readButtonVisibleStatus(status) {
    var button_visible_map = { 0: "hide", 1: "show" };
    return getValue(button_visible_map, status);
}

function readBlockVisibleStatus(bytes) {
    var masked = readUInt8(bytes[0]);
    var data = readUInt8(bytes[1]);

    var block_visible = {};
    var block_offset = { text_1: 0, text_2: 1, text_3: 2, text_4: 3, text_5: 4, text_6: 5, text_7: 6, text_8: 7, text_9: 8, text_10: 9, qrcode: 10, image_1: 11, image_2: 12, battery_status: 13, connect_status: 14 };

    for (var key in block_offset) {
        if ((masked << block_offset[key]) & 0x01) {
            block_visible[key] = readEnableStatus(data & (1 << block_offset[key]));
        }
    }

    return block_visible;
}

function readMulticastConfig(data) {
    var group_offset = { group_1: 0, group_2: 1, group_3: 2, group_4: 3 };
    var multicast_config = {};
    for (var key in group_offset) {
        if ((data >> (group_offset[key] + 4)) & 0x01) {
            multicast_config[key] = readEnableStatus((data >> group_offset[key]) & 0x01);
        }
    }
    return multicast_config;
}

function readButtonStatus(status) {
    var button_status = {
        0: "single_click",
        1: "double_click",
        2: "short_press",
        3: "long_press",
    }
    return getValue(button_status, status);
}

function readResultType(type) {
    var result_type = {
        0: "success",
        1: "template id not exist",
        2: "block id not exist",
        3: "content is too long",
        4: "block unable to modify",
    }
    return getValue(result_type, type);
}

function getValue(map, key) {
    if (RAW_VALUE) return key;

    var value = map[key];
    if (!value) value = "unknown";
    return value;
}

function readProtocolVersion(bytes) {
    var major = (bytes & 0xf0) >> 4;
    var minor = bytes & 0x0f;
    return "v" + major + "." + minor;
}

function readUInt8(bytes) {
    return bytes & 0xff;
}

function readInt8(bytes) {
    var ref = readUInt8(bytes);
    return ref > 0x7f ? ref - 0x100 : ref;
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
            var codepoint = ((byte1 & 0x07) << 18) | ((byte2 & 0x3f) << 12) | ((byte3 & 0x3f) << 6) | (byte4 & 0x3f);
            codepoint -= 0x10000;
            str += String.fromCharCode((codepoint >> 10) + 0xd800);
            str += String.fromCharCode((codepoint & 0x3ff) + 0xdc00);
        }
    }
    return str;
}

if (!Object.assign) {
    Object.defineProperty(Object, "assign", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (target) {
            "use strict";
            if (target == null) {
                throw new TypeError("Cannot convert first argument to object");
            }

            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource == null) {
                    continue;
                }
                nextSource = Object(nextSource);

                var keysArray = Object.keys(Object(nextSource));
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        // concat array
                        if (Array.isArray(to[nextKey]) && Array.isArray(nextSource[nextKey])) {
                            to[nextKey] = to[nextKey].concat(nextSource[nextKey]);
                        } else {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
    });
}