/**
 * Ursalink Sensor Payload Decoder
 *
 * definition [channel-id] [channel-type] [channel-data]
 *
 * 01: battery      -> 0x01 0x75 [1byte]
 * 04: Moisture     -> 0x04 0x68 [1byte]
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
        // MOISTURE
        else if (channel_id === 0x04 && channel_type === 0x68) {
            decoded.humidity = bytes[i] / 2;
            i += 1;
        } else {
            break;
        }
    }
    return decoded;
}
