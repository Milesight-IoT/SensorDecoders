/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product EM500-SMTC
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
        // TEMPERATURE
        else if (channel_id === 0x03 && channel_type === 0x67) {
            var temperature_value = readUInt16LE(bytes.slice(i, i + 2));
            if (temperature_value === 0xffff) {
                decoded.temperature1_error = readSensorStatus(1);
            } else if (temperature_value === 0xfffd) {
                decoded.temperature1_error = readSensorStatus(2);
            } else {
                decoded.temperature1 = readInt16LE(bytes.slice(i, i + 2)) / 10;
            }
            i += 2;
        }
        else if (channel_id === 0x06 && channel_type === 0x67) {
            var temperature_value = readUInt16LE(bytes.slice(i, i + 2));
            if (temperature_value === 0xffff) {
                decoded.temperature2_error = readSensorStatus(1);
            } else if (temperature_value === 0xfffd) {
                decoded.temperature2_error = readSensorStatus(2);
            } else {
                decoded.temperature2 = readInt16LE(bytes.slice(i, i + 2)) / 10;
            }
            i += 2;
        }
        else if (channel_id === 0x09 && channel_type === 0x67) {
            var temperature_value = readUInt16LE(bytes.slice(i, i + 2));
            if (temperature_value === 0xffff) {
                decoded.temperature3_error = readSensorStatus(1);
            } else if (temperature_value === 0xfffd) {
                decoded.temperature3_error = readSensorStatus(2);
            } else {
                decoded.temperature3 = readInt16LE(bytes.slice(i, i + 2)) / 10;
            }
            i += 2;
        }
        // MOISTURE (old resolution 0.5)
        else if (channel_id === 0x04 && channel_type === 0x68) {
            decoded.moisture = readUInt8(bytes[i]) / 2;
            i += 1;
        }
        // SOIL MOISTURE (new resolution 0.1)
        else if (channel_id === 0x04 && channel_type === 0xca) {
            var soil_moisture_value = readUInt16LE(bytes.slice(i, i + 2));
            if (soil_moisture_value === 0xffff) {
                decoded.soil_moisture1_error = readSensorStatus(1);
            } else if (soil_moisture_value === 0xfffd) {
                decoded.soil_moisture1_error = readSensorStatus(2);
            } else {
                decoded.soil_moisture1 = soil_moisture_value / 10;
            }
            i += 2;
        }
        else if (channel_id === 0x07 && channel_type === 0xca) {
            var soil_moisture_value = readUInt16LE(bytes.slice(i, i + 2));
            if (soil_moisture_value === 0xffff) {
                decoded.soil_moisture2_error = readSensorStatus(1);
            } else if (soil_moisture_value === 0xfffd) {
                decoded.soil_moisture2_error = readSensorStatus(2);
            } else {
                decoded.soil_moisture2 = soil_moisture_value / 10;
            }
            i += 2;
        }
        else if (channel_id === 0x0a && channel_type === 0xca) {
            var soil_moisture_value = readUInt16LE(bytes.slice(i, i + 2));
            if (soil_moisture_value === 0xffff) {
                decoded.soil_moisture3_error = readSensorStatus(1);
            } else if (soil_moisture_value === 0xfffd) {
                decoded.soil_moisture3_error = readSensorStatus(2);
            } else {
                decoded.soil_moisture3 = soil_moisture_value / 10;
            }
            i += 2;
        }
        // CONDUCTIVITY (new resolution 0.01)
        else if (channel_id === 0x05 && channel_type === 0x7f) {
            var conductivity_value = readUInt16LE(bytes.slice(i, i + 2));
            if (conductivity_value === 0xffff) {
                decoded.conductivity1_error = readSensorStatus(1);
            } else if (conductivity_value === 0xfffd) {
                decoded.conductivity1_error = readSensorStatus(2);
            } else {
                decoded.conductivity1 = conductivity_value / 100;
            }
            i += 2;
        }
        else if (channel_id === 0x08 && channel_type === 0x7f) {
            var conductivity_value = readUInt16LE(bytes.slice(i, i + 2));
            if (conductivity_value === 0xffff) {
                decoded.conductivity2_error = readSensorStatus(1);
            } else if (conductivity_value === 0xfffd) {
                decoded.conductivity2_error = readSensorStatus(2);
            } else {
                decoded.conductivity2 = conductivity_value / 100;
            }
            i += 2;
        }
        else if (channel_id === 0x0b && channel_type === 0x7f) {
            var conductivity_value = readUInt16LE(bytes.slice(i, i + 2));
            if (conductivity_value === 0xffff) {
                decoded.conductivity3_error = readSensorStatus(1);
            } else if (conductivity_value === 0xfffd) {
                decoded.conductivity3_error = readSensorStatus(2);
            } else {
                decoded.conductivity3 = conductivity_value / 100;
            }
            i += 2;
        }
        // TEMPERATURE MUTATION ALARM
        else if (channel_id === 0x83 && channel_type === 0xd7) {
            decoded.temperature1 = readInt16LE(bytes.slice(i, i + 2)) / 10;
            decoded.temperature1_mutation = readInt16LE(bytes.slice(i + 2, i + 4)) / 10;
            decoded.temperature1_alarm = readTemperatureAlarm(bytes[i + 4]);
            i += 5;
        }
        else if (channel_id === 0x86 && channel_type === 0xd7) {
            decoded.temperature2 = readInt16LE(bytes.slice(i, i + 2)) / 10;
            decoded.temperature2_mutation = readInt16LE(bytes.slice(i + 2, i + 4)) / 10;
            decoded.temperature2_alarm = readTemperatureAlarm(bytes[i + 4]);
            i += 5;
        }
        else if (channel_id === 0x89 && channel_type === 0xd7) {
            decoded.temperature3 = readInt16LE(bytes.slice(i, i + 2)) / 10;
            decoded.temperature3_mutation = readInt16LE(bytes.slice(i + 2, i + 4)) / 10;
            decoded.temperature3_alarm = readTemperatureAlarm(bytes[i + 4]);
            i += 5;
        }
        // HISTORY
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var data = {};
            data.timestamp = readUInt32LE(bytes.slice(i, i + 4));
            for(var j = 0; j < 3; j++) {
                var conductivity_value = readUInt16LE(bytes.slice(i + 4 + (j * 6), i + 6 + (j * 6)));
                if (conductivity_value === 0xffff) {
                    data['conductivity' + (j+1) + '_error'] = readSensorStatus(1);
                } else if (conductivity_value === 0xfffd) {
                    data['conductivity' + (j+1) + '_error'] = readSensorStatus(2);
                } else {
                    data['conductivity' + (j+1)] = conductivity_value / 100;
                }
                var temperature_value = readUInt16LE(bytes.slice(i + 6 + (j * 6), i + 8 + (j * 6)));
                if (temperature_value === 0xffff) {
                    data['temperature' + (j+1) + '_error']  = readSensorStatus(1);
                } else if (temperature_value === 0xfffd) {
                    data['temperature' + (j+1) + '_error'] = readSensorStatus(2);
                } else {
                    data['temperature' + (j+1)] = readInt16LE(bytes.slice(i + 6 + (j * 6), i + 8 + (j * 6))) / 10;
                }
                var soil_moisture_value = readUInt16LE(bytes.slice(i + 8 + (j * 6), i + 10 + (j * 6)));
                if (soil_moisture_value === 0xffff) {
                    data['soil_moisture' + (j+1) + '_error'] = readSensorStatus(1);
                } else if (soil_moisture_value === 0xfffd) {
                    data['soil_moisture' + (j+1) + '_error'] = readSensorStatus(2);
                } else {
                    data['soil_moisture' + (j+1)]  = soil_moisture_value / 10;
                }
            }
            
            i += 22;

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
        case 0x03:
            decoded.report_interval = readUInt16LE(bytes.slice(offset, offset + 2));
            offset += 2;
            break;
        case 0x06:
            var data = readUInt8(bytes[offset]);
            var condition = data & 0x07;
            var id = (data >> 3) & 0x0f;
            var enable = (data >> 7) & 0x01;
            var key = '';

            // conductivity alarm
            if (id === 1 || id === 5 || id === 9) {
                switch (id) {
                    case 1:
                        key = 'conductivity1_alarm_config';
                        break;
                    case 5:
                        key = 'conductivity2_alarm_config';
                        break;
                    case 9:
                        key = 'conductivity3_alarm_config';
                        break;
                }
                decoded[key] = {};
                decoded[key].enable = readEnableStatus(enable);
                decoded[key].condition = readConditionType(condition);
                decoded[key].threshold_min = readUInt16LE(bytes.slice(offset + 1, offset + 3)) / 100;
                decoded[key].threshold_max = readUInt16LE(bytes.slice(offset + 3, offset + 5)) / 100;
            }
            // temperature alarm
            else if (id === 2 || id === 6 || id === 10) {
                switch (id) {
                    case 2:
                        key = 'temperature1_alarm_config';
                        break;
                    case 6:
                        key = 'temperature2_alarm_config';
                        break;
                    case 10:
                        key = 'temperature3_alarm_config';
                        break;
                }
                decoded[key] = {};
                decoded[key].enable = readEnableStatus(enable);
                decoded[key].condition = readConditionType(condition);
                decoded[key].threshold_min = readInt16LE(bytes.slice(offset + 1, offset + 3)) / 10;
                decoded[key].threshold_max = readInt16LE(bytes.slice(offset + 3, offset + 5)) / 10;
            }
            // temperature mutation alarm
            else if (id === 3 || id === 7 || id === 11) {
                switch (id) {
                    case 3:
                        key = 'temperature1_mutation_alarm_config';
                        break;
                    case 7:
                        key = 'temperature2_mutation_alarm_config';
                        break;
                    case 11:
                        key = 'temperature3_mutation_alarm_config';
                        break;
                }
                decoded[key] = {};
                decoded[key].enable = readEnableStatus(enable);
                decoded[key].mutation = readUInt16LE(bytes.slice(offset + 3, offset + 5)) / 10;
            }
            // soil_moisture alarm
            else if (id === 4 || id === 8 || id === 12) {
                switch (id) {
                    case 4:
                        key = 'soil_moisture1_alarm_config';
                        break;
                    case 8:
                        key = 'soil_moisture2_alarm_config';
                        break;
                    case 12:
                        key = 'soil_moisture3_alarm_config';
                        break;
                }
                decoded[key] = {};
                decoded[key].enable = readEnableStatus(enable);
                decoded[key].condition = readConditionType(condition);
                decoded[key].threshold_min = readUInt16LE(bytes.slice(offset + 1, offset + 3)) / 10;
                decoded[key].threshold_max = readUInt16LE(bytes.slice(offset + 3, offset + 5)) / 10;
            }
            offset += 9;
            break;
        case 0x10:
            decoded.reboot = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x11:
            decoded.timestamp = readUInt32LE(bytes.slice(offset, offset + 4));
            offset += 4;
            break;
        case 0x17:
            decoded.time_zone = readTimeZone(readInt16LE(bytes.slice(offset, offset + 2)));
            offset += 2;
            break;
        case 0x18:
            var channel_id = readUInt8(bytes[offset]);
            if (channel_id === 0x00) {
                var value = bytes[offset + 1];
                decoded.sensor_all_enable = {};
                decoded.sensor_all_enable.temperature = readEnableStatus(value & 0x01);
                decoded.sensor_all_enable.soil_moisture = readEnableStatus(value >> 1 & 0x01);
                decoded.sensor_all_enable.conductivity = readEnableStatus(value >> 2 & 0x01);
            } else if (channel_id === 0x01) {
                decoded.sensor_temperature_enable = readEnableStatus(bytes[offset + 1] & 0x01);
            } else if (channel_id === 0x02) {
                decoded.sensor_soil_moisture_enable = readEnableStatus(bytes[offset + 1] & 0x01);
            } else if (channel_id === 0x03) {
                decoded.sensor_conductivity_enable = readEnableStatus(bytes[offset + 1] & 0x01);
            }
            offset += 2;
            break;
        case 0x1c:
            decoded.recollection_config = {};
            decoded.recollection_config.counts = readUInt8(bytes[offset]);
            decoded.recollection_config.interval = readUInt8(bytes[offset + 1]);
            offset += 2;
            break;
        case 0x27:
            decoded.clear_history = readYesNoStatus(1);
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
        case 0x3b:
            decoded.time_sync_enable = readEnableStatus(bytes[offset]);
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
            var interval_type = readUInt8(bytes[offset]);
            switch (interval_type) {
                case 0:
                    decoded.retransmit_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
                    break;
                case 1:
                    decoded.resend_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
                    break;
            }
            offset += 3;
            break;
        case 0x84:
            decoded.d2d_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x96:
            var d2d_master_config = {};
            d2d_master_config.mode = readD2DMode(bytes[offset]);
            d2d_master_config.enable = readEnableStatus(bytes[offset + 1]);
            d2d_master_config.lora_uplink_enable = readEnableStatus(bytes[offset + 2]);
            d2d_master_config.d2d_cmd = readD2DCommand(bytes.slice(offset + 3, offset + 5));
            offset += 8;
            decoded.d2d_master_config = [];
            decoded.d2d_master_config.push(d2d_master_config);
            break;
        case 0xf1:
            var calibration_type = readUInt8(bytes[offset]);
            var key = '';
            if (calibration_type === 0x00 || calibration_type === 0x03 || calibration_type === 0x06) {
                switch (calibration_type) {
                    case 0x00:
                        key = 'temperature1_calibration_settings';
                        break;
                    case 0x03:
                        key = 'temperature2_calibration_settings';
                        break;
                    case 0x06:
                        key = 'temperature3_calibration_settings';
                        break;
                }
                decoded[key] = {};
                decoded[key].enable = readEnableStatus(bytes[offset + 1]);
                decoded[key].calibration_value = readInt16LE(bytes.slice(offset + 2, offset + 4)) / 10;
            } else if (calibration_type === 0x01 || calibration_type === 0x04 || calibration_type === 0x07) {
                switch (calibration_type) {
                    case 0x01:
                        key = 'soil_moisture1_calibration_settings';
                        break;
                    case 0x04:
                        key = 'soil_moisture2_calibration_settings';
                        break;
                    case 0x07:
                        key = 'soil_moisture3_calibration_settings';
                        break;
                }
                decoded[key] = {};
                decoded[key].enable = readEnableStatus(bytes[offset + 1]);
                decoded[key].calibration_value = readInt16LE(bytes.slice(offset + 2, offset + 4)) / 10;
            } else if (calibration_type === 0x02 || calibration_type === 0x05 || calibration_type === 0x08) {
                switch (calibration_type) {
                    case 0x02:
                        key = 'conductivity1_calibration_settings';
                        break;
                    case 0x05:
                        key = 'conductivity2_calibration_settings';
                        break;
                    case 0x08:
                        key = 'conductivity3_calibration_settings';
                        break;
                }
                decoded[key] = {};
                decoded[key].enable = readEnableStatus(bytes[offset + 1]);
                decoded[key].calibration_value = readInt16LE(bytes.slice(offset + 2, offset + 4)) / 100;
            }
            offset += 4;
            break;
        case 0xf2:
            decoded.alarm_report_counts = readUInt16LE(bytes.slice(offset, offset + 2));
            offset += 2;
            break;
        case 0xf5:
            decoded.alarm_release_enable = readEnableStatus(bytes[offset]);
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
    var major = (bytes[0] & 0xff).toString(16);
    var minor = (bytes[1] & 0xff) >> 4;
    return "v" + major + "." + minor;
}

function readFirmwareVersion(bytes) {
    var major = (bytes[0] & 0xff).toString(16);
    var minor = (bytes[1] & 0xff).toString(16);
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

function readYesNoStatus(status) {
    var status_map = { 0: "no", 1: "yes" };
    return getValue(status_map, status);
}

function readEnableStatus(status) {
    var status_map = { 0: "disable", 1: "enable" };
    return getValue(status_map, status);
}

function readTimeZone(time_zone) {
    var timezone_map = { "-120": "UTC-12", "-110": "UTC-11", "-100": "UTC-10", "-95": "UTC-9:30", "-90": "UTC-9", "-80": "UTC-8", "-70": "UTC-7", "-60": "UTC-6", "-50": "UTC-5", "-40": "UTC-4", "-35": "UTC-3:30", "-30": "UTC-3", "-20": "UTC-2", "-10": "UTC-1", 0: "UTC", 10: "UTC+1", 20: "UTC+2", 30: "UTC+3", 35: "UTC+3:30", 40: "UTC+4", 45: "UTC+4:30", 50: "UTC+5", 55: "UTC+5:30", 57: "UTC+5:45", 60: "UTC+6", 65: "UTC+6:30", 70: "UTC+7", 80: "UTC+8", 90: "UTC+9", 95: "UTC+9:30", 100: "UTC+10", 105: "UTC+10:30", 110: "UTC+11", 120: "UTC+12", 127: "UTC+12:45", 130: "UTC+13", 140: "UTC+14" };
    return getValue(timezone_map, time_zone);
}

function readSensorStatus(status) {
    var status_map = { 1: "sensor not recognized", 2: "out of range" };
    return getValue(status_map, status);
}

function readTemperatureAlarm(type) {
    var type_map = {
        0: "threshold alarm release",
        1: "threshold alarm",
        2: "mutation alarm",
    };
    return getValue(type_map, type);
}

function readConditionType(condition) {
    var condition_map = { 0: "disable", 1: "below", 2: "above", 3: "within", 4: "below or above", 5: "saltation" };
    return getValue(condition_map, condition);
}

function readD2DMode(mode) {
    var mode_map = { 
        1: "temperature1_alarm", 
        2: "temperature1_alarm_release", 
        3: "temperature1_mutation_alarm", 
        4: "conductivity1_alarm", 
        5: "conductivity1_alarm_release", 
        6: "soil_moisture1_alarm", 
        7: "soil_moisture1_alarm_release",
        8: "temperature2_alarm", 
        9: "temperature2_alarm_release", 
        10: "temperature2_mutation_alarm", 
        11: "conductivity2_alarm", 
        12: "conductivity2_alarm_release", 
        13: "soil_moisture2_alarm" ,
        14: "soil_moisture2_alarm_release",
        15: "temperature3_alarm", 
        16: "temperature3_alarm_release", 
        17: "temperature3_mutation_alarm", 
        18: "conductivity3_alarm", 
        19: "conductivity3_alarm_release", 
        20: "soil_moisture3_alarm" ,
        21: "soil_moisture3_alarm_release"
    };
    return getValue(mode_map, mode);
}

function readD2DCommand(bytes) {
    return ("0" + (bytes[1] & 0xff).toString(16)).slice(-2) + ("0" + (bytes[0] & 0xff).toString(16)).slice(-2);
}

function readHexString(bytes) {
    var temp = [];
    for (var idx = 0; idx < bytes.length; idx++) {
        temp.push(("0" + (bytes[idx] & 0xff).toString(16)).slice(-2));
    }
    return temp.join("");
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
