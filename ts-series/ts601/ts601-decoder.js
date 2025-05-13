/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product TS601
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

    var unknown_command = 0;
    for (var i = 0; i < bytes.length; ) {
        var command_id = bytes[i++];

        switch (command_id) {
            case 0xdf:
                decoded.tsl_version = readProtocolVersion(bytes.slice(i, i + 2));
                i += 2;
                break;
            case 0xde:
                decoded.product_name = readString(bytes.slice(i, i + 32));
                i += 32;
                break;
            case 0xdd:
                decoded.product_pn = readString(bytes.slice(i, i + 32));
                i += 32;
                break;
            case 0xdb:
                decoded.product_sn = readHexString(bytes.slice(i, i + 8));
                i += 8;
                break;
            case 0xda:
                decoded.version = {};
                decoded.version.hardware_version = readHardwareVersion(bytes.slice(i, i + 2));
                decoded.version.firmware_version = readFirmwareVersion(bytes.slice(i + 2, i + 8));
                i += 8;
                break;
            case 0xd9:
                decoded.oem_id = readHexString(bytes.slice(i, i + 2));
                i += 2;
                break;
            case 0xee:
                decoded.device_request = 1;
                i += 0;
                break;
            case 0xc7:
                decoded.time_zone = readTimeZone(readInt16LE(bytes.slice(i, i + 2)));
                i += 2;
                break;
            case 0xc8:
                decoded.device_status = readDeviceStatus(bytes[i]);
                i += 1;
                break;
            case 0xcf:
                decoded.lorawan_class = readLoRaWANClass(bytes[i]);
                i += 1;
                break;
            case 0xed:
                // TODO: history data
                decoded.timestamp = readUInt32LE(bytes.slice(i + 1, i + 5));
                i += 5;
                break;
            case 0xbe:
                var sub_cmd = readUInt8(bytes[i]);
                decoded.cellular_status = decoded.cellular_status || {};
                if (sub_cmd === 0x00) {
                    decoded.cellular_status.register_status = readRegisterStatus(bytes[i + 1]);
                    i += 2;
                } else if (sub_cmd === 0x01) {
                    decoded.cellular_status.sim_status = readSIMStatus(bytes[i + 1]);
                    i += 2;
                } else if (sub_cmd === 0x02) {
                    decoded.cellular_status.imei = readString(bytes.slice(i + 1, i + 16));
                    i += 16;
                } else if (sub_cmd === 0x03) {
                    decoded.cellular_status.imsi = readString(bytes.slice(i + 1, i + 16));
                    i += 16;
                } else if (sub_cmd === 0x04) {
                    decoded.cellular_status.iccid = readString(bytes.slice(i + 1, i + 21));
                    i += 21;
                } else if (sub_cmd === 0x05) {
                    decoded.cellular_status.csq = readInt16LE(bytes.slice(i + 1, i + 3));
                    i += 3;
                } else if (sub_cmd === 0x06) {
                    decoded.cellular_status.connected_status = readConnectionStatus(bytes[i + 1]);
                    i += 2;
                } else if (sub_cmd === 0x16) {
                    decoded.cellular_status.data_statistics = decoded.cellular_status.data_statistics || {};
                    decoded.cellular_status.data_statistics.tx_bytes = readUInt32LE(bytes.slice(i + 1, i + 5));
                    decoded.cellular_status.data_statistics.rx_bytes = readUInt32LE(bytes.slice(i + 5, i + 9));
                    i += 9;
                }
                break;

            // telemetry
            case 0x01:
                decoded.battery = readUInt8(bytes[i]);
                i += 1;
                break;
            case 0x03:
                var sensor_type_value = readUInt8(bytes[i]);
                decoded.sensor_type = readSensorIDType(sensor_type_value);
                // sensor: SHT41
                if (sensor_type_value === 0x02) {
                    decoded.sensor_sht41_id = readHexString(bytes.slice(i + 1, i + 5));
                }
                // sensor: DB18B20
                else if (sensor_type_value === 0x03) {
                    decoded.sensor_db18b20_id = readHexString(bytes.slice(i + 1, i + 9));
                }
                i += 9;
                break;
            case 0x04:
                decoded.temperature = readInt32LE(bytes.slice(i, i + 4)) / 100;
                i += 4;
                break;
            case 0x05:
                decoded.humidity = readUInt16LE(bytes.slice(i, i + 2)) / 10;
                i += 2;
                break;
            case 0x06:
                var latitude = readUInt32LE(bytes.slice(i, i + 4));
                var longitude = readUInt32LE(bytes.slice(i + 4, i + 8));
                if (latitude === 0x7fffffff || longitude === 0x7fffffff) {
                    decoded.location_alarm = readLocationAlarm(3);
                } else if (latitude === 0x7ffffffe || longitude === 0x7ffffffe) {
                    decoded.location_alarm = readLocationAlarm(2);
                } else if (latitude === 0x7ffffffd || longitude === 0x7ffffffd) {
                    decoded.location_alarm = readLocationAlarm(1);
                } else if (latitude === 0x7ffffffc || longitude === 0x7ffffffc) {
                    decoded.location_alarm = readLocationAlarm(0);
                } else {
                    decoded.latitude = readInt32LE(bytes.slice(i, i + 4)) / 1000000;
                    decoded.longitude = readInt32LE(bytes.slice(i + 4, i + 8)) / 1000000;
                }
                i += 8;
                break;
            case 0x07:
                decoded.airplane_mode = readOnOffStatus(bytes[i]);
                i += 1;
                break;
            case 0x08:
                var event = {};
                var temperature_alarm_type_value = readUInt8(bytes[i]);
                i += 1;
                event.temperature_alarm = readTemperatureAlarm(temperature_alarm_type_value);
                if (hasTemperatureValue(temperature_alarm_type_value)) {
                    event.temperature = readInt32LE(bytes.slice(i, i + 4)) / 100;
                    decoded.temperature = event.temperature;
                    i += 4;
                }
                if (hasTemperatureMutationValue(temperature_alarm_type_value)) {
                    event.temperature_mutation = readInt32LE(bytes.slice(i, i + 4)) / 100;
                    i += 4;
                }
                decoded.event = decoded.event || [];
                decoded.event.push(event);
                break;
            case 0x09:
                var event = {};
                var humidity_alarm_type_value = readUInt8(bytes[i]);
                i += 1;
                event.humidity_alarm = readHumidityAlarm(humidity_alarm_type_value);
                if (hasHumidityValue(humidity_alarm_type_value)) {
                    event.humidity = readUInt16LE(bytes.slice(i, i + 2)) / 10;
                    decoded.humidity = event.humidity;
                    i += 2;
                }
                if (hasHumidityMutationValue(humidity_alarm_type_value)) {
                    event.humidity_mutation = readUInt16LE(bytes.slice(i, i + 2)) / 10;
                    i += 2;
                }
                decoded.event = decoded.event || [];
                decoded.event.push(event);
                break;
            case 0x0a:
                var event = {};
                var tilt_alarm_type_value = readUInt8(bytes[i]);
                i += 1;
                event.tilt_alarm = readTiltAlarm(tilt_alarm_type_value);
                decoded.event = decoded.event || [];
                decoded.event.push(event);
                break;
            case 0x0b:
                var event = {};
                var light_alarm_type_value = readUInt8(bytes[i]);
                i += 1;
                event.light_alarm = readLightAlarm(light_alarm_type_value);
                decoded.event = decoded.event || [];
                decoded.event.push(event);
                break;
            case 0x0c:
                decoded.probe_connect_status = readProbeConnectStatus(bytes[i]);
                i += 1;
                break;
            case 0x0d:
                decoded.relative_surface_info = {};
                decoded.relative_surface_info.angle_x = readInt16LE(bytes.slice(i, i + 2)) / 100;
                decoded.relative_surface_info.angle_y = readInt16LE(bytes.slice(i + 2, i + 4)) / 100;
                decoded.relative_surface_info.angle_z = readInt16LE(bytes.slice(i + 4, i + 6)) / 100;
                i += 6;
                break;
            case 0x0e:
                decoded.report_package_type = readReportType(bytes[i]);
                i += 1;
                break;

            // config
            case 0x60:
                var time_unit_value = readUInt8(bytes[i]);
                decoded.collection_interval = {};
                decoded.collection_interval.unit = readTimeUnitType(time_unit_value);
                if (time_unit_value === 0) {
                    decoded.collection_interval.seconds_of_time = readUInt16LE(bytes.slice(i + 1, i + 3));
                } else if (time_unit_value === 1) {
                    decoded.collection_interval.minutes_of_time = readUInt16LE(bytes.slice(i + 1, i + 3));
                }
                i += 3;
                break;
            case 0x61:
                decoded.recollection_counts = readUInt8(bytes[i]);
                i += 1;
                break;
            case 0x62:
                var time_unit_value = readUInt8(bytes[i]);
                decoded.reporting_interval = {};
                decoded.reporting_interval.unit = readTimeUnitType(time_unit_value);
                if (time_unit_value === 0) {
                    decoded.reporting_interval.seconds_of_time = readUInt16LE(bytes.slice(i + 1, i + 3));
                } else if (time_unit_value === 1) {
                    decoded.reporting_interval.minutes_of_time = readUInt16LE(bytes.slice(i + 1, i + 3));
                }
                i += 3;
                break;
            case 0x63:
                decoded.alarm_counts = readUInt16LE(bytes.slice(i, i + 2));
                i += 2;
                break;
            case 0x64:
                var time_unit_value = readUInt8(bytes[i]);
                decoded.light_collection_interval = {};
                decoded.light_collection_interval.unit = readTimeUnitType(time_unit_value);
                if (time_unit_value === 0) {
                    decoded.light_collection_interval.seconds_of_time = readUInt16LE(bytes.slice(i + 1, i + 3));
                } else if (time_unit_value === 1) {
                    decoded.light_collection_interval.minutes_of_time = readUInt16LE(bytes.slice(i + 1, i + 3));
                }
                i += 3;
                break;
            case 0x65:
                decoded.temperature_unit = readTemperatureUnit(bytes[i]);
                i += 1;
                break;
            case 0x70:
                decoded.airplane_enable = readEnableStatus(bytes[i]);
                i += 1;
                break;
            case 0x71:
                decoded.base_station_position_enable = readEnableStatus(bytes[i]);
                i += 1;
                break;
            case 0x72:
                decoded.base_station_position_auth_token = readString(bytes.slice(i, i + 16));
                i += 16;
                break;
            case 0x73:
                var time_type_value = readUInt8(bytes[i]);
                decoded.airplane_mode_time_period_settings = decoded.airplane_mode_time_period_settings || {};
                // start time
                if (time_type_value === 0) {
                    decoded.airplane_mode_time_period_settings.start_time = decoded.airplane_mode_time_period_settings.start_time || {};
                    decoded.airplane_mode_time_period_settings.start_time.year = readUInt8(bytes[i + 1]);
                    decoded.airplane_mode_time_period_settings.start_time.month = readUInt8(bytes[i + 2]);
                    decoded.airplane_mode_time_period_settings.start_time.day = readUInt8(bytes[i + 3]);
                    decoded.airplane_mode_time_period_settings.start_time.hour = readUInt8(bytes[i + 4]);
                    decoded.airplane_mode_time_period_settings.start_time.minute = readUInt8(bytes[i + 5]);
                    decoded.airplane_mode_time_period_settings.start_time.second = readUInt8(bytes[i + 6]);
                    i += 7;
                }
                // end time
                else if (time_type_value === 1) {
                    decoded.airplane_mode_time_period_settings.end_time = decoded.airplane_mode_time_period_settings.end_time || {};
                    decoded.airplane_mode_time_period_settings.end_time.year = readUInt8(bytes[i + 1]);
                    decoded.airplane_mode_time_period_settings.end_time.month = readUInt8(bytes[i + 2]);
                    decoded.airplane_mode_time_period_settings.end_time.day = readUInt8(bytes[i + 3]);
                    decoded.airplane_mode_time_period_settings.end_time.hour = readUInt8(bytes[i + 4]);
                    decoded.airplane_mode_time_period_settings.end_time.minute = readUInt8(bytes[i + 5]);
                    decoded.airplane_mode_time_period_settings.end_time.second = readUInt8(bytes[i + 6]);
                    i += 7;
                }
                break;
            case 0x74:
                decoded.temperature_humidity_display_mode = readDisplayMode(bytes[i]);
                i += 1;
                break;
            case 0x75:
                decoded.alarm_release_enable = readEnableStatus(bytes[i]);
                i += 1;
                break;
            case 0x76:
                decoded.child_lock_settings = {};
                decoded.child_lock_settings.enable = readEnableStatus(bytes[i]);
                var button_bit_offset = { power_button: 0, collection_button: 1 };
                var data = readUInt8(bytes[i + 1]);
                for (var key in button_bit_offset) {
                    decoded.child_lock_settings[key] = readEnableStatus((data >>> button_bit_offset[key]) & 0x01);
                }
                i += 2;
                break;
            case 0x77:
                decoded.temperature_alarm_settings = {};
                decoded.temperature_alarm_settings.enable = readEnableStatus(bytes[i]);
                decoded.temperature_alarm_settings.condition = readConditionType(bytes[i + 1]);
                decoded.temperature_alarm_settings.threshold_min = readInt32LE(bytes.slice(i + 2, i + 6)) / 100;
                decoded.temperature_alarm_settings.threshold_max = readInt32LE(bytes.slice(i + 6, i + 10)) / 100;
                i += 10;
                break;
            case 0x78:
                decoded.temperature_mutation_alarm_settings = {};
                decoded.temperature_mutation_alarm_settings.enable = readEnableStatus(bytes[i]);
                decoded.temperature_mutation_alarm_settings.mutation = readInt32LE(bytes.slice(i + 1, i + 5)) / 10;
                i += 5;
                break;
            case 0x79:
                decoded.humidity_alarm_settings = {};
                decoded.humidity_alarm_settings.enable = readEnableStatus(bytes[i]);
                decoded.humidity_alarm_settings.condition = readConditionType(bytes[i + 1]);
                decoded.humidity_alarm_settings.threshold_min = readUInt16LE(bytes.slice(i + 2, i + 4)) / 10;
                decoded.humidity_alarm_settings.threshold_max = readUInt16LE(bytes.slice(i + 4, i + 6)) / 10;
                i += 6;
                break;
            case 0x7a:
                decoded.humidity_mutation_alarm_settings = {};
                decoded.humidity_mutation_alarm_settings.enable = readEnableStatus(bytes[i]);
                decoded.humidity_mutation_alarm_settings.mutation = readUInt16LE(bytes.slice(i + 1, i + 3)) / 10;
                i += 3;
                break;
            case 0x7b:
                decoded.temperature_calibration_settings = {};
                decoded.temperature_calibration_settings.enable = readEnableStatus(bytes[i]);
                decoded.temperature_calibration_settings.calibration_value = readInt32LE(bytes.slice(i + 1, i + 5)) / 100;
                i += 5;
                break;
            case 0x7c:
                decoded.humidity_calibration_settings = {};
                decoded.humidity_calibration_settings.enable = readEnableStatus(bytes[i]);
                decoded.humidity_calibration_settings.calibration_value = readUInt16LE(bytes.slice(i + 1, i + 3)) / 10;
                i += 3;
                break;
            case 0x7d:
                decoded.light_alarm_settings = {};
                decoded.light_alarm_settings.enable = readEnableStatus(bytes[i]);
                decoded.light_alarm_settings.condition = readConditionType(bytes[i + 1]);
                decoded.light_alarm_settings.threshold_max = readUInt16LE(bytes.slice(i + 2, i + 4));
                i += 4;
                break;
            case 0x7e:
                decoded.light_tolerance = readUInt8(bytes[i]);
                i += 1;
                break;
            case 0x7f:
                decoded.tilt_alarm_settings = {};
                decoded.tilt_alarm_settings.enable = readEnableStatus(bytes[i]);
                decoded.tilt_alarm_settings.condition = readConditionType(bytes[i + 1]);
                decoded.tilt_alarm_settings.threshold_max = readUInt8(bytes[i + 2]);
                decoded.tilt_alarm_settings.duration = readUInt8(bytes[i + 3]);
                i += 4;
                break;
            case 0x80:
                decoded.fall_down_alarm_settings = decoded.fall_down_alarm_settings || {};
                decoded.fall_down_alarm_settings.enable = readEnableStatus(bytes[i]);
                i += 1;
                break;
            case 0x81:
                decoded.fall_down_alarm_settings = decoded.fall_down_alarm_settings || {};
                decoded.fall_down_alarm_settings.free_fall_level = readFreeFallLevel(bytes[i]);
                decoded.fall_down_alarm_settings.continue_level = readUInt8(bytes[i + 1]);
                i += 2;
                break;
            case 0x82:
                decoded.probe_id_retransmit_count = readUInt8(bytes[i]);
                i += 1;
                break;
            case 0xc4:
                decoded.auto_provisioning_enable = readEnableStatus(bytes[i]);
                i += 1;
                break;
            case 0xc5:
                decoded.data_storage_settings = decoded.data_storage_settings || {};
                var history_sub_cmd = readUInt8(bytes[i]);
                if (history_sub_cmd === 0x00) {
                    decoded.data_storage_settings.enable = readEnableStatus(bytes[i + 1]);
                    i += 2;
                } else if (history_sub_cmd === 0x01) {
                    decoded.data_storage_settings.retransmission_enable = readEnableStatus(bytes[i + 1]);
                    i += 2;
                } else if (history_sub_cmd === 0x02) {
                    decoded.data_storage_settings.retransmission_interval = readUInt16LE(bytes.slice(i + 1, i + 3));
                    i += 3;
                } else if (history_sub_cmd === 0x03) {
                    decoded.data_storage_settings.retrieval_interval = readUInt16LE(bytes.slice(i + 1, i + 3));
                    i += 3;
                }
                break;
            case 0xc6:
                decoded.daylight_saving_time = {};
                decoded.daylight_saving_time.enable = readEnableStatus(bytes[i]);
                decoded.daylight_saving_time.offset = readUInt8(bytes[i + 1]);
                decoded.daylight_saving_time.start_month = readUInt8(bytes[i + 2]);
                var start_day_value = readUInt8(bytes[i + 3]);
                decoded.daylight_saving_time.start_week_num = (start_day_value >>> 4) & 0x07;
                decoded.daylight_saving_time.start_week_day = start_day_value & 0x0f;
                decoded.daylight_saving_time.start_hour_min = readUInt16LE(bytes.slice(i + 4, i + 6));
                decoded.daylight_saving_time.end_month = readUInt8(bytes[i + 6]);
                var end_day_value = readUInt8(bytes[i + 7]);
                decoded.daylight_saving_time.end_week_num = (end_day_value >>> 4) & 0x0f;
                decoded.daylight_saving_time.end_week_day = end_day_value & 0x0f;
                decoded.daylight_saving_time.end_hour_min = readUInt16LE(bytes.slice(i + 8, i + 10));
                i += 10;
                break;

            // service
            case 0x50:
                decoded.clear_screen_alarm = readYesNoStatus(1);
                break;
            case 0x51:
                decoded.zero_calibrate_mode = readZeroCalibrateMode(bytes[i]);
                i += 1;
                break;
            case 0x52:
                decoded.initial_surface_mode = readInitialSurfaceMode(bytes[i]);
                i += 1;
                break;
            case 0x53:
                decoded.query_probe_id = readYesNoStatus(1);
                break;
            case 0xb7:
                decoded.timestamp = readUInt32LE(bytes.slice(i, i + 4));
                i += 4;
                break;
            case 0xb8:
                decoded.synchronize_time = readYesNoStatus(1);
                break;
            case 0xb9:
                decoded.query_device_status = readYesNoStatus(1);
                break;
            case 0xba:
                decoded.fetch_history = decoded.fetch_history || {};
                decoded.fetch_history.start_time = readUInt32LE(bytes.slice(i, i + 4));
                i += 4;
                break;
            case 0xbb:
                decoded.fetch_history = decoded.fetch_history || {};
                decoded.fetch_history.start_time = readUInt32LE(bytes.slice(i, i + 4));
                decoded.fetch_history.end_time = readUInt32LE(bytes.slice(i + 4, i + 8));
                i += 8;
                break;
            case 0xbc:
                decoded.stop_transmit_history = readYesNoStatus(1);
                break;
            case 0xbd:
                decoded.clear_history = readYesNoStatus(1);
                break;
            case 0xbf:
                decoded.reset = readYesNoStatus(1);
                break;
            default:
                unknown_command = 1;
                break;
        }

        if (unknown_command) break;
    }

    return decoded;
}

function readProtocolVersion(bytes) {
    var major = bytes[0] & 0xff;
    var minor = bytes[1] & 0xff;
    return "v" + major + "." + minor;
}

function readHardwareVersion(bytes) {
    var major = bytes[0] & 0xff;
    var minor = bytes[1] & 0xff;
    return "v" + major + "." + minor;
}

function readFirmwareVersion(bytes) {
    var major = bytes[0] & 0xff;
    var minor = bytes[1] & 0xff;
    var release = bytes[2] & 0xff;
    var alpha = bytes[3] & 0xff;
    var unit_test = bytes[4] & 0xff;
    var test = bytes[5] & 0xff;

    var version = "v" + major + "." + minor;
    if (release !== 0) version += "-r" + release;
    if (alpha !== 0) version += "-a" + alpha;
    if (unit_test !== 0) version += "-u" + unit_test;
    if (test !== 0) version += "-t" + test;
    return version;
}

function readTimeZone(value) {
    var time_zone_map = {
        "-720": "UTC-12",
        "-660": "UTC-11",
        "-600": "UTC-10",
        "-570": "UTC-9:30",
        "-540": "UTC-9",
        "-480": "UTC-8",
        "-420": "UTC-7",
        "-360": "UTC-6",
        "-300": "UTC-5",
        "-240": "UTC-4",
        "-210": "UTC-3:30",
        "-180": "UTC-3",
        "-120": "UTC-2",
        "-60": "UTC-1",
        0: "UTC",
        60: "UTC+1",
        120: "UTC+2",
        180: "UTC+3",
        210: "UTC+3:30",
        240: "UTC+4",
        270: "UTC+4:30",
        300: "UTC+5",
        330: "UTC+5:30",
        345: "UTC+5:45",
        360: "UTC+6",
        390: "UTC+6:30",
        420: "UTC+7",
        480: "UTC+8",
        540: "UTC+9",
        570: "UTC+9:30",
        600: "UTC+10",
        630: "UTC+10:30",
        660: "UTC+11",
        720: "UTC+12",
        765: "UTC+12:45",
        780: "UTC+13",
        840: "UTC+14",
    };
    return getValue(time_zone_map, value);
}

function readDeviceStatus(type) {
    var device_status_map = { 0: "on", 1: "off" };
    return getValue(device_status_map, type);
}

function readLoRaWANClass(type) {
    var lorawan_class_map = {
        0: "Class A",
        1: "Class B",
        2: "Class C",
        3: "Class CtoB",
    };
    return getValue(lorawan_class_map, type);
}

function readSensorIDType(type) {
    var sensor_id_type_map = {
        0: "none",
        1: "PT100",
        2: "SHT41",
        3: "DS18B20",
    };
    return getValue(sensor_id_type_map, type);
}

function readEnableStatus(status) {
    var enable_status_map = { 0: "disable", 1: "enable" };
    return getValue(enable_status_map, status);
}

function readYesNoStatus(status) {
    var yes_no_status_map = { 0: "no", 1: "yes" };
    return getValue(yes_no_status_map, status);
}

function readOnOffStatus(status) {
    var on_off_status_map = { 0: "off", 1: "on" };
    return getValue(on_off_status_map, status);
}

function readTemperatureAlarm(type) {
    var alarm_map = {
        0: "collection_error",
        1: "lower_range_error",
        2: "over_range_error",
        3: "no_data",
        16: "below_threshold_alarm_release",
        17: "below_threshold_alarm",
        18: "above_threshold_alarm_release",
        19: "above_threshold_alarm",
        20: "between_threshold_alarm_release",
        21: "between_threshold_alarm",
        22: "outside_threshold_alarm_release",
        23: "outside_threshold_alarm",
        32: "mutation_alarm", // 0x20
        48: "mutation_alarm_without_data", // 0x30
    };
    return getValue(alarm_map, type);
}

function hasTemperatureValue(type) {
    return type === 0x10 || type === 0x11 || type === 0x12 || type === 0x13 || type === 0x14 || type === 0x15 || type === 0x16 || type === 0x17 || type === 0x20 || type === 0x30;
}

function hasTemperatureMutationValue(type) {
    return type === 0x20;
}

function readLocationAlarm(type) {
    var alarm_map = {
        0: "collection_error",
        1: "lower_range_error",
        2: "over_range_error",
        3: "no_data",
    };
    return getValue(alarm_map, type);
}

function readHumidityAlarm(type) {
    var alarm_map = {
        0: "collection_error",
        1: "lower_range_error",
        2: "over_range_error",
        3: "no_data",
        16: "below_threshold_alarm_release",
        17: "below_threshold_alarm",
        18: "above_threshold_alarm_release",
        19: "above_threshold_alarm",
        20: "between_threshold_alarm_release",
        21: "between_threshold_alarm",
        22: "outside_threshold_alarm_release",
        23: "outside_threshold_alarm",
        32: "mutation_alarm", // 0x20
        48: "mutation_alarm_without_data", // 0x30
    };
    return getValue(alarm_map, type);
}

function hasHumidityValue(type) {
    return type === 0x10 || type === 0x11 || type === 0x12 || type === 0x13 || type === 0x14 || type === 0x15 || type === 0x16 || type === 0x17 || type === 0x20 || type === 0x30;
}

function hasHumidityMutationValue(type) {
    return type === 0x20;
}

function readTiltAlarm(type) {
    var alarm_map = {
        0: "collection_error",
        1: "lower_range_error",
        2: "over_range_error",
        3: "no_data",
        16: "tilt_alarm_release",
        17: "tilt_alarm",
        33: "fall_down_alarm",
    };
    return getValue(alarm_map, type);
}

function readLightAlarm(type) {
    var alarm_map = {
        0: "collection_error",
        1: "lower_range_error",
        2: "over_range_error",
        3: "no_data",
        16: "bright_to_dark",
        17: "dark_to_bright",
    };
    return getValue(alarm_map, type);
}

function readProbeConnectStatus(type) {
    var probe_connect_status_map = { 0: "disconnect", 1: "connect" };
    return getValue(probe_connect_status_map, type);
}

function readConnectionStatus(status) {
    var status_map = { 0: "failed", 1: "success" };
    return getValue(status_map, status);
}

function readRegisterStatus(status) {
    var status_map = { 0: "failed", 1: "success" };
    return getValue(status_map, status);
}

function readSIMStatus(status) {
    var status_map = {
        0: "card_status_reservation",
        1: "sim_card_recognition_successful",
        2: "sim_card_recognition_failed",
        3: "pin_code_required",
        4: "pin_code_incorrect",
        5: "need_puk_code",
        6: "sim_card_not_inserted",
    };
    return getValue(status_map, status);
}

function readTimeUnitType(type) {
    var unit_map = { 0: "second", 1: "minute" };
    return getValue(unit_map, type);
}

function readTemperatureUnit(type) {
    var unit_map = { 0: "celsius", 1: "fahrenheit" };
    return getValue(unit_map, type);
}

function readDisplayMode(type) {
    var mode_map = { 0: "temperature", 1: "humidity" };
    return getValue(mode_map, type);
}

function readReportType(type) {
    var report_type_map = { 0: "period_report", 1: "button_trigger_report" };
    return getValue(report_type_map, type);
}

function readConditionType(type) {
    var condition_type_map = { 0: "disable", 1: "below", 2: "above", 3: "between", 4: "outside" };
    return getValue(condition_type_map, type);
}

function readFreeFallLevel(level) {
    var level_map = {
        0: "free_fall_level_156",
        1: "free_fall_level_219",
        2: "free_fall_level_250",
        3: "free_fall_level_312",
        4: "free_fall_level_344",
        5: "free_fall_level_406",
        6: "free_fall_level_406",
        7: "free_fall_level_469",
        8: "free_fall_level_500",
    };
    return getValue(level_map, level);
}

function readZeroCalibrateMode(mode) {
    var mode_map = { 0: "clear_zero_calibration", 1: "start_zero_calibration" };
    return getValue(mode_map, mode);
}

function readInitialSurfaceMode(mode) {
    var mode_map = { 0: "reset_to_horizontal_plan", 1: "set_current_surface_as_horizontal_plan" };
    return getValue(mode_map, mode);
}

/* eslint-disable */
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

function readUInt32LE(bytes) {
    var value = (bytes[3] << 24) + (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
    return (value & 0xffffffff) >>> 0;
}

function readInt32LE(bytes) {
    var ref = readUInt32LE(bytes);
    return ref > 0x7fffffff ? ref - 0x100000000 : ref;
}

function readFloat16LE(bytes) {
    var bits = (bytes[1] << 8) | bytes[0];
    var sign = bits >>> 15 === 0 ? 1.0 : -1.0;
    var e = (bits >>> 10) & 0x1f;
    var m = e === 0 ? (bits & 0x3ff) << 1 : (bits & 0x3ff) | 0x400;
    var f = sign * m * Math.pow(2, e - 25);

    var n = Number(f.toFixed(2));
    return n;
}

function readFloatLE(bytes) {
    var bits = (bytes[3] << 24) | (bytes[2] << 16) | (bytes[1] << 8) | bytes[0];
    var sign = bits >>> 31 === 0 ? 1.0 : -1.0;
    var e = (bits >>> 23) & 0xff;
    var m = e === 0 ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
    var f = sign * m * Math.pow(2, e - 150);
    return f;
}

function readString(bytes) {
    var str = "";
    for (var i = 0; i < bytes.length; i++) {
        if (bytes[i] === 0x00) break;
        str += String.fromCharCode(bytes[i]);
    }
    return str;
}

function readHexString(bytes) {
    var temp = [];
    for (var idx = 0; idx < bytes.length; idx++) {
        temp.push(("0" + (bytes[idx] & 0xff).toString(16)).slice(-2));
    }
    return temp.join("");
}

function getValue(map, key) {
    if (RAW_VALUE) return key;
    var value = map[key];
    if (!value) value = "unknown";
    return value;
}
