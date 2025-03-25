/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product VS330
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
    if ("collection_interval" in payload) {
        encoded = encoded.concat(setCollectionInterval(payload.collection_interval));
    }
    if ("report_interval" in payload) {
        encoded = encoded.concat(setReportInterval(payload.report_interval));
    }
    if ("test_config" in payload) {
        encoded = encoded.concat(setTestConfig(payload.test_config));
    }
    if ("test_duration" in payload) {
        encoded = encoded.concat(setTestDuration(payload.test_duration));
    }
    if ("debug_enable" in payload) {
        encoded = encoded.concat(setDebugEnable(payload.debug_enable));
    }
    if ("first_learn_pir_idle_time" in payload) {
        encoded = encoded.concat(setFirstLearnPIRIdleTime(payload.first_learn_pir_idle_time));
    }
    if ("second_learn_enable" in payload) {
        encoded = encoded.concat(setSecondLearnEnable(payload.second_learn_enable));
    }
    if ("second_learn_time" in payload) {
        encoded = encoded.concat(setSecondLearnTime(payload.second_learn_time));
    }
    if ("learn_config" in payload) {
        encoded = encoded.concat(setLearnConfig(payload.learn_config));
    }
    if ("reset_collection_counts" in payload) {
        encoded = encoded.concat(resetCollectionCounts(payload.reset_collection_counts));
    }

    return encoded;
}

/**
 * reboot
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
 * set collection interval
 * @odm 2713
 * @param {number} collection_interval unit: second, range: [3, 65535]
 * @example { "collection_interval": 5 }
 */
function setCollectionInterval(collection_interval) {
    if (typeof collection_interval !== "number") {
        throw new Error("collection_interval must be a number");
    }
    if (collection_interval < 3 || collection_interval > 65535) {
        throw new Error("collection_interval must be in range [3, 65535]");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x02);
    buffer.writeUInt16LE(collection_interval);
    return buffer.toBytes();
}

/**
 * report interval configuration
 * @param {number} report_interval uint: second, range: [60, 64800]
 * @example { "report_interval": 64800 }
 */
function setReportInterval(report_interval) {
    if (typeof report_interval !== "number") {
        throw new Error("report_interval must be a number");
    }
    if (report_interval < 60 || report_interval > 64800) {
        throw new Error("report_interval must be in the range of [60, 64800]");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x03);
    buffer.writeUInt16LE(report_interval);
    return buffer.toBytes();
}

/**
 * set test config
 * @odm 2713
 * @param {object} test_config
 * @param {number} test_config.enable values: (0: disable, 1: enable)
 * @param {number} test_config.install_height unit: cm, range: [250, 350]
 * @example { "test_config": { "enable": 1, "install_height": 1000 } }
 */
function setTestConfig(test_config) {
    var enable = test_config.enable;
    var install_height = test_config.install_height;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("test_config.enable must be one of " + enable_values.join(", "));
    }
    if (install_height < 250 || install_height > 350) {
        throw new Error("test_config.install_height must be in range [250, 350]");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x7e);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt16LE(install_height);
    return buffer.toBytes();
}

/**
 * set test mode duration
 * @odm 2713
 * @param {number} test_duration unit: min, range: [1, 60]
 * @example { "test_duration": 10 }
 */
function setTestDuration(test_duration) {
    if (typeof test_duration !== "number") {
        throw new Error("test_duration must be a number");
    }
    if (test_duration < 1 || test_duration > 60) {
        throw new Error("test_duration must be in range [1, 60]");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x72);
    buffer.writeUInt16LE(test_duration);
    return buffer.toBytes();
}

/**
 * set debug enable
 * @odm 2713
 * @param {number} debug_enable values: (0: disable, 1: enable)
 * @example { "debug_enable": 1 }
 */
function setDebugEnable(debug_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(debug_enable) === -1) {
        throw new Error("debug_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x7f);
    buffer.writeUInt8(getValue(enable_map, debug_enable));
    return buffer.toBytes();
}

/**
 * set first learn PIR idle time
 * @odm 2713
 * @param {number} first_learn_pir_idle_time unit: second, range: [1, 3600]
 * @example { "first_learn_pir_idle_time": 60 }
 */
function setFirstLearnPIRIdleTime(first_learn_pir_idle_time) {
    if (typeof first_learn_pir_idle_time !== "number") {
        throw new Error("first_learn_pir_idle_time must be a number");
    }
    if (first_learn_pir_idle_time < 1 || first_learn_pir_idle_time > 3600) {
        throw new Error("first_learn_pir_idle_time must be in range [1, 3600]");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x83);
    buffer.writeUInt16LE(first_learn_pir_idle_time);
    return buffer.toBytes();
}

/**
 * set second learn enable
 * @odm 2713
 * @param {number} second_learn_enable values: (0: disable, 1: enable)
 * @example { "second_learn_enable": 1 }
 */
function setSecondLearnEnable(second_learn_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(second_learn_enable) === -1) {
        throw new Error("second_learn_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x80);
    buffer.writeUInt8(getValue(enable_map, second_learn_enable));
    return buffer.toBytes();
}

/**
 * set second learn time
 * @odm 2713
 * @param {number} second_learn_time unit: minute, range: [30, 1440]
 * @example { "second_learn_time": 10 }
 */
function setSecondLearnTime(second_learn_time) {
    if (typeof second_learn_time !== "number") {
        throw new Error("second_learn_time must be a number");
    }
    if (second_learn_time < 30 || second_learn_time > 1440) {
        throw new Error("second_learn_time must be in range [30, 1440]");
    }
    var buffer = new Buffer(4);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x81);
    buffer.writeUInt16LE(second_learn_time);
    return buffer.toBytes();
}

/**
 * set learn config
 * @odm 2713
 * @param {object} learn_config
 * @param {number} learn_config.enable values: (0: disable, 1: enable)
 * @param {number} learn_config.start range: [20, 60]
 * @param {number} learn_config.end range: [20, 60]
 * @example { "learn_config": { "enable": 1, "start": 25, "end": 60 } }
 */
function setLearnConfig(learn_config) {
    var enable = learn_config.enable;
    var start = learn_config.start;
    var end = learn_config.end;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("learn_config.enable must be one of " + enable_values.join(", "));
    }
    if (start < 20 || start > 60) {
        throw new Error("learn_config.start must be in range [20, 60]");
    }
    if (end < 20 || end > 60) {
        throw new Error("learn_config.end must be in range [20, 60]");
    }
    if (start >= end) {
        throw new Error("learn_config.start must be less than learn_config.end");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x82);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(start);
    buffer.writeUInt8(end);
    return buffer.toBytes();
}

/**
 * set collection counts
 * @odm 2713
 * @param {number} reset_collection_counts unit: count, range: [0, 4294967295]
 * @example { "reset_collection_counts": 100 }
 */
function resetCollectionCounts(reset_collection_counts) {
    if (typeof reset_collection_counts !== "number") {
        throw new Error("reset_collection_counts must be a number");
    }
    if (reset_collection_counts < 0 || reset_collection_counts > 4294967295) {
        throw new Error("reset_collection_counts must be in range [0, 4294967295]");
    }
 
    var buffer = new Buffer(6);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x88);
    buffer.writeUInt32LE(reset_collection_counts);
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
