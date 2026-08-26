/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product UC601
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
			case 0xee:
				decoded.all_configurations_request_by_device = readOnlyCommand(bytes, counterObj, 0);
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
			case 0xb8:
				decoded.synchronize_time = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0xbf:
				decoded.reset = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0xbe:
				decoded.reboot = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0x00:
				decoded.voltage = readUInt16LE(bytes, counterObj, 2) / 10;
				break;
			case 0x20:
				decoded.voltage_alarm = decoded.voltage_alarm || {};
				decoded.voltage_alarm.type = readUInt8(bytes, counterObj, 1);
				if (decoded.voltage_alarm.type == 0x00) {
					decoded.voltage_alarm.collection_error = decoded.voltage_alarm.collection_error || {};
				}
				break;
			case 0x01:
				decoded.electric_power = readUInt32LE(bytes, counterObj, 4);
				break;
			case 0x21:
				decoded.electric_power_alarm = decoded.electric_power_alarm || {};
				decoded.electric_power_alarm.type = readUInt8(bytes, counterObj, 1);
				if (decoded.electric_power_alarm.type == 0x00) {
					decoded.electric_power_alarm.collection_error = decoded.electric_power_alarm.collection_error || {};
				}
				break;
			case 0x02:
				decoded.power_factor = readUInt8(bytes, counterObj, 1);
				break;
			case 0x22:
				decoded.power_factor_alarm = decoded.power_factor_alarm || {};
				decoded.power_factor_alarm.type = readUInt8(bytes, counterObj, 1);
				if (decoded.power_factor_alarm.type == 0x00) {
					decoded.power_factor_alarm.collection_error = decoded.power_factor_alarm.collection_error || {};
				}
				break;
			case 0x03:
				decoded.power_consumption = readUInt32LE(bytes, counterObj, 4) / 1000;
				break;
			case 0x23:
				decoded.power_consumption_alarm = decoded.power_consumption_alarm || {};
				decoded.power_consumption_alarm.type = readUInt8(bytes, counterObj, 1);
				if (decoded.power_consumption_alarm.type == 0x00) {
					decoded.power_consumption_alarm.collection_error = decoded.power_consumption_alarm.collection_error || {};
				}
				break;
			case 0x04:
				decoded.current = readUInt16LE(bytes, counterObj, 2) / 1000;
				break;
			case 0x24:
				decoded.current_alarm = decoded.current_alarm || {};
				decoded.current_alarm.type = readUInt8(bytes, counterObj, 1);
				if (decoded.current_alarm.type == 0x00) {
					decoded.current_alarm.collection_error = decoded.current_alarm.collection_error || {};
				}
				break;
			case 0x05:
				decoded.equipment_temperature = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x25:
				decoded.equipment_temperature_alarm = decoded.equipment_temperature_alarm || {};
				decoded.equipment_temperature_alarm.type = readUInt8(bytes, counterObj, 1);
				if (decoded.equipment_temperature_alarm.type == 0x00) {
					decoded.equipment_temperature_alarm.collection_error = decoded.equipment_temperature_alarm.collection_error || {};
				}
				if (decoded.equipment_temperature_alarm.type == 0x01) {
					decoded.equipment_temperature_alarm.lower_range_error = decoded.equipment_temperature_alarm.lower_range_error || {};
				}
				if (decoded.equipment_temperature_alarm.type == 0x02) {
					decoded.equipment_temperature_alarm.over_range_error = decoded.equipment_temperature_alarm.over_range_error || {};
				}
				break;
			case 0x06:
				decoded.ambient_temperature = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x26:
				decoded.ambient_temperature_alarm = decoded.ambient_temperature_alarm || {};
				decoded.ambient_temperature_alarm.type = readUInt8(bytes, counterObj, 1);
				if (decoded.ambient_temperature_alarm.type == 0x00) {
					decoded.ambient_temperature_alarm.collection_error = decoded.ambient_temperature_alarm.collection_error || {};
				}
				if (decoded.ambient_temperature_alarm.type == 0x03) {
					decoded.ambient_temperature_alarm.no_data = decoded.ambient_temperature_alarm.no_data || {};
				}
				break;
			case 0x07:
				// 0：normally closed, 1：normally open
				decoded.relays_status = readUInt8(bytes, counterObj, 1);
				break;
			case 0x08:
				decoded.overcurrent_alarm = decoded.overcurrent_alarm || {};
				decoded.overcurrent_alarm.current = readUInt16LE(bytes, counterObj, 2) / 1000;
				decoded.current = decoded.overcurrent_alarm.current;
				// 0：over current alarm Release, 1：over current alarm trigger
				decoded.overcurrent_alarm.status = readUInt8(bytes, counterObj, 1);
				break;
			case 0x09:
				decoded.overcurrent_protection_trigger = decoded.overcurrent_protection_trigger || {};
				decoded.overcurrent_protection_trigger.current = readUInt16LE(bytes, counterObj, 2) / 1000;
				decoded.current = decoded.overcurrent_protection_trigger.current;
				// 0：normal, 1：over current protect  trigger
				decoded.overcurrent_protection_trigger.status = readUInt8(bytes, counterObj, 1);
				break;
			case 0x0a:
				decoded.high_current_alarm = decoded.high_current_alarm || {};
				decoded.high_current_alarm.current = readUInt16LE(bytes, counterObj, 2) / 1000;
				decoded.current = decoded.high_current_alarm.current;
				// 0：normal, 1：high current protect  trigger
				decoded.high_current_alarm.status = readUInt8(bytes, counterObj, 1);
				break;
			case 0x0b:
				decoded.overvoltage_alarm = decoded.overvoltage_alarm || {};
				decoded.overvoltage_alarm.voltage = readUInt16LE(bytes, counterObj, 2) / 10;
				decoded.voltage = decoded.overvoltage_alarm.voltage;
				// 0：over voltage alarm Release, 1：over voltage alarm trigger
				decoded.overvoltage_alarm.status = readUInt8(bytes, counterObj, 1);
				break;
			case 0x0c:
				decoded.overvoltage_protect_trigger = decoded.overvoltage_protect_trigger || {};
				decoded.overvoltage_protect_trigger.voltage = readUInt16LE(bytes, counterObj, 2) / 10;
				decoded.voltage = decoded.overvoltage_protect_trigger.voltage;
				// 0：normal, 1：over voltage protect trigger
				decoded.overvoltage_protect_trigger.status = readUInt8(bytes, counterObj, 1);
				break;
			case 0x0d:
				decoded.device_broken_alarm = decoded.device_broken_alarm || {};
				// 0：normal, 1：device broken
				decoded.device_broken_alarm.status = readUInt8(bytes, counterObj, 1);
				break;
			case 0x0e:
				decoded.overtemperature_protect = decoded.overtemperature_protect || {};
				decoded.overtemperature_protect.temperature = readInt16LE(bytes, counterObj, 2) / 10;
				decoded.equipment_temperature = decoded.overtemperature_protect.temperature;
				// 0：normal, 1：over temperature  trigger
				decoded.overtemperature_protect.status = readUInt8(bytes, counterObj, 1);
				break;
			case 0x0f:
				decoded.freeze_protection = decoded.freeze_protection || {};
				decoded.freeze_protection.temperature = readInt16LE(bytes, counterObj, 2) / 10;
				decoded.ambient_temperature = decoded.freeze_protection.temperature;
				// 0：normal, 1：freeze protection
				decoded.freeze_protection.status = readUInt8(bytes, counterObj, 1);
				break;
			case 0x10:
				decoded.open_window_detection = decoded.open_window_detection || {};
				decoded.open_window_detection.temperature = readInt16LE(bytes, counterObj, 2) / 10;
				decoded.ambient_temperature = decoded.open_window_detection.temperature;
				// 0：normal, 1：open window
				decoded.open_window_detection.status = readUInt8(bytes, counterObj, 1);
				break;
			case 0x11:
				decoded.relays_status_change = decoded.relays_status_change || {};
				// 0：normally closed, 1：normally open
				decoded.relays_status_change.status = readUInt8(bytes, counterObj, 1);
				break;
			case 0x60:
				decoded.reporting_interval = decoded.reporting_interval || {};
				// 0：second, 1：min
				decoded.reporting_interval.unit = readUInt8(bytes, counterObj, 1);
				if (decoded.reporting_interval.unit == 0x00) {
					decoded.reporting_interval.seconds_of_time = readUInt16LE(bytes, counterObj, 2);
				}
				if (decoded.reporting_interval.unit == 0x01) {
					decoded.reporting_interval.minutes_of_time = readUInt16LE(bytes, counterObj, 2);
				}
				break;
			case 0x61:
				// 0：℃, 1：℉
				decoded.temperature_unit = readUInt8(bytes, counterObj, 1);
				break;
			case 0x62:
				// 0：disable, 1：enable
				decoded.led_status = readUInt8(bytes, counterObj, 1);
				break;
			case 0x63:
				decoded.button_lock_settings = decoded.button_lock_settings || {};
				var button_lock_settings_type = readUInt8(bytes, counterObj, 1);
				if (button_lock_settings_type == 0x00) {
					// 0：disable, 1：enable
					decoded.button_lock_settings.switch_lock_enable = readUInt8(bytes, counterObj, 1);
				}
				if (button_lock_settings_type == 0x01) {
					// 0：disable, 1：enable
					decoded.button_lock_settings.switch_reset_enable = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x64:
				decoded.overcurrent_alarm_rule = decoded.overcurrent_alarm_rule || {};
				var overcurrent_alarm_rule_type = readUInt8(bytes, counterObj, 1);
				if (overcurrent_alarm_rule_type == 0x00) {
					// 0：disable, 1：enable
					decoded.overcurrent_alarm_rule.enable = readUInt8(bytes, counterObj, 1);
				}
				if (overcurrent_alarm_rule_type == 0x01) {
					decoded.overcurrent_alarm_rule.threshold_max = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x65:
				decoded.overcurrent_protection_rule = decoded.overcurrent_protection_rule || {};
				var overcurrent_protection_rule_type = readUInt8(bytes, counterObj, 1);
				if (overcurrent_protection_rule_type == 0x00) {
					// 0：disable, 1：enable
					decoded.overcurrent_protection_rule.enable = readUInt8(bytes, counterObj, 1);
				}
				if (overcurrent_protection_rule_type == 0x01) {
					decoded.overcurrent_protection_rule.threshold_max = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x66:
				decoded.overvoltage_alarm_rule = decoded.overvoltage_alarm_rule || {};
				var overvoltage_alarm_rule_type = readUInt8(bytes, counterObj, 1);
				if (overvoltage_alarm_rule_type == 0x00) {
					// 0：disable, 1：enable
					decoded.overvoltage_alarm_rule.enable = readUInt8(bytes, counterObj, 1);
				}
				if (overvoltage_alarm_rule_type == 0x01) {
					decoded.overvoltage_alarm_rule.threshold_max = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x67:
				decoded.overvoltage_protection_rule = decoded.overvoltage_protection_rule || {};
				var overvoltage_protection_rule_type = readUInt8(bytes, counterObj, 1);
				if (overvoltage_protection_rule_type == 0x00) {
					// 0：disable, 1：enable
					decoded.overvoltage_protection_rule.enable = readUInt8(bytes, counterObj, 1);
				}
				if (overvoltage_protection_rule_type == 0x01) {
					decoded.overvoltage_protection_rule.threshold_max = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x68:
				// 0：disable, 1：enable
				decoded.high_current_protection_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x69:
				// 0：disable, 1：enable
				decoded.relay_abnormal_protection_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x6a:
				// 0：disable, 1：enable
				decoded.alarm_deactivation_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x6b:
				// 2：Return to Previous Working State, 0：normally closed, 1：normally open
				decoded.power_on_relay_mode = readUInt8(bytes, counterObj, 1);
				break;
			case 0x6c:
				// 0：disable, 1：enable
				decoded.power_metering_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x6d:
				decoded.bluetooth_name = readString(bytes, counterObj, 32);
				break;
			case 0x6e:
				// 0：disable, 1：enable
				decoded.d2d_pairing_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x6f:
				decoded.d2d_pairing_settings = decoded.d2d_pairing_settings || [];
				var index = readUInt8(bytes, counterObj, 1);
				var d2d_pairing_settings_item = pickArrayItem(decoded.d2d_pairing_settings, index, 'index');
				d2d_pairing_settings_item.index = index;
				insertArrayItem(decoded.d2d_pairing_settings, d2d_pairing_settings_item, 'index');
				var d2d_pairing_settings_item_type = readUInt8(bytes, counterObj, 1);
				if (d2d_pairing_settings_item_type == 0x00) {
					// 0：disable, 1：enable
					d2d_pairing_settings_item.enable = readUInt8(bytes, counterObj, 1);
				}
				if (d2d_pairing_settings_item_type == 0x01) {
					d2d_pairing_settings_item.deveui = readHexString(bytes, counterObj, 8);
				}
				if (d2d_pairing_settings_item_type == 0x02) {
					d2d_pairing_settings_item.name_first = readString(bytes, counterObj, 8);
				}
				if (d2d_pairing_settings_item_type == 0x03) {
					d2d_pairing_settings_item.name_last = readString(bytes, counterObj, 8);
				}
				break;
			case 0x70:
				// 0：disable, 1：enable
				decoded.ambient_temperature_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x71:
				decoded.ambient_temperature_settings = decoded.ambient_temperature_settings || {};
				var ambient_temperature_settings_type = readUInt8(bytes, counterObj, 1);
				if (ambient_temperature_settings_type == 0x00) {
					// 0 : d2d data, 1：lora data
					decoded.ambient_temperature_settings.source = readUInt8(bytes, counterObj, 1);
				}
				if (ambient_temperature_settings_type == 0x01) {
					decoded.ambient_temperature_settings.timeout = readUInt8(bytes, counterObj, 1);
				}
				if (ambient_temperature_settings_type == 0x02) {
					// 0：keep status, 1：normally open, 2：normally closed
					decoded.ambient_temperature_settings.relay_timeout = readUInt8(bytes, counterObj, 1);
				}
				if (ambient_temperature_settings_type == 0x03) {
					// 0：normally closed, 1：normally open
					decoded.ambient_temperature_settings.relay_heat = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x72:
				// 0：disable, 1：enable
				decoded.temperature_control_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x73:
				decoded.temperature_control_settings = decoded.temperature_control_settings || {};
				var temperature_control_settings_type = readUInt8(bytes, counterObj, 1);
				if (temperature_control_settings_type == 0x00) {
					decoded.temperature_control_settings.target = readUInt16LE(bytes, counterObj, 2) / 100;
				}
				if (temperature_control_settings_type == 0x01) {
					decoded.temperature_control_settings.tolerance = readUInt16LE(bytes, counterObj, 2) / 100;
				}
				if (temperature_control_settings_type == 0x02) {
					decoded.temperature_control_settings.range = decoded.temperature_control_settings.range || {};
					decoded.temperature_control_settings.range.min = readUInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature_control_settings.range.max = readUInt16LE(bytes, counterObj, 2) / 100;
				}
				break;
			case 0x74:
				// 0：Disable, 1：Enable
				decoded.window_opening_detection_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x75:
				decoded.open_window_settings = decoded.open_window_settings || {};
				var open_window_settings_type = readUInt8(bytes, counterObj, 1);
				if (open_window_settings_type == 0x00) {
					decoded.open_window_settings.cooling_rate = readUInt16LE(bytes, counterObj, 2) / 100;
				}
				if (open_window_settings_type == 0x01) {
					decoded.open_window_settings.stop_temperature_control_time = readUInt16LE(bytes, counterObj, 2);
				}
				break;
			case 0x76:
				decoded.anti_freeze_protection_settings = decoded.anti_freeze_protection_settings || {};
				var anti_freeze_protection_settings_type = readUInt8(bytes, counterObj, 1);
				if (anti_freeze_protection_settings_type == 0x00) {
					// 0：Disable, 1：Enable
					decoded.anti_freeze_protection_settings.enable = readUInt8(bytes, counterObj, 1);
				}
				if (anti_freeze_protection_settings_type == 0x01) {
					decoded.anti_freeze_protection_settings.temperature_value = readUInt16LE(bytes, counterObj, 2) / 100;
				}
				break;
			case 0x77:
				decoded.schedule_settings = decoded.schedule_settings || [];
				var id = readUInt8(bytes, counterObj, 1);
				var schedule_settings_item = pickArrayItem(decoded.schedule_settings, id, 'id');
				schedule_settings_item.id = id;
				insertArrayItem(decoded.schedule_settings, schedule_settings_item, 'id');
				var schedule_settings_item_command = readUInt8(bytes, counterObj, 1);
				if (schedule_settings_item_command == 0x00) {
					// 0：None, 1：Enable, 2：Disable
					schedule_settings_item.status = readUInt8(bytes, counterObj, 1);
				}
				if (schedule_settings_item_command == 0x01) {
					schedule_settings_item.cycle_settings = schedule_settings_item.cycle_settings || {};
					var bitOptions = readUInt8(bytes, counterObj, 1);
					// 0：Disable, 1：Enable
					schedule_settings_item.cycle_settings.execution_day_sun = extractBits(bitOptions, 6, 7);
					// 0：Disable, 1：Enable
					schedule_settings_item.cycle_settings.execution_day_mon = extractBits(bitOptions, 0, 1);
					// 0：Disable, 1：Enable
					schedule_settings_item.cycle_settings.execution_day_tues = extractBits(bitOptions, 1, 2);
					// 0：Disable, 1：Enable
					schedule_settings_item.cycle_settings.execution_day_wed = extractBits(bitOptions, 2, 3);
					// 0：Disable, 1：Enable
					schedule_settings_item.cycle_settings.execution_day_thur = extractBits(bitOptions, 3, 4);
					// 0：Disable, 1：Enable
					schedule_settings_item.cycle_settings.execution_day_fri = extractBits(bitOptions, 4, 5);
					// 0：Disable, 1：Enable
					schedule_settings_item.cycle_settings.execution_day_sat = extractBits(bitOptions, 5, 6);
					schedule_settings_item.cycle_settings.reserved = extractBits(bitOptions, 7, 8);
					schedule_settings_item.cycle_settings.execution_hour = readUInt8(bytes, counterObj, 1);
					schedule_settings_item.cycle_settings.execution_min = readUInt8(bytes, counterObj, 1);
				}
				if (schedule_settings_item_command == 0x02) {
					// 0：relay , 1：temperature control
					schedule_settings_item.schedule_target = readUInt8(bytes, counterObj, 1);
				}
				if (schedule_settings_item_command == 0x03) {
					// 0:normally open, 1:normally closed, 2:change, 3：Start up, 4：stop
					schedule_settings_item.schedule_action = readUInt8(bytes, counterObj, 1);
				}
				if (schedule_settings_item_command == 0x04) {
					schedule_settings_item.schedule_parameter = readUInt16LE(bytes, counterObj, 2) / 100;
				}
				break;
			case 0x78:
				// 0：disable, 1：enable
				decoded.d2d_slave_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x79:
				decoded.d2d_slave_settings = decoded.d2d_slave_settings || [];
				var index = readUInt8(bytes, counterObj, 1);
				var d2d_slave_settings_item = pickArrayItem(decoded.d2d_slave_settings, index, 'index');
				d2d_slave_settings_item.index = index;
				insertArrayItem(decoded.d2d_slave_settings, d2d_slave_settings_item, 'index');
				var d2d_slave_settings_item_type = readUInt8(bytes, counterObj, 1);
				if (d2d_slave_settings_item_type == 0x00) {
					// 0：disable, 1：enable
					d2d_slave_settings_item.enable = readUInt8(bytes, counterObj, 1);
				}
				if (d2d_slave_settings_item_type == 0x01) {
					d2d_slave_settings_item.command = readHexString(bytes, counterObj, 2);
				}
				if (d2d_slave_settings_item_type == 0x02) {
					// 0：relay , 1：temperature control
					d2d_slave_settings_item.content = readUInt8(bytes, counterObj, 1);
				}
				if (d2d_slave_settings_item_type == 0x03) {
					// 0:normally open, 1:normally closed, 2:change, 3：Start up, 4：stop
					d2d_slave_settings_item.action = readUInt8(bytes, counterObj, 1);
				}
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
			case 0x7e:
				decoded.lora_tx_rdt_max = readUInt8(bytes, counterObj, 1);
				break;
			case 0x7a:
				decoded.update_relay_state = decoded.update_relay_state || {};
				// 0：normally closed, 1：normally open
				decoded.update_relay_state.state = readUInt8(bytes, counterObj, 1);
				break;
			case 0x7b:
				decoded.clear_power_metering = decoded.clear_power_metering || {};
				decoded.clear_power_metering.clear = readUInt8(bytes, counterObj, 1);
				break;
			case 0x7c:
				decoded.update_open_windows_state = decoded.update_open_windows_state || {};
				decoded.update_open_windows_state.update = readUInt8(bytes, counterObj, 1);
				break;
			case 0x7d:
				decoded.send_temperature = decoded.send_temperature || {};
				decoded.send_temperature.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x7f:
				decoded.reset_all_plans = decoded.reset_all_plans || {};
				decoded.reset_all_plans.reset = readUInt8(bytes, counterObj, 1);
				break;
			default:
				unknown_command = 1;
				break;
		}
		if (unknown_command) {
			throw new Error('unknown command: 0x' + command_id.toString(16));
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
	patchDecode(result);

	return result;
}

function patchDecode(decoded) {}

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

function removePath(obj, path) {
	var parts = path.split('.');
	var chain = [obj];
	var current = obj;

	for (var i = 0; i < parts.length - 1; i++) {
		var key = parts[i];

		if (!current || typeof current[key] !== 'object') {
			return obj;
		}

		current = current[key];
		chain.push(current);
	}

	var leaf = parts[parts.length - 1];

	if (!current || !Object.prototype.hasOwnProperty.call(current, leaf)) {
		return obj;
	}

	delete current[leaf];

	// prune empty intermediate containers left behind on the path
	for (var j = chain.length - 1; j >= 1; j--) {
		if (Object.keys(chain[j]).length === 0) {
			delete chain[j - 1][parts[j - 1]];
		} else {
			break;
		}
	}

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
		  "10": "open_window_detection",
		  "11": "relays_status_change",
		  "20": "voltage_alarm",
		  "21": "electric_power_alarm",
		  "22": "power_factor_alarm",
		  "23": "power_consumption_alarm",
		  "24": "current_alarm",
		  "25": "equipment_temperature_alarm",
		  "26": "ambient_temperature_alarm",
		  "60": "reporting_interval",
		  "61": "temperature_unit",
		  "62": "led_status",
		  "63": "button_lock_settings",
		  "64": "overcurrent_alarm_rule",
		  "65": "overcurrent_protection_rule",
		  "66": "overvoltage_alarm_rule",
		  "67": "overvoltage_protection_rule",
		  "68": "high_current_protection_enable",
		  "69": "relay_abnormal_protection_enable",
		  "70": "ambient_temperature_enable",
		  "71": "ambient_temperature_settings",
		  "72": "temperature_control_enable",
		  "73": "temperature_control_settings",
		  "74": "window_opening_detection_enable",
		  "75": "open_window_settings",
		  "76": "anti_freeze_protection_settings",
		  "77": "schedule_settings",
		  "78": "d2d_slave_enable",
		  "79": "d2d_slave_settings",
		  "2000": "voltage_alarm.collection_error",
		  "2100": "electric_power_alarm.collection_error",
		  "2200": "power_factor_alarm.collection_error",
		  "2300": "power_consumption_alarm.collection_error",
		  "2400": "current_alarm.collection_error",
		  "2500": "equipment_temperature_alarm.collection_error",
		  "2501": "equipment_temperature_alarm.lower_range_error",
		  "2502": "equipment_temperature_alarm.over_range_error",
		  "2600": "ambient_temperature_alarm.collection_error",
		  "2603": "ambient_temperature_alarm.no_data",
		  "6000": "reporting_interval.seconds_of_time",
		  "6001": "reporting_interval.minutes_of_time",
		  "6300": "button_lock_settings.switch_lock_enable",
		  "6301": "button_lock_settings.switch_reset_enable",
		  "6400": "overcurrent_alarm_rule.enable",
		  "6401": "overcurrent_alarm_rule.threshold_max",
		  "6500": "overcurrent_protection_rule.enable",
		  "6501": "overcurrent_protection_rule.threshold_max",
		  "6600": "overvoltage_alarm_rule.enable",
		  "6601": "overvoltage_alarm_rule.threshold_max",
		  "6700": "overvoltage_protection_rule.enable",
		  "6701": "overvoltage_protection_rule.threshold_max",
		  "7100": "ambient_temperature_settings.source",
		  "7101": "ambient_temperature_settings.timeout",
		  "7102": "ambient_temperature_settings.relay_timeout",
		  "7103": "ambient_temperature_settings.relay_heat",
		  "7300": "temperature_control_settings.target",
		  "7301": "temperature_control_settings.tolerance",
		  "7302": "temperature_control_settings.range",
		  "7500": "open_window_settings.cooling_rate",
		  "7501": "open_window_settings.stop_temperature_control_time",
		  "7600": "anti_freeze_protection_settings.enable",
		  "7601": "anti_freeze_protection_settings.temperature_value",
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
		  "b8": "synchronize_time",
		  "bf": "reset",
		  "be": "reboot",
		  "00": "voltage",
		  "01": "electric_power",
		  "02": "power_factor",
		  "03": "power_consumption",
		  "04": "current",
		  "05": "equipment_temperature",
		  "06": "ambient_temperature",
		  "07": "relays_status",
		  "08": "overcurrent_alarm",
		  "09": "overcurrent_protection_trigger",
		  "0a": "high_current_alarm",
		  "0b": "overvoltage_alarm",
		  "0c": "overvoltage_protect_trigger",
		  "0d": "device_broken_alarm",
		  "0e": "overtemperature_protect",
		  "0f": "freeze_protection",
		  "6a": "alarm_deactivation_enable",
		  "6b": "power_on_relay_mode",
		  "6c": "power_metering_enable",
		  "6d": "bluetooth_name",
		  "6e": "d2d_pairing_enable",
		  "6f": "d2d_pairing_settings",
		  "6fxx": "d2d_pairing_settings._item",
		  "6fxx00": "d2d_pairing_settings._item.enable",
		  "6fxx01": "d2d_pairing_settings._item.deveui",
		  "6fxx02": "d2d_pairing_settings._item.name_first",
		  "6fxx03": "d2d_pairing_settings._item.name_last",
		  "77xx": "schedule_settings._item",
		  "77xx00": "schedule_settings._item.status",
		  "77xx01": "schedule_settings._item.cycle_settings",
		  "77xx02": "schedule_settings._item.schedule_target",
		  "77xx03": "schedule_settings._item.schedule_action",
		  "77xx04": "schedule_settings._item.schedule_parameter",
		  "79xx": "d2d_slave_settings._item",
		  "79xx00": "d2d_slave_settings._item.enable",
		  "79xx01": "d2d_slave_settings._item.command",
		  "79xx02": "d2d_slave_settings._item.content",
		  "79xx03": "d2d_slave_settings._item.action",
		  "c7": "time_zone",
		  "c6": "daylight_saving_time",
		  "7e": "lora_tx_rdt_max",
		  "7a": "update_relay_state",
		  "7b": "clear_power_metering",
		  "7c": "update_open_windows_state",
		  "7d": "send_temperature",
		  "7f": "reset_all_plans"
	};
}
function processTemperature(decoded) {
	var allTemperatureProperties = {
    "equipment_temperature": {
        "precision": 1,
        "unitName": "℃"
    },
    "ambient_temperature": {
        "precision": 1,
        "unitName": "℃"
    },
    "overtemperature_protect.temperature": {
        "precision": 1,
        "unitName": "℃"
    },
    "freeze_protection.temperature": {
        "precision": 1,
        "unitName": "℃"
    },
    "open_window_detection.temperature": {
        "precision": 1,
        "unitName": "℃"
    },
    "temperature_control_settings.range.min": {
        "precision": 2,
        "unitName": "℃"
    },
    "temperature_control_settings.range.max": {
        "precision": 2,
        "unitName": "℃"
    },
    "open_window_settings.cooling_rate": {
        "precision": 2,
        "unitName": "℃"
    },
    "anti_freeze_protection_settings.temperature_value": {
        "precision": 2,
        "unitName": "℃"
    },
    "send_temperature.temperature": {
        "precision": 2,
        "unitName": "℃"
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
			var unitName = allTemperatureProperties[newPropertyId].unitName;
			var constant = unitName == 'K' ? 0 : 32;
			if (hasPath(decoded, propertyId)) {
				setPath(decoded, fahrenheitProperty,  Number((getPath(decoded, propertyId) * 1.8 + constant).toFixed(allTemperatureProperties[newPropertyId].precision)));
				setPath(decoded, celsiusProperty,  Number(getPath(decoded, propertyId).toFixed(allTemperatureProperties[newPropertyId].precision)));
				removePath(decoded, propertyId);
			}
		}
	}
	return decoded;
}