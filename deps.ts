// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

export { extname } from "https://deno.land/std@v0.38.0/path/mod.ts";

interface DB {
  [mediaType: string]: {
    source?: string;
    compressible?: boolean;
    charset?: string;
    extensions?: string[];
  };
}

import _db from "https://raw.githubusercontent.com/jshttp/mime-db/master/db.json";
export const db: DB = _db;
