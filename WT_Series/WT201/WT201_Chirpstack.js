/**
 * Payload Decoder for Milesight Network Server
 *
 * Copyright 2024 Milesight IoT
 *
 * @product WT201
 */
function Decode(fPort, bytes) {
    return milesight(bytes);
}

function milesight(bytes) {
    var decoded = {};

    for (var i = 0; i < bytes.length; ) {
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
        // TEMPERATURE
        else if (channel_id === 0x03 && channel_type === 0x67) {
            decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // TEMPERATURE TARGET
        else if (channel_id === 0x04 && channel_type === 0x67) {
            decoded.temperature_target = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // TEMPERATURE CONTROL
        else if (channel_id === 0x05 && channel_type === 0xe7) {
            var value = bytes[i];
            decoded.temperature_ctl_mode = readTemperatureCtlMode(value & 0x03);
            decoded.temperature_ctl_status = readTemperatureCtlStatus((value >>> 4) & 0x0f);
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
        // PLAN
        else if (channel_id === 0xff && channel_type === 0xc9) {
            var schedule = {};
            schedule.type = readPlanType(bytes[i]);
            schedule.index = bytes[i + 1] + 1;
            schedule.plan_enable = ["disable", "enable"][bytes[i + 2]];
            schedule.week_recycle = readWeekRecycleSettings(bytes[i + 3]);
            var time_mins = readUInt16LE(bytes.slice(i + 4, i + 6));
            schedule.time = Math.floor(time_mins / 60) + ":" + ("0" + (time_mins % 60)).slice(-2);

            decoded.plan_schedule = decoded.plan_schedule || [];
            decoded.plan_schedule.push(schedule);
            i += 6;
        }
        // PLAN SETTINGS
        else if (channel_id === 0xff && channel_type === 0xc8) {
            var plan_setting = {};
            plan_setting.type = readPlanType(bytes[i]);
            plan_setting.temperature_ctl_mode = readTemperatureCtlMode(bytes[i + 1]);
            plan_setting.fan_mode = readFanMode(bytes[i + 2]);
            plan_setting.temperature_target = readInt8(bytes[i + 3]);
            plan_setting.temperature_error = readUInt8(bytes[i + 4]) / 10;

            decoded.plan_settings = decoded.plan_settings || [];
            decoded.plan_settings.push(plan_setting);
            i += 5;
        }
        // WIRES
        else if (channel_id === 0xff && channel_type === 0xca) {
            decoded.wires = readWires(bytes[i], bytes[i + 1], bytes[i + 2]);
            decoded.ob_mode = readObMode((bytes[i + 2] >>> 2) & 0x03);
            i += 3;
        }
        // TEMPERATURE MODE SUPPORT
        else if (channel_id === 0xff && channel_type === 0xcb) {
            decoded.temperature_ctl_mode_enable = readTemperatureCtlModeEnable(bytes[i]);
            decoded.temperature_ctl_status_enable = readTemperatureCtlStatusEnable(bytes[i + 1], bytes[i + 2]);
            i += 3;
        }
        // TEMPERATURE ALARM
        else if (channel_id === 0x83 && channel_type === 0x67) {
            decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            decoded.temperature_alarm = readTemperatureAlarm(bytes[i + 2]);
            i += 2;
        }
        // HISTRORICAL DATA
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var timestamp = readUInt32LE(bytes.slice(i, i + 4));
            var value1 = readUInt16LE(bytes.slice(i + 4, i + 6));
            var value2 = readUInt16LE(bytes.slice(i + 6, i + 8));

            var data = {};
            data.timestamp = timestamp;

            // fan_mode(0..1) + fan_status(2..3) + system_status(4) + temperature(5..15)
            data.fan_mode = readFanMode(value1 & 0x03);
            data.fan_status = readFanStatus((value1 >>> 2) & 0x03);
            data.system_status = readSystemStatus((value1 >>> 4) & 0x01);
            var temperature = ((value1 >>> 5) & 0x7ff) / 10 - 100;
            data.temperature = Number(temperature.toFixed(1));

            // temperature_ctl_mode(0..1) + temperature_ctl_status(2..4) + temperature_target(5..15)
            data.temperature_ctl_mode = readTemperatureCtlMode(value2 & 0x03);
            data.temperature_ctl_status = readTemperatureCtlStatus((value2 >>> 2) & 0x07);
            var temperature_target = ((value2 >>> 5) & 0x7ff) / 10 - 100;
            data.temperature_target = Number(temperature_target.toFixed(1));

            decoded.history = decoded.history || [];
            decoded.history.push(data);
            i += 8;
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

function readSerialNumber(bytes) {
    var temp = [];
    for (var idx = 0; idx < bytes.length; idx++) {
        temp.push(("0" + (bytes[idx] & 0xff).toString(16)).slice(-2));
    }
    return temp.join("");
}

function readTemperatureAlarm(type) {
    // 1: emergency heating timeout alarm, 2: auxiliary heating timeout alarm, 3: persistent low temperature alarm, 4: persistent low temperature alarm release,
    // 5: persistent high temperature alarm, 6: persistent high temperature alarm release, 7: freeze protection alarm, 8: freeze protection alarm release,
    // 9: threshold alarm, 10: threshold alarm release
    switch (type) {
        case 0x01:
            return "emergency heating timeout alarm";
        case 0x02:
            return "auxiliary heating timeout alarm";
        case 0x03:
            return "persistent low temperature alarm";
        case 0x04:
            return "persistent low temperature alarm release";
        case 0x05:
            return "persistent high temperature alarm";
        case 0x06:
            return "persistent high temperature alarm release";
        case 0x07:
            return "freeze protection alarm";
        case 0x08:
            return "freeze protection alarm release";
        case 0x09:
            return "threshold alarm";
        case 0x0a:
            return "threshold alarm release";
        default:
            return "unknown";
    }
}

function readPlanEvent(type) {
    // 0: not executed, 1: wake, 2: away, 3: home, 4: sleep
    switch (type) {
        case 0x00:
            return "not executed";
        case 0x01:
            return "wake";
        case 0x02:
            return "away";
        case 0x03:
            return "home";
        case 0x04:
            return "sleep";
        default:
            return "unknown";
    }
}

function readPlanType(type) {
    // 0: wake, 1: away, 2: home, 3: sleep
    switch (type) {
        case 0x00:
            return "wake";
        case 0x01:
            return "away";
        case 0x02:
            return "home";
        case 0x03:
            return "sleep";
        default:
            return "unknown";
    }
}

function readFanMode(type) {
    // 0: auto, 1: on, 2: circulate, 3: disable
    switch (type) {
        case 0x00:
            return "auto";
        case 0x01:
            return "on";
        case 0x02:
            return "circulate";
        case 0x03:
            return "disable";
        default:
            return "unknown";
    }
}

function readFanStatus(type) {
    // 0: standby, 1: high speed, 2: low speed, 3: on
    switch (type) {
        case 0x00:
            return "standby";
        case 0x01:
            return "high speed";
        case 0x02:
            return "low speed";
        case 0x03:
            return "on";
        default:
            return "unknown";
    }
}

function readSystemStatus(type) {
    // 0: off, 1: on
    switch (type) {
        case 0x00:
            return "off";
        case 0x01:
            return "on";
        default:
            return "unknown";
    }
}

function readTemperatureCtlMode(type) {
    // 0: heat, 1: em heat, 2: cool, 3: auto
    switch (type) {
        case 0x00:
            return "heat";
        case 0x01:
            return "em heat";
        case 0x02:
            return "cool";
        case 0x03:
            return "auto";
        default:
            return "unknown";
    }
}

function readTemperatureCtlStatus(type) {
    // 0: standby, 1: stage-1 heat, 2: stage-2 heat, 3: stage-3 heat, 4: stage-4 heat, 5: em heat, 6: stage-1 cool, 7: stage-2 cool
    switch (type) {
        case 0x00:
            return "standby";
        case 0x01:
            return "stage-1 heat";
        case 0x02:
            return "stage-2 heat";
        case 0x03:
            return "stage-3 heat";
        case 0x04:
            return "stage-4 heat";
        case 0x05:
            return "em heat";
        case 0x06:
            return "stage-1 cool";
        case 0x07:
            return "stage-2 cool";
        default:
            return "unknown";
    }
}

function readWires(wire1, wire2, wire3) {
    var wire = [];
    if ((wire1 >>> 0) & 0x03) {
        wire.push("y1");
    }
    if ((wire1 >>> 2) & 0x03) {
        wire.push("gh");
    }
    if ((wire1 >>> 4) & 0x03) {
        wire.push("ob");
    }
    if ((wire1 >>> 6) & 0x03) {
        wire.push("w1");
    }
    if ((wire2 >>> 0) & 0x03) {
        wire.push("e");
    }
    if ((wire2 >>> 2) & 0x03) {
        wire.push("di");
    }
    if ((wire2 >>> 4) & 0x03) {
        wire.push("pek");
    }
    var w2_aux_wire = (wire2 >>> 6) & 0x03;
    switch (w2_aux_wire) {
        case 1:
            wire.push("w2");
            break;
        case 2:
            wire.push("aux");
            break;
    }
    var y2_gl_wire = (wire3 >>> 0) & 0x03;
    switch (y2_gl_wire) {
        case 1:
            wire.push("y2");
            break;
        case 2:
            wire.push("gl");
            break;
    }

    return wire;
}

function readObMode(type) {
    // 0: cool, 1: heat
    switch (type) {
        case 0x00:
            return "cool";
        case 0x01:
            return "heat";
        default:
            return "unknown";
    }
}

function readTemperatureCtlModeEnable(type) {
    // bit0: heat, bit1: em heat, bit2: cool, bit3: auto
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

function readTemperatureCtlStatusEnable(heat_mode, cool_mode) {
    // bit0: stage-1 heat, bit1: stage-2 heat, bit2: stage-3 heat, bit3: stage-4 heat, bit4: aux heat
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
    // bit1: "mon", bit2: "tues", bit3: "wed", bit4: "thur", bit5: "fri", bit6: "sat", bit7: "sun"
    var week_enable = [];
    if ((type >>> 1) & 0x01) {
        week_enable.push("Mon.");
    }
    if ((type >>> 2) & 0x01) {
        week_enable.push("Tues.");
    }
    if ((type >>> 3) & 0x01) {
        week_enable.push("Wed.");
    }
    if ((type >>> 4) & 0x01) {
        week_enable.push("Thur.");
    }
    if ((type >>> 5) & 0x01) {
        week_enable.push("Fri.");
    }
    if ((type >>> 6) & 0x01) {
        week_enable.push("Sat.");
    }
    if ((type >>> 7) & 0x01) {
        week_enable.push("Sun.");
    }
    return week_enable;
}
