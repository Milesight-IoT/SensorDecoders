/**
 * Payload Decoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product TS301 / TS302
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
        // TEMPERATURE(CHANNEL 1 SENSOR)
        else if (channel_id === 0x03 && channel_type === 0x67) {
            decoded.temperature_chn1 = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // MAGNET STATUS(CHANNEL 1 SENSOR)
        else if (channel_id === 0x03 && channel_type === 0x00) {
            decoded.magnet_chn1 = bytes[i] === 0 ? "closed" : "opened";
            i += 1;
        }
        // TEMPERATURE(CHANNEL 2 SENSOR)
        else if (channel_id === 0x04 && channel_type === 0x67) {
            decoded.temperature_chn2 = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // MAGNET STATUS(CHANNEL 2 SENSOR)
        else if (channel_id === 0x04 && channel_type === 0x00) {
            decoded.magnet_chn2 = bytes[i] === 0 ? "closed" : "opened";
            i += 1;
        }
        // BUTTON TRIGGER TEMPERATURE REPORT
        else if (channel_id === 0x73 && channel_type === 0x67) {
            var temperature_raw_data = readUInt16LE(bytes.slice(i, i + 2));
            var temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;

            if (temperature_raw_data === 0xffff) {
                decoded.temperature_chn1_exception = "sensor error";
            } else {
                decoded.temperature_chn1 = temperature;
            }
            decoded.temperature_chn1_data_source = "button trigger";
        }
        // TEMPERATURE(CHANNEL 1 SENSOR) ALARM
        else if (channel_id === 0x83 && channel_type === 0x67) {
            var data = bytes[i + 2];
            var data_source = data >>> 7;
            decoded.temperature_chn1 = readInt16LE(bytes.slice(i, i + 2)) / 10;
            decoded.temperature_chn1_alarm = readAlarmType(data & 0x7f);
            decoded.temperature_chn1_data_source = data_source === 0 ? "period" : "button trigger";
            i += 3;
        }
        // TEMPERATURE(CHANNEL 1 SENSOR) ALARM
        else if (channel_id === 0x93 && channel_type === 0xd7) {
            decoded.temperature_chn1 = readInt16LE(bytes.slice(i, i + 2)) / 10;
            decoded.temperature_chn1_change = readInt16LE(bytes.slice(i + 2, i + 4)) / 100;
            decoded.temperature_chn1_alarm = readAlarmType(bytes[i + 4]);
            i += 5;
        }
        // BUTTON TRIGGER TEMPERATURE REPORT
        else if (channel_id === 0x74 && channel_type === 0x67) {
            var temperature_raw_data = readUInt16LE(bytes.slice(i, i + 2));
            var temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;

            if (temperature_raw_data === 0xffff) {
                decoded.temperature_chn2_exception = "sensor error";
            } else {
                decoded.temperature_chn2 = temperature;
            }
            decoded.temperature_chn2_data_source = "button trigger";
        }
        // TEMPERATURE(CHANNEL 2 SENSOR) ALARM
        else if (channel_id === 0x84 && channel_type === 0x67) {
            var data = bytes[i + 2];
            var data_source = data >>> 7;
            decoded.temperature_chn2 = readInt16LE(bytes.slice(i, i + 2)) / 10;
            decoded.temperature_chn2_alarm = readAlarmType(data & 0x7f);
            decoded.temperature_chn2_data_source = data_source === 0 ? "period" : "button trigger";
            i += 3;
        }
        // TEMPERATURE(CHANNEL 2 SENSOR) ALARM
        else if (channel_id === 0x94 && channel_type === 0xd7) {
            decoded.temperature_chn2 = readInt16LE(bytes.slice(i, i + 2)) / 10;
            decoded.temperature_chn2_change = readInt16LE(bytes.slice(i + 2, i + 4)) / 100;
            decoded.temperature_chn2_alarm = readAlarmType(bytes[i + 4]);
            i += 5;
        }
        // HISTORICAL DATA
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var timestamp = readUInt32LE(bytes.slice(i, i + 4));
            var mask = bytes[i + 4];
            i += 5;

            var data = {};
            data.timestamp = timestamp;
            var chn1_mask = mask >>> 4;
            var chn2_mask = mask & 0x0f;
            switch (chn1_mask) {
                case 0x01:
                    data.temperature_chn1 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                    data.temperature_chn1_alarm = "threshold";
                    break;
                case 0x02:
                    data.temperature_chn1 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                    data.temperature_chn1_alarm = "threshold release";
                    break;
                case 0x03:
                    data.temperature_chn1 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                    data.temperature_chn1_alarm = "mutation";
                    break;
                case 0x04:
                    data.temperature_chn1 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                    break;
                case 0x05:
                    data.magnet_chn1 = readInt16LE(bytes.slice(i, i + 2)) === 0 ? "closed" : "opened";
                    data.magnet_chn1_alarm = "threshold";
                    break;
                case 0x06:
                    data.magnet_chn1 = readInt16LE(bytes.slice(i, i + 2)) === 0 ? "closed" : "opened";
                    break;
                default:
                    break;
            }
            i += 2;

            switch (chn2_mask) {
                case 0x01:
                    data.temperature_chn2 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                    data.temperature_chn2_alarm = "threshold";
                    break;
                case 0x02:
                    data.temperature_chn2 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                    data.temperature_chn2_alarm = "threshold release";
                    break;
                case 0x03:
                    data.temperature_chn2 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                    data.temperature_chn2_alarm = "mutation";
                    break;
                case 0x04:
                    data.temperature_chn2 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                    break;
                case 0x05:
                    data.magnet_chn2 = readInt16LE(bytes.slice(i, i + 2)) === 0 ? "closed" : "opened";
                    data.magnet_chn2_alarm = "threshold";
                    break;
                case 0x06:
                    data.magnet_chn2 = readInt16LE(bytes.slice(i, i + 2)) === 0 ? "closed" : "opened";
                    break;
                default:
                    break;
            }
            i += 2;

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

function readAlarmType(type) {
    switch (type) {
        case 0:
            return "threshold release";
        case 1:
            return "threshold";
        case 2:
            return "mutation";
        default:
            return "unknown";
    }
}
