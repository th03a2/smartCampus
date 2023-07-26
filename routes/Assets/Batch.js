const router = require("express").Router(),
  {
    browse,
    destroy,
    update,
    save,
    enrollment,
  } = require("../../controllers/Assets/Batch"),
  { protect } = require("../../middleware");

router
  .get("/browse", protect, browse)
  .get("/enrollment", enrollment)
  .delete("/destroy", protect, destroy)
  .put("/update", protect, update)
  .post("/save", protect, save);

module.exports = router;