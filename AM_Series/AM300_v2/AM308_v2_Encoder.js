/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product AM308(v2)
 */
var RAW_VALUE = 0x00;

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

function milesightDeviceEncode(payload) {
    var encoded = [];

    if ("reboot" in payload) {
        encoded = encoded.concat(reboot(payload.reboot));
    }
    if ("stop_buzzer" in payload) {
        encoded = encoded.concat(stopBuzzer(payload.stop_buzzer));
    }
    if ("query_status" in payload) {
        encoded = encoded.concat(queryStatus(payload.query_status));
    }
    if ("report_interval" in payload) {
        encoded = encoded.concat(setReportInterval(payload.report_interval));
    }
    if ("time_sync_enable" in payload) {
        encoded = encoded.concat(setTimeSyncEnable(payload.time_sync_enable));
    }
    if ("timezone" in payload) {
        encoded = encoded.concat(setTimeZone(payload.timezone));
    }
    if ("tvoc_unit" in payload) {
        encoded = encoded.concat(setTVOCUnit(payload.tvoc_unit));
    }
    if ("pm2_5_collection_interval" in payload) {
        encoded = encoded.concat(setPM25CollectionInterval(payload.pm2_5_collection_interval));
    }
    if ("co2_abc_calibration_enable" in payload) {
        encoded = encoded.concat(setCO2AutoBackgroundCalibrationEnable(payload.co2_abc_calibration_enable));
    }
    if ("co2_calibration_enable" in payload) {
        encoded = encoded.concat(setCO2CalibrationEnable(payload.co2_calibration_enable));
    }
    if ("co2_calibration_settings" in payload) {
        encoded = encoded.concat(setCO2CalibrationSettings(payload.co2_calibration_settings));
    }
    if ("buzzer_enable" in payload) {
        encoded = encoded.concat(setBuzzerEnable(payload.buzzer_enable));
    }
    if ("led_indicator_mode" in payload) {
        encoded = encoded.concat(setLedIndicatorMode(payload.led_indicator_mode));
    }
    if ("screen_display_enable" in payload) {
        encoded = encoded.concat(setScreenDisplayEnable(payload.screen_display_enable));
    }
    if ("screen_display_alarm_enable" in payload) {
        encoded = encoded.concat(setScreenDisplayAlarmEnable(payload.screen_display_alarm_enable));
    }
    if ("screen_display_pattern" in payload) {
        encoded = encoded.concat(setScreenDisplayPattern(payload.screen_display_pattern));
    }
    if ("screen_display_element_settings" in payload) {
        encoded = encoded.concat(setScreenDisplayElement(payload.screen_display_element_settings));
    }
    if ("child_lock_settings" in payload) {
        encoded = encoded.concat(setChildLock(payload.child_lock_settings));
    }
    if ("retransmit_enable" in payload) {
        encoded = encoded.concat(setRetransmitEnable(payload.retransmit_enable));
    }
    if ("retransmit_interval" in payload) {
        encoded = encoded.concat(setRetransmitInterval(payload.retransmit_interval));
    }
    if ("resend_interval" in payload) {
        encoded = encoded.concat(setResendInterval(payload.resend_interval));
    }
    if ("history_enable" in payload) {
        encoded = encoded.concat(setHistoryEnable(payload.history_enable));
    }
    if ("fetch_history" in payload) {
        encoded = encoded.concat(fetchHistory(payload.fetch_history));
    }
    if ("stop_transmit" in payload) {
        encoded = encoded.concat(stopTransmit(payload.stop_transmit));
    }
    if ("clear_history" in payload) {
        encoded = encoded.concat(clearHistory(payload.clear_history));
    }

    return encoded;
}

/**
 * device reboot
 * @param {number} reboot, values: (0: no, 1: yes)
 * @example { "reboot": 1 }
 */
function reboot(reboot) {
    var reboot_map = { 0: "no", 1: "yes" };
    var reboot_values = getValues(reboot_map);
    if (reboot_values.indexOf(reboot) == -1) {
        throw new Error("reboot must be one of " + reboot_values.join(", "));
    }

    if (getValue(reboot_map, reboot) === 0) {
        return [];
    }
    return [0xff, 0x10, 0xff];
}

/**
 * Stop buzzer
 * @param {number} stop_buzzer values: (0: no, 1: yes)
 * @example { "stop_buzzer": 1 }
 */
function stopBuzzer(stop_buzzer) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(stop_buzzer) === -1) {
        throw new Error("stop_buzzer must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, stop_buzzer) === 0) {
        return [];
    }
    return [0xff, 0x3d, 0x00];
}

/**
 * Query status (buzzer status, led indicator status)
 * @param {number} query_status values: (0: no, 1: yes)
 * @example { "query_status": 1 }
 */
function queryStatus(query_status) {
    var query_status_map = { 0: "no", 1: "yes" };
    var query_status_values = getValues(query_status_map);
    if (query_status_values.indexOf(query_status) === -1) {
        throw new Error("query_status must be one of " + query_status_values.join(", "));
    }

    if (getValue(query_status_map, query_status) === 0) {
        return [];
    }
    return [0xff, 0x2c, 0x00];
}

/**
 * Set report interval
 * @param {number} report_interval unit: second
 * @example { "report_interval": 300 }
 */
function setReportInterval(report_interval) {
    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x03);
    buffer.writeUInt16LE(report_interval);
    return buffer.toBytes();
}

/**
 * time sync configuration
 * @param {number} time_sync_enable values: (0: disable, 2: enable)
 * @example { "time_sync_enable": 2 } output: FF3B02
 */
function setTimeSyncEnable(time_sync_enable) {
    var enable_map = { 0: "disable", 2: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(time_sync_enable) == -1) {
        throw new Error("time_sync_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x3b);
    buffer.writeUInt8(getValue(enable_map, time_sync_enable));
    return buffer.toBytes();
}

/**
 * Set timezone
 * @param {number} timezone unit: minute, UTC+8 -> 8 * 10 = 80
 * @example { "timezone": 8 }
 */
function setTimeZone(timezone) {
    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x17);
    buffer.writeInt16LE(timezone * 10);
    return buffer.toBytes();
}

/**
 * Set TVOC unit
 * @param {number} tvoc_unit values: (0: iaq, 1: ug/m3)
 * @example { "tvoc_unit": 1 }
 */
function setTVOCUnit(tvoc_unit) {
    var tvoc_unit_map = { 0: "iaq", 1: "ug/m3" };
    var tvoc_unit_values = getValues(tvoc_unit_map);
    if (tvoc_unit_values.indexOf(tvoc_unit) == -1) {
        throw new Error("tvoc_unit must be one of " + tvoc_unit_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xeb);
    buffer.writeUInt8(getValue(tvoc_unit_map, tvoc_unit));
    return buffer.toBytes();
}

/**
 * set PM2.5 collection interval
 * @param {number} pm2_5_collection_interval unit: second
 * @example { "pm2_5_collection_interval": 300 }
 * @product AM308
 */
function setPM25CollectionInterval(pm2_5_collection_interval) {
    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x65);
    buffer.writeUInt16LE(pm2_5_collection_interval);
    return buffer.toBytes();
}

/**
 * set CO2 auto background calibration enable
 * @param {number} co2_abc_calibration_enable values: (0: disable, 1: enable)
 * @example { "co2_abc_calibration_enable": 1 }
 * @product AM319
 */
function setCO2AutoBackgroundCalibrationEnable(co2_abc_calibration_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(co2_abc_calibration_enable) == -1) {
        throw new Error("co2_abc_calibration_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x39);
    buffer.writeUInt8(getValue(enable_map, co2_abc_calibration_enable));
    return buffer.toBytes();
}

/**
 * Set CO2 calibration enable
 * @param {number} co2_calibration_enable values: (0: disable, 1: enable)
 * @example { "co2_calibration_enable": 1 }
 */
function setCO2CalibrationEnable(co2_calibration_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(co2_calibration_enable) == -1) {
        throw new Error("co2_calibration_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xf4);
    buffer.writeUInt8(getValue(enable_map, co2_calibration_enable));
    return buffer.toBytes();
}

/**
 * Set CO2 calibration settings
 * @param {object} co2_calibration_settings
 * @param {number} co2_calibration_settings.mode values: (0: factory, 1: abc, 2: manual, 3: background, 4: zero)
 * @param {number} co2_calibration_settings.value
 * @example { "co2_calibration_settings": { "mode": 1 } }
 * @note AM319 only support factory mode and background mode
 */
function setCO2CalibrationSettings(co2_calibration_settings) {
    var mode = co2_calibration_settings.mode;
    var value = co2_calibration_settings.value;

    var calibration_mode_map = { 0: "factory", 1: "abc", 2: "manual", 3: "background", 4: "zero" };
    var calibration_mode_values = getValues(calibration_mode_map);
    if (calibration_mode_values.indexOf(mode) == -1) {
        throw new Error("co2_calibration_settings.mode must be one of " + calibration_mode_values.join(", "));
    }

    if (getValue(calibration_mode_map, mode) === 2) {
        var buffer = new Buffer(5);
        buffer.writeUInt8(0xff);
        buffer.writeUInt8(0x1a);
        buffer.writeUInt8(getValue(calibration_mode_map, mode));
        buffer.writeInt16LE(value);
        return buffer.toBytes();
    } else {
        var buffer = new Buffer(3);
        buffer.writeUInt8(0xff);
        buffer.writeUInt8(0x1a);
        buffer.writeUInt8(getValue(calibration_mode_map, mode));
        return buffer.toBytes();
    }
}

/**
 * Set buzzer enable
 * @param {number} buzzer_enable values: (0: disable, 1: enable)
 * @example { "buzzer_enable": 1 }
 */
function setBuzzerEnable(buzzer_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(buzzer_enable) === -1) {
        throw new Error("buzzer_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x3e);
    buffer.writeUInt8(getValue(enable_map, buzzer_enable));
    return buffer.toBytes();
}

/**
 * Set led indicator mode
 * @param {number} led_indicator_mode values: (0: off, 1: on, 2: blink)
 * @example { "led_indicator": 1 }
 */
function setLedIndicatorMode(led_indicator_mode) {
    var led_indicator_mode_map = { 0: "off", 1: "on", 2: "blink" };
    var led_indicator_mode_values = getValues(led_indicator_mode_map);
    if (led_indicator_mode_values.indexOf(led_indicator_mode) === -1) {
        throw new Error("led_indicator_mode must be one of " + led_indicator_mode_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x2e);
    buffer.writeUInt8(getValue(led_indicator_mode_map, led_indicator_mode));
    return buffer.toBytes();
}

/**
 * Set screen display enable
 * @param {number} screen_display_enable values: (0, 1)
 * @example { "screen_display_enable": 1 }
 */
function setScreenDisplayEnable(screen_display_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(screen_display_enable) === -1) {
        throw new Error("screen_display_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x2d);
    buffer.writeUInt8(getValue(enable_map, screen_display_enable));
    return buffer.toBytes();
}

/**
 * Set screen display alarm enable
 * @param {number} screen_display_alarm_enable values: (0: disable, 1: enable)
 * @example { "screen_display_alarm_enable": 1 }
 */
function setScreenDisplayAlarmEnable(screen_display_alarm_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(screen_display_alarm_enable) == -1) {
        throw new Error("screen_display_alarm_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x66);
    buffer.writeUInt8(getValue(enable_map, screen_display_alarm_enable));
    return buffer.toBytes();
}

/**
 * Set screen display pattern
 * @param {number} screen_display_pattern values: (1, 2, 3)
 * @example { "screen_display_pattern": 1 }
 */
function setScreenDisplayPattern(screen_display_pattern) {
    var pattern_values = [1, 2, 3];
    if (pattern_values.indexOf(screen_display_pattern) === -1) {
        throw new Error("screen_display_pattern must be one of " + pattern_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x3c);
    buffer.writeUInt8(screen_display_pattern);
    return buffer.toBytes();
}

/**
 * Set screen display element
 * @param {object} screen_display_element_settings
 * @param {number} screen_display_element_settings.temperature values: (0: disable, 1: enable)
 * @param {number} screen_display_element_settings.humidity values: (0: disable, 1: enable)
 * @param {number} screen_display_element_settings.co2 values: (0: disable, 1: enable)
 * @param {number} screen_display_element_settings.light values: (0: disable, 1: enable)
 * @param {number} screen_display_element_settings.tvoc values: (0: disable, 1: enable)
 * @param {number} screen_display_element_settings.smile values: (0: disable, 1: enable)
 * @param {number} screen_display_element_settings.letter values: (0: disable, 1: enable)
 * @param {number} screen_display_element_settings.pm2_5 values: (0: disable, 1: enable)
 * @param {number} screen_display_element_settings.pm10 values: (0: disable, 1: enable)
 * @param {number} screen_display_element_settings.hcho values: (0: disable, 1: enable)
 * @param {number} screen_display_element_settings.o3 values: (0: disable, 1: enable)
 * @example { "screen_display_element_settings": { "temperature": 1, "humidity": 1, "co2": 1, "light": 1, "tvoc": 1, "smile": 1, "letter": 1, "pm2_5": 1, "pm10": 1, "hcho": 1} }
 */
function setScreenDisplayElement(screen_display_element_settings) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);

    var data = 0;
    var mask = 0;
    var sensor_bit_offset = { "temperature": 0, "humidity": 1, "co2": 2, "light": 3, "tvoc": 4, "smile": 5, "letter": 6, "pm2_5": 7, "pm10": 8, "hcho": 9, "o3": 9 };
    for (var key in sensor_bit_offset) {
        if (key in screen_display_element_settings) {
            if (enable_values.indexOf(screen_display_element_settings[key]) === -1) {
                throw new Error("screen_display_element_settings." + key + " must be one of " + enable_values.join(", "));
            }
            mask |= 1 << sensor_bit_offset[key];
            data |= getValue(enable_map, screen_display_element_settings[key]) << sensor_bit_offset[key];
        }
    }

    var buffer = new Buffer(6);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0xf0);
    buffer.writeUInt16LE(mask);
    buffer.writeUInt16LE(data);
    return buffer.toBytes();
}

/**
 * Set child lock
 * @since v2.0
 * @param {object} child_lock_settings
 * @param {number} child_lock_settings.off_button values: (0: disable, 1: enable)
 * @param {number} child_lock_settings.on_button values: (0: disable, 1: enable)
 * @param {number} child_lock_settings.collection_button values: (0: disable, 1: enable)
 * @example { "child_lock_settings": { "off_button": 1, "on_button": 1, "collection_button": 1 } }
 */
function setChildLock(child_lock_settings) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);

    var data = 0;
    var button_bit_offset = { "off_button": 0, "on_button": 1, "collection_button": 2 };
    for (var key in button_bit_offset) {
        if (key in child_lock_settings) {
            if (enable_values.indexOf(child_lock_settings[key]) === -1) {
                throw new Error("child_lock_settings." + key + " must be one of " + enable_values.join(", "));
            }
            data |= getValue(enable_map, child_lock_settings[key]) << button_bit_offset[key];
        }
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x25);
    buffer.writeUInt8(data);
    return buffer.toBytes();
}

/**
 * set retransmit enable
 * @param {number} retransmit_enable values: (0: disable, 1: enable)
 * @example { "retransmit_enable": 1 }
 */
function setRetransmitEnable(retransmit_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(retransmit_enable) === -1) {
        throw new Error("retransmit_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x69);
    buffer.writeUInt8(getValue(enable_map, retransmit_enable));
    return buffer.toBytes();
}

/**
 * set retransmit interval
 * @param {number} retransmit_interval unit: second, range: [1, 64800]
 * @example { "retransmit_interval": 600 }
 */
function setRetransmitInterval(retransmit_interval) {
    if (typeof retransmit_interval !== "number") {
        throw new Error("retransmit_interval must be a number");
    }
    if (retransmit_interval < 1 || retransmit_interval > 64800) {
        throw new Error("retransmit_interval must be between 1 and 64800");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x6a);
    buffer.writeUInt8(0x00);
    buffer.writeUInt16LE(retransmit_interval);
    return buffer.toBytes();
}

/**
 * set resend interval
 * @param {number} resend_interval unit: second, range: [1, 64800]
 * @example { "resend_interval": 600 }
 */
function setResendInterval(resend_interval) {
    if (typeof resend_interval !== "number") {
        throw new Error("resend_interval must be a number");
    }
    if (resend_interval < 1 || resend_interval > 64800) {
        throw new Error("resend_interval must be between 1 and 64800");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x6a);
    buffer.writeUInt8(0x01);
    buffer.writeUInt16LE(resend_interval);
    return buffer.toBytes();
}

/**
 * history enable
 * @param {number} history_enable values: (0: disable, 1: enable)
 * @example { "history_enable": 1 }
 */
function setHistoryEnable(history_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(history_enable) === -1) {
        throw new Error("history_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x68);
    buffer.writeUInt8(getValue(enable_map, history_enable));
    return buffer.toBytes();
}

/**
 * fetch history
 * @param {object} fetch_history
 * @param {number} fetch_history.start_time unit: second
 * @param {number} fetch_history.end_time unit: second
 * @example { "fetch_history": { "start_time": 1609459200, "end_time": 1609545600 } }
 */
function fetchHistory(fetch_history) {
    var start_time = fetch_history.start_time;
    var end_time = fetch_history.end_time;

    if (typeof start_time !== "number") {
        throw new Error("start_time must be a number");
    }
    if ("end_time" in fetch_history && typeof end_time !== "number") {
        throw new Error("end_time must be a number");
    }
    if ("end_time" in fetch_history && start_time > end_time) {
        throw new Error("start_time must be less than end_time");
    }

    var buffer;
    if ("end_time" in fetch_history || end_time === 0) {
        buffer = new Buffer(6);
        buffer.writeUInt8(0xfd);
        buffer.writeUInt8(0x6b);
        buffer.writeUInt32LE(start_time);
    } else {
        buffer = new Buffer(10);
        buffer.writeUInt8(0xfd);
        buffer.writeUInt8(0x6c);
        buffer.writeUInt32LE(start_time);
        buffer.writeUInt32LE(end_time);
    }
    return buffer.toBytes();
}

/**
 * history stop transmit
 * @param {number} stop_transmit values: (0: no, 1: yes)
 * @example { "stop_transmit": 1 }
 */
function stopTransmit(stop_transmit) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(stop_transmit) === -1) {
        throw new Error("stop_transmit must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, stop_transmit) === 0) {
        return [];
    }
    return [0xff, 0x6d, 0xff];
}

/**
 * clear history
 * @param {number} clear_history values: (0: no, 1: yes)
 * @example { "clear_history": 1 }
 */
function clearHistory(clear_history) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(clear_history) === -1) {
        throw new Error("clear_history must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, clear_history) === 0) {
        return [];
    }
    return [0xff, 0x27, 0x01];
}

function getValues(map) {
    var values = [];
    if (RAW_VALUE) {
        for (var key in map) {
            values.push(parseInt(key));
        }
    } else {
        for (var key in map) {
            values.push(map[key]);
        }
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

Buffer.prototype.toBytes = function () {
    return this.buffer;
};
