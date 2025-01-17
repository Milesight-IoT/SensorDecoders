/**
 * Payload Decoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product UC51x
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
            decoded.device_status = "on";
            i += 1;
        }
        // LORAWAN CLASS TYPE
        else if (channel_id === 0xff && channel_type === 0x0f) {
            decoded.lorawan_class = readLoRaWanClass(bytes[i]);
            i += 1;
        }
        // SERIAL NUMBER
        else if (channel_id === 0xff && channel_type === 0x16) {
            decoded.sn = readSerialNumber(bytes.slice(i, i + 8));
            i += 8;
        }
        // BATTERY
        else if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = bytes[i];
            i += 1;
        }
        // VALVE 1
        else if (channel_id === 0x03 && channel_type == 0x01) {
            decoded.valve_1 = bytes[i] === 0 ? "close" : "open";
            i += 1;
        }
        // VALVE 2
        else if (channel_id === 0x05 && channel_type == 0x01) {
            decoded.valve_2 = bytes[i] === 0 ? "close" : "open";
            i += 1;
        }
        // VALVE 1 Pulse
        else if (channel_id === 0x04 && channel_type === 0xc8) {
            decoded.valve_1_pulse = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // VALVE 2 Pulse
        else if (channel_id === 0x06 && channel_type === 0xc8) {
            decoded.valve_2_pulse = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // GPIO 1
        else if (channel_id === 0x07 && channel_type == 0x01) {
            decoded.gpio_1 = bytes[i] === 0 ? "off" : "on";
            i += 1;
        }
        // GPIO 2
        else if (channel_id === 0x08 && channel_type == 0x01) {
            decoded.gpio_2 = bytes[i] === 0 ? "off" : "on";
            i += 1;
        }
        // PRESSURE
        else if (channel_id === 0x09 && channel_type === 0x7b) {
            decoded.pressure = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // CUSTOM MESSAGE
        else if (channel_id === 0xff && channel_type === 0x12) {
            decoded.text = readAscii(bytes.slice(i, bytes.length));
            i = bytes.length;
        }
        // HISTORY
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var timestamp = readUInt32LE(bytes.slice(i, i + 4));
            var value = bytes[i + 4];
            var status = (value & 0x01) === 0 ? "close" : "open";
            var mode = ((value >> 1) & 0x01) === 0 ? "counter" : "gpio";
            var gpio = ((value >> 2) & 0x01) === 0 ? "off" : "on";
            var index = ((value >> 4) & 0x01) === 0 ? 1 : 2;
            var pulse = readUInt32LE(bytes.slice(i + 5, i + 9));

            var data = { timestamp: timestamp, mode: mode };
            if (mode == "gpio") {
                data["valve_" + index] = status;
                data["gpio_" + index] = gpio;
            } else if (mode == "counter") {
                data["valve_" + index] = status;
                data["valve_" + index + "_pulse"] = pulse;
            }
            i += 9;

            decoded.history = decoded.history || [];
            decoded.history.push(data);
        }
        // HISTORY(PIPE PRESSURE)
        else if (channel_id === 0x21 && channel_type === 0xce) {
            var data = {};
            data.timestamp = readUInt32LE(bytes.slice(i, i + 4));
            data.pressure = readUInt16LE(bytes.slice(i + 4, i + 6));
            i += 6;

            decoded.history = decoded.history || [];
            decoded.history.push(data);
        }
        // RULE ENGINE
        else if (channel_id === 0xfe && channel_type === 0x53) {
            var rule = {};
            rule.index = bytes[i];
            rule.enabled = bytes[i + 1] === 0 ? "disable" : "enable";
            rule.condition = {};
            var condition = bytes[i + 2];
            switch (condition) {
                case 0x00:
                    rule.condition.type = "none";
                    break;
                case 0x01:
                    rule.condition.type = "time_condition";
                    rule.condition.start_time = readUInt32LE(bytes.slice(i + 3, i + 7));
                    rule.condition.end_time = readUInt32LE(bytes.slice(i + 7, i + 11));
                    rule.condition.repeat_enabled = bytes[i + 11] === 0 ? "disable" : "enable";
                    rule.condition.repeat_type = ["monthly", "daily", "weekly"][bytes[i + 12]];
                    var repeat_value = readUInt16LE(bytes.slice(i + 13, i + 15));
                    if (rule.condition.repeat_type === "weekly") {
                        var week_enums = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
                        rule.condition.repeat_time = [];
                        for (var i = 0; i < 7; i++) {
                            if ((repeat_value >> i) & (0x01 === 1)) {
                                rule.condition.repeat_time.push(week_enums[i]);
                            }
                        }
                    } else {
                        rule.condition.repeat_step = repeat_value;
                    }
                    break;
                case 0x02:
                    rule.condition.type = "d2d_condition";
                    rule.condition.d2d_command = readD2DCommand(bytes.slice(i + 3, i + 5));
                    break;
                case 0x03:
                    rule.condition.type = "time_and_pulse_threshold_condition";
                    rule.condition.valve_index = bytes[i + 3];
                    rule.condition.duration_time = readUInt16LE(bytes.slice(i + 4, i + 6));
                    rule.condition.pulse_threshold = readUInt32LE(bytes.slice(i + 6, i + 10));
                    break;
                case 0x04:
                    rule.condition.type = "pulse_threshold_condition";
                    rule.condition.valve_index = bytes[i + 3];
                    rule.condition.pulse_threshold = readUInt32LE(bytes.slice(i + 4, i + 8));
                    break;
                default:
                    break;
            }
            i += 15;

            var action = bytes[i];
            rule.action = {};
            switch (action) {
                case 0x00:
                    rule.action.type = "none";
                    break;
                case 0x01:
                case 0x02:
                    rule.action.type = "valve_action";
                    rule.action.valve_index = bytes[i + 1];
                    rule.action.valve_status = bytes[i + 2] === 0 ? "close" : "open";
                    rule.action.time_enabled = bytes[i + 3] === 0 ? "disable" : "enable";
                    rule.action.duration_time = readUInt32LE(bytes.slice(i + 4, i + 8));
                    rule.action.pulse_enabled = bytes[i + 8] === 0 ? "disable" : "enable";
                    rule.action.pulse_threshold = readUInt32LE(bytes.slice(i + 9, i + 13));
                    break;
                case 0x03:
                    var type = bytes[i + 1];
                    if (type === 0x01) {
                        rule.action.type = "device_status_report";
                        rule.action.valve_index = 1;
                    } else if (type === 0x02) {
                        rule.action.type = "device_status_report";
                        rule.action.valve_index = 2;
                    } else if (type === 0x03) {
                        rule.action.type = "custom_message_report";
                        rule.action.text = readAscii(bytes.slice(i + 2, i + 10));
                    }
                    break;
                default:
                    break;
            }
            i += 13;

            decoded.rules = decoded.rules || [];
            decoded.rules.push(rule);
        } else {
            break;
        }
    }

    return decoded;
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

function readLoRaWanClass(byte) {
    switch (byte) {
        case 0x00:
            return "ClassA";
        case 0x01:
            return "ClassB";
        case 0x02:
            return "ClassC";
        case 0x03:
            return "ClassCtoB";
        default:
            return "Unknown";
    }
}

function readAscii(bytes) {
    var str = "";
    for (var i = 0; i < bytes.length; i++) {
        if (bytes[i] === 0) {
            continue;
        }
        str += String.fromCharCode(bytes[i]);
    }
    return str;
}

function readD2DCommand(bytes) {
    return ("0" + (bytes[1] & 0xff).toString(16)).slice(-2) + ("0" + (bytes[0] & 0xff).toString(16)).slice(-2);
}
