/**
 * Payload Decoder for NB-IoT Device
 *
 * Copyright 2024 Milesight IoT
 *
 * @product EM400-UDL (NB-IoT)
 */
function decodePayload(bytes) {
    var buffer = new Buffer(bytes);

    var payload = {};
    payload.startFlag = buffer.readUInt8();
    payload.id = buffer.readUInt16BE();
    payload.length = buffer.readUInt16BE();
    payload.flag = buffer.readUInt8();
    payload.frameCnt = buffer.readUInt16BE();
    payload.protocaolVersion = buffer.readUInt8();
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

function decodeSensorData(bytes) {
    var history = [];

    var lastid = lastid || 0;
    var decoded = {};
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
            decoded.temperature = buffer.readUInt16LE() / 10;
        }
        // DISTANCE
        else if (channel_id === 0x04 && channel_type === 0x82) {
            decoded.distance = buffer.readUInt16LE();
        }
        // POSITION
        else if (channel_id === 0x05 && channel_type === 0x00) {
            decoded.position = buffer.readUInt8() === 0 ? "normal" : "tilt";
        }
        // LOCATION
        else if (channel_id === 0x06 && channel_type === 0x88) {
            decoded.latitude = buffer.readInt32LE() / 1000000;
            decoded.longitude = buffer.readInt32LE() / 1000000;

            var status = buffer.readUInt8();
            decoded.motion_status = ["unknown", "start", "moving", "stop"][status & 0x03];
            decoded.geofence_status = ["inside", "outside", "unset", "unknown"][status >> 4];
        }
        // TEMPERATURE WITH ABNORMAL
        else if (channel_id === 0x83 && channel_type === 0x67) {
            decoded.temperature = buffer.readUInt16LE() / 10;
            decoded.temperature_abnormal = buffer.readUInt8() == 0 ? false : true;
        }
        // DISTANCE WITH ALARMING
        else if (channel_id === 0x84 && channel_type === 0x82) {
            decoded.distance = buffer.readUInt16LE();
            decoded.distance_alarming = buffer.readUInt8() == 0 ? false : true;
        } else {
            break;
        }
    }

    // push the last channel
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

function readHexString(hexString) {
    var bytes = [];
    for (var i = 0; i < hexString.length; i += 2) {
        bytes.push(parseInt(hexString.substr(i, 2), 16));
    }
    return bytes;
}

var bytes = readHexString("020001005f00000001303130313031313036373439443139303534363930303331383638353038303634383037333530343630303433323234323133313130383938363034313231303232373030363238353709000e01756403670b0104823b01050001");
var payload = decodePayload(bytes);
console.log(payload);
