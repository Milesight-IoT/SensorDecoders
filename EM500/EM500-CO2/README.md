# CO2 Sensor - Milesight IoT
![EM500-CO2](EM500-CO2.png)

The payload decoder function is applicable to EM500-CO2. 

For more detailed information, please visit [milsight official website](https://www.milesight-iot.com/lorawan/sensor/em500-co2/).


## Payload Definition

 ```
--------------------- Payload Definition ---------------------

                    [channel_id] [channel_type] [channel_value]
 01: battery      -> 0x01         0x75          [1byte ] Unit: %
 03: temperature  -> 0x03         0x67          [2bytes] Unit: °C (℉)
 04: humidity     -> 0x04         0x68          [1byte ] Unit: %RH
 05: CO2          -> 0x05         0x7D          [2bytes] Unit: ppm
 06: pressure     -> 0x09         0x73          [2bytes] Unit: hPa
 ------------------------------------------ EM500-CO2
 ```

## Example for The Things Network

**Payload**
```
01 75 64 03 67 19 01 04 68 73 05 7D 67 04 06 73 68 27
```



**Data Segmentation**

   - `01 75 64`
   - `03 67 19 01`
   - `04 68 73`
   - `05 7D 67 04`
   - `06 73 68 27`


**Output**

 ```json
{
  "battery": 100,
  "temperature": 28.1,
  "humidity": 57.5,
  "co2": 1127,
  "pressure": 1008.8
}
 ```