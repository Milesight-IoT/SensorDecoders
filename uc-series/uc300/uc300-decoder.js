/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product UC300
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

var gpio_in_chns = [0x03, 0x04, 0x05, 0x06];
var gpio_out_chns = [0x07, 0x08];
var pt100_chns = [0x09, 0x0a];
var ai_chns = [0x0b, 0x0c];
var av_chns = [0x0d, 0x0e];

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
            decoded.device_status = readOnOffStatus(1);
            i += 1;
        }
        // GPIO INPUT
        else if (includes(gpio_in_chns, channel_id) && channel_type === 0x00) {
            var id = channel_id - gpio_in_chns[0] + 1;
            var gpio_in_name = "gpio_in_" + id;
            decoded[gpio_in_name] = readOnOffStatus(bytes[i]);
            i += 1;
        }
        // GPIO OUTPUT
        else if (includes(gpio_out_chns, channel_id) && channel_type === 0x01) {
            var id = channel_id - gpio_out_chns[0] + 1;
            var gpio_out_name = "gpio_out_" + id;
            decoded[gpio_out_name] = readOnOffStatus(bytes[i]);
            i += 1;
        }
        // GPIO AS COUNTER
        else if (includes(gpio_in_chns, channel_id) && channel_type === 0xc8) {
            var id = channel_id - gpio_in_chns[0] + 1;
            var counter_name = "counter_" + id;
            decoded[counter_name] = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // PT100
        else if (includes(pt100_chns, channel_id) && channel_type === 0x67) {
            var id = channel_id - pt100_chns[0] + 1;
            var pt100_name = "pt100_" + id;
            decoded[pt100_name] = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // ADC CHANNEL
        else if (includes(ai_chns, channel_id) && channel_type === 0x02) {
            var id = channel_id - ai_chns[0] + 1;
            var adc_name = "adc_" + id;
            decoded[adc_name] = readUInt32LE(bytes.slice(i, i + 4)) / 100;
            i += 4;
            continue;
        }
        // ADC CHANNEL FOR VOLTAGE
        else if (includes(av_chns, channel_id) && channel_type === 0x02) {
            var id = channel_id - av_chns[0] + 1;
            var adv_name = "adv_" + id;
            decoded[adv_name] = readUInt32LE(bytes.slice(i, i + 4)) / 100;
            i += 4;
            continue;
        }
        // MODBUS
        else if (channel_id === 0xff && channel_type === 0x19) {
            var modbus_chn_id = bytes[i++] + 1;
            bytes[i++]; // skip data_length
            var data_type = bytes[i++];
            var sign = (data_type >>> 7) & 0x01;
            var type = data_type & 0x7f; // 0b01111111
            var chn = "modbus_chn_" + modbus_chn_id;
            switch (type) {
                case 0:
                    decoded[chn] = readOnOffStatus(bytes[i]);
                    i += 1;
                    break;
                case 1:
                    decoded[chn] = sign ? readInt8(bytes.slice(i, i + 1)) : readUInt8(bytes.slice(i, i + 1));
                    i += 1;
                    break;
                case 2:
                case 3:
                    decoded[chn] = sign ? readInt16LE(bytes.slice(i, i + 2)) : readUInt16LE(bytes.slice(i, i + 2));
                    i += 2;
                    break;
                case 4:
                case 6:
                    decoded[chn] = sign ? readInt32LE(bytes.slice(i, i + 4)) : readUInt32LE(bytes.slice(i, i + 4));
                    i += 4;
                    break;
                case 8:
                case 10:
                    decoded[chn] = sign ? readInt16LE(bytes.slice(i, i + 2)) : readUInt16LE(bytes.slice(i, i + 2));
                    i += 4;
                    break;
                case 9:
                case 11:
                    decoded[chn] = sign ? readInt16LE(bytes.slice(i + 2, i + 4)) : readUInt16LE(bytes.slice(i + 2, i + 4));
                    i += 4;
                    break;
                case 5:
                case 7:
                    decoded[chn] = readFloatLE(bytes.slice(i, i + 4));
                    i += 4;
                    break;
            }
        }
        // MODBUS READ ERROR
        else if (channel_id === 0xff && channel_type === 0x15) {
            var modbus_chn_id = bytes[i] + 1;
            var channel_name = "modbus_chn_" + modbus_chn_id + "_alarm";
            decoded[channel_name] = "read error";
            i += 1;
        }
        // ANALOG INPUT STATISTICS
        else if (includes(ai_chns, channel_id) && channel_type === 0xe2) {
            var id = channel_id - ai_chns[0] + 1;
            var adc_name = "adc_" + id;
            decoded[adc_name] = readFloat16LE(bytes.slice(i, i + 2));
            decoded[adc_name + "_max"] = readFloat16LE(bytes.slice(i + 2, i + 4));
            decoded[adc_name + "_min"] = readFloat16LE(bytes.slice(i + 4, i + 6));
            decoded[adc_name + "_avg"] = readFloat16LE(bytes.slice(i + 6, i + 8));
            i += 8;
        }
        // ANALOG VOLTAGE STATISTICS
        else if (includes(av_chns, channel_id) && channel_type === 0xe2) {
            var id = channel_id - av_chns[0] + 1;
            var adc_name = "adv_" + id;
            decoded[adc_name] = readFloat16LE(bytes.slice(i, i + 2));
            decoded[adc_name + "_max"] = readFloat16LE(bytes.slice(i + 2, i + 4));
            decoded[adc_name + "_min"] = readFloat16LE(bytes.slice(i + 4, i + 6));
            decoded[adc_name + "_avg"] = readFloat16LE(bytes.slice(i + 6, i + 8));
            i += 8;
        }
        // PT100 ARGS
        else if (includes(pt100_chns, channel_id) && channel_type === 0xe2) {
            var id = channel_id - pt100_chns[0] + 1;
            var pt100_name = "pt100_" + id;
            decoded[pt100_name] = readFloat16LE(bytes.slice(i, i + 2));
            decoded[pt100_name + "_max"] = readFloat16LE(bytes.slice(i + 2, i + 4));
            decoded[pt100_name + "_min"] = readFloat16LE(bytes.slice(i + 4, i + 6));
            decoded[pt100_name + "_avg"] = readFloat16LE(bytes.slice(i + 6, i + 8));
            i += 8;
        }
        // CHANNEL HISTORICAL DATA
        else if (channel_id === 0x20 && channel_type === 0xdc) {
            var timestamp = readUInt32LE(bytes.slice(i, i + 4));
            var channel_mask = numToBits(readUInt16LE(bytes.slice(i + 4, i + 6)), 16);
            i += 6;

            var data = { timestamp: timestamp };
            for (var j = 0; j < channel_mask.length; j++) {
                // SKIP UNUSED CHANNELS
                if (channel_mask[j] !== 1) continue;

                // GPIO INPUT
                if (j < 4) {
                    var type = bytes[i++];
                    // AS GPIO INPUT
                    if (type === 0) {
                        var name = "gpio_in_" + (j + 1);
                        data[name] = readOnOffStatus(readUInt32LE(bytes.slice(i, i + 4)));
                        i += 4;
                    }
                    // AS COUNTER
                    else {
                        var name = "counter_" + (j + 1);
                        data[name] = readUInt32LE(bytes.slice(i, i + 4));
                        i += 4;
                    }
                }
                // GPIO OUTPUT
                else if (j < 6) {
                    var name = "gpio_out_" + (j - 4 + 1);
                    data[name] = readOnOffStatus(bytes[i]);
                    i += 1;
                }
                // PT100
                else if (j < 8) {
                    var name = "pt100_" + (j - 6 + 1);
                    data[name] = readFloat16LE(bytes.slice(i, i + 2));
                    i += 2;
                }
                // ADC
                else if (j < 10) {
                    var name = "adc_" + (j - 8 + 1);
                    data[name] = readFloat16LE(bytes.slice(i, i + 2));
                    data[name + "_max"] = readFloat16LE(bytes.slice(i + 2, i + 4));
                    data[name + "_min"] = readFloat16LE(bytes.slice(i + 4, i + 6));
                    data[name + "_avg"] = readFloat16LE(bytes.slice(i + 6, i + 8));
                    i += 8;
                }
                // ADV
                else if (j < 12) {
                    var name = "adv_" + (j - 10 + 1);
                    data[name] = readFloat16LE(bytes.slice(i, i + 2));
                    data[name + "_max"] = readFloat16LE(bytes.slice(i + 2, i + 4));
                    data[name + "_min"] = readFloat16LE(bytes.slice(i + 4, i + 6));
                    data[name + "_avg"] = readFloat16LE(bytes.slice(i + 6, i + 8));
                    i += 8;
                }
                // CUSTOM MESSAGE
                else if (j < 13) {
                    data.text = readAscii(bytes.slice(i, 48));
                    i += 48;
                }
            }

            decoded.channel_history = decoded.channel_history || [];
            decoded.channel_history.push(data);
        }
        // MODBUS HISTORICAL DATA
        else if (channel_id === 0x20 && channel_type === 0xdd) {
            var timestamp = readUInt32LE(bytes.slice(i, i + 4));
            var modbus_chn_mask = numToBits(readUInt32LE(bytes.slice(i + 4, i + 8)), 32);
            i += 8;

            var data = { timestamp: timestamp };
            for (var j = 0; j < modbus_chn_mask.length; j++) {
                if (modbus_chn_mask[j] !== 1) continue;

                var chn = "modbus_chn_" + (j + 1);
                var data_type = bytes[i++];
                var sign = (data_type >>> 7) & 0x01;
                var type = data_type & 0x7f; // 0b01111111
                switch (type) {
                    case 0: // MB_COIL
                        decoded[chn] = readOnOffStatus(bytes[i]);
                        break;
                    case 1: // MB_DISCRETE
                        data[chn] = sign ? readInt8(bytes.slice(i, i + 1)) : readUInt8(bytes.slice(i, i + 1));
                        break;
                    case 2: // MB_INPUT_INT16
                    case 3: // MB_HOLDING_INT16
                        data[chn] = sign ? readInt16LE(bytes.slice(i, i + 2)) : readUInt16LE(bytes.slice(i, i + 2));
                        break;
                    case 4: // MB_HOLDING_INT32
                    case 6: // MB_INPUT_INT32
                        data[chn] = sign ? readInt32LE(bytes.slice(i, i + 4)) : readUInt32LE(bytes.slice(i, i + 4));
                        break;
                    case 8: // MB_INPUT_INT32_AB
                    case 10: // MB_HOLDING_INT32_AB
                        data[chn] = sign ? readInt16LE(bytes.slice(i, i + 2)) : readUInt16LE(bytes.slice(i, i + 2));
                        break;
                    case 9: // MB_INPUT_INT32_CD
                    case 11: // MB_HOLDING_INT32_CD
                        data[chn] = sign ? readInt16LE(bytes.slice(i + 2, i + 4)) : readUInt16LE(bytes.slice(i + 2, i + 4));
                        break;
                    case 5: // MB_HOLDING_FLOAT
                    case 7: // MB_INPUT_FLOAT
                        data[chn] = readFloatLE(bytes.slice(i, i + 4));
                        break;
                }
                i += 4;
            }

            decoded.modbus_history = decoded.modbus_history || [];
            decoded.modbus_history.push(data);
        }
        // DOWNLINK RESPONSE
        else if (channel_id === 0xfe || channel_id === 0xff) {
            var result = handle_downlink_response(channel_type, bytes, i);
            decoded = Object.assign(decoded, result.data);
            i = result.offset;
        }
        // TEXT
        else {
            decoded.text = readAscii(bytes.slice(i - 2, bytes.length));
            i = bytes.length;
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
        case 0x11:
            decoded.timestamp = readUInt32LE(bytes.slice(offset, offset + 4));
            offset += 4;
            break;
        case 0x17:
            decoded.time_zone = readTimeZone(readInt16LE(bytes.slice(offset, offset + 2)));
            offset += 2;
            break;
        case 0x91:
            decoded.jitter_config = decoded.jitter_config || {};
            var channel_map = { all: 0, gpio_in_1: 1, gpio_in_2: 2, gpio_in_3: 3, gpio_in_4: 4, gpio_out_1: 5, gpio_out_2: 6 };
            var channel_id = readUInt8(bytes[offset]);
            decoded.jitter_config[channel_map[channel_id]] = readUInt32LE(bytes.slice(offset + 1, offset + 5));
            offset += 5;
            break;
        case 0x92:
            var gpio_index = readUInt8(bytes[offset]);
            var gpio_out_chn_name = "gpio_out_" + gpio_index + "_control";
            decoded[gpio_out_chn_name] = {
                status: readOnOffStatus(bytes[offset + 1]),
                duration: readUInt32LE(bytes.slice(offset + 2, offset + 6)),
            };
            offset += 6;
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

function readTimeZone(time_zone) {
    var timezone_map = { "-120": "UTC-12", "-110": "UTC-11", "-100": "UTC-10", "-95": "UTC-9:30", "-90": "UTC-9", "-80": "UTC-8", "-70": "UTC-7", "-60": "UTC-6", "-50": "UTC-5", "-40": "UTC-4", "-35": "UTC-3:30", "-30": "UTC-3", "-20": "UTC-2", "-10": "UTC-1", 0: "UTC", 10: "UTC+1", 20: "UTC+2", 30: "UTC+3", 35: "UTC+3:30", 40: "UTC+4", 45: "UTC+4:30", 50: "UTC+5", 55: "UTC+5:30", 57: "UTC+5:45", 60: "UTC+6", 65: "UTC+6:30", 70: "UTC+7", 80: "UTC+8", 90: "UTC+9", 95: "UTC+9:30", 100: "UTC+10", 105: "UTC+10:30", 110: "UTC+11", 120: "UTC+12", 127: "UTC+12:45", 130: "UTC+13", 140: "UTC+14" };
    return getValue(timezone_map, time_zone);
}

function numToBits(num, bit_count) {
    var bits = [];
    for (var i = 0; i < bit_count; i++) {
        bits.push((num >> i) & 1);
    }
    return bits;
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
    // JavaScript bitwise operators yield a 32 bits integer, not a float.
    // Assume LSB (least significant byte first).
    var bits = (bytes[3] << 24) | (bytes[2] << 16) | (bytes[1] << 8) | bytes[0];
    var sign = bits >>> 31 === 0 ? 1.0 : -1.0;
    var e = (bits >>> 23) & 0xff;
    var m = e === 0 ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
    var f = sign * m * Math.pow(2, e - 150);

    var n = Number(f.toFixed(2));
    return n;
}

function readFloat16LE(bytes) {
    var bits = (bytes[1] << 8) | bytes[0];
    var sign = bits >>> 15 === 0 ? 1.0 : -1.0;
    var e = (bits >>> 10) & 0x1f;
    var m = e === 0 ? (bits & 0x3ff) << 1 : (bits & 0x3ff) | 0x400;
    var f = sign * m * Math.pow(2, e - 25);

    var n = Number(f.toFixed(2));
    return n;
}

function readAscii(bytes) {
    var str = "";
    for (var i = 0; i < bytes.length; i++) {
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
