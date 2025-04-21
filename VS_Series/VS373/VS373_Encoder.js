/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product VS373
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
    if ("report_status" in payload) {
        encoded = encoded.concat(reportStatus(payload.report_status));
    }
    if ("report_interval" in payload) {
        encoded = encoded.concat(setReportInterval(payload.report_interval));
    }
    if ("digital_output" in payload) {
        encoded = encoded.concat(setDigitalOutput(payload.digital_output));
    }
    if ("detection_region_settings" in payload) {
        encoded = encoded.concat(setDetectionRegion(payload.detection_region_settings));
    }
    if ("detection_settings" in payload) {
        encoded = encoded.concat(setDetectionModeAndSensitivity(payload.detection_settings));
    }
    if ("fall_detection_settings" in payload) {
        encoded = encoded.concat(setFallDetectionSettings(payload.fall_detection_settings));
    }
    if ("dwell_detection_settings" in payload) {
        encoded = encoded.concat(setDwellDetectionSettings(payload.dwell_detection_settings));
    }
    if ("motion_detection_settings" in payload) {
        encoded = encoded.concat(setMotionDetectionSettings(payload.motion_detection_settings));
    }
    if ("led_indicator_enable" in payload) {
        encoded = encoded.concat(setLedIndicatorEnable(payload.led_indicator_enable));
    }
    if ("buzzer_enable" in payload) {
        encoded = encoded.concat(setBuzzerEnable(payload.buzzer_enable));
    }
    if ("release_alarm" in payload) {
        encoded = encoded.concat(releaseAlarm(payload.release_alarm));
    }
    if ("radar_settings" in payload) {
        encoded = encoded.concat(setRadarSettings(payload.radar_settings));
    }
    if ("target_detection_minimum_height" in payload) {
        encoded = encoded.concat(setTargetDetectionMinimumHeight(payload.target_detection_minimum_height));
    }
    if ("existence_detection_settings" in payload) {
        encoded = encoded.concat(setExistenceDetectionSettings(payload.existence_detection_settings));
    }
    if ("region_settings" in payload) {
        for (var i = 0; i < payload.region_settings.length; i++) {
            var settings = payload.region_settings[i];
            encoded = encoded.concat(setRegionSettings(settings));
        }
    }
    if ("delete_region" in payload) {
        encoded = encoded.concat(deleteRegion(payload.delete_region));
    }
    if ("region_detection_settings" in payload) {
        for (var i = 0; i < payload.region_detection_settings.length; i++) {
            var settings = payload.region_detection_settings[i];
            encoded = encoded.concat(setRegionDetectionSettings(settings));
        }
    }
    if ("bed_detection_settings" in payload) {
        for (var i = 0; i < payload.bed_detection_settings.length; i++) {
            var settings = payload.bed_detection_settings[i];
            encoded = encoded.concat(setBedDetectionSettings(settings));
        }
    }
    if ("retransmit_enable" in payload) {
        encoded = encoded.concat(setRetransmitEnable(payload.retransmit_enable));
    }
    if ("retransmit_interval" in payload) {
        encoded = encoded.concat(setRetransmitInterval(payload.retransmit_interval));
    }
    if ("confirm_mode_enable" in payload) {
        encoded = encoded.concat(setConfirmMode(payload.confirm_mode_enable));
    }
    if ("adr_enable" in payload) {
        encoded = encoded.concat(setAdrEnable(payload.adr_enable));
    }
    if ("d2d_key" in payload) {
        encoded = encoded.concat(setD2dKey(payload.d2d_key));
    }
    if ("d2d_enable" in payload) {
        encoded = encoded.concat(setD2dEnable(payload.d2d_enable));
    }
    if ("d2d_master_config" in payload) {
        for (var i = 0; i < payload.d2d_master_config.length; i++) {
            var config = payload.d2d_master_config[i];
            encoded = encoded.concat(setD2DMasterConfig(config));
        }
    }
    if ("d2d_slave_config" in payload) {
        for (var i = 0; i < payload.d2d_slave_config.length; i++) {
            var config = payload.d2d_slave_config[i];
            encoded = encoded.concat(setD2dSlaveConfig(config));
        }
    }
    if ("timestamp" in payload) {
        encoded = encoded.concat(setTime(payload.timestamp));
    }
    if ("wifi_enable" in payload) {
        encoded = encoded.concat(setWiFiEnable(payload.wifi_enable));
    }
    if ("wifi_ssid_hidden" in payload) {
        encoded = encoded.concat(setWiFiSSIDHidden(payload.wifi_ssid_hidden));
    }
    if ("stop_transmit" in payload) {
        encoded = encoded.concat(stopTransmit(payload.stop_transmit));
    }
    if ("fetch_history" in payload) {
        encoded = encoded.concat(fetchHistory(payload.fetch_history));
    }

    return encoded;
}

/**
 * reboot device
 * @param {number} reboot values: (0: no, 1: yes)
 * @example { "reboot": 1 }
 */
function reboot(reboot) {
    var value_map = { 0: "no", 1: "yes" };
    var value_values = getValues(value_map);
    if (value_values.indexOf(reboot) === -1) {
        throw new Error("reboot must be one of " + value_values.join(", "));
    }

    if (getValue(value_map, reboot) === 0) {
        return [];
    }
    return [0xff, 0x10, 0xff];
}

/**
 * report status
 * @param {number} report_status values: (0: no, 1: yes)
 * @example { "report_status": 1 }
 */
function reportStatus(report_status) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if (yes_no_values.indexOf(report_status) === -1) {
        throw new Error("report_status must be one of " + yes_no_values.join(", "));
    }

    if (getValue(yes_no_map, report_status) === 0) {
        return [];
    }
    return [0xff, 0x28, 0xff];
}

/**
 * set report interval
 * @param {number} report_interval unit: minute
 * @example { "report_interval": 20 }
 */
function setReportInterval(report_interval) {
    if (typeof report_interval !== "number") {
        throw new Error("report_interval must be a number");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x8e);
    buffer.writeUInt8(0x00);
    buffer.writeUInt16LE(report_interval);
    return buffer.toBytes();
}

/**
 * set digital output
 * @param {number} digital_output values: (0: low, 1: high)
 * @example { "digital_output": 1 }
 */
function setDigitalOutput(digital_output) {
    var value_map = { 0: "low", 1: "high" };
    var value_values = getValues(value_map);
    if (value_values.indexOf(digital_output) === -1) {
        throw new Error("digital_output must be one of " + value_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x4e);
    buffer.writeUInt8(getValue(value_map, digital_output));
    return buffer.toBytes();
}

/**
 * set detection region
 * @param {object} detection_region_settings
 * @param {number} detection_region_settings.x_min unit: mm
 * @param {number} detection_region_settings.x_max unit: mm
 * @param {number} detection_region_settings.y_min unit: mm
 * @param {number} detection_region_settings.y_max unit: mm
 * @param {number} detection_region_settings.z_max unit: mm
 * @param {number} detection_region_settings.install_height unit: mm
 * @example { "detection_region_settings": { "x_min": 0, "x_max": 100, "y_min": 0, "y_max": 100, "z_max": 100, "install_height": 100 } }
 */
function setDetectionRegion(detection_region_settings) {
    var x_min = detection_region_settings.x_min;
    var x_max = detection_region_settings.x_max;
    var y_min = detection_region_settings.y_min;
    var y_max = detection_region_settings.y_max;
    var z_max = detection_region_settings.z_max;
    var install_height = detection_region_settings.install_height;

    var buffer = new Buffer(14);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x4f);
    buffer.writeUInt16LE(x_min);
    buffer.writeUInt16LE(x_max);
    buffer.writeUInt16LE(y_min);
    buffer.writeUInt16LE(y_max);
    buffer.writeUInt16LE(z_max);
    buffer.writeUInt16LE(install_height);
    return buffer.toBytes();
}

/**
 * set detection mode and sensitivity
 * @param {object} detection_settings
 * @param {number} detection_settings.mode values: (0: default, 1: bedroom, 2: bathroom, 3: public)
 * @param {number} detection_settings.sensitivity values: (0: low, 1: high)
 * @example { "detection_settings": { "mode": 0, "sensitivity": 1 } }
 */
function setDetectionModeAndSensitivity(detection_settings) {
    var mode = detection_settings.mode;
    var sensitivity = detection_settings.sensitivity;

    var mode_map = { 0: "default", 1: "bedroom", 2: "bathroom", 3: "public" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(mode) === -1) {
        throw new Error("detection_settings.mode must be in " + mode_values.join(", "));
    }
    var sensitivity_map = { 0: "low", 1: "high" };
    var sensitivity_values = getValues(sensitivity_map);
    if (sensitivity_values.indexOf(sensitivity) === -1) {
        throw new Error("detection_settings.sensitivity must be in " + sensitivity_values.join(", "));
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x50);
    buffer.writeUInt8(getValue(mode_map, mode));
    buffer.writeUInt8(getValue(sensitivity_map, sensitivity));
    return buffer.toBytes();
}

/**
 * set fall detection settings
 * @param {object} fall_detection_settings
 * @param {number} fall_detection_settings.confirm_time unit: s, range: [0, 300]
 * @param {number} fall_detection_settings.delay_report_time unit: s, range: [0, 300]
 * @param {number} fall_detection_settings.alarm_duration unit: s, range: [0, 1800]
 * @example { "fall_detection_settings": { "confirm_time": 10, "delay_report_time": 10, "alarm_duration": 10 } }
 */
function setFallDetectionSettings(fall_detection_settings) {
    var confirm_time = fall_detection_settings.confirm_time;
    var delay_report_time = fall_detection_settings.delay_report_time;
    var alarm_duration = fall_detection_settings.alarm_duration;

    if (confirm_time < 0 || confirm_time > 300) {
        throw new Error("fall_detection_settings.confirm_time must be in [0, 300]");
    }
    if (delay_report_time < 0 || delay_report_time > 300) {
        throw new Error("fall_detection_settings.delay_report_time must be in [0, 300]");
    }
    if (alarm_duration < 0 || alarm_duration > 1800) {
        throw new Error("fall_detection_settings.alarm_duration must be in [0, 1800]");
    }

    var buffer = new Buffer(8);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x51);
    buffer.writeUInt16LE(confirm_time);
    buffer.writeUInt16LE(delay_report_time);
    buffer.writeUInt16LE(alarm_duration);
    return buffer.toBytes();
}

/**
 * set dwell detection settings
 * @param {object} dwell_detection_settings
 * @param {number} dwell_detection_settings.enable values: (0: disable, 1: enable)
 * @param {number} dwell_detection_settings.dwell_time unit: min
 * @example { "dwell_detection_settings": { "enable": 1, "dwell_time": 10 } }
 */
function setDwellDetectionSettings(dwell_detection_settings) {
    var enable = dwell_detection_settings.enable;
    var dwell_time = dwell_detection_settings.dwell_time;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("dwell_detection_settings.enable must be in " + enable_values.join(", "));
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x52);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt16LE(dwell_time);
    return buffer.toBytes();
}

/**
 * set motion detection settings
 * @param {object} motion_detection_settings
 * @param {number} motion_detection_settings.enable values: (0: disable, 1: enable)
 * @param {number} motion_detection_settings.motionless_time unit: min
 * @example { "motion_detection": { "enable": 1, "position_filter_enable": 1, "motionless_time": 10 } }
 */
function setMotionDetectionSettings(motion_detection_settings) {
    var enable = motion_detection_settings.enable;
    var motionless_time = motion_detection_settings.motionless_time;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("motionless_detection_settings.enable must be in " + enable_values.join(", "));
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x53);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt16LE(motionless_time);
    return buffer.toBytes();
}

/**
 * set led indicator enable
 * @param {number} led_indicator_enable values: (0: disable, 1: enable)
 * @example { "led_indicator_enable": 1 } }
 */
function setLedIndicatorEnable(led_indicator_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(led_indicator_enable) === -1) {
        throw new Error("led_indicator_enable must be in " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x2f);
    buffer.writeUInt8(getValue(enable_map, led_indicator_enable));
    return buffer.toBytes();
}

/**
 * set buzzer enable
 * @param {number} buzzer_enable values: (0: disable, 1: enable)
 * @example { "buzzer_enable": 1 } }
 */
function setBuzzerEnable(buzzer_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(buzzer_enable) === -1) {
        throw new Error("buzzer_enable must be in " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x3e);
    buffer.writeUInt8(getValue(enable_map, buzzer_enable));
    return buffer.toBytes();
}

/**
 * release alarm
 * @param {number} release_alarm values: (0: no, 1: yes)
 * @example { "release_alarm": 1 } }
 */
function releaseAlarm(release_alarm) {
    var release_alarm_map = { 0: "no", 1: "yes" };
    var release_alarm_values = getValues(release_alarm_map);
    if (release_alarm_values.indexOf(release_alarm) === -1) {
        throw new Error("release_alarm must be in " + release_alarm_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x64);
    buffer.writeUInt8(getValue(release_alarm_map, release_alarm));
    return buffer.toBytes();
}

/**
 * set radar settings
 * @param {object} radar_settings
 * @param {number} radar_settings.mode values: (0: const, 1: free)
 * @param {number} radar_settings.frame_rate unit: fps
 * @example { "radar_settings": { "mode": 0, "frame_rate": 1 } }
 */
function setRadarSettings(radar_settings) {
    var mode = radar_settings.mode;
    var frame_rate = radar_settings.frame_rate;

    var mode_map = { 0: "const", 1: "free" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(mode) === -1) {
        throw new Error("radar_settings.mode must be in " + mode_values.join(", "));
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x54);
    buffer.writeUInt8(getValue(mode_map, mode));
    buffer.writeUInt8(frame_rate);
    return buffer.toBytes();
}

function setTargetDetectionMinimumHeight(target_detection_minimum_height) { }

/**
 * set existence detection settings
 * @param {object} existence_detection_settings
 * @param {number} existence_detection_settings.exist_confirm_time unit: s
 * @param {number} existence_detection_settings.leaved_confirm_time unit: s
 * @example { "existence_detection_settings": { "exist_confirm_time": 10, "leaved_confirm_time": 10 } }
 */
function setExistenceDetectionSettings(existence_detection_settings) {
    var exist_confirm_time = existence_detection_settings.exist_confirm_time;
    var leaved_confirm_time = existence_detection_settings.leaved_confirm_time;

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x56);
    buffer.writeUInt8(exist_confirm_time);
    buffer.writeUInt8(leaved_confirm_time);
    return buffer.toBytes();
}

/**
 * set region settings
 * @param {object} region_settings
 * @param {number} region_settings._item.region_id range: [1, 4]
 * @param {number} region_settings._item.x_min unit: mm
 * @param {number} region_settings._item.x_max unit: mm
 * @param {number} region_settings._item.y_min unit: mm
 * @param {number} region_settings._item.y_max unit: mm
 * @example { "region_settings": [{ "region_id": 1, "x_min": 0, "x_max": 100, "y_min": 0, "y_max": 100 }] }
 */
function setRegionSettings(region_settings) {
    var region_id = region_settings.region_id;
    var x_min = region_settings.x_min;
    var x_max = region_settings.x_max;
    var y_min = region_settings.y_min;
    var y_max = region_settings.y_max;

    if (region_id < 1 || region_id > 4) {
        throw new Error("region_settings._item.region_id must be in [1, 4]");
    }

    var buffer = new Buffer(11);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x49);
    buffer.writeUInt8(region_id - 1);
    buffer.writeUInt16LE(x_min);
    buffer.writeUInt16LE(x_max);
    buffer.writeUInt16LE(y_min);
    buffer.writeUInt16LE(y_max);
    return buffer.toBytes();
}

/**
 * delete region
 * @param {object} delete_region
 * @param {number} delete_region.region_1 values: (0: no, 1: yes)
 * @param {number} delete_region.region_2 values: (0: no, 1: yes)
 * @param {number} delete_region.region_3 values: (0: no, 1: yes)
 * @param {number} delete_region.region_4 values: (0: no, 1: yes)
 * @example { "delete_region": { "region_1": 1 } }
 */
function deleteRegion(delete_region) {
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);

    var data = [];
    var region_offset = { "region_1": 0, "region_2": 1, "region_3": 2, "region_4": 3 };
    for (var key in region_offset) {
        if (key in delete_region) {
            if (yes_no_values.indexOf(delete_region[key]) === -1) {
                throw new Error("delete_region." + key + " must be in " + yes_no_values.join(", "));
            }
            if (getValue(yes_no_map, delete_region[key]) === 0) {
                continue;
            }

            var buffer = new Buffer(3);
            buffer.writeUInt8(0xf9);
            buffer.writeUInt8(0x48);
            buffer.writeUInt8(region_offset[key]);
            data = data.concat(buffer.toBytes());
        }
    }

    return data;
}

/**
 * set region detection settings
 * @param {object} region_detection_settings
 * @param {number} region_detection_settings._item.region_id range: [1, 4]
 * @param {number} region_detection_settings._item.fall_detection_enable values: (0: disable, 1: enable)
 * @param {number} region_detection_settings._item.dwell_detection_enable values: (0: disable, 1: enable)
 * @param {number} region_detection_settings._item.motion_detection_enable values: (0: disable, 1: enable)
 * @param {number} region_detection_settings._item.region_type values: (0: default, 1: bed, 2: door)
 * @example { "region_detection_settings": [{ "region_id": 1, "fall_detection_enable": 1, "dwell_detection_enable": 1, "motion_detection_enable": 1, "region_type": 0 }] }
 */
function setRegionDetectionSettings(region_detection_settings) {
    var region_id = region_detection_settings.region_id;
    var fall_detection_enable = region_detection_settings.fall_detection_enable;
    var dwell_detection_enable = region_detection_settings.dwell_detection_enable;
    var motion_detection_enable = region_detection_settings.motion_detection_enable;
    var region_type = region_detection_settings.region_type;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(fall_detection_enable) === -1) {
        throw new Error("region_detection_settings._item.fall_detection_enable must be in " + enable_values.join(", "));
    }
    if (enable_values.indexOf(dwell_detection_enable) === -1) {
        throw new Error("region_detection_settings._item.dwell_detection_enable must be in " + enable_values.join(", "));
    }
    if (enable_values.indexOf(motion_detection_enable) === -1) {
        throw new Error("region_detection_settings._item.motion_detection_enable must be in " + enable_values.join(", "));
    }
    var region_type_map = { 0: "default", 1: "bed", 2: "door" };
    var region_type_values = getValues(region_type_map);
    if (region_type_values.indexOf(region_type) === -1) {
        throw new Error("region_detection_settings._item.region_type must be in " + region_type_values.join(", "));
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x4a);
    buffer.writeUInt8(region_id - 1);
    buffer.writeUInt8(getValue(enable_map, fall_detection_enable));
    buffer.writeUInt8(getValue(enable_map, dwell_detection_enable));
    buffer.writeUInt8(getValue(enable_map, motion_detection_enable));
    buffer.writeUInt8(getValue(region_type_map, region_type));
    return buffer.toBytes();
}

/**
 * set bed detection settings
 * @param {object} bed_detection_settings
 * @param {number} bed_detection_settings._item.bed_id range: [1, 4]
 * @param {number} bed_detection_settings._item.enable values: (0: disable, 1: enable)
 * @param {number} bed_detection_settings._item.start_time unit: min
 * @param {number} bed_detection_settings._item.end_time unit: min
 * @param {number} bed_detection_settings._item.bed_height unit: mm
 * @param {number} bed_detection_settings._item.out_of_bed_time unit: min
 * @example { "bed_detection_settings": [{ "bed_id": 1, "enable": 1, "start_time": 10, "end_time": 10, "bed_height": 10, "out_of_bed_time": 10 }] }
 */
function setBedDetectionSettings(bed_detection_settings) {
    var bed_id = bed_detection_settings.bed_id;
    var enable = bed_detection_settings.enable;
    var start_time = bed_detection_settings.start_time;
    var end_time = bed_detection_settings.end_time;
    var bed_height = bed_detection_settings.bed_height;
    var out_of_bed_time = bed_detection_settings.out_of_bed_time;

    if (bed_id < 1 || bed_id > 4) {
        throw new Error("bed_detection_settings._item.bed_id must be in [1, 4]");
    }
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("bed_detection_settings._item.enable must be in " + enable_values.join(", "));
    }

    var buffer = new Buffer(11);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x4b);
    buffer.writeUInt8(bed_id - 1);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt16LE(start_time);
    buffer.writeUInt16LE(end_time);
    buffer.writeUInt16LE(bed_height);
    buffer.writeUInt8(out_of_bed_time);
    return buffer.toBytes();
}

/**
 * retransmit enable
 * @param {number} retransmit_enable values: (0: disable, 1: enable)
 */
function setRetransmitEnable(retransmit_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(retransmit_enable) === -1) {
        throw new Error("retransmit_enable must be in " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x69);
    buffer.writeUInt8(getValue(enable_map, retransmit_enable));
    return buffer.toBytes();
}

/**
 * set retransmit interval
 * @param {number} retransmit_interval unit: second range: [30, 1200]
 * @example { "retransmit_interval": 600 }
 */
function setRetransmitInterval(retransmit_interval) {
    if (retransmit_interval < 30 || retransmit_interval > 1200) {
        throw new Error("retransmit_interval must be between 30 and 1200");
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x6a);
    buffer.writeUInt8(0x00);
    buffer.writeUInt16LE(retransmit_interval);
    return buffer.toBytes();
}

/**
 * fetch history
 * @param {object} fetch_history
 * @param {number} fetch_history.start_time
 * @param {number} fetch_history.end_time
 * @example { "fetch_history": { "start_time": 1609459200, "end_time": 1609545600 } }
 */
function fetchHistory(fetch_history) {
    var start_time = fetch_history.start_time;
    var end_time = fetch_history.end_time;

    if (start_time > end_time) {
        throw new Error("fetch_history.start_time must be less than fetch_history.end_time");
    }
    var buffer = new Buffer(10);
    buffer.writeUInt8(0xfd);
    buffer.writeUInt8(0x6c);
    buffer.writeUInt32LE(start_time);
    buffer.writeUInt32LE(end_time);

    return buffer.toBytes();
}

/**
 * history stop transmit
 * @param {number} stop_transmit values: (0: no, 1: yes)
 * @example { "stop_transmit": 1 }
 */
function stopTransmit(stop_transmit) {
    var value_map = { 0: "no", 1: "yes" };
    var value_values = getValues(value_map);
    if (value_values.indexOf(stop_transmit) === -1) {
        throw new Error("stop_transmit must be one of " + value_values.join(", "));
    }

    if (getValue(value_map, stop_transmit) === 0) {
        return [];
    }
    return [0xfd, 0x6d, 0xff];
}

/**
 * set confirm mode
 * @param {number} confirm_mode_enable values: (0: disable, 1: enable)
 * @example { "confirm_mode_enable": 1 }
 */
function setConfirmMode(confirm_mode_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(confirm_mode_enable) === -1) {
        throw new Error("confirm_mode must be in " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x04);
    buffer.writeUInt8(getValue(enable_map, confirm_mode_enable));
    return buffer.toBytes();
}

/**
 * set ADR
 * @param {number} adr_enable values: (0: disable, 1: enable)
 * @example { "adr_enable": 1 }
 */
function setADR(adr_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(adr_enable) === -1) {
        throw new Error("adr_enable must be in " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x40);
    buffer.writeUInt8(getValue(enable_map, adr_enable));
    return buffer.toBytes();
}

/**
 * set d2d key
 * @param {string} d2d_key hex string
 * @example { "d2d_key": "0000000000000000" }
 */
function setD2DKey(d2d_key) {
    if (typeof d2d_key !== "string") {
        throw new Error("d2d_key must be a string");
    }
    if (d2d_key.length !== 16) {
        throw new Error("d2d_key must be 16 characters");
    }
    if (!/^[0-9A-F]+$/.test(d2d_key)) {
        throw new Error("d2d_key must be hex string [0-9A-F]");
    }

    var data = hexStringToBytes(d2d_key);
    var buffer = new Buffer(10);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x35);
    buffer.writeBytes(data);
    return buffer.toBytes();
}

/**
 * set d2d enable
 * @param {number} d2d_enable values: (0: disable, 1: enable)
 * @example { "d2d_enable": 1 }
 */
function setD2DEnable(d2d_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(d2d_enable) === -1) {
        throw new Error("d2d_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x84);
    buffer.writeUInt8(getValue(enable_map, d2d_enable));
    return buffer.toBytes();
}

/**
 * d2d master configuration
 * @param {object} d2d_master_config
 * @param {number} d2d_master_config.mode values: (0: occupied, 1: vacant, 2: fall, 3: out_of_bed, 4: motionless, 5: dwell)
 * @param {number} d2d_master_config.enable values: (0: disable, 1: enable)
 * @param {number} d2d_master_config.lora_uplink_enable values: (0: disable, 1: enable)
 * @param {string} d2d_master_config.d2d_cmd
 * @param {number} d2d_master_config.time_enable values: (0: disable, 1: enable)
 * @param {number} d2d_master_config.time unit: minute
 * @example { "d2d_master_config": [{ "mode": 0, "enable": 1, "d2d_cmd": "0000", "uplink_enable": 1, "time_enable": 1, "time": 10 }] }
 */
function setD2DMasterConfig(d2d_master_config) {
    var mode = d2d_master_config.mode;
    var enable = d2d_master_config.enable;
    var lora_uplink_enable = d2d_master_config.lora_uplink_enable;
    var d2d_cmd = d2d_master_config.d2d_cmd;
    var time_enable = d2d_master_config.time_enable;
    var time = d2d_master_config.time;

    var mode_map = { 0: "occupied", 1: "vacant", 2: "fall", 3: "out_of_bed", 4: "motionless", 5: "dwell" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(mode) === -1) {
        throw new Error("d2d_master_config._item.mode must be one of " + mode_values.join(", "));
    }
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(enable) === -1) {
        throw new Error("d2d_master_config._item.enable must be one of " + enable_values.join(", "));
    }
    if (enable && enable_values.indexOf(lora_uplink_enable) === -1) {
        throw new Error("d2d_master_config._item.lora_uplink_enable must be one of " + enable_values.join(", "));
    }
    if (enable && enable_values.indexOf(time_enable) === -1) {
        throw new Error("d2d_master_config._item.time_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(10);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x96);
    buffer.writeUInt8(getValue(mode_map, mode));
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(getValue(enable_map, lora_uplink_enable));
    buffer.writeD2DCommand(d2d_cmd, "0000");
    buffer.writeUInt16LE(time);
    buffer.writeUInt8(getValue(enable_map, time_enable));
    return buffer.toBytes();
}

/**
 * d2d slave configuration
 * @param {object} d2d_slave_config
 * @param {number} d2d_slave_config._item.mode values: (0: occupied, 1: vacant, 2: fall, 3: out of bed, 4: motionless, 5: dwell)
 * @param {string} d2d_slave_config._item.d2d_cmd
 * @param {number} d2d_slave_config._item.control_type values: (1: button)
 * @param {number} d2d_slave_config._item.alarm_type values: (1: alarm deactivate, 2: wifi on, 3: wifi off)
 * @example { "d2d_slave_config": [{ "mode": 0, "d2d_cmd": "0000", "control_type": 1, "alarm_type": 1 }] }
 */
function setD2DSlaveConfig(d2d_slave_config) {
    var mode = d2d_slave_config.mode;
    var d2d_cmd = d2d_slave_config.d2d_cmd;
    var control_type = d2d_slave_config.control_type;
    var alarm_type = d2d_slave_config.alarm_type;

    var mode_map = { 0: "occupied", 1: "vacant", 2: "fall", 3: "out_of_bed", 4: "motionless", 5: "dwell" };
    var mode_values = getValues(mode_map);
    if (mode_values.indexOf(mode) === -1) {
        throw new Error("d2d_slave_config._item.mode must be one of " + mode_values.join(", "));
    }
    var control_type_map = { 1: "button" };
    var control_type_values = getValues(control_type_map);
    if (control_type_values.indexOf(control_type) === -1) {
        throw new Error("d2d_slave_config._item.control_type must be one of " + control_type_values.join(", "));
    }
    var alarm_type_map = { 1: "alarm_deactivate", 2: "wifi_on", 3: "wifi_off" };
    var alarm_type_values = getValues(alarm_type_map);
    if (alarm_type_values.indexOf(alarm_type) === -1) {
        throw new Error("d2d_slave_config._item.alarm_type must be one of " + alarm_type_values.join(", "));
    }

    var buffer = new Buffer(7);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x4c);
    buffer.writeUInt8(getValue(mode_map, mode));
    buffer.writeD2DCommand(d2d_cmd, "0000");
    buffer.writeUInt8(getValue(control_type_map, control_type));
    buffer.writeUInt8(getValue(alarm_type_map, alarm_type));
    return buffer.toBytes();
}

/**
 * set WiFi enable
 * @param {number} wifi_enable values: (0: disable, 1: enable)
 * @example { "wifi_enable": 1 }
 */
function setWiFiEnable(wifi_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(wifi_enable) === -1) {
        throw new Error("wifi_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x42);
    buffer.writeUInt8(getValue(enable_map, wifi_enable));
    return buffer.toBytes();
}

/**
 * set WiFi SSID hidden
 * @param {number} wifi_ssid_hidden values: (0: disable, 1: enable)
 * @example { "wifi_ssid_hidden": 0 }
 */
function setWiFiSSIDHidden(wifi_ssid_hidden) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(wifi_ssid_hidden) === -1) {
        throw new Error("wifi_ssid_hidden must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xf9);
    buffer.writeUInt8(0x4d);
    buffer.writeUInt8(getValue(enable_map, wifi_ssid_hidden));
    return buffer.toBytes();
}

/**
 * set device time
 * @param {number} timestamp unit: second, UTC time
 * @example payload: { "timestamp": 1628832309 }, output: FF1135021661
 */
function setTime(timestamp) {
    if (typeof timestamp !== "number") {
        throw new Error("timestamp must be a number");
    }
    var buffer = new Buffer(6);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x11);
    buffer.writeUInt32LE(timestamp);
    return buffer.toBytes();
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

function hexStringToBytes(hex) {
    var bytes = [];
    for (var c = 0; c < hex.length; c += 2) {
        bytes.push(parseInt(hex.substr(c, 2), 16));
    }
    return bytes;
}

function Buffer(size) {
    this.buffer = new Array(size);
    this.offset = 0;

    for (var i = 0; i < size; i++) {
        this.buffer[i] = 0;
    }
}

Buffer.prototype._write = function (value, byteLength, isLittleEndian) {
    for (var index = 0; index < byteLength; index++) {
        var shift = isLittleEndian ? index << 3 : (byteLength - 1 - index) << 3;
        this.buffer[this.offset + index] = (value & (0xff << shift)) >> shift;
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
        throw new Error("d2d_cmd length must be 4");
    }
    this.buffer[this.offset] = parseInt(value.substr(2, 2), 16);
    this.buffer[this.offset + 1] = parseInt(value.substr(0, 2), 16);
    this.offset += 2;
};

Buffer.prototype.writeBytes = function (bytes) {
    for (var i = 0; i < bytes.length; i++) {
        this.buffer[this.offset + i] = bytes[i];
    }
    this.offset += bytes.length;
};

Buffer.prototype.toBytes = function () {
    return this.buffer;
};
