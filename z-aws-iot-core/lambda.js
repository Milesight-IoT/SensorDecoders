var AWS = require("aws-sdk");
console.log("Loading function");

exports.handler = (event, context, callback) => {
    var data = Buffer.from(event.PayloadData, "base64");
    var chars = [...data];

    var params = Decoder(chars, event.WirelessMetadata.LoRaWAN.FPort);
    var iotdata = new AWS.IotData({
        endpoint: "xxxxxxxxxxxxx-ats.iot.us-east-1.amazonaws.com",
    });

    var response = {
        topic: event.WirelessMetadata.LoRaWAN.DevEui.concat("/project/sensor/decoded"),
        payload: JSON.stringify(params),
        qos: 0,
    };

    iotdata.publish(response, function (err, data) {
        if (err) {
            console.log("ERROR => " + JSON.stringify(err));
        } else {
            console.log("publish data: ", response);
        }
    });

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(params),
    });
};

// PASTE DECODER HERE
