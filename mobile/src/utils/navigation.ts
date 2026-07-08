import type { Href } from "expo-router";

function getRouter() {
  return require("expo-router").router;
}

export function push(href: Href) {
  getRouter().push(href);
}

export function replace(href: Href) {
  getRouter().replace(href);
}

export function goBack(fallback?: Href) {
  const router = getRouter();

  if (router.canGoBack()) {
    router.back();
    return;
  }

  if (fallback) {
    router.replace(fallback);
  }
}
