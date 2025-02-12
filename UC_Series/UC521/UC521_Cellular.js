/**
 * Payload Decoder for Cellular
 *
 * Copyright 2024 Milesight IoT
 *
 * @product UC521
 */
function decodePayload(bytes) {
    var buffer = new Buffer(bytes);

    var payload = {};
    payload.startFlag = buffer.readUInt8();
    payload.tslVersion = readTslVersion(buffer.readBytes(2));
    payload.length = buffer.readUInt16BE();
    payload.flag = buffer.readUInt8();
    payload.frameCount = buffer.readUInt16BE();
    payload.protocolVersion = buffer.readUInt8();
    payload.firmwareVersion = buffer.readAscii(4);
    payload.hardwareVersion = buffer.readAscii(4);
    payload.sn = buffer.readAscii(16);
    payload.imei = buffer.readAscii(15);
    payload.imsi = buffer.readAscii(15);
    payload.iccid = buffer.readAscii(20);
    payload.csq = buffer.readUInt8();
    payload.data_length = buffer.readUInt16BE();
    payload.data = milesightDeviceDecode(buffer.slice(payload.data_length));

    return payload;
}

var valve_chns = [0x03, 0x05];
var valve_pulse_chns = [0x04, 0x06];
var gpio_chns = [0x07, 0x08];
var valve_exception_chns = [0xb3, 0xb5];

function milesightDeviceDecode(bytes) {
    var history = [];

    var decoded = {};
    var repack_flag = false;
    var buffer = new Buffer(bytes);
    while (buffer.remaining() > 0) {
        var channel_id = buffer.readUInt8();
        var channel_type = buffer.readUInt8();

        // set repack_flag to false when the end of the packet is reached
        if (repack_flag === true && ((channel_id === 0x07 && channel_type === 0xef) || (channel_id === 0x20 && channel_type === 0xef))) {
            history.push(decoded);

            repack_flag = false;
            decoded = {};
        }

        // BATTERY
        if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = buffer.readUInt8();
        }
        // VALVE
        else if (includes(valve_chns, channel_id) && channel_type === 0xf6) {
            var valve_channel_name = "valve_" + (valve_chns.indexOf(channel_id) + 1);
            var valve_type = buffer.readUInt8();
            var valve_opening = buffer.readUInt8();

            switch (valve_type) {
                case 0x00:
                    decoded[valve_channel_name + "_type"] = readValveType(valve_type);
                    decoded[valve_channel_name] = valve_opening;
                    break;
                case 0x01:
                    decoded[valve_channel_name + "_type"] = readValveType(valve_type);
                    if (valve_opening > 100) {
                        decoded[valve_channel_name + "_right"] = valve_opening - 100;
                    } else {
                        decoded[valve_channel_name + "_left"] = valve_opening;
                    }
                    break;
            }
        }
        // VALVE PULSE
        else if (includes(valve_pulse_chns, channel_id) && channel_type === 0xc8) {
            var valve_pulse_channel_name = "valve_" + (valve_pulse_chns.indexOf(channel_id) + 1);
            decoded[valve_pulse_channel_name + "_pulse"] = buffer.readUInt32LE();
        }
        // GPIO
        else if (includes(gpio_chns, channel_id) && channel_type === 0x01) {
            var gpio_channel_name = "gpio_" + (channel_id - gpio_chns[0] + 1);
            decoded[gpio_channel_name] = buffer.readUInt8() === 0 ? "low" : "high";
        }
        // PIPE PRESSURE
        else if (channel_id === 0x09 && channel_type === 0x7b) {
            var pipe_pressure = buffer.readUInt16LE();
            if (pipe_pressure === 0xffff) {
                decoded.pipe_pressure_exception = "Read Error";
            } else {
                decoded.pipe_pressure = pipe_pressure;
            }
        }
        // TIMESTAMP
        else if (channel_id === 0x0a && channel_type === 0xef) {
            decoded.timestamp = buffer.readUInt32LE();
            repack_flag = true;
        }
        // PIPE PRESSURE ALARM
        else if (channel_id === 0x0b && channel_type === 0xf5) {
            var source_type = buffer.readUInt8();
            var condition_type = buffer.readUInt8();
            var min = buffer.readUInt16LE();
            var max = buffer.readUInt16LE();
            var pressure = buffer.readUInt16LE();
            var alarm = buffer.readUInt8();

            var event = {};
            switch (source_type) {
                case 0x00:
                    event.source = "Every Change";
                    break;
                case 0x01:
                    event.source = "Valve 1 Opening";
                    break;
                case 0x02:
                    event.source = "Valve 2 Opening";
                    break;
                case 0x03:
                    event.source = "Valve 1 Opening or Valve 2 Opening";
                    break;
            }
            switch (condition_type) {
                case 0x01:
                    event.condition = "pipe_pressure less than min";
                    event.min = min;
                    break;
                case 0x02:
                    event.condition = "pipe_pressure more than max";
                    event.max = max;
                    break;
                case 0x03:
                    event.condition = "pipe_pressure between min and max";
                    event.min = min;
                    event.max = max;
                    break;
                case 0x04:
                    event.condition = "pipe_pressure out of min and max";
                    event.min = min;
                    event.max = max;
                    break;
            }
            event.pressure = pressure;
            event.alarm = alarm === 0 ? "Pipe Pressure Threshold Alarm Release" : "Pipe Pressure Threshold Alarm";
            decoded.pipe_pressure = pressure;
            decoded.pipe_pressure_alarm = event;
        }
        // VALVE CALIBRATION EVENT
        else if (channel_id === 0x0c && channel_type === 0xe3) {
            var valve_channel = buffer.readUInt8() + 1;
            var valve_channel_name = "valve_" + valve_channel;

            var event = {};
            event.source = buffer.readUInt8();
            event.target = buffer.readUInt8();
            event.result = buffer.readUInt8() === 0 ? "Failed" : "Success";

            decoded[valve_channel_name + "_calibration"] = event;
        }
        // OTA TASK RESULT
        else if (channel_id === 0x0d && channel_type === 0x01) {
            var result = buffer.readUInt8();

            decoded.ota_task_result = readOTATaskResult(result);
        }
        // VALVE EXCEPTION
        else if (includes(valve_exception_chns, channel_id) && channel_type === 0xf6) {
            var valve_channel_name = "valve_" + (valve_exception_chns.indexOf(channel_id) + 1);
            var valve_type = readValveType(buffer.readUInt8());
            var exception = readValveException(buffer.readUInt8());

            decoded[valve_channel_name + "_type"] = valve_type;
            decoded[valve_channel_name + "_exception"] = exception;
        }
        // PIPE PRESSURE EXCEPTION
        else if (channel_id === 0xb9 && channel_type === 0x7b) {
            var exception = buffer.readUInt8();
            decoded.pipe_pressure_exception = "Read Error";
        }
        // CUSTOM MESSAGE
        else if (channel_id === 0xff && channel_type === 0x2a) {
            var length = buffer.readUInt8();
            decoded.custom_message = buffer.readAscii(length);
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

Buffer.prototype.readBytes = function (length) {
    var bytes = this.bytes.slice(this.offset, this.offset + length);
    this.offset += length;
    return bytes;
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

function readValveType(type) {
    switch (type) {
        case 0x00:
            return "2-Way Ball Valve";
        case 0x01:
            return "3-Way Ball Valve";
    }
}

function readOTATaskResult(type) {
    switch (type) {
        case 0x00:
            return "Success";
        case 0x01:
            return "Failed: URL Error";
        case 0x02:
            return "Failed: Download Error";
        case 0x03:
            return "Failed: OTA Package is too Large";
        case 0x04:
            return "Failed: Incorrect Version";
        case 0x05:
            return "Failed: Unknown Error";
        case 0x06:
            return "Failed: Incorrect Format";
        case 0x07:
            return "Failed: CRC Check Error";
        case 0x08:
            return "Failed: Incorrect Model";
        case 0x09:
            return "Failed: Patch Recover Error";
    }
}

function readValveException(type) {
    switch (type) {
        case 0x00:
            return "Low Battery Power";
        case 0x01:
            return "Shutdown after getting I/O feedback";
        case 0x02:
            return "Incorrect Opening Time";
        case 0x03:
            return "Timeout";
        case 0x04:
            return "Valve Stall";
    }
}

function readTslVersion(bytes) {
    var major = bytes[0] & 0xff;
    var minor = bytes[1] & 0xff;
    return "v" + major + "." + minor;
}
