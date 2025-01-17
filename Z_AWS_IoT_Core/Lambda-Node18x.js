import { IoTDataPlaneClient, PublishCommand } from "@aws-sdk/client-iot-data-plane"; // ES Modules import
console.log('Loading function');

export const handler = async (event, context, callback) => {
    var data = Buffer.from(event.PayloadData, 'base64');
    var chars = [...data];

    var params = Decoder(chars, event.WirelessMetadata.LoRaWAN.FPort);
    const client = new IoTDataPlaneClient('xxxxxxxxxxxxxxx.iot.us-east-1.amazonaws.com');
    
    const message = {
        topic: event.WirelessMetadata.LoRaWAN.DevEui.concat("/project/sensor/decoded"),
        payload: JSON.stringify(params),
        qos: 0
    };

    const command = new PublishCommand(message);
    const response = await client.send(command);
     
    
    callback(null, {
        statusCode: 200,
        body: JSON.stringify(params)
    });
};

// paste your TTN Decoder here
