# Workplace Sensors - Milesight IoT

![WS101](WS101.png)

The payload decoder function is applicable to WS101.

For more detailed information, please visit [milsight official website](https://wwww.milesight-iot.com).

## Payload Definition

```
--------------------- Payload Definition ---------------------

                   [channel_id] [channel_type] [channel_value]
01: battery      -> 0x01         0x75          [1byte ] Unit: %
FF: press        -> 0xFF         0x2E          [1byte ] Unit:
------------------------------------------ WS101

--- PRESS DEFINITION ---
01: short
02: long
03: double
```

## Example for The Things Network

**Payload**

```
01 75 10 FF 2E 01
```

**Data Segmentation**

-   `01 75 10`
-   `FF 2E 01`

**Output**

```json
{
    "battery": 16,
    "press": "short"
}
```
