import mongoose, { Document, Schema } from 'mongoose';

export interface ITodo extends Document {
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  category?: 'WORK' | 'PERSONAL' | 'HEALTH' | 'EDUCATION';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TodoSchema = new Schema<ITodo>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ['TODO', 'IN_PROGRESS', 'COMPLETED'],
      default: 'TODO',
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
    },
    category: {
      type: String,
      enum: ['WORK', 'PERSONAL', 'HEALTH', 'EDUCATION'],
    },
    dueDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

TodoSchema.index({ status: 1 });
TodoSchema.index({ priority: 1 });
TodoSchema.index({ category: 1 });
TodoSchema.index({ dueDate: 1 });
TodoSchema.index({ createdAt: -1 });

export const Todo = mongoose.model<ITodo>('Todo', TodoSchema);
