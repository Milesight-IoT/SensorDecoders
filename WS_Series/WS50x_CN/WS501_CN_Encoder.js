/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product WS501_CN
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
    if ("report_interval" in payload) {
        encoded = encoded.concat(setReportInterval(payload.report_interval));
    }
    if ("report_status" in payload) {
        encoded = encoded.concat(reportStatus(payload.report_status));
    }
    if ("report_attribute" in payload) {
        encoded = encoded.concat(reportAttribute(payload.report_attribute));
    }
    if ("switch_1" in payload) {
        encoded = encoded.concat(updateSwitch(1, payload.switch_1));
    }
    if ("delay_task" in payload) {
        encoded = encoded.concat(setDelayTask(payload.delay_task));
    }
    if ("cancel_delay_task" in payload) {
        encoded = encoded.concat(cancelDelayTask(payload.cancel_delay_task));
    }
    if ("led_mode" in payload) {
        encoded = encoded.concat(setLedMode(payload.led_mode));
    }
    if ("child_lock_config" in payload) {
        encoded = encoded.concat(setChildLockConfig(payload.child_lock_config));
    }
    if ("reset_button_enable" in payload) {
        encoded = encoded.concat(setResetButtonEnable(payload.reset_button_enable));
    }
    if ("sync_time" in payload) {
        encoded = encoded.concat(syncTime(payload.sync_time));
    }
    if ("time_zone" in payload) {
        encoded = encoded.concat(setTimeZone(payload.time_zone));
    }
    if ("rule_config" in payload) {
        for (var i = 0; i < payload.rule_config.length; i++) {
            var rule_config = payload.rule_config[i];
            encoded = encoded.concat(setRuleConfig(rule_config));
        }
    }
    if ("query_rule_config_request" in payload) {
        encoded = encoded.concat(queryRuleConfig(payload.query_rule_config_request));
    }
    if ("query_all_rule_config_request" in payload) {
        encoded = encoded.concat(queryAllRuleConfig(payload.query_all_rule_config_request));
    }

    return encoded;
}

/**
 * reboot
 * @param {number} reboot values: (0: no, 1: yes)
 * @example { "reboot": 1 }
 */
function reboot(reboot) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(reboot) === -1) {
        throw new Error("reboot must be one of: " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, reboot) === 0) {
        return [];
    }
    return [0xff, 0x10, 0xff];
}

/**
 * report interval configuration
 * @param {number} report_interval uint: second
 * @example { "report_interval": 1200 }
 */
function setReportInterval(report_interval) {
    if (typeof report_interval !== "number") {
        throw new Error("report_interval must be a number");
    }
    if (report_interval <= 60) {
        throw new Error("report_interval must be greater than 60");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x03);
    buffer.writeUInt16LE(report_interval);
    return buffer.toBytes();
}

/**
 * report status
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
 * report attribute
 * @param {number} report_attribute values: (0: no, 1: yes)
 * @example { "report_attribute": 1 }
 */
function reportAttribute(report_attribute) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(report_attribute) === -1) {
        throw new Error("report_attribute must be one of: " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, report_attribute) === 0) {
        return [];
    }
    return [0xff, 0x2c, 0xff];
}

/**
 * button control
 * @param {number} id, values: (1: switch_1)
 * @param {number} state, values: (0: off, 1: on)
 * @example { "switch_1": 1 }
 */
function updateSwitch(id, state) {
    var on_off_map = { 0: "off", 1: "on" };
    var on_off_values = getValues(on_off_map);
    if (on_off_values.indexOf(state) === -1) {
        throw new Error("switch_" + id + " must be one of: " + on_off_values.join(", "));
    }

    var on_off = on_off_values.indexOf(state);
    var mask = 0x01 << (id - 1);
    var ctrl = on_off << (id - 1);
    var data = (mask << 4) + ctrl;
    var buffer = new Buffer(3);
    buffer.writeUInt8(0x08);
    buffer.writeUInt8(data);
    buffer.writeUInt8(0xff);
    return buffer.toBytes();
}

/**
 * set delay task
 * @param {object} delay_task
 * @param {number} delay_task.switch_1 values: (0: off, 1: on)
 * @param {number} delay_task.frame_count values: (0-255, 0: force control)
 * @param {number} delay_task.delay_time unit: second
 * @example { "delay_task": { "switch_1": 1, "frame_count": 1, "delay_time": 1 } }
 */
function setDelayTask(delay_task) {
    var frame_count = delay_task.frame_count;
    var delay_time = delay_task.delay_time;

    var on_off_map = { 0: "off", 1: "on" };
    var on_off_values = getValues(on_off_map);
    if (frame_count < 0 || frame_count > 255) {
        throw new Error("delay_task.frame_count must be between 0 and 255");
    }
    if (typeof delay_time !== "number") {
        throw new Error("delay_task.delay_time must be a number");
    }

    var data = 0x00;
    var switch_bit_offset = { switch_1: 0 };
    for (var key in switch_bit_offset) {
        if (key in delay_task) {
            if (on_off_values.indexOf(delay_task[key]) === -1) {
                throw new Error("delay_task." + key + " must be one of: " + on_off_values.join(", "));
            }

            data |= 1 << (switch_bit_offset[key] + 4);
            data |= getValue(on_off_map, delay_task[key]) << switch_bit_offset[key];
        }
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x22);
    buffer.writeUInt8(frame_count);
    buffer.writeUInt16LE(delay_time);
    buffer.writeUInt8(data);
    return buffer.toBytes();
}

/**
 * cancel delay task
 * @param {number} cancel_delay_task values: (delay_task.frame_count)
 * @example { "cancel_delay_task": 1 }
 */
function cancelDelayTask(cancel_delay_task) {
    if (typeof cancel_delay_task !== "number") {
        throw new Error("cancel_delay_task must be a number");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x23);
    buffer.writeUInt8(cancel_delay_task);
    buffer.writeUInt8(0x00);
    return buffer.toBytes();
}

/**
 * set led mode
 * @param {number} led_mode, values: (0: off, 1: on_inverted, 2: on_synced)
 * @example { "led_mode": 1 }
 */
function setLedMode(led_mode) {
    var led_mode_map = { 0: "off", 1: "on_inverted", 2: "on_synced" };
    var led_mode_values = getValues(led_mode_map);
    if (led_mode_values.indexOf(led_mode) === -1) {
        throw new Error("led_mode must be one of: " + led_mode_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x2f);
    buffer.writeUInt8(getValue(led_mode_map, led_mode));
    return buffer.toBytes();
}

/**
 * reset button configuration
 * @param {number} reset_button_enable values: (0: disable, 1: enable)
 * @example { "reset_button_enable": 0 }
 */
function setResetButtonEnable(reset_button_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(reset_button_enable) === -1) {
        throw new Error("reset_button_enable must be one of: " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x5e);
    buffer.writeUInt8(getValue(enable_map, reset_button_enable));
    return buffer.toBytes();
}

/**
 * child lock configuration
 * @param {object} child_lock_config
 * @param {number} child_lock_config.enable values: (0: disable, 1: enable)
 * @param {number} child_lock_config.lock_time value: (0: forever), unit: minute
 * @example { "child_lock_config": { "enable": 1, "lock_time": 60 } }
 */
function setChildLockConfig(child_lock_config) {
    var enable = child_lock_config.enable;
    var lock_time = child_lock_config.lock_time;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("child_lock_config.enable must be one of: " + enable_values.join(", "));
    }
    if (typeof lock_time !== "number") {
        throw new Error("child_lock_config.lock_time must be a number");
    }

    var data = 0x00;
    data |= getValue(enable_map, enable) << 15;
    data |= lock_time;
    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x25);
    buffer.writeUInt16LE(data);
    return buffer.toBytes();
}
/**
 * set rule config
 * @since v1.3
 * @param {object} rule_config
 * @param {number} rule_config.rule_id range: [1, 8]
 * @param {number} rule_config.rule_type values: (0: none, 1: enable, 2: disable)
 * @param {object} rule_config.condition
 * @param {number} rule_config.condition.monday values: (0: disable, 1: enable)
 * @param {number} rule_config.condition.tuesday values: (0: disable, 1: enable)
 * @param {number} rule_config.condition.wednesday values: (0: disable, 1: enable)
 * @param {number} rule_config.condition.thursday values: (0: disable, 1: enable)
 * @param {number} rule_config.condition.friday values: (0: disable, 1: enable)
 * @param {number} rule_config.condition.saturday values: (0: disable, 1: enable)
 * @param {number} rule_config.condition.sunday values: (0: disable, 1: enable)
 * @param {number} rule_config.condition.hour
 * @param {number} rule_config.condition.minute
 * @param {object} rule_config.action
 * @param {number} rule_config.action.switch_1 values: (0: off, 1: on)
 * @param {number} rule_config.action.child_lock values: (0: keep, 1: disable, 2: enable)
 */
function setRuleConfig(rule_config) {
    var rule_id = rule_config.rule_id;
    var rule_type = rule_config.rule_type;
    var condition = rule_config.condition;
    var action = rule_config.action;

    if (rule_id < 1 || rule_id > 8) {
        throw new Error("rule_config._item.rule_id must be between 1 and 8");
    }
    var rule_type_map = { 0: "none", 1: "enable", 2: "disable" };
    var rule_type_values = getValues(rule_type_map);
    if (rule_type_values.indexOf(rule_type) === -1) {
        throw new Error("rule_config._item.rule_type must be one of: " + rule_type_values.join(", "));
    }
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);

    var condition_day = 0x00;
    var condition_hour = 0x00;
    var condition_minute = 0x00;
    var day_bit_offset = { monday: 0, tuesday: 1, wednesday: 2, thursday: 3, friday: 4, saturday: 5, sunday: 6 };
    if (getValue(rule_type_map, rule_type) !== 0) {
        for (var key in day_bit_offset) {
            if (key in condition) {
                if (enable_values.indexOf(condition[key]) === -1) {
                    throw new Error("rule_config._item.condition." + key + " must be one of: " + enable_values.join(", "));
                }
                condition_day |= getValue(enable_map, condition[key]) << day_bit_offset[key];
            }
        }
        condition_hour = condition.hour;
        condition_minute = condition.minute;
    }

    var switch_status_map = { 0: "keep", 1: "on", 2: "off" };
    var switch_status_values = getValues(switch_status_map);
    var action_switch = 0x00;
    var switch_bit_offset = { switch_1: 0 };
    for (var key in switch_bit_offset) {
        if (key in action) {
            if (switch_status_values.indexOf(action[key]) === -1) {
                throw new Error("rule_config._item.action." + key + " must be one of: " + switch_status_values.join(", "));
            }
            action_switch |= getValue(switch_status_map, action[key]) << switch_bit_offset[key];
        }
    }

    var child_lock_map = { 0: "keep", 1: "disable", 2: "enable" };
    var child_lock_values = getValues(child_lock_map);
    var action_child_lock = 0x00;
    if ("child_lock" in action) {
        if (child_lock_values.indexOf(action.child_lock) === -1) {
            throw new Error("rule_config._item.action.child_lock must be one of: " + child_lock_values.join(", "));
        }
        action_child_lock = getValue(child_lock_map, action.child_lock);
    }

    var buffer = new Buffer(9);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x64);
    buffer.writeUInt8(rule_id);
    buffer.writeUInt8(rule_type);
    buffer.writeUInt8(condition_day);
    buffer.writeUInt8(condition_hour);
    buffer.writeUInt8(condition_minute);
    buffer.writeUInt8(action_switch);
    buffer.writeUInt8(action_child_lock);
    return buffer.toBytes();
}

/**
 * query rule config
 * @since v1.3
 * @param {object} query_rule_config_request
 * @param {number} query_rule_config_request.rule_1 values: (0: no, 1: yes)
 * @param {number} query_rule_config_request.rule_2 values: (0: no, 1: yes)
 * @param {number} query_rule_config_request.rule_3 values: (0: no, 1: yes)
 * @param {number} query_rule_config_request.rule_4 values: (0: no, 1: yes)
 * @param {number} query_rule_config_request.rule_5 values: (0: no, 1: yes)
 * @param {number} query_rule_config_request.rule_6 values: (0: no, 1: yes)
 * @param {number} query_rule_config_request.rule_7 values: (0: no, 1: yes)
 * @param {number} query_rule_config_request.rule_8 values: (0: no, 1: yes)
 * @example { "query_rule_config_request": { "rule_1": 1, "rule_2": 1, "rule_3": 1, "rule_4": 1, "rule_5": 1, "rule_6": 1, "rule_7": 1, "rule_8": 1 } }
 */
function queryRuleConfig(query_rule_config_request) {
    var channel_index_map = { rule_1: 1, rule_2: 2, rule_3: 3, rule_4: 4, rule_5: 5, rule_6: 6, rule_7: 7, rule_8: 8 };
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);

    var data = [];
    for (var key in channel_index_map) {
        if (key in query_rule_config_request) {
            if (yes_no_values.indexOf(query_rule_config_request[key]) === -1) {
                throw new Error("query_rule_config_request." + key + " must be one of " + yes_no_values.join(", "));
            }

            if (getValue(yes_no_map, query_rule_config_request[key]) === 1) {
                data.push([0xf9, 0x65, channel_index_map[key]]);
            }
        }
    }
    return data;
}

/**
 * query all rule config
 * @since v1.3
 * @param {number} query_all_rule_config_request values: (0: no, 1: yes)
 * @example { "query_all_rule_config_request": 1 }
 */
function queryAllRuleConfig(query_all_rule_config_request) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(query_all_rule_config_request) === -1) {
        throw new Error("query_all_rule_config_request must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, query_all_rule_config_request) === 0) {
        return [];
    }
    return [0xf9, 0x65, 0xff];
}

/**
 * sync time
 * @param {number} sync_time values：(0: no, 1: yes)
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
    return [0xff, 0x4a, 0xff];
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

Buffer.prototype.toBytes = function () {
    return this.buffer;
};
