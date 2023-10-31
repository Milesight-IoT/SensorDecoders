# Pulse Counter - Milesight IoT

The payload decoder function is applicable to EM300-DI.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

![EM300-DI](EM300-DI.png)

## Payload Definition

|     CHANNEL     |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :-------------: | :--: | :--: | :----: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     Battery     | 0x01 | 0x75 |   1    | battery(1B)<br/>battery, unit: %                                                                                                                                                                                                                                                                                                                                                                                              |
|   Temperature   | 0x03 | 0x67 |   2    | temperature(2B)<br/>temperature, unit: °C                                                                                                                                                                                                                                                                                                                                                                                     |
|    Humidity     | 0x04 | 0x68 |   1    | humidity(1B)<br/>humidity, unit: %                                                                                                                                                                                                                                                                                                                                                                                            |
|      GPIO       | 0x05 | 0x00 |   1    | gpio(1B)                                                                                                                                                                                                                                                                                                                                                                                                                      |
|      GPIO       | 0x05 | 0xC8 |   4    | pulse(4B)                                                                                                                                                                                                                                                                                                                                                                                                                     |
|      Water      | 0x06 | 0xE1 |   8    | water_conv(2b) + pulse_conv(2B) + water(4B)<br/>NOTE: water_conv/pulse_conv \* counter = water                                                                                                                                                                                                                                                                                                                                |
|   GPIO Alarm    | 0x85 | 0x00 |   1    | gpio(1B) + gpio_alarm(1B)<br/>gpio, values: (0: low, 1: high)<br/>gpio_alarm, values:(1: gpio alarm, 0: gpio alarm release)                                                                                                                                                                                                                                                                                                   |
|   Water Alarm   | 0x86 | 0xE1 |   9    | water_conv(2b) + pulse_conv(2B) + water(4B) + water_alarm(1B)<br/>water_alarm, (1: water outage timeout alarm, 2: water outage timeout alarm release, 3: water flow timeout alarm, 4: water flow timeout alarm release)                                                                                                                                                                                                       |
| Historical Data | 0x20 | 0xCE |   13   | timestamp(4B) + temperature(2B) + humidity(1B) + gpio_type(1B) + gpio(1B) + pulse(4B)<br/>gpio_type values: (1: gpio, 2: pulse)<br/>gpio values: (0: low, 1: high)                                                                                                                                                                                                                                                            |
| Historical Data | 0x21 | 0xCE |   18   | timestamp(4B) + temperature(2B) + humidity(1B) + alarm(1B) + gpio_type(1B) + gpio(1B) + water_conv(2B) + pulse_conv(2B) + water(4B)<br/>gpio_type, values: (1: gpio, 2: pulse)<br/>gpio, values: (0: low, 1: high)<br/>alarm, values: (0: none, 1: water outage timeout alarm, 2: water outage timeout alarm release, 3: water flow timeout alarm, 4: water flow timeout alarm release, 5: gpio alarm, 6: gpio alarm release) |

## Example

```json
// 01755C 03673401 046865 20CE9E74466310015D020000010000
{
    "battery": 92,
    "temperature": 30.8,
    "humidity": 50.5,
    "history": [
        {
            "temperature": 27.2,
            "humidity": 46.5,
            "pulse": 256,
            "timestamp": 1665561758
        }
    ]
}
```
