/**
 * Payload Decoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product WT101
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

        // POWER STATUS
        if (channel_id === 0xff && channel_type === 0x0b) {
            decoded.power_status = "on";
            i += 1;
        }
        // IPSO VERSION
        else if (channel_id === 0xff && channel_type === 0x01) {
            decoded.ipso_version = readProtocolVersion(bytes[i]);
            i += 1;
        }
        // PRODUCT SERIAL NUMBER
        else if (channel_id === 0xff && channel_type === 0x16) {
            decoded.sn = readSerialNumber(bytes.slice(i, i + 8));
            i += 8;
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
        // LORAWAN CLASS TYPE
        else if (channel_id === 0xff && channel_type === 0x0f) {
            decoded.lorawan_class = readLoRaWANType(bytes[i]);
            i += 1;
        }
        // TSL VERSION
        else if (channel_id === 0xff && channel_type === 0xff) {
            decoded.tsl_version = readTslVersion(bytes.slice(i, i + 2));
            i += 2;
        }
        // BATTERY
        else if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = readUInt8(bytes[i]);
            i += 1;
        }
        // TEMPERATURE
        else if (channel_id === 0x03 && channel_type === 0x67) {
            decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // TEMPERATURE TARGET
        else if (channel_id === 0x04 && channel_type === 0x67) {
            decoded.temperature_target = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // VALVE OPENING
        else if (channel_id === 0x05 && channel_type === 0x92) {
            decoded.valve_opening = readUInt8(bytes[i]);
            i += 1;
        }
        // TAMPER STATUS
        else if (channel_id === 0x06 && channel_type === 0x00) {
            decoded.tamper_status = bytes[i] === 0 ? "installed" : "uninstalled";
            i += 1;
        }
        // WINDOW DETECTION
        else if (channel_id === 0x07 && channel_type === 0x00) {
            decoded.window_detection = bytes[i] === 0 ? "normal" : "open";
            i += 1;
        }
        // MOTOR STROKE CALIBRATION RESULT
        else if (channel_id === 0x08 && channel_type === 0xe5) {
            decoded.motor_calibration_result = readMotorCalibration(bytes[i]);
            i += 1;
        }
        // MOTOR STROKE
        else if (channel_id === 0x09 && channel_type === 0x90) {
            decoded.motor_stroke = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // FREEZE PROTECTION
        else if (channel_id === 0x0a && channel_type === 0x00) {
            decoded.freeze_protection = bytes[i] === 0 ? "normal" : "triggered";
            i += 1;
        }
        // MOTOR CURRENT POSITION
        else if (channel_id === 0x0b && channel_type === 0x90) {
            decoded.motor_position = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // HEATING DATE
        else if (channel_id === 0xf9 && channel_type === 0x33) {
            decoded.heating_date = readHeatingDate(bytes.slice(i, i + 7));
            i += 7;
        }
        // HEATING SCHEDULE
        else if (channel_id === 0xf9 && channel_type === 0x34) {
            var heating_schedule = readHeatingSchedule(bytes.slice(i, i + 9));
            decoded.heating_schedule = decoded.heating_schedule || [];
            decoded.heating_schedule.push(heating_schedule);
            i += 9;
        }
        // DOWNLINK RESPONSE
        else if (channel_id === 0xfe) {
            result = handle_downlink_response(channel_type, bytes, i);
            decoded = Object.assign(decoded, result.data);
            i = result.offset;
        }
        // DOWNLINK RESPONSE
        else if (channel_id === 0xf8) {
            result = handle_downlink_response_ext(channel_type, bytes, i);
            decoded = Object.assign(decoded, result.data);
            i = result.offset;
        } else {
            break;
        }
    }

    return decoded;
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

function readLoRaWANType(type) {
    switch (type) {
        case 0x00:
            return "ClassA";
        case 0x01:
            return "ClassB";
        case 0x02:
            return "ClassC";
        case 0x03:
            return "ClassCtoB";
        default:
            return "Unknown";
    }
}

function readMotorCalibration(type) {
    switch (type) {
        case 0x00:
            return "success";
        case 0x01:
            return "fail: out of range";
        case 0x02:
            return "fail: uninstalled";
        case 0x03:
            return "calibration cleared";
        case 0x04:
            return "temperature control disabled";
        default:
            return "unknown";
    }
}

function readHeatingDate(bytes) {
    var heating_date = {};
    var offset = 0;
    heating_date.enable = readUInt8(bytes[offset]);
    heating_date.report_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
    heating_date.start_month = readUInt8(bytes[offset + 3]);
    heating_date.start_day = readUInt8(bytes[offset + 4]);
    heating_date.end_month = readUInt8(bytes[offset + 5]);
    heating_date.end_day = readUInt8(bytes[offset + 6]);
    return heating_date;
}

function handle_downlink_response(channel_type, bytes, offset) {
    var decoded = {};

    switch (channel_type) {
        case 0x17: // timezone
            decoded.timezone = readInt16LE(bytes.slice(offset, offset + 2)) / 10;
            offset += 2;
            break;
        case 0x4a: // sync_time
            decoded.sync_time = 1;
            offset += 1;
            break;
        case 0x8e: // report_interval
            // ignore the first byte
            decoded.report_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            offset += 3;
            break;
        case 0x3b: // time_sync_enable
            decoded.time_sync_enable = readUInt8(bytes[offset]);
            offset += 1;
            break;
        case 0xb3: // temperature_control(enable)
            decoded.temperature_control = decoded.temperature_control || {};
            decoded.temperature_control.enable = bytes[offset];
            offset += 1;
            break;
        case 0xae: // temperature_control(mode)
            decoded.temperature_control = decoded.temperature_control || {};
            decoded.temperature_control.mode = bytes[offset];
            offset += 1;
            break;
        case 0xab: // temperature_calibration(enable, temperature)
            decoded.temperature_calibration = {};
            decoded.temperature_calibration.enable = bytes[offset];
            if (decoded.temperature_calibration.enable === 1) {
                decoded.temperature_calibration.temperature = readInt16LE(bytes.slice(offset + 1, offset + 3)) / 10;
            }
            offset += 3;
            break;
        case 0xb1: // temperature_target, temperature_error
            decoded.temperature_target = readInt8(bytes[offset]);
            decoded.temperature_error = readUInt16LE(bytes.slice(offset + 1, offset + 3)) / 10;
            offset += 3;
            break;
        case 0xac: // valve_control_algorithm
            decoded.valve_control_algorithm = readUInt8(bytes[offset]);
            offset += 1;
            break;
        case 0xb0: // freeze_protection_config(enable, temperature)
            decoded.freeze_protection_config = decoded.freeze_protection_config || {};
            decoded.freeze_protection_config.enable = readUInt8(bytes[offset]);
            if (decoded.freeze_protection_config.enable === 1) {
                decoded.freeze_protection_config.temperature = readInt16LE(bytes.slice(offset + 1, offset + 3)) / 10;
            }
            offset += 3;
            break;
        case 0xaf: // open_window_detection(enable, rate, time)
            decoded.open_window_detection = decoded.open_window_detection || {};
            decoded.open_window_detection.enable = readUInt8(bytes[offset]);
            if (decoded.open_window_detection.enable === 1) {
                decoded.open_window_detection.temperature_threshold = readInt8(bytes[offset + 1]) / 10;
                decoded.open_window_detection.time = readUInt16LE(bytes.slice(offset + 2, offset + 4));
            }
            offset += 4;
            break;
        case 0x57: // restore_open_window_detection
            decoded.restore_open_window_detection = 1;
            offset += 1;
            break;
        case 0xb4: // valve_opening
            decoded.valve_opening = readUInt8(bytes[offset]);
            offset += 1;
            break;
        case 0xad: // valve_calibration
            decoded.valve_calibration = 1;
            offset += 1;
            break;
        case 0x25: // child_lock_config
            decoded.child_lock_config = decoded.child_lock_config || {};
            decoded.child_lock_config.enable = readUInt8(bytes[offset]);
            offset += 1;
            break;
        case 0xc4: // outside_temperature_control
            decoded.outside_temperature_control = {};
            decoded.outside_temperature_control.enable = readUInt8(bytes[offset]);
            decoded.outside_temperature_control.timeout = readUInt8(bytes[offset + 1]);
            offset += 2;
            break;
        case 0xf8: // offline_control_mode
            decoded.offline_control_mode = readUInt8(bytes[offset]);
            offset += 1;
            break;
        case 0xbd:
            decoded.timezone = readInt16LE(bytes.slice(offset, offset + 2)) / 60;
            offset += 2;
            break;
        case 0xba: // dst_config
            decoded.dst_config = {};
            decoded.dst_config.enable = readUInt8(bytes[offset]);
            decoded.dst_config.offset = readInt8(bytes[offset + 1]);
            decoded.dst_config.start_time = {};
            decoded.dst_config.start_time.month = readUInt8(bytes[offset + 2]);
            decoded.dst_config.start_time.week = readUInt8(bytes[offset + 3]) >> 4;
            decoded.dst_config.start_time.weekday = readUInt8(bytes[offset + 3]) & 0x0f;
            var start_time = readUInt16LE(bytes.slice(offset + 4, offset + 6));
            decoded.dst_config.start_time.time = Math.floor(start_time / 60) + ":" + (start_time % 60);
            decoded.dst_config.end_time = {};
            decoded.dst_config.end_time.month = readUInt8(bytes[offset + 6]);
            decoded.dst_config.end_time.week = readUInt8(bytes[offset + 7]) >> 4;
            decoded.dst_config.end_time.weekday = readUInt8(bytes[offset + 7]) & 0x0f;
            var end_time = readUInt16LE(bytes.slice(offset + 8, offset + 10));
            decoded.dst_config.end_time.time = Math.floor(end_time / 60) + ":" + (end_time % 60);
            offset += 10;
            break;
        default:
            throw new Error("unknown downlink response");
    }

    return { data: decoded, offset: offset };
}

function handle_downlink_response_ext(channel_type, bytes, offset) {
    var decoded = {};

    switch (channel_type) {
        case 0x33:
            var heating_date_result = readUInt8(bytes[offset + 7]);
            if (heating_date_result === 0) {
                decoded.heating_date = readHeatingDate(bytes.slice(offset, offset + 7));
            }
            offset += 8;
            break;
        case 0x34:
            var heating_schedule_result = readUInt8(bytes[offset + 9]);
            if (heating_schedule_result === 0) {
                var heating_schedule = readHeatingSchedule(bytes.slice(offset, offset + 9));
                decoded.heating_schedule = decoded.heating_schedule || [];
                decoded.heating_schedule.push(heating_schedule);
            }
            offset += 10;
            break;
        case 0x35:
            var temperature_target_range_result = readUInt8(bytes[offset + 2]);
            if (temperature_target_range_result === 0) {
                decoded.temperature_target_range = {};
                decoded.temperature_target_range.min = readInt8(bytes[offset]);
                decoded.temperature_target_range.max = readInt8(bytes[offset + 1]);
            }
            offset += 3;
            break;
        case 0x36:
            var display_ambient_temperature_result = readUInt8(bytes[offset + 1]);
            if (display_ambient_temperature_result === 0) {
                decoded.display_ambient_temperature = readUInt8(bytes[offset]);
            }
            offset += 2;
            break;
        case 0x37:
            var window_detection_valve_strategy_result = readUInt8(bytes[offset + 1]);
            if (window_detection_valve_strategy_result === 0) {
                decoded.window_detection_valve_strategy = readUInt8(bytes[offset]);
            }
            offset += 2;
            break;
        case 0x38: // effective_stroke
            var effective_stroke_result = readUInt8(bytes[offset + 2]);
            if (effective_stroke_result === 0) {
                decoded.effective_stroke = {};
                decoded.effective_stroke.enable = readUInt8(bytes[offset]);
                decoded.effective_stroke.rate = readUInt8(bytes[offset + 1]);
            }
            offset += 3;
            break;
        case 0x3a: // change_report_enable
            var change_report_enable_result = readUInt8(bytes[offset + 1]);
            if (change_report_enable_result === 0) {
                decoded.change_report_enable = readUInt8(bytes[offset]);
            }
            offset += 2;
            break;
        default:
            throw new Error("unknown downlink response");
    }

    return { data: decoded, offset: offset };
}

if (!Object.assign) {
    Object.defineProperty(Object, "assign", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (target) {
            "use strict";
            if (target == null) {
                // TypeError if undefined or null
                throw new TypeError("Cannot convert first argument to object");
            }

            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource == null) {
                    // Skip over if undefined or null
                    continue;
                }
                nextSource = Object(nextSource);

                var keysArray = Object.keys(Object(nextSource));
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        },
    });
}
function readHeatingSchedule(bytes) {
    var heating_schedule = {};
    var offset = 0;
    heating_schedule.index = readUInt8(bytes[offset]) + 1;
    heating_schedule.enable = readUInt8(bytes[offset + 1]);
    heating_schedule.temperature_control_mode = readUInt8(bytes[offset + 2]);
    heating_schedule.value = readUInt8(bytes[offset + 3]);
    heating_schedule.report_interval = readUInt16LE(bytes.slice(offset + 4, offset + 6));
    var time = readUInt16LE(bytes.slice(offset + 6, offset + 8));
    heating_schedule.execute_time = Math.floor(time / 60) + ":" + (time % 60);
    var day = readUInt8(bytes[offset + 8]);
    heating_schedule.week_recycle = [];
    for (var i = 1; i <= 7; i++) {
        if ((day >> i) & 0x01) {
            heating_schedule.week_recycle.push(i);
        }
    }
    return heating_schedule;
}
