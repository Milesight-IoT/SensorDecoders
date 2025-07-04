/**
 * Payload Decoder for NB-IoT Device
 *
 * Copyright 2025 Milesight IoT
 *
 * @product EM400-UDL (NB-IoT)
 */
var RAW_VALUE = 0x00;

/* eslint no-redeclare: "off" */
/* eslint-disable */
function decodePayload(bytes) {
    var buffer = new Buffer(bytes);

    var payload = {};
    payload.startFlag = buffer.readUInt8();
    payload.id = buffer.readUInt16BE();
    payload.length = buffer.readUInt16BE();
    payload.flag = buffer.readUInt8();
    payload.frameCnt = buffer.readUInt16BE();
    payload.protocolVersion = buffer.readUInt8();
    payload.firmwareVersion = buffer.readAscii(4);
    payload.hardwareVersion = buffer.readAscii(4);
    payload.sn = buffer.readAscii(16);
    payload.imei = buffer.readAscii(15);
    payload.imsi = buffer.readAscii(15);
    payload.iccid = buffer.readAscii(20);
    payload.csq = buffer.readUInt8();
    payload.data_length = buffer.readUInt16BE();
    payload.data = decodeSensorData(buffer.slice(payload.data_length));

    return payload;
}
/* eslint-enable */

function decodeSensorData(bytes) {
    var history = [];

    var lastId = lastId || 0;
    var decoded = {};
    var buffer = new Buffer(bytes);
    while (buffer.remaining() > 0) {
        var channel_id = buffer.readUInt8();
        var channel_type = buffer.readUInt8();

        // check if the channel id is continuous
        if (lastId - (channel_id & 0x0f) >= 0) {
            history.push(decoded);
            decoded = {};
            lastId = 0;
        }
        lastId = channel_id & 0x0f;

        // BATTERY
        if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = buffer.readUInt8();
        }
        // TEMPERATURE
        else if (channel_id === 0x03 && channel_type === 0x67) {
            decoded.temperature = buffer.readUInt16LE() / 10;
        }
        // DISTANCE
        else if (channel_id === 0x04 && channel_type === 0x82) {
            decoded.distance = buffer.readUInt16LE();
        }
        // POSITION
        else if (channel_id === 0x05 && channel_type === 0x00) {
            decoded.position = readPositionType(buffer.readUInt8());
        }
        // LOCATION
        else if (channel_id === 0x06 && channel_type === 0x88) {
            decoded.latitude = buffer.readInt32LE() / 1000000;
            decoded.longitude = buffer.readInt32LE() / 1000000;

            var status = buffer.readUInt8();
            decoded.motion_status = readMotionStatus(status & 0x03);
            decoded.geofence_status = readGeofenceStatus(status >> 4);
        }
        // TEMPERATURE WITH ABNORMAL
        else if (channel_id === 0x83 && channel_type === 0x67) {
            decoded.temperature = buffer.readUInt16LE() / 10;
            decoded.temperature_alarm = readAlarmType(buffer.readUInt8());
        }
        // DISTANCE WITH ALARMING
        else if (channel_id === 0x84 && channel_type === 0x82) {
            decoded.distance = buffer.readUInt16LE();
            decoded.distance_alarm = readAlarmType(buffer.readUInt8());
        } else {
            break;
        }
    }

    // push the last channel
    history.push(decoded);

    return history;
}

function readPositionType(type) {
    var type_map = { 0: "normal", 1: "tilt" };
    return getValue(type_map, type);
}

function readAlarmType(type) {
    var type_map = { 0: "threshold_alarm_release", 1: "threshold_alarm" };
    return getValue(type_map, type);
}

function readMotionStatus(status) {
    var status_map = { 0: "unknown", 1: "start", 2: "moving", 3: "stop" };
    return getValue(status_map, status);
}

function readGeofenceStatus(status) {
    var status_map = { 0: "inside", 1: "outside", 2: "unset", 3: "unknown" };
    return getValue(status_map, status);
}

function getValue(map, key) {
    if (RAW_VALUE) return key;

    var value = map[key];
    if (!value) value = "unknown";
    return value;
}

function Buffer(bytes) {
    this.bytes = bytes;
    this.length = bytes.length;
    this.offset = 0;
}

Buffer.prototype.readUInt8 = function () {
    var value = this.bytes[this.offset];
    this.offset += 1;
    return value & 0xff;
};

Buffer.prototype.readInt8 = function () {
    var value = this.readUInt8();
    return value > 0x7f ? value - 0x100 : value;
};

Buffer.prototype.readUInt16LE = function () {
    var value = (this.bytes[this.offset + 1] << 8) + this.bytes[this.offset];
    this.offset += 2;
    return value & 0xffff;
};

Buffer.prototype.readInt16LE = function () {
    var value = this.readUInt16LE();
    return value > 0x7fff ? value - 0x10000 : value;
};

Buffer.prototype.readUInt16BE = function () {
    var value = (this.bytes[this.offset] << 8) + this.bytes[this.offset + 1];
    this.offset += 2;
    return value & 0xffff;
};

Buffer.prototype.readInt16BE = function () {
    var value = this.readUIntBE();
    return value > 0x7fff ? value - 0x10000 : value;
};

Buffer.prototype.readUInt32LE = function () {
    var value = (this.bytes[this.offset + 3] << 24) + (this.bytes[this.offset + 2] << 16) + (this.bytes[this.offset + 1] << 8) + this.bytes[this.offset];
    this.offset += 4;
    return (value & 0xffffffff) >>> 0;
};

Buffer.prototype.readInt32LE = function () {
    var value = this.readUInt32LE();
    return value > 0x7fffffff ? value - 0x100000000 : value;
};

Buffer.prototype.readAscii = function (length) {
    var str = String.fromCharCode.apply(null, this.bytes.slice(this.offset, this.offset + length));
    this.offset += length;
    return str;
};

Buffer.prototype.slice = function (length) {
    return this.bytes.slice(this.offset, this.offset + length);
};

Buffer.prototype.remaining = function () {
    return this.bytes.length - this.offset;
};
