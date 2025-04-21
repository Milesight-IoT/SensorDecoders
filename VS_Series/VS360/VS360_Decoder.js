/**
 * Payload Decoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product VS360
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
        // BATTERY(MAIN)
        else if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery_main = bytes[i];
            i += 1;
        }
        // BATTERY(NODE)
        else if (channel_id === 0x02 && channel_type === 0x75) {
            decoded.battery_node = bytes[i];
            i += 1;
        }
        // EVENT
        else if (channel_id === 0x03 && channel_type === 0xf4) {
            var data = {};
            data.type = readEventType(bytes[i]);
            data.status = readEventStatus(bytes[i + 1]);

            decoded.event = decoded.event || [];
            decoded.event.push(data);
            i += 2;
        }
        // TOTAL IN / OUT
        else if (channel_id === 0x04 && channel_type === 0xcc) {
            decoded.total_in = readUInt16LE(bytes.slice(i, i + 2));
            decoded.total_out = readUInt16LE(bytes.slice(i + 2, i + 4));
            i += 4;
        }
        // PERIOD IN / OUT
        else if (channel_id === 0x05 && channel_type === 0xcc) {
            decoded.period_in = readUInt16LE(bytes.slice(i, i + 2));
            decoded.period_out = readUInt16LE(bytes.slice(i + 2, i + 4));
            i += 4;
        }
        // TOTAL IN / OUT ALARM
        else if (channel_id === 0x84 && channel_type === 0xcc) {
            decoded.total_in = readUInt16LE(bytes.slice(i, i + 2));
            decoded.total_out = readUInt16LE(bytes.slice(i + 2, i + 4));
            decoded.total_count_alarm = readAlarmType(bytes[i + 4]);
            i += 5;
        }
        // PERIOD IN / OUT ALARM
        else if (channel_id === 0x85 && channel_type === 0xcc) {
            decoded.period_in = readUInt16LE(bytes.slice(i, i + 2));
            decoded.period_out = readUInt16LE(bytes.slice(i + 2, i + 4));
            decoded.period_count_alarm = readAlarmType(bytes[i + 4]);
            i += 5;
        }
        // HISTORICAL DATA
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var data = {};
            var timestamp = readUInt32LE(bytes.slice(i, i + 4));
            var type = bytes[i + 4];
            // historical data without total in/out
            if (type === 0) {
                data.timestamp = timestamp;
                data.period_in = readUInt16LE(bytes.slice(i + 5, i + 7));
                data.period_out = readUInt16LE(bytes.slice(i + 7, i + 9));
                i += 9;
            }
            // historical data with total in/out
            else if (type === 1) {
                data.timestamp = timestamp;
                data.period_in = readUInt16LE(bytes.slice(i + 5, i + 7));
                data.period_out = readUInt16LE(bytes.slice(i + 7, i + 9));
                data.total_in = readUInt16LE(bytes.slice(i + 9, i + 11));
                data.total_out = readUInt16LE(bytes.slice(i + 11, i + 13));
                i += 13;
            }

            decoded.history = decoded.history || [];
            decoded.history.push(data);
        }
        // DOWNLINK RESPONSE
        else if (channel_id === 0xfe || channel_id === 0xff) {
            result = handle_downlink_response(channel_type, bytes, i);
            decoded = Object.assign(decoded, result.data);
            i = result.offset;
        } else if (channel_id === 0xf8 || channel_id === 0xf9) {
            result = handle_downlink_response_ext(channel_id, channel_type, bytes, i);
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
        case 0x06:
            decoded.alarm_config = readAlarmConfig(bytes.slice(offset, offset + 9));
            offset += 9;
            break;
        case 0x10:
            decoded.reboot = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x28:
            decoded.report_status = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x35:
            decoded.d2d_key = readHexString(bytes.slice(offset, offset + 8));
            offset += 8;
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
        case 0x75:
            decoded.hibernate_config = {};
            decoded.hibernate_config.enable = readEnableStatus(bytes[offset]);
            decoded.hibernate_config.start_time = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            decoded.hibernate_config.end_time = readUInt16LE(bytes.slice(offset + 3, offset + 5));
            decoded.hibernate_config.weekdays = readWeekdays(readUInt8(bytes[offset + 5]));
            offset += 6;
            break;
        case 0x84:
            decoded.d2d_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x8e:
            // skip the first byte
            decoded.report_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            offset += 3;
            break;
        case 0x96:
            var d2d_master_config = {};
            d2d_master_config.mode = readD2DMode(readUInt8(bytes[offset]));
            d2d_master_config.enable = readEnableStatus(bytes[offset + 1]);
            d2d_master_config.lora_uplink_enable = readEnableStatus(bytes[offset + 2]);
            d2d_master_config.d2d_cmd = readD2DCommand(bytes.slice(offset + 3, offset + 5));
            d2d_master_config.time = readUInt16LE(bytes.slice(offset + 5, offset + 7));
            d2d_master_config.time_enable = readEnableStatus(bytes[offset + 7]);
            offset += 8;
            decoded.d2d_master_config = decoded.d2d_master_config || [];
            decoded.d2d_master_config.push(d2d_master_config);
            break;
        case 0xa6:
            decoded.clear_cumulative_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0xa9:
            decoded.cumulative_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0xbd:
            decoded.timezone = readTimeZone(readInt16LE(bytes.slice(offset, offset + 2)));
            offset += 2;
            break;
        case 0xa6:
            decoded.cumulative_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0xa8:
            var data = readUInt8(bytes[offset]);
            if (data === 0x01) {
                decoded.clear_cumulative_in = readYesNoStatus(1);
            } else if (data === 0x02) {
                decoded.clear_cumulative_out = readYesNoStatus(1);
            }
            offset += 1;
            break;
        case 0xed:
            decoded.cumulative_reset_config = {};
            decoded.cumulative_reset_config.weekday = readWeekday(readUInt8(bytes.slice(offset, offset + 1)));
            decoded.cumulative_reset_config.hour = readUInt8(bytes.slice(offset + 1, offset + 2));
            decoded.cumulative_reset_config.minute = readUInt8(bytes.slice(offset + 2, offset + 3));
            offset += 3;
            break;
        case 0xfc:
            decoded.counting_mode = readCountingMode(bytes[offset]);
            offset += 1;
            break;
        case 0xfd:
            decoded.led_enable = readEnableStatus(bytes[offset]);
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
        case 0x00:
            offset += 1;
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

function readEnableStatus(status) {
    var status_map = { 0: "disable", 1: "enable" };
    return getValue(status_map, status);
}

function readYesNoStatus(status) {
    var status_map = { 0: "no", 1: "yes" };
    return getValue(status_map, status);
}

function readAlarmType(type) {
    var alarm_map = { 1: "threshold_alarm" }
    return getValue(alarm_map, type);
}

function readEventType(type) {
    var event_type = { 0: "counting_anomaly", 1: "node_device_without_response", 2: "devices_misaligned" }
    return getValue(event_type, type);
}

function readEventStatus(status) {
    var event_status = { 0: "alarm_release", 1: "alarm" }
    return getValue(event_status, status);
}

function readTimeZone(timezone) {
    var timezone_map = {
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
    return getValue(timezone_map, timezone);
}

function readWeekday(weekday) {
    var weekday_map = { 0: "everyday", 1: "sunday", 2: "monday", 3: "tuesday", 4: "wednesday", 5: "thursday", 6: "friday", 7: "saturday" }
    return getValue(weekday_map, weekday);
}

function readCountingMode(mode) {
    var mode_map = { 2: "high_mode", 3: "low_mode" }
    return getValue(mode_map, mode);
}

function readWeekdays(weekdays) {
    var weekdays_list = [];
    for (var i = 0; i < 7; i++) {
        if ((weekdays >> i) & 0x01) {
            weekdays_list.push(i + 1);
        }
    }
    return weekdays_list;
}

function readD2DMode(mode) {
    var mode_map = { 1: "someone_enter", 2: "someone_leave", 3: "counting_threshold_alarm" }
    return getValue(mode_map, mode);
}


function readAlarmConfig(bytes) {
    var offset = 0;

    var alarm_config = {};
    var data = readUInt8(bytes[offset]);
    alarm_config.enable = readEnableStatus((data >> 6) & 0x03);
    alarm_config.condition = readConditionType(data & 0x07);
    alarm_config.trigger_source = readTriggerSourceType((data >> 3) & 0x07);
    alarm_config.min_threshold = readUInt16LE(bytes.slice(offset + 1, offset + 3));
    alarm_config.max_threshold = readUInt16LE(bytes.slice(offset + 3, offset + 5));
    alarm_config.lock_time = readUInt16LE(bytes.slice(offset + 5, offset + 7));
    alarm_config.continue_time = readUInt16LE(bytes.slice(offset + 7, offset + 9));
    offset += 9;

    return alarm_config;
}

function readConditionType(type) {
    var condition_map = { 0: "disable", 1: "below", 2: "above", 3: "between", 4: "outside" };
    return getValue(condition_map, type);
}

function readTriggerSourceType(type) {
    var trigger_source_map = { 1: "period_count", 2: "total_count" };
    return getValue(trigger_source_map, type);
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

function readHexString(bytes) {
    var temp = [];
    for (var i = 0; i < bytes.length; i++) {
        temp.push(("0" + (bytes[i] & 0xff).toString(16)).slice(-2));
    }
    return temp.join("");
}

function readD2DCommand(bytes) {
    return ("0" + (bytes[1] & 0xff).toString(16)).slice(-2) + ("0" + (bytes[0] & 0xff).toString(16)).slice(-2);
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

