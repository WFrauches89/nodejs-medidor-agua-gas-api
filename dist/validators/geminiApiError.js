"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiApiError = void 0;
class GeminiApiError extends Error {
    constructor(message) {
        super(message);
        this.name = 'GeminiApiError';
    }
}
exports.GeminiApiError = GeminiApiError;
