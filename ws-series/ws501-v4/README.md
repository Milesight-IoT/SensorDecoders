# Smart Wall Switch - WS501

![WS501](ws501-v4.png)

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/)

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

|    CHANNEL    |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                      |
| :-----------: | :--: | :--: | :----: | ------------------------------------------------------------------------------------------------ |
|     IPSO      | 0xFF | 0x01 |   1    | ipso_version(1B)                                                                                 |
|   Hardware    | 0xFF | 0x09 |   2    | hardware_version(2B)<br/>hardware_version, e.g. 0110 -> v1.1                                     |
|   Firmware    | 0xFF | 0x0A |   2    | firmware_version(2B)<br/>firmware_version, e.g. 0110 -> v1.10                                    |
|      TSL      | 0xFF | 0xFF |   2    | tsl_version(2B)                                                                                  |
| Serial Number | 0xFF | 0x16 |   8    | sn(8B)                                                                                           |
| LoRaWAN Class | 0xFF | 0x0F |   1    | lorawan_class(1B)<br/>lorawan_class, values: (1: Class B, 2: Class C)                            |
|  Reset Event  | 0xFF | 0xFE |   1    | reset_event(1B)                                                                                  |
| Device Status | 0xFF | 0x0B |   1    | device_status(1B)                                                                                |

### Telemetry

|    CHANNEL                  |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                                                                |
| :-------------------------: | :--: | :--: | :----: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Reporting Interval          | 0xFF | 0x03 |   2    | reporting_interval(2B)                                                                                                                     |
| Reboot                      | 0xFF | 0x10 |   1    | Reboot device                                                                                                                              |
| Button Lock Config          | 0xFF | 0x25 |   2    | enable(1B)<br/>enable, values(0: disable, 1: enable)                                                                                       |
| Report Status               | 0xFF | 0x28 |   1    | report_status(1B)                                                                                                                          |
| Button Status               | 0xFF | 0x29 |   1    | button_status1(0..1)+button_status1_change(4..5)<br/>button_status1, values(0: off, 1: on)<br/>button_status1_change, values(0: no, 1: yes)|
| Report Attribute            | 0xFF | 0x2C |   1    | report_attribute(1B)                                                                                                                       |
| LED Mode                    | 0xFF | 0x2F |   1    | led_mode(1B)<br/>led_mode, values(0: disable, 1: Enable (relay closed indicator off))                                                      |
| Button Reset Config         | 0xFF | 0x5E |   1    | button_reset_config(1B)<br/>button_reset_config, values(0: disable, 1: enable)                                                             |
| Power Consumption 3W Enable | 0xFF | 0x26 |   1    | power_consumption_3w(1B)<br/>power_consumption_3w, values(0: disable, 1: enable)                                                           |
| Power Consumption Clear     | 0xFF | 0x27 |   1    | power_consumption_clear(1B)                                                                                                                |
| Overcurrent Alarm Config    | 0xFF | 0x24 |   2    | enable(1B)+threshold(1B)<br/>enable, values(0: disable, 1: enable)<br/>threshold, range[1, 10], unit: A                                    |
| Overcurrent Protection      | 0xFF | 0x30 |   2    | enable(1B)+threshold(1B)<br/>enable, values(0: disable, 1: enable)<br/>threshold, range[1, 10], unit: A                                    |
| High Current Config         | 0xFF | 0x8D |   1    | highcurrent_config(1B)<br/>highcurrent_config, values(0: disable, 1: enable)                                                               |
| Power Switch Mode           | 0xFF | 0x67 |   1    | power_switch_mode(1B)<br/>power_switch_mode, values(0: off, 1: on, 2: keep)                                                                |
| Time Synchronize            | 0xFF | 0x4A |   1    | time_synchronize(1B)                                                                                                                       |
| D2D Settings                | 0xFF | 0xC7 |   1    | d2d_controller_enable(0..1)+d2d_agent_enable(1..2)+d2d_controller_enable_change(4..5)+d2d_agent_enable_change(5..6)<br/>d2d_controller_enable, values(0: disable, 1: enable)<br/>d2d_agent_enable, values(0: disable, 1: enable)<br/>d2d_controller_enable_change, values(0: no, 1: yes)<br/>d2d_agent_enable_change, values(0: no, 1: yes)                |
| D2D Agent Settings          | 0xFF | 0x83 |   5    | number(1B)+enable(1B)+control_command(2B)+action_status(1B)<br/>number, range[0, 15]<br/>enable, values(0: disable, 1: enable)<br/>action_status.button, values(1: button1)<br/>action_status.button_status, values(0: off, 1: on, 2: reversal)                                                                                                            |
| Time Zone                   | 0xFF | 0xBD |   2    | time_zone(2B)                                                                                                                              |
| Schedule Settings           | 0xF9 | 0x64 |   7    | schedule_id(1B), range[1, 16]<br/>enable(0..4), values(1: enable, 2: disable)<br/>use_config(4..8), values(0, no, 1: yes)<br/>read: bits, (bit1: monday, bit2: tuesday, bit3: wednesday, bit4: thursday, bit5: friday, bit6: saturday, bit7: sunday)<br/>execut_hour(1B)<br/>execut_min(1B)<br/>button_status1(0..2), values(0: keep, 1: on, 2: off, 3: reversal)<br/>lock_status(1B), values(0: keep, 1: lock, 2: unlock)                                                                                                                                             |
| Get Schedule                | 0xF9 | 0x65 |   1    | schedule_id(1B), range[1, 16] & 255                                                                                                        |
| Power Consumption 2W        | 0xF9 | 0xAB |   7    | enable(1B)+button_power1(2B)<br/>enable, values(0: disable, 1: enable)<br/>button_power1, range[0, 1100]                                   |
| D2D Controller Settings     | 0xF9 | 0xB8 |   5    | button_id(1B)+contrl_enable(1B)+uplink(1B)+contrl_cmd(2B)<br/>button_id, values(0: button1)<br/>contrl_enable, values(0: disable, 1: enable)<br/>uplink.lora_enable(0..1), values(0: disable, 1: enable), uplink.button_enable(1..2), values(0: disable, 1: enable)                                                                                       |
| Daylight Saving Time        | 0xF9 | 0x72 |   9    | dst_bias(0..6)+enable(6..7)+start_month(1B)+start_week_num(0..3)+start_week_day(4..7)+start_hour_min(2B)+end_month(1B)+end_week_num(0..3)+end_week_day(4..7)+end_hour_min(2B)<br/>dst_bias, range[1, 120]<br/>enable, values(0: disable, 1: enable)<br/>start_month,end_month, values(1: Jan., 2: Feb., 3: Mar., 4: Apr., 5: May, 6: Jun., 7: Jul., 8: Aug. 9: Sep., 10: Oct., 11: Nov., 12: Dec.)<br/>start_week_num,end_week_num, values(1: 1st, 2: 2nd, 3: 3rd, 4: 4th, 5: last)<br/>start_week_day,end_week_day, values(1：Mon., 2：Tues., 3：Wed., 4：Thurs., 5：Fri., 6：Sat., 7：Sun.)<br/>start_hour_min,end_hour_min, values(0: 00:00, 60: 01:00, 120: 02:00, 180: 03:00, 240: 04:00, 300: 05:00, 360: 06:00, 420: 07:00, 480: 08:00, 540: 09:00, 600: 10:00, 660: 11:00, 720: 12:00, 780: 13:00, 840: 14:00, 900: 15:00, 960: 16:00, 1020: 17:00, 1080: 18:00, 1140: 19:00, 1200: 20:00, 1260: 21:00, 1320: 22:00, 1380: 23:00)                                                             |

### Status Definition

| bits |  7  |        6        |        5        |        4        |  3  |    2     |    1     |    0     |
| :--: | :-: | :-------------: | :-------------: | :-------------: | :-: | :------: | :------: | :------: |
|      |  -  | button3_change  | button2_change  | button1_change  |  -  | button3  | button2  | button1  |

## Example

```json
// Reporting Interval (FF033C00)
{
    "reporting_interval": 60
}

// Reboot (FF10FF)
{
    "reboot": "yes"
}

// Button Lock Config (FF250080)
{
    "button_lock_config": {
        "enable": "enable"
    }
}

// Report Status (FF28FF)
{
    "report_status": "yes"
}

// Button Status (FF2910)
{
    "button_status_control": {
        "button_status1": "off",
        "button_status1_change": "yes"
    }
}

// Report Attribute (FF2CFF)
{
    "report_attribute": "yes"
}

// LED Mode (FF2F00)
{
    "led_mode":"disable"
}

// Button Reset Config (FF5E01)
{
    "button_reset_config": "enable"
}

// Power Consumption 3W Enable (FF2601)
{
    "power_consumption_3w": "enable"
}

// Power Consumption Clear (FF2701)
{
    "power_consumption_clear": "yes"
}

// Overcurrent Alarm (FF24010A)
{
    "overcurrent_alarm_config": {
        "enable": "enable",
        "threshold": 10
    }
}

// Overcurrent Protection (FF300101)
{
    "overcurrent_protection": {
        "enable": "enable",
        "threshold": 1
    }
}

// High Current Config (FF8D01)
{
    "highcurrent_config": "enable"
}

// Schedule Settings (F96401117F01010102)
{
    "schedule_settings": [
        {
            "schedule_id": 1,
            "enable": "enable",
            "execut_hour": 1,
            "execut_min": 1,
            "friday": "enable",
            "lock_status": "unlock",
            "monday": "enable",
            "saturday": "enable",
            "sunday": "enable",
            "button_status1": "on",
            "thursday": "enable",
            "tuesday": "enable",
            "use_config": "yes",
            "wednesday": "enable"
        }
    ]
}

// D2D Agent Settings (FF830001191711)
{
    "d2d_agent_settings_array": [
        {
            "action_status": {
                "button": "button1",
                "button_status": "on"
            },
            "control_command": "1719",
            "enable": "enable",
            "number": 0
        }
    ]
}

// Get Schedule (F96501)
{
    "get_schedule": {
        "schedule_id": 1
    }
}

// Power Consumption 2W (F9AB01580100000000)
{
    "power_consumption_2w": {
        "button_power1": 344,
        "enable": "enable"
    }
}

// D2D Controller Settings (F9B80001023412)
{
    "d2d_controller_settings_array": [
        {
            "button_id": "button1",
            "contrl_enable": "enable",
            "uplink":{
                "lora_enable":"enable",
                "button_enable":"enable"
            },
            "contrl_cmd": "1234"
        }
    ]
}

// Daylight Saving Time (F972FF0111000002113C00)
{
    "daylight_saving_time": {
        "dst_bias": 127,
        "enable": "enable",
        "end_hour_min": "01:00",
        "end_month": "Feb.",
        "end_week_day": "Mon.",
        "end_week_num": "1st",
        "start_hour_min": "00:00",
        "start_month": "Jan.",
        "start_week_day": "Mon.",
        "start_week_num": "1st"
    }
}
```
