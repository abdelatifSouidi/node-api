"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
var body_parser_1 = __importDefault(require("body-parser"));
var express_1 = __importDefault(require("express"));
//import {OpenApiValidator} from 'express-openapi-validator'
var OpenApiValidator = require('express-openapi-validator');
var morgan_1 = __importDefault(require("morgan"));
var morgan_body_1 = __importDefault(require("morgan-body"));
var swagger_routes_express_1 = require("swagger-routes-express");
var yamljs_1 = __importDefault(require("yamljs"));
var api = __importStar(require("@api/controllers"));
var _config_1 = __importDefault(require("@config"));
var express_dev_logger_1 = require("@utils/express_dev_logger");
function createServer() {
    return __awaiter(this, void 0, void 0, function () {
        var yamlSpecFile, apiDefinition, apiSummary, server, validatorOptions, connect;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    yamlSpecFile = './config/openapi.yml';
                    apiDefinition = yamljs_1.default.load(yamlSpecFile);
                    apiSummary = swagger_routes_express_1.summarise(apiDefinition);
                    console.info(apiSummary);
                    server = express_1.default();
                    // here we can intialize body/cookies parsers, connect logger, for example morgan
                    server.use(body_parser_1.default.json());
                    if (_config_1.default.morganLogger) {
                        server.use(morgan_1.default(':method :url :status :response-time ms - :res[content-length]'));
                    }
                    if (_config_1.default.morganBodyLogger) {
                        morgan_body_1.default(server);
                    }
                    if (_config_1.default.exmplDevLogger) {
                        server.use(express_dev_logger_1.expressDevLogger);
                    }
                    validatorOptions = {
                        apiSpec: yamlSpecFile,
                        validateRequests: true,
                        validateResponses: true
                    };
                    return [4 /*yield*/, new OpenApiValidator.middleware(validatorOptions)
                        // error customization, if request is invalid
                    ]; //.install(server)
                case 1:
                    _a.sent(); //.install(server)
                    // error customization, if request is invalid
                    server.use(function (err, req, res, next) {
                        res.status(err.status).json({
                            error: {
                                type: 'request_validation',
                                message: err.message,
                                errors: err.errors
                            }
                        });
                    });
                    connect = swagger_routes_express_1.connector(api, apiDefinition, {
                        onCreateRoute: function (method, descriptor) {
                            descriptor.shift();
                            console.log(method + ": " + descriptor.map(function (d) { return d.name; }).join(', '));
                        },
                        security: {
                            bearerAuth: api.auth
                        }
                    });
                    connect(server);
                    return [2 /*return*/, server];
            }
        });
    });
}
exports.createServer = createServer;
