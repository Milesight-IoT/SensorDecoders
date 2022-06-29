# Workplace Sensors - Milesight IoT

![WS301](WS301.png)

The payload decoder function is applicable to WS301.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

## Payload Definition

```
--------------------- Payload Definition ---------------------

                   [channel_id] [channel_type] [channel_value]
01: battery      -> 0x01         0x75          [1byte ] Unit: %
03: state        -> 0x03         0x00          [1byte ] Unit:
04: install      -> 0x04         0x00          [1byte ] Unit:
------------------------------------------ WS301
```

## Example for The Things Network

**Payload**

```
01 75 64 03 00 01 04 00 01
```

**Data Segmentation**

-   `01 75 64`
-   `03 00 01`
-   `04 00 01`

**Output**

```json
{
    "battery": 100,
    "state": "open",
    "install": "no"
}
```
