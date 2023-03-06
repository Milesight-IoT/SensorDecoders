/**
 * Payload Decoder for The Things Network
 *
 * Copyright 2023 Milesight IoT
 *
 * @product UC51x Series
 */
function Decoder(bytes, port) {
    return milesight(bytes);
}

function milesight(bytes) {
    var decoded = {};

    for (var i = 0; i < bytes.length; ) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];

        // BATTERY
        if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = bytes[i];
            i += 1;
        }
        // VALVE 1
        else if (channel_id === 0x03 && channel_type == 0x01) {
            decoded.valve_1 = bytes[i] === 0 ? "off" : "on";
            i += 1;
        }
        // VALVE 2
        else if (channel_id === 0x05 && channel_type == 0x01) {
            decoded.valve_2 = bytes[i] === 0 ? "close" : "on";
            i += 1;
        }
        // VALVE 1 Pulse
        else if (channel_id === 0x04 && channel_type === 0xc8) {
            decoded.valve_1_pulse = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // VALVE 2 Pulse
        else if (channel_id === 0x06 && channel_type === 0xc8) {
            decoded.valve_2_pulse = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // GPIO 1
        else if (channel_id === 0x07 && channel_type == 0x01) {
            decoded.gpio_1 = bytes[i] === 0 ? "off" : "on";
            i += 1;
        }
        // GPIO 2
        else if (channel_id === 0x08 && channel_type == 0x01) {
            decoded.gpio_2 = bytes[i] === 0 ? "off" : "on";
            i += 1;
        }
        // HISTORY
        else if (channel_id === 0x20 && channel_type === 0xce) {
            if (decoded.history == undefined) {
                decoded.history = [];
            }

            var timestamp = readUInt32LE(bytes.slice(i, i + 4));
            var data = bytes[i + 4];
            var status = (data & 0x01) === 0 ? "off" : "on";
            var mode = ((data >> 1) & 0x01) === 0 ? "counter" : "gpio";
            var gpio = ((data >> 2) & 0x01) === 0 ? "off" : "on";
            var index = ((data >> 4) & 0x01) === 0 ? "1" : "2";
            var pulse = readUInt32LE(bytes.slice(i + 5, i + 9));

            var payload = {};
            if (mode == "gpio") {
                payload["valve_" + index] = status;
                payload["gpio_" + index] = gpio;
                payload.mode = mode;
                payload.timestamp = timestamp;
            } else if (mode == "counter") {
                payload["valve_" + index] = status;
                payload["valve_" + index + "_pulse"] = pulse;
                payload.mode = mode;
                payload.timestamp = timestamp;
            }
            decoded.history.push(payload);
            i += 9;
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
    return value & 0xffffffff;
}

function readInt32LE(bytes) {
    var ref = readUInt32LE(bytes);
    return ref > 0x7fffffff ? ref - 0x100000000 : ref;
}
