// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

const { test } = Deno;
import { assertEquals } from "https://deno.land/std@v0.42.0/testing/asserts.ts";
import {
  lookup,
  contentType,
  extension,
  charset,
  extensions,
  types,
} from "./mod.ts";

test("testLookup", function (): void {
  assertEquals(lookup("json"), "application/json");
  assertEquals(lookup(".md"), "text/markdown");
  assertEquals(lookup("folder/file.js"), "application/javascript");
  assertEquals(lookup("folder/.htaccess"), undefined);
});

test("testContentType", function (): void {
  assertEquals(contentType("markdown"), "text/markdown; charset=utf-8");
  assertEquals(contentType("file.json"), "application/json; charset=utf-8");
  assertEquals(contentType("text/html"), "text/html; charset=utf-8");
  assertEquals(
    contentType("text/html; charset=iso-8859-1"),
    "text/html; charset=iso-8859-1",
  );
  assertEquals(contentType(".htaccess"), undefined);
  assertEquals(contentType("file.ts"), "video/mp2t");
});

test("testExtension", function (): void {
  assertEquals(extension("application/octet-stream"), "bin");
  assertEquals(extension("application/javascript"), "js");
  assertEquals(extension("text/html"), "html");
});

test("testCharset", function (): void {
  assertEquals(charset("text/markdown"), "UTF-8");
  assertEquals(charset("text/css"), "UTF-8");
});

test("testExtensions", function (): void {
  assertEquals(extensions.get("application/javascript"), ["js", "mjs"]);
  assertEquals(extensions.get("foo"), undefined);
});

test("testTypes", function (): void {
  assertEquals(types.get("js"), "application/javascript");
  assertEquals(types.get("foo"), undefined);
});
