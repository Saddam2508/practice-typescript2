const { prisma } = require("../config/db");
const { uploadSingleBuffer } = require("../config/cloudinary");
const createError = require("http-errors");

// Create Banner
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
      title,
      image: response.secure_url,
      subtitle: subtitle || null,
      link: link || null,
      isActive: isActive !== undefined ? isActive : true,
      position: position ? Number(position) : 0,
      productId: productId ? Number(productId) : null,
    };

    const newBanner = await prisma.banner.create({
      data: bannerData,
      // include: {
      //   product: { select: { id: true, name: true, image: true, price: true } },
      // },
    });

    res.status(201).json(newBanner);
  } catch (err) {
    console.error("Create Banner Error:", err);
    res
      .status(err.status || 500)
      .json({ message: err.message || "Failed to create banner" });
  }
};

// Get all banners
const getBanners = async (req, res) => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { position: "asc" },
      include: {
        product: { select: { id: true, name: true, image: true, price: true } },
      },
    });
    res.json(banners);
  } catch (err) {
    console.error("Get Banners Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update banner
const updateBanner = async (req, res) => {
  try {
    const { title, subtitle, link, isActive, position, productId } = req.body;
    const file = req.file;

    const updateData = {
      title,
      subtitle: subtitle || null,
      link: link || null,
      isActive: isActive === "true" || isActive === true,
      position: position ? Number(position) : 0,
      productId: productId ? Number(productId) : null,
    };

    // New image upload
    if (file && file.buffer) {
      if (file.size > 2 * 1024 * 1024)
        throw createError(400, "File too large. Max 2MB");
      const response = await uploadSingleBuffer(file.buffer, "site/banner");
      updateData.image = response.secure_url;
    }

    const updatedBanner = await prisma.banner.update({
      where: { id: Number(req.params.id) },
      data: updateData,
      include: {
        product: { select: { id: true, name: true, image: true, price: true } },
      },
    });

    res.json(updatedBanner);
  } catch (err) {
    console.error("Update Banner Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete banner
const deleteBanner = async (req, res) => {
  try {
    await prisma.banner.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Banner deleted" });
  } catch (err) {
    console.error("Delete Banner Error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createBanner,
  getBanners,
  updateBanner,
  deleteBanner,
};
