import { Router } from "express";

import { HTTP_STATUS } from "../constants/httpStatus.js";
import { sendSuccess } from "../utils/apiResponse.js";

const router = Router();

router.get("/", (req, res) => {
  return sendSuccess(res, HTTP_STATUS.OK, "RoomCompanion Backend Running", {
    service: "room-companion-backend",
  });
});

export default router;

