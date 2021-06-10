# Workplace Sensors - Milesight IoT

![WS202](WS202.png)

The payload decoder function is applicable to WS202.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

## Payload Definition

```
--------------------- Payload Definition ---------------------

                 [channel_id] [channel_type] [channel_value]
01: battery      -> 0x01         0x75          [1byte ] Unit: %
03: pir          -> 0x03         0x00          [1byte ] Unit:
04: daylight     -> 0x04         0x00          [1byte ] Unit: 
------------------------------------------ WS202
```

## Example for The Things Network

**Payload**

```
01 75 10 03 00 01 04 00 00
```

**Data Segmentation**

-   `01 75 10`
-   `03 00 01`
-   `04 00 00`

**Output**

```json
{
  "battery": 16,
  "pir": "trigger",
  "daylight": "dark"
}
```
