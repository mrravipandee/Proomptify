"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategory = exports.getCategories = exports.createCategory = void 0;
const Category_1 = __importDefault(require("../models/Category"));
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || name.trim() === "") {
            res.status(400).json({
                success: false,
                message: "Category name is required",
            });
            return;
        }
        const existingCategory = await Category_1.default.findOne({
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
        const category = await Category_1.default.create({
            name: name.trim(),
            slug,
            description: description?.trim() || "",
        });
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error creating category",
        });
    }
};
exports.createCategory = createCategory;
const getCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const categories = await Category_1.default.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await Category_1.default.countDocuments();
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching categories",
        });
    }
};
exports.getCategories = getCategories;
const getCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category_1.default.findById(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching category",
        });
    }
};
exports.getCategory = getCategory;
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const category = await Category_1.default.findById(id);
        if (!category) {
            res.status(404).json({
                success: false,
                message: "Category not found",
            });
            return;
        }
        if (name && name !== category.name) {
            const existingCategory = await Category_1.default.findOne({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error updating category",
        });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category_1.default.findByIdAndDelete(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error deleting category",
        });
    }
};
exports.deleteCategory = deleteCategory;
