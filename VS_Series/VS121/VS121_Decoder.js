/**
 * Payload Decoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product VS121
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

        // PROTOCOL VERSION
        if (channel_id === 0xff && channel_type === 0x01) {
            decoded.protocol_version = bytes[i];
            i += 1;
        }
        // SERIAL NUMBER
        else if (channel_id === 0xff && channel_type === 0x08) {
            decoded.sn = readSerialNumber(bytes.slice(i, i + 6));
            i += 6;
        }
        // HARDWARE VERSION
        else if (channel_id === 0xff && channel_type === 0x09) {
            decoded.hardware_version = readVersion(bytes.slice(i, i + 2));
            i += 2;
        }
        // FIRMWARE VERSION
        else if (channel_id === 0xff && channel_type === 0x1f) {
            decoded.firmware_version = readVersion(bytes.slice(i, i + 4));
            i += 4;
        }
        // PEOPLE COUNTER
        else if (channel_id === 0x04 && channel_type === 0xc9) {
            decoded.people_count_all = bytes[i];
            decoded.region_count = bytes[i + 1];
            var region = readUInt16BE(bytes.slice(i + 2, i + 4));
            for (var idx = 0; idx < decoded.region_count; idx++) {
                var tmp = "region_" + (idx + 1);
                decoded[tmp] = (region >> idx) & 1;
            }
            i += 4;
        }
        // PEOPLE IN/OUT
        else if (channel_id === 0x05 && channel_type === 0xcc) {
            decoded.people_in = readInt16LE(bytes.slice(i, i + 2));
            decoded.people_out = readInt16LE(bytes.slice(i + 2, i + 4));
            i += 4;
        }
        // PEOPLE MAX
        else if (channel_id === 0x06 && channel_type === 0xcd) {
            decoded.people_count_max = bytes[i];
            i += 1;
        }
        // REGION COUNTER
        else if (channel_id === 0x07 && channel_type === 0xd5) {
            decoded.region_1_count = bytes[i];
            decoded.region_2_count = bytes[i + 1];
            decoded.region_3_count = bytes[i + 2];
            decoded.region_4_count = bytes[i + 3];
            decoded.region_5_count = bytes[i + 4];
            decoded.region_6_count = bytes[i + 5];
            decoded.region_7_count = bytes[i + 6];
            decoded.region_8_count = bytes[i + 7];
            i += 8;
        }
        // REGION COUNTER
        else if (channel_id === 0x08 && channel_type === 0xd5) {
            decoded.region_9_count = bytes[i];
            decoded.region_10_count = bytes[i + 1];
            decoded.region_11_count = bytes[i + 2];
            decoded.region_12_count = bytes[i + 3];
            decoded.region_13_count = bytes[i + 4];
            decoded.region_14_count = bytes[i + 5];
            decoded.region_15_count = bytes[i + 6];
            decoded.region_16_count = bytes[i + 7];
            i += 8;
        }
        // A FLOW
        else if (channel_id === 0x09 && channel_type === 0xda) {
            decoded.a_to_a = readUInt16LE(bytes.slice(i, i + 2));
            decoded.a_to_b = readUInt16LE(bytes.slice(i + 2, i + 4));
            decoded.a_to_c = readUInt16LE(bytes.slice(i + 4, i + 6));
            decoded.a_to_d = readUInt16LE(bytes.slice(i + 6, i + 8));
            i += 8;
        }
        // B FLOW
        else if (channel_id === 0x0a && channel_type === 0xda) {
            decoded.b_to_a = readUInt16LE(bytes.slice(i, i + 2));
            decoded.b_to_b = readUInt16LE(bytes.slice(i + 2, i + 4));
            decoded.b_to_c = readUInt16LE(bytes.slice(i + 4, i + 6));
            decoded.b_to_d = readUInt16LE(bytes.slice(i + 6, i + 8));
            i += 8;
        }
        // C FLOW
        else if (channel_id === 0x0b && channel_type === 0xda) {
            decoded.c_to_a = readUInt16LE(bytes.slice(i, i + 2));
            decoded.c_to_b = readUInt16LE(bytes.slice(i + 2, i + 4));
            decoded.c_to_c = readUInt16LE(bytes.slice(i + 4, i + 6));
            decoded.c_to_d = readUInt16LE(bytes.slice(i + 6, i + 8));
            i += 8;
        }
        // D FLOW
        else if (channel_id === 0x0c && channel_type === 0xda) {
            decoded.d_to_a = readUInt16LE(bytes.slice(i, i + 2));
            decoded.d_to_b = readUInt16LE(bytes.slice(i + 2, i + 4));
            decoded.d_to_c = readUInt16LE(bytes.slice(i + 4, i + 6));
            decoded.d_to_d = readUInt16LE(bytes.slice(i + 6, i + 8));
            i += 8;
        }
        // TOTAL IN/OUT
        else if (channel_id === 0x0d && channel_type === 0xcc) {
            decoded.people_total_in = readUInt16LE(bytes.slice(i, i + 2));
            decoded.people_total_out = readUInt16LE(bytes.slice(i + 2, i + 4));
            i += 4;
        }
        // DWELL TIME
        else if (channel_id === 0x0e && channel_type === 0xe4) {
            var region = bytes[i];
            // decoded.region = region;
            decoded.dwell_time_avg = readUInt16LE(bytes.slice(i + 1, i + 3));
            decoded.dwell_time_max = readUInt16LE(bytes.slice(i + 3, i + 5));
            i += 5;
        }
        // TIMESTAMP
        else if (channel_id === 0x0f && channel_type === 0x85) {
            decoded.timestamp = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // LINE IN/OUT (@v7.0.85)
        else if (channel_id === 0x10 && channel_type === 0xf7) {
            decoded.line_in = readUInt16LE(bytes.slice(i, i + 2));
            decoded.line_out = readUInt16LE(bytes.slice(i + 2, i + 4));
            i += 4;
        }
        // HISTORY DATA
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var result = readHistoryData(bytes, i);
            i = result.offset;
            decoded.history = decoded.history || [];
            decoded.history.push(result.data);
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
            decoded.from_now_on_report_interval = readUInt16LE(bytes.slice(offset, offset + 2));
            offset += 2;
            break;
        case 0x04:
            decoded.confirm_mode_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x10:
            decoded.reboot = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x35:
            decoded.d2d_key = bytesToHexString(bytes.slice(offset, offset + 8));
            offset += 8;
            break;
        case 0x40:
            decoded.adr_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x43:
            decoded.report_regularly_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x44:
            decoded.people_count_change_report_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x45:
            decoded.people_counting_report_mode = readPeopleCountingReportMode(bytes[offset]);
            offset += 1;
            break;
        case 0x46:
            decoded.people_count_jitter_config = {};
            decoded.people_count_jitter_config.enable = readEnableStatus(bytes[offset]);
            decoded.people_count_jitter_config.time = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            offset += 3;
            break;
        case 0x48:
            decoded.line_detect_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x50:
            decoded.region_people_counting_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x51:
            decoded.clear_cumulative_count = readYesNoStatus(1);
            offset += 1;
            break
        case 0x84:
            decoded.d2d_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        default:
            throw new Error("unknown downlink response");
    }

    return { data: decoded, offset: offset };
}


function handle_downlink_response_ext(code, channel_type, bytes, offset) {
    var decoded = {};

    switch (channel_type) {
        case 0x10:
            decoded.periodic_report_scheme = readPeriodicReportScheme(bytes[offset]);
            offset += 1;
            break;
        case 0x11:
            decoded.on_the_dot_report_interval = readOnTheDotReportInterval(bytes[offset]);
            offset += 1;
            break;
        case 0x3d:
            decoded.line_detect_report_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x85:
            decoded.rejoin_config = {};
            decoded.rejoin_config.enable = readEnableStatus(bytes[offset]);
            decoded.rejoin_config.max_count = readUInt8(bytes[offset + 1]);
            offset += 2;
            break;
        case 0x86:
            decoded.data_rate = readUInt8(bytes[offset]);
            offset += 1;
            break;
        case 0x87:
            decoded.tx_power_level = readUInt8(bytes[offset]);
            offset += 1;
            break;
        case 0x88:
            decoded.log_level = readLogLevel(bytes[offset]);
            offset += 1;
            break;
        case 0x8b:
            decoded.lorawan_version = readLoRaWANVersion(bytes[offset]);
            offset += 1;
            break;
        case 0x8c:
            decoded.rx2_data_rate = readUInt8(bytes[offset]);
            offset += 1;
            break;
        case 0x8d:
            decoded.rx2_frequency = readUInt32LE(bytes.slice(offset, offset + 4));
            offset += 4;
            break;
        case 0x8e:
            decoded.d2d_occupied_config = {};
            decoded.d2d_occupied_config.region = readUInt8(bytes[offset]) + 1;
            decoded.d2d_occupied_config.enable = readEnableStatus(bytes[offset + 1]);
            decoded.d2d_occupied_config.command = readD2DCommand(bytes.slice(offset + 2, offset + 4));
            offset += 4;
            break;
        case 0x90:
            decoded.d2d_vacant_config = {};
            decoded.d2d_vacant_config.region = readUInt8(bytes[offset]) + 1;
            decoded.d2d_vacant_config.enable = readEnableStatus(bytes[offset + 1]);
            decoded.d2d_vacant_config.command = readD2DCommand(bytes.slice(offset + 2, offset + 4));
            decoded.d2d_vacant_config.delay_time = readUInt16LE(bytes.slice(offset + 4, offset + 6));
            offset += 6;
            break;
        case 0x91:
            decoded.time_config = {};
            decoded.time_config.mode = readTimeConfigMode(bytes[offset]);
            decoded.time_config.timestamp = readUInt32LE(bytes.slice(offset + 1, offset + 5));
            offset += 5;
            break;
        case 0x92:
            decoded.region_people_counting_dwell_config = {};
            decoded.region_people_counting_dwell_config.enable = readEnableStatus(bytes[offset]);
            decoded.region_people_counting_dwell_config.min_dwell_time = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            offset += 3;
            break;
        case 0x93:
            decoded.report_with_timestamp = readYesNoStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x94:
            decoded.timed_reset_cumulative_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x95:
            var reset_cumulative_schedule = {};
            reset_cumulative_schedule.mode = readResetCumulativeScheduleMode(bytes[offset]);
            reset_cumulative_schedule.index = readUInt8(bytes[offset + 1]) + 1;
            var week_mask = readUInt8(bytes[offset + 2]);
            reset_cumulative_schedule.week_cycle = {};
            var week_offset_bitmap = { "sun": 0, "mon": 1, "tue": 2, "wed": 3, "thu": 4, "fri": 5, "sat": 6 };
            for (var key in week_offset_bitmap) {
                reset_cumulative_schedule.week_cycle[key] = readEnableStatus((week_mask >> week_offset_bitmap[key]) & 1);
            }
            reset_cumulative_schedule.time = readUInt24LE(bytes.slice(offset + 3, offset + 6));
            offset += 6;
            decoded.reset_cumulative_schedule = decoded.reset_cumulative_schedule || [];
            decoded.reset_cumulative_schedule.push(reset_cumulative_schedule);
            break;
        case 0x96:
            decoded.detect_region_config = {};
            decoded.detect_region_config.enable = readEnableStatus(bytes[offset]);
            decoded.detect_region_config.detection_type = readDetectionType(bytes[offset + 1]);
            decoded.detect_region_config.reporting_type = readReportingType(bytes[offset + 2]);
            offset += 3;
            break;
        case 0x97:
            decoded.time_schedule_config = {};
            decoded.time_schedule_config.enable = readEnableStatus(bytes[offset]);
            decoded.time_schedule_config.people_counting_type = readPeopleCountingType(bytes[offset + 1]);
            offset += 2;
            break;
        case 0x98:
            decoded.filter_u_turn_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x99:
            var time_schedule = {};
            time_schedule.people_counting_type = readPeopleCountingType(bytes[offset]);
            time_schedule.period = readUInt8(bytes[offset + 1]) + 1;
            time_schedule.weekday = readWeekday(readUInt8(bytes[offset + 2]));
            time_schedule.start_hour = readUInt8(bytes[offset + 3]);
            time_schedule.start_minute = readUInt8(bytes[offset + 4]);
            time_schedule.end_hour = readUInt8(bytes[offset + 5]);
            time_schedule.end_minute = readUInt8(bytes[offset + 6]);
            offset += 7;
            decoded.time_schedule = decoded.time_schedule || [];
            decoded.time_schedule.push(time_schedule);
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

function hasResultFlag(code) {
    return code === 0xf8;
}

function readResultStatus(status) {
    var status_map = { 0: "success", 1: "forbidden", 2: "invalid parameter" };
    return getValue(status_map, status);
}

function readVersion(bytes) {
    var temp = [];
    for (var idx = 0; idx < bytes.length; idx++) {
        temp.push((bytes[idx] & 0xff).toString(10));
    }
    return temp.join(".");
}

function readSerialNumber(bytes) {
    var temp = [];
    for (var idx = 0; idx < bytes.length; idx++) {
        temp.push(("0" + (bytes[idx] & 0xff).toString(16)).slice(-2));
    }
    return temp.join("");
}

function readYesNoStatus(value) {
    var yes_no_map = { 0: "no", 1: "yes" };
    return getValue(yes_no_map, value);
}

function readEnableStatus(status) {
    var enable_status_map = { 0: "disable", 1: "enable" };
    return getValue(enable_status_map, status);
}

function readPeopleCountingReportMode(mode) {
    var mode_map = { 0: "zero_to_nonzero", 1: "once_result_change" };
    return getValue(mode_map, mode);
}

function readLogLevel(level) {
    var level_map = { 2: "error", 4: "debug" };
    return getValue(level_map, level);
}

function readLoRaWANVersion(version) {
    var lorawan_version_map = { 1: "v1.0.2", 2: "v1.0.3" };
    return getValue(lorawan_version_map, version);
}

function readTimeConfigMode(mode) {
    var mode_map = { 0: "sync_from_gateway", 1: "manual" };
    return getValue(mode_map, mode);
}

function readPeriodicReportScheme(scheme) {
    var scheme_map = { 0: "on_the_dot", 1: "from_now_on" };
    return getValue(scheme_map, scheme);
}

function readOnTheDotReportInterval(type) {
    var interval_map = { 0: "5min", 1: "10min", 2: "15min", 3: "30min", 4: "1h", 5: "4h", 6: "6h", 7: "8h", 8: "12h" };
    return getValue(interval_map, type);
}

function readResetCumulativeScheduleMode(mode) {
    var mode_map = { 0: "modify", 1: "add", 2: "delete" };
    return getValue(mode_map, mode);
}

function readDetectionType(type) {
    var type_map = { 0: "mapped_region", 1: "unmapped_region" };
    return getValue(type_map, type);
}

function readReportingType(type) {
    var type_map = { 0: "occupancy", 1: "region_people_counting" };
    return getValue(type_map, type);
}

function readPeopleCountingType(type) {
    var type_map = { 0: "region_people_counting", 1: "line_crossing_counting", 2: "people_flow_analysis" };
    return getValue(type_map, type);
}

function readWeekday(weekday) {
    var weekday_map = { 0: "sun", 1: "mon", 2: "tue", 3: "wed", 4: "thu", 5: "fri", 6: "sat" };
    return getValue(weekday_map, weekday);
}

function readHistoryData(bytes, offset) {
    var data = {};
    data.timestamp = readUInt32LE(bytes.slice(offset, offset + 4));
    var data_type = readUInt8(bytes[offset + 4]);
    offset += 5;

    switch (data_type) {
        case 0x01:
            data.people_count_all = readUInt8(bytes[offset]);
            data.region_count = readUInt8(bytes[offset + 1]);
            var region = readUInt16BE(bytes.slice(offset + 2, offset + 4));
            for (var idx = 0; idx < data.region_count; idx++) {
                var tmp = "region_" + (idx + 1);
                data[tmp] = (region >> idx) & 1;
            }
            offset += 4;
            break;
        case 0x02:
            data.people_in = readUInt16LE(bytes.slice(offset, offset + 2));
            data.people_out = readUInt16LE(bytes.slice(offset + 2, offset + 4));
            offset += 4;
            break;
        case 0x03:
            data.people_count_max = readUInt8(bytes[offset]);
            offset += 1;
            break;
        case 0x04:
            data.region_1_count = readUInt8(bytes[offset]);
            data.region_2_count = readUInt8(bytes[offset + 1]);
            data.region_3_count = readUInt8(bytes[offset + 2]);
            data.region_4_count = readUInt8(bytes[offset + 3]);
            offset += 4;
            break;
        case 0x05:
            data.region_5_count = readUInt8(bytes[offset]);
            data.region_6_count = readUInt8(bytes[offset + 1]);
            data.region_7_count = readUInt8(bytes[offset + 2]);
            data.region_8_count = readUInt8(bytes[offset + 3]);
            offset += 4;
            break;
        case 0x06:
            data.region_9_count = readUInt8(bytes[offset]);
            data.region_10_count = readUInt8(bytes[offset + 1]);
            data.region_11_count = readUInt8(bytes[offset + 2]);
            data.region_12_count = readUInt8(bytes[offset + 3]);
            offset += 4;
            break;
        case 0x07:
            data.region_13_count = readUInt8(bytes[offset]);
            data.region_14_count = readUInt8(bytes[offset + 1]);
            data.region_15_count = readUInt8(bytes[offset + 2]);
            data.region_16_count = readUInt8(bytes[offset + 3]);
            offset += 4;
            break;
        case 0x08:
            data.a_to_a = readUInt16LE(bytes.slice(offset, offset + 2));
            data.a_to_b = readUInt16LE(bytes.slice(offset + 2, offset + 4));
            offset += 4;
            break;
        case 0x09:
            data.a_to_c = readUInt16LE(bytes.slice(offset, offset + 2));
            data.a_to_d = readUInt16LE(bytes.slice(offset + 2, offset + 4));
            offset += 4;
            break;
        case 0x0a:
            data.b_to_a = readUInt16LE(bytes.slice(offset, offset + 2));
            data.b_to_b = readUInt16LE(bytes.slice(offset + 2, offset + 4));
            offset += 4;
            break;
        case 0x0b:
            data.b_to_c = readUInt16LE(bytes.slice(offset, offset + 2));
            data.b_to_d = readUInt16LE(bytes.slice(offset + 2, offset + 4));
            offset += 4;
            break;
        case 0x0c:
            data.c_to_a = readUInt16LE(bytes.slice(offset, offset + 2));
            data.c_to_b = readUInt16LE(bytes.slice(offset + 2, offset + 4));
            offset += 4;
            break;
        case 0x0d:
            data.c_to_c = readUInt16LE(bytes.slice(offset, offset + 2));
            data.c_to_d = readUInt16LE(bytes.slice(offset + 2, offset + 4));
            offset += 4;
            break;
        case 0x0e:
            data.d_to_a = readUInt16LE(bytes.slice(offset, offset + 2));
            data.d_to_b = readUInt16LE(bytes.slice(offset + 2, offset + 4));
            offset += 4;
            break;
        case 0x0f:
            data.d_to_c = readUInt16LE(bytes.slice(offset, offset + 2));
            data.d_to_d = readUInt16LE(bytes.slice(offset + 2, offset + 4));
            offset += 4;
            break;
        case 0x10:
            data.people_total_in = readUInt16LE(bytes.slice(offset, offset + 2));
            data.people_total_out = readUInt16LE(bytes.slice(offset + 2, offset + 4));
            offset += 4;
            break;
        case 0x11:
            data.dwell_time_avg = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            data.dwell_time_max = readUInt16LE(bytes.slice(offset + 3, offset + 5));
            offset += 5;
            break;
        case 0x12:
            data.line_in = readUInt16LE(bytes.slice(offset, offset + 2));
            data.line_out = readUInt16LE(bytes.slice(offset + 2, offset + 4));
            offset += 4;
            break;
        default:
            throw new Error("unknown history data type");
    }

    return { data: data, offset: offset };
}

/* eslint-disable */
function readUInt8(bytes) {
    return bytes & 0xff;
}

function readInt8(bytes) {
    var ref = readUInt8(bytes);
    return ref > 0x7f ? ref - 0x100 : ref;
}

function readUInt16BE(bytes) {
    var value = (bytes[0] << 8) + bytes[1];
    return value & 0xffff;
}

function readInt16LE(bytes) {
    var ref = readUInt16LE(bytes);
    return ref > 0x7fff ? ref - 0x10000 : ref;
}

function readUInt16LE(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return value & 0xffff;
}

function readUInt24LE(bytes) {
    var value = (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
    return value & 0xffffff;
}

function readInt24LE(bytes) {
    var ref = readUInt24LE(bytes);
    return ref > 0x7fffff ? ref - 0x1000000 : ref;
}

function readUInt32LE(bytes) {
    var value = (bytes[3] << 24) + (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
    return (value & 0xffffffff) >>> 0;
}

function bytesToHexString(bytes) {
    var temp = [];
    for (var i = 0; i < bytes.length; i++) {
        temp.push(("0" + (bytes[i] & 0xff).toString(16)).slice(-2));
    }
    return temp.join("");
}

function readD2DCommand(bytes) {
    return ("0" + (bytes[1] & 0xff).toString(16)).slice(-2) + ("0" + (bytes[0] & 0xff).toString(16)).slice(-2);
}

function getValue(map, key) {
    if (RAW_VALUE) return key;

    var value = map[key];
    if (!value) value = "unknown";
    return value;
}

if (!Object.assign) {
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
}
