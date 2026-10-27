/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product WT401
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
	normalizeArrayParams(payload);
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
				throw oneOfError('lorawan_configuration_settings.mode', [0, 1, 2, 3]);
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
	//0x00
	if ('battery' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x00);
		if (payload.battery < 0 || payload.battery > 100) {
			throw betweenError('battery', 0, 100);
		}
		buffer.writeUInt8(payload.battery);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x01
	if ('temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x01);
		if (payload.temperature < -20 || payload.temperature > 60) {
			throw betweenError('temperature', -20, 60);
		}
		buffer.writeInt16LE(payload.temperature * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x02
	if ('humidity' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x02);
		if (payload.humidity < 0 || payload.humidity > 100) {
			throw betweenError('humidity', 0, 100);
		}
		buffer.writeUInt16LE(payload.humidity * 10);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x08
	if ('pir_status' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x08);
		if ([0, 1, 2].indexOf(payload.pir_status) === -1) {
			throw oneOfError('pir_status', [0, 1, 2]);
		}
		// 0：Vacant, 1：Occupied, 2：Night Occupied
		buffer.writeUInt8(payload.pir_status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x03
	if ('temperature_mode' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x03);
		if ([0, 1, 2, 3, 4, 5, 10, 11].indexOf(payload.temperature_mode) === -1) {
			throw oneOfError('temperature_mode', [0, 1, 2, 3, 4, 5, 10, 11]);
		}
		// 0：heat, 1：em heat, 2：cool, 3：auto, 4：dehumidify, 5：ventilation, 10：off, 11：none
		buffer.writeUInt8(payload.temperature_mode);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x06
	if ('target_temperature1' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x06);
		if (payload.target_temperature1 < 5 || payload.target_temperature1 > 35) {
			throw betweenError('target_temperature1', 5, 35);
		}
		buffer.writeInt16LE(payload.target_temperature1 * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x07
	if ('target_temperature2' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x07);
		if (payload.target_temperature2 < 5 || payload.target_temperature2 > 35) {
			throw betweenError('target_temperature2', 5, 35);
		}
		buffer.writeInt16LE(payload.target_temperature2 * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x04
	if ('fan_mode' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x04);
		if ([0, 1, 2, 3, 4, 5, 10, 11].indexOf(payload.fan_mode) === -1) {
			throw oneOfError('fan_mode', [0, 1, 2, 3, 4, 5, 10, 11]);
		}
		// 0：auto, 1：circulate, 2：on, 3：low, 4：medium, 5：high, 10：off, 11：none/keep
		buffer.writeUInt8(payload.fan_mode);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x05
	if ('execution_plan_id' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x05);
		if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 255].indexOf(payload.execution_plan_id) === -1) {
			throw oneOfError('execution_plan_id', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 255]);
		}
		// 0:plan0, 1:plan1, 2:plan2, 3:plan3, 4:plan4, 5:plan5, 6:plan6, 7:plan7, 8:plan8, 9:plan9, 10:plan10, 11:plan11, 12:plan12, 13:plan13, 14:plan14, 15:plan15, 255:Not executed
		buffer.writeUInt8(payload.execution_plan_id);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x8d
	if ('communication_mode' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x8d);
		if ([0, 1, 2].indexOf(payload.communication_mode) === -1) {
			throw oneOfError('communication_mode', [0, 1, 2]);
		}
		// 0：BLE, 1：LoRa, 2：BLE+LoRa
		buffer.writeUInt8(payload.communication_mode);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x61
	if ('reporting_interval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x61);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x60
	if ('collection_interval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x60);
		if ([0, 1].indexOf(payload.collection_interval.unit) === -1) {
			throw oneOfError('collection_interval.unit', [0, 1]);
		}
		// 0：second, 1：min
		buffer.writeUInt8(payload.collection_interval.unit);
		if (payload.collection_interval.unit == 0x01) {
			if (payload.collection_interval.minutes_of_time < 1 || payload.collection_interval.minutes_of_time > 1440) {
				throw betweenError('collection_interval.minutes_of_time', 1, 1440);
			}
			buffer.writeUInt16LE(payload.collection_interval.minutes_of_time);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x63
	if ('temperature_unit' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x63);
		if ([0, 1].indexOf(payload.temperature_unit) === -1) {
			throw oneOfError('temperature_unit', [0, 1]);
		}
		// 0：℃, 1：℉
		buffer.writeUInt8(payload.temperature_unit);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x7d
	if ('data_sync_to_peer' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x7d);
		if ([0, 1, 2].indexOf(payload.data_sync_to_peer) === -1) {
			throw oneOfError('data_sync_to_peer', [0, 1, 2]);
		}
		// 0:Embedded Data, 1:Lora Data, 2: UCController
		buffer.writeUInt8(payload.data_sync_to_peer);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x7e
	if ('data_sync_timeout' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x7e);
		if (payload.data_sync_timeout < 1 || payload.data_sync_timeout > 60) {
			throw betweenError('data_sync_timeout', 1, 60);
		}
		buffer.writeUInt8(payload.data_sync_timeout);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x67
	if ('system_status' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x67);
		if ([0, 1].indexOf(payload.system_status) === -1) {
			throw oneOfError('system_status', [0, 1]);
		}
		// 0：Off, 1：On
		buffer.writeUInt8(payload.system_status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x64
	if ('mode_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x64);
		var bitOptions = 0;
		if (payload.mode_enable == 1) {
			// heat
			bitOptions |= 1 << 0;

			// em heat
			bitOptions |= 1 << 1;

			// cool
			bitOptions |= 1 << 2;

			// auto
			bitOptions |= 1 << 3;
		} else if (payload.mode_enable == 2) {
			// heat
			bitOptions |= 1 << 0;

			// cool
			bitOptions |= 1 << 2;

			// auto
			bitOptions |= 1 << 3;
		} else if (payload.mode_enable == 3) {
			// heat
			bitOptions |= 1 << 0;
		} else if (payload.mode_enable == 4) {
			// cool
			bitOptions |= 1 << 2;
		} else if (payload.mode_enable == 5) {
			// heat
			bitOptions |= 1 << 0;

			// cool
			bitOptions |= 1 << 2;
		} else if (payload.mode_enable == 6) {
			// heat
			bitOptions |= 1 << 0;

			// em heat
			bitOptions |= 1 << 1;

			// cool
			bitOptions |= 1 << 2;

			// auto
			bitOptions |= 1 << 3;

			// dehumidify
			bitOptions |= 1 << 4;

			// ventilation
			bitOptions |= 1 << 5;
		} else {
			throw new Error('Invalid mode_enable: ' + payload.mode_enable);
		}

		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0x88
	if ('fan_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x88);
		var bitOptions = 0;
		var auto = 0;
		var circulation = 1;
		var on = 2;
		var low = 3;
		var medium = 4;
		var high = 5;

		var operations = [];
		if (payload.fan_enable == 1) {
			operations = [auto, circulation, on, low, medium, high];
		} else if (payload.fan_enable == 2) {
			operations = [auto, on, low, medium, high];
		} else if (payload.fan_enable == 3) {
			operations = [circulation, on, low, medium, high];
		} else if (payload.fan_enable == 4) {
			operations = [auto, circulation];
		} else if (payload.fan_enable == 5) {
			operations = [on, low, medium, high];
		} else {
			throw new Error('Invalid fan_enable: ' + payload.fan_enable);
		}

		for (var i = 0; i < operations.length; i++) {
			bitOptions |= 1 << operations[i];
		}
		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0x68
	if ('temperature_control_mode' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.temperature_control_mode.mode)) {
			buffer.writeUInt8(0x68);
			// 0：heat, 1：em heat, 2：cool, 3：auto, 4：dehumidify, 5：ventilation
			buffer.writeUInt8(0x00);
			if ([0, 1, 2, 3, 4, 5].indexOf(payload.temperature_control_mode.mode) === -1) {
				throw oneOfError('temperature_control_mode.mode', [0, 1, 2, 3, 4, 5]);
			}
			// 0：heat, 1：em heat, 2：cool, 3：auto, 4：dehumidify, 5：ventilation
			buffer.writeUInt8(payload.temperature_control_mode.mode);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x65
	if ('target_temperature_mode' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x65);
		if ([0, 1].indexOf(payload.target_temperature_mode) === -1) {
			throw oneOfError('target_temperature_mode', [0, 1]);
		}
		// 0：single, 1：dual
		buffer.writeUInt8(payload.target_temperature_mode);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x66
	if ('target_temperature_resolution' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x66);
		if ([0, 1].indexOf(payload.target_temperature_resolution) === -1) {
			throw oneOfError('target_temperature_resolution', [0, 1]);
		}
		// 0：0.5, 1：1
		buffer.writeUInt8(payload.target_temperature_resolution);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x69
	if ('target_temperature_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.target_temperature_settings.heat)) {
			buffer.writeUInt8(0x69);
			buffer.writeUInt8(0x00);
			if (payload.target_temperature_settings.heat < 5 || payload.target_temperature_settings.heat > 35) {
				throw betweenError('target_temperature_settings.heat', 5, 35);
			}
			buffer.writeInt16LE(payload.target_temperature_settings.heat * 100);
		}
		if (isValid(payload.target_temperature_settings.cool)) {
			buffer.writeUInt8(0x69);
			buffer.writeUInt8(0x02);
			if (payload.target_temperature_settings.cool < 5 || payload.target_temperature_settings.cool > 35) {
				throw betweenError('target_temperature_settings.cool', 5, 35);
			}
			buffer.writeInt16LE(payload.target_temperature_settings.cool * 100);
		}
		if (isValid(payload.target_temperature_settings.auto)) {
			buffer.writeUInt8(0x69);
			buffer.writeUInt8(0x03);
			if (payload.target_temperature_settings.auto < 5 || payload.target_temperature_settings.auto > 35) {
				throw betweenError('target_temperature_settings.auto', 5, 35);
			}
			buffer.writeInt16LE(payload.target_temperature_settings.auto * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6a
	if ('minimum_dead_zone' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6a);
		if (payload.minimum_dead_zone < 1 || payload.minimum_dead_zone > 10) {
			throw betweenError('minimum_dead_zone', 1, 10);
		}
		buffer.writeUInt16LE(payload.minimum_dead_zone * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6b
	if ('target_temperature_range' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.target_temperature_range.heat)) {
			buffer.writeUInt8(0x6b);
			buffer.writeUInt8(0x00);
			if (payload.target_temperature_range.heat.min < 5 || payload.target_temperature_range.heat.min > 35) {
				throw betweenError('target_temperature_range.heat.min', 5, 35);
			}
			buffer.writeInt16LE(payload.target_temperature_range.heat.min * 100);
			if (payload.target_temperature_range.heat.max < 5 || payload.target_temperature_range.heat.max > 35) {
				throw betweenError('target_temperature_range.heat.max', 5, 35);
			}
			buffer.writeInt16LE(payload.target_temperature_range.heat.max * 100);
		}
		if (isValid(payload.target_temperature_range.cool)) {
			buffer.writeUInt8(0x6b);
			buffer.writeUInt8(0x02);
			if (payload.target_temperature_range.cool.min < 5 || payload.target_temperature_range.cool.min > 35) {
				throw betweenError('target_temperature_range.cool.min', 5, 35);
			}
			buffer.writeInt16LE(payload.target_temperature_range.cool.min * 100);
			if (payload.target_temperature_range.cool.max < 5 || payload.target_temperature_range.cool.max > 35) {
				throw betweenError('target_temperature_range.cool.max', 5, 35);
			}
			buffer.writeInt16LE(payload.target_temperature_range.cool.max * 100);
		}
		if (isValid(payload.target_temperature_range.auto)) {
			buffer.writeUInt8(0x6b);
			buffer.writeUInt8(0x03);
			if (payload.target_temperature_range.auto.min < 5 || payload.target_temperature_range.auto.min > 35) {
				throw betweenError('target_temperature_range.auto.min', 5, 35);
			}
			buffer.writeInt16LE(payload.target_temperature_range.auto.min * 100);
			if (payload.target_temperature_range.auto.max < 5 || payload.target_temperature_range.auto.max > 35) {
				throw betweenError('target_temperature_range.auto.max', 5, 35);
			}
			buffer.writeInt16LE(payload.target_temperature_range.auto.max * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x74
	if ('fan_control_mode' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x74);
		if ([0, 1, 2, 3, 4, 5].indexOf(payload.fan_control_mode) === -1) {
			throw oneOfError('fan_control_mode', [0, 1, 2, 3, 4, 5]);
		}
		// 0：auto, 1：circulate, 2：on, 3：low, 4：medium, 5：high
		buffer.writeUInt8(payload.fan_control_mode);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x82
	if ('pir_common' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.pir_common.enable)) {
			buffer.writeUInt8(0x82);
			// 0:disable, 1:enable
			buffer.writeUInt8(0x01);
			if ([0, 1].indexOf(payload.pir_common.enable) === -1) {
				throw oneOfError('pir_common.enable', [0, 1]);
			}
			// 0:disable, 1:enable
			buffer.writeUInt8(payload.pir_common.enable);
		}
		if (isValid(payload.pir_common.release_time)) {
			buffer.writeUInt8(0x82);
			buffer.writeUInt8(0x02);
			if (payload.pir_common.release_time < 1 || payload.pir_common.release_time > 360) {
				throw betweenError('pir_common.release_time', 1, 360);
			}
			buffer.writeUInt16LE(payload.pir_common.release_time);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x84
	if ('pir_night' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.pir_night.enable)) {
			buffer.writeUInt8(0x84);
			// 0:disable, 1:enable
			buffer.writeUInt8(0x01);
			if ([0, 1].indexOf(payload.pir_night.enable) === -1) {
				throw oneOfError('pir_night.enable', [0, 1]);
			}
			// 0:disable, 1:enable
			buffer.writeUInt8(payload.pir_night.enable);
		}
		if (isValid(payload.pir_night.night_time)) {
			buffer.writeUInt8(0x84);
			buffer.writeUInt8(0x04);
			if (payload.pir_night.night_time.start < 0 || payload.pir_night.night_time.start > 1439) {
				throw betweenError('pir_night.night_time.start', 0, 1439);
			}
			buffer.writeUInt16LE(payload.pir_night.night_time.start);
			if (payload.pir_night.night_time.stop < 0 || payload.pir_night.night_time.stop > 1439) {
				throw betweenError('pir_night.night_time.stop', 0, 1439);
			}
			buffer.writeUInt16LE(payload.pir_night.night_time.stop);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x83
	if ('pir_energy' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.pir_energy.enable)) {
			buffer.writeUInt8(0x83);
			// 0:disable, 1:enable
			buffer.writeUInt8(0x01);
			if ([0, 1].indexOf(payload.pir_energy.enable) === -1) {
				throw oneOfError('pir_energy.enable', [0, 1]);
			}
			// 0:disable, 1:enable
			buffer.writeUInt8(payload.pir_energy.enable);
		}
		if (isValid(payload.pir_energy.plan)) {
			buffer.writeUInt8(0x83);
			buffer.writeUInt8(0x02);
			if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 255].indexOf(payload.pir_energy.plan.occupied) === -1) {
				throw oneOfError('pir_energy.plan.occupied', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 255]);
			}
			// 0:plan0, 1:plan1, 2:plan2, 3:plan3, 4:plan4, 5:plan5, 6:plan6, 7:plan7, 8:plan8, 9:plan9, 10:plan10, 11:plan11, 12:plan12, 13:plan13, 14:plan14, 15:plan15, 255:Not executed
			buffer.writeUInt8(payload.pir_energy.plan.occupied);
			if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 255].indexOf(payload.pir_energy.plan.unoccupied) === -1) {
				throw oneOfError('pir_energy.plan.unoccupied', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 255]);
			}
			// 0:plan0, 1:plan1, 2:plan2, 3:plan3, 4:plan4, 5:plan5, 6:plan6, 7:plan7, 8:plan8, 9:plan9, 10:plan10, 11:plan11, 12:plan12, 13:plan13, 14:plan14, 15:plan15, 255:Not executed
			buffer.writeUInt8(payload.pir_energy.plan.unoccupied);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x62
	if ('intelligent_display_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x62);
		if ([0, 1].indexOf(payload.intelligent_display_enable) === -1) {
			throw oneOfError('intelligent_display_enable', [0, 1]);
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.intelligent_display_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x89
	if ('backlight_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x89);
		if ([0, 1].indexOf(payload.backlight_enable) === -1) {
			throw oneOfError('backlight_enable', [0, 1]);
		}
		// 0:disable, 1:enable
		buffer.writeUInt8(payload.backlight_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x99
	if ('screen_off_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x99);
		if ([0, 1].indexOf(payload.screen_off_enable) === -1) {
			throw oneOfError('screen_off_enable', [0, 1]);
		}
		// 0:disable, 1:enable
		buffer.writeUInt8(payload.screen_off_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x71
	if ('button_custom_function' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.button_custom_function.enable)) {
			buffer.writeUInt8(0x71);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.button_custom_function.enable) === -1) {
				throw oneOfError('button_custom_function.enable', [0, 1]);
			}
			buffer.writeInt8(payload.button_custom_function.enable);
		}
		if (isValid(payload.button_custom_function.mode1)) {
			buffer.writeUInt8(0x71);
			// 1：Temperature Control Mode, 2：Fan Mode, 3：Schedule Switch, 4：Status Report, 5：Filter Cleaning Reset, 6：Button Event1, 7：Temperature Unit Switch
			buffer.writeUInt8(0x01);
			if ([1, 2, 3, 4, 5, 6, 7].indexOf(payload.button_custom_function.mode1) === -1) {
				throw oneOfError('button_custom_function.mode1', [1, 2, 3, 4, 5, 6, 7]);
			}
			// 1：Temperature Control Mode, 2：Fan Mode, 3：Schedule Switch, 4：Status Report, 5：Filter Cleaning Reset, 6：Button Event1, 7：Temperature Unit Switch
			buffer.writeUInt8(payload.button_custom_function.mode1);
		}
		if (isValid(payload.button_custom_function.mode2)) {
			buffer.writeUInt8(0x71);
			// 1：Temperature Control Mode, 2：Fan Mode, 3：Schedule Switch, 4：Status Report, 5：Filter Cleaning Reset, 6：Button Event2, 7：Temperature Unit Switch
			buffer.writeUInt8(0x02);
			if ([1, 2, 3, 4, 5, 6, 7].indexOf(payload.button_custom_function.mode2) === -1) {
				throw oneOfError('button_custom_function.mode2', [1, 2, 3, 4, 5, 6, 7]);
			}
			// 1：Temperature Control Mode, 2：Fan Mode, 3：Schedule Switch, 4：Status Report, 5：Filter Cleaning Reset, 6：Button Event2, 7：Temperature Unit Switch
			buffer.writeUInt8(payload.button_custom_function.mode2);
		}
		if (isValid(payload.button_custom_function.mode3)) {
			buffer.writeUInt8(0x71);
			// 0：System On/Off, 3：Schedule Switch, 4：Status Report, 5：Filter Cleaning Reset, 6：Button Event3, 7：Temperature Unit Switch
			buffer.writeUInt8(0x03);
			if ([0, 3, 4, 5, 6, 7].indexOf(payload.button_custom_function.mode3) === -1) {
				throw oneOfError('button_custom_function.mode3', [0, 3, 4, 5, 6, 7]);
			}
			// 0：System On/Off, 3：Schedule Switch, 4：Status Report, 5：Filter Cleaning Reset, 6：Button Event3, 7：Temperature Unit Switch
			buffer.writeUInt8(payload.button_custom_function.mode3);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x72
	if ('children_lock_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x72);
		// if ([0, 1].indexOf(payload.children_lock_settings.enable) === -1) {
		// 	throw oneOfError('children_lock_settings.enable', [0, 1]);
		// }
		// 0:disable, 1:enable

		var bitOptions = 0;
		var temp_up = 0;
		var temp_down = 1;
		var system_on_off = 2;
		var fan_mode = 3;
		var temperature_control_mode = 4;
		var reboot_reset = 5;
		var power_on_off = 6;
		var cancel_pair = 7;
		var plan_switch = 8;
		var status_report = 9;
		var filter_clean_alarm_release = 10;
		var button1_event = 11;
		var button2_event = 12;
		var button3_event = 13;
		var temperature_unit_switch = 14;

		var operations = [];
		if (payload.children_lock_settings == 1) {
			buffer.writeUInt8(0);
		} else if (payload.children_lock_settings == 2) {
			buffer.writeUInt8(1);
			operations = [temp_up, temp_down, system_on_off, fan_mode, temperature_control_mode, reboot_reset, power_on_off, cancel_pair, plan_switch, status_report, filter_clean_alarm_release, button1_event, button2_event, button3_event, temperature_unit_switch];
		} else {
			throw new Error('Invalid children_lock_settings: ' + payload.children_lock_settings);
		}

		for (var i = 0; i < operations.length; i++) {
			bitOptions |= 1 << operations[i];
		}

		buffer.writeUInt16LE(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0x81
	if ('unlock_button' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x81);
		if ([0, 1].indexOf(payload.unlock_button.enable) === -1) {
			throw oneOfError('unlock_button.enable', [0, 1]);
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.unlock_button.enable);
		if (payload.unlock_button.timeout < 1 || payload.unlock_button.timeout > 3600) {
			throw betweenError('unlock_button.timeout', 1, 3600);
		}
		buffer.writeUInt16LE(payload.unlock_button.timeout);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x80
	if ('unlock_combination_button_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x80);
		var bitOptions = 0;
		var button1 = 0;
		var button2 = 1;
		var button3 = 2;
		var button4 = 3;
		var button5 = 4;

		var operations = [];
		if (payload.unlock_combination_button_settings == 1) {
			operations = [button1, button2];
		} else if (payload.unlock_combination_button_settings == 2) {
			operations = [button2, button3];
		} else if (payload.unlock_combination_button_settings == 3) {
			operations = [button3, button4];
		} else if (payload.unlock_combination_button_settings == 4) {
			operations = [button4, button5];
		} else if (payload.unlock_combination_button_settings == 5) {
			operations = [button1, button2, button3];
		} else if (payload.unlock_combination_button_settings == 6) {
			operations = [button2, button3, button4];
		} else if (payload.unlock_combination_button_settings == 7) {
			operations = [button1, button2, button3, button4, button5];
		} else {
			throw new Error('Invalid unlock_combination_button_settings: ' + payload.unlock_combination_button_settings);
		}

		for (var i = 0; i < operations.length; i++) {
			bitOptions |= 1 << operations[i];
		}

		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0xc7
	if ('time_zone' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xc7);
		if ([-720, -660, -600, -570, -540, -480, -420, -360, -300, -240, -210, -180, -120, -60, 0, 60, 120, 180, 210, 240, 270, 300, 330, 345, 360, 390, 420, 480, 540, 570, 600, 630, 660, 720, 765, 780, 840].indexOf(payload.time_zone) === -1) {
			throw oneOfError('time_zone', [-720, -660, -600, -570, -540, -480, -420, -360, -300, -240, -210, -180, -120, -60, 0, 60, 120, 180, 210, 240, 270, 300, 330, 345, 360, 390, 420, 480, 540, 570, 600, 630, 660, 720, 765, 780, 840]);
		}
		buffer.writeInt16LE(payload.time_zone);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x86
	if ('origin_temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x86);
		if (payload.origin_temperature < -20 || payload.origin_temperature > 60) {
			throw betweenError('origin_temperature', -20, 60);
		}
		buffer.writeInt16LE(payload.origin_temperature * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x87
	if ('origin_humidity' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x87);
		if (payload.origin_humidity < 0 || payload.origin_humidity > 100) {
			throw betweenError('origin_humidity', 0, 100);
		}
		buffer.writeUInt16LE(payload.origin_humidity * 10);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xb7
	if ('set_time' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb7);
		if (payload.set_time.timestamp < 0 || payload.set_time.timestamp > 4294967295) {
			throw rangeError('set_time.timestamp', '[0,4294967295]');
		}
		buffer.writeUInt32LE(payload.set_time.timestamp);
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

function normalizeArrayParams(value) {
	if (Array.isArray(value)) {
		for (var i = 0; i < value.length; i++) {
			value[i] = normalizeArrayParams(value[i]);
		}
		return value;
	}
	if (value === null || typeof value !== 'object') {
		return value;
	}
	var keys = [];
	for (var key in value) {
		if (Object.prototype.hasOwnProperty.call(value, key)) {
			keys.push(key);
		}
	}
	var allIntegerKeys = keys.length > 0;
	for (var j = 0; j < keys.length; j++) {
		if (!isInteger(keys[j])) {
			allIntegerKeys = false;
			break;
		}
	}
	if (allIntegerKeys) {
		var items = [];
		for (var k = 0; k < keys.length; k++) {
			var item = normalizeArrayParams(value[keys[k]]);
			if (item !== null && typeof item === 'object' && item.id === undefined) {
				item.id = parseInt(keys[k], 10);
			}
			items.push(item);
		}
		items.sort(function (a, b) {
			return ((a && a.id) || 0) - ((b && b.id) || 0);
		});
		return items;
	}
	for (var prop in value) {
		if (Object.prototype.hasOwnProperty.call(value, prop)) {
			value[prop] = normalizeArrayParams(value[prop]);
		}
	}
	return value;
}

function betweenError(path, min, max) {
	return new Error(path + ' must be between ' + min + ' and ' + max);
}

function oneOfError(path, values) {
	return new Error(path + ' must be one of [' + values.join(', ') + ']');
}

function rangeError(path, range) {
	return new Error(path + ' must be in range ' + range);
}

function processTemperature(payload) {
	var allTemperatureProperties = {
    "temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "target_temperature1": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "target_temperature2": {
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
    "minimum_dead_zone": {
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
    "target_temperature_range.auto.min": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "target_temperature_range.auto.max": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "origin_temperature": {
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
				if (hasPath(payload, celsiusProperty)) {
					setPath(payload, propertyId, Number(getPath(payload, celsiusProperty).toFixed(precision)));
				} else if (hasPath(payload, fahrenheitProperty)) {
					setPath(payload, propertyId, Number(((getPath(payload, fahrenheitProperty) - constant) / 1.8).toFixed(precision)));
				}
			}
		}
	}
	return payload;
}