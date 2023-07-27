# Smart Wall Socket - Milesight IoT

The payload decoder function is applicable to WS513 / WS515.

For more detailed information, please visit [milsight official website](https://wwww.milesight-iot.com).

|        WS513        |        WS515        |         WS513 EU          |
| :-----------------: | :-----------------: | :-----------------------: |
| ![WS513](WS513.png) | ![WS515](WS515.png) | ![WS513_EU](WS513_EU.png) |

## Payload Definition

|      channel      | channel_id | channel_type | data_length (bytes) | description                          |
| :---------------: | :--------: | :----------: | :-----------------: | ------------------------------------ |
|      voltage      |    0x03    |     0x74     |          2          | voltage(2B), uint16/10               |
|   active power    |    0x04    |     0x80     |          4          | power(4B), uint32                    |
|   active factor   |    0x05    |     0x81     |          1          | factor(1B), uint8<br/>unit: %        |
| power consumption |    0x06    |     0x83     |          4          | power_sum(4B), uint32<br/>unit: W\*h |
|      current      |    0x07    |     0xC9     |          2          | current(2B), uint16<br/>unit: mA     |
|       state       |    0x08    |     0x70     |          1          | state(1B)<br/> 0: close, 1: open     |

## Example

```json
// Sample(hex): 087001 058161 07c9a800 03748308 06831d000000 048023000000
{
    "current": 168,
    "factor": 97,
    "power": 35,
    "power_sum": 29,
    "state": "open",
    "voltage": 217.9
}
```
