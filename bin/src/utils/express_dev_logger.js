"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressDevLogger = void 0;
exports.expressDevLogger = function (req, res, next) {
    var startHrTime = process.hrtime();
    console.log("Request: " + req.method + " " + req.url + " at " + new Date().toUTCString() + ", User-Agent: " + req.get('User-Agent'));
    console.log("Request Body: " + JSON.stringify(req.body));
    var _a = [res.write, res.end], oldWrite = _a[0], oldEnd = _a[1];
    var chunks = [];
    res.write = function (chunk) {
        chunks.push(Buffer.from(chunk));
        oldWrite.apply(res, arguments);
    };
    res.end = function (chunk) {
        if (chunk) {
            chunks.push(Buffer.from(chunk));
        }
        var elapsedHrTime = process.hrtime(startHrTime);
        var elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
        console.log("Response " + res.statusCode + " " + elapsedTimeInMs.toFixed(3) + " ms");
        var body = Buffer.concat(chunks).toString('utf8');
        console.log("Response Body: " + body);
        oldEnd.apply(res, arguments);
    };
    next();
};
