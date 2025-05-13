/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product GS601
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

    if ("time_zone" in payload) {
        encoded = encoded.concat(setTimeZone(payload.time_zone));
    }
    if ("daylight_saving_time" in payload) {
        encoded = encoded.concat(setDaylightSavingTimeSettings(payload.daylight_saving_time));
    }
    if ("history_transmit_settings" in payload) {
        encoded = encoded.concat(setHistoryConfig(payload.history_transmit_settings));
    }
    if ("auto_provisioning_enable" in payload) {
        encoded = encoded.concat(setAutoProvisioningEnable(payload.auto_provisioning_enable));
    }
    if ("collection_interval" in payload) {
        encoded = encoded.concat(setCollectionInterval(payload.collection_interval));
    }
    if ("collection_counts" in payload) {
        encoded = encoded.concat(setCollectionCounts(payload.collection_counts));
    }
    if ("reporting_interval" in payload) {
        encoded = encoded.concat(setReportingInterval(payload.reporting_interval));
    }
    if ("alarm_counts" in payload) {
        encoded = encoded.concat(setAlarmCounts(payload.alarm_counts));
    }
    if ("light_collection_settings" in payload) {
        encoded = encoded.concat(setLightCollectionSettings(payload.light_collection_settings));
    }
    if ("temperature_unit" in payload) {
        encoded = encoded.concat(setTemperatureUnit(payload.temperature_unit));
    }
    if ("clear_alarm_item" in payload) {
        encoded = encoded.concat(clearAlarmItem(payload.clear_alarm_item));
    }
    if ("airplane_enable" in payload) {
        encoded = encoded.concat(setAirplaneEnable(payload.airplane_enable));
    }
    if ("location_function_enable" in payload) {
        encoded = encoded.concat(setLocationFunctionEnable(payload.location_function_enable));
    }
    if ("location_auth_token" in payload) {
        encoded = encoded.concat(setLocationToken(payload.location_auth_token));
    }
    if ("airplane_enable_time_settings" in payload) {
        encoded = encoded.concat(setAirplaneEnableTimeSettings(payload.airplane_enable_time_settings));
    }
    if ("display_mode" in payload) {
        encoded = encoded.concat(setDisplayMode(payload.display_mode));
    }
    if ("alarm_release_enable" in payload) {
        encoded = encoded.concat(setAlarmReleaseEnable(payload.alarm_release_enable));
    }
    if ("child_lock_settings" in payload) {
        encoded = encoded.concat(setChildLockSettings(payload.child_lock_settings));
    }
    if ("temperature_alarm_settings" in payload) {
        encoded = encoded.concat(setTemperatureAlarmSettings(payload.temperature_alarm_settings));
    }
    if ("temperature_mutation_alarm_settings" in payload) {
        encoded = encoded.concat(setTemperatureMutationAlarmSettings(payload.temperature_mutation_alarm_settings));
    }
    if ("humidity_alarm_settings" in payload) {
        encoded = encoded.concat(setHumidityAlarmSettings(payload.humidity_alarm_settings));
    }
    if ("humidity_mutation_alarm_settings" in payload) {
        encoded = encoded.concat(setHumidityMutationAlarmSettings(payload.humidity_mutation_alarm_settings));
    }
    if ("temperature_calibration_settings" in payload) {
        encoded = encoded.concat(setTemperatureCalibrationSettings(payload.temperature_calibration_settings));
    }
    if ("humidity_calibration_settings" in payload) {
        encoded = encoded.concat(setHumidityCalibrationSettings(payload.humidity_calibration_settings));
    }
    if ("light_alarm_settings" in payload) {
        encoded = encoded.concat(setLightAlarmSettings(payload.light_alarm_settings));
    }
    if ("light_tolerance" in payload) {
        encoded = encoded.concat(setLightTolerance(payload.light_tolerance));
    }
    if ("tilt_alarm_settings" in payload) {
        encoded = encoded.concat(setTiltAlarmSettings(payload.tilt_alarm_settings));
    }
    if ("fall_down_alarm_settings" in payload) {
        encoded = encoded.concat(setFallDownAlarmSettings(payload.fall_down_alarm_settings));
    }
    if ("reboot" in payload) {
        encoded = encoded.concat(reboot(payload.reboot));
    }
    if ("synchronize_time" in payload) {
        encoded = encoded.concat(synchronizeTime(payload.synchronize_time));
    }
    if ("timestamp" in payload) {
        encoded = encoded.concat(setTimestamp(payload.timestamp));
    }
    if ("query_device_status" in payload) {
        encoded = encoded.concat(queryDeviceStatus(payload.query_device_status));
    }
    if ("clear_history" in payload) {
        encoded = encoded.concat(clearHistory(payload.clear_history));
    }
    if ("stop_transmit" in payload) {
        encoded = encoded.concat(stopTransmit(payload.stop_transmit));
    }
    if ("fetch_history" in payload) {
        encoded = encoded.concat(fetchHistory(payload.fetch_history));
    }    

    return encoded;
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
 * Set history transmit config
 * @param {object} history_transmit_settings
 * @param {number} history_transmit_settings.enable values: (0: disable, 1: enable)
 * @param {number} history_transmit_settings.retransmission_interval unit: seconds, range: [30, 1200]
 * @param {number} history_transmit_settings.resend_interval unit: seconds, range: [30, 1200]
 * @example { "history_transmit_settings": { "enable": 1, "retransmission_interval": 60, "resend_interval": 60 } }
 */
function setHistoryConfig(history_transmit_settings) {
    var data = [];

    var buffer;
    if ("enable" in history_transmit_settings) {
        var enable = history_transmit_settings.enable;
        var enable_map = { 0: "disable", 1: "enable" };
        var enable_values = getValues(enable_map);
        if (enable_values.indexOf(enable) === -1) {
            throw new Error("history_transmit_settings.enable must be one of " + enable_values.join(", "));
        }
        buffer = new Buffer(3);
        buffer.writeUInt8(0xc5);
        buffer.writeUInt8(0x00);
        buffer.writeUInt8(getValue(enable_map, enable));
        data = data.concat(buffer.toBytes());
    }
    if ("retransmission_enable" in history_transmit_settings) {
        var retransmission_enable = history_transmit_settings.retransmission_enable;
        var enable_map = { 0: "disable", 1: "enable" };
        var enable_values = getValues(enable_map);
        if (enable_values.indexOf(retransmission_enable) === -1) {
            throw new Error("history_transmit_settings.retransmission_enable must be one of " + enable_values.join(", "));
        }
        buffer = new Buffer(3);
        buffer.writeUInt8(0xc5);
        buffer.writeUInt8(0x01);
        buffer.writeUInt8(getValue(enable_map, retransmission_enable));
        data = data.concat(buffer.toBytes());
    }
    if ("retransmission_interval" in history_transmit_settings) {
        var retransmission_interval = history_transmit_settings.retransmission_interval;
        if (retransmission_interval < 30 || retransmission_interval > 1200) {
            throw new Error("history_transmit_settings.retransmission_interval must be between 30 and 1200");
        }
        buffer = new Buffer(4);
        buffer.writeUInt8(0xc5);
        buffer.writeUInt8(0x02);
        buffer.writeUInt16LE(retransmission_interval);
        data = data.concat(buffer.toBytes());
    }
    if ("resend_interval" in history_transmit_settings) {
        var resend_interval = history_transmit_settings.resend_interval;
        if (resend_interval < 30 || resend_interval > 1200) {
            throw new Error("history_transmit_settings.resend_interval must be between 30 and 1200");
        }
        buffer = new Buffer(4);
        buffer.writeUInt8(0xc5);
        buffer.writeUInt8(0x03);
        buffer.writeUInt16LE(resend_interval);
        data = data.concat(buffer.toBytes());
    }
    return data;
}

/**
 * Set auto provisioning enable
 * @param {number} auto_provisioning_enable values: (0: disable, 1: enable)
 * @example { "auto_provisioning_enable": { "enable": 1 } }
 */
function setAutoProvisioningEnable(auto_provisioning_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(auto_provisioning_enable) === -1) {
        throw new Error("auto_provisioning_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0xc4);
    buffer.writeUInt8(getValue(enable_map, auto_provisioning_enable));
    return buffer.toBytes();
}


/**
 * Set collection interval
 * @param {object} collection_interval
 * @param {number} collection_interval.unit values: (0: second, 1: minute)
 * @param {number} collection_interval.seconds_of_time unit: second, range: [10, 64800], default: 30s
 * @param {number} collection_interval.minutes_of_time unit: minute, range: [1, 1440], default: 1min
 * @example { "collection_interval": { "unit": 0, "seconds_of_time": 300 } }
 */
function setCollectionInterval(collection_interval) {
    var unit = collection_interval.unit;
    var seconds_of_time = collection_interval.seconds_of_time || 30;
    var minutes_of_time = collection_interval.minutes_of_time || 1;

    var unit_map = { 0: "second", 1: "minute" };
    var unit_values = getValues(unit_map);
    if (unit_values.indexOf(unit) === -1) {
        throw new Error("collection_interval.unit must be one of " + unit_values.join(", "));
    }
    if (getValue(unit_map, unit) === 0 && (seconds_of_time < 10 || seconds_of_time > 64800)) {
        throw new Error("collection_interval.seconds_of_time must be between 10 and 64800 when collection_interval.unit is 0");
    }
    if (getValue(unit_map, unit) === 1 && (minutes_of_time < 1 || minutes_of_time > 1440)) {
        throw new Error("collection_interval.minutes_of_time must be between 1 and 1440 when collection_interval.unit is 1");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0x60);
    buffer.writeUInt8(getValue(unit_map, unit));
    buffer.writeUInt16LE(getValue(unit_map, unit) === 0 ? seconds_of_time : minutes_of_time);
    return buffer.toBytes();
}

/**
 * Set collection counts
 * @param {number} collection_counts range: [1, 20]
 * @example { "collection_counts": { "counts": 10 } }
 */
function setCollectionCounts(collection_counts) {
    var counts = collection_counts.counts;
    if (counts < 1 || counts > 20) {
        throw new Error("collection_counts.counts must be between 1 and 20");
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x61);
    buffer.writeUInt8(counts);
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
 * Set alarm counts
 * @param {number} alarm_counts range: [1, 1000]
 * @example { "alarm_counts": { "counts": 10 } }
 */
function setAlarmCounts(alarm_counts) {
    var counts = alarm_counts.counts;
    if (counts < 1 || counts > 1000) {
        throw new Error("alarm_counts.counts must be between 1 and 1000");
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0x63);
    buffer.writeUInt16LE(counts);
    return buffer.toBytes();
}

/**
 * Set light collection settings
 * @param {object} light_collection_settings
 * @param {number} light_collection_settings.unit values: (0: second, 1: minute)
 * @param {number} light_collection_settings.seconds_of_time unit: second, range: [10, 64800], default: 30s
 * @param {number} light_collection_settings.minutes_of_time unit: minute, range: [1, 1440], default: 1min
 * @example { "light_collection_settings": { "unit": 0, "seconds_of_time": 300 } }
 */
function setLightCollectionSettings(light_collection_settings) {
    var unit = light_collection_settings.unit;
    var seconds_of_time = light_collection_settings.seconds_of_time || 30;
    var minutes_of_time = light_collection_settings.minutes_of_time || 1;

    var unit_map = { 0: "second", 1: "minute" };
    var unit_values = getValues(unit_map);
    if (unit_values.indexOf(unit) === -1) {
        throw new Error("light_collection_settings.unit must be one of " + unit_values.join(", "));
    }
    if (getValue(unit_map, unit) === 0 && (seconds_of_time < 10 || seconds_of_time > 64800)) {
        throw new Error("light_collection_settings.seconds_of_time must be between 10 and 64800 when light_collection_settings.unit is 0");
    }
    if (getValue(unit_map, unit) === 1 && (minutes_of_time < 1 || minutes_of_time > 1440)) {
        throw new Error("light_collection_settings.minutes_of_time must be between 1 and 1440 when light_collection_settings.unit is 1");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0x64);
    buffer.writeUInt8(getValue(unit_map, unit));
    buffer.writeUInt16LE(getValue(unit_map, unit) === 0 ? seconds_of_time : minutes_of_time);
    return buffer.toBytes();
}

/**
 * Set temperature unit
 * @param {number} temperature_unit values: (0: celsius, 1: fahrenheit)
 * @example { "temperature_unit": { "unit": 0 } }
 */
function setTemperatureUnit(temperature_unit) {
    var unit_map = { 0: "celsius", 1: "fahrenheit" };
    var unit_values = getValues(unit_map);
    if (unit_values.indexOf(temperature_unit) === -1) {
        throw new Error("temperature_unit must be one of " + unit_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x65);
    buffer.writeUInt8(getValue(unit_map, temperature_unit));
    return buffer.toBytes();
}

/**
 * Clear alarm item
 * @param {number} clear_alarm_item values: (0: no, 1: yes)
 * @example { "clear_alarm_item": { "clear": 1 } }
 */
function clearAlarmItem(clear_alarm_item) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(clear_alarm_item) === -1) {
        throw new Error("clear_alarm_item must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, clear_alarm_item) === 0) {
        return [];
    }
    return [0x66, 0x01];
}

/**
 * Set airplane enable
 * @param {number} airplane_enable values: (0: disable, 1: enable)
 * @example { "airplane_enable": { "enable": 1 } }
 */
function setAirplaneEnable(airplane_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(airplane_enable) === -1) {
        throw new Error("airplane_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x70);
    buffer.writeUInt8(getValue(enable_map, airplane_enable));
    return buffer.toBytes();
}

/**
 * Set location function enable
 * @param {number} location_function_enable values: (0: disable, 1: enable)
 * @example { "location_function_enable": { "enable": 1 } }
 */
function setLocationFunctionEnable(location_function_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(location_function_enable) === -1) {
        throw new Error("location_function_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x71);
    buffer.writeUInt8(getValue(enable_map, location_function_enable));
    return buffer.toBytes();
}

/**
 * Set location auth token
 * @param {string} location_auth_token
 * @example { "location_auth_token": "1234567890" }
 */
function setLocationToken(location_auth_token) {
    var bytes = strToBytes(location_auth_token);
    if (bytes.length < 1 || bytes.length > 16) {
        throw new Error("location_auth_token must be between 1 and 16 characters");
    }

    var buffer = new Buffer(1 + bytes.length);
    buffer.writeUInt8(0x72);
    buffer.writeBytes(bytes);
    return buffer.toBytes();
}

/**
 * Set airplane enable time settings
 * @param {object} airplane_enable_time_settings
 * @param {number} airplane_enable_time_settings.start_time
 * @param {number} airplane_enable_time_settings.end_time
 * @example { "airplane_enable_time_settings": { "start_time": 1620000000, "end_time": 1620000000 } }
 */
function setAirplaneEnableTimeSettings(airplane_enable_time_settings) {
    var start_time = airplane_enable_time_settings.start_time;
    var end_time = airplane_enable_time_settings.end_time;

    var buffer = new Buffer(9);
    buffer.writeUInt8(0x73);
    buffer.writeUInt32LE(start_time);
    buffer.writeUInt32LE(end_time);
    return buffer.toBytes();
}

/**
 * Set display config
 * @param {number} display_mode values: (0: temperature, 1: humidity)
 * @example { "display_mode": 0 }
 */
function setDisplayMode(display_mode) {
    var mode_map = { 0: "temperature", 1: "humidity" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(display_mode) === -1) {
        throw new Error("display_mode must be one of " + mode_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x74);
    buffer.writeUInt8(getValue(mode_map, display_mode));
    return buffer.toBytes();
}

/**
 * Set alarm release enable
 * @param {number} alarm_release_enable values: (0: disable, 1: enable)
 * @example { "alarm_release_enable": { "enable": 1 } }
 */
function setAlarmReleaseEnable(alarm_release_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(alarm_release_enable) === -1) {
        throw new Error("alarm_release_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x75);
    buffer.writeUInt8(getValue(enable_map, alarm_release_enable));
    return buffer.toBytes();
}

/**
 * Set child lock settings
 * @param {object} child_lock_settings
 * @param {number} child_lock_settings.enable values: (0: disable, 1: enable)
 * @param {number} child_lock_settings.power_button_enable values: (0: disable, 1: enable)
 * @param {number} child_lock_settings.collection_button_enable values: (0: disable, 1: enable)
 * @example { "child_lock_settings": { "enable": 1, "power_button_enable": 1, "collection_button_enable": 1 } }
 */
function setChildLockSettings(child_lock_settings) {
    var enable = child_lock_settings.enable;
    var power_button_enable = child_lock_settings.power_button_enable;
    var collection_button_enable = child_lock_settings.collection_button_enable;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("child_lock_settings.enable must be one of " + enable_values.join(", "));
    }
    if (enable_values.indexOf(power_button_enable) === -1) {
        throw new Error("child_lock_settings.power_button_enable must be one of " + enable_values.join(", "));
    }
    if (enable_values.indexOf(collection_button_enable) === -1) {
        throw new Error("child_lock_settings.collection_button_enable must be one of " + enable_values.join(", "));
    }
    var data = 0x00;
    var button_offset = { power_button: 0, collection_button: 1 };
    for (var key in button_offset) {
        if (key in child_lock_settings) {
            if (enable_values.indexOf(child_lock_settings[key]) === -1) {
                throw new Error("child_lock_settings." + key + " must be one of " + enable_values.join(", "));
            }
            data |= (getValue(enable_map, child_lock_settings[key]) << button_offset[key]);
        }
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x76);
    buffer.writeUInt8(data);
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
    var threshold_min = temperature_alarm_settings.threshold_min || 0;
    var threshold_max = temperature_alarm_settings.threshold_max || 0;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("temperature_alarm_settings.enable must be one of " + enable_values.join(", "));
    }
    var condition_map = { 0: "disable", 1: "below", 2: "above", 3: "between", 4: "outside" };
    var condition_values = getValues(condition_map);
    if (condition_values.indexOf(threshold_condition) === -1) {
        throw new Error("temperature_alarm_settings.threshold_condition must be one of " + condition_values.join(", "));
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0x77);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(getValue(condition_map, threshold_condition));
    buffer.writeInt16LE(threshold_min * 100);
    buffer.writeInt16LE(threshold_max * 100);
    return buffer.toBytes();
}

/**
 * Set temperature mutation alarm settings
 * @param {object} temperature_mutation_alarm_settings
 * @param {number} temperature_mutation_alarm_settings.enable values: (0: disable, 1: enable)
 * @param {number} temperature_mutation_alarm_settings.threshold_max unit: celsius, range: [0.1, 60]
 * @example { "temperature_mutation_alarm_settings": { "enable": 1, "threshold_max": 25 } }
 */
function setTemperatureMutationAlarmSettings(temperature_mutation_alarm_settings) {
    var enable = temperature_mutation_alarm_settings.enable;
    var threshold_max = temperature_mutation_alarm_settings.threshold_max;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("temperature_mutation_alarm_settings.enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0x78);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeInt16LE(threshold_max * 10);
    return buffer.toBytes();
}

/**
 * Set humidity alarm settings
 * @param {object} humidity_alarm_settings
 * @param {number} humidity_alarm_settings.enable values: (0: disable, 1: enable)
 * @param {number} humidity_alarm_settings.threshold_condition values: (1: below, 2: above, 3: between, 4: outside)
 * @param {number} humidity_alarm_settings.threshold_min unit: %, range: [0, 100]
 * @param {number} humidity_alarm_settings.threshold_max unit: %, range: [0, 100]
 * @example { "humidity_alarm_settings": { "enable": 1, "threshold_condition": 1, "threshold_min": 20, "threshold_max": 25 } }
 */
function setHumidityAlarmSettings(humidity_alarm_settings) {
    var enable = humidity_alarm_settings.enable;
    var threshold_condition = humidity_alarm_settings.threshold_condition;
    var threshold_min = humidity_alarm_settings.threshold_min || 0;
    var threshold_max = humidity_alarm_settings.threshold_max || 0;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("humidity_alarm_settings.enable must be one of " + enable_values.join(", "));
    }
    var condition_map = { 0: "disable", 1: "below", 2: "above", 3: "between", 4: "outside" };
    var condition_values = getValues(condition_map);
    if (condition_values.indexOf(threshold_condition) === -1) {
        throw new Error("humidity_alarm_settings.threshold_condition must be one of " + condition_values.join(", "));
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0x79);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(getValue(condition_map, threshold_condition));
    buffer.writeUInt8(threshold_min * 2);
    buffer.writeUInt8(threshold_max * 2);
    return buffer.toBytes();
}

/**
 * Set humidity mutation alarm settings
 * @param {object} humidity_mutation_alarm_settings
 * @param {number} humidity_mutation_alarm_settings.enable values: (0: disable, 1: enable)
 * @param {number} humidity_mutation_alarm_settings.threshold_max unit: %, range: [0.5, 100]
 * @example { "humidity_mutation_alarm_settings": { "enable": 1, "threshold_max": 25 } }
 */
function setHumidityMutationAlarmSettings(humidity_mutation_alarm_settings) {
    var enable = humidity_mutation_alarm_settings.enable;
    var threshold_max = humidity_mutation_alarm_settings.threshold_max;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("humidity_mutation_alarm_settings.enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0x80);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(threshold_max * 10);
    return buffer.toBytes();
}

/**
 * Set temperature calibration settings
 * @param {object} temperature_calibration_settings
 * @param {number} temperature_calibration_settings.enable values: (0: disable, 1: enable)
 * @param {number} temperature_calibration_settings.calibration_value unit: celsius, range: [-200, 200]
 * @example { "temperature_calibration_settings": { "enable": 1, "calibration_value": 25 } }
 */
function setTemperatureCalibrationSettings(temperature_calibration_settings) {
    var enable = temperature_calibration_settings.enable;
    var calibration_value = temperature_calibration_settings.calibration_value;
    if (calibration_value < -200 || calibration_value > 200) {
        throw new Error("temperature_calibration_settings.calibration_value must be between -200 and 200");
    }

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("temperature_calibration_settings.enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0x81);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeInt16LE(calibration_value * 100);
    return buffer.toBytes();
}

/**
 * Set humidity calibration settings
 * @param {object} humidity_calibration_settings
 * @param {number} humidity_calibration_settings.enable values: (0: disable, 1: enable)
 * @param {number} humidity_calibration_settings.calibration_value unit: %, range: [0, 100]
 * @example { "humidity_calibration_settings": { "enable": 1, "calibration_value": 25 } }
 */
function setHumidityCalibrationSettings(humidity_calibration_settings) {
    var enable = humidity_calibration_settings.enable;
    var calibration_value = humidity_calibration_settings.calibration_value;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("humidity_calibration_settings.enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0x82);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(calibration_value * 2);
    return buffer.toBytes();
}

/**
 * Set light alarm settings
 * @param {object} light_alarm_settings
 * @param {number} light_alarm_settings.enable values: (0: disable, 1: enable)
 * @param {number} light_alarm_settings.threshold_condition values: (0: disable, 2: above)
 * @param {number} light_alarm_settings.threshold_max unit: lux, range: [0, 600]
 * @example { "light_alarm_settings": { "enable": 1, "threshold_condition": 2, "threshold_max": 25 } }
 */
function setLightAlarmSettings(light_alarm_settings) {
    var enable = light_alarm_settings.enable;
    var threshold_condition = light_alarm_settings.threshold_condition;
    var threshold_max = light_alarm_settings.threshold_max;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("light_alarm_settings.enable must be one of " + enable_values.join(", "));
    }
    var condition_map = { 0: "disable", 2: "above" };
    var condition_values = getValues(condition_map);
    if (condition_values.indexOf(threshold_condition) === -1) {
        throw new Error("light_alarm_settings.threshold_condition must be one of " + condition_values.join(", "));
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0x83);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(getValue(condition_map, threshold_condition));
    buffer.writeUInt16LE(threshold_max);
    return buffer.toBytes();
}

/**
 * Set light tolerance
 * @param {number} light_tolerance unit: %, range: [0, 100]
 * @example { "light_tolerance": { "tolerance": 10 } }
 */
function setLightTolerance(light_tolerance) {
    var tolerance = light_tolerance.tolerance;
    if (tolerance < 0 || tolerance > 100) {
        throw new Error("light_tolerance.tolerance must be between 0 and 100");
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(0x84);
    buffer.writeUInt8(tolerance);
    return buffer.toBytes();
}

/**
 * Set tilt alarm settings
 * @param {object} tilt_alarm_settings
 * @param {number} tilt_alarm_settings.enable values: (0: disable, 1: enable)
 * @param {number} tilt_alarm_settings.threshold_condition values: (0: disable, 2: above)
 * @param {number} tilt_alarm_settings.threshold_max unit: degree, range: [1, 90], default: 10
 * @param {number} tilt_alarm_settings.continue_time unit: second, range: [1, 60], default: 2s
 * @example { "tilt_alarm_settings": { "enable": 1, "threshold_condition": 2, "threshold_max": 25, "continue_time": 10 } }
 */
function setTiltAlarmSettings(tilt_alarm_settings) {
    var enable = tilt_alarm_settings.enable;
    var threshold_condition = tilt_alarm_settings.threshold_condition;
    var threshold_max = tilt_alarm_settings.threshold_max;
    var continue_time = tilt_alarm_settings.continue_time;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("tilt_alarm_settings.enable must be one of " + enable_values.join(", "));
    }
    var condition_map = { 0: "disable", 2: "above" };
    var condition_values = getValues(condition_map);
    if (condition_values.indexOf(threshold_condition) === -1) {
        throw new Error("tilt_alarm_settings.threshold_condition must be one of " + condition_values.join(", "));
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0x85);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(getValue(condition_map, threshold_condition));
    buffer.writeUInt8(threshold_max);
    buffer.writeUInt8(continue_time);
    return buffer.toBytes();
}

/**
 * Set fall down alarm settings
 * @param {object} fall_down_alarm_settings
 * @param {number} fall_down_alarm_settings.enable values: (0: disable, 1: enable)
 * @param {number} fall_down_alarm_settings.accelerate unit: m/s^2
 * @example { "fall_down_alarm_settings": { "enable": 1, "accelerate": 10 } }
 */
function setFallDownAlarmSettings(fall_down_alarm_settings) {
    var enable = fall_down_alarm_settings.enable;
    var accelerate = fall_down_alarm_settings.accelerate;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("fall_down_alarm_settings.enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0x86);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(accelerate * 10);
    return buffer.toBytes();
}

/**
 * Reboot
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
    return [0xbe];
}

/**
 * Synchronize time
 * @param {number} synchronize_time values: (0: no, 1: yes)
 * @example { "synchronize_time": 1 }
 */
function synchronizeTime(synchronize_time) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(synchronize_time) === -1) {
        throw new Error("synchronize_time must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, synchronize_time) === 0) {
        return [];
    }
    return [0xb8];
}

/**
 * Set timestamp
 * @param {number} timestamp
 * @example { "timestamp": 1618876800 }
 */
function setTimestamp(timestamp) {
    var buffer = new Buffer(5);
    buffer.writeUInt8(0xb7);
    buffer.writeUInt32LE(timestamp);
    return buffer.toBytes();
}

/**
 * Query device status
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
    return [0xb9];
}

/**
 * Clear history
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
    return [0xbd];
}

function stopTransmit(stop_transmit) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(stop_transmit) === -1) {
        throw new Error("stop_transmit must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, stop_transmit) === 0) {
        return [];
    }
    return [0xbc];
}

/**
 * Fetch history
 * @param {object} fetch_history
 * @param {number} fetch_history.start_time
 * @param {number} fetch_history.end_time
 * @example { "fetch_history": { "start_time": 1618876800, "end_time": 1618876800 } }
 */
function fetchHistory(fetch_history) {
    var start_time = fetch_history.start_time || 0;
    var end_time = fetch_history.end_time || 0;

    var buffer;
    if (end_time === 0) {
        buffer = new Buffer(5);
        buffer.writeUInt8(0xba);
        buffer.writeUInt32LE(start_time);
    } else {
        buffer = new Buffer(9);
        buffer.writeUInt8(0xbb);
        buffer.writeUInt32LE(start_time);
        buffer.writeUInt32LE(end_time);
    }
    return buffer.toBytes();
}


/* eslint-disable */
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

Buffer.prototype.writeBytes = function (bytes) {
    for (var i = 0; i < bytes.length; i++) {
        this.buffer[this.offset + i] = bytes[i];
    }
    this.offset += bytes.length;
};

Buffer.prototype.toBytes = function () {
    return this.buffer;
};

function strToBytes(str) {
    var bytes = [];
    for (var i = 0; i < str.length; i++) {
        var charCode = str.charCodeAt(i);
        if (charCode < 0x80) {
            bytes.push(charCode);
        } else if (charCode < 0x800) {
            bytes.push(0xc0 | (charCode >> 6));
            bytes.push(0x80 | (charCode & 0x3f));
        } else if (charCode < 0x10000) {
            bytes.push(0xe0 | (charCode >> 12));
            bytes.push(0x80 | ((charCode >> 6) & 0x3f));
            bytes.push(0x80 | (charCode & 0x3f));
        } else if (charCode < 0x200000) {
            bytes.push(0xf0 | (charCode >> 18));
            bytes.push(0x80 | ((charCode >> 12) & 0x3f));
            bytes.push(0x80 | ((charCode >> 6) & 0x3f));
            bytes.push(0x80 | (charCode & 0x3f));
        }
    }
    return bytes;
}