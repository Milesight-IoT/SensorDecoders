# Desk & Seat Occupancy Sensor - Milesight IoT

The payload decoder function is applicable to VS340/VS341.
For more detailed information, please visit [Milesight official website](https://www.milesight-iot.com).

|        VS340        |        VS341        |
| :-----------------: | :-----------------: |
| ![VS340](VS340.png) | ![VS341](VS341.png) |

## Payload Definition

|  channel  | channel_id | channel_type | data_length (bytes) | description                |
| :-------: | :--------: | :----------: | :-----------------: | -------------------------- |
|  battery  |    0x01    |     0x75     |          1          | unit：%                    |
| occupancy |    0x03    |     0x00     |          1          | 0: vacant<br />1: occupied |

## Example

```json
// Sample(hex): 01 75 64 03 00 00
{
    "battery": 100,
    "occupancy": "vacant"
}

// Sample(hex): 01 75 64 03 00 01
{
    "battery": 100,
    "occupancy": "occupied"
}
```
