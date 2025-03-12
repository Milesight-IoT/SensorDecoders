/**
 * Payload Encoder
 *
 * Created by Jan-Ole Giebel based on the WS523 manual and WS50x_v2_Encoder.js originally licensed under the GNU General Public License v3.0
 * (https://github.com/Milesight-IoT/SensorDecoders/blob/main/WS_Series/WS50x/WS50x_v2_Encoder.js)
 * (https://github.com/Milesight-IoT/SensorDecoders/blob/main/LICENSE.md)
 *
 * Copyright 2025 Jan-Ole Giebel
 * Copyright 2024 Milesight IoT
 *
 * This code is licensed under the GNU General Public License v3.0
 *
 * @product WS523 | WS525
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

    if ("switch" in payload) {
        encoded = encoded.concat(updateSwitch(payload.switch));
    }
    if ("report_interval" in payload) {
        encoded = encoded.concat(setReportInterval(payload.report_interval));
    }
    if ("reboot" in payload) {
        encoded = encoded.concat(reboot(payload.reboot));
    }
    if ("delay_task" in payload) {
        encoded = encoded.concat(setDelayTask(payload.delay_task.switch_state, payload.delay_task.delay_time));
    }
    if ("cancel_delay_task" in payload) {
        encoded = encoded.concat(cancelDelayTask(payload.cancel_delay_task));
    }
    if ("overcurrent_alarm_configuration" in payload) {
        encoded = encoded.concat(overcurrentAlarmConfiguration(payload.overcurrent_alarm_configuration.state, payload.overcurrent_alarm_configuration.current_threshold));
    }
    if ("button_lock_config" in payload) {
        encoded = encoded.concat(setButtonLockConfig(payload.button_lock_config));
    }
    if ("power_consumption_enable" in payload) {
        encoded = encoded.concat(setPowerConsumptionEnable(payload.power_consumption_enable));
    }
    if ("clear_power_consumption" in payload) {
        encoded = encoded.concat(clearPowerConsumption(payload.clear_power_consumption));
    }
    if ("enquire_electrical_status" in payload) {
        encoded = encoded.concat(enquireElectricalStatus(payload.enquire_electrical_status));
    }
    if ("led_mode" in payload) {
        encoded = encoded.concat(setLedMode(payload.led_mode));
    }
    if ("overcurrent_protection_configuration" in payload) {
        encoded = encoded.concat(overcurrentProtectionConfiguration(payload.overcurrent_protection_configuration.state, payload.overcurrent_protection_configuration.current_threshold));
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
 * enquire electrical status
 * @param {number} enquire_electrical_status values: (0: "no action", 1: "enquire electrical status")
 * @example payload: { "enquire_electrical_status": 1 }, output: FF28FF
 */
function enquireElectricalStatus(enquire_electrical_status) {
    var enquire_electrical_status_values = [0, 1];
    if (enquire_electrical_status_values.indexOf(enquire_electrical_status) === -1) {
        throw new Error("report_status must be one of: " + enquire_electrical_status_values.join(", "));
    }

    if (enquire_electrical_status === 0) {
        return [];
    }
    return [0xff, 0x28, 0xff];
}

/**
 * switch_state control
 * @param {number} switch_state, values: (0: "off", 1: "on")
 * @example payload: { "switch": 1 }, output: 080100FF
 */
function updateSwitch(switch_state) {
    var switch_values = [0, 1];
    if (switch_values.indexOf(switch_state) === -1) {
        throw new Error("switch must be one of: " + switch_values.join(", "));
    }

    var on_off = switch_values.indexOf(switch_state);
    var buffer = new Buffer(3);
    buffer.writeUInt8(0x08);
    buffer.writeUInt8(on_off);
    buffer.writeUInt8(0x00);
    buffer.writeUInt8(0xff);
    return buffer.toBytes();
}

/**
 * set delay task
 * @param {number} switch_state values: (0: "off", 1: "on")
 * @param {number} delay_time unit: second
 * @example payload: { "delay_task": { "switch_state": 1, "delay_time": 60 } }, output: FF22003C0011
 */
function setDelayTask(switch_state, delay_time) {
    var switch_state_values = [0, 1];
    if (switch_state_values.indexOf(switch_state) === -1) {
        throw new Error("switch_state must be one of: " + switch_state_values.join(", "));
    }

    if (typeof delay_time !== "number") {
        throw new Error("delay_time must be a number");
    }

    var data = 0x10 | switch_state;
    var buffer = new Buffer(6);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x22);
    buffer.writeUInt8(0x00);
    buffer.writeUInt16LE(delay_time);
    buffer.writeUInt8(data);
    return buffer.toBytes();
}

/**
 * cancel delay task
 * @param {boolean} calcel_delay_task values: (0: "no action", 1: "cancel delay task")
 * @example payload: { "cancel_delay_task": 1 }, output: FF2300FF
 */
function cancelDelayTask(calcel_delay_task) {
    var calcel_delay_task_values = [0, 1];
    if (calcel_delay_task_values.indexOf(calcel_delay_task) === -1) {
        throw new Error("report_status must be one of: " + calcel_delay_task_values.join(", "));
    }

    if (calcel_delay_task === 0) {
        return [];
    }
    return [0xff, 0x23, 0x00, 0xff];
}

/**
 * overcurrent alarm configuration
 * @param {boolean} state values: (0: "disable", 1: "enable")
 * @param {number} current_threshold uint: amperes
 * @example payload: { "overcurrent_alarm_configuration": { "state": 1, "current_threshold": 10 } }, output: FF24010A
 */
function overcurrentAlarmConfiguration(state, current_threshold) {
    if (typeof current_threshold !== "number") {
        throw new Error("current_threshold must be a number");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x24);
    buffer.writeUInt8(state);
    buffer.writeUInt8(current_threshold);
    return buffer.toBytes();
}

/**
 * overcurrent protection configuration
 * @param {boolean} state values: (0: "disable", 1: "enable")
 * @param {number} current_threshold uint: amperes
 * @example payload: { "overcurrent_protection_configuration": { "state": 1, "current_threshold": 10 } }, output: FF30010A
 */
function overcurrentProtectionConfiguration(state, current_threshold) {
    if (typeof current_threshold !== "number") {
        throw new Error("current_threshold must be a number");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x30);
    buffer.writeUInt8(state);
    buffer.writeUInt8(current_threshold);
    return buffer.toBytes();
}

/**
 * set led mode
 * @param {number} led_mode, values: (0: "off", 1: "on")
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
 * button lock config
 * @param {number} state values: (0: disable, 1: enable)
 * @example payload: { "button_lock_config": 1 }, output: FF250080
 */
function setButtonLockConfig(button_lock_enable) {
    var button_lock_enable_values = [0, 1];
    if (button_lock_enable_values.indexOf(button_lock_enable) === -1) {
        throw new Error("button_lock_enable_values must be one of: " + button_lock_enable_values.join(", "));
    }

    var data = button_lock_enable ? 0x80 : 0x00;
    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x25);
    buffer.writeUInt8(0x00);
    buffer.writeUInt8(data);
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