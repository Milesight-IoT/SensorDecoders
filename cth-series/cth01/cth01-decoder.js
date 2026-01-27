/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product CTH01
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
	var error_value_map = {
		current: 0xFFFFFF / 100,
		voltage: 0xFFFF / 100,
		forward_active_energy: 0xFFFFFFFF / 1000,
		reverse_active_energy: 0xFFFFFFFF / 1000,
		forward_reactive_energy: 0xFFFFFFFF / 1000,
		reverse_reactive_energy: 0xFFFFFFFF / 1000,
		apparent_energy: 0xFFFFFFFF / 1000,
		power_factor: 0xFF / 100,
		active_power: -0.001,
		reactive_power: -0.001,
		apparent_power: -0.001,
		thdi: 0xFFFF / 100,
		thdv: 0xFFFF / 100,
		voltage_three_phase_imbalcance: 0xFFFF / 100
	}

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
			case 0xcf:
				decoded.lorawan_configuration_settings = decoded.lorawan_configuration_settings || {};
				var lorawan_configuration_settings_command = readUInt8(bytes, counterObj, 1);
				if (lorawan_configuration_settings_command == 0xd8) {
					// 1：1.0.2, 2：1.0.3, 3：1.0.3, 4：1.0.4
					decoded.lorawan_configuration_settings.version = readUInt8(bytes, counterObj, 1);
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
			case 0xd7:
				decoded.device_info = readOnlyCommand(bytes, counterObj, 72);
				break;
			case 0x01:
				decoded.temperature = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x02:
				decoded.voltage_three_phase_imbalcance = readWithErrorCheck(readUInt16LE(bytes, counterObj, 2) / 100, error_value_map.voltage_three_phase_imbalcance);
				break;
			case 0x03:
				decoded.thdi = [];
				for (var i = 0; i < 12; i++) {
					var thdi_item = {};
					thdi_item.value = readWithErrorCheck(readUInt16LE(bytes, counterObj, 2) / 100, error_value_map.thdi);
					decoded.thdi.push(thdi_item);
				}
				break;
			case 0x04:
				decoded.thdv = [];
				for (var i = 0; i < 3; i++) {
					var thdv_item = {};
					thdv_item.value = readWithErrorCheck(readUInt16LE(bytes, counterObj, 2) / 100, error_value_map.thdv);
					decoded.thdv.push(thdv_item);
				}
				break;
			case 0x05:
				decoded.current = [];
				for (var i = 0; i < 12; i++) {
					var current_item = {};
					current_item.value = readWithErrorCheck(readUInt24LE(bytes, counterObj, 3) / 100, error_value_map.current);
					decoded.current.push(current_item);
				}
				break;
			case 0x06:
				decoded.voltage = [];
				for (var i = 0; i < 3; i++) {
					var voltage_item = {};
					voltage_item.value = readWithErrorCheck(readUInt16LE(bytes, counterObj, 2) / 100, error_value_map.voltage);
					decoded.voltage.push(voltage_item);
				}
				break;
			case 0x07:
				decoded.power_factor = decoded.power_factor || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				decoded.power_factor.mask1 = extractBits(bitOptions, 0, 1);
				decoded.power_factor.mask2 = extractBits(bitOptions, 1, 2);
				decoded.power_factor.mask3 = extractBits(bitOptions, 2, 3);
				decoded.power_factor.mask4 = extractBits(bitOptions, 3, 4);
				if (decoded.power_factor.mask1 == 0x00) {
					decoded.power_factor.group1_value = readWithErrorCheck(readUInt8(bytes, counterObj, 1) / 100, error_value_map.power_factor);
				}
				if (decoded.power_factor.mask1 == 0x01) {
					decoded.power_factor.group1 = decoded.power_factor.group1 || {};
					decoded.power_factor.group1.chan1 = readWithErrorCheck(readUInt8(bytes, counterObj, 1) / 100, error_value_map.power_factor);
					decoded.power_factor.group1.chan2 = readWithErrorCheck(readUInt8(bytes, counterObj, 1) / 100, error_value_map.power_factor);
					decoded.power_factor.group1.chan3 = readWithErrorCheck(readUInt8(bytes, counterObj, 1) / 100, error_value_map.power_factor);
				}
				if (decoded.power_factor.mask2 == 0x00) {
					decoded.power_factor.group2_value = readWithErrorCheck(readUInt8(bytes, counterObj, 1) / 100, error_value_map.power_factor);
				}
				if (decoded.power_factor.mask2 == 0x01) {
					decoded.power_factor.group2 = decoded.power_factor.group2 || {};
					decoded.power_factor.group2.chan1 = readWithErrorCheck(readUInt8(bytes, counterObj, 1) / 100, error_value_map.power_factor);
					decoded.power_factor.group2.chan2 = readWithErrorCheck(readUInt8(bytes, counterObj, 1) / 100, error_value_map.power_factor);
					decoded.power_factor.group2.chan3 = readWithErrorCheck(readUInt8(bytes, counterObj, 1) / 100, error_value_map.power_factor);
				}
				if (decoded.power_factor.mask3 == 0x00) {
					decoded.power_factor.group3_value = readWithErrorCheck(readUInt8(bytes, counterObj, 1) / 100, error_value_map.power_factor);
				}
				if (decoded.power_factor.mask3 == 0x01) {
					decoded.power_factor.group3 = decoded.power_factor.group3 || {};
					decoded.power_factor.group3.chan1 = readWithErrorCheck(readUInt8(bytes, counterObj, 1) / 100, error_value_map.power_factor);
					decoded.power_factor.group3.chan2 = readWithErrorCheck(readUInt8(bytes, counterObj, 1) / 100, error_value_map.power_factor);
					decoded.power_factor.group3.chan3 = readWithErrorCheck(readUInt8(bytes, counterObj, 1) / 100, error_value_map.power_factor);
				}
				if (decoded.power_factor.mask4 == 0x00) {
					decoded.power_factor.group4_value = readWithErrorCheck(readUInt8(bytes, counterObj, 1) / 100, error_value_map.power_factor);
				}
				if (decoded.power_factor.mask4 == 0x01) {
					decoded.power_factor.group4 = decoded.power_factor.group4 || {};
					decoded.power_factor.group4.chan1 = readWithErrorCheck(readUInt8(bytes, counterObj, 1) / 100, error_value_map.power_factor);
					decoded.power_factor.group4.chan2 = readWithErrorCheck(readUInt8(bytes, counterObj, 1) / 100, error_value_map.power_factor);
					decoded.power_factor.group4.chan3 = readWithErrorCheck(readUInt8(bytes, counterObj, 1) / 100, error_value_map.power_factor);
				}
				break;
			case 0x08:
				decoded.active_power1 = decoded.active_power1 || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				decoded.active_power1.mask1 = extractBits(bitOptions, 0, 1);
				decoded.active_power1.mask2 = extractBits(bitOptions, 1, 2);
				if (decoded.active_power1.mask1 == 0x00) {
					decoded.active_power1.group1_value = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.active_power);
				}
				if (decoded.active_power1.mask1 == 0x01) {
					decoded.active_power1.group1 = decoded.active_power1.group1 || {};
					decoded.active_power1.group1.chan1 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.active_power);
					decoded.active_power1.group1.chan2 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.active_power);
					decoded.active_power1.group1.chan3 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.active_power);
				}
				if (decoded.active_power1.mask2 == 0x00) {
					decoded.active_power1.group2_value = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.active_power);
				}
				if (decoded.active_power1.mask2 == 0x01) {
					decoded.active_power1.group2 = decoded.active_power1.group2 || {};
					decoded.active_power1.group2.chan1 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.active_power);
					decoded.active_power1.group2.chan2 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.active_power);
					decoded.active_power1.group2.chan3 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.active_power);
				}
				break;
			case 0x09:
				decoded.active_power2 = decoded.active_power2 || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				decoded.active_power2.mask1 = extractBits(bitOptions, 0, 1);
				decoded.active_power2.mask2 = extractBits(bitOptions, 1, 2);
				if (decoded.active_power2.mask1 == 0x00) {
					decoded.active_power2.group1_value = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.active_power);
				}
				if (decoded.active_power2.mask1 == 0x01) {
					decoded.active_power2.group1 = decoded.active_power2.group1 || {};
					decoded.active_power2.group1.chan1 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.active_power);
					decoded.active_power2.group1.chan2 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.active_power);
					decoded.active_power2.group1.chan3 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.active_power);
				}
				if (decoded.active_power2.mask2 == 0x00) {
					decoded.active_power2.group2_value = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.active_power);
				}
				if (decoded.active_power2.mask2 == 0x01) {
					decoded.active_power2.group2 = decoded.active_power2.group2 || {};
					decoded.active_power2.group2.chan1 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.active_power);
					decoded.active_power2.group2.chan2 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.active_power);
					decoded.active_power2.group2.chan3 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.active_power);
				}
				break;
			case 0x0a:
				decoded.reactive_power1 = decoded.reactive_power1 || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				decoded.reactive_power1.mask1 = extractBits(bitOptions, 0, 1);
				decoded.reactive_power1.mask2 = extractBits(bitOptions, 1, 2);
				if (decoded.reactive_power1.mask1 == 0x00) {
					decoded.reactive_power1.group1_value = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reactive_power);
				}
				if (decoded.reactive_power1.mask1 == 0x01) {
					decoded.reactive_power1.group1 = decoded.reactive_power1.group1 || {};
					decoded.reactive_power1.group1.chan1 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reactive_power);
					decoded.reactive_power1.group1.chan2 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reactive_power);
					decoded.reactive_power1.group1.chan3 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reactive_power);
				}
				if (decoded.reactive_power1.mask2 == 0x00) {
					decoded.reactive_power1.group2_value = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reactive_power);
				}
				if (decoded.reactive_power1.mask2 == 0x01) {
					decoded.reactive_power1.group2 = decoded.reactive_power1.group2 || {};
					decoded.reactive_power1.group2.chan1 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reactive_power);
					decoded.reactive_power1.group2.chan2 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reactive_power);
					decoded.reactive_power1.group2.chan3 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reactive_power);
				}
				break;
			case 0x0b:
				decoded.reactive_power2 = decoded.reactive_power2 || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				decoded.reactive_power2.mask1 = extractBits(bitOptions, 0, 1);
				decoded.reactive_power2.mask2 = extractBits(bitOptions, 1, 2);
				if (decoded.reactive_power2.mask1 == 0x00) {
					decoded.reactive_power2.group1_value = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reactive_power);
				}
				if (decoded.reactive_power2.mask1 == 0x01) {
					decoded.reactive_power2.group1 = decoded.reactive_power2.group1 || {};
					decoded.reactive_power2.group1.chan1 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reactive_power);
					decoded.reactive_power2.group1.chan2 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reactive_power);
					decoded.reactive_power2.group1.chan3 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reactive_power);
				}
				if (decoded.reactive_power2.mask2 == 0x00) {
					decoded.reactive_power2.group2_value = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reactive_power);
				}
				if (decoded.reactive_power2.mask2 == 0x01) {
					decoded.reactive_power2.group2 = decoded.reactive_power2.group2 || {};
					decoded.reactive_power2.group2.chan1 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reactive_power);
					decoded.reactive_power2.group2.chan2 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reactive_power);
					decoded.reactive_power2.group2.chan3 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reactive_power);
				}
				break;
			case 0x0c:
				decoded.apparent_power1 = decoded.apparent_power1 || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				decoded.apparent_power1.mask1 = extractBits(bitOptions, 0, 1);
				decoded.apparent_power1.mask2 = extractBits(bitOptions, 1, 2);
				if (decoded.apparent_power1.mask1 == 0x00) {
					decoded.apparent_power1.group1_value = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_power);
				}
				if (decoded.apparent_power1.mask1 == 0x01) {
					decoded.apparent_power1.group1 = decoded.apparent_power1.group1 || {};
					decoded.apparent_power1.group1.chan1 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_power);
					decoded.apparent_power1.group1.chan2 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_power);
					decoded.apparent_power1.group1.chan3 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_power);
				}
				if (decoded.apparent_power1.mask2 == 0x00) {
					decoded.apparent_power1.group2_value = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_power);
				}
				if (decoded.apparent_power1.mask2 == 0x01) {
					decoded.apparent_power1.group2 = decoded.apparent_power1.group2 || {};
					decoded.apparent_power1.group2.chan1 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_power);
					decoded.apparent_power1.group2.chan2 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_power);
					decoded.apparent_power1.group2.chan3 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_power);
				}
				break;
			case 0x0d:
				decoded.apparent_power2 = decoded.apparent_power2 || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				decoded.apparent_power2.mask1 = extractBits(bitOptions, 0, 1);
				decoded.apparent_power2.mask2 = extractBits(bitOptions, 1, 2);
				if (decoded.apparent_power2.mask1 == 0x00) {
					decoded.apparent_power2.group1_value = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_power);
				}
				if (decoded.apparent_power2.mask1 == 0x01) {
					decoded.apparent_power2.group1 = decoded.apparent_power2.group1 || {};
					decoded.apparent_power2.group1.chan1 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_power);
					decoded.apparent_power2.group1.chan2 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_power);
					decoded.apparent_power2.group1.chan3 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_power);
				}
				if (decoded.apparent_power2.mask2 == 0x00) {
					decoded.apparent_power2.group2_value = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_power);
				}
				if (decoded.apparent_power2.mask2 == 0x01) {
					decoded.apparent_power2.group2 = decoded.apparent_power2.group2 || {};
					decoded.apparent_power2.group2.chan1 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_power);
					decoded.apparent_power2.group2.chan2 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_power);
					decoded.apparent_power2.group2.chan3 = readWithErrorCheck(readInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_power);
				}
				break;
			case 0x0e:
				decoded.forward_active_energy1 = decoded.forward_active_energy1 || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				decoded.forward_active_energy1.mask1 = extractBits(bitOptions, 0, 1);
				decoded.forward_active_energy1.mask2 = extractBits(bitOptions, 1, 2);
				if (decoded.forward_active_energy1.mask1 == 0x00) {
					decoded.forward_active_energy1.group1_value = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_active_energy);
				}
				if (decoded.forward_active_energy1.mask1 == 0x01) {
					decoded.forward_active_energy1.group1 = decoded.forward_active_energy1.group1 || {};
					decoded.forward_active_energy1.group1.chan1 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_active_energy);
					decoded.forward_active_energy1.group1.chan2 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_active_energy);
					decoded.forward_active_energy1.group1.chan3 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_active_energy);
				}
				if (decoded.forward_active_energy1.mask2 == 0x00) {
					decoded.forward_active_energy1.group2_value = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_active_energy);
				}
				if (decoded.forward_active_energy1.mask2 == 0x01) {
					decoded.forward_active_energy1.group2 = decoded.forward_active_energy1.group2 || {};
					decoded.forward_active_energy1.group2.chan1 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_active_energy);
					decoded.forward_active_energy1.group2.chan2 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_active_energy);
					decoded.forward_active_energy1.group2.chan3 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_active_energy);
				}
				break;
			case 0x0f:
				decoded.forward_active_energy2 = decoded.forward_active_energy2 || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				decoded.forward_active_energy2.mask1 = extractBits(bitOptions, 0, 1);
				decoded.forward_active_energy2.mask2 = extractBits(bitOptions, 1, 2);
				if (decoded.forward_active_energy2.mask1 == 0x00) {
					decoded.forward_active_energy2.group1_value = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_active_energy);
				}
				if (decoded.forward_active_energy2.mask1 == 0x01) {
					decoded.forward_active_energy2.group1 = decoded.forward_active_energy2.group1 || {};
					decoded.forward_active_energy2.group1.chan1 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_active_energy);
					decoded.forward_active_energy2.group1.chan2 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_active_energy);
					decoded.forward_active_energy2.group1.chan3 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_active_energy);
				}
				if (decoded.forward_active_energy2.mask2 == 0x00) {
					decoded.forward_active_energy2.group2_value = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_active_energy);
				}
				if (decoded.forward_active_energy2.mask2 == 0x01) {
					decoded.forward_active_energy2.group2 = decoded.forward_active_energy2.group2 || {};
					decoded.forward_active_energy2.group2.chan1 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_active_energy);
					decoded.forward_active_energy2.group2.chan2 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_active_energy);
					decoded.forward_active_energy2.group2.chan3 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_active_energy);
				}
				break;
			case 0x10:
				decoded.reverse_active_energy1 = decoded.reverse_active_energy1 || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				decoded.reverse_active_energy1.mask1 = extractBits(bitOptions, 0, 1);
				decoded.reverse_active_energy1.mask2 = extractBits(bitOptions, 1, 2);
				if (decoded.reverse_active_energy1.mask1 == 0x00) {
					decoded.reverse_active_energy1.group1_value = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_active_energy);
				}
				if (decoded.reverse_active_energy1.mask1 == 0x01) {
					decoded.reverse_active_energy1.group1 = decoded.reverse_active_energy1.group1 || {};
					decoded.reverse_active_energy1.group1.chan1 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_active_energy);
					decoded.reverse_active_energy1.group1.chan2 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_active_energy);
					decoded.reverse_active_energy1.group1.chan3 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_active_energy);
				}
				if (decoded.reverse_active_energy1.mask2 == 0x00) {
					decoded.reverse_active_energy1.group2_value = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_active_energy);
				}
				if (decoded.reverse_active_energy1.mask2 == 0x01) {
					decoded.reverse_active_energy1.group2 = decoded.reverse_active_energy1.group2 || {};
					decoded.reverse_active_energy1.group2.chan1 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_active_energy);
					decoded.reverse_active_energy1.group2.chan2 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_active_energy);
					decoded.reverse_active_energy1.group2.chan3 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_active_energy);
				}
				break;
			case 0x11:
				decoded.reverse_active_energy2 = decoded.reverse_active_energy2 || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				decoded.reverse_active_energy2.mask1 = extractBits(bitOptions, 0, 1);
				decoded.reverse_active_energy2.mask2 = extractBits(bitOptions, 1, 2);
				if (decoded.reverse_active_energy2.mask1 == 0x00) {
					decoded.reverse_active_energy2.group1_value = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_active_energy);
				}
				if (decoded.reverse_active_energy2.mask1 == 0x01) {
					decoded.reverse_active_energy2.group1 = decoded.reverse_active_energy2.group1 || {};
					decoded.reverse_active_energy2.group1.chan1 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_active_energy);
					decoded.reverse_active_energy2.group1.chan2 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_active_energy);
					decoded.reverse_active_energy2.group1.chan3 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_active_energy);
				}
				if (decoded.reverse_active_energy2.mask2 == 0x00) {
					decoded.reverse_active_energy2.group2_value = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_active_energy);
				}
				if (decoded.reverse_active_energy2.mask2 == 0x01) {
					decoded.reverse_active_energy2.group2 = decoded.reverse_active_energy2.group2 || {};
					decoded.reverse_active_energy2.group2.chan1 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_active_energy);
					decoded.reverse_active_energy2.group2.chan2 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_active_energy);
					decoded.reverse_active_energy2.group2.chan3 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_active_energy);
				}
				break;
			case 0x12:
				decoded.forward_reactive_energy1 = decoded.forward_reactive_energy1 || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				decoded.forward_reactive_energy1.mask1 = extractBits(bitOptions, 0, 1);
				decoded.forward_reactive_energy1.mask2 = extractBits(bitOptions, 1, 2);
				if (decoded.forward_reactive_energy1.mask1 == 0x00) {
					decoded.forward_reactive_energy1.group1_value = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_reactive_energy);
				}
				if (decoded.forward_reactive_energy1.mask1 == 0x01) {
					decoded.forward_reactive_energy1.group1 = decoded.forward_reactive_energy1.group1 || {};
					decoded.forward_reactive_energy1.group1.chan1 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_reactive_energy);
					decoded.forward_reactive_energy1.group1.chan2 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_reactive_energy);
					decoded.forward_reactive_energy1.group1.chan3 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_reactive_energy);
				}
				if (decoded.forward_reactive_energy1.mask2 == 0x00) {
					decoded.forward_reactive_energy1.group2_value = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_reactive_energy);
				}
				if (decoded.forward_reactive_energy1.mask2 == 0x01) {
					decoded.forward_reactive_energy1.group2 = decoded.forward_reactive_energy1.group2 || {};
					decoded.forward_reactive_energy1.group2.chan1 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_reactive_energy);
					decoded.forward_reactive_energy1.group2.chan2 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_reactive_energy);
					decoded.forward_reactive_energy1.group2.chan3 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_reactive_energy);
				}
				break;
			case 0x13:
				decoded.forward_reactive_energy2 = decoded.forward_reactive_energy2 || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				decoded.forward_reactive_energy2.mask1 = extractBits(bitOptions, 0, 1);
				decoded.forward_reactive_energy2.mask2 = extractBits(bitOptions, 1, 2);
				if (decoded.forward_reactive_energy2.mask1 == 0x00) {
					decoded.forward_reactive_energy2.group1_value = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_reactive_energy);
				}
				if (decoded.forward_reactive_energy2.mask1 == 0x01) {
					decoded.forward_reactive_energy2.group1 = decoded.forward_reactive_energy2.group1 || {};
					decoded.forward_reactive_energy2.group1.chan1 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_reactive_energy);
					decoded.forward_reactive_energy2.group1.chan2 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_reactive_energy);
					decoded.forward_reactive_energy2.group1.chan3 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_reactive_energy);
				}
				if (decoded.forward_reactive_energy2.mask2 == 0x00) {
					decoded.forward_reactive_energy2.group2_value = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_reactive_energy);
				}
				if (decoded.forward_reactive_energy2.mask2 == 0x01) {
					decoded.forward_reactive_energy2.group2 = decoded.forward_reactive_energy2.group2 || {};
					decoded.forward_reactive_energy2.group2.chan1 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_reactive_energy);
					decoded.forward_reactive_energy2.group2.chan2 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_reactive_energy);
					decoded.forward_reactive_energy2.group2.chan3 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.forward_reactive_energy);
				}
				break;
			case 0x14:
				decoded.reverse_reactive_energy1 = decoded.reverse_reactive_energy1 || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				decoded.reverse_reactive_energy1.mask1 = extractBits(bitOptions, 0, 1);
				decoded.reverse_reactive_energy1.mask2 = extractBits(bitOptions, 1, 2);
				if (decoded.reverse_reactive_energy1.mask1 == 0x00) {
					decoded.reverse_reactive_energy1.group1_value = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_reactive_energy);
				}
				if (decoded.reverse_reactive_energy1.mask1 == 0x01) {
					decoded.reverse_reactive_energy1.group1 = decoded.reverse_reactive_energy1.group1 || {};
					decoded.reverse_reactive_energy1.group1.chan1 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_reactive_energy);
					decoded.reverse_reactive_energy1.group1.chan2 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_reactive_energy);
					decoded.reverse_reactive_energy1.group1.chan3 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_reactive_energy);
				}
				if (decoded.reverse_reactive_energy1.mask2 == 0x00) {
					decoded.reverse_reactive_energy1.group2_value = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_reactive_energy);
				}
				if (decoded.reverse_reactive_energy1.mask2 == 0x01) {
					decoded.reverse_reactive_energy1.group2 = decoded.reverse_reactive_energy1.group2 || {};
					decoded.reverse_reactive_energy1.group2.chan1 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_reactive_energy);
					decoded.reverse_reactive_energy1.group2.chan2 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_reactive_energy);
					decoded.reverse_reactive_energy1.group2.chan3 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_reactive_energy);
				}
				break;
			case 0x15:
				decoded.reverse_reactive_energy2 = decoded.reverse_reactive_energy2 || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				decoded.reverse_reactive_energy2.mask1 = extractBits(bitOptions, 0, 1);
				decoded.reverse_reactive_energy2.mask2 = extractBits(bitOptions, 1, 2);
				if (decoded.reverse_reactive_energy2.mask1 == 0x00) {
					decoded.reverse_reactive_energy2.group1_value = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_reactive_energy);
				}
				if (decoded.reverse_reactive_energy2.mask1 == 0x01) {
					decoded.reverse_reactive_energy2.group1 = decoded.reverse_reactive_energy2.group1 || {};
					decoded.reverse_reactive_energy2.group1.chan1 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_reactive_energy);
					decoded.reverse_reactive_energy2.group1.chan2 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_reactive_energy);
					decoded.reverse_reactive_energy2.group1.chan3 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_reactive_energy);
				}
				if (decoded.reverse_reactive_energy2.mask2 == 0x00) {
					decoded.reverse_reactive_energy2.group2_value = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_reactive_energy);
				}
				if (decoded.reverse_reactive_energy2.mask2 == 0x01) {
					decoded.reverse_reactive_energy2.group2 = decoded.reverse_reactive_energy2.group2 || {};
					decoded.reverse_reactive_energy2.group2.chan1 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_reactive_energy);
					decoded.reverse_reactive_energy2.group2.chan2 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_reactive_energy);
					decoded.reverse_reactive_energy2.group2.chan3 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.reverse_reactive_energy);
				}
				break;
			case 0x16:
				decoded.apparent_energy1 = decoded.apparent_energy1 || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				decoded.apparent_energy1.mask1 = extractBits(bitOptions, 0, 1);
				decoded.apparent_energy1.mask2 = extractBits(bitOptions, 1, 2);
				if (decoded.apparent_energy1.mask1 == 0x00) {
					decoded.apparent_energy1.group1_value = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_energy);
				}
				if (decoded.apparent_energy1.mask1 == 0x01) {
					decoded.apparent_energy1.group1 = decoded.apparent_energy1.group1 || {};
					decoded.apparent_energy1.group1.chan1 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_energy);
					decoded.apparent_energy1.group1.chan2 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_energy);
					decoded.apparent_energy1.group1.chan3 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_energy);
				}
				if (decoded.apparent_energy1.mask2 == 0x00) {
					decoded.apparent_energy1.group2_value = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_energy);
				}
				if (decoded.apparent_energy1.mask2 == 0x01) {
					decoded.apparent_energy1.group2 = decoded.apparent_energy1.group2 || {};
					decoded.apparent_energy1.group2.chan1 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_energy);
					decoded.apparent_energy1.group2.chan2 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_energy);
					decoded.apparent_energy1.group2.chan3 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_energy);
				}
				break;
			case 0x17:
				decoded.apparent_energy2 = decoded.apparent_energy2 || {};
				var bitOptions = readUInt8(bytes, counterObj, 1);
				decoded.apparent_energy2.mask1 = extractBits(bitOptions, 0, 1);
				decoded.apparent_energy2.mask2 = extractBits(bitOptions, 1, 2);
				if (decoded.apparent_energy2.mask1 == 0x00) {
					decoded.apparent_energy2.group1_value = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_energy);
				}
				if (decoded.apparent_energy2.mask1 == 0x01) {
					decoded.apparent_energy2.group1 = decoded.apparent_energy2.group1 || {};
					decoded.apparent_energy2.group1.chan1 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_energy);
					decoded.apparent_energy2.group1.chan2 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_energy);
					decoded.apparent_energy2.group1.chan3 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_energy);
				}
				if (decoded.apparent_energy2.mask2 == 0x00) {
					decoded.apparent_energy2.group2_value = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_energy);
				}
				if (decoded.apparent_energy2.mask2 == 0x01) {
					decoded.apparent_energy2.group2 = decoded.apparent_energy2.group2 || {};
					decoded.apparent_energy2.group2.chan1 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_energy);
					decoded.apparent_energy2.group2.chan2 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_energy);
					decoded.apparent_energy2.group2.chan3 = readWithErrorCheck(readUInt32LE(bytes, counterObj, 4) / 1000, error_value_map.apparent_energy);
				}
				break;
			case 0x40:
				decoded.history_type = decoded.history_type || {};
				// 1:month energy, 2:month min, 3:month max
				decoded.history_type.type = readUInt8(bytes, counterObj, 1);
				break;
			case 0x30:
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
					decoded.temperature_alarm.lower_range_alarm_deactivation.temperature = readWithErrorCheck(readInt16LE(bytes, counterObj, 2) / 100, error_value_map.temperature);
					// decoded.temperature = decoded.temperature_alarm.lower_range_alarm_deactivation.temperature;
				}
				if (decoded.temperature_alarm.type == 0x11) {
					decoded.temperature_alarm.lower_range_alarm_trigger = decoded.temperature_alarm.lower_range_alarm_trigger || {};
					decoded.temperature_alarm.lower_range_alarm_trigger.temperature = readWithErrorCheck(readInt16LE(bytes, counterObj, 2) / 100, error_value_map.temperature);
					// decoded.temperature = decoded.temperature_alarm.lower_range_alarm_trigger.temperature;
				}
				if (decoded.temperature_alarm.type == 0x12) {
					decoded.temperature_alarm.over_range_alarm_deactivation = decoded.temperature_alarm.over_range_alarm_deactivation || {};
					decoded.temperature_alarm.over_range_alarm_deactivation.temperature = readWithErrorCheck(readInt16LE(bytes, counterObj, 2) / 100, error_value_map.temperature);
					// decoded.temperature = decoded.temperature_alarm.over_range_alarm_deactivation.temperature;
				}
				if (decoded.temperature_alarm.type == 0x13) {
					decoded.temperature_alarm.over_range_alarm_trigger = decoded.temperature_alarm.over_range_alarm_trigger || {};
					decoded.temperature_alarm.over_range_alarm_trigger.temperature = readWithErrorCheck(readInt16LE(bytes, counterObj, 2) / 100, error_value_map.temperature);
					// decoded.temperature = decoded.temperature_alarm.over_range_alarm_trigger.temperature;
				}
				if (decoded.temperature_alarm.type == 0x14) {
					decoded.temperature_alarm.within_range_alarm_deactivation = decoded.temperature_alarm.within_range_alarm_deactivation || {};
					decoded.temperature_alarm.within_range_alarm_deactivation.temperature = readWithErrorCheck(readInt16LE(bytes, counterObj, 2) / 100, error_value_map.temperature);
					// decoded.temperature = decoded.temperature_alarm.within_range_alarm_deactivation.temperature;
				}
				if (decoded.temperature_alarm.type == 0x15) {
					decoded.temperature_alarm.within_range_alarm_trigger = decoded.temperature_alarm.within_range_alarm_trigger || {};
					decoded.temperature_alarm.within_range_alarm_trigger.temperature = readWithErrorCheck(readInt16LE(bytes, counterObj, 2) / 100, error_value_map.temperature);
					// decoded.temperature = decoded.temperature_alarm.within_range_alarm_trigger.temperature;
				}
				if (decoded.temperature_alarm.type == 0x16) {
					decoded.temperature_alarm.exceed_range_alarm_deactivation = decoded.temperature_alarm.exceed_range_alarm_deactivation || {};
					decoded.temperature_alarm.exceed_range_alarm_deactivation.temperature = readWithErrorCheck(readInt16LE(bytes, counterObj, 2) / 100, error_value_map.temperature);
					// decoded.temperature = decoded.temperature_alarm.exceed_range_alarm_deactivation.temperature;
				}
				if (decoded.temperature_alarm.type == 0x17) {
					decoded.temperature_alarm.exceed_range_alarm_trigger = decoded.temperature_alarm.exceed_range_alarm_trigger || {};
					decoded.temperature_alarm.exceed_range_alarm_trigger.temperature = readWithErrorCheck(readInt16LE(bytes, counterObj, 2) / 100, error_value_map.temperature);
					// decoded.temperature = decoded.temperature_alarm.exceed_range_alarm_trigger.temperature;
				}
				break;
			case 0x31:
				decoded.current_alarm = decoded.current_alarm || {};
				decoded.current_alarm.channel = readUInt8(bytes, counterObj, 1);
				decoded.current_alarm.info = decoded.current_alarm.info || {};
				decoded.current_alarm.info.type = readUInt8(bytes, counterObj, 1);
				if (decoded.current_alarm.info.type == 0x00) {
					decoded.current_alarm.info.collection_error = decoded.current_alarm.info.collection_error || {};
				}
				if (decoded.current_alarm.info.type == 0x01) {
					decoded.current_alarm.info.lower_range_error = decoded.current_alarm.info.lower_range_error || {};
					decoded.current_alarm.info.lower_range_error.current = readWithErrorCheck(readUInt24LE(bytes, counterObj, 3) / 100, error_value_map.current);
					// decoded.current = decoded.current_alarm.info.lower_range_error.current;
				}
				if (decoded.current_alarm.info.type == 0x02) {
					decoded.current_alarm.info.over_range_error = decoded.current_alarm.info.over_range_error || {};
					decoded.current_alarm.info.over_range_error.current = readWithErrorCheck(readUInt24LE(bytes, counterObj, 3) / 100, error_value_map.current);
					// decoded.current = decoded.current_alarm.info.over_range_error.current;
				}
				if (decoded.current_alarm.info.type == 0x03) {
					decoded.current_alarm.info.no_data = decoded.current_alarm.info.no_data || {};
				}
				if (decoded.current_alarm.info.type == 0x04) {
					decoded.current_alarm.info.over_range_release = decoded.current_alarm.info.over_range_release || {};
					decoded.current_alarm.info.over_range_release.current = readWithErrorCheck(readUInt24LE(bytes, counterObj, 3) / 100, error_value_map.current);
					// decoded.current = decoded.current_alarm.info.over_range_release.current;
				}
				if (decoded.current_alarm.info.type == 0x10) {
					decoded.current_alarm.info.lower_range_alarm_deactivation = decoded.current_alarm.info.lower_range_alarm_deactivation || {};
					decoded.current_alarm.info.lower_range_alarm_deactivation.current = readWithErrorCheck(readUInt24LE(bytes, counterObj, 3) / 100, error_value_map.current);
					// decoded.current = decoded.current_alarm.info.lower_range_alarm_deactivation.current;
				}
				if (decoded.current_alarm.info.type == 0x11) {
					decoded.current_alarm.info.lower_range_alarm_trigger = decoded.current_alarm.info.lower_range_alarm_trigger || {};
					decoded.current_alarm.info.lower_range_alarm_trigger.current = readWithErrorCheck(readUInt24LE(bytes, counterObj, 3) / 100, error_value_map.current);
					// decoded.current = decoded.current_alarm.info.lower_range_alarm_trigger.current;
				}
				if (decoded.current_alarm.info.type == 0x12) {
					decoded.current_alarm.info.over_range_alarm_deactivation = decoded.current_alarm.info.over_range_alarm_deactivation || {};
					decoded.current_alarm.info.over_range_alarm_deactivation.current = readWithErrorCheck(readUInt24LE(bytes, counterObj, 3) / 100, error_value_map.current);
					// decoded.current = decoded.current_alarm.info.over_range_alarm_deactivation.current;
				}
				if (decoded.current_alarm.info.type == 0x13) {
					decoded.current_alarm.info.over_range_alarm_trigger = decoded.current_alarm.info.over_range_alarm_trigger || {};
					decoded.current_alarm.info.over_range_alarm_trigger.current = readWithErrorCheck(readUInt24LE(bytes, counterObj, 3) / 100, error_value_map.current);
					// decoded.current = decoded.current_alarm.info.over_range_alarm_trigger.current;
				}
				if (decoded.current_alarm.info.type == 0x14) {
					decoded.current_alarm.info.within_range_alarm_deactivation = decoded.current_alarm.info.within_range_alarm_deactivation || {};
					decoded.current_alarm.info.within_range_alarm_deactivation.current = readWithErrorCheck(readUInt24LE(bytes, counterObj, 3) / 100, error_value_map.current);
					// decoded.current = decoded.current_alarm.info.within_range_alarm_deactivation.current;
				}
				if (decoded.current_alarm.info.type == 0x15) {
					decoded.current_alarm.info.within_range_alarm_trigger = decoded.current_alarm.info.within_range_alarm_trigger || {};
					decoded.current_alarm.info.within_range_alarm_trigger.current = readWithErrorCheck(readUInt24LE(bytes, counterObj, 3) / 100, error_value_map.current);
					// decoded.current = decoded.current_alarm.info.within_range_alarm_trigger.current;
				}
				if (decoded.current_alarm.info.type == 0x16) {
					decoded.current_alarm.info.exceed_range_alarm_deactivation = decoded.current_alarm.info.exceed_range_alarm_deactivation || {};
					decoded.current_alarm.info.exceed_range_alarm_deactivation.current = readWithErrorCheck(readUInt24LE(bytes, counterObj, 3) / 100, error_value_map.current);
					// decoded.current = decoded.current_alarm.info.exceed_range_alarm_deactivation.current;
				}
				if (decoded.current_alarm.info.type == 0x17) {
					decoded.current_alarm.info.exceed_range_alarm_trigger = decoded.current_alarm.info.exceed_range_alarm_trigger || {};
					decoded.current_alarm.info.exceed_range_alarm_trigger.current = readWithErrorCheck(readUInt24LE(bytes, counterObj, 3) / 100, error_value_map.current);
					// decoded.current = decoded.current_alarm.info.exceed_range_alarm_trigger.current;
				}
				break;
			case 0x32:
				decoded.voltage_alarm = decoded.voltage_alarm || {};
				decoded.voltage_alarm.channel = readUInt8(bytes, counterObj, 1);
				decoded.voltage_alarm.info = decoded.voltage_alarm.info || {};
				decoded.voltage_alarm.info.type = readUInt8(bytes, counterObj, 1);
				if (decoded.voltage_alarm.info.type == 0x00) {
					decoded.voltage_alarm.info.collection_error = decoded.voltage_alarm.info.collection_error || {};
				}
				if (decoded.voltage_alarm.info.type == 0x01) {
					decoded.voltage_alarm.info.lower_range_error = decoded.voltage_alarm.info.lower_range_error || {};
					decoded.voltage_alarm.info.lower_range_error.voltage = readWithErrorCheck(readUInt16LE(bytes, counterObj, 2) / 100, error_value_map.voltage);
					// decoded.voltage = decoded.voltage_alarm.info.lower_range_error.voltage;
				}
				if (decoded.voltage_alarm.info.type == 0x02) {
					decoded.voltage_alarm.info.over_range_error = decoded.voltage_alarm.info.over_range_error || {};
					decoded.voltage_alarm.info.over_range_error.voltage = readWithErrorCheck(readUInt16LE(bytes, counterObj, 2) / 100, error_value_map.voltage);
					// decoded.voltage = decoded.voltage_alarm.info.over_range_error.voltage;
				}
				if (decoded.voltage_alarm.info.type == 0x03) {
					decoded.voltage_alarm.info.no_data = decoded.voltage_alarm.info.no_data || {};
				}
				if (decoded.voltage_alarm.info.type == 0x04) {
					decoded.voltage_alarm.info.over_range_release = decoded.voltage_alarm.info.over_range_release || {};
					decoded.voltage_alarm.info.over_range_release.voltage = readWithErrorCheck(readUInt16LE(bytes, counterObj, 2) / 100, error_value_map.voltage);
					// decoded.voltage = decoded.voltage_alarm.info.over_range_release.voltage;
				}
				if (decoded.voltage_alarm.info.type == 0x10) {
					decoded.voltage_alarm.info.lower_range_alarm_deactivation = decoded.voltage_alarm.info.lower_range_alarm_deactivation || {};
					decoded.voltage_alarm.info.lower_range_alarm_deactivation.voltage = readWithErrorCheck(readUInt16LE(bytes, counterObj, 2) / 100, error_value_map.voltage);
					// decoded.voltage = decoded.voltage_alarm.info.lower_range_alarm_deactivation.voltage;
				}
				if (decoded.voltage_alarm.info.type == 0x11) {
					decoded.voltage_alarm.info.lower_range_alarm_trigger = decoded.voltage_alarm.info.lower_range_alarm_trigger || {};
					decoded.voltage_alarm.info.lower_range_alarm_trigger.voltage = readWithErrorCheck(readUInt16LE(bytes, counterObj, 2) / 100, error_value_map.voltage);
					// decoded.voltage = decoded.voltage_alarm.info.lower_range_alarm_trigger.voltage;
				}
				if (decoded.voltage_alarm.info.type == 0x12) {
					decoded.voltage_alarm.info.over_range_alarm_deactivation = decoded.voltage_alarm.info.over_range_alarm_deactivation || {};
					decoded.voltage_alarm.info.over_range_alarm_deactivation.voltage = readWithErrorCheck(readUInt16LE(bytes, counterObj, 2) / 100, error_value_map.voltage);
					// decoded.voltage = decoded.voltage_alarm.info.over_range_alarm_deactivation.voltage;
				}
				if (decoded.voltage_alarm.info.type == 0x13) {
					decoded.voltage_alarm.info.over_range_alarm_trigger = decoded.voltage_alarm.info.over_range_alarm_trigger || {};
					decoded.voltage_alarm.info.over_range_alarm_trigger.voltage = readWithErrorCheck(readUInt16LE(bytes, counterObj, 2) / 100, error_value_map.voltage);
					// decoded.voltage = decoded.voltage_alarm.info.over_range_alarm_trigger.voltage;
				}
				if (decoded.voltage_alarm.info.type == 0x14) {
					decoded.voltage_alarm.info.within_range_alarm_deactivation = decoded.voltage_alarm.info.within_range_alarm_deactivation || {};
					decoded.voltage_alarm.info.within_range_alarm_deactivation.voltage = readWithErrorCheck(readUInt16LE(bytes, counterObj, 2) / 100, error_value_map.voltage);
					// decoded.voltage = decoded.voltage_alarm.info.within_range_alarm_deactivation.voltage;
				}
				if (decoded.voltage_alarm.info.type == 0x15) {
					decoded.voltage_alarm.info.within_range_alarm_trigger = decoded.voltage_alarm.info.within_range_alarm_trigger || {};
					decoded.voltage_alarm.info.within_range_alarm_trigger.voltage = readWithErrorCheck(readUInt16LE(bytes, counterObj, 2) / 100, error_value_map.voltage);
					// decoded.voltage = decoded.voltage_alarm.info.within_range_alarm_trigger.voltage;
				}
				if (decoded.voltage_alarm.info.type == 0x16) {
					decoded.voltage_alarm.info.exceed_range_alarm_deactivation = decoded.voltage_alarm.info.exceed_range_alarm_deactivation || {};
					decoded.voltage_alarm.info.exceed_range_alarm_deactivation.voltage = readWithErrorCheck(readUInt16LE(bytes, counterObj, 2) / 100, error_value_map.voltage);
					// decoded.voltage = decoded.voltage_alarm.info.exceed_range_alarm_deactivation.voltage;
				}
				if (decoded.voltage_alarm.info.type == 0x17) {
					decoded.voltage_alarm.info.exceed_range_alarm_trigger = decoded.voltage_alarm.info.exceed_range_alarm_trigger || {};
					decoded.voltage_alarm.info.exceed_range_alarm_trigger.voltage = readWithErrorCheck(readUInt16LE(bytes, counterObj, 2) / 100, error_value_map.voltage);
					// decoded.voltage = decoded.voltage_alarm.info.exceed_range_alarm_trigger.voltage;
				}
				break;
			case 0x33:
				decoded.thdi_alarm = decoded.thdi_alarm || {};
				decoded.thdi_alarm.channel = readUInt8(bytes, counterObj, 1);
				decoded.thdi_alarm.info = decoded.thdi_alarm.info || {};
				decoded.thdi_alarm.info.type = readUInt8(bytes, counterObj, 1);
				if (decoded.thdi_alarm.info.type == 0x00) {
					decoded.thdi_alarm.info.collection_error = decoded.thdi_alarm.info.collection_error || {};
				}
				if (decoded.thdi_alarm.info.type == 0x12) {
					decoded.thdi_alarm.info.over_range_alarm_deactivation = decoded.thdi_alarm.info.over_range_alarm_deactivation || {};
					decoded.thdi_alarm.info.over_range_alarm_deactivation.thdi = readWithErrorCheck(readUInt16LE(bytes, counterObj, 2) / 100, error_value_map.thdi);
					// decoded.thdi = decoded.thdi_alarm.info.over_range_alarm_deactivation.thdi;
				}
				if (decoded.thdi_alarm.info.type == 0x13) {
					decoded.thdi_alarm.info.over_range_alarm_trigger = decoded.thdi_alarm.info.over_range_alarm_trigger || {};
					decoded.thdi_alarm.info.over_range_alarm_trigger.thdi = readWithErrorCheck(readUInt16LE(bytes, counterObj, 2) / 100, error_value_map.thdi);
					// decoded.thdi = decoded.thdi_alarm.info.over_range_alarm_trigger.thdi;
				}
				break;
			case 0x34:
				decoded.thdv_alarm = decoded.thdv_alarm || {};
				decoded.thdv_alarm.channel = readUInt8(bytes, counterObj, 1);
				decoded.thdv_alarm.info = decoded.thdv_alarm.info || {};
				decoded.thdv_alarm.info.type = readUInt8(bytes, counterObj, 1);
				if (decoded.thdv_alarm.info.type == 0x00) {
					decoded.thdv_alarm.info.collection_error = decoded.thdv_alarm.info.collection_error || {};
				}
				if (decoded.thdv_alarm.info.type == 0x12) {
					decoded.thdv_alarm.info.over_range_alarm_deactivation = decoded.thdv_alarm.info.over_range_alarm_deactivation || {};
					decoded.thdv_alarm.info.over_range_alarm_deactivation.thdv = readWithErrorCheck(readUInt16LE(bytes, counterObj, 2) / 100, error_value_map.thdv);
					// decoded.thdv = decoded.thdv_alarm.info.over_range_alarm_deactivation.thdv;
				}
				if (decoded.thdv_alarm.info.type == 0x13) {
					decoded.thdv_alarm.info.over_range_alarm_trigger = decoded.thdv_alarm.info.over_range_alarm_trigger || {};
					decoded.thdv_alarm.info.over_range_alarm_trigger.thdv = readWithErrorCheck(readUInt16LE(bytes, counterObj, 2) / 100, error_value_map.thdv);
					// decoded.thdv = decoded.thdv_alarm.info.over_range_alarm_trigger.thdv;
				}
				break;
			case 0x35:
				decoded.voltage_unbalance_alarm = decoded.voltage_unbalance_alarm || {};
				decoded.voltage_unbalance_alarm.type = readUInt8(bytes, counterObj, 1);
				if (decoded.voltage_unbalance_alarm.type == 0x00) {
					decoded.voltage_unbalance_alarm.collection_error = decoded.voltage_unbalance_alarm.collection_error || {};
				}
				if (decoded.voltage_unbalance_alarm.type == 0x12) {
					decoded.voltage_unbalance_alarm.over_range_alarm_deactivation = decoded.voltage_unbalance_alarm.over_range_alarm_deactivation || {};
					decoded.voltage_unbalance_alarm.over_range_alarm_deactivation.voltage_unbalance = readWithErrorCheck(readUInt16LE(bytes, counterObj, 2) / 100, error_value_map.voltage_unbalance);
					// decoded.voltage_three_phase_imbalcance = decoded.voltage_unbalance_alarm.over_range_alarm_deactivation.voltage_unbalance;
				}
				if (decoded.voltage_unbalance_alarm.type == 0x13) {
					decoded.voltage_unbalance_alarm.over_range_alarm_trigger = decoded.voltage_unbalance_alarm.over_range_alarm_trigger || {};
					decoded.voltage_unbalance_alarm.over_range_alarm_trigger.voltage_unbalance = readWithErrorCheck(readUInt16LE(bytes, counterObj, 2) / 100, error_value_map.voltage_unbalance);
					// decoded.voltage_three_phase_imbalcance = decoded.voltage_unbalance_alarm.over_range_alarm_trigger.voltage_unbalance;
				}
				break;
			case 0x36:
				decoded.power_loss_alarm = readOnlyCommand(bytes, counterObj, 0);
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
			case 0x61:
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
			case 0xc8:
				// 0：Power Off, 1：Power On
				decoded.device_status = readUInt8(bytes, counterObj, 1);
				break;
			case 0x63:
				// 0：℃, 1：℉
				decoded.temperature_unit = readUInt8(bytes, counterObj, 1);
				break;
			case 0x64:
				decoded.bluetooth_name = decoded.bluetooth_name || {};
				decoded.bluetooth_name.length = readUInt8(bytes, counterObj, 1);
				decoded.bluetooth_name.content = readString(bytes, counterObj, decoded.bluetooth_name.length);
				break;
			case 0x65:
				// 0:disable, 1:enable
				decoded.ble_enable = readUInt8(bytes, counterObj, 1);
				// 0:disable, 1:enable
				decoded.ble_enable = readUInt8(bytes, counterObj, 1);
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
			case 0x66:
				// 0：four_wire, 1：three_wire
				decoded.voltage_interface = readUInt8(bytes, counterObj, 1);
				break;
			case 0x67:
				decoded.current_interface1 = decoded.current_interface1 || {};
				// 0：one_phase, 1：three_phase
				decoded.current_interface1.type = readUInt8(bytes, counterObj, 1);
				decoded.current_interface1.config = [];
				for (var i = 0; i < 3; i++) {
					var config_item = {};
					// 0：forward, 1：reserse
					config_item.direction = readUInt8(bytes, counterObj, 1);
					config_item.range = readUInt16LE(bytes, counterObj, 2);
					decoded.current_interface1.config.push(config_item);
				}
				break;
			case 0x68:
				decoded.current_interface2 = decoded.current_interface2 || {};
				// 0：one_phase, 1：three_phase
				decoded.current_interface2.type = readUInt8(bytes, counterObj, 1);
				decoded.current_interface2.config = [];
				for (var i = 0; i < 3; i++) {
					var config_item = {};
					// 0：forward, 1：reserse
					config_item.direction = readUInt8(bytes, counterObj, 1);
					config_item.range = readUInt16LE(bytes, counterObj, 2);
					decoded.current_interface2.config.push(config_item);
				}
				break;
			case 0x69:
				decoded.current_interface3 = decoded.current_interface3 || {};
				// 0：one_phase, 1：three_phase
				decoded.current_interface3.type = readUInt8(bytes, counterObj, 1);
				decoded.current_interface3.config = [];
				for (var i = 0; i < 3; i++) {
					var config_item = {};
					// 0：forward, 1：reserse
					config_item.direction = readUInt8(bytes, counterObj, 1);
					config_item.range = readUInt16LE(bytes, counterObj, 2);
					decoded.current_interface3.config.push(config_item);
				}
				break;
			case 0x6a:
				decoded.current_interface4 = decoded.current_interface4 || {};
				// 0：one_phase, 1：three_phase
				decoded.current_interface4.type = readUInt8(bytes, counterObj, 1);
				decoded.current_interface4.config = [];
				for (var i = 0; i < 3; i++) {
					var config_item = {};
					// 0：forward, 1：reserse
					config_item.direction = readUInt8(bytes, counterObj, 1);
					config_item.range = readUInt16LE(bytes, counterObj, 2);
					decoded.current_interface4.config.push(config_item);
				}
				break;
			case 0x6b:
				decoded.temperature_calibration_settings = decoded.temperature_calibration_settings || {};
				// 0：disable, 1：enable
				decoded.temperature_calibration_settings.enable = readUInt8(bytes, counterObj, 1);
				decoded.temperature_calibration_settings.calibration_value = readInt16LE(bytes, counterObj, 2) / 100;
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
				decoded.temperature_alarm_settings = decoded.temperature_alarm_settings || {};
				// 0：disable, 1：enable
				decoded.temperature_alarm_settings.enable = readUInt8(bytes, counterObj, 1);
				// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A≤x≤B, 4:condition: x<A or x>B
				decoded.temperature_alarm_settings.threshold_condition = readUInt8(bytes, counterObj, 1);
				decoded.temperature_alarm_settings.threshold_min = readInt16LE(bytes, counterObj, 2) / 100;
				decoded.temperature_alarm_settings.threshold_max = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x77:
				decoded.current_alarm_settings = decoded.current_alarm_settings || [];
				var channel = readUInt8(bytes, counterObj, 1);
				var current_alarm_settings_item = pickArrayItem(decoded.current_alarm_settings, channel, 'channel');
				current_alarm_settings_item.channel = channel;
				insertArrayItem(decoded.current_alarm_settings, current_alarm_settings_item, 'channel');
				// 0：disable, 1：enable
				current_alarm_settings_item.enable = readUInt8(bytes, counterObj, 1);
				// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A≤x≤B, 4:condition: x<A or x>B
				current_alarm_settings_item.threshold_condition = readUInt8(bytes, counterObj, 1);
				current_alarm_settings_item.threshold_min = readInt16LE(bytes, counterObj, 2);
				current_alarm_settings_item.threshold_max = readInt16LE(bytes, counterObj, 2);
				break;
			case 0x78:
				decoded.voltage_alarm_settings = decoded.voltage_alarm_settings || [];
				var channel = readUInt8(bytes, counterObj, 1);
				var voltage_alarm_settings_item = pickArrayItem(decoded.voltage_alarm_settings, channel, 'channel');
				voltage_alarm_settings_item.channel = channel;
				insertArrayItem(decoded.voltage_alarm_settings, voltage_alarm_settings_item, 'channel');
				// 0：disable, 1：enable
				voltage_alarm_settings_item.enable = readUInt8(bytes, counterObj, 1);
				// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A≤x≤B, 4:condition: x<A or x>B
				voltage_alarm_settings_item.threshold_condition = readUInt8(bytes, counterObj, 1);
				voltage_alarm_settings_item.threshold_min = readInt16LE(bytes, counterObj, 2);
				voltage_alarm_settings_item.threshold_max = readInt16LE(bytes, counterObj, 2);
				break;
			case 0x79:
				decoded.thdi_alarm_settings = decoded.thdi_alarm_settings || [];
				var channel = readUInt8(bytes, counterObj, 1);
				var thdi_alarm_settings_item = pickArrayItem(decoded.thdi_alarm_settings, channel, 'channel');
				thdi_alarm_settings_item.channel = channel;
				insertArrayItem(decoded.thdi_alarm_settings, thdi_alarm_settings_item, 'channel');
				// 0：disable, 1：enable
				thdi_alarm_settings_item.enable = readUInt8(bytes, counterObj, 1);
				// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A≤x≤B, 4:condition: x<A or x>B
				thdi_alarm_settings_item.threshold_condition = readUInt8(bytes, counterObj, 1);
				thdi_alarm_settings_item.threshold_min = readInt16LE(bytes, counterObj, 2);
				thdi_alarm_settings_item.threshold_max = readInt16LE(bytes, counterObj, 2);
				break;
			case 0x7a:
				decoded.thdv_alarm_settings = decoded.thdv_alarm_settings || [];
				var channel = readUInt8(bytes, counterObj, 1);
				var thdv_alarm_settings_item = pickArrayItem(decoded.thdv_alarm_settings, channel, 'channel');
				thdv_alarm_settings_item.channel = channel;
				insertArrayItem(decoded.thdv_alarm_settings, thdv_alarm_settings_item, 'channel');
				// 0：disable, 1：enable
				thdv_alarm_settings_item.enable = readUInt8(bytes, counterObj, 1);
				// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A≤x≤B, 4:condition: x<A or x>B
				thdv_alarm_settings_item.threshold_condition = readUInt8(bytes, counterObj, 1);
				thdv_alarm_settings_item.threshold_min = readInt16LE(bytes, counterObj, 2);
				thdv_alarm_settings_item.threshold_max = readInt16LE(bytes, counterObj, 2);
				break;
			case 0x7b:
				decoded.voltage_unbalance_alarm_settings = decoded.voltage_unbalance_alarm_settings || {};
				// 0：disable, 1：enable
				decoded.voltage_unbalance_alarm_settings.enable = readUInt8(bytes, counterObj, 1);
				// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A≤x≤B, 4:condition: x<A or x>B
				decoded.voltage_unbalance_alarm_settings.threshold_condition = readUInt8(bytes, counterObj, 1);
				decoded.voltage_unbalance_alarm_settings.threshold_min = readInt16LE(bytes, counterObj, 2);
				decoded.voltage_unbalance_alarm_settings.threshold_max = readInt16LE(bytes, counterObj, 2);
				break;
			case 0x7c:
				decoded.alarm_global_settings = decoded.alarm_global_settings || {};
				decoded.alarm_global_settings.interval = readUInt16LE(bytes, counterObj, 2);
				decoded.alarm_global_settings.times = readUInt16LE(bytes, counterObj, 2);
				// 0：disable, 1：enable
				decoded.alarm_global_settings.release_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x6d:
				decoded.month_statistics_settings = decoded.month_statistics_settings || {};
				decoded.month_statistics_settings.day = readUInt8(bytes, counterObj, 1);
				decoded.month_statistics_settings.hour = readUInt8(bytes, counterObj, 1);
				decoded.month_statistics_settings.minute = readUInt8(bytes, counterObj, 1);
				break;
			case 0x6c:
				decoded.report_enable = decoded.report_enable || {};
				var bitOptions = readUInt16LE(bytes, counterObj, 2);
				decoded.report_enable.temperature = extractBits(bitOptions, 0, 1);
				decoded.report_enable.current = extractBits(bitOptions, 1, 2);
				decoded.report_enable.voltage = extractBits(bitOptions, 2, 3);
				decoded.report_enable.power_factor = extractBits(bitOptions, 3, 4);
				decoded.report_enable.active_power = extractBits(bitOptions, 4, 5);
				decoded.report_enable.reactive_power = extractBits(bitOptions, 5, 6);
				decoded.report_enable.apparent_power = extractBits(bitOptions, 6, 7);
				decoded.report_enable.forward_active_energy = extractBits(bitOptions, 7, 8);
				decoded.report_enable.reverse_active_energy = extractBits(bitOptions, 8, 9);
				decoded.report_enable.forward_reactive_energy = extractBits(bitOptions, 9, 10);
				decoded.report_enable.reverse_reactive_energy = extractBits(bitOptions, 10, 11);
				decoded.report_enable.apparent_energy = extractBits(bitOptions, 11, 12);
				decoded.report_enable.thdi = extractBits(bitOptions, 12, 13);
				decoded.report_enable.thdv = extractBits(bitOptions, 13, 14);
				decoded.report_enable.voltage_unbalance = extractBits(bitOptions, 14, 15);
				break;
			case 0xbf:
				decoded.reset = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0xbe:
				decoded.reboot = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0x5d:
				decoded.stop_historical_data_retrieval = decoded.stop_historical_data_retrieval || {};
				// 0：alarm data, 1：period data, 2：month energy data, 3：month min_max data
				decoded.stop_historical_data_retrieval.type = readUInt8(bytes, counterObj, 1);
				break;
			case 0x5b:
				decoded.retrieve_historical_data_by_time = decoded.retrieve_historical_data_by_time || {};
				// 0：alarm data, 1：period data, 2：month energy data, 3：month min_max data
				decoded.retrieve_historical_data_by_time.type = readUInt8(bytes, counterObj, 1);
				decoded.retrieve_historical_data_by_time.time = readUInt32LE(bytes, counterObj, 4);
				break;
			case 0x5c:
				decoded.retrieve_historical_data_by_time_range = decoded.retrieve_historical_data_by_time_range || {};
				// 0：alarm data, 1：period data, 2：month energy data, 3：month min_max data
				decoded.retrieve_historical_data_by_time_range.type = readUInt8(bytes, counterObj, 1);
				decoded.retrieve_historical_data_by_time_range.start_time = readUInt32LE(bytes, counterObj, 4);
				decoded.retrieve_historical_data_by_time_range.end_time = readUInt32LE(bytes, counterObj, 4);
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
			case 0xb6:
				decoded.reconnect = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0x5f:
				decoded.reset_energy = decoded.reset_energy || {};
				decoded.reset_energy.channel = readUInt8(bytes, counterObj, 1);
				break;
			case 0x5e:
				decoded.clear_data = decoded.clear_data || {};
				// 0：alarm data, 1：period data, 2：month energy data, 3：month min_max data
				decoded.clear_data.type = readUInt8(bytes, counterObj, 1);
				break;
			case 0x57:
				decoded.query_history_set = readOnlyCommand(bytes, counterObj, 0);
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

function readWithErrorCheck(value, errorValue) {
	if (value == errorValue) {
		return 'error';
	}
	return value;
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
		  "10": "reverse_active_energy1",
		  "11": "reverse_active_energy2",
		  "12": "forward_reactive_energy1",
		  "13": "forward_reactive_energy2",
		  "14": "reverse_reactive_energy1",
		  "15": "reverse_reactive_energy2",
		  "16": "apparent_energy1",
		  "17": "apparent_energy2",
		  "30": "temperature_alarm",
		  "31": "current_alarm",
		  "32": "voltage_alarm",
		  "33": "thdi_alarm",
		  "34": "thdv_alarm",
		  "35": "voltage_unbalance_alarm",
		  "36": "power_loss_alarm",
		  "40": "history_type",
		  "57": "query_history_set",
		  "60": "collection_interval",
		  "61": "reporting_interval",
		  "63": "temperature_unit",
		  "64": "bluetooth_name",
		  "65": "ble_enable",
		  "66": "voltage_interface",
		  "67": "current_interface1",
		  "68": "current_interface2",
		  "69": "current_interface3",
		  "76": "temperature_alarm_settings",
		  "77": "current_alarm_settings",
		  "78": "voltage_alarm_settings",
		  "79": "thdi_alarm_settings",
		  "ff": "request_check_sequence_number",
		  "fe": "request_check_order",
		  "ef": "request_command_queries",
		  "ee": "request_query_all_configurations",
		  "ed": "historical_data_report",
		  "cf": "lorawan_configuration_settings",
		  "cfd8": "lorawan_configuration_settings.version",
		  "df": "tsl_version",
		  "de": "product_name",
		  "dd": "product_pn",
		  "db": "product_sn",
		  "da": "version",
		  "d9": "oem_id",
		  "d8": "product_frequency_band",
		  "d7": "device_info",
		  "01": "temperature",
		  "02": "voltage_three_phase_imbalcance",
		  "03": "thdi",
		  "03xx": "thdi._item",
		  "04": "thdv",
		  "04xx": "thdv._item",
		  "05": "current",
		  "05xx": "current._item",
		  "06": "voltage",
		  "06xx": "voltage._item",
		  "07": "power_factor",
		  "08": "active_power1",
		  "09": "active_power2",
		  "0a": "reactive_power1",
		  "0b": "reactive_power2",
		  "0c": "apparent_power1",
		  "0d": "apparent_power2",
		  "0e": "forward_active_energy1",
		  "0f": "forward_active_energy2",
		  "c8": "device_status",
		  "c5": "data_storage_settings",
		  "c500": "data_storage_settings.enable",
		  "c501": "data_storage_settings.retransmission_enable",
		  "c502": "data_storage_settings.retransmission_interval",
		  "c503": "data_storage_settings.retrieval_interval",
		  "undefinedxx": "current_interface4.config._item",
		  "6a": "current_interface4",
		  "6b": "temperature_calibration_settings",
		  "c7": "time_zone",
		  "c6": "daylight_saving_time",
		  "77xx": "current_alarm_settings._item",
		  "78xx": "voltage_alarm_settings._item",
		  "79xx": "thdi_alarm_settings._item",
		  "7a": "thdv_alarm_settings",
		  "7axx": "thdv_alarm_settings._item",
		  "7b": "voltage_unbalance_alarm_settings",
		  "7c": "alarm_global_settings",
		  "6d": "month_statistics_settings",
		  "6c": "report_enable",
		  "bf": "reset",
		  "be": "reboot",
		  "5d": "stop_historical_data_retrieval",
		  "5b": "retrieve_historical_data_by_time",
		  "5c": "retrieve_historical_data_by_time_range",
		  "b9": "query_device_status",
		  "b8": "synchronize_time",
		  "b7": "set_time",
		  "b6": "reconnect",
		  "5f": "reset_energy",
		  "5e": "clear_data"
	};
}