/**
 * Payload Decoder for Chirpstack and Milesight network server
 *
 * Copyright 2023 Milesight IoT
 *
 * @product AT101
 */
function Decode(fPort, bytes) {
    return milesight(bytes);
}

function milesight(bytes) {
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
            decoded.motion_status = ["unknown", "start", "moving", "stop"][status & 0x0f];
            decoded.geofence_status = ["inside", "outside", "unset", "unknown"][status >> 4];
            i += 9;
        }
        // DEVICE POSITION
        else if (channel_id === 0x05 && channel_type === 0x00) {
            decoded.position = bytes[i] === 0 ? "normal" : "tilt";
            i += 1;
        }
        // Wi-Fi SCAN RESULT
        else if (channel_id === 0x06 && channel_type === 0xd9) {
            var wifi = {};
            wifi.group = readUInt8(bytes[i]);
            wifi.mac = readMAC(bytes.slice(i + 1, i + 7));
            wifi.rssi = readInt8(bytes[i + 7]);

            var status = bytes[i + 8];
            decoded.motion_status = ["unknown", "start", "moving", "stop"][status & 0x03];
            decoded.wifi = decoded.wifi || [];
            decoded.wifi.push(wifi);
            i += 9;
        }
        // TAMPER STATUS
        else if (channel_id === 0x07 && channel_type === 0x00) {
            decoded.tamper_status = bytes[i] === 0 ? "install" : "uninstall";
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
