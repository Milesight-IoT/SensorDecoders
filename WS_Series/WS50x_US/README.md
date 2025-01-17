# Smart Wall Switch - Milesight IoT

The payload decoder function is applicable to WS501.

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/ws50x).

|         WS50x          |
| :--------------------: |
| ![WS50x](WS50x_US.png) |

## Payload Definition

|      CHANNEL      |  ID  | TYPE | LENGTH | DESCRIPTION                                           |
| :---------------: | :--: | :--: | :----: | ----------------------------------------------------- |
|      Voltage      | 0x03 | 0x74 |   2    | voltage(2B)<br/>voltage, read: uint16/10              |
|   Active Power    | 0x04 | 0x80 |   4    | power(4B)<br/>power, read: uint32, unit: W            |
|   Active Factor   | 0x05 | 0x81 |   1    | factor(1B)<br/>factor, read: uint8, unit: %           |
| Power Consumption | 0x06 | 0x83 |   4    | power_sum(4B)<br/>power_sum, read: uint32, unit: W\*h |
|      Current      | 0x07 | 0xC9 |   2    | current(2B)<br/>current, read: uint16, unit: mA       |
|      Switch       | 0x08 | 0x29 |   1    | status(1B)                                            |

### Status Definition

| bits |  7  |  6  |  5  |        4        |  3  |  2  |  1  |    0     |
| :--: | :-: | :-: | :-: | :-------------: | :-: | :-: | :-: | :------: |
|      |  -  |  -  |  -  | switch_1_change |  -  |  -  |  -  | switch_1 |

## Example

```json
// FF2931
{
    "switch_1": "on",
    "switch_1_change": "yes"
}
```
