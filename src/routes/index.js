import { Router } from "express";
import routes from '../controllers/index.controller.js'

const router = Router();

router.get("/", routes.getUsers);
router.post("/", routes.createUsers);
router.put("/:id", routes.updateUser);
router.delete("/:id", routes.deleteUser);

export default router;
