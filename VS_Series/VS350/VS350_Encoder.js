/**
 * Payload Encoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product VS350
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

    if ("reboot" in payload) {
        encoded = encoded.concat(reboot(payload.reboot));
    }
    if ("report_status" in payload) {
        encoded = encoded.concat(reportStatus(payload.report_status));
    }
    if ("report_interval" in payload) {
        encoded = encoded.concat(setReportInterval(payload.report_interval));
    }
    if ("report_type" in payload) {
        encoded = encoded.concat(setReportType(payload.report_type));
    }
    if ("sync_time" in payload) {
        encoded = encoded.concat(syncTime(payload.sync_time));
    }
    if ("timezone" in payload) {
        encoded = encoded.concat(setTimezone(payload.timezone));
    }
    if ("cumulative_enable" in payload) {
        encoded = encoded.concat(setCumulativeEnable(payload.cumulative_enable));
    }
    if ("cumulative_reset_config" in payload) {
        encoded = encoded.concat(setCumulativeResetConfig(payload.cumulative_reset_config.weekday, payload.cumulative_reset_config.hour, payload.cumulative_reset_config.minute));
    }
    if ("cumulative_reset_interval" in payload) {
        encoded = encoded.concat(setCumulativeResetInterval(payload.cumulative_reset_interval));
    }
    if ("clear_cumulative" in payload) {
        encoded = encoded.concat(clearCumulative(payload.clear_cumulative));
    }
    if ("temperature_enable" in payload) {
        encoded = encoded.concat(setTemperatureEnable(payload.temperature_enable));
    }
    if ("temperature_calibration" in payload) {
        encoded = encoded.concat(setTemperatureCalibration(payload.temperature_calibration.enable, payload.temperature_calibration.temperature));
    }
    if ("d2d_key" in payload) {
        encoded = encoded.concat(setD2DKey(payload.d2d_key));
    }
    if ("d2d_enable" in payload) {
        encoded = encoded.concat(setD2DEnable(payload.d2d_enable));
    }
    if ("d2d_master_config" in payload) {
        for (var i = 0; i < payload.d2d_master_config.length; i++) {
            var config = payload.d2d_master_config[i];
            encoded = encoded.concat(setD2DMasterConfig(config.mode, config.enable, config.d2d_cmd, config.uplink_enable, config.time_enable, config.time));
        }
    }
    if ("history_enable" in payload) {
        encoded = encoded.concat(setHistoryEnable(payload.history_enable));
    }
    if ("retransmit_enable" in payload) {
        encoded = encoded.concat(setRetransmitEnable(payload.retransmit_enable));
    }
    if ("retransmit_interval" in payload) {
        encoded = encoded.concat(setRetransmitInterval(payload.retransmit_interval));
    }
    if ("fetch_history" in payload) {
        encoded = encoded.concat(fetchHistory(payload.fetch_history.start_time, payload.fetch_history.end_time));
    }
    if ("stop_transmit" in payload) {
        encoded = encoded.concat(stopTransmit(payload.stop_transmit));
    }

    return encoded;
}

/**
 * reboot device
 * @param {number} reboot values: (0: "no", 1: "yes")
 * @example { "reboot": 1 }
 */
function reboot(reboot) {
    var reboot_values = [0, 1];
    if (reboot_values.indexOf(reboot) === -1) {
        throw new Error("reboot must be one of " + reboot_values.join(", "));
    }

    if (reboot === 0) {
        return [];
    }
    return [0xff, 0x10, 0xff];
}

/**
 * report device status
 * @param {number} report_status values: (0: "no", 1: "yes")
 * @example { "report_status": 1 }
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
 * set report interval
 * @param {number} report_interval unit: minute, range: [1, 1440]
 * @example { "report_interval": 20 }
 */
function setReportInterval(report_interval) {
    if (typeof report_interval !== "number") {
        throw new Error("report_interval must be a number");
    }
    if (report_interval < 1 || report_interval > 1440) {
        throw new Error("report_interval must be in range [1, 1440]");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x8e);
    buffer.writeUInt8(0x00);
    buffer.writeUInt16LE(report_interval);
    return buffer.toBytes();
}

/**
 * set report type
 * @param {number} report_type values: (0: "period", 1: "immediate")
 * @example { "report_type": 0 }
 * @since v2.0
 */
function setReportType(report_type) {
    var report_type_values = [0, 1];
    if (report_type_values.indexOf(report_type) === -1) {
        throw new Error("report_type must be one of " + report_type_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x10);
    buffer.writeUInt8(report_type);
    return buffer.toBytes();
}

/**
 * sync time
 * @param {number} sync_time values：(0: "no", 1: "yes")
 * @example { "sync_time": 1 }
 */
function syncTime(sync_time) {
    var sync_time_values = [0, 1];
    if (sync_time_values.indexOf(sync_time) === -1) {
        throw new Error("sync_time must be one of " + sync_time_values.join(", "));
    }

    if (sync_time === 0) {
        return [];
    }
    return [0xff, 0x4a, 0xff];
}

/**
 * set timezone
 * @param {number} timezone
 * @example { "timezone": 8 }
 * @example { "timezone": -4 }
 */
function setTimezone(timezone) {
    if (typeof timezone !== "number") {
        throw new Error("timezone must be a number");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xbd);
    buffer.writeInt16LE(timezone * 60);
    return buffer.toBytes();
}

/**
 * set cumulative enable
 * @param {number} cumulative_enable values: (0: "no", 1: "yes")
 * @example { "cumulative_enable": 1 }
 */
function setCumulativeEnable(cumulative_enable) {
    var cumulative_enable_values = [0, 1];
    if (cumulative_enable_values.indexOf(cumulative_enable) === -1) {
        throw new Error("cumulative_enable must be one of " + cumulative_enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xa9);
    buffer.writeUInt8(cumulative_enable);
    return buffer.toBytes();
}

/**
 * set cumulative reset interval
 * @param {number} cumulative_reset_interval unit: minute, range: [1, 65535]
 * @example { "cumulative_reset_interval": 10 }
 */
function setCumulativeResetInterval(cumulative_reset_interval) {
    if (typeof cumulative_reset_interval !== "number") {
        throw new Error("cumulative_reset_interval must be a number");
    }
    if (cumulative_reset_interval < 1 || cumulative_reset_interval > 65535) {
        throw new Error("cumulative_reset_interval must be in range [1, 65535]");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xa7);
    buffer.writeUInt16LE(cumulative_reset_interval);
    return buffer.toBytes();
}

/**
 * set cumulative reset config
 * @param {number} weekday values: (0: "Everyday", 1: "Sunday", 2: "Monday", 3: "Tuesday", 4: "Wednesday", 5: "Thursday", 6: "Friday", 7: "Saturday")
 * @param {number} hour values: (0-23)
 * @param {number} minute values: (0-59)
 * @example { "cumulative_reset_config": { "weekday": 0, "hour": 0, "minute": 0 } }
 */
function setCumulativeResetConfig(weekday, hour, minute) {
    var weekday_values = [0, 1, 2, 3, 4, 5, 6, 7];
    if (weekday_values.indexOf(weekday) === -1) {
        throw new Error("cumulative_reset_config.weekday must be one of " + weekday_values.join(", "));
    }
    if (typeof hour !== "number" || hour < 0 || hour > 23) {
        throw new Error("cumulative_reset_config.hour must be a number in range [0, 23]");
    }
    if (typeof minute !== "number" || minute < 0 || minute > 59) {
        throw new Error("cumulative_reset_config.minute must be a number in range [0, 59]");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xed);
    buffer.writeUInt8(weekday);
    buffer.writeUInt8(hour);
    buffer.writeUInt8(minute);
    return buffer.toBytes();
}

/**
 * clear cumulative
 * @param {number} clear_cumulative values: (0: "no", 1: "yes")
 * @example { "clear_cumulative": 1 }
 */
function clearCumulative(clear_cumulative) {
    var clear_cumulative_values = [0, 1];
    if (clear_cumulative_values.indexOf(clear_cumulative) === -1) {
        throw new Error("clear_cumulative must be one of " + clear_cumulative_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xa8);
    buffer.writeUInt8(clear_cumulative);
    return buffer.toBytes();
}

/**
 * set temperature enable
 * @param {number} temperature_enable values: (0: "no", 1: "yes")
 * @example { "temperature_enable": 1 }
 */
function setTemperatureEnable(temperature_enable) {
    var temperature_enable_values = [0, 1];
    if (temperature_enable_values.indexOf(temperature_enable) === -1) {
        throw new Error("temperature_enable must be one of " + temperature_enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xaa);
    buffer.writeUInt8(temperature_enable);
    return buffer.toBytes();
}

/**
 * set temperature calibration
 * @param {number} enable values: (0: "no", 1: "yes")
 * @param {number} temperature unit: ℃
 * @example { "temperature_calibration": { "enable": 1, "temperature": 26 } }
 */
function setTemperatureCalibration(enable, temperature) {
    var enable_values = [0, 1];
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("temperature_calibration.enable must be one of " + enable_values.join(", "));
    }
    if (typeof temperature !== "number") {
        throw new Error("temperature_calibration.temperature must be a number");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xab);
    buffer.writeUInt8(enable);
    buffer.writeInt16LE(temperature);
    return buffer.toBytes();
}

/**
 * set d2d key
 * @param {string} d2d_key
 * @example { "d2d_key": "0000000000000000" }
 */
function setD2DKey(d2d_key) {
    if (typeof d2d_key !== "string") {
        throw new Error("d2d_key must be a string");
    }
    if (d2d_key.length !== 16) {
        throw new Error("d2d_key must be 16 characters");
    }
    if (!/^[0-9A-F]+$/.test(d2d_key)) {
        throw new Error("d2d_key must be hex string [0-9A-F]");
    }

    var data = hexStringToBytes(d2d_key);
    var buffer = new Buffer(10);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x35);
    buffer.writeBytes(data);
    return buffer.toBytes();
}

/**
 * set d2d enable
 * @param {number} d2d_enable values: (0: "disable", 1: "enable")
 * @example { "d2d_enable": 1 }
 */
function setD2DEnable(d2d_enable) {
    var d2d_enable_values = [0, 1];
    if (d2d_enable_values.indexOf(d2d_enable) === -1) {
        throw new Error("d2d_enable must be one of " + d2d_enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x84);
    buffer.writeUInt8(d2d_enable);
    return buffer.toBytes();
}

/**
 * d2d master configuration
 * @param {number} mode values: (1: "someone enter", 2: "someone leave", 3: "counting threshold alarm", 4: "temperature threshold alarm", 5: "temperature threshold alarm release")
 * @param {number} enable values: (0: disable, 1: enable)
 * @param {string} d2d_cmd
 * @param {number} uplink_enable values: (0: disable, 1: enable)
 * @param {number} time_enable values: (0: disable, 1: enable)
 * @param {number} time unit: minute
 * @example { "d2d_master_config": [{ "mode": 0, "enable": 1, "d2d_cmd": "0000", "uplink_enable": 1, "time_enable": 1, "time": 10 }] }
 */
function setD2DMasterConfig(mode, enable, d2d_cmd, uplink_enable, time_enable, time) {
    var mode_values = [0, 1, 2, 3];
    if (mode_values.indexOf(mode) === -1) {
        throw new Error("d2d_master_config.mode must be one of " + mode_values.join(", "));
    }
    var enable_values = [0, 1];
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("d2d_master_config.enable must be one of " + enable_values.join(", "));
    }
    if (enable && enable_values.indexOf(uplink_enable) === -1) {
        throw new Error("d2d_master_config.uplink_enable must be one of " + enable_values.join(", "));
    }
    if (enable && enable_values.indexOf(time_enable) === -1) {
        throw new Error("d2d_master_config.time_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(10);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x96);
    buffer.writeUInt8(mode);
    buffer.writeUInt8(enable);
    buffer.writeUInt8(uplink_enable);
    buffer.writeD2DCommand(d2d_cmd, "0000");
    buffer.writeUInt16LE(time);
    buffer.writeUInt8(time_enable);
    return buffer.toBytes();
}

/**
 * set history enable
 * @param {number} history_enable values: (0: "disable", 1: "enable")
 * @example { "history_enable": 1 }
 */
function setHistoryEnable(history_enable) {
    var history_enable_values = [0, 1];
    if (history_enable_values.indexOf(history_enable) === -1) {
        throw new Error("history_enable must be one of " + history_enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x68);
    buffer.writeUInt8(history_enable);
    return buffer.toBytes();
}

/**
 * set retransmit enable
 * @param {number} retransmit_enable values: (0: "disable", 1: "enable")
 * @example { "retransmit_enable": 1 }
 */
function setRetransmitEnable(retransmit_enable) {
    var retransmit_enable_values = [0, 1];
    if (retransmit_enable_values.indexOf(retransmit_enable) === -1) {
        throw new Error("retransmit_enable must be one of " + retransmit_enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x69);
    buffer.writeUInt8(retransmit_enable);
    return buffer.toBytes();
}

/**
 * set retransmit interval
 * @param {number} retransmit_interval unit: second range: [30, 1200]
 * @example { "retransmit_interval": 600 }
 */
function setRetransmitInterval(retransmit_interval) {
    if (typeof retransmit_interval !== "number") {
        throw new Error("retransmit_interval must be a number");
    }
    if (retransmit_interval < 30 || retransmit_interval > 1200) {
        throw new Error("retransmit_interval must be between 30 and 1200");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x6a);
    buffer.writeUInt8(0x00);
    buffer.writeUInt16LE(retransmit_interval);
    return buffer.toBytes();
}

/**
 * fetch history
 * @param {number} start_time
 * @param {number} end_time
 */
function fetchHistory(start_time, end_time) {
    if (typeof start_time !== "number") {
        throw new Error("start_time must be a number");
    }
    if (typeof end_time !== "number") {
        throw new Error("end_time must be a number");
    }

    if (end_time === 0) {
        var buffer = new Buffer(6);
        buffer.writeUInt8(0xfd);
        buffer.writeUInt8(0x6b);
        buffer.writeUInt32LE(start_time);
    } else {
        var buffer = new Buffer(10);
        buffer.writeUInt8(0x6c);
        buffer.writeUInt32LE(start_time);
        buffer.writeUInt32LE(end_time);
    }

    return buffer.toBytes();
}

/**
 * stop transmit
 * @param {number} stop_transmit
 * @example { "stop_transmit": 1 }
 */
function stopTransmit(stop_transmit) {
    var stop_transmit_values = [0, 1];
    if (!stop_transmit_values.indexOf(stop_transmit)) {
        throw new Error("stop_transmit must be one of " + stop_transmit_values.join(", "));
    }

    if (stop_transmit === 0) {
        return [];
    }
    return [0xff, 0x6d, 0xff];
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
