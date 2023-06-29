# Ambience Monitoring Sensors - Milesight IoT

The payload decoder function is applicable to AM104 (AM100).

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

|        AM104        |
| :-----------------: |
| ![AM104](AM104.png) |

## Payload Definition

|   channel    | channel_id | channel_type | data_length (bytes) | description |
| :----------: | :--------: | :----------: | :-----------------: | ----------- |
|   battery    |    0x01    |     0x75     |          1          | unit: %     |
| temperature  |    0x03    |     0x67     |          2          | unit: ℃     |
|   humidity   |    0x04    |     0x68     |          1          | unit: %RH   |
|   activity   |    0x05    |     0x6A     |          2          | unit:       |
| illumination |    0x06    |     0x65     |          6          | unit: lux   |

## Example

```json
// Sample: 01 75 5C 03 67 34 01 04 68 65 05 6A 49 00 06 65 1C 00 79 00 14 00
{
    "battery": 92,
    "temperature": 30.8,
    "humidity": 50.5,
    "activity": 73,
    "illumination": 28,
    "infrared": 20,
    "infrared_and_visible": 121
}
```
