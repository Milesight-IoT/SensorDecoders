/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product GS101
 */
var RAW_VALUE = 0x00;

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

function milesightDeviceEncode(payload) {
    var encoded = [];

    if ("reboot" in payload) {
        encoded = encoded.concat(reboot(payload.reboot));
    }
    if ("report_interval" in payload) {
        encoded = encoded.concat(setReportInterval(payload.report_interval));
    }
    if ("relay_output_status" in payload) {
        encoded = encoded.concat(setRelayControl(payload.relay_output_status));
    }
    if ("valve_status" in payload) {
        encoded = encoded.concat(setValveControl(payload.valve_status));
    }
    if ("query_life_remain" in payload) {
        encoded = encoded.concat(queryLifeRemain(payload.query_life_remain));
    }
    if ("query_device_status" in payload) {
        encoded = encoded.concat(queryDeviceStatus(payload.query_device_status));
    }
    if ("timestamp" in payload) {
        encoded = encoded.concat(setTimestamp(payload.timestamp));
    }
    if ("time_zone" in payload) {
        encoded = encoded.concat(setTimeZone(payload.time_zone));
    }
    if ("time_sync_enable" in payload) {
        encoded = encoded.concat(setTimeSyncEnable(payload.time_sync_enable));
    }
    if ("stop_buzzer_with_silent_time" in payload) {
        encoded = encoded.concat(stopBuzzerWithSilentTime(payload.stop_buzzer_with_silent_time));
    }
    if ("buzzer_enable" in payload) {
        encoded = encoded.concat(setBuzzerEnable(payload.buzzer_enable));
    }
    if ("led_indicator_enable" in payload) {
        encoded = encoded.concat(setLedIndicatorEnable(payload.led_indicator_enable));
    }
    if ("clear_alarm" in payload) {
        encoded = encoded.concat(clearAlarm(payload.clear_alarm));
    }
    if ("calibration_request" in payload) {
        encoded = encoded.concat(calibrationRequest(payload.calibration_request));
    }

    return encoded;
}

/**
 * Reboot device
 * @param {number} reboot values: (0: no, 1: yes)
 * @example { "reboot": 1 }
 */
function reboot(reboot) {
    var reboot_map = { 0: "no", 1: "yes" };
    var reboot_values = getValues(reboot_map);
    if (reboot_values.indexOf(reboot) === -1) {
        throw new Error("reboot must be one of " + reboot_values.join(", "));
    }

    if (getValue(reboot_map, reboot) === 0) {
        return [];
    }
    return [0xff, 0x10, 0xff];
}

/**
 * Set report interval
 * @param {number} report_interval unit: second, range: [60, 604800]
 * @example { "report_interval": 300 }
 */
function setReportInterval(report_interval) {
    if (typeof report_interval !== "number") {
        throw new Error("report_interval must be a number");
    }
    if (report_interval < 60 || report_interval > 604800) {
        throw new Error("report_interval must be between 60 and 604800");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x03);
    buffer.writeUInt16LE(report_interval);
    return buffer.toBytes();
}

/**
 * Set relay control
 * @param {number} relay_output_status - relay status, values: (0: off, 1: on)
 * @example { "relay_output_status": 1 }
 */
function setRelayControl(relay_output_status) {
    var relay_status_map = { 0: "off", 1: "on" };
    var relay_status_values = getValues(relay_status_map);
    if (relay_status_values.indexOf(relay_output_status) === -1) {
        throw new Error("relay_status must be one of " + relay_status_values.join(", "));
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0x07);
    buffer.writeUInt8(0x00);
    buffer.writeUInt8(getValue(relay_status_map, relay_output_status));
    buffer.writeUInt8(0xff);
    return buffer.toBytes();
}

/**
 * Set valve status
 * @param {number} valve_status - valve status, values: (0: off, 1: on)
 * @example { "valve_status": 1 }
 */
function setValveControl(valve_status) {
    var valve_status_map = { 0: "off", 1: "on" };
    var valve_status_values = getValues(valve_status_map);
    if (valve_status_values.indexOf(valve_status) === -1) {
        throw new Error("valve_status must be one of " + valve_status_values.join(", "));
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0x06);
    buffer.writeUInt8(0x00);
    buffer.writeUInt8(getValue(valve_status_map, valve_status));
    buffer.writeUInt8(0xff);
    return buffer.toBytes();
}

/**
 * Query life remain
 * @param {number} query_life_remain - query life remain, values: (0: no, 1: yes)
 * @example { "query_life_remain": 1 }
 */
function queryLifeRemain(query_life_remain) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(query_life_remain) === -1) {
        throw new Error("query_life_remain must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, query_life_remain) === 0) {
        return [];
    }
    return [0x08, 0x00, 0x00, 0xff];
}

/**
 * Query device status
 * @param {number} query_device_status values: (0: no, 1: yes)
 * @example { "query_device_status": 1 }
 */
function queryDeviceStatus(query_device_status) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(query_device_status) === -1) {
        throw new Error("query_device_status must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, query_device_status) === 0) {
        return [];
    }
    return [0xff, 0x28, 0xff];
}

/**
 * Set device timestamp
 * @param {number} timestamp unit: s
 * @example { "timestamp": 1715145600 }
 */
function setTimestamp(timestamp) {
    if (typeof timestamp !== "number") {
        throw new Error("timestamp must be a number");
    }
    if (timestamp < 0) {
        throw new Error("timestamp must be greater than 0");
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x11);
    buffer.writeUInt32LE(timestamp);
    return buffer.toBytes();
}

/**
 * Set device time zone
 * @param {number} time_zone
 * @example { "time_zone": -8 }
 */
function setTimeZone(time_zone) {
    var buffer = new Buffer(6);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x12);
    buffer.writeInt16LE(time_zone * 10);
    return buffer.toBytes();
}

/**
 * Set time sync enable
 * @param {number} time_sync_enable values: (0: disable, 1: enable)
 * @example { "time_sync_enable": 1 }
 */
function setTimeSyncEnable(time_sync_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(time_sync_enable) === -1) {
        throw new Error("time_sync_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x3b);
    buffer.writeUInt8(getValue(enable_map, time_sync_enable));
    return buffer.toBytes();
}

/**
 * Stop buzzer alarm, and silent buzzer x seconds
 * @param {number} stop_buzzer_with_silent_time values: (0: no, 1: yes)
 * @example { "stop_buzzer_with_silent_time": 1 }
 */
function stopBuzzerWithSilentTime(stop_buzzer_with_silent_time) {
    var stop_buzzer_with_silent_time_map = { 0: "no", 1: "yes" };
    var stop_buzzer_with_silent_time_values = getValues(stop_buzzer_with_silent_time_map);
    if (stop_buzzer_with_silent_time_values.indexOf(stop_buzzer_with_silent_time) === -1) {
        throw new Error("stop_buzzer_with_silent_time must be one of " + stop_buzzer_with_silent_time_values.join(", "));
    }

    if (getValue(stop_buzzer_with_silent_time_map, stop_buzzer_with_silent_time) === 0) {
        return [];
    }
    if (stop_buzzer_with_silent_time < 0) {
        throw new Error("buzzer_silent_time must be greater than 0");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x61);
    buffer.writeUInt16LE(stop_buzzer_with_silent_time);
    return buffer.toBytes();
}

/**
 * Set buzzer enable
 * @param {number} buzzer_enable values: (0: disable, 1: enable)
 * @example { "buzzer_enable": 1 }
 */
function setBuzzerEnable(buzzer_enable) {
    var buzzer_enable_map = { 0: "disable", 1: "enable" };
    var buzzer_enable_values = getValues(buzzer_enable_map);
    if (buzzer_enable_values.indexOf(buzzer_enable) === -1) {
        throw new Error("buzzer_enable must be one of " + buzzer_enable_values.join(", "));
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x3e);
    buffer.writeUInt8(getValue(buzzer_enable_map, buzzer_enable));
    return buffer.toBytes();
}

/**
 * Set led indicator enable
 * @param {number} led_indicator_enable values: (0: disable, 1: enable)
 * @example { "led_indicator_enable": 1 }
 */
function setLedIndicatorEnable(led_indicator_enable) {
    var led_indicator_enable_map = { 0: "disable", 1: "enable" };
    var led_indicator_enable_values = getValues(led_indicator_enable_map);
    if (led_indicator_enable_values.indexOf(led_indicator_enable) === -1) {
        throw new Error("led_indicator_enable must be one of " + led_indicator_enable_values.join(", "));
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x2f);
    buffer.writeUInt8(getValue(led_indicator_enable_map, led_indicator_enable));
    return buffer.toBytes();
}

/**
 * Clear alarm
 * @param {number} clear_alarm values: (0: no, 1: yes)
 * @example { "clear_alarm": 1 }
 */
function clearAlarm(clear_alarm) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(clear_alarm) === -1) {
        throw new Error("clear_alarm must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, clear_alarm) === 0) {
        return [];
    }
    return [0xff, 0x64, 0xff];
}

/**
 * Calibration sensor
 * @param {number} calibration_request values: (0: no, 1: yes)
 * @example { "calibration_request": 1 }
 */
function calibrationRequest(calibration_request) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(calibration_request) === -1) {
        throw new Error("calibration_request must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, calibration_request) === 0) {
        return [];
    }
    return [0xff, 0x62, 0xff];
}

function getValues(map) {
    var values = [];
    if (RAW_VALUE) {
        for (var key in map) {
            values.push(parseInt(key));
        }
    } else {
        for (var key in map) {
            values.push(map[key]);
        }
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
