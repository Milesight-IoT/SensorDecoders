/**
 * Payload Encoder
 *
 * Copyright 2026 Milesight IoT
 *
 * @product WT103
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

    if ("reboot" in payload) {
        encoded = encoded.concat(reboot(payload.reboot));
    }
    if ("sync_time" in payload) {
        encoded = encoded.concat(syncTime(payload.sync_time));
    }
    if ("report_status" in payload) {
        encoded = encoded.concat(reportStatus(payload.report_status));
    }
    if ("valve_descale" in payload) {
        encoded = encoded.concat(triggerValveDescale(payload.valve_descale));
    }
    if ("open_window_status" in payload) {
        encoded = encoded.concat(setOpenWindowStatus(payload.open_window_status));
    }
    if ("valve_calibration" in payload) {
        encoded = encoded.concat(triggerValveCalibration(payload.valve_calibration));
    }
    if ("outside_temperature" in payload) {
        encoded = encoded.concat(setOutsideTemperature(payload.outside_temperature));
    }
    if ("reset" in payload) {
        encoded = encoded.concat(reset(payload.reset));
    }
    if ("time_sync_enable" in payload) {
        encoded = encoded.concat(setTimeSyncEnable(payload.time_sync_enable));
    }
    if ("report_interval" in payload) {
        encoded = encoded.concat(setReportInterval(payload.report_interval));
    }
    if ("temperature_control_mode" in payload) {
        encoded = encoded.concat(setTemperatureControlMode(payload.temperature_control_mode));
    }
    if ("temperature_calibration" in payload) {
        encoded = encoded.concat(setTemperatureCalibration(payload.temperature_calibration));
    }
    if ("temperature_threshold_alarm" in payload) {
        encoded = encoded.concat(setTemperatureThresholdAlarm(payload.temperature_threshold_alarm));
    }
    if ("target_temperature" in payload) {
        encoded = encoded.concat(setTargetTemperature(payload.target_temperature));
    }
    if ("temperature_control_algorithm" in payload) {
        encoded = encoded.concat(setTemperatureControlAlgorithm(payload.temperature_control_algorithm));
    }
    if ("freeze_protection" in payload) {
        encoded = encoded.concat(setFreezeProtection(payload.freeze_protection));
    }
    if ("open_window_detection" in payload) {
        encoded = encoded.concat(setOpenWindowDetection(payload.open_window_detection));
    }
    if ("temperature_control_enable" in payload) {
        encoded = encoded.concat(setTemperatureControlEnable(payload.temperature_control_enable));
    }
    if ("valve_opening" in payload) {
        encoded = encoded.concat(setValveOpening(payload.valve_opening));
    }
    if ("child_lock" in payload) {
        encoded = encoded.concat(setChildLock(payload.child_lock));
    }
    if ("outside_temperature_timeout_strategy" in payload) {
        encoded = encoded.concat(setOutsideTemperatureTimeoutStrategy(payload.outside_temperature_timeout_strategy));
    }
    if ("temperature_source" in payload) {
        encoded = encoded.concat(setTemperatureSource(payload.temperature_source));
    }
    if ("outside_temperature_timeout" in payload) {
        encoded = encoded.concat(setOutsideTemperatureTimeout(payload.outside_temperature_timeout));
    }
    if ("display_ambient_temperature" in payload) {
        encoded = encoded.concat(setDisplayAmbientTemperature(payload.display_ambient_temperature));
    }
    if ("open_window_valve_strategy" in payload) {
        encoded = encoded.concat(setOpenWindowValveStrategy(payload.open_window_valve_strategy));
    }
    if ("dst_config" in payload) {
        encoded = encoded.concat(setDaylightSavingTime(payload.dst_config));
    }
    if ("time_zone" in payload) {
        encoded = encoded.concat(setTimeZone(payload.time_zone));
    }
    if ("non_heating_report_interval" in payload) {
        encoded = encoded.concat(setNonHeatingReportInterval(payload.non_heating_report_interval));
    }
    if ("heating_date" in payload) {
        encoded = encoded.concat(setHeatingDate(payload.heating_date));
    }
    if ("heating_schedule" in payload) {
        for (var i = 0; i < payload.heating_schedule.length; i++) {
            encoded = encoded.concat(setHeatingSchedule(payload.heating_schedule[i]));
        }
    }
    if ("target_temperature_range" in payload) {
        encoded = encoded.concat(setTargetTemperatureRange(payload.target_temperature_range));
    }
    if ("change_report_enable" in payload) {
        encoded = encoded.concat(setChangeReportEnable(payload.change_report_enable));
    }
    if ("non_heating_valve_mode" in payload) {
        encoded = encoded.concat(setNonHeatingValveMode(payload.non_heating_valve_mode));
    }
    if ("valve_descale_enable" in payload) {
        encoded = encoded.concat(setValveDescaleEnable(payload.valve_descale_enable));
    }
    if ("installation_mode" in payload) {
        encoded = encoded.concat(setInstallationMode(payload.installation_mode));
    }
    if ("temperature_unit" in payload) {
        encoded = encoded.concat(setTemperatureUnit(payload.temperature_unit));
    }
    if ("ambient_temperature_display_time" in payload) {
        encoded = encoded.concat(setAmbientTemperatureDisplayTime(payload.ambient_temperature_display_time));
    }
    if ("platform_algorithm_timeout" in payload) {
        encoded = encoded.concat(setPlatformAlgorithmTimeout(payload.platform_algorithm_timeout));
    }
    if ("platform_algorithm_timeout_strategy" in payload) {
        encoded = encoded.concat(setPlatformAlgorithmTimeoutStrategy(payload.platform_algorithm_timeout_strategy));
    }
    if ("temperature_control_level_mapping" in payload) {
        encoded = encoded.concat(setTemperatureControlLevelMapping(payload.temperature_control_level_mapping));
    }
    if ("temperature_control_level" in payload) {
        encoded = encoded.concat(setTemperatureControlLevel(payload.temperature_control_level));
    }
    if ("temperature_control_level_display_time" in payload) {
        encoded = encoded.concat(setTemperatureControlLevelDisplayTime(payload.temperature_control_level_display_time));
    }
    if ("target_temperature_resolution" in payload) {
        encoded = encoded.concat(setTargetTemperatureResolution(payload.target_temperature_resolution));
    }
    if ("target_temperature_display_time" in payload) {
        encoded = encoded.concat(setTargetTemperatureDisplayTime(payload.target_temperature_display_time));
    }
    if ("open_window_status_timeout" in payload) {
        encoded = encoded.concat(setOpenWindowStatusTimeout(payload.open_window_status_timeout));
    }
    if ("valve_emergency_position" in payload) {
        encoded = encoded.concat(setValveEmergencyPosition(payload.valve_emergency_position));
    }
    if ("valve_opening_range" in payload) {
        encoded = encoded.concat(setValveOpeningRange(payload.valve_opening_range));
    }
    if ("predict_on_enable" in payload) {
        encoded = encoded.concat(setPredictOnEnable(payload.predict_on_enable));
    }
    if ("valve_opening_display_enable" in payload) {
        encoded = encoded.concat(setValveOpeningDisplayEnable(payload.valve_opening_display_enable));
    }
    if ("fixed_preheating_time" in payload) {
        encoded = encoded.concat(setFixedPreheatingTime(payload.fixed_preheating_time));
    }
    if ("system_key_enable" in payload) {
        encoded = encoded.concat(setSystemKeyEnable(payload.system_key_enable));
    }
    if ("heating_schedule_enable" in payload) {
        encoded = encoded.concat(setHeatingScheduleEnable(payload.heating_schedule_enable));
    }
    return encoded;
}

/**
 * device reboot
 * @since 3.1
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
 * immediate time synchronization
 * @since 3.2
 * @param {number} sync_time values: (0: no, 1: yes)
 * @example { "sync_time": 1 }
 */
function syncTime(sync_time) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(sync_time) === -1) {
        throw new Error("sync_time must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, sync_time) === 0) {
        return [];
    }
    return [0xff, 0x4a, 0xff];
}

/**
 * query device status
 * @since 3.3
 * @param {number} report_status values: (0: report a periodic packet immediately, 1: query heating date, 2: query heating schedule)
 * @example { "report_status": 0 }
 */
function reportStatus(report_status) {
    var status_map = { 0: "report a periodic packet immediately", 1: "query heating date", 2: "query heating schedule" };
    var status_values = getValues(status_map);
    if (status_values.indexOf(report_status) === -1) {
        throw new Error("report_status must be one of " + status_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x28);
    buffer.writeUInt8(getValue(status_map, report_status));
    return buffer.toBytes();
}

/**
 * trigger valve descale
 * @since 3.4
 * @param {number} valve_descale values: (0: no, 1: yes)
 * @description Device echoes 0xFE 0x29 0x00 once accepted; actual result is reported asynchronously on channel 0x84 (Valve Descale Result).
 * @example { "valve_descale": 1 }
 */
function triggerValveDescale(valve_descale) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(valve_descale) === -1) {
        throw new Error("valve_descale must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, valve_descale) === 0) {
        return [];
    }
    return [0xff, 0x29, 0x00];
}

/**
 * open window status configuration
 * @since 3.5
 * @param {number} open_window_status values: (0: clear open window, 1: trigger open window)
 * @example { "open_window_status": 0 }
 */
function setOpenWindowStatus(open_window_status) {
    var status_map = { 0: "clear open window", 1: "trigger open window" };
    var status_values = getValues(status_map);
    if (status_values.indexOf(open_window_status) === -1) {
        throw new Error("open_window_status must be one of " + status_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x57);
    buffer.writeUInt8(getValue(status_map, open_window_status));
    return buffer.toBytes();
}

/**
 * trigger motor stroke calibration
 * @since 3.6
 * @param {number} valve_calibration values: (0: no, 1: yes)
 * @example { "valve_calibration": 1 }
 */
function triggerValveCalibration(valve_calibration) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(valve_calibration) === -1) {
        throw new Error("valve_calibration must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, valve_calibration) === 0) {
        return [];
    }
    return [0xff, 0xad, 0xff];
}

/**
 * set current temperature (external temperature mode)
 * @since 3.7
 * @param {number} outside_temperature unit: Celsius
 * @example { "outside_temperature": 20 }
 */
function setOutsideTemperature(outside_temperature) {
    if (typeof outside_temperature !== "number") {
        throw new Error("outside_temperature must be a number");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0x03);
    buffer.writeInt16LE(Math.round(outside_temperature * 100));
    buffer.writeUInt8(0xff);
    return buffer.toBytes();
}

/**
 * device reset (restores factory defaults)
 * @since 3.8
 * @param {number} reset values: (0: no, 1: yes)
 * @description Clears network join info, user configuration, motor calibration data and temperature control runtime state. Different from reboot (3.1), which keeps configuration/calibration data.
 * @example { "reset": 1 }
 */
function reset(reset) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(reset) === -1) {
        throw new Error("reset must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, reset) === 0) {
        return [];
    }
    return [0xff, 0xfe, 0xff];
}

/**
 * time sync enable configuration
 * @since 2.1
 * @param {number} time_sync_enable values: (0: disable, 1: enable)
 * @example { "time_sync_enable": 1 }
 */
function setTimeSyncEnable(time_sync_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(time_sync_enable) === -1) {
        throw new Error("time_sync_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x3b);
    buffer.writeUInt8(getValue(enable_map, time_sync_enable) === 1 ? 0x02 : 0x00);
    return buffer.toBytes();
}

/**
 * report interval configuration
 * @since 2.2
 * @param {number} report_interval unit: minute, range: [1, 1440]
 * @example { "report_interval": 10 }
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
 * temperature control mode configuration
 * @since 2.3
 * @param {number} temperature_control_mode values: (0: 0-5 scale, 1: integrated control, 2: valve opening control)
 * @example { "temperature_control_mode": 0 }
 */
function setTemperatureControlMode(temperature_control_mode) {
    var mode_map = { 0: "0-5 scale", 1: "integrated control", 2: "valve opening control" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(temperature_control_mode) === -1) {
        throw new Error("temperature_control_mode must be one of " + mode_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xae);
    buffer.writeUInt8(getValue(mode_map, temperature_control_mode));
    return buffer.toBytes();
}

/**
 * ambient temperature calibration configuration
 * @since 2.4
 * @param {object} temperature_calibration
 * @param {number} temperature_calibration.enable values: (0: disable, 1: enable)
 * @param {number} temperature_calibration.value unit: Celsius
 * @example { "temperature_calibration": { "enable": 1, "value": 5 } }
 * @example { "temperature_calibration": { "enable": 1, "value": -5 } }
 * @example { "temperature_calibration": { "enable": 0 } }
 */
function setTemperatureCalibration(temperature_calibration) {
    var enable = temperature_calibration.enable;
    var value = temperature_calibration.value || 0;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("temperature_calibration.enable must be one of " + enable_values.join(", "));
    }
    if (enable && typeof value !== "number") {
        throw new Error("temperature_calibration.value must be a number");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xab);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeInt16LE(Math.round(value * 100));
    return buffer.toBytes();
}

/**
 * temperature threshold alarm configuration
 * @since 2.5
 * @param {object} temperature_threshold_alarm
 * @param {number} temperature_threshold_alarm.mode values: (0: disable, 1: below, 2: above, 3: within, 4: below or above)
 * @param {number} temperature_threshold_alarm.min unit: Celsius
 * @param {number} temperature_threshold_alarm.max unit: Celsius
 * @example { "temperature_threshold_alarm": { "mode": 1, "min": 5, "max": 30 } }
 */
function setTemperatureThresholdAlarm(temperature_threshold_alarm) {
    var mode = temperature_threshold_alarm.mode;
    var min = temperature_threshold_alarm.min || 0;
    var max = temperature_threshold_alarm.max || 0;

    var mode_map = { 0: "disable", 1: "below", 2: "above", 3: "within", 4: "below or above" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(mode) === -1) {
        throw new Error("temperature_threshold_alarm.mode must be one of " + mode_values.join(", "));
    }

    var ctrl = getValue(mode_map, mode) | (1 << 3);
    var buffer = new Buffer(11);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x06);
    buffer.writeUInt8(ctrl);
    buffer.writeInt16LE(Math.round(min * 100));
    buffer.writeInt16LE(Math.round(max * 100));
    buffer.writeUInt16LE(0);
    buffer.writeUInt16LE(0);
    return buffer.toBytes();
}

/**
 * target temperature configuration
 * @since 2.6
 * @param {number} target_temperature unit: Celsius
 * @example { "target_temperature": 20 }
 */
function setTargetTemperature(target_temperature) {
    if (typeof target_temperature !== "number") {
        throw new Error("target_temperature must be a number");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xb1);
    buffer.writeInt16LE(Math.round(target_temperature * 100));
    return buffer.toBytes();
}

/**
 * temperature control algorithm configuration
 * @since 2.7
 * @param {number} temperature_control_algorithm values: (0: pid, 1: platform)
 * @example { "temperature_control_algorithm": 1 }
 */
function setTemperatureControlAlgorithm(temperature_control_algorithm) {
    var algorithm_map = { 0: "pid", 1: "platform" };
    var algorithm_values = getValues(algorithm_map);
    if (algorithm_values.indexOf(temperature_control_algorithm) === -1) {
        throw new Error("temperature_control_algorithm must be one of " + algorithm_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xac);
    buffer.writeUInt8(getValue(algorithm_map, temperature_control_algorithm));
    return buffer.toBytes();
}

/**
 * freeze protection configuration
 * @since 2.8
 * @param {object} freeze_protection
 * @param {number} freeze_protection.enable values: (0: disable, 1: enable)
 * @param {number} freeze_protection.temperature unit: Celsius
 * @example { "freeze_protection": { "enable": 1, "temperature": 5 } }
 * @example { "freeze_protection": { "enable": 0 } }
 */
function setFreezeProtection(freeze_protection) {
    var enable = freeze_protection.enable;
    var temperature = freeze_protection.temperature || 0;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("freeze_protection.enable must be one of " + enable_values.join(", "));
    }
    if (enable && typeof temperature !== "number") {
        throw new Error("freeze_protection.temperature must be a number");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xb0);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeInt16LE(Math.round(temperature * 100));
    return buffer.toBytes();
}

/**
 * open window detection configuration
 * @since 2.9
 * @param {object} open_window_detection
 * @param {number} open_window_detection.enable values: (0: disable, 1: enable)
 * @param {number} open_window_detection.temperature_threshold unit: Celsius
 * @param {number} open_window_detection.time unit: minute
 * @example { "open_window_detection": { "enable": 1, "temperature_threshold": 2, "time": 1 } }
 * @example { "open_window_detection": { "enable": 0, "temperature_threshold": 5, "time": 60 } }
 */
function setOpenWindowDetection(open_window_detection) {
    var enable = open_window_detection.enable;
    var temperature_threshold = open_window_detection.temperature_threshold || 0;
    var time = open_window_detection.time || 0;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("open_window_detection.enable must be one of " + enable_values.join(", "));
    }
    if (typeof temperature_threshold !== "number") {
        throw new Error("open_window_detection.temperature_threshold must be a number");
    }
    if (typeof time !== "number") {
        throw new Error("open_window_detection.time must be a number");
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xaf);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeInt16LE(Math.round(temperature_threshold * 100));
    buffer.writeUInt16LE(time);
    return buffer.toBytes();
}

/**
 * temperature control enable configuration (master switch)
 * @since 2.10
 * @param {number} temperature_control_enable values: (0: disable, 1: enable)
 * @example { "temperature_control_enable": 1 }
 */
function setTemperatureControlEnable(temperature_control_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(temperature_control_enable) === -1) {
        throw new Error("temperature_control_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xb3);
    buffer.writeUInt8(getValue(enable_map, temperature_control_enable));
    return buffer.toBytes();
}

/**
 * valve opening configuration
 * @since 2.11
 * @param {number} valve_opening unit: percentage, range: [0, 100]
 * @example { "valve_opening": 50 }
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
 * child lock configuration
 * @since 2.12
 * @param {object} child_lock
 * @param {number} child_lock.enable values: (0: disable, 1: all keys locked, 2: temperature keys only, 3: system key only)
 * @example { "child_lock": { "enable": 1 } }
 */
function setChildLock(child_lock) {
    var enable = child_lock.enable;

    var enable_map = { 0: "disable", 1: "all keys locked", 2: "temperature keys only", 3: "system key only" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("child_lock.enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x25);
    buffer.writeUInt8(getValue(enable_map, enable));
    return buffer.toBytes();
}

/**
 * outside temperature timeout strategy configuration
 * @since 2.13
 * @param {number} outside_temperature_timeout_strategy values: (0: keep, 1: switch to internal temperature, 2: close valve)
 * @example { "outside_temperature_timeout_strategy": 1 }
 */
function setOutsideTemperatureTimeoutStrategy(outside_temperature_timeout_strategy) {
    var mode_map = { 0: "keep", 1: "switch to internal temperature", 2: "close valve" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(outside_temperature_timeout_strategy) === -1) {
        throw new Error("outside_temperature_timeout_strategy must be one of " + mode_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xf8);
    buffer.writeUInt8(getValue(mode_map, outside_temperature_timeout_strategy));
    return buffer.toBytes();
}

/**
 * temperature source configuration
 * @since 2.14
 * @param {number} temperature_source values: (0: embedded, 1: external)
 * @example { "temperature_source": 1 }
 */
function setTemperatureSource(temperature_source) {
    var source_map = { 0: "embedded", 1: "external" };
    var source_values = getValues(source_map);
    if (source_values.indexOf(temperature_source) === -1) {
        throw new Error("temperature_source must be one of " + source_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xc5);
    buffer.writeUInt8(getValue(source_map, temperature_source));
    return buffer.toBytes();
}

/**
 * outside temperature timeout configuration
 * @since 2.15
 * @param {number} outside_temperature_timeout unit: minute, range: [1, 1440]
 * @example { "outside_temperature_timeout": 30 }
 */
function setOutsideTemperatureTimeout(outside_temperature_timeout) {
    if (typeof outside_temperature_timeout !== "number") {
        throw new Error("outside_temperature_timeout must be a number");
    }
    if (outside_temperature_timeout < 1 || outside_temperature_timeout > 1440) {
        throw new Error("outside_temperature_timeout must be between 1 and 1440");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xc4);
    buffer.writeUInt16LE(outside_temperature_timeout);
    return buffer.toBytes();
}

/**
 * display ambient temperature on LED configuration
 * @since 2.16
 * @param {number} display_ambient_temperature values: (0: disable, 1: enable)
 * @example { "display_ambient_temperature": 1 }
 */
function setDisplayAmbientTemperature(display_ambient_temperature) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(display_ambient_temperature) === -1) {
        throw new Error("display_ambient_temperature must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x36);
    buffer.writeUInt8(getValue(enable_map, display_ambient_temperature));
    return buffer.toBytes();
}

/**
 * open window valve strategy configuration
 * @since 2.17
 * @param {number} open_window_valve_strategy values: (0: keep, 1: close)
 * @example { "open_window_valve_strategy": 1 }
 */
function setOpenWindowValveStrategy(open_window_valve_strategy) {
    var strategy_map = { 0: "keep", 1: "close" };
    var strategy_values = getValues(strategy_map);
    if (strategy_values.indexOf(open_window_valve_strategy) === -1) {
        throw new Error("open_window_valve_strategy must be one of " + strategy_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x37);
    buffer.writeUInt8(getValue(strategy_map, open_window_valve_strategy));
    return buffer.toBytes();
}

/**
 * daylight saving time configuration
 * @since 2.18
 * @param {object} dst_config
 * @param {number} dst_config.enable values: (0: disable, 1: enable)
 * @param {number} dst_config.offset unit: minute
 * @param {number} dst_config.start_month range: [1, 12]
 * @param {number} dst_config.start_week_num range: [1, 5]
 * @param {number} dst_config.start_week_day range: (1: Monday ... 7: Sunday)
 * @param {number} dst_config.start_time unit: minute, convert: "hh:mm" -> "hh * 60 + mm"
 * @param {number} dst_config.end_month range: [1, 12]
 * @param {number} dst_config.end_week_num range: [1, 5]
 * @param {number} dst_config.end_week_day range: (1: Monday ... 7: Sunday)
 * @param {number} dst_config.end_time unit: minute, convert: "hh:mm" -> "hh * 60 + mm"
 * @example { "dst_config": { "enable": 1, "offset": 60, "start_month": 3, "start_week_num": 2, "start_week_day": 7, "start_time": 120, "end_month": 1, "end_week_num": 4, "end_week_day": 1, "end_time": 120 } }
 */
function setDaylightSavingTime(dst_config) {
    var enable = dst_config.enable;
    var offset = dst_config.offset || 0;
    var start_month = dst_config.start_month;
    var start_week_num = dst_config.start_week_num;
    var start_week_day = dst_config.start_week_day;
    var start_time = dst_config.start_time;
    var end_month = dst_config.end_month;
    var end_week_num = dst_config.end_week_num;
    var end_week_day = dst_config.end_week_day;
    var end_time = dst_config.end_time;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("dst_config.enable must be one of " + enable_values.join(", "));
    }
    var month_values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    if (month_values.indexOf(start_month) === -1) {
        throw new Error("dst_config.start_month must be one of " + month_values.join(", "));
    }
    if (month_values.indexOf(end_month) === -1) {
        throw new Error("dst_config.end_month must be one of " + month_values.join(", "));
    }
    var week_day_values = [1, 2, 3, 4, 5, 6, 7];
    if (week_day_values.indexOf(start_week_day) === -1) {
        throw new Error("dst_config.start_week_day must be one of " + week_day_values.join(", "));
    }
    if (week_day_values.indexOf(end_week_day) === -1) {
        throw new Error("dst_config.end_week_day must be one of " + week_day_values.join(", "));
    }

    var buffer = new Buffer(12);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xba);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeInt8(offset);
    buffer.writeUInt8(start_month);
    buffer.writeUInt8((start_week_num << 4) | start_week_day);
    buffer.writeUInt16LE(start_time);
    buffer.writeUInt8(end_month);
    buffer.writeUInt8((end_week_num << 4) | end_week_day);
    buffer.writeUInt16LE(end_time);
    return buffer.toBytes();
}

/**
 * time zone configuration
 * @since 2.19
 * @param {number} time_zone unit: minute, convert: "hh:mm" -> "hh * 60 + mm"
 * @example { "time_zone": 480 }
 * @example { "time_zone": -240 }
 */
function setTimeZone(time_zone) {
    if (typeof time_zone !== "number") {
        throw new Error("time_zone must be a number");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xbd);
    buffer.writeInt16LE(time_zone);
    return buffer.toBytes();
}

/**
 * non-heating season report interval configuration
 * @since 2.20.1
 * @param {number} non_heating_report_interval unit: minute, range: [1, 1440], default: 1440
 * @example { "non_heating_report_interval": 1440 }
 */
function setNonHeatingReportInterval(non_heating_report_interval) {
    if (typeof non_heating_report_interval !== "number") {
        throw new Error("non_heating_report_interval must be a number");
    }
    if (non_heating_report_interval < 1 || non_heating_report_interval > 1440) {
        throw new Error("non_heating_report_interval must be between 1 and 1440");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x32);
    buffer.writeUInt16LE(non_heating_report_interval);
    return buffer.toBytes();
}

/**
 * heating date configuration
 * @since 2.20.2
 * @param {object} heating_date
 * @param {number} heating_date.start_month range: [1, 12]
 * @param {number} heating_date.start_day range: [1, 31]
 * @param {number} heating_date.end_month range: [1, 12]
 * @param {number} heating_date.end_day range: [1, 31]
 * @description Supports a cross-year range, e.g. start_month=10, end_month=4.
 * @example { "heating_date": { "start_month": 10, "start_day": 15, "end_month": 4, "end_day": 15 } }
 */
function setHeatingDate(heating_date) {
    var start_month = heating_date.start_month;
    var start_day = heating_date.start_day;
    var end_month = heating_date.end_month;
    var end_day = heating_date.end_day;

    var month_values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    if (month_values.indexOf(start_month) === -1) {
        throw new Error("heating_date.start_month must be one of " + month_values.join(", "));
    }
    if (month_values.indexOf(end_month) === -1) {
        throw new Error("heating_date.end_month must be one of " + month_values.join(", "));
    }
    if (start_day < 1 || start_day > 31) {
        throw new Error("heating_date.start_day must be between 1 and 31");
    }
    if (end_day < 1 || end_day > 31) {
        throw new Error("heating_date.end_day must be between 1 and 31");
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x33);
    buffer.writeUInt8(start_month);
    buffer.writeUInt8(start_day);
    buffer.writeUInt8(end_month);
    buffer.writeUInt8(end_day);
    return buffer.toBytes();
}

/**
 * heating schedule configuration
 * @since 2.21
 * @param {object} heating_schedule
 * @param {number} heating_schedule.id range: [0, 15]
 * @param {number} heating_schedule.enable values: (0: disable, 1: enable)
 * @param {number} heating_schedule.mode values: (0: 0-5 scale, 1: integrated control, 2: valve opening control)
 * @param {number} heating_schedule.value mode=0: temperature_control_level, range [0, 5]; mode=1: target_temperature, unit Celsius, range constrained by 2.22; mode=2: target_valve_opening, unit %
 * @param {number} heating_schedule.period unit: minute
 * @param {number} heating_schedule.time unit: minute, convert: "hh:mm" -> "hh * 60 + mm"
 * @param {object} heating_schedule.week_recycle
 * @param {number} heating_schedule.week_recycle.monday values: (0: disable, 1: enable)
 * @param {number} heating_schedule.week_recycle.tuesday values: (0: disable, 1: enable)
 * @param {number} heating_schedule.week_recycle.wednesday values: (0: disable, 1: enable)
 * @param {number} heating_schedule.week_recycle.thursday values: (0: disable, 1: enable)
 * @param {number} heating_schedule.week_recycle.friday values: (0: disable, 1: enable)
 * @param {number} heating_schedule.week_recycle.saturday values: (0: disable, 1: enable)
 * @param {number} heating_schedule.week_recycle.sunday values: (0: disable, 1: enable)
 * @example { "heating_schedule": [{ "id": 0, "enable": 1, "mode": 1, "value": 20, "period": 10, "time": 480, "week_recycle": { "monday": 1, "tuesday": 1, "wednesday": 1, "thursday": 1, "friday": 1, "saturday": 1, "sunday": 1 } }] }
 */
function setHeatingSchedule(heating_schedule) {
    var id = heating_schedule.id;
    var enable = heating_schedule.enable;
    var mode = heating_schedule.mode;
    var value = heating_schedule.value;
    var period = heating_schedule.period;
    var time = heating_schedule.time;
    var week_recycle = heating_schedule.week_recycle || {};

    if (id < 0 || id > 15) {
        throw new Error("heating_schedule._item.id must be between 0 and 15");
    }
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("heating_schedule._item.enable must be one of " + enable_values.join(", "));
    }
    var mode_map = { 0: "0-5 scale", 1: "integrated control", 2: "valve opening control" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(mode) === -1) {
        throw new Error("heating_schedule._item.mode must be one of " + mode_values.join(", "));
    }

    var raw_mode = getValue(mode_map, mode);
    var raw_value = raw_mode === 1 ? Math.round(value * 100) : value;

    var week_day_offset = { monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 7 };
    var mask = 0x00;
    for (var day in week_day_offset) {
        if (day in week_recycle) {
            if (enable_values.indexOf(week_recycle[day]) === -1) {
                throw new Error("heating_schedule._item.week_recycle." + day + " must be one of " + enable_values.join(", "));
            }
            mask |= getValue(enable_map, week_recycle[day]) << week_day_offset[day];
        }
    }

    var buffer = new Buffer(11);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x34);
    buffer.writeUInt8((id << 4) | getValue(enable_map, enable));
    buffer.writeUInt8(raw_mode);
    buffer.writeInt16LE(raw_value);
    buffer.writeUInt16LE(period);
    buffer.writeUInt16LE(time);
    buffer.writeUInt8(mask);
    return buffer.toBytes();
}

/**
 * target temperature adjustment range configuration
 * @since 2.22
 * @param {object} target_temperature_range
 * @param {number} target_temperature_range.min unit: Celsius, range: [5, 15]
 * @param {number} target_temperature_range.max unit: Celsius, range: [16, 35]
 * @example { "target_temperature_range": { "min": 5, "max": 35 } }
 */
function setTargetTemperatureRange(target_temperature_range) {
    var min = target_temperature_range.min;
    var max = target_temperature_range.max;

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

    var buffer = new Buffer(6);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x35);
    buffer.writeInt16LE(Math.round(min * 100));
    buffer.writeInt16LE(Math.round(max * 100));
    return buffer.toBytes();
}

/**
 * local modification report configuration
 * @since 2.23
 * @param {number} change_report_enable values: (0: disable, 1: enable)
 * @description When target_temperature/valve_opening is modified locally, the device immediately reports a configuration-change packet.
 * @example { "change_report_enable": 1 }
 */
function setChangeReportEnable(change_report_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(change_report_enable) === -1) {
        throw new Error("change_report_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x3a);
    buffer.writeUInt8(getValue(enable_map, change_report_enable));
    return buffer.toBytes();
}

/**
 * non-heating season valve mode configuration
 * @since 2.24
 * @param {number} non_heating_valve_mode values: (0: fully close, 1: fully open)
 * @example { "non_heating_valve_mode": 1 }
 */
function setNonHeatingValveMode(non_heating_valve_mode) {
    var mode_map = { 0: "fully close", 1: "fully open" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(non_heating_valve_mode) === -1) {
        throw new Error("non_heating_valve_mode must be one of " + mode_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x3b);
    buffer.writeUInt8(getValue(mode_map, non_heating_valve_mode));
    return buffer.toBytes();
}

/**
 * valve descale enable configuration
 * @since 2.25
 * @param {number} valve_descale_enable values: (0: disable, 1: enable)
 * @example { "valve_descale_enable": 1 }
 */
function setValveDescaleEnable(valve_descale_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(valve_descale_enable) === -1) {
        throw new Error("valve_descale_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x3c);
    buffer.writeUInt8(getValue(enable_map, valve_descale_enable));
    return buffer.toBytes();
}

/**
 * installation mode configuration
 * @since 2.26
 * @param {number} installation_mode values: (0: horizontal, 1: vertical)
 * @example { "installation_mode": 0 }
 */
function setInstallationMode(installation_mode) {
    var mode_map = { 0: "horizontal", 1: "vertical" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(installation_mode) === -1) {
        throw new Error("installation_mode must be one of " + mode_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x3d);
    buffer.writeUInt8(getValue(mode_map, installation_mode));
    return buffer.toBytes();
}

/**
 * temperature unit configuration
 * @since 2.27
 * @param {number} temperature_unit values: (0: celsius, 1: fahrenheit)
 * @example { "temperature_unit": 0 }
 */
function setTemperatureUnit(temperature_unit) {
    var unit_map = { 0: "celsius", 1: "fahrenheit" };
    var unit_values = getValues(unit_map);
    if (unit_values.indexOf(temperature_unit) === -1) {
        throw new Error("temperature_unit must be one of " + unit_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x3e);
    buffer.writeUInt8(getValue(unit_map, temperature_unit));
    return buffer.toBytes();
}

/**
 * ambient temperature display time configuration
 * @since 2.28
 * @param {number} ambient_temperature_display_time unit: second, range: [1, 10], default: 2
 * @example { "ambient_temperature_display_time": 2 }
 */
function setAmbientTemperatureDisplayTime(ambient_temperature_display_time) {
    if (typeof ambient_temperature_display_time !== "number") {
        throw new Error("ambient_temperature_display_time must be a number");
    }
    if (ambient_temperature_display_time < 1 || ambient_temperature_display_time > 10) {
        throw new Error("ambient_temperature_display_time must be between 1 and 10");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x40);
    buffer.writeUInt8(ambient_temperature_display_time);
    return buffer.toBytes();
}

/**
 * platform algorithm timeout configuration
 * @since 2.29
 * @param {number} platform_algorithm_timeout unit: minute, range: [1, 1440], default: 30
 * @example { "platform_algorithm_timeout": 30 }
 */
function setPlatformAlgorithmTimeout(platform_algorithm_timeout) {
    if (typeof platform_algorithm_timeout !== "number") {
        throw new Error("platform_algorithm_timeout must be a number");
    }
    if (platform_algorithm_timeout < 1 || platform_algorithm_timeout > 1440) {
        throw new Error("platform_algorithm_timeout must be between 1 and 1440");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x41);
    buffer.writeUInt16LE(platform_algorithm_timeout);
    return buffer.toBytes();
}

/**
 * platform algorithm timeout strategy configuration
 * @since 2.30
 * @param {number} platform_algorithm_timeout_strategy values: (0: keep, 1: switch to internal algorithm, 2: close valve)
 * @example { "platform_algorithm_timeout_strategy": 1 }
 */
function setPlatformAlgorithmTimeoutStrategy(platform_algorithm_timeout_strategy) {
    var strategy_map = { 0: "keep", 1: "switch to internal algorithm", 2: "close valve" };
    var strategy_values = getValues(strategy_map);
    if (strategy_values.indexOf(platform_algorithm_timeout_strategy) === -1) {
        throw new Error("platform_algorithm_timeout_strategy must be one of " + strategy_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x42);
    buffer.writeUInt8(getValue(strategy_map, platform_algorithm_timeout_strategy));
    return buffer.toBytes();
}

/**
 * temperature control level to temperature mapping configuration
 * @since 2.31
 * @param {object} temperature_control_level_mapping
 * @param {number} temperature_control_level_mapping.level range: [0, 5]
 * @param {number} temperature_control_level_mapping.temperature unit: Celsius
 * @example { "temperature_control_level_mapping": { "level": 3, "temperature": 22 } }
 */
function setTemperatureControlLevelMapping(temperature_control_level_mapping) {
    var level = temperature_control_level_mapping.level;
    var temperature = temperature_control_level_mapping.temperature;

    if (level < 0 || level > 5) {
        throw new Error("temperature_control_level_mapping.level must be between 0 and 5");
    }
    if (typeof temperature !== "number") {
        throw new Error("temperature_control_level_mapping.temperature must be a number");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x43);
    buffer.writeUInt8(level);
    buffer.writeInt16LE(Math.round(temperature * 100));
    return buffer.toBytes();
}

/**
 * temperature control level configuration
 * @since 2.32
 * @param {number} temperature_control_level range: [0, 5]
 * @example { "temperature_control_level": 3 }
 */
function setTemperatureControlLevel(temperature_control_level) {
    if (typeof temperature_control_level !== "number") {
        throw new Error("temperature_control_level must be a number");
    }
    if (temperature_control_level < 0 || temperature_control_level > 5) {
        throw new Error("temperature_control_level must be between 0 and 5");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x44);
    buffer.writeUInt8(temperature_control_level);
    return buffer.toBytes();
}

/**
 * temperature control level display time configuration
 * @since 2.33
 * @param {number} temperature_control_level_display_time unit: second, range: [1, 10], default: 2
 * @example { "temperature_control_level_display_time": 2 }
 */
function setTemperatureControlLevelDisplayTime(temperature_control_level_display_time) {
    if (typeof temperature_control_level_display_time !== "number") {
        throw new Error("temperature_control_level_display_time must be a number");
    }
    if (temperature_control_level_display_time < 1 || temperature_control_level_display_time > 10) {
        throw new Error("temperature_control_level_display_time must be between 1 and 10");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x45);
    buffer.writeUInt8(temperature_control_level_display_time);
    return buffer.toBytes();
}

/**
 * target temperature adjustment resolution configuration
 * @since 2.34
 * @param {number} target_temperature_resolution values: (0: 0.5, 1: 1.0)
 * @example { "target_temperature_resolution": 0 }
 */
function setTargetTemperatureResolution(target_temperature_resolution) {
    var resolution_map = { 0: "0.5", 1: "1.0" };
    var resolution_values = getValues(resolution_map);
    if (resolution_values.indexOf(target_temperature_resolution) === -1) {
        throw new Error("target_temperature_resolution must be one of " + resolution_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x46);
    buffer.writeUInt8(getValue(resolution_map, target_temperature_resolution));
    return buffer.toBytes();
}

/**
 * target temperature display time configuration
 * @since 2.35
 * @param {number} target_temperature_display_time unit: second, range: [1, 10], default: 2
 * @example { "target_temperature_display_time": 2 }
 */
function setTargetTemperatureDisplayTime(target_temperature_display_time) {
    if (typeof target_temperature_display_time !== "number") {
        throw new Error("target_temperature_display_time must be a number");
    }
    if (target_temperature_display_time < 1 || target_temperature_display_time > 10) {
        throw new Error("target_temperature_display_time must be between 1 and 10");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x47);
    buffer.writeUInt8(target_temperature_display_time);
    return buffer.toBytes();
}

/**
 * open window status timeout configuration
 * @since 2.36
 * @param {number} open_window_status_timeout unit: minute, range: [1, 1440], default: 30
 * @example { "open_window_status_timeout": 30 }
 */
function setOpenWindowStatusTimeout(open_window_status_timeout) {
    if (typeof open_window_status_timeout !== "number") {
        throw new Error("open_window_status_timeout must be a number");
    }
    if (open_window_status_timeout < 1 || open_window_status_timeout > 1440) {
        throw new Error("open_window_status_timeout must be between 1 and 1440");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x49);
    buffer.writeUInt16LE(open_window_status_timeout);
    return buffer.toBytes();
}

/**
 * valve emergency position configuration
 * @since 2.37
 * @param {number} valve_emergency_position range: [0, 100], default: 50
 * @example { "valve_emergency_position": 50 }
 */
function setValveEmergencyPosition(valve_emergency_position) {
    if (typeof valve_emergency_position !== "number") {
        throw new Error("valve_emergency_position must be a number");
    }
    if (valve_emergency_position < 0 || valve_emergency_position > 100) {
        throw new Error("valve_emergency_position must be between 0 and 100");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x4a);
    buffer.writeUInt8(valve_emergency_position);
    return buffer.toBytes();
}

/**
 * valve opening range configuration
 * @since 2.38
 * @param {object} valve_opening_range
 * @param {number} valve_opening_range.min range: [0, 100], default: 10
 * @param {number} valve_opening_range.max range: [0, 100], default: 100
 * @example { "valve_opening_range": { "min": 10, "max": 100 } }
 */
function setValveOpeningRange(valve_opening_range) {
    var min = valve_opening_range.min;
    var max = valve_opening_range.max;

    if (typeof min !== "number" || min < 0 || min > 100) {
        throw new Error("valve_opening_range.min must be between 0 and 100");
    }
    if (typeof max !== "number" || max < 0 || max > 100) {
        throw new Error("valve_opening_range.max must be between 0 and 100");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x4b);
    buffer.writeUInt8(min);
    buffer.writeUInt8(max);
    return buffer.toBytes();
}

/**
 * predict-on feature enable configuration
 * @since 2.39
 * @param {number} predict_on_enable values: (0: disable, 1: enable)
 * @example { "predict_on_enable": 0 }
 */
function setPredictOnEnable(predict_on_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(predict_on_enable) === -1) {
        throw new Error("predict_on_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x4c);
    buffer.writeUInt8(getValue(enable_map, predict_on_enable));
    return buffer.toBytes();
}

/**
 * valve opening display enable configuration
 * @since 2.40
 * @param {number} valve_opening_display_enable values: (0: disable, 1: enable)
 * @example { "valve_opening_display_enable": 1 }
 */
function setValveOpeningDisplayEnable(valve_opening_display_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(valve_opening_display_enable) === -1) {
        throw new Error("valve_opening_display_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x4d);
    buffer.writeUInt8(getValue(enable_map, valve_opening_display_enable));
    return buffer.toBytes();
}

/**
 * fixed preheating time configuration
 * @since 2.41
 * @param {number} fixed_preheating_time unit: minute, range: [1, 1440], default: 60
 * @example { "fixed_preheating_time": 60 }
 */
function setFixedPreheatingTime(fixed_preheating_time) {
    if (typeof fixed_preheating_time !== "number") {
        throw new Error("fixed_preheating_time must be a number");
    }
    if (fixed_preheating_time < 1 || fixed_preheating_time > 1440) {
        throw new Error("fixed_preheating_time must be between 1 and 1440");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x4e);
    buffer.writeUInt16LE(fixed_preheating_time);
    return buffer.toBytes();
}

/**
 * system key enable configuration
 * @since 2.42
 * @param {number} system_key_enable values: (0: disable, 1: enable)
 * @example { "system_key_enable": 1 }
 */
function setSystemKeyEnable(system_key_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(system_key_enable) === -1) {
        throw new Error("system_key_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x4f);
    buffer.writeUInt8(getValue(enable_map, system_key_enable));
    return buffer.toBytes();
}

/**
 * heating schedule enable/disable configuration
 * @since 2.43
 * @param {object} heating_schedule_enable
 * @param {number} heating_schedule_enable.id range: [0, 15]
 * @param {number} heating_schedule_enable.enable values: (0: disable, 1: enable)
 * @description Only changes the enable state of the specified schedule; mode/value/period/time/mask are unaffected. The schedule must already have a valid configuration.
 * @example { "heating_schedule_enable": { "id": 5, "enable": 1 } }
 */
function setHeatingScheduleEnable(heating_schedule_enable) {
    var id = heating_schedule_enable.id;
    var enable = heating_schedule_enable.enable;

    if (id < 0 || id > 15) {
        throw new Error("heating_schedule_enable.id must be between 0 and 15");
    }
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("heating_schedule_enable.enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x50);
    buffer.writeUInt8(id);
    buffer.writeUInt8(getValue(enable_map, enable));
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
    for (var index = 0; index < byteLength; index++) {
        var offset = isLittleEndian ? index << 3 : (byteLength - 1 - index) << 3;
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

Buffer.prototype.toBytes = function () {
    return this.buffer;
};
