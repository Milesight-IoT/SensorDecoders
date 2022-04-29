/**
 * Payload Decoder for The Things Network
 *
 * Copyright 2022 Milesight IoT
 *
 * @product UC300 series
 */

var gpio_in_chns = [0x03, 0x04, 0x05, 0x06];
var gpio_out_chns = [0x07, 0x08];
var pt100_chns = [0x09, 0x0a];
var ai_chns = [0x0b, 0x0c];
var av_chns = [0x0d, 0x0e];

function Decoder(bytes, fport) {
    var decoded = {};

    for (i = 0; i < bytes.length; ) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];

        // GPIO Input
        if (gpio_in_chns.includes(channel_id) && channel_type === 0x00) {
            var id = channel_id - gpio_in_chns[0] + 1;
            decoded[`gpio_in_${id}`] = bytes[i] === 0 ? "off" : "on";
            i += 1;
        }
        // GPIO Output
        else if (gpio_out_chns.includes(channel_id) && channel_type === 0x01) {
            var id = channel_id - gpio_out_chns[0] + 1;
            decoded[`gpio_out_${id}`] = bytes[i] === 0 ? "off" : "on";
            i += 1;
        }
        // GPIO AS counter
        else if (gpio_in_chns.includes(channel_id) && channel_type === 0xc8) {
            var id = channel_id - gpio_in_chns[0] + 1;
            decoded[`counter_${id}`] = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // PT100
        else if (pt100_chns.includes(channel_id) && channel_type === 0x67) {
            var id = channel_id - pt100_chns[0] + 1;
            decoded[`pt100_${id}`] = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // ADC CHANNEL
        else if (ai_chns.includes(channel_id) && channel_type === 0x02) {
            var id = channel_id - ai_chns[0] + 1;
            decoded[`adc_${id}`] = readUInt32LE(bytes.slice(i, i + 2)) / 100;
            i += 4;
            continue;
        }
        // ADC CHANNEL for voltage
        else if (av_chns.includes(channel_id) && channel_type === 0x02) {
            var id = channel_id - av_chns[0] + 1;
            decoded[`adv_${id}`] = readUInt32LE(bytes.slice(i, i + 2)) / 100;
            i += 4;
            continue;
        }
        // MODBUS
        else if (channel_id === 0xff && channel_type === 0x19) {
            var modbus_chn_id = bytes[i++] + 1;
            var data_length = bytes[i++];
            var data_type = bytes[i++];
            var chn = "chn" + modbus_chn_id;
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
                case 8:
                case 9:
                case 10:
                case 11:
                    decoded[chn] = readUInt32LE(bytes.slice(i, i + 4));
                    i += 4;
                    break;
                case 5:
                case 7:
                    decoded[chn] = readFloatLE(bytes.slice(i, i + 4));
                    i += 4;
                    break;
            }
        }
    }

    return decoded;
}

/* ******************************************
 * bytes to number
 ********************************************/
function readUInt8LE(bytes) {
    return bytes & 0xff;
}

function readInt8LE(bytes) {
    var ref = readUInt8LE(bytes);
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

function readFloatLE(bytes) {
    // JavaScript bitwise operators yield a 32 bits integer, not a float.
    // Assume LSB (least significant byte first).
    var bits = (bytes[3] << 24) | (bytes[2] << 16) | (bytes[1] << 8) | bytes[0];
    var sign = bits >>> 31 === 0 ? 1.0 : -1.0;
    var e = (bits >>> 23) & 0xff;
    var m = e === 0 ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
    var f = sign * m * Math.pow(2, e - 150);
    return f;
}
