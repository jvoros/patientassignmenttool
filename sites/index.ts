// contains the base configuration for each site
// type check to avoid missing config parts
//
// update here, then run `npm run db:configpush` to push to dbase
//
// need to store in dbase so we can make updates to site without having to relaunch app

import smh from "./smh.js";
import lp from "./lp.js";

export default [smh, lp];
