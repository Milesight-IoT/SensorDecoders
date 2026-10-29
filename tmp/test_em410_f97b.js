// Round-trip test for EM410-RDL 0xF9 0x7B secondary echo disable command
var fs = require("fs");
var path = require("path");

var encoderSrc = fs.readFileSync(path.join(__dirname, "..", "em-series", "em410-rdl", "em410-rdl-encoder.js"), "utf8");
var decoderSrc = fs.readFileSync(path.join(__dirname, "..", "em-series", "em410-rdl", "em410-rdl-decoder.js"), "utf8");

var encoder = new Function(encoderSrc + "; return { encodeDownlink: encodeDownlink, milesightDeviceEncode: milesightDeviceEncode };")();
var decoder = new Function(decoderSrc + "; return { decodeUplink: decodeUplink, milesightDeviceDecode: milesightDeviceDecode };")();

function assertEq(actual, expected, msg) {
    var a = JSON.stringify(actual);
    var b = JSON.stringify(expected);
    if (a !== b) {
        console.error("FAIL:", msg, "expected", b, "got", a);
        process.exitCode = 1;
    } else {
        console.log("PASS:", msg, "->", a);
    }
}

// spec example: F9 7B 01 -> 禁用二次回波算法 (disable)
assertEq(encoder.milesightDeviceEncode({ secondary_echo_disable: "disable" }), [0xf9, 0x7b, 0x01], "encode disable");
assertEq(encoder.milesightDeviceEncode({ secondary_echo_disable: "enable" }), [0xf9, 0x7b, 0x00], "encode enable");
assertEq(decoder.milesightDeviceDecode([0xf9, 0x7b, 0x01]), { secondary_echo_disable: "disable" }, "decode F9 7B 01");
assertEq(decoder.milesightDeviceDecode([0xf9, 0x7b, 0x00]), { secondary_echo_disable: "enable" }, "decode F9 7B 00");

// combined with another command in one downlink
assertEq(
    encoder.milesightDeviceEncode({ secondary_echo_disable: "disable", peak_sorting: "closest" }),
    [0xf9, 0x16, 0x00, 0xf9, 0x7b, 0x01],
    "encode combined"
);

// uplink response appended after telemetry frame
assertEq(
    decoder.milesightDeviceDecode([0x01, 0x75, 0x64, 0xf9, 0x7b, 0x00]),
    { battery: 100, secondary_echo_disable: "enable" },
    "decode telemetry + response"
);

// existing-command sanity check with same string convention
assertEq(encoder.milesightDeviceEncode({ blind_detection_enable: "enable" }), [0xf9, 0x13, 0x01], "sanity blind_detection_enable");

// invalid value throws
try {
    encoder.milesightDeviceEncode({ secondary_echo_disable: 2 });
    console.error("FAIL: invalid value should throw");
    process.exitCode = 1;
} catch (e) {
    console.log("PASS: invalid value throws:", e.message);
}
