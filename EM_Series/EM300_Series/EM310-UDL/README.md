# Ultrasonic Distance/Level Sensor - Milesight IoT

The payload decoder function is applicable to EM310-UDL.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

![EM300-UDL](EM310-UDL.png)

## Payload Definition

### Attribute

|      CHANNEL       |  ID   | TYPE  | LENGTH | DESCRIPTION          |
| :----------------: | :---: | :---: | :----: | -------------------- |
|  Protocol Version  | 0xFF  | 0x01  |   1    | protocol_version(1B) |
|    Power Status    | 0xFF  | 0x0B  |   1    | power_status(1B)     |
|   Serial Number    | 0xFF  | 0x16  |   8    | sn(8B)               |
|  Hardware Version  | 0xFF  | 0x09  |   2    | hardware_version(2B) |
|  Firmware Version  | 0xFF  | 0x0A  |   2    | firmware_version(2B) |
| LoRaWAN Class Type | 0xFF  | 0x0F  |   1    | lorawan_class(1B)    |
|    TSL Version     | 0xFF  | 0xFF  |   2    | tsl_version(2B)      |

### Telemetry

| CHANNEL  |  ID   | TYPE  | LENGTH | DESCRIPTION                                              |
| :------: | :---: | :---: | :----: | -------------------------------------------------------- |
| Battery  | 0x01  | 0x75  |   1    | battery(1B)<br />battery, unit: %                        |
| Distance | 0x03  | 0x82  |   2    | distance(2B)<br />distance, unit: mm                     |
| Position | 0x04  | 0x00  |   1    | position(1B)<br />position, values: (0: normal, 1: tilt) |

## Example

```json
// 01755C 03824408 040001
{
    "battery": 92,
    "distance": 2116,
    "position": "tilt"
}
```
