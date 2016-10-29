//---------------------------------------------------------------
//dojs常用js库的封装
//version: 1.0.0
//---------------------------------------------------------------
var core=require("do/core");
var http=require("do/http");
var global=require("do/global");
var page=require("do/page");
var style=require("do/style");
var modules=require("do/modules");

//---------------------------------------------------------------
/**
 * 返回do/core.js的引用实例
 */
module.exports.core = core;

//---------------------------------------------------------------
/**
 * 返回do/http.js的引用实例
 */
module.exports.http = http;

//---------------------------------------------------------------
/**
 * 返回do/global.js的引用实例
 */
module.exports.global = global;

//---------------------------------------------------------------
/**
 * 返回do/page.js的引用实例
 */
module.exports.page = page;

//---------------------------------------------------------------
/**
 * 返回do/style.js的引用实例
 */
module.exports.style = style;

//---------------------------------------------------------------
/**
 * 返回modules.js的引用实例
 */
module.exports.modules = modules;
