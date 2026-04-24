/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product UC711
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
	//0xcf
	if ('lorawan_configuration_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.lorawan_configuration_settings.mode)) {
			buffer.writeUInt8(0xcf);
			// 0:ClassA, 1:ClassB, 2:ClassC, 3:ClassC to B
			buffer.writeUInt8(0x00);
			// 0:ClassA, 1:ClassB, 2:ClassC, 3:ClassC to B
			buffer.writeUInt8(payload.lorawan_configuration_settings.mode);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xdb
	if ('product_sn' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xdb);
		buffer.writeHexString(payload.product_sn, 8);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xc8
	if ('device_status' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xc8);
		// 0：Off, 1：On
		buffer.writeUInt8(payload.device_status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x01
	if ('relay_status_change' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x01);
		var bitOptions = 0;
		// 0: Disconnect, 1: Close
		bitOptions |= payload.relay_status_change.Y1 << 0;

		// 0: Disconnect, 1: Close
		bitOptions |= payload.relay_status_change.W1 << 1;

		// 0: Disconnect, 1: Close
		bitOptions |= payload.relay_status_change.OB << 2;

		// 0: Disconnect, 1: Close
		bitOptions |= payload.relay_status_change.GL << 3;

		// 0: Disconnect, 1: Close
		bitOptions |= payload.relay_status_change.GM << 4;

		// 0: Disconnect, 1: Close
		bitOptions |= payload.relay_status_change.GH << 5;

		bitOptions |= payload.relay_status_change.reserved << 6;
		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0x02
	if ('temperature_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x02);
		buffer.writeUInt8(payload.temperature_alarm.type);
		if (payload.temperature_alarm.type == 0x10) {
		}
		if (payload.temperature_alarm.type == 0x11) {
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x06
	if ('temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x06);
		if (payload.temperature < -20 || payload.temperature > 60) {
			throw new Error('temperature must be between -20 and 60');
		}
		buffer.writeInt16LE(payload.temperature * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x08
	if ('humidity' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x08);
		if (payload.humidity < 0 || payload.humidity > 100) {
			throw new Error('humidity must be between 0 and 100');
		}
		buffer.writeInt16LE(payload.humidity * 10);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0c
	if ('temperature_control_info' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0c);
		var bitOptions = 0;
		// 0：standby, 1：stage-1 heat, 2：stage-2 heat, 3：stage-3 heat, 4：stage-4 heat, 5：stage-5 heat, 7：stage-1 cool, 8：stage-2 cool, 9：stage-3 cool
		bitOptions |= payload.temperature_control_info.status << 0;
		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0d
	if ('fan_control_info' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0d);
		var bitOptions = 0;
		// 0：off, 1：open, 2：low, 3:medium, 4:high
		bitOptions |= payload.fan_control_info.status << 0;
		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0x61
	if ('target_temperature_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.target_temperature_settings.heat)) {
			buffer.writeUInt8(0x61);
			buffer.writeUInt8(0x00);
			if (payload.target_temperature_settings.heat < 5 || payload.target_temperature_settings.heat > 35) {
				throw new Error('target_temperature_settings.heat must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.target_temperature_settings.heat * 100);
		}
		if (isValid(payload.target_temperature_settings.cool)) {
			buffer.writeUInt8(0x61);
			buffer.writeUInt8(0x02);
			if (payload.target_temperature_settings.cool < 5 || payload.target_temperature_settings.cool > 35) {
				throw new Error('target_temperature_settings.cool must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.target_temperature_settings.cool * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x62
	if ('target_temperature_tolerance' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.target_temperature_tolerance.heat_value)) {
			buffer.writeUInt8(0x62);
			buffer.writeUInt8(0x00);
			if (payload.target_temperature_tolerance.heat_value < 0.1 || payload.target_temperature_tolerance.heat_value > 5) {
				throw new Error('target_temperature_tolerance.heat_value must be between 0.1 and 5');
			}
			buffer.writeInt16LE(payload.target_temperature_tolerance.heat_value * 100);
		}
		if (isValid(payload.target_temperature_tolerance.cool_value)) {
			buffer.writeUInt8(0x62);
			buffer.writeUInt8(0x02);
			if (payload.target_temperature_tolerance.cool_value < 0.1 || payload.target_temperature_tolerance.cool_value > 5) {
				throw new Error('target_temperature_tolerance.cool_value must be between 0.1 and 5');
			}
			buffer.writeInt16LE(payload.target_temperature_tolerance.cool_value * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x63
	if ('target_temperature_range' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.target_temperature_range.heat)) {
			buffer.writeUInt8(0x63);
			buffer.writeUInt8(0x00);
			if (payload.target_temperature_range.heat.min < 5 || payload.target_temperature_range.heat.min > 35) {
				throw new Error('target_temperature_range.heat.min must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.target_temperature_range.heat.min * 100);
			if (payload.target_temperature_range.heat.max < 5 || payload.target_temperature_range.heat.max > 35) {
				throw new Error('target_temperature_range.heat.max must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.target_temperature_range.heat.max * 100);
		}
		if (isValid(payload.target_temperature_range.cool)) {
			buffer.writeUInt8(0x63);
			buffer.writeUInt8(0x02);
			if (payload.target_temperature_range.cool.min < 5 || payload.target_temperature_range.cool.min > 35) {
				throw new Error('target_temperature_range.cool.min must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.target_temperature_range.cool.min * 100);
			if (payload.target_temperature_range.cool.max < 5 || payload.target_temperature_range.cool.max > 35) {
				throw new Error('target_temperature_range.cool.max must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.target_temperature_range.cool.max * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x64
	if ('temperature_unit' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x64);
		// 0：℃, 1：℉
		buffer.writeUInt8(payload.temperature_unit);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x66
	if ('reporting_interval' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.reporting_interval.ble_lora)) {
			buffer.writeUInt8(0x66);
			buffer.writeUInt8(0x00);
			// 0：second, 1：min
			buffer.writeUInt8(payload.reporting_interval.ble_lora.unit);
			if (payload.reporting_interval.ble_lora.unit == 0x00) {
				if (payload.reporting_interval.ble_lora.seconds_of_time < 60 || payload.reporting_interval.ble_lora.seconds_of_time > 64800) {
					throw new Error('reporting_interval.ble_lora.seconds_of_time must be between 60 and 64800');
				}
				buffer.writeUInt16LE(payload.reporting_interval.ble_lora.seconds_of_time);
			}
			if (payload.reporting_interval.ble_lora.unit == 0x01) {
				if (payload.reporting_interval.ble_lora.minutes_of_time < 1 || payload.reporting_interval.ble_lora.minutes_of_time > 1440) {
					throw new Error('reporting_interval.ble_lora.minutes_of_time must be between 1 and 1440');
				}
				buffer.writeUInt16LE(payload.reporting_interval.ble_lora.minutes_of_time);
			}
		}
		if (isValid(payload.reporting_interval.power_lora)) {
			buffer.writeUInt8(0x66);
			buffer.writeUInt8(0x01);
			// 0：second, 1：min
			buffer.writeUInt8(payload.reporting_interval.power_lora.unit);
			if (payload.reporting_interval.power_lora.unit == 0x00) {
				if (payload.reporting_interval.power_lora.seconds_of_time < 60 || payload.reporting_interval.power_lora.seconds_of_time > 64800) {
					throw new Error('reporting_interval.power_lora.seconds_of_time must be between 60 and 64800');
				}
				buffer.writeUInt16LE(payload.reporting_interval.power_lora.seconds_of_time);
			}
			if (payload.reporting_interval.power_lora.unit == 0x01) {
				if (payload.reporting_interval.power_lora.minutes_of_time < 1 || payload.reporting_interval.power_lora.minutes_of_time > 1440) {
					throw new Error('reporting_interval.power_lora.minutes_of_time must be between 1 and 1440');
				}
				buffer.writeUInt16LE(payload.reporting_interval.power_lora.minutes_of_time);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x70
	if ('fan_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.fan_settings.fan_mode)) {
			buffer.writeUInt8(0x70);
			// 0：Auto, 1：Ventilation, 2：Always Open, 3：Low, 4：Medium, 5：High, 255：Disabled
			buffer.writeUInt8(0x00);
			// 0：Auto, 1：Ventilation, 2：Always Open, 3：Low, 4：Medium, 5：High, 255：Disabled
			buffer.writeUInt8(payload.fan_settings.fan_mode);
		}
		if (isValid(payload.fan_settings.adjust_humidity_enable)) {
			buffer.writeUInt8(0x70);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(0x01);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(payload.fan_settings.adjust_humidity_enable);
		}
		if (isValid(payload.fan_settings.adjust_period)) {
			buffer.writeUInt8(0x70);
			buffer.writeUInt8(0x02);
			if (payload.fan_settings.adjust_period < 5 || payload.fan_settings.adjust_period > 55) {
				throw new Error('fan_settings.adjust_period must be between 5 and 55');
			}
			buffer.writeUInt8(payload.fan_settings.adjust_period);
		}
		if (isValid(payload.fan_settings.work_time)) {
			buffer.writeUInt8(0x70);
			buffer.writeUInt8(0x03);
			if (payload.fan_settings.work_time < 5 || payload.fan_settings.work_time > 55) {
				throw new Error('fan_settings.work_time must be between 5 and 55');
			}
			buffer.writeUInt8(payload.fan_settings.work_time);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x71
	if ('anti_freezing' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.anti_freezing.enable)) {
			buffer.writeUInt8(0x71);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(0x00);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(payload.anti_freezing.enable);
		}
		if (isValid(payload.anti_freezing.target_temperature)) {
			buffer.writeUInt8(0x71);
			buffer.writeUInt8(0x01);
			if (payload.anti_freezing.target_temperature < 1 || payload.anti_freezing.target_temperature > 5) {
				throw new Error('anti_freezing.target_temperature must be between 1 and 5');
			}
			buffer.writeInt16LE(payload.anti_freezing.target_temperature * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x72
	if ('dehumidify_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.dehumidify_settings.humidify_low_threshold)) {
			buffer.writeUInt8(0x72);
			buffer.writeUInt8(0x02);
			if (payload.dehumidify_settings.humidify_low_threshold < 0 || payload.dehumidify_settings.humidify_low_threshold > 100) {
				throw new Error('dehumidify_settings.humidify_low_threshold must be between 0 and 100');
			}
			buffer.writeInt16LE(payload.dehumidify_settings.humidify_low_threshold * 10);
		}
		if (isValid(payload.dehumidify_settings.humidify_high_threshold)) {
			buffer.writeUInt8(0x72);
			buffer.writeUInt8(0x03);
			if (payload.dehumidify_settings.humidify_high_threshold < 0 || payload.dehumidify_settings.humidify_high_threshold > 100) {
				throw new Error('dehumidify_settings.humidify_high_threshold must be between 0 and 100');
			}
			buffer.writeInt16LE(payload.dehumidify_settings.humidify_high_threshold * 10);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x75
	if ('temperature_control_mode_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x75);
		var bitOptions = 0;
		// 0：disable, 1：enable
		bitOptions |= payload.temperature_control_mode_enable.heat << 0;

		// 0：disable, 1：enable
		bitOptions |= payload.temperature_control_mode_enable.em_heat << 1;

		// 0：disable, 1：enable
		bitOptions |= payload.temperature_control_mode_enable.cool << 2;

		// 0：disable, 1：enable
		bitOptions |= payload.temperature_control_mode_enable.auto << 3;

		// 0：disable, 1：enable
		bitOptions |= payload.temperature_control_mode_enable.dehumidify << 4;

		// 0：disable, 1：enable
		bitOptions |= payload.temperature_control_mode_enable.ventilate << 5;

		bitOptions |= payload.temperature_control_mode_enable.reserved << 6;
		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0x8e
	if ('install_configuration' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.install_configuration.reversing_valve)) {
			buffer.writeUInt8(0x8e);
			buffer.writeUInt8(0x01);
			// 0：o/b on heat, 1：o/b on cool 
			buffer.writeUInt8(payload.install_configuration.reversing_valve.mode);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xb8
	if ('synchronize_time' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb8);
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

function cmdMap() {
	return {
		  "lorawan_configuration_settings": "cf",
		  "lorawan_configuration_settings.mode": "cf00",
		  "tsl_version": "df",
		  "product_sn": "db",
		  "version.hardware_version": "da",
		  "device_status": "c8",
		  "relay_status_change": "01",
		  "temperature_alarm": "02",
		  "temperature_alarm.anti_freeze_protection_deactivation": "0210",
		  "temperature_alarm.anti_freeze_protection_trigger": "0211",
		  "temperature": "06",
		  "humidity": "08",
		  "temperature_control_info": "0c",
		  "fan_control_info": "0d",
		  "target_temperature_settings": "61",
		  "target_temperature_settings.heat": "6100",
		  "target_temperature_settings.cool": "6102",
		  "target_temperature_tolerance": "62",
		  "target_temperature_tolerance.heat_value": "6200",
		  "target_temperature_tolerance.cool_value": "6202",
		  "target_temperature_range": "63",
		  "target_temperature_range.heat": "6300",
		  "target_temperature_range.cool": "6302",
		  "temperature_unit": "64",
		  "reporting_interval": "66",
		  "reporting_interval.ble_lora": "6600",
		  "reporting_interval.ble_lora.seconds_of_time": "660000",
		  "reporting_interval.ble_lora.minutes_of_time": "660001",
		  "reporting_interval.power_lora": "6601",
		  "reporting_interval.power_lora.seconds_of_time": "660100",
		  "reporting_interval.power_lora.minutes_of_time": "660101",
		  "fan_settings": "70",
		  "fan_settings.fan_mode": "7000",
		  "fan_settings.adjust_humidity_enable": "7001",
		  "fan_settings.adjust_period": "7002",
		  "fan_settings.work_time": "7003",
		  "anti_freezing": "71",
		  "anti_freezing.enable": "7100",
		  "anti_freezing.target_temperature": "7101",
		  "dehumidify_settings": "72",
		  "dehumidify_settings.humidify_low_threshold": "7202",
		  "dehumidify_settings.humidify_high_threshold": "7203",
		  "temperature_control_mode_enable": "75",
		  "install_configuration": "8e",
		  "install_configuration.reversing_valve": "8e01",
		  "synchronize_time": "b8"
	};
}
function processTemperature(payload) {
	var allTemperatureProperties = {
    "temperature": {
        "coefficient": 0.01
    },
    "target_temperature_settings.heat": {
        "coefficient": 0.01
    },
    "target_temperature_settings.cool": {
        "coefficient": 0.01
    },
    "target_temperature_tolerance.heat_value": {
        "coefficient": 0.01
    },
    "target_temperature_tolerance.cool_value": {
        "coefficient": 0.01
    },
    "target_temperature_range.heat.min": {
        "coefficient": 0.01
    },
    "target_temperature_range.heat.max": {
        "coefficient": 0.01
    },
    "target_temperature_range.cool.min": {
        "coefficient": 0.01
    },
    "target_temperature_range.cool.max": {
        "coefficient": 0.01
    },
    "anti_freezing.target_temperature": {
        "coefficient": 0.01
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
            var fahrenheitProperty = convertName(propertyId, 'fahrenheit');
            var celsiusProperty = convertName(propertyId, 'celsius');
            var stringCoefficient = String(allTemperatureProperties[newPropertyId].coefficient);
            var dotIndex = stringCoefficient.indexOf('.');
            var precision = dotIndex != -1 ? stringCoefficient.length - dotIndex - 1 : 0;
            if (!hasPath(payload, propertyId)) {
                if (hasPath(payload, fahrenheitProperty) && hasPath(payload, celsiusProperty)) { 
                    throw new Error(fahrenheitProperty + ' and ' + celsiusProperty + ' cannot be in payload at the same time');
                }
                if (hasPath(payload, fahrenheitProperty)) {
                    setPath(payload, propertyId, Number(((getPath(payload, fahrenheitProperty) - 32) / 1.8).toFixed(precision)));
                } else if (hasPath(payload, celsiusProperty)) {
                    setPath(payload, propertyId, Number(getPath(payload, celsiusProperty).toFixed(precision)));
                }
            }
        }
	}	
	return payload;
}