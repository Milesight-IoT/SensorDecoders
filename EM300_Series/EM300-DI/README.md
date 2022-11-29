# Temperature & Humidity Sensor - Milesight IoT

![EM300-DI](EM300-DI.png)

The payload decoder function is applicable to EM300-DI.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

## Payload Definition

```
--------------------- Payload Definition ---------------------

                   [channel_id] [channel_type] [channel_value]
01: battery      -> 0x01         0x75          [ 1byte ] Unit: %
03: temperature  -> 0x03         0x67          [ 2bytes] Unit: °C (℉)
04: humidity     -> 0x04         0x68          [ 1byte ] Unit: %RH
05: gpio         -> 0x05         0x00          [ 1byte ] Unit: -
05: pulse        -> 0x05         0xC8          [ 4bytes] Unit: -
20: history      -> 0x20         0xCE          [13bytes] Unit: -
------------------------------------------ EM300-DI ----------


-- Historical Data Frame
+------------------------------------------------------------------------------------------------------------------------------+
| Desc   | Channel ID(1B) | Data Type(1B) | Timestamp(4B) | Temperature(2B) | Humidity(1B) | Mode(1B) | GPIO(1B) | PULSE(4B)   |
| -------+----------------+---------------+---------------+-----------------+--------------+----------+----------+------------ |
| Sample | 20             | CE            | 9E 74 46 63   | 10 01           | 5D           | 02       | 00       | 00 01 00 00 |
| Value  | -              | -             | 1665561758    | 27.2            | 46.5         | PULSE    | 0        | 256         |
+------------------------------------------------------------------------------------------------------------------------------+

Mode:
- 0: None
- 1: GPIO
- 2: PULSE

```

## Example for The Things Network

**Payload**

```
01 75 5C 03 67 34 01 04 68 65 20 CE 9E 74 46 63 10 01 5D 02 00 00 01 00 00
```

**Data Segmentation**

-   `01 75 5C`
-   `03 67 34 01`
-   `04 68 65`
-   `20 CE 9E 74 46 63 10 01 5D 02 00 00 01 00 00`

**Output**

```json
{
    "battery": 92,
    "temperature": 30.8,
    "humidity": 50.5,
    "history": [
        {
            "temperature": 27.2,
            "humidity": 46.5,
            "pulse": 256,
            "timestamp": 1665561758
        }
    ]
}
```
