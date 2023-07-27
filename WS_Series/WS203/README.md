# PIR & Temperature - Milesight IoT

The payload decoder function is applicable to WS203.

For more detailed information, please visit [Milesight official website](https://www.milesight-iot.com).

![WS203](WS203.png)

## Payload Definition

|       channel        | channel_id | channel_type | data_length (bytes) | description                                                                                                                                                                                                           |
| :------------------: | :--------: | :----------: | :-----------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|       battery        |    0x01    |     0x75     |          1          | unit: %                                                                                                                                                                                                               |
|     temperature      |    0x03    |     0x67     |          2          | unit: ℃                                                                                                                                                                                                               |
|       humidity       |    0x04    |     0x68     |          1          | unit: %RH                                                                                                                                                                                                             |
|      occupancy       |    0x05    |     0x00     |          1          | 0: vacant<br />1: occupied                                                                                                                                                                                            |
| temperature abnormal |    0x83    |     0x67     |          3          | temperature(2B) + alert(1B)                                                                                                                                                                                           |
|   historical data    |    0x20    |     0xCE     |          9          | timestamp(4B) + report_type(1B) + occupancy(1B) + temperature(2B) + humidity(1B) <br/><br/>**report_type**:<br/>0: temperature resume<br/>1: temperature threshold<br/>2: pir ilde<br/>3: pir occupancy<br/>4: period |

## Example

```json
// Sample(hex): 017564 03673401 046865 050000
{
    "battery": 100,
    "humidity": 50.5,
    "occupancy": "vacant",
    "temperature": 30.8
}

// Sample(hex): 8367220101
{
    "temperature": 29,
    "temperature_abnormal": "abnormal"
}

// Sample(hex): 20CEAE5BA6640400240165 20CE5C5CA6640301340165
{
    "history": [
        {
            "humidity": 50.5,
            "occupancy": "vacant",
            "report_type": "period",
            "temperature": 29.2,
            "timestamp": 1688624046
        },
        {
            "humidity": 50.5,
            "occupancy": "occupied",
            "report_type": "pir occupancy",
            "temperature": 30.8,
            "timestamp": 1688624220
        }
    ]
}
```
