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
	var encoded = [];
	//0xff
	if ('request_check_sequence_number' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xff);
		if (payload.request_check_sequence_number.sequence_number < 0 || payload.request_check_sequence_number.sequence_number > 255) {
			throw new Error('request_check_sequence_number.sequence_number must be between 0 and 255');
		}
		buffer.writeUInt8(payload.request_check_sequence_number.sequence_number);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xfe
	if ('request_check_order' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xfe);
		if (payload.request_check_order.order < 0 || payload.request_check_order.order > 255) {
			throw new Error('request_check_order.order must be between 0 and 255');
		}
		buffer.writeUInt8(payload.request_check_order.order);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xee
	if ('request_query_all_configurations' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xee);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xcf
	if ('lorawan_class' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xcf);
		buffer.writeUInt8(0x00);
		// 0：Class A, 1：Class B, 2：Class C, 3：Class CtoB
		var lorawan_class_map = {
			"Class A": 0,
			"Class B": 1,
			"Class C": 2,
			"Class CtoB": 3,
		};
		buffer.writeUInt8(lorawan_class_map[payload.lorawan_class]);
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
			throw new Error('battery must be between 0 and 100');
		}
		buffer.writeUInt8(payload.battery);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x01
	if ('temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x01);
		if (payload.temperature < -20 || payload.temperature > 60) {
			throw new Error('temperature must be between -20 and 60');
		}
		buffer.writeInt16LE(payload.temperature * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x02
	if ('motor_total_stroke' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x02);
		if (payload.motor_total_stroke < 0 || payload.motor_total_stroke > 3028) {
			throw new Error('motor_total_stroke must be between 0 and 3028');
		}
		buffer.writeUInt16LE(payload.motor_total_stroke);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x03
	if ('motor_position' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x03);
		if (payload.motor_position < 0 || payload.motor_position > 3028) {
			throw new Error('motor_position must be between 0 and 3028');
		}
		buffer.writeUInt16LE(payload.motor_position);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x04
	if ('valve_opening_degree' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x04);
		if (payload.valve_opening_degree < 0 || payload.valve_opening_degree > 100) {
			throw new Error('valve_opening_degree must be between 0 and 100');
		}
		buffer.writeUInt8(payload.valve_opening_degree);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x05
	if ('motor_calibration_result_report' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x05);
		// 0：Uncalibrated, 1：Calibration success, 2：Calibration failed,out of range , 3：Calibration failed,temperature control disabled, 4：Calibration failed,uninstalled
		buffer.writeUInt8(payload.motor_calibration_result_report.status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x06
	if ('target_temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x06);
		if (payload.target_temperature < -20 || payload.target_temperature > 60) {
			throw new Error('target_temperature must be between -20 and 60');
		}
		buffer.writeInt16LE(payload.target_temperature * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x07
	if ('target_valve_opening_degree' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x07);
		if (payload.target_valve_opening_degree < 0 || payload.target_valve_opening_degree > 100) {
			throw new Error('target_valve_opening_degree must be between 0 and 100');
		}
		buffer.writeUInt8(payload.target_valve_opening_degree);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x08
	if ('low_battery_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x08);
		if (payload.low_battery_alarm.value < 0 || payload.low_battery_alarm.value > 100) {
			throw new Error('low_battery_alarm.value must be between 0 and 100');
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
				throw new Error('temperature_alarm.lower_range_alarm_deactivation.temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.temperature_alarm.lower_range_alarm_deactivation.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x11) {
			if (payload.temperature_alarm.lower_range_alarm_trigger.temperature < -20 || payload.temperature_alarm.lower_range_alarm_trigger.temperature > 60) {
				throw new Error('temperature_alarm.lower_range_alarm_trigger.temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.temperature_alarm.lower_range_alarm_trigger.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x12) {
			if (payload.temperature_alarm.over_range_alarm_deactivation.temperature < -20 || payload.temperature_alarm.over_range_alarm_deactivation.temperature > 60) {
				throw new Error('temperature_alarm.over_range_alarm_deactivation.temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.temperature_alarm.over_range_alarm_deactivation.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x13) {
			if (payload.temperature_alarm.over_range_alarm_trigger.temperature < -20 || payload.temperature_alarm.over_range_alarm_trigger.temperature > 60) {
				throw new Error('temperature_alarm.over_range_alarm_trigger.temperature must be between -20 and 60');
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
				throw new Error('anti_freeze_protection_alarm.lifted.environment_temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.anti_freeze_protection_alarm.lifted.environment_temperature * 100);
			if (payload.anti_freeze_protection_alarm.lifted.current_valve_status < 0 || payload.anti_freeze_protection_alarm.lifted.current_valve_status > 100) {
				throw new Error('anti_freeze_protection_alarm.lifted.current_valve_status must be between 0 and 100');
			}
			buffer.writeUInt8(payload.anti_freeze_protection_alarm.lifted.current_valve_status);
		}
		if (payload.anti_freeze_protection_alarm.type == 0x21) {
			if (payload.anti_freeze_protection_alarm.trigger.environment_temperature < -20 || payload.anti_freeze_protection_alarm.trigger.environment_temperature > 60) {
				throw new Error('anti_freeze_protection_alarm.trigger.environment_temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.anti_freeze_protection_alarm.trigger.environment_temperature * 100);
			if (payload.anti_freeze_protection_alarm.trigger.current_valve_status < 0 || payload.anti_freeze_protection_alarm.trigger.current_valve_status > 100) {
				throw new Error('anti_freeze_protection_alarm.trigger.current_valve_status must be between 0 and 100');
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
				throw new Error('mandatory_heating_alarm.exit.environment_temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.mandatory_heating_alarm.exit.environment_temperature * 100);
			if (payload.mandatory_heating_alarm.exit.current_valve_status < 0 || payload.mandatory_heating_alarm.exit.current_valve_status > 100) {
				throw new Error('mandatory_heating_alarm.exit.current_valve_status must be between 0 and 100');
			}
			buffer.writeUInt8(payload.mandatory_heating_alarm.exit.current_valve_status);
			if (payload.mandatory_heating_alarm.exit.battery_level < 0 || payload.mandatory_heating_alarm.exit.battery_level > 100) {
				throw new Error('mandatory_heating_alarm.exit.battery_level must be between 0 and 100');
			}
			buffer.writeUInt8(payload.mandatory_heating_alarm.exit.battery_level);
		}
		if (payload.mandatory_heating_alarm.type == 0x21) {
			if (payload.mandatory_heating_alarm.enter.environment_temperature < -20 || payload.mandatory_heating_alarm.enter.environment_temperature > 60) {
				throw new Error('mandatory_heating_alarm.enter.environment_temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.mandatory_heating_alarm.enter.environment_temperature * 100);
			if (payload.mandatory_heating_alarm.enter.current_valve_status < 0 || payload.mandatory_heating_alarm.enter.current_valve_status > 100) {
				throw new Error('mandatory_heating_alarm.enter.current_valve_status must be between 0 and 100');
			}
			buffer.writeUInt8(payload.mandatory_heating_alarm.enter.current_valve_status);
			if (payload.mandatory_heating_alarm.enter.battery_level < 0 || payload.mandatory_heating_alarm.enter.battery_level > 100) {
				throw new Error('mandatory_heating_alarm.enter.battery_level must be between 0 and 100');
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
			// 0：Unoccupied, 1：Occupied
			buffer.writeUInt8(payload.auto_away_report.inactive_by_target_temperature.state);
			if (payload.auto_away_report.inactive_by_target_temperature.environment_temperature < -20 || payload.auto_away_report.inactive_by_target_temperature.environment_temperature > 60) {
				throw new Error('auto_away_report.inactive_by_target_temperature.environment_temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.auto_away_report.inactive_by_target_temperature.environment_temperature * 100);
			if (payload.auto_away_report.inactive_by_target_temperature.target_temperature < 5 || payload.auto_away_report.inactive_by_target_temperature.target_temperature > 35) {
				throw new Error('auto_away_report.inactive_by_target_temperature.target_temperature must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.auto_away_report.inactive_by_target_temperature.target_temperature * 100);
		}
		if (payload.auto_away_report.event_type == 0x21) {
			// 0：Unoccupied, 1：Occupied
			buffer.writeUInt8(payload.auto_away_report.active_by_target_temperature.state);
			if (payload.auto_away_report.active_by_target_temperature.environment_temperature < -20 || payload.auto_away_report.active_by_target_temperature.environment_temperature > 60) {
				throw new Error('auto_away_report.active_by_target_temperature.environment_temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.auto_away_report.active_by_target_temperature.environment_temperature * 100);
			if (payload.auto_away_report.active_by_target_temperature.target_temperature < 5 || payload.auto_away_report.active_by_target_temperature.target_temperature > 35) {
				throw new Error('auto_away_report.active_by_target_temperature.target_temperature must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.auto_away_report.active_by_target_temperature.target_temperature * 100);
		}
		if (payload.auto_away_report.event_type == 0x22) {
			// 0：Unoccupied, 1：Occupied
			buffer.writeUInt8(payload.auto_away_report.inactive_by_target_valve_opening.state);
			if (payload.auto_away_report.inactive_by_target_valve_opening.environment_temperature < -20 || payload.auto_away_report.inactive_by_target_valve_opening.environment_temperature > 60) {
				throw new Error('auto_away_report.inactive_by_target_valve_opening.environment_temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.auto_away_report.inactive_by_target_valve_opening.environment_temperature * 100);
			if (payload.auto_away_report.inactive_by_target_valve_opening.target_valve_opening < 0 || payload.auto_away_report.inactive_by_target_valve_opening.target_valve_opening > 100) {
				throw new Error('auto_away_report.inactive_by_target_valve_opening.target_valve_opening must be between 0 and 100');
			}
			buffer.writeUInt8(payload.auto_away_report.inactive_by_target_valve_opening.target_valve_opening);
		}
		if (payload.auto_away_report.event_type == 0x23) {
			// 0：Unoccupied, 1：Occupied
			buffer.writeUInt8(payload.auto_away_report.active_by_target_valve_opening.state);
			if (payload.auto_away_report.active_by_target_valve_opening.environment_temperature < -20 || payload.auto_away_report.active_by_target_valve_opening.environment_temperature > 60) {
				throw new Error('auto_away_report.active_by_target_valve_opening.environment_temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.auto_away_report.active_by_target_valve_opening.environment_temperature * 100);
			if (payload.auto_away_report.active_by_target_valve_opening.target_valve_opening < 0 || payload.auto_away_report.active_by_target_valve_opening.target_valve_opening > 100) {
				throw new Error('auto_away_report.active_by_target_valve_opening.target_valve_opening must be between 0 and 100');
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
			// 0：Normal, 1：Open
			buffer.writeUInt8(payload.window_opening_alarm.release.state);
			if (payload.window_opening_alarm.release.environment_temperature < -20 || payload.window_opening_alarm.release.environment_temperature > 60) {
				throw new Error('window_opening_alarm.release.environment_temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.window_opening_alarm.release.environment_temperature * 100);
		}
		if (payload.window_opening_alarm.type == 0x21) {
			// 0：Normal, 1：Open
			buffer.writeUInt8(payload.window_opening_alarm.trigger.state);
			if (payload.window_opening_alarm.trigger.environment_temperature < -20 || payload.window_opening_alarm.trigger.environment_temperature > 60) {
				throw new Error('window_opening_alarm.trigger.environment_temperature must be between -20 and 60');
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
				throw new Error('periodic_reporting.non_heating_season.target_valve_opening must be between 0 and 100');
			}
			buffer.writeUInt8(payload.periodic_reporting.non_heating_season.target_valve_opening);
			if (payload.periodic_reporting.non_heating_season.battery_level < 0 || payload.periodic_reporting.non_heating_season.battery_level > 100) {
				throw new Error('periodic_reporting.non_heating_season.battery_level must be between 0 and 100');
			}
			buffer.writeUInt8(payload.periodic_reporting.non_heating_season.battery_level);
		}
		if (payload.periodic_reporting.report_type == 0x01) {
			if (payload.periodic_reporting.target_temperature_for_heating.environment_temperature < -20 || payload.periodic_reporting.target_temperature_for_heating.environment_temperature > 60) {
				throw new Error('periodic_reporting.target_temperature_for_heating.environment_temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.periodic_reporting.target_temperature_for_heating.environment_temperature * 100);
			if (payload.periodic_reporting.target_temperature_for_heating.current_valve_opening < 0 || payload.periodic_reporting.target_temperature_for_heating.current_valve_opening > 100) {
				throw new Error('periodic_reporting.target_temperature_for_heating.current_valve_opening must be between 0 and 100');
			}
			buffer.writeUInt8(payload.periodic_reporting.target_temperature_for_heating.current_valve_opening);
			if (payload.periodic_reporting.target_temperature_for_heating.target_temperature < 5 || payload.periodic_reporting.target_temperature_for_heating.target_temperature > 35) {
				throw new Error('periodic_reporting.target_temperature_for_heating.target_temperature must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.periodic_reporting.target_temperature_for_heating.target_temperature * 100);
			if (payload.periodic_reporting.target_temperature_for_heating.battery_level < 0 || payload.periodic_reporting.target_temperature_for_heating.battery_level > 100) {
				throw new Error('periodic_reporting.target_temperature_for_heating.battery_level must be between 0 and 100');
			}
			buffer.writeUInt8(payload.periodic_reporting.target_temperature_for_heating.battery_level);
		}
		if (payload.periodic_reporting.report_type == 0x02) {
			if (payload.periodic_reporting.target_valve_opening_for_heating.environment_temperature < -20 || payload.periodic_reporting.target_valve_opening_for_heating.environment_temperature > 60) {
				throw new Error('periodic_reporting.target_valve_opening_for_heating.environment_temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.periodic_reporting.target_valve_opening_for_heating.environment_temperature * 100);
			if (payload.periodic_reporting.target_valve_opening_for_heating.current_valve_opening < 0 || payload.periodic_reporting.target_valve_opening_for_heating.current_valve_opening > 100) {
				throw new Error('periodic_reporting.target_valve_opening_for_heating.current_valve_opening must be between 0 and 100');
			}
			buffer.writeUInt8(payload.periodic_reporting.target_valve_opening_for_heating.current_valve_opening);
			if (payload.periodic_reporting.target_valve_opening_for_heating.target_valve_opening < 0 || payload.periodic_reporting.target_valve_opening_for_heating.target_valve_opening > 100) {
				throw new Error('periodic_reporting.target_valve_opening_for_heating.target_valve_opening must be between 0 and 100');
			}
			buffer.writeUInt8(payload.periodic_reporting.target_valve_opening_for_heating.target_valve_opening);
			if (payload.periodic_reporting.target_valve_opening_for_heating.battery_level < 0 || payload.periodic_reporting.target_valve_opening_for_heating.battery_level > 100) {
				throw new Error('periodic_reporting.target_valve_opening_for_heating.battery_level must be between 0 and 100');
			}
			buffer.writeUInt8(payload.periodic_reporting.target_valve_opening_for_heating.battery_level);
		}
		if (payload.periodic_reporting.report_type == 0x03) {
			if (payload.periodic_reporting.integrated_control_for_heating.environment_temperature < -20 || payload.periodic_reporting.integrated_control_for_heating.environment_temperature > 60) {
				throw new Error('periodic_reporting.integrated_control_for_heating.environment_temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.periodic_reporting.integrated_control_for_heating.environment_temperature * 100);
			if (payload.periodic_reporting.integrated_control_for_heating.current_valve_opening < 0 || payload.periodic_reporting.integrated_control_for_heating.current_valve_opening > 100) {
				throw new Error('periodic_reporting.integrated_control_for_heating.current_valve_opening must be between 0 and 100');
			}
			buffer.writeUInt8(payload.periodic_reporting.integrated_control_for_heating.current_valve_opening);
			if (payload.periodic_reporting.integrated_control_for_heating.target_temperature < 5 || payload.periodic_reporting.integrated_control_for_heating.target_temperature > 35) {
				throw new Error('periodic_reporting.integrated_control_for_heating.target_temperature must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.periodic_reporting.integrated_control_for_heating.target_temperature * 100);
			if (payload.periodic_reporting.integrated_control_for_heating.target_valve_opening < 0 || payload.periodic_reporting.integrated_control_for_heating.target_valve_opening > 100) {
				throw new Error('periodic_reporting.integrated_control_for_heating.target_valve_opening must be between 0 and 100');
			}
			buffer.writeUInt8(payload.periodic_reporting.integrated_control_for_heating.target_valve_opening);
			if (payload.periodic_reporting.integrated_control_for_heating.battery_level < 0 || payload.periodic_reporting.integrated_control_for_heating.battery_level > 100) {
				throw new Error('periodic_reporting.integrated_control_for_heating.battery_level must be between 0 and 100');
			}
			buffer.writeUInt8(payload.periodic_reporting.integrated_control_for_heating.battery_level);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xc4
	if ('auto_p_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xc4);
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.auto_p_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x60
	if ('temperature_unit' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x60);
		// 0：℃, 1：℉
		buffer.writeUInt8(payload.temperature_unit);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x61
	if ('temperature_source_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x61);
		// 0：Internal NTC, 1：External NTC, 2：LoRa Receive
		buffer.writeUInt8(payload.temperature_source_settings.type);
		if (payload.temperature_source_settings.type == 0x01) {
			if (payload.temperature_source_settings.external_ntc_reception.timeout < 1 || payload.temperature_source_settings.external_ntc_reception.timeout > 1440) {
				throw new Error('temperature_source_settings.external_ntc_reception.timeout must be between 1 and 1440');
			}
			buffer.writeUInt16LE(payload.temperature_source_settings.external_ntc_reception.timeout);
			// 0: Maintaining State Control, 1: Close the Valve, 2: Switch to Internal NTC Control
			buffer.writeUInt8(payload.temperature_source_settings.external_ntc_reception.timeout_response);
		}
		if (payload.temperature_source_settings.type == 0x02) {
			if (payload.temperature_source_settings.lorawan_reception.timeout < 1 || payload.temperature_source_settings.lorawan_reception.timeout > 1440) {
				throw new Error('temperature_source_settings.lorawan_reception.timeout must be between 1 and 1440');
			}
			buffer.writeUInt16LE(payload.temperature_source_settings.lorawan_reception.timeout);
			// 0: Maintaining State Control, 1: Close the Valve, 2: Switch to Internal NTC Control
			buffer.writeUInt8(payload.temperature_source_settings.lorawan_reception.timeout_response);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x62
	if ('environment_temperature_display_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x62);
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
				throw new Error('heating_period_settings.heating_date_settings.start_mon must be between 1 and 12');
			}
			buffer.writeUInt8(payload.heating_period_settings.heating_date_settings.start_mon);
			if (payload.heating_period_settings.heating_date_settings.start_day < 1 || payload.heating_period_settings.heating_date_settings.start_day > 31) {
				throw new Error('heating_period_settings.heating_date_settings.start_day must be between 1 and 31');
			}
			buffer.writeUInt8(payload.heating_period_settings.heating_date_settings.start_day);
			if (payload.heating_period_settings.heating_date_settings.end_mon < 1 || payload.heating_period_settings.heating_date_settings.end_mon > 12) {
				throw new Error('heating_period_settings.heating_date_settings.end_mon must be between 1 and 12');
			}
			buffer.writeUInt8(payload.heating_period_settings.heating_date_settings.end_mon);
			if (payload.heating_period_settings.heating_date_settings.end_day < 1 || payload.heating_period_settings.heating_date_settings.end_day > 31) {
				throw new Error('heating_period_settings.heating_date_settings.end_day must be between 1 and 31');
			}
			buffer.writeUInt8(payload.heating_period_settings.heating_date_settings.end_day);
		}
		if (isValid(payload.heating_period_settings.heating_period_reporting_interval)) {
			buffer.writeUInt8(0x63);
			buffer.writeUInt8(0x01);
			// 0：second, 1：min
			buffer.writeUInt8(payload.heating_period_settings.heating_period_reporting_interval.unit);
			if (payload.heating_period_settings.heating_period_reporting_interval.unit == 0x00) {
				if (payload.heating_period_settings.heating_period_reporting_interval.seconds_of_time < 10 || payload.heating_period_settings.heating_period_reporting_interval.seconds_of_time > 64800) {
					throw new Error('heating_period_settings.heating_period_reporting_interval.seconds_of_time must be between 10 and 64800');
				}
				buffer.writeUInt16LE(payload.heating_period_settings.heating_period_reporting_interval.seconds_of_time);
			}
			if (payload.heating_period_settings.heating_period_reporting_interval.unit == 0x01) {
				if (payload.heating_period_settings.heating_period_reporting_interval.minutes_of_time < 1 || payload.heating_period_settings.heating_period_reporting_interval.minutes_of_time > 1440) {
					throw new Error('heating_period_settings.heating_period_reporting_interval.minutes_of_time must be between 1 and 1440');
				}
				buffer.writeUInt16LE(payload.heating_period_settings.heating_period_reporting_interval.minutes_of_time);
			}
		}
		if (isValid(payload.heating_period_settings.non_heating_period_reporting_interval)) {
			buffer.writeUInt8(0x63);
			buffer.writeUInt8(0x02);
			// 0：second, 1：min
			buffer.writeUInt8(payload.heating_period_settings.non_heating_period_reporting_interval.unit);
			if (payload.heating_period_settings.non_heating_period_reporting_interval.unit == 0x00) {
				if (payload.heating_period_settings.non_heating_period_reporting_interval.seconds_of_time < 10 || payload.heating_period_settings.non_heating_period_reporting_interval.seconds_of_time > 64800) {
					throw new Error('heating_period_settings.non_heating_period_reporting_interval.seconds_of_time must be between 10 and 64800');
				}
				buffer.writeUInt16LE(payload.heating_period_settings.non_heating_period_reporting_interval.seconds_of_time);
			}
			if (payload.heating_period_settings.non_heating_period_reporting_interval.unit == 0x01) {
				if (payload.heating_period_settings.non_heating_period_reporting_interval.minutes_of_time < 1 || payload.heating_period_settings.non_heating_period_reporting_interval.minutes_of_time > 1440) {
					throw new Error('heating_period_settings.non_heating_period_reporting_interval.minutes_of_time must be between 1 and 1440');
				}
				buffer.writeUInt16LE(payload.heating_period_settings.non_heating_period_reporting_interval.minutes_of_time);
			}
		}
		if (isValid(payload.heating_period_settings.valve_status_control)) {
			buffer.writeUInt8(0x63);
			// 0：Fully Close, 1：Fully Open
			buffer.writeUInt8(0x03);
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
			// 0：Disable, 1：Enable
			buffer.writeUInt8(payload.target_temperature_control_settings.enable);
		}
		if (isValid(payload.target_temperature_control_settings.target_temperature_resolution)) {
			buffer.writeUInt8(0x65);
			// 0：0.5, 1：1
			buffer.writeUInt8(0x01);
			// 0：0.5, 1：1
			buffer.writeUInt8(payload.target_temperature_control_settings.target_temperature_resolution);
		}
		if (isValid(payload.target_temperature_control_settings.under_temperature_side_deadband)) {
			buffer.writeUInt8(0x65);
			buffer.writeUInt8(0x02);
			if (payload.target_temperature_control_settings.under_temperature_side_deadband < 0.1 || payload.target_temperature_control_settings.under_temperature_side_deadband > 5) {
				throw new Error('target_temperature_control_settings.under_temperature_side_deadband must be between 0.1 and 5');
			}
			buffer.writeInt16LE(payload.target_temperature_control_settings.under_temperature_side_deadband * 100);
		}
		if (isValid(payload.target_temperature_control_settings.over_temperature_side_deadband)) {
			buffer.writeUInt8(0x65);
			buffer.writeUInt8(0x03);
			if (payload.target_temperature_control_settings.over_temperature_side_deadband < 0.1 || payload.target_temperature_control_settings.over_temperature_side_deadband > 5) {
				throw new Error('target_temperature_control_settings.over_temperature_side_deadband must be between 0.1 and 5');
			}
			buffer.writeInt16LE(payload.target_temperature_control_settings.over_temperature_side_deadband * 100);
		}
		if (isValid(payload.target_temperature_control_settings.target_temperature_adjustment_range_min)) {
			buffer.writeUInt8(0x65);
			buffer.writeUInt8(0x04);
			if (payload.target_temperature_control_settings.target_temperature_adjustment_range_min < 5 || payload.target_temperature_control_settings.target_temperature_adjustment_range_min > 35) {
				throw new Error('target_temperature_control_settings.target_temperature_adjustment_range_min must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.target_temperature_control_settings.target_temperature_adjustment_range_min * 100);
		}
		if (isValid(payload.target_temperature_control_settings.target_temperature_adjustment_range_max)) {
			buffer.writeUInt8(0x65);
			buffer.writeUInt8(0x05);
			if (payload.target_temperature_control_settings.target_temperature_adjustment_range_max < 5 || payload.target_temperature_control_settings.target_temperature_adjustment_range_max > 35) {
				throw new Error('target_temperature_control_settings.target_temperature_adjustment_range_max must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.target_temperature_control_settings.target_temperature_adjustment_range_max * 100);
		}
		if (isValid(payload.target_temperature_control_settings.mode_settings)) {
			buffer.writeUInt8(0x65);
			buffer.writeUInt8(0x06);
			// 0：Automatic Temperature Control, 1：Valve Opening Control, 2：Integrated Control
			buffer.writeUInt8(payload.target_temperature_control_settings.mode_settings.mode);
			if (payload.target_temperature_control_settings.mode_settings.mode == 0x00) {
				if (payload.target_temperature_control_settings.mode_settings.auto_control.target_temperature < 5 || payload.target_temperature_control_settings.mode_settings.auto_control.target_temperature > 35) {
					throw new Error('target_temperature_control_settings.mode_settings.auto_control.target_temperature must be between 5 and 35');
				}
				buffer.writeInt16LE(payload.target_temperature_control_settings.mode_settings.auto_control.target_temperature * 100);
			}
			if (payload.target_temperature_control_settings.mode_settings.mode == 0x01) {
				if (payload.target_temperature_control_settings.mode_settings.valve_control.target_valve_status < 0 || payload.target_temperature_control_settings.mode_settings.valve_control.target_valve_status > 100) {
					throw new Error('target_temperature_control_settings.mode_settings.valve_control.target_valve_status must be between 0 and 100');
				}
				buffer.writeUInt8(payload.target_temperature_control_settings.mode_settings.valve_control.target_valve_status);
			}
			if (payload.target_temperature_control_settings.mode_settings.mode == 0x02) {
				if (payload.target_temperature_control_settings.mode_settings.intergrated_control.target_temperature < 5 || payload.target_temperature_control_settings.mode_settings.intergrated_control.target_temperature > 35) {
					throw new Error('target_temperature_control_settings.mode_settings.intergrated_control.target_temperature must be between 5 and 35');
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
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.window_opening_detection_settings.enable);
		if (payload.window_opening_detection_settings.cooling_rate < 2 || payload.window_opening_detection_settings.cooling_rate > 10) {
			throw new Error('window_opening_detection_settings.cooling_rate must be between 2 and 10');
		}
		buffer.writeInt16LE(payload.window_opening_detection_settings.cooling_rate * 100);
		// 0：Remains Unchanged, 1：Close the Valve
		buffer.writeUInt8(payload.window_opening_detection_settings.valve_status);
		if (payload.window_opening_detection_settings.stop_temperature_control_time < 1 || payload.window_opening_detection_settings.stop_temperature_control_time > 1440) {
			throw new Error('window_opening_detection_settings.stop_temperature_control_time must be between 1 and 1440');
		}
		buffer.writeUInt16LE(payload.window_opening_detection_settings.stop_temperature_control_time);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x67
	if ('auto_away_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x67);
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.auto_away_settings.enable);
		if (payload.auto_away_settings.start_time < 0 || payload.auto_away_settings.start_time > 1439) {
			throw new Error('auto_away_settings.start_time must be between 0 and 1439');
		}
		buffer.writeUInt16LE(payload.auto_away_settings.start_time);
		if (payload.auto_away_settings.end_time < 0 || payload.auto_away_settings.end_time > 1439) {
			throw new Error('auto_away_settings.end_time must be between 0 and 1439');
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

		// 0：Energy Saving Temperature, 1：Energy Saving Valve Opening
		buffer.writeUInt8(payload.auto_away_settings.energy_saving_settings.mode);
		if (payload.auto_away_settings.energy_saving_settings.mode == 0x00) {
			if (payload.auto_away_settings.energy_saving_settings.energy_saving_temperature < 5 || payload.auto_away_settings.energy_saving_settings.energy_saving_temperature > 35) {
				throw new Error('auto_away_settings.energy_saving_settings.energy_saving_temperature must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.auto_away_settings.energy_saving_settings.energy_saving_temperature * 100);
		}
		if (payload.auto_away_settings.energy_saving_settings.mode == 0x01) {
			if (payload.auto_away_settings.energy_saving_settings.energy_saving_valve_opening_degree < 0 || payload.auto_away_settings.energy_saving_settings.energy_saving_valve_opening_degree > 100) {
				throw new Error('auto_away_settings.energy_saving_settings.energy_saving_valve_opening_degree must be between 0 and 100');
			}
			buffer.writeUInt8(payload.auto_away_settings.energy_saving_settings.energy_saving_valve_opening_degree);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x68
	if ('anti_freeze_protection_setting' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x68);
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.anti_freeze_protection_setting.enable);
		if (payload.anti_freeze_protection_setting.temperature_value < 1 || payload.anti_freeze_protection_setting.temperature_value > 5) {
			throw new Error('anti_freeze_protection_setting.temperature_value must be between 1 and 5');
		}
		buffer.writeInt16LE(payload.anti_freeze_protection_setting.temperature_value * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x69
	if ('mandatory_heating_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x69);
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.mandatory_heating_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6a
	if ('child_lock' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6a);
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
			throw new Error('motor_stroke_limit must be between 0 and 100');
		}
		buffer.writeUInt8(payload.motor_stroke_limit);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6c
	if ('temperature_calibration_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6c);
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.temperature_calibration_settings.enable);
		if (payload.temperature_calibration_settings.calibration_value < -60 || payload.temperature_calibration_settings.calibration_value > 60) {
			throw new Error('temperature_calibration_settings.calibration_value must be between -60 and 60');
		}
		buffer.writeInt16LE(payload.temperature_calibration_settings.calibration_value * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6d
	if ('temperature_alarm_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6d);
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.temperature_alarm_settings.enable);
		// 0:Disable, 1:Condition: x<A, 2:Condition: x>B, 4:Condition: x<A or x>B
		buffer.writeUInt8(payload.temperature_alarm_settings.threshold_condition);
		if (payload.temperature_alarm_settings.threshold_min < -20 || payload.temperature_alarm_settings.threshold_min > 60) {
			throw new Error('temperature_alarm_settings.threshold_min must be between -20 and 60');
		}
		buffer.writeInt16LE(payload.temperature_alarm_settings.threshold_min * 100);
		if (payload.temperature_alarm_settings.threshold_max < -20 || payload.temperature_alarm_settings.threshold_max > 60) {
			throw new Error('temperature_alarm_settings.threshold_max must be between -20 and 60');
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
			if (isValid(schedule_settings_item.enable)) {
				buffer.writeUInt8(0x6e);
				buffer.writeUInt8(schedule_settings_item_id);
				// 0：Disable, 1：Enable
				buffer.writeUInt8(0x00);
				// 0：Disable, 1：Enable
				buffer.writeUInt8(schedule_settings_item.enable);
			}
			if (isValid(schedule_settings_item.start_time)) {
				buffer.writeUInt8(0x6e);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x01);
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
				// 0：Automatic Temperature Control, 1：Valve Opening Control, 2：Integrated Control
				buffer.writeUInt8(schedule_settings_item.temperature_control_mode);
			}
			if (isValid(schedule_settings_item.target_temperature)) {
				buffer.writeUInt8(0x6e);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x04);
				if (schedule_settings_item.target_temperature < 5 || schedule_settings_item.target_temperature > 35) {
					throw new Error('target_temperature must be between 5 and 35');
				}
				buffer.writeInt16LE(schedule_settings_item.target_temperature * 100);
			}
			if (isValid(schedule_settings_item.target_valve_status)) {
				buffer.writeUInt8(0x6e);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x05);
				if (schedule_settings_item.target_valve_status < 0 || schedule_settings_item.target_valve_status > 100) {
					throw new Error('target_valve_status must be between 0 and 100');
				}
				buffer.writeUInt8(schedule_settings_item.target_valve_status);
			}
			if (isValid(schedule_settings_item.pre_heating_enable)) {
				buffer.writeUInt8(0x6e);
				buffer.writeUInt8(schedule_settings_item_id);
				// 0：Disable, 1：Enable
				buffer.writeUInt8(0x06);
				// 0：Disable, 1：Enable
				buffer.writeUInt8(schedule_settings_item.pre_heating_enable);
			}
			if (isValid(schedule_settings_item.pre_heating_mode)) {
				buffer.writeUInt8(0x6e);
				buffer.writeUInt8(schedule_settings_item_id);
				// 0：Auto, 1：Manual
				buffer.writeUInt8(0x07);
				// 0：Auto, 1：Manual
				buffer.writeUInt8(schedule_settings_item.pre_heating_mode);
			}
			if (isValid(schedule_settings_item.pre_heating_manual_time)) {
				buffer.writeUInt8(0x6e);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x08);
				if (schedule_settings_item.pre_heating_manual_time < 1 || schedule_settings_item.pre_heating_manual_time > 1440) {
					throw new Error('pre_heating_manual_time must be between 1 and 1440');
				}
				buffer.writeUInt16LE(schedule_settings_item.pre_heating_manual_time);
			}
			if (isValid(schedule_settings_item.report_cycle)) {
				buffer.writeUInt8(0x6e);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x09);
				if (schedule_settings_item.report_cycle < 1 || schedule_settings_item.report_cycle > 1440) {
					throw new Error('report_cycle must be between 1 and 1440');
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
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.change_report_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xc7
	if ('time_zone' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xc7);
		buffer.writeInt16LE(payload.time_zone);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xc6
	if ('daylight_saving_time' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xc6);
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.daylight_saving_time.enable);
		if (payload.daylight_saving_time.daylight_saving_time_offset < 1 || payload.daylight_saving_time.daylight_saving_time_offset > 120) {
			throw new Error('daylight_saving_time.daylight_saving_time_offset must be between 1 and 120');
		}
		buffer.writeUInt8(payload.daylight_saving_time.daylight_saving_time_offset);
		// 1:Jan., 2:Feb., 3:Mar., 4:Apr., 5:May, 6:Jun., 7:Jul., 8:Aug., 9:Sep., 10:Oct., 11:Nov., 12:Dec.
		buffer.writeUInt8(payload.daylight_saving_time.start_month);
		var bitOptions = 0;
		// 1:1st, 2: 2nd, 3: 3rd, 4: 4th, 5: last
		bitOptions |= payload.daylight_saving_time.start_week_num << 4;

		// 1：Mon., 2：Tues., 3：Wed., 4：Thurs., 5：Fri., 6：Sat., 7：Sun.
		bitOptions |= payload.daylight_saving_time.start_week_day << 0;

		buffer.writeUInt8(bitOptions);
		buffer.writeUInt16LE(payload.daylight_saving_time.start_hour_min);
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
	//0xc5
	if ('data_storage_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.data_storage_settings.enable)) {
			buffer.writeUInt8(0xc5);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(0x00);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(payload.data_storage_settings.enable);
		}
		if (isValid(payload.data_storage_settings.retransmission_enable)) {
			buffer.writeUInt8(0xc5);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(0x01);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(payload.data_storage_settings.retransmission_enable);
		}
		if (isValid(payload.data_storage_settings.retransmission_interval)) {
			buffer.writeUInt8(0xc5);
			buffer.writeUInt8(0x02);
			if (payload.data_storage_settings.retransmission_interval < 30 || payload.data_storage_settings.retransmission_interval > 1200) {
				throw new Error('data_storage_settings.retransmission_interval must be between 30 and 1200');
			}
			buffer.writeUInt16LE(payload.data_storage_settings.retransmission_interval);
		}
		if (isValid(payload.data_storage_settings.retrieval_interval)) {
			buffer.writeUInt8(0xc5);
			buffer.writeUInt8(0x03);
			if (payload.data_storage_settings.retrieval_interval < 30 || payload.data_storage_settings.retrieval_interval > 1200) {
				throw new Error('data_storage_settings.retrieval_interval must be between 30 and 1200');
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
	//0xb9
	if ('query_device_status' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb9);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xb8
	if ('synchronize_time' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb8);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xb7
	if ('set_time' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb7);
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
		buffer.writeUInt32LE(payload.retrieve_historical_data_by_time_range.start_time);
		buffer.writeUInt32LE(payload.retrieve_historical_data_by_time_range.end_time);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xba
	if ('retrieve_historical_data_by_time' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xba);
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
			throw new Error('set_target_valve_opening_degree.value must be between 0 and 100');
		}
		buffer.writeUInt8(payload.set_target_valve_opening_degree.value);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x5a
	if ('set_target_temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x5a);
		if (payload.set_target_temperature.value < 5 || payload.set_target_temperature.value > 35) {
			throw new Error('set_target_temperature.value must be between 5 and 35');
		}
		buffer.writeInt16LE(payload.set_target_temperature.value * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x5b
	if ('set_temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x5b);
		if (payload.set_temperature.value < -20 || payload.set_temperature.value > 60) {
			throw new Error('set_temperature.value must be between -20 and 60');
		}
		buffer.writeInt16LE(payload.set_temperature.value * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x5c
	if ('set_occupancy_state' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x5c);
		// 0：Unoccupied, 1：Occupied
		buffer.writeUInt8(payload.set_occupancy_state.state);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x5d
	if ('set_opening_window' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x5d);
		// 0：Normal, 1：Open
		buffer.writeUInt8(payload.set_opening_window.state);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x5e
	if ('delete_schedule' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x5e);
		// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8, 8：Schedule9, 9：Schedule10, 10：Schedule11, 11：Schedule12, 12：Schedule13, 13：Schedule14, 14：Schedule15, 15：Schedule16, 255：Reset All 
		buffer.writeUInt8(payload.delete_schedule.type);
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
