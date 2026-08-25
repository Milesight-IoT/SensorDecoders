/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product WT304
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
	//0xcf
	if ('lorawan_configuration_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xcf);
		if ([1, 2, 3, 4].indexOf(payload.lorawan_configuration_settings.version) === -1) {
			throw new Error('lorawan_configuration_settings.version must be one of [1, 2, 3, 4]');
		}
		// 1：1.0.2, 2：1.0.3, 3：1.0.3, 4：1.0.4
		buffer.writeUInt8(payload.lorawan_configuration_settings.version);
		if ([0, 1, 2, 3].indexOf(payload.lorawan_configuration_settings.mode) === -1) {
			throw new Error('lorawan_configuration_settings.mode must be one of [0, 1, 2, 3]');
		}
		// 0:ClassA, 1:ClassB, 2:ClassC, 3:ClassC to B
		buffer.writeUInt8(payload.lorawan_configuration_settings.mode);
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
	//0xb8
	if ('battery_info' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb8);
		buffer.writeHexString(payload.battery_info.current_battery_status, 2);
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
	//0x04
	if ('data_source' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x04);
		if ([0, 1, 2, 3].indexOf(payload.data_source) === -1) {
			throw new Error('data_source must be one of [0, 1, 2, 3]');
		}
		// 0：Internal, 1：External NTC, 2：LoRaWAN Reception, 3：D2D Reception
		buffer.writeUInt8(payload.data_source);
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
	if ('humidity' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x02);
		if (payload.humidity < 0 || payload.humidity > 100) {
			throw new Error('humidity must be between 0 and 100');
		}
		buffer.writeUInt16LE(payload.humidity * 10);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x03
	if ('target_temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x03);
		if (payload.target_temperature < 5 || payload.target_temperature > 35) {
			throw new Error('target_temperature must be between 5 and 35');
		}
		buffer.writeInt16LE(payload.target_temperature * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x05
	if ('temperature_control_info' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x05);
		var bitOptions = 0;
		// 0：Ventilation, 1：Heat, 2：Cool
		bitOptions |= payload.temperature_control_info.mode << 4;

		// 0：Standby, 1:Heat, 2:Cool, 3：Off
		bitOptions |= payload.temperature_control_info.status << 0;
		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0x06
	if ('temperature_control_valve_status' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x06);
		if (payload.temperature_control_valve_status < 0 || payload.temperature_control_valve_status > 100) {
			throw new Error('temperature_control_valve_status must be between 0 and 100');
		}
		buffer.writeUInt8(payload.temperature_control_valve_status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x07
	if ('fan_control_info' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x07);
		var bitOptions = 0;
		// 0: Auto, 1: Low, 2: Medium, 3: High
		bitOptions |= payload.fan_control_info.mode << 4;

		// 0：Off, 1: Low, 2: Medium, 3: High
		bitOptions |= payload.fan_control_info.status << 0;
		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0x08
	if ('execution_plan_id' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x08);
		if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 255].indexOf(payload.execution_plan_id) === -1) {
			throw new Error('execution_plan_id must be one of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 255]');
		}
		// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8, 8：Schedule9, 9：Schedule10, 10：Schedule11, 11：Schedule12, 12：Schedule13, 13：Schedule14, 14：Schedule15, 15：Schedule16, 255：Not executed
		buffer.writeUInt8(payload.execution_plan_id);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x09
	if ('temperature_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x09);
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
		if (payload.temperature_alarm.type == 0x20) {
			if (payload.temperature_alarm.persistent_low_temperature_alarm_deactivation.temperature < -20 || payload.temperature_alarm.persistent_low_temperature_alarm_deactivation.temperature > 60) {
				throw new Error('temperature_alarm.persistent_low_temperature_alarm_deactivation.temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.temperature_alarm.persistent_low_temperature_alarm_deactivation.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x21) {
			if (payload.temperature_alarm.persistent_low_temperature_alarm_trigger.temperature < -20 || payload.temperature_alarm.persistent_low_temperature_alarm_trigger.temperature > 60) {
				throw new Error('temperature_alarm.persistent_low_temperature_alarm_trigger.temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.temperature_alarm.persistent_low_temperature_alarm_trigger.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x22) {
			if (payload.temperature_alarm.persistent_high_alarm_deactivation.temperature < -20 || payload.temperature_alarm.persistent_high_alarm_deactivation.temperature > 60) {
				throw new Error('temperature_alarm.persistent_high_alarm_deactivation.temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.temperature_alarm.persistent_high_alarm_deactivation.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x23) {
			if (payload.temperature_alarm.persistent_high_alarm_trigger.temperature < -20 || payload.temperature_alarm.persistent_high_alarm_trigger.temperature > 60) {
				throw new Error('temperature_alarm.persistent_high_alarm_trigger.temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.temperature_alarm.persistent_high_alarm_trigger.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x30) {
			if (payload.temperature_alarm.anti_freeze_protection_deactivation.temperature < -20 || payload.temperature_alarm.anti_freeze_protection_deactivation.temperature > 60) {
				throw new Error('temperature_alarm.anti_freeze_protection_deactivation.temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.temperature_alarm.anti_freeze_protection_deactivation.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x31) {
			if (payload.temperature_alarm.anti_freeze_protection_trigger.temperature < -20 || payload.temperature_alarm.anti_freeze_protection_trigger.temperature > 60) {
				throw new Error('temperature_alarm.anti_freeze_protection_trigger.temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.temperature_alarm.anti_freeze_protection_trigger.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x32) {
			if (payload.temperature_alarm.window_status_detection_deactivation.temperature < -20 || payload.temperature_alarm.window_status_detection_deactivation.temperature > 60) {
				throw new Error('temperature_alarm.window_status_detection_deactivation.temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.temperature_alarm.window_status_detection_deactivation.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x33) {
			if (payload.temperature_alarm.window_status_detection_trigger.temperature < -20 || payload.temperature_alarm.window_status_detection_trigger.temperature > 60) {
				throw new Error('temperature_alarm.window_status_detection_trigger.temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.temperature_alarm.window_status_detection_trigger.temperature * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0a
	if ('humidity_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0a);
		buffer.writeUInt8(payload.humidity_alarm.type);
		if (payload.humidity_alarm.type == 0x00) {
		}
		if (payload.humidity_alarm.type == 0x03) {
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0b
	if ('target_temperature_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0b);
		buffer.writeUInt8(payload.target_temperature_alarm.type);
		if (payload.target_temperature_alarm.type == 0x03) {
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0d
	if ('temp_ctrl_auth_status' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0d);
		if ([0, 1].indexOf(payload.temp_ctrl_auth_status) === -1) {
			throw new Error('temp_ctrl_auth_status must be one of [0, 1]');
		}
		// 0: Thermostat Control, 1: Remote Control
		buffer.writeUInt8(payload.temp_ctrl_auth_status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x10
	if ('relay_status' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x10);
		var bitOptions = 0;
		bitOptions |= payload.relay_status.low_status << 0;

		bitOptions |= payload.relay_status.mid_status << 1;

		bitOptions |= payload.relay_status.high_status << 2;

		bitOptions |= payload.relay_status.valve_1_status << 3;

		bitOptions |= payload.relay_status.valve_2_status << 4;

		bitOptions |= payload.relay_status.reserved << 5;

		bitOptions |= payload.relay_status.ao1_duty << 16;

		bitOptions |= payload.relay_status.ao2_duty << 24;
		buffer.writeUInt32LE(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0xc9
	if ('random_key' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xc9);
		if ([0, 1].indexOf(payload.random_key) === -1) {
			throw new Error('random_key must be one of [0, 1]');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.random_key);
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
	//0x60
	if ('collection_interval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x60);
		if ([0, 1].indexOf(payload.collection_interval.unit) === -1) {
			throw new Error('collection_interval.unit must be one of [0, 1]');
		}
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
	//0x62
	if ('reporting_interval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x62);
		if ([0, 1].indexOf(payload.reporting_interval.unit) === -1) {
			throw new Error('reporting_interval.unit must be one of [0, 1]');
		}
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
	//0xa1
	if ('reporting_interval_cfg' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xa1);
		if (payload.reporting_interval_cfg < 1 || payload.reporting_interval_cfg > 1440) {
			throw new Error('reporting_interval_cfg must be between 1 and 1440');
		}
		buffer.writeUInt16LE(payload.reporting_interval_cfg);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xc4
	if ('auto_p_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xc4);
		if ([0, 1].indexOf(payload.auto_p_enable) === -1) {
			throw new Error('auto_p_enable must be one of [0, 1]');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.auto_p_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x90
	if ('relay_changes_report_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x90);
		if ([0, 1].indexOf(payload.relay_changes_report_enable) === -1) {
			throw new Error('relay_changes_report_enable must be one of [0, 1]');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.relay_changes_report_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x63
	if ('temperature_unit' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x63);
		if ([0, 1].indexOf(payload.temperature_unit) === -1) {
			throw new Error('temperature_unit must be one of [0, 1]');
		}
		// 0：℃, 1：℉
		buffer.writeUInt8(payload.temperature_unit);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x85
	if ('temperature_source' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x85);
		if ([0, 1, 2, 3].indexOf(payload.temperature_source.type) === -1) {
			throw new Error('temperature_source.type must be one of [0, 1, 2, 3]');
		}
		// 0：Embedded Temperature, 1：External NTC, 2：LoRa Receive, 3：D2D Receive
		buffer.writeUInt8(payload.temperature_source.type);
		if (payload.temperature_source.type == 0x02) {
			if (payload.temperature_source.lorawan_reception.timeout < 1 || payload.temperature_source.lorawan_reception.timeout > 60) {
				throw new Error('temperature_source.lorawan_reception.timeout must be between 1 and 60');
			}
			buffer.writeUInt8(payload.temperature_source.lorawan_reception.timeout);
			if ([0, 1, 2].indexOf(payload.temperature_source.lorawan_reception.timeout_response) === -1) {
				throw new Error('temperature_source.lorawan_reception.timeout_response must be one of [0, 1, 2]');
			}
			// 0: Keep Control, 1: Turn Off The Control, 2: Switch The Embedded Temperature
			buffer.writeUInt8(payload.temperature_source.lorawan_reception.timeout_response);
		}
		if (payload.temperature_source.type == 0x03) {
			if (payload.temperature_source.d2d_reception.timeout < 1 || payload.temperature_source.d2d_reception.timeout > 60) {
				throw new Error('temperature_source.d2d_reception.timeout must be between 1 and 60');
			}
			buffer.writeUInt8(payload.temperature_source.d2d_reception.timeout);
			if ([0, 1, 2].indexOf(payload.temperature_source.d2d_reception.timeout_response) === -1) {
				throw new Error('temperature_source.d2d_reception.timeout_response must be one of [0, 1, 2]');
			}
			// 0: Keep Control, 1: Turn Off The Control, 2: Switch The Embedded Temperature
			buffer.writeUInt8(payload.temperature_source.d2d_reception.timeout_response);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xa0
	if ('temperature_data_source_cfg' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xa0);
		if ([0, 1, 2, 3].indexOf(payload.temperature_data_source_cfg) === -1) {
			throw new Error('temperature_data_source_cfg must be one of [0, 1, 2, 3]');
		}
		// 0：Embedded Temperature, 1：External NTC, 2：LoRa Receive, 3：D2D Receive
		buffer.writeUInt8(payload.temperature_data_source_cfg);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xa7
	if ('external_data_src_timeout_cfg' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.external_data_src_timeout_cfg.timeout)) {
			buffer.writeUInt8(0xa7);
			buffer.writeUInt8(0x00);
			if (payload.external_data_src_timeout_cfg.timeout < 1 || payload.external_data_src_timeout_cfg.timeout > 60) {
				throw new Error('external_data_src_timeout_cfg.timeout must be between 1 and 60');
			}
			buffer.writeUInt8(payload.external_data_src_timeout_cfg.timeout);
		}
		if (isValid(payload.external_data_src_timeout_cfg.timeout_response)) {
			buffer.writeUInt8(0xa7);
			// 0: Keep Control, 1: Turn Off The Control, 2: Switch The Embedded Temperature
			buffer.writeUInt8(0x01);
			if ([0, 1, 2].indexOf(payload.external_data_src_timeout_cfg.timeout_response) === -1) {
				throw new Error('external_data_src_timeout_cfg.timeout_response must be one of [0, 1, 2]');
			}
			// 0: Keep Control, 1: Turn Off The Control, 2: Switch The Embedded Temperature
			buffer.writeUInt8(payload.external_data_src_timeout_cfg.timeout_response);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x67
	if ('system_status' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x67);
		if ([0, 1].indexOf(payload.system_status) === -1) {
			throw new Error('system_status must be one of [0, 1]');
		}
		// 0：Off, 1：On
		buffer.writeUInt8(payload.system_status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x64
	if ('mode_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x64);
		if ([7, 3, 5].indexOf(payload.mode_enable) === -1) {
			throw new Error('mode_enable must be one of [7, 3, 5]');
		}
		// 7：Ventilation、Heat、Cool, 3：Ventilation、Heat, 5：Ventilation、Cool
		buffer.writeUInt8(payload.mode_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x68
	if ('temperature_control_mode' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x68);
		if ([0, 1, 2].indexOf(payload.temperature_control_mode) === -1) {
			throw new Error('temperature_control_mode must be one of [0, 1, 2]');
		}
		// 0：Ventilation, 1：Heat, 2：Cool
		buffer.writeUInt8(payload.temperature_control_mode);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x69
	if ('target_temperature_resolution' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x69);
		if ([0, 1].indexOf(payload.target_temperature_resolution) === -1) {
			throw new Error('target_temperature_resolution must be one of [0, 1]');
		}
		// 0：0.5, 1：1
		buffer.writeUInt8(payload.target_temperature_resolution);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6b
	if ('heating_target_temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6b);
		if (payload.heating_target_temperature < 5 || payload.heating_target_temperature > 35) {
			throw new Error('heating_target_temperature must be between 5 and 35');
		}
		buffer.writeInt16LE(payload.heating_target_temperature * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6c
	if ('cooling_target_temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6c);
		if (payload.cooling_target_temperature < 5 || payload.cooling_target_temperature > 35) {
			throw new Error('cooling_target_temperature must be between 5 and 35');
		}
		buffer.writeInt16LE(payload.cooling_target_temperature * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6a
	if ('target_temperature_tolerance' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6a);
		if (payload.target_temperature_tolerance < 0.1 || payload.target_temperature_tolerance > 5) {
			throw new Error('target_temperature_tolerance must be between 0.1 and 5');
		}
		buffer.writeInt16LE(payload.target_temperature_tolerance * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6d
	if ('heating_target_temperature_range' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6d);
		if (payload.heating_target_temperature_range.min < 5 || payload.heating_target_temperature_range.min > 35) {
			throw new Error('heating_target_temperature_range.min must be between 5 and 35');
		}
		buffer.writeInt16LE(payload.heating_target_temperature_range.min * 100);
		if (payload.heating_target_temperature_range.max < 5 || payload.heating_target_temperature_range.max > 35) {
			throw new Error('heating_target_temperature_range.max must be between 5 and 35');
		}
		buffer.writeInt16LE(payload.heating_target_temperature_range.max * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6e
	if ('cooling_target_temperature_range' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6e);
		if (payload.cooling_target_temperature_range.min < 5 || payload.cooling_target_temperature_range.min > 35) {
			throw new Error('cooling_target_temperature_range.min must be between 5 and 35');
		}
		buffer.writeInt16LE(payload.cooling_target_temperature_range.min * 100);
		if (payload.cooling_target_temperature_range.max < 5 || payload.cooling_target_temperature_range.max > 35) {
			throw new Error('cooling_target_temperature_range.max must be between 5 and 35');
		}
		buffer.writeInt16LE(payload.cooling_target_temperature_range.max * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x70
	if ('target_humidity_range' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x70);
		if (payload.target_humidity_range.min < 0 || payload.target_humidity_range.min > 100) {
			throw new Error('target_humidity_range.min must be between 0 and 100');
		}
		buffer.writeUInt16LE(payload.target_humidity_range.min * 10);
		if (payload.target_humidity_range.max < 0 || payload.target_humidity_range.max > 100) {
			throw new Error('target_humidity_range.max must be between 0 and 100');
		}
		buffer.writeUInt16LE(payload.target_humidity_range.max * 10);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6f
	if ('temperature_control_dehumidification' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6f);
		if ([0, 1].indexOf(payload.temperature_control_dehumidification.enable) === -1) {
			throw new Error('temperature_control_dehumidification.enable must be one of [0, 1]');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.temperature_control_dehumidification.enable);
		if (payload.temperature_control_dehumidification.temperature_tolerance < 0.1 || payload.temperature_control_dehumidification.temperature_tolerance > 5) {
			throw new Error('temperature_control_dehumidification.temperature_tolerance must be between 0.1 and 5');
		}
		buffer.writeInt16LE(payload.temperature_control_dehumidification.temperature_tolerance * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x71
	if ('temp_ctl_dehumi_cfg' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.temp_ctl_dehumi_cfg.enable)) {
			buffer.writeUInt8(0x71);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.temp_ctl_dehumi_cfg.enable) === -1) {
				throw new Error('temp_ctl_dehumi_cfg.enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.temp_ctl_dehumi_cfg.enable);
		}
		if (isValid(payload.temp_ctl_dehumi_cfg.temperature_tolerance)) {
			buffer.writeUInt8(0x71);
			buffer.writeUInt8(0x01);
			if (payload.temp_ctl_dehumi_cfg.temperature_tolerance < 0.1 || payload.temp_ctl_dehumi_cfg.temperature_tolerance > 5) {
				throw new Error('temp_ctl_dehumi_cfg.temperature_tolerance must be between 0.1 and 5');
			}
			buffer.writeUInt16LE(payload.temp_ctl_dehumi_cfg.temperature_tolerance * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x72
	if ('fan_control_mode' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x72);
		if ([0, 1, 2, 3].indexOf(payload.fan_control_mode) === -1) {
			throw new Error('fan_control_mode must be one of [0, 1, 2, 3]');
		}
		// 0：Auto, 1：Low, 2:Medium, 3:High
		buffer.writeUInt8(payload.fan_control_mode);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x74
	if ('fan_delay_close' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x74);
		if ([0, 1].indexOf(payload.fan_delay_close.enable) === -1) {
			throw new Error('fan_delay_close.enable must be one of [0, 1]');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.fan_delay_close.enable);
		if (payload.fan_delay_close.time < 30 || payload.fan_delay_close.time > 3600) {
			throw new Error('fan_delay_close.time must be between 30 and 3600');
		}
		buffer.writeUInt16LE(payload.fan_delay_close.time);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x7f
	if ('fan_delay_close_cfg' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.fan_delay_close_cfg.enable)) {
			buffer.writeUInt8(0x7f);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.fan_delay_close_cfg.enable) === -1) {
				throw new Error('fan_delay_close_cfg.enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.fan_delay_close_cfg.enable);
		}
		if (isValid(payload.fan_delay_close_cfg.timeout_time)) {
			buffer.writeUInt8(0x7f);
			buffer.writeUInt8(0x01);
			if (payload.fan_delay_close_cfg.timeout_time < 30 || payload.fan_delay_close_cfg.timeout_time > 3600) {
				throw new Error('fan_delay_close_cfg.timeout_time must be between 30 and 3600');
			}
			buffer.writeUInt16LE(payload.fan_delay_close_cfg.timeout_time);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x73
	if ('fan_auto_mode_temperature_range' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x73);
		if (payload.fan_auto_mode_temperature_range.speed_range_1 < 1 || payload.fan_auto_mode_temperature_range.speed_range_1 > 15) {
			throw new Error('fan_auto_mode_temperature_range.speed_range_1 must be between 1 and 15');
		}
		buffer.writeInt16LE(payload.fan_auto_mode_temperature_range.speed_range_1 * 100);
		if (payload.fan_auto_mode_temperature_range.speed_range_2 < 1 || payload.fan_auto_mode_temperature_range.speed_range_2 > 15) {
			throw new Error('fan_auto_mode_temperature_range.speed_range_2 must be between 1 and 15');
		}
		buffer.writeInt16LE(payload.fan_auto_mode_temperature_range.speed_range_2 * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x9f
	if ('fan_speed_ctl_delta_cfg' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.fan_speed_ctl_delta_cfg.delta1)) {
			buffer.writeUInt8(0x9f);
			buffer.writeUInt8(0x00);
			if (payload.fan_speed_ctl_delta_cfg.delta1 < 1 || payload.fan_speed_ctl_delta_cfg.delta1 > 15) {
				throw new Error('fan_speed_ctl_delta_cfg.delta1 must be between 1 and 15');
			}
			buffer.writeInt16LE(payload.fan_speed_ctl_delta_cfg.delta1 * 100);
		}
		if (isValid(payload.fan_speed_ctl_delta_cfg.delta2)) {
			buffer.writeUInt8(0x9f);
			buffer.writeUInt8(0x01);
			if (payload.fan_speed_ctl_delta_cfg.delta2 < 1 || payload.fan_speed_ctl_delta_cfg.delta2 > 15) {
				throw new Error('fan_speed_ctl_delta_cfg.delta2 must be between 1 and 15');
			}
			buffer.writeInt16LE(payload.fan_speed_ctl_delta_cfg.delta2 * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x8c
	if ('timed_system_control' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.timed_system_control.enable)) {
			buffer.writeUInt8(0x8c);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.timed_system_control.enable) === -1) {
				throw new Error('timed_system_control.enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.timed_system_control.enable);
		}
		for (var start_cycle_settings_id = 0; start_cycle_settings_id < (payload.timed_system_control.start_cycle_settings && payload.timed_system_control.start_cycle_settings.length); start_cycle_settings_id++) {
			var start_cycle_settings_item = payload.timed_system_control.start_cycle_settings[start_cycle_settings_id];
			var start_cycle_settings_item_id = start_cycle_settings_item.id;
			if (start_cycle_settings_item_id < 0 || start_cycle_settings_item_id > 3) {
				throw new Error('start_cycle_settings_item_id must be between 0 and 3');
			}

			buffer.writeUInt8(0x8c);
			buffer.writeUInt8(0x01);
			buffer.writeUInt8(start_cycle_settings_item_id);
			if ([0, 1].indexOf(start_cycle_settings_item.enable) === -1) {
				throw new Error('enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(start_cycle_settings_item.enable);
			if (start_cycle_settings_item.execution_time_point < 0 || start_cycle_settings_item.execution_time_point > 1439) {
				throw new Error('execution_time_point must be in range [0,1439]');
			}
			buffer.writeUInt16LE(start_cycle_settings_item.execution_time_point);
			var bitOptions = 0;
			// 0：disable, 1：enable
			bitOptions |= start_cycle_settings_item.execution_day_sun << 0;

			// 0：disable, 1：enable
			bitOptions |= start_cycle_settings_item.execution_day_mon << 1;

			// 0：disable, 1：enable
			bitOptions |= start_cycle_settings_item.execution_day_tues << 2;

			// 0：disable, 1：enable
			bitOptions |= start_cycle_settings_item.execution_day_wed << 3;

			// 0：disable, 1：enable
			bitOptions |= start_cycle_settings_item.execution_day_thu << 4;

			// 0：disable, 1：enable
			bitOptions |= start_cycle_settings_item.execution_day_fri << 5;

			// 0：disable, 1：enable
			bitOptions |= start_cycle_settings_item.execution_day_sat << 6;

			bitOptions |= start_cycle_settings_item.reserved << 7;
			buffer.writeUInt8(bitOptions);

		}
		for (var end_cycle_settings_id = 0; end_cycle_settings_id < (payload.timed_system_control.end_cycle_settings && payload.timed_system_control.end_cycle_settings.length); end_cycle_settings_id++) {
			var end_cycle_settings_item = payload.timed_system_control.end_cycle_settings[end_cycle_settings_id];
			var end_cycle_settings_item_id = end_cycle_settings_item.id;
			if (end_cycle_settings_item_id < 0 || end_cycle_settings_item_id > 3) {
				throw new Error('end_cycle_settings_item_id must be between 0 and 3');
			}

			buffer.writeUInt8(0x8c);
			buffer.writeUInt8(0x02);
			buffer.writeUInt8(end_cycle_settings_item_id);
			if ([0, 1].indexOf(end_cycle_settings_item.enable) === -1) {
				throw new Error('enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(end_cycle_settings_item.enable);
			if (end_cycle_settings_item.execution_time_point < 0 || end_cycle_settings_item.execution_time_point > 1439) {
				throw new Error('execution_time_point must be in range [0,1439]');
			}
			buffer.writeUInt16LE(end_cycle_settings_item.execution_time_point);
			var bitOptions = 0;
			// 0：disable, 1：enable
			bitOptions |= end_cycle_settings_item.execution_day_sun << 0;

			// 0：disable, 1：enable
			bitOptions |= end_cycle_settings_item.execution_day_mon << 1;

			// 0：disable, 1：enable
			bitOptions |= end_cycle_settings_item.execution_day_tues << 2;

			// 0：disable, 1：enable
			bitOptions |= end_cycle_settings_item.execution_day_wed << 3;

			// 0：disable, 1：enable
			bitOptions |= end_cycle_settings_item.execution_day_thu << 4;

			// 0：disable, 1：enable
			bitOptions |= end_cycle_settings_item.execution_day_fri << 5;

			// 0：disable, 1：enable
			bitOptions |= end_cycle_settings_item.execution_day_sat << 6;

			bitOptions |= end_cycle_settings_item.reserved << 7;
			buffer.writeUInt8(bitOptions);

		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x65
	if ('intelligent_display_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x65);
		if ([0, 1].indexOf(payload.intelligent_display_enable) === -1) {
			throw new Error('intelligent_display_enable must be one of [0, 1]');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.intelligent_display_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x66
	if ('screen_object_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x66);
		if ([0, 1].indexOf(payload.screen_object_settings.enable) === -1) {
			throw new Error('screen_object_settings.enable must be one of [0, 1]');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.screen_object_settings.enable);
		var bitOptions = 0;
		// 0：disable, 1：enable
		bitOptions |= payload.screen_object_settings.environmental_temperature << 0;

		// 0：disable, 1：enable
		bitOptions |= payload.screen_object_settings.environmental_humidity << 1;

		// 0：disable, 1：enable
		bitOptions |= payload.screen_object_settings.target_temperature << 2;

		// 0：disable, 1：enable
		bitOptions |= payload.screen_object_settings.schedule_name << 3;

		// 0：disable, 1：enable
		bitOptions |= payload.screen_object_settings.temp_ctrl_mode << 4;

		// 0：disable, 1：enable
		bitOptions |= payload.screen_object_settings.fan_ctrl_mode << 5;

		bitOptions |= payload.screen_object_settings.reserved << 6;
		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0x75
	if ('child_lock' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x75);
		if ([0, 1].indexOf(payload.child_lock.enable) === -1) {
			throw new Error('child_lock.enable must be one of [0, 1]');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.child_lock.enable);
		var bitOptions = 0;
		// 0：disable, 1：enable
		bitOptions |= payload.child_lock.system_button << 0;

		// 0：disable, 1：enable
		bitOptions |= payload.child_lock.temperature_button << 1;

		// 0：disable, 1：enable
		bitOptions |= payload.child_lock.fan_button << 2;

		// 0：disable, 1：enable
		bitOptions |= payload.child_lock.temperature_control_button << 3;

		// 0：disable, 1：enable
		bitOptions |= payload.child_lock.reboot_reset_button << 4;

		bitOptions |= payload.child_lock.reserved << 5;
		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0x96
	if ('child_lock_enable_cfg' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.child_lock_enable_cfg.enable)) {
			buffer.writeUInt8(0x96);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.child_lock_enable_cfg.enable) === -1) {
				throw new Error('child_lock_enable_cfg.enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.child_lock_enable_cfg.enable);
		}
		if (isValid(payload.child_lock_enable_cfg.key_enable)) {
			buffer.writeUInt8(0x96);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x01);
			if ([0, 1].indexOf(payload.child_lock_enable_cfg.key_enable) === -1) {
				throw new Error('child_lock_enable_cfg.key_enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.child_lock_enable_cfg.key_enable);
		}
		var bitOptions = 0;
		// 0：disable, 1：enable
		bitOptions |= payload.child_lock_enable_cfg.system << 0;

		// 0：disable, 1：enable
		bitOptions |= payload.child_lock_enable_cfg.temperature << 1;

		// 0：disable, 1：enable
		bitOptions |= payload.child_lock_enable_cfg.fan << 2;
		buffer.writeUInt8(bitOptions);

		var bitOptions = 0;
		// 0：disable, 1：enable
		bitOptions |= payload.child_lock_enable_cfg.temperature_control << 3;

		// 0：disable, 1：enable
		bitOptions |= payload.child_lock_enable_cfg.reboot_reset << 4;

		encoded = encoded.concat(buffer.toBytes());
	}
	//0x8d
	if ('temporary_unlock_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x8d);
		buffer.writeUInt8(bitOptions);

		if ([0, 1].indexOf(payload.temporary_unlock_settings.enable) === -1) {
			throw new Error('temporary_unlock_settings.enable must be one of [0, 1]');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.temporary_unlock_settings.enable);
		var bitOptions = 0;
		// 0：disable, 1：enable
		bitOptions |= payload.temporary_unlock_settings.system << 0;

		// 0：disable, 1：enable
		bitOptions |= payload.temporary_unlock_settings.temperature_up << 1;

		// 0：disable, 1：enable
		bitOptions |= payload.temporary_unlock_settings.temperature_down << 2;

		// 0：disable, 1：enable
		bitOptions |= payload.temporary_unlock_settings.fan << 3;

		// 0：disable, 1：enable
		bitOptions |= payload.temporary_unlock_settings.temperature_control << 4;

		bitOptions |= payload.temporary_unlock_settings.reserved << 5;
		buffer.writeUInt8(bitOptions);

		if (payload.temporary_unlock_settings.unlocking_duration < 1 || payload.temporary_unlock_settings.unlocking_duration > 3600) {
			throw new Error('temporary_unlock_settings.unlocking_duration must be between 1 and 3600');
		}
		buffer.writeUInt16LE(payload.temporary_unlock_settings.unlocking_duration);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x97
	if ('temporary_button_unlock_cfg' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.temporary_button_unlock_cfg.enable)) {
			buffer.writeUInt8(0x97);
			// 0：Disable, 3：System switch & Temperature +, 5：System switch & Temperature -, 6：Temperature + & Temperature -, 7：System switch & Temperature + & Temperature -, 9：System switch & Fan, 10：Temperature + & Fan, 11：System switch & Temperature + & Fan, 12：Temperature - & Fan, 13：System switch & Temperature - & Fan, 14：Temperature + & Temperature - & Fan, 15：System switch & Temperature + & Temperature - & Fan, 17：System switch & Temperature control mode, 18：Temperature + & Temperature control mode, 19：System switch & Temperature + & Temperature control mode, 20：Temperature - & Temperature control mode, 21：System switch & Temperature - & Temperature control mode, 22：Temperature + & Temperature - & Temperature control mode, 23：System switch & Temperature + & Temperature - & Temperature control mode, 24：Fan & Temperature control mode, 25：System switch & Fan & Temperature control mode, 26：Temperature + & Fan & Temperature control mode, 27：System switch & Temperature + & Fan & Temperature control mode, 28：Temperature - & Fan & Temperature control mode, 29：System switch & Temperature - & Fan & Temperature control mode, 30：Temperature + & Temperature - & Fan & Temperature control mode, 31：System switch & Temperature + & Temperature - & Fan & Temperature control mode
			buffer.writeUInt8(0x00);
			if ([0, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].indexOf(payload.temporary_button_unlock_cfg.enable) === -1) {
				throw new Error('temporary_button_unlock_cfg.enable must be one of [0, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]');
			}
			// 0：Disable, 3：System switch & Temperature +, 5：System switch & Temperature -, 6：Temperature + & Temperature -, 7：System switch & Temperature + & Temperature -, 9：System switch & Fan, 10：Temperature + & Fan, 11：System switch & Temperature + & Fan, 12：Temperature - & Fan, 13：System switch & Temperature - & Fan, 14：Temperature + & Temperature - & Fan, 15：System switch & Temperature + & Temperature - & Fan, 17：System switch & Temperature control mode, 18：Temperature + & Temperature control mode, 19：System switch & Temperature + & Temperature control mode, 20：Temperature - & Temperature control mode, 21：System switch & Temperature - & Temperature control mode, 22：Temperature + & Temperature - & Temperature control mode, 23：System switch & Temperature + & Temperature - & Temperature control mode, 24：Fan & Temperature control mode, 25：System switch & Fan & Temperature control mode, 26：Temperature + & Fan & Temperature control mode, 27：System switch & Temperature + & Fan & Temperature control mode, 28：Temperature - & Fan & Temperature control mode, 29：System switch & Temperature - & Fan & Temperature control mode, 30：Temperature + & Temperature - & Fan & Temperature control mode, 31：System switch & Temperature + & Temperature - & Fan & Temperature control mode
			buffer.writeUInt8(payload.temporary_button_unlock_cfg.enable);
		}
		var bitOptions = 0;
		// 0：disable, 1：enable
		bitOptions |= payload.temporary_button_unlock_cfg.system << 0;

		// 0：disable, 1：enable
		bitOptions |= payload.temporary_button_unlock_cfg.temperature_up << 1;

		// 0：disable, 1：enable
		bitOptions |= payload.temporary_button_unlock_cfg.temperature_down << 2;

		// 0：disable, 1：enable
		bitOptions |= payload.temporary_button_unlock_cfg.fan << 3;
		buffer.writeUInt8(bitOptions);

		var bitOptions = 0;
		// 0：disable, 1：enable
		bitOptions |= payload.temporary_button_unlock_cfg.temperature_control << 4;

		if (isValid(payload.temporary_button_unlock_cfg.unlocking_duration)) {
			buffer.writeUInt8(0x97);
			buffer.writeUInt8(0x01);
			buffer.writeUInt8(bitOptions);
			buffer.writeUnknownDataType(payload.temporary_button_unlock_cfg.unlocking_duration);
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
		// 0：disable, 1：enable
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
	//0xc5
	if ('data_storage_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.data_storage_settings.enable)) {
			buffer.writeUInt8(0xc5);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.data_storage_settings.enable) === -1) {
				throw new Error('data_storage_settings.enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.data_storage_settings.enable);
		}
		if (isValid(payload.data_storage_settings.retransmission_enable)) {
			buffer.writeUInt8(0xc5);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x01);
			if ([0, 1].indexOf(payload.data_storage_settings.retransmission_enable) === -1) {
				throw new Error('data_storage_settings.retransmission_enable must be one of [0, 1]');
			}
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
	//0x79
	if ('temperature_calibration_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x79);
		if ([0, 1].indexOf(payload.temperature_calibration_settings.enable) === -1) {
			throw new Error('temperature_calibration_settings.enable must be one of [0, 1]');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.temperature_calibration_settings.enable);
		if (payload.temperature_calibration_settings.calibration_value < -80 || payload.temperature_calibration_settings.calibration_value > 80) {
			throw new Error('temperature_calibration_settings.calibration_value must be between -80 and 80');
		}
		buffer.writeInt16LE(payload.temperature_calibration_settings.calibration_value * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x9c
	if ('temperature_calibration_cfg' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.temperature_calibration_cfg.enable)) {
			buffer.writeUInt8(0x9c);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.temperature_calibration_cfg.enable) === -1) {
				throw new Error('temperature_calibration_cfg.enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.temperature_calibration_cfg.enable);
		}
		if (isValid(payload.temperature_calibration_cfg.calibration_value)) {
			buffer.writeUInt8(0x9c);
			buffer.writeUInt8(0x01);
			if (payload.temperature_calibration_cfg.calibration_value < -80 || payload.temperature_calibration_cfg.calibration_value > 80) {
				throw new Error('temperature_calibration_cfg.calibration_value must be between -80 and 80');
			}
			buffer.writeInt16LE(payload.temperature_calibration_cfg.calibration_value * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x7a
	if ('humidity_calibration_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x7a);
		if ([0, 1].indexOf(payload.humidity_calibration_settings.enable) === -1) {
			throw new Error('humidity_calibration_settings.enable must be one of [0, 1]');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.humidity_calibration_settings.enable);
		if (payload.humidity_calibration_settings.calibration_value < -100 || payload.humidity_calibration_settings.calibration_value > 100) {
			throw new Error('humidity_calibration_settings.calibration_value must be between -100 and 100');
		}
		buffer.writeInt16LE(payload.humidity_calibration_settings.calibration_value * 10);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x9d
	if ('humidity_calibration_cfg' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.humidity_calibration_cfg.enable)) {
			buffer.writeUInt8(0x9d);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.humidity_calibration_cfg.enable) === -1) {
				throw new Error('humidity_calibration_cfg.enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.humidity_calibration_cfg.enable);
		}
		if (isValid(payload.humidity_calibration_cfg.calibration_value)) {
			buffer.writeUInt8(0x9d);
			buffer.writeUInt8(0x01);
			if (payload.humidity_calibration_cfg.calibration_value < -100 || payload.humidity_calibration_cfg.calibration_value > 100) {
				throw new Error('humidity_calibration_cfg.calibration_value must be between -100 and 100');
			}
			buffer.writeInt16LE(payload.humidity_calibration_cfg.calibration_value * 10);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x76
	if ('temperature_alarm_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x76);
		if ([0, 1].indexOf(payload.temperature_alarm_settings.enable) === -1) {
			throw new Error('temperature_alarm_settings.enable must be one of [0, 1]');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.temperature_alarm_settings.enable);
		if ([0, 1, 2, 3, 4].indexOf(payload.temperature_alarm_settings.threshold_condition) === -1) {
			throw new Error('temperature_alarm_settings.threshold_condition must be one of [0, 1, 2, 3, 4]');
		}
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
	//0x99
	if ('threshold_alarm_cfg' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.threshold_alarm_cfg.enable)) {
			buffer.writeUInt8(0x99);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.threshold_alarm_cfg.enable) === -1) {
				throw new Error('threshold_alarm_cfg.enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.threshold_alarm_cfg.enable);
		}
		if (isValid(payload.threshold_alarm_cfg.mode)) {
			buffer.writeUInt8(0x99);
			// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A≤x≤B, 4:condition: x<A or x>B
			buffer.writeUInt8(0x01);
			if ([0, 1, 2, 3, 4].indexOf(payload.threshold_alarm_cfg.mode) === -1) {
				throw new Error('threshold_alarm_cfg.mode must be one of [0, 1, 2, 3, 4]');
			}
			// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A≤x≤B, 4:condition: x<A or x>B
			buffer.writeUInt8(payload.threshold_alarm_cfg.mode);
		}
		if (isValid(payload.threshold_alarm_cfg.min)) {
			buffer.writeUInt8(0x99);
			buffer.writeUInt8(0x02);
			if (payload.threshold_alarm_cfg.min < -20 || payload.threshold_alarm_cfg.min > 60) {
				throw new Error('threshold_alarm_cfg.min must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.threshold_alarm_cfg.min * 100);
		}
		if (isValid(payload.threshold_alarm_cfg.max)) {
			buffer.writeUInt8(0x99);
			buffer.writeUInt8(0x03);
			if (payload.threshold_alarm_cfg.max < -20 || payload.threshold_alarm_cfg.max > 60) {
				throw new Error('threshold_alarm_cfg.max must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.threshold_alarm_cfg.max * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x77
	if ('high_temperature_alarm_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x77);
		if ([0, 1].indexOf(payload.high_temperature_alarm_settings.enable) === -1) {
			throw new Error('high_temperature_alarm_settings.enable must be one of [0, 1]');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.high_temperature_alarm_settings.enable);
		if (payload.high_temperature_alarm_settings.difference_in_temperature < 1 || payload.high_temperature_alarm_settings.difference_in_temperature > 10) {
			throw new Error('high_temperature_alarm_settings.difference_in_temperature must be between 1 and 10');
		}
		buffer.writeInt16LE(payload.high_temperature_alarm_settings.difference_in_temperature * 100);
		if (payload.high_temperature_alarm_settings.duration < 0 || payload.high_temperature_alarm_settings.duration > 60) {
			throw new Error('high_temperature_alarm_settings.duration must be between 0 and 60');
		}
		buffer.writeUInt8(payload.high_temperature_alarm_settings.duration);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x9a
	if ('high_temperature_alarm_cfg' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.high_temperature_alarm_cfg.enable)) {
			buffer.writeUInt8(0x9a);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.high_temperature_alarm_cfg.enable) === -1) {
				throw new Error('high_temperature_alarm_cfg.enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.high_temperature_alarm_cfg.enable);
		}
		if (isValid(payload.high_temperature_alarm_cfg.delta)) {
			buffer.writeUInt8(0x9a);
			buffer.writeUInt8(0x01);
			if (payload.high_temperature_alarm_cfg.delta < 1 || payload.high_temperature_alarm_cfg.delta > 10) {
				throw new Error('high_temperature_alarm_cfg.delta must be between 1 and 10');
			}
			buffer.writeInt16LE(payload.high_temperature_alarm_cfg.delta * 100);
		}
		if (isValid(payload.high_temperature_alarm_cfg.duration)) {
			buffer.writeUInt8(0x9a);
			buffer.writeUInt8(0x02);
			if (payload.high_temperature_alarm_cfg.duration < 0 || payload.high_temperature_alarm_cfg.duration > 60) {
				throw new Error('high_temperature_alarm_cfg.duration must be between 0 and 60');
			}
			buffer.writeUInt8(payload.high_temperature_alarm_cfg.duration);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x78
	if ('low_temperature_alarm_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x78);
		if ([0, 1].indexOf(payload.low_temperature_alarm_settings.enable) === -1) {
			throw new Error('low_temperature_alarm_settings.enable must be one of [0, 1]');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.low_temperature_alarm_settings.enable);
		if (payload.low_temperature_alarm_settings.difference_in_temperature < 1 || payload.low_temperature_alarm_settings.difference_in_temperature > 10) {
			throw new Error('low_temperature_alarm_settings.difference_in_temperature must be between 1 and 10');
		}
		buffer.writeInt16LE(payload.low_temperature_alarm_settings.difference_in_temperature * 100);
		if (payload.low_temperature_alarm_settings.duration < 0 || payload.low_temperature_alarm_settings.duration > 60) {
			throw new Error('low_temperature_alarm_settings.duration must be between 0 and 60');
		}
		buffer.writeUInt8(payload.low_temperature_alarm_settings.duration);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x9b
	if ('low_temperature_alarm_cfg' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.low_temperature_alarm_cfg.enable)) {
			buffer.writeUInt8(0x9b);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.low_temperature_alarm_cfg.enable) === -1) {
				throw new Error('low_temperature_alarm_cfg.enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.low_temperature_alarm_cfg.enable);
		}
		if (isValid(payload.low_temperature_alarm_cfg.delta)) {
			buffer.writeUInt8(0x9b);
			buffer.writeUInt8(0x01);
			if (payload.low_temperature_alarm_cfg.delta < 1 || payload.low_temperature_alarm_cfg.delta > 10) {
				throw new Error('low_temperature_alarm_cfg.delta must be between 1 and 10');
			}
			buffer.writeInt16LE(payload.low_temperature_alarm_cfg.delta * 100);
		}
		if (isValid(payload.low_temperature_alarm_cfg.duration)) {
			buffer.writeUInt8(0x9b);
			buffer.writeUInt8(0x02);
			if (payload.low_temperature_alarm_cfg.duration < 0 || payload.low_temperature_alarm_cfg.duration > 60) {
				throw new Error('low_temperature_alarm_cfg.duration must be between 0 and 60');
			}
			buffer.writeUInt8(payload.low_temperature_alarm_cfg.duration);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x7b
	if ('schedule_settings' in payload) {
		var buffer = new Buffer();
		for (var schedule_settings_id = 0; schedule_settings_id < (payload.schedule_settings && payload.schedule_settings.length); schedule_settings_id++) {
			var schedule_settings_item = payload.schedule_settings[schedule_settings_id];
			var schedule_settings_item_id = schedule_settings_item.id;
			if (schedule_settings_item_id < 0 || schedule_settings_item_id > 15) {
				throw new Error('schedule_settings_item_id must be between 0 and 15');
			}

			if (isValid(schedule_settings_item.enable)) {
				buffer.writeUInt8(0x7b);
				buffer.writeUInt8(schedule_settings_item_id);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x00);
				if ([0, 1].indexOf(schedule_settings_item.enable) === -1) {
					throw new Error('enable must be one of [0, 1]');
				}
				// 0：disable, 1：enable
				buffer.writeUInt8(schedule_settings_item.enable);
			}
			if (isValid(schedule_settings_item.name_first)) {
				buffer.writeUInt8(0x7b);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x01);
				buffer.writeString(schedule_settings_item.name_first, 6);
			}
			if (isValid(schedule_settings_item.name_last)) {
				buffer.writeUInt8(0x7b);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x02);
				buffer.writeString(schedule_settings_item.name_last, 4);
			}
			if (isValid(schedule_settings_item.content)) {
				buffer.writeUInt8(0x7b);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x03);
				if ([0, 1, 2, 3].indexOf(schedule_settings_item.content.fan_mode) === -1) {
					throw new Error('content.fan_mode must be one of [0, 1, 2, 3]');
				}
				// 0：auto, 1：low, 2：medium, 3：high
				buffer.writeUInt8(schedule_settings_item.content.fan_mode);
				var bitOptions = 0;
				bitOptions |= schedule_settings_item.content.heat_target_temperature_enable << 0;

				bitOptions |= schedule_settings_item.content.heat_target_temperature * 100 << 1;
				buffer.writeInt16LE(bitOptions);

				var bitOptions = 0;
				bitOptions |= schedule_settings_item.content.cool_target_temperature_enable << 0;

				bitOptions |= schedule_settings_item.content.cool_target_temperature * 100 << 1;
				buffer.writeInt16LE(bitOptions);

				var bitOptions = 0;
				bitOptions |= schedule_settings_item.content.temperature_tolerance_enable << 0;

				bitOptions |= schedule_settings_item.content.temperature_tolerance * 100 << 1;
				buffer.writeInt16LE(bitOptions);

			}
			for (var cycle_settings_id = 0; cycle_settings_id < (schedule_settings_item.cycle_settings && schedule_settings_item.cycle_settings.length); cycle_settings_id++) {
				var cycle_settings_item = schedule_settings_item.cycle_settings[cycle_settings_id];
				var cycle_settings_item_id = cycle_settings_item.id;
				if (cycle_settings_item_id < 0 || cycle_settings_item_id > 15) {
					throw new Error('cycle_settings_item_id must be between 0 and 15');
				}

				buffer.writeUInt8(0x7b);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x04);
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
	//0x7c
	if ('interface_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x7c);
		if (payload.interface_settings.object < 0 || payload.interface_settings.object > 5) {
			throw new Error('interface_settings.object must be in range [0,5]');
		}
		buffer.writeUInt8(payload.interface_settings.object);
		if (payload.interface_settings.object == 0x00) {
			if ([1, 2].indexOf(payload.interface_settings.valve_4_pipe_10_v.cooling) === -1) {
				throw new Error('interface_settings.valve_4_pipe_10_v.cooling must be one of [1, 2]');
			}
			// 1：AO1, 2：AO2
			buffer.writeUInt8(payload.interface_settings.valve_4_pipe_10_v.cooling);
			if ([1, 2].indexOf(payload.interface_settings.valve_4_pipe_10_v.heating) === -1) {
				throw new Error('interface_settings.valve_4_pipe_10_v.heating must be one of [1, 2]');
			}
			// 1：AO1, 2：AO2
			buffer.writeUInt8(payload.interface_settings.valve_4_pipe_10_v.heating);
		}
		if (payload.interface_settings.object == 0x01) {
			if ([1, 2].indexOf(payload.interface_settings.valve_2_pipe_10_v.control) === -1) {
				throw new Error('interface_settings.valve_2_pipe_10_v.control must be one of [1, 2]');
			}
			// 1：AO1, 2：AO2
			buffer.writeUInt8(payload.interface_settings.valve_2_pipe_10_v.control);
		}
		if (payload.interface_settings.object == 0x02) {
			if ([1, 2].indexOf(payload.interface_settings.valve_2_pipe_10_v_fan_ec.control) === -1) {
				throw new Error('interface_settings.valve_2_pipe_10_v_fan_ec.control must be one of [1, 2]');
			}
			// 1：AO1, 2：AO2
			buffer.writeUInt8(payload.interface_settings.valve_2_pipe_10_v_fan_ec.control);
			if ([1, 2].indexOf(payload.interface_settings.valve_2_pipe_10_v_fan_ec.fan) === -1) {
				throw new Error('interface_settings.valve_2_pipe_10_v_fan_ec.fan must be one of [1, 2]');
			}
			// 1：AO1, 2：AO2
			buffer.writeUInt8(payload.interface_settings.valve_2_pipe_10_v_fan_ec.fan);
			if ([0, 3, 4, 5].indexOf(payload.interface_settings.valve_2_pipe_10_v_fan_ec.fan_power) === -1) {
				throw new Error('interface_settings.valve_2_pipe_10_v_fan_ec.fan_power must be one of [0, 3, 4, 5]');
			}
			// 0：None, 3：Q1, 4：Q2, 5：Q3
			buffer.writeUInt8(payload.interface_settings.valve_2_pipe_10_v_fan_ec.fan_power);
		}
		if (payload.interface_settings.object == 0x03) {
			if ([3, 4, 5].indexOf(payload.interface_settings.valve_4_pipe_2_wire_fan_ec.cooling) === -1) {
				throw new Error('interface_settings.valve_4_pipe_2_wire_fan_ec.cooling must be one of [3, 4, 5]');
			}
			// 3：Q1, 4：Q2, 5：Q3
			buffer.writeUInt8(payload.interface_settings.valve_4_pipe_2_wire_fan_ec.cooling);
			if ([3, 4, 5].indexOf(payload.interface_settings.valve_4_pipe_2_wire_fan_ec.heating) === -1) {
				throw new Error('interface_settings.valve_4_pipe_2_wire_fan_ec.heating must be one of [3, 4, 5]');
			}
			// 3：Q1, 4：Q2, 5：Q3
			buffer.writeUInt8(payload.interface_settings.valve_4_pipe_2_wire_fan_ec.heating);
			if ([1, 2].indexOf(payload.interface_settings.valve_4_pipe_2_wire_fan_ec.fan) === -1) {
				throw new Error('interface_settings.valve_4_pipe_2_wire_fan_ec.fan must be one of [1, 2]');
			}
			// 1：AO1, 2：AO2
			buffer.writeUInt8(payload.interface_settings.valve_4_pipe_2_wire_fan_ec.fan);
			if ([0, 3, 4, 5].indexOf(payload.interface_settings.valve_4_pipe_2_wire_fan_ec.fan_power) === -1) {
				throw new Error('interface_settings.valve_4_pipe_2_wire_fan_ec.fan_power must be one of [0, 3, 4, 5]');
			}
			// 0：None, 3：Q1, 4：Q2, 5：Q3
			buffer.writeUInt8(payload.interface_settings.valve_4_pipe_2_wire_fan_ec.fan_power);
		}
		if (payload.interface_settings.object == 0x04) {
			if ([3, 4, 5].indexOf(payload.interface_settings.valve_2_pipe_2_wire_fan_ec.control) === -1) {
				throw new Error('interface_settings.valve_2_pipe_2_wire_fan_ec.control must be one of [3, 4, 5]');
			}
			// 3：Q1, 4：Q2, 5：Q3
			buffer.writeUInt8(payload.interface_settings.valve_2_pipe_2_wire_fan_ec.control);
			if ([1, 2].indexOf(payload.interface_settings.valve_2_pipe_2_wire_fan_ec.fan) === -1) {
				throw new Error('interface_settings.valve_2_pipe_2_wire_fan_ec.fan must be one of [1, 2]');
			}
			// 1：AO1, 2：AO2
			buffer.writeUInt8(payload.interface_settings.valve_2_pipe_2_wire_fan_ec.fan);
			if ([0, 3, 4, 5].indexOf(payload.interface_settings.valve_2_pipe_2_wire_fan_ec.fan_power) === -1) {
				throw new Error('interface_settings.valve_2_pipe_2_wire_fan_ec.fan_power must be one of [0, 3, 4, 5]');
			}
			// 0：None, 3：Q1, 4：Q2, 5：Q3
			buffer.writeUInt8(payload.interface_settings.valve_2_pipe_2_wire_fan_ec.fan_power);
		}
		if (payload.interface_settings.object == 0x05) {
			if ([3, 4, 5].indexOf(payload.interface_settings.valve_2_pipe_3_wire_fan_ec.no) === -1) {
				throw new Error('interface_settings.valve_2_pipe_3_wire_fan_ec.no must be one of [3, 4, 5]');
			}
			// 3：Q1, 4：Q2, 5：Q3
			buffer.writeUInt8(payload.interface_settings.valve_2_pipe_3_wire_fan_ec.no);
			if ([3, 4, 5].indexOf(payload.interface_settings.valve_2_pipe_3_wire_fan_ec.nc) === -1) {
				throw new Error('interface_settings.valve_2_pipe_3_wire_fan_ec.nc must be one of [3, 4, 5]');
			}
			// 3：Q1, 4：Q2, 5：Q3
			buffer.writeUInt8(payload.interface_settings.valve_2_pipe_3_wire_fan_ec.nc);
			if ([1, 2].indexOf(payload.interface_settings.valve_2_pipe_3_wire_fan_ec.fan) === -1) {
				throw new Error('interface_settings.valve_2_pipe_3_wire_fan_ec.fan must be one of [1, 2]');
			}
			// 1：AO1, 2：AO2
			buffer.writeUInt8(payload.interface_settings.valve_2_pipe_3_wire_fan_ec.fan);
			if ([0, 3, 4, 5].indexOf(payload.interface_settings.valve_2_pipe_3_wire_fan_ec.fan_power) === -1) {
				throw new Error('interface_settings.valve_2_pipe_3_wire_fan_ec.fan_power must be one of [0, 3, 4, 5]');
			}
			// 0：None, 3：Q1, 4：Q2, 5：Q3
			buffer.writeUInt8(payload.interface_settings.valve_2_pipe_3_wire_fan_ec.fan_power);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x9e
	if ('interface_type_cfg' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x9e);
		if ([0, 1, 2, 3, 4, 5].indexOf(payload.interface_type_cfg) === -1) {
			throw new Error('interface_type_cfg must be one of [0, 1, 2, 3, 4, 5]');
		}
		// 0：Four-pipe, 0~10V Valve+Three-speeds Fan, 1：Two-pipe, 0~10V Valve+Three-speeds Fan, 2：Two-pipe, 0~10V Valve+EC Fan, 3：Four-pipe,Two-wire Valve+EC Fan, 4：Two-pipe, Two-wire Valve+EC Fan, 5：Two-pipe, Three-wire Valve+EC Fan
		buffer.writeUInt8(payload.interface_type_cfg);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x7d
	if ('valve_control_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.valve_control_settings.control_interval)) {
			buffer.writeUInt8(0x7d);
			buffer.writeUInt8(0x02);
			if (payload.valve_control_settings.control_interval < 1 || payload.valve_control_settings.control_interval > 60) {
				throw new Error('valve_control_settings.control_interval must be between 1 and 60');
			}
			buffer.writeUInt8(payload.valve_control_settings.control_interval);
		}
		if (isValid(payload.valve_control_settings.control_adjustment_range)) {
			buffer.writeUInt8(0x7d);
			buffer.writeUInt8(0x00);
			if (payload.valve_control_settings.control_adjustment_range < 1 || payload.valve_control_settings.control_adjustment_range > 15) {
				throw new Error('valve_control_settings.control_adjustment_range must be between 1 and 15');
			}
			buffer.writeInt16LE(payload.valve_control_settings.control_adjustment_range * 100);
		}
		if (isValid(payload.valve_control_settings.opening_range)) {
			buffer.writeUInt8(0x7d);
			buffer.writeUInt8(0x01);
			if (payload.valve_control_settings.opening_range.min < 0 || payload.valve_control_settings.opening_range.min > 100) {
				throw new Error('valve_control_settings.opening_range.min must be between 0 and 100');
			}
			buffer.writeUInt8(payload.valve_control_settings.opening_range.min);
			if (payload.valve_control_settings.opening_range.max < 0 || payload.valve_control_settings.opening_range.max > 100) {
				throw new Error('valve_control_settings.opening_range.max must be between 0 and 100');
			}
			buffer.writeUInt8(payload.valve_control_settings.opening_range.max);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x7e
	if ('fan_ec_control_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.fan_ec_control_settings.low_threshold)) {
			buffer.writeUInt8(0x7e);
			buffer.writeUInt8(0x00);
			if (payload.fan_ec_control_settings.low_threshold < 1 || payload.fan_ec_control_settings.low_threshold > 100) {
				throw new Error('fan_ec_control_settings.low_threshold must be between 1 and 100');
			}
			buffer.writeUInt8(payload.fan_ec_control_settings.low_threshold);
		}
		if (isValid(payload.fan_ec_control_settings.mid_threshold)) {
			buffer.writeUInt8(0x7e);
			buffer.writeUInt8(0x01);
			if (payload.fan_ec_control_settings.mid_threshold < 1 || payload.fan_ec_control_settings.mid_threshold > 100) {
				throw new Error('fan_ec_control_settings.mid_threshold must be between 1 and 100');
			}
			buffer.writeUInt8(payload.fan_ec_control_settings.mid_threshold);
		}
		if (isValid(payload.fan_ec_control_settings.high_threshold)) {
			buffer.writeUInt8(0x7e);
			buffer.writeUInt8(0x02);
			if (payload.fan_ec_control_settings.high_threshold < 1 || payload.fan_ec_control_settings.high_threshold > 100) {
				throw new Error('fan_ec_control_settings.high_threshold must be between 1 and 100');
			}
			buffer.writeUInt8(payload.fan_ec_control_settings.high_threshold);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x8e
	if ('fan_stop_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x8e);
		if ([0, 1].indexOf(payload.fan_stop_enable) === -1) {
			throw new Error('fan_stop_enable must be one of [0, 1]');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.fan_stop_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x8f
	if ('valve_output_0v_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x8f);
		if ([0, 1].indexOf(payload.valve_output_0v_enable) === -1) {
			throw new Error('valve_output_0v_enable must be one of [0, 1]');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.valve_output_0v_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x80
	if ('di_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x80);
		if ([0, 1].indexOf(payload.di_enable) === -1) {
			throw new Error('di_enable must be one of [0, 1]');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.di_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x81
	if ('di_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x81);
		if (payload.di_settings.object < 0 || payload.di_settings.object > 1) {
			throw new Error('di_settings.object must be in range [0,1]');
		}
		buffer.writeUInt8(payload.di_settings.object);
		if (payload.di_settings.object == 0x00) {
			if (payload.di_settings.card_control.type < 0 || payload.di_settings.card_control.type > 1) {
				throw new Error('di_settings.card_control.type must be in range [0,1]');
			}
			buffer.writeUInt8(payload.di_settings.card_control.type);
			if (payload.di_settings.card_control.type == 0x00) {
				if ([0, 1].indexOf(payload.di_settings.card_control.system_control.trigger_by_insertion) === -1) {
					throw new Error('di_settings.card_control.system_control.trigger_by_insertion must be one of [0, 1]');
				}
				// 0：system off, 1：system on
				buffer.writeUInt8(payload.di_settings.card_control.system_control.trigger_by_insertion);
			}
			if (payload.di_settings.card_control.type == 0x01) {
				if ([0, 1, 2, 3, 4, 5, 6, 7, 255].indexOf(payload.di_settings.card_control.insertion_plan.trigger_by_insertion) === -1) {
					throw new Error('di_settings.card_control.insertion_plan.trigger_by_insertion must be one of [0, 1, 2, 3, 4, 5, 6, 7, 255]');
				}
				// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8, 255：None
				buffer.writeUInt8(payload.di_settings.card_control.insertion_plan.trigger_by_insertion);
				if ([0, 1, 2, 3, 4, 5, 6, 7, 255].indexOf(payload.di_settings.card_control.insertion_plan.trigger_by_extraction) === -1) {
					throw new Error('di_settings.card_control.insertion_plan.trigger_by_extraction must be one of [0, 1, 2, 3, 4, 5, 6, 7, 255]');
				}
				// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8, 255：None
				buffer.writeUInt8(payload.di_settings.card_control.insertion_plan.trigger_by_extraction);
			}
		}
		if (payload.di_settings.object == 0x01) {
			if ([0, 1].indexOf(payload.di_settings.magnet_detection.magnet_type) === -1) {
				throw new Error('di_settings.magnet_detection.magnet_type must be one of [0, 1]');
			}
			// 0：NO, 1：NC
			buffer.writeUInt8(payload.di_settings.magnet_detection.magnet_type);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x82
	if ('window_opening_detection_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x82);
		if ([0, 1].indexOf(payload.window_opening_detection_enable) === -1) {
			throw new Error('window_opening_detection_enable must be one of [0, 1]');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.window_opening_detection_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x83
	if ('window_opening_detection_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x83);
		if (payload.window_opening_detection_settings.type < 0 || payload.window_opening_detection_settings.type > 1) {
			throw new Error('window_opening_detection_settings.type must be in range [0,1]');
		}
		buffer.writeUInt8(payload.window_opening_detection_settings.type);
		if (payload.window_opening_detection_settings.type == 0x00) {
			if (payload.window_opening_detection_settings.temperature_detection.difference_in_temperature < 1 || payload.window_opening_detection_settings.temperature_detection.difference_in_temperature > 10) {
				throw new Error('window_opening_detection_settings.temperature_detection.difference_in_temperature must be between 1 and 10');
			}
			buffer.writeInt16LE(payload.window_opening_detection_settings.temperature_detection.difference_in_temperature * 100);
			if (payload.window_opening_detection_settings.temperature_detection.stop_time < 1 || payload.window_opening_detection_settings.temperature_detection.stop_time > 60) {
				throw new Error('window_opening_detection_settings.temperature_detection.stop_time must be between 1 and 60');
			}
			buffer.writeUInt8(payload.window_opening_detection_settings.temperature_detection.stop_time);
		}
		if (payload.window_opening_detection_settings.type == 0x01) {
			if (payload.window_opening_detection_settings.magnet_detection.duration < 1 || payload.window_opening_detection_settings.magnet_detection.duration > 60) {
				throw new Error('window_opening_detection_settings.magnet_detection.duration must be between 1 and 60');
			}
			buffer.writeUInt8(payload.window_opening_detection_settings.magnet_detection.duration);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x84
	if ('freeze_protection_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x84);
		if ([0, 1].indexOf(payload.freeze_protection_settings.enable) === -1) {
			throw new Error('freeze_protection_settings.enable must be one of [0, 1]');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.freeze_protection_settings.enable);
		if (payload.freeze_protection_settings.target_temperature < 1 || payload.freeze_protection_settings.target_temperature > 5) {
			throw new Error('freeze_protection_settings.target_temperature must be between 1 and 5');
		}
		buffer.writeInt16LE(payload.freeze_protection_settings.target_temperature * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x98
	if ('freeze_protection_cfg' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.freeze_protection_cfg.enable)) {
			buffer.writeUInt8(0x98);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.freeze_protection_cfg.enable) === -1) {
				throw new Error('freeze_protection_cfg.enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.freeze_protection_cfg.enable);
		}
		if (isValid(payload.freeze_protection_cfg.target_temperature)) {
			buffer.writeUInt8(0x98);
			buffer.writeUInt8(0x01);
			if (payload.freeze_protection_cfg.target_temperature < 1 || payload.freeze_protection_cfg.target_temperature > 5) {
				throw new Error('freeze_protection_cfg.target_temperature must be between 1 and 5');
			}
			buffer.writeInt16LE(payload.freeze_protection_cfg.target_temperature * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x86
	if ('d2d_pairing_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x86);
		if ([0, 1].indexOf(payload.d2d_pairing_enable) === -1) {
			throw new Error('d2d_pairing_enable must be one of [0, 1]');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.d2d_pairing_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x87
	if ('d2d_pairing_settings' in payload) {
		var buffer = new Buffer();
		for (var d2d_pairing_settings_id = 0; d2d_pairing_settings_id < (payload.d2d_pairing_settings && payload.d2d_pairing_settings.length); d2d_pairing_settings_id++) {
			var d2d_pairing_settings_item = payload.d2d_pairing_settings[d2d_pairing_settings_id];
			var d2d_pairing_settings_item_id = d2d_pairing_settings_item.index;
			if (d2d_pairing_settings_item_id < 0 || d2d_pairing_settings_item_id > 4) {
				throw new Error('d2d_pairing_settings_item_id must be between 0 and 4');
			}

			if (isValid(d2d_pairing_settings_item.enable)) {
				buffer.writeUInt8(0x87);
				buffer.writeUInt8(d2d_pairing_settings_item_id);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x00);
				if ([0, 1].indexOf(d2d_pairing_settings_item.enable) === -1) {
					throw new Error('enable must be one of [0, 1]');
				}
				// 0：disable, 1：enable
				buffer.writeUInt8(d2d_pairing_settings_item.enable);
			}
			if (isValid(d2d_pairing_settings_item.deveui)) {
				buffer.writeUInt8(0x87);
				buffer.writeUInt8(d2d_pairing_settings_item_id);
				buffer.writeUInt8(0x01);
				buffer.writeHexString(d2d_pairing_settings_item.deveui, 8);
			}
			if (isValid(d2d_pairing_settings_item.name_first)) {
				buffer.writeUInt8(0x87);
				buffer.writeUInt8(d2d_pairing_settings_item_id);
				buffer.writeUInt8(0x02);
				buffer.writeString(d2d_pairing_settings_item.name_first, 8);
			}
			if (isValid(d2d_pairing_settings_item.name_last)) {
				buffer.writeUInt8(0x87);
				buffer.writeUInt8(d2d_pairing_settings_item_id);
				buffer.writeUInt8(0x03);
				buffer.writeString(d2d_pairing_settings_item.name_last, 8);
			}
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x88
	if ('d2d_master_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x88);
		if ([0, 1].indexOf(payload.d2d_master_enable) === -1) {
			throw new Error('d2d_master_enable must be one of [0, 1]');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.d2d_master_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x89
	if ('d2d_master_settings' in payload) {
		var buffer = new Buffer();
		for (var d2d_master_settings_id = 0; d2d_master_settings_id < (payload.d2d_master_settings && payload.d2d_master_settings.length); d2d_master_settings_id++) {
			var d2d_master_settings_item = payload.d2d_master_settings[d2d_master_settings_id];
			var d2d_master_settings_item_id = d2d_master_settings_item.trigger_condition;
			if ([0, 1, 2, 3, 4, 5, 6, 7, 16, 17].indexOf(d2d_master_settings_item_id) === -1) {
				throw new Error('d2d_master_settings_item_id must be one of [0, 1, 2, 3, 4, 5, 6, 7, 16, 17]');
			}

			buffer.writeUInt8(0x89);
			buffer.writeUInt8(d2d_master_settings_item_id);
			if ([0, 1].indexOf(d2d_master_settings_item.enable) === -1) {
				throw new Error('enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(d2d_master_settings_item.enable);
			buffer.writeHexString(d2d_master_settings_item.command, 2);
			if ([0, 1].indexOf(d2d_master_settings_item.uplink) === -1) {
				throw new Error('uplink must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(d2d_master_settings_item.uplink);
			if ([0, 1].indexOf(d2d_master_settings_item.control_time_enable) === -1) {
				throw new Error('control_time_enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(d2d_master_settings_item.control_time_enable);
			if (d2d_master_settings_item.control_time < 1 || d2d_master_settings_item.control_time > 1440) {
				throw new Error('control_time must be between 1 and 1440');
			}
			buffer.writeUInt16LE(d2d_master_settings_item.control_time);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x8a
	if ('d2d_slave_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x8a);
		if ([0, 1].indexOf(payload.d2d_slave_enable) === -1) {
			throw new Error('d2d_slave_enable must be one of [0, 1]');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.d2d_slave_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x8b
	if ('d2d_slave_settings' in payload) {
		var buffer = new Buffer();
		for (var d2d_slave_settings_id = 0; d2d_slave_settings_id < (payload.d2d_slave_settings && payload.d2d_slave_settings.length); d2d_slave_settings_id++) {
			var d2d_slave_settings_item = payload.d2d_slave_settings[d2d_slave_settings_id];
			var d2d_slave_settings_item_id = d2d_slave_settings_item.index;
			if (d2d_slave_settings_item_id < 0 || d2d_slave_settings_item_id > 15) {
				throw new Error('d2d_slave_settings_item_id must be between 0 and 15');
			}

			buffer.writeUInt8(0x8b);
			buffer.writeUInt8(d2d_slave_settings_item_id);
			if ([0, 1].indexOf(d2d_slave_settings_item.enable) === -1) {
				throw new Error('enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(d2d_slave_settings_item.enable);
			buffer.writeHexString(d2d_slave_settings_item.command, 2);
			if ([0, 1, 2, 3, 4, 5, 6, 7, 16, 17].indexOf(d2d_slave_settings_item.value) === -1) {
				throw new Error('value must be one of [0, 1, 2, 3, 4, 5, 6, 7, 16, 17]');
			}
			// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8, 16：System Off, 17：System On
			buffer.writeUInt8(d2d_slave_settings_item.value);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x91
	if ('screen_content_settings' in payload) {
		var buffer = new Buffer();
		for (var screen_content_settings_id = 0; screen_content_settings_id < (payload.screen_content_settings && payload.screen_content_settings.length); screen_content_settings_id++) {
			var screen_content_settings_item = payload.screen_content_settings[screen_content_settings_id];
			var screen_content_settings_item_id = screen_content_settings_item.object;
			if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34].indexOf(screen_content_settings_item_id) === -1) {
				throw new Error('screen_content_settings_item_id must be one of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34]');
			}

			buffer.writeUInt8(0x91);
			buffer.writeUInt8(screen_content_settings_item_id);
			if (screen_content_settings_item.length < 0 || screen_content_settings_item.length > 65535) {
				throw new Error('length must be between 0 and 65535');
			}
			buffer.writeUInt16LE(screen_content_settings_item.length);
			buffer.writeHexString(screen_content_settings_item.data, screen_content_settings_item.length, true);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xa2
	if ('screen_display_cfg' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.screen_display_cfg.display_data_enable_when_off)) {
			buffer.writeUInt8(0xa2);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.screen_display_cfg.display_data_enable_when_off) === -1) {
				throw new Error('screen_display_cfg.display_data_enable_when_off must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.screen_display_cfg.display_data_enable_when_off);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xa3
	if ('unilatera_tolerance_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xa3);
		if ([0, 1].indexOf(payload.unilatera_tolerance_enable) === -1) {
			throw new Error('unilatera_tolerance_enable must be one of [0, 1]');
		}
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.unilatera_tolerance_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xc3
	if ('active_data_reporting_cfg' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.active_data_reporting_cfg.enable)) {
			buffer.writeUInt8(0xc3);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.active_data_reporting_cfg.enable) === -1) {
				throw new Error('active_data_reporting_cfg.enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.active_data_reporting_cfg.enable);
		}
		if (isValid(payload.active_data_reporting_cfg.start_time)) {
			buffer.writeUInt8(0xc3);
			buffer.writeUInt8(0x01);
			if (payload.active_data_reporting_cfg.start_time < 0 || payload.active_data_reporting_cfg.start_time > 1439) {
				throw new Error('active_data_reporting_cfg.start_time must be between 0 and 1439');
			}
			buffer.writeUInt16LE(payload.active_data_reporting_cfg.start_time);
		}
		if (isValid(payload.active_data_reporting_cfg.times)) {
			buffer.writeUInt8(0xc3);
			buffer.writeUInt8(0x02);
			if (payload.active_data_reporting_cfg.times < 0 || payload.active_data_reporting_cfg.times > 12) {
				throw new Error('active_data_reporting_cfg.times must be between 0 and 12');
			}
			buffer.writeUInt8(payload.active_data_reporting_cfg.times);
		}
		if (isValid(payload.active_data_reporting_cfg.mode)) {
			buffer.writeUInt8(0xc3);
			// 0: Disable All, 1: Enable All, 2: Custom
			buffer.writeUInt8(0x03);
			if ([0, 1, 2].indexOf(payload.active_data_reporting_cfg.mode) === -1) {
				throw new Error('active_data_reporting_cfg.mode must be one of [0, 1, 2]');
			}
			// 0: Disable All, 1: Enable All, 2: Custom
			buffer.writeUInt8(payload.active_data_reporting_cfg.mode);
		}
		if (isValid(payload.active_data_reporting_cfg.custom_cfg)) {
			buffer.writeUInt8(0xc3);
			buffer.writeUInt8(0x04);
			if (payload.active_data_reporting_cfg.custom_cfg.cmd_cfg == 0x00) {
				if (payload.active_data_reporting_cfg.custom_cfg.cmd_cfg.custom < 96 || payload.active_data_reporting_cfg.custom_cfg.cmd_cfg.custom > 175) {
					throw new Error('active_data_reporting_cfg.custom_cfg.cmd_cfg.custom must be in range [96,175]');
				}
				buffer.writeUInt8(payload.active_data_reporting_cfg.custom_cfg.cmd_cfg.custom);
			}
			if (payload.active_data_reporting_cfg.custom_cfg.cmd_cfg == 0x01) {
				if (payload.active_data_reporting_cfg.custom_cfg.cmd_cfg.common < 197 || payload.active_data_reporting_cfg.custom_cfg.cmd_cfg.common > 200) {
					throw new Error('active_data_reporting_cfg.custom_cfg.cmd_cfg.common must be in range [197,200]');
				}
				buffer.writeUInt8(payload.active_data_reporting_cfg.custom_cfg.cmd_cfg.common);
			}
			if ([0, 1].indexOf(payload.active_data_reporting_cfg.custom_cfg.cmd_enable) === -1) {
				throw new Error('active_data_reporting_cfg.custom_cfg.cmd_enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.active_data_reporting_cfg.custom_cfg.cmd_enable);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xa5
	if ('temperature_control_permission_cfg' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.temperature_control_permission_cfg.temp_ctrl_permission)) {
			buffer.writeUInt8(0xa5);
			// 0: Thermostat Control, 1: Remote Control
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.temperature_control_permission_cfg.temp_ctrl_permission) === -1) {
				throw new Error('temperature_control_permission_cfg.temp_ctrl_permission must be one of [0, 1]');
			}
			// 0: Thermostat Control, 1: Remote Control
			buffer.writeUInt8(payload.temperature_control_permission_cfg.temp_ctrl_permission);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xa6
	if ('debug_commands' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.debug_commands.ambition_temp_enable)) {
			buffer.writeUInt8(0xa6);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x00);
			if ([0, 1].indexOf(payload.debug_commands.ambition_temp_enable) === -1) {
				throw new Error('debug_commands.ambition_temp_enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.debug_commands.ambition_temp_enable);
		}
		if (isValid(payload.debug_commands.ambition_temp_value)) {
			buffer.writeUInt8(0xa6);
			buffer.writeUInt8(0x01);
			if (payload.debug_commands.ambition_temp_value < -20 || payload.debug_commands.ambition_temp_value > 60) {
				throw new Error('debug_commands.ambition_temp_value must be between -20 and 60');
			}
			buffer.writeUInt16LE(payload.debug_commands.ambition_temp_value * 100);
		}
		if (isValid(payload.debug_commands.ambition_humi_enable)) {
			buffer.writeUInt8(0xa6);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x02);
			if ([0, 1].indexOf(payload.debug_commands.ambition_humi_enable) === -1) {
				throw new Error('debug_commands.ambition_humi_enable must be one of [0, 1]');
			}
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.debug_commands.ambition_humi_enable);
		}
		if (isValid(payload.debug_commands.ambition_humi_value)) {
			buffer.writeUInt8(0xa6);
			buffer.writeUInt8(0x03);
			if (payload.debug_commands.ambition_humi_value < 0 || payload.debug_commands.ambition_humi_value > 100) {
				throw new Error('debug_commands.ambition_humi_value must be between 0 and 100');
			}
			buffer.writeUInt16LE(payload.debug_commands.ambition_humi_value * 10);
		}
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
	//0xb6
	if ('reconnect' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb6);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x59
	if ('' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x59);
		if ([0, 1, 2, 3, 4, 5, 6, 7, 255].indexOf(payload.temperature_control_permission_cfg.switch_304.enable) === -1) {
			throw new Error('temperature_control_permission_cfg.switch_304.enable must be one of [0, 1, 2, 3, 4, 5, 6, 7, 255]');
		}
		// 0: Disable All, 1: Enable Q1 Interface, 2: Enable Q2 Interface, 3: Enable Q1 and Q2 Interfaces, 4: Enable Q3 Interface, 5: Enable Q1 and Q3 Interfaces, 6: Enable Q2 and Q3 Interfaces, 7: Enable Q1, Q2, and Q3 Interfaces, 255: Enable All Interfaces
		buffer.writeUInt8(payload.temperature_control_permission_cfg.switch_304.enable);
		if (payload.temperature_control_permission_cfg.switch_304.ao1_duty_cycle < 0 || payload.temperature_control_permission_cfg.switch_304.ao1_duty_cycle > 100) {
			throw new Error('temperature_control_permission_cfg.switch_304.ao1_duty_cycle must be in range [0,100]');
		}
		buffer.writeUInt8(payload.temperature_control_permission_cfg.switch_304.ao1_duty_cycle);
		if (payload.temperature_control_permission_cfg.switch_304.ao2_duty_cycle < 0 || payload.temperature_control_permission_cfg.switch_304.ao2_duty_cycle > 100) {
			throw new Error('temperature_control_permission_cfg.switch_304.ao2_duty_cycle must be in range [0,100]');
		}
		buffer.writeUInt8(payload.temperature_control_permission_cfg.switch_304.ao2_duty_cycle);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x5b
	if ('send_temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x5b);
		if (payload.send_temperature.temperature < -20 || payload.send_temperature.temperature > 60) {
			throw new Error('send_temperature.temperature must be between -20 and 60');
		}
		buffer.writeInt16LE(payload.send_temperature.temperature * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x5c
	if ('send_humidity' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x5c);
		if (payload.send_humidity.humidity < 0 || payload.send_humidity.humidity > 100) {
			throw new Error('send_humidity.humidity must be between 0 and 100');
		}
		buffer.writeUInt16LE(payload.send_humidity.humidity * 10);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x5d
	if ('update_open_windows_state' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x5d);
		if ([0, 1].indexOf(payload.update_open_windows_state.type) === -1) {
			throw new Error('update_open_windows_state.type must be one of [0, 1]');
		}
		// 0：Normal, 1：Open
		buffer.writeUInt8(payload.update_open_windows_state.type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x5e
	if ('insert_schedule' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x5e);
		if ([0, 1, 2, 3, 4, 5, 6, 7].indexOf(payload.insert_schedule.type) === -1) {
			throw new Error('insert_schedule.type must be one of [0, 1, 2, 3, 4, 5, 6, 7]');
		}
		// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8
		buffer.writeUInt8(payload.insert_schedule.type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xbe
	if ('reboot' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xbe);
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
		  "request_command_queries": "ef",
		  "request_query_all_configurations": "ee",
		  "historical_data_report": "ed",
		  "lorawan_configuration_settings": "cf",
		  "tsl_version": "df",
		  "product_name": "de",
		  "product_pn": "dd",
		  "product_sn": "db",
		  "version": "da",
		  "oem_id": "d9",
		  "product_frequency_band": "d8",
		  "battery_info": "b8",
		  "battery": "00",
		  "data_source": "04",
		  "temperature": "01",
		  "humidity": "02",
		  "target_temperature": "03",
		  "temperature_control_info": "05",
		  "temperature_control_valve_status": "06",
		  "fan_control_info": "07",
		  "execution_plan_id": "08",
		  "temperature_alarm": "09",
		  "temperature_alarm.collection_error": "0900",
		  "temperature_alarm.lower_range_error": "0901",
		  "temperature_alarm.over_range_error": "0902",
		  "temperature_alarm.no_data": "0903",
		  "temperature_alarm.lower_range_alarm_deactivation": "0910",
		  "temperature_alarm.lower_range_alarm_trigger": "0911",
		  "temperature_alarm.over_range_alarm_deactivation": "0912",
		  "temperature_alarm.over_range_alarm_trigger": "0913",
		  "temperature_alarm.within_range_alarm_deactivation": "0914",
		  "temperature_alarm.within_range_alarm_trigger": "0915",
		  "temperature_alarm.exceed_range_alarm_deactivation": "0916",
		  "temperature_alarm.exceed_range_alarm_trigger": "0917",
		  "temperature_alarm.persistent_low_temperature_alarm_deactivation": "0920",
		  "temperature_alarm.persistent_low_temperature_alarm_trigger": "0921",
		  "temperature_alarm.persistent_high_alarm_deactivation": "0922",
		  "temperature_alarm.persistent_high_alarm_trigger": "0923",
		  "temperature_alarm.anti_freeze_protection_deactivation": "0930",
		  "temperature_alarm.anti_freeze_protection_trigger": "0931",
		  "temperature_alarm.window_status_detection_deactivation": "0932",
		  "temperature_alarm.window_status_detection_trigger": "0933",
		  "humidity_alarm": "0a",
		  "humidity_alarm.collection_error": "0a00",
		  "humidity_alarm.no_data": "0a03",
		  "target_temperature_alarm": "0b",
		  "target_temperature_alarm.no_data": "0b03",
		  "temp_ctrl_auth_status": "0d",
		  "relay_status": "10",
		  "random_key": "c9",
		  "device_status": "c8",
		  "collection_interval": "60",
		  "collection_interval.seconds_of_time": "6000",
		  "collection_interval.minutes_of_time": "6001",
		  "reporting_interval": "62",
		  "reporting_interval.seconds_of_time": "6200",
		  "reporting_interval.minutes_of_time": "6201",
		  "reporting_interval_cfg": "a1",
		  "auto_p_enable": "c4",
		  "relay_changes_report_enable": "90",
		  "temperature_unit": "63",
		  "temperature_source": "85",
		  "temperature_source.lorawan_reception": "8502",
		  "temperature_source.d2d_reception": "8503",
		  "temperature_data_source_cfg": "a0",
		  "external_data_src_timeout_cfg": "a7",
		  "external_data_src_timeout_cfg.timeout": "a700",
		  "external_data_src_timeout_cfg.timeout_response": "a701",
		  "system_status": "67",
		  "mode_enable": "64",
		  "temperature_control_mode": "68",
		  "target_temperature_resolution": "69",
		  "heating_target_temperature": "6b",
		  "cooling_target_temperature": "6c",
		  "target_temperature_tolerance": "6a",
		  "heating_target_temperature_range": "6d",
		  "cooling_target_temperature_range": "6e",
		  "target_humidity_range": "70",
		  "temperature_control_dehumidification": "6f",
		  "temp_ctl_dehumi_cfg": "71",
		  "temp_ctl_dehumi_cfg.enable": "7100",
		  "temp_ctl_dehumi_cfg.temperature_tolerance": "7101",
		  "fan_control_mode": "72",
		  "fan_delay_close": "74",
		  "fan_delay_close_cfg": "7f",
		  "fan_delay_close_cfg.enable": "7f00",
		  "fan_delay_close_cfg.timeout_time": "7f01",
		  "fan_auto_mode_temperature_range": "73",
		  "fan_speed_ctl_delta_cfg": "9f",
		  "fan_speed_ctl_delta_cfg.delta1": "9f00",
		  "fan_speed_ctl_delta_cfg.delta2": "9f01",
		  "timed_system_control": "8c",
		  "timed_system_control.enable": "8c00",
		  "timed_system_control.start_cycle_settings": "8c01",
		  "timed_system_control.start_cycle_settings._item": "8c01xx",
		  "timed_system_control.end_cycle_settings": "8c02",
		  "timed_system_control.end_cycle_settings._item": "8c02xx",
		  "intelligent_display_enable": "65",
		  "screen_object_settings": "66",
		  "child_lock": "75",
		  "child_lock_enable_cfg": "96",
		  "child_lock_enable_cfg.enable": "9600",
		  "child_lock_enable_cfg.key_enable": "9601",
		  "temporary_unlock_settings": "8d",
		  "temporary_button_unlock_cfg": "97",
		  "temporary_button_unlock_cfg.enable": "9700",
		  "temporary_button_unlock_cfg.unlocking_duration": "9701",
		  "time_zone": "c7",
		  "daylight_saving_time": "c6",
		  "data_storage_settings": "c5",
		  "data_storage_settings.enable": "c500",
		  "data_storage_settings.retransmission_enable": "c501",
		  "data_storage_settings.retransmission_interval": "c502",
		  "data_storage_settings.retrieval_interval": "c503",
		  "temperature_calibration_settings": "79",
		  "temperature_calibration_cfg": "9c",
		  "temperature_calibration_cfg.enable": "9c00",
		  "temperature_calibration_cfg.calibration_value": "9c01",
		  "humidity_calibration_settings": "7a",
		  "humidity_calibration_cfg": "9d",
		  "humidity_calibration_cfg.enable": "9d00",
		  "humidity_calibration_cfg.calibration_value": "9d01",
		  "temperature_alarm_settings": "76",
		  "threshold_alarm_cfg": "99",
		  "threshold_alarm_cfg.enable": "9900",
		  "threshold_alarm_cfg.mode": "9901",
		  "threshold_alarm_cfg.min": "9902",
		  "threshold_alarm_cfg.max": "9903",
		  "high_temperature_alarm_settings": "77",
		  "high_temperature_alarm_cfg": "9a",
		  "high_temperature_alarm_cfg.enable": "9a00",
		  "high_temperature_alarm_cfg.delta": "9a01",
		  "high_temperature_alarm_cfg.duration": "9a02",
		  "low_temperature_alarm_settings": "78",
		  "low_temperature_alarm_cfg": "9b",
		  "low_temperature_alarm_cfg.enable": "9b00",
		  "low_temperature_alarm_cfg.delta": "9b01",
		  "low_temperature_alarm_cfg.duration": "9b02",
		  "schedule_settings": "7b",
		  "schedule_settings._item": "7bxx",
		  "schedule_settings._item.enable": "7bxx00",
		  "schedule_settings._item.name_first": "7bxx01",
		  "schedule_settings._item.name_last": "7bxx02",
		  "schedule_settings._item.content": "7bxx03",
		  "schedule_settings._item.cycle_settings": "7bxx04",
		  "schedule_settings._item.cycle_settings._item": "7bxx04xx",
		  "interface_settings": "7c",
		  "interface_settings.valve_4_pipe_10_v": "7c00",
		  "interface_settings.valve_2_pipe_10_v": "7c01",
		  "interface_settings.valve_2_pipe_10_v_fan_ec": "7c02",
		  "interface_settings.valve_4_pipe_2_wire_fan_ec": "7c03",
		  "interface_settings.valve_2_pipe_2_wire_fan_ec": "7c04",
		  "interface_settings.valve_2_pipe_3_wire_fan_ec": "7c05",
		  "interface_type_cfg": "9e",
		  "valve_control_settings": "7d",
		  "valve_control_settings.control_interval": "7d02",
		  "valve_control_settings.control_adjustment_range": "7d00",
		  "valve_control_settings.opening_range": "7d01",
		  "fan_ec_control_settings": "7e",
		  "fan_ec_control_settings.low_threshold": "7e00",
		  "fan_ec_control_settings.mid_threshold": "7e01",
		  "fan_ec_control_settings.high_threshold": "7e02",
		  "fan_stop_enable": "8e",
		  "valve_output_0v_enable": "8f",
		  "di_enable": "80",
		  "di_settings": "81",
		  "di_settings.card_control": "8100",
		  "di_settings.card_control.system_control": "810000",
		  "di_settings.card_control.insertion_plan": "810001",
		  "di_settings.magnet_detection": "8101",
		  "window_opening_detection_enable": "82",
		  "window_opening_detection_settings": "83",
		  "window_opening_detection_settings.temperature_detection": "8300",
		  "window_opening_detection_settings.magnet_detection": "8301",
		  "freeze_protection_settings": "84",
		  "freeze_protection_cfg": "98",
		  "freeze_protection_cfg.enable": "9800",
		  "freeze_protection_cfg.target_temperature": "9801",
		  "d2d_pairing_enable": "86",
		  "d2d_pairing_settings": "87",
		  "d2d_pairing_settings._item": "87xx",
		  "d2d_pairing_settings._item.enable": "87xx00",
		  "d2d_pairing_settings._item.deveui": "87xx01",
		  "d2d_pairing_settings._item.name_first": "87xx02",
		  "d2d_pairing_settings._item.name_last": "87xx03",
		  "d2d_master_enable": "88",
		  "d2d_master_settings": "89",
		  "d2d_master_settings._item": "89xx",
		  "d2d_slave_enable": "8a",
		  "d2d_slave_settings": "8b",
		  "d2d_slave_settings._item": "8bxx",
		  "screen_content_settings": "91",
		  "screen_content_settings._item": "91xx",
		  "screen_display_cfg": "a2",
		  "screen_display_cfg.display_data_enable_when_off": "a200",
		  "unilatera_tolerance_enable": "a3",
		  "active_data_reporting_cfg": "c3",
		  "active_data_reporting_cfg.enable": "c300",
		  "active_data_reporting_cfg.start_time": "c301",
		  "active_data_reporting_cfg.times": "c302",
		  "active_data_reporting_cfg.mode": "c303",
		  "active_data_reporting_cfg.custom_cfg": "c304",
		  "temperature_control_permission_cfg": "a5",
		  "temperature_control_permission_cfg.temp_ctrl_permission": "a500",
		  "debug_commands": "a6",
		  "debug_commands.ambition_temp_enable": "a600",
		  "debug_commands.ambition_temp_value": "a601",
		  "debug_commands.ambition_humi_enable": "a602",
		  "debug_commands.ambition_humi_value": "a603",
		  "set_time": "b7",
		  "clear_historical_data": "bd",
		  "stop_historical_data_retrieval": "bc",
		  "retrieve_historical_data_by_time_range": "bb",
		  "retrieve_historical_data_by_time": "ba",
		  "reconnect": "b6",
		  "temperature_control_permission_cfg.switch_304": "59",
		  "send_temperature": "5b",
		  "send_humidity": "5c",
		  "update_open_windows_state": "5d",
		  "insert_schedule": "5e",
		  "reboot": "be"
	};
}
function processTemperature(payload) {
	var allTemperatureProperties = {
    "temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "target_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.lower_range_alarm_deactivation.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.lower_range_alarm_trigger.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.over_range_alarm_deactivation.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.over_range_alarm_trigger.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.within_range_alarm_deactivation.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.within_range_alarm_trigger.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.exceed_range_alarm_deactivation.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.exceed_range_alarm_trigger.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.persistent_low_temperature_alarm_deactivation.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.persistent_low_temperature_alarm_trigger.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.persistent_high_alarm_deactivation.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.persistent_high_alarm_trigger.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.anti_freeze_protection_deactivation.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.anti_freeze_protection_trigger.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.window_status_detection_deactivation.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_alarm.window_status_detection_trigger.temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "heating_target_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "cooling_target_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "target_temperature_tolerance": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "heating_target_temperature_range.min": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "heating_target_temperature_range.max": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "cooling_target_temperature_range.min": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "cooling_target_temperature_range.max": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_control_dehumidification.temperature_tolerance": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temp_ctl_dehumi_cfg.temperature_tolerance": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "fan_auto_mode_temperature_range.speed_range_1": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "fan_auto_mode_temperature_range.speed_range_2": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "fan_speed_ctl_delta_cfg.delta1": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "fan_speed_ctl_delta_cfg.delta2": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_calibration_settings.calibration_value": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "temperature_calibration_cfg.calibration_value": {
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
    "threshold_alarm_cfg.min": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "threshold_alarm_cfg.max": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "high_temperature_alarm_settings.difference_in_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "high_temperature_alarm_cfg.delta": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "low_temperature_alarm_settings.difference_in_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "low_temperature_alarm_cfg.delta": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "schedule_settings._item.content.heat_target_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "schedule_settings._item.content.cool_target_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "schedule_settings._item.content.temperature_tolerance": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "valve_control_settings.control_adjustment_range": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "window_opening_detection_settings.temperature_detection.difference_in_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "freeze_protection_settings.target_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "freeze_protection_cfg.target_temperature": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "debug_commands.ambition_temp_value": {
        "coefficient": 0.01,
        "unitName": "℃"
    },
    "send_temperature.temperature": {
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