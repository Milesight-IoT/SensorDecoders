/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product GS601
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
	if ('vaping_index' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x01);
		if (payload.vaping_index < 0 || payload.vaping_index > 100) {
			throw new Error('vaping_index must be between 0 and 100');
		}
		buffer.writeUInt8(payload.vaping_index);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x02
	if ('vaping_index_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x02);
		buffer.writeUInt8(payload.vaping_index_alarm.type);
		if (payload.vaping_index_alarm.type == 0x00) {
		}
		if (payload.vaping_index_alarm.type == 0x01) {
		}
		if (payload.vaping_index_alarm.type == 0x02) {
		}
		if (payload.vaping_index_alarm.type == 0x10) {
			if (payload.vaping_index_alarm.alarm_deactivation.vaping_index < 0 || payload.vaping_index_alarm.alarm_deactivation.vaping_index > 100) {
				throw new Error('vaping_index_alarm.alarm_deactivation.vaping_index must be between 0 and 100');
			}
			buffer.writeUInt8(payload.vaping_index_alarm.alarm_deactivation.vaping_index);
		}
		if (payload.vaping_index_alarm.type == 0x11) {
			if (payload.vaping_index_alarm.alarm_trigger.vaping_index < 0 || payload.vaping_index_alarm.alarm_trigger.vaping_index > 100) {
				throw new Error('vaping_index_alarm.alarm_trigger.vaping_index must be between 0 and 100');
			}
			buffer.writeUInt8(payload.vaping_index_alarm.alarm_trigger.vaping_index);
		}
		if (payload.vaping_index_alarm.type == 0x20) {
		}
		if (payload.vaping_index_alarm.type == 0x21) {
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x03
	if ('pm1_0' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x03);
		if (payload.pm1_0 < 0 || payload.pm1_0 > 1000) {
			throw new Error('pm1_0 must be between 0 and 1000');
		}
		buffer.writeUInt16LE(payload.pm1_0);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x04
	if ('pm1_0_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x04);
		buffer.writeUInt8(payload.pm1_0_alarm.type);
		if (payload.pm1_0_alarm.type == 0x00) {
		}
		if (payload.pm1_0_alarm.type == 0x01) {
		}
		if (payload.pm1_0_alarm.type == 0x02) {
		}
		if (payload.pm1_0_alarm.type == 0x10) {
			if (payload.pm1_0_alarm.alarm_deactivation.pm1_0 < 0 || payload.pm1_0_alarm.alarm_deactivation.pm1_0 > 1000) {
				throw new Error('pm1_0_alarm.alarm_deactivation.pm1_0 must be between 0 and 1000');
			}
			buffer.writeUInt16LE(payload.pm1_0_alarm.alarm_deactivation.pm1_0);
		}
		if (payload.pm1_0_alarm.type == 0x11) {
			if (payload.pm1_0_alarm.alarm_trigger.pm1_0 < 0 || payload.pm1_0_alarm.alarm_trigger.pm1_0 > 1000) {
				throw new Error('pm1_0_alarm.alarm_trigger.pm1_0 must be between 0 and 1000');
			}
			buffer.writeUInt16LE(payload.pm1_0_alarm.alarm_trigger.pm1_0);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x05
	if ('pm2_5' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x05);
		if (payload.pm2_5 < 0 || payload.pm2_5 > 1000) {
			throw new Error('pm2_5 must be between 0 and 1000');
		}
		buffer.writeUInt16LE(payload.pm2_5);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x06
	if ('pm2_5_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x06);
		buffer.writeUInt8(payload.pm2_5_alarm.type);
		if (payload.pm2_5_alarm.type == 0x00) {
		}
		if (payload.pm2_5_alarm.type == 0x01) {
		}
		if (payload.pm2_5_alarm.type == 0x02) {
		}
		if (payload.pm2_5_alarm.type == 0x10) {
			if (payload.pm2_5_alarm.alarm_deactivation.pm2_5 < 0 || payload.pm2_5_alarm.alarm_deactivation.pm2_5 > 1000) {
				throw new Error('pm2_5_alarm.alarm_deactivation.pm2_5 must be between 0 and 1000');
			}
			buffer.writeUInt16LE(payload.pm2_5_alarm.alarm_deactivation.pm2_5);
		}
		if (payload.pm2_5_alarm.type == 0x11) {
			if (payload.pm2_5_alarm.alarm_trigger.pm2_5 < 0 || payload.pm2_5_alarm.alarm_trigger.pm2_5 > 1000) {
				throw new Error('pm2_5_alarm.alarm_trigger.pm2_5 must be between 0 and 1000');
			}
			buffer.writeUInt16LE(payload.pm2_5_alarm.alarm_trigger.pm2_5);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x07
	if ('pm10' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x07);
		if (payload.pm10 < 0 || payload.pm10 > 1000) {
			throw new Error('pm10 must be between 0 and 1000');
		}
		buffer.writeUInt16LE(payload.pm10);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x08
	if ('pm10_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x08);
		buffer.writeUInt8(payload.pm10_alarm.type);
		if (payload.pm10_alarm.type == 0x00) {
		}
		if (payload.pm10_alarm.type == 0x01) {
		}
		if (payload.pm10_alarm.type == 0x02) {
		}
		if (payload.pm10_alarm.type == 0x10) {
			if (payload.pm10_alarm.alarm_deactivation.pm10 < 0 || payload.pm10_alarm.alarm_deactivation.pm10 > 1000) {
				throw new Error('pm10_alarm.alarm_deactivation.pm10 must be between 0 and 1000');
			}
			buffer.writeUInt16LE(payload.pm10_alarm.alarm_deactivation.pm10);
		}
		if (payload.pm10_alarm.type == 0x11) {
			if (payload.pm10_alarm.alarm_trigger.pm10 < 0 || payload.pm10_alarm.alarm_trigger.pm10 > 1000) {
				throw new Error('pm10_alarm.alarm_trigger.pm10 must be between 0 and 1000');
			}
			buffer.writeUInt16LE(payload.pm10_alarm.alarm_trigger.pm10);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x09
	if ('temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x09);
		if (payload.temperature < -20 || payload.temperature > 60) {
			throw new Error('temperature must be between -20 and 60');
		}
		buffer.writeInt16LE(payload.temperature * 10);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0a
	if ('temperature_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0a);
		buffer.writeUInt8(payload.temperature_alarm.type);
		if (payload.temperature_alarm.type == 0x00) {
		}
		if (payload.temperature_alarm.type == 0x01) {
		}
		if (payload.temperature_alarm.type == 0x02) {
		}
		if (payload.temperature_alarm.type == 0x10) {
			if (payload.temperature_alarm.alarm_deactivation.temperature < -20 || payload.temperature_alarm.alarm_deactivation.temperature > 60) {
				throw new Error('temperature_alarm.alarm_deactivation.temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.temperature_alarm.alarm_deactivation.temperature * 10);
		}
		if (payload.temperature_alarm.type == 0x11) {
			if (payload.temperature_alarm.alarm_trigger.temperature < -20 || payload.temperature_alarm.alarm_trigger.temperature > 60) {
				throw new Error('temperature_alarm.alarm_trigger.temperature must be between -20 and 60');
			}
			buffer.writeInt16LE(payload.temperature_alarm.alarm_trigger.temperature * 10);
		}
		if (payload.temperature_alarm.type == 0x20) {
		}
		if (payload.temperature_alarm.type == 0x21) {
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0b
	if ('humidity' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0b);
		if (payload.humidity < 0 || payload.humidity > 100) {
			throw new Error('humidity must be between 0 and 100');
		}
		buffer.writeUInt16LE(payload.humidity * 10);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0c
	if ('humidity_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0c);
		buffer.writeUInt8(payload.humidity_alarm.type);
		if (payload.humidity_alarm.type == 0x00) {
		}
		if (payload.humidity_alarm.type == 0x01) {
		}
		if (payload.humidity_alarm.type == 0x02) {
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0d
	if ('tvoc' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0d);
		if (payload.tvoc < 0 || payload.tvoc > 2000) {
			throw new Error('tvoc must be between 0 and 2000');
		}
		buffer.writeUInt16LE(payload.tvoc);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0e
	if ('tvoc_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0e);
		buffer.writeUInt8(payload.tvoc_alarm.type);
		if (payload.tvoc_alarm.type == 0x00) {
		}
		if (payload.tvoc_alarm.type == 0x01) {
		}
		if (payload.tvoc_alarm.type == 0x02) {
		}
		if (payload.tvoc_alarm.type == 0x10) {
			if (payload.tvoc_alarm.alarm_deactivation.tvoc < 0 || payload.tvoc_alarm.alarm_deactivation.tvoc > 2000) {
				throw new Error('tvoc_alarm.alarm_deactivation.tvoc must be between 0 and 2000');
			}
			buffer.writeUInt16LE(payload.tvoc_alarm.alarm_deactivation.tvoc);
		}
		if (payload.tvoc_alarm.type == 0x11) {
			if (payload.tvoc_alarm.alarm_trigger.tvoc < 0 || payload.tvoc_alarm.alarm_trigger.tvoc > 2000) {
				throw new Error('tvoc_alarm.alarm_trigger.tvoc must be between 0 and 2000');
			}
			buffer.writeUInt16LE(payload.tvoc_alarm.alarm_trigger.tvoc);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0f
	if ('tamper_status' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0f);
		// 0：Normal, 1：Triggered
		buffer.writeUInt8(payload.tamper_status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x10
	if ('tamper_status_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x10);
		buffer.writeUInt8(payload.tamper_status_alarm.type);
		if (payload.tamper_status_alarm.type == 0x20) {
		}
		if (payload.tamper_status_alarm.type == 0x21) {
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x11
	if ('buzzer' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x11);
		// 0：Normal, 1：Triggered
		buffer.writeUInt8(payload.buzzer);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x12
	if ('occupancy_status' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x12);
		// 0：vacant, 1：occuppied
		buffer.writeUInt8(payload.occupancy_status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x20
	if ('tvoc_raw_data_1' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x20);
		buffer.writeUnknownDataType(payload.tvoc_raw_data_1.rmox_0);
		buffer.writeUnknownDataType(payload.tvoc_raw_data_1.rmox_1);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x21
	if ('tvoc_raw_data_2' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x21);
		buffer.writeUnknownDataType(payload.tvoc_raw_data_2.rmox_2);
		buffer.writeUnknownDataType(payload.tvoc_raw_data_2.rmox_3);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x22
	if ('tvoc_raw_data_3' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x22);
		buffer.writeUnknownDataType(payload.tvoc_raw_data_3.rmox_4);
		buffer.writeUnknownDataType(payload.tvoc_raw_data_3.rmox_5);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x23
	if ('tvoc_raw_data_4' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x23);
		buffer.writeUnknownDataType(payload.tvoc_raw_data_4.rmox_6);
		buffer.writeUnknownDataType(payload.tvoc_raw_data_4.rmox_7);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x24
	if ('tvoc_raw_data_5' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x24);
		buffer.writeUnknownDataType(payload.tvoc_raw_data_5.rmox_8);
		buffer.writeUnknownDataType(payload.tvoc_raw_data_5.rmox_9);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x25
	if ('tvoc_raw_data_6' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x25);
		buffer.writeUnknownDataType(payload.tvoc_raw_data_6.rmox_10);
		buffer.writeUnknownDataType(payload.tvoc_raw_data_6.rmox_11);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x26
	if ('tvoc_raw_data_7' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x26);
		buffer.writeUnknownDataType(payload.tvoc_raw_data_7.rmox_12);
		buffer.writeUnknownDataType(payload.tvoc_raw_data_7.zmod4510_rmox_3);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x27
	if ('tvoc_raw_data_8' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x27);
		buffer.writeUnknownDataType(payload.tvoc_raw_data_8.log_rcda);
		buffer.writeUnknownDataType(payload.tvoc_raw_data_8.rhtr);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x28
	if ('tvoc_raw_data_9' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x28);
		buffer.writeUnknownDataType(payload.tvoc_raw_data_9.temperature);
		buffer.writeUnknownDataType(payload.tvoc_raw_data_9.iaq);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x29
	if ('tvoc_raw_data_10' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x29);
		buffer.writeUnknownDataType(payload.tvoc_raw_data_10.tvoc);
		buffer.writeUnknownDataType(payload.tvoc_raw_data_10.etoh);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x2a
	if ('tvoc_raw_data_11' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x2a);
		buffer.writeUnknownDataType(payload.tvoc_raw_data_11.eco2);
		buffer.writeUnknownDataType(payload.tvoc_raw_data_11.rel_iaq);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x2b
	if ('pm_sensor_working_time' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x2b);
		buffer.writeUInt32LE(payload.pm_sensor_working_time);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xc9
	if ('random_key' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xc9);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.random_key);
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
	if ('reporting_interval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x60);
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
	//0x61
	if ('temperature_unit' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x61);
		// 0：℃, 1：℉
		buffer.writeUInt8(payload.temperature_unit);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x67
	if ('tamper_alarm_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x67);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.tamper_alarm_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x62
	if ('led_status' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x62);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.led_status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x63
	if ('buzzer_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x63);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.buzzer_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x64
	if ('buzzer_sleep' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.buzzer_sleep.item_1)) {
			buffer.writeUInt8(0x64);
			buffer.writeUInt8(0x01);
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.buzzer_sleep.item_1.enable);
			if (payload.buzzer_sleep.item_1.start_time < 0 || payload.buzzer_sleep.item_1.start_time > 1439) {
				throw new Error('buzzer_sleep.item_1.start_time must be between 0 and 1439');
			}
			buffer.writeUInt16LE(payload.buzzer_sleep.item_1.start_time);
			if (payload.buzzer_sleep.item_1.end_time < 0 || payload.buzzer_sleep.item_1.end_time > 1439) {
				throw new Error('buzzer_sleep.item_1.end_time must be between 0 and 1439');
			}
			buffer.writeUInt16LE(payload.buzzer_sleep.item_1.end_time);
		}
		if (isValid(payload.buzzer_sleep.item_2)) {
			buffer.writeUInt8(0x64);
			buffer.writeUInt8(0x02);
			// 0：disable, 1：enable
			buffer.writeUInt8(payload.buzzer_sleep.item_2.enable);
			if (payload.buzzer_sleep.item_2.start_time < 0 || payload.buzzer_sleep.item_2.start_time > 1439) {
				throw new Error('buzzer_sleep.item_2.start_time must be between 0 and 1439');
			}
			buffer.writeUInt16LE(payload.buzzer_sleep.item_2.start_time);
			if (payload.buzzer_sleep.item_2.end_time < 0 || payload.buzzer_sleep.item_2.end_time > 1439) {
				throw new Error('buzzer_sleep.item_2.end_time must be between 0 and 1439');
			}
			buffer.writeUInt16LE(payload.buzzer_sleep.item_2.end_time);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x65
	if ('buzzer_button_stop_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x65);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.buzzer_button_stop_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x66
	if ('buzzer_silent_time' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x66);
		if (payload.buzzer_silent_time < 0 || payload.buzzer_silent_time > 1440) {
			throw new Error('buzzer_silent_time must be between 0 and 1440');
		}
		buffer.writeUInt16LE(payload.buzzer_silent_time);
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
	//0x68
	if ('tvoc_raw_reporting_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x68);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.tvoc_raw_reporting_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x69
	if ('temperature_alarm_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x69);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.temperature_alarm_settings.enable);
		// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A<x<B, 4:condition: x<A or x>B
		buffer.writeUInt8(payload.temperature_alarm_settings.threshold_condition);
		if (payload.temperature_alarm_settings.threshold_min < -20 || payload.temperature_alarm_settings.threshold_min > 60) {
			throw new Error('temperature_alarm_settings.threshold_min must be between -20 and 60');
		}
		buffer.writeInt16LE(payload.temperature_alarm_settings.threshold_min * 10);
		if (payload.temperature_alarm_settings.threshold_max < -20 || payload.temperature_alarm_settings.threshold_max > 60) {
			throw new Error('temperature_alarm_settings.threshold_max must be between -20 and 60');
		}
		buffer.writeInt16LE(payload.temperature_alarm_settings.threshold_max * 10);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6a
	if ('pm1_0_alarm_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6a);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.pm1_0_alarm_settings.enable);
		// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A<x<B, 4:condition: x<A or x>B
		buffer.writeUInt8(payload.pm1_0_alarm_settings.threshold_condition);
		if (payload.pm1_0_alarm_settings.threshold_min < 0 || payload.pm1_0_alarm_settings.threshold_min > 1000) {
			throw new Error('pm1_0_alarm_settings.threshold_min must be between 0 and 1000');
		}
		buffer.writeInt16LE(payload.pm1_0_alarm_settings.threshold_min);
		if (payload.pm1_0_alarm_settings.threshold_max < 0 || payload.pm1_0_alarm_settings.threshold_max > 1000) {
			throw new Error('pm1_0_alarm_settings.threshold_max must be between 0 and 1000');
		}
		buffer.writeInt16LE(payload.pm1_0_alarm_settings.threshold_max);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6b
	if ('pm2_5_alarm_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6b);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.pm2_5_alarm_settings.enable);
		// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A<x<B, 4:condition: x<A or x>B
		buffer.writeUInt8(payload.pm2_5_alarm_settings.threshold_condition);
		if (payload.pm2_5_alarm_settings.threshold_min < 0 || payload.pm2_5_alarm_settings.threshold_min > 1000) {
			throw new Error('pm2_5_alarm_settings.threshold_min must be between 0 and 1000');
		}
		buffer.writeInt16LE(payload.pm2_5_alarm_settings.threshold_min);
		if (payload.pm2_5_alarm_settings.threshold_max < 0 || payload.pm2_5_alarm_settings.threshold_max > 1000) {
			throw new Error('pm2_5_alarm_settings.threshold_max must be between 0 and 1000');
		}
		buffer.writeInt16LE(payload.pm2_5_alarm_settings.threshold_max);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6c
	if ('pm10_alarm_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6c);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.pm10_alarm_settings.enable);
		// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A<x<B, 4:condition: x<A or x>B
		buffer.writeUInt8(payload.pm10_alarm_settings.threshold_condition);
		if (payload.pm10_alarm_settings.threshold_min < 0 || payload.pm10_alarm_settings.threshold_min > 1000) {
			throw new Error('pm10_alarm_settings.threshold_min must be between 0 and 1000');
		}
		buffer.writeInt16LE(payload.pm10_alarm_settings.threshold_min);
		if (payload.pm10_alarm_settings.threshold_max < 0 || payload.pm10_alarm_settings.threshold_max > 1000) {
			throw new Error('pm10_alarm_settings.threshold_max must be between 0 and 1000');
		}
		buffer.writeInt16LE(payload.pm10_alarm_settings.threshold_max);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6d
	if ('tvoc_alarm_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6d);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.tvoc_alarm_settings.enable);
		// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A<x<B, 4:condition: x<A or x>B
		buffer.writeUInt8(payload.tvoc_alarm_settings.threshold_condition);
		if (payload.tvoc_alarm_settings.threshold_min < 0 || payload.tvoc_alarm_settings.threshold_min > 2000) {
			throw new Error('tvoc_alarm_settings.threshold_min must be between 0 and 2000');
		}
		buffer.writeInt16LE(payload.tvoc_alarm_settings.threshold_min);
		if (payload.tvoc_alarm_settings.threshold_max < 0 || payload.tvoc_alarm_settings.threshold_max > 2000) {
			throw new Error('tvoc_alarm_settings.threshold_max must be between 0 and 2000');
		}
		buffer.writeInt16LE(payload.tvoc_alarm_settings.threshold_max);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6e
	if ('vaping_index_alarm_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6e);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.vaping_index_alarm_settings.enable);
		// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A<x<B, 4:condition: x<A or x>B
		buffer.writeUInt8(payload.vaping_index_alarm_settings.threshold_condition);
		if (payload.vaping_index_alarm_settings.threshold_min < 0 || payload.vaping_index_alarm_settings.threshold_min > 100) {
			throw new Error('vaping_index_alarm_settings.threshold_min must be between 0 and 100');
		}
		buffer.writeUInt8(payload.vaping_index_alarm_settings.threshold_min);
		if (payload.vaping_index_alarm_settings.threshold_max < 0 || payload.vaping_index_alarm_settings.threshold_max > 100) {
			throw new Error('vaping_index_alarm_settings.threshold_max must be between 0 and 100');
		}
		buffer.writeUInt8(payload.vaping_index_alarm_settings.threshold_max);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x6f
	if ('alarm_reporting_times' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x6f);
		if (payload.alarm_reporting_times < 1 || payload.alarm_reporting_times > 1000) {
			throw new Error('alarm_reporting_times must be between 1 and 1000');
		}
		buffer.writeUInt16LE(payload.alarm_reporting_times);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x70
	if ('alarm_deactivation_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x70);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.alarm_deactivation_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x71
	if ('temperature_calibration_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x71);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.temperature_calibration_settings.enable);
		if (payload.temperature_calibration_settings.calibration_value < -80 || payload.temperature_calibration_settings.calibration_value > 80) {
			throw new Error('temperature_calibration_settings.calibration_value must be between -80 and 80');
		}
		buffer.writeInt16LE(payload.temperature_calibration_settings.calibration_value * 10);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x72
	if ('humidity_calibration_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x72);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.humidity_calibration_settings.enable);
		if (payload.humidity_calibration_settings.calibration_value < -100 || payload.humidity_calibration_settings.calibration_value > 100) {
			throw new Error('humidity_calibration_settings.calibration_value must be between -100 and 100');
		}
		buffer.writeInt16LE(payload.humidity_calibration_settings.calibration_value * 10);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x73
	if ('pm1_0_calibration_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x73);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.pm1_0_calibration_settings.enable);
		if (payload.pm1_0_calibration_settings.calibration_value < -1000 || payload.pm1_0_calibration_settings.calibration_value > 1000) {
			throw new Error('pm1_0_calibration_settings.calibration_value must be between -1000 and 1000');
		}
		buffer.writeInt16LE(payload.pm1_0_calibration_settings.calibration_value);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x74
	if ('pm2_5_calibration_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x74);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.pm2_5_calibration_settings.enable);
		if (payload.pm2_5_calibration_settings.calibration_value < -1000 || payload.pm2_5_calibration_settings.calibration_value > 1000) {
			throw new Error('pm2_5_calibration_settings.calibration_value must be between -1000 and 1000');
		}
		buffer.writeInt16LE(payload.pm2_5_calibration_settings.calibration_value);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x75
	if ('pm10_calibration_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x75);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.pm10_calibration_settings.enable);
		if (payload.pm10_calibration_settings.calibration_value < -1000 || payload.pm10_calibration_settings.calibration_value > 1000) {
			throw new Error('pm10_calibration_settings.calibration_value must be between -1000 and 1000');
		}
		buffer.writeInt16LE(payload.pm10_calibration_settings.calibration_value);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x76
	if ('tvoc_calibration_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x76);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.tvoc_calibration_settings.enable);
		if (payload.tvoc_calibration_settings.calibration_value < -2000 || payload.tvoc_calibration_settings.calibration_value > 2000) {
			throw new Error('tvoc_calibration_settings.calibration_value must be between -2000 and 2000');
		}
		buffer.writeInt16LE(payload.tvoc_calibration_settings.calibration_value);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x77
	if ('vaping_index_calibration_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x77);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.vaping_index_calibration_settings.enable);
		if (payload.vaping_index_calibration_settings.calibration_value < -100 || payload.vaping_index_calibration_settings.calibration_value > 100) {
			throw new Error('vaping_index_calibration_settings.calibration_value must be between -100 and 100');
		}
		buffer.writeInt8(payload.vaping_index_calibration_settings.calibration_value);
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
	if ('retrieve_historical_data_by_time' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xbb);
		buffer.writeUInt32LE(payload.retrieve_historical_data_by_time.time);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xba
	if ('retrieve_historical_data_by_time_range' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xba);
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
	if ('stop_buzzer_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x5f);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x5e
	if ('execute_tvoc_self_clean' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x5e);
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
		  "battery": "00",
		  "vaping_index": "01",
		  "vaping_index_alarm": "02",
		  "pm1_0": "03",
		  "pm1_0_alarm": "04",
		  "pm2_5": "05",
		  "pm2_5_alarm": "06",
		  "pm10": "07",
		  "pm10_alarm": "08",
		  "temperature": "09",
		  "temperature_alarm": "0a",
		  "humidity": "0b",
		  "humidity_alarm": "0c",
		  "tvoc": "0d",
		  "tvoc_alarm": "0e",
		  "tamper_status": "0f",
		  "tamper_status_alarm": "10",
		  "buzzer": "11",
		  "occupancy_status": "12",
		  "tvoc_raw_data_1": "20",
		  "tvoc_raw_data_2": "21",
		  "tvoc_raw_data_3": "22",
		  "tvoc_raw_data_4": "23",
		  "tvoc_raw_data_5": "24",
		  "tvoc_raw_data_6": "25",
		  "tvoc_raw_data_7": "26",
		  "tvoc_raw_data_8": "27",
		  "tvoc_raw_data_9": "28",
		  "tvoc_raw_data_10": "29",
		  "tvoc_raw_data_11": "2a",
		  "pm_sensor_working_time": "2b",
		  "random_key": "c9",
		  "device_status": "c8",
		  "reporting_interval": "60",
		  "temperature_unit": "61",
		  "tamper_alarm_enable": "67",
		  "led_status": "62",
		  "buzzer_enable": "63",
		  "buzzer_sleep": "64",
		  "buzzer_sleep.item_1": "6401",
		  "buzzer_sleep.item_2": "6402",
		  "buzzer_button_stop_enable": "65",
		  "buzzer_silent_time": "66",
		  "time_zone": "c7",
		  "daylight_saving_time": "c6",
		  "tvoc_raw_reporting_enable": "68",
		  "temperature_alarm_settings": "69",
		  "pm1_0_alarm_settings": "6a",
		  "pm2_5_alarm_settings": "6b",
		  "pm10_alarm_settings": "6c",
		  "tvoc_alarm_settings": "6d",
		  "vaping_index_alarm_settings": "6e",
		  "alarm_reporting_times": "6f",
		  "alarm_deactivation_enable": "70",
		  "temperature_calibration_settings": "71",
		  "humidity_calibration_settings": "72",
		  "pm1_0_calibration_settings": "73",
		  "pm2_5_calibration_settings": "74",
		  "pm10_calibration_settings": "75",
		  "tvoc_calibration_settings": "76",
		  "vaping_index_calibration_settings": "77",
		  "reset": "bf",
		  "reboot": "be",
		  "clear_historical_data": "bd",
		  "stop_historical_data_retrieval": "bc",
		  "retrieve_historical_data_by_time": "bb",
		  "retrieve_historical_data_by_time_range": "ba",
		  "query_device_status": "b9",
		  "synchronize_time": "b8",
		  "set_time": "b7",
		  "reconnect": "b6",
		  "stop_buzzer_alarm": "5f",
		  "execute_tvoc_self_clean": "5e"
	};
}