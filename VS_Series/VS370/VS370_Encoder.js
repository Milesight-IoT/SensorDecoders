/**
 * Payload Encoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product VS370
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
    if ("pir_idle_interval" in payload) {
        encoded = encoded.concat(setPIRIdleInterval(payload.pir_idle_interval));
    }
    if ("sync_time" in payload) {
        encoded = encoded.concat(syncTime(payload.sync_time));
    }
    if ("timezone" in payload) {
        encoded = encoded.concat(setTimeZone(payload.timezone));
    }
    if ("dst_config" in payload) {
        encoded = encoded.concat(setDaylightSavingTime(payload.dst_config.enable, payload.dst_config.offset, payload.dst_config.start_time, payload.dst_config.end_time));
    }
    if ("pir_window_time" in payload) {
        encoded = encoded.concat(setPirWindowTime(payload.pir_window_time));
    }
    if ("pir_pulse_times" in payload) {
        encoded = encoded.concat(setPirPulseTimes(payload.pir_pulse_times));
    }
    if ("pir_sensitivity" in payload) {
        encoded = encoded.concat(setPirSensitivity(payload.pir_sensitivity));
    }
    if ("radar_sensitivity" in payload) {
        encoded = encoded.concat(setRadarSensitivity(payload.radar_sensitivity));
    }
    if ("light_threshold" in payload) {
        encoded = encoded.concat(setLightThreshold(payload.light_threshold.enable, payload.light_threshold.upper_limit, payload.light_threshold.lower_limit));
    }
    if ("bluetooth_enable" in payload) {
        encoded = encoded.concat(setBluetoothEnable(payload.bluetooth_enable));
    }
    if ("d2d_enable" in payload) {
        encoded = encoded.concat(setD2DEnable(payload.d2d_enable));
    }
    if ("d2d_key" in payload) {
        encoded = encoded.concat(setD2DKey(payload.d2d_key));
    }
    if ("d2d_master_config" in payload) {
        for (var i = 0; i < payload.d2d_master_config.length; i++) {
            var config = payload.d2d_master_config[i];
            encoded = encoded.concat(setD2DMasterConfig(config.mode, config.enable, config.d2d_cmd, config.uplink_enable, config.time_enable, config.time));
        }
    }
    if ("hibernate_config" in payload) {
        for (var i = 0; i < payload.hibernate_config.length; i++) {
            var config = payload.hibernate_config[i];
            encoded = encoded.concat(setHibernateConfig(i, config.enable, config.start_time, config.end_time));
        }
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
 * @param {number} report_status values: (0: "plan", 1: "periodic")
 * @example { "report_status": 1 }
 */
function reportStatus(report_status) {
    var report_status_values = [0, 1];
    if (report_status_values.indexOf(report_status) === -1) {
        throw new Error("report_status must be one of " + report_status_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x28);
    buffer.writeUInt8(report_status);
    return buffer.toBytes();
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
 * set pir idle interval
 * @param {number} pir_idle_interval unit: minute, range: [1, 60]
 * @example { "pir_idle_interval": 3 }
 */
function setPIRIdleInterval(pir_idle_interval) {
    if (typeof pir_idle_interval !== "number") {
        throw new Error("pir_idle_interval must be a number");
    }
    if (pir_idle_interval < 1 || pir_idle_interval > 60) {
        throw new Error("pir_idle_interval must be in range [1, 60]");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x40);
    buffer.writeUInt8(pir_idle_interval);
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
 * @example { "timezone": -4 }
 * @example { "timezone": 8 }
 */
function setTimeZone(timezone) {
    if (typeof timezone !== "number") {
        throw new Error("timezone must be a number");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x17);
    buffer.writeInt16LE(timezone * 10);
    return buffer.toBytes();
}

/**
 * set pir window time
 * @param {number} pir_window_time values: (0: "2s", 1: "4s", 2: "6s", 3: "8s")
 * @example { "pir_window_time": 2 }
 */
function setPirWindowTime(pir_window_time) {
    var pir_window_time_values = [0, 1, 2, 3];
    if (pir_window_time_values.indexOf(pir_window_time) === -1) {
        throw new Error("pir_window_time must be one of " + pir_window_time_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x42);
    buffer.writeUInt8(pir_window_time);
    return buffer.toBytes();
}

/**
 * set pir pulse times threshold
 * @param {number} pir_pulse_times values: (0: "1 times", 1: "2 times", 2: "3 times", 3: "4 times")
 * @example { "pir_pulse_times": 2 }
 */
function setPirPulseTimes(pir_pulse_times) {
    var pir_pulse_times_values = [0, 1, 2, 3];
    if (pir_pulse_times_values.indexOf(pir_pulse_times) === -1) {
        throw new Error("pir_pulse_times must be one of " + pir_pulse_times_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x43);
    buffer.writeUInt8(pir_pulse_times);
    return buffer.toBytes();
}

/**
 * set pir sensitivity (sensitivity to triggers when transitioning from vacant to occupied)
 * @param {number} pir_sensitivity values: (0: "low", 1: "medium", 2: "high")
 * @example { "pir_sensitivity": 1 }
 */
function setPirSensitivity(pir_sensitivity) {
    var pir_sensitivity_values = [0, 1, 2];
    if (pir_sensitivity_values.indexOf(pir_sensitivity) === -1) {
        throw new Error("pir_sensitivity must be one of " + pir_sensitivity_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x3e);
    buffer.writeUInt8(pir_sensitivity);
    return buffer.toBytes();
}

/**
 * set radar sensitivity (sensitivity to triggers while maintaining a motionless state)
 * @param {number} radar_sensitivity values: (0: "low", 1: "medium", 2: "high")
 * @example { "radar_sensitivity": 1 }
 */
function setRadarSensitivity(radar_sensitivity) {
    var radar_sensitivity_values = [0, 1, 2];
    if (radar_sensitivity_values.indexOf(radar_sensitivity) === -1) {
        throw new Error("radar_sensitivity must be one of " + radar_sensitivity_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x3f);
    buffer.writeUInt8(radar_sensitivity);
    return buffer.toBytes();
}

/**
 * set light threshold
 * @param {number} enable values: (0: "disable", 1: "enable")
 * @param {number} upper_limit unit: lux, range: [1, 8000]
 * @param {number} lower_limit unit: lux, range: [1, 8000]
 * @example { "light_threshold": { "enable": 1, "upper_limit": 700, "lower_limit": 300 } }
 */
function setLightThreshold(enable, upper_limit, lower_limit) {
    var enable_values = [0, 1];
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("light_threshold.enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x41);
    buffer.writeUInt8(enable);
    buffer.writeUInt16LE(upper_limit);
    buffer.writeUInt16LE(lower_limit);
    return buffer.toBytes();
}

/**
 * set daylight saving time
 * @param {number} enable
 * @param {number} offset, unit: minute
 * @param {object} start_time
 * @param {number} start_time.month, range: [1, 12]
 * @param {number} start_time.week, range: [1, 5]
 * @param {number} start_time.weekday, range: [1, 7]
 * @param {object} end_time
 * @param {number} end_time.month, range: [1, 12]
 * @param {number} end_time.week, range: [1, 5]
 * @param {number} end_time.weekday, range: [1, 7]
 * @example { "dst_config": { "enable": 1, "offset": 60, "start_time": { "month": 3, "week": 2, "weekday": 7, "time": "2:00" }, "end_time": { "month": 1, "week": 4, "weekday": 1, "time": "2:00" } } }
 */
function setDaylightSavingTime(enable, offset, start_time, end_time) {
    var dst_config_enable_values = [0, 1];
    if (dst_config_enable_values.indexOf(enable) === -1) {
        throw new Error("dst_config.enable must be one of " + dst_config_enable_values.join(", "));
    }

    var buffer = new Buffer(12);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xba);
    buffer.writeUInt8(enable);

    if (enable) {
        var start = start_time.time.split(":");
        var end = end_time.time.split(":");
        buffer.writeUInt8(offset);
        buffer.writeUInt8(start_time.month);
        buffer.writeUInt8((start_time.week << 4) | start_time.weekday);
        buffer.writeUInt16LE(parseInt(start[0]) * 60 + parseInt(start[1]));
        buffer.writeUInt8(end_time.month);
        buffer.writeUInt8((end_time.week << 4) | end_time.weekday);
        buffer.writeUInt16LE(parseInt(end[0]) * 60 + parseInt(end[1]));
    }
    return buffer.toBytes();
}

/**
 * set bluetooth enable
 * @param {number} bluetooth_enable values: (0: "disable", 1: "enable")
 * @example { "bluetooth_enable": 1 }
 */
function setBluetoothEnable(bluetooth_enable) {
    var bluetooth_enable_values = [0, 1];
    if (bluetooth_enable_values.indexOf(bluetooth_enable) === -1) {
        throw new Error("bluetooth_enable must be one of " + bluetooth_enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x8f);
    buffer.writeUInt8(bluetooth_enable);
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
 * set d2d key
 * @param {string} d2d_key
 * @example { "d2d_key": "5572404C696E6B4C" }
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
 * d2d master configuration
 * @param {number} mode values: (0: "occupied", 1: "vacant", 2: "bright", 3: "dim", 4: "occupied and bright", 5: "occupied and dim")
 * @param {number} enable values: (0: disable, 1: enable)
 * @param {string} d2d_cmd
 * @param {number} uplink_enable values: (0: disable, 1: enable)
 * @param {number} time_enable values: (0: disable, 1: enable)
 * @param {number} time unit: minute
 * @example { "d2d_master_config": [{ "mode": 0, "enable": 1, "d2d_cmd": "0000", "uplink_enable": 1, "time_enable": 1, "time": 10 }] }
 */
function setD2DMasterConfig(mode, enable, d2d_cmd, uplink_enable, time_enable, time) {
    var mode_values = [0, 1, 2, 3, 4, 5];
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
 * set hibernate config
 * @param {number} id range: [0, 1]
 * @param {number} enable values: (0: disable, 1: enable)
 * @param {number} start_time unit: minute, range: [0, 1440]
 * @param {number} end_time unit: minute, range: [0, 1440]
 * @example { "hibernate_config": [{ "id": 0, "enable": 1, "start_time": 0, "end_time": 120 }] }
 */
function setHibernateConfig(id, enable, start_time, end_time) {
    var id_values = [0, 1];
    if (id_values.indexOf(id) === -1) {
        throw new Error("hibernate_config.id must be one of " + id_values.join(", "));
    }
    var enable_values = [0, 1];
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("hibernate_config.enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(8);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x44);
    buffer.writeUInt8(id);
    buffer.writeUInt8(enable);
    buffer.writeUInt16LE(start_time);
    buffer.writeUInt16LE(end_time);
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
