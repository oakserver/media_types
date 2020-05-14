// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

const { test } = Deno;
import { assertEquals } from "https://deno.land/std@v0.51.0/testing/asserts.ts";
import {
  lookup,
  contentType,
  extension,
  charset,
  extensions,
  types,
} from "./mod.ts";

test({
  name: "lookup",
  fn() {
    assertEquals(lookup("json"), "application/json");
    assertEquals(lookup(".md"), "text/markdown");
    assertEquals(lookup("folder/file.js"), "application/javascript");
    assertEquals(lookup("folder/.htaccess"), undefined);
  },
});

test({
  name: "contentType",
  fn() {
    assertEquals(contentType("markdown"), "text/markdown; charset=utf-8");
    assertEquals(contentType("file.json"), "application/json; charset=utf-8");
    assertEquals(contentType("text/html"), "text/html; charset=utf-8");
    assertEquals(
      contentType("text/html; charset=iso-8859-1"),
      "text/html; charset=iso-8859-1"
    );
    assertEquals(contentType(".htaccess"), undefined);
    assertEquals(contentType("file.ts"), "video/mp2t");
  },
});

test({
  name: "extension",
  fn() {
    assertEquals(extension("application/octet-stream"), "bin");
    assertEquals(extension("application/javascript"), "js");
    assertEquals(extension("text/html"), "html");
  },
});

test({
  name: "charset",
  fn() {
    assertEquals(charset("text/markdown"), "UTF-8");
    assertEquals(charset("text/css"), "UTF-8");
  },
});

test({
  name: "extensions",
  fn() {
    assertEquals(extensions.get("application/javascript"), ["js", "mjs"]);
    assertEquals(extensions.get("foo"), undefined);
  },
});

test({
  name: "types",
  fn() {
    assertEquals(types.get("js"), "application/javascript");
    assertEquals(types.get("foo"), undefined);
  },
});
