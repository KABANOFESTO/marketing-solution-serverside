import express from "express";
import { sendMessage, getAllMessages, deleteMessage } from "../Controller/messageController.js";
import passport from "passport";
import '../middleware/passport.js';

const router = express.Router();

router.get("/", passport.authenticate("jwt", { session: false }), getAllMessages);
router.post("/sendMessage", sendMessage);
router.delete("/:id/delete", passport.authenticate("jwt", { session: false }), deleteMessage);

export default router;