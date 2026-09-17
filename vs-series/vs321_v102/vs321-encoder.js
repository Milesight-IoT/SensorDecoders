/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product VS321
 */

/* eslint no-redeclare: "off" */
/* eslint-disable */
// Chirpstack v4
function encodeDownlink(input) {
	var encoded = milesightDeviceEncode(input.data);
	return { bytes: encoded };
}

// Chirpstack v3
function Encode(fPort, obj) {
	return milesightDeviceEncode(obj);
}

// The Things Network
function Encoder(obj, port) {
	return milesightDeviceEncode(obj);
}
/* eslint-enable */

function milesightDeviceEncode(payload) {
	processTemperature(payload);
	var encoded = [];
	//0xff_0x8e // reporting_interval_settings_switch.reporting_interval.id
	if ('reporting_interval_settings_switch.reporting_interval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x8e);
		// 0：sec, 1：min
		buffer.writeUInt8(0x00);
		if (payload.reporting_interval_settings_switch.reporting_interval.time < 2 || payload.reporting_interval_settings_switch.reporting_interval.time > 1440) {
			throw betweenError('reporting_interval_settings_switch.reporting_interval.time', 2, 1440);
		}
		buffer.writeUInt16LE(payload.reporting_interval_settings_switch.reporting_interval.time);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x8e // reporting_interval_settings_switch.reporting_interval1.id
	if ('reporting_interval_settings_switch.reporting_interval1' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x8e);
		// 0：sec, 1：min
		buffer.writeUInt8(0x00);
		if ([5, 10, 15, 30, 60, 240, 360, 480, 720].indexOf(payload.reporting_interval_settings_switch.reporting_interval1.time) === -1) {
			throw oneOfError('reporting_interval_settings_switch.reporting_interval1.time', [5, 10, 15, 30, 60, 240, 360, 480, 720]);
		}
		buffer.writeUInt16LE(payload.reporting_interval_settings_switch.reporting_interval1.time);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x02
	if ('detection_interval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x02);
		if ([2, 5, 10, 15, 30, 60].indexOf(payload.detection_interval) === -1) {
			throw oneOfError('detection_interval', [2, 5, 10, 15, 30, 60]);
		}
		buffer.writeUInt16LE(payload.detection_interval);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x40
	if ('adr_mode' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x40);
		if ([0, 1].indexOf(payload.adr_mode) === -1) {
			throw oneOfError('adr_mode', [0, 1]);
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.adr_mode);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x10
	if ('rebot' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x10);
		buffer.writeUInt8(0xff);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x06 // set_threshold_alarm_temperature.threshold_duration
	if ('set_threshold_alarm_temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x06);
		var bitOptions = 0;
		// 0：Disabled, 1：Condition: Temperature＜A, 2：Condition: Temperature＞B, 3：Condition: A＜Temperature＜B, 4：Condition: Temperature＜A or Temperature＞B
		bitOptions |= payload.set_threshold_alarm_temperature.threshold_condition << 0;

		// 3: Threshold of Temperature
		bitOptions |= 0x01 << 3;

		bitOptions |= 0x01 << 6;

		buffer.writeUInt8(bitOptions);
		if (payload.set_threshold_alarm_temperature.value_less_than < -40 || payload.set_threshold_alarm_temperature.value_less_than > 125) {
			throw betweenError('set_threshold_alarm_temperature.value_less_than', -40, 125);
		}
		buffer.writeInt16LE(payload.set_threshold_alarm_temperature.value_less_than * 10);
		if (payload.set_threshold_alarm_temperature.value_greater_than < -40 || payload.set_threshold_alarm_temperature.value_greater_than > 125) {
			throw betweenError('set_threshold_alarm_temperature.value_greater_than', -40, 125);
		}
		buffer.writeInt16LE(payload.set_threshold_alarm_temperature.value_greater_than * 10);
		buffer.writeUInt16LE(0x00);
		buffer.writeUInt16LE(0x00);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x06 // set_threshold_alarm_humidity.threshold_duration
	if ('set_threshold_alarm_humidity' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x06);
		var bitOptions = 0;
		// 0：Disabled, 1：Condition: Humidity＜A, 2：Condition: Humidity＞B, 3：Condition: A＜Humidity＜B, 4：Condition: Humidity＜A or Humidity＞B
		bitOptions |= payload.set_threshold_alarm_humidity.threshold_condition << 0;

		// 3: Threshold of Humidity
		bitOptions |= 0x02 << 3;

		bitOptions |= 0x01 << 6;

		buffer.writeUInt8(bitOptions);
		if (payload.set_threshold_alarm_humidity.value_less_than < 0 || payload.set_threshold_alarm_humidity.value_less_than > 100) {
			throw betweenError('set_threshold_alarm_humidity.value_less_than', 0, 100);
		}
		buffer.writeInt16LE(payload.set_threshold_alarm_humidity.value_less_than * 2);
		if (payload.set_threshold_alarm_humidity.value_greater_than < 0 || payload.set_threshold_alarm_humidity.value_greater_than > 100) {
			throw betweenError('set_threshold_alarm_humidity.value_greater_than', 0, 100);
		}
		buffer.writeInt16LE(payload.set_threshold_alarm_humidity.value_greater_than * 2);
		buffer.writeUInt16LE(0x00);
		buffer.writeUInt16LE(0x00);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x84
	if ('d2d_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x84);
		if ([0, 1].indexOf(payload.d2d_enable) === -1) {
			throw oneOfError('d2d_enable', [0, 1]);
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.d2d_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x68
	if ('data_storage_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x68);
		if ([0, 1].indexOf(payload.data_storage_enable) === -1) {
			throw oneOfError('data_storage_enable', [0, 1]);
		}
		// 0:disable, 1:enable
		buffer.writeUInt8(payload.data_storage_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x69
	if ('retransmission_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x69);
		if ([0, 1].indexOf(payload.retransmission_enable) === -1) {
			throw oneOfError('retransmission_enable', [0, 1]);
		}
		// 0:disable, 1:enable
		buffer.writeUInt8(payload.retransmission_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x6a // retransmission_interval.type
	if ('retransmission_interval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x6a);
		// 0: retransmission interval
		buffer.writeUInt8(0x00);
		if (payload.retransmission_interval.interval < 30 || payload.retransmission_interval.interval > 1200) {
			throw betweenError('retransmission_interval.interval', 30, 1200);
		}
		buffer.writeUInt16LE(payload.retransmission_interval.interval);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x6a // retrival_interval.type
	if ('retrival_interval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x6a);
		// 1: retrival interval
		buffer.writeUInt8(0x01);
		if (payload.retrival_interval.interval < 30 || payload.retrival_interval.interval > 1200) {
			throw betweenError('retrival_interval.interval', 30, 1200);
		}
		buffer.writeUInt16LE(payload.retrival_interval.interval);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf9_0x6b
	if ('detection_mode' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xf9);
		buffer.writeUInt8(0x6b);
		if ([0, 1].indexOf(payload.detection_mode) === -1) {
			throw oneOfError('detection_mode', [0, 1]);
		}
		// 0：Auto, 1：Always ON
		buffer.writeUInt8(payload.detection_mode);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf9_0x6c
	if ('trigger_a_detection' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xf9);
		buffer.writeUInt8(0x6c);
		buffer.writeUInt8(0xff);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf9_0x6e
	if ('reset' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xf9);
		buffer.writeUInt8(0x6e);
		buffer.writeUInt8(0xff);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xfd_0x6b
	if ('retrival_historical_data_by_time' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xfd);
		buffer.writeUInt8(0x6b);
		buffer.writeUInt32LE(payload.retrival_historical_data_by_time.time);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xfd_0x6c
	if ('retrival_historical_data_by_time_range' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xfd);
		buffer.writeUInt8(0x6c);
		buffer.writeUInt32LE(payload.retrival_historical_data_by_time_range.start_time);
		buffer.writeUInt32LE(payload.retrival_historical_data_by_time_range.end_time);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xfd_0x6d
	if ('stop_historical_data_retrival' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xfd);
		buffer.writeUInt8(0x6d);
		buffer.writeUInt8(payload.stop_historical_data_retrival);
		encoded = encoded.concat(buffer.toBytes());
	}
	return encoded;
}

function Buffer() {
	this.buffer = new Array();
}

Buffer.prototype._write = function(value, byteLength, isLittleEndian) {
	value = Math.round(value);
	var offset = 0;
	for (var index = 0; index < byteLength; index++) {
		offset = isLittleEndian ? index << 3 : (byteLength - 1 - index) << 3;
		this.buffer.push((value >> offset) & 0xff);
	}
};

Buffer.prototype.writeUInt8 = function(value) {
	this._write(value, 1, true);
};

Buffer.prototype.writeInt8 = function(value) {
	this._write(value < 0 ? value + 0x100 : value, 1, true);
};

Buffer.prototype.writeUInt16LE = function(value) {
	this._write(value, 2, true);
};

Buffer.prototype.writeInt16LE = function(value) {
	this._write(value < 0 ? value + 0x10000 : value, 2, true);
};

Buffer.prototype.writeUInt24LE = function(value) {
	this._write(value, 3, true);
};

Buffer.prototype.writeInt24LE = function(value) {
	this._write(value < 0 ? value + 0x1000000 : value, 3, true);
};

Buffer.prototype.writeUInt32LE = function(value) {
	this._write(value, 4, true);
};

Buffer.prototype.writeInt32LE = function(value) {
	this._write(value < 0 ? value + 0x100000000 : value, 4, true);
};

Buffer.prototype.writeFloatLE = function(value) {
	var sign = (value < 0 || (value === 0 && 1 / value === -Infinity)) ? 1 : 0;
	var absValue = Math.abs(value);

	if (absValue === 0) {
		this._write(sign ? 0x80000000 : 0, 4, true);
		return;
	} else if (value !== value) {
		this._write(0x7fc00000, 4, true);
		return;
	} else if (absValue === Infinity) {
		this._write((((sign << 31) >>> 0) | 0x7f800000) >>> 0, 4, true);
		return;
	}

	var exponent = Math.floor(Math.log(absValue) / Math.LN2);
	var normalized = absValue / Math.pow(2, exponent);
	if (normalized < 1) {
		exponent -= 1;
		normalized *= 2;
	} else if (normalized >= 2) {
		exponent += 1;
		normalized /= 2;
	}

	var biasedExponent = exponent + 127;
	var mantissaBits = 0;
	if (biasedExponent <= 0) {
		biasedExponent = 0;
		mantissaBits = Math.round(absValue / Math.pow(2, -149));
		if (mantissaBits > 0x7fffff) {
			mantissaBits = 0x7fffff;
		}
	} else {
		mantissaBits = Math.round((normalized - 1) * 0x800000);
		if (mantissaBits === 0x800000) {
			biasedExponent += 1;
			mantissaBits = 0;
		}
		if (biasedExponent >= 0xff) {
			this._write((((sign << 31) >>> 0) | 0x7f800000) >>> 0, 4, true);
			return;
		}
	}

	var floatBits = ((((sign << 31) >>> 0) | ((biasedExponent & 0xff) << 23) | (mantissaBits & 0x7fffff)) >>> 0);
	this._write(floatBits, 4, true);
};

Buffer.prototype.writeBytes = function(bytes, length, mustEqual) {
	if (mustEqual === undefined) mustEqual = false;
	if (length < bytes.length) {
		throw new Error('bytes length is greater than length');
	}
	if (mustEqual && bytes.length != length) {
		throw new Error('bytes length is not equal to length');
	}

	for (var i = 0; i < bytes.length; i++) {
		this.buffer.push(bytes[i]);
	}

	if (length > bytes.length) {
		for (var i = bytes.length; i < length; i++) {
			this.buffer.push(0);
		}
	}
};

Buffer.prototype.writeHexString = function(hexString, length, mustEqual) {
	if (mustEqual === undefined) mustEqual = false;
	var bytes = [];
	for (var i = 0; i < hexString.length; i += 2) {
		bytes.push(parseInt(hexString.substr(i, 2), 16));
	}
	if (mustEqual && bytes.length != length) {
		throw new Error('hex string length is not equal to length');
	}
	this.writeBytes(bytes, length);
};

Buffer.prototype.writeString = function(str, length, mustEqual) {
	if (mustEqual === undefined) mustEqual = false;
	var bytes = encodeUtf8(str);
	if (mustEqual && bytes.length != length) {
		throw new Error('string length is not equal to length');
	}
	this.writeBytes(bytes, length);
};

Buffer.prototype.writeUnknownDataType = function(val) {
	throw new Error('Unknown data type encountered. Please Contact Developer.');
};

Buffer.prototype.writeHexStringReverse = function(hexString, length, mustEqual) {
	if (mustEqual === undefined) mustEqual = false;
	var bytes = [];
	for (var i = hexString.length - 2; i >= 0; i -= 2) {
		bytes.push(parseInt(hexString.substr(i, 2), 16));
	}
	if (mustEqual && bytes.length != length) {
		throw new Error('hex string length is not equal to length');
	}
	this.writeBytes(bytes, length);
};

Buffer.prototype.toBytes = function() {
	return this.buffer;
};

function encodeUtf8(str) {
	var byteArray = [];
	for (var i = 0; i < str.length; i++) {
		var charCode = str.charCodeAt(i);
		if (charCode < 0x80) {
			byteArray.push(charCode);
		} else if (charCode < 0x800) {
			byteArray.push(0xc0 | (charCode >> 6));
			byteArray.push(0x80 | (charCode & 0x3f));
		} else if (charCode < 0x10000) {
			byteArray.push(0xe0 | (charCode >> 12));
			byteArray.push(0x80 | ((charCode >> 6) & 0x3f));
			byteArray.push(0x80 | (charCode & 0x3f));
		} else if (charCode < 0x200000) {
			byteArray.push(0xf0 | (charCode >> 18));
			byteArray.push(0x80 | ((charCode >> 12) & 0x3f));
			byteArray.push(0x80 | ((charCode >> 6) & 0x3f));
			byteArray.push(0x80 | (charCode & 0x3f));
		}
	}
	return byteArray;
}

function isValid(value) {
	return value !== undefined && value !== null && value !== '';
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

function betweenError(path, min, max) {
	return new Error(path + ' must be between ' + min + ' and ' + max);
}

function oneOfError(path, values) {
	return new Error(path + ' must be one of [' + values.join(', ') + ']');
}

function processTemperature(payload) {
	var allTemperatureProperties = {
    "temperature": {
        "coefficient": 0.1,
        "unitName": "℃"
    },
    "temperature_threshold_alarm.alarm_temperature": {
        "coefficient": 0.1,
        "unitName": "℃"
    },
    "set_threshold_alarm_temperature.value_less_than": {
        "coefficient": 0.1,
        "unitName": "℃"
    },
    "set_threshold_alarm_temperature.value_greater_than": {
        "coefficient": 0.1,
        "unitName": "℃"
    }
};
	var leafPaths = getAllLeafPaths(payload);
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
			var unitName = allTemperatureProperties[newPropertyId].unitName;
			var constant = unitName == 'K' ? 0 : 32;
			var fahrenheitProperty = convertName(propertyId, 'fahrenheit');
			var celsiusProperty = convertName(propertyId, 'celsius');
			var stringCoefficient = String(allTemperatureProperties[newPropertyId].coefficient);
			var dotIndex = stringCoefficient.indexOf('.');
			var precision = dotIndex != -1 ? stringCoefficient.length - dotIndex - 1 : 0;
			if (!hasPath(payload, propertyId)) {
				// if (hasPath(payload, fahrenheitProperty) && hasPath(payload, celsiusProperty)) {
				//     throw new Error(fahrenheitProperty + ' and ' + celsiusProperty + ' cannot be in payload at the same time');
				// }
				if (hasPath(payload, celsiusProperty)) {
					setPath(payload, propertyId, Number(getPath(payload, celsiusProperty).toFixed(precision)));
				} else if (hasPath(payload, fahrenheitProperty)) {
					setPath(payload, propertyId, Number(((getPath(payload, fahrenheitProperty) - constant) / 1.8).toFixed(precision)));
				}
			}
		}
	}
	return payload;
}