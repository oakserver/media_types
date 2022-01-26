// Copyright 2020-2022 the oak authors. All rights reserved. MIT license.

import { assertEquals } from "https://deno.land/std@0.114.0/testing/asserts.ts";
import {
  charset,
  contentType,
  extension,
  extensions,
  lookup,
  types,
} from "./mod.ts";

Deno.test({
  name: "lookup",
  fn() {
    assertEquals(lookup("json"), "application/json");
    assertEquals(lookup(".md"), "text/markdown");
    assertEquals(lookup("folder/file.js"), "application/javascript");
    assertEquals(lookup("folder/.htaccess"), undefined);
  },
});

Deno.test({
  name: "contentType",
  fn() {
    assertEquals(contentType("markdown"), "text/markdown; charset=utf-8");
    assertEquals(contentType("file.json"), "application/json; charset=utf-8");
    assertEquals(contentType("text/html"), "text/html; charset=utf-8");
    assertEquals(
      contentType("text/html; charset=iso-8859-1"),
      "text/html; charset=iso-8859-1",
    );
    assertEquals(contentType(".htaccess"), undefined);
    assertEquals(contentType("file.ts"), "video/mp2t");
  },
});

Deno.test({
  name: "extension",
  fn() {
    assertEquals(extension("application/octet-stream"), "bin");
    assertEquals(extension("application/javascript"), "js");
    assertEquals(extension("text/html"), "html");
  },
});

Deno.test({
  name: "charset",
  fn() {
    assertEquals(charset("text/markdown"), "UTF-8");
    assertEquals(charset("text/css"), "UTF-8");
  },
});

Deno.test({
  name: "extensions",
  fn() {
    assertEquals(extensions.get("application/javascript"), ["js", "mjs"]);
    assertEquals(extensions.get("foo"), undefined);
  },
});

Deno.test({
  name: "types",
  fn() {
    assertEquals(types.get("js"), "application/javascript");
    assertEquals(types.get("foo"), undefined);
  },
});
