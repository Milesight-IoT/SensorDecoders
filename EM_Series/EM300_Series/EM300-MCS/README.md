# Magnetic Contact Switch - Milesight IoT

The payload decoder function is applicable to EM300-MCS.

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/em300-mcs).

![EM300-MCS](EM300-MCS.png)

## Payload Definition

|     CHANNEL     |  ID  | TYPE | LENGTH | DESCRIPTION                                                        |
| :-------------: | :--: | :--: | :----: | ------------------------------------------------------------------ |
|     Battery     | 0x01 | 0x75 |   1    | battery(1B)<br/>battery: unit: %                                   |
|   Temperature   | 0x03 | 0x67 |   2    | temperature(2B)<br/>temperature, unit: ℃                           |
|    Humidity     | 0x04 | 0x68 |   1    | humidity(1B)<br/>humidity, unit: %RH                               |
|  Magnet Status  | 0x06 | 0x00 |   1    | magnet_status(1B)<br/>magnet_status, values: (0: close, 1: open)   |
| Historical Data | 0x20 | 0XCE |   8    | timestamp(4B) + temperature(2B) + humidity(1B) + magnet_status(1B) |

## Example

```json
// 01755C 03673401 046865 060001
{
    "battery": 92,
    "temperature": 30.8,
    "humidity": 50.5,
    "magnet_status": "open"
}

// 20CE9E74466310015D01
{
  "history": [
    {
      "magnet_status": "open",
      "humidity": 46.5,
      "temperature": 27.2,
      "timestamp": 1665561758
    }
  ]
}
```
