/**
 * Payload Decoder
 *
 * Copyright 2025 Milesight IoT
 *
 * @product TS302
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

    for (var i = 0; i < bytes.length; ) {
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
        // BATTERY
        else if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = readUInt8(bytes[i]);
            i += 1;
        }
        // TEMPERATURE(CHANNEL 1 SENSOR)
        else if (channel_id === 0x03 && channel_type === 0x67) {
            decoded.temperature_chn1 = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // MAGNET STATUS(CHANNEL 1 SENSOR)
        else if (channel_id === 0x03 && channel_type === 0x00) {
            decoded.magnet_chn1 = readMagnetStatus(bytes[i]);
            i += 1;
        }
        // HUMIDITY(CHANNEL 1 SENSOR)
        else if (channel_id === 0x03 && channel_type === 0x9a) {
            decoded.humidity_chn1 = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // TEMPERATURE(CHANNEL 2 SENSOR)
        else if (channel_id === 0x04 && channel_type === 0x67) {
            decoded.temperature_chn2 = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // MAGNET STATUS(CHANNEL 2 SENSOR)
        else if (channel_id === 0x04 && channel_type === 0x00) {
            decoded.magnet_chn2 = readMagnetStatus(bytes[i]);
            i += 1;
        }
        // HUMIDITY(CHANNEL 2 SENSOR)
        else if (channel_id === 0x04 && channel_type === 0x9a) {
            decoded.humidity_chn2 = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // TEMPERATURE(CHANNEL 1 SENSOR) ALARM
        else if (channel_id === 0x83 && channel_type === 0x67) {
            var temp_value = readInt16LE(bytes.slice(i, i + 2)) / 10;
            var alarm_type = readAlarmType(bytes[i + 2]);
            decoded.temperature_chn1 = temp_value;
            decoded.temperature_chn1_alarm = alarm_type;
            decoded.event = decoded.event || [];
            decoded.event.push({ temperature_chn1: temp_value, temperature_chn1_alarm: alarm_type });
            i += 3;
        }
        // HUMIDITY(CHANNEL 1 SENSOR) ALARM
        else if (channel_id === 0x83 && channel_type === 0x9a) {
            var hum_value = readInt16LE(bytes.slice(i, i + 2)) / 10;
            var alarm_type = readAlarmType(bytes[i + 2]);
            decoded.humidity_chn1 = hum_value;
            decoded.humidity_chn1_alarm = alarm_type;
            decoded.event = decoded.event || [];
            decoded.event.push({ humidity_chn1: hum_value, humidity_chn1_alarm: alarm_type });
            i += 3;
        }
        // TEMPERATURE(CHANNEL 2 SENSOR) ALARM
        else if (channel_id === 0x84 && channel_type === 0x67) {
            var temp_value = readInt16LE(bytes.slice(i, i + 2)) / 10;
            var alarm_type = readAlarmType(bytes[i + 2]);
            decoded.temperature_chn2 = temp_value;
            decoded.temperature_chn2_alarm = alarm_type;
            decoded.event = decoded.event || [];
            decoded.event.push({ temperature_chn2: temp_value, temperature_chn2_alarm: alarm_type });
            i += 3;
        }
        // HUMIDITY(CHANNEL 2 SENSOR) ALARM
        else if (channel_id === 0x84 && channel_type === 0x9a) {
            var hum_value = readInt16LE(bytes.slice(i, i + 2)) / 10;
            var alarm_type = readAlarmType(bytes[i + 2]);
            decoded.humidity_chn2 = hum_value;
            decoded.humidity_chn2_alarm = alarm_type;
            decoded.event = decoded.event || [];
            decoded.event.push({ humidity_chn2: hum_value, humidity_chn2_alarm: alarm_type });
            i += 3;
        }
        // TEMPERATURE(CHANNEL 1 SENSOR) MUTATION ALARM
        else if (channel_id === 0x93 && channel_type === 0x67) {
            var temp_value = readInt16LE(bytes.slice(i, i + 2)) / 10;
            var mutation_value = readInt16LE(bytes.slice(i + 2, i + 4)) / 10;
            var alarm_type = readAlarmType(8);
            decoded.temperature_chn1 = temp_value;
            decoded.temperature_chn1_mutation = mutation_value;
            decoded.temperature_chn1_alarm = alarm_type;
            decoded.event = decoded.event || [];
            decoded.event.push({ temperature_chn1: temp_value, temperature_chn1_alarm: alarm_type, temperature_chn1_mutation: mutation_value });
            i += 5;
        }
        // HUMIDITY(CHANNEL 1 SENSOR) MUTATION ALARM
        else if (channel_id === 0x93 && channel_type === 0x9a) {
            var hum_value = readInt16LE(bytes.slice(i, i + 2)) / 10;
            var mutation_value = readInt16LE(bytes.slice(i + 2, i + 4)) / 10;
            var alarm_type = readAlarmType(8);
            decoded.humidity_chn1 = hum_value;
            decoded.humidity_chn1_mutation = mutation_value;
            decoded.humidity_chn1_alarm = alarm_type;
            decoded.event = decoded.event || [];
            decoded.event.push({ humidity_chn1: hum_value, humidity_chn1_alarm: alarm_type, humidity_chn1_mutation: mutation_value });
            i += 5;
        }
        // TEMPERATURE(CHANNEL 2 SENSOR) MUTATION ALARM
        else if (channel_id === 0x94 && channel_type === 0x67) {
            var temp_value = readInt16LE(bytes.slice(i, i + 2)) / 10;
            var mutation_value = readInt16LE(bytes.slice(i + 2, i + 4)) / 10;
            var alarm_type = readAlarmType(8);
            decoded.temperature_chn2 = temp_value;
            decoded.temperature_chn2_mutation = mutation_value;
            decoded.temperature_chn2_alarm = alarm_type;
            decoded.event = decoded.event || [];
            decoded.event.push({ temperature_chn2: temp_value, temperature_chn2_alarm: alarm_type, temperature_chn2_mutation: mutation_value });
            i += 5;
        }
        // HUMIDITY(CHANNEL 2 SENSOR) MUTATION ALARM
        else if (channel_id === 0x94 && channel_type === 0x9a) {
            var hum_value = readInt16LE(bytes.slice(i, i + 2)) / 10;
            var mutation_value = readInt16LE(bytes.slice(i + 2, i + 4)) / 10;
            var alarm_type = readAlarmType(8);
            decoded.humidity_chn2 = hum_value;
            decoded.humidity_chn2_mutation = mutation_value;
            decoded.humidity_chn2_alarm = alarm_type;
            decoded.event = decoded.event || [];
            decoded.event.push({ humidity_chn2: hum_value, humidity_chn2_alarm: alarm_type, humidity_chn2_mutation: mutation_value });
            i += 5;
        }
        // TEMPERATURE SENSOR STATUS (CHANNEL 1)
        else if (channel_id === 0xb3 && channel_type === 0x67) {
            var data = {};
            data.temperature_chn1_sensor_status = readSensorStatus(bytes[i]);
            decoded.event = decoded.event || [];
            decoded.event.push(data);
            i += 1;
        }
        // HUMIDITY SENSOR STATUS (CHANNEL 1)
        else if (channel_id === 0xb3 && channel_type === 0x9a) {
            var data = {};
            data.humidity_chn1_sensor_status = readSensorStatus(bytes[i]);
            decoded.event = decoded.event || [];
            decoded.event.push(data);
            i += 1;
        }
        // TEMPERATURE SENSOR STATUS (CHANNEL 2)
        else if (channel_id === 0xb4 && channel_type === 0x67) {
            var data = {};
            data.temperature_chn2_sensor_status = readSensorStatus(bytes[i]);
            decoded.event = decoded.event || [];
            decoded.event.push(data);
            i += 1;
        }
        // HUMIDITY SENSOR STATUS (CHANNEL 2)
        else if (channel_id === 0xb4 && channel_type === 0x9a) {
            var data = {};
            data.humidity_chn2_sensor_status = readSensorStatus(bytes[i]);
            decoded.event = decoded.event || [];
            decoded.event.push(data);
            i += 1;
        }
        // HISTORY DATA (CHANNEL 1)
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var timestamp = readUInt32LE(bytes.slice(i, i + 4));
            var mask = readUInt8(bytes[i + 4]);
            i += 5;

            var data = {};
            data.timestamp = timestamp;
            var temperature_chn_event = (mask >>> 4) & 0x0f;
            var humidity_chn_event = (mask >>> 0) & 0x0f;
            var humidity_chn1 = readInt16LE(bytes.slice(i, i + 2));
            var temperature_chn1 = readInt16LE(bytes.slice(i + 2, i + 4));
            // -999 is not valid temperature, skip it
            if (temperature_chn1 !== -999) {
                // magnet sensor
                // -1000 is magnet close
                // -1001 is magnet open
                if (temperature_chn1 === -1000 || temperature_chn1 === -1001) {
                    data.magnet_chn1 = readMagnetEvent(temperature_chn1);
                    data.chn1_event = readHistoryEvent(temperature_chn_event);
                } else {
                    if (temperature_chn1 === -1002) {
                        data.temperature_chn1 = 'over_range';
                    } else {
                        data.temperature_chn1 = temperature_chn1 / 10;
                    }
                    data.temperature_chn1_event = readHistoryEvent(temperature_chn_event);
                }
            }
            // -999 is not valid humidity, skip it
            if (humidity_chn1 !== -999) {
                // magnet sensor
                // -1000 is magnet close
                // -1001 is magnet open
                if (humidity_chn1 === -1000 || humidity_chn1 === -1001) {
                    data.magnet_chn1 = readMagnetEvent(humidity_chn1);
                    data.chn1_event = readHistoryEvent(humidity_chn_event);
                } else {
                    if (humidity_chn1 === -1002) {
                        data.humidity_chn1 = 'over_range';
                    } else {
                        data.humidity_chn1 = humidity_chn1 / 10;
                    }
                    data.humidity_chn1_event = readHistoryEvent(humidity_chn_event);
                }
            }
            i += 4;
            decoded.history = decoded.history || [];
            decoded.history.push(data);
        }
        // HISTORY DATA (CHANNEL 2)
        else if (channel_id === 0x21 && channel_type === 0xce) {
            var timestamp = readUInt32LE(bytes.slice(i, i + 4));
            var mask = readUInt8(bytes[i + 4]);
            i += 5;

            var data = {};
            data.timestamp = timestamp;
            var temperature_chn_event = (mask >>> 4) & 0x0f;
            var humidity_chn_event = (mask >>> 0) & 0x0f;
            var temperature_chn2 = readInt16LE(bytes.slice(i + 2, i + 4));
            var humidity_chn2 = readInt16LE(bytes.slice(i, i + 2));
            // -999 is not valid temperature, skip it
            if (temperature_chn2 !== -999) {
                // magnet sensor
                // -1000 is magnet close
                // -1001 is magnet open
                if (temperature_chn2 === -1000 || temperature_chn2 === -1001) {
                    data.magnet_chn2 = readMagnetEvent(temperature_chn2);
                    data.chn2_event = readHistoryEvent(temperature_chn_event);
                } else {
                    if (temperature_chn2 === -1002) {
                        data.temperature_chn2 = 'over_range';
                    } else {
                        data.temperature_chn2 = temperature_chn2 / 10;
                    }
                    data.temperature_chn2_event = readHistoryEvent(temperature_chn_event);
                }
            }
            // -999 is not valid humidity, skip it
            if (humidity_chn2 !== -999) {
                // magnet sensor
                // -1000 is magnet close
                // -1001 is magnet open
                if (humidity_chn2 === -1000 || humidity_chn2 === -1001) {
                    data.magnet_chn2 = readMagnetEvent(humidity_chn2);
                    data.chn2_event = readHistoryEvent(humidity_chn_event);
                } else {
                    if (humidity_chn2 === -1002) {
                        data.humidity_chn2 = 'over_range';
                    } else {
                        data.humidity_chn2 = humidity_chn2 / 10;
                    }
                    data.humidity_chn2_event = readHistoryEvent(humidity_chn_event);
                }
            }
            i += 4;
            decoded.history = decoded.history || [];
            decoded.history.push(data);
        }
        // POST BACK TIMESTAMP
        else if (channel_id === 0xfd && channel_type === 0x6b) {
            var retrieval_historical_data_by_time = {};
            retrieval_historical_data_by_time.timestamp = readUInt32LE(bytes.slice(i, i + 4));
            decoded.retrieval_historical_data_by_time = retrieval_historical_data_by_time;
            i += 4;
        }
        // POST BACK TIME RANGE
        else if (channel_id === 0xfd && channel_type === 0x6c) {
            var retrieval_historical_data_by_time_range = {};
            retrieval_historical_data_by_time_range.start_time = readUInt32LE(bytes.slice(i, i + 4));
            retrieval_historical_data_by_time_range.end_time = readUInt32LE(bytes.slice(i + 4, i + 8));
            if (retrieval_historical_data_by_time_range.start_time > retrieval_historical_data_by_time_range.end_time) {
                throw new Error("start time is greater than end time");
            }
            decoded.retrieval_historical_data_by_time_range = retrieval_historical_data_by_time_range;
            i += 8;
        }
        // STOP POST BACK
        else if (channel_id === 0xfd && channel_type === 0x6d) {
            decoded.stop_historical_data_retrieval = readYesNoStatus(1);
            i += 1;
        }
        // SENSOR ID
        else if (channel_id === 0xff && channel_type === 0xa0) {
            var data = readUInt8(bytes[i]);
            var sensor_chn = (data >>> 4) & 0x0f;
            var sensor_type = (data >>> 0) & 0x0f;
            var sensor_type = readSensorIDType(sensor_type);
            var sensor_sn = readSerialNumber(bytes.slice(i + 1, i + 9));
            if (sensor_chn === 0) {
                decoded.sensor_chn1_type = sensor_type;
                decoded.sensor_chn1_sn = sensor_sn;
            } else if (sensor_chn === 1) {
                decoded.sensor_chn2_type = sensor_type;
                decoded.sensor_chn2_sn = sensor_sn;
            }
            i += 9;
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
        case 0x02:
            decoded.collection_interval = readUInt16LE(bytes.slice(offset, offset + 2));
            offset += 2;
            break;
        case 0x06:
            var data = readUInt8(bytes[offset]);
            var condition_value = (data >>> 0) & 0x07;
            var alarm_channel = (data >>> 3) & 0x07;
            var enable_value = (data >>> 6) & 0x01;
            // temperature alarm
            if (alarm_channel === 0x00 || alarm_channel === 0x01) {
                var temperature_alarm_config = {};
                temperature_alarm_config.enable = readEnableStatus(enable_value);
                temperature_alarm_config.condition = readConditionType(condition_value);
                temperature_alarm_config.threshold_min = readInt16LE(bytes.slice(offset + 1, offset + 3)) / 10;
                temperature_alarm_config.threshold_max = readInt16LE(bytes.slice(offset + 3, offset + 5)) / 10;

                if (alarm_channel === 0x00) {
                    decoded.temperature_chn1_alarm_config = temperature_alarm_config;
                } else if (alarm_channel === 0x01) {
                    decoded.temperature_chn2_alarm_config = temperature_alarm_config;
                }
            }
            // temperature mutation alarm
            else if (alarm_channel === 0x02 || alarm_channel === 0x03) {
                var temperature_mutation_alarm_config = {};
                temperature_mutation_alarm_config.enable = readEnableStatus(enable_value);
                temperature_mutation_alarm_config.mutation = readUInt16LE(bytes.slice(offset + 3, offset + 5)) / 10;

                if (alarm_channel === 0x02) {
                    decoded.temperature_chn1_mutation_alarm_config = temperature_mutation_alarm_config;
                } else if (alarm_channel === 0x03) {
                    decoded.temperature_chn2_mutation_alarm_config = temperature_mutation_alarm_config;
                }
            }
            // humidity alarm
            else if (alarm_channel === 0x04 || alarm_channel === 0x05) {
                var humidity_alarm_config = {};
                humidity_alarm_config.enable = readEnableStatus(enable_value);
                humidity_alarm_config.condition = readConditionType(condition_value);
                humidity_alarm_config.threshold_min = readUInt16LE(bytes.slice(offset + 1, offset + 3)) / 10;
                humidity_alarm_config.threshold_max = readUInt16LE(bytes.slice(offset + 3, offset + 5)) / 10;

                if (alarm_channel === 0x04) {
                    decoded.humidity_chn1_alarm_config = humidity_alarm_config;
                } else if (alarm_channel === 0x05) {
                    decoded.humidity_chn2_alarm_config = humidity_alarm_config;
                }
            }
            // humidity mutation alarm
            else if (alarm_channel === 0x06 || alarm_channel === 0x07) {
                var humidity_mutation_alarm_config = {};
                humidity_mutation_alarm_config.enable = readEnableStatus(enable_value);
                humidity_mutation_alarm_config.mutation = readUInt16LE(bytes.slice(offset + 3, offset + 5)) / 10;

                if (alarm_channel === 0x06) {
                    decoded.humidity_chn1_mutation_alarm_config = humidity_mutation_alarm_config;
                } else if (alarm_channel === 0x07) {
                    decoded.humidity_chn2_mutation_alarm_config = humidity_mutation_alarm_config;
                }
            }
            offset += 9;
            break;
        case 0x10:
            decoded.reboot = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x27:
            decoded.clear_history = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x28:
            decoded.report_status = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x2d:
            decoded.display_mode = readDisplayMode(bytes[offset]);
            offset += 1;
            break;
        case 0x35:
            decoded.d2d_key = readHexString(bytes.slice(offset, offset + 8));
            offset += 8;
            break;
        case 0x4a:
            decoded.sync_time = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x68:
            decoded.history_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x69:
            decoded.retransmit_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x6a:
            var data = readUInt8(bytes[offset]);
            if (data === 0x00) {
                decoded.retransmit_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            } else if (data === 0x01) {
                decoded.resend_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            }
            offset += 3;
            break;
        case 0x6d:
            decoded.stop_transmit = readYesNoStatus(1);
            offset += 1;
            break;
        case 0x7e:
            decoded.alarm_config = {};
            decoded.alarm_config.alarm_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            decoded.alarm_config.alarm_counts = readUInt16LE(bytes.slice(offset + 3, offset + 5));
            offset += 5;
            break;
        case 0x8e:
            // skip first byte
            decoded.report_interval = readUInt16LE(bytes.slice(offset + 1, offset + 3));
            offset += 3;
            break;
        case 0x91:
            // skip first byte
            decoded.magnet_throttle = readUInt32LE(bytes.slice(offset + 1, offset + 5));
            offset += 5;
            break;
        case 0x96:
            var d2d_master_config = {};
            d2d_master_config.mode = readD2DEventType(bytes[offset]);
            d2d_master_config.enable = readEnableStatus(bytes[offset + 1]);
            d2d_master_config.lora_uplink_enable = readEnableStatus(bytes[offset + 2]);
            d2d_master_config.d2d_cmd = readD2DCommand(bytes.slice(offset + 3, offset + 5));
            offset += 8;
            decoded.d2d_master_config = decoded.d2d_master_config || [];
            decoded.d2d_master_config.push(d2d_master_config);
            break;
        case 0xbd:
            decoded.time_zone = readTimeZone(readInt16LE(bytes.slice(offset, offset + 2)));
            offset += 2;
            break;
        case 0xe9:
            decoded.time_display = readTimeDisplayType(bytes[offset]);
            offset += 1;
            break;
        case 0xea:
            var data = readUInt8(bytes[offset]);
            var calibration_channel = (data >>> 0) & 0x07;
            var enable_value = (data >>> 7) & 0x01;
            var calibration_settings = {};
            calibration_settings.enable = readEnableStatus(enable_value);
            calibration_settings.calibration_value = readInt16LE(bytes.slice(offset + 1, offset + 3)) / 10;
            // temperature chn1
            if (calibration_channel === 0x00) {
                decoded.temperature_chn1_calibration_settings = calibration_settings;
            }
            // temperature chn2
            else if (calibration_channel === 0x01) {
                decoded.temperature_chn2_calibration_settings = calibration_settings;
            }
            // humidity chn1
            else if (calibration_channel === 0x02) {
                decoded.humidity_chn1_calibration_settings = calibration_settings;
            }
            // humidity chn2
            else if (calibration_channel === 0x03) {
                decoded.humidity_chn2_calibration_settings = calibration_settings;
            }
            offset += 3;
            break;
        case 0xeb:
            decoded.temperature_unit_display = readTemperatureUnitDisplayType(bytes[offset]);
            offset += 1;
            break;
        case 0xf5:
            decoded.alarm_release_enable = readEnableStatus(bytes[offset]);
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
        case 0x31:
            decoded.fetch_sensor_id = fetchSensorID(readUInt8(bytes[offset]));
            offset += 1;
            break;
        case 0x32:
            // skip 2 byte
            decoded.ack_retry_times = readUInt8(bytes[offset + 2]);
            offset += 3;
            break;
        case 0x63:
            decoded.d2d_uplink_config = {};
            decoded.d2d_uplink_config.d2d_uplink_enable = readEnableStatus(bytes[offset]);
            decoded.d2d_uplink_config.lora_uplink_enable = readEnableStatus(bytes[offset + 1]);
            decoded.d2d_uplink_config.sensor_data_config = readSensorDataConfig(readUInt16LE(bytes.slice(offset + 2, offset + 4)));
            offset += 4;
            break;
        case 0x66:
            decoded.d2d_enable = readEnableStatus(bytes[offset]);
            offset += 1;
            break;
        case 0x69:
            decoded.button_lock_config = readButtonLockConfig(bytes[offset]);
            offset += 1;
            break;
        case 0x6f:
            var query_config = readQueryConfig(readUInt8(bytes[offset]));
            decoded.query_config = decoded.query_config || {};
            decoded.query_config = Object.assign(decoded.query_config, query_config);
            offset += 1;
            break;
        case 0x72:
            decoded.dst_config = readDstConfig(bytes.slice(offset, offset + 9));
            offset += 9;
            break;
        case 0x9a:
            decoded.magnet_delay_time = readUInt16LE(bytes.slice(offset, offset + 2));
            offset += 2;
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

function readProtocolVersion(bytes) {
    var major = (bytes & 0xf0) >> 4;
    var minor = bytes & 0x0f;
    return "v" + major + "." + minor;
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
        0: "Class A",
        1: "Class B",
        2: "Class C",
        3: "Class CtoB",
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

function readEnableStatus(status) {
    var status_map = { 0: "disable", 1: "enable" };
    return getValue(status_map, status);
}

function readYesNoStatus(status) {
    var status_map = { 0: "no", 1: "yes" };
    return getValue(status_map, status);
}

function readTimeZone(time_zone) {
    var timezone_map = { "-720": "UTC-12", "-660": "UTC-11", "-600": "UTC-10", "-570": "UTC-9:30", "-540": "UTC-9", "-480": "UTC-8", "-420": "UTC-7", "-360": "UTC-6", "-300": "UTC-5", "-240": "UTC-4", "-210": "UTC-3:30", "-180": "UTC-3", "-120": "UTC-2", "-60": "UTC-1", 0: "UTC", 60: "UTC+1", 120: "UTC+2", 180: "UTC+3", 210: "UTC+3:30", 240: "UTC+4", 270: "UTC+4:30", 300: "UTC+5", 330: "UTC+5:30", 345: "UTC+5:45", 360: "UTC+6", 390: "UTC+6:30", 420: "UTC+7", 480: "UTC+8", 540: "UTC+9", 570: "UTC+9:30", 600: "UTC+10", 630: "UTC+10:30", 660: "UTC+11", 720: "UTC+12", 765: "UTC+12:45", 780: "UTC+13", 840: "UTC+14" };
    return getValue(timezone_map, time_zone);
}

function readMagnetStatus(status) {
    var status_map = { 0: "close", 1: "open" };
    return getValue(status_map, status);
}

function readMagnetEvent(status) {
    if (status === -1000) {
        return 'close';
    } else if (status === -1001) {
        return 'open';
    } else {
        return 'unknown';
    }
}
function readConditionType(type) {
    var condition_map = { 0: "disable", 1: "below", 2: "above", 3: "between", 4: "outside", 5: "mutation" };
    return getValue(condition_map, type);
}

function readTimeDisplayType(type) {
    var time_display_map = { 0: "12_hour", 1: "24_hour" };
    return getValue(time_display_map, type);
}

function readTemperatureUnitDisplayType(type) {
    var temperature_unit_display_map = { 0: "celsius", 1: "fahrenheit" };
    return getValue(temperature_unit_display_map, type);
}

function readDisplayMode(type) {
    var display_mode_map = { 0: "disable", 1: "enable", 255: "auto" };
    return getValue(display_mode_map, type);
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

function readAlarmType(type) {
    var alarm_type_map = {
        0: "above_threshold_alarm",
        1: "above_threshold_alarm_release",
        2: "below_threshold_alarm",
        3: "below_threshold_alarm_release",
        4: "between_threshold_alarm",
        5: "between_threshold_alarm_release",
        6: "outside_threshold_alarm",
        7: "outside_threshold_alarm_release",
        8: "mutation_alarm",
    };
    return getValue(alarm_type_map, type);
}

function readSensorStatus(status) {
    var sensor_status_map = { 0: "collection_failed", 1: "over_range", 2: "under_range" };
    return getValue(sensor_status_map, status);
}

function readHistoryEvent(event) {
    var event_map = {
        0: "none",
        1: "above_threshold_alarm",
        2: "above_threshold_alarm_release",
        3: "below_threshold_alarm",
        4: "below_threshold_alarm_release",
        5: "between_threshold_alarm",
        6: "between_threshold_alarm_release",
        7: "outside_threshold_alarm",
        8: "outside_threshold_alarm_release",
        9: "mutation_alarm",
        10: "period_report",
        11: "magnet_alarm",
        12: "abnormal_alarm",
        13: "button_trigger",
    };
    return getValue(event_map, event);
}

function readSensorIDType(type) {
    var sensor_id_map = { 1: "PT100", 2: "SHT4X", 3: "DS18B20", 4: "MAGNET" };
    return getValue(sensor_id_map, type);
}

function fetchSensorID(id) {
    var sensor_id_map = { 0: "sensor_1", 1: "sensor_2", 2: "all" };
    return getValue(sensor_id_map, id);
}

function readButtonLockConfig(value) {
    var button_bit_offset = { power_button: 0, report_button: 1 };
    var status_map = { 0: "disable", 1: "enable" };
    var data = {};
    for (var key in button_bit_offset) {
        data[key] = getValue(status_map, (value >>> button_bit_offset[key]) & 0x01);
    }
    return data;
}

function readSensorDataConfig(value) {
    var sensor_bit_offset = { temperature_chn1: 0, humidity_chn1: 1, temperature_chn2: 2, humidity_chn2: 3 };
    var status_map = { 0: "disable", 1: "enable" };
    var data = {};
    for (var key in sensor_bit_offset) {
        data[key] = getValue(status_map, (value >>> sensor_bit_offset[key]) & 0x01);
    }
    return data;
}

function readDstConfig(bytes) {
    var offset = 0;

    var data = bytes[offset];
    var enable_value = (data >> 7) & 0x01;
    var offset_value = data & 0x7f;

    var dst_config = {};
    dst_config.enable = readEnableStatus(enable_value);
    dst_config.offset = offset_value;
    dst_config.start_month = readUInt8(bytes[offset + 1]);
    var start_week_value = readUInt8(bytes[offset + 2]);
    dst_config.start_week_num = start_week_value >> 4;
    dst_config.start_week_day = start_week_value & 0x0f;
    dst_config.start_time = readUInt16LE(bytes.slice(offset + 3, offset + 5));
    dst_config.end_month = readUInt8(bytes[offset + 5]);
    var end_week_value = readUInt8(bytes[offset + 6]);
    dst_config.end_week_num = end_week_value >> 4;
    dst_config.end_week_day = end_week_value & 0x0f;
    dst_config.end_time = readUInt16LE(bytes.slice(offset + 7, offset + 9));
    offset += 9;

    return dst_config;
}

function readQueryConfig(value) {
    var config_map = {
        report_interval: 1,
        ack_retry_times: 2,
        temperature_unit_display: 3,
        button_lock_config: 4,
        temperature_chn1_alarm_config: 5,
        humidity_chn1_alarm_config: 6,
        temperature_chn2_alarm_config: 7,
        humidity_chn2_alarm_config: 8,
        temperature_chn1_mutation_alarm_config: 9,
        humidity_chn1_mutation_alarm_config: 10,
        temperature_chn2_mutation_alarm_config: 11,
        humidity_chn2_mutation_alarm_config: 12,
        collection_interval: 13,
        alarm_config: 14,
        alarm_release_enable: 15,
        d2d_uplink_config: 16,
        d2d_enable: 17,
        d2d_master_config_with_temperature_chn1_threshold_alarm: 18,
        d2d_master_config_with_temperature_chn1_threshold_alarm_release: 19,
        d2d_master_config_with_temperature_chn1_mutation_alarm: 20,
        d2d_master_config_with_humidity_chn1_threshold_alarm: 21,
        d2d_master_config_with_humidity_chn1_threshold_alarm_release: 22,
        d2d_master_config_with_humidity_chn1_mutation_alarm: 23,
        d2d_master_config_with_magnet_chn1_close_alarm: 24,
        d2d_master_config_with_magnet_chn1_open_alarm: 25,
        d2d_master_config_with_temperature_chn2_threshold_alarm: 26,
        d2d_master_config_with_temperature_chn2_threshold_alarm_release: 27,
        d2d_master_config_with_temperature_chn2_mutation_alarm: 28,
        d2d_master_config_with_humidity_chn2_threshold_alarm: 29,
        d2d_master_config_with_humidity_chn2_threshold_alarm_release: 30,
        d2d_master_config_with_humidity_chn2_mutation_alarm: 31,
        d2d_master_config_with_magnet_chn2_close_alarm: 32,
        d2d_master_config_with_magnet_chn2_open_alarm: 33,
        history_enable: 34,
        retransmit_interval: 35,
        magnet_delay_time: 36,
        resend_interval: 37,
        chn1_temperature_calibration_settings: 38,
        chn1_humidity_calibration_settings: 39,
        chn2_temperature_calibration_settings: 40,
        chn2_humidity_calibration_settings: 41,
        dst_config: 42,
        time_display: 43,
        magnet_throttle: 44,
        display_mode: 45,
        retransmit_enable: 46,
    };
    var query_config = {};
    for (var key in config_map) {
        if (value === config_map[key]) {
            query_config[key] = readYesNoStatus(1);
        }
    }
    return query_config;
}

function readD2DCommand(bytes) {
    return ("0" + (bytes[1] & 0xff).toString(16)).slice(-2) + ("0" + (bytes[0] & 0xff).toString(16)).slice(-2);
}

function readD2DEventType(type) {
    var event_map = {
        1: "temperature_chn1_threshold_alarm",
        2: "temperature_chn1_threshold_alarm_release",
        3: "temperature_chn1_mutation_alarm",
        4: "humidity_chn1_threshold_alarm",
        5: "humidity_chn1_threshold_alarm_release",
        6: "humidity_chn1_mutation_alarm",
        7: "magnet_chn1_close",
        8: "magnet_chn1_open",
        9: "temperature_chn2_threshold_alarm",
        10: "temperature_chn2_threshold_alarm_release",
        11: "temperature_chn2_mutation_alarm",
        12: "humidity_chn2_threshold_alarm",
        13: "humidity_chn2_threshold_alarm_release",
        14: "humidity_chn2_mutation_alarm",
        15: "magnet_chn2_close",
        16: "magnet_chn2_open",
    };
    return getValue(event_map, type);
}

function readHexString(bytes) {
    var temp = [];
    for (var idx = 0; idx < bytes.length; idx++) {
        temp.push(("0" + (bytes[idx] & 0xff).toString(16)).slice(-2));
    }
    return temp.join("");
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
