/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product EM500-CO2
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
            decoded.battery = bytes[i];
            i += 1;
        }
        // TEMPERATURE(℃)
        else if (channel_id === 0x03 && channel_type === 0x67) {
            decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // HUMIDITY
        else if (channel_id === 0x04 && channel_type === 0x68) {
            decoded.humidity = bytes[i] / 2;
            i += 1;
        }
        // CO2 (ODM: 2727)
        else if (channel_id === 0x05 && channel_type === 0xeb) {
            decoded.co2 = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // PRESSURE
        else if (channel_id === 0x06 && channel_type === 0x73) {
            decoded.pressure = readUInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // CALIBRATION RESULT
        else if (channel_id === 0x07 && channel_type === 0xe5) {
            decoded.calibration_result = readCalibrationResult(bytes[i]);
            i += 1;
        }
        // TEMPERATURE CHANGE ALARM
        else if (channel_id === 0x83 && channel_type === 0xd7) {
            decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            decoded.temperature_change = readInt16LE(bytes.slice(i + 2, i + 4)) / 10;
            decoded.temperature_alarm = readTemperatureAlarm(bytes[i + 4]);
            i += 5;
        }
        // HISTORY (ODM: 2727)
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var data = {};
            data.timestamp = readUInt32LE(bytes.slice(i, i + 4));
            data.co2 = readUInt32LE(bytes.slice(i + 4, i + 8));
            data.pressure = readUInt16LE(bytes.slice(i + 8, i + 10)) / 10;
            data.temperature = readInt16LE(bytes.slice(i + 10, i + 12)) / 10;
            data.humidity = bytes[i + 12] / 2;
            i += 13;

            decoded.history = decoded.history || [];
            decoded.history.push(data);
        }
        // DOWNLINK RESPONSE
        else if (channel_id === 0xfe) {
            var result = handle_downlink_response(channel_type, bytes, i);
            decoded = Object.assign(decoded, result.data);
            i = result.offset;
        }
        // DOWNLINK RESPONSE EXT
        else if (channel_id === 0xf8 || channel_id === 0xf9) {
            result = handle_downlink_response_ext(channel_id, channel_type, bytes, i);
            decoded = Object.assign(decoded, result.data);
            i = result.offset;
        }
        else {
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
                    decoded.co2_threshold_alarm_config = {};
                    decoded.co2_threshold_alarm_config.enable = enable;
                    decoded.co2_threshold_alarm_config.condition = condition;
                    decoded.co2_threshold_alarm_config.min_threshold = readUInt16LE(bytes.slice(offset + 1, offset + 3));
                    decoded.co2_threshold_alarm_config.max_threshold = readUInt16LE(bytes.slice(offset + 3, offset + 5));
                    break;
                case 0x02:
                    decoded.temperature_threshold_alarm_config = {};
                    decoded.temperature_threshold_alarm_config.enable = enable;
                    decoded.temperature_threshold_alarm_config.condition = condition;
                    decoded.temperature_threshold_alarm_config.min_threshold = readInt16LE(bytes.slice(offset + 1, offset + 3)) / 10;
                    decoded.temperature_threshold_alarm_config.max_threshold = readInt16LE(bytes.slice(offset + 3, offset + 5)) / 10;
                    break;
                case 0x03:
                    decoded.temperature_mutation_alarm_config = {};
                    decoded.temperature_mutation_alarm_config.enable = enable;
                    decoded.temperature_mutation_alarm_config.condition = condition;
                    decoded.temperature_mutation_alarm_config.min_threshold = readInt16LE(bytes.slice(offset + 1, offset + 3)) / 10;
                    decoded.temperature_mutation_alarm_config.max_threshold = readInt16LE(bytes.slice(offset + 3, offset + 5)) / 10;
                    break;
            }
            offset += 9;
            break;
        case 0x11:
            decoded.timestamp = readUInt32LE(bytes.slice(offset, offset + 4));
            offset += 4;
            break;
        case 0x17:
            decoded.timezone = readInt16LE(bytes.slice(offset, offset + 2)) / 10;
            offset += 2;
            break;
        case 0x18:
            var mode = readUInt8(bytes[offset]);
            var value = readUInt8(bytes[offset + 1]);
            var sensor_offset = { "temperature_enable": 1, "humidity_enable": 2, "co2_enable": 5, "pressure_enable": 6 };
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
            decoded.co2_abc_calibration_config = {};
            decoded.co2_abc_calibration_config.enable = readEnableStatus(bytes[offset]);
            decoded.co2_abc_calibration_config.period = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            decoded.co2_abc_calibration_config.target_value = readUInt16LE(bytes.slice(offset + 3, offset + 5));
            offset += 5;
            break;
        case 0x3b:
            decoded.time_sync_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x68:
            decoded.history_enable = readEnableStatus(readUInt8(bytes[offset]));
            offset += 1;
            break;
        case 0x69:
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
            decoded.pressure_calibration_config = {};
            decoded.pressure_calibration_config.mode = readPressureCalibrationMode(bytes[offset]);
            decoded.pressure_calibration_config.value = readInt16LE(bytes.slice(offset + 1, offset + 3));
            offset += 3;
            break;
        case 0x96:
            decoded.d2d_master_config = {};
            decoded.d2d_master_config.mode = readD2DMode(bytes[offset]);
            decoded.d2d_master_config.uplink_enable = readEnableStatus(bytes[offset + 1]);
            decoded.d2d_master_config.lora_uplink_enable = readEnableStatus(bytes[offset + 2]);
            decoded.d2d_master_config.d2d_cmd = bytesToHexString(bytes.slice(offset + 3, offset + 5));
            offset += 8;
            break;
        case 0xf1:
            var calibration_value_target = readUInt8(bytes[offset]);
            if (calibration_value_target === 0x00) {
                decoded.temperature_calibration_value_config = {};
                decoded.temperature_calibration_value_config.enable = readEnableStatus(bytes[offset + 1]);
                decoded.temperature_calibration_value_config.target_value = readInt16LE(bytes.slice(offset + 2, offset + 4)) / 10;
            } else if (calibration_value_target === 0x05) {
                decoded.pressure_calibration_value_config = {};
                decoded.pressure_calibration_value_config.enable = readEnableStatus(bytes[offset + 1]);
                decoded.pressure_calibration_value_config.target_value = readInt16LE(bytes.slice(offset + 2, offset + 4)) / 10;
            } else if (calibration_value_target === 0x09) {
                decoded.humidity_calibration_value_config = {};
                decoded.humidity_calibration_value_config.enable = readEnableStatus(bytes[offset + 1]);
                decoded.humidity_calibration_value_config.target_value = readInt16LE(bytes.slice(offset + 2, offset + 4)) / 2;
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

// 0xF8 or 0xF9
function handle_downlink_response_ext(code, channel_type, bytes, offset) {
    var decoded = {};

    switch (channel_type) {
        case 0x60:
            var mode_value = readUInt8(bytes[offset]);
            var value = readUInt32LE(bytes.slice(offset + 1, offset + 5));
            decoded.co2_calibration_config = {};
            decoded.co2_calibration_config.mode = readCalibrationStrategy(mode_value);
            if (mode_value === 0x01) {
                decoded.co2_target_value = readInt32LE(bytes.slice(offset, offset + 4));
            }
            // in_gas mode
            else if (mode_value === 0x02) {
                decoded.in_gas_mode = readCO2CalibrationInGasMode(value);
            }
            offset += 5;
            break;
        case 0x61:
            var data = readUInt8(bytes[offset]);
            var enable = readEnableStatus((data >>> 6) & 0x01);
            var condition = readCondition((data >>> 0) & 0x07);
            var target = (data >>> 3) & 0x07;

            switch (target) {
                case 0x01:
                    decoded.co2_threshold_alarm_config = {};
                    decoded.co2_threshold_alarm_config.enable = enable;
                    decoded.co2_threshold_alarm_config.condition = condition;
                    decoded.co2_threshold_alarm_config.min_threshold = readUInt32LE(bytes.slice(offset + 1, offset + 5));
                    decoded.co2_threshold_alarm_config.max_threshold = readUInt32LE(bytes.slice(offset + 5, offset + 9));
                    break;
                case 0x02:
                    decoded.temperature_threshold_alarm_config = {};
                    decoded.temperature_threshold_alarm_config.enable = enable;
                    decoded.temperature_threshold_alarm_config.condition = condition;
                    decoded.temperature_threshold_alarm_config.min_threshold = readInt32LE(bytes.slice(offset + 1, offset + 5)) / 10;
                    decoded.temperature_threshold_alarm_config.max_threshold = readInt32LE(bytes.slice(offset + 5, offset + 9)) / 10;
                    break;
                case 0x03:
                    decoded.temperature_mutation_alarm_config = {};
                    decoded.temperature_mutation_alarm_config.enable = enable;
                    decoded.temperature_mutation_alarm_config.condition = condition;
                    decoded.temperature_mutation_alarm_config.min_threshold = readInt32LE(bytes.slice(offset + 1, offset + 5)) / 10;
                    decoded.temperature_mutation_alarm_config.max_threshold = readInt32LE(bytes.slice(offset + 5, offset + 9)) / 10;
                    break;
            }
            offset += 9;
            break;
        case 0x71:
            // ignore first byte
            decoded.co2_calibration_value_config = {};
            decoded.co2_calibration_value_config.enable = readEnableStatus(bytes[offset + 1]);
            decoded.co2_calibration_value_config.target_value = readInt32LE(bytes.slice(offset + 2, offset + 6));
            offset += 6;
            break;
        default:
            throw new Error("unknown downlink response");
    }

    if (hasResultFlag(code)) {
        var result_value = readUInt8(bytes[offset]);
        offset += 1;

        if (result_value !== 0) {
            decoded = {};
            decoded.device_response_result = {};
            decoded.device_response_result.channel_type = channel_type;
            decoded.device_response_result.result = readResultStatus(bytes[offset]);
        }
    }

    return { data: decoded, offset: offset };
}

function hasResultFlag(code) {
    return code === 0xf8;
}

function readResultStatus(status) {
    var status_map = { 0: "success", 1: "forbidden", 2: "invalid parameter" };
    return getValue(status_map, status);
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
    }
    return getValue(alarm_map, type);
}

function readCalibrationResult(type) {
    var result_map = { 0: "calibrating", 1: "success", 2: "failed" };
    return getValue(result_map, type);
}

function readEnableStatus(type) {
    var enable_map = { 0: "disable", 1: "enable" };
    return getValue(enable_map, type);
}

function readCalibrationStrategy(type) {
    var strategy_map = { 0: "factory", 1: "manual", 3: "in_gas" };
    return getValue(strategy_map, type);
}

function readCO2CalibrationInGasMode(value) {
    var in_gas_map = {
        0: "low_noise_in_n2_range_0_100",
        1: "low_noise_in_air_range_0_100",
        2: "low_noise_in_n2_range_0_40",
        3: "low_noise_in_air_range_0_40",
        16: "low_cross_in_n2_range_0_100",
        17: "low_cross_air_range_0_100",
        18: "low_cross_in_n2_range_0_40",
        19: "low_cross_in_air_range_0_40"
    };
    return getValue(in_gas_map, value);
}

function readPressureCalibrationMode(type) {
    var mode_map = { 0: "disable", 1: "auto", 2: "manual" };
    return getValue(mode_map, type);
}

function readCondition(type) {
    var condition_map = { 0: "disable", 1: "below", 2: "above", 3: "between", 4: "outside", 5: "mutation" };
    return getValue(condition_map, type);
}

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