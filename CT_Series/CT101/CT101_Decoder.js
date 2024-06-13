/**
 * Payload Decoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product CT10x
 */
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
    for (i = 0; i < bytes.length; ) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];

        // POWER STATE
        if (channel_id === 0xff && channel_type === 0x0b) {
            decoded.power = "on";
            i += 1;
        }
        // IPSO VERSION
        else if (channel_id === 0xff && channel_type === 0x01) {
            decoded.ipso_version = readProtocolVersion(bytes[i]);
            i += 1;
        }
        // PRODUCT SERIAL NUMBER
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
        // TOTAL CURRENT
        else if (channel_id === 0x03 && channel_type === 0x97) {
            decoded.total_current = readUInt32LE(bytes.slice(i, i + 4)) / 100;
            i += 4;
        }
        // CURRENT
        else if (channel_id === 0x04 && channel_type === 0x98) {
            var value = readUInt16LE(bytes.slice(i, i + 2));
            if (value === 0xffff) {
                decoded.alarm = "read failed";
            } else {
                decoded.current = value / 100;
            }
            i += 2;
        }
        // TEMPERATURE
        else if (channel_id === 0x09 && channel_type === 0x67) {
            var temperature_value = readUInt16LE(bytes.slice(i, i + 2));
            if (temperature_value === 0xfffd) {
                decoded.temperature_exception = "over range alarm";
            } else if (temperature_value === 0xffff) {
                decoded.temperature_exception = "read failed";
            } else {
                decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            }
            i += 2;
        }
        // CURRENT ALARM
        else if (channel_id === 0x84 && channel_type === 0x98) {
            decoded.current_max = readUInt16LE(bytes.slice(i, i + 2)) / 100;
            decoded.current_min = readUInt16LE(bytes.slice(i + 2, i + 4)) / 100;
            decoded.current = readUInt16LE(bytes.slice(i + 4, i + 6)) / 100;
            decoded.alarm = readCurrentAlarm(bytes[i + 6]);
            i += 7;
        }
        // TEMPERATURE ALARM
        else if (channel_id === 0x89 && channel_type === 0x67) {
            decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            decoded.temperature_alarm = readTemperatureAlarm(bytes[i + 2]);
            i += 3;
        } else {
            break;
        }
    }

    return decoded;
}

/* ******************************************
 * bytes to number
 ********************************************/
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
    // JavaScript bitwise operators yield a 32 bits integer, not a float.
    // Assume LSB (least significant byte first).
    var bits = (bytes[3] << 24) | (bytes[2] << 16) | (bytes[1] << 8) | bytes[0];
    var sign = bits >>> 31 === 0 ? 1.0 : -1.0;
    var e = (bits >>> 23) & 0xff;
    var m = e === 0 ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
    var f = sign * m * Math.pow(2, e - 150);
    return f;
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

function readSerialNumber(bytes) {
    var temp = [];
    for (var idx = 0; idx < bytes.length; idx++) {
        temp.push(("0" + (bytes[idx] & 0xff).toString(16)).slice(-2));
    }
    return temp.join("");
}

function readCurrentAlarm(type) {
    var alarm = [];
    if ((type >> 0) & 0x01) {
        alarm.push("threshold alarm");
    }
    if ((type >> 1) & 0x01) {
        alarm.push("threshold alarm release");
    }
    if ((type >> 2) & 0x01) {
        alarm.push("over range alarm");
    }
    if ((type >> 3) & 0x01) {
        alarm.push("over range alarm release");
    }
    return alarm;
}
