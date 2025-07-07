/**
 * Payload Encoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product WT301
 */
// Chirpstack v4
function encodeDownlink(input) {
    return milesight(input.data);
}

// Chirpstack v3
function Encode(fPort, obj, variables) {
    return milesight(obj);
}

function milesight(obj) {
    var encoded = [];

    // set all arguments at once
    // input: { thermostat_status: "on", btn_lock_enabled: "disable", mode: "cool", fan_speed: "high", temperature_target: 21, control_mode: "auto", server_temperature: 26}
    // output: [ 85, 1, 0, 8, 15, 1, 0, 0, 1, 42, 0, 52, 205 ]
    if ("thermostat_status" in obj && "btn_lock_enabled" in obj && "mode" in obj && "fan_speed" in obj && "temperature_target" in obj && "control_mode" in obj && "server_temperature" in obj) {
        encoded = encoded.concat(setAll(obj.thermostat_status, obj.btn_lock_enabled, obj.mode, obj.fan_speed, obj.temperature_target, obj.control_mode, obj.server_temperature));
    } else {
        // input: { thermostat_status: "on" }
        // output: [ 85, 1, 0, 2, 1, 1, 90 ]
        if ("thermostat_status" in obj) {
            encoded = encoded.concat(setThermostatStatus(obj.thermostat_status));
        }
        // input: { btn_lock_enabled: "disable" }
        // output: [ 85, 1, 0, 2, 2, 0, 91 ]
        if ("btn_lock_enabled" in obj) {
            encoded = encoded.concat(setButtonLockEnable(obj.btn_lock_enabled));
        }
        // input: { mode: "cool" }
        // output: [ 85, 1, 0, 2, 3, 0, 92 ]
        if ("mode" in obj) {
            encoded = encoded.concat(setSystemMode(obj.mode));
        }
        // input: { fan_speed: "high" }
        // output: [ 85, 1, 0, 2, 4, 1, 93 ]
        if ("fan_speed" in obj) {
            encoded = encoded.concat(setFanSpeed(obj.fan_speed));
        }
        // input: { temperature_target: 21 }
        // output: [ 85, 1, 0, 2, 5, 42, 94 ]
        if ("temperature_target" in obj) {
            encoded = encoded.concat(setTargetTemperature(obj.temperature_target));
        }
        // input: { control_mode: "auto" }
        // output: [ 85, 1, 0, 2, 8, 0, 97 ]
        if ("control_mode" in obj) {
            encoded = encoded.concat(setControlMode(obj.control_mode));
        }
        // input: { server_temperature: 26 }
        // output: [ 85, 1, 0, 2, 9, 52, 98 ]
        if ("server_temperature" in obj) {
            encoded = encoded.concat(setServerTemperature(obj.server_temperature));
        }
    }

    return encoded;
}

/**
 * @param {string} thermostat_status values: (0: "off", 1: "on")
 * @returns {Array}
 */
function setThermostatStatus(thermostat_status) {
    var buffer = new Buffer(7);
    buffer.writeUInt8(0x55);
    buffer.writeUInt8(0x01);
    buffer.writeUInt16BE(0x0002);
    buffer.writeUInt8(0x01); // THERMOSTAT STATUS
    buffer.writeUInt8(thermostat_status === "on" ? 0x01 : 0x00);
    buffer.writeUInt8(buffer.checksum());
    return buffer.toBytes();
}

/**
 * @param {string} btn_lock_enabled values: (0: "disable", 1: "enable")
 * @returns {Array}
 */
function setButtonLockEnable(btn_lock_enabled) {
    var buffer = new Buffer(7);
    buffer.writeUInt8(0x55);
    buffer.writeUInt8(0x01);
    buffer.writeUInt16BE(0x0002);
    buffer.writeUInt8(0x02); // BUTTON LOCK
    buffer.writeUInt8(btn_lock_enabled === "enable" ? 0x01 : 0x00);
    buffer.writeUInt8(buffer.checksum());
    return buffer.toBytes();
}

/**
 * @param {string} mode values: (0: "cool", 1: "heat", 2: "fan")
 * @returns {Array}
 */
function setSystemMode(mode) {
    var buffer = new Buffer(7);
    buffer.writeUInt8(0x55);
    buffer.writeUInt8(0x01);
    buffer.writeUInt16BE(0x0002);
    buffer.writeUInt8(0x03); // SYSTEM MODE
    buffer.writeUInt8(["cool", "heat", "fan"].indexOf(mode));
    buffer.writeUInt8(buffer.checksum());
    return buffer.toBytes();
}

/**
 * @param {string} fan_speed values: (0: "auto", 1: "high", 2: "medium", 3: "low")
 * @returns {Array}
 */
function setFanSpeed(fan_speed) {
    var fan_speed_enum = ["auto", "high", "medium", "low"];
    if (fan_speed_enum.includes(fan_speed) === -1) {
        throw new Error("fan_speed must be one of" + fan_speed_enum.join(", "));
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0x55);
    buffer.writeUInt8(0x01);
    buffer.writeUInt16BE(0x0002);
    buffer.writeUInt8(0x04); // FAN SPEED
    buffer.writeUInt8(["auto", "high", "medium", "low"].indexOf(fan_speed));
    buffer.writeUInt8(buffer.checksum());
    return buffer.toBytes();
}

/**
 * @param {number} temperature temperature * 2
 * @returns {Array}
 */
function setTargetTemperature(temperature) {
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
 * @param {string} control_mode values: (0: "auto", 1: "manual")
 * @returns {Array}
 */
function setControlMode(control_mode) {
    var control_mode_enum = ["auto", "manual"];
    if (control_mode_enum.includes(control_mode) === -1) {
        throw new Error("control_mode must be one of" + control_mode_enum.join(", "));
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0x55);
    buffer.writeUInt8(0x01);
    buffer.writeUInt16BE(0x0002);
    buffer.writeUInt8(0x08); // CONTROL MODE
    buffer.writeUInt8(control_mode_enum.indexOf(control_mode));
    buffer.writeUInt8(buffer.checksum());
    return buffer.toBytes();
}

/**
 * @param {number} server_temperature temperature * 2
 * @returns {Array}
 */
function setServerTemperature(server_temperature) {
    var buffer = new Buffer(7);
    buffer.writeUInt8(0x55);
    buffer.writeUInt8(0x01);
    buffer.writeUInt16BE(0x0002);
    buffer.writeUInt8(0x09); // SERVER TEMPERATURE
    buffer.writeUInt8(server_temperature * 2);
    buffer.writeUInt8(buffer.checksum());
    return buffer.toBytes();
}

/**
 *
 * @param {string} thermostat_status values: (0: "off", 1: "on")
 * @param {string} btn_lock_enabled values: (0: "disable", 1: "enable")
 * @param {string } mode values: (0: "cool", 1: "heat", 2: "fan")
 * @param {string} fan_speed values: (0: "auto", 1: "high", 2: "medium", 3: "low")
 * @param {number} temperature_target temperature * 2
 * @param {string} control_mode values: (0: "auto", 1: "manual")
 * @param {number} server_temperature temperature * 2
 * @returns {Array}
 */
function setAll(thermostat_status, btn_lock_enabled, mode, fan_speed, temperature_target, control_mode, server_temperature) {
    var buffer = new Buffer(13);
    buffer.writeUInt8(0x55);
    buffer.writeUInt8(0x01);
    buffer.writeUInt16BE(0x0008);
    buffer.writeUInt8(0x0f); // ALL
    buffer.writeUInt8(thermostat_status === "on" ? 0x01 : 0x00);
    buffer.writeUInt8(btn_lock_enabled === "enable" ? 0x01 : 0x00);
    buffer.writeUInt8(["cool", "heat", "fan"].indexOf(mode));
    buffer.writeUInt8(["auto", "high", "medium", "low"].indexOf(fan_speed));
    buffer.writeUInt8(temperature_target * 2);
    buffer.writeUInt8(["auto", "manual"].indexOf(control_mode));
    buffer.writeUInt8(server_temperature * 2);
    buffer.writeUInt8(buffer.checksum());
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
