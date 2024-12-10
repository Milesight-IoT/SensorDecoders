/**
 * Payload Decoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product WT201 v2
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
        // LORAWAN CLASS TYPE
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
        // TEMPERATURE
        else if (channel_id === 0x03 && channel_type === 0x67) {
            decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // TARGET TEMPERATURE
        else if (channel_id === 0x04 && channel_type === 0x67) {
            decoded.target_temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // TEMPERATURE CONTROL
        else if (channel_id === 0x05 && channel_type === 0xe7) {
            var value = bytes[i];
            decoded.temperature_control_mode = readTemperatureControlMode(value & 0x03);
            decoded.temperature_control_status = readTemperatureControlStatus((value >>> 4) & 0x0f);
            i += 1;
        }
        // FAN CONTROL
        else if (channel_id === 0x06 && channel_type === 0xe8) {
            var value = bytes[i];
            decoded.fan_mode = readFanMode(value & 0x03);
            decoded.fan_status = readFanStatus((value >>> 2) & 0x03);
            i += 1;
        }
        // PLAN EVENT
        else if (channel_id === 0x07 && channel_type === 0xbc) {
            var value = bytes[i];
            decoded.plan_event = readPlanEvent(value & 0x0f);
            i += 1;
        }
        // SYSTEM STATUS
        else if (channel_id === 0x08 && channel_type === 0x8e) {
            decoded.system_status = readSystemStatus(bytes[i]);
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
        // PLAN
        else if (channel_id === 0xff && channel_type === 0xc9) {
            var schedule = {};
            schedule.type = readPlanType(bytes[i]);
            schedule.index = readUInt8(bytes[i + 1]) + 1;
            schedule.plan_enable = readEnableStatus(bytes[i + 2]);
            schedule.week_recycle = readWeekRecycleSettings(bytes[i + 3]);
            schedule.time = readUInt16LE(bytes.slice(i + 4, i + 6));
            i += 6;

            decoded.plan_schedule = decoded.plan_schedule || [];
            decoded.plan_schedule.push(schedule);
        }
        // PLAN SETTINGS
        else if (channel_id === 0xff && channel_type === 0xc8) {
            var plan_setting = {};
            plan_setting.type = readPlanType(bytes[i]);
            plan_setting.temperature_control_mode = readTemperatureControlMode(bytes[i + 1]);
            plan_setting.fan_mode = readFanMode(bytes[i + 2]);
            plan_setting.temperature_target = readUInt8(bytes[i + 3] & 0x7f);
            plan_setting.temperature_unit = readTemperatureUnit(bytes[i + 3] >>> 7);
            plan_setting.temperature_error = readUInt8(bytes[i + 4]) / 10;
            i += 5;

            decoded.plan_settings = decoded.plan_settings || [];
            decoded.plan_settings.push(plan_setting);
        }
        // WIRES
        else if (channel_id === 0xff && channel_type === 0xca) {
            decoded.wires = readWires(bytes[i], bytes[i + 1], bytes[i + 2]);
            decoded.ob_mode = readObMode((bytes[i + 2] >>> 2) & 0x03);
            i += 3;
        }
        // TEMPERATURE MODE SUPPORT
        else if (channel_id === 0xff && channel_type === 0xcb) {
            decoded.temperature_control_mode_enable = readTemperatureControlModeEnable(bytes[i]);
            decoded.temperature_control_status_enable = readTemperatureControlStatusEnable(bytes[i + 1], bytes[i + 2]);
            i += 3;
        }
        // CONTROL PERMISSIONS
        else if (channel_id === 0xff && channel_type === 0xf6) {
            decoded.control_permissions = bytes[i] === 1 ? "remote control" : "thermostat";
            i += 1;
        }
        // TEMPERATURE ALARM
        else if (channel_id === 0x83 && channel_type === 0x67) {
            decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            decoded.temperature_alarm = readTemperatureAlarm(bytes[i + 2]);
            i += 2;
        }
        // TEMPERATURE EXCEPTION
        else if (channel_id === 0xb3 && channel_type === 0x67) {
            decoded.temperature_exception = readException(bytes[i]);
            i += 1;
        }
        // HUMIDITY EXCEPTION
        else if (channel_id === 0xb9 && channel_type === 0x68) {
            decoded.humidity_exception = readException(bytes[i]);
            i += 1;
        }
        // HISTORICAL DATA
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var timestamp = readUInt32LE(bytes.slice(i, i + 4));
            var value1 = readUInt16LE(bytes.slice(i + 4, i + 6));
            var value2 = readUInt16LE(bytes.slice(i + 6, i + 8));

            var data = { timestamp: timestamp };
            // fan_mode(0..1) + fan_status(2..3) + system_status(4) + temperature(5..15)
            data.fan_mode = readFanMode(value1 & 0x03);
            data.fan_status = readFanStatus((value1 >>> 2) & 0x03);
            data.system_status = readSystemStatus((value1 >>> 4) & 0x01);
            var temperature = ((value1 >>> 5) & 0x7ff) / 10 - 100;
            data.temperature = Number(temperature.toFixed(1));

            // temperature_control_mode(0..1) + temperature_control_status(2..4) + temperature_target(5..15)
            data.temperature_control_mode = readTemperatureControlMode(value2 & 0x03);
            data.temperature_control_status = readTemperatureControlStatus((value2 >>> 2) & 0x07);
            var temperature_target = ((value2 >>> 5) & 0x7ff) / 10 - 100;
            data.temperature_target = Number(temperature_target.toFixed(1));
            i += 8;

            decoded.history = decoded.history || [];
            decoded.history.push(data);
        } else if (channel_id === 0x21 && channel_type === 0xce) {
            var timestamp = readUInt32LE(bytes.slice(i, i + 4));
            var value1 = readUInt16LE(bytes.slice(i + 4, i + 6));
            // system_status(0) + fan_mode(1..2) + fan_status(3..4) + temperature_control_mode(5..6) + temperature_control_status(7..10)
            decoded.system_status = readSystemStatus(value1 & 0x01);
            decoded.fan_mode = readFanMode((value1 >>> 1) & 0x03);
            decoded.fan_status = readFanStatus((value1 >>> 3) & 0x03);
            decoded.temperature_control_mode = readTemperatureCtlMode((value1 >>> 5) & 0x03);
            decoded.temperature_control_status = readTemperatureCtlStatus((value1 >>> 7) & 0x0f);

            decoded.temperature_target = readInt16LE(bytes.slice(i + 6, i + 8)) / 10;
            decoded.temperature = readInt16LE(bytes.slice(i + 8, i + 10)) / 10;
            decoded.humidity = readUInt8(bytes[i + 10]) / 2;
            i += 11;

            decoded.history = decoded.history || [];
            decoded.history.push(data);
        }
        // DOWNLINK RESPONSE
        else if (channel_id === 0xfe) {
            result = handle_downlink_response(channel_type, bytes, i);
            decoded = Object.assign(decoded, result.data);
            i = result.offset;
        } else if (channel_id === 0xf8) {
            result = handle_downlink_response_ext(channel_type, bytes, i);
            decoded = Object.assign(decoded, result.data);
            i = result.offset;
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

function readD2DCommand(bytes) {
    return ("0" + (bytes[1] & 0xff).toString(16)).slice(-2) + ("0" + (bytes[0] & 0xff).toString(16)).slice(-2);
}

function readLoRaWANClass(type) {
    if (RAW_VALUE) return type;

    var lorawan_class_map = {
        0: "Class A",
        1: "Class B",
        2: "Class C",
        3: "ClassCtoB",
    };
    return getValue(lorawan_class_map, type);
}

function readDeviceStatus(type) {
    if (RAW_VALUE) return type;

    var device_status_map = {
        0: "offline",
        1: "online",
    };
    return getValue(device_status_map, type);
}

function readEnableStatus(type) {
    if (RAW_VALUE) return type;

    var enable_status_map = {
        0: "disable",
        1: "enable",
    };
    return getValue(enable_status_map, type);
}

function readTemperatureUnit(type) {
    if (RAW_VALUE) return type;

    var temperature_unit_map = {
        0: "celsius",
        1: "fahrenheit",
    };
    return getValue(temperature_unit_map, type);
}

function readTemperatureAlarm(type) {
    if (RAW_VALUE) return type;

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

function readException(type) {
    if (RAW_VALUE) return type;

    var exception_map = {
        1: "read failed",
        2: "out of range",
    };
    return getValue(exception_map, type);
}

function readSensorStatus(type) {
    if (RAW_VALUE) return type;

    var sensor_status_map = {
        1: "read failed",
        2: "out of range",
    };
    return getValue(sensor_status_map, type);
}

function readPlanEvent(type) {
    if (RAW_VALUE) return type;

    var plan_event_map = {
        0: "not executed",
        1: "wake",
        2: "away",
        3: "home",
        4: "sleep",
        5: "occupied",
        6: "vacant",
        7: "eco",
    };
    return getValue(plan_event_map, type);
}

function readPlanType(type) {
    if (RAW_VALUE) return type;

    var plan_type_map = {
        0: "wake",
        1: "away",
        2: "home",
        3: "sleep",
        4: "occupied",
        5: "vacant",
        6: "eco",
    };
    return getValue(plan_type_map, type);
}

function readFanMode(type) {
    if (RAW_VALUE) return type;

    var fan_mode_map = {
        0: "auto",
        1: "on",
        2: "circulate",
        3: "disable",
    };
    return getValue(fan_mode_map, type);
}

function readFanStatus(type) {
    if (RAW_VALUE) return type;

    var fan_status_map = {
        0: "standby",
        1: "high speed",
        2: "low speed",
        3: "on",
    };
    return getValue(fan_status_map, type);
}

function readSystemStatus(type) {
    if (RAW_VALUE) return type;

    var system_status_map = {
        0: "off",
        1: "on",
    };
    return getValue(system_status_map, type);
}

function readTemperatureControlMode(type) {
    if (RAW_VALUE) return type;

    var temperature_control_mode_map = {
        0: "heat",
        1: "em heat",
        2: "cool",
        3: "auto",
    };
    return getValue(temperature_control_mode_map, type);
}

function readTemperatureControlStatus(type) {
    if (RAW_VALUE) return type;

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

function readWires(wire1, wire2, wire3) {
    var wire = [];
    if ((wire1 >>> 0) & 0x03) {
        wire.push("Y1");
    }
    if ((wire1 >>> 2) & 0x03) {
        wire.push("GH");
    }
    if ((wire1 >>> 4) & 0x03) {
        wire.push("OB");
    }
    if ((wire1 >>> 6) & 0x03) {
        wire.push("W1");
    }
    if ((wire2 >>> 0) & 0x03) {
        wire.push("E");
    }
    if ((wire2 >>> 2) & 0x03) {
        wire.push("DI");
    }
    if ((wire2 >>> 4) & 0x03) {
        wire.push("PEK");
    }
    var w2_aux_wire = (wire2 >>> 6) & 0x03;
    switch (w2_aux_wire) {
        case 1:
            wire.push("W2");
            break;
        case 2:
            wire.push("AUX");
            break;
    }
    var y2_gl_wire = (wire3 >>> 0) & 0x03;
    switch (y2_gl_wire) {
        case 1:
            wire.push("Y2");
            break;
        case 2:
            wire.push("GL");
            break;
    }

    return wire;
}

function readWiresRelay(status) {
    var relay = {};

    relay.y1 = (status >>> 0) & 0x01;
    relay.y2_gl = (status >>> 1) & 0x01;
    relay.w1 = (status >>> 2) & 0x01;
    relay.w2_aux = (status >>> 3) & 0x01;
    relay.e = (status >>> 4) & 0x01;
    relay.g = (status >>> 5) & 0x01;
    relay.ob = (status >>> 6) & 0x01;

    return relay;
}

function readObMode(type) {
    if (RAW_VALUE) return type;

    var ob_mode_map = {
        0: "cool",
        1: "heat",
    };
    return getValue(ob_mode_map, type);
}

function readTemperatureControlModeEnable(type) {
    if (RAW_VALUE) return type;

    var enable = [];
    if ((type >>> 0) & 0x01) {
        enable.push("heat");
    }
    if ((type >>> 1) & 0x01) {
        enable.push("em heat");
    }
    if ((type >>> 2) & 0x01) {
        enable.push("cool");
    }
    if ((type >>> 3) & 0x01) {
        enable.push("auto");
    }
    return enable;
}

function readTemperatureControlStatusEnable(heat_mode, cool_mode) {
    var enable = [];
    if ((heat_mode >>> 0) & 0x01) {
        enable.push("stage-1 heat");
    }
    if ((heat_mode >>> 1) & 0x01) {
        enable.push("stage-2 heat");
    }
    if ((heat_mode >>> 2) & 0x01) {
        enable.push("stage-3 heat");
    }
    if ((heat_mode >>> 3) & 0x01) {
        enable.push("stage-4 heat");
    }
    if ((heat_mode >>> 4) & 0x01) {
        enable.push("aux heat");
    }
    if ((heat_mode >>> 5) & 0x01) {
        enable.push("stage-5 heat");
    }

    // bit0: stage-1 cool, bit1: stage-2 cool
    if ((cool_mode >>> 0) & 0x03) {
        enable.push("stage-1 cool");
    }
    if ((cool_mode >>> 1) & 0x03) {
        enable.push("stage-2 cool");
    }
    return enable;
}

function readWeekRecycleSettings(type) {
    var week_enable = [];
    if ((type >>> 1) & 0x01) {
        week_enable.push("Monday");
    }
    if ((type >>> 2) & 0x01) {
        week_enable.push("Tuesday");
    }
    if ((type >>> 3) & 0x01) {
        week_enable.push("Wednesday");
    }
    if ((type >>> 4) & 0x01) {
        week_enable.push("Thursday");
    }
    if ((type >>> 5) & 0x01) {
        week_enable.push("Friday");
    }
    if ((type >>> 6) & 0x01) {
        week_enable.push("Saturday");
    }
    if ((type >>> 7) & 0x01) {
        week_enable.push("Sunday");
    }
    return week_enable;
}

function handle_downlink_response(channel_type, bytes, offset) {
    var decoded = {};

    switch (channel_type) {
        case 0x02: // collection_interval
            decoded.collection_interval = readUInt16LE(bytes.slice(offset, offset + 2));
            offset += 2;
            break;
        case 0x03:
            decoded.outside_temperature = readInt16LE(bytes.slice(offset, offset + 2)) / 10;
            offset += 2;
            break;
        case 0x06: // temperature_threshold_config
            var ctl = readUInt8(bytes[offset]);
            var condition = ctl & 0x07;
            var alarm_type = (ctl >>> 3) & 0x07;

            var data = { condition: condition, alarm_type: alarm_type };

            if (condition === 1 || condition === 3 || condition === 4) {
                data.min = readInt16LE(bytes.slice(offset + 1, offset + 3)) / 10;
            }
            if (condition === 2 || condition === 3 || condition === 4) {
                data.max = readInt16LE(bytes.slice(offset + 3, offset + 5)) / 10;
            }
            data.lock_time = readInt16LE(bytes.slice(offset + 5, offset + 7));
            data.continue_time = readInt16LE(bytes.slice(offset + 7, offset + 9));
            offset += 9;

            decoded.temperature_threshold_config = decoded.temperature_threshold_config || [];
            decoded.temperature_threshold_config.push(data);
            break;
        case 0x25:
            var masked = readUInt8(bytes[offset]);
            var status = readUInt8(bytes[offset + 1]);

            decoded.child_lock_config = decoded.child_lock_config || {};
            if ((masked >> 0) & 0x01) {
                decoded.child_lock_config.power_button = (status >> 0) & 0x01;
            }
            if ((masked >> 1) & 0x01) {
                decoded.child_lock_config.up_button = (status >> 1) & 0x01;
            }
            if ((masked >> 2) & 0x01) {
                decoded.child_lock_config.down_button = (status >> 2) & 0x01;
            }
            if ((masked >> 3) & 0x01) {
                decoded.child_lock_config.fan_button = (status >> 3) & 0x01;
            }
            if ((masked >> 4) & 0x01) {
                decoded.child_lock_config.mode_button = (status >> 4) & 0x01;
            }
            if ((masked >> 5) & 0x01) {
                decoded.child_lock_config.reset_button = (status >> 5) & 0x01;
            }

            offset += 2;
            break;
        case 0x82:
            decoded.multicast_group_config = {};
            var value = readUInt8(bytes[offset]);
            var mask = value >>> 4;
            var enabled = value & 0x0f;
            if (((mask >> 0) & 0x01) === 1) {
                decoded.multicast_group_config.group1_enable = enabled & 0x01;
            }
            if (((mask >> 1) & 0x01) === 1) {
                decoded.multicast_group_config.group2_enable = (enabled >> 1) & 0x01;
            }
            if (((mask >> 2) & 0x01) === 1) {
                decoded.multicast_group_config.group3_enable = (enabled >> 2) & 0x01;
            }
            if (((mask >> 3) & 0x01) === 1) {
                decoded.multicast_group_config.group4_enable = (enabled >> 3) & 0x01;
            }
            offset += 1;
            break;
        case 0x83:
            var config = {};
            config.id = readUInt8(bytes[offset]) + 1;
            config.enable = readUInt8(bytes[offset + 1]);
            if (config.enable === 1) {
                config.d2d_cmd = readD2DCommand(bytes.slice(offset + 2, offset + 4));
                config.action_type = (readUInt8(bytes[offset + 4]) >>> 4) & 0x0f;
                config.action = readUInt8(bytes[offset + 4]) & 0x0f;
            }
            offset += 5;

            decoded.d2d_slave_config = decoded.d2d_slave_config || [];
            decoded.d2d_slave_config.push(config);
            break;
        case 0x96:
            var config = {};
            config.mode = readUInt8(bytes[offset]);
            config.enable = readUInt8(bytes[offset + 1]);
            if (config.enable === 1) {
                config.uplink_enable = readUInt8(bytes[offset + 2]);
                config.d2d_cmd = readD2DCommand(bytes.slice(offset + 3, offset + 5));
                config.time_enable = readUInt8(bytes[offset + 7]);
                if (config.time_enable === 1) {
                    config.time = readUInt16LE(bytes.slice(offset + 5, offset + 7));
                }
            }
            offset += 8;

            decoded.d2d_master_config = decoded.d2d_master_config || [];
            decoded.d2d_master_config.push(config);
            break;
        case 0x4a: // sync_time
            decoded.sync_time = 1;
            offset += 1;
            break;
        case 0x8e: // report_interval
            // ignore the first byte
            decoded.report_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            offset += 3;
            break;
        case 0xab:
            decoded.temperature_calibration = {};
            decoded.temperature_calibration.enable = readUInt8(bytes[offset]);
            if (decoded.temperature_calibration.enable === 1) {
                decoded.temperature_calibration.temperature = readInt16LE(bytes.slice(offset + 1, offset + 3)) / 10;
            }
            offset += 3;
            break;
        case 0xb0:
            decoded.freeze_protection_config = decoded.freeze_protection_config || {};
            decoded.freeze_protection_config.enable = readUInt8(bytes[offset]);
            if (decoded.freeze_protection_config.enable === 1) {
                decoded.freeze_protection_config.temperature = readInt16LE(bytes.slice(offset + 1, offset + 3)) / 10;
            }
            offset += 3;
            break;
        case 0xb5: // ob_mode
            decoded.ob_mode = readUInt8(bytes[offset]);
            offset += 1;
            break;
        case 0xb6:
            decoded.fan_mode = readUInt8(bytes[offset]);
            offset += 1;
            break;
        case 0xb7:
            decoded.temperature_control_mode = readUInt8(bytes[offset]);
            var t = readUInt8(bytes[offset + 1]);
            decoded.temperature_target = t & 0x7f;
            decoded.temperature_unit = (t >>> 7) & 0x01;
            offset += 2;
            break;
        case 0xb8: // temperature_tolerance
            decoded.temperature_tolerance = {};
            decoded.temperature_tolerance.temperature_error = readUInt8(bytes[offset]) / 10;
            decoded.temperature_tolerance.auto_control_temperature_error = readUInt8(bytes[offset + 1]) / 10;
            offset += 2;
            break;
        case 0xb9:
            decoded.temperature_level_up_condition = {};
            decoded.temperature_level_up_condition.type = readUInt8(bytes[offset]);
            decoded.temperature_level_up_condition.time = readUInt8(bytes[offset + 1]);
            decoded.temperature_level_up_condition.temperature_error = readInt16LE(bytes.slice(offset + 2, offset + 4)) / 10;
            offset += 4;
            break;
        case 0xba:
            decoded.dst_config = {};
            decoded.dst_config.enable = readUInt8(bytes[offset]);
            if (decoded.dst_config.enable === 1) {
                decoded.dst_config.offset = readUInt8(bytes[offset + 1]);
                decoded.dst_config.start_time = {};
                decoded.dst_config.start_time.month = readUInt8(bytes[offset + 2]);
                var start_day = readUInt8(bytes[offset + 3]);
                decoded.dst_config.start_time.week = (start_day >>> 4) & 0x0f;
                decoded.dst_config.start_time.weekday = start_day & 0x0f;
                var start_time = readUInt16LE(bytes.slice(offset + 4, offset + 6));
                decoded.dst_config.start_time.time = Math.floor(start_time / 60) + ":" + ("0" + (start_time % 60)).slice(-2);
                decoded.dst_config.end_time = {};
                decoded.dst_config.end_time.month = readUInt8(bytes[offset + 6]);
                var end_day = readUInt8(bytes[offset + 7]);
                decoded.dst_config.end_time.week = (end_day >>> 4) & 0x0f;
                decoded.dst_config.end_time.weekday = end_day & 0x0f;
                var end_time = readUInt16LE(bytes.slice(offset + 8, offset + 10));
                decoded.dst_config.end_time.time = Math.floor(end_time / 60) + ":" + ("0" + (end_time % 60)).slice(-2);
            }
            offset += 10;
            break;
        case 0xbd: // timezone
            decoded.timezone = readInt16LE(bytes.slice(offset, offset + 2)) / 60;
            offset += 2;
            break;
        case 0xc1:
            decoded.card_config = {};
            decoded.card_config.enable = readUInt8(bytes[offset]);
            if (decoded.card_config.enable === 1) {
                decoded.card_config.action_type = readUInt8(bytes[offset + 1]);
                if (decoded.card_config.action_type === 1) {
                    var action = readUInt8(bytes[offset + 2]);
                    decoded.card_config.in_plan_type = (action >>> 4) & 0x0f;
                    decoded.card_config.out_plan_type = action & 0x0f;
                }
                decoded.card_config.invert = readUInt8(bytes[offset + 3]);
            }
            offset += 4;
            break;
        case 0xc2:
            decoded.plan_mode = readUInt8(bytes[offset]);
            offset += 1;
            break;
        case 0xc4:
            decoded.outside_temperature_control_config = decoded.outside_temperature_control_config || {};
            decoded.outside_temperature_control_config.enable = readUInt8(bytes[offset]);
            if (decoded.outside_temperature_control_config.enable === 1) {
                decoded.outside_temperature_control_config.timeout = readUInt8(bytes[offset + 1]);
            }
            offset += 2;
            break;
        case 0xc5:
            decoded.temperature_control_enable = readUInt8(bytes[offset]);
            offset += 1;
            break;
        case 0xc7:
            var data = readUInt8(bytes[offset]);
            offset += 1;

            var mask = data >>> 4;
            var status = data & 0x0f;

            if ((mask >> 0) & 0x01) {
                decoded.d2d_master_enable = status & 0x01;
            }
            if ((mask >> 1) & 0x01) {
                decoded.d2d_slave_enable = (status >> 1) & 0x01;
            }
            break;
        case 0xc8:
            decoded.plan_config = decoded.plan_config || {};
            decoded.plan_config.type = readUInt8(bytes[offset]);
            decoded.plan_config.temperature_control_mode = readUInt8(bytes[offset + 1]);
            decoded.plan_config.fan_mode = readUInt8(bytes[offset + 2]);
            var t = readInt8(bytes[offset + 3]);
            decoded.plan_config.temperature_target = t & 0x7f;
            decoded.temperature_unit = (t >>> 7) & 0x01;
            decoded.plan_config.temperature_error = readInt8(bytes[offset + 4]) / 10;
            offset += 5;
            break;
        case 0xc9:
            var schedule = {};
            schedule.type = bytes[offset];
            schedule.id = bytes[offset + 1] + 1;
            schedule.enable = bytes[offset + 2];
            schedule.week_recycle = readWeekRecycleSettings(bytes[offset + 3]);
            schedule.time = readUInt16LE(bytes.slice(offset + 4, offset + 6));
            offset += 6;

            decoded.plan_schedule = decoded.plan_schedule || [];
            decoded.plan_schedule.push(schedule);
            break;
        case 0xca:
            decoded.wires = readWires(bytes[offset], bytes[offset + 1], bytes[offset + 2]);
            decoded.ob_mode = (bytes[offset + 2] >>> 2) & 0x03;
            offset += 3;
            break;
        case 0xf6:
            decoded.control_permissions = readUInt8(bytes[offset]);
            offset += 1;
            break;
        case 0xf7:
            var wire_relay_bit_offset = { y1: 0, y2_gl: 1, w1: 2, w2_aux: 3, e: 4, g: 5, ob: 6 };
            var mask = readUInt16LE(bytes.slice(offset, offset + 2));
            var status = readUInt16LE(bytes.slice(offset + 2, offset + 4));
            offset += 4;

            decoded.wires_relay_config = {};
            for (var key in wire_relay_bit_offset) {
                if ((mask >>> wire_relay_bit_offset[key]) & 0x01) {
                    decoded.wires_relay_config[key] = (status >>> wire_relay_bit_offset[key]) & 0x01;
                }
            }
            break;
        case 0xf8: // offline_control_mode
            decoded.offline_control_mode = readUInt8(bytes[offset]);
            break;
        case 0xf9: // humidity_calibration
            decoded.humidity_calibration = {};
            decoded.humidity_calibration.enable = readUInt8(bytes[offset]);
            if (decoded.humidity_calibration.enable === 1) {
                decoded.humidity_calibration.humidity = readInt16LE(bytes.slice(offset + 1, offset + 3)) / 10;
            }
            offset += 3;
            break;
        case 0xfa:
            decoded.temperature_control_mode = readUInt8(bytes[offset]);
            decoded.temperature_target = readInt16LE(bytes.slice(offset + 1, offset + 3)) / 10;
            offset += 3;
            break;
        case 0xfb:
            decoded.temperature_control_mode = readUInt8(bytes[offset]);
            offset += 1;
            break;
        default:
            throw new Error("unknown downlink response");
    }

    return { data: decoded, offset: offset };
}

function handle_downlink_response_ext(channel_type, bytes, offset) {
    var decoded = {};

    switch (channel_type) {
        case 0x05:
            var fan_delay_control_result = readUInt8(bytes[offset + 2]);
            if (fan_delay_control_result === 0) {
                decoded.fan_delay_enable = readUInt8(bytes[offset]);
                decoded.fan_delay_time = readUInt8(bytes[offset + 1]);
            }
            offset += 3;
            break;
        case 0x06:
            var fan_execute_result = readUInt8(bytes[offset + 1]);
            if (fan_execute_result === 0) {
                decoded.fan_execute_time = readUInt8(bytes[offset]);
            }
            offset += 2;
            break;
        case 0x07:
            var dehumidify_control_result = readUInt8(bytes[offset + 2]);
            if (dehumidify_control_result === 0) {
                decoded.fan_dehumidify = {};
                decoded.fan_dehumidify.enable = readUInt8(bytes[offset]);
                if (decoded.fan_dehumidify.enable === 1) {
                    decoded.fan_dehumidify.execute_time = readUInt8(bytes[offset + 1]);
                }
            }
            offset += 3;
            break;
        case 0x08:
            var screen_display_mode_result = readUInt8(bytes[offset + 1]);
            if (screen_display_mode_result === 0) {
                decoded.screen_display_mode = readUInt8(bytes[offset]);
            }
            offset += 2;
            break;
        case 0x09:
            var humidity_range_result = readUInt8(bytes[offset + 2]);
            if (humidity_range_result === 0) {
                decoded.humidity_range = {};
                decoded.humidity_range.min = readUInt8(bytes[offset]);
                decoded.humidity_range.max = readUInt8(bytes[offset + 1]);
            } else {
                throw new Error("humidity range control failed");
            }
            offset += 3;
            break;
        case 0x0a:
            var dehumidify_result = readUInt8(bytes[offset + 2]);
            if (dehumidify_result === 0) {
                decoded.temperature_dehumidify = {};
                decoded.temperature_dehumidify.enable = readUInt8(bytes[offset]);
                if (decoded.temperature_dehumidify.enable === 1) {
                    var value = readUInt8(bytes[offset + 1]);
                    if (value !== 0xff) {
                        decoded.temperature_dehumidify.temperature_tolerance = readUInt8(bytes[offset + 1]) / 10;
                    }
                }
            } else {
                throw new Error("dehumidify control failed");
            }
            offset += 3;
            break;
        case 0x1b:
            var temperature_up_down_enable_result = readUInt8(bytes[offset + 2]);
            if (temperature_up_down_enable_result === 0) {
                decoded.temperature_up_down_enable = {};
                var status = readUInt8(bytes[offset]);
                var enable = readUInt8(bytes[offset + 1]);
                decoded.temperature_up_down_enable.forward_enable = (enable >> 0) & 0x01;
                decoded.temperature_up_down_enable.forward_status = (status >> 0) & 0x01;
                decoded.temperature_up_down_enable.backward_enable = (enable >> 1) & 0x01;
                decoded.temperature_up_down_enable.backward_status = (status >> 1) & 0x01;
            } else {
                throw new Error("temperature up down enable control failed");
            }
            offset += 3;
            break;
        case 0x3a:
            var wires_relay_change_report_result = readUInt8(bytes[offset + 1]);
            if (wires_relay_change_report_result === 0) {
                decoded.wires_relay_change_report_enable = readUInt8(bytes[offset]);
            } else {
                throw new Error("wires relay change report control failed");
            }
            offset += 2;
            break;
        case 0x3b:
            var wires_relay_change_report_result = readUInt8(bytes[offset + 1]);
            if (wires_relay_change_report_result === 0) {
                var value = readUInt8(bytes[offset]);
                var relay_status = (value >>> 4) & 0x0f;
                var relay_enable = value & 0x0f;
                decoded.wires_relay_change_report = {};
                decoded.wires_relay_change_report.y2_status = (relay_status >> 0) & 0x01;
                decoded.wires_relay_change_report.w2_status = (relay_status >> 1) & 0x01;
                decoded.wires_relay_change_report.y2_enable = (relay_enable >> 0) & 0x01;
                decoded.wires_relay_change_report.w2_enable = (relay_enable >> 1) & 0x01;
            } else {
                throw new Error("wires relay change report control failed");
            }
            offset += 2;
            break;
        case 0x3e:
            var d2d_master_id_result = readUInt8(bytes[offset + 9]);
            if (d2d_master_id_result === 0) {
                decoded.d2d_master_id = {};
                decoded.d2d_master_id.id = readUInt8(bytes[offset]) + 1;
                decoded.d2d_master_id.dev_eui = readHexString(bytes.slice(offset + 1, offset + 9));
            } else {
                throw new Error("d2d master id control failed");
            }
            offset += 10;
            break;
        case 0x41:
            var temperature_target_resolution_result = readUInt8(bytes[offset + 1]);
            if (temperature_target_resolution_result === 0) {
                decoded.temperature_target_resolution = readUInt8(bytes[offset]);
            } else {
                throw new Error("temperature target resolution control failed");
            }
            offset += 2;
            break;
        case 0x42:
            var temperature_target_range_result = readUInt8(bytes[offset + 5]);
            if (temperature_target_range_result === 0) {
                decoded.temperature_target_range = {};
                decoded.temperature_target_range.temperature_control_mode = readUInt8(bytes[offset]);
                decoded.temperature_target_range.min = readInt16LE(bytes.slice(offset + 1, offset + 3)) / 10;
                decoded.temperature_target_range.max = readInt16LE(bytes.slice(offset + 3, offset + 5)) / 10;
            } else {
                throw new Error("temperature target range control failed");
            }
            offset += 6;
            break;
        case 0x43:
            var temperature_level_up_down_delta_result = readUInt8(bytes[offset + 3]);
            if (temperature_level_up_down_delta_result === 0) {
                decoded.temperature_level_up_down_delta = {};
                // skip the first byte
                decoded.temperature_level_up_down_delta.delta1 = readUInt8(bytes[offset + 1]);
                decoded.temperature_level_up_down_delta.delta2 = readUInt8(bytes[offset + 2]);
            } else {
                throw new Error("temperature level up down delta control failed");
            }
            offset += 4;
            break;
        case 0x44:
            var fan_delay_control_result = readUInt8(bytes[offset + 3]);
            if (fan_delay_control_result === 0) {
                decoded.fan_delay_enable = readUInt8(bytes[offset]);
                decoded.fan_delay_time = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            } else {
                throw new Error("fan delay control failed");
            }
            offset += 4;
            break;
        case 0x45:
            var temperature_control_v2_result = readUInt8(bytes[offset + 4]);
            if (temperature_control_v2_result === 0) {
                decoded.temperature_control_enable = readUInt8(bytes[offset]);
                decoded.temperature_control_mode = readUInt8(bytes[offset + 1]);
                decoded.temperature_target = readInt16LE(bytes.slice(offset + 2, offset + 4)) / 10;
            } else {
                throw new Error("temperature control v2 control failed");
            }
            offset += 5;
            break;
        case 0x46:
            var compressor_aux_combine_enable_result = readUInt8(bytes[offset + 1]);
            if (compressor_aux_combine_enable_result === 0) {
                decoded.compressor_aux_combine_enable = readUInt8(bytes[offset]);
            } else {
                throw new Error("compressor aux combine enable control failed");
            }
            offset += 2;
            break;
        case 0x47:
            var system_protect_config_result = readUInt8(bytes[offset + 2]);
            if (system_protect_config_result === 0) {
                decoded.system_protect_config = {};
                decoded.system_protect_config.enable = readUInt8(bytes[offset]);
                decoded.system_protect_config.duration = readUInt8(bytes[offset + 1]);
            } else {
                throw new Error("system protect config control failed");
            }
            offset += 3;
            break;
        default:
            throw new Error("unknown downlink response");
    }

    return { data: decoded, offset: offset };
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
                // TypeError if undefined or null
                throw new TypeError("Cannot convert first argument to object");
            }

            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource == null) {
                    // Skip over if undefined or null
                    continue;
                }
                nextSource = Object(nextSource);

                var keysArray = Object.keys(Object(nextSource));
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        },
    });
}
