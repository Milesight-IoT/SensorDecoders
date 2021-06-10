# Workplace Sensors - Milesight IoT
![WS50x](WS50x.png)

The payload decoder function is applicable to WS50x. 

For more detailed information, please visit [milesight official website](https://www.milesight-iot.com).


## Payload Definition

 ```
--------------------- Payload Definition ---------------------

                    [channel_id] [channel_type] [channel_value]
 01: switch       -> 0xFF         0x29          [1byte ] Unit: 
 ------------------------------------------ WS50x

---- Channel Value Definition ---
binary:  0 0 0 0 0 0 0 0
switch:    3 2 1   3 2 1
         ------- -------
bitmask:  change   state

----------

 ```

## Example for The Things Network

**Payload**
```
FF 29 11
```

**Data Segmentation**

   - `FF 29 31`



**Output**

 ```json
{
  "switch_1": "open",
  "switch_2": "close",
  "switch_3": "close",
  "switch_1_change": "yes",
  "switch_2_change": "yes",
  "switch_3_change": "no"
}
 ```
