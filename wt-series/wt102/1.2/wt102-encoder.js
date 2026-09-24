/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product WT102
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
	//0xff
	if ('request_check_sequence_number' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		if (payload.request_check_sequence_number.sequence_number < 0 || payload.request_check_sequence_number.sequence_number > 255) {
			throw betweenError('request_check_sequence_number.sequence_number', 0, 255);
		}
		buffer.writeUInt8(payload.request_check_sequence_number.sequence_number);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xfe
	if ('request_check_order' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xfe);
		if (payload.request_check_order.order < 0 || payload.request_check_order.order > 255) {
			throw betweenError('request_check_order.order', 0, 255);
		}
		buffer.writeUInt8(payload.request_check_order.order);
		encoded = encoded.concat(buffer.toBytes());
	}
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
	//0xed
	if ('history' in payload) {
		for (var i = 0; i < payload.history.length; i++) {
			var buffer = new Buffer();
			var history = payload.history[i];
			buffer.writeUInt8(0xed);
			// 0：target time, 1：historical time
			buffer.writeUInt8(1);
			buffer.writeUInt32LE(history.timestamp);
			var reset = {};
			for (var k in history) {
				if (history.hasOwnProperty(k) && k !== "timestamp") {
					reset[k] = history[k];
				}
			}
		
			encoded = encoded.concat(buffer.toBytes());
			encoded = encoded.concat(milesightDeviceEncode(reset));
		}
	}
	//0xcf
	if ('lorawan_configuration_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.lorawan_configuration_settings.version)) {
			buffer.writeUInt8(0xcf);
			// 1：1.0.2, 2：1.0.3, 3：1.0.3, 4：1.0.4
			buffer.writeUInt8(0xd8);
			if ([1, 2, 3, 4].indexOf(payload.lorawan_configuration_settings.version) === -1) {
				throw oneOfError('lorawan_configuration_settings.version', [1, 2, 3, 4]);
			}
			// 1：1.0.2, 2：1.0.3, 3：1.0.3, 4：1.0.4
			buffer.writeUInt8(payload.lorawan_configuration_settings.version);
		}
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
	//0x00
	if ('battery' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x00);
		if (payload.battery < 0 || payload.battery > 100) {
			throw betweenError('battery', 0, 100);
		}
		buffer.writeUInt8(payload.battery);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x01
	if ('temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x01);
		if (payload.temperature < -20 || payload.temperature > 60) {
			throw betweenError('temperature', -20, 60);
		}
		buffer.writeInt16LE(payload.temperature * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0f
	if ('temperature_valve' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0f);
		if (payload.temperature_valve < -20 || payload.temperature_valve > 60) {
			throw betweenError('temperature_valve', -20, 60);
		}
		buffer.writeInt16LE(payload.temperature_valve * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x02
	if ('motor_total_stroke' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x02);
		if (payload.motor_total_stroke < 0 || payload.motor_total_stroke > 3028) {
			throw betweenError('motor_total_stroke', 0, 3028);
		}
		buffer.writeUInt16LE(payload.motor_total_stroke);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x03
	if ('motor_position' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x03);
		if (payload.motor_position < 0 || payload.motor_position > 3028) {
			throw betweenError('motor_position', 0, 3028);
		}
		buffer.writeUInt16LE(payload.motor_position);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x04
	if ('valve_opening_degree' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x04);
		if (payload.valve_opening_degree < 0 || payload.valve_opening_degree > 100) {
			throw betweenError('valve_opening_degree', 0, 100);
		}
		buffer.writeUInt8(payload.valve_opening_degree);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x05
	if ('motor_calibration_result_report' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x05);
		if ([0, 1, 2, 3, 4].indexOf(payload.motor_calibration_result_report.status) === -1) {
			throw oneOfError('motor_calibration_result_report.status', [0, 1, 2, 3, 4]);
		}
		// 0：Uncalibrated, 1：Calibration success, 2：Calibration failed,out of range , 3：Calibration failed,temperature control disabled, 4：Calibration failed,uninstalled
		buffer.writeUInt8(payload.motor_calibration_result_report.status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x06
	if ('target_temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x06);
		if (payload.target_temperature < 5 || payload.target_temperature > 35) {
			throw betweenError('target_temperature', 5, 35);
		}
		buffer.writeInt16LE(payload.target_temperature * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x07
	if ('target_valve_opening_degree' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x07);
		if (payload.target_valve_opening_degree < 0 || payload.target_valve_opening_degree > 100) {
			throw betweenError('target_valve_opening_degree', 0, 100);
		}
		buffer.writeUInt8(payload.target_valve_opening_degree);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x08
	if ('low_battery_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x08);
		if (payload.low_battery_alarm.value < 0 || payload.low_battery_alarm.value > 100) {
			throw betweenError('low_battery_alarm.value', 0, 100);
		}
		buffer.writeUInt8(payload.low_battery_alarm.value);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x09
	if ('temperature_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x09);
		buffer.writeUInt8(payload.temperature_alarm.type);
		if (payload.temperature_alarm.type == 0x10) {
			if (payload.temperature_alarm.lower_range_alarm_deactivation.temperature < -20 || payload.temperature_alarm.lower_range_alarm_deactivation.temperature > 60) {
				throw betweenError('temperature_alarm.lower_range_alarm_deactivation.temperature', -20, 60);
			}
			buffer.writeInt16LE(payload.temperature_alarm.lower_range_alarm_deactivation.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x11) {
			if (payload.temperature_alarm.lower_range_alarm_trigger.temperature < -20 || payload.temperature_alarm.lower_range_alarm_trigger.temperature > 60) {
				throw betweenError('temperature_alarm.lower_range_alarm_trigger.temperature', -20, 60);
			}
			buffer.writeInt16LE(payload.temperature_alarm.lower_range_alarm_trigger.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x12) {
			if (payload.temperature_alarm.over_range_alarm_deactivation.temperature < -20 || payload.temperature_alarm.over_range_alarm_deactivation.temperature > 60) {
				throw betweenError('temperature_alarm.over_range_alarm_deactivation.temperature', -20, 60);
			}
			buffer.writeInt16LE(payload.temperature_alarm.over_range_alarm_deactivation.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x13) {
			if (payload.temperature_alarm.over_range_alarm_trigger.temperature < -20 || payload.temperature_alarm.over_range_alarm_trigger.temperature > 60) {
				throw betweenError('temperature_alarm.over_range_alarm_trigger.temperature', -20, 60);
			}
			buffer.writeInt16LE(payload.temperature_alarm.over_range_alarm_trigger.temperature * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0a
	if ('anti_freeze_protection_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0a);
		buffer.writeUInt8(payload.anti_freeze_protection_alarm.type);
		if (payload.anti_freeze_protection_alarm.type == 0x20) {
			if (payload.anti_freeze_protection_alarm.lifted.environment_temperature < -20 || payload.anti_freeze_protection_alarm.lifted.environment_temperature > 60) {
				throw betweenError('anti_freeze_protection_alarm.lifted.environment_temperature', -20, 60);
			}
			buffer.writeInt16LE(payload.anti_freeze_protection_alarm.lifted.environment_temperature * 100);
			if (payload.anti_freeze_protection_alarm.lifted.current_valve_status < 0 || payload.anti_freeze_protection_alarm.lifted.current_valve_status > 100) {
				throw betweenError('anti_freeze_protection_alarm.lifted.current_valve_status', 0, 100);
			}
			buffer.writeUInt8(payload.anti_freeze_protection_alarm.lifted.current_valve_status);
		}
		if (payload.anti_freeze_protection_alarm.type == 0x21) {
			if (payload.anti_freeze_protection_alarm.trigger.environment_temperature < -20 || payload.anti_freeze_protection_alarm.trigger.environment_temperature > 60) {
				throw betweenError('anti_freeze_protection_alarm.trigger.environment_temperature', -20, 60);
			}
			buffer.writeInt16LE(payload.anti_freeze_protection_alarm.trigger.environment_temperature * 100);
			if (payload.anti_freeze_protection_alarm.trigger.current_valve_status < 0 || payload.anti_freeze_protection_alarm.trigger.current_valve_status > 100) {
				throw betweenError('anti_freeze_protection_alarm.trigger.current_valve_status', 0, 100);
			}
			buffer.writeUInt8(payload.anti_freeze_protection_alarm.trigger.current_valve_status);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0b
	if ('mandatory_heating_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0b);
		buffer.writeUInt8(payload.mandatory_heating_alarm.type);
		if (payload.mandatory_heating_alarm.type == 0x20) {
			if (payload.mandatory_heating_alarm.exit.environment_temperature < -20 || payload.mandatory_heating_alarm.exit.environment_temperature > 60) {
				throw betweenError('mandatory_heating_alarm.exit.environment_temperature', -20, 60);
			}
			buffer.writeInt16LE(payload.mandatory_heating_alarm.exit.environment_temperature * 100);
			if (payload.mandatory_heating_alarm.exit.current_valve_status < 0 || payload.mandatory_heating_alarm.exit.current_valve_status > 100) {
				throw betweenError('mandatory_heating_alarm.exit.current_valve_status', 0, 100);
			}
			buffer.writeUInt8(payload.mandatory_heating_alarm.exit.current_valve_status);
			if (payload.mandatory_heating_alarm.exit.battery_level < 0 || payload.mandatory_heating_alarm.exit.battery_level > 100) {
				throw betweenError('mandatory_heating_alarm.exit.battery_level', 0, 100);
			}
			buffer.writeUInt8(payload.mandatory_heating_alarm.exit.battery_level);
		}
		if (payload.mandatory_heating_alarm.type == 0x21) {
			if (payload.mandatory_heating_alarm.enter.environment_temperature < -20 || payload.mandatory_heating_alarm.enter.environment_temperature > 60) {
				throw betweenError('mandatory_heating_alarm.enter.environment_temperature', -20, 60);
			}
			buffer.writeInt16LE(payload.mandatory_heating_alarm.enter.environment_temperature * 100);
			if (payload.mandatory_heating_alarm.enter.current_valve_status < 0 || payload.mandatory_heating_alarm.enter.current_valve_status > 100) {
				throw betweenError('mandatory_heating_alarm.enter.current_valve_status', 0, 100);
			}
			buffer.writeUInt8(payload.mandatory_heating_alarm.enter.current_valve_status);
			if (payload.mandatory_heating_alarm.enter.battery_level < 0 || payload.mandatory_heating_alarm.enter.battery_level > 100) {
				throw betweenError('mandatory_heating_alarm.enter.battery_level', 0, 100);
			}
			buffer.writeUInt8(payload.mandatory_heating_alarm.enter.battery_level);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0c
	if ('auto_away_report' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0c);
		buffer.writeUInt8(payload.auto_away_report.event_type);
		if (payload.auto_away_report.event_type == 0x20) {
			if ([0, 1].indexOf(payload.auto_away_report.inactive_by_target_temperature.state) === -1) {
				throw oneOfError('auto_away_report.inactive_by_target_temperature.state', [0, 1]);
			}
			// 0：Unoccupied, 1：Occupied
			buffer.writeUInt8(payload.auto_away_report.inactive_by_target_temperature.state);
			if (payload.auto_away_report.inactive_by_target_temperature.environment_temperature < -20 || payload.auto_away_report.inactive_by_target_temperature.environment_temperature > 60) {
				throw betweenError('auto_away_report.inactive_by_target_temperature.environment_temperature', -20, 60);
			}
			buffer.writeInt16LE(payload.auto_away_report.inactive_by_target_temperature.environment_temperature * 100);
			if (payload.auto_away_report.inactive_by_target_temperature.target_temperature < 5 || payload.auto_away_report.inactive_by_target_temperature.target_temperature > 35) {
				throw betweenError('auto_away_report.inactive_by_target_temperature.target_temperature', 5, 35);
			}
			buffer.writeInt16LE(payload.auto_away_report.inactive_by_target_temperature.target_temperature * 100);
		}
		if (payload.auto_away_report.event_type == 0x21) {
			if ([0, 1].indexOf(payload.auto_away_report.active_by_target_temperature.state) === -1) {
				throw oneOfError('auto_away_report.active_by_target_temperature.state', [0, 1]);
			}
			// 0：Unoccupied, 1：Occupied
			buffer.writeUInt8(payload.auto_away_report.active_by_target_temperature.state);
			if (payload.auto_away_report.active_by_target_temperature.environment_temperature < -20 || payload.auto_away_report.active_by_target_temperature.environment_temperature > 60) {
				throw betweenError('auto_away_report.active_by_target_temperature.environment_temperature', -20, 60);
			}
			buffer.writeInt16LE(payload.auto_away_report.active_by_target_temperature.environment_temperature * 100);
			if (payload.auto_away_report.active_by_target_temperature.target_temperature < 5 || payload.auto_away_report.active_by_target_temperature.target_temperature > 35) {
				throw betweenError('auto_away_report.active_by_target_temperature.target_temperature', 5, 35);
			}
			buffer.writeInt16LE(payload.auto_away_report.active_by_target_temperature.target_temperature * 100);
		}
		if (payload.auto_away_report.event_type == 0x22) {
			if ([0, 1].indexOf(payload.auto_away_report.inactive_by_target_valve_opening.state) === -1) {
				throw oneOfError('auto_away_report.inactive_by_target_valve_opening.state', [0, 1]);
			}
			// 0：Unoccupied, 1：Occupied
			buffer.writeUInt8(payload.auto_away_report.inactive_by_target_valve_opening.state);
			if (payload.auto_away_report.inactive_by_target_valve_opening.environment_temperature < -20 || payload.auto_away_report.inactive_by_target_valve_opening.environment_temperature > 60) {
				throw betweenError('auto_away_report.inactive_by_target_valve_opening.environment_temperature', -20, 60);
			}
			buffer.writeInt16LE(payload.auto_away_report.inactive_by_target_valve_opening.environment_temperature * 100);
			if (payload.auto_away_report.inactive_by_target_valve_opening.target_valve_opening < 0 || payload.auto_away_report.inactive_by_target_valve_opening.target_valve_opening > 100) {
				throw betweenError('auto_away_report.inactive_by_target_valve_opening.target_valve_opening', 0, 100);
			}
			buffer.writeUInt8(payload.auto_away_report.inactive_by_target_valve_opening.target_valve_opening);
		}
		if (payload.auto_away_report.event_type == 0x23) {
			if ([0, 1].indexOf(payload.auto_away_report.active_by_target_valve_opening.state) === -1) {
				throw oneOfError('auto_away_report.active_by_target_valve_opening.state', [0, 1]);
			}
			// 0：Unoccupied, 1：Occupied
			buffer.writeUInt8(payload.auto_away_report.active_by_target_valve_opening.state);
			if (payload.auto_away_report.active_by_target_valve_opening.environment_temperature < -20 || payload.auto_away_report.active_by_target_valve_opening.environment_temperature > 60) {
				throw betweenError('auto_away_report.active_by_target_valve_opening.environment_temperature', -20, 60);
			}
			buffer.writeInt16LE(payload.auto_away_report.active_by_target_valve_opening.environment_temperature * 100);
			if (payload.auto_away_report.active_by_target_valve_opening.target_valve_opening < 0 || payload.auto_away_report.active_by_target_valve_opening.target_valve_opening > 100) {
				throw betweenError('auto_away_report.active_by_target_valve_opening.target_valve_opening', 0, 100);
			}
			buffer.writeUInt8(payload.auto_away_report.active_by_target_valve_opening.target_valve_opening);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0d
	if ('window_opening_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0d);
		buffer.writeUInt8(payload.window_opening_alarm.type);
		if (payload.window_opening_alarm.type == 0x20) {
			if ([0, 1].indexOf(payload.window_opening_alarm.release.state) === -1) {
				throw oneOfError('window_opening_alarm.release.state', [0, 1]);
			}
			// 0：Normal, 1：Open
			buffer.writeUInt8(payload.window_opening_alarm.release.state);
			if (payload.window_opening_alarm.release.environment_temperature < -20 || payload.window_opening_alarm.release.environment_temperature > 60) {
				throw betweenError('window_opening_alarm.release.environment_temperature', -20, 60);
			}
			buffer.writeInt16LE(payload.window_opening_alarm.release.environment_temperature * 100);
		}
		if (payload.window_opening_alarm.type == 0x21) {
			if ([0, 1].indexOf(payload.window_opening_alarm.trigger.state) === -1) {
				throw oneOfError('window_opening_alarm.trigger.state', [0, 1]);
			}
			// 0：Normal, 1：Open
			buffer.writeUInt8(payload.window_opening_alarm.trigger.state);
			if (payload.window_opening_alarm.trigger.environment_temperature < -20 || payload.window_opening_alarm.trigger.environment_temperature > 60) {
				throw betweenError('window_opening_alarm.trigger.environment_temperature', -20, 60);
			}
			buffer.writeInt16LE(payload.window_opening_alarm.trigger.environment_temperature * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0e
	if ('periodic_reporting' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0e);
		buffer.writeUInt8(payload.periodic_reporting.report_type);
		if (payload.periodic_reporting.report_type == 0x00) {
			if (payload.periodic_reporting.non_heating_season.target_valve_opening < 0 || payload.periodic_reporting.non_heating_season.target_valve_opening > 100) {
				throw betweenError('periodic_reporting.non_heating_season.target_valve_opening', 0, 100);
			}
			buffer.writeUInt8(payload.periodic_reporting.non_heating_season.target_valve_opening);
			if (payload.periodic_reporting.non_heating_season.battery_level < 0 || payload.periodic_reporting.non_heating_season.battery_level > 100) {
				throw betweenError('periodic_reporting.non_heating_season.battery_level', 0, 100);
			}
			buffer.writeUInt8(payload.periodic_reporting.non_heating_season.battery_level);
		}
		if (payload.periodic_reporting.report_type == 0x01) {
			if (payload.periodic_reporting.target_temperature_for_heating.environment_temperature < -20 || payload.periodic_reporting.target_temperature_for_heating.environment_temperature > 60) {
				throw betweenError('periodic_reporting.target_temperature_for_heating.environment_temperature', -20, 60);
			}
			buffer.writeInt16LE(payload.periodic_reporting.target_temperature_for_heating.environment_temperature * 100);
			if (payload.periodic_reporting.target_temperature_for_heating.current_valve_opening < 0 || payload.periodic_reporting.target_temperature_for_heating.current_valve_opening > 100) {
				throw betweenError('periodic_reporting.target_temperature_for_heating.current_valve_opening', 0, 100);
			}
			buffer.writeUInt8(payload.periodic_reporting.target_temperature_for_heating.current_valve_opening);
			if (payload.periodic_reporting.target_temperature_for_heating.target_temperature < 5 || payload.periodic_reporting.target_temperature_for_heating.target_temperature > 35) {
				throw betweenError('periodic_reporting.target_temperature_for_heating.target_temperature', 5, 35);
			}
			buffer.writeInt16LE(payload.periodic_reporting.target_temperature_for_heating.target_temperature * 100);
			if (payload.periodic_reporting.target_temperature_for_heating.battery_level < 0 || payload.periodic_reporting.target_temperature_for_heating.battery_level > 100) {
				throw betweenError('periodic_reporting.target_temperature_for_heating.battery_level', 0, 100);
			}
			buffer.writeUInt8(payload.periodic_reporting.target_temperature_for_heating.battery_level);
			if (payload.periodic_reporting.target_temperature_for_heating.valve_temperature < -20 || payload.periodic_reporting.target_temperature_for_heating.valve_temperature > 60) {
				throw betweenError('periodic_reporting.target_temperature_for_heating.valve_temperature', -20, 60);
			}
			buffer.writeInt16LE(payload.periodic_reporting.target_temperature_for_heating.valve_temperature * 100);
		}
		if (payload.periodic_reporting.report_type == 0x02) {
			if (payload.periodic_reporting.target_valve_opening_for_heating.environment_temperature < -20 || payload.periodic_reporting.target_valve_opening_for_heating.environment_temperature > 60) {
				throw betweenError('periodic_reporting.target_valve_opening_for_heating.environment_temperature', -20, 60);
			}
			buffer.writeInt16LE(payload.periodic_reporting.target_valve_opening_for_heating.environment_temperature * 100);
			if (payload.periodic_reporting.target_valve_opening_for_heating.current_valve_opening < 0 || payload.periodic_reporting.target_valve_opening_for_heating.current_valve_opening > 100) {
				throw betweenError('periodic_reporting.target_valve_opening_for_heating.current_valve_opening', 0, 100);
			}
			buffer.writeUInt8(payload.periodic_reporting.target_valve_opening_for_heating.current_valve_opening);
			if (payload.periodic_reporting.target_valve_opening_for_heating.target_valve_opening < 0 || payload.periodic_reporting.target_valve_opening_for_heating.target_valve_opening > 100) {
				throw betweenError('periodic_reporting.target_valve_opening_for_heating.target_valve_opening', 0, 100);
			}
			buffer.writeUInt8(payload.periodic_reporting.target_valve_opening_for_heating.target_valve_opening);
			if (payload.periodic_reporting.target_valve_opening_for_heating.battery_level < 0 || payload.periodic_reporting.target_valve_opening_for_heating.battery_level > 100) {
				throw betweenError('periodic_reporting.target_valve_opening_for_heating.battery_level', 0, 100);
			}
			buffer.writeUInt8(payload.periodic_reporting.target_valve_opening_for_heating.battery_level);
			if (payload.periodic_reporting.target_valve_opening_for_heating.valve_temperature < -20 || payload.periodic_reporting.target_valve_opening_for_heating.valve_temperature > 60) {
				throw betweenError('periodic_reporting.target_valve_opening_for_heating.valve_temperature', -20, 60);
			}
			buffer.writeInt16LE(payload.periodic_reporting.target_valve_opening_for_heating.valve_temperature * 100);
		}
		if (payload.periodic_reporting.report_type == 0x03) {
			if (payload.periodic_reporting.integrated_control_for_heating.environment_temperature < -20 || payload.periodic_reporting.integrated_control_for_heating.environment_temperature > 60) {
				throw betweenError('periodic_reporting.integrated_control_for_heating.environment_temperature', -20, 60);
			}
			buffer.writeInt16LE(payload.periodic_reporting.integrated_control_for_heating.environment_temperature * 100);
			if (payload.periodic_reporting.integrated_control_for_heating.current_valve_opening < 0 || payload.periodic_reporting.integrated_control_for_heating.current_valve_opening > 100) {
				throw betweenError('periodic_reporting.integrated_control_for_heating.current_valve_opening', 0, 100);
			}
			buffer.writeUInt8(payload.periodic_reporting.integrated_control_for_heating.current_valve_opening);
			if (payload.periodic_reporting.integrated_control_for_heating.target_temperature < 5 || payload.periodic_reporting.integrated_control_for_heating.target_temperature > 35) {
				throw betweenError('periodic_reporting.integrated_control_for_heating.target_temperature', 5, 35);
			}
			buffer.writeInt16LE(payload.periodic_reporting.integrated_control_for_heating.target_temperature * 100);
			if (payload.periodic_reporting.integrated_control_for_heating.target_valve_opening < 0 || payload.periodic_reporting.integrated_control_for_heating.target_valve_opening > 100) {
				throw betweenError('periodic_reporting.integrated_control_for_heating.target_valve_opening', 0, 100);
			}
			buffer.writeUInt8(payload.periodic_reporting.integrated_control_for_heating.target_valve_opening);
			if (payload.periodic_reporting.integrated_control_for_heating.battery_level < 0 || payload.periodic_reporting.integrated_control_for_heating.battery_level > 100) {
				throw betweenError('periodic_reporting.integrated_control_for_heating.battery_level', 0, 100);
			}
			buffer.writeUInt8(payload.periodic_reporting.integrated_control_for_heating.battery_level);
			if (payload.periodic_reporting.integrated_control_for_heating.valve_temperature < -20 || payload.periodic_reporting.integrated_control_for_heating.valve_temperature > 60) {
				throw betweenError('periodic_reporting.integrated_control_for_heating.valve_temperature', -20, 60);
			}
			buffer.writeInt16LE(payload.periodic_reporting.integrated_control_for_heating.valve_temperature * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xc9
	if ('random_key' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xc9);
		if ([0, 1].indexOf(payload.random_key) === -1) {
			throw oneOfError('random_key', [0, 1]);
		}
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.random_key);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xc4
	if ('auto_p_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xc4);
		if ([0, 1].indexOf(payload.auto_p_enable) === -1) {
			throw oneOfError('auto_p_enable', [0, 1]);
		}
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.auto_p_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x60
	if ('temperature_unit' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x60);
		if ([0, 1].indexOf(payload.temperature_unit) === -1) {
			throw oneOfError('temperature_unit', [0, 1]);
		}
		// 0：℃, 1：℉
		buffer.writeUInt8(payload.temperature_unit);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x61
	if ('temperature_source_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x61);
		if ([0, 1, 2].indexOf(payload.temperature_source_settings.type) === -1) {
			throw oneOfError('temperature_source_settings.type', [0, 1, 2]);
		}
		// 0：Internal NTC, 1：External NTC, 2：LoRa Receive
		buffer.writeUInt8(payload.temperature_source_settings.type);
		if (payload.temperature_source_settings.type == 0x01) {
			if (payload.temperature_source_settings.external_ntc_reception.timeout < 1 || payload.temperature_source_settings.external_ntc_reception.timeout > 1440) {
				throw betweenError('temperature_source_settings.external_ntc_reception.timeout', 1, 1440);
			}
			buffer.writeUInt16LE(payload.temperature_source_settings.external_ntc_reception.timeout);
			if ([0, 1, 2].indexOf(payload.temperature_source_settings.external_ntc_reception.timeout_response) === -1) {
				throw oneOfError('temperature_source_settings.external_ntc_reception.timeout_response', [0, 1, 2]);
			}
			// 0: Maintaining State Control, 1: Close the Valve, 2: Switch to Internal NTC Control
			buffer.writeUInt8(payload.temperature_source_settings.external_ntc_reception.timeout_response);
		}
		if (payload.temperature_source_settings.type == 0x02) {
			if (payload.temperature_source_settings.lorawan_reception.timeout < 1 || payload.temperature_source_settings.lorawan_reception.timeout > 1440) {
				throw betweenError('temperature_source_settings.lorawan_reception.timeout', 1, 1440);
			}
			buffer.writeUInt16LE(payload.temperature_source_settings.lorawan_reception.timeout);
			if ([0, 1, 2].indexOf(payload.temperature_source_settings.lorawan_reception.timeout_response) === -1) {
				throw oneOfError('temperature_source_settings.lorawan_reception.timeout_response', [0, 1, 2]);
			}
			// 0: Maintaining State Control, 1: Close the Valve, 2: Switch to Internal NTC Control
			buffer.writeUInt8(payload.temperature_source_settings.lorawan_reception.timeout_response);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x62
	if ('environment_temperature_display_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x62);
		if ([0, 1].indexOf(payload.environment_temperature_display_enable) === -1) {
			throw oneOfError('environment_temperature_display_enable', [0, 1]);
		}
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.environment_temperature_display_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x63
	if ('heating_period_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.heating_period_settings.heating_date_settings)) {
			buffer.writeUInt8(0x63);
			buffer.writeUInt8(0x00);
			if (payload.heating_period_settings.heating_date_settings.start_mon < 1 || payload.heating_period_settings.heating_date_settings.start_mon > 12) {
				throw betweenError('heating_period_settings.heating_date_settings.start_mon', 1, 12);
			}
			buffer.writeUInt8(payload.heating_period_settings.heating_date_settings.start_mon);
			if (payload.heating_period_settings.heating_date_settings.start_day < 1 || payload.heating_period_settings.heating_date_settings.start_day > 31) {
				throw betweenError('heating_period_settings.heating_date_settings.start_day', 1, 31);
			}
			buffer.writeUInt8(payload.heating_period_settings.heating_date_settings.start_day);
			if (payload.heating_period_settings.heating_date_settings.end_mon < 1 || payload.heating_period_settings.heating_date_settings.end_mon > 12) {
				throw betweenError('heating_period_settings.heating_date_settings.end_mon', 1, 12);
			}
			buffer.writeUInt8(payload.heating_period_settings.heating_date_settings.end_mon);
			if (payload.heating_period_settings.heating_date_settings.end_day < 1 || payload.heating_period_settings.heating_date_settings.end_day > 31) {
				throw betweenError('heating_period_settings.heating_date_settings.end_day', 1, 31);
			}
			buffer.writeUInt8(payload.heating_period_settings.heating_date_settings.end_day);
		}
		if (isValid(payload.heating_period_settings.heating_period_reporting_interval)) {
			buffer.writeUInt8(0x63);
			buffer.writeUInt8(0x01);
			if ([0, 1].indexOf(payload.heating_period_settings.heating_period_reporting_interval.unit) === -1) {
				throw oneOfError('heating_period_settings.heating_period_reporting_interval.unit', [0, 1]);
			}
			// 0：second, 1：min
			buffer.writeUInt8(payload.heating_period_settings.heating_period_reporting_interval.unit);
			if (payload.heating_period_settings.heating_period_reporting_interval.unit == 0x00) {
				if (payload.heating_period_settings.heating_period_reporting_interval.seconds_of_time < 10 || payload.heating_period_settings.heating_period_reporting_interval.seconds_of_time > 64800) {
					throw betweenError('heating_period_settings.heating_period_reporting_interval.seconds_of_time', 10, 64800);
				}
				buffer.writeUInt16LE(payload.heating_period_settings.heating_period_reporting_interval.seconds_of_time);
			}
			if (payload.heating_period_settings.heating_period_reporting_interval.unit == 0x01) {
				if (payload.heating_period_settings.heating_period_reporting_interval.minutes_of_time < 5 || payload.heating_period_settings.heating_period_reporting_interval.minutes_of_time > 1440) {
					throw betweenError('heating_period_settings.heating_period_reporting_interval.minutes_of_time', 5, 1440);
				}
				buffer.writeUInt16LE(payload.heating_period_settings.heating_period_reporting_interval.minutes_of_time);
			}
		}
		if (isValid(payload.heating_period_settings.non_heating_period_reporting_interval)) {
			buffer.writeUInt8(0x63);
			buffer.writeUInt8(0x02);
			if ([0, 1].indexOf(payload.heating_period_settings.non_heating_period_reporting_interval.unit) === -1) {
				throw oneOfError('heating_period_settings.non_heating_period_reporting_interval.unit', [0, 1]);
			}
			// 0：second, 1：min
			buffer.writeUInt8(payload.heating_period_settings.non_heating_period_reporting_interval.unit);
			if (payload.heating_period_settings.non_heating_period_reporting_interval.unit == 0x00) {
				if (payload.heating_period_settings.non_heating_period_reporting_interval.seconds_of_time < 10 || payload.heating_period_settings.non_heating_period_reporting_interval.seconds_of_time > 64800) {
					throw betweenError('heating_period_settings.non_heating_period_reporting_interval.seconds_of_time', 10, 64800);
				}
				buffer.writeUInt16LE(payload.heating_period_settings.non_heating_period_reporting_interval.seconds_of_time);
			}
			if (payload.heating_period_settings.non_heating_period_reporting_interval.unit == 0x01) {
				if (payload.heating_period_settings.non_heating_period_reporting_interval.minutes_of_time < 5 || payload.heating_period_settings.non_heating_period_reporting_interval.minutes_of_time > 1440) {
					throw betweenError('heating_period_settings.non_heating_period_reporting_interval.minutes_of_time', 5, 1440);
				}
				buffer.writeUInt16LE(payload.heating_period_settings.non_heating_period_reporting_interval.minutes_of_time);
			}
		}
		if (isValid(payload.heating_period_settings.valve_status_control)) {
			buffer.writeUInt8(0x63);
			// 0：Fully Close, 1：Fully Open
			buffer.writeUInt8(0x03);
			if ([0, 1].indexOf(payload.heating_period_settings.valve_status_control) === -1) {
				throw oneOfError('heating_period_settings.valve_status_control', [0, 1]);
			}
			// 0：Fully Close, 1：Fully Open
			buffer.writeUInt8(payload.heating_period_settings.valve_status_control);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x65
	if ('target_temperature_control_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.target_temperature_control_settings.enable)) {
			buffer.writeUInt8(0x65);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.target_temperature_control_settings.enable) === -1) {
				throw oneOfError('target_temperature_control_settings.enable', [0, 1]);
			}
			// 0：Disable, 1：Enable
			buffer.writeUInt8(payload.target_temperature_control_settings.enable);
		}
		if (isValid(payload.target_temperature_control_settings.target_temperature_resolution)) {
			buffer.writeUInt8(0x65);
			// 0：0.5, 1：1
			buffer.writeUInt8(0x01);
			if ([0, 1].indexOf(payload.target_temperature_control_settings.target_temperature_resolution) === -1) {
				throw oneOfError('target_temperature_control_settings.target_temperature_resolution', [0, 1]);
			}
			// 0：0.5, 1：1
			buffer.writeUInt8(payload.target_temperature_control_settings.target_temperature_resolution);
		}
		if (isValid(payload.target_temperature_control_settings.under_temperature_side_deadband)) {
			buffer.writeUInt8(0x65);
			buffer.writeUInt8(0x02);
			if (payload.target_temperature_control_settings.under_temperature_side_deadband < 0.1 || payload.target_temperature_control_settings.under_temperature_side_deadband > 5) {
				throw betweenError('target_temperature_control_settings.under_temperature_side_deadband', 0.1, 5);
			}
			buffer.writeInt16LE(payload.target_temperature_control_settings.under_temperature_side_deadband * 100);
		}
		if (isValid(payload.target_temperature_control_settings.over_temperature_side_deadband)) {
			buffer.writeUInt8(0x65);
			buffer.writeUInt8(0x03);
			if (payload.target_temperature_control_settings.over_temperature_side_deadband < 0.1 || payload.target_temperature_control_settings.over_temperature_side_deadband > 5) {
				throw betweenError('target_temperature_control_settings.over_temperature_side_deadband', 0.1, 5);
			}
			buffer.writeInt16LE(payload.target_temperature_control_settings.over_temperature_side_deadband * 100);
		}
		if (isValid(payload.target_temperature_control_settings.target_temperature_adjustment_range_min)) {
			buffer.writeUInt8(0x65);
			buffer.writeUInt8(0x04);
			if (payload.target_temperature_control_settings.target_temperature_adjustment_range_min < 5 || payload.target_temperature_control_settings.target_temperature_adjustment_range_min > 35) {
				throw betweenError('target_temperature_control_settings.target_temperature_adjustment_range_min', 5, 35);
			}
			buffer.writeInt16LE(payload.target_temperature_control_settings.target_temperature_adjustment_range_min * 100);
		}
		if (isValid(payload.target_temperature_control_settings.target_temperature_adjustment_range_max)) {
			buffer.writeUInt8(0x65);
			buffer.writeUInt8(0x05);
			if (payload.target_temperature_control_settings.target_temperature_adjustment_range_max < 5 || payload.target_temperature_control_settings.target_temperature_adjustment_range_max > 35) {
				throw betweenError('target_temperature_control_settings.target_temperature_adjustment_range_max', 5, 35);
			}
			buffer.writeInt16LE(payload.target_temperature_control_settings.target_temperature_adjustment_range_max * 100);
		}
		if (isValid(payload.target_temperature_control_settings.mode_settings)) {
			buffer.writeUInt8(0x65);
			buffer.writeUInt8(0x06);
			if ([0, 1, 2].indexOf(payload.target_temperature_control_settings.mode_settings.mode) === -1) {
				throw oneOfError('target_temperature_control_settings.mode_settings.mode', [0, 1, 2]);
			}
			// 0：Automatic Temperature Control, 1：Valve Opening Control, 2：Integrated Control
			buffer.writeUInt8(payload.target_temperature_control_settings.mode_settings.mode);
			if (payload.target_temperature_control_settings.mode_settings.mode == 0x00) {
				if (payload.target_temperature_control_settings.mode_settings.auto_control.target_temperature < 5 || payload.target_temperature_control_settings.mode_settings.auto_control.target_temperature > 35) {
					throw betweenError('target_temperature_control_settings.mode_settings.auto_control.target_temperature', 5, 35);
				}
				buffer.writeInt16LE(payload.target_temperature_control_settings.mode_settings.auto_control.target_temperature * 100);
			}
			if (payload.target_temperature_control_settings.mode_settings.mode == 0x01) {
				if (payload.target_temperature_control_settings.mode_settings.valve_control.target_valve_status < 0 || payload.target_temperature_control_settings.mode_settings.valve_control.target_valve_status > 100) {
					throw betweenError('target_temperature_control_settings.mode_settings.valve_control.target_valve_status', 0, 100);
				}
				buffer.writeUInt8(payload.target_temperature_control_settings.mode_settings.valve_control.target_valve_status);
			}
			if (payload.target_temperature_control_settings.mode_settings.mode == 0x02) {
				if (payload.target_temperature_control_settings.mode_settings.intergrated_control.target_temperature < 5 || payload.target_temperature_control_settings.mode_settings.intergrated_control.target_temperature > 35) {
					throw betweenError('target_temperature_control_settings.mode_settings.intergrated_control.target_temperature', 5, 35);
				}
				buffer.writeInt16LE(payload.target_temperature_control_settings.mode_settings.intergrated_control.target_temperature * 100);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x66
	if ('window_opening_detection_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x66);
		if ([0, 1].indexOf(payload.window_opening_detection_settings.enable) === -1) {
			throw oneOfError('window_opening_detection_settings.enable', [0, 1]);
		}
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.window_opening_detection_settings.enable);
		if (payload.window_opening_detection_settings.cooling_rate < 2 || payload.window_opening_detection_settings.cooling_rate > 10) {
			throw betweenError('window_opening_detection_settings.cooling_rate', 2, 10);
		}
		buffer.writeInt16LE(payload.window_opening_detection_settings.cooling_rate * 100);
		if ([0, 1].indexOf(payload.window_opening_detection_settings.valve_status) === -1) {
			throw oneOfError('window_opening_detection_settings.valve_status', [0, 1]);
		}
		// 0：Remains Unchanged, 1：Close the Valve
		buffer.writeUInt8(payload.window_opening_detection_settings.valve_status);
		if (payload.window_opening_detection_settings.stop_temperature_control_time < 1 || payload.window_opening_detection_settings.stop_temperature_control_time > 1440) {
			throw betweenError('window_opening_detection_settings.stop_temperature_control_time', 1, 1440);
		}
		buffer.writeUInt16LE(payload.window_opening_detection_settings.stop_temperature_control_time);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x67
	if ('auto_away_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x67);
		if ([0, 1].indexOf(payload.auto_away_settings.enable) === -1) {
			throw oneOfError('auto_away_settings.enable', [0, 1]);
		}
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.auto_away_settings.enable);
		if (payload.auto_away_settings.start_time < 0 || payload.auto_away_settings.start_time > 1439) {
			throw betweenError('auto_away_settings.start_time', 0, 1439);
		}
		buffer.writeUInt16LE(payload.auto_away_settings.start_time);
		if (payload.auto_away_settings.end_time < 0 || payload.auto_away_settings.end_time > 1439) {
			throw betweenError('auto_away_settings.end_time', 0, 1439);
		}
		buffer.writeUInt16LE(payload.auto_away_settings.end_time);
		var bitOptions = 0;
		// 0：Disable, 1：Enable
		bitOptions |= payload.auto_away_settings.cycle_time_sun << 0;

		// 0：Disable, 1：Enable
		bitOptions |= payload.auto_away_settings.cycle_time_mon << 1;

		// 0：Disable, 1：Enable
		bitOptions |= payload.auto_away_settings.cycle_time_tues << 2;

		// 0：Disable, 1：Enable
		bitOptions |= payload.auto_away_settings.cycle_time_wed << 3;

		// 0：Disable, 1：Enable
		bitOptions |= payload.auto_away_settings.cycle_time_thur << 4;

		// 0：Disable, 1：Enable
		bitOptions |= payload.auto_away_settings.cycle_time_fri << 5;

		// 0：Disable, 1：Enable
		bitOptions |= payload.auto_away_settings.cycle_time_sat << 6;

		bitOptions |= payload.auto_away_settings.reserved << 7;
		buffer.writeUInt8(bitOptions);

		if ([0, 1].indexOf(payload.auto_away_settings.energy_saving_settings.mode) === -1) {
			throw oneOfError('auto_away_settings.energy_saving_settings.mode', [0, 1]);
		}
		// 0：Energy Saving Temperature, 1：Energy Saving Valve Opening
		buffer.writeUInt8(payload.auto_away_settings.energy_saving_settings.mode);
		if (payload.auto_away_settings.energy_saving_settings.mode == 0x00) {
			if (payload.auto_away_settings.energy_saving_settings.energy_saving_temperature < 5 || payload.auto_away_settings.energy_saving_settings.energy_saving_temperature > 35) {
				throw betweenError('auto_away_settings.energy_saving_settings.energy_saving_temperature', 5, 35);
			}
			buffer.writeInt16LE(payload.auto_away_settings.energy_saving_settings.energy_saving_temperature * 100);
		}
		if (payload.auto_away_settings.energy_saving_settings.mode == 0x01) {
			if (payload.auto_away_settings.energy_saving_settings.energy_saving_valve_opening_degree < 0 || payload.auto_away_settings.energy_saving_settings.energy_saving_valve_opening_degree > 100) {
				throw betweenError('auto_away_settings.energy_saving_settings.energy_saving_valve_opening_degree', 0, 100);
			}
			buffer.writeUInt8(payload.auto_away_settings.energy_saving_settings.energy_saving_valve_opening_degree);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x68
	if ('anti_freeze_protection_setting' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x68);
		if ([0, 1].indexOf(payload.anti_freeze_protection_setting.enable) === -1) {
			throw oneOfError('anti_freeze_protection_setting.enable', [0, 1]);
		}
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.anti_freeze_protection_setting.enable);
		if (payload.anti_freeze_protection_setting.temperature_value < 1 || payload.anti_freeze_protection_setting.temperature_value > 5) {
			throw betweenError('anti_freeze_protection_setting.temperature_value', 1, 5);
		}
		buffer.writeInt16LE(payload.anti_freeze_protection_setting.temperature_value * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x69
	if ('mandatory_heating_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x69);
		if ([0, 1].indexOf(payload.mandatory_heating_enable) === -1) {
			throw oneOfError('mandatory_heating_enable', [0, 1]);
		}
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.mandatory_heating_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6a
	if ('child_lock' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6a);
		if ([0, 1].indexOf(payload.child_lock.enable) === -1) {
			throw oneOfError('child_lock.enable', [0, 1]);
		}
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.child_lock.enable);
		var bitOptions = 0;
		// 0：Disable, 1：Enable
		bitOptions |= payload.child_lock.system_button << 0;

		// 0：Disable, 1：Enable
		bitOptions |= payload.child_lock.func_button << 1;

		bitOptions |= payload.child_lock.reserved << 2;
		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6b
	if ('motor_stroke_limit' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6b);
		if (payload.motor_stroke_limit < 0 || payload.motor_stroke_limit > 100) {
			throw betweenError('motor_stroke_limit', 0, 100);
		}
		buffer.writeUInt8(payload.motor_stroke_limit);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6c
	if ('temperature_calibration_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6c);
		if ([0, 1].indexOf(payload.temperature_calibration_settings.enable) === -1) {
			throw oneOfError('temperature_calibration_settings.enable', [0, 1]);
		}
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.temperature_calibration_settings.enable);
		if (payload.temperature_calibration_settings.calibration_value < -60 || payload.temperature_calibration_settings.calibration_value > 60) {
			throw betweenError('temperature_calibration_settings.calibration_value', -60, 60);
		}
		buffer.writeInt16LE(payload.temperature_calibration_settings.calibration_value * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6d
	if ('temperature_alarm_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6d);
		if ([0, 1].indexOf(payload.temperature_alarm_settings.enable) === -1) {
			throw oneOfError('temperature_alarm_settings.enable', [0, 1]);
		}
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.temperature_alarm_settings.enable);
		if ([0, 1, 2, 4].indexOf(payload.temperature_alarm_settings.threshold_condition) === -1) {
			throw oneOfError('temperature_alarm_settings.threshold_condition', [0, 1, 2, 4]);
		}
		// 0:Disable, 1:Condition: x<A, 2:Condition: x>B, 4:Condition: x<A or x>B
		buffer.writeUInt8(payload.temperature_alarm_settings.threshold_condition);
		if (payload.temperature_alarm_settings.threshold_min < -20 || payload.temperature_alarm_settings.threshold_min > 60) {
			throw betweenError('temperature_alarm_settings.threshold_min', -20, 60);
		}
		buffer.writeInt16LE(payload.temperature_alarm_settings.threshold_min * 100);
		if (payload.temperature_alarm_settings.threshold_max < -20 || payload.temperature_alarm_settings.threshold_max > 60) {
			throw betweenError('temperature_alarm_settings.threshold_max', -20, 60);
		}
		buffer.writeInt16LE(payload.temperature_alarm_settings.threshold_max * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6e
	if ('schedule_settings' in payload) {
		var buffer = new Buffer();
		for (var schedule_settings_id = 0; schedule_settings_id < (payload.schedule_settings && payload.schedule_settings.length); schedule_settings_id++) {
			var schedule_settings_item = payload.schedule_settings[schedule_settings_id];
			var schedule_settings_item_id = schedule_settings_item.id;
			if (schedule_settings_item_id < 0 || schedule_settings_item_id > 15) {
				throw betweenError('schedule_settings_item_id', 0, 15);
			}

			if (isValid(schedule_settings_item.enable)) {
				buffer.writeUInt8(0x6e);
				buffer.writeUInt8(schedule_settings_item_id);
				// 0：Disable, 1：Enable
				buffer.writeUInt8(0x00);
				if ([0, 1].indexOf(schedule_settings_item.enable) === -1) {
					throw oneOfError('enable', [0, 1]);
				}
				// 0：Disable, 1：Enable
				buffer.writeUInt8(schedule_settings_item.enable);
			}
			if (isValid(schedule_settings_item.start_time)) {
				buffer.writeUInt8(0x6e);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x01);
				if (schedule_settings_item.start_time < 0 || schedule_settings_item.start_time > 1439) {
					throw rangeError('start_time', '[0,1439]');
				}
				buffer.writeUInt16LE(schedule_settings_item.start_time);
			}
			if (isValid(schedule_settings_item.cycle_settings)) {
				buffer.writeUInt8(0x6e);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x02);
				var bitOptions = 0;
				// 0：Disable, 1：Enable
				bitOptions |= schedule_settings_item.cycle_settings.execution_day_sun << 0;

				// 0：Disable, 1：Enable
				bitOptions |= schedule_settings_item.cycle_settings.execution_day_mon << 1;

				// 0：Disable, 1：Enable
				bitOptions |= schedule_settings_item.cycle_settings.execution_day_tues << 2;

				// 0：Disable, 1：Enable
				bitOptions |= schedule_settings_item.cycle_settings.execution_day_wed << 3;

				// 0：Disable, 1：Enable
				bitOptions |= schedule_settings_item.cycle_settings.execution_day_thur << 4;

				// 0：Disable, 1：Enable
				bitOptions |= schedule_settings_item.cycle_settings.execution_day_fri << 5;

				// 0：Disable, 1：Enable
				bitOptions |= schedule_settings_item.cycle_settings.execution_day_sat << 6;

				bitOptions |= schedule_settings_item.cycle_settings.reserved << 7;
				buffer.writeUInt8(bitOptions);

			}
			if (isValid(schedule_settings_item.temperature_control_mode)) {
				buffer.writeUInt8(0x6e);
				buffer.writeUInt8(schedule_settings_item_id);
				// 0：Automatic Temperature Control, 1：Valve Opening Control, 2：Integrated Control
				buffer.writeUInt8(0x03);
				if ([0, 1, 2].indexOf(schedule_settings_item.temperature_control_mode) === -1) {
					throw oneOfError('temperature_control_mode', [0, 1, 2]);
				}
				// 0：Automatic Temperature Control, 1：Valve Opening Control, 2：Integrated Control
				buffer.writeUInt8(schedule_settings_item.temperature_control_mode);
			}
			if (isValid(schedule_settings_item.target_temperature)) {
				buffer.writeUInt8(0x6e);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x04);
				if (schedule_settings_item.target_temperature < 5 || schedule_settings_item.target_temperature > 35) {
					throw betweenError('target_temperature', 5, 35);
				}
				buffer.writeInt16LE(schedule_settings_item.target_temperature * 100);
			}
			if (isValid(schedule_settings_item.target_valve_status)) {
				buffer.writeUInt8(0x6e);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x05);
				if (schedule_settings_item.target_valve_status < 0 || schedule_settings_item.target_valve_status > 100) {
					throw betweenError('target_valve_status', 0, 100);
				}
				buffer.writeUInt8(schedule_settings_item.target_valve_status);
			}
			if (isValid(schedule_settings_item.pre_heating_enable)) {
				buffer.writeUInt8(0x6e);
				buffer.writeUInt8(schedule_settings_item_id);
				// 0：Disable, 1：Enable
				buffer.writeUInt8(0x06);
				if ([0, 1].indexOf(schedule_settings_item.pre_heating_enable) === -1) {
					throw oneOfError('pre_heating_enable', [0, 1]);
				}
				// 0：Disable, 1：Enable
				buffer.writeUInt8(schedule_settings_item.pre_heating_enable);
			}
			if (isValid(schedule_settings_item.pre_heating_mode)) {
				buffer.writeUInt8(0x6e);
				buffer.writeUInt8(schedule_settings_item_id);
				// 0：Auto, 1：Manual
				buffer.writeUInt8(0x07);
				if ([0, 1].indexOf(schedule_settings_item.pre_heating_mode) === -1) {
					throw oneOfError('pre_heating_mode', [0, 1]);
				}
				// 0：Auto, 1：Manual
				buffer.writeUInt8(schedule_settings_item.pre_heating_mode);
			}
			if (isValid(schedule_settings_item.pre_heating_manual_time)) {
				buffer.writeUInt8(0x6e);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x08);
				if (schedule_settings_item.pre_heating_manual_time < 1 || schedule_settings_item.pre_heating_manual_time > 1440) {
					throw betweenError('pre_heating_manual_time', 1, 1440);
				}
				buffer.writeUInt16LE(schedule_settings_item.pre_heating_manual_time);
			}
			if (isValid(schedule_settings_item.report_cycle)) {
				buffer.writeUInt8(0x6e);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x09);
				if (schedule_settings_item.report_cycle < 5 || schedule_settings_item.report_cycle > 1440) {
					throw betweenError('report_cycle', 5, 1440);
				}
				buffer.writeUInt16LE(schedule_settings_item.report_cycle);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6f
	if ('change_report_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6f);
		if ([0, 1].indexOf(payload.change_report_enable) === -1) {
			throw oneOfError('change_report_enable', [0, 1]);
		}
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.change_report_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x70
	if ('motor_controllable_range' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x70);
		if ([0, 1].indexOf(payload.motor_controllable_range.enable) === -1) {
			throw oneOfError('motor_controllable_range.enable', [0, 1]);
		}
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.motor_controllable_range.enable);
		if (payload.motor_controllable_range.distance < 0 || payload.motor_controllable_range.distance > 666) {
			throw betweenError('motor_controllable_range.distance', 0, 666);
		}
		buffer.writeUInt16LE(payload.motor_controllable_range.distance * 100);
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
	//0xc5
	if ('data_storage_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.data_storage_settings.enable)) {
			buffer.writeUInt8(0xc5);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.data_storage_settings.enable) === -1) {
				throw oneOfError('data_storage_settings.enable', [0, 1]);
			}
			// 0：Disable, 1：Enable
			buffer.writeUInt8(payload.data_storage_settings.enable);
		}
		if (isValid(payload.data_storage_settings.retransmission_enable)) {
			buffer.writeUInt8(0xc5);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(0x01);
			if ([0, 1].indexOf(payload.data_storage_settings.retransmission_enable) === -1) {
				throw oneOfError('data_storage_settings.retransmission_enable', [0, 1]);
			}
			// 0：Disable, 1：Enable
			buffer.writeUInt8(payload.data_storage_settings.retransmission_enable);
		}
		if (isValid(payload.data_storage_settings.retransmission_interval)) {
			buffer.writeUInt8(0xc5);
			buffer.writeUInt8(0x02);
			if (payload.data_storage_settings.retransmission_interval < 30 || payload.data_storage_settings.retransmission_interval > 1200) {
				throw betweenError('data_storage_settings.retransmission_interval', 30, 1200);
			}
			buffer.writeUInt16LE(payload.data_storage_settings.retransmission_interval);
		}
		if (isValid(payload.data_storage_settings.retrieval_interval)) {
			buffer.writeUInt8(0xc5);
			buffer.writeUInt8(0x03);
			if (payload.data_storage_settings.retrieval_interval < 30 || payload.data_storage_settings.retrieval_interval > 1200) {
				throw betweenError('data_storage_settings.retrieval_interval', 30, 1200);
			}
			buffer.writeUInt16LE(payload.data_storage_settings.retrieval_interval);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xb6
	if ('reconnect' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb6);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xb7
	if ('set_time' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb7);
		if (payload.set_time.timestamp < 0 || payload.set_time.timestamp > 4294967295) {
			throw rangeError('set_time.timestamp', '[0,4294967295]');
		}
		buffer.writeUInt32LE(payload.set_time.timestamp);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xb5
	if ('collect_data' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb5);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xbd
	if ('clear_historical_data' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xbd);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xbc
	if ('stop_historical_data_retrieval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xbc);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xbb
	if ('retrieve_historical_data_by_time_range' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xbb);
		if (payload.retrieve_historical_data_by_time_range.start_time < 0 || payload.retrieve_historical_data_by_time_range.start_time > 4294967295) {
			throw rangeError('retrieve_historical_data_by_time_range.start_time', '[0,4294967295]');
		}
		buffer.writeUInt32LE(payload.retrieve_historical_data_by_time_range.start_time);
		if (payload.retrieve_historical_data_by_time_range.end_time < 0 || payload.retrieve_historical_data_by_time_range.end_time > 4294967295) {
			throw rangeError('retrieve_historical_data_by_time_range.end_time', '[0,4294967295]');
		}
		buffer.writeUInt32LE(payload.retrieve_historical_data_by_time_range.end_time);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xba
	if ('retrieve_historical_data_by_time' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xba);
		if (payload.retrieve_historical_data_by_time.time < 0 || payload.retrieve_historical_data_by_time.time > 4294967295) {
			throw rangeError('retrieve_historical_data_by_time.time', '[0,4294967295]');
		}
		buffer.writeUInt32LE(payload.retrieve_historical_data_by_time.time);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x57
	if ('query_motor_stroke_position' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x57);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x58
	if ('calibrate_motor' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x58);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x59
	if ('set_target_valve_opening_degree' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x59);
		if (payload.set_target_valve_opening_degree.value < 0 || payload.set_target_valve_opening_degree.value > 100) {
			throw betweenError('set_target_valve_opening_degree.value', 0, 100);
		}
		buffer.writeUInt8(payload.set_target_valve_opening_degree.value);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x5a
	if ('set_target_temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x5a);
		if (payload.set_target_temperature.value < 5 || payload.set_target_temperature.value > 35) {
			throw betweenError('set_target_temperature.value', 5, 35);
		}
		buffer.writeInt16LE(payload.set_target_temperature.value * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x5b
	if ('set_temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x5b);
		if (payload.set_temperature.value < -20 || payload.set_temperature.value > 60) {
			throw betweenError('set_temperature.value', -20, 60);
		}
		buffer.writeInt16LE(payload.set_temperature.value * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x5c
	if ('set_occupancy_state' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x5c);
		if ([0, 1].indexOf(payload.set_occupancy_state.state) === -1) {
			throw oneOfError('set_occupancy_state.state', [0, 1]);
		}
		// 0：Unoccupied, 1：Occupied
		buffer.writeUInt8(payload.set_occupancy_state.state);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x5d
	if ('set_opening_window' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x5d);
		if ([0, 1].indexOf(payload.set_opening_window.state) === -1) {
			throw oneOfError('set_opening_window.state', [0, 1]);
		}
		// 0：Normal, 1：Open
		buffer.writeUInt8(payload.set_opening_window.state);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x5e
	if ('delete_schedule' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x5e);
		if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 255].indexOf(payload.delete_schedule.type) === -1) {
			throw oneOfError('delete_schedule.type', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 255]);
		}
		// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8, 8：Schedule9, 9：Schedule10, 10：Schedule11, 11：Schedule12, 12：Schedule13, 13：Schedule14, 14：Schedule15, 15：Schedule16, 255：Reset All 
		buffer.writeUInt8(payload.delete_schedule.type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xbe
	if ('reboot' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xbe);
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

function rangeError(path, range) {
	return new Error(path + ' must be in range ' + range);
}
function cmdMap() {
	return {
		  "request_check_sequence_number": "ff",
		  "request_check_order": "fe",
		  "command_queries_reply": "ef",
		  "request_query_all_configurations": "ee",
		  "historical_data_report": "ed",
		  "lorawan_configuration_settings": "cf",
		  "lorawan_configuration_settings.version": "cfd8",
		  "lorawan_configuration_settings.mode": "cf00",
		  "tsl_version": "df",
		  "product_name": "de",
		  "product_pn": "dd",
		  "product_sn": "db",
		  "version": "da",
		  "oem_id": "d9",
		  "device_status": "c8",
		  "product_frequency_band": "d8",
		  "battery": "00",
		  "temperature": "01",
		  "temperature_valve": "0f",
		  "motor_total_stroke": "02",
		  "motor_position": "03",
		  "valve_opening_degree": "04",
		  "motor_calibration_result_report": "05",
		  "target_temperature": "06",
		  "target_valve_opening_degree": "07",
		  "low_battery_alarm": "08",
		  "temperature_alarm": "09",
		  "temperature_alarm.lower_range_alarm_deactivation": "0910",
		  "temperature_alarm.lower_range_alarm_trigger": "0911",
		  "temperature_alarm.over_range_alarm_deactivation": "0912",
		  "temperature_alarm.over_range_alarm_trigger": "0913",
		  "anti_freeze_protection_alarm": "0a",
		  "anti_freeze_protection_alarm.lifted": "0a20",
		  "anti_freeze_protection_alarm.trigger": "0a21",
		  "mandatory_heating_alarm": "0b",
		  "mandatory_heating_alarm.exit": "0b20",
		  "mandatory_heating_alarm.enter": "0b21",
		  "auto_away_report": "0c",
		  "auto_away_report.inactive_by_target_temperature": "0c20",
		  "auto_away_report.active_by_target_temperature": "0c21",
		  "auto_away_report.inactive_by_target_valve_opening": "0c22",
		  "auto_away_report.active_by_target_valve_opening": "0c23",
		  "window_opening_alarm": "0d",
		  "window_opening_alarm.release": "0d20",
		  "window_opening_alarm.trigger": "0d21",
		  "periodic_reporting": "0e",
		  "periodic_reporting.non_heating_season": "0e00",
		  "periodic_reporting.target_temperature_for_heating": "0e01",
		  "periodic_reporting.target_valve_opening_for_heating": "0e02",
		  "periodic_reporting.integrated_control_for_heating": "0e03",
		  "random_key": "c9",
		  "auto_p_enable": "c4",
		  "temperature_unit": "60",
		  "temperature_source_settings": "61",
		  "temperature_source_settings.external_ntc_reception": "6101",
		  "temperature_source_settings.lorawan_reception": "6102",
		  "environment_temperature_display_enable": "62",
		  "heating_period_settings": "63",
		  "heating_period_settings.heating_date_settings": "6300",
		  "heating_period_settings.heating_period_reporting_interval": "6301",
		  "heating_period_settings.heating_period_reporting_interval.seconds_of_time": "630100",
		  "heating_period_settings.heating_period_reporting_interval.minutes_of_time": "630101",
		  "heating_period_settings.non_heating_period_reporting_interval": "6302",
		  "heating_period_settings.non_heating_period_reporting_interval.seconds_of_time": "630200",
		  "heating_period_settings.non_heating_period_reporting_interval.minutes_of_time": "630201",
		  "heating_period_settings.valve_status_control": "6303",
		  "target_temperature_control_settings": "65",
		  "target_temperature_control_settings.enable": "6500",
		  "target_temperature_control_settings.target_temperature_resolution": "6501",
		  "target_temperature_control_settings.under_temperature_side_deadband": "6502",
		  "target_temperature_control_settings.over_temperature_side_deadband": "6503",
		  "target_temperature_control_settings.target_temperature_adjustment_range_min": "6504",
		  "target_temperature_control_settings.target_temperature_adjustment_range_max": "6505",
		  "target_temperature_control_settings.mode_settings": "6506",
		  "target_temperature_control_settings.mode_settings.auto_control": "650600",
		  "target_temperature_control_settings.mode_settings.valve_control": "650601",
		  "target_temperature_control_settings.mode_settings.intergrated_control": "650602",
		  "window_opening_detection_settings": "66",
		  "auto_away_settings": "67",
		  "anti_freeze_protection_setting": "68",
		  "mandatory_heating_enable": "69",
		  "child_lock": "6a",
		  "motor_stroke_limit": "6b",
		  "temperature_calibration_settings": "6c",
		  "temperature_alarm_settings": "6d",
		  "schedule_settings": "6e",
		  "schedule_settings._item": "6exx",
		  "schedule_settings._item.enable": "6exx00",
		  "schedule_settings._item.start_time": "6exx01",
		  "schedule_settings._item.cycle_settings": "6exx02",
		  "schedule_settings._item.temperature_control_mode": "6exx03",
		  "schedule_settings._item.target_temperature": "6exx04",
		  "schedule_settings._item.target_valve_status": "6exx05",
		  "schedule_settings._item.pre_heating_enable": "6exx06",
		  "schedule_settings._item.pre_heating_mode": "6exx07",
		  "schedule_settings._item.pre_heating_manual_time": "6exx08",
		  "schedule_settings._item.report_cycle": "6exx09",
		  "change_report_enable": "6f",
		  "motor_controllable_range": "70",
		  "time_zone": "c7",
		  "daylight_saving_time": "c6",
		  "data_storage_settings": "c5",
		  "data_storage_settings.enable": "c500",
		  "data_storage_settings.retransmission_enable": "c501",
		  "data_storage_settings.retransmission_interval": "c502",
		  "data_storage_settings.retrieval_interval": "c503",
		  "reconnect": "b6",
		  "set_time": "b7",
		  "collect_data": "b5",
		  "clear_historical_data": "bd",
		  "stop_historical_data_retrieval": "bc",
		  "retrieve_historical_data_by_time_range": "bb",
		  "retrieve_historical_data_by_time": "ba",
		  "query_motor_stroke_position": "57",
		  "calibrate_motor": "58",
		  "set_target_valve_opening_degree": "59",
		  "set_target_temperature": "5a",
		  "set_temperature": "5b",
		  "set_occupancy_state": "5c",
		  "set_opening_window": "5d",
		  "delete_schedule": "5e",
		  "reboot": "be"
	};
}
function processTemperature(payload) {
	var allTemperatureProperties = {
    "temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_valve": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "target_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.lower_range_alarm_deactivation.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.lower_range_alarm_trigger.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.over_range_alarm_deactivation.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.over_range_alarm_trigger.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "anti_freeze_protection_alarm.lifted.environment_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "anti_freeze_protection_alarm.trigger.environment_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "mandatory_heating_alarm.exit.environment_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "mandatory_heating_alarm.enter.environment_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "auto_away_report.inactive_by_target_temperature.environment_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "auto_away_report.inactive_by_target_temperature.target_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "auto_away_report.active_by_target_temperature.environment_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "auto_away_report.active_by_target_temperature.target_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "auto_away_report.inactive_by_target_valve_opening.environment_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "auto_away_report.active_by_target_valve_opening.environment_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "window_opening_alarm.release.environment_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "window_opening_alarm.trigger.environment_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "periodic_reporting.target_temperature_for_heating.environment_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "periodic_reporting.target_temperature_for_heating.target_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "periodic_reporting.target_temperature_for_heating.valve_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "periodic_reporting.target_valve_opening_for_heating.environment_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "periodic_reporting.target_valve_opening_for_heating.valve_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "periodic_reporting.integrated_control_for_heating.environment_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "periodic_reporting.integrated_control_for_heating.target_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "periodic_reporting.integrated_control_for_heating.valve_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "target_temperature_control_settings.target_temperature_resolution": {
        "coefficient": null,
        "unitName": "℃"
    },
    "target_temperature_control_settings.under_temperature_side_deadband": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "target_temperature_control_settings.over_temperature_side_deadband": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "target_temperature_control_settings.target_temperature_adjustment_range_min": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "target_temperature_control_settings.target_temperature_adjustment_range_max": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "target_temperature_control_settings.mode_settings.auto_control.target_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "target_temperature_control_settings.mode_settings.intergrated_control.target_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "window_opening_detection_settings.cooling_rate": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "auto_away_settings.energy_saving_settings.energy_saving_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "anti_freeze_protection_setting.temperature_value": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_calibration_settings.calibration_value": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm_settings.threshold_min": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm_settings.threshold_max": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "schedule_settings._item.target_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "set_target_temperature.value": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "set_temperature.value": {
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