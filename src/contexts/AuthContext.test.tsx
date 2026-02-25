import { GlobalRegistrator } from "@happy-dom/global-registrator";
GlobalRegistrator.register();

import { describe, test, expect, mock, beforeEach, afterEach } from "bun:test";
import React from "react";
import { render, waitFor, act, cleanup } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";

// Define mock functions
const mockGetSession = mock(() => Promise.resolve({ data: { session: null }, error: null }));
const mockOnAuthStateChange = mock(() => ({ data: { subscription: { unsubscribe: mock(() => {}) } } }));
const mockSignInWithOAuth = mock(() => Promise.resolve({ error: null }));

const mockFetchProfile = mock(() => Promise.resolve(null));
const mockSignIn = mock(() => Promise.resolve({ error: null }));
const mockSignUp = mock(() => Promise.resolve({ error: null }));
const mockSignOut = mock(() => Promise.resolve(void 0));

// Mock modules
mock.module("../lib/supabase", () => {
  return {
    supabase: {
      auth: {
        getSession: mockGetSession,
        onAuthStateChange: mockOnAuthStateChange,
        signInWithOAuth: mockSignInWithOAuth,
      }
    }
  };
});

mock.module("../lib/services/auth.service", () => {
  return {
    authService: {
      fetchProfile: mockFetchProfile,
      signIn: mockSignIn,
      signUp: mockSignUp,
      signOut: mockSignOut,
    }
  };
});

const TestComponent = () => {
  const { user, isAuthenticated, isLoading, signIn, signOut } = useAuth();

  if (isLoading) return <div data-testid="loading">Loading...</div>;

  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? "Authenticated" : "Unauthenticated"}</div>
      {user && <div data-testid="user-email">{user.email}</div>}
      <button onClick={() => signIn("test@example.com", "password")}>Sign In</button>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};

describe("AuthProvider", () => {
  beforeEach(() => {
    mockGetSession.mockClear();
    mockOnAuthStateChange.mockClear();
    mockFetchProfile.mockClear();
    mockSignIn.mockClear();
    mockSignOut.mockClear();

    mockGetSession.mockResolvedValue({ data: { session: null }, error: null });
    mockFetchProfile.mockResolvedValue(null);
  });

  afterEach(() => {
    cleanup();
  });

  test("initializes with loading state", async () => {
    mockGetSession.mockImplementation(() => new Promise(() => {}));

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(getByTestId("loading")).toBeTruthy();
  });

  test("initializes as unauthenticated when no session", async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(getByTestId("auth-status").textContent).toBe("Unauthenticated"));
  });

  test("initializes as authenticated when session exists", async () => {
    const mockUser = { id: "123", email: "user@example.com" };
    const mockSession = { user: mockUser };

    mockGetSession.mockResolvedValue({ data: { session: mockSession }, error: null });
    mockFetchProfile.mockResolvedValue({ id: "123", role: "user" });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(getByTestId("auth-status").textContent).toBe("Authenticated"));
    expect(getByTestId("user-email").textContent).toBe("user@example.com");
    expect(mockFetchProfile).toHaveBeenCalledWith(mockUser.id);
  });

  test("handles sign in", async () => {
    mockSignIn.mockResolvedValue({ error: null });

    const { getByTestId, getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(getByTestId("auth-status").textContent).toBe("Unauthenticated"));

    const signInButton = getByText("Sign In");
    await act(async () => {
      signInButton.click();
    });

    expect(mockSignIn).toHaveBeenCalledWith("test@example.com", "password");
  });

  test("handles sign out", async () => {
    const mockUser = { id: "123", email: "user@example.com" };
    const mockSession = { user: mockUser };

    mockGetSession.mockResolvedValue({ data: { session: mockSession }, error: null });
    mockFetchProfile.mockResolvedValue({ id: "123", role: "user" });

    const { getByTestId, getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(getByTestId("auth-status").textContent).toBe("Authenticated"));

    const signOutButton = getByText("Sign Out");
    await act(async () => {
      signOutButton.click();
    });

    expect(mockSignOut).toHaveBeenCalled();
  });
});
