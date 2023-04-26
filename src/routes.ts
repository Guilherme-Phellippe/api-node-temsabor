import { Router } from "express";
const route = Router();

import recipes from "./routes/recipes/index.js"
route.use(recipes);

import feeds from "./routes/feeds/index.js"
route.use(feeds);

import comment from "./routes/comments/index.js"
route.use(comment);

import categories from "./routes/categories/index.js"
route.use(categories);

import users from "./routes/users/index.js"
route.use(users);

import prizes from "./routes/prizes/index.js"
route.use(prizes);

import notifications from "./routes/notification/index.js"
route.use(notifications)


export default route;