/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product EM500-CO2
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
        // DEVICE STATUS
        else if (channel_id === 0xff && channel_type === 0x0b) {
            decoded.device_status = readOnOffStatus(1);
            i += 1;
        }
        // BATTERY
        else if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = readUInt8(bytes[i]);
            i += 1;
        }
        // TEMPERATURE(°C)
        else if (channel_id === 0x03 && channel_type === 0x67) {
            decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // HUMIDITY
        else if (channel_id === 0x04 && channel_type === 0x68) {
            decoded.humidity = readUInt8(bytes[i]) / 2;
            i += 1;
        }
        // CO2
        else if (channel_id === 0x05 && channel_type === 0x7d) {
            decoded.co2 = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // PRESSURE
        else if (channel_id === 0x06 && channel_type === 0x73) {
            decoded.pressure = readUInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // TEMPERATURE MUTATION ALARM
        else if (channel_id === 0x83 && channel_type === 0xd7) {
            decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            decoded.temperature_mutation = readInt16LE(bytes.slice(i + 2, i + 4)) / 10;
            decoded.temperature_alarm = readTemperatureAlarm(bytes[i + 4]);
            i += 5;
        }
        // HISTORY
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var data = {};
            data.timestamp = readUInt32LE(bytes.slice(i, i + 4));
            data.co2 = readUInt16LE(bytes.slice(i + 4, i + 6));
            data.pressure = readUInt16LE(bytes.slice(i + 6, i + 8)) / 10;
            data.temperature = readInt16LE(bytes.slice(i + 8, i + 10)) / 10;
            data.humidity = readUInt8(bytes[i + 10]) / 2;
            i += 11;

            decoded.history = decoded.history || [];
            decoded.history.push(data);
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

// 0xFE
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
            var data = readUInt8(bytes[offset]);
            var enable = readEnableStatus((data >>> 6) & 0x01);
            var condition = readCondition((data >>> 0) & 0x07);
            var target = (data >>> 3) & 0x07;

            switch (target) {
                case 0x01:
                    decoded.co2_alarm_config = {};
                    decoded.co2_alarm_config.enable = enable;
                    decoded.co2_alarm_config.condition = condition;
                    decoded.co2_alarm_config.threshold_min = readUInt16LE(bytes.slice(offset + 1, offset + 3));
                    decoded.co2_alarm_config.threshold_max = readUInt16LE(bytes.slice(offset + 3, offset + 5));
                    break;
                case 0x02:
                    decoded.temperature_alarm_config = {};
                    decoded.temperature_alarm_config.enable = enable;
                    decoded.temperature_alarm_config.condition = condition;
                    decoded.temperature_alarm_config.threshold_min = readInt16LE(bytes.slice(offset + 1, offset + 3)) / 10;
                    decoded.temperature_alarm_config.threshold_max = readInt16LE(bytes.slice(offset + 3, offset + 5)) / 10;
                    break;
                case 0x03:
                    decoded.temperature_mutation_alarm_config = {};
                    decoded.temperature_mutation_alarm_config.enable = enable;
                    decoded.temperature_mutation_alarm_config.mutation = readInt16LE(bytes.slice(offset + 3, offset + 5)) / 10;
                    break;
            }
            offset += 9;
            break;
        case 0x11:
            decoded.timestamp = readUInt32LE(bytes.slice(offset, offset + 4));
            offset += 4;
            break;
        case 0x17:
            decoded.time_zone = readTimeZone(readInt16LE(bytes.slice(offset, offset + 2)));
            offset += 2;
            break;
        case 0x18:
            var mode = readUInt8(bytes[offset]);
            var value = readUInt8(bytes[offset + 1]);
            var sensor_offset = { temperature_enable: 1, humidity_enable: 2, co2_enable: 5, pressure_enable: 6 };
            decoded.sensor_function_config = {};
            if (mode === 0x00) {
                for (var key in sensor_offset) {
                    decoded.sensor_function_config[key] = readEnableStatus((value >> sensor_offset[key]) & 0x01);
                }
            } else {
                for (var key in sensor_offset) {
                    if (sensor_offset[key] === mode) {
                        decoded.sensor_function_config[key] = readEnableStatus(value);
                    }
                }
            }
            offset += 2;
            break;
        case 0x1a:
            var strategy_value = readUInt8(bytes[offset]);
            decoded.co2_calibration_config = {};
            decoded.co2_calibration_config.mode = readCalibrationStrategy(strategy_value);
            if (strategy_value === 0x02) {
                decoded.co2_calibration_config.calibration_value = readUInt16LE(bytes.slice(offset + 1, offset + 3));
                offset += 3;
            } else {
                offset += 1;
            }
            break;
        case 0x1c:
            decoded.recollection_config = {};
            decoded.recollection_config.counts = readUInt8(bytes[offset]);
            decoded.recollection_config.interval = readUInt8(bytes[offset + 1]);
            offset += 2;
            break;
        case 0x35:
            decoded.d2d_key = bytesToHexString(bytes.slice(offset, offset + 8));
            offset += 8;
            break;
        case 0x39:
            decoded.co2_abc_calibration_schedule = {};
            decoded.co2_abc_calibration_schedule.enable = readEnableStatus(bytes[offset]);
            decoded.co2_abc_calibration_schedule.period = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            decoded.co2_abc_calibration_schedule.calibration_value = readUInt16LE(bytes.slice(offset + 3, offset + 5));
            offset += 5;
            break;
        case 0x3b:
            decoded.time_sync_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x68: // history_enable
            decoded.history_enable = readEnableStatus(readUInt8(bytes[offset]));
            offset += 1;
            break;
        case 0x69: // retransmit_enable
            decoded.retransmit_enable = readEnableStatus(readUInt8(bytes[offset]));
            offset += 1;
            break;
        case 0x6a:
            var interval_type = readUInt8(bytes[offset]);
            switch (interval_type) {
                case 0:
                    decoded.retransmit_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
                    break;
                case 1:
                    decoded.resend_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
                    break;
            }
            offset += 3;
            break;
        case 0x84:
            decoded.d2d_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x87:
            decoded.altitude_calibration_settings = {};
            decoded.altitude_calibration_settings.mode = readPressureCalibrationMode(bytes[offset]);
            decoded.altitude_calibration_settings.calibration_value = readInt16LE(bytes.slice(offset + 1, offset + 3));
            offset += 3;
            break;
        case 0x96:
            var d2d_master_config = {};
            d2d_master_config.mode = readD2DMode(bytes[offset]);
            d2d_master_config.enable = readEnableStatus(bytes[offset + 1]);
            d2d_master_config.lora_uplink_enable = readEnableStatus(bytes[offset + 2]);
            d2d_master_config.d2d_cmd = bytesToHexString(bytes.slice(offset + 3, offset + 5));
            offset += 8;
            decoded.d2d_master_config = decoded.d2d_master_config || [];
            decoded.d2d_master_config.push(d2d_master_config);
            break;
        case 0xf1:
            var calibration_target = readUInt8(bytes[offset]);
            if (calibration_target === 0x00) {
                decoded.temperature_calibration_settings = {};
                decoded.temperature_calibration_settings.enable = readEnableStatus(bytes[offset + 1]);
                decoded.temperature_calibration_settings.calibration_value = readInt16LE(bytes.slice(offset + 2, offset + 4)) / 10;
            } else if (calibration_target === 0x04) {
                decoded.co2_calibration_settings = {};
                decoded.co2_calibration_settings.enable = readEnableStatus(bytes[offset + 1]);
                decoded.co2_calibration_settings.calibration_value = readInt16LE(bytes.slice(offset + 2, offset + 4));
            } else if (calibration_target === 0x05) {
                decoded.pressure_calibration_settings = {};
                decoded.pressure_calibration_settings.enable = readEnableStatus(bytes[offset + 1]);
                decoded.pressure_calibration_settings.calibration_value = readInt16LE(bytes.slice(offset + 2, offset + 4)) / 10;
            } else if (calibration_target === 0x09) {
                decoded.humidity_calibration_settings = {};
                decoded.humidity_calibration_settings.enable = readEnableStatus(bytes[offset + 1]);
                decoded.humidity_calibration_settings.calibration_value = readInt16LE(bytes.slice(offset + 2, offset + 4)) / 2;
            }
            offset += 4;
            break;
        case 0xf2:
            decoded.alarm_report_counts = readUInt16LE(bytes.slice(offset, offset + 2));
            offset += 2;
            break;
        case 0xf5:
            decoded.alarm_release_enable = readEnableStatus(bytes[offset]);
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

function readOnOffStatus(type) {
    var on_off_map = { 0: "off", 1: "on" };
    return getValue(on_off_map, type);
}

function readTemperatureAlarm(type) {
    var alarm_map = {
        0: "threshold alarm",
        1: "threshold alarm release",
        2: "mutation alarm",
    };
    return getValue(alarm_map, type);
}

function readEnableStatus(status) {
    var status_map = { 0: "disable", 1: "enable" };
    return getValue(status_map, status);
}

function readTimeZone(time_zone) {
    var timezone_map = { "-120": "UTC-12", "-110": "UTC-11", "-100": "UTC-10", "-95": "UTC-9:30", "-90": "UTC-9", "-80": "UTC-8", "-70": "UTC-7", "-60": "UTC-6", "-50": "UTC-5", "-40": "UTC-4", "-35": "UTC-3:30", "-30": "UTC-3", "-20": "UTC-2", "-10": "UTC-1", 0: "UTC", 10: "UTC+1", 20: "UTC+2", 30: "UTC+3", 35: "UTC+3:30", 40: "UTC+4", 45: "UTC+4:30", 50: "UTC+5", 55: "UTC+5:30", 57: "UTC+5:45", 60: "UTC+6", 65: "UTC+6:30", 70: "UTC+7", 80: "UTC+8", 90: "UTC+9", 95: "UTC+9:30", 100: "UTC+10", 105: "UTC+10:30", 110: "UTC+11", 120: "UTC+12", 127: "UTC+12:45", 130: "UTC+13", 140: "UTC+14" };
    return getValue(timezone_map, time_zone);
}

function readCalibrationStrategy(type) {
    var strategy_map = { 0: "factory", 1: "abc", 2: "manual", 3: "background", 4: "zero" };
    return getValue(strategy_map, type);
}

function readPressureCalibrationMode(type) {
    var mode_map = { 0: "disable", 1: "auto", 2: "manual" };
    return getValue(mode_map, type);
}

function readCondition(type) {
    var condition_map = { 0: "disable", 1: "below", 2: "above", 3: "between", 4: "outside", 5: "mutation" };
    return getValue(condition_map, type);
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
    return value & 0xffffffff;
}

function readD2DMode(type) {
    var mode_map = { 1: "threshold_alarm", 2: "threshold_alarm_release", 3: "mutation_alarm" };
    return getValue(mode_map, type);
}

function bytesToHexString(bytes) {
    var temp = [];
    for (var i = 0; i < bytes.length; i++) {
        temp.push(("0" + (bytes[i] & 0xff).toString(16)).slice(-2));
    }
    return temp.join("");
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
