/**
 * Payload Decoder for NB-IoT Device
 *
 * Copyright 2025 Milesight IoT
 *
 * @product EM300-SLD / EM300-ZLD (NB-IoT)
 */
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
    var decoded = {};
    var history = [];
    var lastid = lastid || 0;
    var buffer = new Buffer(bytes);
    while (buffer.remaining() > 0) {
        var channel_id = buffer.readUInt8();
        var channel_type = buffer.readUInt8();

        // check if the channel id is continuous
        if (lastid - (channel_id & 0x0f) >= 0) {
            history.push(decoded);
            decoded = {};
            lastid = 0;
        }
        lastid = channel_id & 0x0f;

        // BATTERY
        if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = buffer.readUInt8();
        }
        // TEMPERATURE
        else if (channel_id === 0x03 && channel_type === 0x67) {
            decoded.temperature = buffer.readInt16LE() / 10;
        }
        // HUMIDITY
        else if (channel_id === 0x04 && channel_type === 0x68) {
            decoded.humidity = buffer.readUInt8() / 2;
        }
        // LEAKAGE STATUS
        else if (channel_id === 0x05 && channel_type === 0x00) {
            decoded.leakage_status = buffer.readUInt8() == 0 ? "normal" : "leak";
        }
        // TEMPERATURE, HUMIDITY & LEAKAGE STATUS HISTROY
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var point = {};
            point.timestamp = buffer.readUInt32LE();
            point.temperature = buffer.readInt16LE() / 10;
            point.humidity = buffer.readUInt8() / 2;
            point.leakage_status = buffer.readUInt8() === 0 ? "normal" : "leak";

            decoded.history = decoded.history || [];
            decoded.history.push(point);
        }
        // COLLECTING INTERVAL
        else if (channel_id === 0xff && channel_type === 0x02) {
            decoded.collecting_interval = buffer.readUInt16LE();
        }
        // POWER STATUS
        else if (channel_id === 0xff && channel_type === 0x0b) {
            buffer.readUInt8();
            decoded.power = "on";
        }
        // THRESHOLD ALARM
        else if (channel_id === 0xff && channel_type === 0x0d) {
            decoded.threshold = ["disable", "below", "above", "in", "outer"][buffer.readUInt8() & 0x07];
            decoded.threshold_below = buffer.readInt16LE() / 10;
            decoded.threshold_above = buffer.readInt16LE() / 10;
            decoded.threshold_current = buffer.readInt16LE() / 10;
        } else {
            break;
        }
    }

    history.push(decoded);

    return history;
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
