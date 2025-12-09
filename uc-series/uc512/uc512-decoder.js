/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product UC511 / UC512
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
        // VALVE 1
        else if (channel_id === 0x03 && channel_type == 0x01) {
            var valve_value = readUInt8(bytes[i]);
            if (valve_value === 0xff) {
                decoded.valve_1_result = readDelayControlResult(1);
            } else {
                decoded.valve_1 = readValveStatus(valve_value);
            }
            i += 1;
        }
        // VALVE 2
        else if (channel_id === 0x05 && channel_type == 0x01) {
            var valve_value = readUInt8(bytes[i]);
            if (valve_value === 0xff) {
                decoded.valve_2_result = readDelayControlResult(1);
            } else {
                decoded.valve_2 = readValveStatus(valve_value);
            }
            i += 1;
        }
        // VALVE 1 Pulse
        else if (channel_id === 0x04 && channel_type === 0xc8) {
            decoded.valve_1_pulse = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // VALVE 2 Pulse
        else if (channel_id === 0x06 && channel_type === 0xc8) {
            decoded.valve_2_pulse = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // GPIO 1 (hardware_version >= v2.0 and firmware_version >= v2.4)
        else if (channel_id === 0x07 && channel_type == 0x01) {
            decoded.gpio_1 = readGpioStatus(bytes[i]);
            i += 1;
        }
        // GPIO 2 (hardware_version >= v2.0 and firmware_version >= v2.4)
        else if (channel_id === 0x08 && channel_type == 0x01) {
            decoded.gpio_2 = readGpioStatus(bytes[i]);
            i += 1;
        }
        // PRESSURE (hardware_version >= v4.0 and firmware_version >= v1.2)
        else if (channel_id === 0x09 && channel_type === 0x7b) {
            decoded.pressure = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // PRESSURE FAILED (hardware_version >= v4.0 and firmware_version >= v1.2)
        else if (channel_id === 0xb9 && channel_type === 0x7b) {
            decoded.pressure_sensor_status = readSensorStatus(bytes[i]);
            i += 1;
        }
        // CUSTOM MESSAGE (hardware_version >= v4.0 and firmware_version >= v1.1)
        else if (channel_id === 0xff && channel_type === 0x12) {
            decoded.custom_message = readAscii(bytes.slice(i, bytes.length));
            i = bytes.length;
        }
        // HISTORY (hardware_version >= v3.0 and firmware_version >= v3.1)
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var timestamp = readUInt32LE(bytes.slice(i, i + 4));
            var value = bytes[i + 4];
            var status = readValveStatus(value & 0x01);
            var mode_value = (value >> 1) & 0x01;
            var mode = readValveMode(mode_value);
            var gpio = readGpioStatus((value >> 2) & 0x01);
            var index = ((value >> 4) & 0x01) === 0 ? 1 : 2;
            var pulse = readUInt32LE(bytes.slice(i + 5, i + 9));

            var data = { timestamp: timestamp, mode: mode };
            // GPIO mode
            if (mode_value === 0) {
                data["valve_" + index] = status;
                data["gpio_" + index] = gpio;
            }
            // Counter mode
            else if (mode_value === 1) {
                data["valve_" + index] = status;
                data["valve_" + index + "_pulse"] = pulse;
            }
            i += 9;
            decoded.history = decoded.history || [];
            decoded.history.push(data);
        }
        // HISTORY PIPE PRESSURE (hardware_version >= v4.0 & firmware_version >= v1.1)
        else if (channel_id === 0x21 && channel_type === 0xce) {
            var data = {};
            data.timestamp = readUInt32LE(bytes.slice(i, i + 4));
            data.pressure = readUInt16LE(bytes.slice(i + 4, i + 6));
            i += 6;
            decoded.history = decoded.history || [];
            decoded.history.push(data);
        }
        // DOWNLINK RESPONSE
        else if (channel_id === 0xfe || channel_id === 0xff) {
            var result = handle_downlink_response(channel_type, bytes, i);
            decoded = Object.assign(decoded, result.data);
            i = result.offset;
        }
        // PRESSURE THRESHOLD ALARM
        // hardware_version >= v4.0
        else if (channel_id === 0x0b && channel_type === 0xf5) {
            decoded.pressure_threshold_alarm = readPressureThresholdAlarm(bytes.slice(i, i + 9));
            i += 9;
        }
        // LORAWAN CLASS SWITCH RESPONSE
        // hardware_version >= v4.0
        else if (channel_id === 0xf8 && channel_type === 0xa4) {
            decoded.lorawan_class_switch_response = readLoRaWANClassSwitchResponse(bytes.slice(i, i + 8));
            i += 8;
        }
        // QUERY VALVE TASK STATUS RESPONSE
        // hardware_version >= v4.0
        else if (channel_id === 0xf8 && channel_type === 0xa5) {
            decoded.query_valve_task_status_response = readQueryValveTaskStatusResponse(bytes.slice(i, i + 2));
            i += 2;
        }
        else if (channel_id === 0xf8 && channel_type === 0xa8) { 
            decoded.set_ai_collection_config_response = readSetAICollectionConfigResponse(bytes.slice(i, i + 9));
            i += 9;
        }
        // SCHEDULE DEVICE CONFIG RESPONSE
        // hardware_version >= v4.0
        else if (channel_id === 0xf9 && channel_type === 0xa7) {
            decoded.schedule_device_config_response = readScheduleDeviceConfigResponse(bytes.slice(i, i + 3));
            i += 3;
        }
        // SET AI COLLECTION CONFIG
        // hardware_version >= v4.0
        else if (channel_id === 0xf9 && channel_type === 0xa8) {
            decoded.set_ai_collection_config = readSetAICollectionConfig(bytes.slice(i, i + 8));
            i += 8;
        }
        // VALVE 1 TASK STATUS
        // hardware_version >= v4.0
        else if (channel_id === 0x0e && channel_type === 0xaf) {
            decoded.valve_1_task_status = readValveTaskStatus(bytes.slice(i, i + 3));
            i += 3;
        }
        // VALVE 2 TASK STATUS
        // hardware_version >= v4.0
        else if (channel_id === 0x0f && channel_type === 0xaf) {
            decoded.valve_2_task_status = readValveTaskStatus(bytes.slice(i, i + 3));
            i += 3;
        }
        // READ SCHEDULE CONFIG RESPONSE
        else if (channel_id === 0xf8 && channel_type === 0xaf) {
            decoded.read_schedule_config_response = readReadScheduleConfigResponse(bytes.slice(i, i + 3));
            i += 3;
        }
        // MULTICAST COMMAND RESPONSE
        else if (channel_id === 0xf0) {
            decoded.multicast_command_response = readMulticastCommandResponse(bytes.slice(i + 1, i + 10));
            i += 10;
        } else {
            break;
        }
    }

    return decoded;
}

function readPressureAlarmType(bytes) {
    var alarm_map = {
        0: "release alarm",
        1: "trigger alarm",
    };
    return getValue(alarm_map, bytes);
}

function readPressureThresholdAlarm(bytes) {
    var alarm = {};
    alarm.valve_strategy = readValveStrategy(readUInt8(bytes[0]));
    alarm.threshold_type = readMathConditionType(readUInt8(bytes[1]));
    alarm.threshold_min = readUInt16LE(bytes.slice(2, 4));
    alarm.threshold_max = readUInt16LE(bytes.slice(4, 6));
    alarm.current_pressure = readUInt16LE(bytes.slice(6, 8));
    alarm.alarm_status = readPressureAlarmType(readUInt8(bytes[8]));
    return alarm;
}

function readLoRaWANClassSwitchResponseCode(code) {
    var code_map = {
        0: "success",
        1: "not allowed",
        2: "invalid parameter",
        16: "continuous is 0, the device does not support", 
        17: "continuous is greater than the maximum allowed by the device",
        18: "instruction expired (start time + continuous <= current time)",
        255: "other error",
    };
    return getValue(code_map, code);
}

function readLoRaWANClassSwitchResponse(bytes) {
    var response = {};
    response.timestamp = readUInt32LE(bytes.slice(0, 4));
    response.continuous = readUInt16LE(bytes.slice(4, 6));
    response.class_type = readLoRaWANClassType(readUInt8(bytes[6]));
    response.reserved = readUInt8(bytes[7]);
    response.response_status = readLoRaWANClassSwitchResponseCode(readUInt8(bytes[8]));
    return response;
}

function readQueryValveTaskStatusResponseCode(code) {
    var code_map = {
        0: "success",
        1: "not allowed",
        2: "valve index out of range",
    };
    return getValue(code_map, code);
}

function readValveIndex(index) {
    var index_map = {
        0: "valve 1",
        1: "valve 2",
    };
    return getValue(index_map, index);
}

function readQueryValveTaskStatusResponse(bytes) {
    var response = {};
    response.valve_index = readValveIndex(readUInt8(bytes[0]));
    response.code = readQueryValveTaskStatusResponseCode(readUInt8(bytes[1]));
    return response;
}

function readScheduleDeviceConfigResponseCode(code) {
    var code_map = {
        0: "schedule command executed successfully",
        1: "schedule task not found",
        2: "schedule command expired",
        3: "schedule command time invalid",
        4: "Lora channel parameter invalid",
        5: "Lora frequency parameter invalid",
        6: "unsupported parameter",
        7: "schedule time not reached",
        8: "task storage memory not enough",
        9: "schedule task already exists",
        255: "other error",
    };
    return getValue(code_map, code);
}
function readScheduleDeviceConfigResponse(bytes) {
    var response = {};
    response.id = readUInt8(bytes[0]);
    response.type = readUInt8(bytes[1]);
    response.code = readScheduleDeviceConfigResponseCode(readUInt8(bytes[2]));
    return response;
}

function readSetAICollectionConfigResponseCode(code) {
    var code_map = { 0: "success", 1: "failed" };
    return getValue(code_map, code);
}

function readSetAICollectionConfigResponse(bytes) {
    var response = {};
    response.id = readUInt8(bytes[0]);
    response.enable = readEnableStatus(readUInt8(bytes[1]));
    response.collect_nonirrigation = readUInt16LE(bytes.slice(2, 4));
    response.collect_irrigation = readUInt16LE(bytes.slice(4, 6));
    response.open_delay_collect_time = readUInt8(bytes[6]);
    response.code = readSetAICollectionConfigResponseCode(readUInt8(bytes[7]));
    return response;
}

function readSetAICollectionConfig(bytes) {
    var response = {};
    response.id = readUInt8(bytes[0]);
    response.enable = readEnableStatus(readUInt8(bytes[1]));
    response.collect_nonirrigation = readUInt16LE(bytes.slice(2, 4));
    response.collect_irrigation = readUInt16LE(bytes.slice(4, 6));
    response.open_delay_collect_time = readUInt8(bytes[6]);
    return response;
}

function readTaskStatus(status) {
    var status_map = {
        0: "free task",
        1: "normal local plan",
        2: "force local plan",
        3: "rain stop plan",
        4: "IPSO temporary control plan"
    };
    return getValue(status_map, status);
}

function readRealStatus(status) {
    var status_map = {
        0: "valve is currently closed",
        1: "valve is currently open",
    };
    return getValue(status_map, status);
}

function readCommandStatus(status) {
    var status_map = {
        0: "valve is currently commanded to close",
        1: "valve is currently commanded to open",
    };
    return getValue(status_map, status);
}

function readValveTaskStatus(bytes) {
    var status = {};
    status.task_status = readTaskStatus(readUInt8(bytes[0]));
    status.real_status = readRealStatus(readUInt8(bytes[1]));
    status.cmd_status = readCommandStatus(readUInt8(bytes[2]));
    return status;
}

function readReadScheduleConfigResponseCode(code) {
    var code_map = {
        0: "success",
        1: "not allowed",
        2: "schedule task not found",
    };
    return getValue(code_map, code);
}

function readReadScheduleConfigResponse(bytes) {
    var response = {};
    response.id = readUInt8(bytes[0]);
    response.type = readUInt8(bytes[1]);
    response.code = readReadScheduleConfigResponseCode(readUInt8(bytes[2]));
    return response;
}

function readMulticastCommandResponseCode(code) {
    var code_map = {
        0: "execute successfully",
        1: "not allowed",
        2: "service not supported",
        255: "other error",
    };
    return getValue(code_map, code);
}

function readMulticastCommandResponse(bytes) {
    var response = {};
    response.EUI = bytesToHexString(bytes.slice(0, 8));
    response.code = readMulticastCommandResponseCode(readUInt8(bytes[9]));
    return response;
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
        case 0x17:
            decoded.time_zone = readTimeZone(readInt16LE(bytes.slice(offset, offset + 2)));
            offset += 2;
            break;
        case 0x1d:
            var data = readUInt8(bytes[offset]);
            var bit0 = ((data >> 0) & 0x01);
            var bit1 = ((data >> 1) & 0x01);
            var bit2 = ((data >> 2) & 0x01);
            var bit3 = ((data >> 3) & 0x01);
            var bit4 = ((data >> 4) & 0x01);
            var index = bit0 + bit1 * 2 + bit2 * 4;
            var valve_status_value = (data >> 5) & 0x01;
            var time_rule_enable_value = (data >> 7) & 0x01;
            var pulse_rule_enable_value = (data >> 6) & 0x01;
            var special_task_mode_value = bit3 ^ bit4;
            var valve_name = index === 7 ? "valve_all_task" : "valve_" + (index + 1) + "_task";

            decoded[valve_name] = {};
            decoded[valve_name].time_rule_enable = readEnableStatus(time_rule_enable_value);
            decoded[valve_name].pulse_rule_enable = readEnableStatus(pulse_rule_enable_value);
            decoded[valve_name].valve_status = readValveStatus(valve_status_value);
            decoded[valve_name].special_task_mode = readSpecialTaskMode(special_task_mode_value);
            decoded[valve_name].sequence_id = readUInt8(bytes[offset + 1]);
            offset += 2;
    
            if (special_task_mode_value === 1) {
                decoded[valve_name].duration = readUInt32LE(bytes.slice(offset, offset + 4));
                decoded[valve_name].start_time = readUInt32LE(bytes.slice(offset + 4, offset + 8));
                offset += 8;
            } else if (time_rule_enable_value === 1) {
                decoded[valve_name].duration = readUInt32LE(bytes.slice(offset, offset + 4));
                offset += 4;
            } else if (pulse_rule_enable_value === 1) {
                decoded[valve_name].valve_pulse = readUInt32LE(bytes.slice(offset, offset + 4));
                offset += 4;
            }
            break;
        case 0x1e:
            decoded.class_a_response_time = readUInt32LE(bytes.slice(offset, offset + 4));
            offset += 4;
            break;
        case 0x27:
            decoded.clear_history = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x28:
            decoded.report_status = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x35:
            decoded.d2d_key = bytesToHexString(bytes.slice(offset, offset + 8));
            offset += 8;
            break;
        case 0x3b:
            decoded.sync_time_type = readSyncTimeType(bytes[offset]);
            offset += 1;
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
        case 0x4c:
            var rule_index = readUInt8(bytes[offset]);
            var rule_index_name = "rule_" + rule_index;
            decoded.query_rule_config = decoded.query_rule_config || {};
            decoded.query_rule_config[rule_index_name] = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x4d:
            var rule_config = {};
            rule_config.id = readUInt8(bytes[offset]);
            var data = readUInt8(bytes[offset + 1]);
            rule_config.enable = readEnableStatus((data >> 7) & 0x01);
            rule_config.valve_status = readValveStatus((data >> 6) & 0x01);
            rule_config.valve_2_enable = readEnableStatus((data >> 1) & 0x01);
            rule_config.valve_1_enable = readEnableStatus((data >> 0) & 0x01);
            rule_config.start_hour = readUInt8(bytes[offset + 2]);
            rule_config.start_min = readUInt8(bytes[offset + 3]);
            rule_config.end_hour = readUInt8(bytes[offset + 4]);
            rule_config.end_min = readUInt8(bytes[offset + 5]);
            offset += 6;
            decoded.rules_config = decoded.rules_config || [];
            decoded.rules_config.push(rule_config);
            break;
        case 0x4e:
            var valve_index = readUInt8(bytes[offset]);
            var valve_index_name = "clear_valve_" + valve_index + "_pulse";
            // ignore the next byte
            decoded[valve_index_name] = readYesNoStatus(1);
            offset += 2;
            break;
        case 0x4f:
            decoded.valve_power_supply_config = {};
            decoded.valve_power_supply_config.counts = readUInt8(bytes[offset]);
            decoded.valve_power_supply_config.control_pulse_time = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            decoded.valve_power_supply_config.power_time = readUInt16LE(bytes.slice(offset + 3, offset + 5));
            offset += 5;
            break;
        case 0x52:
            // ignore first byte
            decoded.pulse_filter_config = {};
            decoded.pulse_filter_config.mode = readPulseFilterMode(bytes[offset + 1]);
            decoded.pulse_filter_config.time = readUInt16LE(bytes.slice(offset + 2, offset + 4));
            offset += 4;
            break;
        case 0x53:
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
        case 0x68:
            decoded.history_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x69:
            decoded.retransmit_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x6a:
            var mode_value = readUInt8(bytes[offset]);
            if (mode_value === 0x00) {
                decoded.retransmit_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
                offset += 3;
            } else if (mode_value === 0x01) {
                decoded.resend_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
                offset += 3;
            }
            break;
        case 0x84:
            decoded.d2d_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x92:
            var index = readUInt8(bytes[offset]);
            var valve_name = "valve_" + index + "_pulse";
            decoded[valve_name] = readUInt32LE(bytes.slice(offset + 1, offset + 5));
            offset += 5;
            break;
        case 0xab:
            decoded.pressure_calibration_settings = {};
            decoded.pressure_calibration_settings.enable = readEnableStatus(bytes[offset]);
            decoded.pressure_calibration_settings.calibration_value = readInt16LE(bytes.slice(offset + 1, offset + 3));
            offset += 3;
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

function readLoRaWANClassType(type) {
    var class_map = {
        0: "Class A",
        1: "Class B",
        2: "Class C",
        3: "Class CtoB",
        255: "cancel",
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

function readValveStatus(status) {
    var status_map = { 0: "close", 1: "open" };
    return getValue(status_map, status);
}

function readDelayControlResult(value) {
    var result_map = { 0: "success", 1: "failed" };
    return getValue(result_map, value);
}

function readSensorStatus(value) {
    var status_map = { 1: "sensor error" };
    return getValue(status_map, value);
}

function readValveMode(value) {
    var mode_map = { 0: "counter", 1: "gpio" };
    return getValue(mode_map, value);
}

function readGpioStatus(status) {
    var status_map = { 0: "off", 1: "on" };
    return getValue(status_map, status);
}

function readEnableStatus(status) {
    var status_map = { 0: "disable", 1: "enable" };
    return getValue(status_map, status);
}

function readYesNoStatus(status) {
    var status_map = { 0: "no", 1: "yes" };
    return getValue(status_map, status);
}

function readTimeZone(time_zone) {
    var timezone_map = { "-120": "UTC-12", "-110": "UTC-11", "-100": "UTC-10", "-95": "UTC-9:30", "-90": "UTC-9", "-80": "UTC-8", "-70": "UTC-7", "-60": "UTC-6", "-50": "UTC-5", "-40": "UTC-4", "-35": "UTC-3:30", "-30": "UTC-3", "-20": "UTC-2", "-10": "UTC-1", 0: "UTC", 10: "UTC+1", 20: "UTC+2", 30: "UTC+3", 35: "UTC+3:30", 40: "UTC+4", 45: "UTC+4:30", 50: "UTC+5", 55: "UTC+5:30", 57: "UTC+5:45", 60: "UTC+6", 65: "UTC+6:30", 70: "UTC+7", 80: "UTC+8", 90: "UTC+9", 95: "UTC+9:30", 100: "UTC+10", 105: "UTC+10:30", 110: "UTC+11", 120: "UTC+12", 127: "UTC+12:45", 130: "UTC+13", 140: "UTC+14" };
    return getValue(timezone_map, time_zone);
}

function readSyncTimeType(type) {
    var type_map = { 1: "v1.0.2", 2: "v1.0.3", 3: "v1.1.0" };
    return getValue(type_map, type);
}

function readPulseFilterMode(mode) {
    var mode_map = { 1: "hardware", 2: "software" };
    return getValue(mode_map, mode);
}

function readRuleCondition(bytes) {
    var condition = {};

    var offset = 0;
    var condition_type_value = readUInt8(bytes[offset]);
    condition.type = readNewConditionType(condition_type_value);
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
            condition.source = readValveStrategy(readUInt8(bytes[offset + 1]));
            condition.mode = readMathConditionType(readUInt8(bytes[offset + 2]));
            condition.threshold_min = readUInt16LE(bytes.slice(offset + 3, offset + 5));
            condition.threshold_max = readUInt16LE(bytes.slice(offset + 5, offset + 7));
            break;
    }
    return condition;
}

function getRepeatMode(repeat_mode_value) {
    var repeat_mode_map = { 0: "monthly", 1: "daily", 2: "weekly" };
    return getValue(repeat_mode_map, repeat_mode_value);
}

function readWeekday(weekday_value) {
    var weekday_bit_offset = { monday: 0, tuesday: 1, wednesday: 2, thursday: 3, friday: 4, saturday: 5, sunday: 6 };

    var weekday = {};
    for (var key in weekday_bit_offset) {
        weekday[key] = readEnableStatus((weekday_value >>> weekday_bit_offset[key]) & 0x01);
    }
    return weekday;
}

function readNewConditionType(condition_type_value) {
    var condition_type_map = { 0: "none", 1: "time", 2: "d2d", 3: "time_or_pulse_threshold", 4: "pulse_threshold", 5: "pressure_threshold" };
    return getValue(condition_type_map, condition_type_value);
}

function readValveStrategy(strategy_value) {
    var valve_strategy_map = { 0: "always", 1: "valve 1 open", 2: "valve 2 open", 3: "valve 1 open or valve 2 open" };
    return getValue(valve_strategy_map, strategy_value);
}

function readMathConditionType(condition_type_value) {
    var condition_type_map = { 0: "none", 1: "less than", 2: "greater than", 3: "between", 4: "outside" };
    return getValue(condition_type_map, condition_type_value);
}

function readRuleAction(bytes) {
    var action_type_map = { 0: "none", 1: "em_valve_control", 2: "valve_control", 3: "report" };

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
            action.reserved = readUInt8(bytes[offset + 10]);
            action.continue_count = readUInt8(bytes[offset + 11]);
            action.release_enable = readEnableStatus(bytes[offset + 12]);
            break;
    }
    return action;
}

function readReportType(report_type_value) {
    var report_type_map = { 1: "valve_1", 2: "valve_2", 3: "custom_message", 4: "threshold_alarm" };
    return getValue(report_type_map, report_type_value);
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

function readUInt24LE(bytes) {
    var value = (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
    return value & 0xffffff;
}

function readInt24LE(bytes) {
    var ref = readUInt24LE(bytes);
    return ref > 0x7fffff ? ref - 0x1000000 : ref;
}

function readUInt32LE(bytes) {
    var value = (bytes[3] << 24) + (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
    return (value & 0xffffffff) >>> 0;
}

function readInt32LE(bytes) {
    var ref = readUInt32LE(bytes);
    return ref > 0x7fffffff ? ref - 0x100000000 : ref;
}

function readAscii(bytes) {
    var str = "";
    for (var i = 0; i < bytes.length; i++) {
        if (bytes[i] === 0) {
            continue;
        }
        str += String.fromCharCode(bytes[i]);
    }
    return str;
}

function readD2DCommand(bytes) {
    return ("0" + (bytes[1] & 0xff).toString(16)).slice(-2) + ("0" + (bytes[0] & 0xff).toString(16)).slice(-2);
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
