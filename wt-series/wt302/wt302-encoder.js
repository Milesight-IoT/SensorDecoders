/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product WT301
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

    if ("thermostat_status" in payload && "btn_lock_enable" in payload && "mode" in payload && "fan_speed" in payload && "target_temperature" in payload && "control_mode" in payload && "server_temperature" in payload) {
        encoded = encoded.concat(setAll(payload.thermostat_status, payload.btn_lock_enable, payload.mode, payload.fan_speed, payload.target_temperature, payload.control_mode, payload.server_temperature));
    } else {
        if ("thermostat_status" in payload) {
            encoded = encoded.concat(setThermostatStatus(payload.thermostat_status));
        }
        if ("btn_lock_enable" in payload) {
            encoded = encoded.concat(setButtonLockEnable(payload.btn_lock_enable));
        }
        if ("mode" in payload) {
            encoded = encoded.concat(setSystemMode(payload.mode));
        }
        if ("fan_speed" in payload) {
            encoded = encoded.concat(setFanSpeed(payload.fan_speed));
        }
        if ("target_temperature" in payload) {
            encoded = encoded.concat(setTargetTemperature(payload.target_temperature));
        }
        if ("control_mode" in payload) {
            encoded = encoded.concat(setControlMode(payload.control_mode));
        }
        if ("server_temperature" in payload) {
            encoded = encoded.concat(setServerTemperature(payload.server_temperature));
        }

        if ("query_thermostat_status" in payload) {
            encoded = encoded.concat(queryThermostatStatus(payload.query_thermostat_status));
        }
        if ("query_button_lock_status" in payload) {
            encoded = encoded.concat(queryButtonLockEnable(payload.query_button_lock_status));
        }
        if ("query_mode" in payload) {
            encoded = encoded.concat(querySystemMode(payload.query_mode));
        }
        if ("query_fan_speed" in payload) {
            encoded = encoded.concat(queryFanSpeed(payload.query_fan_speed));
        }
        if ("query_temperature" in payload) {
            encoded = encoded.concat(queryTemperature(payload.query_temperature));
        }
        if ("query_target_temperature" in payload) {
            encoded = encoded.concat(queryTargetTemperature(payload.query_target_temperature));
        }
        if ("query_card_mode" in payload) {
            encoded = encoded.concat(queryCardMode(payload.query_card_mode));
        }
        if ("query_control_mode" in payload) {
            encoded = encoded.concat(queryControlMode(payload.query_control_mode));
        }
        if ("query_server_temperature" in payload) {
            encoded = encoded.concat(queryServerTemperature(payload.query_server_temperature));
        }
        if ("query_all" in payload) {
            encoded = encoded.concat(queryAll(payload.query_all));
        }
    }

    return encoded;
}

/**
 * @param {number} thermostat_status values: (0: off, 1: on)
 * @example {"thermostat_status": 1}
 */
function setThermostatStatus(thermostat_status) {
    var on_off_map = { 0: "off", 1: "on" };
    var on_off_values = getValues(on_off_map);
    if (on_off_values.indexOf(thermostat_status) === -1) {
        throw new Error("thermostat_status must be one of " + on_off_values.join(", "));
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0x55);
    buffer.writeUInt8(0x01);
    buffer.writeUInt16BE(0x0002);
    buffer.writeUInt8(0x01); // THERMOSTAT STATUS
    buffer.writeUInt8(getValue(on_off_map, thermostat_status));
    buffer.writeUInt8(buffer.checksum());
    return buffer.toBytes();
}

/**
 * @param {number} btn_lock_enable values: (0: disable, 1: enable)
 * @example {"btn_lock_enable": 1}
 */
function setButtonLockEnable(btn_lock_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(btn_lock_enable) === -1) {
        throw new Error("btn_lock_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0x55);
    buffer.writeUInt8(0x01);
    buffer.writeUInt16BE(0x0002);
    buffer.writeUInt8(0x02); // BUTTON LOCK
    buffer.writeUInt8(getValue(enable_map, btn_lock_enable));
    buffer.writeUInt8(buffer.checksum());
    return buffer.toBytes();
}

/**
 * @param {number} mode values: (0: cool, 1: heat, 2: fan)
 * @example {"mode": 0}
 */
function setSystemMode(mode) {
    var mode_map = { 0: "cool", 1: "heat", 2: "fan" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(mode) === -1) {
        throw new Error("mode must be one of " + mode_values.join(", "));
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0x55);
    buffer.writeUInt8(0x01);
    buffer.writeUInt16BE(0x0002);
    buffer.writeUInt8(0x03); // SYSTEM MODE
    buffer.writeUInt8(getValue(mode_map, mode));
    buffer.writeUInt8(buffer.checksum());
    return buffer.toBytes();
}

/**
 * @param {number} fan_speed values: (0: auto, 1: high, 2: medium, 3: low)
 * @example {"fan_speed": 0}
 */
function setFanSpeed(fan_speed) {
    var speed_map = { 0: "auto", 1: "high", 2: "medium", 3: "low" };
    var speed_values = getValues(speed_map);
    if (speed_values.indexOf(fan_speed) === -1) {
        throw new Error("fan_speed must be one of " + speed_values.join(", "));
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0x55);
    buffer.writeUInt8(0x01);
    buffer.writeUInt16BE(0x0002);
    buffer.writeUInt8(0x04); // FAN SPEED
    buffer.writeUInt8(getValue(speed_map, fan_speed));
    buffer.writeUInt8(buffer.checksum());
    return buffer.toBytes();
}

/**
 * @param {number} temperature temperature * 2
 * @example {"target_temperature": 20}
 */
function setTargetTemperature(temperature) {
    if (typeof temperature !== "number") {
        throw new Error("temperature must be a number");
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0x55);
    buffer.writeUInt8(0x01);
    buffer.writeUInt16BE(0x0002);
    buffer.writeUInt8(0x05); // TARGET TEMPERATURE
    buffer.writeUInt8(temperature * 2);
    buffer.writeUInt8(buffer.checksum());
    return buffer.toBytes();
}

/**
 * @param {number} control_mode values: (0: auto, 1: manual)
 * @example {"control_mode": 0}
 */
function setControlMode(control_mode) {
    var mode_map = { 0: "auto", 1: "manual" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(control_mode) === -1) {
        throw new Error("control_mode must be one of " + mode_values.join(", "));
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0x55);
    buffer.writeUInt8(0x01);
    buffer.writeUInt16BE(0x0002);
    buffer.writeUInt8(0x06); // CONTROL MODE
    buffer.writeUInt8(getValue(mode_map, control_mode));
    buffer.writeUInt8(buffer.checksum());
    return buffer.toBytes();
}

/**
 * @param {number} server_temperature temperature * 2
 * @example {"server_temperature": 20}
 */
function setServerTemperature(server_temperature) {
    if (typeof server_temperature !== "number") {
        throw new Error("server_temperature must be a number");
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0x55);
    buffer.writeUInt8(0x01);
    buffer.writeUInt16BE(0x0002);
    buffer.writeUInt8(0x07); // SERVER TEMPERATURE
    buffer.writeUInt8(server_temperature * 2);
    buffer.writeUInt8(buffer.checksum());
    return buffer.toBytes();
}

/**
 * @param {number} thermostat_status values: (0: off, 1: on)
 * @param {number} btn_lock_enable values: (0: disable, 1: enable)
 * @param {number} mode values: (0: cool, 1: heat, 2: fan)
 * @param {number} fan_speed values: (0: auto, 1: high, 2: medium, 3: low)
 * @param {number} target_temperature temperature * 2
 * @param {number} control_mode values: (0: auto, 1: manual)
 * @param {number} server_temperature temperature * 2
 * @example {"thermostat_status": 1, "btn_lock_enable": 1, "mode": 0, "fan_speed": 0, "target_temperature": 20, "control_mode": 0, "server_temperature": 20}
 */
function setAll(thermostat_status, btn_lock_enable, mode, fan_speed, target_temperature, control_mode, server_temperature) {
    var on_off_map = { 0: "off", 1: "on" };
    var on_off_values = getValues(on_off_map);
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    var mode_map = { 0: "cool", 1: "heat", 2: "fan" };
    var mode_values = getValues(mode_map);
    var speed_map = { 0: "auto", 1: "high", 2: "medium", 3: "low" };
    var speed_values = getValues(speed_map);
    var mode_map = { 0: "auto", 1: "manual" };
    var mode_values = getValues(mode_map);

    if (on_off_values.indexOf(thermostat_status) === -1) {
        throw new Error("thermostat_status must be one of " + on_off_values.join(", "));
    }
    if (enable_values.indexOf(btn_lock_enable) === -1) {
        throw new Error("btn_lock_enable must be one of " + enable_values.join(", "));
    }
    if (mode_values.indexOf(mode) === -1) {
        throw new Error("mode must be one of " + mode_values.join(", "));
    }
    if (speed_values.indexOf(fan_speed) === -1) {
        throw new Error("fan_speed must be one of " + speed_values.join(", "));
    }
    if (mode_values.indexOf(control_mode) === -1) {
        throw new Error("control_mode must be one of " + mode_values.join(", "));
    }

    var buffer = new Buffer(13);
    buffer.writeUInt8(0x55);
    buffer.writeUInt8(0x01);
    buffer.writeUInt16BE(0x0008);
    buffer.writeUInt8(0x0f); // ALL
    buffer.writeUInt8(getValue(on_off_map, thermostat_status));
    buffer.writeUInt8(getValue(enable_map, btn_lock_enable));
    buffer.writeUInt8(getValue(mode_map, mode));
    buffer.writeUInt8(getValue(speed_map, fan_speed));
    buffer.writeUInt8(target_temperature * 2);
    buffer.writeUInt8(getValue(mode_map, control_mode));
    buffer.writeUInt8(server_temperature * 2);
    buffer.writeUInt8(buffer.checksum());
    return buffer.toBytes();
}

/**
 * @param {number} query_thermostat_status values: (0: no, 1: yes)
 * @example {"query_thermostat_status": 1}
 */
function queryThermostatStatus(query_thermostat_status) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(query_thermostat_status) === -1) {
        throw new Error("query_thermostat_status must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, query_thermostat_status) === 0) {
        return [];
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0x55);
    buffer.writeUInt8(0x02);
    buffer.writeUInt16BE(0x0001);
    buffer.writeUInt8(0x01); // THERMOSTAT STATUS
    buffer.writeUInt8(buffer.checksum());
    return buffer.toBytes();
}

/**
 * @param {number} query_button_lock_enable values: (0: no, 1: yes)
 * @example {"query_button_lock_status": 1}
 */
function queryButtonLockEnable(query_button_lock_enable) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(query_button_lock_enable) === -1) {
        throw new Error("query_button_lock_enable must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, query_button_lock_enable) === 0) {
        return [];
    }
    var buffer = new Buffer(6);
    buffer.writeUInt8(0x55);
    buffer.writeUInt8(0x02);
    buffer.writeUInt16BE(0x0001);
    buffer.writeUInt8(0x02); // BUTTON LOCK
    buffer.writeUInt8(buffer.checksum());
    return buffer.toBytes();
}

/**
 * @param {number} query_system_mode values: (0: no, 1: yes)
 * @example {"query_mode": 1}
 */
function querySystemMode(query_system_mode) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(query_system_mode) === -1) {
        throw new Error("query_system_mode must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, query_system_mode) === 0) {
        return [];
    }
    var buffer = new Buffer(6);
    buffer.writeUInt8(0x55);
    buffer.writeUInt8(0x02);
    buffer.writeUInt16BE(0x0001);
    buffer.writeUInt8(0x03); // SYSTEM MODE
    buffer.writeUInt8(buffer.checksum());
    return buffer.toBytes();
}

/**
 * @param {number} query_fan_speed values: (0: no, 1: yes)
 * @example {"query_fan_speed": 1}
 */
function queryFanSpeed(query_fan_speed) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(query_fan_speed) === -1) {
        throw new Error("query_fan_speed must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, query_fan_speed) === 0) {
        return [];
    }
    var buffer = new Buffer(6);
    buffer.writeUInt8(0x55);
    buffer.writeUInt8(0x02);
    buffer.writeUInt16BE(0x0001);
    buffer.writeUInt8(0x04); // FAN SPEED
    buffer.writeUInt8(buffer.checksum());
    return buffer.toBytes();
}

/**
 * @param {number} query_temperature values: (0: no, 1: yes)
 * @example {"query_temperature": 1}
 */
function queryTemperature(query_temperature) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(query_temperature) === -1) {
        throw new Error("query_temperature must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, query_temperature) === 0) {
        return [];
    }
    var buffer = new Buffer(6);
    buffer.writeUInt8(0x55);
    buffer.writeUInt8(0x02);
    buffer.writeUInt16BE(0x0001);
    buffer.writeUInt8(0x05); // TEMPERATURE
    buffer.writeUInt8(buffer.checksum());
    return buffer.toBytes();
}

/**
 * @param {number} query_target_temperature values: (0: no, 1: yes)
 * @example {"query_target_temperature": 1}
 */
function queryTargetTemperature(query_target_temperature) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(query_target_temperature) === -1) {
        throw new Error("query_target_temperature must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, query_target_temperature) === 0) {
        return [];
    }
    var buffer = new Buffer(6);
    buffer.writeUInt8(0x55);
    buffer.writeUInt8(0x02);
    buffer.writeUInt16BE(0x0001);
    buffer.writeUInt8(0x06); // TARGET TEMPERATURE
    buffer.writeUInt8(buffer.checksum());
    return buffer.toBytes();
}

/**
 * @param {number} query_card_mode values: (0: no, 1: yes)
 * @example {"query_card_mode": 1}
 */
function queryCardMode(query_card_mode) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(query_card_mode) === -1) {
        throw new Error("query_card_mode must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, query_card_mode) === 0) {
        return [];
    }
    var buffer = new Buffer(6);
    buffer.writeUInt8(0x55);
    buffer.writeUInt8(0x02);
    buffer.writeUInt16BE(0x0001);
    buffer.writeUInt8(0x07); // CARD MODE
    buffer.writeUInt8(buffer.checksum());
    return buffer.toBytes();
}

/**
 * @param {number} query_control_mode values: (0: no, 1: yes)
 * @example {"query_control_mode": 1}
 */
function queryControlMode(query_control_mode) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(query_control_mode) === -1) {
        throw new Error("query_control_mode must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, query_control_mode) === 0) {
        return [];
    }
    var buffer = new Buffer(6);
    buffer.writeUInt8(0x55);
    buffer.writeUInt8(0x02);
    buffer.writeUInt16BE(0x0001);
    buffer.writeUInt8(0x08); // CONTROL MODE
    buffer.writeUInt8(buffer.checksum());
    return buffer.toBytes();
}

/**
 * @param {number} query_server_temperature values: (0: no, 1: yes)
 * @example {"query_server_temperature": 1}
 */
function queryServerTemperature(query_server_temperature) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(query_server_temperature) === -1) {
        throw new Error("query_server_temperature must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, query_server_temperature) === 0) {
        return [];
    }
    var buffer = new Buffer(6);
    buffer.writeUInt8(0x55);
    buffer.writeUInt8(0x02);
    buffer.writeUInt16BE(0x0001);
    buffer.writeUInt8(0x09); // SERVER TEMPERATURE
    buffer.writeUInt8(buffer.checksum());
    return buffer.toBytes();
}

/**
 * @param {number} query_all values: (0: no, 1: yes)
 * @example {"query_all": 1}
 */
function queryAll(query_all) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(query_all) === -1) {
        throw new Error("query_all must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, query_all) === 0) {
        return [];
    }
    var buffer = new Buffer(6);
    buffer.writeUInt8(0x55);
    buffer.writeUInt8(0x02);
    buffer.writeUInt16BE(0x0001);
    buffer.writeUInt8(0x0f); // ALL
    buffer.writeUInt8(buffer.checksum());
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
    for (var index = 0; index < byteLength; index++) {
        var shift = isLittleEndian ? index << 3 : (byteLength - 1 - index) << 3;
        this.buffer[this.offset + index] = (value & (0xff << shift)) >> shift;
    }
};

Buffer.prototype.writeUInt8 = function (value) {
    this._write(value, 1, false);
    this.offset += 1;
};

Buffer.prototype.writeInt8 = function (value) {
    this._write(value < 0 ? value + 0x100 : value, 1, false);
    this.offset += 1;
};

Buffer.prototype.writeUInt16BE = function (value) {
    this._write(value, 2, false);
    this.offset += 2;
};

Buffer.prototype.writeInt16BE = function (value) {
    this._write(value < 0 ? value + 0x10000 : value, 2, false);
    this.offset += 2;
};

Buffer.prototype.writeUInt32BE = function (value) {
    this._write(value, 4, false);
    this.offset += 4;
};

Buffer.prototype.writeInt32LE = function (value) {
    this._write(value < 0 ? value + 0x100000000 : value, 4, false);
    this.offset += 4;
};

Buffer.prototype.checksum = function () {
    var crc = 0;
    for (var i = 0; i < this.offset; i++) {
        crc += this.buffer[i];
    }
    return crc & 0xff;
};

Buffer.prototype.toBytes = function () {
    return this.buffer;
};
