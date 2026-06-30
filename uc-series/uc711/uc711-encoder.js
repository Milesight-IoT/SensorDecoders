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
	//0xcf
	if ('lorawan_configuration_settings' in payload) {
		var buffer = new Buffer();
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
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xdb
	if ('product_sn' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xdb);
		buffer.writeHexString(payload.product_sn, 8);
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
		// 0：standby, 1：stage-1 heat, 2：stage-2 heat, 3：stage-3 heat, 4：stage-4 heat, 5：stage-5 heat, 7：stage-1 cool, 8：stage-2 cool, 9：stage-3 cool
		bitOptions |= payload.temperature_control_info.status << 0;
		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0d
	if ('fan_control_info' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0d);
		var bitOptions = 0;
		// 0：off, 1：open, 2：low, 3:medium, 4:high
		bitOptions |= payload.fan_control_info.status << 0;
		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0x01
	if ('relay_status_change' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x01);
		var bitOptions = 0;
		// 0：opened, 1：closed
		bitOptions |= payload.relay_status_change.Y1 << 0;

		// 0：opened, 1：closed
		bitOptions |= payload.relay_status_change.W1 << 1;

		// 0：opened, 1：closed
		bitOptions |= payload.relay_status_change.OB << 2;

		// 0：opened, 1：closed
		bitOptions |= payload.relay_status_change.GL << 3;

		// 0：opened, 1：closed
		bitOptions |= payload.relay_status_change.GM << 4;

		// 0：opened, 1：closed
		bitOptions |= payload.relay_status_change.GH << 5;

		bitOptions |= payload.relay_status_change.reserved << 6;
		buffer.writeUInt8(bitOptions);

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
			if ([0, 1].indexOf(payload.reporting_interval.power_lora.unit) === -1) {
				throw new Error('reporting_interval.power_lora.unit must be one of [0, 1]');
			}
			// 0：second, 1：min
			buffer.writeUInt8(payload.reporting_interval.power_lora.unit);
			if (payload.reporting_interval.power_lora.unit == 0x01) {
				if (payload.reporting_interval.power_lora.minutes_of_time < 1 || payload.reporting_interval.power_lora.minutes_of_time > 1440) {
					throw new Error('reporting_interval.power_lora.minutes_of_time must be between 1 and 1440');
				}
				buffer.writeUInt16LE(payload.reporting_interval.power_lora.minutes_of_time);
			}
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
	//0x60
	if ('temperature_control_mode' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.temperature_control_mode.ctrl_mode)) {
			buffer.writeUInt8(0x60);
			// 0：heat, 2：cool, 3：auto
			buffer.writeUInt8(0x00);
			if ([0, 2, 3].indexOf(payload.temperature_control_mode.ctrl_mode) === -1) {
				throw new Error('temperature_control_mode.ctrl_mode must be one of [0, 2, 3]');
			}
			// 0：heat, 2：cool, 3：auto
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
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x77
	if ('unilateral_tolerance_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x77);
		if ([0, 1].indexOf(payload.unilateral_tolerance_enable) === -1) {
			throw new Error('unilateral_tolerance_enable must be one of [0, 1]');
		}
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.unilateral_tolerance_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x62
	if ('target_temperature_tolerance' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.target_temperature_tolerance.heat_value)) {
			buffer.writeUInt8(0x62);
			buffer.writeUInt8(0x00);
			if (payload.target_temperature_tolerance.heat_value < 0.1 || payload.target_temperature_tolerance.heat_value > 5) {
				throw new Error('target_temperature_tolerance.heat_value must be between 0.1 and 5');
			}
			buffer.writeInt16LE(payload.target_temperature_tolerance.heat_value * 100);
		}
		if (isValid(payload.target_temperature_tolerance.cool_value)) {
			buffer.writeUInt8(0x62);
			buffer.writeUInt8(0x02);
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
	//0x83
	if ('temperature_control_level_switch' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.temperature_control_level_switch.setforw_enable)) {
			buffer.writeUInt8(0x83);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.temperature_control_level_switch.setforw_enable) === -1) {
				throw new Error('temperature_control_level_switch.setforw_enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.temperature_control_level_switch.setforw_enable);
		}
		if (isValid(payload.temperature_control_level_switch.setback_enable)) {
			buffer.writeUInt8(0x83);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x01);
			if ([0, 1].indexOf(payload.temperature_control_level_switch.setback_enable) === -1) {
				throw new Error('temperature_control_level_switch.setback_enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.temperature_control_level_switch.setback_enable);
		}
		if (isValid(payload.temperature_control_level_switch.heat_time)) {
			buffer.writeUInt8(0x83);
			buffer.writeUInt8(0x02);
			if (payload.temperature_control_level_switch.heat_time < 1 || payload.temperature_control_level_switch.heat_time > 30) {
				throw new Error('temperature_control_level_switch.heat_time must be between 1 and 30');
			}
			buffer.writeUInt8(payload.temperature_control_level_switch.heat_time);
		}
		if (isValid(payload.temperature_control_level_switch.heat_temp)) {
			buffer.writeUInt8(0x83);
			buffer.writeUInt8(0x03);
			if (payload.temperature_control_level_switch.heat_temp < 0.5 || payload.temperature_control_level_switch.heat_temp > 5) {
				throw new Error('temperature_control_level_switch.heat_temp must be between 0.5 and 5');
			}
			buffer.writeUInt16LE(payload.temperature_control_level_switch.heat_temp * 100);
		}
		if (isValid(payload.temperature_control_level_switch.cool_time)) {
			buffer.writeUInt8(0x83);
			buffer.writeUInt8(0x04);
			if (payload.temperature_control_level_switch.cool_time < 1 || payload.temperature_control_level_switch.cool_time > 30) {
				throw new Error('temperature_control_level_switch.cool_time must be between 1 and 30');
			}
			buffer.writeUInt8(payload.temperature_control_level_switch.cool_time);
		}
		if (isValid(payload.temperature_control_level_switch.cool_temp)) {
			buffer.writeUInt8(0x83);
			buffer.writeUInt8(0x05);
			if (payload.temperature_control_level_switch.cool_temp < 0.5 || payload.temperature_control_level_switch.cool_temp > 5) {
				throw new Error('temperature_control_level_switch.cool_temp must be between 0.5 and 5');
			}
			buffer.writeUInt16LE(payload.temperature_control_level_switch.cool_temp * 100);
		}
		if (isValid(payload.temperature_control_level_switch.threshold_t1)) {
			buffer.writeUInt8(0x83);
			buffer.writeUInt8(0x06);
			if (payload.temperature_control_level_switch.threshold_t1 < 0 || payload.temperature_control_level_switch.threshold_t1 > 10) {
				throw new Error('temperature_control_level_switch.threshold_t1 must be between 0 and 10');
			}
			buffer.writeUInt16LE(payload.temperature_control_level_switch.threshold_t1 * 100);
		}
		if (isValid(payload.temperature_control_level_switch.threshold_t2)) {
			buffer.writeUInt8(0x83);
			buffer.writeUInt8(0x07);
			if (payload.temperature_control_level_switch.threshold_t2 < 0 || payload.temperature_control_level_switch.threshold_t2 > 10) {
				throw new Error('temperature_control_level_switch.threshold_t2 must be between 0 and 10');
			}
			buffer.writeUInt16LE(payload.temperature_control_level_switch.threshold_t2 * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x70
	if ('fan_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.fan_settings.fan_mode)) {
			buffer.writeUInt8(0x70);
			// 0：Auto, 1：Ventilation, 2：Always Open, 3：Low, 4：Medium, 5：High
			buffer.writeUInt8(0x00);
			if ([0, 1, 2, 3, 4, 5].indexOf(payload.fan_settings.fan_mode) === -1) {
				throw new Error('fan_settings.fan_mode must be one of [0, 1, 2, 3, 4, 5]');
			}
			// 0：Auto, 1：Ventilation, 2：Always Open, 3：Low, 4：Medium, 5：High
			buffer.writeUInt8(payload.fan_settings.fan_mode);
		}
		if (isValid(payload.fan_settings.work_time)) {
			buffer.writeUInt8(0x70);
			buffer.writeUInt8(0x03);
			if (payload.fan_settings.work_time < 5 || payload.fan_settings.work_time > 55) {
				throw new Error('fan_settings.work_time must be between 5 and 55');
			}
			buffer.writeUInt8(payload.fan_settings.work_time);
		}
		if (isValid(payload.fan_settings.adjust_humidity_enable)) {
			buffer.writeUInt8(0x70);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(0x01);
			if ([0, 1].indexOf(payload.fan_settings.adjust_humidity_enable) === -1) {
				throw new Error('fan_settings.adjust_humidity_enable must be one of [0, 1]');
			}
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
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x82
	if ('fan_delay_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.fan_delay_settings.enable)) {
			buffer.writeUInt8(0x82);
			// 0：Disable, 1：Enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.fan_delay_settings.enable) === -1) {
				throw new Error('fan_delay_settings.enable must be one of [0, 1]');
			}
			// 0：Disable, 1：Enable
			buffer.writeUInt8(payload.fan_delay_settings.enable);
		}
		if (isValid(payload.fan_delay_settings.delay_time)) {
			buffer.writeUInt8(0x82);
			buffer.writeUInt8(0x01);
			if (payload.fan_delay_settings.delay_time < 30 || payload.fan_delay_settings.delay_time > 3600) {
				throw new Error('fan_delay_settings.delay_time must be between 30 and 3600');
			}
			buffer.writeUInt16LE(payload.fan_delay_settings.delay_time);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x84
	if ('energy_saving_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x84);
		if ([0, 1].indexOf(payload.energy_saving_enable) === -1) {
			throw new Error('energy_saving_enable must be one of [0, 1]');
		}
		// 0：Disable, 1：Enable
		buffer.writeUInt8(payload.energy_saving_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x85
	if ('energy_saving' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.energy_saving.level_1)) {
			if (isValid(payload.energy_saving.level_1.enable)) {
				buffer.writeUInt8(0x85);
				// 0：Disable, 1：Enable
				buffer.writeUInt8(0x00);
				// 0：Disable, 1：Enable
				buffer.writeUInt8(0x00);
				if ([0, 1].indexOf(payload.energy_saving.level_1.enable) === -1) {
					throw new Error('energy_saving.level_1.enable must be one of [0, 1]');
				}
				// 0：Disable, 1：Enable
				buffer.writeUInt8(payload.energy_saving.level_1.enable);
			}
			if (isValid(payload.energy_saving.level_1.free_time)) {
				buffer.writeUInt8(0x85);
				buffer.writeUInt8(0x00);
				buffer.writeUInt8(0x01);
				if (payload.energy_saving.level_1.free_time < 1 || payload.energy_saving.level_1.free_time > 1440) {
					throw new Error('energy_saving.level_1.free_time must be between 1 and 1440');
				}
				buffer.writeUInt16LE(payload.energy_saving.level_1.free_time);
			}
			if (isValid(payload.energy_saving.level_1.target_temp_tolerance)) {
				buffer.writeUInt8(0x85);
				buffer.writeUInt8(0x00);
				buffer.writeUInt8(0x02);
				if (payload.energy_saving.level_1.target_temp_tolerance < 0.1 || payload.energy_saving.level_1.target_temp_tolerance > 5) {
					throw new Error('energy_saving.level_1.target_temp_tolerance must be between 0.1 and 5');
				}
				buffer.writeUInt16LE(payload.energy_saving.level_1.target_temp_tolerance * 100);
			}
		}
		if (isValid(payload.energy_saving.level_2)) {
			if (isValid(payload.energy_saving.level_2.enable)) {
				buffer.writeUInt8(0x85);
				// 0：Disable, 1：Enable
				buffer.writeUInt8(0x01);
				// 0：Disable, 1：Enable
				buffer.writeUInt8(0x00);
				if ([0, 1].indexOf(payload.energy_saving.level_2.enable) === -1) {
					throw new Error('energy_saving.level_2.enable must be one of [0, 1]');
				}
				// 0：Disable, 1：Enable
				buffer.writeUInt8(payload.energy_saving.level_2.enable);
			}
			if (isValid(payload.energy_saving.level_2.free_time)) {
				buffer.writeUInt8(0x85);
				buffer.writeUInt8(0x01);
				buffer.writeUInt8(0x01);
				if (payload.energy_saving.level_2.free_time < 1 || payload.energy_saving.level_2.free_time > 1440) {
					throw new Error('energy_saving.level_2.free_time must be between 1 and 1440');
				}
				buffer.writeUInt16LE(payload.energy_saving.level_2.free_time);
			}
			if (isValid(payload.energy_saving.level_2.target_temp_tolerance)) {
				buffer.writeUInt8(0x85);
				buffer.writeUInt8(0x01);
				buffer.writeUInt8(0x02);
				if (payload.energy_saving.level_2.target_temp_tolerance < 0.1 || payload.energy_saving.level_2.target_temp_tolerance > 5) {
					throw new Error('energy_saving.level_2.target_temp_tolerance must be between 0.1 and 5');
				}
				buffer.writeUInt16LE(payload.energy_saving.level_2.target_temp_tolerance * 100);
			}
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
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x8e
	if ('install_configuration' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.install_configuration.reversing_valve)) {
			buffer.writeUInt8(0x8e);
			buffer.writeUInt8(0x01);
			if ([0, 1].indexOf(payload.install_configuration.reversing_valve.mode) === -1) {
				throw new Error('install_configuration.reversing_valve.mode must be one of [0, 1]');
			}
			// 0：Energize on Heat, 1：Energize on Cool
			buffer.writeUInt8(payload.install_configuration.reversing_valve.mode);
		}
		if (isValid(payload.install_configuration.fan)) {
			buffer.writeUInt8(0x8e);
			buffer.writeUInt8(0x03);
			if ([0, 1].indexOf(payload.install_configuration.fan.owner) === -1) {
				throw new Error('install_configuration.fan.owner must be one of [0, 1]');
			}
			// 0：thermostat, 1：hvac
			buffer.writeUInt8(payload.install_configuration.fan.owner);
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
			if ([0, 1].indexOf(payload.anti_freezing.enable) === -1) {
				throw new Error('anti_freezing.enable must be one of [0, 1]');
			}
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
	//0xb8
	if ('synchronize_time' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb8);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x59
	if ('system_status_control' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x59);
		if ([0, 1].indexOf(payload.system_status_control.on_off) === -1) {
			throw new Error('system_status_control.on_off must be one of [0, 1]');
		}
		// 0：system off, 1：system on
		buffer.writeUInt8(payload.system_status_control.on_off);
		if (payload.system_status_control.mode == 'no apply') {
			buffer.writeUInt8(255);
		} else if (payload.system_status_control.mode < 0 || payload.system_status_control.mode > 5) {
			throw new Error('system_status_control.mode must be between 0 and 5');
		} else {
			// 0：heat, 1：em heat, 2：cool, 3：auto, 4：dehumidify, 5：ventilation
			buffer.writeUInt8(payload.system_status_control.mode);
		}

		if (payload.system_status_control.temperature1 == 'no apply') {
			buffer.writeInt16LE(65535);
		} else if (payload.system_status_control.temperature1 < 5 || payload.system_status_control.temperature1 > 35) {
			throw new Error('system_status_control.temperature1 must be between 5 and 35');
		} else {
			buffer.writeInt16LE(payload.system_status_control.temperature1 * 100);
		}

		if (payload.system_status_control.temperature2 == 'no apply') {
			buffer.writeInt16LE(65535);
		} else if (payload.system_status_control.temperature2 < 5 || payload.system_status_control.temperature2 > 35) {
			throw new Error('system_status_control.temperature2 must be in range [5,35]');
		} else {
			buffer.writeInt16LE(payload.system_status_control.temperature2 * 100);
		}
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
		  "lorawan_configuration_settings": "cf",
		  "lorawan_configuration_settings.mode": "cf00",
		  "tsl_version": "df",
		  "product_sn": "db",
		  "version.hardware_version": "da",
		  "device_status": "c8",
		  "ble_new_event": "ba",
		  "ble_new_event._item": "baxx",
		  "temperature": "06",
		  "humidity": "08",
		  "temperature_control_info": "0c",
		  "fan_control_info": "0d",
		  "relay_status_change": "01",
		  "reporting_interval": "66",
		  "reporting_interval.ble_lora": "6600",
		  "reporting_interval.ble_lora.minutes_of_time": "660001",
		  "reporting_interval.power_lora": "6601",
		  "reporting_interval.power_lora.minutes_of_time": "660101",
		  "temperature_unit": "64",
		  "system_switch": "6f",
		  "temperature_control_mode": "60",
		  "temperature_control_mode.ctrl_mode": "6000",
		  "temperature_control_mode.plan_enable": "6001",
		  "target_temperature_settings": "61",
		  "target_temperature_settings.heat": "6100",
		  "target_temperature_settings.cool": "6102",
		  "unilateral_tolerance_enable": "77",
		  "target_temperature_tolerance": "62",
		  "target_temperature_tolerance.heat_value": "6200",
		  "target_temperature_tolerance.cool_value": "6202",
		  "target_temperature_range": "63",
		  "target_temperature_range.heat": "6300",
		  "target_temperature_range.cool": "6302",
		  "dehumidify_settings": "72",
		  "dehumidify_settings.humidify_low_threshold": "7202",
		  "dehumidify_settings.humidify_high_threshold": "7203",
		  "temperature_control_level_switch": "83",
		  "temperature_control_level_switch.setforw_enable": "8300",
		  "temperature_control_level_switch.setback_enable": "8301",
		  "temperature_control_level_switch.heat_time": "8302",
		  "temperature_control_level_switch.heat_temp": "8303",
		  "temperature_control_level_switch.cool_time": "8304",
		  "temperature_control_level_switch.cool_temp": "8305",
		  "temperature_control_level_switch.threshold_t1": "8306",
		  "temperature_control_level_switch.threshold_t2": "8307",
		  "fan_settings": "70",
		  "fan_settings.fan_mode": "7000",
		  "fan_settings.work_time": "7003",
		  "fan_settings.adjust_humidity_enable": "7001",
		  "fan_settings.adjust_period": "7002",
		  "fan_delay_settings": "82",
		  "fan_delay_settings.enable": "8200",
		  "fan_delay_settings.delay_time": "8201",
		  "energy_saving_enable": "84",
		  "energy_saving": "85",
		  "energy_saving.level_1": "8500",
		  "energy_saving.level_1.enable": "850000",
		  "energy_saving.level_1.free_time": "850001",
		  "energy_saving.level_1.target_temp_tolerance": "850002",
		  "energy_saving.level_2": "8501",
		  "energy_saving.level_2.enable": "850100",
		  "energy_saving.level_2.free_time": "850101",
		  "energy_saving.level_2.target_temp_tolerance": "850102",
		  "plan_dwell_time_settings": "73",
		  "plan_dwell_time_settings._item": "73xx",
		  "plan_dwell_time_settings._item.permanent_stay_enable": "73xx00",
		  "plan_dwell_time_settings._item.dwell_time": "73xx01",
		  "install_configuration": "8e",
		  "install_configuration.reversing_valve": "8e01",
		  "install_configuration.fan": "8e03",
		  "anti_freezing": "71",
		  "anti_freezing.enable": "7100",
		  "anti_freezing.target_temperature": "7101",
		  "synchronize_time": "b8",
		  "system_status_control": "59"
	};
}
function processTemperature(payload) {
	var allTemperatureProperties = {
    "temperature": {
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
    "target_temperature_tolerance.heat_value": {
        "coefficient": 0.01,
        "unitName": "K"
    },
    "target_temperature_tolerance.cool_value": {
        "coefficient": 0.01,
        "unitName": "K"
    },
    "target_temperature_range.heat.min": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "target_temperature_range.heat.max": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "target_temperature_range.cool.min": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "target_temperature_range.cool.max": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_control_level_switch.heat_temp": {
        "coefficient": 0.01,
        "unitName": "K"
    },
    "temperature_control_level_switch.cool_temp": {
        "coefficient": 0.01,
        "unitName": "K"
    },
    "temperature_control_level_switch.threshold_t1": {
        "coefficient": 0.01,
        "unitName": "K"
    },
    "temperature_control_level_switch.threshold_t2": {
        "coefficient": 0.01,
        "unitName": "K"
    },
    "energy_saving.level_1.target_temp_tolerance": {
        "coefficient": 0.01,
        "unitName": "K"
    },
    "energy_saving.level_2.target_temp_tolerance": {
        "coefficient": 0.01,
        "unitName": "K"
    },
    "anti_freezing.target_temperature": {
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
                // if (hasPath(payload, fahrenheitProperty) && hasPath(payload, celsiusProperty)) {
                //     throw new Error(fahrenheitProperty + ' and ' + celsiusProperty + ' cannot be in payload at the same time');
                // }
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