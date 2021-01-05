/**
 * Ursalink Sensor Payload Decoder
 *
 * definition [channel-id] [channel-type] [channel-data]
 *
 * 01: battery      -> 0x01 0x75 [1 byte]  Unit: %
 * 03: Pressure     -> 0x03 0x7B [2 bytes] Unit: kPa
 * ------------------------------------------ EM500-PP
 */
function Decoder(bytes, port) {
    var decoded = {};

    for (var i = 0; i < bytes.length;) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];
        // BATTERY
        if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = bytes[i];
            i += 1;
        }
        // PRESSURE
        else if (channel_id === 0x03 && channel_type === 0x7B) {
            decoded.pressure = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // UNKNOWN SENSOR STATUS DATA
        else {
            break;
        }
    }

    return decoded;
}

/* ******************************************
 * bytes to number
 ********************************************/
function readUInt16LE(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return value & 0xffff;
}
function readInt16LE(bytes) {
    var ref = readUInt16LE(bytes);
    return ref > 0x7fff ? ref - 0x10000 : ref;
}