# Spot Leak Detection Sensor / Zone Leak Detection Sensor / Membrane Leak Detection Sensor - Milesight IoT

The payload decoder function is applicable to EM300-SLD and EM300-ZLD.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

|          EM300-SLD          |          EM300-ZLD          |
| :-------------------------: | :-------------------------: |
| ![EM300-SLD](EM300-SLD.png) | ![EM300-ZLD](EM300-ZLD.png) |

## Payload Definition

|     channel     | channel_id | channel_type | data_length (bytes) | description                                                         |
| :-------------: | :--------: | :----------: | :-----------------: | ------------------------------------------------------------------- |
|     battery     |    0x01    |     0x75     |          1          | unit: %                                                             |
|   temperature   |    0x03    |     0x67     |          2          | unit: ℃                                                             |
|    humidity     |    0x04    |     0x68     |          1          | unit: %RH                                                           |
| leakage status  |    0x06    |     0x00     |          1          | 0: normal, 1: leak                                                  |
| historical data |    0x20    |     0XCE     |          8          | timestamp(4B) + temperature(2B) + humidity(1B) + leakage_status(1B) |

## Example

```json
// Sample(hex): 01 75 5C 03 67 34 01 04 68 65 05 00 00
{
  "battery": 92,
  "temperature": 30.8,
  "humidity": 50.5,
  "leakage_status": "normal"
}

// Sample(hex): 20 CE 9E 74 46 63 10 01 5D 01
{
  "history": [
    {
      "temperature": 27.2,
      "humidity": 46.5,
      "leakage_status": "leak",
      "timestamp": 1665561758
    }
  ]
}
```
