/**
 * Payload Decoder
 *
 * Copyright 2026 Milesight IoT
 *
 * @product EM400-TLD
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
    var buffer = new Buffer(bytes);
    var decoded = {};

    decoded.start_flag = buffer.readUInt8();
    decoded.id = buffer.readUInt16BE();
    decoded.length = buffer.readUInt16BE();
    decoded.flag = buffer.readUInt8();
    decoded.frame_count = buffer.readUInt16BE();
    decoded.protocol_version = buffer.readUInt8();
    decoded.firmware_version = readNBIoTVersion(buffer.readAscii(4));
    decoded.hardware_version = readNBIoTVersion(buffer.readAscii(4));
    decoded.sn = buffer.readAscii(16);
    decoded.imei = buffer.readAscii(15);
    decoded.imsi = buffer.readAscii(15);
    decoded.iccid = buffer.readAscii(20);
    decoded.csq = buffer.readUInt8();
    decoded.data_length = buffer.readUInt16BE();
    decoded.data = decodeSensorData(buffer.slice(decoded.data_length));

    return decoded;
}

function decodeSensorData(bytes) {
    var decoded = {};
    var buffer = new Buffer(bytes);

    if (bytes.length === 0) {
        return [];
    }

    while (buffer.remaining() > 0) {
        var channel_id = buffer.readUInt8();
        var channel_type = buffer.readUInt8();

        if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = buffer.readUInt8();
        } else if (channel_id === 0x03 && channel_type === 0x67) {
            decoded.temperature = buffer.readInt16LE() / 10;
        } else if (channel_id === 0x04 && channel_type === 0x82) {
            decoded.distances = readDistances(buffer, 16);
        } else if (channel_id === 0x05 && channel_type === 0x00) {
            decoded.position = readPositionType(buffer.readUInt8());
        } else if (channel_id === 0x06 && channel_type === 0x88) {
            var latitude_raw = buffer.readInt32LE();
            var longitude_raw = buffer.readInt32LE();
            var status = buffer.readUInt8();

            decoded.latitude = latitude_raw === -1 ? null : latitude_raw / 1000000;
            decoded.longitude = longitude_raw === -1 ? null : longitude_raw / 1000000;
            decoded.motion_status = readMotionStatus(status & 0x0f);
            decoded.geofence_status = readGeofenceStatus((status >> 4) & 0x0f);
        } else if (channel_id === 0x08 && channel_type === 0xef) {
            decoded.timestamp = buffer.readUInt32LE();
        } else if (channel_id === 0x09 && channel_type === 0xa1) {
            decoded.mnc = readAsciiString(buffer, 4);
        } else if (channel_id === 0x0a && channel_type === 0xa2) {
            decoded.mcc = readAsciiString(buffer, 4);
        } else if (channel_id === 0x0b && channel_type === 0xa3) {
            decoded.cell_id = readAsciiString(buffer, 8);
        } else if (channel_id === 0x0c && channel_type === 0xa4) {
            decoded.lac = readAsciiString(buffer, 8);
        } else if (channel_id === 0x0d && channel_type === 0xa5) {
            decoded.package_status = readPackageStatus(buffer.readUInt8());
        } else if (channel_id === 0x83 && channel_type === 0x67) {
            decoded.temperature = buffer.readInt16LE() / 10;
            decoded.temperature_alarm = readAlarmType(buffer.readUInt8());
        } else if (channel_id === 0x84 && channel_type === 0x82) {
            decoded.distances = readDistances(buffer, 16);
            decoded.distance_alarm = readAlarmType(buffer.readUInt8());
        } else if (channel_id === 0x85 && channel_type === 0x00) {
            decoded.position_alarm = readPositionType(buffer.readUInt8());
        } else if (channel_id === 0x88 && channel_type === 0x00) {
            decoded.disassembly_alarm = readDisassemblyAlarmType(buffer.readUInt8());
        } else if (channel_id === 0xfe || channel_id === 0xff) {
            var result = handleDownlinkResponse(channel_id, channel_type, buffer);
            decoded = Object.assign(decoded, result);
        } else {
            break;
        }
    }

    return Object.keys(decoded).length > 0 ? [decoded] : [];
}

function handleDownlinkResponse(channel_id, channel_type, buffer) {
    var decoded = {};

    switch (channel_type) {
        case 0x02:
            decoded.collection_interval = buffer.readUInt32LE();
            break;
        case 0x03:
            decoded.report_interval = buffer.readUInt32LE();
            break;
        case 0x06:
            decoded.threshold_alarm_config = readThresholdAlarmConfig(buffer);
            break;
        case 0x10:
            decoded.reboot = readYesNoStatus(readActionStatus(channel_id, buffer, 0xff));
            break;
        case 0x13:
            decoded.bin_install_height_enable = readEnableStatus(buffer.readUInt8());
            break;
        case 0x1c:
            decoded.recollection_time = buffer.readUInt8();
            break;
        case 0x3e:
            decoded.tilt_linkage_enable = readEnableStatus(buffer.readUInt8());
            break;
        case 0x56:
            decoded.tof_enable = readEnableStatus(buffer.readUInt8());
            break;
        case 0x58:
            decoded.motion_detect_condition = {
                move_holding_time: buffer.readUInt8(),
                stop_holding_time: buffer.readUInt32LE(),
            };
            break;
        case 0x70:
            decoded.existing_height = buffer.readUInt16LE();
            break;
        case 0x71:
            decoded.working_mode = readWorkingMode(buffer.readUInt8());
            break;
        case 0x77:
            decoded.install_height = buffer.readUInt16LE();
            break;
        case 0x8e:
            decoded.motion_report_config = {
                enable: readEnableStatus(buffer.readUInt8()),
                period: buffer.readUInt32LE(),
            };
            break;
        case 0x9b:
            decoded.galaxy_type = readGalaxyType(buffer.readUInt8());
            break;
        case 0x9c:
            decoded.query_device_status = readYesNoStatus(1);
            break;
        case 0x9d:
            decoded.query_device_position = readYesNoStatus(1);
            break;
        case 0x9e:
            decoded.accumulated_packet_config = {
                enable: readEnableStatus(buffer.readUInt8()),
                count: buffer.readUInt8(),
            };
            break;
        case 0x9f:
            decoded.ack_enable = readEnableStatus(buffer.readUInt8());
            break;
        case 0xa0:
            decoded.gps_enable = readEnableStatus(buffer.readUInt8());
            break;
        case 0xa1:
            decoded.tilt_report_enable = readEnableStatus(buffer.readUInt8());
            break;
        case 0xa2:
            decoded.disassembly_alarm_config = {
                enable: readEnableStatus(buffer.readUInt8()),
                duration: buffer.readUInt8(),
            };
            break;
        case 0xa3:
            decoded.sim_card_priority = readSimCardPriority(buffer.readUInt8());
            break;
        case 0xa4:
            decoded.background_convergence_interval = buffer.readUInt8();
            break;
        case 0xa5:
            decoded.tilt_calibration = readYesNoStatus(1);
            break;
        case 0xa6:
            decoded.sensor_convergence = readYesNoStatus(1);
            break;
        default:
            throw new Error("unknown downlink response");
    }

    return decoded;
}

function readThresholdAlarmConfig(buffer) {
    var ctrl = buffer.readUInt8();

    return {
        condition: readMathConditionType(ctrl & 0x07),
        id: (ctrl >> 3) & 0x07,
        renew_alert: readEnableStatus((ctrl >> 7) & 0x01),
        min: buffer.readUInt16LE(),
        max: buffer.readUInt16LE(),
        lock_time: buffer.readUInt16LE(),
        continue_time: buffer.readUInt16LE(),
    };
}

function readActionStatus(channel_id, buffer, success_value) {
    var value = buffer.readUInt8();
    if (channel_id === 0xfe) {
        return value === success_value ? 1 : 0;
    }

    return value === success_value ? 1 : 0;
}

function readDistances(buffer, count) {
    var distances = [];
    for (var i = 0; i < count; i++) {
        distances.push(buffer.readUInt16LE());
    }
    return distances;
}

function readNBIoTVersion(version) {
    var major = parseInt(version.slice(0, 2), 10);
    var minor = parseInt(version.slice(2, 4), 10);
    if (isNaN(major) || isNaN(minor)) return version;
    return "v" + major + "." + minor;
}

function readAsciiString(buffer, length) {
    return buffer.readAscii(length).replace(/\u0000.*$/, "");
}

function readYesNoStatus(status) {
    var status_map = { 0: "no", 1: "yes" };
    return getValue(status_map, status);
}

function readEnableStatus(status) {
    var status_map = { 0: "disable", 1: "enable" };
    return getValue(status_map, status);
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

function readPackageStatus(status) {
    var status_map = { 0: "no_package", 1: "package_inserted" };
    return getValue(status_map, status);
}

function readDisassemblyAlarmType(type) {
    var type_map = { 0: "normal", 1: "device_abnormal_movement" };
    return getValue(type_map, type);
}

function readMathConditionType(type) {
    var type_map = { 0: "disable", 1: "below", 2: "above", 3: "within", 4: "outside" };
    return getValue(type_map, type);
}

function readWorkingMode(type) {
    var type_map = { 0: "standard", 1: "bin", 2: "parking" };
    return getValue(type_map, type);
}

function readSimCardPriority(type) {
    var type_map = { 0: "esim_first", 1: "physical_sim_first" };
    return getValue(type_map, type);
}

function readGalaxyType(type) {
    var type_map = {
        1: "beidou",
        2: "glonass_galileo",
        3: "glonass_qzss",
        4: "glonass",
        5: "auto_base_mcc",
    };
    return getValue(type_map, type);
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

Buffer.prototype.readHex = function (length) {
    var result = [];
    for (var i = 0; i < length; i++) {
        result.push(("0" + this.bytes[this.offset + i].toString(16)).slice(-2));
    }
    this.offset += length;
    return result.join("");
};

Buffer.prototype.slice = function (length) {
    return this.bytes.slice(this.offset, this.offset + length);
};

Buffer.prototype.remaining = function () {
    return this.bytes.length - this.offset;
};

/* eslint-disable */
Object.defineProperty(Object, "assign", {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function (target) {
        "use strict";
        if (target == null) {
            throw new TypeError("Cannot convert first argument to object");
        }

        var to = Object(target);
        for (var i = 1; i < arguments.length; i++) {
            var nextSource = arguments[i];
            if (nextSource == null) {
                continue;
            }
            nextSource = Object(nextSource);

            var keysArray = Object.keys(Object(nextSource));
            for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                var nextKey = keysArray[nextIndex];
                var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                if (desc !== undefined && desc.enumerable) {
                    if (Array.isArray(to[nextKey]) && Array.isArray(nextSource[nextKey])) {
                        to[nextKey] = to[nextKey].concat(nextSource[nextKey]);
                    } else {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    },
});
/* eslint-enable */
