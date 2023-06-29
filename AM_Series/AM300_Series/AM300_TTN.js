/**
 * Payload Decoder for The Things Network
 *
 * Copyright 2023 Milesight IoT
 *
 * @product AM307 / AM319
 */
function Decoder(bytes, port) {
    return milesight(bytes);
}

function milesight(bytes) {
    var decoded = {};

    for (var i = 0; i < bytes.length; ) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];
        // BATTERY
        if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = bytes[i];
            i += 1;
        }
        // TEMPERATURE
        else if (channel_id === 0x03 && channel_type === 0x67) {
            // ℃
            decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;

            // ℉
            // decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10 * 1.8 + 32;
            // i +=2;
        }
        // HUMIDITY
        else if (channel_id === 0x04 && channel_type === 0x68) {
            decoded.humidity = bytes[i] / 2;
            i += 1;
        }
        // PIR
        else if (channel_id === 0x05 && channel_type === 0x00) {
            decoded.pir = bytes[i] === 1 ? "trigger" : "idle";
            i += 1;
        }
        // LIGHT
        else if (channel_id === 0x06 && channel_type === 0xcb) {
            decoded.light_level = bytes[i];
            i += 1;
        }
        // CO2
        else if (channel_id === 0x07 && channel_type === 0x7d) {
            decoded.co2 = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // TVOC
        else if (channel_id === 0x08 && channel_type === 0x7d) {
            decoded.tvoc = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // PRESSURE
        else if (channel_id === 0x09 && channel_type === 0x73) {
            decoded.pressure = readUInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // HCHO
        else if (channel_id === 0x0a && channel_type === 0x7d) {
            decoded.hcho = readUInt16LE(bytes.slice(i, i + 2)) / 100;
            i += 2;
        }
        // PM2.5
        else if (channel_id === 0x0b && channel_type === 0x7d) {
            decoded.pm2_5 = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // PM10
        else if (channel_id === 0x0c && channel_type === 0x7d) {
            decoded.pm10 = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // O3
        else if (channel_id === 0x0d && channel_type === 0x7d) {
            decoded.o3 = readUInt16LE(bytes.slice(i, i + 2)) / 100;
            i += 2;
        }
        // BEEP
        else if (channel_id === 0x0e && channel_type === 0x01) {
            decoded.beep = bytes[i] === 1 ? "yes" : "no";
            i += 1;
        }
        // HISTORY DATA (AM307)
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var data = {};
            data.timestamp = readUInt32LE(bytes.slice(i, i + 4));
            data.temperature = readInt16LE(bytes.slice(i + 4, i + 6)) / 10;
            data.humidity = bytes[i + 6] / 2;
            data.pir = bytes[i + 7] === 1 ? "trigger" : "idle";
            data.light_level = bytes[i + 8];
            data.co2 = readUInt16LE(bytes.slice(i + 9, i + 11));
            data.tvoc = readUInt16LE(bytes.slice(i + 11, i + 13));
            data.pressure = readUInt16LE(bytes.slice(i + 13, i + 15)) / 10;
            i += 15;

            decoded.history = decoded.history || [];
            decoded.history.push(data);
        }
        // HISTORY DATA (AM308)
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var data = {};
            data.timestamp = readUInt32LE(bytes.slice(i, i + 4));
            data.temperature = readInt16LE(bytes.slice(i + 4, i + 6)) / 10;
            data.humidity = bytes[i + 6] / 2;
            data.pir = bytes[i + 7] === 1 ? "trigger" : "idle";
            data.light_level = bytes[i + 8];
            data.co2 = readUInt16LE(bytes.slice(i + 9, i + 11));
            data.tvoc = readUInt16LE(bytes.slice(i + 11, i + 13));
            data.pressure = readUInt16LE(bytes.slice(i + 13, i + 15)) / 10;
            data.pm2_5 = readUInt16LE(bytes.slice(i + 15, i + 17));
            data.pm10 = readUInt16LE(bytes.slice(i + 17, i + 19));
            i += 19;

            decoded.history = decoded.history || [];
            decoded.history.push(data);
        }
        // HISTORY DATA (AM319 CH2O)
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var data = {};
            data.timestamp = readUInt32LE(bytes.slice(i, i + 4));
            data.temperature = readInt16LE(bytes.slice(i + 4, i + 6)) / 10;
            data.humidity = bytes[i + 6] / 2;
            data.pir = bytes[i + 7] === 1 ? "trigger" : "idle";
            data.light_level = bytes[i + 8];
            data.co2 = readUInt16LE(bytes.slice(i + 9, i + 11));
            data.tvoc = readUInt16LE(bytes.slice(i + 11, i + 13));
            data.pressure = readUInt16LE(bytes.slice(i + 13, i + 15)) / 10;
            data.pm2_5 = readUInt16LE(bytes.slice(i + 15, i + 17));
            data.pm10 = readUInt16LE(bytes.slice(i + 17, i + 19));
            data.hcho = readUInt16LE(bytes.slice(i + 19, i + 21)) / 100;
            i += 21;

            decoded.history = decoded.history || [];
            decoded.history.push(data);
        }
        // HISTORY DATA (AM319 O3)
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var data = {};
            data.timestamp = readUInt32LE(bytes.slice(i, i + 4));
            data.temperature = readInt16LE(bytes.slice(i + 4, i + 6)) / 10;
            data.humidity = bytes[i + 6] / 2;
            data.pir = bytes[i + 7] === 1 ? "trigger" : "idle";
            data.light_level = bytes[i + 8];
            data.co2 = readUInt16LE(bytes.slice(i + 9, i + 11));
            data.tvoc = readUInt16LE(bytes.slice(i + 11, i + 13));
            data.pressure = readUInt16LE(bytes.slice(i + 13, i + 15)) / 10;
            data.pm2_5 = readUInt16LE(bytes.slice(i + 15, i + 17));
            data.pm10 = readUInt16LE(bytes.slice(i + 17, i + 19));
            data.o3 = readUInt16LE(bytes.slice(i + 19, i + 21)) / 100;
            i += 21;

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
