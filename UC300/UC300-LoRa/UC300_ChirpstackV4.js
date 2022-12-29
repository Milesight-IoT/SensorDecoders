/**
 * Payload Decoder for Chirpstack and Milesight gateway network server
 *
 * Copyright 2022 Milesight IoT
 * Modified 2022-12-29 Leo Gaggl (leo@opensensing.com) for Chirpstack V4 compliance
 *
 * @product UC300 series
 */

const gpio_in_chns = [0x03, 0x04, 0x05, 0x06];
const gpio_out_chns = [0x07, 0x08];
const pt100_chns = [0x09, 0x0a];
const ai_chns = [0x0b, 0x0c];
const av_chns = [0x0d, 0x0e];

function decodeUplink(input) {
    let fPort = input.fPort;
    let bytes = input.bytes;
    let decoded = {};

    for (i = 0; i < bytes.length;) {
        let channel_id = bytes[i++];
        let channel_type = bytes[i++];

        // GPIO Input
        if (includes(gpio_in_chns, channel_id) && channel_type === 0x00) {
            let id = channel_id - gpio_in_chns[0] + 1;
            let gpio_in_name = "gpio_in_" + id;
            decoded[gpio_in_name] = bytes[i] === 0 ? "off" : "on";
            i += 1;
        }
        // GPIO Output
        else if (includes(gpio_out_chns, channel_id) && channel_type === 0x01) {
            let id = channel_id - gpio_out_chns[0] + 1;
            let gpio_out_name = "gpio_out_" + id;
            decoded[gpio_out_name] = bytes[i] === 0 ? "off" : "on";
            i += 1;
        }
        // GPIO AS counter
        else if (includes(gpio_in_chns, channel_id) && channel_type === 0xc8) {
            let id = channel_id - gpio_in_chns[0] + 1;
            let counter_name = "counter_" + id;
            decoded[counter_name] = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // PT100
        else if (includes(pt100_chns, channel_id) && channel_type === 0x67) {
            let id = channel_id - pt100_chns[0] + 1;
            let pt100_name = "pt100_" + id;
            decoded[pt100_name] = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // ADC CHANNEL
        else if (includes(ai_chns, channel_id) && channel_type === 0x02) {
            let id = channel_id - ai_chns[0] + 1;
            let adc_name = "adc_" + id;
            decoded[adc_name] = readUInt32LE(bytes.slice(i, i + 2)) / 100;
            i += 4;
            continue;
        }
        // ADC CHANNEL for voltage
        else if (includes(av_chns, channel_id) && channel_type === 0x02) {
            let id = channel_id - av_chns[0] + 1;
            let adv_name = "adv_" + id;
            decoded[adv_name] = readUInt32LE(bytes.slice(i, i + 2)) / 100;
            i += 4;
            continue;
        }
        // MODBUS
        else if (channel_id === 0xff && channel_type === 0x19) {
            let modbus_chn_id = bytes[i++] + 1;
            let data_length = bytes[i++];
            let data_type = bytes[i++];
            let chn = "chn" + modbus_chn_id;
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
        // MODBUS READ ERROR
        else if (channel_id === 0xff && channel_type === 0x15) {
            let modbus_chn_id = bytes[i] + 1;
            let channel_name = "channel_" + modbus_chn_id + "_error";
            decoded[channel_name] = true;
            i += 1;
        }
        else {
            break;
        }
    }

    return {data: decoded};
}

/* ******************************************
 * bytes to number
 ********************************************/
function readUInt8LE(bytes) {
    return bytes & 0xff;
}

function readInt8LE(bytes) {
    let ref = readUInt8LE(bytes);
    return ref > 0x7f ? ref - 0x100 : ref;
}

function readUInt16LE(bytes) {
    let value = (bytes[1] << 8) + bytes[0];
    return value & 0xffff;
}

function readInt16LE(bytes) {
    let ref = readUInt16LE(bytes);
    return ref > 0x7fff ? ref - 0x10000 : ref;
}

function readUInt32LE(bytes) {
    let value = (bytes[3] << 24) + (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
    return value & 0xffffffff;
}

function readInt32LE(bytes) {
    let ref = readUInt32LE(bytes);
    return ref > 0x7fffffff ? ref - 0x100000000 : ref;
}

function readFloatLE(bytes) {
    // JavaScript bitwise operators yield a 32 bits integer, not a float.
    // Assume LSB (least significant byte first).
    let bits = (bytes[3] << 24) | (bytes[2] << 16) | (bytes[1] << 8) | bytes[0];
    let sign = bits >>> 31 === 0 ? 1.0 : -1.0;
    let e = (bits >>> 23) & 0xff;
    let m = e === 0 ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
    let f = sign * m * Math.pow(2, e - 150);
    return f;
}

function includes(datas, value) {
    let size = datas.length;
    for (let i = 0; i < size; i++) {
        if (datas[i] == value) {
            return true;
        }
    }
    return false;
}
