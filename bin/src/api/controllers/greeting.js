"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goodbye = exports.hello = void 0;
var express_1 = require("@utils/express");
function hello(req, res) {
    var name = req.query.name || 'stranger';
    express_1.writeJsonResponse(res, 200, { "message": "Hello, " + name + "!" });
}
exports.hello = hello;
function goodbye(req, res) {
    var userId = res.locals.auth.userId;
    express_1.writeJsonResponse(res, 200, { "message": "Goodbye, " + userId + "!" });
}
exports.goodbye = goodbye;
