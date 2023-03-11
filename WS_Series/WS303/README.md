# Mini Leak Detection Sensor - Milesight IoT

The payload decoder function is applicable to WS303.

![WS303](WS303.png)

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

## Payload Definition

|  channel   | channel_id | channel_type | data_length (bytes) | description                  |
| :--------: | :--------: | :----------: | :-----------------: | ---------------------------- |
|  battery   |    0x01    |     0x75     |          1          | unit：%                      |
| water_leak |    0x03    |     0x00     |          1          | 0x00：normal<br />0x01：leak |

## Example

```json
// Sample(hex): 01 75 64 03 00 00
{
    "battery": 100,
    "water_leak": "normal"
}

// Sample(hex): 01 75 64 03 00 01
{
    "battery": 100,
    "water_leak": "leak"
}
```
