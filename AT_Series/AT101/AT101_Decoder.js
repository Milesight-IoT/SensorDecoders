/**
 * Payload Decoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product AT101
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
            decoded.battery = readUInt8(bytes[i]);
            i += 1;
        }
        // TEMPERATURE
        else if (channel_id === 0x03 && channel_type === 0x67) {
            decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // LOCATION
        else if ((channel_id === 0x04 || channel_id == 0x84) && channel_type === 0x88) {
            decoded.latitude = readInt32LE(bytes.slice(i, i + 4)) / 1000000;
            decoded.longitude = readInt32LE(bytes.slice(i + 4, i + 8)) / 1000000;
            var status = bytes[i + 8];
            decoded.motion_status = readMotionStatus(status & 0x0f);
            decoded.geofence_status = readGeofenceStatus(status >> 4);
            i += 9;
        }
        // DEVICE POSITION
        else if (channel_id === 0x05 && channel_type === 0x00) {
            decoded.position = readDevicePosition(bytes[i]);
            i += 1;
        }
        // Wi-Fi SCAN RESULT
        else if (channel_id === 0x06 && channel_type === 0xd9) {
            var wifi = {};
            wifi.group = readUInt8(bytes[i]);
            wifi.mac = readMAC(bytes.slice(i + 1, i + 7));
            wifi.rssi = readInt8(bytes[i + 7]);
            wifi.motion_status = readMotionStatus(bytes[i + 8] & 0x0f);
            i += 9;

            decoded.wifi_scan_result = "finish";
            if (wifi.mac === "ff:ff:ff:ff:ff:ff") {
                decoded.wifi_scan_result = "timeout";
                continue;
            }
            decoded.motion_status = wifi.motion_status;

            decoded.wifi = decoded.wifi || [];
            decoded.wifi.push(wifi);
        }
        // TAMPER STATUS
        else if (channel_id === 0x07 && channel_type === 0x00) {
            decoded.tamper_status = readTamperStatus(bytes[i]);
            i += 1;
        }
        // TEMPERATURE WITH ABNORMAL
        else if (channel_id === 0x83 && channel_type === 0x67) {
            decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            decoded.temperature_abnormal = bytes[i + 2] == 0 ? false : true;
            i += 3;
        }
        // HISTORICAL DATA
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var location = {};
            location.timestamp = readUInt32LE(bytes.slice(i, i + 4));
            location.longitude = readInt32LE(bytes.slice(i + 4, i + 8)) / 1000000;
            location.latitude = readInt32LE(bytes.slice(i + 8, i + 12)) / 1000000;
            i += 12;

            decoded.history = decoded.history || [];
            decoded.history.push(location);
        } else {
            break;
        }
    }
    return decoded;
}

function readUInt8(bytes) {
    return bytes & 0xff;
}

function readInt8(bytes) {
    var ref = readUInt8(bytes);
    return ref > 0x7f ? ref - 0x100 : ref;
}

function readUInt16LE(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return value & 0xffff;
}

function readInt16LE(bytes) {
    var ref = readUInt16LE(bytes);
    return ref > 0x7fff ? ref - 0x10000 : ref;
}

function readUInt32LE(bytes) {
    var value = (bytes[3] << 24) + (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
    return (value & 0xffffffff) >>> 0;
}

function readInt32LE(bytes) {
    var ref = readUInt32LE(bytes);
    return ref > 0x7fffffff ? ref - 0x100000000 : ref;
}

function readMAC(bytes) {
    var temp = [];
    for (var idx = 0; idx < bytes.length; idx++) {
        temp.push(("0" + (bytes[idx] & 0xff).toString(16)).slice(-2));
    }
    return temp.join(":");
}

function readMotionStatus(type) {
    switch (type) {
        case 1:
            return "start";
        case 2:
            return "moving";
        case 3:
            return "stop";
        default:
            return "unknown";
    }
}

function readGeofenceStatus(type) {
    switch (type) {
        case 0:
            return "inside";
        case 1:
            return "outside";
        case 2:
            return "unset";
        default:
            return "unknown";
    }
}

function readDevicePosition(type) {
    switch (type) {
        case 0:
            return "normal";
        case 1:
            return "tilt";
        default:
            return "unknown";
    }
}

function readTamperStatus(type) {
    switch (type) {
        case 0:
            return "install";
        case 1:
            return "uninstall";
        default:
            return "unknown";
    }
}
