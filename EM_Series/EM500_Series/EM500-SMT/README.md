# Soil Moisture, Temperature and Electrical Conductivity Sensor - Milesight IoT
![EM500-SMTC](EM500-SMTC.png)

The payload decoder function is applicable to EM500-SMTC. 

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).


## Payload Definition

 ```
--------------------- Payload Definition ---------------------

                    [channel_id] [channel_type] [channel_value]
 01: battery      -> 0x01         0x75          [1byte ] Unit: %
 03: temperature  -> 0x03         0x67          [2bytes] Unit: °C (℉)
 04: moisture     -> 0x04         0x68          [1byte ] Unit: %RH
 04: moisture     -> 0x04         0xCA          [2bytes] Unit: %RH
 05: EC           -> 0x05         0x7F          [2bytes] Unit: µs/cm
 ------------------------------------------ EM500-SMTC
 ```

## Example for The Things Network

**Payload**
```
01 75 64 03 67 19 01 04 68 73 05 7F F0 00
```



**Data Segmentation**

   - `01 75 64`
   - `03 67 19 01`
   - `04 68 73`
   - `05 7F F0 00`



**Output**

 ```json
{
  "battery": 100,
  "temperature": 28.1,
  "moisture": 57.5,
  "ec": 240
}
 ```
