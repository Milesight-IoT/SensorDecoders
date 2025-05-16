/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product UC50x (odm: 7050)
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

var gpio_chns = [0x03, 0x04];
var adc_chns = [0x05, 0x06];
var adc_alarm_chns = [0x85, 0x86];

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
            decoded.device_status = readOnOffStatus(1);
            i += 1;
        }
        // BATTERY
        else if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = readUInt8(bytes[i]);
            i += 1;
        }
        // GPIO (GPIO as Digital Input)
        else if (includes(gpio_chns, channel_id) && channel_type === 0x00) {
            var gpio_channel_name = "gpio_input_" + (channel_id - gpio_chns[0] + 1);
            decoded[gpio_channel_name] = readOnOffStatus(bytes[i]);
            i += 1;
        }
        // GPIO (GPIO as Digital Output)
        else if (includes(gpio_chns, channel_id) && channel_type ===  0x01) {
            var gpio_channel_name = "gpio_output_" + (channel_id - gpio_chns[0] + 1);
            decoded[gpio_channel_name] = readOnOffStatus(bytes[i]);
            i += 1;
        }
        //  GPIO (GPIO as PULSE COUNTER)
        else if (includes(gpio_chns, channel_id) && channel_type === 0xc8) {
            var gpio_channel_name = "gpio_counter_" + (channel_id - gpio_chns[0] + 1);
            decoded[gpio_channel_name] = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // ANALOG INPUT TYPE
        else if (channel_id === 0xff && channel_type === 0x14) {
            var channel = bytes[i];
            var chn_name = "adc_" + (channel >>> 4) + "_type";
            decoded[chn_name] = readAnalogInputType(channel & 0x0f);
            i += 1;
        }
        // ADC (UC50x v2)
        // firmware version 1.10 and below and UC50x V1, change 1000 to 100.
        else if (includes(adc_chns, channel_id) && channel_type === 0x02) {
            var adc_channel_name = "adc_" + (channel_id - adc_chns[0] + 1);
            decoded[adc_channel_name] = readInt16LE(bytes.slice(i, i + 2)) / 1000;
            decoded[adc_channel_name + "_min"] = readInt16LE(bytes.slice(i + 2, i + 4)) / 1000;
            decoded[adc_channel_name + "_max"] = readInt16LE(bytes.slice(i + 4, i + 6)) / 1000;
            decoded[adc_channel_name + "_avg"] = readInt16LE(bytes.slice(i + 6, i + 8)) / 1000;
            i += 8;
        }
        // ADC (UC50x v3)
        else if (includes(adc_chns, channel_id) && channel_type === 0xe2) {
            var adc_channel_name = "adc_" + (channel_id - adc_chns[0] + 1);
            decoded[adc_channel_name] = readFloat16LE(bytes.slice(i, i + 2));
            decoded[adc_channel_name + "_min"] = readFloat16LE(bytes.slice(i + 2, i + 4));
            decoded[adc_channel_name + "_max"] = readFloat16LE(bytes.slice(i + 4, i + 6));
            decoded[adc_channel_name + "_avg"] = readFloat16LE(bytes.slice(i + 6, i + 8));
            i += 8;
        }
        // SDI-12
        else if (channel_id === 0x08 && channel_type === 0xdb) {
            var name = "sdi12_" + (bytes[i++] + 1);
            decoded[name] = readString(bytes.slice(i, i + 36));
            i += 36;
        }
        // MODBUS
        else if ((channel_id === 0xff || channel_id === 0x80) && channel_type === 0x0e) {
            var modbus_chn_id = bytes[i++] - 6;
            var package_type = bytes[i++];
            var data_type = package_type & 0x07; // 0x07 = 0b00000111
            var chn = "chn_" + modbus_chn_id;
            switch (data_type) {
                case 0:
                case 1:
                    decoded[chn] = readOnOffStatus(bytes[i]);
                    i += 1;
                    break;
                case 2:
                case 3:
                    decoded[chn] = readUInt16LE(bytes.slice(i, i + 2));
                    i += 2;
                    break;
                case 4:
                case 6:
                    decoded[chn] = readUInt32LE(bytes.slice(i, i + 4));
                    i += 4;
                    break;
                case 5:
                case 7:
                    decoded[chn] = readFloatLE(bytes.slice(i, i + 4));
                    i += 4;
                    break;
            }

            if (channel_id === 0x80) {
                decoded[chn + "_alarm"] = readAlarm(bytes[i++]);
            }
        }
        // MODBUS READ ERROR
        else if (channel_id === 0xff && channel_type === 0x15) {
            var modbus_error_chn_id = bytes[i] - 6;
            var channel_name = "modbus_chn_" + modbus_error_chn_id;
            decoded[channel_name + "_alarm"] = "read error";
            i += 1;
        }
        // ADC alert (UC50x v3)
        else if (includes(adc_alarm_chns, channel_id) && channel_type === 0xe2) {
            var adc_channel_name = "adc_" + (channel_id - adc_alarm_chns[0] + 1);
            decoded[adc_channel_name] = readFloat16LE(bytes.slice(i, i + 2));
            decoded[adc_channel_name + "_min"] = readFloat16LE(bytes.slice(i + 2, i + 4));
            decoded[adc_channel_name + "_max"] = readFloat16LE(bytes.slice(i + 4, i + 6));
            decoded[adc_channel_name + "_avg"] = readFloat16LE(bytes.slice(i + 6, i + 8));
            i += 8;

            decoded[adc_channel_name + "_alarm"] = readAlarm(bytes[i++]);
        }
        // HISTORY DATA (odm: 7050)
        else if (channel_id === 0x20 && channel_type === 0xdc) {
            var timestamp = readUInt32LE(bytes.slice(i, i + 4));
            var gpio_1_type = readUInt8(bytes[i + 4]);
            var gpio_1_data = readUInt32LE(bytes.slice(i + 5, i + 9));
            var gpio_2_type = readUInt8(bytes[i + 9]);
            var gpio_2_data = readUInt32LE(bytes.slice(i + 10, i + 14));
            var temperature_value = readUInt32LE(bytes.slice(i + 14, i + 18));
            var pressure_value = readUInt32LE(bytes.slice(i + 18, i + 22));
            var temperature_mutation_data = readInt16LE(bytes.slice(i + 22, i + 24)) / 10;
            var pressure_mutation_data = readUInt16LE(bytes.slice(i + 24, i + 26));
            var sensor_status_data = readUInt8(bytes[i + 26]);
            var tamper_status_value = readUInt8(bytes[i + 27]);

            var data = { timestamp: timestamp };
            if (tamper_status_value === 0x01) {
                data.tamper_status = readTamperStatus(tamper_status_value);
            } else {
                if (gpio_1_type === 0x00) {
                    data.gpio_input_1 = readOnOffStatus(gpio_1_data);
                } else if ( gpio_1_type === 0x01) {
                    data.gpio_output_1 = readOnOffStatus(gpio_1_data);
                } else {
                    data.gpio_counter_1 = gpio_1_data;
                }
                if (gpio_2_type === 0x00) {
                    data.gpio_input_2 = readOnOffStatus(gpio_2_data);
                } else if ( gpio_2_type === 0x01) {
                    data.gpio_output_2 = readOnOffStatus(gpio_2_data);
                } else {
                    data.gpio_counter_2 = gpio_2_data;
                }
                if (!hasIllegalValue(temperature_value)) {
                    data.temperature = readInt32LE(bytes.slice(i + 14, i + 18)) / 10;
                    // check if temperature mutation is triggered
                    if( (sensor_status_data >>> 3) & 0x01 === 1 ) {
                        data.temperature_mutation = temperature_mutation_data;
                    }
                }
                if (!hasIllegalValue(pressure_value)) {
                    data.pressure = pressure_value;
                    // check if pressure mutation is triggered
                    if( (sensor_status_data >>> 7) & 0x01 === 1 ) {
                        data.pressure_mutation = pressure_mutation_data;
                    }
                }
                var sensor_type = 0x00;
                // no temperature sensor
                if (temperature_value === 0xfffe) {
                    sensor_type = 0x02; // pressure sensor
                } 
                // no pressure sensor
                else if (pressure_value === 0xfffe) {
                    sensor_type = 0x01; // temperature sensor
                }
                data.sensor_status = readHistorySensorStatus(sensor_type, sensor_status_data);
                data.tamper_status = readTamperStatus(tamper_status_value);
            }
            i += 28;

            decoded.history = decoded.history || [];
            decoded.history.push(data);
        }
        // HISTORY DATA (SDI-12)
        else if (channel_id === 0x20 && channel_type === 0xe0) {
            var timestamp = readUInt32LE(bytes.slice(i, i + 4));
            var channel_mask = numToBits(readUInt16LE(bytes.slice(i + 4, i + 6)), 16);
            i += 6;

            var data = { timestamp: timestamp };
            for (var j = 0; j < channel_mask.length; j++) {
                // skip if channel is not enabled
                if (channel_mask[j] === 0) continue;
                var name = "sdi12_" + (j + 1);
                data[name] = readString(bytes.slice(i, i + 36));
                i += 36;
            }

            decoded.history = decoded.history || [];
            decoded.history.push(data);
        }
        // HISTORY DATA (MODBUS)
        else if (channel_id === 0x20 && channel_type === 0xdd) {
            var timestamp = readUInt32LE(bytes.slice(i, i + 4));
            var channel_mask = numToBits(readUInt16LE(bytes.slice(i + 4, i + 6)), 16);
            i += 6;

            var data = { timestamp: timestamp };
            for (var j = 0; j < channel_mask.length; j++) {
                // skip if channel is not enabled
                if (channel_mask[j] === 0) continue;

                var name = "modbus_chn_" + (j + 1);
                var type = bytes[i++] & 0x07; // 0x07 = 0b00000111
                // 5 MB_REG_HOLD_FLOAT, 7 MB_REG_INPUT_FLOAT
                if (type === 5 || type === 7) {
                    data[name] = readFloatLE(bytes.slice(i, i + 4));
                } else {
                    data[name] = readUInt32LE(bytes.slice(i, i + 4));
                }

                i += 4;
            }

            decoded.history = decoded.history || [];
            decoded.history.push(data);
        }
        // TEMPERATURE (odm: 7050)
        else if (channel_id === 0x0a && channel_type === 0x67) {
            decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // TEMPERATURE ALARM (odm: 7050)
        else if (channel_id === 0x8a && channel_type === 0x67) {
            var event = {};
            event.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            event.alarm = readTemperatureAlarm(bytes[i + 2]);
            i += 3;
            decoded.event = decoded.event || [];
            decoded.event.push(event);
            decoded.temperature = event.temperature;
        }
        // TEMPERATURE MUTATION ALARM (odm: 7050)
        else if (channel_id === 0x9a && channel_type === 0x67) {
            var event = {};
            event.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            event.temperature_mutation = readInt16LE(bytes.slice(i + 2, i + 4)) / 10;
            event.alarm = readTemperatureAlarm(bytes[i + 4]);
            i += 5;
            decoded.event = decoded.event || [];
            decoded.event.push(event);
            decoded.temperature = event.temperature;
        }
        // TEMPERATURE SENSOR STATUS (odm: 7050)
        else if (channel_id === 0xba && channel_type === 0x67) {
            var event = {};
            event.temperature_sensor_status = readSensorStatus(bytes[i]);
            i += 1;
            decoded.event = decoded.event || [];
            decoded.event.push(event);
            decoded.temperature = event.temperature;
        }
        // PRESSURE (mBar) (odm: 7050)
        else if (channel_id === 0x0b && channel_type === 0xaa) {
            decoded.pressure = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // PRESSURE ALARM (odm: 7050)
        else if (channel_id === 0x8b && channel_type === 0xaa) {
            var event = {};
            event.pressure = readUInt16LE(bytes.slice(i, i + 2));
            event.alarm = readPressureAlarm(bytes[i + 2]);
            i += 3;
            decoded.event = decoded.event || [];
            decoded.event.push(event);
            decoded.pressure = event.pressure;
        }
        // PRESSURE MUTATION ALARM (odm: 7050)
        else if (channel_id === 0x9b && channel_type === 0xaa) {
            var event = {};
            event.pressure = readUInt16LE(bytes.slice(i, i + 2));
            event.pressure_mutation = readUInt16LE(bytes.slice(i + 2, i + 4));
            event.alarm = readPressureAlarm(bytes[i + 4]);
            i += 5;
            decoded.event = decoded.event || [];
            decoded.event.push(event);
            decoded.pressure = event.pressure;
        }
        // PRESSURE SENSOR STATUS (odm: 7050)
        else if (channel_id === 0xbb && channel_type === 0xaa) {
            var event = {};
            event.pressure_sensor_status = readSensorStatus(bytes[i]);
            i += 1;
            decoded.event = decoded.event || [];
            decoded.event.push(event);
        }
        // TAMPER STATUS (odm: 7050)
        else if (channel_id === 0x0c && channel_type === 0xab) {
            decoded.tamper_status = readTamperStatus(bytes[i]);
            i += 1;
        }
        // TAMPER STATUS ALARM (odm: 7050)
        else if (channel_id === 0x8c && channel_type === 0xab) {
            decoded.tamper_status = readTamperStatus(bytes[i]);
            i += 1;
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
        case 0x10:
            decoded.reboot = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x11:
            decoded.timestamp = readUInt32LE(bytes.slice(offset, offset + 4));
            offset += 4;
            break;
        case 0x17:
            decoded.timezone = readInt16LE(bytes.slice(offset, offset + 2)) / 10;
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
        case 0x68:
            decoded.history_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x69:
            decoded.retransmit_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x6a:
            var type = readUInt8(bytes[offset]);
            if (type === 0x00) {
                decoded.retransmit_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            } else if (type === 0x01) {
                decoded.resend_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            }
            offset += 3;
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

function readOnOffStatus(status) {
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

function readAlarm(type) {
    var alarm_map = { 1: "threshold alarm", 2: "value change alarm" };
    return getValue(alarm_map, type);
}

function readAnalogInputType(type) {
    var type_map = { 0: "current", 1: "voltage" };
    return getValue(type_map, type);
}

function readTemperatureAlarm(status) {
    var status_map = { 0: "alarm release", 1: "threshold alarm", 2: "mutation alarm" };
    return getValue(status_map, status);
}

function readPressureAlarm(status) {
    var status_map = { 0: "alarm release", 1: "threshold alarm", 2: "mutation alarm" };
    return getValue(status_map, status);
}

function readTamperStatus(status) {
    var status_map = { 0: "normal", 1: "triggered" };
    return getValue(status_map, status);
}

function readGPIOType(type) {
    var type_map = { 0: "digital_input", 1: "digital_output", 2: "counter" };
    return getValue(type_map, type);
}

function readHistorySensorStatus(type, status) {
    var data = {};
    // temperature sensor
    if (type === 0x01) {
        data.temperature_sensor_status = readSensorStatus((status >>> 0) & 0x01);
        data.temperature_alarm = readThresholdAlarm((status >>> 1) & 0x03);
        data.temperature_mutation_alarm = readMutationAlarm((status >>> 3) & 0x01);
    } 
    // pressure sensor
    else if (type === 0x02) {
        data.pressure_sensor_status = readSensorStatus((status >>> 4) & 0x01);
        data.pressure_alarm = readThresholdAlarm((status >>> 5) & 0x03);
        data.pressure_mutation_alarm = readMutationAlarm((status >>> 7) & 0x01);
    }
    return data;
}

function readSensorStatus(status) {
    var status_map = { 0: "normal", 1: "read error", 2: "out of range" };
    return getValue(status_map, status);
}

function readThresholdAlarm(status) {
    var status_map = { 0: "normal", 1: "threshold alarm", 2: "threshold alarm release" };
    return getValue(status_map, status);
}

function readMutationAlarm(status) {
    var status_map = { 0: "normal", 1: "mutation alarm" };
    return getValue(status_map, status);
}

function hasIllegalValue(value) {
    return value === 0xfffe || value === 0xffff || value === 0xfffd;
}

function numToBits(num, bit_count) {
    var bits = [];
    for (var i = 0; i < bit_count; i++) {
        bits.push((num >> i) & 1);
    }
    return bits;
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
    return value & 0xffffffff;
}

function readInt32LE(bytes) {
    var ref = readUInt32LE(bytes);
    return ref > 0x7fffffff ? ref - 0x100000000 : ref;
}

function readFloat16LE(bytes) {
    var bits = (bytes[1] << 8) | bytes[0];
    var sign = bits >>> 15 === 0 ? 1.0 : -1.0;
    var e = (bits >>> 10) & 0x1f;
    var m = e === 0 ? (bits & 0x3ff) << 1 : (bits & 0x3ff) | 0x400;
    var f = sign * m * Math.pow(2, e - 25);
    return f;
}

function readFloatLE(bytes) {
    var bits = (bytes[3] << 24) | (bytes[2] << 16) | (bytes[1] << 8) | bytes[0];
    var sign = bits >>> 31 === 0 ? 1.0 : -1.0;
    var e = (bits >>> 23) & 0xff;
    var m = e === 0 ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
    var f = sign * m * Math.pow(2, e - 150);
    return f;
}

function readString(bytes) {
    var str = "";
    for (var i = 0; i < bytes.length; i++) {
        if (bytes[i] === 0) {
            break;
        }
        str += String.fromCharCode(bytes[i]);
    }
    return str;
}

function includes(data, value) {
    var size = data.length;
    for (var i = 0; i < size; i++) {
        if (data[i] == value) {
            return true;
        }
    }
    return false;
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

