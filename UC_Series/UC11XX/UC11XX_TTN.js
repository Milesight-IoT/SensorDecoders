/**
 * Payload Decoder for The Things Network
 * 
 * Copyright 2021 Milesight IoT
 * 
 * @product UC11 series
 */
function Decoder(bytes, port) {
    var decoded = {};

    for (i = 0; i < bytes.length;) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];

        // Digital Input 1
         if (channel_id === 0x01 && channel_type !== 0xc8) {
            decoded.din1 = bytes[i] === 0 ? "off" : "on";
            i += 1;
        }
        // Digital Input 2
        else if (channel_id === 0x02 && channel_type !== 0xc8) {
            decoded.din2 = bytes[i] === 0 ? "off" : "on";
            i += 1;
        }
        // Pulse Counter 1
        else if (channel_id === 0x01 && channel_type === 0xc8) {
            decoded.counter1 = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // Pulse Counter 1
        else if (channel_id === 0x02 && channel_type === 0xc8) {
            decoded.counter2 = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
		// Digital Output 1
        else if (channel_id === 0x09) {
            decoded.dout1 = bytes[i] === 0 ? "off" : "on";
            i += 1;
        }
        // Digital Output 2
        else if (channel_id === 0x0a) {
            decoded.dout2 = bytes[i] === 0 ? "off" : "on";
            i += 1;
        }
        // ADC 1
        else if (channel_id === 0x11) {
            decoded.adc1 = {};
            decoded.adc1.cur = readInt16LE(bytes.slice(i, i + 2)) / 100;
            decoded.adc1.min = readInt16LE(bytes.slice(i + 2, i + 4)) / 100;
            decoded.adc1.max = readInt16LE(bytes.slice(i + 4, i + 6)) / 100;
            decoded.adc1.avg = readInt16LE(bytes.slice(i + 6, i + 8)) / 100;
            i += 8;
            continue;
        }
        // ADC 2
        else if (channel_id === 0x12) {
            decoded.adc2 = {};
            decoded.adc2.cur = readInt16LE(bytes.slice(i, i + 2)) / 100;
            decoded.adc2.min = readInt16LE(bytes.slice(i + 2, i + 4)) / 100;
            decoded.adc2.max = readInt16LE(bytes.slice(i + 4, i + 6)) / 100;
            decoded.adc2.avg = readInt16LE(bytes.slice(i + 6, i + 8)) / 100;
            i += 8;
            continue;
        }
        // MODBUS
        else if (channel_id === 0xFF && channel_type === 0x0E) {
            var modbus_chn_id = bytes[i++];
            var package_type = bytes[i++];
            var data_type = package_type & 7;
            var date_length = package_type >> 3;
            var chn = 'chn' + modbus_chn_id;
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
        }
    }

    return decoded;
}

/* ******************************************
 * bytes to number
 ********************************************/
function readUInt8LE(bytes) {
    return (bytes & 0xFF);
}

function readInt8LE(bytes) {
    var ref = readUInt8LE(bytes);
    return (ref > 0x7F) ? ref - 0x100 : ref;
}

function readUInt16LE(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return (value & 0xFFFF);
}

function readInt16LE(bytes) {
    var ref = readUInt16LE(bytes);
    return (ref > 0x7FFF) ? ref - 0x10000 : ref;
}

function readUInt32LE(bytes) {
    var value = (bytes[3] << 24) + (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
    return (value & 0xFFFFFFFF) >>> 0;
}

function readInt32LE(bytes) {
    var ref = readUInt32LE(bytes);
    return (ref > 0x7FFFFFFF) ? ref - 0x100000000 : ref;
}

function readFloatLE(bytes) {
    // JavaScript bitwise operators yield a 32 bits integer, not a float.
    // Assume LSB (least significant byte first).
    var bits = bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
    var sign = (bits >>> 31 === 0) ? 1.0 : -1.0;
    var e = bits >>> 23 & 0xff;
    var m = (e === 0) ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
    var f = sign * m * Math.pow(2, e - 150);
    return f;
}
