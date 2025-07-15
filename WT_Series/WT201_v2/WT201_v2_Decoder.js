/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product WT201 v2 (odm: 7089)
 */
var RAW_VALUE = 0x01;

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
        // TEMPERATURE
        else if (channel_id === 0x03 && channel_type === 0x67) {
            decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // TARGET TEMPERATURE
        else if (channel_id === 0x04 && channel_type === 0x67) {
            decoded.Setpoint = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // TARGET TEMPERATURE 2
        else if (channel_id === 0x0b && channel_type === 0x67) {
            decoded.Setpoint_2 = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // TEMPERATURE CONTROL
        else if (channel_id === 0x05 && channel_type === 0xe7) {
            var value = bytes[i];
            // value = temperature_control_mode(0..1) + temperature_control_status(4..7)
            decoded.temperature_control_mode = readTemperatureControlMode((value >>> 0) & 0x03);
            decoded.temperature_control_status = readTemperatureControlStatus((value >>> 4) & 0x0f);
            i += 1;
        }
        // FAN CONTROL
        else if (channel_id === 0x06 && channel_type === 0xe8) {
            var fan_data = bytes[i];
            // value = fan_mode(0..1) + fan_status(2..3)
            decoded.fan_mode = readFanMode((fan_data >>> 0) & 0x03);
            decoded.fan_status = readFanStatus((fan_data >>> 2) & 0x03);
            i += 1;
        }
        // PLAN EVENT
        else if (channel_id === 0x07 && channel_type === 0xbc) {
            var plan_type_data = bytes[i];
            // value = plan_type(0..3)
            decoded.plan_type = readExecutePlanType((plan_type_data >>> 0) & 0x0f);
            i += 1;
        }
        // SYSTEM STATUS
        else if (channel_id === 0x08 && channel_type === 0x8e) {
            decoded.system_status = readOnOffStatus(bytes[i]);
            i += 1;
        }
        // HUMIDITY
        else if (channel_id === 0x09 && channel_type === 0x68) {
            decoded.humidity = readUInt8(bytes[i]) / 2;
            i += 1;
        }
        // RELAY STATUS
        else if (channel_id === 0x0a && channel_type === 0x6e) {
            decoded.wires_relay = readWiresRelay(bytes[i]);
            i += 1;
        }
        // TEMPERATURE MODE SUPPORT
        else if (channel_id === 0xff && channel_type === 0xcb) {
            decoded.temperature_control_support_mode = readTemperatureControlSupportMode(bytes[i]);
            decoded.temperature_control_support_status = readTemperatureControlSupportStatus(bytes[i + 1], bytes[i + 2]);
            i += 3;
        }
        // TEMPERATURE ALARM
        else if (channel_id === 0x83 && channel_type === 0x67) {
            decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            decoded.temperature_alarm = readTemperatureAlarm(bytes[i + 2]);
            i += 3;
        }
        // TEMPERATURE EXCEPTION
        else if (channel_id === 0xb3 && channel_type === 0x67) {
            decoded.temperature_sensor_status = readSensorStatus(bytes[i]);
            i += 1;
        }
        // HUMIDITY EXCEPTION
        else if (channel_id === 0xb9 && channel_type === 0x68) {
            decoded.humidity_sensor_status = readSensorStatus(bytes[i]);
            i += 1;
        }
        // TEMPERATURE OUT OF RANGE ALARM
        else if (channel_id === 0xf9 && channel_type === 0x40) {
            var target_temperature_range_alarm = {};
            target_temperature_range_alarm.temperature_control_mode = readTemperatureControlMode(bytes[i]);
            target_temperature_range_alarm.target_temperature = readInt16LE(bytes.slice(i + 1, i + 3)) / 10;
            target_temperature_range_alarm.min = readInt16LE(bytes.slice(i + 3, i + 5)) / 10;
            target_temperature_range_alarm.max = readInt16LE(bytes.slice(i + 5, i + 7)) / 10;
            i += 7;

            decoded.target_temperature_range_alarm = decoded.target_temperature_range_alarm || [];
            decoded.target_temperature_range_alarm.push(target_temperature_range_alarm);
        }
        // HISTORICAL DATA
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var timestamp = readUInt32LE(bytes.slice(i, i + 4));
            var value1 = readUInt16LE(bytes.slice(i + 4, i + 6));

            var data = {};
            data.timestamp = timestamp;
            // value1 = system_status(0) + fan_mode(1..2) + fan_status(3..4) + temperature_control_mode(5..6) + temperature_control_status(7..10)
            data.system_status = readOnOffStatus(value1 & 0x01);
            data.fan_mode = readFanMode((value1 >>> 1) & 0x03);
            data.fan_status = readFanStatus((value1 >>> 3) & 0x03);
            data.temperature_control_mode = readTemperatureControlMode((value1 >>> 5) & 0x03);
            data.temperature_control_status = readTemperatureControlStatus((value1 >>> 7) & 0x0f);

            data.target_temperature = readInt16LE(bytes.slice(i + 6, i + 8)) / 10;
            var temperature_target_value = readUInt16LE(bytes.slice(i + 8, i + 10));
            if (temperature_target_value !== 0xffff) {
                data.target_temperature_2 = readInt16LE(bytes.slice(i + 8, i + 10)) / 10;
            }
            data.temperature = readInt16LE(bytes.slice(i + 10, i + 12)) / 10;
            data.humidity = readUInt8(bytes[i + 12]) / 2;
            i += 13;

            decoded.history = decoded.history || [];
            decoded.history.push(data);
        }
        // DOWNLINK RESPONSE
        else if (channel_id === 0xfe || channel_id === 0xff) {
            var result = handle_downlink_response(channel_type, bytes, i);
            decoded = Object.assign(decoded, result.data);
            i = result.offset;
        } else if (channel_id === 0xf8 || channel_id === 0xf9) {
            var resultExt = handle_downlink_response_ext(channel_id, channel_type, bytes, i);
            decoded = Object.assign(decoded, resultExt.data);
            i = resultExt.offset;
        } else {
            break;
        }
    }

    return decoded;
}

function handle_downlink_response(channel_type, bytes, offset) {
    var decoded = {};

    switch (channel_type) {
        case 0xb6:
            decoded.fan_mode = readFanMode(bytes[offset]);
            offset += 1;
            break;
        case 0xf4:
            var data = readUInt8(bytes[offset]);
            var element_bit_offset = { all: 0, temperature: 1, humidity: 2, setpoint: 3, plan: 4 };
            decoded.screen_display_config = decoded.screen_display_config || {};
            for (var key in element_bit_offset) {
                decoded.screen_display_config[key] = readEnableStatus((data >>> element_bit_offset[key]) & 0x01);
            }
            break;
        case 0xfa:
            var mode_value = readUInt8(bytes[offset]);
            var setpoint_value = readInt16LE(bytes.slice(offset + 1, offset + 3)) / 10;
            if (mode_value === 0) {
                decoded.heat_setpoint = setpoint_value;
            } else if (mode_value === 1) {
                decoded.em_heat_setpoint = setpoint_value;
            } else if (mode_value === 2) {
                decoded.cool_setpoint = setpoint_value;
            } else if (mode_value === 3) {
                decoded.auto_setpoint = setpoint_value;
            } else if (mode_value === 4) {
                decoded.auto_heat_setpoint = setpoint_value;
            } else if (mode_value === 5) {
                decoded.auto_cool_setpoint = setpoint_value;
            }
            offset += 3;
            break;
        case 0xfb:
            decoded.temperature_control_mode = readTemperatureControlMode(bytes[offset]);
            offset += 1;
            break;

        default:
            throw new Error("unknown downlink response");
    }

    return { data: decoded, offset: offset };
}

function handle_downlink_response_ext(code, channel_type, bytes, offset) {
    var decoded = {};

    switch (channel_type) {
        case 0x57:
            decoded.auto_control_band = readUInt8(bytes[offset]) / 10;
            offset += 1;
            break;
        case 0x5b:
            var mode_value = readUInt8(bytes[offset]);
            var band_value = readUInt8(bytes[offset + 1]);
            if (mode_value === 0) {
                decoded.heat_band = band_value;
            } else if (mode_value === 1) {
                decoded.em_heat_band = band_value;
            } else if (mode_value === 2) {
                decoded.cool_band = band_value;
            } else if (mode_value === 3) {
                decoded.auto_band = band_value;
            }
            offset += 2;
            break;

        default:
            throw new Error("unknown downlink response");
    }

    if (hasResultFlag(code)) {
        var result_value = readUInt8(bytes[offset]);
        offset += 1;

        if (result_value !== 0) {
            var request = decoded;
            decoded = {};
            decoded.device_response_result = {};
            decoded.device_response_result.channel_type = channel_type;
            decoded.device_response_result.result = readResultStatus(result_value);
            decoded.device_response_result.request = request;
        }
    }

    return { data: decoded, offset: offset };
}

function hasResultFlag(code) {
    return code === 0xf8;
}

function readResultStatus(status) {
    var status_map = { 0: "success", 1: "forbidden", 2: "invalid parameter" };
    return getValue(status_map, status);
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

function readEnableStatus(type) {
    var enable_status_map = { 0: "disable", 1: "enable" };
    return getValue(enable_status_map, type);
}

function readOnOffStatus(type) {
    var on_off_status_map = { 0: "off", 1: "on" };
    return getValue(on_off_status_map, type);
}

function readTemperatureAlarm(type) {
    var temperature_alarm_map = {
        1: "emergency heating timeout alarm",
        2: "auxiliary heating timeout alarm",
        3: "persistent low temperature alarm",
        4: "persistent low temperature alarm release",
        5: "persistent high temperature alarm",
        6: "persistent high temperature alarm release",
        7: "freeze protection alarm",
        8: "freeze protection alarm release",
        9: "threshold alarm",
        10: "threshold alarm release",
    };
    return getValue(temperature_alarm_map, type);
}

function readSensorStatus(type) {
    var sensor_status_map = {
        1: "read failed",
        2: "out of range",
    };
    return getValue(sensor_status_map, type);
}

function readExecutePlanType(type) {
    var fix_type = type - 1;
    if (fix_type === -1) {
        fix_type = 255;
    }
    var plan_event_map = {
        0: "wake",
        1: "away",
        2: "home",
        3: "sleep",
        4: "occupied",
        5: "vacant",
        6: "eco",
        255: "not executed",
    };
    return getValue(plan_event_map, fix_type);
}

function readFanMode(type) {
    var fan_mode_map = {
        0: "auto",
        1: "on",
        2: "circulate",
        3: "disable",
    };
    return getValue(fan_mode_map, type);
}

function readFanStatus(type) {
    var fan_status_map = {
        0: "standby",
        1: "high speed",
        2: "low speed",
        3: "on",
    };
    return getValue(fan_status_map, type);
}

function readTemperatureControlMode(type) {
    var temperature_control_mode_map = {
        0: "heat",
        1: "em heat",
        2: "cool",
        3: "auto",
    };
    return getValue(temperature_control_mode_map, type);
}

function readTemperatureControlStatus(type) {
    var temperature_control_status_map = {
        0: "standby",
        1: "stage-1 heat",
        2: "stage-2 heat",
        3: "stage-3 heat",
        4: "stage-4 heat",
        5: "em heat",
        6: "stage-1 cool",
        7: "stage-2 cool",
        8: "stage-5 heat",
    };
    return getValue(temperature_control_status_map, type);
}

function readWiresRelay(status) {
    var relay = {};
    relay.y1 = readOnOffStatus((status >>> 0) & 0x01);
    relay.y2_gl = readOnOffStatus((status >>> 1) & 0x01);
    relay.w1 = readOnOffStatus((status >>> 2) & 0x01);
    relay.w2_aux = readOnOffStatus((status >>> 3) & 0x01);
    relay.e = readOnOffStatus((status >>> 4) & 0x01);
    relay.g = readOnOffStatus((status >>> 5) & 0x01);
    relay.ob = readOnOffStatus((status >>> 6) & 0x01);
    return relay;
}

function readTemperatureControlSupportMode(value) {
    var enable = {};
    enable.heat = readEnableStatus((value >>> 0) & 0x01);
    enable.em_heat = readEnableStatus((value >>> 1) & 0x01);
    enable.cool = readEnableStatus((value >>> 2) & 0x01);
    enable.auto = readEnableStatus((value >>> 3) & 0x01);
    return enable;
}

function readTemperatureControlSupportStatus(heat_mode_value, cool_mode_value) {
    var enable = {};
    enable.stage_1_heat = readEnableStatus((heat_mode_value >>> 0) & 0x01);
    enable.stage_2_heat = readEnableStatus((heat_mode_value >>> 1) & 0x01);
    enable.stage_3_heat = readEnableStatus((heat_mode_value >>> 2) & 0x01);
    enable.stage_4_heat = readEnableStatus((heat_mode_value >>> 3) & 0x01);
    enable.stage_5_heat = readEnableStatus((heat_mode_value >>> 4) & 0x01);
    enable.stage_1_cool = readEnableStatus((cool_mode_value >>> 0) & 0x01);
    enable.stage_2_cool = readEnableStatus((cool_mode_value >>> 1) & 0x01);
    return enable;
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

// hex bytes to hex string
function toHexString(bytes) {
    for (var i = 0; i < bytes.length; i++) {
        bytes[i] = ("0" + bytes[i].toString(16)).slice(-2);
    }
    return bytes.join("");
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
