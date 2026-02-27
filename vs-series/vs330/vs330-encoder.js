/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product VS330
 */
var RAW_VALUE = 0x00;

/* eslint no-redeclare: "off" */
/* eslint-disable */
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
/* eslint-enable */

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
    if ("human_exist_height" in payload) {
        encoded = encoded.concat(setHumanExistHeight(payload.human_exist_height));
    }
    if ("test_enable" in payload) {
        encoded = encoded.concat(setTestEnable(payload.test_enable));
    }
    if ("test_duration" in payload) {
        encoded = encoded.concat(setTestDuration(payload.test_duration));
    }
    if ("back_test_config" in payload) {
        encoded = encoded.concat(setBackTestMode(payload.back_test_config));
    }
    if ("test_install_config" in payload) {
        encoded = encoded.concat(setTestDeployConfig(payload.test_install_config));
    }
    if ("debug_enable" in payload) {
        encoded = encoded.concat(setDebugEnable(payload.debug_enable));
    }
    if ("second_learn_enable" in payload) {
        encoded = encoded.concat(setSecondLearnEnable(payload.second_learn_enable));
    }
    if ("second_learn_time" in payload) {
        encoded = encoded.concat(setSecondLearnTime(payload.second_learn_time));
    }
    if ("collection_count" in payload) {
        encoded = encoded.concat(setCollectionCount(payload.collection_count));
    }
    if ("pir_collection_config" in payload) {
        encoded = encoded.concat(setPIRCollectionConfig(payload.pir_collection_config));
    }
    if ("toilet_mode" in payload) {
        encoded = encoded.concat(setToiletMode(payload.toilet_mode));
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
 * @param {number} collection_interval unit: second, range: [1, 10]
 * @example { "collection_interval": 5 }
 */
function setCollectionInterval(collection_interval) {
    if (typeof collection_interval !== "number") {
        throw new Error("collection_interval must be a number");
    }
    if (collection_interval < 1 || collection_interval > 10) {
        throw new Error("collection_interval must be in range [1, 10]");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x02);
    buffer.writeUInt16LE(collection_interval);
    return buffer.toBytes();
}

/**
 * set test install config
 * @param {object} test_install_config
 * @param {number} test_install_config.test_enable values: (0: disable, 1: enable)
 * @param {number} test_install_config.deploy_height unit: cm, range: [250, 350]
 * @example { "test_install_config": { "test_enable": 0, "deploy_height": 250 } }
 */
function setTestDeployConfig(test_install_config) {
    var enable = test_install_config.test_enable;
    var height = test_install_config.deploy_height;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("test_install_config.test_enable must be one of " + enable_values.join(", "));
    }
    if (height < 250 || height > 350) {
        throw new Error("test_install_config.deploy_height must be in range [250, 350]");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x7e);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt16LE(height);
    return buffer.toBytes();
}

/**
 * set debug enable
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
 * set second learn enable
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
 * @param {number} second_learn_time unit: second, range: [1, 60]
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
 * set collection count
 * @param {number} collection_count unit: count, 
 * @example { "collection_count": 100 }
 */
function setCollectionCount(collection_count) {
    if (typeof collection_count !== "number") {
        throw new Error("collection_count must be a number");
    }
    
    var buffer = new Buffer(6);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x88);
    buffer.writeUInt32LE(collection_count);
    return buffer.toBytes();
}

/**
 * set PIR collection config
 * @param {object} pir_collection_config
 * @param {number} pir_collection_config.first_delay unit: second
 * @param {number} pir_collection_config.interval unit: second
 * @param {number} pir_collection_config.count
 * @example { "pir_collection_config": { "first_delay": 10, "interval": 10, "count": 10 } }
 */
function setPIRCollectionConfig(pir_collection_config) {
    var first_delay = pir_collection_config.first_delay;
    var interval = pir_collection_config.interval;
    var count = pir_collection_config.count;

    if (typeof first_delay !== "number") {
        throw new Error("first_delay must be a number");
    }
    if (typeof interval !== "number") {
        throw new Error("interval must be a number");
    }
    if (typeof count !== "number") {
        throw new Error("count must be a number");
    }
    
    var buffer = new Buffer(5);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0xb9);
    buffer.writeUInt8(first_delay);
    buffer.writeUInt8(interval);
    buffer.writeUInt8(count);
    return buffer.toBytes();
}

/**
 * set toilet mode
 * @param {number} toilet_mode values: (0: disable, 1: enable)
 * @example { "toilet_mode": 1 }
 */
function setToiletMode(toilet_mode) {
    var mode_map = { 0: "disable", 1: "enable" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(toilet_mode) === -1) {
        throw new Error("toilet_mode must be one of " + mode_values.join(", "));
    }
    
    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0xa1);
    buffer.writeUInt8(getValue(mode_map, toilet_mode));
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
 * set human exist height
 * @param {number} human_exist_height unit: mm, range: [1, 300]
 * @example { "human_exist_height": 120 }
 */
function setHumanExistHeight(human_exist_height) {
    if (typeof human_exist_height !== "number") {
        throw new Error("human_exist_height must be a number");
    }
    if (human_exist_height < 1 || human_exist_height > 300) {
        throw new Error("human_exist_height must be in range [1, 300]");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x70);
    buffer.writeUInt16LE(human_exist_height);
    return buffer.toBytes();
}

/**
 * set test enable
 * @param {number} test_enable values: (0: disable, 1: enable)
 * @example { "test_enable": 1 }
 */
function setTestEnable(test_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(test_enable) === -1) {
        throw new Error("test_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x71);
    buffer.writeUInt8(getValue(enable_map, test_enable));
    return buffer.toBytes();
}

/**
 * set test mode duration
 * @param {number} test_duration unit: min, range: [1, 30]
 * @example { "test_duration": 10 }
 */
function setTestDuration(test_duration) {
    if (typeof test_duration !== "number") {
        throw new Error("test_duration must be a number");
    }
    if (test_duration < 1 || test_duration > 30) {
        throw new Error("test_duration must be in range [1, 30]");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x72);
    buffer.writeUInt16LE(test_duration);
    return buffer.toBytes();
}

/**
 * set back test mode
 * @param {object} back_test_config
 * @param {number} back_test_config.enable values: (0: disable, 1: enable)
 * @param {number} back_test_config.distance unit: mm, range: [40, 3500]
 * @example { "back_test_config": { "enable": 0, "distance": 1000 } }
 */
function setBackTestMode(back_test_config) {
    var enable = back_test_config.enable;
    var distance = back_test_config.distance;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("back_test_config.enable must be one of " + enable_values.join(", "));
    }
    if (distance < 40 || distance > 3500) {
        throw new Error("back_test_config.distance must be in range [40, 3500]");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x7a);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt16LE(distance);
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

Buffer.prototype.toBytes = function () {
    return this.buffer;
};
