# GAS Detector - Milesight IoT

The payload decoder function is applicable to GS101.

For more detailed information, please visit [Milesight Official Website (GS101)](https://www.milesight.com/iot/product/lorawan-sensor/gs101).

![GS101](GS101.png)

## Payload Definition

### Attributes

|      CHANNEL       |  ID  | TYPE | LENGTH | DESCRIPTION          |
| :----------------: | :--: | :--: | :----: | -------------------- |
|  Protocol Version  | 0xFF | 0x01 |   1    | protocol_version(1B) |
|    Power Status    | 0xFF | 0x0B |   1    | power_status(1B)     |
|   Serial Number    | 0xFF | 0x16 |   8    | sn(8B)               |
|  Hardware Version  | 0xFF | 0x09 |   2    | hardware_version(2B) |
|  Firmware Version  | 0xFF | 0x0A |   2    | firmware_version(2B) |
| LoRaWAN Class Type | 0xFF | 0x0F |   1    | lorawan_class(1B)    |
|    TSL Version     | 0xFF | 0xFF |   2    | tsl_version(2B)      |

### Telemetry

|       CHANNEL       |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                                                                             |
| :-----------------: | :--: | :--: | :----: | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     GAS Status      | 0x05 | 0x8E |   1    | gas_status(1B)<br/>gas, values: (0: normal, 1: alarm)                                                                                                   |
|    Valve Status     | 0x06 | 0x01 |   1    | valve_status(1B)<br/>valve, values: (0: off, 1: on)                                                                                                     |
| Relay Output Status | 0x07 | 0x01 |   1    | relay_output_status(1B)<br/>relay_output_status, values: (0: off, 1: on)                                                                                |
|     Life Remain     | 0x08 | 0x90 |   4    | life_remain(4B)<br/>life_remain, unit: s                                                                                                                |
|    Alarm Report     | 0xFF | 0x3F |   1    | alarm(1B)<br/>alarm, values: (0: power off, 1: power on, 2: sensor fault, 3: sensor fault recovered, 4: sensor will be invalid soon, 5: device invalid) |
