# Outdoor Asset Tracker - AT101

![AT101](at101.png)

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/at101)

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
| Serial Number | 0xFF | 0x16 |   8    | sn(8B)                                                                                           |
| LoRaWAN Class | 0xFF | 0x0F |   1    | lorawan_class(1B)<br/>lorawan_class, values: (0: Class A, 1: Class B, 2: Class C, 3: Class CtoB) |
|  Reset Event  | 0xFF | 0xFE |   1    | reset_event(1B)                                                                                  |
| Device Status | 0xFF | 0x0B |   1    | device_status(1B)                                                                                |

### Telemetry

|       CHANNEL        |  ID  | TYPE | LENGTH | DESCRIPTION                                                              |
| :------------------: | :--: | :--: | :----: | ----------------------------------------------------------------------- |
|       Battery        | 0x01 | 0x75 |   1    | battery(1B)<br/>battery, unit: %, read: uint8                           |
|     Temperature      | 0x03 | 0x67 |   2    | temperature(2B)<br/>temperature, unit: °C, read: int16/10               |
|       Location       | 0x04 | 0x88 |   9    | latitude(4B) + longitude(4B) + motion_status(1B)                        |
|       Position       | 0x05 | 0x00 |   1    | position(1B)<br/>position, values: (0: normal, 1: tilt)                 |
|      Wifi Scan       | 0x06 | 0xD9 |   9    | ID(1B) + MAC(6B) + RSSI(1B) + motion_status(1B)                         |
|    Tamper Status     | 0x07 | 0x00 |   1    | tamper_status(1B)<br/>tamper_status, values: (0: install, 1: uninstall) |
|     Motion Alarm     | 0x88 | 0xE5 |   9    | event_id(4B) + acceleration(1B) + battery(1B) + angle_x(1B) + angle_y(1B) + angle_z(1B) |
| Periodic Statistics  | 0x09 | 0xE6 |   7    | alarm_count(2B) + max_acceleration(1B) + avg_acceleration(1B) + angle_x(1B) + angle_y(1B) + angle_z(1B) |
| Temperature Abnormal | 0x83 | 0x67 |   3    | temperature(2B) + temperature_abnormal(1B)                              |
|     History Data     | 0x20 | 0xCE |   12   | timestamp(4B) + longitude(4B) + latitude(4B)                            |
| Motion Alarm History | 0x22 | 0xCE |   9    | timestamp(4B) + event_id(4B) + acceleration(1B)                         |

motion_status

|    BITS     | 7 - 4                                                          | 3 - 0                                                                   |
| :---------: | :------------------------------------------------------------- | :---------------------------------------------------------------------- |
| DESCRIPTION | Geofence Status, (0: inside, 1: outside, 2: unset, 3: unknown) | Motion Status, (0: unknown, 1: start moving, 2: moving, 3: stop moving) |

periodic_statistics

|        FIELD         | ENCODING | UNIT | RANGE      | DESCRIPTION                                                |
| :------------------: | :------: | :--: | :--------- | :--------------------------------------------------------- |
|     alarm_count      | uint16LE |      | 0 - 65535  | Number of acceleration threshold alarms in this period     |
|   max_acceleration   |  uint8   |  g   | 0 - 2.55   | Raw value / 100; must be 0 when `alarm_count` is 0          |
|   avg_acceleration   |  uint8   |  g   | 0 - 2.55   | Raw value / 100; must be 0 when `alarm_count` is 0          |
|       angle_x        |   int8   |  °   | -90 - 90   | X-axis inclination angle                                   |
|       angle_y        |   int8   |  °   | -90 - 90   | Y-axis inclination angle                                   |
|       angle_z        |   int8   |  °   | -90 - 90   | Z-axis inclination angle                                   |

motion_alarm

|      FIELD       | ENCODING | UNIT | RANGE         | DESCRIPTION                                   |
| :--------------: | :------: | :--: | :------------ | :-------------------------------------------- |
|     event_id     | uint32LE |      | 0 - 4294967295 | Alarm event timestamp                         |
|   acceleration   |  uint8   |  g   | 0.10 - 2.00   | Raw value / 100                               |
|     battery      |  uint8   |  %   | 0 - 100       | Battery level                                 |
|     angle_x      |   int8   |  °   | -90 - 90      | X-axis inclination angle                      |
|     angle_y      |   int8   |  °   | -90 - 90      | Y-axis inclination angle                      |
|     angle_z      |   int8   |  °   | -90 - 90      | Z-axis inclination angle                      |

## Example

```json
// 017564 03671B01 050000 048836BF7701F000090722
{
    "battery": 100,
    "geofence_status": "unset",
    "longitude": 118.030576,
    "latitude": 24.62495,
    "motion_status": "moving",
    "position": "normal",
    "temperature": 28.3
}

// 017564 03671B01 050001 06D9081CC316222DF9C302 06D90824E124F6A667B602 06D90824E124F54DE3BC02 06D90824E124F57971B202 06D90824E124F319A8C802
{
    "battery": 100,
    "motion_status": "moving",
    "position": "tilt",
    "temperature": 28.3,
    "wifi": [
        {
            "group": 8,
            "mac": "1c:c3:16:22:2d:f9",
            "motion_status": "moving",
            "rssi": -61
        },
        {
            "group": 8,
            "mac": "24:e1:24:f6:a6:67",
            "motion_status": "moving",
            "rssi": -74
        },
        {
            "group": 8,
            "mac": "24:e1:24:f5:4d:e3",
            "motion_status": "moving",
            "rssi": -68
        },
        {
            "group": 8,
            "mac": "24:e1:24:f5:79:71",
            "motion_status": "moving",
            "rssi": -78
        },
        {
            "group": 8,
            "mac": "24:e1:24:f3:19:a8",
            "motion_status": "moving",
            "rssi": -56
        }
    ],
    "wifi_scan_result": "finish"
}

// 09E602007D50F6141E
{
    "alarm_count": 2,
    "max_acceleration": 1.25,
    "avg_acceleration": 0.8,
    "angle_x": -10,
    "angle_y": 20,
    "angle_z": 30
}

// 88E5785634127D64F6141E
{
    "event_id": 305419896,
    "acceleration": 1.25,
    "battery": 100,
    "angle_x": -10,
    "angle_y": 20,
    "angle_z": 30
}
```
