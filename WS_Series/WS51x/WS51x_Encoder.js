/**
 * Payload Encoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product WS51x
 */
// Chirpstack v4
function encodeDownlink(input) {
    return milesightDeviceEncode(input.data);
}

// Chirpstack v3
function Encode(fPort, obj, variables) {
    return milesightDeviceEncode(obj);
}

// The Things Network
function Encoder(obj, port) {
    return milesightDeviceEncode(obj);
}

function milesightDeviceEncode(payload) {
    var encoded = [];

    if ("report_status" in payload) {
        encoded = encoded.concat(reportStatus(payload.report_status));
    }
    if ("report_interval" in payload) {
        encoded = encoded.concat(setReportInterval(payload.report_interval));
    }
    if ("socket_status" in payload) {
        if ("delay_time" in payload) {
            encoded = encoded.concat(socketStatusWithDelay(payload.socket_status, payload.delay_time));
        } else {
            encoded = encoded.concat(socketStatus(payload.socket_status));
        }
    }
    if ("cancel_delay_task" in payload) {
        encoded = encoded.concat(cancelDelayTask(payload.cancel_delay_task));
    }
    if ("current_threshold" in payload) {
        encoded = encoded.concat(setCurrentThreshold(payload.current_threshold.enable, payload.current_threshold.threshold));
    }
    if ("over_current_protection" in payload) {
        encoded = encoded.concat(setOverCurrentProtection(payload.over_current_protection.enable, payload.over_current_protection.trip_current));
    }
    if ("overload_current_protection" in payload) {
        encoded = encoded.concat(setOverloadCurrentProtection(payload.overload_current_protection));
    }
    if ("child_lock_config" in payload) {
        encoded = encoded.concat(setChildLock(payload.child_lock_config.enable, payload.child_lock_config.lock_time));
    }
    if ("power_consumption_enable" in payload) {
        encoded = encoded.concat(powerConsumptionEnable(payload.power_consumption_enable));
    }
    if ("reset_power_consumption" in payload) {
        encoded = encoded.concat(resetPowerConsumption(payload.reset_power_consumption));
    }
    if ("led_enable" in payload) {
        encoded = encoded.concat(setLedEnable(payload.led_enable));
    }
    if ("led_reserve" in payload) {
        encoded = encoded.concat(setLedReserve(payload.led_reserve));
    }
    if ("temperature_calibration" in payload) {
        encoded = encoded.concat(setTemperatureCalibration(payload.temperature_calibration.enable, payload.temperature_calibration.temperature));
    }
    if ("temperature_alarm_config" in payload) {
        encoded = encoded.concat(setTemperatureAlarmConfig(payload.temperature_alarm_config.condition, payload.temperature_alarm_config.min, payload.temperature_alarm_config.max, payload.temperature_alarm_config.alarm_interval, payload.temperature_alarm_config.alarm_times));
    }
    if ("d2d_command" in payload) {
        encoded = encoded.concat(setD2DCommand(payload.d2d_command));
    }

    return encoded;
}

/**
 * read device status
 * @param {boolean} report_status
 * @example payload: { "report_status": 1 }, output: FF28FF
 */
function reportStatus(report_status) {
    var report_status_values = [0, 1];
    if (report_status_values.indexOf(report_status) === -1) {
        throw new Error("report_status must be one of " + report_status_values.join(", "));
    }

    if (report_status === 0) {
        return [];
    }
    return [0xff, 0x28, 0xff];
}

/**
 * report interval configuration
 * @param {number} report_interval uint: second
 * @example payload: { "report_interval": 600 }
 */
function setReportInterval(report_interval) {
    if (typeof report_interval !== "number") {
        throw new Error("report_interval must be a number");
    }
    if (report_interval < 1) {
        throw new Error("report_interval must be greater than 1");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x03);
    buffer.writeUInt16LE(report_interval);
    return buffer.toBytes();
}

/**
 * control socket status
 * @param {string} socket_status values: (0: "off", 1: "on")
 */
function socketStatus(socket_status) {
    var status_values = [0, 1];
    if (status_values.indexOf(socket_status) === -1) {
        throw new Error("socket_status must be one of " + status_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0x08);
    buffer.writeUInt8(status_values.indexOf(socket_status));
    buffer.writeUInt16LE(0xffff);
    return buffer.toBytes();
}

/**
 * set socket status with delay
 * @param {number} socket_status values: (0: "off", 1: "on")
 * @param {number} delay_time unit: second
 * @example payload: { "socket_status": 1, "delay_time": 60 } output: FF22003C0011
 */
function socketStatusWithDelay(socket_status, delay_time) {
    var socket_status_values = [0, 1];
    if (socket_status_values.indexOf(socket_status) === -1) {
        throw new Error("socket_status must be one of " + socket_status_values.join(", "));
    }
    if (typeof delay_time !== "number") {
        throw new Error("delay_time must be a number");
    }

    var data = (0x01 << 4) + socket_status_values.indexOf(socket_status);
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
 * @param {number} cancel_delay_task values: (0: force cancel, 1-255: task-id)
 * @example payload: { "cancel_delay_task": 0 } output: FF2300FF
 */
function cancelDelayTask(cancel_delay_task) {
    if (typeof cancel_delay_task !== "number") {
        throw new Error("cancel_delay_task must be a number");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x23);
    buffer.writeUInt8(cancel_delay_task);
    buffer.writeUInt8(0xff);
    return buffer.toBytes();
}

/**
 * set current threshold configuration
 * @param {boolean} enable values: (0: disable, 1: enable)
 * @param {number} threshold unit: A
 * @example payload: { "current_threshold": { "enable": 1, "threshold": 10 } } output: FF24010A
 */
function setCurrentThreshold(enable, threshold) {
    var current_threshold_enable_values = [0, 1];
    if (current_threshold_enable_values.indexOf(enable) === -1) {
        throw new Error("current_threshold.enable must be one of " + current_threshold_enable_values.join(", "));
    }
    if (typeof threshold !== "number") {
        throw new Error("current_threshold.threshold must be a number");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x24);
    buffer.writeUInt8(current_threshold_enable_values.indexOf(enable));
    buffer.writeUInt8(threshold);
    return buffer.toBytes();
}

/**
 * set over_current protection configuration
 * @param {number} enable values: (0: disable, 1: enable)
 * @param {number} trip_current unit: A
 * @example { "over_current_protection": { "enable": 1, "trip_current": 10 } }
 */
function setOverCurrentProtection(enable, trip_current) {
    var over_current_enable_values = [0, 1];
    if (over_current_enable_values.indexOf(enable) === -1) {
        throw new Error("over_current_protection.enable must be one of " + over_current_enable_values.join(", "));
    }
    if (typeof trip_current !== "number") {
        throw new Error("over_current_protection.trip_current must be a number");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x30);
    buffer.writeUInt8(enable);
    buffer.writeUInt8(trip_current);
    return buffer.toBytes();
}

/**
 * set overload current protection configuration
 * @param {number} enable values: (0: disable, 1: enable)
 * @example { "overload_current_protection": 1 }
 * @since v2.1
 */
function setOverloadCurrentProtection(enable) {
    var overload_current_enable_values = [0, 1];
    if (overload_current_enable_values.indexOf(enable) === -1) {
        throw new Error("overload_current_protection.enable must be one of " + overload_current_enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x8d);
    buffer.writeUInt8(enable);
    return buffer.toBytes();
}

/**
 * set child lock configuration
 * @param {boolean} enable values: (0: disable, 1: enable)
 * @param {number} lock_time unit: min
 * @example payload: { "child_lock_config": { "enable": 1, "lock_time": 60 } } output: FF25003C
 */
function setChildLock(enable, lock_time) {
    var button_lock_enable_values = [0, 1];
    if (button_lock_enable_values.indexOf(enable) === -1) {
        throw new Error("child_lock_config.enable must be one of " + button_lock_enable_values.join(", "));
    }
    if (typeof lock_time !== "number") {
        throw new Error("child_lock_config.lock_time must be a number");
    }

    var data = button_lock_enable_values.indexOf(enable);
    data = (data << 15) + lock_time;
    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x25);
    buffer.writeUInt16LE(data);
    return buffer.toBytes();
}

/**
 * set power consumption configuration
 * @param {boolean} power_consumption_enable values: (0: disable, 1: enable)
 * @example payload: { "power_consumption_enable": 1 } output: FF2601
 */
function powerConsumptionEnable(power_consumption_enable) {
    var power_consumption_values = [0, 1];
    if (power_consumption_values.indexOf(power_consumption_enable) === -1) {
        throw new Error("power_consumption_enable must be one of " + power_consumption_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x26);
    buffer.writeUInt8(power_consumption_values.indexOf(power_consumption_enable));
    return buffer.toBytes();
}

/**
 * reset power consumption
 * @param {boolean} reset_power_consumption values: (0: disable, 1: enable)
 * @example payload: { "reset_power_consumption": 1 } output: FF27FF
 */
function resetPowerConsumption(reset_power_consumption) {
    var reset_power_consumption_values = [0, 1];
    if (reset_power_consumption_values.indexOf(reset_power_consumption) === -1) {
        throw new Error("reset_power_consumption must be one of " + reset_power_consumption_values.join(", "));
    }

    if (reset_power_consumption === 0) {
        return [];
    }
    return [0xff, 0x27, 0xff];
}

/**
 * set led enable configuration
 * @param {number} led_enable values: (0: disable, 1: enable)
 * @example { "led_enable": 1 }
 */
function setLedEnable(led_enable) {
    var led_enable_values = [0, 1];
    if (led_enable_values.indexOf(led_enable) === -1) {
        throw new Error("led_enable must be one of " + led_enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x2f);
    buffer.writeUInt8(led_enable);
    return buffer.toBytes();
}

/**
 * set led indicator reserve configuration
 * @param {number} led_reserve value: (0: disable, 1: enable)
 * @example payload: { "led_reserve": 1 } output: FFA501
 */
function setLedReserve(led_reserve) {
    var led_reserve_values = [0, 1];
    if (led_reserve_values.indexOf(led_reserve) === -1) {
        throw new Error("led_reserve must be one of " + led_reserve_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xa5);
    buffer.writeUInt8(led_reserve);
    return buffer.toBytes();
}

/**
 * temperature calibration configuration
 * @param {boolean} enable
 * @param {number} temperature uint: Celsius
 * @example payload: { "temperature_calibration": { "enable": 1, "temperature": 5 } }, output: FFAB013200
 * @example payload: { "temperature_calibration": { "enable": 1, "temperature": -5 } }, output: FFAB01CEFF
 * @example payload: { "temperature_calibration": { "enable": 0 } }, output: FFAB000000
 * @since v1.9
 */
function setTemperatureCalibration(enable, temperature) {
    var temperature_calibration_enable_values = [0, 1];
    if (temperature_calibration_enable_values.indexOf(enable) == -1) {
        throw new Error("temperature_calibration.enable must be one of " + temperature_calibration_enable_values.join(", "));
    }
    if (enable && typeof temperature !== "number") {
        throw new Error("temperature_calibration.temperature must be a number");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xab);
    buffer.writeUInt8(enable);
    buffer.writeInt16LE(temperature * 10);
    return buffer.toBytes();
}

/**
 * set temperature threshold alarm configuration
 * @param {number} condition values: (0: disable, 1: below, 2: above, 3: between, 4: outside)
 * @param {number} min condition=(below, within, outside)
 * @param {number} max condition=(above, within, outside)
 * @param {number} alarm_interval unit: minute
 * @param {number} alarm_times
 * @example { "temperature_alarm_config": { "condition": 1, "min": 10, "max": 20, "alarm_interval": 10, "alarm_times": 10 } }
 */
function setTemperatureAlarmConfig(condition, min, max, alarm_interval, alarm_times) {
    var condition_values = [0, 1, 2, 3, 4];
    if (condition_values.indexOf(condition) === -1) {
        throw new Error("temperature_alarm_config.condition must be one of " + condition_values.join(", "));
    }

    var alarm_type = 1;
    var data = condition | (alarm_type << 3);

    var buffer = new Buffer(11);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x06);
    buffer.writeUInt8(data);
    buffer.writeInt16LE(min * 10);
    buffer.writeInt16LE(max * 10);
    buffer.writeUInt16LE(alarm_interval);
    buffer.writeUInt16LE(alarm_times);
    return buffer.toBytes();
}

/**
 * set d2d command
 * @param {string} d2d_command
 * @example payload: { "d2d_command": "0000" } output: FF34000000
 */
function setD2DCommand(d2d_command) {
    var d2d_command_values = [0, 1, 2];
    if (d2d_command_values.indexOf(d2d_command) === -1) {
        throw new Error("d2d_command must be one of " + d2d_command_values.join(", "));
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x34);
    buffer.writeUInt8(0x00);
    buffer.writeD2DCommand(d2d_command, "0000");
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
    if (value.length !== 4) {
        throw new Error("d2d_cmd length must be 4");
    }
    this.buffer[this.offset] = parseInt(value.substr(2, 2), 16);
    this.buffer[this.offset + 1] = parseInt(value.substr(0, 2), 16);
    this.offset += 2;
};

Buffer.prototype.toBytes = function () {
    return this.buffer;
};
