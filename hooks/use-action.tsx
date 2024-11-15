import { useState } from "react";
import { z, ZodSchema } from "zod";

// shape of the result returned by the action
type ActionResult<T = unknown> = {
  error?: string;
  success?: boolean;
  data?: T; // Include data field to hold returned data
};

// shape of the object returned by useAction
type UseActionResult<T> = {
  execute: (data: T) => Promise<void>;
  loading: boolean;
  error: string | null;
};

// optional callbacks for success and error
type UseActionOptions<R = unknown> = {
  onSuccess?: (data: R) => void; // Pass data on success
  onError?: (error: string) => void;
};

export function useAction<T, R>(
  action: (data: T) => Promise<ActionResult<R>>,
  schema: ZodSchema<T>,
  options?: UseActionOptions<R>
): UseActionResult<T> {
  // state for loading and error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (data: T) => {
    // Set loading to true and clear any previous errors
    setLoading(true);
    setError(null);

    // Validate the input data against the schema
    const validation = schema.safeParse(data);
    if (!validation.success) {
      // If validation fails, set error and call onError callback
      const errorMessage =
        validation.error.errors[0].message || "Validation failed";
      setError(errorMessage);
      options?.onError?.(errorMessage);
      setLoading(false);
      return;
    }

    try {
      // Execute the action with the validated data
      const result = await action(validation.data);
      if (result.error) {
        // If the action returns an error, set it and call onError callback
        setError(result.error);
        options?.onError?.(result.error);
      } else {
        // If the action is successful, call onSuccess callback with the result data
        options?.onSuccess?.(result.data!); // Use non-null assertion as data is expected to be present on success
      }
    } catch (err) {
      // If an unexpected error occurs, log it and set a generic error message
      console.error(err);
      const errorMessage =
        "An error occurred while executing the action. Please try again.";
      setError(errorMessage);
      options?.onError?.(errorMessage);
    } finally {
      // Always set loading to false when the action is complete
      setLoading(false);
    }
  };

  return { execute, loading, error }; // No resultData here
}
