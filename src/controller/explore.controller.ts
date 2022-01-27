import { Request, Response } from "express";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import ExploreService from "../service/explore.service";
import logger from "../utils/logger";
import BaseController from "./base.controller";

export default class ExploreController extends BaseController {
  service: ExploreService;
  constructor(service: ExploreService) {
    super(service);
    this.service = service;
  }

}