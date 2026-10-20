/**
 * Payload Decoder
 *
 * Copyright 2026 Milesight IoT
 *
 * @product WT103
 */
var RAW_VALUE = 0x00;

/* eslint no-redeclare: "off" */
/* eslint-disable */
// Chirpstack v4
function decodeUplink(input) {
    var decoded = milesightDeviceDecode(input.bytes);
    return { data: decoded };
}

// Chirpstack v3
function Decode(fPort, bytes) {
    return milesightDeviceDecode(bytes);
}

// The Things Network
function Decoder(bytes, port) {
    return milesightDeviceDecode(bytes);
}
/* eslint-enable */

function milesightDeviceDecode(bytes) {
    var decoded = {};

    for (var i = 0; i < bytes.length; ) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];

        // BOOT EVENT
        if (channel_id === 0xff && channel_type === 0x0b) {
            decoded.boot_event = readYesNoStatus(1);
            i += 1;
        }
        // IPSO VERSION
        else if (channel_id === 0xff && channel_type === 0x01) {
            decoded.ipso_version = readProtocolVersion(bytes[i]);
            i += 1;
        }
        // TSL VERSION
        else if (channel_id === 0xff && channel_type === 0xff) {
            decoded.tsl_version = readTslVersion(bytes.slice(i, i + 2));
            i += 2;
        }
        // SERIAL NUMBER (12-digit)
        else if (channel_id === 0xff && channel_type === 0x08) {
            decoded.sn = readSerialNumber(bytes.slice(i, i + 6));
            i += 6;
        }
        // SERIAL NUMBER (16-digit)
        else if (channel_id === 0xff && channel_type === 0x16) {
            decoded.sn = readSerialNumber(bytes.slice(i, i + 8));
            i += 8;
        }
        // HARDWARE VERSION
        else if (channel_id === 0xff && channel_type === 0x09) {
            decoded.hardware_version = readHardwareVersion(bytes.slice(i, i + 2));
            i += 2;
        }
        // FIRMWARE VERSION
        else if (channel_id === 0xff && channel_type === 0x0a) {
            decoded.firmware_version = readFirmwareVersion(bytes.slice(i, i + 2));
            i += 2;
        }
        // LORAWAN CLASS TYPE
        else if (channel_id === 0xff && channel_type === 0x0f) {
            decoded.lorawan_class = readLoRaWANClass(bytes[i]);
            i += 1;
        }
        // TSL CONFIG REQUEST
        else if (channel_id === 0xff && channel_type === 0xfe) {
            decoded.tsl_config_request = readYesNoStatus(1);
            i += 1;
        }
        // BATTERY
        else if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = readUInt8(bytes[i]);
            i += 1;
        }
        // AMBIENT TEMPERATURE
        else if (channel_id === 0x03 && channel_type === 0x67) {
            decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 100;
            i += 2;
        }
        // TARGET TEMPERATURE
        else if (channel_id === 0x04 && channel_type === 0x67) {
            decoded.temperature_target = readInt16LE(bytes.slice(i, i + 2)) / 100;
            i += 2;
        }
        // VALVE OPENING
        else if (channel_id === 0x05 && channel_type === 0x92) {
            decoded.valve_opening = readUInt8(bytes[i]);
            i += 1;
        }
        // TEMPERATURE CONTROL LEVEL
        else if (channel_id === 0x06 && channel_type === 0xcb) {
            decoded.level = readUInt8(bytes[i]);
            i += 1;
        }
        // OPEN WINDOW DETECTION STATUS
        else if (channel_id === 0x07 && channel_type === 0x00) {
            decoded.open_window_detection = readOpenWindowDetectionStatus(bytes[i]);
            i += 1;
        }
        // MOTOR CALIBRATION STATUS
        else if (channel_id === 0x08 && channel_type === 0xe5) {
            decoded.motor_calibration_status = readMotorCalibrationStatus(bytes[i]);
            i += 1;
        }
        // MOTOR STROKE
        else if (channel_id === 0x09 && channel_type === 0x90) {
            decoded.motor_stroke = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // FREEZE PROTECTION STATUS
        else if (channel_id === 0x0a && channel_type === 0x00) {
            decoded.freeze_protection_status = readFreezeProtectionStatus(bytes[i]);
            i += 1;
        }
        // MOTOR POSITION
        else if (channel_id === 0x0b && channel_type === 0x90) {
            decoded.motor_position = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // TARGET VALVE OPENING
        else if (channel_id === 0x0c && channel_type === 0x92) {
            decoded.valve_opening_target = readUInt8(bytes[i]);
            i += 1;
        }
        // PERIODIC PACKET: 0-5 SCALE MODE
        else if (channel_id === 0x10 && channel_type === 0xc0) {
            decoded.battery = readUInt8(bytes[i]);
            decoded.valve_opening = readUInt8(bytes[i + 1]);
            decoded.temperature = readInt16LE(bytes.slice(i + 2, i + 4)) / 100;
            decoded.temperature_target = readInt16LE(bytes.slice(i + 4, i + 6)) / 100;
            decoded.level = readUInt8(bytes[i + 6]);
            i += 7;
        }
        // PERIODIC PACKET: INTEGRATED CONTROL MODE
        else if (channel_id === 0x11 && channel_type === 0xc1) {
            decoded.battery = readUInt8(bytes[i]);
            decoded.valve_opening = readUInt8(bytes[i + 1]);
            decoded.temperature = readInt16LE(bytes.slice(i + 2, i + 4)) / 100;
            decoded.temperature_target = readInt16LE(bytes.slice(i + 4, i + 6)) / 100;
            i += 6;
        }
        // PERIODIC PACKET: VALVE OPENING CONTROL MODE
        else if (channel_id === 0x12 && channel_type === 0xc2) {
            decoded.battery = readUInt8(bytes[i]);
            decoded.valve_opening = readUInt8(bytes[i + 1]);
            decoded.temperature = readInt16LE(bytes.slice(i + 2, i + 4)) / 100;
            decoded.valve_opening_target = readUInt8(bytes[i + 4]);
            i += 5;
        }
        // PERIODIC PACKET: NON-HEATING SEASON
        else if (channel_id === 0x13 && channel_type === 0xc3) {
            decoded.battery = readUInt8(bytes[i]);
            decoded.valve_opening = readUInt8(bytes[i + 1]);
            i += 2;
        }
        // PERIODIC PACKET: 0-5 SCALE MODE (V1.2, WITH REPORT REASON)
        else if (channel_id === 0x14 && channel_type === 0xd0) {
            decoded.battery = readUInt8(bytes[i]);
            decoded.valve_opening = readUInt8(bytes[i + 1]);
            decoded.temperature = readInt16LE(bytes.slice(i + 2, i + 4)) / 100;
            decoded.temperature_target = readInt16LE(bytes.slice(i + 4, i + 6)) / 100;
            decoded.level = readUInt8(bytes[i + 6]);
            decoded.report_reason = readReportReason(bytes[i + 7]);
            i += 8;
        }
        // PERIODIC PACKET: INTEGRATED CONTROL MODE (V1.2, WITH REPORT REASON)
        else if (channel_id === 0x15 && channel_type === 0xd1) {
            decoded.battery = readUInt8(bytes[i]);
            decoded.valve_opening = readUInt8(bytes[i + 1]);
            decoded.temperature = readInt16LE(bytes.slice(i + 2, i + 4)) / 100;
            decoded.temperature_target = readInt16LE(bytes.slice(i + 4, i + 6)) / 100;
            decoded.report_reason = readReportReason(bytes[i + 6]);
            i += 7;
        }
        // PERIODIC PACKET: VALVE OPENING CONTROL MODE (V1.2, WITH REPORT REASON)
        else if (channel_id === 0x16 && channel_type === 0xd2) {
            decoded.battery = readUInt8(bytes[i]);
            decoded.valve_opening = readUInt8(bytes[i + 1]);
            decoded.temperature = readInt16LE(bytes.slice(i + 2, i + 4)) / 100;
            decoded.valve_opening_target = readUInt8(bytes[i + 4]);
            decoded.report_reason = readReportReason(bytes[i + 5]);
            i += 6;
        }
        // PERIODIC PACKET: NON-HEATING SEASON (V1.2, WITH REPORT REASON)
        else if (channel_id === 0x17 && channel_type === 0xd3) {
            decoded.battery = readUInt8(bytes[i]);
            decoded.valve_opening = readUInt8(bytes[i + 1]);
            decoded.report_reason = readReportReason(bytes[i + 2]);
            i += 3;
        }
        // TEMPERATURE ALARM
        else if (channel_id === 0x83 && channel_type === 0x67) {
            decoded.temperature_alarm = decoded.temperature_alarm || {};
            decoded.temperature_alarm.temperature = readInt16LE(bytes.slice(i, i + 2)) / 100;
            decoded.temperature_alarm.alarm = readTemperatureAlarmType(bytes[i + 2]);
            i += 3;
        }
        // VALVE DESCALE RESULT
        else if (channel_id === 0x84 && channel_type === 0x92) {
            decoded.valve_descale_result = decoded.valve_descale_result || {};
            decoded.valve_descale_result.valve_opening = readUInt8(bytes[i]);
            decoded.valve_descale_result.trigger_source = readDescaleTriggerSource(bytes[i + 1]);
            decoded.valve_descale_result.result = readDescaleResult(bytes[i + 2]);
            decoded.valve_descale_result.fail_reason = readDescaleFailReason(bytes[i + 3]);
            i += 4;
        }
        // OPEN WINDOW EVENT
        else if (channel_id === 0x85 && channel_type === 0x67) {
            decoded.open_window_event = decoded.open_window_event || {};
            decoded.open_window_event.temperature = readInt16LE(bytes.slice(i, i + 2)) / 100;
            decoded.open_window_event.status = readOpenWindowEventStatus(bytes[i + 2]);
            i += 3;
        }
        // FROST PROTECTION EVENT
        else if (channel_id === 0x86 && channel_type === 0x67) {
            decoded.frost_protection_event = decoded.frost_protection_event || {};
            decoded.frost_protection_event.temperature = readInt16LE(bytes.slice(i, i + 2)) / 100;
            decoded.frost_protection_event.status = readFrostProtectionEventStatus(bytes[i + 2]);
            decoded.frost_protection_event.valve_opening = readUInt8(bytes[i + 3]);
            i += 4;
        }
        // TEMPERATURE SOURCE FAULT
        else if (channel_id === 0x87 && channel_type === 0x00) {
            decoded.temperature_source_fault = readTemperatureSourceFaultStatus(bytes[i]);
            i += 1;
        }
        // LOW BATTERY STATUS
        else if (channel_id === 0x88 && channel_type === 0x00) {
            decoded.low_battery_status = readLowBatteryStatus(bytes[i]);
            i += 1;
        }
        // LORAWAN JOIN MODE (V1.2)
        else if (channel_id === 0xf9 && channel_type === 0x54) {
            decoded.lorawan_join_mode = readJoinMode(bytes[i]);
            i += 1;
        }
        // LORAWAN DR (V1.2)
        else if (channel_id === 0xf9 && channel_type === 0x55) {
            decoded.lorawan_dr = readUInt8(bytes[i]);
            i += 1;
        }
        // LORAWAN ADR (V1.2)
        else if (channel_id === 0xf9 && channel_type === 0x56) {
            decoded.lorawan_adr = readEnableStatus(bytes[i]);
            i += 1;
        }
        // BATTERY VOLTAGE (V1.2)
        else if (channel_id === 0xf9 && channel_type === 0x57) {
            var voltage = readUInt16LE(bytes.slice(i, i + 2));
            decoded.battery_voltage = voltage === 0xffff ? "collection_err" : voltage;
            i += 2;
        }
        // CONFIGURATION REPORT (device reports stored config values, V1.2 2.46)
        else if ((channel_id === 0xff || channel_id === 0xf9) && CONFIG_RESPONSE_DATA_LENGTHS[channel_type] !== undefined) {
            var report = handle_config_report(channel_id, channel_type, bytes, i);
            decoded = Object.assign(decoded, report.data);
            i = report.offset;
        }
        // DOWNLINK RESPONSE (CONFIGURATION ACK: 0xFE echo / 0xF9-configuration reply)
        else if (channel_id === 0xfe || channel_id === 0xf8) {
            var result = handle_downlink_response(channel_id, channel_type, bytes, i);
            decoded = Object.assign(decoded, result.data);
            i = result.offset;
        } else {
            break;
        }
    }

    return decoded;
}

// data lengths of configuration commands documented to echo a confirmation
// (0xFE echo carries the original data only; 0xF8 reply appends one status byte)
var CONFIG_RESPONSE_DATA_LENGTHS = {
    0x04: 1, 0x05: 3, 0x06: 9, 0x25: 1, 0x29: 1,
    0x32: 2, 0x33: 4, 0x34: 9, 0x35: 4, 0x36: 1, 0x37: 1, 0x3a: 1, 0x3b: 1,
    0x3c: 1, 0x3d: 1, 0x3e: 1, 0x40: 1, 0x41: 2, 0x42: 1, 0x43: 3, 0x44: 1,
    0x45: 1, 0x46: 1, 0x47: 1, 0x49: 2, 0x4a: 1, 0x4b: 2, 0x4c: 1, 0x4d: 1,
    0x4e: 2, 0x4f: 1, 0x50: 2, 0x51: 1, 0x52: 6, 0x53: 3, 0x57: 1, 0x8e: 3,
    0xab: 3, 0xac: 1, 0xad: 1, 0xae: 1, 0xaf: 5, 0xb0: 3, 0xb1: 2, 0xb3: 1,
    0xb4: 1, 0xba: 10, 0xbd: 2, 0xc4: 2, 0xc5: 1, 0xf8: 1
};

function handle_config_report(channel_id, channel_type, bytes, offset) {
    var decoded = {};
    var data_length = CONFIG_RESPONSE_DATA_LENGTHS[channel_type];
    if (data_length === undefined) {
        return { data: decoded, offset: bytes.length };
    }

    var d = bytes.slice(offset, offset + data_length);
    offset += data_length;

    switch (channel_type) {
        case 0x06:
            decoded.temperature_threshold_alarm = {
                mode: readUInt8(d[0]),
                min: readInt16LE(d.slice(1, 3)) / 100,
                max: readInt16LE(d.slice(3, 5)) / 100,
            };
            break;
        case 0x25:
            decoded.child_lock = readUInt8(d[0]);
            break;
        case 0x32:
            decoded.non_heating_report_interval = readUInt16LE(d.slice(0, 2));
            break;
        case 0x33:
            decoded.heating_date = {
                start_month: readUInt8(d[0]),
                start_day: readUInt8(d[1]),
                end_month: readUInt8(d[2]),
                end_day: readUInt8(d[3]),
            };
            break;
        case 0x34:
            var sched_ctrl = readUInt8(d[0]);
            var sched_mode = readUInt8(d[1]);
            var sched_value = readInt16LE(d.slice(2, 4));
            decoded.heating_schedule = {
                id: (sched_ctrl >> 4) & 0x0f,
                enable: sched_ctrl & 0x0f,
                mode: sched_mode,
                value: sched_mode === 1 ? sched_value / 100 : sched_value,
                period: readUInt16LE(d.slice(4, 6)),
                time: readUInt16LE(d.slice(6, 8)),
                week_mask: readUInt8(d[8]),
            };
            break;
        case 0x35:
            decoded.target_temperature_range = {
                min: readInt16LE(d.slice(0, 2)) / 100,
                max: readInt16LE(d.slice(2, 4)) / 100,
            };
            break;
        case 0x36:
            decoded.display_ambient_temperature = readEnableStatus(d[0]);
            break;
        case 0x37:
            decoded.open_window_valve_strategy = readUInt8(d[0]);
            break;
        case 0x3a:
            decoded.change_report_enable = readEnableStatus(d[0]);
            break;
        case 0x3b:
            if (channel_id === 0xff) {
                decoded.time_sync_enable = d[0] === 0x02 ? "enable" : "disable";
            } else {
                decoded.non_heating_valve_mode = readUInt8(d[0]);
            }
            break;
        case 0x3c:
            decoded.valve_descale_enable = readEnableStatus(d[0]);
            break;
        case 0x3d:
            decoded.installation_mode = readUInt8(d[0]);
            break;
        case 0x3e:
            decoded.temperature_unit = readUInt8(d[0]);
            break;
        case 0x40:
            decoded.ambient_temperature_display_time = readUInt8(d[0]);
            break;
        case 0x41:
            decoded.platform_algorithm_timeout = readUInt16LE(d.slice(0, 2));
            break;
        case 0x42:
            decoded.platform_algorithm_timeout_strategy = readUInt8(d[0]);
            break;
        case 0x43:
            decoded.temperature_control_level_mapping = {
                level: readUInt8(d[0]),
                temperature: readInt16LE(d.slice(1, 3)) / 100,
            };
            break;
        case 0x44:
            decoded.temperature_control_level = readUInt8(d[0]);
            break;
        case 0x45:
            decoded.temperature_control_level_display_time = readUInt8(d[0]);
            break;
        case 0x46:
            decoded.target_temperature_resolution = readUInt8(d[0]);
            break;
        case 0x47:
            decoded.target_temperature_display_time = readUInt8(d[0]);
            break;
        case 0x49:
            decoded.open_window_status_timeout = readUInt16LE(d.slice(0, 2));
            break;
        case 0x4a:
            if (channel_id === 0xf9) {
                decoded.valve_emergency_position = readUInt8(d[0]);
            }
            break;
        case 0x4b:
            decoded.valve_opening_range = {
                min: readUInt8(d[0]),
                max: readUInt8(d[1]),
            };
            break;
        case 0x4c:
            decoded.predict_on_enable = readEnableStatus(d[0]);
            break;
        case 0x4d:
            decoded.valve_opening_display_enable = readEnableStatus(d[0]);
            break;
        case 0x4e:
            decoded.fixed_preheating_time = readUInt16LE(d.slice(0, 2));
            break;
        case 0x4f:
            decoded.system_key_enable = readEnableStatus(d[0]);
            break;
        case 0x50:
            decoded.heating_schedule_enable = {
                id: readUInt8(d[0]),
                enable: readEnableStatus(d[1]),
            };
            break;
        case 0x51:
            decoded.thermal_conductivity_correction = readEnableStatus(d[0]);
            break;
        case 0x53:
            decoded.config_report = {
                enable: readEnableStatus(d[0]),
                period: readUInt16LE(d.slice(1, 3)),
            };
            break;
        case 0x8e:
            // ignore the reserved ID byte
            decoded.report_interval = readUInt16LE(d.slice(1, 3));
            break;
        case 0xab:
            decoded.temperature_calibration = {
                enable: readEnableStatus(d[0]),
                value: readInt16LE(d.slice(1, 3)) / 100,
            };
            break;
        case 0xac:
            decoded.temperature_control_algorithm = readUInt8(d[0]);
            break;
        case 0xae:
            decoded.temperature_control_mode = readUInt8(d[0]);
            break;
        case 0xaf:
            decoded.open_window_detection = {
                enable: readEnableStatus(d[0]),
                temperature_threshold: readInt16LE(d.slice(1, 3)) / 100,
                time: readUInt16LE(d.slice(3, 5)),
            };
            break;
        case 0xb0:
            decoded.freeze_protection = {
                enable: readEnableStatus(d[0]),
                temperature: readInt16LE(d.slice(1, 3)) / 100,
            };
            break;
        case 0xb1:
            decoded.temperature_target = readInt16LE(d.slice(0, 2)) / 100;
            break;
        case 0xb3:
            decoded.temperature_control_enable = readEnableStatus(d[0]);
            break;
        case 0xb4:
            decoded.valve_opening_target = readUInt8(d[0]);
            break;
        case 0xba:
            decoded.dst_config = {
                enable: readEnableStatus(d[0]),
                offset: readUInt8(d[1]),
                start_month: readUInt8(d[2]),
                start_week_num: (readUInt8(d[3]) >> 4) & 0x0f,
                start_week_day: readUInt8(d[3]) & 0x0f,
                start_time: readUInt16LE(d.slice(4, 6)),
                end_month: readUInt8(d[6]),
                end_week_num: (readUInt8(d[7]) >> 4) & 0x0f,
                end_week_day: readUInt8(d[7]) & 0x0f,
                end_time: readUInt16LE(d.slice(8, 10)),
            };
            break;
        case 0xbd:
            decoded.time_zone = readInt16LE(d.slice(0, 2));
            break;
        case 0xc4:
            decoded.outside_temperature_timeout = readUInt16LE(d.slice(0, 2));
            break;
        case 0xc5:
            decoded.temperature_source = readUInt8(d[0]);
            break;
        case 0xf8:
            decoded.outside_temperature_timeout_strategy = readUInt8(d[0]);
            break;
    }

    return { data: decoded, offset: offset };
}

function handle_downlink_response(channel_id, channel_type, bytes, offset) {
    var decoded = {};
    var data_length = CONFIG_RESPONSE_DATA_LENGTHS[channel_type];
    if (data_length === undefined) {
        // undocumented echo format: frame length cannot be determined, stop parsing
        return { data: decoded, offset: bytes.length };
    }

    var data_start = offset;
    offset += data_length;
    if (channel_id === 0xf8) {
        offset += 1; // status byte appended to F9-configuration replies
    }

    switch (channel_type) {
        case 0x8e:
            // ignore the reserved ID byte
            decoded.report_interval = readUInt16LE(bytes.slice(data_start + 1, data_start + 3));
            break;
        case 0x29:
            decoded.valve_descale = readYesNoStatus(bytes[data_start] === 0x00 ? 1 : 0);
            break;
        case 0xbd:
            decoded.time_zone = readInt16LE(bytes.slice(data_start, data_start + 2));
            break;
        case 0x51:
            // thermal conductivity correction echo (V1.2 2.44)
            decoded.thermal_conductivity_correction = readEnableStatus(bytes[data_start]);
            break;
        case 0x53:
            // device periodic report echo (V1.2 2.46); password echo (0x52) is not decoded
            decoded.config_report = {
                enable: readEnableStatus(bytes[data_start]),
                period: readUInt16LE(bytes.slice(data_start + 1, data_start + 3)),
            };
            break;
    }

    return { data: decoded, offset: offset };
}

function readYesNoStatus(type) {
    var yes_no_map = { 0: "no", 1: "yes" };
    return getValue(yes_no_map, type);
}

function readProtocolVersion(bytes) {
    var major = (bytes & 0xf0) >> 4;
    var minor = bytes & 0x0f;
    return "v" + major + "." + minor;
}

function readTslVersion(bytes) {
    var major = bytes[0] & 0xff;
    var minor = bytes[1] & 0xff;
    return "v" + major + "." + minor;
}

function readSerialNumber(bytes) {
    var temp = [];
    for (var idx = 0; idx < bytes.length; idx++) {
        temp.push(("0" + (bytes[idx] & 0xff).toString(16)).slice(-2));
    }
    return temp.join("");
}

function readHardwareVersion(bytes) {
    var major = (bytes[0] & 0xff).toString(16);
    var minor = (bytes[1] & 0xff) >> 4;
    return "v" + major + "." + minor;
}

function readFirmwareVersion(bytes) {
	var major = (bytes[0] & 0xff).toString(16);
	var minor = (bytes[1] & 0xff).toString(16);
	var release = (bytes[2] & 0xff).toString(16);
	var alpha = (bytes[3] & 0xff).toString(16);
	var unit_test = (bytes[4] & 0xff).toString(16);
	var test = (bytes[5] & 0xff).toString(16);

	var version = 'v' + major + '.' + minor;
	if (release !== '0') version += '-r' + release;
	if (alpha !== '0') version += '-a' + alpha;
	if (unit_test !== '0') version += '-u' + unit_test;
	if (test !== '0') version += '-t' + test;
	return version;
}

function readLoRaWANClass(type) {
    var class_map = {
        0: "Class A",
        1: "Class B",
        2: "Class C",
        3: "Class CtoB",
    };
    return getValue(class_map, type);
}

function readOpenWindowDetectionStatus(type) {
    var open_window_detection_status_map = { 0: "normal", 1: "open" };
    return getValue(open_window_detection_status_map, type);
}

function readMotorCalibrationStatus(type) {
    var motor_calibration_status_map = {
        0: "success",
        1: "fail: out of range",
        2: "fail: uninstalled",
        3: "calibration cleared",
        4: "temperature control disabled",
        5: "fail: low battery",
    };
    return getValue(motor_calibration_status_map, type);
}

function readFreezeProtectionStatus(type) {
    var freeze_protection_status_map = {
        0: "normal",
        1: "triggered",
    };
    return getValue(freeze_protection_status_map, type);
}

function readTemperatureAlarmType(type) {
    var temperature_alarm_type_map = {
        0: "high temperature alarm release",
        1: "high temperature alarm trigger",
        2: "low temperature alarm release",
        3: "low temperature alarm trigger",
    };
    return getValue(temperature_alarm_type_map, type);
}

function readDescaleTriggerSource(type) {
    var descale_trigger_source_map = { 0: "auto", 1: "manual" };
    return getValue(descale_trigger_source_map, type);
}

function readDescaleResult(type) {
    var descale_result_map = { 0: "success", 1: "fail" };
    return getValue(descale_result_map, type);
}

function readDescaleFailReason(type) {
    var descale_fail_reason_map = {
        0: "none",
        1: "low battery",
        2: "not off-season",
        3: "motor busy",
        4: "calibration failed",
        5: "early stall",
        6: "device removed",
        7: "timeout/hall fault",
        8: "frost protection interrupted",
        9: "temperature control enabled",
    };
    return getValue(descale_fail_reason_map, type);
}

function readOpenWindowEventStatus(type) {
    var open_window_event_status_map = { 0: "closed", 1: "open" };
    return getValue(open_window_event_status_map, type);
}

function readFrostProtectionEventStatus(type) {
    var frost_protection_event_status_map = { 0: "normal", 1: "triggered" };
    return getValue(frost_protection_event_status_map, type);
}

function readTemperatureSourceFaultStatus(type) {
    var temperature_source_fault_status_map = { 0: "normal", 1: "fault" };
    return getValue(temperature_source_fault_status_map, type);
}

function readLowBatteryStatus(type) {
    var low_battery_status_map = { 0: "normal", 1: "low battery" };
    return getValue(low_battery_status_map, type);
}

function readJoinMode(type) {
    var join_mode_map = { 0: "ABP", 1: "OTAA" };
    return getValue(join_mode_map, type);
}

function readEnableStatus(type) {
    var enable_status_map = { 0: "disable", 1: "enable" };
    return getValue(enable_status_map, type);
}

function readReportReason(type) {
    var report_reason_map = {
        0: "timed report",
        1: "local modification",
        2: "query response",
        3: "off-season entry",
        4: "off-season temperature control enabled",
        5: "low battery protection completed",
    };
    return getValue(report_reason_map, type);
}

function readUInt8(bytes) {
    return bytes & 0xff;
}

function readInt8(bytes) {
    var ref = readUInt8(bytes);
    return ref > 0x7f ? ref - 0x100 : ref;
}

function readUInt16LE(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return value & 0xffff;
}

function readInt16LE(bytes) {
    var ref = readUInt16LE(bytes);
    return ref > 0x7fff ? ref - 0x10000 : ref;
}

function getValue(map, key) {
    if (RAW_VALUE) return key;

    var value = map[key];
    if (!value) value = "unknown";
    return value;
}

//if (!Object.assign) {
    Object.defineProperty(Object, "assign", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (target) {
            "use strict";
            if (target == null) {
                throw new TypeError("Cannot convert first argument to object");
            }

            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource == null) {
                    continue;
                }
                nextSource = Object(nextSource);

                var keysArray = Object.keys(Object(nextSource));
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        // concat array
                        if (Array.isArray(to[nextKey]) && Array.isArray(nextSource[nextKey])) {
                            to[nextKey] = to[nextKey].concat(nextSource[nextKey]);
                        } else {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
    });
//}
