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
					case 0xfe:
						decoded.request_tsl_config = readUInt8(bytes, counterObj, 1);
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
					case 0xf2:
						decoded.alarm_reporting_times = readUInt16LE(bytes, counterObj, 2);
						break;
					case 0xf5:
						// 0: disable, 1: enable
						decoded.alarm_deactivation_enable = readUInt8(bytes, counterObj, 1);
						break;
					case 0x2e:
						// 0：disable, 2：enable
						decoded.led_mode = readUInt8(bytes, counterObj, 1);
						break;
					case 0x25:
						decoded.button_lock = decoded.button_lock || {};
						var bitOptions = readUInt8(bytes, counterObj, 1);
						// 0：disable, 1：enable
						decoded.button_lock.power_off = extractBits(bitOptions, 0, 1);
						// 0：disable, 1：enable
						decoded.button_lock.power_on = extractBits(bitOptions, 1, 2);
						break;
					case 0x06:
						decoded.temperature_alarm_rule = decoded.temperature_alarm_rule || {};
						var bitOptions = readUInt8(bytes, counterObj, 1);
						// 0：disable, 1：enable
						decoded.temperature_alarm_rule.enable = extractBits(bitOptions, 6, 7);
						// 1:condition: x<A, 2:condition: x>B, 3:condition: A<x<B, 4:condition: x<A or x>B
						decoded.temperature_alarm_rule.condition = extractBits(bitOptions, 0, 3);
						decoded.temperature_alarm_rule.id = extractBits(bitOptions, 3, 6);
						decoded.temperature_alarm_rule.threshold_max = readInt16LE(bytes, counterObj, 2) / 10;
						decoded.temperature_alarm_rule.threshold_min = readInt16LE(bytes, counterObj, 2) / 10;
						decoded.temperature_alarm_rule.threshold_lock_time = readUInt16LE(bytes, counterObj, 2);
						decoded.temperature_alarm_rule.threshold_continue_time = readUInt16LE(bytes, counterObj, 2);
						break;
					case 0x18:
						var fixed_value = bytes[counterObj.i + 0];
						switch (fixed_value) {
							case 3: // pir_enable.sensor_id
								decoded.pir_enable = decoded.pir_enable || {};
								// 1:temperature, 2:humidity, 3:PIR, 4:Illuminance, 5:CO₂
								decoded.pir_enable.sensor_id = readUInt8(bytes, counterObj, 1);
								var bitOptions = readUInt8(bytes, counterObj, 1);
								// 0：disable, 1：enable
								decoded.pir_enable.enable = extractBits(bitOptions, 2, 3);
								decoded.pir_enable.sensor_id = undefined;
								break;
							case 4: // illuminance_collecting_enable.sensor_id
								decoded.illuminance_collecting_enable = decoded.illuminance_collecting_enable || {};
								// 1:temperature, 2:humidity, 3:PIR, 4:Illuminance, 5:CO₂
								decoded.illuminance_collecting_enable.sensor_id = readUInt8(bytes, counterObj, 1);
								var bitOptions = readUInt8(bytes, counterObj, 1);
								// 0：disable, 1：enable
								decoded.illuminance_collecting_enable.enable = extractBits(bitOptions, 3, 4);
								decoded.illuminance_collecting_enable.sensor_id = undefined;
								break;
						}
						break;
					case 0x95:
						decoded.pir_idle_interval = readUInt16LE(bytes, counterObj, 2);
						break;
					case 0xea:
						var fixed_value = (bytes[counterObj.i + 0] >> 0) & 0x7f;
						switch (fixed_value) {
							case 0: // temperature_calibration_settings.id
								decoded.temperature_calibration_settings = decoded.temperature_calibration_settings || {};
								var bitOptions = readUInt8(bytes, counterObj, 1);
								// 0:temperature, 1:humidity, 2:CO₂
								decoded.temperature_calibration_settings.id = extractBits(bitOptions, 0, 7);
								// 0: disable, 1: enable
								decoded.temperature_calibration_settings.enable = extractBits(bitOptions, 7, 8);
								decoded.temperature_calibration_settings.value = readInt16LE(bytes, counterObj, 2) / 10;
								decoded.temperature_calibration_settings.id = undefined;
								break;
							case 1: // humidity_calibration_settings.id
								decoded.humidity_calibration_settings = decoded.humidity_calibration_settings || {};
								var bitOptions = readUInt8(bytes, counterObj, 1);
								// 0:temperature, 1:humidity, 2:CO₂
								decoded.humidity_calibration_settings.id = extractBits(bitOptions, 0, 7);
								// 0: disable, 1: enable
								decoded.humidity_calibration_settings.enable = extractBits(bitOptions, 7, 8);
								decoded.humidity_calibration_settings.value = readInt16LE(bytes, counterObj, 2) / 2;
								decoded.humidity_calibration_settings.id = undefined;
								break;
						}
						break;
					case 0x96:
						decoded.d2d_master_settings = decoded.d2d_master_settings || [];
						// 0:PIR Trigger, 1:PIR Vacant, 2:Illuminance Bright, 3:Illuminance Dim, 4:Trigger/Bright, 5:Trigger/Dim
						var trigger_condition = readUInt8(bytes, counterObj, 1);
						var d2d_master_settings_item = pickArrayItem(decoded.d2d_master_settings, trigger_condition, 'trigger_condition');
						d2d_master_settings_item.trigger_condition = trigger_condition;
						insertArrayItem(decoded.d2d_master_settings, d2d_master_settings_item, 'trigger_condition');
						// 0：disable, 1：enable
						d2d_master_settings_item.enable = readUInt8(bytes, counterObj, 1);
						// 0：disable, 1：enable
						d2d_master_settings_item.lora_uplink_enable = readUInt8(bytes, counterObj, 1);
						d2d_master_settings_item.control_command = readHexString(bytes, counterObj, 2);
						// 0：disable, 1：enable
						d2d_master_settings_item.control_time_enable = readUInt8(bytes, counterObj, 1);
						d2d_master_settings_item.control_time = readUInt16LE(bytes, counterObj, 2);
						break;
					case 0x68:
						decoded.data_storage_enable = decoded.data_storage_enable || {};
						// 0：disable, 1：enable
						decoded.data_storage_enable.enable = readUInt8(bytes, counterObj, 1);
						break;
					case 0x69:
						decoded.retransmission_enable = decoded.retransmission_enable || {};
						// 0：disable, 1：enable
						decoded.retransmission_enable.enable = readUInt8(bytes, counterObj, 1);
						break;
					case 0x6a:
						var fixed_value = bytes[counterObj.i + 0];
						switch (fixed_value) {
							case 0: // retransmission_interval.type
								decoded.retransmission_interval = decoded.retransmission_interval || {};
								// 0: retransmission interval, 1: retrival interval
								decoded.retransmission_interval.type = readUInt8(bytes, counterObj, 1);
								decoded.retransmission_interval.interval = readUInt16LE(bytes, counterObj, 2);
								decoded.retransmission_interval.type = undefined;
								break;
							case 1: // retrival_interval.type
								decoded.retrival_interval = decoded.retrival_interval || {};
								// 0: retransmission interval, 1: retrival interval
								decoded.retrival_interval.type = readUInt8(bytes, counterObj, 1);
								decoded.retrival_interval.interval = readUInt16LE(bytes, counterObj, 2);
								decoded.retrival_interval.type = undefined;
								break;
						}
						break;
					case 0x27:
						decoded.clear_historical_data = readUInt8(bytes, counterObj, 1);
						break;
					case 0x10:
						decoded.reboot = readUInt8(bytes, counterObj, 1);
						break;
					case 0x4a:
						decoded.synchronize_time = readUInt8(bytes, counterObj, 1);
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
						decoded.temperature = readInt16LE(bytes, counterObj, 2) / 10;
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
			case 0x05:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0x9f:
						decoded.pir = decoded.pir || {};
						var bitOptions = readUInt16LE(bytes, counterObj, 2);
						decoded.pir.pir_status = extractBits(bitOptions, 15, 16);
						decoded.pir.pir_count = extractBits(bitOptions, 0, 15);
						break;
					case 0x00:
						decoded.pir_status_change = decoded.pir_status_change || {};
						// 0:vacant, 1:trigger
						decoded.pir_status_change.status = readUInt8(bytes, counterObj, 1);
						decoded.pir = decoded.pir || {};
						decoded.pir.pir_status = decoded.pir_status_change.status;
						break;
				}
				break;
			case 0x06:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0xcb:
						decoded.als_level = readUInt8(bytes, counterObj, 1);
						break;
					case 0x9d:
						decoded.Lux = readUInt16LE(bytes, counterObj, 2);
						break;
				}
				break;
			case 0xb3:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0x67:
						decoded.temperature_collection_anomaly = decoded.temperature_collection_anomaly || {};
						// 0:collect abnormal, 1:collect out of range
						decoded.temperature_collection_anomaly.type = readUInt8(bytes, counterObj, 1);
						break;
				}
				break;
			case 0xb4:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0x68:
						decoded.humidity_collection_anomaly = decoded.humidity_collection_anomaly || {};
						// 0:collect abnormal
						decoded.humidity_collection_anomaly.type = readUInt8(bytes, counterObj, 1);
						break;
				}
				break;
			case 0xb6:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0xcb:
						decoded.illuminace_collection_anomaly = decoded.illuminace_collection_anomaly || {};
						// 0:collect abnormal
						decoded.illuminace_collection_anomaly.type = readUInt8(bytes, counterObj, 1);
						break;
					case 0x9d:
						decoded.Lux_collection_anomaly = decoded.Lux_collection_anomaly || {};
						// 0:collect abnormal, 1:collect out of range
						decoded.Lux_collection_anomaly.type = readUInt8(bytes, counterObj, 1);
						break;
				}
				break;
			case 0x83:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0x67:
						decoded.temperature_alarm = decoded.temperature_alarm || {};
						decoded.temperature_alarm.temperature = readInt16LE(bytes, counterObj, 2) / 10;
						decoded.temperature = decoded.temperature_alarm.temperature;
						// 16:below alarm released, 17:below alarm, 18:above alarm released, 19:above alarm, 20:within alarm released, 21:within alarm, 22:exceed tolerance alarm released, 23:exceed tolerance alarm
						decoded.temperature_alarm.alarm_type = readUInt8(bytes, counterObj, 1);
						break;
				}
				break;
			case 0x86:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0x9d:
						decoded.Lux_alarm = decoded.Lux_alarm || {};
						decoded.Lux_alarm.Lux = readUInt16LE(bytes, counterObj, 2);
						decoded.Lux = decoded.Lux_alarm.Lux;
						// 16:dim, 17:bright
						decoded.Lux_alarm.alarm_type = readUInt8(bytes, counterObj, 1);
						break;
				}
				break;
			case 0x20:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0xce:
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
				}
				break;
			case 0x21:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0xce:
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
				}
				break;
			case 0xf9:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0xbd:
						decoded.reporting_interval = decoded.reporting_interval || {};
						// 0:second, 1:minute
						decoded.reporting_interval.unit = readUInt8(bytes, counterObj, 1);
						decoded.reporting_interval.interval = readUInt16LE(bytes, counterObj, 2);
						break;
					case 0xbe:
						decoded.collecting_interval = decoded.collecting_interval || {};
						// 0:temperature,humidity,CO₂ collect interval, 1:illuminace collect interval
						decoded.collecting_interval.id = readUInt8(bytes, counterObj, 1);
						// 0:second, 1:minute
						decoded.collecting_interval.unit = readUInt8(bytes, counterObj, 1);
						decoded.collecting_interval.interval = readUInt16LE(bytes, counterObj, 2);
						break;
					case 0xc0:
						var fixed_value = bytes[counterObj.i + 0];
						switch (fixed_value) {
							case 0: // temperature_unit.sensor_id
								decoded.temperature_unit = decoded.temperature_unit || {};
								// 0:temperature, 1:Illuminance
								decoded.temperature_unit.sensor_id = readUInt8(bytes, counterObj, 1);
								// 0:celsius, 1:fahrenheit
								decoded.temperature_unit.unit = readUInt8(bytes, counterObj, 1);
								decoded.temperature_unit.sensor_id = undefined;
								break;
							case 1: // illuminance_mode.sensor_id
								decoded.illuminance_mode = decoded.illuminance_mode || {};
								// 0:temperature, 1:Illuminance
								decoded.illuminance_mode.sensor_id = readUInt8(bytes, counterObj, 1);
								// 0:illuminance level, 1:illuminance value
								decoded.illuminance_mode.mode = readUInt8(bytes, counterObj, 1);
								decoded.illuminance_mode.sensor_id = undefined;
								break;
						}
						break;
					case 0xbc:
						var fixed_value = bytes[counterObj.i + 0];
						switch (fixed_value) {
							case 0: // pir_trigger_report.type
								decoded.pir_trigger_report = decoded.pir_trigger_report || {};
								// 0:trigger report, 1:vacant report
								decoded.pir_trigger_report.type = readUInt8(bytes, counterObj, 1);
								// 0：disable, 1：enable
								decoded.pir_trigger_report.enable = readUInt8(bytes, counterObj, 1);
								decoded.pir_trigger_report.type = undefined;
								break;
							case 1: // pir_idle_report.type
								decoded.pir_idle_report = decoded.pir_idle_report || {};
								// 0:trigger report, 1:vacant report
								decoded.pir_idle_report.type = readUInt8(bytes, counterObj, 1);
								// 0：disable, 1：enable
								decoded.pir_idle_report.enable = readUInt8(bytes, counterObj, 1);
								decoded.pir_idle_report.type = undefined;
								break;
						}
						break;
					case 0xbf:
						decoded.illuminance_alarm_rule = decoded.illuminance_alarm_rule || {};
						// 0：disable, 1：enable
						decoded.illuminance_alarm_rule.enable = readUInt8(bytes, counterObj, 1);
						decoded.illuminance_alarm_rule.dim_value = readUInt16LE(bytes, counterObj, 2);
						decoded.illuminance_alarm_rule.bright_value = readUInt16LE(bytes, counterObj, 2);
						break;
					case 0x63:
						decoded.d2d_sending = decoded.d2d_sending || {};
						// 0：disable, 1：enable
						decoded.d2d_sending.enable = readUInt8(bytes, counterObj, 1);
						// 0：disable, 1：enable
						decoded.d2d_sending.lora_uplink_enable = readUInt8(bytes, counterObj, 1);
						var bitOptions = readUInt16LE(bytes, counterObj, 2);
						decoded.d2d_sending.temperature_enable = extractBits(bitOptions, 0, 1);
						decoded.d2d_sending.humidity_enable = extractBits(bitOptions, 1, 2);
						break;
					case 0x66:
						// 0：disable, 1：enable
						decoded.d2d_master_enable = readUInt8(bytes, counterObj, 1);
						break;
				}
				break;
			case 0xfd:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0x6b:
						decoded.retrival_historical_data_by_time = decoded.retrival_historical_data_by_time || {};
						decoded.retrival_historical_data_by_time.time = readUInt32LE(bytes, counterObj, 4);
						break;
					case 0x6c:
						decoded.retrival_historical_data_by_time_range = decoded.retrival_historical_data_by_time_range || {};
						decoded.retrival_historical_data_by_time_range.start_time = readUInt32LE(bytes, counterObj, 4);
						decoded.retrival_historical_data_by_time_range.end_time = readUInt32LE(bytes, counterObj, 4);
						break;
					case 0x6d:
						decoded.stop_historical_data_retrival = readUInt8(bytes, counterObj, 1);
						break;
				}
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

function cmdMap() {
	return {
		"ff_0x0b": "device_status",
		"ff_0x01": "ipso_version",
		"ff_0x16": "sn",
		"ff_0xff": "tsl_version",
		"ff_0xfe": "request_tsl_config",
		"ff_0x09": "hardware_version",
		"ff_0x0a": "firmware_version",
		"ff_0x0f": "lorawan_class",
		"01_0x75": "battery",
		"03_0x67": "temperature",
		"04_0x68": "humidity",
		"05_0x9f": "pir",
		"06_0xcb": "als_level",
		"06_0x9d": "Lux",
		"05_0x00": "pir_status_change",
		"b3_0x67": "temperature_collection_anomaly",
		"b4_0x68": "humidity_collection_anomaly",
		"b6_0xcb": "illuminace_collection_anomaly",
		"b6_0x9d": "Lux_collection_anomaly",
		"83_0x67": "temperature_alarm",
		"86_0x9d": "Lux_alarm",
		"20_0xce": "historical_data_retrieval",
		"21_0xce": "historical_data_retrieval_Lux",
		"f9_0xbd": "reporting_interval",
		"f9_0xbe": "collecting_interval",
		"ff_0xf2": "alarm_reporting_times",
		"ff_0xf5": "alarm_deactivation_enable",
		"f9_0xc0": "temperature_unit",
		"ff_0x2e": "led_mode",
		"ff_0x25": "button_lock",
		"ff_0x06": "temperature_alarm_rule",
		"ff_0x18": "pir_enable",
		"f9_0xbc": "pir_trigger_report",
		"ff_0x95": "pir_idle_interval",
		"f9_0xbf": "illuminance_alarm_rule",
		"ff_0xea": "temperature_calibration_settings",
		"f9_0x63": "d2d_sending",
		"f9_0x66": "d2d_master_enable",
		"ff_0x96": "d2d_master_settings",
		"ff_0x96xx": "d2d_master_settings._item",
		"ff_0x68": "data_storage_enable",
		"ff_0x69": "retransmission_enable",
		"ff_0x6a": "retransmission_interval",
		"ff_0x27": "clear_historical_data",
		"fd_0x6b": "retrival_historical_data_by_time",
		"fd_0x6c": "retrival_historical_data_by_time_range",
		"fd_0x6d": "stop_historical_data_retrival",
		"ff_0x10": "reboot",
		"ff_0x4a": "synchronize_time"
	};
}
