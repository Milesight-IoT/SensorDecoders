/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product WT301 / WT302
 */
var RAW_VALUE = 0x00;

/* eslint no-redeclare: "off" */
/* eslint-disable */
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
/* eslint-enable */

function milesightDeviceDecode(bytes) {
    var decoded = {};
    var i = 0;
    decoded.head = bytes[i];
    decoded.command = readCommand(bytes[i + 1]);
    decoded.data_length = readInt16BE(bytes.slice(i + 2, i + 4));
    decoded.type = readType(bytes[i + 4]);
    decoded.raw = bytes.slice(i + 5, i + 5 + decoded.data_length);
    decoded.crc = bytes[i + 5 + decoded.data_length];

    var data_id = bytes[i + 4];
    switch (data_id) {
        case 0x01:
            decoded.thermostat_status = readOnOffStatus(bytes[i + 5]);
            break;
        case 0x02:
            decoded.btn_lock_enable = readEnableStatus(bytes[i + 5]);
            break;
        case 0x03:
            decoded.mode = readTemperatureControlMode(bytes[i + 5]);
            break;
        case 0x04:
            decoded.fan_speed = readFanSpeed(bytes[i + 5]);
            break;
        case 0x05:
            decoded.temperature = bytes[i + 5] / 2;
            break;
        case 0x06:
            decoded.target_temperature = bytes[i + 5] / 2;
            break;
        case 0x07:
            decoded.card_mode = readCardMode(bytes[i + 5]);
            break;
        case 0x08:
            decoded.control_mode = readControlMode(bytes[i + 5]);
            break;
        case 0x09:
            decoded.server_temperature = bytes[i + 5] / 2;
            break;
        case 0x0f:
            decoded.thermostat_status = readOnOffStatus(bytes[i + 5]);
            decoded.btn_lock_enable = readEnableStatus(bytes[i + 6]);
            decoded.mode = readTemperatureControlMode(bytes[i + 7]);
            decoded.fan_speed = readFanSpeed(bytes[i + 8]);
            decoded.temperature = bytes[i + 9] / 2;
            decoded.target_temperature = bytes[i + 10] / 2;
            decoded.card_mode = readCardMode(bytes[i + 11]);
            decoded.control_mode = readControlMode(bytes[i + 12]);
            decoded.server_temperature = bytes[i + 13] / 2;
            break;
    }

    return decoded;
}

function readCommand(command) {
    var command_map = { 1: "control", 2: "request" };
    return getValue(command_map, command);
}

function readType(type) {
    var type_map = { 0: "thermostat_status", 1: "btn_lock_enable", 2: "mode", 3: "fan_speed", 4: "temperature", 5: "temperature_target", 6: "card", 7: "control_mode", 8: "server_temperature", 9: "all" };
    return getValue(type_map, type);
}

function readOnOffStatus(status) {
    var status_map = { 0: "off", 1: "on" };
    return getValue(status_map, status);
}

function readEnableStatus(status) {
    var status_map = { 0: "disable", 1: "enable" };
    return getValue(status_map, status);
}

function readTemperatureControlMode(mode) {
    var mode_map = { 0: "cool", 1: "heat", 2: "fan" };
    return getValue(mode_map, mode);
}

function readFanSpeed(speed) {
    var speed_map = { 0: "auto", 1: "high", 2: "medium", 3: "low" };
    return getValue(speed_map, speed);
}

function readCardMode(mode) {
    var mode_map = { 0: "remove", 1: "insert" };
    return getValue(mode_map, mode);
}

function readControlMode(mode) {
    var mode_map = { 0: "auto", 1: "manual" };
    return getValue(mode_map, mode);
}

function readUInt16BE(bytes) {
    var value = (bytes[0] << 8) + bytes[1];
    return value & 0xffff;
}

function readInt16BE(bytes) {
    var ref = readUInt16BE(bytes);
    return ref > 0x7fff ? ref - 0x10000 : ref;
}

function getValue(map, key) {
    if (RAW_VALUE) return key;

    var value = map[key];
    if (!value) value = "unknown";
    return value;
}
