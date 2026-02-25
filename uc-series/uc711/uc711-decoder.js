/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product UC711
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
				if (full_inspection_reply_command == 0x04) {
					decoded.full_inspection_reply.aging = decoded.full_inspection_reply.aging || {};
					// 0：success, 1：failed
					decoded.full_inspection_reply.aging.result = readUInt8(bytes, counterObj, 1);
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
			case 0x06:
				decoded.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x08:
				decoded.humidity = readInt16LE(bytes, counterObj, 2) / 10;
				break;
			case 0x0c:
				decoded.temperature_control_info = decoded.temperature_control_info || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0：heat, 2：cool, 3：auto, 15：na
				decoded.temperature_control_info.mode = extractBits(bitOptions, 4, 8);
				// 0：standby, 1：stage-1 heat, 2：stage-2 heat, 3：stage-3 heat, 4：stage-4 heat, 5：em heat, 6：stage-1 cool, 7：stage-2 cool, 8：stage-5 heat
				decoded.temperature_control_info.status = extractBits(bitOptions, 0, 4);
				break;
			case 0x0d:
				decoded.fan_control_info = decoded.fan_control_info || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0：auto, 1：circulate, 2：on, 3：low, 4：medium, 5：high, 15：na
				decoded.fan_control_info.mode = extractBits(bitOptions, 4, 8);
				// 0：off, 1：open, 2：low, 3:medium, 4:high
				decoded.fan_control_info.status = extractBits(bitOptions, 0, 4);
				break;
			case 0x0e:
				decoded.execution_plan_id = readUInt8(bytes, counterObj, 1);
				break;
			case 0x10:
				decoded.target_temperature = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0xc4:
				// 0：Disable, 1：Enable
				decoded.auto_p_enable = readUInt8(bytes, counterObj, 1);
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
			case 0xd4:
				decoded.bluetooth_config = decoded.bluetooth_config || {};
				var bluetooth_config_command = readUInt8(bytes, counterObj, 1);
				if (bluetooth_config_command == 0x01) {
					decoded.bluetooth_config.bluetooth_name = decoded.bluetooth_config.bluetooth_name || {};
					decoded.bluetooth_config.bluetooth_name.length = readUInt8(bytes, counterObj, 1);
					decoded.bluetooth_config.bluetooth_name.content = readString(bytes, counterObj, decoded.bluetooth_config.bluetooth_name.length);
				}
				break;
			case 0x60:
				decoded.temperature_control_mode = decoded.temperature_control_mode || {};
				// 0：Mode, 1：Plan Temperature Control , Mode Enable
				var temperature_control_mode_command = readUInt8(bytes, counterObj, 1);
				if (temperature_control_mode_command == 0x00) {
					// 0：heat, 2：cool, 3：auto
					decoded.temperature_control_mode.ctrl_mode = readUInt8(bytes, counterObj, 1);
				}
				if (temperature_control_mode_command == 0x01) {
					// 0：disable, 1：enable
					decoded.temperature_control_mode.plan_enable = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x61:
				decoded.target_temperature_settings = decoded.target_temperature_settings || {};
				var target_temperature_settings_temperature_control_mode = readUInt8(bytes, counterObj, 1);
				if (target_temperature_settings_temperature_control_mode == 0x00) {
					decoded.target_temperature_settings.heat = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (target_temperature_settings_temperature_control_mode == 0x02) {
					decoded.target_temperature_settings.cool = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (target_temperature_settings_temperature_control_mode == 0x03) {
					decoded.target_temperature_settings.auto = readInt16LE(bytes, counterObj, 2) / 100;
				}
				break;
			case 0x62:
				decoded.target_temperature_tolerance = decoded.target_temperature_tolerance || {};
				var target_temperature_tolerance_id = readUInt8(bytes, counterObj, 1);
				if (target_temperature_tolerance_id == 0x00) {
					decoded.target_temperature_tolerance.target_value = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (target_temperature_tolerance_id == 0x01) {
					decoded.target_temperature_tolerance.ctrl_value = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (target_temperature_tolerance_id == 0x02) {
					decoded.target_temperature_tolerance.heat_value = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (target_temperature_tolerance_id == 0x03) {
					decoded.target_temperature_tolerance.cool_value = readInt16LE(bytes, counterObj, 2) / 100;
				}
				break;
			case 0x63:
				decoded.target_temperature_range = decoded.target_temperature_range || {};
				var target_temperature_range_id = readUInt8(bytes, counterObj, 1);
				if (target_temperature_range_id == 0x00) {
					decoded.target_temperature_range.heat = decoded.target_temperature_range.heat || {};
					decoded.target_temperature_range.heat.min = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.target_temperature_range.heat.max = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (target_temperature_range_id == 0x02) {
					decoded.target_temperature_range.cool = decoded.target_temperature_range.cool || {};
					decoded.target_temperature_range.cool.min = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.target_temperature_range.cool.max = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (target_temperature_range_id == 0x03) {
					decoded.target_temperature_range.auto = decoded.target_temperature_range.auto || {};
					decoded.target_temperature_range.auto.min = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.target_temperature_range.auto.max = readInt16LE(bytes, counterObj, 2) / 100;
				}
				break;
			case 0x64:
				// 0：℃, 1：℉
				decoded.temperature_unit = readUInt8(bytes, counterObj, 1);
				break;
			case 0x65:
				// 0：0.5, 1：1
				decoded.target_temperature_resolution = readUInt8(bytes, counterObj, 1);
				break;
			case 0x91:
				// 0：BLE+Lorawan, 1：POWERBUS+Lorawan
				decoded.communication_mode = readUInt8(bytes, counterObj, 1);
				break;
			case 0x66:
				decoded.reporting_interval = decoded.reporting_interval || {};
				// 0：BLE+LORA, 1：POWERBUS+LORA
				var reporting_interval_type = readUInt8(bytes, counterObj, 1);
				if (reporting_interval_type == 0x00) {
					decoded.reporting_interval.ble_lora = decoded.reporting_interval.ble_lora || {};
					// 0：second, 1：min
					decoded.reporting_interval.ble_lora.unit = readUInt8(bytes, counterObj, 1);
					if (decoded.reporting_interval.ble_lora.unit == 0x00) {
						decoded.reporting_interval.ble_lora.seconds_of_time = readUInt16LE(bytes, counterObj, 2);
					}
					if (decoded.reporting_interval.ble_lora.unit == 0x01) {
						decoded.reporting_interval.ble_lora.minutes_of_time = readUInt16LE(bytes, counterObj, 2);
					}
				}
				if (reporting_interval_type == 0x01) {
					decoded.reporting_interval.power_lora = decoded.reporting_interval.power_lora || {};
					// 0：second, 1：min
					decoded.reporting_interval.power_lora.unit = readUInt8(bytes, counterObj, 1);
					if (decoded.reporting_interval.power_lora.unit == 0x00) {
						decoded.reporting_interval.power_lora.seconds_of_time = readUInt16LE(bytes, counterObj, 2);
					}
					if (decoded.reporting_interval.power_lora.unit == 0x01) {
						decoded.reporting_interval.power_lora.minutes_of_time = readUInt16LE(bytes, counterObj, 2);
					}
				}
				break;
			case 0x67:
				decoded.schedule_settings = decoded.schedule_settings || [];
				var id = readUInt8(bytes, counterObj, 1);
				var schedule_settings_item = pickArrayItem(decoded.schedule_settings, id, 'id');
				schedule_settings_item.id = id;
				insertArrayItem(decoded.schedule_settings, schedule_settings_item, 'id');
				var schedule_settings_item_command = readUInt8(bytes, counterObj, 1);
				if (schedule_settings_item_command == 0x00) {
					// 0：Disable, 1：Enable
					schedule_settings_item.enable = readUInt8(bytes, counterObj, 1);
				}
				if (schedule_settings_item_command == 0x01) {
					schedule_settings_item.name1 = readString(bytes, counterObj, 6);
				}
				if (schedule_settings_item_command == 0x02) {
					schedule_settings_item.name2 = readString(bytes, counterObj, 4);
				}
				if (schedule_settings_item_command == 0x03) {
					// 0：Auto, 1：Always Open, 2：Ventilation, 3：Low, 4：Medium, 5：High, 255：Disabled
					schedule_settings_item.fan_mode = readUInt8(bytes, counterObj, 1);
				}
				if (schedule_settings_item_command == 0x05) {
					// 0：Switch Off, 1：Switch On
					schedule_settings_item.switch_on = readUInt8(bytes, counterObj, 1);
				}
				if (schedule_settings_item_command == 0x06) {
					// 0：heat, 2：cool, 3：auto
					schedule_settings_item.work_mode = readUInt8(bytes, counterObj, 1);
				}
				if (schedule_settings_item_command == 0x20) {
					schedule_settings_item.heat_target_temp = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (schedule_settings_item_command == 0x22) {
					schedule_settings_item.cool_target_temp = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (schedule_settings_item_command == 0x23) {
					schedule_settings_item.auto_target_temp = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (schedule_settings_item_command == 0x30) {
					schedule_settings_item.target_temp_tolerance = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (schedule_settings_item_command == 0x31) {
					schedule_settings_item.temp_control_tolerance = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (schedule_settings_item_command == 0x32) {
					schedule_settings_item.heat_target_temp_tolerance = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (schedule_settings_item_command == 0x33) {
					schedule_settings_item.cool_target_temp_tolerance = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (schedule_settings_item_command == 0x07) {
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
					// 0：delete, 1：valid
					cycle_settings_item.valid = extractBits(bitOptions, 7, 8);
				}
				break;
			case 0x68:
				// 0：disable, 1：enable
				decoded.window_opening_detection_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x69:
				decoded.window_opening_detection_settings = decoded.window_opening_detection_settings || {};
				// 0：temperature, 1：door
				decoded.window_opening_detection_settings.type = readUInt8(bytes, counterObj, 1);
				if (decoded.window_opening_detection_settings.type == 0x00) {
					decoded.window_opening_detection_settings.temperature_detection = decoded.window_opening_detection_settings.temperature_detection || {};
					var window_opening_detection_settings_temperature_detection_command = readUInt8(bytes, counterObj, 1);
					if (window_opening_detection_settings_temperature_detection_command == 0x00) {
						decoded.window_opening_detection_settings.temperature_detection.difference_in_temperature = readInt16LE(bytes, counterObj, 2) / 100;
					}
					if (window_opening_detection_settings_temperature_detection_command == 0x01) {
						decoded.window_opening_detection_settings.temperature_detection.stop_time = readUInt16LE(bytes, counterObj, 2);
					}
				}
				if (decoded.window_opening_detection_settings.type == 0x01) {
					decoded.window_opening_detection_settings.magnet_detection = decoded.window_opening_detection_settings.magnet_detection || {};
					decoded.window_opening_detection_settings.magnet_detection.duration = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x6a:
				decoded.temperature_data_source = decoded.temperature_data_source || {};
				var temperature_data_source_command = readUInt8(bytes, counterObj, 1);
				if (temperature_data_source_command == 0x00) {
					// 0: External Temperature Sensor, 1: Issued By Lorawan Gateway , 2: Lorawan D2D  , 3: HMI(WT401) 
					decoded.temperature_data_source.source = readUInt8(bytes, counterObj, 1);
				}
				if (temperature_data_source_command == 0x01) {
					decoded.temperature_data_source.time_out = readUInt8(bytes, counterObj, 1);
				}
				if (temperature_data_source_command == 0x02) {
					// 0: Maintain, 1: Disconnect, 2: Cut into internal
					decoded.temperature_data_source.offline_mode = readUInt8(bytes, counterObj, 1);
				}
				if (temperature_data_source_command == 0x03) {
					// 0：disable, 1：enable
					decoded.temperature_data_source.data_sync = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x6c:
				decoded.high_temperature_alarm_settings = decoded.high_temperature_alarm_settings || {};
				var high_temperature_alarm_settings_command = readUInt8(bytes, counterObj, 1);
				if (high_temperature_alarm_settings_command == 0x00) {
					// 0：Disable, 1：Enable
					decoded.high_temperature_alarm_settings.enable = readUInt8(bytes, counterObj, 1);
				}
				if (high_temperature_alarm_settings_command == 0x01) {
					decoded.high_temperature_alarm_settings.difference_in_temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (high_temperature_alarm_settings_command == 0x02) {
					decoded.high_temperature_alarm_settings.duration = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x6d:
				decoded.low_temperature_alarm_settings = decoded.low_temperature_alarm_settings || {};
				var low_temperature_alarm_settings_command = readUInt8(bytes, counterObj, 1);
				if (low_temperature_alarm_settings_command == 0x00) {
					// 0：Disable, 1：Enable
					decoded.low_temperature_alarm_settings.enable = readUInt8(bytes, counterObj, 1);
				}
				if (low_temperature_alarm_settings_command == 0x01) {
					decoded.low_temperature_alarm_settings.difference_in_temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (low_temperature_alarm_settings_command == 0x02) {
					decoded.low_temperature_alarm_settings.duration = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x6f:
				// 0：Switch Off, 1：Switch On
				decoded.system_switch = readUInt8(bytes, counterObj, 1);
				break;
			case 0x70:
				decoded.fan_settings = decoded.fan_settings || {};
				var fan_settings_command = readUInt8(bytes, counterObj, 1);
				if (fan_settings_command == 0x00) {
					// 0：Auto, 1：Always Open, 2：Ventilation, 3：Low, 4：Medium, 5：High, 255：Disabled
					decoded.fan_settings.fan_mode = readUInt8(bytes, counterObj, 1);
				}
				if (fan_settings_command == 0x01) {
					// 0：Disable, 1：Enable
					decoded.fan_settings.adjust_humidity_enable = readUInt8(bytes, counterObj, 1);
				}
				if (fan_settings_command == 0x02) {
					decoded.fan_settings.adjust_period = readUInt8(bytes, counterObj, 1);
				}
				if (fan_settings_command == 0x03) {
					decoded.fan_settings.work_time = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x71:
				decoded.anti_freezing = decoded.anti_freezing || {};
				var anti_freezing_command = readUInt8(bytes, counterObj, 1);
				if (anti_freezing_command == 0x00) {
					// 0：Disable, 1：Enable
					decoded.anti_freezing.enable = readUInt8(bytes, counterObj, 1);
				}
				if (anti_freezing_command == 0x01) {
					decoded.anti_freezing.target_temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				break;
			case 0x72:
				decoded.dehumidify_settings = decoded.dehumidify_settings || {};
				var dehumidify_settings_command = readUInt8(bytes, counterObj, 1);
				if (dehumidify_settings_command == 0x02) {
					decoded.dehumidify_settings.humidify_low_threshold = readInt16LE(bytes, counterObj, 2) / 10;
				}
				if (dehumidify_settings_command == 0x03) {
					decoded.dehumidify_settings.humidify_high_threshold = readInt16LE(bytes, counterObj, 2) / 10;
				}
				break;
			case 0x73:
				decoded.plan_dwell_time_settings = decoded.plan_dwell_time_settings || [];
				var id = readUInt8(bytes, counterObj, 1);
				var plan_dwell_time_settings_item = pickArrayItem(decoded.plan_dwell_time_settings, id, 'id');
				plan_dwell_time_settings_item.id = id;
				insertArrayItem(decoded.plan_dwell_time_settings, plan_dwell_time_settings_item, 'id');
				var plan_dwell_time_settings_item_command = readUInt8(bytes, counterObj, 1);
				if (plan_dwell_time_settings_item_command == 0x00) {
					// 0：Disable, 1：Enable
					plan_dwell_time_settings_item.permanent_stay_enable = readUInt8(bytes, counterObj, 1);
				}
				if (plan_dwell_time_settings_item_command == 0x01) {
					plan_dwell_time_settings_item.dwell_time = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x74:
				decoded.system_protect = decoded.system_protect || {};
				var system_protect_command = readUInt8(bytes, counterObj, 1);
				if (system_protect_command == 0x00) {
					// 0：Disable, 1：Enable
					decoded.system_protect.enable = readUInt8(bytes, counterObj, 1);
				}
				if (system_protect_command == 0x01) {
					decoded.system_protect.run_time = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x75:
				decoded.temperature_control_mode_enable = decoded.temperature_control_mode_enable || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0：disable, 1：enable
				decoded.temperature_control_mode_enable.heat = extractBits(bitOptions, 0, 1);
				// 0：disable, 1：enable
				decoded.temperature_control_mode_enable.em_heat = extractBits(bitOptions, 1, 2);
				// 0：disable, 1：enable
				decoded.temperature_control_mode_enable.cool = extractBits(bitOptions, 2, 3);
				// 0：disable, 1：enable
				decoded.temperature_control_mode_enable.auto = extractBits(bitOptions, 3, 4);
				// 0：disable, 1：enable
				decoded.temperature_control_mode_enable.dehumidify = extractBits(bitOptions, 4, 5);
				// 0：disable, 1：enable
				decoded.temperature_control_mode_enable.ventilate = extractBits(bitOptions, 5, 6);
				decoded.temperature_control_mode_enable.reserved = extractBits(bitOptions, 6, 8);
				break;
			case 0x76:
				// 0：single, 1：double
				decoded.target_temperature_mode = readUInt8(bytes, counterObj, 1);
				break;
			case 0x77:
				// 0：Disable, 1：Enable
				decoded.unilateral_tolerance_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x80:
				// 0：disable, 1：enable
				decoded.relay_change_report_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x82:
				decoded.fan_delay_settings = decoded.fan_delay_settings || {};
				var fan_delay_settings_command = readUInt8(bytes, counterObj, 1);
				if (fan_delay_settings_command == 0x00) {
					// 0：Disable, 1：Enable
					decoded.fan_delay_settings.enable = readUInt8(bytes, counterObj, 1);
				}
				if (fan_delay_settings_command == 0x01) {
					decoded.fan_delay_settings.delay_time = readUInt16LE(bytes, counterObj, 2);
				}
				break;
			case 0x86:
				// 0：Disable, 1：Enable
				decoded.di_settings_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x87:
				decoded.di_settings = decoded.di_settings || {};
				// 0：card, 1：door
				decoded.di_settings.object = readUInt8(bytes, counterObj, 1);
				if (decoded.di_settings.object == 0x00) {
					decoded.di_settings.card_control = decoded.di_settings.card_control || {};
					// 0：system_ctrl, 1：insert_sche
					decoded.di_settings.card_control.type = readUInt8(bytes, counterObj, 1);
					if (decoded.di_settings.card_control.type == 0x00) {
						decoded.di_settings.card_control.system_control = decoded.di_settings.card_control.system_control || {};
						// 0：system close, 1：system open
						decoded.di_settings.card_control.system_control.trigger_by_insertion = readUInt8(bytes, counterObj, 1);
					}
					if (decoded.di_settings.card_control.type == 0x01) {
						decoded.di_settings.card_control.insertion_plan = decoded.di_settings.card_control.insertion_plan || {};
						// 0：Insert Schedule1, 1：Insert Schedule2, 2：Insert Schedule3, 3：Insert Schedule4, 4：Insert Schedule5, 5：Insert Schedule6, 6：Insert Schedule7, 7：Insert Schedule8, 8：Insert Schedule9, 9：Insert Schedule10, 10：Insert Schedule11, 11：Insert Schedule12, 12：Insert Schedule13, 13：Insert Schedule14, 14：Insert Schedule15, 15：Insert Schedule16
						decoded.di_settings.card_control.insertion_plan.trigger_by_insertion = readUInt8(bytes, counterObj, 1);
						// 0：Insert Schedule1, 1：Insert Schedule2, 2：Insert Schedule3, 3：Insert Schedule4, 4：Insert Schedule5, 5：Insert Schedule6, 6：Insert Schedule7, 7：Insert Schedule8, 8：Insert Schedule9, 9：Insert Schedule10, 10：Insert Schedule11, 11：Insert Schedule12, 12：Insert Schedule13, 13：Insert Schedule14, 14：Insert Schedule15, 15：Insert Schedule16
						decoded.di_settings.card_control.insertion_plan.trigger_by_extraction = readUInt8(bytes, counterObj, 1);
					}
				}
				if (decoded.di_settings.object == 0x01) {
					decoded.di_settings.magnet_detection = decoded.di_settings.magnet_detection || {};
					// 0：normally closed, 1：normally open
					decoded.di_settings.magnet_detection.magnet_type = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x8b:
				decoded.filter_clean_settings = decoded.filter_clean_settings || {};
				var filter_clean_settings_command = readUInt8(bytes, counterObj, 1);
				if (filter_clean_settings_command == 0x00) {
					// 0：Disable, 1：Enable
					decoded.filter_clean_settings.enable = readUInt8(bytes, counterObj, 1);
				}
				if (filter_clean_settings_command == 0x01) {
					decoded.filter_clean_settings.reminder_period = readUInt16LE(bytes, counterObj, 2);
				}
				break;
			case 0x8e:
				decoded.install_configuration = decoded.install_configuration || {};
				// 0：wire config, 1:reversing_valve config, 2:combine config, 3:fan owner config
				var install_configuration_type = readUInt8(bytes, counterObj, 1);
				if (install_configuration_type == 0x00) {
					decoded.install_configuration.wire = decoded.install_configuration.wire || {};
					var bitOptions = readUInt8(bytes, counterObj, 1);
					// 0：disable, 1：enable
					decoded.install_configuration.wire.y1_connected = extractBits(bitOptions, 0, 2);
					// 0：disable, 1：enable
					decoded.install_configuration.wire.gh_connected = extractBits(bitOptions, 2, 4);
					// 0：disable, 1：enable
					decoded.install_configuration.wire.ob_connected = extractBits(bitOptions, 4, 6);
					// 0：disable, 1：enable
					decoded.install_configuration.wire.w1_connected = extractBits(bitOptions, 6, 8);
					var bitOptions = readUInt8(bytes, counterObj, 1);
					// 0：disable, 1：enable
					decoded.install_configuration.wire.we_connected = extractBits(bitOptions, 0, 2);
					// 0：disable, 1：enable
					decoded.install_configuration.wire.di_connected = extractBits(bitOptions, 2, 4);
					// 0：disable, 1：enable
					decoded.install_configuration.wire.pek_connected = extractBits(bitOptions, 4, 6);
					// 0：disable, 1：w2 enable, 2：aux enable
					decoded.install_configuration.wire.w2_connected = extractBits(bitOptions, 6, 8);
					var bitOptions = readUInt8(bytes, counterObj, 1);
					// 0：disable, 1：enable
					decoded.install_configuration.wire.gl_connected = extractBits(bitOptions, 0, 2);
					// 0：disable, 1：enable
					decoded.install_configuration.wire.gm_connected = extractBits(bitOptions, 2, 4);
					// 0：disable, 1：enable
					decoded.install_configuration.wire.ntc_connected = extractBits(bitOptions, 4, 6);
					decoded.install_configuration.wire.reserved = extractBits(bitOptions, 6, 8);
				}
				if (install_configuration_type == 0x01) {
					decoded.install_configuration.reversing_valve = decoded.install_configuration.reversing_valve || {};
					// 0：o/b on cool, 1：o/b on heat 
					decoded.install_configuration.reversing_valve.mode = readUInt8(bytes, counterObj, 1);
				}
				if (install_configuration_type == 0x02) {
					decoded.install_configuration.y_combine_aux = decoded.install_configuration.y_combine_aux || {};
					// 0：disable, 1：enable
					decoded.install_configuration.y_combine_aux.enable = readUInt8(bytes, counterObj, 1);
				}
				if (install_configuration_type == 0x03) {
					decoded.install_configuration.fan = decoded.install_configuration.fan || {};
					// 0：thermostat, 1：hvac
					decoded.install_configuration.fan.owner = readUInt8(bytes, counterObj, 1);
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
			case 0x95:
				// 0：disable, 1：enable
				decoded.d2d_pairing_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x96:
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
			case 0x97:
				// 0：disable, 1：enable
				decoded.d2d_slave_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x98:
				decoded.d2d_slave_settings = decoded.d2d_slave_settings || [];
				var index = readUInt8(bytes, counterObj, 1);
				var d2d_slave_settings_item = pickArrayItem(decoded.d2d_slave_settings, index, 'index');
				d2d_slave_settings_item.index = index;
				insertArrayItem(decoded.d2d_slave_settings, d2d_slave_settings_item, 'index');
				// 0：disable, 1：enable
				d2d_slave_settings_item.enable = readUInt8(bytes, counterObj, 1);
				d2d_slave_settings_item.command = readHexString(bytes, counterObj, 2);
				// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8, 8：Schedule9, 9：Schedule10, 10：Schedule11, 11：Schedule12, 12：Schedule13, 13：Schedule14, 14：Schedule15, 15：Schedule16, 16：System Off, 17：System On
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
			case 0xbe:
				decoded.reboot = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0x5f:
				decoded.delete_task_plan = decoded.delete_task_plan || {};
				// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8, 8：Schedule9, 9：Schedule10, 10：Schedule11, 11：Schedule12, 12：Schedule13, 13：Schedule14, 14：Schedule15, 15：Schedule16, 255：All
				decoded.delete_task_plan.type = readUInt8(bytes, counterObj, 1);
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

function convertName(propertyId, prefix) {
	var parts = propertyId.split('.');
	var lastPart = parts[parts.length - 1];
	parts[parts.length - 1] = prefix + '_' + lastPart;
	return parts.join('.');
}

function cmdMap() {
	return {
		  "10": "target_temperature",
		  "60": "temperature_control_mode",
		  "61": "target_temperature_settings",
		  "62": "target_temperature_tolerance",
		  "63": "target_temperature_range",
		  "64": "temperature_unit",
		  "65": "target_temperature_resolution",
		  "66": "reporting_interval",
		  "67": "schedule_settings",
		  "68": "window_opening_detection_enable",
		  "69": "window_opening_detection_settings",
		  "70": "fan_settings",
		  "71": "anti_freezing",
		  "72": "dehumidify_settings",
		  "73": "plan_dwell_time_settings",
		  "74": "system_protect",
		  "75": "temperature_control_mode_enable",
		  "76": "target_temperature_mode",
		  "77": "unilateral_tolerance_enable",
		  "80": "relay_change_report_enable",
		  "82": "fan_delay_settings",
		  "86": "di_settings_enable",
		  "87": "di_settings",
		  "91": "communication_mode",
		  "95": "d2d_pairing_enable",
		  "96": "d2d_pairing_settings",
		  "97": "d2d_slave_enable",
		  "98": "d2d_slave_settings",
		  "6000": "temperature_control_mode.ctrl_mode",
		  "6001": "temperature_control_mode.plan_enable",
		  "6100": "target_temperature_settings.heat",
		  "6102": "target_temperature_settings.cool",
		  "6103": "target_temperature_settings.auto",
		  "6200": "target_temperature_tolerance.target_value",
		  "6201": "target_temperature_tolerance.ctrl_value",
		  "6202": "target_temperature_tolerance.heat_value",
		  "6203": "target_temperature_tolerance.cool_value",
		  "6300": "target_temperature_range.heat",
		  "6302": "target_temperature_range.cool",
		  "6303": "target_temperature_range.auto",
		  "6600": "reporting_interval.ble_lora",
		  "6601": "reporting_interval.power_lora",
		  "7000": "fan_settings.fan_mode",
		  "7001": "fan_settings.adjust_humidity_enable",
		  "7002": "fan_settings.adjust_period",
		  "7003": "fan_settings.work_time",
		  "7100": "anti_freezing.enable",
		  "7101": "anti_freezing.target_temperature",
		  "7202": "dehumidify_settings.humidify_low_threshold",
		  "7203": "dehumidify_settings.humidify_high_threshold",
		  "7400": "system_protect.enable",
		  "7401": "system_protect.run_time",
		  "8200": "fan_delay_settings.enable",
		  "8201": "fan_delay_settings.delay_time",
		  "fe": "request_check_order",
		  "f4": "request_full_inspection",
		  "f400": "request_full_inspection.start_inspection",
		  "f401": "request_full_inspection.control",
		  "f402": "request_full_inspection.reading",
		  "f403": "request_full_inspection.end_inspection",
		  "f404": "request_full_inspection.aging",
		  "ef": "request_command_queries",
		  "ee": "all_configurations_request_by_device",
		  "cf": "lorawan_configuration_settings",
		  "cf00": "lorawan_configuration_settings.mode",
		  "df": "tsl_version",
		  "db": "product_sn",
		  "da": "version",
		  "d9": "oem_id",
		  "06": "temperature",
		  "08": "humidity",
		  "0c": "temperature_control_info",
		  "0d": "fan_control_info",
		  "0e": "execution_plan_id",
		  "c4": "auto_p_enable",
		  "c5": "data_storage_settings",
		  "c500": "data_storage_settings.enable",
		  "c501": "data_storage_settings.retransmission_enable",
		  "c502": "data_storage_settings.retransmission_interval",
		  "c503": "data_storage_settings.retrieval_interval",
		  "d4": "bluetooth_config",
		  "d401": "bluetooth_config.bluetooth_name",
		  "67xx": "schedule_settings._item",
		  "67xx00": "schedule_settings._item.enable",
		  "67xx01": "schedule_settings._item.name1",
		  "67xx02": "schedule_settings._item.name2",
		  "67xx03": "schedule_settings._item.fan_mode",
		  "67xx05": "schedule_settings._item.switch_on",
		  "67xx06": "schedule_settings._item.work_mode",
		  "67xx20": "schedule_settings._item.heat_target_temp",
		  "67xx22": "schedule_settings._item.cool_target_temp",
		  "67xx23": "schedule_settings._item.auto_target_temp",
		  "67xx30": "schedule_settings._item.target_temp_tolerance",
		  "67xx31": "schedule_settings._item.temp_control_tolerance",
		  "67xx32": "schedule_settings._item.heat_target_temp_tolerance",
		  "67xx33": "schedule_settings._item.cool_target_temp_tolerance",
		  "67xx07": "schedule_settings._item.cycle_settings",
		  "67xx07xx": "schedule_settings._item.cycle_settings._item",
		  "6a": "temperature_data_source",
		  "6a00": "temperature_data_source.source",
		  "6a01": "temperature_data_source.time_out",
		  "6a02": "temperature_data_source.offline_mode",
		  "6a03": "temperature_data_source.data_sync",
		  "6c": "high_temperature_alarm_settings",
		  "6c00": "high_temperature_alarm_settings.enable",
		  "6c01": "high_temperature_alarm_settings.difference_in_temperature",
		  "6c02": "high_temperature_alarm_settings.duration",
		  "6d": "low_temperature_alarm_settings",
		  "6d00": "low_temperature_alarm_settings.enable",
		  "6d01": "low_temperature_alarm_settings.difference_in_temperature",
		  "6d02": "low_temperature_alarm_settings.duration",
		  "6f": "system_switch",
		  "73xx": "plan_dwell_time_settings._item",
		  "73xx00": "plan_dwell_time_settings._item.permanent_stay_enable",
		  "73xx01": "plan_dwell_time_settings._item.dwell_time",
		  "8b": "filter_clean_settings",
		  "8b00": "filter_clean_settings.enable",
		  "8b01": "filter_clean_settings.reminder_period",
		  "8e": "install_configuration",
		  "8e00": "install_configuration.wire",
		  "8e01": "install_configuration.reversing_valve",
		  "8e02": "install_configuration.y_combine_aux",
		  "8e03": "install_configuration.fan",
		  "c7": "time_zone",
		  "c6": "daylight_saving_time",
		  "96xx": "d2d_pairing_settings._item",
		  "96xx00": "d2d_pairing_settings._item.enable",
		  "96xx01": "d2d_pairing_settings._item.deveui",
		  "96xx02": "d2d_pairing_settings._item.name_first",
		  "96xx03": "d2d_pairing_settings._item.name_last",
		  "98xx": "d2d_slave_settings._item",
		  "b9": "query_device_status",
		  "b8": "synchronize_time",
		  "bd": "clear_historical_data",
		  "bc": "stop_historical_data_retrieval",
		  "bb": "retrieve_historical_data_by_time_range",
		  "ba": "retrieve_historical_data_by_time",
		  "be": "reboot",
		  "5f": "delete_task_plan"
	};
}
function processTemperature(decoded) {
	var allTemperatureProperties = [
    {
        "propertyId": "temperature",
        "precision": 1
    },
    {
        "propertyId": "target_temperature",
        "precision": 1
    },
    {
        "propertyId": "target_temperature_settings.heat",
        "precision": 1
    },
    {
        "propertyId": "target_temperature_settings.cool",
        "precision": 1
    },
    {
        "propertyId": "target_temperature_settings.auto",
        "precision": 1
    },
    {
        "propertyId": "target_temperature_tolerance.target_value",
        "precision": 1
    },
    {
        "propertyId": "target_temperature_tolerance.ctrl_value",
        "precision": 1
    },
    {
        "propertyId": "target_temperature_tolerance.heat_value",
        "precision": 1
    },
    {
        "propertyId": "target_temperature_tolerance.cool_value",
        "precision": 1
    },
    {
        "propertyId": "target_temperature_range.heat.min",
        "precision": 1
    },
    {
        "propertyId": "target_temperature_range.heat.max",
        "precision": 1
    },
    {
        "propertyId": "target_temperature_range.cool.min",
        "precision": 1
    },
    {
        "propertyId": "target_temperature_range.cool.max",
        "precision": 1
    },
    {
        "propertyId": "target_temperature_range.auto.min",
        "precision": 1
    },
    {
        "propertyId": "target_temperature_range.auto.max",
        "precision": 1
    },
    {
        "propertyId": "schedule_settings._item.heat_target_temp",
        "precision": 1
    },
    {
        "propertyId": "schedule_settings._item.cool_target_temp",
        "precision": 1
    },
    {
        "propertyId": "schedule_settings._item.auto_target_temp",
        "precision": 1
    },
    {
        "propertyId": "schedule_settings._item.target_temp_tolerance",
        "precision": 1
    },
    {
        "propertyId": "schedule_settings._item.temp_control_tolerance",
        "precision": 1
    },
    {
        "propertyId": "schedule_settings._item.heat_target_temp_tolerance",
        "precision": 1
    },
    {
        "propertyId": "schedule_settings._item.cool_target_temp_tolerance",
        "precision": 1
    },
    {
        "propertyId": "window_opening_detection_settings.temperature_detection.difference_in_temperature",
        "precision": 1
    },
    {
        "propertyId": "high_temperature_alarm_settings.difference_in_temperature",
        "precision": 1
    },
    {
        "propertyId": "low_temperature_alarm_settings.difference_in_temperature",
        "precision": 1
    },
    {
        "propertyId": "anti_freezing.target_temperature",
        "precision": 1
    }
];
	for (var i = 0; i < allTemperatureProperties.length; i++) {
		var property = allTemperatureProperties[i];
		var fahrenheitProperty = convertName(property.propertyId, 'fahrenheit');
		var celsiusProperty = convertName(property.propertyId, 'celsius');			
		if (hasPath(decoded, property.propertyId)) {
			setPath(decoded, fahrenheitProperty,  Number((getPath(decoded, property.propertyId) * 1.8 + 32).toFixed(property.precision)));
			setPath(decoded, celsiusProperty,  Number(getPath(decoded, property.propertyId).toFixed(property.precision)));
		}
	}	
	return decoded;
}