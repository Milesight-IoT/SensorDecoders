/**
 * Payload Decoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product GS301
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
        else if (channel_id === 0x02 && channel_type === 0x67) {
            // ℃
            decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;

            // ℉
            // decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10 * 1.8 + 32;
            // i +=2;
        }
        // HUMIDITY
        else if (channel_id === 0x03 && channel_type === 0x68) {
            decoded.humidity = bytes[i] / 2;
            i += 1;
        }
        // TVOC
        else if (channel_id === 0x18 && channel_type === 0x7d) {
            var tvoc_origin_value = readUInt16LE(bytes.slice(i, i + 2));
            if (tvoc_origin_value > 0xfffe) {
                decoded.tvoc_exception = "polarizing";
            } else {
                decoded.tvoc = tvoc_origin_value / 1000;
            }
            i += 2;
        }
        // NOX
        else if (channel_id === 0x37 && channel_type === 0x7d) {
            var nox_origin_value = readUInt16LE(bytes.slice(i, i + 2));
            if (nox_origin_value > 0xfffe) {
                decoded.nox_exception = "polarizing";
            } else {
                decoded.nox = nox_origin_value / 1000;
            }
            i += 2;
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
