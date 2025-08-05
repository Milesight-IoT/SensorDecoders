# Bathroom Odor Detector - Milesight IoT

![GS301](gs301.png)

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/gs301)

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

|          CHANNEL          |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                                                                                                                                                                                                                                     |
| :-----------------------: | :--: | :--: | :----: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|          Battery          | 0x01 | 0x75 |   1    | battery(1B)<br/>battery, unit: %                                                                                                                                                                                                                                                                                |
|        Temperature        | 0x02 | 0x67 |   2    | temperature(2B)<br/>temperature, unit: °C                                                                                                                                                                                                                                                                       |
|         Humidity          | 0x03 | 0x68 |   1    | humidity(1B)<br/>humidity, unit: %r.h.                                                                                                                                                                                                                                                                            |
|       NH3 (0.01ppm)       | 0x04 | 0x7D |   2    | nh3(2B)<br/>nh3, read: uint16/100, unit: ppm, value: 0xfffe(polarizing), 0xffff(device error)                                                                                                                                                                                                                   |
|       H2S (0.01ppm)       | 0x05 | 0x7D |   2    | h2s(2B)<br/>h2s, read: uint16/100, unit: ppm, value: 0xfffe(polarizing), 0xffff(device error)                                                                                                                                                                                                                   |
|       H2S(0.001ppm)       | 0x06 | 0x7D |   2    | h2s(2B)<br/>h2s, read: uint16/1000, unit: ppm, value: 0xfffe(polarizing), 0xffff(device error)                                                                                                                                                                                                                  |
| Sensor Calibration Result | 0x07 | 0xEA |   5    | sensor_id(1B) + type(1B) + calibration_value(2B) + result(1B)<br/>sensor_id, read: uint8, values: (0: NH3, 1: H2S)<br/>type: values: (0: factory, 1: manual)<br/>calibration_value: nh3->uint16/100, h2s->uint16/1000<br/>result: values: (0: success, 1: sensor version not match, 2: i2c communication error) |

## Example

```json
// 017564 02671C01 036864 047D0000 057D0100
{
    "battery": 100,
    "temperature": 28.4,
    "humidity": 50,
    "nh3": 0,
    "h2s": 0.01
}
```
