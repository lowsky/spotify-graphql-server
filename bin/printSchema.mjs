#!/usr/bin/env node

import { printSchema } from "graphql";

import { schema } from "../data/schema.mjs";

console.log(printSchema(schema));
