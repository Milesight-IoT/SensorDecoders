# Temperature & Humidity Sensor - Milesight IoT
![EM300-TH](EM300-TH.png)

The payload decoder function is applicable to EM300-TH. 

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).

## Payload Definition

 ```
--------------------- Payload Definition ---------------------

                    [channel_id] [channel_type] [channel_value]
 01: battery      -> 0x01         0x75          [1byte ] Unit: %
 03: temperature  -> 0x03         0x67          [2bytes] Unit: °C (℉)
 04: humidity     -> 0x04         0x68          [1byte ] Unit: %RH
 ------------------------------------------ EM300-TH
 ```

## Example for The Things Network

**Payload**
```
01 75 5C 03 67 34 01 04 68 65
```



**Data Segmentation**

   - `01 75 5C`
   - `03 67 34 01`
   - `04 68 65`



**Output**

 ```json
{
  "battery": 92,
  "temperature": 30.8,
  "humidity": 50.5
}
 ```
