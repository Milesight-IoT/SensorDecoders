# Submersible Water Level Sensor - Milesight IoT
![EM500-SWL](EM500-SWL.png)

The payload decoder function is applicable to EM500-SWL. 

For more detailed information, please visit [milsight official website](https://www.milesight-iot.com/lorawan/sensor/em500-swl/).


## Payload Definition

 ```
--------------------- Payload Definition ---------------------

                    [channel_id] [channel_type] [channel_value]
 01: battery      -> 0x01         0x75          [1byte ] Unit: %
 03: water_level  -> 0x03         0x77          [2bytes] Unit: cm
 ------------------------------------------ EM500-SWL
 ```

## Example for The Things Network

**Payload**
```
01 75 64 03 77 02 00
```



**Data Segmentation**

   - `01 75 64`
   - `03 77 02 00`



**Output**

 ```json
{
  "battery": 100,
  "water_level": 2
}
 ```