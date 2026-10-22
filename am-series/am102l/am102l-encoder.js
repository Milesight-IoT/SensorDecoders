/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product AM102L
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
    if ("led_indicator_mode" in payload) {
        encoded = encoded.concat(setLedIndicatorMode(payload.led_indicator_mode));
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
    var period_unit = report_interval.period_unit;
    var period_time = report_interval.period_time;

    var unit_map = { 0: "second", 1: "minute" };
    var unit_keys = [0, 1];
    var unit_values = getValues(unit_map);
    if (unit_keys.indexOf(period_unit) === -1 && unit_values.indexOf(period_unit) === -1) {
        throw new Error("report_interval.period_unit must be one of " + unit_keys.join(", ") + " or " + unit_values.join(", "));
    }
    if (typeof period_time !== "number") {
        throw new Error("report_interval.period_time must be a number");
    }
    var raw_unit = typeof period_unit === "number" ? period_unit : parseInt(getValue(unit_map, period_unit), 10);

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x8e);
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
    var timezone_map = { "-120": "UTC-12", "-110": "UTC-11", "-100": "UTC-10", "-95": "UTC-9:30", "-90": "UTC-9", "-80": "UTC-8", "-70": "UTC-7", "-60": "UTC-6", "-50": "UTC-5", "-40": "UTC-4", "-35": "UTC-3:30", "-30": "UTC-3", "-20": "UTC-2", "-10": "UTC-1", 0: "UTC", 10: "UTC+1", 20: "UTC+2", 30: "UTC+3", 35: "UTC+3:30", 40: "UTC+4", 45: "UTC+4:30", 50: "UTC+5", 55: "UTC+5:30", 57: "UTC+5:45", 60: "UTC+6", 65: "UTC+6:30", 70: "UTC+7", 80: "UTC+8", 90: "UTC+9", 95: "UTC+9:30", 100: "UTC+10", 105: "UTC+10:30", 110: "UTC+11", 120: "UTC+12", 127: "UTC+12:45", 130: "UTC+13", 140: "UTC+14" };
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
 * @param {number} alarm_config.id alarm id
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

    var id_keys = [1, 2, 3];
    if (id_keys.indexOf(id) === -1) {
        throw new Error("alarm_config.id must be one of " + id_keys.join(", "));
    }
    var condition_map = { 1: "below", 2: "above", 3: "within", 4: "below_or_above", 5: "saltation", 6: "primary_alarm_only", 7: "secondary_alarm_only", 8: "primary_and_secondary_alarm" };
    var condition_values = getValues(condition_map);
    if (condition_values.indexOf(condition) === -1) {
        throw new Error("alarm_config.condition must be one of " + condition_values.join(", "));
    }
    if (typeof max !== "number" || typeof min !== "number") {
        throw new Error("alarm_config.max and alarm_config.min must be numbers");
    }
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enabled) === -1) {
        throw new Error("alarm_config.enabled must be one of " + enable_values.join(", "));
    }

    var raw_condition = typeof condition === "number" ? condition : parseInt(getValue(condition_map, condition), 10);
    var raw_enabled = typeof enabled === "number" ? enabled : parseInt(getValue(enable_map, enabled), 10);

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
        values.push(parseInt(key));
        values.push(map[key]);
    }
    return values;
}

function getValue(map, value) {
    if (RAW_VALUE) return value;
    if (typeof value === "number") {
        return value;
    }

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
