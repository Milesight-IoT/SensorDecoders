/**
 * Payload Decoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product GS101
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

        // GAS STATUS
        if (channel_id === 0x05 && channel_type === 0x8e) {
            decoded.state = bytes[i] === 0 ? "normal" : "abnormal";
            i += 1;
        }
        // VALVE
        else if (channel_id === 0x06 && channel_type === 0x01) {
            decoded.valve = bytes[i] === 0 ? "close" : "open";
            i += 1;
        }
        // RELAY
        else if (channel_id === 0x07 && channel_type === 0x01) {
            decoded.relay = bytes[i] === 0 ? "close" : "open";
            i += 1;
        }
        // REMAINED LIFE TIME
        else if (channel_id === 0x08 && channel_type === 0x90) {
            decoded.life_remain = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // ALARM
        else if (channel_id === 0xff && channel_type === 0x3f) {
            var alarm_type = bytes[i];
            i += 1;

            switch (alarm_type) {
                case 0:
                    decoded.alarm = "power down";
                    break;
                case 1:
                    decoded.alarm = "power on";
                    break;
                case 2:
                    decoded.alarm = "sensor failure";
                    break;
                case 3:
                    decoded.alarm = "sensor recover";
                    break;
                case 4:
                    decoded.alarm = "sensor about to fail";
                    break;
                case 5:
                    decoded.alarm = "sensor failed";
                    break;
                default:
                    decoded.alarm = "unknown";
                    break;
            }
        } else {
            break;
        }
    }

    return decoded;
}

/* ******************************************
 * bytes to number
 ********************************************/
function readUInt32LE(bytes) {
    var value = (bytes[3] << 24) + (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
    return (value & 0xffffffff) >>> 0;
}
