# Mini Leak Detection Sensor - Milesight IoT

The payload decoder function is applicable to WS303.

![WS303](WS303.png)

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

## Payload Definition

|   channel   | channel_id | channel_type | data_length (bytes) | description                   |
| :---------: | :--------: | :----------: | :-----------------: | ----------------------------- |
|   battery   |    0x01    |     0x75     |          1          | unit：%                       |
| leak_status |    0x03    |     0x00     |          1          | 0x00：no leak<br />0x01：leak |

## Example

```json
// Sample(hex): 01 75 64 03 00 00
{
    "battery": 100,
    "leak_status": "no leak"
}

// Sample(hex): 01 75 64 03 00 01
{
    "battery": 100,
    "leak_status": "leak"
}
```
