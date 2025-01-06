import { server } from "./mocks/server.ts";
import { delay, http, HttpResponse } from "msw";
import { useAuth0, User } from "@auth0/auth0-react";

export const delayedCall = (route: string) => {
  server.use(
    http.get(route, async () => {
      await delay();
      return HttpResponse.json([]);
    }),
  );
};

export const errorCall = (route: string) => {
  server.use(http.get(route, HttpResponse.error));
};

export const errorCallNotStandard = (route: string) => {
  server.use(
    http.get(route, () => {
      return HttpResponse.json({ message: "network error" }, { status: 500 });
    }),
  );
};

type AuthState = {
  isLoading: boolean;
  user: User | undefined;
  isAuthenticated: boolean;
};

export const mockUseAuth0 = (authState: AuthState) => {
  vi.mocked(useAuth0).mockReturnValue({
    ...authState,
    getAccessTokenSilently: vi.fn(),
    getAccessTokenWithPopup: vi.fn(),
    getIdTokenClaims: vi.fn(),
    loginWithRedirect: vi.fn(),
    loginWithPopup: vi.fn(),
    logout: vi.fn(),
    handleRedirectCallback: vi.fn(),
  });
};
