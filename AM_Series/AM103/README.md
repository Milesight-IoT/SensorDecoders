# Ambience Monitoring Sensors - Milesight IoT

The payload decoder function is applicable to AM103, AM103L

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

|        AM103        |        AM103L         |
| :-----------------: | :-------------------: |
| ![AM103](AM103.png) | ![AM103L](AM103L.png) |

## Payload Definition

|     channel     | channel_id | channel_type | data_length (bytes) | description                                              |
| :-------------: | :--------: | :----------: | :-----------------: | -------------------------------------------------------- |
|     battery     |    0x01    |     0x75     |          1          | unit: %                                                  |
|   temperature   |    0x03    |     0x67     |          2          | unit: ℃                                                  |
|    humidity     |    0x04    |     0x68     |          1          | unit: %RH                                                |
| historical data |    0x20    |     0xCE     |          9          | timestamp(4B) + temperature(2B) + humidity(1B) + CO2(2B) |

## Example

```json
// Sample: 01 75 5C 03 67 34 01 04 68 65
{
    "battery": 92,
    "temperature": 30.8,
    "humidity": 50.5
}
```
