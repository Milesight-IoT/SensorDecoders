/**
 * Payload Encoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product CT305 / CT310
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
    if ("report_status" in payload) {
        encoded = encoded.concat(reportStatus(payload.report_status));
    }
    if ("clear_current_cumulative_chn" in payload) {
        encoded = encoded.concat(clearCurrentCumulativeValue(payload.clear_current_cumulative_chn));
    }
    if ("alarm_report_counts" in payload) {
        encoded = encoded.concat(alarmReportCounts(payload.alarm_report_counts));
    }
    if ("alarm_report_interval" in payload) {
        encoded = encoded.concat(alarmReportInterval(payload.alarm_report_interval));
    }

    return encoded;
}

/**
 * reboot device
 * @param {boolean} reboot
 * @example payload: { "reboot": 1 } output: FF10FF
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
 * set report interval
 * @param {number} report_interval unit: minute
 * @example { "report_interval": 20 }
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
 * report device status
 * @param {boolean} report_status
 * @example payload: { "report_status": true } output: FF28FF
 */
function reportStatus(report_status) {
    if (typeof report_status !== "boolean") {
        throw new Error("report_status must be a boolean");
    }
    if (report_status === false) {
        return [];
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x28);
    buffer.writeUInt8(0xff);
    return buffer.toBytes();
}

/**
 * clear current cumulative value
 * @param {number} clear_current_cumulative_chn
 * @example payload: { "clear_current_cumulative_chn": 1 } output: FF2701
 */
function clearCurrentCumulativeValue(clear_current_cumulative_chn) {
    var clear_current_cumulative_chn_values = [0, 1, 2];
    if (clear_current_cumulative_chn_values.indexOf(clear_current_cumulative_chn) === -1) {
        throw new Error("clear_current_cumulative_chn must be one of " + clear_current_cumulative_chn_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x27);
    buffer.writeUInt8(clear_current_cumulative_chn_values.indexOf(clear_current_cumulative_chn));
    return buffer.toBytes();
}

/**
 * alarm report counts
 * @param {number} alarm_report_counts, range: 1-1000
 * @example payload: { "alarm_report_counts": 1000 } output: FFF2E803
 */
function alarmReportCounts(alarm_report_counts) {
    if (typeof alarm_report_counts !== "number") {
        throw new Error("alarm_report_counts must be a number");
    }
    if (alarm_report_counts < 1 || alarm_report_counts > 1000) {
        throw new Error("alarm_report_counts must be between 1 and 1000");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xf2);
    buffer.writeUInt16LE(alarm_report_counts);
    return buffer.toBytes();
}

/**
 * alarm report interval
 * @param {number} alarm_report_interval range: 1-1440, unit: minute
 * @example playload: { "alarm_report_interval": 1 } output: FF020100
 */
function alarmReportInterval(alarm_report_interval) {
    if (typeof alarm_report_interval !== "number") {
        throw new Error("alarm_report_interval must be a number");
    }
    if (alarm_report_interval < 1 || alarm_report_interval > 1440) {
        throw new Error("alarm_report_interval must be between 1 and 1440");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x02);
    buffer.writeUInt16LE(alarm_report_interval);
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
