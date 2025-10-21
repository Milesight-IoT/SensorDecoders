# Soil Moisture, Temperature and Electrical Conductivity Sensor - EM500-SMTC

![EM500-SMTC](em500-smtc.png)

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/em500-smtc)

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

|      CHANNEL      |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                |
| :---------------: | :--: | :--: | :----: | ------------------------------------------------------------------------------------------ |
|      Battery      | 0x01 | 0x75 |   1    | battery(1B)<br/>battery, unit: %                                                           |
|    Temperature    | 0x03 | 0x67 |   2    | temperature1(2B)<br/>temperature1, unit: °C                                                  |
|     Moisture      | 0x04 | 0x68 |   1    | moisture(1B)<br/>moisture, unit: %r.h.                                                       |
|   Soil Moisture   | 0x04 | 0xCA |   2    | soil_moisture(2B)<br/>soil_moisture, unit: %r.h.                                                       |
|        EC         | 0x05 | 0x7F |   2    | ec(2B)<br/>ec, unit: mS/cm                                                                 |
| Temperature Alarm | 0x83 | 0xD7 |   5    | temperature(2B) + temperature_change(2B) + temperature_alarm(1B)<br/>temperature, unit: °C |
|  Historical Data  | 0x20 | 0XCE |   22   | timestamp(4B) + conductivity1(2B) + temperature1(2B) + soil_moisture1(2B) + conductivity2(2B) + temperature2(2B) + soil_moisture2(2B) + conductivity3(2B) + temperature3(2B) + soil_moisture3(2B)                                    |

## Example

```json
// 017564 03671901 04CA7300 057FF000
{
    "battery": 100,
    "temperature1": 28.1,
    "soil_moisture1": 11.5,
    "conductivity1": 2.4
}
```
