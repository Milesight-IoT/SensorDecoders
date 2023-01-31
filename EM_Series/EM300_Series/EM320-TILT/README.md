# Tilt Sensor - Milesight IoT

![EM320-TILT](EM320-TILT.png)

The payload decoder function is applicable to EM320-TILT.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

## Payload Definition

```
--------------------- Payload Definition ---------------------

                   [channel_id] [channel_type] [channel_value]
01: battery      -> 0x01         0x75          [1byte ] Unit: %
03: angle        -> 0x03         0xD4          [6bytes] Unit:
------------------------------------------ EM320-TILT --------

Angle Definition (2bytes)
+-----------+-----------+-----------+
| 0x00 0x00 | 0x10 0x00 | 0x50 0x46 |
+-----------+-----------+-----------+
|  ANGLE X  |  ANGLE Y  |  ANGLE Z  |
+-----------+-----------+-----------+

Angle X/Y/Z Definition (bits)
+--------------------------------------------------------+
|  15  |  14  |  13  |  12  |  11  |  10  |  09  |   08  |
+--------------------------------------------------------+
|                     ANGLE DATA(1)                      |
+--------------------------------------------------------+
|  07  |  06  |  05  |  04  |  03  |  02  |  01  |   00  |
+------------------------------------------------+-------+
|                 ANGLE DATA(0)                  |  FLAG |
+------------------------------------------------+-------+
- FLAG 0: normal, 1: trigger
```

## Example for The Things Network

**Payload**

```
01 75 64 03 D4 00 00 01 00 50 46
```

**Data Segmentation**

- `01 75 64`
- `03 D4 00 00 01 00 50 46`

**Output**

```json
{
  "battery": 100,
  "angle_x": 0,
  "angle_y": 0,
  "angle_z": 90,
  "threshold_x": "normal",
  "threshold_y": "trigger",
  "threshold_z": "normal"
}
```
