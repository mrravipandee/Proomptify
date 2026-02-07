import { Request, Response } from "express";
import Category from "../models/Category";

/* CREATE CATEGORY (ADMIN) */
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const category = await Category.create({
      name,
      slug,
      description,
    });

    res.status(201).json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* GET ALL (PUBLIC) */
export const getCategories = async (_: Request, res: Response) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json(categories);
};

/* DELETE */
export const deleteCategory = async (req: Request, res: Response) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
};
