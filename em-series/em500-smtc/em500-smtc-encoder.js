/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product EM500-SMTC
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
    if ("report_status" in payload) {
        encoded = encoded.concat(reportStatus(payload.report_status));
    }
    if ("sync_time" in payload) {
        encoded = encoded.concat(syncTime(payload.sync_time));
    }
    if ("collection_interval" in payload) {
        encoded = encoded.concat(setCollectionInterval(payload.collection_interval));
    }
    if ("recollection_config" in payload) {
        encoded = encoded.concat(setRecollection(payload.recollection_config));
    }
    if ("report_interval" in payload) {
        encoded = encoded.concat(setReportInterval(payload.report_interval));
    }
    if ("timestamp" in payload) {
        encoded = encoded.concat(setTimestamp(payload.timestamp));
    }
    if ("time_zone" in payload) {
        encoded = encoded.concat(setTimeZone(payload.time_zone));
    }
    if ("sensor_all_enable" in payload) {
        encoded = encoded.concat(setSensorAllEnable(payload.sensor_all_enable));
    }
    if ("sensor_temperature_enable" in payload) {
        encoded = encoded.concat(setSensorTemperatureEnable(payload.sensor_temperature_enable));
    }
    if ("sensor_soil_moisture_enable" in payload) {
        encoded = encoded.concat(setSensorMoistureEnable(payload.sensor_soil_moisture_enable));
    }
    if ("sensor_conductivity_enable" in payload) {
        encoded = encoded.concat(setSensorElectricityEnable(payload.sensor_conductivity_enable));
    }
    if ("time_sync_enable" in payload) {
        encoded = encoded.concat(setTimeSyncEnable(payload.time_sync_enable));
    }
    if ("conductivity1_alarm_config" in payload) {
        encoded = encoded.concat(setElectricityAlarmConfig(payload.conductivity1_alarm_config, 1));
    }
    if ("conductivity2_alarm_config" in payload) {
        encoded = encoded.concat(setElectricityAlarmConfig(payload.conductivity2_alarm_config, 5));
    }
    if ("conductivity3_alarm_config" in payload) {
        encoded = encoded.concat(setElectricityAlarmConfig(payload.conductivity3_alarm_config, 9));
    }
    if ("temperature1_alarm_config" in payload) {
        encoded = encoded.concat(setTemperatureAlarmConfig(payload.temperature1_alarm_config, 2));
    }
    if ("temperature2_alarm_config" in payload) {
        encoded = encoded.concat(setTemperatureAlarmConfig(payload.temperature2_alarm_config, 6));
    }
    if ("temperature3_alarm_config" in payload) {
        encoded = encoded.concat(setTemperatureAlarmConfig(payload.temperature3_alarm_config, 10));
    }
    if ("temperature1_mutation_alarm_config" in payload) {
        encoded = encoded.concat(setTemperatureMutationAlarmConfig(payload.temperature1_mutation_alarm_config, 3));
    }
    if ("temperature2_mutation_alarm_config" in payload) {
        encoded = encoded.concat(setTemperatureMutationAlarmConfig(payload.temperature2_mutation_alarm_config, 7));
    }
    if ("temperature3_mutation_alarm_config" in payload) {
        encoded = encoded.concat(setTemperatureMutationAlarmConfig(payload.temperature3_mutation_alarm_config, 11));
    }
    if ("soil_moisture1_alarm_config" in payload) {
        encoded = encoded.concat(setMoistureAlarmConfig(payload.soil_moisture1_alarm_config, 4));
    }
    if ("soil_moisture2_alarm_config" in payload) {
        encoded = encoded.concat(setMoistureAlarmConfig(payload.soil_moisture2_alarm_config, 8));
    }
    if ("soil_moisture3_alarm_config" in payload) {
        encoded = encoded.concat(setMoistureAlarmConfig(payload.soil_moisture3_alarm_config, 12));
    }
    if ("alarm_release_enable" in payload) {
        encoded = encoded.concat(setThresholdAlarmReleaseEnable(payload.alarm_release_enable));
    }
    if ("alarm_report_counts" in payload) {
        encoded = encoded.concat(alarmReportCounts(payload.alarm_report_counts));
    }
    if ("temperature1_calibration_settings" in payload) {
        encoded = encoded.concat(setTemperatureCalibrationConfig(payload.temperature1_calibration_settings, 0x00));
    }
    if ("temperature2_calibration_settings" in payload) {
        encoded = encoded.concat(setTemperatureCalibrationConfig(payload.temperature2_calibration_settings, 0x03));
    }
    if ("temperature3_calibration_settings" in payload) {
        encoded = encoded.concat(setTemperatureCalibrationConfig(payload.temperature3_calibration_settings, 0x06));
    }
    if ("soil_moisture1_calibration_settings" in payload) {
        encoded = encoded.concat(setMoistureCalibrationConfig(payload.soil_moisture1_calibration_settings, 0x01));
    }
    if ("soil_moisture2_calibration_settings" in payload) {
        encoded = encoded.concat(setMoistureCalibrationConfig(payload.soil_moisture2_calibration_settings, 0x04));
    }
    if ("soil_moisture3_calibration_settings" in payload) {
        encoded = encoded.concat(setMoistureCalibrationConfig(payload.soil_moisture3_calibration_settings, 0x07));
    }
    if ("conductivity1_calibration_settings" in payload) {
        encoded = encoded.concat(setElectricityCalibrationConfig(payload.conductivity1_calibration_settings, 0x02));
    }
    if ("conductivity2_calibration_settings" in payload) {
        encoded = encoded.concat(setElectricityCalibrationConfig(payload.conductivity2_calibration_settings, 0x05));
    }
    if ("conductivity3_calibration_settings" in payload) {
        encoded = encoded.concat(setElectricityCalibrationConfig(payload.conductivity3_calibration_settings, 0x08));
    }
    if ("d2d_master_config" in payload) {
        for (var i = 0; i < payload.d2d_master_config.length; i++) {
            encoded = encoded.concat(setD2DMasterConfig(payload.d2d_master_config[i]));
        }
    }
    if ("d2d_enable" in payload) {
        encoded = encoded.concat(setD2DEnable(payload.d2d_enable));
    }
    if ("d2d_key" in payload) {
        encoded = encoded.concat(setD2DKey(payload.d2d_key));
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
    if ("retransmit_enable" in payload) {
        encoded = encoded.concat(setRetransmitEnable(payload.retransmit_enable));
    }
    if ("retransmit_interval" in payload) {
        encoded = encoded.concat(setRetransmitInterval(payload.retransmit_interval));
    }
    if ("resend_interval" in payload) {
        encoded = encoded.concat(setResendInterval(payload.resend_interval));
    }

    return encoded;
}

/**
 * reboot
 * @param {number} reboot values: (0: no, 1: yes)
 * @example { "reboot": 1 }
 */
function reboot(reboot) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var reboot_values = getValues(yes_no_map);
    if (reboot_values.indexOf(reboot) === -1) {
        throw new Error("reboot must be one of " + reboot_values.join(", "));
    }

    if (getValue(yes_no_map, reboot) === 0) {
        return [];
    }
    return [0xff, 0x10, 0xff];
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
 * sync time
 * @param {number} sync_time values：(0: no, 1: yes)
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
 * collection interval
 * @param {number} collection_interval unit: second, range: [60, 64800]
 * @example { "collection_interval": 60 }
 */
function setCollectionInterval(collection_interval) {
    if (typeof collection_interval !== "number") {
        throw new Error("collection_interval must be a number");
    }
    if (collection_interval < 60 || collection_interval > 64800) {
        throw new Error("collection_interval must be in range [60, 64800]");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x02);
    buffer.writeUInt16LE(collection_interval);
    return buffer.toBytes();
}

/**
 * recollection config
 * @param {object} recollection_config
 * @param {number} recollection_config.counts range: [1, 1000]
 * @param {number} recollection_config.interval range: [1, 65535]
 * @example { "recollection_config": { "counts": 2, "interval": 5 } }
 */
function setRecollection(recollection_config) {
    var counts = recollection_config.counts;
    var interval = recollection_config.interval;

    if (typeof counts !== "number") {
        throw new Error("recollection_config.counts must be a number");
    }
    if (counts < 1 || counts > 1000) {
        throw new Error("recollection_config.counts must be in range [1, 1000]");
    }
    if (typeof interval !== "number") {
        throw new Error("recollection_config.interval must be a number");
    }
    if (interval < 1 || interval > 65535) {
        throw new Error("recollection_config.interval must be in range [1, 65535]");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x1c);
    buffer.writeUInt8(counts);
    buffer.writeUInt8(interval);
    return buffer.toBytes();
}

/**
 * report interval configuration
 * @param {number} report_interval uint: second, range: [60, 64800]
 * @example payload: { "report_interval": 600 }
 */
function setReportInterval(report_interval) {
    if (typeof report_interval !== "number") {
        throw new Error("report_interval must be a number");
    }
    if (report_interval < 60 || report_interval > 64800) {
        throw new Error("report_interval must be in range [60, 64800]");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x03);
    buffer.writeUInt16LE(report_interval);
    return buffer.toBytes();
}

/**
 * timestamp
 * @param {number} timestamp unit: second
 * @example { "timestamp": 1717756800 }
 */
function setTimestamp(timestamp) {
    if (typeof timestamp !== "number") {
        throw new Error("timestamp must be a number");
    }
    if (timestamp < 0) {
        throw new Error("timestamp must be greater than 0");
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x11);
    buffer.writeUInt32LE(timestamp);
    return buffer.toBytes();
}

/**
 * set time zone
 * @param {number} time_zone unit: minute, UTC+8 -> 8 * 10 = 80
 * @example { "time_zone": 80 }
 */
function setTimeZone(time_zone) {
    var timezone_map = { "-120": "UTC-12", "-110": "UTC-11", "-100": "UTC-10", "-95": "UTC-9:30", "-90": "UTC-9", "-80": "UTC-8", "-70": "UTC-7", "-60": "UTC-6", "-50": "UTC-5", "-40": "UTC-4", "-35": "UTC-3:30", "-30": "UTC-3", "-20": "UTC-2", "-10": "UTC-1", 0: "UTC", 10: "UTC+1", 20: "UTC+2", 30: "UTC+3", 35: "UTC+3:30", 40: "UTC+4", 45: "UTC+4:30", 50: "UTC+5", 55: "UTC+5:30", 57: "UTC+5:45", 60: "UTC+6", 65: "UTC+6:30", 70: "UTC+7", 80: "UTC+8", 90: "UTC+9", 95: "UTC+9:30", 100: "UTC+10", 105: "UTC+10:30", 110: "UTC+11", 120: "UTC+12", 127: "UTC+12:45", 130: "UTC+13", 140: "UTC+14" };
    var timezone_values = getValues(timezone_map);
    if (timezone_values.indexOf(time_zone) === -1) {
        throw new Error("time_zone must be one of " + timezone_values.join(", "));
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x17);
    buffer.writeInt16LE(getValue(timezone_map, time_zone));
    return buffer.toBytes();
}

/**
 * sensor all enable
 * @param {object} sensor_all_enable
 * @param {number} sensor_all_enable.temperature values: (0: disable, 1: enable)
 * @param {number} sensor_all_enable.soil_moisture values: (0: disable, 1: enable)
 * @param {number} sensor_all_enable.conductivity values: (0: disable, 1: enable)
 * @example { "sensor_all_enable": {"temperature": 1, "soil_moisture": 1, "conductivity": 1} }
 */
function setSensorAllEnable(sensor_all_enable) {
    var temperature = sensor_all_enable.temperature;
    var soil_moisture = sensor_all_enable.soil_moisture;
    var conductivity = sensor_all_enable.conductivity;
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(temperature) == -1) {
        throw new Error("sensor_all_enable.temperature must be one of " + enable_values.join(", "));
    }
    if (enable_values.indexOf(soil_moisture) == -1) {
        throw new Error("sensor_all_enable.soil_moisture must be one of " + enable_values.join(", "));
    }
    if (enable_values.indexOf(conductivity) == -1) {
        throw new Error("sensor_all_enable.conductivity must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x18);
    buffer.writeUInt8(0x00); // all
    buffer.writeUInt8(getValue(enable_map, temperature) | (getValue(enable_map, soil_moisture) << 1) | (getValue(enable_map, conductivity) << 2));
    return buffer.toBytes();
}

/**
 * sensor temperature enable
 * @param {number} sensor_temperature_enable values: (0: disable, 1: enable)
 * @example { "sensor_temperature_enable": 1 }
 */
function setSensorTemperatureEnable(sensor_temperature_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(sensor_temperature_enable) == -1) {
        throw new Error("sensor_temperature_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x18);
    buffer.writeUInt8(0x01); // temperature
    buffer.writeUInt8(getValue(enable_map, sensor_temperature_enable));
    return buffer.toBytes();
}

/**
 * sensor moisture enable
 * @param {number} sensor_moisture_enable values: (0: disable, 1: enable)
 * @example { "sensor_moisture_enable": 1 }
 */
function setSensorMoistureEnable(sensor_moisture_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(sensor_moisture_enable) == -1) {
        throw new Error("sensor_moisture_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x18);
    buffer.writeUInt8(0x02); // moisture
    buffer.writeUInt8(getValue(enable_map, sensor_moisture_enable));
    return buffer.toBytes();
}

/**
 * sensor electricity enable
 * @param {number} sensor_electricity_enable values: (0: disable, 1: enable)
 * @example { "sensor_electricity_enable": 1 }
 */
function setSensorElectricityEnable(sensor_electricity_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(sensor_electricity_enable) == -1) {
        throw new Error("sensor_electricity_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x18);
    buffer.writeUInt8(0x03); // electricity
    buffer.writeUInt8(getValue(enable_map, sensor_electricity_enable));
    return buffer.toBytes();
}

/**
 * time sync configuration
 * @param {number} time_sync_enable values: (0: disable, 1: enable)
 * @example { "time_sync_enable": 1 }
 */
function setTimeSyncEnable(time_sync_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(time_sync_enable) == -1) {
        throw new Error("time_sync_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x3b);
    buffer.writeUInt8(getValue(enable_map, time_sync_enable));
    return buffer.toBytes();
}

/**
 * conductivity alarm configuration
 * @param {object} conductivity_alarm_config
 * @param {number} conductivity_alarm_config.enable values: (0: disable, 1: enable)
 * @param {number} conductivity_alarm_config.condition values: (0: disable, 1: below, 2: above, 3: within, 4: below or above)
 * @param {number} conductivity_alarm_config.threshold_min condition=(below, within, below or above)
 * @param {number} conductivity_alarm_config.threshold_max condition=(above, within, below or above)
 * @param {number} id values: (1, 5, 9)
 * @example { "conductivity_alarm_config": { "enable": 1, "condition": 1, "threshold_min": 0.05, "threshold_max": 0.1 } }
 */
function setElectricityAlarmConfig(conductivity_alarm_config, id) {
    var condition = conductivity_alarm_config.condition;
    var enable = conductivity_alarm_config.enable;
    var threshold_min = conductivity_alarm_config.threshold_min;
    var threshold_max = conductivity_alarm_config.threshold_max;

    var condition_map = { 0: "disable", 1: "below", 2: "above", 3: "within", 4: "below or above" };
    var condition_values = getValues(condition_map);
    if (condition_values.indexOf(condition) === -1) {
        throw new Error("conductivity_alarm_config.condition must be one of " + condition_values.join(", "));
    }
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("conductivity_alarm_config.enable must be one of " + enable_values.join(", "));
    }

    var data = 0x00;
    data |= getValue(condition_map, condition);
    data |= id << 3; // conductivity
    data |= getValue(enable_map, enable) << 7;

    var buffer = new Buffer(11);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x06);
    buffer.writeUInt8(data);
    buffer.writeUInt16LE(threshold_min * 100);
    buffer.writeUInt16LE(threshold_max * 100);
    buffer.writeUInt16LE(0x00);
    buffer.writeUInt16LE(0x00);
    return buffer.toBytes();
}

/**
 * temperature alarm configuration
 * @param {object} temperature_alarm_config
 * @param {number} temperature_alarm_config.enable values: (0: disable, 1: enable)
 * @param {number} temperature_alarm_config.condition values: (0: disable, 1: below, 2: above, 3: within, 4: below or above)
 * @param {number} temperature_alarm_config.threshold_min condition=(below, within, below or above)
 * @param {number} temperature_alarm_config.threshold_max condition=(above, within, below or above)
 * @param {number} id values: (2, 6, 10)
 * @example { "temperature_alarm_config": { "enable": 1, "condition": 1, "threshold_min": 5.0, "threshold_max": 10.0 } }
 */
function setTemperatureAlarmConfig(temperature_alarm_config, id) {
    var condition = temperature_alarm_config.condition;
    var enable = temperature_alarm_config.enable;
    var threshold_min = temperature_alarm_config.threshold_min;
    var threshold_max = temperature_alarm_config.threshold_max;

    var condition_map = { 0: "disable", 1: "below", 2: "above", 3: "within", 4: "below or above" };
    var condition_values = getValues(condition_map);
    if (condition_values.indexOf(condition) === -1) {
        throw new Error("temperature_alarm_config.condition must be one of " + condition_values.join(", "));
    }
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("temperature_alarm_config.enable must be one of " + enable_values.join(", "));
    }

    var data = 0x00;
    data |= getValue(condition_map, condition);
    data |= id << 3; // temperature
    data |= getValue(enable_map, enable) << 7;

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
 * @param {number} temperature_mutation_alarm_config.mutation unit: °C, condition=(5: mutation)
 * @param {number} id values: (3, 7, 11)
 * @example { "temperature_mutation_alarm_config": { "enable": 1, "mutation": 100 } }
 */
function setTemperatureMutationAlarmConfig(temperature_mutation_alarm_config, id) {
    var enable = temperature_mutation_alarm_config.enable;
    var mutation = temperature_mutation_alarm_config.mutation;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("temperature_mutation_alarm_config.enable must be one of " + enable_values.join(", "));
    }

    var data = 0x00;
    data |= id << 3; // temperature mutation
    data |= getValue(enable_map, enable) << 7;
    data |= 5; // condition: mutation

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
 * soil moisture alarm configuration
 * @param {object} soil_moisture_alarm_config
 * @param {number} soil_moisture_alarm_config.enable values: (0: disable, 1: enable)
 * @param {number} soil_moisture_alarm_config.condition values: (0: disable, 1: below, 2: above, 3: within, 4: below or above)
 * @param {number} soil_moisture_alarm_config.threshold_min condition=(below, within, below or above)
 * @param {number} soil_moisture_alarm_config.threshold_max condition=(above, within, below or above)
 * @param {number} id values: (4, 8, 12)
 * @example { "soil_moisture_alarm_config": { "enable": 1, "condition": 1, "threshold_min": 5.0, "threshold_max": 10.0 } }
 */
function setMoistureAlarmConfig(soil_moisture_alarm_config, id) {
    var condition = soil_moisture_alarm_config.condition;
    var enable = soil_moisture_alarm_config.enable;
    var threshold_min = soil_moisture_alarm_config.threshold_min;
    var threshold_max = soil_moisture_alarm_config.threshold_max;

    var condition_map = { 0: "disable", 1: "below", 2: "above", 3: "within", 4: "below or above" };
    var condition_values = getValues(condition_map);
    if (condition_values.indexOf(condition) === -1) {
        throw new Error("soil_moisture_alarm_config.condition must be one of " + condition_values.join(", "));
    }
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("soil_moisture_alarm_config.enable must be one of " + enable_values.join(", "));
    }

    var data = 0x00;
    data |= getValue(condition_map, condition);
    data |= id << 3; // moisture
    data |= getValue(enable_map, enable) << 7;

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
 * all rule engine threshold alarm release enable
 * @param {number} alarm_release_enable values: (0: disable, 1: enable)
 * @example { "alarm_release_enable": 1 }
 */
function setThresholdAlarmReleaseEnable(alarm_release_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(alarm_release_enable) === -1) {
        throw new Error("alarm_release_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xf5);
    buffer.writeUInt8(getValue(enable_map, alarm_release_enable));
    return buffer.toBytes();
}

/**
 * alarm report counts
 * @param {number} alarm_report_counts, range: [1, 1000]
 * @example { "alarm_report_counts": 1000 }
 */
function alarmReportCounts(alarm_report_counts) {
    if (typeof alarm_report_counts !== "number") {
        throw new Error("alarm_report_counts must be a number");
    }
    if (alarm_report_counts < 1 || alarm_report_counts > 1000) {
        throw new Error("alarm_report_counts must be between 1 and 1000");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xf2);
    buffer.writeUInt16LE(alarm_report_counts);
    return buffer.toBytes();
}

/**
 * temperature calibration
 * @param {object} temperature_calibration_settings
 * @param {number} temperature_calibration_settings.enable values: (0: disable, 1: enable)
 * @param {number} temperature_calibration_settings.calibration_value
 * @param {number} type values: (0x00, 0x03, 0x06)
 * @example { "temperature_calibration_settings": { "enable": 1, "calibration_value": 23 } }
 */
function setTemperatureCalibrationConfig(temperature_calibration_settings, type) {
    var enable = temperature_calibration_settings.enable;
    var calibration_value = temperature_calibration_settings.calibration_value;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("temperature_calibration_settings.enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xf1);
    buffer.writeUInt8(type); // temperature
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeInt16LE(calibration_value * 10);
    return buffer.toBytes();
}

/**
 * soil moisture calibration
 * @param {object} soil_moisture_calibration_settings
 * @param {number} soil_moisture_calibration_settings.enable values: (0: disable, 1: enable)
 * @param {number} soil_moisture_calibration_settings.calibration_value
 * @param {number} type values: (0x01, 0x04, 0x07)
 * @example { "soil_moisture_calibration_settings": { "enable": 1, "calibration_value": 23 } }
 */
function setMoistureCalibrationConfig(soil_moisture_calibration_settings, type) {
    var enable = soil_moisture_calibration_settings.enable;
    var calibration_value = soil_moisture_calibration_settings.calibration_value;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("soil_moisture_calibration_settings.enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xf1);
    buffer.writeUInt8(type); // soil moisture
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeInt16LE(calibration_value * 10);
    return buffer.toBytes();
}

/**
 * conductivity calibration
 * @param {object} conductivity_calibration_settings
 * @param {number} conductivity_calibration_settings.enable values: (0: disable, 1: enable)
 * @param {number} conductivity_calibration_settings.calibration_value
 * @param {number} type values: (0x02, 0x05, 0x08)
 * @example { "conductivity_calibration_settings": { "enable": 1, "calibration_value": 23 } }
 */
function setElectricityCalibrationConfig(conductivity_calibration_settings, type) {
    var enable = conductivity_calibration_settings.enable;
    var calibration_value = conductivity_calibration_settings.calibration_value;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("conductivity_calibration_settings.enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xf1);
    buffer.writeUInt8(type); // conductivity
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeInt16LE(calibration_value * 100);
    return buffer.toBytes();
}

/**
 * d2d master configuration
 * @param {object} d2d_master_config
 * @param {number} d2d_master_config.mode values: (
        1: threshold1_alarm, 
        2: threshold1_alarm_release, 
        3: mutation1_alarm, 
        4: conductivity1_alarm, 
        5: conductivity1_alarm_release, 
        6: soil_moisture1_alarm, 
        7: soil_moisture1_alarm_release,
        8: threshold2_alarm, 
        9: threshold2_alarm_release, 
        10: mutation2_alarm, 
        11: conductivity2_alarm, 
        12: conductivity2_alarm_release, 
        13: soil_moisture2_alarm ,
        14: soil_moisture2_alarm_release,
        15: threshold3_alarm, 
        16: threshold3_alarm_release, 
        17: mutation3_alarm, 
        18: conductivity3_alarm, 
        19: conductivity3_alarm_release, 
        20: soil_moisture3_alarm ,
        21: soil_moisture3_alarm_release
)
 * @param {number} d2d_master_config.enable values: (0: disable, 1: enable)
 * @param {string} d2d_master_config.d2d_cmd
 * @param {number} d2d_master_config.lora_uplink_enable values: (0: disable, 1: enable)
 * @example { "d2d_master_config": [{ "mode": 0, "enable": 1, "d2d_cmd": "0000", "lora_uplink_enable": 1 }] }
 */
function setD2DMasterConfig(d2d_master_config) {
    var mode = d2d_master_config.mode;
    var enable = d2d_master_config.enable;
    var d2d_cmd = d2d_master_config.d2d_cmd;
    var lora_uplink_enable = d2d_master_config.lora_uplink_enable;

    var mode_map = { 
        1: "threshold1_alarm", 
        2: "threshold1_alarm_release", 
        3: "mutation1_alarm", 
        4: "conductivity1_alarm", 
        5: "conductivity1_alarm_release", 
        6: "soil_moisture1_alarm", 
        7: "soil_moisture1_alarm_release",
        8: "threshold2_alarm", 
        9: "threshold2_alarm_release", 
        10: "mutation2_alarm", 
        11: "conductivity2_alarm", 
        12: "conductivity2_alarm_release", 
        13: "soil_moisture2_alarm",
        14: "soil_moisture2_alarm_release",
        15: "threshold3_alarm", 
        16: "threshold3_alarm_release", 
        17: "mutation3_alarm", 
        18: "conductivity3_alarm", 
        19: "conductivity3_alarm_release", 
        20: "soil_moisture3_alarm",
        21: "soil_moisture3_alarm_release"
    };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(mode) === -1) {
        throw new Error("d2d_master_config._item.mode must be one of " + mode_values.join(", "));
    }
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("d2d_master_config._item.enable must be one of " + enable_values.join(", "));
    }
    if (enable && enable_values.indexOf(lora_uplink_enable) === -1) {
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
 * d2d key
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

Buffer.prototype.toBytes = function () {
    return this.buffer;
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

function hexStringToBytes(hex) {
    var bytes = [];
    for (var c = 0; c < hex.length; c += 2) {
        bytes.push(parseInt(hex.substr(c, 2), 16));
    }
    return bytes;
}
