'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Upload, X } from 'lucide-react';
import { Prompt } from '@/types';
import Image from 'next/image';

interface PromptFormData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  promptText: string;
  steps: string[];
  completeSteps: string[];
  estimatedTime: string;
  usageCount?: number;
  referenceUrl: string;
  imageFile?: File | null;
}

interface PromptFormProps {
  onSubmit: (data: PromptFormData) => Promise<void>;
  initialData?: Prompt;
  isLoading?: boolean;
}

/**
 * Senior-level prompt form component with:
 * - Full validation
 * - Image preview
 * - Array field management (tags, steps, completeSteps)
 * - Loading states
 * - Error handling
 */
export function PromptForm({
  onSubmit,
  initialData,
  isLoading = false,
}: PromptFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    tags: initialData?.tags || [],
    promptText: initialData?.promptText || '',
    steps: initialData?.steps || [],
    completeSteps: initialData?.completeSteps || [],
    estimatedTime: initialData?.estimatedTime || '',
    usageCount: initialData?.usageCount ?? 0,
    referenceUrl: initialData?.referenceUrl || '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(initialData?.imgUrl || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');
  const [stepInput, setStepInput] = useState('');
  const [completeStepInput, setCompleteStepInput] = useState('');

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.promptText.trim()) newErrors.promptText = 'Prompt text is required';
    if (!imageFile && !imagePreview) newErrors.image = 'Cover image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle file upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit({ ...formData, imageFile });
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Add tag
  const addTag = () => {
    if (tagInput.trim()) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  // Remove tag
  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  // Add step
  const addStep = () => {
    if (stepInput.trim()) {
      setFormData({
        ...formData,
        steps: [...formData.steps, stepInput.trim()],
      });
      setStepInput('');
    }
  };

  // Remove step
  const removeStep = (index: number) => {
    setFormData({
      ...formData,
      steps: formData.steps.filter((_, i) => i !== index),
    });
  };

  // Add complete step
  const addCompleteStep = () => {
    if (completeStepInput.trim()) {
      setFormData({
        ...formData,
        completeSteps: [...formData.completeSteps, completeStepInput.trim()],
      });
      setCompleteStepInput('');
    }
  };

  // Remove complete step
  const removeCompleteStep = (index: number) => {
    setFormData({
      ...formData,
      completeSteps: formData.completeSteps.filter((_, i) => i !== index),
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Prompt Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          className={`w-full px-4 py-3 rounded-lg bg-white/5 border transition-colors ${
            errors.title
              ? 'border-red-500 focus:border-red-600'
              : 'border-white/10 focus:border-purple-500'
          } text-white placeholder-gray-500 focus:outline-none`}
          placeholder="Enter prompt title"
          disabled={isLoading}
        />
        {errors.title && (
          <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.title}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className={`w-full px-4 py-3 rounded-lg bg-white/5 border transition-colors h-24 ${
            errors.description
              ? 'border-red-500 focus:border-red-600'
              : 'border-white/10 focus:border-purple-500'
          } text-white placeholder-gray-500 focus:outline-none resize-none`}
          placeholder="Enter prompt description"
          disabled={isLoading}
        />
        {errors.description && (
          <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.description}
          </p>
        )}
      </div>

      {/* Category & Estimated Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Category
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className={`w-full px-4 py-3 rounded-lg bg-white/5 border transition-colors ${
              errors.category
                ? 'border-red-500 focus:border-red-600'
                : 'border-white/10 focus:border-purple-500'
            } text-white placeholder-gray-500 focus:outline-none`}
            placeholder="e.g., Instagram, LinkedIn"
            disabled={isLoading}
          />
          {errors.category && (
            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.category}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Estimated Time
          </label>
          <input
            type="text"
            value={formData.estimatedTime}
            onChange={(e) =>
              setFormData({ ...formData, estimatedTime: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 text-white placeholder-gray-500 focus:outline-none transition-colors"
            placeholder="e.g., 5 mins"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Usage Count */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Usage Count (Optional)
        </label>
        <input
          type="number"
          min={0}
          value={formData.usageCount ?? 0}
          onChange={(e) =>
            setFormData({
              ...formData,
              usageCount: Number.isNaN(Number(e.target.value))
                ? 0
                : Number(e.target.value),
            })
          }
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 text-white placeholder-gray-500 focus:outline-none transition-colors"
          placeholder="0"
          disabled={isLoading}
        />
      </div>

      {/* Prompt Text */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Prompt Content
        </label>
        <textarea
          value={formData.promptText}
          onChange={(e) =>
            setFormData({ ...formData, promptText: e.target.value })
          }
          className={`w-full px-4 py-3 rounded-lg bg-white/5 border transition-colors h-32 ${
            errors.promptText
              ? 'border-red-500 focus:border-red-600'
              : 'border-white/10 focus:border-purple-500'
          } text-white placeholder-gray-500 focus:outline-none resize-none`}
          placeholder="Enter the main prompt content"
          disabled={isLoading}
        />
        {errors.promptText && (
          <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.promptText}
          </p>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 text-white placeholder-gray-500 focus:outline-none transition-colors"
            placeholder="Add tag and press Enter"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            Add
          </button>
        </div>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-purple-500/20 border border-purple-500/30 text-purple-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  disabled={isLoading}
                  className="hover:text-purple-200 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Steps */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Steps
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={stepInput}
            onChange={(e) => setStepInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addStep();
              }
            }}
            className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 text-white placeholder-gray-500 focus:outline-none transition-colors"
            placeholder="Add a step"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={addStep}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            Add
          </button>
        </div>
        {formData.steps.length > 0 && (
          <ol className="space-y-2">
            {formData.steps.map((step, index) => (
              <li
                key={index}
                className="flex items-start gap-3 bg-white/5 border border-white/10 p-3 rounded-lg"
              >
                <span className="text-purple-400 font-medium">{index + 1}.</span>
                <span className="text-gray-300 flex-1">{step}</span>
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  disabled={isLoading}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Complete Steps */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Complete Steps (Optional)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={completeStepInput}
            onChange={(e) => setCompleteStepInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCompleteStep();
              }
            }}
            className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 text-white placeholder-gray-500 focus:outline-none transition-colors"
            placeholder="Add a complete step"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={addCompleteStep}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            Add
          </button>
        </div>
        {formData.completeSteps.length > 0 && (
          <ol className="space-y-2">
            {formData.completeSteps.map((step, index) => (
              <li
                key={index}
                className="flex items-start gap-3 bg-white/5 border border-white/10 p-3 rounded-lg"
              >
                <span className="text-green-400 font-medium">{index + 1}.</span>
                <span className="text-gray-300 flex-1">{step}</span>
                <button
                  type="button"
                  onClick={() => removeCompleteStep(index)}
                  disabled={isLoading}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Cover Image
        </label>
        {imagePreview && (
          <div className="relative mb-4 bg-white/5 rounded-lg overflow-hidden border border-white/10">
            <Image
              src={imagePreview}
              alt="Preview"
              className="w-full h-64 object-cover"
            />
            <button
              type="button"
              onClick={() => {
                setImageFile(null);
                setImagePreview('');
              }}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-1 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="image-input"
          disabled={isLoading}
        />
        <label
          htmlFor="image-input"
          className="flex items-center justify-center gap-2 border-2 border-dashed border-white/20 rounded-lg p-6 hover:border-purple-500/50 transition-colors cursor-pointer bg-white/5"
        >
          <Upload size={20} className="text-gray-400" />
          <span className="text-gray-400">
            {imageFile ? imageFile.name : 'Click to upload image'}
          </span>
        </label>
        {errors.image && (
          <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.image}
          </p>
        )}
      </div>

      {/* Reference URL */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Reference URL (Optional)
        </label>
        <input
          type="url"
          value={formData.referenceUrl}
          onChange={(e) =>
            setFormData({ ...formData, referenceUrl: e.target.value })
          }
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 text-white placeholder-gray-500 focus:outline-none transition-colors"
          placeholder="https://example.com"
          disabled={isLoading}
        />
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            Processing...
          </>
        ) : (
          'Create Prompt'
        )}
      </motion.button>
    </motion.form>
  );
}
