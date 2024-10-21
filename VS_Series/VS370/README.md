# Radar Human Presence Sensor - Milesight IoT

The payload decoder function is applicable to VS370.

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/vs370).

![VS370](VS370.png)

## Payload Definition

### ATTRIBUTE

| CHANNEL          |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                       |
| :--------------- | :--: | :--: | :----: | :------------------------------------------------------------------------------------------------ |
| Protocol Version | 0xFF | 0x01 |   1    | ipso_version(1B)                                                                                  |
| Device Status    | 0xFF | 0x0B |   1    | device_status(1B)                                                                                 |
| Serial Number    | 0xFF | 0x16 |   8    | sn(8B)                                                                                            |
| Hardware Version | 0xFF | 0x09 |   2    | hardware_version(2B)                                                                              |
| Firmware Version | 0xFF | 0x0A |   2    | firmware_version(2B)                                                                              |
| TSL Version      | 0xFF | 0xFF |   2    | tsl_version(2B)                                                                                   |
| LoRaWAN Class    | 0xFF | 0x0F |   1    | lorawan_class(1B)<br />lorawan_class, values: (0: Class A, 1: Class B, 2: Class C, 3: Class CtoB) |

### TELEMETRY

| CHANNEL     |  ID  | TYPE | LENGTH | DESCRIPTION                                                                  |
| :---------- | :--: | :--: | :----: | :--------------------------------------------------------------------------- |
| Battery     | 0x01 | 0x75 |   1    | battery(1B)                                                                  |
| Occupancy   | 0x03 | 0x00 |   1    | occupancy(1B)<br />occupancy, values: (0: vacant, 1: occupied)               |
| Illuminance | 0x04 | 0x00 |   1    | illuminance(1B)<br />illuminance, values: (0: dim, 1: bright, 0xFE: disable) |

# Sample

```json
// 017564030001040000
{
    "battery": 100,
    "illuminance": "dim",
    "occupancy": "occupied"
}
```
