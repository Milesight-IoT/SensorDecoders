# Multi-interface Controller - Milesight IoT

The payload decoder function is applicable to UC501 / UC502.

For more detailed information, please visit [Milesight official website](https://www.milesight-iot.com).

|        UC501 v3        |        UC502 v3        |
| :--------------------: | :--------------------: |
| ![UC501](UC501_v3.png) | ![UC502](UC502_v3.png) |

## Payload Definition

|           channel            | channel_id | channel_type | data_length (bytes) | description                                                                                                                                                                                                                                                                                                                         |
| :--------------------------: | :--------: | :----------: | :-----------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|           battery            |    0x01    |     0x75     |          1          | unit: %                                                                                                                                                                                                                                                                                                                             |
| gpio 1<br />(digital input)  |    0x03    |     0x00     |          1          | 0x00: low<br />0x01: high                                                                                                                                                                                                                                                                                                           |
| gpio 2<br />(digital input)  |    0x04    |     0x00     |          1          | 0x00: low<br />0x01: high                                                                                                                                                                                                                                                                                                           |
| gpio 1<br />(digital ouput)  |    0x03    |     0x01     |          1          | 0x00: low<br />0x01: high                                                                                                                                                                                                                                                                                                           |
| gpio 2<br />(digital output) |    0x04    |     0x01     |          1          | 0x00: low<br />0x01: high                                                                                                                                                                                                                                                                                                           |
|     gpio 1<br />(couter)     |    0x03    |     0xC8     |          4          | unsigned value                                                                                                                                                                                                                                                                                                                      |
|    gpio 2<br />(counter)     |    0x04    |     0xC8     |          4          | unsigned value                                                                                                                                                                                                                                                                                                                      |
|   adc 1 <br/>(version: v2)   |    0x05    |     0x02     |          8          | current(2B) + min(2B) + max(2B) + avg(2B) <br/>read: int16 /1000                                                                                                                                                                                                                                                                    |
|   adc 2 <br/>(version: v2)   |    0x06    |     0x02     |          8          | current(2B) + min(2B) + max(2B) + avg(2B) <br/>read: int16 /1000                                                                                                                                                                                                                                                                    |
|   adc 1 <br/>(version: v3)   |    0x05    |     0xE2     |          8          | current(2B) + min(2B) + max(2B) + avg(2B) <br/>read: float16                                                                                                                                                                                                                                                                        |
|   adc 2 <br/>(version: v3)   |    0x06    |     0xE2     |          8          | current(2B) + min(2B) + max(2B) + avg(2B) <br/>read: float16                                                                                                                                                                                                                                                                        |
|  SDI-12 <br/>(version: v3)   |    0x08    |     0xDB     |         37          | channel_id(1B) + channel_data(36B)                                                                                                                                                                                                                                                                                                  |
|            RS485             |    0xFF    |     0x0E     |          N          | channel_id(1B) + channel_def(1B) + data(MB)<br />channel_def:<br />- [2...0] bit: modbus type<br />- [7...3] bit: data size<br /><br />modbus type:<br />- 0: COIL<br />- 1: DIS<br />- 2: REG INPUT<br />- 3: REG HOLD INT16<br />- 4: REG HOLD INT32<br />- 5: REG HOLD FLOAT<br />- 6: REG INPUT INT32<br />- 7: REG INPUT FLOAT |
|         RS485 Fault          |    0xFF    |     0x15     |          1          | channel_id(1B)                                                                                                                                                                                                                                                                                                                      |
|         adc 1 laert          |    0x85    |     0xE2     |          9          | current(2B) + min(2B) + max(2B) + avg(2B) + alarm_type(1B) <br/>read: float16<br />alarm_type: <br />- 0: threshold<br />- 1: value change                                                                                                                                                                                          |
|         adc 1 laert          |    0x86    |     0xE2     |          9          | current(2B) + min(2B) + max(2B) + avg(2B) + alarm_type(1B) <br/>read: float16<br />alarm_type: <br />- 0: threshold<br />- 1: value change                                                                                                                                                                                          |
|         RS485 alert          |    0x80    |     0x0E     |          N          | channel_id(1B) + channel_def(1B) + data(MB) + alarm_type(1B)<br />alarm_type: <br />- 0: threshold<br />- 1: value change                                                                                                                                                                                                           |
|        sensor History        |    0x20    |     0xDC     |         22          | timestamp(4B) + gpio_1_type(1B) + gpio_1_data(4B) + gpio_2_type(1B) + gpio_2_data(4B) + ai_1_data(4B) + ai_2_data(4B)                                                                                                                                                                                                               |
|        modbus history        |    0x20    |     0xDD     |          N          | timestamp(4B) + modbus_mask(2B) + modbus_data(M \* 5B)                                                                                                                                                                                                                                                                              |
|        sdi-12 history        |    0x20    |     0xE0     |          N          | timestamp(4B) + sdi_mask(2B) + sdi_data(M \* 36B)                                                                                                                                                                                                                                                                                   |

## Example

```json
// Sample(hex): 01 75 64
{
    "battery": 100
}

// Sample(hex): 03 00 01
{
    "gpio_1": "on"
}

// Sample(hex): 03 C8 70 17 00 00
{
    "counter_1": 6000
}

// Sample(hex): 05 02 98 3A 00 00 00 00 00 00
{
    "adc_1": {
        "avg": 0,
        "cur": 15,
        "max": 0,
        "min": 0
    }
}

// Sample(hex): FF 0e 09 26 10 27 00 00
{
    "chn_3": 10000
}

// Sample(hex): FF 15 07
{
    "chn_1_alert": "read error"
}

// Sample(hex): 08 DB 02 61 2B 31 2E 36 2B 30 2B 32 35 2E 37 0D 0A 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
{
    "sdi12_3": "a+1.6+0+25.7\r\n"
}
```
