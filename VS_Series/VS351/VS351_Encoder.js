/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product VS351
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
    if ("query_device_status" in payload) {
        encoded = encoded.concat(queryDeviceStatus(payload.query_device_status));
    }
    if ("report_interval" in payload) {
        encoded = encoded.concat(setReportInterval(payload.report_interval));
    }
    if ("installation_height" in payload) {
        encoded = encoded.concat(setInstallationHeight(payload.installation_height));
    }
    if ("cumulative_reset_enable" in payload) {
        encoded = encoded.concat(setCumulativeResetEnable(payload.cumulative_reset_enable));
    }
    if ("cumulative_reset_schedule_config" in payload) {
        encoded = encoded.concat(setCumulativeResetScheduleConfig(payload.cumulative_reset_schedule_config));
    }
    if ("reset_cumulative_in" in payload) {
        encoded = encoded.concat(resetCumulativeIn(payload.reset_cumulative_in));
    }
    if ("reset_cumulative_out" in payload) {
        encoded = encoded.concat(resetCumulativeOut(payload.reset_cumulative_out));
    }
    if ("cumulative_report_enable" in payload) {
        encoded = encoded.concat(setCumulativeReportEnable(payload.cumulative_report_enable));
    }
    if ("temperature_report_enable" in payload) {
        encoded = encoded.concat(setTemperatureReportEnable(payload.temperature_report_enable));
    }
    if ("temperature_calibration_settings" in payload) {
        encoded = encoded.concat(setTemperatureCalibrationSetting(payload.temperature_calibration_settings));
    }
    if ("detection_direction" in payload) {
        encoded = encoded.concat(setDetectionDirection(payload.detection_direction));
    }
    if ("hibernate_config" in payload) {
        encoded = encoded.concat(setHibernateConfig(payload.hibernate_config));
    }
    if ("people_period_alarm_settings" in payload) {
        encoded = encoded.concat(setPeoplePeriodAlarmSettings(payload.people_period_alarm_settings));
    }
    if ("people_cumulative_alarm_settings" in payload) {
        encoded = encoded.concat(setPeopleCumulativeAlarmSettings(payload.people_cumulative_alarm_settings));
    }
    if ("temperature_alarm_settings" in payload) {
        encoded = encoded.concat(setTemperatureAlarmSettings(payload.temperature_alarm_settings));
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
    if ("d2d_key" in payload) {
        encoded = encoded.concat(setD2DKey(payload.d2d_key));
    }
    if ("d2d_enable" in payload) {
        encoded = encoded.concat(setD2DEnable(payload.d2d_enable));
    }
    if ("d2d_master_config" in payload) {
        for (var i = 0; i < payload.d2d_master_config.length; i++) {
            encoded = encoded.concat(setD2DMasterConfig(payload.d2d_master_config[i]));
        }
    }
    if ("history_enable" in payload) {
        encoded = encoded.concat(setHistoryEnable(payload.history_enable));
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

    return encoded;
}

/**
 * reboot
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
 * query device status
 * @param {number} query_device_status values: (0: no, 1: yes)
 * @example { "query_device_status": 1 }
 */
function queryDeviceStatus(query_device_status) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(query_device_status) === -1) {
        throw new Error("query_device_status must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, query_device_status) === 0) {
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
 * set install height
 * @param {number} installation_height unit: mm, range: [2000, 3500]
 * @example { "installation_height": 2700 }
 */
function setInstallationHeight(installation_height) {
    if (installation_height < 2000 || installation_height > 3500) {
        throw new Error("installation_height must be between 2000 and 3500");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x77);
    buffer.writeUInt16LE(installation_height);
    return buffer.toBytes();
}

/**
 * set reset cumulative enable
 * @param {number} cumulative_reset_enable values: (0: disable, 1: enable)
 * @example { "cumulative_reset_enable": 1 }
 */
function setCumulativeResetEnable(cumulative_reset_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(cumulative_reset_enable) === -1) {
        throw new Error("cumulative_reset_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xa6);
    buffer.writeUInt8(getValue(enable_map, cumulative_reset_enable));
    return buffer.toBytes();
}

/**
 * set cumulative reset config
 * @param {object} reset_cumulative_schedule_config
 * @param {number} reset_cumulative_schedule_config.weekday values: (0: everyday, 1: sunday, 2: monday, 3: tuesday, 4: wednesday, 5: thursday, 6: friday, 7: saturday)
 * @param {number} reset_cumulative_schedule_config.hour values: (0-23)
 * @param {number} reset_cumulative_schedule_config.minute values: (0-59)
 * @example { "reset_cumulative_schedule_config": { "weekday": 0, "hour": 0, "minute": 0 } }
 */
function setCumulativeResetScheduleConfig(reset_cumulative_schedule_config) {
    var weekday = reset_cumulative_schedule_config.weekday;
    var hour = reset_cumulative_schedule_config.hour;
    var minute = reset_cumulative_schedule_config.minute;

    var weekday_map = { 0: "everyday", 1: "sunday", 2: "monday", 3: "tuesday", 4: "wednesday", 5: "thursday", 6: "friday", 7: "saturday" };
    var weekday_values = getValues(weekday_map);
    if (weekday_values.indexOf(weekday) === -1) {
        throw new Error("reset_cumulative_schedule_config.weekday must be one of " + weekday_values.join(", "));
    }
    if (typeof hour !== "number" || hour < 0 || hour > 23) {
        throw new Error("reset_cumulative_schedule_config.hour must be a number in range [0, 23]");
    }
    if (typeof minute !== "number" || minute < 0 || minute > 59) {
        throw new Error("reset_cumulative_schedule_config.minute must be a number in range [0, 59]");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xed);
    buffer.writeUInt8(getValue(weekday_map, weekday));
    buffer.writeUInt8(hour);
    buffer.writeUInt8(minute);
    return buffer.toBytes();
}

/**
 * set reset cumulative in
 * @param {number} reset_cumulative_in values: (0: no, 1: yes)
 * @example { "reset_cumulative_in": 1 }
 */
function resetCumulativeIn(reset_cumulative_in) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(reset_cumulative_in) === -1) {
        throw new Error("reset_cumulative_in must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, reset_cumulative_in) === 0) {
        return [];
    }
    return [0xff, 0xa8, 0x01];
}

/**
 * set reset cumulative out
 * @param {number} reset_cumulative_out values: (0: no, 1: yes)
 * @example { "reset_cumulative_out": 1 }
 */
function resetCumulativeOut(reset_cumulative_out) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(reset_cumulative_out) === -1) {
        throw new Error("reset_cumulative_out must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, reset_cumulative_out) === 0) {
        return [];
    }
    return [0xff, 0xa8, 0x02];
}

/**
 * set cumulative report enable
 * @param {number} cumulative_report_enable values: (0: disable, 1: enable)
 * @example { "cumulative_report_enable": 1 }
 */
function setCumulativeReportEnable(cumulative_report_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(cumulative_report_enable) === -1) {
        throw new Error("cumulative_report_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xa9);
    buffer.writeUInt8(getValue(enable_map, cumulative_report_enable));
    return buffer.toBytes();
}

/**
 * set temperature report enable
 * @param {number} temperature_report_enable values: (0: disable, 1: enable)
 * @example { "temperature_report_enable": 1 }
 */
function setTemperatureReportEnable(temperature_report_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(temperature_report_enable) === -1) {
        throw new Error("temperature_report_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xaa);
    buffer.writeUInt8(getValue(enable_map, temperature_report_enable));
    return buffer.toBytes();
}

/**
 * set temperature calibration setting
 * @param {object} temperature_calibration_settings 
 * @param {number} temperature_calibration_settings.enable values: (0: disable, 1: enable)
 * @param {number} temperature_calibration_settings.calibration_value unit: ℃, range: [-100, 100]
 * @example { "temperature_calibration_settings": { "enable": 1, "calibration_value": 0 } }
 */
function setTemperatureCalibrationSetting(temperature_calibration_settings) {
    var enable = temperature_calibration_settings.enable;
    var calibration_value = temperature_calibration_settings.calibration_value;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("temperature_calibration_settings.enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xab);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeInt16LE(calibration_value * 10);
    return buffer.toBytes();
}

/**
 * set detection direction
 * @param {number} detection_direction values: (0: forward, 1: reverse)
 * @example { "detection_direction": 1 }
 */
function setDetectionDirection(detection_direction) {
    var direction_map = { 0: "forward", 1: "reverse" };
    var direction_values = getValues(direction_map);
    if (direction_values.indexOf(detection_direction) === -1) {
        throw new Error("detection_direction must be one of " + direction_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xec);
    buffer.writeUInt8(getValue(direction_map, detection_direction));
    return buffer.toBytes();
}

/**
 * set hibernate config
 * @param {object} hibernate_config
 * @param {number} hibernate_config.enable values: (0: "enable", 1: "disable")
 * @param {number} hibernate_config.start_time unit: minute. range: [0, 1439] (4:00 -> 240, 4:30 -> 270)
 * @param {number} hibernate_config.end_time unit: minute. range: [0, 1439] (start_time < end_time: one day, start_time > end_time: across the day, start_time == end_time: whole day)
 * @example { "hibernate_config": { "enable": 1, "start_time": 240, "end_time": 270 } }
 */
function setHibernateConfig(hibernate_config) {
    var enable = hibernate_config.enable;
    var start_time = hibernate_config.start_time;
    var end_time = hibernate_config.end_time;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("hibernate_config.enable must be one of " + enable_values.join(", "));
    }
    if (start_time < 0 || start_time > 1439) {
        throw new Error("hibernate_config.start_time must be between 0 and 1439");
    }
    if (end_time < 0 || end_time > 1439) {
        throw new Error("hibernate_config.end_time must be between 0 and 1439");
    }

    var buffer = new Buffer(8);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x75);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt16LE(start_time);
    buffer.writeUInt16LE(end_time);
    buffer.writeUInt8(0xff);
    return buffer.toBytes();
}

/**
 * set people period alarm settings
 * @param {object} people_period_alarm_settings 
 * @param {number} people_period_alarm_settings.threshold_condition values: (0: disable, 1: below, 2: above, 3: between, 4: outside)
 * @param {number} people_period_alarm_settings.threshold_out range: [1, 65535]
 * @param {number} people_period_alarm_settings.threshold_in range: [1, 65535]
 * @example { "people_period_alarm_settings": { "threshold_condition": 3, "threshold_out": 20, "threshold_in": 25 } }
 */
function setPeoplePeriodAlarmSettings(people_period_alarm_settings) {
    var threshold_condition = people_period_alarm_settings.threshold_condition;
    var threshold_out = people_period_alarm_settings.threshold_out;
    var threshold_in = people_period_alarm_settings.threshold_in;

    var condition_map = { 0: "disable", 1: "below", 2: "above", 3: "between", 4: "outside" };
    var condition_values = getValues(condition_map);
    if (condition_values.indexOf(threshold_condition) === -1) {
        throw new Error("people_period_alarm_settings.threshold_condition must be one of " + condition_values.join(", "));
    }

    var data = 0x00;
    data |= getValue(condition_map, threshold_condition) << 0;
    data |= 1 << 3; // 1: period
    data |= 1 << 6; // enable

    var buffer = new Buffer(11);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x06);
    buffer.writeUInt8(data);
    buffer.writeUInt16LE(threshold_out);
    buffer.writeUInt16LE(threshold_in);
    buffer.writeUInt16LE(0x00);
    buffer.writeUInt16LE(0x00);
    return buffer.toBytes();
}

/**
 * set people cumulative alarm settings
 * @param {object} people_cumulative_alarm_settings 
 * @param {number} people_cumulative_alarm_settings.threshold_condition values: (0: disable, 1: below, 2: above, 3: between, 4: outside)
 * @param {number} people_cumulative_alarm_settings.threshold_out range: [1, 65535]
 * @param {number} people_cumulative_alarm_settings.threshold_in range: [1, 65535]
 * @example { "people_cumulative_alarm_settings": { "threshold_condition": 3, "threshold_out": 20, "threshold_in": 25 } }
 */
function setPeopleCumulativeAlarmSettings(people_cumulative_alarm_settings) {
    var threshold_condition = people_cumulative_alarm_settings.threshold_condition;
    var threshold_out = people_cumulative_alarm_settings.threshold_out;
    var threshold_in = people_cumulative_alarm_settings.threshold_in;

    var condition_map = { 0: "disable", 1: "below", 2: "above", 3: "between", 4: "outside" };
    var condition_values = getValues(condition_map);
    if (condition_values.indexOf(threshold_condition) === -1) {
        throw new Error("people_cumulative_alarm_settings.threshold_condition must be one of " + condition_values.join(", "));
    }

    var data = 0x00;
    data |= getValue(condition_map, threshold_condition) << 0;
    data |= 2 << 3; // 2: cumulative
    data |= 1 << 6; // enable

    var buffer = new Buffer(11);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x06);
    buffer.writeUInt8(data);
    buffer.writeUInt16LE(threshold_out);
    buffer.writeUInt16LE(threshold_in);
    buffer.writeUInt16LE(0x00);
    buffer.writeUInt16LE(0x00);
    return buffer.toBytes();
}

/**
 * set temperature alarm settings
 * @param {object} temperature_alarm_settings 
 * @param {number} temperature_alarm_settings.threshold_condition values: (0: disable, 1: below, 2: above, 3: between, 4: outside)
 * @param {number} temperature_alarm_settings.threshold_min unit: ℃
 * @param {number} temperature_alarm_settings.threshold_max unit: ℃
 * @example { "temperature_alarm_settings": { "threshold_condition": 3, "threshold_min": 20, "threshold_max": 25 } }
 */
function setTemperatureAlarmSettings(temperature_alarm_settings) {
    var threshold_condition = temperature_alarm_settings.threshold_condition;
    var threshold_min = temperature_alarm_settings.threshold_min;
    var threshold_max = temperature_alarm_settings.threshold_max;

    var condition_map = { 0: "disable", 1: "below", 2: "above", 3: "between", 4: "outside" };
    var condition_values = getValues(condition_map);
    if (condition_values.indexOf(threshold_condition) === -1) {
        throw new Error("temperature_alarm_settings.threshold_condition must be one of " + condition_values.join(", "));
    }

    var data = 0x00;
    data |= getValue(condition_map, threshold_condition) << 0;
    data |= 3 << 3; // 3: temperature
    data |= 1 << 6; // enable

    var buffer = new Buffer(11);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x06);
    buffer.writeUInt8(data);
    buffer.writeUInt16LE(threshold_min * 10);
    buffer.writeUInt16LE(threshold_max * 10);
    buffer.writeUInt16LE(0x00);
    buffer.writeUInt16LE(0x00);
    return buffer.toBytes();
}


/**
 * set retransmit enable
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
 * set retransmit interval
 * @param {number} retransmit_interval unit: second, range: [1, 64800]
 * @example { "retransmit_interval": 600 }
 */
function setRetransmitInterval(retransmit_interval) {
    if (typeof retransmit_interval !== "number") {
        throw new Error("retransmit_interval must be a number");
    }
    if (retransmit_interval < 1 || retransmit_interval > 64800) {
        throw new Error("retransmit_interval must be between 1 and 64800");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x6a);
    buffer.writeUInt8(0x00);
    buffer.writeUInt16LE(retransmit_interval);
    return buffer.toBytes();
}

/**
 * set resend interval
 * @param {number} resend_interval unit: second, range: [1, 64800]
 * @example { "resend_interval": 600 }
 */
function setResendInterval(resend_interval) {
    if (typeof resend_interval !== "number") {
        throw new Error("resend_interval must be a number");
    }
    if (resend_interval < 1 || resend_interval > 64800) {
        throw new Error("resend_interval must be between 1 and 64800");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x6a);
    buffer.writeUInt8(0x01);
    buffer.writeUInt16LE(resend_interval);
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
    if (!/^[0-9a-fA-F]+$/.test(d2d_key)) {
        throw new Error("d2d_key must be hex string [0-9a-fA-F]");
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
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x84);
    buffer.writeUInt8(getValue(enable_map, d2d_enable));
    return buffer.toBytes();
}

/**
 * d2d master configuration
 * @param {object} d2d_master_config
 * @param {number} d2d_master_config.mode values: (1: someone enter, 2: someone leave, 3: counting threshold alarm, 4: temperature alarm, 5: temperature alarm release)
 * @param {number} d2d_master_config.enable values: (0: disable, 1: enable)
 * @param {string} d2d_master_config.d2d_cmd
 * @param {number} d2d_master_config.lora_uplink_enable values: (0: disable, 1: enable)
 * @param {number} d2d_master_config.time_enable values: (0: disable, 1: enable)
 * @param {number} d2d_master_config.time unit: minute
 * @example { "d2d_master_config": [{ "mode": 0, "enable": 1, "d2d_cmd": "0000", "lora_uplink_enable": 1, "time_enable": 1, "time": 10 }] }
 */
function setD2DMasterConfig(d2d_master_config) {
    var mode = d2d_master_config.mode;
    var enable = d2d_master_config.enable;
    var d2d_cmd = d2d_master_config.d2d_cmd;
    var lora_uplink_enable = d2d_master_config.lora_uplink_enable;
    var time_enable = d2d_master_config.time_enable;
    var time = d2d_master_config.time;

    var mode_map = { 1: "someone enter", 2: "someone leave", 3: "counting threshold alarm", 4: "temperature alarm", 5: "temperature alarm release" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(mode) === -1) {
        throw new Error("d2d_master_config._item.mode must be one of " + mode_values.join(", "));
    }
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("d2d_master_config._item.enable must be one of " + enable_values.join(", "));
    }
    if ("enable" in d2d_master_config && enable_values.indexOf(lora_uplink_enable) === -1) {
        throw new Error("d2d_master_config._item.uplink_enable must be one of " + enable_values.join(", "));
    }
    if ("enable" in d2d_master_config && enable_values.indexOf(time_enable) === -1) {
        throw new Error("d2d_master_config._item.time_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(10);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x96);
    buffer.writeUInt8(getValue(mode_map, mode));
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(getValue(enable_map, lora_uplink_enable));
    buffer.writeD2DCommand(d2d_cmd, "0000");
    buffer.writeUInt16LE(time);
    buffer.writeUInt8(getValue(enable_map, time_enable));
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
 * fetch history
 * @param {object} fetch_history
 * @param {number} fetch_history.start_time unit: second
 * @param {number} fetch_history.end_time unit: second
 * @example { "fetch_history": { "start_time": 1609459200, "end_time": 1609545600 } }
 */
function fetchHistory(fetch_history) {
    var start_time = fetch_history.start_time;
    var end_time = fetch_history.end_time;

    if (typeof start_time !== "number") {
        throw new Error("start_time must be a number");
    }
    if ("end_time" in fetch_history && typeof end_time !== "number") {
        throw new Error("end_time must be a number");
    }
    if ("end_time" in fetch_history && start_time > end_time) {
        throw new Error("start_time must be less than end_time");
    }

    var buffer;
    if ("end_time" in fetch_history || end_time === 0) {
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