/**
 * Payload Decoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product WTS305 / WTS505 / WTS506
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
        }
        // HUMIDITY
        else if (channel_id === 0x04 && channel_type === 0x68) {
            decoded.humidity = bytes[i] / 2;
            i += 1;
        }
        // WIND DIRECTION
        else if (channel_id === 0x05 && channel_type === 0x84) {
            decoded.wind_direction = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // BAROMETRIC PRESSURE
        else if (channel_id === 0x06 && channel_type === 0x73) {
            decoded.pressure = readUInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // WIND SPEED
        else if (channel_id === 0x07 && channel_type === 0x92) {
            decoded.wind_speed = readUInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // RAINFALL TOTAL
        else if (channel_id === 0x08 && channel_type === 0x77) {
            decoded.rainfall_total = readUInt16LE(bytes.slice(i, i + 2)) / 100;
            decoded.rainfall_counter = bytes[i + 2];
            i += 3;
        }
        // RAINFALL TOTAL (v3)
        else if (channel_id === 0x08 && channel_type === 0xec) {
            decoded.rainfall_total = readUInt32LE(bytes.slice(i, i + 4)) / 100;
            decoded.rainfall_counter = bytes[i + 4];
            i += 5;
        }
        // TEMPERATURE ALARM
        else if (channel_id === 0x83 && channel_type === 0x67) {
            decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            decoded.temperature_alarm = readAlarmType(bytes[i + 2]);
            i += 3;
        }
        // BAROMETRIC PRESSURE ALARM
        else if (channel_id === 0x86 && channel_type === 0x73) {
            decoded.pressure = readUInt16LE(bytes.slice(i, i + 2)) / 10;
            decoded.pressure_alarm = readAlarmType(bytes[i + 2]);
            i += 3;
        }
        // WIND SPEED ALARM
        else if (channel_id === 0x87 && channel_type === 0x92) {
            decoded.wind_speed = readUInt16LE(bytes.slice(i, i + 2)) / 10;
            decoded.wind_speed_alarm = readAlarmType(bytes[i + 2]);
            i += 3;
        }
        // RAINFALL ALARM
        else if (channel_id === 0x88 && channel_type === 0xec) {
            decoded.rainfall_total = readUInt32LE(bytes.slice(i, i + 4)) / 100;
            decoded.rainfall_counter = bytes[i + 4];
            decoded.rainfall_alarm = readAlarmType(bytes[i + 5]);
            i += 6;
        }
        // HISTORICAL DATA (v1)
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var data = {};
            data.timestamp = readUInt32LE(bytes.slice(i, i + 4));
            data.temperature = readInt16LE(bytes.slice(i + 4, i + 6)) / 10;
            data.humidity = bytes[i + 6] / 2;
            data.pressure = readUInt16LE(bytes.slice(i + 7, i + 9)) / 10;
            data.wind_direction = readInt16LE(bytes.slice(i + 9, i + 11)) / 10;
            data.wind_speed = readUInt16LE(bytes.slice(i + 11, i + 13)) / 10;
            data.rainfall_total = readUInt16LE(bytes.slice(i + 13, i + 15)) / 100;

            decoded.history = decoded.history || [];
            decoded.history.push(data);
            i += 15;
        }
        // HISTORICAL DATA (v2)
        else if (channel_id === 0x21 && channel_type === 0xce) {
            var data = {};
            data.timestamp = readUInt32LE(bytes.slice(i, i + 4));
            data.temperature = readInt16LE(bytes.slice(i + 4, i + 6)) / 10;
            data.humidity = bytes[i + 6] / 2;
            data.pressure = readUInt16LE(bytes.slice(i + 7, i + 9)) / 10;
            data.wind_direction = readInt16LE(bytes.slice(i + 9, i + 11)) / 10;
            data.wind_speed = readUInt16LE(bytes.slice(i + 11, i + 13)) / 10;
            data.rainfall_total = readUInt32LE(bytes.slice(i + 13, i + 17)) / 100;

            decoded.history = decoded.history || [];
            decoded.history.push(data);
            i += 17;
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

function readAlarmType(type) {
    switch (type) {
        case 0:
            return "threshold alarm release";
        case 1:
            return "threshold alarm";
        default:
            return "unkown";
    }
}
