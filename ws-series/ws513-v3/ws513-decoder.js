/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product WS513
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
						decoded.device_status = 0x01;
						counterObj.i++;
						break;
					case 0x01:
						decoded.ipso_version = readProtocolVersion(readBytes(bytes, counterObj, 1));
						break;
					case 0x16:
						decoded.sn = readHexString(bytes, counterObj, 8);
						break;
					case 0x09:
						decoded.hardware_version = readHardwareVersion(readBytes(bytes, counterObj, 2));
						break;
					case 0x0a:
						decoded.firmware_version = readFirmwareVersion(readBytes(bytes, counterObj, 2));
						break;
					case 0x0f:
						// 2:class_c
						decoded.lorawan_class = readUInt8(bytes, counterObj, 1);
						break;
					case 0x8e:
						decoded.reporting_interval_settings = decoded.reporting_interval_settings || {};
						counterObj.i++;
						decoded.reporting_interval_settings.time = readUInt16LE(bytes, counterObj, 2);
						break;
					case 0x26:
						// 0：disable, 1：enable
						decoded.power_consumption_enable = readUInt8(bytes, counterObj, 1);
						break;
					case 0x2f:
						// 0：disable, 1：enable
						decoded.led_indicator_mode = readUInt8(bytes, counterObj, 1);
						break;
					case 0x67:
						// 2：Return to Previous Working State, 0：Turn to Off, 1：Turn to On
						decoded.power_switch_mode = readUInt8(bytes, counterObj, 1);
						break;
					case 0x24:
						decoded.overcurrent_alarm_settings = decoded.overcurrent_alarm_settings || {};
						// 0：disable, 1：enable
						decoded.overcurrent_alarm_settings.enable = readUInt8(bytes, counterObj, 1);
						decoded.overcurrent_alarm_settings.threshold = readUInt8(bytes, counterObj, 1);
						break;
					case 0x30:
						decoded.overcurrent_protection = decoded.overcurrent_protection || {};
						// 0：disable, 1：enable
						decoded.overcurrent_protection.enable = readUInt8(bytes, counterObj, 1);
						decoded.overcurrent_protection.threshold = readUInt8(bytes, counterObj, 1);
						break;
					case 0x8d:
						decoded.high_current_protection = decoded.high_current_protection || {};
						// 0：disable, 1：enable
						decoded.high_current_protection.enable = readUInt8(bytes, counterObj, 1);
						break;
					case 0xab:
						decoded.temperature_calibration_settings = decoded.temperature_calibration_settings || {};
						// 0：disable, 1：enable
						decoded.temperature_calibration_settings.enable = readUInt8(bytes, counterObj, 1);
						decoded.temperature_calibration_settings.value = readInt16LE(bytes, counterObj, 2) / 10;
						break;
					case 0xbd:
						decoded.time_zone = readInt16LE(bytes, counterObj, 2);
						break;
					case 0xc7:
						decoded.d2d_settings = decoded.d2d_settings || {};
						var bitOptions = readUInt8(bytes, counterObj, 1);
						// 0：disable, 1：enable
						decoded.d2d_settings.d2d_agent_enable = extractBits(bitOptions, 1, 2);
						break;
					case 0x83:
						decoded.d2d_agent_settings_array = decoded.d2d_agent_settings_array || [];
						var d2d_agent_id = readUInt8(bytes, counterObj, 1);
						var d2d_agent_settings_array_item = pickArrayItem(decoded.d2d_agent_settings_array, d2d_agent_id, 'd2d_agent_id');
						d2d_agent_settings_array_item.d2d_agent_id = d2d_agent_id;
						insertArrayItem(decoded.d2d_agent_settings_array, d2d_agent_settings_array_item, 'd2d_agent_id');
						// 0：disable, 1：enable
						d2d_agent_settings_array_item.d2d_agent_enable = readUInt8(bytes, counterObj, 1);
						d2d_agent_settings_array_item.d2d_agent_command = readHexStringLE(bytes, counterObj, 2);
						// 1:On, 0:Off,       2:Inverse
						d2d_agent_settings_array_item.d2d_agent_action = readUInt8(bytes, counterObj, 1);
						break;
					case 0x29:
						decoded.set_socket = decoded.set_socket || {};
						var bitOptions = readUInt8(bytes, counterObj, 1);
						// 0：off, 1：on
						decoded.set_socket.status_1 = extractBits(bitOptions, 0, 1);
						break;
					case 0xa5:
						decoded.invert_socket_status = readUInt8(bytes, counterObj, 1);
						break;
					case 0x28:
						decoded.query_device_status = readUInt8(bytes, counterObj, 1);
						break;
					case 0x27:
						decoded.clear_power_consumption = readUInt8(bytes, counterObj, 1);
						break;
					case 0x10:
						decoded.reboot = readUInt8(bytes, counterObj, 1);
						break;
					case 0xfe:
						decoded.reset_event = readUInt8(bytes, counterObj, 1);
						break;
					case 0xff:
						decoded.tsl_version = readTslVersion(readBytes(bytes, counterObj, 2));
						break;
				}
				break;
			case 0x03:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0x74:
						decoded.voltage = readUInt16LE(bytes, counterObj, 2);
						break;
				}
				break;
			case 0x04:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0x80:
						decoded.electric_power = readUInt32LE(bytes, counterObj, 4);
						break;
				}
				break;
			case 0x05:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0x81:
						decoded.power_factor = readUInt8(bytes, counterObj, 1);
						break;
				}
				break;
			case 0x06:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0x83:
						decoded.power_consumption = readUInt32LE(bytes, counterObj, 4) / 1000;
						break;
				}
				break;
			case 0x07:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0xc9:
						decoded.current_rating = readUInt16LE(bytes, counterObj, 2) / 1000;
						break;
				}
				break;
			case 0x09:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0x67:
						var temperature_value = readUInt16LE(bytes, counterObj, 2);
						if (temperature_value === 0xffff) {
							decoded.temperature_error = readSensorStatus(1);
						} else if (temperature_value === 0xfffd) {
							decoded.temperature_error = readSensorStatus(2);
						} else {
							counterObj.i -= 2;
							decoded.temperature = readInt16LE(bytes, counterObj, 2) / 10;
						}
						break;
				}
				break;
			case 0x08:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0x70:
						decoded.socket_status = decoded.socket_status || {};
						var bitOptions = readUInt8(bytes, counterObj, 1);
						// 0：off, 1：on
						decoded.socket_status.switch_status_1 = extractBits(bitOptions, 0, 1);
						break;
				}
				break;
			case 0x89:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0x67:
						decoded.temperature_alarm = decoded.temperature_alarm || {};
						decoded.temperature_alarm.temperature = readInt16LE(bytes, counterObj, 2) / 10;
						// 0: temperature alarm release, 1: temperature alarm, 2: overheat alarm
						decoded.temperature_alarm.alarm_type = readUInt8(bytes, counterObj, 1);
						break;
				}
				break;
			case 0x87:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0xc9:
						decoded.overcurrent_alarm = decoded.overcurrent_alarm || {};
						decoded.overcurrent_alarm.current = readUInt16LE(bytes, counterObj, 2) / 1000;
						// 1：Overcurrent alarm, 0:Overcurrent alarm release
						decoded.overcurrent_alarm.status = readUInt8(bytes, counterObj, 1);
						break;
				}
				break;
			case 0x88:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0x29:
						decoded.device_abnormal_alarm = decoded.device_abnormal_alarm || {};
						// 1：Abnormal
						decoded.device_abnormal_alarm.status = readUInt8(bytes, counterObj, 1);
						break;
				}
				break;
			case 0xb3:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0x74:
						decoded.voltage_collection_error_report = decoded.voltage_collection_error_report || {};
						// 1：Collect_error
						decoded.voltage_collection_error_report.type = readUInt8(bytes, counterObj, 1);
						break;
				}
				break;
			case 0xb4:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0x80:
						decoded.electric_power_collection_error_report = decoded.electric_power_collection_error_report || {};
						// 1：Collect_error
						decoded.electric_power_collection_error_report.type = readUInt8(bytes, counterObj, 1);
						break;
				}
				break;
			case 0xb5:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0x81:
						decoded.power_factor_collection_error_report = decoded.power_factor_collection_error_report || {};
						// 1：Collect_error
						decoded.power_factor_collection_error_report.type = readUInt8(bytes, counterObj, 1);
						break;
				}
				break;
			case 0xb6:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0x83:
						decoded.power_consumption_collection_error_report = decoded.power_consumption_collection_error_report || {};
						// 1：Collect_error
						decoded.power_consumption_collection_error_report.type = readUInt8(bytes, counterObj, 1);
						break;
				}
				break;
			case 0xb7:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0xc9:
						decoded.current_collection_error_report = decoded.current_collection_error_report || {};
						// 1：Collect_error
						decoded.current_collection_error_report.type = readUInt8(bytes, counterObj, 1);
						break;
				}
				break;
			case 0xf9:
				var ipso_type_v1 = bytes[counterObj.i++];
				switch (ipso_type_v1) {
					case 0x67:
						decoded.schedule_report = decoded.schedule_report || [];
						// 1:1;, 2:2;, 3:3;, 4:4;, 5:5;, 6:6;, 7:7;, 8:8;, 9:9;, 10:10;, 11:11;, 12:12;, 13:13;, 14:14;, 15:15;, 16:16;
						var schedule_id = readUInt8(bytes, counterObj, 1);
						var schedule_report_item = pickArrayItem(decoded.schedule_report, schedule_id, 'schedule_id');
						schedule_report_item.schedule_id = schedule_id;
						insertArrayItem(decoded.schedule_report, schedule_report_item, 'schedule_id');
						var bitOptions = readUInt8(bytes, counterObj, 1);
						// 0:Not config;, 1:Enable;, 2:Disable;
						schedule_report_item.enable = extractBits(bitOptions, 0, 4);
						schedule_report_item.use_config = extractBits(bitOptions, 4, 8);
						var bitOptions = readUInt8(bytes, counterObj, 1);
						// 0: Disable;, 1: Enable;
						schedule_report_item.execution_day_mon = extractBits(bitOptions, 0, 1);
						// 0: Disable;, 1: Enable;
						schedule_report_item.execution_day_tues = extractBits(bitOptions, 1, 2);
						// 0: Disable;, 1: Enable;
						schedule_report_item.execution_day_wed = extractBits(bitOptions, 2, 3);
						// 0: Disable;, 1: Enable;
						schedule_report_item.execution_day_thu = extractBits(bitOptions, 3, 4);
						// 0: Disable;, 1: Enable;
						schedule_report_item.execution_day_fri = extractBits(bitOptions, 4, 5);
						// 0: Disable;, 1: Enable;
						schedule_report_item.execution_day_sat = extractBits(bitOptions, 5, 6);
						// 0: Disable;, 1: Enable;
						schedule_report_item.execution_day_sun = extractBits(bitOptions, 6, 7);
						schedule_report_item.execut_hour = readUInt8(bytes, counterObj, 1);
						schedule_report_item.execut_min = readUInt8(bytes, counterObj, 1);
						// 1:On;, 2:Off;, 3:Inverse, 0:Keep;
						schedule_report_item.button_status = readUInt8(bytes, counterObj, 1);
						// 1:Lock;, 2:Unlock;, 0:Keep;
						schedule_report_item.lock_status = readUInt8(bytes, counterObj, 1);
						break;
					case 0xca:
						decoded.bluetooth_name = readString(bytes, counterObj, 13);
						break;
					case 0x69:
						decoded.button_lock_settings = decoded.button_lock_settings || {};
						var bitOptions = readUInt8(bytes, counterObj, 1);
						// 0：Disable, 1：Enable
						decoded.button_lock_settings.switch_config = extractBits(bitOptions, 0, 1);
						// 0：Disable, 1：Enable
						decoded.button_lock_settings.reset_config = extractBits(bitOptions, 1, 2);
						break;
					case 0x0b:
						decoded.temperature_alarm_rule = decoded.temperature_alarm_rule || {};
						counterObj.i++;
						// 0：disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A<x<B, 4:condition: x<A or x>B
						decoded.temperature_alarm_rule.condition = readUInt8(bytes, counterObj, 1);
						decoded.temperature_alarm_rule.threshold_max = readInt16LE(bytes, counterObj, 2) / 10;
						decoded.temperature_alarm_rule.threshold_min = readInt16LE(bytes, counterObj, 2) / 10;
						// 0: Disable;, 1: Enable;
						decoded.temperature_alarm_rule.threshold_enable = readUInt8(bytes, counterObj, 1);
						break;
					case 0xb6:
						decoded.alarm_settings = decoded.alarm_settings || {};
						decoded.alarm_settings.alarm_interval = readUInt16LE(bytes, counterObj, 2) / 1;
						decoded.alarm_settings.alarm_count = readUInt16LE(bytes, counterObj, 2) / 1;
						// 0: Disable;, 1: Enable;
						decoded.alarm_settings.release_enable = readUInt8(bytes, counterObj, 1);
						break;
					case 0x64:
						decoded.schedule_settings = decoded.schedule_settings || [];
						// 1:1;, 2:2;, 3:3;, 4:4;, 5:5;, 6:6;, 7:7;, 8:8;, 9:9;, 10:10;, 11:11;, 12:12;, 13:13;, 14:14;, 15:15;, 16:16;
						var schedule_id = readUInt8(bytes, counterObj, 1);
						var schedule_settings_item = pickArrayItem(decoded.schedule_settings, schedule_id, 'schedule_id');
						schedule_settings_item.schedule_id = schedule_id;
						insertArrayItem(decoded.schedule_settings, schedule_settings_item, 'schedule_id');
						var bitOptions = readUInt8(bytes, counterObj, 1);
						// 0:Not config;, 1:Enable;, 2:Disable;
						schedule_settings_item.enable = extractBits(bitOptions, 0, 4);
						schedule_settings_item.use_config = extractBits(bitOptions, 4, 8);
						var bitOptions = readUInt8(bytes, counterObj, 1);
						// 0: Disable;, 1: Enable;
						schedule_settings_item.execution_day_mon = extractBits(bitOptions, 0, 1);
						// 0: Disable;, 1: Enable;
						schedule_settings_item.execution_day_tues = extractBits(bitOptions, 1, 2);
						// 0: Disable;, 1: Enable;
						schedule_settings_item.execution_day_wed = extractBits(bitOptions, 2, 3);
						// 0: Disable;, 1: Enable;
						schedule_settings_item.execution_day_thu = extractBits(bitOptions, 3, 4);
						// 0: Disable;, 1: Enable;
						schedule_settings_item.execution_day_fri = extractBits(bitOptions, 4, 5);
						// 0: Disable;, 1: Enable;
						schedule_settings_item.execution_day_sat = extractBits(bitOptions, 5, 6);
						// 0: Disable;, 1: Enable;
						schedule_settings_item.execution_day_sun = extractBits(bitOptions, 6, 7);
						schedule_settings_item.execution_hour = readUInt8(bytes, counterObj, 1);
						schedule_settings_item.execution_min = readUInt8(bytes, counterObj, 1);
						// 1:On;, 2:Off;, 3:Inverse, 0:Keep;
						schedule_settings_item.button_status_1 = readUInt8(bytes, counterObj, 1);
						// 1:Lock;, 2:Unlock;, 0:Keep;
						schedule_settings_item.lock_status = readUInt8(bytes, counterObj, 1);
						break;
					case 0x72:
						decoded.daylight_saving_time = decoded.daylight_saving_time || {};
						var bitOptions = readUInt8(bytes, counterObj, 1);
						// 0：Disable, 1：Enable
						decoded.daylight_saving_time.enable = extractBits(bitOptions, 7, 8);
						decoded.daylight_saving_time.dst_bias = extractBits(bitOptions, 0, 7);
						// 1:Jan., 2:Feb., 3:Mar., 4:Apr., 5:May, 6:Jun., 7:Jul., 8:Aug., 9:Sep., 10:Oct., 11:Nov., 12:Dec.
						decoded.daylight_saving_time.start_month = readUInt8(bytes, counterObj, 1);
						var bitOptions = readUInt8(bytes, counterObj, 1);
						// 1:1st, 2: 2nd, 3: 3rd, 4: 4th, 5: last
						decoded.daylight_saving_time.start_week_num = extractBits(bitOptions, 4, 8);
						// 1：Mon., 2：Tues., 3：Wed., 4：Thurs., 5：Fri., 6：Sat., 7：Sun.
						decoded.daylight_saving_time.start_week_day = extractBits(bitOptions, 0, 4);
						decoded.daylight_saving_time.start_hour_min = readUInt16LE(bytes, counterObj, 2);
						// 1:Jan., 2:Feb., 3:Mar., 4:Apr., 5:May, 6:Jun., 7:Jul., 8:Aug., 9:Sep., 10:Oct., 11:Nov., 12:Dec.
						decoded.daylight_saving_time.end_month = readUInt8(bytes, counterObj, 1);
						var bitOptions = readUInt8(bytes, counterObj, 1);
						// 1:1st, 2: 2nd, 3: 3rd, 4: 4th, 5: last
						decoded.daylight_saving_time.end_week_num = extractBits(bitOptions, 4, 8);
						// 1：Mon., 2：Tues., 3：Wed., 4：Thurs., 5：Fri., 6：Sat., 7：Sun.
						decoded.daylight_saving_time.end_week_day = extractBits(bitOptions, 0, 4);
						decoded.daylight_saving_time.end_hour_min = readUInt16LE(bytes, counterObj, 2);
						break;
					case 0x65:
						decoded.get_schedule = decoded.get_schedule || {};
						decoded.get_schedule.schedule_id = readUInt8(bytes, counterObj, 1);
						break;
					case 0xc6:
						decoded.lora_tx_rdt_max = readUInt16LE(bytes, counterObj, 2);
						break;
				}
				break;
			default:
				unknown_command = 1;
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
	return 'v0.' + major;
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

function readTslVersion(bytes) {
    var major = bytes[0] & 0xff;
    var minor = bytes[1] & 0xff;
    return "v" + major + "." + minor;
}

function readSensorStatus(status) {
    var status_map = { 1: "sensor not recognized", 2: "out of range" };
    return status_map[status];
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
		  "ff_0x0b": "device_status",
		  "ff_0x01": "ipso_version",
		  "ff_0x16": "sn",
		  "ff_0x09": "hardware_version",
		  "ff_0x0a": "firmware_version",
		  "ff_0x0f": "lorawan_class",
		  "03_0x74": "voltage",
		  "04_0x80": "electric_power",
		  "05_0x81": "power_factor",
		  "06_0x83": "power_consumption",
		  "07_0xc9": "current_rating",
		  "09_0x67": "temperature",
		  "08_0x70": "socket_status",
		  "89_0x67": "temperature_alarm",
		  "87_0xc9": "overcurrent_alarm",
		  "88_0x29": "device_abnormal_alarm",
		  "b3_0x74": "voltage_collection_error_report",
		  "b4_0x80": "electric_power_collection_error_report",
		  "b5_0x81": "power_factor_collection_error_report",
		  "b6_0x83": "power_consumption_collection_error_report",
		  "b7_0xc9": "current_collection_error_report",
		  "f9_0x67": "schedule_report",
		  "f9_0x67xx": "schedule_report._item",
		  "ff_0x8e": "reporting_interval_settings",
		  "ff_0x26": "power_consumption_enable",
		  "ff_0x2f": "led_indicator_mode",
		  "ff_0x67": "power_switch_mode",
		  "ff_0xc6": "lora_tx_rdt_max",
		  "f9_0xca": "bluetooth_name",
		  "f9_0x69": "button_lock_settings",
		  "ff_0x24": "overcurrent_alarm_settings",
		  "ff_0x30": "overcurrent_protection",
		  "ff_0x8d": "high_current_protection",
		  "f9_0x0b": "temperature_alarm_rule",
		  "f9_0xb6": "alarm_settings",
		  "ff_0xab": "temperature_calibration_settings",
		  "f9_0x64": "schedule_settings",
		  "f9_0x64xx": "schedule_settings._item",
		  "ff_0xbd": "time_zone",
		  "f9_0x72": "daylight_saving_time",
		  "ff_0xc7": "d2d_settings",
		  "ff_0x83": "d2d_agent_settings_array",
		  "ff_0x83xx": "d2d_agent_settings_array._item",
		  "f9_0x65": "get_schedule",
		  "ff_0x29": "set_socket",
		  "ff_0xa5": "invert_socket_status",
		  "ff_0x28": "query_device_status",
		  "ff_0x27": "clear_power_consumption",
		  "ff_0x10": "reboot",
		  "ff_0xfe": "reset_event"
	};
}
function processTemperature(decoded) {
	var allTemperatureProperties = {
    "temperature": {
        "precision": 1
    },
    "temperature_alarm.temperature": {
        "precision": 1
    },
    "temperature_alarm_rule.threshold_min": {
        "precision": 1
    },
    "temperature_alarm_rule.threshold_max": {
        "precision": 1
    },
    "temperature_calibration_settings.value": {
        "precision": 1
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