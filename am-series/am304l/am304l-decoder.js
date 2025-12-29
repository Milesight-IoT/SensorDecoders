/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product AM304L
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

	var unknown_command = 0;
	var counterObj = {};
	for (counterObj.i = 0; counterObj.i < bytes.length; ) {
		var command_id = bytes[counterObj.i++];
		switch (command_id) {
			case 0xff:
				decoded.device_status = readUInt8(bytes, counterObj, 1);
				decoded.ipso_version = readUInt8(bytes, counterObj, 1);
				decoded.sn = readHexString(bytes, counterObj, 8);
				decoded.tsl_version = readProtocolVersion(readBytes(bytes, counterObj, 2));
				decoded.request_tsl_config = readUInt8(bytes, counterObj, 1);
				decoded.hardware_version = readHexString(bytes, counterObj, 2);
				decoded.firmware_version = readHexString(bytes, counterObj, 2);
				// 0:class_a
				decoded.lorawan_class = readUInt8(bytes, counterObj, 1);
				decoded.alarm_reporting_times = readUInt16LE(bytes, counterObj, 2);
				// 0: disable, 1: enable
				decoded.alarm_deactivation_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x01:
				decoded.battery = readUInt8(bytes, counterObj, 1);
				break;
			case 0x03:
				decoded.temperature = readInt16LE(bytes, counterObj, 2) / 10;
				break;
			case 0x04:
				decoded.humidity = readUInt8(bytes, counterObj, 1) / 2;
				break;
			case 0x05:
				decoded.pir = decoded.pir || {};
				var bitOptions = readUInt16LE(bytes, counterObj, 2);
				decoded.pir.pir_status = extractBits(bitOptions, 15, 16);
				decoded.pir.pir_count = extractBits(bitOptions, 0, 15);
				decoded.pir_status_change = decoded.pir_status_change || {};
				// 0:vacant, 1:trigger
				decoded.pir_status_change.status = readUInt8(bytes, counterObj, 1);
				decoded.pir.pir_status = decoded.pir_status_change.status;
				break;
			case 0x06:
				decoded.als_level = readUInt8(bytes, counterObj, 1);
				decoded.Lux = readUInt16LE(bytes, counterObj, 2);
				break;
			case 0xb3:
				decoded.temperature_collection_anomaly = decoded.temperature_collection_anomaly || {};
				// 0:collect abnormal, 1:collect out of range
				decoded.temperature_collection_anomaly.type = readUInt8(bytes, counterObj, 1);
				break;
			case 0xb4:
				decoded.humidity_collection_anomaly = decoded.humidity_collection_anomaly || {};
				// 0:collect abnormal
				decoded.humidity_collection_anomaly.type = readUInt8(bytes, counterObj, 1);
				break;
			case 0xb6:
				decoded.illuminace_collection_anomaly = decoded.illuminace_collection_anomaly || {};
				// 0:collect abnormal
				decoded.illuminace_collection_anomaly.type = readUInt8(bytes, counterObj, 1);
				decoded.Lux_collection_anomaly = decoded.Lux_collection_anomaly || {};
				// 0:collect abnormal, 1:collect out of range
				decoded.Lux_collection_anomaly.type = readUInt8(bytes, counterObj, 1);
				break;
			case 0x83:
				decoded.temperature_alarm = decoded.temperature_alarm || {};
				decoded.temperature_alarm.temperature = readInt16LE(bytes, counterObj, 2) / 10;
				decoded.temperature = decoded.temperature_alarm.temperature;
				// 16:below alarm released, 17:below alarm, 18:above alarm released, 19:above alarm, 20:within alarm released, 21:within alarm, 22:exceed tolerance alarm released, 23:exceed tolerance alarm
				decoded.temperature_alarm.alarm_type = readUInt8(bytes, counterObj, 1);
				break;
			case 0x86:
				decoded.Lux_alarm = decoded.Lux_alarm || {};
				decoded.Lux_alarm.Lux = readUInt16LE(bytes, counterObj, 2);
				decoded.Lux = decoded.Lux_alarm.Lux;
				// 16:dim, 17:bright
				decoded.Lux_alarm.alarm_type = readUInt8(bytes, counterObj, 1);
				break;
			case 0x20:
				decoded.historical_data_retrieval = decoded.historical_data_retrieval || {};
				decoded.historical_data_retrieval.timestamp = readUInt32LE(bytes, counterObj, 4);
				// 0:data invalid, 1:data valid, 2:data out of range, 3:data collect abnormal
				decoded.historical_data_retrieval.temperature_type = readUInt8(bytes, counterObj, 1);
				decoded.historical_data_retrieval.temperature = readInt16LE(bytes, counterObj, 2) / 10;
				// 0:data invalid, 1:data valid, 2:data out of range, 3:data collect abnormal
				decoded.historical_data_retrieval.humidity_type = readUInt8(bytes, counterObj, 1);
				decoded.historical_data_retrieval.humidity = readUInt8(bytes, counterObj, 1) / 2;
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0:data invalid, 1:data valid
				decoded.historical_data_retrieval.pir_type = extractBits(bitOptions, 6, 7);
				// 0:vacant, 1:trigger
				decoded.historical_data_retrieval.pir_status = extractBits(bitOptions, 0, 6);
				decoded.historical_data_retrieval.pir_count = readUInt16LE(bytes, counterObj, 2);
				// 0:data invalid, 1:data valid, 2:data out of range, 3:data collect abnormal
				decoded.historical_data_retrieval.als_level_type = readUInt8(bytes, counterObj, 1);
				decoded.historical_data_retrieval.als_level = readUInt16LE(bytes, counterObj, 2);
				break;
			case 0x21:
				decoded.historical_data_retrieval_Lux = decoded.historical_data_retrieval_Lux || {};
				decoded.historical_data_retrieval_Lux.timestamp = readUInt32LE(bytes, counterObj, 4);
				// 0:data invalid, 1:data valid, 2:data out of range, 3:data collect abnormal
				decoded.historical_data_retrieval_Lux.temperature_type = readUInt8(bytes, counterObj, 1);
				decoded.historical_data_retrieval_Lux.temperature = readInt16LE(bytes, counterObj, 2) / 10;
				// 0:data invalid, 1:data valid, 2:data out of range, 3:data collect abnormal
				decoded.historical_data_retrieval_Lux.humidity_type = readUInt8(bytes, counterObj, 1);
				decoded.historical_data_retrieval_Lux.humidity = readUInt8(bytes, counterObj, 1) / 2;
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0:data invalid, 1:data valid
				decoded.historical_data_retrieval_Lux.pir_type = extractBits(bitOptions, 6, 7);
				// 0:vacant, 1:trigger
				decoded.historical_data_retrieval_Lux.pir_status = extractBits(bitOptions, 0, 6);
				decoded.historical_data_retrieval_Lux.pir_count = readUInt16LE(bytes, counterObj, 2);
				// 0:data invalid, 1:data valid, 2:data out of range, 3:data collect abnormal
				decoded.historical_data_retrieval_Lux.Lux_type = readUInt8(bytes, counterObj, 1);
				decoded.historical_data_retrieval_Lux.Lux = readUInt16LE(bytes, counterObj, 2);
				break;
			case 0xf9:
				decoded.reporting_interval = decoded.reporting_interval || {};
				// 0:second, 1:minute
				decoded.reporting_interval.unit = readUInt8(bytes, counterObj, 1);
				decoded.reporting_interval.interval = readUInt16LE(bytes, counterObj, 2);
				decoded.collecting_interval = decoded.collecting_interval || {};
				// 0:temperature,humidity,CO₂ collect interval, 1:illuminace collect interval
				decoded.collecting_interval.id = readUInt8(bytes, counterObj, 1);
				// 0:second, 1:minute
				decoded.collecting_interval.unit = readUInt8(bytes, counterObj, 1);
				decoded.collecting_interval.interval = readUInt16LE(bytes, counterObj, 2);
				decoded.temperature_unit = decoded.temperature_unit || {};
				// 0:temperature, 1:Illuminance
				decoded.temperature_unit.sensor_id = readUInt8(bytes, counterObj, 1);
				// 0:celsius, 1:fahrenheit
				decoded.temperature_unit.unit = readUInt8(bytes, counterObj, 1);
				decoded.co2_alarm_rule = decoded.co2_alarm_rule || {};
				// 0：disable, 1：enable
				decoded.co2_alarm_rule.enable = readUInt8(bytes, counterObj, 1);
				// 0:enable 1-level only, 1:enable 2-levle only, 2:enable 1-level&2-levle
				decoded.co2_alarm_rule.mode = readUInt8(bytes, counterObj, 1);
				decoded.co2_alarm_rule.level1_value = readUInt16LE(bytes, counterObj, 2);
				decoded.co2_alarm_rule.level2_value = readUInt16LE(bytes, counterObj, 2);
				decoded.pir_trigger_report = decoded.pir_trigger_report || {};
				// 0:trigger report, 1:vacant report
				decoded.pir_trigger_report.type = readUInt8(bytes, counterObj, 1);
				// 0：disable, 1：enable
				decoded.pir_trigger_report.enable = readUInt8(bytes, counterObj, 1);
				decoded.pir_idle_report = decoded.pir_idle_report || {};
				// 0:trigger report, 1:vacant report
				decoded.pir_idle_report.type = readUInt8(bytes, counterObj, 1);
				// 0：disable, 1：enable
				decoded.pir_idle_report.enable = readUInt8(bytes, counterObj, 1);
				decoded.illuminance_alarm_rule = decoded.illuminance_alarm_rule || {};
				// 0：disable, 1：enable
				decoded.illuminance_alarm_rule.enable = readUInt8(bytes, counterObj, 1);
				decoded.illuminance_alarm_rule.dim_value = readUInt16LE(bytes, counterObj, 2);
				decoded.illuminance_alarm_rule.bright_value = readUInt16LE(bytes, counterObj, 2);
				decoded.d2d_sending = decoded.d2d_sending || {};
				// 0：disable, 1：enable
				decoded.d2d_sending.enable = readUInt8(bytes, counterObj, 1);
				// 0：disable, 1：enable
				decoded.d2d_sending.lora_uplink_enable = readUInt8(bytes, counterObj, 1);
				var bitOptions = readUInt16LE(bytes, counterObj, 2);
				decoded.d2d_sending.temperature_enable = extractBits(bitOptions, 0, 1);
				decoded.d2d_sending.humidity_enable = extractBits(bitOptions, 1, 2);
				// 0：disable, 1：enable
				decoded.d2d_master_enable = readUInt8(bytes, counterObj, 1);
				break;
		}
		if (unknown_command) {
			throw new Error('unknown command: ' + command_id);
		}
	}

	return decoded;
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
	if (startBit < 0 || endBit > 16 || startBit >= endBit) {
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

function cmdMap() {
	return {
		  "20": "historical_data_retrieval",
		  "21": "historical_data_retrieval_Lux",
		  "83": "temperature_alarm",
		  "86": "Lux_alarm",
		  "ff": "device_status",
		  "undefinedxx": "d2d_master_settings._item",
		  "01": "battery",
		  "03": "temperature",
		  "04": "humidity",
		  "05": "pir",
		  "06": "als_level",
		  "b3": "temperature_collection_anomaly",
		  "b4": "humidity_collection_anomaly",
		  "b6": "illuminace_collection_anomaly",
		  "f9": "reporting_interval"
	};
}