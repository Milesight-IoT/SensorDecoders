/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product WS302
 */
var RAW_VALUE = 0x00;

/* eslint no-redeclare: "off" */
/* eslint-disable */
// Chirpstack v4
function encodeDownlink(input) {
    return milesightDeviceEncode(input.data);
}

// Chirpstack v3
function Encode(fPort, obj, variables) {
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
    if ("time_zone" in payload) {
        encoded = encoded.concat(setTimeZone(payload.time_zone));
    }
    if ("timestamp" in payload) {
        encoded = encoded.concat(setTime(payload.timestamp));
    }
    if ("time_sync_enable" in payload) {
        encoded = encoded.concat(timeSyncEnable(payload.time_sync_enable));
    }
    if ("led_indicator_enable" in payload) {
        encoded = encoded.concat(setLedIndicatorEnable(payload.led_indicator_enable));
    }
    if ("frequency_weighting_type" in payload && "time_weighting_type" in payload) {
        encoded = encoded.concat(setWeightingType(payload.frequency_weighting_type, payload.time_weighting_type));
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
 * set device time
 * @param {number} timestamp unit: second, UTC time
 * @example { "timestamp": 1628832309 }
 */
function setTime(timestamp) {
    if (typeof timestamp !== "number") {
        throw new Error("timestamp must be a number");
    }
    var buffer = new Buffer(6);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x11);
    buffer.writeUInt32LE(timestamp);
    return buffer.toBytes();
}

/**
 * set time zone
 * @param {number} time_zone unit: minute
 * @example { "time_zone": -4 }
 */
function setTimeZone(time_zone) {
    var timezone_values = [-120, -110, -100, -95, -90, -80, -70, -60, -50, -40, -35, -30, -20, -10, 0, 10, 20, 30, 35, 40, 45, 50, 55, 57, 60, 65, 70, 80, 90, 95, 100, 105, 110, 120, 127, 130, 140];
    if (timezone_values.indexOf(time_zone) === -1) {
        throw new Error("time_zone must be one of " + timezone_values.join(", "));
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x17);
    buffer.writeInt16LE(time_zone);
    return buffer.toBytes();
}

/**
 * time sync enable
 * @param {number} time_sync_enable values: (0: disable, 1: enable)
 * @example { "time_sync_enable": 1 }
 */
function timeSyncEnable(time_sync_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(time_sync_enable) === -1) {
        throw new Error("time_sync_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x3b);
    buffer.writeUInt8(getValue(enable_map, time_sync_enable));
    return buffer.toBytes();
}

/**
 * set led enable
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
    buffer.writeUInt8(0x2d);
    buffer.writeUInt8(getValue(enable_map, led_indicator_enable));
    return buffer.toBytes();
}

/**
 * set frequency weighting type and time weighting type
 * @param {number} frequency_weighting_type values: (0: Z, 1: A, 2: C)
 * @param {number} time_weighting_type values: (0: I, 1: F, 2: S)
 * @returns 
 */
function setWeightingType(frequency_weighting_type, time_weighting_type) {
    var frequency_weighting_type_map = { 0: "Z", 1: "A", 2: "C" };
    var time_weighting_type_map = { 0: "I", 1: "F", 2: "S" };
    var frequency_weighting_type_values = getValues(frequency_weighting_type_map);
    var time_weighting_type_values = getValues(time_weighting_type_map);
    if (frequency_weighting_type_values.indexOf(frequency_weighting_type) === -1) {
        throw new Error("frequency_weighting_type must be one of " + frequency_weighting_type_values.join(", "));
    }
    if (time_weighting_type_values.indexOf(time_weighting_type) === -1) {
        throw new Error("time_weighting_type must be one of " + time_weighting_type_values.join(", "));
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x1d);
    buffer.writeUInt8(getValue(frequency_weighting_type_map, frequency_weighting_type));
    buffer.writeUInt8(getValue(time_weighting_type_map, time_weighting_type));
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
