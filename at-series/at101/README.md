# Outdoor Asset Tracker - AT101

![AT101](AT101.png)

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
| Temperature Abnormal | 0x83 | 0x67 |   3    | temperature(2B) + temperature_abnormal(1B)                              |
|     History Data     | 0x20 | 0xCE |   12   | timestamp(4B) + longitude(4B) + latitude(4B)                            |

motion_status

|    BITS     | 7 - 4                                                          | 3 - 0                                                                   |
| :---------: | :------------------------------------------------------------- | :---------------------------------------------------------------------- |
| DESCRIPTION | Geofence Status, (0: inside, 1: outside, 2: unset, 3: unknown) | Motion Status, (0: unknown, 1: start moving, 2: moving, 3: stop moving) |

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
```
