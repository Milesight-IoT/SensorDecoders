# Insertion Temperature Sensor - Milesight IoT

The payload decoder function is applicable to TS101.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).
![TS101](TS101.png)

## Payload Definition

```
--------------------- Payload Definition ---------------------

                   [channel_id] [channel_type] [channel_value]
01: battery      -> 0x01         0x75          [1byte ] Unit: %
03: temperature  -> 0x03         0x67          [2bytes] Unit: °C (°F)
------------------------------------------ TS101
```

## Example for The Things Network

**Payload**

```
01 75 64 03 67 07 01
```

**Data Segmentation**

-   `01 75 64`
-   `03 67 07 01`

**Output**

```json
{
    "battery": 100,
    "temperature": 26.3
}
```
