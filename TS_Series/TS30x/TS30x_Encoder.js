/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product TS301 / TS302
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
    if ("collection_interval" in payload) {
        encoded = encoded.concat(setCollectionInterval(payload.collection_interval));
    }
    if ("report_status" in payload) {
        encoded = encoded.concat(reportStatus(payload.report_status));
    }
    if ("sync_time" in payload) {
        encoded = encoded.concat(syncTime(payload.sync_time));
    }
    if ("timezone" in payload) {
        encoded = encoded.concat(setTimeZone(payload.timezone));
    }
    if ("time_display" in payload) {
        encoded = encoded.concat(setTimeDisplay(payload.time_display));
    }
    if ("temperature_unit_display" in payload) {
        encoded = encoded.concat(setTemperatureUnitDisplay(payload.temperature_unit_display));
    }
    if ("display_enable" in payload) {
        encoded = encoded.concat(setDisplay(payload.display_enable));
    }
    if ("temperature_chn1_calibration" in payload) {
        encoded = encoded.concat(setTemperatureCalibration(0, payload.temperature_chn1_calibration));
    }
    if ("temperature_chn2_calibration" in payload) {
        encoded = encoded.concat(setTemperatureCalibration(1, payload.temperature_chn2_calibration));
    }
    if ("magnet_throttle" in payload) {
        encoded = encoded.concat(setMagnetThrottle(payload.magnet_throttle));
    }
    if ("child_lock" in payload) {
        encoded = encoded.concat(setChildLock(payload.child_lock));
    }
    if ("history_enable" in payload) {
        encoded = encoded.concat(setHistoryEnable(payload.history_enable));
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
    if ("fetch_history" in payload) {
        encoded = encoded.concat(fetchHistory(payload.fetch_history));
    }
    if ("clear_history" in payload) {
        encoded = encoded.concat(clearHistory(payload.clear_history));
    }
    if ("stop_transmit" in payload) {
        encoded = encoded.concat(stopTransmit(payload.stop_transmit));
    }
    if ("alarm_config" in payload) {
        encoded = encoded.concat(setAlarmConfig(payload.alarm_config));
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
 * sync time
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
 * @param {number} report_interval unit: minute, range: [1, 1440]
 * @example { "report_interval": 20 }
 */
function setReportInterval(report_interval) {
    if (typeof report_interval !== "number") {
        throw new Error("report_interval must be a number");
    }
    if (report_interval < 1 || report_interval > 1440) {
        throw new Error("report_interval must be in range [1, 1440]");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x8e);
    buffer.writeUInt8(0x00);
    buffer.writeUInt16LE(report_interval);
    return buffer.toBytes();
}

/**
 * set collection interval
 * @param {number} collection_interval unit: second
 * @example { "collection_interval": 300 }
 */
function setCollectionInterval(collection_interval) {
    if (typeof collection_interval !== "number") {
        throw new Error("collection_interval must be a number");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x02);
    buffer.writeUInt16LE(collection_interval);
    return buffer.toBytes();
}

/**
 * set timezone
 * @param {number} timezone
 * @example { "timezone": -4 }
 * @example { "timezone": 8 }
 */
function setTimeZone(timezone) {
    if (typeof timezone !== "number") {
        throw new Error("timezone must be a number");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x17);
    buffer.writeInt16LE(timezone * 10);
    return buffer.toBytes();
}

/**
 * set time display
 * @param {number} time_display values: (0: 12_hour, 1: 24_hour)
 * @example { "time_display": 1 }
 */
function setTimeDisplay(time_display) {
    var time_display_map = { 0: "12_hour", 1: "24_hour" };
    var time_display_values = getValues(time_display_map);
    if (time_display_values.indexOf(time_display) === -1) {
        throw new Error("time_display must be one of " + time_display_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xe9);
    buffer.writeUInt8(getValue(time_display_map, time_display));
    return buffer.toBytes();
}

/**
 * set temperature unit display
 * @param {number} temperature_unit_display values: (0: celsius, 1: fahrenheit)
 * @example { "temperature_unit_display": 0 }
 */
function setTemperatureUnitDisplay(temperature_unit_display) {
    var temperature_unit_display_map = { 0: "celsius", 1: "fahrenheit" };
    var temperature_unit_display_values = getValues(temperature_unit_display_map);
    if (temperature_unit_display_values.indexOf(temperature_unit_display) === -1) {
        throw new Error("temperature_unit_display must be one of " + temperature_unit_display_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xeb);
    buffer.writeUInt8(getValue(temperature_unit_display_map, temperature_unit_display));
    return buffer.toBytes();
}

/**
 * set display
 * @param {number} display_enable values: (0: disable, 1: enable)
 * @example { "display_enable": 1 }
 */
function setDisplay(display_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(display_enable) === -1) {
        throw new Error("display_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x2d);
    buffer.writeUInt8(getValue(enable_map, display_enable));
    return buffer.toBytes();
}

/**
 * temperature calibration
 * @param {object} temperature_calibration
 * @param {number} temperature_calibration.enable values: (0: "disable", 1: "enable")
 * @param {number} temperature_calibration.calibration_value unit: Celsius
 * @example { temperature_chn1_calibration": { "enable": 1, "calibration_value": 25 } }
 */
function setTemperatureCalibration(idx, temperature_calibration) {
    var enable = temperature_calibration.enable;
    var calibration_value = temperature_calibration.calibration_value;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("temperature_chn" + idx + "_calibration.enable must be one of " + enable_values.join(", "));
    }

    var data = (getValue(enable_map, enable) << 7) | idx;

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xea);
    buffer.writeUInt8(data);
    buffer.writeInt16LE(calibration_value * 10);
    return buffer.toBytes();
}

/**
 * magnet throttle
 * @param {number} magnet_throttle unit: millisecond, range: [0, 6000]
 * @example { "magnet_throttle": 3000 }
 */
function setMagnetThrottle(magnet_throttle) {
    if (typeof magnet_throttle !== "number") {
        throw new Error("magnet_throttle must be a number");
    }
    if (magnet_throttle < 0 || magnet_throttle > 6000) {
        throw new Error("magnet_throttle must be in range [0, 6000]");
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x91);
    buffer.writeUInt8(0x01);
    buffer.writeUInt32LE(magnet_throttle);
    return buffer.toBytes();
}

/**
 * set child lock
 * @param {number} child_lock values: (0: disable, 1: enable)
 * @example { "child_lock": 1 }
 */
function setChildLock(child_lock) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(child_lock) === -1) {
        throw new Error("child_lock must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x25);
    buffer.writeUInt8(getValue(enable_map, child_lock));
    buffer.writeUInt8(0x00);
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
 * retransmit enable
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
 * retransmit interval
 * @param {number} retransmit_interval unit: seconds
 * @example { "retransmit_interval": 300 }
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
 * retransmit interval
 * @param {number} resend_interval unit: seconds
 * @example { "resend_interval": 300 }
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
 * fetch history
 * @param {object} fetch_history
 * @param {number} fetch_history.start_time
 * @param {number} fetch_history.end_time
 * @example { "fetch_history": { "start_time": 1609459200, "end_time": 1609545600 } }
 */
function fetchHistory(fetch_history) {
    var start_time = fetch_history.start_time;
    var end_time = fetch_history.end_time || 0;

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
    return [0xff, 0x6d, 0xff];
}

/**
 * set alarm config
 * @param {object} alarm_config 
 * @param {number} alarm_config.enable values: (0: disable, 1: enable)
 * @param {number} alarm_config.alarm_release_enable values: (0: disable, 1: enable)
 * @param {number} alarm_config.condition values: (0: disable, 1: below, 2: above, 3: between, 4: outside)
 * @param {number} alarm_config.trigger_source values: (1: chn_1_alarm, 2: chn_2_alarm, 3: chn_1_mutation, 4: chn_2_mutation)
 * @param {number} alarm_config.min_threshold unit: Celsius
 * @param {number} alarm_config.max_threshold unit: Celsius
 * @param {number} alarm_config.lock_time unit: second
 * @param {number} alarm_config.continue_time unit: second
 */
function setAlarmConfig(alarm_config) {
    var enable = alarm_config.enable;
    var alarm_release_enable = alarm_config.alarm_release_enable;
    var condition = alarm_config.condition;
    var trigger_source = alarm_config.trigger_source;
    var min_threshold = alarm_config.min_threshold;
    var max_threshold = alarm_config.max_threshold;
    var lock_time = alarm_config.lock_time;
    var continue_time = alarm_config.continue_time;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("alarm_config.enable must be one of " + enable_values.join(", "));
    }
    var condition_map = { 0: "disable", 1: "below", 2: "above", 3: "between", 4: "outside", 5: "mutation" };
    var condition_values = getValues(condition_map);
    if (condition_values.indexOf(condition) === -1) {
        throw new Error("alarm_config.condition must be one of " + condition_values.join(", "));
    }
    var trigger_source_map = { 1: "chn_1_alarm", 2: "chn_2_alarm", 3: "chn_1_mutation", 4: "chn_2_mutation" };
    var trigger_source_values = getValues(trigger_source_map);
    if (trigger_source_values.indexOf(trigger_source) === -1) {
        throw new Error("alarm_config.trigger_source must be one of " + trigger_source_values.join(", "));
    }

    var data = 0x00;
    data |= getValue(condition_map, condition);
    data |= getValue(trigger_source_map, trigger_source) << 3;
    data |= getValue(enable_map, enable) << 6;
    data |= getValue(enable_map, alarm_release_enable) << 7;

    var buffer = new Buffer(11);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x06);
    buffer.writeUInt8(data);
    buffer.writeUInt16LE(min_threshold * 10);
    buffer.writeUInt16LE(max_threshold * 10);
    buffer.writeUInt16LE(lock_time);
    buffer.writeUInt16LE(continue_time);
    return buffer.toBytes();
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
