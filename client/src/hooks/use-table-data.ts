import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, getFromMemoryCache, setMemoryCache } from "@/lib/queryClient";
import { TableRow, TableColumn, InsertTableRow, InsertTableColumn } from "@shared/schema";

export function useTableData() {
  const queryClient = useQueryClient();

  // Fetch table rows with smart caching
  const {
    data: rows = [],
    isLoading: rowsLoading,
  } = useQuery<TableRow[]>({
    queryKey: ["/api/table-rows"],
    staleTime: 3 * 60 * 1000, // 3 minutes (reduced for fresh data)
    gcTime: 15 * 60 * 1000, // 15 minutes
  });

  // Fetch table columns (cached longer as they rarely change)
  const {
    data: columns = [],
    isLoading: columnsLoading,
  } = useQuery<TableColumn[]>({
    queryKey: ["/api/table-columns"],
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    placeholderData: () => getFromMemoryCache<TableColumn[]>('columns') || [],
  });

  // Create row mutation
  const createRow = useMutation({
    mutationFn: async (data: InsertTableRow) => {
      const response = await apiRequest("POST", "/api/table-rows", data);
      return response.json();
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["/api/table-rows"] });
    },
  });

  // Update row mutation
  const updateRow = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<InsertTableRow> }) => {
      const response = await apiRequest("PATCH", `/api/table-rows/${id}`, updates);
      return response.json();
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["/api/table-rows"] });
    },
  });

  // Delete row mutation
  const deleteRow = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/table-rows/${id}`);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["/api/table-rows"] });
    },
  });

  // Reorder rows mutation
  const reorderRows = useMutation({
    mutationFn: async (rowIds: string[]) => {
      const response = await apiRequest("POST", "/api/table-rows/reorder", { rowIds });
      return response.json();
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["/api/table-rows"] });
    },
  });

  // Create column mutation
  const createColumn = useMutation({
    mutationFn: async (data: InsertTableColumn) => {
      const response = await apiRequest("POST", "/api/table-columns", data);
      return response.json();
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["/api/table-columns"] });
    },
  });

  // Delete column mutation
  const deleteColumn = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/table-columns/${id}`);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["/api/table-columns"] });
    },
  });

  // Reorder columns mutation
  const reorderColumns = useMutation({
    mutationFn: async (columnIds: string[]) => {
      const response = await apiRequest("POST", "/api/table-columns/reorder", { columnIds });
      return response.json();
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["/api/table-columns"] });
    },
  });

  // Add image to row mutation
  const addImageToRow = useMutation({
    mutationFn: async ({ rowId, imageUrl, caption }: { rowId: string; imageUrl: string; caption?: string }) => {
      const response = await apiRequest("POST", `/api/table-rows/${rowId}/images`, { imageUrl, caption });
      return response.json();
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["/api/table-rows"] });
    },
  });

  // Update image in row mutation
  const updateImageInRow = useMutation({
    mutationFn: async ({ rowId, imageIndex, imageUrl, caption }: { rowId: string; imageIndex: number; imageUrl?: string; caption?: string }) => {
      const response = await apiRequest("PATCH", `/api/table-rows/${rowId}/images/${imageIndex}`, { imageUrl, caption });
      return response.json();
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["/api/table-rows"] });
    },
  });

  // Delete image(s) from row mutation
  const deleteImageFromRow = useMutation({
    mutationFn: async ({ rowId, imageIndex }: { rowId: string; imageIndex?: number }) => {
      const url = imageIndex !== undefined 
        ? `/api/table-rows/${rowId}/images/${imageIndex}`
        : `/api/table-rows/${rowId}/images`;
      const response = await apiRequest("DELETE", url);
      return response.json();
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["/api/table-rows"] });
    },
  });

  return {
    rows,
    columns,
    isLoading: rowsLoading || columnsLoading,
    createRow,
    updateRow,
    deleteRow,
    reorderRows,
    createColumn,
    deleteColumn,
    reorderColumns,
    addImageToRow,
    updateImageInRow,
    deleteImageFromRow,
  };
}
