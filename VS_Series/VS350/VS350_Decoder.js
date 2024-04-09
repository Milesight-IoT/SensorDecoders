/**
 * Payload Decoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product VS350
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
        // TOTAL IN / OUT
        else if (channel_id === 0x04 && channel_type === 0xcc) {
            decoded.total_in = readUInt16LE(bytes.slice(i, i + 2));
            decoded.total_out = readUInt16LE(bytes.slice(i + 2, i + 4));
            i += 4;
        }
        // PERIOD IN / OUT
        else if (channel_id === 0x05 && channel_type === 0xcc) {
            decoded.period_in = readUInt16LE(bytes.slice(i, i + 2));
            decoded.period_out = readUInt16LE(bytes.slice(i + 2, i + 4));
            i += 4;
        }
        // TEMPERATURE ALARM
        else if (channel_id === 0x83 && channel_type === 0x67) {
            decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            decoded.temperature_alarm = readAlarmType(bytes[i + 2]);
            i += 3;
        }
        // TOTAL IN / OUT ALARM
        else if (channel_id === 0x84 && channel_type === 0xcc) {
            decoded.total_in = readUInt16LE(bytes.slice(i, i + 2));
            decoded.total_out = readUInt16LE(bytes.slice(i + 2, i + 4));
            decoded.total_count_alarm = readAlarmType(bytes[i + 4]);
            i += 5;
        }
        // PERIOD IN / OUT ALARM
        else if (channel_id === 0x85 && channel_type === 0xcc) {
            decoded.period_in = readUInt16LE(bytes.slice(i, i + 2));
            decoded.period_out = readUInt16LE(bytes.slice(i + 2, i + 4));
            decoded.period_count_alarm = readAlarmType(bytes[i + 4]);
            i += 5;
        }
        // HISTORICAL DATA
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var data = {};
            var timestamp = readUInt32LE(bytes.slice(i, i + 4));
            var type = bytes[i + 4];
            // historical data without total in/out
            if (type === 0) {
                data.timestamp = timestamp;
                data.period_in = readUInt16LE(bytes.slice(i + 5, i + 7));
                data.period_out = readUInt16LE(bytes.slice(i + 7, i + 9));
                i += 9;
            }
            // historical data with total in/out
            else if (type === 1) {
                data.timestamp = timestamp;
                data.period_in = readUInt16LE(bytes.slice(i + 5, i + 7));
                data.period_out = readUInt16LE(bytes.slice(i + 7, i + 9));
                data.total_in = readUInt16LE(bytes.slice(i + 9, i + 11));
                data.total_out = readUInt16LE(bytes.slice(i + 11, i + 13));
                i += 13;
            }

            decoded.history = decoded.history || [];
            decoded.history.push(data);
        } else {
            break;
        }
    }

    return decoded;
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

function readAlarmType(type) {
    switch (type) {
        case 0:
            return "threshold alarm release";
        case 1:
            return "threshold alarm";
        case 3:
            return "high temperature alarm";
        case 4:
            return "high temperature alarm release";
        default:
            return "unkown";
    }
}
