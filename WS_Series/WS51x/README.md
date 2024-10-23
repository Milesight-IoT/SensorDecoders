# Smart Wall Socket - Milesight IoT

The payload decoder function is applicable to WS513 / WS515.

For more detailed information, please visit [milesight official website](https://wwww.milesight.com).

|        WS513        |        WS515        |         WS513 EU          |
| :-----------------: | :-----------------: | :-----------------------: |
| ![WS513](WS513.png) | ![WS515](WS515.png) | ![WS513_EU](WS513_EU.png) |

## Payload Definition

### Attribute

|     CHANNEL      |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                   |
| :--------------: | :--: | :--: | :----: | --------------------------------------------------------------------------------------------- |
| Protocol Version | 0xFF | 0x01 |   1    | ipso_version(1B)                                                                              |
|  Device Status   | 0xFF | 0x0B |   1    | device_status(1B)                                                                             |
|  Serial Number   | 0xFF | 0x16 |   8    | sn(8B)                                                                                        |
| Hardware Version | 0xFF | 0x09 |   2    | hardware_version(2B)                                                                          |
| Firmware Version | 0xFF | 0x0A |   2    | firmware_version(2B)                                                                          |
|   Tsl Version    | 0xFF | 0xFF |   2    | tsl_version(2B)                                                                               |
|   LoRaWAN Type   | 0xFF | 0x0F |   1    | lorawan_class(1B)<br />lorawan_class, values: (0: ClassA, 1: ClassB, 2: ClassC, 3: ClassCtoB) |

### Telemetry

|          CHANNEL           |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                                                                                                           |
| :------------------------: | :--: | :--: | :----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|          Voltage           | 0x03 | 0x74 |   2    | voltage(2B)<br />voltage, read: uint16/10                                                                                                                                             |
|        Active Power        | 0x04 | 0x80 |   4    | active_power(4B)<br />active_power, read: uint32, unit: W                                                                                                                             |
|       Active factor        | 0x05 | 0x81 |   1    | power_factor(1B)<br />power_factor, read: uint8, unit: %                                                                                                                              |
|     Power Consumption      | 0x06 | 0x83 |   4    | power_consumption(4B)<br />power_consumption, read: uint32, unit: W\*h                                                                                                                |
|          Current           | 0x07 | 0xC9 |   2    | current(2B)<br />current, read: uint16, unit: mA                                                                                                                                      |
|       Socket Status        | 0x08 | 0x70 |   1    | state(1B)<br />state, values: (0: off, 1: on)                                                                                                                                         |
|        Temperature         | 0x09 | 0x67 |   2    | temperature(2B)<br />temperature, read: int16/10, unit: ℃                                                                                                                             |
|     Temperature Alarm      | 0x09 | 0x67 |   3    | temperature(2B) + temperature_alarm(1B)<br />temperature, read: int16/10, unit: ℃<br />temperature_alarm, values: (0: threshold alarm release, 1: threshold alarm, 2: overheat alarm) |
| Temperature Mutation Alarm | 0x99 | 0x67 |   5    | temperature(2B) + temperature_mutation(2B) + temperature_alarm(1B)<br />temperature, read: int16/10, unit: ℃                                                                          |

## Example

```json
// 087001 058161 07c9a800 03748308 06831d000000 048023000000
{
    "current": 168,
    "power_factor": 97,
    "active_power": 35,
    "power_consumption": 29,
    "socket_status": "on",
    "voltage": 217.9
}
```
