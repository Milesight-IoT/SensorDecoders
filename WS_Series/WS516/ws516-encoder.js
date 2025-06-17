/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product WS516
 */
var RAW_VALUE = 0x00;
var WITH_QUERY_CMD = 0x00;

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

    if ("frame" in payload) {
        encoded = encoded.concat(setFrame(payload.frame));
    }
    if ("reporting_interval" in payload) {
        var cmd_buffer = setReportingInterval(payload.reporting_interval);
        encoded = encoded.concat(cmd_buffer);
        encoded = WITH_QUERY_CMD ? encoded.concat(setQueryCmd(cmd_buffer)) : encoded;
    }
    if ("temperature_unit" in payload) {
        var cmd_buffer = setTemperatureUnit(payload.temperature_unit);
        encoded = encoded.concat(cmd_buffer);
        encoded = WITH_QUERY_CMD ? encoded.concat(setQueryCmd(cmd_buffer)) : encoded;
    }
    if ("power_consumption_enable" in payload) {
        var cmd_buffer = setPowerConsumptionEnable(payload.power_consumption_enable);
        encoded = encoded.concat(cmd_buffer);
        encoded = WITH_QUERY_CMD ? encoded.concat(setQueryCmd(cmd_buffer)) : encoded;
    }
    if ("led_indicator_mode" in payload) {
        var cmd_buffer = setLEDIndicatorMode(payload.led_indicator_mode);
        encoded = encoded.concat(cmd_buffer);
        encoded = WITH_QUERY_CMD ? encoded.concat(setQueryCmd(cmd_buffer)) : encoded;
    }
    if ("button_lock" in payload) {
        var cmd_buffer = setButtonLock(payload.button_lock);
        encoded = encoded.concat(cmd_buffer);
        encoded = WITH_QUERY_CMD ? encoded.concat(setQueryCmd(cmd_buffer)) : encoded;
    }
    if ("overcurrent_alarm_settings" in payload) {
        var cmd_buffer = setOvercurrentAlarmSettings(payload.overcurrent_alarm_settings);
        encoded = encoded.concat(cmd_buffer);
        encoded = WITH_QUERY_CMD ? encoded.concat(setQueryCmd(cmd_buffer)) : encoded;
    }
    if ("overcurrent_protection_settings" in payload) {
        var cmd_buffer = setOvercurrentProtectionSettings(payload.overcurrent_protection_settings);
        encoded = encoded.concat(cmd_buffer);
        encoded = WITH_QUERY_CMD ? encoded.concat(setQueryCmd(cmd_buffer)) : encoded;
    }
    if ("high_current_protection_settings" in payload) {
        var cmd_buffer = setHighCurrentProtectionSettings(payload.high_current_protection_settings);
        encoded = encoded.concat(cmd_buffer);
        encoded = WITH_QUERY_CMD ? encoded.concat(setQueryCmd(cmd_buffer)) : encoded;
    }
    if ("temperature_alarm_settings" in payload) {
        var cmd_buffer = setTemperatureAlarmSettings(payload.temperature_alarm_settings);
    }
    if ("temperature_alarm_release_enable" in payload) {
        var cmd_buffer = setTemperatureAlarmReleaseEnable(payload.temperature_alarm_release_enable);
        encoded = encoded.concat(cmd_buffer);
        encoded = WITH_QUERY_CMD ? encoded.concat(setQueryCmd(cmd_buffer)) : encoded;
    }
    if ("alarm_reporting_interval" in payload) {
        var cmd_buffer = setAlarmReportingInterval(payload.alarm_reporting_interval);
        encoded = encoded.concat(cmd_buffer);
        encoded = WITH_QUERY_CMD ? encoded.concat(setQueryCmd(cmd_buffer)) : encoded;
    }
    if ("alarm_reporting_times" in payload) {
        var cmd_buffer = setAlarmReportingTimes(payload.alarm_reporting_times);
        encoded = encoded.concat(cmd_buffer);
        encoded = WITH_QUERY_CMD ? encoded.concat(setQueryCmd(cmd_buffer)) : encoded;
    }
    if ("when_power_restored_switch_status" in payload) {
        var cmd_buffer = setWhenPowerRestoredSwitchStatus(payload.when_power_restored_switch_status);
        encoded = encoded.concat(cmd_buffer);
        encoded = WITH_QUERY_CMD ? encoded.concat(setQueryCmd(cmd_buffer)) : encoded;
    }
    if ("bluetooth_name" in payload) {
        var cmd_buffer = setBluetoothName(payload.bluetooth_name);
        encoded = encoded.concat(cmd_buffer);
        encoded = WITH_QUERY_CMD ? encoded.concat(setQueryCmd(cmd_buffer)) : encoded;
    }
    if ("temperature_1_calibration_settings" in payload) {
        var cmd_buffer = setTemperature1CalibrationSettings(payload.temperature_1_calibration_settings);
        encoded = encoded.concat(cmd_buffer);
        encoded = WITH_QUERY_CMD ? encoded.concat(setQueryCmd(cmd_buffer)) : encoded;
    }
    if ("temperature_2_calibration_settings" in payload) {
        var cmd_buffer = setTemperature2CalibrationSettings(payload.temperature_2_calibration_settings);
        encoded = encoded.concat(cmd_buffer);
        encoded = WITH_QUERY_CMD ? encoded.concat(setQueryCmd(cmd_buffer)) : encoded;
    }
    if ("d2d_slave_enable" in payload) {
        var cmd_buffer = setD2DSlaveEnable(payload.d2d_slave_enable);
        encoded = encoded.concat(cmd_buffer);
        encoded = WITH_QUERY_CMD ? encoded.concat(setQueryCmd(cmd_buffer)) : encoded;
    }
    if ("d2d_slave_settings" in payload) {
        for (var i = 0; i < payload.d2d_slave_settings.length; i++) {
            var cmd_buffer = setD2DSlaveSettings(payload.d2d_slave_settings[i]);
            encoded = encoded.concat(cmd_buffer);
            encoded = WITH_QUERY_CMD ? encoded.concat(setQueryCmd(cmd_buffer)) : encoded;
        }
    }
    if ("schedule_settings" in payload) {
        for (var i = 0; i < payload.schedule_settings.length; i++) {
            var cmd_buffer = setScheduleSettings(payload.schedule_settings[i]);
            encoded = encoded.concat(cmd_buffer);
            encoded = WITH_QUERY_CMD ? encoded.concat(setQueryCmd(cmd_buffer)) : encoded;
        }
    }
    if ("daylight_saving_time" in payload) {
        var cmd_buffer = setDaylightSavingTimeSettings(payload.daylight_saving_time);
        encoded = encoded.concat(cmd_buffer);
        encoded = WITH_QUERY_CMD ? encoded.concat(setQueryCmd(cmd_buffer)) : encoded;
    }
    if ("time_zone" in payload) {
        var cmd_buffer = setTimeZone(payload.time_zone);
        encoded = encoded.concat(cmd_buffer);
        encoded = WITH_QUERY_CMD ? encoded.concat(setQueryCmd(cmd_buffer)) : encoded;
    }
    if ("socket_switch_clear_power_consumption" in payload) {
        var cmd_buffer = clearSocketPowerConsumption(payload.socket_switch_clear_power_consumption);
        encoded = encoded.concat(cmd_buffer);
        encoded = WITH_QUERY_CMD ? encoded.concat(setQueryCmd(cmd_buffer)) : encoded;
    }
    if ("socket_switch_status_control" in payload) {
        var cmd_buffer = setSocketSwitchStatusControl(payload.socket_switch_status_control);
        encoded = encoded.concat(cmd_buffer);
        encoded = WITH_QUERY_CMD ? encoded.concat(setQueryCmd(cmd_buffer)) : encoded;
    }
    if ("reset" in payload) {
        encoded = encoded.concat(reset(payload.reset));
    }
    if ("synchronize_time" in payload) {
        encoded = encoded.concat(synchronizeTime());
    }
    if ("query_device_status" in payload) {
        encoded = encoded.concat(queryDeviceStatus());
    }
    if ("reconnect" in payload) {
        encoded = encoded.concat(reconnect());
    }
    if ("set_time" in payload) {
        encoded = encoded.concat(setTime(payload.set_time));
    }
    if ("reboot" in payload) {
        encoded = encoded.concat(reboot());
    }
    return encoded;
}

/**
 * Set frame
 * @param {number} frame values: (0: normal, 1: debug)
 * @example { "frame": 0 }
 */
function setFrame(frame) {
    var buffer = new Buffer(2);
    buffer.writeUInt8(0xFE);
    buffer.writeUInt8(frame);
    return buffer.toBytes();
}

/**
 * Set report interval
 * @param {object} reporting_interval
 * @param {number} reporting_interval.unit values: (0: second, 1: minute)
 * @param {number} reporting_interval.seconds_of_time unit: second, range: [10, 64800], default: 600s
 * @param {number} reporting_interval.minutes_of_time unit: minute, range: [1, 1440], default: 10min
 * @example { "reporting_interval": { "unit": 0, "seconds_of_time": 300 } }
 */
function setReportingInterval(reporting_interval) {
    var unit = reporting_interval.unit;
    var seconds_of_time = reporting_interval.seconds_of_time || 600;
    var minutes_of_time = reporting_interval.minutes_of_time || 10;

    var unit_map = { 0: "second", 1: "minute" };
    var unit_values = getValues(unit_map);
    if (unit_values.indexOf(unit) === -1) {
        throw new Error("reporting_interval.unit must be one of " + unit_values.join(", "));
    }
    if (getValue(unit_map, unit) === 0 && (seconds_of_time < 10 || seconds_of_time > 64800)) {
        throw new Error("reporting_interval.seconds_of_time must be between 10 and 64800 when reporting_interval.unit is 0");
    }
    if (getValue(unit_map, unit) === 1 && (minutes_of_time < 1 || minutes_of_time > 1440)) {
        throw new Error("reporting_interval.minutes_of_time must be between 1 and 1440 when reporting_interval.unit is 1");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0x62);
    buffer.writeUInt8(getValue(unit_map, unit));
    buffer.writeUInt16LE(getValue(unit_map, unit) === 0 ? seconds_of_time : minutes_of_time);
    return buffer.toBytes();
}

/**
 * Set temperature unit
 * @param {number} temperature_unit values: (0: ℃, 1: ℉)
 * @example { "temperature_unit": 0 }
 */
function setTemperatureUnit(temperature_unit) {
    var temperature_unit_map = { 0: "℃", 1: "℉" };
    var temperature_unit_values = getValues(temperature_unit_map);
    if (temperature_unit_values.indexOf(temperature_unit) === -1) {
        throw new Error("temperature_unit must be one of " + temperature_unit_values.join(", "));
    }
    var buffer = new Buffer(2);
    buffer.writeUInt8(0x61);
    buffer.writeUInt8(getValue(temperature_unit_map, temperature_unit));
    return buffer.toBytes();
}

/**
 * Set power consumption enable
 * @param {number} power_consumption_enable values: (0: disable, 1: enable)
 * @example { "power_consumption_enable": 0 }
 */
function setPowerConsumptionEnable(power_consumption_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(power_consumption_enable) === -1) {
        throw new Error("power_consumption_enable must be one of " + enable_values.join(", "));
    }
    var buffer = new Buffer(2);
    buffer.writeUInt8(0x62);
    buffer.writeUInt8(getValue(enable_map, power_consumption_enable));
    return buffer.toBytes();
}

/**
 * Set LED indicator mode
 * @param {number} led_indicator_mode values: (0: disable, 1: enable)
 * @example { "led_indicator_mode": 0 }
 */
function setLEDIndicatorMode(led_indicator_mode) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(led_indicator_mode) === -1) {
        throw new Error("led_indicator_mode must be one of " + enable_values.join(", "));
    }
    var buffer = new Buffer(2);
    buffer.writeUInt8(0x63);
    buffer.writeUInt8(getValue(enable_map, led_indicator_mode));
    return buffer.toBytes();
}

/**
 * Set button lock
 * @param {object} button_lock
 * @param {number} button_lock.enable values: (0: disable, 1: enable)
 * @example { "button_lock": { "enable": 0 } }
 */
function setButtonLock(button_lock) {
    var enable = button_lock.enable;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("button_lock.enable must be one of " + enable_values.join(", "));
    }

    var data = 0x00;
    data |= getValue(enable_map, enable) << 0;

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x64);
    buffer.writeUInt8(data);
    return buffer.toBytes();
}

/**
 * Set overcurrent alarm settings
 * @param {object} overcurrent_alarm_settings
 * @param {number} overcurrent_alarm_settings.enable values: (0: disable, 1: enable)
 * @param {number} overcurrent_alarm_settings.threshold unit: A, range: [1, 13]
 * @example { "overcurrent_alarm_settings": { "enable": 0, "threshold": 13 } }
 */
function setOvercurrentAlarmSettings(overcurrent_alarm_settings) {
    var enable = overcurrent_alarm_settings.enable;
    var threshold = overcurrent_alarm_settings.threshold;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("overcurrent_alarm_settings.enable must be one of " + enable_values.join(", "));
    }
    if (threshold < 1 || threshold > 13) {
        throw new Error("overcurrent_alarm_settings.threshold must be between 1 and 13");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0x65);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(threshold);
    return buffer.toBytes();
}

/**
 * Set overcurrent protection settings
 * @param {object} overcurrent_protection_settings
 * @param {number} overcurrent_protection_settings.enable values: (0: disable, 1: enable)
 * @param {number} overcurrent_protection_settings.threshold unit: A, range: [1, 13]
 * @example { "overcurrent_protection_settings": { "enable": 0, "threshold": 13 } }
 */
function setOvercurrentProtectionSettings(overcurrent_protection_settings) {
    var enable = overcurrent_protection_settings.enable;
    var threshold = overcurrent_protection_settings.threshold;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("overcurrent_protection_settings.enable must be one of " + enable_values.join(", "));
    }
    if (threshold < 1 || threshold > 13) {
        throw new Error("overcurrent_protection_settings.threshold must be between 1 and 13");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0x67);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(threshold);
    return buffer.toBytes();
}

/**
 * Set high current protection settings
 * @param {object} high_current_protection_settings
 * @param {number} high_current_protection_settings.enable values: (0: disable, 1: enable)
 * @example { "high_current_protection_settings": { "enable": 0 } }
 */
function setHighCurrentProtectionSettings(high_current_protection_settings) {
    var enable = high_current_protection_settings.enable;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("high_current_protection_settings.enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x69);
    buffer.writeUInt8(getValue(enable_map, enable));
    return buffer.toBytes();
}

/**
 * Set temperature alarm settings
 * @param {object} temperature_alarm_settings
 * @param {number} temperature_alarm_settings.enable values: (0: disable, 1: enable)
 * @param {number} temperature_alarm_settings.threshold_condition values: (1: below, 2: above, 3: between, 4: outside)
 * @param {number} temperature_alarm_settings.threshold_min unit: ℃, range: [-45, 125]
 * @param {number} temperature_alarm_settings.threshold_max unit: ℃, range: [-45, 125]
 * @example { "temperature_alarm_settings": { "enable": 0, "threshold_condition": 1, "threshold_min": 0, "threshold_max": 0 } }
 */
function setTemperatureAlarmSettings(temperature_alarm_settings) {
    var enable = temperature_alarm_settings.enable;
    var threshold_condition = temperature_alarm_settings.threshold_condition;
    var threshold_min = temperature_alarm_settings.threshold_min;
    var threshold_max = temperature_alarm_settings.threshold_max;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("temperature_alarm_settings.enable must be one of " + enable_values.join(", "));
    }
    var condition_map = { 1: "below", 2: "above", 3: "between", 4: "outside" };
    var condition_values = getValues(condition_map);
    if (condition_values.indexOf(threshold_condition) === -1) {
        throw new Error("temperature_alarm_settings.threshold_condition must be one of " + condition_values.join(", "));
    }
    if (threshold_min < -45 || threshold_min > 125) {
        throw new Error("temperature_alarm_settings.threshold_min must be between -45 and 125");
    }
    if (threshold_max < -45 || threshold_max > 125) {
        throw new Error("temperature_alarm_settings.threshold_max must be between -45 and 125");
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0x6a);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(getValue(condition_map, threshold_condition));
    buffer.writeInt16LE(threshold_min * 10);
    buffer.writeInt16LE(threshold_max * 10);
    return buffer.toBytes();
}

/**
 * Set temperature alarm release enable
 * @param {number} temperature_alarm_release_enable values: (0: disable, 1: enable)
 * @example { "temperature_alarm_release_enable": 0 }
 */
function setTemperatureAlarmReleaseEnable(temperature_alarm_release_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(temperature_alarm_release_enable) === -1) {
        throw new Error("temperature_alarm_release_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x6b);
    buffer.writeUInt8(getValue(enable_map, temperature_alarm_release_enable));
    return buffer.toBytes();
}

/**
 * Set alarm reporting interval
 * @param {number} alarm_reporting_interval unit: min, range: [1, 1080]
 * @example { "alarm_reporting_interval": 5 }
 */
function setAlarmReportingInterval(alarm_reporting_interval) {
    if (alarm_reporting_interval < 1 || alarm_reporting_interval > 1080) {
        throw new Error("alarm_reporting_interval must be between 1 and 1080");
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x6c);
    buffer.writeUInt16LE(alarm_reporting_interval);
    return buffer.toBytes();
}

/**
 * Set alarm reporting times
 * @param {number} alarm_reporting_times range: [1, 1000]
 * @example { "alarm_reporting_times": 3 }
 */
function setAlarmReportingTimes(alarm_reporting_times) {
    if (alarm_reporting_times < 1 || alarm_reporting_times > 1000) {
        throw new Error("alarm_reporting_times must be between 1 and 1000");
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x6d);
    buffer.writeUInt16LE(alarm_reporting_times);
    return buffer.toBytes();
}

/**
 * Set when power restored switch status
 * @param {number} when_power_restored_switch_status values: (0: keep, 1: off, 2: on)
 * @example { "when_power_restored_switch_status": 0 }
 */
function setWhenPowerRestoredSwitchStatus(when_power_restored_switch_status) {
    var restore_status_map = { 0: "keep", 1: "off", 2: "on" };
    var restore_status_values = getValues(restore_status_map);
    if (restore_status_values.indexOf(when_power_restored_switch_status) === -1) {
        throw new Error("when_power_restored_switch_status must be one of " + restore_status_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x6e);
    buffer.writeUInt8(getValue(restore_status_map, when_power_restored_switch_status));
    return buffer.toBytes();
}

/**
 * Set bluetooth name
 * @param {string} bluetooth_name length: [1, 32]
 * @example { "bluetooth_name": "MyDevice" }
 */
function setBluetoothName(bluetooth_name) {
    if (bluetooth_name.length > 32) {
        throw new Error("bluetooth_name must be less than 32 characters");
    }

    var buffer = new Buffer(33);
    buffer.writeUInt8(0x6f);
    buffer.writeBytes(encodeUtf8(bluetooth_name));
    return buffer.toBytes();
}

/**
 * Set temperature 1 calibration settings
 * @param {object} temperature_1_calibration_settings
 * @param {number} temperature_1_calibration_settings.enable values: (0: disable, 1: enable)
 * @param {number} temperature_1_calibration_settings.calibration_value unit: ℃, range: [-165, 165]
 * @example { "temperature_1_calibration_settings": { "enable": 0, "calibration_value": 0 } }
 */
function setTemperature1CalibrationSettings(temperature_1_calibration_settings) {
    var enable = temperature_1_calibration_settings.enable;
    var calibration_value = temperature_1_calibration_settings.calibration_value;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("temperature_1_calibration_settings.enable must be one of " + enable_values.join(", "));
    }
    if (calibration_value < -165 || calibration_value > 165) {
        throw new Error("temperature_1_calibration_settings.calibration_value must be between -165 and 165");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0x71);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeInt16LE(calibration_value * 10);
    return buffer.toBytes();
}

/**
 * Set temperature 2 calibration settings
 * @param {object} temperature_2_calibration_settings
 * @param {number} temperature_2_calibration_settings.enable values: (0: disable, 1: enable)
 * @param {number} temperature_2_calibration_settings.calibration_value unit: ℃, range: [-165, 165]
 * @example { "temperature_2_calibration_settings": { "enable": 0, "calibration_value": 0 } }
 */
function setTemperature2CalibrationSettings(temperature_2_calibration_settings) {
    var enable = temperature_2_calibration_settings.enable;
    var calibration_value = temperature_2_calibration_settings.calibration_value;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("temperature_2_calibration_settings.enable must be one of " + enable_values.join(", "));
    }
    if (calibration_value < -165 || calibration_value > 165) {
        throw new Error("temperature_2_calibration_settings.calibration_value must be between -165 and 165");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0x72);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeInt16LE(calibration_value * 10);
    return buffer.toBytes();
}

/**
 * Set D2D slave enable
 * @param {number} d2d_slave_enable values: (0: disable, 1: enable)
 * @example { "d2d_slave_enable": 0 }
 */
function setD2DSlaveEnable(d2d_slave_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(d2d_slave_enable) === -1) {
        throw new Error("d2d_slave_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x7F);
    buffer.writeUInt8(getValue(enable_map, d2d_slave_enable));
    return buffer.toBytes();
}

/**
 * Set D2D slave settings
 * @param {object} d2d_slave_settings
 * @param {number} d2d_slave_settings.index range: [1, 16]
 * @param {number} d2d_slave_settings.enable values: (0: disable, 1: enable)
 * @param {string} d2d_slave_settings.command
 * @param {number} d2d_slave_settings.socket_switch values: (0: socket1, 1: socket2, 2: all socket)
 * @param {number} d2d_slave_settings.action values: (0: off, 1: on, 2: reverse)
 * @example { "d2d_slave_settings": { "index": 1, "enable": 0, "command": "01", "socket_switch": 0, "action": 0 } }
 */
function setD2DSlaveSettings(d2d_slave_settings) {
    var index = d2d_slave_settings.index;
    var enable = d2d_slave_settings.enable;
    var command = d2d_slave_settings.command;
    var socket_switch = d2d_slave_settings.socket_switch;
    var action = d2d_slave_settings.action;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (index < 1 || index > 16) {
        throw new Error("d2d_slave_settings._item.index must be between 1 and 16");
    }
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("d2d_slave_settings._item.enable must be one of " + enable_values.join(", "));
    }
    var socket_switch_map = { 0: "socket1", 1: "socket2", 2: "all socket" };
    var socket_switch_values = getValues(socket_switch_map);
    if (socket_switch_values.indexOf(socket_switch) === -1) {
        throw new Error("d2d_slave_settings._item.socket_switch must be one of " + socket_switch_values.join(", "));
    }
    var action_map = { 0: "off", 1: "on", 2: "reverse" };
    var action_values = getValues(action_map);
    if (action_values.indexOf(action) === -1) {
        throw new Error("d2d_slave_settings._item.action must be one of " + action_values.join(", "));
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0x80);
    buffer.writeUInt8(index - 1);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeBytes(encodeUtf8(command));
    buffer.writeUInt8(getValue(socket_switch_map, socket_switch));
    buffer.writeUInt8(getValue(action_map, action));
    return buffer.toBytes();
}

/**
 * 
 * @param {object} schedule_settings
 * @param {number} schedule_settings.index range: [1, 16]
 * @param {number} schedule_settings.enable values: (0: disable, 1: enable)
 * @param {number} schedule_settings.execution_time_point unit: min, range: [0, 1439]
 * @param {number} schedule_settings.socket_switch values: (0: socket1, 1: socket2, 2: all socket)
 * @param {number} schedule_settings.action values: (0: off, 1: on, 2: reverse)
 * @param {number} schedule_settings.is_delete values: (0: no, 1: yes)
 */
function setScheduleSettings(schedule_settings) {
    var index = schedule_settings.index;
    var enable = schedule_settings.enable;
    var execution_time_point = schedule_settings.execution_time_point;
    var socket_switch = schedule_settings.socket_switch;
    var action = schedule_settings.action;
    var is_delete = schedule_settings.is_delete;

    if (index < 1 || index > 16) {
        throw new Error("schedule_settings._item.index must be between 1 and 16");
    }
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("schedule_settings._item.enable must be one of " + enable_values.join(", "));
    }
    if (execution_time_point < 0 || execution_time_point > 1439) {
        throw new Error("schedule_settings._item.execution_time_point must be between 0 and 1439");
    }
    var socket_switch_map = { 0: "socket1", 1: "socket2", 2: "all socket" };
    var socket_switch_values = getValues(socket_switch_map);
    if (socket_switch_values.indexOf(socket_switch) === -1) {
        throw new Error("schedule_settings._item.socket_switch must be one of " + socket_switch_values.join(", "));
    }
    var action_map = { 0: "off", 1: "on", 2: "reverse" };
    var action_values = getValues(action_map);
    if (action_values.indexOf(action) === -1) {
        throw new Error("schedule_settings._item.action must be one of " + action_values.join(", "));
    }
    var is_delete_map = { 0: "no delete", 1: "is delete" };
    var is_delete_values = getValues(is_delete_map);
    if (is_delete_values.indexOf(is_delete) === -1) {
        throw new Error("schedule_settings._item.is_delete must be one of " + is_delete_values.join(", "));
    }

    var data = 0x00;
    var schedule_weekday_bits_offset = { "execution_day_sun": 0, "execution_day_mon": 1, "execution_day_tues": 2, "execution_day_wed": 3, "execution_day_thu": 4, "execution_day_fri": 5, "execution_day_sat": 6 };
    for (var key in schedule_weekday_bits_offset) {
        if (key in schedule_settings) {
            if (enable_values.indexOf(schedule_settings[key]) === -1) {
                throw new Error("schedule_settings._item." + key + " must be one of " + enable_values.join(", "));
            }
            data |= getValue(enable_map, schedule_settings[key]) << schedule_weekday_bits_offset[key];
        }
    }

    var buffer = new Buffer(9);
    buffer.writeUInt8(0x81);
    buffer.writeUInt8(index - 1);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt16LE(execution_time_point);
    buffer.writeUInt8(data);
    buffer.writeUInt8(getValue(socket_switch_map, socket_switch));
    buffer.writeUInt8(getValue(action_map, action));
    buffer.writeUInt8(getValue(is_delete_map, is_delete));
    return buffer.toBytes();
}


/**
 * Set daylight saving time settings
 * @param {object} daylight_saving_time
 * @param {number} daylight_saving_time.daylight_saving_time_enable values: (0: disable, 1: enable)
 * @param {number} daylight_saving_time.daylight_saving_time_offset unit: minute
 * @param {number} daylight_saving_time.start_month values: (1: January, 2: February, 3: March, 4: April, 5: May, 6: June, 7: July, 8: August, 9: September, 10: October, 11: November, 12: December)
 * @param {number} daylight_saving_time.start_week_num values: (1: First week, 2: Second week, 3: Third week, 4: Fourth week, 5: Last week)
 * @param {number} daylight_saving_time.start_week_day values: (1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday, 7: Sunday)
 * @param {number} daylight_saving_time.start_hour_min unit: minutes
 * @param {number} daylight_saving_time.end_month values: (1: January, 2: February, 3: March, 4: April, 5: May, 6: June, 7: July, 8: August, 9: September, 10: October, 11: November, 12: December)
 * @param {number} daylight_saving_time.end_week_num values: (1: First week, 2: Second week, 3: Third week, 4: Fourth week, 5: Last week)
 * @param {number} daylight_saving_time.end_week_day values: (1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday, 7: Sunday)
 * @param {number} daylight_saving_time.end_hour_min unit: minute
 * @example { "daylight_saving_time": { "enable": 1, "offset": 60, "start_month": 3, "start_week": 1, "start_day": 1, "start_time": 0, "end_month": 11, "end_week": 4, "end_day": 7, "end_time": 120 } }
 */
function setDaylightSavingTimeSettings(daylight_saving_time) {
    var enable = daylight_saving_time.daylight_saving_time_enable;
    var offset = daylight_saving_time.daylight_saving_time_offset;
    var start_month = daylight_saving_time.start_month;
    var start_week_num = daylight_saving_time.start_week_num;
    var start_week_day = daylight_saving_time.start_week_day;
    var start_hour_min = daylight_saving_time.start_hour_min;
    var end_month = daylight_saving_time.end_month;
    var end_week_num = daylight_saving_time.end_week_num;
    var end_week_day = daylight_saving_time.end_week_day;
    var end_hour_min = daylight_saving_time.end_hour_min;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("daylight_saving_time.daylight_saving_time_enable must be one of " + enable_values.join(", "));
    }
    var month_values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    if (month_values.indexOf(start_month) === -1 || month_values.indexOf(end_month) === -1) {
        throw new Error("daylight_saving_time.start_month and end_month must be one of " + month_values.join(", "));
    }
    var week_values = [1, 2, 3, 4, 5];
    if (week_values.indexOf(start_week_num) === -1 || week_values.indexOf(end_week_num) === -1) {
        throw new Error("daylight_saving_time.start_week_num and end_week_num must be one of " + week_values.join(", "));
    }
    var day_values = [1, 2, 3, 4, 5, 6, 7];
    if (day_values.indexOf(start_week_day) === -1 || day_values.indexOf(end_week_day) === -1) {
        throw new Error("daylight_saving_time.start_week_day and end_week_day must be one of " + day_values.join(", "));
    }

    var start_day_value = (start_week_num << 4) | start_week_day;
    var end_day_value = (end_week_num << 4) | end_week_day;

    var buffer = new Buffer(11);
    buffer.writeUInt8(0xc6);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(offset);
    buffer.writeUInt8(start_month);
    buffer.writeUInt8(start_day_value);
    buffer.writeUInt16LE(start_hour_min);
    buffer.writeUInt8(end_month);
    buffer.writeUInt8(end_day_value);
    buffer.writeUInt16LE(end_hour_min);
    return buffer.toBytes();
}

/**
 * Set time zone
 * @param {number} time_zone values: ( -720: UTC-12:00, -660: UTC-11:00, -600: UTC-10:00, -570: UTC-09:30, -540: UTC-09:00, -480: UTC-08:00, -420: UTC-07:00, -360: UTC-06:00, -300: UTC-05:00, -240: UTC-04:00, -210: UTC-03:30, -180: UTC-03:00, -120: UTC-02:00, -60: UTC-01:00, 0: UTC+00:00, 60: UTC+01:00, 120: UTC+02:00, 180: UTC+03:00, 210: UTC+03:30, 240: UTC+04:00, 270: UTC+04:30, 300: UTC+05:00, 330: UTC+05:30, 345: UTC+05:45, 360: UTC+06:00, 390: UTC+06:30, 420: UTC+07:00, 480: UTC+08:00, 540: UTC+09:00, 570: UTC+09:30, 600: UTC+10:00, 630: UTC+10:30, 660: UTC+11:00, 720: UTC+12:00, 765: UTC+12:45, 780: UTC+13:00, 840: UTC+14:00)
 * @example { "time_zone": 480 }
 */
function setTimeZone(time_zone) {
    var timezone_values = [-720, -660, -600, -570, -540, -480, -420, -360, -300, -240, -210, -180, -120, -60, 0, 60, 120, 180, 210, 240, 270, 300, 330, 345, 360, 390, 420, 480, 540, 570, 600, 630, 660, 720, 765, 780, 840];
    if (timezone_values.indexOf(time_zone) === -1) {
        throw new Error("time_zone must be one of " + timezone_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xc7);
    buffer.writeInt16LE(time_zone);
    return buffer.toBytes();
}

/**
 * 
 * @param {object} socket_switch_clear_power_consumption
 * @param {number} socket_switch_clear_power_consumption.socket_switch values: (0: socket1, 1: socket2, 2: all socket)
 * @example { "socket_switch_clear_power_consumption": { "socket_switch": 0 } }
 */
function clearSocketPowerConsumption(socket_switch_clear_power_consumption) {
    var socket_switch = socket_switch_clear_power_consumption.socket_switch;

    var socket_switch_map = { 0: "socket1", 1: "socket2", 2: "all socket" };
    var socket_switch_values = getValues(socket_switch_map);
    if (socket_switch_values.indexOf(socket_switch) === -1) {
        throw new Error("socket_switch_clear_power_consumption.socket_switch must be one of " + socket_switch_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x5e);
    buffer.writeUInt8(getValue(socket_switch_map, socket_switch));
    return buffer.toBytes();
}

function setSocketSwitchStatusControl(socket_switch_status_control) {
    var socket_switch = socket_switch_status_control.socket_switch;
    var status = socket_switch_status_control.status;

    var socket_switch_map = { 0: "socket1", 1: "socket2", 2: "all socket" };
    var socket_switch_values = getValues(socket_switch_map);
    if (socket_switch_values.indexOf(socket_switch) === -1) {
        throw new Error("socket_switch_status_control.socket_switch must be one of " + socket_switch_values.join(", "));
    }
    var status_map = { 0: "off", 1: "on", 2: "reverse" };
    var status_values = getValues(status_map);
    if (status_values.indexOf(status) === -1) {
        throw new Error("socket_switch_status_control.status must be one of " + status_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0x5f);
    buffer.writeUInt8(getValue(socket_switch_map, socket_switch));
    buffer.writeUInt8(getValue(status_map, status));
    return buffer.toBytes();
}

/**
 * Reconnect
 * @example { "reconnect": 1 }
 */
function reconnect() {
    var buffer = new Buffer(1);
    buffer.writeUInt8(0xb6);
    return buffer.toBytes();
}

/**
 * Synchronize time
 * @example { "synchronize_time": 1 }
 */
function synchronizeTime() {
    var buffer = new Buffer(1);
    buffer.writeUInt8(0xb8);
    return buffer.toBytes();
}

/**
 *  
 * @param {object} set_time
 * @param {number} set_time.timestamp unit: second, range: [0, 4294967295]
 * @example { "set_time": { "timestamp": 1718630400 } }
 */
function setTime(set_time) {
    var timestamp = set_time.timestamp;
    if (timestamp < 0 || timestamp > 4294967295) {
        throw new Error("set_time.timestamp must be between 0 and 4294967295");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xb7);
    buffer.writeUInt32LE(timestamp);
    return buffer.toBytes();
}

/**
 * Query device status
 * @example { "query_device_status": 1 }
 */
function queryDeviceStatus() {
    var buffer = new Buffer(1);
    buffer.writeUInt8(0xb9);
    return buffer.toBytes();
}

/**
 * Reboot
 * @example { "reboot": 1 }
 */
function reboot() {
    var buffer = new Buffer(1);
    buffer.writeUInt8(0xbe);
    return buffer.toBytes();
}

/**
 * Reset
 * @example { "reset": 1 }
 */
function reset() {
    var buffer = new Buffer(1);
    buffer.writeUInt8(0xbf);
    return buffer.toBytes();
}


function setQueryCmd(bytes) {
    var name_map = {
        "60": { "level": 1, "name": "collection_interval" },
        "61": { "level": 1, "name": "temperature_unit" },
        "62": { "level": 1, "name": "power_consumption_enable" },
        "63": { "level": 1, "name": "led_indicator_mode" },
        "64": { "level": 1, "name": "button_lock" },
        "65": { "level": 1, "name": "overcurrent_alarm_settings" },
        "67": { "level": 1, "name": "overcurrent_protection_settings" },
        "69": { "level": 1, "name": "high_current_protection_settings" },
        "6A": { "level": 1, "name": "temperature_alarm_settings" },
        "6B": { "level": 1, "name": "temperature_alarm_release_enable" },
        "6C": { "level": 1, "name": "alarm_reporting_interval" },
        "6D": { "level": 1, "name": "alarm_reporting_times" },
        "6E": { "level": 1, "name": "when_power_restored_switch_status" },
        "6F": { "level": 1, "name": "bluetooth_name" },
        "71": { "level": 1, "name": "temperature_1_calibration_settings" },
        "72": { "level": 1, "name": "temperature_2_calibration_settings" },
        "7F": { "level": 1, "name": "d2d_slave_enable" },
        "80": { "level": 2, "name": "d2d_slave_settings" },
        "81": { "level": 2, "name": "schedule_settings" },
        "C6": { "level": 1, "name": "daylight_saving_time" },
        "C7": { "level": 1, "name": "time_zone" },
    }

    var cmd = readHexString(bytes.slice(0, 1));
    var cmd_level = name_map[cmd].level;

    if (cmd_level != 0) {
        var buffer = new Buffer(2 + cmd_level);
        buffer.writeUInt8(0xef);
        buffer.writeUInt8(cmd_level);
        buffer.writeBytes(bytes.slice(0, cmd_level));
        return buffer.toBytes();
    }
    return [];
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

Buffer.prototype.writeBytes = function (bytes) {
    for (var i = 0; i < bytes.length; i++) {
        this.buffer[this.offset + i] = bytes[i];
    }
    this.offset += bytes.length;
};

Buffer.prototype.writeHexString = function (hexString) {
    var bytes = [];
    for (var i = 0; i < hexString.length; i += 2) {
        bytes.push(parseInt(hexString.substr(i, 2), 16));
    }
    this.writeBytes(bytes);
}

Buffer.prototype.writeHexStringReverse = function (hexString) {
    var bytes = [];
    for (var i = hexString.length - 2; i >= 0; i -= 2) {
        bytes.push(parseInt(hexString.substr(i, 2), 16));
    }
    this.writeBytes(bytes);
}

Buffer.prototype.toBytes = function () {
    return this.buffer;
};

function encodeUtf8(str) {
    var byteArray = [];
    for (var i = 0; i < str.length; i++) {
        var charCode = str.charCodeAt(i);
        if (charCode < 0x80) {
            byteArray.push(charCode);
        } else if (charCode < 0x800) {
            byteArray.push(0xc0 | (charCode >> 6));
            byteArray.push(0x80 | (charCode & 0x3f));
        } else if (charCode < 0x10000) {
            byteArray.push(0xe0 | (charCode >> 12));
            byteArray.push(0x80 | ((charCode >> 6) & 0x3f));
            byteArray.push(0x80 | (charCode & 0x3f));
        } else if (charCode < 0x200000) {
            byteArray.push(0xf0 | (charCode >> 18));
            byteArray.push(0x80 | ((charCode >> 12) & 0x3f));
            byteArray.push(0x80 | ((charCode >> 6) & 0x3f));
            byteArray.push(0x80 | (charCode & 0x3f));
        }
    }
    return byteArray;
}

function readHexString(bytes) {
    var temp = [];
    for (var idx = 0; idx < bytes.length; idx++) {
        temp.push(("0" + (bytes[idx] & 0xff).toString(16)).slice(-2));
    }
    return temp.join("");
}