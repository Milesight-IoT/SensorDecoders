/**
 * Payload Decoder for Cellular Device
 *
 * Copyright 2024 Milesight IoT
 *
 * @product UC51x
 */
function decodePayload(bytes) {
    var buffer = new Buffer(bytes);

    var payload = {};
    payload.startFlag = buffer.readUInt8();
    payload.tlsVersion = readVersion(buffer.readUInt8(), buffer.readUInt8());
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

function decodeSensorData(bytes) {
    var history = [];

    var decoded = {};
    var repack_flag = false;
    var buffer = new Buffer(bytes);
    while (buffer.remaining() > 0) {
        var channel_id = buffer.readUInt8();
        var channel_type = buffer.readUInt8();

        // set repack_flag to false when the end of the packet is reached
        if (repack_flag === true && channel_id === 0x0a && channel_type === 0xef) {
            history.push(decoded);

            repack_flag = false;
            decoded = {};
        }

        if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = buffer.readUInt8();
        }
        // VALVE 1
        else if (channel_id === 0x03 && channel_type == 0x01) {
            var valve = buffer.readUInt8();
            if (valve === 0xff) {
                decoded.solenoid_valve_1_error = "control failed";
            } else {
                decoded.solenoid_valve_1 = valve === 0 ? "close" : "open";
            }
        }
        // VALVE 2
        else if (channel_id === 0x05 && channel_type == 0x01) {
            var valve = buffer.readUInt8();
            if (valve === 0xff) {
                decoded.solenoid_valve_2_error = "control failed";
            } else {
                decoded.solenoid_valve_2 = valve === 0 ? "close" : "open";
            }
        }
        // VALVE 1 Pulse
        else if (channel_id === 0x04 && channel_type === 0xc8) {
            decoded.pulse_count_1 = buffer.readUInt32LE();
        }
        // VALVE 2 Pulse
        else if (channel_id === 0x06 && channel_type === 0xc8) {
            decoded.pulse_count_2 = buffer.readUInt32LE();
        }
        // GPIO 1
        else if (channel_id === 0x07 && channel_type == 0x01) {
            decoded.solenoid_valve_status_feedback_1 = buffer.readUInt8() === 0 ? "off" : "on";
        }
        // GPIO 2
        else if (channel_id === 0x08 && channel_type == 0x01) {
            decoded.solenoid_valve_status_feedback_2 = buffer.readUInt8() === 0 ? "off" : "on";
        }
        // PRESSURE
        else if (channel_id === 0x09 && channel_type === 0x7b) {
            decoded.pressure = buffer.readUInt16LE();
        }
        // TIMESTAMP
        else if (channel_id === 0x0a && channel_type === 0xef) {
            decoded.timestamp = buffer.readUInt32LE();

            repack_flag = true;
        }
        // CUSTOM MESSAGE
        else if (channel_id === 0xff && channel_type === 0x2a) {
            var length = buffer.readUInt8();
            decoded.text = buffer.readAscii(length);
        }
        // PRESSURE ALARM
        else if (channel_id === 0x0b && channel_type === 0xf5) {
            var data = {};
            var event_type = buffer.readUInt8();
            var condition = buffer.readUInt8();
            var min = buffer.readUInt16LE();
            var max = buffer.readUInt16LE();
            if (condition === 1 || condition === 3 || condition === 4) {
                decoded.min = min;
            }
            if (condition === 2 || condition === 3 || condition === 4) {
                decoded.max = max;
            }
            switch (event_type) {
                case 0x00:
                    decoded.event_type = "solenoid valve change";
                    break;
                case 0x01:
                    decoded.event_type = "solenoid valve 1 open";
                    break;
                case 0x02:
                    decoded.event_type = "solenoid valve 2 open";
                    break;
                case 0x03:
                    decoded.event_type = "solenoid valve 1 / solenoid valve 2 open";
                    break;
                default:
                    decoded.event_type = "unknown";
            }
            switch (condition) {
                case 0x01:
                    decoded.condition = "below";
                    break;
                case 0x02:
                    decoded.condition = "above";
                    break;
                case 0x03:
                    decoded.condition = "between";
                    break;
                case 0x04:
                    decoded.condition = "outside";
                    break;
            }
            decoded.pressure = buffer.readUInt16LE();
            decoded.pressure_alarm = buffer.readUInt8() === 1 ? "threshold alarm" : "threshold alarm release";
        }
        // PRESSURE READ ERROR
        else if (channel_id === 0xb9 && channel_type === 0x7b) {
            decoded.pressure_error = buffer.readUInt8() === 1 ? "read error" : "unknown";
        } else {
            break;
        }
    }

    if (Object.keys(decoded).length !== 0) {
        history.push(decoded);
    }
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

Buffer.prototype.readFloat16LE = function () {
    var bits = this.readUInt16LE();
    var sign = bits >>> 15 === 0 ? 1.0 : -1.0;
    var e = (bits >>> 10) & 0x1f;
    var m = e === 0 ? (bits & 0x3ff) << 1 : (bits & 0x3ff) | 0x400;
    var f = sign * m * Math.pow(2, e - 25);
    var v = Number(f.toFixed(2));
    return v;
};

Buffer.prototype.readFloatLE = function () {
    var value = this.readUInt32LE();
    var sign = value >>> 31 === 0 ? 1.0 : -1.0;
    var e = (value >>> 23) & 0xff;
    var m = e === 0 ? (value & 0x7fffff) << 1 : (value & 0x7fffff) | 0x800000;
    var f = sign * m * Math.pow(2, e - 150);
    var v = Number(f.toFixed(2));
    return v;
};

Buffer.prototype.readAscii = function (length) {
    var end = length;
    for (var i = 0; i < length; i++) {
        if (this.bytes[this.offset + i] === 0) {
            end = i;
            break;
        }
    }

    var str = String.fromCharCode.apply(null, this.bytes.slice(this.offset, this.offset + end));
    this.offset += length;
    return str;
};

Buffer.prototype.slice = function (length) {
    return this.bytes.slice(this.offset, this.offset + length);
};

Buffer.prototype.remaining = function () {
    return this.bytes.length - this.offset;
};

function includes(items, item) {
    var size = items.length;
    for (var i = 0; i < size; i++) {
        if (items[i] == item) {
            return true;
        }
    }
    return false;
}

function readVersion(b1, b2) {
    return ("0" + b1.toString(16)).slice(-2) + ("0" + b2.toString(16)).slice(-2);
}
