import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { TApiResponse } from "../../lib/modules";
import type { TMutationProp, TQueryProp, TSingleQueryProp } from "../../lib/types/common";

// --------------------------------------------------
// useGetQuery — for paginated or list queries
// --------------------------------------------------
export function useGetQuery<T>({ key, params, isEnabled, func }: TQueryProp<T>) {
  const offset = params?.offset || 0;
  const limit = params?.limit || 10;
  const queryParams = { ...params, offset, limit };

  const keyArr: any[] = [...key];
  for (const [k, v] of Object.entries(queryParams)) keyArr.push({ [k]: v });

  return useQuery<TApiResponse<T>, Error>({
    queryKey: keyArr,
    queryFn: async () => {
      const response = await func(queryParams);
      return response;
    },
    enabled: isEnabled ?? true,
    retry: false,
  });
}

// --------------------------------------------------
// useGetSingleQuery — for fetching a single resource
// --------------------------------------------------
export function useGetSingleQuery({ key, params, isEnabled, func }: TSingleQueryProp) {
  const queryParams = { ...params };
  const keyArr: any[] = [...key];
  for (const [k, v] of Object.entries(queryParams)) keyArr.push({ [k]: v });

  return useQuery({
    queryKey: keyArr,
    queryFn: async () => {
      const response = await func(queryParams);
      return response;
    },
    enabled: isEnabled ?? true,
    retry: false,
  });
}

// --------------------------------------------------
// useMutationQuery — for POST/PUT/DELETE mutations
// --------------------------------------------------
export function useMutationQuery({ key, func, onSuccess, onError }: TMutationProp) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: func,
    onSuccess: (data: TApiResponse<any>) => {
      if (data.success) {
        onSuccess?.();

        // Invalidate cached queries after successful mutation
        if (Array.isArray(key)) {
          key.forEach((k) => client.invalidateQueries({ queryKey: k }));
        } else {
          client.invalidateQueries({ queryKey: key });
        }
      } else {
        toast.error(data?.message || "Operation failed");
        onError?.();
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "An error occurred");
      onError?.();
    },
  });
}
