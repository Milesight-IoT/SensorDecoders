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
    if("switch_control" in payload) {
        encoded = encoded.concat(setSwitchControl(payload.switch_control));
    }
    if("button_reset_config" in payload) {
        encoded = encoded.concat(setButtonResetConfig(payload.button_reset_config));
    }
    if("power_consumption_enable" in payload) {
        encoded = encoded.concat(setPowerConsumptionEnable(payload.power_consumption_enable));
    }
    if("load_power" in payload) {
        encoded = encoded.concat(setLoadPower(payload.load_power));
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
    if("get_local_rule" in payload) {
        encoded = encoded.concat(setGetLocalRule(payload.get_local_rule));
    }
    if("anti_flash_mode" in payload) {
        encoded = encoded.concat(setAntiFlashMode(payload.anti_flash_mode));
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
    if("lorawan_class_cfg" in payload) {
        encoded = encoded.concat(setLorawanClassCfg(payload.lorawan_class_cfg));
    }
    if("time_synchronize" in payload) {
        encoded = encoded.concat(setTimeSynchronize(payload.time_synchronize));
    }
    if("d2d_global_enable" in payload) {
        encoded = encoded.concat(setD2DGlobalEnable(payload.d2d_global_enable));
    }
    if("d2d_agent_settings_array" in payload) {
        for (var agent_index = 0; agent_index < payload.d2d_agent_settings_array.length; agent_index++) {
            var agent = payload.d2d_agent_settings_array[agent_index];
            encoded = encoded.concat(setD2DAgentSettings(agent));
        }
    }
    if("key1_d2d_controller_settings" in payload) {
        encoded = encoded.concat(setD2DControllerSettings(payload.key1_d2d_controller_settings, 0x00));
    }
    if("key2_d2d_controller_settings" in payload) {
        encoded = encoded.concat(setD2DControllerSettings(payload.key2_d2d_controller_settings, 0x01));
    }
    if("key3_d2d_controller_settings" in payload) {
        encoded = encoded.concat(setD2DControllerSettings(payload.key3_d2d_controller_settings, 0x02));
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
 * switch control
 * @param {object} switch_control
 * @param {number} switch_control.status_1 values: (0: "off", 1: "on")
 * @param {number} switch_control.status_2 values: (0: "off", 1: "on")
 * @param {number} switch_control.status_3 values: (0: "off", 1: "on")
 * @example { "switch_control": { "status_1": 1, "status_2": 1, "status_3": 1 } }
 */
function setSwitchControl(switch_control) {
    var status_map = {0: "off", 1: "on"};
    var status_values = getValues(status_map);

    var data = 0x00;
    var switch_bit_offset = { status_1: 0, status_2: 1, status_3: 2 };
    for (var key in switch_bit_offset) {
        if (key in switch_control) {
            if (status_values.indexOf(switch_control[key]) === -1) {
                throw new Error("switch_control." + key + " must be one of: " + status_values.join(", "));
            }

            data |= 1 << (switch_bit_offset[key] + 4);
            data |= getValue(status_map, switch_control[key]) << switch_bit_offset[key];
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
 * @param {number} power_consumption_enable values: (0: "disable", 1: "enable")
 * @example { "power_consumption_enable": 1 }
 */
function setPowerConsumptionEnable(power_consumption_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(power_consumption_enable) === -1) {
        throw new Error("power_consumption_enable must be one of: " + enable_values.join(", "));
    }

    return [0xff, 0x26, getValue(enable_map, power_consumption_enable)];
}

/**
 * load power
 * @param {object} load_power
 * @param {number} load_power.power_1
 * @param {number} load_power.power_2
 * @param {number} load_power.power_3
 * @example { "load_power": {"power_1": 0, "power_2": 0, "power_3": 1100 } }
 */
function setLoadPower(load_power) {
    var powers = [ "power_1", "power_2", "power_3" ];
    var buffer = new Buffer(8);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0xab);
    for(var i = 0; i < powers.length; i++) {
        if (typeof load_power[powers[i]] !== "number") {
            throw new Error("load_power." + powers[i] + " must be a number");
        }
        if (load_power[powers[i]] < 0 || load_power[powers[i]] > 1100) {
            throw new Error("load_power." + powers[i] + " must be in the range of [0, 1100]");
        }
        buffer.writeUInt16LE(load_power[powers[i]]);
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
 * @param {number} schedule_settings.channel range: [1, 16]
 * @param {number} schedule_settings.enable values: (1: "enable", 2: "disable")
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
 * @param {number} schedule_settings.switch_1_state values: (0: "keep", 1: "on", 2: "off", 3: "reversal")
 * @param {number} schedule_settings.switch_2_state values: (0: "keep", 1: "on", 2: "off", 3: "reversal")
 * @param {number} schedule_settings.switch_3_state values: (0: "keep", 1: "on", 2: "off", 3: "reversal")
 * @param {number} schedule_settings.lock_state values: (0: "keep", 1: "lock", 2: "unlock")
 * @example { "schedule_settings": [{ "channel": 1, "enable": 1, "use_config": 1, "monday": 1, "tuesday": 0, "wednesday": 1, "thursday": 0, "friday": 1, "saturday": 0, "sunday": 1, "execut_hour": 10, "execut_min": 5, "switch_1_state": 1, "switch_2_state": 1, "switch_3_state": 1, "lock_state": 1 }] }
 */
function setScheduleSettings(schedule) {
    var channel = schedule.channel;
    var enable = schedule.enable;
    var use_config = schedule.use_config;
    var lock_state = schedule.lock_state;
    var execut_hour = schedule.execut_hour;
    var execut_min = schedule.execut_min;

    if (typeof channel !== "number") {
        throw new Error("schedule_settings._item.channel must be a number");
    }
    if (channel < 1 || channel > 16) {
        throw new Error("schedule_settings._item.channel must be in range [1, 16]");
    }
    var enable_map = { 1: "enable", 2: "disable" };
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
    var switch_bits_offset = { switch_1_state: 0, switch_2_state: 2, switch_3_state: 4 };
    var switch_state_map = {0: "keep", 1: "on", 2: "off", 3: "reversal"};
    var switch_state_values = getValues(switch_state_map);
    var switchs = 0x00;
    for (var switch_state in switch_bits_offset) {
        if (switch_state_values.indexOf(schedule[switch_state]) === -1) {
            throw new Error("schedule_settings._item." + switch_state + " must be one of " + switch_state_values.join(", "));
        }
        switchs |= getValue(switch_state_map, schedule[switch_state]) << switch_bits_offset[switch_state];
    }
    var lock_state_map = {0: "keep", 1: "lock", 2: "unlock"};
    var lock_state_values = getValues(lock_state_map);
    if (lock_state_values.indexOf(lock_state) === -1) {
        throw new Error("schedule_settings._item.lock_state must be one of: " + lock_state_values.join(", "));
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
    buffer.writeUInt8(channel);
    var schedule_option = 0x00;
    schedule_option |= getValue(enable_map, enable);
    schedule_option |= getValue(yes_no_map, use_config) << 4;
    buffer.writeUInt8(schedule_option);
    buffer.writeUInt8(days);
    buffer.writeUInt8(execut_hour);
    buffer.writeUInt8(execut_min);
    buffer.writeUInt8(switchs);
    buffer.writeUInt8(getValue(lock_state_map, lock_state));
    return buffer.toBytes();
}

/**
 * get local rule
 * @param {object} get_local_rule
 * @param {number | string} get_local_rule.task_id range: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,"all schedules"]
 * @example { "get_local_rule": {"task_id": 1} }
 */
function setGetLocalRule(get_local_rule) {
    var task_id = get_local_rule.task_id;
    var task_id_values = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,"all schedules"];

    if(task_id_values.indexOf(task_id) === -1) {
        throw new Error("get_local_rule.task_id must be one of: " + task_id_values.join(", "));
    }

    var data = (task_id === "all schedules") ? 0xff : (task_id & 0xff);
    return [0xf9, 0x65, data];
}

/**
 * Anti-flash mode
 * @param {object} anti_flash_mode
 * @param {number} anti_flash_mode.enable values: (0: "disable", 1: "enable")
 * @example { "anti_flash_mode": {"enable": 1} }
 */
function setAntiFlashMode(anti_flash_mode) {
    var enable = anti_flash_mode.enable;
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("anti_flash_mode.enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0xaa);
    buffer.writeUInt8(getValue(enable_map, enable));
    return buffer.toBytes();
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
 * class mode
 * @param {object} lorawan_class_cfg
 * @param {number} lorawan_class_cfg.timestamp
 * @param {number} lorawan_class_cfg.continue
 * @param {number} lorawan_class_cfg.class_mode values: ("CLASS_B", 2: "CLASS_C")
 * @example { "lorawan_class_cfg": {"timestamp": 1758768956, "continue": 600, "class_mode": 1} }
 */
function setLorawanClassCfg(lorawan_class_cfg) {
    var class_mode = lorawan_class_cfg.class_mode;
    var class_map = {1: "CLASS_B", 2: "CLASS_C"};
    var class_values = getValues(class_map);
    if (class_values.indexOf(class_mode) === -1) {
        throw new Error("lorawan_class_cfg.class_mode must be one of " + class_values.join(", "));
    }

    var buffer = new Buffer(10);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0xa4);
    buffer.writeUInt32LE(lorawan_class_cfg.timestamp);
    buffer.writeUInt16LE(lorawan_class_cfg.continue);
    buffer.writeUInt8(getValue(class_map, class_mode));
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
 * @param {object, object} d2d_global_enable
 * @param {number} d2d_global_enable.master_enable values: (0: "disable", 1: "enable")
 * @param {number} d2d_global_enable.master_enable_change values: (0: "no", 1: "yes")
 * @param {number} d2d_global_enable.agent_enable values: (0: "disable", 1: "enable")
 * @param {number} d2d_global_enable.agent_enable_change values: (0: "no", 1: "yes")
 * @example { "d2d_global_enable": {"master_enable": 0, "master_enable_change": 0, "agent_enable": 0, "agent_enable_change": 0} }
 */
function setD2DGlobalEnable(d2d_global_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    var master_enable = d2d_global_enable.master_enable;
    var agent_enable = d2d_global_enable.agent_enable;
    var master_enable_change = d2d_global_enable.master_enable_change;
    var agent_enable_change = d2d_global_enable.agent_enable_change;

    if (enable_values.indexOf(master_enable) === -1) {
        throw new Error("d2d_global_enable.master_enable must be one of " + enable_values.join(", "));
    }
    if (enable_values.indexOf(agent_enable) === -1) {
        throw new Error("d2d_global_enable.agent_enable must be one of " + enable_values.join(", "));
    }
    if (yes_no_values.indexOf(master_enable_change) === -1) {
        throw new Error("d2d_global_enable.master_enable_change must be one of " + yes_no_values.join(", "));
    }
    if (yes_no_values.indexOf(agent_enable_change) === -1) {
        throw new Error("d2d_global_enable.agent_enable_change must be one of " + yes_no_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xc7);
    var data = 0x00;
    data |= getValue(enable_map, master_enable);
    data |= getValue(yes_no_map, master_enable_change) << 4;
    data |= getValue(enable_map, agent_enable) << 1;
    data |= getValue(yes_no_map, agent_enable_change) << 5;
    
    buffer.writeUInt8(data);
    return buffer.toBytes(); 
}

/**
 * D2D Agent Settings
 * @param {object} d2d_agent_settings_array
 * @param {number} d2d_agent_settings_array.d2d_agent_id range: [0, 15]
 * @param {number} d2d_agent_settings_array.d2d_agent_enable values: (0: "disable", 1: "enable")
 * @param {string} d2d_agent_settings_array.d2d_agent_command
 * @param {number} d2d_agent_settings_array.d2d_agent_action.switch_object values: (1: "switch1", 2: "switch2", 3: "switch1, switch2", 4: "switch3", 5: "switch1, switch3", 6: "switch2, switch3", 7: "switch1, switch2, switch3")
 * @param {number} d2d_agent_settings_array.d2d_agent_action.switch_status values: (0: "off", 1: "on", 2: "reversel")
 * @example { "d2d_agent_settings_array": [{"d2d_agent_id": 0, "d2d_agent_enable": 1, "d2d_agent_command": "0000", "d2d_agent_action": {"switch_object": 1, "switch_status": 1}}] }
 */
function setD2DAgentSettings(d2d_agent_settings) {
    var d2d_agent_id = d2d_agent_settings.d2d_agent_id;
    var d2d_agent_enable = d2d_agent_settings.d2d_agent_enable;
    var d2d_agent_command = d2d_agent_settings.d2d_agent_command;
    var switch_object = d2d_agent_settings.d2d_agent_action.switch_object;
    var switch_status = d2d_agent_settings.d2d_agent_action.switch_status;

    if (typeof d2d_agent_id !== "number") {
        throw new Error("d2d_agent_settings_array._item.d2d_agent_id must be a number");
    }
    if (d2d_agent_id < 0 || d2d_agent_id > 15) {
        throw new Error("d2d_agent_settings_array._item.d2d_agent_id must be in range [0, 15]");
    }
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(d2d_agent_enable) === -1) {
        throw new Error("d2d_agent_settings_array._item.d2d_agent_enable must be one of " + enable_values.join(", "));
    }
    var switch_map = {1: "switch1", 2: "switch2", 3: "switch1, switch2", 4: "switch3", 5: "switch1, switch3", 6: "switch2, switch3", 7: "switch1, switch2, switch3"};
    var switch_values = getValues(switch_map);
    if (switch_values.indexOf(switch_object) === -1) {
        throw new Error("d2d_agent_settings_array._item.d2d_agent_action.switch_object must be one of " + switch_values.join(", "));
    }
    var switch_status_map = {0: "off", 1: "on", 2: "reversel"};
    var switch_status_values = getValues(switch_status_map);
    if (switch_status_values.indexOf(switch_status) === -1) {
        throw new Error("d2d_agent_settings_array._item.d2d_agent_action.switch_status must be one of " + switch_status_values.join(", "));
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x83);
    buffer.writeUInt8(d2d_agent_id);
    buffer.writeUInt8(getValue(enable_map, d2d_agent_enable));
    buffer.writeD2DCommand(d2d_agent_command, "0000");
    var data = 0x00;
    data |= getValue(switch_status_map, switch_status);
    data |= getValue(switch_map, switch_object) << 4;
    buffer.writeUInt8(data);
    return buffer.toBytes();
}

/**
 *  D2D Controller Settings
 * @param {object} d2d_controller_settings
 * @param {number} d2d_controller_settings.key_contrl_enable values: (0: "disable", 1: "enable")
 * @param {number} d2d_controller_settings.uplink.lora_enable values: (0: "disable", 1: "enable")
 * @param {number} d2d_controller_settings.uplink.key_enable values: (0: "disable", 1: "enable")
 * @param {string} d2d_controller_settings.contrl_cmd
 * @param {number} id values: (0x00, 0x01, 0x02)
 * @example { "d2d_controller_settings": [{"key_contrl_enable": 1, "uplink": { "lora_enable": 1, "key_enable": 1 }, "contrl_cmd": "0000"}] }
 */
function setD2DControllerSettings(d2d_controller_settings, id) {
    var enable = d2d_controller_settings.key_contrl_enable;
    var lora_enable = d2d_controller_settings.uplink.lora_enable;
    var key_enable = d2d_controller_settings.uplink.key_enable;
    var contrl_cmd = d2d_controller_settings.contrl_cmd;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("d2d_controller_settings.key_contrl_enable must be one of " + enable_values.join(", "));
    }
    if (enable_values.indexOf(lora_enable) === -1) {
        throw new Error("d2d_controller_settings.uplink.lora_enable must be one of " + enable_values.join(", "));
    }
    if (enable_values.indexOf(key_enable) === -1) {
        throw new Error("d2d_controller_settings.uplink.key_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0xb8);
    buffer.writeUInt8(id);
    buffer.writeUInt8(getValue(enable_map, enable));
    var data = 0x00;
    data |= getValue(enable_map, lora_enable);
    data |= getValue(enable_map, key_enable) << 1;
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
 * @param {number} daylight_saving_time.daylight_saving_time_enable values: (0: disable, 1: enable)
 * @param {number} daylight_saving_time.daylight_saving_time_offset, unit: minute range: [1, 120]
 * @param {number} daylight_saving_time.start_month, values: (1: January, 2: February, 3: March, 4: April, 5: May, 6: June, 7: July, 8: August, 9: September, 10: October, 11: November, 12: December)
 * @param {number} daylight_saving_time.start_week_num, range: [1, 5]
 * @param {number} daylight_saving_time.start_week_day, range: [1, 7]
 * @param {number} daylight_saving_time.start_hour_min, unit: minute, convert: "hh:mm" -> "hh * 60 + mm"
 * @param {number} daylight_saving_time.end_month, values: (1: January, 2: February, 3: March, 4: April, 5: May, 6: June, 7: July, 8: August, 9: September, 10: October, 11: November, 12: December)
 * @param {number} daylight_saving_time.end_week_num, range: [1, 5]
 * @param {number} daylight_saving_time.end_week_day, range: [1, 7]
 * @param {number} daylight_saving_time.end_hour_min, unit: minute, convert: "hh:mm" -> "hh * 60 + mm"
 * @example { "daylight_saving_time": { "daylight_saving_time_enable": 1, "daylight_saving_time_offset": 60, "start_month": 3, "start_week_num": 2, "start_week_day": 7, "start_hour_min": 120, "end_month": 1, "end_week_num": 4, "end_week_day": 1, "end_hour_min": 180 } } output: FFBA013C032778000141B400
 */
function setDaylightSavingTime(daylight_saving_time) {
    var enable = daylight_saving_time.daylight_saving_time_enable;
    var offset = daylight_saving_time.daylight_saving_time_offset;
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
        throw new Error("daylight_saving_time.daylight_saving_time_enable must be one of " + enable_values.join(", "));
    }
    if (typeof offset !== "number") {
        throw new Error("daylight_saving_time.daylight_saving_time_offset must be a number");
    }
    if (offset < 1 || offset > 120) {
        throw new Error("daylight_saving_time.daylight_saving_time_offset must be in range [1, 120]");
    }

    var week_values = [1, 2, 3, 4, 5, 6, 7];
    var month_values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    var enable_value = getValue(enable_map, enable);
    if (enable_value && month_values.indexOf(start_month) === -1) {
        throw new Error("daylight_saving_time.start_month must be one of " + month_values.join(", "));
    }
    if (enable_value && month_values.indexOf(end_month) === -1) {
        throw new Error("daylight_saving_time.end_month must be one of " + month_values.join(", "));
    }
    if (enable_value && week_values.indexOf(start_week_day) === -1) {
        throw new Error("daylight_saving_time.start_week_day must be one of " + week_values.join(", "));
    }
    if (enable_value && week_values.indexOf(end_week_day) === -1) {
        throw new Error("daylight_saving_time.end_week_day must be one of " + week_values.join(", "));
    }

    var data = 0x00;
    data |= getValue(enable_map, enable) << 7;
    data |= offset;

    var buffer = new Buffer(11);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x72);
    buffer.writeUInt8(data);
    buffer.writeUInt8(start_month);
    buffer.writeUInt8((start_week_num << 4) | start_week_day);
    buffer.writeUInt16LE(start_hour_min);
    buffer.writeUInt8(end_month);
    buffer.writeUInt8((end_week_num << 4) | end_week_day);
    buffer.writeUInt16LE(end_hour_min);
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
