# Ultrasonic Distance/Level Sensor - Milesight IoT
![EM500-UDL](EM500-UDL.png)

The payload decoder function is applicable to EM500-UDL. 

For more detailed information, please visit [milsight official website](https://www.milesight-iot.com/lorawan/sensor/em500-udl/).


## Payload Definition

 ```
--------------------- Payload Definition ---------------------

                    [channel_id] [channel_type] [channel_value]
 01: battery      -> 0x01         0x75          [1byte ] Unit: %
 03: distance     -> 0x03         0x82          [2bytes] Unit: mm
 ------------------------------------------ EM500-UDL
 ```

## Example for The Things Network

**Payload**
```
01 75 64 03 82 1E 00
```



**Data Segmentation**

   - `01 75 64`
   - `03 82 1E 000`



**Output**

 ```json
{
  "battery": 100,
  "distance": 30
}
 ```