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
                decoded.timestamp = readUInt32LE(bytes.slice(i, i + 4));
                i += 4;
                break;

            // telemetry
            case 0x01:
                decoded.battery = readUInt8(bytes[i]);
                i += 1;
                break;
            case 0x02:
                decoded.timestamp = readUInt32LE(bytes.slice(i, i + 4));
                i += 4;
                break;
            case 0x03:
                var sensor_id_type = readUInt8(bytes[i]);
                decoded.sensor_type = readSensorIDType(sensor_id_type);
                // sensor: SHT41
                if (sensor_id_type === 0x02) {
                    decoded.sensor_sn = readHexString(bytes.slice(i + 1, i + 4));
                }
                // sensor: DB18B20
                else if (sensor_id_type === 0x03) {
                    decoded.sensor_sn = readHexString(bytes.slice(i + 1, i + 9));
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
                decoded.latitude = readInt32LE(bytes.slice(i, i + 4)) / 1000000;
                decoded.longitude = readInt32LE(bytes.slice(i + 4, i + 8)) / 1000000;
                i += 4;
                break;
            case 0x07:
                decoded.airplane_mode = readOnOffStatus(bytes[i]);
                i += 1;
                break;
            case 0x08:
                var event = {};
                var temperature_alarm_type = readUInt8(bytes[i]);
                i += 1;
                event.temperature_alarm = readTemperatureAlarm(temperature_alarm_type);
                if (hasTemperatureValue(temperature_alarm_type)) {
                    event.temperature = readInt32LE(bytes.slice(i, i + 4)) / 100;
                    decoded.temperature = event.temperature;
                    i += 4;
                }
                if (hasTemperatureMutationValue(temperature_alarm_type)) {
                    event.temperature_mutation = readInt32LE(bytes.slice(i, i + 4)) / 100;
                    i += 4;
                }
                decoded.event = decoded.event || [];
                decoded.event.push(event);
                break;
            case 0x09:
                var event = {};
                var humidity_alarm_type = readUInt8(bytes[i]);
                i += 1;
                event.humidity_alarm = readHumidityAlarm(humidity_alarm_type);
                if (hasHumidityValue(humidity_alarm_type)) {
                    event.humidity = readUInt16LE(bytes.slice(i, i + 2)) / 10;
                    decoded.humidity = event.humidity;
                    i += 2;
                }
                if (hasHumidityMutationValue(humidity_alarm_type)) {
                    event.humidity_mutation = readUInt16LE(bytes.slice(i, i + 2)) / 10;
                    i += 2;
                }
                decoded.event = decoded.event || [];
                decoded.event.push(event);
                break;
            case 0x0a:
                var event = {};
                var alarm_type = readUInt8(bytes[i]);
                i += 1;
                event.tilt_alarm = readTiltAlarm(alarm_type);
                decoded.event = decoded.event || [];
                decoded.event.push(event);
                break;
            case 0x0b:
                var event = {};
                var alarm_type = readUInt8(bytes[i]);
                i += 1;
                event.light_alarm = readLightAlarm(alarm_type);
                decoded.event = decoded.event || [];
                decoded.event.push(event);
                break;
            case 0x0c:
                decoded.probe_connect_status = readProbeConnectStatus(bytes[i]);
                i += 1;
                break;
            case 0x0d:
                decoded.angle_x = readInt16LE(bytes.slice(i, i + 2)) / 100;
                decoded.angle_y = readInt16LE(bytes.slice(i + 2, i + 4)) / 100;
                decoded.angle_z = readInt16LE(bytes.slice(i + 4, i + 6)) / 100;
                i += 6;
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

function readOnOffStatus(status) {
    var on_off_status_map = { 0: "off", 1: "on" };
    return getValue(on_off_status_map, status);
}

function readTemperatureAlarm(type) {
    var alarm_map = {
        0: "collection error", // 0x00
        1: "lower range error", // 0x01
        2: "over range error", // 0x02
        3: "no data", // 0x03
        16: "below threshold alarm release", // 0x10
        17: "below threshold alarm", // 0x11
        18: "above threshold alarm release", // 0x12
        19: "above threshold alarm", // 0x13
        20: "between threshold alarm release", // 0x14
        21: "between threshold alarm", // 0x15
        22: "outside threshold alarm release", // 0x16
        23: "outside threshold alarm", // 0x17
        32: "mutation alarm", // 0x20
        33: "mutation alarm", // 0x21
    };
    return getValue(alarm_map, type);
}

function hasTemperatureValue(type) {
    return type === 0x10 || type === 0x11 || type === 0x12 || type === 0x13 || type === 0x14 || type === 0x15 || type === 0x16 || type === 0x17 || type === 0x20 || type === 0x21;
}

function hasTemperatureMutationValue(type) {
    return type === 0x21;
}

function readHumidityAlarm(type) {
    var alarm_map = {
        0: "collection error", // 0x00
        1: "lower range error", // 0x01
        2: "over range error", // 0x02
        3: "no data", // 0x03
        16: "below threshold alarm release", // 0x10
        17: "below threshold alarm", // 0x11
        18: "above threshold alarm release", // 0x12
        19: "above threshold alarm", // 0x13
        20: "between threshold alarm release", // 0x14
        21: "between threshold alarm", // 0x15
        22: "outside threshold alarm release", // 0x16
        23: "outside threshold alarm", // 0x17
        32: "mutation alarm", // 0x20
        33: "mutation alarm", // 0x21
    };
    return getValue(alarm_map, type);
}

function hasHumidityValue(type) {
    return type === 0x10 || type === 0x11 || type === 0x12 || type === 0x13 || type === 0x14 || type === 0x15 || type === 0x16 || type === 0x17 || type === 0x20 || type === 0x21;
}

function hasHumidityMutationValue(type) {
    return type === 0x21;
}

function readTiltAlarm(type) {
    var alarm_map = {
        0: "collection error", // 0x00
        1: "lower range error", // 0x01
        2: "over range error", // 0x02
        3: "no data", // 0x03
        16: "tilt alarm release", // 0x10
        17: "tilt alarm", // 0x11
        33: "fall down alarm", // 0x21
    };
    return getValue(alarm_map, type);
}

function readLightAlarm(type) {
    var alarm_map = {
        0: "collection error", // 0x00
        1: "lower range error", // 0x01
        2: "over range error", // 0x02
        3: "no data", // 0x03
        16: "bright to dark", // 0x10
        17: "dark to bright", // 0x11
    };
    return getValue(alarm_map, type);
}

function readProbeConnectStatus(type) {
    var probe_connect_status_map = {
        0: "disconnected",
        1: "connected",
    };
    return getValue(probe_connect_status_map, type);
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
