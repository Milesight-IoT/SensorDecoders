# Tilt Sensor - Milesight IoT

![EM320-TILT](EM320-TILT.png)

The payload decoder function is applicable to EM320-TILT.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

## Payload Definition

|   CHANNEL   |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                                                                                                                           |
| :---------: | :--: | :--: | :----: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   Battery   | 0x01 | 0x75 |   1    | battery(1B)<br/>battery, unit: %                                                                                                                                                                      |
| Angle X/Y/Z | 0x03 | 0xD4 |   6    | angle_x(2B) + angle_y(2B) + angle_z(2B)<br/>angle_x, angle_x(15..1) + angle_x_threshold(0)<br/>angle_y, angle_y(15..1) + angle_y_threshold(0)<br/>angle_z, angle_z(15..1) + angle_z_threshold(0)<br/> |

### Angle X/Y/Z Definition (bits)

```
+--------------------------------------------------------+
|  15  |  14  |  13  |  12  |  11  |  10  |  09  |   08  |
+--------------------------------------------------------+
|                     ANGLE DATA(1)                      |
+--------------------------------------------------------+
|  07  |  06  |  05  |  04  |  03  |  02  |  01  |   00  |
+------------------------------------------------+-------+
|                 ANGLE DATA(0)                  |  FLAG |
+------------------------------------------------+-------+

NOTE: (FLAG: normal, 1: trigger)
```

## Example

```json
// 017564 03D4000001005046
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
