/**
 * Payload Encoder for Chirpstack v4
 *
 * Copyright 2024 Milesight IoT
 *
 * @product WT101
 */
function encodeDownlink(input) {
    var encoded = milesightEncode(input.data);
    return { bytes: encoded };
}

function milesightEncode(obj) {
    var encoded = [];

    if ("reboot" in obj) {
        encoded = encoded.concat(reboot(obj.reboot));
    }
    if ("report_status" in obj) {
        encoded = encoded.concat(reportStatus(obj.report_status));
    }
    if ("sync_time" in obj) {
        encoded = encoded.concat(syncTime(obj.sync_time));
    }
    if ("report_interval" in obj) {
        encoded = encoded.concat(setReportInterval(obj.report_interval));
    }
    if ("timezone" in obj) {
        encoded = encoded.concat(setTimeZone(obj.timezone));
    }
    if ("temperature_calibration" in obj) {
        encoded = encoded.concat(setTemperatureCalibration(obj.temperature_calibration.enable, obj.temperature_calibration.temperature));
    }
    if ("temperature_control" in obj && "enable" in obj.temperature_control) {
        encoded = encoded.concat(setTemperatureControl(obj.temperature_control.enable));
    }
    if ("temperature_control" in obj && "mode" in obj.temperature_control) {
        encoded = encoded.concat(setTemperatureControlMode(obj.temperature_control.mode));
    }
    if ("temperature_target" in obj) {
        encoded = encoded.concat(setTemperatureTarget(obj.temperature_target, obj.temperature_error));
    }
    if ("open_window_detection" in obj) {
        encoded = encoded.concat(setOpenWindowDetection(obj.open_window_detection.enable, obj.open_window_detection.rate, obj.open_window_detection.time));
    }
    if ("restore_open_window_detection_status" in obj) {
        encoded = encoded.concat(restoreOpenWindowDetection(obj.restore_open_window_detection_status));
    }
    if ("valve_opening" in obj) {
        encoded = encoded.concat(setValveOpening(obj.valve_opening));
    }
    if ("valve_calibration" in obj) {
        encoded = encoded.concat(setValveCalibration(obj.valve_calibration));
    }
    if ("valve_control_algorithm" in obj) {
        encoded = encoded.concat(setValveControlAlgorithm(obj.valve_control_algorithm));
    }
    if ("freeze_protection" in obj) {
        encoded = encoded.concat(setFreezeProtection(obj.freeze_protection.enable, obj.freeze_protection.temperature));
    }
    if ("child_lock" in obj) {
        encoded = encoded.concat(setChildLock(obj.child_lock));
    }

    return encoded;
}

/**
 * device reboot
 * @param {boolean} reboot
 * @example payload: { "reboot": true }, output: FF10FF
 */
function reboot(reboot) {
    if (typeof reboot !== "boolean") {
        throw new Error("reboot must be a boolean");
    }
    if (reboot === false) {
        return [];
    }
    return [0xff, 0x10, 0xff];
}

/**
 * sync time
 * @param {boolean} sync_time
 * @example payload: { "sync_time": true }, output: FF3B02
 */
function syncTime(sync_time) {
    if (typeof sync_time !== "boolean") {
        throw new Error("sync_time must be a boolean");
    }
    if (sync_time === false) {
        return [];
    }
    return [0xff, 0x3b, 0x02];
}

/**
 * request device report status ( such as: peridioc report)
 * @param {boolean} report_status
 * @example payload: { "report_status": true }, output: FF28FF
 */
function reportStatus(report_status) {
    if (typeof report_status !== "boolean") {
        throw new Error("report_status must be a boolean");
    }
    if (report_status === false) {
        return [];
    }
    return [0xff, 0x28, 0xff];
}

/**
 * time zone configuration
 * @param {number} timezone range: [-12, 12]
 * @example payload: { "timezone": -4 }, output: FF17D8FF
 * @example payload: { "timezone": 8 }, output: FF175000
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
    buffer.writeInt16LE(timezone * 10); // timezone
    return buffer.toBytes();
}

/**
 * report interval configuration
 * @param {number} report_interval uint: minutes, range: [1, 1440]
 * @example payload: { "report_interval": 10 }, output: FF8E000500
 */
function setReportInterval(report_interval) {
    if (typeof report_interval !== "number") {
        throw new Error("report_interval must be a number");
    }
    if (report_interval < 1 || report_interval > 1440) {
        throw new Error("report_interval must be between 1 and 1440");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x8e);
    buffer.writeUInt8(0x00); // ID: reserved
    buffer.writeUInt16LE(report_interval); // report interval
    return buffer.toBytes();
}

/**
 * temperature calibration configuration
 * @param {boolean} enable
 * @param {number} temperature uint: Celcius
 * @example payload: { "temperature_calibration": { "enable": true, "temperature": 5 } }, output: FFAB013200
 * @example payload: { "temperature_calibration": { "enable": true, "temperature": -5 } }, output: FFAB01CEFF
 * @example payload: { "temperature_calibration": { "enable": false } }, output: FFAB00
 */
function setTemperatureCalibration(enable, temperature) {
    if (typeof enable !== "boolean") {
        throw new Error("temperature_calibration.enable must be a boolean");
    }
    if (enable && typeof temperature !== "number") {
        throw new Error("temperature_calibration.temperature must be a number");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff); //
    buffer.writeUInt8(0xab);
    buffer.writeUInt8(enable ? 0x01 : 0x00); // enable
    buffer.writeInt16LE(temperature * 10); // temperature
    return buffer.toBytes();
}

/**
 * temperature control enabled configuration *
 * @param {boolean} enable
 * @example payload: { "temperature_control": { "enable": true } }, output: FFB301
 */
function setTemperatureControl(enable) {
    if (typeof enable !== "boolean") {
        throw new Error("temperature_control.enable must be a boolean");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff); //
    buffer.writeUInt8(0xb3);
    buffer.writeUInt8(enable ? 0x01 : 0x00); // enable
    return buffer.toBytes();
}

/**
 * temperature control mode configuration
 * @param {string} mode, values: (auto, manual)
 * @example
 * - payload: { "temperature_control": { "mode": "auto" } } output: FFAE00
 * - payload: { "temperature_control": { "mode": "manual" } } output: FFAE01
 */
function setTemperatureControlMode(mode) {
    if (typeof mode !== "string") {
        throw new Error("temperature_control.mode must be a string");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff); //
    buffer.writeUInt8(0xae);
    buffer.writeUInt8(mode === "auto" ? 0 : 1); // values: (0: auto, 1: manual)
    return buffer.toBytes();
}

/**
 * temperature target configuration
 * @param {number} temperature_target uint: Celcius
 * @param {number} temperature_error uint: Celcius
 * @example payload: { "temperature_target": 10, "temperature_error": 0.1 }, output: FFB10A0100
 * @example payload:  { "temperature_target": 28, "temperature_error": 5 }, output: FFB11C3200
 */
function setTemperatureTarget(temperature_target, temperature_error) {
    if (typeof temperature_target !== "number") {
        throw new Error("temperature_target must be a number");
    }
    if (typeof temperature_error !== "number") {
        throw new Error("temperature_error must be a number");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff); //
    buffer.writeUInt8(0xb1);
    buffer.writeInt8(temperature_target); // temperature
    buffer.writeUInt16LE(temperature_error * 10); // temperature error
    return buffer.toBytes();
}

/**
 * open window detection configuration *
 * @param {boolean} enable
 * @param {number} rate uint: Celcius/minute
 * @param {number} time uint: minutes
 * @example payload: { "open_window_detection": { "enable": true, "rate": 2, "time": 1 } }, output: FFAF01140100
 * @example payload: { "open_window_detection": { "enable": true, "rate": 10, "time": 1440 } }, output: FFAF0164A005
 * @example payload: { "open_window_detection": { "enable": false } }, output: FFAF00000000
 */
function setOpenWindowDetection(enable, rate, time) {
    if (typeof enable !== "boolean") {
        throw new Error("open_window_detection.enable must be a boolean");
    }
    if (enable && typeof rate !== "number") {
        throw new Error("open_window_detection.rate must be a number");
    }
    if (enable && typeof time !== "number") {
        throw new Error("open_window_detection.time must be a number");
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xaf);
    buffer.writeUInt8(enable ? 0x01 : 0x00); // open window detection enable
    buffer.writeInt8(rate * 10); // cooling rate
    buffer.writeUInt16LE(time); // time
    return buffer.toBytes();
}

/**
 * restore open window detection status
 * @param {boolean} restore_open_window_detection_status
 * @example payload: { "restore_open_window_detection_status": true }, output: FF57FF
 */
function restoreOpenWindowDetection(restore_open_window_detection_status) {
    if (typeof restore_open_window_detection_status !== "boolean") {
        throw new Error("restore_open_window_detection_status must be a boolean");
    }
    if (restore_open_window_detection_status === false) {
        return [];
    }
    return [0xff, 0x57, 0xff];
}

/**
 * valve opening configuration
 * @param {number} valve_opening uint: percentage, range: [0, 100]
 * @example payload: { "valve_opening": 50 }, output: FFB432
 */
function setValveOpening(valve_opening) {
    if (typeof valve_opening !== "number") {
        throw new Error("valve_opening must be a number");
    }
    if (valve_opening < 0 || valve_opening > 100) {
        throw new Error("valve_opening must be between 0 and 100");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff); //
    buffer.writeUInt8(0xb4);
    buffer.writeUInt8(valve_opening); // valve opening percentage
    return buffer.toBytes();
}

/**
 * valve calibration
 * @param {boolean} valve_calibration
 * @example payload: { "valve_calibration": true }, output: FFADFF
 */
function setValveCalibration(valve_calibration) {
    if (typeof valve_calibration !== "boolean") {
        throw new Error("valve_calibration must be a boolean");
    }
    if (valve_calibration === false) {
        return [];
    }
    return [0xff, 0xad, 0xff];
}

/**
 * valve control algorithm
 * @param {string} valve_control_algorithm values: (rate, pid)
 * @example payload: { "valve_control_algorithm": "rate" }, output: FFAC00
 */
function setValveControlAlgorithm(valve_control_algorithm) {
    if (typeof valve_control_algorithm !== "string") {
        throw new Error("valve_control_algorithm must be a string");
    }
    var algorithms = ["rate", "pid"];
    if (algorithms.indexOf(valve_control_algorithm) == -1) {
        throw new Error("valve_control_algorithm must be one of " + algorithms.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xac);
    buffer.writeUInt8(algorithms.indexOf(valve_control_algorithm));
    return buffer.toBytes();
}

/**
 * freeze protection configuration
 * @param {boolean} enable
 * @param {number} temperature uint: Celcius
 * @example payload: { "freeze_protection": { "enable": true, "temperature": 5 } }, output: FFB0013200
 * @example payload: { "freeze_protection": { "enable": false } }, output: FFB0000000
 */
function setFreezeProtection(enable, temperature) {
    if (typeof enable !== "boolean") {
        throw new Error("freeze_protection.enable must be a boolean");
    }
    if (enable && typeof temperature !== "number") {
        throw new Error("freeze_protection.temperature must be a number");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xb0);
    buffer.writeUInt8(enable ? 0x01 : 0x00); // enable
    buffer.writeInt16LE(temperature * 10); // temperature
    return buffer.toBytes();
}

/**
 * child lock configuration
 * @param {boolean} child_lock
 * @example payload: { "child_lock": true }, output: FF2501
 */
function setChildLock(child_lock) {
    if (typeof child_lock !== "boolean") {
        throw new Error("child_lock must be a boolean");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x25);
    buffer.writeUInt8(child_lock ? 0x01 : 0x00);
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
