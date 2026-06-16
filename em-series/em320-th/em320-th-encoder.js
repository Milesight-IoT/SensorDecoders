/**
 * Payload Encoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product EM320-TH
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
    if ("collection_interval" in payload) {
        encoded = encoded.concat(setCollectionInterval(payload.collection_interval));
    }
    if ("report_status" in payload) {
        encoded = encoded.concat(reportStatus(payload.report_status));
    }
    if ("alarm_config" in payload) {
        encoded = encoded.concat(setAlarmConfig(payload.alarm_config));
    }
    if ("mutation_config" in payload) {
        encoded = encoded.concat(setMutationConfig(payload.mutation_config));
    }
    if ("alarm_count" in payload) {
        encoded = encoded.concat(setAlarmCount(payload.alarm_count));
    }
    if ("threshold_release" in payload) {
        encoded = encoded.concat(setThresholdRelease(payload.threshold_release));
    }
    if ("humidity_resolution" in payload) {
        encoded = encoded.concat(setHumidityResolution(payload.humidity_resolution));
    }
    if ("trigger_type" in payload) {
        encoded = encoded.concat(setTriggerType(payload.trigger_type));
    }
    if ("calibration_config" in payload) {
        encoded = encoded.concat(setCalibrationConfig(payload.calibration_config));
    }
    if ("button_lock" in payload) {
        encoded = encoded.concat(setButtonLock(payload.button_lock));
    }
    if ("d2d_enable" in payload) {
        encoded = encoded.concat(setD2DEnable(payload.d2d_enable));
    }
    if ("d2d_key" in payload) {
        encoded = encoded.concat(setD2DKey(payload.d2d_key));
    }
    if ("d2d_sender_config" in payload) {
        encoded = encoded.concat(setD2DSenderConfig(payload.d2d_sender_config));
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
    if ("resend_interval" in payload) {
        encoded = encoded.concat(setResendInterval(payload.resend_interval));
    }
    if ("fetch_history" in payload) {
        encoded = encoded.concat(fetchHistory(payload.fetch_history));
    }
    if ("stop_transmit" in payload) {
        encoded = encoded.concat(stopTransmit(payload.stop_transmit));
    }
    if ("clear_history" in payload) {
        encoded = encoded.concat(clearHistory(payload.clear_history));
    }
    if ("full_storage_alarm_enable" in payload) {
        encoded = encoded.concat(setFullStorageAlarmEnable(payload.full_storage_alarm_enable));
    }

    return encoded;
}

/**
 * reboot device
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
 * report interval configuration
 * @param {number} report_interval uint: min, range: [1, 1440]
 * @example { "report_interval": 600 }
 */
function setReportInterval(report_interval) {
    if (report_interval < 1 || report_interval > 1440) {
        throw new Error("report_interval must be in range [1, 1440]");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x8e);
    // ID reserved
    buffer.writeUInt8(0x01);
    buffer.writeUInt16LE(report_interval);
    return buffer.toBytes();
}

/**
 * set collection interval
 * @param {number} collection_interval unit: min, range: [1, 1440]
 * @example { "collection_interval": 60 }
 */
function setCollectionInterval(collection_interval) {
    if (collection_interval < 1 || collection_interval > 1440) {
        throw new Error("collection_interval must be in range [1, 1440]");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x39);
    buffer.writeUInt16LE(collection_interval);
    return buffer.toBytes();
}

/**
 * report device status
 * @param {number} report_status values: (0: no, 1: yes)
 * @example { "report_status": 1 }
 */
function reportStatus(report_status) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(report_status) === -1) {
        throw new Error("report_status must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, report_status) === 0) {
        return [];
    }
    return [0xff, 0x28, 0xff];
}

/**
 * set temperature threshold alarm
 * @param {object} alarm_config
 * @param {number} alarm_config.id 1: temperature, 2: humidity
 * @param {number} alarm_config.condition values: (0: disable, 1: below, 2: above, 3: between, 4: outside)
 * @param {number} alarm_config.threshold_min condition=(below, within, outside)
 * @param {number} alarm_config.threshold_max condition=(above, within, outside)
 * @param {number} alarm_config.enable values: (0: disable, 1: enable)
 * @example { "alarm_config": { "id": 1, "condition": 2, "threshold_min": 10, "threshold_max": 30, "enable": 1 } }
 */
function setAlarmConfig(alarm_config) {
    var id = alarm_config.id;
    var condition = alarm_config.condition;
    var threshold_min = alarm_config.threshold_min;
    var threshold_max = alarm_config.threshold_max;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("enable must be one of " + enable_values.join(", "));
    }
    var condition_map = { 0: "disable", 1: "below", 2: "above", 3: "between", 4: "outside" };
    var condition_values = getValues(condition_map);
    if (condition_values.indexOf(condition) === -1) {
        throw new Error("condition must be one of " + condition_values.join(", "));
    }

    var buffer = new Buffer(9);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x0b);
    buffer.writeUInt8(id);
    buffer.writeUInt8(getValue(condition_map, condition));
    buffer.writeInt16LE(threshold_min * 10);
    buffer.writeInt16LE(threshold_max * 10);
    buffer.writeUInt8(getValue(enable_map, enable));
    return buffer.toBytes();
}

/**
 * set mutation config
 * @param {object} mutation_config
 * @param {number} mutation_config.id 1: temperature, 2: humidity
 * @param {number} mutation_config.mutation_max
 * @param {number} mutation_config.enable values: (0: disable, 1: enable)
 * @example { "mutation_config": { "id": 1, "mutation_max": 10, "enable": 1 } }
 */
function setMutationConfig(mutation_config) {

    var id = mutation_config.id;
    var mutation_max = mutation_config.mutation_max;
    var enable = mutation_config.enable;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x0c);
    buffer.writeUInt8(id);
    buffer.writeInt16LE(mutation_max * 10);
    buffer.writeUInt8(getValue(enable_map, enable));
    return buffer.toBytes();
}

/**
 * set alarm count
 * @param {number} alarm_count
 * @example { "alarm_count": 10 } range: [1, 1000]
 */
function setAlarmCount(alarm_count) {
    if (alarm_count < 1 || alarm_count > 1000) {
        throw new Error("alarm_count must be in range [1, 1000]");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xf2);
    buffer.writeUInt16LE(alarm_count);
    return buffer.toBytes();
}

/**
 * set threshold release
 * @param {number} threshold_release values: (0: enable, 1: disable)
 * @example { "threshold_release": 0 }
 */
function setThresholdRelease(threshold_release) {
    var enable_map = { 0: "enable", 1: "disable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(threshold_release) === -1) {
        throw new Error("threshold_release must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xf5);
    buffer.writeUInt8(getValue(enable_map, threshold_release));
    return buffer.toBytes();
}

/**
 * set trigger type
 * @param {number} trigger_type values: (1: 外部触发)
 * @example { "trigger_type": 1 }
 */
function setTriggerType(trigger_type) {
    var trigger_type_map = { 1: "external_trigger" };
    var trigger_type_values = getValues(trigger_type_map);
    if (trigger_type_values.indexOf(trigger_type) === -1) {
        throw new Error("trigger_type must be one of " + trigger_type_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0x05);
    buffer.writeUInt8(0x6B);
    buffer.writeUInt8(1);
    return buffer.toBytes();
}

/**
 * set humidity resolution
 * @param {number} humidity_resolution values: (0: 0.5%, 1: 1%)
 * @example { "humidity_resolution": 0 }
 */
function setHumidityResolution(humidity_resolution) {
    var resolution_map = { 0: "0.5%", 1: "0.1%" };
    var resolution_values = getValues(resolution_map);
    if (resolution_values.indexOf(humidity_resolution) === -1) {
        throw new Error("humidity_resolution must be one of " + resolution_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0xd9);
    buffer.writeUInt8(getValue(resolution_map, humidity_resolution));
    return buffer.toBytes();
}

/**
 * set calibration config
 * @param {object} calibration_config
 * @param {number} calibration_config.id values: (0: temperature, 1: humidity)
 * @param {number} calibration_config.enable values: (0: disable, 1: enable)
 * @param {number} calibration_config.calibration_value unit: ℃ or %, range: [-100, 100]
 * @example { "calibration_config": { "id": 0, "enable": 1, "calibration_value": 10 } }
 * @example { "calibration_config": { "id": 1, "enable": 1, "calibration_value": 10 } }
 */
function setCalibrationConfig(calibration_config) {
    var id = calibration_config.id;
    var enable = calibration_config.enable;
    var calibration_value = calibration_config.calibration_value;

    var id_map = { 0: "temperature", 1: "humidity" };
    var id_values = getValues(id_map);
    if (id_values.indexOf(id) === -1) {
        throw new Error("calibration_config.id must be one of " + id_values.join(", "));
    }

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("calibration_config.enable must be one of " + enable_values.join(", "));
    }

    if (calibration_value < -100 || calibration_value > 100) {
        throw new Error("calibration_config.calibration_value must be in range [-100, 100]");
    }

    // ctrl: bit0~bit6 = id, bit7 = enable
    var ctrl = (getValue(id_map, id) & 0x7f) | (getValue(enable_map, enable) << 7);

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xea);
    buffer.writeUInt8(ctrl);
    buffer.writeInt16LE(calibration_value * 10);
    return buffer.toBytes();
}

/**
 * set button lock
 * @param {object} button_lock
 * @param {number} button_lock.power_off values: (0: disable, 1: enable)
 * @param {number} button_lock.collect_report values: (0: disable, 1: enable)
 * @example { "button_lock": { "power_off": 1, "collect_report": 1 } }
 */
function setButtonLock(button_lock) {
    var power_off = button_lock.power_off;
    var collect_report = button_lock.collect_report;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(power_off) === -1) {
        throw new Error("button_lock.power_off must be one of " + enable_values.join(", "));
    }
    if (enable_values.indexOf(collect_report) === -1) {
        throw new Error("button_lock.collect_report must be one of " + enable_values.join(", "));
    }

    var mask = 0x00;
    mask |= getValue(enable_map, power_off) << 0;
    mask |= getValue(enable_map, collect_report) << 1;

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x69);
    buffer.writeUInt8(mask);
    return buffer.toBytes();
}

/**
 * set D2D enable
 * @param {number} d2d_enable values: (0: disable, 1: enable)
 * @example { "d2d_enable": 1 }
 */
function setD2DEnable(d2d_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(d2d_enable) === -1) {
        throw new Error("d2d_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x66);
    buffer.writeUInt8(getValue(enable_map, d2d_enable));
    return buffer.toBytes();
}

/**
 * set D2D key
 * @param {string} d2d_key 8-byte hex string, e.g. "1234567812345678"
 * @example { "d2d_key": "1234567812345678" }
 */
function setD2DKey(d2d_key) {
    if (typeof d2d_key !== "string" || d2d_key.length !== 16 || !/^[0-9a-fA-F]{16}$/.test(d2d_key)) {
        throw new Error("d2d_key must be a 16-character hex string (8 bytes)");
    }

    var buffer = new Buffer(10);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x35);
    for (var i = 0; i < 8; i++) {
        buffer.writeUInt8(parseInt(d2d_key.slice(i * 2, i * 2 + 2), 16));
    }
    return buffer.toBytes();
}

/**
 * set D2D sender config
 * @param {object} d2d_sender_config
 * @param {number} d2d_sender_config.d2d_sender_enable values: (0: disable, 1: enable)
 * @param {number} d2d_sender_config.uplink_lora_enable values: (0: disable, 1: enable)
 * @param {number} d2d_sender_config.sensor_data_enable bitmask: bit0=temperature, bit1=humidity
 * @example { "d2d_sender_config": { "d2d_sender_enable": 1, "uplink_lora_enable": 1, "sensor_data_enable": 3 } }
 */
function setD2DSenderConfig(d2d_sender_config) {
    var d2d_sender_enable = d2d_sender_config.d2d_sender_enable;
    var uplink_lora_enable = d2d_sender_config.uplink_lora_enable;
    var sensor_data_enable = d2d_sender_config.sensor_data_enable;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(d2d_sender_enable) === -1) {
        throw new Error("d2d_sender_config.d2d_sender_enable must be one of " + enable_values.join(", "));
    }
    if (enable_values.indexOf(uplink_lora_enable) === -1) {
        throw new Error("d2d_sender_config.uplink_lora_enable must be one of " + enable_values.join(", "));
    }
    if (typeof sensor_data_enable !== "number" || sensor_data_enable < 0 || sensor_data_enable > 0xffff) {
        throw new Error("d2d_sender_config.sensor_data_enable must be in range [0, 65535]");
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x63);
    buffer.writeUInt8(getValue(enable_map, d2d_sender_enable));
    buffer.writeUInt8(getValue(enable_map, uplink_lora_enable));
    buffer.writeUInt16LE(sensor_data_enable);
    return buffer.toBytes();
}

/**
 * history enable
 * @param {number} history_enable values: (0: disable, 1: enable)
 * @example { "history_enable": 1 }
 */
function setHistoryEnable(history_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(history_enable) === -1) {
        throw new Error("history_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x68);
    buffer.writeUInt8(getValue(enable_map, history_enable));
    return buffer.toBytes();
}

/**
 * retransmit enable
 * @param {number} retransmit_enable values: (0: disable, 1: enable)
 * @example { "retransmit_enable": 1 }
 */
function setRetransmitEnable(retransmit_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(retransmit_enable) === -1) {
        throw new Error("retransmit_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x69);
    buffer.writeUInt8(getValue(enable_map, retransmit_enable));
    return buffer.toBytes();
}

/**
 * retransmit interval
 * @param {number} retransmit_interval unit: second, range: [30, 1200]
 * @example { "retransmit_interval": 60 }
 */
function setRetransmitInterval(retransmit_interval) {
    if (retransmit_interval < 30 || retransmit_interval > 1200) {
        throw new Error("retransmit_interval must be in range [30, 1200]");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x6a);
    buffer.writeUInt8(0x00);
    buffer.writeUInt16LE(retransmit_interval);
    return buffer.toBytes();
}

/**
 * resend interval
 * @param {number} resend_interval unit: second, range: [30, 1200]
 * @example { "resend_interval": 60 }
 */
function setResendInterval(resend_interval) {
    if (resend_interval < 30 || resend_interval > 1200) {
        throw new Error("resend_interval must be in range [30, 1200]");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x6a);
    buffer.writeUInt8(0x01);
    buffer.writeUInt16LE(resend_interval);
    return buffer.toBytes();
}

/**
 * fetch history
 * @param {object} fetch_history
 * @param {number} fetch_history.start_time
 * @param {number} fetch_history.end_time
 * @example { "fetch_history": { "start_time": 1609459200, "end_time": 1609545600 } }
 */
function fetchHistory(fetch_history) {
    var start_time = fetch_history.start_time;
    var end_time = fetch_history.end_time || 0;

    if (end_time && start_time > end_time) {
        throw new Error("fetch_history.start_time must be less than fetch_history.end_time");
    }

    var buffer;
    if (end_time === 0) {
        buffer = new Buffer(6);
        buffer.writeUInt8(0xfd);
        buffer.writeUInt8(0x6b);
        buffer.writeUInt32LE(start_time);
    } else {
        buffer = new Buffer(10);
        buffer.writeUInt8(0xfd);
        buffer.writeUInt8(0x6c);
        buffer.writeUInt32LE(start_time);
        buffer.writeUInt32LE(end_time);
    }

    return buffer.toBytes();
}

/**
 * history stop transmit
 * @param {number} stop_transmit values: (0: no, 1: yes)
 * @example { "stop_transmit": 1 }
 */
function stopTransmit(stop_transmit) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(stop_transmit) === -1) {
        throw new Error("stop_transmit must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, stop_transmit) === 0) {
        return [];
    }
    return [0xfd, 0x6d, 0xff];
}

/**
 * clear history
 * @param {number} clear_history values: (0: no, 1: yes)
 * @example { "clear_history": 1 }
 */
function clearHistory(clear_history) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(clear_history) === -1) {
        throw new Error("clear_history must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, clear_history) === 0) {
        return [];
    }
    return [0xff, 0x27, 0x01];
}

/**
 * set full storage alarm enable (V1.7+, cert version only)
 * @param {number} full_storage_alarm_enable values: (0: disable, 1: enable)
 * @example { "full_storage_alarm_enable": 1 }
 */
function setFullStorageAlarmEnable(full_storage_alarm_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(full_storage_alarm_enable) === -1) {
        throw new Error("full_storage_alarm_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0xc9);
    buffer.writeUInt8(getValue(enable_map, full_storage_alarm_enable));
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

Buffer.prototype.writeUInt24LE = function (value) {
    this._write(value, 3, true);
    this.offset += 3;
};

Buffer.prototype.writeInt24LE = function (value) {
    this._write(value < 0 ? value + 0x1000000 : value, 3, true);
    this.offset += 3;
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
