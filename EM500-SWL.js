/**
 * Ursalink EM500-SWL Payload Decoder
 *
 * definition [channel-id] [channel-type] [channel-data]
 *
 * 01: battery      -> 0x01 0x75 [1 byte]  Unit: %
 * 03: water level  -> 0x03 0x77 [2 bytes] Unit: cm
 * ------------------------------------------ EM500
 *
 * Example:
 *   base64: AXVkA3cCAA==
 *   bytes: 01 75 64 03 77 02 00
 *
 * After decode:
 * {
 *   "battery": 100,
 *   "water_level": 2
 * }
 */
function Decoder(bytes, port) {
  var decoded = {};

  for (var i = 0; i < bytes.length; ) {
    var channel_id = bytes[i++];
    var channel_type = bytes[i++];
    // BATTERY
    if (channel_id === 0x01 && channel_type === 0x75) {
      decoded.battery = bytes[i];
      i += 1;
    }
    // WATER LEVEL
    else if (channel_id === 0x03 && channel_type === 0x77) {
      decoded.water_level = readInt16LE(bytes.slice(i, i + 2));
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
function readUInt16LE(bytes) {
  var value = (bytes[1] << 8) + bytes[0];
  return value & 0xffff;
}

function readInt16LE(bytes) {
  var ref = readUInt16LE(bytes);
  return ref > 0x7fff ? ref - 0x10000 : ref;
}
