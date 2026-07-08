/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product UC701
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
	//0xfd
	if ('request_security_password_check' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xfd);
		if (payload.request_security_password_check.length < 0 || payload.request_security_password_check.length > 255) {
			throw new Error('request_security_password_check.length must be between 0 and 255');
		}
		buffer.writeUInt8(payload.request_security_password_check.length);
		buffer.writeString(payload.request_security_password_check.password, payload.request_security_password_check.length, true);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xfc
	if ('request_security_password_change' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xfc);
		if (payload.request_security_password_change.length < 0 || payload.request_security_password_change.length > 255) {
			throw new Error('request_security_password_change.length must be between 0 and 255');
		}
		buffer.writeUInt8(payload.request_security_password_change.length);
		buffer.writeString(payload.request_security_password_change.new_password, payload.request_security_password_change.length, true);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xfb
	if ('request_password_check' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xfb);
		buffer.writeString(payload.request_password_check.password, 6);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xfa
	if ('request_password_change' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xfa);
		buffer.writeString(payload.request_password_change.new_password, 6);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf7
	if ('request_firmware_upgrade' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.request_firmware_upgrade.start_upgrade)) {
			buffer.writeUInt8(0xf7);
			buffer.writeUInt8(0x00);
			if ([0, 1, 2].indexOf(payload.request_firmware_upgrade.start_upgrade.type) === -1) {
				throw new Error('request_firmware_upgrade.start_upgrade.type must be one of [0, 1, 2]');
			}
			// 0：all, 1：diff, 2：module
			buffer.writeUInt8(payload.request_firmware_upgrade.start_upgrade.type);
			if (payload.request_firmware_upgrade.start_upgrade.length < 0 || payload.request_firmware_upgrade.start_upgrade.length > 255) {
				throw new Error('request_firmware_upgrade.start_upgrade.length must be between 0 and 255');
			}
			buffer.writeUInt8(payload.request_firmware_upgrade.start_upgrade.length);
			buffer.writeBytes(payload.request_firmware_upgrade.start_upgrade.check_data, payload.request_firmware_upgrade.start_upgrade.length, true);
		}
		if (isValid(payload.request_firmware_upgrade.transmission)) {
			buffer.writeUInt8(0xf7);
			buffer.writeUInt8(0x01);
			if (payload.request_firmware_upgrade.transmission.length < 1 || payload.request_firmware_upgrade.transmission.length > 65535) {
				throw new Error('request_firmware_upgrade.transmission.length must be between 1 and 65535');
			}
			buffer.writeUInt16LE(payload.request_firmware_upgrade.transmission.length);
			buffer.writeBytes(payload.request_firmware_upgrade.transmission.data, payload.request_firmware_upgrade.transmission.length, true);
		}
		if (isValid(payload.request_firmware_upgrade.end_upgrade)) {
			buffer.writeUInt8(0xf7);
			buffer.writeUInt8(0x02);
		}
		if (isValid(payload.request_firmware_upgrade.continue_upgrade)) {
			buffer.writeUInt8(0xf7);
			buffer.writeUInt8(0x03);
		}
		if (isValid(payload.request_firmware_upgrade.completion_check)) {
			buffer.writeUInt8(0xf7);
			buffer.writeUInt8(0x04);
			if (payload.request_firmware_upgrade.completion_check.length < 1 || payload.request_firmware_upgrade.completion_check.length > 65535) {
				throw new Error('request_firmware_upgrade.completion_check.length must be between 1 and 65535');
			}
			buffer.writeUInt16LE(payload.request_firmware_upgrade.completion_check.length);
			buffer.writeBytes(payload.request_firmware_upgrade.completion_check.data, payload.request_firmware_upgrade.completion_check.length, true);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf6
	if ('request_preconfiguration' in payload) {
		var buffer = new Buffer();
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf5
	if ('request_historical_data_export' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.request_historical_data_export.start_exporting)) {
			buffer.writeUInt8(0xf5);
			buffer.writeUInt8(0x10);
			buffer.writeUInt32LE(payload.request_historical_data_export.start_exporting.start_timestamp);
			buffer.writeUInt32LE(payload.request_historical_data_export.start_exporting.end_timestamp);
			buffer.writeUInt32LE(payload.request_historical_data_export.start_exporting.current_timestamp);
		}
		if (isValid(payload.request_historical_data_export.exported_data)) {
			buffer.writeUInt8(0xf5);
			buffer.writeUInt8(0x11);
		}
		if (isValid(payload.request_historical_data_export.end_exporting)) {
			buffer.writeUInt8(0xf5);
			buffer.writeUInt8(0x12);
		}
		if (isValid(payload.request_historical_data_export.exported_all_data)) {
			buffer.writeUInt8(0xf5);
			buffer.writeUInt8(0x13);
		}
		if (isValid(payload.request_historical_data_export.start_exporting_with_type)) {
			buffer.writeUInt8(0xf5);
			buffer.writeUInt8(0x14);
			buffer.writeUInt8(payload.request_historical_data_export.start_exporting_with_type.type);
			buffer.writeUInt32LE(payload.request_historical_data_export.start_exporting_with_type.start_timestamp);
			buffer.writeUInt32LE(payload.request_historical_data_export.start_exporting_with_type.end_timestamp);
			buffer.writeUInt32LE(payload.request_historical_data_export.start_exporting_with_type.current_timestamp);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xf4
	if ('request_full_inspection' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.request_full_inspection.start_inspection)) {
			buffer.writeUInt8(0xf4);
			buffer.writeUInt8(0x00);
		}
		if (isValid(payload.request_full_inspection.control)) {
			buffer.writeUInt8(0xf4);
			buffer.writeUInt8(0x01);
			if (payload.request_full_inspection.control.length < 0 || payload.request_full_inspection.control.length > 65535) {
				throw new Error('request_full_inspection.control.length must be between 0 and 65535');
			}
			buffer.writeUInt16LE(payload.request_full_inspection.control.length);
			buffer.writeBytes(payload.request_full_inspection.control.data, payload.request_full_inspection.control.length, true);
		}
		if (isValid(payload.request_full_inspection.reading)) {
			buffer.writeUInt8(0xf4);
			buffer.writeUInt8(0x02);
			buffer.writeUInt16LE(payload.request_full_inspection.reading.length);
			buffer.writeBytes(payload.request_full_inspection.reading.data, payload.request_full_inspection.reading.length, true);
		}
		if (isValid(payload.request_full_inspection.end_inspection)) {
			buffer.writeUInt8(0xf4);
			buffer.writeUInt8(0x03);
		}
		if (isValid(payload.request_full_inspection.aging)) {
			buffer.writeUInt8(0xf4);
			buffer.writeUInt8(0x04);
		}
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
	//0xec
	if ('ipso_device_upgrade' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xec);
		buffer.writeBytes(payload.ipso_device_upgrade.firmwares, 0);
		buffer.writeString(payload.ipso_device_upgrade.firmwares._item.base_version, 2);
		buffer.writeString(payload.ipso_device_upgrade.firmwares._item.target_version, 2);
		buffer.writeUInt16LE(payload.ipso_device_upgrade.firmwares._item.size);
		buffer.writeUInt32LE(payload.ipso_device_upgrade.firmwares._item.crc32);
		buffer.writeUInt8(payload.ipso_device_upgrade.firmwares._item.url_length);
		buffer.writeString(payload.ipso_device_upgrade.firmwares._item.url, 160);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xeb
	if ('debugging_commands' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xeb);
		if (payload.debugging_commands.length < 1 || payload.debugging_commands.length > 65535) {
			throw new Error('debugging_commands.length must be between 1 and 65535');
		}
		buffer.writeUInt16LE(payload.debugging_commands.length);
		buffer.writeString(payload.debugging_commands.content, payload.debugging_commands.length, true);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xcf
	if ('lorawan_configuration_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.lorawan_configuration_settings.appeui)) {
			buffer.writeUInt8(0xcf);
			buffer.writeUInt8(0x13);
			buffer.writeHexString(payload.lorawan_configuration_settings.appeui, 8);
		}
		if (isValid(payload.lorawan_configuration_settings.netid)) {
			buffer.writeUInt8(0xcf);
			buffer.writeUInt8(0x03);
			buffer.writeHexString(payload.lorawan_configuration_settings.netid, 3);
		}
		if (isValid(payload.lorawan_configuration_settings.app_port)) {
			buffer.writeUInt8(0xcf);
			buffer.writeUInt8(0x5c);
			if (payload.lorawan_configuration_settings.app_port < 1 || payload.lorawan_configuration_settings.app_port > 223) {
				throw new Error('lorawan_configuration_settings.app_port must be between 1 and 223');
			}
			buffer.writeUInt8(payload.lorawan_configuration_settings.app_port);
		}
		if (isValid(payload.lorawan_configuration_settings.version)) {
			buffer.writeUInt8(0xcf);
			// 1：1.0.2, 2：1.0.3, 3：1.0.3, 4：1.0.4
			buffer.writeUInt8(0xd8);
			if ([1, 2, 3, 4].indexOf(payload.lorawan_configuration_settings.version) === -1) {
				throw new Error('lorawan_configuration_settings.version must be one of [1, 2, 3, 4]');
			}
			// 1：1.0.2, 2：1.0.3, 3：1.0.3, 4：1.0.4
			buffer.writeUInt8(payload.lorawan_configuration_settings.version);
		}
		if (isValid(payload.lorawan_configuration_settings.mode)) {
			buffer.writeUInt8(0xcf);
			// 0:ClassA, 1:ClassB, 2:ClassC, 3:ClassC to B
			buffer.writeUInt8(0x00);
			if ([0, 1, 2, 3].indexOf(payload.lorawan_configuration_settings.mode) === -1) {
				throw new Error('lorawan_configuration_settings.mode must be one of [0, 1, 2, 3]');
			}
			// 0:ClassA, 1:ClassB, 2:ClassC, 3:ClassC to B
			buffer.writeUInt8(payload.lorawan_configuration_settings.mode);
		}
		if (isValid(payload.lorawan_configuration_settings.confirmed_mode)) {
			buffer.writeUInt8(0xcf);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x5d);
			if ([0, 1].indexOf(payload.lorawan_configuration_settings.confirmed_mode) === -1) {
				throw new Error('lorawan_configuration_settings.confirmed_mode must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.lorawan_configuration_settings.confirmed_mode);
		}
		if (isValid(payload.lorawan_configuration_settings.ack_retry_times)) {
			buffer.writeUInt8(0xcf);
			buffer.writeUInt8(0xc6);
			if (payload.lorawan_configuration_settings.ack_retry_times < 1 || payload.lorawan_configuration_settings.ack_retry_times > 15) {
				throw new Error('lorawan_configuration_settings.ack_retry_times must be between 1 and 15');
			}
			buffer.writeUInt8(payload.lorawan_configuration_settings.ack_retry_times);
		}
		if (isValid(payload.lorawan_configuration_settings.join_type)) {
			buffer.writeUInt8(0xcf);
			// 0：ABP, 1：OTAA
			buffer.writeUInt8(0x01);
			if ([0, 1].indexOf(payload.lorawan_configuration_settings.join_type) === -1) {
				throw new Error('lorawan_configuration_settings.join_type must be one of [0, 1]');
			}
			// 0：ABP, 1：OTAA
			buffer.writeUInt8(payload.lorawan_configuration_settings.join_type);
		}
		if (isValid(payload.lorawan_configuration_settings.appkey)) {
			buffer.writeUInt8(0xcf);
			buffer.writeUInt8(0x3b);
			buffer.writeHexString(payload.lorawan_configuration_settings.appkey, 16);
		}
		if (isValid(payload.lorawan_configuration_settings.nwkskey)) {
			buffer.writeUInt8(0xcf);
			buffer.writeUInt8(0x1b);
			buffer.writeHexString(payload.lorawan_configuration_settings.nwkskey, 16);
		}
		if (isValid(payload.lorawan_configuration_settings.appskey)) {
			buffer.writeUInt8(0xcf);
			buffer.writeUInt8(0x2b);
			buffer.writeHexString(payload.lorawan_configuration_settings.appskey, 16);
		}
		if (isValid(payload.lorawan_configuration_settings.devaddr)) {
			buffer.writeUInt8(0xcf);
			buffer.writeUInt8(0x07);
			buffer.writeHexString(payload.lorawan_configuration_settings.devaddr, 4);
		}
		if (isValid(payload.lorawan_configuration_settings.rejoin_mode_enable)) {
			buffer.writeUInt8(0xcf);
			// 0：disable, 1：enable
			buffer.writeUInt8(0xda);
			if ([0, 1].indexOf(payload.lorawan_configuration_settings.rejoin_mode_enable) === -1) {
				throw new Error('lorawan_configuration_settings.rejoin_mode_enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.lorawan_configuration_settings.rejoin_mode_enable);
		}
		if (isValid(payload.lorawan_configuration_settings.number_of_link_detection_signals)) {
			buffer.writeUInt8(0xcf);
			buffer.writeUInt8(0xd9);
			if (payload.lorawan_configuration_settings.number_of_link_detection_signals < 4 || payload.lorawan_configuration_settings.number_of_link_detection_signals > 32) {
				throw new Error('lorawan_configuration_settings.number_of_link_detection_signals must be between 4 and 32');
			}
			buffer.writeUInt8(payload.lorawan_configuration_settings.number_of_link_detection_signals);
		}
		if (isValid(payload.lorawan_configuration_settings.frequency_band)) {
			buffer.writeUInt8(0xcf);
			// 0：CN470, 2：AS923, 3：AU915, 4：EU868, 5：KR920, 6：IN865, 7：US915, 10：RU864
			buffer.writeUInt8(0xcd);
			if ([0, 2, 3, 4, 5, 6, 7, 10].indexOf(payload.lorawan_configuration_settings.frequency_band) === -1) {
				throw new Error('lorawan_configuration_settings.frequency_band must be one of [0, 2, 3, 4, 5, 6, 7, 10]');
			}
			// 0：CN470, 2：AS923, 3：AU915, 4：EU868, 5：KR920, 6：IN865, 7：US915, 10：RU864
			buffer.writeUInt8(payload.lorawan_configuration_settings.frequency_band);
		}
		if (isValid(payload.lorawan_configuration_settings.AS923_frequency_band_in_use)) {
			buffer.writeUInt8(0xcf);
			// 0：AS923-1, 1：AS923-2, 2：AS923-3, 3：AS923-4
			buffer.writeUInt8(0xdc);
			if ([0, 1, 2, 3].indexOf(payload.lorawan_configuration_settings.AS923_frequency_band_in_use) === -1) {
				throw new Error('lorawan_configuration_settings.AS923_frequency_band_in_use must be one of [0, 1, 2, 3]');
			}
			// 0：AS923-1, 1：AS923-2, 2：AS923-3, 3：AS923-4
			buffer.writeUInt8(payload.lorawan_configuration_settings.AS923_frequency_band_in_use);
		}
		if (isValid(payload.lorawan_configuration_settings.channel_mask)) {
			buffer.writeUInt8(0xcf);
			buffer.writeUInt8(0x5e);
			buffer.writeHexString(payload.lorawan_configuration_settings.channel_mask, 12);
		}
		for (var channels_settings_id = 0; channels_settings_id < (payload.lorawan_configuration_settings.channels_settings && payload.lorawan_configuration_settings.channels_settings.length); channels_settings_id++) {
			var channels_settings_item = payload.lorawan_configuration_settings.channels_settings[channels_settings_id];
			var channels_settings_item_id = channels_settings_item.index;
			buffer.writeUInt8(0xcf);
			buffer.writeUInt8(0x6a);
			if ([0, 1].indexOf(channels_settings_item.enable) === -1) {
				throw new Error('enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(channels_settings_item.enable);
			if (channels_settings_item.frequency < 0 || channels_settings_item.frequency > 4294967295) {
				throw new Error('frequency must be in range [0,4294967295]');
			}
			buffer.writeUInt32LE(channels_settings_item.frequency * 1000000);
			var bitOptions = 0;
			// 0：DR0(SF12,125kHz), 1：DR1(SF11,125kHz), 2：DR2(SF10,125kHz), 3：DR3(SF9,125kHz), 4：DR4(SF8,125kHz), 5：DR5(SF7,125kHz)
			bitOptions |= channels_settings_item.data_rate_max << 4;

			// 0：DR0(SF12,125kHz), 1：DR1(SF11,125kHz), 2：DR2(SF10,125kHz), 3：DR3(SF9,125kHz), 4：DR4(SF8,125kHz), 5：DR5(SF7,125kHz)
			bitOptions |= channels_settings_item.data_rate_min << 0;
			buffer.writeUInt8(bitOptions);

		}
		if (isValid(payload.lorawan_configuration_settings.adr_mode)) {
			buffer.writeUInt8(0xcf);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x02);
			if ([0, 1].indexOf(payload.lorawan_configuration_settings.adr_mode) === -1) {
				throw new Error('lorawan_configuration_settings.adr_mode must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.lorawan_configuration_settings.adr_mode);
		}
		if (isValid(payload.lorawan_configuration_settings.tx_data_rate)) {
			buffer.writeUInt8(0xcf);
			// 0：DR0(SF12,125kHz), 1：DR1(SF11,125kHz), 2：DR2(SF10,125kHz), 3：DR3(SF9,125kHz), 4：DR4(SF8,125kHz), 5：DR5(SF7,125kHz)
			buffer.writeUInt8(0xba);
			if ([0, 1, 2, 3, 4, 5].indexOf(payload.lorawan_configuration_settings.tx_data_rate) === -1) {
				throw new Error('lorawan_configuration_settings.tx_data_rate must be one of [0, 1, 2, 3, 4, 5]');
			}
			// 0：DR0(SF12,125kHz), 1：DR1(SF11,125kHz), 2：DR2(SF10,125kHz), 3：DR3(SF9,125kHz), 4：DR4(SF8,125kHz), 5：DR5(SF7,125kHz)
			buffer.writeUInt8(payload.lorawan_configuration_settings.tx_data_rate);
		}
		if (isValid(payload.lorawan_configuration_settings.tx_power)) {
			buffer.writeUInt8(0xcf);
			// 0：TXPOWER0-16dBm, 1：TXPOWER1-14dBm, 2：TXPOWER2-12dBm, 3：TXPOWER3-10dBm, 4：TXPOWER4-8dBm, 5：TXPOWER5-6dBm, 6：TXPOWER6-4dBm, 7：TXPOWER7-2dBm
			buffer.writeUInt8(0x5b);
			if ([0, 1, 2, 3, 4, 5, 6, 7].indexOf(payload.lorawan_configuration_settings.tx_power) === -1) {
				throw new Error('lorawan_configuration_settings.tx_power must be one of [0, 1, 2, 3, 4, 5, 6, 7]');
			}
			// 0：TXPOWER0-16dBm, 1：TXPOWER1-14dBm, 2：TXPOWER2-12dBm, 3：TXPOWER3-10dBm, 4：TXPOWER4-8dBm, 5：TXPOWER5-6dBm, 6：TXPOWER6-4dBm, 7：TXPOWER7-2dBm
			buffer.writeUInt8(payload.lorawan_configuration_settings.tx_power);
		}
		if (isValid(payload.lorawan_configuration_settings.rx2_data_rate)) {
			buffer.writeUInt8(0xcf);
			// 0：DR0(SF12,125kHz), 1：DR1(SF11,125kHz), 2：DR2(SF10,125kHz), 3：DR3(SF9,125kHz), 4：DR4(SF8,125kHz), 5：DR5(SF7,125kHz)
			buffer.writeUInt8(0xbf);
			if ([0, 1, 2, 3, 4, 5].indexOf(payload.lorawan_configuration_settings.rx2_data_rate) === -1) {
				throw new Error('lorawan_configuration_settings.rx2_data_rate must be one of [0, 1, 2, 3, 4, 5]');
			}
			// 0：DR0(SF12,125kHz), 1：DR1(SF11,125kHz), 2：DR2(SF10,125kHz), 3：DR3(SF9,125kHz), 4：DR4(SF8,125kHz), 5：DR5(SF7,125kHz)
			buffer.writeUInt8(payload.lorawan_configuration_settings.rx2_data_rate);
		}
		if (isValid(payload.lorawan_configuration_settings.rx2_frequency)) {
			buffer.writeUInt8(0xcf);
			buffer.writeUInt8(0xbb);
			if (payload.lorawan_configuration_settings.rx2_frequency < 0 || payload.lorawan_configuration_settings.rx2_frequency > 4294967295) {
				throw new Error('lorawan_configuration_settings.rx2_frequency must be in range [0,4294967295]');
			}
			buffer.writeUInt32LE(payload.lorawan_configuration_settings.rx2_frequency * 1000000);
		}
		if (isValid(payload.lorawan_configuration_settings.pingslot_periodicity)) {
			buffer.writeUInt8(0xcf);
			// 0：1s, 1：2s, 2：4s, 3：8s, 4：16s, 5：32s, 6：64s, 7：128s
			buffer.writeUInt8(0xdd);
			if ([0, 1, 2, 3, 4, 5, 6, 7].indexOf(payload.lorawan_configuration_settings.pingslot_periodicity) === -1) {
				throw new Error('lorawan_configuration_settings.pingslot_periodicity must be one of [0, 1, 2, 3, 4, 5, 6, 7]');
			}
			// 0：1s, 1：2s, 2：4s, 3：8s, 4：16s, 5：32s, 6：64s, 7：128s
			buffer.writeUInt8(payload.lorawan_configuration_settings.pingslot_periodicity);
		}
		if (isValid(payload.lorawan_configuration_settings.rx1_open_delay)) {
			buffer.writeUInt8(0xcf);
			buffer.writeUInt8(0x4b);
			if (payload.lorawan_configuration_settings.rx1_open_delay < 1 || payload.lorawan_configuration_settings.rx1_open_delay > 60) {
				throw new Error('lorawan_configuration_settings.rx1_open_delay must be between 1 and 60');
			}
			buffer.writeUInt32LE(payload.lorawan_configuration_settings.rx1_open_delay * 1000);
		}
		if (isValid(payload.lorawan_configuration_settings.rx2_open_delay)) {
			buffer.writeUInt8(0xcf);
			buffer.writeUInt8(0x4f);
			if (payload.lorawan_configuration_settings.rx2_open_delay < 1 || payload.lorawan_configuration_settings.rx2_open_delay > 60) {
				throw new Error('lorawan_configuration_settings.rx2_open_delay must be between 1 and 60');
			}
			buffer.writeUInt32LE(payload.lorawan_configuration_settings.rx2_open_delay * 1000);
		}
		if (isValid(payload.lorawan_configuration_settings.join_rx1_open_delay)) {
			buffer.writeUInt8(0xcf);
			buffer.writeUInt8(0x53);
			if (payload.lorawan_configuration_settings.join_rx1_open_delay < 1 || payload.lorawan_configuration_settings.join_rx1_open_delay > 60) {
				throw new Error('lorawan_configuration_settings.join_rx1_open_delay must be between 1 and 60');
			}
			buffer.writeUInt32LE(payload.lorawan_configuration_settings.join_rx1_open_delay * 1000);
		}
		if (isValid(payload.lorawan_configuration_settings.join_rx2_open_delay)) {
			buffer.writeUInt8(0xcf);
			buffer.writeUInt8(0x57);
			if (payload.lorawan_configuration_settings.join_rx2_open_delay < 1 || payload.lorawan_configuration_settings.join_rx2_open_delay > 60) {
				throw new Error('lorawan_configuration_settings.join_rx2_open_delay must be between 1 and 60');
			}
			buffer.writeUInt32LE(payload.lorawan_configuration_settings.join_rx2_open_delay * 1000);
		}
		if (isValid(payload.lorawan_configuration_settings.multicast_group_settings)) {
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_1_enable)) {
				buffer.writeUInt8(0xcf);
				// 0：disable, 1：enable
				buffer.writeUInt8(0xf9);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x0d);
				if ([0, 1].indexOf(payload.lorawan_configuration_settings.multicast_group_settings.group_1_enable) === -1) {
					throw new Error('lorawan_configuration_settings.multicast_group_settings.group_1_enable must be one of [0, 1]');
				}
				// 0：disable, 1：enable
				buffer.writeUInt8(payload.lorawan_configuration_settings.multicast_group_settings.group_1_enable);
			}
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_1_devaddr)) {
				buffer.writeUInt8(0xcf);
				buffer.writeUInt8(0xf9);
				buffer.writeUInt8(0x14);
				buffer.writeHexString(payload.lorawan_configuration_settings.multicast_group_settings.group_1_devaddr, 4);
			}
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_1_appskey)) {
				buffer.writeUInt8(0xcf);
				buffer.writeUInt8(0xf9);
				buffer.writeUInt8(0x28);
				buffer.writeHexString(payload.lorawan_configuration_settings.multicast_group_settings.group_1_appskey, 16);
			}
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_1_nwkskey)) {
				buffer.writeUInt8(0xcf);
				buffer.writeUInt8(0xf9);
				buffer.writeUInt8(0x18);
				buffer.writeHexString(payload.lorawan_configuration_settings.multicast_group_settings.group_1_nwkskey, 16);
			}
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_1_pingslot_periodicity)) {
				buffer.writeUInt8(0xcf);
				// 0：1s, 1：2s, 2：4s, 3：8s, 4：16s, 5：32s, 6：64s, 7：128s
				buffer.writeUInt8(0xf9);
				// 0：1s, 1：2s, 2：4s, 3：8s, 4：16s, 5：32s, 6：64s, 7：128s
				buffer.writeUInt8(0x0e);
				if ([0, 1, 2, 3, 4, 5, 6, 7].indexOf(payload.lorawan_configuration_settings.multicast_group_settings.group_1_pingslot_periodicity) === -1) {
					throw new Error('lorawan_configuration_settings.multicast_group_settings.group_1_pingslot_periodicity must be one of [0, 1, 2, 3, 4, 5, 6, 7]');
				}
				// 0：1s, 1：2s, 2：4s, 3：8s, 4：16s, 5：32s, 6：64s, 7：128s
				buffer.writeUInt8(payload.lorawan_configuration_settings.multicast_group_settings.group_1_pingslot_periodicity);
			}
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_1_data_rate)) {
				buffer.writeUInt8(0xcf);
				// 0：DR0(SF12,125kHz), 1：DR1(SF11,125kHz), 2：DR2(SF10,125kHz), 3：DR3(SF9,125kHz), 4：DR4(SF8,125kHz), 5：DR5(SF7,125kHz)
				buffer.writeUInt8(0xf9);
				// 0：DR0(SF12,125kHz), 1：DR1(SF11,125kHz), 2：DR2(SF10,125kHz), 3：DR3(SF9,125kHz), 4：DR4(SF8,125kHz), 5：DR5(SF7,125kHz)
				buffer.writeUInt8(0x0f);
				if ([0, 1, 2, 3, 4, 5].indexOf(payload.lorawan_configuration_settings.multicast_group_settings.group_1_data_rate) === -1) {
					throw new Error('lorawan_configuration_settings.multicast_group_settings.group_1_data_rate must be one of [0, 1, 2, 3, 4, 5]');
				}
				// 0：DR0(SF12,125kHz), 1：DR1(SF11,125kHz), 2：DR2(SF10,125kHz), 3：DR3(SF9,125kHz), 4：DR4(SF8,125kHz), 5：DR5(SF7,125kHz)
				buffer.writeUInt8(payload.lorawan_configuration_settings.multicast_group_settings.group_1_data_rate);
			}
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_1_frequency)) {
				buffer.writeUInt8(0xcf);
				buffer.writeUInt8(0xf9);
				buffer.writeUInt8(0x10);
				if (payload.lorawan_configuration_settings.multicast_group_settings.group_1_frequency < 0 || payload.lorawan_configuration_settings.multicast_group_settings.group_1_frequency > 4294967295) {
					throw new Error('lorawan_configuration_settings.multicast_group_settings.group_1_frequency must be in range [0,4294967295]');
				}
				buffer.writeUInt32LE(payload.lorawan_configuration_settings.multicast_group_settings.group_1_frequency * 1000000);
			}
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_2_enable)) {
				buffer.writeUInt8(0xcf);
				// 0：disable, 1：enable
				buffer.writeUInt8(0xf9);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x3a);
				if ([0, 1].indexOf(payload.lorawan_configuration_settings.multicast_group_settings.group_2_enable) === -1) {
					throw new Error('lorawan_configuration_settings.multicast_group_settings.group_2_enable must be one of [0, 1]');
				}
				// 0：disable, 1：enable
				buffer.writeUInt8(payload.lorawan_configuration_settings.multicast_group_settings.group_2_enable);
			}
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_2_devaddr)) {
				buffer.writeUInt8(0xcf);
				buffer.writeUInt8(0xf9);
				buffer.writeUInt8(0x41);
				buffer.writeHexString(payload.lorawan_configuration_settings.multicast_group_settings.group_2_devaddr, 4);
			}
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_2_appskey)) {
				buffer.writeUInt8(0xcf);
				buffer.writeUInt8(0xf9);
				buffer.writeUInt8(0x55);
				buffer.writeHexString(payload.lorawan_configuration_settings.multicast_group_settings.group_2_appskey, 16);
			}
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_2_nwkskey)) {
				buffer.writeUInt8(0xcf);
				buffer.writeUInt8(0xf9);
				buffer.writeUInt8(0x45);
				buffer.writeHexString(payload.lorawan_configuration_settings.multicast_group_settings.group_2_nwkskey, 16);
			}
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_2_pingslot_periodicity)) {
				buffer.writeUInt8(0xcf);
				// 0：1s, 1：2s, 2：4s, 3：8s, 4：16s, 5：32s, 6：64s, 7：128s
				buffer.writeUInt8(0xf9);
				// 0：1s, 1：2s, 2：4s, 3：8s, 4：16s, 5：32s, 6：64s, 7：128s
				buffer.writeUInt8(0x3b);
				if ([0, 1, 2, 3, 4, 5, 6, 7].indexOf(payload.lorawan_configuration_settings.multicast_group_settings.group_2_pingslot_periodicity) === -1) {
					throw new Error('lorawan_configuration_settings.multicast_group_settings.group_2_pingslot_periodicity must be one of [0, 1, 2, 3, 4, 5, 6, 7]');
				}
				// 0：1s, 1：2s, 2：4s, 3：8s, 4：16s, 5：32s, 6：64s, 7：128s
				buffer.writeUInt8(payload.lorawan_configuration_settings.multicast_group_settings.group_2_pingslot_periodicity);
			}
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_2_data_rate)) {
				buffer.writeUInt8(0xcf);
				// 0：DR0(SF12,125kHz), 1：DR1(SF11,125kHz), 2：DR2(SF10,125kHz), 3：DR3(SF9,125kHz), 4：DR4(SF8,125kHz), 5：DR5(SF7,125kHz)
				buffer.writeUInt8(0xf9);
				// 0：DR0(SF12,125kHz), 1：DR1(SF11,125kHz), 2：DR2(SF10,125kHz), 3：DR3(SF9,125kHz), 4：DR4(SF8,125kHz), 5：DR5(SF7,125kHz)
				buffer.writeUInt8(0x3c);
				if ([0, 1, 2, 3, 4, 5].indexOf(payload.lorawan_configuration_settings.multicast_group_settings.group_2_data_rate) === -1) {
					throw new Error('lorawan_configuration_settings.multicast_group_settings.group_2_data_rate must be one of [0, 1, 2, 3, 4, 5]');
				}
				// 0：DR0(SF12,125kHz), 1：DR1(SF11,125kHz), 2：DR2(SF10,125kHz), 3：DR3(SF9,125kHz), 4：DR4(SF8,125kHz), 5：DR5(SF7,125kHz)
				buffer.writeUInt8(payload.lorawan_configuration_settings.multicast_group_settings.group_2_data_rate);
			}
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_2_frequency)) {
				buffer.writeUInt8(0xcf);
				buffer.writeUInt8(0xf9);
				buffer.writeUInt8(0x3d);
				if (payload.lorawan_configuration_settings.multicast_group_settings.group_2_frequency < 0 || payload.lorawan_configuration_settings.multicast_group_settings.group_2_frequency > 4294967295) {
					throw new Error('lorawan_configuration_settings.multicast_group_settings.group_2_frequency must be in range [0,4294967295]');
				}
				buffer.writeUInt32LE(payload.lorawan_configuration_settings.multicast_group_settings.group_2_frequency * 1000000);
			}
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_3_enable)) {
				buffer.writeUInt8(0xcf);
				// 0：disable, 1：enable
				buffer.writeUInt8(0xf9);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x67);
				if ([0, 1].indexOf(payload.lorawan_configuration_settings.multicast_group_settings.group_3_enable) === -1) {
					throw new Error('lorawan_configuration_settings.multicast_group_settings.group_3_enable must be one of [0, 1]');
				}
				// 0：disable, 1：enable
				buffer.writeUInt8(payload.lorawan_configuration_settings.multicast_group_settings.group_3_enable);
			}
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_3_devaddr)) {
				buffer.writeUInt8(0xcf);
				buffer.writeUInt8(0xf9);
				buffer.writeUInt8(0x6e);
				buffer.writeHexString(payload.lorawan_configuration_settings.multicast_group_settings.group_3_devaddr, 4);
			}
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_3_appskey)) {
				buffer.writeUInt8(0xcf);
				buffer.writeUInt8(0xf9);
				buffer.writeUInt8(0x82);
				buffer.writeHexString(payload.lorawan_configuration_settings.multicast_group_settings.group_3_appskey, 16);
			}
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_3_nwkskey)) {
				buffer.writeUInt8(0xcf);
				buffer.writeUInt8(0xf9);
				buffer.writeUInt8(0x72);
				buffer.writeHexString(payload.lorawan_configuration_settings.multicast_group_settings.group_3_nwkskey, 16);
			}
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_3_pingslot_periodicity)) {
				buffer.writeUInt8(0xcf);
				// 0：1s, 1：2s, 2：4s, 3：8s, 4：16s, 5：32s, 6：64s, 7：128s
				buffer.writeUInt8(0xf9);
				// 0：1s, 1：2s, 2：4s, 3：8s, 4：16s, 5：32s, 6：64s, 7：128s
				buffer.writeUInt8(0x68);
				if ([0, 1, 2, 3, 4, 5, 6, 7].indexOf(payload.lorawan_configuration_settings.multicast_group_settings.group_3_pingslot_periodicity) === -1) {
					throw new Error('lorawan_configuration_settings.multicast_group_settings.group_3_pingslot_periodicity must be one of [0, 1, 2, 3, 4, 5, 6, 7]');
				}
				// 0：1s, 1：2s, 2：4s, 3：8s, 4：16s, 5：32s, 6：64s, 7：128s
				buffer.writeUInt8(payload.lorawan_configuration_settings.multicast_group_settings.group_3_pingslot_periodicity);
			}
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_3_data_rate)) {
				buffer.writeUInt8(0xcf);
				// 0：DR0(SF12,125kHz), 1：DR1(SF11,125kHz), 2：DR2(SF10,125kHz), 3：DR3(SF9,125kHz), 4：DR4(SF8,125kHz), 5：DR5(SF7,125kHz)
				buffer.writeUInt8(0xf9);
				// 0：DR0(SF12,125kHz), 1：DR1(SF11,125kHz), 2：DR2(SF10,125kHz), 3：DR3(SF9,125kHz), 4：DR4(SF8,125kHz), 5：DR5(SF7,125kHz)
				buffer.writeUInt8(0x69);
				if ([0, 1, 2, 3, 4, 5].indexOf(payload.lorawan_configuration_settings.multicast_group_settings.group_3_data_rate) === -1) {
					throw new Error('lorawan_configuration_settings.multicast_group_settings.group_3_data_rate must be one of [0, 1, 2, 3, 4, 5]');
				}
				// 0：DR0(SF12,125kHz), 1：DR1(SF11,125kHz), 2：DR2(SF10,125kHz), 3：DR3(SF9,125kHz), 4：DR4(SF8,125kHz), 5：DR5(SF7,125kHz)
				buffer.writeUInt8(payload.lorawan_configuration_settings.multicast_group_settings.group_3_data_rate);
			}
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_3_frequency)) {
				buffer.writeUInt8(0xcf);
				buffer.writeUInt8(0xf9);
				buffer.writeUInt8(0x6a);
				if (payload.lorawan_configuration_settings.multicast_group_settings.group_3_frequency < 0 || payload.lorawan_configuration_settings.multicast_group_settings.group_3_frequency > 4294967295) {
					throw new Error('lorawan_configuration_settings.multicast_group_settings.group_3_frequency must be in range [0,4294967295]');
				}
				buffer.writeUInt32LE(payload.lorawan_configuration_settings.multicast_group_settings.group_3_frequency * 1000000);
			}
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_4_enable)) {
				buffer.writeUInt8(0xcf);
				// 0：disable, 1：enable
				buffer.writeUInt8(0xf9);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x94);
				if ([0, 1].indexOf(payload.lorawan_configuration_settings.multicast_group_settings.group_4_enable) === -1) {
					throw new Error('lorawan_configuration_settings.multicast_group_settings.group_4_enable must be one of [0, 1]');
				}
				// 0：disable, 1：enable
				buffer.writeUInt8(payload.lorawan_configuration_settings.multicast_group_settings.group_4_enable);
			}
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_4_devaddr)) {
				buffer.writeUInt8(0xcf);
				buffer.writeUInt8(0xf9);
				buffer.writeUInt8(0x9b);
				buffer.writeHexString(payload.lorawan_configuration_settings.multicast_group_settings.group_4_devaddr, 4);
			}
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_4_appskey)) {
				buffer.writeUInt8(0xcf);
				buffer.writeUInt8(0xf9);
				buffer.writeUInt8(0xaf);
				buffer.writeHexString(payload.lorawan_configuration_settings.multicast_group_settings.group_4_appskey, 16);
			}
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_4_nwkskey)) {
				buffer.writeUInt8(0xcf);
				buffer.writeUInt8(0xf9);
				buffer.writeUInt8(0x9f);
				buffer.writeHexString(payload.lorawan_configuration_settings.multicast_group_settings.group_4_nwkskey, 16);
			}
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_4_pingslot_periodicity)) {
				buffer.writeUInt8(0xcf);
				// 0：1s, 1：2s, 2：4s, 3：8s, 4：16s, 5：32s, 6：64s, 7：128s
				buffer.writeUInt8(0xf9);
				// 0：1s, 1：2s, 2：4s, 3：8s, 4：16s, 5：32s, 6：64s, 7：128s
				buffer.writeUInt8(0x95);
				if ([0, 1, 2, 3, 4, 5, 6, 7].indexOf(payload.lorawan_configuration_settings.multicast_group_settings.group_4_pingslot_periodicity) === -1) {
					throw new Error('lorawan_configuration_settings.multicast_group_settings.group_4_pingslot_periodicity must be one of [0, 1, 2, 3, 4, 5, 6, 7]');
				}
				// 0：1s, 1：2s, 2：4s, 3：8s, 4：16s, 5：32s, 6：64s, 7：128s
				buffer.writeUInt8(payload.lorawan_configuration_settings.multicast_group_settings.group_4_pingslot_periodicity);
			}
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_4_data_rate)) {
				buffer.writeUInt8(0xcf);
				// 0：DR0(SF12,125kHz), 1：DR1(SF11,125kHz), 2：DR2(SF10,125kHz), 3：DR3(SF9,125kHz), 4：DR4(SF8,125kHz), 5：DR5(SF7,125kHz)
				buffer.writeUInt8(0xf9);
				// 0：DR0(SF12,125kHz), 1：DR1(SF11,125kHz), 2：DR2(SF10,125kHz), 3：DR3(SF9,125kHz), 4：DR4(SF8,125kHz), 5：DR5(SF7,125kHz)
				buffer.writeUInt8(0x96);
				if ([0, 1, 2, 3, 4, 5].indexOf(payload.lorawan_configuration_settings.multicast_group_settings.group_4_data_rate) === -1) {
					throw new Error('lorawan_configuration_settings.multicast_group_settings.group_4_data_rate must be one of [0, 1, 2, 3, 4, 5]');
				}
				// 0：DR0(SF12,125kHz), 1：DR1(SF11,125kHz), 2：DR2(SF10,125kHz), 3：DR3(SF9,125kHz), 4：DR4(SF8,125kHz), 5：DR5(SF7,125kHz)
				buffer.writeUInt8(payload.lorawan_configuration_settings.multicast_group_settings.group_4_data_rate);
			}
			if (isValid(payload.lorawan_configuration_settings.multicast_group_settings.group_4_frequency)) {
				buffer.writeUInt8(0xcf);
				buffer.writeUInt8(0xf9);
				buffer.writeUInt8(0x97);
				if (payload.lorawan_configuration_settings.multicast_group_settings.group_4_frequency < 0 || payload.lorawan_configuration_settings.multicast_group_settings.group_4_frequency > 4294967295) {
					throw new Error('lorawan_configuration_settings.multicast_group_settings.group_4_frequency must be in range [0,4294967295]');
				}
				buffer.writeUInt32LE(payload.lorawan_configuration_settings.multicast_group_settings.group_4_frequency * 1000000);
			}
		}
		if (isValid(payload.lorawan_configuration_settings.d2d_key)) {
			buffer.writeUInt8(0xcf);
			buffer.writeUInt8(0xe0);
			buffer.writeHexString(payload.lorawan_configuration_settings.d2d_key, 16);
		}
		if (isValid(payload.lorawan_configuration_settings.duty_cycle_enable)) {
			buffer.writeUInt8(0xcf);
			// 0：disable, 1：enable
			buffer.writeUInt8(0xc4);
			if ([0, 1].indexOf(payload.lorawan_configuration_settings.duty_cycle_enable) === -1) {
				throw new Error('lorawan_configuration_settings.duty_cycle_enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.lorawan_configuration_settings.duty_cycle_enable);
		}
		if (isValid(payload.lorawan_configuration_settings.duty_cycle)) {
			buffer.writeUInt8(0xcf);
			buffer.writeUInt8(0xc0);
			if (payload.lorawan_configuration_settings.duty_cycle < 0 || payload.lorawan_configuration_settings.duty_cycle > 4294967295) {
				throw new Error('lorawan_configuration_settings.duty_cycle must be in range [0,4294967295]');
			}
			buffer.writeUInt32LE(payload.lorawan_configuration_settings.duty_cycle);
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
			throw new Error('device_status must be one of [0, 1]');
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
	//0xd7
	if ('device_info' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xd7);
		buffer.writeString(payload.device_info.model, 8);
		buffer.writeString(payload.device_info.submodel_1, 8);
		buffer.writeString(payload.device_info.submodel_2, 8);
		buffer.writeString(payload.device_info.submodel_3, 8);
		buffer.writeString(payload.device_info.submodel_4, 8);
		buffer.writeString(payload.device_info.pn_1, 8);
		buffer.writeString(payload.device_info.pn_2, 8);
		buffer.writeString(payload.device_info.pn_3, 8);
		buffer.writeString(payload.device_info.pn_4, 8);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xbf
	if ('lorawan_status' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.lorawan_status.join_status)) {
			buffer.writeUInt8(0xbf);
			// 0：disconnect, 1：connect
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.lorawan_status.join_status) === -1) {
				throw new Error('lorawan_status.join_status must be one of [0, 1]');
			}
			// 0：disconnect, 1：connect
			buffer.writeUInt8(payload.lorawan_status.join_status);
		}
		if (isValid(payload.lorawan_status.eui)) {
			buffer.writeUInt8(0xbf);
			buffer.writeUInt8(0x01);
			buffer.writeHexString(payload.lorawan_status.eui, 8);
		}
		if (isValid(payload.lorawan_status.signal)) {
			buffer.writeUInt8(0xbf);
			buffer.writeUInt8(0x02);
			buffer.writeInt16LE(payload.lorawan_status.signal.rssi);
			buffer.writeInt8(payload.lorawan_status.signal.snr);
		}
		if (isValid(payload.lorawan_status.channel_mask)) {
			buffer.writeUInt8(0xbf);
			buffer.writeUInt8(0x03);
			buffer.writeHexString(payload.lorawan_status.channel_mask, 12);
		}
		if (isValid(payload.lorawan_status.frame_counter)) {
			buffer.writeUInt8(0xbf);
			buffer.writeUInt8(0x04);
			if (payload.lorawan_status.frame_counter.uplink < 0 || payload.lorawan_status.frame_counter.uplink > 4294967295) {
				throw new Error('lorawan_status.frame_counter.uplink must be between 0 and 4294967295');
			}
			buffer.writeUInt32LE(payload.lorawan_status.frame_counter.uplink);
			if (payload.lorawan_status.frame_counter.downlink < 0 || payload.lorawan_status.frame_counter.downlink > 4294967295) {
				throw new Error('lorawan_status.frame_counter.downlink must be between 0 and 4294967295');
			}
			buffer.writeUInt32LE(payload.lorawan_status.frame_counter.downlink);
		}
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
	//0xd5
	if ('ble_phone_name' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xd5);
		if (payload.ble_phone_name.length < 1 || payload.ble_phone_name.length > 64) {
			throw new Error('ble_phone_name.length must be between 1 and 64');
		}
		buffer.writeUInt8(payload.ble_phone_name.length);
		buffer.writeString(payload.ble_phone_name.value, payload.ble_phone_name.length, true);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xcd
	if ('ble_configuration_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.ble_configuration_settings.enable)) {
			buffer.writeUInt8(0xcd);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.ble_configuration_settings.enable) === -1) {
				throw new Error('ble_configuration_settings.enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.ble_configuration_settings.enable);
		}
		if (isValid(payload.ble_configuration_settings.local_id)) {
			buffer.writeUInt8(0xcd);
			buffer.writeUInt8(0x01);
			if ([0, 1].indexOf(payload.ble_configuration_settings.local_id.type) === -1) {
				throw new Error('ble_configuration_settings.local_id.type must be one of [0, 1]');
			}
			// 0：public, 1：private
			buffer.writeUInt8(payload.ble_configuration_settings.local_id.type);
			buffer.writeHexString(payload.ble_configuration_settings.local_id.address, 6);
		}
		if (isValid(payload.ble_configuration_settings.local_name_first)) {
			buffer.writeUInt8(0xcd);
			buffer.writeUInt8(0x05);
			buffer.writeString(payload.ble_configuration_settings.local_name_first, 8);
		}
		if (isValid(payload.ble_configuration_settings.local_name_last)) {
			buffer.writeUInt8(0xcd);
			buffer.writeUInt8(0x06);
			buffer.writeString(payload.ble_configuration_settings.local_name_last, 5);
		}
		if (isValid(payload.ble_configuration_settings.pair_info)) {
			buffer.writeUInt8(0xcd);
			buffer.writeUInt8(0x07);
			if ([0, 1].indexOf(payload.ble_configuration_settings.pair_info.type) === -1) {
				throw new Error('ble_configuration_settings.pair_info.type must be one of [0, 1]');
			}
			// 0：public, 1：private
			buffer.writeUInt8(payload.ble_configuration_settings.pair_info.type);
			buffer.writeHexString(payload.ble_configuration_settings.pair_info.addr, 6);
			buffer.writeHexString(payload.ble_configuration_settings.pair_info.mac, 8);
			if (payload.ble_configuration_settings.pair_info.name_length < 1 || payload.ble_configuration_settings.pair_info.name_length > 13) {
				throw new Error('ble_configuration_settings.pair_info.name_length must be between 1 and 13');
			}
			buffer.writeUInt8(payload.ble_configuration_settings.pair_info.name_length);
			buffer.writeString(payload.ble_configuration_settings.pair_info.name, payload.ble_configuration_settings.pair_info.name_length, true);
		}
		for (var pair_name_id = 0; pair_name_id < (payload.ble_configuration_settings.pair_name && payload.ble_configuration_settings.pair_name.length); pair_name_id++) {
			var pair_name_item = payload.ble_configuration_settings.pair_name[pair_name_id];
			var pair_name_item_id = pair_name_item.channel;
			buffer.writeUInt8(0xcd);
			buffer.writeUInt8(0x04);
			if (pair_name_item.length < 1 || pair_name_item.length > 13) {
				throw new Error('length must be between 1 and 13');
			}
			buffer.writeUInt8(pair_name_item.length);
			buffer.writeString(pair_name_item.content, pair_name_item.length, true);
		}
		for (var pair_mac_id = 0; pair_mac_id < (payload.ble_configuration_settings.pair_mac && payload.ble_configuration_settings.pair_mac.length); pair_mac_id++) {
			var pair_mac_item = payload.ble_configuration_settings.pair_mac[pair_mac_id];
			var pair_mac_item_id = pair_mac_item.channel;
			buffer.writeUInt8(0xcd);
			buffer.writeUInt8(0x02);
			buffer.writeHexString(pair_mac_item.mac, pair_name_item.length, true);
		}
		for (var pair_addr_id = 0; pair_addr_id < (payload.ble_configuration_settings.pair_addr && payload.ble_configuration_settings.pair_addr.length); pair_addr_id++) {
			var pair_addr_item = payload.ble_configuration_settings.pair_addr[pair_addr_id];
			var pair_addr_item_id = pair_addr_item.channel;
			buffer.writeUInt8(0xcd);
			buffer.writeUInt8(0x03);
			if ([0, 1].indexOf(pair_addr_item.type) === -1) {
				throw new Error('type must be one of [0, 1]');
			}
			// 0：public, 1：private
			buffer.writeUInt8(pair_addr_item.type);
			buffer.writeHexString(pair_addr_item.mac, pair_name_item.length, true);
		}
		if (isValid(payload.ble_configuration_settings.local_info)) {
			buffer.writeUInt8(0xcd);
			buffer.writeUInt8(0x08);
			if ([0, 1].indexOf(payload.ble_configuration_settings.local_info.type) === -1) {
				throw new Error('ble_configuration_settings.local_info.type must be one of [0, 1]');
			}
			// 0：public, 1：private
			buffer.writeUInt8(payload.ble_configuration_settings.local_info.type);
			buffer.writeHexString(payload.ble_configuration_settings.local_info.addr, 6);
			buffer.writeHexString(payload.ble_configuration_settings.local_info.mac, 8);
			if (payload.ble_configuration_settings.local_info.name_length < 1 || payload.ble_configuration_settings.local_info.name_length > 13) {
				throw new Error('ble_configuration_settings.local_info.name_length must be between 1 and 13');
			}
			buffer.writeUInt8(payload.ble_configuration_settings.local_info.name_length);
			buffer.writeString(payload.ble_configuration_settings.local_info.name, payload.ble_configuration_settings.local_info.name_length, true);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xba
	if ('retrieve_historical_data_by_time' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xba);
		if (payload.retrieve_historical_data_by_time.time < 0 || payload.retrieve_historical_data_by_time.time > 4294967295) {
			throw new Error('retrieve_historical_data_by_time.time must be in range [0,4294967295]');
		}
		buffer.writeUInt32LE(payload.retrieve_historical_data_by_time.time);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xb4
	if ('ble_server' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb4);
		if ([0, 1, 2].indexOf(payload.ble_server.type) === -1) {
			throw new Error('ble_server.type must be one of [0, 1, 2]');
		}
		// 0：Reset BLE Name , 1：Cancel Pairing, 2：Trigger Pairing
		buffer.writeUInt8(payload.ble_server.type);
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
	if ('low_battery_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x01);
		if (payload.low_battery_alarm.value < 0 || payload.low_battery_alarm.value > 100) {
			throw new Error('low_battery_alarm.value must be between 0 and 100');
		}
		buffer.writeUInt8(payload.low_battery_alarm.value);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x02
	if ('temperature_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x02);
		buffer.writeUInt8(payload.temperature_alarm.type);
		if (payload.temperature_alarm.type == 0x00) {
			if (payload.temperature_alarm.open_window_alarm_deactivation.temperature < -20 || payload.temperature_alarm.open_window_alarm_deactivation.temperature > 70) {
				throw new Error('temperature_alarm.open_window_alarm_deactivation.temperature must be between -20 and 70');
			}
			buffer.writeInt16LE(payload.temperature_alarm.open_window_alarm_deactivation.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x01) {
			if (payload.temperature_alarm.open_window_alarm_trigger.temperature < -20 || payload.temperature_alarm.open_window_alarm_trigger.temperature > 70) {
				throw new Error('temperature_alarm.open_window_alarm_trigger.temperature must be between -20 and 70');
			}
			buffer.writeInt16LE(payload.temperature_alarm.open_window_alarm_trigger.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x20) {
			if (payload.temperature_alarm.over_range_alarm_trigger.temperature < -20 || payload.temperature_alarm.over_range_alarm_trigger.temperature > 70) {
				throw new Error('temperature_alarm.over_range_alarm_trigger.temperature must be between -20 and 70');
			}
			buffer.writeInt16LE(payload.temperature_alarm.over_range_alarm_trigger.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x21) {
			if (payload.temperature_alarm.over_range_alarm_deactivation.temperature < -20 || payload.temperature_alarm.over_range_alarm_deactivation.temperature > 70) {
				throw new Error('temperature_alarm.over_range_alarm_deactivation.temperature must be between -20 and 70');
			}
			buffer.writeInt16LE(payload.temperature_alarm.over_range_alarm_deactivation.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x22) {
			if (payload.temperature_alarm.lower_range_alarm_trigger.temperature < -20 || payload.temperature_alarm.lower_range_alarm_trigger.temperature > 70) {
				throw new Error('temperature_alarm.lower_range_alarm_trigger.temperature must be between -20 and 70');
			}
			buffer.writeInt16LE(payload.temperature_alarm.lower_range_alarm_trigger.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x23) {
			if (payload.temperature_alarm.lower_range_alarm_deactivation.temperature < -20 || payload.temperature_alarm.lower_range_alarm_deactivation.temperature > 70) {
				throw new Error('temperature_alarm.lower_range_alarm_deactivation.temperature must be between -20 and 70');
			}
			buffer.writeInt16LE(payload.temperature_alarm.lower_range_alarm_deactivation.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x24) {
			if (payload.temperature_alarm.within_range_alarm_trigger.temperature < -20 || payload.temperature_alarm.within_range_alarm_trigger.temperature > 70) {
				throw new Error('temperature_alarm.within_range_alarm_trigger.temperature must be between -20 and 70');
			}
			buffer.writeInt16LE(payload.temperature_alarm.within_range_alarm_trigger.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x25) {
			if (payload.temperature_alarm.within_range_alarm_deactivation.temperature < -20 || payload.temperature_alarm.within_range_alarm_deactivation.temperature > 70) {
				throw new Error('temperature_alarm.within_range_alarm_deactivation.temperature must be between -20 and 70');
			}
			buffer.writeInt16LE(payload.temperature_alarm.within_range_alarm_deactivation.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x26) {
			if (payload.temperature_alarm.outside_range_alarm_trigger.temperature < -20 || payload.temperature_alarm.outside_range_alarm_trigger.temperature > 70) {
				throw new Error('temperature_alarm.outside_range_alarm_trigger.temperature must be between -20 and 70');
			}
			buffer.writeInt16LE(payload.temperature_alarm.outside_range_alarm_trigger.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x27) {
			if (payload.temperature_alarm.outside_range_alarm_deactivation.temperature < -20 || payload.temperature_alarm.outside_range_alarm_deactivation.temperature > 70) {
				throw new Error('temperature_alarm.outside_range_alarm_deactivation.temperature must be between -20 and 70');
			}
			buffer.writeInt16LE(payload.temperature_alarm.outside_range_alarm_deactivation.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x30) {
			if (payload.temperature_alarm.persistent_low_temp_deactivation.temperature < -20 || payload.temperature_alarm.persistent_low_temp_deactivation.temperature > 70) {
				throw new Error('temperature_alarm.persistent_low_temp_deactivation.temperature must be between -20 and 70');
			}
			buffer.writeInt16LE(payload.temperature_alarm.persistent_low_temp_deactivation.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x31) {
			if (payload.temperature_alarm.persistent_low_temp_trigger.temperature < -20 || payload.temperature_alarm.persistent_low_temp_trigger.temperature > 70) {
				throw new Error('temperature_alarm.persistent_low_temp_trigger.temperature must be between -20 and 70');
			}
			buffer.writeInt16LE(payload.temperature_alarm.persistent_low_temp_trigger.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x40) {
			if (payload.temperature_alarm.persistent_high_temp_deactivation.temperature < -20 || payload.temperature_alarm.persistent_high_temp_deactivation.temperature > 70) {
				throw new Error('temperature_alarm.persistent_high_temp_deactivation.temperature must be between -20 and 70');
			}
			buffer.writeInt16LE(payload.temperature_alarm.persistent_high_temp_deactivation.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x41) {
			if (payload.temperature_alarm.persistent_high_temp_trigger.temperature < -20 || payload.temperature_alarm.persistent_high_temp_trigger.temperature > 70) {
				throw new Error('temperature_alarm.persistent_high_temp_trigger.temperature must be between -20 and 70');
			}
			buffer.writeInt16LE(payload.temperature_alarm.persistent_high_temp_trigger.temperature * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x03
	if ('sensor_error' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x03);
		buffer.writeUInt8(payload.sensor_error.type);
		if (payload.sensor_error.type == 0x00) {
		}
		if (payload.sensor_error.type == 0xf0) {
		}
		if (payload.sensor_error.type == 0x01) {
		}
		if (payload.sensor_error.type == 0xf1) {
		}
		if (payload.sensor_error.type == 0x02) {
		}
		if (payload.sensor_error.type == 0xf2) {
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x04
	if ('infrared_cmd_status' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x04);
		var bitOptions = 0;
		// 0: Switch Off, 1: Switch On
		bitOptions |= payload.infrared_cmd_status.cmd.switch << 0;

		// 0：heat, 1：em heat, 2：cool, 3：auto, 4：dehumidify, 5：ventilate
		bitOptions |= payload.infrared_cmd_status.cmd.mode << 1;

		// 0：Auto, 1：Ventilation, 2：Always Open, 3：Low, 4：Medium, 5：High, 255：Disabled
		bitOptions |= payload.infrared_cmd_status.cmd.air_volume << 4;

		// 0: Command, 1: Local
		bitOptions |= payload.infrared_cmd_status.cmd.cmd_type << 7;
		buffer.writeUInt8(bitOptions);

		var bitOptions = 0;
		// 0: Command Invalid, 1: Command Valid
		bitOptions |= payload.infrared_cmd_status.cmd.control_word.command_valid << 0;

		// 0: Command unavailable, 1: Command available
		bitOptions |= payload.infrared_cmd_status.cmd.control_word.command_available << 1;

		bitOptions |= payload.infrared_cmd_status.cmd.control_word.reserve << 2;
		buffer.writeUInt8(bitOptions);

		if (payload.infrared_cmd_status.target_temp < 16 || payload.infrared_cmd_status.target_temp > 30) {
			throw new Error('infrared_cmd_status.target_temp must be between 16 and 30');
		}
		buffer.writeInt16LE(payload.infrared_cmd_status.target_temp * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x05
	if ('running_state' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x05);
		buffer.writeUInt8(payload.running_state.data_source);
		if (payload.running_state.data_source == 0x00) {
			if ([0, 1].indexOf(payload.running_state.infrared_cmd.switch_state) === -1) {
				throw new Error('running_state.infrared_cmd.switch_state must be one of [0, 1]');
			}
			// 0: Switch Off, 1: Switch On
			buffer.writeUInt8(payload.running_state.infrared_cmd.switch_state);
		}
		if (payload.running_state.data_source == 0x01) {
			if (payload.running_state.current_transformer.current < 0 || payload.running_state.current_transformer.current > 30) {
				throw new Error('running_state.current_transformer.current must be between 0 and 30');
			}
			buffer.writeInt32LE(payload.running_state.current_transformer.current);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x06
	if ('internal_temp' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x06);
		if (payload.internal_temp < -20 || payload.internal_temp > 70) {
			throw new Error('internal_temp must be between -20 and 70');
		}
		buffer.writeInt16LE(payload.internal_temp * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x07
	if ('external_temp' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x07);
		if (payload.external_temp < -20 || payload.external_temp > 70) {
			throw new Error('external_temp must be between -20 and 70');
		}
		buffer.writeInt16LE(payload.external_temp * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x08
	if ('humidity' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x08);
		if (payload.humidity < 0 || payload.humidity > 100) {
			throw new Error('humidity must be between 0 and 100');
		}
		buffer.writeInt16LE(payload.humidity * 10);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x09
	if ('filter_clean_remind' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x09);
		buffer.writeUInt32LE(payload.filter_clean_remind.usage_time);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0a
	if ('cmd_temp_limit' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0a);
		buffer.writeUInt8(payload.cmd_temp_limit.type);
		if (payload.cmd_temp_limit.type == 0x00) {
			if (payload.cmd_temp_limit.lower_range_alarm_trigger.low_threshold < 5 || payload.cmd_temp_limit.lower_range_alarm_trigger.low_threshold > 35) {
				throw new Error('cmd_temp_limit.lower_range_alarm_trigger.low_threshold must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.cmd_temp_limit.lower_range_alarm_trigger.low_threshold * 100);
			if (payload.cmd_temp_limit.lower_range_alarm_trigger.high_threshold < 5 || payload.cmd_temp_limit.lower_range_alarm_trigger.high_threshold > 35) {
				throw new Error('cmd_temp_limit.lower_range_alarm_trigger.high_threshold must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.cmd_temp_limit.lower_range_alarm_trigger.high_threshold * 100);
		}
		if (payload.cmd_temp_limit.type == 0x01) {
			if (payload.cmd_temp_limit.over_range_alarm_trigger.low_threshold < 5 || payload.cmd_temp_limit.over_range_alarm_trigger.low_threshold > 35) {
				throw new Error('cmd_temp_limit.over_range_alarm_trigger.low_threshold must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.cmd_temp_limit.over_range_alarm_trigger.low_threshold * 100);
			if (payload.cmd_temp_limit.over_range_alarm_trigger.high_threshold < 5 || payload.cmd_temp_limit.over_range_alarm_trigger.high_threshold > 35) {
				throw new Error('cmd_temp_limit.over_range_alarm_trigger.high_threshold must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.cmd_temp_limit.over_range_alarm_trigger.high_threshold * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0b
	if ('local_temp_limit' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0b);
		buffer.writeUInt8(payload.local_temp_limit.type);
		if (payload.local_temp_limit.type == 0x00) {
			if (payload.local_temp_limit.lower_range_alarm_trigger.low_threshold < 5 || payload.local_temp_limit.lower_range_alarm_trigger.low_threshold > 35) {
				throw new Error('local_temp_limit.lower_range_alarm_trigger.low_threshold must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.local_temp_limit.lower_range_alarm_trigger.low_threshold * 100);
			if (payload.local_temp_limit.lower_range_alarm_trigger.high_threshold < 5 || payload.local_temp_limit.lower_range_alarm_trigger.high_threshold > 35) {
				throw new Error('local_temp_limit.lower_range_alarm_trigger.high_threshold must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.local_temp_limit.lower_range_alarm_trigger.high_threshold * 100);
		}
		if (payload.local_temp_limit.type == 0x01) {
			if (payload.local_temp_limit.over_range_alarm_trigger.low_threshold < 5 || payload.local_temp_limit.over_range_alarm_trigger.low_threshold > 35) {
				throw new Error('local_temp_limit.over_range_alarm_trigger.low_threshold must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.local_temp_limit.over_range_alarm_trigger.low_threshold * 100);
			if (payload.local_temp_limit.over_range_alarm_trigger.high_threshold < 5 || payload.local_temp_limit.over_range_alarm_trigger.high_threshold > 35) {
				throw new Error('local_temp_limit.over_range_alarm_trigger.high_threshold must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.local_temp_limit.over_range_alarm_trigger.high_threshold * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x30
	if ('data_transparent' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x30);
		buffer.writeUInt8(payload.data_transparent.res_cmd);
		if (payload.data_transparent.res_cmd == 0x00) {
			buffer.writeUInt8(payload.data_transparent.res_cmd1.command);
			if (payload.data_transparent.res_cmd1.command == 0x00) {
				if (payload.data_transparent.res_cmd1.battery < 0 || payload.data_transparent.res_cmd1.battery > 100) {
					throw new Error('data_transparent.res_cmd1.battery must be between 0 and 100');
				}
				buffer.writeUInt8(payload.data_transparent.res_cmd1.battery);
			}
			if (payload.data_transparent.res_cmd1.command == 0x0f) {
				buffer.writeUInt8(payload.data_transparent.res_cmd1.battery_event.type);
				if (payload.data_transparent.res_cmd1.battery_event.type == 0x00) {
				}
				if (payload.data_transparent.res_cmd1.battery_event.type == 0x01) {
				}
			}
			if (payload.data_transparent.res_cmd1.command == 0x0d) {
				buffer.writeUInt8(payload.data_transparent.res_cmd1.key_event.type);
				if (payload.data_transparent.res_cmd1.key_event.type == 0x00) {
				}
				if (payload.data_transparent.res_cmd1.key_event.type == 0x01) {
				}
				if (payload.data_transparent.res_cmd1.key_event.type == 0x02) {
				}
			}
			if (payload.data_transparent.res_cmd1.command == 0xc8) {
				if ([0, 1].indexOf(payload.data_transparent.res_cmd1.device_status) === -1) {
					throw new Error('data_transparent.res_cmd1.device_status must be one of [0, 1]');
				}
				// 0：Off, 1：On
				buffer.writeUInt8(payload.data_transparent.res_cmd1.device_status);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xc9
	if ('random_key' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xc9);
		if ([0, 1].indexOf(payload.random_key) === -1) {
			throw new Error('random_key must be one of [0, 1]');
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
			throw new Error('auto_p_enable must be one of [0, 1]');
		}
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.auto_p_enable);
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
				throw new Error('data_storage_settings.enable must be one of [0, 1]');
			}
			// 0：Disable, 1：Enable
			buffer.writeUInt8(payload.data_storage_settings.enable);
		}
		if (isValid(payload.data_storage_settings.retransmission_enable)) {
			buffer.writeUInt8(0xc5);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(0x01);
			if ([0, 1].indexOf(payload.data_storage_settings.retransmission_enable) === -1) {
				throw new Error('data_storage_settings.retransmission_enable must be one of [0, 1]');
			}
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
	//0x60
	if ('temperature_control_mode' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.temperature_control_mode.ctrl_mode)) {
			buffer.writeUInt8(0x60);
			// 0：heat, 2：cool, 3：auto, 4：dehumidify, 5：ventilate
			buffer.writeUInt8(0x00);
			if ([0, 2, 3, 4, 5].indexOf(payload.temperature_control_mode.ctrl_mode) === -1) {
				throw new Error('temperature_control_mode.ctrl_mode must be one of [0, 2, 3, 4, 5]');
			}
			// 0：heat, 2：cool, 3：auto, 4：dehumidify, 5：ventilate
			buffer.writeUInt8(payload.temperature_control_mode.ctrl_mode);
		}
		if (isValid(payload.temperature_control_mode.plan_enable)) {
			buffer.writeUInt8(0x60);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x01);
			if ([0, 1].indexOf(payload.temperature_control_mode.plan_enable) === -1) {
				throw new Error('temperature_control_mode.plan_enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.temperature_control_mode.plan_enable);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x61
	if ('target_temperature_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.target_temperature_settings.heat)) {
			buffer.writeUInt8(0x61);
			buffer.writeUInt8(0x00);
			if (payload.target_temperature_settings.heat < 16 || payload.target_temperature_settings.heat > 30) {
				throw new Error('target_temperature_settings.heat must be between 16 and 30');
			}
			buffer.writeInt16LE(payload.target_temperature_settings.heat * 100);
		}
		if (isValid(payload.target_temperature_settings.cool)) {
			buffer.writeUInt8(0x61);
			buffer.writeUInt8(0x02);
			if (payload.target_temperature_settings.cool < 16 || payload.target_temperature_settings.cool > 30) {
				throw new Error('target_temperature_settings.cool must be between 16 and 30');
			}
			buffer.writeInt16LE(payload.target_temperature_settings.cool * 100);
		}
		if (isValid(payload.target_temperature_settings.auto)) {
			buffer.writeUInt8(0x61);
			buffer.writeUInt8(0x03);
			if (payload.target_temperature_settings.auto < 16 || payload.target_temperature_settings.auto > 30) {
				throw new Error('target_temperature_settings.auto must be between 16 and 30');
			}
			buffer.writeInt16LE(payload.target_temperature_settings.auto * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x62
	if ('target_temperature_tolerance' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.target_temperature_tolerance.target_value)) {
			buffer.writeUInt8(0x62);
			buffer.writeUInt8(0x00);
			if (payload.target_temperature_tolerance.target_value < 0.1 || payload.target_temperature_tolerance.target_value > 5) {
				throw new Error('target_temperature_tolerance.target_value must be between 0.1 and 5');
			}
			buffer.writeInt16LE(payload.target_temperature_tolerance.target_value * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x64
	if ('temperature_unit' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x64);
		if ([0, 1].indexOf(payload.temperature_unit) === -1) {
			throw new Error('temperature_unit must be one of [0, 1]');
		}
		// 0：℃, 1：℉
		buffer.writeUInt8(payload.temperature_unit);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x65
	if ('target_temperature_resolution' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x65);
		if ([0, 1].indexOf(payload.target_temperature_resolution) === -1) {
			throw new Error('target_temperature_resolution must be one of [0, 1]');
		}
		// 0：0.5, 1：1
		buffer.writeUInt8(payload.target_temperature_resolution);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x91
	if ('communication_mode' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x91);
		if ([0].indexOf(payload.communication_mode) === -1) {
			throw new Error('communication_mode must be one of [0]');
		}
		// 0：BLE+Lorawan
		buffer.writeUInt8(payload.communication_mode);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x66
	if ('reporting_interval' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.reporting_interval.ble_lora)) {
			buffer.writeUInt8(0x66);
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.reporting_interval.ble_lora.unit) === -1) {
				throw new Error('reporting_interval.ble_lora.unit must be one of [0, 1]');
			}
			// 0：second, 1：min
			buffer.writeUInt8(payload.reporting_interval.ble_lora.unit);
			if (payload.reporting_interval.ble_lora.unit == 0x00) {
				if (payload.reporting_interval.ble_lora.seconds_of_time < 60 || payload.reporting_interval.ble_lora.seconds_of_time > 64800) {
					throw new Error('reporting_interval.ble_lora.seconds_of_time must be between 60 and 64800');
				}
				buffer.writeUInt16LE(payload.reporting_interval.ble_lora.seconds_of_time);
			}
			if (payload.reporting_interval.ble_lora.unit == 0x01) {
				if (payload.reporting_interval.ble_lora.minutes_of_time < 1 || payload.reporting_interval.ble_lora.minutes_of_time > 1440) {
					throw new Error('reporting_interval.ble_lora.minutes_of_time must be between 1 and 1440');
				}
				buffer.writeUInt16LE(payload.reporting_interval.ble_lora.minutes_of_time);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x67
	if ('schedule_settings' in payload) {
		var buffer = new Buffer();
		for (var schedule_settings_id = 0; schedule_settings_id < (payload.schedule_settings && payload.schedule_settings.length); schedule_settings_id++) {
			var schedule_settings_item = payload.schedule_settings[schedule_settings_id];
			var schedule_settings_item_id = schedule_settings_item.id;
			if (isValid(schedule_settings_item.enable)) {
				buffer.writeUInt8(0x67);
				buffer.writeUInt8(schedule_settings_item_id);
				// 0：Disable, 1：Enable
				buffer.writeUInt8(0x00);
				if ([0, 1].indexOf(schedule_settings_item.enable) === -1) {
					throw new Error('enable must be one of [0, 1]');
				}
				// 0：Disable, 1：Enable
				buffer.writeUInt8(schedule_settings_item.enable);
			}
			if (isValid(schedule_settings_item.name1)) {
				buffer.writeUInt8(0x67);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x01);
				buffer.writeString(schedule_settings_item.name1, pair_name_item.length, true);
			}
			if (isValid(schedule_settings_item.name2)) {
				buffer.writeUInt8(0x67);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x02);
				buffer.writeString(schedule_settings_item.name2, pair_name_item.length, true);
			}
			if (isValid(schedule_settings_item.fan_mode)) {
				buffer.writeUInt8(0x67);
				buffer.writeUInt8(schedule_settings_item_id);
				// 0：Auto, 1：Ventilation, 2：Always Open, 3：Low, 4：Medium, 5：High, 255：Disabled
				buffer.writeUInt8(0x03);
				if ([0, 1, 2, 3, 4, 5, 255].indexOf(schedule_settings_item.fan_mode) === -1) {
					throw new Error('fan_mode must be one of [0, 1, 2, 3, 4, 5, 255]');
				}
				// 0：Auto, 1：Ventilation, 2：Always Open, 3：Low, 4：Medium, 5：High, 255：Disabled
				buffer.writeUInt8(schedule_settings_item.fan_mode);
			}
			if (isValid(schedule_settings_item.target_temp)) {
				buffer.writeUInt8(0x67);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x04);
				if (schedule_settings_item.target_temp < 16 || schedule_settings_item.target_temp > 30) {
					throw new Error('target_temp must be between 16 and 30');
				}
				buffer.writeInt16LE(schedule_settings_item.target_temp * 100);
			}
			if (isValid(schedule_settings_item.switch_on)) {
				buffer.writeUInt8(0x67);
				buffer.writeUInt8(schedule_settings_item_id);
				// 0：Switch Off, 1：Switch On
				buffer.writeUInt8(0x05);
				if ([0, 1].indexOf(schedule_settings_item.switch_on) === -1) {
					throw new Error('switch_on must be one of [0, 1]');
				}
				// 0：Switch Off, 1：Switch On
				buffer.writeUInt8(schedule_settings_item.switch_on);
			}
			if (isValid(schedule_settings_item.work_mode)) {
				buffer.writeUInt8(0x67);
				buffer.writeUInt8(schedule_settings_item_id);
				// 0：heat, 1：em heat, 2：cool, 3：auto, 4：dehumidify, 5：ventilate
				buffer.writeUInt8(0x06);
				if ([0, 1, 2, 3, 4, 5].indexOf(schedule_settings_item.work_mode) === -1) {
					throw new Error('work_mode must be one of [0, 1, 2, 3, 4, 5]');
				}
				// 0：heat, 1：em heat, 2：cool, 3：auto, 4：dehumidify, 5：ventilate
				buffer.writeUInt8(schedule_settings_item.work_mode);
			}
			for (var cycle_settings_id = 0; cycle_settings_id < (schedule_settings_item.cycle_settings && schedule_settings_item.cycle_settings.length); cycle_settings_id++) {
				var cycle_settings_item = schedule_settings_item.cycle_settings[cycle_settings_id];
				var cycle_settings_item_id = cycle_settings_item.id;
				buffer.writeUInt8(0x67);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x07);
				buffer.writeUInt8(cycle_settings_item.id);
				if ([0, 1].indexOf(cycle_settings_item.enable) === -1) {
					throw new Error('enable must be one of [0, 1]');
				}
				// 0：disable, 1：enable
				buffer.writeUInt8(cycle_settings_item.enable);
				if (cycle_settings_item.execution_time_point < 0 || cycle_settings_item.execution_time_point > 1439) {
					throw new Error('execution_time_point must be in range [0,1439]');
				}
				buffer.writeUInt16LE(cycle_settings_item.execution_time_point);
				var bitOptions = 0;
				// 0：disable, 1：enable
				bitOptions |= cycle_settings_item.execution_day_sun << 0;

				// 0：disable, 1：enable
				bitOptions |= cycle_settings_item.execution_day_mon << 1;

				// 0：disable, 1：enable
				bitOptions |= cycle_settings_item.execution_day_tues << 2;

				// 0：disable, 1：enable
				bitOptions |= cycle_settings_item.execution_day_wed << 3;

				// 0：disable, 1：enable
				bitOptions |= cycle_settings_item.execution_day_thu << 4;

				// 0：disable, 1：enable
				bitOptions |= cycle_settings_item.execution_day_fri << 5;

				// 0：disable, 1：enable
				bitOptions |= cycle_settings_item.execution_day_sat << 6;

				bitOptions |= cycle_settings_item.reserved << 7;
				buffer.writeUInt8(bitOptions);

			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x68
	if ('window_opening_detection_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.window_opening_detection_settings.enable)) {
			buffer.writeUInt8(0x68);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.window_opening_detection_settings.enable) === -1) {
				throw new Error('window_opening_detection_settings.enable must be one of [0, 1]');
			}
			// 0：Disable, 1：Enable
			buffer.writeUInt8(payload.window_opening_detection_settings.enable);
		}
		if (isValid(payload.window_opening_detection_settings.difference_in_temperature)) {
			buffer.writeUInt8(0x68);
			buffer.writeUInt8(0x02);
			if (payload.window_opening_detection_settings.difference_in_temperature < 1 || payload.window_opening_detection_settings.difference_in_temperature > 20) {
				throw new Error('window_opening_detection_settings.difference_in_temperature must be between 1 and 20');
			}
			buffer.writeInt16LE(payload.window_opening_detection_settings.difference_in_temperature * 100);
		}
		if (isValid(payload.window_opening_detection_settings.stop_time)) {
			buffer.writeUInt8(0x68);
			buffer.writeUInt8(0x03);
			if (payload.window_opening_detection_settings.stop_time < 1 || payload.window_opening_detection_settings.stop_time > 1440) {
				throw new Error('window_opening_detection_settings.stop_time must be between 1 and 1440');
			}
			buffer.writeUInt16LE(payload.window_opening_detection_settings.stop_time);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6a
	if ('temperature_data_source' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.temperature_data_source.source)) {
			buffer.writeUInt8(0x6a);
			// 0: External Temperature Sensor, 4: Internal Temperature Sensor
			buffer.writeUInt8(0x00);
			if ([0, 4].indexOf(payload.temperature_data_source.source) === -1) {
				throw new Error('temperature_data_source.source must be one of [0, 4]');
			}
			// 0: External Temperature Sensor, 4: Internal Temperature Sensor
			buffer.writeUInt8(payload.temperature_data_source.source);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6c
	if ('continuous_high_temp_alarm_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.continuous_high_temp_alarm_settings.enable)) {
			buffer.writeUInt8(0x6c);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.continuous_high_temp_alarm_settings.enable) === -1) {
				throw new Error('continuous_high_temp_alarm_settings.enable must be one of [0, 1]');
			}
			// 0：Disable, 1：Enable
			buffer.writeUInt8(payload.continuous_high_temp_alarm_settings.enable);
		}
		if (isValid(payload.continuous_high_temp_alarm_settings.difference)) {
			buffer.writeUInt8(0x6c);
			buffer.writeUInt8(0x01);
			if (payload.continuous_high_temp_alarm_settings.difference < 1 || payload.continuous_high_temp_alarm_settings.difference > 10) {
				throw new Error('continuous_high_temp_alarm_settings.difference must be between 1 and 10');
			}
			buffer.writeInt16LE(payload.continuous_high_temp_alarm_settings.difference * 100);
		}
		if (isValid(payload.continuous_high_temp_alarm_settings.duration)) {
			buffer.writeUInt8(0x6c);
			buffer.writeUInt8(0x02);
			if (payload.continuous_high_temp_alarm_settings.duration < 0 || payload.continuous_high_temp_alarm_settings.duration > 60) {
				throw new Error('continuous_high_temp_alarm_settings.duration must be between 0 and 60');
			}
			buffer.writeUInt8(payload.continuous_high_temp_alarm_settings.duration);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6d
	if ('continuous_low_temp_alarm_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.continuous_low_temp_alarm_settings.enable)) {
			buffer.writeUInt8(0x6d);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.continuous_low_temp_alarm_settings.enable) === -1) {
				throw new Error('continuous_low_temp_alarm_settings.enable must be one of [0, 1]');
			}
			// 0：Disable, 1：Enable
			buffer.writeUInt8(payload.continuous_low_temp_alarm_settings.enable);
		}
		if (isValid(payload.continuous_low_temp_alarm_settings.difference)) {
			buffer.writeUInt8(0x6d);
			buffer.writeUInt8(0x01);
			if (payload.continuous_low_temp_alarm_settings.difference < 1 || payload.continuous_low_temp_alarm_settings.difference > 10) {
				throw new Error('continuous_low_temp_alarm_settings.difference must be between 1 and 10');
			}
			buffer.writeInt16LE(payload.continuous_low_temp_alarm_settings.difference * 100);
		}
		if (isValid(payload.continuous_low_temp_alarm_settings.duration)) {
			buffer.writeUInt8(0x6d);
			buffer.writeUInt8(0x02);
			if (payload.continuous_low_temp_alarm_settings.duration < 0 || payload.continuous_low_temp_alarm_settings.duration > 60) {
				throw new Error('continuous_low_temp_alarm_settings.duration must be between 0 and 60');
			}
			buffer.writeUInt8(payload.continuous_low_temp_alarm_settings.duration);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6e
	if ('temperature_alarm_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.temperature_alarm_settings.enable)) {
			buffer.writeUInt8(0x6e);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.temperature_alarm_settings.enable) === -1) {
				throw new Error('temperature_alarm_settings.enable must be one of [0, 1]');
			}
			// 0：Disable, 1：Enable
			buffer.writeUInt8(payload.temperature_alarm_settings.enable);
		}
		if (isValid(payload.temperature_alarm_settings.threshold_condition)) {
			buffer.writeUInt8(0x6e);
			// 0:Disable, 1:Condition: x<A, 2:Condition: x>B, 4:Condition: x<A or x>B
			buffer.writeUInt8(0x01);
			if ([0, 1, 2, 4].indexOf(payload.temperature_alarm_settings.threshold_condition) === -1) {
				throw new Error('temperature_alarm_settings.threshold_condition must be one of [0, 1, 2, 4]');
			}
			// 0:Disable, 1:Condition: x<A, 2:Condition: x>B, 4:Condition: x<A or x>B
			buffer.writeUInt8(payload.temperature_alarm_settings.threshold_condition);
		}
		if (isValid(payload.temperature_alarm_settings.threshold_min)) {
			buffer.writeUInt8(0x6e);
			buffer.writeUInt8(0x02);
			if (payload.temperature_alarm_settings.threshold_min < -20 || payload.temperature_alarm_settings.threshold_min > 70) {
				throw new Error('temperature_alarm_settings.threshold_min must be between -20 and 70');
			}
			buffer.writeInt16LE(payload.temperature_alarm_settings.threshold_min * 100);
		}
		if (isValid(payload.temperature_alarm_settings.threshold_max)) {
			buffer.writeUInt8(0x6e);
			buffer.writeUInt8(0x03);
			if (payload.temperature_alarm_settings.threshold_max < -20 || payload.temperature_alarm_settings.threshold_max > 70) {
				throw new Error('temperature_alarm_settings.threshold_max must be between -20 and 70');
			}
			buffer.writeInt16LE(payload.temperature_alarm_settings.threshold_max * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6f
	if ('system_switch' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6f);
		if ([0, 1].indexOf(payload.system_switch) === -1) {
			throw new Error('system_switch must be one of [0, 1]');
		}
		// 0：Switch Off, 1：Switch On
		buffer.writeUInt8(payload.system_switch);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x70
	if ('fan_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.fan_settings.fan_mode)) {
			buffer.writeUInt8(0x70);
			// 0：Auto, 1：Ventilation, 2：Always Open, 3：Low, 4：Medium, 5：High, 255：Disabled
			buffer.writeUInt8(0x00);
			if ([0, 1, 2, 3, 4, 5, 255].indexOf(payload.fan_settings.fan_mode) === -1) {
				throw new Error('fan_settings.fan_mode must be one of [0, 1, 2, 3, 4, 5, 255]');
			}
			// 0：Auto, 1：Ventilation, 2：Always Open, 3：Low, 4：Medium, 5：High, 255：Disabled
			buffer.writeUInt8(payload.fan_settings.fan_mode);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x73
	if ('plan_dwell_time_settings' in payload) {
		var buffer = new Buffer();
		for (var plan_dwell_time_settings_id = 0; plan_dwell_time_settings_id < (payload.plan_dwell_time_settings && payload.plan_dwell_time_settings.length); plan_dwell_time_settings_id++) {
			var plan_dwell_time_settings_item = payload.plan_dwell_time_settings[plan_dwell_time_settings_id];
			var plan_dwell_time_settings_item_id = plan_dwell_time_settings_item.id;
			if (isValid(plan_dwell_time_settings_item.permanent_stay_enable)) {
				buffer.writeUInt8(0x73);
				buffer.writeUInt8(plan_dwell_time_settings_item_id);
				// 0：Disable, 1：Enable
				buffer.writeUInt8(0x00);
				if ([0, 1].indexOf(plan_dwell_time_settings_item.permanent_stay_enable) === -1) {
					throw new Error('permanent_stay_enable must be one of [0, 1]');
				}
				// 0：Disable, 1：Enable
				buffer.writeUInt8(plan_dwell_time_settings_item.permanent_stay_enable);
			}
			if (isValid(plan_dwell_time_settings_item.dwell_time)) {
				buffer.writeUInt8(0x73);
				buffer.writeUInt8(plan_dwell_time_settings_item_id);
				buffer.writeUInt8(0x01);
				if (plan_dwell_time_settings_item.dwell_time < 0 || plan_dwell_time_settings_item.dwell_time > 120) {
					throw new Error('dwell_time must be between 0 and 120');
				}
				buffer.writeUInt8(plan_dwell_time_settings_item.dwell_time);
			}
			if (isValid(plan_dwell_time_settings_item.trigger_method)) {
				buffer.writeUInt8(0x73);
				buffer.writeUInt8(plan_dwell_time_settings_item_id);
				buffer.writeUInt8(0x02);
				buffer.writeUInt8(plan_dwell_time_settings_item.trigger_method);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x75
	if ('temperature_control_mode_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x75);
		var bitOptions = 0;
		// 0：disable, 1：enable
		bitOptions |= payload.temperature_control_mode_enable.heat << 0;

		// 0：disable, 1：enable
		bitOptions |= payload.temperature_control_mode_enable.em_heat << 1;

		// 0：disable, 1：enable
		bitOptions |= payload.temperature_control_mode_enable.cool << 2;

		// 0：disable, 1：enable
		bitOptions |= payload.temperature_control_mode_enable.auto << 3;

		// 0：disable, 1：enable
		bitOptions |= payload.temperature_control_mode_enable.dehumidify << 4;

		// 0：disable, 1：enable
		bitOptions |= payload.temperature_control_mode_enable.ventilate << 5;

		bitOptions |= payload.temperature_control_mode_enable.reserved << 6;
		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0x80
	if ('indicator_light_disable_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.indicator_light_disable_settings.enable)) {
			buffer.writeUInt8(0x80);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.indicator_light_disable_settings.enable) === -1) {
				throw new Error('indicator_light_disable_settings.enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.indicator_light_disable_settings.enable);
		}
		if (isValid(payload.indicator_light_disable_settings.time)) {
			buffer.writeUInt8(0x80);
			buffer.writeUInt8(0x01);
			if (payload.indicator_light_disable_settings.time < 600 || payload.indicator_light_disable_settings.time > 3600) {
				throw new Error('indicator_light_disable_settings.time must be between 600 and 3600');
			}
			buffer.writeUInt16LE(payload.indicator_light_disable_settings.time);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x81
	if ('enhanced_infrared_emission_power_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x81);
		if ([0, 1].indexOf(payload.enhanced_infrared_emission_power_enable) === -1) {
			throw new Error('enhanced_infrared_emission_power_enable must be one of [0, 1]');
		}
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.enhanced_infrared_emission_power_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x82
	if ('air_power_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.air_power_settings.refrigeration_power)) {
			buffer.writeUInt8(0x82);
			buffer.writeUInt8(0x00);
			if (payload.air_power_settings.refrigeration_power < 0 || payload.air_power_settings.refrigeration_power > 60000) {
				throw new Error('air_power_settings.refrigeration_power must be between 0 and 60000');
			}
			buffer.writeUInt16LE(payload.air_power_settings.refrigeration_power);
		}
		if (isValid(payload.air_power_settings.heating_power)) {
			buffer.writeUInt8(0x82);
			buffer.writeUInt8(0x01);
			if (payload.air_power_settings.heating_power < 0 || payload.air_power_settings.heating_power > 60000) {
				throw new Error('air_power_settings.heating_power must be between 0 and 60000');
			}
			buffer.writeUInt16LE(payload.air_power_settings.heating_power);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x83
	if ('temperature_limit_task_settings' in payload) {
		var buffer = new Buffer();
		for (var temperature_limit_task_settings_id = 0; temperature_limit_task_settings_id < (payload.temperature_limit_task_settings && payload.temperature_limit_task_settings.length); temperature_limit_task_settings_id++) {
			var temperature_limit_task_settings_item = payload.temperature_limit_task_settings[temperature_limit_task_settings_id];
			var temperature_limit_task_settings_item_id = temperature_limit_task_settings_item.id;
			if (isValid(temperature_limit_task_settings_item.enable)) {
				buffer.writeUInt8(0x83);
				buffer.writeUInt8(temperature_limit_task_settings_item_id);
				// 0：Disable, 1：Enable
				buffer.writeUInt8(0x00);
				if ([0, 1].indexOf(temperature_limit_task_settings_item.enable) === -1) {
					throw new Error('enable must be one of [0, 1]');
				}
				// 0：Disable, 1：Enable
				buffer.writeUInt8(temperature_limit_task_settings_item.enable);
			}
			if (isValid(temperature_limit_task_settings_item.task_date_settings)) {
				buffer.writeUInt8(0x83);
				buffer.writeUInt8(temperature_limit_task_settings_item_id);
				buffer.writeUInt8(0x01);
				if (temperature_limit_task_settings_item.task_date_settings.start_mon < 1 || temperature_limit_task_settings_item.task_date_settings.start_mon > 12) {
					throw new Error('task_date_settings.start_mon must be between 1 and 12');
				}
				buffer.writeUInt8(temperature_limit_task_settings_item.task_date_settings.start_mon);
				if (temperature_limit_task_settings_item.task_date_settings.start_day < 1 || temperature_limit_task_settings_item.task_date_settings.start_day > 31) {
					throw new Error('task_date_settings.start_day must be between 1 and 31');
				}
				buffer.writeUInt8(temperature_limit_task_settings_item.task_date_settings.start_day);
				if (temperature_limit_task_settings_item.task_date_settings.end_mon < 1 || temperature_limit_task_settings_item.task_date_settings.end_mon > 12) {
					throw new Error('task_date_settings.end_mon must be between 1 and 12');
				}
				buffer.writeUInt8(temperature_limit_task_settings_item.task_date_settings.end_mon);
				if (temperature_limit_task_settings_item.task_date_settings.end_day < 1 || temperature_limit_task_settings_item.task_date_settings.end_day > 31) {
					throw new Error('task_date_settings.end_day must be between 1 and 31');
				}
				buffer.writeUInt8(temperature_limit_task_settings_item.task_date_settings.end_day);
			}
			if (isValid(temperature_limit_task_settings_item.execute_period)) {
				buffer.writeUInt8(0x83);
				buffer.writeUInt8(temperature_limit_task_settings_item_id);
				buffer.writeUInt8(0x02);
				if (temperature_limit_task_settings_item.execute_period.start_minute < 0 || temperature_limit_task_settings_item.execute_period.start_minute > 1439) {
					throw new Error('execute_period.start_minute must be in range [0,1439]');
				}
				buffer.writeUInt16LE(temperature_limit_task_settings_item.execute_period.start_minute);
				if (temperature_limit_task_settings_item.execute_period.end_minute < 0 || temperature_limit_task_settings_item.execute_period.end_minute > 1439) {
					throw new Error('execute_period.end_minute must be in range [0,1439]');
				}
				buffer.writeUInt16LE(temperature_limit_task_settings_item.execute_period.end_minute);
			}
			if (isValid(temperature_limit_task_settings_item.cycle_settings)) {
				buffer.writeUInt8(0x83);
				buffer.writeUInt8(temperature_limit_task_settings_item_id);
				buffer.writeUInt8(0x03);
				var bitOptions = 0;
				// 0：disable, 1：enable
				bitOptions |= temperature_limit_task_settings_item.cycle_settings.execution_day_sun << 0;

				// 0：disable, 1：enable
				bitOptions |= temperature_limit_task_settings_item.cycle_settings.execution_day_mon << 1;

				// 0：disable, 1：enable
				bitOptions |= temperature_limit_task_settings_item.cycle_settings.execution_day_tues << 2;

				// 0：disable, 1：enable
				bitOptions |= temperature_limit_task_settings_item.cycle_settings.execution_day_wed << 3;

				// 0：disable, 1：enable
				bitOptions |= temperature_limit_task_settings_item.cycle_settings.execution_day_thu << 4;

				// 0：disable, 1：enable
				bitOptions |= temperature_limit_task_settings_item.cycle_settings.execution_day_fri << 5;

				// 0：disable, 1：enable
				bitOptions |= temperature_limit_task_settings_item.cycle_settings.execution_day_sat << 6;

				bitOptions |= temperature_limit_task_settings_item.cycle_settings.reserved << 7;
				buffer.writeUInt8(bitOptions);

			}
			if (isValid(temperature_limit_task_settings_item.low_threshold)) {
				buffer.writeUInt8(0x83);
				buffer.writeUInt8(temperature_limit_task_settings_item_id);
				buffer.writeUInt8(0x04);
				if (temperature_limit_task_settings_item.low_threshold < 5 || temperature_limit_task_settings_item.low_threshold > 35) {
					throw new Error('low_threshold must be between 5 and 35');
				}
				buffer.writeInt16LE(temperature_limit_task_settings_item.low_threshold * 100);
			}
			if (isValid(temperature_limit_task_settings_item.high_threshold)) {
				buffer.writeUInt8(0x83);
				buffer.writeUInt8(temperature_limit_task_settings_item_id);
				buffer.writeUInt8(0x05);
				if (temperature_limit_task_settings_item.high_threshold < 5 || temperature_limit_task_settings_item.high_threshold > 35) {
					throw new Error('high_threshold must be between 5 and 35');
				}
				buffer.writeInt16LE(temperature_limit_task_settings_item.high_threshold * 100);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x84
	if ('night_task_settings' in payload) {
		var buffer = new Buffer();
		for (var night_task_settings_id = 0; night_task_settings_id < (payload.night_task_settings && payload.night_task_settings.length); night_task_settings_id++) {
			var night_task_settings_item = payload.night_task_settings[night_task_settings_id];
			var night_task_settings_item_id = night_task_settings_item.id;
			if (isValid(night_task_settings_item.enable)) {
				buffer.writeUInt8(0x84);
				buffer.writeUInt8(night_task_settings_item_id);
				// 0：Disable, 1：Enable
				buffer.writeUInt8(0x00);
				if ([0, 1].indexOf(night_task_settings_item.enable) === -1) {
					throw new Error('enable must be one of [0, 1]');
				}
				// 0：Disable, 1：Enable
				buffer.writeUInt8(night_task_settings_item.enable);
			}
			if (isValid(night_task_settings_item.task_date_settings)) {
				buffer.writeUInt8(0x84);
				buffer.writeUInt8(night_task_settings_item_id);
				buffer.writeUInt8(0x01);
				if (night_task_settings_item.task_date_settings.start_mon < 1 || night_task_settings_item.task_date_settings.start_mon > 12) {
					throw new Error('task_date_settings.start_mon must be between 1 and 12');
				}
				buffer.writeUInt8(night_task_settings_item.task_date_settings.start_mon);
				if (night_task_settings_item.task_date_settings.start_day < 1 || night_task_settings_item.task_date_settings.start_day > 31) {
					throw new Error('task_date_settings.start_day must be between 1 and 31');
				}
				buffer.writeUInt8(night_task_settings_item.task_date_settings.start_day);
				if (night_task_settings_item.task_date_settings.end_mon < 1 || night_task_settings_item.task_date_settings.end_mon > 12) {
					throw new Error('task_date_settings.end_mon must be between 1 and 12');
				}
				buffer.writeUInt8(night_task_settings_item.task_date_settings.end_mon);
				if (night_task_settings_item.task_date_settings.end_day < 1 || night_task_settings_item.task_date_settings.end_day > 31) {
					throw new Error('task_date_settings.end_day must be between 1 and 31');
				}
				buffer.writeUInt8(night_task_settings_item.task_date_settings.end_day);
			}
			if (isValid(night_task_settings_item.execute_period)) {
				buffer.writeUInt8(0x84);
				buffer.writeUInt8(night_task_settings_item_id);
				buffer.writeUInt8(0x02);
				if (night_task_settings_item.execute_period.start_minute < 0 || night_task_settings_item.execute_period.start_minute > 1439) {
					throw new Error('execute_period.start_minute must be in range [0,1439]');
				}
				buffer.writeUInt16LE(night_task_settings_item.execute_period.start_minute);
				if (night_task_settings_item.execute_period.end_minute < 0 || night_task_settings_item.execute_period.end_minute > 1439) {
					throw new Error('execute_period.end_minute must be in range [0,1439]');
				}
				buffer.writeUInt16LE(night_task_settings_item.execute_period.end_minute);
			}
			if (isValid(night_task_settings_item.cycle_settings)) {
				buffer.writeUInt8(0x84);
				buffer.writeUInt8(night_task_settings_item_id);
				buffer.writeUInt8(0x03);
				var bitOptions = 0;
				// 0：disable, 1：enable
				bitOptions |= night_task_settings_item.cycle_settings.execution_day_sun << 0;

				// 0：disable, 1：enable
				bitOptions |= night_task_settings_item.cycle_settings.execution_day_mon << 1;

				// 0：disable, 1：enable
				bitOptions |= night_task_settings_item.cycle_settings.execution_day_tues << 2;

				// 0：disable, 1：enable
				bitOptions |= night_task_settings_item.cycle_settings.execution_day_wed << 3;

				// 0：disable, 1：enable
				bitOptions |= night_task_settings_item.cycle_settings.execution_day_thu << 4;

				// 0：disable, 1：enable
				bitOptions |= night_task_settings_item.cycle_settings.execution_day_fri << 5;

				// 0：disable, 1：enable
				bitOptions |= night_task_settings_item.cycle_settings.execution_day_sat << 6;

				bitOptions |= night_task_settings_item.cycle_settings.reserved << 7;
				buffer.writeUInt8(bitOptions);

			}
			if (isValid(night_task_settings_item.breaker_control)) {
				buffer.writeUInt8(0x84);
				buffer.writeUInt8(night_task_settings_item_id);
				// 0：other device, 1：self_executing
				buffer.writeUInt8(0x04);
				if ([0, 1].indexOf(night_task_settings_item.breaker_control) === -1) {
					throw new Error('breaker_control must be one of [0, 1]');
				}
				// 0：other device, 1：self_executing
				buffer.writeUInt8(night_task_settings_item.breaker_control);
			}
			if (isValid(night_task_settings_item.control_command)) {
				buffer.writeUInt8(0x84);
				buffer.writeUInt8(night_task_settings_item_id);
				// 0：NONE
				buffer.writeUInt8(0x05);
				if ([0].indexOf(night_task_settings_item.control_command) === -1) {
					throw new Error('control_command must be one of [0]');
				}
				// 0：NONE
				buffer.writeUInt8(night_task_settings_item.control_command);
			}
			if (isValid(night_task_settings_item.execute_condition)) {
				buffer.writeUInt8(0x84);
				buffer.writeUInt8(night_task_settings_item_id);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x06);
				if ([0, 1].indexOf(night_task_settings_item.execute_condition) === -1) {
					throw new Error('execute_condition must be one of [0, 1]');
				}
				// 0：disable, 1：enable
				buffer.writeUInt8(night_task_settings_item.execute_condition);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x85
	if ('vacation_task_settings' in payload) {
		var buffer = new Buffer();
		for (var vacation_task_settings_id = 0; vacation_task_settings_id < (payload.vacation_task_settings && payload.vacation_task_settings.length); vacation_task_settings_id++) {
			var vacation_task_settings_item = payload.vacation_task_settings[vacation_task_settings_id];
			var vacation_task_settings_item_id = vacation_task_settings_item.id;
			if (isValid(vacation_task_settings_item.enable)) {
				buffer.writeUInt8(0x85);
				buffer.writeUInt8(vacation_task_settings_item_id);
				// 0：Disable, 1：Enable
				buffer.writeUInt8(0x00);
				if ([0, 1].indexOf(vacation_task_settings_item.enable) === -1) {
					throw new Error('enable must be one of [0, 1]');
				}
				// 0：Disable, 1：Enable
				buffer.writeUInt8(vacation_task_settings_item.enable);
			}
			if (isValid(vacation_task_settings_item.task_date_settings)) {
				buffer.writeUInt8(0x85);
				buffer.writeUInt8(vacation_task_settings_item_id);
				buffer.writeUInt8(0x01);
				if (vacation_task_settings_item.task_date_settings.start_mon < 1 || vacation_task_settings_item.task_date_settings.start_mon > 12) {
					throw new Error('task_date_settings.start_mon must be between 1 and 12');
				}
				buffer.writeUInt8(vacation_task_settings_item.task_date_settings.start_mon);
				if (vacation_task_settings_item.task_date_settings.start_day < 1 || vacation_task_settings_item.task_date_settings.start_day > 31) {
					throw new Error('task_date_settings.start_day must be between 1 and 31');
				}
				buffer.writeUInt8(vacation_task_settings_item.task_date_settings.start_day);
				if (vacation_task_settings_item.task_date_settings.end_mon < 1 || vacation_task_settings_item.task_date_settings.end_mon > 12) {
					throw new Error('task_date_settings.end_mon must be between 1 and 12');
				}
				buffer.writeUInt8(vacation_task_settings_item.task_date_settings.end_mon);
				if (vacation_task_settings_item.task_date_settings.end_day < 1 || vacation_task_settings_item.task_date_settings.end_day > 31) {
					throw new Error('task_date_settings.end_day must be between 1 and 31');
				}
				buffer.writeUInt8(vacation_task_settings_item.task_date_settings.end_day);
			}
			if (isValid(vacation_task_settings_item.execute_period)) {
				buffer.writeUInt8(0x85);
				buffer.writeUInt8(vacation_task_settings_item_id);
				buffer.writeUInt8(0x02);
				if (vacation_task_settings_item.execute_period.start_minute < 0 || vacation_task_settings_item.execute_period.start_minute > 1439) {
					throw new Error('execute_period.start_minute must be in range [0,1439]');
				}
				buffer.writeUInt16LE(vacation_task_settings_item.execute_period.start_minute);
				if (vacation_task_settings_item.execute_period.end_minute < 0 || vacation_task_settings_item.execute_period.end_minute > 1439) {
					throw new Error('execute_period.end_minute must be in range [0,1439]');
				}
				buffer.writeUInt16LE(vacation_task_settings_item.execute_period.end_minute);
			}
			if (isValid(vacation_task_settings_item.cycle_settings)) {
				buffer.writeUInt8(0x85);
				buffer.writeUInt8(vacation_task_settings_item_id);
				buffer.writeUInt8(0x03);
				var bitOptions = 0;
				// 0：disable, 1：enable
				bitOptions |= vacation_task_settings_item.cycle_settings.execution_day_sun << 0;

				// 0：disable, 1：enable
				bitOptions |= vacation_task_settings_item.cycle_settings.execution_day_mon << 1;

				// 0：disable, 1：enable
				bitOptions |= vacation_task_settings_item.cycle_settings.execution_day_tues << 2;

				// 0：disable, 1：enable
				bitOptions |= vacation_task_settings_item.cycle_settings.execution_day_wed << 3;

				// 0：disable, 1：enable
				bitOptions |= vacation_task_settings_item.cycle_settings.execution_day_thu << 4;

				// 0：disable, 1：enable
				bitOptions |= vacation_task_settings_item.cycle_settings.execution_day_fri << 5;

				// 0：disable, 1：enable
				bitOptions |= vacation_task_settings_item.cycle_settings.execution_day_sat << 6;

				bitOptions |= vacation_task_settings_item.cycle_settings.reserved << 7;
				buffer.writeUInt8(bitOptions);

			}
			if (isValid(vacation_task_settings_item.breaker_control)) {
				buffer.writeUInt8(0x85);
				buffer.writeUInt8(vacation_task_settings_item_id);
				// 0：other device, 1：self_executing
				buffer.writeUInt8(0x04);
				if ([0, 1].indexOf(vacation_task_settings_item.breaker_control) === -1) {
					throw new Error('breaker_control must be one of [0, 1]');
				}
				// 0：other device, 1：self_executing
				buffer.writeUInt8(vacation_task_settings_item.breaker_control);
			}
			if (isValid(vacation_task_settings_item.execute_condition)) {
				buffer.writeUInt8(0x85);
				buffer.writeUInt8(vacation_task_settings_item_id);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x05);
				if ([0, 1].indexOf(vacation_task_settings_item.execute_condition) === -1) {
					throw new Error('execute_condition must be one of [0, 1]');
				}
				// 0：disable, 1：enable
				buffer.writeUInt8(vacation_task_settings_item.execute_condition);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x86
	if ('infrared_learn' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.infrared_learn.status)) {
			buffer.writeUInt8(0x86);
			// 0: Non learning state, 1: During a learning session, 2: In secondary learning (requires secondary learning+or - key), 3: In secondary learning (requires secondary learning mode key), 4: In secondary learning (requires secondary learning of wind keys), 5: Learning failure (timeout failure), 6: Learning failed (code library matching failed), 7: Success in Learning (One Study), 8: Learning success (secondary learning)
			buffer.writeUInt8(0x00);
			if ([0, 1, 2, 3, 4, 5, 6, 7, 8].indexOf(payload.infrared_learn.status) === -1) {
				throw new Error('infrared_learn.status must be one of [0, 1, 2, 3, 4, 5, 6, 7, 8]');
			}
			// 0: Non learning state, 1: During a learning session, 2: In secondary learning (requires secondary learning+or - key), 3: In secondary learning (requires secondary learning mode key), 4: In secondary learning (requires secondary learning of wind keys), 5: Learning failure (timeout failure), 6: Learning failed (code library matching failed), 7: Success in Learning (One Study), 8: Learning success (secondary learning)
			buffer.writeUInt8(payload.infrared_learn.status);
		}
		if (isValid(payload.infrared_learn.findnext_max)) {
			buffer.writeUInt8(0x86);
			buffer.writeUInt8(0x01);
			if (payload.infrared_learn.findnext_max < 1 || payload.infrared_learn.findnext_max > 20) {
				throw new Error('infrared_learn.findnext_max must be between 1 and 20');
			}
			buffer.writeUInt8(payload.infrared_learn.findnext_max);
		}
		if (isValid(payload.infrared_learn.findnext)) {
			buffer.writeUInt8(0x86);
			buffer.writeUInt8(0x02);
			if (payload.infrared_learn.findnext < 1 || payload.infrared_learn.findnext > 20) {
				throw new Error('infrared_learn.findnext must be between 1 and 20');
			}
			buffer.writeUInt8(payload.infrared_learn.findnext);
		}
		if (isValid(payload.infrared_learn.predefine_brand)) {
			buffer.writeUInt8(0x86);
			// 0: NONE, 1: XIAOMI/TCL, 2: SHINCO/SAMSUNG/ELECTROLUX, 3: RSD/MCQUAY/TICA, 4: WHIRLPOOL/BOSCH/AIRWELL, 5: FUJITSU/McQUAY, 6: TRUMA
			buffer.writeUInt8(0x03);
			if ([0, 1, 2, 3, 4, 5, 6].indexOf(payload.infrared_learn.predefine_brand) === -1) {
				throw new Error('infrared_learn.predefine_brand must be one of [0, 1, 2, 3, 4, 5, 6]');
			}
			// 0: NONE, 1: XIAOMI/TCL, 2: SHINCO/SAMSUNG/ELECTROLUX, 3: RSD/MCQUAY/TICA, 4: WHIRLPOOL/BOSCH/AIRWELL, 5: FUJITSU/McQUAY, 6: TRUMA
			buffer.writeUInt8(payload.infrared_learn.predefine_brand);
		}
		if (isValid(payload.infrared_learn.package_status)) {
			buffer.writeUInt8(0x86);
			// 0: No infrared format packet, 1: Infrared format package already exists
			buffer.writeUInt8(0x04);
			if ([0, 1].indexOf(payload.infrared_learn.package_status) === -1) {
				throw new Error('infrared_learn.package_status must be one of [0, 1]');
			}
			// 0: No infrared format packet, 1: Infrared format package already exists
			buffer.writeUInt8(payload.infrared_learn.package_status);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x88
	if ('internal_sensor_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.internal_sensor_settings.name1)) {
			buffer.writeUInt8(0x88);
			buffer.writeUInt8(0x00);
			buffer.writeString(payload.internal_sensor_settings.name1, 6);
		}
		if (isValid(payload.internal_sensor_settings.name2)) {
			buffer.writeUInt8(0x88);
			buffer.writeUInt8(0x01);
			buffer.writeString(payload.internal_sensor_settings.name2, 6);
		}
		if (isValid(payload.internal_sensor_settings.name3)) {
			buffer.writeUInt8(0x88);
			buffer.writeUInt8(0x02);
			buffer.writeString(payload.internal_sensor_settings.name3, 6);
		}
		if (isValid(payload.internal_sensor_settings.collect_period)) {
			buffer.writeUInt8(0x88);
			buffer.writeUInt8(0x03);
			if (payload.internal_sensor_settings.collect_period < 30 || payload.internal_sensor_settings.collect_period > 3600) {
				throw new Error('internal_sensor_settings.collect_period must be between 30 and 3600');
			}
			buffer.writeUInt16LE(payload.internal_sensor_settings.collect_period);
		}
		if (isValid(payload.internal_sensor_settings.temperature_calibration_en)) {
			buffer.writeUInt8(0x88);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(0x04);
			if ([0, 1].indexOf(payload.internal_sensor_settings.temperature_calibration_en) === -1) {
				throw new Error('internal_sensor_settings.temperature_calibration_en must be one of [0, 1]');
			}
			// 0：Disable, 1：Enable
			buffer.writeUInt8(payload.internal_sensor_settings.temperature_calibration_en);
		}
		if (isValid(payload.internal_sensor_settings.temp_calibration)) {
			buffer.writeUInt8(0x88);
			buffer.writeUInt8(0x05);
			if (payload.internal_sensor_settings.temp_calibration < -70 || payload.internal_sensor_settings.temp_calibration > 70) {
				throw new Error('internal_sensor_settings.temp_calibration must be between -70 and 70');
			}
			buffer.writeInt16LE(payload.internal_sensor_settings.temp_calibration * 100);
		}
		if (isValid(payload.internal_sensor_settings.humi_calibration_en)) {
			buffer.writeUInt8(0x88);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(0x06);
			if ([0, 1].indexOf(payload.internal_sensor_settings.humi_calibration_en) === -1) {
				throw new Error('internal_sensor_settings.humi_calibration_en must be one of [0, 1]');
			}
			// 0：Disable, 1：Enable
			buffer.writeUInt8(payload.internal_sensor_settings.humi_calibration_en);
		}
		if (isValid(payload.internal_sensor_settings.humi_calibration)) {
			buffer.writeUInt8(0x88);
			buffer.writeUInt8(0x07);
			if (payload.internal_sensor_settings.humi_calibration < -100 || payload.internal_sensor_settings.humi_calibration > 100) {
				throw new Error('internal_sensor_settings.humi_calibration must be between -100 and 100');
			}
			buffer.writeInt16LE(payload.internal_sensor_settings.humi_calibration * 10);
		}
		if (isValid(payload.internal_sensor_settings.sensor_type)) {
			buffer.writeUInt8(0x88);
			// 0：Temperature Sensor, 1：Temperature and Humidity Sensor
			buffer.writeUInt8(0x08);
			if ([0, 1].indexOf(payload.internal_sensor_settings.sensor_type) === -1) {
				throw new Error('internal_sensor_settings.sensor_type must be one of [0, 1]');
			}
			// 0：Temperature Sensor, 1：Temperature and Humidity Sensor
			buffer.writeUInt8(payload.internal_sensor_settings.sensor_type);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x89
	if ('external_sensor_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.external_sensor_settings.name1)) {
			buffer.writeUInt8(0x89);
			buffer.writeUInt8(0x00);
			buffer.writeString(payload.external_sensor_settings.name1, 6);
		}
		if (isValid(payload.external_sensor_settings.name2)) {
			buffer.writeUInt8(0x89);
			buffer.writeUInt8(0x01);
			buffer.writeString(payload.external_sensor_settings.name2, 6);
		}
		if (isValid(payload.external_sensor_settings.name3)) {
			buffer.writeUInt8(0x89);
			buffer.writeUInt8(0x02);
			buffer.writeString(payload.external_sensor_settings.name3, 6);
		}
		if (isValid(payload.external_sensor_settings.calibration_en)) {
			buffer.writeUInt8(0x89);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(0x04);
			if ([0, 1].indexOf(payload.external_sensor_settings.calibration_en) === -1) {
				throw new Error('external_sensor_settings.calibration_en must be one of [0, 1]');
			}
			// 0：Disable, 1：Enable
			buffer.writeUInt8(payload.external_sensor_settings.calibration_en);
		}
		if (isValid(payload.external_sensor_settings.temp_calibration)) {
			buffer.writeUInt8(0x89);
			buffer.writeUInt8(0x05);
			if (payload.external_sensor_settings.temp_calibration < -70 || payload.external_sensor_settings.temp_calibration > 70) {
				throw new Error('external_sensor_settings.temp_calibration must be between -70 and 70');
			}
			buffer.writeInt16LE(payload.external_sensor_settings.temp_calibration * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x8a
	if ('ct_sensor_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.ct_sensor_settings.connected)) {
			buffer.writeUInt8(0x8a);
			// 0：Disconnected, 1：Connected
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.ct_sensor_settings.connected) === -1) {
				throw new Error('ct_sensor_settings.connected must be one of [0, 1]');
			}
			// 0：Disconnected, 1：Connected
			buffer.writeUInt8(payload.ct_sensor_settings.connected);
		}
		if (isValid(payload.ct_sensor_settings.collect_period)) {
			buffer.writeUInt8(0x8a);
			buffer.writeUInt8(0x01);
			if (payload.ct_sensor_settings.collect_period < 1 || payload.ct_sensor_settings.collect_period > 128) {
				throw new Error('ct_sensor_settings.collect_period must be between 1 and 128');
			}
			buffer.writeUInt16LE(payload.ct_sensor_settings.collect_period);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x8b
	if ('filter_clean_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.filter_clean_settings.enable)) {
			buffer.writeUInt8(0x8b);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.filter_clean_settings.enable) === -1) {
				throw new Error('filter_clean_settings.enable must be one of [0, 1]');
			}
			// 0：Disable, 1：Enable
			buffer.writeUInt8(payload.filter_clean_settings.enable);
		}
		if (isValid(payload.filter_clean_settings.reminder_period)) {
			buffer.writeUInt8(0x8b);
			buffer.writeUInt8(0x01);
			if (payload.filter_clean_settings.reminder_period < 1 || payload.filter_clean_settings.reminder_period > 730) {
				throw new Error('filter_clean_settings.reminder_period must be between 1 and 730');
			}
			buffer.writeUInt16LE(payload.filter_clean_settings.reminder_period);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x8e
	if ('infrared_format_code' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x8e);
		buffer.writeUInt8(payload.infrared_format_code.offset);
		if (payload.infrared_format_code.length < 0 || payload.infrared_format_code.length > 255) {
			throw new Error('infrared_format_code.length must be between 0 and 255');
		}
		buffer.writeUInt8(payload.infrared_format_code.length);
		buffer.writeBytes(payload.infrared_format_code.format_code, payload.infrared_format_code.length, true);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x90
	if ('ble_adv_time_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.ble_adv_time_settings.enable)) {
			buffer.writeUInt8(0x90);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.ble_adv_time_settings.enable) === -1) {
				throw new Error('ble_adv_time_settings.enable must be one of [0, 1]');
			}
			// 0：Disable, 1：Enable
			buffer.writeUInt8(payload.ble_adv_time_settings.enable);
		}
		if (isValid(payload.ble_adv_time_settings.duration)) {
			buffer.writeUInt8(0x90);
			buffer.writeUInt8(0x01);
			if (payload.ble_adv_time_settings.duration < 1 || payload.ble_adv_time_settings.duration > 10) {
				throw new Error('ble_adv_time_settings.duration must be between 1 and 10');
			}
			buffer.writeUInt8(payload.ble_adv_time_settings.duration);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x92
	if ('battery_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x92);
		if ([0, 1].indexOf(payload.battery_enable) === -1) {
			throw new Error('battery_enable must be one of [0, 1]');
		}
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.battery_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x93
	if ('dormant_settings' in payload) {
		var buffer = new Buffer();
		for (var dormant_settings_id = 0; dormant_settings_id < (payload.dormant_settings && payload.dormant_settings.length); dormant_settings_id++) {
			var dormant_settings_item = payload.dormant_settings[dormant_settings_id];
			var dormant_settings_item_id = dormant_settings_item.id;
			if (isValid(dormant_settings_item.enable)) {
				buffer.writeUInt8(0x93);
				buffer.writeUInt8(dormant_settings_item_id);
				// 0：Disable, 1：Enable
				buffer.writeUInt8(0x00);
				if ([0, 1].indexOf(dormant_settings_item.enable) === -1) {
					throw new Error('enable must be one of [0, 1]');
				}
				// 0：Disable, 1：Enable
				buffer.writeUInt8(dormant_settings_item.enable);
			}
			if (isValid(dormant_settings_item.heating_date_settings)) {
				buffer.writeUInt8(0x93);
				buffer.writeUInt8(dormant_settings_item_id);
				buffer.writeUInt8(0x01);
				if (dormant_settings_item.heating_date_settings.start_mon < 1 || dormant_settings_item.heating_date_settings.start_mon > 12) {
					throw new Error('heating_date_settings.start_mon must be between 1 and 12');
				}
				buffer.writeUInt8(dormant_settings_item.heating_date_settings.start_mon);
				if (dormant_settings_item.heating_date_settings.start_day < 1 || dormant_settings_item.heating_date_settings.start_day > 31) {
					throw new Error('heating_date_settings.start_day must be between 1 and 31');
				}
				buffer.writeUInt8(dormant_settings_item.heating_date_settings.start_day);
				if (dormant_settings_item.heating_date_settings.end_mon < 1 || dormant_settings_item.heating_date_settings.end_mon > 12) {
					throw new Error('heating_date_settings.end_mon must be between 1 and 12');
				}
				buffer.writeUInt8(dormant_settings_item.heating_date_settings.end_mon);
				if (dormant_settings_item.heating_date_settings.end_day < 1 || dormant_settings_item.heating_date_settings.end_day > 31) {
					throw new Error('heating_date_settings.end_day must be between 1 and 31');
				}
				buffer.writeUInt8(dormant_settings_item.heating_date_settings.end_day);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xc7
	if ('time_zone' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xc7);
		if ([-720, -660, -600, -570, -540, -480, -420, -360, -300, -240, -210, -180, -120, -60, 0, 60, 120, 180, 210, 240, 270, 300, 330, 345, 360, 390, 420, 480, 540, 570, 600, 630, 660, 720, 765, 780, 840].indexOf(payload.time_zone) === -1) {
			throw new Error('time_zone must be one of [-720, -660, -600, -570, -540, -480, -420, -360, -300, -240, -210, -180, -120, -60, 0, 60, 120, 180, 210, 240, 270, 300, 330, 345, 360, 390, 420, 480, 540, 570, 600, 630, 660, 720, 765, 780, 840]');
		}
		buffer.writeInt16LE(payload.time_zone);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xc6
	if ('daylight_saving_time' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xc6);
		if ([0, 1].indexOf(payload.daylight_saving_time.enable) === -1) {
			throw new Error('daylight_saving_time.enable must be one of [0, 1]');
		}
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.daylight_saving_time.enable);
		if (payload.daylight_saving_time.daylight_saving_time_offset < 1 || payload.daylight_saving_time.daylight_saving_time_offset > 120) {
			throw new Error('daylight_saving_time.daylight_saving_time_offset must be between 1 and 120');
		}
		buffer.writeUInt8(payload.daylight_saving_time.daylight_saving_time_offset);
		if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].indexOf(payload.daylight_saving_time.start_month) === -1) {
			throw new Error('daylight_saving_time.start_month must be one of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]');
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
			throw new Error('daylight_saving_time.start_hour_min must be one of [0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840, 900, 960, 1020, 1080, 1140, 1200, 1260, 1320, 1380]');
		}
		buffer.writeUInt16LE(payload.daylight_saving_time.start_hour_min);
		if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].indexOf(payload.daylight_saving_time.end_month) === -1) {
			throw new Error('daylight_saving_time.end_month must be one of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]');
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
			throw new Error('daylight_saving_time.end_hour_min must be one of [0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840, 900, 960, 1020, 1080, 1140, 1200, 1260, 1320, 1380]');
		}
		buffer.writeUInt16LE(payload.daylight_saving_time.end_hour_min);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x97
	if ('d2d_slave_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x97);
		if ([0, 1].indexOf(payload.d2d_slave_enable) === -1) {
			throw new Error('d2d_slave_enable must be one of [0, 1]');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.d2d_slave_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x98
	if ('d2d_slave_settings' in payload) {
		var buffer = new Buffer();
		for (var d2d_slave_settings_id = 0; d2d_slave_settings_id < (payload.d2d_slave_settings && payload.d2d_slave_settings.length); d2d_slave_settings_id++) {
			var d2d_slave_settings_item = payload.d2d_slave_settings[d2d_slave_settings_id];
			var d2d_slave_settings_item_id = d2d_slave_settings_item.index;
			buffer.writeUInt8(0x98);
			buffer.writeUInt8(d2d_slave_settings_item_id);
			if ([0, 1].indexOf(d2d_slave_settings_item.enable) === -1) {
				throw new Error('enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(d2d_slave_settings_item.enable);
			buffer.writeHexString(d2d_slave_settings_item.command, pair_name_item.length, true);
			if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].indexOf(d2d_slave_settings_item.value) === -1) {
				throw new Error('value must be one of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]');
			}
			// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8, 8：Schedule9, 9：Schedule10, 10：Schedule11, 11：Schedule12, 12：Schedule13, 13：Schedule14, 14：Schedule15, 15：Schedule16, 16：System Off, 17：System On
			buffer.writeUInt8(d2d_slave_settings_item.value);
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
			throw new Error('set_time.timestamp must be in range [0,4294967295]');
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
			throw new Error('retrieve_historical_data_by_time_range.start_time must be in range [0,4294967295]');
		}
		buffer.writeUInt32LE(payload.retrieve_historical_data_by_time_range.start_time);
		if (payload.retrieve_historical_data_by_time_range.end_time < 0 || payload.retrieve_historical_data_by_time_range.end_time > 4294967295) {
			throw new Error('retrieve_historical_data_by_time_range.end_time must be in range [0,4294967295]');
		}
		buffer.writeUInt32LE(payload.retrieve_historical_data_by_time_range.end_time);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xbe
	if ('reboot' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xbe);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x5f
	if ('delete_task_plan' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x5f);
		if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 255].indexOf(payload.delete_task_plan.type) === -1) {
			throw new Error('delete_task_plan.type must be one of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 255]');
		}
		// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8, 8：Schedule9, 9：Schedule10, 10：Schedule11, 11：Schedule12, 12：Schedule13, 13：Schedule14, 14：Schedule15, 15：Schedule16, 255：All
		buffer.writeUInt8(payload.delete_task_plan.type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x5c
	if ('insert_temporary_plan' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x5c);
		if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].indexOf(payload.insert_temporary_plan.id) === -1) {
			throw new Error('insert_temporary_plan.id must be one of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]');
		}
		// 0：Insert Schedule1, 1：Insert Schedule2, 2：Insert Schedule3, 3：Insert Schedule4, 4：Insert Schedule5, 5：Insert Schedule6, 6：Insert Schedule7, 7：Insert Schedule8, 8：Insert Schedule9, 9：Insert Schedule10, 10：Insert Schedule11, 11：Insert Schedule12, 12：Insert Schedule13, 13：Insert Schedule14, 14：Insert Schedule15, 15：Insert Schedule16
		buffer.writeUInt8(payload.insert_temporary_plan.id);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x5b
	if ('filter_clean_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x5b);
		if ([0, 1].indexOf(payload.filter_clean_alarm.mode) === -1) {
			throw new Error('filter_clean_alarm.mode must be one of [0, 1]');
		}
		// 0：clean alarm, 1：report alarm
		buffer.writeUInt8(payload.filter_clean_alarm.mode);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x5a
	if ('open_window_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x5a);
		if ([0, 1].indexOf(payload.open_window_alarm.mode) === -1) {
			throw new Error('open_window_alarm.mode must be one of [0, 1]');
		}
		// 0：clean alarm, 1：report alarm
		buffer.writeUInt8(payload.open_window_alarm.mode);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x59
	if ('clear_infrared_format_code' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x59);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x58
	if ('delete_temperature_limit_task' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x58);
		if ([0, 1, 2, 3, 4, 5, 6, 7, 255].indexOf(payload.delete_temperature_limit_task.type) === -1) {
			throw new Error('delete_temperature_limit_task.type must be one of [0, 1, 2, 3, 4, 5, 6, 7, 255]');
		}
		// 0：Task1, 1：Task2, 2：Task3, 3：Task4, 4：Task5, 5：Task6, 6：Task7, 7：Task8, 255：All
		buffer.writeUInt8(payload.delete_temperature_limit_task.type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x57
	if ('delete_night_task' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x57);
		if ([0, 1, 2, 3, 4, 5, 6, 7, 255].indexOf(payload.delete_night_task.type) === -1) {
			throw new Error('delete_night_task.type must be one of [0, 1, 2, 3, 4, 5, 6, 7, 255]');
		}
		// 0：Task1, 1：Task2, 2：Task3, 3：Task4, 4：Task5, 5：Task6, 6：Task7, 7：Task8, 255：All
		buffer.writeUInt8(payload.delete_night_task.type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x56
	if ('delete_vacation_task' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x56);
		if ([0, 1, 2, 3, 4, 5, 6, 7, 255].indexOf(payload.delete_vacation_task.type) === -1) {
			throw new Error('delete_vacation_task.type must be one of [0, 1, 2, 3, 4, 5, 6, 7, 255]');
		}
		// 0：Task1, 1：Task2, 2：Task3, 3：Task4, 4：Task5, 5：Task6, 6：Task7, 7：Task8, 255：All
		buffer.writeUInt8(payload.delete_vacation_task.type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x55
	if ('trigger_infrared_learn' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x55);
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

function cmdMap() {
	return {
		  "request_check_sequence_number": "ff",
		  "request_check_order": "fe",
		  "request_security_password_check": "fd",
		  "request_security_password_change": "fc",
		  "request_password_check": "fb",
		  "request_password_change": "fa",
		  "request_firmware_upgrade": "f7",
		  "request_firmware_upgrade.start_upgrade": "f700",
		  "request_firmware_upgrade.transmission": "f701",
		  "request_firmware_upgrade.end_upgrade": "f702",
		  "request_firmware_upgrade.continue_upgrade": "f703",
		  "request_firmware_upgrade.completion_check": "f704",
		  "request_preconfiguration": "f6",
		  "request_preconfiguration.start_writing": "f600",
		  "request_preconfiguration.configuration_writing": "f601",
		  "request_preconfiguration.end_writing": "f602",
		  "request_historical_data_export": "f5",
		  "request_historical_data_export.start_exporting": "f510",
		  "request_historical_data_export.exported_data": "f511",
		  "request_historical_data_export.end_exporting": "f512",
		  "request_historical_data_export.exported_all_data": "f513",
		  "request_historical_data_export.start_exporting_with_type": "f514",
		  "request_full_inspection": "f4",
		  "request_full_inspection.start_inspection": "f400",
		  "request_full_inspection.control": "f401",
		  "request_full_inspection.reading": "f402",
		  "request_full_inspection.end_inspection": "f403",
		  "request_full_inspection.aging": "f404",
		  "request_command_queries": "ef",
		  "request_query_all_configurations": "ee",
		  "historical_data_report": "ed",
		  "ipso_device_upgrade": "ec",
		  "ipso_device_upgrade.firmwares._item": "undefinedxx",
		  "debugging_commands": "eb",
		  "lorawan_configuration_settings": "cf",
		  "lorawan_configuration_settings.deveui": "cf0b",
		  "lorawan_configuration_settings.appeui": "cf13",
		  "lorawan_configuration_settings.netid": "cf03",
		  "lorawan_configuration_settings.app_port": "cf5c",
		  "lorawan_configuration_settings.version": "cfd8",
		  "lorawan_configuration_settings.mode": "cf00",
		  "lorawan_configuration_settings.confirmed_mode": "cf5d",
		  "lorawan_configuration_settings.ack_retry_times": "cfc6",
		  "lorawan_configuration_settings.join_type": "cf01",
		  "lorawan_configuration_settings.appkey": "cf3b",
		  "lorawan_configuration_settings.nwkskey": "cf1b",
		  "lorawan_configuration_settings.appskey": "cf2b",
		  "lorawan_configuration_settings.devaddr": "cf07",
		  "lorawan_configuration_settings.rejoin_mode_enable": "cfda",
		  "lorawan_configuration_settings.number_of_link_detection_signals": "cfd9",
		  "lorawan_configuration_settings.frequency_band": "cfcd",
		  "lorawan_configuration_settings.AS923_frequency_band_in_use": "cfdc",
		  "lorawan_configuration_settings.channel_mask": "cf5e",
		  "lorawan_configuration_settings.channels_settings": "cf6a",
		  "lorawan_configuration_settings.channels_settings._item": "cf6axx",
		  "lorawan_configuration_settings.adr_mode": "cf02",
		  "lorawan_configuration_settings.tx_data_rate": "cfba",
		  "lorawan_configuration_settings.tx_power": "cf5b",
		  "lorawan_configuration_settings.rx2_data_rate": "cfbf",
		  "lorawan_configuration_settings.rx2_frequency": "cfbb",
		  "lorawan_configuration_settings.pingslot_periodicity": "cfdd",
		  "lorawan_configuration_settings.rx1_open_delay": "cf4b",
		  "lorawan_configuration_settings.rx2_open_delay": "cf4f",
		  "lorawan_configuration_settings.join_rx1_open_delay": "cf53",
		  "lorawan_configuration_settings.join_rx2_open_delay": "cf57",
		  "lorawan_configuration_settings.multicast_group_settings": "cff9",
		  "lorawan_configuration_settings.multicast_group_settings.group_1_enable": "cff90d",
		  "lorawan_configuration_settings.multicast_group_settings.group_1_devaddr": "cff914",
		  "lorawan_configuration_settings.multicast_group_settings.group_1_appskey": "cff928",
		  "lorawan_configuration_settings.multicast_group_settings.group_1_nwkskey": "cff918",
		  "lorawan_configuration_settings.multicast_group_settings.group_1_pingslot_periodicity": "cff90e",
		  "lorawan_configuration_settings.multicast_group_settings.group_1_data_rate": "cff90f",
		  "lorawan_configuration_settings.multicast_group_settings.group_1_frequency": "cff910",
		  "lorawan_configuration_settings.multicast_group_settings.group_2_enable": "cff93a",
		  "lorawan_configuration_settings.multicast_group_settings.group_2_devaddr": "cff941",
		  "lorawan_configuration_settings.multicast_group_settings.group_2_appskey": "cff955",
		  "lorawan_configuration_settings.multicast_group_settings.group_2_nwkskey": "cff945",
		  "lorawan_configuration_settings.multicast_group_settings.group_2_pingslot_periodicity": "cff93b",
		  "lorawan_configuration_settings.multicast_group_settings.group_2_data_rate": "cff93c",
		  "lorawan_configuration_settings.multicast_group_settings.group_2_frequency": "cff93d",
		  "lorawan_configuration_settings.multicast_group_settings.group_3_enable": "cff967",
		  "lorawan_configuration_settings.multicast_group_settings.group_3_devaddr": "cff96e",
		  "lorawan_configuration_settings.multicast_group_settings.group_3_appskey": "cff982",
		  "lorawan_configuration_settings.multicast_group_settings.group_3_nwkskey": "cff972",
		  "lorawan_configuration_settings.multicast_group_settings.group_3_pingslot_periodicity": "cff968",
		  "lorawan_configuration_settings.multicast_group_settings.group_3_data_rate": "cff969",
		  "lorawan_configuration_settings.multicast_group_settings.group_3_frequency": "cff96a",
		  "lorawan_configuration_settings.multicast_group_settings.group_4_enable": "cff994",
		  "lorawan_configuration_settings.multicast_group_settings.group_4_devaddr": "cff99b",
		  "lorawan_configuration_settings.multicast_group_settings.group_4_appskey": "cff9af",
		  "lorawan_configuration_settings.multicast_group_settings.group_4_nwkskey": "cff99f",
		  "lorawan_configuration_settings.multicast_group_settings.group_4_pingslot_periodicity": "cff995",
		  "lorawan_configuration_settings.multicast_group_settings.group_4_data_rate": "cff996",
		  "lorawan_configuration_settings.multicast_group_settings.group_4_frequency": "cff997",
		  "lorawan_configuration_settings.d2d_key": "cfe0",
		  "lorawan_configuration_settings.duty_cycle_enable": "cfc4",
		  "lorawan_configuration_settings.duty_cycle": "cfc0",
		  "tsl_version": "df",
		  "product_name": "de",
		  "product_pn": "dd",
		  "product_sn": "db",
		  "version": "da",
		  "oem_id": "d9",
		  "device_status": "c8",
		  "product_frequency_band": "d8",
		  "device_info": "d7",
		  "lorawan_status": "bf",
		  "lorawan_status.join_status": "bf00",
		  "lorawan_status.eui": "bf01",
		  "lorawan_status.signal": "bf02",
		  "lorawan_status.channel_mask": "bf03",
		  "lorawan_status.frame_counter": "bf04",
		  "device_time": "b9",
		  "battery_info": "b8",
		  "ble_phone_name": "d5",
		  "ble_configuration_settings": "cd",
		  "ble_configuration_settings.enable": "cd00",
		  "ble_configuration_settings.local_id": "cd01",
		  "ble_configuration_settings.local_name_first": "cd05",
		  "ble_configuration_settings.local_name_last": "cd06",
		  "ble_configuration_settings.pair_info": "cd07",
		  "ble_configuration_settings.pair_name": "cd04",
		  "ble_configuration_settings.pair_name._item": "cd04xx",
		  "ble_configuration_settings.pair_mac": "cd02",
		  "ble_configuration_settings.pair_mac._item": "cd02xx",
		  "ble_configuration_settings.pair_addr": "cd03",
		  "ble_configuration_settings.pair_addr._item": "cd03xx",
		  "ble_configuration_settings.local_info": "cd08",
		  "ble_new_event": "ba",
		  "ble_new_event._item": "baxx",
		  "ble_server": "b4",
		  "battery": "00",
		  "low_battery_alarm": "01",
		  "temperature_alarm": "02",
		  "temperature_alarm.open_window_alarm_deactivation": "0200",
		  "temperature_alarm.open_window_alarm_trigger": "0201",
		  "temperature_alarm.over_range_alarm_trigger": "0220",
		  "temperature_alarm.over_range_alarm_deactivation": "0221",
		  "temperature_alarm.lower_range_alarm_trigger": "0222",
		  "temperature_alarm.lower_range_alarm_deactivation": "0223",
		  "temperature_alarm.within_range_alarm_trigger": "0224",
		  "temperature_alarm.within_range_alarm_deactivation": "0225",
		  "temperature_alarm.outside_range_alarm_trigger": "0226",
		  "temperature_alarm.outside_range_alarm_deactivation": "0227",
		  "temperature_alarm.persistent_low_temp_deactivation": "0230",
		  "temperature_alarm.persistent_low_temp_trigger": "0231",
		  "temperature_alarm.persistent_high_temp_deactivation": "0240",
		  "temperature_alarm.persistent_high_temp_trigger": "0241",
		  "sensor_error": "03",
		  "sensor_error.internal_sensor_collect_error": "0300",
		  "sensor_error.external_sensor_collect_error": "03f0",
		  "sensor_error.internal_sensor_lower_ranger_error": "0301",
		  "sensor_error.external_sensor_lower_ranger_error": "03f1",
		  "sensor_error.internal_sensor_over_ranger_error": "0302",
		  "sensor_error.external_sensor_over_ranger_error": "03f2",
		  "infrared_cmd_status": "04",
		  "running_state": "05",
		  "running_state.infrared_cmd": "0500",
		  "running_state.current_transformer": "0501",
		  "internal_temp": "06",
		  "external_temp": "07",
		  "humidity": "08",
		  "filter_clean_remind": "09",
		  "cmd_temp_limit": "0a",
		  "cmd_temp_limit.lower_range_alarm_trigger": "0a00",
		  "cmd_temp_limit.over_range_alarm_trigger": "0a01",
		  "local_temp_limit": "0b",
		  "local_temp_limit.lower_range_alarm_trigger": "0b00",
		  "local_temp_limit.over_range_alarm_trigger": "0b01",
		  "data_transparent": "30",
		  "data_transparent.res_cmd1": "3000",
		  "data_transparent.res_cmd1.battery": "300000",
		  "data_transparent.res_cmd1.battery_event": "30000f",
		  "data_transparent.res_cmd1.battery_event.recover": "30000f00",
		  "data_transparent.res_cmd1.battery_event.low_volt": "30000f01",
		  "data_transparent.res_cmd1.key_event": "30000d",
		  "data_transparent.res_cmd1.key_event.f1": "30000d00",
		  "data_transparent.res_cmd1.key_event.f2": "30000d01",
		  "data_transparent.res_cmd1.key_event.f3": "30000d02",
		  "data_transparent.res_cmd1.device_status": "3000c8",
		  "random_key": "c9",
		  "auto_p_enable": "c4",
		  "data_storage_settings": "c5",
		  "data_storage_settings.enable": "c500",
		  "data_storage_settings.retransmission_enable": "c501",
		  "data_storage_settings.retransmission_interval": "c502",
		  "data_storage_settings.retrieval_interval": "c503",
		  "temperature_control_mode": "60",
		  "temperature_control_mode.ctrl_mode": "6000",
		  "temperature_control_mode.plan_enable": "6001",
		  "target_temperature_settings": "61",
		  "target_temperature_settings.heat": "6100",
		  "target_temperature_settings.cool": "6102",
		  "target_temperature_settings.auto": "6103",
		  "target_temperature_tolerance": "62",
		  "target_temperature_tolerance.target_value": "6200",
		  "temperature_unit": "64",
		  "target_temperature_resolution": "65",
		  "communication_mode": "91",
		  "reporting_interval": "66",
		  "reporting_interval.ble_lora": "6600",
		  "reporting_interval.ble_lora.seconds_of_time": "660000",
		  "reporting_interval.ble_lora.minutes_of_time": "660001",
		  "schedule_settings": "67",
		  "schedule_settings._item": "67xx",
		  "schedule_settings._item.enable": "67xx00",
		  "schedule_settings._item.name1": "67xx01",
		  "schedule_settings._item.name2": "67xx02",
		  "schedule_settings._item.fan_mode": "67xx03",
		  "schedule_settings._item.target_temp": "67xx04",
		  "schedule_settings._item.switch_on": "67xx05",
		  "schedule_settings._item.work_mode": "67xx06",
		  "schedule_settings._item.cycle_settings": "67xx07",
		  "schedule_settings._item.cycle_settings._item": "67xx07xx",
		  "window_opening_detection_settings": "68",
		  "window_opening_detection_settings.enable": "6800",
		  "window_opening_detection_settings.difference_in_temperature": "6802",
		  "window_opening_detection_settings.stop_time": "6803",
		  "temperature_data_source": "6a",
		  "temperature_data_source.source": "6a00",
		  "continuous_high_temp_alarm_settings": "6c",
		  "continuous_high_temp_alarm_settings.enable": "6c00",
		  "continuous_high_temp_alarm_settings.difference": "6c01",
		  "continuous_high_temp_alarm_settings.duration": "6c02",
		  "continuous_low_temp_alarm_settings": "6d",
		  "continuous_low_temp_alarm_settings.enable": "6d00",
		  "continuous_low_temp_alarm_settings.difference": "6d01",
		  "continuous_low_temp_alarm_settings.duration": "6d02",
		  "temperature_alarm_settings": "6e",
		  "temperature_alarm_settings.enable": "6e00",
		  "temperature_alarm_settings.threshold_condition": "6e01",
		  "temperature_alarm_settings.threshold_min": "6e02",
		  "temperature_alarm_settings.threshold_max": "6e03",
		  "system_switch": "6f",
		  "fan_settings": "70",
		  "fan_settings.fan_mode": "7000",
		  "plan_dwell_time_settings": "73",
		  "plan_dwell_time_settings._item": "73xx",
		  "plan_dwell_time_settings._item.permanent_stay_enable": "73xx00",
		  "plan_dwell_time_settings._item.dwell_time": "73xx01",
		  "plan_dwell_time_settings._item.trigger_method": "73xx02",
		  "temperature_control_mode_enable": "75",
		  "indicator_light_disable_settings": "80",
		  "indicator_light_disable_settings.enable": "8000",
		  "indicator_light_disable_settings.time": "8001",
		  "enhanced_infrared_emission_power_enable": "81",
		  "air_power_settings": "82",
		  "air_power_settings.refrigeration_power": "8200",
		  "air_power_settings.heating_power": "8201",
		  "temperature_limit_task_settings": "83",
		  "temperature_limit_task_settings._item": "83xx",
		  "temperature_limit_task_settings._item.enable": "83xx00",
		  "temperature_limit_task_settings._item.task_date_settings": "83xx01",
		  "temperature_limit_task_settings._item.execute_period": "83xx02",
		  "temperature_limit_task_settings._item.cycle_settings": "83xx03",
		  "temperature_limit_task_settings._item.low_threshold": "83xx04",
		  "temperature_limit_task_settings._item.high_threshold": "83xx05",
		  "night_task_settings": "84",
		  "night_task_settings._item": "84xx",
		  "night_task_settings._item.enable": "84xx00",
		  "night_task_settings._item.task_date_settings": "84xx01",
		  "night_task_settings._item.execute_period": "84xx02",
		  "night_task_settings._item.cycle_settings": "84xx03",
		  "night_task_settings._item.breaker_control": "84xx04",
		  "night_task_settings._item.control_command": "84xx05",
		  "night_task_settings._item.execute_condition": "84xx06",
		  "vacation_task_settings": "85",
		  "vacation_task_settings._item": "85xx",
		  "vacation_task_settings._item.enable": "85xx00",
		  "vacation_task_settings._item.task_date_settings": "85xx01",
		  "vacation_task_settings._item.execute_period": "85xx02",
		  "vacation_task_settings._item.cycle_settings": "85xx03",
		  "vacation_task_settings._item.breaker_control": "85xx04",
		  "vacation_task_settings._item.execute_condition": "85xx05",
		  "infrared_learn": "86",
		  "infrared_learn.status": "8600",
		  "infrared_learn.findnext_max": "8601",
		  "infrared_learn.findnext": "8602",
		  "infrared_learn.predefine_brand": "8603",
		  "infrared_learn.package_status": "8604",
		  "internal_sensor_settings": "88",
		  "internal_sensor_settings.name1": "8800",
		  "internal_sensor_settings.name2": "8801",
		  "internal_sensor_settings.name3": "8802",
		  "internal_sensor_settings.collect_period": "8803",
		  "internal_sensor_settings.temperature_calibration_en": "8804",
		  "internal_sensor_settings.temp_calibration": "8805",
		  "internal_sensor_settings.humi_calibration_en": "8806",
		  "internal_sensor_settings.humi_calibration": "8807",
		  "internal_sensor_settings.sensor_type": "8808",
		  "external_sensor_settings": "89",
		  "external_sensor_settings.name1": "8900",
		  "external_sensor_settings.name2": "8901",
		  "external_sensor_settings.name3": "8902",
		  "external_sensor_settings.calibration_en": "8904",
		  "external_sensor_settings.temp_calibration": "8905",
		  "ct_sensor_settings": "8a",
		  "ct_sensor_settings.connected": "8a00",
		  "ct_sensor_settings.collect_period": "8a01",
		  "filter_clean_settings": "8b",
		  "filter_clean_settings.enable": "8b00",
		  "filter_clean_settings.reminder_period": "8b01",
		  "infrared_format_code": "8e",
		  "ble_adv_time_settings": "90",
		  "ble_adv_time_settings.enable": "9000",
		  "ble_adv_time_settings.duration": "9001",
		  "battery_enable": "92",
		  "dormant_settings": "93",
		  "dormant_settings._item": "93xx",
		  "dormant_settings._item.enable": "93xx00",
		  "dormant_settings._item.heating_date_settings": "93xx01",
		  "time_zone": "c7",
		  "daylight_saving_time": "c6",
		  "d2d_slave_enable": "97",
		  "d2d_slave_settings": "98",
		  "d2d_slave_settings._item": "98xx",
		  "reconnect": "b6",
		  "set_time": "b7",
		  "collect_data": "b5",
		  "clear_historical_data": "bd",
		  "stop_historical_data_retrieval": "bc",
		  "retrieve_historical_data_by_time_range": "bb",
		  "reboot": "be",
		  "delete_task_plan": "5f",
		  "insert_temporary_plan": "5c",
		  "filter_clean_alarm": "5b",
		  "open_window_alarm": "5a",
		  "clear_infrared_format_code": "59",
		  "delete_temperature_limit_task": "58",
		  "delete_night_task": "57",
		  "delete_vacation_task": "56",
		  "trigger_infrared_learn": "55"
	};
}
function processTemperature(payload) {
	var allTemperatureProperties = {
    "temperature_alarm.open_window_alarm_deactivation.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.open_window_alarm_trigger.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.over_range_alarm_trigger.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.over_range_alarm_deactivation.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.lower_range_alarm_trigger.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.lower_range_alarm_deactivation.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.within_range_alarm_trigger.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.within_range_alarm_deactivation.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.outside_range_alarm_trigger.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.outside_range_alarm_deactivation.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.persistent_low_temp_deactivation.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.persistent_low_temp_trigger.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.persistent_high_temp_deactivation.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.persistent_high_temp_trigger.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "infrared_cmd_status.target_temp": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "internal_temp": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "external_temp": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "cmd_temp_limit.lower_range_alarm_trigger.low_threshold": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "cmd_temp_limit.lower_range_alarm_trigger.high_threshold": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "cmd_temp_limit.over_range_alarm_trigger.low_threshold": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "cmd_temp_limit.over_range_alarm_trigger.high_threshold": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "local_temp_limit.lower_range_alarm_trigger.low_threshold": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "local_temp_limit.lower_range_alarm_trigger.high_threshold": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "local_temp_limit.over_range_alarm_trigger.low_threshold": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "local_temp_limit.over_range_alarm_trigger.high_threshold": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "target_temperature_settings.heat": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "target_temperature_settings.cool": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "target_temperature_settings.auto": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "target_temperature_tolerance.target_value": {
        "coefficient": 0.01,
        "unitName": "K"
    },
    "schedule_settings._item.target_temp": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "window_opening_detection_settings.difference_in_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "continuous_high_temp_alarm_settings.difference": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "continuous_low_temp_alarm_settings.difference": {
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
    "temperature_limit_task_settings._item.low_threshold": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_limit_task_settings._item.high_threshold": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "internal_sensor_settings.temp_calibration": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "external_sensor_settings.temp_calibration": {
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
                if (hasPath(payload, fahrenheitProperty) && hasPath(payload, celsiusProperty)) {
                    throw new Error(fahrenheitProperty + ' and ' + celsiusProperty + ' cannot be in payload at the same time');
                }
                if (hasPath(payload, fahrenheitProperty)) {
                    setPath(payload, propertyId, Number(((getPath(payload, fahrenheitProperty) - constant) / 1.8).toFixed(precision)));
                } else if (hasPath(payload, celsiusProperty)) {
                    setPath(payload, propertyId, Number(getPath(payload, celsiusProperty).toFixed(precision)));
                }
            }
        }
	}
	return payload;
}