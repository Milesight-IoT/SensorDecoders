/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product WT303
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
	//0x04
	if ('data_source' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x04);
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

		// 0：Standby, 1:Heat, 2:Cool
		bitOptions |= payload.temperature_control_info.status << 0;
		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0x06
	if ('temperature_control_valve_status' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x06);
		// 0：Close, 100：Open
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
		if (payload.humidity_alarm.type == 0x01) {
		}
		if (payload.humidity_alarm.type == 0x02) {
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
		buffer.writeUInt32LE(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0xc8
	if ('device_status' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xc8);
		// 0：Off, 1：On
		buffer.writeUInt8(payload.device_status);
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
	//0x62
	if ('reporting_interval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x62);
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
	//0xc4
	if ('auto_p_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xc4);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.auto_p_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x90
	if ('relay_changes_report_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x90);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.relay_changes_report_enable);
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
	//0x85
	if ('temperature_source' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x85);
		// 0：Embedded Temperature, 1：External NTC, 2：LoRa Receive, 3：D2D Receive
		buffer.writeUInt8(payload.temperature_source.type);
		if (payload.temperature_source.type == 0x02) {
			if (payload.temperature_source.lorawan_reception.timeout < 1 || payload.temperature_source.lorawan_reception.timeout > 60) {
				throw new Error('temperature_source.lorawan_reception.timeout must be between 1 and 60');
			}
			buffer.writeUInt8(payload.temperature_source.lorawan_reception.timeout);
			// 0: Keep Control, 1: Turn Off The Control, 2: Switch The Embedded Temperature
			buffer.writeUInt8(payload.temperature_source.lorawan_reception.timeout_response);
		}
		if (payload.temperature_source.type == 0x03) {
			if (payload.temperature_source.d2d_reception.timeout < 1 || payload.temperature_source.d2d_reception.timeout > 60) {
				throw new Error('temperature_source.d2d_reception.timeout must be between 1 and 60');
			}
			buffer.writeUInt8(payload.temperature_source.d2d_reception.timeout);
			// 0: Keep Control, 1: Turn Off The Control, 2: Switch The Embedded Temperature
			buffer.writeUInt8(payload.temperature_source.d2d_reception.timeout_response);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x67
	if ('system_status' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x67);
		// 0：Off, 1：On
		buffer.writeUInt8(payload.system_status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x64
	if ('mode_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x64);
		// 7：Ventilation、Heat、Cool, 3：Ventilation、Heat, 5：Ventilation、Cool
		buffer.writeUInt8(payload.mode_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x68
	if ('temperature_control_mode' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x68);
		// 0：Ventilation, 1：Heat, 2：Cool
		buffer.writeUInt8(payload.temperature_control_mode);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x69
	if ('target_temperature_resolution' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x69);
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
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.temperature_control_dehumidification.enable);
		if (payload.temperature_control_dehumidification.temperature_tolerance < 0.1 || payload.temperature_control_dehumidification.temperature_tolerance > 5) {
			throw new Error('temperature_control_dehumidification.temperature_tolerance must be between 0.1 and 5');
		}
		buffer.writeInt16LE(payload.temperature_control_dehumidification.temperature_tolerance * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x72
	if ('fan_control_mode' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x72);
		// 0：Auto, 1：Low, 2:Medium, 3:High
		buffer.writeUInt8(payload.fan_control_mode);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x74
	if ('fan_delay_close' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x74);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.fan_delay_close.enable);
		if (payload.fan_delay_close.time < 30 || payload.fan_delay_close.time > 3600) {
			throw new Error('fan_delay_close.time must be between 30 and 3600');
		}
		buffer.writeUInt16LE(payload.fan_delay_close.time);
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
	//0x8c
	if ('timed_system_control' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.timed_system_control.enable)) {
			buffer.writeUInt8(0x8c);
			// 0：disable, 1：enable
			buffer.writeUInt8(0x00);
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.timed_system_control.enable);
		}
		for (var start_cycle_settings_id = 0; start_cycle_settings_id < (payload.timed_system_control.start_cycle_settings && payload.timed_system_control.start_cycle_settings.length); start_cycle_settings_id++) {
			var start_cycle_settings_item = payload.timed_system_control.start_cycle_settings[start_cycle_settings_id];
			var start_cycle_settings_item_id = start_cycle_settings_item.id;
			buffer.writeUInt8(0x8c);
			buffer.writeUInt8(0x01);
			// 0：disable, 1：enable
			buffer.writeUInt8(start_cycle_settings_item.enable);
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
			buffer.writeUInt8(0x8c);
			buffer.writeUInt8(0x02);
			// 0：disable, 1：enable
			buffer.writeUInt8(end_cycle_settings_item.enable);
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
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.intelligent_display_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x66
	if ('screen_object_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x66);
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

		bitOptions |= payload.screen_object_settings.reserved << 4;
		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0x75
	if ('child_lock' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x75);
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
	//0x8d
	if ('temporary_unlock_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x8d);
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
	//0x79
	if ('temperature_calibration_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x79);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.temperature_calibration_settings.enable);
		if (payload.temperature_calibration_settings.calibration_value < -80 || payload.temperature_calibration_settings.calibration_value > 80) {
			throw new Error('temperature_calibration_settings.calibration_value must be between -80 and 80');
		}
		buffer.writeInt16LE(payload.temperature_calibration_settings.calibration_value * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x7a
	if ('humidity_calibration_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x7a);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.humidity_calibration_settings.enable);
		if (payload.humidity_calibration_settings.calibration_value < -100 || payload.humidity_calibration_settings.calibration_value > 100) {
			throw new Error('humidity_calibration_settings.calibration_value must be between -100 and 100');
		}
		buffer.writeInt16LE(payload.humidity_calibration_settings.calibration_value * 10);
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
	if ('high_temperature_alarm_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x77);
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
	//0x78
	if ('low_temperature_alarm_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x78);
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
	//0x7b
	if ('schedule_settings' in payload) {
		var buffer = new Buffer();
		for (var schedule_settings_id = 0; schedule_settings_id < (payload.schedule_settings && payload.schedule_settings.length); schedule_settings_id++) {
			var schedule_settings_item = payload.schedule_settings[schedule_settings_id];
			var schedule_settings_item_id = schedule_settings_item.id;
			if (isValid(schedule_settings_item.enable)) {
				buffer.writeUInt8(0x7b);
				buffer.writeUInt8(schedule_settings_item_id);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x00);
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
				buffer.writeUInt8(0x7b);
				buffer.writeUInt8(schedule_settings_item_id);
				buffer.writeUInt8(0x04);
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
		buffer.writeUInt8(payload.interface_settings.object);
		if (payload.interface_settings.object == 0x00) {
			if (payload.interface_settings.valve_4_pipe_2_wire.cooling < 1 || payload.interface_settings.valve_4_pipe_2_wire.cooling > 2) {
				throw new Error('interface_settings.valve_4_pipe_2_wire.cooling must be between 1 and 2');
			}
			// 1：V1/ NO, 2：V2/ NC
			buffer.writeUInt8(payload.interface_settings.valve_4_pipe_2_wire.cooling);
			if (payload.interface_settings.valve_4_pipe_2_wire.heating < 1 || payload.interface_settings.valve_4_pipe_2_wire.heating > 2) {
				throw new Error('interface_settings.valve_4_pipe_2_wire.heating must be between 1 and 2');
			}
			// 1：V1/ NO, 2：V2/ NC
			buffer.writeUInt8(payload.interface_settings.valve_4_pipe_2_wire.heating);
		}
		if (payload.interface_settings.object == 0x01) {
			if (payload.interface_settings.valve_2_pipe_2_wire.control < 1 || payload.interface_settings.valve_2_pipe_2_wire.control > 2) {
				throw new Error('interface_settings.valve_2_pipe_2_wire.control must be between 1 and 2');
			}
			// 1：V1/ NO, 2：V2/ NC
			buffer.writeUInt8(payload.interface_settings.valve_2_pipe_2_wire.control);
		}
		if (payload.interface_settings.object == 0x02) {
			if (payload.interface_settings.valve_2_pipe_3_wire.no < 1 || payload.interface_settings.valve_2_pipe_3_wire.no > 2) {
				throw new Error('interface_settings.valve_2_pipe_3_wire.no must be between 1 and 2');
			}
			// 1：V1/ NO, 2：V2/ NC
			buffer.writeUInt8(payload.interface_settings.valve_2_pipe_3_wire.no);
			if (payload.interface_settings.valve_2_pipe_3_wire.nc < 1 || payload.interface_settings.valve_2_pipe_3_wire.nc > 2) {
				throw new Error('interface_settings.valve_2_pipe_3_wire.nc must be between 1 and 2');
			}
			// 1：V1/ NO, 2：V2/ NC
			buffer.writeUInt8(payload.interface_settings.valve_2_pipe_3_wire.nc);
		}
		if (payload.interface_settings.object == 0x03) {
			// 1：V1/ NO, 2：V2/ NC
			buffer.writeUInt8(payload.interface_settings.valve_2_pipe_heat_vire_2_wire.control);
			// 1：V1/ NO, 2：V2/ NC
			buffer.writeUInt8(payload.interface_settings.valve_2_pipe_heat_vire_2_wire.heat_vire);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x8e
	if ('fan_stop_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x8e);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.fan_stop_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x80
	if ('di_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x80);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.di_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x81
	if ('di_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x81);
		buffer.writeUInt8(payload.di_settings.object);
		if (payload.di_settings.object == 0x00) {
			buffer.writeUInt8(payload.di_settings.card_control.type);
			if (payload.di_settings.card_control.type == 0x00) {
				// 0：system off, 1：system on
				buffer.writeUInt8(payload.di_settings.card_control.system_control.trigger_by_insertion);
			}
			if (payload.di_settings.card_control.type == 0x01) {
				// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8, 255：None
				buffer.writeUInt8(payload.di_settings.card_control.insertion_plan.trigger_by_insertion);
				// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8, 255：None
				buffer.writeUInt8(payload.di_settings.card_control.insertion_plan.trigger_by_extraction);
			}
		}
		if (payload.di_settings.object == 0x01) {
			// 0：NO, 1：NC
			buffer.writeUInt8(payload.di_settings.magnet_detection.magnet_type);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x82
	if ('window_opening_detection_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x82);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.window_opening_detection_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x83
	if ('window_opening_detection_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x83);
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
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.freeze_protection_settings.enable);
		if (payload.freeze_protection_settings.target_temperature < 1 || payload.freeze_protection_settings.target_temperature > 5) {
			throw new Error('freeze_protection_settings.target_temperature must be between 1 and 5');
		}
		buffer.writeInt16LE(payload.freeze_protection_settings.target_temperature * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x86
	if ('d2d_pairing_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x86);
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
			if (isValid(d2d_pairing_settings_item.enable)) {
				buffer.writeUInt8(0x87);
				buffer.writeUInt8(d2d_pairing_settings_item_id);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x00);
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
			buffer.writeUInt8(0x89);
			buffer.writeUInt8(d2d_master_settings_item_id);
			// 0：disable, 1：enable
			buffer.writeUInt8(d2d_master_settings_item.enable);
			buffer.writeHexString(d2d_master_settings_item.command, 2);
			// 0：disable, 1：enable
			buffer.writeUInt8(d2d_master_settings_item.uplink);
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
			buffer.writeUInt8(0x8b);
			buffer.writeUInt8(d2d_slave_settings_item_id);
			// 0：disable, 1：enable
			buffer.writeUInt8(d2d_slave_settings_item.enable);
			buffer.writeHexString(d2d_slave_settings_item.command, 2);
			// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8, 16：System Off, 17：System On
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
	//0xb6
	if ('reconnect' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb6);
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
		// 0：Normal, 1：Open
		buffer.writeUInt8(payload.update_open_windows_state.type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x5e
	if ('insert_schedule' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x5e);
		// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8
		buffer.writeUInt8(payload.insert_schedule.type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x5f
	if ('delete_schedule' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x5f);
		// 0：Schedule1, 1：Schedule2, 2：Schedule3, 3：Schedule4, 4：Schedule5, 5：Schedule6, 6：Schedule7, 7：Schedule8, 255：Reset All 
		buffer.writeUInt8(payload.delete_schedule.type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xbe
	if ('reboot' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xbe);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x11
	if ('pipe_temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x11);
		if (payload.pipe_temperature < -20 || payload.pipe_temperature > 60) {
			throw new Error('pipe_temperature must be between -20 and 60');
		}
		buffer.writeInt16LE(payload.pipe_temperature * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x12
	if ('pipe_temperature_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x12);
		buffer.writeUInt8(payload.pipe_temperature_alarm.type);
		if (payload.pipe_temperature_alarm.type == 0x00) {
		}
		if (payload.pipe_temperature_alarm.type == 0x01) {
		}
		if (payload.pipe_temperature_alarm.type == 0x02) {
		}
		if (payload.pipe_temperature_alarm.type == 0x03) {
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x93
	if ('heater_switch_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x93);
		if (payload.heater_switch_settings.switch_time < 1 || payload.heater_switch_settings.switch_time > 60) {
			throw new Error('heater_switch_settings.switch_time must be between 1 and 60');
		}
		buffer.writeUnknownDataType(payload.heater_switch_settings.switch_time);
		if (payload.heater_switch_settings.switch_temp < 20 || payload.heater_switch_settings.switch_temp > 60) {
			throw new Error('heater_switch_settings.switch_temp must be between 20 and 60');
		}
		buffer.writeUnknownDataType(payload.heater_switch_settings.switch_temp * 100);
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
		  "request_check_order": "fe",
		  "request_full_inspection": "f4",
		  "request_full_inspection.start_inspection": "f400",
		  "request_full_inspection.control": "f401",
		  "request_full_inspection.reading": "f402",
		  "request_full_inspection.end_inspection": "f403",
		  "request_command_queries": "ef",
		  "all_configurations_request_by_device": "ee",
		  "lorawan_configuration_settings": "cf",
		  "lorawan_configuration_settings.mode": "cf00",
		  "tsl_version": "df",
		  "product_sn": "db",
		  "version": "da",
		  "oem_id": "d9",
		  "data_source": "04",
		  "temperature": "01",
		  "humidity": "02",
		  "target_temperature": "03",
		  "temperature_control_info": "05",
		  "temperature_control_valve_status": "06",
		  "fan_control_info": "07",
		  "execution_plan_id": "08",
		  "temperature_alarm": "09",
		  "humidity_alarm": "0a",
		  "target_temperature_alarm": "0b",
		  "relay_status": "10",
		  "device_status": "c8",
		  "collection_interval": "60",
		  "reporting_interval": "62",
		  "auto_p_enable": "c4",
		  "relay_changes_report_enable": "90",
		  "temperature_unit": "63",
		  "temperature_source": "85",
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
		  "fan_control_mode": "72",
		  "fan_delay_close": "74",
		  "fan_auto_mode_temperature_range": "73",
		  "timed_system_control": "8c",
		  "timed_system_control.enable": "8c00",
		  "timed_system_control.start_cycle_settings": "8c01",
		  "timed_system_control.start_cycle_settings._item": "8c01xx",
		  "timed_system_control.end_cycle_settings": "8c02",
		  "timed_system_control.end_cycle_settings._item": "8c02xx",
		  "intelligent_display_enable": "65",
		  "screen_object_settings": "66",
		  "child_lock": "75",
		  "temporary_unlock_settings": "8d",
		  "time_zone": "c7",
		  "daylight_saving_time": "c6",
		  "data_storage_settings": "c5",
		  "data_storage_settings.enable": "c500",
		  "data_storage_settings.retransmission_enable": "c501",
		  "data_storage_settings.retransmission_interval": "c502",
		  "data_storage_settings.retrieval_interval": "c503",
		  "temperature_calibration_settings": "79",
		  "humidity_calibration_settings": "7a",
		  "temperature_alarm_settings": "76",
		  "high_temperature_alarm_settings": "77",
		  "low_temperature_alarm_settings": "78",
		  "schedule_settings": "7b",
		  "schedule_settings._item": "7bxx",
		  "schedule_settings._item.enable": "7bxx00",
		  "schedule_settings._item.name_first": "7bxx01",
		  "schedule_settings._item.name_last": "7bxx02",
		  "schedule_settings._item.content": "7bxx03",
		  "schedule_settings._item.cycle_settings": "7bxx04",
		  "schedule_settings._item.cycle_settings._item": "7bxx04xx",
		  "interface_settings": "7c",
		  "fan_stop_enable": "8e",
		  "di_enable": "80",
		  "di_settings": "81",
		  "window_opening_detection_enable": "82",
		  "window_opening_detection_settings": "83",
		  "freeze_protection_settings": "84",
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
		  "query_device_status": "b9",
		  "synchronize_time": "b8",
		  "clear_historical_data": "bd",
		  "stop_historical_data_retrieval": "bc",
		  "retrieve_historical_data_by_time_range": "bb",
		  "retrieve_historical_data_by_time": "ba",
		  "reconnect": "b6",
		  "send_temperature": "5b",
		  "send_humidity": "5c",
		  "update_open_windows_state": "5d",
		  "insert_schedule": "5e",
		  "delete_schedule": "5f",
		  "reboot": "be",
		  "pipe_temperature": "11",
		  "pipe_temperature_alarm": "12",
		  "heater_switch_settings": "93"
	};
}