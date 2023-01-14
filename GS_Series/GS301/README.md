# Bathroom Odor Detector - Milesight IoT

![GS301](GS301.png)

The payload decoder function is applicable to GS301.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

## Payload Definition

```
--------------------- Payload Definition ---------------------

                   [channel_id] [channel_type] [channel_value]
01: battery      -> 0x01         0x75          [1byte ] Unit: %
02: temperature  -> 0x03         0x67          [2bytes] Unit: °C (℉)
03: humidity     -> 0x04         0x68          [1byte ] Unit: %RH
04: NH3          -> 0x04         0x7D          [2bytes] Unit: ppm
05: H2S          -> 0x05         0x7D          [2bytes] Unit: ppm
------------------------------------------ GS301
```

## Example for The Things Network

**Payload**

```
01 75 64 02 67 1C 01 03 68 64 04 7D 00 00 05 7D 01 00
```

**Data Segmentation**

-   `01 75 64`
-   `02 67 1C 01`
-   `03 68 64`
-   `04 7D 00 00`
-   `05 7D 01 00`

**Output**

```json
{
    "battery": 100,
    "temperature": 28.4,
    "humidity": 50,
    "nh3": 0,
    "h2s": 0.01
}
```
