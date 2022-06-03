/*!
 * Ported from: https://github.com/jshttp/mime-types and licensed as:
 *
 * (The MIT License)
 *
 * Copyright (c) 2014 Jonathan Ong <me@jongleberry.com>
 * Copyright (c) 2015 Douglas Christopher Wilson <doug@somethingdoug.com>
 * Copyright (c) 2020 the Deno authors
 * Copyright (c) 2020-2022 the oak authors
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { extname } from "https://deno.land/std@0.140.0/path/mod.ts";
import db from "https://raw.githubusercontent.com/jshttp/mime-db/v1.52.0/db.json" assert {
  type: "json",
};

interface DBEntry {
  source: string;
  compressible?: boolean;
  charset?: string;
  extensions?: string[];
}

type KeyOfDb = keyof typeof db;

const EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
const TEXT_TYPE_REGEXP = /^text\//i;

/** A map of extensions for a given media type.
 *
 * @deprecated use Deno std/media_types instead
 */
export const extensions = new Map<string, string[]>();

/** A map of the media type for a given extension
 *
 * @deprecated use Deno std/media_types instead
 */
export const types = new Map<string, KeyOfDb>();

/** Internal function to populate the maps based on the Mime DB. */
function populateMaps(
  extensions: Map<string, string[]>,
  types: Map<string, KeyOfDb>,
): void {
  const preference = ["nginx", "apache", undefined, "iana"];

  for (const type of Object.keys(db)) {
    const mime = db[type as KeyOfDb] as DBEntry;
    const exts = mime.extensions;

    if (!exts || !exts.length) {
      continue;
    }

    extensions.set(type, exts);

    for (const ext of exts) {
      const current = types.get(ext);
      if (current) {
        const from = preference.indexOf((db[current] as DBEntry).source);
        const to = preference.indexOf(mime.source);

        if (
          current !== "application/octet-stream" &&
          (from > to ||
            // @ts-ignore work around denoland/dnt#148
            (from === to && current.startsWith("application/")))
        ) {
          continue;
        }
      }

      types.set(ext, type as KeyOfDb);
    }
  }
}

// Populate the maps upon module load
populateMaps(extensions, types);

/** Given a media type return any default charset string.  Returns `undefined`
 * if not resolvable.
 *
 * @deprecated use Deno std/media_types instead
 */
export function charset(type: string): string | undefined {
  const m = EXTRACT_TYPE_REGEXP.exec(type);
  if (!m) {
    return undefined;
  }
  const [match] = m;
  const mime = db[match.toLowerCase() as KeyOfDb] as DBEntry;

  if (mime && mime.charset) {
    return mime.charset;
  }

  if (TEXT_TYPE_REGEXP.test(match)) {
    return "UTF-8";
  }

  return undefined;
}

/** Given an extension, lookup the appropriate media type for that extension.
 * Likely you should be using `contentType()` though instead.
 *
 * @deprecated use Deno std/media_types instead
 */
export function lookup(path: string): string | undefined {
  const extension = extname(`x.${path}`)
    .toLowerCase()
    .substring(1);

  // @ts-ignore workaround around denoland/dnt#148
  return types.get(extension);
}

/** Given an extension or media type, return the full `Content-Type` header
 * string.  Returns `undefined` if not resolvable.
 *
 * @deprecated use Deno std/media_types instead
 */
export function contentType(str: string): string | undefined {
  let mime = str.includes("/") ? str : lookup(str);

  if (!mime) {
    return undefined;
  }

  if (!mime.includes("charset")) {
    const cs = charset(mime);
    if (cs) {
      mime += `; charset=${cs.toLowerCase()}`;
    }
  }

  return mime;
}

/** Given a media type, return the most appropriate extension or return
 * `undefined` if there is none.
 *
 * @deprecated use Deno std/media_types instead
 */
export function extension(type: string): string | undefined {
  const match = EXTRACT_TYPE_REGEXP.exec(type);

  if (!match) {
    return undefined;
  }

  const exts = extensions.get(match[1].toLowerCase());

  if (!exts || !exts.length) {
    return undefined;
  }

  return exts[0];
}
