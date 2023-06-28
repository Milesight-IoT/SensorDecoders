# Light Sensor - Milesight IoT

The payload decoder function is applicable to EM500-LGT.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

![EM500-LGT](EM500-LGT.png)

## Payload Definition

|     channel     | channel_id | channel_type | data_length (bytes) | description                      |
| :-------------: | :--------: | :----------: | :-----------------: | -------------------------------- |
|     battery     |    0x01    |     0x75     |          1          | unit: %                          |
|  illumination   |    0x03    |     0x94     |          4          | unit: lux                        |
| historical data |    0x20    |     0XCE     |          8          | timestamp(4B) + illumination(4B) |

## Example

```json
// Sample(hex): 01 75 64 03 94 50 00 00 00
{
    "battery": 100,
    "illumination": 80
}
```
