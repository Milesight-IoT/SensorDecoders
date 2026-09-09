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
				decoded.ipso_device_upgrade = decoded.ipso_device_upgrade || {};
				decoded.ipso_device_upgrade.firmwares = readBytes(bytes, counterObj, 0);
				decoded.ipso_device_upgrade.firmwares._item.base_version = readString(bytes, counterObj, 2);
				decoded.ipso_device_upgrade.firmwares._item.target_version = readString(bytes, counterObj, 2);
				decoded.ipso_device_upgrade.firmwares._item.size = readUInt16LE(bytes, counterObj, 2);
				decoded.ipso_device_upgrade.firmwares._item.crc32 = readUInt32LE(bytes, counterObj, 4);
				decoded.ipso_device_upgrade.firmwares._item.url_length = readUInt8(bytes, counterObj, 1);
				decoded.ipso_device_upgrade.firmwares._item.url = readString(bytes, counterObj, 160);
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
					// 0：Not Joined, 1：Joined
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
				// 0：Reset BLE Name , 1：Cancel Pairing
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
					decoded.temperature_alarm.window_status_detection_deactivation = decoded.temperature_alarm.window_status_detection_deactivation || {};
					decoded.temperature_alarm.window_status_detection_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (decoded.temperature_alarm.type == 0x01) {
					decoded.temperature_alarm.window_status_detection_trigger = decoded.temperature_alarm.window_status_detection_trigger || {};
					decoded.temperature_alarm.window_status_detection_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 100;
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
					decoded.temperature_alarm.persistent_low_temperature_alarm_deactivation = decoded.temperature_alarm.persistent_low_temperature_alarm_deactivation || {};
					decoded.temperature_alarm.persistent_low_temperature_alarm_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (decoded.temperature_alarm.type == 0x31) {
					decoded.temperature_alarm.persistent_low_temperature_alarm_trigger = decoded.temperature_alarm.persistent_low_temperature_alarm_trigger || {};
					decoded.temperature_alarm.persistent_low_temperature_alarm_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (decoded.temperature_alarm.type == 0x40) {
					decoded.temperature_alarm.persistent_high_alarm_deactivation = decoded.temperature_alarm.persistent_high_alarm_deactivation || {};
					decoded.temperature_alarm.persistent_high_alarm_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (decoded.temperature_alarm.type == 0x41) {
					decoded.temperature_alarm.persistent_high_alarm_trigger = decoded.temperature_alarm.persistent_high_alarm_trigger || {};
					decoded.temperature_alarm.persistent_high_alarm_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				}
				break;
			case 0x03:
				decoded.sensor_error = decoded.sensor_error || {};
				decoded.sensor_error.type = readUInt8(bytes, counterObj, 1);
				if (decoded.sensor_error.type == 0x00) {
					decoded.sensor_error.internal_sensor_collect_error = decoded.sensor_error.internal_sensor_collect_error || {};
				}
				if (decoded.sensor_error.type == 0x10) {
					decoded.sensor_error.external_sensor_collect_error = decoded.sensor_error.external_sensor_collect_error || {};
				}
				if (decoded.sensor_error.type == 0x20) {
					decoded.sensor_error.humi_collect_error = decoded.sensor_error.humi_collect_error || {};
				}
				if (decoded.sensor_error.type == 0x01) {
					decoded.sensor_error.internal_sensor_lower_ranger_error = decoded.sensor_error.internal_sensor_lower_ranger_error || {};
				}
				if (decoded.sensor_error.type == 0x11) {
					decoded.sensor_error.external_sensor_lower_ranger_error = decoded.sensor_error.external_sensor_lower_ranger_error || {};
				}
				if (decoded.sensor_error.type == 0x21) {
					decoded.sensor_error.humi_lower_ranger_error = decoded.sensor_error.humi_lower_ranger_error || {};
				}
				if (decoded.sensor_error.type == 0x02) {
					decoded.sensor_error.internal_sensor_over_ranger_error = decoded.sensor_error.internal_sensor_over_ranger_error || {};
				}
				if (decoded.sensor_error.type == 0x12) {
					decoded.sensor_error.external_sensor_over_ranger_error = decoded.sensor_error.external_sensor_over_ranger_error || {};
				}
				if (decoded.sensor_error.type == 0x22) {
					decoded.sensor_error.humi_over_ranger_error = decoded.sensor_error.humi_over_ranger_error || {};
				}
				break;
			case 0x04:
				decoded.infrared_cmd_status = decoded.infrared_cmd_status || {};
				decoded.infrared_cmd_status.cmd = decoded.infrared_cmd_status.cmd || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0: Switch Off, 1: Switch On
				decoded.infrared_cmd_status.cmd.switch = extractBits(bitOptions, 0, 1);
				// 0：heat, 1：em heat, 2：cool, 3：auto, 4：dehumidify, 5：ventilation
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
					decoded.running_state.current_transformer.current = readInt32LE(bytes, counterObj, 4) / 1000;
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
					decoded.cmd_temp_limit.lower_range_alarm_trigger.ambient_temp = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (decoded.cmd_temp_limit.type == 0x01) {
					decoded.cmd_temp_limit.over_range_alarm_trigger = decoded.cmd_temp_limit.over_range_alarm_trigger || {};
					decoded.cmd_temp_limit.over_range_alarm_trigger.low_threshold = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.cmd_temp_limit.over_range_alarm_trigger.high_threshold = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.cmd_temp_limit.over_range_alarm_trigger.ambient_temp = readInt16LE(bytes, counterObj, 2) / 100;
				}
				break;
			case 0x0b:
				decoded.local_temp_limit = decoded.local_temp_limit || {};
				decoded.local_temp_limit.type = readUInt8(bytes, counterObj, 1);
				if (decoded.local_temp_limit.type == 0x00) {
					decoded.local_temp_limit.lower_range_alarm_trigger = decoded.local_temp_limit.lower_range_alarm_trigger || {};
					decoded.local_temp_limit.lower_range_alarm_trigger.low_threshold = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.local_temp_limit.lower_range_alarm_trigger.high_threshold = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.local_temp_limit.lower_range_alarm_trigger.ambient_temp = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (decoded.local_temp_limit.type == 0x01) {
					decoded.local_temp_limit.over_range_alarm_trigger = decoded.local_temp_limit.over_range_alarm_trigger || {};
					decoded.local_temp_limit.over_range_alarm_trigger.low_threshold = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.local_temp_limit.over_range_alarm_trigger.high_threshold = readInt16LE(bytes, counterObj, 2) / 100;
					decoded.local_temp_limit.over_range_alarm_trigger.ambient_temp = readInt16LE(bytes, counterObj, 2) / 100;
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
					// 0：heat, 2：cool, 3：auto, 4：dehumidify, 5：ventilation
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
			case 0x6a:
				decoded.temperature_data_source = decoded.temperature_data_source || {};
				var temperature_data_source_command = readUInt8(bytes, counterObj, 1);
				if (temperature_data_source_command == 0x00) {
					// 0: External Temperature Sensor, 4: Internal Temperature Sensor
					decoded.temperature_data_source.source = readUInt8(bytes, counterObj, 1);
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
					// 0：Auto, 1：Ventilation, 2：Always Open, 3：Low, 4：Medium, 5：High
					decoded.fan_settings.fan_mode = readUInt8(bytes, counterObj, 1);
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
					// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8, 8：Schedule9, 9：Schedule10, 10：Schedule11, 11：Schedule12, 12：Schedule13, 13：Schedule14, 14：Schedule15, 15：Schedule16, 255：Not Chosen
					vacation_task_settings_item.ir_command = readUInt8(bytes, counterObj, 1);
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
				if (internal_sensor_settings_command == 0x05) {
					decoded.internal_sensor_settings.temp_calibration = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (internal_sensor_settings_command == 0x07) {
					decoded.internal_sensor_settings.humi_calibration = readInt16LE(bytes, counterObj, 2) / 10;
				}
				break;
			case 0x89:
				decoded.external_sensor_settings = decoded.external_sensor_settings || {};
				var external_sensor_settings_command = readUInt8(bytes, counterObj, 1);
				if (external_sensor_settings_command == 0x06) {
					// 0：Disable, 1：Enable
					decoded.external_sensor_settings.enable = readUInt8(bytes, counterObj, 1);
				}
				if (external_sensor_settings_command == 0x00) {
					decoded.external_sensor_settings.name1 = readString(bytes, counterObj, 6);
				}
				if (external_sensor_settings_command == 0x01) {
					decoded.external_sensor_settings.name2 = readString(bytes, counterObj, 6);
				}
				if (external_sensor_settings_command == 0x02) {
					decoded.external_sensor_settings.name3 = readString(bytes, counterObj, 6);
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
				if (ct_sensor_settings_command == 0x02) {
					decoded.ct_sensor_settings.collect_threshold = readUInt16LE(bytes, counterObj, 2);
				}
				if (ct_sensor_settings_command == 0x03) {
					// 0: Wall mounted machine, 1: Vertical cabinet machine, 2: Ceiling machine
					decoded.ct_sensor_settings.ac_type = readUInt8(bytes, counterObj, 1);
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
			case 0x8c:
				decoded.lora_tx_max_random_time = readUInt8(bytes, counterObj, 1);
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
				// 0：Task1
				decoded.delete_temperature_limit_task.type = readUInt8(bytes, counterObj, 1);
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

function processTemperature(decoded) {}

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

function cmdMap() {
	return {
		  "30": "data_transparent",
		  "55": "trigger_infrared_learn",
		  "56": "delete_vacation_task",
		  "58": "delete_temperature_limit_task",
		  "59": "clear_infrared_format_code",
		  "60": "temperature_control_mode",
		  "61": "target_temperature_settings",
		  "62": "target_temperature_tolerance",
		  "65": "target_temperature_resolution",
		  "66": "reporting_interval",
		  "70": "fan_settings",
		  "75": "temperature_control_mode_enable",
		  "80": "indicator_light_disable_settings",
		  "81": "enhanced_infrared_emission_power_enable",
		  "82": "air_power_settings",
		  "83": "temperature_limit_task_settings",
		  "85": "vacation_task_settings",
		  "86": "infrared_learn",
		  "88": "internal_sensor_settings",
		  "89": "external_sensor_settings",
		  "90": "ble_adv_time_settings",
		  "91": "communication_mode",
		  "92": "battery_enable",
		  "93": "dormant_settings",
		  "3000": "data_transparent.res_cmd1",
		  "6000": "temperature_control_mode.ctrl_mode",
		  "6001": "temperature_control_mode.plan_enable",
		  "6100": "target_temperature_settings.heat",
		  "6102": "target_temperature_settings.cool",
		  "6103": "target_temperature_settings.auto",
		  "6200": "target_temperature_tolerance.target_value",
		  "6600": "reporting_interval.ble_lora",
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
		  "8805": "internal_sensor_settings.temp_calibration",
		  "8807": "internal_sensor_settings.humi_calibration",
		  "8900": "external_sensor_settings.name1",
		  "8901": "external_sensor_settings.name2",
		  "8902": "external_sensor_settings.name3",
		  "8905": "external_sensor_settings.temp_calibration",
		  "8906": "external_sensor_settings.enable",
		  "9000": "ble_adv_time_settings.enable",
		  "9001": "ble_adv_time_settings.duration",
		  "300000": "data_transparent.res_cmd1.battery",
		  "660000": "reporting_interval.ble_lora.seconds_of_time",
		  "660001": "reporting_interval.ble_lora.minutes_of_time",
		  "ff": "request_check_sequence_number",
		  "fe": "request_check_order",
		  "ef": "request_command_queries",
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
		  "0200": "temperature_alarm.window_status_detection_deactivation",
		  "0201": "temperature_alarm.window_status_detection_trigger",
		  "0220": "temperature_alarm.over_range_alarm_trigger",
		  "0221": "temperature_alarm.over_range_alarm_deactivation",
		  "0222": "temperature_alarm.lower_range_alarm_trigger",
		  "0223": "temperature_alarm.lower_range_alarm_deactivation",
		  "0224": "temperature_alarm.within_range_alarm_trigger",
		  "0225": "temperature_alarm.within_range_alarm_deactivation",
		  "0226": "temperature_alarm.outside_range_alarm_trigger",
		  "0227": "temperature_alarm.outside_range_alarm_deactivation",
		  "0230": "temperature_alarm.persistent_low_temperature_alarm_deactivation",
		  "0231": "temperature_alarm.persistent_low_temperature_alarm_trigger",
		  "0240": "temperature_alarm.persistent_high_alarm_deactivation",
		  "0241": "temperature_alarm.persistent_high_alarm_trigger",
		  "03": "sensor_error",
		  "0300": "sensor_error.internal_sensor_collect_error",
		  "0310": "sensor_error.external_sensor_collect_error",
		  "0320": "sensor_error.humi_collect_error",
		  "0301": "sensor_error.internal_sensor_lower_ranger_error",
		  "0311": "sensor_error.external_sensor_lower_ranger_error",
		  "0321": "sensor_error.humi_lower_ranger_error",
		  "0302": "sensor_error.internal_sensor_over_ranger_error",
		  "0312": "sensor_error.external_sensor_over_ranger_error",
		  "0322": "sensor_error.humi_over_ranger_error",
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
		  "6a": "temperature_data_source",
		  "6a00": "temperature_data_source.source",
		  "6f": "system_switch",
		  "83xx": "temperature_limit_task_settings._item",
		  "83xx00": "temperature_limit_task_settings._item.enable",
		  "83xx01": "temperature_limit_task_settings._item.task_date_settings",
		  "83xx02": "temperature_limit_task_settings._item.execute_period",
		  "83xx03": "temperature_limit_task_settings._item.cycle_settings",
		  "83xx04": "temperature_limit_task_settings._item.low_threshold",
		  "83xx05": "temperature_limit_task_settings._item.high_threshold",
		  "85xx": "vacation_task_settings._item",
		  "85xx00": "vacation_task_settings._item.enable",
		  "85xx01": "vacation_task_settings._item.task_date_settings",
		  "85xx02": "vacation_task_settings._item.execute_period",
		  "85xx03": "vacation_task_settings._item.cycle_settings",
		  "85xx04": "vacation_task_settings._item.ir_command",
		  "8a": "ct_sensor_settings",
		  "8a00": "ct_sensor_settings.connected",
		  "8a01": "ct_sensor_settings.collect_period",
		  "8a02": "ct_sensor_settings.collect_threshold",
		  "8a03": "ct_sensor_settings.ac_type",
		  "8b": "filter_clean_settings",
		  "8b00": "filter_clean_settings.enable",
		  "8b01": "filter_clean_settings.reminder_period",
		  "8c": "lora_tx_max_random_time",
		  "8e": "infrared_format_code",
		  "93xx": "dormant_settings._item",
		  "93xx00": "dormant_settings._item.enable",
		  "93xx01": "dormant_settings._item.heating_date_settings",
		  "c7": "time_zone",
		  "b6": "reconnect",
		  "b7": "set_time",
		  "b5": "collect_data",
		  "bd": "clear_historical_data",
		  "bc": "stop_historical_data_retrieval",
		  "bb": "retrieve_historical_data_by_time_range",
		  "be": "reboot",
		  "5b": "filter_clean_alarm",
		  "5a": "open_window_alarm"
	};
}
