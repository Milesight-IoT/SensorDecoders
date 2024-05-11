/**
 * Payload Decoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product WS302
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
        // SOUND
        else if (channel_id === 0x05 && channel_type === 0x5b) {
            var weight = bytes[i];
            var freq_weight = readFrequencyWeightType(weight & 0x03);
            var time_weight = readTimeWeightType((weight >> 2) & 0x03);

            sound_level_name = "L" + freq_weight + time_weight;
            sound_level_eq_name = "L" + freq_weight + "eq";
            sound_level_max_name = "L" + freq_weight + time_weight + "max";
            decoded[sound_level_name] = readUInt16LE(bytes.slice(i + 1, i + 3)) / 10;
            decoded[sound_level_eq_name] = readUInt16LE(bytes.slice(i + 3, i + 5)) / 10;
            decoded[sound_level_max_name] = readUInt16LE(bytes.slice(i + 5, i + 7)) / 10;
            i += 7;
        }
        // LoRaWAN Class Type
        else if (channel_id === 0xff && channel_type === 0x0f) {
            decoded.lorawan_class = readLoRaWANClass(bytes[i]);
            i += 1;
        } else {
            break;
        }
    }

    return decoded;
}

function readFrequencyWeightType(type) {
    switch (type) {
        case 0:
            return "Z";
        case 1:
            return "A";
        case 2:
            return "C";
    }
}

function readTimeWeightType(type) {
    switch (type) {
        case 0: // impulse time weighting
            return "I";
        case 1: // fast time weighting
            return "F";
        case 2: // slow time weighting
            return "S";
    }
}

function readUInt16LE(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return value & 0xffff;
}

function readInt16LE(bytes) {
    var ref = readUInt16LE(bytes);
    return ref > 0x7fff ? ref - 0x10000 : ref;
}

function readLoRaWANClass(type) {
    switch (type) {
        case 0:
            return "ClassA";
        case 1:
            return "ClassB";
        case 2:
            return "ClassC";
        case 3:
            return "ClassCtoB";
    }
}
