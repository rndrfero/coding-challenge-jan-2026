import { connectionHandlers } from "./handlers/connection";
import { autocompleteHandlers } from "./handlers/autocomplete";

export const handlers = [...connectionHandlers, ...autocompleteHandlers];
