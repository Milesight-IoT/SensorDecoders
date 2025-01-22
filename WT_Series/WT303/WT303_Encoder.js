/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product WT303
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

    if ("collection_interval" in payload) {
        encoded = encoded.concat(setCollectionInterval(payload.collection_interval));
    }
    if ("ntc_collection_interval" in payload) {
        encoded = encoded.concat(setNtcCollectionInterval(payload.ntc_collection_interval));
    }
    if ("reporting_interval" in payload) {
        encoded = encoded.concat(setReportingInterval(payload.reporting_interval));
    }
    if ("temperature_unit" in payload) {
        encoded = encoded.concat(setTemperatureUnit(payload.temperature_unit));
    }
    if ("support_mode_config" in payload) {
        encoded = encoded.concat(setSupportModeConfig(payload.support_mode_config));
    }
    if ("smart_display_config" in payload) {
        encoded = encoded.concat(setSmartDisplayConfig(payload.smart_display_config));
    }
    if ("display_config" in payload) {
        encoded = encoded.concat(setDisplayConfig(payload.display_config));
    }
    if ("system_status" in payload) {
        encoded = encoded.concat(controlSystemStatus(payload.system_status));
    }
    if ("temperature_control_mode" in payload) {
        encoded = encoded.concat(setTemperatureControlMode(payload.temperature_control_mode));
    }
    if ("target_temperature_resolution" in payload) {
        encoded = encoded.concat(setTargetTemperatureResolution(payload.target_temperature_resolution));
    }
    if ("target_temperature_tolerance" in payload) {
        encoded = encoded.concat(setTargetTemperatureTolerance(payload.target_temperature_tolerance));
    }
    if ("heating_target_temperature" in payload) {
        encoded = encoded.concat(setHeatingTargetTemperature(payload.heating_target_temperature));
    }
    if ("cooling_target_temperature" in payload) {
        encoded = encoded.concat(setCoolingTargetTemperature(payload.cooling_target_temperature));
    }
    if ("heating_target_temperature_range" in payload) {
        encoded = encoded.concat(setHeatingTargetTemperatureRange(payload.heating_target_temperature_range));
    }
    if ("cooling_target_temperature_range" in payload) {
        encoded = encoded.concat(setCoolingTargetTemperatureRange(payload.cooling_target_temperature_range));
    }
    if ("dehumidify_config" in payload) {
        encoded = encoded.concat(setDehumidifyConfig(payload.dehumidify_config));
    }
    if ("temperature_abnormal_config" in payload) {
        encoded = encoded.concat(setTemperatureAbnormalConfig(payload.temperature_abnormal_config));
    }
    if ("fan_mode" in payload) {
        encoded = encoded.concat(setFanMode(payload.fan_mode));
    }
    if ("fan_speed_config" in payload) {
        encoded = encoded.concat(setFanSpeedConfig(payload.fan_speed_config));
    }
    if ("fan_delay_config" in payload) {
        encoded = encoded.concat(setFanDelayConfig(payload.fan_delay_config));
    }
    if ("child_lock_config" in payload) {
        encoded = encoded.concat(setChildLockConfig(payload.child_lock_config));
    }
    if ("temperature_alarm_settings" in payload) {
        encoded = encoded.concat(setTemperatureAlarmSettings(payload.temperature_alarm_settings));
    }
    if ("continuous_high_temperature_alarm_settings" in payload) {
        encoded = encoded.concat(setContinuousHighTemperatureAlarmSettings(payload.continuous_high_temperature_alarm_settings));
    }
    if ("continuous_low_temperature_alarm_settings" in payload) {
        encoded = encoded.concat(setContinuousLowTemperatureAlarmSettings(payload.continuous_low_temperature_alarm_settings));
    }
    if ("temperature_calibration_config" in payload) {
        encoded = encoded.concat(setTemperatureCalibrationConfig(payload.temperature_calibration_config));
    }
    if ("humidity_calibration_config" in payload) {
        encoded = encoded.concat(setHumidityCalibrationConfig(payload.humidity_calibration_config));
    }
    if ("plan_config" in payload) {
        for (var i = 0; i < payload.plan_config.length; i++) {
            encoded = encoded.concat(setPlanConfig(payload.plan_config[i]));
        }
    }
    if ("valve_mode" in payload) {
        encoded = encoded.concat(setValveMode(payload.valve_mode));
    }
    if ("di_enable" in payload) {
        encoded = encoded.concat(setDIEnable(payload.di_enable));
    }
    if ("card_config" in payload) {
        for (var i = 0; i < payload.card_config.length; i++) {
            encoded = encoded.concat(setCardConfig(payload.card_config[i]));
        }
    }
    if ("open_window_config" in payload) {
        encoded = encoded.concat(setOpenWindowConfig(payload.open_window_config));
    }
    if ("freeze_protection_config" in payload) {
        encoded = encoded.concat(setFreezeProtectionConfig(payload.freeze_protection_config));
    }
    if ("temperature_source_config" in payload) {
        encoded = encoded.concat(setTemperatureSourceConfig(payload.temperature_source_config));
    }
    if ("d2d_enable" in payload) {
        encoded = encoded.concat(setD2DEnable(payload.d2d_enable));
    }
    if ("d2d_filter_config" in payload) {
        for (var i = 0; i < payload.d2d_filter_config.length; i++) {
            encoded = encoded.concat(setD2DFilterConfig(payload.d2d_filter_config[i]));
        }
    }
    if ("d2d_master_config" in payload) {
        for (var i = 0; i < payload.d2d_master_config.length; i++) {
            encoded = encoded.concat(setD2DMasterConfig(payload.d2d_master_config[i]));
        }
    }
    if ("d2d_slave_config" in payload) {
        for (var i = 0; i < payload.d2d_slave_config.length; i++) {
            encoded = encoded.concat(setD2DSlaveConfig(payload.d2d_slave_config[i]));
        }
    }
    if ("system_auto_work_config" in payload) {
        encoded = encoded.concat(setSystemAutoWorkConfig(payload.system_auto_work_config));
    }
    if ("system_auto_work_enable" in payload) {
        encoded = encoded.concat(setSystemAutoWorkEnable(payload.system_auto_work_enable));
    }
    if ("button_temporary_unlocked_config" in payload) {
        encoded = encoded.concat(setButtonTemporaryUnlockedConfig(payload.button_temporary_unlocked_config));
    }
    if ("time_zone" in payload) {
        encoded = encoded.concat(setTimeZone(payload.time_zone));
    }
    if ("daylight_saving_time" in payload) {
        encoded = encoded.concat(setDaylightSavingTime(payload.daylight_saving_time));
    }
    if ("history_enable" in payload) {
        encoded = encoded.concat(setHistoryEnable(payload.history_enable));
    }
    if ("history_config" in payload) {
        encoded = encoded.concat(setHistoryConfig(payload.history_config));
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
    if ("clear_history" in payload) {
        encoded = encoded.concat(clearHistory());
    }
    if ("fetch_history" in payload) {
        encoded = encoded.concat(fetchHistory(payload.fetch_history));
    }
    if ("stop_transmit_history" in payload) {
        encoded = encoded.concat(stopTransmitHistory());
    }
    if ("clear_plan" in payload) {
        encoded = encoded.concat(clearPlan(payload.clear_plan));
    }

    return encoded;
}

/**
 * Set collection interval
 * @param {object} collection_interval
 * @param {number} collection_interval.unit values: (0: second, 1: minute)
 * @param {number} collection_interval.seconds_of_time unit: second
 * @param {number} collection_interval.minutes_of_time unit: minute
 * @example { "collection_interval": { "unit": 0, "seconds_of_time": 300 } }
 */
function setCollectionInterval(collection_interval) {
    var unit = collection_interval.unit;
    var seconds_of_time = collection_interval.seconds_of_time;
    var minutes_of_time = collection_interval.minutes_of_time;

    var unit_map = { 0: "second", 1: "minute" };
    var unit_values = getValues(unit_map);
    if (unit_values.indexOf(unit) === -1) {
        throw new Error("collection_interval.unit must be one of " + unit_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0x60);
    buffer.writeUInt8(getValue(unit_map, unit));
    buffer.writeUInt16LE(getValue(unit_map, unit) === 0 ? seconds_of_time : minutes_of_time);
    return buffer.toBytes();
}

/**
 * Set NTC collection interval
 * @param {object} ntc_collection_interval
 * @param {number} ntc_collection_interval.unit values: (0: second, 1: minute)
 * @param {number} ntc_collection_interval.seconds_of_time unit: second
 * @param {number} ntc_collection_interval.minutes_of_time unit: minute
 * @example { "ntc_collection_interval": { "unit": 0, "seconds_of_time": 300 } }
 */
function setNtcCollectionInterval(ntc_collection_interval) {
    var unit = ntc_collection_interval.unit;
    var seconds_of_time = ntc_collection_interval.seconds_of_time;
    var minutes_of_time = ntc_collection_interval.minutes_of_time;

    var unit_map = { 0: "second", 1: "minute" };
    var unit_values = getValues(unit_map);
    if (unit_values.indexOf(unit) === -1) {
        throw new Error("ntc_collection_interval.unit must be one of " + unit_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0x61);
    buffer.writeUInt8(getValue(unit_map, unit));
    buffer.writeUInt16LE(getValue(unit_map, unit) === 0 ? seconds_of_time : minutes_of_time);
    return buffer.toBytes();
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
    buffer.writeUInt8(0x62);
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
    buffer.writeUInt8(0x63);
    buffer.writeUInt8(getValue(unit_map, temperature_unit));
    return buffer.toBytes();
}

/**
 * Set support mode config
 * @param {object} support_mode_config
 * @param {number} support_mode_config.fan_enable values: (0: disable, 1: enable)
 * @param {number} support_mode_config.heating_enable values: (0: disable, 1: enable)
 * @param {number} support_mode_config.cooling_enable values: (0: disable, 1: enable)
 * @example { "support_mode_config": { "fan_enable": 1, "heating_enable": 1, "cooling_enable": 1 } }
 */
function setSupportModeConfig(support_mode_config) {
    var fan_enable = support_mode_config.fan_enable;
    var heating_enable = support_mode_config.heating_enable;
    var cooling_enable = support_mode_config.cooling_enable;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);

    var data = 0x00;
    var support_bits_offset = { fan_enable: 0, heating_enable: 1, cooling_enable: 2 };
    for (var key in support_bits_offset) {
        if (key in support_mode_config) {
            if (enable_values.indexOf(support_mode_config[key]) === -1) {
                throw new Error("support_mode_config." + key + " must be one of " + enable_values.join(", "));
            }

            data |= getValue(enable_map, support_mode_config[key]) << support_bits_offset[key];
        }
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x64);
    buffer.writeUInt8(data);
    return buffer.toBytes();
}

/**
 * Set smart display config
 * @param {object} smart_display_config
 * @param {number} smart_display_config.enable values: (0: disable, 1: enable)
 * @example { "smart_display_config": { "enable": 1 } }
 */
function setSmartDisplayConfig(smart_display_config) {
    var enable = smart_display_config.enable;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("smart_display_config.enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x65);
    buffer.writeUInt8(getValue(enable_map, enable));
    return buffer.toBytes();
}

/**
 * Set display config
 * @param {object} display_config
 * @param {number} display_config.temperature_enable values: (0: disable, 1: enable)
 * @example { "display_config": { "temperature_enable": 1 } }
 */
function setDisplayConfig(display_config) {
    var temperature_enable = display_config.temperature_enable;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(temperature_enable) === -1) {
        throw new Error("display_config.temperature_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x66);
    buffer.writeUInt8(getValue(enable_map, temperature_enable));
    return buffer.toBytes();
}

/**
 * Control system status
 * @param {number} system_status values: (0: off, 1: on)
 * @example { "system_status": 1 }
 */
function controlSystemStatus(system_status) {
    var on_off_map = { 0: "off", 1: "on" };
    var on_off_values = getValues(on_off_map);
    if (on_off_values.indexOf(system_status) === -1) {
        throw new Error("system_status must be one of " + on_off_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x67);
    buffer.writeUInt8(getValue(on_off_map, system_status));
    return buffer.toBytes();
}

/**
 * Set temperature control mode
 * @param {number} temperature_control_mode values: (0: fan, 1: heating, 2: cooling)
 * @example { "temperature_control_mode": 1 }
 */
function setTemperatureControlMode(temperature_control_mode) {
    var mode_map = { 0: "fan", 1: "heating", 2: "cooling" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(temperature_control_mode) === -1) {
        throw new Error("temperature_control_mode must be one of " + mode_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x68);
    buffer.writeUInt8(getValue(mode_map, temperature_control_mode));
    return buffer.toBytes();
}

/**
 * Set target temperature resolution
 * @param {number} target_temperature_resolution values: (0.5, 1)
 * @example { "target_temperature_resolution": 0.5 }
 */
function setTargetTemperatureResolution(target_temperature_resolution) {
    var resolution_values = [0.5, 1];
    if (resolution_values.indexOf(target_temperature_resolution) === -1) {
        throw new Error("target_temperature_resolution must be one of " + resolution_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x69);
    buffer.writeUInt8(resolution_values.indexOf(target_temperature_resolution));
    return buffer.toBytes();
}

/**
 * Set target temperature tolerance
 * @param {number} target_temperature_tolerance unit: celsius, range: [0.1, 5]
 * @example { "target_temperature_tolerance": 0.5 }
 */
function setTargetTemperatureTolerance(target_temperature_tolerance) {
    if (target_temperature_tolerance < 0.1 || target_temperature_tolerance > 5) {
        throw new Error("target_temperature_tolerance must be between 0.1 and 5");
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x6a);
    buffer.writeUInt8(target_temperature_tolerance * 10);
    return buffer.toBytes();
}

/**
 * Set heating target temperature
 * @param {number} heating_target_temperature unit: celsius, range: [5, 35]
 * @example { "heating_target_temperature": 20 }
 */
function setHeatingTargetTemperature(heating_target_temperature) {
    if (heating_target_temperature < 5 || heating_target_temperature > 35) {
        throw new Error("heating_target_temperature must be between 5 and 35");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0x6b);
    buffer.writeUInt16LE(heating_target_temperature * 10);
    return buffer.toBytes();
}

/**
 * Set cooling target temperature
 * @param {number} cooling_target_temperature unit: celsius, range: [5, 35]
 * @example { "cooling_target_temperature": 20 }
 */
function setCoolingTargetTemperature(cooling_target_temperature) {
    if (cooling_target_temperature < 5 || cooling_target_temperature > 35) {
        throw new Error("cooling_target_temperature must be between 5 and 35");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0x6c);
    buffer.writeUInt16LE(cooling_target_temperature * 10);
    return buffer.toBytes();
}

/**
 * Set heating target temperature range
 * @param {object} heating_target_temperature_range
 * @param {number} heating_target_temperature_range.min unit: celsius, range: [5, 35]
 * @param {number} heating_target_temperature_range.max unit: celsius, range: [5, 35]
 * @example { "heating_target_temperature_range": { "min": 5, "max": 35 } }
 */
function setHeatingTargetTemperatureRange(heating_target_temperature_range) {
    var min = heating_target_temperature_range.min;
    var max = heating_target_temperature_range.max;

    if (min < 5 || min > 35) {
        throw new Error("heating_target_temperature_range.min must be between 5 and 35");
    }
    if (max < 5 || max > 35) {
        throw new Error("heating_target_temperature_range.max must be between 5 and 35");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0x6d);
    buffer.writeUInt16LE(min * 10);
    buffer.writeUInt16LE(max * 10);
    return buffer.toBytes();
}

/**
 * Set cooling target temperature range
 * @param {object} cooling_target_temperature_range
 * @param {number} cooling_target_temperature_range.min unit: celsius, range: [5, 35]
 * @param {number} cooling_target_temperature_range.max unit: celsius, range: [5, 35]
 * @example { "cooling_target_temperature_range": { "min": 5, "max": 35 } }
 */
function setCoolingTargetTemperatureRange(cooling_target_temperature_range) {
    var min = cooling_target_temperature_range.min;
    var max = cooling_target_temperature_range.max;

    if (min < 5 || min > 35) {
        throw new Error("cooling_target_temperature_range.min must be between 5 and 35");
    }
    if (max < 5 || max > 35) {
        throw new Error("cooling_target_temperature_range.max must be between 5 and 35");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0x6e);
    buffer.writeUInt16LE(min * 10);
    buffer.writeUInt16LE(max * 10);
    return buffer.toBytes();
}

/**
 * Set dehumidify config
 * @param {object} dehumidify_config
 * @param {number} dehumidify_config.enable values: (0: disable, 1: enable)
 * @param {number} dehumidify_config.temperature_tolerance unit: celsius, range: [0.1, 5]
 * @example { "dehumidify_config": { "enable": 1, "temperature_tolerance": 0.5 } }
 */
function setDehumidifyConfig(dehumidify_config) {
    var enable = dehumidify_config.enable;
    var temperature_tolerance = dehumidify_config.temperature_tolerance;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("dehumidify_config.enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0x6f);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(temperature_tolerance * 10);
    return buffer.toBytes();
}

/**
 * Set target humidity range
 * @param {object} target_humidity_range
 * @param {number} target_humidity_range.min unit: percentage, range: [0, 100]
 * @param {number} target_humidity_range.max unit: percentage, range: [0, 100]
 * @example { "target_humidity_range": { "min": 0, "max": 100 } }
 */
function setTargetHumidityRange(target_humidity_range) {
    var min = target_humidity_range.min;
    var max = target_humidity_range.max;

    if (min < 0 || min > 100) {
        throw new Error("target_humidity_range.min must be between 0 and 100");
    }
    if (max < 0 || max > 100) {
        throw new Error("target_humidity_range.max must be between 0 and 100");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0x70);
    buffer.writeUInt16LE(min * 10);
    buffer.writeUInt16LE(max * 10);
    return buffer.toBytes();
}

/**
 * Set temperature abnormal config
 * @param {object} temperature_abnormal_config
 * @param {number} temperature_abnormal_config.enable values: (0: disable, 1: enable)
 * @param {number} temperature_abnormal_config.duration unit: minute, range: [1, 20]
 * @example { "temperature_abnormal_config": { "enable": 1, "duration": 10 } }
 */
function setTemperatureAbnormalConfig(temperature_abnormal_config) {
    var enable = temperature_abnormal_config.enable;
    var duration = temperature_abnormal_config.duration;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("temperature_abnormal_config.enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0x71);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(duration);
    return buffer.toBytes();
}

/**
 * Set fan mode
 * @param {number} fan_mode values: (0: auto, 1: low, 2: medium, 3: high)
 * @example { "fan_mode": 1 }
 */
function setFanMode(fan_mode) {
    var mode_map = { 0: "auto", 1: "low", 2: "medium", 3: "high" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(fan_mode) === -1) {
        throw new Error("fan_mode must be one of " + mode_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x72);
    buffer.writeUInt8(getValue(mode_map, fan_mode));
    return buffer.toBytes();
}

/**
 * Set fan speed config
 * @param {object} fan_speed_config
 * @param {number} fan_speed_config.delta_1 unit: percentage, range: [1.0, 15.0]
 * @param {number} fan_speed_config.delta_2 unit: percentage, range: [1.0, 15.0]
 * @example { "fan_speed_config": { "delta_1": 1.0, "delta_2": 1.0 } }
 */
function setFanSpeedConfig(fan_speed_config) {
    var delta_1 = fan_speed_config.delta_1;
    var delta_2 = fan_speed_config.delta_2;

    if (delta_1 < 1.0 || delta_1 > 15.0) {
        throw new Error("fan_speed_config.delta_1 must be between 1.0 and 15.0");
    }
    if (delta_2 < 1.0 || delta_2 > 15.0) {
        throw new Error("fan_speed_config.delta_2 must be between 1.0 and 15.0");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0x73);
    buffer.writeUInt8(delta_1 * 10);
    buffer.writeUInt8(delta_2 * 10);
    return buffer.toBytes();
}

/**
 * Set fan delay config
 * @param {object} fan_delay_config
 * @param {number} fan_delay_config.enable values: (0: disable, 1: enable)
 * @param {number} fan_delay_config.delay unit: second, range: [1, 3600]
 * @example { "fan_delay_config": { "enable": 1, "delay": 10 } }
 */
function setFanDelayConfig(fan_delay_config) {
    var enable = fan_delay_config.enable;
    var delay_time = fan_delay_config.delay_time;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("fan_delay_config.enable must be one of " + enable_values.join(", "));
    }
    if (delay_time < 1 || delay_time > 3600) {
        throw new Error("fan_delay_config.delay_time must be in the range of 1 to 3600 seconds");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0x74);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(delay_time);
    return buffer.toBytes();
}

/**
 * Set child lock config
 * @param {object} child_lock_config
 * @param {number} child_lock_config.system_button values: (0: disable, 1: enable)
 * @param {number} child_lock_config.temperature_up_down_button values: (0: disable, 1: enable)
 * @param {number} child_lock_config.fan_button values: (0: disable, 1: enable)
 * @param {number} child_lock_config.temperature_control_mode_button values: (0: disable, 1: enable)
 * @param {number} child_lock_config.restart_button values: (0: disable, 1: enable)
 * @param {number} child_lock_config.reset_button values: (0: disable, 1: enable)
 * @example { "child_lock_config": { "system_button": 1, "temperature_up_down_button": 1, "fan_button": 1, "temperature_control_mode_button": 1, "restart_button": 1, "reset_button": 1 } }
 */
function setChildLockConfig(child_lock_config) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);

    var lock_bits = 0x00;
    var lock_bits_offset = { system_button: 0, temperature_up_down_button: 1, fan_button: 2, temperature_control_mode_button: 3, restart_button: 4, reset_button: 5 };
    for (var key in lock_bits_offset) {
        if (key in child_lock_config) {
            lock_bits |= getValue(enable_map, child_lock_config[key]) << lock_bits_offset[key];
        }
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x75);
    buffer.writeUInt8(lock_bits);
    return buffer.toBytes();
}

/**
 * Set temperature alarm settings
 * @param {object} temperature_alarm_settings
 * @param {number} temperature_alarm_settings.enable values: (0: disable, 1: enable)
 * @param {number} temperature_alarm_settings.threshold_condition values: (1: below, 2: above, 3: between, 4: outside)
 * @param {number} temperature_alarm_settings.threshold_min unit: celsius, range: [-20, 60]
 * @param {number} temperature_alarm_settings.threshold_max unit: celsius, range: [-20, 60]
 * @example { "temperature_alarm_settings": { "enable": 1, "threshold_condition": 1, "threshold_min": 20, "threshold_max": 25 } }
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

    var buffer = new Buffer(7);
    buffer.writeUInt8(0x76);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(getValue(condition_map, threshold_condition));
    buffer.writeInt16LE(threshold_min * 10);
    buffer.writeInt16LE(threshold_max * 10);
    return buffer.toBytes();
}

/**
 * Set continuous high temperature alarm settings
 * @param {object} continuous_high_temperature_alarm_settings
 * @param {number} continuous_high_temperature_alarm_settings.enable values: (0: disable, 1: enable)
 * @param {number} continuous_high_temperature_alarm_settings.delta_max unit: celsius, range: [1, 10]
 * @param {number} continuous_high_temperature_alarm_settings.duration_time unit: minute, range: [0, 60]
 * @example { "continuous_high_temperature_alarm_settings": { "enable": 1, "threshold_max": 3, "duration_time": 10 } }
 */
function setContinuousHighTemperatureAlarmSettings(continuous_high_temperature_alarm_settings) {
    var enable = continuous_high_temperature_alarm_settings.enable;
    var delta_max = continuous_high_temperature_alarm_settings.delta_max;
    var duration_time = continuous_high_temperature_alarm_settings.duration_time;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("continuous_temperature_alarm_settings.enable must be one of " + enable_values.join(", "));
    }
    if (delta_max < 1 || delta_max > 10) {
        throw new Error("continuous_temperature_alarm_settings.delta_max must be between 1 and 10");
    }
    if (duration_time < 0 || duration_time > 60) {
        throw new Error("continuous_temperature_alarm_settings.duration_time must be between 0 and 60");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0x77);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeInt8(delta_max * 10);
    buffer.writeUInt8(duration_time);
    return buffer.toBytes();
}

/**
 * Set continuous low temperature alarm settings
 * @param {object} continuous_low_temperature_alarm_settings
 * @param {number} continuous_low_temperature_alarm_settings.enable values: (0: disable, 1: enable)
 * @param {number} continuous_low_temperature_alarm_settings.delta_max unit: celsius, range: [1, 10]
 * @param {number} continuous_low_temperature_alarm_settings.duration_time unit: minute, range: [0, 60]
 * @example { "continuous_low_temperature_alarm_settings": { "enable": 1, "delta_min": 1, "duration_time": 10 } }
 */
function setContinuousLowTemperatureAlarmSettings(continuous_low_temperature_alarm_settings) {
    var enable = continuous_low_temperature_alarm_settings.enable;
    var delta_max = continuous_low_temperature_alarm_settings.delta_max;
    var duration_time = continuous_low_temperature_alarm_settings.duration_time;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("continuous_low_temperature_alarm_settings.enable must be one of " + enable_values.join(", "));
    }
    if (delta_max < 1 || delta_max > 10) {
        throw new Error("continuous_low_temperature_alarm_settings.delta_max must be between 1 and 10");
    }
    if (duration_time < 0 || duration_time > 60) {
        throw new Error("continuous_low_temperature_alarm_settings.duration_time must be between 0 and 60");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0x78);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeInt8(delta_max * 10);
    buffer.writeUInt8(duration_time);
    return buffer.toBytes();
}

/**
 * Set temperature calibration config
 * @param {object} temperature_calibration_config
 * @param {number} temperature_calibration_config.enable values: (0: disable, 1: enable)
 * @param {number} temperature_calibration_config.calibration_value unit: celsius, range: [-60, 60]
 * @example { "temperature_calibration_config": { "enable": 1, "calibration_value": 0.5 } }
 */
function setTemperatureCalibrationConfig(temperature_calibration_config) {
    var enable = temperature_calibration_config.enable;
    var calibration_value = temperature_calibration_config.calibration_value;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("temperature_calibration_config.enable must be one of " + enable_values.join(", "));
    }
    if (calibration_value < -60 || calibration_value > 60) {
        throw new Error("temperature_calibration_config.calibration_value must be between -60 and 60");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0x79);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeInt16LE(calibration_value * 10);
    return buffer.toBytes();
}

/**
 * Set humidity calibration config
 * @param {object} humidity_calibration_config
 * @param {number} humidity_calibration_config.enable values: (0: disable, 1: enable)
 * @param {number} humidity_calibration_config.calibration_value unit: %, range: [-100, 100]
 * @example { "humidity_calibration_config": { "enable": 1, "calibration_value": 0.5 } }
 */
function setHumidityCalibrationConfig(humidity_calibration_config) {
    var enable = humidity_calibration_config.enable;
    var calibration_value = humidity_calibration_config.calibration_value;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("humidity_calibration_config.enable must be one of " + enable_values.join(", "));
    }
    if (calibration_value < -100 || calibration_value > 100) {
        throw new Error("humidity_calibration_config.calibration_value must be between -100 and 100");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0x7a);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeInt16LE(calibration_value * 10);
    return buffer.toBytes();
}

/**
 * Set plan config
 * @param {object} plan_config
 * @param {number} plan_config._item.plan_id
 * @param {number} plan_config._item.enable values: (0: disable, 1: enable)
 * @param {string} plan_config._item.name
 * @param {number} plan_config._item.fan_mode values: (0: auto, 1: low, 2: medium, 3: high)
 * @param {number} plan_config._item.heating_temperature unit: celsius, range: [0, 60]
 * @param {number} plan_config._item.cooling_temperature unit: celsius, range: [0, 60]
 * @param {number} plan_config._item.temperature_tolerance unit: celsius, range: [0, 60]
 * @param {object} plan_config._item.schedule_config
 * @param {number} plan_config._item.schedule_config._item.index
 * @param {number} plan_config._item.schedule_config._item.enable values: (0: disable, 1: enable)
 * @param {number} plan_config._item.schedule_config._item.start_time unit: minute, range: [0, 1440]
 * @param {number} plan_config._item.schedule_config._item.end_time unit: minute, range: [0, 1440]
 * @example
 * { "plan_config": [
 *     { "plan_id": 1, "enable": 1, "name": "task 1", "fan_mode": 1, "heating_temperature": 20, "cooling_temperature": 25, "temperature_tolerance": 1,
 *       "schedule_config": [ { "index": 1, "enable": 1, "start_time": 0, "end_time": 1440 } ]
 *     }
 *   ]
 * }
 */
function setPlanConfig(plan_config) {
    var data = [];
    var plan_id = plan_config.plan_id;
    if (plan_id < 1 || plan_id > 15) {
        throw new Error("plan_config._item.plan_id must be between 1 and 15");
    }

    if ("enable" in plan_config) {
        data = data.concat(setPlanEnable(plan_id, plan_config.enable));
    }
    if ("name" in plan_config) {
        data = data.concat(setPlanName(plan_id, plan_config.name));
    }
    if ("fan_mode" in plan_config && "heating_temperature" in plan_config && "cooling_temperature" in plan_config && "temperature_tolerance" in plan_config) {
        data = data.concat(setPlanTemperatureControlConfig(plan_id, plan_config));
    }
    if ("schedule_config" in plan_config) {
        data = data.concat(setPlanScheduleConfig(plan_id, plan_config.schedule_config));
    }
    return data;
}

function setPlanEnable(plan_id, enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("plan_config._item.enable must be one of " + enable_values.join(", "));
    }
    var buffer = new Buffer(2);
    buffer.writeUInt8(0x7b);
    buffer.writeUInt8(plan_id);
    buffer.writeUInt8(0x00);
    buffer.writeUInt8(getValue(enable_map, enable));
    return buffer.toBytes();
}

function setPlanName(plan_id, name) {
    var bytes = stringToBytes(name);
    if (bytes.length > 10) {
        throw new Error("plan_config._item.name must be less than 10 characters");
    }
    var data = [];

    var buffer = new Buffer(7);
    buffer.writeUInt8(0x7b);
    buffer.writeUInt8(plan_id);
    buffer.writeUInt8(0x01);
    buffer.writeBytes(bytes.slice(0, 5));
    data.push(buffer.toBytes());

    if (bytes.length > 5) {
        buffer = new Buffer(7);
        buffer.writeUInt8(0x7b);
        buffer.writeUInt8(plan_id);
        buffer.writeUInt8(0x02);
        buffer.writeBytes(bytes.slice(5, bytes.length));
        data.push(buffer.toBytes());
    }
    return data;
}

function setPlanTemperatureControlConfig(plan_id, plan_config) {
    var data = [];
    var fan_mode = plan_config.fan_mode;
    var heating_temperature = plan_config.heating_temperature;
    var cooling_temperature = plan_config.cooling_temperature;
    var temperature_tolerance = plan_config.temperature_tolerance;

    var fan_mode_map = { 0: "auto", 1: "low", 2: "medium", 3: "high" };
    var fan_mode_values = getValues(fan_mode_map);
    if (fan_mode_values.indexOf(fan_mode) === -1) {
        throw new Error("plan_config._item.fan_mode must be one of " + fan_mode_values.join(", "));
    }

    var buffer = new Buffer(9);
    buffer.writeUInt8(0x7b);
    buffer.writeUInt8(plan_id);
    buffer.writeUInt8(0x03);
    buffer.writeUInt8(getValue(fan_mode_map, fan_mode));
    buffer.writeInt16LE(heating_temperature * 10);
    buffer.writeInt16LE(cooling_temperature * 10);
    buffer.writeInt8(temperature_tolerance * 10);
    return buffer.toBytes();
}

function setPlanScheduleConfig(plan_id, schedule_config) {
    var data = [];
    for (var i = 0; i < schedule_config.length; i++) {
        data.push(setPlanScheduleConfigItem(plan_id, schedule_config[i]));
    }
    return data;
}

function setPlanScheduleConfigItem(plan_id, schedule_config) {
    var index = schedule_config.index;
    var enable = schedule_config.enable;
    var start_time = schedule_config.start_time;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("plan_config._item.schedule_config._item.enable must be one of " + enable_values.join(", "));
    }
    var data = 0x00;
    var weekday_bits_offset = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
    for (var key in weekday_bits_offset) {
        if (key in schedule_config) {
            data |= getValue(enable_map, schedule_config[key]) << weekday_bits_offset[key];
        }
    }

    var buffer = new Buffer(8);
    buffer.writeUInt8(0x7b);
    buffer.writeUInt8(plan_id);
    buffer.writeUInt8(0x04);
    buffer.writeUInt8(index);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(start_time);
    buffer.writeUInt8(data);
    return buffer.toBytes();
}

/**
 * Set valve mode
 * @param {number} valve_mode values: (0: two-way valve 1, 1: two-way valve 2, 2: four-way valve 1, 3: four-way valve 2)
 * @example { "valve_mode": 0 }
 */
function setValveMode(valve_mode) {
    var valve_mode_map = { 0: "two-way valve 1", 1: "two-way valve 2", 2: "four-way valve 1", 3: "four-way valve 2" };
    var valve_mode_values = getValues(valve_mode_map);
    if (valve_mode_values.indexOf(valve_mode) === -1) {
        throw new Error("valve_mode must be one of " + valve_mode_values.join(", "));
    }
    var buffer = new Buffer(2);
    buffer.writeUInt8(0x7c);
    buffer.writeUInt8(getValue(valve_mode_map, valve_mode));
    return buffer.toBytes();
}

/**
 * Set DI enable
 * @param {number} di_enable values: (0: disable, 1: enable)
 * @example { "di_enable": 0 }
 */
function setDIEnable(di_enable) {
    var di_enable_map = { 0: "disable", 1: "enable" };
    var di_enable_values = getValues(di_enable_map);
    if (di_enable_values.indexOf(di_enable) === -1) {
        throw new Error("di_enable must be one of " + di_enable_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x80);
    buffer.writeUInt8(getValue(di_enable_map, di_enable));
    return buffer.toBytes();
}

/**
 * Set card config
 * @param {objectF} card_config
 * @param {number} card_config.mode values: (0: power, 1: plan)
 * @param {number} card_config.system_status values: (0: on, 1: off)
 * @param {number} card_config.in_plan_id range: [1, 16]
 * @param {number} card_config.out_plan_id range: [1, 16]
 * @example { "card_config": { "mode": 0, "system_status": 0 } }
 */
function setCardConfig(card_config) {
    var mode = card_config.mode;

    var mode_map = { 0: "power", 1: "plan" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(mode) === -1) {
        throw new Error("card_config.mode must be one of " + mode_values.join(", "));
    }

    var mode_value = getValue(mode_map, mode);
    if (mode_value === 0) {
        var on_off_map = { 0: "on", 1: "off" };
        var on_off_values = getValues(on_off_map);
        var on_off = card_config.system_status;
        if (on_off_values.indexOf(on_off) === -1) {
            throw new Error("card_config.system_status must be one of " + on_off_values.join(", "));
        }
        var buffer = new Buffer(4);
        buffer.writeUInt8(0x81);
        buffer.writeUInt8(0x00);
        buffer.writeUInt8(0x00);
        buffer.writeUInt8(getValue(on_off_map, on_off));
        return buffer.toBytes();
    } else if (mode_value === 1) {
        var in_plan_id = card_config.in_plan_id;
        var out_plan_id = card_config.out_plan_id;
        if (in_plan_id < 1 || in_plan_id > 16) {
            throw new Error("card_config.in_plan_id must be between 1 and 16");
        }
        if (out_plan_id < 1 || out_plan_id > 16) {
            throw new Error("card_config.out_plan_id must be between 1 and 16");
        }

        var buffer = new Buffer(5);
        buffer.writeUInt8(0x81);
        buffer.writeUInt8(0x00);
        buffer.writeUInt8(0x01);
        buffer.writeUInt8(in_plan_id - 1);
        buffer.writeUInt8(out_plan_id - 1);
        return buffer.toBytes();
    }
}

/**
 * Set open window config
 * @param {object} open_window_config
 * @param {number} open_window_config.mode values: (0: close, 1: open)
 * @example { "open_window_config": { "mode": 0 } }
 */
function setOpenWindowConfig(open_window_config) {
    var mode = open_window_config.mode;
    var mode_map = { 0: "close", 1: "open" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(mode) === -1) {
        throw new Error("open_window_config.mode must be one of " + mode_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0x81);
    buffer.writeUInt8(0x01);
    buffer.writeUInt8(getValue(mode_map, mode));
    return buffer.toBytes();
}

/**
 * Set freeze protection config
 * @param {object} freeze_protection_config
 * @param {number} freeze_protection_config.enable values: (0: disable, 1: enable)
 * @param {number} freeze_protection_config.temperature unit: celsius, range: [1, 5]
 * @example { "freeze_protection_config": { "enable": 0, "temperature": 0 } }
 */
function setFreezeProtectionConfig(freeze_protection_config) {
    var enable = freeze_protection_config.enable;
    var temperature = freeze_protection_config.temperature;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("freeze_protection_config.enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0x84);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeInt8(temperature * 10);
    return buffer.toBytes();
}

/**
 * Set temperature source config
 * @param {object} temperature_source_config
 * @param {number} temperature_source_config.source values: (0: internal, 1: ntc, 2: external)
 * @param {number} temperature_source_config.missing_data_action values: (0: hold, 1: off_or_fan_control, 2: switch_to_internal)
 * @example { "temperature_source_config": { "source": 0 } }
 */
function setTemperatureSourceConfig(temperature_source_config) {
    var source = temperature_source_config.source;

    var source_map = { 0: "internal", 1: "ntc", 2: "external" };
    var source_values = getValues(source_map);
    if (source_values.indexOf(source) === -1) {
        throw new Error("temperature_source_config.source must be one of " + source_values.join(", "));
    }

    var source_value = getValue(source_map, source);
    if (source_value === 0 || source_value === 1) {
        var buffer = new Buffer(2);
        buffer.writeUInt8(0x85);
        buffer.writeUInt8(source_value);
        return buffer.toBytes();
    } else if (source_value === 2) {
        var duration = temperature_source_config.duration;
        var missing_data_action = temperature_source_config.missing_data_action;
        var action_map = { 0: "hold", 1: "off_or_fan_control", 2: "switch_to_internal" };
        var action_values = getValues(action_map);
        if (action_values.indexOf(missing_data_action) === -1) {
            throw new Error("temperature_source_config.missing_value_action must be one of " + action_values.join(", "));
        }

        var buffer = new Buffer(4);
        buffer.writeUInt8(0x85);
        buffer.writeUInt8(source_value);
        buffer.writeUInt8(duration);
        buffer.writeUInt8(getValue(action_map, missing_data_action));
        return buffer.toBytes();
    }
}

/**
 * Set D2D enable
 * @param {number} d2d_enable values: (0: disable, 1: enable)
 * @example { "d2d_enable": 0 }
 */
function setD2DEnable(d2d_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(d2d_enable) === -1) {
        throw new Error("d2d_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x86);
    buffer.writeUInt8(getValue(enable_map, d2d_enable));
    return buffer.toBytes();
}

/**
 * Set D2D config
 * @param {object} d2d_filter_config
 * @param {number} d2d_filter_config.index range: [1, 16]
 * @param {number} d2d_filter_config.enable values: (0: disable, 1: enable)
 * @param {string} d2d_filter_config.eui
 * @param {string} d2d_filter_config.name
 * @example { "d2d_filter_config": [{ "index": 1, "enable": 0, "eui": "0000000000000000", "name": "test" }] }
 */
function setD2DFilterConfig(d2d_filter_config) {
    var index = d2d_filter_config.index;
    if (index < 1 || index > 16) {
        throw new Error("d2d_filter_config._item.index must be between 1 and 16");
    }

    var data = [];
    if ("enable" in d2d_filter_config) {
        data = data.concat(setD2DFilterEnable(index, d2d_filter_config.enable));
    }
    if ("eui" in d2d_filter_config) {
        data = data.concat(setD2DFilterDeviceEui(index, d2d_filter_config.eui));
    }
    if ("name" in d2d_filter_config) {
        data = data.concat(setD2DFilterName(index, d2d_filter_config.name));
    }
    return data;
}

function setD2DFilterEnable(index, enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("d2d_filter_config._item.enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0x87);
    buffer.writeUInt8(index - 1);
    buffer.writeUInt8(0x00);
    buffer.writeUInt8(getValue(enable_map, enable));
    return buffer.toBytes();
}

function setD2DFilterDeviceEui(index, eui) {
    var bytes = hexStringToBytes(eui);
    if (bytes.length !== 8) {
        throw new Error("d2d_filter_config._item.eui length must be 16");
    }
    var buffer = new Buffer(17);
    buffer.writeUInt8(0x87);
    buffer.writeUInt8(index - 1);
    buffer.writeUInt8(0x01);
    buffer.writeBytes(bytes);
    return buffer.toBytes();
}

function setD2DFilterName(index, name) {
    var bytes = stringToBytes(name);
    if (bytes.length > 8) {
        throw new Error("d2d_filter_config._item.name length must be less than 8");
    }
    var buffer = new Buffer(11);
    buffer.writeUInt8(0x87);
    buffer.writeUInt8(index - 1);
    buffer.writeUInt8(0x02);
    buffer.writeBytes(bytes);
    return buffer.toBytes();
}

/**
 * Set D2D master config
 * @param {object} d2d_master_config
 * @param {number} d2d_master_config._item.trigger_source values: (0: plan_1, 1: plan_2, 2: plan_3, 3: plan_4, 4: plan_5, 5: plan_6, 6: plan_7, 7: plan_8, 8: plan_9, 9: plan_10, 10: plan_11, 11: plan_12, 12: plan_13, 14: plan_15, 15: plan_16, 16: system_status_on, 17: system_status_off, 18: system_status_toggle)
 * @param {number} d2d_master_config._item.enable values: (0: disable, 1: enable)
 * @param {number} d2d_master_config._item.lora_uplink_enable values: (0: disable, 1: enable)
 * @param {string} d2d_master_config._item.command
 * @param {number} d2d_master_config._item.time_enable values: (0: disable, 1: enable)
 * @param {number} d2d_master_config._item.time
 * @example { "d2d_master_config": [{ "trigger_source": 0, "enable": 0, "lora_uplink_enable": 0, "d2d_cmd": "0000000000000000", "time_enable": 0, "time": 0 }] }
 */
function setD2DMasterConfig(d2d_master_config) {
    var trigger_source = d2d_master_config.trigger_source;
    var enable = d2d_master_config.enable;
    var lora_uplink_enable = d2d_master_config.lora_uplink_enable;
    var command = d2d_master_config.command;
    var time_enable = d2d_master_config.time_enable;
    var time = d2d_master_config.time;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("d2d_master_config._item.enable must be one of " + enable_values.join(", "));
    }
    if (enable_values.indexOf(lora_uplink_enable) === -1) {
        throw new Error("d2d_master_config._item.lora_uplink_enable must be one of " + enable_values.join(", "));
    }
    var trigger_source_map = { 0: "plan_1", 1: "plan_2", 2: "plan_3", 3: "plan_4", 4: "plan_5", 5: "plan_6", 6: "plan_7", 7: "plan_8", 8: "plan_9", 9: "plan_10", 10: "plan_11", 11: "plan_12", 12: "plan_13", 14: "plan_15", 15: "plan_16", 16: "system_status_on", 17: "system_status_off", 18: "system_status_toggle" };
    var trigger_source_values = getValues(trigger_source_map);
    if (trigger_source_values.indexOf(trigger_source) === -1) {
        throw new Error("d2d_master_config._item.trigger_source must be one of " + trigger_source_values.join(", "));
    }

    var buffer = new Buffer(10);
    buffer.writeUInt8(0x88);
    buffer.writeUInt8(getValue(trigger_source_map, trigger_source));
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeD2DCommand(command, "0000");
    buffer.writeUInt8(getValue(enable_map, time_enable));
    buffer.writeUInt16LE(time);
    return buffer.toBytes();
}

/**
 * Set D2D slave config
 * @param {object} d2d_slave_config
 * @param {number} d2d_slave_config._item.index range: [1, 16]
 * @param {number} d2d_slave_config._item.enable values: (0: disable, 1: enable)
 * @param {string} d2d_slave_config._item.command
 * @param {string} d2d_slave_config._item.trigger_target values: (0: plan_1, 1: plan_2, 2: plan_3, 3: plan_4, 4: plan_5, 5: plan_6, 6: plan_7, 7: plan_8, 8: plan_9, 9: plan_10, 10: plan_11, 11: plan_12, 12: plan_13, 14: plan_15, 15: plan_16, 16: system_status_on, 17: system_status_off, 18: system_status_toggle, 19: window_open, 20: window_close)
 * @example { "d2d_slave_config": [{ "index": 1, "enable": 0, "command": "0000", "trigger_target": 0 }] }
 */
function setD2DSlaveConfig(d2d_slave_config) {
    var index = d2d_slave_config.index;
    var enable = d2d_slave_config.enable;
    var command = d2d_slave_config.command;
    var trigger_target = d2d_slave_config.trigger_target;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("d2d_slave_config._item.enable must be one of " + enable_values.join(", "));
    }
    var trigger_target_map = { 0: "plan_1", 1: "plan_2", 2: "plan_3", 3: "plan_4", 4: "plan_5", 5: "plan_6", 6: "plan_7", 7: "plan_8", 8: "plan_9", 9: "plan_10", 10: "plan_11", 11: "plan_12", 12: "plan_13", 14: "plan_15", 15: "plan_16", 16: "system_status_on", 17: "system_status_off", 18: "system_status_toggle", 19: "window_open", 20: "window_close" };
    var trigger_target_values = getValues(trigger_target_map);
    if (trigger_target_values.indexOf(trigger_target) === -1) {
        throw new Error("d2d_slave_config._item.trigger_target must be one of " + trigger_target_values.join(", "));
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0x89);
    buffer.writeUInt8(index - 1);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeD2DCommand(command, "0000");
    buffer.writeUInt8(getValue(trigger_target_map, trigger_target));
    return buffer.toBytes();
}

/**
 * Set system auto work enable
 * @param {object} system_auto_work_enable
 * @param {number} system_auto_work_enable.enable values: (0: disable, 1: enable)
 * @example { "system_auto_work_enable": { "enable": 0 } }
 */
function setSystemAutoWorkEnable(system_auto_work_enable) {
    var enable = system_auto_work_enable.enable;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("system_auto_work_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x8a);
    buffer.writeUInt8(0x00);
    buffer.writeUInt8(getValue(enable_map, enable));
    return buffer.toBytes();
}

/**
 * Set system auto work config
 * @param {object} system_auto_work_config
 * @param {number} system_auto_work_config._item.index range: [1, 2]
 * @param {number} system_auto_work_config._item.start_time_enable values: (0: disable, 1: enable)
 * @param {number} system_auto_work_config._item.start_time converter: 08:30 -> 08 * 60 + 30 = 510
 * @param {number} system_auto_work_config._item.end_time_enable values: (0: disable, 1: enable)
 * @param {number} system_auto_work_config._item.end_time converter: 17:30 -> 17 * 60 + 30 = 1050
 * @param {object} system_auto_work_config._item.week_cycle
 * @param {boolean} system_auto_work_config._item.week_cycle.sunday values: (0: disable, 1: enable)
 * @param {boolean} system_auto_work_config._item.week_cycle.monday values: (0: disable, 1: enable)
 * @param {boolean} system_auto_work_config._item.week_cycle.tuesday values: (0: disable, 1: enable)
 * @param {boolean} system_auto_work_config._item.week_cycle.wednesday values: (0: disable, 1: enable)
 * @param {boolean} system_auto_work_config._item.week_cycle.thursday values: (0: disable, 1: enable)
 * @param {boolean} system_auto_work_config._item.week_cycle.friday values: (0: disable, 1: enable)
 * @param {boolean} system_auto_work_config._item.week_cycle.saturday values: (0: disable, 1: enable)
 * @example { "system_auto_work_config": [{ "index": 1, "start_time_enable": 0, "start_time": 0, "end_time_enable": 0, "end_time": 0, "week_cycle": { "sunday": false, "monday": false, "tuesday": false, "wednesday": false, "thursday": false, "friday": false, "saturday": false } }] }
 */
function setSystemAutoWorkConfig(system_auto_work_config) {
    var index = system_auto_work_config.index;
    var start_time_enable = system_auto_work_config.start_time_enable;
    var start_time = system_auto_work_config.start_time;
    var end_time_enable = system_auto_work_config.end_time_enable;
    var end_time = system_auto_work_config.end_time;
    var week_cycle = system_auto_work_config.week_cycle;

    var index_values = [1, 2];
    if (index_values.indexOf(index) === -1) {
        throw new Error("system_auto_work_config._item.index must be one of " + index_values.join(", "));
    }
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(start_time_enable) === -1) {
        throw new Error("system_auto_work_config._item.start_time_enable must be one of " + enable_values.join(", "));
    }
    if (enable_values.indexOf(end_time_enable) === -1) {
        throw new Error("system_auto_work_config._item.end_time_enable must be one of " + enable_values.join(", "));
    }

    var week_cycle_data = 0x00;
    var week_bits_offset = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
    for (var key in week_bits_offset) {
        if (key in system_auto_work_config.week_cycle) {
            if (enable_values.indexOf(system_auto_work_config.week_cycle[key]) === -1) {
                throw new Error("system_auto_work_config._item.week_cycle." + key + " must be one of " + enable_values.join(", "));
            }

            week_cycle_data |= getValue(enable_map, system_auto_work_config.week_cycle[key]) << week_bits_offset[key];
        }
    }
    var buffer = new Buffer(9);
    buffer.writeUInt8(0x8a);
    buffer.writeUInt8(index);
    buffer.writeUInt8(getValue(enable_map, start_time_enable));
    buffer.writeUInt16LE(start_time);
    buffer.writeUInt8(getValue(enable_map, end_time_enable));
    buffer.writeUInt16LE(end_time);
    buffer.writeUInt8(week_cycle_data);
    return buffer.toBytes();
}

/**
 * Set button temporary unlocked config
 * @param {object} button_temporary_unlocked_config
 * @param {number} button_temporary_unlocked_config.enable values: (0: disable, 1: enable)
 * @param {number} button_temporary_unlocked_config.duration unit: seconds, range: [1, 3600]
 * @example { "button_temporary_unlocked_config": { "enable": 0, "duration": 10 } }
 */
function setButtonTemporaryUnlockedConfig(button_temporary_unlocked_config) {
    var duration = button_temporary_unlocked_config.duration;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (duration < 1 || duration > 3600) {
        throw new Error("button_temporary_unlocked_config.duration must be between 1 and 3600");
    }

    var data = 0x00;
    var unlock_bits_offset = { system_button: 0, temperature_up_button: 1, temperature_down_button: 2, fan_button: 3, temperature_control_mode_button: 4 };
    for (var key in unlock_bits_offset) {
        if (key in button_temporary_unlocked_config) {
            if (enable_values.indexOf(button_temporary_unlocked_config[key]) === -1) {
                throw new Error("button_temporary_unlocked_config." + key + " must be one of " + enable_values.join(", "));
            }

            data |= getValue(enable_map, button_temporary_unlocked_config[key]) << unlock_bits_offset[key];
        }
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0x8b);
    buffer.writeUInt8(data);
    buffer.writeUInt16LE(duration);
    return buffer.toBytes();
}

/**
 * Set time zone
 * @param {number} time_zone values: ( -720: UTC-12:00, -660: UTC-11:00, -600: UTC-10:00, -570: UTC-09:30, -540: UTC-09:00, -480: UTC-08:00, -420: UTC-07:00, -360: UTC-06:00, -300: UTC-05:00, -240: UTC-04:00, -210: UTC-03:30, -180: UTC-03:00, -120: UTC-02:00, -60: UTC-01:00, 0: UTC+00:00, 60: UTC+01:00, 120: UTC+02:00, 180: UTC+03:00, 210: UTC+03:30, 240: UTC+04:00, 270: UTC+04:30, 300: UTC+05:00, 330: UTC+05:30, 345: UTC+05:45, 360: UTC+06:00, 390: UTC+06:30, 420: UTC+07:00, 480: UTC+08:00, 540: UTC+09:00, 570: UTC+09:30, 600: UTC+10:00, 630: UTC+10:30, 660: UTC+11:00, 720: UTC+12:00, 765: UTC+12:45, 780: UTC+13:00, 840: UTC+14:00)
 * @example { "time_zone": 480 }
 */
function setTimeZone(time_zone) {
    var timezone_map = { "-720": "UTC-12:00", "-660": "UTC-11:00", "-600": "UTC-10:00", "-570": "UTC-09:30", "-540": "UTC-09:00", "-480": "UTC-08:00", "-420": "UTC-07:00", "-360": "UTC-06:00", "-300": "UTC-05:00", "-240": "UTC-04:00", "-210": "UTC-03:30", "-180": "UTC-03:00", "-120": "UTC-02:00", "-60": "UTC-01:00", 0: "UTC+00:00", 60: "UTC+01:00", 120: "UTC+02:00", 180: "UTC+03:00", 210: "UTC+03:30", 240: "UTC+04:00", 270: "UTC+04:30", 300: "UTC+05:00", 330: "UTC+05:30", 345: "UTC+05:45", 360: "UTC+06:00", 390: "UTC+06:30", 420: "UTC+07:00", 480: "UTC+08:00", 540: "UTC+09:00", 570: "UTC+09:30", 600: "UTC+10:00", 630: "UTC+10:30", 660: "UTC+11:00", 720: "UTC+12:00", 765: "UTC+12:45", 780: "UTC+13:00", 840: "UTC+14:00" };
    var timezone_values = getValues(timezone_map);
    if (timezone_values.indexOf(time_zone) === -1) {
        throw new Error("time_zone must be one of " + timezone_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xc7);
    buffer.writeUInt16LE(getValue(timezone_map, time_zone));
    return buffer.toBytes();
}

/**
 * Set daylight saving time settings
 * @param {object} daylight_saving_time
 * @param {number} daylight_saving_time.enable values: (0: disable, 1: enable)
 * @param {number} daylight_saving_time.offset unit: minute
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
 * Set history enable
 * @param {number} history_enable values: (0: disable, 1: enable)
 * @example { "history_enable": { "enable": 1 } }
 */
function setHistoryEnable(history_enable) {
    var enable = history_enable.enable;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("history_enable.enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0xc5);
    buffer.writeUInt8(getValue(enable_map, enable));
    return buffer.toBytes();
}

/**
 * Set history transmit config
 * @param {object} history_transmit_config
 * @param {number} history_transmit_config.enable values: (0: disable, 1: enable)
 * @param {number} history_transmit_config.retransmission_interval unit: seconds, range: [30, 1200]
 * @param {number} history_transmit_config.resend_interval unit: seconds, range: [30, 1200]
 * @example { "history_transmit_config": { "enable": 1, "retransmission_interval": 60, "resend_interval": 60 } }
 */
function setHistoryConfig(history_transmit_config) {
    var data = [];

    if ("enable" in history_transmit_config) {
        var enable_map = { 0: "disable", 1: "enable" };
        var enable_values = getValues(enable_map);
        if (enable_values.indexOf(enable) === -1) {
            throw new Error("history_transmit_config.enable must be one of " + enable_values.join(", "));
        }

        var buffer = new Buffer(2);
        buffer.writeUInt8(0xc4);
        buffer.writeUInt8(0x00);
        buffer.writeUInt8(getValue(enable_map, enable));
        data.push(buffer.toBytes());
    }
    if ("retransmission_interval" in history_transmit_config) {
        var retransmission_interval = history_transmit_config.retransmission_interval;
        if (retransmission_interval < 30 || retransmission_interval > 1200) {
            throw new Error("history_transmit_config.retransmission_interval must be between 30 and 1200");
        }

        var buffer = new Buffer(2);
        buffer.writeUInt8(0xc4);
        buffer.writeUInt8(0x01);
        buffer.writeUInt16LE(retransmission_interval);
        data.push(buffer.toBytes());
    }
    if ("resend_interval" in history_transmit_config) {
        var resend_interval = history_transmit_config.resend_interval;
        if (resend_interval < 30 || resend_interval > 1200) {
            throw new Error("history_transmit_config.resend_interval must be between 30 and 1200");
        }

        var buffer = new Buffer(2);
        buffer.writeUInt8(0xc4);
        buffer.writeUInt8(0x02);
        buffer.writeUInt16LE(resend_interval);
        data.push(buffer.toBytes());
    }
    return data;
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
 * Synchronize time
 * @example { "synchronize_time": 1 }
 */
function synchronizeTime() {
    var buffer = new Buffer(1);
    buffer.writeUInt8(0xb8);
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
 * Reconnect
 * @example { "reconnect": 1 }
 */
function reconnect() {
    var buffer = new Buffer(1);
    buffer.writeUInt8(0xb6);
    return buffer.toBytes();
}

/**
 * Clear history
 * @example { "clear_history": 1 }
 */
function clearHistory() {
    var buffer = new Buffer(1);
    buffer.writeUInt8(0xbd);
    return buffer.toBytes();
}

/**
 * Fetch history
 * @example { "fetch_history": 1 }
 */
function fetchHistory(fetch_history) {
    var start_time = fetch_history.start_time;
    var end_time = fetch_history.end_time;

    var start_time = fetch_history.start_time;
    if ("end_time" in fetch_history) {
        var end_time = fetch_history.end_time;

        var buffer = new Buffer(9);
        buffer.writeUInt8(0xbb);
        buffer.writeUInt32LE(start_time);
        buffer.writeUInt32LE(end_time);
        return buffer.toBytes();
    } else {
        var buffer = new Buffer(5);
        buffer.writeUInt8(0xba);
        buffer.writeUInt32LE(start_time);
        return buffer.toBytes();
    }
}

/**
 * Stop transmit history
 * @example { "stop_transmit_history": 1 }
 */
function stopTransmitHistory() {
    var buffer = new Buffer(1);
    buffer.writeUInt8(0xbc);
    return buffer.toBytes();
}

/**
 * Clear plan
 * @param {object} clear_plan
 * @param {number} clear_plan.plan_1 values: (0: no, 1: yes)
 * @param {number} clear_plan.plan_2 values: (0: no, 1: yes)
 * @param {number} clear_plan.plan_3 values: (0: no, 1: yes)
 * @param {number} clear_plan.plan_4 values: (0: no, 1: yes)
 * @param {number} clear_plan.plan_5 values: (0: no, 1: yes)
 * @param {number} clear_plan.plan_6 values: (0: no, 1: yes)
 * @param {number} clear_plan.plan_7 values: (0: no, 1: yes)
 * @param {number} clear_plan.plan_8 values: (0: no, 1: yes)
 * @param {number} clear_plan.plan_9 values: (0: no, 1: yes)
 * @param {number} clear_plan.plan_10 values: (0: no, 1: yes)
 * @param {number} clear_plan.plan_11 values: (0: no, 1: yes)
 * @param {number} clear_plan.plan_12 values: (0: no, 1: yes)
 * @param {number} clear_plan.plan_13 values: (0: no, 1: yes)
 * @param {number} clear_plan.plan_14 values: (0: no, 1: yes)
 * @param {number} clear_plan.plan_15 values: (0: no, 1: yes)
 * @param {number} clear_plan.plan_16 values: (0: no, 1: yes)
 * @param {number} clear_plan.all values: (0: no, 1: yes)
 * @example { "clear_plan": { "plan_1": 1, "plan_2": 1, "plan_3": 1, "plan_4": 1, "plan_5": 1, "plan_6": 1, "plan_7": 1, "plan_8": 1, "plan_9": 1, "plan_10": 1 } }
 */
function clearPlan(clear_plan) {
    var plan_index_map = { plan_1: 0, plan_2: 1, plan_3: 2, plan_4: 3, plan_5: 4, plan_6: 5, plan_7: 6, plan_8: 7, plan_9: 8, plan_10: 9, plan_11: 10, plan_12: 11, plan_13: 12, plan_14: 13, plan_15: 14, plan_16: 15, all: 16 };
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);

    var data = [];
    for (var key in plan_index_map) {
        if (key in clear_plan) {
            if (yes_no_values.indexOf(clear_plan[key]) === -1) {
                throw new Error("clear_plan." + key + " must be one of " + yes_no_values.join(", "));
            }

            if (getValue(yes_no_map, clear_plan[key]) === 1) {
                var buffer = new Buffer(2);
                buffer.writeUInt8(0x5f);
                buffer.writeUInt8(plan_index_map[key]);
                data.push(buffer.toBytes());
            }
        }
    }
    return data;
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

Buffer.prototype.writeBytes = function (bytes) {
    for (var i = 0; i < bytes.length; i++) {
        this.buffer[this.offset + i] = bytes[i];
    }
    this.offset += bytes.length;
};

Buffer.prototype.toBytes = function () {
    return this.buffer;
};

function stringToBytes(str) {
    var bytes = [];
    for (var i = 0; i < str.length; i++) {
        bytes.push(str.charCodeAt(i));
    }
    return bytes;
}

function hexStringToBytes(hex) {
    var bytes = [];
    for (var i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return bytes;
}
