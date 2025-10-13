/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product UC100 v2
 */
var RAW_VALUE = 0x00;

/* eslint no-redeclare: "off" */
/* eslint-disable */
// Chirpstack v4
function encodeDownlink(input) {
    var encoded = milesightDeviceEncode(input.data);
    return { bytes: encoded };
}

// Chirpstack v3
function Encode(fPort, obj) {
    return milesightDeviceEncode(obj);
}

// The Things Network
function Encoder(obj, port) {
    return milesightDeviceEncode(obj);
}
/* eslint-enable */

function milesightDeviceEncode(payload) {
    var encoded = [];

    if ("reboot" in payload) {
        encoded = encoded.concat(reboot(payload.reboot));
    }
    if ("report_status" in payload) {
        encoded = encoded.concat(reportStatus(payload.report_status));
    }
    if ("sync_time" in payload) {
        encoded = encoded.concat(syncTime(payload.sync_time));
    }
    if ("report_interval" in payload) {
        encoded = encoded.concat(setReportInterval(payload.report_interval));
    }
    if ("confirm_mode_enable" in payload) {
        encoded = encoded.concat(setConfirmModeEnable(payload.confirm_mode_enable));
    }
    if ("time_zone" in payload) {
        encoded = encoded.concat(setTimeZone(payload.time_zone));
    }
    if ("dst_config" in payload) {
        encoded = encoded.concat(setDaylightSavingTime(payload.dst_config));
    }
    if ("modbus_serial_port_config" in payload) {
        encoded = encoded.concat(setModbusSerialPortConfig(payload.modbus_serial_port_config));
    }
    if ("modbus_config" in payload) {
        encoded = encoded.concat(setModbusConfig(payload.modbus_config));
    }
    if ("query_modbus_serial_port_config" in payload) {
        encoded = encoded.concat(queryModbusSerialPortConfig(payload.query_modbus_serial_port_config));
    }
    if ("query_modbus_config" in payload) {
        encoded = encoded.concat(queryModbusConfig(payload.query_modbus_config));
    }
    if ("modbus_channels" in payload) {
        for (var i = 0; i < payload.modbus_channels.length; i++) {
            encoded = encoded.concat(setModbusChannel(payload.modbus_channels[i]));
        }
    }
    if ("modbus_channels_name" in payload) {
        for (var i = 0; i < payload.modbus_channels_name.length; i++) {
            encoded = encoded.concat(setModbusChannelName(payload.modbus_channels_name[i]));
        }
    }
    if ("remove_modbus_channels" in payload) {
        for (var i = 0; i < payload.remove_modbus_channels.length; i++) {
            encoded = encoded.concat(removeModbusChannel(payload.remove_modbus_channels[i]));
        }
    }
    if ("retransmit_config" in payload) {
        encoded = encoded.concat(setRetransmitConfig(payload.retransmit_config));
    }
    if ("resend_interval" in payload) {
        encoded = encoded.concat(setResendInterval(payload.resend_interval));
    }
    if ("retransmit_enable" in payload) {
        encoded = encoded.concat(setRetransmitEnable(payload.retransmit_enable));
    }
    if ("history_enable" in payload) {
        encoded = encoded.concat(setHistoryEnable(payload.history_enable));
    }
    if ("fetch_history" in payload) {
        encoded = encoded.concat(fetchHistory(payload.fetch_history));
    }
    if ("clear_history" in payload) {
        encoded = encoded.concat(clearHistory(payload.clear_history));
    }
    if ("batch_enable_rules" in payload) {
        encoded = encoded.concat(setBatchEnableRules(payload.batch_enable_rules));
    }
    if ("batch_disable_rules" in payload) {
        encoded = encoded.concat(setBatchDisableRules(payload.batch_disable_rules));
    }
    if ("batch_remove_rules" in payload) {
        encoded = encoded.concat(setBatchRemoveRules(payload.batch_remove_rules));
    }
    if ("query_rule_config" in payload) {
        encoded = encoded.concat(queryRuleConfig(payload.query_rule_config));
    }
    if ("rule_config" in payload) {
        for (var i = 0; i < payload.rule_config.length; i++) {
            encoded = encoded.concat(setRuleConfig(payload.rule_config[i]));
        }
    }

    return encoded;
}

/**
 * reboot device
 * @param {number} reboot values: (0: no, 1: yes)
 * @example { "reboot": 1 }
 */
function reboot(reboot) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(reboot) === -1) {
        throw new Error("reboot must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, reboot) === 0) {
        return [];
    }
    return [0xff, 0x10, 0xff];
}

/**
 * report device status
 * @since v2.0
 * @param {number} report_status values: (0: no, 1: yes)
 * @example { "report_status": 1 }
 */
function reportStatus(report_status) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(report_status) === -1) {
        throw new Error("report_status must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, report_status) === 0) {
        return [];
    }
    return [0xff, 0x28, 0xff];
}

/**
 * sync time
 * @since v2.0
 * @param {number} sync_time values: (0: no, 1: yes)
 * @example { "sync_time": 1 }
 */
function syncTime(sync_time) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(sync_time) === -1) {
        throw new Error("sync_time must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, sync_time) === 0) {
        return [];
    }
    return [0xff, 0x4a, 0x00];
}

/**
 * set report interval
 * @param {number} report_interval unit: second
 * @example { "report_interval": 600 }
 */
function setReportInterval(report_interval) {
    if (typeof report_interval !== "number") {
        throw new Error("report_interval must be a number");
    }
    if (report_interval < 0) {
        throw new Error("report_interval must be greater than 0");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x03);
    buffer.writeUInt16LE(report_interval);
    return buffer.toBytes();
}

/**
 * confirm mode enable
 * @param {number} confirm_mode_enable values: (0: disable, 1: enable)
 * @example { "confirm_mode_enable": 1 }
 */
function setConfirmModeEnable(confirm_mode_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(confirm_mode_enable) === -1) {
        throw new Error("confirm_mode_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x04);
    buffer.writeUInt8(getValue(enable_map, confirm_mode_enable));
    return buffer.toBytes();
}

/**
 * set time zone
 * @param {number} time_zone unit: minute, convert: "hh:mm" -> "hh * 60 + mm", values: ( -720: UTC-12, -660: UTC-11, -600: UTC-10, -570: UTC-9:30, -540: UTC-9, -480: UTC-8, -420: UTC-7, -360: UTC-6, -300: UTC-5, -240: UTC-4, -210: UTC-3:30, -180: UTC-3, -120: UTC-2, -60: UTC-1, 0: UTC, 60: UTC+1, 120: UTC+2, 180: UTC+3, 240: UTC+4, 300: UTC+5, 360: UTC+6, 420: UTC+7, 480: UTC+8, 540: UTC+9, 570: UTC+9:30, 600: UTC+10, 660: UTC+11, 720: UTC+12, 765: UTC+12:45, 780: UTC+13, 840: UTC+14 )
 * @example { "time_zone": 480 }
 * @example { "time_zone": -240 }
 */
function setTimeZone(time_zone) {
    var timezone_map = { "-720": "UTC-12", "-660": "UTC-11", "-600": "UTC-10", "-570": "UTC-9:30", "-540": "UTC-9", "-480": "UTC-8", "-420": "UTC-7", "-360": "UTC-6", "-300": "UTC-5", "-240": "UTC-4", "-210": "UTC-3:30", "-180": "UTC-3", "-120": "UTC-2", "-60": "UTC-1", 0: "UTC", 60: "UTC+1", 120: "UTC+2", 180: "UTC+3", 210: "UTC+3:30", 240: "UTC+4", 270: "UTC+4:30", 300: "UTC+5", 330: "UTC+5:30", 345: "UTC+5:45", 360: "UTC+6", 390: "UTC+6:30", 420: "UTC+7", 480: "UTC+8", 540: "UTC+9", 570: "UTC+9:30", 600: "UTC+10", 630: "UTC+10:30", 660: "UTC+11", 720: "UTC+12", 765: "UTC+12:45", 780: "UTC+13", 840: "UTC+14" };
    var timezone_values = getValues(timezone_map);
    if (timezone_values.indexOf(time_zone) === -1) {
        throw new Error("time_zone must be one of " + timezone_values.join(", "));
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xbd);
    buffer.writeInt16LE(getValue(timezone_map, time_zone));
    return buffer.toBytes();
}

/**
 * set daylight saving time
 * @since v2.0
 * @param {object} dst_config
 * @param {number} dst_config.enable values: (0: disable, 1: enable)
 * @param {number} dst_config.offset, unit: minute
 * @param {number} dst_config.start_month, values: (1: January, 2: February, 3: March, 4: April, 5: May, 6: June, 7: July, 8: August, 9: September, 10: October, 11: November, 12: December)
 * @param {number} dst_config.start_week_num, range: [1, 5]
 * @param {number} dst_config.start_week_day, range: [1, 7]
 * @param {number} dst_config.start_time, unit: minute, convert: "hh:mm" -> "hh * 60 + mm"
 * @param {number} dst_config.end_month, values: (1: January, 2: February, 3: March, 4: April, 5: May, 6: June, 7: July, 8: August, 9: September, 10: October, 11: November, 12: December)
 * @param {number} dst_config.end_week_num, range: [1, 5]
 * @param {number} dst_config.end_week_day, range: [1, 7]
 * @param {number} dst_config.end_time, unit: minute, convert: "hh:mm" -> "hh * 60 + mm"
 * @example { "dst_config": { "enable": 1, "offset": 60, "start_month": 3, "start_week_num": 2, "start_week_day": 7, "start_time": 120, "end_month": 1, "end_week_num": 4, "end_week_day": 1, "end_time": 180 } } output: FFBA013C032778000141B400
 */
function setDaylightSavingTime(dst_config) {
    var enable = dst_config.enable;
    var offset = dst_config.offset;
    var start_month = dst_config.start_month;
    var start_week_num = dst_config.start_week_num;
    var start_week_day = dst_config.start_week_day;
    var start_time = dst_config.start_time;
    var end_month = dst_config.end_month;
    var end_week_num = dst_config.end_week_num;
    var end_week_day = dst_config.end_week_day;
    var end_time = dst_config.end_time;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("dst_config.enable must be one of " + enable_values.join(", "));
    }

    var week_values = [1, 2, 3, 4, 5, 6, 7];
    var month_values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    var enable_value = getValue(enable_map, enable);
    if (enable_value && month_values.indexOf(start_month) === -1) {
        throw new Error("dst_config.start_month must be one of " + month_values.join(", "));
    }
    if (enable_value && month_values.indexOf(end_month) === -1) {
        throw new Error("dst_config.end_month must be one of " + month_values.join(", "));
    }
    if (enable_value && week_values.indexOf(start_week_day) === -1) {
        throw new Error("dst_config.start_week_day must be one of " + week_values.join(", "));
    }
    if (enable_value && week_values.indexOf(end_week_day) === -1) {
        throw new Error("dst_config.end_week_day must be one of " + week_values.join(", "));
    }

    var data = 0x00;
    data |= getValue(enable_map, enable) << 7;
    data |= offset;

    var buffer = new Buffer(11);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x72);
    buffer.writeUInt8(data);
    buffer.writeUInt8(enable_value && start_month);
    buffer.writeUInt8(enable_value && (start_week_num << 4) | start_week_day);
    buffer.writeUInt16LE(enable_value && start_time);
    buffer.writeUInt8(enable_value && end_month);
    buffer.writeUInt8(enable_value && (end_week_num << 4) | end_week_day);
    buffer.writeUInt16LE(enable_value && end_time);
    return buffer.toBytes();
}

/**
 * Set modbus serial port config
 * @since v2.0
 * @param {object} modbus_serial_port_config
 * @param {number} modbus_serial_port_config.baud_rate values: (1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200)
 * @param {number} modbus_serial_port_config.data_bits values: (7, 8, 9)
 * @param {number} modbus_serial_port_config.stop_bits values: (1, 2, 3)
 * @param {number} modbus_serial_port_config.parity values: (0: none, 1: odd, 2: even)
 * @example { "modbus_serial_port_config": { "baud_rate": 9600, "data_bits": 8, "stop_bits": 1, "parity": 0 } }
 */
function setModbusSerialPortConfig(modbus_serial_port_config) {
    var baud_rate = modbus_serial_port_config.baud_rate;
    var data_bits = modbus_serial_port_config.data_bits;
    var stop_bits = modbus_serial_port_config.stop_bits;
    var parity = modbus_serial_port_config.parity;

    var baud_rate_values = [1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200];
    if (baud_rate_values.indexOf(baud_rate) === -1) {
        throw new Error("modbus_serial_port_config.baud_rate must be one of " + baud_rate_values.join(", "));
    }
    var data_bits_values = [7, 8, 9];
    if (data_bits_values.indexOf(data_bits) === -1) {
        throw new Error("modbus_serial_port_config.data_bits must be one of " + data_bits_values.join(", "));
    }
    var stop_bits_values = [1, 2, 3];
    if (stop_bits_values.indexOf(stop_bits) === -1) {
        throw new Error("modbus_serial_port_config.stop_bits must be one of " + stop_bits_values.join(", "));
    }
    var parity_map = { 0: "none", 1: "odd", 2: "even" };
    var parity_values = getValues(parity_map);
    if (parity_values.indexOf(parity) === -1) {
        throw new Error("modbus_serial_port_config.parity must be one of " + parity_values.join(", "));
    }

    var buffer = new Buffer(9);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x78);
    buffer.writeUInt32LE(baud_rate);
    buffer.writeUInt8(data_bits);
    buffer.writeUInt8(stop_bits);
    buffer.writeUInt8(getValue(parity_map, parity));
    return buffer.toBytes();
}

/**
 * Set modbus config
 * @since v2.0
 * @param {object} modbus_config
 * @param {number} modbus_config.exec_interval range: [100, 65535]
 * @param {number} modbus_config.max_response_time range: [100, 65535]
 * @param {number} modbus_config.retry_times range: [0, 255]
 * @param {number} modbus_config.pass_through_enable values: (0: disable, 1: enable)
 * @param {number} modbus_config.pass_through_direct values: (0: active, 1: bidirectional)
 * @param {number} modbus_config.pass_through_port range: [2, 223]
 * @example { "modbus_config": { "exec_interval": 1000, "max_response_time": 1000, "retry_times": 3, "pass_through_enable": 1, "pass_through_direct": 1, "pass_through_port": 52 } }
 */
function setModbusConfig(modbus_config) {
    var exec_interval = modbus_config.exec_interval;
    var max_response_time = modbus_config.max_response_time;
    var retry_times = modbus_config.retry_times;
    var pass_through_enable = modbus_config.pass_through_enable;
    var pass_through_direct = modbus_config.pass_through_direct;
    var pass_through_port = modbus_config.pass_through_port;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(pass_through_enable) === -1) {
        throw new Error("modbus_config.pass_through_enable must be one of " + enable_values.join(", "));
    }
    var mode_map = { 0: "active", 1: "bidirectional" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(pass_through_direct) === -1) {
        throw new Error("modbus_config.pass_through_direct must be one of " + mode_values.join(", "));
    }
    if (pass_through_port < 2 || pass_through_port > 223) {
        throw new Error("modbus_config.pass_through_port must be between 2 and 223");
    }

    var data = 0x00;
    data |= getValue(enable_map, pass_through_enable) << 4;
    data |= getValue(mode_map, pass_through_direct);

    var buffer = new Buffer(9);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x79);
    buffer.writeUInt16LE(exec_interval);
    buffer.writeUInt16LE(max_response_time);
    buffer.writeUInt8(retry_times);
    buffer.writeUInt8(data);
    buffer.writeUInt8(pass_through_port);
    return buffer.toBytes();
}

/**
 * Query modbus serial port config
 * @param {number} query_modbus_serial_port_config values: (0: no, 1: yes)
 * @example { "query_modbus_serial_port_config": 1 }
 */
function queryModbusSerialPortConfig(query_modbus_serial_port_config) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(query_modbus_serial_port_config) === -1) {
        throw new Error("query_modbus_serial_port_config must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, query_modbus_serial_port_config) === 0) {
        return [];
    }
    return [0xf9, 0x7a, 0x00];
}

/**
 * Query modbus config
 * @param {number} query_modbus_config values: (0: no, 1: yes)
 * @example { "query_modbus_config": 1 }
 */
function queryModbusConfig(query_modbus_config) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(query_modbus_config) === -1) {
        throw new Error("query_modbus_config must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, query_modbus_config) === 0) {
        return [];
    }
    return [0xf9, 0x7a, 0x01];
}

/**
 * Set modbus channel config
 * @param {object} modbus_channels
 * @param {number} modbus_channels._item.channel_id range: [1, 32]
 * @param {number} modbus_channels._item.slave_id range: [1, 255]
 * @param {number} modbus_channels._item.register_address range: [0, 65535]
 * @param {number} modbus_channels._item.register_type values: (
 *              0: MB_REG_COIL, 1: MB_REG_DIS,
 *              2: MB_REG_INPUT_AB, 3: MB_REG_INPUT_BA,
 *              4: MB_REG_INPUT_INT32_ABCD, 5: MB_REG_INPUT_INT32_BADC, 6: MB_REG_INPUT_INT32_CDAB, 7: MB_REG_INPUT_INT32_DCBA,
 *              8: MB_REG_INPUT_INT32_AB, 9: MB_REG_INPUT_INT32_CD,
 *              10: MB_REG_INPUT_FLOAT_ABCD, 11: MB_REG_INPUT_FLOAT_BADC, 12: MB_REG_INPUT_FLOAT_CDAB, 13: MB_REG_INPUT_FLOAT_DCBA,
 *              14: MB_REG_HOLD_INT16_AB, 15: MB_REG_HOLD_INT16_BA,
 *              16: MB_REG_HOLD_INT32_ABCD, 17: MB_REG_HOLD_INT32_BADC, 18: MB_REG_HOLD_INT32_CDAB, 19: MB_REG_HOLD_INT32_DCBA,
 *              20: MB_REG_HOLD_INT32_AB, 21: MB_REG_HOLD_INT32_CD,
 *              22: MB_REG_HOLD_FLOAT_ABCD, 23: MB_REG_HOLD_FLOAT_BADC, 24: MB_REG_HOLD_FLOAT_CDAB, 25: MB_REG_HOLD_FLOAT_DCBA,
 *              26: MB_REG_INPUT_DOUBLE_ABCDEFGH, 27: MB_REG_INPUT_DOUBLE_GHEFCDAB, 28: MB_REG_INPUT_DOUBLE_BADCFEHG, 29: MB_REG_INPUT_DOUBLE_HGFEDCBA,
 *              30: MB_REG_INPUT_INT64_ABCDEFGH, 31: MB_REG_INPUT_INT64_GHEFCDAB, 32: MB_REG_INPUT_INT64_BADCFEHG, 33: MB_REG_INPUT_INT64_HGFEDCBA,
 *              34: MB_REG_HOLD_DOUBLE_ABCDEFGH, 35: MB_REG_HOLD_DOUBLE_GHEFCDAB, 36: MB_REG_HOLD_DOUBLE_BADCFEHG, 37: MB_REG_HOLD_DOUBLE_HGFEDCBA,
 *              38: MB_REG_HOLD_INT64_ABCDEFGH, 39: MB_REG_HOLD_INT64_GHEFCDAB, 40: MB_REG_HOLD_INT64_BADCFEHG, 41: MB_REG_HOLD_INT64_HGFEDCBA,
 *              )
 * @param {number} modbus_channels._item.quantity range: [1, 16]
 * @param {number} modbus_channels._item.sign values: (0: unsigned, 1: signed)
 * @example { "modbus_channels": [ { "channel_id": 1, "slave_id": 1, "register_address": 1, "quantity": 1, "register_type": 1, "sign": 1 } ] }
 */
function setModbusChannel(modbus_channels) {
    var channel_id = modbus_channels.channel_id;
    var slave_id = modbus_channels.slave_id;
    var register_address = modbus_channels.register_address;
    var quantity = modbus_channels.quantity;
    var register_type = modbus_channels.register_type;
    var sign = modbus_channels.sign;

    if (channel_id < 1 || channel_id > 32) {
        throw new Error("modbus_channels._item.channel_id must be between 1 and 32");
    }
    if (slave_id < 1 || slave_id > 255) {
        throw new Error("modbus_channels._item.slave_id must be between 1 and 255");
    }
    if (register_address < 0 || register_address > 65535) {
        throw new Error("modbus_channels._item.address must be between 0 and 65535");
    }
    if (quantity < 1 || quantity > 16) {
        throw new Error("modbus_channels._item.quantity must be between 1 and 16");
    }
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
    var register_type_values = getValues(register_type_map);
    if (register_type_values.indexOf(register_type) === -1) {
        throw new Error("modbus_channels._item.register_type must be one of " + register_type_values.join(", "));
    }
    var sign_map = { 0: "unsigned", 1: "signed" };
    var sign_values = getValues(sign_map);
    if (sign_values.indexOf(sign) === -1) {
        throw new Error("modbus_channels._item.sign must be one of " + sign_values.join(", "));
    }
    var quantity_values = [1, 2];
    if (quantity_values.indexOf(quantity) === -1) {
        throw new Error("modbus_channels._item.quantity must be one of " + quantity_values.join(", "));
    }

    var data = 0x00;
    data |= getValue(sign_map, sign) << 4;
    data |= quantity;

    var buffer = new Buffer(9);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xef);
    buffer.writeUInt8(0x01); // config modbus channel
    buffer.writeUInt8(channel_id);
    buffer.writeUInt8(slave_id);
    buffer.writeUInt16LE(register_address);
    buffer.writeUInt8(getValue(register_type_map, register_type));
    buffer.writeUInt8(data);
    return buffer.toBytes();
}

/**
 * set modbus channel name
 * @param {object} modbus_channels_name
 * @param {number} modbus_channels_name._item.channel_id range: [1, 32]
 * @param {string} modbus_channels_name._item.name
 * @example { "modbus_channels_name": [ { "channel_id": 1, "name": "modbus_channel_1" } ] }
 */
function setModbusChannelName(modbus_channels_name) {
    var channel_id = modbus_channels_name.channel_id;
    var name = modbus_channels_name.name;

    var buffer = new Buffer(5 + name.length);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xef);
    buffer.writeUInt8(0x02); // config modbus channel name
    buffer.writeUInt8(channel_id);
    buffer.writeUInt8(name.length);
    buffer.writeASCII(name);
    return buffer.toBytes();
}

/**
 * remove modbus channel
 * @param {object} remove_modbus_channels
 * @param {number} remove_modbus_channels._item.channel_id range: [1, 32]
 * @example { "remove_modbus_channels": [ { "channel_id": 1 } ] }
 */
function removeModbusChannel(remove_modbus_channels) {
    var channel_id = remove_modbus_channels.channel_id;

    if (channel_id < 1 || channel_id > 32) {
        throw new Error("remove_modbus_channels._item.channel_id must be between 1 and 32");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xef);
    buffer.writeUInt8(0x00); // remove modbus channel
    buffer.writeUInt8(channel_id);
    return buffer.toBytes();
}

/**
 * set retransmit config
 * @since v2.0
 * @param {object} retransmit_config
 * @param {number} retransmit_config.enable values: (0: disable, 1: enable)
 * @param {number} retransmit_config.interval range: [30, 1200], unit: seconds
 * @example { "retransmit_config": { "enable": 1, "interval": 60 } }
 */
function setRetransmitConfig(retransmit_config) {
    var enable = retransmit_config.enable;
    var interval = retransmit_config.interval;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("retransmit_config.enable must be one of " + enable_values.join(", "));
    }
    if (typeof interval !== "number") {
        throw new Error("retransmit_config.interval must be a number");
    }
    if (interval < 30 || interval > 1200) {
        throw new Error("retransmit_config.interval must be in range [30, 1200]");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x0d);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt16LE(interval);
    return buffer.toBytes();
}

/**
 * set resend interval
 * @since v2.0
 * @param {number} resend_interval unit: second, range: [30, 1200]
 * @example { "resend_interval": 60 }
 */
function setResendInterval(resend_interval) {
    if (typeof resend_interval !== "number") {
        throw new Error("resend_interval must be a number");
    }
    if (resend_interval < 30 || resend_interval > 1200) {
        throw new Error("resend_interval must be in range [30, 1200]");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x0e);
    buffer.writeUInt16LE(resend_interval);
    return buffer.toBytes();
}

/**
 * set retransmit enable
 * @param {number} retransmit_enable values: (0: disable, 1: enable)
 * @example { "retransmit_enable": 1 }
 */
function setRetransmitEnable(retransmit_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(retransmit_enable) === -1) {
        throw new Error("retransmit_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x69);
    buffer.writeUInt8(getValue(enable_map, retransmit_enable));
    return buffer.toBytes();
}

/**
 * history enable
 * @param {number} history_enable values: (0: disable, 1: enable)
 * @example { "history_enable": 1 }
 */
function setHistoryEnable(history_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(history_enable) === -1) {
        throw new Error("history_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x68);
    buffer.writeUInt8(getValue(enable_map, history_enable));
    return buffer.toBytes();
}

/**
 * fetch history
 * @since v2.0
 * @param {object} fetch_history
 * @param {number} fetch_history.start_time
 * @param {number} fetch_history.end_time
 * @example { "fetch_history": { "start_time": 1609459200, "end_time": 1609545600 } }
 */
function fetchHistory(fetch_history) {
    var start_time = fetch_history.start_time;
    var end_time = fetch_history.end_time || 0;

    if (typeof start_time !== "number") {
        throw new Error("fetch_history.start_time must be a number");
    }
    if (end_time && typeof end_time !== "number") {
        throw new Error("fetch_history.end_time must be a number");
    }
    if (end_time && start_time > end_time) {
        throw new Error("fetch_history.start_time must be less than fetch_history.end_time");
    }

    var buffer;
    if (end_time === 0) {
        buffer = new Buffer(6);
        buffer.writeUInt8(0xfd);
        buffer.writeUInt8(0x6b);
        buffer.writeUInt32LE(start_time);
    } else {
        buffer = new Buffer(10);
        buffer.writeUInt8(0xfd);
        buffer.writeUInt8(0x6c);
        buffer.writeUInt32LE(start_time);
        buffer.writeUInt32LE(end_time);
    }

    return buffer.toBytes();
}

/**
 * clear history
 * @param {number} clear_history values: (0: no, 1: yes)
 * @example { "clear_history": 1 }
 */
function clearHistory(clear_history) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(clear_history) === -1) {
        throw new Error("clear_history must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, clear_history) === 0) {
        return [];
    }
    return [0xff, 0x27, 0x01];
}

/**
 * set batch enable rules
 * @param {object} batch_enable_rules
 * @param {number} batch_enable_rules.rule_1 values: (0: no, 1: yes)
 * @param {number} batch_enable_rules.rule_x values: (0: no, 1: yes)
 * @param {number} batch_enable_rules.rule_16 values: (0: no, 1: yes)
 * @example { "batch_enable_rules": { "rule_1": 1, "rule_15": 1, "rule_16": 1 } }
 */
function setBatchEnableRules(batch_enable_rules) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    var rules_offset = { rule_1: 0, rule_2: 1, rule_3: 2, rule_4: 3, rule_5: 4, rule_6: 5, rule_7: 6, rule_8: 7, rule_9: 8, rule_10: 9, rule_11: 10, rule_12: 11, rule_13: 12, rule_14: 13, rule_15: 14, rule_16: 15 };

    var data = 0x00;
    for (var key in rules_offset) {
        if (key in batch_enable_rules) {
            if (yes_no_values.indexOf(batch_enable_rules[key]) === -1) {
                throw new Error("batch_enable_rules." + key + " must be one of " + yes_no_values.join(", "));
            }
            data |= getValue(yes_no_map, batch_enable_rules[key]) << rules_offset[key];
        }
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x76);
    buffer.writeUInt16LE(data);
    buffer.writeUInt8(0x01);
    return buffer.toBytes();
}

/**
 * set batch disable rules
 * @param {object} batch_disable_rules
 * @param {number} batch_disable_rules.rule_1 values: (0: no, 1: yes)
 * @param {number} batch_disable_rules.rule_x values: (0: no, 1: yes)
 * @param {number} batch_disable_rules.rule_16 values: (0: no, 1: yes)
 * @example { "batch_disable_rules": { "rule_1": 1, "rule_15": 1, "rule_16": 1 } }
 */
function setBatchDisableRules(batch_disable_rules) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    var rules_offset = { rule_1: 0, rule_2: 1, rule_3: 2, rule_4: 3, rule_5: 4, rule_6: 5, rule_7: 6, rule_8: 7, rule_9: 8, rule_10: 9, rule_11: 10, rule_12: 11, rule_13: 12, rule_14: 13, rule_15: 14, rule_16: 15 };

    var data = 0x00;
    for (var key in rules_offset) {
        if (key in batch_disable_rules) {
            if (yes_no_values.indexOf(batch_disable_rules[key]) === -1) {
                throw new Error("batch_disable_rules." + key + " must be one of " + yes_no_values.join(", "));
            }
            data |= getValue(yes_no_map, batch_disable_rules[key]) << rules_offset[key];
        }
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x76);
    buffer.writeUInt16LE(data);
    buffer.writeUInt8(0x02);
    return buffer.toBytes();
}

/**
 * set batch remove rules
 * @param {object} batch_remove_rules
 * @param {number} batch_remove_rules.rule_1 values: (0: no, 1: yes)
 * @param {number} batch_remove_rules.rule_x values: (0: no, 1: yes)
 * @param {number} batch_remove_rules.rule_16 values: (0: no, 1: yes)
 * @example { "batch_remove_rules": { "rule_1": 1, "rule_15": 1, "rule_16": 1 } }
 */
function setBatchRemoveRules(batch_remove_rules) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    var rules_offset = { rule_1: 0, rule_2: 1, rule_3: 2, rule_4: 3, rule_5: 4, rule_6: 5, rule_7: 6, rule_8: 7, rule_9: 8, rule_10: 9, rule_11: 10, rule_12: 11, rule_13: 12, rule_14: 13, rule_15: 14, rule_16: 15 };

    var data = 0x00;
    for (var key in rules_offset) {
        if (key in batch_remove_rules) {
            if (yes_no_values.indexOf(batch_remove_rules[key]) === -1) {
                throw new Error("batch_remove_rules." + key + " must be one of " + yes_no_values.join(", "));
            }
            data |= getValue(yes_no_map, batch_remove_rules[key]) << rules_offset[key];
        }
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x76);
    buffer.writeUInt16LE(data);
    buffer.writeUInt8(0x03);
    return buffer.toBytes();
}

/**
 * query rule config
 * @param {number} query_rule_config range: [1, 16]
 * @example { "query_rule_config": 1 }
 */
function queryRuleConfig(query_rule_config) {
    if (typeof query_rule_config !== "number") {
        throw new Error("query_rule_config must be a number");
    }
    if (query_rule_config < 1 || query_rule_config > 16) {
        throw new Error("query_rule_config must be in range [1, 16]");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x77);
    buffer.writeUInt8(query_rule_config);
    return buffer.toBytes();
}

/**
 * set rule config
 * @param {object} rule_config
 * @param {number} rule_config._item.rule_id range: [1, 16]
 * @param {number} rule_config._item.enable values: (0: disable, 1: enable)
 * @param {object} rule_config._item.condition
 * @param {Array} rule_config._item.action
 * @example { "rule_config": [{ "rule_id": 1, "enable": 1, "condition": { "type": 1, "time_condition": { "mode": 0, "week_mask": 0, "day_mask": 0, "hour": 0, "minute": 0 } }, "action": [{ "type": 1, "message_action": { "message": "Hello, world!" } }, { "type": 1, "message_action": { "message": "Hello, world!" } }, { "type": 1, "message_action": { "message": "Hello, world!" } }]     } }] }
 */
function setRuleConfig(rule_config) {
    var enable = rule_config.enable;
    var rule_id = rule_config.rule_id;
    var condition = rule_config.condition;
    var action = rule_config.action;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("rule_config._item.enable must be one of " + enable_values.join(", "));
    }
    if (rule_id < 1 || rule_id > 16) {
        throw new Error("rule_config._item.rule_id must be in range [1, 16]");
    }

    var chn_data = 0x00;
    chn_data |= getValue(enable_map, enable) << 7;
    chn_data |= rule_id;

    var encoded = [];
    if ("condition" in rule_config) {
        var data = writeCondition(condition);
        var buffer = new Buffer(3 + data.length);
        buffer.writeUInt8(0xf9);
        buffer.writeUInt8(0x7d);
        buffer.writeUInt8(chn_data);
        buffer.writeBytes(data);
        encoded = encoded.concat(buffer.toBytes());
    }
    if ("action" in rule_config) {
        for (var i = 0; i < action.length; i++) {
            var data = writeAction(action[i]);
            var buffer = new Buffer(3 + data.length);
            buffer.writeUInt8(0xf9);
            buffer.writeUInt8(0x7d);
            buffer.writeUInt8(chn_data);
            buffer.writeBytes(data);
            encoded = encoded.concat(buffer.toBytes());
        }
    }
    return encoded;
}

/**
 * encode condition
 * @param {object} condition
 * @param {number} condition.type values: (0: none, 1: time, 2: value, 3: modbus_cmd, 4: message, 5: d2d, 6: reboot)
 * @param {object} condition.time_condition
 * @param {object} condition.modbus_value_condition
 * @param {object} condition.modbus_cmd_condition
 * @param {object} condition.message_condition
 * @param {object} condition.d2d_condition
 * @param {object} condition.reboot_condition
 * @example { "condition": { "type": 1, "time_condition": { } } }
 */
function writeCondition(condition) {
    var condition_type = condition.type;

    var condition_map = { 0: "none", 1: "time", 2: "modbus_value", 3: "modbus_cmd", 4: "message", 5: "d2d", 6: "reboot" };
    var condition_values = getValues(condition_map);
    if (condition_values.indexOf(condition_type) === -1) {
        throw new Error("condition.type must be one of " + condition_values.join(", "));
    }

    var params_data = [];
    var condition_value = getValue(condition_map, condition_type);
    switch (condition_value) {
        case 0x00: // NONE CONDITION
            break;
        case 0x01: // TIME CONDITION
            params_data = writeTimeCondition(condition.time_condition);
            break;
        case 0x02: // MODBUS VALUE CONDITION
            params_data = writeModbusValueCondition(condition.modbus_value_condition);
            break;
        case 0x03: // MODBUS CMD CONDITION
            params_data = writeModbusCmdCondition(condition.modbus_cmd_condition);
            break;
        case 0x04: // MESSAGE CONDITION
            params_data = writeMessageCondition(condition.message_condition);
            break;
        case 0x05: // D2D CONDITION
            params_data = writeD2DCondition(condition.d2d_condition);
            break;
        case 0x06: // REBOOT CONDITION
            break;
    }

    var condition_data = 0x00;
    condition_data |= 0 << 7; // condition type
    condition_data |= 1 << 4; // condition id
    condition_data |= getValue(condition_map, condition_type);

    var buffer = new Buffer(1 + params_data.length);
    buffer.writeUInt8(condition_data);
    if (params_data.length > 0) {
        buffer.writeBytes(params_data);
    }
    return buffer.toBytes();
}

/**
 * write time condition
 * @param {object} time_condition
 * @param {number} time_condition.mode values: (0: weekdays, 1: days)
 * @param {Array} time_condition.weekdays range: [1, 7]
 * @param {Array} time_condition.days range: [1, 31]
 * @param {number} time_condition.hour range: [0, 23]
 * @param {number} time_condition.minute range: [0, 59]
 * @example { "time_condition": { "mode": 0, "weekdays": [1, 2, 3, 4, 5], "days": [1, 2, 3, 4, 5], "hour": 8, "minute": 30 } }
 */
function writeTimeCondition(time_condition) {
    var mode = time_condition.mode;
    var weekdays = time_condition.weekdays;
    var days = time_condition.days;
    var hour = time_condition.hour;
    var minute = time_condition.minute;

    // validate values
    var cycle_mode_map = { 0: "weekdays", 1: "days" };
    var cycle_mode_values = getValues(cycle_mode_map);
    if (cycle_mode_values.indexOf(mode) === -1) {
        throw new Error("rule_config._item.condition.time_condition.mode must be one of " + cycle_mode_values.join(", "));
    }
    if ("weekdays" in time_condition) {
        for (var i = 0; i < weekdays.length; i++) {
            if (weekdays[i] < 1 || weekdays[i] > 7) {
                throw new Error("rule_config._item.condition.time_condition.weekdays must be in range [1, 7]");
            }
        }
    }
    if ("days" in time_condition) {
        for (var i = 0; i < days.length; i++) {
            if (days[i] < 1 || days[i] > 31) {
                throw new Error("rule_config._item.condition.time_condition.days must be in range [1, 31]");
            }
        }
    }
    if (hour < 0 || hour > 23) {
        throw new Error("rule_config._item.condition.time_condition.hour must be in range [0, 23]");
    }
    if (minute < 0 || minute > 59) {
        throw new Error("rule_config._item.condition.time_condition.minute must be in range [0, 59]");
    }

    // encode
    var mask = 0x00;
    if ("weekdays" in time_condition) {
        for (var i = 0; i < weekdays.length; i++) {
            mask |= 1 << (weekdays[i] - 1);
        }
    } else if ("days" in time_condition) {
        for (var i = 0; i < days.length; i++) {
            mask |= 1 << (days[i] - 1);
        }
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(getValue(cycle_mode_map, mode));
    buffer.writeUInt32LE(mask);
    buffer.writeUInt8(hour);
    buffer.writeUInt8(minute);
    return buffer.toBytes();
}

/**
 * write modbus value condition
 * @param {object} modbus_value_condition
 * @param {number} modbus_value_condition.channel_id
 * @param {number} modbus_value_condition.condition values: (0: false, 1: true, 2: below, 3: above, 4: between, 5: outside, 6: change_with_time, 7: change_without_time)
 * @param {number} modbus_value_condition.holding_mode values: (0: below, 1: above)
 * @param {number} modbus_value_condition.min
 * @param {number} modbus_value_condition.max
 * @param {number} modbus_value_condition.mutation
 * @param {number} modbus_value_condition.mutation_duration
 * @param {number} modbus_value_condition.continue_time
 * @param {number} modbus_value_condition.lock_time
 * @example { "modbus_value_condition": { "condition": 1, "min": 1, "max": 2, "mutation": 0 } }
 */
function writeModbusValueCondition(modbus_value_condition) {
    var channel_id = modbus_value_condition.channel_id;
    var condition = modbus_value_condition.condition;
    var holding_mode = modbus_value_condition.holding_mode;
    var threshold_min = modbus_value_condition.threshold_min || 0;
    var threshold_max = modbus_value_condition.threshold_max || 0;
    var mutation = modbus_value_condition.mutation || 0;
    var mutation_duration = modbus_value_condition.mutation_duration || 0;
    var continue_time = modbus_value_condition.continue_time || 0;
    var lock_time = modbus_value_condition.lock_time || 0;

    // validate values
    var condition_map = { 0: "false", 1: "true", 2: "below", 3: "above", 4: "between", 5: "outside", 6: "change_with_time", 7: "change_without_time" };
    var condition_values = getValues(condition_map);
    if (condition_values.indexOf(condition) === -1) {
        throw new Error("rule_config._item.condition.modbus_value_condition.condition must be one of " + condition_values.join(", "));
    }

    var condition_value = getValue(condition_map, condition);
    if (condition_value < 5) {
        var holding_mode_map = { 0: "below", 1: "above" };
        var holding_mode_values = getValues(holding_mode_map);
        if (holding_mode_values.indexOf(holding_mode) === -1) {
            throw new Error("rule_config._item.condition.modbus_value_condition.holding_mode must be one of " + holding_mode_values.join(", "));
        }
    }
    // value below condition (min, continue_time, lock_time)
    if (condition_value === 2 && !("min" in modbus_value_condition) && !("continue_time" in modbus_value_condition) && !("lock_time" in modbus_value_condition)) {
        throw new Error("rule_config._item.condition.modbus_value_condition.min and rule_config._item.condition.modbus_value_condition.continue_time are required");
    }
    // value above condition (max, continue_time, lock_time)
    if (condition_value === 3 && !("max" in modbus_value_condition) && !("continue_time" in modbus_value_condition) && !("lock_time" in modbus_value_condition)) {
        throw new Error("rule_config._item.condition.modbus_value_condition.max and rule_config._item.condition.modbus_value_condition.continue_time are required");
    }
    // value between condition (min, max, continue_time, lock_time)
    if (condition_value === 4 && !("min" in modbus_value_condition) && !("max" in modbus_value_condition) && !("continue_time" in modbus_value_condition) && !("lock_time" in modbus_value_condition)) {
        throw new Error("rule_config._item.condition.modbus_value_condition.min and rule_config._item.condition.modbus_value_condition.max are required");
    }
    // value outside condition (min, max, continue_time, lock_time)
    if (condition_value === 5 && !("min" in modbus_value_condition) && !("max" in modbus_value_condition) && !("continue_time" in modbus_value_condition) && !("lock_time" in modbus_value_condition)) {
        throw new Error("rule_config._item.condition.modbus_value_condition.min and rule_config._item.condition.modbus_value_condition.max are required");
    }
    // change with time condition (mutation, mutation_duration)
    if (condition_value === 6 && !("mutation" in modbus_value_condition) && !("mutation_duration" in modbus_value_condition)) {
        throw new Error("rule_config._item.condition.modbus_value_condition.mutation and rule_config._item.condition.modbus_value_condition.mutation_duration are required");
    }
    // change without time condition
    if (condition_value === 7 && !("mutation" in modbus_value_condition)) {
        throw new Error("rule_config._item.condition.modbus_value_condition.mutation is required");
    }

    var holding_mode_value = 0x00;
    if (condition_value < 5) {
        holding_mode_value = getValue(holding_mode_map, holding_mode);
    }
    // encode
    var condition_data = 0x00;
    condition_data |= getValue(condition_map, condition);
    condition_data |= holding_mode_value << 4;
    var value_1 = 0x00;
    var value_2 = 0x00;
    // condition(below, between)
    if (condition_value === 2 || condition_value === 4) {
        value_1 = threshold_min;
    } else if (condition_value === 3 || condition_value === 4) {
        value_2 = threshold_max;
    } else if (condition_value === 6 || condition_value === 7) {
        value_1 = mutation_duration;
        value_2 = mutation;
    }

    var buffer = new Buffer(18);
    buffer.writeUInt8(channel_id);
    buffer.writeUInt8(condition_data);
    buffer.writeUInt32LE(continue_time);
    buffer.writeUInt32LE(lock_time);
    buffer.writeFloatLE(value_1);
    buffer.writeFloatLE(value_2);
    return buffer.toBytes();
}

/**
 * write modbus cmd condition
 * @param {object} modbus_cmd_condition
 * @param {string} modbus_cmd_condition.cmd
 * @example { "modbus_cmd_condition": { "cmd": "1234567890" } }
 */
function writeModbusCmdCondition(modbus_cmd_condition) {
    var cmd = modbus_cmd_condition.cmd;

    // validate values
    if (typeof cmd !== "string") {
        throw new Error("modbus_cmd_condition.cmd must be a string");
    }
    if (cmd.length > 48) {
        throw new Error("modbus_cmd_condition.cmd must be less than 48 characters");
    }
    if (!/^[0-9a-fA-F]+$/.test(cmd)) {
        throw new Error("modbus_cmd_condition.cmd must be hex string [0-9a-fA-F]");
    }

    // encode
    var buffer = new Buffer(1 + cmd.length);
    buffer.writeUInt8(cmd.length);
    buffer.writeASCII(cmd);
    return buffer.toBytes();
}

/**
 * write message condition
 * @param {object} message_condition
 * @param {string} message_condition.message
 * @example { "message_condition": { "message": "1234567890" } }
 */
function writeMessageCondition(message_condition) {
    var message = message_condition.message;

    // validate values
    if (typeof message !== "string") {
        throw new Error("message_condition.message must be a string");
    }
    if (message.length > 48) {
        throw new Error("message_condition.message must be less than 48 characters");
    }
    if (!/^[0-9a-zA-Z,.;:!? ]+$/.test(message)) {
        throw new Error("message_condition.message must be hex string [0-9a-zA-Z,.;:!? ]");
    }

    // encode
    var buffer = new Buffer(1 + message.length);
    buffer.writeUInt8(message.length);
    buffer.writeASCII(message);
    return buffer.toBytes();
}

/**
 * write d2d condition
 * @param {object} d2d_condition
 * @param {string} d2d_condition.d2d_cmd
 * @param {number} d2d_condition.d2d_status values: (0: any, 1: on, 2: off)
 * @example { "d2d_condition": { "d2d_cmd": "1234", "d2d_status": 0 } }
 */
function writeD2DCondition(d2d_condition) {
    var d2d_cmd = d2d_condition.d2d_cmd;
    var d2d_status = d2d_condition.d2d_status;

    // validate values
    var d2d_status_map = { 0: "any", 1: "on", 2: "off" };
    var d2d_status_values = getValues(d2d_status_map);
    if (d2d_status_values.indexOf(d2d_status) === -1) {
        throw new Error("rule_config._item.condition.d2d_condition.d2d_status must be one of " + d2d_status_values.join(", "));
    }

    // encode
    var buffer = new Buffer(3);
    buffer.writeD2DCommand(d2d_cmd, "0000");
    buffer.writeUInt8(getValue(d2d_status_map, d2d_status));
    return buffer.toBytes();
}

/**
 * write action
 * @param {object} action
 * @param {number} action.index range: [1, 3]
 * @param {number} action.type values: (0: none, 1: message, 2: d2d, 3: modbus_cmd, 4: report_status, 5: report_alarm, 6: reboot)
 * @param {number} action.delay_time
 * @param {object} action.message_action
 * @param {object} action.d2d_action
 * @param {object} action.modbus_cmd_action
 * @param {object} action.report_status_action
 * @param {object} action.report_alarm_action
 * @param {object} action.reboot_action
 * @param {number} action.delay_time
 * @example { "action": { "type": 1, "delay_time": 1000, "message_action": { "message": "1234567890" } } }
 */
function writeAction(action) {
    var index = action.index;
    var type = action.type;
    var delay_time = action.delay_time;

    var action_map = { 0: "none", 1: "message", 2: "d2d", 3: "modbus_cmd", 4: "report_status", 5: "report_alarm", 6: "reboot" };
    var action_values = getValues(action_map);
    if (action_values.indexOf(type) === -1) {
        throw new Error("rule_config._item.action.type must be one of " + action_values.join(", "));
    }

    var action_type_value = getValue(action_map, type);
    var params_data = [];
    switch (action_type_value) {
        case 0x00:
            break;
        case 0x01: // MESSAGE ACTION
            params_data = writeMessageAction(action.message_action);
            break;
        case 0x02: // D2D ACTION
            params_data = writeD2DAction(action.d2d_action);
            break;
        case 0x03: // MODBUS CMD ACTION
            params_data = writeModbusAction(action.modbus_cmd_action);
            break;
        case 0x04: // REPORT STATUS ACTION
            break;
        case 0x05: // REPORT ALARM ACTION
            params_data = writeReportAlarmAction(action.report_alarm_action);
            break;
        case 0x06: // REBOOT ACTION
            break;
        default:
            throw new Error("rule_config._item.action.type must be one of " + action_values.join(", "));
    }

    var action_data = 0x00;
    action_data |= 1 << 7; // action type
    action_data |= index << 4; // action id
    action_data |= action_type_value;

    var buffer = new Buffer(5 + params_data.length);
    buffer.writeUInt8(action_data);
    buffer.writeUInt32LE(delay_time);
    if (params_data.length > 0) {
        buffer.writeBytes(params_data);
    }
    return buffer.toBytes();
}

/**
 * write message action
 * @param {object} message_action
 * @param {string} message_action.message range: [1, 48]
 * @example { "message_action": { "message": "1234567890" } }
 */
function writeMessageAction(message_action) {
    var message = message_action.message;

    // validate values
    if (typeof message !== "string") {
        throw new Error("message_action.message must be a string");
    }
    if (message.length < 1 || message.length > 48) {
        throw new Error("message_action.message must be in range [1, 48]");
    }
    if (!/^[0-9a-zA-Z,.;:!? ]+$/.test(message)) {
        throw new Error("message_action.message must be hex string [0-9a-zA-Z,.;:!? ]");
    }

    // encode
    var buffer = new Buffer(1 + message.length);
    buffer.writeUInt8(message.length);
    buffer.writeASCII(message);
    return buffer.toBytes();
}

/**
 * write d2d action
 * @param {object} d2d_action
 * @param {string} d2d_action.d2d_cmd
 * @example { "d2d_action": { "d2d_cmd": "1234567890" } }
 */
function writeD2DAction(d2d_action) {
    var d2d_cmd = d2d_action.d2d_cmd || "";

    // validate values
    if (typeof d2d_cmd !== "string") {
        throw new Error("d2d_action.d2d_cmd must be a string");
    }
    if (d2d_cmd.length > 48) {
        throw new Error("d2d_action.d2d_cmd must be less than 48 characters");
    }
    if (!/^[0-9a-fA-F]+$/.test(d2d_cmd)) {
        throw new Error("d2d_action.d2d_cmd must be hex string [0-9a-fA-F]");
    }

    // encode
    var buffer = new Buffer(2);
    buffer.writeD2DCommand(d2d_cmd, "0000");
    return buffer.toBytes();
}

/**
 * write modbus action
 * @param {object} modbus_cmd_action
 * @param {string} modbus_cmd_action.cmd
 * @example { "modbus_cmd_action": { "cmd": 1 } }
 */
function writeModbusAction(modbus_cmd_action) {
    var cmd = modbus_cmd_action.cmd;

    // validate values
    if (typeof cmd !== "string") {
        throw new Error("modbus_cmd_action.cmd must be a string");
    }
    if (cmd.length > 48) {
        throw new Error("modbus_cmd_action.cmd must be less than 48 characters");
    }
    if (!/^[0-9a-fA-F]+$/.test(cmd)) {
        throw new Error("modbus_cmd_action.cmd must be hex string [0-9a-fA-F]");
    }

    // encode
    var buffer = new Buffer(1 + cmd.length);
    buffer.writeUInt8(cmd.length);
    buffer.writeASCII(cmd);
    return buffer.toBytes();
}

/**
 * write report alarm action
 * @param {object} report_alarm_action
 * @param {number} report_alarm_action.release_enable values: (0: disable, 1: enable)
 * @example { "report_alarm_action": { "release_enable": 1 } }
 */
function writeReportAlarmAction(report_alarm_action) {
    var release_enable = report_alarm_action.release_enable;

    // validate values
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(release_enable) === -1) {
        throw new Error("rule_config._item.action.report_alarm_action.release_enable must be one of " + enable_values.join(", "));
    }

    // encode
    var buffer = new Buffer(1);
    buffer.writeUInt8(getValue(enable_map, release_enable));
    return buffer.toBytes();
}

function Buffer(size) {
    this.buffer = new Array(size);
    this.offset = 0;

    for (var i = 0; i < size; i++) {
        this.buffer[i] = 0;
    }
}

Buffer.prototype._write = function (value, byteLength, isLittleEndian) {
    for (var index = 0; index < byteLength; index++) {
        var shift = isLittleEndian ? index << 3 : (byteLength - 1 - index) << 3;
        this.buffer[this.offset + index] = (value & (0xff << shift)) >> shift;
    }
};

Buffer.prototype.writeUInt8 = function (value) {
    this._write(value, 1, true);
    this.offset += 1;
};

Buffer.prototype.writeInt8 = function (value) {
    this._write(value < 0 ? value + 0x100 : value, 1, true);
    this.offset += 1;
};

Buffer.prototype.writeUInt16LE = function (value) {
    this._write(value, 2, true);
    this.offset += 2;
};

Buffer.prototype.writeInt16LE = function (value) {
    this._write(value < 0 ? value + 0x10000 : value, 2, true);
    this.offset += 2;
};

Buffer.prototype.writeUInt32LE = function (value) {
    this._write(value, 4, true);
    this.offset += 4;
};

Buffer.prototype.writeInt32LE = function (value) {
    this._write(value < 0 ? value + 0x100000000 : value, 4, true);
    this.offset += 4;
};

Buffer.prototype.writeFloatLE = function (value) {
    var sign = value < 0 ? 1 : 0;
    var absValue = Math.abs(value);

    if (absValue === 0) {
        this._write(0, 4, true);
    } else if (Number.isNaN(absValue)) {
        this._write(0x7fc00000, 4, true);
    } else if (absValue === Infinity) {
        this._write(0x7f800000, 4, true);
    } else {
        var exponent = Math.floor(Math.log(absValue) / Math.LN2);
        var mantissa = absValue / Math.pow(2, exponent) - 1;

        var biasedExponent = exponent + 127; // Bias

        var exponentBits = biasedExponent << 23;
        var mantissaBits = Math.round(mantissa * Math.pow(2, 23));

        var floatBits = (sign << 31) | exponentBits | mantissaBits;

        this._write(floatBits, 4, true);
    }
    this.offset += 4;
};

Buffer.prototype.writeASCII = function (value) {
    for (var i = 0; i < value.length; i++) {
        this.buffer[this.offset + i] = value.charCodeAt(i);
    }
    this.offset += value.length;
};

Buffer.prototype.writeD2DCommand = function (value, defaultValue) {
    if (typeof value !== "string") {
        value = defaultValue;
    }
    if (value.length !== 4) {
        throw new Error("d2d_cmd length must be 4");
    }
    this.buffer[this.offset] = parseInt(value.substr(2, 2), 16);
    this.buffer[this.offset + 1] = parseInt(value.substr(0, 2), 16);
    this.offset += 2;
};

Buffer.prototype.writeBytes = function (bytes) {
    for (var i = 0; i < bytes.length; i++) {
        this.buffer[this.offset + i] = bytes[i];
    }
    this.offset += bytes.length;
};

Buffer.prototype.toBytes = function () {
    return this.buffer;
};

function getValues(map) {
    var values = [];
    for (var key in map) {
        values.push(RAW_VALUE ? parseInt(key) : map[key]);
    }
    return values;
}

function getValue(map, value) {
    if (RAW_VALUE) return value;

    for (var key in map) {
        if (map[key] === value) {
            return parseInt(key);
        }
    }

    throw new Error("not match in " + JSON.stringify(map));
}
