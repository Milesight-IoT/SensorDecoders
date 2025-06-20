/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product UC100
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
    if ("report_interval" in payload) {
        encoded = encoded.concat(setReportInterval(payload.report_interval));
    }
    if ("modbus_channels" in payload) {
        encoded = encoded.concat(setModbusChannel(payload.modbus_channels));
    }
    if ("modbus_channels_name" in payload) {
        encoded = encoded.concat(setModbusChannelName(payload.modbus_channels_name));
    }
    if ("remove_modbus_channels" in payload) {
        encoded = encoded.concat(removeModbusChannel(payload.remove_modbus_channels));
    }

    return encoded;
}

/**
 * Reboot device
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
 * set report interval
 * @param {number} report_interval unit: second
 * @example { "report_interval": 600 }
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
 * Set modbus channel config
 * @param {object} modbus_channels
 * @param {number} modbus_channels._item.channel_id range: [1, 32]
 * @param {number} modbus_channels._item.slave_id range: [1, 255]
 * @param {number} modbus_channels._item.address range: [0, 65535]
 * @param {number} modbus_channels._item.quantity range: [1, 16]
 * @param {number} modbus_channels._item.type values: (
 *              0: MB_REG_COIL, 1: MB_REG_DIS,
 *              2: MB_REG_INPUT_AB, 3: MB_REG_INPUT_BA,
 *              4: MB_REG_INPUT_INT32_ABCD, 5: MB_REG_INPUT_INT32_BADC, 6: MB_REG_INPUT_INT32_CDAB, 7: MB_REG_INPUT_INT32_DCBA,
 *              8: MB_REG_INPUT_INT32_AB, 9: MB_REG_INPUT_INT32_CD,
 *              10: MB_REG_INPUT_FLOAT_ABCD, 11: MB_REG_INPUT_FLOAT_BADC, 12: MB_REG_INPUT_FLOAT_CDAB, 13: MB_REG_INPUT_FLOAT_DCBA,
 *              14: MB_REG_HOLD_INT16_AB, 15: MB_REG_HOLD_INT16_BA,
 *              16: MB_REG_HOLD_INT32_ABCD, 17: MB_REG_HOLD_INT32_BADC, 18: MB_REG_HOLD_INT32_CDAB, 19: MB_REG_HOLD_INT32_DCBA,
 *              20: MB_REG_HOLD_INT32_AB, 21: MB_REG_HOLD_INT32_CD,
 *              22: MB_REG_HOLD_FLOAT_ABCD, 23: MB_REG_HOLD_FLOAT_BADC, 24: MB_REG_HOLD_FLOAT_CDAB, 25: MB_REG_HOLD_FLOAT_DCBA)
 * @example { "modbus_channels": [ { "channel_id": 1, "slave_id": 1, "address": 1, "quantity": 1, "type": 1 } ] }
 */
function setModbusChannel(modbus_channels) {
    var channel_id = modbus_channels.channel_id;
    var slave_id = modbus_channels.slave_id;
    var register_address = modbus_channels.address;
    var quantity = modbus_channels.quantity;
    var register_type = modbus_channels.type;

    if (channel_id < 1 || channel_id > 32) {
        throw new Error("modbus_channels._item.channel_id must be between 1 and 32");
    }
    if (slave_id < 1 || slave_id > 255) {
        throw new Error("modbus_channels._item.slave_id must be between 1 and 255");
    }
    if (register_address < 0 || register_address > 65535) {
        throw new Error("modbus_channels._item.address must be between 0 and 65535");
    }
    if (quantity < 1 || quantity > 16) {
        throw new Error("modbus_channels._item.quantity must be between 1 and 16");
    }
    var register_type_map = {
        0: "MB_REG_COIL",
        1: "MB_REG_DIS",
        2: "MB_REG_INPUT_AB",
        3: "MB_REG_INPUT_BA",
        4: "MB_REG_INPUT_INT32_ABCD",
        5: "MB_REG_INPUT_INT32_BADC",
        6: "MB_REG_INPUT_INT32_CDAB",
        7: "MB_REG_INPUT_INT32_DCBA",
        8: "MB_REG_INPUT_INT32_AB",
        9: "MB_REG_INPUT_INT32_CD",
        10: "MB_REG_INPUT_FLOAT_ABCD",
        11: "MB_REG_INPUT_FLOAT_BADC",
        12: "MB_REG_INPUT_FLOAT_CDAB",
        13: "MB_REG_INPUT_FLOAT_DCBA",
        14: "MB_REG_HOLD_INT16_AB",
        15: "MB_REG_HOLD_INT16_BA",
        16: "MB_REG_HOLD_INT32_ABCD",
        17: "MB_REG_HOLD_INT32_BADC",
        18: "MB_REG_HOLD_INT32_CDAB",
        19: "MB_REG_HOLD_INT32_DCBA",
        20: "MB_REG_HOLD_INT32_AB",
        21: "MB_REG_HOLD_INT32_CD",
        22: "MB_REG_HOLD_FLOAT_ABCD",
        23: "MB_REG_HOLD_FLOAT_BADC",
        24: "MB_REG_HOLD_FLOAT_CDAB",
        25: "MB_REG_HOLD_FLOAT_DCBA",
    };
    var register_type_values = getValues(register_type_map);
    if (register_type_values.indexOf(register_type) === -1) {
        throw new Error("modbus_channels._item.type must be one of " + register_type_values.join(", "));
    }

    var buffer = new Buffer(9);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xef);
    buffer.writeUInt8(0x01); // config modbus channel
    buffer.writeUInt8(channel_id);
    buffer.writeUInt8(slave_id);
    buffer.writeUInt16LE(register_address);
    buffer.writeUInt8(quantity);
    buffer.writeUInt8(getValue(register_type_map, register_type));
    return buffer.toBytes();
}

/**
 * Set modbus channel name
 * @param {object} modbus_channels_name
 * @param {number} modbus_channels_name._item.channel_id range: [1, 32]
 * @param {string} modbus_channels_name._item.name
 * @example { "modbus_channels_name": [ { "channel_id": 1, "name": "modbus_channel_1" } ] }
 */
function setModbusChannelName(modbus_channels_name) {
    var channel_id = modbus_channels_name.channel_id;
    var name = modbus_channels_name.name;

    var buffer = new Buffer(5 + name.length);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xef);
    buffer.writeUInt8(0x02); // config modbus channel name
    buffer.writeUInt8(channel_id);
    buffer.writeUInt8(name.length);
    buffer.writeASCII(name);
    return buffer.toBytes();
}

/**
 * Remove modbus channel
 * @param {object} remove_modbus_channels
 * @param {number} remove_modbus_channels._item.channel_id range: [1, 32]
 * @example { "remove_modbus_channels": [ { "channel_id": 1 } ] }
 */
function removeModbusChannel(remove_modbus_channels) {
    var channel_id = remove_modbus_channels.channel_id;

    if (channel_id < 1 || channel_id > 32) {
        throw new Error("remove_modbus_channels._item.channel_id must be between 1 and 32");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xef);
    buffer.writeUInt8(0x00); // remove modbus channel
    buffer.writeUInt8(channel_id);
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

Buffer.prototype.writeASCII = function (value) {
    for (var i = 0; i < value.length; i++) {
        this.buffer[this.offset + i] = value.charCodeAt(i);
    }
    this.offset += value.length;
};

Buffer.prototype.toBytes = function () {
    return this.buffer;
};
