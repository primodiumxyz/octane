"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha256 = void 0;
const crypto_1 = require("crypto");
// Hash some data with SHA-256
function sha256(data) {
    return (0, crypto_1.createHash)('sha256').update(data).digest();
}
exports.sha256 = sha256;
