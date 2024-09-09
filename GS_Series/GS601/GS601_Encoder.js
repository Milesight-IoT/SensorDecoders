/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product GS601
 */
var RAW_VALUE = 0x00;

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

    if ("reporting_interval" in payload) {
        encoded = encoded.concat(setReportingInterval(payload.reporting_interval));
    }
    if ("temperature_unit" in payload) {
        encoded = encoded.concat(setTemperatureUnit(payload.temperature_unit));
    }
    if ("led_status" in payload) {
        encoded = encoded.concat(setLedStatus(payload.led_status));
    }
    if ("buzzer_enable" in payload) {
        encoded = encoded.concat(setBuzzerEnable(payload.buzzer_enable));
    }
    if ("buzzer_sleep" in payload) {
        if ("item_1" in payload.buzzer_sleep) {
            encoded = encoded.concat(setBuzzerSleepSettings(0, payload.buzzer_sleep.item_1));
        }
        if ("item_2" in payload.buzzer_sleep) {
            encoded = encoded.concat(setBuzzerSleepSettings(1, payload.buzzer_sleep.item_2));
        }
    }
    if ("buzzer_button_stop_enable" in payload) {
        encoded = encoded.concat(setBuzzerButtonStopEnable(payload.buzzer_button_stop_enable));
    }
    if ("buzzer_silent_time" in payload) {
        encoded = encoded.concat(setBuzzerSilentTime(payload.buzzer_silent_time));
    }
    if ("tamper_alarm_enable" in payload) {
        encoded = encoded.concat(setTamperAlarmEnable(payload.tamper_alarm_enable));
    }
    if ("tvoc_raw_reporting_enable" in payload) {
        encoded = encoded.concat(setTvocRawReportingEnable(payload.tvoc_raw_reporting_enable));
    }
    if ("temperature_alarm_settings" in payload) {
        encoded = encoded.concat(setTemperatureAlarmSettings(payload.temperature_alarm_settings));
    }
    if ("pm1_0_alarm_settings" in payload) {
        encoded = encoded.concat(setPM1AlarmSettings(payload.pm1_0_alarm_settings));
    }
    if ("pm2_5_alarm_settings" in payload) {
        encoded = encoded.concat(setPM25AlarmSettings(payload.pm2_5_alarm_settings));
    }
    if ("pm10_alarm_settings" in payload) {
        encoded = encoded.concat(setPM10AlarmSettings(payload.pm10_alarm_settings));
    }
    if ("tvoc_alarm_settings" in payload) {
        encoded = encoded.concat(setTVOCAlarmSettings(payload.tvoc_alarm_settings));
    }
    if ("vaping_index_alarm_settings" in payload) {
        encoded = encoded.concat(setVapingIndexAlarmSettings(payload.vaping_index_alarm_settings));
    }
    if ("alarm_reporting_times" in payload) {
        encoded = encoded.concat(setAlarmReportingTimes(payload.alarm_reporting_times));
    }
    if ("alarm_deactivation_enable" in payload) {
        encoded = encoded.concat(setAlarmDeactivateEnable(payload.alarm_deactivation_enable));
    }
    if ("temperature_calibration_settings" in payload) {
        encoded = encoded.concat(setTemperatureCalibrationSettings(payload.temperature_calibration_settings));
    }
    if ("humidity_calibration_settings" in payload) {
        encoded = encoded.concat(setHumidityCalibrationSettings(payload.humidity_calibration_settings));
    }
    if ("pm1_0_calibration_settings" in payload) {
        encoded = encoded.concat(setPM1CalibrationSettings(payload.pm1_0_calibration_settings));
    }
    if ("pm2_5_calibration_settings" in payload) {
        encoded = encoded.concat(setPM25CalibrationSettings(payload.pm2_5_calibration_settings));
    }
    if ("pm10_calibration_settings" in payload) {
        encoded = encoded.concat(setPM10CalibrationSettings(payload.pm10_calibration_settings));
    }
    if ("tvoc_calibration_settings" in payload) {
        encoded = encoded.concat(setTVOCCalibrationSettings(payload.tvoc_calibration_settings));
    }
    if ("vaping_index_calibration_settings" in payload) {
        encoded = encoded.concat(setVapingIndexCalibrationSettings(payload.vaping_index_calibration_settings));
    }
    if ("time_zone" in payload) {
        encoded = encoded.concat(setTimeZone(payload.time_zone));
    }
    if ("daylight_saving_time" in payload) {
        encoded = encoded.concat(setDaylightSavingTimeSettings(payload.daylight_saving_time));
    }
    if ("reboot" in payload) {
        encoded = encoded.concat(reboot());
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
    if ("stop_buzzer_alarm" in payload) {
        encoded = encoded.concat(stopBuzzerAlarm());
    }
    if ("execute_tvoc_self_clean" in payload) {
        encoded = encoded.concat(executeTVOCSelfClean());
    }

    return encoded;
}

/**
 * Set report interval
 * @param {object} reporting_interval
 * @param {number} reporting_interval.unit values: (0: second, 1: minute)
 * @param {number} reporting_interval.seconds_of_time unit: second
 * @param {number} reporting_interval.minutes_of_time unit: minute
 * @example { "reporting_interval": { "unit": 0, "seconds_of_time": 300 } }
 */
function setReportingInterval(reporting_interval) {
    var unit = reporting_interval.unit;
    var seconds_of_time = reporting_interval.seconds_of_time;
    var minutes_of_time = reporting_interval.minutes_of_time;

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

    var buffer = new Buffer(3);
    buffer.writeUInt8(0x60);
    buffer.writeUInt8(getValue(unit_map, unit));
    buffer.writeUInt16LE(getValue(unit_map, unit) === 0 ? seconds_of_time : minutes_of_time);
    return buffer.toBytes();
}

/**
 * Set temperature unit
 * @param {number} temperature_unit values: (0: celsius, 1: fahrenheit)
 * @example { "temperature_unit": 0 }
 */
function setTemperatureUnit(temperature_unit) {
    var unit_map = { 0: "celsius", 1: "fahrenheit" };
    var unit_values = getValues(unit_map);
    if (unit_values.indexOf(temperature_unit) === -1) {
        throw new Error("temperature_unit must be one of " + unit_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x61);
    buffer.writeUInt8(getValue(unit_map, temperature_unit));
    return buffer.toBytes();
}

/**
 * Set led indicator
 * @param {number} led_status values: (0: disable, 1: enable)
 * @example { "led_status": 1 }
 */
function setLedStatus(led_status) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(led_status) === -1) {
        throw new Error("led_status must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x62);
    buffer.writeUInt8(getValue(enable_map, led_status));
    return buffer.toBytes();
}

/**
 * Set buzzer enable
 * @param {number} buzzer_enable values: (0: disable, 1: enable)
 * @example { "buzzer_enable": 1 }
 */
function setBuzzerEnable(buzzer_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(buzzer_enable) === -1) {
        throw new Error("buzzer_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x63);
    buffer.writeUInt8(getValue(enable_map, buzzer_enable));
    return buffer.toBytes();
}

/**
 * Set buzzer sleep settings
 * @param {number} index
 * @param {object} buzzer_sleep_config
 * @param {number} buzzer_sleep_config.enable values: (0: disable, 1: enable)
 * @param {number} buzzer_sleep_config.start_time unit: minute
 * @param {number} buzzer_sleep_config.end_time unit: minute
 * @example { "buzzer_sleep": { "item_1": { "enable": 1, "start_time": 0, "end_time": 1440 }, "item_2": { "enable": 1, "start_time": 0, "end_time": 1440 }} }
 */
function setBuzzerSleepSettings(index, buzzer_sleep_config) {
    var enable = buzzer_sleep_config.enable;
    var start_time = buzzer_sleep_config.start_time;
    var end_time = buzzer_sleep_config.end_time;

    var index_values = [0, 1];
    if (index_values.indexOf(index) === -1) {
        throw new Error("buzzer_sleep.item_1 or buzzer_sleep.item_2");
    }
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("buzzer_sleep.item_" + index + ".enable must be one of " + enable_values.join(", "));
    }
    if (start_time < 0 || start_time > 1440) {
        throw new Error("buzzer_sleep.item_" + index + ".start_time must be between 0 and 1440");
    }
    if (end_time < 0 || end_time > 1440) {
        throw new Error("buzzer_sleep.item_" + index + ".end_time must be between 0 and 1440");
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0x64);
    buffer.writeUInt8(index);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt16LE(start_time);
    buffer.writeUInt16LE(end_time);
    return buffer.toBytes();
}

/**
 * Set buzzer button stop enable
 * @param {number} buzzer_button_stop_enable values: (0: disable, 1: enable)
 * @example { "buzzer_button_stop_enable": 1 }
 */
function setBuzzerButtonStopEnable(buzzer_button_stop_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(buzzer_button_stop_enable) === -1) {
        throw new Error("buzzer_button_stop_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x65);
    buffer.writeUInt8(getValue(enable_map, buzzer_button_stop_enable));
    return buffer.toBytes();
}

/**
 * Set buzzer silent time
 * @param {number} buzzer_silent_time unit: minute, range: 1-1440
 * @example { "buzzer_silent_time": 10 }
 */
function setBuzzerSilentTime(buzzer_silent_time) {
    if (buzzer_silent_time < 1 || buzzer_silent_time > 1440) {
        throw new Error("buzzer_silent_time must be between 1 and 1440");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0x66);
    buffer.writeUInt16LE(buzzer_silent_time);
    return buffer.toBytes();
}

/**
 * Set tamper alarm enable
 * @param {number} tamper_alarm_enable values: (0: disable, 1: enable)
 * @example { "tamper_alarm_enable": 1 }
 */
function setTamperAlarmEnable(tamper_alarm_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(tamper_alarm_enable) === -1) {
        throw new Error("tamper_alarm_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x67);
    buffer.writeUInt8(getValue(enable_map, tamper_alarm_enable));
    return buffer.toBytes();
}

/**
 * Set tvoc raw data report
 * @param {number} tvoc_raw_reporting_enable values: (0: disable, 1: enable)
 * @example { "tvoc_raw_reporting_enable": 1 }
 */
function setTvocRawReportingEnable(tvoc_raw_reporting_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(tvoc_raw_reporting_enable) === -1) {
        throw new Error("tvoc_raw_reporting_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x68);
    buffer.writeUInt8(getValue(enable_map, tvoc_raw_reporting_enable));
    return buffer.toBytes();
}

/**
 * Set temperature alarm settings
 * @param {object} temperature_alarm_settings
 * @param {number} temperature_alarm_settings.enable values: (0: disable, 1: enable)
 * @param {number} temperature_alarm_settings.threshold_condition values: (1: below, 2: above, 3: between, 4: outside)
 * @param {number} temperature_alarm_settings.threshold_min unit: Celsius
 * @param {number} temperature_alarm_settings.threshold_max unit: Celsius
 * @example { "temperature_alarm_settings": { "enable": 1, "threshold_condition": 2, "threshold_min": 30, "threshold_max": 40 } }
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
    var threshold_condition_map = { 1: "below", 2: "above", 3: "between", 4: "outside" };
    var threshold_condition_values = getValues(threshold_condition_map);
    if (threshold_condition_values.indexOf(threshold_condition) === -1) {
        throw new Error("temperature_alarm_settings.threshold_condition must be one of " + threshold_condition_values.join(", "));
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0x69);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(getValue(threshold_condition_map, threshold_condition));
    buffer.writeInt16LE(threshold_min * 10);
    buffer.writeInt16LE(threshold_max * 10);
    return buffer.toBytes();
}

/**
 * Set pm1.0 alarm settings
 * @param {object} pm1_0_alarm_settings
 * @param {number} pm1_0_alarm_settings.enable values: (0: disable, 1: enable)
 * @param {number} pm1_0_alarm_settings.threshold_condition values: (1: below, 2: above, 3: between, 4: outside)
 * @param {number} pm1_0_alarm_settings.threshold_min unit: mg/m3
 * @param {number} pm1_0_alarm_settings.threshold_max unit: mg/m3
 * @example { "pm1_0_alarm_settings": { "enable": 1, "condition": 2, "min_value": 30, "max_value": 40 } }
 */
function setPM1AlarmSettings(pm1_0_alarm_settings) {
    var enable = pm1_0_alarm_settings.enable;
    var threshold_condition = pm1_0_alarm_settings.threshold_condition;
    var threshold_min = pm1_0_alarm_settings.threshold_min;
    var threshold_max = pm1_0_alarm_settings.threshold_max;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("pm1_0_alarm_settings.enable must be one of " + enable_values.join(", "));
    }
    var threshold_condition_map = { 1: "below", 2: "above", 3: "between", 4: "outside" };
    var threshold_condition_values = getValues(threshold_condition_map);
    if (threshold_condition_values.indexOf(threshold_condition) === -1) {
        throw new Error("pm1_0_alarm_settings.threshold_condition must be one of " + threshold_condition_values.join(", "));
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0x6a);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(getValue(threshold_condition_map, threshold_condition));
    buffer.writeInt16LE(threshold_min * 10);
    buffer.writeInt16LE(threshold_max * 10);
    return buffer.toBytes();
}

/**
 * Set pm2.5 threshold config
 * @param {object} pm2_5_alarm_settings
 * @param {number} pm2_5_alarm_settings.enable values: (0: disable, 1: enable)
 * @param {number} pm2_5_alarm_settings.threshold_condition values: (1: below, 2: above, 3: between, 4: outside)
 * @param {number} pm2_5_alarm_settings.threshold_min unit: mg/m3
 * @param {number} pm2_5_alarm_settings.threshold_max unit: mg/m3
 * @example { "pm2_5_alarm_settings": { "enable": 1, "threshold_condition": 2, "threshold_min": 30, "threshold_max": 40 } }
 */
function setPM25AlarmSettings(pm2_5_alarm_settings) {
    var enable = pm2_5_alarm_settings.enable;
    var threshold_condition = pm2_5_alarm_settings.threshold_condition;
    var threshold_min = pm2_5_alarm_settings.threshold_min;
    var threshold_max = pm2_5_alarm_settings.threshold_max;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("pm_2_5_alarm_settings.enable must be one of " + enable_values.join(", "));
    }
    var threshold_condition_map = { 1: "below", 2: "above", 3: "between", 4: "outside" };
    var threshold_condition_values = getValues(threshold_condition_map);
    if (threshold_condition_values.indexOf(threshold_condition) === -1) {
        throw new Error("pm_2_5_alarm_settings.threshold_condition must be one of " + threshold_condition_values.join(", "));
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0x6b);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(getValue(threshold_condition_map, threshold_condition));
    buffer.writeInt16LE(threshold_min * 10);
    buffer.writeInt16LE(threshold_max * 10);
    return buffer.toBytes();
}

/**
 * Set pm10 threshold config
 * @param {object} pm10_alarm_settings
 * @param {number} pm10_alarm_settings.enable values: (0: disable, 1: enable)
 * @param {number} pm10_alarm_settings.threshold_condition values: (1: below, 2: above, 3: between, 4: outside)
 * @param {number} pm10_alarm_settings.threshold_min unit: mg/m3
 * @param {number} pm10_alarm_settings.threshold_max unit: mg/m3
 * @example { "pm10_alarm_settings": { "enable": 1, "threshold_condition": 2, "threshold_min": 30, "threshold_max": 40 } }
 */
function setPM10AlarmSettings(pm10_alarm_settings) {
    var enable = pm10_alarm_settings.enable;
    var threshold_condition = pm10_alarm_settings.threshold_condition;
    var threshold_min = pm10_alarm_settings.threshold_min;
    var threshold_max = pm10_alarm_settings.threshold_max;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("pm_10_alarm_settings.enable must be one of " + enable_values.join(", "));
    }
    var threshold_condition_map = { 1: "below", 2: "above", 3: "between", 4: "outside" };
    var threshold_condition_values = getValues(threshold_condition_map);
    if (threshold_condition_values.indexOf(threshold_condition) === -1) {
        throw new Error("pm_10_alarm_settings.threshold_condition must be one of " + threshold_condition_values.join(", "));
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0x6c);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(getValue(threshold_condition_map, threshold_condition));
    buffer.writeInt16LE(threshold_min * 10);
    buffer.writeInt16LE(threshold_max * 10);
    return buffer.toBytes();
}

/**
 * Set tvoc alarm settings
 *
 * @param {object} tvoc_alarm_settings
 * @param {number} tvoc_alarm_settings.enable values: (0: disable, 1: enable)
 * @param {number} tvoc_alarm_settings.threshold_condition values: (1: below, 2: above, 3: between, 4: outside)
 * @param {number} tvoc_alarm_settings.threshold_min unit: ppm
 * @param {number} tvoc_alarm_settings.threshold_max unit: ppm
 * @example { "tvoc_alarm_settings": { "enable": 1, "threshold_condition": 2, "threshold_min": 30, "threshold_max": 40 } }
 */
function setTVOCAlarmSettings(tvoc_alarm_settings) {
    var enable = tvoc_alarm_settings.enable;
    var threshold_condition = tvoc_alarm_settings.threshold_condition;
    var threshold_min = tvoc_alarm_settings.threshold_min;
    var threshold_max = tvoc_alarm_settings.threshold_max;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("tvoc_alarm_settings.enable must be one of " + enable_values.join(", "));
    }
    var condition_map = { 1: "below", 2: "above", 3: "between", 4: "outside" };
    var threshold_condition_values = getValues(condition_map);
    if (threshold_condition_values.indexOf(threshold_condition) === -1) {
        throw new Error("tvoc_alarm_settings.threshold_condition must be one of " + threshold_condition_values.join(", "));
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0x6d);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(getValue(condition_map, threshold_condition));
    buffer.writeInt16LE(threshold_min);
    buffer.writeInt16LE(threshold_max);
    return buffer.toBytes();
}

/**
 * Set vaping index alarm settings
 * @param {object} vaping_index_alarm_settings
 * @param {number} vaping_index_alarm_settings.enable values: (0: disable, 1: enable)
 * @param {number} vaping_index_alarm_settings.threshold_condition values: (1: below, 2: above, 3: between, 4: outside)
 * @param {number} vaping_index_alarm_settings.threshold_min
 * @param {number} vaping_index_alarm_settings.threshold_max
 * @example { "vaping_index_alarm_settings": { "enable": 1, "threshold_condition": 2, "threshold_min": 1, "threshold_max": 4 } }
 */
function setVapingIndexAlarmSettings(vaping_index_alarm_settings) {
    var enable = vaping_index_alarm_settings.enable;
    var threshold_condition = vaping_index_alarm_settings.threshold_condition;
    var threshold_min = vaping_index_alarm_settings.threshold_min;
    var threshold_max = vaping_index_alarm_settings.threshold_max;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("vaping_index_alarm_settings.enable must be one of " + enable_values.join(", "));
    }
    var threshold_condition_map = { 1: "below", 2: "above", 3: "between", 4: "outside" };
    var threshold_condition_values = getValues(threshold_condition_map);
    if (threshold_condition_values.indexOf(threshold_condition) === -1) {
        throw new Error("vaping_index_alarm_settings.threshold_condition must be one of " + threshold_condition_values.join(", "));
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0x6e);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(getValue(threshold_condition_map, threshold_condition));
    buffer.writeInt16LE(threshold_min);
    buffer.writeInt16LE(threshold_max);
    return buffer.toBytes();
}

/**
 * Set alarm reporting times
 * @param {number} alarm_reporting_times range: [1, 1000]
 * @example { "alarm_reporting_times": 10 }
 */
function setAlarmReportingTimes(alarm_reporting_times) {
    if (alarm_reporting_times < 1 || alarm_reporting_times > 1000) {
        throw new Error("alarm_reporting_times must be between 1 and 1000");
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x6f);
    buffer.writeUInt16LE(alarm_reporting_times);
    return buffer.toBytes();
}

/**
 * Set alarm deactivate enable
 * @param {object} alarm_deactivate_settings
 * @param {number} alarm_deactivate_settings.enable values: (0: disable, 1: enable)
 * @example { "alarm_deactivate_settings": { "enable": 1 } }
 */
function setAlarmDeactivateEnable(alarm_deactivate_settings) {
    var enable = alarm_deactivate_settings.enable;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("alarm_deactivate_settings.enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x70);
    buffer.writeUInt8(getValue(enable_map, enable));
    return buffer.toBytes();
}

/**
 * Set temperature calibration config
 * @param {object} temperature_calibration_settings
 * @param {number} temperature_calibration_settings.enable values: (0: disable, 1: enable)
 * @param {number} temperature_calibration_settings.calibration_value unit: Celsius, range: [-80, 80]
 * @example { "temperature_calibration_settings": { "enable": 1, "calibration_value": 20 } }
 */
function setTemperatureCalibrationSettings(temperature_calibration_settings) {
    var enable = temperature_calibration_settings.enable;
    var calibration_value = temperature_calibration_settings.calibration_value;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("temperature_calibration_settings.enable must be one of " + enable_values.join(", "));
    }
    if (calibration_value < -80 || calibration_value > 80) {
        throw new Error("temperature_calibration_settings.calibration_value must be between -80 and 80");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0x71);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeInt16LE(calibration_value * 10);
    return buffer.toBytes();
}

/**
 * Set humidity calibration config
 * @param {object} humidity_calibration_settings
 * @param {number} humidity_calibration_settings.enable values: (0: disable, 1: enable)
 * @param {number} humidity_calibration_settings.calibration_value unit: %, range: [-100, 100]
 * @example { "humidity_calibration_settings": { "enable": 1, "calibration_value": 50 } }
 */
function setHumidityCalibrationSettings(humidity_calibration_settings) {
    var enable = humidity_calibration_settings.enable;
    var calibration_value = humidity_calibration_settings.calibration_value;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("humidity_calibration_settings.enable must be one of " + enable_values.join(", "));
    }
    if (calibration_value < -100 || calibration_value > 100) {
        throw new Error("humidity_calibration_settings.calibration_value must be between -100 and 100");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0x72);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeInt16LE(calibration_value * 10);
    return buffer.toBytes();
}

/**
 * Set pm1 calibration config
 * @param {object} pm1_calibration_settings
 * @param {number} pm1_calibration_settings.enable values: (0: disable, 1: enable)
 * @param {number} pm1_calibration_settings.calibration_value unit: mg/m3, range: [-1000, 1000]
 * @example { "pm1_0_calibration_settings": { "enable": 1, "calibration_value": 10 } }
 */
function setPM1CalibrationSettings(pm1_0_calibration_settings) {
    var enable = pm1_0_calibration_settings.enable;
    var calibration_value = pm1_0_calibration_settings.calibration_value;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("pm1_0_calibration_settings.enable must be one of " + enable_values.join(", "));
    }
    if (calibration_value < -1000 || calibration_value > 1000) {
        throw new Error("pm1_0_calibration_settings.calibration_value must be between -1000 and 1000");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0x73);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeInt16LE(calibration_value);
    return buffer.toBytes();
}

/**
 * Set pm2.5 calibration config
 * @param {object} pm2_5_calibration_settings
 * @param {number} pm2_5_calibration_settings.enable values: (0: disable, 1: enable)
 * @param {number} pm2_5_calibration_settings.calibration_value unit: mg/m3, range: [-1000, 1000]
 * @example { "pm2_5_calibration_settings": { "enable": 1, "calibration_value": 10 } }
 */
function setPM25CalibrationSettings(pm2_5_calibration_settings) {
    var enable = pm2_5_calibration_settings.enable;
    var calibration_value = pm2_5_calibration_settings.calibration_value;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("pm2_5_calibration_settings.enable must be one of " + enable_values.join(", "));
    }
    if (calibration_value < -1000 || calibration_value > 1000) {
        throw new Error("pm2_5_calibration_settings.calibration_value must be between -1000 and 1000");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0x74);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeInt16LE(calibration_value);
    return buffer.toBytes();
}

/**
 * Set pm10 calibration config
 * @param {object} pm10_calibration_settings
 * @param {number} pm10_calibration_settings.enable values: (0: disable, 1: enable)
 * @param {number} pm10_calibration_settings.calibration_value unit: mg/m3, range: [-1000, 1000]
 * @example { "pm10_calibration_settings": { "enable": 1, "calibration_value": 10 } }
 */
function setPM10CalibrationSettings(pm10_calibration_settings) {
    var enable = pm10_calibration_settings.enable;
    var calibration_value = pm10_calibration_settings.calibration_value;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("pm10_calibration_settings.enable must be one of " + enable_values.join(", "));
    }
    if (calibration_value < -1000 || calibration_value > 1000) {
        throw new Error("pm10_calibration_settings.calibration_value must be between -1000 and 1000");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0x75);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeInt16LE(calibration_value);
    return buffer.toBytes();
}

/**
 * Set tvoc calibration settings
 * @param {object} tvoc_calibration_settings
 * @param {number} tvoc_calibration_settings.enable values: (0: disable, 1: enable)
 * @param {number} tvoc_calibration_settings.calibration_value unit: ppm, range: [-2000, 2000]
 * @example { "tvoc_calibration_settings": { "enable": 1, "calibration_value": 10 } }
 */
function setTVOCCalibrationSettings(tvoc_calibration_settings) {
    var enable = tvoc_calibration_settings.enable;
    var calibration_value = tvoc_calibration_settings.calibration_value;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("tvoc_calibration_settings.enable must be one of " + enable_values.join(", "));
    }
    if (calibration_value < -2000 || calibration_value > 2000) {
        throw new Error("tvoc_calibration_settings.calibration_value must be between -2000 and 2000");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0x76);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeInt16LE(calibration_value);
    return buffer.toBytes();
}

/**
 * Set vaping index calibration settings
 * @param {object} vaping_index_calibration_settings
 * @param {number} vaping_index_calibration_settings.enable values: (0: disable, 1: enable)
 * @param {number} vaping_index_calibration_settings.calibration_value range: [-100, 100]
 * @example { "vaping_index_calibration_settings": { "enable": 1, "calibration_value": 10 } }
 */
function setVapingIndexCalibrationSettings(vaping_index_calibration_settings) {
    var enable = vaping_index_calibration_settings.enable;
    var calibration_value = vaping_index_calibration_settings.calibration_value;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("vaping_index_calibration_settings.enable must be one of " + enable_values.join(", "));
    }
    if (calibration_value < -100 || calibration_value > 100) {
        throw new Error("vaping_index_calibration_settings.calibration_value must be between -100 and 100");
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x77);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeInt8(calibration_value);
    return buffer.toBytes();
}

/**
 * Set Timezone
 *
 * @param {number} time_zone values: (-720: UTC-12, -660: UTC-11, -600: UTC-10, -570: UTC-9:30, -540: UTC-9, -480: UTC-8,
 *                                  -420: UTC-7, -360: UTC-6, -300: UTC-5, -240: UTC-4, -210: UTC-3:30, -180: UTC-3, -120: UTC-2, -60: UTC-1,
 *                                  0: UTC, 60: UTC+1, 120: UTC+2, 180: UTC+3, 210: UTC+3:30, 240: UTC+4, 270: UTC+4:30, 300: UTC+5, 330: UTC+5:30,
 *                                  345: UTC+5:45, 360: UTC+6, 390: UTC+6:30, 420: UTC+7, 480: UTC+8, 540: UTC+9, 570: UTC+9:30, 600: UTC+10, 630: UTC+10:30,
 *                                  660: UTC+11, 720: UTC+12, 765: UTC+12:45, 780: UTC+13, 840: UTC+14)
 * @example { "time_zone": 480 }
 */
function setTimeZone(time_zone) {
    var timezone_map = { "-720": "UTC-12", "-660": "UTC-11", "-600": "UTC-10", "-570": "UTC-9:30", "-540": "UTC-9", "-480": "UTC-8", "-420": "UTC-7", "-360": "UTC-6", "-300": "UTC-5", "-240": "UTC-4", "-210": "UTC-3:30", "-180": "UTC-3", "-120": "UTC-2", "-60": "UTC-1", 0: "UTC", 60: "UTC+1", 120: "UTC+2", 180: "UTC+3", 210: "UTC+3:30", 240: "UTC+4", 270: "UTC+4:30", 300: "UTC+5", 330: "UTC+5:30", 345: "UTC+5:45", 360: "UTC+6", 390: "UTC+6:30", 420: "UTC+7", 480: "UTC+8", 540: "UTC+9", 570: "UTC+9:30", 600: "UTC+10", 630: "UTC+10:30", 660: "UTC+11", 720: "UTC+12", 765: "UTC+12:45", 780: "UTC+13", 840: "UTC+14" };
    var timezone_values = getValues(timezone_map);
    if (timezone_values.indexOf(time_zone) === -1) {
        throw new Error("time_zone must be one of " + timezone_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0xc7);
    buffer.writeInt16LE(getValue(timezone_map, time_zone));
    return buffer.toBytes();
}

/**
 * Set daylight saving time settings
 * @param {object} daylight_saving_time
 * @param {number} daylight_saving_time.enable values: (0: disable, 1: enable)
 * @param {number} daylight_saving_time.offset unit: minutes
 * @param {number} daylight_saving_time.start_month values: (1: January, 2: February, 3: March, 4: April, 5: May, 6: June, 7: July, 8: August, 9: September, 10: October, 11: November, 12: December)
 * @param {number} daylight_saving_time.start_week_num values: (1: First week, 2: Second week, 3: Third week, 4: Fourth week, 5: Last week)
 * @param {number} daylight_saving_time.start_week_day values: (1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday, 7: Sunday)
 * @param {number} daylight_saving_time.start_hour_min unit: minutes
 * @param {number} daylight_saving_time.end_month values: (1: January, 2: February, 3: March, 4: April, 5: May, 6: June, 7: July, 8: August, 9: September, 10: October, 11: November, 12: December)
 * @param {number} daylight_saving_time.end_week_num values: (1: First week, 2: Second week, 3: Third week, 4: Fourth week, 5: Last week)
 * @param {number} daylight_saving_time.end_week_day values: (1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday, 7: Sunday)
 * @param {number} daylight_saving_time.end_hour_min unit: minutes
 * @example { "daylight_saving_time": { "enable": 1, "offset": 60, "start_month": 3, "start_week": 1, "start_day": 1, "start_time": 0, "end_month": 11, "end_week": 4, "end_day": 7, "end_time": 120 } }
 */
function setDaylightSavingTimeSettings(daylight_saving_time) {
    var enable = daylight_saving_time.enable;
    var offset = daylight_saving_time.offset;
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
        throw new Error("daylight_saving_time.enable must be one of " + enable_values.join(", "));
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
    buffer.writeInt8(offset);
    buffer.writeUInt8(start_month);
    buffer.writeUInt8(start_day_value);
    buffer.writeUInt16LE(start_hour_min);
    buffer.writeUInt8(end_month);
    buffer.writeUInt8(end_day_value);
    buffer.writeUInt16LE(end_hour_min);
    return buffer.toBytes();
}

/**
 * Reboot
 */
function reboot() {
    var buffer = new Buffer(1);
    buffer.writeUInt8(0xbe);
    return buffer.toBytes();
}

/**
 * Synchronize time
 *
 * @example { "synchronize_time": 1 }
 */
function synchronizeTime() {
    var buffer = new Buffer(1);
    buffer.writeUInt8(0xb8);
    return buffer.toBytes();
}

/**
 * Query device status
 *
 * @example { "query_device_status": 1 }
 */
function queryDeviceStatus() {
    var buffer = new Buffer(1);
    buffer.writeUInt8(0xb9);
    return buffer.toBytes();
}

/**
 * Reconnect
 *
 * @example { "reconnect": 1 }
 */
function reconnect() {
    var buffer = new Buffer(1);
    buffer.writeUInt8(0xb6);
    return buffer.toBytes();
}

/**
 * Stop buzzer alarm
 *
 * @example { "stop_buzzer_alarm": 1 }
 */
function stopBuzzerAlarm() {
    var buffer = new Buffer(1);
    buffer.writeUInt8(0x5f);
    return buffer.toBytes();
}

/**
 * Execute TVOC self clean
 *
 * @example { "execute_tvoc_self_clean": 1 }
 */
function executeTVOCSelfClean() {
    var buffer = new Buffer(1);
    buffer.writeUInt8(0x5e);
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
