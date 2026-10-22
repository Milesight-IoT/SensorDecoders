/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product VS321
 */

/* eslint no-redeclare: "off" */
/* eslint-disable */
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
/* eslint-enable */

function milesightDeviceDecode(bytes) {
	var decoded = {};
	var result = {};
	var history = [];

	var unknown_command = 0;
	var counterObj = {};
	for (counterObj.i = 0; counterObj.i < bytes.length; ) {
		var command_id = bytes[counterObj.i++];
		switch (command_id) {
			case 0xff:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0x0b:
						// 0: off, 1: on
						decoded.device_status = readUInt8(bytes, counterObj, 1);
						break;
					case 0x01:
						decoded.ipso_version = readUInt8(bytes, counterObj, 1);
						break;
					case 0x16:
						decoded.sn = readHexString(bytes, counterObj, 8);
						break;
					case 0xff:
						decoded.tsl_version = readProtocolVersion(readBytes(bytes, counterObj, 2));
						break;
					case 0x09:
						decoded.hardware_version = readHardwareVersion(readBytes(bytes, counterObj, 2));
						break;
					case 0x0a:
						decoded.firmware_version = readFirmwareVersion(readBytes(bytes, counterObj, 2));
						break;
					case 0x0f:
						// 0:class_a
						decoded.lorawan_class = readUInt8(bytes, counterObj, 1);
						break;
				}
				break;
			case 0x01:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0x75:
						decoded.battery = readUInt8(bytes, counterObj, 1);
						break;
				}
				break;
			case 0x03:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0x67:
						decoded.temperature = readUInt16LE(bytes, counterObj, 2) / 10;
						break;
				}
				break;
			case 0x04:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0x68:
						decoded.humidity = readUInt8(bytes, counterObj, 1) / 2;
						break;
				}
				break;
			case 0x07:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0xff:
						// 0：Bright, 1：Dim
						decoded.illuminance_status = readUInt8(bytes, counterObj, 1);
						break;
				}
				break;
			case 0x08:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0xf4:
						decoded.detect_confidence = decoded.detect_confidence || {};
						// 2：Detect Confidence
						decoded.detect_confidence.id = readUInt8(bytes, counterObj, 1);
						// 0：Normal Detection, 1：Undetectable
						decoded.detect_confidence.reliability = readUInt8(bytes, counterObj, 1);
						break;
				}
				break;
			case 0x05:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0xfd:
						decoded.total_number = readUInt16LE(bytes, counterObj, 2);
						break;
				}
				break;
			case 0x06:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0xfe:
						decoded.region_status = decoded.region_status || {};
						var bitOptions = readUInt8(bytes, counterObj, 1);
						decoded.region_status.region1_enable = extractBits(bitOptions, 0, 1);
						decoded.region_status.region2_enable = extractBits(bitOptions, 1, 2);
						decoded.region_status.region3_enable = extractBits(bitOptions, 2, 3);
						decoded.region_status.region4_enable = extractBits(bitOptions, 3, 4);
						decoded.region_status.region5_enable = extractBits(bitOptions, 4, 5);
						decoded.region_status.region6_enable = extractBits(bitOptions, 5, 6);
						decoded.region_status.region7_enable = extractBits(bitOptions, 6, 7);
						decoded.region_status.region8_enable = extractBits(bitOptions, 7, 8);
						var bitOptions = readUInt8(bytes, counterObj, 1);
						decoded.region_status.region9_enable = extractBits(bitOptions, 8, 9);
						decoded.region_status.region10_enable = extractBits(bitOptions, 9, 10);
						decoded.region_status.region1_occupancy_status = extractBits(bitOptions, 16, 17);
						decoded.region_status.region2_occupancy_status = extractBits(bitOptions, 17, 18);
						decoded.region_status.region3_occupancy_status = extractBits(bitOptions, 18, 19);
						decoded.region_status.region4_occupancy_status = extractBits(bitOptions, 19, 20);
						decoded.region_status.region5_occupancy_status = extractBits(bitOptions, 20, 21);
						decoded.region_status.region6_occupancy_status = extractBits(bitOptions, 21, 22);
						var bitOptions = readUInt8(bytes, counterObj, 1);
						decoded.region_status.region7_occupancy_status = extractBits(bitOptions, 22, 23);
						decoded.region_status.region8_occupancy_status = extractBits(bitOptions, 23, 24);
						decoded.region_status.region9_occupancy_status = extractBits(bitOptions, 24, 25);
						decoded.region_status.region10_occupancy_status = extractBits(bitOptions, 25, 26);
						break;
				}
				break;
			case 0x20:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0xce:
						decoded.historical_data = decoded.historical_data || {};
						decoded.historical_data.timestamp = readUInt32LE(bytes, counterObj, 4);
						// 0：People Counting, 1：Desk Occupancy
						decoded.historical_data.detection_mode = readUInt8(bytes, counterObj, 1);
						decoded.historical_data.total_people = readUInt16LE(bytes, counterObj, 2);
						decoded.historical_data.region_status = decoded.historical_data.region_status || {};
						var bitOptions = readUInt8(bytes, counterObj, 1);
						decoded.historical_data.region_status.region1_enable = extractBits(bitOptions, 0, 1);
						decoded.historical_data.region_status.region2_enable = extractBits(bitOptions, 1, 2);
						decoded.historical_data.region_status.region3_enable = extractBits(bitOptions, 2, 3);
						decoded.historical_data.region_status.region4_enable = extractBits(bitOptions, 3, 4);
						decoded.historical_data.region_status.region5_enable = extractBits(bitOptions, 4, 5);
						decoded.historical_data.region_status.region6_enable = extractBits(bitOptions, 5, 6);
						decoded.historical_data.region_status.region7_enable = extractBits(bitOptions, 6, 7);
						decoded.historical_data.region_status.region8_enable = extractBits(bitOptions, 7, 8);
						var bitOptions = readUInt8(bytes, counterObj, 1);
						decoded.historical_data.region_status.region9_enable = extractBits(bitOptions, 8, 9);
						decoded.historical_data.region_status.region10_enable = extractBits(bitOptions, 9, 10);
						decoded.historical_data.region_status.region1_occupancy_status = extractBits(bitOptions, 16, 17);
						decoded.historical_data.region_status.region2_occupancy_status = extractBits(bitOptions, 17, 18);
						decoded.historical_data.region_status.region3_occupancy_status = extractBits(bitOptions, 18, 19);
						decoded.historical_data.region_status.region4_occupancy_status = extractBits(bitOptions, 19, 20);
						decoded.historical_data.region_status.region5_occupancy_status = extractBits(bitOptions, 20, 21);
						decoded.historical_data.region_status.region6_occupancy_status = extractBits(bitOptions, 21, 22);
						var bitOptions = readUInt8(bytes, counterObj, 1);
						decoded.historical_data.region_status.region7_occupancy_status = extractBits(bitOptions, 22, 23);
						decoded.historical_data.region_status.region8_occupancy_status = extractBits(bitOptions, 23, 24);
						decoded.historical_data.region_status.region9_occupancy_status = extractBits(bitOptions, 24, 25);
						decoded.historical_data.region_status.region10_occupancy_status = extractBits(bitOptions, 25, 26);
						break;
				}
				break;
			case 0x83:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0x67:
						decoded.temperature_threshold_alarm = decoded.temperature_threshold_alarm || {};
						decoded.temperature_threshold_alarm.alarm_temperature = readInt16LE(bytes, counterObj, 2) / 10;
						// 0：release, 1：alarm
						decoded.temperature_threshold_alarm.status = readUInt8(bytes, counterObj, 1);
						break;
				}
				break;
			case 0x84:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0x68:
						decoded.humidity_threshold_alarm = decoded.humidity_threshold_alarm || {};
						decoded.humidity_threshold_alarm.alarm_humidity = readUInt8(bytes, counterObj, 1) / 2;
						// 0:Release Alarm, 1：Alarm
						decoded.humidity_threshold_alarm.status = readUInt8(bytes, counterObj, 1);
						break;
				}
				break;
			default:
				unknown_command = 1;
				break;
		}
		if (unknown_command) {
			throw new Error('unknown command: 0x' + command_id.toString(16));
		}
	}

	if (Object.keys(history).length > 0) {
		result.history = history;
	} else {
		for (var k2 in decoded) {
			if (decoded.hasOwnProperty(k2)) {
				result[k2] = decoded[k2];
			}
		}
	}

	processTemperature(result);
	patchDecode(result);

	return result;
}

function patchDecode(decoded) {}

function readOnlyCommand(bytes) {
	return 1;
}

function readUnknownDataType(allBytes, counterObj, end) {
	throw new Error('Unknown data type encountered. Please Contact Developer.');
}

function readBytes(allBytes, counterObj, end) {
	var bytes = allBytes.slice(counterObj.i, counterObj.i + end);
	counterObj.i += end;
	return bytes;
}

function readProtocolVersion(bytes) {
	var major = bytes[0] & 0xff;
	var minor = bytes[1] & 0xff;
	return 'v' + major + '.' + minor;
}

function readHardwareVersion(bytes) {
	var major = bytes[0] & 0xff;
	var minor = bytes[1] & 0xff;
	return 'v' + major + '.' + minor;
}

function readFirmwareVersion(bytes) {
	var major = bytes[0] & 0xff;
	var minor = bytes[1] & 0xff;
	var release = bytes[2] & 0xff;
	var alpha = bytes[3] & 0xff;
	var unit_test = bytes[4] & 0xff;
	var test = bytes[5] & 0xff;

	var version = 'v' + major + '.' + minor;
	if (release !== 0) version += '-r' + release;
	if (alpha !== 0) version += '-a' + alpha;
	if (unit_test !== 0) version += '-u' + unit_test;
	if (test !== 0) version += '-t' + test;
	return version;
}

/* eslint-disable */
function readUInt8(allBytes, counterObj, end) {
	var bytes = readBytes(allBytes, counterObj, end);
	return bytes[0] & 0xff;
}

function readInt8(allBytes, counterObj, end) {
	var ref = readUInt8(allBytes, counterObj, end);
	return ref > 0x7f ? ref - 0x100 : ref;
}

function readUInt16LE(allBytes, counterObj, end) {
	var bytes = readBytes(allBytes, counterObj, end);
	var value = (bytes[1] << 8) + bytes[0];
	return value & 0xffff;
}

function readInt16LE(allBytes, counterObj, end) {
	var ref = readUInt16LE(allBytes, counterObj, end);
	return ref > 0x7fff ? ref - 0x10000 : ref;
}

function readUInt24LE(allBytes, counterObj, end) {
	var bytes = readBytes(allBytes, counterObj, end); // 3 bytes expected
	var value = (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
	return value & 0xffffff;
}

function readInt24LE(allBytes, counterObj, end) {
	var ref = readUInt24LE(allBytes, counterObj, end);
	return ref > 0x7fffff ? ref - 0x1000000 : ref;
}

function readUInt32LE(allBytes, counterObj, end) {
	var bytes = readBytes(allBytes, counterObj, end);
	var value = (bytes[3] << 24) + (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
	return (value & 0xffffffff) >>> 0;
}

function readInt32LE(allBytes, counterObj, end) {
	var ref = readUInt32LE(allBytes, counterObj, end);
	return ref > 0x7fffffff ? ref - 0x100000000 : ref;
}

function readFloat16LE(allBytes, counterObj, end) {
	var bytes = readBytes(allBytes, counterObj, end);
	var bits = (bytes[1] << 8) | bytes[0];
	var sign = bits >>> 15 === 0 ? 1.0 : -1.0;
	var e = (bits >>> 10) & 0x1f;
	var m = e === 0 ? (bits & 0x3ff) << 1 : (bits & 0x3ff) | 0x400;
	var f = sign * m * Math.pow(2, e - 25);

	var n = Number(f.toFixed(2));
	return n;
}

function readFloatLE(allBytes, counterObj, end) {
	var bytes = readBytes(allBytes, counterObj, end);
	var bits = (bytes[3] << 24) | (bytes[2] << 16) | (bytes[1] << 8) | bytes[0];
	var sign = bits >>> 31 === 0 ? 1.0 : -1.0;
	var e = (bits >>> 23) & 0xff;
	var m = e === 0 ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
	var f = sign * m * Math.pow(2, e - 150);
	return f;
}

function readString(allBytes, counterObj, end) {
	var str = "";
	var bytes = readBytes(allBytes, counterObj, end);
	var i = 0;
	var byte1, byte2, byte3, byte4;
	while (i < bytes.length) {
		byte1 = bytes[i++];
		if (byte1 <= 0x7f) {
			str += String.fromCharCode(byte1);
		} else if (byte1 <= 0xdf) {
			byte2 = bytes[i++];
			str += String.fromCharCode(((byte1 & 0x1f) << 6) | (byte2 & 0x3f));
		} else if (byte1 <= 0xef) {
			byte2 = bytes[i++];
			byte3 = bytes[i++];
			str += String.fromCharCode(((byte1 & 0x0f) << 12) | ((byte2 & 0x3f) << 6) | (byte3 & 0x3f));
		} else if (byte1 <= 0xf7) {
			byte2 = bytes[i++];
			byte3 = bytes[i++];
			byte4 = bytes[i++];
			var codepoint = ((byte1 & 0x07) << 18) | ((byte2 & 0x3f) << 12) | ((byte3 & 0x3f) << 6) | (byte4 & 0x3f);
			codepoint -= 0x10000;
			str += String.fromCharCode((codepoint >> 10) + 0xd800);
			str += String.fromCharCode((codepoint & 0x3ff) + 0xdc00);
		}
	}
	return str.replace(/\u0000+$/g, '');
}

function readHexString(allBytes, counterObj, end) {
	var temp = [];
	var bytes = readBytes(allBytes, counterObj, end);
	for (var idx = 0; idx < bytes.length; idx++) {
		temp.push(("0" + (bytes[idx] & 0xff).toString(16)).slice(-2));
	}
	return temp.join("").replace(/\u0000+$/g, '');
}

function readHexStringLE(allBytes, counterObj, end) {
	var temp = [];
	var bytes = readBytes(allBytes, counterObj, end);
	for (var idx = bytes.length - 1; idx >= 0; idx--) {
		temp.push(("0" + (bytes[idx] & 0xff).toString(16)).slice(-2));
	}
	return temp.join("").replace(/\u0000+$/g, '');
}

function extractBits(byte, startBit, endBit) {
	if (byte < 0 || byte > 0xffff) {
	  throw new Error("byte must be in range 0..65535");
	}
	if (startBit >= endBit) {
	  throw new Error("invalid bit range");
	}

	var width = endBit - startBit;
	var mask = (1 << width) - 1;
	return (byte >>> startBit) & mask;
}

function pickArrayItem(array, index, idName) {
	for (var i = 0; i < array.length; i++) {
		if (array[i][idName] === index) {
			return array[i];
		}
	}

	return {};
}

function insertArrayItem(array, item, idName) {
	for (var i = 0; i < array.length; i++) {
		if (array[i][idName] === item[idName]) {
			array[i] = item;
			return;
		}
	}
	array.push(item);
}


function hasPath(obj, path) {
	var parts = path.split('.');
	var current = obj;

	for (var i = 0; i < parts.length; i++) {
	  	if (!current || !(parts[i] in current)) {
			return false;
	  	}
	  	current = current[parts[i]];
	}

	return true;
}

function getPath(obj, path) {
	var parts = path.split('.');
	var current = obj;

	for (var i = 0; i < parts.length; i++) {
	  	var key = parts[i];

	  	if (!current || !(key in current)) {
			return null;
	  	}

	  	current = current[key];
	}

	return current;
}


function setPath(obj, path, value) {
	var parts = path.split('.');
	var current = obj;

	for (var i = 0; i < parts.length - 1; i++) {
	  	var key = parts[i];

	  	if (!(key in current) || typeof current[key] !== 'object') {
			current[key] = {};
	  	}

	  	current = current[key];
	}

	current[parts[parts.length - 1]] = value;
	return obj;
}

function removePath(obj, path) {
	var parts = path.split('.');
	var chain = [obj];
	var current = obj;

	for (var i = 0; i < parts.length - 1; i++) {
		var key = parts[i];

		if (!current || typeof current[key] !== 'object') {
			return obj;
		}

		current = current[key];
		chain.push(current);
	}

	var leaf = parts[parts.length - 1];

	if (!current || !Object.prototype.hasOwnProperty.call(current, leaf)) {
		return obj;
	}

	delete current[leaf];

	// prune empty intermediate containers left behind on the path
	for (var j = chain.length - 1; j >= 1; j--) {
		if (Object.keys(chain[j]).length === 0) {
			delete chain[j - 1][parts[j - 1]];
		} else {
			break;
		}
	}

	return obj;
}

function convertName(propertyId, prefix) {
	var parts = propertyId.split('.');
	var lastPart = parts[parts.length - 1];
	parts[parts.length - 1] = prefix + '_' + lastPart;
	return parts.join('.');
}

function recoverName(propertyId, prefix) {
	var parts = propertyId.split('.');
	var lastPart = parts[parts.length - 1];
	parts[parts.length - 1] = lastPart.replace(prefix + '_', '');
	return parts.join('.');
}

function getAllLeafPaths(obj, prefix) {
	var paths = [];

	function recurse(current, path) {
	  if (Array.isArray(current)) {
		current.forEach(function (item, index) {
		  var newPath = path ? (path + "." + index) : String(index);
		  recurse(item, newPath);
		});

	  } else if (typeof current === 'object' && current !== null) {
		for (var key in current) {
		  if (Object.prototype.hasOwnProperty.call(current, key)) {
			var newPath = path ? (path + "." + key) : key;
			recurse(current[key], newPath);
		  }
		}

	  } else {
		paths.push(path);
	  }
	}

	recurse(obj, "");
	return paths;

}

function isInteger(str) {
	return typeof str === 'string' && /^[0-9]+$/.test(str);
}


function processTemperature(decoded) {
	var allTemperatureProperties = {
    "temperature": {
        "precision": null,
        "unitName": "℃"
    },
    "temperature_threshold_alarm.alarm_temperature": {
        "precision": null,
        "unitName": "℃"
    },
    "set_threshold_alarm_temperature.value_less_than": {
        "precision": null,
        "unitName": "℃"
    },
    "set_threshold_alarm_temperature.value_greater_than": {
        "precision": null,
        "unitName": "℃"
    }
};
	var leafPaths = getAllLeafPaths(decoded);
	for (var i = 0; i < leafPaths.length; i++) {
		var propertyId = leafPaths[i];
		var propertyParts = propertyId.split('.');
		var newPropertyParts = []
		for (var j = 0; j < propertyParts.length; j++) {
			var part = propertyParts[j];
			if (isInteger(part)) {
				newPropertyParts.push('_item');
			} else {
				newPropertyParts.push(part);
			}
		}
		var newPropertyId = newPropertyParts.join('.');
		newPropertyId = recoverName(newPropertyId, 'fahrenheit');
		newPropertyId = recoverName(newPropertyId, 'celsius');
		propertyId = recoverName(propertyId, 'fahrenheit');
		propertyId = recoverName(propertyId, 'celsius');
		if (allTemperatureProperties[newPropertyId]) {
			var fahrenheitProperty = convertName(propertyId, 'fahrenheit');
			var celsiusProperty = convertName(propertyId, 'celsius');
			var unitName = allTemperatureProperties[newPropertyId].unitName;
			var constant = unitName == 'K' ? 0 : 32;
			if (hasPath(decoded, propertyId)) {
				setPath(decoded, fahrenheitProperty,  Number((getPath(decoded, propertyId) * 1.8 + constant).toFixed(allTemperatureProperties[newPropertyId].precision)));
				setPath(decoded, celsiusProperty,  Number(getPath(decoded, propertyId).toFixed(allTemperatureProperties[newPropertyId].precision)));
				removePath(decoded, propertyId);
			}
		}
	}
	return decoded;
}