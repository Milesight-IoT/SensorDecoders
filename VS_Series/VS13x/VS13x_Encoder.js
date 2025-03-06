/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product VS133 / VS135
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
    if ("report_interval" in payload) {
        encoded = encoded.concat(setReportInterval(payload.report_interval));
    }
    if ("confirm_mode_enable" in payload) {
        encoded = encoded.concat(setConfirmModeEnable(payload.confirm_mode_enable));
    }
    if ("adr_enable" in payload) {
        encoded = encoded.concat(setAdrEnable(payload.adr_enable));
    }
    if ("wifi_enable" in payload) {
        encoded = encoded.concat(setWifiEnable(payload.wifi_enable));
    }
    if ("periodic_report_enable" in payload) {
        encoded = encoded.concat(setPeriodicReportEnable(payload.periodic_report_enable));
    }
    if ("trigger_report_enable" in payload) {
        encoded = encoded.concat(setTriggerReportEnable(payload.trigger_report_enable));
    }
    if ("clear_total_count" in payload) {
        encoded = encoded.concat(setClearTotalCount(payload.clear_total_count));
    }

    return encoded;
}

/**
 * reboot
 * @param {number} reboot values: (0: no, 1: yes)
 * @example { "reboot": 1 }
 */
function reboot(reboot) {
    var reboot_map = { 0: "no", 1: "yes" };
    var reboot_values = getValues(reboot_map);
    if (reboot_values.indexOf(reboot) === -1) {
        throw new Error("reboot must be one of " + reboot_values.join(", "));
    }

    if (getValue(reboot_map, reboot) === 0) {
        return [];
    }
    return [0xff, 0x10, 0xff];
}

/**
 * report_interval
 * @param {number} report_interval unit: second
 * @example { "report_interval": 10 }
 */
function setReportInterval(report_interval) {
    if (report_interval < 1 || report_interval > 64800) {
        throw new Error("report_interval must be between 1 and 64800");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x03);
    buffer.writeUInt8(report_interval);
    return buffer.toBytes();
}

/**
 * confirm_mode_enable
 * @param {number} confirm_mode_enable values: (0: disable, 1: enable)
 * @example { "confirm_mode_enable": 1 }
 */
function setConfirmModeEnable(confirm_mode_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(confirm_mode_enable) === -1) {
        throw new Error("confirm_mode_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x04);
    buffer.writeUInt8(getValue(enable_map, confirm_mode_enable));
    return buffer.toBytes();
}

/**
 * adr_enable
 * @param {number} adr_enable values: (0: disable, 1: enable)
 * @example { "adr_enable": 1 }
 */
function setAdrEnable(adr_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(adr_enable) === -1) {
        throw new Error("adr_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x40);
    buffer.writeUInt8(getValue(enable_map, adr_enable));
    return buffer.toBytes();
}

/**
 * wifi_enable
 * @param {number} wifi_enable values: (0: disable, 1: enable)
 * @example { "wifi_enable": 1 }
 */
function setWifiEnable(wifi_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(wifi_enable) === -1) {
        throw new Error("wifi_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x42);
    buffer.writeUInt8(getValue(enable_map, wifi_enable));
    return buffer.toBytes();
}

/**
 * periodic_report_enable
 * @param {number} periodic_report_enable values: (0: disable, 1: enable)
 * @example { "periodic_report_enable": 1 }
 */
function setPeriodicReportEnable(periodic_report_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(periodic_report_enable) === -1) {
        throw new Error("periodic_report_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x43);
    buffer.writeUInt8(getValue(enable_map, periodic_report_enable));
    return buffer.toBytes();
}

/**
 * trigger_report_enable
 * @param {number} trigger_report_enable values: (0: disable, 1: enable)
 * @example { "trigger_report_enable": 1 }
 */
function setTriggerReportEnable(trigger_report_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(trigger_report_enable) === -1) {
        throw new Error("trigger_report_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x44);
    buffer.writeUInt8(getValue(enable_map, trigger_report_enable));
    return buffer.toBytes();
}

/**
 * clear_total_count
 * @param {number} clear_total_count values: (0: no, 1: yes)
 * @example { "clear_total_count": 1 }
 */
function setClearTotalCount(clear_total_count) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(clear_total_count) === -1) {
        throw new Error("clear_total_count must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, clear_total_count) === 0) {
        return [];
    }
    return [0xff, 0x51, 0xff];
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

Buffer.prototype.writeHex = function (hexString) {
    var bytes = [];
    for (var i = 0; i < hexString.length; i += 2) {
        bytes.push(parseInt(hexString.substr(i, 2), 16));
    }
    this.writeBytes(bytes);
};

Buffer.prototype.writeUtf8 = function (str) {
    var bytes = [];
    for (var i = 0; i < str.length; i++) {
        var charCode = str.charCodeAt(i);
        if (charCode < 0x80) {
            bytes.push(charCode);
        } else if (charCode < 0x800) {
            bytes.push(0xc0 | (charCode >> 6));
            bytes.push(0x80 | (charCode & 0x3f));
        } else if (charCode < 0x10000) {
            bytes.push(0xe0 | (charCode >> 12));
            bytes.push(0x80 | ((charCode >> 6) & 0x3f));
            bytes.push(0x80 | (charCode & 0x3f));
        } else if (charCode < 0x200000) {
            bytes.push(0xf0 | (charCode >> 18));
            bytes.push(0x80 | ((charCode >> 12) & 0x3f));
            bytes.push(0x80 | ((charCode >> 6) & 0x3f));
            bytes.push(0x80 | (charCode & 0x3f));
        }
    }
    this.writeBytes(bytes);
};

Buffer.prototype.writeBytes = function (bytes) {
    for (var i = 0; i < bytes.length; i++) {
        this.buffer[this.offset + i] = bytes[i];
    }
    this.offset += bytes.length;
};

Buffer.prototype.toBytes = function () {
    return this.buffer;
};