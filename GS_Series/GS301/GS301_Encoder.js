/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product GS301
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

    if ("report_interval" in payload) {
        encoded = encoded.concat(setReportInterval(payload.report_interval));
    }
    if ("query_sensor_lifecycle_remain" in payload) {
        encoded = encoded.concat(querySensorLifeRemain(payload.query_sensor_lifecycle_remain));
    }
    if ("threshold_report_interval" in payload) {
        encoded = encoded.concat(setThresholdReportInterval(payload.threshold_report_interval));
    }
    if ("led_indicator_enable" in payload) {
        encoded = encoded.concat(setLedIndicatorEnable(payload.led_indicator_enable));
    }
    if ("buzzer_enable" in payload) {
        encoded = encoded.concat(setBuzzerEnable(payload.buzzer_enable));
    }
    if ("nh3_calibration_config" in payload) {
        encoded = encoded.concat(setNH3CalibrationConfig(payload.nh3_calibration_config));
    }
    if ("h2s_calibration_config" in payload) {
        encoded = encoded.concat(setH2SCalibrationConfig(payload.h2s_calibration_config));
    }

    return encoded;
}

/**
 * Set report interval
 * @param {number} report_interval unit: second
 * @example { "report_interval": 600 }
 */
function setReportInterval(report_interval) {
    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x03);
    buffer.writeUInt16LE(report_interval);
    return buffer.toBytes();
}

/**
 * Report sensor life remain
 * @param {number} query_sensor_lifecycle_remain values: (0: no, 1: yes)
 * @example { "query_sensor_lifecycle_remain": 1 }
 */
function querySensorLifeRemain(query_sensor_lifecycle_remain) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(query_sensor_lifecycle_remain) === -1) {
        throw new Error("query_sensor_lifecycle_remain must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, query_sensor_lifecycle_remain) === 0) {
        return [];
    }

    return [0xff, 0x7d, 0xff];
}

/**
 * Set threshold report interval
 * @param {number} threshold_report_interval unit: second
 * @example { "threshold_report_interval": 120 }
 */
function setThresholdReportInterval(threshold_report_interval) {
    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x66);
    buffer.writeUInt16LE(threshold_report_interval);
    return buffer.toBytes();
}

/**
 * Set led indicator enable
 * @param {number} led_indicator_enable values: (0: disable, 1: enable)
 * @example { "led_indicator_enable": 1 }
 */
function setLedIndicatorEnable(led_indicator_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(led_indicator_enable) === -1) {
        throw new Error("led_indicator_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x2f);
    buffer.writeUInt8(getValue(enable_map, led_indicator_enable));
    return buffer.toBytes();
}

/**
 * Set buzzer enable
 * @param {number} buzzer_enable values: (0: disable, 1: enable)
 * @example { "buzzer_enable": 1 }
 */
function setBuzzerEnable(buzzer_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(buzzer_enable) === -1) {
        throw new Error("buzzer_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x3e);
    buffer.writeUInt8(getValue(enable_map, buzzer_enable));
    return buffer.toBytes();
}

/**
 * Set NH3 calibration config
 * @param {object} nh3_calibration_config
 * @param {number} nh3_calibration_config.mode  values: (0: factory, 1: manual)
 * @param {number} nh3_calibration_config.calibration_value
 * @example { "nh3_calibration_config": { "mode": 1, "nh3_calibration_value": 0.01 } }
 */
function setNH3CalibrationConfig(nh3_calibration_config) {
    var mode_map = { 0: "factory", 1: "manual" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(nh3_calibration_config.mode) === -1) {
        throw new Error("nh3_calibration_config.mode must be one of " + mode_values.join(", "));
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x8d);
    buffer.writeUInt8(0x00);
    buffer.writeUInt8(getValue(mode_map, nh3_calibration_config.mode));
    buffer.writeUInt16LE(nh3_calibration_config.calibration_value * 100);
    return buffer.toBytes();
}

/**
 * Set H2S calibration config
 * @param {object} h2s_calibration_config
 * @param {number} h2s_calibration_config.mode  values: (0: factory, 1: manual)
 * @param {number} h2s_calibration_config.calibration_value
 * @example { "h2s_calibration_config": { "mode": 1, "h2s_calibration_value": 0.001 } }
 */
function setH2SCalibrationConfig(h2s_calibration_config) {
    var mode_map = { 0: "factory", 1: "manual" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(h2s_calibration_config.mode) === -1) {
        throw new Error("h2s_calibration_config.mode must be one of " + mode_values.join(", "));
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x8d);
    buffer.writeUInt8(0x01);
    buffer.writeUInt8(getValue(mode_map, h2s_calibration_config.mode));
    buffer.writeUInt16LE(h2s_calibration_config.calibration_value * 1000);
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
