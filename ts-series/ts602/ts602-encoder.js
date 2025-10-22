/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product TS602
 */
var RAW_VALUE = 0x00;
var WITH_QUERY_CMD = 0x00;

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
	//0xFE
	if ('request_check_order' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xfe);
		buffer.writeUInt8(payload.request_check_order.order);
		buffer.writeUInt8(payload.check_order_reply.order);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xEE
	if ('request_query_all_configurations' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xee);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xED
	if ('historical_data_report' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xed);
		// 0：target time, 1：historical time
		buffer.writeUInt8(payload.historical_data_report.mode);
		buffer.writeUInt32LE(payload.historical_data_report.timestamp);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xDF
	if ('tsl_version' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xdf);
		buffer.writeHexString(payload.tsl_version, 2);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xDE
	if ('product_name' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xde);
		buffer.writeString(payload.product_name, 32);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xDD
	if ('product_pn' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xdd);
		buffer.writeString(payload.product_pn, 32);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xDB
	if ('product_sn' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xdb);
		buffer.writeHexString(payload.product_sn, 8);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xDA
	if ('version' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xda);
		buffer.writeHexString(payload.version.hardware_version, 2);
		buffer.writeHexString(payload.version.firmware_version, 6);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xD9
	if ('oem_id' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xd9);
		buffer.writeHexString(payload.oem_id, 2);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xC9
	if ('random_key' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xc9);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.random_key);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xC8
	if ('device_status' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xc8);
		// 0：Off, 1：On
		buffer.writeUInt8(payload.device_status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xD8
	if ('product_frequency_band' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xd8);
		buffer.writeString(payload.product_frequency_band, 16);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xD7
	if ('device_info' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xd7);
		buffer.writeString(payload.device_info.model, 8);
		buffer.writeString(payload.device_info.submodel_1, 8);
		buffer.writeString(payload.device_info.submodel_2, 8);
		buffer.writeString(payload.device_info.submodel_3, 8);
		buffer.writeString(payload.device_info.submodel_4, 8);
		buffer.writeString(payload.device_info.pn_1, 8);
		buffer.writeString(payload.device_info.pn_2, 8);
		buffer.writeString(payload.device_info.pn_3, 8);
		buffer.writeString(payload.device_info.pn_4, 8);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x01
	if ('battery' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x01);
		buffer.writeUInt8(payload.battery);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x03
	if ('sensor_id' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x03);
		// 0：none, 1:PT100, 2: SHT41,       3: DS18B20
		buffer.writeUInt8(payload.sensor_id.type);
		buffer.writeHexString(payload.sensor_id.id, 8);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x04
	if ('temperature' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x04);
		buffer.writeInt32LE(payload.temperature * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x05
	if ('humidity' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x05);
		buffer.writeUInt16LE(payload.humidity * 10);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x06
	if ('base_station_position' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x06);
		buffer.writeInt32LE(payload.base_station_position.latitude * 1000000);
		buffer.writeInt32LE(payload.base_station_position.longitude * 1000000);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x07
	if ('airplane_mode_state' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x07);
		// 0: enter airplane mode, 1: exit airplane mode
		buffer.writeUInt8(payload.airplane_mode_state);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x08
	if ('temperature_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x08);
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
			buffer.writeInt32LE(payload.temperature_alarm.lower_range_alarm_deactivation.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x11) {
			buffer.writeInt32LE(payload.temperature_alarm.lower_range_alarm_trigger.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x12) {
			buffer.writeInt32LE(payload.temperature_alarm.over_range_alarm_deactivation.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x13) {
			buffer.writeInt32LE(payload.temperature_alarm.over_range_alarm_trigger.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x14) {
			buffer.writeInt32LE(payload.temperature_alarm.within_range_alarm_deactivation.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x15) {
			buffer.writeInt32LE(payload.temperature_alarm.within_range_alarm_trigger.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x16) {
			buffer.writeInt32LE(payload.temperature_alarm.exceed_range_alarm_deactivation.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x17) {
			buffer.writeInt32LE(payload.temperature_alarm.exceed_range_alarm_trigger.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x30) {
			buffer.writeInt32LE(payload.temperature_alarm.mutation_alarm_trigger_no_mutation.temperature * 100);
		}
		if (payload.temperature_alarm.type == 0x20) {
			buffer.writeInt32LE(payload.temperature_alarm.mutation_alarm_trigger.temperature * 100);
			buffer.writeInt32LE(payload.temperature_alarm.mutation_alarm_trigger.saltation * 100);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x09
	if ('humidity_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x09);
		buffer.writeUInt8(payload.humidity_alarm.type);
		if (payload.humidity_alarm.type == 0x00) {
		}
		if (payload.humidity_alarm.type == 0x01) {
		}
		if (payload.humidity_alarm.type == 0x02) {
		}
		if (payload.humidity_alarm.type == 0x03) {
		}
		if (payload.humidity_alarm.type == 0x10) {
			buffer.writeUInt16LE(payload.humidity_alarm.lower_range_alarm_deactivation.humidity * 10);
		}
		if (payload.humidity_alarm.type == 0x11) {
			buffer.writeUInt16LE(payload.humidity_alarm.lower_range_alarm_trigger.humidity * 10);
		}
		if (payload.humidity_alarm.type == 0x12) {
			buffer.writeUInt16LE(payload.humidity_alarm.over_range_alarm_deactivation.humidity * 10);
		}
		if (payload.humidity_alarm.type == 0x13) {
			buffer.writeUInt16LE(payload.humidity_alarm.over_range_alarm_trigger.humidity * 10);
		}
		if (payload.humidity_alarm.type == 0x14) {
			buffer.writeUInt16LE(payload.humidity_alarm.within_range_alarm_deactivation.humidity * 10);
		}
		if (payload.humidity_alarm.type == 0x15) {
			buffer.writeUInt16LE(payload.humidity_alarm.within_range_alarm_trigger.humidity * 10);
		}
		if (payload.humidity_alarm.type == 0x16) {
			buffer.writeUInt16LE(payload.humidity_alarm.exceed_range_alarm_deactivation.humidity * 10);
		}
		if (payload.humidity_alarm.type == 0x17) {
			buffer.writeUInt16LE(payload.humidity_alarm.exceed_range_alarm_trigger.humidity * 10);
		}
		if (payload.humidity_alarm.type == 0x30) {
			buffer.writeUInt16LE(payload.humidity_alarm.mutation_alarm_trigger_no_mutation.humidity * 10);
		}
		if (payload.humidity_alarm.type == 0x20) {
			buffer.writeUInt16LE(payload.humidity_alarm.mutation_alarm_trigger.humidity * 10);
			buffer.writeUInt16LE(payload.humidity_alarm.mutation_alarm_trigger.saltation * 10);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0A
	if ('tilt_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0a);
		buffer.writeUInt8(payload.tilt_alarm.type);
		if (payload.tilt_alarm.type == 0x00) {
		}
		if (payload.tilt_alarm.type == 0x01) {
		}
		if (payload.tilt_alarm.type == 0x02) {
		}
		if (payload.tilt_alarm.type == 0x03) {
		}
		if (payload.tilt_alarm.type == 0x10) {
		}
		if (payload.tilt_alarm.type == 0x11) {
		}
		if (payload.tilt_alarm.type == 0x21) {
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0B
	if ('light_alarm' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0b);
		buffer.writeUInt8(payload.light_alarm.type);
		if (payload.light_alarm.type == 0x00) {
		}
		if (payload.light_alarm.type == 0x01) {
		}
		if (payload.light_alarm.type == 0x02) {
		}
		if (payload.light_alarm.type == 0x03) {
		}
		if (payload.light_alarm.type == 0x10) {
		}
		if (payload.light_alarm.type == 0x11) {
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0C
	if ('probe_connect_status' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0c);
		// 0：disconnect, 1：connect
		buffer.writeUInt8(payload.probe_connect_status);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0D
	if ('relative_surface_info' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0d);
		buffer.writeInt16LE(payload.relative_surface_info.angle_x * 100);
		buffer.writeInt16LE(payload.relative_surface_info.angle_y * 100);
		buffer.writeInt16LE(payload.relative_surface_info.angle_z * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x0E
	if ('report_package_type' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x0e);
		// 0：Normal cycle package, 1：Key cycle package
		buffer.writeUInt8(payload.report_package_type);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xEB
	if ('debugging_commands' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xeb);
		buffer.writeUInt16LE(payload.debugging_commands.length);
		buffer.writeString(payload.debugging_commands.content, 0);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xC4
	if ('auto_p_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xc4);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.auto_p_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x60
	if ('reporting_interval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x60);
		// 0：second, 1：min
		buffer.writeUInt8(payload.reporting_interval.unit);
		if (payload.reporting_interval.unit == 0x00) {
			buffer.writeUInt16LE(payload.reporting_interval.seconds_of_time);
		}
		if (payload.reporting_interval.unit == 0x01) {
			buffer.writeUInt16LE(payload.reporting_interval.minutes_of_time);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x61
	if ('cumulative_times' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x61);
		buffer.writeUInt8(payload.cumulative_times);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x62
	if ('collection_interval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x62);
		// 0：second, 1：min
		buffer.writeUInt8(payload.collection_interval.unit);
		if (payload.collection_interval.unit == 0x00) {
			buffer.writeUInt16LE(payload.collection_interval.seconds_of_time);
		}
		if (payload.collection_interval.unit == 0x01) {
			buffer.writeUInt16LE(payload.collection_interval.minutes_of_time);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x63
	if ('alarm_reporting_times' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x63);
		buffer.writeUInt16LE(payload.alarm_reporting_times);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x64
	if ('light_collection_interval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x64);
		// 0：second, 1：min
		buffer.writeUInt8(payload.light_collection_interval.unit);
		if (payload.light_collection_interval.unit == 0x00) {
			buffer.writeUInt16LE(payload.light_collection_interval.seconds_of_time);
		}
		if (payload.light_collection_interval.unit == 0x01) {
			buffer.writeUInt16LE(payload.light_collection_interval.minutes_of_time);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x65
	if ('temperature_unit' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x65);
		// 0：℃, 1：℉
		buffer.writeUInt8(payload.temperature_unit);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x70
	if ('airplane_mode_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x70);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.airplane_mode_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xC7
	if ('time_zone' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xc7);
		buffer.writeInt16LE(payload.time_zone);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xC6
	if ('daylight_saving_time' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xc6);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.daylight_saving_time.daylight_saving_time_enable);
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
	//0xC5
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
			buffer.writeUInt16LE(payload.data_storage_settings.retransmission_interval);
		}
		if (isValid(payload.data_storage_settings.retrieval_interval)) {
			buffer.writeUInt8(0xc5);
			buffer.writeUInt8(0x03);
			buffer.writeUInt16LE(payload.data_storage_settings.retrieval_interval);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x71
	if ('base_station_position_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x71);
		// 0：disable, 1：enable
		buffer.writeUInt8(payload.base_station_position_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x72
	if ('base_station_position_auth_token' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x72);
		buffer.writeString(payload.base_station_position_auth_token, 16);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x73
	if ('airplane_mode_time_period_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.airplane_mode_time_period_settings.start_timestamp)) {
			buffer.writeUInt8(0x73);
			buffer.writeUInt8(0x00);
			buffer.writeUInt8(payload.airplane_mode_time_period_settings.start_timestamp.year);
			buffer.writeUInt8(payload.airplane_mode_time_period_settings.start_timestamp.month);
			buffer.writeUInt8(payload.airplane_mode_time_period_settings.start_timestamp.day);
			buffer.writeUInt8(payload.airplane_mode_time_period_settings.start_timestamp.hour);
			buffer.writeUInt8(payload.airplane_mode_time_period_settings.start_timestamp.minute);
			buffer.writeUInt8(payload.airplane_mode_time_period_settings.start_timestamp.second);
		}
		if (isValid(payload.airplane_mode_time_period_settings.end_timestamp)) {
			buffer.writeUInt8(0x73);
			buffer.writeUInt8(0x01);
			buffer.writeUInt8(payload.airplane_mode_time_period_settings.end_timestamp.year);
			buffer.writeUInt8(payload.airplane_mode_time_period_settings.end_timestamp.month);
			buffer.writeUInt8(payload.airplane_mode_time_period_settings.end_timestamp.day);
			buffer.writeUInt8(payload.airplane_mode_time_period_settings.end_timestamp.hour);
			buffer.writeUInt8(payload.airplane_mode_time_period_settings.end_timestamp.minute);
			buffer.writeUInt8(payload.airplane_mode_time_period_settings.end_timestamp.second);
		}
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x74
	if ('temperature_humidity_display_switch' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x74);
		// 0： temperature, 1: humidity
		buffer.writeUInt8(payload.temperature_humidity_display_switch);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x75
	if ('alarm_deactivation_enable' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x75);
		// 0: disable, 1:enable
		buffer.writeUInt8(payload.alarm_deactivation_enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x76
	if ('button_lock' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x76);
		// 0: disable, 1:enable
		buffer.writeUInt8(payload.button_lock.enable);
		var bitOptions = 0;
		// 0:  disable lock power off, 1:enable lock collect
		bitOptions |= payload.button_lock.power_off_enable << 0;
		// 0: enablecollect, 1:disable lock collect
		bitOptions |= payload.button_lock.collect_report_enable << 1;
		// 0: enablecollect, 1:disable lock collect
		bitOptions |= payload.button_lock.reserve << 2;
		buffer.writeUInt8(bitOptions);

		encoded = encoded.concat(buffer.toBytes());
	}
	//0x77
	if ('temperature_alarm_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x77);
		// 0: disable, 1:enable
		buffer.writeUInt8(payload.temperature_alarm_settings.enable);
		// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A<x<B, 4:condition: x<A or x>B
		buffer.writeUInt8(payload.temperature_alarm_settings.threshold_condition);
		buffer.writeInt32LE(payload.temperature_alarm_settings.threshold_min * 100);
		buffer.writeInt32LE(payload.temperature_alarm_settings.threshold_max * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x78
	if ('temperature_mutation_alarm_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x78);
		// 0: disable, 1:enable
		buffer.writeUInt8(payload.temperature_mutation_alarm_settings.enable);
		buffer.writeInt32LE(payload.temperature_mutation_alarm_settings.mutation_max * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x79
	if ('humidity_alarm_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x79);
		// 0: disable, 1:enable
		buffer.writeUInt8(payload.humidity_alarm_settings.enable);
		// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A<x<B, 4:condition: x<A or x>B
		buffer.writeUInt8(payload.humidity_alarm_settings.threshold_condition);
		buffer.writeUInt16LE(payload.humidity_alarm_settings.threshold_min * 10);
		buffer.writeUInt16LE(payload.humidity_alarm_settings.threshold_max * 10);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x7A
	if ('humidity_mutation_alarm_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x7a);
		// 0: disable, 1:enable
		buffer.writeUInt8(payload.humidity_mutation_alarm_settings.enable);
		buffer.writeUInt16LE(payload.humidity_mutation_alarm_settings.mutation_max * 10);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x7B
	if ('temperature_calibration_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x7b);
		// 0: disable, 1:enable
		buffer.writeUInt8(payload.temperature_calibration_settings.enable);
		buffer.writeInt32LE(payload.temperature_calibration_settings.calibration_value * 100);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x7C
	if ('humidity_calibration_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x7c);
		// 0: disable, 1:enable
		buffer.writeUInt8(payload.humidity_calibration_settings.enable);
		buffer.writeInt16LE(payload.humidity_calibration_settings.calibration_value * 10);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x7D
	if ('light_alarm_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x7d);
		// 0: disable, 1:enable
		buffer.writeUInt8(payload.light_alarm_settings.enable);
		// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A<x<B, 4:condition: x<A or x>B
		buffer.writeUInt8(payload.light_alarm_settings.threshold_condition);
		buffer.writeUInt16LE(payload.light_alarm_settings.threshold_max);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x7E
	if ('light_tolerance_value' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x7e);
		buffer.writeUInt8(payload.light_tolerance_value);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x7F
	if ('tilt_alarm_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x7f);
		// 0: disable, 1:enable
		buffer.writeUInt8(payload.tilt_alarm_settings.enable);
		// 0:disable, 1:condition: x<A, 2:condition: x>B, 3:condition: A<x<B, 4:condition: x<A or x>B
		buffer.writeUInt8(payload.tilt_alarm_settings.threshold_condition);
		buffer.writeUInt8(payload.tilt_alarm_settings.threshold_max);
		buffer.writeUInt8(payload.tilt_alarm_settings.duration);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x80
	if ('falling_alarm_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x80);
		// 0: disable, 1:enable
		buffer.writeUInt8(payload.falling_alarm_settings.enable);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x81
	if ('falling_threshold_alarm_settings' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x81);
		// 0: FREE_FALL_LEVEL_156, 1: FREE_FALL_LEVEL_219, 2: FREE_FALL_LEVEL_250, 3: FREE_FALL_LEVEL_312, 4: FREE_FALL_LEVEL_344, 5: FREE_FALL_LEVEL_406, 6: FREE_FALL_LEVEL_469, 7: FREE_FALL_LEVEL_500
		buffer.writeUInt8(payload.falling_threshold_alarm_settings.threshold_level);
		buffer.writeUInt8(payload.falling_threshold_alarm_settings.time_level);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x82
	if ('probe_id_retransmit_count' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x82);
		buffer.writeUInt8(payload.probe_id_retransmit_count);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xBF
	if ('reset' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xbf);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xBE
	if ('reboot' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xbe);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xBD
	if ('clear_historical_data' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xbd);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xBC
	if ('stop_historical_data_retrieval' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xbc);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xBA
	if ('retrieve_historical_data_by_time' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xba);
		buffer.writeUInt32LE(payload.retrieve_historical_data_by_time.time);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xBB
	if ('retrieve_historical_data_by_time_range' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xbb);
		buffer.writeUInt32LE(payload.retrieve_historical_data_by_time_range.start_time);
		buffer.writeUInt32LE(payload.retrieve_historical_data_by_time_range.end_time);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xB9
	if ('query_device_status' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb9);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xB8
	if ('synchronize_time' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb8);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xB7
	if ('set_time' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0xb7);
		buffer.writeUInt32LE(payload.set_time.timestamp);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x50
	if ('clear_alarm_item' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x50);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x51
	if ('set_zero_calibration' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x51);
		// 0:Clear zero calibration, 1:Start zero calibration
		buffer.writeUInt8(payload.set_zero_calibration.operation_item);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x52
	if ('set_retrieval_initial_surface' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x52);
		// 0:Reset the zero reference point to the horizontal plane, 1:Set the current plane as the new zero reference point
		buffer.writeUInt8(payload.set_retrieval_initial_surface.operation_item);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0x53
	if ('get_sensor_id' in payload) {
		var buffer = new Buffer();
		buffer.writeUInt8(0x53);
		encoded = encoded.concat(buffer.toBytes());
	}
	//0xCE
	if ('cellular_settings' in payload) {
		var buffer = new Buffer();
		if (isValid(payload.cellular_settings.work_mode)) {
			buffer.writeUInt8(0xce);
			// 0: Low Power Mode, 3: Low Latency Mode
			buffer.writeUInt8(0x3f);
			// 0: Low Power Mode, 3: Low Latency Mode
			buffer.writeUInt8(payload.cellular_settings.work_mode);
		}
		if (isValid(payload.cellular_settings.transport_type)) {
			buffer.writeUInt8(0xce);
			// 1:UDP, 2:TCP, 3:AWS, 4:MQTT, 6:Developer-MQTT, 7:Developer-DTLS
			buffer.writeUInt8(0x42);
			// 1:UDP, 2:TCP, 3:AWS, 4:MQTT, 6:Developer-MQTT, 7:Developer-DTLS
			buffer.writeUInt8(payload.cellular_settings.transport_type);
		}
		if (isValid(payload.cellular_settings.network)) {
			if (isValid(payload.cellular_settings.network.apn)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x41);
				buffer.writeUInt8(0x00);
				buffer.writeString(payload.cellular_settings.network.apn, 31);
			}
			if (isValid(payload.cellular_settings.network.auth_mode)) {
				buffer.writeUInt8(0xce);
				// 0：None, 1：PAP, 3：CHAP
				buffer.writeUInt8(0x41);
				// 0：None, 1：PAP, 3：CHAP
				buffer.writeUInt8(0x01);
				// 0：None, 1：PAP, 3：CHAP
				buffer.writeUInt8(payload.cellular_settings.network.auth_mode);
			}
			if (isValid(payload.cellular_settings.network.auth_username)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x41);
				buffer.writeUInt8(0x02);
				buffer.writeString(payload.cellular_settings.network.auth_username, 63);
			}
			if (isValid(payload.cellular_settings.network.password)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x41);
				buffer.writeUInt8(0x03);
				buffer.writeString(payload.cellular_settings.network.password, 63);
			}
			if (isValid(payload.cellular_settings.network.pin)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x41);
				buffer.writeUInt8(0x04);
				buffer.writeString(payload.cellular_settings.network.pin, 8);
			}
			if (isValid(payload.cellular_settings.network.type)) {
				buffer.writeUInt8(0xce);
				// 0：Auto, 1：Cat-N, 3：NB-IOT
				buffer.writeUInt8(0x41);
				// 0：Auto, 1：Cat-N, 3：NB-IOT
				buffer.writeUInt8(0x05);
				// 0：Auto, 1：Cat-N, 3：NB-IOT
				buffer.writeUInt8(payload.cellular_settings.network.type);
			}
		}
		if (isValid(payload.cellular_settings.mqtt_settings)) {
			if (isValid(payload.cellular_settings.mqtt_settings.server_address)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x00);
				buffer.writeUInt8(0x00);
				buffer.writeString(payload.cellular_settings.mqtt_settings.server_address, 127);
			}
			if (isValid(payload.cellular_settings.mqtt_settings.server_port)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x00);
				buffer.writeUInt8(0x01);
				buffer.writeUInt16LE(payload.cellular_settings.mqtt_settings.server_port);
			}
			if (isValid(payload.cellular_settings.mqtt_settings.keepalive_interval)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x00);
				buffer.writeUInt8(0x02);
				buffer.writeUInt16LE(payload.cellular_settings.mqtt_settings.keepalive_interval);
			}
			if (isValid(payload.cellular_settings.mqtt_settings.client_id)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x00);
				buffer.writeUInt8(0x03);
				buffer.writeString(payload.cellular_settings.mqtt_settings.client_id, 63);
			}
			if (isValid(payload.cellular_settings.mqtt_settings.auth_enable)) {
				buffer.writeUInt8(0xce);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x00);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x04);
				// 0：disable, 1：enable
				buffer.writeUInt8(payload.cellular_settings.mqtt_settings.auth_enable);
			}
			if (isValid(payload.cellular_settings.mqtt_settings.auth_username)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x00);
				buffer.writeUInt8(0x05);
				buffer.writeString(payload.cellular_settings.mqtt_settings.auth_username, 127);
			}
			if (isValid(payload.cellular_settings.mqtt_settings.auth_password)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x00);
				buffer.writeUInt8(0x06);
				buffer.writeString(payload.cellular_settings.mqtt_settings.auth_password, 127);
			}
			if (isValid(payload.cellular_settings.mqtt_settings.enable_tls)) {
				buffer.writeUInt8(0xce);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x00);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x07);
				// 0：disable, 1：enable
				buffer.writeUInt8(payload.cellular_settings.mqtt_settings.enable_tls);
			}
			if (isValid(payload.cellular_settings.mqtt_settings.enable_ca_certificate)) {
				buffer.writeUInt8(0xce);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x00);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x08);
				// 0：disable, 1：enable
				buffer.writeUInt8(payload.cellular_settings.mqtt_settings.enable_ca_certificate);
			}
			if (isValid(payload.cellular_settings.mqtt_settings.ca_certificate_length)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x00);
				buffer.writeUInt8(0x09);
				buffer.writeUInt16LE(payload.cellular_settings.mqtt_settings.ca_certificate_length);
			}
			if (isValid(payload.cellular_settings.mqtt_settings.ca_certificate)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x00);
				buffer.writeUInt8(0x0a);
				buffer.writeString(payload.cellular_settings.mqtt_settings.ca_certificate, 160);
			}
			if (isValid(payload.cellular_settings.mqtt_settings.enable_client_certificate)) {
				buffer.writeUInt8(0xce);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x00);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x0b);
				// 0：disable, 1：enable
				buffer.writeUInt8(payload.cellular_settings.mqtt_settings.enable_client_certificate);
			}
			if (isValid(payload.cellular_settings.mqtt_settings.client_certificate_length)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x00);
				buffer.writeUInt8(0x0c);
				buffer.writeUInt16LE(payload.cellular_settings.mqtt_settings.client_certificate_length);
			}
			if (isValid(payload.cellular_settings.mqtt_settings.client_certificate)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x00);
				buffer.writeUInt8(0x0d);
				buffer.writeString(payload.cellular_settings.mqtt_settings.client_certificate, 160);
			}
			if (isValid(payload.cellular_settings.mqtt_settings.enable_key_certificate)) {
				buffer.writeUInt8(0xce);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x00);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x0e);
				// 0：disable, 1：enable
				buffer.writeUInt8(payload.cellular_settings.mqtt_settings.enable_key_certificate);
			}
			if (isValid(payload.cellular_settings.mqtt_settings.key_certificate_length)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x00);
				buffer.writeUInt8(0x0f);
				buffer.writeUInt16LE(payload.cellular_settings.mqtt_settings.key_certificate_length);
			}
			if (isValid(payload.cellular_settings.mqtt_settings.key_certificate)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x00);
				buffer.writeUInt8(0x10);
				buffer.writeString(payload.cellular_settings.mqtt_settings.key_certificate, 160);
			}
			if (isValid(payload.cellular_settings.mqtt_settings.uplink_topic)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x00);
				buffer.writeUInt8(0x11);
				buffer.writeString(payload.cellular_settings.mqtt_settings.uplink_topic, 127);
			}
			if (isValid(payload.cellular_settings.mqtt_settings.uplink_qos)) {
				buffer.writeUInt8(0xce);
				// 0：QoS0, 1：QoS1, 2：QoS2
				buffer.writeUInt8(0x00);
				// 0：QoS0, 1：QoS1, 2：QoS2
				buffer.writeUInt8(0x12);
				// 0：QoS0, 1：QoS1, 2：QoS2
				buffer.writeUInt8(payload.cellular_settings.mqtt_settings.uplink_qos);
			}
			if (isValid(payload.cellular_settings.mqtt_settings.downlink_topic)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x00);
				buffer.writeUInt8(0x13);
				buffer.writeString(payload.cellular_settings.mqtt_settings.downlink_topic, 127);
			}
			if (isValid(payload.cellular_settings.mqtt_settings.downlink_qos)) {
				buffer.writeUInt8(0xce);
				// 0：QoS0, 1：QoS1, 2：QoS2
				buffer.writeUInt8(0x00);
				// 0：QoS0, 1：QoS1, 2：QoS2
				buffer.writeUInt8(0x14);
				// 0：QoS0, 1：QoS1, 2：QoS2
				buffer.writeUInt8(payload.cellular_settings.mqtt_settings.downlink_qos);
			}
			if (isValid(payload.cellular_settings.mqtt_settings.mqtt_status)) {
				buffer.writeUInt8(0xce);
				// 0：Connect Failed, 1：Connect Success
				buffer.writeUInt8(0x00);
				// 0：Connect Failed, 1：Connect Success
				buffer.writeUInt8(0x21);
				// 0：Connect Failed, 1：Connect Success
				buffer.writeUInt8(payload.cellular_settings.mqtt_settings.mqtt_status);
			}
		}
		if (isValid(payload.cellular_settings.aws_settings)) {
			if (isValid(payload.cellular_settings.aws_settings.server_address)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x02);
				buffer.writeUInt8(0x00);
				buffer.writeString(payload.cellular_settings.aws_settings.server_address, 127);
			}
			if (isValid(payload.cellular_settings.aws_settings.server_port)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x02);
				buffer.writeUInt8(0x01);
				buffer.writeUInt16LE(payload.cellular_settings.aws_settings.server_port);
			}
			if (isValid(payload.cellular_settings.aws_settings.keepalive_interval)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x02);
				buffer.writeUInt8(0x02);
				buffer.writeUInt16LE(payload.cellular_settings.aws_settings.keepalive_interval);
			}
			if (isValid(payload.cellular_settings.aws_settings.enable_ca_certificate)) {
				buffer.writeUInt8(0xce);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x02);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x08);
				// 0：disable, 1：enable
				buffer.writeUInt8(payload.cellular_settings.aws_settings.enable_ca_certificate);
			}
			if (isValid(payload.cellular_settings.aws_settings.ca_certificate_length)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x02);
				buffer.writeUInt8(0x09);
				buffer.writeUInt16LE(payload.cellular_settings.aws_settings.ca_certificate_length);
			}
			if (isValid(payload.cellular_settings.aws_settings.ca_certificate)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x02);
				buffer.writeUInt8(0x0a);
				buffer.writeString(payload.cellular_settings.aws_settings.ca_certificate, 160);
			}
			if (isValid(payload.cellular_settings.aws_settings.enable_client_certificate)) {
				buffer.writeUInt8(0xce);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x02);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x0b);
				// 0：disable, 1：enable
				buffer.writeUInt8(payload.cellular_settings.aws_settings.enable_client_certificate);
			}
			if (isValid(payload.cellular_settings.aws_settings.client_certificate_length)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x02);
				buffer.writeUInt8(0x0c);
				buffer.writeUInt16LE(payload.cellular_settings.aws_settings.client_certificate_length);
			}
			if (isValid(payload.cellular_settings.aws_settings.client_certificate)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x02);
				buffer.writeUInt8(0x0d);
				buffer.writeString(payload.cellular_settings.aws_settings.client_certificate, 160);
			}
			if (isValid(payload.cellular_settings.aws_settings.enable_key_certificate)) {
				buffer.writeUInt8(0xce);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x02);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x0e);
				// 0：disable, 1：enable
				buffer.writeUInt8(payload.cellular_settings.aws_settings.enable_key_certificate);
			}
			if (isValid(payload.cellular_settings.aws_settings.key_certificate_length)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x02);
				buffer.writeUInt8(0x0f);
				buffer.writeUInt16LE(payload.cellular_settings.aws_settings.key_certificate_length);
			}
			if (isValid(payload.cellular_settings.aws_settings.key_certificate)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x02);
				buffer.writeUInt8(0x10);
				buffer.writeString(payload.cellular_settings.aws_settings.key_certificate, 160);
			}
			if (isValid(payload.cellular_settings.aws_settings.aws_status)) {
				buffer.writeUInt8(0xce);
				// 0：Connect Failed, 1：Connect Success
				buffer.writeUInt8(0x02);
				// 0：Connect Failed, 1：Connect Success
				buffer.writeUInt8(0x21);
				// 0：Connect Failed, 1：Connect Success
				buffer.writeUInt8(payload.cellular_settings.aws_settings.aws_status);
			}
		}
		for (var tcp_settings_id = 0; tcp_settings_id < payload.cellular_settings.tcp_settings.length; tcp_settings_id++) {
			var tcp_settings_item = payload.cellular_settings.tcp_settings[tcp_settings_id];
			var tcp_settings_item_id = tcp_settings_item.id;
			if (isValid(tcp_settings_item.enable)) {
				buffer.writeUInt8(0xce);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x05);
				buffer.writeUInt8(tcp_settings_item_id);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x00);
				// 0：disable, 1：enable
				buffer.writeUInt8(tcp_settings_item.enable);
			}
			if (isValid(tcp_settings_item.server_address)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x05);
				buffer.writeUInt8(tcp_settings_item_id);
				buffer.writeUInt8(0x01);
				buffer.writeString(tcp_settings_item.server_address, 127);
			}
			if (isValid(tcp_settings_item.server_port)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x05);
				buffer.writeUInt8(tcp_settings_item_id);
				buffer.writeUInt8(0x02);
				buffer.writeUInt16LE(tcp_settings_item.server_port);
			}
			if (isValid(tcp_settings_item.retry_count)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x05);
				buffer.writeUInt8(tcp_settings_item_id);
				buffer.writeUInt8(0x03);
				buffer.writeUInt8(tcp_settings_item.retry_count);
			}
			if (isValid(tcp_settings_item.retry_interval)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x05);
				buffer.writeUInt8(tcp_settings_item_id);
				buffer.writeUInt8(0x04);
				buffer.writeUInt8(tcp_settings_item.retry_interval);
			}
			if (isValid(tcp_settings_item.keepalive_interval)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x05);
				buffer.writeUInt8(tcp_settings_item_id);
				buffer.writeUInt8(0x05);
				buffer.writeUInt16LE(tcp_settings_item.keepalive_interval);
			}
			if (isValid(tcp_settings_item.tcp_status)) {
				buffer.writeUInt8(0xce);
				// 0：Connect Failed, 1：Connect Success
				buffer.writeUInt8(0x05);
				buffer.writeUInt8(tcp_settings_item_id);
				// 0：Connect Failed, 1：Connect Success
				buffer.writeUInt8(0x06);
				// 0：Connect Failed, 1：Connect Success
				buffer.writeUInt8(tcp_settings_item.tcp_status);
			}
		}
		for (var udp_settings_id = 0; udp_settings_id < payload.cellular_settings.udp_settings.length; udp_settings_id++) {
			var udp_settings_item = payload.cellular_settings.udp_settings[udp_settings_id];
			var udp_settings_item_id = udp_settings_item.id;
			if (isValid(udp_settings_item.enable)) {
				buffer.writeUInt8(0xce);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x0f);
				buffer.writeUInt8(udp_settings_item_id);
				// 0：disable, 1：enable
				buffer.writeUInt8(0x00);
				// 0：disable, 1：enable
				buffer.writeUInt8(udp_settings_item.enable);
			}
			if (isValid(udp_settings_item.server_address)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x0f);
				buffer.writeUInt8(udp_settings_item_id);
				buffer.writeUInt8(0x01);
				buffer.writeString(udp_settings_item.server_address, 127);
			}
			if (isValid(udp_settings_item.server_port)) {
				buffer.writeUInt8(0xce);
				buffer.writeUInt8(0x0f);
				buffer.writeUInt8(udp_settings_item_id);
				buffer.writeUInt8(0x02);
				buffer.writeUInt16LE(udp_settings_item.server_port);
			}
			if (isValid(udp_settings_item.udp_status)) {
				buffer.writeUInt8(0xce);
				// 0：Connect Failed, 1：Connect Success
				buffer.writeUInt8(0x0f);
				buffer.writeUInt8(udp_settings_item_id);
				// 0：Connect Failed, 1：Connect Success
				buffer.writeUInt8(0x03);
				// 0：Connect Failed, 1：Connect Success
				buffer.writeUInt8(udp_settings_item.udp_status);
			}
		}
		if (isValid(payload.cellular_settings.milesight_mqtt_settings)) {
			if (isValid(payload.cellular_settings.milesight_mqtt_settings.status)) {
				buffer.writeUInt8(0xce);
				// 0：Connect Failed, 1：Connect Success
				buffer.writeUInt8(0x01);
				// 0：Connect Failed, 1：Connect Success
				buffer.writeUInt8(0x21);
				// 0：Connect Failed, 1：Connect Success
				buffer.writeUInt8(payload.cellular_settings.milesight_mqtt_settings.status);
			}
		}
		if (isValid(payload.cellular_settings.milesight_dtls_settings)) {
			if (isValid(payload.cellular_settings.milesight_dtls_settings.status)) {
				buffer.writeUInt8(0xce);
				// 0：Connect Failed, 1：Connect Success
				buffer.writeUInt8(0x19);
				// 0：Connect Failed, 1：Connect Success
				buffer.writeUInt8(0x00);
				// 0：Connect Failed, 1：Connect Success
				buffer.writeUInt8(payload.cellular_settings.milesight_dtls_settings.status);
			}
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

Buffer.prototype.writeUInt32LE = function(value) {
	this._write(value, 4, true);
};

Buffer.prototype.writeInt32LE = function(value) {
	this._write(value < 0 ? value + 0x100000000 : value, 4, true);
};

Buffer.prototype.writeBytes = function(bytes, length) {
	if (length < bytes.length) {
		throw new Error('bytes length is greater than length');
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

Buffer.prototype.writeHexString = function(hexString, length) {
	var bytes = [];
	for (var i = 0; i < hexString.length; i += 2) {
		bytes.push(parseInt(hexString.substr(i, 2), 16));
	}
	this.writeBytes(bytes, length);
};

Buffer.prototype.writeString = function(str, length) {
	var bytes = encodeUtf8(str);
	this.writeBytes(bytes, length);
};

Buffer.prototype.writeUnknownDataType = function(val) {
	throw new Error('Unknown data type encountered. Please Contact Developer.');
};

Buffer.prototype.writeHexStringReverse = function(hexString, length) {
	var bytes = [];
	for (var i = hexString.length - 2; i >= 0; i -= 2) {
		bytes.push(parseInt(hexString.substr(i, 2), 16));
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

function readHexString(bytes) {
	var temp = [];
	for (var idx = 0; idx < bytes.length; idx++) {
		temp.push(('0' + (bytes[idx] & 0xff).toString(16)).slice(-2));
	}
	return temp.join('');
}

function isValid(value) {
	return value !== undefined && value !== null && value !== '';
}
