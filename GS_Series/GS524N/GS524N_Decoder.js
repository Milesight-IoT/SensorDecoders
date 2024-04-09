/**
 * Payload Decoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product GS524N
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

    if (bytes.length != 6) {
        return decoded;
    }

    decoded.version = bytes[0] >>> 4;
    decoded.protocol = bytes[0] & 0x0f;
    decoded.type = getSensorType(bytes[1] >>> 4);
    decoded.event = getMessageType(bytes[1] & 0x0f);
    decoded.battery = bytes[2] & 0xff;
    decoded.concentration = bytes[3];
    decoded.temperature = getTemperature(bytes[4]);

    return decoded;
}

function getSensorType(type) {
    return type === 1 ? "smoke sensor" : "unknown";
}

function getMessageType(bytes) {
    switch (bytes) {
        case 0x01:
            return "alarm";
        case 0x02:
            return "silent";
        case 0x04:
            return "low battery";
        case 0x05:
            return "failover";
        case 0x07:
            return "normal";
        case 0x0a:
            return "removed";
        case 0x0b:
            return "installed";
        case 0x0e:
            return "testing alarm with normal battery";
        case 0x0f:
            return "testing alarm with low battery";
    }
}

function getTemperature(bytes) {
    return readInt8(bytes);
}

function readUInt8(bytes) {
    return bytes & 0xff;
}

function readInt8(bytes) {
    var ref = readUInt8(bytes);
    return ref > 0x7f ? ref - 0x100 : ref;
}
