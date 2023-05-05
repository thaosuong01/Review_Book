const { Router } = require("express");
const postController = require("../controllers/post.controller");

const router = Router();

router.get("/", postController.getAll);
router.get("/:id", postController.getById);
router.get("/user/:userId", postController.getPostByUserId);
router.get("/slug/:slug", postController.getBySlug);
router.post("/", postController.create);
router.patch("/:id", postController.update);
router.delete("/:id", postController.delete);
router.delete("/force/:id", postController.deleteForce);

module.exports.postRoute = router;
