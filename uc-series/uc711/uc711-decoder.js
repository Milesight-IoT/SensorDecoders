/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product UC711
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
			case 0xcf:
				decoded.lorawan_configuration_settings = decoded.lorawan_configuration_settings || {};
				var lorawan_configuration_settings_command = readUInt8(bytes, counterObj, 1);
				if (lorawan_configuration_settings_command == 0x00) {
					// 0:ClassA, 1:ClassB, 2:ClassC, 3:ClassC to B
					decoded.lorawan_configuration_settings.mode = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0xdf:
				decoded.tsl_version = readProtocolVersion(readBytes(bytes, counterObj, 2));
				break;
			case 0xdb:
				decoded.product_sn = readHexString(bytes, counterObj, 8);
				break;
			case 0xda:
				decoded.version.hardware_version = readHardwareVersion(readBytes(bytes, counterObj, 2));
				decoded.version.firmware_version = readFirmwareVersion(readBytes(bytes, counterObj, 6));
				break;
			case 0xc8:
				// 0：Off, 1：On
				decoded.device_status = readUInt8(bytes, counterObj, 1);
				break;
			case 0x01:
				decoded.relay_status_change = decoded.relay_status_change || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0: Disconnect, 1: Close
				decoded.relay_status_change.Y1 = extractBits(bitOptions, 0, 1);
				// 0: Disconnect, 1: Close
				decoded.relay_status_change.W1 = extractBits(bitOptions, 1, 2);
				// 0: Disconnect, 1: Close
				decoded.relay_status_change.OB = extractBits(bitOptions, 2, 3);
				// 0: Disconnect, 1: Close
				decoded.relay_status_change.GL = extractBits(bitOptions, 3, 4);
				// 0: Disconnect, 1: Close
				decoded.relay_status_change.GM = extractBits(bitOptions, 4, 5);
				// 0: Disconnect, 1: Close
				decoded.relay_status_change.GH = extractBits(bitOptions, 5, 6);
				decoded.relay_status_change.reserved = extractBits(bitOptions, 6, 8);
				break;
			case 0x02:
				decoded.temperature_alarm = decoded.temperature_alarm || {};
				decoded.temperature_alarm.type = readUInt8(bytes, counterObj, 1);
				if (decoded.temperature_alarm.type == 0x10) {
					decoded.temperature_alarm.anti_freeze_protection_deactivation = decoded.temperature_alarm.anti_freeze_protection_deactivation || {};
				}
				if (decoded.temperature_alarm.type == 0x11) {
					decoded.temperature_alarm.anti_freeze_protection_trigger = decoded.temperature_alarm.anti_freeze_protection_trigger || {};
				}
				break;
			case 0x06:
				decoded.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x08:
				decoded.humidity = readInt16LE(bytes, counterObj, 2) / 10;
				break;
			case 0x0c:
				decoded.temperature_control_info = decoded.temperature_control_info || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0：standby, 1：stage-1 heat, 2：stage-2 heat, 3：stage-3 heat, 4：stage-4 heat, 5：stage-5 heat, 7：stage-1 cool, 8：stage-2 cool, 9：stage-3 cool
				decoded.temperature_control_info.status = extractBits(bitOptions, 0, 4);
				break;
			case 0x0d:
				decoded.fan_control_info = decoded.fan_control_info || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0：off, 1：open, 2：low, 3:medium, 4:high
				decoded.fan_control_info.status = extractBits(bitOptions, 0, 4);
				break;
			case 0x61:
				decoded.target_temperature_settings = decoded.target_temperature_settings || {};
				var target_temperature_settings_temperature_control_mode = readUInt8(bytes, counterObj, 1);
				if (target_temperature_settings_temperature_control_mode == 0x00) {
					decoded.target_temperature_settings.heat = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (target_temperature_settings_temperature_control_mode == 0x02) {
					decoded.target_temperature_settings.cool = readInt16LE(bytes, counterObj, 2) / 100;
				}
				break;
			case 0x62:
				decoded.target_temperature_tolerance = decoded.target_temperature_tolerance || {};
				var target_temperature_tolerance_id = readUInt8(bytes, counterObj, 1);
				if (target_temperature_tolerance_id == 0x00) {
					decoded.target_temperature_tolerance.heat_value = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (target_temperature_tolerance_id == 0x02) {
					decoded.target_temperature_tolerance.cool_value = readInt16LE(bytes, counterObj, 2) / 100;
				}
				break;
			case 0x63:
				decoded.target_temperature_range = decoded.target_temperature_range || {};
				var target_temperature_range_id = readUInt8(bytes, counterObj, 1);
				if (target_temperature_range_id == 0x00) {
					decoded.target_temperature_range.heat = decoded.target_temperature_range.heat || {};
					decoded.target_temperature_range.heat.min = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.target_temperature_range.heat.max = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (target_temperature_range_id == 0x02) {
					decoded.target_temperature_range.cool = decoded.target_temperature_range.cool || {};
					decoded.target_temperature_range.cool.min = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.target_temperature_range.cool.max = readInt16LE(bytes, counterObj, 2) / 100;
				}
				break;
			case 0x64:
				// 0：℃, 1：℉
				decoded.temperature_unit = readUInt8(bytes, counterObj, 1);
				break;
			case 0x66:
				decoded.reporting_interval = decoded.reporting_interval || {};
				// 0：BLE+LORA, 1：POWERBUS+LORA
				var reporting_interval_type = readUInt8(bytes, counterObj, 1);
				if (reporting_interval_type == 0x00) {
					decoded.reporting_interval.ble_lora = decoded.reporting_interval.ble_lora || {};
					// 0：second, 1：min
					decoded.reporting_interval.ble_lora.unit = readUInt8(bytes, counterObj, 1);
					if (decoded.reporting_interval.ble_lora.unit == 0x00) {
						decoded.reporting_interval.ble_lora.seconds_of_time = readUInt16LE(bytes, counterObj, 2);
					}
					if (decoded.reporting_interval.ble_lora.unit == 0x01) {
						decoded.reporting_interval.ble_lora.minutes_of_time = readUInt16LE(bytes, counterObj, 2);
					}
				}
				if (reporting_interval_type == 0x01) {
					decoded.reporting_interval.power_lora = decoded.reporting_interval.power_lora || {};
					// 0：second, 1：min
					decoded.reporting_interval.power_lora.unit = readUInt8(bytes, counterObj, 1);
					if (decoded.reporting_interval.power_lora.unit == 0x00) {
						decoded.reporting_interval.power_lora.seconds_of_time = readUInt16LE(bytes, counterObj, 2);
					}
					if (decoded.reporting_interval.power_lora.unit == 0x01) {
						decoded.reporting_interval.power_lora.minutes_of_time = readUInt16LE(bytes, counterObj, 2);
					}
				}
				break;
			case 0x70:
				decoded.fan_settings = decoded.fan_settings || {};
				var fan_settings_command = readUInt8(bytes, counterObj, 1);
				if (fan_settings_command == 0x00) {
					// 0：Auto, 1：Ventilation, 2：Always Open, 3：Low, 4：Medium, 5：High, 255：Disabled
					decoded.fan_settings.fan_mode = readUInt8(bytes, counterObj, 1);
				}
				if (fan_settings_command == 0x01) {
					// 0：Disable, 1：Enable
					decoded.fan_settings.adjust_humidity_enable = readUInt8(bytes, counterObj, 1);
				}
				if (fan_settings_command == 0x02) {
					decoded.fan_settings.adjust_period = readUInt8(bytes, counterObj, 1);
				}
				if (fan_settings_command == 0x03) {
					decoded.fan_settings.work_time = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x71:
				decoded.anti_freezing = decoded.anti_freezing || {};
				var anti_freezing_command = readUInt8(bytes, counterObj, 1);
				if (anti_freezing_command == 0x00) {
					// 0：Disable, 1：Enable
					decoded.anti_freezing.enable = readUInt8(bytes, counterObj, 1);
				}
				if (anti_freezing_command == 0x01) {
					decoded.anti_freezing.target_temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				break;
			case 0x72:
				decoded.dehumidify_settings = decoded.dehumidify_settings || {};
				var dehumidify_settings_command = readUInt8(bytes, counterObj, 1);
				if (dehumidify_settings_command == 0x02) {
					decoded.dehumidify_settings.humidify_low_threshold = readInt16LE(bytes, counterObj, 2) / 10;
				}
				if (dehumidify_settings_command == 0x03) {
					decoded.dehumidify_settings.humidify_high_threshold = readInt16LE(bytes, counterObj, 2) / 10;
				}
				break;
			case 0x75:
				decoded.temperature_control_mode_enable = decoded.temperature_control_mode_enable || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0：disable, 1：enable
				decoded.temperature_control_mode_enable.heat = extractBits(bitOptions, 0, 1);
				// 0：disable, 1：enable
				decoded.temperature_control_mode_enable.em_heat = extractBits(bitOptions, 1, 2);
				// 0：disable, 1：enable
				decoded.temperature_control_mode_enable.cool = extractBits(bitOptions, 2, 3);
				// 0：disable, 1：enable
				decoded.temperature_control_mode_enable.auto = extractBits(bitOptions, 3, 4);
				// 0：disable, 1：enable
				decoded.temperature_control_mode_enable.dehumidify = extractBits(bitOptions, 4, 5);
				// 0：disable, 1：enable
				decoded.temperature_control_mode_enable.ventilate = extractBits(bitOptions, 5, 6);
				decoded.temperature_control_mode_enable.reserved = extractBits(bitOptions, 6, 8);
				break;
			case 0x8e:
				decoded.install_configuration = decoded.install_configuration || {};
				// 0：wire config, 1:reversing_valve config, 2:combine config, 3:fan owner config
				var install_configuration_type = readUInt8(bytes, counterObj, 1);
				if (install_configuration_type == 0x01) {
					decoded.install_configuration.reversing_valve = decoded.install_configuration.reversing_valve || {};
					// 0：o/b on heat, 1：o/b on cool 
					decoded.install_configuration.reversing_valve.mode = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0xb8:
				decoded.synchronize_time = readOnlyCommand(bytes, counterObj, 0);
				break;
		}
		if (unknown_command) {
			throw new Error('unknown command: ' + command_id);
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

	return result;
}

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

function readCommand(allBytes, counterObj, end) {
	var bytes = readBytes(allBytes, counterObj, end);
	var cmd = bytes
		.map(function(b) {
			var hex = b.toString(16);
			return hex.length === 1 ? '0' + hex : hex;
		})
		.join('')
		.toLowerCase();

	var map = cmdMap();
	for (var key in map) {
		var xxs = [];
		var isMatch = false;
		if (key.length !== cmd.length) {
			continue;
		}
		for (var i = 0; i < key.length; i += 2) {
			var hexString = key.slice(i, i + 2);
			var cmdString = cmd.slice(i, i + 2);
			if (hexString === cmdString || hexString === 'xx') {
				if (hexString === 'xx') {
					xxs.push('.' + parseInt(cmdString, 16));
				}
				isMatch = true;
				continue;
			} else {
				isMatch = false;
				break;
			}
		}
		if (isMatch) {
			var propertyId = map[key];
			if (propertyId.indexOf('._item') === -1) {
				return propertyId;
			}
			var j = 0;
			var result = propertyId.replace(/\._item/g, function() {
				return xxs[j++];
			});
			return result;
		}
	}
	return null;
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

function cmdMap() {
	return {
		  "61": "target_temperature_settings",
		  "62": "target_temperature_tolerance",
		  "63": "target_temperature_range",
		  "64": "temperature_unit",
		  "66": "reporting_interval",
		  "70": "fan_settings",
		  "71": "anti_freezing",
		  "72": "dehumidify_settings",
		  "75": "temperature_control_mode_enable",
		  "6100": "target_temperature_settings.heat",
		  "6102": "target_temperature_settings.cool",
		  "6200": "target_temperature_tolerance.heat_value",
		  "6202": "target_temperature_tolerance.cool_value",
		  "6300": "target_temperature_range.heat",
		  "6302": "target_temperature_range.cool",
		  "6600": "reporting_interval.ble_lora",
		  "6601": "reporting_interval.power_lora",
		  "7000": "fan_settings.fan_mode",
		  "7001": "fan_settings.adjust_humidity_enable",
		  "7002": "fan_settings.adjust_period",
		  "7003": "fan_settings.work_time",
		  "7100": "anti_freezing.enable",
		  "7101": "anti_freezing.target_temperature",
		  "7202": "dehumidify_settings.humidify_low_threshold",
		  "7203": "dehumidify_settings.humidify_high_threshold",
		  "660000": "reporting_interval.ble_lora.seconds_of_time",
		  "660001": "reporting_interval.ble_lora.minutes_of_time",
		  "660100": "reporting_interval.power_lora.seconds_of_time",
		  "660101": "reporting_interval.power_lora.minutes_of_time",
		  "cf": "lorawan_configuration_settings",
		  "cf00": "lorawan_configuration_settings.mode",
		  "df": "tsl_version",
		  "db": "product_sn",
		  "da": "version.hardware_version",
		  "c8": "device_status",
		  "01": "relay_status_change",
		  "02": "temperature_alarm",
		  "0210": "temperature_alarm.anti_freeze_protection_deactivation",
		  "0211": "temperature_alarm.anti_freeze_protection_trigger",
		  "06": "temperature",
		  "08": "humidity",
		  "0c": "temperature_control_info",
		  "0d": "fan_control_info",
		  "8e": "install_configuration",
		  "8e01": "install_configuration.reversing_valve",
		  "b8": "synchronize_time"
	};
}
function processTemperature(decoded) {
	var allTemperatureProperties = {
    "temperature": {
        "precision": 2
    },
    "target_temperature_settings.heat": {
        "precision": 2
    },
    "target_temperature_settings.cool": {
        "precision": 2
    },
    "target_temperature_tolerance.heat_value": {
        "precision": 2
    },
    "target_temperature_tolerance.cool_value": {
        "precision": 2
    },
    "target_temperature_range.heat.min": {
        "precision": 2
    },
    "target_temperature_range.heat.max": {
        "precision": 2
    },
    "target_temperature_range.cool.min": {
        "precision": 2
    },
    "target_temperature_range.cool.max": {
        "precision": 2
    },
    "anti_freezing.target_temperature": {
        "precision": 2
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
			if (hasPath(decoded, propertyId)) {
				setPath(decoded, fahrenheitProperty,  Number((getPath(decoded, propertyId) * 1.8 + 32).toFixed(allTemperatureProperties[newPropertyId].precision)));
				setPath(decoded, celsiusProperty,  Number(getPath(decoded, propertyId).toFixed(allTemperatureProperties[newPropertyId].precision)));
			}
		}	
	}	
	return decoded;
}