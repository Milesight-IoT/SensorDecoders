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
	//0xf9_0xbd
	if ('reporting_interval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xf9);
		buffer.writeUInt8(0xbd);
		// 0:second, 1:minute
		buffer.writeUInt8(payload.reporting_interval.unit);
		if (payload.reporting_interval.interval < 1 || payload.reporting_interval.interval > 1440) {
			throw new Error('reporting_interval.interval must be between 1 and 1440');
		}
		buffer.writeUInt16LE(payload.reporting_interval.interval);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf9_0xbe
	if ('collecting_interval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xf9);
		buffer.writeUInt8(0xbe);
		// 0:temperature,humidity,CO₂ collect interval, 1:illuminace collect interval
		buffer.writeUInt8(payload.collecting_interval.id);
		// 0:second, 1:minute
		buffer.writeUInt8(payload.collecting_interval.unit);
		if (payload.collecting_interval.interval < 1 || payload.collecting_interval.interval > 1440) {
			throw new Error('collecting_interval.interval must be between 1 and 1440');
		}
		buffer.writeUInt16LE(payload.collecting_interval.interval);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0xf2
	if ('alarm_reporting_times' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0xf2);
		if (payload.alarm_reporting_times < 1 || payload.alarm_reporting_times > 1000) {
			throw new Error('alarm_reporting_times must be between 1 and 1000');
		}
		buffer.writeUInt16LE(payload.alarm_reporting_times);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0xf5
	if ('alarm_deactivation_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0xf5);
		// 0: disable, 1: enable
		buffer.writeUInt8(payload.alarm_deactivation_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf9_0xc0
	if ('temperature_unit' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xf9);
		buffer.writeUInt8(0xc0);
		// 0:temperature, 1:Illuminance
		buffer.writeUInt8(payload.temperature_unit.sensor_id);
		// 0:celsius, 1:fahrenheit
		buffer.writeUInt8(payload.temperature_unit.unit);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x2e
	if ('led_mode' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x2e);
		// 0：disable, 2：enable
		buffer.writeUInt8(payload.led_mode);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x25
	if ('button_lock' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x25);
		var bitOptions = 0;
		// 0：disable, 1：enable
		bitOptions |= payload.button_lock.power_off << 0;

		// 0：disable, 1：enable
		bitOptions |= payload.button_lock.power_on << 1;
		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x06
	if ('temperature_alarm_rule' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x06);
		var bitOptions = 0;
		// 0：disable, 1：enable
		bitOptions |= payload.temperature_alarm_rule.enable << 6;

		// 1:condition: x<A, 2:condition: x>B, 3:condition: A<x<B, 4:condition: x<A or x>B
		bitOptions |= payload.temperature_alarm_rule.condition << 0;

		bitOptions |= payload.temperature_alarm_rule.id << 3;

		buffer.writeUInt8(bitOptions);
		if (payload.temperature_alarm_rule.threshold_max < -20 || payload.temperature_alarm_rule.threshold_max > 60) {
			throw new Error('temperature_alarm_rule.threshold_max must be between -20 and 60');
		}
		buffer.writeInt16LE(payload.temperature_alarm_rule.threshold_max * 10);
		if (payload.temperature_alarm_rule.threshold_min < -20 || payload.temperature_alarm_rule.threshold_min > 60) {
			throw new Error('temperature_alarm_rule.threshold_min must be between -20 and 60');
		}
		buffer.writeInt16LE(payload.temperature_alarm_rule.threshold_min * 10);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf9_0xc4
	if ('co2_alarm_rule' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xf9);
		buffer.writeUInt8(0xc4);
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
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x18
	if ('pir_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x18);
		// 1:temperature, 2:humidity, 3:PIR, 4:Illuminance, 5:CO₂
		buffer.writeUInt8(payload.pir_enable.sensor_id);
		var bitOptions = 0;
		// 0：disable, 1：enable
		bitOptions |= payload.pir_enable.enable << 2;

		buffer.writeUInt8(bitOptions);

		// 1:temperature, 2:humidity, 3:PIR, 4:Illuminance, 5:CO₂
		buffer.writeUInt8(payload.illuminance_collecting_enable.sensor_id);
		var bitOptions = 0;
		// 0：disable, 1：enable
		bitOptions |= payload.illuminance_collecting_enable.enable << 3;

		buffer.writeUInt8(bitOptions);

		// 1:temperature, 2:humidity, 3:PIR, 4:Illuminance, 5:CO₂
		buffer.writeUInt8(payload.co2_collecting_enable.sensor_id);
		var bitOptions = 0;
		// 0：disable, 1：enable
		bitOptions |= payload.co2_collecting_enable.enable << 4;
		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf9_0xbc
	if ('pir_trigger_report' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xf9);
		buffer.writeUInt8(0xbc);
		// 0:trigger report, 1:vacant report
		buffer.writeUInt8(payload.pir_trigger_report.type);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.pir_trigger_report.enable);
		// 0:trigger report, 1:vacant report
		buffer.writeUInt8(payload.pir_idle_report.type);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.pir_idle_report.enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x95
	if ('' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x95);
		if (payload.pir_idle_report.pir_idle_interval < 60 || payload.pir_idle_report.pir_idle_interval > 3600) {
			throw new Error('pir_idle_report.pir_idle_interval must be between 60 and 3600');
		}
		buffer.writeUInt16LE(payload.pir_idle_report.pir_idle_interval);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf9_0xbf
	if ('illuminance_alarm_rule' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xf9);
		buffer.writeUInt8(0xbf);
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
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0xea
	if ('temperature_calibration_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0xea);
		var bitOptions = 0;
		// 1:temperature, 2:humidity, 3:CO₂
		bitOptions |= payload.temperature_calibration_settings.id << 0;

		// 0: disable, 1: enable
		bitOptions |= payload.temperature_calibration_settings.enable << 7;
		buffer.writeUInt8(bitOptions);

		if (payload.temperature_calibration_settings.value < -20 || payload.temperature_calibration_settings.value > 60) {
			throw new Error('temperature_calibration_settings.value must be between -20 and 60');
		}
		buffer.writeInt16LE(payload.temperature_calibration_settings.value * 10);
		var bitOptions = 0;
		// 1:temperature, 2:humidity, 3:CO₂
		bitOptions |= payload.humidity_calibration_settings.id << 0;

		// 0: disable, 1: enable
		bitOptions |= payload.humidity_calibration_settings.enable << 7;
		buffer.writeUInt8(bitOptions);

		if (payload.humidity_calibration_settings.value < 0 || payload.humidity_calibration_settings.value > 100) {
			throw new Error('humidity_calibration_settings.value must be between 0 and 100');
		}
		buffer.writeInt16LE(payload.humidity_calibration_settings.value * 2);
		var bitOptions = 0;
		// 1:temperature, 2:humidity, 3:CO₂
		bitOptions |= payload.co2_calibration_settings.id << 0;

		// 0: disable, 1: enable
		bitOptions |= payload.co2_calibration_settings.enable << 7;
		buffer.writeUInt8(bitOptions);

		if (payload.co2_calibration_settings.value < 400 || payload.co2_calibration_settings.value > 5000) {
			throw new Error('co2_calibration_settings.value must be between 400 and 5000');
		}
		buffer.writeUInt16LE(payload.co2_calibration_settings.value);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x39
	if ('co2_auto_background_calibration_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x39);
		// 0: disable, 1: enable
		buffer.writeUInt8(payload.co2_auto_background_calibration_settings.enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x87
	if ('co2_altitude_calibration' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x87);
		// 0: disable, 1: enable
		buffer.writeUInt8(payload.co2_altitude_calibration.enable);
		if (payload.co2_altitude_calibration.value < 0 || payload.co2_altitude_calibration.value > 5000) {
			throw new Error('co2_altitude_calibration.value must be between 0 and 5000');
		}
		buffer.writeUInt16LE(payload.co2_altitude_calibration.value);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf9_0x63
	if ('d2d_sending' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xf9);
		buffer.writeUInt8(0x63);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.d2d_sending.enable);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.d2d_sending.lora_uplink_enable);
		var bitOptions = 0;
		bitOptions |= payload.d2d_sending.temperature_enable << 0;

		bitOptions |= payload.d2d_sending.humidity_enable << 1;
		buffer.writeUInt16LE(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf9_0x66
	if ('d2d_master_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xf9);
		buffer.writeUInt8(0x66);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.d2d_master_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x96
	if ('d2d_master_settings' in payload) {
		var buffer = new Buffer();
		for (var d2d_master_settings_id = 0; d2d_master_settings_id < (payload.d2d_master_settings && payload.d2d_master_settings.length); d2d_master_settings_id++) {
			var d2d_master_settings_item = payload.d2d_master_settings[d2d_master_settings_id];
			var d2d_master_settings_item_id = d2d_master_settings_item.trigger_condition;
			buffer.writeUInt8(0xff);
			buffer.writeUInt8(0x96);
			buffer.writeUInt8(d2d_master_settings_item_id);
			// 0：disable, 1：enable
			buffer.writeUInt8(d2d_master_settings_item.enable);
			// 0：disable, 1：enable
			buffer.writeUInt8(d2d_master_settings_item.lora_uplink_enable);
			buffer.writeHexString(d2d_master_settings_item.control_command, 2);
			// 0：disable, 1：enable
			buffer.writeUInt8(d2d_master_settings_item.control_time_enable);
			if (d2d_master_settings_item.control_time < 1 || d2d_master_settings_item.control_time > 1440) {
				throw new Error('control_time must be between 1 and 1440');
			}
			buffer.writeUInt16LE(d2d_master_settings_item.control_time);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x68
	if ('data_storage_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x68);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.data_storage_enable.enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x69
	if ('retransmission_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x69);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.retransmission_enable.enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x1a
	if ('co2_reset_calibration' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x1a);
		buffer.writeUInt8(payload.co2_reset_calibration);
		buffer.writeUInt8(payload.co2_background_calibration);
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
		  "device_status": "ff_0x0b",
		  "ipso_version": "ff_0x01",
		  "sn": "ff_0x16",
		  "tsl_version": "ff_0xff",
		  "request_tsl_config": "ff_0xfe",
		  "hardware_version": "ff_0x09",
		  "firmware_version": "ff_0x0a",
		  "lorawan_class": "ff_0x0f",
		  "battery": "01_0x75",
		  "temperature": "03_0x67",
		  "humidity": "04_0x68",
		  "pir": "05_0x9f",
		  "als_level": "06_0xcb",
		  "Lux": "06_0x9d",
		  "co2": "07_0x7d",
		  "pir_status_change": "05_0x00",
		  "temperature_collection_anomaly": "b3_0x67",
		  "humidity_collection_anomaly": "b4_0x68",
		  "illuminace_collection_anomaly": "b6_0xcb",
		  "Lux_collection_anomaly": "b6_0x9d",
		  "co2_collection_anomaly": "b7_0x7d",
		  "temperature_alarm": "83_0x67",
		  "Lux_alarm": "86_0x9d",
		  "co2_alarm": "87_0x7d",
		  "historical_data_retrieval": "20_0xce",
		  "historical_data_retrieval_Lux": "21_0xce",
		  "reporting_interval": "f9_0xbd",
		  "collecting_interval": "f9_0xbe",
		  "alarm_reporting_times": "ff_0xf2",
		  "alarm_deactivation_enable": "ff_0xf5",
		  "temperature_unit": "f9_0xc0",
		  "led_mode": "ff_0x2e",
		  "button_lock": "ff_0x25",
		  "temperature_alarm_rule": "ff_0x06",
		  "co2_alarm_rule": "f9_0xc4",
		  "pir_enable": "ff_0x18",
		  "pir_trigger_report": "f9_0xbc",
		  "pir_idle_report.pir_idle_interval": "ff_0x95",
		  "illuminance_alarm_rule": "f9_0xbf",
		  "temperature_calibration_settings": "ff_0xea",
		  "co2_auto_background_calibration_settings": "ff_0x39",
		  "co2_altitude_calibration": "ff_0x87",
		  "d2d_sending": "f9_0x63",
		  "d2d_master_enable": "f9_0x66",
		  "d2d_master_settings": "ff_0x96",
		  "d2d_master_settings._item": "ff_0x96xx",
		  "data_storage_enable": "ff_0x68",
		  "retransmission_enable": "ff_0x69",
		  "co2_reset_calibration": "ff_0x1a"
	};
}
