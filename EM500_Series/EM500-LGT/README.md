# Light Sensor - Milesight IoT
![EM500-LGT](EM500-LGT.png)

The payload decoder function is applicable to EM500-LGT. 

For more detailed information, please visit [milsight official website](https://www.milesight-iot.com/lorawan/sensor/em500-lgt/).


## Payload Definition

 ```
--------------------- Payload Definition ---------------------

                    [channel_id] [channel_type] [channel_value]
 01: battery      -> 0x01         0x75          [1byte ] Unit: %
 03: illumination -> 0x03         0x94          [4bytes] Unit: lux
 ------------------------------------------ EM500-LGT
 ```

## Example for The Things Network

**Payload**
```
01 75 64 03 94 50 00 00 00
```



**Data Segmentation**

   - `01 75 64`
   - `03 94 50 00 00 00`



**Output**

 ```json
{
  "battery": 100,
  "illumination": 80
}
 ```