/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product WT102
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

	var unknown_command = 0;
	var counterObj = {};
	for (counterObj.i = 0; counterObj.i < bytes.length; ) {
		var command_id = bytes[counterObj.i++];
		switch (command_id) {
			case 0xfe:
				decoded.check_order_reply = decoded.check_order_reply || {};
				decoded.check_order_reply.order = readUInt8(bytes, counterObj, 1);
				break;
			case 0xef:
				decoded.ans = decoded.ans || [];
				var ans_item = {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0：success, 1：unknow, 2：error order, 3：error passwd, 4：error read params, 5：error write params, 6：error read, 7：error write, 8：error read apply, 9：error write apply
				ans_item.result = extractBits(bitOptions, 4, 8);
				ans_item.length = extractBits(bitOptions, 0, 4);
				ans_item.id = readCommand(bytes, counterObj, ans_item.length);
				decoded.ans.push(ans_item);
				break;
			case 0xee:
				decoded.request_query_all_configurations = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0xcf:
				decoded.lorawan_configuration_settings = decoded.lorawan_configuration_settings || {};
				var lorawan_configuration_settings_command = readUInt8(bytes, counterObj, 1);
				if (lorawan_configuration_settings_command == 0x00) {
					// 0:ClassA, 1:ClassB, 2:ClassC, 3:ClassC to B
					decoded.lorawan_configuration_settings.mode = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0xdf:
				decoded.tsl_version = readProtocolVersion(readBytes(bytes, counterObj, 2));
				break;
			case 0xde:
				decoded.product_name = readString(bytes, counterObj, 32);
				break;
			case 0xdd:
				decoded.product_pn = readString(bytes, counterObj, 32);
				break;
			case 0xdb:
				decoded.product_sn = readHexString(bytes, counterObj, 8);
				break;
			case 0xda:
				decoded.version = decoded.version || {};
				decoded.version.hardware_version = readHardwareVersion(readBytes(bytes, counterObj, 2));
				decoded.version.firmware_version = readFirmwareVersion(readBytes(bytes, counterObj, 6));
				break;
			case 0xd9:
				decoded.oem_id = readHexString(bytes, counterObj, 2);
				break;
			case 0xc8:
				// 0：Off, 1：On
				decoded.device_status = readUInt8(bytes, counterObj, 1);
				break;
			case 0xd8:
				decoded.product_frequency_band = readString(bytes, counterObj, 16);
				break;
			case 0x00:
				decoded.battery = readUInt8(bytes, counterObj, 1);
				break;
			case 0x01:
				decoded.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x02:
				decoded.motor_total_stroke = readUInt16LE(bytes, counterObj, 2);
				break;
			case 0x03:
				decoded.motor_position = readUInt16LE(bytes, counterObj, 2);
				break;
			case 0x04:
				decoded.valve_opening_degree = readUInt8(bytes, counterObj, 1);
				break;
			case 0x05:
				decoded.motor_calibration_result_report = decoded.motor_calibration_result_report || {};
				// 0：Uncalibrated, 1：Calibration success, 2：Calibration failed,out of range , 3：Calibration failed,temperature control disabled, 4：Calibration failed,uninstalled
				decoded.motor_calibration_result_report.status = readUInt8(bytes, counterObj, 1);
				break;
			case 0x06:
				decoded.target_temperature = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x07:
				decoded.target_valve_opening_degree = readUInt8(bytes, counterObj, 1);
				break;
			case 0x08:
				decoded.low_battery_alarm = decoded.low_battery_alarm || {};
				decoded.low_battery_alarm.value = readUInt8(bytes, counterObj, 1);
				// decoded.battery = decoded.low_battery_alarm.value;
				break;
			case 0x09:
				decoded.temperature_alarm = decoded.temperature_alarm || {};
				decoded.temperature_alarm.type = readUInt8(bytes, counterObj, 1);
				if (decoded.temperature_alarm.type == 0x10) {
					decoded.temperature_alarm.lower_range_alarm_deactivation = decoded.temperature_alarm.lower_range_alarm_deactivation || {};
					decoded.temperature_alarm.lower_range_alarm_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					// decoded.temperature = decoded.temperature_alarm.lower_range_alarm_deactivation.temperature;
				}
				if (decoded.temperature_alarm.type == 0x11) {
					decoded.temperature_alarm.lower_range_alarm_trigger = decoded.temperature_alarm.lower_range_alarm_trigger || {};
					decoded.temperature_alarm.lower_range_alarm_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					// decoded.temperature = decoded.temperature_alarm.lower_range_alarm_trigger.temperature;
				}
				if (decoded.temperature_alarm.type == 0x12) {
					decoded.temperature_alarm.over_range_alarm_deactivation = decoded.temperature_alarm.over_range_alarm_deactivation || {};
					decoded.temperature_alarm.over_range_alarm_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					// decoded.temperature = decoded.temperature_alarm.over_range_alarm_deactivation.temperature;
				}
				if (decoded.temperature_alarm.type == 0x13) {
					decoded.temperature_alarm.over_range_alarm_trigger = decoded.temperature_alarm.over_range_alarm_trigger || {};
					decoded.temperature_alarm.over_range_alarm_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					// decoded.temperature = decoded.temperature_alarm.over_range_alarm_trigger.temperature;
				}
				break;
			case 0x0a:
				decoded.anti_freeze_protection_alarm = decoded.anti_freeze_protection_alarm || {};
				decoded.anti_freeze_protection_alarm.type = readUInt8(bytes, counterObj, 1);
				if (decoded.anti_freeze_protection_alarm.type == 0x20) {
					decoded.anti_freeze_protection_alarm.lifted = decoded.anti_freeze_protection_alarm.lifted || {};
					decoded.anti_freeze_protection_alarm.lifted.environment_temperature = readInt16LE(bytes, counterObj, 2) / 100;
					// decoded.temperature = decoded.anti_freeze_protection_alarm.lifted.environment_temperature;
					decoded.anti_freeze_protection_alarm.lifted.current_valve_status = readUInt8(bytes, counterObj, 1);
					// decoded.valve_opening_degree = decoded.anti_freeze_protection_alarm.lifted.current_valve_status;
				}
				if (decoded.anti_freeze_protection_alarm.type == 0x21) {
					decoded.anti_freeze_protection_alarm.trigger = decoded.anti_freeze_protection_alarm.trigger || {};
					decoded.anti_freeze_protection_alarm.trigger.environment_temperature = readInt16LE(bytes, counterObj, 2) / 100;
					// decoded.temperature = decoded.anti_freeze_protection_alarm.trigger.environment_temperature;
					decoded.anti_freeze_protection_alarm.trigger.current_valve_status = readUInt8(bytes, counterObj, 1);
					// decoded.valve_opening_degree = decoded.anti_freeze_protection_alarm.trigger.current_valve_status;
				}
				break;
			case 0x0b:
				decoded.mandatory_heating_alarm = decoded.mandatory_heating_alarm || {};
				decoded.mandatory_heating_alarm.type = readUInt8(bytes, counterObj, 1);
				if (decoded.mandatory_heating_alarm.type == 0x20) {
					decoded.mandatory_heating_alarm.exit = decoded.mandatory_heating_alarm.exit || {};
					decoded.mandatory_heating_alarm.exit.environment_temperature = readInt16LE(bytes, counterObj, 2) / 100;
					// decoded.temperature = decoded.mandatory_heating_alarm.exit.environment_temperature;
					decoded.mandatory_heating_alarm.exit.current_valve_status = readUInt8(bytes, counterObj, 1);
					// decoded.valve_opening_degree = decoded.mandatory_heating_alarm.exit.current_valve_status;
					decoded.mandatory_heating_alarm.exit.battery_level = readUInt8(bytes, counterObj, 1);
					// decoded.battery = decoded.mandatory_heating_alarm.exit.battery_level;
				}
				if (decoded.mandatory_heating_alarm.type == 0x21) {
					decoded.mandatory_heating_alarm.enter = decoded.mandatory_heating_alarm.enter || {};
					decoded.mandatory_heating_alarm.enter.environment_temperature = readInt16LE(bytes, counterObj, 2) / 100;
					// decoded.temperature = decoded.mandatory_heating_alarm.enter.environment_temperature;
					decoded.mandatory_heating_alarm.enter.current_valve_status = readUInt8(bytes, counterObj, 1);
					// decoded.valve_opening_degree = decoded.mandatory_heating_alarm.enter.current_valve_status;
					decoded.mandatory_heating_alarm.enter.battery_level = readUInt8(bytes, counterObj, 1);
					// decoded.battery = decoded.mandatory_heating_alarm.enter.battery_level;
				}
				break;
			case 0x0c:
				decoded.auto_away_report = decoded.auto_away_report || {};
				decoded.auto_away_report.event_type = readUInt8(bytes, counterObj, 1);
				if (decoded.auto_away_report.event_type == 0x20) {
					decoded.auto_away_report.inactive_by_target_temperature = decoded.auto_away_report.inactive_by_target_temperature || {};
					// 0：Unoccupied, 1：Occupied
					decoded.auto_away_report.inactive_by_target_temperature.state = readUInt8(bytes, counterObj, 1);
					decoded.auto_away_report.inactive_by_target_temperature.environment_temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.auto_away_report.inactive_by_target_temperature.environment_temperature;
					decoded.auto_away_report.inactive_by_target_temperature.target_temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.target_temperature = decoded.auto_away_report.inactive_by_target_temperature.target_temperature;
				}
				if (decoded.auto_away_report.event_type == 0x21) {
					decoded.auto_away_report.active_by_target_temperature = decoded.auto_away_report.active_by_target_temperature || {};
					// 0：Unoccupied, 1：Occupied
					decoded.auto_away_report.active_by_target_temperature.state = readUInt8(bytes, counterObj, 1);
					decoded.auto_away_report.active_by_target_temperature.environment_temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.auto_away_report.active_by_target_temperature.environment_temperature;
					decoded.auto_away_report.active_by_target_temperature.target_temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (decoded.auto_away_report.event_type == 0x22) {
					decoded.auto_away_report.inactive_by_target_valve_state = decoded.auto_away_report.inactive_by_target_valve_state || {};
					// 0：Unoccupied, 1：Occupied
					decoded.auto_away_report.inactive_by_target_valve_state.state = readUInt8(bytes, counterObj, 1);
					decoded.auto_away_report.inactive_by_target_valve_state.environment_temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.auto_away_report.inactive_by_target_valve_state.environment_temperature;
					decoded.auto_away_report.inactive_by_target_valve_state.target_valve_state = readUInt8(bytes, counterObj, 1);
					decoded.target_valve_opening_degree = decoded.auto_away_report.inactive_by_target_valve_state.target_valve_state;
				}
				if (decoded.auto_away_report.event_type == 0x23) {
					decoded.auto_away_report.active_by_target_valve_state = decoded.auto_away_report.active_by_target_valve_state || {};
					// 0：Unoccupied, 1：Occupied
					decoded.auto_away_report.active_by_target_valve_state.state = readUInt8(bytes, counterObj, 1);
					decoded.auto_away_report.active_by_target_valve_state.environment_temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.auto_away_report.active_by_target_valve_state.environment_temperature;
					decoded.auto_away_report.active_by_target_valve_state.target_valve_state = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x0d:
				decoded.window_opening_alarm = decoded.window_opening_alarm || {};
				decoded.window_opening_alarm.type = readUInt8(bytes, counterObj, 1);
				if (decoded.window_opening_alarm.type == 0x20) {
					decoded.window_opening_alarm.release = decoded.window_opening_alarm.release || {};
					// 0：Normal, 1：Open
					decoded.window_opening_alarm.release.state = readUInt8(bytes, counterObj, 1);
					decoded.window_opening_alarm.release.environment_temperature = readInt16LE(bytes, counterObj, 2) / 100;
					// decoded.temperature = decoded.window_opening_alarm.release.environment_temperature;
					// 0：Normal, 1：Open
					decoded.window_opening_alarm.release.state = readUInt8(bytes, counterObj, 1);
				}
				if (decoded.window_opening_alarm.type == 0x21) {
					decoded.window_opening_alarm.trigger = decoded.window_opening_alarm.trigger || {};
					decoded.window_opening_alarm.trigger.environment_temperature = readInt16LE(bytes, counterObj, 2) / 100;
					// decoded.temperature = decoded.window_opening_alarm.trigger.environment_temperature;
				}
				break;
			case 0x60:
				// 0：℃, 1：℉
				decoded.temperature_unit = readUInt8(bytes, counterObj, 1);
				break;
			case 0x61:
				decoded.temperature_source_settings = decoded.temperature_source_settings || {};
				// 0：Embedded NTC, 1：External NTC, 2：LoRa Receive
				decoded.temperature_source_settings.type = readUInt8(bytes, counterObj, 1);
				if (decoded.temperature_source_settings.type == 0x01) {
					decoded.temperature_source_settings.external_ntc_reception = decoded.temperature_source_settings.external_ntc_reception || {};
					decoded.temperature_source_settings.external_ntc_reception.timeout = readUInt16LE(bytes, counterObj, 2);
					// 0: Maintaining State Control, 1: Close the Valve, 2: Switch to Embedded NTC Control
					decoded.temperature_source_settings.external_ntc_reception.timeout_response = readUInt8(bytes, counterObj, 1);
				}
				if (decoded.temperature_source_settings.type == 0x02) {
					decoded.temperature_source_settings.lorawan_reception = decoded.temperature_source_settings.lorawan_reception || {};
					decoded.temperature_source_settings.lorawan_reception.timeout = readUInt16LE(bytes, counterObj, 2);
					// 0: Maintaining State Control, 1: Close the Valve, 2: Switch to Embedded NTC Control
					decoded.temperature_source_settings.lorawan_reception.timeout_response = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x62:
				// 0：Disable, 1：Enable
				decoded.env_temperature_display_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x63:
				decoded.heating_period_settings = decoded.heating_period_settings || {};
				var heating_period_settings_command = readUInt8(bytes, counterObj, 1);
				if (heating_period_settings_command == 0x00) {
					decoded.heating_period_settings.heating_date_settings = decoded.heating_period_settings.heating_date_settings || {};
					decoded.heating_period_settings.heating_date_settings.start_mon = readUInt8(bytes, counterObj, 1);
					decoded.heating_period_settings.heating_date_settings.start_day = readUInt8(bytes, counterObj, 1);
					decoded.heating_period_settings.heating_date_settings.end_mon = readUInt8(bytes, counterObj, 1);
					decoded.heating_period_settings.heating_date_settings.end_day = readUInt8(bytes, counterObj, 1);
				}
				if (heating_period_settings_command == 0x01) {
					decoded.heating_period_settings.heating_period_reporting_interval = decoded.heating_period_settings.heating_period_reporting_interval || {};
					// 0：second, 1：min
					decoded.heating_period_settings.heating_period_reporting_interval.unit = readUInt8(bytes, counterObj, 1);
					if (decoded.heating_period_settings.heating_period_reporting_interval.unit < 0x00 || decoded.heating_period_settings.heating_period_reporting_interval.unit > 0x01) {
						throw new Error('heating_period_settings.heating_period_reporting_interval.unit must be between 0 and 1');
					}
					if (decoded.heating_period_settings.heating_period_reporting_interval.unit == 0x00) {
						decoded.heating_period_settings.heating_period_reporting_interval.seconds_of_time = readUInt16LE(bytes, counterObj, 2);
					}
					if (decoded.heating_period_settings.heating_period_reporting_interval.unit == 0x01) {
						decoded.heating_period_settings.heating_period_reporting_interval.minutes_of_time = readUInt16LE(bytes, counterObj, 2);
					}
				}
				if (heating_period_settings_command == 0x02) {
					decoded.heating_period_settings.non_heating_period_reporting_interval = decoded.heating_period_settings.non_heating_period_reporting_interval || {};
					// 0：second, 1：min
					decoded.heating_period_settings.non_heating_period_reporting_interval.unit = readUInt8(bytes, counterObj, 1);
					if (decoded.heating_period_settings.non_heating_period_reporting_interval.unit < 0x00 || decoded.heating_period_settings.non_heating_period_reporting_interval.unit > 0x01) {
						throw new Error('heating_period_settings.non_heating_period_reporting_interval.unit must be between 0 and 1');
					}
					if (decoded.heating_period_settings.non_heating_period_reporting_interval.unit == 0x00) {
						decoded.heating_period_settings.non_heating_period_reporting_interval.seconds_of_time = readUInt16LE(bytes, counterObj, 2);
					}
					if (decoded.heating_period_settings.non_heating_period_reporting_interval.unit == 0x01) {
						decoded.heating_period_settings.non_heating_period_reporting_interval.minutes_of_time = readUInt16LE(bytes, counterObj, 2);
					}
				}
				if (heating_period_settings_command == 0x03) {
					// 0：Completely Close, 1：Completely Open
					decoded.heating_period_settings.valve_status_control = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x65:
				decoded.target_temperature_control_settings = decoded.target_temperature_control_settings || {};
				var target_temperature_control_settings_command = readUInt8(bytes, counterObj, 1);
				if (target_temperature_control_settings_command == 0x00) {
					// 0：Disable, 1：Enable
					decoded.target_temperature_control_settings.enable = readUInt8(bytes, counterObj, 1);
				}
				if (target_temperature_control_settings_command == 0x01) {
					// 0：0.5, 1：1
					decoded.target_temperature_control_settings.target_temperature_resolution = readUInt8(bytes, counterObj, 1);
				}
				if (target_temperature_control_settings_command == 0x02) {
					decoded.target_temperature_control_settings.under_temperature_side_deadband = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (target_temperature_control_settings_command == 0x03) {
					decoded.target_temperature_control_settings.over_temperature_side_deadband = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (target_temperature_control_settings_command == 0x04) {
					decoded.target_temperature_control_settings.target_temperature_adjustment_range_min = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (target_temperature_control_settings_command == 0x05) {
					decoded.target_temperature_control_settings.target_temperature_adjustment_range_max = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (target_temperature_control_settings_command == 0x06) {
					decoded.target_temperature_control_settings.mode_settings = decoded.target_temperature_control_settings.mode_settings || {};
					// 0：Automatic Temperature Control, 1：Valve Opening Control, 2：Comprehensive Control
					decoded.target_temperature_control_settings.mode_settings.mode = readUInt8(bytes, counterObj, 1);
					if (decoded.target_temperature_control_settings.mode_settings.mode == 0x00) {
						decoded.target_temperature_control_settings.mode_settings.auto_control = decoded.target_temperature_control_settings.mode_settings.auto_control || {};
						decoded.target_temperature_control_settings.mode_settings.auto_control.target_temperature = readInt16LE(bytes, counterObj, 2) / 100;
					}
					if (decoded.target_temperature_control_settings.mode_settings.mode == 0x01) {
						decoded.target_temperature_control_settings.mode_settings.valve_control = decoded.target_temperature_control_settings.mode_settings.valve_control || {};
						decoded.target_temperature_control_settings.mode_settings.valve_control.target_valve_status = readUInt8(bytes, counterObj, 1);
					}
					if (decoded.target_temperature_control_settings.mode_settings.mode == 0x02) {
						decoded.target_temperature_control_settings.mode_settings.intergrated_control = decoded.target_temperature_control_settings.mode_settings.intergrated_control || {};
						decoded.target_temperature_control_settings.mode_settings.intergrated_control.target_temperature = readInt16LE(bytes, counterObj, 2) / 100;
					}
				}
				break;
			case 0x66:
				decoded.window_opening_detection_settings = decoded.window_opening_detection_settings || {};
				// 0：Disable, 1：Enable
				decoded.window_opening_detection_settings.enable = readUInt8(bytes, counterObj, 1);
				decoded.window_opening_detection_settings.cooling_rate = readInt16LE(bytes, counterObj, 2) / 100;
				// 0：Stay the Same, 1：Close the Valve
				decoded.window_opening_detection_settings.valve_status = readUInt8(bytes, counterObj, 1);
				decoded.window_opening_detection_settings.stop_temperature_control_time = readUInt16LE(bytes, counterObj, 2);
				break;
			case 0x67:
				decoded.auto_away_settings = decoded.auto_away_settings || {};
				// 0：Disable, 1：Enable
				decoded.auto_away_settings.enable = readUInt8(bytes, counterObj, 1);
				decoded.auto_away_settings.start_time = readUInt16LE(bytes, counterObj, 2);
				decoded.auto_away_settings.end_time = readUInt16LE(bytes, counterObj, 2);
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0：Disable, 1：Enable
				decoded.auto_away_settings.cycle_time_sun = extractBits(bitOptions, 0, 1);
				// 0：Disable, 1：Enable
				decoded.auto_away_settings.cycle_time_mon = extractBits(bitOptions, 1, 2);
				// 0：Disable, 1：Enable
				decoded.auto_away_settings.cycle_time_tues = extractBits(bitOptions, 2, 3);
				// 0：Disable, 1：Enable
				decoded.auto_away_settings.cycle_time_wed = extractBits(bitOptions, 3, 4);
				// 0：Disable, 1：Enable
				decoded.auto_away_settings.cycle_time_thur = extractBits(bitOptions, 4, 5);
				// 0：Disable, 1：Enable
				decoded.auto_away_settings.cycle_time_fri = extractBits(bitOptions, 5, 6);
				// 0：Disable, 1：Enable
				decoded.auto_away_settings.cycle_time_sat = extractBits(bitOptions, 6, 7);
				decoded.auto_away_settings.reserved = extractBits(bitOptions, 7, 8);
				decoded.auto_away_settings.energy_saving_settings = decoded.auto_away_settings.energy_saving_settings || {};
				// 0：Energy Saving Temperature, 1：Energy Saving Valve Opening
				decoded.auto_away_settings.energy_saving_settings.mode = readUInt8(bytes, counterObj, 1);
				if (decoded.auto_away_settings.energy_saving_settings.mode == 0x00) {
					decoded.auto_away_settings.energy_saving_settings.energy_saving_temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (decoded.auto_away_settings.energy_saving_settings.mode == 0x01) {
					decoded.auto_away_settings.energy_saving_settings.energy_saving_valve_opening_degree = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x68:
				decoded.anti_freeze_protection_setting = decoded.anti_freeze_protection_setting || {};
				// 0：Disable, 1：Enable
				decoded.anti_freeze_protection_setting.enable = readUInt8(bytes, counterObj, 1);
				decoded.anti_freeze_protection_setting.temperature_value = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x69:
				// 0：Disable, 1：Enable
				decoded.mandatory_heating_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x6a:
				decoded.child_lock = decoded.child_lock || {};
				// 0：Disable, 1：Enable
				decoded.child_lock.enable = readUInt8(bytes, counterObj, 1);
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0：Disable, 1：Enable
				decoded.child_lock.system_button = extractBits(bitOptions, 0, 1);
				// 0：Disable, 1：Enable
				decoded.child_lock.func_button = extractBits(bitOptions, 1, 2);
				decoded.child_lock.reserved = extractBits(bitOptions, 2, 8);
				break;
			case 0x6b:
				decoded.motor_stroke_limit = readUInt8(bytes, counterObj, 1);
				break;
			case 0x6c:
				decoded.temperature_calibration_settings = decoded.temperature_calibration_settings || {};
				// 0：Disable, 1：Enable
				decoded.temperature_calibration_settings.enable = readUInt8(bytes, counterObj, 1);
				decoded.temperature_calibration_settings.calibration_value = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x6d:
				decoded.temperature_alarm_settings = decoded.temperature_alarm_settings || {};
				// 0：Disable, 1：Enable
				decoded.temperature_alarm_settings.enable = readUInt8(bytes, counterObj, 1);
				// 0:Disable, 1:Condition: x<A, 2:Condition: x>B, 4:Condition: x<A or x>B
				decoded.temperature_alarm_settings.threshold_condition = readUInt8(bytes, counterObj, 1);
				decoded.temperature_alarm_settings.threshold_min = readInt16LE(bytes, counterObj, 2) / 100;
				decoded.temperature_alarm_settings.threshold_max = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x6e:
				decoded.schedule_settings = decoded.schedule_settings || [];
				var id = readUInt8(bytes, counterObj, 1);
				var schedule_settings_item = pickArrayItem(decoded.schedule_settings, id);
				schedule_settings_item.id = id;
				insertArrayItem(decoded.schedule_settings, schedule_settings_item);
				var schedule_settings_item_command = readUInt8(bytes, counterObj, 1);
				if (schedule_settings_item_command == 0x00) {
					// 0：Disable, 1：Enable
					schedule_settings_item.enable = readUInt8(bytes, counterObj, 1);
				}
				if (schedule_settings_item_command == 0x01) {
					schedule_settings_item.start_time = readUInt16LE(bytes, counterObj, 2);
				}
				if (schedule_settings_item_command == 0x02) {
					schedule_settings_item.cycle_settings = schedule_settings_item.cycle_settings || {};
					var bitOptions = readUInt8(bytes, counterObj, 1);
					// 0：Disable, 1：Enable
					schedule_settings_item.cycle_settings.execution_day_sun = extractBits(bitOptions, 0, 1);
					// 0：Disable, 1：Enable
					schedule_settings_item.cycle_settings.execution_day_mon = extractBits(bitOptions, 1, 2);
					// 0：Disable, 1：Enable
					schedule_settings_item.cycle_settings.execution_day_tues = extractBits(bitOptions, 2, 3);
					// 0：Disable, 1：Enable
					schedule_settings_item.cycle_settings.execution_day_wed = extractBits(bitOptions, 3, 4);
					// 0：Disable, 1：Enable
					schedule_settings_item.cycle_settings.execution_day_thur = extractBits(bitOptions, 4, 5);
					// 0：Disable, 1：Enable
					schedule_settings_item.cycle_settings.execution_day_fri = extractBits(bitOptions, 5, 6);
					// 0：Disable, 1：Enable
					schedule_settings_item.cycle_settings.execution_day_sat = extractBits(bitOptions, 6, 7);
					schedule_settings_item.cycle_settings.reserved = extractBits(bitOptions, 7, 8);
				}
				if (schedule_settings_item_command == 0x03) {
					// 0：Automatic Temperature Control, 1：Valve Opening Control, 2：Comprehensive Control
					schedule_settings_item.temperature_control_mode = readUInt8(bytes, counterObj, 1);
				}
				if (schedule_settings_item_command == 0x04) {
					schedule_settings_item.target_temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (schedule_settings_item_command == 0x05) {
					schedule_settings_item.target_valve_status = readUInt8(bytes, counterObj, 1);
				}
				if (schedule_settings_item_command == 0x06) {
					// 0：Disable, 1：Enable
					schedule_settings_item.pre_heating_enable = readUInt8(bytes, counterObj, 1);
				}
				if (schedule_settings_item_command == 0x07) {
					// 0：Auto, 1：Manual
					schedule_settings_item.pre_heating_mode = readUInt8(bytes, counterObj, 1);
				}
				if (schedule_settings_item_command == 0x08) {
					schedule_settings_item.pre_heating_manual_time = readUInt16LE(bytes, counterObj, 2);
				}
				if (schedule_settings_item_command == 0x09) {
					schedule_settings_item.report_cycle = readUInt16LE(bytes, counterObj, 2);
				}
				break;
			case 0x6f:
				// 0：Disable, 1：Enable
				decoded.change_report_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0xc7:
				decoded.time_zone = readInt16LE(bytes, counterObj, 2);
				break;
			case 0xc6:
				decoded.daylight_saving_time = decoded.daylight_saving_time || {};
				// 0：Disable, 1：Enable
				decoded.daylight_saving_time.enable = readUInt8(bytes, counterObj, 1);
				decoded.daylight_saving_time.daylight_saving_time_offset = readUInt8(bytes, counterObj, 1);
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
			case 0xc5:
				decoded.data_storage_settings = decoded.data_storage_settings || {};
				var data_storage_settings_command = readUInt8(bytes, counterObj, 1);
				if (data_storage_settings_command == 0x00) {
					// 0：Disable, 1：Enable
					decoded.data_storage_settings.enable = readUInt8(bytes, counterObj, 1);
				}
				if (data_storage_settings_command == 0x01) {
					// 0：Disable, 1：Enable
					decoded.data_storage_settings.retransmission_enable = readUInt8(bytes, counterObj, 1);
				}
				if (data_storage_settings_command == 0x02) {
					decoded.data_storage_settings.retransmission_interval = readUInt16LE(bytes, counterObj, 2);
				}
				if (data_storage_settings_command == 0x03) {
					decoded.data_storage_settings.retrieval_interval = readUInt16LE(bytes, counterObj, 2);
				}
				break;
			case 0xb6:
				decoded.reconnect = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0xb9:
				decoded.query_device_status = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0xb8:
				decoded.synchronize_time = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0xb7:
				decoded.set_time = decoded.set_time || {};
				decoded.set_time.timestamp = readUInt32LE(bytes, counterObj, 4);
				break;
			case 0xbd:
				decoded.clear_historical_data = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0xbc:
				decoded.stop_historical_data_retrieval = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0x57:
				decoded.query_motor_stroke_position = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0x58:
				decoded.calibrate_motor = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0x59:
				decoded.set_target_valve_opening_degree = decoded.set_target_valve_opening_degree || {};
				decoded.set_target_valve_opening_degree.value = readUInt8(bytes, counterObj, 1);
				break;
			case 0x5a:
				decoded.set_target_temperature = decoded.set_target_temperature || {};
				decoded.set_target_temperature.value = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x5b:
				decoded.set_temperature = decoded.set_temperature || {};
				decoded.set_temperature.value = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x5c:
				decoded.set_occupancy_state = decoded.set_occupancy_state || {};
				// 0：Unoccupied, 1：Occupied
				decoded.set_occupancy_state.state = readUInt8(bytes, counterObj, 1);
				break;
			case 0x5d:
				decoded.set_opening_window = decoded.set_opening_window || {};
				// 0：Normal, 1：Open
				decoded.set_opening_window.state = readUInt8(bytes, counterObj, 1);
				break;
			case 0x5e:
				decoded.delete_schedule = decoded.delete_schedule || {};
				// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8, 8：Schedule9, 9：Schedule10, 10：Schedule11, 11：Schedule12, 12：Schedule13, 13：Schedule14, 14：Schedule15, 15：Schedule16, 255：Reset All 
				decoded.delete_schedule.type = readUInt8(bytes, counterObj, 1);
				break;
			case 0xbf:
				decoded.reset = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0xbe:
				decoded.reboot = readOnlyCommand(bytes, counterObj, 0);
				break;
		}
		if (unknown_command) {
			throw new Error('unknown command: ' + command_id);
		}
	}

	return decoded;
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
	if (startBit < 0 || endBit > 16 || startBit >= endBit) {
	  throw new Error("invalid bit range");
	}
  
	var width = endBit - startBit;
	var mask = (1 << width) - 1;
	return (byte >>> startBit) & mask;
}

function pickArrayItem(array, index) {
    for (var i = 0; i < array.length; i++) { 
        if (array[i].id === index) {
            return array[i];
        }
    }

	return {};
}

function insertArrayItem(array, item) {
    for (var i = 0; i < array.length; i++) { 
        if (array[i].id === item.id) {
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
	return cmdMap()[cmd];
}

function cmdMap() {
	return {
		  "57": "query_motor_stroke_position",
		  "58": "calibrate_motor",
		  "59": "set_target_valve_opening_degree",
		  "60": "temperature_unit",
		  "61": "temperature_source_settings",
		  "62": "env_temperature_display_enable",
		  "63": "heating_period_settings",
		  "65": "target_temperature_control_settings",
		  "66": "window_opening_detection_settings",
		  "67": "auto_away_settings",
		  "68": "anti_freeze_protection_setting",
		  "69": "mandatory_heating_enable",
		  "6300": "heating_period_settings.heating_date_settings",
		  "6301": "heating_period_settings.heating_period_reporting_interval",
		  "6302": "heating_period_settings.non_heating_period_reporting_interval",
		  "6303": "heating_period_settings.valve_status_control",
		  "6500": "target_temperature_control_settings.enable",
		  "6501": "target_temperature_control_settings.target_temperature_resolution",
		  "6502": "target_temperature_control_settings.under_temperature_side_deadband",
		  "6503": "target_temperature_control_settings.over_temperature_side_deadband",
		  "6504": "target_temperature_control_settings.target_temperature_adjustment_range_min",
		  "6505": "target_temperature_control_settings.target_temperature_adjustment_range_max",
		  "6506": "target_temperature_control_settings.mode_settings",
		  "fe": "request_check_order",
		  "ef": "request_command_queries",
		  "ee": "request_query_all_configurations",
		  "cf": "lorawan_configuration_settings",
		  "cf00": "lorawan_configuration_settings.mode",
		  "df": "tsl_version",
		  "de": "product_name",
		  "dd": "product_pn",
		  "db": "product_sn",
		  "da": "version",
		  "d9": "oem_id",
		  "c8": "device_status",
		  "d8": "product_frequency_band",
		  "00": "battery",
		  "01": "temperature",
		  "02": "motor_total_stroke",
		  "03": "motor_position",
		  "04": "valve_opening_degree",
		  "05": "motor_calibration_result_report",
		  "06": "target_temperature",
		  "07": "target_valve_opening_degree",
		  "08": "low_battery_alarm",
		  "09": "temperature_alarm",
		  "0a": "anti_freeze_protection_alarm",
		  "0b": "mandatory_heating_alarm",
		  "0c": "auto_away_report",
		  "0d": "window_opening_alarm",
		  "6a": "child_lock",
		  "6b": "motor_stroke_limit",
		  "6c": "temperature_calibration_settings",
		  "6d": "temperature_alarm_settings",
		  "6e": "schedule_settings",
		  "6f": "change_report_enable",
		  "c7": "time_zone",
		  "c6": "daylight_saving_time",
		  "c5": "data_storage_settings",
		  "c500": "data_storage_settings.enable",
		  "c501": "data_storage_settings.retransmission_enable",
		  "c502": "data_storage_settings.retransmission_interval",
		  "c503": "data_storage_settings.retrieval_interval",
		  "b6": "reconnect",
		  "b9": "query_device_status",
		  "b8": "synchronize_time",
		  "b7": "set_time",
		  "bd": "clear_historical_data",
		  "bc": "stop_historical_data_retrieval",
		  "5a": "set_target_temperature",
		  "5b": "set_temperature",
		  "5c": "set_occupancy_state",
		  "5d": "set_opening_window",
		  "5e": "delete_schedule",
		  "bf": "reset",
		  "be": "reboot"
	};
}