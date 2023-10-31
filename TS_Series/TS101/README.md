# Insertion Temperature Sensor - Milesight IoT

The payload decoder function is applicable to TS101.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).
![TS101](TS101.png)

## Payload Definition

|   CHANNEL   |  ID  | TYPE | LENGTH | DESCRIPTION                              |
| :---------: | :--: | :--: | :----: | ---------------------------------------- |
|   Battery   | 0x01 | 0x75 |   1    | battery(1B)<br/>battery, unit: %         |
| Temperature | 0x03 | 0x67 |   2    | temperature(2B)<br/>temperature, unit: ℃ |

## Example for The Things Network

Payload

```
01 75 64 03 67 07 01
```

Data Segmentation

-   `01 75 64`
-   `03 67 07 01`

Output

```json
{
    "battery": 100,
    "temperature": 26.3
}
```
