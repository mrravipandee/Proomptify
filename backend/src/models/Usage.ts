import mongoose, { Schema, Document } from "mongoose";

export interface IUsage extends Document {
  userId: mongoose.Types.ObjectId;
  count: number;
}

const UsageSchema: Schema<IUsage> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },
    count: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model<IUsage>("Usage", UsageSchema);
