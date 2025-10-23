const { Banner, Product } = require("../models");
const { uploadSingleBuffer } = require("../config/cloudinary");
const createError = require("http-errors");

// ✅ Create Banner
const createBanner = async (req, res) => {
  try {
    const { title, subtitle, link, isActive, position, productId } = req.body;
    const file = req.file;

    if (!title) throw createError(400, "Title is required");
    if (!file || !file.buffer) throw createError(400, "Image file is required");
    if (file.size > 2 * 1024 * 1024)
      throw createError(400, "File too large. Max 2MB");

    // Cloudinary upload
    const response = await uploadSingleBuffer(file.buffer, "site/banners");

    const bannerData = {
      title: title.trim(),
      subtitle: subtitle?.trim() || null,
      link: link?.trim() || null,
      image: response.secure_url,
      isActive:
        isActive !== undefined
          ? isActive === "true" || isActive === true
          : true,
      position: position ? Number(position) : 0,
      productId: productId ? Number(productId) : null,
    };

    const newBanner = await Banner.create(bannerData);
    res.status(201).json(newBanner);
  } catch (err) {
    console.error("Create Banner Error:", err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Failed to create banner",
    });
  }
};

// ✅ Get all Banners
const getBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll({
      order: [["position", "ASC"]],
      include: {
        model: Product,
        as: "product",
        attributes: ["id", "name", "image", "price"],
      },
    });
    res.json(banners);
  } catch (err) {
    console.error("Get Banners Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Update Banner
const updateBanner = async (req, res) => {
  try {
    const { title, subtitle, link, isActive, position, productId } = req.body;
    const file = req.file;

    const banner = await Banner.findByPk(req.params.id);
    if (!banner) throw createError(404, "Banner not found");

    const updateData = {
      title: title?.trim(),
      subtitle: subtitle?.trim() || null,
      link: link?.trim() || null,
      isActive: isActive === "true" || isActive === true,
      position: position ? Number(position) : 0,
      productId: productId ? Number(productId) : null,
    };

    if (file && file.buffer) {
      if (file.size > 2 * 1024 * 1024)
        throw createError(400, "File too large. Max 2MB");

      const response = await uploadSingleBuffer(file.buffer, "site/banners");
      updateData.image = response.secure_url;
    }

    await banner.update(updateData);

    // Reload with association
    const updatedBanner = await Banner.findByPk(banner.id, {
      include: {
        model: Product,
        as: "product",
        attributes: ["id", "name", "image", "price"],
      },
    });

    res.json(updatedBanner);
  } catch (err) {
    console.error("Update Banner Error:", err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Failed to update banner",
    });
  }
};

// ✅ Delete Banner
const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);
    if (!banner) throw createError(404, "Banner not found");

    await banner.destroy();
    res.json({ success: true, message: "Banner deleted successfully" });
  } catch (err) {
    console.error("Delete Banner Error:", err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Failed to delete banner",
    });
  }
};

module.exports = { createBanner, getBanners, updateBanner, deleteBanner };
