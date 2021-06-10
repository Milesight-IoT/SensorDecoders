# Workplace Sensors - Milesight IoT

![WS52x](WS52x.png)

The payload decoder function is applicable to WS52x.

For more detailed information, please visit [milsight official website](https://wwww.milesight-iot.com).

## Payload Definition

```
--------------------- Payload Definition ---------------------

                   [channel_id] [channel_type] [channel_value]
03: voltate    ->   0x03         0x74          [2bytes ] Unit: v (0.1)
05: factor     ->   0x04         0x81          [1byte  ] Uint: %
06: energy_sum ->   0x06         0x83          [4bytes ] Uint: W*h
07: current    ->   0x07         0xc9          [2bytes ] Uint: mA
08: state      ->   0x08         0x70          [1byte  ] Uint: 
------------------------------------------ WS52x

----------

```

## Example for The Things Network

**Payload**

```
03 74 ED 08 06 83 56 04 00 00 08 70 01 05 81 52 07 C9 A4 00
```

**Data Segmentation**

-   `03 74 ED 08`
-   `06 83 56 04 00 00`
-   `08 70 01 `
-   `05 81 52`
-   `07 C9 A4 00`

**Output**

```json
{
    "state": "open",
    "voltate": 228.5,
    "current": 164,
    "factor": 82,
    "energy_sum": 1110
}
```
