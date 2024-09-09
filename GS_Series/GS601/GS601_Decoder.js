/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product GS601
 */
var RAW_VALUE = 0x00;

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

function milesightDeviceDecode(bytes) {
    var decoded = {};

    var unknown_command = 0;
    for (var i = 0; i < bytes.length; ) {
        var command_id = bytes[i++];

        switch (command_id) {
            case 0xdf: // tsl version
                decoded.tsl_version = readProtocolVersion(bytes.slice(i, i + 2));
                i += 2;
                break;
            case 0xde: // product name
                decoded.product_name = readString(bytes.slice(i, i + 32));
                i += 32;
                break;
            case 0xdd: // product part number
                decoded.product_pn = readString(bytes.slice(i, i + 32));
                i += 32;
                break;
            case 0xdb: // product sn
                decoded.product_sn = readHexString(bytes.slice(i, i + 8));
                i += 8;
                break;
            case 0xda: // hardware version / firmware version
                decoded.version = {};
                decoded.version.hardware_version = readHardwareVersion(bytes.slice(i, i + 2));
                decoded.version.firmware_version = readFirmwareVersion(bytes.slice(i + 2, i + 8));
                i += 8;
                break;
            case 0xd9: // oem id
                decoded.oem_id = readHexString(bytes.slice(i, i + 2));
                i += 2;
                break;
            case 0xd8: // product frequency band
                decoded.product_frequency_band = readString(bytes.slice(i, i + 16));
                i += 16;
                break;
            case 0xee: // device request
                decoded.device_request = 1;
                i += 0;
                break;
            case 0xc7: // time zone
                decoded.time_zone = readTimeZone(readInt16LE(bytes.slice(i, i + 2)));
                i += 2;
                break;
            case 0xc8: // device status
                decoded.device_status = readDeviceStatus(bytes[i]);
                i += 1;
                break;
            case 0xcf: // lorawan class
                decoded.lorawan_class = readLoRaWANClass(bytes[i]);
                i += 1;
                break;
            case 0x00: // battery
                decoded.battery = readUInt8(bytes[i]);
                i += 1;
                break;
            case 0x01: // vaping index
                decoded.vaping_index = readUInt8(bytes[i]);
                i += 1;
                break;
            case 0x02: // vaping index alarm
                var vaping_index_alarm = {};
                var alarm_type = bytes[i];

                vaping_index_alarm.type = readVapeIndexAlarmType(alarm_type);
                if (alarm_type === 0x10 || alarm_type === 0x11) {
                    vaping_index_alarm.vaping_index = readUInt8(bytes[i + 1]);
                    i += 2;
                } else {
                    i += 1;
                }

                decoded.vaping_index_alarm = vaping_index_alarm;
                break;
            case 0x03: // pm1.0
                decoded.pm1_0 = readUInt16LE(bytes.slice(i, i + 2));
                i += 2;
                break;
            case 0x04: // pm1.0 alarm
                var pm1_0_alarm = {};
                var alarm_type = bytes[i];

                pm1_0_alarm.type = readPMAlarmType(alarm_type);
                if (alarm_type === 0x10 || alarm_type === 0x11) {
                    pm1_0_alarm.pm1_0 = readUInt16LE(bytes.slice(i + 1, i + 3));
                    i += 3;
                } else {
                    i += 1;
                }

                decoded.pm1_0_alarm = pm1_0_alarm;
                break;
            case 0x05: // pm2.5
                decoded.pm2_5 = readUInt16LE(bytes.slice(i, i + 2));
                i += 2;
                break;
            case 0x06: // pm2.5 alarm
                var pm2_5_alarm = {};
                var alarm_type = bytes[i];

                pm2_5_alarm.type = readPMAlarmType(alarm_type);
                if (alarm_type === 0x10 || alarm_type === 0x11) {
                    pm2_5_alarm.pm2_5 = readUInt16LE(bytes.slice(i + 1, i + 3));
                    i += 3;
                } else {
                    i += 1;
                }

                decoded.pm2_5_alarm = pm2_5_alarm;
                break;
            case 0x07: // pm10
                decoded.pm10 = readUInt16LE(bytes.slice(i, i + 2));
                i += 2;
                break;
            case 0x08: // pm10 alarm
                var pm10_alarm = {};
                var alarm_type = bytes[i];

                pm10_alarm.type = readPMAlarmType(alarm_type);
                if (alarm_type === 0x10 || alarm_type === 0x11) {
                    pm10_alarm.pm10 = readUInt16LE(bytes.slice(i + 1, i + 3));
                    i += 3;
                } else {
                    i += 1;
                }

                decoded.pm10_alarm = pm10_alarm;
                break;
            case 0x09: // temperature
                decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
                i += 2;
                break;
            case 0x0a: // temperature alarm
                var temperature_alarm = {};
                var alarm_type = bytes[i];

                temperature_alarm.type = readTemperatureAlarmType(alarm_type);
                if (alarm_type === 0x10 || alarm_type === 0x11) {
                    temperature_alarm.temperature = readInt16LE(bytes.slice(i + 1, i + 3)) / 10;
                    i += 3;
                } else {
                    i += 1;
                }

                decoded.temperature_alarm = temperature_alarm;
                break;
            case 0x0b: // humidity
                decoded.humidity = readUInt16LE(bytes.slice(i, i + 2)) / 10;
                i += 2;
                break;
            case 0x0c: // humidity alarm
                var humidity_alarm = {};
                var alarm_type = bytes[i];

                humidity_alarm.type = readHumidityAlarmType(alarm_type);
                i += 1;

                decoded.humidity_alarm = humidity_alarm;
                break;
            case 0x0d: // tvoc
                decoded.tvoc = readUInt16LE(bytes.slice(i, i + 2));
                i += 2;
                break;
            case 0x0e: // tvoc alarm
                var tvoc_alarm = {};
                var alarm_type = bytes[i];

                tvoc_alarm.type = readTVOCAlarmType(alarm_type);
                if (alarm_type === 0x10 || alarm_type === 0x11) {
                    tvoc_alarm.tvoc = readUInt16LE(bytes.slice(i + 1, i + 3));
                    i += 3;
                } else {
                    i += 1;
                }

                decoded.tvoc_alarm = tvoc_alarm;
                break;
            case 0x0f: // tamper status
                decoded.tamper_status = readTamperStatus(bytes[i]);
                i += 1;
                break;
            case 0x10: // tamper alarm
                var tamper_status_alarm = {};
                tamper_status_alarm.type = readTamperAlarmType(bytes[i]);
                i += 1;

                decoded.tamper_status_alarm = tamper_status_alarm;
                break;
            case 0x11: // buzzer
                decoded.buzzer = readBuzzerStatus(bytes[i]);
                i += 1;
                break;
            case 0x12: // occupancy status
                decoded.occupancy_status = readOccupancyStatus(bytes[i]);
                i += 1;
                break;
            case 0x20: // rmox_0 / rmox_1
                decoded.tvoc_raw_data_1 = {};
                decoded.tvoc_raw_data_1.rmox_0 = readFloatLE(bytes.slice(i, i + 4));
                decoded.tvoc_raw_data_1.rmox_1 = readFloatLE(bytes.slice(i + 4, i + 8));
                i += 8;
                break;
            case 0x21: // rmox_2 / rmox_3
                decoded.tvoc_raw_data_2 = {};
                decoded.tvoc_raw_data_2.rmox_2 = readFloatLE(bytes.slice(i, i + 4));
                decoded.tvoc_raw_data_2.rmox_3 = readFloatLE(bytes.slice(i + 4, i + 8));
                i += 8;
                break;
            case 0x22: // rmox_4 / rmox_5
                decoded.tvoc_raw_data_3 = {};
                decoded.tvoc_raw_data_3.rmox_4 = readFloatLE(bytes.slice(i, i + 4));
                decoded.tvoc_raw_data_3.rmox_5 = readFloatLE(bytes.slice(i + 4, i + 8));
                i += 8;
                break;
            case 0x23: // rmox_6 / rmox_7
                decoded.tvoc_raw_data_4 = {};
                decoded.tvoc_raw_data_4.rmox_6 = readFloatLE(bytes.slice(i, i + 4));
                decoded.tvoc_raw_data_4.rmox_7 = readFloatLE(bytes.slice(i + 4, i + 8));
                i += 8;
                break;
            case 0x24: // rmox_8 / rmox_9
                decoded.tvoc_raw_data_5 = {};
                decoded.tvoc_raw_data_5.rmox_8 = readFloatLE(bytes.slice(i, i + 4));
                decoded.tvoc_raw_data_5.rmox_9 = readFloatLE(bytes.slice(i + 4, i + 8));
                i += 8;
                break;
            case 0x25: // rmox_10 / rmox_11
                decoded.tvoc_raw_data_6 = {};
                decoded.tvoc_raw_data_6.rmox_10 = readFloatLE(bytes.slice(i, i + 4));
                decoded.tvoc_raw_data_6.rmox_11 = readFloatLE(bytes.slice(i + 4, i + 8));
                i += 8;
                break;
            case 0x26: // rmox_12 / zmod_4510_rmox_3
                decoded.tvoc_raw_data_7 = {};
                decoded.tvoc_raw_data_7.rmox_12 = readFloatLE(bytes.slice(i, i + 4));
                decoded.tvoc_raw_data_7.zmod4510_rmox_3 = readFloatLE(bytes.slice(i + 4, i + 8));
                i += 8;
                break;
            case 0x27: // log_rcda / rhtr
                decoded.tvoc_raw_data_8 = {};
                decoded.tvoc_raw_data_8.log_rcda = readFloatLE(bytes.slice(i, i + 4));
                decoded.tvoc_raw_data_8.rhtr = readFloatLE(bytes.slice(i + 4, i + 8));
                i += 8;
                break;
            case 0x28: // temperature / iaq
                decoded.tvoc_raw_data_9 = {};
                decoded.tvoc_raw_data_9.temperature = readFloatLE(bytes.slice(i, i + 4));
                decoded.tvoc_raw_data_9.iaq = readFloatLE(bytes.slice(i + 4, i + 8));
                i += 8;
                break;
            case 0x29: // tvoc / etoh
                decoded.tvoc_raw_data_10 = {};
                decoded.tvoc_raw_data_10.tvoc = readFloatLE(bytes.slice(i, i + 4));
                decoded.tvoc_raw_data_10.etoh = readFloatLE(bytes.slice(i + 4, i + 8));
                i += 8;
                break;
            case 0x2a: // eco2 / rel_iaq
                decoded.tvoc_raw_data_11 = {};
                decoded.tvoc_raw_data_11.eco2 = readFloatLE(bytes.slice(i, i + 4));
                decoded.tvoc_raw_data_11.rel_iaq = readFloatLE(bytes.slice(i + 4, i + 8));
                i += 8;
                break;
            case 0x2b: // pm_sensor_working_time
                decoded.pm_sensor_working_time = readUInt32LE(bytes.slice(i, i + 4));
                i += 4;
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

function readVapeIndexAlarmType(type) {
    var vape_index_alarm_map = {
        0: "collection error", // 0x00
        1: "lower range error", // 0x01
        2: "over range error", // 0x02
        16: "alarm deactivation", // 0x10
        17: "alarm trigger", // 0x11
        32: "interference alarm deactivation", // 0x20
        33: "interference alarm trigger", // 0x21
    };
    return getValue(vape_index_alarm_map, type);
}

function readPMAlarmType(type) {
    var pm_alarm_map = {
        0: "collection error", // 0x00
        1: "lower range error", // 0x01
        2: "over range error", // 0x02
        16: "alarm deactivation", // 0x10
        17: "alarm trigger", // 0x11
    };
    return getValue(pm_alarm_map, type);
}

function readTemperatureAlarmType(type) {
    var temperature_alarm_map = {
        0: "collection error", // 0x00
        1: "lower range error", // 0x01
        2: "over range error", // 0x02
        16: "alarm deactivation", // 0x10
        17: "alarm trigger", // 0x11
        32: "burning alarm deactivation", // 0x20
        33: "burning alarm trigger", // 0x21
    };
    return getValue(temperature_alarm_map, type);
}

function readHumidityAlarmType(type) {
    var humidity_alarm_map = {
        0: "collection error", // 0x00
        1: "lower range error", // 0x01
        2: "over range error", // 0x02
    };
    return getValue(humidity_alarm_map, type);
}

function readTVOCAlarmType(type) {
    var tvoc_alarm_map = {
        0: "collection error", // 0x00
        1: "lower range error", // 0x01
        2: "over range error", // 0x02
        16: "alarm deactivation", // 0x10
        17: "alarm trigger", // 0x11
    };
    return getValue(tvoc_alarm_map, type);
}

function readTamperStatus(type) {
    var tamper_status_map = { 0: "normal", 1: "triggered" };
    return getValue(tamper_status_map, type);
}

function readTamperAlarmType(type) {
    var tamper_alarm_map = {
        32: "alarm deactivation", // 0x20
        33: "alarm trigger", // 0x21
    };
    return getValue(tamper_alarm_map, type);
}

function readBuzzerStatus(type) {
    var buzzer_status_map = { 0: "normal", 1: "triggered" };
    return getValue(buzzer_status_map, type);
}

function readOccupancyStatus(type) {
    var occupancy_status_map = { 0: "vacant", 1: "occupied" };
    return getValue(occupancy_status_map, type);
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
