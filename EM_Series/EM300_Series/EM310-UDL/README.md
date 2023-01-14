# Ultrasonic Distance/Level Sensor - Milesight IoT
![EM300-UDL](EM310-UDL.png)

The payload decoder function is applicable to EM310-UDL. 

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).


## Payload Definition

 ```
--------------------- Payload Definition ---------------------

                    [channel_id] [channel_type] [channel_value]
 01: battery      -> 0x01         0x75          [1byte ] Unit: %
 03: distance     -> 0x03         0x82          [2bytes] Unit: mm
 04: position     -> 0x04         0x00          [1byte ] Unit: 
 ------------------------------------------ EM310-UDL
 ```

## Example for The Things Network

**Payload**
```
01 75 5C 03 82 44 08 04 00 01
```



**Data Segmentation**

   - `01 75 5C`
   - `03 82 44 08`
   - `04 00 01`



**Output**

 ```json
{
  "battery": 92,
  "distance": 2116,
  "position": "tilt"
}
 ```
