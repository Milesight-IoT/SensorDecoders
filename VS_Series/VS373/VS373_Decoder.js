/**
 * Payload Decoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product VS373
 */
var RAW_VALUE = 0x01;

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

    for (var i = 0; i < bytes.length; ) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];

        // IPSO VERSION
        if (channel_id === 0xff && channel_type === 0x01) {
            decoded.ipso_version = readProtocolVersion(bytes[i]);
            i += 1;
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
        // DEVICE STATUS
        else if (channel_id === 0xff && channel_type === 0x0b) {
            decoded.device_status = readDeviceStatus(bytes[i]);
            i += 1;
        }
        // LORAWAN CLASS
        else if (channel_id === 0xff && channel_type === 0x0f) {
            decoded.lorawan_class = readLoRaWANClass(bytes[i]);
            i += 1;
        }
        // PRODUCT SERIAL NUMBER
        else if (channel_id === 0xff && channel_type === 0x16) {
            decoded.sn = readSerialNumber(bytes.slice(i, i + 8));
            i += 8;
        }
        // TSL VERSION
        else if (channel_id === 0xff && channel_type === 0xff) {
            decoded.tsl_version = readTslVersion(bytes.slice(i, i + 2));
            i += 2;
        }
        // DETECTION TARGET
        else if (channel_id === 0x03 && channel_type === 0xf8) {
            decoded.detection_status = readDetectionStatus(bytes[i]);
            decoded.target_status = readTargetStatus(bytes[i + 1]);
            decoded.use_time_now = readUInt16LE(bytes.slice(i + 2, i + 4));
            decoded.use_time_today = readUInt16LE(bytes.slice(i + 4, i + 6));
            i += 6;
        }
        // REGION OCCUPANCY
        else if (channel_id === 0x04 && channel_type === 0xf9) {
            decoded.region_1_occupancy = readRegionStatus(bytes[i]);
            decoded.region_2_occupancy = readRegionStatus(bytes[i + 1]);
            decoded.region_3_occupancy = readRegionStatus(bytes[i + 2]);
            decoded.region_4_occupancy = readRegionStatus(bytes[i + 3]);
            i += 4;
        }
        // OUT OF BED
        else if (channel_id === 0x05 && channel_type === 0xfa) {
            decoded.region_1_out_of_bed_time = readUInt16LE(bytes.slice(i, i + 2));
            decoded.region_2_out_of_bed_time = readUInt16LE(bytes.slice(i + 2, i + 4));
            decoded.region_3_out_of_bed_time = readUInt16LE(bytes.slice(i + 4, i + 6));
            decoded.region_4_out_of_bed_time = readUInt16LE(bytes.slice(i + 6, i + 8));
            i += 8;
        }
        // ALARM
        else if (channel_id === 0x06 && channel_type === 0xfb) {
            var event = {};
            event.alarm_id = readUInt16LE(bytes.slice(i, i + 2));
            event.alarm_type = readAlarmType(bytes[i + 2]);
            event.alarm_status = readAlarmStatus(bytes[i + 3]);
            // EVENT TYPE: OUT OF BED
            var event_type = bytes[i + 2];
            if (event_type === 3) {
                event.region_id = readUInt8(bytes[i + 4]);
            }
            i += 5;

            decoded.events = decoded.events || [];
            decoded.events.push(event);
        }
        // HISTORY DATA
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var data = {};
            data.id = readUInt16LE(bytes.slice(i, i + 2));
            data.event_type = readAlarmType(bytes[i + 2]);
            data.event_status = readAlarmStatus(bytes[i + 3]);
            var event_type = bytes[i + 2];
            // EVENT TYPE: OUT OF BED
            if (event_type === 3) {
                data.region_id = readUInt8(bytes[i + 4]);
            }
            i += 5;

            decoded.history = decoded.history || [];
            decoded.history.push(data);
        } else {
            break;
        }
    }

    return decoded;
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

function readFloatLE(bytes) {
    var bits = (bytes[3] << 24) | (bytes[2] << 16) | (bytes[1] << 8) | bytes[0];
    var sign = bits >>> 31 === 0 ? 1.0 : -1.0;
    var e = (bits >>> 23) & 0xff;
    var m = e === 0 ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
    var f = sign * m * Math.pow(2, e - 150);
    return f;
}

function getValue(map, key) {
    if (RAW_VALUE) return key;

    var value = map[key];
    if (!value) value = "unknown";
    return value;
}

function readProtocolVersion(bytes) {
    var major = (bytes & 0xf0) >> 4;
    var minor = bytes & 0x0f;
    return "v" + major + "." + minor;
}

function readHardwareVersion(bytes) {
    var major = bytes[0] & 0xff;
    var minor = (bytes[1] & 0xff) >> 4;
    return "v" + major + "." + minor;
}

function readFirmwareVersion(bytes) {
    var major = bytes[0] & 0xff;
    var minor = bytes[1] & 0xff;
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

function readLoRaWANClass(type) {
    var lorawan_class_map = {
        0: "Class A",
        1: "Class B",
        2: "Class C",
        3: "Class CtoB",
    };
    return getValue(lorawan_class_map, type);
}

function readDeviceStatus(status) {
    var device_status_map = {
        0: "offline",
        1: "online",
    };
    return getValue(device_status_map, status);
}

function readDetectionStatus(status) {
    var detection_status_map = {
        0: "normal",
        1: "vacant",
        2: "in bed",
        3: "out of bed",
        4: "fall",
    };
    return getValue(detection_status_map, status);
}

function readTargetStatus(status) {
    var target_status_map = {
        0: "normal",
        1: "motionless",
        2: "abnormal",
    };
    return getValue(target_status_map, status);
}

function readRegionStatus(status) {
    var region_status_map = {
        0: "occupied",
        1: "vacant",
    };
    return getValue(region_status_map, status);
}

function readAlarmType(type) {
    var alarm_type_map = {
        0: "fall",
        1: "motionless",
        2: "dwell",
        3: "out of bed",
        4: "occupied",
        5: "vacant",
    };
    return getValue(alarm_type_map, type);
}

function readAlarmStatus(status) {
    var alarm_status_map = {
        1: "alarm triggered",
        2: "alarm deactivated",
        3: "alarm ignored",
    };
    return getValue(alarm_status_map, status);
}
