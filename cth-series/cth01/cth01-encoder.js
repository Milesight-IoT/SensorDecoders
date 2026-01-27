/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product CTH01
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
	var encoded = [];
	var error_value_map = {
		current: [0xFF, 0xFF, 0xFF],
		voltage: [0xFF, 0xFF],
		forward_active_energy: [0xFF, 0xFF, 0xFF, 0xFF],
		reverse_active_energy: [0xFF, 0xFF, 0xFF, 0xFF],
		forward_reactive_energy: [0xFF, 0xFF, 0xFF, 0xFF],
		reverse_reactive_energy: [0xFF, 0xFF, 0xFF, 0xFF],
		apparent_energy: [0xFF, 0xFF, 0xFF, 0xFF],
		power_factor: [0xFF],
		active_power: [0xFF, 0xFF, 0xFF, 0xFF],
		reactive_power: [0xFF, 0xFF, 0xFF, 0xFF],
		apparent_power: [0xFF, 0xFF, 0xFF, 0xFF],
		thdi: [0xFF, 0xFF],
		thdv: [0xFF, 0xFF],
		voltage_three_phase_imbalcance: [0xFF, 0xFF]
	}
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
					console.log(pureNumber);
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
	//0xcf
	if ('lorawan_configuration_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.lorawan_configuration_settings.version)) {
			buffer.writeUInt8(0xcf);
			// 1：1.0.2, 2：1.0.3, 3：1.0.3, 4：1.0.4
			buffer.writeUInt8(0xd8);
			// 1：1.0.2, 2：1.0.3, 3：1.0.3, 4：1.0.4
			buffer.writeUInt8(payload.lorawan_configuration_settings.version);
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
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x01
	if ('temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x01);
		if (payload.temperature < -20 || payload.temperature > 60) {
			throw new Error('temperature must be between -20 and 60');
		}
		buffer.writeInt16LE(payload.temperature * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x02
	if ('voltage_three_phase_imbalcance' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x02);
		if (payload.voltage_three_phase_imbalcance === 'error') {
			buffer.writeBytes(error_value_map.voltage_three_phase_imbalcance);
		} else {
			if (payload.voltage_three_phase_imbalcance < 0 || payload.voltage_three_phase_imbalcance > 100) {
				throw new Error('voltage_three_phase_imbalcance must be between 0 and 100');
			}
			buffer.writeUInt16LE(payload.voltage_three_phase_imbalcance * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x03
	if ('thdi' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x03);
		for (var i = 0; i < payload.thdi.length; i++) {
			var thdi_item = payload.thdi[i];
			if (thdi_item.value === 'error') {
				buffer.writeBytes(error_value_map.thdi);
			} else {
				if (thdi_item.value < 0 || thdi_item.value > 100) {
					throw new Error('value must be between 0 and 100');
				}
				buffer.writeUInt16LE(thdi_item.value * 100);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x04
	if ('thdv' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x04);
		for (var i = 0; i < payload.thdv.length; i++) {
			var thdv_item = payload.thdv[i];
			if (thdv_item.value === 'error') {
				buffer.writeBytes(error_value_map.thdv);
			} else {
				if (thdv_item.value < 0 || thdv_item.value > 100) {
					throw new Error('value must be between 0 and 100');
				}
				buffer.writeUInt16LE(thdv_item.value * 100);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x05
	if ('current' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x05);
		for (var i = 0; i < payload.current.length; i++) {
			var current_item = payload.current[i];
			if (current_item.value === 'error') {
				buffer.writeBytes(error_value_map.current);
			} else {
				if (current_item.value < 0 || current_item.value > 4000) {
					throw new Error('value must be between 0 and 4000');
				}
				buffer.writeUInt24LE(current_item.value * 100);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x06
	if ('voltage' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x06);
		for (var i = 0; i < payload.voltage.length; i++) {
			var voltage_item = payload.voltage[i];	
			if (voltage_item.value === 'error') {
				buffer.writeBytes(error_value_map.voltage);
			} else {
				if (voltage_item.value < 0 || voltage_item.value > 500) {
					throw new Error('value must be between 0 and 500');
				}
				buffer.writeUInt16LE(voltage_item.value * 100);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x07
	if ('power_factor' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x07);
		var bitOptions = 0;
		bitOptions |= payload.power_factor.mask1 << 0;

		bitOptions |= payload.power_factor.mask2 << 1;

		bitOptions |= payload.power_factor.mask3 << 2;

		bitOptions |= payload.power_factor.mask4 << 3;
		buffer.writeUInt8(bitOptions);

		if (payload.power_factor.mask1 == 0x00) {
			if (payload.power_factor.group1_value === 'error') {
				buffer.writeBytes(error_value_map.power_factor);
			} else {
				if (payload.power_factor.group1_value < 0 || payload.power_factor.group1_value > 100) {
					throw new Error('power_factor.group1_value must be between 0 and 100');
				}
				buffer.writeUInt8(payload.power_factor.group1_value * 100);
			}
		}
		if (payload.power_factor.mask1 == 0x01) {
			if (payload.power_factor.group1.chan1 === 'error') {
				buffer.writeBytes(error_value_map.power_factor);
			} else {
				if (payload.power_factor.group1.chan1 < 0 || payload.power_factor.group1.chan1 > 100) {
					throw new Error('power_factor.group1.chan1 must be between 0 and 100');
				}
				buffer.writeUInt8(payload.power_factor.group1.chan1 * 100);
			}
			if (payload.power_factor.group1.chan2 === 'error') {
				buffer.writeBytes(error_value_map.power_factor);
			} else {
				if (payload.power_factor.group1.chan2 < 0 || payload.power_factor.group1.chan2 > 100) {
					throw new Error('power_factor.group1.chan2 must be between 0 and 100');
				}
				buffer.writeUInt8(payload.power_factor.group1.chan2 * 100);
			}
			if (payload.power_factor.group1.chan3 === 'error') {
				buffer.writeBytes(error_value_map.power_factor);
			} else {
				if (payload.power_factor.group1.chan3 < 0 || payload.power_factor.group1.chan3 > 100) {
					throw new Error('power_factor.group1.chan3 must be between 0 and 100');
				}
				buffer.writeUInt8(payload.power_factor.group1.chan3 * 100);
			}
		}
		if (payload.power_factor.mask2 == 0x00) {
			if (payload.power_factor.group2_value === 'error') {
				buffer.writeBytes(error_value_map.power_factor);
			} else {
				if (payload.power_factor.group2_value < 0 || payload.power_factor.group2_value > 100) {
					throw new Error('power_factor.group2_value must be between 0 and 100');
				}
				buffer.writeUInt8(payload.power_factor.group2_value * 100);
			}
		}
		if (payload.power_factor.mask2 == 0x01) {
			if (payload.power_factor.group2.chan1 === 'error') {
				buffer.writeBytes(error_value_map.power_factor);
			} else {
				if (payload.power_factor.group2.chan1 < 0 || payload.power_factor.group2.chan1 > 100) {
					throw new Error('power_factor.group2.chan1 must be between 0 and 100');
				}
				buffer.writeUInt8(payload.power_factor.group2.chan1 * 100);
			}
			if (payload.power_factor.group2.chan2 === 'error') {
				buffer.writeBytes(error_value_map.power_factor);
			} else {
				if (payload.power_factor.group2.chan2 < 0 || payload.power_factor.group2.chan2 > 100) {
					throw new Error('power_factor.group2.chan2 must be between 0 and 100');
				}
				buffer.writeUInt8(payload.power_factor.group2.chan2 * 100);
			}
			if (payload.power_factor.group2.chan3 === 'error') {
				buffer.writeBytes(error_value_map.power_factor);
			} else {
				if (payload.power_factor.group2.chan3 < 0 || payload.power_factor.group2.chan3 > 100) {
					throw new Error('power_factor.group2.chan3 must be between 0 and 100');
				}
				buffer.writeUInt8(payload.power_factor.group2.chan3 * 100);
			}
		}
		if (payload.power_factor.mask3 == 0x00) {
			if (payload.power_factor.group3_value === 'error') {
				buffer.writeBytes(error_value_map.power_factor);
			} else {
				if (payload.power_factor.group3_value < 0 || payload.power_factor.group3_value > 100) {
					throw new Error('power_factor.group3_value must be between 0 and 100');
				}
				buffer.writeUInt8(payload.power_factor.group3_value * 100);
			}
		}
		if (payload.power_factor.mask3 == 0x01) {
			if (payload.power_factor.group3.chan1 === 'error') {
				buffer.writeBytes(error_value_map.power_factor);
			} else {
				if (payload.power_factor.group3.chan1 < 0 || payload.power_factor.group3.chan1 > 100) {
					throw new Error('power_factor.group3.chan1 must be between 0 and 100');
				}
				buffer.writeUInt8(payload.power_factor.group3.chan1 * 100);
			}
			if (payload.power_factor.group3.chan2 === 'error') {
				buffer.writeBytes(error_value_map.power_factor);
			} else {
				if (payload.power_factor.group3.chan2 < 0 || payload.power_factor.group3.chan2 > 100) {
					throw new Error('power_factor.group3.chan2 must be between 0 and 100');
				}
				buffer.writeUInt8(payload.power_factor.group3.chan2 * 100);
			}
			if (payload.power_factor.group3.chan3 === 'error') {
				buffer.writeBytes(error_value_map.power_factor);
			} else {
				if (payload.power_factor.group3.chan3 < 0 || payload.power_factor.group3.chan3 > 100) {
					throw new Error('power_factor.group3.chan3 must be between 0 and 100');
				}
				buffer.writeUInt8(payload.power_factor.group3.chan3 * 100);
			}
		}
		if (payload.power_factor.mask4 == 0x00) {
			if (payload.power_factor.group4_value === 'error') {
				buffer.writeBytes(error_value_map.power_factor);
			} else {
				if (payload.power_factor.group4_value < 0 || payload.power_factor.group4_value > 100) {
					throw new Error('power_factor.group4_value must be between 0 and 100');
				}
				buffer.writeUInt8(payload.power_factor.group4_value * 100);
			}
		}
		if (payload.power_factor.mask4 == 0x01) {
			if (payload.power_factor.group4.chan1 === 'error') {
				buffer.writeBytes(error_value_map.power_factor);
			} else {
				if (payload.power_factor.group4.chan1 < 0 || payload.power_factor.group4.chan1 > 100) {
					throw new Error('power_factor.group4.chan1 must be between 0 and 100');
				}
				buffer.writeUInt8(payload.power_factor.group4.chan1 * 100);
			}
			if (payload.power_factor.group4.chan2 === 'error') {
				buffer.writeBytes(error_value_map.power_factor);
			} else {
				if (payload.power_factor.group4.chan2 < 0 || payload.power_factor.group4.chan2 > 100) {
					throw new Error('power_factor.group4.chan2 must be between 0 and 100');
				}
				buffer.writeUInt8(payload.power_factor.group4.chan2 * 100);
			}
			if (payload.power_factor.group4.chan3 === 'error') {
				buffer.writeBytes(error_value_map.power_factor);
			} else {
				if (payload.power_factor.group4.chan3 < 0 || payload.power_factor.group4.chan3 > 100) {
					throw new Error('power_factor.group4.chan3 must be between 0 and 100');
				}
				buffer.writeUInt8(payload.power_factor.group4.chan3 * 100);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x08
	if ('active_power1' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x08);
		var bitOptions = 0;
		bitOptions |= payload.active_power1.mask1 << 0;

		bitOptions |= payload.active_power1.mask2 << 1;
		buffer.writeUInt8(bitOptions);

		if (payload.active_power1.mask1 == 0x00) {
			if (payload.active_power1.group1_value === 'error') {
				buffer.writeBytes(error_value_map.active_power);
			} else {
				if (payload.active_power1.group1_value < 0 || payload.active_power1.group1_value > 4000) {
					throw new Error('active_power1.group1_value must be between 0 and 4000');
				}
				buffer.writeInt32LE(payload.active_power1.group1_value * 1000);
			}
		}
		if (payload.active_power1.mask1 == 0x01) {
			if (payload.active_power1.group1.chan1 === 'error') {
				buffer.writeBytes(error_value_map.active_power);
			} else {
				buffer.writeInt32LE(payload.active_power1.group1.chan1 * 1000);
			}
			if (payload.active_power1.group1.chan2 === 'error') {
				buffer.writeBytes(error_value_map.active_power);
			} else {
				buffer.writeInt32LE(payload.active_power1.group1.chan2 * 1000);
			}
			if (payload.active_power1.group1.chan3 === 'error') {
				buffer.writeBytes(error_value_map.active_power);
			} else {
				buffer.writeInt32LE(payload.active_power1.group1.chan3 * 1000);
			}
		}
		if (payload.active_power1.mask2 == 0x00) {
			if (payload.active_power1.group2_value === 'error') {
				buffer.writeBytes(error_value_map.active_power);
			} else {
				buffer.writeInt32LE(payload.active_power1.group2_value * 1000);
			}
		}
		if (payload.active_power1.mask2 == 0x01) {
			if (payload.active_power1.group2.chan1 === 'error') {
				buffer.writeBytes(error_value_map.active_power);
			} else {
				buffer.writeInt32LE(payload.active_power1.group2.chan1 * 1000);
			}
			if (payload.active_power1.group2.chan2 === 'error') {
				buffer.writeBytes(error_value_map.active_power);
			} else {
				buffer.writeInt32LE(payload.active_power1.group2.chan2 * 1000);
			}
			if (payload.active_power1.group2.chan3 === 'error') {
				buffer.writeBytes(error_value_map.active_power);
			} else {
				buffer.writeInt32LE(payload.active_power1.group2.chan3 * 1000);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x09
	if ('active_power2' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x09);
		var bitOptions = 0;
		bitOptions |= payload.active_power2.mask1 << 0;

		bitOptions |= payload.active_power2.mask2 << 1;
		buffer.writeUInt8(bitOptions);

		if (payload.active_power2.mask1 == 0x00) {
			if (payload.active_power2.group1_value === 'error') {
				buffer.writeBytes(error_value_map.active_power);
			} else {
				buffer.writeInt32LE(payload.active_power2.group1_value * 1000);
			}
		}
		if (payload.active_power2.mask1 == 0x01) {
			if (payload.active_power2.group1.chan1 === 'error') {
				buffer.writeBytes(error_value_map.active_power);
			} else {
				buffer.writeInt32LE(payload.active_power2.group1.chan1 * 1000);
			}
			if (payload.active_power2.group1.chan2 === 'error') {
				buffer.writeBytes(error_value_map.active_power);
			} else {
				buffer.writeInt32LE(payload.active_power2.group1.chan2 * 1000);
			}
			if (payload.active_power2.group1.chan3 === 'error') {
				buffer.writeBytes(error_value_map.active_power);
			} else {
				buffer.writeInt32LE(payload.active_power2.group1.chan3 * 1000);
			}
		}
		if (payload.active_power2.mask2 == 0x00) {
			if (payload.active_power2.group2_value === 'error') {
				buffer.writeBytes(error_value_map.active_power);
			} else {
				buffer.writeInt32LE(payload.active_power2.group2_value * 1000);
			}
		}
		if (payload.active_power2.mask2 == 0x01) {
			if (payload.active_power2.group2.chan1 === 'error') {
				buffer.writeBytes(error_value_map.active_power);
			} else {
				buffer.writeInt32LE(payload.active_power2.group2.chan1 * 1000);
			}
			if (payload.active_power2.group2.chan2 === 'error') {
				buffer.writeBytes(error_value_map.active_power);
			} else {
				buffer.writeInt32LE(payload.active_power2.group2.chan2 * 1000);
			}
			if (payload.active_power2.group2.chan3 === 'error') {
				buffer.writeBytes(error_value_map.active_power);
			} else {
				buffer.writeInt32LE(payload.active_power2.group2.chan3 * 1000);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0a
	if ('reactive_power1' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0a);
		var bitOptions = 0;
		bitOptions |= payload.reactive_power1.mask1 << 0;

		bitOptions |= payload.reactive_power1.mask2 << 1;
		buffer.writeUInt8(bitOptions);

		if (payload.reactive_power1.mask1 == 0x00) {
			if (payload.reactive_power1.group1_value === 'error') {
				buffer.writeBytes(error_value_map.reactive_power);
			} else {
				buffer.writeInt32LE(payload.reactive_power1.group1_value * 1000);
			}
		}
		if (payload.reactive_power1.mask1 == 0x01) {
			if (payload.reactive_power1.group1.chan1 === 'error') {
				buffer.writeBytes(error_value_map.reactive_power);
			} else {
				buffer.writeInt32LE(payload.reactive_power1.group1.chan1 * 1000);
			}
			if (payload.reactive_power1.group1.chan2 === 'error') {
				buffer.writeBytes(error_value_map.reactive_power);
			} else {
				buffer.writeInt32LE(payload.reactive_power1.group1.chan2 * 1000);
			}
			if (payload.reactive_power1.group1.chan3 === 'error') {
				buffer.writeBytes(error_value_map.reactive_power);
			} else {
				buffer.writeInt32LE(payload.reactive_power1.group1.chan3 * 1000);
			}
		}
		if (payload.reactive_power1.mask2 == 0x00) {
			if (payload.reactive_power1.group2_value === 'error') {
				buffer.writeBytes(error_value_map.reactive_power);
			} else {
				buffer.writeInt32LE(payload.reactive_power1.group2_value * 1000);
			}
		}
		if (payload.reactive_power1.mask2 == 0x01) {
			if (payload.reactive_power1.group2.chan1 === 'error') {
				buffer.writeBytes(error_value_map.reactive_power);
			} else {
				buffer.writeInt32LE(payload.reactive_power1.group2.chan1 * 1000);
			}
			if (payload.reactive_power1.group2.chan2 === 'error') {
				buffer.writeBytes(error_value_map.reactive_power);
			} else {
				buffer.writeInt32LE(payload.reactive_power1.group2.chan2 * 1000);
			}
			if (payload.reactive_power1.group2.chan3 === 'error') {
				buffer.writeBytes(error_value_map.reactive_power);
			} else {
				buffer.writeInt32LE(payload.reactive_power1.group2.chan3 * 1000);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0b
	if ('reactive_power2' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0b);
		var bitOptions = 0;
		bitOptions |= payload.reactive_power2.mask1 << 0;

		bitOptions |= payload.reactive_power2.mask2 << 1;
		buffer.writeUInt8(bitOptions);

		if (payload.reactive_power2.mask1 == 0x00) {
			if (payload.reactive_power2.group1_value === 'error') {
				buffer.writeBytes(error_value_map.reactive_power);
			} else {
				buffer.writeInt32LE(payload.reactive_power2.group1_value * 1000);
			}
		}
		if (payload.reactive_power2.mask1 == 0x01) {
			if (payload.reactive_power2.group1.chan1 === 'error') {
				buffer.writeBytes(error_value_map.reactive_power);
			} else {
				buffer.writeInt32LE(payload.reactive_power2.group1.chan1 * 1000);
			}
			if (payload.reactive_power2.group1.chan2 === 'error') {
				buffer.writeBytes(error_value_map.reactive_power);
			} else {
				buffer.writeInt32LE(payload.reactive_power2.group1.chan2 * 1000);
			}
			if (payload.reactive_power2.group1.chan3 === 'error') {
				buffer.writeBytes(error_value_map.reactive_power);
			} else {
				buffer.writeInt32LE(payload.reactive_power2.group1.chan3 * 1000);
			}
		}
		if (payload.reactive_power2.mask2 == 0x00) {
			if (payload.reactive_power2.group2_value === 'error') {
				buffer.writeBytes(error_value_map.reactive_power);
			} else {
				buffer.writeInt32LE(payload.reactive_power2.group2_value * 1000);
			}
		}
		if (payload.reactive_power2.mask2 == 0x01) {
			if (payload.reactive_power2.group2.chan1 === 'error') {
				buffer.writeBytes(error_value_map.reactive_power);
			} else {
				buffer.writeInt32LE(payload.reactive_power2.group2.chan1 * 1000);
			}
			if (payload.reactive_power2.group2.chan2 === 'error') {
				buffer.writeBytes(error_value_map.reactive_power);
			} else {
				buffer.writeInt32LE(payload.reactive_power2.group2.chan2 * 1000);
			}
			if (payload.reactive_power2.group2.chan3 === 'error') {
				buffer.writeBytes(error_value_map.reactive_power);
			} else {
				buffer.writeInt32LE(payload.reactive_power2.group2.chan3 * 1000);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0c
	if ('apparent_power1' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0c);
		var bitOptions = 0;
		bitOptions |= payload.apparent_power1.mask1 << 0;

		bitOptions |= payload.apparent_power1.mask2 << 1;
		buffer.writeUInt8(bitOptions);

		if (payload.apparent_power1.mask1 == 0x00) {
			if (payload.apparent_power1.group1_value === 'error') {
				buffer.writeBytes(error_value_map.apparent_power);
			} else {
				if (payload.apparent_power1.group1_value < 0 || payload.apparent_power1.group1_value > 4000) {
					throw new Error('apparent_power1.group1_value must be between 0 and 4000');
				}
				buffer.writeInt32LE(payload.apparent_power1.group1_value * 1000);
			}
		}
		if (payload.apparent_power1.mask1 == 0x01) {
			if (payload.apparent_power1.group1.chan1 === 'error') {
				buffer.writeBytes(error_value_map.apparent_power);
			} else {
				buffer.writeInt32LE(payload.apparent_power1.group1.chan1 * 1000);
			}
			if (payload.apparent_power1.group1.chan2 === 'error') {
				buffer.writeBytes(error_value_map.apparent_power);
			} else {
				buffer.writeInt32LE(payload.apparent_power1.group1.chan2 * 1000);
			}
			if (payload.apparent_power1.group1.chan3 === 'error') {
				buffer.writeBytes(error_value_map.apparent_power);
			} else {
				buffer.writeInt32LE(payload.apparent_power1.group1.chan3 * 1000);
			}
		}
		if (payload.apparent_power1.mask2 == 0x00) {
			if (payload.apparent_power1.group2_value === 'error') {
				buffer.writeBytes(error_value_map.apparent_power);
			} else {
				buffer.writeInt32LE(payload.apparent_power1.group2_value * 1000);
			}
		}
		if (payload.apparent_power1.mask2 == 0x01) {
			if (payload.apparent_power1.group2.chan1 === 'error') {
				buffer.writeBytes(error_value_map.apparent_power);
			} else {
				buffer.writeInt32LE(payload.apparent_power1.group2.chan1 * 1000);
			}
			if (payload.apparent_power1.group2.chan2 === 'error') {
				buffer.writeBytes(error_value_map.apparent_power);
			} else {
				buffer.writeInt32LE(payload.apparent_power1.group2.chan2 * 1000);
			}
			if (payload.apparent_power1.group2.chan3 === 'error') {
				buffer.writeBytes(error_value_map.apparent_power);
			} else {
				buffer.writeInt32LE(payload.apparent_power1.group2.chan3 * 1000);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0d
	if ('apparent_power2' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0d);
		var bitOptions = 0;
		bitOptions |= payload.apparent_power2.mask1 << 0;

		bitOptions |= payload.apparent_power2.mask2 << 1;
		buffer.writeUInt8(bitOptions);

		if (payload.apparent_power2.mask1 == 0x00) {
			if (payload.apparent_power2.group1_value === 'error') {
				buffer.writeBytes(error_value_map.apparent_power);
			} else {
				buffer.writeInt32LE(payload.apparent_power2.group1_value * 1000);
			}
		}
		if (payload.apparent_power2.mask1 == 0x01) {
			if (payload.apparent_power2.group1.chan1 === 'error') {
				buffer.writeBytes(error_value_map.apparent_power);
			} else {
				buffer.writeInt32LE(payload.apparent_power2.group1.chan1 * 1000);
			}
			if (payload.apparent_power2.group1.chan2 === 'error') {
				buffer.writeBytes(error_value_map.apparent_power);
			} else {
				buffer.writeInt32LE(payload.apparent_power2.group1.chan2 * 1000);
			}
			if (payload.apparent_power2.group1.chan3 === 'error') {
				buffer.writeBytes(error_value_map.apparent_power);
			} else {
				buffer.writeInt32LE(payload.apparent_power2.group1.chan3 * 1000);
			}
		}
		if (payload.apparent_power2.mask2 == 0x00) {
			if (payload.apparent_power2.group2_value === 'error') {
				buffer.writeBytes(error_value_map.apparent_power);
			} else {
				buffer.writeInt32LE(payload.apparent_power2.group2_value * 1000);
			}
		}
		if (payload.apparent_power2.mask2 == 0x01) {
			if (payload.apparent_power2.group2.chan1 === 'error') {
				buffer.writeBytes(error_value_map.apparent_power);
			} else {
				buffer.writeInt32LE(payload.apparent_power2.group2.chan1 * 1000);
			}
			if (payload.apparent_power2.group2.chan2 === 'error') {
				buffer.writeBytes(error_value_map.apparent_power);
			} else {
				buffer.writeInt32LE(payload.apparent_power2.group2.chan2 * 1000);
			}
			if (payload.apparent_power2.group2.chan3 === 'error') {
				buffer.writeBytes(error_value_map.apparent_power);
			} else {
				buffer.writeInt32LE(payload.apparent_power2.group2.chan3 * 1000);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0e
	if ('forward_active_energy1' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0e);
		var bitOptions = 0;
		bitOptions |= payload.forward_active_energy1.mask1 << 0;

		bitOptions |= payload.forward_active_energy1.mask2 << 1;
		buffer.writeUInt8(bitOptions);

		if (payload.forward_active_energy1.mask1 == 0x00) {
			if (payload.forward_active_energy1.group1_value === 'error') {
				buffer.writeBytes(error_value_map.forward_active_energy);
			} else {
				if (payload.forward_active_energy1.group1_value < 0 || payload.forward_active_energy1.group1_value > 4000) {
					throw new Error('forward_active_energy1.group1_value must be between 0 and 4000');
				}
				buffer.writeUInt32LE(payload.forward_active_energy1.group1_value * 1000);
			}
		}
		if (payload.forward_active_energy1.mask1 == 0x01) {
			if (payload.forward_active_energy1.group1.chan1 === 'error') {
				buffer.writeBytes(error_value_map.forward_active_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_active_energy1.group1.chan1 * 1000);
			}
			if (payload.forward_active_energy1.group1.chan2 === 'error') {
				buffer.writeBytes(error_value_map.forward_active_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_active_energy1.group1.chan2 * 1000);
			}
			if (payload.forward_active_energy1.group1.chan3 === 'error') {
				buffer.writeBytes(error_value_map.forward_active_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_active_energy1.group1.chan3 * 1000);
			}
		}
		if (payload.forward_active_energy1.mask2 == 0x00) {
			if (payload.forward_active_energy1.group2_value === 'error') {
				buffer.writeBytes(error_value_map.forward_active_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_active_energy1.group2_value * 1000);
			}
		}
		if (payload.forward_active_energy1.mask2 == 0x01) {
			if (payload.forward_active_energy1.group2.chan1 === 'error') {
				buffer.writeBytes(error_value_map.forward_active_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_active_energy1.group2.chan1 * 1000);
			}
			if (payload.forward_active_energy1.group2.chan2 === 'error') {
				buffer.writeBytes(error_value_map.forward_active_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_active_energy1.group2.chan2 * 1000);
			}
			if (payload.forward_active_energy1.group2.chan3 === 'error') {
				buffer.writeBytes(error_value_map.forward_active_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_active_energy1.group2.chan3 * 1000);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0f
	if ('forward_active_energy2' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0f);
		var bitOptions = 0;
		bitOptions |= payload.forward_active_energy2.mask1 << 0;

		bitOptions |= payload.forward_active_energy2.mask2 << 1;
		buffer.writeUInt8(bitOptions);

		if (payload.forward_active_energy2.mask1 == 0x00) {
			if (payload.forward_active_energy2.group1_value === 'error') {
				buffer.writeBytes(error_value_map.forward_active_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_active_energy2.group1_value * 1000);
			}
		}
		if (payload.forward_active_energy2.mask1 == 0x01) {
			if (payload.forward_active_energy2.group1.chan1 === 'error') {
				buffer.writeBytes(error_value_map.forward_active_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_active_energy2.group1.chan1 * 1000);
			}
			if (payload.forward_active_energy2.group1.chan2 === 'error') {
				buffer.writeBytes(error_value_map.forward_active_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_active_energy2.group1.chan2 * 1000);
			}
			if (payload.forward_active_energy2.group1.chan3 === 'error') {
				buffer.writeBytes(error_value_map.forward_active_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_active_energy2.group1.chan3 * 1000);
			}
		}
		if (payload.forward_active_energy2.mask2 == 0x00) {
			if (payload.forward_active_energy2.group2_value === 'error') {
				buffer.writeBytes(error_value_map.forward_active_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_active_energy2.group2_value * 1000);
			}
		}
		if (payload.forward_active_energy2.mask2 == 0x01) {
			if (payload.forward_active_energy2.group2.chan1 === 'error') {
				buffer.writeBytes(error_value_map.forward_active_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_active_energy2.group2.chan1 * 1000);
			}
			if (payload.forward_active_energy2.group2.chan2 === 'error') {
				buffer.writeBytes(error_value_map.forward_active_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_active_energy2.group2.chan2 * 1000);
			}
			if (payload.forward_active_energy2.group2.chan3 === 'error') {
				buffer.writeBytes(error_value_map.forward_active_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_active_energy2.group2.chan3 * 1000);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x10
	if ('reverse_active_energy1' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x10);
		var bitOptions = 0;
		bitOptions |= payload.reverse_active_energy1.mask1 << 0;

		bitOptions |= payload.reverse_active_energy1.mask2 << 1;
		buffer.writeUInt8(bitOptions);

		if (payload.reverse_active_energy1.mask1 == 0x00) {
			if (payload.reverse_active_energy1.group1_value === 'error') {
				buffer.writeBytes(error_value_map.reverse_active_energy);
			} else {
				if (payload.reverse_active_energy1.group1_value < 0 || payload.reverse_active_energy1.group1_value > 4000) {
					throw new Error('reverse_active_energy1.group1_value must be between 0 and 4000');
				}
				buffer.writeUInt32LE(payload.reverse_active_energy1.group1_value * 1000);
			}
		}
		if (payload.reverse_active_energy1.mask1 == 0x01) {
			if (payload.reverse_active_energy1.group1.chan1 === 'error') {
				buffer.writeBytes(error_value_map.reverse_active_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_active_energy1.group1.chan1 * 1000);
			}
			if (payload.reverse_active_energy1.group1.chan2 === 'error') {
				buffer.writeBytes(error_value_map.reverse_active_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_active_energy1.group1.chan2 * 1000);
			}
			if (payload.reverse_active_energy1.group1.chan3 === 'error') {
				buffer.writeBytes(error_value_map.reverse_active_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_active_energy1.group1.chan3 * 1000);
			}
		}
		if (payload.reverse_active_energy1.mask2 == 0x00) {
			if (payload.reverse_active_energy1.group2_value === 'error') {
				buffer.writeBytes(error_value_map.reverse_active_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_active_energy1.group2_value * 1000);
			}
		}
		if (payload.reverse_active_energy1.mask2 == 0x01) {
			if (payload.reverse_active_energy1.group2.chan1 === 'error') {
				buffer.writeBytes(error_value_map.reverse_active_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_active_energy1.group2.chan1 * 1000);
			}
			if (payload.reverse_active_energy1.group2.chan2 === 'error') {
				buffer.writeBytes(error_value_map.reverse_active_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_active_energy1.group2.chan2 * 1000);
			}
			if (payload.reverse_active_energy1.group2.chan3 === 'error') {
				buffer.writeBytes(error_value_map.reverse_active_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_active_energy1.group2.chan3 * 1000);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x11
	if ('reverse_active_energy2' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x11);
		var bitOptions = 0;
		bitOptions |= payload.reverse_active_energy2.mask1 << 0;

		bitOptions |= payload.reverse_active_energy2.mask2 << 1;
		buffer.writeUInt8(bitOptions);

		if (payload.reverse_active_energy2.mask1 == 0x00) {
			if (payload.reverse_active_energy2.group1_value === 'error') {
				buffer.writeBytes(error_value_map.reverse_active_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_active_energy2.group1_value * 1000);
			}
		}
		if (payload.reverse_active_energy2.mask1 == 0x01) {
			if (payload.reverse_active_energy2.group1.chan1 === 'error') {
				buffer.writeBytes(error_value_map.reverse_active_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_active_energy2.group1.chan1 * 1000);
			}
			if (payload.reverse_active_energy2.group1.chan2 === 'error') {
				buffer.writeBytes(error_value_map.reverse_active_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_active_energy2.group1.chan2 * 1000);
			}
			if (payload.reverse_active_energy2.group1.chan3 === 'error') {
				buffer.writeBytes(error_value_map.reverse_active_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_active_energy2.group1.chan3 * 1000);
			}
		}
		if (payload.reverse_active_energy2.mask2 == 0x00) {
			if (payload.reverse_active_energy2.group2_value === 'error') {
				buffer.writeBytes(error_value_map.reverse_active_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_active_energy2.group2_value * 1000);
			}
		}
		if (payload.reverse_active_energy2.mask2 == 0x01) {
			if (payload.reverse_active_energy2.group2.chan1 === 'error') {
				buffer.writeBytes(error_value_map.reverse_active_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_active_energy2.group2.chan1 * 1000);
			}
			if (payload.reverse_active_energy2.group2.chan2 === 'error') {
				buffer.writeBytes(error_value_map.reverse_active_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_active_energy2.group2.chan2 * 1000);
			}
			if (payload.reverse_active_energy2.group2.chan3 === 'error') {
				buffer.writeBytes(error_value_map.reverse_active_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_active_energy2.group2.chan3 * 1000);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x12
	if ('forward_reactive_energy1' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x12);
		var bitOptions = 0;
		bitOptions |= payload.forward_reactive_energy1.mask1 << 0;

		bitOptions |= payload.forward_reactive_energy1.mask2 << 1;
		buffer.writeUInt8(bitOptions);

		if (payload.forward_reactive_energy1.mask1 == 0x00) {
			if (payload.forward_reactive_energy1.group1_value === 'error') {
				buffer.writeBytes(error_value_map.forward_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_reactive_energy1.group1_value * 1000);
			}
		}
		if (payload.forward_reactive_energy1.mask1 == 0x01) {
			if (payload.forward_reactive_energy1.group1.chan1 === 'error') {
				buffer.writeBytes(error_value_map.forward_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_reactive_energy1.group1.chan1 * 1000);
			}
			if (payload.forward_reactive_energy1.group1.chan2 === 'error') {
				buffer.writeBytes(error_value_map.forward_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_reactive_energy1.group1.chan2 * 1000);
			}
			if (payload.forward_reactive_energy1.group1.chan3 === 'error') {
				buffer.writeBytes(error_value_map.forward_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_reactive_energy1.group1.chan3 * 1000);
			}
		}
		if (payload.forward_reactive_energy1.mask2 == 0x00) {
			if (payload.forward_reactive_energy1.group2_value === 'error') {
				buffer.writeBytes(error_value_map.forward_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_reactive_energy1.group2_value * 1000);
			}
		}
		if (payload.forward_reactive_energy1.mask2 == 0x01) {
			if (payload.forward_reactive_energy1.group2.chan1 === 'error') {
				buffer.writeBytes(error_value_map.forward_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_reactive_energy1.group2.chan1 * 1000);
			}
			if (payload.forward_reactive_energy1.group2.chan2 === 'error') {
				buffer.writeBytes(error_value_map.forward_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_reactive_energy1.group2.chan2 * 1000);
			}
			if (payload.forward_reactive_energy1.group2.chan3 === 'error') {
				buffer.writeBytes(error_value_map.forward_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_reactive_energy1.group2.chan3 * 1000);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x13
	if ('forward_reactive_energy2' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x13);
		var bitOptions = 0;
		bitOptions |= payload.forward_reactive_energy2.mask1 << 0;

		bitOptions |= payload.forward_reactive_energy2.mask2 << 1;
		buffer.writeUInt8(bitOptions);

		if (payload.forward_reactive_energy2.mask1 == 0x00) {
			if (payload.forward_reactive_energy2.group1_value === 'error') {
				buffer.writeBytes(error_value_map.forward_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_reactive_energy2.group1_value * 1000);
			}
		}
		if (payload.forward_reactive_energy2.mask1 == 0x01) {
			if (payload.forward_reactive_energy2.group1.chan1 === 'error') {
				buffer.writeBytes(error_value_map.forward_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_reactive_energy2.group1.chan1 * 1000);
			}
			if (payload.forward_reactive_energy2.group1.chan2 === 'error') {
				buffer.writeBytes(error_value_map.forward_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_reactive_energy2.group1.chan2 * 1000);
			}
			if (payload.forward_reactive_energy2.group1.chan3 === 'error') {
				buffer.writeBytes(error_value_map.forward_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_reactive_energy2.group1.chan3 * 1000);
			}
		}
		if (payload.forward_reactive_energy2.mask2 == 0x00) {
			if (payload.forward_reactive_energy2.group2_value === 'error') {
				buffer.writeBytes(error_value_map.forward_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_reactive_energy2.group2_value * 1000);
			}
		}
		if (payload.forward_reactive_energy2.mask2 == 0x01) {
			if (payload.forward_reactive_energy2.group2.chan1 === 'error') {
				buffer.writeBytes(error_value_map.forward_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_reactive_energy2.group2.chan1 * 1000);
			}
			if (payload.forward_reactive_energy2.group2.chan2 === 'error') {
				buffer.writeBytes(error_value_map.forward_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_reactive_energy2.group2.chan2 * 1000);
			}
			if (payload.forward_reactive_energy2.group2.chan3 === 'error') {
				buffer.writeBytes(error_value_map.forward_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.forward_reactive_energy2.group2.chan3 * 1000);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x14
	if ('reverse_reactive_energy1' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x14);
		var bitOptions = 0;
		bitOptions |= payload.reverse_reactive_energy1.mask1 << 0;

		bitOptions |= payload.reverse_reactive_energy1.mask2 << 1;
		buffer.writeUInt8(bitOptions);

		if (payload.reverse_reactive_energy1.mask1 == 0x00) {
			if (payload.reverse_reactive_energy1.group1_value === 'error') {
				buffer.writeBytes(error_value_map.reverse_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_reactive_energy1.group1_value * 1000);
			}
		}
		if (payload.reverse_reactive_energy1.mask1 == 0x01) {
			if (payload.reverse_reactive_energy1.group1.chan1 === 'error') {
				buffer.writeBytes(error_value_map.reverse_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_reactive_energy1.group1.chan1 * 1000);
			}
			if (payload.reverse_reactive_energy1.group1.chan2 === 'error') {
				buffer.writeBytes(error_value_map.reverse_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_reactive_energy1.group1.chan2 * 1000);
			}
			if (payload.reverse_reactive_energy1.group1.chan3 === 'error') {
				buffer.writeBytes(error_value_map.reverse_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_reactive_energy1.group1.chan3 * 1000);
			}
		}
		if (payload.reverse_reactive_energy1.mask2 == 0x00) {
			if (payload.reverse_reactive_energy1.group2_value === 'error') {
				buffer.writeBytes(error_value_map.reverse_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_reactive_energy1.group2_value * 1000);
			}
		}
		if (payload.reverse_reactive_energy1.mask2 == 0x01) {
			if (payload.reverse_reactive_energy1.group2.chan1 === 'error') {
				buffer.writeBytes(error_value_map.reverse_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_reactive_energy1.group2.chan1 * 1000);
			}
			if (payload.reverse_reactive_energy1.group2.chan2 === 'error') {
				buffer.writeBytes(error_value_map.reverse_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_reactive_energy1.group2.chan2 * 1000);
			}
			if (payload.reverse_reactive_energy1.group2.chan3 === 'error') {
				buffer.writeBytes(error_value_map.reverse_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_reactive_energy1.group2.chan3 * 1000);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x15
	if ('reverse_reactive_energy2' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x15);
		var bitOptions = 0;
		bitOptions |= payload.reverse_reactive_energy2.mask1 << 0;

		bitOptions |= payload.reverse_reactive_energy2.mask2 << 1;
		buffer.writeUInt8(bitOptions);

		if (payload.reverse_reactive_energy2.mask1 == 0x00) {
			if (payload.reverse_reactive_energy2.group1_value === 'error') {
				buffer.writeBytes(error_value_map.reverse_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_reactive_energy2.group1_value * 1000);
			}
		}
		if (payload.reverse_reactive_energy2.mask1 == 0x01) {
			if (payload.reverse_reactive_energy2.group1.chan1 === 'error') {
				buffer.writeBytes(error_value_map.reverse_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_reactive_energy2.group1.chan1 * 1000);
			}
			if (payload.reverse_reactive_energy2.group1.chan2 === 'error') {
				buffer.writeBytes(error_value_map.reverse_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_reactive_energy2.group1.chan2 * 1000);
			}
			if (payload.reverse_reactive_energy2.group1.chan3 === 'error') {
				buffer.writeBytes(error_value_map.reverse_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_reactive_energy2.group1.chan3 * 1000);
			}
		}
		if (payload.reverse_reactive_energy2.mask2 == 0x00) {
			buffer.writeUInt32LE(payload.reverse_reactive_energy2.group2_value * 1000);
		}
		if (payload.reverse_reactive_energy2.mask2 == 0x01) {
			if (payload.reverse_reactive_energy2.group2.chan1 === 'error') {
				buffer.writeBytes(error_value_map.reverse_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_reactive_energy2.group2.chan1 * 1000);
			}
			if (payload.reverse_reactive_energy2.group2.chan2 === 'error') {
				buffer.writeBytes(error_value_map.reverse_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_reactive_energy2.group2.chan2 * 1000);
			}
			if (payload.reverse_reactive_energy2.group2.chan3 === 'error') {
				buffer.writeBytes(error_value_map.reverse_reactive_energy);
			} else {
				buffer.writeUInt32LE(payload.reverse_reactive_energy2.group2.chan3 * 1000);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x16
	if ('apparent_energy1' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x16);
		var bitOptions = 0;
		bitOptions |= payload.apparent_energy1.mask1 << 0;

		bitOptions |= payload.apparent_energy1.mask2 << 1;
		buffer.writeUInt8(bitOptions);

		if (payload.apparent_energy1.mask1 == 0x00) {
			if (payload.apparent_energy1.group1_value === 'error') {
				buffer.writeBytes(error_value_map.apparent_energy);
			} else {
				buffer.writeUInt32LE(payload.apparent_energy1.group1_value * 1000);
			}
		}
		if (payload.apparent_energy1.mask1 == 0x01) {
			if (payload.apparent_energy1.group1.chan1 === 'error') {
				buffer.writeBytes(error_value_map.apparent_energy);
			} else {
				buffer.writeUInt32LE(payload.apparent_energy1.group1.chan1 * 1000);
			}
			if (payload.apparent_energy1.group1.chan2 === 'error') {
				buffer.writeBytes(error_value_map.apparent_energy);
			} else {
				buffer.writeUInt32LE(payload.apparent_energy1.group1.chan2 * 1000);
			}
			if (payload.apparent_energy1.group1.chan3 === 'error') {
				buffer.writeBytes(error_value_map.apparent_energy);
			} else {
				buffer.writeUInt32LE(payload.apparent_energy1.group1.chan3 * 1000);
			}
		}
		if (payload.apparent_energy1.mask2 == 0x00) {
			if (payload.apparent_energy1.group2_value === 'error') {
				buffer.writeBytes(error_value_map.apparent_energy);
			} else {
				buffer.writeUInt32LE(payload.apparent_energy1.group2_value * 1000);
			}
		}
		if (payload.apparent_energy1.mask2 == 0x01) {
			if (payload.apparent_energy1.group2.chan1 === 'error') {
				buffer.writeBytes(error_value_map.apparent_energy);
			} else {
				buffer.writeUInt32LE(payload.apparent_energy1.group2.chan1 * 1000);
			}
			if (payload.apparent_energy1.group2.chan2 === 'error') {
				buffer.writeBytes(error_value_map.apparent_energy);
			} else {
				buffer.writeUInt32LE(payload.apparent_energy1.group2.chan2 * 1000);
			}
			if (payload.apparent_energy1.group2.chan3 === 'error') {
				buffer.writeBytes(error_value_map.apparent_energy);
			} else {
				buffer.writeUInt32LE(payload.apparent_energy1.group2.chan3 * 1000);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x17
	if ('apparent_energy2' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x17);
		var bitOptions = 0;
		bitOptions |= payload.apparent_energy2.mask1 << 0;

		bitOptions |= payload.apparent_energy2.mask2 << 1;
		buffer.writeUInt8(bitOptions);

		if (payload.apparent_energy2.mask1 == 0x00) {
			if (payload.apparent_energy2.group1_value === 'error') {
				buffer.writeBytes(error_value_map.apparent_energy);
			} else {
				buffer.writeUInt32LE(payload.apparent_energy2.group1_value * 1000);
			}
		}
		if (payload.apparent_energy2.mask1 == 0x01) {
			if (payload.apparent_energy2.group1.chan1 === 'error') {
				buffer.writeBytes(error_value_map.apparent_energy);
			} else {
				buffer.writeUInt32LE(payload.apparent_energy2.group1.chan1 * 1000);
			}
			if (payload.apparent_energy2.group1.chan2 === 'error') {
				buffer.writeBytes(error_value_map.apparent_energy);
			} else {
				buffer.writeUInt32LE(payload.apparent_energy2.group1.chan2 * 1000);
			}
			if (payload.apparent_energy2.group1.chan3 === 'error') {
				buffer.writeBytes(error_value_map.apparent_energy);
			} else {
				buffer.writeUInt32LE(payload.apparent_energy2.group1.chan3 * 1000);
			}
		}
		if (payload.apparent_energy2.mask2 == 0x00) {
			if (payload.apparent_energy2.group2_value === 'error') {
				buffer.writeBytes(error_value_map.apparent_energy);
			} else {
				buffer.writeUInt32LE(payload.apparent_energy2.group2_value * 1000);
			}
		}
		if (payload.apparent_energy2.mask2 == 0x01) {
			if (payload.apparent_energy2.group2.chan1 === 'error') {
				buffer.writeBytes(error_value_map.apparent_energy);
			} else {
				buffer.writeUInt32LE(payload.apparent_energy2.group2.chan1 * 1000);
			}
			if (payload.apparent_energy2.group2.chan2 === 'error') {
				buffer.writeBytes(error_value_map.apparent_energy);
			} else {
				buffer.writeUInt32LE(payload.apparent_energy2.group2.chan2 * 1000);
			}
			if (payload.apparent_energy2.group2.chan3 === 'error') {
				buffer.writeBytes(error_value_map.apparent_energy);
			} else {
				buffer.writeUInt32LE(payload.apparent_energy2.group2.chan3 * 1000);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x40
	if ('history_type' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x40);
		// 1:month energy, 2:month min, 3:month max
		buffer.writeUInt8(payload.history_type.type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x30
	if ('temperature_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x30);
		buffer.writeUInt8(payload.temperature_alarm.type);
		if (payload.temperature_alarm.type == 0x00) {
		}
		if (payload.temperature_alarm.type == 0x01) {
		}
		if (payload.temperature_alarm.type == 0x02) {
		}
		if (payload.temperature_alarm.type == 0x03) {
		}
		if (payload.temperature_alarm.type == 0x10) {
			if (payload.temperature_alarm.lower_range_alarm_deactivation.temperature < -20 || payload.temperature_alarm.lower_range_alarm_deactivation.temperature > 60) {
				throw new Error('temperature_alarm.lower_range_alarm_deactivation.temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.temperature_alarm.lower_range_alarm_deactivation.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x11) {
			if (payload.temperature_alarm.lower_range_alarm_trigger.temperature < -20 || payload.temperature_alarm.lower_range_alarm_trigger.temperature > 60) {
				throw new Error('temperature_alarm.lower_range_alarm_trigger.temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.temperature_alarm.lower_range_alarm_trigger.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x12) {
			if (payload.temperature_alarm.over_range_alarm_deactivation.temperature < -20 || payload.temperature_alarm.over_range_alarm_deactivation.temperature > 60) {
				throw new Error('temperature_alarm.over_range_alarm_deactivation.temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.temperature_alarm.over_range_alarm_deactivation.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x13) {
			if (payload.temperature_alarm.over_range_alarm_trigger.temperature < -20 || payload.temperature_alarm.over_range_alarm_trigger.temperature > 60) {
				throw new Error('temperature_alarm.over_range_alarm_trigger.temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.temperature_alarm.over_range_alarm_trigger.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x14) {
			if (payload.temperature_alarm.within_range_alarm_deactivation.temperature < -20 || payload.temperature_alarm.within_range_alarm_deactivation.temperature > 60) {
				throw new Error('temperature_alarm.within_range_alarm_deactivation.temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.temperature_alarm.within_range_alarm_deactivation.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x15) {
			if (payload.temperature_alarm.within_range_alarm_trigger.temperature < -20 || payload.temperature_alarm.within_range_alarm_trigger.temperature > 60) {
				throw new Error('temperature_alarm.within_range_alarm_trigger.temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.temperature_alarm.within_range_alarm_trigger.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x16) {
			if (payload.temperature_alarm.exceed_range_alarm_deactivation.temperature < -20 || payload.temperature_alarm.exceed_range_alarm_deactivation.temperature > 60) {
				throw new Error('temperature_alarm.exceed_range_alarm_deactivation.temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.temperature_alarm.exceed_range_alarm_deactivation.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x17) {
			if (payload.temperature_alarm.exceed_range_alarm_trigger.temperature < -20 || payload.temperature_alarm.exceed_range_alarm_trigger.temperature > 60) {
				throw new Error('temperature_alarm.exceed_range_alarm_trigger.temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.temperature_alarm.exceed_range_alarm_trigger.temperature * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x31
	if ('current_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x31);
		if (payload.current_alarm.channel < 0 || payload.current_alarm.channel > 11) {
			throw new Error('current_alarm.channel must be between 0 and 11');
		}
		buffer.writeUInt8(payload.current_alarm.channel);
		buffer.writeUInt8(payload.current_alarm.info.type);
		if (payload.current_alarm.info.type == 0x00) {
		}
		if (payload.current_alarm.info.type == 0x01) {
			buffer.writeUInt24LE(payload.current_alarm.info.lower_range_error.current * 100);
		}
		if (payload.current_alarm.info.type == 0x02) {
			buffer.writeUInt24LE(payload.current_alarm.info.over_range_error.current * 100);
		}
		if (payload.current_alarm.info.type == 0x03) {
		}
		if (payload.current_alarm.info.type == 0x04) {
			buffer.writeUInt24LE(payload.current_alarm.info.over_range_release.current * 100);
		}
		if (payload.current_alarm.info.type == 0x10) {
			buffer.writeUInt24LE(payload.current_alarm.info.lower_range_alarm_deactivation.current * 100);
		}
		if (payload.current_alarm.info.type == 0x11) {
			buffer.writeUInt24LE(payload.current_alarm.info.lower_range_alarm_trigger.current * 100);
		}
		if (payload.current_alarm.info.type == 0x12) {
			buffer.writeUInt24LE(payload.current_alarm.info.over_range_alarm_deactivation.current * 100);
		}
		if (payload.current_alarm.info.type == 0x13) {
			buffer.writeUInt24LE(payload.current_alarm.info.over_range_alarm_trigger.current * 100);
		}
		if (payload.current_alarm.info.type == 0x14) {
			buffer.writeUInt24LE(payload.current_alarm.info.within_range_alarm_deactivation.current * 100);
		}
		if (payload.current_alarm.info.type == 0x15) {
			buffer.writeUInt24LE(payload.current_alarm.info.within_range_alarm_trigger.current * 100);
		}
		if (payload.current_alarm.info.type == 0x16) {
			buffer.writeUInt24LE(payload.current_alarm.info.exceed_range_alarm_deactivation.current * 100);
		}
		if (payload.current_alarm.info.type == 0x17) {
			buffer.writeUInt24LE(payload.current_alarm.info.exceed_range_alarm_trigger.current * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x32
	if ('voltage_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x32);
		if (payload.voltage_alarm.channel < 0 || payload.voltage_alarm.channel > 11) {
			throw new Error('voltage_alarm.channel must be between 0 and 11');
		}
		buffer.writeUInt8(payload.voltage_alarm.channel);
		buffer.writeUInt8(payload.voltage_alarm.info.type);
		if (payload.voltage_alarm.info.type == 0x00) {
		}
		if (payload.voltage_alarm.info.type == 0x01) {
			buffer.writeUInt16LE(payload.voltage_alarm.info.lower_range_error.voltage * 100);
		}
		if (payload.voltage_alarm.info.type == 0x02) {
			buffer.writeUInt16LE(payload.voltage_alarm.info.over_range_error.voltage * 100);
		}
		if (payload.voltage_alarm.info.type == 0x03) {
		}
		if (payload.voltage_alarm.info.type == 0x04) {
			buffer.writeUInt16LE(payload.voltage_alarm.info.over_range_release.voltage * 100);
		}
		if (payload.voltage_alarm.info.type == 0x10) {
			buffer.writeUInt16LE(payload.voltage_alarm.info.lower_range_alarm_deactivation.voltage * 100);
		}
		if (payload.voltage_alarm.info.type == 0x11) {
			buffer.writeUInt16LE(payload.voltage_alarm.info.lower_range_alarm_trigger.voltage * 100);
		}
		if (payload.voltage_alarm.info.type == 0x12) {
			buffer.writeUInt16LE(payload.voltage_alarm.info.over_range_alarm_deactivation.voltage * 100);
		}
		if (payload.voltage_alarm.info.type == 0x13) {
			buffer.writeUInt16LE(payload.voltage_alarm.info.over_range_alarm_trigger.voltage * 100);
		}
		if (payload.voltage_alarm.info.type == 0x14) {
			buffer.writeUInt16LE(payload.voltage_alarm.info.within_range_alarm_deactivation.voltage * 100);
		}
		if (payload.voltage_alarm.info.type == 0x15) {
			buffer.writeUInt16LE(payload.voltage_alarm.info.within_range_alarm_trigger.voltage * 100);
		}
		if (payload.voltage_alarm.info.type == 0x16) {
			buffer.writeUInt16LE(payload.voltage_alarm.info.exceed_range_alarm_deactivation.voltage * 100);
		}
		if (payload.voltage_alarm.info.type == 0x17) {
			buffer.writeUInt16LE(payload.voltage_alarm.info.exceed_range_alarm_trigger.voltage * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x33
	if ('thdi_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x33);
		if (payload.thdi_alarm.channel < 0 || payload.thdi_alarm.channel > 11) {
			throw new Error('thdi_alarm.channel must be between 0 and 11');
		}
		buffer.writeUInt8(payload.thdi_alarm.channel);
		buffer.writeUInt8(payload.thdi_alarm.info.type);
		if (payload.thdi_alarm.info.type == 0x00) {
		}
		if (payload.thdi_alarm.info.type == 0x12) {
			if (payload.thdi_alarm.info.over_range_alarm_deactivation.thdi === 'error') {
				buffer.writeBytes(error_value_map.thdi);
			} else {
				buffer.writeUInt16LE(payload.thdi_alarm.info.over_range_alarm_deactivation.thdi * 100);
			}
		}
		if (payload.thdi_alarm.info.type == 0x13) {
			if (payload.thdi_alarm.info.over_range_alarm_trigger.thdi === 'error') {
				buffer.writeBytes(error_value_map.thdi);
			} else {
				buffer.writeUInt16LE(payload.thdi_alarm.info.over_range_alarm_trigger.thdi * 100);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x34
	if ('thdv_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x34);
		if (payload.thdv_alarm.channel < 0 || payload.thdv_alarm.channel > 11) {
			throw new Error('thdv_alarm.channel must be between 0 and 11');
		}
		buffer.writeUInt8(payload.thdv_alarm.channel);
		buffer.writeUInt8(payload.thdv_alarm.info.type);
		if (payload.thdv_alarm.info.type == 0x00) {
		}
		if (payload.thdv_alarm.info.type == 0x12) {
			if (payload.thdv_alarm.info.over_range_alarm_deactivation.thdv === 'error') {
				buffer.writeBytes(error_value_map.thdv);
			} else {
				buffer.writeUInt16LE(payload.thdv_alarm.info.over_range_alarm_deactivation.thdv * 100);
			}
		}
		if (payload.thdv_alarm.info.type == 0x13) {
			if (payload.thdv_alarm.info.over_range_alarm_trigger.thdv === 'error') {
				buffer.writeBytes(error_value_map.thdv);
			} else {
				buffer.writeUInt16LE(payload.thdv_alarm.info.over_range_alarm_trigger.thdv * 100);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x35
	if ('voltage_unbalance_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x35);
		buffer.writeUInt8(payload.voltage_unbalance_alarm.type);
		if (payload.voltage_unbalance_alarm.type == 0x00) {
		}
		if (payload.voltage_unbalance_alarm.type == 0x12) {
			if (payload.voltage_unbalance_alarm.over_range_alarm_deactivation.voltage_unbalance === 'error') {
				buffer.writeBytes(error_value_map.voltage_three_phase_imbalcance);
			} else {
				buffer.writeUInt16LE(payload.voltage_unbalance_alarm.over_range_alarm_deactivation.voltage_unbalance * 100);
			}
		}
		if (payload.voltage_unbalance_alarm.type == 0x13) {
			if (payload.voltage_unbalance_alarm.over_range_alarm_trigger.voltage_unbalance === 'error') {
				buffer.writeBytes(error_value_map.voltage_three_phase_imbalcance);
			} else {
				buffer.writeUInt16LE(payload.voltage_unbalance_alarm.over_range_alarm_trigger.voltage_unbalance * 100);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x36
	if ('power_loss_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x36);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x60
	if ('collection_interval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x60);
		// 0：second, 1：min
		buffer.writeUInt8(payload.collection_interval.unit);
		if (payload.collection_interval.unit == 0x00) {
			if (payload.collection_interval.seconds_of_time < 10 || payload.collection_interval.seconds_of_time > 64800) {
				throw new Error('collection_interval.seconds_of_time must be between 10 and 64800');
			}
			buffer.writeUInt16LE(payload.collection_interval.seconds_of_time);
		}
		if (payload.collection_interval.unit == 0x01) {
			if (payload.collection_interval.minutes_of_time < 1 || payload.collection_interval.minutes_of_time > 1440) {
				throw new Error('collection_interval.minutes_of_time must be between 1 and 1440');
			}
			buffer.writeUInt16LE(payload.collection_interval.minutes_of_time);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x61
	if ('reporting_interval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x61);
		// 0：second, 1：min
		buffer.writeUInt8(payload.reporting_interval.unit);
		if (payload.reporting_interval.unit == 0x00) {
			if (payload.reporting_interval.seconds_of_time < 10 || payload.reporting_interval.seconds_of_time > 64800) {
				throw new Error('reporting_interval.seconds_of_time must be between 10 and 64800');
			}
			buffer.writeUInt16LE(payload.reporting_interval.seconds_of_time);
		}
		if (payload.reporting_interval.unit == 0x01) {
			if (payload.reporting_interval.minutes_of_time < 1 || payload.reporting_interval.minutes_of_time > 1440) {
				throw new Error('reporting_interval.minutes_of_time must be between 1 and 1440');
			}
			buffer.writeUInt16LE(payload.reporting_interval.minutes_of_time);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xc8
	if ('device_status' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xc8);
		// 0：Power Off, 1：Power On
		buffer.writeUInt8(payload.device_status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x63
	if ('temperature_unit' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x63);
		// 0：℃, 1：℉
		buffer.writeUInt8(payload.temperature_unit);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x64
	if ('bluetooth_name' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x64);
		if (payload.bluetooth_name.length < 1 || payload.bluetooth_name.length > 255) {
			throw new Error('bluetooth_name.length must be between 1 and 255');
		}
		buffer.writeUInt8(payload.bluetooth_name.length);
		buffer.writeString(payload.bluetooth_name.content, payload.bluetooth_name.length, true);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x65
	if ('ble_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x65);
		// 0:disable, 1:enable
		buffer.writeUInt8(payload.ble_enable);
		// 0:disable, 1:enable
		buffer.writeUInt8(payload.ble_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xc5
	if ('data_storage_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.data_storage_settings.enable)) {
			buffer.writeUInt8(0xc5);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x00);
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.data_storage_settings.enable);
		}
		if (isValid(payload.data_storage_settings.retransmission_enable)) {
			buffer.writeUInt8(0xc5);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x01);
			// 0：disable, 1：enable
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
	//0x66
	if ('voltage_interface' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x66);
		// 0：four_wire, 1：three_wire
		buffer.writeUInt8(payload.voltage_interface);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x67
	if ('current_interface1' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x67);
		// 0：one_phase, 1：three_phase
		buffer.writeUInt8(payload.current_interface1.type);
		for (var i = 0; i < payload.current_interface1.config.length; i++) {
			var config_item = payload.current_interface1.config[i];
			// 0：forward, 1：reserse
			buffer.writeUInt8(config_item.direction);
			buffer.writeUInt16LE(config_item.range);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x68
	if ('current_interface2' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x68);
		// 0：one_phase, 1：three_phase
		buffer.writeUInt8(payload.current_interface2.type);
		for (var i = 0; i < payload.current_interface2.config.length; i++) {
			var config_item = payload.current_interface2.config[i];
			// 0：forward, 1：reserse
			buffer.writeUInt8(config_item.direction);
			buffer.writeUInt16LE(config_item.range);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x69
	if ('current_interface3' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x69);
		// 0：one_phase, 1：three_phase
		buffer.writeUInt8(payload.current_interface3.type);
		for (var i = 0; i < payload.current_interface3.config.length; i++) {
			var config_item = payload.current_interface3.config[i];
			// 0：forward, 1：reserse
			buffer.writeUInt8(config_item.direction);
			buffer.writeUInt16LE(config_item.range);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6a
	if ('current_interface4' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6a);
		// 0：one_phase, 1：three_phase
		buffer.writeUInt8(payload.current_interface4.type);
		for (var i = 0; i < payload.current_interface4.config.length; i++) {
			var config_item = payload.current_interface4.config[i];
			// 0：forward, 1：reserse
			buffer.writeUInt8(config_item.direction);
			buffer.writeUInt16LE(config_item.range);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6b
	if ('temperature_calibration_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6b);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.temperature_calibration_settings.enable);
		if (payload.temperature_calibration_settings.calibration_value < -80 || payload.temperature_calibration_settings.calibration_value > 80) {
			throw new Error('temperature_calibration_settings.calibration_value must be between -80 and 80');
		}
		buffer.writeInt16LE(payload.temperature_calibration_settings.calibration_value * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xc7
	if ('time_zone' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xc7);
		buffer.writeInt16LE(payload.time_zone);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xc6
	if ('daylight_saving_time' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xc6);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.daylight_saving_time.enable);
		if (payload.daylight_saving_time.daylight_saving_time_offset < 0 || payload.daylight_saving_time.daylight_saving_time_offset > 120) {
			throw new Error('daylight_saving_time.daylight_saving_time_offset must be between 0 and 120');
		}
		buffer.writeUInt8(payload.daylight_saving_time.daylight_saving_time_offset);
		// 1:Jan., 2:Feb., 3:Mar., 4:Apr., 5:May, 6:Jun., 7:Jul., 8:Aug., 9:Sep., 10:Oct., 11:Nov., 12:Dec.
		buffer.writeUInt8(payload.daylight_saving_time.start_month);
		var bitOptions = 0;
		// 1:1st, 2: 2nd, 3: 3rd, 4: 4th, 5: last
		bitOptions |= payload.daylight_saving_time.start_week_num << 4;

		// 1：Mon., 2：Tues., 3：Wed., 4：Thurs., 5：Fri., 6：Sat., 7：Sun.
		bitOptions |= payload.daylight_saving_time.start_week_day << 0;
		buffer.writeUInt8(bitOptions);

		buffer.writeUInt16LE(payload.daylight_saving_time.start_hour_min);
		// 1:Jan., 2:Feb., 3:Mar., 4:Apr., 5:May, 6:Jun., 7:Jul., 8:Aug., 9:Sep., 10:Oct., 11:Nov., 12:Dec.
		buffer.writeUInt8(payload.daylight_saving_time.end_month);
		var bitOptions = 0;
		// 1:1st, 2: 2nd, 3: 3rd, 4: 4th, 5: last
		bitOptions |= payload.daylight_saving_time.end_week_num << 4;

		// 1：Mon., 2：Tues., 3：Wed., 4：Thurs., 5：Fri., 6：Sat., 7：Sun.
		bitOptions |= payload.daylight_saving_time.end_week_day << 0;
		buffer.writeUInt8(bitOptions);

		buffer.writeUInt16LE(payload.daylight_saving_time.end_hour_min);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x76
	if ('temperature_alarm_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x76);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.temperature_alarm_settings.enable);
		// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A≤x≤B, 4:condition: x<A or x>B
		buffer.writeUInt8(payload.temperature_alarm_settings.threshold_condition);
		if (payload.temperature_alarm_settings.threshold_min < -20 || payload.temperature_alarm_settings.threshold_min > 60) {
			throw new Error('temperature_alarm_settings.threshold_min must be between -20 and 60');
		}
		buffer.writeInt16LE(payload.temperature_alarm_settings.threshold_min * 100);
		if (payload.temperature_alarm_settings.threshold_max < -20 || payload.temperature_alarm_settings.threshold_max > 60) {
			throw new Error('temperature_alarm_settings.threshold_max must be between -20 and 60');
		}
		buffer.writeInt16LE(payload.temperature_alarm_settings.threshold_max * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x77
	if ('current_alarm_settings' in payload) {
		var buffer = new Buffer();
		for (var current_alarm_settings_id = 0; current_alarm_settings_id < (payload.current_alarm_settings && payload.current_alarm_settings.length); current_alarm_settings_id++) {
			var current_alarm_settings_item = payload.current_alarm_settings[current_alarm_settings_id];
			var current_alarm_settings_item_id = current_alarm_settings_item.channel;
			buffer.writeUInt8(0x77);
			buffer.writeUInt8(current_alarm_settings_item_id);
			// 0：disable, 1：enable
			buffer.writeUInt8(current_alarm_settings_item.enable);
			// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A≤x≤B, 4:condition: x<A or x>B
			buffer.writeUInt8(current_alarm_settings_item.threshold_condition);
			if (current_alarm_settings_item.threshold_min < 0 || current_alarm_settings_item.threshold_min > 4000) {
				throw new Error('threshold_min must be between 0 and 4000');
			}
			buffer.writeInt16LE(current_alarm_settings_item.threshold_min);
			if (current_alarm_settings_item.threshold_max < 0 || current_alarm_settings_item.threshold_max > 4000) {
				throw new Error('threshold_max must be between 0 and 4000');
			}
			buffer.writeInt16LE(current_alarm_settings_item.threshold_max);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x78
	if ('voltage_alarm_settings' in payload) {
		var buffer = new Buffer();
		for (var voltage_alarm_settings_id = 0; voltage_alarm_settings_id < (payload.voltage_alarm_settings && payload.voltage_alarm_settings.length); voltage_alarm_settings_id++) {
			var voltage_alarm_settings_item = payload.voltage_alarm_settings[voltage_alarm_settings_id];
			var voltage_alarm_settings_item_id = voltage_alarm_settings_item.channel;
			buffer.writeUInt8(0x78);
			buffer.writeUInt8(voltage_alarm_settings_item_id);
			// 0：disable, 1：enable
			buffer.writeUInt8(voltage_alarm_settings_item.enable);
			// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A≤x≤B, 4:condition: x<A or x>B
			buffer.writeUInt8(voltage_alarm_settings_item.threshold_condition);
			if (voltage_alarm_settings_item.threshold_min < 0 || voltage_alarm_settings_item.threshold_min > 500) {
				throw new Error('threshold_min must be between 0 and 500');
			}
			buffer.writeInt16LE(voltage_alarm_settings_item.threshold_min);
			if (voltage_alarm_settings_item.threshold_max < 0 || voltage_alarm_settings_item.threshold_max > 500) {
				throw new Error('threshold_max must be between 0 and 500');
			}
			buffer.writeInt16LE(voltage_alarm_settings_item.threshold_max);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x79
	if ('thdi_alarm_settings' in payload) {
		var buffer = new Buffer();
		for (var thdi_alarm_settings_id = 0; thdi_alarm_settings_id < (payload.thdi_alarm_settings && payload.thdi_alarm_settings.length); thdi_alarm_settings_id++) {
			var thdi_alarm_settings_item = payload.thdi_alarm_settings[thdi_alarm_settings_id];
			var thdi_alarm_settings_item_id = thdi_alarm_settings_item.channel;
			buffer.writeUInt8(0x79);
			buffer.writeUInt8(thdi_alarm_settings_item_id);
			// 0：disable, 1：enable
			buffer.writeUInt8(thdi_alarm_settings_item.enable);
			// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A≤x≤B, 4:condition: x<A or x>B
			buffer.writeUInt8(thdi_alarm_settings_item.threshold_condition);
			if (thdi_alarm_settings_item.threshold_min < 0 || thdi_alarm_settings_item.threshold_min > 100) {
				throw new Error('threshold_min must be between 0 and 100');
			}
			buffer.writeInt16LE(thdi_alarm_settings_item.threshold_min);
			if (thdi_alarm_settings_item.threshold_max < 0 || thdi_alarm_settings_item.threshold_max > 100) {
				throw new Error('threshold_max must be between 0 and 100');
			}
			buffer.writeInt16LE(thdi_alarm_settings_item.threshold_max);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x7a
	if ('thdv_alarm_settings' in payload) {
		var buffer = new Buffer();
		for (var thdv_alarm_settings_id = 0; thdv_alarm_settings_id < (payload.thdv_alarm_settings && payload.thdv_alarm_settings.length); thdv_alarm_settings_id++) {
			var thdv_alarm_settings_item = payload.thdv_alarm_settings[thdv_alarm_settings_id];
			var thdv_alarm_settings_item_id = thdv_alarm_settings_item.channel;
			buffer.writeUInt8(0x7a);
			buffer.writeUInt8(thdv_alarm_settings_item_id);
			// 0：disable, 1：enable
			buffer.writeUInt8(thdv_alarm_settings_item.enable);
			// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A≤x≤B, 4:condition: x<A or x>B
			buffer.writeUInt8(thdv_alarm_settings_item.threshold_condition);
			if (thdv_alarm_settings_item.threshold_min < 0 || thdv_alarm_settings_item.threshold_min > 100) {
				throw new Error('threshold_min must be between 0 and 100');
			}
			buffer.writeInt16LE(thdv_alarm_settings_item.threshold_min);
			if (thdv_alarm_settings_item.threshold_max < 0 || thdv_alarm_settings_item.threshold_max > 100) {
				throw new Error('threshold_max must be between 0 and 100');
			}
			buffer.writeInt16LE(thdv_alarm_settings_item.threshold_max);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x7b
	if ('voltage_unbalance_alarm_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x7b);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.voltage_unbalance_alarm_settings.enable);
		// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A≤x≤B, 4:condition: x<A or x>B
		buffer.writeUInt8(payload.voltage_unbalance_alarm_settings.threshold_condition);
		if (payload.voltage_unbalance_alarm_settings.threshold_min < 0 || payload.voltage_unbalance_alarm_settings.threshold_min > 100) {
			throw new Error('voltage_unbalance_alarm_settings.threshold_min must be between 0 and 100');
		}
		buffer.writeInt16LE(payload.voltage_unbalance_alarm_settings.threshold_min);
		if (payload.voltage_unbalance_alarm_settings.threshold_max < 0 || payload.voltage_unbalance_alarm_settings.threshold_max > 100) {
			throw new Error('voltage_unbalance_alarm_settings.threshold_max must be between 0 and 100');
		}
		buffer.writeInt16LE(payload.voltage_unbalance_alarm_settings.threshold_max);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x7c
	if ('alarm_global_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x7c);
		if (payload.alarm_global_settings.interval < 1 || payload.alarm_global_settings.interval > 1440) {
			throw new Error('alarm_global_settings.interval must be between 1 and 1440');
		}
		buffer.writeUInt16LE(payload.alarm_global_settings.interval);
		if (payload.alarm_global_settings.times < 1 || payload.alarm_global_settings.times > 100) {
			throw new Error('alarm_global_settings.times must be between 1 and 100');
		}
		buffer.writeUInt16LE(payload.alarm_global_settings.times);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.alarm_global_settings.release_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6d
	if ('month_statistics_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6d);
		if (payload.month_statistics_settings.day < 1 || payload.month_statistics_settings.day > 28) {
			throw new Error('month_statistics_settings.day must be between 1 and 28');
		}
		buffer.writeUInt8(payload.month_statistics_settings.day);
		if (payload.month_statistics_settings.hour < 0 || payload.month_statistics_settings.hour > 23) {
			throw new Error('month_statistics_settings.hour must be between 0 and 23');
		}
		buffer.writeUInt8(payload.month_statistics_settings.hour);
		if (payload.month_statistics_settings.minute < 0 || payload.month_statistics_settings.minute > 59) {
			throw new Error('month_statistics_settings.minute must be between 0 and 59');
		}
		buffer.writeUInt8(payload.month_statistics_settings.minute);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6c
	if ('report_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6c);
		var bitOptions = 0;
		bitOptions |= payload.report_enable.temperature << 0;

		bitOptions |= payload.report_enable.current << 1;

		bitOptions |= payload.report_enable.voltage << 2;

		bitOptions |= payload.report_enable.power_factor << 3;

		bitOptions |= payload.report_enable.active_power << 4;

		bitOptions |= payload.report_enable.reactive_power << 5;

		bitOptions |= payload.report_enable.apparent_power << 6;

		bitOptions |= payload.report_enable.forward_active_energy << 7;

		bitOptions |= payload.report_enable.reverse_active_energy << 8;

		bitOptions |= payload.report_enable.forward_reactive_energy << 9;

		bitOptions |= payload.report_enable.reverse_reactive_energy << 10;

		bitOptions |= payload.report_enable.apparent_energy << 11;

		bitOptions |= payload.report_enable.thdi << 12;

		bitOptions |= payload.report_enable.thdv << 13;

		bitOptions |= payload.report_enable.voltage_unbalance << 14;
		buffer.writeUInt16LE(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0xbf
	if ('reset' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xbf);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xbe
	if ('reboot' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xbe);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x5d
	if ('stop_historical_data_retrieval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x5d);
		// 0：alarm data, 1：period data, 2：month energy data, 3：month min_max data
		buffer.writeUInt8(payload.stop_historical_data_retrieval.type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x5b
	if ('retrieve_historical_data_by_time' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x5b);
		// 0：alarm data, 1：period data, 2：month energy data, 3：month min_max data
		buffer.writeUInt8(payload.retrieve_historical_data_by_time.type);
		buffer.writeUInt32LE(payload.retrieve_historical_data_by_time.time);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x5c
	if ('retrieve_historical_data_by_time_range' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x5c);
		// 0：alarm data, 1：period data, 2：month energy data, 3：month min_max data
		buffer.writeUInt8(payload.retrieve_historical_data_by_time_range.type);
		buffer.writeUInt32LE(payload.retrieve_historical_data_by_time_range.start_time);
		buffer.writeUInt32LE(payload.retrieve_historical_data_by_time_range.end_time);
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
	//0xb7
	if ('set_time' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb7);
		buffer.writeUInt32LE(payload.set_time.timestamp);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xb6
	if ('reconnect' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb6);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x5f
	if ('reset_energy' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x5f);
		buffer.writeUInt8(payload.reset_energy.channel);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x5e
	if ('clear_data' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x5e);
		// 0：alarm data, 1：period data, 2：month energy data, 3：month min_max data
		buffer.writeUInt8(payload.clear_data.type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x57
	if ('query_history_set' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x57);
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


function cmdMap() {
	return {
		  "request_check_sequence_number": "ff",
		  "request_check_order": "fe",
		  "request_command_queries": "ef",
		  "request_query_all_configurations": "ee",
		  "historical_data_report": "ed",
		  "lorawan_configuration_settings": "cf",
		  "lorawan_configuration_settings.version": "cfd8",
		  "tsl_version": "df",
		  "product_name": "de",
		  "product_pn": "dd",
		  "product_sn": "db",
		  "version": "da",
		  "oem_id": "d9",
		  "product_frequency_band": "d8",
		  "device_info": "d7",
		  "temperature": "01",
		  "voltage_three_phase_imbalcance": "02",
		  "thdi": "03",
		  "thdi._item": "03xx",
		  "thdv": "04",
		  "thdv._item": "04xx",
		  "current": "05",
		  "current._item": "05xx",
		  "voltage": "06",
		  "voltage._item": "06xx",
		  "power_factor": "07",
		  "active_power1": "08",
		  "active_power2": "09",
		  "reactive_power1": "0a",
		  "reactive_power2": "0b",
		  "apparent_power1": "0c",
		  "apparent_power2": "0d",
		  "forward_active_energy1": "0e",
		  "forward_active_energy2": "0f",
		  "reverse_active_energy1": "10",
		  "reverse_active_energy2": "11",
		  "forward_reactive_energy1": "12",
		  "forward_reactive_energy2": "13",
		  "reverse_reactive_energy1": "14",
		  "reverse_reactive_energy2": "15",
		  "apparent_energy1": "16",
		  "apparent_energy2": "17",
		  "history_type": "40",
		  "temperature_alarm": "30",
		  "current_alarm": "31",
		  "voltage_alarm": "32",
		  "thdi_alarm": "33",
		  "thdv_alarm": "34",
		  "voltage_unbalance_alarm": "35",
		  "power_loss_alarm": "36",
		  "collection_interval": "60",
		  "reporting_interval": "61",
		  "device_status": "c8",
		  "temperature_unit": "63",
		  "bluetooth_name": "64",
		  "ble_enable": "65",
		  "data_storage_settings": "c5",
		  "data_storage_settings.enable": "c500",
		  "data_storage_settings.retransmission_enable": "c501",
		  "data_storage_settings.retransmission_interval": "c502",
		  "data_storage_settings.retrieval_interval": "c503",
		  "voltage_interface": "66",
		  "current_interface1": "67",
		  "current_interface1.config._item": "undefinedxx",
		  "current_interface2": "68",
		  "current_interface2.config._item": "undefinedxx",
		  "current_interface3": "69",
		  "current_interface3.config._item": "undefinedxx",
		  "current_interface4": "6a",
		  "current_interface4.config._item": "undefinedxx",
		  "temperature_calibration_settings": "6b",
		  "time_zone": "c7",
		  "daylight_saving_time": "c6",
		  "temperature_alarm_settings": "76",
		  "current_alarm_settings": "77",
		  "current_alarm_settings._item": "77xx",
		  "voltage_alarm_settings": "78",
		  "voltage_alarm_settings._item": "78xx",
		  "thdi_alarm_settings": "79",
		  "thdi_alarm_settings._item": "79xx",
		  "thdv_alarm_settings": "7a",
		  "thdv_alarm_settings._item": "7axx",
		  "voltage_unbalance_alarm_settings": "7b",
		  "alarm_global_settings": "7c",
		  "month_statistics_settings": "6d",
		  "report_enable": "6c",
		  "reset": "bf",
		  "reboot": "be",
		  "stop_historical_data_retrieval": "5d",
		  "retrieve_historical_data_by_time": "5b",
		  "retrieve_historical_data_by_time_range": "5c",
		  "query_device_status": "b9",
		  "synchronize_time": "b8",
		  "set_time": "b7",
		  "reconnect": "b6",
		  "reset_energy": "5f",
		  "clear_data": "5e",
		  "query_history_set": "57"
	};
}