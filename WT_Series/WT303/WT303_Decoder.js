/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product WT303
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
            case 0xc8: // device status
                decoded.device_status = readDeviceStatus(bytes[i]);
                i += 1;
                break;
            case 0xcf: // lorawan class
                decoded.lorawan_class = readLoRaWANClass(bytes[i]);
                i += 1;
                break;

            // telemetry

            case 0x01: // temperature
                decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
                i += 2;
                break;
            case 0x02: // humidity
                decoded.humidity = readUInt16LE(bytes.slice(i, i + 2)) / 10;
                i += 2;
                break;
            case 0x03: // target_temperature
                decoded.target_temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
                i += 2;
                break;
            case 0x04: // temperature_control_status
                decoded.temperature_control_status = readTemperatureControlStatus(bytes[i]);
                i += 1;
                break;
            case 0x68: // temperature_control_mode
                decoded.temperature_control_mode = readTemperatureControlMode(bytes[i]);
                i += 1;
                break;
            case 0x05: // valve_status
                decoded.valve_status = readValveStatus(bytes[i]);
                i += 1;
                break;
            case 0x06: // fan_status
                decoded.fan_status = readFanStatus(bytes[i]);
                i += 1;
                break;
            case 0x72: // fan_mode
                decoded.fan_mode = readFanMode(bytes[i]);
                i += 1;
                break;
            case 0x07: // plan_id
                decoded.plan_id = readUInt8(bytes[i]);
                i += 1;
                break;
            case 0x08: // temperature_alarm
                var temperature_alarm = {};
                var alarm_type = readUInt8(bytes[i]);

                temperature_alarm.type = readTemperatureAlarmType(alarm_type);
                if (alarm_type === 0x10 || alarm_type === 0x11 || alarm_type === 0x12 || alarm_type === 0x13 || alarm_type === 0x20 || alarm_type === 0x21 || alarm_type === 0x22 || alarm_type === 0x23 || alarm_type === 0x30 || alarm_type === 0x31 || alarm_type === 0x32 || alarm_type === 0x33) {
                    temperature_alarm.temperature = readInt16LE(bytes.slice(i + 1, i + 3)) / 10;
                    i += 3;
                } else {
                    i += 1;
                }

                decoded.temperature_alarm = temperature_alarm;
                break;
            case 0x09:
                decoded.humidity_alarm = readHumidityAlarm(bytes[i]);
                i += 1;
                break;
            case 0x67:
                decoded.system_status = readSystemStatus(bytes[i]);
                i += 1;
                break;
            default:
                throw new Error("unknown command: " + command_id);
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

function readTemperatureControlStatus(type) {
    var status_map = { 0: "standby", 1: "heating", 2: "cooling" };
    return getValue(status_map, type);
}

function readTemperatureControlMode(type) {
    var mode_map = { 0: "fan", 1: "heating", 2: "cooling" };
    return getValue(mode_map, type);
}

function readValveStatus(type) {
    var status_map = { 0: "off", 100: "on" };
    return getValue(status_map, type);
}

function readFanMode(type) {
    var mode_map = { 0: "auto", 1: "low", 2: "medium", 3: "high" };
    return getValue(mode_map, type);
}

function readFanStatus(type) {
    var status_map = { 0: "off", 1: "low", 2: "medium", 3: "high" };
    return getValue(status_map, type);
}

function readTemperatureAlarmType(type) {
    var type_map = {
        0: "collection error", // 0x00
        1: "lower range error", // 0x01
        2: "over range error", // 0x02
        16: "low temperature alarm release", // 0x10
        17: "low temperature alarm", // 0x11
        18: "high temperature alarm release", // 0x12
        19: "high temperature alarm", // 0x13
        32: "continuous low temperature alarm release", // 0x20
        33: "continuous low temperature alarm", // 0x21
        34: "continuous high temperature alarm release", // 0x22
        35: "continuous high temperature alarm", // 0x23
        48: "freeze alarm release", // 0x30
        49: "freeze alarm", // 0x31
        50: "window open alarm release", // 0x32
        51: "window open alarm", // 0x33
    };
    return getValue(type_map, type);
}

function readHumidityAlarm(type) {
    var type_map = {
        0: "collection error", // 0x00
        1: "lower range error", // 0x01
        2: "over range error", // 0x02
    };
    return getValue(type_map, type);
}

function readSystemStatus(type) {
    var status_map = { 0: "off", 1: "on" };
    return getValue(status_map, type);
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
