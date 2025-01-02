/**
 * Payload Encoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product WS501 | WS502 | WS503
 */
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

    if ("switch_1" in payload) {
        encoded = encoded.concat(updateSwitch(1, payload.switch_1));
    }
    if ("switch_2" in payload) {
        encoded = encoded.concat(updateSwitch(2, payload.switch_2));
    }
    if ("switch_3" in payload) {
        encoded = encoded.concat(updateSwitch(3, payload.switch_3));
    }

    if ("reboot" in payload) {
        encoded = encoded.concat(reboot(payload.reboot));
    }
    if ("report_interval" in payload) {
        encoded = encoded.concat(setReportInterval(payload.report_interval));
    }
    if ("report_status" in payload) {
        encoded = encoded.concat(reportStatus(payload.report_status));
    }
    if ("report_attribute" in payload) {
        encoded = encoded.concat(reportAttribute(payload.report_attribute));
    }
    if ("delay_task" in payload) {
        encoded = encoded.concat(setDelayTask(payload.delay_task.switch_id, payload.delay_task.switch_state, payload.delay_task.frame_count, payload.delay_task.delay_time));
    }
    if ("cancel_delay_task" in payload) {
        encoded = encoded.concat(cancelDelayTask(payload.cancel_delay_task));
    }
    if ("led_mode" in payload) {
        encoded = encoded.concat(setLedMode(payload.led_mode));
    }
    if ("child_lock_config" in payload) {
        encoded = encoded.concat(setChildLockConfig(payload.child_lock_config.enable, payload.child_lock_config.lock_time));
    }
    if ("reset_button_enable" in payload) {
        encoded = encoded.concat(setResetButtonEnable(payload.reset_button_enable));
    }
    if ("power_consumption_enable" in payload) {
        encoded = encoded.concat(setPowerConsumptionEnable(payload.power_consumption_enable));
    }
    if ("clear_power_consumption" in payload) {
        encoded = encoded.concat(clearPowerConsumption(payload.clear_power_consumption));
    }

    return encoded;
}

/**
 * reboot
 * @param {number} reboot values: (0: "no action", 1: "reboot")
 * @example payload: { "reboot": 1 }, output: FF10FF
 */
function reboot(reboot) {
    var reboot_values = [0, 1];
    if (reboot_values.indexOf(reboot) === -1) {
        throw new Error("reboot must be one of: " + reboot_values.join(", "));
    }

    if (reboot === 0) {
        return [];
    }
    return [0xff, 0x10, 0xff];
}

/**
 * report interval configuration
 * @param {number} report_interval uint: second
 * @example payload: { "report_interval": 1200 }, output: FF03B004
 */
function setReportInterval(report_interval) {
    if (typeof report_interval !== "number") {
        throw new Error("report_interval must be a number");
    }
    if (report_interval <= 60) {
        throw new Error("report_interval must be greater than 60");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x03);
    buffer.writeUInt16LE(report_interval);
    return buffer.toBytes();
}

/**
 * report status
 * @param {number} report_status values: (0: "disable", 1: "enable")
 * @example payload: { "report_status": 1 }, output: FF28FF
 */
function reportStatus(report_status) {
    var report_status_values = [0, 1];
    if (report_status_values.indexOf(report_status) === -1) {
        throw new Error("report_status must be one of: " + report_status_values.join(", "));
    }

    if (report_status === 0) {
        return [];
    }
    return [0xff, 0x28, 0xff];
}

/**
 * report attribute
 * @param {boolean} report_attribute values: (0: "no", 1: "yes")
 * @example payload: { "report_attribute": 1 }, output: FF2CFF
 */
function reportAttribute(report_attribute) {
    var report_attribute_values = [0, 1];
    if (report_attribute_values.indexOf(report_attribute) === -1) {
        throw new Error("report_attribute must be one of: " + report_attribute_values.join(", "));
    }

    if (report_attribute === 0) {
        return [];
    }
    return [0xff, 0x2c, 0xff];
}

/**
 * button control
 * @param {number} id, values: (1: "switch_1", 2: "switch_2", 3: "switch_3")
 * @param {number} state, values: (0: "off", 1: "on")
 * @example payload: { "switch_1": 1 }, output: 0811FF
 */
function updateSwitch(id, state) {
    var switch_values = [0, 1];
    if (switch_values.indexOf(state) === -1) {
        throw new Error("switch_" + id + " must be one of: " + switch_values.join(", "));
    }

    var on_off = switch_values.indexOf(state);
    var mask = 0x01 << (id - 1);
    var ctrl = on_off << (id - 1);
    var data = (mask << 4) + ctrl;
    var buffer = new Buffer(3);
    buffer.writeUInt8(0x08);
    buffer.writeUInt8(data);
    buffer.writeUInt8(0xff);
    return buffer.toBytes();
}

/**
 * set delay task
 * @param {number} switch_id values: (1: "switch_1", 2: "switch_2", 3: "switch_3")
 * @param {number} switch_state values: (0: "off", 1: "on")
 * @param {number} frame_count values: (0-255, 0: force control)
 * @param {number} delay_time unit: second
 * @example payload: { "delay_task": { "switch_id": 1, "switch_state": 1, "frame_count": 1, "delay_time": 1 } }, output: FF2201010011
 */
function setDelayTask(switch_id, switch_state, frame_count, delay_time) {
    if (typeof switch_id !== "number") {
        throw new Error("switch_id must be a number");
    }
    if (switch_id < 1 || switch_id > 3) {
        throw new Error("switch_id must be between 1 and 3");
    }
    var switch_state_values = [0, 1];
    if (switch_state_values.indexOf(switch_state) === -1) {
        throw new Error("switch_state must be one of: " + switch_state_values.join(", "));
    }
    if (typeof frame_count !== "number") {
        throw new Error("frame_count must be a number");
    }
    if (frame_count < 0 || frame_count > 255) {
        throw new Error("frame_count must be between 0 and 255");
    }
    if (typeof delay_time !== "number") {
        throw new Error("delay_time must be a number");
    }

    var status = switch_state_values.indexOf(switch_state) << (switch_id - 1);
    var mask = (0x01 << (switch_id - 1)) << 4;

    var data = mask + status;
    var buffer = new Buffer(6);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x22);
    buffer.writeUInt8(frame_count);
    buffer.writeUInt16LE(delay_time);
    buffer.writeUInt8(data);
    return buffer.toBytes();
}

/**
 * cancel delay task
 * @param {number} cancel_delay_task values: (delay_task.frame_count)
 * @example payload: { "cancel_delay_task": 1 }, output: FF230100
 */
function cancelDelayTask(cancel_delay_task) {
    if (typeof cancel_delay_task !== "number") {
        throw new Error("cancel_delay_task must be a number");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x23);
    buffer.writeUInt8(cancel_delay_task);
    buffer.writeUInt8(0x00);
    return buffer.toBytes();
}

/**
 * set led mode
 * @param {number} led_mode, values: (0: "off", 1: "on_inverted", 2: "on_synced")
 * @example payload: { "led_mode": 1 }, output: FF2F01
 */
function setLedMode(led_mode) {
    var led_mode_values = [0, 1, 2];
    if (led_mode_values.indexOf(led_mode) === -1) {
        throw new Error("led_mode must be one of: " + led_mode_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x2f);
    buffer.writeUInt8(led_mode);
    return buffer.toBytes();
}

/**
 * reset button configuration
 * @param {number} reset_button_enable values: (0: "disable", 1: "enable")
 * @example payload: { "reset_button_enable": 0 }, output: FF5E00
 */
function setResetButtonEnable(reset_button_enable) {
    var reset_button_enable_values = [0, 1];
    if (reset_button_enable_values.indexOf(reset_button_enable) === -1) {
        throw new Error("reset_button_enable must be one of: " + reset_button_enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x5e);
    buffer.writeUInt8(reset_button_enable);
    return buffer.toBytes();
}

/**
 * child lock configuration
 * @param {number} enable values: (0: disable, 1: enable)
 * @param {number} lock_time value: (0: forever), unit: minute
 * @example payload: { "child_lock_config": { "enable": 1, "lock_time": 60 } }, output: FF253C80
 */
function setChildLockConfig(enable, lock_time) {
    var child_lock_enable_values = [0, 1];
    if (child_lock_enable_values.indexOf(enable) === -1) {
        throw new Error("child_lock_config.enable must be one of: " + child_lock_enable_values.join(", "));
    }
    if (typeof lock_time !== "number") {
        throw new Error("child_lock_config.lock_time must be a number");
    }

    var data = enable ? 0x01 : 0x00;
    data = (data << 15) + lock_time;
    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x25);
    buffer.writeUInt16LE(data);
    return buffer.toBytes();
}

/**
 * power consumption Configuration
 * @param {number} power_consumption_enable
 * @example payload: { "power_consumption_enable": 1 }, output: FF2601
 */
function setPowerConsumptionEnable(power_consumption_enable) {
    var power_consumption_enable_values = [0, 1];
    if (power_consumption_enable_values.indexOf(power_consumption_enable) === -1) {
        throw new Error("power_consumption_enable must be one of: " + power_consumption_enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x26);
    buffer.writeUInt8(power_consumption_enable);
    return buffer.toBytes();
}

/**
 * clear power consumption
 * @param {number} clear_power_consumption values: (0: "no action", 1: "clear")
 * @example payload: { "clear_power_consumption": 1 }, output: FF27FF
 */
function clearPowerConsumption(clear_power_consumption) {
    var clear_power_consumption_values = [0, 1];
    if (clear_power_consumption_values.indexOf(clear_power_consumption) === -1) {
        throw new Error("clear_power_consumption must be one of: " + clear_power_consumption_values.join(", "));
    }

    if (clear_power_consumption === 0) {
        return [];
    }
    return [0xff, 0x27, 0xff];
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
