# Wireless Thermostat - Milesight IoT

The payload decoder function is applicable to WT101.

For more detailed information, please visit [Milesight official website](https://www.milesight-iot.com).

![WT101](WT101.png)

## Payload Definition

| CHANNEL                         |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                                                                                                          |
| :------------------------------ | :--: | :--: | :----: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Battery                         | 0x01 | 0x75 |   1    | battery(1B)<br/>battery, unit：%, read: uint8                                                                                                                                        |
| Ambient Temperature             | 0x03 | 0x67 |   2    | temperature(2B)<br/>temperature, read: int16/10, unit: ℃                                                                                                                             |
| Target Temperature              | 0x04 | 0x67 |   2    | temperature_target(2B)<br/>temperature_target, read: int16/10, unit: ℃                                                                                                               |
| Valve Opening                   | 0x05 | 0x92 |   1    | valve_opening(1B)<br/>valve_opening, read: uint8, unit: %                                                                                                                            |
| Installation Status             | 0x06 | 0x00 |   1    | install(1B)<br/>install, read: uint8, values: (0: installed, 1: uninstalled)                                                                                                         |
| Fenestration Detection          | 0x07 | 0x00 |   1    | fenestration(1B)<br/>fenestration, read: uint8, values: (0: normal, 1: open)                                                                                                         |
| Motor Storke Calibration Status | 0x08 | 0xE5 |   1    | motor_calibration(1B)<br/>motor_calibration, read: uint8, values: (0: success, 1: fail: out of range, 2: fail: uninstalled, 3: calibration cleared, 4: temperature control disabled) |
| Motor Storke                    | 0x09 | 0x90 |   2    | motor_storke(2B)<br/>motor_storke, read: uint16                                                                                                                                      |
| Freeze Protection               | 0x0A | 0x00 |   1    | freeze_protection(1B)<br/>freeze_protection, read: uint8, values: (0: normal, 1: triggered)                                                                                          |
| Motor Position                  | 0x0B | 0x90 |   2    | motor_position(2B)<br/>motor_position, read: uint16                                                                                                                                  |

## Sample

```json
// 017561 04672C01 03670A01 059264 09900000 0B900000
{
    "battery": 97,
    "temperature": 26.6,
    "temperature_target": 30,
    "valve_opening": 100,
    "motor_position": 0,
    "motor_storke": 0
}

// 08E50009900802
{
    "motor_storke": 520,
    "motor_calibration": "success"
}

// 060000
{
    "install": "installed"
}

// 070001
{
    "fenestration": "open"
}

// 08E501
{
    "motor_calibration": "fail: out of range"
}

// 0A0001
{
    "freeze_protection": "triggered"
}
```
