/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product DS3604
 */
var RAW_VALUE = 0x00;

/* eslint no-redeclare: "off" */
/* eslint-disable */
// Chirpstack v4
function decodeUplink(input) {
    try {
        var decoded = milesightDeviceDecode(input.bytes);
        return { data: decoded };
    } catch (e) {
        return asErrors(e);
    }
}

// Chirpstack v3
function Decode(fPort, bytes) {
    try {
        return milesightDeviceDecode(bytes);
    } catch (e) {
        return asErrors(e);
    }
}

// The Things Network
function Decoder(bytes, port) {
    try {
        return milesightDeviceDecode(bytes);
    } catch (e) {
        return asErrors(e);
    }
}
/* eslint-enable */

function asErrors(e) {
    return { errors: [e.message] };
}

function milesightDeviceDecode(bytes) {
    var decoded = {};

    for (var i = 0; i < bytes.length; ) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];

        // IPSO VERSION
        if (channel_id === 0xff && channel_type === 0x01) {
            decoded.ipso_version = readProtocolVersion(bytes[i]);
            i += 1;
        }
        // HARDWARE VERSION
        else if (channel_id === 0xff && channel_type === 0x09) {
            decoded.hardware_version = readHardwareVersion(bytes.slice(i, i + 2));
            i += 2;
        }
        // FIRMWARE VERSION
        else if (channel_id === 0xff && channel_type === 0x0a) {
            decoded.firmware_version = readFirmwareVersion(bytes.slice(i, i + 2));
            i += 2;
        }
        // TSL VERSION
        else if (channel_id === 0xff && channel_type === 0xff) {
            decoded.tsl_version = readTslVersion(bytes.slice(i, i + 2));
            i += 2;
        }
        // SERIAL NUMBER
        else if (channel_id === 0xff && channel_type === 0x16) {
            decoded.sn = readSerialNumber(bytes.slice(i, i + 8));
            i += 8;
        }
        // LORAWAN CLASS TYPE
        else if (channel_id === 0xff && channel_type === 0x0f) {
            decoded.lorawan_class = readLoRaWANClass(bytes[i]);
            i += 1;
        }
        // RESET EVENT
        else if (channel_id === 0xff && channel_type === 0xfe) {
            decoded.reset_event = readResetEvent(1);
            i += 1;
        }
        // DEVICE STATUS
        else if (channel_id === 0xff && channel_type === 0x0b) {
            decoded.device_status = readDeviceStatus(1);
            i += 1;
        }

        // BATTERY
        else if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = readUInt8(bytes[i]);
            i += 1;
        }
        // BUTTON
        else if (channel_id === 0xff && channel_type === 0x2e) {
            decoded.button_status = readButtonStatus(bytes[i]);
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
        // IMAGE DATA
        else if (channel_id === 0xfb && channel_type === 0x02) {
            // TODO: decode image data
            throw new Error("image data not implemented");
        }
        // TEMPLATE CONFIG
        else if (channel_id === 0xfb && channel_type === 0x03) {
            var data = bytes[i];
            var data_length = bytes[i + 1];

            var template_id = (data >> 6) + 1;
            var block_id = data & 0x3f;
            var template_name = "template_" + template_id + "_config";
            var block_offset = { 0: "text_1", 1: "text_2", 2: "text_3", 3: "text_4", 4: "text_5", 5: "text_6", 6: "text_7", 7: "text_8", 8: "text_9", 9: "text_10", 10: "qrcode", 11: "image_1", 12: "image_2", 13: "battery_status", 14: "connect_status" };
            var block_name = block_offset[block_id];

            decoded[template_name] = decoded[template_name] || {};
            decoded[template_name][block_name] = readBlockConfig(block_id, bytes.slice(i + 2, i + 2 + data_length));
            i += data_length;
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
            var result = handle_downlink_response(channel_type, bytes, i);
            decoded = Object.assign(decoded, result.data);
            i = result.offset;
        } else {
            throw new Error("unknown channel id: " + channel_id);
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
        case 0x10:
            decoded.reboot = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x25:
            decoded.button_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x27:
            var data = readUInt8(bytes[offset]);
            decoded.clear_image = {};
            decoded.clear_image.background_image = readYesNoStatus((data >> 4) & 0x01);
            decoded.clear_image.logo_1 = readYesNoStatus((data >> 5) & 0x01);
            decoded.clear_image.logo_2 = readYesNoStatus((data >> 5) & 0x02);
            offset += 1;
            break;
        case 0x28:
            var data = readUInt8(bytes[offset]);
            if (data === 0x00) {
                decoded.report_battery = readYesNoStatus(1);
            } else if (data === 0x01) {
                decoded.report_buzzer = readYesNoStatus(1);
            } else if (data === 0x02) {
                decoded.report_current_template = readYesNoStatus(1);
            } else if (data === 0x03) {
                decoded.report_current_display = readYesNoStatus(1);
            }
            offset += 1;
            break;
        case 0x3e:
            decoded.buzzer_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x3d:
            var data = readUInt8(bytes[offset]);
            if (data === 0x01) {
                decoded.beep = readYesNoStatus(1);
            } else if (data === 0x02) {
                decoded.refresh_display = readYesNoStatus(1);
            }
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
            decoded.block_visible = readBlockVisibleStatus(bytes.slice(offset + 1, offset + 5));
            offset += 5;
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

function readProtocolVersion(bytes) {
    var major = (bytes & 0xf0) >> 4;
    var minor = bytes & 0x0f;
    return "v" + major + "." + minor;
}

function readHardwareVersion(bytes) {
    var major = (bytes[0] & 0xff).toString(16);
    var minor = (bytes[1] & 0xff) >> 4;
    return "v" + major + "." + minor;
}

function readFirmwareVersion(bytes) {
    var major = (bytes[0] & 0xff).toString(16);
    var minor = (bytes[1] & 0xff).toString(16);
    return "v" + major + "." + minor;
}

function readTslVersion(bytes) {
    var major = bytes[0] & 0xff;
    var minor = bytes[1] & 0xff;
    return "v" + major + "." + minor;
}

function readSerialNumber(bytes) {
    var temp = [];
    for (var idx = 0; idx < bytes.length; idx++) {
        temp.push(("0" + (bytes[idx] & 0xff).toString(16)).slice(-2));
    }
    return temp.join("");
}

function readLoRaWANClass(type) {
    var class_map = {
        0: "Class A",
        1: "Class B",
        2: "Class C",
        3: "Class CtoB",
    };
    return getValue(class_map, type);
}

function readResetEvent(status) {
    var status_map = { 0: "normal", 1: "reset" };
    return getValue(status_map, status);
}

function readDeviceStatus(status) {
    var status_map = { 0: "off", 1: "on" };
    return getValue(status_map, status);
}

function readEnableStatus(status) {
    var status_map = { 0: "disable", 1: "enable" };
    return getValue(status_map, status);
}

function readYesNoStatus(status) {
    var yes_no_map = { 0: "no", 1: "yes" };
    return getValue(yes_no_map, status);
}

function readButtonVisibleStatus(status) {
    var button_visible_map = { 0: "hide", 1: "show" };
    return getValue(button_visible_map, status);
}

function readBlockVisibleStatus(bytes) {
    var masked = readUInt16LE(bytes.slice(0, 2));
    var data = readUInt16LE(bytes.slice(2, 4));

    var block_visible = {};
    var block_offset = { text_1: 0, text_2: 1, text_3: 2, text_4: 3, text_5: 4, text_6: 5, text_7: 6, text_8: 7, text_9: 8, text_10: 9, qrcode: 10, image_1: 11, image_2: 12, battery_status: 13, connect_status: 14 };

    for (var key in block_offset) {
        if ((masked >>> block_offset[key]) & 0x01) {
            block_visible[key] = readBlockVisible((data >>> block_offset[key]) & 0x01);
        }
    }

    return block_visible;
}

function readBlockVisible(status) {
    var block_visible_map = { 0: "hide", 1: "show" };
    return getValue(block_visible_map, status);
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
    };
    return getValue(button_status, status);
}

function readResultType(type) {
    var result_type = {
        0: "success",
        1: "template id not exist",
        2: "block id not exist",
        3: "content is too long",
        4: "block unable to modify",
    };
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

function readBlockConfig(block_id, bytes) {
    var offset = 0;

    var template_config = {};
    template_config.enable = readEnableStatus(bytes[offset]);
    template_config.type = readBlockType(bytes[offset + 1]);
    template_config.start_x = readUInt16LE(bytes.slice(offset + 2, offset + 4));
    template_config.start_y = readUInt16LE(bytes.slice(offset + 4, offset + 6));
    template_config.end_x = readUInt16LE(bytes.slice(offset + 6, offset + 8));
    template_config.end_y = readUInt16LE(bytes.slice(offset + 8, offset + 10));
    template_config.border = readBorderType(bytes[offset + 10]);
    template_config.horizontal = readHorizontal(bytes[offset + 11]);
    template_config.vertical = readVertical(bytes[offset + 12]);
    template_config.background = readColor(bytes[offset + 13]);
    template_config.foreground = readColor(bytes[offset + 14]);
    // reserved 1 byte
    template_config.layer = readUInt8(bytes[offset + 16]);
    // reserved 4 bytes

    // text
    if (block_id < 10) {
        template_config.font_type = readFontType(bytes[offset + 21]);
        template_config.font_size = readUInt8(bytes[offset + 22]);
        template_config.wrap = readWrapType(bytes[offset + 23]);
        template_config.font_style = readFontStyle(bytes[offset + 24]);
    }

    return template_config;
}

function readBlockType(type) {
    var block_type = { 0: "text", 1: "qrcode", 2: "image", 3: "battery_status", 4: "connect_status" };
    return getValue(block_type, type);
}

function readBorderType(type) {
    var border_type_map = { 0: "no", 1: "yes" };
    return getValue(border_type_map, type);
}

function readHorizontal(type) {
    var horizontal_map = { 0: "left", 1: "center", 2: "right" };
    return getValue(horizontal_map, type);
}

function readVertical(type) {
    var vertical_map = { 0: "top", 1: "center", 2: "bottom" };
    return getValue(vertical_map, type);
}

function readColor(type) {
    var color_map = { 0: "white", 1: "black", 2: "red" };
    return getValue(color_map, type);
}

function readFontType(type) {
    var font_type_map = { 1: "SONG", 2: "FANG", 3: "BLACK", 4: "KAI", 5: "FT_ASCII", 6: "DZ_ASCII", 7: "CH_ASCII", 8: "BX_ASCII", 9: "BZ_ASCII", 10: "FX_ASCII", 11: "GD_ASCII", 12: "HZ_ASCII", 13: "MS_ASCII", 14: "SX_ASCII", 15: "ZY_ASCII", 16: "TM_ASCII", 17: "YJ_LATIN", 18: "CYRILLIC", 19: "KSC5601", 20: "JIS0208_HT", 21: "ARABIC", 22: "THAI", 23: "GREEK", 24: "HEBREW" };
    return getValue(font_type_map, type);
}

function readWrapType(type) {
    var wrap_map = { 0: "disable", 1: "enable" };
    return getValue(wrap_map, type);
}

function readFontStyle(type) {
    var font_style_map = { 0: "normal", 1: "bold" };
    return getValue(font_style_map, type);
}

/* eslint-disable */
function readUInt8(bytes) {
    return bytes & 0xff;
}

function readInt8(bytes) {
    var ref = readUInt8(bytes);
    return ref > 0x7f ? ref - 0x100 : ref;
}

function readUInt16LE(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return value & 0xffff;
}

function readInt16LE(bytes) {
    var ref = readUInt16LE(bytes);
    return ref > 0x7fff ? ref - 0x10000 : ref;
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

//if (!Object.assign) {
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
//}
