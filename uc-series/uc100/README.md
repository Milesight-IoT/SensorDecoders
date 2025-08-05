# Controller - UC100

![UC100](UC100.png)

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/iot-controller/uc100)

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

|     CHANNEL     |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                                                                                                                          |
| :-------------: | :--: | :--: | :----: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     Modbus      | 0xFF | 0x19 |   N    | modbus_chn_id(1B) + data_size(1B) + data_type(1B) + channel_value(MB)                                                                                                                                |
|  Modbus Error   | 0xFF | 0x15 |   1    | modbus_chn_id(1B)                                                                                                                                                                                    |
|  Modbus Alarm   | 0xFF | 0xEE |   N    | modbus_chn_def(1B) + data_length(1B) + modbus_chn_data_def(1B) + data(MB)<br/>modbus_chn_def, modbus_chn_id(0..5) + modbus_chn_event(6..7)<br/>modbus_chn_data_def, modbus_data_type(0..6) + sign(7) |
| Modbus History  | 0x20 | 0xCE |   10   | timestamp(4B) + data_length(1B) + modbus_chn_data_def(1B) + data(4B)<br/>modbus_chn_data_def, reserved(1) + modbus_data_type(2..6) + sign(7)                                                         |
| Message History | 0x20 | 0xCD |   N    | timestamp(4B) + size(1B) + data(MB)                                                                                                                                                                  |

### MODBUS DATA DESCRIPTION

**modbus_chn_event**

| ID  | EVENT TYPE              |
| :-: | :---------------------- |
|  0  | normal                  |
|  1  | threshold alarm         |
|  2  | threshold release alarm |
|  3  | mutation alarm          |

**modbus_data_type**

| ID  | DATA TYPE               |
| :-: | :---------------------- |
|  0  | MB_REG_COIL             |
|  1  | MB_REG_DIS              |
|  2  | MB_REG_INPUT_AB         |
|  3  | MB_REG_INPUT_BA         |
|  4  | MB_REG_INPUT_INT32_ABCD |
|  5  | MB_REG_INPUT_INT32_BADC |
|  6  | MB_REG_INPUT_INT32_CDAB |
|  7  | MB_REG_INPUT_INT32_DCBA |
|  8  | MB_REG_INPUT_INT32_AB   |
|  9  | MB_REG_INPUT_INT32_CD   |
| 10  | MB_REG_INPUT_FLOAT_ABCD |
| 11  | MB_REG_INPUT_FLOAT_BADC |
| 12  | MB_REG_INPUT_FLOAT_CDAB |
| 13  | MB_REG_INPUT_FLOAT_DCBA |
| 14  | MB_REG_HOLD_INT16_AB    |
| 15  | MB_REG_HOLD_INT16_BA    |
| 16  | MB_REG_HOLD_INT32_ABCD  |
| 17  | MB_REG_HOLD_INT32_BADC  |
| 18  | MB_REG_HOLD_INT32_CDAB  |
| 19  | MB_REG_HOLD_INT32_DCBA  |
| 20  | MB_REG_HOLD_INT32_AB    |
| 21  | MB_REG_HOLD_INT32_CD    |
| 22  | MB_REG_HOLD_FLOAT_ABCD  |
| 23  | MB_REG_HOLD_FLOAT_BADC  |
| 24  | MB_REG_HOLD_FLOAT_CDAB  |
| 25  | MB_REG_HOLD_FLOAT_DCBA  |
