/**
 * Payload Encoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product WT101
 */
var RAW_VALUE = 0x01;

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

function milesightDeviceEncode(payload) {
    var encoded = [];

    if ("reboot" in payload) {
        encoded = encoded.concat(reboot(payload.reboot));
    }
    if ("report_status" in payload) {
        encoded = encoded.concat(reportStatus(payload.report_status));
    }
    if ("report_heating_date" in payload) {
        encoded = encoded.concat(reportHeatingDate(payload.report_heating_date));
    }
    if ("report_heating_schedule" in payload) {
        encoded = encoded.concat(reportHeatingSchedule(payload.report_heating_schedule));
    }
    if ("sync_time" in payload) {
        encoded = encoded.concat(syncTime(payload.sync_time));
    }
    if ("report_interval" in payload) {
        encoded = encoded.concat(setReportInterval(payload.report_interval));
    }
    if ("timezone" in payload) {
        encoded = encoded.concat(setTimeZone(payload.timezone));
    }
    if ("time_sync_enable" in payload) {
        encoded = encoded.concat(setTimeSyncEnable(payload.time_sync_enable));
    }
    if ("temperature_calibration" in payload) {
        encoded = encoded.concat(setTemperatureCalibration(payload.temperature_calibration.enable, payload.temperature_calibration.temperature));
    }
    if ("temperature_control" in payload && "enable" in payload.temperature_control) {
        encoded = encoded.concat(setTemperatureControl(payload.temperature_control.enable));
    }
    if ("temperature_control" in payload && "mode" in payload.temperature_control) {
        encoded = encoded.concat(setTemperatureControlMode(payload.temperature_control.mode));
    }
    if ("target_temperature" in payload) {
        encoded = encoded.concat(setTargetTemperature(payload.target_temperature, payload.temperature_tolerance));
    }
    if ("target_temperature_range" in payload) {
        encoded = encoded.concat(setTargetTemperatureRange(payload.target_temperature_range.min, payload.target_temperature_range.max));
    }
    if ("open_window_detection" in payload) {
        encoded = encoded.concat(setOpenWindowDetection(payload.open_window_detection.enable, payload.open_window_detection.temperature_threshold, payload.open_window_detection.time));
    }
    if ("restore_open_window_detection" in payload) {
        encoded = encoded.concat(restoreOpenWindowDetection(payload.restore_open_window_detection));
    }
    if ("valve_opening" in payload) {
        encoded = encoded.concat(setValveOpening(payload.valve_opening));
    }
    if ("valve_calibration" in payload) {
        encoded = encoded.concat(setValveCalibration(payload.valve_calibration));
    }
    if ("valve_control_algorithm" in payload) {
        encoded = encoded.concat(setValveControlAlgorithm(payload.valve_control_algorithm));
    }
    if ("freeze_protection_config" in payload) {
        encoded = encoded.concat(setFreezeProtection(payload.freeze_protection_config.enable, payload.freeze_protection_config.temperature));
    }
    if ("child_lock_config" in payload) {
        encoded = encoded.concat(setChildLockEnable(payload.child_lock_config.enable));
    }
    if ("offline_control_mode" in payload) {
        encoded = encoded.concat(setOfflineControlMode(payload.offline_control_mode));
    }
    if ("outside_temperature" in payload) {
        encoded = encoded.concat(setOutsideTemperature(payload.outside_temperature));
    }
    if ("outside_temperature_control" in payload) {
        encoded = encoded.concat(setOutsideTemperatureControl(payload.outside_temperature_control.enable, payload.outside_temperature_control.timeout));
    }
    if ("display_ambient_temperature" in payload) {
        encoded = encoded.concat(setDisplayAmbientTemperature(payload.display_ambient_temperature));
    }
    if ("window_detection_valve_strategy" in payload) {
        encoded = encoded.concat(setWindowDetectionValveStrategy(payload.window_detection_valve_strategy));
    }
    if ("dst_config" in payload) {
        encoded = encoded.concat(setDaylightSavingTime(payload.dst_config.enable, payload.dst_config.offset, payload.dst_config.start_month, payload.dst_config.start_week_num, payload.dst_config.start_week_day, payload.dst_config.start_time, payload.dst_config.end_month, payload.dst_config.end_week_num, payload.dst_config.end_week_day, payload.dst_config.end_time));
    }
    if ("effective_stroke" in payload) {
        encoded = encoded.concat(setEffectiveStroke(payload.effective_stroke.enable, payload.effective_stroke.rate));
    }
    if ("heating_date" in payload) {
        encoded = encoded.concat(setHeatingDate(payload.heating_date.enable, payload.heating_date.start_month, payload.heating_date.start_day, payload.heating_date.end_month, payload.heating_date.end_day, payload.heating_date.report_interval));
    }
    if ("heating_schedule" in payload) {
        for (var i = 0; i < payload.heating_schedule.length; i++) {
            var schedule = payload.heating_schedule[i];
            encoded = encoded.concat(setHeatingSchedule(schedule.index, schedule.enable, schedule.temperature_control_mode, schedule.value, schedule.report_interval, schedule.execute_time, schedule.week_recycle));
        }
    }
    if ("change_report_enable" in payload) {
        encoded = encoded.concat(setChangeReportEnable(payload.change_report_enable));
    }
    return encoded;
}

/**
 * device reboot
 * @param {number} reboot, values: (0: no, 1: yes)
 * @example { "reboot": 1 } output: FF10FF
 */
function reboot(reboot) {
    var reboot_map = { 0: "no", 1: "yes" };
    var reboot_values = getValues(reboot_map);
    if (reboot_values.indexOf(reboot) == -1) {
        throw new Error("reboot must be one of " + reboot_values.join(", "));
    }

    if (getValue(reboot_map, reboot) === 0) {
        return [];
    }
    return [0xff, 0x10, 0xff];
}

/**
 * sync time
 * @param {number} sync_time, values: (0: no, 1: yes)
 * @example { "sync_time": 1 } output: FF4AFF
 */
function syncTime(sync_time) {
    var sync_time_map = { 0: "no", 1: "yes" };
    var sync_time_values = getValues(sync_time_map);
    if (sync_time_values.indexOf(sync_time) === -1) {
        throw new Error("sync_time must be one of " + sync_time_values.join(", "));
    }

    if (sync_time === 0) {
        return [];
    }
    return [0xff, 0x4a, 0xff];
}

/**
 * report status
 * @param {number} report_status, values: (0: no, 1: yes)
 * @example { "report_status": 1 } output: FF2800
 */
function reportStatus(report_status) {
    var report_status_map = { 0: "no", 1: "yes" };
    var report_status_values = getValues(report_status_map);
    if (report_status_values.indexOf(report_status) == -1) {
        throw new Error("report_status must be one of " + report_status_values.join(", "));
    }

    if (getValue(report_status_map, report_status) === 0) {
        return [];
    }
    return [0xff, 0x28, 0x00];
}

/**
 * report heating date
 * @param {number} report_heating_date values: (0: no, 1: yes)
 * @example { "report_heating_date": 1 } output: FF2801
 */
function reportHeatingDate(report_heating_date) {
    var report_heating_date_map = { 0: "no", 1: "yes" };
    var report_heating_date_values = getValues(report_heating_date_map);
    if (report_heating_date_values.indexOf(report_heating_date) == -1) {
        throw new Error("report_heating_date must be one of " + report_heating_date_values.join(", "));
    }

    if (getValue(report_heating_date_map, report_heating_date) === 0) {
        return [];
    }
    return [0xff, 0x28, 0x01];
}

/**
 * report heating schedule
 * @param {number} report_heating_schedule values: (0: no, 1: yes)
 * @example { "report_heating_schedule": 1 } output: FF2802
 */
function reportHeatingSchedule(report_heating_schedule) {
    var report_heating_schedule_map = { 0: "no", 1: "yes" };
    var report_heating_schedule_values = getValues(report_heating_schedule_map);
    if (report_heating_schedule_values.indexOf(report_heating_schedule) == -1) {
        throw new Error("report_heating_schedule must be one of " + report_heating_schedule_values.join(", "));
    }

    if (getValue(report_heating_schedule_map, report_heating_schedule) === 0) {
        return [];
    }
    return [0xff, 0x28, 0x02];
}

/**
 * report interval configuration
 * @param {number} report_interval uint: minute, range: [1, 1440]
 * @example { "report_interval": 10 } output: FF8E000A00
 */
function setReportInterval(report_interval) {
    if (typeof report_interval !== "number") {
        throw new Error("report_interval must be a number");
    }
    if (report_interval < 1 || report_interval > 1440) {
        throw new Error("report_interval must be between 1 and 1440");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x8e);
    buffer.writeUInt8(0x00);
    buffer.writeUInt16LE(report_interval);
    return buffer.toBytes();
}

/**
 * time sync configuration
 * @param {number} time_sync_enable values: (0: disable, 1: enable)
 * @example { "time_sync_enable": 0 } output: FF3B00
 */
function setTimeSyncEnable(time_sync_enable) {
    var time_sync_enable_map = { 0: "disable", 1: "enable" };
    var time_sync_enable_values = getValues(time_sync_enable_map);
    if (time_sync_enable_values.indexOf(time_sync_enable) == -1) {
        throw new Error("time_sync_enable must be one of " + time_sync_enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x3b);
    buffer.writeUInt8(getValue(time_sync_enable_map, time_sync_enable));
    return buffer.toBytes();
}

/**
 * temperature calibration configuration
 * @param {number} enable values: (0: disable, 1: enable)
 * @param {number} temperature uint: Celsius
 * @example { "temperature_calibration": { "enable": 1, "temperature": 5 } } output: FFAB013200
 * @example { "temperature_calibration": { "enable": 1, "temperature": -5 } } output: FFAB01CEFF
 * @example { "temperature_calibration": { "enable": 0 } } output: FFAB000000
 */
function setTemperatureCalibration(enable, temperature) {
    var temperature_calibration_enable_map = { 0: "disable", 1: "enable" };
    var temperature_calibration_enable_values = getValues(temperature_calibration_enable_map);
    if (temperature_calibration_enable_values.indexOf(enable) == -1) {
        throw new Error("temperature_calibration.enable must be one of " + temperature_calibration_enable_values.join(", "));
    }
    if (enable && typeof temperature !== "number") {
        throw new Error("temperature_calibration.temperature must be a number");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xab);
    buffer.writeUInt8(getValue(temperature_calibration_enable_map, enable));
    buffer.writeInt16LE(temperature * 10);
    return buffer.toBytes();
}

/**
 * temperature control enable configuration
 * @param {number} enable values: (0: disable, 1: enable)
 * @example { "temperature_control": { "enable": 1 } } output: FFB301
 */
function setTemperatureControl(enable) {
    var temperature_control_enable_map = { 0: "disable", 1: "enable" };
    var temperature_control_enable_values = getValues(temperature_control_enable_map);
    if (temperature_control_enable_values.indexOf(enable) == -1) {
        throw new Error("temperature_control.enable must be one of " + temperature_control_enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xb3);
    buffer.writeUInt8(getValue(temperature_control_enable_map, enable));
    return buffer.toBytes();
}

/**
 * temperature control mode configuration
 * @param {number} mode, values: (0: auto, 1: manual)
 * @example { "temperature_control": { "mode": 0 } } output: FFAE00
 * @example { "temperature_control": { "mode": 1 } } output: FFAE01
 */
function setTemperatureControlMode(mode) {
    var temperature_control_mode_map = { 0: "auto", 1: "manual" };
    var temperature_control_mode_values = getValues(temperature_control_mode_map);
    if (temperature_control_mode_values.indexOf(mode) == -1) {
        throw new Error("temperature_control.mode must be one of " + temperature_control_mode_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xae);
    buffer.writeUInt8(getValue(temperature_control_mode_map, mode));
    return buffer.toBytes();
}

/**
 * temperature target configuration
 * @param {number} target_temperature uint: Celsius
 * @param {number} temperature_tolerance uint: Celsius
 * @example { "target_temperature": 10, "temperature_tolerance": 0.1 } output: FFB10A0100
 * @example { "target_temperature": 28, "temperature_tolerance": 5 } output: FFB11C3200
 */
function setTargetTemperature(target_temperature, temperature_tolerance) {
    if (typeof target_temperature !== "number") {
        throw new Error("target_temperature must be a number");
    }
    if (typeof temperature_tolerance !== "number") {
        throw new Error("temperature_tolerance must be a number");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xb1);
    buffer.writeInt8(target_temperature);
    buffer.writeUInt16LE(temperature_tolerance * 10);
    return buffer.toBytes();
}

/**
 * set target temperature range
 * @since v1.3
 * @param {number} min unit: Celsius, range: [5, 15]
 * @param {number} max unit: Celsius, range: [16, 35]
 * @example { "target_temperature_range": { "min": 5, "max": 16 } } output: F9350510
 */
function setTemperatureTargetRange(min, max) {
    if (typeof min !== "number") {
        throw new Error("target_temperature_range.min must be a number");
    }
    if (min < 5 || min > 15) {
        throw new Error("target_temperature_range.min must be between 5 and 15");
    }
    if (typeof max !== "number") {
        throw new Error("target_temperature_range.max must be a number");
    }
    if (max < 16 || max > 35) {
        throw new Error("target_temperature_range.max must be between 16 and 35");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x35);
    buffer.writeUInt8(min);
    buffer.writeUInt8(max);
    return buffer.toBytes();
}

/**
 * open window detection configuration
 * @param {number} enable, values: (0: disable, 1: enable)
 * @param {number} temperature_threshold uint: Celsius
 * @param {number} time uint: minute
 * @example { "open_window_detection": { "enable": 1, "temperature_threshold": 2, "time": 1 } } output: FFAF01140100
 * @example { "open_window_detection": { "enable": 1, "temperature_threshold": 10, "time": 1440 } } output: FFAF0164A005
 * @example { "open_window_detection": { "enable": 0 } } output: FFAF00000000
 */
function setOpenWindowDetection(enable, temperature_threshold, time) {
    var open_window_detection_enable_map = { 0: "disable", 1: "enable" };
    var open_window_detection_enable_values = getValues(open_window_detection_enable_map);
    if (open_window_detection_enable_values.indexOf(enable) == -1) {
        throw new Error("open_window_detection.enable must be one of " + open_window_detection_enable_values.join(", "));
    }
    if (enable && typeof temperature_threshold !== "number") {
        throw new Error("open_window_detection.temperature_threshold must be a number");
    }
    if (enable && typeof time !== "number") {
        throw new Error("open_window_detection.time must be a number");
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xaf);
    buffer.writeUInt8(getValue(open_window_detection_enable_map, enable));
    buffer.writeInt8(temperature_threshold * 10);
    buffer.writeUInt16LE(time);
    return buffer.toBytes();
}

/**
 * restore open window detection status
 * @param {number} restore_open_window_detection values: (0: no, 1: yes)
 * @example { "restore_open_window_detection": 1 } output: FF57FF
 */
function restoreOpenWindowDetection(restore_open_window_detection) {
    var restore_open_window_detection_map = { 0: "no", 1: "yes" };
    var restore_open_window_detection_values = getValues(restore_open_window_detection_map);
    if (restore_open_window_detection_values.indexOf(restore_open_window_detection) == -1) {
        throw new Error("restore_open_window_detection must be one of " + restore_open_window_detection_values.join(", "));
    }

    if (getValue(restore_open_window_detection_map, restore_open_window_detection) === 0) {
        return [];
    }
    return [0xff, 0x57, 0xff];
}

/**
 * valve opening configuration
 * @param {number} valve_opening uint: percentage, range: [0, 100]
 * @example { "valve_opening": 50 } output: FFB432
 */
function setValveOpening(valve_opening) {
    if (typeof valve_opening !== "number") {
        throw new Error("valve_opening must be a number");
    }
    if (valve_opening < 0 || valve_opening > 100) {
        throw new Error("valve_opening must be between 0 and 100");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xb4);
    buffer.writeUInt8(valve_opening);
    return buffer.toBytes();
}

/**
 * valve calibration
 * @param {number} valve_calibration values: (0: no, 1: yes)
 * @example { "valve_calibration": 1 } output: FFADFF
 */
function setValveCalibration(valve_calibration) {
    var valve_calibration_map = { 0: "no", 1: "yes" };
    var valve_calibration_values = getValues(valve_calibration_map);
    if (valve_calibration_values.indexOf(valve_calibration) == -1) {
        throw new Error("valve_calibration must be one of " + valve_calibration_values.join(", "));
    }

    if (getValue(valve_calibration_map, valve_calibration) === 0) {
        return [];
    }
    return [0xff, 0xad, 0xff];
}

/**
 * valve control algorithm
 * @param {number} valve_control_algorithm values: (0: rate, 1: pid)
 * @example { "valve_control_algorithm": 0 } output: FFAC00
 */
function setValveControlAlgorithm(valve_control_algorithm) {
    var valve_control_algorithm_map = { 0: "rate", 1: "pid" };
    var valve_control_algorithm_values = getValues(valve_control_algorithm_map);
    if (valve_control_algorithm_values.indexOf(valve_control_algorithm) == -1) {
        throw new Error("valve_control_algorithm must be one of " + valve_control_algorithm_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xac);
    buffer.writeUInt8(getValue(valve_control_algorithm_map, valve_control_algorithm));
    return buffer.toBytes();
}

/**
 * freeze protection configuration
 * @param {number} enable values: (0: disable, 1: enable)
 * @param {number} temperature uint: Celsius
 * @example { "freeze_protection_config": { "enable": 1, "temperature": 5 } } output: FFB0013200
 * @example { "freeze_protection_config": { "enable": 0 } } output: FFB0000000
 */
function setFreezeProtection(enable, temperature) {
    var freeze_protection_enable_map = { 0: "disable", 1: "enable" };
    var freeze_protection_enable_values = getValues(freeze_protection_enable_map);
    if (freeze_protection_enable_values.indexOf(enable) == -1) {
        throw new Error("freeze_protection_config.enable must be one of " + freeze_protection_enable_values.join(", "));
    }
    if (enable && typeof temperature !== "number") {
        throw new Error("freeze_protection_config.temperature must be a number");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xb0);
    buffer.writeUInt8(enable);
    buffer.writeInt16LE(temperature * 10);
    return buffer.toBytes();
}

/**
 * child lock configuration
 * @param {number} enable values: (0: disable, 1: enable)
 * @example { "child_lock_config": { "enable": 1 } } output: FF2501
 */
function setChildLockEnable(enable) {
    var child_lock_enable_map = { 0: "disable", 1: "enable" };
    var child_lock_enable_values = getValues(child_lock_enable_map);
    if (child_lock_enable_values.indexOf(enable) == -1) {
        throw new Error("child_lock_config.enable must be one of " + child_lock_enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x25);
    buffer.writeUInt8(getValue(child_lock_enable_map, enable));
    return buffer.toBytes();
}

/**
 * offline control mode configuration
 * @since v1.3
 * @param {number} offline_control_mode values: (0: keep, 1: embedded temperature control, 2: off)
 * @example { "offline_control_mode": 0 } output: FFF800
 */
function setOfflineControlMode(offline_control_mode) {
    var offline_control_mode_map = { 0: "keep", 1: "embedded temperature control", 2: "off" };
    var offline_control_mode_values = getValues(offline_control_mode_map);
    if (offline_control_mode_values.indexOf(offline_control_mode) === -1) {
        throw new Error("offline_control_mode must be one of " + offline_control_mode_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xf8);
    buffer.writeUInt8(getValue(offline_control_mode_map, offline_control_mode));
    return buffer.toBytes();
}

/**
 * set outside temperature
 * @since v1.3
 * @param {number} outside_temperature, unit: celsius
 * @example { "outside_temperature": 25 } output: 03FA00FF
 */
function setOutsideTemperature(outside_temperature) {
    if (typeof outside_temperature !== "number") {
        throw new Error("outside_temperature must be a number");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0x03);
    buffer.writeInt16LE(outside_temperature * 10);
    buffer.writeUInt8(0xff);
    return buffer.toBytes();
}

/**
 * set outside temperature control
 * @since v1.3
 * @param {number} enable values: (0: disable, 1: enable)
 * @param {number} timeout, unit: minute, range: [3, 60]
 * @example { "outside_temperature_control": { "enable": 1, "timeout": 10 } } output: FFC4010A
 */
function setOutsideTemperatureControl(enable, timeout) {
    var outside_temperature_control_enable_map = { 0: "disable", 1: "enable" };
    var outside_temperature_control_enable_values = getValues(outside_temperature_control_enable_map);
    if (outside_temperature_control_enable_values.indexOf(enable) === -1) {
        throw new Error("outside_temperature_control.enable must be one of " + outside_temperature_control_enable_values.join(", "));
    }
    if (enable && typeof timeout !== "number") {
        throw new Error("outside_temperature_control.timeout must be a number");
    }
    if (enable && (timeout < 3 || timeout > 60)) {
        throw new Error("outside_temperature_control.timeout must be between 3 and 60");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xc4);
    buffer.writeUInt8(enable);
    buffer.writeUInt8(timeout);
    return buffer.toBytes();
}

/**
 * set display ambient temperature
 * @since v1.3
 * @param {number} display_ambient_temperature values: (0: disable, 1: enable)
 * @example { "display_ambient_temperature": 1 } output: F93601
 */
function setDisplayAmbientTemperature(display_ambient_temperature) {
    var display_ambient_temperature_map = { 0: "disable", 1: "enable" };
    var display_ambient_temperature_values = getValues(display_ambient_temperature_map);
    if (display_ambient_temperature_values.indexOf(display_ambient_temperature) === -1) {
        throw new Error("display_ambient_temperature must be one of " + display_ambient_temperature_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x36);
    buffer.writeUInt8(getValue(display_ambient_temperature_map, display_ambient_temperature));
    return buffer.toBytes();
}

/**
 * set window detection valve strategy
 * @since v1.3
 * @param {number} window_detection_valve_strategy values: (0: keep, 1: close)
 * @example { "window_detection_valve_strategy": 0 } output: F93700
 */
function setWindowDetectionValveStrategy(window_detection_valve_strategy) {
    var window_detection_valve_strategy_map = { 0: "keep", 1: "close" };
    var window_detection_valve_strategy_values = getValues(window_detection_valve_strategy_map);
    if (window_detection_valve_strategy_values.indexOf(window_detection_valve_strategy) === -1) {
        throw new Error("window_detection_valve_strategy must be one of " + window_detection_valve_strategy_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x37);
    buffer.writeUInt8(getValue(window_detection_valve_strategy_map, window_detection_valve_strategy));
    return buffer.toBytes();
}

/**
 * set daylight saving time
 * @since v1.3
 * @param {number} enable values: (0: disable, 1: enable)
 * @param {number} offset, unit: minute
 * @param {number} start_month, values: (1: January, 2: February, 3: March, 4: April, 5: May, 6: June, 7: July, 8: August, 9: September, 10: October, 11: November, 12: December)
 * @param {number} start_week_num, range: [1, 5]
 * @param {number} start_week_day, range: [1, 7]
 * @param {number} start_time, unit: minute, convert: "hh:mm" -> "hh * 60 + mm"
 * @param {number} end_month, values: (1: January, 2: February, 3: March, 4: April, 5: May, 6: June, 7: July, 8: August, 9: September, 10: October, 11: November, 12: December)
 * @param {number} end_week_num, range: [1, 5]
 * @param {number} end_week_day, range: [1, 7]
 * @param {number} end_time, unit: minute, convert: "hh:mm" -> "hh * 60 + mm"
 * @example { "dst_config": { "enable": 1, "offset": 60, "start_month": 3, "start_week_num": 2, "start_week_day": 7, "start_time": 120, "end_month": 1, "end_week_num": 4, "end_week_day": 1, "end_time": 180 } } output: FFBA013C032778000141B400
 */
function setDaylightSavingTime(enable, offset, start_month, start_week_num, start_week_day, start_time, end_month, end_week_num, end_week_day, end_time) {
    var dst_config_enable_map = { 0: "disable", 1: "enable" };
    var dst_config_enable_values = getValues(dst_config_enable_map);
    if (dst_config_enable_values.indexOf(enable) === -1) {
        throw new Error("dst_config.enable must be one of " + dst_config_enable_values.join(", "));
    }
    var month_map = { 1: "January", 2: "February", 3: "March", 4: "April", 5: "May", 6: "June", 7: "July", 8: "August", 9: "September", 10: "October", 11: "November", 12: "December" };
    var month_values = getValues(month_map);
    if (enable && month_values.indexOf(start_month) === -1) {
        throw new Error("dst_config.start_month must be one of " + month_values.join(", "));
    }
    if (enable && month_values.indexOf(end_month) === -1) {
        throw new Error("dst_config.end_month must be one of " + month_values.join(", "));
    }
    var week_map = { 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday", 7: "Sunday" };
    var week_values = getValues(week_map);
    if (enable && week_values.indexOf(start_week_day) === -1) {
        throw new Error("dst_config.start_week_day must be one of " + week_values.join(", "));
    }

    var buffer = new Buffer(12);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xba);
    buffer.writeUInt8(getValue(dst_config_enable_map, enable));
    buffer.writeInt8(offset);
    buffer.writeUInt8(getValue(month_map, start_month));
    buffer.writeUInt8((start_week_num << 4) | getValue(week_map, start_week_day));
    buffer.writeUInt16LE(start_time);
    buffer.writeUInt8(getValue(month_map, end_month));
    buffer.writeUInt8((end_week_num << 4) | getValue(week_map, end_week_day));
    buffer.writeUInt16LE(end_time);
    return buffer.toBytes();
}

/**
 * set timezone
 * @since v1.3
 * @param {number} timezone unit: minute, convert: "hh:mm" -> "hh * 60 + mm", values: ( -720: UTC-12, -660: UTC-11, -600: UTC-10, -570: UTC-9:30, -540: UTC-9, -480: UTC-8, -420: UTC-7, -360: UTC-6, -300: UTC-5, -240: UTC-4, -210: UTC-3:30, -180: UTC-3, -120: UTC-2, -60: UTC-1, 0: UTC, 60: UTC+1, 120: UTC+2, 180: UTC+3, 240: UTC+4, 300: UTC+5, 360: UTC+6, 420: UTC+7, 480: UTC+8, 540: UTC+9, 570: UTC+9:30, 600: UTC+10, 660: UTC+11, 720: UTC+12, 750: UTC+12:45, 780: UTC+13, 840: UTC+14 )
 * @example { "timezone": 480 } output: FFBDE001
 * @example { "timezone": -480 } output: FFBD20FE
 */
function setTimeZone(timezone) {
    var timezone_map = { "-720": "UTC-12", "-660": "UTC-11", "-600": "UTC-10", "-570": "UTC-9:30", "-540": "UTC-9", "-480": "UTC-8", "-420": "UTC-7", "-360": "UTC-6", "-300": "UTC-5", "-240": "UTC-4", "-210": "UTC-3:30", "-180": "UTC-3", "-120": "UTC-2", "-60": "UTC-1", 0: "UTC", 60: "UTC+1", 120: "UTC+2", 180: "UTC+3", 210: "UTC+3:30", 240: "UTC+4", 270: "UTC+4:30", 300: "UTC+5", 330: "UTC+5:30", 345: "UTC+5:45", 360: "UTC+6", 390: "UTC+6:30", 420: "UTC+7", 480: "UTC+8", 540: "UTC+9", 570: "UTC+9:30", 600: "UTC+10", 630: "UTC+10:30", 660: "UTC+11", 720: "UTC+12", 750: "UTC+12:45", 780: "UTC+13", 840: "UTC+14" };
    var timezone_values = getValues(timezone_map);
    if (timezone_values.indexOf(timezone) === -1) {
        throw new Error("timezone must be one of " + timezone_values.join(", "));
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xbd);
    buffer.writeInt16LE(getValue(timezone_map, timezone));
    return buffer.toBytes();
}

/**
 * set effective stroke rate
 * @since v1.3
 * @param {number} enable values: (0: disable, 1: enable)
 * @param {number} rate range: [0, 100]
 * @example { "effective_stroke": { "enable": 1, "rate": 50 } } output: F9380132
 */
function setEffectiveStroke(enable, rate) {
    var effective_stroke_enable_map = { 0: "disable", 1: "enable" };
    var effective_stroke_enable_values = getValues(effective_stroke_enable_map);
    if (effective_stroke_enable_values.indexOf(enable) === -1) {
        throw new Error("effective_stroke.enable must be one of " + effective_stroke_enable_values.join(", "));
    }
    if (enable && (rate < 0 || rate > 100)) {
        throw new Error("effective_stroke.rate must be between 0 and 100");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x38);
    buffer.writeUInt8(getValue(effective_stroke_enable_map, enable));
    buffer.writeUInt8(rate);
    return buffer.toBytes();
}

/**
 * set heating date
 * @since v1.3
 * @param {number} enable values: (0: disable, 1: enable)
 * @param {number} start_month values: (1: January, 2: February, 3: March, 4: April, 5: May, 6: June, 7: July, 8: August, 9: September, 10: October, 11: November, 12: December)
 * @param {number} start_day values: [1, 31]
 * @param {number} end_month values: (1: January, 2: February, 3: March, 4: April, 5: May, 6: June, 7: July, 8: August, 9: September, 10: October, 11: November, 12: December)
 * @param {number} end_day values: [1, 31]
 * @param {number} report_interval unit: minute
 * @example { "heating_date": { "enable": 1, "start_month": 10, "start_day": 1, "end_month": 4, "end_day": 30, "report_interval": 720 } } output: F93301D0020A01041E
 */
function setHeatingDate(enable, start_month, start_day, end_month, end_day, report_interval) {
    var heating_date_enable_map = { 0: "disable", 1: "enable" };
    var heating_date_enable_values = getValues(heating_date_enable_map);
    if (heating_date_enable_values.indexOf(enable) === -1) {
        throw new Error("heating_date.enable must be one of " + heating_date_enable_values.join(", "));
    }
    var month_map = { 1: "January", 2: "February", 3: "March", 4: "April", 5: "May", 6: "June", 7: "July", 8: "August", 9: "September", 10: "October", 11: "November", 12: "December" };
    var month_values = getValues(month_map);
    if (enable && month_values.indexOf(start_month) === -1) {
        throw new Error("heating_date.start_month must be one of " + month_values.join(", "));
    }
    if (enable && month_values.indexOf(end_month) === -1) {
        throw new Error("heating_date.end_month must be one of " + month_values.join(", "));
    }

    var buffer = new Buffer(9);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x33);
    buffer.writeUInt8(getValue(heating_date_enable_map, enable));
    buffer.writeUInt16LE(report_interval);
    buffer.writeUInt8(getValue(month_map, start_month));
    buffer.writeUInt8(start_day);
    buffer.writeUInt8(getValue(month_map, end_month));
    buffer.writeUInt8(end_day);
    return buffer.toBytes();
}

/**
 * set heating schedule
 * @since v1.3
 * @param {number} index range: [1, 16]
 * @param {number} enable values: (0: disable, 1: enable)
 * @param {number} temperature_control_mode values: (0: auto, 1: manual)
 * @param {number} value temperature_control_mode=0, value means target_temperature, temperature_control_mode=1, value means valve_opening
 * @param {number} report_interval unit: minute
 * @param {number} execute_time unit: minute, convert: "hh:mm" -> "hh * 60 + mm"
 * @param {Array} week_recycle values: (1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday, 7: Sunday)
 * @example { "heating_schedule": [{ "index": 1, "enable": 1, "temperature_control_mode": 0, "value": 20, "report_interval": 10, "execute_time": 480, "week_recycle": [1, 2, 3, 4, 5] }] } output: F934000100140A00E0011F
 */
function setHeatingSchedule(index, enable, temperature_control_mode, value, report_interval, execute_time, week_recycle) {
    if (index < 1 || index > 16) {
        throw new Error("heating_schedule._item.index must be between 1 and 16");
    }
    var heating_schedule_enable_map = { 0: "disable", 1: "enable" };
    var heating_schedule_enable_values = getValues(heating_schedule_enable_map);
    if (heating_schedule_enable_values.indexOf(enable) === -1) {
        throw new Error("heating_schedule._item.enable must be one of " + heating_schedule_enable_values.join(", "));
    }
    var heating_schedule_temperature_control_mode_map = { 0: "auto", 1: "manual" };
    var heating_schedule_temperature_control_mode_values = getValues(heating_schedule_temperature_control_mode_map);
    if (heating_schedule_temperature_control_mode_values.indexOf(temperature_control_mode) === -1) {
        throw new Error("heating_schedule._item.temperature_control_mode must be one of " + heating_schedule_temperature_control_mode_values.join(", "));
    }
    if (enable && (report_interval < 1 || report_interval > 1440)) {
        throw new Error("heating_schedule._item.report_interval must be between 1 and 1440");
    }

    var week_map = { 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday", 7: "Sunday" };
    var week_recycle_values = getValues(week_map);
    if (Array.isArray(week_recycle) === false) {
        throw new Error("heating_schedule._item.week_recycle must be an array");
    }

    var days = 0x00;
    for (var i = 0; i < week_recycle.length; i++) {
        var day = week_recycle[i];
        if (week_recycle_values.indexOf(day) === -1) {
            throw new Error("heating_schedule._item.week_recycle must be one of " + week_recycle_values.join(", "));
        }
        var offset = week_recycle_values.indexOf(day);
        days |= 1 << offset;
    }

    var buffer = new Buffer(11);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x34);
    buffer.writeUInt8(index - 1);
    buffer.writeUInt8(getValue(heating_schedule_enable_map, enable));
    buffer.writeUInt8(getValue(heating_schedule_temperature_control_mode_map, temperature_control_mode));
    buffer.writeUInt8(value);
    buffer.writeUInt16LE(report_interval);
    buffer.writeUInt16LE(execute_time);
    buffer.writeUInt8(days);
    return buffer.toBytes();
}

/**
 * set change reportable.
 * @since v1.3
 * @description When the device status changes (target_temperature, valve_opening), the device will report the status to the server.
 * @param {number} change_report_enable values: (0: disable, 1: enable)
 * @example { "change_report_enable": 1 } output: F93A01
 */
function setChangeReportEnable(change_report_enable) {
    var change_report_enable_map = { 0: "disable", 1: "enable" };
    var change_report_enable_values = getValues(change_report_enable_map);
    if (change_report_enable_values.indexOf(change_report_enable) === -1) {
        throw new Error("change_report_enable must be one of " + change_report_enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x3a);
    buffer.writeUInt8(change_report_enable);
    return buffer.toBytes();
}

function getValues(map) {
    var values = [];
    if (RAW_VALUE) {
        for (var key in map) {
            values.push(parseInt(key));
        }
    } else {
        for (var key in map) {
            values.push(map[key]);
        }
    }
    return values;
}

function getValue(map, value) {
    if (RAW_VALUE) return value;

    for (var key in map) {
        if (map[key] === value) {
            return key;
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
