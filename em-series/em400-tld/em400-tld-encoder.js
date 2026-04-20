/**
 * Payload Encoder
 *
 * Copyright 2026 Milesight IoT
 *
 * @product EM400-TLD
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
        encoded = encoded.concat(setReboot(payload.reboot));
    }
    if ("report_interval" in payload) {
        encoded = encoded.concat(setReportInterval(payload.report_interval));
    }
    if ("collection_interval" in payload) {
        encoded = encoded.concat(setCollectionInterval(payload.collection_interval));
    }
    if ("existing_height" in payload) {
        encoded = encoded.concat(setExistingHeight(payload.existing_height));
    }
    if ("install_height" in payload) {
        encoded = encoded.concat(setInstallHeight(payload.install_height));
    }
    if ("working_mode" in payload) {
        encoded = encoded.concat(setWorkingMode(payload.working_mode));
    }
    if ("tilt_linkage_enable" in payload) {
        encoded = encoded.concat(setTiltLinkageEnable(payload.tilt_linkage_enable));
    }
    if ("tof_enable" in payload) {
        encoded = encoded.concat(setTofEnable(payload.tof_enable));
    }
    if ("threshold_alarm_config" in payload) {
        encoded = encoded.concat(setThresholdAlarmConfig(payload.threshold_alarm_config));
    }
    if ("recollection_time" in payload) {
        encoded = encoded.concat(setRecollectionTime(payload.recollection_time));
    }
    if ("bin_install_height_enable" in payload) {
        encoded = encoded.concat(setBinInstallHeightEnable(payload.bin_install_height_enable));
    }
    if ("motion_report_config" in payload) {
        encoded = encoded.concat(setMotionReportConfig(payload.motion_report_config));
    }
    if ("motion_detect_condition" in payload) {
        encoded = encoded.concat(setMotionDetectCondition(payload.motion_detect_condition));
    }
    if ("accumulated_packet_config" in payload) {
        encoded = encoded.concat(setAccumulatedPacketConfig(payload.accumulated_packet_config));
    }
    if ("query_device_status" in payload) {
        encoded = encoded.concat(setQueryDeviceStatus(payload.query_device_status));
    }
    if ("query_device_position" in payload) {
        encoded = encoded.concat(setQueryDevicePosition(payload.query_device_position));
    }
    if ("galaxy_type" in payload) {
        encoded = encoded.concat(setGalaxyType(payload.galaxy_type));
    }
    if ("ack_enable" in payload) {
        encoded = encoded.concat(setAckEnable(payload.ack_enable));
    }
    if ("gps_enable" in payload) {
        encoded = encoded.concat(setGpsEnable(payload.gps_enable));
    }
    if ("tilt_report_enable" in payload) {
        encoded = encoded.concat(setTiltReportEnable(payload.tilt_report_enable));
    }
    if ("disassembly_alarm_config" in payload) {
        encoded = encoded.concat(setDisassemblyAlarmConfig(payload.disassembly_alarm_config));
    }
    if ("sim_card_priority" in payload) {
        encoded = encoded.concat(setSimCardPriority(payload.sim_card_priority));
    }
    if ("background_convergence_interval" in payload) {
        encoded = encoded.concat(setBackgroundConvergenceInterval(payload.background_convergence_interval));
    }
    if ("tilt_calibration" in payload) {
        encoded = encoded.concat(setTiltCalibration(payload.tilt_calibration));
    }
    if ("sensor_convergence" in payload) {
        encoded = encoded.concat(setSensorConvergence(payload.sensor_convergence));
    }

    return encoded;
}

function setReboot(reboot) {
    validateEnum("reboot", reboot, ["no", "yes"]);
    if (reboot === "no") return [];
    return [0xff, 0x10, 0xff];
}

function setReportInterval(report_interval) {
    validateUInt32("report_interval", report_interval);

    var buffer = new Buffer(6);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x03);
    buffer.writeUInt32LE(report_interval);
    return buffer.toBytes();
}

function setCollectionInterval(collection_interval) {
    validateUInt32("collection_interval", collection_interval);

    var buffer = new Buffer(6);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x02);
    buffer.writeUInt32LE(collection_interval);
    return buffer.toBytes();
}

function setExistingHeight(existing_height) {
    validateUInt16("existing_height", existing_height);

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x70);
    buffer.writeUInt16LE(existing_height);
    return buffer.toBytes();
}

function setInstallHeight(install_height) {
    validateUInt16("install_height", install_height);

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x77);
    buffer.writeUInt16LE(install_height);
    return buffer.toBytes();
}

function setWorkingMode(working_mode) {
    validateEnum("working_mode", working_mode, ["standard", "bin"]);

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x71);
    buffer.writeUInt8(getValue({ 0: "standard", 1: "bin" }, working_mode));
    return buffer.toBytes();
}

function setTiltLinkageEnable(tilt_linkage_enable) {
    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x3e);
    buffer.writeUInt8(readEnableValue("tilt_linkage_enable", tilt_linkage_enable));
    return buffer.toBytes();
}

function setTofEnable(tof_enable) {
    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x56);
    buffer.writeUInt8(readEnableValue("tof_enable", tof_enable));
    return buffer.toBytes();
}

function setThresholdAlarmConfig(threshold_alarm_config) {
    var condition = threshold_alarm_config.condition;
    var id = threshold_alarm_config.id;
    var renew_alert = threshold_alarm_config.renew_alert;
    var min = threshold_alarm_config.min;
    var max = threshold_alarm_config.max;
    var lock_time = threshold_alarm_config.lock_time;
    var continue_time = threshold_alarm_config.continue_time;

    validateEnum("threshold_alarm_config.condition", condition, ["disable", "below", "above", "within", "outside"]);
    validateRange("threshold_alarm_config.id", id, 0, 7);
    validateEnable("threshold_alarm_config.renew_alert", renew_alert);
    validateUInt16("threshold_alarm_config.min", min);
    validateUInt16("threshold_alarm_config.max", max);
    validateUInt16("threshold_alarm_config.lock_time", lock_time);
    validateUInt16("threshold_alarm_config.continue_time", continue_time);

    var ctrl = 0x00;
    ctrl |= getValue({ 0: "disable", 1: "below", 2: "above", 3: "within", 4: "outside" }, condition);
    ctrl |= (id & 0x07) << 3;
    ctrl |= readEnableValue("threshold_alarm_config.renew_alert", renew_alert) << 7;

    var buffer = new Buffer(11);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x06);
    buffer.writeUInt8(ctrl);
    buffer.writeUInt16LE(min);
    buffer.writeUInt16LE(max);
    buffer.writeUInt16LE(lock_time);
    buffer.writeUInt16LE(continue_time);
    return buffer.toBytes();
}

function setRecollectionTime(recollection_time) {
    validateRange("recollection_time", recollection_time, 0, 255);

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x1c);
    buffer.writeUInt8(recollection_time);
    return buffer.toBytes();
}

function setBinInstallHeightEnable(bin_install_height_enable) {
    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x13);
    buffer.writeUInt8(readEnableValue("bin_install_height_enable", bin_install_height_enable));
    return buffer.toBytes();
}

function setMotionReportConfig(motion_report_config) {
    validateEnable("motion_report_config.enable", motion_report_config.enable);
    validateUInt32("motion_report_config.period", motion_report_config.period);

    var buffer = new Buffer(7);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x8e);
    buffer.writeUInt8(readEnableValue("motion_report_config.enable", motion_report_config.enable));
    buffer.writeUInt32LE(motion_report_config.period);
    return buffer.toBytes();
}

function setMotionDetectCondition(motion_detect_condition) {
    validateRange("motion_detect_condition.move_holding_time", motion_detect_condition.move_holding_time, 0, 255);
    validateUInt32("motion_detect_condition.stop_holding_time", motion_detect_condition.stop_holding_time);

    var buffer = new Buffer(7);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x58);
    buffer.writeUInt8(motion_detect_condition.move_holding_time);
    buffer.writeUInt32LE(motion_detect_condition.stop_holding_time);
    return buffer.toBytes();
}

function setAccumulatedPacketConfig(accumulated_packet_config) {
    validateEnable("accumulated_packet_config.enable", accumulated_packet_config.enable);
    validateRange("accumulated_packet_config.count", accumulated_packet_config.count, 0, 255);

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x9e);
    buffer.writeUInt8(readEnableValue("accumulated_packet_config.enable", accumulated_packet_config.enable));
    buffer.writeUInt8(accumulated_packet_config.count);
    return buffer.toBytes();
}

function setQueryDeviceStatus(query_device_status) {
    validateEnum("query_device_status", query_device_status, ["no", "yes"]);
    if (query_device_status === "no") return [];
    return [0xff, 0x9c];
}

function setQueryDevicePosition(query_device_position) {
    validateEnum("query_device_position", query_device_position, ["no", "yes"]);
    if (query_device_position === "no") return [];
    return [0xff, 0x9d];
}

function setGalaxyType(galaxy_type) {
    validateEnum("galaxy_type", galaxy_type, ["beidou", "glonass_galileo", "glonass_qzss", "glonass", "auto_base_mcc"]);

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x9b);
    buffer.writeUInt8(getValue({
        1: "beidou",
        2: "glonass_galileo",
        3: "glonass_qzss",
        4: "glonass",
        5: "auto_base_mcc",
    }, galaxy_type));
    return buffer.toBytes();
}

function setAckEnable(ack_enable) {
    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x9f);
    buffer.writeUInt8(readEnableValue("ack_enable", ack_enable));
    return buffer.toBytes();
}

function setGpsEnable(gps_enable) {
    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xa0);
    buffer.writeUInt8(readEnableValue("gps_enable", gps_enable));
    return buffer.toBytes();
}

function setTiltReportEnable(tilt_report_enable) {
    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xa1);
    buffer.writeUInt8(readEnableValue("tilt_report_enable", tilt_report_enable));
    return buffer.toBytes();
}

function setDisassemblyAlarmConfig(disassembly_alarm_config) {
    validateEnable("disassembly_alarm_config.enable", disassembly_alarm_config.enable);
    validateRange("disassembly_alarm_config.duration", disassembly_alarm_config.duration, 1, 60);

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xa2);
    buffer.writeUInt8(readEnableValue("disassembly_alarm_config.enable", disassembly_alarm_config.enable));
    buffer.writeUInt8(disassembly_alarm_config.duration);
    return buffer.toBytes();
}

function setSimCardPriority(sim_card_priority) {
    validateEnum("sim_card_priority", sim_card_priority, ["esim_first", "physical_sim_first"]);

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xa3);
    buffer.writeUInt8(getValue({ 0: "esim_first", 1: "physical_sim_first" }, sim_card_priority));
    return buffer.toBytes();
}

function setBackgroundConvergenceInterval(background_convergence_interval) {
    validateRange("background_convergence_interval", background_convergence_interval, 0, 255);

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xa4);
    buffer.writeUInt8(background_convergence_interval);
    return buffer.toBytes();
}

function setTiltCalibration(tilt_calibration) {
    validateEnum("tilt_calibration", tilt_calibration, ["no", "yes"]);
    if (tilt_calibration === "no") return [];
    return [0xff, 0xa5];
}

function setSensorConvergence(sensor_convergence) {
    validateEnum("sensor_convergence", sensor_convergence, ["no", "yes"]);
    if (sensor_convergence === "no") return [];
    return [0xff, 0xa6];
}

function readEnableValue(key, value) {
    validateEnable(key, value);
    return getValue({ 0: "disable", 1: "enable" }, value);
}

function validateEnable(key, value) {
    validateEnum(key, value, ["disable", "enable"]);
}

function validateEnum(key, value, candidates) {
    if (candidates.indexOf(value) === -1) {
        throw new Error(key + " must be one of " + candidates.join(", "));
    }
}

function validateRange(key, value, min, max) {
    if (typeof value !== "number" || value < min || value > max) {
        throw new Error(key + " must be in range [" + min + ", " + max + "]");
    }
}

function validateUInt16(key, value) {
    validateRange(key, value, 0, 0xffff);
}

function validateUInt32(key, value) {
    validateRange(key, value, 0, 0xffffffff);
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

Buffer.prototype._write = function (value, byte_length, is_little_endian) {
    var offset = 0;
    for (var index = 0; index < byte_length; index++) {
        offset = is_little_endian ? index << 3 : (byte_length - 1 - index) << 3;
        this.buffer[this.offset + index] = (value >> offset) & 0xff;
    }
};

Buffer.prototype.writeUInt8 = function (value) {
    this._write(value, 1, true);
    this.offset += 1;
};

Buffer.prototype.writeUInt16LE = function (value) {
    this._write(value, 2, true);
    this.offset += 2;
};

Buffer.prototype.writeUInt32LE = function (value) {
    this._write(value, 4, true);
    this.offset += 4;
};

Buffer.prototype.toBytes = function () {
    return this.buffer;
};
