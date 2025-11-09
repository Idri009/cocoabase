import { useState, useCallback } from "react";
import {
  FormState,
  createFormState,
  updateFormField,
  touchFormField,
  resetForm,
  getFormValues,
  validateForm,
  ValidationRule,
} from "@/lib/form-utils";

export const useForm = <T extends Record<string, unknown>>(
  initialValues: T,
  rules?: Partial<{ [K in keyof T]: ValidationRule<T[K]>[] }>
) => {
  const [formState, setFormState] = useState<FormState<T>>(() =>
    createFormState(initialValues, rules)
  );

  const setValue = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setFormState((prev) => updateFormField(prev, key, value));
    },
    []
  );

  const setValues = useCallback((values: Partial<T>) => {
    setFormState((prev) => {
      let newState = prev;
      for (const key in values) {
        if (values[key] !== undefined) {
          newState = updateFormField(newState, key, values[key] as T[typeof key]);
        }
      }
      return newState;
    });
  }, []);

  const touch = useCallback(<K extends keyof T>(key: K) => {
    setFormState((prev) => touchFormField(prev, key));
  }, []);

  const reset = useCallback(() => {
    setFormState((prev) => resetForm(prev, initialValues));
  }, [initialValues]);

  const validate = useCallback(() => {
    setFormState((prev) => validateForm(prev));
    return formState.isValid;
  }, [formState.isValid]);

  const handleSubmit = useCallback(
    (onSubmit: (values: T) => void | Promise<void>) => {
      return async (e?: React.FormEvent) => {
        e?.preventDefault();
        const validatedState = validateForm(formState);
        setFormState(validatedState);

        if (validatedState.isValid) {
          const values = getFormValues(validatedState);
          await onSubmit(values);
        }
      };
    },
    [formState]
  );

  const values = getFormValues(formState);

  return {
    values,
    fields: formState.fields,
    isValid: formState.isValid,
    isDirty: formState.isDirty,
    isTouched: formState.isTouched,
    setValue,
    setValues,
    touch,
    reset,
    validate,
    handleSubmit,
  };
};

