# Smart Thermostat - WT201

![WT201 v2](WT201-v2.png)

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/wt201)

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
|--------+--------+---------+--------+--------+---------+
```

### Attribute

|    CHANNEL    |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                       |
| :-----------: | :--: | :--: | :----: | ------------------------------------------------------------------------------------------------ |
|     IPSO      | 0xFF | 0x01 |   1    | ipso_version(1B)                                                                                 |
|   Hardware    | 0xFF | 0x09 |   2    | hardware_version(2B)<br/>hardware_version, e.g. 0110 -> v1.1                                     |
|   Firmware    | 0xFF | 0x0A |   2    | firmware_version(2B)<br/>firmware_version, e.g. 0110 -> v1.10                                    |
|      TSL      | 0xFF | 0xFF |   2    | tsl_version(2B)                                                                                  |
| Serial Number | 0xFF | 0x16 |   2    | sn(8B)                                                                                           |
| LoRaWAN Class | 0xFF | 0x0F |   1    | lorawan_class(1B)<br/>lorawan_class, values: (0: Class A, 1: Class B, 2: Class C, 3: Class CtoB) |
|  Reset Event  | 0xFF | 0xFE |   1    | reset_event(1B)                                                                                  |
| Device Status | 0xFF | 0x0B |   1    | device_status(1B)                                                                                |
| Query Type(7340) | 0xFF | 0x28 |   1    | query_type(1B)<br/>query_type, values: (0: plan, 1: periodic, 2: target_temperature_range, 3: attributes, 4: lora, 5: tempCtrl_tolerance, 6: level_switch_condition_settings, 7: temperature_control_delta_settings, 8: wire_setting, 9: fans_setting, 10: yaux_setting, 11: target_humidity_range, 12: button_lock, 13: time_setting, 14: relay_status) |

### Telemetry

| CHANNEL                     |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                                                                                                                                                                                                                                                                                                                                          |
| :-------------------------- | :--: | :--: | :----: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Protocol Version            | 0xFF | 0x01 |   1    | protocol_version(1B)                                                                                                                                                                                                                                                                                                                                                                                                 |
| Device Status               | 0xFF | 0x0B |   1    | device_status(1B)                                                                                                                                                                                                                                                                                                                                                                                                    |
| Serial Number               | 0xFF | 0x16 |   8    | sn(8B)                                                                                                                                                                                                                                                                                                                                                                                                               |
| Hardware Version            | 0xFF | 0x09 |   2    | hardware_version(2B)                                                                                                                                                                                                                                                                                                                                                                                                 |
| Firmware Version            | 0xFF | 0x0A |   2    | firmware_version(2B)                                                                                                                                                                                                                                                                                                                                                                                                 |
| LoRaWAN Class Type          | 0xFF | 0x0F |   1    | lorawan_class(1B)<br/>lorawan_class, values: (0: classA, 1: classB, 2: classC, 3: classCtoB)                                                                                                                                                                                                                                                                                                                         |
| TSL Version                 | 0xFF | 0xFF |   2    | tsl_version(2B)                                                                                                                                                                                                                                                                                                                                                                                                      |
| Ambient Temperature         | 0x03 | 0x67 |   2    | temperature(2B)<br/>temperature, unit: °C, read: int16/10                                                                                                                                                                                                                                                                                                                                                            |
| Target Temperature          | 0x04 | 0x67 |   2    | temperature_target(2B)<br/>temperature_target, unit: °C, read: int16/10                                                                                                                                                                                                                                                                                                                                              |
| Temperature Control         | 0x05 | 0xE7 |   1    | temperature_ctl_mode(0..1) + temperature_ctl_status(4..7)<br/>temperature_ctl_mode, values: (0: heat, 1: em heat, 2: cool, 3: auto, 4: occupied, 5: vacant, 6: eco)<br/>temperature_ctl_status: (0: standby, 1: stage-1 heat, 2: stage-2 heat, 3: stage-3 heat, 4: stage-4 heat, 5: em heat, 6: stage-1 cool, 7: stage-2 cool)                                                                                       |
| Fan Control                 | 0x06 | 0xE8 |   1    | fan_mode(0..1) + fan_status(2..3)<br/>fan_mode, values: (0: auto, 1: on, 2: circulate, 3: disable)<br/>fan_status, values: (0: standby, 1: high speed, 2: low speed, 3: on)                                                                                                                                                                                                                                          |
| Plan Event                  | 0x07 | 0xBC |   1    | plan_event(0..3)<br/>plan_event, values: (0: not executed, 1: wake, 2: away, 3: home, 4: sleep, 5: occupied, 6: vacant, 7: eco)                                                                                                                                                                                                                                                                                      |
| System Status               | 0x08 | 0x8E |   1    | system_status(1B)<br/>system_status, values: (0: off, 1: on)                                                                                                                                                                                                                                                                                                                                                         |
| Humidity                    | 0x09 | 0x68 |   1    | humidity(1B)<br/>humidity, unit: %r.h., read: int8/2                                                                                                                                                                                                                                                                                                                                                                   |
| Wires Relay Status          | 0x0A | 0x6E |   1    | wire_relay_status(1B)                                                                                                                                                                                                                                                                                                                                                                                                |
| Plan                        | 0xFF | 0xC9 |   6    | type(1B) + index(1B) + plan_enable(1B) + week_recycle(1B) + time(1B)<br/>type, values: (0: wake, 1: away, 2: home, 3: sleep, 4: occupied, 5: vacant, 6: eco)<br/>index, range: [0, 15]<br/>week_recycle, read: bits, (bit1: mon, bit2: tues, bit3: wed, bit4: thur, bit5: fri, bit6: sat, bit7: sun)<br/>time, unit: mins                                                                                            |
| Wires                       | 0xFF | 0xCA |   3    | value1(1B) + value2(1B) + value3(1B)<br/>value1, bit0-bit1: y1, bit2-bit3: gh, bit4-bit5: o/b, bit6-bit7: w1<br/>value2, bit0-bit1: e, bit2-bit3: di, bit4-bit5: pek, bit6-bit7: (1: w2, 2: aux)<br/>value3, bit0-bit1: (1: y2, 2: gl), bit2-bit3: (0: cool, 1: heat)                                                                                                                                                |
| Temperature Mode Support    | 0xFF | 0xCB |   3    | mode_enable(1B) + heat_level_enable(1B) + cool_level_enable(1B)<br/>mode_enable, read: bits, (bit0: heat, bit1: em heat, bit2: cool, bit3: auto)<br/>heat_level_enable, read: bits, (bit0: stage-1 heat, bit1: stage-2 heat, bit2: stage-3 heat, bit3: stage-4 heat, bit4: aux heat)<br/>cool_level_enable: read: bits, (bit0: stage-1 cool, bit1: stage-2 cool)                                                     |
| Control Permissions         | 0xFF | 0xF6 |   1    | control_permissions(1B)<br/>control_permissions, values: (0: thermostat, 1: remote control)                                                                                                                                                                                                                                                                                                                          |
| Temperature Alarm           | 0x83 | 0x67 |   3    | temperature(2B) + temperature_alarm(1B)<br/>temperature, unit: °C, read: int16/10<br/>temperature_alarm, values: (1: emergency heating timeout, 2: auxiliary heating timeout, 3: persistent low temperature, 4: persistent low temperature release, 5: persistent high temperature, 6: persistent high temperature release, 7: freeze protection, 8: freeze protection release, 9: threshold, 10: threshold release) |
| Temperature Exception       | 0xB3 | 0x67 |   1    | temperature_exception(1B)<br/>temperature_exception, values: (1: read failed, 2: out of range)                                                                                                                                                                                                                                                                                                                       |
| Humidity Exception          | 0xB9 | 0x68 |   1    | humidity_exception(1B)<br/>humidity_exception, values: (1: read failed, 2: out of range)                                                                                                                                                                                                                                                                                                                             |
| ｜ Temperature Target Alarm | 0xF9 | 0x40 |   6    | temperature_target(2B) + temperature_target_range_min(2B) + temperature_target_range_max(2B)                                                                                                                                                                                                                                                                                                                         |
| Historical Data             | 0x20 | 0xCE |   8    | timestamp(4B) + mode(2B) + temperature_target(2B) + temperature(2B) + humidity(1B)<br/>timestamp, unit: s, read: uint32<br/>value, temperature_control_status(0) + fan_mode(1..2) + fan_status(3..4) + temperature_control_mode(5..6) + temperature_control_status(7..10)<br/>temperature_target, unit: °C, read: unit16 / 10<br/>humidity, unit: %, read: uint8/2                                                   |
| D2D Info(7340)              | 0x0B | 0x5D |   7    | deveui(5B) + snr(1B) + rssi(1B)<br/>deveui, device EUI (prefixed with 24e124)<br/>snr, range: [-128, 127], unit: dBm, read: int8<br/>rssi, range: [-128, 127], unit: dBm, read: int8                                                                                                                                                                                                                                                                         |
| LoRa Info(7340)             | 0x0C | 0x5E |   8    | tx_sf(1B) + tx_dr(1B) + tx_power(1B) + win2_dr(1B) + win2_freq(4B)<br/>tx_sf, range: [0, 255]<br/>tx_dr, range: [0, 255]<br/>tx_power, range: [0, 255], unit: dBm<br/>win2_dr, range: [0, 255]<br/>win2_freq, range: [0, 0xFFFFFFFF], unit: Hz, read: uint32                                                                                                                                                                                                 |
| Device Time(7340)           | 0x0D | 0x5F |   5    | reserved(1B) + time(4B)<br/>time, range: [0, 0xFFFFFFFF], unit: s, read: uint32                                                                                                                                                                                                                                                                                                                                                              |
| Daylight Saving Time(7340)  | 0x0E | 0x60 |   9    | enable(0..0) + offset(1..7) + start_month(1B) + start_day(1B) + start_time(2B) + end_month(1B) + end_day(1B) + end_time(2B)<br/>enable, values: (0: disable, 1: enable)<br/>offset, range: [1, 120], unit: minutes<br/>start_month/end_month, range: [1, 12], read: uint8<br/>start_day/end_day, read: bits, week_num(4..7) + week_day(0..3), week_num: range[1, 5], week_day: range[1, 7]<br/>start_time/end_time, range: [0, 1439], unit: minutes, read: uint16                                                                                         |
| Enable Mask(7340)           | 0xF9 | 0x64 |   4    | cfg_report_mask(4B)<br/>cfg_report_mask, read: bits, (bit0: plan, bit1: periodic, bit2: target_temperature_range, bit3: attributes, bit4: lora, bit5: tempCtrl_tolerance, bit6: level_switch_condition_settings, bit7: temperature_control_delta_settings, bit8: wire_setting, bit9: fans_setting, bit10: yaux_setting, bit11: target_humidity_range, bit12: button_lock, bit13: time_setting, bit14: relay_status)<br/>values: (0: disable, 1: enable)<br/>read: uint32  |
| Actively Report(7340)       | 0xF9 | 0x65 |   1    | cfg_report_enable(1B)<br/>cfg_report_enable, values: (0: disable, 1: enable)                                                                                                                                                                                                                                                                                                                                            |
| Up Time(7340)               | 0xF9 | 0x66 |   2    | cfg_report_time(2B)<br/>cfg_report_time, range: [0, 1439], unit: minutes, read: uint16                                                                                                                                                                                                                                                                                                                                              |
| Up Counts(7340)             | 0xF9 | 0x67 |   1    | cfg_report_counts(1B)<br/>cfg_report_counts, range: [1, 12], read: uint8                                                                                                                                                                                                                                                                                                                                                            |

### WIRES(3B)

#### WIRES-BYTE1

| BITS | 7..6 | 5..4 | 3..2 | 1..0 |
| :--: | :--: | :--: | :--: | :--: |
| LINE |  W1  | O/B  |  GH  |  Y1  |

#### WIRES-BYTE2

| BITS |   7..6    | 5..4 | 3..2 | 1..0 |
| :--: | :-------: | :--: | :--: | :--: |
| LINE | W2 or AUX | PEK  |  DI  |  E   |

#### WIRES-BYTE3

| BITS | 7..4 |       3..2        | 1..0  |
| :--: | :--: | :---------------: | :---: |
| LINE | RFU  | O/B: COOL or HEAT | Y2/GL |

### WIRE RELAY(2B)

```
+-------+--------+--------+--------+--------+--------+--------+--------+
|   7   |    6   |    5   |    4   |    3   |    2   |    1   |    0   |
+-------+--------+--------+--------+--------+--------+--------+--------+
|  RFU  |   O/B  |    G   |    E   | W2/AUX |   W1   |  Y1/GL |   Y1   |

```

# Sample

```json
// 03670201 0467A600 05E700 06E800 07BC00
{
    "fan_mode": "auto",
    "fan_status": "standby",
    "plan_event": "not executed",
    "temperature": 25.8,
    "temperature_ctl_mode": "heat",
    "temperature_ctl_status": "standby",
    "temperature_target": 16.6
}

// 8367FB0009
{
    "temperature": 25.1,
    "temperature_alarm": "threshold alarm"
}

// 20CE5C470A65D09EC091
{
    "history": [
        {
            "fan_mode": "auto",
            "fan_status": "standby",
            "system_status": "on",
            "temperature": 27,
            "temperature_ctl_mode": "heat",
            "temperature_ctl_status": "standby",
            "temperature_target": 16.6,
            "timestamp": 1695172444
        }
    ]
}

// FFCB0D1101 FFCA158004
{
    "ob_mode": "heat",
    "temperature_ctl_mode_enable": ["heat", "cool", "auto"],
    "temperature_ctl_status_enable": ["stage-1 heat", "aux heat", "stage-1 cool"],
    "wires": ["y1", "gh", "ob", "aux"]
}

// FFC900000000B302 FFC9020101280000
{
    "plan_schedule": [
        {
            "index": 1,
            "plan_enable": "disable",
            "time": "11:31",
            "type": "wake",
            "week_recycle": []
        },
        {
            "index": 2,
            "plan_enable": "enable",
            "time": "0:00",
            "type": "home",
            "week_recycle": [
                "Wed.",
                "Fri."
            ]
        }
    ]
}

// FFC80303014E36
{
    "plan_settings": [
        {
            "fan_mode": "on",
            "temperature_ctl_mode": "auto",
            "temperature_error": 5.4,
            "temperature_target": 78,
            "type": "sleep"
        }
    ]
}

// ODM 7340 - D2D Info: 0B5D0102030405F5C8
{
    "d2d_info": {
        "deveui": "24e1240102030405",
        "snr": -11,
        "rssi": -56
    }
}

// ODM 7340 - LoRa Info: 0C5E0A050E03000C8F01
{
    "lora_info": {
        "tx_sf": 10,
        "tx_dr": 5,
        "tx_power": 14,
        "win2_dr": 3,
        "win2_freq": 26151936
    }
}

// ODM 7340 - Device Time: 0D5F005C470A65
{
    "dev_time": {
        "time": 1695172444
    }
}

// ODM 7340 - DST Config: 0E6083031200000141B400
{
    "dst_config": {
        "enable": "enable",
        "end_month": "Jan.",
        "end_time": "03:00",
        "end_week_day": "Mon.",
        "end_week_num": "4th",
        "offset": 3,
        "start_month": "Mar.",
        "start_time": "00:00",
        "start_week_day": "Tues.",
        "start_week_num": "1st"
    }
}

// ODM 7340 - Query Type: FF2804
{
    "query_type": "lora"
}

// ODM 7340 - Device Status Mask: F9640000700F
{
    "cfg_report_mask": {
        "attributes": "enable",
        "button_lock": "enable",
        "fans_setting": "disable",
        "level_switch_condition_settings": "disable",
        "lora": "disable",
        "periodic": "enable",
        "plan": "enable",
        "relay_status": "enable",
        "target_humidity_range": "disable",
        "target_temperature_range": "enable",
        "tempCtrl_tolerance": "disable",
        "temperature_control_delta_settings": "disable",
        "time_setting": "enable",
        "wire_setting": "disable",
        "yaux_setting": "disable"
    }
}

// ODM 7340 - Actively Report: F96501
{
    "cfg_report_enable": "enable"
}

// ODM 7340 - Up Time: F966F000
{
    "cfg_report_time": 240
}

// ODM 7340 - Up Counts: F96703
{
    "cfg_report_counts": 3
}
```
