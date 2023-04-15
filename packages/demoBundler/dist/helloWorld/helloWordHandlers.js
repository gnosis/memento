"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const helloWorld_1 = require("./helloWorld");
const router = express_1.Router();
// path is /helloWorld/hello
router.get('/hello', (req, res) => {
    const greeting = helloWorld_1.helloWorld();
    res.send({ msg: greeting });
});
exports.default = router;
//# sourceMappingURL=helloWordHandlers.js.map