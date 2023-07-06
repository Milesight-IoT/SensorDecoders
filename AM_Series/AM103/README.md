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
|   temperature   |    0x03    |     0x67     |          2          | unit: ℃                                                 |
|    humidity     |    0x04    |     0x68     |          1          | unit: %RH                                                |
|    co2          |    0x07    |     0x7D     |          2          | unit: ppm                                                |
| historical data |    0x20    |     0xCE     |          9          | timestamp(4B) + temperature(2B) + humidity(1B) + CO2(2B) |

## Example

```json
// Sample: 0175640367180104686D077DC501
{
    "battery": 100,
    "co2": 453,
    "temperature": 28,
    "humidity": 54.5
}
```
