# CO2 Sensor - Milesight IoT

The payload decoder function is applicable to EM500-CO2.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

![EM500-CO2](EM500-CO2.png)

## Payload Definition

|      CHANNEL      |  ID  | TYPE | LENGTH | DESCRIPTION                                                                               |
| :---------------: | :--: | :--: | :----: | ----------------------------------------------------------------------------------------- |
|      Battery      | 0x01 | 0x75 |   1    | battery(1B)<br/>battery, unit: %                                                          |
|    Temperature    | 0x03 | 0x67 |   2    | temperature(2B)<br/>temperature,unit: ℃                                                   |
|     Humidity      | 0x04 | 0x68 |   1    | humidity(1B)<br/>humidity, unit: %RH                                                      |
|        CO2        | 0x05 | 0x7D |   2    | co2(2B)<br/>co2, unit: ppm                                                                |
|     Pressure      | 0x06 | 0x73 |   2    | pressure(2B)<br/>pressure, unit: hPa                                                      |
| Temperature Alarm | 0x83 | 0xD7 |   5    | temperature(2B) + temperature_change(2B) + temperature_alarm(1B)<br/>temperature, unit: ℃ |
|  Historical Data  | 0x20 | 0XCE |   11   | timestamp(4B) + co2(2B) + pressure(2B) + temperature(2B) + humidity(1B)                   |

## Example

```json
// 01756403671901 046873 057D6704 06736827
{
    "battery": 100,
    "temperature": 28.1,
    "humidity": 57.5,
    "co2": 1127,
    "pressure": 1008.8
}
```
