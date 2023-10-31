# Ambience Monitoring Sensors - Milesight IoT

The payload decoder function is applicable toAM107(AM102).

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

![AM107](AM107.png)

## Payload Definition

|   CHANNEL    |  ID  | TYPE | LENGTH | DESCRIPTION                                  |
| :----------: | :--: | :--: | :----: | -------------------------------------------- |
|   Battery    | 0x01 | 0x75 |   1    | battery(1B)<br/>battery, unit: %             |
| Temperature  | 0x03 | 0x67 |   2    | temperature(2B)<br/>temperature, unit: ℃     |
|   Humidity   | 0x04 | 0x68 |   1    | humidity(1B)<br/>humidity, unit: %RH         |
|   Activity   | 0x05 | 0x6A |   2    | activity(2B)                                 |
| Illumination | 0x06 | 0x65 |   6    | illumination(6B)<br/>illumination, unit: lux |
|     CO2      | 0x07 | 0x7D |   2    | co2(2B)<br/>co2, unit: ppm                   |
|     tVOC     | 0x08 | 0x7D |   2    | tvoc(2B)<br/>tvoc, unit: ppb                 |
|   Pressure   | 0x09 | 0x73 |   2    | pressure(2B)<br/>pressure, unit: hPa         |

## Example

```json
// 01755C 03673401 046865 056A4900 06651C0079001400 077DE704 087D0700 09733F27
{
    "battery": 92,
    "temperature": 30.8,
    "humidity": 50.5,
    "activity": 73,
    "illumination": 28,
    "infrared": 20,
    "infrared_and_visible": 121,
    "co2": 1255,
    "tvoc": 7,
    "pressure": 1004.7
}
```
