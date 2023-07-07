import { Router } from "express";
const route = Router();

import recipes from "./routes/recipes/index.js"
route.use(recipes);

import tips from "./routes/tips/index.js"
route.use(tips);

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

import notifications from "./routes/notification-app/index.js"
route.use(notifications)

import linkShortener from "./routes/link-shortener/index.js"
route.use(linkShortener)

// import metaPixel from "./routes/meta-pixel/index.js"
// route.use(metaPixel)

import notificationPush from "./routes/notification-push/index.js"
route.use(notificationPush);


export default route;