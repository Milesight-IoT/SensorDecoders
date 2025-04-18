/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product TS301 / TS302
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
        // TEMPERATURE(CHANNEL 1 SENSOR)
        else if (channel_id === 0x03 && channel_type === 0x67) {
            decoded.temperature_chn1 = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // MAGNET STATUS(CHANNEL 1 SENSOR)
        else if (channel_id === 0x03 && channel_type === 0x00) {
            decoded.magnet_chn1 = readMagnetStatus(bytes[i]);
            i += 1;
        }
        // TEMPERATURE(CHANNEL 2 SENSOR)
        else if (channel_id === 0x04 && channel_type === 0x67) {
            decoded.temperature_chn2 = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // MAGNET STATUS(CHANNEL 2 SENSOR)
        else if (channel_id === 0x04 && channel_type === 0x00) {
            decoded.magnet_chn2 = readMagnetStatus(bytes[i]);
            i += 1;
        }
        // TEMPERATURE(CHANNEL 1 SENSOR) ALARM
        else if (channel_id === 0x83 && channel_type === 0x67) {
            decoded.temperature_chn1 = readInt16LE(bytes.slice(i, i + 2)) / 10;
            decoded.temperature_chn1_alarm = readAlarmType(bytes[i + 2]);
            i += 3;
        }
        // TEMPERATURE(CHANNEL 1 SENSOR) ALARM
        else if (channel_id === 0x93 && channel_type === 0xd7) {
            decoded.temperature_chn1 = readInt16LE(bytes.slice(i, i + 2)) / 10;
            decoded.temperature_chn1_change = readInt16LE(bytes.slice(i + 2, i + 4)) / 100;
            decoded.temperature_chn1_alarm = readAlarmType(bytes[i + 4]);
            i += 5;
        }
        // TEMPERATURE(CHANNEL 2 SENSOR) ALARM
        else if (channel_id === 0x84 && channel_type === 0x67) {
            decoded.temperature_chn2 = readInt16LE(bytes.slice(i, i + 2)) / 10;
            decoded.temperature_chn2_alarm = readAlarmType(bytes[i + 2]);
            i += 3;
        }
        // TEMPERATURE(CHANNEL 2 SENSOR) ALARM
        else if (channel_id === 0x94 && channel_type === 0xd7) {
            decoded.temperature_chn2 = readInt16LE(bytes.slice(i, i + 2)) / 10;
            decoded.temperature_chn2_change = readInt16LE(bytes.slice(i + 2, i + 4)) / 100;
            decoded.temperature_chn2_alarm = readAlarmType(bytes[i + 4]);
            i += 5;
        }
        // HISTORICAL DATA
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var timestamp = readUInt32LE(bytes.slice(i, i + 4));
            var mask = bytes[i + 4];
            i += 5;

            var data = {};
            data.timestamp = timestamp;
            var chn1_mask = mask >>> 4;
            var chn2_mask = mask & 0x0f;
            switch (chn1_mask) {
                case 0x01:
                    data.temperature_chn1 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                    data.temperature_chn1_alarm = readAlarmType(1);
                    break;
                case 0x02:
                    data.temperature_chn1 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                    data.temperature_chn1_alarm = readAlarmType(0);
                    break;
                case 0x03:
                    data.temperature_chn1 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                    data.temperature_chn1_alarm = readAlarmType(2);
                    break;
                case 0x04:
                    data.temperature_chn1 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                    break;
                case 0x05:
                    data.magnet_chn1 = readMagnetStatus(readUInt16LE(bytes.slice(i, i + 2)));
                    data.magnet_chn1_alarm = readAlarmType(1);
                    break;
                case 0x06:
                    data.magnet_chn1 = readMagnetStatus(readUInt16LE(bytes.slice(i, i + 2)));
                    break;
                default:
                    break;
            }
            i += 2;

            switch (chn2_mask) {
                case 0x01:
                    data.temperature_chn2 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                    data.temperature_chn2_alarm = readAlarmType(1);
                    break;
                case 0x02:
                    data.temperature_chn2 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                    data.temperature_chn2_alarm = readAlarmType(0);
                    break;
                case 0x03:
                    data.temperature_chn2 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                    data.temperature_chn2_alarm = readAlarmType(2);
                    break;
                case 0x04:
                    data.temperature_chn2 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                    break;
                case 0x05:
                    data.magnet_chn2 = readMagnetStatus(readUInt16LE(bytes.slice(i, i + 2)));
                    data.magnet_chn2_alarm = readAlarmType(1);
                    break;
                case 0x06:
                    data.magnet_chn2 = readMagnetStatus(readUInt16LE(bytes.slice(i, i + 2)));
                    break;
                default:
                    break;
            }
            i += 2;

            decoded.history = decoded.history || [];
            decoded.history.push(data);
        }
        // DOWNLINK RESPONSE
        else if (channel_id === 0xfe || channel_id === 0xff) {
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
        case 0x02:
            decoded.collection_interval = readUInt16LE(bytes.slice(offset, offset + 2));
            offset += 2;
            break;
        case 0x06:
            var data = readUInt8(bytes[offset]);
            decoded.alarm_config = {};
            decoded.alarm_config.enable = readEnableStatus((data >>> 6) & 0x01);
            decoded.alarm_config.alarm_release_enable = readEnableStatus((data >>> 7) & 0x01);
            decoded.alarm_config.condition = readConditionType(data & 0x07);
            decoded.alarm_config.trigger_source = readTriggerSourceType((data >>> 3) & 0x07);
            decoded.alarm_config.min_threshold = readInt16LE(bytes.slice(offset + 1, offset + 3)) / 10;
            decoded.alarm_config.max_threshold = readInt16LE(bytes.slice(offset + 3, offset + 5)) / 10;
            decoded.alarm_config.lock_time = readUInt16LE(bytes.slice(offset + 5, offset + 7));
            decoded.alarm_config.continue_time = readUInt16LE(bytes.slice(offset + 7, offset + 9));
            offset += 9;
            break;
        case 0x10:
            decoded.reboot = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x17:
            decoded.timezone = readInt16LE(bytes.slice(offset, offset + 2)) / 10;
            offset += 2;
            break;
        case 0x25:
            decoded.child_lock = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x27:
            decoded.clear_history = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x28:
            decoded.report_status = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x2d:
            decoded.display_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x4a:
            decoded.sync_time = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x68:
            decoded.history_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x69:
            decoded.retransmit_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x6a:
            var data = readUInt8(bytes[offset]);
            if (data === 0x00) {
                decoded.retransmit_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            } else if (data === 0x01) {
                decoded.resend_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            }
            offset += 3;
            break;
        case 0x6d:
            decoded.stop_transmit = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x8e:
            // skip first byte
            decoded.report_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            offset += 3;
            break;
        case 0x91:
            // skip first byte
            decoded.magnet_throttle = readUInt32LE(bytes.slice(offset + 1, offset + 5));
            offset += 5;
            break;
        case 0xe9:
            decoded.time_display = readTimeDisplayType(bytes[offset]);
            offset += 1;
            break;
        case 0xea:
            var data = readUInt8(bytes[offset]);
            var index = data & 0x01;
            var enable = (data >>> 7) & 0x01;
            var channel_name = "temperature_chn" + (index + 1) + "_calibration";
            decoded[channel_name] = {};
            decoded[channel_name].enable = readEnableStatus(enable);
            decoded[channel_name].calibration_value = readInt16LE(bytes.slice(offset + 1, offset + 3)) / 10;
            offset += 3;
            break;
        case 0xeb:
            decoded.temperature_unit_display = readTemperatureUnitDisplayType(bytes[offset]);
            offset += 1;
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

function readMagnetStatus(status) {
    var status_map = { 0: "closed", 1: "opened" };
    return getValue(status_map, status);
}

function readConditionType(type) {
    var condition_map = { 0: "disable", 1: "below", 2: "above", 3: "between", 4: "outside", 5: "mutation" };
    return getValue(condition_map, type);
}

function readTriggerSourceType(type) {
    var trigger_source_map = { 1: "chn_1_alarm", 2: "chn_2_alarm", 3: "chn_1_mutation", 4: "chn_2_mutation" };
    return getValue(trigger_source_map, type);
}

function readTimeDisplayType(type) {
    var time_display_map = { 0: "12_hour", 1: "24_hour" };
    return getValue(time_display_map, type);
}

function readTemperatureUnitDisplayType(type) {
    var temperature_unit_display_map = { 0: "celsius", 1: "fahrenheit" };
    return getValue(temperature_unit_display_map, type);
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

function readAlarmType(type) {
    var alarm_type_map = { 0: "threshold_release", 1: "threshold", 2: "mutation" };
    return getValue(alarm_type_map, type);
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

