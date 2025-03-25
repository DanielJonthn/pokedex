import { browser } from "$app/environment";
import { writable } from "svelte/store";

const defaultTheme = browser
  ? localStorage.getItem("pokedex-theme") || "light"
  : "light";

export const theme = writable<"light" | "dark">(
  defaultTheme as "light" | "dark"
);

theme.subscribe((value) => {
  if (browser) {
    localStorage.setItem("pokedex-theme", value);
    document.documentElement.setAttribute("data-theme", value);
  }
});
