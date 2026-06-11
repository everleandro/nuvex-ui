import type { Plugin } from "vue";
import { version } from "../package.json";
import { install } from "./install";

type LibraryPlugin = Plugin & {
  version: string;
};

const NuvexUI: LibraryPlugin = {
  install,
  version,
};

export default NuvexUI;
