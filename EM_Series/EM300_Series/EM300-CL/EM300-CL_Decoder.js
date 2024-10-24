/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product EM300-CL
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

    for (var i = 0; i < bytes.length;) {
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
        // TSL VERSION
        else if (channel_id === 0xff && channel_type === 0xff) {
            decoded.tsl_version = readTslVersion(bytes.slice(i, i + 2));
            i += 2;
        }
        // SERIAL NUMBER
        else if (channel_id === 0xff && channel_type === 0x16) {
            decoded.sn = readSerialNumber(bytes.slice(i, i + 8));
            i += 8;
        }
        // LORAWAN CLASS TYPE
        else if (channel_id === 0xff && channel_type === 0x0f) {
            decoded.lorawan_class = readLoRaWANClass(bytes[i]);
            i += 1;
        }
        // RESET EVENT
        else if (channel_id === 0xff && channel_type === 0xfe) {
            decoded.reset_event = readResetEvent(1);
            i += 1;
        }
        // DEVICE STATUS
        else if (channel_id === 0xff && channel_type === 0x0b) {
            decoded.device_status = readDeviceStatus(1);
            i += 1;
        }
        // BATTERY
        else if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = readUInt8(bytes[i]);
            i += 1;
        }
        // LIQUID
        else if (channel_id === 0x03 && channel_type === 0xed) {
            decoded.liquid = readLiquidStatus(bytes[i]);
            i += 1;
        }
        // CALIBRATION RESULT
        else if (channel_id === 0x04 && channel_type === 0xee) {
            decoded.calibration_result = readCalibrationResult(bytes[i]);
            i += 1;
        }
        // LIQUID ALARM
        else if (channel_id === 0x83 && channel_type === 0xed) {
            decoded.liquid = readLiquidStatus(bytes[i]);
            decoded.liquid_alarm = readAlarmType(bytes[i + 1]);
            i += 2;
        }
        // DOWNLINK RESPONSE
        else if (channel_id === 0xfe || channel_id === 0xff) {
            var result = handle_downlink_response(channel_type, bytes, i);
            decoded = Object.assign(decoded, result.data);
            i = result.offset;
        }
        else {
            break;
        }
    }

    return decoded;
}

function handle_downlink_response(channel_type, bytes, offset) {
    var decoded = {};

    switch (channel_type) {
        case 0x10:
            decoded.reboot = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x28:
            decoded.report_status = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x62:
            decoded.calibrate = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x7e:
            decoded.alarm_config = {};
            decoded.alarm_config.enable = readEnableStatus(bytes[offset] & 0x01);
            decoded.alarm_config.alarm_release_enable = readEnableStatus((bytes[offset] >> 7) & 0x01);
            decoded.alarm_config.alarm_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            decoded.alarm_config.alarm_counts = readUInt16LE(bytes.slice(offset + 3, offset + 5));
            offset += 5;
            break;
        case 0x8e:
            // ignore first byte
            decoded.report_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            offset += 3;
            break;
        case 0xbb:
            // ignore first byte
            decoded.collection_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            offset += 3;
            break;
        case 0xbe:
            var data = bytes[offset];
            if (data === 0x00) {
                decoded.query_capacitor_calibration_value = readYesNoStatus(1);
            } else if (data === 0x01) {
                decoded.query_capacitor_value = readYesNoStatus(1);
            } else if (data === 0x02) {
                decoded.query_capacitor_judge_value = readYesNoStatus(1);
            }
            offset += 1;
            break;
        case 0xbf:
            var data = bytes[offset];
            if (data === 0x00) {
                decoded.capacitor_config = {};
                decoded.capacitor_config.c1 = readUInt16LE(bytes.slice(offset + 1, offset + 3)) / 100;
                decoded.capacitor_config.c2 = readUInt16LE(bytes.slice(offset + 3, offset + 5)) / 100;
                decoded.capacitor_config.delta = readUInt16LE(bytes.slice(offset + 5, offset + 7)) / 100;
            } else if (data === 0x01) {
                decoded.capacitor_judge_config = {};
                decoded.capacitor_judge_config.c1 = readUInt16LE(bytes.slice(offset + 1, offset + 3)) / 100;
                decoded.capacitor_judge_config.c2 = readUInt16LE(bytes.slice(offset + 3, offset + 5)) / 100;
                decoded.capacitor_judge_config.delta = readUInt16LE(bytes.slice(offset + 5, offset + 7)) / 100;
            }
            offset += 9;
            break;
        case 0xc0:
            decoded.calibrate_delay_time = readUInt16LE(bytes.slice(offset, offset + 2));
            offset += 2;
            break;
        default:
            throw new Error("unknown downlink response");
    }

    return { data: decoded, offset: offset };
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
    var class_map = {
        0: "Class A",
        1: "Class B",
        2: "Class C",
        3: "Class CtoB",
    };
    return getValue(class_map, type);
}

function readResetEvent(status) {
    var status_map = { 0: "normal", 1: "reset" };
    return getValue(status_map, status);
}

function readDeviceStatus(status) {
    var status_map = { 0: "off", 1: "on" };
    return getValue(status_map, status);
}

function readEnableStatus(status) {
    var status_map = { 0: "disable", 1: "enable" };
    return getValue(status_map, status);
}

function readYesNoStatus(status) {
    var status_map = { 0: "no", 1: "yes" };
    return getValue(status_map, status);
}

function readLiquidStatus(type) {
    var liquid_status_map = { 0: "uncalibrated", 1: "full", 2: "critical liquid level alert", 255: "error" };
    return getValue(liquid_status_map, type);
}

function readAlarmType(type) {
    var alarm_type_map = { 0: "critical liquid level alarm release", 1: "critical liquid level alarm" };
    return getValue(alarm_type_map, type);
}

function readCalibrationResult(type) {
    var calibration_result_map = { 0: "failed", 1: "success" };
    return getValue(calibration_result_map, type);
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

function getValue(map, key) {
    if (RAW_VALUE) return key;

    var value = map[key];
    if (!value) value = "unknown";
    return value;
}

if (!Object.assign) {
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
}
