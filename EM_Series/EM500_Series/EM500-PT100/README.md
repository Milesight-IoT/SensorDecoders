# Industrial Temperature Sensor - Milesight IoT
![EM500-PT100](EM500-PT100.png)

The payload decoder function is applicable to EM500-PT100. 

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).


## Payload Definition

 ```
--------------------- Payload Definition ---------------------

                    [channel_id] [channel_type] [channel_value]
 01: battery      -> 0x01         0x75          [1byte ] Unit: %
 03: temperature  -> 0x03         0x67          [2bytes] Unit: °C / ℉
 ------------------------------------------ EM500-PT100
 ```

## Example for The Things Network

**Payload**
```
01 75 64 03 67 19 01
```



**Data Segmentation**

   - `01 75 64`
   - `03 67 19 01`



**Output**

 ```json
{
  "battery": 100,
  "temperature": 28.1
}
 ```
