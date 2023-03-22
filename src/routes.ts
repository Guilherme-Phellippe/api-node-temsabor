import { Router } from "express";
const route = Router();

import recipes from "./routes/recipes/index.js"
route.use(recipes);

import comment from "./routes/comments/index.js"
route.use(comment);

import categories from "./routes/categories/index.js"
route.use(categories);

import users from "./routes/users/index.js"
route.use(users);

import prizes from "./routes/prizes/index.js"
route.use(prizes);

export default route;