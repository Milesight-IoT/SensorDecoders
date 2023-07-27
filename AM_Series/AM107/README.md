# Ambience Monitoring Sensors - Milesight IoT

The payload decoder function is applicable toAM107(AM102).

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

![AM107](AM107.png)

## Payload Definition

|   channel    | channel_id | channel_type | data_length (bytes) | description |
| :----------: | :--------: | :----------: | :-----------------: | ----------- |
|   battery    |    0x01    |     0x75     |          1          | unit: %     |
| temperature  |    0x03    |     0x67     |          2          | unit: ℃     |
|   humidity   |    0x04    |     0x68     |          1          | unit: %RH   |
|   activity   |    0x05    |     0x6A     |          2          | unit:       |
| illumination |    0x06    |     0x65     |          6          | unit: lux   |
|     CO2      |    0x07    |     0x7D     |          2          | unit: ppm   |
|     tVOC     |    0x08    |     0x7D     |          2          | unit: ppb   |
|   pressure   |    0x09    |     0x73     |          2          | unit: hPa   |

## Example

```json
// Sample: 01 75 5C 03 67 34 01 04 68 65 05 6A 49 00 06 65 1C 00 79 00 14 00 07 7D E7 04 08 7D 07 00 09 73 3F 27
{
    "battery": 92,
    "temperature": 30.8,
    "humidity": 50.5,
    "activity": 73,
    "illumination": 28,
    "infrared": 20,
    "infrared_and_visible": 121,
    "co2": 1255,
    "tvoc": 7,
    "pressure": 1004.7
}
```
