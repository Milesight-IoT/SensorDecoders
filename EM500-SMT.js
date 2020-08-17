/**
 * Ursalink Sensor Payload Decoder
 *
 * definition [channel-id] [channel-type] [channel-data]
 *
 * 01: battery      -> 0x01 0x75 [1byte]   Unit:%
 * 03: Temperature  -> 0x03 0x67 [2bytes]  Unit:°C
 * 04: Moisture     -> 0x04 0x68 [1byte]   Unit:%RH
 * 05: Conductivity -> 0x05 0x7f [2bytes]  Unit:µs/cm
 * ------------------------------------------ EM500-SMT
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
        // TEMPERATURE
        else if (channel_id === 0x03 && channel_type === 0x67) {
            decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // MOISTURE
        else if (channel_id === 0x04 && channel_type === 0x68) {
            decoded.humidity = bytes[i] / 2;
            i += 1;
        } 
        // Electrical Conductivity
        else if (channel_id === 0x05 && channel_type === 0x7f) {
            decoded.conductivity= readInt16LE(bytes.slice(i, i + 2)) ;
            i += 2;
        }  else {
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
