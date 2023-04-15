"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helloWordHandlers_1 = __importDefault(require("./helloWorld/helloWordHandlers"));
const router = express_1.default.Router();
// this is a global route
router.get('/health', function (req, res) {
    res.sendStatus(200);
});
router.use('/helloWorld', helloWordHandlers_1.default); // use routes from hello world component
exports.default = router;
//# sourceMappingURL=router.js.map