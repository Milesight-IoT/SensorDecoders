/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product WS515
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
	//0xff_0x08
	if ('sn' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x08);
		buffer.writeHexString(payload.sn, 6);
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
		// 2:class_c
		buffer.writeUInt8(payload.lorawan_class);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x8e
	if ('reporting_interval_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x8e);
		buffer.writeUInt8(0x00);
		if (payload.reporting_interval_settings.time < 1 || payload.reporting_interval_settings.time > 1440) {
			throw new Error('reporting_interval_settings.time must be between 1 and 1440');
		}
		buffer.writeUInt16LE(payload.reporting_interval_settings.time);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x26
	if ('power_consumption_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x26);
		if (payload.power_consumption_enable < 0 || payload.power_consumption_enable > 1) {
			throw new Error('power_consumption_enable must be between 0 and 1');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.power_consumption_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x2f
	if ('led_indicator_mode' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x2f);
		if (payload.led_indicator_mode < 0 || payload.led_indicator_mode > 1) {
			throw new Error('led_indicator_mode must be between 0 and 1');
		}
		buffer.writeUInt8(payload.led_indicator_mode);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x67
	if ('power_switch_mode' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x67);
		if (payload.power_switch_mode < 0 || payload.power_switch_mode > 2) {
			throw new Error('power_switch_mode must be between 0 and 2');
		}
		// 2：Return to Previous Working State, 0：Turn to Off, 1：Turn to On
		buffer.writeUInt8(payload.power_switch_mode);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x24
	if ('overcurrent_alarm_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x24);
		if (payload.overcurrent_alarm_settings.enable < 0 || payload.overcurrent_alarm_settings.enable > 1) {
			throw new Error('overcurrent_alarm_settings.enable must be between 0 and 1');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.overcurrent_alarm_settings.enable);
		if (payload.overcurrent_alarm_settings.threshold < 1 || payload.overcurrent_alarm_settings.threshold > 10) {
			throw new Error('overcurrent_alarm_settings.threshold must be between 1 and 10');
		}
		buffer.writeUInt8(payload.overcurrent_alarm_settings.threshold);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x30
	if ('overcurrent_protection_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x30);
		if (payload.overcurrent_protection_settings.enable < 0 || payload.overcurrent_protection_settings.enable > 1) {
			throw new Error('overcurrent_protection_settings.enable must be between 0 and 1');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.overcurrent_protection_settings.enable);
		if (payload.overcurrent_protection_settings.threshold < 1 || payload.overcurrent_protection_settings.threshold > 10) {
			throw new Error('overcurrent_protection_settings.threshold must be between 1 and 10');
		}
		buffer.writeUInt8(payload.overcurrent_protection_settings.threshold);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x8d // high_current_protection.enable
	if ('high_current_protection' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x8d);
		if (payload.high_current_protection.enable < 0 || payload.high_current_protection.enable > 1) {
			throw new Error('payload.high_current_protection.enable must be between 0 and 1');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.high_current_protection.enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0xab
	if ('temperature_calibration_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0xab);
		if (payload.temperature_calibration_settings.enable < 0 || payload.temperature_calibration_settings.enable > 1) {
			throw new Error('temperature_calibration_settings.enable must be between 0 and 1');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.temperature_calibration_settings.enable);
		if (payload.temperature_calibration_settings.value < -165 || payload.temperature_calibration_settings.value > 165) {
			throw new Error('temperature_calibration_settings.value must be between -165 and 165');
		}
		buffer.writeInt16LE(payload.temperature_calibration_settings.value * 10);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0xbd
	if ('time_zone' in payload) {
		var time_zone = payload.time_zone;
		var time_zone_map = { "-720": "UTC-12", "-660": "UTC-11", "-600": "UTC-10", "-570": "UTC-9:30", "-540": "UTC-9", "-480": "UTC-8", "-420": "UTC-7", "-360": "UTC-6", "-300": "UTC-5", "-240": "UTC-4", "-210": "UTC-3:30", "-180": "UTC-3", "-120": "UTC-2", "-60": "UTC-1", 0: "UTC", 60: "UTC+1", 120: "UTC+2", 180: "UTC+3", 210: "UTC+3:30", 240: "UTC+4", 270: "UTC+4:30", 300: "UTC+5", 330: "UTC+5:30", 345: "UTC+5:45", 360: "UTC+6", 390: "UTC+6:30", 420: "UTC+7", 480: "UTC+8", 540: "UTC+9", 570: "UTC+9:30", 600: "UTC+10", 630: "UTC+10:30", 660: "UTC+11", 720: "UTC+12", 765: "UTC+12:45", 780: "UTC+13", 840: "UTC+14" };
		var time_zone_values = getValues(time_zone_map);
		if (time_zone_values.indexOf(time_zone) === -1) {
			throw new Error("time_zone must be one of " + time_zone_values.join(', '));
		}
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0xbd);
		buffer.writeInt16LE(time_zone);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0xc7
	if ('d2d_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0xc7);
		var bitOptions = 0;
		// 0：disable, 1：enable
		bitOptions |= payload.d2d_settings.d2d_agent_enable << 1;
		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x83
	if ('d2d_agent_settings_array' in payload) {
		var buffer = new Buffer();
		for (var d2d_agent_settings_array_id = 0; d2d_agent_settings_array_id < (payload.d2d_agent_settings_array && payload.d2d_agent_settings_array.length); d2d_agent_settings_array_id++) {
			var d2d_agent_settings_array_item = payload.d2d_agent_settings_array[d2d_agent_settings_array_id];
			if (d2d_agent_settings_array_item.d2d_agent_id < 0 || d2d_agent_settings_array_item.d2d_agent_id > 15) {
				throw new Error('d2d_agent_id must be between 0 and 15');
			}
			var d2d_agent_settings_array_item_id = d2d_agent_settings_array_item.d2d_agent_id;
			buffer.writeUInt8(0xff);
			buffer.writeUInt8(0x83);
			buffer.writeUInt8(d2d_agent_settings_array_item_id);
			if (d2d_agent_settings_array_item.d2d_agent_enable < 0 || d2d_agent_settings_array_item.d2d_agent_enable > 1) {
				throw new Error('d2d_agent_enable must be between 0 and 1');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(d2d_agent_settings_array_item.d2d_agent_enable);
			buffer.writeHexStringReverse(d2d_agent_settings_array_item.d2d_agent_command, 2);
			if (d2d_agent_settings_array_item.d2d_agent_action < 0 || d2d_agent_settings_array_item.d2d_agent_action > 2) {
				throw new Error('d2d_agent_action must be between 0 and 2');
			}
			// 1:On, 0:Off,       2:Inverse
			buffer.writeUInt8(d2d_agent_settings_array_item.d2d_agent_action);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x29
	if ('set_socket' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x29);
		var bitOptions = 0x10;
		// 0：off, 1：on
		bitOptions |= payload.set_socket.status_1 << 0;
		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0xa5
	if ('invert_socket_status' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0xa5);
		buffer.writeUInt8(0x01);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x28
	if ('query_device_status' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x28);
		buffer.writeUInt8(0xff);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0x27
	if ('clear_power_consumption' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		buffer.writeUInt8(0x27);
		buffer.writeUInt8(0xff);
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
	//0x03_0x74
	if ('voltage' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x03);
		buffer.writeUInt8(0x74);
		buffer.writeUInt16LE(payload.voltage);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x04_0x80
	if ('electric_power' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x04);
		buffer.writeUInt8(0x80);
		buffer.writeUInt32LE(payload.electric_power);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x05_0x81
	if ('power_factor' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x05);
		buffer.writeUInt8(0x81);
		if (payload.power_factor < 0 || payload.power_factor > 100) {
			throw new Error('power_factor must be between 0 and 100');
		}
		buffer.writeUInt8(payload.power_factor);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x06_0x83
	if ('power_consumption' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x06);
		buffer.writeUInt8(0x83);
		buffer.writeUInt32LE(payload.power_consumption * 100000);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x07_0xc9
	if ('current_rating' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x07);
		buffer.writeUInt8(0xc9);
		buffer.writeUInt16LE(payload.current_rating * 1000);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x09_0x67
	if ('temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x09);
		buffer.writeUInt8(0x67);
		if (payload.temperature < -40 || payload.temperature > 125) {
			throw new Error('temperature must be between -40 and 125');
		}
		buffer.writeInt16LE(payload.temperature * 10);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x08_0x70
	if ('socket_status' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x08);
		buffer.writeUInt8(0x70);
		var bitOptions = 0;
		// 0：off, 1：on
		bitOptions |= payload.socket_status.switch_status_1 << 0;
		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0x89_0x67
	if ('temperature_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x89);
		buffer.writeUInt8(0x67);
		buffer.writeInt16LE(payload.temperature_alarm.temperature * 10);
		if (payload.temperature_alarm.alarm_type < 0 || payload.temperature_alarm.alarm_type > 2) {
			throw new Error('temperature_alarm.alarm_type must be between 0 and 2');
		}
		// 0: temperature alarm release, 1: temperature alarm, 2: overheat alarm
		buffer.writeUInt8(payload.temperature_alarm.alarm_type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x87_0xc9
	if ('overcurrent_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x87);
		buffer.writeUInt8(0xc9);
		buffer.writeUInt16LE(payload.overcurrent_alarm.current * 1000);
		if (payload.overcurrent_alarm.status < 0 || payload.overcurrent_alarm.status > 1) {
			throw new Error('overcurrent_alarm.status must be between 0 and 1');
		}
		// 1：Overcurrent alarm, 0:Overcurrent alarm release
		buffer.writeUInt8(payload.overcurrent_alarm.status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x88_0x29
	if ('device_abnormal_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x88);
		buffer.writeUInt8(0x29);
		// 1：Abnormal
		buffer.writeUInt8(payload.device_abnormal_alarm.status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xb3_0x74
	if ('voltage_collection_error_report' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb3);
		buffer.writeUInt8(0x74);
		// 1：Collect_error
		buffer.writeUInt8(payload.voltage_collection_error_report.type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xb4_0x80
	if ('electric_power_collection_error_report' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb4);
		buffer.writeUInt8(0x80);
		// 1：Collect_error
		buffer.writeUInt8(payload.electric_power_collection_error_report.type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xb5_0x81
	if ('power_factor_collection_error_report' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb5);
		buffer.writeUInt8(0x81);
		// 1：Collect_error
		buffer.writeUInt8(payload.power_factor_collection_error_report.type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xb6_0x83
	if ('power_consumption_collection_error_report' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb6);
		buffer.writeUInt8(0x83);
		// 1：Collect_error
		buffer.writeUInt8(payload.power_consumption_collection_error_report.type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xb7_0xc9
	if ('current_collection_error_report' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb7);
		buffer.writeUInt8(0xc9);
		// 1：Collect_error
		buffer.writeUInt8(payload.current_collection_error_report.type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf9_0x67
	if ('schedule_report' in payload) {
		var buffer = new Buffer();
		for (var schedule_report_id = 0; schedule_report_id < (payload.schedule_report && payload.schedule_report.length); schedule_report_id++) {
			var schedule_report_item = payload.schedule_report[schedule_report_id];
			var schedule_report_item_id = schedule_report_item.schedule_id;
			if (schedule_report_item_id < 1 || schedule_report_item_id > 16) {
				throw new Error('schedule_id must be between 1 and 16');
			}
			buffer.writeUInt8(0xf9);
			buffer.writeUInt8(0x67);
			buffer.writeUInt8(schedule_report_item_id);
			var bitOptions = 0;
			// 0:Not config;, 1:Enable;, 2:Disable;
			if (schedule_report_item.enable < 0 || schedule_report_item.enable > 2) {
				throw new Error('enable must be between 0 and 2');
			}
			bitOptions |= schedule_report_item.enable << 0;
			bitOptions |= schedule_report_item.use_config << 4;
			buffer.writeUInt8(bitOptions);

			var bitOptions = 0;
			// 0: Disable;, 1: Enable;
			bitOptions |= schedule_report_item.execution_day_mon << 0;

			// 0: Disable;, 1: Enable;
			bitOptions |= schedule_report_item.execution_day_tues << 1;

			// 0: Disable;, 1: Enable;
			bitOptions |= schedule_report_item.execution_day_wed << 2;

			// 0: Disable;, 1: Enable;
			bitOptions |= schedule_report_item.execution_day_thu << 3;
			
			// 0: Disable;, 1: Enable;
			bitOptions |= schedule_report_item.execution_day_fri << 4;

			// 0: Disable;, 1: Enable;
			bitOptions |= schedule_report_item.execution_day_sat << 5;

			// 0: Disable;, 1: Enable;
			bitOptions |= schedule_report_item.execution_day_sun << 6;

			buffer.writeUInt8(bitOptions);
			if (schedule_report_item.execut_hour < 0 || schedule_report_item.execut_hour > 23) {
				throw new Error('execut_hour must be between 0 and 23');
			}
			buffer.writeUInt8(schedule_report_item.execut_hour);
			if (schedule_report_item.execut_min < 0 || schedule_report_item.execut_min > 59) {
				throw new Error('execut_min must be between 0 and 59');
			}
			buffer.writeUInt8(schedule_report_item.execut_min);
			if (schedule_report_item.button_status < 0 || schedule_report_item.button_status > 3) {
				throw new Error('button_status must be between 0 and 3');
			}
			// 1:On;, 2:Off;, 3:Inverse, 0:Keep;
			buffer.writeUInt8(schedule_report_item.button_status);
			if (schedule_report_item.lock_status < 0 || schedule_report_item.lock_status > 2) {
				throw new Error('lock_status must be between 0 and 2');
			}
			// 1:Lock;, 2:Unlock;, 0:Keep;
			buffer.writeUInt8(schedule_report_item.lock_status);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xff_0xc6
	if ('lora_tx_rdt_max' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xf9);
		buffer.writeUInt8(0xc6);
		if (payload.lora_tx_rdt_max < 0 || payload.lora_tx_rdt_max > 60) {
			throw new Error('lora_tx_rdt_max must be between 0 and 60');
		}
		buffer.writeUInt16LE(payload.lora_tx_rdt_max);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf9_0xca
	if ('bluetooth_name' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xf9);
		buffer.writeUInt8(0xca);
		buffer.writeString(payload.bluetooth_name, 13);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf9_0x69
	if ('button_lock_settings' in payload) {
		if (payload.button_lock_settings.switch_config !== 0 && payload.button_lock_settings.switch_config !== 1) {
			throw new Error('button_lock_settings.switch_config must be 0 or 1');
		}
		if (payload.button_lock_settings.reset_config !== 0 && payload.button_lock_settings.reset_config !== 1) {
			throw new Error('button_lock_settings.reset_config must be 0 or 1');
		}
		var buffer = new Buffer();
		buffer.writeUInt8(0xf9);
		buffer.writeUInt8(0x69);
		var bitOptions = 0;
		// 0：Disable, 1：Enable
		bitOptions |= payload.button_lock_settings.switch_config << 0;

		// 0：Disable, 1：Enable
		bitOptions |= payload.button_lock_settings.reset_config << 1;
		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf9_0x0b
	if ('temperature_alarm_rule' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xf9);
		buffer.writeUInt8(0x0b);
		buffer.writeUInt8(0x00);
		if (payload.temperature_alarm_rule.condition < 0 || payload.temperature_alarm_rule.condition > 4) {
			throw new Error('temperature_alarm_rule.condition must be between 0 and 4');
		}
		// 0：disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A<x<B, 4:condition: x<A or x>B
		buffer.writeUInt8(payload.temperature_alarm_rule.condition);
		if (payload.temperature_alarm_rule.threshold_max < -40 || payload.temperature_alarm_rule.threshold_max > 125) {
			throw new Error('temperature_alarm_rule.threshold_max must be between -40 and 125');
		}
		buffer.writeInt16LE(payload.temperature_alarm_rule.threshold_max * 10);
		if (payload.temperature_alarm_rule.threshold_min < -40 || payload.temperature_alarm_rule.threshold_min > 125) {
			throw new Error('temperature_alarm_rule.threshold_min must be between -40 and 125');
		}
		buffer.writeInt16LE(payload.temperature_alarm_rule.threshold_min * 10);
		if (payload.temperature_alarm_rule.threshold_enable < 0 || payload.temperature_alarm_rule.threshold_enable > 1) {
			throw new Error('temperature_alarm_rule.threshold_enable must be between 0 and 1');
		}
		// 0: Disable;, 1: Enable;
		buffer.writeUInt8(payload.temperature_alarm_rule.threshold_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf9_0xb6
	if ('alarm_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xf9);
		buffer.writeUInt8(0xb6);
		if (payload.alarm_settings.alarm_interval < 1 || payload.alarm_settings.alarm_interval > 1440) {
			throw new Error('alarm_settings.alarm_interval must be between 1 and 1440');
		}
		buffer.writeUInt16LE(payload.alarm_settings.alarm_interval * 1);
		if (payload.alarm_settings.alarm_count < 1 || payload.alarm_settings.alarm_count > 1000) {
			throw new Error('alarm_settings.alarm_count must be between 1 and 1000');
		}
		buffer.writeUInt16LE(payload.alarm_settings.alarm_count * 1);
		if (payload.alarm_settings.release_enable < 0 || payload.alarm_settings.release_enable > 1) {
			throw new Error('alarm_settings.release_enable must be between 0 and 1');
		}
		// 0: Disable;, 1: Enable;
		buffer.writeUInt8(payload.alarm_settings.release_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf9_0x64
	if ('schedule_settings' in payload) {
		var buffer = new Buffer();
		for (var schedule_settings_id = 0; schedule_settings_id < (payload.schedule_settings && payload.schedule_settings.length); schedule_settings_id++) {
			var schedule_settings_item = payload.schedule_settings[schedule_settings_id];
			var schedule_settings_item_id = schedule_settings_item.schedule_id;
			if ((schedule_settings_item.schedule_id < 1 || schedule_settings_item.schedule_id > 16) && schedule_settings_item.schedule_id !== 255) {
				throw new Error('schedule_id must be between 1 and 16 or equal to 255');
			}
			buffer.writeUInt8(0xf9);
			buffer.writeUInt8(0x64);
			buffer.writeUInt8(schedule_settings_item_id);
			var bitOptions = 0x00;
			// 0:Not config;, 1:Enable;, 2:Disable;
			if (schedule_settings_item.enable < 0 || schedule_settings_item.enable > 2) {
				throw new Error('enable must be between 0 and 2');
			}
			bitOptions |= schedule_settings_item.enable << 0;
			bitOptions |= schedule_settings_item.use_config << 4;
			buffer.writeUInt8(bitOptions);

			var bitOptions = 0;
			// 0: Disable;, 1: Enable;
			bitOptions |= schedule_settings_item.execution_day_mon << 0;

			// 0: Disable;, 1: Enable;
			bitOptions |= schedule_settings_item.execution_day_tues << 1;

			// 0: Disable;, 1: Enable;
			bitOptions |= schedule_settings_item.execution_day_wed << 2;

			// 0: Disable;, 1: Enable;
			bitOptions |= schedule_settings_item.execution_day_thu << 3;

			// 0: Disable;, 1: Enable;
			bitOptions |= schedule_settings_item.execution_day_fri << 4;

			// 0: Disable;, 1: Enable;
			bitOptions |= schedule_settings_item.execution_day_sat << 5;

			// 0: Disable;, 1: Enable;
			bitOptions |= schedule_settings_item.execution_day_sun << 6;

			buffer.writeUInt8(bitOptions);
			if (schedule_settings_item.execution_hour < 0 || schedule_settings_item.execution_hour > 23) {
				throw new Error('execution_hour must be between 0 and 23');
			}
			buffer.writeUInt8(schedule_settings_item.execution_hour);
			if (schedule_settings_item.execution_min < 0 || schedule_settings_item.execution_min > 59) {
				throw new Error('execution_min must be between 0 and 59');
			}
			buffer.writeUInt8(schedule_settings_item.execution_min);
			if (schedule_settings_item.button_status_1 < 0 || schedule_settings_item.button_status_1 > 3) {
				throw new Error('button_status_1 must be between 0 and 3');
			}
			// 1:On;, 2:Off;, 3:Inverse, 0:Keep;
			buffer.writeUInt8(schedule_settings_item.button_status_1);
			if (schedule_settings_item.lock_status < 0 || schedule_settings_item.lock_status > 2) {
				throw new Error('lock_status must be between 0 and 2');
			}
			// 1:Lock;, 2:Unlock;, 0:Keep;
			buffer.writeUInt8(schedule_settings_item.lock_status);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf9_0x72
	if ('daylight_saving_time' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xf9);
		buffer.writeUInt8(0x72);
		var bitOptions = 0;
		// 0：Disable, 1：Enable
		if (payload.daylight_saving_time.enable !== 0 && payload.daylight_saving_time.enable !== 1) {
			throw new Error('dst_bias must be 0 or 1');
		}
		bitOptions |= payload.daylight_saving_time.enable << 7;
		if (payload.daylight_saving_time.dst_bias < 1 || payload.daylight_saving_time.dst_bias > 120) {
			throw new Error('dst_bias must be between 1 and 120');
		}
		bitOptions |= payload.daylight_saving_time.dst_bias << 0;

		buffer.writeUInt8(bitOptions);
		if (payload.daylight_saving_time.start_month < 1 || payload.daylight_saving_time.start_month > 12) {
			throw new Error('daylight_saving_time.start_month must be between 1 and 12');
		}
		// 1:Jan., 2:Feb., 3:Mar., 4:Apr., 5:May, 6:Jun., 7:Jul., 8:Aug., 9:Sep., 10:Oct., 11:Nov., 12:Dec.
		buffer.writeUInt8(payload.daylight_saving_time.start_month);
		var bitOptions = 0;
		// 1:1st, 2: 2nd, 3: 3rd, 4: 4th, 5: last
		bitOptions |= payload.daylight_saving_time.start_week_num << 4;

		// 1：Mon., 2：Tues., 3：Wed., 4：Thurs., 5：Fri., 6：Sat., 7：Sun.
		bitOptions |= payload.daylight_saving_time.start_week_day << 0;
		buffer.writeUInt8(bitOptions);

		buffer.writeUInt16LE(payload.daylight_saving_time.start_hour_min);
		if (payload.daylight_saving_time.end_month < 1 || payload.daylight_saving_time.end_month > 12) {
			throw new Error('daylight_saving_time.end_month must be between 1 and 12');
		}
		// 1:Jan., 2:Feb., 3:Mar., 4:Apr., 5:May, 6:Jun., 7:Jul., 8:Aug., 9:Sep., 10:Oct., 11:Nov., 12:Dec.
		buffer.writeUInt8(payload.daylight_saving_time.end_month);
		var bitOptions = 0;
		// 1:1st, 2: 2nd, 3: 3rd, 4: 4th, 5: last
		bitOptions |= payload.daylight_saving_time.end_week_num << 4;

		// 1：Mon., 2：Tues., 3：Wed., 4：Thurs., 5：Fri., 6：Sat., 7：Sun.
		bitOptions |= payload.daylight_saving_time.end_week_day << 0;
		buffer.writeUInt8(bitOptions);

		buffer.writeUInt16LE(payload.daylight_saving_time.end_hour_min);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf9_0x65
	if ('get_schedule' in payload) {
		if ((payload.get_schedule.schedule_id < 1 || payload.get_schedule.schedule_id > 16) && payload.get_schedule.schedule_id !== 255) {
			throw new Error('schedule_id must be between 1 and 16 or equal to 255');
		}
		var buffer = new Buffer();
		buffer.writeUInt8(0xf9);
		buffer.writeUInt8(0x65);
		buffer.writeInt8(payload.get_schedule.schedule_id);
		encoded = encoded.concat(buffer.toBytes());
	}
	return encoded;
}

function getValues(map) {
    var values = [];
    for (var key in map) {
        values.push(parseInt(key));
    }
    return values;
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

function cmdMap() {
	return {
		  "device_status": "ff_0x0b",
		  "ipso_version": "ff_0x01",
		  "sn": "ff_0x16",
		  "hardware_version": "ff_0x09",
		  "firmware_version": "ff_0x0a",
		  "lorawan_class": "ff_0x0f",
		  "voltage": "03_0x74",
		  "electric_power": "04_0x80",
		  "power_factor": "05_0x81",
		  "power_consumption": "06_0x83",
		  "current_rating": "07_0xc9",
		  "temperature": "09_0x67",
		  "socket_status": "08_0x70",
		  "temperature_alarm": "89_0x67",
		  "overcurrent_alarm": "87_0xc9",
		  "device_abnormal_alarm": "88_0x29",
		  "voltage_collection_error_report": "b3_0x74",
		  "electric_power_collection_error_report": "b4_0x80",
		  "power_factor_collection_error_report": "b5_0x81",
		  "power_consumption_collection_error_report": "b6_0x83",
		  "current_collection_error_report": "b7_0xc9",
		  "schedule_report": "f9_0x67",
		  "schedule_report._item": "f9_0x67xx",
		  "reporting_interval_settings": "ff_0x8e",
		  "power_consumption_enable": "ff_0x26",
		  "led_indicator_mode": "ff_0x2f",
		  "power_switch_mode": "ff_0x67",
		  "lora_tx_rdt_max": "f9_0xc6",
		  "bluetooth_name": "f9_0xca",
		  "button_lock_settings": "f9_0x69",
		  "overcurrent_alarm_settings": "ff_0x24",
		  "overcurrent_protection_settings": "ff_0x30",
		  "high_current_protection": "ff_0x8d",
		  "temperature_alarm_rule": "f9_0x0b",
		  "alarm_settings": "f9_0xb6",
		  "temperature_calibration_settings": "ff_0xab",
		  "schedule_settings": "f9_0x64",
		  "schedule_settings._item": "f9_0x64xx",
		  "time_zone": "ff_0xbd",
		  "daylight_saving_time": "f9_0x72",
		  "d2d_settings": "ff_0xc7",
		  "d2d_agent_settings_array": "ff_0x83",
		  "d2d_agent_settings_array._item": "ff_0x83xx",
		  "get_schedule": "f9_0x65",
		  "set_socket": "ff_0x29",
		  "invert_socket_status": "ff_0xa5",
		  "query_device_status": "ff_0x28",
		  "clear_power_consumption": "ff_0x27",
		  "reboot": "ff_0x10"
	};
}
function processTemperature(payload) {
	var allTemperatureProperties = {
    "temperature": {
        "coefficient": 0.1
    },
    "temperature_alarm.temperature": {
        "coefficient": 0.1
    },
    "temperature_alarm_rule.threshold_min": {
        "coefficient": 0.1
    },
    "temperature_alarm_rule.threshold_max": {
        "coefficient": 0.1
    },
    "temperature_calibration_settings.value": {
        "coefficient": 0.1
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