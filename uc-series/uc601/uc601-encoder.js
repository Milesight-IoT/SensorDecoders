/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product UC601
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
	//0xef
	if ('req' in payload) {
		var buffer = new Buffer();
		var reqList = payload.req;
		for (var idx = 0; idx < reqList.length; idx++) {
			var req_command = reqList[idx];
			var pureNumber = [];
			var formateStrParts = [];
		
			req_command.split('.').forEach(function(part) {
				if (/^[0-9]+$/.test(part)) {
					// padStart ES5 兼容
					var hex = Number(part).toString(16);
					while (hex.length < 2) { hex = '0' + hex; }
					pureNumber.push(hex);
					formateStrParts.push('_item');
				} else {
					formateStrParts.push(part);
				}
			});
		
			var formateStr = formateStrParts.join('.');
			var hexString = cmdMap()[formateStr];
		
			if (hexString && hexString.indexOf('xx') !== -1) {
				var i = 0;
				hexString = hexString.replace(/xx/g, function() {
					return pureNumber[i++];
				});
			}
		
			if (hexString) {
				var length = hexString.length / 2;
				buffer.writeUInt8(0xef);
				buffer.writeUInt8(length);
				buffer.writeHexString(hexString, length, true);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xee
	if ('request_query_all_configurations' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xee);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xcf
	if ('lorawan_configuration_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.lorawan_configuration_settings.mode)) {
			buffer.writeUInt8(0xcf);
			// 0:ClassA, 1:ClassB, 2:ClassC, 3:ClassC to B
			buffer.writeUInt8(0x00);
			if ([0, 1, 2, 3].indexOf(payload.lorawan_configuration_settings.mode) === -1) {
				throw oneOfError('lorawan_configuration_settings.mode', [0, 1, 2, 3]);
			}
			// 0:ClassA, 1:ClassB, 2:ClassC, 3:ClassC to B
			buffer.writeUInt8(payload.lorawan_configuration_settings.mode);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xde
	if ('product_name' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xde);
		buffer.writeString(payload.product_name, 32);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xdd
	if ('product_pn' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xdd);
		buffer.writeString(payload.product_pn, 32);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xdb
	if ('product_sn' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xdb);
		buffer.writeHexString(payload.product_sn, 8);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xd9
	if ('oem_id' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xd9);
		buffer.writeHexString(payload.oem_id, 2);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xc8
	if ('device_status' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xc8);
		if ([0, 1].indexOf(payload.device_status) === -1) {
			throw oneOfError('device_status', [0, 1]);
		}
		// 0：Off, 1：On
		buffer.writeUInt8(payload.device_status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xd8
	if ('product_frequency_band' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xd8);
		buffer.writeString(payload.product_frequency_band, 16);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xb8
	if ('synchronize_time' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb8);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xbf
	if ('reset' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xbf);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xbe
	if ('reboot' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xbe);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x00
	if ('voltage' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x00);
		if (payload.voltage < 0 || payload.voltage > 250) {
			throw betweenError('voltage', 0, 250);
		}
		buffer.writeUInt16LE(payload.voltage * 10);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x20
	if ('voltage_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x20);
		buffer.writeUInt8(payload.voltage_alarm.type);
		if (payload.voltage_alarm.type == 0x00) {
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x01
	if ('electric_power' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x01);
		if (payload.electric_power < 0 || payload.electric_power > 4000) {
			throw betweenError('electric_power', 0, 4000);
		}
		buffer.writeUInt32LE(payload.electric_power);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x21
	if ('electric_power_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x21);
		buffer.writeUInt8(payload.electric_power_alarm.type);
		if (payload.electric_power_alarm.type == 0x00) {
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x02
	if ('power_factor' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x02);
		if (payload.power_factor < 0 || payload.power_factor > 100) {
			throw betweenError('power_factor', 0, 100);
		}
		buffer.writeUInt8(payload.power_factor);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x22
	if ('power_factor_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x22);
		buffer.writeUInt8(payload.power_factor_alarm.type);
		if (payload.power_factor_alarm.type == 0x00) {
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x03
	if ('power_consumption' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x03);
		if (payload.power_consumption < 0 || payload.power_consumption > 4294967295) {
			throw betweenError('power_consumption', 0, 4294967295);
		}
		buffer.writeUInt32LE(payload.power_consumption * 1000);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x23
	if ('power_consumption_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x23);
		buffer.writeUInt8(payload.power_consumption_alarm.type);
		if (payload.power_consumption_alarm.type == 0x00) {
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x04
	if ('current' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x04);
		if (payload.current < 0 || payload.current > 65536) {
			throw betweenError('current', 0, 65536);
		}
		buffer.writeUInt16LE(payload.current * 1000);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x24
	if ('current_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x24);
		buffer.writeUInt8(payload.current_alarm.type);
		if (payload.current_alarm.type == 0x00) {
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x05
	if ('equipment_temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x05);
		if (payload.equipment_temperature < -40 || payload.equipment_temperature > 125) {
			throw betweenError('equipment_temperature', -40, 125);
		}
		buffer.writeInt16LE(payload.equipment_temperature * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x25
	if ('equipment_temperature_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x25);
		buffer.writeUInt8(payload.equipment_temperature_alarm.type);
		if (payload.equipment_temperature_alarm.type == 0x00) {
		}
		if (payload.equipment_temperature_alarm.type == 0x01) {
		}
		if (payload.equipment_temperature_alarm.type == 0x02) {
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x06
	if ('ambient_temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x06);
		if (payload.ambient_temperature < -20 || payload.ambient_temperature > 60) {
			throw betweenError('ambient_temperature', -20, 60);
		}
		buffer.writeInt16LE(payload.ambient_temperature * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x26
	if ('ambient_temperature_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x26);
		buffer.writeUInt8(payload.ambient_temperature_alarm.type);
		if (payload.ambient_temperature_alarm.type == 0x00) {
		}
		if (payload.ambient_temperature_alarm.type == 0x03) {
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x07
	if ('relays_status' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x07);
		if ([0, 1].indexOf(payload.relays_status) === -1) {
			throw oneOfError('relays_status', [0, 1]);
		}
		// 0：normally closed, 1：normally open
		buffer.writeUInt8(payload.relays_status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x08
	if ('overcurrent_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x08);
		if (payload.overcurrent_alarm.current < 0 || payload.overcurrent_alarm.current > 65535) {
			throw betweenError('overcurrent_alarm.current', 0, 65535);
		}
		buffer.writeUInt16LE(payload.overcurrent_alarm.current * 1000);
		if ([0, 1].indexOf(payload.overcurrent_alarm.status) === -1) {
			throw oneOfError('overcurrent_alarm.status', [0, 1]);
		}
		// 0：over current alarm Release, 1：over current alarm trigger
		buffer.writeUInt8(payload.overcurrent_alarm.status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x09
	if ('overcurrent_protection_trigger' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x09);
		if (payload.overcurrent_protection_trigger.current < 0 || payload.overcurrent_protection_trigger.current > 65535) {
			throw betweenError('overcurrent_protection_trigger.current', 0, 65535);
		}
		buffer.writeUInt16LE(payload.overcurrent_protection_trigger.current * 1000);
		if ([0, 1].indexOf(payload.overcurrent_protection_trigger.status) === -1) {
			throw oneOfError('overcurrent_protection_trigger.status', [0, 1]);
		}
		// 0：normal, 1：over current protect  trigger
		buffer.writeUInt8(payload.overcurrent_protection_trigger.status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0a
	if ('high_current_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0a);
		if (payload.high_current_alarm.current < 0 || payload.high_current_alarm.current > 65535) {
			throw betweenError('high_current_alarm.current', 0, 65535);
		}
		buffer.writeUInt16LE(payload.high_current_alarm.current * 1000);
		if ([0, 1].indexOf(payload.high_current_alarm.status) === -1) {
			throw oneOfError('high_current_alarm.status', [0, 1]);
		}
		// 0：normal, 1：high current protect  trigger
		buffer.writeUInt8(payload.high_current_alarm.status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0b
	if ('overvoltage_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0b);
		if (payload.overvoltage_alarm.voltage < 0 || payload.overvoltage_alarm.voltage > 250) {
			throw betweenError('overvoltage_alarm.voltage', 0, 250);
		}
		buffer.writeUInt16LE(payload.overvoltage_alarm.voltage * 10);
		if ([0, 1].indexOf(payload.overvoltage_alarm.status) === -1) {
			throw oneOfError('overvoltage_alarm.status', [0, 1]);
		}
		// 0：over voltage alarm Release, 1：over voltage alarm trigger
		buffer.writeUInt8(payload.overvoltage_alarm.status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0c
	if ('overvoltage_protect_trigger' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0c);
		if (payload.overvoltage_protect_trigger.voltage < 0 || payload.overvoltage_protect_trigger.voltage > 250) {
			throw betweenError('overvoltage_protect_trigger.voltage', 0, 250);
		}
		buffer.writeUInt16LE(payload.overvoltage_protect_trigger.voltage * 10);
		if ([0, 1].indexOf(payload.overvoltage_protect_trigger.status) === -1) {
			throw oneOfError('overvoltage_protect_trigger.status', [0, 1]);
		}
		// 0：normal, 1：over voltage protect trigger
		buffer.writeUInt8(payload.overvoltage_protect_trigger.status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0d
	if ('device_broken_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0d);
		if ([0, 1].indexOf(payload.device_broken_alarm.status) === -1) {
			throw oneOfError('device_broken_alarm.status', [0, 1]);
		}
		// 0：normal, 1：device broken
		buffer.writeUInt8(payload.device_broken_alarm.status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0e
	if ('overtemperature_protect' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0e);
		if (payload.overtemperature_protect.temperature < -40 || payload.overtemperature_protect.temperature > 125) {
			throw betweenError('overtemperature_protect.temperature', -40, 125);
		}
		buffer.writeInt16LE(payload.overtemperature_protect.temperature * 10);
		if ([0, 1].indexOf(payload.overtemperature_protect.status) === -1) {
			throw oneOfError('overtemperature_protect.status', [0, 1]);
		}
		// 0：normal, 1：over temperature  trigger
		buffer.writeUInt8(payload.overtemperature_protect.status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0f
	if ('freeze_protection' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0f);
		if (payload.freeze_protection.temperature < -20 || payload.freeze_protection.temperature > 60) {
			throw betweenError('freeze_protection.temperature', -20, 60);
		}
		buffer.writeInt16LE(payload.freeze_protection.temperature * 10);
		if ([0, 1].indexOf(payload.freeze_protection.status) === -1) {
			throw oneOfError('freeze_protection.status', [0, 1]);
		}
		// 0：normal, 1：freeze protection
		buffer.writeUInt8(payload.freeze_protection.status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x10
	if ('open_window_detection' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x10);
		if (payload.open_window_detection.temperature < -20 || payload.open_window_detection.temperature > 60) {
			throw betweenError('open_window_detection.temperature', -20, 60);
		}
		buffer.writeInt16LE(payload.open_window_detection.temperature * 10);
		if ([0, 1].indexOf(payload.open_window_detection.status) === -1) {
			throw oneOfError('open_window_detection.status', [0, 1]);
		}
		// 0：normal, 1：open window
		buffer.writeUInt8(payload.open_window_detection.status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x11
	if ('relays_status_change' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x11);
		if ([0, 1].indexOf(payload.relays_status_change.status) === -1) {
			throw oneOfError('relays_status_change.status', [0, 1]);
		}
		// 0：normally closed, 1：normally open
		buffer.writeUInt8(payload.relays_status_change.status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x60
	if ('reporting_interval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x60);
		if ([0, 1].indexOf(payload.reporting_interval.unit) === -1) {
			throw oneOfError('reporting_interval.unit', [0, 1]);
		}
		// 0：second, 1：min
		buffer.writeUInt8(payload.reporting_interval.unit);
		if (payload.reporting_interval.unit == 0x00) {
			if (payload.reporting_interval.seconds_of_time < 10 || payload.reporting_interval.seconds_of_time > 64800) {
				throw betweenError('reporting_interval.seconds_of_time', 10, 64800);
			}
			buffer.writeUInt16LE(payload.reporting_interval.seconds_of_time);
		}
		if (payload.reporting_interval.unit == 0x01) {
			if (payload.reporting_interval.minutes_of_time < 1 || payload.reporting_interval.minutes_of_time > 1440) {
				throw betweenError('reporting_interval.minutes_of_time', 1, 1440);
			}
			buffer.writeUInt16LE(payload.reporting_interval.minutes_of_time);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x61
	if ('temperature_unit' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x61);
		if ([0, 1].indexOf(payload.temperature_unit) === -1) {
			throw oneOfError('temperature_unit', [0, 1]);
		}
		// 0：℃, 1：℉
		buffer.writeUInt8(payload.temperature_unit);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x62
	if ('led_status' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x62);
		if ([0, 1].indexOf(payload.led_status) === -1) {
			throw oneOfError('led_status', [0, 1]);
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.led_status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x63
	if ('button_lock_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.button_lock_settings.switch_lock_enable)) {
			buffer.writeUInt8(0x63);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.button_lock_settings.switch_lock_enable) === -1) {
				throw oneOfError('button_lock_settings.switch_lock_enable', [0, 1]);
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.button_lock_settings.switch_lock_enable);
		}
		if (isValid(payload.button_lock_settings.switch_reset_enable)) {
			buffer.writeUInt8(0x63);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x01);
			if ([0, 1].indexOf(payload.button_lock_settings.switch_reset_enable) === -1) {
				throw oneOfError('button_lock_settings.switch_reset_enable', [0, 1]);
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.button_lock_settings.switch_reset_enable);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x64
	if ('overcurrent_alarm_rule' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.overcurrent_alarm_rule.enable)) {
			buffer.writeUInt8(0x64);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.overcurrent_alarm_rule.enable) === -1) {
				throw oneOfError('overcurrent_alarm_rule.enable', [0, 1]);
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.overcurrent_alarm_rule.enable);
		}
		if (isValid(payload.overcurrent_alarm_rule.threshold_max)) {
			buffer.writeUInt8(0x64);
			buffer.writeUInt8(0x01);
			if (payload.overcurrent_alarm_rule.threshold_max < 1 || payload.overcurrent_alarm_rule.threshold_max > 16) {
				throw betweenError('overcurrent_alarm_rule.threshold_max', 1, 16);
			}
			buffer.writeUInt8(payload.overcurrent_alarm_rule.threshold_max);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x65
	if ('overcurrent_protection_rule' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.overcurrent_protection_rule.enable)) {
			buffer.writeUInt8(0x65);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.overcurrent_protection_rule.enable) === -1) {
				throw oneOfError('overcurrent_protection_rule.enable', [0, 1]);
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.overcurrent_protection_rule.enable);
		}
		if (isValid(payload.overcurrent_protection_rule.threshold_max)) {
			buffer.writeUInt8(0x65);
			buffer.writeUInt8(0x01);
			if (payload.overcurrent_protection_rule.threshold_max < 1 || payload.overcurrent_protection_rule.threshold_max > 16) {
				throw betweenError('overcurrent_protection_rule.threshold_max', 1, 16);
			}
			buffer.writeUInt8(payload.overcurrent_protection_rule.threshold_max);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x66
	if ('overvoltage_alarm_rule' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.overvoltage_alarm_rule.enable)) {
			buffer.writeUInt8(0x66);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.overvoltage_alarm_rule.enable) === -1) {
				throw oneOfError('overvoltage_alarm_rule.enable', [0, 1]);
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.overvoltage_alarm_rule.enable);
		}
		if (isValid(payload.overvoltage_alarm_rule.threshold_max)) {
			buffer.writeUInt8(0x66);
			buffer.writeUInt8(0x01);
			if (payload.overvoltage_alarm_rule.threshold_max < 1 || payload.overvoltage_alarm_rule.threshold_max > 250) {
				throw betweenError('overvoltage_alarm_rule.threshold_max', 1, 250);
			}
			buffer.writeUInt8(payload.overvoltage_alarm_rule.threshold_max);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x67
	if ('overvoltage_protection_rule' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.overvoltage_protection_rule.enable)) {
			buffer.writeUInt8(0x67);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.overvoltage_protection_rule.enable) === -1) {
				throw oneOfError('overvoltage_protection_rule.enable', [0, 1]);
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.overvoltage_protection_rule.enable);
		}
		if (isValid(payload.overvoltage_protection_rule.threshold_max)) {
			buffer.writeUInt8(0x67);
			buffer.writeUInt8(0x01);
			if (payload.overvoltage_protection_rule.threshold_max < 1 || payload.overvoltage_protection_rule.threshold_max > 250) {
				throw betweenError('overvoltage_protection_rule.threshold_max', 1, 250);
			}
			buffer.writeUInt8(payload.overvoltage_protection_rule.threshold_max);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x68
	if ('high_current_protection_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x68);
		if ([0, 1].indexOf(payload.high_current_protection_enable) === -1) {
			throw oneOfError('high_current_protection_enable', [0, 1]);
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.high_current_protection_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x69
	if ('relay_abnormal_protection_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x69);
		if ([0, 1].indexOf(payload.relay_abnormal_protection_enable) === -1) {
			throw oneOfError('relay_abnormal_protection_enable', [0, 1]);
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.relay_abnormal_protection_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6a
	if ('alarm_deactivation_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6a);
		if ([0, 1].indexOf(payload.alarm_deactivation_enable) === -1) {
			throw oneOfError('alarm_deactivation_enable', [0, 1]);
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.alarm_deactivation_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6b
	if ('power_on_relay_mode' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6b);
		if ([2, 0, 1].indexOf(payload.power_on_relay_mode) === -1) {
			throw oneOfError('power_on_relay_mode', [2, 0, 1]);
		}
		// 2：Return to Previous Working State, 0：normally closed, 1：normally open
		buffer.writeUInt8(payload.power_on_relay_mode);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6c
	if ('power_metering_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6c);
		if ([0, 1].indexOf(payload.power_metering_enable) === -1) {
			throw oneOfError('power_metering_enable', [0, 1]);
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.power_metering_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6d
	if ('bluetooth_name' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6d);
		buffer.writeString(payload.bluetooth_name, 32);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6e
	if ('d2d_pairing_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6e);
		if ([0, 1].indexOf(payload.d2d_pairing_enable) === -1) {
			throw oneOfError('d2d_pairing_enable', [0, 1]);
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.d2d_pairing_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6f
	if ('d2d_pairing_settings' in payload) {
		var buffer = new Buffer();
		for (var d2d_pairing_settings_id = 0; d2d_pairing_settings_id < (payload.d2d_pairing_settings && payload.d2d_pairing_settings.length); d2d_pairing_settings_id++) {
			var d2d_pairing_settings_item = payload.d2d_pairing_settings[d2d_pairing_settings_id];
			var d2d_pairing_settings_item_id = d2d_pairing_settings_item.index;
			if (d2d_pairing_settings_item_id < 0 || d2d_pairing_settings_item_id > 4) {
				throw betweenError('d2d_pairing_settings_item_id', 0, 4);
			}

			if (isValid(d2d_pairing_settings_item.enable)) {
				buffer.writeUInt8(0x6f);
				buffer.writeUInt8(d2d_pairing_settings_item_id);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x00);
				if ([0, 1].indexOf(d2d_pairing_settings_item.enable) === -1) {
					throw oneOfError('enable', [0, 1]);
				}
				// 0：disable, 1：enable
				buffer.writeUInt8(d2d_pairing_settings_item.enable);
			}
			if (isValid(d2d_pairing_settings_item.deveui)) {
				buffer.writeUInt8(0x6f);
				buffer.writeUInt8(d2d_pairing_settings_item_id);
				buffer.writeUInt8(0x01);
				buffer.writeHexString(d2d_pairing_settings_item.deveui, 8);
			}
			if (isValid(d2d_pairing_settings_item.name_first)) {
				buffer.writeUInt8(0x6f);
				buffer.writeUInt8(d2d_pairing_settings_item_id);
				buffer.writeUInt8(0x02);
				buffer.writeString(d2d_pairing_settings_item.name_first, 8);
			}
			if (isValid(d2d_pairing_settings_item.name_last)) {
				buffer.writeUInt8(0x6f);
				buffer.writeUInt8(d2d_pairing_settings_item_id);
				buffer.writeUInt8(0x03);
				buffer.writeString(d2d_pairing_settings_item.name_last, 8);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x70
	if ('ambient_temperature_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x70);
		if ([0, 1].indexOf(payload.ambient_temperature_enable) === -1) {
			throw oneOfError('ambient_temperature_enable', [0, 1]);
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.ambient_temperature_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x71
	if ('ambient_temperature_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.ambient_temperature_settings.source)) {
			buffer.writeUInt8(0x71);
			// 0 : d2d data, 1：lora data
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.ambient_temperature_settings.source) === -1) {
				throw oneOfError('ambient_temperature_settings.source', [0, 1]);
			}
			// 0 : d2d data, 1：lora data
			buffer.writeUInt8(payload.ambient_temperature_settings.source);
		}
		if (isValid(payload.ambient_temperature_settings.timeout)) {
			buffer.writeUInt8(0x71);
			buffer.writeUInt8(0x01);
			if (payload.ambient_temperature_settings.timeout < 1 || payload.ambient_temperature_settings.timeout > 60) {
				throw betweenError('ambient_temperature_settings.timeout', 1, 60);
			}
			buffer.writeUInt8(payload.ambient_temperature_settings.timeout);
		}
		if (isValid(payload.ambient_temperature_settings.relay_timeout)) {
			buffer.writeUInt8(0x71);
			// 0：keep status, 1：normally open, 2：normally closed
			buffer.writeUInt8(0x02);
			if ([0, 1, 2].indexOf(payload.ambient_temperature_settings.relay_timeout) === -1) {
				throw oneOfError('ambient_temperature_settings.relay_timeout', [0, 1, 2]);
			}
			// 0：keep status, 1：normally open, 2：normally closed
			buffer.writeUInt8(payload.ambient_temperature_settings.relay_timeout);
		}
		if (isValid(payload.ambient_temperature_settings.relay_heat)) {
			buffer.writeUInt8(0x71);
			// 0：normally closed, 1：normally open
			buffer.writeUInt8(0x03);
			if ([0, 1].indexOf(payload.ambient_temperature_settings.relay_heat) === -1) {
				throw oneOfError('ambient_temperature_settings.relay_heat', [0, 1]);
			}
			// 0：normally closed, 1：normally open
			buffer.writeUInt8(payload.ambient_temperature_settings.relay_heat);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x72
	if ('temperature_control_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x72);
		if ([0, 1].indexOf(payload.temperature_control_enable) === -1) {
			throw oneOfError('temperature_control_enable', [0, 1]);
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.temperature_control_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x73
	if ('temperature_control_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.temperature_control_settings.target)) {
			buffer.writeUInt8(0x73);
			buffer.writeUInt8(0x00);
			buffer.writeUInt16LE(payload.temperature_control_settings.target * 100);
		}
		if (isValid(payload.temperature_control_settings.tolerance)) {
			buffer.writeUInt8(0x73);
			buffer.writeUInt8(0x01);
			if (payload.temperature_control_settings.tolerance < 0.5 || payload.temperature_control_settings.tolerance > 5) {
				throw betweenError('temperature_control_settings.tolerance', 0.5, 5);
			}
			buffer.writeUInt16LE(payload.temperature_control_settings.tolerance * 100);
		}
		if (isValid(payload.temperature_control_settings.range)) {
			buffer.writeUInt8(0x73);
			buffer.writeUInt8(0x02);
			if (payload.temperature_control_settings.range.min < 5 || payload.temperature_control_settings.range.min > 35) {
				throw betweenError('temperature_control_settings.range.min', 5, 35);
			}
			buffer.writeUInt16LE(payload.temperature_control_settings.range.min * 100);
			if (payload.temperature_control_settings.range.max < 5 || payload.temperature_control_settings.range.max > 35) {
				throw betweenError('temperature_control_settings.range.max', 5, 35);
			}
			buffer.writeUInt16LE(payload.temperature_control_settings.range.max * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x74
	if ('window_opening_detection_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x74);
		if ([0, 1].indexOf(payload.window_opening_detection_enable) === -1) {
			throw oneOfError('window_opening_detection_enable', [0, 1]);
		}
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.window_opening_detection_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x75
	if ('open_window_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.open_window_settings.cooling_rate)) {
			buffer.writeUInt8(0x75);
			buffer.writeUInt8(0x00);
			if (payload.open_window_settings.cooling_rate < 2 || payload.open_window_settings.cooling_rate > 10) {
				throw betweenError('open_window_settings.cooling_rate', 2, 10);
			}
			buffer.writeUInt16LE(payload.open_window_settings.cooling_rate * 100);
		}
		if (isValid(payload.open_window_settings.stop_temperature_control_time)) {
			buffer.writeUInt8(0x75);
			buffer.writeUInt8(0x01);
			if (payload.open_window_settings.stop_temperature_control_time < 1 || payload.open_window_settings.stop_temperature_control_time > 1440) {
				throw betweenError('open_window_settings.stop_temperature_control_time', 1, 1440);
			}
			buffer.writeUInt16LE(payload.open_window_settings.stop_temperature_control_time);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x76
	if ('anti_freeze_protection_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.anti_freeze_protection_settings.enable)) {
			buffer.writeUInt8(0x76);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.anti_freeze_protection_settings.enable) === -1) {
				throw oneOfError('anti_freeze_protection_settings.enable', [0, 1]);
			}
			// 0：Disable, 1：Enable
			buffer.writeUInt8(payload.anti_freeze_protection_settings.enable);
		}
		if (isValid(payload.anti_freeze_protection_settings.temperature_value)) {
			buffer.writeUInt8(0x76);
			buffer.writeUInt8(0x01);
			if (payload.anti_freeze_protection_settings.temperature_value < 1 || payload.anti_freeze_protection_settings.temperature_value > 5) {
				throw betweenError('anti_freeze_protection_settings.temperature_value', 1, 5);
			}
			buffer.writeUInt16LE(payload.anti_freeze_protection_settings.temperature_value * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x77
	if ('schedule_settings' in payload) {
		var buffer = new Buffer();
		for (var schedule_settings_id = 0; schedule_settings_id < (payload.schedule_settings && payload.schedule_settings.length); schedule_settings_id++) {
			var schedule_settings_item = payload.schedule_settings[schedule_settings_id];
			var schedule_settings_item_id = schedule_settings_item.id;
			if (schedule_settings_item_id < 0 || schedule_settings_item_id > 15) {
				throw betweenError('schedule_settings_item_id', 0, 15);
			}

			if (isValid(schedule_settings_item.status)) {
				buffer.writeUInt8(0x77);
				buffer.writeUInt8(schedule_settings_item_id);
				// 0：None, 1：Enable, 2：Disable
				buffer.writeUInt8(0x00);
				if ([0, 1, 2].indexOf(schedule_settings_item.status) === -1) {
					throw oneOfError('status', [0, 1, 2]);
				}
				// 0：None, 1：Enable, 2：Disable
				buffer.writeUInt8(schedule_settings_item.status);
			}
			if (isValid(schedule_settings_item.cycle_settings)) {
				buffer.writeUInt8(0x77);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x01);
				var bitOptions = 0;
				// 0：Disable, 1：Enable
				bitOptions |= schedule_settings_item.cycle_settings.execution_day_sun << 6;

				// 0：Disable, 1：Enable
				bitOptions |= schedule_settings_item.cycle_settings.execution_day_mon << 0;

				// 0：Disable, 1：Enable
				bitOptions |= schedule_settings_item.cycle_settings.execution_day_tues << 1;

				// 0：Disable, 1：Enable
				bitOptions |= schedule_settings_item.cycle_settings.execution_day_wed << 2;

				// 0：Disable, 1：Enable
				bitOptions |= schedule_settings_item.cycle_settings.execution_day_thur << 3;

				// 0：Disable, 1：Enable
				bitOptions |= schedule_settings_item.cycle_settings.execution_day_fri << 4;

				// 0：Disable, 1：Enable
				bitOptions |= schedule_settings_item.cycle_settings.execution_day_sat << 5;

				bitOptions |= schedule_settings_item.cycle_settings.reserved << 7;
				buffer.writeUInt8(bitOptions);

				if (schedule_settings_item.cycle_settings.execution_hour < 0 || schedule_settings_item.cycle_settings.execution_hour > 23) {
					throw betweenError('cycle_settings.execution_hour', 0, 23);
				}
				buffer.writeUInt8(schedule_settings_item.cycle_settings.execution_hour);
				if (schedule_settings_item.cycle_settings.execution_min < 0 || schedule_settings_item.cycle_settings.execution_min > 59) {
					throw betweenError('cycle_settings.execution_min', 0, 59);
				}
				buffer.writeUInt8(schedule_settings_item.cycle_settings.execution_min);
			}
			if (isValid(schedule_settings_item.schedule_target)) {
				buffer.writeUInt8(0x77);
				buffer.writeUInt8(schedule_settings_item_id);
				// 0：relay , 1：temperature control
				buffer.writeUInt8(0x02);
				if ([0, 1].indexOf(schedule_settings_item.schedule_target) === -1) {
					throw oneOfError('schedule_target', [0, 1]);
				}
				// 0：relay , 1：temperature control
				buffer.writeUInt8(schedule_settings_item.schedule_target);
			}
			if (isValid(schedule_settings_item.schedule_action)) {
				buffer.writeUInt8(0x77);
				buffer.writeUInt8(schedule_settings_item_id);
				// 0:normally open, 1:normally closed, 2:change, 3：Start up, 4：stop
				buffer.writeUInt8(0x03);
				if ([0, 1, 2, 3, 4].indexOf(schedule_settings_item.schedule_action) === -1) {
					throw oneOfError('schedule_action', [0, 1, 2, 3, 4]);
				}
				// 0:normally open, 1:normally closed, 2:change, 3：Start up, 4：stop
				buffer.writeUInt8(schedule_settings_item.schedule_action);
			}
			if (isValid(schedule_settings_item.schedule_parameter)) {
				buffer.writeUInt8(0x77);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x04);
				if (schedule_settings_item.schedule_parameter < 5 || schedule_settings_item.schedule_parameter > 35) {
					throw betweenError('schedule_parameter', 5, 35);
				}
				buffer.writeUInt16LE(schedule_settings_item.schedule_parameter * 100);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x78
	if ('d2d_slave_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x78);
		if ([0, 1].indexOf(payload.d2d_slave_enable) === -1) {
			throw oneOfError('d2d_slave_enable', [0, 1]);
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.d2d_slave_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x79
	if ('d2d_slave_settings' in payload) {
		var buffer = new Buffer();
		for (var d2d_slave_settings_id = 0; d2d_slave_settings_id < (payload.d2d_slave_settings && payload.d2d_slave_settings.length); d2d_slave_settings_id++) {
			var d2d_slave_settings_item = payload.d2d_slave_settings[d2d_slave_settings_id];
			var d2d_slave_settings_item_id = d2d_slave_settings_item.index;
			if (d2d_slave_settings_item_id < 0 || d2d_slave_settings_item_id > 7) {
				throw betweenError('d2d_slave_settings_item_id', 0, 7);
			}

			if (isValid(d2d_slave_settings_item.enable)) {
				buffer.writeUInt8(0x79);
				buffer.writeUInt8(d2d_slave_settings_item_id);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x00);
				if ([0, 1].indexOf(d2d_slave_settings_item.enable) === -1) {
					throw oneOfError('enable', [0, 1]);
				}
				// 0：disable, 1：enable
				buffer.writeUInt8(d2d_slave_settings_item.enable);
			}
			if (isValid(d2d_slave_settings_item.command)) {
				buffer.writeUInt8(0x79);
				buffer.writeUInt8(d2d_slave_settings_item_id);
				buffer.writeUInt8(0x01);
				buffer.writeHexString(d2d_slave_settings_item.command, 2);
			}
			if (isValid(d2d_slave_settings_item.content)) {
				buffer.writeUInt8(0x79);
				buffer.writeUInt8(d2d_slave_settings_item_id);
				// 0：relay , 1：temperature control
				buffer.writeUInt8(0x02);
				if ([0, 1].indexOf(d2d_slave_settings_item.content) === -1) {
					throw oneOfError('content', [0, 1]);
				}
				// 0：relay , 1：temperature control
				buffer.writeUInt8(d2d_slave_settings_item.content);
			}
			if (isValid(d2d_slave_settings_item.action)) {
				buffer.writeUInt8(0x79);
				buffer.writeUInt8(d2d_slave_settings_item_id);
				// 0:normally open, 1:normally closed, 2:change, 3：Start up, 4：stop
				buffer.writeUInt8(0x03);
				if ([0, 1, 2, 3, 4].indexOf(d2d_slave_settings_item.action) === -1) {
					throw oneOfError('action', [0, 1, 2, 3, 4]);
				}
				// 0:normally open, 1:normally closed, 2:change, 3：Start up, 4：stop
				buffer.writeUInt8(d2d_slave_settings_item.action);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xc7
	if ('time_zone' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xc7);
		if ([-720, -660, -600, -570, -540, -480, -420, -360, -300, -240, -210, -180, -120, -60, 0, 60, 120, 180, 210, 240, 270, 300, 330, 345, 360, 390, 420, 480, 540, 570, 600, 630, 660, 720, 765, 780, 840].indexOf(payload.time_zone) === -1) {
			throw oneOfError('time_zone', [-720, -660, -600, -570, -540, -480, -420, -360, -300, -240, -210, -180, -120, -60, 0, 60, 120, 180, 210, 240, 270, 300, 330, 345, 360, 390, 420, 480, 540, 570, 600, 630, 660, 720, 765, 780, 840]);
		}
		buffer.writeInt16LE(payload.time_zone);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xc6
	if ('daylight_saving_time' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xc6);
		if ([0, 1].indexOf(payload.daylight_saving_time.enable) === -1) {
			throw oneOfError('daylight_saving_time.enable', [0, 1]);
		}
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.daylight_saving_time.enable);
		if (payload.daylight_saving_time.daylight_saving_time_offset < 1 || payload.daylight_saving_time.daylight_saving_time_offset > 120) {
			throw betweenError('daylight_saving_time.daylight_saving_time_offset', 1, 120);
		}
		buffer.writeUInt8(payload.daylight_saving_time.daylight_saving_time_offset);
		if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].indexOf(payload.daylight_saving_time.start_month) === -1) {
			throw oneOfError('daylight_saving_time.start_month', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
		}
		// 1:Jan., 2:Feb., 3:Mar., 4:Apr., 5:May, 6:Jun., 7:Jul., 8:Aug., 9:Sep., 10:Oct., 11:Nov., 12:Dec.
		buffer.writeUInt8(payload.daylight_saving_time.start_month);
		var bitOptions = 0;
		// 1:1st, 2: 2nd, 3: 3rd, 4: 4th, 5: last
		bitOptions |= payload.daylight_saving_time.start_week_num << 4;

		// 1：Mon., 2：Tues., 3：Wed., 4：Thurs., 5：Fri., 6：Sat., 7：Sun.
		bitOptions |= payload.daylight_saving_time.start_week_day << 0;
		buffer.writeUInt8(bitOptions);

		if ([0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840, 900, 960, 1020, 1080, 1140, 1200, 1260, 1320, 1380].indexOf(payload.daylight_saving_time.start_hour_min) === -1) {
			throw oneOfError('daylight_saving_time.start_hour_min', [0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840, 900, 960, 1020, 1080, 1140, 1200, 1260, 1320, 1380]);
		}
		buffer.writeUInt16LE(payload.daylight_saving_time.start_hour_min);
		if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].indexOf(payload.daylight_saving_time.end_month) === -1) {
			throw oneOfError('daylight_saving_time.end_month', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
		}
		// 1:Jan., 2:Feb., 3:Mar., 4:Apr., 5:May, 6:Jun., 7:Jul., 8:Aug., 9:Sep., 10:Oct., 11:Nov., 12:Dec.
		buffer.writeUInt8(payload.daylight_saving_time.end_month);
		var bitOptions = 0;
		// 1:1st, 2: 2nd, 3: 3rd, 4: 4th, 5: last
		bitOptions |= payload.daylight_saving_time.end_week_num << 4;

		// 1：Mon., 2：Tues., 3：Wed., 4：Thurs., 5：Fri., 6：Sat., 7：Sun.
		bitOptions |= payload.daylight_saving_time.end_week_day << 0;
		buffer.writeUInt8(bitOptions);

		if ([0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840, 900, 960, 1020, 1080, 1140, 1200, 1260, 1320, 1380].indexOf(payload.daylight_saving_time.end_hour_min) === -1) {
			throw oneOfError('daylight_saving_time.end_hour_min', [0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840, 900, 960, 1020, 1080, 1140, 1200, 1260, 1320, 1380]);
		}
		buffer.writeUInt16LE(payload.daylight_saving_time.end_hour_min);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x7e
	if ('lora_tx_rdt_max' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x7e);
		if (payload.lora_tx_rdt_max < 0 || payload.lora_tx_rdt_max > 60) {
			throw betweenError('lora_tx_rdt_max', 0, 60);
		}
		buffer.writeUInt8(payload.lora_tx_rdt_max);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x7a
	if ('update_relay_state' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x7a);
		if ([0, 1].indexOf(payload.update_relay_state.state) === -1) {
			throw oneOfError('update_relay_state.state', [0, 1]);
		}
		// 0：normally closed, 1：normally open
		buffer.writeUInt8(payload.update_relay_state.state);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x7b
	if ('clear_power_metering' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x7b);
		buffer.writeUInt8(payload.clear_power_metering.clear);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x7c
	if ('update_open_windows_state' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x7c);
		buffer.writeUInt8(payload.update_open_windows_state.update);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x7d
	if ('send_temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x7d);
		if (payload.send_temperature.temperature < -20 || payload.send_temperature.temperature > 60) {
			throw betweenError('send_temperature.temperature', -20, 60);
		}
		buffer.writeInt16LE(payload.send_temperature.temperature * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x7f
	if ('reset_all_plans' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x7f);
		buffer.writeUInt8(payload.reset_all_plans.reset);
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
function cmdMap() {
	return {
		  "command_queries_reply": "ef",
		  "request_query_all_configurations": "ee",
		  "lorawan_configuration_settings": "cf",
		  "lorawan_configuration_settings.mode": "cf00",
		  "tsl_version": "df",
		  "product_name": "de",
		  "product_pn": "dd",
		  "product_sn": "db",
		  "version": "da",
		  "oem_id": "d9",
		  "device_status": "c8",
		  "product_frequency_band": "d8",
		  "synchronize_time": "b8",
		  "reset": "bf",
		  "reboot": "be",
		  "voltage": "00",
		  "voltage_alarm": "20",
		  "voltage_alarm.collection_error": "2000",
		  "electric_power": "01",
		  "electric_power_alarm": "21",
		  "electric_power_alarm.collection_error": "2100",
		  "power_factor": "02",
		  "power_factor_alarm": "22",
		  "power_factor_alarm.collection_error": "2200",
		  "power_consumption": "03",
		  "power_consumption_alarm": "23",
		  "power_consumption_alarm.collection_error": "2300",
		  "current": "04",
		  "current_alarm": "24",
		  "current_alarm.collection_error": "2400",
		  "equipment_temperature": "05",
		  "equipment_temperature_alarm": "25",
		  "equipment_temperature_alarm.collection_error": "2500",
		  "equipment_temperature_alarm.lower_range_error": "2501",
		  "equipment_temperature_alarm.over_range_error": "2502",
		  "ambient_temperature": "06",
		  "ambient_temperature_alarm": "26",
		  "ambient_temperature_alarm.collection_error": "2600",
		  "ambient_temperature_alarm.no_data": "2603",
		  "relays_status": "07",
		  "overcurrent_alarm": "08",
		  "overcurrent_protection_trigger": "09",
		  "high_current_alarm": "0a",
		  "overvoltage_alarm": "0b",
		  "overvoltage_protect_trigger": "0c",
		  "device_broken_alarm": "0d",
		  "overtemperature_protect": "0e",
		  "freeze_protection": "0f",
		  "open_window_detection": "10",
		  "relays_status_change": "11",
		  "reporting_interval": "60",
		  "reporting_interval.seconds_of_time": "6000",
		  "reporting_interval.minutes_of_time": "6001",
		  "temperature_unit": "61",
		  "led_status": "62",
		  "button_lock_settings": "63",
		  "button_lock_settings.switch_lock_enable": "6300",
		  "button_lock_settings.switch_reset_enable": "6301",
		  "overcurrent_alarm_rule": "64",
		  "overcurrent_alarm_rule.enable": "6400",
		  "overcurrent_alarm_rule.threshold_max": "6401",
		  "overcurrent_protection_rule": "65",
		  "overcurrent_protection_rule.enable": "6500",
		  "overcurrent_protection_rule.threshold_max": "6501",
		  "overvoltage_alarm_rule": "66",
		  "overvoltage_alarm_rule.enable": "6600",
		  "overvoltage_alarm_rule.threshold_max": "6601",
		  "overvoltage_protection_rule": "67",
		  "overvoltage_protection_rule.enable": "6700",
		  "overvoltage_protection_rule.threshold_max": "6701",
		  "high_current_protection_enable": "68",
		  "relay_abnormal_protection_enable": "69",
		  "alarm_deactivation_enable": "6a",
		  "power_on_relay_mode": "6b",
		  "power_metering_enable": "6c",
		  "bluetooth_name": "6d",
		  "d2d_pairing_enable": "6e",
		  "d2d_pairing_settings": "6f",
		  "d2d_pairing_settings._item": "6fxx",
		  "d2d_pairing_settings._item.enable": "6fxx00",
		  "d2d_pairing_settings._item.deveui": "6fxx01",
		  "d2d_pairing_settings._item.name_first": "6fxx02",
		  "d2d_pairing_settings._item.name_last": "6fxx03",
		  "ambient_temperature_enable": "70",
		  "ambient_temperature_settings": "71",
		  "ambient_temperature_settings.source": "7100",
		  "ambient_temperature_settings.timeout": "7101",
		  "ambient_temperature_settings.relay_timeout": "7102",
		  "ambient_temperature_settings.relay_heat": "7103",
		  "temperature_control_enable": "72",
		  "temperature_control_settings": "73",
		  "temperature_control_settings.target": "7300",
		  "temperature_control_settings.tolerance": "7301",
		  "temperature_control_settings.range": "7302",
		  "window_opening_detection_enable": "74",
		  "open_window_settings": "75",
		  "open_window_settings.cooling_rate": "7500",
		  "open_window_settings.stop_temperature_control_time": "7501",
		  "anti_freeze_protection_settings": "76",
		  "anti_freeze_protection_settings.enable": "7600",
		  "anti_freeze_protection_settings.temperature_value": "7601",
		  "schedule_settings": "77",
		  "schedule_settings._item": "77xx",
		  "schedule_settings._item.status": "77xx00",
		  "schedule_settings._item.cycle_settings": "77xx01",
		  "schedule_settings._item.schedule_target": "77xx02",
		  "schedule_settings._item.schedule_action": "77xx03",
		  "schedule_settings._item.schedule_parameter": "77xx04",
		  "d2d_slave_enable": "78",
		  "d2d_slave_settings": "79",
		  "d2d_slave_settings._item": "79xx",
		  "d2d_slave_settings._item.enable": "79xx00",
		  "d2d_slave_settings._item.command": "79xx01",
		  "d2d_slave_settings._item.content": "79xx02",
		  "d2d_slave_settings._item.action": "79xx03",
		  "time_zone": "c7",
		  "daylight_saving_time": "c6",
		  "lora_tx_rdt_max": "7e",
		  "update_relay_state": "7a",
		  "clear_power_metering": "7b",
		  "update_open_windows_state": "7c",
		  "send_temperature": "7d",
		  "reset_all_plans": "7f"
	};
}
function processTemperature(payload) {
	var allTemperatureProperties = {
    "equipment_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "ambient_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "overtemperature_protect.temperature": {
        "coefficient": 0.1,
        "unitName": "℃"
    },
    "freeze_protection.temperature": {
        "coefficient": 0.1,
        "unitName": "℃"
    },
    "open_window_detection.temperature": {
        "coefficient": 0.1,
        "unitName": "℃"
    },
    "temperature_control_settings.range.min": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_control_settings.range.max": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "open_window_settings.cooling_rate": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "anti_freeze_protection_settings.temperature_value": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "send_temperature.temperature": {
        "coefficient": 0.01,
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