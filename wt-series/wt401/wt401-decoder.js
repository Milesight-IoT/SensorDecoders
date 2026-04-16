/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product WT401
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
				decoded.check_sequence_number_reply = decoded.check_sequence_number_reply || {};
				decoded.check_sequence_number_reply.sequence_number = readUInt8(bytes, counterObj, 1);
				break;
			case 0xfe:
				decoded.check_order_reply = readOnlyCommand(bytes, counterObj, 1);
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
			case 0xd8:
				decoded.product_frequency_band = readString(bytes, counterObj, 16);
				break;
			case 0xd5:
				decoded.ble_phone_name = decoded.ble_phone_name || {};
				decoded.ble_phone_name.length = readUInt8(bytes, counterObj, 1);
				decoded.ble_phone_name.value = readString(bytes, counterObj, decoded.ble_phone_name.length);
				break;
			case 0x00:
				decoded.battery = readUInt8(bytes, counterObj, 1);
				break;
			case 0x01:
				decoded.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x02:
				decoded.humidity = readUInt16LE(bytes, counterObj, 2) / 10;
				break;
			case 0x08:
				// 0：Vacant, 1：Occupied, 2：Night Occupied
				decoded.pir_status = readUInt8(bytes, counterObj, 1);
				break;
			case 0x03:
				// 0：heat, 1：em heat, 2：cool, 3：auto, 4：dehumidify, 5：ventilation, 10：off, 11：none
				decoded.temperature_mode = readUInt8(bytes, counterObj, 1);
				break;
			case 0x06:
				decoded.target_temperature1 = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x07:
				decoded.target_temperature2 = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x04:
				// 0：auto, 1：circulate, 2：on, 3：low, 4：medium, 5：high, 10：off, 11：none/keep
				decoded.fan_mode = readUInt8(bytes, counterObj, 1);
				break;
			case 0x05:
				// 0:plan0, 1:plan1, 2:plan2, 3:plan3, 4:plan4, 5:plan5, 6:plan6, 7:plan7, 8:plan8, 9:plan9, 10:plan10, 11:plan11, 12:plan12, 13:plan13, 14:plan14, 15:plan15, 255:Not executed
				decoded.execution_plan_id = readUInt8(bytes, counterObj, 1);
				break;
			case 0x0b:
				decoded.temperature_alarm = decoded.temperature_alarm || {};
				decoded.temperature_alarm.type = readUInt8(bytes, counterObj, 1);
				break;
			case 0x0c:
				decoded.humidity_alarm = decoded.humidity_alarm || {};
				decoded.humidity_alarm.type = readUInt8(bytes, counterObj, 1);
				break;
			case 0x09:
				decoded.ble_event = decoded.ble_event || {};
				decoded.ble_event.type = readUInt8(bytes, counterObj, 1);
				break;
			case 0x0a:
				decoded.power_bus_event = decoded.power_bus_event || {};
				decoded.power_bus_event.type = readUInt8(bytes, counterObj, 1);
				break;
			case 0x0d:
				decoded.key_event = decoded.key_event || {};
				decoded.key_event.type = readUInt8(bytes, counterObj, 1);
				if (decoded.key_event.type == 0x00) {
					decoded.key_event.f1 = decoded.key_event.f1 || {};
				}
				if (decoded.key_event.type == 0x01) {
					decoded.key_event.f2 = decoded.key_event.f2 || {};
				}
				if (decoded.key_event.type == 0x02) {
					decoded.key_event.f3 = decoded.key_event.f3 || {};
				}
				break;
			case 0x0f:
				decoded.battery_event = decoded.battery_event || {};
				decoded.battery_event.type = readUInt8(bytes, counterObj, 1);
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
			case 0x8d:
				// 0：BLE, 1：LoRa, 2：BLE+LoRa, 3：PowerBus+LoRa
				decoded.communication_mode = readUInt8(bytes, counterObj, 1);
				break;
			case 0x61:
				decoded.reporting_interval = decoded.reporting_interval || {};
				// 0：BLE, 1：LORA, 2：BLE+LORA, 3：POWERBUS+lora
				var reporting_interval_type = readUInt8(bytes, counterObj, 1);
				if (reporting_interval_type == 0x00) {
					decoded.reporting_interval.ble = decoded.reporting_interval.ble || {};
					// 0：second, 1：min
					decoded.reporting_interval.ble.unit = readUInt8(bytes, counterObj, 1);
					if (decoded.reporting_interval.ble.unit == 0x00) {
						decoded.reporting_interval.ble.seconds_of_time = readUInt16LE(bytes, counterObj, 2);
					}
					if (decoded.reporting_interval.ble.unit == 0x01) {
						decoded.reporting_interval.ble.minutes_of_time = readUInt16LE(bytes, counterObj, 2);
					}
				}
				if (reporting_interval_type == 0x01) {
					decoded.reporting_interval.lora = decoded.reporting_interval.lora || {};
					// 0：second, 1：min
					decoded.reporting_interval.lora.unit = readUInt8(bytes, counterObj, 1);
					if (decoded.reporting_interval.lora.unit == 0x00) {
						decoded.reporting_interval.lora.seconds_of_time = readUInt16LE(bytes, counterObj, 2);
					}
					if (decoded.reporting_interval.lora.unit == 0x01) {
						decoded.reporting_interval.lora.minutes_of_time = readUInt16LE(bytes, counterObj, 2);
					}
				}
				if (reporting_interval_type == 0x02) {
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
				if (reporting_interval_type == 0x03) {
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
			case 0x6c:
				decoded.communicate_interval = decoded.communicate_interval || {};
				// 0:BLE, 1:LORA, 2:BLE+LORA, 3:POWERBUS+LORA
				var communicate_interval_id = readUInt8(bytes, counterObj, 1);
				if (communicate_interval_id == 0x00) {
					decoded.communicate_interval.ble = decoded.communicate_interval.ble || {};
					// 0：second, 1：min
					decoded.communicate_interval.ble.unit = readUInt8(bytes, counterObj, 1);
					if (decoded.communicate_interval.ble.unit == 0x00) {
						decoded.communicate_interval.ble.seconds_of_time = readUInt16LE(bytes, counterObj, 2);
					}
					if (decoded.communicate_interval.ble.unit == 0x01) {
						decoded.communicate_interval.ble.minutes_of_time = readUInt16LE(bytes, counterObj, 2);
					}
				}
				if (communicate_interval_id == 0x01) {
					decoded.communicate_interval.lora = decoded.communicate_interval.lora || {};
					// 0：second, 1：min
					decoded.communicate_interval.lora.unit = readUInt8(bytes, counterObj, 1);
					if (decoded.communicate_interval.lora.unit == 0x00) {
						decoded.communicate_interval.lora.seconds_of_time = readUInt16LE(bytes, counterObj, 2);
					}
					if (decoded.communicate_interval.lora.unit == 0x01) {
						decoded.communicate_interval.lora.minutes_of_time = readUInt16LE(bytes, counterObj, 2);
					}
				}
				if (communicate_interval_id == 0x02) {
					decoded.communicate_interval.ble_lora = decoded.communicate_interval.ble_lora || {};
					// 0：second, 1：min
					decoded.communicate_interval.ble_lora.unit = readUInt8(bytes, counterObj, 1);
					if (decoded.communicate_interval.ble_lora.unit == 0x00) {
						decoded.communicate_interval.ble_lora.seconds_of_time = readUInt16LE(bytes, counterObj, 2);
					}
					if (decoded.communicate_interval.ble_lora.unit == 0x01) {
						decoded.communicate_interval.ble_lora.minutes_of_time = readUInt16LE(bytes, counterObj, 2);
					}
				}
				if (communicate_interval_id == 0x03) {
					decoded.communicate_interval.power_bus = decoded.communicate_interval.power_bus || {};
					// 0：second, 1：min
					decoded.communicate_interval.power_bus.unit = readUInt8(bytes, counterObj, 1);
					if (decoded.communicate_interval.power_bus.unit == 0x00) {
						decoded.communicate_interval.power_bus.seconds_of_time = readUInt16LE(bytes, counterObj, 2);
					}
					if (decoded.communicate_interval.power_bus.unit == 0x01) {
						decoded.communicate_interval.power_bus.minutes_of_time = readUInt16LE(bytes, counterObj, 2);
					}
				}
				break;
			case 0xc8:
				// 0：Power Off, 1：Power On
				decoded.device_status = readUInt8(bytes, counterObj, 1);
				break;
			case 0x63:
				// 0：℃, 1：℉
				decoded.temperature_unit = readUInt8(bytes, counterObj, 1);
				break;
			case 0x7d:
				// 0:Embedded Data, 1:External Receive
				decoded.data_sync_to_peer = readUInt8(bytes, counterObj, 1);
				break;
			case 0x7e:
				decoded.data_sync_timeout = readUInt8(bytes, counterObj, 1);
				break;
			case 0x85:
				// 0:disable, 1:enable
				decoded.ble_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x8b:
				decoded.ble_name = readString(bytes, counterObj, 32);
				break;
			case 0x67:
				// 0：Off, 1：On
				decoded.system_status = readUInt8(bytes, counterObj, 1);
				break;
			case 0x64:
				decoded.mode_enable = decoded.mode_enable || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0：disable, 1：enable
				decoded.mode_enable.heat = extractBits(bitOptions, 0, 1);
				// 0：disable, 1：enable
				decoded.mode_enable.em_heat = extractBits(bitOptions, 1, 2);
				// 0：disable, 1：enable
				decoded.mode_enable.cool = extractBits(bitOptions, 2, 3);
				// 0：disable, 1：enable
				decoded.mode_enable.auto = extractBits(bitOptions, 3, 4);
				decoded.mode_enable.reserved = extractBits(bitOptions, 6, 8);
				break;
			case 0x88:
				decoded.fan_enable = decoded.fan_enable || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0：disable, 1：enable
				decoded.fan_enable.auto = extractBits(bitOptions, 0, 1);
				// 0：disable, 1：enable
				decoded.fan_enable.circul = extractBits(bitOptions, 1, 2);
				// 0：disable, 1：enable
				decoded.fan_enable.on = extractBits(bitOptions, 2, 3);
				// 0：disable, 1：enable
				decoded.fan_enable.low = extractBits(bitOptions, 3, 4);
				// 0：disable, 1：enable
				decoded.fan_enable.medium = extractBits(bitOptions, 4, 5);
				// 0：disable, 1：enable
				decoded.fan_enable.high = extractBits(bitOptions, 5, 6);
				decoded.fan_enable.reserved = extractBits(bitOptions, 6, 8);
				break;
			case 0x68:
				decoded.temperature_control_mode = decoded.temperature_control_mode || {};
				var temperature_control_mode_subcmd = readUInt8(bytes, counterObj, 1);
				if (temperature_control_mode_subcmd == 0x00) {
					// 0：heat, 1：em heat, 2：cool, 3：auto, 4：dehumidify, 5：ventilation
					decoded.temperature_control_mode.mode = readUInt8(bytes, counterObj, 1);
				}
				if (temperature_control_mode_subcmd == 0x01) {
					// 0：disable, 1：enable
					decoded.temperature_control_mode.plan_mode_enable = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x65:
				// 0：single, 1：dual
				decoded.target_temperature_mode = readUInt8(bytes, counterObj, 1);
				break;
			case 0x66:
				// 0：0.5, 1：1
				decoded.target_temperature_resolution = readUInt8(bytes, counterObj, 1);
				break;
			case 0x69:
				decoded.target_temperature_settings = decoded.target_temperature_settings || {};
				var target_temperature_settings_temperature_control_mode = readUInt8(bytes, counterObj, 1);
				if (target_temperature_settings_temperature_control_mode == 0x00) {
					decoded.target_temperature_settings.heat = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (target_temperature_settings_temperature_control_mode == 0x01) {
					decoded.target_temperature_settings.em_heat = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (target_temperature_settings_temperature_control_mode == 0x02) {
					decoded.target_temperature_settings.cool = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (target_temperature_settings_temperature_control_mode == 0x03) {
					decoded.target_temperature_settings.auto = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (target_temperature_settings_temperature_control_mode == 0x04) {
					decoded.target_temperature_settings.auto_heat = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (target_temperature_settings_temperature_control_mode == 0x05) {
					decoded.target_temperature_settings.auto_cool = readInt16LE(bytes, counterObj, 2) / 100;
				}
				break;
			case 0x6a:
				decoded.minimum_dead_zone = readUInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x6b:
				decoded.target_temperature_range = decoded.target_temperature_range || {};
				// 0：heat, 1：em heat, 2：cool, 3：auto
				var target_temperature_range_id = readUInt8(bytes, counterObj, 1);
				if (target_temperature_range_id == 0x00) {
					decoded.target_temperature_range.heat = decoded.target_temperature_range.heat || {};
					decoded.target_temperature_range.heat.min = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.target_temperature_range.heat.max = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (target_temperature_range_id == 0x01) {
					decoded.target_temperature_range.em_heat = decoded.target_temperature_range.em_heat || {};
					decoded.target_temperature_range.em_heat.min = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.target_temperature_range.em_heat.max = readInt16LE(bytes, counterObj, 2) / 100;
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
			case 0x74:
				// 0：auto, 1：circulate, 2：on, 3：low, 4：medium, 5：high
				decoded.fan_control_mode = readUInt8(bytes, counterObj, 1);
				break;
			case 0x82:
				decoded.pir_common = decoded.pir_common || {};
				var pir_common_cmd = readUInt8(bytes, counterObj, 1);
				if (pir_common_cmd == 0x01) {
					// 0:disable, 1:enable
					decoded.pir_common.enable = readUInt8(bytes, counterObj, 1);
				}
				if (pir_common_cmd == 0x02) {
					decoded.pir_common.release_time = readUInt16LE(bytes, counterObj, 2);
				}
				if (pir_common_cmd == 0x03) {
					// 0:Immediate Trigger, 1:Rule Trigger
					decoded.pir_common.mode = readUInt8(bytes, counterObj, 1);
				}
				if (pir_common_cmd == 0x04) {
					decoded.pir_common.check = decoded.pir_common.check || {};
					decoded.pir_common.check.period = readUInt8(bytes, counterObj, 1);
					decoded.pir_common.check.rate = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x83:
				decoded.pir_energy = decoded.pir_energy || {};
				var pir_energy_cmd = readUInt8(bytes, counterObj, 1);
				if (pir_energy_cmd == 0x01) {
					// 0:disable, 1:enable
					decoded.pir_energy.enable = readUInt8(bytes, counterObj, 1);
				}
				if (pir_energy_cmd == 0x02) {
					decoded.pir_energy.plan = decoded.pir_energy.plan || {};
					// 0:plan0, 1:plan1, 2:plan2, 3:plan3, 4:plan4, 5:plan5, 6:plan6, 7:plan7, 255:Not executed
					decoded.pir_energy.plan.occupied = readUInt8(bytes, counterObj, 1);
					// 0:plan0, 1:plan1, 2:plan2, 3:plan3, 4:plan4, 5:plan5, 6:plan6, 7:plan7, 255:Not executed
					decoded.pir_energy.plan.unoccupied = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x84:
				decoded.pir_night = decoded.pir_night || {};
				var pir_night_cmd = readUInt8(bytes, counterObj, 1);
				if (pir_night_cmd == 0x01) {
					// 0:disable, 1:enable
					decoded.pir_night.enable = readUInt8(bytes, counterObj, 1);
				}
				if (pir_night_cmd == 0x04) {
					decoded.pir_night.night_time = decoded.pir_night.night_time || {};
					decoded.pir_night.night_time.start = readUInt16LE(bytes, counterObj, 2);
					decoded.pir_night.night_time.stop = readUInt16LE(bytes, counterObj, 2);
				}
				if (pir_night_cmd == 0x05) {
					// 0:plan0, 1:plan1, 2:plan2, 3:plan3, 4:plan4, 5:plan5, 6:plan6, 7:plan7, 255:Not executed
					decoded.pir_night.occupied = readUInt8(bytes, counterObj, 1);
				}
				if (pir_night_cmd == 0x02) {
					// 0:Immediate Trigger, 1:Rule Trigger
					decoded.pir_night.mode = readUInt8(bytes, counterObj, 1);
				}
				if (pir_night_cmd == 0x03) {
					decoded.pir_night.check = decoded.pir_night.check || {};
					decoded.pir_night.check.period = readUInt8(bytes, counterObj, 1);
					decoded.pir_night.check.rate = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x75:
				decoded.screen_display_settings = decoded.screen_display_settings || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0:disable, 1:enable
				decoded.screen_display_settings.plan_name = extractBits(bitOptions, 0, 1);
				// 0:disable, 1:enable
				decoded.screen_display_settings.ambient_temp = extractBits(bitOptions, 1, 2);
				// 0:disable, 1:enable
				decoded.screen_display_settings.ambient_humi = extractBits(bitOptions, 2, 3);
				// 0:disable, 1:enable
				decoded.screen_display_settings.target_temp = extractBits(bitOptions, 3, 4);
				decoded.screen_display_settings.reserved = extractBits(bitOptions, 4, 8);
				break;
			case 0x71:
				decoded.button_custom_function = decoded.button_custom_function || {};
				var button_custom_function_subcmd = readUInt8(bytes, counterObj, 1);
				if (button_custom_function_subcmd == 0x00) {
					decoded.button_custom_function.enable = readInt8(bytes, counterObj, 1);
				}
				if (button_custom_function_subcmd == 0x01) {
					// 1：Temperature Control Mode, 2：Fan Mode, 3：Schedule Switch, 4：Status Report, 5：Filter Cleaning Reset, 6：Button Event1, 7：Temperature Unit Switch
					decoded.button_custom_function.mode1 = readUInt8(bytes, counterObj, 1);
				}
				if (button_custom_function_subcmd == 0x02) {
					// 1：Temperature Control Mode, 2：Fan Mode, 3：Schedule Switch, 4：Status Report, 5：Filter Cleaning Reset, 6：Button Event2, 7：Temperature Unit Switch
					decoded.button_custom_function.mode2 = readUInt8(bytes, counterObj, 1);
				}
				if (button_custom_function_subcmd == 0x03) {
					// 0：System On/Off, 3：Schedule Switch, 4：Status Report, 5：Filter Cleaning Reset, 6：Button Event3, 7：Temperature Unit Switch
					decoded.button_custom_function.mode3 = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x72:
				decoded.children_lock_settings = decoded.children_lock_settings || {};
				// 0:disable, 1:enable
				decoded.children_lock_settings.enable = readUInt8(bytes, counterObj, 1);
				var bitOptions = readUInt16LE(bytes, counterObj, 2);
				decoded.children_lock_settings.temp_up = extractBits(bitOptions, 0, 1);
				decoded.children_lock_settings.temp_down = extractBits(bitOptions, 1, 2);
				decoded.children_lock_settings.system_on_off = extractBits(bitOptions, 2, 3);
				decoded.children_lock_settings.fan_mode = extractBits(bitOptions, 3, 4);
				decoded.children_lock_settings.temperature_control_mode = extractBits(bitOptions, 4, 5);
				decoded.children_lock_settings.reboot_reset = extractBits(bitOptions, 5, 6);
				decoded.children_lock_settings.power_on_off = extractBits(bitOptions, 6, 7);
				decoded.children_lock_settings.cancel_pair = extractBits(bitOptions, 7, 8);
				decoded.children_lock_settings.plan_switch = extractBits(bitOptions, 8, 9);
				decoded.children_lock_settings.status_report = extractBits(bitOptions, 9, 10);
				decoded.children_lock_settings.filter_clean_alarm_release = extractBits(bitOptions, 10, 11);
				decoded.children_lock_settings.button1_event = extractBits(bitOptions, 11, 12);
				decoded.children_lock_settings.button2_event = extractBits(bitOptions, 12, 13);
				decoded.children_lock_settings.button3_event = extractBits(bitOptions, 13, 14);
				decoded.children_lock_settings.temperature_unit_switch = extractBits(bitOptions, 14, 15);
				decoded.children_lock_settings.reserved = extractBits(bitOptions, 15, 16);
				break;
			case 0x81:
				decoded.unlock_button = decoded.unlock_button || {};
				// 0：disable, 1：enable
				decoded.unlock_button.enable = readUInt8(bytes, counterObj, 1);
				decoded.unlock_button.timeout = readUInt16LE(bytes, counterObj, 2);
				break;
			case 0x80:
				decoded.unlock_combination_button_settings = decoded.unlock_combination_button_settings || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0：disable, 1：enable
				decoded.unlock_combination_button_settings.button1 = extractBits(bitOptions, 0, 1);
				// 0：disable, 1：enable
				decoded.unlock_combination_button_settings.button2 = extractBits(bitOptions, 1, 2);
				// 0：disable, 1：enable
				decoded.unlock_combination_button_settings.button3 = extractBits(bitOptions, 2, 3);
				// 0：disable, 1：enable
				decoded.unlock_combination_button_settings.button4 = extractBits(bitOptions, 3, 4);
				// 0：disable, 1：enable
				decoded.unlock_combination_button_settings.button5 = extractBits(bitOptions, 4, 5);
				decoded.unlock_combination_button_settings.reserved = extractBits(bitOptions, 5, 8);
				break;
			case 0x62:
				// 0：disable, 1：enable
				decoded.intelligent_display_enable = readUInt8(bytes, counterObj, 1);
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
			case 0x76:
				decoded.temperature_calibration_settings = decoded.temperature_calibration_settings || {};
				// 0：disable, 1：enable
				decoded.temperature_calibration_settings.enable = readUInt8(bytes, counterObj, 1);
				decoded.temperature_calibration_settings.calibration_value = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x77:
				decoded.humidity_calibration_settings = decoded.humidity_calibration_settings || {};
				// 0：disable, 1：enable
				decoded.humidity_calibration_settings.enable = readUInt8(bytes, counterObj, 1);
				decoded.humidity_calibration_settings.calibration_value = readInt16LE(bytes, counterObj, 2) / 10;
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
					schedule_settings_item.content1 = schedule_settings_item.content1 || {};
					// 0：heat, 1：em heat, 2：cool, 3：auto, 10：off
					schedule_settings_item.content1.tstat_mode = readUInt8(bytes, counterObj, 1);
					schedule_settings_item.content1.heat_target_temperature = readInt16LE(bytes, counterObj, 2) / 100;
					schedule_settings_item.content1.em_heat_target_temperature = readInt16LE(bytes, counterObj, 2) / 100;
					schedule_settings_item.content1.cool_target_temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (schedule_settings_item_command == 0x04) {
					schedule_settings_item.content2 = schedule_settings_item.content2 || {};
					// 0：auto, 1：circulate, 2：on, 3：low, 4：medium, 5：high, 10：off
					schedule_settings_item.content2.fan_mode = readUInt8(bytes, counterObj, 1);
					schedule_settings_item.content2.auto_target_temperature = readInt16LE(bytes, counterObj, 2) / 100;
					schedule_settings_item.content2.auto_heat_target_temperature = readInt16LE(bytes, counterObj, 2) / 100;
					schedule_settings_item.content2.auto_cool_target_temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				break;
			case 0x59:
				decoded.system_status_control = decoded.system_status_control || {};
				// 0：system close, 1：system open
				decoded.system_status_control.on_off = readUInt8(bytes, counterObj, 1);
				// 0：heat, 1：em heat, 2：cool, 3：auto, 4：dehumidify, 5：ventilation
				decoded.system_status_control.mode = readUInt8(bytes, counterObj, 1);
				decoded.system_status_control.temperature1 = readInt16LE(bytes, counterObj, 2) / 100;
				decoded.system_status_control.temperature2 = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x86:
				decoded.origin_temperature = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x87:
				decoded.origin_humidity = readUInt16LE(bytes, counterObj, 2) / 10;
				break;
			case 0x5c:
				decoded.insert_temporary_plan = decoded.insert_temporary_plan || {};
				decoded.insert_temporary_plan.id = readUInt8(bytes, counterObj, 1);
				break;
			case 0x55:
				decoded.fan_error_alarm = decoded.fan_error_alarm || {};
				// 0：clean alarm, 1：trigger alarm
				decoded.fan_error_alarm.mode = readUInt8(bytes, counterObj, 1);
				break;
			case 0x5b:
				decoded.filter_clean_alarm = decoded.filter_clean_alarm || {};
				// 0：clean alarm, 1：report alarm
				decoded.filter_clean_alarm.mode = readUInt8(bytes, counterObj, 1);
				break;
			case 0x57:
				decoded.frost_protection_alarm = decoded.frost_protection_alarm || {};
				// 0：clean alarm, 1：trigger alarm
				decoded.frost_protection_alarm.mode = readUInt8(bytes, counterObj, 1);
				break;
			case 0x5a:
				decoded.open_window_alarm = decoded.open_window_alarm || {};
				// 0：clean alarm, 1：report alarm
				decoded.open_window_alarm.mode = readUInt8(bytes, counterObj, 1);
				break;
			case 0x58:
				decoded.not_wired_alarm = decoded.not_wired_alarm || {};
				// 0：clean alarm, 1：trigger alarm
				decoded.not_wired_alarm.mode = readUInt8(bytes, counterObj, 1);
				break;
			case 0xbe:
				decoded.reboot = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0xb9:
				decoded.query_device_status = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0xb8:
				decoded.synchronize_time = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0xb6:
				decoded.reconnect = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0x5f:
				decoded.delete_task_plan = decoded.delete_task_plan || {};
				// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8, 255：Reset All
				decoded.delete_task_plan.type = readUInt8(bytes, counterObj, 1);
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
		  "55": "fan_error_alarm",
		  "57": "frost_protection_alarm",
		  "58": "not_wired_alarm",
		  "59": "system_status_control",
		  "60": "collection_interval",
		  "61": "reporting_interval",
		  "62": "intelligent_display_enable",
		  "63": "temperature_unit",
		  "64": "mode_enable",
		  "65": "target_temperature_mode",
		  "66": "target_temperature_resolution",
		  "67": "system_status",
		  "68": "temperature_control_mode",
		  "69": "target_temperature_settings",
		  "71": "button_custom_function",
		  "72": "children_lock_settings",
		  "74": "fan_control_mode",
		  "75": "screen_display_settings",
		  "76": "temperature_calibration_settings",
		  "77": "humidity_calibration_settings",
		  "80": "unlock_combination_button_settings",
		  "81": "unlock_button",
		  "82": "pir_common",
		  "83": "pir_energy",
		  "84": "pir_night",
		  "85": "ble_enable",
		  "86": "origin_temperature",
		  "87": "origin_humidity",
		  "88": "fan_enable",
		  "6000": "collection_interval.seconds_of_time",
		  "6001": "collection_interval.minutes_of_time",
		  "6100": "reporting_interval.ble",
		  "6101": "reporting_interval.lora",
		  "6102": "reporting_interval.ble_lora",
		  "6103": "reporting_interval.power_lora",
		  "6800": "temperature_control_mode.mode",
		  "6801": "temperature_control_mode.plan_mode_enable",
		  "6900": "target_temperature_settings.heat",
		  "6901": "target_temperature_settings.em_heat",
		  "6902": "target_temperature_settings.cool",
		  "6903": "target_temperature_settings.auto",
		  "6904": "target_temperature_settings.auto_heat",
		  "6905": "target_temperature_settings.auto_cool",
		  "7100": "button_custom_function.enable",
		  "7101": "button_custom_function.mode1",
		  "7102": "button_custom_function.mode2",
		  "7103": "button_custom_function.mode3",
		  "8201": "pir_common.enable",
		  "8202": "pir_common.release_time",
		  "8203": "pir_common.mode",
		  "8204": "pir_common.check",
		  "8301": "pir_energy.enable",
		  "8302": "pir_energy.plan",
		  "8401": "pir_night.enable",
		  "8402": "pir_night.mode",
		  "8403": "pir_night.check",
		  "8404": "pir_night.night_time",
		  "8405": "pir_night.occupied",
		  "610000": "reporting_interval.ble.seconds_of_time",
		  "610001": "reporting_interval.ble.minutes_of_time",
		  "610100": "reporting_interval.lora.seconds_of_time",
		  "610101": "reporting_interval.lora.minutes_of_time",
		  "610200": "reporting_interval.ble_lora.seconds_of_time",
		  "610201": "reporting_interval.ble_lora.minutes_of_time",
		  "610300": "reporting_interval.power_lora.seconds_of_time",
		  "610301": "reporting_interval.power_lora.minutes_of_time",
		  "ff": "request_check_sequence_number",
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
		  "d8": "product_frequency_band",
		  "d5": "ble_phone_name",
		  "00": "battery",
		  "01": "temperature",
		  "02": "humidity",
		  "08": "pir_status",
		  "03": "temperature_mode",
		  "06": "target_temperature1",
		  "07": "target_temperature2",
		  "04": "fan_mode",
		  "05": "execution_plan_id",
		  "0b": "temperature_alarm",
		  "0c": "humidity_alarm",
		  "09": "ble_event",
		  "0a": "power_bus_event",
		  "0d": "key_event",
		  "0d00": "key_event.f1",
		  "0d01": "key_event.f2",
		  "0d02": "key_event.f3",
		  "0f": "battery_event",
		  "8d": "communication_mode",
		  "6c": "communicate_interval",
		  "6c00": "communicate_interval.ble",
		  "6c0000": "communicate_interval.ble.seconds_of_time",
		  "6c0001": "communicate_interval.ble.minutes_of_time",
		  "6c01": "communicate_interval.lora",
		  "6c0100": "communicate_interval.lora.seconds_of_time",
		  "6c0101": "communicate_interval.lora.minutes_of_time",
		  "6c02": "communicate_interval.ble_lora",
		  "6c0200": "communicate_interval.ble_lora.seconds_of_time",
		  "6c0201": "communicate_interval.ble_lora.minutes_of_time",
		  "6c03": "communicate_interval.power_bus",
		  "6c0300": "communicate_interval.power_bus.seconds_of_time",
		  "6c0301": "communicate_interval.power_bus.minutes_of_time",
		  "c8": "device_status",
		  "7d": "data_sync_to_peer",
		  "7e": "data_sync_timeout",
		  "8b": "ble_name",
		  "6a": "minimum_dead_zone",
		  "6b": "target_temperature_range",
		  "6b00": "target_temperature_range.heat",
		  "6b01": "target_temperature_range.em_heat",
		  "6b02": "target_temperature_range.cool",
		  "6b03": "target_temperature_range.auto",
		  "c7": "time_zone",
		  "c6": "daylight_saving_time",
		  "7b": "schedule_settings",
		  "7bxx": "schedule_settings._item",
		  "7bxx00": "schedule_settings._item.enable",
		  "7bxx01": "schedule_settings._item.name_first",
		  "7bxx02": "schedule_settings._item.name_last",
		  "7bxx03": "schedule_settings._item.content1",
		  "7bxx04": "schedule_settings._item.content2",
		  "5c": "insert_temporary_plan",
		  "5b": "filter_clean_alarm",
		  "5a": "open_window_alarm",
		  "be": "reboot",
		  "b9": "query_device_status",
		  "b8": "synchronize_time",
		  "b6": "reconnect",
		  "5f": "delete_task_plan"
	};
}
function processTemperature(decoded) {
	var allTemperatureProperties = {
    "temperature": {
        "precision": 1
    },
    "target_temperature1": {
        "precision": 1
    },
    "target_temperature2": {
        "precision": 1
    },
    "target_temperature_settings.heat": {
        "precision": null
    },
    "target_temperature_settings.em_heat": {
        "precision": null
    },
    "target_temperature_settings.cool": {
        "precision": null
    },
    "target_temperature_settings.auto": {
        "precision": null
    },
    "target_temperature_settings.auto_heat": {
        "precision": null
    },
    "target_temperature_settings.auto_cool": {
        "precision": null
    },
    "minimum_dead_zone": {
        "precision": 1
    },
    "target_temperature_range.heat.min": {
        "precision": 1
    },
    "target_temperature_range.heat.max": {
        "precision": 1
    },
    "target_temperature_range.em_heat.min": {
        "precision": 1
    },
    "target_temperature_range.em_heat.max": {
        "precision": 1
    },
    "target_temperature_range.cool.min": {
        "precision": 1
    },
    "target_temperature_range.cool.max": {
        "precision": 1
    },
    "target_temperature_range.auto.min": {
        "precision": 1
    },
    "target_temperature_range.auto.max": {
        "precision": 1
    },
    "temperature_calibration_settings.calibration_value": {
        "precision": 2
    },
    "schedule_settings._item.content1.heat_target_temperature": {
        "precision": 1
    },
    "schedule_settings._item.content1.em_heat_target_temperature": {
        "precision": 1
    },
    "schedule_settings._item.content1.cool_target_temperature": {
        "precision": 1
    },
    "schedule_settings._item.content2.auto_target_temperature": {
        "precision": 1
    },
    "schedule_settings._item.content2.auto_heat_target_temperature": {
        "precision": 1
    },
    "schedule_settings._item.content2.auto_cool_target_temperature": {
        "precision": 1
    },
    "origin_temperature": {
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