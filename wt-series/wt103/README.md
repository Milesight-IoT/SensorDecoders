# Smart Radiator Thermostat - WT103

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/wt103)

## Payload

```
+-------------------------------------------------------+
|           DEVICE UPLINK / DOWNLINK PAYLOAD            |
+---------------------------+---------------------------+
|          DATA 1           |          DATA 2           |
+--------+--------+---------+--------+--------+---------+
|   ID   |  TYPE  |  DATA   |   ID   |  TYPE  |  DATA   |
+--------+--------+---------+--------+--------+---------+
| 1 Byte | 1 Byte | N Bytes | 1 Byte | 1 Byte | N Bytes |
|--------+--------+---------+--------+--------+---------|
```

### Attribute

|    CHANNEL     |  ID  | TYPE | LENGTH | DESCRIPTION                                                                             |
| :-------------: | :--: | :--: | :----: | --------------------------------------------------------------------------------------- |
|   Boot Event    | 0xFF | 0x0B |   1    | boot_event(1B)<br/>boot_event, values: (0: no, 1: yes)                                  |
|      IPSO       | 0xFF | 0x01 |   1    | ipso_version(1B)                                                                         |
|       TSL       | 0xFF | 0xFF |   2    | tsl_version(2B)                                                                           |
| Serial Number (12-digit) | 0xFF | 0x08 |   6    | sn(6B)                                                                     |
| Serial Number (16-digit) | 0xFF | 0x16 |   8    | sn(8B)                                                                     |
|    Hardware    | 0xFF | 0x09 |   2    | hardware_version(2B)<br/>hardware_version, e.g. 0110 -> v1.1                             |
|    Firmware    | 0xFF | 0x0A |   2    | firmware_version(2B)<br/>firmware_version, e.g. 0110 -> v1.10                             |
| LoRaWAN Class   | 0xFF | 0x0F |   1    | lorawan_class(1B)<br/>lorawan_class, values: (0: Class A, 1: Class B, 2: Class C, 3: Class CtoB) |
| TSL Config Request | 0xFF | 0xFE |   1    | tsl_config_request(1B)<br/>tsl_config_request, values: (0: no, 1: yes)<br/>reported after device reset |

### Telemetry

| CHANNEL                | ID   | TYPE | LENGTH | DESCRIPTION                                                                                                                                                                                     |
| :---------------------- | :--: | :--: | :----: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Battery                 | 0x01 | 0x75 |   1    | battery(1B)<br/>battery, read: uint8, unit: %                                                                                                                                                    |
| Ambient Temperature      | 0x03 | 0x67 |   2    | temperature(2B)<br/>temperature, read: int16/100, unit: °C                                                                                                                                       |
| Target Temperature      | 0x04 | 0x67 |   2    | temperature_target(2B)<br/>temperature_target, read: int16/100, unit: °C                                                                                                                         |
| Valve Opening           | 0x05 | 0x92 |   1    | valve_opening(1B)<br/>valve_opening, read: uint8, unit: %                                                                                                                                        |
| Temperature Control Level | 0x06 | 0xCB |   1    | level(1B)<br/>level, read: uint8, range: [0, 5]                                                                                                                                                  |
| Open Window Detection   | 0x07 | 0x00 |   1    | open_window_detection(1B)<br/>open_window_detection, read: uint8, values: (0: normal, 1: open)                                                                                                   |
| Motor Calibration Status | 0x08 | 0xE5 |   1    | motor_calibration_status(1B)<br/>motor_calibration_status, read: uint8, values: (0: success, 1: fail: out of range, 2: fail: uninstalled, 3: calibration cleared, 4: temperature control disabled, 5: fail: low battery) |
| Motor Stroke            | 0x09 | 0x90 |   2    | motor_stroke(2B)<br/>motor_stroke, read: uint16                                                                                                                                                  |
| Freeze Protection Status | 0x0A | 0x00 |   1    | freeze_protection_status(1B)<br/>freeze_protection_status, read: uint8, values: (0: normal, 1: triggered)                                                                                        |
| Motor Position          | 0x0B | 0x90 |   2    | motor_position(2B)<br/>motor_position, read: uint16                                                                                                                                              |
| Target Valve Opening    | 0x0C | 0x92 |   1    | valve_opening_target(1B)<br/>valve_opening_target, read: uint8, unit: %                                                                                                                          |

### Periodic Packet

Periodic packets are reported as a single combined TLV (channel + type + data), one per reporting cycle, according to the active working scenario / temperature control mode. Port is 85. Fields decode into the same keys as the regular channels above.

| CHANNEL                              | ID   | TYPE | LENGTH | DESCRIPTION                                                                                                             |
| :------------------------------------ | :--: | :--: | :----: | :------------------------------------------------------------------------------------------------------------------------ |
| Periodic Packet (0-5 Scale Mode)      | 0x10 | 0xC0 |   7    | battery(1B) + valve_opening(1B) + temperature(2B) + temperature_target(2B) + level(1B)                                    |
| Periodic Packet (Integrated Control)  | 0x11 | 0xC1 |   6    | battery(1B) + valve_opening(1B) + temperature(2B) + temperature_target(2B)                                                |
| Periodic Packet (Valve Opening Control) | 0x12 | 0xC2 |   5    | battery(1B) + valve_opening(1B) + temperature(2B) + valve_opening_target(1B)                                              |
| Periodic Packet (Non-heating Season)  | 0x13 | 0xC3 |   2    | battery(1B) + valve_opening(1B)                                                                                           |

### Alarm

Temperature alarm depends on a valid ambient temperature reading; while temperature control is disabled and temperature is not sampled during the non-heating season, the temperature alarm does not trigger.

| CHANNEL                     | ID   | TYPE | LENGTH | DESCRIPTION                                                                                                                                                                                                |
| :--------------------------- | :--: | :--: | :----: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Temperature Alarm           | 0x83 | 0x67 |   3    | temperature(2B) + alarm(1B)<br/>temperature_alarm.temperature, read: int16/100, unit: °C<br/>temperature_alarm.alarm, values: (0: high temperature alarm release, 1: high temperature alarm trigger, 2: low temperature alarm release, 3: low temperature alarm trigger) |
| Valve Descale Result        | 0x84 | 0x92 |   4    | valve_opening(1B) + trigger_source(1B) + result(1B) + fail_reason(1B)<br/>valve_descale_result.trigger_source, values: (0: auto, 1: manual)<br/>valve_descale_result.result, values: (0: success, 1: fail)<br/>valve_descale_result.fail_reason, values: (0: none, 1: low battery, 2: not off-season, 3: motor busy, 4: calibration failed, 5: early stall, 6: device removed, 7: timeout/hall fault, 8: frost protection interrupted) |
| Open Window Event           | 0x85 | 0x67 |   3    | temperature(2B) + status(1B)<br/>open_window_event.status, values: (0: closed, 1: open)                                                                                                                    |
| Frost Protection Event      | 0x86 | 0x67 |   4    | temperature(2B) + status(1B) + valve_opening(1B)<br/>frost_protection_event.status, values: (0: normal, 1: triggered)                                                                                     |
| Temperature Source Fault    | 0x87 | 0x00 |   1    | status(1B)<br/>temperature_source_fault, values: (0: normal, 1: fault)                                                                                                                                     |

### Configuration

Downlink commands below configure device behavior. Fields map to the `milesightDeviceEncode` payload keys documented in each encoder function.

| CHANNEL                                   | ID   | TYPE | LENGTH | DESCRIPTION                                                                                                                                            |
| :------------------------------------------ | :--: | :--: | :----: | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Time Sync Enable                          | 0xFF | 0x3B |   1    | time_sync_enable, values: (0: disable, 1: enable)                                                                                                       |
| Report Interval                           | 0xFF | 0x8E |   3    | report_interval, unit: minute, range: [1, 1440]                                                                                                         |
| Temperature Control Mode                  | 0xFF | 0xAE |   1    | temperature_control_mode, values: (0: 0-5 scale, 1: integrated control, 2: valve opening control)                                                        |
| Ambient Temperature Calibration           | 0xFF | 0xAB |   3    | temperature_calibration.enable, temperature_calibration.value, unit: °C                                                                                   |
| Temperature Threshold Alarm               | 0xFF | 0x06 |   9    | temperature_threshold_alarm.mode, .min, .max, unit: °C                                                                                                    |
| Target Temperature                        | 0xFF | 0xB1 |   2    | target_temperature, unit: °C                                                                                                                            |
| Temperature Control Algorithm             | 0xFF | 0xAC |   1    | temperature_control_algorithm, values: (0: pid, 1: platform)                                                                                             |
| Freeze Protection                         | 0xFF | 0xB0 |   3    | freeze_protection.enable, freeze_protection.temperature, unit: °C                                                                                        |
| Open Window Detection                     | 0xFF | 0xAF |   5    | open_window_detection.enable, .temperature_threshold (°C), .time (minute)                                                                                |
| Temperature Control Enable (master switch) | 0xFF | 0xB3 |   1    | temperature_control_enable, values: (0: disable, 1: enable)                                                                                              |
| Valve Opening                             | 0xFF | 0xB4 |   1    | valve_opening, unit: %, range: [0, 100]                                                                                                                  |
| Child Lock                                | 0xFF | 0x25 |   1    | child_lock.enable, values: (0: disable, 1: all keys locked, 2: temperature keys only, 3: system key only)                                                |
| Outside Temperature Timeout Strategy      | 0xFF | 0xF8 |   1    | outside_temperature_timeout_strategy, values: (0: keep, 1: switch to internal temperature, 2: close valve)                                               |
| Temperature Source                        | 0xFF | 0xC5 |   1    | temperature_source, values: (0: embedded, 1: external)                                                                                                   |
| Outside Temperature Timeout               | 0xFF | 0xC4 |   2    | outside_temperature_timeout, unit: minute, range: [1, 1440]                                                                                              |
| Display Ambient Temperature on LED        | 0xF9 | 0x36 |   1    | display_ambient_temperature, values: (0: disable, 1: enable)                                                                                             |
| Open Window Valve Strategy                | 0xF9 | 0x37 |   1    | open_window_valve_strategy, values: (0: keep, 1: close)                                                                                                  |
| Daylight Saving Time                      | 0xFF | 0xBA |  10    | dst_config.enable, .offset (minute), .start_month/.start_week_num/.start_week_day/.start_time, .end_month/.end_week_num/.end_week_day/.end_time           |
| Time Zone                                 | 0xFF | 0xBD |   2    | time_zone, unit: minute                                                                                                                                  |
| Non-heating Season Report Interval        | 0xF9 | 0x32 |   2    | non_heating_report_interval, unit: minute, range: [1, 1440], default: 1440                                                                               |
| Heating Date                              | 0xF9 | 0x33 |   4    | heating_date.start_month/.start_day/.end_month/.end_day; supports cross-year range                                                                      |
| Heating Schedule                          | 0xF9 | 0x34 |   9    | heating_schedule[].id/.enable/.mode/.value/.period/.time/.week_recycle                                                                                   |
| Target Temperature Adjustment Range       | 0xF9 | 0x35 |   4    | target_temperature_range.min [5, 15], .max [16, 35], unit: °C                                                                                            |
| Local Modification Report Enable          | 0xF9 | 0x3A |   1    | change_report_enable, values: (0: disable, 1: enable)                                                                                                    |
| Non-heating Season Valve Mode             | 0xF9 | 0x3B |   1    | non_heating_valve_mode, values: (0: fully close, 1: fully open)                                                                                          |
| Valve Descale Enable                      | 0xF9 | 0x3C |   1    | valve_descale_enable, values: (0: disable, 1: enable)                                                                                                    |
| Installation Mode                         | 0xF9 | 0x3D |   1    | installation_mode, values: (0: horizontal, 1: vertical)                                                                                                  |
| Temperature Unit                          | 0xF9 | 0x3E |   1    | temperature_unit, values: (0: celsius, 1: fahrenheit)                                                                                                    |
| Ambient Temperature Display Time          | 0xF9 | 0x40 |   1    | ambient_temperature_display_time, unit: second, range: [1, 10], default: 2                                                                               |
| Platform Algorithm Timeout                | 0xF9 | 0x41 |   2    | platform_algorithm_timeout, unit: minute, range: [1, 1440], default: 30                                                                                  |
| Platform Algorithm Timeout Strategy       | 0xF9 | 0x42 |   1    | platform_algorithm_timeout_strategy, values: (0: keep, 1: switch to internal algorithm, 2: close valve)                                                  |
| Temperature Control Level Mapping         | 0xF9 | 0x43 |   3    | temperature_control_level_mapping.level [0, 5], .temperature (°C)                                                                                        |
| Temperature Control Level                 | 0xF9 | 0x44 |   1    | temperature_control_level, range: [0, 5]                                                                                                                 |
| Temperature Control Level Display Time    | 0xF9 | 0x45 |   1    | temperature_control_level_display_time, unit: second, range: [1, 10], default: 2                                                                        |
| Target Temperature Adjustment Resolution  | 0xF9 | 0x46 |   1    | target_temperature_resolution, values: (0: 0.5, 1: 1.0)                                                                                                  |
| Target Temperature Display Time           | 0xF9 | 0x47 |   1    | target_temperature_display_time, unit: second, range: [1, 10], default: 2                                                                                |
| Open Window Status Timeout                | 0xF9 | 0x49 |   2    | open_window_status_timeout, unit: minute, range: [1, 1440], default: 30                                                                                  |
| Valve Emergency Position                  | 0xF9 | 0x4A |   1    | valve_emergency_position, range: [0, 100], default: 50                                                                                                   |
| Valve Opening Range                       | 0xF9 | 0x4B |   2    | valve_opening_range.min [0, 100] default 10, .max [0, 100] default 100                                                                                   |
| Predict-on Enable                         | 0xF9 | 0x4C |   1    | predict_on_enable, values: (0: disable, 1: enable)                                                                                                       |
| Valve Opening Display Enable              | 0xF9 | 0x4D |   1    | valve_opening_display_enable, values: (0: disable, 1: enable)                                                                                            |
| Fixed Preheating Time                     | 0xF9 | 0x4E |   2    | fixed_preheating_time, unit: minute, range: [1, 1440], default: 60                                                                                       |
| System Key Enable                         | 0xF9 | 0x4F |   1    | system_key_enable, values: (0: disable, 1: enable)                                                                                                       |
| Heating Schedule Enable                   | 0xF9 | 0x50 |   2    | heating_schedule_enable.id [0, 15], .enable, values: (0: disable, 1: enable)<br/>only toggles enable state, does not change other schedule fields         |

### Downlink Response

Only commands where the device is documented to echo a confirmation are decoded. Undocumented echo formats are not implemented to avoid guessing at unverified byte layouts.

| CHANNEL         | ID   | TYPE | LENGTH | DESCRIPTION                                                                          |
| :--------------- | :--: | :--: | :----: | ------------------------------------------------------------------------------------- |
| Report Interval  | 0xFE | 0x8E |   3    | report_interval(2B), reply to Report Interval configuration; device silent if out of range |
| Time Zone        | 0xFE | 0xBD |   2    | time_zone(2B), reply to Time Zone configuration; device silent on failure              |
| Valve Descale    | 0xFE | 0x29 |   1    | valve_descale, reply to Trigger Valve Descale; echo only means the command was accepted, not that descaling has completed (see uplink 0x84) |

### Service

Service commands trigger one-shot device actions rather than persistent configuration.

| CHANNEL                                  | ID   | TYPE | LENGTH | DESCRIPTION                                                                                                                    |
| :------------------------------------------ | :--: | :--: | :----: | ---------------------------------------------------------------------------------------------------------------------------------- |
| Reboot                                   | 0xFF | 0x10 |   1    | reboot, values: (0: no, 1: yes)<br/>keeps configuration/calibration data, unlike Reset                                          |
| Immediate Time Sync                      | 0xFF | 0x4A |   1    | sync_time, values: (0: no, 1: yes)                                                                                              |
| Query Device Status                      | 0xFF | 0x28 |   1    | report_status, values: (0: report a periodic packet immediately, 1: query heating date, 2: query heating schedule)             |
| Trigger Valve Descale                    | 0xFF | 0x29 |   1    | valve_descale, values: (0: no, 1: yes)<br/>result reported asynchronously on uplink channel 0x84                                |
| Open Window Status                       | 0xFF | 0x57 |   1    | open_window_status, values: (0: clear open window, 1: trigger open window)                                                     |
| Trigger Motor Stroke Calibration         | 0xFF | 0xAD |   1    | valve_calibration, values: (0: no, 1: yes)                                                                                      |
| Set Current Temperature (External Mode)  | 0x03 | -    |   4    | outside_temperature(2B), int16/100, unit: °C, followed by 1 reserved byte (0xFF); no TYPE byte in this command                  |
| Reset                                     | 0xFF | 0xFE |   1    | reset, values: (0: no, 1: yes)<br/>restores factory defaults, clears network join info, calibration data and control runtime state |

## Sample

```json
// FF0BFF
{
    "boot_event": "yes"
}

// FF0101
{
    "ipso_version": "v0.1"
}

// FFFF0100
{
    "tsl_version": "v1.0"
}

// FF090110
{
    "hardware_version": "v1.1"
}

// FF0A0110
{
    "firmware_version": "v1.10"
}

// FF0F01
{
    "lorawan_class": "Class B"
}

// FFFEFF
{
    "tsl_config_request": "yes"
}

// FF08112233445566
{
    "sn": "112233445566"
}

// FF161122334455667788
{
    "sn": "1122334455667788"
}

// 017561 03670A01 04670A01 059264 06CB03
{
    "battery": 97,
    "temperature": 2.66,
    "temperature_target": 2.66,
    "valve_opening": 100,
    "level": 3
}

// 070001
{
    "open_window_detection": "open"
}

// 08E500
{
    "motor_calibration_status": "success"
}

// 08E505
{
    "motor_calibration_status": "fail: low battery"
}

// 09900802
{
    "motor_stroke": 520
}

// 0A0001
{
    "freeze_protection_status": "triggered"
}

// 0B900000
{
    "motor_position": 0
}

// 0C9232
{
    "valve_opening_target": 50
}

// 10C06164640AB80B03
{
    "battery": 97,
    "valve_opening": 100,
    "temperature": 26.6,
    "temperature_target": 30,
    "level": 3
}

// 11C161646406400A
{
    "battery": 97,
    "valve_opening": 100,
    "temperature": 16.36,
    "temperature_target": 26.24
}

// 12C26164640A32
{
    "battery": 97,
    "valve_opening": 100,
    "temperature": 26.6,
    "valve_opening_target": 50
}

// 13C36164
{
    "battery": 97,
    "valve_opening": 100
}

// 8367AC0801
{
    "temperature_alarm": {
        "temperature": 22.2,
        "alarm": "high temperature alarm trigger"
    }
}

// 849264010000
{
    "valve_descale_result": {
        "valve_opening": 100,
        "trigger_source": "manual",
        "result": "success",
        "fail_reason": "none"
    }
}

// 849200010102
{
    "valve_descale_result": {
        "valve_opening": 0,
        "trigger_source": "manual",
        "result": "fail",
        "fail_reason": "not off-season"
    }
}

// 8567AC0801
{
    "open_window_event": {
        "temperature": 22.2,
        "status": "open"
    }
}

// 8667AC080164
{
    "frost_protection_event": {
        "temperature": 22.2,
        "status": "triggered",
        "valve_opening": 100
    }
}

// 870001
{
    "temperature_source_fault": "fault"
}

// 870000
{
    "temperature_source_fault": "normal"
}

// FE8E000500 (downlink response, uplink direction)
{
    "report_interval": 5
}

// FEBD10FF (downlink response, uplink direction)
{
    "time_zone": -240
}

// FE2900 (downlink response, uplink direction)
{
    "valve_descale": "yes"
}
```

## Downlink Sample

```json
// { "reboot": "yes" } -> FF10FF
// { "sync_time": "yes" } -> FF4AFF
// { "report_status": "report a periodic packet immediately" } -> FF2800
// { "report_status": "query heating date" } -> FF2801
// { "report_status": "query heating schedule" } -> FF2802
// { "valve_descale": "yes" } -> FF2900
// { "open_window_status": "clear open window" } -> FF5700
// { "open_window_status": "trigger open window" } -> FF5701
// { "valve_calibration": "yes" } -> FFADFF
// { "outside_temperature": 20 } -> 03D007FF
// { "reset": "yes" } -> FFFEFF

// { "time_sync_enable": "enable" } -> FF3B02
// { "report_interval": 5 } -> FF8E000500
// { "temperature_control_mode": "valve opening control" } -> FFAE02
// { "temperature_calibration": { "enable": "enable", "value": 5 } } -> FFAB01F401
// { "temperature_control_algorithm": "platform" } -> FFAC01
// { "freeze_protection": { "enable": "enable", "temperature": 5 } } -> FFB001F401
// { "open_window_detection": { "enable": "enable", "temperature_threshold": 2, "time": 1 } } -> FFAF01C8000100
// { "temperature_control_enable": "enable" } -> FFB301
// { "valve_opening": 100 } -> FFB464
// { "child_lock": { "enable": "all keys locked" } } -> FF2501
// { "time_zone": -240 } -> FFBD10FF
// { "dst_config": { "enable": "enable", "offset": 60, "start_month": 3, "start_week_num": 2, "start_week_day": 7, "start_time": 120, "end_month": 1, "end_week_num": 4, "end_week_day": 1, "end_time": 120 } } -> FFBA013C0327780001417800
// { "heating_schedule_enable": { "id": 5, "enable": "enable" } } -> F9500501
```
