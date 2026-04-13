# GAS Detector - GS101

![GS101](gs101.png)

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/gs101)

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

|       CHANNEL       |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                                                                             |
| :-----------------: | :--: | :--: | :----: | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     GAS Status      | 0x05 | 0x8E |   1    | gas_status(1B)<br/>gas, values: (0: normal, 1: alarm)                                                                                                   |
|    Valve Status     | 0x06 | 0x01 |   1    | valve_status(1B)<br/>valve, values: (0: off, 1: on)                                                                                                     |
| Relay Output Status | 0x07 | 0x01 |   1    | relay_output_status(1B)<br/>relay_output_status, values: (0: off, 1: on)                                                                                |
|     Life Remain     | 0x08 | 0x90 |   4    | life_remain(4B)<br/>life_remain, unit: s                                                                                                                |
|    Alarm Report     | 0xFF | 0x3F |   1    | alarm(1B)<br/>alarm, values: (0: power off, 1: power on, 2: sensor fault, 3: sensor fault recovered, 4: sensor will be invalid soon, 5: device invalid) |
