/**
 * Payload Decoder for The Things Network
 *
 * Copyright 2022 Milesight IoT
 *
 * @product GS534N
 */
function Decoder(bytes, port) {
    var decoded = {};

    if (bytes.length != 6) {
        return decoded;
    }

    decoded.version = bytes[0] >> 4;
    decoded.protocol = bytes[0] & 0x0f;
    decoded.type = getSensorType(bytes[1]);
    decoded.event = getMessageType(bytes[1] & 0x0f);
    decoded.battery = bytes[2] & 0xff;
    decoded.concentration = bytes[3];
    decoded.temperature = getTemperature(bytes[4]);

    return decoded;
}

function getSensorType(raw) {
    return raw >> 4 === 1 ? "smoke sensor" : "unknown";
}

function getMessageType(raw) {
    switch (raw) {
        case 0x01:
            return 'alarm';
	case 0x02:
            return 'silent';
        case 0x04:
            return 'low battery';
	case 0x05:
            return 'failover';
        case 0x07:
            return 'normal';
	case 0x0A:
            return 'removed';
        case 0x0B:
            return 'installed';
	case 0x0E:
            return 'testing alarm with normal battery';
	case 0x0F:
            return 'testing alarm with low battery';
    }

}

function getTemperature(raw) {
    return readInt8LE(raw);
}

function readUInt8LE(bytes) {
    return bytes & 0xff;
}

function readInt8LE(bytes) {
    var ref = readUInt8LE(bytes);
    return ref > 0x7f ? ref - 0x100 : ref;
}
