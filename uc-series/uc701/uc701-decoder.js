/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product UC701
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
				decoded.check_order_reply = decoded.check_order_reply || {};
				decoded.check_order_reply.order = readUInt8(bytes, counterObj, 1);
				break;
			case 0xfd:
				decoded.security_password_check_reply = decoded.security_password_check_reply || {};
				// 0：success, 1：failed
				decoded.security_password_check_reply.result = readUInt8(bytes, counterObj, 1);
				if (decoded.security_password_check_reply.result == 0x00) {
					decoded.security_password_check_reply.successful_message = decoded.security_password_check_reply.successful_message || {};
				}
				if (decoded.security_password_check_reply.result == 0x01) {
					decoded.security_password_check_reply.failed_message = decoded.security_password_check_reply.failed_message || {};
					decoded.security_password_check_reply.failed_message.locked_time = readUInt32LE(bytes, counterObj, 3);
				}
				break;
			case 0xfc:
				decoded.security_password_change_reply = decoded.security_password_change_reply || {};
				// 0：success, 1：failed, 2：length error
				decoded.security_password_change_reply.result = readUInt8(bytes, counterObj, 1);
				break;
			case 0xfb:
				decoded.password_check_reply = decoded.password_check_reply || {};
				// 0：success, 1：error, 2：locked
				decoded.password_check_reply.result = readUInt8(bytes, counterObj, 1);
				break;
			case 0xfa:
				decoded.password_change_reply = decoded.password_change_reply || {};
				// 0：success, 1：failed
				decoded.password_change_reply.result = readUInt8(bytes, counterObj, 1);
				break;
			case 0xf7:
				decoded.firmware_upgrade_reply = decoded.firmware_upgrade_reply || {};
				var firmware_upgrade_reply_command = readUInt8(bytes, counterObj, 1);
				if (firmware_upgrade_reply_command == 0x00) {
					decoded.firmware_upgrade_reply.start_upgrade = decoded.firmware_upgrade_reply.start_upgrade || {};
					// 0：success, 1：failed, 2：resend
					decoded.firmware_upgrade_reply.start_upgrade.result = readUInt8(bytes, counterObj, 1);
					decoded.firmware_upgrade_reply.start_upgrade.length = readUInt16LE(bytes, counterObj, 2);
				}
				if (firmware_upgrade_reply_command == 0x01) {
					decoded.firmware_upgrade_reply.transmission = decoded.firmware_upgrade_reply.transmission || {};
					// 0：success, 1：failed
					decoded.firmware_upgrade_reply.transmission.result = readUInt8(bytes, counterObj, 1);
				}
				if (firmware_upgrade_reply_command == 0x02) {
					decoded.firmware_upgrade_reply.end_upgrade = decoded.firmware_upgrade_reply.end_upgrade || {};
					// 0：success, 1：failed
					decoded.firmware_upgrade_reply.end_upgrade.result = readUInt8(bytes, counterObj, 1);
				}
				if (firmware_upgrade_reply_command == 0x03) {
					decoded.firmware_upgrade_reply.continue_upgrade = decoded.firmware_upgrade_reply.continue_upgrade || {};
					// 0：success, 1：failed
					decoded.firmware_upgrade_reply.continue_upgrade.result = readUInt8(bytes, counterObj, 1);
				}
				if (firmware_upgrade_reply_command == 0x04) {
					decoded.firmware_upgrade_reply.completion_check = decoded.firmware_upgrade_reply.completion_check || {};
					// 0：success, 1：failed
					decoded.firmware_upgrade_reply.completion_check.result = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0xf6:
				decoded.preconfiguration_reply = decoded.preconfiguration_reply || {};
				var preconfiguration_reply_command = readUInt8(bytes, counterObj, 1);
				if (preconfiguration_reply_command == 0x00) {
					decoded.preconfiguration_reply.start_writing = decoded.preconfiguration_reply.start_writing || {};
					// 0：success, 1：failed
					decoded.preconfiguration_reply.start_writing.result = readUInt8(bytes, counterObj, 1);
					decoded.preconfiguration_reply.start_writing.length = readUInt16LE(bytes, counterObj, 2);
				}
				if (preconfiguration_reply_command == 0x01) {
					decoded.preconfiguration_reply.configuration_writing = decoded.preconfiguration_reply.configuration_writing || {};
					// 0：success, 1：failed
					decoded.preconfiguration_reply.configuration_writing.result = readUInt8(bytes, counterObj, 1);
				}
				if (preconfiguration_reply_command == 0x02) {
					decoded.preconfiguration_reply.end_writing = decoded.preconfiguration_reply.end_writing || {};
					// 0：success, 1：failed
					decoded.preconfiguration_reply.end_writing.result = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0xf5:
				decoded.historical_data_export_reply = decoded.historical_data_export_reply || {};
				var historical_data_export_reply_command = readUInt8(bytes, counterObj, 1);
				if (historical_data_export_reply_command == 0x10) {
					decoded.historical_data_export_reply.start_exporting = decoded.historical_data_export_reply.start_exporting || {};
					decoded.historical_data_export_reply.start_exporting.quantity_of_data = readUInt16LE(bytes, counterObj, 2);
					decoded.historical_data_export_reply.start_exporting.length = readUInt16LE(bytes, counterObj, 2);
					decoded.historical_data_export_reply.start_exporting.max_length = readUInt16LE(bytes, counterObj, 2);
				}
				if (historical_data_export_reply_command == 0x11) {
					decoded.historical_data_export_reply.exported_data = decoded.historical_data_export_reply.exported_data || {};
					decoded.historical_data_export_reply.exported_data.length = readUInt16LE(bytes, counterObj, 2);
					decoded.historical_data_export_reply.exported_data.data = readBytes(bytes, counterObj, decoded.historical_data_export_reply.exported_data.length);
				}
				if (historical_data_export_reply_command == 0x12) {
					decoded.historical_data_export_reply.end_exporting = decoded.historical_data_export_reply.end_exporting || {};
					// 0：success, 1：failed
					decoded.historical_data_export_reply.end_exporting.result = readUInt8(bytes, counterObj, 1);
				}
				if (historical_data_export_reply_command == 0x13) {
					decoded.historical_data_export_reply.exported_all_data = decoded.historical_data_export_reply.exported_all_data || {};
				}
				if (historical_data_export_reply_command == 0x14) {
					decoded.historical_data_export_reply.start_exporting_with_type = decoded.historical_data_export_reply.start_exporting_with_type || {};
					decoded.historical_data_export_reply.start_exporting_with_type.quantity_of_data = readUInt16LE(bytes, counterObj, 2);
					decoded.historical_data_export_reply.start_exporting_with_type.length = readUInt16LE(bytes, counterObj, 2);
					decoded.historical_data_export_reply.start_exporting_with_type.max_length = readUInt16LE(bytes, counterObj, 2);
				}
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
			case 0xed:
				if (history.length === 0) {
					for (var k in decoded) {
						if (decoded.hasOwnProperty(k)) {
							result[k] = decoded[k];
						}
					}
				}
				decoded = {};
				// skip type
				readUInt8(bytes, counterObj, 1);
				decoded.timestamp = readUInt32LE(bytes, counterObj, 4);
				history.push(decoded);
				break;
			case 0xec:
				decoded.ipso_device_upgrade_result = decoded.ipso_device_upgrade_result || {};
				// 0: Upgrade Successfully, 1: URL Error, 2: Download Failed, 3: Packet Too Big, 4: Version Error, 5: Device Error, 6: Patch Format Error, 7: CRC Check Failed, 8: Product Error, 9: Patch Upgrade Failed, 255: Upgrade Pending
				decoded.ipso_device_upgrade_result.value = readUInt8(bytes, counterObj, 1);
				break;
			case 0xeb:
				decoded.debugging_commands = decoded.debugging_commands || {};
				decoded.debugging_commands.length = readUInt16LE(bytes, counterObj, 2);
				decoded.debugging_commands.content = readString(bytes, counterObj, decoded.debugging_commands.length);
				break;
			case 0xcf:
				decoded.lorawan_configuration_settings = decoded.lorawan_configuration_settings || {};
				var lorawan_configuration_settings_command = readUInt8(bytes, counterObj, 1);
				if (lorawan_configuration_settings_command == 0x0b) {
					decoded.lorawan_configuration_settings.deveui = readHexString(bytes, counterObj, 8);
				}
				if (lorawan_configuration_settings_command == 0x13) {
					decoded.lorawan_configuration_settings.appeui = readHexString(bytes, counterObj, 8);
				}
				if (lorawan_configuration_settings_command == 0x03) {
					decoded.lorawan_configuration_settings.netid = readHexString(bytes, counterObj, 3);
				}
				if (lorawan_configuration_settings_command == 0x5c) {
					decoded.lorawan_configuration_settings.app_port = readUInt8(bytes, counterObj, 1);
				}
				if (lorawan_configuration_settings_command == 0xd8) {
					// 1：1.0.2, 2：1.0.3, 3：1.0.3, 4：1.0.4
					decoded.lorawan_configuration_settings.version = readUInt8(bytes, counterObj, 1);
				}
				if (lorawan_configuration_settings_command == 0x00) {
					// 0:ClassA, 1:ClassB, 2:ClassC, 3:ClassC to B
					decoded.lorawan_configuration_settings.mode = readUInt8(bytes, counterObj, 1);
				}
				if (lorawan_configuration_settings_command == 0x5d) {
					// 0：disable, 1：enable
					decoded.lorawan_configuration_settings.confirmed_mode = readUInt8(bytes, counterObj, 1);
				}
				if (lorawan_configuration_settings_command == 0xc6) {
					decoded.lorawan_configuration_settings.ack_retry_times = readUInt8(bytes, counterObj, 1);
				}
				if (lorawan_configuration_settings_command == 0x01) {
					// 0：ABP, 1：OTAA
					decoded.lorawan_configuration_settings.join_type = readUInt8(bytes, counterObj, 1);
				}
				if (lorawan_configuration_settings_command == 0x07) {
					decoded.lorawan_configuration_settings.devaddr = readHexString(bytes, counterObj, 4);
				}
				if (lorawan_configuration_settings_command == 0xda) {
					// 0：disable, 1：enable
					decoded.lorawan_configuration_settings.rejoin_mode_enable = readUInt8(bytes, counterObj, 1);
				}
				if (lorawan_configuration_settings_command == 0xd9) {
					decoded.lorawan_configuration_settings.number_of_link_detection_signals = readUInt8(bytes, counterObj, 1);
				}
				if (lorawan_configuration_settings_command == 0xcd) {
					// 0：CN470, 2：AS923, 3：AU915, 4：EU868, 5：KR920, 6：IN865, 7：US915, 10：RU864
					decoded.lorawan_configuration_settings.frequency_band = readUInt8(bytes, counterObj, 1);
				}
				if (lorawan_configuration_settings_command == 0xdc) {
					// 0：AS923-1, 1：AS923-2, 2：AS923-3, 3：AS923-4
					decoded.lorawan_configuration_settings.AS923_frequency_band_in_use = readUInt8(bytes, counterObj, 1);
				}
				if (lorawan_configuration_settings_command == 0x5e) {
					decoded.lorawan_configuration_settings.channel_mask = readHexString(bytes, counterObj, 12);
				}
				if (lorawan_configuration_settings_command == 0x6a) {
					decoded.lorawan_configuration_settings.channels_settings = decoded.lorawan_configuration_settings.channels_settings || [];
					var index = readUInt8(bytes, counterObj, 1);
					var channels_settings_item = pickArrayItem(decoded.lorawan_configuration_settings.channels_settings, index, 'index');
					channels_settings_item.index = index;
					insertArrayItem(decoded.lorawan_configuration_settings.channels_settings, channels_settings_item, 'index');
					// 0：disable, 1：enable
					channels_settings_item.enable = readUInt8(bytes, counterObj, 1);
					channels_settings_item.frequency = readUInt32LE(bytes, counterObj, 4) / 1000000;
					var bitOptions = readUInt8(bytes, counterObj, 1);
					// 0：DR0(SF12,125kHz), 1：DR1(SF11,125kHz), 2：DR2(SF10,125kHz), 3：DR3(SF9,125kHz), 4：DR4(SF8,125kHz), 5：DR5(SF7,125kHz)
					channels_settings_item.data_rate_max = extractBits(bitOptions, 4, 8);
					// 0：DR0(SF12,125kHz), 1：DR1(SF11,125kHz), 2：DR2(SF10,125kHz), 3：DR3(SF9,125kHz), 4：DR4(SF8,125kHz), 5：DR5(SF7,125kHz)
					channels_settings_item.data_rate_min = extractBits(bitOptions, 0, 4);
				}
				if (lorawan_configuration_settings_command == 0x02) {
					// 0：disable, 1：enable
					decoded.lorawan_configuration_settings.adr_mode = readUInt8(bytes, counterObj, 1);
				}
				if (lorawan_configuration_settings_command == 0xba) {
					// 0：DR0(SF12,125kHz), 1：DR1(SF11,125kHz), 2：DR2(SF10,125kHz), 3：DR3(SF9,125kHz), 4：DR4(SF8,125kHz), 5：DR5(SF7,125kHz)
					decoded.lorawan_configuration_settings.tx_data_rate = readUInt8(bytes, counterObj, 1);
				}
				if (lorawan_configuration_settings_command == 0x5b) {
					// 0：TXPOWER0-16dBm, 1：TXPOWER1-14dBm, 2：TXPOWER2-12dBm, 3：TXPOWER3-10dBm, 4：TXPOWER4-8dBm, 5：TXPOWER5-6dBm, 6：TXPOWER6-4dBm, 7：TXPOWER7-2dBm
					decoded.lorawan_configuration_settings.tx_power = readUInt8(bytes, counterObj, 1);
				}
				if (lorawan_configuration_settings_command == 0xbf) {
					// 0：DR0(SF12,125kHz), 1：DR1(SF11,125kHz), 2：DR2(SF10,125kHz), 3：DR3(SF9,125kHz), 4：DR4(SF8,125kHz), 5：DR5(SF7,125kHz)
					decoded.lorawan_configuration_settings.rx2_data_rate = readUInt8(bytes, counterObj, 1);
				}
				if (lorawan_configuration_settings_command == 0xbb) {
					decoded.lorawan_configuration_settings.rx2_frequency = readUInt32LE(bytes, counterObj, 4) / 1000000;
				}
				if (lorawan_configuration_settings_command == 0xdd) {
					// 0：1s, 1：2s, 2：4s, 3：8s, 4：16s, 5：32s, 6：64s, 7：128s
					decoded.lorawan_configuration_settings.pingslot_periodicity = readUInt8(bytes, counterObj, 1);
				}
				if (lorawan_configuration_settings_command == 0x4b) {
					decoded.lorawan_configuration_settings.rx1_open_delay = readUInt32LE(bytes, counterObj, 4) / 1000;
				}
				if (lorawan_configuration_settings_command == 0x4f) {
					decoded.lorawan_configuration_settings.rx2_open_delay = readUInt32LE(bytes, counterObj, 4) / 1000;
				}
				if (lorawan_configuration_settings_command == 0x53) {
					decoded.lorawan_configuration_settings.join_rx1_open_delay = readUInt32LE(bytes, counterObj, 4) / 1000;
				}
				if (lorawan_configuration_settings_command == 0x57) {
					decoded.lorawan_configuration_settings.join_rx2_open_delay = readUInt32LE(bytes, counterObj, 4) / 1000;
				}
				if (lorawan_configuration_settings_command == 0xf9) {
					decoded.lorawan_configuration_settings.multicast_group_settings = decoded.lorawan_configuration_settings.multicast_group_settings || {};
					var lorawan_configuration_settings_multicast_group_settings_command = readUInt8(bytes, counterObj, 1);
					if (lorawan_configuration_settings_multicast_group_settings_command == 0x0d) {
						// 0：disable, 1：enable
						decoded.lorawan_configuration_settings.multicast_group_settings.group_1_enable = readUInt8(bytes, counterObj, 1);
					}
					if (lorawan_configuration_settings_multicast_group_settings_command == 0x14) {
						decoded.lorawan_configuration_settings.multicast_group_settings.group_1_devaddr = readHexString(bytes, counterObj, 4);
					}
					if (lorawan_configuration_settings_multicast_group_settings_command == 0x0e) {
						// 0：1s, 1：2s, 2：4s, 3：8s, 4：16s, 5：32s, 6：64s, 7：128s
						decoded.lorawan_configuration_settings.multicast_group_settings.group_1_pingslot_periodicity = readUInt8(bytes, counterObj, 1);
					}
					if (lorawan_configuration_settings_multicast_group_settings_command == 0x0f) {
						// 0：DR0(SF12,125kHz), 1：DR1(SF11,125kHz), 2：DR2(SF10,125kHz), 3：DR3(SF9,125kHz), 4：DR4(SF8,125kHz), 5：DR5(SF7,125kHz)
						decoded.lorawan_configuration_settings.multicast_group_settings.group_1_data_rate = readUInt8(bytes, counterObj, 1);
					}
					if (lorawan_configuration_settings_multicast_group_settings_command == 0x10) {
						decoded.lorawan_configuration_settings.multicast_group_settings.group_1_frequency = readUInt32LE(bytes, counterObj, 4) / 1000000;
					}
					if (lorawan_configuration_settings_multicast_group_settings_command == 0x3a) {
						// 0：disable, 1：enable
						decoded.lorawan_configuration_settings.multicast_group_settings.group_2_enable = readUInt8(bytes, counterObj, 1);
					}
					if (lorawan_configuration_settings_multicast_group_settings_command == 0x41) {
						decoded.lorawan_configuration_settings.multicast_group_settings.group_2_devaddr = readHexString(bytes, counterObj, 4);
					}
					if (lorawan_configuration_settings_multicast_group_settings_command == 0x3b) {
						// 0：1s, 1：2s, 2：4s, 3：8s, 4：16s, 5：32s, 6：64s, 7：128s
						decoded.lorawan_configuration_settings.multicast_group_settings.group_2_pingslot_periodicity = readUInt8(bytes, counterObj, 1);
					}
					if (lorawan_configuration_settings_multicast_group_settings_command == 0x3c) {
						// 0：DR0(SF12,125kHz), 1：DR1(SF11,125kHz), 2：DR2(SF10,125kHz), 3：DR3(SF9,125kHz), 4：DR4(SF8,125kHz), 5：DR5(SF7,125kHz)
						decoded.lorawan_configuration_settings.multicast_group_settings.group_2_data_rate = readUInt8(bytes, counterObj, 1);
					}
					if (lorawan_configuration_settings_multicast_group_settings_command == 0x3d) {
						decoded.lorawan_configuration_settings.multicast_group_settings.group_2_frequency = readUInt32LE(bytes, counterObj, 4) / 1000000;
					}
					if (lorawan_configuration_settings_multicast_group_settings_command == 0x67) {
						// 0：disable, 1：enable
						decoded.lorawan_configuration_settings.multicast_group_settings.group_3_enable = readUInt8(bytes, counterObj, 1);
					}
					if (lorawan_configuration_settings_multicast_group_settings_command == 0x6e) {
						decoded.lorawan_configuration_settings.multicast_group_settings.group_3_devaddr = readHexString(bytes, counterObj, 4);
					}
					if (lorawan_configuration_settings_multicast_group_settings_command == 0x68) {
						// 0：1s, 1：2s, 2：4s, 3：8s, 4：16s, 5：32s, 6：64s, 7：128s
						decoded.lorawan_configuration_settings.multicast_group_settings.group_3_pingslot_periodicity = readUInt8(bytes, counterObj, 1);
					}
					if (lorawan_configuration_settings_multicast_group_settings_command == 0x69) {
						// 0：DR0(SF12,125kHz), 1：DR1(SF11,125kHz), 2：DR2(SF10,125kHz), 3：DR3(SF9,125kHz), 4：DR4(SF8,125kHz), 5：DR5(SF7,125kHz)
						decoded.lorawan_configuration_settings.multicast_group_settings.group_3_data_rate = readUInt8(bytes, counterObj, 1);
					}
					if (lorawan_configuration_settings_multicast_group_settings_command == 0x6a) {
						decoded.lorawan_configuration_settings.multicast_group_settings.group_3_frequency = readUInt32LE(bytes, counterObj, 4) / 1000000;
					}
					if (lorawan_configuration_settings_multicast_group_settings_command == 0x94) {
						// 0：disable, 1：enable
						decoded.lorawan_configuration_settings.multicast_group_settings.group_4_enable = readUInt8(bytes, counterObj, 1);
					}
					if (lorawan_configuration_settings_multicast_group_settings_command == 0x9b) {
						decoded.lorawan_configuration_settings.multicast_group_settings.group_4_devaddr = readHexString(bytes, counterObj, 4);
					}
					if (lorawan_configuration_settings_multicast_group_settings_command == 0x95) {
						// 0：1s, 1：2s, 2：4s, 3：8s, 4：16s, 5：32s, 6：64s, 7：128s
						decoded.lorawan_configuration_settings.multicast_group_settings.group_4_pingslot_periodicity = readUInt8(bytes, counterObj, 1);
					}
					if (lorawan_configuration_settings_multicast_group_settings_command == 0x96) {
						// 0：DR0(SF12,125kHz), 1：DR1(SF11,125kHz), 2：DR2(SF10,125kHz), 3：DR3(SF9,125kHz), 4：DR4(SF8,125kHz), 5：DR5(SF7,125kHz)
						decoded.lorawan_configuration_settings.multicast_group_settings.group_4_data_rate = readUInt8(bytes, counterObj, 1);
					}
					if (lorawan_configuration_settings_multicast_group_settings_command == 0x97) {
						decoded.lorawan_configuration_settings.multicast_group_settings.group_4_frequency = readUInt32LE(bytes, counterObj, 4) / 1000000;
					}
				}
				if (lorawan_configuration_settings_command == 0xc4) {
					// 0：disable, 1：enable
					decoded.lorawan_configuration_settings.duty_cycle_enable = readUInt8(bytes, counterObj, 1);
				}
				if (lorawan_configuration_settings_command == 0xc0) {
					decoded.lorawan_configuration_settings.duty_cycle = readUInt32LE(bytes, counterObj, 4);
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
			case 0xd7:
				decoded.device_info = decoded.device_info || {};
				decoded.device_info.model = readString(bytes, counterObj, 8);
				decoded.device_info.submodel_1 = readString(bytes, counterObj, 8);
				decoded.device_info.submodel_2 = readString(bytes, counterObj, 8);
				decoded.device_info.submodel_3 = readString(bytes, counterObj, 8);
				decoded.device_info.submodel_4 = readString(bytes, counterObj, 8);
				decoded.device_info.pn_1 = readString(bytes, counterObj, 8);
				decoded.device_info.pn_2 = readString(bytes, counterObj, 8);
				decoded.device_info.pn_3 = readString(bytes, counterObj, 8);
				decoded.device_info.pn_4 = readString(bytes, counterObj, 8);
				break;
			case 0xbf:
				decoded.lorawan_status = decoded.lorawan_status || {};
				var lorawan_status_command = readUInt8(bytes, counterObj, 1);
				if (lorawan_status_command == 0x00) {
					// 0：disconnect, 1：connect
					decoded.lorawan_status.join_status = readUInt8(bytes, counterObj, 1);
				}
				if (lorawan_status_command == 0x01) {
					decoded.lorawan_status.eui = readHexString(bytes, counterObj, 8);
				}
				if (lorawan_status_command == 0x02) {
					decoded.lorawan_status.signal = decoded.lorawan_status.signal || {};
					decoded.lorawan_status.signal.rssi = readInt16LE(bytes, counterObj, 2);
					decoded.lorawan_status.signal.snr = readInt8(bytes, counterObj, 1);
				}
				if (lorawan_status_command == 0x03) {
					decoded.lorawan_status.channel_mask = readHexString(bytes, counterObj, 12);
				}
				if (lorawan_status_command == 0x04) {
					decoded.lorawan_status.frame_counter = decoded.lorawan_status.frame_counter || {};
					decoded.lorawan_status.frame_counter.uplink = readUInt32LE(bytes, counterObj, 4);
					decoded.lorawan_status.frame_counter.downlink = readUInt32LE(bytes, counterObj, 4);
				}
				break;
			case 0xb9:
				decoded.device_time = decoded.device_time || {};
				decoded.device_time.current_time = readUInt32LE(bytes, counterObj, 4);
				decoded.device_time.running_time = readUInt32LE(bytes, counterObj, 4);
				decoded.device_time.power_on_time = readUInt32LE(bytes, counterObj, 4);
				break;
			case 0xb8:
				decoded.battery_info = decoded.battery_info || {};
				decoded.battery_info.battery_capacity = readUInt32LE(bytes, counterObj, 4) / 1000;
				decoded.battery_info.battery_consumption = readUInt32LE(bytes, counterObj, 4) / 1000;
				decoded.battery_info.battery_left = readUInt32LE(bytes, counterObj, 4) / 1000;
				decoded.battery_info.battery_voltage = readUInt16LE(bytes, counterObj, 2) / 1000;
				decoded.battery_info.current_battery_status = readHexString(bytes, counterObj, 2);
				break;
			case 0xd5:
				decoded.ble_phone_name = decoded.ble_phone_name || {};
				decoded.ble_phone_name.length = readUInt8(bytes, counterObj, 1);
				decoded.ble_phone_name.value = readString(bytes, counterObj, decoded.ble_phone_name.length);
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
				// 0：Reset BLE Name , 1：Cancel Pairing, 2：Trigger Pairing
				decoded.ble_server.type = readUInt8(bytes, counterObj, 1);
				break;
			case 0x00:
				decoded.battery = readUInt8(bytes, counterObj, 1);
				break;
			case 0x01:
				decoded.low_battery_alarm = decoded.low_battery_alarm || {};
				decoded.low_battery_alarm.value = readUInt8(bytes, counterObj, 1);
				decoded.battery = decoded.low_battery_alarm.value;
				break;
			case 0x02:
				decoded.temperature_alarm = decoded.temperature_alarm || {};
				decoded.temperature_alarm.type = readUInt8(bytes, counterObj, 1);
				if (decoded.temperature_alarm.type == 0x00) {
					decoded.temperature_alarm.open_window_alarm_deactivation = decoded.temperature_alarm.open_window_alarm_deactivation || {};
					decoded.temperature_alarm.open_window_alarm_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (decoded.temperature_alarm.type == 0x01) {
					decoded.temperature_alarm.open_window_alarm_trigger = decoded.temperature_alarm.open_window_alarm_trigger || {};
					decoded.temperature_alarm.open_window_alarm_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (decoded.temperature_alarm.type == 0x20) {
					decoded.temperature_alarm.over_range_alarm_trigger = decoded.temperature_alarm.over_range_alarm_trigger || {};
					decoded.temperature_alarm.over_range_alarm_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (decoded.temperature_alarm.type == 0x21) {
					decoded.temperature_alarm.over_range_alarm_deactivation = decoded.temperature_alarm.over_range_alarm_deactivation || {};
					decoded.temperature_alarm.over_range_alarm_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (decoded.temperature_alarm.type == 0x22) {
					decoded.temperature_alarm.lower_range_alarm_trigger = decoded.temperature_alarm.lower_range_alarm_trigger || {};
					decoded.temperature_alarm.lower_range_alarm_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (decoded.temperature_alarm.type == 0x23) {
					decoded.temperature_alarm.lower_range_alarm_deactivation = decoded.temperature_alarm.lower_range_alarm_deactivation || {};
					decoded.temperature_alarm.lower_range_alarm_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (decoded.temperature_alarm.type == 0x24) {
					decoded.temperature_alarm.within_range_alarm_trigger = decoded.temperature_alarm.within_range_alarm_trigger || {};
					decoded.temperature_alarm.within_range_alarm_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (decoded.temperature_alarm.type == 0x25) {
					decoded.temperature_alarm.within_range_alarm_deactivation = decoded.temperature_alarm.within_range_alarm_deactivation || {};
					decoded.temperature_alarm.within_range_alarm_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (decoded.temperature_alarm.type == 0x26) {
					decoded.temperature_alarm.outside_range_alarm_trigger = decoded.temperature_alarm.outside_range_alarm_trigger || {};
					decoded.temperature_alarm.outside_range_alarm_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (decoded.temperature_alarm.type == 0x27) {
					decoded.temperature_alarm.outside_range_alarm_deactivation = decoded.temperature_alarm.outside_range_alarm_deactivation || {};
					decoded.temperature_alarm.outside_range_alarm_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (decoded.temperature_alarm.type == 0x30) {
					decoded.temperature_alarm.persistent_low_temp_deactivation = decoded.temperature_alarm.persistent_low_temp_deactivation || {};
					decoded.temperature_alarm.persistent_low_temp_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (decoded.temperature_alarm.type == 0x31) {
					decoded.temperature_alarm.persistent_low_temp_trigger = decoded.temperature_alarm.persistent_low_temp_trigger || {};
					decoded.temperature_alarm.persistent_low_temp_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (decoded.temperature_alarm.type == 0x40) {
					decoded.temperature_alarm.persistent_high_temp_deactivation = decoded.temperature_alarm.persistent_high_temp_deactivation || {};
					decoded.temperature_alarm.persistent_high_temp_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (decoded.temperature_alarm.type == 0x41) {
					decoded.temperature_alarm.persistent_high_temp_trigger = decoded.temperature_alarm.persistent_high_temp_trigger || {};
					decoded.temperature_alarm.persistent_high_temp_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				break;
			case 0x03:
				decoded.sensor_error = decoded.sensor_error || {};
				decoded.sensor_error.type = readUInt8(bytes, counterObj, 1);
				if (decoded.sensor_error.type == 0x00) {
					decoded.sensor_error.internal_sensor_collect_error = decoded.sensor_error.internal_sensor_collect_error || {};
				}
				if (decoded.sensor_error.type == 0xf0) {
					decoded.sensor_error.external_sensor_collect_error = decoded.sensor_error.external_sensor_collect_error || {};
				}
				if (decoded.sensor_error.type == 0x01) {
					decoded.sensor_error.internal_sensor_lower_ranger_error = decoded.sensor_error.internal_sensor_lower_ranger_error || {};
				}
				if (decoded.sensor_error.type == 0xf1) {
					decoded.sensor_error.external_sensor_lower_ranger_error = decoded.sensor_error.external_sensor_lower_ranger_error || {};
				}
				if (decoded.sensor_error.type == 0x02) {
					decoded.sensor_error.internal_sensor_over_ranger_error = decoded.sensor_error.internal_sensor_over_ranger_error || {};
				}
				if (decoded.sensor_error.type == 0xf2) {
					decoded.sensor_error.external_sensor_over_ranger_error = decoded.sensor_error.external_sensor_over_ranger_error || {};
				}
				break;
			case 0x04:
				decoded.infrared_cmd_status = decoded.infrared_cmd_status || {};
				decoded.infrared_cmd_status.cmd = decoded.infrared_cmd_status.cmd || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0: Switch Off, 1: Switch On
				decoded.infrared_cmd_status.cmd.switch = extractBits(bitOptions, 0, 1);
				// 0：heat, 1：em heat, 2：cool, 3：auto, 4：dehumidify, 5：ventilate
				decoded.infrared_cmd_status.cmd.mode = extractBits(bitOptions, 1, 4);
				// 0：Auto, 1：Ventilation, 2：Always Open, 3：Low, 4：Medium, 5：High, 255：Disabled
				decoded.infrared_cmd_status.cmd.air_volume = extractBits(bitOptions, 4, 7);
				// 0: Command, 1: Local
				decoded.infrared_cmd_status.cmd.cmd_type = extractBits(bitOptions, 7, 8);
				decoded.infrared_cmd_status.cmd.control_word = decoded.infrared_cmd_status.cmd.control_word || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0: Command Invalid, 1: Command Valid
				decoded.infrared_cmd_status.cmd.control_word.command_valid = extractBits(bitOptions, 0, 1);
				// 0: Command unavailable, 1: Command available
				decoded.infrared_cmd_status.cmd.control_word.command_available = extractBits(bitOptions, 1, 2);
				decoded.infrared_cmd_status.cmd.control_word.reserve = extractBits(bitOptions, 2, 8);
				decoded.infrared_cmd_status.target_temp = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x05:
				decoded.running_state = decoded.running_state || {};
				decoded.running_state.data_source = readUInt8(bytes, counterObj, 1);
				if (decoded.running_state.data_source == 0x00) {
					decoded.running_state.infrared_cmd = decoded.running_state.infrared_cmd || {};
					// 0: Switch Off, 1: Switch On
					decoded.running_state.infrared_cmd.switch_state = readUInt8(bytes, counterObj, 1);
				}
				if (decoded.running_state.data_source == 0x01) {
					decoded.running_state.current_transformer = decoded.running_state.current_transformer || {};
					decoded.running_state.current_transformer.current = readInt32LE(bytes, counterObj, 4);
				}
				break;
			case 0x06:
				decoded.internal_temp = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x07:
				decoded.external_temp = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x08:
				decoded.humidity = readInt16LE(bytes, counterObj, 2) / 10;
				break;
			case 0x09:
				decoded.filter_clean_remind = decoded.filter_clean_remind || {};
				decoded.filter_clean_remind.usage_time = readUInt32LE(bytes, counterObj, 4);
				break;
			case 0x0a:
				decoded.cmd_temp_limit = decoded.cmd_temp_limit || {};
				decoded.cmd_temp_limit.type = readUInt8(bytes, counterObj, 1);
				if (decoded.cmd_temp_limit.type == 0x00) {
					decoded.cmd_temp_limit.lower_range_alarm_trigger = decoded.cmd_temp_limit.lower_range_alarm_trigger || {};
					decoded.cmd_temp_limit.lower_range_alarm_trigger.low_threshold = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.cmd_temp_limit.lower_range_alarm_trigger.high_threshold = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (decoded.cmd_temp_limit.type == 0x01) {
					decoded.cmd_temp_limit.over_range_alarm_trigger = decoded.cmd_temp_limit.over_range_alarm_trigger || {};
					decoded.cmd_temp_limit.over_range_alarm_trigger.low_threshold = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.cmd_temp_limit.over_range_alarm_trigger.high_threshold = readInt16LE(bytes, counterObj, 2) / 100;
				}
				break;
			case 0x0b:
				decoded.local_temp_limit = decoded.local_temp_limit || {};
				decoded.local_temp_limit.type = readUInt8(bytes, counterObj, 1);
				if (decoded.local_temp_limit.type == 0x00) {
					decoded.local_temp_limit.lower_range_alarm_trigger = decoded.local_temp_limit.lower_range_alarm_trigger || {};
					decoded.local_temp_limit.lower_range_alarm_trigger.low_threshold = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.local_temp_limit.lower_range_alarm_trigger.high_threshold = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (decoded.local_temp_limit.type == 0x01) {
					decoded.local_temp_limit.over_range_alarm_trigger = decoded.local_temp_limit.over_range_alarm_trigger || {};
					decoded.local_temp_limit.over_range_alarm_trigger.low_threshold = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.local_temp_limit.over_range_alarm_trigger.high_threshold = readInt16LE(bytes, counterObj, 2) / 100;
				}
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
			case 0xc9:
				// 0：Disable, 1：Enable
				decoded.random_key = readUInt8(bytes, counterObj, 1);
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
			case 0x60:
				decoded.temperature_control_mode = decoded.temperature_control_mode || {};
				// 0：Mode, 1：Plan Temperature Control , Mode Enable
				var temperature_control_mode_command = readUInt8(bytes, counterObj, 1);
				if (temperature_control_mode_command == 0x00) {
					// 0：heat, 2：cool, 3：auto, 4：dehumidify, 5：ventilate
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
				// 0：BLE+Lorawan
				decoded.communication_mode = readUInt8(bytes, counterObj, 1);
				break;
			case 0x66:
				decoded.reporting_interval = decoded.reporting_interval || {};
				// 0：BLE+LORA
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
					// 0：Auto, 1：Ventilation, 2：Always Open, 3：Low, 4：Medium, 5：High, 255：Disabled
					schedule_settings_item.fan_mode = readUInt8(bytes, counterObj, 1);
				}
				if (schedule_settings_item_command == 0x04) {
					schedule_settings_item.target_temp = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (schedule_settings_item_command == 0x05) {
					// 0：Switch Off, 1：Switch On
					schedule_settings_item.switch_on = readUInt8(bytes, counterObj, 1);
				}
				if (schedule_settings_item_command == 0x06) {
					// 0：heat, 1：em heat, 2：cool, 3：auto, 4：dehumidify, 5：ventilate
					schedule_settings_item.work_mode = readUInt8(bytes, counterObj, 1);
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
					cycle_settings_item.reserved = extractBits(bitOptions, 7, 8);
				}
				break;
			case 0x68:
				decoded.window_opening_detection_settings = decoded.window_opening_detection_settings || {};
				var window_opening_detection_settings_command = readUInt8(bytes, counterObj, 1);
				if (window_opening_detection_settings_command == 0x00) {
					// 0：Disable, 1：Enable
					decoded.window_opening_detection_settings.enable = readUInt8(bytes, counterObj, 1);
				}
				if (window_opening_detection_settings_command == 0x02) {
					decoded.window_opening_detection_settings.difference_in_temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (window_opening_detection_settings_command == 0x03) {
					decoded.window_opening_detection_settings.stop_time = readUInt16LE(bytes, counterObj, 2);
				}
				break;
			case 0x6a:
				decoded.temperature_data_source = decoded.temperature_data_source || {};
				var temperature_data_source_command = readUInt8(bytes, counterObj, 1);
				if (temperature_data_source_command == 0x00) {
					// 0: External Temperature Sensor, 4: Internal Temperature Sensor
					decoded.temperature_data_source.source = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x6c:
				decoded.continuous_high_temp_alarm_settings = decoded.continuous_high_temp_alarm_settings || {};
				var continuous_high_temp_alarm_settings_command = readUInt8(bytes, counterObj, 1);
				if (continuous_high_temp_alarm_settings_command == 0x00) {
					// 0：Disable, 1：Enable
					decoded.continuous_high_temp_alarm_settings.enable = readUInt8(bytes, counterObj, 1);
				}
				if (continuous_high_temp_alarm_settings_command == 0x01) {
					decoded.continuous_high_temp_alarm_settings.difference = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (continuous_high_temp_alarm_settings_command == 0x02) {
					decoded.continuous_high_temp_alarm_settings.duration = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x6d:
				decoded.continuous_low_temp_alarm_settings = decoded.continuous_low_temp_alarm_settings || {};
				var continuous_low_temp_alarm_settings_command = readUInt8(bytes, counterObj, 1);
				if (continuous_low_temp_alarm_settings_command == 0x00) {
					// 0：Disable, 1：Enable
					decoded.continuous_low_temp_alarm_settings.enable = readUInt8(bytes, counterObj, 1);
				}
				if (continuous_low_temp_alarm_settings_command == 0x01) {
					decoded.continuous_low_temp_alarm_settings.difference = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (continuous_low_temp_alarm_settings_command == 0x02) {
					decoded.continuous_low_temp_alarm_settings.duration = readUInt8(bytes, counterObj, 1);
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
					// 0:Disable, 1:Condition: x<A, 2:Condition: x>B, 4:Condition: x<A or x>B
					decoded.temperature_alarm_settings.threshold_condition = readUInt8(bytes, counterObj, 1);
				}
				if (temperature_alarm_settings_command == 0x02) {
					decoded.temperature_alarm_settings.threshold_min = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (temperature_alarm_settings_command == 0x03) {
					decoded.temperature_alarm_settings.threshold_max = readInt16LE(bytes, counterObj, 2) / 100;
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
					// 0：Auto, 1：Ventilation, 2：Always Open, 3：Low, 4：Medium, 5：High, 255：Disabled
					decoded.fan_settings.fan_mode = readUInt8(bytes, counterObj, 1);
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
				if (plan_dwell_time_settings_item_command == 0x02) {
					plan_dwell_time_settings_item.trigger_method = readUInt8(bytes, counterObj, 1);
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
			case 0x80:
				decoded.indicator_light_disable_settings = decoded.indicator_light_disable_settings || {};
				var indicator_light_disable_settings_command = readUInt8(bytes, counterObj, 1);
				if (indicator_light_disable_settings_command == 0x00) {
					// 0：disable, 1：enable
					decoded.indicator_light_disable_settings.enable = readUInt8(bytes, counterObj, 1);
				}
				if (indicator_light_disable_settings_command == 0x01) {
					decoded.indicator_light_disable_settings.time = readUInt16LE(bytes, counterObj, 2);
				}
				break;
			case 0x81:
				// 0：Disable, 1：Enable
				decoded.enhanced_infrared_emission_power_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x82:
				decoded.air_power_settings = decoded.air_power_settings || {};
				var air_power_settings_command = readUInt8(bytes, counterObj, 1);
				if (air_power_settings_command == 0x00) {
					decoded.air_power_settings.refrigeration_power = readUInt16LE(bytes, counterObj, 2);
				}
				if (air_power_settings_command == 0x01) {
					decoded.air_power_settings.heating_power = readUInt16LE(bytes, counterObj, 2);
				}
				break;
			case 0x83:
				decoded.temperature_limit_task_settings = decoded.temperature_limit_task_settings || [];
				var id = readUInt8(bytes, counterObj, 1);
				var temperature_limit_task_settings_item = pickArrayItem(decoded.temperature_limit_task_settings, id, 'id');
				temperature_limit_task_settings_item.id = id;
				insertArrayItem(decoded.temperature_limit_task_settings, temperature_limit_task_settings_item, 'id');
				var temperature_limit_task_settings_item_command = readUInt8(bytes, counterObj, 1);
				if (temperature_limit_task_settings_item_command == 0x00) {
					// 0：Disable, 1：Enable
					temperature_limit_task_settings_item.enable = readUInt8(bytes, counterObj, 1);
				}
				if (temperature_limit_task_settings_item_command == 0x01) {
					temperature_limit_task_settings_item.task_date_settings = temperature_limit_task_settings_item.task_date_settings || {};
					temperature_limit_task_settings_item.task_date_settings.start_mon = readUInt8(bytes, counterObj, 1);
					temperature_limit_task_settings_item.task_date_settings.start_day = readUInt8(bytes, counterObj, 1);
					temperature_limit_task_settings_item.task_date_settings.end_mon = readUInt8(bytes, counterObj, 1);
					temperature_limit_task_settings_item.task_date_settings.end_day = readUInt8(bytes, counterObj, 1);
				}
				if (temperature_limit_task_settings_item_command == 0x02) {
					temperature_limit_task_settings_item.execute_period = temperature_limit_task_settings_item.execute_period || {};
					temperature_limit_task_settings_item.execute_period.start_minute = readUInt16LE(bytes, counterObj, 2);
					temperature_limit_task_settings_item.execute_period.end_minute = readUInt16LE(bytes, counterObj, 2);
				}
				if (temperature_limit_task_settings_item_command == 0x03) {
					temperature_limit_task_settings_item.cycle_settings = temperature_limit_task_settings_item.cycle_settings || {};
					var bitOptions = readUInt8(bytes, counterObj, 1);
					// 0：disable, 1：enable
					temperature_limit_task_settings_item.cycle_settings.execution_day_sun = extractBits(bitOptions, 0, 1);
					// 0：disable, 1：enable
					temperature_limit_task_settings_item.cycle_settings.execution_day_mon = extractBits(bitOptions, 1, 2);
					// 0：disable, 1：enable
					temperature_limit_task_settings_item.cycle_settings.execution_day_tues = extractBits(bitOptions, 2, 3);
					// 0：disable, 1：enable
					temperature_limit_task_settings_item.cycle_settings.execution_day_wed = extractBits(bitOptions, 3, 4);
					// 0：disable, 1：enable
					temperature_limit_task_settings_item.cycle_settings.execution_day_thu = extractBits(bitOptions, 4, 5);
					// 0：disable, 1：enable
					temperature_limit_task_settings_item.cycle_settings.execution_day_fri = extractBits(bitOptions, 5, 6);
					// 0：disable, 1：enable
					temperature_limit_task_settings_item.cycle_settings.execution_day_sat = extractBits(bitOptions, 6, 7);
					temperature_limit_task_settings_item.cycle_settings.reserved = extractBits(bitOptions, 7, 8);
				}
				if (temperature_limit_task_settings_item_command == 0x04) {
					temperature_limit_task_settings_item.low_threshold = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (temperature_limit_task_settings_item_command == 0x05) {
					temperature_limit_task_settings_item.high_threshold = readInt16LE(bytes, counterObj, 2) / 100;
				}
				break;
			case 0x84:
				decoded.night_task_settings = decoded.night_task_settings || [];
				var id = readUInt8(bytes, counterObj, 1);
				var night_task_settings_item = pickArrayItem(decoded.night_task_settings, id, 'id');
				night_task_settings_item.id = id;
				insertArrayItem(decoded.night_task_settings, night_task_settings_item, 'id');
				var night_task_settings_item_command = readUInt8(bytes, counterObj, 1);
				if (night_task_settings_item_command == 0x00) {
					// 0：Disable, 1：Enable
					night_task_settings_item.enable = readUInt8(bytes, counterObj, 1);
				}
				if (night_task_settings_item_command == 0x01) {
					night_task_settings_item.task_date_settings = night_task_settings_item.task_date_settings || {};
					night_task_settings_item.task_date_settings.start_mon = readUInt8(bytes, counterObj, 1);
					night_task_settings_item.task_date_settings.start_day = readUInt8(bytes, counterObj, 1);
					night_task_settings_item.task_date_settings.end_mon = readUInt8(bytes, counterObj, 1);
					night_task_settings_item.task_date_settings.end_day = readUInt8(bytes, counterObj, 1);
				}
				if (night_task_settings_item_command == 0x02) {
					night_task_settings_item.execute_period = night_task_settings_item.execute_period || {};
					night_task_settings_item.execute_period.start_minute = readUInt16LE(bytes, counterObj, 2);
					night_task_settings_item.execute_period.end_minute = readUInt16LE(bytes, counterObj, 2);
				}
				if (night_task_settings_item_command == 0x03) {
					night_task_settings_item.cycle_settings = night_task_settings_item.cycle_settings || {};
					var bitOptions = readUInt8(bytes, counterObj, 1);
					// 0：disable, 1：enable
					night_task_settings_item.cycle_settings.execution_day_sun = extractBits(bitOptions, 0, 1);
					// 0：disable, 1：enable
					night_task_settings_item.cycle_settings.execution_day_mon = extractBits(bitOptions, 1, 2);
					// 0：disable, 1：enable
					night_task_settings_item.cycle_settings.execution_day_tues = extractBits(bitOptions, 2, 3);
					// 0：disable, 1：enable
					night_task_settings_item.cycle_settings.execution_day_wed = extractBits(bitOptions, 3, 4);
					// 0：disable, 1：enable
					night_task_settings_item.cycle_settings.execution_day_thu = extractBits(bitOptions, 4, 5);
					// 0：disable, 1：enable
					night_task_settings_item.cycle_settings.execution_day_fri = extractBits(bitOptions, 5, 6);
					// 0：disable, 1：enable
					night_task_settings_item.cycle_settings.execution_day_sat = extractBits(bitOptions, 6, 7);
					night_task_settings_item.cycle_settings.reserved = extractBits(bitOptions, 7, 8);
				}
				if (night_task_settings_item_command == 0x04) {
					// 0：other device, 1：self_executing
					night_task_settings_item.breaker_control = readUInt8(bytes, counterObj, 1);
				}
				if (night_task_settings_item_command == 0x05) {
					// 0：NONE
					night_task_settings_item.control_command = readUInt8(bytes, counterObj, 1);
				}
				if (night_task_settings_item_command == 0x06) {
					// 0：disable, 1：enable
					night_task_settings_item.execute_condition = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x85:
				decoded.vacation_task_settings = decoded.vacation_task_settings || [];
				var id = readUInt8(bytes, counterObj, 1);
				var vacation_task_settings_item = pickArrayItem(decoded.vacation_task_settings, id, 'id');
				vacation_task_settings_item.id = id;
				insertArrayItem(decoded.vacation_task_settings, vacation_task_settings_item, 'id');
				var vacation_task_settings_item_command = readUInt8(bytes, counterObj, 1);
				if (vacation_task_settings_item_command == 0x00) {
					// 0：Disable, 1：Enable
					vacation_task_settings_item.enable = readUInt8(bytes, counterObj, 1);
				}
				if (vacation_task_settings_item_command == 0x01) {
					vacation_task_settings_item.task_date_settings = vacation_task_settings_item.task_date_settings || {};
					vacation_task_settings_item.task_date_settings.start_mon = readUInt8(bytes, counterObj, 1);
					vacation_task_settings_item.task_date_settings.start_day = readUInt8(bytes, counterObj, 1);
					vacation_task_settings_item.task_date_settings.end_mon = readUInt8(bytes, counterObj, 1);
					vacation_task_settings_item.task_date_settings.end_day = readUInt8(bytes, counterObj, 1);
				}
				if (vacation_task_settings_item_command == 0x02) {
					vacation_task_settings_item.execute_period = vacation_task_settings_item.execute_period || {};
					vacation_task_settings_item.execute_period.start_minute = readUInt16LE(bytes, counterObj, 2);
					vacation_task_settings_item.execute_period.end_minute = readUInt16LE(bytes, counterObj, 2);
				}
				if (vacation_task_settings_item_command == 0x03) {
					vacation_task_settings_item.cycle_settings = vacation_task_settings_item.cycle_settings || {};
					var bitOptions = readUInt8(bytes, counterObj, 1);
					// 0：disable, 1：enable
					vacation_task_settings_item.cycle_settings.execution_day_sun = extractBits(bitOptions, 0, 1);
					// 0：disable, 1：enable
					vacation_task_settings_item.cycle_settings.execution_day_mon = extractBits(bitOptions, 1, 2);
					// 0：disable, 1：enable
					vacation_task_settings_item.cycle_settings.execution_day_tues = extractBits(bitOptions, 2, 3);
					// 0：disable, 1：enable
					vacation_task_settings_item.cycle_settings.execution_day_wed = extractBits(bitOptions, 3, 4);
					// 0：disable, 1：enable
					vacation_task_settings_item.cycle_settings.execution_day_thu = extractBits(bitOptions, 4, 5);
					// 0：disable, 1：enable
					vacation_task_settings_item.cycle_settings.execution_day_fri = extractBits(bitOptions, 5, 6);
					// 0：disable, 1：enable
					vacation_task_settings_item.cycle_settings.execution_day_sat = extractBits(bitOptions, 6, 7);
					vacation_task_settings_item.cycle_settings.reserved = extractBits(bitOptions, 7, 8);
				}
				if (vacation_task_settings_item_command == 0x04) {
					// 0：other device, 1：self_executing
					vacation_task_settings_item.breaker_control = readUInt8(bytes, counterObj, 1);
				}
				if (vacation_task_settings_item_command == 0x05) {
					// 0：disable, 1：enable
					vacation_task_settings_item.execute_condition = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x86:
				decoded.infrared_learn = decoded.infrared_learn || {};
				var infrared_learn_command = readUInt8(bytes, counterObj, 1);
				if (infrared_learn_command == 0x00) {
					// 0: Non learning state, 1: During a learning session, 2: In secondary learning (requires secondary learning+or - key), 3: In secondary learning (requires secondary learning mode key), 4: In secondary learning (requires secondary learning of wind keys), 5: Learning failure (timeout failure), 6: Learning failed (code library matching failed), 7: Success in Learning (One Study), 8: Learning success (secondary learning)
					decoded.infrared_learn.status = readUInt8(bytes, counterObj, 1);
				}
				if (infrared_learn_command == 0x01) {
					decoded.infrared_learn.findnext_max = readUInt8(bytes, counterObj, 1);
				}
				if (infrared_learn_command == 0x02) {
					decoded.infrared_learn.findnext = readUInt8(bytes, counterObj, 1);
				}
				if (infrared_learn_command == 0x03) {
					// 0: NONE, 1: XIAOMI/TCL, 2: SHINCO/SAMSUNG/ELECTROLUX, 3: RSD/MCQUAY/TICA, 4: WHIRLPOOL/BOSCH/AIRWELL, 5: FUJITSU/McQUAY, 6: TRUMA
					decoded.infrared_learn.predefine_brand = readUInt8(bytes, counterObj, 1);
				}
				if (infrared_learn_command == 0x04) {
					// 0: No infrared format packet, 1: Infrared format package already exists
					decoded.infrared_learn.package_status = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x88:
				decoded.internal_sensor_settings = decoded.internal_sensor_settings || {};
				var internal_sensor_settings_command = readUInt8(bytes, counterObj, 1);
				if (internal_sensor_settings_command == 0x00) {
					decoded.internal_sensor_settings.name1 = readString(bytes, counterObj, 6);
				}
				if (internal_sensor_settings_command == 0x01) {
					decoded.internal_sensor_settings.name2 = readString(bytes, counterObj, 6);
				}
				if (internal_sensor_settings_command == 0x02) {
					decoded.internal_sensor_settings.name3 = readString(bytes, counterObj, 6);
				}
				if (internal_sensor_settings_command == 0x03) {
					decoded.internal_sensor_settings.collect_period = readUInt16LE(bytes, counterObj, 2);
				}
				if (internal_sensor_settings_command == 0x04) {
					// 0：Disable, 1：Enable
					decoded.internal_sensor_settings.temperature_calibration_en = readUInt8(bytes, counterObj, 1);
				}
				if (internal_sensor_settings_command == 0x05) {
					decoded.internal_sensor_settings.temp_calibration = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (internal_sensor_settings_command == 0x06) {
					// 0：Disable, 1：Enable
					decoded.internal_sensor_settings.humi_calibration_en = readUInt8(bytes, counterObj, 1);
				}
				if (internal_sensor_settings_command == 0x07) {
					decoded.internal_sensor_settings.humi_calibration = readInt16LE(bytes, counterObj, 2) / 10;
				}
				if (internal_sensor_settings_command == 0x08) {
					// 0：Temperature Sensor, 1：Temperature and Humidity Sensor
					decoded.internal_sensor_settings.sensor_type = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x89:
				decoded.external_sensor_settings = decoded.external_sensor_settings || {};
				var external_sensor_settings_command = readUInt8(bytes, counterObj, 1);
				if (external_sensor_settings_command == 0x00) {
					decoded.external_sensor_settings.name1 = readString(bytes, counterObj, 6);
				}
				if (external_sensor_settings_command == 0x01) {
					decoded.external_sensor_settings.name2 = readString(bytes, counterObj, 6);
				}
				if (external_sensor_settings_command == 0x02) {
					decoded.external_sensor_settings.name3 = readString(bytes, counterObj, 6);
				}
				if (external_sensor_settings_command == 0x04) {
					// 0：Disable, 1：Enable
					decoded.external_sensor_settings.calibration_en = readUInt8(bytes, counterObj, 1);
				}
				if (external_sensor_settings_command == 0x05) {
					decoded.external_sensor_settings.temp_calibration = readInt16LE(bytes, counterObj, 2) / 100;
				}
				break;
			case 0x8a:
				decoded.ct_sensor_settings = decoded.ct_sensor_settings || {};
				var ct_sensor_settings_command = readUInt8(bytes, counterObj, 1);
				if (ct_sensor_settings_command == 0x00) {
					// 0：Disconnected, 1：Connected
					decoded.ct_sensor_settings.connected = readUInt8(bytes, counterObj, 1);
				}
				if (ct_sensor_settings_command == 0x01) {
					decoded.ct_sensor_settings.collect_period = readUInt16LE(bytes, counterObj, 2);
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
				decoded.infrared_format_code = decoded.infrared_format_code || {};
				decoded.infrared_format_code.offset = readUInt8(bytes, counterObj, 1);
				decoded.infrared_format_code.length = readUInt8(bytes, counterObj, 1);
				decoded.infrared_format_code.format_code = readBytes(bytes, counterObj, decoded.infrared_format_code.length);
				break;
			case 0x90:
				decoded.ble_adv_time_settings = decoded.ble_adv_time_settings || {};
				var ble_adv_time_settings_command = readUInt8(bytes, counterObj, 1);
				if (ble_adv_time_settings_command == 0x00) {
					// 0：Disable, 1：Enable
					decoded.ble_adv_time_settings.enable = readUInt8(bytes, counterObj, 1);
				}
				if (ble_adv_time_settings_command == 0x01) {
					decoded.ble_adv_time_settings.duration = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x92:
				// 0：Disable, 1：Enable
				decoded.battery_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x93:
				decoded.dormant_settings = decoded.dormant_settings || [];
				var id = readUInt8(bytes, counterObj, 1);
				var dormant_settings_item = pickArrayItem(decoded.dormant_settings, id, 'id');
				dormant_settings_item.id = id;
				insertArrayItem(decoded.dormant_settings, dormant_settings_item, 'id');
				var dormant_settings_item_command = readUInt8(bytes, counterObj, 1);
				if (dormant_settings_item_command == 0x00) {
					// 0：Disable, 1：Enable
					dormant_settings_item.enable = readUInt8(bytes, counterObj, 1);
				}
				if (dormant_settings_item_command == 0x01) {
					dormant_settings_item.heating_date_settings = dormant_settings_item.heating_date_settings || {};
					dormant_settings_item.heating_date_settings.start_mon = readUInt8(bytes, counterObj, 1);
					dormant_settings_item.heating_date_settings.start_day = readUInt8(bytes, counterObj, 1);
					dormant_settings_item.heating_date_settings.end_mon = readUInt8(bytes, counterObj, 1);
					dormant_settings_item.heating_date_settings.end_day = readUInt8(bytes, counterObj, 1);
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
			case 0xb6:
				decoded.reconnect = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0xb7:
				decoded.set_time = decoded.set_time || {};
				decoded.set_time.timestamp = readUInt32LE(bytes, counterObj, 4);
				break;
			case 0xb5:
				decoded.collect_data = readOnlyCommand(bytes, counterObj, 0);
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
			case 0xbe:
				decoded.reboot = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0x5f:
				decoded.delete_task_plan = decoded.delete_task_plan || {};
				// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8, 8：Schedule9, 9：Schedule10, 10：Schedule11, 11：Schedule12, 12：Schedule13, 13：Schedule14, 14：Schedule15, 15：Schedule16, 255：All
				decoded.delete_task_plan.type = readUInt8(bytes, counterObj, 1);
				break;
			case 0x5c:
				decoded.insert_temporary_plan = decoded.insert_temporary_plan || {};
				// 0：Insert Schedule1, 1：Insert Schedule2, 2：Insert Schedule3, 3：Insert Schedule4, 4：Insert Schedule5, 5：Insert Schedule6, 6：Insert Schedule7, 7：Insert Schedule8, 8：Insert Schedule9, 9：Insert Schedule10, 10：Insert Schedule11, 11：Insert Schedule12, 12：Insert Schedule13, 13：Insert Schedule14, 14：Insert Schedule15, 15：Insert Schedule16
				decoded.insert_temporary_plan.id = readUInt8(bytes, counterObj, 1);
				break;
			case 0x5b:
				decoded.filter_clean_alarm = decoded.filter_clean_alarm || {};
				// 0：clean alarm, 1：report alarm
				decoded.filter_clean_alarm.mode = readUInt8(bytes, counterObj, 1);
				break;
			case 0x5a:
				decoded.open_window_alarm = decoded.open_window_alarm || {};
				// 0：clean alarm, 1：report alarm
				decoded.open_window_alarm.mode = readUInt8(bytes, counterObj, 1);
				break;
			case 0x59:
				decoded.clear_infrared_format_code = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0x58:
				decoded.delete_temperature_limit_task = decoded.delete_temperature_limit_task || {};
				// 0：Task1, 1：Task2, 2：Task3, 3：Task4, 4：Task5, 5：Task6, 6：Task7, 7：Task8, 255：All
				decoded.delete_temperature_limit_task.type = readUInt8(bytes, counterObj, 1);
				break;
			case 0x57:
				decoded.delete_night_task = decoded.delete_night_task || {};
				// 0：Task1, 1：Task2, 2：Task3, 3：Task4, 4：Task5, 5：Task6, 6：Task7, 7：Task8, 255：All
				decoded.delete_night_task.type = readUInt8(bytes, counterObj, 1);
				break;
			case 0x56:
				decoded.delete_vacation_task = decoded.delete_vacation_task || {};
				// 0：Task1, 1：Task2, 2：Task3, 3：Task4, 4：Task5, 5：Task6, 6：Task7, 7：Task8, 255：All
				decoded.delete_vacation_task.type = readUInt8(bytes, counterObj, 1);
				break;
			case 0x55:
				decoded.trigger_infrared_learn = readOnlyCommand(bytes, counterObj, 0);
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
		  "30": "data_transparent",
		  "55": "trigger_infrared_learn",
		  "56": "delete_vacation_task",
		  "57": "delete_night_task",
		  "58": "delete_temperature_limit_task",
		  "59": "clear_infrared_format_code",
		  "60": "temperature_control_mode",
		  "61": "target_temperature_settings",
		  "62": "target_temperature_tolerance",
		  "64": "temperature_unit",
		  "65": "target_temperature_resolution",
		  "66": "reporting_interval",
		  "67": "schedule_settings",
		  "68": "window_opening_detection_settings",
		  "70": "fan_settings",
		  "73": "plan_dwell_time_settings",
		  "75": "temperature_control_mode_enable",
		  "80": "indicator_light_disable_settings",
		  "81": "enhanced_infrared_emission_power_enable",
		  "82": "air_power_settings",
		  "83": "temperature_limit_task_settings",
		  "84": "night_task_settings",
		  "85": "vacation_task_settings",
		  "86": "infrared_learn",
		  "88": "internal_sensor_settings",
		  "89": "external_sensor_settings",
		  "90": "ble_adv_time_settings",
		  "91": "communication_mode",
		  "92": "battery_enable",
		  "93": "dormant_settings",
		  "97": "d2d_slave_enable",
		  "98": "d2d_slave_settings",
		  "3000": "data_transparent.res_cmd1",
		  "6000": "temperature_control_mode.ctrl_mode",
		  "6001": "temperature_control_mode.plan_enable",
		  "6100": "target_temperature_settings.heat",
		  "6102": "target_temperature_settings.cool",
		  "6103": "target_temperature_settings.auto",
		  "6200": "target_temperature_tolerance.target_value",
		  "6600": "reporting_interval.ble_lora",
		  "6800": "window_opening_detection_settings.enable",
		  "6802": "window_opening_detection_settings.difference_in_temperature",
		  "6803": "window_opening_detection_settings.stop_time",
		  "7000": "fan_settings.fan_mode",
		  "8000": "indicator_light_disable_settings.enable",
		  "8001": "indicator_light_disable_settings.time",
		  "8200": "air_power_settings.refrigeration_power",
		  "8201": "air_power_settings.heating_power",
		  "8600": "infrared_learn.status",
		  "8601": "infrared_learn.findnext_max",
		  "8602": "infrared_learn.findnext",
		  "8603": "infrared_learn.predefine_brand",
		  "8604": "infrared_learn.package_status",
		  "8800": "internal_sensor_settings.name1",
		  "8801": "internal_sensor_settings.name2",
		  "8802": "internal_sensor_settings.name3",
		  "8803": "internal_sensor_settings.collect_period",
		  "8804": "internal_sensor_settings.temperature_calibration_en",
		  "8805": "internal_sensor_settings.temp_calibration",
		  "8806": "internal_sensor_settings.humi_calibration_en",
		  "8807": "internal_sensor_settings.humi_calibration",
		  "8808": "internal_sensor_settings.sensor_type",
		  "8900": "external_sensor_settings.name1",
		  "8901": "external_sensor_settings.name2",
		  "8902": "external_sensor_settings.name3",
		  "8904": "external_sensor_settings.calibration_en",
		  "8905": "external_sensor_settings.temp_calibration",
		  "9000": "ble_adv_time_settings.enable",
		  "9001": "ble_adv_time_settings.duration",
		  "300000": "data_transparent.res_cmd1.battery",
		  "660000": "reporting_interval.ble_lora.seconds_of_time",
		  "660001": "reporting_interval.ble_lora.minutes_of_time",
		  "ff": "request_check_sequence_number",
		  "fe": "request_check_order",
		  "fd": "request_security_password_check",
		  "fc": "request_security_password_change",
		  "fb": "request_password_check",
		  "fa": "request_password_change",
		  "f7": "request_firmware_upgrade",
		  "f700": "request_firmware_upgrade.start_upgrade",
		  "f701": "request_firmware_upgrade.transmission",
		  "f702": "request_firmware_upgrade.end_upgrade",
		  "f703": "request_firmware_upgrade.continue_upgrade",
		  "f704": "request_firmware_upgrade.completion_check",
		  "f6": "request_preconfiguration",
		  "f600": "request_preconfiguration.start_writing",
		  "f601": "request_preconfiguration.configuration_writing",
		  "f602": "request_preconfiguration.end_writing",
		  "f5": "request_historical_data_export",
		  "f510": "request_historical_data_export.start_exporting",
		  "f511": "request_historical_data_export.exported_data",
		  "f512": "request_historical_data_export.end_exporting",
		  "f513": "request_historical_data_export.exported_all_data",
		  "f514": "request_historical_data_export.start_exporting_with_type",
		  "f4": "request_full_inspection",
		  "f400": "request_full_inspection.start_inspection",
		  "f401": "request_full_inspection.control",
		  "f402": "request_full_inspection.reading",
		  "f403": "request_full_inspection.end_inspection",
		  "f404": "request_full_inspection.aging",
		  "ef": "request_command_queries",
		  "ee": "request_query_all_configurations",
		  "ed": "historical_data_report",
		  "ec": "ipso_device_upgrade",
		  "undefinedxx": "ipso_device_upgrade.firmwares._item",
		  "eb": "debugging_commands",
		  "cf": "lorawan_configuration_settings",
		  "cf0b": "lorawan_configuration_settings.deveui",
		  "cf13": "lorawan_configuration_settings.appeui",
		  "cf03": "lorawan_configuration_settings.netid",
		  "cf5c": "lorawan_configuration_settings.app_port",
		  "cfd8": "lorawan_configuration_settings.version",
		  "cf00": "lorawan_configuration_settings.mode",
		  "cf5d": "lorawan_configuration_settings.confirmed_mode",
		  "cfc6": "lorawan_configuration_settings.ack_retry_times",
		  "cf01": "lorawan_configuration_settings.join_type",
		  "cf3b": "lorawan_configuration_settings.appkey",
		  "cf1b": "lorawan_configuration_settings.nwkskey",
		  "cf2b": "lorawan_configuration_settings.appskey",
		  "cf07": "lorawan_configuration_settings.devaddr",
		  "cfda": "lorawan_configuration_settings.rejoin_mode_enable",
		  "cfd9": "lorawan_configuration_settings.number_of_link_detection_signals",
		  "cfcd": "lorawan_configuration_settings.frequency_band",
		  "cfdc": "lorawan_configuration_settings.AS923_frequency_band_in_use",
		  "cf5e": "lorawan_configuration_settings.channel_mask",
		  "cf6a": "lorawan_configuration_settings.channels_settings",
		  "cf6axx": "lorawan_configuration_settings.channels_settings._item",
		  "cf02": "lorawan_configuration_settings.adr_mode",
		  "cfba": "lorawan_configuration_settings.tx_data_rate",
		  "cf5b": "lorawan_configuration_settings.tx_power",
		  "cfbf": "lorawan_configuration_settings.rx2_data_rate",
		  "cfbb": "lorawan_configuration_settings.rx2_frequency",
		  "cfdd": "lorawan_configuration_settings.pingslot_periodicity",
		  "cf4b": "lorawan_configuration_settings.rx1_open_delay",
		  "cf4f": "lorawan_configuration_settings.rx2_open_delay",
		  "cf53": "lorawan_configuration_settings.join_rx1_open_delay",
		  "cf57": "lorawan_configuration_settings.join_rx2_open_delay",
		  "cff9": "lorawan_configuration_settings.multicast_group_settings",
		  "cff90d": "lorawan_configuration_settings.multicast_group_settings.group_1_enable",
		  "cff914": "lorawan_configuration_settings.multicast_group_settings.group_1_devaddr",
		  "cff928": "lorawan_configuration_settings.multicast_group_settings.group_1_appskey",
		  "cff918": "lorawan_configuration_settings.multicast_group_settings.group_1_nwkskey",
		  "cff90e": "lorawan_configuration_settings.multicast_group_settings.group_1_pingslot_periodicity",
		  "cff90f": "lorawan_configuration_settings.multicast_group_settings.group_1_data_rate",
		  "cff910": "lorawan_configuration_settings.multicast_group_settings.group_1_frequency",
		  "cff93a": "lorawan_configuration_settings.multicast_group_settings.group_2_enable",
		  "cff941": "lorawan_configuration_settings.multicast_group_settings.group_2_devaddr",
		  "cff955": "lorawan_configuration_settings.multicast_group_settings.group_2_appskey",
		  "cff945": "lorawan_configuration_settings.multicast_group_settings.group_2_nwkskey",
		  "cff93b": "lorawan_configuration_settings.multicast_group_settings.group_2_pingslot_periodicity",
		  "cff93c": "lorawan_configuration_settings.multicast_group_settings.group_2_data_rate",
		  "cff93d": "lorawan_configuration_settings.multicast_group_settings.group_2_frequency",
		  "cff967": "lorawan_configuration_settings.multicast_group_settings.group_3_enable",
		  "cff96e": "lorawan_configuration_settings.multicast_group_settings.group_3_devaddr",
		  "cff982": "lorawan_configuration_settings.multicast_group_settings.group_3_appskey",
		  "cff972": "lorawan_configuration_settings.multicast_group_settings.group_3_nwkskey",
		  "cff968": "lorawan_configuration_settings.multicast_group_settings.group_3_pingslot_periodicity",
		  "cff969": "lorawan_configuration_settings.multicast_group_settings.group_3_data_rate",
		  "cff96a": "lorawan_configuration_settings.multicast_group_settings.group_3_frequency",
		  "cff994": "lorawan_configuration_settings.multicast_group_settings.group_4_enable",
		  "cff99b": "lorawan_configuration_settings.multicast_group_settings.group_4_devaddr",
		  "cff9af": "lorawan_configuration_settings.multicast_group_settings.group_4_appskey",
		  "cff99f": "lorawan_configuration_settings.multicast_group_settings.group_4_nwkskey",
		  "cff995": "lorawan_configuration_settings.multicast_group_settings.group_4_pingslot_periodicity",
		  "cff996": "lorawan_configuration_settings.multicast_group_settings.group_4_data_rate",
		  "cff997": "lorawan_configuration_settings.multicast_group_settings.group_4_frequency",
		  "cfe0": "lorawan_configuration_settings.d2d_key",
		  "cfc4": "lorawan_configuration_settings.duty_cycle_enable",
		  "cfc0": "lorawan_configuration_settings.duty_cycle",
		  "df": "tsl_version",
		  "de": "product_name",
		  "dd": "product_pn",
		  "db": "product_sn",
		  "da": "version",
		  "d9": "oem_id",
		  "c8": "device_status",
		  "d8": "product_frequency_band",
		  "d7": "device_info",
		  "bf": "lorawan_status",
		  "bf00": "lorawan_status.join_status",
		  "bf01": "lorawan_status.eui",
		  "bf02": "lorawan_status.signal",
		  "bf03": "lorawan_status.channel_mask",
		  "bf04": "lorawan_status.frame_counter",
		  "b9": "device_time",
		  "b8": "battery_info",
		  "d5": "ble_phone_name",
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
		  "00": "battery",
		  "01": "low_battery_alarm",
		  "02": "temperature_alarm",
		  "0200": "temperature_alarm.open_window_alarm_deactivation",
		  "0201": "temperature_alarm.open_window_alarm_trigger",
		  "0220": "temperature_alarm.over_range_alarm_trigger",
		  "0221": "temperature_alarm.over_range_alarm_deactivation",
		  "0222": "temperature_alarm.lower_range_alarm_trigger",
		  "0223": "temperature_alarm.lower_range_alarm_deactivation",
		  "0224": "temperature_alarm.within_range_alarm_trigger",
		  "0225": "temperature_alarm.within_range_alarm_deactivation",
		  "0226": "temperature_alarm.outside_range_alarm_trigger",
		  "0227": "temperature_alarm.outside_range_alarm_deactivation",
		  "0230": "temperature_alarm.persistent_low_temp_deactivation",
		  "0231": "temperature_alarm.persistent_low_temp_trigger",
		  "0240": "temperature_alarm.persistent_high_temp_deactivation",
		  "0241": "temperature_alarm.persistent_high_temp_trigger",
		  "03": "sensor_error",
		  "0300": "sensor_error.internal_sensor_collect_error",
		  "03f0": "sensor_error.external_sensor_collect_error",
		  "0301": "sensor_error.internal_sensor_lower_ranger_error",
		  "03f1": "sensor_error.external_sensor_lower_ranger_error",
		  "0302": "sensor_error.internal_sensor_over_ranger_error",
		  "03f2": "sensor_error.external_sensor_over_ranger_error",
		  "04": "infrared_cmd_status",
		  "05": "running_state",
		  "0500": "running_state.infrared_cmd",
		  "0501": "running_state.current_transformer",
		  "06": "internal_temp",
		  "07": "external_temp",
		  "08": "humidity",
		  "09": "filter_clean_remind",
		  "0a": "cmd_temp_limit",
		  "0a00": "cmd_temp_limit.lower_range_alarm_trigger",
		  "0a01": "cmd_temp_limit.over_range_alarm_trigger",
		  "0b": "local_temp_limit",
		  "0b00": "local_temp_limit.lower_range_alarm_trigger",
		  "0b01": "local_temp_limit.over_range_alarm_trigger",
		  "30000f": "data_transparent.res_cmd1.battery_event",
		  "30000f00": "data_transparent.res_cmd1.battery_event.recover",
		  "30000f01": "data_transparent.res_cmd1.battery_event.low_volt",
		  "30000d": "data_transparent.res_cmd1.key_event",
		  "30000d00": "data_transparent.res_cmd1.key_event.f1",
		  "30000d01": "data_transparent.res_cmd1.key_event.f2",
		  "30000d02": "data_transparent.res_cmd1.key_event.f3",
		  "3000c8": "data_transparent.res_cmd1.device_status",
		  "c9": "random_key",
		  "c4": "auto_p_enable",
		  "c5": "data_storage_settings",
		  "c500": "data_storage_settings.enable",
		  "c501": "data_storage_settings.retransmission_enable",
		  "c502": "data_storage_settings.retransmission_interval",
		  "c503": "data_storage_settings.retrieval_interval",
		  "67xx": "schedule_settings._item",
		  "67xx00": "schedule_settings._item.enable",
		  "67xx01": "schedule_settings._item.name1",
		  "67xx02": "schedule_settings._item.name2",
		  "67xx03": "schedule_settings._item.fan_mode",
		  "67xx04": "schedule_settings._item.target_temp",
		  "67xx05": "schedule_settings._item.switch_on",
		  "67xx06": "schedule_settings._item.work_mode",
		  "67xx07": "schedule_settings._item.cycle_settings",
		  "67xx07xx": "schedule_settings._item.cycle_settings._item",
		  "6a": "temperature_data_source",
		  "6a00": "temperature_data_source.source",
		  "6c": "continuous_high_temp_alarm_settings",
		  "6c00": "continuous_high_temp_alarm_settings.enable",
		  "6c01": "continuous_high_temp_alarm_settings.difference",
		  "6c02": "continuous_high_temp_alarm_settings.duration",
		  "6d": "continuous_low_temp_alarm_settings",
		  "6d00": "continuous_low_temp_alarm_settings.enable",
		  "6d01": "continuous_low_temp_alarm_settings.difference",
		  "6d02": "continuous_low_temp_alarm_settings.duration",
		  "6e": "temperature_alarm_settings",
		  "6e00": "temperature_alarm_settings.enable",
		  "6e01": "temperature_alarm_settings.threshold_condition",
		  "6e02": "temperature_alarm_settings.threshold_min",
		  "6e03": "temperature_alarm_settings.threshold_max",
		  "6f": "system_switch",
		  "73xx": "plan_dwell_time_settings._item",
		  "73xx00": "plan_dwell_time_settings._item.permanent_stay_enable",
		  "73xx01": "plan_dwell_time_settings._item.dwell_time",
		  "73xx02": "plan_dwell_time_settings._item.trigger_method",
		  "83xx": "temperature_limit_task_settings._item",
		  "83xx00": "temperature_limit_task_settings._item.enable",
		  "83xx01": "temperature_limit_task_settings._item.task_date_settings",
		  "83xx02": "temperature_limit_task_settings._item.execute_period",
		  "83xx03": "temperature_limit_task_settings._item.cycle_settings",
		  "83xx04": "temperature_limit_task_settings._item.low_threshold",
		  "83xx05": "temperature_limit_task_settings._item.high_threshold",
		  "84xx": "night_task_settings._item",
		  "84xx00": "night_task_settings._item.enable",
		  "84xx01": "night_task_settings._item.task_date_settings",
		  "84xx02": "night_task_settings._item.execute_period",
		  "84xx03": "night_task_settings._item.cycle_settings",
		  "84xx04": "night_task_settings._item.breaker_control",
		  "84xx05": "night_task_settings._item.control_command",
		  "84xx06": "night_task_settings._item.execute_condition",
		  "85xx": "vacation_task_settings._item",
		  "85xx00": "vacation_task_settings._item.enable",
		  "85xx01": "vacation_task_settings._item.task_date_settings",
		  "85xx02": "vacation_task_settings._item.execute_period",
		  "85xx03": "vacation_task_settings._item.cycle_settings",
		  "85xx04": "vacation_task_settings._item.breaker_control",
		  "85xx05": "vacation_task_settings._item.execute_condition",
		  "8a": "ct_sensor_settings",
		  "8a00": "ct_sensor_settings.connected",
		  "8a01": "ct_sensor_settings.collect_period",
		  "8b": "filter_clean_settings",
		  "8b00": "filter_clean_settings.enable",
		  "8b01": "filter_clean_settings.reminder_period",
		  "8e": "infrared_format_code",
		  "93xx": "dormant_settings._item",
		  "93xx00": "dormant_settings._item.enable",
		  "93xx01": "dormant_settings._item.heating_date_settings",
		  "c7": "time_zone",
		  "c6": "daylight_saving_time",
		  "98xx": "d2d_slave_settings._item",
		  "b6": "reconnect",
		  "b7": "set_time",
		  "b5": "collect_data",
		  "bd": "clear_historical_data",
		  "bc": "stop_historical_data_retrieval",
		  "bb": "retrieve_historical_data_by_time_range",
		  "be": "reboot",
		  "5f": "delete_task_plan",
		  "5c": "insert_temporary_plan",
		  "5b": "filter_clean_alarm",
		  "5a": "open_window_alarm"
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
    "temperature_alarm.outside_range_alarm_trigger.temperature": {
        "precision": 2,
        "unitName": "℃"
    },
    "temperature_alarm.outside_range_alarm_deactivation.temperature": {
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
    "infrared_cmd_status.target_temp": {
        "precision": 2,
        "unitName": "℃"
    },
    "internal_temp": {
        "precision": 2,
        "unitName": "℃"
    },
    "external_temp": {
        "precision": 2,
        "unitName": "℃"
    },
    "cmd_temp_limit.lower_range_alarm_trigger.low_threshold": {
        "precision": 2,
        "unitName": "℃"
    },
    "cmd_temp_limit.lower_range_alarm_trigger.high_threshold": {
        "precision": 2,
        "unitName": "℃"
    },
    "cmd_temp_limit.over_range_alarm_trigger.low_threshold": {
        "precision": 2,
        "unitName": "℃"
    },
    "cmd_temp_limit.over_range_alarm_trigger.high_threshold": {
        "precision": 2,
        "unitName": "℃"
    },
    "local_temp_limit.lower_range_alarm_trigger.low_threshold": {
        "precision": 2,
        "unitName": "℃"
    },
    "local_temp_limit.lower_range_alarm_trigger.high_threshold": {
        "precision": 2,
        "unitName": "℃"
    },
    "local_temp_limit.over_range_alarm_trigger.low_threshold": {
        "precision": 2,
        "unitName": "℃"
    },
    "local_temp_limit.over_range_alarm_trigger.high_threshold": {
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
    "target_temperature_tolerance.target_value": {
        "precision": 2,
        "unitName": "K"
    },
    "schedule_settings._item.target_temp": {
        "precision": 2,
        "unitName": "℃"
    },
    "window_opening_detection_settings.difference_in_temperature": {
        "precision": 2,
        "unitName": "℃"
    },
    "continuous_high_temp_alarm_settings.difference": {
        "precision": 2,
        "unitName": "℃"
    },
    "continuous_low_temp_alarm_settings.difference": {
        "precision": 2,
        "unitName": "℃"
    },
    "temperature_alarm_settings.threshold_min": {
        "precision": 2,
        "unitName": "℃"
    },
    "temperature_alarm_settings.threshold_max": {
        "precision": 2,
        "unitName": "℃"
    },
    "temperature_limit_task_settings._item.low_threshold": {
        "precision": 2,
        "unitName": "℃"
    },
    "temperature_limit_task_settings._item.high_threshold": {
        "precision": 2,
        "unitName": "℃"
    },
    "internal_sensor_settings.temp_calibration": {
        "precision": 2,
        "unitName": "℃"
    },
    "external_sensor_settings.temp_calibration": {
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
			}
		}
	}
	return decoded;
}