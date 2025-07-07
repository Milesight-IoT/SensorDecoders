/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product UC100 v2
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
        // MODBUS
        else if (channel_id === 0xf9 && channel_type === 0x73) {
            var value_1 = readUInt8(bytes[i]);
            var value_2 = readUInt8(bytes[i + 1]);
            i += 2;

            var modbus_chn_id = (value_1 & 0x3f) + 1;
            var modbus_alarm_value = (value_1 >>> 6) & 0x03;
            var sign = (value_2 >>> 7) & 0x01;
            var reg_offset = (value_2 >>> 5) & 0x03;
            var data_type = value_2 & 0x1f;

            var value = 0;
            switch (data_type) {
                case 0:
                case 1:
                    value = readOnOffStatus(bytes[i]);
                    i += 1;
                    break;
                case 2:
                case 3:
                    value = sign ? readInt16LE(bytes.slice(i, i + 2)) : readUInt16LE(bytes.slice(i, i + 2));
                    i += 2;
                    break;
                case 4:
                case 6:
                    value = sign ? readInt32LE(bytes.slice(i, i + 4)) : readUInt32LE(bytes.slice(i, i + 4));
                    i += 4;
                    break;
                case 8:
                case 9:
                case 10:
                case 11:
                    value = sign ? readInt16LE(bytes.slice(i, i + 2)) : readUInt16LE(bytes.slice(i, i + 2));
                    i += 4;
                    break;
                case 5:
                case 7:
                    value = readFloatLE(bytes.slice(i, i + 4));
                    i += 4;
                    break;
                case 12:
                case 14:
                    value = sign ? readInt64LE(bytes.slice(i, i + 8)) : readUInt64LE(bytes.slice(i, i + 8));
                    i += 8;
                    break;
                case 13:
                case 15:
                    value = readDoubleLE(bytes.slice(i, i + 8));
                    i += 8;
                    break;
            }
            var modbus_chn_name = "modbus_chn_" + modbus_chn_id;
            var modbus_chn_reg_name = modbus_chn_name + "_reg_" + (reg_offset + 1);
            decoded[modbus_chn_reg_name] = value;
            if (hasAlarm(modbus_alarm_value)) {
                var event = {};
                event[modbus_chn_reg_name] = value;
                event[modbus_chn_reg_name + "_alarm"] = readModbusAlarmType(modbus_alarm_value);
                decoded.event = decoded.event || [];
                decoded.event.push(event);
            }
        }
        // MODBUS READ ERROR
        else if (channel_id === 0xff && channel_type === 0x15) {
            var modbus_chn_id = readUInt8(bytes[i]) + 1;
            var channel_name = "modbus_chn_" + modbus_chn_id + "_alarm";
            decoded[channel_name] = readSensorStatus(1);
            i += 1;
        }
        // MODBUS MUTATION
        else if (channel_id === 0xf9 && channel_type === 0x74) {
            var chn_def = readUInt8(bytes[i]);
            var modbus_chn_id = (chn_def & 0x3f) + 1;
            var reg_offset = (chn_def >>> 6) & 0x03;
            var modbus_chn_name = "modbus_chn_" + modbus_chn_id;
            var modbus_chn_reg_name = modbus_chn_name + "_reg_" + (reg_offset + 1) + "_mutation";
            decoded[modbus_chn_reg_name] = readDoubleLE(bytes.slice(i + 1, i + 9));
            i += 9;
        }
        // MODBUS HISTORY
        else if (channel_id === 0x21 && channel_type === 0xce) {
            var timestamp = readUInt32LE(bytes.slice(i, i + 4));
            var modbus_chn_id = readUInt8(bytes[i + 4]) + 1;
            var data_def = readUInt16LE(bytes.slice(i + 5, i + 7));
            var sign = (data_def >>> 15) & 0x01;
            var reg_type = (data_def >>> 9) & 0x3f;
            var read_status = (data_def >>> 8) & 0x01;
            var reg_counts = (data_def >>> 6) & 0x03;
            var event_type = (data_def >>> 4) & 0x03;
            var modbus_chn_name = "modbus_chn_" + modbus_chn_id;

            var data = {};
            data.timestamp = timestamp;
            if (read_status === 1) {
                data[modbus_chn_name + "_reg_1"] = readModbusHistoryV2(reg_type, sign, bytes.slice(i + 7, i + 15));
                if (reg_counts === 2) {
                    data[modbus_chn_name + "_reg_2"] = readModbusHistoryV2(reg_type, sign, bytes.slice(i + 15, i + 23));
                }
                data[modbus_chn_name + "_alarm"] = readModbusAlarmType(event_type);
            } else {
                data[modbus_chn_name + "_alarm"] = readSensorStatus(1);
            }
            i += 23;

            decoded.history = decoded.history || [];
            decoded.history.push(data);
        }
        // CUSTOM MESSAGE HISTORY
        else if (channel_id === 0x21 && channel_type === 0xcd) {
            var timestamp = readUInt32LE(bytes.slice(i, i + 4));
            var msg_length = bytes[i + 4];
            var msg = readAscii(bytes.slice(i + 5, i + 5 + msg_length));
            i += 5 + msg_length;

            var data = {};
            data.timestamp = timestamp;
            data.custom_message = msg;

            decoded.history = decoded.history || [];
            decoded.history.push(data);
        }
        // DOWNLINK RESPONSE
        else if (channel_id === 0xfe || channel_id === 0xff) {
            var result = handle_downlink_response(channel_type, bytes, i);
            decoded = Object.assign(decoded, result.data);
            i = result.offset;
        }
        // DOWNLINK RESPONSE
        else if (channel_id === 0xf8 || channel_id === 0xf9) {
            var result = handle_downlink_response_ext(channel_id, channel_type, bytes, i);
            decoded = Object.assign(decoded, result.data);
            i = result.offset;
        }
        // HISTORY RESPONSE
        else if (channel_id === 0xfc) {
            i += 1;
        }
        // CUSTOM MESSAGE
        else {
            decoded.custom_message = readAscii(bytes.slice(i - 2, bytes.length));
            i = bytes.length;
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
        case 0x04:
            decoded.confirm_mode_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x10:
            decoded.reboot = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x27:
            decoded.clear_history = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x28:
            decoded.report_status = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x4a:
            decoded.sync_time = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x68:
            decoded.history_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x69:
            decoded.retransmit_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0xbd:
            decoded.timezone = readTimeZone(readInt16LE(bytes.slice(offset, offset + 2)));
            offset += 2;
            break;
        case 0xef:
            var data = bytes[offset];
            if (data === 0x00) {
                var channel_id = bytes[offset + 1];
                var remove_modbus_channels = { channel_id: channel_id };
                decoded.remove_modbus_channels = decoded.remove_modbus_channels || [];
                decoded.remove_modbus_channels.push(remove_modbus_channels);
                offset += 4;
            } else if (data === 0x01) {
                var modbus_channels = readModbusChannels(bytes.slice(offset + 1, offset + 7));
                decoded.modbus_channels = decoded.modbus_channels || [];
                decoded.modbus_channels.push(modbus_channels);
                offset += 7;
            } else if (data === 0x02) {
                var channel_id = bytes[offset + 1];
                var length = bytes[offset + 2];
                var name = readAscii(bytes.slice(offset + 3, offset + 3 + length));
                var modbus_channels_name = { channel_id: channel_id, name: name };
                decoded.modbus_channels_name = decoded.modbus_channels_name || [];
                decoded.modbus_channels_name.push(modbus_channels_name);
                offset += 3 + length;
            }
            break;
        default:
            throw new Error("unknown downlink response");
    }

    return { data: decoded, offset: offset };
}

function handle_downlink_response_ext(code, channel_type, bytes, offset) {
    var decoded = {};

    switch (channel_type) {
        case 0x0d:
            decoded.retransmit_config = readRetransmitConfig(bytes.slice(offset, offset + 3));
            offset += 3;
            break;
        case 0x0e:
            decoded.resend_interval = readUInt16LE(bytes.slice(offset, offset + 2));
            offset += 2;
            break;
        case 0x72:
            decoded.dst_config = readDstConfig(bytes.slice(offset, offset + 9));
            offset += 9;
            break;
        case 0x76:
            var batch_rules = readBatchRules(readUInt16LE(bytes.slice(offset, offset + 2)));
            var type = bytes[offset + 2];
            if (type === 0x01) {
                decoded.batch_enable_rules = batch_rules;
            } else if (type === 0x02) {
                decoded.batch_disable_rules = batch_rules;
            } else if (type === 0x03) {
                decoded.batch_remove_rules = batch_rules;
            }
            offset += 3;
            break;
        case 0x77:
            decoded.query_rule_config = readYesNoStatus(readUInt8(bytes[offset]));
            offset += 1;
            break;
        case 0x78:
            decoded.modbus_serial_port_config = readModbusSerialPortConfig(bytes.slice(offset, offset + 7));
            offset += 7;
            break;
        case 0x79:
            decoded.modbus_config = readModbusConfig(bytes.slice(offset, offset + 7));
            offset += 7;
            break;
        case 0x7a:
            var query_request = readUInt8(bytes[offset]);
            if (query_request === 0x00) {
                decoded.query_modbus_serial_port_config = readYesNoStatus(1);
            } else if (query_request === 0x01) {
                decoded.query_modbus_config = readYesNoStatus(1);
            }
            offset += 1;
            break;
        case 0x7d:
            var result = handleRuleConfig(bytes, offset);
            var rule_config = result.data;
            offset = result.offset;

            var found = false;
            decoded.rule_config = decoded.rule_config || [];
            for (var x = 0; x < decoded.rule_config.length; x++) {
                if (decoded.rule_config[x].rule_id === rule_config.rule_id) {
                    decoded.rule_config[x] = Object.assign(decoded.rule_config[x], rule_config);
                    found = true;
                    break;
                }
            }
            if (!found) {
                decoded.rule_config.push(rule_config);
            }
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

function readSensorStatus(status) {
    var status_map = { 0: "normal", 1: "read error" };
    return getValue(status_map, status);
}

function readOnOffStatus(status) {
    var status_map = { 0: "off", 1: "on" };
    return getValue(status_map, status);
}

function readModbusAlarmType(type) {
    var alarm_type_map = {
        0: "normal",
        1: "threshold alarm",
        2: "threshold alarm release",
        3: "mutation alarm",
    };
    return getValue(alarm_type_map, type);
}

function hasAlarm(type) {
    return type !== 0;
}

function readParityType(type) {
    var parity_type_map = { 0: "none", 1: "odd", 2: "even" };
    return getValue(parity_type_map, type);
}

function readYesNoStatus(status) {
    var status_map = { 0: "no", 1: "yes" };
    return getValue(status_map, status);
}

function readEnableStatus(status) {
    var status_map = { 0: "disable", 1: "enable" };
    return getValue(status_map, status);
}

function readTimeZone(timezone) {
    var timezone_map = { "-720": "UTC-12", "-660": "UTC-11", "-600": "UTC-10", "-570": "UTC-9:30", "-540": "UTC-9", "-480": "UTC-8", "-420": "UTC-7", "-360": "UTC-6", "-300": "UTC-5", "-240": "UTC-4", "-210": "UTC-3:30", "-180": "UTC-3", "-120": "UTC-2", "-60": "UTC-1", 0: "UTC", 60: "UTC+1", 120: "UTC+2", 180: "UTC+3", 210: "UTC+3:30", 240: "UTC+4", 270: "UTC+4:30", 300: "UTC+5", 330: "UTC+5:30", 345: "UTC+5:45", 360: "UTC+6", 390: "UTC+6:30", 420: "UTC+7", 480: "UTC+8", 540: "UTC+9", 570: "UTC+9:30", 600: "UTC+10", 630: "UTC+10:30", 660: "UTC+11", 720: "UTC+12", 765: "UTC+12:45", 780: "UTC+13", 840: "UTC+14" };
    return getValue(timezone_map, timezone);
}

function readDstConfig(bytes) {
    var offset = 0;

    var data = bytes[offset];
    var enable_value = (data >> 7) & 0x01;
    var offset_value = data & 0x7f;

    var dst_config = {};
    dst_config.enable = readEnableStatus(enable_value);
    dst_config.offset = offset_value;
    if (enable_value === 1) {
        dst_config.start_month = readUInt8(bytes[offset + 1]);
        var start_week_value = readUInt8(bytes[offset + 2]);
        dst_config.start_week_num = start_week_value >> 4;
        dst_config.start_week_day = start_week_value & 0x0f;
        dst_config.start_time = readUInt16LE(bytes.slice(offset + 3, offset + 5));
        dst_config.end_month = readUInt8(bytes[offset + 5]);
        var end_week_value = readUInt8(bytes[offset + 6]);
        dst_config.end_week_num = end_week_value >> 4;
        dst_config.end_week_day = end_week_value & 0x0f;
        dst_config.end_time = readUInt16LE(bytes.slice(offset + 7, offset + 9));
    }
    offset += 9;

    return dst_config;
}

function readModbusSerialPortConfig(bytes) {
    var offset = 0;

    var modbus_serial_port_config = {};
    modbus_serial_port_config.baud_rate = readUInt32LE(bytes.slice(offset, offset + 4));
    modbus_serial_port_config.data_bits = readUInt8(bytes[offset + 4]);
    modbus_serial_port_config.stop_bits = readUInt8(bytes[offset + 5]);
    modbus_serial_port_config.parity = readParityType(readUInt8(bytes[offset + 6]));
    offset += 7;

    return modbus_serial_port_config;
}

function readModbusConfig(bytes) {
    var offset = 0;

    var modbus_config = {};
    modbus_config.exec_interval = readUInt16LE(bytes.slice(offset, offset + 2));
    modbus_config.max_response_time = readUInt16LE(bytes.slice(offset + 2, offset + 4));
    modbus_config.retry_times = readUInt8(bytes[offset + 4]);
    var data = bytes[offset + 5];
    modbus_config.pass_through_enable = readEnableStatus((data >>> 4) & 0x01);
    modbus_config.pass_through_direct = readDirection(data & 0x01);
    modbus_config.pass_through_port = readUInt8(bytes[offset + 6]);
    offset += 7;

    return modbus_config;
}

function readDirection(type) {
    var direction_map = { 0: "active", 1: "bidirectional" };
    return getValue(direction_map, type);
}

function readModbusChannels(bytes) {
    var offset = 0;

    var modbus_channels = {};
    modbus_channels.channel_id = readUInt8(bytes[offset]);
    modbus_channels.slave_id = readUInt8(bytes[offset + 1]);
    modbus_channels.register_address = readUInt16LE(bytes.slice(offset + 2, offset + 4));
    modbus_channels.register_type = readRegisterType(readUInt8(bytes[offset + 4]));
    var data = bytes[offset + 5];
    modbus_channels.sign = readSignType((data >>> 4) & 0x01);
    modbus_channels.quantity = data & 0x0f;
    offset += 6;

    return modbus_channels;
}

function readSignType(type) {
    var sign_map = { 0: "unsigned", 1: "signed" };
    return getValue(sign_map, type);
}

function readRetransmitConfig(bytes) {
    var offset = 0;

    var retransmit_config = {};
    retransmit_config.enable = readEnableStatus(bytes[offset]);
    retransmit_config.interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
    offset += 3;

    return retransmit_config;
}

function readBatchRules(value) {
    var rules_offset = { rule_1: 0, rule_2: 1, rule_3: 2, rule_4: 3, rule_5: 4, rule_6: 5, rule_7: 6, rule_8: 7, rule_9: 8, rule_10: 9, rule_11: 10, rule_12: 11, rule_13: 12, rule_14: 13, rule_15: 14, rule_16: 15 };

    var batch_rules = {};
    for (var key in rules_offset) {
        batch_rules[key] = readYesNoStatus((value >>> rules_offset[key]) & 0x01);
    }
    return batch_rules;
}

function readRegisterType(type) {
    var register_type_map = {
        0: "MB_REG_COIL",
        1: "MB_REG_DIS",
        2: "MB_REG_INPUT_AB",
        3: "MB_REG_INPUT_BA",
        4: "MB_REG_INPUT_INT32_ABCD",
        5: "MB_REG_INPUT_INT32_BADC",
        6: "MB_REG_INPUT_INT32_CDAB",
        7: "MB_REG_INPUT_INT32_DCBA",
        8: "MB_REG_INPUT_INT32_AB",
        9: "MB_REG_INPUT_INT32_CD",
        10: "MB_REG_INPUT_FLOAT_ABCD",
        11: "MB_REG_INPUT_FLOAT_BADC",
        12: "MB_REG_INPUT_FLOAT_CDAB",
        13: "MB_REG_INPUT_FLOAT_DCBA",
        14: "MB_REG_HOLD_INT16_AB",
        15: "MB_REG_HOLD_INT16_BA",
        16: "MB_REG_HOLD_INT32_ABCD",
        17: "MB_REG_HOLD_INT32_BADC",
        18: "MB_REG_HOLD_INT32_CDAB",
        19: "MB_REG_HOLD_INT32_DCBA",
        20: "MB_REG_HOLD_INT32_AB",
        21: "MB_REG_HOLD_INT32_CD",
        22: "MB_REG_HOLD_FLOAT_ABCD",
        23: "MB_REG_HOLD_FLOAT_BADC",
        24: "MB_REG_HOLD_FLOAT_CDAB",
        25: "MB_REG_HOLD_FLOAT_DCBA",
        26: "MB_REG_INPUT_DOUBLE_ABCDEFGH",
        27: "MB_REG_INPUT_DOUBLE_GHEFCDAB",
        28: "MB_REG_INPUT_DOUBLE_BADCFEHG",
        29: "MB_REG_INPUT_DOUBLE_HGFEDCBA",
        30: "MB_REG_INPUT_INT64_ABCDEFGH",
        31: "MB_REG_INPUT_INT64_GHEFCDAB",
        32: "MB_REG_INPUT_INT64_BADCFEHG",
        33: "MB_REG_INPUT_INT64_HGFEDCBA",
        34: "MB_REG_HOLD_DOUBLE_ABCDEFGH",
        35: "MB_REG_HOLD_DOUBLE_GHEFCDAB",
        36: "MB_REG_HOLD_DOUBLE_BADCFEHG",
        37: "MB_REG_HOLD_DOUBLE_HGFEDCBA",
        38: "MB_REG_HOLD_INT64_ABCDEFGH",
        39: "MB_REG_HOLD_INT64_GHEFCDAB",
        40: "MB_REG_HOLD_INT64_BADCFEHG",
        41: "MB_REG_HOLD_INT64_HGFEDCBA",
    };
    return getValue(register_type_map, type);
}

function readModbusHistoryV2(reg_type, sign, bytes) {
    var i = 0;
    var value = 0;
    switch (reg_type) {
        case 0: // MB_REG_COIL
        case 1: // MB_REG_DISCRETE
            value = readOnOffStatus(bytes[i]);
            break;
        case 2: // MB_REG_INPUT_AB
        case 3: // MB_REG_INPUT_BA
            value = sign ? readInt16LE(bytes.slice(i, i + 2)) : readUInt16LE(bytes.slice(i, i + 2));
            break;
        case 4: // MB_REG_INPUT_INT32_ABCD
        case 5: // MB_REG_INPUT_INT32_BADC
        case 6: // MB_REG_INPUT_INT32_CDAB
        case 7: // MB_REG_INPUT_INT32_DCBA
            value = sign ? readInt32LE(bytes.slice(i, i + 4)) : readUInt32LE(bytes.slice(i, i + 4));
            break;
        case 8: // MB_REG_INPUT_INT32_AB
        case 9: // MB_REG_INPUT_INT32_CD
        case 20: // MB_REG_HOLD_INT32_AB
        case 21: // MB_REG_HOLD_INT32_CD
            value = sign ? readInt16LE(bytes.slice(i, i + 2)) : readUInt16LE(bytes.slice(i, i + 2));
            break;
        case 10: // MB_REG_INPUT_FLOAT_ABCD
        case 11: // MB_REG_INPUT_FLOAT_BADC
        case 12: // MB_REG_INPUT_FLOAT_CDAB
        case 13: // MB_REG_INPUT_FLOAT_DCBA
            value = readFloatLE(bytes.slice(i, i + 4));
            break;
        case 14: // MB_REG_HOLD_INT16_AB
        case 15: // MB_REG_HOLD_INT16_BA
            value = sign ? readInt16LE(bytes.slice(i, i + 2)) : readUInt16LE(bytes.slice(i, i + 2));
            break;
        case 16: // MB_REG_HOLD_INT32_ABCD
        case 17: // MB_REG_HOLD_INT32_BADC
        case 18: // MB_REG_HOLD_INT32_CDAB
        case 19: // MB_REG_HOLD_INT32_DCBA
            value = sign ? readInt32LE(bytes.slice(i, i + 4)) : readUInt32LE(bytes.slice(i, i + 4));
            break;
        case 30: // MB_REG_INPUT_INT64_ABCDEFGH
        case 31: // MB_REG_INPUT_INT64_GHEFCDAB
        case 32: // MB_REG_INPUT_INT64_BADCFEHG
        case 33: // MB_REG_INPUT_INT64_HGFEDCBA
        case 38: // MB_REG_HOLD_INT64_ABCDEFGH
        case 39: // MB_REG_HOLD_INT64_GHEFCDAB
        case 40: // MB_REG_HOLD_INT64_BADCFEHG
        case 41: // MB_REG_HOLD_INT64_HGFEDCBA
            value = sign ? readInt64LE(bytes.slice(i, i + 8)) : readUInt64LE(bytes.slice(i, i + 8));
            break;
        case 22: // MB_REG_HOLD_FLOAT_ABCD
        case 23: // MB_REG_HOLD_FLOAT_BADC
        case 24: // MB_REG_HOLD_FLOAT_CDAB
        case 25: // MB_REG_HOLD_FLOAT_DCBA
            value = readFloatLE(bytes.slice(i, i + 4));
            break;
        case 26: // MB_REG_INPUT_DOUBLE_ABCDEFGH
        case 27: // MB_REG_INPUT_DOUBLE_GHEFCDAB
        case 28: // MB_REG_INPUT_DOUBLE_BADCFEHG
        case 29: // MB_REG_INPUT_DOUBLE_HGFEDCBA
        case 34: // MB_REG_HOLD_DOUBLE_ABCDEFGH
        case 35: // MB_REG_HOLD_DOUBLE_GHEFCDAB
        case 36: // MB_REG_HOLD_DOUBLE_BADCFEHG
        case 37: // MB_REG_HOLD_DOUBLE_HGFEDCBA
            value = readDoubleLE(bytes.slice(i, i + 8));
            break;
    }
    return value;
}

function handleRuleConfig(bytes, offset) {
    var value_1 = readUInt8(bytes[offset]);
    var value_2 = readUInt8(bytes[offset + 1]);

    var enable_value = (value_1 >>> 7) & 0x01;
    var rule_id = value_1 & 0x7f;
    var condition_or_action = (value_2 >>> 7) & 0x01;
    var rule_index = (value_2 >>> 4) & 0x07;
    var rule_type_value = value_2 & 0x0f;

    var rule_config = {};
    rule_config.rule_id = rule_id;
    rule_config.enable = readEnableStatus(enable_value);

    // condition
    if (condition_or_action === 0x00) {
        rule_config.condition = {};
        rule_config.condition.type = readConditionType(rule_type_value);
        switch (rule_type_value) {
            case 0x00: // NONE CONDITION
                offset += 2;
                break;
            case 0x01: // TIME CONDITION
                rule_config.condition.time_condition = readTimeCondition(bytes.slice(offset + 2, offset + 9));
                offset += 9;
                break;
            case 0x02: // MODBUS VALUE CONDITION
                rule_config.condition.modbus_value_condition = readModbusValueCondition(bytes.slice(offset + 2, offset + 20));
                offset += 20;
                break;
            case 0x03: // MODBUS CMD CONDITION
                var cmd_length = readUInt8(bytes[offset + 2]);
                rule_config.condition.modbus_cmd_condition = readModbusCmdCondition(bytes.slice(offset + 3, offset + 3 + cmd_length));
                offset += 3 + cmd_length;
                break;
            case 0x04: // MESSAGE CONDITION
                var message_length = readUInt8(bytes[offset + 2]);
                rule_config.condition.message_condition = readMessageCondition(bytes.slice(offset + 3, offset + 3 + message_length));
                offset += 3 + message_length;
                break;
            case 0x05: // D2D CONDITION
                rule_config.condition.d2d_condition = readD2DCondition(bytes.slice(offset + 2, offset + 5));
                offset += 5;
                break;
            case 0x06: // REBOOT CONDITION
                offset += 2;
                break;
        }
    }
    // action
    else if (condition_or_action === 0x01) {
        var action = {};
        action.type = readActionType(rule_type_value);
        action.index = rule_index;
        action.delay_time = readUInt32LE(bytes.slice(offset + 2, offset + 6));
        switch (rule_type_value) {
            case 0x00: // NONE ACTION
                offset += 6;
                break;
            case 0x01: // MESSAGE ACTION
                var message_length = readUInt8(bytes[offset + 6]);
                action.message_action = readMessageAction(bytes.slice(offset + 7, offset + 7 + message_length));
                offset += 7 + message_length;
                break;
            case 0x02: // D2D ACTION
                action.d2d_action = readD2DAction(bytes.slice(offset + 6, offset + 8));
                offset += 8;
                break;
            case 0x03: // MODBUS CMD ACTION
                var modbus_cmd_length = readUInt8(bytes[offset + 6]);
                action.modbus_cmd_action = readModbusCmdAction(bytes.slice(offset + 7, offset + 7 + modbus_cmd_length));
                offset += 7 + modbus_cmd_length;
                break;
            case 0x04: // REPORT STATUS ACTION
                offset += 6;
                break;
            case 0x05: // REPORT ALARM ACTION
                action.report_alarm_action = readReportAlarmAction(bytes[offset + 6]);
                offset += 7;
                break;
            case 0x06: // REBOOT ACTION
                offset += 6;
                break;
        }
        rule_config.action = rule_config.action || [];
        rule_config.action.push(action);
    }
    return { data: rule_config, offset: offset };
}

function readConditionType(condition_type_value) {
    var condition_type_map = { 0: "none", 1: "time", 2: "modbus_value", 3: "modbus_cmd", 4: "message", 5: "d2d", 6: "reboot" };
    return getValue(condition_type_map, condition_type_value);
}

function readTimeCondition(bytes) {
    var offset = 0;
    var cycle_mode_value = readUInt8(bytes[offset]);

    var time_condition = {};
    time_condition.mode = readCycleMode(cycle_mode_value);
    switch (cycle_mode_value) {
        case 0x00: // weekdays
            time_condition.weekdays = readWeekdays(readUInt32LE(bytes.slice(offset + 1, offset + 5)));
            break;
        case 0x01: // days
            time_condition.days = readDays(readUInt32LE(bytes.slice(offset + 1, offset + 5)));
            break;
    }
    time_condition.hour = readUInt8(bytes[offset + 5]);
    time_condition.minute = readUInt8(bytes[offset + 6]);
    return time_condition;
}

function readCycleMode(mode) {
    var cycle_mode_map = { 0: "weekdays", 1: "days" };
    return getValue(cycle_mode_map, mode);
}

function readWeekdays(value) {
    var weekdays = [];
    for (var i = 0; i < 7; i++) {
        if ((value >> i) & 0x01) {
            weekdays.push(i + 1);
        }
    }
    return weekdays;
}

function readDays(value) {
    var days = [];
    for (var i = 0; i < 31; i++) {
        if ((value >> i) & 0x01) {
            days.push(i + 1);
        }
    }
    return days;
}

function readModbusValueCondition(bytes) {
    var offset = 0;

    var channel_id = readUInt8(bytes[offset]);
    var condition_def = readUInt8(bytes[offset + 1]);
    var condition_value = condition_def & 0x0f;
    var holding_mode_value = (condition_def >>> 4) & 0x01;
    var continue_time = readUInt32LE(bytes.slice(offset + 2, offset + 6));
    var lock_time = readUInt32LE(bytes.slice(offset + 6, offset + 10));
    var value_1 = readFloatLE(bytes.slice(offset + 10, offset + 14));
    var value_2 = readFloatLE(bytes.slice(offset + 14, offset + 18));

    var modbus_value_condition = {};
    modbus_value_condition.channel_id = channel_id;
    modbus_value_condition.condition = readMathConditionType(condition_value);
    if (condition_value < 5) {
        modbus_value_condition.holding_mode = readHoldingModeType(holding_mode_value);
    }
    modbus_value_condition.continue_time = continue_time;
    modbus_value_condition.lock_time = lock_time;
    if (condition_value === 2 || condition_value === 4) {
        modbus_value_condition.min_threshold = value_1;
    } else if (condition_value === 3 || condition_value === 4) {
        modbus_value_condition.max_threshold = value_2;
    } else if (condition_value === 6 || condition_value === 7) {
        modbus_value_condition.mutation_duration = value_1;
        modbus_value_condition.mutation = value_2;
    }
    return modbus_value_condition;
}

function readMathConditionType(type) {
    var math_condition_type_map = { 0: "false", 1: "true", 2: "below", 3: "above", 4: "between", 5: "outside", 6: "change_with_time", 7: "change_without_time" };
    return getValue(math_condition_type_map, type);
}

function readHoldingModeType(type) {
    var holding_mode_map = { 0: "below", 1: "above" };
    return getValue(holding_mode_map, type);
}

function readModbusCmdCondition(bytes) {
    var modbus_cmd_condition = {};
    modbus_cmd_condition.cmd = readAscii(bytes);
    return modbus_cmd_condition;
}

function readMessageCondition(bytes) {
    var message_condition = {};
    message_condition.message = readAscii(bytes);
    return message_condition;
}

function readD2DCondition(bytes) {
    var offset = 0;

    var d2d_condition = {};
    d2d_condition.d2d_cmd = readD2DCommand(bytes.slice(offset, offset + 2));
    d2d_condition.d2d_status = readD2DStatus(bytes[offset + 2]);

    return d2d_condition;
}

function readD2DCommand(bytes) {
    return ("0" + (bytes[1] & 0xff).toString(16)).slice(-2) + ("0" + (bytes[0] & 0xff).toString(16)).slice(-2);
}

function readD2DStatus(type) {
    var d2d_status_map = { 0: "any", 1: "on", 2: "off" };
    return getValue(d2d_status_map, type);
}

function readActionType(type) {
    var action_map = { 0: "none", 1: "message", 2: "d2d", 3: "modbus_cmd", 4: "report_status", 5: "report_alarm", 6: "reboot" };
    return getValue(action_map, type);
}

function readMessageAction(bytes) {
    var message_action = {};
    message_action.message = readAscii(bytes);
    return message_action;
}

function readD2DAction(bytes) {
    var d2d_action = {};
    d2d_action.d2d_cmd = readD2DCommand(bytes);
    return d2d_action;
}

function readModbusCmdAction(bytes) {
    var modbus_cmd_action = {};
    modbus_cmd_action.cmd = readAscii(bytes);
    return modbus_cmd_action;
}

function readReportAlarmAction(type) {
    var report_alarm_action = {};
    report_alarm_action.release_enable = readEnableStatus(type);
    return report_alarm_action;
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

function readUInt64LE(bytes) {
    // JavaScript unable to handle 64-bit integers, so we split the 64-bit value into two 32-bit parts
    var low = readUInt32LE(bytes.slice(0, 4));
    var high = readUInt32LE(bytes.slice(4, 8));

    // For values less than 2^53, we can directly calculate
    if (high < 0x200000) {
        return high * 0x100000000 + low;
    }

    // For larger values, return a string or use BigInt (if supported)
    if (typeof BigInt !== "undefined") {
        return (BigInt(high) << BigInt(32)) + BigInt(low);
    } else {
        // Return an object containing the high and low parts
        return {
            high: high,
            low: low,
            toString: function () {
                // Simple string representation
                return high.toString(16) + low.toString(16).padStart(8, "0");
            },
        };
    }
}

function readInt64LE(bytes) {
    var low = readUInt32LE(bytes.slice(0, 4));
    var high = readUInt32LE(bytes.slice(4, 8));

    // check the sign bit
    var isNegative = (high & 0x80000000) !== 0;

    if (!isNegative) {
        // positive number is processed the same as UInt64
        if (high < 0x200000) {
            return high * 0x100000000 + low;
        }
    } else {
        // for negative numbers, if the absolute value is less than 2^53, we can directly calculate
        if ((high & 0x7fffffff) < 0x200000) {
            return -((~high & 0x7fffffff) * 0x100000000 + (~low & 0xffffffff) + 1);
        }
    }

    // for larger values, use BigInt (if supported)
    if (typeof BigInt !== "undefined") {
        var value = (BigInt(high) << BigInt(32)) | BigInt(low);
        if (isNegative) {
            // negative numbers need to be converted to signed integers
            value = value - BigInt("18446744073709551616");
        }
        return value;
    } else {
        // return an object containing the high, low, and sign
        return {
            high: high,
            low: low,
            isNegative: isNegative,
            toString: function () {
                if (!isNegative) {
                    return high.toString(16) + low.toString(16).padStart(8, "0");
                } else {
                    // for negative numbers, calculate the two's complement
                    var twoComp = ((~high & 0xffffffff) << 32) | ((~low & 0xffffffff) + 1);
                    return "-" + (twoComp >>> 0).toString(16);
                }
            },
        };
    }
}

function readFloat16LE(bytes) {
    var bits = (bytes[1] << 8) | bytes[0];
    var sign = bits >>> 15 === 0 ? 1.0 : -1.0;
    var e = (bits >>> 10) & 0x1f;
    var m = e === 0 ? (bits & 0x3ff) << 1 : (bits & 0x3ff) | 0x400;
    var f = sign * m * Math.pow(2, e - 25);
    return f;
}

function readFloatLE(bytes) {
    var bits = (bytes[3] << 24) | (bytes[2] << 16) | (bytes[1] << 8) | bytes[0];
    var sign = bits >>> 31 === 0 ? 1.0 : -1.0;
    var e = (bits >>> 23) & 0xff;
    var m = e === 0 ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
    var f = sign * m * Math.pow(2, e - 150);
    var n = Number(f.toFixed(2));
    return n;
}

function readDoubleLE(bytes) {
    // read from 8 bytes
    var low = bytes[0] | (bytes[1] << 8) | (bytes[2] << 16) | (bytes[3] << 24);
    var high = bytes[4] | (bytes[5] << 8) | (bytes[6] << 16) | (bytes[7] << 24);

    // extract the sign bit (bit 63)
    var sign = high >>> 31 === 0 ? 1.0 : -1.0;

    // extract the exponent (bit 62-52)
    var exponent = (high >>> 20) & 0x7ff;

    // extract the mantissa (bit 51-0)
    // high part (bit 51-32)
    var highMantissa = high & 0xfffff;
    // low part (bit 31-0)
    var lowMantissa = low;

    var result;

    if (exponent === 0) {
        // handle denormalized numbers
        if (highMantissa === 0 && lowMantissa === 0) {
            result = sign * 0; // zero
        } else {
            // denormalized numbers, exponent offset is -1022
            result = sign * Math.pow(2, -1022) * (highMantissa * Math.pow(2, -20) + lowMantissa * Math.pow(2, -52));
        }
    } else if (exponent === 0x7ff) {
        // handle infinity and NaN
        if (highMantissa === 0 && lowMantissa === 0) {
            result = sign === 1.0 ? Infinity : -Infinity; // infinity
        } else {
            result = NaN; // Not a Number
        }
    } else {
        // handle normalized numbers
        // IEEE 754 double precision floating point exponent offset is 1023
        result = sign * Math.pow(2, exponent - 1023) * (1 + highMantissa * Math.pow(2, -20) + lowMantissa * Math.pow(2, -52));
    }

    return result;
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
