/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product WT303
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
			case 0xf4:
				decoded.full_inspection_reply = decoded.full_inspection_reply || {};
				var full_inspection_reply_command = readUInt8(bytes, counterObj, 1);
				if (full_inspection_reply_command == 0x00) {
					decoded.full_inspection_reply.start_inspection = decoded.full_inspection_reply.start_inspection || {};
					// 0：success, 1：failed
					decoded.full_inspection_reply.start_inspection.result = readUInt8(bytes, counterObj, 1);
				}
				if (full_inspection_reply_command == 0x01) {
					decoded.full_inspection_reply.control = decoded.full_inspection_reply.control || {};
					// 0：success, 1：failed
					decoded.full_inspection_reply.control.result = readUInt8(bytes, counterObj, 1);
				}
				if (full_inspection_reply_command == 0x02) {
					decoded.full_inspection_reply.reading = decoded.full_inspection_reply.reading || {};
					decoded.full_inspection_reply.reading.length = readUInt16LE(bytes, counterObj, 2);
					decoded.full_inspection_reply.reading.data = readBytes(bytes, counterObj, decoded.full_inspection_reply.reading.length);
				}
				if (full_inspection_reply_command == 0x03) {
					decoded.full_inspection_reply.end_inspection = decoded.full_inspection_reply.end_inspection || {};
					// 0：success, 1：failed
					decoded.full_inspection_reply.end_inspection.result = readUInt8(bytes, counterObj, 1);
				}
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
			case 0x04:
				// 0：Internal, 1：External NTC, 2：LoRaWAN Reception, 3：D2D Reception
				decoded.data_source = readUInt8(bytes, counterObj, 1);
				break;
			case 0x01:
				decoded.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x02:
				decoded.humidity = readUInt16LE(bytes, counterObj, 2) / 10;
				break;
			case 0x03:
				decoded.target_temperature = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x05:
				decoded.temperature_control_info = decoded.temperature_control_info || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0：Ventilation, 1：Heat, 2：Cool
				decoded.temperature_control_info.mode = extractBits(bitOptions, 4, 8);
				// 0：Standby, 1:Heat, 2:Cool
				decoded.temperature_control_info.status = extractBits(bitOptions, 0, 4);
				break;
			case 0x06:
				// 0：Close, 100：Open
				decoded.temperature_control_valve_status = readUInt8(bytes, counterObj, 1);
				break;
			case 0x07:
				decoded.fan_control_info = decoded.fan_control_info || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0: Auto, 1: Low, 2: Medium, 3: High
				decoded.fan_control_info.mode = extractBits(bitOptions, 4, 8);
				// 0：Off, 1: Low, 2: Medium, 3: High
				decoded.fan_control_info.status = extractBits(bitOptions, 0, 4);
				break;
			case 0x08:
				// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8, 8：Schedule9, 9：Schedule10, 10：Schedule11, 11：Schedule12, 12：Schedule13, 13：Schedule14, 14：Schedule15, 15：Schedule16, 255：Not executed
				decoded.execution_plan_id = readUInt8(bytes, counterObj, 1);
				break;
			case 0x09:
				decoded.temperature_alarm = decoded.temperature_alarm || {};
				decoded.temperature_alarm.type = readUInt8(bytes, counterObj, 1);
				if (decoded.temperature_alarm.type == 0x00) {
					decoded.temperature_alarm.collection_error = decoded.temperature_alarm.collection_error || {};
				}
				if (decoded.temperature_alarm.type == 0x01) {
					decoded.temperature_alarm.lower_range_error = decoded.temperature_alarm.lower_range_error || {};
				}
				if (decoded.temperature_alarm.type == 0x02) {
					decoded.temperature_alarm.over_range_error = decoded.temperature_alarm.over_range_error || {};
				}
				if (decoded.temperature_alarm.type == 0x03) {
					decoded.temperature_alarm.no_data = decoded.temperature_alarm.no_data || {};
				}
				if (decoded.temperature_alarm.type == 0x10) {
					decoded.temperature_alarm.lower_range_alarm_deactivation = decoded.temperature_alarm.lower_range_alarm_deactivation || {};
					decoded.temperature_alarm.lower_range_alarm_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.lower_range_alarm_deactivation.temperature;
				}
				if (decoded.temperature_alarm.type == 0x11) {
					decoded.temperature_alarm.lower_range_alarm_trigger = decoded.temperature_alarm.lower_range_alarm_trigger || {};
					decoded.temperature_alarm.lower_range_alarm_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.lower_range_alarm_trigger.temperature;
				}
				if (decoded.temperature_alarm.type == 0x12) {
					decoded.temperature_alarm.over_range_alarm_deactivation = decoded.temperature_alarm.over_range_alarm_deactivation || {};
					decoded.temperature_alarm.over_range_alarm_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.over_range_alarm_deactivation.temperature;
				}
				if (decoded.temperature_alarm.type == 0x13) {
					decoded.temperature_alarm.over_range_alarm_trigger = decoded.temperature_alarm.over_range_alarm_trigger || {};
					decoded.temperature_alarm.over_range_alarm_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.over_range_alarm_trigger.temperature;
				}
				if (decoded.temperature_alarm.type == 0x14) {
					decoded.temperature_alarm.within_range_alarm_deactivation = decoded.temperature_alarm.within_range_alarm_deactivation || {};
					decoded.temperature_alarm.within_range_alarm_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.within_range_alarm_deactivation.temperature;
				}
				if (decoded.temperature_alarm.type == 0x15) {
					decoded.temperature_alarm.within_range_alarm_trigger = decoded.temperature_alarm.within_range_alarm_trigger || {};
					decoded.temperature_alarm.within_range_alarm_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.within_range_alarm_trigger.temperature;
				}
				if (decoded.temperature_alarm.type == 0x16) {
					decoded.temperature_alarm.exceed_range_alarm_deactivation = decoded.temperature_alarm.exceed_range_alarm_deactivation || {};
					decoded.temperature_alarm.exceed_range_alarm_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.exceed_range_alarm_deactivation.temperature;
				}
				if (decoded.temperature_alarm.type == 0x17) {
					decoded.temperature_alarm.exceed_range_alarm_trigger = decoded.temperature_alarm.exceed_range_alarm_trigger || {};
					decoded.temperature_alarm.exceed_range_alarm_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.exceed_range_alarm_trigger.temperature;
				}
				if (decoded.temperature_alarm.type == 0x20) {
					decoded.temperature_alarm.persistent_low_temperature_alarm_deactivation = decoded.temperature_alarm.persistent_low_temperature_alarm_deactivation || {};
					decoded.temperature_alarm.persistent_low_temperature_alarm_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.persistent_low_temperature_alarm_deactivation.temperature;
				}
				if (decoded.temperature_alarm.type == 0x21) {
					decoded.temperature_alarm.persistent_low_temperature_alarm_trigger = decoded.temperature_alarm.persistent_low_temperature_alarm_trigger || {};
					decoded.temperature_alarm.persistent_low_temperature_alarm_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.persistent_low_temperature_alarm_trigger.temperature;
				}
				if (decoded.temperature_alarm.type == 0x22) {
					decoded.temperature_alarm.persistent_high_alarm_deactivation = decoded.temperature_alarm.persistent_high_alarm_deactivation || {};
					decoded.temperature_alarm.persistent_high_alarm_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.persistent_high_alarm_deactivation.temperature;
				}
				if (decoded.temperature_alarm.type == 0x23) {
					decoded.temperature_alarm.persistent_high_alarm_trigger = decoded.temperature_alarm.persistent_high_alarm_trigger || {};
					decoded.temperature_alarm.persistent_high_alarm_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.persistent_high_alarm_trigger.temperature;
				}
				if (decoded.temperature_alarm.type == 0x30) {
					decoded.temperature_alarm.anti_freeze_protection_deactivation = decoded.temperature_alarm.anti_freeze_protection_deactivation || {};
					decoded.temperature_alarm.anti_freeze_protection_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.anti_freeze_protection_deactivation.temperature;
				}
				if (decoded.temperature_alarm.type == 0x31) {
					decoded.temperature_alarm.anti_freeze_protection_trigger = decoded.temperature_alarm.anti_freeze_protection_trigger || {};
					decoded.temperature_alarm.anti_freeze_protection_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.anti_freeze_protection_trigger.temperature;
				}
				if (decoded.temperature_alarm.type == 0x32) {
					decoded.temperature_alarm.window_status_detection_deactivation = decoded.temperature_alarm.window_status_detection_deactivation || {};
					decoded.temperature_alarm.window_status_detection_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.window_status_detection_deactivation.temperature;
				}
				if (decoded.temperature_alarm.type == 0x33) {
					decoded.temperature_alarm.window_status_detection_trigger = decoded.temperature_alarm.window_status_detection_trigger || {};
					decoded.temperature_alarm.window_status_detection_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.window_status_detection_trigger.temperature;
				}
				break;
			case 0x0a:
				decoded.humidity_alarm = decoded.humidity_alarm || {};
				decoded.humidity_alarm.type = readUInt8(bytes, counterObj, 1);
				if (decoded.humidity_alarm.type == 0x00) {
					decoded.humidity_alarm.collection_error = decoded.humidity_alarm.collection_error || {};
				}
				if (decoded.humidity_alarm.type == 0x01) {
					decoded.humidity_alarm.lower_range_error = decoded.humidity_alarm.lower_range_error || {};
				}
				if (decoded.humidity_alarm.type == 0x02) {
					decoded.humidity_alarm.over_range_error = decoded.humidity_alarm.over_range_error || {};
				}
				if (decoded.humidity_alarm.type == 0x03) {
					decoded.humidity_alarm.no_data = decoded.humidity_alarm.no_data || {};
				}
				break;
			case 0x0b:
				decoded.target_temperature_alarm = decoded.target_temperature_alarm || {};
				decoded.target_temperature_alarm.type = readUInt8(bytes, counterObj, 1);
				if (decoded.target_temperature_alarm.type == 0x03) {
					decoded.target_temperature_alarm.no_data = decoded.target_temperature_alarm.no_data || {};
				}
				break;
			case 0x10:
				decoded.relay_status = decoded.relay_status || {};
				var bitOptions = readUInt32LE(bytes, counterObj, 4);
				decoded.relay_status.low_status = extractBits(bitOptions, 0, 1);
				decoded.relay_status.mid_status = extractBits(bitOptions, 1, 2);
				decoded.relay_status.high_status = extractBits(bitOptions, 2, 3);
				decoded.relay_status.valve_1_status = extractBits(bitOptions, 3, 4);
				decoded.relay_status.valve_2_status = extractBits(bitOptions, 4, 5);
				decoded.relay_status.reserved = extractBits(bitOptions, 5, 32);
				break;
			case 0xc8:
				// 0：Off, 1：On
				decoded.device_status = readUInt8(bytes, counterObj, 1);
				break;
			case 0x60:
				decoded.collection_interval = decoded.collection_interval || {};
				// 0：second, 1：min
				decoded.collection_interval.unit = readUInt8(bytes, counterObj, 1);
				if (decoded.collection_interval.unit == 0x00) {
					decoded.collection_interval.seconds_of_time = readUInt16LE(bytes, counterObj, 2);
				}
				if (decoded.collection_interval.unit == 0x01) {
					decoded.collection_interval.minutes_of_time = readUInt16LE(bytes, counterObj, 2);
				}
				break;
			case 0x62:
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
			case 0xc4:
				// 0：disable, 1：enable
				decoded.auto_p_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x90:
				// 0：disable, 1：enable
				decoded.relay_changes_report_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x63:
				// 0：℃, 1：℉
				decoded.temperature_unit = readUInt8(bytes, counterObj, 1);
				break;
			case 0x85:
				decoded.temperature_source = decoded.temperature_source || {};
				// 0：Embedded Temperature, 1：External NTC, 2：LoRa Receive, 3：D2D Receive
				decoded.temperature_source.type = readUInt8(bytes, counterObj, 1);
				if (decoded.temperature_source.type == 0x02) {
					decoded.temperature_source.lorawan_reception = decoded.temperature_source.lorawan_reception || {};
					decoded.temperature_source.lorawan_reception.timeout = readUInt8(bytes, counterObj, 1);
					// 0: Keep Control, 1: Turn Off The Control, 2: Switch The Embedded Temperature
					decoded.temperature_source.lorawan_reception.timeout_response = readUInt8(bytes, counterObj, 1);
				}
				if (decoded.temperature_source.type == 0x03) {
					decoded.temperature_source.d2d_reception = decoded.temperature_source.d2d_reception || {};
					decoded.temperature_source.d2d_reception.timeout = readUInt8(bytes, counterObj, 1);
					// 0: Keep Control, 1: Turn Off The Control, 2: Switch The Embedded Temperature
					decoded.temperature_source.d2d_reception.timeout_response = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x67:
				// 0：Off, 1：On
				decoded.system_status = readUInt8(bytes, counterObj, 1);
				break;
			case 0x64:
				// 7：Ventilation、Heat、Cool, 3：Ventilation、Heat, 5：Ventilation、Cool
				decoded.mode_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x68:
				// 0：Ventilation, 1：Heat, 2：Cool
				decoded.temperature_control_mode = readUInt8(bytes, counterObj, 1);
				break;
			case 0x69:
				// 0：0.5, 1：1
				decoded.target_temperature_resolution = readUInt8(bytes, counterObj, 1);
				break;
			case 0x6b:
				decoded.heating_target_temperature = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x6c:
				decoded.cooling_target_temperature = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x6a:
				decoded.target_temperature_tolerance = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x6d:
				decoded.heating_target_temperature_range = decoded.heating_target_temperature_range || {};
				decoded.heating_target_temperature_range.min = readInt16LE(bytes, counterObj, 2) / 100;
				decoded.heating_target_temperature_range.max = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x6e:
				decoded.cooling_target_temperature_range = decoded.cooling_target_temperature_range || {};
				decoded.cooling_target_temperature_range.min = readInt16LE(bytes, counterObj, 2) / 100;
				decoded.cooling_target_temperature_range.max = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x70:
				decoded.target_humidity_range = decoded.target_humidity_range || {};
				decoded.target_humidity_range.min = readUInt16LE(bytes, counterObj, 2) / 10;
				decoded.target_humidity_range.max = readUInt16LE(bytes, counterObj, 2) / 10;
				break;
			case 0x6f:
				decoded.temperature_control_dehumidification = decoded.temperature_control_dehumidification || {};
				// 0：disable, 1：enable
				decoded.temperature_control_dehumidification.enable = readUInt8(bytes, counterObj, 1);
				decoded.temperature_control_dehumidification.temperature_tolerance = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x72:
				// 0：Auto, 1：Low, 2:Medium, 3:High
				decoded.fan_control_mode = readUInt8(bytes, counterObj, 1);
				break;
			case 0x74:
				decoded.fan_delay_close = decoded.fan_delay_close || {};
				// 0：disable, 1：enable
				decoded.fan_delay_close.enable = readUInt8(bytes, counterObj, 1);
				decoded.fan_delay_close.time = readUInt16LE(bytes, counterObj, 2);
				break;
			case 0x73:
				decoded.fan_auto_mode_temperature_range = decoded.fan_auto_mode_temperature_range || {};
				decoded.fan_auto_mode_temperature_range.speed_range_1 = readInt16LE(bytes, counterObj, 2) / 100;
				decoded.fan_auto_mode_temperature_range.speed_range_2 = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x8c:
				decoded.timed_system_control = decoded.timed_system_control || {};
				var timed_system_control_command = readUInt8(bytes, counterObj, 1);
				if (timed_system_control_command == 0x00) {
					// 0：disable, 1：enable
					decoded.timed_system_control.enable = readUInt8(bytes, counterObj, 1);
				}
				if (timed_system_control_command == 0x01) {
					decoded.timed_system_control.start_cycle_settings = decoded.timed_system_control.start_cycle_settings || [];
					var id = readUInt8(bytes, counterObj, 1);
					var start_cycle_settings_item = pickArrayItem(decoded.timed_system_control.start_cycle_settings, id, 'id');
					start_cycle_settings_item.id = id;
					insertArrayItem(decoded.timed_system_control.start_cycle_settings, start_cycle_settings_item, 'id');
					// 0：disable, 1：enable
					start_cycle_settings_item.enable = readUInt8(bytes, counterObj, 1);
					start_cycle_settings_item.execution_time_point = readUInt16LE(bytes, counterObj, 2);
					var bitOptions = readUInt8(bytes, counterObj, 1);
					// 0：disable, 1：enable
					start_cycle_settings_item.execution_day_sun = extractBits(bitOptions, 0, 1);
					// 0：disable, 1：enable
					start_cycle_settings_item.execution_day_mon = extractBits(bitOptions, 1, 2);
					// 0：disable, 1：enable
					start_cycle_settings_item.execution_day_tues = extractBits(bitOptions, 2, 3);
					// 0：disable, 1：enable
					start_cycle_settings_item.execution_day_wed = extractBits(bitOptions, 3, 4);
					// 0：disable, 1：enable
					start_cycle_settings_item.execution_day_thu = extractBits(bitOptions, 4, 5);
					// 0：disable, 1：enable
					start_cycle_settings_item.execution_day_fri = extractBits(bitOptions, 5, 6);
					// 0：disable, 1：enable
					start_cycle_settings_item.execution_day_sat = extractBits(bitOptions, 6, 7);
					start_cycle_settings_item.reserved = extractBits(bitOptions, 7, 8);
				}
				if (timed_system_control_command == 0x02) {
					decoded.timed_system_control.end_cycle_settings = decoded.timed_system_control.end_cycle_settings || [];
					var id = readUInt8(bytes, counterObj, 1);
					var end_cycle_settings_item = pickArrayItem(decoded.timed_system_control.end_cycle_settings, id, 'id');
					end_cycle_settings_item.id = id;
					insertArrayItem(decoded.timed_system_control.end_cycle_settings, end_cycle_settings_item, 'id');
					// 0：disable, 1：enable
					end_cycle_settings_item.enable = readUInt8(bytes, counterObj, 1);
					end_cycle_settings_item.execution_time_point = readUInt16LE(bytes, counterObj, 2);
					var bitOptions = readUInt8(bytes, counterObj, 1);
					// 0：disable, 1：enable
					end_cycle_settings_item.execution_day_sun = extractBits(bitOptions, 0, 1);
					// 0：disable, 1：enable
					end_cycle_settings_item.execution_day_mon = extractBits(bitOptions, 1, 2);
					// 0：disable, 1：enable
					end_cycle_settings_item.execution_day_tues = extractBits(bitOptions, 2, 3);
					// 0：disable, 1：enable
					end_cycle_settings_item.execution_day_wed = extractBits(bitOptions, 3, 4);
					// 0：disable, 1：enable
					end_cycle_settings_item.execution_day_thu = extractBits(bitOptions, 4, 5);
					// 0：disable, 1：enable
					end_cycle_settings_item.execution_day_fri = extractBits(bitOptions, 5, 6);
					// 0：disable, 1：enable
					end_cycle_settings_item.execution_day_sat = extractBits(bitOptions, 6, 7);
					end_cycle_settings_item.reserved = extractBits(bitOptions, 7, 8);
				}
				break;
			case 0x65:
				// 0：disable, 1：enable
				decoded.intelligent_display_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x66:
				decoded.screen_object_settings = decoded.screen_object_settings || {};
				// 0：disable, 1：enable
				decoded.screen_object_settings.enable = readUInt8(bytes, counterObj, 1);
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0：disable, 1：enable
				decoded.screen_object_settings.environmental_temperature = extractBits(bitOptions, 0, 1);
				// 0：disable, 1：enable
				decoded.screen_object_settings.environmental_humidity = extractBits(bitOptions, 1, 2);
				// 0：disable, 1：enable
				decoded.screen_object_settings.target_temperature = extractBits(bitOptions, 2, 3);
				// 0：disable, 1：enable
				decoded.screen_object_settings.schedule_name = extractBits(bitOptions, 3, 4);
				decoded.screen_object_settings.reserved = extractBits(bitOptions, 4, 8);
				break;
			case 0x75:
				decoded.child_lock = decoded.child_lock || {};
				// 0：disable, 1：enable
				decoded.child_lock.enable = readUInt8(bytes, counterObj, 1);
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0：disable, 1：enable
				decoded.child_lock.system_button = extractBits(bitOptions, 0, 1);
				// 0：disable, 1：enable
				decoded.child_lock.temperature_button = extractBits(bitOptions, 1, 2);
				// 0：disable, 1：enable
				decoded.child_lock.fan_button = extractBits(bitOptions, 2, 3);
				// 0：disable, 1：enable
				decoded.child_lock.temperature_control_button = extractBits(bitOptions, 3, 4);
				// 0：disable, 1：enable
				decoded.child_lock.reboot_reset_button = extractBits(bitOptions, 4, 5);
				decoded.child_lock.reserved = extractBits(bitOptions, 5, 8);
				break;
			case 0x8d:
				decoded.temporary_unlock_settings = decoded.temporary_unlock_settings || {};
				// 0：disable, 1：enable
				decoded.temporary_unlock_settings.enable = readUInt8(bytes, counterObj, 1);
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0：disable, 1：enable
				decoded.temporary_unlock_settings.system = extractBits(bitOptions, 0, 1);
				// 0：disable, 1：enable
				decoded.temporary_unlock_settings.temperature_up = extractBits(bitOptions, 1, 2);
				// 0：disable, 1：enable
				decoded.temporary_unlock_settings.temperature_down = extractBits(bitOptions, 2, 3);
				// 0：disable, 1：enable
				decoded.temporary_unlock_settings.fan = extractBits(bitOptions, 3, 4);
				// 0：disable, 1：enable
				decoded.temporary_unlock_settings.temperature_control = extractBits(bitOptions, 4, 5);
				decoded.temporary_unlock_settings.reserved = extractBits(bitOptions, 5, 8);
				decoded.temporary_unlock_settings.unlocking_duration = readUInt16LE(bytes, counterObj, 2);
				break;
			case 0xc7:
				decoded.time_zone = readInt16LE(bytes, counterObj, 2);
				break;
			case 0xc6:
				decoded.daylight_saving_time = decoded.daylight_saving_time || {};
				// 0：disable, 1：enable
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
					// 0：disable, 1：enable
					decoded.data_storage_settings.enable = readUInt8(bytes, counterObj, 1);
				}
				if (data_storage_settings_command == 0x01) {
					// 0：disable, 1：enable
					decoded.data_storage_settings.retransmission_enable = readUInt8(bytes, counterObj, 1);
				}
				if (data_storage_settings_command == 0x02) {
					decoded.data_storage_settings.retransmission_interval = readUInt16LE(bytes, counterObj, 2);
				}
				if (data_storage_settings_command == 0x03) {
					decoded.data_storage_settings.retrieval_interval = readUInt16LE(bytes, counterObj, 2);
				}
				break;
			case 0x79:
				decoded.temperature_calibration_settings = decoded.temperature_calibration_settings || {};
				// 0：disable, 1：enable
				decoded.temperature_calibration_settings.enable = readUInt8(bytes, counterObj, 1);
				decoded.temperature_calibration_settings.calibration_value = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x7a:
				decoded.humidity_calibration_settings = decoded.humidity_calibration_settings || {};
				// 0：disable, 1：enable
				decoded.humidity_calibration_settings.enable = readUInt8(bytes, counterObj, 1);
				decoded.humidity_calibration_settings.calibration_value = readInt16LE(bytes, counterObj, 2) / 10;
				break;
			case 0x76:
				decoded.temperature_alarm_settings = decoded.temperature_alarm_settings || {};
				// 0：disable, 1：enable
				decoded.temperature_alarm_settings.enable = readUInt8(bytes, counterObj, 1);
				// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A≤x≤B, 4:condition: x<A or x>B
				decoded.temperature_alarm_settings.threshold_condition = readUInt8(bytes, counterObj, 1);
				decoded.temperature_alarm_settings.threshold_min = readInt16LE(bytes, counterObj, 2) / 100;
				decoded.temperature_alarm_settings.threshold_max = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x77:
				decoded.high_temperature_alarm_settings = decoded.high_temperature_alarm_settings || {};
				// 0：disable, 1：enable
				decoded.high_temperature_alarm_settings.enable = readUInt8(bytes, counterObj, 1);
				decoded.high_temperature_alarm_settings.difference_in_temperature = readInt16LE(bytes, counterObj, 2) / 100;
				decoded.high_temperature_alarm_settings.duration = readUInt8(bytes, counterObj, 1);
				break;
			case 0x78:
				decoded.low_temperature_alarm_settings = decoded.low_temperature_alarm_settings || {};
				// 0：disable, 1：enable
				decoded.low_temperature_alarm_settings.enable = readUInt8(bytes, counterObj, 1);
				decoded.low_temperature_alarm_settings.difference_in_temperature = readInt16LE(bytes, counterObj, 2) / 100;
				decoded.low_temperature_alarm_settings.duration = readUInt8(bytes, counterObj, 1);
				break;
			case 0x7b:
				decoded.schedule_settings = decoded.schedule_settings || [];
				var id = readUInt8(bytes, counterObj, 1);
				var schedule_settings_item = pickArrayItem(decoded.schedule_settings, id, 'id');
				schedule_settings_item.id = id;
				insertArrayItem(decoded.schedule_settings, schedule_settings_item, 'id');
				var schedule_settings_item_command = readUInt8(bytes, counterObj, 1);
				if (schedule_settings_item_command == 0x00) {
					// 0：disable, 1：enable
					schedule_settings_item.enable = readUInt8(bytes, counterObj, 1);
				}
				if (schedule_settings_item_command == 0x01) {
					schedule_settings_item.name_first = readString(bytes, counterObj, 6);
				}
				if (schedule_settings_item_command == 0x02) {
					schedule_settings_item.name_last = readString(bytes, counterObj, 4);
				}
				if (schedule_settings_item_command == 0x03) {
					schedule_settings_item.content = schedule_settings_item.content || {};
					// 0：auto, 1：low, 2：medium, 3：high
					schedule_settings_item.content.fan_mode = readUInt8(bytes, counterObj, 1);
					var bitOptions = readUInt16LE(bytes, counterObj, 2);
					schedule_settings_item.content.heat_target_temperature_enable = extractBits(bitOptions, 0, 1);
					schedule_settings_item.content.heat_target_temperature = extractBits(bitOptions, 1, 16) / 100;
					var bitOptions = readUInt16LE(bytes, counterObj, 2);
					schedule_settings_item.content.cool_target_temperature_enable = extractBits(bitOptions, 0, 1);
					schedule_settings_item.content.cool_target_temperature = extractBits(bitOptions, 1, 16) / 100;
					var bitOptions = readUInt16LE(bytes, counterObj, 2);
					schedule_settings_item.content.temperature_tolerance_enable = extractBits(bitOptions, 0, 1);
					schedule_settings_item.content.temperature_tolerance = extractBits(bitOptions, 1, 16) / 100;
				}
				if (schedule_settings_item_command == 0x04) {
					schedule_settings_item.cycle_settings = schedule_settings_item.cycle_settings || [];
					var id = readUInt8(bytes, counterObj, 1);
					var cycle_settings_item = pickArrayItem(schedule_settings_item.cycle_settings, id, 'id');
					cycle_settings_item.id = id;
					insertArrayItem(schedule_settings_item.cycle_settings, cycle_settings_item, 'id');
					// 0：disable, 1：enable
					cycle_settings_item.enable = readUInt8(bytes, counterObj, 1);
					cycle_settings_item.execution_time_point = readUInt16LE(bytes, counterObj, 2);
					var bitOptions = readUInt8(bytes, counterObj, 1);
					// 0：disable, 1：enable
					cycle_settings_item.execution_day_sun = extractBits(bitOptions, 0, 1);
					// 0：disable, 1：enable
					cycle_settings_item.execution_day_mon = extractBits(bitOptions, 1, 2);
					// 0：disable, 1：enable
					cycle_settings_item.execution_day_tues = extractBits(bitOptions, 2, 3);
					// 0：disable, 1：enable
					cycle_settings_item.execution_day_wed = extractBits(bitOptions, 3, 4);
					// 0：disable, 1：enable
					cycle_settings_item.execution_day_thu = extractBits(bitOptions, 4, 5);
					// 0：disable, 1：enable
					cycle_settings_item.execution_day_fri = extractBits(bitOptions, 5, 6);
					// 0：disable, 1：enable
					cycle_settings_item.execution_day_sat = extractBits(bitOptions, 6, 7);
					cycle_settings_item.reserved = extractBits(bitOptions, 7, 8);
				}
				break;
			case 0x7c:
				decoded.interface_settings = decoded.interface_settings || {};
				decoded.interface_settings.object = readUInt8(bytes, counterObj, 1);
				if (decoded.interface_settings.object == 0x00) {
					decoded.interface_settings.valve_4_pipe_2_wire = decoded.interface_settings.valve_4_pipe_2_wire || {};
					// 1：V1/ NO, 2：V2/ NC
					decoded.interface_settings.valve_4_pipe_2_wire.cooling = readUInt8(bytes, counterObj, 1);
					// 1：V1/ NO, 2：V2/ NC
					decoded.interface_settings.valve_4_pipe_2_wire.heating = readUInt8(bytes, counterObj, 1);
				}
				if (decoded.interface_settings.object == 0x01) {
					decoded.interface_settings.valve_2_pipe_2_wire = decoded.interface_settings.valve_2_pipe_2_wire || {};
					// 1：V1/ NO, 2：V2/ NC
					decoded.interface_settings.valve_2_pipe_2_wire.control = readUInt8(bytes, counterObj, 1);
				}
				if (decoded.interface_settings.object == 0x02) {
					decoded.interface_settings.valve_2_pipe_3_wire = decoded.interface_settings.valve_2_pipe_3_wire || {};
					// 1：V1/ NO, 2：V2/ NC
					decoded.interface_settings.valve_2_pipe_3_wire.no = readUInt8(bytes, counterObj, 1);
					// 1：V1/ NO, 2：V2/ NC
					decoded.interface_settings.valve_2_pipe_3_wire.nc = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x8e:
				// 0：disable, 1：enable
				decoded.fan_stop_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x80:
				// 0：disable, 1：enable
				decoded.di_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x81:
				decoded.di_settings = decoded.di_settings || {};
				decoded.di_settings.object = readUInt8(bytes, counterObj, 1);
				if (decoded.di_settings.object == 0x00) {
					decoded.di_settings.card_control = decoded.di_settings.card_control || {};
					decoded.di_settings.card_control.type = readUInt8(bytes, counterObj, 1);
					if (decoded.di_settings.card_control.type == 0x00) {
						decoded.di_settings.card_control.system_control = decoded.di_settings.card_control.system_control || {};
						// 0：system off, 1：system on
						decoded.di_settings.card_control.system_control.trigger_by_insertion = readUInt8(bytes, counterObj, 1);
					}
					if (decoded.di_settings.card_control.type == 0x01) {
						decoded.di_settings.card_control.insertion_plan = decoded.di_settings.card_control.insertion_plan || {};
						// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8, 255：None
						decoded.di_settings.card_control.insertion_plan.trigger_by_insertion = readUInt8(bytes, counterObj, 1);
						// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8, 255：None
						decoded.di_settings.card_control.insertion_plan.trigger_by_extraction = readUInt8(bytes, counterObj, 1);
					}
				}
				if (decoded.di_settings.object == 0x01) {
					decoded.di_settings.magnet_detection = decoded.di_settings.magnet_detection || {};
					// 0：NO, 1：NC
					decoded.di_settings.magnet_detection.magnet_type = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x82:
				// 0：disable, 1：enable
				decoded.window_opening_detection_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x83:
				decoded.window_opening_detection_settings = decoded.window_opening_detection_settings || {};
				decoded.window_opening_detection_settings.type = readUInt8(bytes, counterObj, 1);
				if (decoded.window_opening_detection_settings.type == 0x00) {
					decoded.window_opening_detection_settings.temperature_detection = decoded.window_opening_detection_settings.temperature_detection || {};
					decoded.window_opening_detection_settings.temperature_detection.difference_in_temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.window_opening_detection_settings.temperature_detection.stop_time = readUInt8(bytes, counterObj, 1);
				}
				if (decoded.window_opening_detection_settings.type == 0x01) {
					decoded.window_opening_detection_settings.magnet_detection = decoded.window_opening_detection_settings.magnet_detection || {};
					decoded.window_opening_detection_settings.magnet_detection.duration = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x84:
				decoded.freeze_protection_settings = decoded.freeze_protection_settings || {};
				// 0：disable, 1：enable
				decoded.freeze_protection_settings.enable = readUInt8(bytes, counterObj, 1);
				decoded.freeze_protection_settings.target_temperature = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x86:
				// 0：disable, 1：enable
				decoded.d2d_pairing_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x87:
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
			case 0x88:
				// 0：disable, 1：enable
				decoded.d2d_master_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x89:
				decoded.d2d_master_settings = decoded.d2d_master_settings || [];
				// 0: Schedule1, 1: Schedule2, 2: Schedule3, 3: Schedule4, 4: Schedule5, 5: Schedule6, 6: Schedule7, 7: Schedule8, 16：System Off, 17：System On
				var trigger_condition = readUInt8(bytes, counterObj, 1);
				var d2d_master_settings_item = pickArrayItem(decoded.d2d_master_settings, trigger_condition, 'trigger_condition');
				d2d_master_settings_item.trigger_condition = trigger_condition;
				insertArrayItem(decoded.d2d_master_settings, d2d_master_settings_item, 'trigger_condition');
				// 0：disable, 1：enable
				d2d_master_settings_item.enable = readUInt8(bytes, counterObj, 1);
				d2d_master_settings_item.command = readHexString(bytes, counterObj, 2);
				// 0：disable, 1：enable
				d2d_master_settings_item.uplink = readUInt8(bytes, counterObj, 1);
				// 0：disable, 1：enable
				d2d_master_settings_item.control_time_enable = readUInt8(bytes, counterObj, 1);
				d2d_master_settings_item.control_time = readUInt16LE(bytes, counterObj, 2);
				break;
			case 0x8a:
				// 0：disable, 1：enable
				decoded.d2d_slave_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x8b:
				decoded.d2d_slave_settings = decoded.d2d_slave_settings || [];
				var index = readUInt8(bytes, counterObj, 1);
				var d2d_slave_settings_item = pickArrayItem(decoded.d2d_slave_settings, index, 'index');
				d2d_slave_settings_item.index = index;
				insertArrayItem(decoded.d2d_slave_settings, d2d_slave_settings_item, 'index');
				// 0：disable, 1：enable
				d2d_slave_settings_item.enable = readUInt8(bytes, counterObj, 1);
				d2d_slave_settings_item.command = readHexString(bytes, counterObj, 2);
				// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8, 16：System Off, 17：System On
				d2d_slave_settings_item.value = readUInt8(bytes, counterObj, 1);
				break;
			case 0xb9:
				decoded.query_device_status = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0xb8:
				decoded.synchronize_time = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0xbd:
				decoded.clear_historical_data = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0xbc:
				decoded.stop_historical_data_retrieval = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0xbb:
				decoded.retrieve_historical_data_by_time_range = decoded.retrieve_historical_data_by_time_range || {};
				decoded.retrieve_historical_data_by_time_range.start_time = readUInt32LE(bytes, counterObj, 4);
				decoded.retrieve_historical_data_by_time_range.end_time = readUInt32LE(bytes, counterObj, 4);
				break;
			case 0xba:
				decoded.retrieve_historical_data_by_time = decoded.retrieve_historical_data_by_time || {};
				decoded.retrieve_historical_data_by_time.time = readUInt32LE(bytes, counterObj, 4);
				break;
			case 0xb6:
				decoded.reconnect = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0x5b:
				decoded.send_temperature = decoded.send_temperature || {};
				decoded.send_temperature.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x5c:
				decoded.send_humidity = decoded.send_humidity || {};
				decoded.send_humidity.humidity = readUInt16LE(bytes, counterObj, 2) / 10;
				break;
			case 0x5d:
				decoded.update_open_windows_state = decoded.update_open_windows_state || {};
				// 0：Normal, 1：Open
				decoded.update_open_windows_state.type = readUInt8(bytes, counterObj, 1);
				break;
			case 0x5e:
				decoded.insert_schedule = decoded.insert_schedule || {};
				// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8
				decoded.insert_schedule.type = readUInt8(bytes, counterObj, 1);
				break;
			case 0x5f:
				decoded.delete_schedule = decoded.delete_schedule || {};
				// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8, 255：Reset All 
				decoded.delete_schedule.type = readUInt8(bytes, counterObj, 1);
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
		  "10": "relay_status",
		  "60": "collection_interval",
		  "62": "reporting_interval",
		  "63": "temperature_unit",
		  "64": "mode_enable",
		  "65": "intelligent_display_enable",
		  "66": "screen_object_settings",
		  "67": "system_status",
		  "68": "temperature_control_mode",
		  "69": "target_temperature_resolution",
		  "70": "target_humidity_range",
		  "72": "fan_control_mode",
		  "73": "fan_auto_mode_temperature_range",
		  "74": "fan_delay_close",
		  "75": "child_lock",
		  "76": "temperature_alarm_settings",
		  "77": "high_temperature_alarm_settings",
		  "78": "low_temperature_alarm_settings",
		  "79": "temperature_calibration_settings",
		  "80": "di_enable",
		  "81": "di_settings",
		  "82": "window_opening_detection_enable",
		  "83": "window_opening_detection_settings",
		  "84": "freeze_protection_settings",
		  "85": "temperature_source",
		  "86": "d2d_pairing_enable",
		  "87": "d2d_pairing_settings",
		  "88": "d2d_master_enable",
		  "89": "d2d_master_settings",
		  "90": "relay_changes_report_enable",
		  "fe": "request_check_order",
		  "f4": "request_full_inspection",
		  "f400": "request_full_inspection.start_inspection",
		  "f401": "request_full_inspection.control",
		  "f402": "request_full_inspection.reading",
		  "f403": "request_full_inspection.end_inspection",
		  "ef": "request_command_queries",
		  "ee": "all_configurations_request_by_device",
		  "cf": "lorawan_configuration_settings",
		  "cf00": "lorawan_configuration_settings.mode",
		  "df": "tsl_version",
		  "db": "product_sn",
		  "da": "version",
		  "d9": "oem_id",
		  "04": "data_source",
		  "01": "temperature",
		  "02": "humidity",
		  "03": "target_temperature",
		  "05": "temperature_control_info",
		  "06": "temperature_control_valve_status",
		  "07": "fan_control_info",
		  "08": "execution_plan_id",
		  "09": "temperature_alarm",
		  "0a": "humidity_alarm",
		  "0b": "target_temperature_alarm",
		  "c8": "device_status",
		  "c4": "auto_p_enable",
		  "6b": "heating_target_temperature",
		  "6c": "cooling_target_temperature",
		  "6a": "target_temperature_tolerance",
		  "6d": "heating_target_temperature_range",
		  "6e": "cooling_target_temperature_range",
		  "6f": "temperature_control_dehumidification",
		  "8c": "timed_system_control",
		  "8c00": "timed_system_control.enable",
		  "8c01": "timed_system_control.start_cycle_settings",
		  "8c01xx": "timed_system_control.start_cycle_settings._item",
		  "8c02": "timed_system_control.end_cycle_settings",
		  "8c02xx": "timed_system_control.end_cycle_settings._item",
		  "8d": "temporary_unlock_settings",
		  "c7": "time_zone",
		  "c6": "daylight_saving_time",
		  "c5": "data_storage_settings",
		  "c500": "data_storage_settings.enable",
		  "c501": "data_storage_settings.retransmission_enable",
		  "c502": "data_storage_settings.retransmission_interval",
		  "c503": "data_storage_settings.retrieval_interval",
		  "7a": "humidity_calibration_settings",
		  "7b": "schedule_settings",
		  "7bxx": "schedule_settings._item",
		  "7bxx00": "schedule_settings._item.enable",
		  "7bxx01": "schedule_settings._item.name_first",
		  "7bxx02": "schedule_settings._item.name_last",
		  "7bxx03": "schedule_settings._item.content",
		  "7bxx04": "schedule_settings._item.cycle_settings",
		  "7bxx04xx": "schedule_settings._item.cycle_settings._item",
		  "7c": "interface_settings",
		  "8e": "fan_stop_enable",
		  "87xx": "d2d_pairing_settings._item",
		  "87xx00": "d2d_pairing_settings._item.enable",
		  "87xx01": "d2d_pairing_settings._item.deveui",
		  "87xx02": "d2d_pairing_settings._item.name_first",
		  "87xx03": "d2d_pairing_settings._item.name_last",
		  "89xx": "d2d_master_settings._item",
		  "8a": "d2d_slave_enable",
		  "8b": "d2d_slave_settings",
		  "8bxx": "d2d_slave_settings._item",
		  "b9": "query_device_status",
		  "b8": "synchronize_time",
		  "bd": "clear_historical_data",
		  "bc": "stop_historical_data_retrieval",
		  "bb": "retrieve_historical_data_by_time_range",
		  "ba": "retrieve_historical_data_by_time",
		  "b6": "reconnect",
		  "5b": "send_temperature",
		  "5c": "send_humidity",
		  "5d": "update_open_windows_state",
		  "5e": "insert_schedule",
		  "5f": "delete_schedule",
		  "be": "reboot"
	};
}