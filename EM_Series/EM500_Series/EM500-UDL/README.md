# Ultrasonic Distance/Level Sensor - Milesight IoT

![EM500-UDL](EM500-UDL.png)

The payload decoder function is applicable to EM500-UDL.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

## Payload Definition

|     channel     | channel_id | channel_type | data_length (bytes) | description                  |
| :-------------: | :--------: | :----------: | :-----------------: | ---------------------------- |
|     battery     |    0x01    |     0x75     |          1          | unit: %                      |
|    distance     |    0x03    |     0x82     |          2          | unit: mm                     |
| historical data |    0x20    |     0XCE     |          6          | timestamp(4B) + distance(2B) |

## Example

```json
// 01 75 64 03 82 1E 00
{
    "battery": 100,
    "distance": 30
}
```
