# Solenoid Valve Controller - Milesight IoT

The payload decoder function is applicable to UC511 / UC512.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

|         UC511          |         UC512          |
| :--------------------: | :--------------------: |
| ![UC511](UC511_v3.png) | ![UC512](UC512_v3.png) |

## Payload Definition

|      channel      | channel_id | channel_type | data_length (bytes) | description                                                                                            |
| :---------------: | :--------: | :----------: | :-----------------: | ------------------------------------------------------------------------------------------------------ |
|      battery      |    0x01    |     0x75     |          1          | unit：%                                                                                                |
|      valve_1      |    0x03    |     0x01     |          1          | 0x00：off<br />0x01：on                                                                                |
|   valve_1_pulse   |    0x04    |     0xC8     |          4          | little-endian                                                                                          |
|      valve_2      |    0x05    |     0x01     |          1          | 0x00：off<br />0x01：on                                                                                |
|   valve_2_pulse   |    0x06    |     0xC8     |          4          | little-endian                                                                                          |
|      gpio_1       |    0x07    |     0x01     |          1          | 0x00：off<br />0x01：on                                                                                |
|      gpio_2       |    0x08    |     0x01     |          1          | 0x00：off<br />0x01：on                                                                                |
| historical record |    0x20    |     0xCE     |          9          | timestamp(4B) + status(1B) + pulse(4B)<br />note: the data of two solenoid valves are sent separately. |

## Example

```json
// Sample(hex): 01 75 5C 03 01 00 04 C8 05 00 00 00
{
    "battery": 92,
    "valve_1": "off",
    "valve_1_pulse": 5
}


// Sample(hex): 20 CE 3F A1 09 64 17 00 00 00 00
{
    "history": [
        {
            "gpio_2": "on",
            "mode": "gpio",
            "timestamp": 1678352703,
            "valve_2": "on"
        }
    ]
}
```
