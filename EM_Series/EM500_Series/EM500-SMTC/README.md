# Soil Moisture, Temperature and Electrical Conductivity Sensor - Milesight IoT

The payload decoder function is applicable to EM500-SMTC.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

![EM500-SMTC](EM500-SMTC.png)

## Payload Definition

|     channel     | channel_id | channel_type | data_length (bytes) | description                                             |
| :-------------: | :--------: | :----------: | :-----------------: | ------------------------------------------------------- |
|     battery     |    0x01    |     0x75     |          1          | unit: %                                                 |
|   temperature   |    0x03    |     0x67     |          2          | unit: ℃                                                 |
|    moisture     |    0x04    |     0x68     |          1          | unit: %RH                                               |
|    moisture     |    0x04    |     0xCA     |          2          | unit: %RH                                               |
|       EC        |    0x05    |     0x7F     |          2          | unit: µs/cm                                             |
| historical data |    0x20    |     0XCE     |         10          | timestamp(4B) + EC(2B) + temperature(2B) + moisture(2B) |

## Example

```json
// Sample: 01 75 64 03 67 19 01 04 68 73 05 7F F0 00
{
    "battery": 100,
    "temperature": 28.1,
    "moisture": 57.5,
    "ec": 240
}
```
