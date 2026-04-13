/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product TS301
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
    if ("shutdown" in payload) {
        encoded = encoded.concat(shutdown(payload.shutdown));
    }
    if ("report_interval" in payload) {
        encoded = encoded.concat(setReportInterval(payload.report_interval));
    }
    if ("collection_interval" in payload) {
        encoded = encoded.concat(setCollectionInterval(payload.collection_interval));
    }
    if ("alarm_release_enable" in payload) {
        encoded = encoded.concat(setAlarmReleaseEnable(payload.alarm_release_enable));
    }
    if ("alarm_config" in payload) {
        encoded = encoded.concat(setAlarmConfig(payload.alarm_config));
    }
    if ("report_status" in payload) {
        encoded = encoded.concat(reportStatus(payload.report_status));
    }
    if ("retrieval_historical_data_by_time" in payload) {
        encoded = encoded.concat(retrievalHistoricalDataByTime(payload.retrieval_historical_data_by_time.timestamp));
    }
    if ("retrieval_historical_data_by_time_range" in payload) {
        encoded = encoded.concat(retrievalHistoricalDataByTimeRange(payload.retrieval_historical_data_by_time_range));
    }
    if ("stop_historical_data_retrieval" in payload) {
        encoded = encoded.concat(stopHistoricalDataRetrieval(payload.stop_historical_data_retrieval));
    }
    if ("sync_time" in payload) {
        encoded = encoded.concat(syncTime(payload.sync_time));
    }
    if ("time_zone" in payload) {
        encoded = encoded.concat(setTimeZone(payload.time_zone));
    }
    if ("button_lock_config" in payload) {
        encoded = encoded.concat(setButtonLockConfig(payload.button_lock_config));
    }
    if ("time_display" in payload) {
        encoded = encoded.concat(setTimeDisplay(payload.time_display));
    }
    if ("temperature_unit_display" in payload) {
        encoded = encoded.concat(setTemperatureUnitDisplay(payload.temperature_unit_display));
    }
    if ("display_mode" in payload) {
        encoded = encoded.concat(setDisplayMode(payload.display_mode));
    }
    if ("temperature_calibration_settings" in payload) {
        encoded = encoded.concat(setTemperatureCalibration(0, payload.temperature_calibration_settings));
    }
    if ("humidity_calibration_settings" in payload) {
        encoded = encoded.concat(setHumidityCalibration(2, payload.humidity_calibration_settings));
    }
    if ("magnet_throttle" in payload) {
        encoded = encoded.concat(setMagnetThrottle(payload.magnet_throttle));
    }
    if ("magnet_delay_time" in payload) {
        encoded = encoded.concat(setMagnetDelayTime(payload.magnet_delay_time));
    }
    if ("temperature_alarm_config" in payload) {
        encoded = encoded.concat(setTemperatureAlarmConfig(payload.temperature_alarm_config));
    }
    if ("temperature_mutation_alarm_config" in payload) {
        encoded = encoded.concat(setTemperatureMutationAlarmConfig(payload.temperature_mutation_alarm_config));
    }
    if ("humidity_alarm_config" in payload) {
        encoded = encoded.concat(setHumidityAlarmConfig(payload.humidity_alarm_config));
    }
    if ("humidity_mutation_alarm_config" in payload) {
        encoded = encoded.concat(setHumidityMutationAlarmConfig(payload.humidity_mutation_alarm_config));
    }
    if ("fetch_sensor_id" in payload) {
        encoded = encoded.concat(fetchSensorID(payload.fetch_sensor_id));
    }
    if ("d2d_master_config" in payload) {
        for (var i = 0; i < payload.d2d_master_config.length; i++) {
            encoded = encoded.concat(setD2DMasterConfig(payload.d2d_master_config[i]));
        }
    }
    if ("d2d_key" in payload) {
        encoded = encoded.concat(setD2DKey(payload.d2d_key));
    }
    if ("d2d_enable" in payload) {
        encoded = encoded.concat(setD2DEnable(payload.d2d_enable));
    }
    if ("d2d_uplink_config" in payload) {
        encoded = encoded.concat(setD2DUplinkConfig(payload.d2d_uplink_config));
    }
    if ("dst_config" in payload) {
        encoded = encoded.concat(setDaylightSavingTime(payload.dst_config));
    }
    if ("ack_retry_times" in payload) {
        encoded = encoded.concat(setAckRetryTimes(payload.ack_retry_times));
    }
    if ("query_config" in payload) {
        encoded = encoded.concat(queryDeviceConfig(payload.query_config));
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
    if ("clear_history" in payload) {
        encoded = encoded.concat(clearHistory(payload.clear_history));
    }
    if ("stop_transmit" in payload) {
        encoded = encoded.concat(stopTransmit(payload.stop_transmit));
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
 * shutdown device
 * @param {number} shutdown values: (0: no, 1: yes)
 * @example { "shutdown": 1 }
 */
function shutdown(shutdown) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(shutdown) === -1) {
        throw new Error("shutdown must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, shutdown) === 0) {
        return [];
    }
    return [0xf9, 0x70, 0xff];
}

/**
 * report status
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
 * retrieval historical data by time
 * @param {number} timestamp
 * @example { "retrieval_historical_data_by_time": 1718188800 }
 */
function retrievalHistoricalDataByTime(timestamp) {
    if (timestamp === undefined || timestamp === null) {
        throw new Error("timestamp is required");
    }
    var buffer = new Buffer(6);
    buffer.writeUInt8(0xfd);
    buffer.writeUInt8(0x6b);
    buffer.writeUInt32LE(timestamp);
    return buffer.toBytes();
}

/**
 * retrieval historical data by time range
 * @param {object} retrieval_historical_data_by_time_range
 * @param {number} retrieval_historical_data_by_time_range.start_time
 * @param {number} retrieval_historical_data_by_time_range.end_time
 * @example { "retrieval_historical_data_by_time_range": { "start_time": 1718188800, "end_time": 1718275200 } }
 */
function retrievalHistoricalDataByTimeRange(retrieval_historical_data_by_time_range) {
    var start_time = retrieval_historical_data_by_time_range.start_time;
    var end_time = retrieval_historical_data_by_time_range.end_time;
    if (start_time === undefined || start_time === null) {
        throw new Error("start_time is required");
    }
    if (end_time === undefined || end_time === null) {
        throw new Error("end_time is required");
    }
    if (start_time > end_time) {
        throw new Error("start_time must be less than end_time");
    }

    var buffer = new Buffer(10);
    buffer.writeUInt8(0xfd);
    buffer.writeUInt8(0x6c);
    buffer.writeUInt32LE(start_time);
    buffer.writeUInt32LE(end_time);
    return buffer.toBytes();
}

/**
 * stop historical data retrieval
 * @param {number} stop_historical_data_retrieval values: (0: no, 1: yes)
 * @example { "stop_historical_data_retrieval": 1 }
 */
function stopHistoricalDataRetrieval(stop_historical_data_retrieval) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(stop_historical_data_retrieval) === -1) {
        throw new Error("stop_historical_data_retrieval must be one of " + yes_no_values.join(", "));
    }
    if (getValue(yes_no_map, stop_historical_data_retrieval) === 0) {
        return [];
    }

    return [0xfd, 0x6d, 0xff];
}

/**
 * sync time
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
    return [0xff, 0x4a, 0x00];
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
 * @param {number} collection_interval unit: second
 * @example { "collection_interval": 300 }
 */
function setCollectionInterval(collection_interval) {
    if (typeof collection_interval !== "number") {
        throw new Error("collection_interval must be a number");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x02);
    buffer.writeUInt16LE(collection_interval);
    return buffer.toBytes();
}

/**
 * set alarm release enable
 * @since v2
 * @param {number} alarm_release_enable values: (0: disable, 1: enable)
 * @example { "alarm_release_enable": 1 }
 */
function setAlarmReleaseEnable(alarm_release_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(alarm_release_enable) == -1) {
        throw new Error("alarm_release_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xf5);
    buffer.writeUInt8(getValue(enable_map, alarm_release_enable));
    return buffer.toBytes();
}

/**
 * set alarm config
 * @param {object} alarm_config
 * @param {number} alarm_config.alarm_interval unit: minute, range: [1, 1440]
 * @param {number} alarm_config.alarm_counts range: [1, 65535]
 * @example { "alarm_config": { "alarm_interval": 10, "alarm_counts": 10 } }
 */
function setAlarmConfig(alarm_config) {
    var alarm_interval = alarm_config.alarm_interval;
    var alarm_counts = alarm_config.alarm_counts;

    if (alarm_interval < 1 || alarm_interval > 1440) {
        throw new Error("alarm_interval must be in range [1, 1440]");
    }
    if (alarm_counts < 1 || alarm_counts > 65535) {
        throw new Error("alarm_counts must be in range [1, 65535]");
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x7e);
    buffer.writeUInt8(0x00);
    buffer.writeUInt16LE(alarm_interval);
    buffer.writeUInt16LE(alarm_counts);
    return buffer.toBytes();
}

/**
 * set time zone
 * @param {number} time_zone unit: minute, convert: "hh:mm" -> "hh * 60 + mm", values: ( -720: UTC-12, -660: UTC-11, -600: UTC-10, -570: UTC-9:30, -540: UTC-9, -480: UTC-8, -420: UTC-7, -360: UTC-6, -300: UTC-5, -240: UTC-4, -210: UTC-3:30, -180: UTC-3, -120: UTC-2, -60: UTC-1, 0: UTC, 60: UTC+1, 120: UTC+2, 180: UTC+3, 240: UTC+4, 300: UTC+5, 360: UTC+6, 420: UTC+7, 480: UTC+8, 540: UTC+9, 570: UTC+9:30, 600: UTC+10, 660: UTC+11, 720: UTC+12, 765: UTC+12:45, 780: UTC+13, 840: UTC+14 )
 * @example { "time_zone": 480 }
 * @example { "time_zone": -240 }
 */
function setTimeZone(time_zone) {
    var timezone_map = { "-720": "UTC-12", "-660": "UTC-11", "-600": "UTC-10", "-570": "UTC-9:30", "-540": "UTC-9", "-480": "UTC-8", "-420": "UTC-7", "-360": "UTC-6", "-300": "UTC-5", "-240": "UTC-4", "-210": "UTC-3:30", "-180": "UTC-3", "-120": "UTC-2", "-60": "UTC-1", 0: "UTC", 60: "UTC+1", 120: "UTC+2", 180: "UTC+3", 210: "UTC+3:30", 240: "UTC+4", 270: "UTC+4:30", 300: "UTC+5", 330: "UTC+5:30", 345: "UTC+5:45", 360: "UTC+6", 390: "UTC+6:30", 420: "UTC+7", 480: "UTC+8", 540: "UTC+9", 570: "UTC+9:30", 600: "UTC+10", 630: "UTC+10:30", 660: "UTC+11", 720: "UTC+12", 765: "UTC+12:45", 780: "UTC+13", 840: "UTC+14" };
    var timezone_values = getValues(timezone_map);
    if (timezone_values.indexOf(time_zone) === -1) {
        throw new Error("time_zone must be one of " + timezone_values.join(", "));
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xbd);
    buffer.writeInt16LE(getValue(timezone_map, time_zone));
    return buffer.toBytes();
}

/**
 * set button lock config
 * @param {object} button_lock_config
 * @param {number} button_lock_config.power_button values: (0: disable, 1: enable)
 * @param {number} button_lock_config.report_button values: (0: disable, 1: enable)
 * @example { "button_lock_config": { "power_button": 1, "report_button": 1 } }
 */
function setButtonLockConfig(button_lock_config) {
    var button_bit_offset = { power_button: 0, report_button: 1 };

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);

    var data = 0x00;
    for (var key in button_lock_config) {
        if (key in button_bit_offset) {
            if (enable_values.indexOf(button_lock_config[key]) === -1) {
                throw new Error("button_lock_config." + key + " must be one of " + enable_values.join(", "));
            }
            data |= getValue(enable_map, button_lock_config[key]) << button_bit_offset[key];
        }
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x69);
    buffer.writeUInt8(data);
    return buffer.toBytes();
}

/**
 * set time display
 * @param {number} time_display values: (0: 12_hour, 1: 24_hour)
 * @example { "time_display": 1 }
 */
function setTimeDisplay(time_display) {
    var time_display_map = { 0: "12_hour", 1: "24_hour" };
    var time_display_values = getValues(time_display_map);
    if (time_display_values.indexOf(time_display) === -1) {
        throw new Error("time_display must be one of " + time_display_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xe9);
    buffer.writeUInt8(getValue(time_display_map, time_display));
    return buffer.toBytes();
}

/**
 * set temperature unit display
 * @param {number} temperature_unit_display values: (0: celsius, 1: fahrenheit)
 * @example { "temperature_unit_display": 0 }
 */
function setTemperatureUnitDisplay(temperature_unit_display) {
    var temperature_unit_display_map = { 0: "celsius", 1: "fahrenheit" };
    var temperature_unit_display_values = getValues(temperature_unit_display_map);
    if (temperature_unit_display_values.indexOf(temperature_unit_display) === -1) {
        throw new Error("temperature_unit_display must be one of " + temperature_unit_display_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xeb);
    buffer.writeUInt8(getValue(temperature_unit_display_map, temperature_unit_display));
    return buffer.toBytes();
}

/**
 * set display
 * @param {number} display_mode values: (0: disable, 1: enable, 255: auto)
 * @example { "display_mode": 1 }
 */
function setDisplayMode(display_mode) {
    var mode_map = { 0: "disable", 1: "enable", 255: "auto" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(display_mode) === -1) {
        throw new Error("display_mode must be one of " + mode_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x2d);
    buffer.writeUInt8(getValue(mode_map, display_mode));
    return buffer.toBytes();
}

/**
 * temperature calibration
 * @param {object} temperature_calibration_settings
 * @param {number} temperature_calibration_settings.enable values: (0: disable, 1: enable)
 * @param {number} temperature_calibration_settings.calibration_value unit: Celsius
 * @example { temperature_calibration_settings": { "enable": 1, "calibration_value": 25 } }
 */
function setTemperatureCalibration(idx, temperature_calibration_settings) {
    var enable = temperature_calibration_settings.enable;
    var calibration_value = temperature_calibration_settings.calibration_value;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("temperature_chn_calibration_settings.enable must be one of " + enable_values.join(", "));
    }

    var data = (getValue(enable_map, enable) << 7) | idx;
    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xea);
    buffer.writeUInt8(data);
    buffer.writeInt16LE(calibration_value * 10);
    return buffer.toBytes();
}

/**
 * humidity calibration
 * @param {object} humidity_calibration_settings
 * @param {number} humidity_calibration_settings.enable values: (0: disable, 1: enable)
 * @param {number} humidity_calibration_settings.calibration_value unit: %r.h.
 * @example { humidity_calibration_settings": { "enable": 1, "calibration_value": 5 } }
 */
function setHumidityCalibration(idx, humidity_calibration_settings) {
    var enable = humidity_calibration_settings.enable;
    var calibration_value = humidity_calibration_settings.calibration_value;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("humidity_calibration_settings.enable must be one of " + enable_values.join(", "));
    }

    var data = (getValue(enable_map, enable) << 7) | idx;

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xea);
    buffer.writeUInt8(data);
    buffer.writeInt16LE(calibration_value * 10);
    return buffer.toBytes();
}

/**
 * magnet throttle
 * @param {number} magnet_throttle unit: millisecond, range: [0, 6000]
 * @example { "magnet_throttle": 3000 }
 */
function setMagnetThrottle(magnet_throttle) {
    if (typeof magnet_throttle !== "number") {
        throw new Error("magnet_throttle must be a number");
    }
    if (magnet_throttle < 0 || magnet_throttle > 6000) {
        throw new Error("magnet_throttle must be in range [0, 6000]");
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x91);
    buffer.writeUInt8(0x01);
    buffer.writeUInt32LE(magnet_throttle);
    return buffer.toBytes();
}

/**
 * set magnet delay time
 * @param {number} magnet_delay_time unit: millisecond, range: 0 or [4, 65535]
 * @example { "magnet_delay_time": 3000 }
 */
function setMagnetDelayTime(magnet_delay_time) {
    if (typeof magnet_delay_time !== "number") {
        throw new Error("magnet_delay_time must be a number");
    }
    if (magnet_delay_time !== 0 && (magnet_delay_time < 4 || magnet_delay_time > 65535)) {
        throw new Error("magnet_delay_time must be in range 0 or [4, 65535]");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x9a);
    buffer.writeUInt16LE(magnet_delay_time);
    return buffer.toBytes();
}

/**
 * set alarm config
 * @param {object} temperature_alarm_config
 * @param {number} temperature_alarm_config.enable values: (0: disable, 1: enable)
 * @param {number} temperature_alarm_config.condition values: (0: disable, 1: below, 2: above, 3: between, 4: outside)
 * @param {number} temperature_alarm_config.threshold_min unit: Celsius
 * @param {number} temperature_alarm_config.threshold_max unit: Celsius
 * @example { "temperature_alarm_config": { "enable": 1, "condition": 1, "threshold_min": 20, "threshold_max": 30 } }
 */
function setTemperatureAlarmConfig(temperature_alarm_config) {
    var enable = temperature_alarm_config.enable;
    var condition = temperature_alarm_config.condition;
    var threshold_min = temperature_alarm_config.threshold_min;
    var threshold_max = temperature_alarm_config.threshold_max;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("temperature_alarm_config.enable must be one of " + enable_values.join(", "));
    }
    var condition_map = { 0: "disable", 1: "below", 2: "above", 3: "between", 4: "outside" };
    var condition_values = getValues(condition_map);
    if (condition_values.indexOf(condition) === -1) {
        throw new Error("temperature_alarm_config.condition must be one of " + condition_values.join(", "));
    }

    var data = 0x00;
    data |= getValue(condition_map, condition);
    data |= 0 << 3; // temperature alarm
    data |= getValue(enable_map, enable) << 6;

    var buffer = new Buffer(11);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x06);
    buffer.writeUInt8(data);
    buffer.writeInt16LE(threshold_min * 10);
    buffer.writeInt16LE(threshold_max * 10);
    buffer.writeUInt16LE(0x00);
    buffer.writeUInt16LE(0x00);
    return buffer.toBytes();
}

/**
 * set temperature mutation alarm config
 * @param {object} temperature_mutation_alarm_config
 * @param {number} temperature_mutation_alarm_config.enable values: (0: disable, 1: enable)
 * @param {number} temperature_mutation_alarm_config.mutation unit: Celsius
 * @example { "temperature_mutation_alarm_config": { "enable": 1, "mutation": 0.5 } }
 */
function setTemperatureMutationAlarmConfig(temperature_mutation_alarm_config) {
    var enable = temperature_mutation_alarm_config.enable;
    var mutation = temperature_mutation_alarm_config.mutation;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("temperature_mutation_alarm_config.enable must be one of " + enable_values.join(", "));
    }

    var data = 0x00;
    data |= 5; // mutation
    data |= 2 << 3; // temperature mutation alarm
    data |= getValue(enable_map, enable) << 6;

    var buffer = new Buffer(11);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x06);
    buffer.writeUInt8(data);
    buffer.writeUInt16LE(0x00);
    buffer.writeUInt16LE(mutation * 10);
    buffer.writeUInt16LE(0x00);
    buffer.writeUInt16LE(0x00);
    return buffer.toBytes();
}

/**
 * set humidity alarm config
 * @param {object} humidity_alarm_config
 * @param {number} humidity_alarm_config.enable values: (0: disable, 1: enable)
 * @param {number} humidity_alarm_config.condition values: (0: disable, 1: below, 2: above, 3: between, 4: outside)
 * @param {number} humidity_alarm_config.threshold_min unit: %r.h.
 * @param {number} humidity_alarm_config.threshold_max unit: %r.h.
 * @example { "humidity_alarm_config": { "enable": 1, "condition": 1, "threshold_min": 30, "threshold_max": 70 } }
 */
function setHumidityAlarmConfig(humidity_alarm_config) {
    var enable = humidity_alarm_config.enable;
    var condition = humidity_alarm_config.condition;
    var threshold_min = humidity_alarm_config.threshold_min;
    var threshold_max = humidity_alarm_config.threshold_max;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("humidity_alarm_config.enable must be one of " + enable_values.join(", "));
    }

    var condition_map = { 0: "disable", 1: "below", 2: "above", 3: "between", 4: "outside" };
    var condition_values = getValues(condition_map);
    if (condition_values.indexOf(condition) === -1) {
        throw new Error("humidity_alarm_config.condition must be one of " + condition_values.join(", "));
    }

    var data = 0x00;
    data |= getValue(condition_map, condition);
    data |= 4 << 3; // humidity alarm
    data |= getValue(enable_map, enable) << 6;

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
 * set humidity mutation alarm config
 * @param {object} humidity_mutation_alarm_config
 * @param {number} humidity_mutation_alarm_config.enable values: (0: disable, 1: enable)
 * @param {number} humidity_mutation_alarm_config.mutation unit: %r.h.
 * @example { "humidity_mutation_alarm_config": { "enable": 1, "mutation": 1 } }
 */
function setHumidityMutationAlarmConfig(humidity_mutation_alarm_config) {
    var enable = humidity_mutation_alarm_config.enable;
    var mutation = humidity_mutation_alarm_config.mutation;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("humidity_mutation_alarm_config.enable must be one of " + enable_values.join(", "));
    }

    var data = 0x00;
    data |= 5; // mutation
    data |= 6 << 3; // humidity mutation alarm
    data |= getValue(enable_map, enable) << 6;

    var buffer = new Buffer(11);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x06);
    buffer.writeUInt8(data);
    buffer.writeUInt16LE(0x00);
    buffer.writeUInt16LE(mutation * 10);
    buffer.writeUInt16LE(0x00);
    buffer.writeUInt16LE(0x00);
    return buffer.toBytes();
}

/**
 * fetch sensor id
 * @param {number} fetch_sensor_id values: (0: sensor_1, 2: all)
 * @example { "fetch_sensor_id": 0 }
 */
function fetchSensorID(fetch_sensor_id) {
    var sensor_map = { 0: "sensor_1", 2: "all" };
    var sensor_values = getValues(sensor_map);
    if (sensor_values.indexOf(fetch_sensor_id) === -1) {
        throw new Error("fetch_sensor_id must be one of " + sensor_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x31);
    buffer.writeUInt8(getValue(sensor_map, fetch_sensor_id));
    return buffer.toBytes();
}

/**
 * set d2d master config
 * @param {object} d2d_master_config
 * @param {number} d2d_master_config._item.mode values: (1: temperature_threshold_alarm, 2: temperature_threshold_alarm_release, 3: temperature_mutation_alarm, 4: humidity_threshold_alarm, 5: humidity_threshold_alarm_release, 6: humidity_mutation_alarm, 7: magnet_close, 8: magnet_open)
 * @param {number} d2d_master_config._item.enable values: (0: disable, 1: enable)
 * @param {number} d2d_master_config._item.lora_uplink_enable values: (0: disable, 1: enable)
 * @param {string} d2d_master_config._item.d2d_cmd
 * @example { "d2d_master_config": [{ "mode": 1, "enable": 1 }] }
 */
function setD2DMasterConfig(d2d_master_config) {
    var mode = d2d_master_config.mode;
    var enable = d2d_master_config.enable;
    var lora_uplink_enable = d2d_master_config.lora_uplink_enable;
    var d2d_cmd = d2d_master_config.d2d_cmd;

    var mode_map = { 1: "temperature_threshold_alarm", 2: "temperature_threshold_alarm_release", 3: "temperature_mutation_alarm", 4: "humidity_threshold_alarm", 5: "humidity_threshold_alarm_release", 6: "humidity_mutation_alarm", 7: "magnet_close", 8: "magnet_open" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(mode) === -1) {
        throw new Error("d2d_master_config._item.mode must be one of " + mode_values.join(", "));
    }

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("d2d_master_config._item.enable must be one of " + enable_values.join(", "));
    }
    if (lora_uplink_enable !== undefined && enable_values.indexOf(lora_uplink_enable) === -1) {
        throw new Error("d2d_master_config._item.lora_uplink_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(10);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x96);
    buffer.writeUInt8(getValue(mode_map, mode));
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(getValue(enable_map, lora_uplink_enable));
    buffer.writeD2DCommand(d2d_cmd, "0000");
    buffer.writeUInt16LE(0x00);
    buffer.writeUInt8(0x00);
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
        throw new Error("d2d_key must be hex string [0-9A-F]");
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
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x66);
    buffer.writeUInt8(getValue(enable_map, d2d_enable));
    return buffer.toBytes();
}

/**
 * set uplink config
 * @param {object} d2d_uplink_config
 * @param {number} d2d_uplink_config.d2d_uplink_enable values: (0: disable, 1: enable)
 * @param {number} d2d_uplink_config.lora_uplink_enable values: (0: disable, 1: enable)
 * @param {object} d2d_uplink_config.sensor_data_config
 * @param {number} d2d_uplink_config.sensor_data_config.temperature values: (0: disable, 1: enable)
 * @param {number} d2d_uplink_config.sensor_data_config.humidity values: (0: disable, 1: enable)
 * @example { "d2d_uplink_config": { "d2d_uplink_enable": 1, "lora_uplink_enable": 1, "sensor_data_config": { "temperature": 1, "humidity": 1 } } }
 */
function setD2DUplinkConfig(d2d_uplink_config) {
    var d2d_uplink_enable = d2d_uplink_config.d2d_uplink_enable;
    var lora_uplink_enable = d2d_uplink_config.lora_uplink_enable;
    var sensor_data_config = d2d_uplink_config.sensor_data_config;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(d2d_uplink_enable) === -1) {
        throw new Error("d2d_uplink_config.d2d_uplink_enable must be one of " + enable_values.join(", "));
    }
    if (enable_values.indexOf(lora_uplink_enable) === -1) {
        throw new Error("d2d_uplink_config.lora_uplink_enable must be one of " + enable_values.join(", "));
    }

    var sensor_bit_offset = { temperature: 0, humidity: 1 };
    var data = 0x00;
    for (var key in sensor_data_config) {
        if (key in sensor_bit_offset) {
            if (enable_values.indexOf(sensor_data_config[key]) === -1) {
                throw new Error("d2d_uplink_config.sensor_data_config." + key + " must be one of " + enable_values.join(", "));
            }
            data |= getValue(enable_map, sensor_data_config[key]) << sensor_bit_offset[key];
        }
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x63);
    buffer.writeUInt8(getValue(enable_map, d2d_uplink_enable));
    buffer.writeUInt8(getValue(enable_map, lora_uplink_enable));
    buffer.writeUInt16LE(data);
    return buffer.toBytes();
}

/**
 * set daylight saving time
 * @since v2.0
 * @param {object} dst_config
 * @param {number} dst_config.enable values: (0: disable, 1: enable)
 * @param {number} dst_config.offset, unit: minute
 * @param {number} dst_config.start_month, values: (1: January, 2: February, 3: March, 4: April, 5: May, 6: June, 7: July, 8: August, 9: September, 10: October, 11: November, 12: December)
 * @param {number} dst_config.start_week_num, range: [1, 5]
 * @param {number} dst_config.start_week_day, range: [1, 7]
 * @param {number} dst_config.start_time, unit: minute, convert: "hh:mm" -> "hh * 60 + mm"
 * @param {number} dst_config.end_month, values: (1: January, 2: February, 3: March, 4: April, 5: May, 6: June, 7: July, 8: August, 9: September, 10: October, 11: November, 12: December)
 * @param {number} dst_config.end_week_num, range: [1, 5]
 * @param {number} dst_config.end_week_day, range: [1, 7]
 * @param {number} dst_config.end_time, unit: minute, convert: "hh:mm" -> "hh * 60 + mm"
 * @example { "dst_config": { "enable": 1, "offset": 60, "start_month": 3, "start_week_num": 2, "start_week_day": 7, "start_time": 120, "end_month": 1, "end_week_num": 4, "end_week_day": 1, "end_time": 180 } } output: FFBA013C032778000141B400
 */
function setDaylightSavingTime(dst_config) {
    var enable = dst_config.enable;
    var offset = dst_config.offset;
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

    var week_values = [1, 2, 3, 4, 5, 6, 7];
    var month_values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    var enable_value = getValue(enable_map, enable);
    if (enable_value && month_values.indexOf(start_month) === -1) {
        throw new Error("dst_config.start_month must be one of " + month_values.join(", "));
    }
    if (enable_value && month_values.indexOf(end_month) === -1) {
        throw new Error("dst_config.end_month must be one of " + month_values.join(", "));
    }
    if (enable_value && week_values.indexOf(start_week_day) === -1) {
        throw new Error("dst_config.start_week_day must be one of " + week_values.join(", "));
    }
    if (enable_value && week_values.indexOf(end_week_day) === -1) {
        throw new Error("dst_config.end_week_day must be one of " + week_values.join(", "));
    }

    var data = 0x00;
    data |= getValue(enable_map, enable) << 7;
    data |= offset;

    var buffer = new Buffer(11);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x72);
    buffer.writeUInt8(data);
    buffer.writeUInt8(start_month);
    buffer.writeUInt8((start_week_num << 4) | start_week_day);
    buffer.writeUInt16LE(start_time);
    buffer.writeUInt8(end_month);
    buffer.writeUInt8((end_week_num << 4) | end_week_day);
    buffer.writeUInt16LE(end_time);
    return buffer.toBytes();
}

/**
 * LoRa confirm ack retry times
 * @param {number} ack_retry_times range: [0, 10]
 * @example { "ack_retry_times": 3 }
 */
function setAckRetryTimes(ack_retry_times) {
    if (typeof ack_retry_times !== "number") {
        throw new Error("ack_retry_times must be a number");
    }
    if (ack_retry_times < 0 || ack_retry_times > 10) {
        throw new Error("ack_retry_times must be in range [0, 10]");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x32);
    buffer.writeUInt8(0x00);
    buffer.writeUInt8(0x00);
    buffer.writeUInt8(ack_retry_times);
    return buffer.toBytes();
}

/**
 * query device config
 * @param {object} query_config
 * @param {number} query_config.report_interval values: (0: disable, 1: enable)
 * @param {number} query_config.ack_retry_times values: (0: disable, 1: enable)
 * @param {number} query_config.temperature_unit_display values: (0: disable, 1: enable)
 * @param {number} query_config.button_lock_config values: (0: disable, 1: enable)
 * @param {number} query_config.temperature_alarm_config values: (0: disable, 1: enable)
 * @param {number} query_config.humidity_alarm_config values: (0: disable, 1: enable)
 * @param {number} query_config.temperature_mutation_alarm_config values: (0: disable, 1: enable)
 * @param {number} query_config.humidity_mutation_alarm_config values: (0: disable, 1: enable)
 * @param {number} query_config.collection_interval values: (0: disable, 1: enable)
 * @param {number} query_config.alarm_config values: (0: disable, 1: enable)
 * @param {number} query_config.alarm_release_enable values: (0: disable, 1: enable)
 * @param {number} query_config.d2d_uplink_config values: (0: disable, 1: enable)
 * @param {number} query_config.d2d_enable values: (0: disable, 1: enable)
 * @param {number} query_config.d2d_master_config_with_temperature_threshold_alarm values: (0: disable, 1: enable)
 * @param {number} query_config.d2d_master_config_with_temperature_threshold_alarm_release values: (0: disable, 1: enable)
 * @param {number} query_config.d2d_master_config_with_temperature_mutation_alarm values: (0: disable, 1: enable)
 * @param {number} query_config.d2d_master_config_with_humidity_threshold_alarm values: (0: disable, 1: enable)
 * @param {number} query_config.d2d_master_config_with_humidity_threshold_alarm_release values: (0: disable, 1: enable)
 * @param {number} query_config.d2d_master_config_with_humidity_mutation_alarm values: (0: disable, 1: enable)
 * @param {number} query_config.d2d_master_config_with_magnet_close_alarm values: (0: disable, 1: enable)
 * @param {number} query_config.d2d_master_config_with_magnet_open_alarm values: (0: disable, 1: enable)
 * @param {number} query_config.history_enable values: (0: disable, 1: enable)
 * @param {number} query_config.retransmit_interval values: (0: disable, 1: enable)
 * @param {number} query_config.resend_interval values: (0: disable, 1: enable)
 * @param {number} query_config.magnet_delay_time values: (0: disable, 1: enable)
 * @param {number} query_config.temperature_calibration_settings values: (0: disable, 1: enable)
 * @param {number} query_config.humidity_calibration_settings values: (0: disable, 1: enable)
 * @param {number} query_config.dst_config values: (0: disable, 1: enable)
 * @param {number} query_config.time_display values: (0: disable, 1: enable)
 * @param {number} query_config.magnet_throttle values: (0: disable, 1: enable)
 * @param {number} query_config.display_mode values: (0: disable, 1: enable)
 */
function queryDeviceConfig(query_config) {
    var config_map = {
        report_interval: 1,
        ack_retry_times: 2,
        temperature_unit_display: 3,
        button_lock_config: 4,
        temperature_alarm_config: 5,
        humidity_alarm_config: 6,
        temperature_mutation_alarm_config: 9,
        humidity_mutation_alarm_config: 10,
        collection_interval: 13,
        alarm_config: 14,
        alarm_release_enable: 15,
        d2d_uplink_config: 16,
        d2d_enable: 17,
        d2d_master_config_with_temperature_threshold_alarm: 18,
        d2d_master_config_with_temperature_threshold_alarm_release: 19,
        d2d_master_config_with_temperature_mutation_alarm: 20,
        d2d_master_config_with_humidity_threshold_alarm: 21,
        d2d_master_config_with_humidity_threshold_alarm_release: 22,
        d2d_master_config_with_humidity_mutation_alarm: 23,
        d2d_master_config_with_magnet_close_alarm: 24,
        d2d_master_config_with_magnet_open_alarm: 25,
        history_enable: 34,
        retransmit_interval: 35,
        magnet_delay_time: 36,
        resend_interval: 37,
        temperature_calibration_settings: 38,
        humidity_calibration_settings: 39,
        dst_config: 42,
        time_display: 43,
        magnet_throttle: 44,
        display_mode: 45,
        retransmit_enable: 46,
    };

    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);

    var data = [];
    for (var key in config_map) {
        if (key in query_config) {
            if (yes_no_values.indexOf(query_config[key]) === -1) {
                throw new Error("query_config." + key + " must be one of " + yes_no_values.join(", "));
            }
            if (getValue(yes_no_map, query_config[key]) === 0) {
                continue;
            }
            var buffer = new Buffer(3);
            buffer.writeUInt8(0xf9);
            buffer.writeUInt8(0x6f);
            buffer.writeUInt8(config_map[key]);
            data = data.concat(buffer.toBytes());
        }
    }
    if (data.length === 0) {
        throw new Error("query_config is empty, please check the query_config");
    }
    return data;
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
 * @param {number} retransmit_interval unit: seconds
 * @example { "retransmit_interval": 300 }
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
 * retransmit interval
 * @param {number} resend_interval unit: seconds
 * @example { "resend_interval": 300 }
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
 * fetch history
 * @param {object} fetch_history
 * @param {number} fetch_history.start_time
 * @param {number} fetch_history.end_time
 * @example { "fetch_history": { "start_time": 1609459200, "end_time": 1609545600 } }
 */
function fetchHistory(fetch_history) {
    var start_time = fetch_history.start_time;
    var end_time = fetch_history.end_time || 0;

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
