import mongoose, { Schema, Document } from "mongoose";

export interface IPrompt extends Document {
  title: string;
  description: string;
  category: string;
  tags: string[];
  imgUrl: string;
  promptText: string;
  steps: string[];
  completeSteps: string[];
  estimatedTime: string;
  usageCount: number;
  referenceUrl?: string;
  createdBy: mongoose.Types.ObjectId;
}

const PromptSchema = new Schema<IPrompt>(
  {
    title: { type: String, required: true },

    description: { type: String, required: true },

    category: {
      type: String,
      required: true,
      index: true
    },

    tags: [{ type: String }],

    imgUrl: { type: String, required: true },

    promptText: { type: String, required: true },

    steps: [{ type: String }],

    completeSteps: [{ type: String }],

    estimatedTime: { type: String },

    usageCount: {
      type: Number,
      default: 0
    },

    referenceUrl: { type: String },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export default mongoose.model<IPrompt>("Prompt", PromptSchema);
