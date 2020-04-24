"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_1 = require("../middleware/jwt");
const designer_service_1 = require("../service/designer.service");
const designerRouter = express_1.Router();
const ds = new designer_service_1.default();
designerRouter.get("/", jwt_1.default, ds.get);
designerRouter.get("/:id", jwt_1.default, ds.getId);
designerRouter.post("/", jwt_1.default, ds.post);
designerRouter.put("/:id", jwt_1.default, ds.put);
designerRouter.post("/event", jwt_1.default, ds.addDesignerEvent);
designerRouter.post("/event/delete", jwt_1.default, ds.deleteDesignerEvent);
designerRouter.put("/:id/photo", jwt_1.default, ds.putPhoto);
designerRouter.get("/:id/photo", jwt_1.default, ds.getPhoto);
// designerRouter.get("/event/get", verifyToken, DesignerService.getDesignerEvent)
exports.default = designerRouter;
