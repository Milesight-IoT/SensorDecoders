# Pipe Pressure Sensor - Milesight IoT

The payload decoder function is applicable to EM500-PP.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

![EM500-PP](EM500-PP.png)

## Payload Definition

| CHANNEL  |  ID  | TYPE | LENGTH | DESCRIPTION                          |
| :------: | :--: | :--: | :----: | ------------------------------------ |
| Battery  | 0x01 | 0x75 |   1    | battery(1B)<br/>battery, unit: %     |
| Pressure | 0x03 | 0x7B |   2    | pressure(2B)<br/>pressure, unit: kPa |

## Example

```json
// 017564 037B0A00
{
    "battery": 100,
    "pressure": 10
}
```
