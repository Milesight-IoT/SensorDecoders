/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product DS1609
 */
var RAW_VALUE = 0x00;

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
    if ("report_battery" in payload) {
        encoded = encoded.concat(reportBattery(payload.report_battery));
    }
    if ("report_buzzer" in payload) {
        encoded = encoded.concat(reportBuzzer(payload.report_buzzer));
    }
    if ("report_display_content" in payload) {
        encoded = encoded.concat(reportDisplayContent(payload.report_display_content));
    }
    if ("report_interval" in payload) {
        encoded = encoded.concat(setReportInterval(payload.report_interval));
    }
    if ("template_1" in payload) {
        encoded = encoded.concat(setText(1, payload.template_1));
    }
    if ("template_2" in payload) {
        encoded = encoded.concat(setText(2, payload.template_2));
    }
    if ("buzzer_enable" in payload) {
        encoded = encoded.concat(setBuzzerEnable(payload.buzzer_enable));
    }
    if ("beep" in payload) {
        encoded = encoded.concat(beep(payload.beep));
    }
    if ("refresh_display" in payload) {
        encoded = encoded.concat(refreshDisplay(payload.refresh_display));
    }
    if ("display_refresh_interval" in payload) {
        encoded = encoded.concat(setDisplayRefreshInterval(payload.display_refresh_interval));
    }
    if ("multicast_config" in payload) {
        encoded = encoded.concat(setMulticastConfig(payload.multicast_config));
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
 * report battery
 * @param {number} report_battery values: (0: no, 1: yes)
 * @example { "report_battery": 1 }
 */
function reportBattery(report_battery) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(report_battery) === -1) {
        throw new Error("report_battery must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, report_battery) === 0) {
        return [];
    }
    return [0xff, 0x28, 0x00];
}

/**
 * report buzzer
 * @param {number} report_buzzer values: (0: no, 1: yes)
 * @example { "report_buzzer": 1 }
 */
function reportBuzzer(report_buzzer) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(report_buzzer) === -1) {
        throw new Error("report_buzzer must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, report_buzzer) === 0) {
        return [];
    }
    return [0xff, 0x28, 0x01];
}

/**
 * report display content
 * @param {number} report_display_content values: (0: no, 1: yes)
 * @example { "report_display_content": 1 }
 */
function reportDisplayContent(report_display_content) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(report_display_content) === -1) {
        throw new Error("report_display_content must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, report_display_content) === 0) {
        return [];
    }
    return [0xff, 0x28, 0x02];
}

/**
 * set report interval
 * @param {number} report_interval unit: seconds
 * @example { "report_interval": 600 }
 */
function setReportInterval(report_interval) {
    if (typeof report_interval !== "number") {
        throw new Error("report_interval must be a number");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x03);
    buffer.writeUInt16LE(report_interval);
    return buffer.toBytes();
}

/**
 * update contents of template_x
 * @param {object} template_x keys: (template_1, template_2)
 * @param {string} template_x.text_x keys: (text_1, ..., text_25)
 * @param {string} template_x.qrcode keys: (qrcode_1, ..., qrcode_25)
 * @example { "template_1": { "text_1": "Hello", "qrcode": "https://www.milesight.com" } }
 * @example { "template_2": { "text_1": "Hello", "text_2": "World" } }
 */
function setText(template_id, contents) {
    var template_values = [1];
    var text_id_map = { text_1: 0, text_2: 1, text_3: 2, text_4: 3, text_5: 4, text_6: 5, text_7: 6, text_8: 7, text_9: 8, text_10: 9, text_11: 10, text_12: 11, text_13: 12, text_14: 13, text_15: 14, text_16: 15, text_17: 16, text_18: 17, text_19: 18, text_20: 19, text_21: 20, text_22: 21, text_23: 22, text_24: 23, text_25: 24 };
    var qrcode_id_map = { qrcode_1: 0, qrcode_2: 1, qrcode_3: 2, qrcode_4: 3, qrcode_5: 4, qrcode_6: 5, qrcode_7: 6, qrcode_8: 7, qrcode_9: 8, qrcode_10: 9, qrcode_11: 10, qrcode_12: 11, qrcode_13: 12, qrcode_14: 13, qrcode_15: 14, qrcode_16: 15, qrcode_17: 16, qrcode_18: 17, qrcode_19: 18, qrcode_20: 19, qrcode_21: 20, qrcode_22: 21, qrcode_23: 22, qrcode_24: 23, qrcode_25: 24 };

    var encoded = [];
    if (template_values.indexOf(template_id) === -1) {
        throw new Error("template_id must be one of " + template_values.join(", "));
    }
    for (var text_key in text_id_map) {
        if (text_key in contents) {
            encoded = encoded.concat(encodeContent(template_id - 1, "text", text_id_map[text_key], contents[text_key]));
        }
    }
    for (var qrcode_key in qrcode_id_map) {
        if (qrcode_key in contents) {
            encoded = encoded.concat(encodeContent(template_id - 1, "qrcode", qrcode_id_map[qrcode_key], contents[qrcode_key]));
        }
    }

    return encoded;
}

function encodeContent(template_id, block_type, block_id, content) {
    var bytes = encodeUtf8(content);

    var block_type_map = { 1: "text", 2: "qrcode", 3: "image", 4: "background" };

    var data = 0x00;
    data |= template_id << 4;
    data |= getValue(block_type_map, block_type) << 0;

    var buffer = new Buffer(4 + bytes.length);
    buffer.writeUInt8(0xfb);
    buffer.writeUInt8(data);
    buffer.writeUInt8(block_id);
    buffer.writeUInt16LE(bytes.length);
    buffer.writeBytes(bytes);
    return buffer.toBytes();
}

/**
 * set buzzer enable
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
 * beep
 * @param {number} beep values: (0: no, 1: yes)
 * @example { "beep": 1 }
 */
function beep(beep) {
    var beep_map = { 0: "no", 1: "yes" };
    var beep_values = getValues(beep_map);
    if (beep_values.indexOf(beep) === -1) {
        throw new Error("beep must be one of " + beep_values.join(", "));
    }

    if (getValue(beep_map, beep) === 0) {
        return [];
    }
    return [0xff, 0x3d, 0x01];
}

/**
 * refresh display
 * @param {number} refresh_display values: (0: no, 1: yes)
 * @example { "refresh_display": 1 }
 */
function refreshDisplay(refresh_display) {
    var refresh_display_map = { 0: "no", 1: "yes" };
    var refresh_display_values = getValues(refresh_display_map);
    if (refresh_display_values.indexOf(refresh_display) === -1) {
        throw new Error("refresh_display must be one of " + refresh_display_values.join(", "));
    }

    if (getValue(refresh_display_map, refresh_display) === 0) {
        return [];
    }
    return [0xff, 0x3d, 0x02];
}

/**
 * display refresh interval
 * @param {number} display_refresh_interval unit: day, range: [1, 90]
 * @example { "display_refresh_interval": 1 }
 */
function setDisplayRefreshInterval(display_refresh_interval) {
    if (display_refresh_interval < 1 || display_refresh_interval > 90) {
        throw new Error("display refresh interval out of range");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x86);
    buffer.writeUInt8(display_refresh_interval);
    return buffer.toBytes();
}

/**
 * set multicast config
 * @param {object} multicast_config
 * @param {number} multicast_config.group_1 values: (0: disable, 1: enable)
 * @param {number} multicast_config.group_2 values: (0: disable, 1: enable)
 * @param {number} multicast_config.group_3 values: (0: disable, 1: enable)
 * @param {number} multicast_config.group_4 values: (0: disable, 1: enable)
 * @example { "multicast_config": { "group_1": 1, "group_2": 0, "group_3": 1, "group_4": 0 } }
 */
function setMulticastConfig(multicast_config) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);

    var data = 0;
    var group_offset = { group_1: 0, group_2: 1, group_3: 2, group_4: 3 };
    for (var key in group_offset) {
        if (key in multicast_config) {
            if (enable_values.indexOf(multicast_config[key]) === -1) {
                throw new Error("multicast_config." + key + " must be one of " + enable_values.join(", "));
            }
            if (getValue(enable_map, multicast_config[key]) === 0) {
                continue;
            }
            data |= 1 << (group_offset[key] + 4);
            data |= getValue(enable_map, multicast_config[key]) << 0;
        }
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x82);
    buffer.writeUInt8(data);
    return buffer.toBytes();
}

/* eslint-disable */
function encodeUtf8(str) {
    var byteArray = [];
    for (var i = 0; i < str.length; i++) {
        var charCode = str.charCodeAt(i);
        if (charCode < 0x80) {
            byteArray.push(charCode);
        } else if (charCode < 0x800) {
            byteArray.push(0xc0 | (charCode >> 6));
            byteArray.push(0x80 | (charCode & 0x3f));
        } else if (charCode < 0x10000) {
            byteArray.push(0xe0 | (charCode >> 12));
            byteArray.push(0x80 | ((charCode >> 6) & 0x3f));
            byteArray.push(0x80 | (charCode & 0x3f));
        } else if (charCode < 0x200000) {
            byteArray.push(0xf0 | (charCode >> 18));
            byteArray.push(0x80 | ((charCode >> 12) & 0x3f));
            byteArray.push(0x80 | ((charCode >> 6) & 0x3f));
            byteArray.push(0x80 | (charCode & 0x3f));
        }
    }
    return byteArray;
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

Buffer.prototype.writeBytes = function (bytes) {
    for (var i = 0; i < bytes.length; i++) {
        this.buffer[this.offset + i] = bytes[i];
    }
    this.offset += bytes.length;
};

Buffer.prototype.toBytes = function () {
    return this.buffer;
};
/* eslint-enable */