import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import multer from "multer";
import {
  uploadFile,
  shareFile,
  deleteFile,
  downloadFile,
  getUserFiles,
} from "../controllers/file.controller.js";

const fileRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

fileRouter.get("/", authorize, getUserFiles);
fileRouter.post("/upload", authorize, upload.single("file"), uploadFile);
fileRouter.get("/:id/share", authorize, shareFile);
fileRouter.get("/:id/download", authorize, downloadFile);
fileRouter.delete("/:id/delete", authorize, deleteFile);

export default fileRouter;
