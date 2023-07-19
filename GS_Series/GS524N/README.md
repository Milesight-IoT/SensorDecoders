# Smoke Detection Sensor - Milesight IoT

The payload decoder function is applicable to GS524N.

For more detailed information, please visit [Milesight official website](https://www.milesight-iot.com).

![GS524N](GS524N.png)

## Payload Definition

| Bytes | Description                                                                                                                                                                                                                                                 |
| :---: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   1   | bits: <br/>- [7..4]: software version. range: [1, 15], current version: 2<br/>- [3..0]: protocol version. range: [1, 15], current version: 2                                                                                                                |
|   2   | bits: <br/>- [7..4]: sensor type. 1: smoke detection sensor. <br/>-[3..0]: message type. 1: alarm, 2: silent, 4: low battery, 5: failover, 7: normal, 10: removed, 11: installed, 14: testing alarm with normal battery, 15: testing alarm with low battery |
|   3   | battery. uint: %                                                                                                                                                                                                                                            |
|   4   | smoke concentration. uint: %                                                                                                                                                                                                                                |
|   5   | temperature. range: [-20, 70], uint: ℃                                                                                                                                                                                                                      |
|   6   | CRC. byte1 + byte2 + byte3 + byte4 + byte5 + byte6 = 00H                                                                                                                                                                                                    |
