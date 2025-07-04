/**
 * Payload Decoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product EM500-SMTC
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

            // ℉
            // decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10 * 1.8 + 32;
            // i +=2;
        }
        // MOISTURE (old resolution 0.5)
        else if (channel_id === 0x04 && channel_type === 0x68) {
            decoded.moisture = bytes[i] / 2;
            i += 1;
        }
        // MOISTURE (new resolution 0.01)
        else if (channel_id === 0x04 && channel_type === 0xca) {
            decoded.moisture = readUInt16LE(bytes.slice(i, i + 2)) / 100;
            i += 2;
        }
        // EC
        else if (channel_id === 0x05 && channel_type === 0x7f) {
            decoded.ec = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // TEMPERATURE CHANGE ALARM
        else if (channel_id === 0x83 && channel_type === 0xd7) {
            decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            decoded.temperature_change = readInt16LE(bytes.slice(i + 2, i + 4)) / 10;
            decoded.temperature_alarm = readTemperatureAlarm(bytes[i + 4]);
            i += 5;
        }
        // HISTROY
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var data = {};
            data.timestamp = readUInt32LE(bytes.slice(i, i + 4));
            data.ec = readUInt16LE(bytes.slice(i + 4, i + 6));
            data.temperature = readInt16LE(bytes.slice(i + 6, i + 8)) / 10;
            data.moisture = readUInt16LE(bytes.slice(i + 8, i + 10)) / 100;
            i += 10;

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
    return value & 0xffffffff;
}

function readTemperatureAlarm(type) {
    switch (type) {
        case 0:
            return "threshold alarm";
        case 1:
            return "threshold alarm release";
        case 2:
            return "mutation alarm";
        default:
            return "unkown";
    }
}
