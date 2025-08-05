/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product AM107
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
        else if (channel_id === 0xff && channel_type === 0x08) {
            decoded.sn = readSerialNumber(bytes.slice(i, i + 6));
            i += 6;
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
        // TEMPERATURE
        else if (channel_id === 0x03 && channel_type === 0x67) {
            // °C
            decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // HUMIDITY
        else if (channel_id === 0x04 && channel_type === 0x68) {
            decoded.humidity = readUInt8(bytes[i]) / 2;
            i += 1;
        }
        // PIR
        else if (channel_id === 0x05 && channel_type === 0x6a) {
            decoded.activity = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // LIGHT
        else if (channel_id === 0x06 && channel_type === 0x65) {
            decoded.illumination = readUInt16LE(bytes.slice(i, i + 2));
            decoded.infrared_and_visible = readUInt16LE(bytes.slice(i + 2, i + 4));
            decoded.infrared = readUInt16LE(bytes.slice(i + 4, i + 6));
            i += 6;
        }
        // CO2
        else if (channel_id === 0x07 && channel_type === 0x7d) {
            decoded.co2 = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // TVOC
        else if (channel_id === 0x08 && channel_type === 0x7d) {
            decoded.tvoc = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // PRESSURE
        else if (channel_id === 0x09 && channel_type === 0x73) {
            decoded.pressure = readUInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // SENSOR ENABLE
        else if (channel_id === 0xff && channel_type === 0x18) {
            // skip 1 byte
            var data = readUInt8(bytes[i + 1]);
            var sensor_bit_offset = { temperature: 0, humidity: 1, pir: 2, illumination: 3, co2: 4, tvoc: 5, pressure: 6 };
            decoded.sensor_enable = {};
            for (var key in sensor_bit_offset) {
                decoded.sensor_enable[key] = readEnableStatus((data >> sensor_bit_offset[key]) & 0x01);
            }
            i += 2;
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
        case 0x03:
            decoded.report_interval = readUInt16LE(bytes.slice(offset, offset + 2));
            offset += 2;
            break;
        case 0x06:
            decoded.temperature_alarm_config = {};
            var condition = readUInt8(bytes[offset]);
            decoded.temperature_alarm_config.condition = readMathCondition(condition & 0x07);
            decoded.temperature_alarm_config.threshold_min = readInt16LE(bytes.slice(offset + 1, offset + 3)) / 10;
            decoded.temperature_alarm_config.threshold_max = readInt16LE(bytes.slice(offset + 3, offset + 5)) / 10;
            // skip 4 bytes
            offset += 9;
            break;
        case 0x10:
            decoded.reboot = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x11:
            decoded.timestamp = readUInt32LE(bytes.slice(offset, offset + 4));
            offset += 4;
            break;
        case 0x17:
            decoded.time_zone = readTimeZone(readInt16LE(bytes.slice(offset, offset + 2)));
            offset += 2;
            break;
        case 0x1a:
            var mode_value = readUInt8(bytes[offset]);
            decoded.co2_calibration_settings = {};
            decoded.co2_calibration_settings.mode = readCalibrationMode(mode_value);
            if (mode_value === 2) {
                decoded.co2_calibration_settings.calibration_value = readUInt16LE(bytes.slice(offset + 1, offset + 3));
                offset += 3;
            } else {
                offset += 1;
            }
            break;

        case 0x27:
            decoded.clear_history = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x2d:
            decoded.screen_display_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x2f:
            decoded.led_indicator_mode = readLedIndicatorStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x39:
            decoded.co2_abc_calibration_settings = {};
            decoded.co2_abc_calibration_settings.enable = readEnableStatus(bytes[offset]);
            decoded.co2_abc_calibration_settings.period = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            decoded.co2_abc_calibration_settings.calibration_value = readUInt16LE(bytes.slice(offset + 3, offset + 5));
            offset += 5;
            break;
        case 0x3a:
            var num = readUInt8(bytes[offset]);
            offset += 1;
            for (var i = 0; i < num; i++) {
                var report_schedule_config = {};
                report_schedule_config.start_time = readUInt8(bytes[offset]) / 10;
                report_schedule_config.end_time = readUInt8(bytes[offset + 1]) / 10;
                report_schedule_config.report_interval = readUInt16LE(bytes.slice(offset + 2, offset + 4));
                report_schedule_config.co2_collection_interval = readUInt8(bytes[offset + 4]);
                report_schedule_config.collection_interval = readUInt8(bytes[offset + 5]);
                offset += 6;
                decoded.report_schedule_config = decoded.report_schedule_config || [];
                decoded.report_schedule_config.push(report_schedule_config);
            }
            break;
        case 0x3b:
            decoded.time_sync_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x54:
            decoded.co2_alarm_config = {};
            decoded.co2_alarm_config.enable = readEnableStatus(bytes[offset]);
            decoded.co2_alarm_config.threshold_1 = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            decoded.co2_alarm_config.threshold_2 = readUInt16LE(bytes.slice(offset + 3, offset + 5));
            offset += 5;
            break;
        case 0x56:
            decoded.screen_intelligent_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x57:
            decoded.clear_report_schedule = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x59:
            decoded.reset_battery = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x5a:
            decoded.screen_refresh_interval = readUInt16LE(bytes.slice(offset, offset + 2));
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
            var interval_type = readUInt8(bytes[offset]);
            if (interval_type === 0) {
                decoded.retransmit_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            } else if (interval_type === 1) {
                decoded.resend_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            }
            offset += 3;
            break;
        case 0x75:
            decoded.hibernate_config = {};
            decoded.hibernate_config.enable = readEnableStatus(bytes[offset]);
            decoded.hibernate_config.lora_uplink_enable = readEnableStatus(bytes[offset + 1]);
            decoded.hibernate_config.start_time = readUInt16LE(bytes.slice(offset + 2, offset + 4));
            decoded.hibernate_config.end_time = readUInt16LE(bytes.slice(offset + 4, offset + 6));
            decoded.hibernate_config.weekdays = {};
            var data = readUInt8(bytes[offset + 6]);
            var weekday_bit_offset = { monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 7 };
            for (var key in weekday_bit_offset) {
                decoded.hibernate_config.weekdays[key] = readEnableStatus((data >> weekday_bit_offset[key]) & 0x01);
            }
            offset += 7;
            break;
        case 0x85:
            decoded.screen_display_time_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x86:
            decoded.screen_last_refresh_interval = readUInt8(bytes[offset]);
            offset += 1;
            break;
        case 0x87:
            decoded.altitude_calibration_settings = {};
            decoded.altitude_calibration_settings.enable = readEnableStatus(bytes[offset]);
            decoded.altitude_calibration_settings.calibration_value = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            offset += 3;
            break;
        case 0xf0:
            var mask = readUInt16LE(bytes.slice(offset, offset + 2));
            var data = readUInt16LE(bytes.slice(offset + 2, offset + 4));
            decoded.screen_display_element_settings = {};
            var sensor_bit_offset = { temperature: 0, humidity: 1, co2: 2, smile: 3 };
            for (var key in sensor_bit_offset) {
                if ((mask >> sensor_bit_offset[key]) & 0x01) {
                    decoded.screen_display_element_settings[key] = readEnableStatus((data >>> sensor_bit_offset[key]) & 0x01);
                }
            }
            offset += 4;
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

function readLedIndicatorStatus(status) {
    var status_map = { 0: "off", 2: "blink" };
    return getValue(status_map, status);
}

function readMathCondition(type) {
    var condition_map = { 0: "disable", 1: "below", 2: "above", 3: "between", 4: "outside" };
    return getValue(condition_map, type);
}

function readCalibrationMode(type) {
    var mode_map = { 0: "factory", 1: "abc", 2: "manual", 3: "background", 4: "zero" };
    return getValue(mode_map, type);
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

function readInt32LE(bytes) {
    var ref = readUInt32LE(bytes);
    return ref > 0x7fffffff ? ref - 0x100000000 : ref;
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
