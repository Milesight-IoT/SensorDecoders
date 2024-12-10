/**
 * Payload Encoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product WT201 v2
 */
var RAW_VALUE = 0x01;

// Chirpstack v4
function encodeDownlink(input) {
    var encoded = milesightDeviceEncoder(input.data);
    return { bytes: encoded };
}

// Chirpstack v3
function Encode(fPort, obj) {
    var encoded = milesightDeviceEncoder(obj);
    return encoded;
}

// The Things Network
function Encoder(obj, port) {
    return milesightDeviceEncoder(obj);
}

function milesightDeviceEncoder(payload) {
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
    if ("collection_interval" in payload) {
        encoded = encoded.concat(setCollectionInterval(payload.collection_interval));
    }
    if ("sync_time" in payload) {
        encoded = encoded.concat(syncTime(payload.sync_time));
    }
    if ("timezone" in payload) {
        encoded = encoded.concat(setTimezone(payload.timezone));
    }
    if ("dst_config" in payload) {
        encoded = encoded.concat(setDaylightSavingTime(payload.dst_config.enable, payload.dst_config.offset, payload.dst_config.start_time, payload.dst_config.end_time));
    }
    if ("temperature_control_mode" in payload) {
        if ("temperature_unit" in payload) {
            encoded = encoded.concat(setTemperatureControl(payload.temperature_control_mode, payload.temperature_target, payload.temperature_unit));
        } else if ("temperature_target" in payload) {
            encoded = encoded.concat(setTemperatureTarget(payload.temperature_control_mode, payload.temperature_target));
        } else {
            encoded = encoded.concat(setTemperatureControlMode(payload.temperature_control_mode));
        }
    }
    if ("temperature_control_enable" in payload) {
        encoded = encoded.concat(setTemperatureControlEnable(payload.temperature_control_enable));
    }
    if ("temperature_calibration" in payload) {
        encoded = encoded.concat(setTemperatureCalibration(payload.temperature_calibration.enable, payload.temperature_calibration.temperature));
    }
    if ("humidity_calibration" in payload) {
        encoded = encoded.concat(setHumidityCalibration(payload.humidity_calibration.enable, payload.humidity_calibration.humidity));
    }
    if ("temperature_tolerance" in payload) {
        encoded = encoded.concat(setTemperatureTolerance(payload.temperature_tolerance.target_temperature_tolerance, payload.temperature_tolerance.auto_temperature_tolerance));
    }
    if ("temperature_target_resolution" in payload) {
        encoded = encoded.concat(setTemperatureTargetResolution(payload.temperature_target_resolution));
    }
    if ("temperature_target_range" in payload) {
        encoded = encoded.concat(setTemperatureTargetRange(payload.temperature_target_range.temperature_control_mode, payload.temperature_target_range.min, payload.temperature_target_range.max));
    }
    if ("temperature_level_up_condition" in payload) {
        encoded = encoded.concat(setTemperatureLevelUpCondition(payload.temperature_level_up_condition.type, payload.temperature_level_up_condition.time, payload.temperature_level_up_condition.temperature_error));
    }
    if ("temperature_level_up_down_delta" in payload) {
        encoded = encoded.concat(setTemperatureLevelUpDownDelta(payload.temperature_level_up_down_delta.delta1, payload.temperature_level_up_down_delta.delta2));
    }
    if ("outside_temperature_control" in payload) {
        encoded = encoded.concat(setOutsideTemperatureControl(payload.outside_temperature_control.enable, payload.outside_temperature_control.timeout));
    }
    if ("outside_temperature" in payload) {
        encoded = encoded.concat(setOutsideTemperature(payload.outside_temperature));
    }
    if ("freeze_protection_config" in payload) {
        encoded = encoded.concat(setFreezeProtection(payload.freeze_protection_config.enable, payload.freeze_protection_config.temperature));
    }
    if ("fan_mode" in payload) {
        encoded = encoded.concat(setFanMode(payload.fan_mode));
    }
    if ("fan_delay_enable" in payload) {
        encoded = encoded.concat(setFanModeWithDelay(payload.fan_delay_enable, payload.fan_delay_time));
    }
    if ("fan_execute_time" in payload) {
        encoded = encoded.concat(setFanExecuteTime(payload.fan_execute_time));
    }
    if ("humidity_range" in payload) {
        encoded = encoded.concat(setHumidityRange(payload.humidity_range.min, payload.humidity_range.max));
    }
    if ("temperature_dehumidify" in payload) {
        encoded = encoded.concat(setTemperatureDehumidify(payload.temperature_dehumidify.enable, payload.temperature_dehumidify.temperature_tolerance));
    }
    if ("fan_dehumidify" in payload) {
        encoded = encoded.concat(setFanDehumidify(payload.fan_dehumidify.enable, payload.fan_dehumidify.execute_time));
    }
    if ("plan_mode" in payload) {
        encoded = encoded.concat(setPlanMode(payload.plan_mode));
    }
    if ("plan_schedule" in payload) {
        for (var i = 0; i < payload.plan_schedule.length; i++) {
            encoded = encoded.concat(setPlanSchedule(payload.plan_schedule[i].type, payload.plan_schedule[i].id, payload.plan_schedule[i].enable, payload.plan_schedule[i].week_recycle, payload.plan_schedule[i].time));
        }
    }
    if ("plan_config" in payload) {
        for (var i = 0; i < payload.plan_config.length; i++) {
            encoded = encoded.concat(setPlanConfig(payload.plan_config[i].type, payload.plan_config[i].temperature_control_mode, payload.plan_config[i].fan_mode, payload.plan_config[i].temperature_target, payload.plan_config[i].temperature_error, payload.plan_config[i].temperature_unit));
        }
    }
    if ("card_config" in payload) {
        encoded = encoded.concat(setCardConfig(payload.card_config.enable, payload.card_config.action_type, payload.card_config.in_plan_type, payload.card_config.out_plan_type, payload.card_config.invert));
    }
    if ("child_lock_config" in payload) {
        encoded = encoded.concat(setChildLock(payload.child_lock_config));
    }
    if ("ob_mode" in payload) {
        if ("wires" in payload) {
            encoded = encoded.concat(setWires(payload.wires, payload.ob_mode));
        } else {
            encoded = encoded.concat(setOBMode(payload.ob_mode));
        }
    }
    if ("multicast_group_config" in payload) {
        encoded = encoded.concat(setMulticastGroupConfig(payload.multicast_group_config));
    }
    if ("d2d_master_enable" in payload || "d2d_slave_enable" in payload) {
        encoded = encoded.concat(setD2DEnable(payload.d2d_master_enable, payload.d2d_slave_enable));
    }
    if ("d2d_master_config" in payload) {
        for (var i = 0; i < payload.d2d_master_config.length; i++) {
            var config = payload.d2d_master_config[i];
            encoded = encoded.concat(setD2DMasterConfig(config.mode, config.enable, config.d2d_cmd, config.uplink_enable, config.time_enable, config.time));
        }
    }
    if ("d2d_slave_config" in payload) {
        for (var i = 0; i < payload.d2d_slave_config.length; i++) {
            var config = payload.d2d_slave_config[i];
            encoded = encoded.concat(setD2DSlaveConfig(config.id, config.enable, config.d2d_cmd, config.action_type, config.action));
        }
    }
    if ("temperature_threshold_config" in payload) {
        for (var i = 0; i < payload.temperature_threshold_config.length; i++) {
            var config = payload.temperature_threshold_config[i];
            encoded = encoded.concat(setTemperatureAlarmConfig(config.alarm_type, config.condition, config.min, config.max, config.lock_time, config.continue_time));
        }
    }
    if ("temperature_alarm_config" in payload) {
        encoded = encoded.concat(setTemperatureAlarmConfig(payload.temperature_alarm_config.alarm_type, payload.temperature_alarm_config.condition, payload.temperature_alarm_config.min, payload.temperature_alarm_config.max, payload.temperature_alarm_config.lock_time, payload.temperature_alarm_config.continue_time));
    }
    if ("control_permissions" in payload) {
        encoded = encoded.concat(setControlPermissions(payload.control_permissions));
    }
    if ("offline_control_mode" in payload) {
        encoded = encoded.concat(setOfflineControlMode(payload.offline_control_mode));
    }
    if ("wires_relay_config" in payload) {
        encoded = encoded.concat(setWiresRelayConfig(payload.wires_relay_config));
    }
    if ("wires_relay_change_report_enable" in payload) {
        encoded = encoded.concat(setWiresRelayChangeReport(payload.wires_relay_change_report_enable));
    }
    if ("aux_relay_config" in payload) {
        encoded = encoded.concat(setAuxRelayConfig(payload.aux_relay_config.y2_enable, payload.aux_relay_config.y2_status, payload.aux_relay_config.w2_enable, payload.aux_relay_config.w2_status));
    }
    if ("screen_display_mode" in payload) {
        encoded = encoded.concat(setScreenDisplayMode(payload.screen_display_mode));
    }

    return encoded;
}

/**
 * reboot device
 * @param {number} reboot values: (0: no, 1: yes)
 * @example { "reboot": 1 }
 */
function reboot(reboot) {
    var reboot_map = { 0: "no", 1: "yes" };
    var reboot_values = getValues(reboot_map);
    if (reboot_values.indexOf(reboot) === -1) {
        throw new Error("reboot must be one of " + reboot_values.join(", "));
    }

    if (getValue(reboot_map, reboot) === 0) {
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
    var report_status_map = { 0: "plan", 1: "periodic" };
    var report_status_values = getValues(report_status_map);
    if (report_status_values.indexOf(report_status) === -1) {
        throw new Error("report_status must be one of " + report_status_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x28);
    buffer.writeUInt8(getValue(report_status_map, report_status));
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
 * set collection interval
 * @param {number} collection_interval unit: second, range: [10, 60]
 * @example { "collection_interval": 300 }
 */
function setCollectionInterval(collection_interval) {
    if (typeof collection_interval !== "number") {
        throw new Error("collection_interval must be a number");
    }
    if (collection_interval < 10 || collection_interval > 60) {
        throw new Error("collection_interval must be in range [10, 60]");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x02);
    buffer.writeUInt16LE(collection_interval);
    return buffer.toBytes();
}

/**
 * sync time
 * @param {number} sync_time values: (0: no, 1: yes)
 * @example { "sync_time": 1 }
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
 * set timezone
 * @param {number} timezone unit: minute, convert: "hh:mm" -> "hh * 60 + mm", values: ( -720: UTC-12, -660: UTC-11, -600: UTC-10, -570: UTC-9:30, -540: UTC-9, -480: UTC-8, -420: UTC-7, -360: UTC-6, -300: UTC-5, -240: UTC-4, -210: UTC-3:30, -180: UTC-3, -120: UTC-2, -60: UTC-1, 0: UTC, 60: UTC+1, 120: UTC+2, 180: UTC+3, 240: UTC+4, 300: UTC+5, 360: UTC+6, 420: UTC+7, 480: UTC+8, 540: UTC+9, 570: UTC+9:30, 600: UTC+10, 660: UTC+11, 720: UTC+12, 750: UTC+12:45, 780: UTC+13, 840: UTC+14 )
 * @example { "timezone": 8 }
 * @example { "timezone": -4 }
 */
function setTimezone(timezone) {
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
 * set daylight saving time
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
 * set temperature control enable
 * @param {number} enable values: (0: disable, 1: enable)
 * @example { "temperature_control_enable": 1 }
 */
function setTemperatureControlEnable(temperature_control_enable) {
    var temperature_control_enable_map = { 0: "disable", 1: "enable" };
    var temperature_control_enable_values = getValues(temperature_control_enable_map);
    if (temperature_control_enable_values.indexOf(temperature_control_enable) === -1) {
        throw new Error("temperature_control_enable must be one of " + temperature_control_enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xc5);
    buffer.writeUInt8(getValue(temperature_control_enable_map, temperature_control_enable));
    return buffer.toBytes();
}

/**
 * set temperature control
 * @param {string} temperature_control_mode values: (0: "heat", 1: "em heat", 2: "cool", 3: "auto")
 * @param {number} temperature_target unit: celsius
 * @param {string} temperature_unit values: (0: "celsius", 1: "fahrenheit")
 * @example { "temperature_control_mode": 2, "temperature_target": 25 , "temperature_unit": 0 }
 * @example { "temperature_control_mode": 2, "temperature_target": 77 , "temperature_unit": 1 }
 */
function setTemperatureControl(temperature_control_mode, temperature_target, temperature_unit) {
    var temperature_control_mode_map = { 0: "heat", 1: "em heat", 2: "cool", 3: "auto" };
    var temperature_control_mode_values = getValues(temperature_control_mode_map);
    if (temperature_control_mode_values.indexOf(temperature_control_mode) === -1) {
        throw new Error("temperature_control_mode must be one of " + temperature_control_mode_values.join(", "));
    }
    if (typeof temperature_target !== "number") {
        throw new Error("temperature_target must be a number");
    }
    var temperature_unit_map = { 0: "celsius", 1: "fahrenheit" };
    var temperature_unit_values = getValues(temperature_unit_map);
    if (temperature_unit_values.indexOf(temperature_unit) === -1) {
        throw new Error("temperature_unit must be one of " + temperature_unit_values.join(", "));
    }

    var value = getValue(temperature_unit_map, temperature_unit) === 1 ? temperature_target | 0x80 : temperature_target & 0x7f;

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xb7);
    buffer.writeUInt8(getValue(temperature_control_mode_map, temperature_control_mode));
    buffer.writeUInt8(value);
    return buffer.toBytes();
}

/**
 * set temperature control v2
 * @param {number} temperature_control_enable values: (0: "disable", 1: "enable")
 * @param {number} temperature_control_mode values: (0: "heat", 1: "em heat", 2: "cool", 3: "auto")
 * @param {number} temperature_target unit: celsius
 * @example { "temperature_control_enable": 1, "temperature_control_mode": 2, "temperature_target": 25 }
 * @since v2.0
 */
function setTemperatureControlV2(temperature_control_enable, temperature_control_mode, temperature_target) {
    var enable_values = [0, 1];
    if (enable_values.indexOf(temperature_control_enable) === -1) {
        throw new Error("temperature_control_enable must be one of " + enable_values.join(", "));
    }
    var mode_values = [0, 1, 2, 3];
    if (mode_values.indexOf(temperature_control_mode) === -1) {
        throw new Error("temperature_control_mode must be one of " + mode_values.join(", "));
    }
    if (typeof temperature_target !== "number") {
        throw new Error("temperature_target must be a number");
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x45);
    buffer.writeUInt8(temperature_control_enable);
    buffer.writeUInt8(temperature_control_mode);
    buffer.writeInt16LE(temperature_target * 10);
    return buffer.toBytes();
}

/**
 * set temperature calibration
 * @param {number} enable values: (0: disable, 1: enable)
 * @param {number} temperature, unit: celsius
 * @example { "temperature_calibration": { "enable": 1, "temperature": 25 } }
 */
function setTemperatureCalibration(enable, temperature) {
    var temperature_calibrate_enable_map = { 0: "disable", 1: "enable" };
    var temperature_calibrate_enable_values = getValues(temperature_calibrate_enable_map);
    if (temperature_calibrate_enable_values.indexOf(enable) === -1) {
        throw new Error("temperature_calibration.enable must be one of " + temperature_calibrate_enable_values.join(", "));
    }
    if (enable && typeof temperature !== "number") {
        throw new Error("temperature_calibration.temperature must be a number");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xab);
    buffer.writeUInt8(getValue(temperature_calibrate_enable_map, enable));
    buffer.writeInt16LE(temperature * 10);
    return buffer.toBytes();
}

/**
 * set humidity calibration
 * @since v1.3
 * @param {number} enable values: (0: disable, 1: enable)
 * @param {number} humidity
 * @example { "humidity_calibration": { "enable": 1, "humidity": 50 } }
 */
function setHumidityCalibration(enable, humidity) {
    var humidity_calibrate_enable_map = { 0: "disable", 1: "enable" };
    var humidity_calibrate_enable_values = getValues(humidity_calibrate_enable_map);
    if (humidity_calibrate_enable_values.indexOf(enable) === -1) {
        throw new Error("humidity_calibration.enable must be one of " + humidity_calibrate_enable_values.join(", "));
    }
    if (enable && typeof humidity !== "number") {
        throw new Error("humidity_calibration.humidity must be a number");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(getValue(humidity_calibrate_enable_map, enable));
    buffer.writeInt16LE(humidity * 10);
    return buffer.toBytes();
}

/**
 * set temperature tolerance
 * @param {number} target_temperature_tolerance unit: celsius
 * @param {number} auto_temperature_tolerance unit: celsius
 * @example { "temperature_tolerance": {"target_temperature_tolerance": 1, "auto_temperature_tolerance": 1 }}
 */
function setTemperatureTolerance(target_temperature_tolerance, auto_temperature_tolerance) {
    if (typeof target_temperature_tolerance !== "number") {
        throw new Error("temperature_tolerance.target_temperature_tolerance must be a number");
    }
    if (typeof auto_temperature_tolerance !== "number") {
        throw new Error("temperature_tolerance.auto_temperature_tolerance must be a number");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xb8);
    buffer.writeUInt8(target_temperature_tolerance * 10);
    buffer.writeUInt8(auto_temperature_tolerance * 10);
    return buffer.toBytes();
}

/**
 * set temperature target resolution
 * @param {number} temperature_target_resolution values: (0: 0.5, 1: 1)
 * @example { "temperature_target_resolution": 0.5 }
 * @since v2.0
 */
function setTemperatureTargetResolution(temperature_target_resolution) {
    var temperature_target_resolution_values = [0, 1];
    if (temperature_target_resolution_values.indexOf(temperature_target_resolution) === -1) {
        throw new Error("temperature_target_resolution must be one of " + temperature_target_resolution_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x41);
    buffer.writeUInt8(temperature_target_resolution);
    return buffer.toBytes();
}

/**
 * set temperature target range
 * @param {number} temperature_control_mode values: (0: heat, 1: em heat, 2: cool, 3: auto)
 * @param {number} min unit: celsius
 * @param {number} max unit: celsius
 * @example { "temperature_target_range": { "temperature_control_mode": 2, "min": 15, "max": 30 } }
 * @since v2.0
 */
function setTemperatureTargetRange(temperature_control_mode, min, max) {
    var temperature_mode_values = [0, 1, 2, 3];
    if (temperature_mode_values.indexOf(temperature_control_mode) === -1) {
        throw new Error("temperature_control_mode must be one of " + temperature_mode_values.join(", "));
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x42);
    buffer.writeUInt8(temperature_control_mode);
    buffer.writeInt16LE(min * 10);
    buffer.writeInt16LE(max * 10);
    return buffer.toBytes();
}

/**
 * set temperature level up condition
 * @param {string} type values: (0: heat, 1: cool)
 * @param {number} time unit: minute
 * @param {number} temperature_tolerance unit: celsius
 * @example { "temperature_level_up_condition": { "type": 0, "time": 10, "temperature_tolerance": 1 } }
 */
function setTemperatureLevelUpCondition(type, time, temperature_tolerance) {
    var temperature_level_up_condition_type_map = { 0: "heat", 1: "cool" };
    var temperature_level_up_condition_type_values = getValues(temperature_level_up_condition_type_map);
    if (temperature_level_up_condition_type_values.indexOf(type) === -1) {
        throw new Error("temperature_level_up_condition.type must be one of " + temperature_level_up_condition_type_values.join(", "));
    }
    if (typeof time !== "number") {
        throw new Error("temperature_level_up_condition.time must be a number");
    }
    if (typeof temperature_tolerance !== "number") {
        throw new Error("temperature_level_up_condition.temperature_tolerance must be a number");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xb9);
    buffer.writeUInt8(getValue(temperature_level_up_condition_type_map, type));
    buffer.writeUInt8(time);
    buffer.writeUInt8(temperature_tolerance * 10);
    return buffer.toBytes();
}

/**
 * set temperature level up delta
 * @param {number} delta1 unit: celsius
 * @param {number} delta2 unit: celsius
 * @example { "temperature_level_up_down_delta": { "delta1": 1, "delta2": 2 } }
 * @since v2.0
 */
function setTemperatureLevelUpDownDelta(delta1, delta2) {
    var buffer = new Buffer(5);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x43);
    buffer.writeUInt8(0x00);
    buffer.writeUInt8(delta1 * 10);
    buffer.writeUInt8(delta2 * 10);
    return buffer.toBytes();
}

/**
 * set temperature up down enable
 * @param {number} forward_enable values: (0: disable, 1: enable)
 * @param {number} forward_status values: (0: on, 1: off)
 * @param {number} backward_enable values: (0: disable, 1: enable)
 * @param {number} backward_status values: (0: on, 1: off)
 * @example { "temperature_up_down_enable": { "forward_enable": 1, "forward_status": 1, "backward_enable": 1, "backward_status": 1 } }
 * @since v2.0
 */
function setTemperatureUpDownEnable(forward_enable, forward_status, backward_enable, backward_status) {
    var enable_values = [0, 1];
    var status_values = [0, 1];
    if (enable_values.indexOf(forward_enable) === -1) {
        throw new Error("temperature_up_down_enable.forward_enable must be one of " + enable_values.join(", "));
    }
    if (status_values.indexOf(forward_status) === -1) {
        throw new Error("temperature_up_down_enable.forward_status must be one of " + status_values.join(", "));
    }
    if (enable_values.indexOf(backward_enable) === -1) {
        throw new Error("temperature_up_down_enable.backward_enable must be one of " + enable_values.join(", "));
    }
    if (status_values.indexOf(backward_status) === -1) {
        throw new Error("temperature_up_down_enable.backward_status must be one of " + status_values.join(", "));
    }

    var status_status = (backward_status << 1) | forward_status;
    var enable_status = (backward_enable << 1) | forward_enable;

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x1b);
    buffer.writeUInt8(status_status);
    buffer.writeUInt8(enable_status);
    return buffer.toBytes();
}

/**
 * set temperature control enable
 * @since v1.3
 * @param {number} temperature_control_mode values: (0: heat, 1: em heat, 2: cool, 3: auto)
 * @param {number} target_temperature unit: celsius
 * @example { "temperature_control_mode": 2, "target_temperature": 25 }
 */
function setTemperatureTarget(temperature_control_mode, target_temperature) {
    var temperature_mode_map = { 0: "heat", 1: "em heat", 2: "cool", 3: "auto" };
    var temperature_mode_values = getValues(temperature_mode_map);
    if (temperature_mode_values.indexOf(temperature_control_mode) === -1) {
        throw new Error("temperature_control_mode must be one of " + temperature_mode_values.join(", "));
    }
    if (typeof target_temperature !== "number") {
        throw new Error("target_temperature must be a number");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xfa);
    buffer.writeUInt8(getValue(temperature_mode_map, temperature_control_mode));
    buffer.writeInt16LE(target_temperature * 10);
    return buffer.toBytes();
}

/**
 * set temperature control mode
 * @since v1.3
 * @param {number} temperature_control_mode values: (0: heat, 1: em heat, 2: cool, 3: auto)
 * @example { "temperature_control_mode": 2 }
 */
function setTemperatureControlMode(temperature_control_mode) {
    var temperature_mode_map = { 0: "heat", 1: "em heat", 2: "cool", 3: "auto" };
    var temperature_mode_values = getValues(temperature_mode_map);
    if (temperature_mode_values.indexOf(temperature_control_mode) === -1) {
        throw new Error("temperature_control_mode must be one of " + temperature_mode_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xfb);
    buffer.writeUInt8(getValue(temperature_mode_map, temperature_control_mode));
    return buffer.toBytes();
}

/**
 * set outside temperature control
 * @param {number} enable values: (0: disable, 1: enable)
 * @param {number} timeout, unit: minute, range: [3, 60]
 * @example { "outside_temperature_control": { "enable": 1, "timeout": 10 } }
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
        throw new Error("outside_temperature_control.timeout must be in range [3, 60]");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xc4);
    buffer.writeUInt8(getValue(outside_temperature_control_enable_map, enable));
    buffer.writeUInt8(timeout);
    return buffer.toBytes();
}

/**
 * set outside temperature
 * @param {number} outside_temperature, unit: celsius
 * @example { "outside_temperature": 25 }
 */
function setOutsideTemperature(outside_temperature) {
    if (typeof outside_temperature !== "number") {
        throw new Error("outside_temperature must be a number");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0x03);
    buffer.writeInt16LE(outside_temperature * 10);
    buffer.writeUInt8(0x00);
    return buffer.toBytes();
}

/**
 * set humidity range
 * @since v1.3
 * @param {number} min range: [0, 100]
 * @param {number} max range: [0, 100]
 * @example { "humidity_range": { "min": 20, "max": 80 } }
 */
function setHumidityRange(min, max) {
    if (typeof min !== "number") {
        throw new Error("humidity_range.min must be a number");
    }
    if (typeof max !== "number") {
        throw new Error("humidity_range.max must be a number");
    }
    if (min < 0 || min > 100) {
        throw new Error("humidity_range.min must be in range [0, 100]");
    }
    if (max < 0 || max > 100) {
        throw new Error("humidity_range.max must be in range [0, 100]");
    }
    if (min > max) {
        throw new Error("humidity_range.min must be less than humidity_range.max");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x09);
    buffer.writeUInt8(min);
    buffer.writeUInt8(max);
    return buffer.toBytes();
}

/**
 * set temperature dehumidify
 * @since v1.3
 * @param {number} enable values: (0: disable, 1: enable)
 * @param {number} temperature_tolerance unit: celsius, range: [0.1, 5]
 * @example { "temperature_dehumidify": { "enable": 1, "temperature_tolerance": 1 } }
 */
function setTemperatureDehumidify(enable, temperature_tolerance) {
    var dehumidify_enable_map = { 0: "disable", 1: "enable" };
    var dehumidify_enable_values = getValues(dehumidify_enable_map);
    if (dehumidify_enable_values.indexOf(enable) === -1) {
        throw new Error("temperature_dehumidify.enable must be one of " + dehumidify_enable_values.join(", "));
    }
    if (enable) {
        // default value
        if (temperature_tolerance === undefined) {
            temperature_tolerance = 0xff;
        }
        if (typeof temperature_tolerance !== "number") {
            throw new Error("temperature_dehumidify.temperature_tolerance must be a number");
        }
        if (temperature_tolerance !== 0xff && (temperature_tolerance < 0.1 || temperature_tolerance > 5)) {
            throw new Error("temperature_dehumidify.temperature_tolerance must be in range [0.1, 5]");
        }
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x0a);
    buffer.writeUInt8(getValue(dehumidify_enable_map, enable));
    buffer.writeUInt8(temperature_tolerance === 0xff ? temperature_tolerance : temperature_tolerance * 10);
    return buffer.toBytes();
}

/**
 * set fan dehumidify
 * @since v1.3
 * @param {number} enable values: (0: disable, 1: enable)
 * @param {number} execute_time range: [5, 55], unit: minute
 * @example { "fan_dehumidify": { "enable": 1, "execute_time": 10 } }
 */
function setFanDehumidify(enable, execute_time) {
    var fan_dehumidify_enable_map = { 0: "disable", 1: "enable" };
    var fan_dehumidify_enable_values = getValues(fan_dehumidify_enable_map);
    if (fan_dehumidify_enable_values.indexOf(enable) === -1) {
        throw new Error("fan_dehumidify.enable must be one of " + fan_dehumidify_enable_values.join(", "));
    }
    if (enable && typeof execute_time !== "number") {
        throw new Error("fan_dehumidify.execute_time must be a number");
    }
    if (enable && (execute_time < 5 || execute_time > 55)) {
        throw new Error("fan_dehumidify.execute_time must be in range [5, 55]");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x07);
    buffer.writeUInt8(getValue(fan_dehumidify_enable_map, enable));
    buffer.writeUInt8(execute_time);
    return buffer.toBytes();
}

/**
 * freeze protection configuration
 * @param {number} enable values: (0: disable, 1: enable)
 * @param {number} temperature, unit: celsius
 * @example { "freeze_protection_config": { "enable": 1, "temperature": 10 } }
 */
function setFreezeProtection(enable, temperature) {
    var freeze_protection_enable_map = { 0: "disable", 1: "enable" };
    var freeze_protection_enable_values = getValues(freeze_protection_enable_map);
    if (freeze_protection_enable_values.indexOf(enable) === -1) {
        throw new Error("freeze_protection_config.enable must be one of " + freeze_protection_enable_values.join(", "));
    }
    if (enable && typeof temperature !== "number") {
        throw new Error("freeze_protection_config.temperature must be a number");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xb0);
    buffer.writeUInt8(getValue(freeze_protection_enable_map, enable));
    buffer.writeInt16LE(temperature * 10);
    return buffer.toBytes();
}

/**
 * @param {string} fan_mode values: (0: auto, 1: on, 2: circulate)
 * @example { "fan_mode": 0 }
 */
function setFanMode(fan_mode) {
    var fan_mode_map = { 0: "auto", 1: "on", 2: "circulate" };
    var fan_mode_values = getValues(fan_mode_map);
    if (fan_mode_values.indexOf(fan_mode) === -1) {
        throw new Error("fan_mode must be one of " + fan_mode_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xb6);
    buffer.writeUInt8(getValue(fan_mode_map, fan_mode));
    return buffer.toBytes();
}

/**
 * set fan mode with delay
 * @param {number} fan_delay_enable values: (0: disable, 1: enable)
 * @param {number} fan_delay_time unit: minute, range: [5, 55]
 * @example { "fan_delay_enable": 1, "fan_delay_time": 10 }
 */
function setFanModeWithDelay(fan_delay_enable, fan_delay_time) {
    var fan_delay_enable_map = { 0: "disable", 1: "enable" };
    var fan_delay_enable_values = getValues(fan_delay_enable_map);
    if (fan_delay_enable_values.indexOf(fan_delay_enable) === -1) {
        throw new Error("fan_delay_enable must be one of " + fan_delay_enable_values.join(", "));
    }
    if (fan_delay_enable && typeof fan_delay_time !== "number") {
        throw new Error("fan_delay_time must be a number");
    }
    if (fan_delay_enable && (fan_delay_time < 5 || fan_delay_time > 55)) {
        throw new Error("fan_delay_time must be in range [5, 55]");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x05);
    buffer.writeUInt8(getValue(fan_delay_enable_map, fan_delay_enable));
    buffer.writeUInt8(fan_delay_time);
    return buffer.toBytes();
}

/**
 * set fan execute time
 * @since v1.3
 * @param {number} fan_execute_time range: [5,55], unit: minute
 * @example { "fan_execute_time": 10 }
 */
function setFanExecuteTime(fan_execute_time) {
    if (typeof fan_execute_time !== "number") {
        throw new Error("fan_execute_time must be a number");
    }
    if (fan_execute_time < 5 || fan_execute_time > 55) {
        throw new Error("fan_execute_time must be in range [5, 55]");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x06);
    buffer.writeUInt8(fan_execute_time);
    return buffer.toBytes();
}

/**
 * set plan mode
 * @param {string} plan_mode values: (0: wake, 1: away, 2: home, 3: sleep, 4: occupied, 5: vacant, 6: eco)
 * @example { "plan_mode": 0 }
 */
function setPlanMode(plan_mode) {
    var plan_mode_map = { 0: "wake", 1: "away", 2: "home", 3: "sleep", 4: "occupied", 5: "vacant", 6: "eco" };
    var plan_mode_values = getValues(plan_mode_map);
    if (plan_mode_values.indexOf(plan_mode) === -1) {
        throw new Error("plan_mode must be one of " + plan_mode_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xc2);
    buffer.writeUInt8(getValue(plan_mode_map, plan_mode));
    return buffer.toBytes();
}

/**
 * set plan schedule
 * @param {string} type values: (0: wake, 1: away, 2: home, 3: sleep, 4: occupied, 5: vacant, 6: eco)
 * @param {number} id range: [1, 16]
 * @param {number} enable values: (0: disable, 1: enable)
 * @param {Array} week_recycle values: (1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday, 7: Sunday)
 * @param {number} time unit: minute, convert: "hh:mm" -> "hh * 60 + mm"
 * @example { "plan_schedule": [{ "type": 0, "id": 0, "enable": 1, "week_recycle": [1, 3], "time": 240 }] }
 */
function setPlanSchedule(type, id, enable, week_recycle, time) {
    var plan_schedule_type_map = { 0: "wake", 1: "away", 2: "home", 3: "sleep", 4: "occupied", 5: "vacant", 6: "eco" };
    var plan_schedule_type_values = getValues(plan_schedule_type_map);
    if (plan_schedule_type_values.indexOf(type) === -1) {
        throw new Error("plan_schedule._item.type must be one of " + plan_schedule_type_values.join(", "));
    }
    if (typeof id !== "number") {
        throw new Error("plan_schedule._item.id must be a number");
    }
    if (id < 1 || id > 16) {
        throw new Error("plan_schedule._item.id must be in range [1, 16]");
    }
    var plan_schedule_enable_map = { 0: "disable", 1: "enable" };
    var plan_schedule_enable_values = getValues(plan_schedule_enable_map);
    if (plan_schedule_enable_values.indexOf(enable) === -1) {
        throw new Error("plan_schedule._item.enable must be one of " + plan_schedule_enable_values.join(", "));
    }
    var plan_schedule_week_recycle_map = { 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday", 7: "Sunday" };
    var plan_schedule_week_recycle_values = getValues(plan_schedule_week_recycle_map);
    if (Array.isArray(week_recycle) === false) {
        throw new Error("plan_schedule._item.week_recycle must be a array");
    }
    var days = 0x00;
    for (var i = 0; i < week_recycle.length; i++) {
        var day = week_recycle[i];
        if (plan_schedule_week_recycle_values.indexOf(day) === -1) {
            throw new Error("plan_schedule._item.week_recycle must be one of " + plan_schedule_week_recycle_values.join(", "));
        }
        var offset = plan_schedule_week_recycle_values.indexOf(day);
        days |= 1 << offset;
    }

    var buffer = new Buffer(8);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xc9);
    buffer.writeUInt8(getValue(plan_schedule_type_map, type));
    buffer.writeUInt8(id - 1);
    buffer.writeUInt8(getValue(plan_schedule_enable_map, enable));
    buffer.writeUInt8(days);
    buffer.writeUInt16LE(time);
    return buffer.toBytes();
}

/**
 * set plan config
 * @param {string} type values: (0: wake, 1: away, 2: home, 3: sleep, 4: occupied, 5: vacant, 6: eco)
 * @param {string} temperature_control_mode values: (0: heat, 1: em heat, 2: cool, 3: auto)
 * @param {string} fan_mode values: (0: auto, 1: on, 2: circulate)
 * @param {number} temperature_target
 * @param {number} temperature_error
 * @param {string} temperature_unit values: (0: celsius, 1: fahrenheit)
 * @example { "plan_config": { "type": 0, "temperature_control_mode": 2, "fan_mode": 0, "target_temperature": 20, "temperature_tolerance": 1 }, "temperature_unit": 0}
 * @example { "plan_config": { "type": 0, "temperature_control_mode": 2, "fan_mode": 0, "target_temperature": 77, "temperature_tolerance": 1 }, "temperature_unit": 1}
 */
function setPlanConfig(type, temperature_control_mode, fan_mode, target_temperature, temperature_tolerance, temperature_unit) {
    var plan_config_type_map = { 0: "wake", 1: "away", 2: "home", 3: "sleep", 4: "occupied", 5: "vacant", 6: "eco" };
    var plan_config_type_values = getValues(plan_config_type_map);
    if (plan_config_type_values.indexOf(type) === -1) {
        throw new Error("plan_config.type must be one of " + plan_config_type_values.join(", "));
    }
    var plan_config_temperature_control_mode_map = { 0: "heat", 1: "em heat", 2: "cool", 3: "auto" };
    var plan_config_temperature_control_mode_values = getValues(plan_config_temperature_control_mode_map);
    if (plan_config_temperature_control_mode_values.indexOf(temperature_control_mode) === -1) {
        throw new Error("plan_config.temperature_control_mode must be one of " + plan_config_temperature_control_mode_values.join(", "));
    }
    var plan_config_fan_mode_map = { 0: "auto", 1: "on", 2: "circulate" };
    var plan_config_fan_mode_values = getValues(plan_config_fan_mode_map);
    if (plan_config_fan_mode_values.indexOf(fan_mode) === -1) {
        throw new Error("plan_config.fan_mode must be one of " + plan_config_fan_mode_values.join(", "));
    }
    if (typeof target_temperature !== "number") {
        throw new Error("plan_config.target_temperature must be a number");
    }
    if (typeof temperature_tolerance !== "number") {
        throw new Error("plan_config.temperature_tolerance must be a number");
    }
    var temperature_unit_map = { 0: "celsius", 1: "fahrenheit" };
    var temperature_unit_values = getValues(temperature_unit_map);
    if (temperature_unit_values.indexOf(temperature_unit) === -1) {
        throw new Error("plan_config.temperature_unit must be one of " + temperature_unit_values.join(", "));
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xc8);
    buffer.writeUInt8(getValue(plan_config_type_map, type));
    buffer.writeUInt8(getValue(plan_config_temperature_control_mode_map, temperature_control_mode));
    buffer.writeUInt8(getValue(plan_config_fan_mode_map, fan_mode));
    var tmp = getValue(temperature_unit_map, temperature_unit) === 1 ? target_temperature | 0x80 : target_temperature & 0x7f;
    buffer.writeInt8(tmp);
    buffer.writeInt8(temperature_tolerance * 10);
    return buffer.toBytes();
}

/**
 * set card config
 * @param {number} enable values: (0: disable, 1: enable)
 * @param {string} action_type values: (0: power, 1: plan)
 * @param {string} in_plan_type values: (0: wake, 1: away, 2: home, 3: sleep)
 * @param {string} out_plan_type values: (0: wake, 1: away, 2: home, 3: sleep)
 * @param {number} invert values: (0: no, 1: yes)
 * @example { "card_config": { "enable": 0 } }
 * @example { "card_config": { "enable": 1, "action_type": 0, "invert": 1 } }
 * @example { "card_config": { "enable": 1, "action_type": 1, "in_plan_type": 0, "out_plan_type": 1, "invert": 0 } }
 */
function setCardConfig(enable, action_type, in_plan_type, out_plan_type, invert) {
    var card_config_enable_map = { 0: "disable", 1: "enable" };
    var card_config_enable_values = getValues(card_config_enable_map);
    if (card_config_enable_values.indexOf(enable) === -1) {
        throw new Error("card_config.enable must be one of " + card_config_enable_values.join(", "));
    }
    var card_config_action_type_map = { 0: "power", 1: "plan" };
    var card_config_action_type_values = getValues(card_config_action_type_map);
    if (enable && card_config_action_type_values.indexOf(action_type) === -1) {
        throw new Error("card_config.action_type must be one of " + card_config_action_type_values.join(", "));
    }

    var action = 0x00;
    if (action_type === 1) {
        var card_config_plan_type_map = { 0: "wake", 1: "away", 2: "home", 3: "sleep" };
        var card_config_plan_type_values = getValues(card_config_plan_type_map);
        if (card_config_plan_type_values.indexOf(in_plan_type) === -1) {
            throw new Error("card_config.in_plan_type must be one of " + card_config_plan_type_values.join(", "));
        } else {
            action |= card_config_plan_type_values.indexOf(in_plan_type) << 4;
        }
        if (card_config_plan_type_values.indexOf(out_plan_type) === -1) {
            throw new Error("card_config.out_plan_type must be one of " + card_config_plan_type_values.join(", "));
        } else {
            action |= card_config_plan_type_values.indexOf(out_plan_type);
        }
    }

    var card_config_invert_map = { 0: "no", 1: "yes" };
    var card_config_invert_values = getValues(card_config_invert_map);
    if (enable && card_config_invert_values.indexOf(invert) === -1) {
        throw new Error("card_config.invert must be one of " + card_config_invert_values.join(", "));
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xc1);
    buffer.writeUInt8(getValue(card_config_enable_map, enable));
    buffer.writeUInt8(getValue(cart_config_enable_map, enable) ? getValue(card_config_action_type_map, action_type) : 0);
    buffer.writeUInt8(action);
    buffer.writeUInt8(getValue(card_config_enable_map, enable) ? getValue(card_config_invert_map, invert) : 0);
    return buffer.toBytes();
}

/**
 * set wires relay config
 * @since v1.3
 * @param {number} y1: values: (0: on, 1: off)
 * @param {number} y2_gl: values: (0: on, 1: off)
 * @param {number} w1: values: (0: on, 1: off)
 * @param {number} w2_aux: values: (0: on, 1: off)
 * @param {number} e: values: (0: on, 1: off)
 * @param {number} g: values: (0: on, 1: off)
 * @param {number} ob: values: (0: on, 1: off)
 * @example { "wires_relay_config": { "y1": 1, "y2_gl": 0, "w1": 1, "w2_aux": 0, "e": 1, "g": 0 },"ob_mode": 1 }
 */
function setWiresRelayConfig(wires_relay_config) {
    var wire_relay_enable_map = { 0: "on", 1: "off" };
    var wire_relay_enable_values = getValues(wire_relay_enable_map);
    var wire_relay_bit_offset = { y1: 0, y2_gl: 1, w1: 2, w2_aux: 3, e: 4, g: 5, ob: 6 };

    var masked = 0x00;
    var status = 0x00;
    for (var wire in wires_relay_config) {
        if (wire_relay_enable_values.indexOf(wires_relay_config[wire]) === -1) {
            throw new Error("wires_relay_config." + wire + " must be one of " + wire_relay_enable_values.join(", "));
        }

        masked |= 1 << wire_relay_bit_offset[wire];
        status |= getValue(wire_relay_enable_map, wires_relay_config[wire]) << wire_relay_bit_offset[wire];
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xf7);
    buffer.writeUInt16LE(masked);
    buffer.writeUInt16LE(status);
    return buffer.toBytes();
}

/**
 * set wires relay change report
 * @param {number} relay_change_report_enable values: (0: disable, 1: enable)
 * @example { "relay_change_report_enable": 1 }
 */
function setWiresRelayChangeReport(relay_change_report_enable) {
    var relay_change_report_enable_values = [0, 1];
    if (relay_change_report_enable_values.indexOf(relay_change_report_enable) === -1) {
        throw new Error("wires_relay_change_report.relay_change_report_enable must be one of " + relay_change_report_enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x3a);
    buffer.writeUInt8(relay_change_report_enable);
    return buffer.toBytes();
}

/**
 * set aux relay config
 * @param {number} y2_enable values: (0: disable, 1: enable)
 * @param {number} y2_status values: (0: off, 1: on)
 * @param {number} w2_enable values: (0: disable, 1: enable)
 * @param {number} w2_status values: (0: off, 1: on)
 * @example { "aux_relay_config": { "y2_enable": 1, "y2_status": 0, "w2_enable": 1, "w2_status": 0 } }
 * @since v2.0
 */
function setAuxRelayConfig(y2_enable, y2_status, w2_enable, w2_status) {
    var enable_values = [0, 1];
    var status_values = [0, 1];
    if (enable_values.indexOf(y2_enable) === -1) {
        throw new Error("aux_relay_config.y2_enable must be one of " + enable_values.join(", "));
    }
    if (status_values.indexOf(y2_status) === -1) {
        throw new Error("aux_relay_config.y2_status must be one of " + status_values.join(", "));
    }
    if (enable_values.indexOf(w2_enable) === -1) {
        throw new Error("aux_relay_config.w2_enable must be one of " + enable_values.join(", "));
    }
    if (status_values.indexOf(w2_status) === -1) {
        throw new Error("aux_relay_config.w2_status must be one of " + status_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x3b);
    var relay_status = (w2_status << 1) | (y2_status << 0);
    var relay_enable = (w2_enable << 1) | (y2_enable << 0);
    var value = (relay_status << 4) | relay_enable;
    buffer.writeUInt8(value);
    return buffer.toBytes();
}

/**
 * set compressor and aux combine enable
 * @param {number} compressor_aux_combine_enable values: (0: disable, 1: enable)
 * @example { "compressor_aux_combine_enable": 1 }
 * @since v2.0
 */
function setCompressorAndAuxConfig(compressor_aux_combine_enable) {
    var enable_values = [0, 1];
    if (enable_values.indexOf(compressor_aux_combine_enable) === -1) {
        throw new Error("compressor_aux_combine_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x46);
    buffer.writeUInt8(compressor_aux_combine_enable);
    return buffer.toBytes();
}

/**
 * set system protect config
 * @param {number} enable values: (0: disable, 1: enable)
 * @param {number} duration unit: minute, range: [5, 55]
 * @example { "system_protect_config": { "enable": 1, "duration": 10 } }
 * @since v2.0
 */
function setSystemProtectConfig(enable, duration) {
    var enable_values = [0, 1];
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("system_protect_config.enable must be one of " + enable_values.join(", "));
    }
    if (typeof duration !== "number" || duration < 5 || duration > 55) {
        throw new Error("system_protect_config.duration must be a number, range: [5, 55]");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x47);
    buffer.writeUInt8(enable);
    buffer.writeUInt16LE(duration);
    return buffer.toBytes();
}

/**
 * set d2d enable
 * @param {number} d2d_master_enable values: (0: disable, 1: enable)
 * @param {number} d2d_slave_enable values: (0: disable, 1: enable)
 * @example { "d2d_master_enable": 1, "d2d_slave_enable": 0 }
 */
function setD2DEnable(d2d_master_enable, d2d_slave_enable) {
    var d2d_enable_map = { 0: "disable", 1: "enable" };
    var d2d_enable_values = getValues(d2d_enable_map);

    var mask = 0x00;
    var status = 0x00;
    if (d2d_master_enable !== undefined) {
        if (d2d_enable_values.indexOf(d2d_master_enable) === -1) {
            throw new Error("d2d_master_enable must be one of " + d2d_enable_values.join(", "));
        }
        mask |= 1 << 0;
        status |= getValue(d2d_enable_map, d2d_master_enable) << 0;
    }
    if (d2d_slave_enable !== undefined) {
        if (d2d_enable_values.indexOf(d2d_slave_enable) === -1) {
            throw new Error("d2d_slave_enable must be one of " + d2d_enable_values.join(", "));
        }
        mask |= 1 << 1;
        status |= getValue(d2d_enable_map, d2d_slave_enable) << 1;
    }
    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xc7);
    buffer.writeUInt8((mask << 4) | status);
    return buffer.toBytes();
}

/**
 * set d2d master id
 * @param {number} id values: (1, 2, 3, 4, 5)
 * @param {string} dev_eui
 * @example { "d2d_master_id": { "id": 1, "dev_eui": "0000000000000000" } }
 * @since v2.0
 */
function setD2DMasterId(id, dev_eui) {
    var id_values = [1, 2, 3, 4, 5];
    if (id_values.indexOf(id) === -1) {
        throw new Error("d2d_master_id.id must be one of " + id_values.join(", "));
    }

    var buffer = new Buffer(11);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x3e);
    buffer.writeUInt8(id);
    buffer.writeHexString(dev_eui);
    return buffer.toBytes();
}

/**
 * set child lock
 * @param {Array} btn_locked values: (0: power, 1: up, 2: down, 3: fan, 4: mode, 5: reset)
 * @example { "child_lock_config": { "power_button": 1, "up_button": 0, "down_button": 1, "fan_button": 0, "mode_button": 0 , "reset_button": 1 } }
 */
function setChildLock(child_lock_config) {
    var button_mask_bit_offset = { power_button: 0, up_button: 1, down_button: 2, fan_button: 3, mode_button: 4, reset_button: 5 };
    var button_enable_map = { 0: "disable", 1: "enable" };
    var button_enable_values = getValues(button_enable_map);

    var masked = 0x00;
    var status = 0x00;
    for (var button in child_lock_config) {
        if (button_enable_values.indexOf(child_lock_config[button]) === -1) {
            throw new Error("child_lock_config." + button + " must be one of " + button_enable_values.join(", "));
        }

        masked |= 1 << button_mask_bit_offset[button];
        status |= getValue(button_enable_map, child_lock_config[button]) << button_mask_bit_offset[button];
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x25);
    buffer.writeUInt8(masked);
    buffer.writeUInt8(status);
    return buffer.toBytes();
}

/**
 * set wires
 * @param {Array} wires values: ("Y1", "GH", "OB", "W1", "E", "DI", "PEK", "W2", "AUX", "Y2", "GL")
 * @param {string} mode values: (0: on cool, 1: on heat)
 * @example { "wires": ["Y1", "GH", "OB", "W1", "E", "DI", "PEK", "W2", "AUX", "Y2", "GL"], "ob_mode": 0 }
 */
function setWires(wires, mode) {
    if (Array.isArray(wires) === false) {
        throw new Error("wires must be an array");
    }

    var b1 = 0x00;
    var b2 = 0x00;
    var b3 = 0x00;
    if (wires.indexOf("Y1") != -1) b1 |= 1 << 0;
    if (wires.indexOf("GH") != -1) b1 |= 1 << 2;
    if (wires.indexOf("OB") != -1) b1 |= 1 << 4;
    if (wires.indexOf("W1") != -1) b1 |= 1 << 6;

    if (wires.indexOf("E") != -1) b2 |= 1 << 0;
    if (wires.indexOf("DI") != -1) b2 |= 1 << 2;
    if (wires.indexOf("PEK") != -1) b2 |= 1 << 4;
    if (wires.indexOf("W2") != -1) b2 |= 1 << 6;
    if (wires.indexOf("AUX") != -1) b2 |= 2 << 6;

    if (wires.indexOf("Y2") != -1) b3 |= 1 << 0;
    if (wires.indexOf("GL") != -1) b3 |= 2 << 0;
    b3 |= mode << 2;

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xca);
    buffer.writeUInt8(b1);
    buffer.writeUInt8(b2);
    buffer.writeUInt8(b3);
    return buffer.toBytes();
}

/**
 * set ob directive mode
 * @param {string} ob_mode values: (0: on cool, 1: on heat)
 * @example { "ob_mode": 0 }
 */
function setOBMode(ob_mode) {
    var ob_mode_map = { 0: "on cool", 1: "on heat" };
    var ob_mode_values = getValues(ob_mode_map);
    if (ob_mode_values.indexOf(ob_mode) === -1) {
        throw new Error("ob_mode must be one of " + ob_mode_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xb5);
    buffer.writeUInt8(getValue(ob_mode_map, ob_mode));
    return buffer.toBytes();
}

/**
 * multicast group configuration
 * @param {object} multicast_group_config
 * @example { "multicast_group_config": { "group1_enable": 1, "group2_enable": 0, "group3_enable": 1, "group4_enable": 0 } }
 */
function setMulticastGroupConfig(multicast_group_config) {
    var mask_id = 0;
    var mask_enable = 0;

    var group_enable_map = { 0: "disable", 1: "enable" };
    var group_enable_values = getValues(group_enable_map);
    if ("group1_enable" in multicast_group_config) {
        if (group_enable_values.indexOf(multicast_group_config.group1_enable) === -1) {
            throw new Error("multicast_group_config.group1_enable must be one of " + group_enable_values.join(", "));
        }
        mask_id |= 1 << 0;
        mask_enable |= getValue(group_enable_map, multicast_group_config.group1_enable) << 0;
    }
    if ("group2_enable" in multicast_group_config) {
        if (group_enable_values.indexOf(multicast_group_config.group2_enable) === -1) {
            throw new Error("multicast_group_config.group2_enable must be one of " + group_enable_values.join(", "));
        }
        mask_id |= 1 << 1;
        mask_enable |= getValue(group_enable_map, multicast_group_config.group2_enable) << 1;
    }
    if ("group3_enable" in multicast_group_config) {
        if (group_enable_values.indexOf(multicast_group_config.group3_enable) === -1) {
            throw new Error("multicast_group_config.group3_enable must be one of " + group_enable_values.join(", "));
        }
        mask_id |= 1 << 2;
        mask_enable |= getValue(group_enable_map, multicast_group_config.group3_enable) << 2;
    }
    if ("group4_enable" in multicast_group_config) {
        if (group_enable_values.indexOf(multicast_group_config.group4_enable) === -1) {
            throw new Error("multicast_group_config.group4_enable must be one of " + group_enable_values.join(", "));
        }
        mask_id |= 1 << 3;
        mask_enable |= getValue(group_enable_map, multicast_group_config.group4_enable) << 3;
    }

    var data = (mask_id << 4) | mask_enable;
    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x82);
    buffer.writeUInt8(data);
    return buffer.toBytes();
}

/**
 * d2d master configuration
 * @param {number} mode values: (0: wake, 1: away, 2: home, 3: sleep)
 * @param {number} enable values: (0: disable, 1: enable)
 * @param {string} d2d_cmd
 * @param {number} uplink_enable values: (0: disable, 1: enable)
 * @param {number} time_enable values: (0: disable, 1: enable)
 * @param {number} time unit: minute
 * @example { "d2d_master_config": [{ "mode": 0, "enable": 1, "d2d_cmd": "0000", "uplink_enable": 1, "time_enable": 1, "time": 10 }] }
 */
function setD2DMasterConfig(mode, enable, d2d_cmd, uplink_enable, time_enable, time) {
    var mode_map = { 0: "wake", 1: "away", 2: "home", 3: "sleep" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(mode) === -1) {
        throw new Error("d2d_master_config.mode must be one of " + mode_values.join(", "));
    }
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
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
    buffer.writeUInt8(getValue(mode_map, mode));
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(getValue(enable_map, uplink_enable));
    buffer.writeD2DCommand(d2d_cmd, "0000");
    buffer.writeUInt16LE(time);
    buffer.writeUInt8(getValue(enable_map, time_enable));
    return buffer.toBytes();
}

/**
 * d2d slave configuration
 * @param {number} id
 * @param {number} enable values: (0: disable, 1: enable)
 * @param {string} d2d_cmd
 * @param {number} action_type values: (0: power, 1: plan)
 * @param {number} action values: action_type=0 (0: off, 1: on), action_type=1 (0: wake, 1: away, 2: home, 3: sleep)
 * @example { "d2d_slave_config": [{ "id": 1, "enable": 1, "d2d_cmd": "0000", "action_type": 0, "action": 1 }] }
 */
function setD2DSlaveConfig(id, enable, d2d_cmd, action_type, action) {
    if (typeof id !== "number") {
        throw new Error("d2d_slave_config.id must be a number");
    }
    if (id < 1 || id > 16) {
        throw new Error("d2d_slave_config.id must be in range [1, 16]");
    }
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("d2d_slave_config.enable must be one of " + enable_values.join(", "));
    }
    var action_type_map = { 0: "power", 1: "plan" };
    var action_type_values = getValues(action_type_map);
    if (action_type_values.indexOf(action_type) === -1) {
        throw new Error("d2d_slave_config.action_type must be one of " + action_type_values.join(", "));
    }

    // system status mode
    if (action_type === 0) {
        var action_map = { 0: "off", 1: "on" };
        var action_values = getValues(action_map);
        if (action_values.indexOf(action) === -1) {
            throw new Error("d2d_slave_config.action must be one of " + action_values.join(", "));
        }
    }
    if (action_type === 1) {
        var action_map = { 0: "wake", 1: "away", 2: "home", 3: "sleep", 4: "occupied", 5: "vacant", 6: "eco" };
        var action_values = getValues(action_map);
        if (action_values.indexOf(action) === -1) {
            throw new Error("d2d_slave_config.action must be one of " + action_values.join(", "));
        }
    }

    var data = (getValue(action_type_map, action_type) << 4) | action;

    var buffer = new Buffer(7);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x83);
    buffer.writeUInt8(id - 1);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeD2DCommand(d2d_cmd, "0000");
    buffer.writeUInt8(data);
    return buffer.toBytes();
}

/**
 * set d2d slave group
 * @since v1.3
 * @param {number} control_permissions values: (0: thermostat, 1: remote control)
 * @example { "control_permissions": 0 }
 */
function setControlPermissions(control_permissions) {
    var control_permission_map = { 0: "thermostat", 1: "remote control" };
    var control_permission_values = getValues(control_permission_map);
    if (control_permission_values.indexOf(control_permissions) === -1) {
        throw new Error("control_permissions must be one of " + control_permission_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xf6);
    buffer.writeUInt8(getValue(control_permission_map, control_permissions));
    return buffer.toBytes();
}

/**
 * set offline control mode
 * @since v1.3
 * @param {number} offline_control_mode values: (0: keep, 1: thermostat, 2: off)
 * @example { "offline_control_mode": 0 }
 */
function setOfflineControlMode(offline_control_mode) {
    var offline_control_mode_map = { 0: "keep", 1: "thermostat", 2: "off" };
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
 * set temperature threshold alarm configuration
 * @param {number} alarm_type values: (0: temperature_threshold, 1: continuous_low_temperature, 2: continuous_high_temperature)
 * @param {number} condition values: (0: disable, 1: below, 2: above, 3: between, 4: outside)
 * @param {number} min condition=(below, within, outside)
 * @param {number} max condition=(above, within, outside)
 * @param {number} continue_time unit: minute
 * @example { "temperature_alarm_config": { "alarm_type": 0, "condition": 1, "min": 10, "max": 20, "continue_time": 10 } }
 */
function setTemperatureAlarmConfig(alarm_type, condition, min, max, lock_time, continue_time) {
    var condition_map = { 0: "disable", 1: "below", 2: "above", 3: "between", 4: "outside" };
    var condition_values = getValues(condition_map);
    if (condition_values.indexOf(condition) === -1) {
        throw new Error("temperature_alarm_config.condition must be one of " + condition_values.join(", "));
    }
    var alarm_type_map = { 0: "temperature_threshold", 1: "continuous_low_temperature", 2: "continuous_high_temperature" };
    var alarm_type_values = getValues(alarm_type_map);
    if (alarm_type_values.indexOf(alarm_type) === -1) {
        throw new Error("temperature_alarm_config.alarm_type must be one of " + alarm_type_values.join(", "));
    }

    var data = getValue(condition_map, condition) | (getValue(alarm_type_map, alarm_type) << 3);

    var buffer = new Buffer(6);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x06);
    buffer.writeUInt8(data);
    buffer.writeInt16LE(min * 10);
    buffer.writeInt16LE(max * 10);
    buffer.writeUInt16LE(lock_time);
    buffer.writeUInt16LE(continue_time);
    return buffer.toBytes();
}

/**
 * set screen display mode
 * @since v1.3
 * @param {number} screen_display_mode, values: (0: on, 1: without plan show, 2: disable all)
 * @example { "screen_display_mode": 0 }
 */
function setScreenDisplayMode(screen_display_mode) {
    var screen_display_mode_map = { 0: "on", 1: "without plan show", 2: "disable all" };
    var screen_display_mode_values = getValues(screen_display_mode_map);
    if (screen_display_mode_values.indexOf(screen_display_mode) === -1) {
        throw new Error("screen_display_mode must be one of " + screen_display_mode_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x08);
    buffer.writeUInt8(getValue(screen_display_mode_map, screen_display_mode));
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
