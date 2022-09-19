// imports - express, model, service, controller and jwt
import { Router } from "express";
import FeedbackModel from "../../models/feedback.model"
import verifyToken from "../../middleware/jwt";
import FeedbackService from "../../service/feedback.service";
import FeedbackController from "../../controller/feedback.controller";
const feedbackRouter = Router();

// service & controller instance
const feedbackService = new FeedbackService(FeedbackModel);
const feedbackController = new FeedbackController(feedbackService);

// routes
feedbackRouter.get('/', verifyToken, feedbackController.getPaginated);
feedbackRouter.get('/all', verifyToken, feedbackController.getAll);
feedbackRouter.get('/rating', verifyToken, feedbackController.byRating);
feedbackRouter.get('/booking/:id', verifyToken, feedbackController.byBookingId);
feedbackRouter.get('/info/:id', verifyToken, feedbackController.infoById);
feedbackRouter.put('/update/:id', verifyToken, feedbackController.updateById);
feedbackRouter.delete('/delete/:id', verifyToken, feedbackController.deleteById);

// export
export default feedbackRouter;
