/**
 * Payload Encoder for Chirpstack v4
 *
 * Copyright 2024 Milesight IoT
 *
 * @product TS201
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
    if ("sync_time" in obj) {
        encoded = encoded.concat(syncTime(obj.sync_time));
    }
    if ("report_interval" in obj) {
        encoded = encoded.concat(setReportInterval(obj.report_interval));
    }
    if ("collection_interval" in obj) {
        encoded = encoded.concat(setCollectionInterval(obj.collection_interval));
    }
    if ("report_status" in obj) {
        encoded = encoded.concat(reportStatus(obj.report_status));
    }
    if ("history_enable" in obj) {
        encoded = encoded.concat(setHistoryEnable(obj.history_enable));
    }
    if ("fetch_history" in obj) {
        encoded = encoded.concat(fetchHistory(obj.fetch_history.start_time, obj.fetch_history.end_time));
    }
    if ("clear_history" in obj) {
        encoded = encoded.concat(clearHistory(obj.clear_history));
    }
    if ("retransmit_enable" in obj) {
        encoded = encoded.concat(setRetransmitEnable(obj.retransmit_enable));
    }
    if ("retransmit_interval" in obj) {
        encoded = encoded.concat(setRetransmitInterval(obj.retransmit_interval));
    }
    if ("stop_transimit" in obj) {
        encoded = encoded.concat(stopTransimit(obj.stop_transimit));
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
 * @example payload: { "sync_time": true }, output: FF4A00
 */
function syncTime(sync_time) {
    if (typeof sync_time !== "boolean") {
        throw new Error("sync_time must be a boolean");
    }
    if (sync_time === false) {
        return [];
    }
    return [0xff, 0x4a, 0x00];
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
    buffer.writeUInt8(0x00);
    buffer.writeUInt16LE(report_interval);
    return buffer.toBytes();
}

/**
 * set collection interval
 * @param {number} collection_interval unit: seconds
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
 * report status
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
 * history function configuration
 * @param {boolean} history_enable
 */
function setHistoryEnable(history_enable) {
    if (typeof history_enable !== "boolean") {
        throw new Error("history_enable must be a boolean");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x68);
    buffer.writeUInt8(history_enable ? 1 : 0);
    return buffer.toBytes();
}

/**
 * fetch history
 * @param {number} start_time
 * @param {number} end_time
 */
function fetchHistory(start_time, end_time) {
    if (typeof start_time !== "number") {
        throw new Error("start_time must be a number");
    }
    if (end_time && typeof end_time !== "number") {
        throw new Error("end_time must be a number");
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
 * @param {boolean} clear_history
 */
function clearHistory(clear_history) {
    if (typeof clear_history !== "boolean") {
        throw new Error("clear_history must be a boolean");
    }

    if (clear_history === false) {
        return [];
    }
    return [0xff, 0x27, 0x01];
}

/**
 * @param {boolean} retransmit_enable
 */
function setRetransmitEnable(retransmit_enable) {
    if (typeof retransmit_enable !== "boolean") {
        throw new Error("retransmit_enable must be a boolean");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x69);
    buffer.writeUInt8(retransmit_enable ? 0x01 : 0x00);
    return buffer.toBytes();
}

/**
 * @param {number} retransmit_interval unit: seconds
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
 * @param {boolean} stop_transimit
 */
function stopTransimit(stop_transimit) {
    if (typeof stop_transimit !== "boolean") {
        throw new Error("stop_transimit must be a boolean");
    }

    if (stop_transimit === false) {
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
