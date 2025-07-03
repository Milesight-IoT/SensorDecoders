# Temperature & Humidity Sensor - Milesight IoT

The payload decoder function is applicable to EM320-TH.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

![EM320-TH](EM320-TH.png)

## Payload Definition

|     CHANNEL     |  ID  | TYPE | LENGTH | DESCRIPTION                                    |
| :-------------: | :--: | :--: | :----: | ---------------------------------------------- |
|     Battery     | 0x01 | 0x75 |   1    | battery(1B)<br/>battery, unit: %               |
|   Temperature   | 0x03 | 0x67 |   2    | temperature(2B)<br/>temperature, unit: ℃       |
|    Humidity     | 0x04 | 0x68 |   1    | humidity(1B)<br/>humidity, unit: %RH           |
| Historical Data | 0x20 | 0XCE |   7    | timestamp(4B) + temperature(2B) + humidity(1B) |

## Example

```json
// 01755C 03673401 046865
{
    "battery": 92,
    "humidity": 50.5,
    "temperature": 30.8
}

// 20CE9E74466310015D
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
