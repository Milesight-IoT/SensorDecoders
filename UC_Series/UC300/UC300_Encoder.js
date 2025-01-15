/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product UC300
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

    if ("collection_interval" in payload) {
        encoded = encoded.concat(setCollectionInterval(payload.collection_interval));
    }
    if ("report_interval" in payload) {
        encoded = encoded.concat(setReportInterval(payload.report_interval));
    }
    if ("rejoin" in payload) {
        encoded = encoded.concat(rejoin(payload.rejoin));
    }
    if ("reboot" in payload) {
        encoded = encoded.concat(reboot(payload.reboot));
    }
    if ("sync_time" in payload) {
        encoded = encoded.concat(syncTime(payload.sync_time));
    }
    if ("timezone" in payload) {
        encoded = encoded.concat(setTimeZone(payload.timezone));
    }
    if ("timestamp" in payload) {
        encoded = encoded.concat(setTimestamp(payload.timestamp));
    }
    if ("report_status" in payload) {
        encoded = encoded.concat(reportStatus(payload.report_status));
    }
    if ("jitter_config" in payload) {
        encoded = encoded.concat(setJitterConfig(payload.jitter_config));
    }
    if ("gpio_out_1_control" in payload) {
        encoded = encoded.concat(controlOutputStatusWithDuration(1, payload.gpio_out_1_control));
    }
    if ("gpio_out_2_control" in payload) {
        encoded = encoded.concat(controlOutputStatusWithDuration(2, payload.gpio_out_2_control));
    }
    if ("gpio_out_1" in payload) {
        encoded = encoded.concat(controlOutputStatus(1, payload.gpio_out_1));
    }
    if ("gpio_out_2" in payload) {
        encoded = encoded.concat(controlOutputStatus(2, payload.gpio_out_2));
    }

    return encoded;
}

/**
 * Set collection interval
 * @param {number} collection_interval unit: second
 * @example { "collection_interval": 300 }
 */
function setCollectionInterval(collection_interval) {
    if (typeof collection_interval !== "number") {
        throw new Error("collection_interval must be a number");
    }
    if (collection_interval < 0) {
        throw new Error("collection_interval must be greater than 0");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x02);
    buffer.writeUInt16LE(collection_interval);
    return buffer.toBytes();
}

/**
 * Set report interval
 * @param {number} report_interval unit: second
 * @example { "report_interval": 300 }
 */
function setReportInterval(report_interval) {
    if (typeof report_interval !== "number") {
        throw new Error("report_interval must be a number");
    }
    if (report_interval < 0) {
        throw new Error("report_interval must be greater than 0");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x03);
    buffer.writeUInt16LE(report_interval);
    return buffer.toBytes();
}

/**
 * Set rejoin
 * @param {number} rejoin values: (0: no, 1: yes)
 * @example { "rejoin": 1 }
 */
function rejoin(rejoin) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var rejoin_values = getValues(yes_no_map);
    if (rejoin_values.indexOf(rejoin) === -1) {
        throw new Error("rejoin must be one of " + rejoin_values.join(", "));
    }
    if (getValue(yes_no_map, rejoin) === 0) {
        return [];
    }
    return [0xff, 0x04, 0xff];
}

/**
 * Reboot
 * @param {number} reboot values: (0: no, 1: yes)
 * @example { "reboot": 1 }
 */
function reboot(reboot) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var reboot_values = getValues(yes_no_map);
    if (reboot_values.indexOf(reboot) === -1) {
        throw new Error("reboot must be one of " + reboot_values.join(", "));
    }
    if (getValue(yes_no_map, reboot) === 0) {
        return [];
    }
    return [0xff, 0x10, 0xff];
}

/**
 * Set timestamp
 * @param {number} timestamp unit: second
 * @example { "timestamp": 1710489600 }
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
 * Sync time
 * @param {number} sync_time values: (0: no, 1: yes)
 * @example { "sync_time": 1 }
 */
function syncTime(sync_time) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var sync_time_values = getValues(yes_no_map);
    if (sync_time_values.indexOf(sync_time) === -1) {
        throw new Error("sync_time must be one of " + sync_time_values.join(", "));
    }

    if (getValue(yes_no_map, sync_time) === 0) {
        return [];
    }
    return [0xff, 0x4a, 0xff];
}

/**
 * Report status
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
    return [0xff, 0x94, 0xff];
}

/**
 * Set jitter config
 * @param {object} jitter_config
 * @param {number} jitter_config.all unit: millisecond
 * @param {number} jitter_config.gpio_in_2 unit: millisecond
 * @param {number} jitter_config.gpio_in_3 unit: millisecond
 * @param {number} jitter_config.gpio_in_4 unit: millisecond
 * @param {number} jitter_config.gpio_out_1 unit: millisecond
 * @param {number} jitter_config.gpio_out_2 unit: millisecond
 * @example { "jitter_config": { "all": 100 } }
 * @example { "jitter_config": { "gpio_in_1": 1000, "gpio_in_2": 1000 } }
 */
function setJitterConfig(jitter_config) {
    var channel_map = { all: 0, gpio_in_1: 1, gpio_in_2: 2, gpio_in_3: 3, gpio_in_4: 4, gpio_out_1: 5, gpio_out_2: 6 };

    var data = [];
    for (var key in channel_map) {
        if (key in jitter_config) {
            var buffer = new Buffer(7);
            buffer.writeUInt8(0xff);
            buffer.writeUInt8(0x91);
            buffer.writeUInt8(channel_map[key]);
            buffer.writeUInt32LE(jitter_config[key]);
            data.push(buffer.toBytes());
        }
    }
    return data;
}

/**
 * Control output with time
 * @param {object} gpio_out_x_control
 * @param {number} gpio_out_x_control.duration unit: millisecond
 * @param {number} gpio_out_x_control.status values: (0: off, 1: on)
 * @example { "gpio_out_1_control": { "duration": 1000, "status": 1 } }
 * @example { "gpio_out_2_control": { "duration": 1000, "status": 0 } }
 */
function controlOutputStatusWithDuration(gpio_index, gpio_out_x_control) {
    var duration = gpio_out_x_control.duration;
    var status = gpio_out_x_control.status;
    var gpio_chns = [1, 2];
    if (gpio_chns.indexOf(gpio_index) === -1) {
        throw new Error("gpio_out_x_control must be one of " + gpio_chns.join(", "));
    }
    var on_off_map = { 0: "off", 1: "on" };
    var on_off_values = getValues(on_off_map);
    if (on_off_values.indexOf(status) === -1) {
        throw new Error("gpio_out_" + gpio_index + "_control.status must be one of " + on_off_values.join(", "));
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x92);
    buffer.writeUInt8(gpio_index);
    buffer.writeUInt8(getValue(on_off_map, status));
    buffer.writeUInt32LE(duration);
    return buffer.toBytes();
}

/**
 * Control output status
 * @param {number} gpio_index values: (1: gpio_out_1, 2: gpio_out_2)
 * @param {number} status values: (0: off, 1: on)
 * @example { "gpio_out_1": 1 }
 * @example { "gpio_out_2": 0 }
 */
function controlOutputStatus(gpio_index, status) {
    var gpio_chns = [1, 2];
    if (gpio_chns.indexOf(gpio_index) === -1) {
        throw new Error("gpio_index must be one of " + gpio_chns.join(", "));
    }
    var on_off_map = { 0: "off", 1: "on" };
    var on_off_values = getValues(on_off_map);
    if (on_off_values.indexOf(status) === -1) {
        throw new Error("gpio_out_" + gpio_index + "_control.status must be one of " + on_off_values.join(", "));
    }

    var channel_ids = [0x07, 0x08];
    var buffer = new Buffer(3);
    buffer.writeUInt8(channel_ids[gpio_index - 1]);
    buffer.writeUInt8(getValue(on_off_map, status));
    buffer.writeUInt8(0xff);
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
