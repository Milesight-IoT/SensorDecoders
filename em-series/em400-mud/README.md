# Multifunctional Ultrasonic Distance/Level Sensor - EM400-MUD

![EM400-MUD](em400-mud.png)

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/em400-mud)

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

|        CHANNEL        |  ID  | TYPE | LENGTH | DESCRIPTION                                           |
| :-------------------: | :--: | :--: | :----: | ----------------------------------------------------- |
|        Battery        | 0x01 | 0x75 |   1    | battery(1B)<br/>battery, unit: %                      |
|      Temperature      | 0x03 | 0x67 |   2    | temperature(2B)<br/>temperature, unit: °C             |
|       Distance        | 0x04 | 0x82 |   2    | distance(2B)<br/>distance, unit: mm                   |
|       Position        | 0x05 | 0x00 |   1    | position(1B)<br/>position, values(0: normal, 1: tilt) |
| Location<br/>(NB-IoT) | 0x06 | 0x88 |   9    | longitude(4B) + latitude(4B) + motion_status(1B)      |
| Temperature Abnormal  | 0x83 | 0x67 |   3    | temperature(2B) + status(1B)                          |
|    Distance Alarm     | 0x84 | 0x82 |   3    | distance(2B) + status(1B)                             |

### Motion Status Definition

|    BITS     | 7..4                                                                  | 3..0                                                                            |
| :---------: | :-------------------------------------------------------------------- | :------------------------------------------------------------------------------ |
| DESCRIPTION | geofence_status, values: (0: inside, 1: outside, 2: unset, 3: unknown | motion_status, values: (0: unknown, 1: start moving, 2: moving, 3: stop moving) |

## Example (LoRaWAN)

```json
// 01755C 03670101 04824408 050001
{
  "battery": 92,
  "temperature": 25.7,
  "distance": 2116,
  "position": "tilt"
}

// 8367e80001 8482410601
{
  "temperature": 23.2,
  "temperature_alarm": "threshold_alarm",
  "distance": 1601,
  "distance_alarm": "threshold_alarm"
}
```

## NB-IoT Data Frame

|        | START FLAG |  ID  | DATA LENGTH | FLAG | FRAME COUNT | PROTOCOL VERSION | FIRMWARE VERSION | HARDWARE VERSION |          SERIAL NUMBER           |              IMEI              |              IMSI              |                  ICCID                   | CSQ | SENSOR PAYLOAD LENGTH |                          SENSOR PAYLOAD DATA                           |
| :----: | :--------: | :--: | :---------: | :--: | :---------: | :--------------: | :--------------: | :--------------: | :------------------------------: | :----------------------------: | :----------------------------: | :--------------------------------------: | :-: | :-------------------: | :--------------------------------------------------------------------: |
|        |     1B     |  2B  |     2B      |  1B  |     2B      |        1B        |        4B        |        4B        |               16B                |              15B               |              15B               |                   20B                    | 1B  |          2B           |                                   NB                                   |
| sample |     02     | 0001 |    005f     |  00  |    0000     |        01        |     30313031     |     30313130     | 36373439443139303534363930303331 | 383638353038303634383037333530 | 343630303433323234323133313130 | 3839383630343132313032323730303632383537 | 09  |         000e          |                      01756403670b0104823b01050001                      |
| result |     2      |  1   |     95      |  0   |      0      |        1         |       0101       |       0110       |         6749D19054690031         |        868508064807350         |        460043224213110         |           89860412102270062857           |  9  |          14           | `{ battery: 100, temperature: 26.7, distance: 315, position: 'tilt' }` |

## Example (NB-IoT)

```json
{
    "startFlag": 2,
    "id": 1,
    "length": 95,
    "flag": 0,
    "frameCnt": 0,
    "protocolVersion": 1,
    "firmwareVersion": "0101",
    "hardwareVersion": "0110",
    "sn": "6749D19054690031",
    "imei": "868508064807350",
    "imsi": "460043224213110",
    "iccid": "89860412102270062857",
    "csq": 9,
    "data_length": 14,
    "data": [
        {
            "battery": 100,
            "temperature": 26.7,
            "distance": 315,
            "position": "tilt"
        }
    ]
}
```
