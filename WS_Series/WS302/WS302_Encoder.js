/**
 * Payload Encoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product WT301
 */
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

function milesightDeviceEncode(payload) {
    var encoded = [];

    if ("reboot" in payload) {
        encoded = encoded.concat(reboot(payload.reboot));
    }
    if ("timezone" in payload) {
        encoded = encoded.concat(setTimeZone(payload.timezone));
    }
    if ("timestamp" in payload) {
        encoded = encoded.concat(setTime(payload.timestamp));
    }
    if ("time_sync_enable" in payload) {
        encoded = encoded.concat(timeSyncEnable(payload.time_sync_enable));
    }
    if ("led_enable" in payload) {
        encoded = encoded.concat(ledEnable(payload.led_enable));
    }
    if ("frequency_weighting_type" in payload && "time_weighting_type" in payload) {
        encoded = encoded.concat(setWeightingType(payload.frequency_weighting_type, payload.time_weighting_type));
    }

    return encoded;
}

/**
 * reboot device
 * @param {number} reboot 
 * @example payload: { "reboot": 1 }, output: FF10FF
 */
function reboot(reboot) {
    var reboot_values = [0, 1];
    if (reboot_values.indexOf(reboot) === -1) {
        throw new Error("reboot must be 0 or 1");
    }
    if (reboot === 0) {
        return [];
    }

    return [0xff, 0x10, 0xff];
}


/**
 * set device time
 * @param {number} timestamp unit: second, UTC time
 * @example payload: { "timestamp": 1628832309 }, output: FF1135021661
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
 * @param {number} timezone
 * @example payload: { "timezone": -4 }, output: FF17D8FF
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
 * time sync enable
 * @param {number} time_sync_enable values: (0: disable, 1: enable)
 * @example payload: { "time_sync_enable": 1 }, output: FF3B01
 */
function timeSyncEnable(time_sync_enable) {
    var time_sync_enable_values = [0, 1];
    if (time_sync_enable_values.indexOf(time_sync_enable) === -1) {
        throw new Error("time_sync_enable must be 0 or 1");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x3b);
    buffer.writeUInt8(time_sync_enable);
    return buffer.toBytes();
}

/**
 * set led enable
 * @param {number} led_enable values: (0: disable, 1: enable)
 * @example payload: { "led_enable": 1 }, output: FF2F01
 */
function ledEnable(led_enable) {
    var led_enable_values = [0, 1];
    if (led_enable_values.indexOf(led_enable) === -1) {
        throw new Error("led_enable must be 0 or 1");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x2d);
    buffer.writeUInt8(led_enable);
    return buffer.toBytes();
}

/**
 * set frequency weighting type and time weighting type
 * @param {number} frequency_weighting_type values: (0: Z, 1: A, 2: C)
 * @param {number} time_weighting_type values: (0: I, 1: F, 2: S)
 * @returns 
 */
function setWeightingType(frequency_weighting_type, time_weighting_type) {
    var frequency_weighting_type_values = [0, 1, 2];
    var time_weighting_type_values = [0, 1, 2];
    if (typeof frequency_weighting_type !== "number" || typeof time_weighting_type !== "number") {
        throw new Error("frequency_weighting_type and time_weighting_type must be a number");
    }
    if (frequency_weighting_type_values.indexOf(frequency_weighting_type) === -1) {
        throw new Error("frequency_weighting_type must be 0, 1 or 2");
    }
    if (time_weighting_type_values.indexOf(time_weighting_type) === -1) {
        throw new Error("time_weighting_type must be 0, 1 or 2");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x1d);
    buffer.writeUInt8(frequency_weighting_type);
    buffer.writeUInt8(time_weighting_type);
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
