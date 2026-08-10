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
        // DOWNLINK RESPONSE
        else if (channel_id === 0xfe) {
            var result = handle_downlink_response(channel_type, bytes, i);
            decoded = Object.assign(decoded, result.data);
            i = result.offset;
        } else {
            break;
        }
    }

    return decoded;
}

function handle_downlink_response(channel_type, bytes, offset) {
    var decoded = {};

    switch (channel_type) {
        case 0x8e:
            // ignore the reserved ID byte
            decoded.report_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            offset += 3;
            break;
        case 0x29:
            decoded.valve_descale = readYesNoStatus(bytes[offset] === 0x00 ? 1 : 0);
            offset += 1;
            break;
        case 0xbd:
            decoded.time_zone = readInt16LE(bytes.slice(offset, offset + 2));
            offset += 2;
            break;
        default:
            throw new Error("unknown downlink response");
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
    return "v" + major + "." + minor;
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
