# Bathroom Occupancy Sensor - Milesight IoT

The payload decoder function is applicable to VS330.

For more detailed information, please visit [Milesight Official Website](https://www.milesight.com/iot/product/lorawan-sensor/vs330).

![VS330](vs330.png)

## Payload Definition

|       CHANNEL       |  ID  | TYPE | LENGTH | DESCRIPTION                                                                                                                                                        |
| :-----------------: | :--: | :--: | :----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|       Battery       | 0x01 | 0x75 |   1    | battery(1B)<br />battery, unit: %                                                                                                                                  |
|      Distance       | 0x02 | 0xA5 |   8    | distance_1(2B) + distance_2(2B) + distance_3(2B) + distance_4(2B)<br />distance_x, unit: mm                                                                        |
|      Occupancy      | 0x03 | 0x8E |   1    | occupancy(1B)<br />occupancy, values: (0: vacant, 1: occupied, 2: first_learn_unfinished, 3: collection_failed)                                                    |
| First Learn Status  | 0x04 | 0xA8 |   1    | first_learn_status(1B)<br />first_learn_status, values: (0: learn_unfinished, 1: success, 2: learn_failed_with_collect_error, 3: lear_failed_with_pir_interrupt)   |
| Second Learn Status | 0x08 | 0xA8 |   1    | second_learn_status(1B)<br />second_learn_status, values: (0: learn_unfinished, 1: success, 2: learn_failed_with_collect_error, 3: lear_failed_with_pir_interrupt) |
|   Ambient Counts    | 0x06 | 0xA6 |   1    | ambient_counts(1B)                                                                                                                                                 |
|     Similarity      | 0x07 | 0xA7 |   1    | similarity(1B)                                                                                                                                                     |
|  Collection Counts  | 0x09 | 0xA9 |   4    | collection_counts(4B)                                                                                                                                              |

## Example

```json
// 017562 02A5B80B800CB80B800C 038E01 04A801 06A690800000 08A801
{
  "ambient_counts": 32912,
  "battery": 98,
  "distance_1": 3000,
  "distance_2": 3200,
  "distance_3": 3000,
  "distance_4": 3200,
  "first_learn_status": "success",
  "second_learn_status": "success",
  "occupancy": "occupied"
}
```
