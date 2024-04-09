/**
 * Payload Decoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product WT30x
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
    var i = 0;
    var head = bytes[i];
    var command = ["", "control", "request"][bytes[i + 1]];
    var data_length = readInt16BE(bytes.slice(i + 2, i + 4));
    var type = ["thermostat_status", "btn_lock_enabled", "mode", "fan_speed", "temperature", "temperature_target", "card", "control_mode", "server_temperature", "all"][bytes[i + 4]];
    var raw = bytes.slice(i + 5, i + 5 + data_length);
    var crc = bytes[i + 5 + data_length];

    var data_id = bytes[i + 4];
    switch (data_id) {
        case 0x01:
            decoded.thermostat_status = bytes[i + 5] === 1 ? "on" : "off";
            break;
        case 0x02:
            decoded.btn_lock_enabled = bytes[i + 5] === 1 ? "enable" : "disable";
            break;
        case 0x03:
            decoded.mode = ["cool", "heat", "fan"][bytes[i + 5]];
            break;
        case 0x04:
            decoded.fan_speed = ["auto", "high", "medium", "low"][bytes[i + 5]];
            break;
        case 0x05:
            decoded.temperature = bytes[i + 5] / 2;
            break;
        case 0x06:
            decoded.temperature_target = bytes[i + 5] / 2;
            break;
        case 0x07:
            decoded.card = bytes[i + 5] === 1 ? "insert" : "remove";
            break;
        case 0x08:
            decoded.control_mode = ["auto", "manual"][bytes[i + 5]];
            break;
        case 0x09:
            decoded.server_temperature = bytes[i + 5] / 2;
            break;
        case 0x0f:
            decoded.thermostat_status = bytes[i + 5] === 1 ? "on" : "off";
            decoded.btn_lock_enabled = bytes[i + 6] === 1 ? "enable" : "disable";
            decoded.mode = ["cool", "heat", "fan"][bytes[i + 7]];
            decoded.fan_speed = ["auto", "high", "medium", "low"][bytes[i + 8]];
            decoded.temperature = bytes[i + 9] / 2;
            decoded.temperature_target = bytes[i + 10] / 2;
            decoded.card = bytes[i + 11] === 1 ? "insert" : "remove";
            decoded.control_mode = ["auto", "manual"][bytes[i + 12]];
            decoded.server_temperature = bytes[i + 13] / 2;
            break;
    }

    return decoded;
}

function readUInt16BE(bytes) {
    var value = (bytes[0] << 8) + bytes[1];
    return value & 0xffff;
}

function readInt16BE(bytes) {
    var ref = readUInt16BE(bytes);
    return ref > 0x7fff ? ref - 0x10000 : ref;
}
