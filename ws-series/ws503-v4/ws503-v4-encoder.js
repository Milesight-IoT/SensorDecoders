/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product WS503
 */
var RAW_VALUE = 0x00;

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

    if ("reboot" in payload) {
        encoded = encoded.concat(reboot(payload.reboot));
    }
    if ("reporting_interval" in payload) {
        encoded = encoded.concat(setReportingInterval(payload.reporting_interval));
    }
    if ("report_status" in payload) {
        encoded = encoded.concat(reportStatus(payload.report_status));
    }
    if ("report_attribute" in payload) {
        encoded = encoded.concat(reportAttribute(payload.report_attribute));
    }
    if ("led_mode" in payload) {
        encoded = encoded.concat(setLedMode(payload.led_mode));
    }
    if ("button_lock_config" in payload) {
        encoded = encoded.concat(setButtonLockConfig(payload.button_lock_config));
    }
    if("button_status_control" in payload) {
        encoded = encoded.concat(setSwitchControl(payload.button_status_control));
    }
    if("button_reset_config" in payload) {
        encoded = encoded.concat(setButtonResetConfig(payload.button_reset_config));
    }
    if("power_consumption_3w" in payload) {
        encoded = encoded.concat(setPowerConsumptionEnable(payload.power_consumption_3w));
    }
    if("power_consumption_2w" in payload) {
        encoded = encoded.concat(setPowerConsumption(payload.power_consumption_2w));
    }
    if("power_consumption_clear" in payload) {
        encoded = encoded.concat(setPowerConsumptionClear(payload.power_consumption_clear));
    }
    if("schedule_settings" in payload) {
        for (var schedule_index = 0; schedule_index < payload.schedule_settings.length; schedule_index++) {
            var schedule = payload.schedule_settings[schedule_index];
            encoded = encoded.concat(setScheduleSettings(schedule));
        }
    }
    if("get_schedule" in payload) {
        encoded = encoded.concat(setGetLocalRule(payload.get_schedule));
    }
    if("overcurrent_alarm_config" in payload) {
        encoded = encoded.concat(setOvercurrentAlarmConfig(payload.overcurrent_alarm_config));
    }
    if("overcurrent_protection" in payload) {
        encoded = encoded.concat(setOvercurrentProtection(payload.overcurrent_protection));
    }
    if("highcurrent_config" in payload) {
        encoded = encoded.concat(setHighcurrentConfig(payload.highcurrent_config));
    }
    if("power_switch_mode" in payload) {
        encoded = encoded.concat(setPowerSwitchMode(payload.power_switch_mode));
    }
    if("time_synchronize" in payload) {
        encoded = encoded.concat(setTimeSynchronize(payload.time_synchronize));
    }
    if("d2d_settings" in payload) {
        encoded = encoded.concat(setD2DGlobalEnable(payload.d2d_settings));
    }
    if("d2d_agent_settings_array" in payload) {
        for (var agent_index = 0; agent_index < payload.d2d_agent_settings_array.length; agent_index++) {
            var agent = payload.d2d_agent_settings_array[agent_index];
            encoded = encoded.concat(setD2DAgentSettings(agent));
        }
    }
    if("d2d_controller_settings_array" in payload) {
        for (var controller_index = 0; controller_index < payload.d2d_controller_settings_array.length; controller_index++) {
            var controller = payload.d2d_controller_settings_array[controller_index];
            encoded = encoded.concat(setD2DControllerSettings(controller));
        }
    }
    if("time_zone" in payload) {
        encoded = encoded.concat(setTimeZone(payload.time_zone));
    }
    if("daylight_saving_time" in payload) {
        encoded = encoded.concat(setDaylightSavingTime(payload.daylight_saving_time));
    }

    return encoded;
}

/**
 * reboot
 * @param {number} reboot values: (0: "no", 1: "yes")
 * @example { "reboot": 1 }
 */
function reboot(reboot) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(reboot) === -1) {
        throw new Error("reboot must be one of: " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, reboot) === 0) {
        return [];
    }
    return [0xff, 0x10, 0xff];
}

/**
 * report interval configuration
 * @param {number} reporting_interval uint: second, range: [60, 64800]
 * @example { "reporting_interval": 1200 }
 */
function setReportingInterval(reporting_interval) {
    if (typeof reporting_interval !== "number") {
        throw new Error("reporting_interval must be a number");
    }
    if (reporting_interval < 60 || reporting_interval > 64800) {
        throw new Error("reporting_interval must be in the range of [60, 64800]");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x03);
    buffer.writeUInt16LE(reporting_interval);
    return buffer.toBytes();
}

/**
 * report status
 * @param {number} report_status values: (0: "no", 1: "yes")
 * @example { "report_status": 1 }
 */
function reportStatus(report_status) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(report_status) === -1) {
        throw new Error("report_status must be one of: " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, report_status) === 0) {
        return [];
    }
    return [0xff, 0x28, 0xff];
}

/**
 * report attribute
 * @param {number} report_attribute values: (0: "no", 1: "yes")
 * @example { "report_attribute": 1 }
 */
function reportAttribute(report_attribute) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(report_attribute) === -1) {
        throw new Error("report_attribute must be one of: " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, report_attribute) === 0) {
        return [];
    }
    return [0xff, 0x2c, 0xff];
}

/**
 * set led mode
 * @param {number} led_mode, values: (0: "disable", 1: "Enable (relay closed indicator off)")
 * @example { "led_mode": 1 }
 */
function setLedMode(led_mode) {
    var led_mode_map = { 0: "disable", 1: "Enable (relay closed indicator off)" };
    var led_mode_values = getValues(led_mode_map);
    if (led_mode_values.indexOf(led_mode) === -1) {
        throw new Error("led_mode must be one of: " + led_mode_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x2f);
    buffer.writeUInt8(getValue(led_mode_map, led_mode));
    return buffer.toBytes();
}

/**
 * button lock configuration
 * @param {object} button_lock_config
 * @param {number} button_lock_config.enable values: (0: "disable", 1: "enable")
 * @example { "button_lock_config": { "enable": 1 } }
 */
function setButtonLockConfig(button_lock_config) {
    var enable = button_lock_config.enable;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("button_lock_config.enable must be one of: " + enable_values.join(", "));
    }

    var data = 0x00;
    data |= getValue(enable_map, enable) << 15;
    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x25);
    buffer.writeUInt16LE(data);
    return buffer.toBytes();
}

/**
 * Button Status Control
 * @param {object} button_status_control
 * @param {number} button_status_control.button_status1 values: (0: "off", 1: "on")
 * @param {number} button_status_control.button_status2 values: (0: "off", 1: "on")
 * @param {number} button_status_control.button_status3 values: (0: "off", 1: "on")
 * @param {number} button_status_control.button_status1_change values: (0: "no", 1: "yes")
 * @param {number} button_status_control.button_status2_change values: (0: "no", 1: "yes")
 * @param {number} button_status_control.button_status3_change values: (0: "no", 1: "yes")
 * @example { "button_status_control": { "button_status1": 1, "button_status2": 1, "button_status3": 1, "button_status1_change": 1, "button_status2_change": 1, "button_status3_change": 1 } }
 */
function setSwitchControl(button_status_control) {
    var status_map = {0: "off", 1: "on"};
    var status_values = getValues(status_map);
    var status_change_map = {0: "no", 1: "yes"};
    var status_change_values = getValues(status_change_map);

    var data = 0x00;
    var switch_bit_offset = { button_status1: 0, button_status2: 1, button_status3: 2 };
    for (var key in switch_bit_offset) {
        if (key in button_status_control) {
            if (status_values.indexOf(button_status_control[key]) === -1) {
                throw new Error("button_status_control." + key + " must be one of: " + status_values.join(", "));
            }

            if (status_change_values.indexOf(button_status_control[key + '_change']) === -1) {
                throw new Error("button_status_control." + key + "_change must be one of: " + status_change_values.join(", "));
            }

            data |= getValue(status_change_map, button_status_control[key + '_change']) << (switch_bit_offset[key] + 4);
            data |= getValue(status_map, button_status_control[key]) << switch_bit_offset[key];
        }
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x29);
    buffer.writeUInt8(data);
    return buffer.toBytes();
}

/**
 * button reset configuration
 * @param {number} button_reset_config values: (0: "disable", 1: "enable")
 * @example { "button_reset_config": 1 }
 */
function setButtonResetConfig(button_reset_config) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(button_reset_config) === -1) {
        throw new Error("button_reset_config must be one of: " + enable_values.join(", "));
    }

    return [0xff, 0x5e, getValue(enable_map, button_reset_config)];
}

/**
 * power consumption enable
 * @param {number} power_consumption_3w values: (0: "disable", 1: "enable")
 * @example { "power_consumption_3w": 1 }
 */
function setPowerConsumptionEnable(power_consumption_3w) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(power_consumption_3w) === -1) {
        throw new Error("power_consumption_3w must be one of: " + enable_values.join(", "));
    }

    return [0xff, 0x26, getValue(enable_map, power_consumption_3w)];
}

/**
 * Power Consumption
 * @param {object} power_consumption_2w
 * @param {number} power_consumption_2w.enable values: (0: "disable", 1: "enable")
 * @param {number} power_consumption_2w.button_power1
 * @param {number} power_consumption_2w.button_power2
 * @param {number} power_consumption_2w.button_power3
 * @example { "power_consumption_2w": {"button_power1": 0, "button_power2": 0, "button_power3": 1100 } }
 */
function setPowerConsumption(power_consumption_2w) {
    var enable = power_consumption_2w.enable;
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("power_consumption_2w.enable must be one of: " + enable_values.join(", "));
    }
    var powers = [ "button_power1", "button_power2", "button_power3" ];
    var buffer = new Buffer(8);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0xab);
    buffer.writeUInt8(getValue(enable_map, enable));
    for(var i = 0; i < powers.length; i++) {
        if (typeof power_consumption_2w[powers[i]] !== "number") {
            throw new Error("power_consumption_2w." + powers[i] + " must be a number");
        }
        if (power_consumption_2w[powers[i]] < 0 || power_consumption_2w[powers[i]] > 1100) {
            throw new Error("power_consumption_2w." + powers[i] + " must be in the range of [0, 1100]");
        }
        buffer.writeUInt16LE(power_consumption_2w[powers[i]]);
    }
    
    return buffer.toBytes();
}

/**
 * power consumption clear
 * @param {number} power_consumption_clear values: (0: "no", 1: "yes")
 * @example { "power_consumption_clear": 1 }
 */
function setPowerConsumptionClear(power_consumption_clear) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(power_consumption_clear) === -1) {
        throw new Error("power_consumption_clear must be one of: " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, power_consumption_clear) === 0) {
        return [];
    }

    return [0xff, 0x27, 0x01];
}

/**
 * set schedule settings
 * @param {object} schedule_settings
 * @param {number} schedule_settings.schedule_id range: [1, 16]
 * @param {number} schedule_settings.enable values: (0: "not config", 1: "enable", 2: "disable")
 * @param {number} schedule_settings.use_config values: (0: "no", 1: "yes")
 * @param {number} schedule_settings.monday values: (0: "disable", 1: "enable")
 * @param {number} schedule_settings.tuesday values: (0: "disable", 1: "enable")
 * @param {number} schedule_settings.wednesday values: (0: "disable", 1: "enable")
 * @param {number} schedule_settings.thursday values: (0: "disable", 1: "enable")
 * @param {number} schedule_settings.friday values: (0: "disable", 1: "enable")
 * @param {number} schedule_settings.saturday values: (0: "disable", 1: "enable")
 * @param {number} schedule_settings.sunday values: (0: "disable", 1: "enable")
 * @param {number} schedule_settings.execut_hour range: [0, 23]
 * @param {number} schedule_settings.execut_min range: [0, 59]
 * @param {number} schedule_settings.button_status1 values: (0: "keep", 1: "on", 2: "off", 3: "reversal")
 * @param {number} schedule_settings.button_status2 values: (0: "keep", 1: "on", 2: "off", 3: "reversal")
 * @param {number} schedule_settings.button_status3 values: (0: "keep", 1: "on", 2: "off", 3: "reversal")
 * @param {number} schedule_settings.lock_status values: (0: "keep", 1: "lock", 2: "unlock")
 * @example { "schedule_settings": [{ "schedule_id": 1, "enable": 1, "use_config": 1, "monday": 1, "tuesday": 0, "wednesday": 1, "thursday": 0, "friday": 1, "saturday": 0, "sunday": 1, "execut_hour": 10, "execut_min": 5, "button_status1": 1, "button_status2": 1, "button_status3": 1, "lock_status": 1 }] }
 */
function setScheduleSettings(schedule) {
    var schedule_id = schedule.schedule_id;
    var enable = schedule.enable;
    var use_config = schedule.use_config;
    var lock_status = schedule.lock_status;
    var execut_hour = schedule.execut_hour;
    var execut_min = schedule.execut_min;

    if (typeof schedule_id !== "number") {
        throw new Error("schedule_settings._item.schedule_id must be a number");
    }
    if (schedule_id < 1 || schedule_id > 16) {
        throw new Error("schedule_settings._item.schedule_id must be in range [1, 16]");
    }
    var enable_map = { 0: "not config", 1: "enable", 2: "disable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("schedule_settings._item.enable must be one of " + enable_values.join(", "));
    }
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(use_config) === -1) {
        throw new Error("schedule_settings._item.use_config must be one of " + yes_no_values.join(", "));
    }
    var week_day_bits_offset = { monday: 0, tuesday: 1, wednesday: 2, thursday: 3, friday: 4, saturday: 5, sunday: 6 };
    var days = 0x00;
    var enable_map_2 = { 0: "disable", 1: "enable" };
    var enable_values_2 = getValues(enable_map_2);
    for (var day in week_day_bits_offset) {
        if (enable_values_2.indexOf(schedule[day]) === -1) {
            throw new Error("schedule_settings._item." + day + " must be one of " + enable_values_2.join(", "));
        }
        days |= getValue(enable_map_2, schedule[day]) << week_day_bits_offset[day];
    }
    var switch_bit_offset = { button_status1: 0, button_status2: 2, button_status3: 4 };
    var switch_state_map = {0: "keep", 1: "on", 2: "off", 3: "reversal"};
    var switch_state_values = getValues(switch_state_map);
    var switchs = 0x00;
    for (var switch_state in switch_bit_offset) {
        if (switch_state_values.indexOf(schedule[switch_state]) === -1) {
            throw new Error("schedule_settings._item." + switch_state + " must be one of " + switch_state_values.join(", "));
        }
        switchs |= getValue(switch_state_map, schedule[switch_state]) << switch_bit_offset[switch_state];
    }
    var lock_status_map = {0: "keep", 1: "lock", 2: "unlock"};
    var lock_status_values = getValues(lock_status_map);
    if (lock_status_values.indexOf(lock_status) === -1) {
        throw new Error("schedule_settings._item.lock_status must be one of: " + lock_status_values.join(", "));
    }
    if(typeof execut_hour !== "number") {
        throw new Error("schedule_settings._item.execut_hour must be a number");
    }
    if(execut_hour < 0 || execut_hour > 23) {
        throw new Error("schedule_settings._item.execut_hour must be in range [0, 23]");
    }
    if(typeof execut_min !== "number") {
        throw new Error("schedule_settings._item.execut_min must be a number");
    }
    if(execut_min < 0 || execut_min > 59) {
        throw new Error("schedule_settings._item.execut_min must be in range [0, 59]");
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x64);
    buffer.writeUInt8(schedule_id);
    var schedule_option = 0x00;
    schedule_option |= getValue(enable_map, enable);
    schedule_option |= getValue(yes_no_map, use_config) << 4;
    buffer.writeUInt8(schedule_option);
    buffer.writeUInt8(days);
    buffer.writeUInt8(execut_hour);
    buffer.writeUInt8(execut_min);
    buffer.writeUInt8(switchs);
    buffer.writeUInt8(getValue(lock_status_map, lock_status));
    return buffer.toBytes();
}

/**
 * get local rule
 * @param {object} get_schedule
 * @param {number | string} get_schedule.schedule_id range: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,"all schedules"]
 * @example { "get_schedule": {"schedule_id": 1} }
 */
function setGetLocalRule(get_schedule) {
    var schedule_id = get_schedule.schedule_id;
    var task_id_values = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,"all schedules"];

    if(task_id_values.indexOf(schedule_id) === -1) {
        throw new Error("get_schedule.schedule_id must be one of: " + task_id_values.join(", "));
    }

    var data = (schedule_id === "all schedules") ? 0xff : (schedule_id & 0xff);
    return [0xf9, 0x65, data];
}

/**
 * overcurrent alarm configuration
 * @param {object} overcurrent_alarm_config
 * @param {number} overcurrent_alarm_config.enable values: (0: "disable", 1: "enable")
 * @param {number} overcurrent_alarm_config.threshold range: [1, 10]
 * @example { "overcurrent_alarm_config": {"enable": 1, "threshold": 10} }
 */
function setOvercurrentAlarmConfig(overcurrent_alarm_config) {
    var enable = overcurrent_alarm_config.enable;
    var threshold = overcurrent_alarm_config.threshold;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("anti_flash_mode.enable must be one of " + enable_values.join(", "));
    }
    if(typeof threshold !== "number") {
        throw new Error("overcurrent_alarm_config.threshold must be a number");
    }
    if(threshold < 1 || threshold > 10) {
        throw new Error("overcurrent_alarm_config.threshold must be in range [1, 10]");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x24);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(threshold);
    return buffer.toBytes();
}

/**
 * overcurrent protection
 * @param {object} overcurrent_protection
 * @param {number} overcurrent_protection.enable values: (0: "disable", 1: "enable")
 * @param {number} overcurrent_protection.threshold range: [1, 10]
 * @example { "overcurrent_protection": {"enable": 1, "threshold": 10} }
 */
function setOvercurrentProtection(overcurrent_protection) {
    var enable = overcurrent_protection.enable;
    var threshold = overcurrent_protection.threshold;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("overcurrent_protection.enable must be one of " + enable_values.join(", "));
    }
    if(typeof threshold !== "number") {
        throw new Error("overcurrent_protection.threshold must be a number");
    }
    if(threshold < 1 || threshold > 10) {
        throw new Error("overcurrent_protection.threshold must be in range [1, 10]");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x30);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(threshold);
    return buffer.toBytes();
}

/**
 * highcurrent configuration
 * @param {number} highcurrent_config values: (0: "disable", 1: "enable")
 * @example { "highcurrent_config": 1 }
 */
function setHighcurrentConfig(highcurrent_config) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(highcurrent_config) === -1) {
        throw new Error("highcurrent_config must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x8d);
    buffer.writeUInt8(getValue(enable_map, highcurrent_config));
    return buffer.toBytes();
}

/**
 * power switch mode
 * @param {number} power_switch_mode values: (0: "off", 1: "on", 2: "keep")
 * @example { "power_switch_mode": 1 }
 */
function setPowerSwitchMode(power_switch_mode) {
    var mode_map = {0: "off", 1: "on", 2: "keep"};
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(power_switch_mode) === -1) {
        throw new Error("power_switch_mode must be one of " + mode_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x67);
    buffer.writeUInt8(getValue(mode_map, power_switch_mode));
    return buffer.toBytes();
}

/**
 * Time Synchronize
 * @param {number} time_synchronize values: (0: "no", 1: "yes")
 * @example { "time_synchronize": 0 }
 */
function setTimeSynchronize(time_synchronize) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(time_synchronize) === -1) {
        throw new Error("time_synchronize must be one of: " + yes_no_values.join(", "));
    }
    if (getValue(yes_no_map, time_synchronize) === 0) {
        return [];
    }

    return [0xff, 0x4a, 0x00];
}

/**
 * D2D Settings
 * @param {object, object} d2d_settings
 * @param {number} d2d_settings.d2d_controller_enable values: (0: "disable", 1: "enable")
 * @param {number} d2d_settings.d2d_controller_enable_change values: (0: "no", 1: "yes")
 * @param {number} d2d_settings.d2d_agent_enable values: (0: "disable", 1: "enable")
 * @param {number} d2d_settings.d2d_agent_enable_change values: (0: "no", 1: "yes")
 * @example { "d2d_settings": {"d2d_controller_enable": 0, "d2d_controller_enable_change": 0, "d2d_agent_enable": 0, "d2d_agent_enable_change": 0} }
 */
function setD2DGlobalEnable(d2d_settings) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    var d2d_controller_enable = d2d_settings.d2d_controller_enable;
    var d2d_agent_enable = d2d_settings.d2d_agent_enable;
    var d2d_controller_enable_change = d2d_settings.d2d_controller_enable_change;
    var d2d_agent_enable_change = d2d_settings.d2d_agent_enable_change;

    if (enable_values.indexOf(d2d_controller_enable) === -1) {
        throw new Error("d2d_settings.d2d_controller_enable must be one of " + enable_values.join(", "));
    }
    if (enable_values.indexOf(d2d_agent_enable) === -1) {
        throw new Error("d2d_settings.d2d_agent_enable must be one of " + enable_values.join(", "));
    }
    if (yes_no_values.indexOf(d2d_controller_enable_change) === -1) {
        throw new Error("d2d_settings.d2d_controller_enable_change must be one of " + yes_no_values.join(", "));
    }
    if (yes_no_values.indexOf(d2d_agent_enable_change) === -1) {
        throw new Error("d2d_settings.d2d_agent_enable_change must be one of " + yes_no_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xc7);
    var data = 0x00;
    data |= getValue(enable_map, d2d_controller_enable);
    data |= getValue(yes_no_map, d2d_controller_enable_change) << 4;
    data |= getValue(enable_map, d2d_agent_enable) << 1;
    data |= getValue(yes_no_map, d2d_agent_enable_change) << 5;
    
    buffer.writeUInt8(data);
    return buffer.toBytes(); 
}

/**
 * D2D Agent Settings
 * @param {object} d2d_agent_settings_array
 * @param {number} d2d_agent_settings_array.number range: [0, 15]
 * @param {number} d2d_agent_settings_array.enable values: (0: "disable", 1: "enable")
 * @param {string} d2d_agent_settings_array.control_command
 * @param {number} d2d_agent_settings_array.action_status.button values: (1: "button1", 2: "button2", 3: "button1, button2", 4: "button3", 5: "button1, button3", 6: "button2, button3", 7: "button1, button2, button3")
 * @param {number} d2d_agent_settings_array.action_status.button_status values: (0: "off", 1: "on", 2: "reversel")
 * @example { "d2d_agent_settings_array": [{"number": 0, "enable": 1, "control_command": "0000", "action_status": {"button": 1, "button_status": 1}}] }
 */
function setD2DAgentSettings(d2d_agent_settings) {
    var number = d2d_agent_settings.number;
    var enable = d2d_agent_settings.enable;
    var control_command = d2d_agent_settings.control_command;
    var buttons = d2d_agent_settings.action_status.button;
    var button_status = d2d_agent_settings.action_status.button_status;

    if (typeof number !== "number") {
        throw new Error("d2d_agent_settings_array._item.number must be a number");
    }
    if (number < 0 || number > 15) {
        throw new Error("d2d_agent_settings_array._item.number must be in range [0, 15]");
    }
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("d2d_agent_settings_array._item.enable must be one of " + enable_values.join(", "));
    }
    var button_map = {1: "button1", 2: "button2", 3: "button1, button2", 4: "button3", 5: "button1, button3", 6: "button2, button3", 7: "button1, button2, button3"};
    var button_values = getValues(button_map);
    if (button_values.indexOf(buttons) === -1) {
        throw new Error("d2d_agent_settings_array._item.action_status.button must be one of " + button_values.join(", "));
    }
    var button_status_map = {0: "off", 1: "on", 2: "reversel"};
    var button_status_values = getValues(button_status_map);
    if (button_status_values.indexOf(button_status) === -1) {
        throw new Error("d2d_agent_settings_array._item.action_status.button_status must be one of " + button_status_values.join(", "));
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x83);
    buffer.writeUInt8(number);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeD2DCommand(control_command, "0000");
    var data = 0x00;
    data |= getValue(button_status_map, button_status);
    data |= getValue(button_map, buttons) << 4;
    buffer.writeUInt8(data);
    return buffer.toBytes();
}

/**
 *  D2D Controller Settings
 * @param {object} d2d_controller_settings_array
 * @param {number} d2d_controller_settings_array.button_id values: (0: "button1", 1: "button2", 2: "button3")
 * @param {number} d2d_controller_settings_array.contrl_enable values: (0: "disable", 1: "enable")
 * @param {number} d2d_controller_settings_array.uplink.lora_enable values: (0: "disable", 1: "enable")
 * @param {number} d2d_controller_settings_array.uplink.button_enable values: (0: "disable", 1: "enable")
 * @param {string} d2d_controller_settings_array.contrl_cmd
 * @param {number} id values: (0x00, 0x01, 0x02)
 * @example { "d2d_controller_settings_array": [{"button_id": 0, "contrl_enable": 1, "uplink": { "lora_enable": 1, "button_enable": 1 }, "contrl_cmd": "0000"}] }
 */
function setD2DControllerSettings(d2d_controller_settings) {
    var button_id = d2d_controller_settings.button_id;
    var enable = d2d_controller_settings.contrl_enable;
    var lora_enable = d2d_controller_settings.uplink.lora_enable;
    var button_enable = d2d_controller_settings.uplink.button_enable;
    var contrl_cmd = d2d_controller_settings_array.contrl_cmd;

    var button_id_map = { 0: "button1", 1: "button2", 2: "button3" };
    var button_id_values = getValues(button_id_map);
    if (button_id_values.indexOf(button_id) === -1) {
        throw new Error("d2d_controller_settings_array._item.button_id must be one of " + button_id_values.join(", "));
    }
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("d2d_controller_settings_array._item.contrl_enable must be one of " + enable_values.join(", "));
    }
    if (enable_values.indexOf(lora_enable) === -1) {
        throw new Error("d2d_controller_settings_array._item.uplink.lora_enable must be one of " + enable_values.join(", "));
    }
    if (enable_values.indexOf(button_enable) === -1) {
        throw new Error("d2d_controller_settings_array._item.uplink.button_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0xb8);
    buffer.writeUInt8(getValue(button_id_map, button_id));
    buffer.writeUInt8(getValue(enable_map, enable));
    var data = 0x00;
    data |= getValue(enable_map, lora_enable);
    data |= getValue(enable_map, button_enable) << 1;
    buffer.writeUInt8(data);
    buffer.writeD2DCommand(contrl_cmd);
    return buffer.toBytes();
}

/**
 * set time zone
 * @param {number} time_zone unit: minute, convert: "hh:mm" -> "hh * 60 + mm", values: ( -720: UTC-12, -660: UTC-11, -600: UTC-10, -570: UTC-9:30, -540: UTC-9, -480: UTC-8, -420: UTC-7, -360: UTC-6, -300: UTC-5, -240: UTC-4, -210: UTC-3:30, -180: UTC-3, -120: UTC-2, -60: UTC-1, 0: UTC, 60: UTC+1, 120: UTC+2, 180: UTC+3, 240: UTC+4, 300: UTC+5, 360: UTC+6, 420: UTC+7, 480: UTC+8, 540: UTC+9, 570: UTC+9:30, 600: UTC+10, 660: UTC+11, 720: UTC+12, 765: UTC+12:45, 780: UTC+13, 840: UTC+14 )
 * @example { "time_zone": 480 }
 * @example { "time_zone": -240 }
 */
function setTimeZone(time_zone) {
    var timezone_map = { "-720": "UTC-12", "-660": "UTC-11", "-600": "UTC-10", "-570": "UTC-9:30", "-540": "UTC-9", "-480": "UTC-8", "-420": "UTC-7", "-360": "UTC-6", "-300": "UTC-5", "-240": "UTC-4", "-210": "UTC-3:30", "-180": "UTC-3", "-120": "UTC-2", "-60": "UTC-1", 0: "UTC", 60: "UTC+1", 120: "UTC+2", 180: "UTC+3", 210: "UTC+3:30", 240: "UTC+4", 270: "UTC+4:30", 300: "UTC+5", 330: "UTC+5:30", 345: "UTC+5:45", 360: "UTC+6", 390: "UTC+6:30", 420: "UTC+7", 480: "UTC+8", 540: "UTC+9", 570: "UTC+9:30", 600: "UTC+10", 630: "UTC+10:30", 660: "UTC+11", 720: "UTC+12", 765: "UTC+12:45", 780: "UTC+13", 840: "UTC+14" };
    var timezone_values = getValues(timezone_map);
    if (timezone_values.indexOf(time_zone) === -1) {
        throw new Error("time_zone must be one of " + timezone_values.join(", "));
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xbd);
    buffer.writeInt16LE(getValue(timezone_map, time_zone));
    return buffer.toBytes();
}

/**
 * set daylight saving time
 * @since v2.0
 * @param {object} daylight_saving_time
 * @param {number} daylight_saving_time.enable values: (0: disable, 1: enable)
 * @param {number} daylight_saving_time.dst_bias, unit: minute range: [1, 120]
 * @param {number} daylight_saving_time.start_month, values: (1: Jan., 2: Feb., 3: Mar., 4: Apr., 5: May, 6: Jun., 7: Jul., 8: Aug., 9: Sep., 10: Oct., 11: Nov., 12: Dec.)
 * @param {number} daylight_saving_time.start_week_num, values: (1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "last")
 * @param {number} daylight_saving_time.start_week_day, values: (1: "Mon.", 2: "Tues.", 3: "Wed.", 4: "Thurs.", 5: "Fri.", 6: "Sat.", 7: "Sun.")
 * @param {number} daylight_saving_time.start_hour_min, unit: minute, convert: "hh:mm" -> "hh * 60 + mm" values: (0: "00:00", 60: "01:00", 120: "02:00", 180: "03:00", 240: "04:00", 300: "05:00", 360: "06:00", 420: "07:00", 480: "08:00", 540: "09:00", 600: "10:00", 660: "11:00", 720: "12:00", 780: "13:00", 840: "14:00", 900: "15:00", 960: "16:00", 1020: "17:00", 1080: "18:00", 1140: "19:00", 1200: "20:00", 1260: "21:00", 1320: "22:00", 1380: "23:00")
 * @param {number} daylight_saving_time.end_month, values: (1: Jan., 2: Feb., 3: Mar., 4: Apr., 5: May, 6: Jun., 7: Jul., 8: Aug., 9: Sep., 10: Oct., 11: Nov., 12: Dec.)
 * @param {number} daylight_saving_time.end_week_num, values: (1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "last")
 * @param {number} daylight_saving_time.end_week_day, values: (1: "Mon.", 2: "Tues.", 3: "Wed.", 4: "Thurs.", 5: "Fri.", 6: "Sat.", 7: "Sun.")
 * @param {number} daylight_saving_time.end_hour_min, unit: minute, convert: "hh:mm" -> "hh * 60 + mm" values: (0: "00:00", 60: "01:00", 120: "02:00", 180: "03:00", 240: "04:00", 300: "05:00", 360: "06:00", 420: "07:00", 480: "08:00", 540: "09:00", 600: "10:00", 660: "11:00", 720: "12:00", 780: "13:00", 840: "14:00", 900: "15:00", 960: "16:00", 1020: "17:00", 1080: "18:00", 1140: "19:00", 1200: "20:00", 1260: "21:00", 1320: "22:00", 1380: "23:00")
 * @example { "daylight_saving_time": { "enable": 1, "dst_bias": 60, "start_month": 3, "start_week_num": 2, "start_week_day": 7, "start_hour_min": 120, "end_month": 1, "end_week_num": 4, "end_week_day": 1, "end_hour_min": 180 } } output: F972BC032778000141B400
 */
function setDaylightSavingTime(daylight_saving_time) {
    var enable = daylight_saving_time.enable;
    var offset = daylight_saving_time.dst_bias;
    var start_month = daylight_saving_time.start_month;
    var start_week_num = daylight_saving_time.start_week_num;
    var start_week_day = daylight_saving_time.start_week_day;
    var start_hour_min = daylight_saving_time.start_hour_min;
    var end_month = daylight_saving_time.end_month;
    var end_week_num = daylight_saving_time.end_week_num;
    var end_week_day = daylight_saving_time.end_week_day;
    var end_hour_min = daylight_saving_time.end_hour_min;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("daylight_saving_time.enable must be one of " + enable_values.join(", "));
    }
    if (typeof offset !== "number") {
        throw new Error("daylight_saving_time.dst_bias must be a number");
    }
    if (offset < 1 || offset > 120) {
        throw new Error("daylight_saving_time.dst_bias must be in range [1, 120]");
    }

    var week_num_map = { 1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "last" };
    var week_day_map = { 1: "Mon.", 2: "Tues.", 3: "Wed.", 4: "Thurs.", 5: "Fri.", 6: "Sat.", 7: "Sun." };
    var month_map = { 1: "Jan.", 2: "Feb.", 3: "Mar.", 4: "Apr.", 5: "May.", 6: "Jun.", 7: "Jul.", 8: "Aug.", 9: "Sep.", 10: "Oct.", 11: "Nov.", 12: "Dec." };
    var hour_min_map = { 0: "00:00", 60: "01:00", 120: "02:00", 180: "03:00", 240: "04:00", 300: "05:00", 360: "06:00", 420: "07:00", 480: "08:00", 540: "09:00", 600: "10:00", 660: "11:00", 720: "12:00", 780: "13:00", 840: "14:00", 900: "15:00", 960: "16:00", 1020: "17:00", 1080: "18:00", 1140: "19:00", 1200: "20:00", 1260: "21:00", 1320: "22:00", 1380: "23:00" };
    var week_num_values = getValues(week_num_map);
    var week_day_values = getValues(week_day_map);
    var month_values = getValues(month_map);
    var hour_min_values = getValues(hour_min_map);
    var enable_value = getValue(enable_map, enable);

    if (enable_value && week_num_values.indexOf(start_week_num) === -1) {
        throw new Error("daylight_saving_time.start_week_num must be one of " + week_num_values.join(", "));
    }
    if (enable_value && week_day_values.indexOf(start_week_day) === -1) {
        throw new Error("daylight_saving_time.start_week_day must be one of " + week_day_values.join(", "));
    }
    if (enable_value && week_num_values.indexOf(end_week_num) === -1) {
        throw new Error("daylight_saving_time.end_week_num must be one of " + week_num_values.join(", "));
    }
    if (enable_value && week_day_values.indexOf(end_week_day) === -1) {
        throw new Error("daylight_saving_time.end_week_day must be one of " + week_day_values.join(", "));
    }
    if (enable_value && month_values.indexOf(start_month) === -1) {
        throw new Error("daylight_saving_time.start_month must be one of " + month_values.join(", "));
    }
    if (enable_value && month_values.indexOf(end_month) === -1) {
        throw new Error("daylight_saving_time.end_month must be one of " + month_values.join(", "));
    }
    if (enable_value && hour_min_values.indexOf(start_hour_min) === -1) {
        throw new Error("daylight_saving_time.start_hour_min must be one of " + hour_min_values.join(", "));
    }
    if (enable_value && hour_min_values.indexOf(end_hour_min) === -1) {
        throw new Error("daylight_saving_time.end_hour_min must be one of " + hour_min_values.join(", "));
    }

    var data = 0x00;
    data |= enable_value << 7;
    data |= offset;

    var buffer = new Buffer(11);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x72);
    buffer.writeUInt8(data);
    buffer.writeUInt8(getValue(month_map, start_month));
    buffer.writeUInt8((getValue(week_num_map, start_week_num) << 4) | getValue(week_day_map, start_week_day));
    buffer.writeUInt16LE(getValue(hour_min_map, start_hour_min));
    buffer.writeUInt8(getValue(month_map, end_month));
    buffer.writeUInt8((getValue(week_num_map, end_week_num) << 4) | getValue(week_day_map, end_week_day));
    buffer.writeUInt16LE(getValue(hour_min_map, end_hour_min));
    return buffer.toBytes();
}

function getValues(map) {
    var values = [];
    for (var key in map) {
        values.push(RAW_VALUE ? parseInt(key) : map[key]);
    }
    return values;
}

function getValue(map, value) {
    if (RAW_VALUE) return value;

    for (var key in map) {
        if (map[key] === value) {
            return parseInt(key);
        }
    }

    throw new Error("not match in " + JSON.stringify(map));
}

function Buffer(size) {
    this.buffer = new Array(size);
    this.offset = 0;

    for (var i = 0; i < size; i++) {
        this.buffer[i] = 0;
    }
}

Buffer.prototype._write = function (value, byteLength, isLittleEndian) {
    var offset = 0;
    for (var index = 0; index < byteLength; index++) {
        offset = isLittleEndian ? index << 3 : (byteLength - 1 - index) << 3;
        this.buffer[this.offset + index] = (value >> offset) & 0xff;
    }
};

Buffer.prototype.writeUInt8 = function (value) {
    this._write(value, 1, true);
    this.offset += 1;
};

Buffer.prototype.writeInt8 = function (value) {
    this._write(value < 0 ? value + 0x100 : value, 1, true);
    this.offset += 1;
};

Buffer.prototype.writeUInt16LE = function (value) {
    this._write(value, 2, true);
    this.offset += 2;
};

Buffer.prototype.writeInt16LE = function (value) {
    this._write(value < 0 ? value + 0x10000 : value, 2, true);
    this.offset += 2;
};

Buffer.prototype.writeUInt32LE = function (value) {
    this._write(value, 4, true);
    this.offset += 4;
};

Buffer.prototype.writeInt32LE = function (value) {
    this._write(value < 0 ? value + 0x100000000 : value, 4, true);
    this.offset += 4;
};

Buffer.prototype.writeD2DCommand = function (value, defaultValue) {
    if (typeof value !== "string") {
        value = defaultValue;
    }
    if (value.length !== 4) {
        throw new Error("d2d_agent_command length must be 4");
    }
    this.buffer[this.offset] = parseInt(value.substr(2, 2), 16);
    this.buffer[this.offset + 1] = parseInt(value.substr(0, 2), 16);
    this.offset += 2;
};

Buffer.prototype.toBytes = function () {
    return this.buffer;
};
