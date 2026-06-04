/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product EM500-CO2
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
    if ("collection_interval" in payload) {
        encoded = encoded.concat(setCollectionInterval(payload.collection_interval));
    }
    if ("report_interval" in payload) {
        encoded = encoded.concat(setReportInterval(payload.report_interval));
    }
    if ("report_status" in payload) {
        encoded = encoded.concat(reportStatus(payload.report_status));
    }
    if ("timestamp" in payload) {
        encoded = encoded.concat(setTimestamp(payload.timestamp));
    }
    if ("time_zone" in payload) {
        encoded = encoded.concat(setTimeZone(payload.time_zone));
    }
    if ("time_sync_enable" in payload) {
        encoded = encoded.concat(setTimeSyncEnable(payload.time_sync_enable));
    }
    if ("sync_time" in payload) {
        encoded = encoded.concat(syncTime(payload.sync_time));
    }
    if ("recollection_config" in payload) {
        encoded = encoded.concat(setRecollectionConfig(payload.recollection_config));
    }
    if ("gas_calibration_config" in payload) {
        encoded = encoded.concat(setGasCalibrationConfig(payload.gas_calibration_config));
    }
    if ("sensor_status" in payload) {
        encoded = encoded.concat(setSensorStatus(payload.sensor_status));
    }
    if ("co2_abc_calibration_schedule" in payload) {
        encoded = encoded.concat(setCO2AutoBackgroundCalibrationConfig(payload.co2_abc_calibration_schedule));
    }
    if ("altitude_calibration_settings" in payload) {
        encoded = encoded.concat(setAltitudeCalibrationConfig(payload.altitude_calibration_settings));
    }
    if ("sensor_function_config" in payload) {
        encoded = encoded.concat(setSensorFunctionConfig(payload.sensor_function_config));
    }
    if ("gas_alarm_config" in payload) {
        encoded = encoded.concat(setGasThresholdAlarmConfig(payload.gas_alarm_config));
    }
    if ("alarm_report_counts" in payload) {
        encoded = encoded.concat(alarmReportCounts(payload.alarm_report_counts));
    }
    if ("alarm_release_enable" in payload) {
        encoded = encoded.concat(setAlarmReleaseEnable(payload.alarm_release_enable));
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

    if ("retransmit_enable" in payload) {
        encoded = encoded.concat(setRetransmitEnable(payload.retransmit_enable));
    }
    if ("retransmit_interval" in payload) {
        encoded = encoded.concat(setRetransmitInterval(payload.retransmit_interval));
    }
    if ("resend_interval" in payload) {
        encoded = encoded.concat(setResendInterval(payload.resend_interval));
    }
    if ("stop_transmit" in payload) {
        encoded = encoded.concat(stopTransmit(payload.stop_transmit));
    }
    if ("history_enable" in payload) {
        encoded = encoded.concat(setHistoryEnable(payload.history_enable));
    }
    if ("fetch_history" in payload) {
        encoded = encoded.concat(fetchHistory(payload.fetch_history));
    }
    if ("clear_history" in payload) {
        encoded = encoded.concat(clearHistory(payload.clear_history));
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
 * set report interval
 * @param {number} report_interval unit: seconds
 * @example { "report_interval": 600 }
 */
function setReportInterval(report_interval) {
    if (typeof report_interval !== "number") {
        throw new Error("report_interval must be a number");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x03);
    buffer.writeUInt16LE(report_interval);
    return buffer.toBytes();
}

/**
 * report device status
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
 * set timestamp
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
 * set time sync enable
 * @param {number} time_sync_enable values: (0: disable, 1: enable)
 * @example { "time_sync_enable": 1 }
 */
function setTimeSyncEnable(time_sync_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(time_sync_enable) === -1) {
        throw new Error("time_sync_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x3b);
    buffer.writeUInt8(getValue(enable_map, time_sync_enable));
    return buffer.toBytes();
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
    return [0xff, 0x4a, 0xff];
}

/**
 * set recollection config
 * @param {object} recollection_config
 * @param {number} recollection_config.counts
 * @param {number} recollection_config.interval
 * @example { "recollection_config": { "counts": 3, "interval": 10 } }
 */
function setRecollectionConfig(recollection_config) {
    var counts = recollection_config.counts;
    var interval = recollection_config.interval;

    if (typeof counts !== "number") {
        throw new Error("recollection_config.counts must be a number");
    }
    if (typeof interval !== "number") {
        throw new Error("recollection_config.interval must be a number");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x1c);
    buffer.writeUInt8(counts);
    buffer.writeUInt8(interval);
    return buffer.toBytes();
}

/**
 * set Gas calibration config
 * @param {object} gas_calibration_config
 * @param {number} gas_calibration_config.type values: (0: Zero Calibration, 1: Target Calibration)
 * @param {number} gas_calibration_config.calibration_value
 * @example { "gas_calibration_config": { "type": 1, "calibration_value": 11.2 } }
 */
function setGasCalibrationConfig(gas_calibration_config) {
    var type = gas_calibration_config.type;
    var calibration_value = gas_calibration_config.calibration_value;

    var type_map = { 0: "Zero Calibration", 1: "Target Calibration" };
    var type_value = getMappedValue(type_map, type);
    if (type_value === 0) {
        calibration_value = 0;
    } else if (typeof calibration_value !== "number") {
        throw new Error("gas_calibration_config.calibration_value must be a number");
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x1a);
    buffer.writeUInt8(type_value);
    buffer.writeUInt32LE(Math.round(calibration_value * 1000));
    return buffer.toBytes();
}

/**
 * set sensor status
 * @param {object} sensor_status
 * @param {number} sensor_status.gas_type
 * @param {number} sensor_status.value
 * @param {number} sensor_status.range
 * @param {number} sensor_status.decimal range: [0, 15]
 * @param {number} sensor_status.status values: (0: normal, 1: warning, 2: error, 3: invalid/undetected)
 * @param {number} sensor_status.unit values: (0: ppm, 1: ppb, 2: %vol, 3: invalid)
 * @example { "sensor_status": { "gas_type": 1, "value": 11.2, "range": 100, "decimal": 1, "status": 0, "unit": 2 } }
 */
function setSensorStatus(sensor_status) {
    var gas_type = sensor_status.gas_type;
    var value = sensor_status.value;
    var range = sensor_status.range;
    var decimal = sensor_status.decimal;
    var status = sensor_status.status;
    var unit = sensor_status.unit;

    var gas_type_map = {
        0: "UNKNOWN",
        1: "O2",
        3: "H2S",
        5: "NH3",
        15: "C2H4",
        16: "VOC",
        17: "SMELL",
        23: "HCHO",
        24: "VOC",
        25: "CO",
        26: "Cl2",
        27: "H2",
        28: "H2S",
        29: "HCl",
        30: "HCN",
        31: "HF",
        32: "NH3",
        33: "NO2",
        34: "O2",
        35: "O3",
        36: "SO2",
        37: "HBr",
        38: "Br2",
        39: "F2",
        40: "PH3",
        41: "AsH3",
        42: "SiH4",
        43: "GeH4",
        44: "B2H6",
        45: "BF3",
        46: "WF6",
        47: "SiF4",
        48: "XeF2",
        49: "TiF4",
        50: "SMELL",
        51: "IAQ",
        52: "AQI",
        53: "NMHC",
        54: "SOx",
        55: "NOx",
        56: "NO",
        57: "C4H8",
        58: "C3H8O2",
        59: "CH4S",
        60: "C8H8",
        61: "C4H10",
        62: "C2H6",
        63: "C6H14",
        64: "ETO",
        65: "C3H9N",
        66: "C2H7N",
        67: "C2H6O",
        68: "CS2",
        69: "C2H6S",
        70: "C2H6S2",
        71: "C2H4",
        72: "CH3OH",
        73: "C6H6",
        74: "C8H10",
        75: "C7H8",
        76: "CH3COOH",
        77: "ClO2",
        78: "H2O2",
        79: "N2H4",
        80: "C2H8N2",
        81: "C2HCl3",
        82: "CHCl3",
        83: "C2H3Cl3",
        84: "H2Se",
        85: "LEL",
        86: "CO2",
        87: "PID_VOCS",
        208: "OTHERS",
    };
    var status_map = { 0: "normal", 1: "warning", 2: "error", 3: "invalid/undetected" };
    var unit_map = { 0: "ppm", 1: "ppb", 2: "%vol", 3: "invalid" };
    var gas_type_value = getMappedValue(gas_type_map, gas_type);
    if (typeof value !== "number") {
        throw new Error("sensor_status.value must be a number");
    }
    if (typeof range !== "number") {
        throw new Error("sensor_status.range must be a number");
    }
    if (typeof decimal !== "number" || decimal < 0 || decimal > 15) {
        throw new Error("sensor_status.decimal must be a number from 0 to 15");
    }
    var status_value = getMappedValue(status_map, status);
    var unit_value = getMappedValue(unit_map, unit);

    var flags = 0x00;
    flags |= decimal & 0x0f;
    flags |= status_value << 4;
    flags |= unit_value << 6;

    var buffer = new Buffer(10);
    buffer.writeUInt8(0x02);
    buffer.writeUInt8(0xbd);
    buffer.writeUInt8(gas_type_value);
    buffer.writeUInt32LE(Math.round(value * Math.pow(10, decimal)));
    buffer.writeUInt16LE(range);
    buffer.writeUInt8(flags);
    return buffer.toBytes();
}

/**
 * set CO2 auto background calibration schedule
 * @param {object} co2_abc_calibration_schedule
 * @param {number} co2_abc_calibration_schedule.enable values: (0: disable, 1: enable)
 * @param {number} co2_abc_calibration_schedule.period unit: minute, range: [1, 65534]
 * @param {number} co2_abc_calibration_schedule.calibration_value unit: ppm, range: [1, 65534]
 * @example { "co2_abc_calibration_schedule": { "enable": 1, "period": 3600, "calibration_value": 400 } }
 * @product AM319
 */
function setCO2AutoBackgroundCalibrationConfig(co2_abc_calibration_schedule) {
    var enable = co2_abc_calibration_schedule.enable;
    var period = co2_abc_calibration_schedule.period;
    var calibration_value = co2_abc_calibration_schedule.calibration_value;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) == -1) {
        throw new Error("co2_abc_calibration_schedule.enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x39);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt16LE(period);
    buffer.writeUInt16LE(calibration_value);
    return buffer.toBytes();
}

/**
 * set pressure calibration config
 * @param {object} altitude_calibration_settings
 * @param {number} altitude_calibration_settings.mode values: (0: disable, 1: auto, 2: manual)
 * @param {number} altitude_calibration_settings.calibration_value
 * @example { "altitude_calibration_settings": { "mode": 1, "calibration_value": 1000 } }
 */
function setAltitudeCalibrationConfig(altitude_calibration_settings) {
    var mode = altitude_calibration_settings.mode;
    var calibration_value = altitude_calibration_settings.calibration_value;

    var mode_map = { 0: "disable", 1: "auto", 2: "manual" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(mode) == -1) {
        throw new Error("altitude_calibration_settings.mode must be one of " + mode_values.join(", "));
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x87);
    buffer.writeUInt8(getValue(mode_map, mode));
    buffer.writeInt16LE(calibration_value);
    return buffer.toBytes();
}

/**
 * set sensor function config
 * @param {object} sensor_function_config
 * @param {number} sensor_function_config.temperature_enable values: (0: disable, 1: enable)
 * @param {number} sensor_function_config.humidity_enable values: (0: disable, 1: enable)
 * @param {number} sensor_function_config.pressure_enable values: (0: disable, 1: enable)
 * @param {number} sensor_function_config.co2_enable values: (0: disable, 1: enable)
 * @example { "sensor_function_config": { "temperature_enable": 1, "humidity_enable": 1, "pressure_enable": 1, "co2_enable": 1 } }
 */
function setSensorFunctionConfig(sensor_function_config) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);

    var data = [];
    var sensor_offset = { temperature_enable: 1, humidity_enable: 2, pressure_enable: 6, co2_enable: 5 };
    for (var key in sensor_offset) {
        if (key in sensor_function_config) {
            if (enable_values.indexOf(sensor_function_config[key]) == -1) {
                throw new Error("sensor_function_config." + key + " must be one of " + enable_values.join(", "));
            }

            data = data.concat([0xff, 0x18, sensor_offset[key], getValue(enable_map, sensor_function_config[key])]);
        }
    }

    return data;
}

/**
 * set gas threshold alarm config
 * @param {object} gas_alarm_config
 * @param {number} gas_alarm_config.enable values: (0: disable, 1: enable)
 * @param {number} gas_alarm_config.threshold_1
 * @param {number} gas_alarm_config.threshold_2
 * @example { "gas_alarm_config": { "enable": 1, "threshold_1": 100, "threshold_2": 200 } }
 */
function setGasThresholdAlarmConfig(gas_alarm_config) {
    var enable = gas_alarm_config.enable;
    var threshold_1 = gas_alarm_config.threshold_1;
    var threshold_2 = gas_alarm_config.threshold_2;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_value = getMappedValue(enable_map, enable);
    if (typeof threshold_1 !== "number") {
        throw new Error("gas_alarm_config.threshold_1 must be a number");
    }
    if (typeof threshold_2 !== "number") {
        throw new Error("gas_alarm_config.threshold_2 must be a number");
    }

    var buffer = new Buffer(11);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x54);
    buffer.writeUInt8(enable_value);
    buffer.writeUInt32LE(threshold_1);
    buffer.writeUInt32LE(threshold_2);
    return buffer.toBytes();
}

/**
 * alarm report counts
 * @since hardware_version v2.0, firmware_version v1.7
 * @param {number} alarm_report_counts
 * @example { "alarm_report_counts": 1000 }
 */
function alarmReportCounts(alarm_report_counts) {
    if (typeof alarm_report_counts !== "number") {
        throw new Error("alarm_report_counts must be a number");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xf2);
    buffer.writeUInt16LE(alarm_report_counts);
    return buffer.toBytes();
}

/**
 * set alarm release enable
 * @since hardware_version v2.0, firmware_version v1.7
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
 * d2d master configuration
 * @since hardware_version v2.0, firmware_version v1.7
 * @param {object} d2d_master_config
 * @param {number} d2d_master_config.mode values: (1: threshold_alarm, 2: threshold_alarm_release, 3: mutation_alarm)
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

    var mode_map = { 1: "threshold_alarm", 2: "threshold_alarm_release", 3: "mutation_alarm" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(mode) === -1) {
        throw new Error("d2d_master_config._item.mode must be one of " + mode_values.join(", "));
    }
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("d2d_master_config._item.enable must be one of " + enable_values.join(", "));
    }
    if (enable_values.indexOf(lora_uplink_enable) === -1) {
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
 * @since hardware_version v2.0, firmware_version v1.7
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
    if (!/^[0-9A-F]+$/.test(d2d_key)) {
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
 * @since hardware_version v2.0, firmware_version v1.7
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
 * @param {number} retransmit_interval unit: second
 * @example { "retransmit_interval": 60 }
 */
function setRetransmitInterval(retransmit_interval) {
    if (typeof retransmit_interval !== "number") {
        throw new Error("retransmit_interval must be a number");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x6a);
    buffer.writeUInt8(0x00);
    buffer.writeUInt16LE(retransmit_interval);
    return buffer.toBytes();
}

/**
 * resend interval
 * @param {number} resend_interval unit: second
 * @example { "resend_interval": 60 }
 */
function setResendInterval(resend_interval) {
    if (typeof resend_interval !== "number") {
        throw new Error("resend_interval must be a number");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x6a);
    buffer.writeUInt8(0x01);
    buffer.writeUInt16LE(resend_interval);
    return buffer.toBytes();
}

/**
 * history stop transmit
 * @param {number} stop_transmit values: (0: no, 1: yes)
 * @example { "stop_transmit": 1 }
 */
function stopTransmit(stop_transmit) {
    var enable_map = { 0: "no", 1: "yes" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(stop_transmit) === -1) {
        throw new Error("stop_transmit must be one of " + enable_values.join(", "));
    }

    if (getValue(enable_map, stop_transmit) === 0) {
        return [];
    }
    return [0xfd, 0x6d, 0xff];
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
 * @param {number} fetch_history.start_time
 * @param {number} fetch_history.end_time
 * @example { "fetch_history": { "start_time": 1609459200, "end_time": 1609545600 } }
 */
function fetchHistory(fetch_history) {
    var start_time = fetch_history.start_time;
    var end_time = fetch_history.end_time;

    if (typeof start_time !== "number") {
        throw new Error("fetch_history.start_time must be a number");
    }
    if (end_time && typeof end_time !== "number") {
        throw new Error("fetch_history.end_time must be a number");
    }
    if (end_time && start_time > end_time) {
        throw new Error("fetch_history.start_time must be less than fetch_history.end_time");
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
    var enable_map = { 0: "no", 1: "yes" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(clear_history) === -1) {
        throw new Error("clear_history must be one of " + enable_values.join(", "));
    }

    if (getValue(enable_map, clear_history) === 0) {
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

function getMappedValue(map, value) {
    if (typeof value === "number" && map[value] !== undefined) {
        return value;
    }
    return getValue(map, value);
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
