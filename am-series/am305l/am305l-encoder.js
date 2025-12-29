/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product AM305L
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
	var encoded = [];
	//0xff
	if ('alarm_reporting_times' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		// 1:temperature, 2:humidity, 3:PIR, 4:Illuminance, 5:CO₂
		buffer.writeUInt8(payload.pir_enable.sensor_id);
		var bitOptions = 0;
		// 0：disable, 1：enable
		bitOptions |= payload.pir_enable.enable << 2;
		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0x01
	if ('battery' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x01);
		if (payload.battery < 1 || payload.battery > 100) {
			throw new Error('battery must be between 1 and 100');
		}
		buffer.writeUInt8(payload.battery);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x03
	if ('temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x03);
		if (payload.temperature < -20 || payload.temperature > 60) {
			throw new Error('temperature must be between -20 and 60');
		}
		buffer.writeInt16LE(payload.temperature * 10);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x04
	if ('humidity' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x04);
		if (payload.humidity < 0 || payload.humidity > 100) {
			throw new Error('humidity must be between 0 and 100');
		}
		buffer.writeUInt8(payload.humidity * 2);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x05
	if ('pir' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x05);
		var bitOptions = 0;
		bitOptions |= payload.pir.pir_status << 15;

		bitOptions |= payload.pir.pir_count << 0;
		buffer.writeUInt16LE(bitOptions);

		// 0:vacant, 1:trigger
		buffer.writeUInt8(payload.pir_status_change.status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x06
	if ('als_level' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x06);
		if (payload.als_level < 0 || payload.als_level > 5) {
			throw new Error('als_level must be between 0 and 5');
		}
		buffer.writeUInt8(payload.als_level);
		if (payload.Lux < 0 || payload.Lux > 60000) {
			throw new Error('Lux must be between 0 and 60000');
		}
		buffer.writeUInt16LE(payload.Lux);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x07
	if ('co2' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x07);
		if (payload.co2 < 400 || payload.co2 > 5000) {
			throw new Error('co2 must be between 400 and 5000');
		}
		buffer.writeUInt16LE(payload.co2);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xb3
	if ('temperature_collection_anomaly' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb3);
		// 0:collect abnormal, 1:collect out of range
		buffer.writeUInt8(payload.temperature_collection_anomaly.type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xb4
	if ('humidity_collection_anomaly' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb4);
		// 0:collect abnormal
		buffer.writeUInt8(payload.humidity_collection_anomaly.type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xb6
	if ('illuminace_collection_anomaly' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb6);
		// 0:collect abnormal
		buffer.writeUInt8(payload.illuminace_collection_anomaly.type);
		// 0:collect abnormal, 1:collect out of range
		buffer.writeUInt8(payload.Lux_collection_anomaly.type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xb7
	if ('co2_collection_anomaly' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb7);
		// 0:collect abnormal, 1:collect out of range
		buffer.writeUInt8(payload.co2_collection_anomaly.type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x83
	if ('temperature_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x83);
		buffer.writeInt16LE(payload.temperature_alarm.temperature * 10);
		// 16:below alarm released, 17:below alarm, 18:above alarm released, 19:above alarm, 20:within alarm released, 21:within alarm, 22:exceed tolerance alarm released, 23:exceed tolerance alarm
		buffer.writeUInt8(payload.temperature_alarm.alarm_type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x86
	if ('Lux_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x86);
		buffer.writeUInt16LE(payload.Lux_alarm.Lux);
		// 16:dim, 17:bright
		buffer.writeUInt8(payload.Lux_alarm.alarm_type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x87
	if ('co2_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x87);
		buffer.writeUInt16LE(payload.co2_alarm.co2);
		// 16:Polluted,2-level alarm released, 17:Polluted,2-level alarm, 18:Bad,1-level alarm released, 19:Bad,1-level alarm
		buffer.writeUInt8(payload.co2_alarm.alarm_type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x20
	if ('historical_data_retrieval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x20);
		buffer.writeUInt32LE(payload.historical_data_retrieval.timestamp);
		// 0:data invalid, 1:data valid, 2:data out of range, 3:data collect abnormal
		buffer.writeUInt8(payload.historical_data_retrieval.temperature_type);
		buffer.writeInt16LE(payload.historical_data_retrieval.temperature * 10);
		// 0:data invalid, 1:data valid, 2:data out of range, 3:data collect abnormal
		buffer.writeUInt8(payload.historical_data_retrieval.humidity_type);
		buffer.writeUInt8(payload.historical_data_retrieval.humidity * 2);
		var bitOptions = 0;
		// 0:data invalid, 1:data valid
		bitOptions |= payload.historical_data_retrieval.pir_type << 6;

		// 0:vacant, 1:trigger
		bitOptions |= payload.historical_data_retrieval.pir_status << 0;

		buffer.writeUInt8(bitOptions);
		buffer.writeUInt16LE(payload.historical_data_retrieval.pir_count);
		// 0:data invalid, 1:data valid, 2:data out of range, 3:data collect abnormal
		buffer.writeUInt8(payload.historical_data_retrieval.als_level_type);
		buffer.writeUInt16LE(payload.historical_data_retrieval.als_level);
		// 0:data invalid, 1:data valid, 2:data out of range, 3:data collect abnormal
		buffer.writeUInt8(payload.historical_data_retrieval.co2_type);
		buffer.writeUInt16LE(payload.historical_data_retrieval.co2);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x21
	if ('historical_data_retrieval_Lux' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x21);
		buffer.writeUInt32LE(payload.historical_data_retrieval_Lux.timestamp);
		// 0:data invalid, 1:data valid, 2:data out of range, 3:data collect abnormal
		buffer.writeUInt8(payload.historical_data_retrieval_Lux.temperature_type);
		buffer.writeInt16LE(payload.historical_data_retrieval_Lux.temperature * 10);
		// 0:data invalid, 1:data valid, 2:data out of range, 3:data collect abnormal
		buffer.writeUInt8(payload.historical_data_retrieval_Lux.humidity_type);
		buffer.writeUInt8(payload.historical_data_retrieval_Lux.humidity * 2);
		var bitOptions = 0;
		// 0:data invalid, 1:data valid
		bitOptions |= payload.historical_data_retrieval_Lux.pir_type << 6;

		// 0:vacant, 1:trigger
		bitOptions |= payload.historical_data_retrieval_Lux.pir_status << 0;

		buffer.writeUInt8(bitOptions);
		buffer.writeUInt16LE(payload.historical_data_retrieval_Lux.pir_count);
		// 0:data invalid, 1:data valid, 2:data out of range, 3:data collect abnormal
		buffer.writeUInt8(payload.historical_data_retrieval_Lux.Lux_type);
		buffer.writeUInt16LE(payload.historical_data_retrieval_Lux.Lux);
		// 0:data invalid, 1:data valid, 2:data out of range, 3:data collect abnormal
		buffer.writeUInt8(payload.historical_data_retrieval_Lux.co2_type);
		buffer.writeUInt16LE(payload.historical_data_retrieval_Lux.co2);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf9
	if ('reporting_interval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xf9);
		// 0:second, 1:minute
		buffer.writeUInt8(payload.reporting_interval.unit);
		if (payload.reporting_interval.interval < 1 || payload.reporting_interval.interval > 1440) {
			throw new Error('reporting_interval.interval must be between 1 and 1440');
		}
		buffer.writeUInt16LE(payload.reporting_interval.interval);
		// 0:temperature,humidity,CO₂ collect interval, 1:illuminace collect interval
		buffer.writeUInt8(payload.collecting_interval.id);
		// 0:second, 1:minute
		buffer.writeUInt8(payload.collecting_interval.unit);
		if (payload.collecting_interval.interval < 1 || payload.collecting_interval.interval > 1440) {
			throw new Error('collecting_interval.interval must be between 1 and 1440');
		}
		buffer.writeUInt16LE(payload.collecting_interval.interval);
		// 0:temperature, 1:Illuminance
		buffer.writeUInt8(payload.temperature_unit.sensor_id);
		// 0:celsius, 1:fahrenheit
		buffer.writeUInt8(payload.temperature_unit.unit);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.co2_alarm_rule.enable);
		// 0:enable 1-level only, 1:enable 2-levle only, 2:enable 1-level&2-levle
		buffer.writeUInt8(payload.co2_alarm_rule.mode);
		if (payload.co2_alarm_rule.level1_value < 400 || payload.co2_alarm_rule.level1_value > 5000) {
			throw new Error('co2_alarm_rule.level1_value must be between 400 and 5000');
		}
		buffer.writeUInt16LE(payload.co2_alarm_rule.level1_value);
		if (payload.co2_alarm_rule.level2_value < 400 || payload.co2_alarm_rule.level2_value > 5000) {
			throw new Error('co2_alarm_rule.level2_value must be between 400 and 5000');
		}
		buffer.writeUInt16LE(payload.co2_alarm_rule.level2_value);
		// 0:trigger report, 1:vacant report
		buffer.writeUInt8(payload.pir_trigger_report.type);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.pir_trigger_report.enable);
		// 0:trigger report, 1:vacant report
		buffer.writeUInt8(payload.pir_idle_report.type);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.pir_idle_report.enable);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.illuminance_alarm_rule.enable);
		if (payload.illuminance_alarm_rule.dim_value < 0 || payload.illuminance_alarm_rule.dim_value > 60000) {
			throw new Error('illuminance_alarm_rule.dim_value must be between 0 and 60000');
		}
		buffer.writeUInt16LE(payload.illuminance_alarm_rule.dim_value);
		if (payload.illuminance_alarm_rule.bright_value < 0 || payload.illuminance_alarm_rule.bright_value > 60000) {
			throw new Error('illuminance_alarm_rule.bright_value must be between 0 and 60000');
		}
		buffer.writeUInt16LE(payload.illuminance_alarm_rule.bright_value);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.d2d_sending.enable);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.d2d_sending.lora_uplink_enable);
		var bitOptions = 0;
		bitOptions |= payload.d2d_sending.temperature_enable << 0;

		bitOptions |= payload.d2d_sending.humidity_enable << 1;

		buffer.writeUInt16LE(bitOptions);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.d2d_master_enable);
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


function cmdMap() {
	return {
		  "device_status": "ff",
		  "d2d_master_settings._item": "undefinedxx",
		  "battery": "01",
		  "temperature": "03",
		  "humidity": "04",
		  "pir": "05",
		  "als_level": "06",
		  "co2": "07",
		  "temperature_collection_anomaly": "b3",
		  "humidity_collection_anomaly": "b4",
		  "illuminace_collection_anomaly": "b6",
		  "co2_collection_anomaly": "b7",
		  "temperature_alarm": "83",
		  "Lux_alarm": "86",
		  "co2_alarm": "87",
		  "historical_data_retrieval": "20",
		  "historical_data_retrieval_Lux": "21",
		  "reporting_interval": "f9"
	};
}