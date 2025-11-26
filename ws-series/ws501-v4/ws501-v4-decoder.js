/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product WS501
 */
var RAW_VALUE = 0x00;

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

    for (var i = 0; i < bytes.length;) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];

        // IPSO VERSION
        if (channel_id === 0xff && channel_type === 0x01) {
            decoded.ipso_version = readProtocolVersion(bytes[i]);
            i += 1;
        }
        // HARDWARE VERSION
        else if (channel_id === 0xff && channel_type === 0x09) {
            decoded.hardware_version = readHardwareVersion(bytes.slice(i, i + 2));
            i += 2;
        }
        // FIRMWARE VERSION
        else if (channel_id === 0xff && channel_type === 0x0a) {
            decoded.firmware_version = readFirmwareVersion(bytes.slice(i, i + 2));
            i += 2;
        }
        // TSL VERSION
        else if (channel_id === 0xff && channel_type === 0xff) {
            decoded.tsl_version = readTslVersion(bytes.slice(i, i + 2));
            i += 2;
        }
        // SERIAL NUMBER
        else if (channel_id === 0xff && channel_type === 0x16) {
            decoded.sn = readSerialNumber(bytes.slice(i, i + 8));
            i += 8;
        }
        // LORAWAN CLASS TYPE
        else if (channel_id === 0xff && channel_type === 0x0f) {
            decoded.lorawan_class = readLoRaWANClass(bytes[i]);
            i += 1;
        }
        // RESET EVENT
        else if (channel_id === 0xff && channel_type === 0xfe) {
            decoded.reset_event = readResetEvent(1);
            i += 1;
        }
        // DEVICE STATUS
        else if (channel_id === 0xff && channel_type === 0x0b) {
            decoded.device_status = readDeviceStatus(1);
            i += 1;
        }
        // Voltage
        else if (channel_id === 0x03 && channel_type === 0x74) {
            decoded.voltage = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // Electric Power
        else if (channel_id === 0x04 && channel_type === 0x80) {
            decoded.electric_power = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // Power Factor
        else if (channel_id === 0x05 && channel_type === 0x81) {
            decoded.power_factor = readUInt8(bytes.slice(i, i + 1));
            i += 1;
        }
        // Power Consumption
        else if (channel_id === 0x06 && channel_type === 0x83) {
            decoded.power_consumption = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // Current Rating
        else if (channel_id === 0x07 && channel_type === 0xc9) {
            decoded.current_rating = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // Over Current Alarm
        else if (channel_id === 0x87 && channel_type === 0xc9) {
            decoded.overcurrent_alarm = {};
            decoded.overcurrent_alarm.current = readUInt16LE(bytes.slice(i, i + 2));
            decoded.overcurrent_alarm.status = readOverCurrentStatus(bytes.slice(i + 2, i + 3));
            i += 3;
        }
        // Device Abnormal Alarm
        else if (channel_id === 0x88 && channel_type === 0x29) {
            decoded.device_abnormal_alarm = {};
            decoded.device_abnormal_alarm.status = readAlarmStatus(bytes[i]);
            i += 1;
        }
        // Temperature Alarm
        else if (channel_id === 0x89 && channel_type === 0xdf) {
            decoded.temperature_alarm  = {};
            decoded.temperature_alarm.status = readTemperatureAlarmStatus(bytes[i]);
            i += 1;
        }
        // Voltage Collect Error
        else if (channel_id === 0xb3 && channel_type === 0x74) {
            decoded.voltage_collect_error = {};
            decoded.voltage_collect_error.type = readCollectStatus(bytes[i]);
            i += 1;
        }
        // Electric Power Collect Error
        else if (channel_id === 0xb4 && channel_type === 0x80) {
            decoded.electric_power_collect_error = {};
            decoded.electric_power_collect_error.type = readCollectStatus(bytes[i]);
            i += 1;
        }
        // Power Factor Collect Error
        else if (channel_id === 0xb5 && channel_type === 0x81) {
            decoded.power_factor_collect_error = {};
            decoded.power_factor_collect_error.type = readCollectStatus(bytes[i]);
            i += 1;
        }
        // Power Consumption Collect Error
        else if (channel_id === 0xb6 && channel_type === 0x83) {
            decoded.power_consumption_collect_error = {};
            decoded.power_consumption_collect_error.type = readCollectStatus(bytes[i]);
            i += 1;
        }
        // Current Collect Error
        else if (channel_id === 0xb7 && channel_type === 0xc9) {
            decoded.current_collect_error = {};
            decoded.current_collect_error.type = readCollectStatus(bytes[i]);
            i += 1;
        }
        // DOWNLINK RESPONSE
        else if (channel_id === 0xfe || channel_id === 0xff) {
            var result = handle_downlink_response(channel_type, bytes, i);
            decoded = Object.assign(decoded, result.data);
            i = result.offset;
        } else if (channel_id === 0xf8 || channel_id === 0xf9) {
            var result = handle_downlink_response_ext(channel_id, channel_type, bytes, i);
            decoded = Object.assign(decoded, result.data);
            i = result.offset;
        } else {
            break;
        }
    }

    return decoded;
}

function handle_downlink_response(channel_type, bytes, offset) {
    var decoded = {};

    switch (channel_type) {
        case 0x03:
            decoded.reporting_interval = readUInt16LE(bytes.slice(offset, offset + 2));
            offset += 2;
            break;
        case 0x10:
            decoded.reboot = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x25:
            var data = readUInt16LE(bytes.slice(offset, offset + 2));
            decoded.button_lock_config = {};
            decoded.button_lock_config.enable = readEnableStatus((data >>> 15) & 0x01);
            offset += 2;
            break;
        case 0x28:
            decoded.report_status = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x29:
            var data = readUInt8(bytes[offset]);
            var button_bit_offset = { button1: 0 };
            var switch_bit_offset = { button_status1: 0 };
            var mask = data >> 4 & 0x07;
            var object_name = mask ? "button_status_control" : "button_status";
            var offset_map = mask ? switch_bit_offset : button_bit_offset;
            decoded[object_name] = {};
            for (var key in offset_map) {
                decoded[object_name][key] = readOnOffStatus((data >>> (offset_map[key])) & 0x01);
                if (mask) {
                    decoded[object_name][key + '_change'] = readYesNoStatus((data >>> (offset_map[key] + 4)) & 0x01);
                }
            }
            offset += 1;
            break;
        case 0x2c:
            decoded.report_attribute = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x2f:
            decoded.led_mode = readLedMode(bytes[offset]);
            offset += 1;
            break;
        case 0x5e:
            decoded.button_reset_config = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x26:
            decoded.power_consumption_3w = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x27:
            decoded.power_consumption_clear = readYesNoStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x24: 
            decoded.overcurrent_alarm_config = {};
            decoded.overcurrent_alarm_config.enable = readEnableStatus(bytes[offset]);
            decoded.overcurrent_alarm_config.threshold = readUInt8(bytes.slice(offset + 1, offset + 2));
            offset += 2;
            break;
        case 0x30:
            decoded.overcurrent_protection = {};
            decoded.overcurrent_protection.enable = readEnableStatus(bytes[offset]);
            decoded.overcurrent_protection.threshold = readUInt8(bytes.slice(offset + 1, offset + 2));
            offset += 2;
            break;
        case 0x8d:
            decoded.highcurrent_config = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x67:
            decoded.power_switch_mode = readPowerSwitchMode(bytes[offset]);
            offset += 1;
            break;
        case 0x4a:
            decoded.time_synchronize = readYesNoStatus(1);
            offset += 1;
            break;
        case 0xc7:
            var d2d_enable_data = readUInt8(bytes[offset]);
            offset += 1;

            decoded.d2d_settings = {};
            decoded.d2d_settings.d2d_controller_enable = readEnableStatus((d2d_enable_data >>> 0) & 1);
            decoded.d2d_settings.d2d_controller_enable_change = readYesNoStatus((d2d_enable_data >>> 4) & 1);
            decoded.d2d_settings.d2d_agent_enable = readEnableStatus((d2d_enable_data >>> 1) & 1);
            decoded.d2d_settings.d2d_agent_enable_change = readYesNoStatus((d2d_enable_data >>> 5) & 1);
            break;
        case 0x83: 
            var d2d_agent_settings = readD2DAgentSettings(bytes.slice(offset, offset + 5));
            offset += 5;
            decoded.d2d_agent_settings_array = decoded.d2d_agent_settings_array || [];
            decoded.d2d_agent_settings_array.push(d2d_agent_settings);
            break;
        case 0xbd:
            decoded.time_zone = readTimeZone(readInt16LE(bytes.slice(offset, offset + 2)));
            offset += 2;
            break;
        default:
            throw new Error("unknown downlink response");
    }

    return { data: decoded, offset: offset };
}

function handle_downlink_response_ext(code, channel_type, bytes, offset) {
    var decoded = {};

    switch (channel_type) {
        case 0x64:
            var schedule_settings_result = readUInt8(bytes[offset + 7]);
            if (schedule_settings_result === 0) {
                var schedule_settings = readScheduleSettings(bytes.slice(offset, offset + 7));
                decoded.schedule_settings = decoded.schedule_settings || [];
                decoded.schedule_settings.push(schedule_settings);
            } else {
                decoded.schedule_settings_result = readScheduleSettingsResult(schedule_settings_result);
            }
            offset += 7;
            break;
        case 0x65:
            var data = readUInt8(bytes[offset]);
            decoded.get_schedule = {};
            if (data === 0xff) {
                decoded.get_schedule.schedule_id = 'all schedules';
            } else {
                decoded.get_schedule.schedule_id = data;
            }
            offset += 1;
            break;
        case 0x67:
            var schedule_settings = readScheduleSettings(bytes.slice(offset, offset + 7), true);
            decoded.schedule_report = decoded.schedule_report || [];
            decoded.schedule_report.push(schedule_settings);
            offset += 7;
            break;
        case 0xab:
            decoded.power_consumption_2w = {};
            decoded.power_consumption_2w.enable = readEnableStatus(bytes[offset]);
            offset += 1;
            var power_bit_offset = [ "button_power1" ];
            for(var i= 0; i < power_bit_offset.length; i++) {
                decoded.power_consumption_2w[power_bit_offset[i]] = readUInt16LE(bytes.slice(offset + i * 2, offset + (i + 1) * 2));
            }
            offset += 6;
            break;
        case 0xb8:
            decoded.d2d_controller_settings_array = decoded.d2d_controller_settings_array || [];
            var d2d_controller_settings = readD2DControllerSettings(bytes.slice(offset, offset + 5));
            decoded.d2d_controller_settings_array.push(d2d_controller_settings);
            offset += 5;
            break;
        case 0x72:
            decoded.daylight_saving_time = readDstConfig(bytes.slice(offset, offset + 9));
            offset += 9;
            break;
        default:
            throw new Error("unknown downlink response");
    }

    if (hasResultFlag(code)) {
        var result_value = readUInt8(bytes[offset]);
        offset += 1;

        if (result_value !== 0) {
            var request = decoded;
            decoded = {};
            decoded.device_response_result = {};
            decoded.device_response_result.channel_type = channel_type;
            decoded.device_response_result.result = readResultStatus(result_value);
            decoded.device_response_result.request = request;
        }
    }

    return { data: decoded, offset: offset };
}

function readDstConfig(bytes) {
    var offset = 0;

    var data = bytes[offset];
    var enable_value = (data >> 7) & 0x01;
    var offset_value = data & 0x7f;

    var daylight_saving_time = {};
    daylight_saving_time.enable = readEnableStatus(enable_value);
    daylight_saving_time.dst_bias = offset_value;

    daylight_saving_time.start_month = readMonth(bytes[offset + 1]);
    var start_week_value = readUInt8(bytes[offset + 2]);
    daylight_saving_time.start_week_num = readWeek(start_week_value >> 4);
    daylight_saving_time.start_week_day = readWeekDay(start_week_value & 0x0f);
    daylight_saving_time.start_hour_min = readHourMin(readUInt16LE(bytes.slice(offset + 3, offset + 5)));

    daylight_saving_time.end_month = readMonth(bytes[offset + 5]);
    var end_week_value = readUInt8(bytes[offset + 6]);
    daylight_saving_time.end_week_num = readWeek(end_week_value >> 4);
    daylight_saving_time.end_week_day = readWeekDay(end_week_value & 0x0f);
    daylight_saving_time.end_hour_min = readHourMin(readUInt16LE(bytes.slice(offset + 7, offset + 9)));
    
    offset += 9;

    return daylight_saving_time;
}

function hasResultFlag(code) {
    return code === 0xf8;
}

function readProtocolVersion(bytes) {
    var major = (bytes & 0xf0) >> 4;
    var minor = bytes & 0x0f;
    return "v" + major + "." + minor;
}

function readResultStatus(status) {
    var status_map = { 
        0: "success", 
        1: "forbidden", 
        2: "out of range", 
        16: "continue is 0", 
        17: "The continue is greater than the maximum value allowed by the device",
        18: "Command expires (start time + continue <= current time)"
     };
    return getValue(status_map, status);
}

function readHardwareVersion(bytes) {
    var major = (bytes[0] & 0xff).toString(16);
    var minor = (bytes[1] & 0xff) >> 4;
    return "v" + major + "." + minor;
}

function readFirmwareVersion(bytes) {
    var major = (bytes[0] & 0xff).toString(16);
    var minor = (bytes[1] & 0xff).toString(16);
    return "v" + major + "." + minor;
}

function readTslVersion(bytes) {
    var major = bytes[0] & 0xff;
    var minor = bytes[1] & 0xff;
    return "v" + major + "." + minor;
}

function readSerialNumber(bytes) {
    var temp = [];
    for (var idx = 0; idx < bytes.length; idx++) {
        temp.push(("0" + (bytes[idx] & 0xff).toString(16)).slice(-2));
    }
    return temp.join("");
}

function readLoRaWANClass(type) {
    var class_map = {
        2: "Class C",
    };
    return getValue(class_map, type);
}

function readResetEvent(status) {
    var status_map = { 0: "normal", 1: "reset" };
    return getValue(status_map, status);
}

function readDeviceStatus(status) {
    var status_map = { 0: "off", 1: "on" };
    return getValue(status_map, status);
}

function readOnOffStatus(status) {
    var status_map = { 0: "off", 1: "on" };
    return getValue(status_map, status);
}

function readYesNoStatus(status) {
    var status_map = { 0: "no", 1: "yes" };
    return getValue(status_map, status);
}

function readLedMode(type) {
    var led_mode_map = { 0: "disable", 1: "Enable (relay closed indicator off)" };
    return getValue(led_mode_map, type);
}

function readTemperatureAlarmStatus(status) {
    var status_map = { 1: "overtemperature" };
    return getValue(status_map, status);
}

function readAlarmStatus(status) {
    var status_map = { 1: "abnormal" };
    return getValue(status_map, status);
}

function readOverCurrentStatus(status) {
    var status_map = { 1: "overcurrent" };
    return getValue(status_map, status);
}

function readScheduleSettings(bytes, isReport) {
    var offset = 0;

    var schedule_settings = {};
    schedule_settings.schedule_id = readUInt8(bytes[offset]);
    schedule_settings.enable = readEnableStatus2(bytes[offset + 1] & 0x03);
    schedule_settings.use_config = readYesNoStatus(bytes[offset + 1] >> 4 & 0x01);
    // condition
    var day_bit_offset = { monday: 0, tuesday: 1, wednesday: 2, thursday: 3, friday: 4, saturday: 5, sunday: 6 };
    if(isReport) {
        day_bit_offset = { execution_day_mon: 0, execution_day_tues: 1, execution_day_wed: 2, execution_day_thu: 3, execution_day_fri: 4, execution_day_sat: 5, execution_day_sun: 6 };
    }
    var day = readUInt8(bytes[offset + 2]);
    for (var key in day_bit_offset) {
        schedule_settings[key] = readEnableStatus((day >> day_bit_offset[key]) & 0x01);
    }
    schedule_settings.execut_hour = readUInt8(bytes[offset + 3]);
    schedule_settings.execut_min = readUInt8(bytes[offset + 4]);

    // action
    var switch_bit_offset = { button_status1: 0 };
    var switch_raw_data = readUInt8(bytes[offset + 5]);
    for (var key in switch_bit_offset) {
        schedule_settings[key] = readSwitchStatus((switch_raw_data >> switch_bit_offset[key]) & 0x03);
    }
    schedule_settings.lock_status = readChildLockStatus(bytes[offset + 6]);

    return schedule_settings;
}

function readCollectStatus(status) {
    var status_map = { 1: "collection error" };
    return getValue(status_map, status);
}

function readScheduleSettingsResult(result) {
    var schedule_settings_result_map = {
        0: "success",
        2: "failed, out of range",
        17: "success, conflict with channel=1",
        18: "success, conflict with channel=2",
        19: "success, conflict with channel=3",
        20: "success, conflict with channel=4",
        21: "success, conflict with channel=5",
        22: "success, conflict with channel=6",
        23: "success, conflict with channel=7",
        24: "success, conflict with channel=8",
        25: "success, conflict with channel=9",
        26: "success, conflict with channel=10",
        27: "success, conflict with channel=11",
        28: "success, conflict with channel=12",
        29: "success, conflict with channel=13",
        30: "success, conflict with channel=14",
        31: "success, conflict with channel=15",
        32: "success, conflict with channel=16",
        49: "failed, conflict with channel=1",
        50: "failed, conflict with channel=2",
        51: "failed, conflict with channel=3",
        52: "failed, conflict with channel=4",
        53: "failed, conflict with channel=5",
        54: "failed, conflict with channel=6",
        55: "failed, conflict with channel=7",
        56: "failed, conflict with channel=8",
        57: "failed, conflict with channel=9",
        58: "failed, conflict with channel=10",
        59: "failed, conflict with channel=11",
        60: "failed, conflict with channel=12",
        61: "failed, conflict with channel=13",
        62: "failed, conflict with channel=14",
        63: "failed, conflict with channel=15",
        64: "failed, conflict with channel=16",
        81: "failed,rule config empty",
    };
    return getValue(schedule_settings_result_map, result);
}

function readD2DCommand(bytes) {
    return ("0" + (bytes[1] & 0xff).toString(16)).slice(-2) + ("0" + (bytes[0] & 0xff).toString(16)).slice(-2);
}

function readSwitchObject(switchs) {
    var switch_object_map = {
        1: "button1"
    };
    return getValue(switch_object_map, switchs);
}

function readActionSwitchStatus(status) {
    var switch_status_map = {
        0: "off",
        1: "on",
        2: "reversel"
    };
    return getValue(switch_status_map, status);
}

function readD2DAgentSettings(bytes) {
    var offset = 0;

    var d2d_agent_settings = {};
    d2d_agent_settings.number = readUInt8(bytes[offset]);
    d2d_agent_settings.enable = readEnableStatus(bytes[offset + 1] & 0x01);
    d2d_agent_settings.control_command = readD2DCommand(bytes.slice(offset + 2, offset + 4));

    d2d_agent_settings.action_status = {};
    var switchs = bytes[offset + 4] >> 4;
    var status = bytes[offset + 4] & 0x0f;
    d2d_agent_settings.action_status.button = readSwitchObject(switchs);
    d2d_agent_settings.action_status.button_status = readActionSwitchStatus(status);

    return d2d_agent_settings;
}

function readD2DControllerSettings(bytes) {
    var offset = 0;

    var d2d_controller_settings = {};
    d2d_controller_settings.button_id = readButtonId(bytes[offset]);
    d2d_controller_settings.contrl_enable = readEnableStatus(bytes[offset + 1]);
    d2d_controller_settings.uplink = {};
    d2d_controller_settings.uplink.lora_enable = readEnableStatus(bytes[offset + 2] & 0x01);
    d2d_controller_settings.uplink.button_enable = readEnableStatus(bytes[offset + 2] >> 1 & 0x01);
    d2d_controller_settings.contrl_cmd = readD2DCommand(bytes.slice(offset + 3, offset + 5));

    return d2d_controller_settings;
}

function readSwitchStatus(status) {
    var switch_status_map = { 0: "keep", 1: "on", 2: "off", 3: "reversal" };
    return getValue(switch_status_map, status);
}

function readChildLockStatus(status) {
    var child_lock_status_map = { 0: "keep", 1: "lock", 2: "unlock" };
    return getValue(child_lock_status_map, status);
}

function readTimeZone(time_zone) {
    var timezone_map = { "-720": "UTC-12", "-660": "UTC-11", "-600": "UTC-10", "-570": "UTC-9:30", "-540": "UTC-9", "-480": "UTC-8", "-420": "UTC-7", "-360": "UTC-6", "-300": "UTC-5", "-240": "UTC-4", "-210": "UTC-3:30", "-180": "UTC-3", "-120": "UTC-2", "-60": "UTC-1", 0: "UTC", 60: "UTC+1", 120: "UTC+2", 180: "UTC+3", 210: "UTC+3:30", 240: "UTC+4", 270: "UTC+4:30", 300: "UTC+5", 330: "UTC+5:30", 345: "UTC+5:45", 360: "UTC+6", 390: "UTC+6:30", 420: "UTC+7", 480: "UTC+8", 540: "UTC+9", 570: "UTC+9:30", 600: "UTC+10", 630: "UTC+10:30", 660: "UTC+11", 720: "UTC+12", 765: "UTC+12:45", 780: "UTC+13", 840: "UTC+14" };
    return getValue(timezone_map, time_zone);
}

function readEnableStatus(status) {
    var status_map = { 0: "disable", 1: "enable" };
    return getValue(status_map, status);
}

function readEnableStatus2(status) {
    var status_map = { 0: "not config", 1: "enable", 2: "disable" };
    return getValue(status_map, status);
}

function readPowerSwitchMode(mode) {
    var mode_map = { 0: "off", 1: "on", 2: "keep" };
    return getValue(mode_map, mode);
}

function readEnableMask(mask) {
    var mask_map = { 0: "keep", 1: "set" };
    return getValue(mask_map, mask);
}

function readMonth(month) {
    var month_map = {
        1:"Jan.",
        2:"Feb.",
        3: "Mar.",
        4: "Apr.",
        5: "May.",
        6: "Jun.",
        7: "Jul.",
        8: "Aug.",
        9: "Sep.",
        10: "Oct.",
        11: "Nov.",
        12: "Dec.",
    };
    return getValue(month_map, month);
}

function readWeek(week) {
    var weeks_map = {
        1: "1st",
        2: "2nd",
        3: "3rd",
        4: "4th",
        5: "last"
    };
    return getValue(weeks_map, week);
}

function readWeekDay(day) {
    var week_map = {
        1: "Mon.",
        2: "Tues.",
        3: "Wed.",
        4: "Thurs.",
        5: "Fri.",
        6: "Sat.",
        7: "Sun."
    };
    return getValue(week_map, day);
}

function readHourMin(hour_min) {
    var hour_min_map = {
        0: "00:00",
        60: "01:00",
        120: "02:00",
        180: "03:00",
        240: "04:00",
        300: "05:00",
        360: "06:00",
        420: "07:00",
        480: "08:00",
        540: "09:00",
        600: "10:00",
        660: "11:00",
        720: "12:00",
        780: "13:00",
        840: "14:00",
        900: "15:00",
        960: "16:00",
        1020: "17:00",
        1080: "18:00",
        1140: "19:00",
        1200: "20:00",
        1260: "21:00",
        1320: "22:00",
        1380: "23:00"
    };
    return getValue(hour_min_map, hour_min);
}

function readButtonId(button_id) {
    var button_id_map = { 0: "button1" };
    return getValue(button_id_map, button_id);
}

/* eslint-disable */
function readUInt8(bytes) {
    return bytes & 0xff;
}

function readInt8(bytes) {
    var ref = readUInt8(bytes);
    return ref > 0x7f ? ref - 0x100 : ref;
}

function readUInt16LE(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return value & 0xffff;
}

function readInt16LE(bytes) {
    var ref = readUInt16LE(bytes);
    return ref > 0x7fff ? ref - 0x10000 : ref;
}

function readUInt32LE(bytes) {
    var value = (bytes[3] << 24) + (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
    return (value & 0xffffffff) >>> 0;
}

function readInt32LE(bytes) {
    var ref = readUInt32LE(bytes);
    return ref > 0x7fffffff ? ref - 0x100000000 : ref;
}

function getValue(map, key) {
    if (RAW_VALUE) return key;

    var value = map[key];
    if (!value) value = "unknown";
    return value;
}

//if (!Object.assign) {
    Object.defineProperty(Object, "assign", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (target) {
            "use strict";
            if (target == null) {
                throw new TypeError("Cannot convert first argument to object");
            }

            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource == null) {
                    continue;
                }
                nextSource = Object(nextSource);

                var keysArray = Object.keys(Object(nextSource));
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        // concat array
                        if (Array.isArray(to[nextKey]) && Array.isArray(nextSource[nextKey])) {
                            to[nextKey] = to[nextKey].concat(nextSource[nextKey]);
                        } else {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
    });
//}
