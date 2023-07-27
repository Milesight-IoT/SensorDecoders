# Temperature & Humidity Sensor - Milesight IoT

The payload decoder function is applicable to EM320-TH.

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

![EM320-TH](EM320-TH.png)

## Payload Definition

```
--------------------- Payload Definition ---------------------

                   [channel_id] [channel_type] [channel_value]
01: battery      -> 0x01         0x75          [1byte ] Unit: %
03: temperature  -> 0x03         0x67          [2bytes] Unit: °C (℉)
04: humidity     -> 0x04         0x68          [1byte ] Unit: %RH
20: history      -> 0x20         0xCE          [7bytes] Unit: -
------------------------------------------ EM320-TH ----------


-- Historical Data Frame
--------------------------------------------------------------------------------------------
| Desc   | Channel ID(1B) | Data Type(1B) | Timestamp(4B) | Temperature(2B) | Humidity(1B) |
| ------ | -------------- | ------------- | ------------- | --------------- | ------------ |
| Sample | 20             | CE            | 9E 74 46 63   | 10 01           | 5D           |
| Value  | -              | -             | 1665561758    | 27.2            | 46.5         |

```

## Example for The Things Network

**Payload**

```
01 75 5c 03 67 34 01 04 68 65 20 CE 9E 74 46 63 10 01 5D
```

**Data Segmentation**

-   `01 75 5C`
-   `03 67 34 01`
-   `04 68 65`
-   `20 CE 9E 74 46 63 10 01 5D`

**Output**

```json
{
    "battery": 92,
    "temperature": 30.8,
    "humidity": 50.5,
    "history": [
        {
            "humidity": 46.5,
            "temperature": 27.2,
            "timestamp": 1665561758
        }
    ]
}
```
