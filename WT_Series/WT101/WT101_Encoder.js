/**
 * Payload Encoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product WT101
 */
// Chirpstack v4
function encodeDownlink(input) {
    var encoded = milesightDeviceEncode(input.data);
    return encoded;
}

// Chirpstack v3
function Encode(fPort, obj) {
    var encoded = milesightDeviceEncode(obj);
    return encoded;
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
    if ("report_status" in payload) {
        encoded = encoded.concat(reportStatus(payload.report_status));
    }
    if ("sync_time" in payload) {
        encoded = encoded.concat(syncTime(payload.sync_time));
    }
    if ("report_interval" in payload) {
        encoded = encoded.concat(setReportInterval(payload.report_interval));
    }
    if ("timezone" in payload) {
        encoded = encoded.concat(setTimeZone(payload.timezone));
    }
    if ("time_sync_enable" in payload) {
        encoded = encoded.concat(setTimeSyncEnable(payload.time_sync_enable));
    }
    if ("temperature_calibration" in payload) {
        encoded = encoded.concat(setTemperatureCalibration(payload.temperature_calibration.enable, payload.temperature_calibration.temperature));
    }
    if ("temperature_control" in payload && "enable" in payload.temperature_control) {
        encoded = encoded.concat(setTemperatureControl(payload.temperature_control.enable));
    }
    if ("temperature_control" in payload && "mode" in payload.temperature_control) {
        encoded = encoded.concat(setTemperatureControlMode(payload.temperature_control.mode));
    }
    if ("temperature_target" in payload) {
        encoded = encoded.concat(setTemperatureTarget(payload.temperature_target, payload.temperature_error));
    }
    if ("open_window_detection" in payload) {
        encoded = encoded.concat(setOpenWindowDetection(payload.open_window_detection.enable, payload.open_window_detection.temperature_threshold, payload.open_window_detection.time));
    }
    if ("restore_open_window_detection" in payload) {
        encoded = encoded.concat(restoreOpenWindowDetection(payload.restore_open_window_detection));
    }
    if ("valve_opening" in payload) {
        encoded = encoded.concat(setValveOpening(payload.valve_opening));
    }
    if ("valve_calibration" in payload) {
        encoded = encoded.concat(setValveCalibration(payload.valve_calibration));
    }
    if ("valve_control_algorithm" in payload) {
        encoded = encoded.concat(setValveControlAlgorithm(payload.valve_control_algorithm));
    }
    if ("freeze_protection_config" in payload) {
        encoded = encoded.concat(setFreezeProtection(payload.freeze_protection_config.enable, payload.freeze_protection_config.temperature));
    }
    if ("child_lock_config" in payload) {
        encoded = encoded.concat(setChildLockEnable(payload.child_lock_config.enable));
    }
    return encoded;
}

/**
 * device reboot
 * @param {number} reboot
 * @example { "reboot": 1 }
 */
function reboot(reboot) {
    var reboot_values = [0, 1];
    if (reboot_values.indexOf(reboot) == -1) {
        throw new Error("reboot must be one of " + reboot_values.join(", "));
    }

    if (reboot === 0) {
        return [];
    }
    return [0xff, 0x10, 0xff];
}

/**
 * sync time
 * @param {number} sync_time
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
 * report status
 * @param {number} report_status
 * @example { "report_status": 1 }
 */
function reportStatus(report_status) {
    var report_status_values = [0, 1];
    if (report_status_values.indexOf(report_status) == -1) {
        throw new Error("report_status must be one of " + report_status_values.join(", "));
    }

    if (report_status === 0) {
        return [];
    }
    return [0xff, 0x28, 0xff];
}

/**
 * time zone configuration
 * @param {number} timezone range: [-12, 12]
 * @example { "timezone": -4 }
 * @example { "timezone": 8 }
 */
function setTimeZone(timezone) {
    if (typeof timezone !== "number") {
        throw new Error("timezone must be a number");
    }
    if (timezone < -12 || timezone > 12) {
        throw new Error("timezone must be between -12 and 12");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x17);
    buffer.writeInt16LE(timezone * 10);
    return buffer.toBytes();
}

/**
 * report interval configuration
 * @param {number} report_interval uint: minute
 * @example { "report_interval": 10 }
 */
function setReportInterval(report_interval) {
    if (typeof report_interval !== "number") {
        throw new Error("report_interval must be a number");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x8e);
    buffer.writeUInt8(0x00);
    buffer.writeUInt16LE(report_interval);
    return buffer.toBytes();
}

/**
 * time sync configuration
 * @param {number} time_sync_enable
 * @example { "time_sync_enable": 0 }
 */
function setTimeSyncEnable(time_sync_enable) {
    var time_sync_enable_values = [0, 1];
    if (time_sync_enable_values.indexOf(time_sync_enable) == -1) {
        throw new Error("time_sync_enable must be one of " + time_sync_enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x3b);
    buffer.writeUInt8(time_sync_enable);
    return buffer.toBytes();
}

/**
 * temperature calibration configuration
 * @param {number} enable
 * @param {number} temperature uint: Celsius
 * @example { "temperature_calibration": { "enable": 1, "temperature": 5 }}
 * @example { "temperature_calibration": { "enable": 1, "temperature": -5 }}
 * @example { "temperature_calibration": { "enable": 0 } }
 */
function setTemperatureCalibration(enable, temperature) {
    var temperature_calibration_enable_values = [0, 1];
    if (temperature_calibration_enable_values.indexOf(enable) == -1) {
        throw new Error("temperature_calibration.enable must be one of " + temperature_calibration_enable_values.join(", "));
    }
    if (enable && typeof temperature !== "number") {
        throw new Error("temperature_calibration.temperature must be a number");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xab);
    buffer.writeUInt8(enable);
    buffer.writeInt16LE(temperature * 10);
    return buffer.toBytes();
}

/**
 * temperature control enable configuration
 * @param {number} enable
 * @example { "temperature_control": { "enable": 1 } }
 */
function setTemperatureControl(enable) {
    var temperature_control_enable_values = [0, 1];
    if (temperature_control_enable_values.indexOf(enable) == -1) {
        throw new Error("temperature_control.enable must be one of " + temperature_control_enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xb3);
    buffer.writeUInt8(enable);
    return buffer.toBytes();
}

/**
 * temperature control mode configuration
 * @param {string} mode, values: (0: auto, 1: manual)
 * @example { "temperature_control": { "mode": 0 } }
 * @example { "temperature_control": { "mode": 1 } }
 */
function setTemperatureControlMode(mode) {
    var temperature_control_mode_values = [0, 1];
    if (temperature_control_mode_values.indexOf(mode) == -1) {
        throw new Error("temperature_control.mode must be one of " + temperature_control_mode_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xae);
    buffer.writeUInt8(mode);
    return buffer.toBytes();
}

/**
 * temperature target configuration
 * @param {number} temperature_target uint: Celsius
 * @param {number} temperature_error uint: Celsius
 * @example { "temperature_target": 10, "temperature_error": 0.1 }
 * @example { "temperature_target": 28, "temperature_error": 5 }
 */
function setTemperatureTarget(temperature_target, temperature_error) {
    if (typeof temperature_target !== "number") {
        throw new Error("temperature_target must be a number");
    }
    if (typeof temperature_error !== "number") {
        throw new Error("temperature_error must be a number");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xb1);
    buffer.writeInt8(temperature_target);
    buffer.writeUInt16LE(temperature_error * 10);
    return buffer.toBytes();
}

/**
 * open window detection configuration *
 * @param {number} enable
 * @param {number} temperature_threshold uint: Celsius
 * @param {number} time uint: minute
 * @example { "open_window_detection": { "enable": 1, "temperature_threshold": 2, "time": 1 } }
 * @example { "open_window_detection": { "enable": 1, "temperature_threshold": 10, "time": 1440 } }
 * @example { "open_window_detection": { "enable": 0 } }
 */
function setOpenWindowDetection(enable, temperature_threshold, time) {
    var open_window_detection_enable_values = [0, 1];
    if (open_window_detection_enable_values.indexOf(enable) == -1) {
        throw new Error("open_window_detection.enable must be one of " + open_window_detection_enable_values.join(", "));
    }
    if (enable && typeof temperature_threshold !== "number") {
        throw new Error("open_window_detection.temperature_threshold must be a number");
    }
    if (enable && typeof time !== "number") {
        throw new Error("open_window_detection.time must be a number");
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xaf);
    buffer.writeUInt8(enable);
    buffer.writeInt8(temperature_threshold * 10);
    buffer.writeUInt16LE(time);
    return buffer.toBytes();
}

/**
 * restore open window detection status
 * @param {number} restore_open_window_detection
 * @example { "restore_open_window_detection": 1 }
 */
function restoreOpenWindowDetection(restore_open_window_detection) {
    var restore_open_window_detection_values = [0, 1];
    if (restore_open_window_detection_values.indexOf(restore_open_window_detection) == -1) {
        throw new Error("restore_open_window_detection must be one of " + restore_open_window_detection_values.join(", "));
    }

    if (restore_open_window_detection === 0) {
        return [];
    }
    return [0xff, 0x57, 0xff];
}

/**
 * valve opening configuration
 * @param {number} valve_opening uint: percentage, range: [0, 100]
 * @example { "valve_opening": 50 }
 */
function setValveOpening(valve_opening) {
    if (typeof valve_opening !== "number") {
        throw new Error("valve_opening must be a number");
    }
    if (valve_opening < 0 || valve_opening > 100) {
        throw new Error("valve_opening must be between 0 and 100");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xb4);
    buffer.writeUInt8(valve_opening);
    return buffer.toBytes();
}

/**
 * valve calibration
 * @param {number} valve_calibration
 * @example { "valve_calibration": 1 }
 */
function setValveCalibration(valve_calibration) {
    var valve_calibration_values = [0, 1];
    if (valve_calibration_values.indexOf(valve_calibration) == -1) {
        throw new Error("valve_calibration must be one of " + valve_calibration_values.join(", "));
    }

    if (valve_calibration === 0) {
        return [];
    }
    return [0xff, 0xad, 0xff];
}

/**
 * valve control algorithm
 * @param {string} valve_control_algorithm values: (0: rate, 1: pid)
 * @example { "valve_control_algorithm": 0 }
 */
function setValveControlAlgorithm(valve_control_algorithm) {
    var valve_control_algorithm_values = [0, 1];
    if (valve_control_algorithm_values.indexOf(valve_control_algorithm) == -1) {
        throw new Error("valve_control_algorithm must be one of " + valve_control_algorithm_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xac);
    buffer.writeUInt8(valve_control_algorithm);
    return buffer.toBytes();
}

/**
 * freeze protection configuration
 * @param {number} enable
 * @param {number} temperature uint: Celsius
 * @example { "freeze_protection_config": { "enable": 1, "temperature": 5 } }
 * @example { "freeze_protection_config": { "enable": 0 } }
 */
function setFreezeProtection(enable, temperature) {
    var freeze_protection_enable_values = [0, 1];
    if (freeze_protection_enable_values.indexOf(enable) == -1) {
        throw new Error("freeze_protection_config.enable must be one of " + freeze_protection_enable_values.join(", "));
    }
    if (enable && typeof temperature !== "number") {
        throw new Error("freeze_protection_config.temperature must be a number");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xb0);
    buffer.writeUInt8(enable);
    buffer.writeInt16LE(temperature * 10); // temperature
    return buffer.toBytes();
}

/**
 * child lock configuration
 * @param {number} enable values: (0: disable, 1: enable)
 * @example { "child_lock_config": { "enable": 1 } }
 */
function setChildLockEnable(enable) {
    var child_lock_enable_values = [0, 1];
    if (child_lock_enable_values.indexOf(enable) == -1) {
        throw new Error("child_lock_config.enable must be one of " + child_lock_enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x25);
    buffer.writeUInt8(enable);
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

Buffer.prototype.toBytes = function () {
    return this.buffer;
};
