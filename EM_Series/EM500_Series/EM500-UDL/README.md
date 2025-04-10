# Ultrasonic Distance/Level Sensor - Milesight IoT

The payload decoder function is applicable to EM500-UDL.

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/em500-udl).

![EM500-UDL](EM500-UDL.png)

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

|     CHANNEL     |  ID  | TYPE | LENGTH | DESCRIPTION                                               |
| :-------------: | :--: | :--: | :----: | --------------------------------------------------------- |
|     Battery     | 0x01 | 0x75 |   1    | battery(1B)<br/>battery, unit: %                          |
|    Distance     | 0x03 | 0x82 |   2    | distance(2B)<br/>distance, unit: mm                       |
| Distance Alarm  | 0x83 | 0xE9 |   5    | distance(2B) + distance_mutation(2B) + distance_alarm(1B) |
| Historical Data | 0x20 | 0XCE |   6    | timestamp(4B) + distance(2B)                              |

## Example

```json
// 017564 03821E00
{
    "battery": 100,
    "distance": 30
}
```
