# Magnetic Contact Switch - Milesight IoT
![EM300-MCS](EM300-MCS.png)

The payload decoder function is applicable to EM300-MCS. 

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).


## Payload Definition

 ```
--------------------- Payload Definition ---------------------

                    [channel_id] [channel_type] [channel_value]
 01: battery      -> 0x01         0x75          [1byte ] Unit: %
 03: temperature  -> 0x03         0x67          [2bytes] Unit: °C (℉)
 04: humidity     -> 0x04         0x68          [1byte ] Unit: %RH
 06: door         -> 0x05         0x00          [1byte ] Unit: N/A
 ------------------------------------------ EM300-MCS
 ```

## Example for The Things Network

**Payload**
```
01 75 5C 03 67 34 01 04 68 65 06 00 01
```



**Data Segmentation**

   - `01 75 5C`
   - `03 67 34 01`
   - `04 68 65`
   - `06 00 01`



**Output**

 ```json
{
  "battery": 92,
  "temperature": 30.8,
  "humidity": 50.5,
  "door": "open"
}
 ```
