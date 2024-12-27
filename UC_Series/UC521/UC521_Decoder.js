/**
 * Payload Decoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product UC521
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

var valve_chns = [0x03, 0x05];
var valve_pulse_chns = [0x04, 0x06];
var gpio_chns = [0x07, 0x08];
var pressure_chns = [0x09, 0x0a];
var pressure_alarm_chns = [0x0b, 0x0c];
var valve_exception_chns = [0xb3, 0xb5];
var pressure_exception_chns = [0xb9, 0xba];

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
        // BATTERY
        else if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = readUInt8(bytes[i]);
            i += 1;
        }
        // VALVE
        else if (includes(valve_chns, channel_id) && channel_type === 0xf6) {
            var valve_chn_name = "valve_" + (valve_chns.indexOf(channel_id) + 1);
            var valve_type_value = bytes[i];
            var valve_type = readValveType(valve_type_value);
            var valve_opening = readUInt8(bytes[i + 1]);

            switch (valve_type_value) {
                case 0x00:
                    decoded[valve_chn_name + "_type"] = valve_type;
                    decoded[valve_chn_name] = valve_opening;
                    break;
                case 0x01:
                    decoded[valve_chn_name + "_type"] = valve_type;
                    if (valve_opening > 100) {
                        decoded[valve_chn_name] = valve_opening - 100;
                        decoded[valve_chn_name + "_direction"] = readValveDirection(1);
                    } else {
                        decoded[valve_chn_name] = valve_opening;
                        decoded[valve_chn_name + "_direction"] = readValveDirection(0);
                    }
                    break;
            }
            i += 2;
        }
        // VALVE PULSE
        else if (includes(valve_pulse_chns, channel_id) && channel_type === 0xc8) {
            var valve_pulse_chn_name = "valve_" + (valve_pulse_chns.indexOf(channel_id) + 1);
            decoded[valve_pulse_chn_name + "_pulse"] = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // GPIO
        else if (includes(gpio_chns, channel_id) && channel_type === 0x01) {
            var gpio_chn_name = "gpio_" + (channel_id - gpio_chns[0] + 1);
            decoded[gpio_chn_name] = readGPIOStatus(bytes[i]);
            i += 1;
        }
        // PIPE PRESSURE
        else if (includes(pressure_chns, channel_id) && channel_type === 0x7b) {
            var pressure_chn_name = "pressure_" + (pressure_chns.indexOf(channel_id) + 1);
            decoded[pressure_chn_name] = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // PIPE PRESSURE ALARM
        else if (includes(pressure_alarm_chns, channel_id) && channel_type === 0xf5) {
            var pressure_chn_name = "pressure_" + (pressure_alarm_chns.indexOf(channel_id) + 1);

            var source_type = readSourceType(bytes[i]);
            var condition_type_value = bytes[i + 1];
            var condition_type = readConditionType(condition_type_value);
            var min = readUInt16LE(bytes.slice(i + 2, i + 4));
            var max = readUInt16LE(bytes.slice(i + 4, i + 6));
            var pressure = readUInt16LE(bytes.slice(i + 6, i + 8));
            var alarm = readPressureAlarmType(bytes[i + 8]);
            i += 9;

            var event = {};
            event.source = source_type;
            event.condition = condition_type;
            switch (condition_type_value) {
                case 0x01:
                    event.min = min;
                    break;
                case 0x02:
                    event.max = max;
                    break;
                case 0x03:
                case 0x04:
                    event.min = min;
                    event.max = max;
                    break;
            }
            event.pressure = pressure;
            event.alarm = alarm;

            decoded[pressure_chn_name] = pressure;
            decoded[pressure_chn_name + "_alarm_event"] = event;
        }
        // VALVE CALIBRATION EVENT
        else if (channel_id === 0x0d && channel_type === 0xe3) {
            var valve_channel = readUInt8(bytes[i]) + 1;
            var valve_chn_name = "valve_" + valve_channel;

            var event = {};
            event.source_value = readUInt8(bytes[i + 1]);
            event.target_value = readUInt8(bytes[i + 2]);
            event.result = readCalibrationResult(bytes[i + 3]);
            i += 4;

            decoded[valve_chn_name + "_calibration_result"] = event;
        }
        // VALVE SENSOR STATUS
        else if (includes(valve_exception_chns, channel_id) && channel_type === 0xf6) {
            var valve_chn_name = "valve_" + (valve_exception_chns.indexOf(channel_id) + 1);
            var valve_type = readValveType(bytes[i]);
            var sensor_status = readValveSensorStatus(bytes[i + 1]);
            i += 2;

            decoded[valve_chn_name + "_type"] = valve_type;
            decoded[valve_chn_name + "_sensor_status"] = sensor_status;
        }
        // PIPE PRESSURE EXCEPTION
        else if (includes(pressure_exception_chns, channel_id) && channel_type === 0x7b) {
            var pressure_chn_name = "pressure_" + (pressure_exception_chns.indexOf(channel_id) + 1);
            var sensor_status = readPressureSensorStatus(bytes[i]);
            decoded[pressure_chn_name + "_sensor_status"] = sensor_status;
            i += 1;
        }
        // CUSTOM MESSAGE
        else if (channel_id === 0xff && channel_type === 0x2a) {
            var length = bytes[i];
            decoded.custom_message = readAscii(bytes.slice(i + 1, i + length + 1));
            i += length + 1;
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

function readAscii(bytes) {
    var str = "";
    for (var i = 0; i < bytes.length; i++) {
        if (bytes[i] === 0x00) {
            break;
        }
        str += String.fromCharCode(bytes[i]);
    }
    return str;
}

function getValue(map, key) {
    if (RAW_VALUE) return key;

    var value = map[key];
    if (!value) value = "unknown";
    return value;
}

function includes(items, item) {
    var size = items.length;
    for (var i = 0; i < size; i++) {
        if (items[i] == item) {
            return true;
        }
    }
    return false;
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
    var status_map = {
        0: "normal",
        1: "reset",
    };
    return getValue(status_map, status);
}

function readDeviceStatus(status) {
    var status_map = {
        0: "off",
        1: "on",
    };
    return getValue(status_map, status);
}

function readGPIOStatus(status) {
    var status_map = {
        0: "low",
        1: "high",
    };
    return getValue(status_map, status);
}

function readSourceType(bytes) {
    var source_map = {
        0: "every change",
        1: "valve 1 opening",
        2: "valve 2 opening",
        3: "valve 1 opening or valve 2 opening",
    };
    return getValue(source_map, bytes);
}

function readConditionType(bytes) {
    var condition_map = {
        1: "pipe_pressure less than min",
        2: "pipe_pressure more than max",
        3: "pipe_pressure between min and max",
        4: "pipe_pressure out of min and max",
    };
    return getValue(condition_map, bytes);
}

function readPressureAlarmType(bytes) {
    var alarm_map = {
        0: "pipe pressure threshold alarm release",
        1: "pipe pressure threshold alarm",
    };
    return getValue(alarm_map, bytes);
}

function readCalibrationResult(status) {
    var status_map = {
        0: "failed",
        1: "success",
    };
    return getValue(status_map, status);
}

function readValveType(type) {
    var type_map = {
        0: "2-way ball valve",
        1: "3-way ball valve",
    };
    return getValue(type_map, type);
}

function readValveDirection(direction) {
    var direction_map = {
        0: "left",
        1: "right",
    };
    return getValue(direction_map, direction);
}

function readValveSensorStatus(status) {
    var status_map = {
        0: "low battery power",
        1: "shutdown after getting io feedback",
        2: "incorrect opening time",
        3: "timeout",
        4: "valve stall",
    };
    return getValue(status_map, status);
}

function readPressureSensorStatus(status) {
    var status_map = {
        1: "read error",
    };
    return getValue(status_map, status);
}
