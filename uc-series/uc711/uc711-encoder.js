/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product UC711
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
	if ('all_configurations_request_by_device' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xee);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xcf
	if ('lorawan_configuration_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.lorawan_configuration_settings.mode)) {
			buffer.writeUInt8(0xcf);
			// 0:ClassA, 1:ClassB, 2:ClassC, 3:ClassC to B
			buffer.writeUInt8(0x00);
			// 0:ClassA, 1:ClassB, 2:ClassC, 3:ClassC to B
			buffer.writeUInt8(payload.lorawan_configuration_settings.mode);
		}
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
	//0x06
	if ('temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x06);
		if (payload.temperature < -20 || payload.temperature > 60) {
			throw new Error('temperature must be between -20 and 60');
		}
		buffer.writeInt16LE(payload.temperature * 100);
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
	//0x0c
	if ('temperature_control_info' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0c);
		var bitOptions = 0;
		// 0：heat, 2：cool, 3：auto, 15：na
		bitOptions |= payload.temperature_control_info.mode << 4;

		// 0：standby, 1：stage-1 heat, 2：stage-2 heat, 3：stage-3 heat, 4：stage-4 heat, 5：em heat, 6：stage-1 cool, 7：stage-2 cool, 8：stage-5 heat
		bitOptions |= payload.temperature_control_info.status << 0;
		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0d
	if ('fan_control_info' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0d);
		var bitOptions = 0;
		// 0：auto, 1：circulate, 2：on, 3：low, 4：medium, 5：high, 15：na
		bitOptions |= payload.fan_control_info.mode << 4;

		// 0：off, 1：open, 2：low, 3:medium, 4:high
		bitOptions |= payload.fan_control_info.status << 0;
		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0e
	if ('execution_plan_id' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0e);
		if (payload.execution_plan_id < 0 || payload.execution_plan_id > 16) {
			throw new Error('execution_plan_id must be between 0 and 16');
		}
		buffer.writeUInt8(payload.execution_plan_id);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x10
	if ('target_temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x10);
		if (payload.target_temperature < 5 || payload.target_temperature > 35) {
			throw new Error('target_temperature must be between 5 and 35');
		}
		buffer.writeInt16LE(payload.target_temperature * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xc4
	if ('auto_p_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xc4);
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
			// 0：Disable, 1：Enable
			buffer.writeUInt8(payload.data_storage_settings.enable);
		}
		if (isValid(payload.data_storage_settings.retransmission_enable)) {
			buffer.writeUInt8(0xc5);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(0x01);
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
	//0xd4
	if ('bluetooth_config' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.bluetooth_config.bluetooth_name)) {
			buffer.writeUInt8(0xd4);
			buffer.writeUInt8(0x01);
			if (payload.bluetooth_config.bluetooth_name.length < 1 || payload.bluetooth_config.bluetooth_name.length > 255) {
				throw new Error('bluetooth_config.bluetooth_name.length must be between 1 and 255');
			}
			buffer.writeUInt8(payload.bluetooth_config.bluetooth_name.length);
			buffer.writeString(payload.bluetooth_config.bluetooth_name.content, payload.bluetooth_config.bluetooth_name.length, true);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x60
	if ('temperature_control_mode' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.temperature_control_mode.ctrl_mode)) {
			buffer.writeUInt8(0x60);
			// 0：heat, 2：cool, 3：auto
			buffer.writeUInt8(0x00);
			// 0：heat, 2：cool, 3：auto
			buffer.writeUInt8(payload.temperature_control_mode.ctrl_mode);
		}
		if (isValid(payload.temperature_control_mode.plan_enable)) {
			buffer.writeUInt8(0x60);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x01);
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
			if (payload.target_temperature_settings.heat < 5 || payload.target_temperature_settings.heat > 35) {
				throw new Error('target_temperature_settings.heat must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.target_temperature_settings.heat * 100);
		}
		if (isValid(payload.target_temperature_settings.cool)) {
			buffer.writeUInt8(0x61);
			buffer.writeUInt8(0x02);
			if (payload.target_temperature_settings.cool < 5 || payload.target_temperature_settings.cool > 35) {
				throw new Error('target_temperature_settings.cool must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.target_temperature_settings.cool * 100);
		}
		if (isValid(payload.target_temperature_settings.auto)) {
			buffer.writeUInt8(0x61);
			buffer.writeUInt8(0x03);
			if (payload.target_temperature_settings.auto < 5 || payload.target_temperature_settings.auto > 35) {
				throw new Error('target_temperature_settings.auto must be between 5 and 35');
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
		if (isValid(payload.target_temperature_tolerance.ctrl_value)) {
			buffer.writeUInt8(0x62);
			buffer.writeUInt8(0x01);
			if (payload.target_temperature_tolerance.ctrl_value < 0.1 || payload.target_temperature_tolerance.ctrl_value > 5) {
				throw new Error('target_temperature_tolerance.ctrl_value must be between 0.1 and 5');
			}
			buffer.writeInt16LE(payload.target_temperature_tolerance.ctrl_value * 100);
		}
		if (isValid(payload.target_temperature_tolerance.heat_value)) {
			buffer.writeUInt8(0x62);
			buffer.writeUInt8(0x02);
			if (payload.target_temperature_tolerance.heat_value < 0.1 || payload.target_temperature_tolerance.heat_value > 5) {
				throw new Error('target_temperature_tolerance.heat_value must be between 0.1 and 5');
			}
			buffer.writeInt16LE(payload.target_temperature_tolerance.heat_value * 100);
		}
		if (isValid(payload.target_temperature_tolerance.cool_value)) {
			buffer.writeUInt8(0x62);
			buffer.writeUInt8(0x03);
			if (payload.target_temperature_tolerance.cool_value < 0.1 || payload.target_temperature_tolerance.cool_value > 5) {
				throw new Error('target_temperature_tolerance.cool_value must be between 0.1 and 5');
			}
			buffer.writeInt16LE(payload.target_temperature_tolerance.cool_value * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x63
	if ('target_temperature_range' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.target_temperature_range.heat)) {
			buffer.writeUInt8(0x63);
			buffer.writeUInt8(0x00);
			if (payload.target_temperature_range.heat.min < 5 || payload.target_temperature_range.heat.min > 35) {
				throw new Error('target_temperature_range.heat.min must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.target_temperature_range.heat.min * 100);
			if (payload.target_temperature_range.heat.max < 5 || payload.target_temperature_range.heat.max > 35) {
				throw new Error('target_temperature_range.heat.max must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.target_temperature_range.heat.max * 100);
		}
		if (isValid(payload.target_temperature_range.cool)) {
			buffer.writeUInt8(0x63);
			buffer.writeUInt8(0x02);
			if (payload.target_temperature_range.cool.min < 5 || payload.target_temperature_range.cool.min > 35) {
				throw new Error('target_temperature_range.cool.min must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.target_temperature_range.cool.min * 100);
			if (payload.target_temperature_range.cool.max < 5 || payload.target_temperature_range.cool.max > 35) {
				throw new Error('target_temperature_range.cool.max must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.target_temperature_range.cool.max * 100);
		}
		if (isValid(payload.target_temperature_range.auto)) {
			buffer.writeUInt8(0x63);
			buffer.writeUInt8(0x03);
			if (payload.target_temperature_range.auto.min < 5 || payload.target_temperature_range.auto.min > 35) {
				throw new Error('target_temperature_range.auto.min must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.target_temperature_range.auto.min * 100);
			if (payload.target_temperature_range.auto.max < 5 || payload.target_temperature_range.auto.max > 35) {
				throw new Error('target_temperature_range.auto.max must be between 5 and 35');
			}
			buffer.writeInt16LE(payload.target_temperature_range.auto.max * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x64
	if ('temperature_unit' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x64);
		// 0：℃, 1：℉
		buffer.writeUInt8(payload.temperature_unit);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x65
	if ('target_temperature_resolution' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x65);
		// 0：0.5, 1：1
		buffer.writeUInt8(payload.target_temperature_resolution);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x91
	if ('communication_mode' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x91);
		// 0：BLE+Lorawan, 1：POWERBUS+Lorawan
		buffer.writeUInt8(payload.communication_mode);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x66
	if ('reporting_interval' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.reporting_interval.ble_lora)) {
			buffer.writeUInt8(0x66);
			buffer.writeUInt8(0x00);
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
		if (isValid(payload.reporting_interval.power_lora)) {
			buffer.writeUInt8(0x66);
			buffer.writeUInt8(0x01);
			// 0：second, 1：min
			buffer.writeUInt8(payload.reporting_interval.power_lora.unit);
			if (payload.reporting_interval.power_lora.unit == 0x00) {
				if (payload.reporting_interval.power_lora.seconds_of_time < 60 || payload.reporting_interval.power_lora.seconds_of_time > 64800) {
					throw new Error('reporting_interval.power_lora.seconds_of_time must be between 60 and 64800');
				}
				buffer.writeUInt16LE(payload.reporting_interval.power_lora.seconds_of_time);
			}
			if (payload.reporting_interval.power_lora.unit == 0x01) {
				if (payload.reporting_interval.power_lora.minutes_of_time < 1 || payload.reporting_interval.power_lora.minutes_of_time > 1440) {
					throw new Error('reporting_interval.power_lora.minutes_of_time must be between 1 and 1440');
				}
				buffer.writeUInt16LE(payload.reporting_interval.power_lora.minutes_of_time);
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
				// 0：Disable, 1：Enable
				buffer.writeUInt8(schedule_settings_item.enable);
			}
			if (isValid(schedule_settings_item.name1)) {
				buffer.writeUInt8(0x67);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x01);
				buffer.writeString(schedule_settings_item.name1, 6);
			}
			if (isValid(schedule_settings_item.name2)) {
				buffer.writeUInt8(0x67);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x02);
				buffer.writeString(schedule_settings_item.name2, 4);
			}
			if (isValid(schedule_settings_item.fan_mode)) {
				buffer.writeUInt8(0x67);
				buffer.writeUInt8(schedule_settings_item_id);
				// 0：Auto, 1：Always Open, 2：Ventilation, 3：Low, 4：Medium, 5：High, 255：Disabled
				buffer.writeUInt8(0x03);
				// 0：Auto, 1：Always Open, 2：Ventilation, 3：Low, 4：Medium, 5：High, 255：Disabled
				buffer.writeUInt8(schedule_settings_item.fan_mode);
			}
			if (isValid(schedule_settings_item.switch_on)) {
				buffer.writeUInt8(0x67);
				buffer.writeUInt8(schedule_settings_item_id);
				// 0：Switch Off, 1：Switch On
				buffer.writeUInt8(0x05);
				// 0：Switch Off, 1：Switch On
				buffer.writeUInt8(schedule_settings_item.switch_on);
			}
			if (isValid(schedule_settings_item.work_mode)) {
				buffer.writeUInt8(0x67);
				buffer.writeUInt8(schedule_settings_item_id);
				// 0：heat, 2：cool, 3：auto
				buffer.writeUInt8(0x06);
				// 0：heat, 2：cool, 3：auto
				buffer.writeUInt8(schedule_settings_item.work_mode);
			}
			if (isValid(schedule_settings_item.heat_target_temp)) {
				buffer.writeUInt8(0x67);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x20);
				if (schedule_settings_item.heat_target_temp < 5 || schedule_settings_item.heat_target_temp > 35) {
					throw new Error('heat_target_temp must be between 5 and 35');
				}
				buffer.writeInt16LE(schedule_settings_item.heat_target_temp * 100);
			}
			if (isValid(schedule_settings_item.cool_target_temp)) {
				buffer.writeUInt8(0x67);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x22);
				if (schedule_settings_item.cool_target_temp < 5 || schedule_settings_item.cool_target_temp > 35) {
					throw new Error('cool_target_temp must be between 5 and 35');
				}
				buffer.writeInt16LE(schedule_settings_item.cool_target_temp * 100);
			}
			if (isValid(schedule_settings_item.auto_target_temp)) {
				buffer.writeUInt8(0x67);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x23);
				if (schedule_settings_item.auto_target_temp < 5 || schedule_settings_item.auto_target_temp > 35) {
					throw new Error('auto_target_temp must be between 5 and 35');
				}
				buffer.writeInt16LE(schedule_settings_item.auto_target_temp * 100);
			}
			if (isValid(schedule_settings_item.target_temp_tolerance)) {
				buffer.writeUInt8(0x67);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x30);
				if (schedule_settings_item.target_temp_tolerance < 0.1 || schedule_settings_item.target_temp_tolerance > 5) {
					throw new Error('target_temp_tolerance must be between 0.1 and 5');
				}
				buffer.writeInt16LE(schedule_settings_item.target_temp_tolerance * 100);
			}
			if (isValid(schedule_settings_item.temp_control_tolerance)) {
				buffer.writeUInt8(0x67);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x31);
				if (schedule_settings_item.temp_control_tolerance < 0.5 || schedule_settings_item.temp_control_tolerance > 10) {
					throw new Error('temp_control_tolerance must be between 0.5 and 10');
				}
				buffer.writeInt16LE(schedule_settings_item.temp_control_tolerance * 100);
			}
			if (isValid(schedule_settings_item.heat_target_temp_tolerance)) {
				buffer.writeUInt8(0x67);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x32);
				if (schedule_settings_item.heat_target_temp_tolerance < 0.1 || schedule_settings_item.heat_target_temp_tolerance > 5) {
					throw new Error('heat_target_temp_tolerance must be between 0.1 and 5');
				}
				buffer.writeInt16LE(schedule_settings_item.heat_target_temp_tolerance * 100);
			}
			if (isValid(schedule_settings_item.cool_target_temp_tolerance)) {
				buffer.writeUInt8(0x67);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x33);
				if (schedule_settings_item.cool_target_temp_tolerance < 0.1 || schedule_settings_item.cool_target_temp_tolerance > 5) {
					throw new Error('cool_target_temp_tolerance must be between 0.1 and 5');
				}
				buffer.writeInt16LE(schedule_settings_item.cool_target_temp_tolerance * 100);
			}
			for (var cycle_settings_id = 0; cycle_settings_id < (schedule_settings_item.cycle_settings && schedule_settings_item.cycle_settings.length); cycle_settings_id++) {
				var cycle_settings_item = schedule_settings_item.cycle_settings[cycle_settings_id];
				var cycle_settings_item_id = cycle_settings_item.id;
				buffer.writeUInt8(0x67);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x07);
				buffer.writeUInt8(cycle_settings_item.id);
				// 0：disable, 1：enable
				buffer.writeUInt8(cycle_settings_item.enable);
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

				// 0：delete, 1：valid
				bitOptions |= cycle_settings_item.valid << 7;
				buffer.writeUInt8(bitOptions);

			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x68
	if ('window_opening_detection_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x68);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.window_opening_detection_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x69
	if ('window_opening_detection_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x69);
		// 0：temperature, 1：door
		buffer.writeUInt8(payload.window_opening_detection_settings.type);
		if (payload.window_opening_detection_settings.type == 0x00) {
			if (isValid(payload.window_opening_detection_settings.temperature_detection.difference_in_temperature)) {
				buffer.writeUInt8(0x69);
				buffer.writeUInt8(0x00);
				if (payload.window_opening_detection_settings.temperature_detection.difference_in_temperature < 1 || payload.window_opening_detection_settings.temperature_detection.difference_in_temperature > 10) {
					throw new Error('window_opening_detection_settings.temperature_detection.difference_in_temperature must be between 1 and 10');
				}
				buffer.writeInt16LE(payload.window_opening_detection_settings.temperature_detection.difference_in_temperature * 100);
			}
			if (isValid(payload.window_opening_detection_settings.temperature_detection.stop_time)) {
				buffer.writeUInt8(0x69);
				buffer.writeUInt8(0x01);
				if (payload.window_opening_detection_settings.temperature_detection.stop_time < 1 || payload.window_opening_detection_settings.temperature_detection.stop_time > 1440) {
					throw new Error('window_opening_detection_settings.temperature_detection.stop_time must be between 1 and 1440');
				}
				buffer.writeUInt16LE(payload.window_opening_detection_settings.temperature_detection.stop_time);
			}
		}
		if (payload.window_opening_detection_settings.type == 0x01) {
			if (payload.window_opening_detection_settings.magnet_detection.duration < 1 || payload.window_opening_detection_settings.magnet_detection.duration > 60) {
				throw new Error('window_opening_detection_settings.magnet_detection.duration must be between 1 and 60');
			}
			buffer.writeUInt8(payload.window_opening_detection_settings.magnet_detection.duration);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6a
	if ('temperature_data_source' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.temperature_data_source.source)) {
			buffer.writeUInt8(0x6a);
			// 0: External Temperature Sensor, 1: Issued By Lorawan Gateway , 2: Lorawan D2D  , 3: HMI(WT401) 
			buffer.writeUInt8(0x00);
			// 0: External Temperature Sensor, 1: Issued By Lorawan Gateway , 2: Lorawan D2D  , 3: HMI(WT401) 
			buffer.writeUInt8(payload.temperature_data_source.source);
		}
		if (isValid(payload.temperature_data_source.time_out)) {
			buffer.writeUInt8(0x6a);
			buffer.writeUInt8(0x01);
			buffer.writeUInt8(payload.temperature_data_source.time_out);
		}
		if (isValid(payload.temperature_data_source.offline_mode)) {
			buffer.writeUInt8(0x6a);
			// 0: Maintain, 1: Disconnect, 2: Cut into internal
			buffer.writeUInt8(0x02);
			// 0: Maintain, 1: Disconnect, 2: Cut into internal
			buffer.writeUInt8(payload.temperature_data_source.offline_mode);
		}
		if (isValid(payload.temperature_data_source.data_sync)) {
			buffer.writeUInt8(0x6a);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x03);
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.temperature_data_source.data_sync);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6c
	if ('high_temperature_alarm_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.high_temperature_alarm_settings.enable)) {
			buffer.writeUInt8(0x6c);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(0x00);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(payload.high_temperature_alarm_settings.enable);
		}
		if (isValid(payload.high_temperature_alarm_settings.difference_in_temperature)) {
			buffer.writeUInt8(0x6c);
			buffer.writeUInt8(0x01);
			if (payload.high_temperature_alarm_settings.difference_in_temperature < 1 || payload.high_temperature_alarm_settings.difference_in_temperature > 10) {
				throw new Error('high_temperature_alarm_settings.difference_in_temperature must be between 1 and 10');
			}
			buffer.writeInt16LE(payload.high_temperature_alarm_settings.difference_in_temperature * 100);
		}
		if (isValid(payload.high_temperature_alarm_settings.duration)) {
			buffer.writeUInt8(0x6c);
			buffer.writeUInt8(0x02);
			if (payload.high_temperature_alarm_settings.duration < 0 || payload.high_temperature_alarm_settings.duration > 60) {
				throw new Error('high_temperature_alarm_settings.duration must be between 0 and 60');
			}
			buffer.writeUInt8(payload.high_temperature_alarm_settings.duration);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6d
	if ('low_temperature_alarm_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.low_temperature_alarm_settings.enable)) {
			buffer.writeUInt8(0x6d);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(0x00);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(payload.low_temperature_alarm_settings.enable);
		}
		if (isValid(payload.low_temperature_alarm_settings.difference_in_temperature)) {
			buffer.writeUInt8(0x6d);
			buffer.writeUInt8(0x01);
			if (payload.low_temperature_alarm_settings.difference_in_temperature < 1 || payload.low_temperature_alarm_settings.difference_in_temperature > 10) {
				throw new Error('low_temperature_alarm_settings.difference_in_temperature must be between 1 and 10');
			}
			buffer.writeInt16LE(payload.low_temperature_alarm_settings.difference_in_temperature * 100);
		}
		if (isValid(payload.low_temperature_alarm_settings.duration)) {
			buffer.writeUInt8(0x6d);
			buffer.writeUInt8(0x02);
			if (payload.low_temperature_alarm_settings.duration < 0 || payload.low_temperature_alarm_settings.duration > 60) {
				throw new Error('low_temperature_alarm_settings.duration must be between 0 and 60');
			}
			buffer.writeUInt8(payload.low_temperature_alarm_settings.duration);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6f
	if ('system_switch' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6f);
		// 0：Switch Off, 1：Switch On
		buffer.writeUInt8(payload.system_switch);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x70
	if ('fan_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.fan_settings.fan_mode)) {
			buffer.writeUInt8(0x70);
			// 0：Auto, 1：Always Open, 2：Ventilation, 3：Low, 4：Medium, 5：High, 255：Disabled
			buffer.writeUInt8(0x00);
			// 0：Auto, 1：Always Open, 2：Ventilation, 3：Low, 4：Medium, 5：High, 255：Disabled
			buffer.writeUInt8(payload.fan_settings.fan_mode);
		}
		if (isValid(payload.fan_settings.adjust_humidity_enable)) {
			buffer.writeUInt8(0x70);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(0x01);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(payload.fan_settings.adjust_humidity_enable);
		}
		if (isValid(payload.fan_settings.adjust_period)) {
			buffer.writeUInt8(0x70);
			buffer.writeUInt8(0x02);
			if (payload.fan_settings.adjust_period < 5 || payload.fan_settings.adjust_period > 55) {
				throw new Error('fan_settings.adjust_period must be between 5 and 55');
			}
			buffer.writeUInt8(payload.fan_settings.adjust_period);
		}
		if (isValid(payload.fan_settings.work_time)) {
			buffer.writeUInt8(0x70);
			buffer.writeUInt8(0x03);
			if (payload.fan_settings.work_time < 5 || payload.fan_settings.work_time > 55) {
				throw new Error('fan_settings.work_time must be between 5 and 55');
			}
			buffer.writeUInt8(payload.fan_settings.work_time);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x71
	if ('anti_freezing' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.anti_freezing.enable)) {
			buffer.writeUInt8(0x71);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(0x00);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(payload.anti_freezing.enable);
		}
		if (isValid(payload.anti_freezing.target_temperature)) {
			buffer.writeUInt8(0x71);
			buffer.writeUInt8(0x01);
			if (payload.anti_freezing.target_temperature < 1 || payload.anti_freezing.target_temperature > 5) {
				throw new Error('anti_freezing.target_temperature must be between 1 and 5');
			}
			buffer.writeInt16LE(payload.anti_freezing.target_temperature * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x72
	if ('dehumidify_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.dehumidify_settings.humidify_low_threshold)) {
			buffer.writeUInt8(0x72);
			buffer.writeUInt8(0x02);
			if (payload.dehumidify_settings.humidify_low_threshold < 0 || payload.dehumidify_settings.humidify_low_threshold > 100) {
				throw new Error('dehumidify_settings.humidify_low_threshold must be between 0 and 100');
			}
			buffer.writeInt16LE(payload.dehumidify_settings.humidify_low_threshold * 10);
		}
		if (isValid(payload.dehumidify_settings.humidify_high_threshold)) {
			buffer.writeUInt8(0x72);
			buffer.writeUInt8(0x03);
			if (payload.dehumidify_settings.humidify_high_threshold < 0 || payload.dehumidify_settings.humidify_high_threshold > 100) {
				throw new Error('dehumidify_settings.humidify_high_threshold must be between 0 and 100');
			}
			buffer.writeInt16LE(payload.dehumidify_settings.humidify_high_threshold * 10);
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
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x74
	if ('system_protect' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.system_protect.enable)) {
			buffer.writeUInt8(0x74);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(0x00);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(payload.system_protect.enable);
		}
		if (isValid(payload.system_protect.run_time)) {
			buffer.writeUInt8(0x74);
			buffer.writeUInt8(0x01);
			if (payload.system_protect.run_time < 1 || payload.system_protect.run_time > 60) {
				throw new Error('system_protect.run_time must be between 1 and 60');
			}
			buffer.writeUInt8(payload.system_protect.run_time);
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
	//0x76
	if ('target_temperature_mode' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x76);
		// 0：single, 1：double
		buffer.writeUInt8(payload.target_temperature_mode);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x77
	if ('unilateral_tolerance_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x77);
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.unilateral_tolerance_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x80
	if ('relay_change_report_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x80);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.relay_change_report_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x82
	if ('fan_delay_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.fan_delay_settings.enable)) {
			buffer.writeUInt8(0x82);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(0x00);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(payload.fan_delay_settings.enable);
		}
		if (isValid(payload.fan_delay_settings.delay_time)) {
			buffer.writeUInt8(0x82);
			buffer.writeUInt8(0x01);
			if (payload.fan_delay_settings.delay_time < 1 || payload.fan_delay_settings.delay_time > 3600) {
				throw new Error('fan_delay_settings.delay_time must be between 1 and 3600');
			}
			buffer.writeUInt16LE(payload.fan_delay_settings.delay_time);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x86
	if ('di_settings_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x86);
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.di_settings_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x87
	if ('di_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x87);
		// 0：card, 1：door
		buffer.writeUInt8(payload.di_settings.object);
		if (payload.di_settings.object == 0x00) {
			// 0：system_ctrl, 1：insert_sche
			buffer.writeUInt8(payload.di_settings.card_control.type);
			if (payload.di_settings.card_control.type == 0x00) {
				// 0：system close, 1：system open
				buffer.writeUInt8(payload.di_settings.card_control.system_control.trigger_by_insertion);
			}
			if (payload.di_settings.card_control.type == 0x01) {
				// 0：Insert Schedule1, 1：Insert Schedule2, 2：Insert Schedule3, 3：Insert Schedule4, 4：Insert Schedule5, 5：Insert Schedule6, 6：Insert Schedule7, 7：Insert Schedule8, 8：Insert Schedule9, 9：Insert Schedule10, 10：Insert Schedule11, 11：Insert Schedule12, 12：Insert Schedule13, 13：Insert Schedule14, 14：Insert Schedule15, 15：Insert Schedule16
				buffer.writeUInt8(payload.di_settings.card_control.insertion_plan.trigger_by_insertion);
				// 0：Insert Schedule1, 1：Insert Schedule2, 2：Insert Schedule3, 3：Insert Schedule4, 4：Insert Schedule5, 5：Insert Schedule6, 6：Insert Schedule7, 7：Insert Schedule8, 8：Insert Schedule9, 9：Insert Schedule10, 10：Insert Schedule11, 11：Insert Schedule12, 12：Insert Schedule13, 13：Insert Schedule14, 14：Insert Schedule15, 15：Insert Schedule16
				buffer.writeUInt8(payload.di_settings.card_control.insertion_plan.trigger_by_extraction);
			}
		}
		if (payload.di_settings.object == 0x01) {
			// 0：normally closed, 1：normally open
			buffer.writeUInt8(payload.di_settings.magnet_detection.magnet_type);
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
	if ('install_configuration' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.install_configuration.wire)) {
			buffer.writeUInt8(0x8e);
			buffer.writeUInt8(0x00);
			var bitOptions = 0;
			// 0：disable, 1：enable
			bitOptions |= payload.install_configuration.wire.y1_connected << 0;

			// 0：disable, 1：enable
			bitOptions |= payload.install_configuration.wire.gh_connected << 2;

			// 0：disable, 1：enable
			bitOptions |= payload.install_configuration.wire.ob_connected << 4;

			// 0：disable, 1：enable
			bitOptions |= payload.install_configuration.wire.w1_connected << 6;
			buffer.writeUInt8(bitOptions);

			var bitOptions = 0;
			// 0：disable, 1：enable
			bitOptions |= payload.install_configuration.wire.we_connected << 0;

			// 0：disable, 1：enable
			bitOptions |= payload.install_configuration.wire.di_connected << 2;

			// 0：disable, 1：enable
			bitOptions |= payload.install_configuration.wire.pek_connected << 4;

			// 0：disable, 1：w2 enable, 2：aux enable
			bitOptions |= payload.install_configuration.wire.w2_connected << 6;
			buffer.writeUInt8(bitOptions);

			var bitOptions = 0;
			// 0：disable, 1：enable
			bitOptions |= payload.install_configuration.wire.gl_connected << 0;

			// 0：disable, 1：enable
			bitOptions |= payload.install_configuration.wire.gm_connected << 2;

			// 0：disable, 1：enable
			bitOptions |= payload.install_configuration.wire.ntc_connected << 4;

			bitOptions |= payload.install_configuration.wire.reserved << 6;
			buffer.writeUInt8(bitOptions);

		}
		if (isValid(payload.install_configuration.reversing_valve)) {
			buffer.writeUInt8(0x8e);
			buffer.writeUInt8(0x01);
			// 0：o/b on cool, 1：o/b on heat 
			buffer.writeUInt8(payload.install_configuration.reversing_valve.mode);
		}
		if (isValid(payload.install_configuration.y_combine_aux)) {
			buffer.writeUInt8(0x8e);
			buffer.writeUInt8(0x02);
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.install_configuration.y_combine_aux.enable);
		}
		if (isValid(payload.install_configuration.fan)) {
			buffer.writeUInt8(0x8e);
			buffer.writeUInt8(0x03);
			// 0：thermostat, 1：hvac
			buffer.writeUInt8(payload.install_configuration.fan.owner);
		}
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
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.daylight_saving_time.enable);
		if (payload.daylight_saving_time.daylight_saving_time_offset < 1 || payload.daylight_saving_time.daylight_saving_time_offset > 120) {
			throw new Error('daylight_saving_time.daylight_saving_time_offset must be between 1 and 120');
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
	//0x95
	if ('d2d_pairing_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x95);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.d2d_pairing_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x96
	if ('d2d_pairing_settings' in payload) {
		var buffer = new Buffer();
		for (var d2d_pairing_settings_id = 0; d2d_pairing_settings_id < (payload.d2d_pairing_settings && payload.d2d_pairing_settings.length); d2d_pairing_settings_id++) {
			var d2d_pairing_settings_item = payload.d2d_pairing_settings[d2d_pairing_settings_id];
			var d2d_pairing_settings_item_id = d2d_pairing_settings_item.index;
			if (isValid(d2d_pairing_settings_item.enable)) {
				buffer.writeUInt8(0x96);
				buffer.writeUInt8(d2d_pairing_settings_item_id);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x00);
				// 0：disable, 1：enable
				buffer.writeUInt8(d2d_pairing_settings_item.enable);
			}
			if (isValid(d2d_pairing_settings_item.deveui)) {
				buffer.writeUInt8(0x96);
				buffer.writeUInt8(d2d_pairing_settings_item_id);
				buffer.writeUInt8(0x01);
				buffer.writeHexString(d2d_pairing_settings_item.deveui, 8);
			}
			if (isValid(d2d_pairing_settings_item.name_first)) {
				buffer.writeUInt8(0x96);
				buffer.writeUInt8(d2d_pairing_settings_item_id);
				buffer.writeUInt8(0x02);
				buffer.writeString(d2d_pairing_settings_item.name_first, 8);
			}
			if (isValid(d2d_pairing_settings_item.name_last)) {
				buffer.writeUInt8(0x96);
				buffer.writeUInt8(d2d_pairing_settings_item_id);
				buffer.writeUInt8(0x03);
				buffer.writeString(d2d_pairing_settings_item.name_last, 8);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x97
	if ('d2d_slave_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x97);
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
			// 0：disable, 1：enable
			buffer.writeUInt8(d2d_slave_settings_item.enable);
			buffer.writeHexString(d2d_slave_settings_item.command, 2);
			// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8, 8：Schedule9, 9：Schedule10, 10：Schedule11, 11：Schedule12, 12：Schedule13, 13：Schedule14, 14：Schedule15, 15：Schedule16, 16：System Off, 17：System On
			buffer.writeUInt8(d2d_slave_settings_item.value);
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
		buffer.writeUInt32LE(payload.retrieve_historical_data_by_time_range.start_time);
		buffer.writeUInt32LE(payload.retrieve_historical_data_by_time_range.end_time);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xba
	if ('retrieve_historical_data_by_time' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xba);
		buffer.writeUInt32LE(payload.retrieve_historical_data_by_time.time);
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
		// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8, 8：Schedule9, 9：Schedule10, 10：Schedule11, 11：Schedule12, 12：Schedule13, 13：Schedule14, 14：Schedule15, 15：Schedule16, 255：All
		buffer.writeUInt8(payload.delete_task_plan.type);
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
		  "request_check_order": "fe",
		  "request_full_inspection": "f4",
		  "request_full_inspection.start_inspection": "f400",
		  "request_full_inspection.control": "f401",
		  "request_full_inspection.reading": "f402",
		  "request_full_inspection.end_inspection": "f403",
		  "request_full_inspection.aging": "f404",
		  "request_command_queries": "ef",
		  "all_configurations_request_by_device": "ee",
		  "lorawan_configuration_settings": "cf",
		  "lorawan_configuration_settings.mode": "cf00",
		  "tsl_version": "df",
		  "product_sn": "db",
		  "version": "da",
		  "oem_id": "d9",
		  "temperature": "06",
		  "humidity": "08",
		  "temperature_control_info": "0c",
		  "fan_control_info": "0d",
		  "execution_plan_id": "0e",
		  "target_temperature": "10",
		  "auto_p_enable": "c4",
		  "data_storage_settings": "c5",
		  "data_storage_settings.enable": "c500",
		  "data_storage_settings.retransmission_enable": "c501",
		  "data_storage_settings.retransmission_interval": "c502",
		  "data_storage_settings.retrieval_interval": "c503",
		  "bluetooth_config": "d4",
		  "bluetooth_config.bluetooth_name": "d401",
		  "temperature_control_mode": "60",
		  "temperature_control_mode.ctrl_mode": "6000",
		  "temperature_control_mode.plan_enable": "6001",
		  "target_temperature_settings": "61",
		  "target_temperature_settings.heat": "6100",
		  "target_temperature_settings.cool": "6102",
		  "target_temperature_settings.auto": "6103",
		  "target_temperature_tolerance": "62",
		  "target_temperature_tolerance.target_value": "6200",
		  "target_temperature_tolerance.ctrl_value": "6201",
		  "target_temperature_tolerance.heat_value": "6202",
		  "target_temperature_tolerance.cool_value": "6203",
		  "target_temperature_range": "63",
		  "target_temperature_range.heat": "6300",
		  "target_temperature_range.cool": "6302",
		  "target_temperature_range.auto": "6303",
		  "temperature_unit": "64",
		  "target_temperature_resolution": "65",
		  "communication_mode": "91",
		  "reporting_interval": "66",
		  "reporting_interval.ble_lora": "6600",
		  "reporting_interval.power_lora": "6601",
		  "schedule_settings": "67",
		  "schedule_settings._item": "67xx",
		  "schedule_settings._item.enable": "67xx00",
		  "schedule_settings._item.name1": "67xx01",
		  "schedule_settings._item.name2": "67xx02",
		  "schedule_settings._item.fan_mode": "67xx03",
		  "schedule_settings._item.switch_on": "67xx05",
		  "schedule_settings._item.work_mode": "67xx06",
		  "schedule_settings._item.heat_target_temp": "67xx20",
		  "schedule_settings._item.cool_target_temp": "67xx22",
		  "schedule_settings._item.auto_target_temp": "67xx23",
		  "schedule_settings._item.target_temp_tolerance": "67xx30",
		  "schedule_settings._item.temp_control_tolerance": "67xx31",
		  "schedule_settings._item.heat_target_temp_tolerance": "67xx32",
		  "schedule_settings._item.cool_target_temp_tolerance": "67xx33",
		  "schedule_settings._item.cycle_settings": "67xx07",
		  "schedule_settings._item.cycle_settings._item": "67xx07xx",
		  "window_opening_detection_enable": "68",
		  "window_opening_detection_settings": "69",
		  "temperature_data_source": "6a",
		  "temperature_data_source.source": "6a00",
		  "temperature_data_source.time_out": "6a01",
		  "temperature_data_source.offline_mode": "6a02",
		  "temperature_data_source.data_sync": "6a03",
		  "high_temperature_alarm_settings": "6c",
		  "high_temperature_alarm_settings.enable": "6c00",
		  "high_temperature_alarm_settings.difference_in_temperature": "6c01",
		  "high_temperature_alarm_settings.duration": "6c02",
		  "low_temperature_alarm_settings": "6d",
		  "low_temperature_alarm_settings.enable": "6d00",
		  "low_temperature_alarm_settings.difference_in_temperature": "6d01",
		  "low_temperature_alarm_settings.duration": "6d02",
		  "system_switch": "6f",
		  "fan_settings": "70",
		  "fan_settings.fan_mode": "7000",
		  "fan_settings.adjust_humidity_enable": "7001",
		  "fan_settings.adjust_period": "7002",
		  "fan_settings.work_time": "7003",
		  "anti_freezing": "71",
		  "anti_freezing.enable": "7100",
		  "anti_freezing.target_temperature": "7101",
		  "dehumidify_settings": "72",
		  "dehumidify_settings.humidify_low_threshold": "7202",
		  "dehumidify_settings.humidify_high_threshold": "7203",
		  "plan_dwell_time_settings": "73",
		  "plan_dwell_time_settings._item": "73xx",
		  "plan_dwell_time_settings._item.permanent_stay_enable": "73xx00",
		  "plan_dwell_time_settings._item.dwell_time": "73xx01",
		  "system_protect": "74",
		  "system_protect.enable": "7400",
		  "system_protect.run_time": "7401",
		  "temperature_control_mode_enable": "75",
		  "target_temperature_mode": "76",
		  "unilateral_tolerance_enable": "77",
		  "relay_change_report_enable": "80",
		  "fan_delay_settings": "82",
		  "fan_delay_settings.enable": "8200",
		  "fan_delay_settings.delay_time": "8201",
		  "di_settings_enable": "86",
		  "di_settings": "87",
		  "filter_clean_settings": "8b",
		  "filter_clean_settings.enable": "8b00",
		  "filter_clean_settings.reminder_period": "8b01",
		  "install_configuration": "8e",
		  "install_configuration.wire": "8e00",
		  "install_configuration.reversing_valve": "8e01",
		  "install_configuration.y_combine_aux": "8e02",
		  "install_configuration.fan": "8e03",
		  "time_zone": "c7",
		  "daylight_saving_time": "c6",
		  "d2d_pairing_enable": "95",
		  "d2d_pairing_settings": "96",
		  "d2d_pairing_settings._item": "96xx",
		  "d2d_pairing_settings._item.enable": "96xx00",
		  "d2d_pairing_settings._item.deveui": "96xx01",
		  "d2d_pairing_settings._item.name_first": "96xx02",
		  "d2d_pairing_settings._item.name_last": "96xx03",
		  "d2d_slave_enable": "97",
		  "d2d_slave_settings": "98",
		  "d2d_slave_settings._item": "98xx",
		  "query_device_status": "b9",
		  "synchronize_time": "b8",
		  "clear_historical_data": "bd",
		  "stop_historical_data_retrieval": "bc",
		  "retrieve_historical_data_by_time_range": "bb",
		  "retrieve_historical_data_by_time": "ba",
		  "reboot": "be",
		  "delete_task_plan": "5f"
	};
}
function processTemperature(payload) {
	var allTemperatureProperties = [
    {
        "propertyId": "temperature",
        "coefficient": 0.01
    },
    {
        "propertyId": "target_temperature",
        "coefficient": 0.01
    },
    {
        "propertyId": "target_temperature_settings.heat",
        "coefficient": 0.01
    },
    {
        "propertyId": "target_temperature_settings.cool",
        "coefficient": 0.01
    },
    {
        "propertyId": "target_temperature_settings.auto",
        "coefficient": 0.01
    },
    {
        "propertyId": "target_temperature_tolerance.target_value",
        "coefficient": 0.01
    },
    {
        "propertyId": "target_temperature_tolerance.ctrl_value",
        "coefficient": 0.01
    },
    {
        "propertyId": "target_temperature_tolerance.heat_value",
        "coefficient": 0.01
    },
    {
        "propertyId": "target_temperature_tolerance.cool_value",
        "coefficient": 0.01
    },
    {
        "propertyId": "target_temperature_range.heat.min",
        "coefficient": 0.01
    },
    {
        "propertyId": "target_temperature_range.heat.max",
        "coefficient": 0.01
    },
    {
        "propertyId": "target_temperature_range.cool.min",
        "coefficient": 0.01
    },
    {
        "propertyId": "target_temperature_range.cool.max",
        "coefficient": 0.01
    },
    {
        "propertyId": "target_temperature_range.auto.min",
        "coefficient": 0.01
    },
    {
        "propertyId": "target_temperature_range.auto.max",
        "coefficient": 0.01
    },
    {
        "propertyId": "schedule_settings._item.heat_target_temp",
        "coefficient": 0.01
    },
    {
        "propertyId": "schedule_settings._item.cool_target_temp",
        "coefficient": 0.01
    },
    {
        "propertyId": "schedule_settings._item.auto_target_temp",
        "coefficient": 0.01
    },
    {
        "propertyId": "schedule_settings._item.target_temp_tolerance",
        "coefficient": 0.01
    },
    {
        "propertyId": "schedule_settings._item.temp_control_tolerance",
        "coefficient": 0.01
    },
    {
        "propertyId": "schedule_settings._item.heat_target_temp_tolerance",
        "coefficient": 0.01
    },
    {
        "propertyId": "schedule_settings._item.cool_target_temp_tolerance",
        "coefficient": 0.01
    },
    {
        "propertyId": "window_opening_detection_settings.temperature_detection.difference_in_temperature",
        "coefficient": 0.01
    },
    {
        "propertyId": "high_temperature_alarm_settings.difference_in_temperature",
        "coefficient": 0.01
    },
    {
        "propertyId": "low_temperature_alarm_settings.difference_in_temperature",
        "coefficient": 0.01
    },
    {
        "propertyId": "anti_freezing.target_temperature",
        "coefficient": 0.01
    }
];
	for (var i = 0; i < allTemperatureProperties.length; i++) {
		var property = allTemperatureProperties[i];
		var fahrenheitProperty = convertName(property.propertyId, 'fahrenheit');
		var celsiusProperty = convertName(property.propertyId, 'celsius');
		var stringCoefficient = String(property.coefficient);
		var dotIndex = stringCoefficient.indexOf('.');
		var precision = dotIndex != -1 ? stringCoefficient.length - dotIndex - 1 : 0;
		if (!hasPath(payload, property.propertyId)) {
			if (hasPath(payload, fahrenheitProperty) && hasPath(payload, celsiusProperty)) { 
				throw new Error(fahrenheitProperty + ' and ' + celsiusProperty + ' cannot be in payload at the same time');
			}
			if (hasPath(payload, fahrenheitProperty)) {
				setPath(payload, property.propertyId, Number(((getPath(payload, fahrenheitProperty) - 32) / 1.8).toFixed(precision)));
			} else if (hasPath(payload, celsiusProperty)) {
				setPath(payload, property.propertyId, Number(getPath(payload, celsiusProperty).toFixed(precision)));
			}
		}
	}	
	return payload;
}