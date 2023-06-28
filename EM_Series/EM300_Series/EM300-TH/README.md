# Temperature & Humidity Sensor - Milesight IoT

The payload decoder function is applicable to EM300-TH.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

![EM300-TH](EM300-TH.png)

## Payload Definition

|     channel     | channel_id | channel_type | data_length (bytes) | description                                                 |
| :-------------: | :--------: | :----------: | :-----------------: | ----------------------------------------------------------- |
|     battery     |    0x01    |     0x75     |          1          | unit: %                                                     |
|   temperature   |    0x03    |     0x67     |          2          | unit: ℃                                                     |
|    humidity     |    0x04    |     0x68     |          1          | unit: %RH                                                   |
| historical data |    0x20    |     0XCE     |          8          | timestamp(4B) + temperature(2B) + humidity(1B) + status(1B) |

## Example

```json
// Sample(hex): 01 75 5C 03 67 34 01 04 68 65
{
    "battery": 92,
    "temperature": 30.8,
    "humidity": 50.5
}

// Sample(hex): 20 CE 9E 74 46 63 10 01 5D 00
{
  "history": [
    {
      "humidity": 46.5,
      "temperature": 27.2,
      "timestamp": 1665561758
    }
  ]
}
```
