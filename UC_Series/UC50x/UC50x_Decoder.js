/**
 * Payload Decoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product UC50x
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

gpio_chns = [0x03, 0x04];
gpio_alarm_chns = [0x83, 0x84];
gpio_change_alarm_chns = [0x93, 0x94];

adc_chns = [0x05, 0x06];
adc_alarm_chns = [0x85, 0x86];
adc_change_alarm_chns = [0x95, 0x96];

function milesightDeviceDecode(bytes) {
    var decoded = {};

    for (var i = 0; i < bytes.length; ) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];

        // BATTERY
        if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = bytes[i];
            i += 1;
        }
        // GPIO (GPIO as Digital Input or Output)
        else if (includes(gpio_chns, channel_id) && (channel_type === 0x00 || channel_type === 0x01)) {
            var gpio_channel_name = "gpio_" + (channel_id - gpio_chns[0] + 1);
            decoded[gpio_channel_name] = bytes[i] === 0 ? "low" : "high";
            i += 1;
        }
        //  GPIO (GPIO as PULSE COUNTER)
        else if (includes(gpio_chns, channel_id) && channel_type === 0xc8) {
            var gpio_channel_name = "counter_" + (channel_id - gpio_chns[0] + 1);
            decoded[gpio_channel_name] = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // GPIO Alarm (GPIO as PULSE COUNTER)
        else if (includes(gpio_alarm_chns, channel_id) && channel_type === 0xc8) {
            var gpio_channel_name = "counter_" + (channel_id - gpio_alarm_chns[0] + 1);
            decoded[gpio_channel_name] = readUInt32LE(bytes.slice(i, i + 4));
            decoded[gpio_channel_name + "_alarm"] = readAlarm(bytes[i + 4]);
            i += 5;
        }
        // COUNTER CHANGE ALARM (GPIO as PULSE COUNTER)
        else if (includes(gpio_change_alarm_chns, channel_id) && channel_type === 0xc8) {
            var gpio_channel_name = "counter_" + (channel_id - gpio_change_alarm_chns[0] + 1);
            decoded[gpio_channel_name] = readUInt32LE(bytes.slice(i, i + 4));
            decoded[gpio_channel_name + "_change"] = readUInt32LE(bytes.slice(i + 4, i + 8));
            decoded[gpio_channel_name + "_alarm"] = readAlarm(bytes[i + 8]);
            i += 9;
        }
        // ANALOG INPUT TYPE
        else if (channel_id === 0xff && channel_type === 0x14) {
            var channel = bytes[i];
            var chn_name = "adc_" + (channel >>> 4) + "_type";
            var chn_value = (channel & 0x0f) === 0 ? "current" : "voltage";
            decoded[chn_name] = chn_value;
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
            var value = readFloat16LE(bytes.slice(i, i + 2));
            decoded[adc_channel_name] = readFloat16LE(bytes.slice(i, i + 2));
            decoded[adc_channel_name + "_min"] = readFloat16LE(bytes.slice(i + 2, i + 4));
            decoded[adc_channel_name + "_max"] = readFloat16LE(bytes.slice(i + 4, i + 6));
            decoded[adc_channel_name + "_avg"] = readFloat16LE(bytes.slice(i + 6, i + 8));
            i += 8;
        }
        // ADC ALARM (UC50x v3)
        else if (includes(adc_alarm_chns, channel_id) && channel_type === 0xe2) {
            var adc_channel_name = "adc_" + (channel_id - adc_alarm_chns[0] + 1);
            decoded[adc_channel_name] = readFloat16LE(bytes.slice(i, i + 2));
            decoded[adc_channel_name + "_min"] = readFloat16LE(bytes.slice(i + 2, i + 4));
            decoded[adc_channel_name + "_max"] = readFloat16LE(bytes.slice(i + 4, i + 6));
            decoded[adc_channel_name + "_avg"] = readFloat16LE(bytes.slice(i + 6, i + 8));
            decoded[adc_channel_name + "_alarm"] = readAlarm(bytes[i + 8]);
            i += 9;
        }
        // ADC CHANGE ALARM (UC50x v3)
        else if (includes(adc_change_alarm_chns, channel_id) && channel_type === 0xe2) {
            var adc_channel_name = "adc_" + (channel_id - adc_change_alarm_chns[0] + 1);
            decoded[adc_channel_name] = readFloat16LE(bytes.slice(i, i + 2));
            decoded[adc_channel_name + "_min"] = readFloat16LE(bytes.slice(i + 2, i + 4));
            decoded[adc_channel_name + "_max"] = readFloat16LE(bytes.slice(i + 4, i + 6));
            decoded[adc_channel_name + "_avg"] = readFloat16LE(bytes.slice(i + 6, i + 8));
            decoded[adc_channel_name + "_change"] = readFloatLE(bytes.slice(i + 8, i + 12));
            decoded[adc_channel_name + "_alarm"] = readAlarm(bytes[i + 12]);
            i += 13;
        }
        // SDI-12
        else if (channel_id === 0x08 && channel_type === 0xdb) {
            var name = "sdi12_" + (bytes[i++] + 1);
            decoded[name] = readString(bytes.slice(i, i + 36));
            i += 36;
        }
        // MODBUS
        else if ((channel_id === 0xff || channel_id === 0x80 || channel_id === 0x90) && channel_type === 0x0e) {
            var modbus_chn_id = bytes[i++] - 6;
            var package_type = bytes[i++];
            var data_type = package_type & 0x07; // 0x07 = 0b00000111
            var chn = "modbus_chn_" + modbus_chn_id;
            switch (data_type) {
                case 0:
                    decoded[chn] = bytes[i] ? "on" : "off";
                    i += 1;
                    break;
                case 1:
                    decoded[chn] = bytes[i];
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

            if (channel_id === 0x90) {
                if (data_type === 5 || data_type === 7) {
                    decoded[chn + "_change"] = readFloatLE(bytes.slice(i, i + 4));
                } else {
                    decoded[chn + "_change"] = readUInt32LE(bytes.slice(i, i + 4));
                }
                i += 4;

                var data = {};
                data[chn] = decoded[chn];
                data[chn + "_change"] = decoded[chn + "_change"];
                data[chn + "_alarm"] = readAlarm(bytes[i++]);

                decoded.modbus_event = decoded.modbus_event || [];
                decoded.modbus_event.push(data);
            }

            if (channel_id === 0x80) {
                var data = {};
                data[chn] = decoded[chn];
                data[chn + "_alarm"] = readAlarm(bytes[i++]);

                decoded.modbus_event = decoded.modbus_event || [];
                decoded.modbus_event.push(data);
            }
        }
        // MODBUS READ ERROR
        else if (channel_id === 0xff && channel_type === 0x15) {
            var modbus_chn_id = bytes[i] - 6;
            var channel_name = "modbus_chn_" + modbus_chn_id;
            decoded[channel_name + "_exception"] = "read error";
            i += 1;
        }
        // MODBUS(New Version)
        else if ((channel_id === 0x09 || channel_id === 0x89 || channel_id === 0x99) && channel_type === 0xf3) {
            var modbus_chn_id = bytes[i++] + 1;
            var package_type = bytes[i++];
            var sign = package_type >>> 7;
            var data_type = package_type & 0x0f; // 0x0F = 0b00001111
            var modbus_chn_name = "modbus_chn_" + modbus_chn_id;
            switch (data_type) {
                case 0:
                case 1:
                    decoded[modbus_chn_name] = bytes[i];
                    i += 1;
                    break;
                case 2:
                case 3:
                    decoded[modbus_chn_name] = sign ? readInt16LE(bytes.slice(i, i + 2)) : readUInt16LE(bytes.slice(i, i + 2));
                    i += 2;
                    break;
                case 4:
                case 6:
                    decoded[modbus_chn_name] = sign ? readInt32LE(bytes.slice(i, i + 4)) : readUInt32LE(bytes.slice(i, i + 4));
                    i += 4;
                    break;
                case 5:
                case 7:
                    decoded[modbus_chn_name] = readFloatLE(bytes.slice(i, i + 4));
                    i += 4;
                    break;
                default:
                    throw new Error("Unknown data type");
            }

            var modbus_change_chn_name = modbus_chn_name + "_change";
            if (channel_id === 0x99) {
                switch (data_type) {
                    case 0:
                    case 1:
                        decoded[modbus_change_chn_name] = bytes[i];
                        i += 1;
                        break;
                    case 2:
                    case 3:
                        decoded[modbus_change_chn_name] = sign ? readInt16LE(bytes.slice(i, i + 2)) : readUInt16LE(bytes.slice(i, i + 2));
                        i += 2;
                        break;
                    case 4:
                    case 6:
                        decoded[modbus_change_chn_name] = sign ? readInt32LE(bytes.slice(i, i + 4)) : readUInt32LE(bytes.slice(i, i + 4));
                        i += 4;
                        break;
                    case 5:
                    case 7:
                        decoded[modbus_change_chn_name] = readFloatLE(bytes.slice(i, i + 4));
                        i += 4;
                        break;
                }

                var data = {};
                data[modbus_chn_name] = decoded[modbus_chn_name];
                data[modbus_change_chn_name] = decoded[modbus_change_chn_name];
                data[modbus_chn_name + "_alarm"] = readAlarm(bytes[i++]);

                decoded.modbus_event = decoded.modbus_event || [];
                decoded.modbus_event.push(data);
            }

            if (channel_id === 0x89) {
                var data = {};
                data[modbus_chn_name] = decoded[modbus_chn_name];
                data[modbus_chn_name + "_alarm"] = readAlarm(bytes[i++]);

                decoded.modbus_event = decoded.modbus_event || [];
                decoded.modbus_event.push(data);
            }
        }
        // MODBUS READ ERROR(New Version)
        else if (channel_id === 0xb9 && channel_type === 0xf3) {
            var modbus_chn_id = bytes[i] + 1;
            var modbus_chn_exception_name = "modbus_chn_" + modbus_chn_id + "_exception";
            decoded[modbus_chn_exception_name] = readException(bytes[i + 1]);
            i += 2;
        }
        // HISTORY DATA (GPIO / ADC)
        else if (channel_id === 0x20 && channel_type === 0xdc) {
            var timestamp = readUInt32LE(bytes.slice(i, i + 4));

            var data = { timestamp: timestamp };
            data.gpio_1 = readUInt32LE(bytes.slice(i + 5, i + 9));
            data.gpio_2 = readUInt32LE(bytes.slice(i + 10, i + 14));
            data.adc_1 = readInt32LE(bytes.slice(i + 14, i + 18)) / 1000;
            data.adc_2 = readInt32LE(bytes.slice(i + 18, i + 22)) / 1000;
            i += 22;

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

                var modbus_chn_name = "modbus_chn_" + (j + 1);
                var modbus_data_type = readUInt8(bytes[i++]);
                var sign = modbus_data_type >>> 7;
                var data_type = modbus_data_type & 0x07; // 0x07 = 0b00000111

                switch (data_type) {
                    case 0:
                    case 1:
                        data[modbus_chn_name] = bytes[i];
                        break;
                    case 2:
                    case 3:
                        data[modbus_chn_name] = sign ? readInt16LE(bytes.slice(i, i + 2)) : readUInt16LE(bytes.slice(i, i + 2));
                        break;
                    case 4:
                    case 6:
                        data[modbus_chn_name] = sign ? readInt32LE(bytes.slice(i, i + 4)) : readUInt32LE(bytes.slice(i, i + 4));  
                        break;
                    case 5:
                    case 7:
                        data[modbus_chn_name] = readFloatLE(bytes.slice(i, i + 4));
                        break;
                }

                i += 4;
            }

            decoded.history = decoded.history || [];
            decoded.history.push(data);
        } else {
            break;
        }
    }

    return decoded;
}

/* ******************************************
 * bytes to number
 ********************************************/
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

function includes(items, item) {
    var size = items.length;
    for (var i = 0; i < size; i++) {
        if (items[i] == item) {
            return true;
        }
    }
    return false;
}

function readAlarm(type) {
    switch (type) {
        case 0:
            return "threshold alarm release";
        case 1:
            return "threshold alarm";
        case 2:
            return "value change alarm";
        default:
            return "unknown";
    }
}

function readException(type) {
    switch (type) {
        case 0:
            return "read error";
        case 1:
            return "out of range";
        default:
            return "unknown";
    }
}
