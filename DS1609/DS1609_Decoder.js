/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product DS1609
 */
var RAW_VALUE = 0x00;

/* eslint no-redeclare: "off" */
/* eslint-disable */
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
/* eslint-enable */

function milesightDeviceDecode(bytes) {
    var decoded = {};

    for (var i = 0; i < bytes.length;) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];

        // BATTERY
        if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = readUInt8(bytes[i]);
            i += 1;
        }
        // PROTOCOL VERSION
        else if (channel_id === 0xff && channel_type === 0x01) {
            decoded.ipso_version = readProtocolVersion(bytes[i]);
            i += 1;
        }
        // TEMPERATURE ALARM
        else if (channel_id === 0x03 && channel_type === 0x84) {
            decoded.temperature_alarm = readTemperatureAlarm(bytes[i]);
            i += 1;
        }
        // DISPLAY REFRESH
        else if (channel_id === 0x04 && channel_type === 0x85) {
            decoded.display_refresh = readYesNoStatus(bytes[i]);
            i += 1;
        }
        // TEMPLATE CONTENT RESPONSE MASK
        else if (channel_id === 0xf1) {
            var template_response_fragment_id = channel_type + 1;
            var template_response_data_length = readUInt8(bytes[i]);
            var template_response_chn_name = "fragment_" + template_response_fragment_id + "_mask";
            decoded[template_response_chn_name] = readHexString(bytes.slice(i + 1, i + 1 + template_response_data_length));
            i += 1 + template_response_data_length;
        }
        // TEMPLATE CONTENT PACKAGE
        else if (channel_id === 0xf2) {
            var template_package_fragment_id = channel_type;
            var template_package_index = readUInt16LE(bytes.slice(i, i + 2));
            var template_package_chn_name = "fragment_" + template_package_fragment_id + "_data";
            // package header
            if (template_package_index === 0x00) {
                decoded[template_package_chn_name] = decoded[template_package_chn_name] || {};
                decoded[template_package_chn_name].header = {};
                decoded[template_package_chn_name].header.data_length = readUInt16LE(bytes.slice(i + 2, i + 4));
                decoded[template_package_chn_name].header.fragment_size = readUInt8(bytes[i + 4]);
                decoded[template_package_chn_name].header.fragment_nb = readUInt16LE(bytes.slice(i + 5, i + 7));
                decoded[template_package_chn_name].header.crc16 = readHexString(bytes.slice(i + 7, i + 9));
                i += 9;
            }
            // package body
            else {
                var package_body = {};
                package_body.index = template_package_index;
                package_body.data = readHexString(bytes.slice(i + 2, bytes.length));
                i = bytes.length;
                decoded[template_package_chn_name] = decoded[template_package_chn_name] || {};
                decoded[template_package_chn_name].body = decoded[template_package_chn_name].body || [];
                decoded[template_package_chn_name].body.push(package_body);
            }
        }
        // TEMPLATE CONTENT
        else if (channel_id == 0xfb) {
            var data = channel_type;
            var template_id = (data >>> 4) + 1;
            var block_type = data & 0x0f;
            var block_id = readUInt8(bytes[i]) + 1;
            var block_length = readUInt8(bytes.slice(i + 1, i + 2));

            var template_name = "template_" + template_id;
            decoded[template_name] = decoded[template_name] || {};
            // text
            if (block_type === 0x01) {
                var text_chn_name = "text_" + block_id;
                decoded[template_name][text_chn_name] = decodeUtf8(bytes.slice(i + 3, i + 3 + block_length));
            }
            // qrcode
            else if (block_type === 0x02) {
                var qrcode_chn_name = "qrcode_" + block_id;
                decoded[template_name][qrcode_chn_name] = decodeUtf8(bytes.slice(i + 3, i + 3 + block_length));
            }
            i += 3 + block_length;
        }
        // DOWNLINK RESPONSE
        else if (channel_id === 0xfe || channel_id === 0xff) {
            var result = handle_downlink_response(channel_type, bytes, i);
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
            var report_type = readUInt8(bytes[offset]);
            if (report_type === 0x00) {
                decoded.report_battery = readYesNoStatus(1);
            } else if (report_type === 0x01) {
                decoded.report_buzzer = readYesNoStatus(1);
            } else if (report_type === 0x02) {
                decoded.report_display_content = readYesNoStatus(1);
            }
            offset += 1;
            break;
        case 0x3e:
            decoded.buzzer_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x3d:
            var control_type = readUInt8(bytes[offset]);
            if (control_type === 0x01) {
                decoded.beep = readYesNoStatus(1);
            } else if (control_type === 0x02) {
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
        case 0x86:
            decoded.display_refresh_interval = readUInt8(bytes[offset]);
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

function readYesNoStatus(status) {
    var yes_no_map = { 0: "no", 1: "yes" };
    return getValue(yes_no_map, status);
}

function readTemperatureAlarm(status) {
    var temperature_alarm_map = { 0: "normal", 1: "high" };
    return getValue(temperature_alarm_map, status);
}

function readButtonVisibleStatus(status) {
    var button_visible_map = { 0: "hide", 1: "show" };
    return getValue(button_visible_map, status);
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

function readHexString(bytes) {
    return bytes.map(function (byte) {
        return ("0" + (byte & 0xff).toString(16)).slice(-2);
    }).join("");
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
/* eslint-enable */

function x(str) {
    var bytes = [];
    for (var i = 0; i < str.length; i += 2) {
        bytes.push(parseInt(str.slice(i, i + 2), 16));
    }
    return bytes;
}

milesightDeviceDecode(x("F20004006163652E796561737461722E636E2F64617368626F617264"))