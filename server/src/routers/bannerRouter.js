const express = require("express");
const {
  createBanner,
  getBanners,
  updateBanner,
  deleteBanner,
} = require("../controllers/bannerController");
const { uploadBanner } = require("../middlewares/uploadFile");
const bannerRouter = express.Router();

bannerRouter.post("/", uploadBanner.single("image"), createBanner);
bannerRouter.get("/", getBanners);
bannerRouter.put("/:id", uploadBanner.single("image"), updateBanner);
bannerRouter.delete("/:id", deleteBanner);

module.exports = bannerRouter;
