/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product GS601
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
			case 0xfe:
				decoded.check_order_reply = decoded.check_order_reply || {};
				decoded.check_order_reply.order = readUInt8(bytes, counterObj, 1);
				break;
			case 0xf4:
				decoded.full_inspection_reply = decoded.full_inspection_reply || {};
				var full_inspection_reply_command = readUInt8(bytes, counterObj, 1);
				if (full_inspection_reply_command == 0x00) {
					decoded.full_inspection_reply.start_inspection = decoded.full_inspection_reply.start_inspection || {};
					// 0：success, 1：failed
					decoded.full_inspection_reply.start_inspection.result = readUInt8(bytes, counterObj, 1);
				}
				if (full_inspection_reply_command == 0x01) {
					decoded.full_inspection_reply.control = decoded.full_inspection_reply.control || {};
					// 0：success, 1：failed
					decoded.full_inspection_reply.control.result = readUInt8(bytes, counterObj, 1);
				}
				if (full_inspection_reply_command == 0x02) {
					decoded.full_inspection_reply.reading = decoded.full_inspection_reply.reading || {};
					decoded.full_inspection_reply.reading.length = readUInt16LE(bytes, counterObj, 2);
					decoded.full_inspection_reply.reading.data = readBytes(bytes, counterObj, decoded.full_inspection_reply.reading.length);
				}
				if (full_inspection_reply_command == 0x03) {
					decoded.full_inspection_reply.end_inspection = decoded.full_inspection_reply.end_inspection || {};
					// 0：success, 1：failed
					decoded.full_inspection_reply.end_inspection.result = readUInt8(bytes, counterObj, 1);
				}
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
			case 0xd9:
				decoded.oem_id = readHexString(bytes, counterObj, 2);
				break;
			case 0x00:
				decoded.battery = readUInt8(bytes, counterObj, 1);
				break;
			case 0x01:
				decoded.vaping_index = readUInt8(bytes, counterObj, 1);
				break;
			case 0x02:
				decoded.vaping_index_alarm = decoded.vaping_index_alarm || {};
				decoded.vaping_index_alarm.type = readUInt8(bytes, counterObj, 1);
				if (decoded.vaping_index_alarm.type == 0x00) {
					decoded.vaping_index_alarm.collection_error = decoded.vaping_index_alarm.collection_error || {};
				}
				if (decoded.vaping_index_alarm.type == 0x01) {
					decoded.vaping_index_alarm.lower_range_error = decoded.vaping_index_alarm.lower_range_error || {};
				}
				if (decoded.vaping_index_alarm.type == 0x02) {
					decoded.vaping_index_alarm.over_range_error = decoded.vaping_index_alarm.over_range_error || {};
				}
				if (decoded.vaping_index_alarm.type == 0x10) {
					decoded.vaping_index_alarm.alarm_deactivation = decoded.vaping_index_alarm.alarm_deactivation || {};
					decoded.vaping_index_alarm.alarm_deactivation.vaping_index = readUInt8(bytes, counterObj, 1);
					decoded.vaping_index = decoded.vaping_index_alarm.alarm_deactivation.vaping_index;
				}
				if (decoded.vaping_index_alarm.type == 0x11) {
					decoded.vaping_index_alarm.alarm_trigger = decoded.vaping_index_alarm.alarm_trigger || {};
					decoded.vaping_index_alarm.alarm_trigger.vaping_index = readUInt8(bytes, counterObj, 1);
					decoded.vaping_index = decoded.vaping_index_alarm.alarm_trigger.vaping_index;
				}
				if (decoded.vaping_index_alarm.type == 0x20) {
					decoded.vaping_index_alarm.interference_alarm_deactivation = decoded.vaping_index_alarm.interference_alarm_deactivation || {};
				}
				if (decoded.vaping_index_alarm.type == 0x21) {
					decoded.vaping_index_alarm.interference_alarm_trigger = decoded.vaping_index_alarm.interference_alarm_trigger || {};
				}
				break;
			case 0x03:
				decoded.pm1_0 = readUInt16LE(bytes, counterObj, 2);
				break;
			case 0x04:
				decoded.pm1_0_alarm = decoded.pm1_0_alarm || {};
				decoded.pm1_0_alarm.type = readUInt8(bytes, counterObj, 1);
				if (decoded.pm1_0_alarm.type == 0x00) {
					decoded.pm1_0_alarm.collection_error = decoded.pm1_0_alarm.collection_error || {};
				}
				if (decoded.pm1_0_alarm.type == 0x01) {
					decoded.pm1_0_alarm.lower_range_error = decoded.pm1_0_alarm.lower_range_error || {};
				}
				if (decoded.pm1_0_alarm.type == 0x02) {
					decoded.pm1_0_alarm.over_range_error = decoded.pm1_0_alarm.over_range_error || {};
				}
				if (decoded.pm1_0_alarm.type == 0x10) {
					decoded.pm1_0_alarm.alarm_deactivation = decoded.pm1_0_alarm.alarm_deactivation || {};
					decoded.pm1_0_alarm.alarm_deactivation.pm1_0 = readUInt16LE(bytes, counterObj, 2);
					decoded.pm1_0 = decoded.pm1_0_alarm.alarm_deactivation.pm1_0;
				}
				if (decoded.pm1_0_alarm.type == 0x11) {
					decoded.pm1_0_alarm.alarm_trigger = decoded.pm1_0_alarm.alarm_trigger || {};
					decoded.pm1_0_alarm.alarm_trigger.pm1_0 = readUInt16LE(bytes, counterObj, 2);
					decoded.pm1_0 = decoded.pm1_0_alarm.alarm_trigger.pm1_0;
				}
				break;
			case 0x05:
				decoded.pm2_5 = readUInt16LE(bytes, counterObj, 2);
				break;
			case 0x06:
				decoded.pm2_5_alarm = decoded.pm2_5_alarm || {};
				decoded.pm2_5_alarm.type = readUInt8(bytes, counterObj, 1);
				if (decoded.pm2_5_alarm.type == 0x00) {
					decoded.pm2_5_alarm.collection_error = decoded.pm2_5_alarm.collection_error || {};
				}
				if (decoded.pm2_5_alarm.type == 0x01) {
					decoded.pm2_5_alarm.lower_range_error = decoded.pm2_5_alarm.lower_range_error || {};
				}
				if (decoded.pm2_5_alarm.type == 0x02) {
					decoded.pm2_5_alarm.over_range_error = decoded.pm2_5_alarm.over_range_error || {};
				}
				if (decoded.pm2_5_alarm.type == 0x10) {
					decoded.pm2_5_alarm.alarm_deactivation = decoded.pm2_5_alarm.alarm_deactivation || {};
					decoded.pm2_5_alarm.alarm_deactivation.pm2_5 = readUInt16LE(bytes, counterObj, 2);
					decoded.pm2_5 = decoded.pm2_5_alarm.alarm_deactivation.pm2_5;
				}
				if (decoded.pm2_5_alarm.type == 0x11) {
					decoded.pm2_5_alarm.alarm_trigger = decoded.pm2_5_alarm.alarm_trigger || {};
					decoded.pm2_5_alarm.alarm_trigger.pm2_5 = readUInt16LE(bytes, counterObj, 2);
					decoded.pm2_5 = decoded.pm2_5_alarm.alarm_trigger.pm2_5;
				}
				break;
			case 0x07:
				decoded.pm10 = readUInt16LE(bytes, counterObj, 2);
				break;
			case 0x08:
				decoded.pm10_alarm = decoded.pm10_alarm || {};
				decoded.pm10_alarm.type = readUInt8(bytes, counterObj, 1);
				if (decoded.pm10_alarm.type == 0x00) {
					decoded.pm10_alarm.collection_error = decoded.pm10_alarm.collection_error || {};
				}
				if (decoded.pm10_alarm.type == 0x01) {
					decoded.pm10_alarm.lower_range_error = decoded.pm10_alarm.lower_range_error || {};
				}
				if (decoded.pm10_alarm.type == 0x02) {
					decoded.pm10_alarm.over_range_error = decoded.pm10_alarm.over_range_error || {};
				}
				if (decoded.pm10_alarm.type == 0x10) {
					decoded.pm10_alarm.alarm_deactivation = decoded.pm10_alarm.alarm_deactivation || {};
					decoded.pm10_alarm.alarm_deactivation.pm10 = readUInt16LE(bytes, counterObj, 2);
					decoded.pm10 = decoded.pm10_alarm.alarm_deactivation.pm10;
				}
				if (decoded.pm10_alarm.type == 0x11) {
					decoded.pm10_alarm.alarm_trigger = decoded.pm10_alarm.alarm_trigger || {};
					decoded.pm10_alarm.alarm_trigger.pm10 = readUInt16LE(bytes, counterObj, 2);
					decoded.pm10 = decoded.pm10_alarm.alarm_trigger.pm10;
				}
				break;
			case 0x09:
				decoded.temperature = readInt16LE(bytes, counterObj, 2) / 10;
				break;
			case 0x0a:
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
				if (decoded.temperature_alarm.type == 0x10) {
					decoded.temperature_alarm.alarm_deactivation = decoded.temperature_alarm.alarm_deactivation || {};
					decoded.temperature_alarm.alarm_deactivation.temperature = readInt16LE(bytes, counterObj, 2) / 10;
					decoded.temperature = decoded.temperature_alarm.alarm_deactivation.temperature;
				}
				if (decoded.temperature_alarm.type == 0x11) {
					decoded.temperature_alarm.alarm_trigger = decoded.temperature_alarm.alarm_trigger || {};
					decoded.temperature_alarm.alarm_trigger.temperature = readInt16LE(bytes, counterObj, 2) / 10;
					decoded.temperature = decoded.temperature_alarm.alarm_trigger.temperature;
				}
				if (decoded.temperature_alarm.type == 0x20) {
					decoded.temperature_alarm.burning_alarm_deactivation = decoded.temperature_alarm.burning_alarm_deactivation || {};
				}
				if (decoded.temperature_alarm.type == 0x21) {
					decoded.temperature_alarm.burning_alarm_trigger = decoded.temperature_alarm.burning_alarm_trigger || {};
				}
				break;
			case 0x0b:
				decoded.humidity = readUInt16LE(bytes, counterObj, 2) / 10;
				break;
			case 0x0c:
				decoded.humidity_alarm = decoded.humidity_alarm || {};
				decoded.humidity_alarm.type = readUInt8(bytes, counterObj, 1);
				if (decoded.humidity_alarm.type == 0x00) {
					decoded.humidity_alarm.collection_error = decoded.humidity_alarm.collection_error || {};
				}
				if (decoded.humidity_alarm.type == 0x01) {
					decoded.humidity_alarm.lower_range_error = decoded.humidity_alarm.lower_range_error || {};
				}
				if (decoded.humidity_alarm.type == 0x02) {
					decoded.humidity_alarm.over_range_error = decoded.humidity_alarm.over_range_error || {};
				}
				break;
			case 0x0d:
				decoded.tvoc = readUInt16LE(bytes, counterObj, 2);
				break;
			case 0x0e:
				decoded.tvoc_alarm = decoded.tvoc_alarm || {};
				decoded.tvoc_alarm.type = readUInt8(bytes, counterObj, 1);
				if (decoded.tvoc_alarm.type == 0x00) {
					decoded.tvoc_alarm.collection_error = decoded.tvoc_alarm.collection_error || {};
				}
				if (decoded.tvoc_alarm.type == 0x01) {
					decoded.tvoc_alarm.lower_range_error = decoded.tvoc_alarm.lower_range_error || {};
				}
				if (decoded.tvoc_alarm.type == 0x02) {
					decoded.tvoc_alarm.over_range_error = decoded.tvoc_alarm.over_range_error || {};
				}
				if (decoded.tvoc_alarm.type == 0x10) {
					decoded.tvoc_alarm.alarm_deactivation = decoded.tvoc_alarm.alarm_deactivation || {};
					decoded.tvoc_alarm.alarm_deactivation.tvoc = readUInt16LE(bytes, counterObj, 2);
					decoded.tvoc = decoded.tvoc_alarm.alarm_deactivation.tvoc;
				}
				if (decoded.tvoc_alarm.type == 0x11) {
					decoded.tvoc_alarm.alarm_trigger = decoded.tvoc_alarm.alarm_trigger || {};
					decoded.tvoc_alarm.alarm_trigger.tvoc = readUInt16LE(bytes, counterObj, 2);
					decoded.tvoc = decoded.tvoc_alarm.alarm_trigger.tvoc;
				}
				break;
			case 0x0f:
				// 0：Normal, 1：Triggered
				decoded.tamper_status = readUInt8(bytes, counterObj, 1);
				break;
			case 0x10:
				decoded.tamper_status_alarm = decoded.tamper_status_alarm || {};
				decoded.tamper_status_alarm.type = readUInt8(bytes, counterObj, 1);
				if (decoded.tamper_status_alarm.type == 0x20) {
					decoded.tamper_status_alarm.normal = decoded.tamper_status_alarm.normal || {};
				}
				if (decoded.tamper_status_alarm.type == 0x21) {
					decoded.tamper_status_alarm.trigger = decoded.tamper_status_alarm.trigger || {};
				}
				break;
			case 0x11:
				// 0：Normal, 1：Triggered
				decoded.buzzer = readUInt8(bytes, counterObj, 1);
				break;
			case 0x12:
				// 0：vacant, 1：occuppied
				decoded.occupancy_status = readUInt8(bytes, counterObj, 1);
				break;
			case 0x20:
				decoded.tvoc_raw_data_1 = decoded.tvoc_raw_data_1 || {};
				decoded.tvoc_raw_data_1.rmox_0 = readUnknownDataType(bytes, counterObj, 4);
				decoded.tvoc_raw_data_1.rmox_1 = readUnknownDataType(bytes, counterObj, 4);
				break;
			case 0x21:
				decoded.tvoc_raw_data_2 = decoded.tvoc_raw_data_2 || {};
				decoded.tvoc_raw_data_2.rmox_2 = readUnknownDataType(bytes, counterObj, 4);
				decoded.tvoc_raw_data_2.rmox_3 = readUnknownDataType(bytes, counterObj, 4);
				break;
			case 0x22:
				decoded.tvoc_raw_data_3 = decoded.tvoc_raw_data_3 || {};
				decoded.tvoc_raw_data_3.rmox_4 = readUnknownDataType(bytes, counterObj, 4);
				decoded.tvoc_raw_data_3.rmox_5 = readUnknownDataType(bytes, counterObj, 4);
				break;
			case 0x23:
				decoded.tvoc_raw_data_4 = decoded.tvoc_raw_data_4 || {};
				decoded.tvoc_raw_data_4.rmox_6 = readUnknownDataType(bytes, counterObj, 4);
				decoded.tvoc_raw_data_4.rmox_7 = readUnknownDataType(bytes, counterObj, 4);
				break;
			case 0x24:
				decoded.tvoc_raw_data_5 = decoded.tvoc_raw_data_5 || {};
				decoded.tvoc_raw_data_5.rmox_8 = readUnknownDataType(bytes, counterObj, 4);
				decoded.tvoc_raw_data_5.rmox_9 = readUnknownDataType(bytes, counterObj, 4);
				break;
			case 0x25:
				decoded.tvoc_raw_data_6 = decoded.tvoc_raw_data_6 || {};
				decoded.tvoc_raw_data_6.rmox_10 = readUnknownDataType(bytes, counterObj, 4);
				decoded.tvoc_raw_data_6.rmox_11 = readUnknownDataType(bytes, counterObj, 4);
				break;
			case 0x26:
				decoded.tvoc_raw_data_7 = decoded.tvoc_raw_data_7 || {};
				decoded.tvoc_raw_data_7.rmox_12 = readUnknownDataType(bytes, counterObj, 4);
				decoded.tvoc_raw_data_7.zmod4510_rmox_3 = readUnknownDataType(bytes, counterObj, 4);
				break;
			case 0x27:
				decoded.tvoc_raw_data_8 = decoded.tvoc_raw_data_8 || {};
				decoded.tvoc_raw_data_8.log_rcda = readUnknownDataType(bytes, counterObj, 4);
				decoded.tvoc_raw_data_8.rhtr = readUnknownDataType(bytes, counterObj, 4);
				break;
			case 0x28:
				decoded.tvoc_raw_data_9 = decoded.tvoc_raw_data_9 || {};
				decoded.tvoc_raw_data_9.temperature = readUnknownDataType(bytes, counterObj, 4);
				decoded.tvoc_raw_data_9.iaq = readUnknownDataType(bytes, counterObj, 4);
				break;
			case 0x29:
				decoded.tvoc_raw_data_10 = decoded.tvoc_raw_data_10 || {};
				decoded.tvoc_raw_data_10.tvoc = readUnknownDataType(bytes, counterObj, 4);
				decoded.tvoc_raw_data_10.etoh = readUnknownDataType(bytes, counterObj, 4);
				break;
			case 0x2a:
				decoded.tvoc_raw_data_11 = decoded.tvoc_raw_data_11 || {};
				decoded.tvoc_raw_data_11.eco2 = readUnknownDataType(bytes, counterObj, 4);
				decoded.tvoc_raw_data_11.rel_iaq = readUnknownDataType(bytes, counterObj, 4);
				break;
			case 0x2b:
				decoded.pm_sensor_working_time = readUInt32LE(bytes, counterObj, 4);
				break;
			case 0xc9:
				// 0：disable, 1：enable
				decoded.random_key = readUInt8(bytes, counterObj, 1);
				break;
			case 0xc8:
				// 0：Off, 1：On
				decoded.device_status = readUInt8(bytes, counterObj, 1);
				break;
			case 0x60:
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
			case 0x61:
				// 0：℃, 1：℉
				decoded.temperature_unit = readUInt8(bytes, counterObj, 1);
				break;
			case 0x67:
				// 0：disable, 1：enable
				decoded.tamper_alarm_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x62:
				// 0：disable, 1：enable
				decoded.led_status = readUInt8(bytes, counterObj, 1);
				break;
			case 0x63:
				// 0：disable, 1：enable
				decoded.buzzer_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x64:
				decoded.buzzer_sleep = decoded.buzzer_sleep || {};
				var buzzer_sleep_type = readUInt8(bytes, counterObj, 1);
				if (buzzer_sleep_type == 0x01) {
					decoded.buzzer_sleep.item_1 = decoded.buzzer_sleep.item_1 || {};
					// 0：disable, 1：enable
					decoded.buzzer_sleep.item_1.enable = readUInt8(bytes, counterObj, 1);
					decoded.buzzer_sleep.item_1.start_time = readUInt16LE(bytes, counterObj, 2);
					decoded.buzzer_sleep.item_1.end_time = readUInt16LE(bytes, counterObj, 2);
				}
				if (buzzer_sleep_type == 0x02) {
					decoded.buzzer_sleep.item_2 = decoded.buzzer_sleep.item_2 || {};
					// 0：disable, 1：enable
					decoded.buzzer_sleep.item_2.enable = readUInt8(bytes, counterObj, 1);
					decoded.buzzer_sleep.item_2.start_time = readUInt16LE(bytes, counterObj, 2);
					decoded.buzzer_sleep.item_2.end_time = readUInt16LE(bytes, counterObj, 2);
				}
				break;
			case 0x65:
				// 0：disable, 1：enable
				decoded.buzzer_button_stop_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x66:
				decoded.buzzer_silent_time = readUInt16LE(bytes, counterObj, 2);
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
			case 0x68:
				// 0：disable, 1：enable
				decoded.tvoc_raw_reporting_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x69:
				decoded.temperature_alarm_settings = decoded.temperature_alarm_settings || {};
				// 0：disable, 1：enable
				decoded.temperature_alarm_settings.enable = readUInt8(bytes, counterObj, 1);
				// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A<x<B, 4:condition: x<A or x>B
				decoded.temperature_alarm_settings.threshold_condition = readUInt8(bytes, counterObj, 1);
				decoded.temperature_alarm_settings.threshold_min = readInt16LE(bytes, counterObj, 2) / 10;
				decoded.temperature_alarm_settings.threshold_max = readInt16LE(bytes, counterObj, 2) / 10;
				break;
			case 0x6a:
				decoded.pm1_0_alarm_settings = decoded.pm1_0_alarm_settings || {};
				// 0：disable, 1：enable
				decoded.pm1_0_alarm_settings.enable = readUInt8(bytes, counterObj, 1);
				// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A<x<B, 4:condition: x<A or x>B
				decoded.pm1_0_alarm_settings.threshold_condition = readUInt8(bytes, counterObj, 1);
				decoded.pm1_0_alarm_settings.threshold_min = readInt16LE(bytes, counterObj, 2);
				decoded.pm1_0_alarm_settings.threshold_max = readInt16LE(bytes, counterObj, 2);
				break;
			case 0x6b:
				decoded.pm2_5_alarm_settings = decoded.pm2_5_alarm_settings || {};
				// 0：disable, 1：enable
				decoded.pm2_5_alarm_settings.enable = readUInt8(bytes, counterObj, 1);
				// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A<x<B, 4:condition: x<A or x>B
				decoded.pm2_5_alarm_settings.threshold_condition = readUInt8(bytes, counterObj, 1);
				decoded.pm2_5_alarm_settings.threshold_min = readInt16LE(bytes, counterObj, 2);
				decoded.pm2_5_alarm_settings.threshold_max = readInt16LE(bytes, counterObj, 2);
				break;
			case 0x6c:
				decoded.pm10_alarm_settings = decoded.pm10_alarm_settings || {};
				// 0：disable, 1：enable
				decoded.pm10_alarm_settings.enable = readUInt8(bytes, counterObj, 1);
				// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A<x<B, 4:condition: x<A or x>B
				decoded.pm10_alarm_settings.threshold_condition = readUInt8(bytes, counterObj, 1);
				decoded.pm10_alarm_settings.threshold_min = readInt16LE(bytes, counterObj, 2);
				decoded.pm10_alarm_settings.threshold_max = readInt16LE(bytes, counterObj, 2);
				break;
			case 0x6d:
				decoded.tvoc_alarm_settings = decoded.tvoc_alarm_settings || {};
				// 0：disable, 1：enable
				decoded.tvoc_alarm_settings.enable = readUInt8(bytes, counterObj, 1);
				// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A<x<B, 4:condition: x<A or x>B
				decoded.tvoc_alarm_settings.threshold_condition = readUInt8(bytes, counterObj, 1);
				decoded.tvoc_alarm_settings.threshold_min = readInt16LE(bytes, counterObj, 2);
				decoded.tvoc_alarm_settings.threshold_max = readInt16LE(bytes, counterObj, 2);
				break;
			case 0x6e:
				decoded.vaping_index_alarm_settings = decoded.vaping_index_alarm_settings || {};
				// 0：disable, 1：enable
				decoded.vaping_index_alarm_settings.enable = readUInt8(bytes, counterObj, 1);
				// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A<x<B, 4:condition: x<A or x>B
				decoded.vaping_index_alarm_settings.threshold_condition = readUInt8(bytes, counterObj, 1);
				decoded.vaping_index_alarm_settings.threshold_min = readUInt8(bytes, counterObj, 1);
				decoded.vaping_index_alarm_settings.threshold_max = readUInt8(bytes, counterObj, 1);
				break;
			case 0x6f:
				decoded.alarm_reporting_times = readUInt16LE(bytes, counterObj, 2);
				break;
			case 0x70:
				// 0：disable, 1：enable
				decoded.alarm_deactivation_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x71:
				decoded.temperature_calibration_settings = decoded.temperature_calibration_settings || {};
				// 0：disable, 1：enable
				decoded.temperature_calibration_settings.enable = readUInt8(bytes, counterObj, 1);
				decoded.temperature_calibration_settings.calibration_value = readInt16LE(bytes, counterObj, 2) / 10;
				break;
			case 0x72:
				decoded.humidity_calibration_settings = decoded.humidity_calibration_settings || {};
				// 0：disable, 1：enable
				decoded.humidity_calibration_settings.enable = readUInt8(bytes, counterObj, 1);
				decoded.humidity_calibration_settings.calibration_value = readInt16LE(bytes, counterObj, 2) / 10;
				break;
			case 0x73:
				decoded.pm1_0_calibration_settings = decoded.pm1_0_calibration_settings || {};
				// 0：disable, 1：enable
				decoded.pm1_0_calibration_settings.enable = readUInt8(bytes, counterObj, 1);
				decoded.pm1_0_calibration_settings.calibration_value = readInt16LE(bytes, counterObj, 2);
				break;
			case 0x74:
				decoded.pm2_5_calibration_settings = decoded.pm2_5_calibration_settings || {};
				// 0：disable, 1：enable
				decoded.pm2_5_calibration_settings.enable = readUInt8(bytes, counterObj, 1);
				decoded.pm2_5_calibration_settings.calibration_value = readInt16LE(bytes, counterObj, 2);
				break;
			case 0x75:
				decoded.pm10_calibration_settings = decoded.pm10_calibration_settings || {};
				// 0：disable, 1：enable
				decoded.pm10_calibration_settings.enable = readUInt8(bytes, counterObj, 1);
				decoded.pm10_calibration_settings.calibration_value = readInt16LE(bytes, counterObj, 2);
				break;
			case 0x76:
				decoded.tvoc_calibration_settings = decoded.tvoc_calibration_settings || {};
				// 0：disable, 1：enable
				decoded.tvoc_calibration_settings.enable = readUInt8(bytes, counterObj, 1);
				decoded.tvoc_calibration_settings.calibration_value = readInt16LE(bytes, counterObj, 2);
				break;
			case 0x77:
				decoded.vaping_index_calibration_settings = decoded.vaping_index_calibration_settings || {};
				// 0：disable, 1：enable
				decoded.vaping_index_calibration_settings.enable = readUInt8(bytes, counterObj, 1);
				decoded.vaping_index_calibration_settings.calibration_value = readInt8(bytes, counterObj, 1);
				break;
			case 0xbf:
				decoded.reset = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0xbe:
				decoded.reboot = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0xbd:
				decoded.clear_historical_data = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0xbc:
				decoded.stop_historical_data_retrieval = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0xbb:
				decoded.retrieve_historical_data_by_time = decoded.retrieve_historical_data_by_time || {};
				decoded.retrieve_historical_data_by_time.time = readUInt32LE(bytes, counterObj, 4);
				break;
			case 0xba:
				decoded.retrieve_historical_data_by_time_range = decoded.retrieve_historical_data_by_time_range || {};
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
				decoded.stop_buzzer_alarm = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0x5e:
				decoded.execute_tvoc_self_clean = readOnlyCommand(bytes, counterObj, 0);
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
		  "10": "tamper_status_alarm",
		  "11": "buzzer",
		  "12": "occupancy_status",
		  "20": "tvoc_raw_data_1",
		  "21": "tvoc_raw_data_2",
		  "22": "tvoc_raw_data_3",
		  "23": "tvoc_raw_data_4",
		  "24": "tvoc_raw_data_5",
		  "25": "tvoc_raw_data_6",
		  "26": "tvoc_raw_data_7",
		  "27": "tvoc_raw_data_8",
		  "28": "tvoc_raw_data_9",
		  "29": "tvoc_raw_data_10",
		  "60": "reporting_interval",
		  "61": "temperature_unit",
		  "62": "led_status",
		  "63": "buzzer_enable",
		  "64": "buzzer_sleep",
		  "65": "buzzer_button_stop_enable",
		  "66": "buzzer_silent_time",
		  "67": "tamper_alarm_enable",
		  "68": "tvoc_raw_reporting_enable",
		  "69": "temperature_alarm_settings",
		  "70": "alarm_deactivation_enable",
		  "71": "temperature_calibration_settings",
		  "72": "humidity_calibration_settings",
		  "73": "pm1_0_calibration_settings",
		  "74": "pm2_5_calibration_settings",
		  "75": "pm10_calibration_settings",
		  "76": "tvoc_calibration_settings",
		  "77": "vaping_index_calibration_settings",
		  "6401": "buzzer_sleep.item_1",
		  "6402": "buzzer_sleep.item_2",
		  "fe": "request_check_order",
		  "f4": "request_full_inspection",
		  "f400": "request_full_inspection.start_inspection",
		  "f401": "request_full_inspection.control",
		  "f402": "request_full_inspection.reading",
		  "f403": "request_full_inspection.end_inspection",
		  "ef": "request_command_queries",
		  "ee": "all_configurations_request_by_device",
		  "cf": "lorawan_configuration_settings",
		  "cf00": "lorawan_configuration_settings.mode",
		  "df": "tsl_version",
		  "db": "product_sn",
		  "da": "version",
		  "d9": "oem_id",
		  "00": "battery",
		  "01": "vaping_index",
		  "02": "vaping_index_alarm",
		  "03": "pm1_0",
		  "04": "pm1_0_alarm",
		  "05": "pm2_5",
		  "06": "pm2_5_alarm",
		  "07": "pm10",
		  "08": "pm10_alarm",
		  "09": "temperature",
		  "0a": "temperature_alarm",
		  "0b": "humidity",
		  "0c": "humidity_alarm",
		  "0d": "tvoc",
		  "0e": "tvoc_alarm",
		  "0f": "tamper_status",
		  "2a": "tvoc_raw_data_11",
		  "2b": "pm_sensor_working_time",
		  "c9": "random_key",
		  "c8": "device_status",
		  "c7": "time_zone",
		  "c6": "daylight_saving_time",
		  "6a": "pm1_0_alarm_settings",
		  "6b": "pm2_5_alarm_settings",
		  "6c": "pm10_alarm_settings",
		  "6d": "tvoc_alarm_settings",
		  "6e": "vaping_index_alarm_settings",
		  "6f": "alarm_reporting_times",
		  "bf": "reset",
		  "be": "reboot",
		  "bd": "clear_historical_data",
		  "bc": "stop_historical_data_retrieval",
		  "bb": "retrieve_historical_data_by_time",
		  "ba": "retrieve_historical_data_by_time_range",
		  "b9": "query_device_status",
		  "b8": "synchronize_time",
		  "b7": "set_time",
		  "b6": "reconnect",
		  "5f": "stop_buzzer_alarm",
		  "5e": "execute_tvoc_self_clean"
	};
}