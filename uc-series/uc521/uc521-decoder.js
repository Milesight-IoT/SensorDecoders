/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product UC521
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

var valve_chns = [0x03, 0x05];
var valve_pulse_chns = [0x04, 0x06];
var gpio_chns = [0x07, 0x08];
var pressure_chns = [0x09, 0x0a];
var pressure_alarm_chns = [0x0b, 0x0c];
var valve_exception_chns = [0xb3, 0xb5];
var pressure_exception_chns = [0xb9, 0xba];
var valve_opening_duration_chns = [0x0e, 0x0f];

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
        // VALVE
        else if (includes(valve_chns, channel_id) && channel_type === 0xf6) {
            var valve_chn_name = "valve_" + (valve_chns.indexOf(channel_id) + 1);
            var valve_type_value = bytes[i];
            var valve_type = readValveType(valve_type_value);
            var valve_opening = readUInt8(bytes[i + 1]);

            switch (valve_type_value) {
                case 0x00:
                    decoded[valve_chn_name + "_type"] = valve_type;
                    decoded[valve_chn_name + "_opening"] = valve_opening;
                    break;
                case 0x01:
                    decoded[valve_chn_name + "_type"] = valve_type;
                    if (valve_opening > 100) {
                        decoded[valve_chn_name + "_opening"] = valve_opening - 100;
                        decoded[valve_chn_name + "_direction"] = readValveDirection(1);
                    } else {
                        decoded[valve_chn_name + "_opening"] = valve_opening;
                        decoded[valve_chn_name + "_direction"] = readValveDirection(0);
                    }
                    break;
            }
            i += 2;
        }
        // VALVE PULSE
        else if (includes(valve_pulse_chns, channel_id) && channel_type === 0xc8) {
            var valve_pulse_chn_name = "valve_" + (valve_pulse_chns.indexOf(channel_id) + 1);
            decoded[valve_pulse_chn_name + "_pulse"] = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // GPIO
        else if (includes(gpio_chns, channel_id) && channel_type === 0x01) {
            var gpio_chn_name = "gpio_" + (channel_id - gpio_chns[0] + 1);
            decoded[gpio_chn_name] = readGPIOStatus(bytes[i]);
            i += 1;
        }
        // PIPE PRESSURE
        else if (includes(pressure_chns, channel_id) && channel_type === 0x7b) {
            var pressure_chn_name = "pressure_" + (pressure_chns.indexOf(channel_id) + 1);
            decoded[pressure_chn_name] = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // PIPE PRESSURE ALARM
        else if (includes(pressure_alarm_chns, channel_id) && channel_type === 0xf5) {
            var pressure_chn_name = "pressure_" + (pressure_alarm_chns.indexOf(channel_id) + 1);

            var source_type = readSourceType(bytes[i]);
            var condition_type_value = bytes[i + 1];
            var condition_type = readMathConditionType(condition_type_value);
            var min = readUInt16LE(bytes.slice(i + 2, i + 4));
            var max = readUInt16LE(bytes.slice(i + 4, i + 6));
            var pressure = readUInt16LE(bytes.slice(i + 6, i + 8));
            var alarm = readPressureAlarmType(bytes[i + 8]);
            i += 9;

            var event = {};
            event.source = source_type;
            event.condition = condition_type;
            switch (condition_type_value) {
                case 0x01:
                    event.threshold_min = min;
                    break;
                case 0x02:
                    event.threshold_max = max;
                    break;
                case 0x03:
                case 0x04:
                    event.threshold_min = min;
                    event.threshold_max = max;
                    break;
            }
            event.pressure = pressure;
            event.alarm = alarm;

            decoded[pressure_chn_name] = pressure;
            decoded[pressure_chn_name + "_alarm_event"] = event;
        }
        // VALVE CALIBRATION EVENT
        else if (channel_id === 0x0d && channel_type === 0xe3) {
            var valve_channel = readUInt8(bytes[i]) + 1;
            var valve_chn_name = "valve_" + valve_channel;

            var event = {};
            event.source_value = readUInt8(bytes[i + 1]);
            event.target_value = readUInt8(bytes[i + 2]);
            event.result = readCalibrationResult(bytes[i + 3]);
            i += 4;

            decoded[valve_chn_name + "_calibration_event"] = event;
        }
        // VALVE SENSOR STATUS
        else if (includes(valve_exception_chns, channel_id) && channel_type === 0xf6) {
            var valve_chn_name = "valve_" + (valve_exception_chns.indexOf(channel_id) + 1);
            var valve_type = readValveType(bytes[i]);
            var sensor_status = readValveSensorStatus(bytes[i + 1]);
            i += 2;

            decoded[valve_chn_name + "_type"] = valve_type;
            decoded[valve_chn_name + "_sensor_status"] = sensor_status;
        }
        // PIPE PRESSURE EXCEPTION
        else if (includes(pressure_exception_chns, channel_id) && channel_type === 0x7b) {
            var pressure_chn_name = "pressure_" + (pressure_exception_chns.indexOf(channel_id) + 1);
            var sensor_status = readPressureSensorStatus(bytes[i]);
            decoded[pressure_chn_name + "_sensor_status"] = sensor_status;
            i += 1;
        }
        // VALVE OPENING DURATION
        else if (includes(valve_opening_duration_chns, channel_id) && channel_type === 0x01) {
            var valve_chn_name = "valve_" + (valve_opening_duration_chns.indexOf(channel_id) + 1);
            decoded[valve_chn_name + "_opening_duration"] = readUInt8(bytes[i]);
            i += 1;
        }
        // CUSTOM MESSAGE
        else if (channel_id === 0xff && channel_type === 0x2a) {
            var length = bytes[i];
            decoded.custom_message = readAscii(bytes.slice(i + 1, i + length + 1));
            i += length + 1;
        }
        // DOWNLINK RESPONSE
        else if (channel_id === 0xfe || channel_id === 0xff) {
            var result = handle_downlink_response(channel_type, bytes, i);
            decoded = Object.assign(decoded, result.data);
            i = result.offset;
        }
        // DOWNLINK RESPONSE EXT
        else if (channel_id === 0xf8 || channel_id === 0xf9) {
            var result = handle_downlink_response_ext(channel_id, channel_type, bytes, i);
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
        case 0x10:
            decoded.reboot = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x1e:
            decoded.class_a_response_time = readUInt32LE(bytes.slice(offset, offset + 4));
            offset += 4;
            break;
        case 0x28:
            decoded.report_status = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x35:
            decoded.d2d_key = readHexString(bytes.slice(offset, offset + 8));
            offset += 8;
            break;
        case 0x46:
            decoded.gpio_jitter_time = readUInt8(bytes[offset]);
            offset += 1;
            break;
        case 0x4a:
            decoded.sync_time = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x4b: // batch_read_rules
            var type = readUInt8(bytes[offset]);
            var rule_bit_offset = { rule_1: 0, rule_2: 1, rule_3: 2, rule_4: 3, rule_5: 4, rule_6: 5, rule_7: 6, rule_8: 7, rule_9: 8, rule_10: 9, rule_11: 10, rule_12: 11, rule_13: 12, rule_14: 13, rule_15: 14, rule_16: 15 };
            // batch read rules
            if (type === 0) {
                decoded.batch_read_rules = {};
                var data = readUInt16LE(bytes.slice(offset + 1, offset + 3));
                for (var key in rule_bit_offset) {
                    decoded.batch_read_rules[key] = readYesNoStatus((data >>> rule_bit_offset[key]) & 0x01);
                }
            }
            // batch enable rules
            else if (type === 1) {
                decoded.batch_enable_rules = {};
                var data = readUInt16LE(bytes.slice(offset + 1, offset + 3));
                for (var key in rule_bit_offset) {
                    decoded.batch_enable_rules[key] = readEnableStatus((data >>> rule_bit_offset[key]) & 0x01);
                }
            }
            // batch remove rules
            else if (type === 2) {
                decoded.batch_remove_rules = {};
                var data = readUInt16LE(bytes.slice(offset + 1, offset + 3));
                for (var key in rule_bit_offset) {
                    decoded.batch_remove_rules[key] = readYesNoStatus((data >>> rule_bit_offset[key]) & 0x01);
                }
            }
            // enable single rule
            else if (type === 3) {
                var rule_index = readUInt8(bytes[offset + 1]);
                var rule_x_name = "rule_" + rule_index + "_enable";
                decoded[rule_x_name] = readEnableStatus(bytes[offset + 2]);
            }
            // remove single rule
            else if (type === 4) {
                var rule_index = readUInt8(bytes[offset + 1]);
                var rule_x_name = "rule_" + rule_index + "_remove";
                decoded[rule_x_name] = readYesNoStatus(bytes[offset + 2]);
            }
            offset += 3;
            break;
        case 0x4e:
            var valve_index = readUInt8(bytes[offset]);
            var valve_index_name = "clear_valve_" + valve_index + "_pulse";
            // ignore the next byte
            decoded[valve_index_name] = readYesNoStatus(1);
            offset += 2;
            break;
        case 0x52:
            // ignore the first byte
            decoded.valve_filter_config = {};
            decoded.valve_filter_config.mode = readValveFilterMode(readUInt8(bytes[offset + 1]));
            decoded.valve_filter_config.time = readUInt16LE(bytes.slice(offset + 2, offset + 4));
            offset += 4;
            break;
        case 0x53:
            var rule_index = readUInt8(bytes[offset]);
            var rule_index_name = "rule_" + rule_index;
            decoded.query_rule_config = decoded.query_rule_config || {};
            decoded.query_rule_config[rule_index_name] = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x55:
            var rule_config = {};
            rule_config.id = readUInt8(bytes[offset]);
            rule_config.enable = readEnableStatus(bytes[offset + 1]);
            rule_config.condition = readRuleCondition(bytes.slice(offset + 2, offset + 15));
            rule_config.action = readRuleAction(bytes.slice(offset + 15, offset + 28));
            offset += 29;

            decoded.rules_config = decoded.rules_config || [];
            decoded.rules_config.push(rule_config);
            break;
        case 0x84:
            decoded.d2d_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x8e:
            // ignore the first byte
            decoded.report_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            offset += 3;
            break;
        case 0x92:
            var valve_index = readUInt8(bytes[offset]);
            var valve_index_name = "valve_" + valve_index + "_pulse";
            decoded[valve_index_name] = readUInt32LE(bytes.slice(offset + 1, offset + 5));
            offset += 5;
            break;
        case 0xbd:
            decoded.time_zone = readTimeZone(readInt16LE(bytes.slice(offset, offset + 2)));
            offset += 2;
            break;
        case 0xf3:
            decoded.response_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        default:
            throw new Error("unknown downlink response");
    }

    return { data: decoded, offset: offset };
}

function handle_downlink_response_ext(code, channel_type, bytes, offset) {
    var decoded = {};

    switch (channel_type) {
        case 0x1a:
            var data = readUInt8(bytes[offset]);
            var valve_index = ((data >> 7) & 0x01) + 1;
            var valve_index_name = "valve_" + valve_index + "_config";
            decoded[valve_index_name] = {};
            decoded[valve_index_name].valve_type = readValveType((data >> 6) & 0x01);
            decoded[valve_index_name].auto_calibration_enable = readEnableStatus((data >> 5) & 0x01);
            decoded[valve_index_name].report_after_calibration_enable = readEnableStatus((data >> 4) & 0x01);
            decoded[valve_index_name].stall_strategy = readStallStrategy((data >> 3) & 0x01);
            decoded[valve_index_name].open_time_1 = bytes[offset + 1];
            decoded[valve_index_name].open_time_2 = bytes[offset + 2];
            decoded[valve_index_name].stall_current = readUInt16LE(bytes.slice(offset + 3, offset + 5));
            decoded[valve_index_name].stall_time = readUInt16LE(bytes.slice(offset + 5, offset + 7));
            decoded[valve_index_name].protect_time = bytes[offset + 7];
            decoded[valve_index_name].close_delay_time = bytes[offset + 8];
            decoded[valve_index_name].open_delay_time = bytes[offset + 9];
            offset += 10;
            break;
        case 0x19:
            var data = readUInt8(bytes[offset]);
            var valve_index = (data & 0x01) + 1;
            var time_control_enable_value = (data >> 7) & 0x01;
            var valve_pulse_control_enable_value = (data >> 6) & 0x01;
            var valve_index_name = "valve_" + valve_index + "_task";
            decoded[valve_index_name] = {};
            decoded[valve_index_name].time_control_enable = readEnableStatus(time_control_enable_value);
            decoded[valve_index_name].valve_pulse_control_enable = readEnableStatus(valve_pulse_control_enable_value);
            decoded[valve_index_name].task_id = readUInt8(bytes[offset + 1]);
            decoded[valve_index_name].valve_opening = readUInt8(bytes[offset + 2]);
            offset += 3;

            if (time_control_enable_value === 1) {
                decoded[valve_index_name].time = readUInt16LE(bytes.slice(offset, offset + 2));
                offset += 2;
            }
            if (valve_pulse_control_enable_value === 1) {
                decoded[valve_index_name].pulse = readUInt32LE(bytes.slice(offset, offset + 4));
                offset += 4;
            }
            break;
        case 0x5b:
            var pressure_index = readUInt8(bytes[offset]);
            var pressure_index_name = "pressure_" + pressure_index + "_calibration_settings";
            decoded[pressure_index_name] = {};
            decoded[pressure_index_name].enable = readEnableStatus(bytes[offset + 1]);
            decoded[pressure_index_name].calibration_value = readInt16LE(bytes.slice(offset + 2, offset + 4));
            offset += 4;
            break;
        case 0x68:
            var index = readUInt8(bytes[offset]);
            var index_name = "pressure_" + index + "_collection_interval";
            decoded[index_name] = {};
            decoded[index_name].enable = readEnableStatus(bytes[offset + 1]);
            decoded[index_name].collection_interval = readUInt16LE(bytes.slice(offset + 2, offset + 4));
            offset += 4;
            break;
        case 0x6e:
            decoded.wiring_switch_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x6f:
            decoded.valve_change_report_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x70:
            decoded.query_valve_opening_duration = decoded.query_valve_opening_duration || {};
            var valve_index = readUInt8(bytes[offset]);
            var valve_index_name = "valve_" + valve_index;
            decoded.query_valve_opening_duration[valve_index_name] = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x71:
            var index = readUInt8(bytes[offset]);
            var index_name = "gpio_" + index + "_type";
            decoded[index_name] = readGPIOType(bytes[offset + 1]);
            offset += 2;
            break;
        case 0x72:
            decoded.query_device_config = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x73:
            decoded.query_pressure_calibration_settings = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x74:
            decoded.query_gpio_type = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x75:
            decoded.query_valve_config = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x76:
            var index = readUInt8(bytes[offset]);
            var index_name = "pressure_" + index + "_config";
            decoded[index_name] = {};
            decoded[index_name].enable = readEnableStatus(bytes[offset + 1]);
            decoded[index_name].collection_interval = readUInt16LE(bytes.slice(offset + 2, offset + 4));
            decoded[index_name].display_unit = readPressureDisplayUnit(bytes[offset + 4]);
            decoded[index_name].mode = readPressureMode(bytes[offset + 5]);
            decoded[index_name].signal_type = readPressureSignalType(bytes[offset + 6]);
            decoded[index_name].osl = readUInt16LE(bytes.slice(offset + 7, offset + 9));
            decoded[index_name].osh = readUInt16LE(bytes.slice(offset + 9, offset + 11));
            decoded[index_name].power_supply_time = readUInt16LE(bytes.slice(offset + 11, offset + 13));
            decoded[index_name].range_min = readUInt16LE(bytes.slice(offset + 13, offset + 15));
            decoded[index_name].range_max = readUInt16LE(bytes.slice(offset + 15, offset + 17));
            offset += 17;
            break;
        case 0x77:
            decoded.query_pressure_config = readYesNoStatus(1);
            offset += 1;
            break;
        default:
            throw new Error("unknown downlink response");
    }

    if (hasResultFlag(code)) {
        var result_value = readUInt8(bytes[offset]);
        offset += 1;

        if (result_value !== 0) {
            var request = decoded;
            decoded = {};
            decoded.device_response_result = {};
            decoded.device_response_result.channel_type = channel_type;
            decoded.device_response_result.result = readResultStatus(result_value);
            decoded.device_response_result.request = request;
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
    var type_map = { 0: "counter", 1: "feedback" };
    return getValue(type_map, type);
}

function readSourceType(bytes) {
    var source_map = {
        0: "every change",
        1: "valve 1 opening",
        2: "valve 2 opening",
        3: "valve 1 opening or valve 2 opening",
    };
    return getValue(source_map, bytes);
}

function readPressureAlarmType(bytes) {
    var alarm_map = {
        0: "pipe pressure threshold alarm release",
        1: "pipe pressure threshold alarm",
    };
    return getValue(alarm_map, bytes);
}

function readCalibrationResult(status) {
    var status_map = { 0: "failed", 1: "success" };
    return getValue(status_map, status);
}

function readValveType(type) {
    var type_map = { 0: "2_way_ball_valve", 1: "3_way_ball_valve" };
    return getValue(type_map, type);
}

function readValveDirection(direction) {
    var direction_map = { 0: "left", 1: "right" };
    return getValue(direction_map, direction);
}

function readValveSensorStatus(status) {
    var status_map = {
        0: "low battery power",
        1: "shutdown after getting io feedback",
        2: "incorrect opening time",
        3: "timeout",
        4: "valve stall",
    };
    return getValue(status_map, status);
}

function readPressureSensorStatus(status) {
    var status_map = { 1: "read error" };
    return getValue(status_map, status);
}

function readTimeZone(time_zone) {
    var timezone_map = { "-720": "UTC-12", "-660": "UTC-11", "-600": "UTC-10", "-570": "UTC-9:30", "-540": "UTC-9", "-480": "UTC-8", "-420": "UTC-7", "-360": "UTC-6", "-300": "UTC-5", "-240": "UTC-4", "-210": "UTC-3:30", "-180": "UTC-3", "-120": "UTC-2", "-60": "UTC-1", 0: "UTC", 60: "UTC+1", 120: "UTC+2", 180: "UTC+3", 210: "UTC+3:30", 240: "UTC+4", 270: "UTC+4:30", 300: "UTC+5", 330: "UTC+5:30", 345: "UTC+5:45", 360: "UTC+6", 390: "UTC+6:30", 420: "UTC+7", 480: "UTC+8", 540: "UTC+9", 570: "UTC+9:30", 600: "UTC+10", 630: "UTC+10:30", 660: "UTC+11", 720: "UTC+12", 765: "UTC+12:45", 780: "UTC+13", 840: "UTC+14" };
    return getValue(timezone_map, time_zone);
}

function readValveFilterMode(mode) {
    var mode_map = { 1: "hardware", 2: "software" };
    return getValue(mode_map, mode);
}

function readEnableStatus(status) {
    var status_map = { 0: "disable", 1: "enable" };
    return getValue(status_map, status);
}

function readYesNoStatus(status) {
    var status_map = { 0: "no", 1: "yes" };
    return getValue(status_map, status);
}

function readStallStrategy(strategy) {
    var strategy_map = { 0: "close", 1: "keep" };
    return getValue(strategy_map, strategy);
}

function readRuleCondition(bytes) {
    var condition = {};

    var offset = 0;
    var condition_type_value = readUInt8(bytes[offset]);
    condition.type = readConditionType(condition_type_value);
    switch (condition_type_value) {
        case 0x00:
            break;
        case 0x01:
            condition.start_time = readUInt32LE(bytes.slice(offset + 1, offset + 5));
            condition.end_time = readUInt32LE(bytes.slice(offset + 5, offset + 9));
            condition.repeat_enable = readEnableStatus(bytes[offset + 9]);
            var repeat_mode_value = readUInt8(bytes[offset + 10]);
            condition.repeat_mode = getRepeatMode(repeat_mode_value);
            if (repeat_mode_value === 0x00 || repeat_mode_value === 0x01) {
                condition.repeat_step = readUInt16LE(bytes.slice(offset + 11, offset + 13));
            } else if (repeat_mode_value === 0x02) {
                condition.repeat_week = readWeekday(bytes[offset + 11]);
            }
            break;
        case 0x02:
            condition.d2d_command = readD2DCommand(bytes.slice(offset + 1, offset + 3));
            break;
        case 0x03:
            condition.valve_index = readUInt8(bytes[offset + 1]);
            condition.duration = readUInt16LE(bytes.slice(offset + 2, offset + 4));
            condition.pulse_threshold = readUInt32LE(bytes.slice(offset + 4, offset + 8));
            break;
        case 0x04:
            condition.valve_index = readUInt8(bytes[offset + 1]);
            condition.pulse_threshold = readUInt32LE(bytes.slice(offset + 2, offset + 6));
            break;
        case 0x05:
            condition.valve_index = readUInt8(bytes[offset + 1]);
            condition.valve_strategy = readValveStrategy(readUInt8(bytes[offset + 2]));
            condition.condition_type = readMathConditionType(readUInt8(bytes[offset + 3]));
            condition.threshold_min = readUInt16LE(bytes.slice(offset + 4, offset + 6));
            condition.threshold_max = readUInt16LE(bytes.slice(offset + 6, offset + 8));
            break;
    }
    return condition;
}

function getRepeatMode(repeat_mode_value) {
    var repeat_mode_map = { 0: "monthly", 1: "daily", 2: "weekly" };
    return getValue(repeat_mode_map, repeat_mode_value);
}

function readD2DCommand(bytes) {
    return ("0" + (bytes[1] & 0xff).toString(16)).slice(-2) + ("0" + (bytes[0] & 0xff).toString(16)).slice(-2);
}

function readWeekday(weekday_value) {
    var weekday_bit_offset = { monday: 0, tuesday: 1, wednesday: 2, thursday: 3, friday: 4, saturday: 5, sunday: 6 };

    var weekday = {};
    for (var key in weekday_bit_offset) {
        weekday[key] = readEnableStatus((weekday_value >>> weekday_bit_offset[key]) & 0x01);
    }
    return weekday;
}

function readValveStrategy(strategy_value) {
    var valve_strategy_map = { 0: "always", 1: "valve 1 open", 2: "valve 2 open", 3: "valve 1 open or valve 2 open" };
    return getValue(valve_strategy_map, strategy_value);
}

function readConditionType(condition_type_value) {
    var condition_type_map = { 0: "none", 1: "time", 2: "d2d", 3: "time or pulse threshold", 4: "pulse threshold", 5: "pressure threshold" };
    return getValue(condition_type_map, condition_type_value);
}

function readMathConditionType(condition_type_value) {
    var condition_type_map = { 0: "none", 1: "below", 2: "above", 3: "between", 4: "outside" };
    return getValue(condition_type_map, condition_type_value);
}

function readRuleAction(bytes) {
    var action_type_map = { 0: "none", 1: "em valve control", 2: "valve control", 3: "report" };

    var offset = 0;
    var action = {};

    var type_value = readUInt8(bytes[offset]);
    action.type = getValue(action_type_map, type_value);
    switch (type_value) {
        case 0x00:
            break;
        case 0x01:
            action.valve_index = readUInt8(bytes[offset + 1]);
            action.valve_opening = readUInt8(bytes[offset + 2]);
            action.time_enable = readEnableStatus(bytes[offset + 3]);
            action.duration = readUInt32LE(bytes.slice(offset + 4, offset + 8));
            action.pulse_enable = readEnableStatus(bytes[offset + 8]);
            action.pulse_threshold = readUInt32LE(bytes.slice(offset + 9, offset + 13));
            break;
        case 0x02:
            action.valve_index = readUInt8(bytes[offset + 1]);
            action.valve_opening = readUInt8(bytes[offset + 2]);
            action.time_enable = readEnableStatus(bytes[offset + 3]);
            action.duration = readUInt32LE(bytes.slice(offset + 4, offset + 8));
            action.pulse_enable = readEnableStatus(bytes[offset + 8]);
            action.pulse_threshold = readUInt32LE(bytes.slice(offset + 9, offset + 13));
            break;
        case 0x03:
            action.report_type = readReportType(readUInt8(bytes[offset + 1]));
            action.report_content = readAscii(bytes.slice(offset + 2, offset + 10));
            // ignore the next byte
            action.report_counts = readUInt8(bytes[offset + 11]);
            action.threshold_release_enable = readEnableStatus(bytes[offset + 12]);
            break;
    }
    return action;
}

function readReportType(report_type_value) {
    var report_type_map = { 1: "valve 1", 2: "valve 2", 3: "custom message", 4: "pressure threshold alarm" };
    return getValue(report_type_map, report_type_value);
}

function readPressureDisplayUnit(unit_value) {
    var unit_map = { 0: "kPa", 1: "Bar", 2: "MPa" };
    return getValue(unit_map, unit_value);
}

function readPressureMode(mode_value) {
    var mode_map = { 0: "standard", 1: "custom" };
    return getValue(mode_map, mode_value);
}

function readPressureSignalType(signal_type_value) {
    var signal_type_map = { 0: "voltage", 1: "current" };
    return getValue(signal_type_map, signal_type_value);
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

function readFloatLE(bytes) {
    var bits = (bytes[3] << 24) | (bytes[2] << 16) | (bytes[1] << 8) | bytes[0];
    var sign = bits >>> 31 === 0 ? 1.0 : -1.0;
    var e = (bits >>> 23) & 0xff;
    var m = e === 0 ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
    var f = sign * m * Math.pow(2, e - 150);
    return f;
}

function readAscii(bytes) {
    var str = "";
    for (var i = 0; i < bytes.length; i++) {
        if (bytes[i] === 0x00) {
            break;
        }
        str += String.fromCharCode(bytes[i]);
    }
    return str;
}

function readHexString(bytes) {
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

function includes(items, item) {
    var size = items.length;
    for (var i = 0; i < size; i++) {
        if (items[i] == item) {
            return true;
        }
    }
    return false;
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
