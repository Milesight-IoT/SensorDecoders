# Solenoid Valve Controller - Milesight IoT

The payload decoder function is applicable to UC511 / UC512.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

|         UC511          |         UC512          |
| :--------------------: | :--------------------: |
| ![UC511](UC511_v3.png) | ![UC512](UC512_v3.png) |

## Payload Definition

|     CHANNEL     |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                           |
| :-------------: | :--: | :--: | :----: | ----------------------------------------------------------------------------------------------------- |
|     Battery     | 0x01 | 0x75 |   1    | battery(1B)<br/>battery, unit：%                                                                      |
|     Valve 1     | 0x03 | 0x01 |   1    | valve_1(1B)<br/>valve_1, values: (0：close, 1：open)                                                  |
|  Valve 1 Pulse  | 0x04 | 0xC8 |   4    | valve_1_pulse(4B)                                                                                     |
|     Valve 2     | 0x05 | 0x01 |   1    | valve_2(1B)<br/>valve_2, values: (0：close, 1：open)                                                  |
|  Valve 2 Pulse  | 0x06 | 0xC8 |   4    | valve_2_pulse(4B)                                                                                     |
|     GPIO 1      | 0x07 | 0x01 |   1    | gpio_1(1B)<br/>gpio_1, values: (0：off, 1：on)                                                        |
|     GPIO 2      | 0x08 | 0x01 |   1    | gpio_2(1B)<br/>gpio_2, values: (0：off, 1：on)                                                        |
| Historical Data | 0x20 | 0xCE |   9    | timestamp(4B) + status(1B) + pulse(4B)<br/>NOTE: the data of two solenoid valves are sent separately. |

## Example

```json
// 01755C 030100 04C805000000
{
    "battery": 92,
    "valve_1": "close",
    "valve_1_pulse": 5
}


// 20CE3FA109641700000000
{
    "history": [
        {
            "gpio_2": "on",
            "mode": "gpio",
            "timestamp": 1678352703,
            "valve_2": "open"
        }
    ]
}
```
