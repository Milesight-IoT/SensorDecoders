# Ambience Monitoring Sensors - Milesight IoT
![AM300](AM319.png)

The payload decoder function is applicable to AM307 and AM319. 

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).


## Payload Definition

 ```
--------------------- Payload Definition ---------------------

                    [channel_id] [channel_type] [channel_value]
 01: battery      -> 0x01         0x75          [1byte ] Unit: %
 03: temperature  -> 0x03         0x67          [2bytes] Unit: °C (℉)
 04: humidity     -> 0x04         0x68          [1byte ] Unit: %RH
 05: PIR          -> 0x05         0x00          [1byte ] Unit: 
 06: light_level  -> 0x06         0xCB          [1byte ] Unit: 
 07: CO2          -> 0x07         0x7D          [2bytes] Unit: ppm
 08: tVOC         -> 0x08         0x7D          [2bytes] Unit: 
 09: pressure     -> 0x09         0x73          [2bytes] Unit: hPa
 ------------------------------------------ AM307
 
 0A: HCHO         -> 0x0A         0x7D          [2bytes] Unit: mg/m3
 0B: PM2.5        -> 0x0B         0x7D          [2bytes] Unit: ug/m3
 0C: PM10         -> 0x0C         0x7D          [2bytes] Unit: ug/m3
 0D: O3           -> 0x0D         0x7D          [2bytes] Unit: ppm
 0E: beep         -> 0x0E         0x01          [1byte ] Unit: 
 ------------------------------------------ AM319
 ```

## Example for The Things Network

**Payload**
```
03 67 EE 00 04 68 7C 05 00 01 06 CB 02 07 7D A8 03 08 7D 25 00 09 73 66 27 0A 7D 04 00 0B 7D 20 00 0C 7D 30 00
```


**Data Segmentation**

   - `03 67 EE 00`
   - `04 68 7C`
   - `05 00 01`
   - `06 CB 02`
   - `07 7D A8 03`
   - `08 7D 25 00`
   - `09 73 3F 27`
   - `0A 7D 04 00`
   - `0B 7D 20 00`
   - `0C 7D 30 00`

**Output**

 ```json
{
  "temperature": 23.8,
  "humidity": 62,
  "pir": "trigger",
  "light_level": 2,
  "co2": 936,
  "tvoc": 37,
  "pressure": 1008.6,
  "hcho": 0.04,
  "pm2_5": 32,
  "pm10": 48
}
 ```
