import { server } from "./mocks/server.ts";
import { delay, http, HttpResponse } from "msw";

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
