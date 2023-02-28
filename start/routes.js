'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
// Route.on('/').render('index')
Route.get("/", "SirupController.index");
Route.get("/testing", "SirupController.testing");
Route.get("/preview/:value?", "SirupController.getData", async ({ response }) => {
    response.implicitEnd = false});
Route.get("/addQuery/:query", "SirupController.savedQuery", async ({ response }) => {
    response.implicitEnd = false});
Route.get("/delQuery/:id?", "SirupController.deleteQuery");
Route.get("/previewData/:id", "SirupController.getDataFromList");
