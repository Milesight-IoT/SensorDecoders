/**
 * Payload Decoder for The Things Network
 *
 * Copyright 2024 Milesight IoT
 *
 * @product EM300-CL
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
        // LIQUID
        else if (channel_id === 0x03 && channel_type === 0xed) {
            decoded.liquid = readLiquidStatus(bytes[i]);
            i += 1;
        }
        // CALIBRATION RESULT
        else if (channel_id === 0x04 && channel_type === 0xee) {
            decoded.calibration_result = bytes[i] === 0 ? "failed" : "success";
            i += 1;
        }
        // LIQUID ALARM
        else if (channel_id === 0x83 && channel_type === 0xed) {
            decoded.liquid = readLiquidStatus(bytes[i]);
            decoded.liquid_alarm = readAlarmType(bytes[i + 1]);
            i += 2;
        } else {
            break;
        }
    }

    return decoded;
}

/* ******************************************
 * bytes to number
 ********************************************/
function readLiquidStatus(type) {
    switch (type) {
        case 0:
            return "uncalibrated";
        case 1:
            return "full";
        case 2:
            return "empty";
        case 0xff:
            return "error";
        default:
            return "unkown";
    }
}

function readAlarmType(type) {
    switch (type) {
        case 0:
            return "empty alarm release";
        case 1:
            return "empty alarm";
        default:
            return "unkown";
    }
}
