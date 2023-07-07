# Membrane Leak Detection Sensor - Milesight IoT

The payload decoder function is applicable to EM300-MLD.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

![EM300-MLD](EM300-MLD.png)

## Payload Definition

|     channel     | channel_id | channel_type | data_length (bytes) | description                                                         |
| :-------------: | :--------: | :----------: | :-----------------: | ------------------------------------------------------------------- |
|     battery     |    0x01    |     0x75     |          1          | unit: %                                                             |
| leakage status  |    0x06    |     0x00     |          1          | 0: normal, 1: leak                                                  |
| historical data |    0x20    |     0XCE     |          8          | timestamp(4B) + temperature(2B) + humidity(1B) + leakage_status(1B) |

## Example

```json
// Sample(hex): 01 75 5C 05 00 00
{
  "battery": 92,
  "leakage_status": "normal"
}

// Sample(hex): 20 CE 9E 74 46 63 00 00 00 01
{
  "history": [
    {
      "leakage_status": "leak",
      "timestamp": 1665561758
    }
  ]
}
```
