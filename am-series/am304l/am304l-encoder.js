/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product AM304L
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
	//0xff_0x0b
	if ('device_status' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x0b);
		buffer.writeUInt8(0xff);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x01
	if ('ipso_version' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x01);
		buffer.writeUInt8(payload.ipso_version);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x16
	if ('sn' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x16);
		buffer.writeHexString(payload.sn, 8);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0xff
	if ('tsl_version' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0xff);
		buffer.writeHexString(payload.tsl_version, 2);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0xfe
	if ('request_tsl_config' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0xfe);
		buffer.writeUInt8(0xff);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x09
	if ('hardware_version' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x09);
		buffer.writeHexString(payload.hardware_version, 2);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x0a
	if ('firmware_version' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x0a);
		buffer.writeHexString(payload.firmware_version, 2);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x0f
	if ('lorawan_class' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x0f);
		// 0:class_a
		buffer.writeUInt8(payload.lorawan_class);
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

		bitOptions |= 1 << 3;

		buffer.writeUInt8(bitOptions);
		if (payload.temperature_alarm_rule.threshold_max < -20 || payload.temperature_alarm_rule.threshold_max > 60) {
			throw new Error('temperature_alarm_rule.threshold_max must be between -20 and 60');
		}
		buffer.writeInt16LE(payload.temperature_alarm_rule.threshold_max * 10);
		if (payload.temperature_alarm_rule.threshold_min < -20 || payload.temperature_alarm_rule.threshold_min > 60) {
			throw new Error('temperature_alarm_rule.threshold_min must be between -20 and 60');
		}
		buffer.writeInt16LE(payload.temperature_alarm_rule.threshold_min * 10);
		buffer.writeUInt16LE(0);
		buffer.writeUInt16LE(0);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x18 // pir_enable.sensor_id
	if ('pir_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x18);
		// 1:temperature, 2:humidity, 3:PIR, 4:Illuminance, 5:CO₂
		buffer.writeUInt8(3);
		var bitOptions = 0;
		// 0：disable, 1：enable
		bitOptions |= payload.pir_enable.enable << 2;
		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x18 // illuminance_collecting_enable.sensor_id
	if ('illuminance_collecting_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x18);
		// 1:temperature, 2:humidity, 3:PIR, 4:Illuminance, 5:CO₂
		buffer.writeUInt8(4);
		var bitOptions = 0;
		// 0：disable, 1：enable
		bitOptions |= payload.illuminance_collecting_enable.enable << 3;
		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x95
	if ('pir_idle_interval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x95);
		if (payload.pir_idle_interval < 60 || payload.pir_idle_interval > 3600) {
			throw new Error('pir_idle_interval must be between 60 and 3600');
		}
		buffer.writeUInt16LE(payload.pir_idle_interval);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0xea // temperature_calibration_settings.id
	if ('temperature_calibration_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0xea);
		var bitOptions = 0;
		// 0:temperature, 1:humidity, 2:CO₂
		bitOptions |= 0 << 0;

		// 0: disable, 1: enable
		bitOptions |= payload.temperature_calibration_settings.enable << 7;
		buffer.writeUInt8(bitOptions);

		if (payload.temperature_calibration_settings.value < -80 || payload.temperature_calibration_settings.value > 80) {
			throw new Error('temperature_calibration_settings.value must be between -80 and 80');
		}
		buffer.writeInt16LE(payload.temperature_calibration_settings.value * 10);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0xea // humidity_calibration_settings.id
	if ('humidity_calibration_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0xea);
		var bitOptions = 0;
		// 0:temperature, 1:humidity, 2:CO₂
		bitOptions |= 1 << 0;

		// 0: disable, 1: enable
		bitOptions |= payload.humidity_calibration_settings.enable << 7;
		buffer.writeUInt8(bitOptions);

		if (payload.humidity_calibration_settings.value < -100 || payload.humidity_calibration_settings.value > 100) {
			throw new Error('humidity_calibration_settings.value must be between -100 and 100');
		}
		buffer.writeInt16LE(payload.humidity_calibration_settings.value * 2);
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
	//0xff_0x6a // retransmission_interval.type
	if ('retransmission_interval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x6a);
		// 0: retransmission interval, 1: retrival interval
		buffer.writeUInt8(0);
		if (payload.retransmission_interval.interval < 30 || payload.retransmission_interval.interval > 1200) {
			throw new Error('retransmission_interval.interval must be between 30 and 1200');
		}
		buffer.writeUInt16LE(payload.retransmission_interval.interval);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x6a // retrival_interval.type
	if ('retrival_interval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x6a);
		// 0: retransmission interval, 1: retrival interval
		buffer.writeUInt8(1);
		if (payload.retrival_interval.interval < 30 || payload.retrival_interval.interval > 1200) {
			throw new Error('retrival_interval.interval must be between 30 and 1200');
		}
		buffer.writeUInt16LE(payload.retrival_interval.interval);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x27
	if ('clear_historical_data' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x27);
		buffer.writeUInt8(1);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x10
	if ('reboot' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x10);
		buffer.writeUInt8(0xff);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x4a
	if ('synchronize_time' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x4a);
		buffer.writeUInt8(0);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x01_0x75
	if ('battery' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x01);
		buffer.writeUInt8(0x75);
		if (payload.battery < 1 || payload.battery > 100) {
			throw new Error('battery must be between 1 and 100');
		}
		buffer.writeUInt8(payload.battery);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x03_0x67
	if ('temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x03);
		buffer.writeUInt8(0x67);
		if (payload.temperature < -20 || payload.temperature > 60) {
			throw new Error('temperature must be between -20 and 60');
		}
		buffer.writeInt16LE(payload.temperature * 10);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x04_0x68
	if ('humidity' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x04);
		buffer.writeUInt8(0x68);
		if (payload.humidity < 0 || payload.humidity > 100) {
			throw new Error('humidity must be between 0 and 100');
		}
		buffer.writeUInt8(payload.humidity * 2);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x05_0x9f
	if ('pir' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x05);
		buffer.writeUInt8(0x9f);
		var bitOptions = 0;
		bitOptions |= payload.pir.pir_status << 15;

		bitOptions |= payload.pir.pir_count << 0;
		buffer.writeUInt16LE(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0x05_0x00
	if ('pir_status_change' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x05);
		buffer.writeUInt8(0x00);
		// 0:vacant, 1:trigger
		buffer.writeUInt8(payload.pir_status_change.status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x06_0xcb
	if ('als_level' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x06);
		buffer.writeUInt8(0xcb);
		if (payload.als_level < 0 || payload.als_level > 5) {
			throw new Error('als_level must be between 0 and 5');
		}
		buffer.writeUInt8(payload.als_level);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x06_0x9d
	if ('Lux' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x06);
		buffer.writeUInt8(0x9d);
		if (payload.Lux < 0 || payload.Lux > 60000) {
			throw new Error('Lux must be between 0 and 60000');
		}
		buffer.writeUInt16LE(payload.Lux);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xb3_0x67
	if ('temperature_collection_anomaly' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb3);
		buffer.writeUInt8(0x67);
		// 0:collect abnormal, 1:collect out of range
		buffer.writeUInt8(payload.temperature_collection_anomaly.type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xb4_0x68
	if ('humidity_collection_anomaly' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb4);
		buffer.writeUInt8(0x68);
		// 0:collect abnormal
		buffer.writeUInt8(payload.humidity_collection_anomaly.type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xb6_0xcb
	if ('illuminace_collection_anomaly' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb6);
		buffer.writeUInt8(0xcb);
		// 0:collect abnormal
		buffer.writeUInt8(payload.illuminace_collection_anomaly.type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xb6_0x9d
	if ('Lux_collection_anomaly' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb6);
		buffer.writeUInt8(0x9d);
		// 0:collect abnormal, 1:collect out of range
		buffer.writeUInt8(payload.Lux_collection_anomaly.type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x83_0x67
	if ('temperature_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x83);
		buffer.writeUInt8(0x67);
		buffer.writeInt16LE(payload.temperature_alarm.temperature * 10);
		// 16:below alarm released, 17:below alarm, 18:above alarm released, 19:above alarm, 20:within alarm released, 21:within alarm, 22:exceed tolerance alarm released, 23:exceed tolerance alarm
		buffer.writeUInt8(payload.temperature_alarm.alarm_type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x86_0x9d
	if ('Lux_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x86);
		buffer.writeUInt8(0x9d);
		buffer.writeUInt16LE(payload.Lux_alarm.Lux);
		// 16:dim, 17:bright
		buffer.writeUInt8(payload.Lux_alarm.alarm_type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x20_0xce
	if ('historical_data_retrieval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x20);
		buffer.writeUInt8(0xce);
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
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x21_0xce
	if ('historical_data_retrieval_Lux' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x21);
		buffer.writeUInt8(0xce);
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
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf9_0xbd
	if ('reporting_interval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xf9);
		buffer.writeUInt8(0xbd);
		// 0:second, 1:minute
		buffer.writeUInt8(1);
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
		buffer.writeUInt8(0);
		// 0:second, 1:minute
		buffer.writeUInt8(1);
		if (payload.collecting_interval.interval < 1 || payload.collecting_interval.interval > 1440) {
			throw new Error('collecting_interval.interval must be between 1 and 1440');
		}
		buffer.writeUInt16LE(payload.collecting_interval.interval);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf9_0xc0 // temperature_unit.sensor_id
	if ('temperature_unit' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xf9);
		buffer.writeUInt8(0xc0);
		// 0:temperature, 1:Illuminance
		buffer.writeUInt8(0);
		// 0:celsius, 1:fahrenheit
		buffer.writeUInt8(payload.temperature_unit.unit);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf9_0xc0 // illuminance_mode.sensor_id
	if ('illuminance_mode' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xf9);
		buffer.writeUInt8(0xc0);
		// 0:temperature, 1:Illuminance
		buffer.writeUInt8(1);
		// 0:illuminance level, 1:illuminance value
		buffer.writeUInt8(payload.illuminance_mode.mode);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf9_0xbc // pir_trigger_report.type
	if ('pir_trigger_report' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xf9);
		buffer.writeUInt8(0xbc);
		// 0:trigger report, 1:vacant report
		buffer.writeUInt8(0);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.pir_trigger_report.enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf9_0xbc // pir_idle_report.type
	if ('pir_idle_report' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xf9);
		buffer.writeUInt8(0xbc);
		// 0:trigger report, 1:vacant report
		buffer.writeUInt8(1);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.pir_idle_report.enable);
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
		buffer.writeUInt8(0xff);
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
		"pir_status_change": "05_0x00",
		"temperature_collection_anomaly": "b3_0x67",
		"humidity_collection_anomaly": "b4_0x68",
		"illuminace_collection_anomaly": "b6_0xcb",
		"Lux_collection_anomaly": "b6_0x9d",
		"temperature_alarm": "83_0x67",
		"Lux_alarm": "86_0x9d",
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
		"pir_enable": "ff_0x18",
		"pir_trigger_report": "f9_0xbc",
		"pir_idle_interval": "ff_0x95",
		"illuminance_alarm_rule": "f9_0xbf",
		"temperature_calibration_settings": "ff_0xea",
		"d2d_sending": "f9_0x63",
		"d2d_master_enable": "f9_0x66",
		"d2d_master_settings": "ff_0x96",
		"d2d_master_settings._item": "ff_0x96xx",
		"data_storage_enable": "ff_0x68",
		"retransmission_enable": "ff_0x69",
		"retransmission_interval": "ff_0x6a",
		"clear_historical_data": "ff_0x27",
		"retrival_historical_data_by_time": "fd_0x6b",
		"retrival_historical_data_by_time_range": "fd_0x6c",
		"stop_historical_data_retrival": "fd_0x6d",
		"reboot": "ff_0x10",
		"synchronize_time": "ff_0x4a"
	};
}
