/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product AM102
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
    if ("time_zone" in payload) {
        encoded = encoded.concat(setTimeZone(payload.time_zone));
    }
    if ("time_sync_enable" in payload) {
        encoded = encoded.concat(setTimeSyncEnable(payload.time_sync_enable));
    }
    if ("alarm_config" in payload) {
        encoded = encoded.concat(setAlarmConfig(payload.alarm_config));
    }
    if ("screen_display_enable" in payload) {
        encoded = encoded.concat(setScreenDisplayEnable(payload.screen_display_enable));
    }
    if ("screen_display_time_enable" in payload) {
        encoded = encoded.concat(setScreenDisplayTimeEnable(payload.screen_display_time_enable));
    }
    if ("screen_intelligent_enable" in payload) {
        encoded = encoded.concat(setScreenIntelligentEnable(payload.screen_intelligent_enable));
    }
    if ("screen_last_refresh_interval" in payload) {
        encoded = encoded.concat(setScreenLastRefreshInterval(payload.screen_last_refresh_interval));
    }
    if ("screen_refresh_interval" in payload) {
        encoded = encoded.concat(setScreenRefreshInterval(payload.screen_refresh_interval));
    }
    if ("led_indicator_mode" in payload) {
        encoded = encoded.concat(setLedIndicatorMode(payload.led_indicator_mode));
    }
    if ("hibernate_config" in payload) {
        encoded = encoded.concat(setHibernateConfig(payload.hibernate_config));
    }
    if ("reset_battery" in payload) {
        encoded = encoded.concat(resetBattery(payload.reset_battery));
    }
    if ("retransmit_enable" in payload) {
        encoded = encoded.concat(setRetransmitEnable(payload.retransmit_enable));
    }
    if ("retransmit_interval" in payload) {
        encoded = encoded.concat(setRetransmitInterval(payload.retransmit_interval));
    }
    if ("resend_interval" in payload) {
        encoded = encoded.concat(setResendInterval(payload.resend_interval));
    }
    if ("history_enable" in payload) {
        encoded = encoded.concat(setHistoryEnable(payload.history_enable));
    }
    if ("fetch_history" in payload) {
        encoded = encoded.concat(fetchHistory(payload.fetch_history));
    }
    if ("stop_transmit" in payload) {
        encoded = encoded.concat(stopTransmit(payload.stop_transmit));
    }
    if ("clear_history" in payload) {
        encoded = encoded.concat(clearHistory(payload.clear_history));
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
        throw new Error("reboot must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, reboot) === 0) {
        return [];
    }
    return [0xff, 0x10, 0xff];
}

/**
 * report interval
 * @param {number} report_interval unit: second
 * @example { "report_interval": 300 }
 */
function setReportInterval(report_interval) {
    var type = report_interval.type;
    var period_unit = report_interval.period_unit;
    var period_time = report_interval.period_time;

    var type_values = [0, 1];
    if (type_values.indexOf(type) === -1) {
        throw new Error("report_interval.type must be one of " + type_values.join(", "));
    }
    var unit_map = { 0: "second", 1: "minute" };
    var unit_keys = [0, 1];
    var unit_values = getValues(unit_map);
    if (unit_keys.indexOf(period_unit) === -1 && unit_values.indexOf(period_unit) === -1) {
        throw new Error("report_interval.period_unit must be one of " + unit_keys.join(", ") + " or " + unit_values.join(", "));
    }
    var raw_unit = typeof period_unit === "number" ? period_unit : getValue(unit_map, period_unit);
    if (typeof period_time !== "number") {
        throw new Error("report_interval.period_time must be a number");
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x8e);
    buffer.writeUInt8(type);
    buffer.writeUInt8(raw_unit);
    buffer.writeUInt16LE(period_time);
    return buffer.toBytes();
}

/**
 * set time zone
 * @param {number} time_zone unit: minute, UTC+8 -> 8 * 10 = 80
 * @example { "time_zone": 80 }
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
 * time sync enable
 * @param {number} time_sync_enable values: (0: disable, 2: enable)
 * @example { "time_sync_enable": 2 }
 */
function setTimeSyncEnable(time_sync_enable) {
    var enable_map = { 0: "disable", 2: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(time_sync_enable) == -1) {
        throw new Error("time_sync_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x3b);
    buffer.writeUInt8(getValue(enable_map, time_sync_enable));
    return buffer.toBytes();
}



/**
 * screen display enable
 * @param {number} screen_display_enable values: (0: disable, 1: enable)
 * @example { "screen_display_enable": 1 }
 */
function setScreenDisplayEnable(screen_display_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(screen_display_enable) === -1) {
        throw new Error("screen_display_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x2d);
    buffer.writeUInt8(getValue(enable_map, screen_display_enable));
    return buffer.toBytes();
}

/**
 * screen display time enable
 * @param {number} screen_display_time_enable values: (0: disable, 1: enable)
 * @example { "screen_display_time_enable": 1 }
 */
function setScreenDisplayTimeEnable(screen_display_time_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(screen_display_time_enable) === -1) {
        throw new Error("screen_display_time_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x85);
    buffer.writeUInt8(getValue(enable_map, screen_display_time_enable));
    return buffer.toBytes();
}

/**
 * screen intelligent enable
 * @param {number} screen_intelligent_enable values: (0: disable, 1: enable)
 * @example { "screen_intelligent_enable": 1 }
 */
function setScreenIntelligentEnable(screen_intelligent_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(screen_intelligent_enable) === -1) {
        throw new Error("screen_intelligent_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x56);
    buffer.writeUInt8(getValue(enable_map, screen_intelligent_enable));
    return buffer.toBytes();
}

/**
 * screen last refresh interval
 * @param {number} screen_last_refresh_interval unit: minute, range: [2, 1080]
 * @example { "screen_last_refresh_interval": 1 }
 */
function setScreenLastRefreshInterval(screen_last_refresh_interval) {
    if (screen_last_refresh_interval < 2 || screen_last_refresh_interval > 1080) {
        throw new Error("screen_last_refresh_interval must be between 2 and 1080");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x86);
    buffer.writeUInt8(screen_last_refresh_interval);
    return buffer.toBytes();
}

/**
 * screen refresh interval
 * @param {number} screen_refresh_interval unit: second, range: [1, 65535]
 * @example { "screen_refresh_interval": 1 }
 */
function setScreenRefreshInterval(screen_refresh_interval) {
    if (screen_refresh_interval < 1 || screen_refresh_interval > 65535) {
        throw new Error("screen_refresh_interval must be between 1 and 65535");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x5a);
    buffer.writeUInt16LE(screen_refresh_interval);
    return buffer.toBytes();
}

/**
 * led indicator mode
 * @param {number} led_indicator_mode values: (0: off, 2: blink)
 * @example { "led_indicator_mode": 2 }
 */
function setLedIndicatorMode(led_indicator_mode) {
    var mode_map = { 0: "off", 2: "blink" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(led_indicator_mode) === -1) {
        throw new Error("led_indicator_mode must be one of " + mode_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x2f);
    buffer.writeUInt8(getValue(mode_map, led_indicator_mode));
    return buffer.toBytes();
}


/**
 * alarm config
 * @param {object} alarm_config
 * @param {number} alarm_config.id alarm id, values: (1: temperature, 2: humidity, 3: other)
 * @param {number} alarm_config.condition values: (1: below, 2: above, 3: within, 4: below_or_above, 5: saltation, 6: primary_alarm_only, 7: secondary_alarm_only, 8: primary_and_secondary_alarm)
 * @param {number} alarm_config.max threshold max
 * @param {number} alarm_config.min threshold min
 * @param {number} alarm_config.enabled values: (0: disable, 1: enable)
 * @example { "alarm_config": { "id": 1, "condition": 2, "max": 60, "min": -20, "enabled": 1 } }
 */
function setAlarmConfig(alarm_config) {
    var id = alarm_config.id;
    var condition = alarm_config.condition;
    var max = alarm_config.max;
    var min = alarm_config.min;
    var enabled = alarm_config.enabled;

    var id_values = [1, 2, 3];
    if (id_values.indexOf(id) === -1) {
        throw new Error("alarm_config.id must be one of " + id_values.join(", "));
    }
    var condition_map = { 1: "below", 2: "above", 3: "within", 4: "below_or_above", 5: "saltation", 6: "primary_alarm_only", 7: "secondary_alarm_only", 8: "primary_and_secondary_alarm" };
    var condition_keys = [1, 2, 3, 4, 5, 6, 7, 8];
    var condition_values = getValues(condition_map);
    if (condition_keys.indexOf(condition) === -1 && condition_values.indexOf(condition) === -1) {
        throw new Error("alarm_config.condition must be one of " + condition_keys.join(", ") + " or " + condition_values.join(", "));
    }
    if (typeof max !== "number" || typeof min !== "number") {
        throw new Error("alarm_config.max and alarm_config.min must be numbers");
    }
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_keys = [0, 1];
    var enable_values = getValues(enable_map);
    if (enable_keys.indexOf(enabled) === -1 && enable_values.indexOf(enabled) === -1) {
        throw new Error("alarm_config.enabled must be one of 0, disable, 1, enable");
    }
    var raw_condition = typeof condition === "number" ? condition : getValue(condition_map, condition);
    var raw_enabled = typeof enabled === "number" ? enabled : getValue(enable_map, enabled);

    var buffer = new Buffer(9);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x0b);
    buffer.writeUInt8(id);
    buffer.writeUInt8(raw_condition);
    buffer.writeInt16LE(Math.round(max * 10));
    buffer.writeInt16LE(Math.round(min * 10));
    buffer.writeUInt8(raw_enabled);
    return buffer.toBytes();
}

/**
 * set hibernate config
 * @param {object} hibernate_config
 * @param {number} hibernate_config.enable values: (0: enable, 1: disable)
 * @param {number} hibernate_config.lora_uplink_enable values: (0: disable, 1: enable)
 * @param {number} hibernate_config.start_time unit: minute. (4:00 -> 240, 4:30 -> 270)
 * @param {number} hibernate_config.end_time unit: minute. (start_time < end_time: one day, start_time > end_time: across the day, start_time == end_time: whole day)
 * @param {object} hibernate_config.weekdays
 * @param {number} hibernate_config.weekdays.monday values: (0: disable, 1: enable)
 * @param {number} hibernate_config.weekdays.tuesday values: (0: disable, 1: enable)
 * @param {number} hibernate_config.weekdays.wednesday values: (0: disable, 1: enable)
 * @param {number} hibernate_config.weekdays.thursday values: (0: disable, 1: enable)
 * @param {number} hibernate_config.weekdays.friday values: (0: disable, 1: enable)
 * @param {number} hibernate_config.weekdays.saturday values: (0: disable, 1: enable)
 * @param {number} hibernate_config.weekdays.sunday values: (0: disable, 1: enable)
 * @example { "hibernate_config": { "enable": 1, "start_time": 240, "end_time": 270, "weekdays": { "monday": 1, "tuesday": 1, "wednesday": 1, "thursday": 1, "friday": 1, "saturday": 1, "sunday": 1 } } }
 */
function setHibernateConfig(hibernate_config) {
    var enable = hibernate_config.enable;
    var lora_uplink_enable = hibernate_config.lora_uplink_enable;
    var start_time = hibernate_config.start_time;
    var end_time = hibernate_config.end_time;
    var weekdays = hibernate_config.weekdays;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("hibernate_config.enable must be one of " + enable_values.join(", "));
    }
    if (enable_values.indexOf(lora_uplink_enable) === -1) {
        throw new Error("hibernate_config.lora_uplink_enable must be one of " + enable_values.join(", "));
    }

    var day = 0;
    var weekdays_bit_offset = { monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 7 };
    for (var key in weekdays_bit_offset) {
        if (key in weekdays) {
            if (enable_values.indexOf(weekdays[key]) === -1) {
                throw new Error("hibernate_config.weekdays." + key + " must be one of " + enable_values.join(", "));
            }
            day |= getValue(enable_map, weekdays[key]) << weekdays_bit_offset[key];
        }
    }

    var buffer = new Buffer(9);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x75);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(getValue(enable_map, lora_uplink_enable));
    buffer.writeUInt16LE(start_time);
    buffer.writeUInt16LE(end_time);
    buffer.writeUInt8(day);
    return buffer.toBytes();
}

/**
 * reset battery
 * @param {number} reset_battery values: (0: no, 1: yes)
 * @example { "reset_battery": 1 }
 */
function resetBattery(reset_battery) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(reset_battery) === -1) {
        throw new Error("reset_battery must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, reset_battery) === 0) {
        return [];
    }
    return [0xff, 0x59, 0xff];
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
 * set retransmit interval
 * @param {number} retransmit_interval unit: second, range: [1, 64800]
 * @example { "retransmit_interval": 600 }
 */
function setRetransmitInterval(retransmit_interval) {
    if (typeof retransmit_interval !== "number") {
        throw new Error("retransmit_interval must be a number");
    }
    if (retransmit_interval < 1 || retransmit_interval > 64800) {
        throw new Error("retransmit_interval must be between 1 and 64800");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x6a);
    buffer.writeUInt8(0x00);
    buffer.writeUInt16LE(retransmit_interval);
    return buffer.toBytes();
}

/**
 * set resend interval
 * @param {number} resend_interval unit: second, range: [1, 64800]
 * @example { "resend_interval": 600 }
 */
function setResendInterval(resend_interval) {
    if (typeof resend_interval !== "number") {
        throw new Error("resend_interval must be a number");
    }
    if (resend_interval < 1 || resend_interval > 64800) {
        throw new Error("resend_interval must be between 1 and 64800");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x6a);
    buffer.writeUInt8(0x01);
    buffer.writeUInt16LE(resend_interval);
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
 * @param {object} fetch_history
 * @param {number} fetch_history.start_time unit: second
 * @param {number} fetch_history.end_time unit: second
 * @example { "fetch_history": { "start_time": 1609459200, "end_time": 1609545600 } }
 */
function fetchHistory(fetch_history) {
    var start_time = fetch_history.start_time;
    var end_time = fetch_history.end_time;

    if (typeof start_time !== "number") {
        throw new Error("start_time must be a number");
    }
    if ("end_time" in fetch_history && typeof end_time !== "number") {
        throw new Error("end_time must be a number");
    }
    if ("end_time" in fetch_history && start_time > end_time) {
        throw new Error("start_time must be less than end_time");
    }

    var buffer;
    if ("end_time" in fetch_history || end_time === 0) {
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
 * history stop transmit
 * @param {number} stop_transmit values: (0: no, 1: yes)
 * @example { "stop_transmit": 1 }
 */
function stopTransmit(stop_transmit) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(stop_transmit) === -1) {
        throw new Error("stop_transmit must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, stop_transmit) === 0) {
        return [];
    }
    return [0xfd, 0x6d, 0xff];
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
    var offset = 0;
    for (var index = 0; index < byteLength; index++) {
        offset = isLittleEndian ? index << 3 : (byteLength - 1 - index) << 3;
        this.buffer[this.offset + index] = (value >> offset) & 0xff;
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

Buffer.prototype.writeUInt24LE = function (value) {
    this._write(value, 3, true);
    this.offset += 3;
};

Buffer.prototype.writeInt24LE = function (value) {
    this._write(value < 0 ? value + 0x1000000 : value, 3, true);
    this.offset += 3;
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
