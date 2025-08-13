/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product WS301 (ODM: 2809)
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
    if ("query_device_status" in payload) {
        encoded = encoded.concat(queryDeviceStatus(payload.query_device_status));
    }
    if ("report_interval" in payload) {
        encoded = encoded.concat(setReportInterval(payload.report_interval));
    }
    if ("alarm_config" in payload) {
        encoded = encoded.concat(setAlarmConfig(payload.alarm_config));
    }
    if ("magnet_alarm_config" in payload) {
        encoded = encoded.concat(setMagnetAlarmConfig(payload.magnet_alarm_config));
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
 * query device status
 * @param {number} query_device_status values: (0: no, 1: yes)
 * @example { "query_device_status": 1 }
 */
function queryDeviceStatus(query_device_status) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(query_device_status) === -1) {
        throw new Error("query_device_status must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, query_device_status) === 0) {
        return [];
    }
    return [0xff, 0x28, 0xff];
}

/**
 * set report interval
 * @param {number} report_interval unit: second, range: [60, 64800]
 * @example { "report_interval": 300 }
 */
function setReportInterval(report_interval) {
    if (report_interval < 60 || report_interval > 64800) {
        throw new Error("report_interval must be between 60 and 64800");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x03);
    buffer.writeUInt16LE(report_interval);
    return buffer.toBytes();
}

/**
 * set alarm config
 * @odm 2809
 * @param {object} alarm_config
 * @param {number} alarm_config.alarm_interval unit: minute, range: [1, 1080]
 * @param {number} alarm_config.alarm_count range: [1, 1000]
 * @param {number} alarm_config.alarm_release_enable values: (0: disable, 1: enable)
 * @example { "alarm_config": { "alarm_interval": 10, "alarm_count": 10, "alarm_release_enable": 1 } }
 */
function setAlarmConfig(alarm_config) {
    var alarm_interval = alarm_config.alarm_interval;
    var alarm_count = alarm_config.alarm_count;
    var alarm_release_enable = alarm_config.alarm_release_enable;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(alarm_release_enable) === -1) {
        throw new Error("alarm_config.alarm_release_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0xb6);
    buffer.writeUInt16LE(alarm_interval);
    buffer.writeUInt16LE(alarm_count);
    buffer.writeUInt8(getValue(enable_map, alarm_release_enable));
    return buffer.toBytes();
}

/**
 * set magnet alarm config
 * @odm 2809
 * @param {object} magnet_alarm_config
 * @param {number} magnet_alarm_config.mode values: (1: close, 2: open)
 * @param {number} magnet_alarm_config.enable values: (0: disable, 1: enable)
 * @param {number} magnet_alarm_config.duration unit: second, range: [1, 65535]
 * @example { "magnet_alarm_config": { "mode": 1, "enable": 1, "duration": 10 } }
 */
function setMagnetAlarmConfig(magnet_alarm_config) {
    var mode = magnet_alarm_config.mode;
    var enable = magnet_alarm_config.enable;
    var duration = magnet_alarm_config.duration;

    var mode_map = { 1: "close", 2: "open" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(mode) === -1) {
        throw new Error("magnet_alarm_config.mode must be one of " + mode_values.join(", "));
    }
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("magnet_alarm_config.enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0xb0);
    buffer.writeUInt8(getValue(mode_map, mode));
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt16LE(duration);
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

Buffer.prototype.writeUInt24LE = function (value) {
    this._write(value, 3, true);
    this.offset += 3;
};

Buffer.prototype.writeInt24LE = function (value) {
    this._write(value < 0 ? value + 0x1000000 : value, 3, true);
    this.offset += 3;
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
