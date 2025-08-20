/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product EM300-DI (HALL)
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
        // GPIO
        else if (channel_id === 0x05 && channel_type === 0x00) {
            decoded.gpio = readGPIOStatus(bytes[i]);
            i += 1;
        }
        // PULSE COUNTER
        else if (channel_id === 0x05 && channel_type === 0xc8) {
            decoded.pulse = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // WATER
        else if (channel_id === 0x05 && channel_type === 0xe1) {
            decoded.water_conv = readUInt16LE(bytes.slice(i, i + 2)) / 10;
            decoded.pulse_conv = readUInt16LE(bytes.slice(i + 2, i + 4)) / 10;
            decoded.water = readFloatLE(bytes.slice(i + 4, i + 8));
            i += 8;
        }
        // GPIO ALARM
        else if (channel_id === 0x85 && channel_type === 0x00) {
            decoded.gpio = readGPIOStatus(bytes[i]);
            decoded.gpio_alarm = readGPIOAlarm(bytes[i + 1]);
            i += 2;
        }
        // WATER ALARM
        else if (channel_id === 0x85 && channel_type === 0xe1) {
            decoded.water_conv = readUInt16LE(bytes.slice(i, i + 2)) / 10;
            decoded.pulse_conv = readUInt16LE(bytes.slice(i + 2, i + 4)) / 10;
            decoded.water = readFloatLE(bytes.slice(i + 4, i + 8));
            decoded.water_alarm = readWaterAlarm(bytes[i + 8]);
            i += 9;
        }
        // HISTORICAL DATA
        else if (channel_id === 0x21 && channel_type === 0xce) {
            var point = {};
            point.timestamp = readUInt32LE(bytes.slice(i, i + 4));
            // IGNORE: byte 4,5,6
            point.alarm = readAlarm(bytes[i + 7]);
            var mode = bytes[i + 8];
            point.gpio_type = readGPIOType(mode);
            if (mode === 1) {
                point.gpio = readGPIOStatus(bytes[i + 9]);
            } else if (mode === 2) {
                point.water_conv = readUInt16LE(bytes.slice(i + 10, i + 12)) / 10;
                point.pulse_conv = readUInt16LE(bytes.slice(i + 12, i + 14)) / 10;
                point.water = readFloatLE(bytes.slice(i + 14, i + 18));
            }

            decoded.history = decoded.history || [];
            decoded.history.push(point);
            i += 18;
        }
        // DOWNLINK RESPONSE
        else if (channel_id === 0xfe || channel_id === 0xff) {
            var result = handle_downlink_response(channel_type, bytes, i);
            decoded = Object.assign(decoded, result.data);
            i = result.offset;
        } else {
            break;
        }
    }

    return decoded;
}

function handle_downlink_response(channel_type, bytes, offset) {
    var decoded = {};

    switch (channel_type) {
        case 0x02:
            decoded.collection_interval = readUInt16LE(bytes.slice(offset, offset + 2));
            offset += 2;
            break;
        case 0x03:
            decoded.report_interval = readUInt16LE(bytes.slice(offset, offset + 2));
            offset += 2;
            break;
        case 0x06:
            decoded.temperature_alarm_settings = {};
            var condition = readUInt8(bytes[offset]);
            decoded.temperature_alarm_settings.condition = readMathCondition(condition & 0x07);
            decoded.temperature_alarm_settings.threshold_min = readInt16LE(bytes.slice(offset + 1, offset + 3)) / 10;
            decoded.temperature_alarm_settings.threshold_max = readInt16LE(bytes.slice(offset + 3, offset + 5)) / 10;
            // skip 4 bytes
            offset += 9;
            break;
        case 0x10:
            decoded.reboot = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x17:
            decoded.time_zone = readTimeZone(readInt16LE(bytes.slice(offset, offset + 2)));
            offset += 2;
            break;
        case 0x27:
            decoded.clear_history = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x28:
            decoded.query_device_status = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x35:
            decoded.d2d_key = readHexString(bytes.slice(offset, offset + 8));
            offset += 8;
            break;
        case 0x4a:
            decoded.sync_time = readYesNoStatus(1);
            break;
        case 0x4e:
            // skip first byte
            var counter_control_type = readUInt8(bytes[offset + 1]);
            if (counter_control_type === 0) {
                decoded.clear_counter = readYesNoStatus(1);
            } else if (counter_control_type === 1) {
                decoded.stop_counter = readYesNoStatus(1);
            } else if (counter_control_type === 2) {
                decoded.start_counter = readYesNoStatus(1);
            }
            offset += 2;
            break;
        case 0x68:
            decoded.history_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x69:
            decoded.retransmit_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x6a:
            var data = readUInt8(bytes[offset]);
            if (data === 0x00) {
                decoded.retransmit_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            } else if (data === 0x01) {
                decoded.resend_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            }
            offset += 3;
            break;
        case 0x79:
            var d2d_master_config = {};
            d2d_master_config.mode = readD2DMode(bytes[offset]);
            var enable_value = readUInt8(bytes[offset + 1]);
            d2d_master_config.enable = readEnableStatus((enable_value >>> 0) & 0x01);
            d2d_master_config.lora_uplink_enable = readEnableStatus((enable_value >>> 1) & 0x01);
            d2d_master_config.d2d_cmd = readD2DCommand(bytes.slice(offset + 2, offset + 4));
            offset += 4;
            decoded.d2d_master_config = decoded.d2d_master_config || [];
            decoded.d2d_master_config.push(d2d_master_config);
            break;
        case 0x92:
            // skip first byte
            decoded.counter = readUInt32LE(bytes.slice(offset + 1, offset + 5));
            offset += 5;
            break;
        case 0xa1:
            // skip first byte
            var alarm_type = readUInt8(bytes[offset + 1]);
            if (alarm_type === 0) {
                decoded.water_flow_alarm_settings = {};
                decoded.water_flow_alarm_settings.enable = readEnableStatus(bytes[offset + 2]);
                decoded.water_flow_alarm_settings.duration = readUInt32LE(bytes.slice(offset + 3, offset + 7));
            } else if (alarm_type === 1) {
                decoded.water_flow_timeout_alarm_settings = {};
                decoded.water_flow_timeout_alarm_settings.enable = readEnableStatus(bytes[offset + 2]);
                decoded.water_flow_timeout_alarm_settings.duration = readUInt32LE(bytes.slice(offset + 3, offset + 7));
            } else if (alarm_type === 2) {
                decoded.water_outage_timeout_alarm_settings = {};
                decoded.water_outage_timeout_alarm_settings.enable = readEnableStatus(bytes[offset + 2]);
                decoded.water_outage_timeout_alarm_settings.duration = readUInt32LE(bytes.slice(offset + 3, offset + 7));
            }
            offset += 7;
            break;
        case 0xa2:
            decoded.pulse_conversion_settings = {};
            decoded.pulse_conversion_settings.enable = readEnableStatus(bytes[offset]);
            decoded.pulse_conversion_settings.water = readUInt16LE(bytes.slice(offset + 1, offset + 3)) / 10;
            decoded.pulse_conversion_settings.pulse = readUInt16LE(bytes.slice(offset + 3, offset + 5)) / 10;
            decoded.pulse_conversion_settings.unit = readUtf8(bytes.slice(offset + 5, offset + 9));
            offset += 9;
            break;
        case 0xa3:
            // skip first byte
            decoded.pulse_filter_enable = readEnableStatus(bytes[offset + 1]);
            offset += 2;
            break;
        case 0xa4:
            decoded.water_flow_determination = readUInt16LE(bytes.slice(offset, offset + 2));
            offset += 2;
            break;
        case 0xc3:
            decoded.gpio_mode = readGPIOMode(bytes[offset]);
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
    var major = bytes[0] & 0xff;
    var minor = (bytes[1] & 0xff) >> 4;
    return "v" + major + "." + minor;
}

function readFirmwareVersion(bytes) {
    var major = bytes[0] & 0xff;
    var minor = bytes[1] & 0xff;
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

function readGPIOStatus(status) {
    var status_map = { 0: "low", 1: "high" };
    return getValue(status_map, status);
}

function readGPIOType(type) {
    var type_map = { 1: "gpio", 2: "counter" };
    return getValue(type_map, type);
}

function readGPIOAlarm(bytes) {
    var alarm_map = { 0: "gpio alarm release", 1: "gpio alarm" };
    return getValue(alarm_map, bytes);
}

function readWaterAlarm(type) {
    var alarm_map = {
        1: "water outage timeout alarm",
        2: "water outage timeout alarm release",
        3: "water flow timeout alarm",
        4: "water flow timeout alarm release",
    };
    return getValue(alarm_map, type);
}

function readAlarm(bytes) {
    var alarm_map = {
        0: "none",
        1: "water outage timeout alarm",
        2: "water outage timeout alarm release",
        3: "water flow timeout alarm",
        4: "water flow timeout alarm release",
        5: "gpio alarm",
        6: "gpio alarm release",
    };
    return getValue(alarm_map, bytes);
}

function readYesNoStatus(status) {
    var status_map = { 0: "no", 1: "yes" };
    return getValue(status_map, status);
}

function readEnableStatus(status) {
    var status_map = { 0: "disable", 1: "enable" };
    return getValue(status_map, status);
}

function readTimeZone(time_zone) {
    var timezone_map = { "-120": "UTC-12", "-110": "UTC-11", "-100": "UTC-10", "-95": "UTC-9:30", "-90": "UTC-9", "-80": "UTC-8", "-70": "UTC-7", "-60": "UTC-6", "-50": "UTC-5", "-40": "UTC-4", "-35": "UTC-3:30", "-30": "UTC-3", "-20": "UTC-2", "-10": "UTC-1", 0: "UTC", 10: "UTC+1", 20: "UTC+2", 30: "UTC+3", 35: "UTC+3:30", 40: "UTC+4", 45: "UTC+4:30", 50: "UTC+5", 55: "UTC+5:30", 57: "UTC+5:45", 60: "UTC+6", 65: "UTC+6:30", 70: "UTC+7", 80: "UTC+8", 90: "UTC+9", 95: "UTC+9:30", 100: "UTC+10", 105: "UTC+10:30", 110: "UTC+11", 120: "UTC+12", 127: "UTC+12:45", 130: "UTC+13", 140: "UTC+14" };
    return getValue(timezone_map, time_zone);
}

function readMathCondition(bytes) {
    var condition_map = { 0: "disable", 1: "below", 2: "above", 3: "between", 4: "outside" };
    return getValue(condition_map, bytes);
}

function readD2DMode(mode) {
    var mode_map = { 1: "water outage timeout alarm", 2: "water outage timeout alarm release", 3: "water flow timeout alarm", 4: "water flow timeout alarm release", 5: "gpio high", 6: "gpio low" };
    return getValue(mode_map, mode);
}

function readGPIOMode(mode) {
    var mode_map = { 1: "digital", 2: "counter" };
    return getValue(mode_map, mode);
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

function readUInt32LE(bytes) {
    var value = (bytes[3] << 24) + (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
    return (value & 0xffffffff) >>> 0;
}

function readFloatLE(bytes) {
    // JavaScript bitwise operators yield a 32 bits integer, not a float.
    // Assume LSB (least significant byte first).
    var bits = (bytes[3] << 24) | (bytes[2] << 16) | (bytes[1] << 8) | bytes[0];
    var sign = bits >>> 31 === 0 ? 1.0 : -1.0;
    var e = (bits >>> 23) & 0xff;
    var m = e === 0 ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
    var f = sign * m * Math.pow(2, e - 150);

    var v = Number(f.toFixed(2));
    return v;
}

function readHexString(bytes) {
    var temp = [];
    for (var idx = 0; idx < bytes.length; idx++) {
        temp.push(("0" + (bytes[idx] & 0xff).toString(16)).slice(-2));
    }
    return temp.join("");
}

function readD2DCommand(bytes) {
    return ("0" + (bytes[1] & 0xff).toString(16)).slice(-2) + ("0" + (bytes[0] & 0xff).toString(16)).slice(-2);
}

function readUtf8(bytes) {
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

function getValue(map, key) {
    if (RAW_VALUE) return key;

    var value = map[key];
    if (!value) value = "unknown";
    return value;
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
