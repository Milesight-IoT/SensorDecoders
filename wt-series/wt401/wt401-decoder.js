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
			case 0x8d:
				// 0：BLE, 1：LoRa, 2：BLE+LoRa
				decoded.communication_mode = readUInt8(bytes, counterObj, 1);
				break;
			case 0x61:
				decoded.reporting_interval = decoded.reporting_interval || {};
				if (undefined == 0x00) {
					decoded.reporting_interval.ble = decoded.reporting_interval.ble || {};
					// 0：second, 1：min
					decoded.reporting_interval.ble.unit = readUInt8(bytes, counterObj, 1);
					if (decoded.reporting_interval.ble.unit == 0x01) {
						decoded.reporting_interval.ble.minutes_of_time = readUInt16LE(bytes, counterObj, 2);
					}
				}
				if (undefined == 0x02) {
					decoded.reporting_interval.ble_lora = decoded.reporting_interval.ble_lora || {};
					// 0：second, 1：min
					decoded.reporting_interval.ble_lora.unit = readUInt8(bytes, counterObj, 1);
					if (decoded.reporting_interval.ble_lora.unit == 0x01) {
						decoded.reporting_interval.ble_lora.minutes_of_time = readUInt16LE(bytes, counterObj, 2);
					}
				}
				break;
			case 0x60:
				decoded.collection_interval = decoded.collection_interval || {};
				// 0：second, 1：min
				decoded.collection_interval.unit = readUInt8(bytes, counterObj, 1);
				if (decoded.collection_interval.unit == 0x01) {
					decoded.collection_interval.minutes_of_time = readUInt16LE(bytes, counterObj, 2);
				}
				break;
			case 0x63:
				// 0：℃, 1：℉
				decoded.temperature_unit = readUInt8(bytes, counterObj, 1);
				break;
			case 0x7d:
				// 0:Embedded Data, 1:Lora Data, 2: UCController
				decoded.data_sync_to_peer = readUInt8(bytes, counterObj, 1);
				break;
			case 0x7e:
				decoded.data_sync_timeout = readUInt8(bytes, counterObj, 1);
				break;
			case 0x67:
				// 0：Off, 1：On
				decoded.system_status = readUInt8(bytes, counterObj, 1);
				break;
			case 0x64:
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0：disable, 1：enable
				heat = extractBits(bitOptions, 0, 1);
				// 0：disable, 1：enable
				em_heat = extractBits(bitOptions, 1, 2);
				// 0：disable, 1：enable
				cool = extractBits(bitOptions, 2, 3);
				// 0：disable, 1：enable
				auto = extractBits(bitOptions, 3, 4);
				// 0：disable, 1：enable
				dehumidity = extractBits(bitOptions, 4, 5);
				// 0：disable, 1：enable
				ventilation = extractBits(bitOptions, 5, 6);
				if (heat && em_heat && cool && auto && !dehumidity && !ventilation) {
					decoded.mode_enable = 1;
				} else if (heat && !em_heat && cool && auto && !dehumidity && !ventilation) {
					decoded.mode_enable = 2;
				} else if (heat && !em_heat && !cool && !auto && !dehumidity && !ventilation) {
					decoded.mode_enable = 3;
				} else if (!heat && !em_heat && cool && !auto && !dehumidity && !ventilation) {
					decoded.mode_enable = 4;
				} else if (heat && !em_heat && cool && !auto && !dehumidity && !ventilation) {
					decoded.mode_enable = 5;
				} else if (heat && em_heat && cool && auto && dehumidity && ventilation) {
					decoded.mode_enable = 6;
				} else {
					decoded.mode_enable = 256;
				}
				break;
			case 0x88:
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0：disable, 1：enable
				var auto = extractBits(bitOptions, 0, 1);
				// 0：disable, 1：enable
				var circulation = extractBits(bitOptions, 1, 2);
				// 0：disable, 1：enable
				var on = extractBits(bitOptions, 2, 3);
				// 0：disable, 1：enable
				var low = extractBits(bitOptions, 3, 4);
				// 0：disable, 1：enable
				var medium = extractBits(bitOptions, 4, 5);
				// 0：disable, 1：enable
				var high = extractBits(bitOptions, 5, 6);
				if (auto && circulation && on && low && medium && high) {
					decoded.fan_enable = 1;
				} else if (auto && on && low && medium && high) {
					decoded.fan_enable = 2;
				} else if (circulation && on && low && medium && high) {
					decoded.fan_enable = 3;
				} else if (auto && circulation) {
					decoded.fan_enable = 4;
				} else if (on && low && medium && high) {
					decoded.fan_enable = 5;
				} else {
					decoded.fan_enable = 256;
				}
				break;
			case 0x68:
				decoded.temperature_control_mode = decoded.temperature_control_mode || {};
				var temperature_control_mode_subcmd = readUInt8(bytes, counterObj, 1);
				if (temperature_control_mode_subcmd == 0x00) {
					// 0：heat, 1：em heat, 2：cool, 3：auto, 4：dehumidify, 5：ventilation
					decoded.temperature_control_mode.mode = readUInt8(bytes, counterObj, 1);
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
				if (target_temperature_settings_temperature_control_mode == 0x02) {
					decoded.target_temperature_settings.cool = readInt16LE(bytes, counterObj, 2) / 100;
				}
				if (target_temperature_settings_temperature_control_mode == 0x03) {
					decoded.target_temperature_settings.auto = readInt16LE(bytes, counterObj, 2) / 100;
				}
				break;
			case 0x6a:
				decoded.minimum_dead_zone = readUInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x6b:
				decoded.target_temperature_range = decoded.target_temperature_range || {};
				// 0：heat, 1：em heat, 2：cool, 3：auto, 4：dehumidify, 5：ventilation
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
					// 0:plan0, 1:plan1, 2:plan2, 3:plan3, 4:plan4, 5:plan5, 6:plan6, 7:plan7, 8:plan8, 9:plan9, 10:plan10, 11:plan11, 12:plan12, 13:plan13, 14:plan14, 15:plan15, 255:Not executed
					decoded.pir_energy.plan.occupied = readUInt8(bytes, counterObj, 1);
					// 0:plan0, 1:plan1, 2:plan2, 3:plan3, 4:plan4, 5:plan5, 6:plan6, 7:plan7, 8:plan8, 9:plan9, 10:plan10, 11:plan11, 12:plan12, 13:plan13, 14:plan14, 15:plan15, 255:Not executed
					decoded.pir_energy.plan.unoccupied = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x62:
				// 0：disable, 1：enable
				decoded.intelligent_display_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x89:
				// 0:disable, 1:enable
				decoded.backlight_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x99:
				// 0:disable, 1:enable
				decoded.screen_off_enable = readUInt8(bytes, counterObj, 1);
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
				var enable = readUInt8(bytes, counterObj, 1);
				var bitOptions = readUInt16LE(bytes, counterObj, 2);
				var temp_up = extractBits(bitOptions, 0, 1);
				var temp_down = extractBits(bitOptions, 1, 2);
				var system_on_off = extractBits(bitOptions, 2, 3);
				var fan_mode = extractBits(bitOptions, 3, 4);
				var temperature_control_mode = extractBits(bitOptions, 4, 5);
				var reboot_reset = extractBits(bitOptions, 5, 6);
				var power_on_off = extractBits(bitOptions, 6, 7);
				var cancel_pair = extractBits(bitOptions, 7, 8);
				var plan_switch = extractBits(bitOptions, 8, 9);
				var status_report = extractBits(bitOptions, 9, 10);
				var filter_clean_alarm_release = extractBits(bitOptions, 10, 11);
				var button1_event = extractBits(bitOptions, 11, 12);
				var button2_event = extractBits(bitOptions, 12, 13);
				var button3_event = extractBits(bitOptions, 13, 14);
				var temperature_unit_switch = extractBits(bitOptions, 14, 15);

				if (
					!enable &&
					!temp_up &&
					!temp_down &&
					!system_on_off &&
					!fan_mode &&
					!temperature_control_mode &&
					!reboot_reset &&
					!power_on_off &&
					!cancel_pair &&
					!plan_switch &&
					!status_report &&
					!filter_clean_alarm_release &&
					!button1_event &&
					!button2_event &&
					!button3_event &&
					!temperature_unit_switch
				) {
					decoded.children_lock_settings = 1;
				} else if (enable && temp_up && temp_down && system_on_off && fan_mode && temperature_control_mode && reboot_reset && power_on_off && cancel_pair && plan_switch && status_report && filter_clean_alarm_release && button1_event && button2_event && button3_event && temperature_unit_switch) {
					decoded.children_lock_settings = 2;
				} else {
					decoded.children_lock_settings = 256;
				}
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
				var button1 = extractBits(bitOptions, 0, 1);
				var button2 = extractBits(bitOptions, 1, 2);
				var button3 = extractBits(bitOptions, 2, 3);
				var button4 = extractBits(bitOptions, 3, 4);
				var button5 = extractBits(bitOptions, 4, 5);
				if (button1 && button2 && !button3 && !button4 && !button5) {
					decoded.unlock_combination_button_settings = 1;
				} else if (!button1 && button2 && button3 && !button4 && !button5) {
					decoded.unlock_combination_button_settings = 2;
				} else if (!button1 && !button2 && button3 && button4 && !button5) {
					decoded.unlock_combination_button_settings = 3;
				} else if (!button1 && !button2 && !button3 && button4 && button5) {
					decoded.unlock_combination_button_settings = 4;
				} else if (button1 && button2 && button3 && !button4 && !button5) {
					decoded.unlock_combination_button_settings = 5;
				} else if (!button1 && button2 && button3 && button4 && !button5) {
					decoded.unlock_combination_button_settings = 6;
				} else if (button1 && button2 && button3 && button4 && button5) {
					decoded.unlock_combination_button_settings = 7;
				} else {
					decoded.unlock_combination_button_settings = 256;
				}
				break;
			case 0xc7:
				decoded.time_zone = readInt16LE(bytes, counterObj, 2);
				break;
			case 0x86:
				decoded.origin_temperature = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x87:
				decoded.origin_humidity = readUInt16LE(bytes, counterObj, 2) / 10;
				break;
			case 0xb7:
				decoded.set_time = decoded.set_time || {};
				decoded.set_time.timestamp = readUInt32LE(bytes, counterObj, 4);
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
	var major = (bytes[0] & 0xff).toString(16);
	var minor = (bytes[1] & 0xff).toString(16);
	var release = (bytes[2] & 0xff).toString(16);
	var alpha = (bytes[3] & 0xff).toString(16);
	var unit_test = (bytes[4] & 0xff).toString(16);
	var test = (bytes[5] & 0xff).toString(16);

	var version = 'v' + major + '.' + minor;
	if (release !== 0) version += '-r' + release.toString(16);
	if (alpha !== 0) version += '-a' + alpha.toString(16);
	if (unit_test !== 0) version += '-u' + unit_test.toString(16);
	if (test !== 0) version += '-t' + test.toString(16);
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


function processTemperature(decoded) {
	var allTemperatureProperties = {
    "temperature": {
        "precision": 2,
        "unitName": "℃"
    },
    "target_temperature1": {
        "precision": 2,
        "unitName": "℃"
    },
    "target_temperature2": {
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
    "minimum_dead_zone": {
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
    "origin_temperature": {
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