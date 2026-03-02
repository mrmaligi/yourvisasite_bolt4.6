import { describe, test, expect, mock, beforeEach } from "bun:test";
import { renderHook, waitFor } from "@testing-library/react";
import { useDocuments } from "./useDocuments";

// --- Mocks ---

// Mock useAuth
const mockUser = { id: "test-user-id", email: "test@example.com" };
const mockUseAuth = mock(() => ({
  user: mockUser,
}));

mock.module("./useAuth", () => ({
  useAuth: mockUseAuth,
}));

// Mock Supabase
const mockSelect = mock(() => ({
  eq: mock(() => ({
    order: mock(() => Promise.resolve({ data: [], error: null })),
    single: mock(() => Promise.resolve({ data: { id: "cat-123" }, error: null })),
  })),
}));

const mockInsert = mock(() => ({
  select: mock(() => ({
    single: mock(() => Promise.resolve({ data: { id: "doc-123", file_name: "test.pdf" }, error: null })),
  })),
}));

const mockDelete = mock(() => ({
  eq: mock(() => ({
    eq: mock(() => Promise.resolve({ error: null })),
  })),
}));

const mockStorageUpload = mock(() => Promise.resolve({ data: { path: "path/to/file" }, error: null }));
const mockStorageRemove = mock(() => Promise.resolve({ data: {}, error: null }));
const mockCreateSignedUrl = mock(() => Promise.resolve({ data: { signedUrl: "https://example.com/file.pdf" }, error: null }));

const mockFrom = mock((table: string) => {
  if (table === "document_categories") {
    return {
      select: mock(() => ({
        eq: mock(() => ({
            order: mock(() => Promise.resolve({
                data: [{ id: "cat-1", key: "passport", name: "Passport" }],
                error: null
            }))
        }))
      })),
    };
  }
  if (table === "user_documents") {
    return {
      select: mockSelect,
      insert: mockInsert,
      delete: mockDelete,
    };
  }
  return {};
});

const mockStorageFrom = mock(() => ({
  upload: mockStorageUpload,
  remove: mockStorageRemove,
  createSignedUrl: mockCreateSignedUrl,
}));

mock.module("../lib/supabase", () => ({
  supabase: {
    from: mockFrom,
    storage: {
      from: mockStorageFrom,
    },
  },
}));

// --- Tests ---

describe("useDocuments Hook", () => {
  beforeEach(() => {
    mockUseAuth.mockClear();
    mockFrom.mockClear();
    mockSelect.mockClear();
    mockInsert.mockClear();
    mockDelete.mockClear();
    mockStorageUpload.mockClear();
    mockStorageRemove.mockClear();

    // Reset mockSelect to return empty array by default
    mockSelect.mockImplementation(() => ({
        eq: mock(() => ({
            order: mock(() => Promise.resolve({ data: [], error: null })),
        }))
    }));
  });

  test("should fetch categories and documents on mount when authenticated", async () => {
    // Setup fetch mocks
    const mockDocs = [{ id: "doc-1", file_name: "old.pdf" }];

    // Override mocks for this test
    // Note: mockFrom is complex, so we override mockSelect which is used inside mockFrom
    mockSelect.mockImplementation(() => ({
        eq: mock(() => ({
            order: mock(() => Promise.resolve({ data: mockDocs, error: null })),
        }))
    }));

    const { result } = renderHook(() => useDocuments());

    // Wait for loading to finish
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.categories).toEqual([{ id: "cat-1", key: "passport", name: "Passport" }]);
    expect(result.current.documents).toEqual(mockDocs);
  });

  test("should handle upload success", async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const file = new File(["content"], "test.pdf", { type: "application/pdf" });

    const response = await result.current.uploadDocument(file, "passport");

    expect(response.error).toBeNull();
    expect(response.data).toBeDefined();

    // Verify storage upload
    expect(mockStorageUpload).toHaveBeenCalled();
    // Verify DB insert
    expect(mockInsert).toHaveBeenCalled();

    // Verify state update (optimistic or from result)
    // The hook updates state with the inserted document
    // Initial fetch returns empty [], so expect 1
    await waitFor(() => {
        expect(result.current.documents).toHaveLength(1);
        expect(result.current.documents[0].file_name).toBe("test.pdf");
    });
  });

  test("should handle upload failure (storage error)", async () => {
    mockStorageUpload.mockImplementationOnce(() => Promise.resolve({ data: null, error: new Error("Storage full") }));

    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const file = new File(["content"], "fail.pdf", { type: "application/pdf" });
    const response = await result.current.uploadDocument(file, "passport");

    expect(response.error).toBeDefined();
    expect(response.error?.message).toBe("Storage full");

    // DB insert should NOT be called
    expect(mockInsert).not.toHaveBeenCalled();
  });

  test("should handle upload failure (DB error) and rollback storage", async () => {
    mockInsert.mockImplementationOnce(() => ({
        select: mock(() => ({
            single: mock(() => Promise.resolve({ data: null, error: new Error("DB error") }))
        }))
    }));

    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const file = new File(["content"], "rollback.pdf", { type: "application/pdf" });
    const response = await result.current.uploadDocument(file, "passport");

    expect(response.error).toBeDefined();
    expect(response.error?.message).toBe("DB error");

    // Storage upload WAS called
    expect(mockStorageUpload).toHaveBeenCalled();
    // Storage remove WAS called (rollback)
    expect(mockStorageRemove).toHaveBeenCalled();
  });

  test("should handle delete success", async () => {
    // Setup initial state with one doc
    mockSelect.mockImplementation(() => ({
        eq: mock(() => ({
            order: mock(() => Promise.resolve({ data: [{ id: "doc-to-delete", file_path: "path/doc" }], error: null })),
        }))
    }));

    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Ensure initial state is loaded correctly
    expect(result.current.documents).toHaveLength(1);

    const docToDelete = result.current.documents[0];
    const response = await result.current.deleteDocument(docToDelete);

    expect(response.error).toBeNull();

    // Verify storage delete
    expect(mockStorageRemove).toHaveBeenCalled();
    // Verify DB delete
    expect(mockDelete).toHaveBeenCalled();

    // Verify state update - wrapped in waitFor
    await waitFor(() => {
        expect(result.current.documents).toHaveLength(0);
    });
  });

  test("should handle unauthenticated state", async () => {
    // Mock user as null
    mockUseAuth.mockImplementation(() => ({ user: null }));

    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.documents).toEqual([]);

    const file = new File([""], "test.pdf");
    const response = await result.current.uploadDocument(file, "passport");
    expect(response.error?.message).toBe("Not authenticated");
  });
});
