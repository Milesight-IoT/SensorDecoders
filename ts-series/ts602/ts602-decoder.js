/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product TS602
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
			case 0xc9:
				// 0：disable, 1：enable
				decoded.random_key = readUInt8(bytes, counterObj, 1);
				break;
			case 0xc8:
				// 0：Off, 1：On
				decoded.device_status = readUInt8(bytes, counterObj, 1);
				break;
			case 0xd8:
				decoded.product_frequency_band = readString(bytes, counterObj, 16);
				break;
			case 0xd7:
				decoded.device_info = decoded.device_info || {};
				decoded.device_info.model = readString(bytes, counterObj, 8);
				decoded.device_info.submodel_1 = readString(bytes, counterObj, 8);
				decoded.device_info.submodel_2 = readString(bytes, counterObj, 8);
				decoded.device_info.submodel_3 = readString(bytes, counterObj, 8);
				decoded.device_info.submodel_4 = readString(bytes, counterObj, 8);
				decoded.device_info.pn_1 = readString(bytes, counterObj, 8);
				decoded.device_info.pn_2 = readString(bytes, counterObj, 8);
				decoded.device_info.pn_3 = readString(bytes, counterObj, 8);
				decoded.device_info.pn_4 = readString(bytes, counterObj, 8);
				break;
			case 0x01:
				decoded.battery = readUInt8(bytes, counterObj, 1);
				break;
			case 0x03:
				decoded.sensor_id = decoded.sensor_id || {};
				// 0：none, 1:PT100, 2: SHT41,       3: DS18B20
				decoded.sensor_id.type = readUInt8(bytes, counterObj, 1);
				decoded.sensor_id.id = readHexString(bytes, counterObj, 8);
				break;
			case 0x04:
				decoded.temperature = readInt32LE(bytes, counterObj, 4) / 100;
				break;
			case 0x05:
				decoded.humidity = readUInt16LE(bytes, counterObj, 2) / 10;
				break;
			case 0x06:
				decoded.base_station_position = decoded.base_station_position || {};
				decoded.base_station_position.latitude = readInt32LE(bytes, counterObj, 4) / 1000000;
				decoded.base_station_position.longitude = readInt32LE(bytes, counterObj, 4) / 1000000;
				break;
			case 0x07:
				// 0: enter airplane mode, 1: exit airplane mode
				decoded.airplane_mode_state = readUInt8(bytes, counterObj, 1);
				break;
			case 0x1a:
				// 3：No Data, 16：Temperature Below Alarm Released, 17：Temperature Below Alarm, 18：Temperature Above Alarm Released, 19：Temperature Above Alarm, 20：Temperature Between Alarm Released, 21：Temperature Between Alarm, 22：Temperature Exceed Tolerance Alarm Released, 23：Temperature Exceed Tolerance Alarm, 48：Temperature Shift Threshold, 32：Temperature Shift Threshold, 
				decoded.temperature_alarm_types = readUInt8(bytes, counterObj, 1);
				break;
			case 0x11:
				decoded.battery_alarm = decoded.battery_alarm || {};
				var battery_alarm_type = readUInt8(bytes, counterObj, 1);
				if (battery_alarm_type == 0x10) {
					decoded.battery_alarm.lower_battery_alarm = decoded.battery_alarm.lower_battery_alarm || {};
					decoded.battery_alarm.lower_battery_alarm.battery = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0x08:
				decoded.temperature_alarm = decoded.temperature_alarm || {};
				decoded.temperature_alarm.type = readUInt8(bytes, counterObj, 1);
				decoded.temperature_alarm_types = decoded.temperature_alarm.type;
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
					decoded.temperature_alarm.lower_range_alarm_deactivation.temperature = readInt32LE(bytes, counterObj, 4) / 100;
					decoded.temperature = decoded.temperature_alarm.lower_range_alarm_deactivation.temperature;
				}
				if (decoded.temperature_alarm.type == 0x11) {
					decoded.temperature_alarm.lower_range_alarm_trigger = decoded.temperature_alarm.lower_range_alarm_trigger || {};
					decoded.temperature_alarm.lower_range_alarm_trigger.temperature = readInt32LE(bytes, counterObj, 4) / 100;
					decoded.temperature = decoded.temperature_alarm.lower_range_alarm_trigger.temperature;
				}
				if (decoded.temperature_alarm.type == 0x12) {
					decoded.temperature_alarm.over_range_alarm_deactivation = decoded.temperature_alarm.over_range_alarm_deactivation || {};
					decoded.temperature_alarm.over_range_alarm_deactivation.temperature = readInt32LE(bytes, counterObj, 4) / 100;
					decoded.temperature = decoded.temperature_alarm.over_range_alarm_deactivation.temperature;
				}
				if (decoded.temperature_alarm.type == 0x13) {
					decoded.temperature_alarm.over_range_alarm_trigger = decoded.temperature_alarm.over_range_alarm_trigger || {};
					decoded.temperature_alarm.over_range_alarm_trigger.temperature = readInt32LE(bytes, counterObj, 4) / 100;
					decoded.temperature = decoded.temperature_alarm.over_range_alarm_trigger.temperature;
				}
				if (decoded.temperature_alarm.type == 0x14) {
					decoded.temperature_alarm.within_range_alarm_deactivation = decoded.temperature_alarm.within_range_alarm_deactivation || {};
					decoded.temperature_alarm.within_range_alarm_deactivation.temperature = readInt32LE(bytes, counterObj, 4) / 100;
					decoded.temperature = decoded.temperature_alarm.within_range_alarm_deactivation.temperature;
				}
				if (decoded.temperature_alarm.type == 0x15) {
					decoded.temperature_alarm.within_range_alarm_trigger = decoded.temperature_alarm.within_range_alarm_trigger || {};
					decoded.temperature_alarm.within_range_alarm_trigger.temperature = readInt32LE(bytes, counterObj, 4) / 100;
					decoded.temperature = decoded.temperature_alarm.within_range_alarm_trigger.temperature;
				}
				if (decoded.temperature_alarm.type == 0x16) {
					decoded.temperature_alarm.exceed_range_alarm_deactivation = decoded.temperature_alarm.exceed_range_alarm_deactivation || {};
					decoded.temperature_alarm.exceed_range_alarm_deactivation.temperature = readInt32LE(bytes, counterObj, 4) / 100;
					decoded.temperature = decoded.temperature_alarm.exceed_range_alarm_deactivation.temperature;
				}
				if (decoded.temperature_alarm.type == 0x17) {
					decoded.temperature_alarm.exceed_range_alarm_trigger = decoded.temperature_alarm.exceed_range_alarm_trigger || {};
					decoded.temperature_alarm.exceed_range_alarm_trigger.temperature = readInt32LE(bytes, counterObj, 4) / 100;
					decoded.temperature = decoded.temperature_alarm.exceed_range_alarm_trigger.temperature;
				}
				if (decoded.temperature_alarm.type == 0x30) {
					decoded.temperature_alarm.mutation_alarm_trigger_no_mutation = decoded.temperature_alarm.mutation_alarm_trigger_no_mutation || {};
					decoded.temperature_alarm.mutation_alarm_trigger_no_mutation.temperature = readInt32LE(bytes, counterObj, 4) / 100;
					decoded.temperature = decoded.temperature_alarm.mutation_alarm_trigger_no_mutation.temperature;
				}
				if (decoded.temperature_alarm.type == 0x20) {
					decoded.temperature_alarm.mutation_alarm_trigger = decoded.temperature_alarm.mutation_alarm_trigger || {};
					decoded.temperature_alarm.mutation_alarm_trigger.temperature = readInt32LE(bytes, counterObj, 4) / 100;
					decoded.temperature = decoded.temperature_alarm.mutation_alarm_trigger.temperature;
					decoded.temperature_alarm.mutation_alarm_trigger.saltation = readInt32LE(bytes, counterObj, 4) / 100;
					decoded.temperature = decoded.temperature_alarm.mutation_alarm_trigger.saltation;
				}
				break;
			case 0x1b:
				// 3: No Data, 16:humidity Below Alarm Released, 17:humidity Below Alarm, 18:humidity Above Alarm Released, 19:humidity Above Alarm, 20:humidity Between Alarm Released, 21:humidity Between Alarm, 22:humidity Exceed Tolerance Alarm Released, 23:humidity Exceed Tolerance Alarm, 48:humidity Shift Threshold, 32:humidity Shift Threshold
				decoded.humidity_alarm_types = readUInt8(bytes, counterObj, 1);
				break;
			case 0x09:
				decoded.humidity_alarm = decoded.humidity_alarm || {};
				decoded.humidity_alarm.type = readUInt8(bytes, counterObj, 1);
				decoded.humidity_alarm_types = decoded.humidity_alarm.type;
				if (decoded.humidity_alarm.type == 0x00) {
					decoded.humidity_alarm.collection_error = decoded.humidity_alarm.collection_error || {};
				}
				if (decoded.humidity_alarm.type == 0x01) {
					decoded.humidity_alarm.lower_range_error = decoded.humidity_alarm.lower_range_error || {};
				}
				if (decoded.humidity_alarm.type == 0x02) {
					decoded.humidity_alarm.over_range_error = decoded.humidity_alarm.over_range_error || {};
				}
				if (decoded.humidity_alarm.type == 0x03) {
					decoded.humidity_alarm.no_data = decoded.humidity_alarm.no_data || {};
				}
				if (decoded.humidity_alarm.type == 0x10) {
					decoded.humidity_alarm.lower_range_alarm_deactivation = decoded.humidity_alarm.lower_range_alarm_deactivation || {};
					decoded.humidity_alarm.lower_range_alarm_deactivation.humidity = readUInt16LE(bytes, counterObj, 2) / 10;
					decoded.humidity = decoded.humidity_alarm.lower_range_alarm_deactivation.humidity;
				}
				if (decoded.humidity_alarm.type == 0x11) {
					decoded.humidity_alarm.lower_range_alarm_trigger = decoded.humidity_alarm.lower_range_alarm_trigger || {};
					decoded.humidity_alarm.lower_range_alarm_trigger.humidity = readUInt16LE(bytes, counterObj, 2) / 10;
					decoded.humidity = decoded.humidity_alarm.lower_range_alarm_trigger.humidity;
				}
				if (decoded.humidity_alarm.type == 0x12) {
					decoded.humidity_alarm.over_range_alarm_deactivation = decoded.humidity_alarm.over_range_alarm_deactivation || {};
					decoded.humidity_alarm.over_range_alarm_deactivation.humidity = readUInt16LE(bytes, counterObj, 2) / 10;
					decoded.humidity = decoded.humidity_alarm.over_range_alarm_deactivation.humidity;
				}
				if (decoded.humidity_alarm.type == 0x13) {
					decoded.humidity_alarm.over_range_alarm_trigger = decoded.humidity_alarm.over_range_alarm_trigger || {};
					decoded.humidity_alarm.over_range_alarm_trigger.humidity = readUInt16LE(bytes, counterObj, 2) / 10;
					decoded.humidity = decoded.humidity_alarm.over_range_alarm_trigger.humidity;
				}
				if (decoded.humidity_alarm.type == 0x14) {
					decoded.humidity_alarm.within_range_alarm_deactivation = decoded.humidity_alarm.within_range_alarm_deactivation || {};
					decoded.humidity_alarm.within_range_alarm_deactivation.humidity = readUInt16LE(bytes, counterObj, 2) / 10;
					decoded.humidity = decoded.humidity_alarm.within_range_alarm_deactivation.humidity;
				}
				if (decoded.humidity_alarm.type == 0x15) {
					decoded.humidity_alarm.within_range_alarm_trigger = decoded.humidity_alarm.within_range_alarm_trigger || {};
					decoded.humidity_alarm.within_range_alarm_trigger.humidity = readUInt16LE(bytes, counterObj, 2) / 10;
					decoded.humidity = decoded.humidity_alarm.within_range_alarm_trigger.humidity;
				}
				if (decoded.humidity_alarm.type == 0x16) {
					decoded.humidity_alarm.exceed_range_alarm_deactivation = decoded.humidity_alarm.exceed_range_alarm_deactivation || {};
					decoded.humidity_alarm.exceed_range_alarm_deactivation.humidity = readUInt16LE(bytes, counterObj, 2) / 10;
					decoded.humidity = decoded.humidity_alarm.exceed_range_alarm_deactivation.humidity;
				}
				if (decoded.humidity_alarm.type == 0x17) {
					decoded.humidity_alarm.exceed_range_alarm_trigger = decoded.humidity_alarm.exceed_range_alarm_trigger || {};
					decoded.humidity_alarm.exceed_range_alarm_trigger.humidity = readUInt16LE(bytes, counterObj, 2) / 10;
					decoded.humidity = decoded.humidity_alarm.exceed_range_alarm_trigger.humidity;
				}
				if (decoded.humidity_alarm.type == 0x30) {
					decoded.humidity_alarm.mutation_alarm_trigger_no_mutation = decoded.humidity_alarm.mutation_alarm_trigger_no_mutation || {};
					decoded.humidity_alarm.mutation_alarm_trigger_no_mutation.humidity = readUInt16LE(bytes, counterObj, 2) / 10;
					decoded.humidity = decoded.humidity_alarm.mutation_alarm_trigger_no_mutation.humidity;
				}
				if (decoded.humidity_alarm.type == 0x20) {
					decoded.humidity_alarm.mutation_alarm_trigger = decoded.humidity_alarm.mutation_alarm_trigger || {};
					decoded.humidity_alarm.mutation_alarm_trigger.humidity = readUInt16LE(bytes, counterObj, 2) / 10;
					decoded.humidity = decoded.humidity_alarm.mutation_alarm_trigger.humidity;
					decoded.humidity_alarm.mutation_alarm_trigger.saltation = readUInt16LE(bytes, counterObj, 2) / 10;
				}
				break;
			case 0x1c:
				// 1：Exceed the Range Lower Limit, 2：Exceed the Range Upper Limit, 3：No Data, 16：Tilt  Alam Release, 17：Tilt Alam, 33：Falling  Alam
				decoded.tilt_alarm_types = readUInt8(bytes, counterObj, 1);
				break;
			case 0x0a:
				decoded.tilt_alarm = decoded.tilt_alarm || {};
				decoded.tilt_alarm.type = readUInt8(bytes, counterObj, 1);
				decoded.tilt_alarm_types = decoded.tilt_alarm.type;
				if (decoded.tilt_alarm.type == 0x00) {
					decoded.tilt_alarm.collection_error = decoded.tilt_alarm.collection_error || {};
				}
				if (decoded.tilt_alarm.type == 0x01) {
					decoded.tilt_alarm.lower_range_error = decoded.tilt_alarm.lower_range_error || {};
				}
				if (decoded.tilt_alarm.type == 0x02) {
					decoded.tilt_alarm.over_range_error = decoded.tilt_alarm.over_range_error || {};
				}
				if (decoded.tilt_alarm.type == 0x03) {
					decoded.tilt_alarm.no_data = decoded.tilt_alarm.no_data || {};
				}
				if (decoded.tilt_alarm.type == 0x10) {
					decoded.tilt_alarm.threshold_alarm_deactivation = decoded.tilt_alarm.threshold_alarm_deactivation || {};
				}
				if (decoded.tilt_alarm.type == 0x11) {
					decoded.tilt_alarm.threshold_alarm_trigger = decoded.tilt_alarm.threshold_alarm_trigger || {};
				}
				if (decoded.tilt_alarm.type == 0x21) {
					decoded.tilt_alarm.falling_alarm_trigger = decoded.tilt_alarm.falling_alarm_trigger || {};
				}
				break;
			case 0x1d:
				// 1：Exceed the Range Lower Limit, 2：Exceed the Range Upper Limit, 3：No Data, 16：Bright to dark, 17：Dark to bright
				decoded.light_alarm_types = readUInt8(bytes, counterObj, 1);
				break;
			case 0x0b:
				decoded.light_alarm = decoded.light_alarm || {};
				decoded.light_alarm.type = readUInt8(bytes, counterObj, 1);
				decoded.light_alarm_types = decoded.light_alarm.type;
				if (decoded.light_alarm.type == 0x00) {
					decoded.light_alarm.collection_error = decoded.light_alarm.collection_error || {};
				}
				if (decoded.light_alarm.type == 0x01) {
					decoded.light_alarm.lower_range_error = decoded.light_alarm.lower_range_error || {};
				}
				if (decoded.light_alarm.type == 0x02) {
					decoded.light_alarm.over_range_error = decoded.light_alarm.over_range_error || {};
				}
				if (decoded.light_alarm.type == 0x03) {
					decoded.light_alarm.no_data = decoded.light_alarm.no_data || {};
				}
				if (decoded.light_alarm.type == 0x10) {
					decoded.light_alarm.threshold_alarm_deactivation = decoded.light_alarm.threshold_alarm_deactivation || {};
				}
				if (decoded.light_alarm.type == 0x11) {
					decoded.light_alarm.threshold_alarm_trigger = decoded.light_alarm.threshold_alarm_trigger || {};
				}
				break;
			case 0x0c:
				// 0：disconnect, 1：connect
				decoded.probe_connect_status = readUInt8(bytes, counterObj, 1);
				break;
			case 0x0d:
				decoded.relative_surface_info = decoded.relative_surface_info || {};
				decoded.relative_surface_info.angle_x = readInt16LE(bytes, counterObj, 2) / 100;
				decoded.relative_surface_info.angle_y = readInt16LE(bytes, counterObj, 2) / 100;
				decoded.relative_surface_info.angle_z = readInt16LE(bytes, counterObj, 2) / 100;
				break;
			case 0x0e:
				// 0：Normal cycle package, 1：Key cycle package
				decoded.report_package_type = readUInt8(bytes, counterObj, 1);
				break;
			case 0xeb:
				decoded.debugging_commands = decoded.debugging_commands || {};
				decoded.debugging_commands.length = readUInt16LE(bytes, counterObj, 2);
				decoded.debugging_commands.content = readString(bytes, counterObj, decoded.debugging_commands.length);
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
				decoded.cumulative_times = readUInt8(bytes, counterObj, 1);
				break;
			case 0x62:
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
			case 0x63:
				decoded.alarm_reporting_times = readUInt16LE(bytes, counterObj, 2);
				break;
			case 0x75:
				// 0: disable, 1:enable
				decoded.alarm_deactivation_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x65:
				// 0：℃, 1：℉
				decoded.temperature_unit = readUInt8(bytes, counterObj, 1);
				break;
			case 0xc4:
				// 0：disable, 1：enable
				decoded.auto_p_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x71:
				// 0：disable, 1：enable
				decoded.base_station_position_enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x72:
				decoded.base_station_position_auth_token = readString(bytes, counterObj, 16);
				break;
			case 0x73:
				decoded.airplane_mode_time_period_settings = decoded.airplane_mode_time_period_settings || {};
				var airplane_mode_time_period_settings_command = readUInt8(bytes, counterObj, 1);
				if (airplane_mode_time_period_settings_command == 0x00) {
					// 0：disable, 1：enable
					decoded.airplane_mode_time_period_settings.enable = readUInt8(bytes, counterObj, 1);
				}
				if (airplane_mode_time_period_settings_command == 0x01) {
					decoded.airplane_mode_time_period_settings.start_timestamp = decoded.airplane_mode_time_period_settings.start_timestamp || {};
					decoded.airplane_mode_time_period_settings.start_timestamp.year = readUInt8(bytes, counterObj, 1);
					decoded.airplane_mode_time_period_settings.start_timestamp.month = readUInt8(bytes, counterObj, 1);
					decoded.airplane_mode_time_period_settings.start_timestamp.day = readUInt8(bytes, counterObj, 1);
					decoded.airplane_mode_time_period_settings.start_timestamp.hour = readUInt8(bytes, counterObj, 1);
					decoded.airplane_mode_time_period_settings.start_timestamp.minute = readUInt8(bytes, counterObj, 1);
					decoded.airplane_mode_time_period_settings.start_timestamp.second = readUInt8(bytes, counterObj, 1);
				}
				if (airplane_mode_time_period_settings_command == 0x02) {
					decoded.airplane_mode_time_period_settings.end_timestamp = decoded.airplane_mode_time_period_settings.end_timestamp || {};
					decoded.airplane_mode_time_period_settings.end_timestamp.year = readUInt8(bytes, counterObj, 1);
					decoded.airplane_mode_time_period_settings.end_timestamp.month = readUInt8(bytes, counterObj, 1);
					decoded.airplane_mode_time_period_settings.end_timestamp.day = readUInt8(bytes, counterObj, 1);
					decoded.airplane_mode_time_period_settings.end_timestamp.hour = readUInt8(bytes, counterObj, 1);
					decoded.airplane_mode_time_period_settings.end_timestamp.minute = readUInt8(bytes, counterObj, 1);
					decoded.airplane_mode_time_period_settings.end_timestamp.second = readUInt8(bytes, counterObj, 1);
				}
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
			case 0x76:
				decoded.button_lock = decoded.button_lock || {};
				// 0: disable, 1:enable
				decoded.button_lock.enable = readUInt8(bytes, counterObj, 1);
				var bitOptions = readUInt8(bytes, counterObj, 1);
				// 0:  disable lock power off, 1:enable lock collect
				decoded.button_lock.power_off_enable = extractBits(bitOptions, 0, 1);
				// 0: enablecollect, 1:disable lock collect
				decoded.button_lock.collect_report_enable = extractBits(bitOptions, 1, 2);
				// 0: enablecollect, 1:disable lock collect
				decoded.button_lock.reserve = extractBits(bitOptions, 2, 8);
				break;
			case 0x77:
				decoded.temperature_alarm_settings = decoded.temperature_alarm_settings || {};
				// 0: disable, 1:enable
				decoded.temperature_alarm_settings.enable = readUInt8(bytes, counterObj, 1);
				// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A<x<B, 4:condition: x<A or x>B
				decoded.temperature_alarm_settings.threshold_condition = readUInt8(bytes, counterObj, 1);
				decoded.temperature_alarm_settings.threshold_min = readInt32LE(bytes, counterObj, 4) / 100;
				decoded.temperature_alarm_settings.threshold_max = readInt32LE(bytes, counterObj, 4) / 100;
				break;
			case 0x78:
				decoded.temperature_mutation_alarm_settings = decoded.temperature_mutation_alarm_settings || {};
				// 0: disable, 1:enable
				decoded.temperature_mutation_alarm_settings.enable = readUInt8(bytes, counterObj, 1);
				decoded.temperature_mutation_alarm_settings.mutation_max = readInt32LE(bytes, counterObj, 4) / 100;
				break;
			case 0x79:
				decoded.humidity_alarm_settings = decoded.humidity_alarm_settings || {};
				// 0: disable, 1:enable
				decoded.humidity_alarm_settings.enable = readUInt8(bytes, counterObj, 1);
				// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A<x<B, 4:condition: x<A or x>B
				decoded.humidity_alarm_settings.threshold_condition = readUInt8(bytes, counterObj, 1);
				decoded.humidity_alarm_settings.threshold_min = readUInt16LE(bytes, counterObj, 2) / 10;
				decoded.humidity_alarm_settings.threshold_max = readUInt16LE(bytes, counterObj, 2) / 10;
				break;
			case 0x7a:
				decoded.humidity_mutation_alarm_settings = decoded.humidity_mutation_alarm_settings || {};
				// 0: disable, 1:enable
				decoded.humidity_mutation_alarm_settings.enable = readUInt8(bytes, counterObj, 1);
				decoded.humidity_mutation_alarm_settings.mutation_max = readUInt16LE(bytes, counterObj, 2) / 10;
				break;
			case 0x7b:
				decoded.temperature_calibration_settings = decoded.temperature_calibration_settings || {};
				// 0: disable, 1:enable
				decoded.temperature_calibration_settings.enable = readUInt8(bytes, counterObj, 1);
				decoded.temperature_calibration_settings.calibration_value = readInt32LE(bytes, counterObj, 4) / 100;
				break;
			case 0x7c:
				decoded.humidity_calibration_settings = decoded.humidity_calibration_settings || {};
				// 0: disable, 1:enable
				decoded.humidity_calibration_settings.enable = readUInt8(bytes, counterObj, 1);
				decoded.humidity_calibration_settings.calibration_value = readInt16LE(bytes, counterObj, 2) / 10;
				break;
			case 0x64:
				decoded.light_collection_interval = decoded.light_collection_interval || {};
				// 0：second, 1：min
				decoded.light_collection_interval.unit = readUInt8(bytes, counterObj, 1);
				if (decoded.light_collection_interval.unit == 0x00) {
					decoded.light_collection_interval.seconds_of_time = readUInt16LE(bytes, counterObj, 2);
				}
				if (decoded.light_collection_interval.unit == 0x01) {
					decoded.light_collection_interval.minutes_of_time = readUInt16LE(bytes, counterObj, 2);
				}
				break;
			case 0x7d:
				decoded.light_alarm_settings = decoded.light_alarm_settings || {};
				// 0: disable, 1:enable
				decoded.light_alarm_settings.enable = readUInt8(bytes, counterObj, 1);
				// 0:disable, 2:condition: x>B
				decoded.light_alarm_settings.threshold_condition = readUInt8(bytes, counterObj, 1);
				decoded.light_alarm_settings.threshold_max = readUInt16LE(bytes, counterObj, 2);
				break;
			case 0x7e:
				decoded.light_tolerance_value = readUInt8(bytes, counterObj, 1);
				break;
			case 0x7f:
				decoded.tilt_alarm_settings = decoded.tilt_alarm_settings || {};
				// 0: disable, 1:enable
				decoded.tilt_alarm_settings.enable = readUInt8(bytes, counterObj, 1);
				// 0:disable, 2:condition: x>B
				decoded.tilt_alarm_settings.threshold_condition = readUInt8(bytes, counterObj, 1);
				decoded.tilt_alarm_settings.threshold_max = readUInt8(bytes, counterObj, 1);
				decoded.tilt_alarm_settings.duration = readUInt8(bytes, counterObj, 1);
				break;
			case 0x80:
				decoded.falling_alarm_settings = decoded.falling_alarm_settings || {};
				// 0: disable, 1:enable
				decoded.falling_alarm_settings.enable = readUInt8(bytes, counterObj, 1);
				break;
			case 0x81:
				decoded.falling_threshold_alarm_settings = decoded.falling_threshold_alarm_settings || {};
				// 0: FREE_FALL_LEVEL_156, 1: FREE_FALL_LEVEL_219, 2: FREE_FALL_LEVEL_250, 3: FREE_FALL_LEVEL_312, 4: FREE_FALL_LEVEL_344, 5: FREE_FALL_LEVEL_406, 6: FREE_FALL_LEVEL_469, 7: FREE_FALL_LEVEL_500 
				decoded.falling_threshold_alarm_settings.threshold_level = readUInt8(bytes, counterObj, 1);
				decoded.falling_threshold_alarm_settings.time_level = readUInt8(bytes, counterObj, 1);
				break;
			case 0x82:
				decoded.probe_id_retransmit_count = readUInt8(bytes, counterObj, 1);
				break;
			case 0xbf:
				decoded.reset = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0xbe:
				decoded.cellular_status = decoded.cellular_status || {};
				var cellular_status_command = readUInt8(bytes, counterObj, 1);
				if (cellular_status_command == 0x00) {
					// 0:Register Failed, 1:Register Success
					decoded.cellular_status.register_status = readUInt8(bytes, counterObj, 1);
				}
				if (cellular_status_command == 0x01) {
					// 0:Card Status Reservation , 1:SIM Card Recognition Successful , 2:SIM Card Not Recognized , 3:PIN Code Required , 4:PIN Incorrect , 5:Need PUK Code , 6:SIM Card Not Inserted
					decoded.cellular_status.sim_status = readUInt8(bytes, counterObj, 1);
				}
				if (cellular_status_command == 0x02) {
					decoded.cellular_status.imei = readString(bytes, counterObj, 15);
				}
				if (cellular_status_command == 0x03) {
					decoded.cellular_status.imsi = readString(bytes, counterObj, 15);
				}
				if (cellular_status_command == 0x04) {
					decoded.cellular_status.iccid = readString(bytes, counterObj, 20);
				}
				if (cellular_status_command == 0x05) {
					decoded.cellular_status.csq = readInt16LE(bytes, counterObj, 2);
				}
				if (cellular_status_command == 0x06) {
					// 0:Connect Failed, 1:Connect Success
					decoded.cellular_status.connected_status = readUInt8(bytes, counterObj, 1);
				}
				if (cellular_status_command == 0x11) {
					// 0:Connect Failed, 1:Connect Success
					decoded.cellular_status.milesight_mqtt_status = readUInt8(bytes, counterObj, 1);
				}
				if (cellular_status_command == 0x15) {
					// 0:Connect Failed, 1:Connect Success
					decoded.cellular_status.milesight_dtls_status = readUInt8(bytes, counterObj, 1);
				}
				break;
			case 0xbd:
				decoded.clear_historical_data = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0xbc:
				decoded.stop_historical_data_retrieval = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0xba:
				decoded.retrieve_historical_data_by_time = decoded.retrieve_historical_data_by_time || {};
				decoded.retrieve_historical_data_by_time.time = readUInt32LE(bytes, counterObj, 4);
				break;
			case 0xbb:
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
			case 0x50:
				decoded.clear_alarm_item = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0x51:
				decoded.set_zero_calibration = decoded.set_zero_calibration || {};
				// 0:Clear zero calibration, 1:Start zero calibration
				decoded.set_zero_calibration.operation = readUInt8(bytes, counterObj, 1);
				break;
			case 0x52:
				decoded.set_retrieval_initial_surface = decoded.set_retrieval_initial_surface || {};
				// 0:Reset the zero reference point to the horizontal plane, 1:Set the current plane as the new zero reference point
				decoded.set_retrieval_initial_surface.operation = readUInt8(bytes, counterObj, 1);
				break;
			case 0x53:
				decoded.get_sensor_id = readOnlyCommand(bytes, counterObj, 0);
				break;
			case 0x55:
				decoded.temperature_humidity_display_switch = decoded.temperature_humidity_display_switch || {};
				// 0： temperature, 1: humidity
				decoded.temperature_humidity_display_switch.switch = readUInt8(bytes, counterObj, 1);
				break;
			case 0xce:
				decoded.cellular_settings = decoded.cellular_settings || {};
				var cellular_settings_command = readUInt8(bytes, counterObj, 1);
				if (cellular_settings_command == 0x3f) {
					// 0: Low Power Mode
					decoded.cellular_settings.work_mode = readUInt8(bytes, counterObj, 1);
				}
				if (cellular_settings_command == 0x42) {
					// 1:UDP, 2:TCP, 3:AWS, 4:MQTT, 7:Developer-DTLS
					decoded.cellular_settings.transport_type = readUInt8(bytes, counterObj, 1);
				}
				if (cellular_settings_command == 0x41) {
					decoded.cellular_settings.network = decoded.cellular_settings.network || {};
					var cellular_settings_network_command = readUInt8(bytes, counterObj, 1);
					if (cellular_settings_network_command == 0x00) {
						decoded.cellular_settings.network.apn = readString(bytes, counterObj, 31);
					}
					if (cellular_settings_network_command == 0x01) {
						// 0：None, 1：PAP, 3：CHAP
						decoded.cellular_settings.network.auth_mode = readUInt8(bytes, counterObj, 1);
					}
					if (cellular_settings_network_command == 0x02) {
						decoded.cellular_settings.network.auth_username = readString(bytes, counterObj, 63);
					}
					if (cellular_settings_network_command == 0x03) {
						decoded.cellular_settings.network.password = readString(bytes, counterObj, 63);
					}
					if (cellular_settings_network_command == 0x04) {
						decoded.cellular_settings.network.pin = readString(bytes, counterObj, 8);
					}
					if (cellular_settings_network_command == 0x05) {
						// 0：Auto, 1：Cat-N, 3：NB-IOT
						decoded.cellular_settings.network.type = readUInt8(bytes, counterObj, 1);
					}
				}
				if (cellular_settings_command == 0x00) {
					decoded.cellular_settings.mqtt_settings = decoded.cellular_settings.mqtt_settings || {};
					var cellular_settings_mqtt_settings_command = readUInt8(bytes, counterObj, 1);
					if (cellular_settings_mqtt_settings_command == 0x00) {
						decoded.cellular_settings.mqtt_settings.server_address = readString(bytes, counterObj, 127);
					}
					if (cellular_settings_mqtt_settings_command == 0x01) {
						decoded.cellular_settings.mqtt_settings.server_port = readUInt16LE(bytes, counterObj, 2);
					}
					if (cellular_settings_mqtt_settings_command == 0x02) {
						decoded.cellular_settings.mqtt_settings.keepalive_interval = readUInt16LE(bytes, counterObj, 2);
					}
					if (cellular_settings_mqtt_settings_command == 0x03) {
						decoded.cellular_settings.mqtt_settings.client_id = readString(bytes, counterObj, 63);
					}
					if (cellular_settings_mqtt_settings_command == 0x04) {
						// 0：disable, 1：enable
						decoded.cellular_settings.mqtt_settings.auth_enable = readUInt8(bytes, counterObj, 1);
					}
					if (cellular_settings_mqtt_settings_command == 0x05) {
						decoded.cellular_settings.mqtt_settings.auth_username = readString(bytes, counterObj, 127);
					}
					if (cellular_settings_mqtt_settings_command == 0x06) {
						decoded.cellular_settings.mqtt_settings.auth_password = readString(bytes, counterObj, 127);
					}
					if (cellular_settings_mqtt_settings_command == 0x07) {
						// 0：disable, 1：enable
						decoded.cellular_settings.mqtt_settings.enable_tls = readUInt8(bytes, counterObj, 1);
					}
					if (cellular_settings_mqtt_settings_command == 0x08) {
						// 0：disable, 1：enable
						decoded.cellular_settings.mqtt_settings.enable_ca_certificate = readUInt8(bytes, counterObj, 1);
					}
					if (cellular_settings_mqtt_settings_command == 0x09) {
						decoded.cellular_settings.mqtt_settings.ca_certificate_length = readUInt16LE(bytes, counterObj, 2);
					}
					if (cellular_settings_mqtt_settings_command == 0x0a) {
						decoded.cellular_settings.mqtt_settings.ca_certificate = readString(bytes, counterObj, 160);
					}
					if (cellular_settings_mqtt_settings_command == 0x0b) {
						// 0：disable, 1：enable
						decoded.cellular_settings.mqtt_settings.enable_client_certificate = readUInt8(bytes, counterObj, 1);
					}
					if (cellular_settings_mqtt_settings_command == 0x0c) {
						decoded.cellular_settings.mqtt_settings.client_certificate_length = readUInt16LE(bytes, counterObj, 2);
					}
					if (cellular_settings_mqtt_settings_command == 0x0d) {
						decoded.cellular_settings.mqtt_settings.client_certificate = readString(bytes, counterObj, 160);
					}
					if (cellular_settings_mqtt_settings_command == 0x0e) {
						// 0：disable, 1：enable
						decoded.cellular_settings.mqtt_settings.enable_key_certificate = readUInt8(bytes, counterObj, 1);
					}
					if (cellular_settings_mqtt_settings_command == 0x0f) {
						decoded.cellular_settings.mqtt_settings.key_certificate_length = readUInt16LE(bytes, counterObj, 2);
					}
					if (cellular_settings_mqtt_settings_command == 0x10) {
						decoded.cellular_settings.mqtt_settings.key_certificate = readString(bytes, counterObj, 160);
					}
					if (cellular_settings_mqtt_settings_command == 0x11) {
						decoded.cellular_settings.mqtt_settings.uplink_topic = readString(bytes, counterObj, 127);
					}
					if (cellular_settings_mqtt_settings_command == 0x12) {
						// 0：QoS0, 1：QoS1, 2：QoS2
						decoded.cellular_settings.mqtt_settings.uplink_qos = readUInt8(bytes, counterObj, 1);
					}
					if (cellular_settings_mqtt_settings_command == 0x13) {
						decoded.cellular_settings.mqtt_settings.downlink_topic = readString(bytes, counterObj, 127);
					}
					if (cellular_settings_mqtt_settings_command == 0x14) {
						// 0：QoS0, 1：QoS1, 2：QoS2
						decoded.cellular_settings.mqtt_settings.downlink_qos = readUInt8(bytes, counterObj, 1);
					}
					if (cellular_settings_mqtt_settings_command == 0x21) {
						// 0：Connect Failed, 1：Connect Success
						decoded.cellular_settings.mqtt_settings.mqtt_status = readUInt8(bytes, counterObj, 1);
					}
				}
				if (cellular_settings_command == 0x02) {
					decoded.cellular_settings.aws_settings = decoded.cellular_settings.aws_settings || {};
					var cellular_settings_aws_settings_command = readUInt8(bytes, counterObj, 1);
					if (cellular_settings_aws_settings_command == 0x00) {
						decoded.cellular_settings.aws_settings.server_address = readString(bytes, counterObj, 127);
					}
					if (cellular_settings_aws_settings_command == 0x01) {
						decoded.cellular_settings.aws_settings.server_port = readUInt16LE(bytes, counterObj, 2);
					}
					if (cellular_settings_aws_settings_command == 0x02) {
						decoded.cellular_settings.aws_settings.keepalive_interval = readUInt16LE(bytes, counterObj, 2);
					}
					if (cellular_settings_aws_settings_command == 0x08) {
						// 0：disable, 1：enable
						decoded.cellular_settings.aws_settings.enable_ca_certificate = readUInt8(bytes, counterObj, 1);
					}
					if (cellular_settings_aws_settings_command == 0x09) {
						decoded.cellular_settings.aws_settings.ca_certificate_length = readUInt16LE(bytes, counterObj, 2);
					}
					if (cellular_settings_aws_settings_command == 0x0a) {
						decoded.cellular_settings.aws_settings.ca_certificate = readString(bytes, counterObj, 160);
					}
					if (cellular_settings_aws_settings_command == 0x0b) {
						// 0：disable, 1：enable
						decoded.cellular_settings.aws_settings.enable_client_certificate = readUInt8(bytes, counterObj, 1);
					}
					if (cellular_settings_aws_settings_command == 0x0c) {
						decoded.cellular_settings.aws_settings.client_certificate_length = readUInt16LE(bytes, counterObj, 2);
					}
					if (cellular_settings_aws_settings_command == 0x0d) {
						decoded.cellular_settings.aws_settings.client_certificate = readString(bytes, counterObj, 160);
					}
					if (cellular_settings_aws_settings_command == 0x0e) {
						// 0：disable, 1：enable
						decoded.cellular_settings.aws_settings.enable_key_certificate = readUInt8(bytes, counterObj, 1);
					}
					if (cellular_settings_aws_settings_command == 0x0f) {
						decoded.cellular_settings.aws_settings.key_certificate_length = readUInt16LE(bytes, counterObj, 2);
					}
					if (cellular_settings_aws_settings_command == 0x10) {
						decoded.cellular_settings.aws_settings.key_certificate = readString(bytes, counterObj, 160);
					}
					if (cellular_settings_aws_settings_command == 0x21) {
						// 0：Connect Failed, 1：Connect Success
						decoded.cellular_settings.aws_settings.aws_status = readUInt8(bytes, counterObj, 1);
					}
				}
				if (cellular_settings_command == 0x05) {
					decoded.cellular_settings.tcp_settings = decoded.cellular_settings.tcp_settings || [];
					var id = readUInt8(bytes, counterObj, 1);
					var tcp_settings_item = pickArrayItem(decoded.cellular_settings.tcp_settings, id, 'id');
					tcp_settings_item.id = id;
					insertArrayItem(decoded.cellular_settings.tcp_settings, tcp_settings_item, 'id');
					var cellular_settings_tcp_settings_item_command = readUInt8(bytes, counterObj, 1);
					if (cellular_settings_tcp_settings_item_command == 0x00) {
						// 0：disable, 1：enable
						tcp_settings_item.enable = readUInt8(bytes, counterObj, 1);
					}
					if (cellular_settings_tcp_settings_item_command == 0x01) {
						tcp_settings_item.server_address = readString(bytes, counterObj, 127);
					}
					if (cellular_settings_tcp_settings_item_command == 0x02) {
						tcp_settings_item.server_port = readUInt16LE(bytes, counterObj, 2);
					}
					if (cellular_settings_tcp_settings_item_command == 0x03) {
						tcp_settings_item.retry_count = readUInt8(bytes, counterObj, 1);
					}
					if (cellular_settings_tcp_settings_item_command == 0x04) {
						tcp_settings_item.retry_interval = readUInt8(bytes, counterObj, 1);
					}
					if (cellular_settings_tcp_settings_item_command == 0x05) {
						tcp_settings_item.keepalive_interval = readUInt16LE(bytes, counterObj, 2);
					}
					if (cellular_settings_tcp_settings_item_command == 0x06) {
						// 0：Connect Failed, 1：Connect Success
						tcp_settings_item.tcp_status = readUInt8(bytes, counterObj, 1);
					}
				}
				if (cellular_settings_command == 0x0f) {
					decoded.cellular_settings.udp_settings = decoded.cellular_settings.udp_settings || [];
					var id = readUInt8(bytes, counterObj, 1);
					var udp_settings_item = pickArrayItem(decoded.cellular_settings.udp_settings, id, 'id');
					udp_settings_item.id = id;
					insertArrayItem(decoded.cellular_settings.udp_settings, udp_settings_item, 'id');
					var cellular_settings_udp_settings_item_command = readUInt8(bytes, counterObj, 1);
					if (cellular_settings_udp_settings_item_command == 0x00) {
						// 0：disable, 1：enable
						udp_settings_item.enable = readUInt8(bytes, counterObj, 1);
					}
					if (cellular_settings_udp_settings_item_command == 0x01) {
						udp_settings_item.server_address = readString(bytes, counterObj, 127);
					}
					if (cellular_settings_udp_settings_item_command == 0x02) {
						udp_settings_item.server_port = readUInt16LE(bytes, counterObj, 2);
					}
					if (cellular_settings_udp_settings_item_command == 0x03) {
						// 0：Connect Failed, 1：Connect Success
						udp_settings_item.udp_status = readUInt8(bytes, counterObj, 1);
					}
				}
				if (cellular_settings_command == 0x01) {
					decoded.cellular_settings.milesight_mqtt_settings = decoded.cellular_settings.milesight_mqtt_settings || {};
					var cellular_settings_milesight_mqtt_settings_command = readUInt8(bytes, counterObj, 1);
					if (cellular_settings_milesight_mqtt_settings_command == 0x21) {
						// 0：Connect Failed, 1：Connect Success
						decoded.cellular_settings.milesight_mqtt_settings.status = readUInt8(bytes, counterObj, 1);
					}
				}
				if (cellular_settings_command == 0x19) {
					decoded.cellular_settings.milesight_dtls_settings = decoded.cellular_settings.milesight_dtls_settings || {};
					var cellular_settings_milesight_dtls_settings_command = readUInt8(bytes, counterObj, 1);
					if (cellular_settings_milesight_dtls_settings_command == 0x00) {
						// 0：Connect Failed, 1：Connect Success
						decoded.cellular_settings.milesight_dtls_settings.status = readUInt8(bytes, counterObj, 1);
					}
				}
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
		  "11": "battery_alarm",
		  "50": "clear_alarm_item",
		  "51": "set_zero_calibration",
		  "52": "set_retrieval_initial_surface",
		  "53": "get_sensor_id",
		  "55": "temperature_humidity_display_switch",
		  "60": "reporting_interval",
		  "61": "cumulative_times",
		  "62": "collection_interval",
		  "63": "alarm_reporting_times",
		  "64": "light_collection_interval",
		  "65": "temperature_unit",
		  "71": "base_station_position_enable",
		  "72": "base_station_position_auth_token",
		  "73": "airplane_mode_time_period_settings",
		  "75": "alarm_deactivation_enable",
		  "76": "button_lock",
		  "77": "temperature_alarm_settings",
		  "78": "temperature_mutation_alarm_settings",
		  "79": "humidity_alarm_settings",
		  "80": "falling_alarm_settings",
		  "81": "falling_threshold_alarm_settings",
		  "82": "probe_id_retransmit_count",
		  "1110": "battery_alarm.lower_battery_alarm",
		  "7300": "airplane_mode_time_period_settings.enable",
		  "7301": "airplane_mode_time_period_settings.start_timestamp",
		  "7302": "airplane_mode_time_period_settings.end_timestamp",
		  "fe": "request_check_order",
		  "ef": "request_command_queries",
		  "ee": "request_query_all_configurations",
		  "ed": "historical_data_report",
		  "df": "tsl_version",
		  "de": "product_name",
		  "dd": "product_pn",
		  "db": "product_sn",
		  "da": "version",
		  "d9": "oem_id",
		  "c9": "random_key",
		  "c8": "device_status",
		  "d8": "product_frequency_band",
		  "d7": "device_info",
		  "01": "battery",
		  "03": "sensor_id",
		  "04": "temperature",
		  "05": "humidity",
		  "06": "base_station_position",
		  "07": "airplane_mode_state",
		  "1a": "temperature_alarm_types",
		  "08": "temperature_alarm",
		  "1b": "humidity_alarm_types",
		  "09": "humidity_alarm",
		  "1c": "tilt_alarm_types",
		  "0a": "tilt_alarm",
		  "1d": "light_alarm_types",
		  "0b": "light_alarm",
		  "0c": "probe_connect_status",
		  "0d": "relative_surface_info",
		  "0e": "report_package_type",
		  "eb": "debugging_commands",
		  "c4": "auto_p_enable",
		  "c7": "time_zone",
		  "c6": "daylight_saving_time",
		  "c5": "data_storage_settings",
		  "c500": "data_storage_settings.enable",
		  "c501": "data_storage_settings.retransmission_enable",
		  "c502": "data_storage_settings.retransmission_interval",
		  "c503": "data_storage_settings.retrieval_interval",
		  "7a": "humidity_mutation_alarm_settings",
		  "7b": "temperature_calibration_settings",
		  "7c": "humidity_calibration_settings",
		  "7d": "light_alarm_settings",
		  "7e": "light_tolerance_value",
		  "7f": "tilt_alarm_settings",
		  "bf": "reset",
		  "be": "reboot",
		  "bd": "clear_historical_data",
		  "bc": "stop_historical_data_retrieval",
		  "ba": "retrieve_historical_data_by_time",
		  "bb": "retrieve_historical_data_by_time_range",
		  "b9": "query_device_status",
		  "b8": "synchronize_time",
		  "b7": "set_time",
		  "ce": "cellular_settings",
		  "ce3f": "cellular_settings.work_mode",
		  "ce42": "cellular_settings.transport_type",
		  "ce41": "cellular_settings.network",
		  "ce4100": "cellular_settings.network.apn",
		  "ce4101": "cellular_settings.network.auth_mode",
		  "ce4102": "cellular_settings.network.auth_username",
		  "ce4103": "cellular_settings.network.password",
		  "ce4104": "cellular_settings.network.pin",
		  "ce4105": "cellular_settings.network.type",
		  "ce00": "cellular_settings.mqtt_settings",
		  "ce0000": "cellular_settings.mqtt_settings.server_address",
		  "ce0001": "cellular_settings.mqtt_settings.server_port",
		  "ce0002": "cellular_settings.mqtt_settings.keepalive_interval",
		  "ce0003": "cellular_settings.mqtt_settings.client_id",
		  "ce0004": "cellular_settings.mqtt_settings.auth_enable",
		  "ce0005": "cellular_settings.mqtt_settings.auth_username",
		  "ce0006": "cellular_settings.mqtt_settings.auth_password",
		  "ce0007": "cellular_settings.mqtt_settings.enable_tls",
		  "ce0008": "cellular_settings.mqtt_settings.enable_ca_certificate",
		  "ce0009": "cellular_settings.mqtt_settings.ca_certificate_length",
		  "ce000a": "cellular_settings.mqtt_settings.ca_certificate",
		  "ce000b": "cellular_settings.mqtt_settings.enable_client_certificate",
		  "ce000c": "cellular_settings.mqtt_settings.client_certificate_length",
		  "ce000d": "cellular_settings.mqtt_settings.client_certificate",
		  "ce000e": "cellular_settings.mqtt_settings.enable_key_certificate",
		  "ce000f": "cellular_settings.mqtt_settings.key_certificate_length",
		  "ce0010": "cellular_settings.mqtt_settings.key_certificate",
		  "ce0011": "cellular_settings.mqtt_settings.uplink_topic",
		  "ce0012": "cellular_settings.mqtt_settings.uplink_qos",
		  "ce0013": "cellular_settings.mqtt_settings.downlink_topic",
		  "ce0014": "cellular_settings.mqtt_settings.downlink_qos",
		  "ce0021": "cellular_settings.mqtt_settings.mqtt_status",
		  "ce02": "cellular_settings.aws_settings",
		  "ce0200": "cellular_settings.aws_settings.server_address",
		  "ce0201": "cellular_settings.aws_settings.server_port",
		  "ce0202": "cellular_settings.aws_settings.keepalive_interval",
		  "ce0208": "cellular_settings.aws_settings.enable_ca_certificate",
		  "ce0209": "cellular_settings.aws_settings.ca_certificate_length",
		  "ce020a": "cellular_settings.aws_settings.ca_certificate",
		  "ce020b": "cellular_settings.aws_settings.enable_client_certificate",
		  "ce020c": "cellular_settings.aws_settings.client_certificate_length",
		  "ce020d": "cellular_settings.aws_settings.client_certificate",
		  "ce020e": "cellular_settings.aws_settings.enable_key_certificate",
		  "ce020f": "cellular_settings.aws_settings.key_certificate_length",
		  "ce0210": "cellular_settings.aws_settings.key_certificate",
		  "ce0221": "cellular_settings.aws_settings.aws_status",
		  "ce05": "cellular_settings.tcp_settings",
		  "ce05xx": "cellular_settings.tcp_settings._item",
		  "ce05xx00": "cellular_settings.tcp_settings._item.enable",
		  "ce05xx01": "cellular_settings.tcp_settings._item.server_address",
		  "ce05xx02": "cellular_settings.tcp_settings._item.server_port",
		  "ce05xx03": "cellular_settings.tcp_settings._item.retry_count",
		  "ce05xx04": "cellular_settings.tcp_settings._item.retry_interval",
		  "ce05xx05": "cellular_settings.tcp_settings._item.keepalive_interval",
		  "ce05xx06": "cellular_settings.tcp_settings._item.tcp_status",
		  "ce0f": "cellular_settings.udp_settings",
		  "ce0fxx": "cellular_settings.udp_settings._item",
		  "ce0fxx00": "cellular_settings.udp_settings._item.enable",
		  "ce0fxx01": "cellular_settings.udp_settings._item.server_address",
		  "ce0fxx02": "cellular_settings.udp_settings._item.server_port",
		  "ce0fxx03": "cellular_settings.udp_settings._item.udp_status",
		  "ce01": "cellular_settings.milesight_mqtt_settings",
		  "ce0121": "cellular_settings.milesight_mqtt_settings.status",
		  "ce19": "cellular_settings.milesight_dtls_settings",
		  "ce1900": "cellular_settings.milesight_dtls_settings.status"
	};
}