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
			case 0xc8:
				// 0：Off, 1：On
				decoded.device_status = readUInt8(bytes, counterObj, 1);
				break;
			case 0xcd:
				decoded.ble_configuration_settings = decoded.ble_configuration_settings || {};
				var ble_configuration_settings_command = readUInt8(bytes, counterObj, 1);
				if (ble_configuration_settings_command == 0x00) {
					// 0：disable, 1：enable
					decoded.ble_configuration_settings.enable = readUInt8(bytes, counterObj, 1);
				}
				if (ble_configuration_settings_command == 0x01) {
					decoded.ble_configuration_settings.local_id = decoded.ble_configuration_settings.local_id || {};
					// 0：public, 1：private
					decoded.ble_configuration_settings.local_id.type = readUInt8(bytes, counterObj, 1);
					decoded.ble_configuration_settings.local_id.address = readHexString(bytes, counterObj, 6);
				}
				if (ble_configuration_settings_command == 0x05) {
					decoded.ble_configuration_settings.local_name_first = readString(bytes, counterObj, 8);
				}
				if (ble_configuration_settings_command == 0x06) {
					decoded.ble_configuration_settings.local_name_last = readString(bytes, counterObj, 5);
				}
				if (ble_configuration_settings_command == 0x07) {
					decoded.ble_configuration_settings.pair_info = decoded.ble_configuration_settings.pair_info || {};
					// 0：public, 1：private
					decoded.ble_configuration_settings.pair_info.type = readUInt8(bytes, counterObj, 1);
					decoded.ble_configuration_settings.pair_info.addr = readHexString(bytes, counterObj, 6);
					decoded.ble_configuration_settings.pair_info.mac = readHexString(bytes, counterObj, 8);
					decoded.ble_configuration_settings.pair_info.name_length = readUInt8(bytes, counterObj, 1);
					decoded.ble_configuration_settings.pair_info.name = readString(bytes, counterObj, decoded.ble_configuration_settings.pair_info.name_length);
				}
				if (ble_configuration_settings_command == 0x04) {
					decoded.ble_configuration_settings.pair_name = decoded.ble_configuration_settings.pair_name || [];
					var channel = readUInt8(bytes, counterObj, 1);
					var pair_name_item = pickArrayItem(decoded.ble_configuration_settings.pair_name, channel, 'channel');
					pair_name_item.channel = channel;
					insertArrayItem(decoded.ble_configuration_settings.pair_name, pair_name_item, 'channel');
					pair_name_item.length = readUInt8(bytes, counterObj, 1);
					pair_name_item.content = readString(bytes, counterObj, pair_name_item.length);
				}
				if (ble_configuration_settings_command == 0x02) {
					decoded.ble_configuration_settings.pair_mac = decoded.ble_configuration_settings.pair_mac || [];
					var channel = readUInt8(bytes, counterObj, 1);
					var pair_mac_item = pickArrayItem(decoded.ble_configuration_settings.pair_mac, channel, 'channel');
					pair_mac_item.channel = channel;
					insertArrayItem(decoded.ble_configuration_settings.pair_mac, pair_mac_item, 'channel');
					pair_mac_item.mac = readHexString(bytes, counterObj, 8);
				}
				if (ble_configuration_settings_command == 0x03) {
					decoded.ble_configuration_settings.pair_addr = decoded.ble_configuration_settings.pair_addr || [];
					var channel = readUInt8(bytes, counterObj, 1);
					var pair_addr_item = pickArrayItem(decoded.ble_configuration_settings.pair_addr, channel, 'channel');
					pair_addr_item.channel = channel;
					insertArrayItem(decoded.ble_configuration_settings.pair_addr, pair_addr_item, 'channel');
					// 0：public, 1：private
					pair_addr_item.type = readUInt8(bytes, counterObj, 1);
					pair_addr_item.mac = readHexString(bytes, counterObj, 6);
				}
				if (ble_configuration_settings_command == 0x08) {
					decoded.ble_configuration_settings.local_info = decoded.ble_configuration_settings.local_info || {};
					// 0：public, 1：private
					decoded.ble_configuration_settings.local_info.type = readUInt8(bytes, counterObj, 1);
					decoded.ble_configuration_settings.local_info.addr = readHexString(bytes, counterObj, 6);
					decoded.ble_configuration_settings.local_info.mac = readHexString(bytes, counterObj, 8);
					decoded.ble_configuration_settings.local_info.name_length = readUInt8(bytes, counterObj, 1);
					decoded.ble_configuration_settings.local_info.name = readString(bytes, counterObj, decoded.ble_configuration_settings.local_info.name_length);
				}
				break;
			case 0xba:
				decoded.ble_new_event = decoded.ble_new_event || [];
				var index = readUInt8(bytes, counterObj, 1);
				var ble_new_event_item = pickArrayItem(decoded.ble_new_event, index, 'index');
				ble_new_event_item.index = index;
				insertArrayItem(decoded.ble_new_event, ble_new_event_item, 'index');
				// 0: Not paired, 1: Paired, 2: Disconnected
				ble_new_event_item.status = readUInt8(bytes, counterObj, 1);
				ble_new_event_item.mac = readHexString(bytes, counterObj, 8);
				break;
			case 0xb4:
				decoded.ble_server = decoded.ble_server || {};
				// 0：Reset BLE Name, 1：Cancel Pairing, 2：Trigger Pairing
				decoded.ble_server.type = readUInt8(bytes, counterObj, 1);
				break;
			case 0x02:
				decoded.temperature_alarm = decoded.temperature_alarm || {};
				decoded.temperature_alarm.type = readUInt8(bytes, counterObj, 1);
				if (decoded.temperature_alarm.type == 0x00) {
					decoded.temperature_alarm.open_window_alarm_deactivation = decoded.temperature_alarm.open_window_alarm_deactivation || {};
					decoded.temperature_alarm.open_window_alarm_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.open_window_alarm_deactivation.temperature;
				}
				if (decoded.temperature_alarm.type == 0x01) {
					decoded.temperature_alarm.open_window_alarm_trigger = decoded.temperature_alarm.open_window_alarm_trigger || {};
					decoded.temperature_alarm.open_window_alarm_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.open_window_alarm_trigger.temperature;
				}
				if (decoded.temperature_alarm.type == 0x10) {
					decoded.temperature_alarm.anti_freeze_protection_deactivation = decoded.temperature_alarm.anti_freeze_protection_deactivation || {};
					decoded.temperature_alarm.anti_freeze_protection_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.anti_freeze_protection_deactivation.temperature;
				}
				if (decoded.temperature_alarm.type == 0x11) {
					decoded.temperature_alarm.anti_freeze_protection_trigger = decoded.temperature_alarm.anti_freeze_protection_trigger || {};
					decoded.temperature_alarm.anti_freeze_protection_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.anti_freeze_protection_trigger.temperature;
				}
				if (decoded.temperature_alarm.type == 0x20) {
					decoded.temperature_alarm.over_range_alarm_trigger = decoded.temperature_alarm.over_range_alarm_trigger || {};
					decoded.temperature_alarm.over_range_alarm_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.over_range_alarm_trigger.temperature;
				}
				if (decoded.temperature_alarm.type == 0x21) {
					decoded.temperature_alarm.over_range_alarm_deactivation = decoded.temperature_alarm.over_range_alarm_deactivation || {};
					decoded.temperature_alarm.over_range_alarm_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.over_range_alarm_deactivation.temperature;
				}
				if (decoded.temperature_alarm.type == 0x22) {
					decoded.temperature_alarm.lower_range_alarm_trigger = decoded.temperature_alarm.lower_range_alarm_trigger || {};
					decoded.temperature_alarm.lower_range_alarm_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.lower_range_alarm_trigger.temperature;
				}
				if (decoded.temperature_alarm.type == 0x23) {
					decoded.temperature_alarm.lower_range_alarm_deactivation = decoded.temperature_alarm.lower_range_alarm_deactivation || {};
					decoded.temperature_alarm.lower_range_alarm_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.lower_range_alarm_deactivation.temperature;
				}
				if (decoded.temperature_alarm.type == 0x24) {
					decoded.temperature_alarm.within_range_alarm_trigger = decoded.temperature_alarm.within_range_alarm_trigger || {};
					decoded.temperature_alarm.within_range_alarm_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.within_range_alarm_trigger.temperature;
				}
				if (decoded.temperature_alarm.type == 0x25) {
					decoded.temperature_alarm.within_range_alarm_deactivation = decoded.temperature_alarm.within_range_alarm_deactivation || {};
					decoded.temperature_alarm.within_range_alarm_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.within_range_alarm_deactivation.temperature;
				}
				if (decoded.temperature_alarm.type == 0x30) {
					decoded.temperature_alarm.persistent_low_temp_deactivation = decoded.temperature_alarm.persistent_low_temp_deactivation || {};
					decoded.temperature_alarm.persistent_low_temp_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.persistent_low_temp_deactivation.temperature;
				}
				if (decoded.temperature_alarm.type == 0x31) {
					decoded.temperature_alarm.persistent_low_temp_trigger = decoded.temperature_alarm.persistent_low_temp_trigger || {};
					decoded.temperature_alarm.persistent_low_temp_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.persistent_low_temp_trigger.temperature;
				}
				if (decoded.temperature_alarm.type == 0x40) {
					decoded.temperature_alarm.persistent_high_temp_deactivation = decoded.temperature_alarm.persistent_high_temp_deactivation || {};
					decoded.temperature_alarm.persistent_high_temp_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.persistent_high_temp_deactivation.temperature;
				}
				if (decoded.temperature_alarm.type == 0x41) {
					decoded.temperature_alarm.persistent_high_temp_trigger = decoded.temperature_alarm.persistent_high_temp_trigger || {};
					decoded.temperature_alarm.persistent_high_temp_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.temperature = decoded.temperature_alarm.persistent_high_temp_trigger.temperature;
				}
				break;
			case 0x03:
				decoded.temperature_abnormal = decoded.temperature_abnormal || {};
				decoded.temperature_abnormal.type = readUInt8(bytes, counterObj, 1);
				if (decoded.temperature_abnormal.type == 0x00) {
					decoded.temperature_abnormal.collection_error = decoded.temperature_abnormal.collection_error || {};
				}
				if (decoded.temperature_abnormal.type == 0x01) {
					decoded.temperature_abnormal.lower_range_error = decoded.temperature_abnormal.lower_range_error || {};
				}
				if (decoded.temperature_abnormal.type == 0x02) {
					decoded.temperature_abnormal.over_range_error = decoded.temperature_abnormal.over_range_error || {};
				}
				if (decoded.temperature_abnormal.type == 0x03) {
					decoded.temperature_abnormal.no_data = decoded.temperature_abnormal.no_data || {};
				}
				break;
			case 0x04:
				decoded.filter_clean_remind = decoded.filter_clean_remind || {};
				decoded.filter_clean_remind.usage_time = readUInt32LE(bytes, counterObj, 4);
				break;
			case 0x05:
				// 0: NTC Sensor, 1: Lora Data, 2:  D2D Data, 3: WT401 
				decoded.temperature_humi_data_source = readUInt8(bytes, counterObj, 1);
				break;
			case 0x06:
				decoded.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x07:
				decoded.humidity_abnormal = decoded.humidity_abnormal || {};
				decoded.humidity_abnormal.type = readUInt8(bytes, counterObj, 1);
				if (decoded.humidity_abnormal.type == 0x00) {
					decoded.humidity_abnormal.collection_error = decoded.humidity_abnormal.collection_error || {};
				}
				if (decoded.humidity_abnormal.type == 0x01) {
					decoded.humidity_abnormal.lower_range_error = decoded.humidity_abnormal.lower_range_error || {};
				}
				if (decoded.humidity_abnormal.type == 0x02) {
					decoded.humidity_abnormal.over_range_error = decoded.humidity_abnormal.over_range_error || {};
				}
				if (decoded.humidity_abnormal.type == 0x03) {
					decoded.humidity_abnormal.no_data = decoded.humidity_abnormal.no_data || {};
				}
				break;
			case 0x08:
				decoded.humidity = readInt16LE(bytes, counterObj, 2) / 10;
				break;
			case 0x0c:
				decoded.temperature_control_info = decoded.temperature_control_info || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0：heat, 2：cool, 3：auto
				decoded.temperature_control_info.mode = extractBits(bitOptions, 4, 8);
				// 0：standby, 1：stage-1 heat, 2：stage-2 heat, 3：stage-3 heat, 4：stage-4 heat, 5：stage-5 heat, 7：stage-1 cool, 8：stage-2 cool, 9：stage-3 cool
				decoded.temperature_control_info.status = extractBits(bitOptions, 0, 4);
				break;
			case 0x0d:
				decoded.fan_control_info = decoded.fan_control_info || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0：auto, 1：circulate, 2：on, 3：low, 4：medium, 5：high
				decoded.fan_control_info.mode = extractBits(bitOptions, 4, 8);
				// 0：off, 1：open, 2：low, 3:medium, 4:high
				decoded.fan_control_info.status = extractBits(bitOptions, 0, 4);
				break;
			case 0x0e:
				decoded.execution_plan_id = readUInt8(bytes, counterObj, 1);
				break;
			case 0x0f:
				decoded.system_status = decoded.system_status || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0：system Off, 1：system on
				decoded.system_status.system_switch = extractBits(bitOptions, 0, 1);
				// 0：Vacant, 1：occupied, 2：night occupied
				decoded.system_status.occupy_status = extractBits(bitOptions, 1, 3);
				decoded.system_status.reserved = extractBits(bitOptions, 3, 8);
				break;
			case 0x10:
				decoded.target_temperature = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x12:
				decoded.cool_target_temperature = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x30:
				decoded.data_transparent = decoded.data_transparent || {};
				decoded.data_transparent.res_cmd = readUInt8(bytes, counterObj, 1);
				if (decoded.data_transparent.res_cmd == 0x00) {
					decoded.data_transparent.res_cmd1 = decoded.data_transparent.res_cmd1 || {};
					decoded.data_transparent.res_cmd1.command = readUInt8(bytes, counterObj, 1);
					if (decoded.data_transparent.res_cmd1.command == 0x00) {
						decoded.data_transparent.res_cmd1.battery = readUInt8(bytes, counterObj, 1);
					}
					if (decoded.data_transparent.res_cmd1.command == 0x0f) {
						decoded.data_transparent.res_cmd1.battery_event = decoded.data_transparent.res_cmd1.battery_event || {};
						decoded.data_transparent.res_cmd1.battery_event.type = readUInt8(bytes, counterObj, 1);
						if (decoded.data_transparent.res_cmd1.battery_event.type == 0x00) {
							decoded.data_transparent.res_cmd1.battery_event.recover = decoded.data_transparent.res_cmd1.battery_event.recover || {};
						}
						if (decoded.data_transparent.res_cmd1.battery_event.type == 0x01) {
							decoded.data_transparent.res_cmd1.battery_event.low_volt = decoded.data_transparent.res_cmd1.battery_event.low_volt || {};
						}
					}
					if (decoded.data_transparent.res_cmd1.command == 0x0d) {
						decoded.data_transparent.res_cmd1.key_event = decoded.data_transparent.res_cmd1.key_event || {};
						decoded.data_transparent.res_cmd1.key_event.type = readUInt8(bytes, counterObj, 1);
						if (decoded.data_transparent.res_cmd1.key_event.type == 0x00) {
							decoded.data_transparent.res_cmd1.key_event.f1 = decoded.data_transparent.res_cmd1.key_event.f1 || {};
						}
						if (decoded.data_transparent.res_cmd1.key_event.type == 0x01) {
							decoded.data_transparent.res_cmd1.key_event.f2 = decoded.data_transparent.res_cmd1.key_event.f2 || {};
						}
						if (decoded.data_transparent.res_cmd1.key_event.type == 0x02) {
							decoded.data_transparent.res_cmd1.key_event.f3 = decoded.data_transparent.res_cmd1.key_event.f3 || {};
						}
					}
					if (decoded.data_transparent.res_cmd1.command == 0xc8) {
						// 0：Off, 1：On
						decoded.data_transparent.res_cmd1.device_status = readUInt8(bytes, counterObj, 1);
					}
				}
				break;
			case 0x01:
				decoded.relay_status_change = decoded.relay_status_change || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0：opened, 1：closed
				decoded.relay_status_change.Y1 = extractBits(bitOptions, 0, 1);
				// 0：opened, 1：closed
				decoded.relay_status_change.W1 = extractBits(bitOptions, 1, 2);
				// 0：opened, 1：closed
				decoded.relay_status_change.OB = extractBits(bitOptions, 2, 3);
				// 0：opened, 1：closed
				decoded.relay_status_change.GL = extractBits(bitOptions, 3, 4);
				// 0：opened, 1：closed
				decoded.relay_status_change.GM = extractBits(bitOptions, 4, 5);
				// 0：opened, 1：closed
				decoded.relay_status_change.GH = extractBits(bitOptions, 5, 6);
				decoded.relay_status_change.reserved = extractBits(bitOptions, 6, 8);
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
			case 0x64:
				// 0：℃, 1：℉
				decoded.temperature_unit = readUInt8(bytes, counterObj, 1);
				break;
			case 0x80:
				// 0：disable, 1：enable
				decoded.relay_change_report_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x6a:
				decoded.temperature_data_source = decoded.temperature_data_source || {};
				var temperature_data_source_command = readUInt8(bytes, counterObj, 1);
				if (temperature_data_source_command == 0x00) {
					// 0: NTC, 1: Lora Data, 2: D2D Data, 3: WT401
					decoded.temperature_data_source.source = readUInt8(bytes, counterObj, 1);
				}
				if (temperature_data_source_command == 0x01) {
					decoded.temperature_data_source.time_out = readUInt8(bytes, counterObj, 1);
				}
				if (temperature_data_source_command == 0x02) {
					// 0:  keep relays status, 1: turn off all relays, 2: thermostat control
					decoded.temperature_data_source.offline_mode = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x6f:
				// 0：Switch Off, 1：Switch On
				decoded.system_switch = readUInt8(bytes, counterObj, 1);
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
			case 0x76:
				// 0：single, 1：double
				decoded.target_temperature_mode = readUInt8(bytes, counterObj, 1);
				break;
			case 0x65:
				// 0：0.5, 1：1
				decoded.target_temperature_resolution = readUInt8(bytes, counterObj, 1);
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
			case 0x77:
				// 0：Disable, 1：Enable
				decoded.unilateral_tolerance_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x62:
				decoded.target_temperature_tolerance = decoded.target_temperature_tolerance || {};
				var target_temperature_tolerance_id = readUInt8(bytes, counterObj, 1);
				if (target_temperature_tolerance_id == 0x00) {
					decoded.target_temperature_tolerance.heat_value = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (target_temperature_tolerance_id == 0x02) {
					decoded.target_temperature_tolerance.cool_value = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (target_temperature_tolerance_id == 0x03) {
					decoded.target_temperature_tolerance.target_value = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (target_temperature_tolerance_id == 0x20) {
					decoded.target_temperature_tolerance.ctrl_value = readInt16LE(bytes, counterObj, 2) / 100;
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
			case 0x83:
				decoded.temperature_control_level_switch = decoded.temperature_control_level_switch || {};
				var temperature_control_level_switch_cmd = readUInt8(bytes, counterObj, 1);
				if (temperature_control_level_switch_cmd == 0x00) {
					// 0：disable, 1：enable
					decoded.temperature_control_level_switch.setforw_enable = readUInt8(bytes, counterObj, 1);
				}
				if (temperature_control_level_switch_cmd == 0x01) {
					// 0：disable, 1：enable
					decoded.temperature_control_level_switch.setback_enable = readUInt8(bytes, counterObj, 1);
				}
				if (temperature_control_level_switch_cmd == 0x02) {
					decoded.temperature_control_level_switch.heat_time = readUInt8(bytes, counterObj, 1);
				}
				if (temperature_control_level_switch_cmd == 0x03) {
					decoded.temperature_control_level_switch.heat_temp = readUInt16LE(bytes, counterObj, 2) / 100;
				}
				if (temperature_control_level_switch_cmd == 0x04) {
					decoded.temperature_control_level_switch.cool_time = readUInt8(bytes, counterObj, 1);
				}
				if (temperature_control_level_switch_cmd == 0x05) {
					decoded.temperature_control_level_switch.cool_temp = readUInt16LE(bytes, counterObj, 2) / 100;
				}
				if (temperature_control_level_switch_cmd == 0x06) {
					decoded.temperature_control_level_switch.threshold_t1 = readUInt16LE(bytes, counterObj, 2) / 100;
				}
				if (temperature_control_level_switch_cmd == 0x07) {
					decoded.temperature_control_level_switch.threshold_t2 = readUInt16LE(bytes, counterObj, 2) / 100;
				}
				break;
			case 0x70:
				decoded.fan_settings = decoded.fan_settings || {};
				var fan_settings_command = readUInt8(bytes, counterObj, 1);
				if (fan_settings_command == 0x00) {
					// 0：Auto, 1：Ventilation, 2：Always Open, 3：Low, 4：Medium, 5：High
					decoded.fan_settings.fan_mode = readUInt8(bytes, counterObj, 1);
				}
				if (fan_settings_command == 0x03) {
					decoded.fan_settings.work_time = readUInt8(bytes, counterObj, 1);
				}
				if (fan_settings_command == 0x01) {
					// 0：Disable, 1：Enable
					decoded.fan_settings.adjust_humidity_enable = readUInt8(bytes, counterObj, 1);
				}
				if (fan_settings_command == 0x02) {
					decoded.fan_settings.adjust_period = readUInt8(bytes, counterObj, 1);
				}
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
			case 0x84:
				// 0：Disable, 1：Enable
				decoded.energy_saving_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x85:
				decoded.energy_saving = decoded.energy_saving || {};
				var energy_saving_level = readUInt8(bytes, counterObj, 1);
				if (energy_saving_level == 0x00) {
					decoded.energy_saving.level_1 = decoded.energy_saving.level_1 || {};
					var energy_saving_level_1_command = readUInt8(bytes, counterObj, 1);
					if (energy_saving_level_1_command == 0x00) {
						// 0：Disable, 1：Enable
						decoded.energy_saving.level_1.enable = readUInt8(bytes, counterObj, 1);
					}
					if (energy_saving_level_1_command == 0x01) {
						decoded.energy_saving.level_1.free_time = readUInt16LE(bytes, counterObj, 2);
					}
					if (energy_saving_level_1_command == 0x02) {
						decoded.energy_saving.level_1.target_temp_tolerance = readUInt16LE(bytes, counterObj, 2) / 100;
					}
				}
				if (energy_saving_level == 0x01) {
					decoded.energy_saving.level_2 = decoded.energy_saving.level_2 || {};
					var energy_saving_level_2_command = readUInt8(bytes, counterObj, 1);
					if (energy_saving_level_2_command == 0x00) {
						// 0：Disable, 1：Enable
						decoded.energy_saving.level_2.enable = readUInt8(bytes, counterObj, 1);
					}
					if (energy_saving_level_2_command == 0x01) {
						decoded.energy_saving.level_2.free_time = readUInt16LE(bytes, counterObj, 2);
					}
					if (energy_saving_level_2_command == 0x02) {
						decoded.energy_saving.level_2.target_temp_tolerance = readUInt16LE(bytes, counterObj, 2) / 100;
					}
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
			case 0x89:
				decoded.external_sensor_settings = decoded.external_sensor_settings || {};
				var external_sensor_settings_command = readUInt8(bytes, counterObj, 1);
				if (external_sensor_settings_command == 0x02) {
					decoded.external_sensor_settings.collect_period = readUInt16LE(bytes, counterObj, 2);
				}
				if (external_sensor_settings_command == 0x03) {
					// 0：Disable, 1：Enable
					decoded.external_sensor_settings.temp_calibration_en = readUInt8(bytes, counterObj, 1);
				}
				if (external_sensor_settings_command == 0x04) {
					decoded.external_sensor_settings.temp_calibration = readInt16LE(bytes, counterObj, 2) / 100;
				}
				break;
			case 0x6e:
				decoded.temperature_alarm_settings = decoded.temperature_alarm_settings || {};
				var temperature_alarm_settings_command = readUInt8(bytes, counterObj, 1);
				if (temperature_alarm_settings_command == 0x00) {
					// 0：Disable, 1：Enable
					decoded.temperature_alarm_settings.enable = readUInt8(bytes, counterObj, 1);
				}
				if (temperature_alarm_settings_command == 0x01) {
					// 0:Disable, 1:Condition: x<A, 2:Condition: x>B, 3:Condition: A≤x≤B, 4:Condition: x<A or x>B
					decoded.temperature_alarm_settings.threshold_condition = readUInt8(bytes, counterObj, 1);
				}
				if (temperature_alarm_settings_command == 0x02) {
					decoded.temperature_alarm_settings.threshold_min = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (temperature_alarm_settings_command == 0x03) {
					decoded.temperature_alarm_settings.threshold_max = readInt16LE(bytes, counterObj, 2) / 100;
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
					// 0：Energize on Heat, 1：Energize on Cool
					decoded.install_configuration.reversing_valve.mode = readUInt8(bytes, counterObj, 1);
				}
				if (install_configuration_type == 0x03) {
					decoded.install_configuration.fan = decoded.install_configuration.fan || {};
					// 0：thermostat, 1：hvac
					decoded.install_configuration.fan.owner = readUInt8(bytes, counterObj, 1);
				}
				if (install_configuration_type == 0x02) {
					decoded.install_configuration.y_combine_aux = decoded.install_configuration.y_combine_aux || {};
					// 0：disable, 1：enable
					decoded.install_configuration.y_combine_aux.enable = readUInt8(bytes, counterObj, 1);
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
			case 0x68:
				// 0：disable, 1：enable
				decoded.window_opening_detection_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x69:
				decoded.window_opening_detection_settings = decoded.window_opening_detection_settings || {};
				// 0：Temperature Change, 1：Magnetic Contact Switch
				decoded.window_opening_detection_settings.type = readUInt8(bytes, counterObj, 1);
				if (decoded.window_opening_detection_settings.type == 0x00) {
					decoded.window_opening_detection_settings.temperature_detection = decoded.window_opening_detection_settings.temperature_detection || {};
					decoded.window_opening_detection_settings.temperature_detection.difference_in_temperature = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.window_opening_detection_settings.temperature_detection.stop_time = readUInt16LE(bytes, counterObj, 2);
				}
				if (decoded.window_opening_detection_settings.type == 0x01) {
					decoded.window_opening_detection_settings.magnet_detection = decoded.window_opening_detection_settings.magnet_detection || {};
					decoded.window_opening_detection_settings.magnet_detection.duration = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x86:
				// 0：Disable, 1：Enable
				decoded.di_settings_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x87:
				decoded.di_settings = decoded.di_settings || {};
				// 0：Room Card, 1：Magnetic Contact Switch
				decoded.di_settings.object = readUInt8(bytes, counterObj, 1);
				if (decoded.di_settings.object == 0x00) {
					decoded.di_settings.card_control = decoded.di_settings.card_control || {};
					// 0：System Control, 1：Insert Schedule
					decoded.di_settings.card_control.type = readUInt8(bytes, counterObj, 1);
					if (decoded.di_settings.card_control.type == 0x00) {
						decoded.di_settings.card_control.system_control = decoded.di_settings.card_control.system_control || {};
						// 0：system off, 1：system on
						decoded.di_settings.card_control.system_control.trigger_by_insertion = readUInt8(bytes, counterObj, 1);
					}
					if (decoded.di_settings.card_control.type == 0x01) {
						decoded.di_settings.card_control.insertion_plan = decoded.di_settings.card_control.insertion_plan || {};
						// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8, 8：Schedule9, 9：Schedule10, 10：Schedule11, 11：Schedule12, 12：Schedule13, 13：Schedule14, 14：Schedule15, 15：Schedule16
						decoded.di_settings.card_control.insertion_plan.trigger_by_insertion = readUInt8(bytes, counterObj, 1);
						// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8, 8：Schedule9, 9：Schedule10, 10：Schedule11, 11：Schedule12, 12：Schedule13, 13：Schedule14, 14：Schedule15, 15：Schedule16
						decoded.di_settings.card_control.insertion_plan.trigger_by_extraction = readUInt8(bytes, counterObj, 1);
					}
				}
				if (decoded.di_settings.object == 0x01) {
					decoded.di_settings.magnet_detection = decoded.di_settings.magnet_detection || {};
					// 0：NC, 1：NO
					decoded.di_settings.magnet_detection.magnet_type = readUInt8(bytes, counterObj, 1);
				}
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
				decoded.d2d_master_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x98:
				decoded.d2d_master_settings = decoded.d2d_master_settings || [];
				// 0: Schedule1, 1: Schedule2, 2: Schedule3, 3: Schedule4, 4: Schedule5, 5: Schedule6, 6: Schedule7, 7: Schedule8, 8：Schedule9, 9：Schedule10, 10：Schedule11, 11：Schedule12, 12：Schedule13, 13：Schedule14, 14：Schedule15, 15：Schedule16, 16：System Off, 17：System On
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
			case 0x99:
				// 0：disable, 1：enable
				decoded.d2d_slave_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x9a:
				decoded.d2d_slave_settings = decoded.d2d_slave_settings || [];
				var index = readUInt8(bytes, counterObj, 1);
				var d2d_slave_settings_item = pickArrayItem(decoded.d2d_slave_settings, index, 'index');
				d2d_slave_settings_item.index = index;
				insertArrayItem(decoded.d2d_slave_settings, d2d_slave_settings_item, 'index');
				// 0：disable, 1：enable
				d2d_slave_settings_item.enable = readUInt8(bytes, counterObj, 1);
				d2d_slave_settings_item.command = readHexString(bytes, counterObj, 2);
				// 0: Schedule1, 1: Schedule2, 2: Schedule3, 3: Schedule4, 4: Schedule5, 5: Schedule6, 6: Schedule7, 7: Schedule8, 8：Schedule9, 9：Schedule10, 10：Schedule11, 11：Schedule12, 12：Schedule13, 13：Schedule14, 14：Schedule15, 15：Schedule16, 16：System Off, 17：System On
				d2d_slave_settings_item.value = readUInt8(bytes, counterObj, 1);
				break;
			case 0xbe:
				decoded.reboot = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0xbb:
				decoded.retrieve_historical_data_by_time_range = decoded.retrieve_historical_data_by_time_range || {};
				decoded.retrieve_historical_data_by_time_range.start_time = readUInt32LE(bytes, counterObj, 4);
				decoded.retrieve_historical_data_by_time_range.end_time = readUInt32LE(bytes, counterObj, 4);
				break;
			case 0x59:
				decoded.system_status_control = decoded.system_status_control || {};
				// 0：system off, 1：system on
				decoded.system_status_control.on_off = readUInt8(bytes, counterObj, 1);
				// 0：heat, 2：cool, 3：auto, 255：disable
				decoded.system_status_control.mode = readUInt8(bytes, counterObj, 1);
				if (decoded.system_status_control.mode == 255) {
					decoded.system_status_control.mode = 'no apply';
				}
				var t1 = readInt16LE(bytes, counterObj, 2);
				if (t1 == -1) {
					decoded.system_status_control.temperature1 = 'no apply';
				} else {
					decoded.system_status_control.temperature1 = t1 / 100;
				}

				var t2 = readInt16LE(bytes, counterObj, 2);
				if (t2 == -1) {
					decoded.system_status_control.temperature2 = 'no apply';
				} else {
					decoded.system_status_control.temperature2 = t2 / 100;
				}
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

function patchDecode(decoded) {
	//0=Normal, 1=Alarm
	if (decoded.temperature_alarm && decoded.temperature_alarm.type == 0x10) {
		decoded.anti_freeze_protection_status = 0;
	}
	if (decoded.temperature_alarm && decoded.temperature_alarm.type == 0x11) {
		decoded.anti_freeze_protection_status = 1;
	}

	if (decoded.relay_status_change) {
		var relay = [];
		if (decoded.relay_status_change.Y1 == 1) {
			relay.push('Y1');
		}
		if (decoded.relay_status_change.W1 == 1) {
			relay.push('W1');
		}
		if (decoded.relay_status_change.OB == 1) {
			relay.push('OB');
		}
		if (decoded.relay_status_change.GL == 1) {
			relay.push('GL');
		}
		if (decoded.relay_status_change.GM == 1) {
			relay.push('GM');
		}
		if (decoded.relay_status_change.GH == 1) {
			relay.push('GH');
		}
		decoded.enabled_relay = relay.length > 0 ? relay.join('&') : 'off';
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
		  "10": "target_temperature",
		  "12": "cool_target_temperature",
		  "30": "data_transparent",
		  "59": "system_status_control",
		  "60": "temperature_control_mode",
		  "61": "target_temperature_settings",
		  "62": "target_temperature_tolerance",
		  "63": "target_temperature_range",
		  "64": "temperature_unit",
		  "65": "target_temperature_resolution",
		  "66": "reporting_interval",
		  "68": "window_opening_detection_enable",
		  "69": "window_opening_detection_settings",
		  "70": "fan_settings",
		  "71": "anti_freezing",
		  "72": "dehumidify_settings",
		  "73": "plan_dwell_time_settings",
		  "74": "system_protect",
		  "76": "target_temperature_mode",
		  "77": "unilateral_tolerance_enable",
		  "80": "relay_change_report_enable",
		  "82": "fan_delay_settings",
		  "83": "temperature_control_level_switch",
		  "84": "energy_saving_enable",
		  "85": "energy_saving",
		  "86": "di_settings_enable",
		  "87": "di_settings",
		  "89": "external_sensor_settings",
		  "91": "communication_mode",
		  "95": "d2d_pairing_enable",
		  "96": "d2d_pairing_settings",
		  "97": "d2d_master_enable",
		  "98": "d2d_master_settings",
		  "99": "d2d_slave_enable",
		  "3000": "data_transparent.res_cmd1",
		  "6000": "temperature_control_mode.ctrl_mode",
		  "6001": "temperature_control_mode.plan_enable",
		  "6100": "target_temperature_settings.heat",
		  "6102": "target_temperature_settings.cool",
		  "6103": "target_temperature_settings.auto",
		  "6200": "target_temperature_tolerance.heat_value",
		  "6202": "target_temperature_tolerance.cool_value",
		  "6203": "target_temperature_tolerance.target_value",
		  "6220": "target_temperature_tolerance.ctrl_value",
		  "6300": "target_temperature_range.heat",
		  "6302": "target_temperature_range.cool",
		  "6303": "target_temperature_range.auto",
		  "6600": "reporting_interval.ble_lora",
		  "6601": "reporting_interval.power_lora",
		  "6900": "window_opening_detection_settings.temperature_detection",
		  "6901": "window_opening_detection_settings.magnet_detection",
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
		  "8300": "temperature_control_level_switch.setforw_enable",
		  "8301": "temperature_control_level_switch.setback_enable",
		  "8302": "temperature_control_level_switch.heat_time",
		  "8303": "temperature_control_level_switch.heat_temp",
		  "8304": "temperature_control_level_switch.cool_time",
		  "8305": "temperature_control_level_switch.cool_temp",
		  "8306": "temperature_control_level_switch.threshold_t1",
		  "8307": "temperature_control_level_switch.threshold_t2",
		  "8500": "energy_saving.level_1",
		  "8501": "energy_saving.level_2",
		  "8700": "di_settings.card_control",
		  "8701": "di_settings.magnet_detection",
		  "8902": "external_sensor_settings.collect_period",
		  "8903": "external_sensor_settings.temp_calibration_en",
		  "8904": "external_sensor_settings.temp_calibration",
		  "300000": "data_transparent.res_cmd1.battery",
		  "660000": "reporting_interval.ble_lora.seconds_of_time",
		  "660001": "reporting_interval.ble_lora.minutes_of_time",
		  "660100": "reporting_interval.power_lora.seconds_of_time",
		  "660101": "reporting_interval.power_lora.minutes_of_time",
		  "850000": "energy_saving.level_1.enable",
		  "850001": "energy_saving.level_1.free_time",
		  "850002": "energy_saving.level_1.target_temp_tolerance",
		  "850100": "energy_saving.level_2.enable",
		  "850101": "energy_saving.level_2.free_time",
		  "850102": "energy_saving.level_2.target_temp_tolerance",
		  "870000": "di_settings.card_control.system_control",
		  "870001": "di_settings.card_control.insertion_plan",
		  "fe": "request_check_order",
		  "ef": "request_command_queries",
		  "ee": "request_query_all_configurations",
		  "cf": "lorawan_configuration_settings",
		  "cf00": "lorawan_configuration_settings.mode",
		  "df": "tsl_version",
		  "db": "product_sn",
		  "da": "version",
		  "d9": "oem_id",
		  "c8": "device_status",
		  "cd": "ble_configuration_settings",
		  "cd00": "ble_configuration_settings.enable",
		  "cd01": "ble_configuration_settings.local_id",
		  "cd05": "ble_configuration_settings.local_name_first",
		  "cd06": "ble_configuration_settings.local_name_last",
		  "cd07": "ble_configuration_settings.pair_info",
		  "cd04": "ble_configuration_settings.pair_name",
		  "cd04xx": "ble_configuration_settings.pair_name._item",
		  "cd02": "ble_configuration_settings.pair_mac",
		  "cd02xx": "ble_configuration_settings.pair_mac._item",
		  "cd03": "ble_configuration_settings.pair_addr",
		  "cd03xx": "ble_configuration_settings.pair_addr._item",
		  "cd08": "ble_configuration_settings.local_info",
		  "ba": "ble_new_event",
		  "baxx": "ble_new_event._item",
		  "b4": "ble_server",
		  "02": "temperature_alarm",
		  "0200": "temperature_alarm.open_window_alarm_deactivation",
		  "0201": "temperature_alarm.open_window_alarm_trigger",
		  "0210": "temperature_alarm.anti_freeze_protection_deactivation",
		  "0211": "temperature_alarm.anti_freeze_protection_trigger",
		  "0220": "temperature_alarm.over_range_alarm_trigger",
		  "0221": "temperature_alarm.over_range_alarm_deactivation",
		  "0222": "temperature_alarm.lower_range_alarm_trigger",
		  "0223": "temperature_alarm.lower_range_alarm_deactivation",
		  "0224": "temperature_alarm.within_range_alarm_trigger",
		  "0225": "temperature_alarm.within_range_alarm_deactivation",
		  "0230": "temperature_alarm.persistent_low_temp_deactivation",
		  "0231": "temperature_alarm.persistent_low_temp_trigger",
		  "0240": "temperature_alarm.persistent_high_temp_deactivation",
		  "0241": "temperature_alarm.persistent_high_temp_trigger",
		  "03": "temperature_abnormal",
		  "0300": "temperature_abnormal.collection_error",
		  "0301": "temperature_abnormal.lower_range_error",
		  "0302": "temperature_abnormal.over_range_error",
		  "0303": "temperature_abnormal.no_data",
		  "04": "filter_clean_remind",
		  "05": "temperature_humi_data_source",
		  "06": "temperature",
		  "07": "humidity_abnormal",
		  "0700": "humidity_abnormal.collection_error",
		  "0701": "humidity_abnormal.lower_range_error",
		  "0702": "humidity_abnormal.over_range_error",
		  "0703": "humidity_abnormal.no_data",
		  "08": "humidity",
		  "0c": "temperature_control_info",
		  "0d": "fan_control_info",
		  "0e": "execution_plan_id",
		  "0f": "system_status",
		  "30000f": "data_transparent.res_cmd1.battery_event",
		  "30000f00": "data_transparent.res_cmd1.battery_event.recover",
		  "30000f01": "data_transparent.res_cmd1.battery_event.low_volt",
		  "30000d": "data_transparent.res_cmd1.key_event",
		  "30000d00": "data_transparent.res_cmd1.key_event.f1",
		  "30000d01": "data_transparent.res_cmd1.key_event.f2",
		  "30000d02": "data_transparent.res_cmd1.key_event.f3",
		  "3000c8": "data_transparent.res_cmd1.device_status",
		  "01": "relay_status_change",
		  "6a": "temperature_data_source",
		  "6a00": "temperature_data_source.source",
		  "6a01": "temperature_data_source.time_out",
		  "6a02": "temperature_data_source.offline_mode",
		  "6f": "system_switch",
		  "8b": "filter_clean_settings",
		  "8b00": "filter_clean_settings.enable",
		  "8b01": "filter_clean_settings.reminder_period",
		  "c7": "time_zone",
		  "c6": "daylight_saving_time",
		  "c5": "data_storage_settings",
		  "c500": "data_storage_settings.enable",
		  "c501": "data_storage_settings.retransmission_enable",
		  "c502": "data_storage_settings.retransmission_interval",
		  "c503": "data_storage_settings.retrieval_interval",
		  "6e": "temperature_alarm_settings",
		  "6e00": "temperature_alarm_settings.enable",
		  "6e01": "temperature_alarm_settings.threshold_condition",
		  "6e02": "temperature_alarm_settings.threshold_min",
		  "6e03": "temperature_alarm_settings.threshold_max",
		  "6d": "low_temperature_alarm_settings",
		  "6d00": "low_temperature_alarm_settings.enable",
		  "6d01": "low_temperature_alarm_settings.difference_in_temperature",
		  "6d02": "low_temperature_alarm_settings.duration",
		  "6c": "high_temperature_alarm_settings",
		  "6c00": "high_temperature_alarm_settings.enable",
		  "6c01": "high_temperature_alarm_settings.difference_in_temperature",
		  "6c02": "high_temperature_alarm_settings.duration",
		  "73xx": "plan_dwell_time_settings._item",
		  "73xx00": "plan_dwell_time_settings._item.permanent_stay_enable",
		  "73xx01": "plan_dwell_time_settings._item.dwell_time",
		  "8e": "install_configuration",
		  "8e00": "install_configuration.wire",
		  "8e01": "install_configuration.reversing_valve",
		  "8e03": "install_configuration.fan",
		  "8e02": "install_configuration.y_combine_aux",
		  "96xx": "d2d_pairing_settings._item",
		  "96xx00": "d2d_pairing_settings._item.enable",
		  "96xx01": "d2d_pairing_settings._item.deveui",
		  "96xx02": "d2d_pairing_settings._item.name_first",
		  "96xx03": "d2d_pairing_settings._item.name_last",
		  "98xx": "d2d_master_settings._item",
		  "9a": "d2d_slave_settings",
		  "9axx": "d2d_slave_settings._item",
		  "be": "reboot",
		  "bb": "retrieve_historical_data_by_time_range"
	};
}
function processTemperature(decoded) {
	var allTemperatureProperties = {
    "temperature_alarm.open_window_alarm_deactivation.temperature": {
        "precision": 2,
        "unitName": "℃"
    },
    "temperature_alarm.open_window_alarm_trigger.temperature": {
        "precision": 2,
        "unitName": "℃"
    },
    "temperature_alarm.anti_freeze_protection_deactivation.temperature": {
        "precision": 2,
        "unitName": "℃"
    },
    "temperature_alarm.anti_freeze_protection_trigger.temperature": {
        "precision": 2,
        "unitName": "℃"
    },
    "temperature_alarm.over_range_alarm_trigger.temperature": {
        "precision": 2,
        "unitName": "℃"
    },
    "temperature_alarm.over_range_alarm_deactivation.temperature": {
        "precision": 2,
        "unitName": "℃"
    },
    "temperature_alarm.lower_range_alarm_trigger.temperature": {
        "precision": 2,
        "unitName": "℃"
    },
    "temperature_alarm.lower_range_alarm_deactivation.temperature": {
        "precision": 2,
        "unitName": "℃"
    },
    "temperature_alarm.within_range_alarm_trigger.temperature": {
        "precision": 2,
        "unitName": "℃"
    },
    "temperature_alarm.within_range_alarm_deactivation.temperature": {
        "precision": 2,
        "unitName": "℃"
    },
    "temperature_alarm.persistent_low_temp_deactivation.temperature": {
        "precision": 2,
        "unitName": "℃"
    },
    "temperature_alarm.persistent_low_temp_trigger.temperature": {
        "precision": 2,
        "unitName": "℃"
    },
    "temperature_alarm.persistent_high_temp_deactivation.temperature": {
        "precision": 2,
        "unitName": "℃"
    },
    "temperature_alarm.persistent_high_temp_trigger.temperature": {
        "precision": 2,
        "unitName": "℃"
    },
    "temperature": {
        "precision": 2,
        "unitName": "℃"
    },
    "target_temperature": {
        "precision": 2,
        "unitName": "℃"
    },
    "cool_target_temperature": {
        "precision": 2,
        "unitName": "℃"
    },
    "target_temperature_settings.heat": {
        "precision": 2,
        "unitName": "℃"
    },
    "target_temperature_settings.cool": {
        "precision": 2,
        "unitName": "℃"
    },
    "target_temperature_settings.auto": {
        "precision": 2,
        "unitName": "℃"
    },
    "target_temperature_tolerance.heat_value": {
        "precision": 2,
        "unitName": "K"
    },
    "target_temperature_tolerance.cool_value": {
        "precision": 2,
        "unitName": "K"
    },
    "target_temperature_tolerance.target_value": {
        "precision": 2,
        "unitName": "K"
    },
    "target_temperature_tolerance.ctrl_value": {
        "precision": 2,
        "unitName": "K"
    },
    "target_temperature_range.heat.min": {
        "precision": 2,
        "unitName": "℃"
    },
    "target_temperature_range.heat.max": {
        "precision": 2,
        "unitName": "℃"
    },
    "target_temperature_range.cool.min": {
        "precision": 2,
        "unitName": "℃"
    },
    "target_temperature_range.cool.max": {
        "precision": 2,
        "unitName": "℃"
    },
    "target_temperature_range.auto.min": {
        "precision": 2,
        "unitName": "℃"
    },
    "target_temperature_range.auto.max": {
        "precision": 2,
        "unitName": "℃"
    },
    "temperature_control_level_switch.heat_temp": {
        "precision": 2,
        "unitName": "K"
    },
    "temperature_control_level_switch.cool_temp": {
        "precision": 2,
        "unitName": "K"
    },
    "temperature_control_level_switch.threshold_t1": {
        "precision": 2,
        "unitName": "K"
    },
    "temperature_control_level_switch.threshold_t2": {
        "precision": 2,
        "unitName": "K"
    },
    "energy_saving.level_1.target_temp_tolerance": {
        "precision": 2,
        "unitName": "K"
    },
    "energy_saving.level_2.target_temp_tolerance": {
        "precision": 2,
        "unitName": "K"
    },
    "external_sensor_settings.temp_calibration": {
        "precision": 2,
        "unitName": "K"
    },
    "temperature_alarm_settings.threshold_min": {
        "precision": 2,
        "unitName": "℃"
    },
    "temperature_alarm_settings.threshold_max": {
        "precision": 2,
        "unitName": "℃"
    },
    "low_temperature_alarm_settings.difference_in_temperature": {
        "precision": 2,
        "unitName": "K"
    },
    "high_temperature_alarm_settings.difference_in_temperature": {
        "precision": 2,
        "unitName": "K"
    },
    "anti_freezing.target_temperature": {
        "precision": 2,
        "unitName": "℃"
    },
    "window_opening_detection_settings.temperature_detection.difference_in_temperature": {
        "precision": 2,
        "unitName": "K"
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