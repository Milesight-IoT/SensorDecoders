/**
 * Payload Encoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product TS30x
 */
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
    if ("display_enabled" in payload) {
        encoded = encoded.concat(setDisplay(payload.display_enabled));
    }
    if ("temperature_chn1_calibration" in payload) {
        encoded = encoded.concat(setTemperatureCalibration(0, payload.temperature_chn1_calibration.enable, payload.temperature_chn1_calibration.temperature));
    }
    if ("temperature_chn2_calibration" in payload) {
        encoded = encoded.concat(setTemperatureCalibration(1, payload.temperature_chn2_calibration.enable, payload.temperature_chn2_calibration.temperature));
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
    if ("fetch_history" in payload) {
        encoded = encoded.concat(fetchHistory(payload.fetch_history.start_time, payload.fetch_history.end_time));
    }
    if ("clear_history" in payload) {
        encoded = encoded.concat(clearHistory(payload.clear_history));
    }
    if ("stop_transmit" in payload) {
        encoded = encoded.concat(stopTransmit(payload.stop_transmit));
    }

    return encoded;
}

/**
 * reboot device
 * @param {number} reboot values: (0: "no", 1: "yes")
 * @example { "reboot": 1 }
 */
function reboot(reboot) {
    var reboot_values = [0, 1];
    if (reboot_values.indexOf(reboot) === -1) {
        throw new Error("reboot must be one of " + reboot_values.join(", "));
    }

    if (reboot === 0) {
        return [];
    }
    return [0xff, 0x10, 0xff];
}

/**
 * report device status
 * @param {number} report_status values: (0: "no", 1: "yes")
 * @example { "report_status": 1 }
 */
function reportStatus(report_status) {
    var report_status_values = [0, 1];
    if (report_status_values.indexOf(report_status) === -1) {
        throw new Error("report_status must be one of " + report_status_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x28);
    buffer.writeUInt8(report_status);
    return buffer.toBytes();
}

/**
 * sync time
 * @param {number} sync_time values：(0: "no", 1: "yes")
 * @example { "sync_time": 1 }
 */
function syncTime(sync_time) {
    var sync_time_values = [0, 1];
    if (sync_time_values.indexOf(sync_time) === -1) {
        throw new Error("sync_time must be one of " + sync_time_values.join(", "));
    }

    if (sync_time === 0) {
        return [];
    }
    return [0xff, 0x4a, 0xff];
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
 * @param {number} collection_interval unit: second, range: [10, 60]
 * @example { "collection_interval": 300 }
 */
function setCollectionInterval(collection_interval) {
    if (typeof collection_interval !== "number") {
        throw new Error("collection_interval must be a number");
    }
    if (collection_interval < 10 || collection_interval > 60) {
        throw new Error("collection_interval must be in range [10, 60]");
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
 * @param {number} time_display values: (0: "12-hour", 1: "24-hour")
 * @example { "time_display": 1 }
 */
function setTimeDisplay(time_display) {
    var time_display_values = [0, 1];
    if (time_display_values.indexOf(time_display) === -1) {
        throw new Error("time_display must be one of " + time_display_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xe9);
    buffer.writeUInt8(time_display);
    return buffer.toBytes();
}

/**
 * set temperature unit display
 * @param {number} temperature_unit_display values: (0: "Celsius(°C)", 1: "Fahrenheit(℉)")
 * @example { "temperature_unit_display": 0 }
 */
function setTemperatureUnitDisplay(temperature_unit_display) {
    var temperature_unit_display_values = [0, 1];
    if (temperature_unit_display_values.indexOf(temperature_unit_display) === -1) {
        throw new Error("temperature_unit_display must be one of " + temperature_unit_display_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xeb);
    buffer.writeUInt8(temperature_unit_display);
    return buffer.toBytes();
}

/**
 * set display
 * @param {number} display_enabled values: (0: "disable", 1: "enable")
 * @example { "display_enabled": 1 }
 */
function setDisplay(display_enabled) {
    var display_enabled_values = [0, 1];
    if (display_enabled_values.indexOf(display_enabled) === -1) {
        throw new Error("display_enabled must be one of " + display_enabled_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x2d);
    buffer.writeUInt8(display_enabled);
    return buffer.toBytes();
}

/**
 * temperature calibration
 * @param {number} idx values: (0: "channel 1", 1: "channel 2")
 * @param {number} enable values: (0: "disable", 1: "enable")
 * @param {number} temperature unit: Celsius
 * @example { temperature_chn1_calibration": { "enable": 1, "temperature": 25 } }
 */
function setTemperatureCalibration(idx, enable, temperature) {
    var enable_values = [0, 1];
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("temperature_chn_calibration.enable must be one of " + enable_values.join(", "));
    }

    var data = (enable << 7) | idx;
    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xea);
    buffer.writeUInt8(data);
    buffer.writeInt16LE(temperature * 10);
    return buffer.toBytes();
}

/**
 * magnet throttle
 * @param {number} magnet_throttle unit: millisecond, range: [10, 6000]
 * @example { "magnet_throttle": 3000 }
 */
function setMagnetThrottle(magnet_throttle) {
    if (typeof magnet_throttle !== "number") {
        throw new Error("magnet_throttle must be a number");
    }
    if (magnet_throttle < 10 || magnet_throttle > 6000) {
        throw new Error("magnet_throttle must be in range [10, 6000]");
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
 * @param {number} child_lock values: (0: "disable", 1: "enable")
 * @example { "child_lock": 1 }
 */
function setChildLock(child_lock) {
    var child_lock_values = [0, 1];
    if (child_lock_values.indexOf(child_lock) === -1) {
        throw new Error("child_lock must be one of " + child_lock_values.join(", "));
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x25);
    buffer.writeUInt8(child_lock);
    buffer.writeUInt8(0x00);
    return buffer.toBytes();
}

/**
 * history enable
 * @param {number} history_enable values: (0: "disable", 1: "enable")
 * @example { "history_enable": 1 }
 */
function setHistoryEnable(history_enable) {
    var history_enable_values = [0, 1];
    if (history_enable_values.indexOf(history_enable) === -1) {
        throw new Error("history_enable must be one of " + history_enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x68);
    buffer.writeUInt8(history_enable);
    return buffer.toBytes();
}

/**
 * retransmit enable
 * @param {number} retransmit_enable values: (0: "disable", 1: "enable")
 * @example { "retransmit_enable": true }
 */
function setRetransmitEnable(retransmit_enable) {
    var retransmit_enable_values = [0, 1];
    if (retransmit_enable_values.indexOf(retransmit_enable) === -1) {
        throw new Error("retransmit_enable must be one of " + retransmit_enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x69);
    buffer.writeUInt8(retransmit_enable ? 0x01 : 0x00);
    return buffer.toBytes();
}

/**
 * retransmit interval
 * @param {number} retransmit_interval unit: seconds
 * @example { "retransmit_interval": 300 }
 */
function setRetransmitInterval(retransmit_interval) {
    if (typeof type !== "number") {
        throw new Error("type must be a number");
    }
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
 * fetch history
 * @param {number} start_time
 * @param {number} end_time
 * @example { "fetch_history": { "start_time": 1609459200, "end_time": 1609545600 } }
 */
function fetchHistory(start_time, end_time) {
    if (typeof start_time !== "number") {
        throw new Error("start_time must be a number");
    }
    if (end_time && typeof end_time !== "number") {
        throw new Error("end_time must be a number");
    }
    if (end_time && start_time > end_time) {
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
 * @param {number} clear_history values: (0: "no", 1: "yes")
 * @example { "clear_history": 1 }
 */
function clearHistory(clear_history) {
    var clear_history_values = [0, 1];
    if (clear_history_values.indexOf(clear_history) === -1) {
        throw new Error("clear_history must be one of " + clear_history_values.join(", "));
    }

    if (clear_history === 0) {
        return [];
    }
    return [0xff, 0x27, 0x01];
}

/**
 * history stop transmit
 * @param {number} stop_transmit values: (0: "no", 1: "yes")
 * @example { "stop_transmit": 1 }
 */
function stopTransmit(stop_transmit) {
    var stop_transmit_values = [0, 1];
    if (stop_transmit_values.indexOf(stop_transmit) === -1) {
        throw new Error("stop_transmit must be one of " + stop_transmit_values.join(", "));
    }

    if (stop_transmit === 0) {
        return [];
    }
    return [0xff, 0x6d, 0xff];
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
