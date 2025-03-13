/**
 * Payload Encoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product DS3604
 */
var RAW_VALUE = 0x00;

// Chirpstack v4
function encodeDownlink(input) {
    try {
        var encoded = milesightDeviceEncode(input.data);
        return {bytes: encoded};
    } catch (e) {
        return asErrors(e);
    }
}

// Chirpstack v3
function Encode(fPort, obj) {
    try {
        return milesightDeviceEncode(obj);
    } catch (e) {
        return asErrors(e);
    }
}

// The Things Network
function Encoder(obj, port) {
    try {
        return milesightDeviceEncode(obj);
    } catch (e) {
        return asErrors(e);
    }
}

function asErrors(e) {
    return {errors: [e.message]};
}

function milesightDeviceEncode(payload) {
    var encoded = [];

    if ("template_1" in payload) {
        encoded = encoded.concat(setText(1, payload.template_1));
    }
    if ("template_2" in payload) {
        encoded = encoded.concat(setText(2, payload.template_2));
    }
    if ("current_template_id" in payload) {
        encoded = encoded.concat(changeCurrentTemplate(payload.current_template_id));
    }
    if ("report_interval" in payload) {
        encoded = encoded.concat(setReportInterval(payload.report_interval));
    }
    if ("reboot" in payload) {
        encoded = encoded.concat(reboot(payload.reboot));
    }
    if ("beep" in payload) {
        encoded = encoded.concat(beep(payload.beep));
    }
    if ("refresh_display" in payload) {
        encoded = encoded.concat(refreshDisplay(payload.refresh_display));
    }
    if ("report_battery" in payload) {
        encoded = encoded.concat(reportBattery(payload.report_battery));
    }
    if ("report_buzzer" in payload) {
        encoded = encoded.concat(reportBuzzer(payload.report_buzzer));
    }
    if ("report_current_template_id" in payload) {
        encoded = encoded.concat(reportCurrentTemplate(payload.report_current_template_id));
    }
    if ("report_current_display" in payload) {
        encoded = encoded.concat(reportCurrentDisplay(payload.report_current_display));
    }
    if ("buzzer_enable" in payload) {
        encoded = encoded.concat(setBuzzerEnable(payload.buzzer_enable));
    }
    if ("button_visible" in payload) {
        encoded = encoded.concat(setButtonVisible(payload.button_visible));
    }
    if ("button_enable" in payload) {
        encoded = encoded.concat(setButtonEnable(payload.button_enable));
    }
    if ("block_visible" in payload) {
        encoded = encoded.concat(setBlockVisible(payload.block_visible));
    }
    if ("clear_image" in payload) {
        encoded = encoded.concat(clearImages(payload.clear_image));
    }
    if ("switch_template_button_enable" in payload) {
        encoded = encoded.concat(setSwitchTemplateButtonEnable(payload.switch_template_button_enable));
    }
    if ("multicast_config" in payload) {
        encoded = encoded.concat(setMulticastConfig(payload.multicast_config));
    }
    if ("template_1_config" in payload) {
        encoded = encoded.concat(setTemplateConfig(0, payload.template_1_config));
    }
    if ("template_2_config" in payload) {
        encoded = encoded.concat(setTemplateConfig(1, payload.template_2_config));
    }

    return encoded;
}

/**
 * update contents of template_x
 * @param {object} template_x keys: (template_1, template_2)
 * @param {string} template_x.text_x keys: (text_1, text_2, text_3, text_4, text_5, text_6, text_7, text_8, text_9, text_10)
 * @param {string} template_x.qrcode keys: (qrcode)
 * @example { "template_1": { "text_1": "Hello", "qrcode": "https://www.milesight.com" } }
 * @example { "template_2": { "text_1": "Hello", "text_2": "World" } }
 */
function setText(template_id, contents) {
    var template_values = [1, 2];
    var content_id_map = { text_1: 0, text_2: 1, text_3: 2, text_4: 3, text_5: 4, text_6: 5, text_7: 6, text_8: 7, text_9: 8, text_10: 9, qrcode: 10 };

    if (template_values.indexOf(template_id) === -1) {
        throw new Error("template_id must be one of " + template_values.join(", "));
        return [];
    }

    var encoded = [];
    for (var key in content_id_map) {
        if (key in contents) {
            encoded = encoded.concat(encodeContent(template_id - 1, content_id_map[key], contents[key]));
        }
    }

    return encoded;
}

/**
 * change current template
 * @param {number} current_template_id values: (1: template_1, 2: template_2)
 * @example { "current_template_id": 1 }
 */
function changeCurrentTemplate(current_template_id) {
    var template_values = [1, 2];
    if (template_values.indexOf(current_template_id) === -1) {
        throw new Error("current_template_id must be one of " + template_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x73);
    buffer.writeUInt8(current_template_id - 1);
    return buffer.toBytes();
}

/**
 * set report interval
 * @param {number} report_interval unit: second
 * @example { "report_interval": 600 }
 */
function setReportInterval(report_interval) {
    if (typeof report_interval !== "number") {
        throw new Error("report_interval must be a number");
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x03);
    buffer.writeUInt16LE(report_interval);
    return buffer.toBytes();
}

/**
 * reboot
 * @param {number} reboot values: (0: no, 1: yes)
 * @example { "reboot": 1 }
 */
function reboot(reboot) {
    var reboot_map = { 0: "no", 1: "yes" };
    var reboot_values = getValues(reboot_map);
    if (reboot_values.indexOf(reboot) === -1) {
        throw new Error("reboot must be one of " + reboot_values.join(", "));
    }

    if (getValue(reboot_map, reboot) === 0) {
        return [];
    }
    return [0xff, 0x10, 0xff];
}

/**
 * beep
 * @param {number} beep values: (0: no, 1: yes)
 * @example { "beep": 1 }
 */
function beep(beep) {
    var beep_map = { 0: "no", 1: "yes" };
    var beep_values = getValues(beep_map);
    if (beep_values.indexOf(beep) === -1) {
        throw new Error("beep must be one of " + beep_values.join(", "));
    }

    if (getValue(beep_map, beep) === 0) {
        return [];
    }
    return [0xff, 0x3d, 0x01];
}

/**
 * refresh display
 * @param {number} refresh_display values: (0: no, 1: yes)
 * @example { "refresh_display": 1 }
 */
function refreshDisplay(refresh_display) {
    var refresh_display_map = { 0: "no", 1: "yes" };
    var refresh_display_values = getValues(refresh_display_map);
    if (refresh_display_values.indexOf(refresh_display) === -1) {
        throw new Error("refresh_display must be one of " + refresh_display_values.join(", "));
    }

    if (getValue(refresh_display_map, refresh_display) === 0) {
        return [];
    }
    return [0xff, 0x3d, 0x02];
}

/**
 * report battery
 * @param {number} report_battery values: (0: no, 1: yes)
 * @example { "report_battery": 1 }
 */
function reportBattery(report_battery) {
    var report_battery_map = { 0: "no", 1: "yes" };
    var report_battery_values = getValues(report_battery_map);
    if (report_battery_values.indexOf(report_battery) === -1) {
        throw new Error("report_battery must be one of " + report_battery_values.join(", "));
    }

    if (getValue(report_battery_map, report_battery) === 0) {
        return [];
    }
    return [0xff, 0x28, 0x00];
}

/**
 * report buzzer
 * @param {number} report_buzzer values: (0: no, 1: yes)
 * @example { "report_buzzer": 1 }
 */
function reportBuzzer(report_buzzer) {
    var report_buzzer_map = { 0: "no", 1: "yes" };
    var report_buzzer_values = getValues(report_buzzer_map);
    if (report_buzzer_values.indexOf(report_buzzer) === -1) {
        throw new Error("report_buzzer must be one of " + report_buzzer_values.join(", "));
    }

    if (getValue(report_buzzer_map, report_buzzer) === 0) {
        return [];
    }
    return [0xff, 0x28, 0x01];
}

/**
 * report current template
 * @param {number} report_current_template_id values: (0: no, 1: yes)
 * @example { "report_current_template_id": 1 }
 */
function reportCurrentTemplate(report_current_template_id) {
    var report_current_template_id_map = { 0: "no", 1: "yes" };
    var report_current_template_id_values = getValues(report_current_template_id_map);
    if (report_current_template_id_values.indexOf(report_current_template_id) === -1) {
        throw new Error("report_current_template_id must be one of " + report_current_template_id_values.join(", "));
    }

    if (getValue(report_current_template_id_map, report_current_template_id) === 0) {
        return [];
    }
    return [0xff, 0x28, 0x02];
}

/**
 * report current display
 * @param {number} report_current_display values: (0: no, 1: yes)
 * @example { "report_current_display": 1 }
 */
function reportCurrentDisplay(report_current_display) {
    var report_current_display_map = { 0: "no", 1: "yes" };
    var report_current_display_values = getValues(report_current_display_map);
    if (report_current_display_values.indexOf(report_current_display) === -1) {
        throw new Error("report_current_display must be one of " + report_current_display_values.join(", "));
    }

    if (getValue(report_current_display_map, report_current_display) === 0) {
        return [];
    }
    return [0xff, 0x28, 0x03];
}

/**
 * set buzzer enable
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
 * set button visible
 * @param {number} button_visible values: (0: hide, 1: show)
 * @example { "button_visible": 1 }
 */
function setButtonVisible(button_visible) {
    var button_visible_map = { 0: "hide", 1: "show" };
    var button_visible_values = getValues(button_visible_map);
    if (button_visible_values.indexOf(button_visible) === -1) {
        throw new Error("button_visible must be one of " + button_visible_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x66);
    buffer.writeUInt8(getValue(button_visible_map, button_visible));
    return buffer.toBytes();
}

/**
 * set button enable
 * @param {number} button_enable values: (0: disable, 1: enable)
 * @example { "button_enable": 1 }
 */
function setButtonEnable(button_enable) {
    var button_enable_map = { 0: "disable", 1: "enable" };
    var button_enable_values = getValues(button_enable_map);
    if (button_enable_values.indexOf(button_enable) === -1) {
        throw new Error("button_enable must be one of " + button_enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x25);
    buffer.writeUInt8(getValue(button_enable_map, button_enable));
    return buffer.toBytes();
}

/**
 * set block visible
 * @param {object} block_visible
 * @param {number} block_visible.text_x values: (0: hide, 1: show)
 * @param {number} block_visible.qrcode values: (0: hide, 1: show)
 * @param {number} block_visible.image_x values: (0: hide, 1: show)
 * @param {number} block_visible.battery_status values: (0: hide, 1: show)
 * @param {number} block_visible.connect_status values: (0: hide, 1: show)
 * @example { "block_visible": { "text_1": 1, "text_2": 0, "qrcode": 1, "image_1": 0, "battery_status": 1, "connect_status": 0 } }
 */
function setBlockVisible(block_visible) {
    var visible_map = { 0: "hide", 1: "show" };
    var visible_values = getValues(visible_map);

    var masked = 0x00;
    var data = 0x00;
    var block_bits_offset = { text_1: 0, text_2: 1, text_3: 2, text_4: 3, text_5: 4, text_6: 5, text_7: 6, text_8: 7, text_9: 8, text_10: 9, qrcode: 10, image_1: 11, image_2: 12, battery_status: 13, connect_status: 14 };
    for (var key in block_bits_offset) {
        if (key in block_visible) {
            masked |= 1 << block_bits_offset[key];
            data |= getValue(visible_map, block_visible[key]) << block_bits_offset[key];
        }
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x89);
    buffer.writeUInt8(0x02);
    buffer.writeUInt8(masked);
    buffer.writeUInt8(data);
    return buffer.toBytes();
}

/**
 *
 * @param {object} clear_image
 * @param {number} clear_image.background_image values: (0: no, 1: yes)
 * @param {number} clear_image.logo_1 values: (0: no, 1: yes)
 * @param {number} clear_image.logo_2 values: (0: no, 1: yes)
 * @example { "clear_image": { "background_image": 1, "logo_1": 0, "logo_2": 1 } }
 */
function clearImages(clear_image) {
    var background_image = clear_image.background_image;
    var logo_1 = clear_image.logo_1;
    var logo_2 = clear_image.logo_2;

    var data = 0x00;
    var yes_no_map = { 0: "no", 1: "yes" };
    var yes_no_values = getValues(yes_no_map);
    if ("background_image" in clear_image) {
        if (yes_no_values.indexOf(background_image) === -1) {
            throw new Error("clear_image.background_image must be one of " + yes_no_values.join(", "));
        }
        data |= 1 << 4;
    }
    if ("logo_1" in clear_image) {
        if (yes_no_values.indexOf(logo_1) === -1) {
            throw new Error("clear_image.logo_1 must be one of " + yes_no_values.join(", "));
        }
        data |= 1 << 5;
        data |= getValue(yes_no_map, logo_1) << 0;
    }
    if ("logo_2" in clear_image) {
        if (yes_no_values.indexOf(logo_2) === -1) {
            throw new Error("clear_image.logo_2 must be one of " + yes_no_values.join(", "));
        }
        data |= 1 << 5;
        data |= getValue(yes_no_map, logo_2) << 1;
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x27);
    buffer.writeUInt8(data);
    return buffer.toBytes();
}

/**
 * set switch template button enable
 * @param {number} switch_template_button_enable values: (0: disable, 1: enable)
 * @example { "switch_template_button_enable": 1 }
 */
function setSwitchTemplateButtonEnable(switch_template_button_enable) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    if (enable_values.indexOf(switch_template_button_enable) === -1) {
        throw new Error("switch_template_button_enable must be one of " + enable_values.join(", "));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x90);
    buffer.writeUInt8(getValue(enable_map, switch_template_button_enable));
    return buffer.toBytes();
}

/**
 * set multicast config
 * @param {object} multicast_config
 * @param {number} multicast_config.group_1 values: (0: disable, 1: enable)
 * @param {number} multicast_config.group_2 values: (0: disable, 1: enable)
 * @param {number} multicast_config.group_3 values: (0: disable, 1: enable)
 * @param {number} multicast_config.group_4 values: (0: disable, 1: enable)
 * @example { "multicast_config": { "group_1": 1, "group_2": 0, "group_3": 1, "group_4": 0 } }
 */
function setMulticastConfig(multicast_config) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    
    var data = 0;
    var group_offset = { group_1: 0, group_2: 1, group_3: 2, group_4: 3 };
    for (var key in group_offset) {
        if (key in multicast_config) {
            if (enable_values.indexOf(multicast_config[key]) === -1) {
                throw new Error("multicast_config." + key + " must be one of " + enable_values.join(", "));
            }
            if (getValue(enable_map, multicast_config[key]) === 0) {
                continue;
            }
            data |= 1 << (group_offset[key] + 4);
            data |= getValue(enable_map, multicast_config[key]) << 0;
        }
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(0xff);
    buffer.writeUInt8(0x82);
    buffer.writeUInt8(data);
    return buffer.toBytes();
}

function encodeContent(template_id, content_id, content) {
    var bytes = encodeUtf8(content);

    var data = 0x00;
    data |= template_id << 6;
    data |= content_id << 0;

    var buffer = new Buffer(4 + bytes.length);
    buffer.writeUInt8(0xfb);
    buffer.writeUInt8(0x01); // content
    buffer.writeUInt8(data);
    buffer.writeUInt8(bytes.length);
    buffer.writeBytes(bytes);
    return buffer.toBytes();
}

/**
 * set template
 * @param {number} template_id values: (0: template_1, 1: template_2)
 * @param {object} template_config
 * @param {object} template_config.text_1 text_1 config
 * @param {number} template_config.text_1.enable enable values: (0: disable, 1: enable)
 * @param {number} template_config.text_1.type type values: (0: text, 1: qrcode, 2: image, 3: battery_status, 4: connect_status)
 * @param {number} template_config.text_1.start_x start_x
 * @param {number} template_config.text_1.start_y start_y
 * @param {number} template_config.text_1.end_x end_x
 * @param {number} template_config.text_1.end_y end_y
 * @param {number} template_config.text_1.border border values: (0: no, 1: yes)
 * @param {number} template_config.text_1.horizontal horizontal values: (0: left, 1: center, 2: right)
 * @param {number} template_config.text_1.vertical vertical values: (0: top, 1: center, 2: bottom)
 * @param {number} template_config.text_1.background background values: (0: white, 1: black, 2: red)
 * @param {number} template_config.text_1.foreground foreground values: (0: white, 1: black, 2: red)
 * @param {number} template_config.text_1.layer layer
 * @param {number} template_config.text_1.font_type font type, values: (1: SONG, 2: FANG, 3: BLACK, 4: KAI, 5: FT_ASCII, 6: DZ_ASCII, 7: CH_ASCII, 8: BX_ASCII, 9: BZ_ASCII, 10: FX_ASCII, 11: GD_ASCII, 12: HZ_ASCII, 13: MS_ASCII, 14: SX_ASCII, 15: ZY_ASCII, 16: TM_ASCII, 17: YJ_LATIN, 18: CYRILLIC, 19: KSC5601, 20: JIS0208_HT, 21: ARABIC, 22: THAI, 23: GREEK, 24: HEBREW)
 * @param {number} template_config.text_1.font_size font size, values: (16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120, 128, 136, 144, 152, 160, 168, 176, 184, 192)
 * @param {number} template_config.text_1.wrap wrap values: (0: disable, 1: enable)
 * @param {number} template_config.text_1.font_style font style values: (0: normal, 1: bold)
 * @example { "template_1_config": { "text_1": { "enable": 1, "type": "text", "start_x": 0, "start_y": 0, "end_x": 100, "end_y": 100, "border": 0, "horizontal": 0, "vertical": 0, "background": 0, "foreground": 0, "layer": 1, "font_type": 1, "font_size": 16, "wrap": 1, "font_style": 1 } } }
 */
function setTemplateConfig(template_id, template_config) {
    var template_values = [0, 1];
    if (template_values.indexOf(template_id) === -1) {
        throw new Error("template_id must be one of " + template_values.join(", "));
    }

    var text_block_offset = { text_1: 0, text_2: 1, text_3: 2, text_4: 3, text_5: 4, text_6: 5, text_7: 6, text_8: 7, text_9: 8, text_10: 9 };
    var qrcode_offset = { qrcode: 10 };
    var image_block_offset = { image_1: 11, image_2: 12 };
    var battery_status_offset = { battery_status: 13 };
    var connect_status_offset = { connect_status: 14 };

    var data = [];
    for (var key in template_config) {
        var ctl = 0x00;
        ctl |= template_id << 6;
        ctl |= text_block_offset[key];

        if (key in text_block_offset) {
            data = data.concat([0xFB, 0x03, ctl, 25]);
            data = data.concat(encodedBasicBlock(template_id, text_block_offset[key], key, template_config[key]));
            data = data.concat(encodeFont(template_config[key].font_type, template_config[key].font_size, template_config[key].wrap, template_config[key].font_style));
        }
        if (key in qrcode_offset) {
            data = data.concat([0xFB, 0x03, ctl, 22]);
            data = data.concat(encodedBasicBlock(template_id, qrcode_offset[key], key, template_config[key]));
            data = data.concat([0x00]); // default qrcode codec
        }
        if (key in image_block_offset) {
            data = data.concat([0xFB, 0x03, ctl, 22]);
            data = data.concat(encodedBasicBlock(template_id, image_block_offset[key], key, template_config[key]));
            data = data.concat([0x00]); // default image codec (lzss)
        }
        if (key in battery_status_offset) {
            data = data.concat([0xFB, 0x03, ctl, 21]);
            data = data.concat(encodedBasicBlock(template_id, battery_status_offset[key], key, template_config[key]));
        }
        if (key in connect_status_offset) {
            data = data.concat([0xFB, 0x03, ctl, 21]);
            data = data.concat(encodedBasicBlock(template_id, connect_status_offset[key], key, template_config[key]));
        }
    }

    return data;
}

function encodedBasicBlock(template_id, block_id, block_name, config) {
    var enable = config.enable;
    var type = config.type;
    var start_x = config.start_x;
    var start_y = config.start_y;
    var end_x = config.end_x;
    var end_y = config.end_y;
    var border = config.border;
    var horizontal = config.horizontal;
    var vertical = config.vertical;
    var background = config.background;
    var foreground = config.foreground;
    var layer = config.layer;

    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    var data_type_map = { 0: "text", 1: "qrcode", 2: "image", 3: "battery_status", 4: "connect_status" };
    var data_type_values = getValues(data_type_map);
    var border_type_map = { 0: "no", 1: "yes" };
    var border_type_values = getValues(border_type_map);
    var horizontal_map = { 0: "left", 1: "center", 2: "right" };
    var horizontal_values = getValues(horizontal_map);
    var vertical_map = { 0: "top", 1: "center", 2: "bottom" };
    var vertical_values = getValues(vertical_map);
    var color_map = { 0: "white", 1: "black", 2: "red" };
    var color_values = getValues(color_map);

    if (enable_values.indexOf(enable) === -1) {
        throw new Error("template_" + template_id + "_config." + block_name + ".enable must be one of " + enable_values.join(", "));
    }
    if (data_type_values.indexOf(type) === -1) {
        throw new Error("template_" + template_id + "_config." + block_name + ".type must be one of " + data_type_values.join(", "));
    }
    if (border_type_values.indexOf(border) === -1) {
        throw new Error("template_" + template_id + "_config." + block_name + ".border must be one of " + border_type_values.join(", "));
    }
    if (horizontal_values.indexOf(horizontal) === -1) {
        throw new Error("template_" + template_id + "_config." + block_name + ".horizontal must be one of " + horizontal_values.join(", "));
    }
    if (vertical_values.indexOf(vertical) === -1) {
        throw new Error("template_" + template_id + "_config." + block_name + ".vertical must be one of " + vertical_values.join(", "));
    }
    if (color_values.indexOf(background) === -1) {
        throw new Error("template_" + template_id + "_config." + block_name + ".background must be one of " + color_values.join(", "));
    }
    if (color_values.indexOf(foreground) === -1) {
        throw new Error("template_" + template_id + "_config." + block_name + ".foreground must be one of " + color_values.join(", "));
    }
    if (layer < 0 || layer > 255) {
        throw new Error("template_" + template_id + "_config." + block_name + ".layer must be between 0 and 255");
    }

    var buffer = new Buffer(21);
    buffer.writeUInt8(getValue(enable_map, enable));
    buffer.writeUInt8(getValue(data_type_map, type));
    buffer.writeUInt16LE(start_x);
    buffer.writeUInt16LE(start_y);
    buffer.writeUInt16LE(end_x);
    buffer.writeUInt16LE(end_y);
    buffer.writeUInt8(getValue(border_type_map, border));
    buffer.writeUInt8(getValue(horizontal_map, horizontal));
    buffer.writeUInt8(getValue(vertical_map, vertical));
    buffer.writeUInt8(getValue(color_map, background));
    buffer.writeUInt8(getValue(color_map, foreground));
    buffer.writeUInt8(0x00);
    buffer.writeUInt8(layer);
    buffer.writeUInt32LE(0x00);
    return buffer.toBytes();
}

/**
 * encode font
 * @param {number} font_type font type, values: (1: SONG, 2: FANG, 3: BLACK, 4: KAI, 5: FT_ASCII, 6: DZ_ASCII, 7: CH_ASCII, 8: BX_ASCII, 9: BZ_ASCII, 10: FX_ASCII, 11: GD_ASCII, 12: HZ_ASCII, 13: MS_ASCII, 14: SX_ASCII, 15: ZY_ASCII, 16: TM_ASCII, 17: YJ_LATIN, 18: CYRILLIC, 19: KSC5601, 20: JIS0208_HT, 21: ARABIC, 22: THAI, 23: GREEK, 24: HEBREW)
 * @param {number} font_size font size, values: (16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120, 128, 136, 144, 152, 160, 168, 176, 184, 192)
 * @param {number} wrap wrap values: (0: disable, 1: enable)
 * @param {number} font_style font style values: (0: normal, 1: bold)
 * @example { "font_type": 1, "font_size": 16, "wrap": 1, "font_style": 1 }
 */
function encodeFont(font_type, font_size, wrap, font_style) {
    var enable_map = { 0: "disable", 1: "enable" };
    var enable_values = getValues(enable_map);
    var style_map = { 0: "normal", 1: "bold" };
    var style_values = getValues(style_map);

    if (enable_values.indexOf(wrap) === -1) {
        throw new Error("wrap must be one of " + enable_values.join(", "));
    }
    if (style_values.indexOf(font_style) === -1) {
        throw new Error("font_style must be one of " + style_values.join(", "));
    }
    var buffer = new Buffer(4);
    buffer.writeUInt8(font_type);
    buffer.writeUInt8(font_size);
    buffer.writeUInt8(getValue(enable_map, wrap));
    buffer.writeUInt8(getValue(style_map, font_style));
    return buffer.toBytes();
}

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

Buffer.prototype.writeBytes = function (bytes) {
    for (var i = 0; i < bytes.length; i++) {
        this.buffer[this.offset + i] = bytes[i];
    }
    this.offset += bytes.length;
};

Buffer.prototype.toBytes = function () {
    return this.buffer;
};
