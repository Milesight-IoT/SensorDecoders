# Magnetic Contact Switch - WS301

![WS301](ws301.png)

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/ws301)

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
| Serial Number | 0xFF | 0x08 |   6    | sn(6B)                                                                                           |
| LoRaWAN Class | 0xFF | 0x0F |   1    | lorawan_class(1B)<br/>lorawan_class, values: (0: Class A, 1: Class B, 2: Class C, 3: Class CtoB) |
|  Reset Event  | 0xFF | 0xFE |   1    | reset_event(1B)                                                                                  |
| Device Status | 0xFF | 0x0B |   1    | device_status(1B)                                                                                |
|     ODM ID      | 0xFF | 0xE7 |   2    | odm_id(2B)<br/>odm_id, e.g. 12 34 -> 1234                                                        |
| Software Sub Version | 0xFF | 0xE8 |   4    | software_sub_version(4B)<br/>software_sub_version, e.g. 01 02 00 11 -> -r1-a2-t11                |

### Telemetry

|    CHANNEL    |  ID  | TYPE | LENGTH | DESCRIPTION                                                                 |
| :-----------: | :--: | :--: | :----: | --------------------------------------------------------------------------- |
|    Battery    | 0x01 | 0x75 |   1    | battery(1B)<br/>battery, unit: %                                            |
| Magnet Status | 0x03 | 0x00 |   1    | magnet_status(1B)<br/>state, values: (0: close, 1: open)                    |
| Tamper Status | 0x04 | 0x00 |   1    | tamper_status(1B)<br/>tamper_status, values: (0: installed, 1: uninstalled) |

## Example

```json
// 017564 030001 040001
{
    "battery": 100,
    "magnet_status": "open",
    "tamper_status": "installed"
}
```
