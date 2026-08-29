"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const createApiKeySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  rateLimit: z.coerce.number().int().positive().max(600).optional().or(z.undefined()),
  expiresAt: z.string().optional(),
});

type CreateApiKeyFormData = z.infer<typeof createApiKeySchema>;

export function CreateApiKeyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<{
    key: string;
    keyPrefix: string;
    lastFourChars: string;
  } | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createApiKeySchema) as any,
    defaultValues: {
      name: "",
      rateLimit: "",
      expiresAt: "",
    },
  });

  const onSubmit = async (formData: any) => {
    const data = formData as Record<string, unknown>;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Failed to create API key");
        return;
      }

      const result = await response.json();
      setGeneratedKey({
        key: result.key,
        keyPrefix: result.keyPrefix,
        lastFourChars: result.lastFourChars,
      });
      toast.success("API key created successfully");
      reset();
      router.refresh();
    } catch (error) {
      toast.error("An error occurred while creating the API key");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (generatedKey) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm font-medium text-green-900">API Key Created</p>
          <p className="text-xs text-green-700 mt-1">
            Save this key in a secure location. You won&apos;t be able to see it again.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">Full API Key</label>
            <div className="relative">
              <input
                type="password"
                value={generatedKey.key}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generatedKey.key);
                  toast.success("Copied to clipboard");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-900"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Key Prefix</label>
            <input
              type="text"
              value={generatedKey.keyPrefix}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Last Four Characters</label>
            <input
              type="text"
              value={generatedKey.lastFourChars}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
            />
          </div>
        </div>

        <button
          onClick={() => setGeneratedKey(null)}
          className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200"
        >
          Create Another Key
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Key Name
        </label>
        <input
          id="name"
          placeholder="e.g., Production API Key"
          {...register("name")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && (
          <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="rateLimit" className="block text-sm font-medium mb-2">
          Rate Limit (requests/minute)
        </label>
        <input
          id="rateLimit"
          type="number"
          placeholder="60"
          {...register("rateLimit")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.rateLimit && (
          <p className="text-sm text-red-600 mt-1">{errors.rateLimit.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">Leave empty for default (60 requests/minute)</p>
      </div>

      <div>
        <label htmlFor="expiresAt" className="block text-sm font-medium mb-2">
          Expiration Date (optional)
        </label>
        <input
          id="expiresAt"
          type="date"
          {...register("expiresAt")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.expiresAt && (
          <p className="text-sm text-red-600 mt-1">{errors.expiresAt.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Creating..." : "Create API Key"}
      </button>
    </form>
  );
}
