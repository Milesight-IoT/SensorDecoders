# Industrial Temperature Sensor - Milesight IoT

The payload decoder function is applicable to EM500-PT100.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

![EM500-PT100](EM500-PT100.png)

## Payload Definition

|     channel     | channel_id | channel_type | data_length (bytes) | description                     |
| :-------------: | :--------: | :----------: | :-----------------: | ------------------------------- |
|     battery     |    0x01    |     0x75     |          1          | unit: %                         |
|   temperature   |    0x03    |     0x67     |          2          | unit: ℃                         |
| historical data |    0x20    |     0XCE     |          6          | timestamp(4B) + temperature(2B) |

## Example

```json
// Sample(hex): 01 75 64 03 67 19 01
{
    "battery": 100,
    "temperature": 28.1
}
```
