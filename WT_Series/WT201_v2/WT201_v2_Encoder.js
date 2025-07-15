/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product WT201 v2 (odm: 7089)
 */
var RAW_VALUE = 0x01;

/* eslint no-redeclare: "off" */
/* eslint-disable */
// Chirpstack v4
function encodeDownlink(input) {
    var encoded = milesightDeviceEncode(input.data);
    return { bytes: encoded };
}

// Chirpstack v3
function Encode(fPort, obj) {
    var encoded = milesightDeviceEncode(obj);
    return encoded;
}

// The Things Network
function Encoder(obj, port) {
    return milesightDeviceEncode(obj);
}
/* eslint-enable */

function milesightDeviceEncode(payload) {
    var encoded = [];

    if ("heat_setpoint" in payload) {
        encoded = encoded.concat(setHeatSetpoint(payload.heat_setpoint));
    }
    if ("em_heat_setpoint" in payload) {
        encoded = encoded.concat(setEMHeatSetpoint(payload.em_heat_setpoint));
    }
    if ("cool_setpoint" in payload) {
        encoded = encoded.concat(setCoolSetpoint(payload.cool_setpoint));
    }
    if ("auto_setpoint" in payload) {
        encoded = encoded.concat(setAutoSetpoint(payload.auto_setpoint));
    }
    if ("auto_heat_setpoint" in payload) {
        encoded = encoded.concat(setAutoHeatSetpoint(payload.auto_heat_setpoint));
    }
    if ("auto_cool_setpoint" in payload) {
        encoded = encoded.concat(setAutoCoolSetpoint(payload.auto_cool_setpoint));
    }
    if ("heat_band" in payload) {
        encoded = encoded.concat(setHeatBand(payload.heat_band));
    }
    if ("em_heat_band" in payload) {
        encoded = encoded.concat(setEMHeatBand(payload.em_heat_band));
    }
    if ("cool_band" in payload) {
        encoded = encoded.concat(setCoolBand(payload.cool_band));
    }
    if ("auto_band" in payload) {
        encoded = encoded.concat(setAutoBand(payload.auto_band));
    }
    if ("auto_control_band" in payload) {
        encoded = encoded.concat(setAutoControlBand(payload.auto_control_band));
    }
    if ("temperature_control_mode" in payload) {
        encoded = encoded.concat(setTemperatureControlMode(payload.temperature_control_mode));
    }
    if ("fan_mode" in payload) {
        encoded = encoded.concat(setFanMode(payload.fan_mode));
    }
    if ("screen_display_config" in payload) {
        encoded = encoded.concat(setScreenDisplayConfig(payload.screen_display_config));
    }

    return encoded;
}

function setHeatSetpoint(heat_setpoint) {
    return setpoint(0, heat_setpoint);
}

function setEMHeatSetpoint(em_heat_setpoint) {
    return setpoint(1, em_heat_setpoint);
}

function setCoolSetpoint(cool_setpoint) {
    return setpoint(2, cool_setpoint);
}

function setAutoSetpoint(auto_setpoint) {
    return setpoint(3, auto_setpoint);
}

function setAutoHeatSetpoint(auto_heat_setpoint) {
    return setpoint(4, auto_heat_setpoint);
}

function setAutoCoolSetpoint(auto_cool_setpoint) {
    return setpoint(5, auto_cool_setpoint);
}

function setpoint(mode, setpoint) {
    var mode_map = { 0: "heat", 1: "em_heat", 2: "cool", 3: "auto", 4: "auto_heat", 5: "auto_cool" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(mode) === -1) {
        throw new Error("mode must be one of " + mode_values.join(", "));
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xfa);
    buffer.writeUInt8(mode);
    buffer.writeInt16LE(setpoint * 10);
    return buffer.toBytes();
}

function setHeatBand(heat_band) {
    return setBand(0, heat_band);
}

function setEMHeatBand(em_heat_band) {
    return setBand(1, em_heat_band);
}

function setCoolBand(cool_band) {
    return setBand(2, cool_band);
}

function setAutoBand(auto_band) {
    return setBand(3, auto_band);
}

function setBand(mode, band) {
    var mode_map = { 0: "heat", 1: "em_heat", 2: "cool", 3: "auto" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(mode) === -1) {
        throw new Error("mode must be one of " + mode_values.join(", "));
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x5b);
    buffer.writeUInt8(mode);
    buffer.writeUInt8(band * 10);
    return buffer.toBytes();
}

function setAutoControlBand(auto_control_band) {
    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x57);
    buffer.writeUInt8(auto_control_band * 10);
    return buffer.toBytes();
}

/**
 * temperature control mode
 * @param {number} temperature_control_mode values: (0: heat, 1: em_heat, 2: cool, 3: auto)
 * @example { "temperature_control_mode": 2 }
 */
function setTemperatureControlMode(temperature_control_mode) {
    var temperature_mode_map = { 0: "heat", 1: "em_heat", 2: "cool", 3: "auto" };
    var temperature_mode_values = getValues(temperature_mode_map);
    if (temperature_mode_values.indexOf(temperature_control_mode) === -1) {
        throw new Error("temperature_control_mode must be one of " + temperature_mode_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xfb);
    buffer.writeUInt8(getValue(temperature_mode_map, temperature_control_mode));
    return buffer.toBytes();
}

/**
 * fan mode
 * @param {string} fan_mode values: (0: auto, 1: on, 2: circulate)
 * @example { "fan_mode": 0 }
 */
function setFanMode(fan_mode) {
    var fan_mode_map = { 0: "auto", 1: "on", 2: "circulate" };
    var fan_mode_values = getValues(fan_mode_map);
    if (fan_mode_values.indexOf(fan_mode) === -1) {
        throw new Error("fan_mode must be one of " + fan_mode_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xb6);
    buffer.writeUInt8(getValue(fan_mode_map, fan_mode));
    return buffer.toBytes();
}

/**
 * screen display config
 * @odm 7089
 * @param {object} screen_display_config
 * @param {number} screen_display_config.all values: (0: disable, 1: enable)
 * @param {number} screen_display_config.temperature values: (0: disable, 1: enable)
 * @param {number} screen_display_config.humidity values: (0: disable, 1: enable)
 * @param {number} screen_display_config.setpoint values: (0: disable, 1: enable)
 * @param {number} screen_display_config.plan values: (0: disable, 1: enable)
 * @example { "screen_display_config": { "all": 1, "temperature": 1, "humidity": 1, "setpoint": 1, "plan": 1 } }
 */
function setScreenDisplayConfig(screen_display_config) {
    var enable_status = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_status);

    var data = 0x00;
    var element_bit_offset = { all: 0, temperature: 1, humidity: 2, setpoint: 3, plan: 4 };
    for (var key in element_bit_offset) {
        if (key in screen_display_config) {
            if (enable_values.indexOf(screen_display_config[key]) === -1) {
                throw new Error("screen_display_config[" + key + "] must be one of " + enable_values.join(", "));
            }
            data |= getValue(enable_status, screen_display_config[key]) << element_bit_offset[key];
        }
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xf4);
    buffer.writeUInt8(data);
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

Buffer.prototype.writeInt32LE = function (value) {
    this._write(value < 0 ? value + 0x100000000 : value, 4, true);
    this.offset += 4;
};

Buffer.prototype.writeD2DCommand = function (value, defaultValue) {
    if (typeof value !== "string") {
        value = defaultValue;
    }
    if (value.length !== defaultValue.length) {
        throw new Error("d2d_cmd length must be " + defaultValue.length);
    }
    this.buffer[this.offset] = parseInt(value.substr(2, 2), 16);
    this.buffer[this.offset + 1] = parseInt(value.substr(0, 2), 16);
    this.offset += 2;
};

Buffer.prototype.writeHexString = function (hex, defaultValue) {
    if (typeof hex !== "string") {
        hex = defaultValue;
    }
    if (hex.length !== defaultValue.length) {
        throw new Error("string length must be " + defaultValue.length);
    }
    this.writeBytes(hexStringToBytes(hex));
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

function hexStringToBytes(hex) {
    var bytes = [];
    for (var c = 0; c < hex.length; c += 2) {
        bytes.push(parseInt(hex.substr(c, 2), 16));
    }
    return bytes;
}
