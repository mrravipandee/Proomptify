import { Request, Response } from "express";
import Category from "../models/Category";

/* CREATE CATEGORY (ADMIN) */
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;

    // Validation
    if (!name || name.trim() === "") {
      res.status(400).json({
        success: false,
        message: "Category name is required",
      });
      return;
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (existingCategory) {
      res.status(409).json({
        success: false,
        message: "Category already exists",
      });
      return;
    }

    const slug = name.toLowerCase().trim().replace(/\s+/g, "-");

    const category = await Category.create({
      name: name.trim(),
      slug,
      description: description?.trim() || "",
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error creating category",
    });
  }
};

/* GET ALL CATEGORIES (PUBLIC) */
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const categories = await Category.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Category.countDocuments();

    res.json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching categories",
    });
  }
};

/* GET SINGLE CATEGORY */
export const getCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching category",
    });
  }
};

/* UPDATE CATEGORY (ADMIN) */
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    // Check if new name already exists (if being updated)
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({
        $and: [
          { name: { $regex: `^${name}$`, $options: "i" } },
          { _id: { $ne: category._id } },
        ],
      });

      if (existingCategory) {
        res.status(409).json({
          success: false,
          message: "Category name already exists",
        });
        return;
      }
    }

    // Update fields
    if (name) {
      category.name = name.trim();
      category.slug = name.toLowerCase().trim().replace(/\s+/g, "-");
    }

    if (description !== undefined) {
      category.description = description.trim() || "";
    }

    await category.save();

    res.json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error updating category",
    });
  }
};

/* DELETE CATEGORY (ADMIN) */
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "Category deleted successfully",
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error deleting category",
    });
  }
};
