# Field Tester - Milesight IoT

The payload decoder function is applicable to FT101.

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com).

![FT101](FT101.png)

## Payload Definition

### ATTRIBUTES

|     CHANNEL      |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                   |
| :--------------: | :--: | :--: | :----: | --------------------------------------------------------------------------------------------- |
| Protocol Version | 0xFF | 0x01 |   1    | ipso_version(1B)                                                                              |
|  Device Status   | 0xFF | 0x0B |   1    | device_status(1B)                                                                             |
|  Serial Number   | 0xFF | 0x16 |   8    | sn(8B)                                                                                        |
| Hardware Version | 0xFF | 0x09 |   2    | hardware_version(2B)                                                                          |
| Firmware Version | 0xFF | 0x0A |   2    | firmware_version(2B)                                                                          |
|   TSL Version    | 0xFF | 0xFF |   2    | tsl_version(2B)                                                                               |
|  LoRaWAN Class   | 0xFF | 0x0F |   1    | lorawan_class(1B)<br />lorawan_class, values: (0: classA, 1: classB, 2: classC, 3: classCtoB) |

### TELEMETRY

|     CHANNEL      |  ID  | TYPE | LENGTH | DESCRIPTION                  |
| :--------------: | :--: | :--: | :----: | ---------------------------- |
|     Location     | 0x03 | 0xA1 |   8    | longitude(4B) + latitude(4B) |
| Signal Strength  | 0x04 | 0xA2 |   4    | rssi(2B) + snr(2B)           |
| Spreading Factor | 0x05 | 0xA3 |   1    | sf(1B)                       |
|     TX Power     | 0x06 | 0xA4 |   2    | tx_power(2B)                 |

## Sample

```json


```
