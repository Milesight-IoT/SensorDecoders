# Smart Light Controller - WS558

|        WS558        |        WS558(LN)         |
| :-----------------: | :----------------------: |
| ![WS558](ws558.png) | ![WS558LN](ws558-ln.png) |

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/ws558)

## Payload

```
+-------------------------------------------------------+
|           DEVICE UPLINK / DOWNLINK PAYLOAD            |
+---------------------------+---------------------------+
|          DATA 1           |          DATA 2           |
+--------+--------+---------+--------+--------+---------+
|   ID   |  TYPE  |  DATA   |   ID   |  TYPE  |  DATA   |
+--------+--------+---------+--------+--------+---------+
| 1 Byte | 1 Byte | N Bytes | 1 Byte | 1 Byte | N Bytes |
|--------+--------+---------+--------+--------+---------+
```

### Attribute

|    CHANNEL    |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                       |
| :-----------: | :--: | :--: | :----: | ------------------------------------------------------------------------------------------------ |
|     IPSO      | 0xFF | 0x01 |   1    | ipso_version(1B)                                                                                 |
|   Hardware    | 0xFF | 0x09 |   2    | hardware_version(2B)<br/>hardware_version, e.g. 0110 -> v1.1                                     |
|   Firmware    | 0xFF | 0x0A |   2    | firmware_version(2B)<br/>firmware_version, e.g. 0110 -> v1.10                                    |
|      TSL      | 0xFF | 0xFF |   2    | tsl_version(2B)                                                                                  |
| Serial Number | 0xFF | 0x16 |   2    | sn(8B)                                                                                           |
| LoRaWAN Class | 0xFF | 0x0F |   1    | lorawan_class(1B)<br/>lorawan_class, values: (0: Class A, 1: Class B, 2: Class C, 3: Class CtoB) |
|  Reset Event  | 0xFF | 0xFE |   1    | reset_event(1B)                                                                                  |
| Device Status | 0xFF | 0x0B |   1    | device_status(1B)                                                                                |

### Telemetry

|      CHANNEL      |  ID  | TYPE | LENGTH | DESCRIPTION                                           |
| :---------------: | :--: | :--: | :----: | ----------------------------------------------------- |
|      Voltage      | 0x03 | 0x74 |   2    | voltage(2B)<br/>voltage, read: uint16/10              |
|   Active power    | 0x04 | 0x80 |   4    | power(4B)<br/>power, read: uint32, unit: W            |
|   Active factor   | 0x05 | 0x81 |   1    | factor(1B)<br/>factor, read: uint8, unit: %           |
| Power Consumption | 0x06 | 0x83 |   4    | power_sum(4B)<br/>power_sum, read: uint32, unit: W\*h |
|      Current      | 0x07 | 0xC9 |   2    | current(2B)<br/>current, read: uint16, unit: mA       |
|      Switch       | 0x08 | 0x31 |   2    |                                                       |

### Switch Value Definition

```
binary:  0 0 0 0 0 0 0 0  0 0 0 0 0 0 0 0
switch:  8 7 6 5 4 3 2 1  8 7 6 5 4 3 2 1
         ---------------  ---------------
bitmask:          change            state
```

## Example

```json
// 08310001 058164 07C90200 0374B208 068301000000 048001000000
{
    "voltage": 222.6,
    "active_power": 1,
    "power_factor": 100,
    "total_current": 2,
    "power_consumption": 1,
    "switch_1": "on",
    "switch_2": "off",
    "switch_3": "off",
    "switch_4": "off",
    "switch_5": "off",
    "switch_6": "off",
    "switch_7": "off",
    "switch_8": "off"
}
```
