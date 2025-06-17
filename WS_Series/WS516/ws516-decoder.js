/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product WS516
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

    var unknown_command = 0;
    for (var i = 0; i < bytes.length;) {
        var command_id = bytes[i++];

        switch (command_id) {
            // attribute
            case 0xdf:
                decoded.tsl_version = readProtocolVersion(bytes.slice(i, i + 2));
                i += 2;
                break;
            case 0xde: // ?
                decoded.product_name = readString(bytes.slice(i, i + 32));
                i += 32;
                break;
            case 0xdd: // ?
                decoded.product_pn = readString(bytes.slice(i, i + 32));
                i += 32;
                break;
            case 0xdb:
                decoded.product_sn = readHexString(bytes.slice(i, i + 8));
                i += 8;
                break;
            case 0xda:
                decoded.version = {};
                decoded.version.hardware_version = readHardwareVersion(bytes.slice(i, i + 2));
                decoded.version.firmware_version = readFirmwareVersion(bytes.slice(i + 2, i + 8));
                i += 8;
                break;
            case 0xd9:
                decoded.oem_id = readHexString(bytes.slice(i, i + 2));
                i += 2;
                break;
            case 0xd8:
                decoded.product_frequency_band = readString(bytes.slice(i, i + 16));
                i += 16;
                break;
            case 0xee:
                decoded.device_request = 1;
                i += 0;
                break;
            case 0xc8:
                decoded.device_status = readDeviceStatus(bytes[i]);
                i += 1;
                break;
            case 0xcf:
                // skip 1 byte
                decoded.lorawan_class = readLoRaWANClass(bytes[i + 1]);
                i += 2;
                break;

            // uplink: telemetry
            case 0x00: // unit: V
                decoded.voltage_1 = readUInt16LE(bytes.slice(i, i + 2)) / 10;
                i += 2;
                break;
            case 0x01: // unit: W
                decoded.electric_power_1 = readUInt32LE(bytes.slice(i, i + 4));
                i += 4;
                break;
            case 0x02: // unit: %
                decoded.power_factory_1 = readUInt8(bytes[i]);
                i += 1;
                break;
            case 0x03: // unit: KWh
                decoded.power_consumption_1 = readUInt32LE(bytes.slice(i, i + 4)) / 1000;
                i += 4;
                break;
            case 0x04: // unit: A
                decoded.current_1 = readUInt16LE(bytes.slice(i, i + 2)) / 1000;
                i += 2;
                break;
            case 0x05: // unit: °C
                decoded.temperature_1 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                i += 2;
                break;
            case 0x07: // unit: V
                decoded.voltage_2 = readUInt16LE(bytes.slice(i, i + 2)) / 10;
                i += 2;
                break;
            case 0x08: // unit: W
                decoded.electric_power_2 = readUInt32LE(bytes.slice(i, i + 4));
                i += 4;
                break;
            case 0x09: // unit: %
                decoded.power_factory_2 = readUInt8(bytes[i]);
                i += 1;
                break;
            case 0x0A: // unit: KWh
                decoded.power_consumption_2 = readUInt32LE(bytes.slice(i, i + 4)) / 1000;
                i += 4;
                break;
            case 0x0B: // unit: A
                decoded.current_2 = readUInt16LE(bytes.slice(i, i + 2)) / 1000;
                i += 2;
                break;
            case 0x0C: // unit: °C
                decoded.temperature_2 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                i += 2;
                break;
            case 0x0E:
                decoded.socket_switch_status_1 = readOnOffStatus(bytes[i]);
                i += 1;
                break;
            case 0x0F:
                decoded.socket_switch_status_2 = readOnOffStatus(bytes[i]);
                i += 1;
                break;
            case 0x10:
                var temperature_1_alarm_type = readUInt8(bytes[i]);
                decoded.temperature_1_alarm = {};
                decoded.temperature_1_alarm.type = readTemperatureAlarmType(temperature_1_alarm_type);
                i += 1;
                if (hasTemperature(temperature_1_alarm_type)) {
                    decoded.temperature_1 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                    decoded.temperature_1_alarm.temperature = decoded.temperature_1;
                    i += 2;
                }
                if (hasTemperatureMutation(temperature_1_alarm_type)) {
                    decoded.temperature_1_alarm.temperature_mutation = readUInt16LE(bytes.slice(i, i + 2)) / 10;
                    i += 2;
                }
                break;
            case 0x12:
                var temperature_2_alarm_type = readUInt8(bytes[i]);
                decoded.temperature_2_alarm = {};
                decoded.temperature_2_alarm.type = readTemperatureAlarmType(temperature_2_alarm_type);
                i += 1;
                if (hasTemperature(temperature_2_alarm_type)) {
                    decoded.temperature_2 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                    decoded.temperature_2_alarm.temperature = decoded.temperature_2;
                    i += 2;
                }
                if (hasTemperatureMutation(temperature_2_alarm_type)) {
                    decoded.temperature_2_alarm.temperature_mutation = readUInt16LE(bytes.slice(i, i + 2)) / 10;
                    i += 2;
                }
                break;
            case 0x14:
                decoded.overcurrent_alarm = {};
                decoded.overcurrent_alarm.status = readOverCurrentAlarmType(bytes[i]);
                var current_1 = readUInt16LE(bytes.slice(i + 1, i + 3)) / 1000;
                var current_2 = readUInt16LE(bytes.slice(i + 3, i + 5)) / 1000;
                decoded.overcurrent_alarm.current_1 = current_1;
                decoded.overcurrent_alarm.current_2 = current_2;
                decoded.current_1 = current_1;
                decoded.current_2 = current_2;
                i += 5;
                break;
            case 0x15:
                decoded.switch_broken_alarm = {};
                decoded.switch_broken_alarm.socket_switch = readSocketSwitchBrokenStatus(bytes[i]);
                i += 1;
                break;
            case 0x16:
                decoded.device_bor_alarm = {};
                decoded.device_bor_alarm.status = readDeviceBorAlarm(bytes[i]);
                i += 1;
                break;

            // downlink: config
            case 0x60:
                var reporting_interval_time_unit = readUInt8(bytes[i]);
                decoded.reporting_interval = {};
                decoded.reporting_interval.unit = readTimeUnitType(reporting_interval_time_unit);
                if (reporting_interval_time_unit === 0) {
                    decoded.reporting_interval.seconds_of_time = readUInt16LE(bytes.slice(i + 1, i + 3));
                } else if (reporting_interval_time_unit === 1) {
                    decoded.reporting_interval.minutes_of_time = readUInt16LE(bytes.slice(i + 1, i + 3));
                }
                i += 3;
                break;
            case 0x61:
                decoded.temperature_unit = readTemperatureUnit(bytes[i]);
                i += 1;
                break;
            case 0x62:
                decoded.power_consumption_enable = readEnableStatus(bytes[i]);
                i += 1;
                break;
            case 0x63:
                decoded.led_indicator_mode = readEnableStatus(bytes[i]);
                i += 1;
                break;
            case 0x64:
                var button_lock_data = readUInt16LE(bytes.slice(i, i + 2));
                decoded.button_lock = {};
                decoded.button_lock.enable = readEnableStatus((button_lock_data >>> 0) & 0x01);
                i += 2;
                break;
            case 0x65:
                decoded.overcurrent_alarm_settings = {};
                decoded.overcurrent_alarm_settings.enable = readEnableStatus(bytes[i]);
                decoded.overcurrent_alarm_settings.threshold = readUInt8(bytes[i + 1]);
                i += 2;
                break;
            case 0x67:
                decoded.overcurrent_protection_settings = {};
                decoded.overcurrent_protection_settings.enable = readEnableStatus(bytes[i]);
                decoded.overcurrent_protection_settings.threshold = readUInt8(bytes[i + 1]);
                i += 2;
                break;
            case 0x69:
                decoded.high_current_protection_settings = {};
                decoded.high_current_protection_settings.enable = readEnableStatus(bytes[i]);
                i += 1;
                break;
            case 0x6A:
                decoded.temperature_alarm_settings = {};
                decoded.temperature_alarm_settings.enable = readEnableStatus(bytes[i]);
                decoded.temperature_alarm_settings.threshold_condition = readMathConditionType(readUInt8(bytes[i + 1]));
                decoded.temperature_alarm_settings.threshold_min = readInt16LE(bytes.slice(i + 2, i + 4)) / 10;
                decoded.temperature_alarm_settings.threshold_max = readInt16LE(bytes.slice(i + 4, i + 6)) / 10;
                i += 6;
                break;
            case 0x6B:
                decoded.temperature_alarm_release_enable = readEnableStatus(bytes[i]);
                i += 1;
                break;
            case 0x6C:
                decoded.alarm_reporting_interval = readUInt16LE(bytes.slice(i, i + 2));
                i += 2;
                break;
            case 0x6D:
                decoded.alarm_reporting_times = readUInt16LE(bytes.slice(i, i + 2));
                i += 2;
                break;
            case 0x6E:
                decoded.when_power_restored_switch_status = readPowerRestoredSwitchStatus(bytes[i]);
                i += 1;
                break;
            case 0x6F:
                decoded.bluetooth_name = readString(bytes.slice(i, i + 32));
                i += 32;
                break;
            case 0x71:
                decoded.temperature_1_calibration_settings = {};
                decoded.temperature_1_calibration_settings.enable = readEnableStatus(bytes[i]);
                decoded.temperature_1_calibration_settings.calibration_value = readInt16LE(bytes.slice(i + 1, i + 3)) / 10;
                i += 3;
                break;
            case 0x72:
                decoded.temperature_2_calibration_settings = {};
                decoded.temperature_2_calibration_settings.enable = readEnableStatus(bytes[i]);
                decoded.temperature_2_calibration_settings.calibration_value = readInt16LE(bytes.slice(i + 1, i + 3)) / 10;
                i += 3;
                break;
            case 0x7f:
                decoded.d2d_slave_enable = readEnableStatus(bytes[i]);
                i += 1;
                break;
            case 0x80:
                var d2d_slave_settings = {};
                d2d_slave_settings.index = readUInt8(bytes[i]) + 1;
                d2d_slave_settings.enable = readEnableStatus(bytes[i + 1]);
                d2d_slave_settings.command = readHexStringLE(bytes.slice(i + 2, i + 4));
                d2d_slave_settings.socket_switch = readTriggerSource(bytes[i + 4]);
                d2d_slave_settings.action = readTriggerAction(bytes[i + 5]);
                i += 6;
                decoded.d2d_slave_settings = decoded.d2d_slave_settings || [];
                decoded.d2d_slave_settings.push(d2d_slave_settings);
                break;
            case 0x81:
                var schedule_settings = {};
                schedule_settings.index = readUInt8(bytes[i]) + 1;
                schedule_settings.enable = readEnableStatus(bytes[i + 1]);
                schedule_settings.execution_time_point = readUInt16LE(bytes.slice(i + 2, i + 4));
                var schedule_weekday_bits_offset = { "execution_day_sun": 0, "execution_day_mon": 1, "execution_day_tues": 2, "execution_day_wed": 3, "execution_day_thu": 4, "execution_day_fri": 5, "execution_day_sat": 6 };
                for (var key in schedule_weekday_bits_offset) {
                    schedule_settings[key] = readEnableStatus((bytes[i + 4] >>> schedule_weekday_bits_offset[key]) & 0x01);
                }
                decoded.socket_switch = readTriggerSource(bytes[i + 5]);
                decoded.action = readTriggerAction(bytes[i + 6]);
                decoded.is_delete = readDeletedStatus(bytes[i + 7]);
                i += 8;
                decoded.schedule_settings = decoded.schedule_settings || [];
                decoded.schedule_settings.push(schedule_settings);
                break;
            case 0xc6:
                decoded.daylight_saving_time = {};
                decoded.daylight_saving_time.enable = readEnableStatus(bytes[i]);
                decoded.daylight_saving_time.offset = readUInt8(bytes[i + 1]);
                decoded.daylight_saving_time.start_month = readUInt8(bytes[i + 2]);
                var start_day_value = readUInt8(bytes[i + 3]);
                decoded.daylight_saving_time.start_week_num = (start_day_value >>> 4) & 0x07;
                decoded.daylight_saving_time.start_week_day = start_day_value & 0x0f;
                decoded.daylight_saving_time.start_hour_min = readUInt16LE(bytes.slice(i + 4, i + 6));
                decoded.daylight_saving_time.end_month = readUInt8(bytes[i + 6]);
                var end_day_value = readUInt8(bytes[i + 7]);
                decoded.daylight_saving_time.end_week_num = (end_day_value >>> 4) & 0x0f;
                decoded.daylight_saving_time.end_week_day = end_day_value & 0x0f;
                decoded.daylight_saving_time.end_hour_min = readUInt16LE(bytes.slice(i + 8, i + 10));
                i += 10;
                break;
            case 0xc7:
                decoded.time_zone = readInt16LE(bytes.slice(i, i + 2));
                i += 2;
                break;

            // downlink: service
            case 0x5E:
                decoded.socket_switch_clear_power_consumption = {};
                decoded.socket_switch_clear_power_consumption.socket_switch = readTriggerSource(bytes[i]);
                i += 1;
                break;
            case 0x5F:
                decoded.socket_switch_status_control = {};
                decoded.socket_switch_status_control.socket_switch = readTriggerSource(bytes[i]);
                decoded.socket_switch_status_control.status = readTriggerAction(bytes[i + 1]);
                i += 2;
                break;

            // control frame
            case 0xEF:
                var cmd_data = readUInt8(bytes[i]);
                var cmd_result = (cmd_data >>> 4) & 0x0f;
                var cmd_length = cmd_data & 0x0f;
                var cmd_id = readHexString(bytes.slice(i + 1, i + 1 + cmd_length));
                var cmd_header = readHexString(bytes.slice(i + 1, i + 2));
                i += 1 + cmd_length;

                var response = {};
                response.result = readCmdResult(cmd_result);
                response.cmd_id = cmd_id;
                response.cmd_name = readCmdName(cmd_header);

                decoded.request_result = decoded.request_result || [];
                decoded.request_result.push(response);
                break;
            case 0xFE:
                decoded.frame = readUInt8(bytes[i]);
                i += 1;
                break;
            default:
                unknown_command = 1;
                break;
        }

        if (unknown_command) {
            throw new Error("unknown command: " + command_id);
        }
    }

    return decoded;
}


function readProtocolVersion(bytes) {
    var major = bytes[0] & 0xff;
    var minor = bytes[1] & 0xff;
    return "v" + major + "." + minor;
}

function readHardwareVersion(bytes) {
    var major = bytes[0] & 0xff;
    var minor = bytes[1] & 0xff;
    return "v" + major + "." + minor;
}

function readFirmwareVersion(bytes) {
    var major = bytes[0] & 0xff;
    var minor = bytes[1] & 0xff;
    var release = bytes[2] & 0xff;
    var alpha = bytes[3] & 0xff;
    var unit_test = bytes[4] & 0xff;
    var test = bytes[5] & 0xff;

    var version = "v" + major + "." + minor;
    if (release !== 0) version += "-r" + release;
    if (alpha !== 0) version += "-a" + alpha;
    if (unit_test !== 0) version += "-u" + unit_test;
    if (test !== 0) version += "-t" + test;
    return version;
}

function readDeviceStatus(type) {
    var device_status_map = { 0: "off", 1: "on" };
    return getValue(device_status_map, type);
}

function readLoRaWANClass(type) {
    var lorawan_class_map = {
        0: "Class A",
        1: "Class B",
        2: "Class C",
        3: "Class CtoB",
    };
    return getValue(lorawan_class_map, type);
}

function readEnableStatus(type) {
    var enable_map = { 0: "disable", 1: "enable" };
    return getValue(enable_map, type);
}

function readDeletedStatus(type) {
    var deleted_map = { 0: "no delete", 1: "is delete" };
    return getValue(deleted_map, type);
}

function readOnOffStatus(type) {
    var on_off_map = { 0: "off", 1: "on" };
    return getValue(on_off_map, type);
}

function readTemperatureAlarmType(type) {
    var temperature_alarm_type_map = {
        0: "collection error",                              // 0x00
        1: "lower range error",                             // 0x01
        2: "over range error",                              // 0x02
        16: "threshold temperature alarm release",          // 0x10
        17: "threshold temperature alarm",                  // 0x11
        33: "burning alarm",                                // 0x21 
    };
    return getValue(temperature_alarm_type_map, type);
}

function hasTemperature(alarm_type) {
    var has_temperature_alarm_list = [0x10, 0x11, 0x21];
    return has_temperature_alarm_list.indexOf(alarm_type) !== -1;
}

function hasTemperatureMutation(alarm_type) {
    var has_temperature_mutation_list = [0x21];
    return has_temperature_mutation_list.indexOf(alarm_type) !== -1;
}

function readOverCurrentAlarmType(type) {
    var type_map = { 0: "normal", 1: "over current" };
    return getValue(type_map, type);
}

function readSocketSwitchBrokenStatus(type) {
    var type_map = { 0: "normal", 1: "socket1", 2: "socket2", 3: "all socket" };
    return getValue(type_map, type);
}

function readTriggerSource(type) {
    var type_map = { 0: "socket1", 1: "socket2", 2: "all socket" };
    return getValue(type_map, type);
}

function readTriggerAction(type) {
    var type_map = { 0: "off", 1: "on", 2: "reverse" };
    return getValue(type_map, type);
}

function readDeviceBorAlarm(type) {
    var type_map = { 0: "normal", 1: "device bor" };
    return getValue(type_map, type);
}

function readTimeUnitType(type) {
    var type_map = { 0: "second", 1: "minute" };
    return getValue(type_map, type);
}

function readTemperatureUnit(type) {
    var type_map = { 0: "℃", 1: "℉" };
    return getValue(type_map, type);
}

function readMathConditionType(type) {
    var type_map = { 0: "disable", 1: "below", 2: "above", 3: "between", 4: "outside" };
    return getValue(type_map, type);
}

function readPowerRestoredSwitchStatus(type) {
    var type_map = { 0: "keep", 1: "off", 2: "on" };
    return getValue(type_map, type);
}

function readCmdResult(type) {
    var result_map = { 0: "success", 1: "parsing error", 2: "order error", 3: "password error", 4: "read params error", 5: "write params error", 6: "read execution error", 7: "write execution error", 8: "read apply error", 9: "write apply error", 10: "associative error" };
    return getValue(result_map, type);
}

function readCmdName(type) {
    var name_map = {
        "60": { "level": 1, "name": "collection_interval" },
        "61": { "level": 1, "name": "temperature_unit" },
        "62": { "level": 1, "name": "power_consumption_enable" },
        "63": { "level": 1, "name": "led_indicator_mode" },
        "64": { "level": 1, "name": "button_lock" },
        "65": { "level": 1, "name": "overcurrent_alarm_settings" },
        "67": { "level": 1, "name": "overcurrent_protection_settings" },
        "69": { "level": 1, "name": "high_current_protection_settings" },
        "6A": { "level": 1, "name": "temperature_alarm_settings" },
        "6B": { "level": 1, "name": "temperature_alarm_release_enable" },
        "6C": { "level": 1, "name": "alarm_reporting_interval" },
        "6D": { "level": 1, "name": "alarm_reporting_times" },
        "6E": { "level": 1, "name": "when_power_restored_switch_status" },
        "6F": { "level": 1, "name": "bluetooth_name" },
        "71": { "level": 1, "name": "temperature_1_calibration_settings" },
        "72": { "level": 1, "name": "temperature_2_calibration_settings" },
        "7F": { "level": 1, "name": "d2d_slave_enable" },
        "80": { "level": 2, "name": "d2d_slave_settings" },
        "81": { "level": 2, "name": "schedule_settings" },
        "C6": { "level": 1, "name": "daylight_saving_time" },
        "C7": { "level": 1, "name": "time_zone" },
    }

    var data = name_map[type];
    if (data === undefined) return "unknown";
    return data.name;
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

function readFloat16LE(bytes) {
    var bits = (bytes[1] << 8) | bytes[0];
    var sign = bits >>> 15 === 0 ? 1.0 : -1.0;
    var e = (bits >>> 10) & 0x1f;
    var m = e === 0 ? (bits & 0x3ff) << 1 : (bits & 0x3ff) | 0x400;
    var f = sign * m * Math.pow(2, e - 25);

    var n = Number(f.toFixed(2));
    return n;
}

function readFloatLE(bytes) {
    var bits = (bytes[3] << 24) | (bytes[2] << 16) | (bytes[1] << 8) | bytes[0];
    var sign = bits >>> 31 === 0 ? 1.0 : -1.0;
    var e = (bits >>> 23) & 0xff;
    var m = e === 0 ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
    var f = sign * m * Math.pow(2, e - 150);
    return f;
}

function readString(bytes) {
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

function readHexString(bytes) {
    var temp = [];
    for (var idx = 0; idx < bytes.length; idx++) {
        temp.push(("0" + (bytes[idx] & 0xff).toString(16)).slice(-2));
    }
    return temp.join("");
}

function readHexStringLE(bytes) {
    var temp = [];
    for (var idx = bytes.length - 1; idx >= 0; idx--) {
        temp.push(("0" + (bytes[idx] & 0xff).toString(16)).slice(-2));
    }
    return temp.join("");
}

function getValue(map, key) {
    if (RAW_VALUE) return key;
    var value = map[key];
    if (!value) value = "unknown";
    return value;
}
