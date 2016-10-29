(function (mod) {
    if (typeof exports == "object" && typeof module == "object") {
        return mod(require.main.require("../lib/infer"), require.main.require("../lib/tern"), require);
    }
    if (typeof define == "function" && define.amd)
        return define(["tern/lib/infer", "tern/lib/tern"], mod);
    mod(tern, tern);
})(function (infer, tern, require) {
    "use strict";
    function ResolvePath(base, path) {
        if (path[0] == "/")
            return path;
        var slash = base.lastIndexOf("/"),
            m;
        if (slash >= 0)
            path = base.slice(0, slash + 1) + path;
        while (m = /[^\/]*[^\/\.][^\/]*\/\.\.\//.exec(path))
            path = path.slice(0, m.index) + path.slice(m.index + m[0].length);
        return path.replace(/(^|[^\.])\.\//g, "$1");
    }

    function StringEndWith(that, str) {
        if (!that || !str || str.length > that.length)
            return false;
        return that.substring(that.length - str.length) == str;
    }

    function RelativePath(from, to) {
        if (from[from.length - 1] != "/")
            from += "/";
        if (to.indexOf(from) == 0)
            return to.slice(from.length);
        else
            return to;
    }

    function GetModule(data, name) {
        return data.modules[name] || (data.modules[name] = new infer.AVal);
    }

    function BuildWrappingScope(parent, origin, node) {
        var scope = new infer.Scope(parent);
        scope.originNode = node;
        infer.cx().definitions.deviceone.require.propagate(scope.defProp("require"));
        var module = new infer.Obj(infer.cx().definitions.deviceone.Module.getProp("prototype").getType());
        module.propagate(scope.defProp("module"));
        var exports = new infer.Obj(true, "exports");
        module.origin = exports.origin = origin;
        module.originNode = exports.originNode = scope.originNode;
        exports.propagate(scope.defProp("exports"));
        var moduleExports = scope.exports = module.defProp("exports");
        exports.propagate(moduleExports, 95);
        return scope;
    }

    function ResolveModule(server, name, _parent) {
        server.addFile(name, null, server._node.currentOrigin);
        return GetModule(server._node, name);
    }

    function BuildUIFileIDMap(obj, r) {
        r = r || {};
        if (obj.RootView) {
            r.$ = obj.RootView.type;
            BuildUIFileIDMap(obj.RootView, r);
        }
        if (obj.id) {
            r[obj.id] = obj.type;
        }
        if (obj.views) {
            var i = 0,
                l = obj.views.length;
            for (; i < l; i++) {
                BuildUIFileIDMap(obj.views[i], r);
            }
        }
        return r;
    }

    function GetScriptJSName(dir, fy, rs) {
        return [];
    }

    /** ******************************************************************************************************************** */
    var DEFINES;
    if (require)
        (function () {
            var fs = require("fs"),
                module_ = require("module"),
                path = require("path");
            RelativePath = path.relative;
            ResolveModule = function (server, name, parent) {
                var data = server._node;
                if (data.options.dontLoad == true || data.options.dontLoad && new RegExp(data.options.dontLoad).test(name) || data.options.load && !new RegExp(data.options.load).test(name))
                    return infer.ANull;
                if (data.modules[name])
                    return data.modules[name];
                var file = server.options.projectDir + "/source/script/" + name + ".js";
                var norm = NormPath(file);
                if (data.modules[norm])
                    return data.modules[norm];

                if (fs.existsSync(file) && /^(\.js)?$/.test(path.extname(file)))
                    server.addFile(RelativePath(server.options.projectDir, file), null, data.currentOrigin);
                return data.modules[norm] = new infer.AVal;
            };


            GetScriptJSName = function (dir, fy, rs) {
                rs = rs || [];
                fy = fy || "";
                var list = fs.readdirSync(dir);
                for (var i = 0; i < list.length; i++) {
                    var fx = list[i];
                    var file = dir + '/' + fx;
                    var stat = fs.statSync(file);
                    if (!stat) continue;
                    if (stat.isFile() && file.split(".").pop().toLowerCase() === "js") {
                        rs.push(fy + fx);
                    }
                    if (stat.isDirectory()) {
                        GetScriptJSName(file, fy + fx + "/", rs);
                    }
                }
                return rs;
            };

        })();
    /** ******************************************************************************************************************** */

    function NormPath(name) {
        return name.replace(/\\/g, "/");
    }

    function ResolveProjectPath(server, pth) {
        return ResolvePath(NormPath(server.options.projectDir || "") + "/", NormPath(pth));
    }

    function PreCondenseReach(state) {
        var mods = infer.cx().parent._node.modules;
        var node = state.roots["!node"] = new infer.Obj(null);
        for (var name in mods) {
            var mod = mods[name];
            var id = mod.origin || name;
            var prop = node.defProp(id.replace(/\./g, "`"));
            mod.propagate(prop);
            prop.origin = mod.origin;
        }
    }

    function PostLoadDef(data) {
        var cx = infer.cx(),
            mods = cx.definitions[data["!name"]]["!node"];
        var data = cx.parent._node;
        if (mods)
            for (var name in mods.props) {
                var origin = name.replace(/`/g, ".");
                var mod = GetModule(data, origin);
                mod.origin = origin;
                mods.props[name].propagate(mod);
            }
    }

    function FindTypeAt(file, pos, expr, type) {
        var isStringLiteral = expr.node.type === "Literal" && typeof expr.node.value === "string";
        var isRequireArg = !!expr.node.required;
        if (isStringLiteral && isRequireArg) {
            type = Object.create(type);
            var exportedType = expr.node.required.types[0];
            type.origin = exportedType.origin;
            type.originNode = exportedType.originNode;
        }
        return type;
    }

    function MaybeSet(obj, prop, val) {
        if (val != null)
            obj[prop] = val;
    }

    /** ***************Properties************* */
    function GetObjectProperties(proto) {
        var cx = infer.cx(),
            locals = cx.definitions.deviceone;
        var objectName = proto.name,
            index = objectName.indexOf("UI.");
        if (index == 0)
            objectName = objectName.substring("UI.".length, objectName.length);
        objectName = objectName.substring(0, objectName.indexOf('.'));
        return locals["!pp"].hasProp(objectName);
    }

    function GetPropertyType(widgetType, propertyName) {
        if (!(widgetType))
            return null;
        var proto = widgetType.proto,
            propertyType = null;
        while (proto) {
            var objectType = GetObjectProperties(proto);
            if (objectType && objectType.getType)
                propertyType = objectType.getType().hasProp(propertyName);
            if (propertyType)
                return propertyType;
            proto = proto.proto;
        }
        return null;
    }

    /** ***************Events************* */
    function GetEventProperties(proto) {
        var cx = infer.cx(),
            locals = cx.definitions.deviceone;
        var oname = proto.name;
        if (!oname.indexOf("UI.") || !oname.indexOf("SM.") || !oname.indexOf("MM.")) {
            oname = oname.substring("UI.".length, oname.length);
        }
        oname = oname.substring(0, oname.indexOf('.'));
        return locals["!ee"].hasProp(oname);
    }

    function Completion(file, query) {
        function getQuote(c) {
            return c === "'" || c === '"' ? c : null;
        }

        if (!query.end)
            return;

        var wordPos = tern.resolvePos(file, query.end);
        var word = null,
            completions = [];
        var wrapAsObjs = query.types || query.depths || query.docs || query.urls || query.origins;
        var cx = infer.cx(),
            overrideType = null;

        function gather(prop, obj, depth, addInfo) {
            if (obj == cx.protos.Object && !word)
                return;
            if (query.filter !== false && word && (query.caseInsensitive ? prop.toLowerCase() : prop).indexOf(word) !== 0)
                return;
            for (var i = 0; i < completions.length; ++i) {
                var c = completions[i];
                if ((wrapAsObjs ? c.name : c) == prop)
                    return;
            }
            var rec = wrapAsObjs ? {
                name: prop
            }
                : prop;
            completions.push(rec);

            if (obj && (query.types || query.docs || query.urls || query.origins)) {
                var val = obj.props[prop];
                infer.resetGuessing();
                var type = val.getType();
                rec.guess = infer.didGuess();
                if (query.types)
                    rec.type = overrideType != null ? overrideType : infer.toString(type);
                if (query.docs)
                    MaybeSet(rec, "doc", val.doc || type && type.doc);
                if (query.urls)
                    MaybeSet(rec, "url", val.url || type && type.url);
                if (query.origins)
                    MaybeSet(rec, "origin", val.origin || type && type.origin);
            }
            if (query.depths)
                rec.depth = depth;
            if (wrapAsObjs && addInfo)
                addInfo(rec);
        }

        var callExpr = infer.findExpressionAround(file.ast, null, wordPos, file.scope, "CallExpression");
        if (callExpr && callExpr.node.arguments && callExpr.node.arguments.length && callExpr.node.arguments.length > 0) {
            var nodeArg = callExpr.node.arguments[0];
            if (!(nodeArg.start <= wordPos && nodeArg.end >= wordPos))
                return;
            if (nodeArg._do_type) {
                var startQuote = getQuote(nodeArg.raw.charAt(0)),
                    endQuote = getQuote(nodeArg.raw.length > 1 ? nodeArg.raw.charAt(nodeArg.raw.length - 1) : null);
                var wordEnd = endQuote != null ? nodeArg.end - 1 : nodeArg.end,
                    wordStart = startQuote != null ? nodeArg.start + 1 : nodeArg.start,
                    word = nodeArg.value.slice(0,
                        nodeArg.value.length - (wordEnd - wordPos));
                if (query.caseInsensitive)
                    word = word.toLowerCase();

                switch (nodeArg._do_type.type) {
                    case "deviceone_pp":
                        var widgetType = nodeArg._do_type.proxy,
                            proto = widgetType.proto,
                            propertyType = null;
                        while (proto) {
                            var objType = GetObjectProperties(proto);
                            if (objType)
                                infer.forAllPropertiesOf(objType, gather);
                            proto = proto.proto;
                        }
                        break;

                    case "deviceone_ee":
                        var widgetType = nodeArg._do_type.proxy,
                            proto = widgetType.proto,
                            propertyType = null;
                        while (proto) {
                            var objType = GetEventProperties(proto);
                            if (objType)
                                infer.forAllPropertiesOf(objType, gather);
                            proto = proto.proto;
                        }
                        break;
                    case "deviceone_ui":
                        var server = cx.parent;
                        var _uimap = server._node.currentIDMap;
                        for (var k in _uimap) {
                            var _t = {};
                            _t.name = k;
                            _t.type = _uimap[k];
                            completions.push(_t);
                        }
                        break;
                    case "deviceone_sm":
                        var types = cx.definitions.deviceone["SM"];
                        overrideType = "SM";
                        infer.forAllPropertiesOf(types, gather);
                        break;
                    case "deviceone_mm":
                        var types = cx.definitions.deviceone["MM"];
                        overrideType = "MM";
                        infer.forAllPropertiesOf(types, gather);
                        break;
                    case "deviceone_rq":
                    	completions.push({ name : "deviceone", type:"module" });
                        var server = cx.parent;
                        var rs = GetScriptJSName(server.options.projectDir + "/source/script/");
                        var _t, _m;
                        for (var i = 0; i < rs.length; i++) {
                            _m = rs[i];
                            _t = {};
                            _t.name = _m.substring(0, _m.lastIndexOf(".js"));
                            _t.type = "module";
                            completions.push(_t);
                        }
                        break;
                }

                return {
                    start: tern.outputPos(query, file, wordStart),
                    end: tern.outputPos(query, file, wordEnd),
                    isProperty: false,
                    isStringAround: true,
                    startQuote: startQuote,
                    endQuote: endQuote,
                    completions: completions
                }
            }
        }
    }

    /** ******************************************************************************************************************** */

    infer.registerFunction("deviceone_ui", function (_self, args, argNodes) {
        if (!argNodes || !argNodes.length || argNodes[0].type != "Literal" || typeof argNodes[0].value != "string")
            return infer.ANull;
        var name = argNodes[0].value;
        var cx = infer.cx(),
            server = cx.parent;
        name = server._node.currentIDMap[name];
        var locals = cx.definitions.deviceone["UI"];
        var dType;
        if(name)
        	dType = locals.hasProp(name);
        argNodes[0]._do_type = {
            "type": "deviceone_ui"
        };
        if (dType)
            return new infer.Obj(dType.getType().getProp("prototype").getType());
        return infer.ANull;
    });

    infer.registerFunction("deviceone_sm", function (_self, args, argNodes) {
        if (!argNodes || !argNodes.length || argNodes[0].type != "Literal" || typeof argNodes[0].value != "string")
            return infer.ANull;
        var name = argNodes[0].value;
        var cx = infer.cx(),
            server = cx.parent;
        var locals = cx.definitions.deviceone["SM"],
            dType = locals.hasProp(name);
        argNodes[0]._do_type = {
            "type": "deviceone_sm"
        };
        if (dType)
            return new infer.Obj(dType.getType().getProp("prototype").getType());
        return infer.ANull;
    });

    infer.registerFunction("deviceone_mm", function (_self, args, argNodes) {
        if (!argNodes || !argNodes.length || argNodes[0].type != "Literal" || typeof argNodes[0].value != "string")
            return infer.ANull;
        var name = argNodes[0].value;
        var cx = infer.cx(),
            server = cx.parent;
        var locals = cx.definitions.deviceone["MM"],
            dType = locals.hasProp(name);
        argNodes[0]._do_type = {
            "type": "deviceone_mm"
        };
        if (dType)
            return new infer.Obj(dType.getType().getProp("prototype").getType());
        return infer.ANull;
    });

    infer.registerFunction("deviceone_ee", function (_self, args, argNodes) {
        if (!argNodes || !argNodes.length || argNodes[0].type != "Literal" || typeof argNodes[0].value != "string")
            return infer.ANull;
        var proxy = _self.getType();
        argNodes[0]._do_type = {
            "type": "deviceone_ee",
            "proxy": proxy
        };
    });

    infer.registerFunction("deviceone_pp", function (_self, args, argNodes) {
        if (!argNodes || !argNodes.length || argNodes[0].type != "Literal" || typeof argNodes[0].value != "string")
            return infer.ANull;
        var widgetType = _self.getType(),
            propertyName = argNodes[0].value,
            propertyType = GetPropertyType(widgetType, propertyName);
        argNodes[0]._do_type = {
            "type": "deviceone_pp",
            "proxy": widgetType
        };
        if (propertyType)
            return propertyType.getType();
        return infer.ANull;
    });

    infer.registerFunction("deviceone_rq", function (_self, _args, argNodes) {
        if (!argNodes || !argNodes.length || argNodes[0].type != "Literal" || typeof argNodes[0].value != "string")
            return infer.ANull;
        var cx = infer.cx(),
            server = cx.parent,
            data = server._node,
            name = argNodes[0].value;

        argNodes[0]._do_type = {
            "type": "deviceone_rq",
            "proxy": _self.getType()
        };

        if (name == "deviceone") {
            return new infer.Obj(cx.definitions.deviceone["!$"]);
        }
        var result;
        if (data.options.modules && data.options.modules.hasOwnProperty(name)) {
            var scope = BuildWrappingScope(cx.topScope, name);
            infer.def.load(data.options.modules[name], scope);
            result = data.modules[name] = scope.exports;
        } else {
            var currentFile = data.currentFile || ResolveProjectPath(server, argNodes[0].sourceFile.name);
            var relative = /^\.{0,2}\//.test(name);
            if (relative) {
                if (!currentFile)
                    return argNodes[0].required || infer.ANull;
                name = ResolvePath(currentFile, name);
            }
            result = ResolveModule(server, name, currentFile);
        }
        return argNodes[0].required = result;
    });
    
    infer.registerFunction("deviceone_cs", function(_self, args, argNodes) {
        var cx = infer.cx();
        var Cs = new infer.Obj(null);
        Cs.defProp("fn");
        return Cs;
    });

    tern.registerPlugin("deviceone", function (server, options) {

        server._node = {
            modules: Object.create(null),
            options: options || {},
            currentFile: null,
            currentRequires: [],
            currentOrigin: null,
            server: server
        };

        server.on("beforeLoad", function (file) {
            var fs = require("fs");
            if (StringEndWith(file.name, ".ui.js")) {
                var pathui = (server.options.projectDir + "/" + file.name).replace(".ui.js", ".ui");
                if (fs.existsSync(pathui)) {
                    this._node.currentIDMap = BuildUIFileIDMap(JSON.parse(fs.readFileSync(pathui)));
                }
            }
            this._node.currentFile = ResolveProjectPath(server, file.name);
            this._node.currentOrigin = file.name;
            this._node.currentRequires = [];
            file.scope = BuildWrappingScope(file.scope, this._node.currentOrigin, file.ast);
        });

        server.on("afterLoad", function (file) {
            var mod = GetModule(this._node, this._node.currentFile);
            mod.origin = this._node.currentOrigin;
            file.scope.exports.propagate(mod);
            this._node.currentFile = null;
            this._node.currentOrigin = null;
        });

        server.on("reset", function () {
            this._node.modules = Object.create(null);
        });

        return {
            defs: DEFINES,
            passes: {
                completion: Completion,
                preCondenseReach: PreCondenseReach,
                postLoadDef: PostLoadDef,
                typeAt: FindTypeAt
            }

        };
    });
/**}); **/ 
DEFINES={"mm":{"!type":"deviceone.mm"},"deviceone":{"mm":{"!type":"fn(id: string) -> !custom:deviceone_mm"},"foreach":{"!effects":["call !1 string !0.<i>"],"!type":"fn(obj: ?, f: fn(key: string, value: ?))"},"print":{"!type":"fn(info: string, name?: string)"},"ui":{"!type":"fn(id: string) -> !custom:deviceone_ui"},"merge":{"!effects":["copy !1 !0","copy !2 !0"],"!type":"fn(target: ?, source: ?, source2?: ?) -> !0"},"sm":{"!type":"fn(id: string) -> !custom:deviceone_sm"},"Class":{"!type":"fn(Super: ?, init: fn()) -> !custom:deviceone_cs"},"foreachi":{"!effects":["call !1 number !0.<i>"],"!type":"fn(list: [?], f: fn(index: number, value: ?))"}},"ui":{"!type":"deviceone.ui"},"!name":"deviceone","sm":{"!type":"deviceone.sm"},"!define":{"MM":{"do_HashData":{"!type":"fn()","prototype":{"addOne":{"!doc":"向数据集添加一条数据","!type":"fn(key: string, value: string)","!url":"http://store.deviceone.net/documents/do_HashData/1.9.html#addOne"},"removeAll":{"!doc":"清除所有数据","!type":"fn()","!url":"http://store.deviceone.net/documents/do_HashData/1.9.html#removeAll"},"getAll":{"!doc":"获取全部数据，若没找到返回null","!type":"fn() -> Node","!url":"http://store.deviceone.net/documents/do_HashData/1.9.html#getAll"},"getOne":{"!doc":"根据key获取对应值，若没找到返回null","!type":"fn(key: string) -> string","!url":"http://store.deviceone.net/documents/do_HashData/1.9.html#getOne"},"!proto":"!MM.prototype","addData":{"!doc":"向数据集添加数据","!type":"fn(data: Node)","!url":"http://store.deviceone.net/documents/do_HashData/1.9.html#addData"},"getCount":{"!doc":"","!type":"fn() -> number","!url":"http://store.deviceone.net/documents/do_HashData/1.9.html#getCount"},"removeData":{"!doc":"","!type":"fn(keys: Node)","!url":"http://store.deviceone.net/documents/do_HashData/1.9.html#removeData"},"removeOne":{"!doc":"根据key删除特定行数据","!type":"fn(key: string)","!url":"http://store.deviceone.net/documents/do_HashData/1.9.html#removeOne"},"getData":{"!doc":"根据keys获取多条数据，若没找到返回null","!type":"fn(keys: Node) -> Node","!url":"http://store.deviceone.net/documents/do_HashData/1.9.html#getData"}},"!url":""},"do_ListData":{"!type":"fn()","prototype":{"addOne":{"!doc":"在list增加一条数据，index是可选参数，表示要添加的位置，从0开始; 如果 index参数为空或者越界, 就添加到数组最后面","!type":"fn(data: Node, index: number)","!url":"http://store.deviceone.net/documents/do_ListData/2.2.html#addOne"},"removeAll":{"!doc":"清除所有数据","!type":"fn()","!url":"http://store.deviceone.net/documents/do_ListData/2.2.html#removeAll"},"getRange":{"!doc":"从起始索引到截止索引，获取多条数据","!type":"fn(fromIndex: number, toIndex: number)","!url":"http://store.deviceone.net/documents/do_ListData/2.2.html#getRange"},"getOne":{"!doc":"根据index获取特定行的数据，从0开始; 如果index参数小于0则取数组第一个元素；如果 index参数越界，则返回数组最后一个元素（如果数据源为空则返回null）","!type":"fn(index: number) -> string","!url":"http://store.deviceone.net/documents/do_ListData/2.2.html#getOne"},"removeRange":{"!doc":"从起始索引到截止索引删除多条数据","!type":"fn(fromIndex: number, toIndex: number)","!url":"http://store.deviceone.net/documents/do_ListData/2.2.html#removeRange"},"!proto":"!MM.prototype","addData":{"!doc":"在list增加一个或多个数据，index是可选参数，如果该参数不填表示插入到队列最尾","!type":"fn(data: Node, index: number)","!url":"http://store.deviceone.net/documents/do_ListData/2.2.html#addData"},"updateOne":{"!doc":"更新特定行的数据，index表示要修改的位置，从0开始; 如果index参数为空或者越界就什么都不改","!type":"fn(index: number, data: string)","!url":"http://store.deviceone.net/documents/do_ListData/2.2.html#updateOne"},"getCount":{"!doc":"","!type":"fn() -> number","!url":"http://store.deviceone.net/documents/do_ListData/2.2.html#getCount"},"removeData":{"!doc":"根据多个index删除多条数据","!type":"fn(indexs: Node)","!url":"http://store.deviceone.net/documents/do_ListData/2.2.html#removeData"},"getData":{"!doc":"indexs数组中的每一个值表示要读取的索引位置，从0开始;其它越界的索引位置都返回null","!type":"fn(indexs: Node) -> string","!url":"http://store.deviceone.net/documents/do_ListData/2.2.html#getData"}},"!url":""},"do_Http":{"!type":"fn()","prototype":{"request":{"!doc":"","!type":"fn()","!url":"http://store.deviceone.net/documents/do_Http/5.4.html#request"},"method":{"!doc":"http请求方式 GET/POST/PUT/PATCH/DELETE","!type":"string","!url":"http://store.deviceone.net/documents/do_Http/5.4.html#method"},"upload":{"!doc":"上传文件","!type":"fn(path: string, name: string)","!url":"http://store.deviceone.net/documents/do_Http/5.4.html#upload"},"setRequestHeader":{"!doc":"","!type":"fn(key: string, value: string)","!url":"http://store.deviceone.net/documents/do_Http/5.4.html#setRequestHeader"},"responseEncoding":{"!doc":"设置服务端返回内容的解码格式，通常与服务端开发人员约定，当属性有值时优先以该属性值格式解码，当不设置该属性时以默认值utf-8格式解码。Android平台支持utf-8、GBK；iOS平台支持utf-8、GBK、GB2312、BIG5；windows支持utf-8、GBK、GB2312；除此之外不支持的都以默认utf-8解析","!type":"string","!url":"http://store.deviceone.net/documents/do_Http/5.4.html#responseEncoding"},"!proto":"!MM.prototype","body":{"!doc":"请求数据，method为get、delete时不支持","!type":"string","!url":"http://store.deviceone.net/documents/do_Http/5.4.html#body"},"timeout":{"!doc":"请求服务器超时时间,单位是毫秒","!type":"number","!url":"http://store.deviceone.net/documents/do_Http/5.4.html#timeout"},"url":{"!doc":"发送服务器请求地址","!type":"string","!url":"http://store.deviceone.net/documents/do_Http/5.4.html#url"},"setRedirect":{"!doc":"设置是否自动执行http重定向（响应状态码为3xx的请求）","!type":"fn(isSetRedirect: bool)","!url":"http://store.deviceone.net/documents/do_Http/5.4.html#setRedirect"},"download":{"!doc":"下载文件","!type":"fn(path: string)","!url":"http://store.deviceone.net/documents/do_Http/5.4.html#download"},"form":{"!doc":"支持同时上传多个文件和字符串，contentType固定为multipart/form-data，无需再设置","!type":"fn(data: Node)","!url":"http://store.deviceone.net/documents/do_Http/5.4.html#form"},"getResponseHeader":{"!doc":"","!type":"fn(key: string) -> string","!url":"http://store.deviceone.net/documents/do_Http/5.4.html#getResponseHeader"},"contentType":{"!doc":"request时该属性默认值为application/x-www-form-urlencoded，upload和form时的默认值为multipart/form-data","!type":"string","!url":"http://store.deviceone.net/documents/do_Http/5.4.html#contentType"}},"!url":""}},"!pp":{"do_Label":{"linesSpace":{"!doc":"设置每行字之间的间距，windows平台不支持","!type":"number","!url":"http://store.deviceone.net/documents/do_Label/3.4.html#linesSpace"},"maxHeight":{"!doc":"设置文本框显示最大高度值，只有在设置Height属性值为-1时有效，否则不起作用","!type":"number","!url":"http://store.deviceone.net/documents/do_Label/3.4.html#maxHeight"},"textAlign":{"!doc":"对齐方式为以下3种：left 左对齐（默认）；center 居中；right 右对齐。","!type":"string","!url":"http://store.deviceone.net/documents/do_Label/3.4.html#textAlign"},"maxLines":{"!doc":"最大行数，说明：设置文本内容显示最大行数，如显示内容超过了最大行值则结尾用省略号...表示（iOS只有设置成1时才会显示...）；缺省为1行，如果为小于或等于0表示不限行数；当高度为-1时设置该属性无效","!type":"number","!url":"http://store.deviceone.net/documents/do_Label/3.4.html#maxLines"},"fontSize":{"!doc":"","!type":"number","!url":"http://store.deviceone.net/documents/do_Label/3.4.html#fontSize"},"text":{"!doc":"获取或设置与此控件关联的文本。","!type":"string","!url":"http://store.deviceone.net/documents/do_Label/3.4.html#text"},"fontStyle":{"!doc":"包含4种类型：normal：常规bold：粗体italic：斜体bold_italic：粗斜体（iOS平台不支持）","!type":"string","!url":"http://store.deviceone.net/documents/do_Label/3.4.html#fontStyle"},"fontColor":{"!doc":"设置字体显示颜色，值格式为：8位16进制字符，前6位是RGB颜色值，后两位是透明度（Alpha），例如：000000FF","!type":"string","!url":"http://store.deviceone.net/documents/do_Label/3.4.html#fontColor"},"textFlag":{"!doc":"包含3种类型：normal：常规underline ：下划线strikethrough ：删除线","!type":"string","!url":"http://store.deviceone.net/documents/do_Label/3.4.html#textFlag"},"maxWidth":{"!doc":"label的width为\"－1\"的时候，label会根据text内容自动适配变宽，但是不会宽于maxWidth","!type":"number","!url":"http://store.deviceone.net/documents/do_Label/3.4.html#maxWidth"}},"do_ImageView":{"scale":{"!doc":"图片显示类型，有以下几种方式,缺省为fillxy；fillxy：拉伸图片（不按比例）以填充View的宽高；center：按原图大小显示图片，但图片宽高大于View的宽高时，截图图片中间部分显示；fillxory：按比例放大原图直至等于某边View的宽高显示；centercrop：当图片大于组件时按图片中心点比例缩小图片，直到图片的宽高大于或等于ImageView组件的宽高时截取图片中间部分显示、当图片小于组件时按比例放大直到填充ImageView的宽或高","!type":"string","!url":"http://store.deviceone.net/documents/do_ImageView/4.6.html#scale"},"source":{"!doc":"可设置网络或本地文件，支持：http:// https:// data:// source:// 打头的URI格式，不能包含@符号。其中文件格式说明可参考Storage类","!type":"string","!url":"http://store.deviceone.net/documents/do_ImageView/4.6.html#source"},"radius":{"!doc":"像素值，为0时表示不是圆角图片；当同时设置了border属性，则radius属性失效","!type":"number","!url":"http://store.deviceone.net/documents/do_ImageView/4.6.html#radius"},"cacheType":{"!doc":"只有当imageview的source是http或者https的网络图片时，这个属性才有意义。支持三种缓存方式：；always：表示只读本地缓存，缓存没有的时候从远程读取一次然后就缓存到本地。；never：表示永远不读本地缓存，永远都是读远程图片。；temporay：表示每次打开这个imageview都会先读缓存的本地图片，然后再读服务器的网络图片，然后再缓存到本地,然后再更新到imageview","!type":"string","!url":"http://store.deviceone.net/documents/do_ImageView/4.6.html#cacheType"},"defaultImage":{"!doc":"支持data://和source://","!type":"string","!url":"http://store.deviceone.net/documents/do_ImageView/4.6.html#defaultImage"},"enabled":{"!doc":"缺省为\"false\".控制imageview是否可点击，如果enable为true，则imageview是可以点击的，否则不可点击。","!type":"bool","!url":"http://store.deviceone.net/documents/do_ImageView/4.6.html#enabled"},"animation":{"!doc":"加载图片时的动画效果，支持none没有动画效果和fade淡入淡出效果","!type":"string","!url":"http://store.deviceone.net/documents/do_ImageView/4.6.html#animation"}},"do_ListData":{},"do_Http":{"method":{"!doc":"http请求方式 GET/POST/PUT/PATCH/DELETE","!type":"string","!url":"http://store.deviceone.net/documents/do_Http/5.4.html#method"},"responseEncoding":{"!doc":"设置服务端返回内容的解码格式，通常与服务端开发人员约定，当属性有值时优先以该属性值格式解码，当不设置该属性时以默认值utf-8格式解码。Android平台支持utf-8、GBK；iOS平台支持utf-8、GBK、GB2312、BIG5；windows支持utf-8、GBK、GB2312；除此之外不支持的都以默认utf-8解析","!type":"string","!url":"http://store.deviceone.net/documents/do_Http/5.4.html#responseEncoding"},"body":{"!doc":"请求数据，method为get、delete时不支持","!type":"string","!url":"http://store.deviceone.net/documents/do_Http/5.4.html#body"},"contentType":{"!doc":"request时该属性默认值为application/x-www-form-urlencoded，upload和form时的默认值为multipart/form-data","!type":"string","!url":"http://store.deviceone.net/documents/do_Http/5.4.html#contentType"},"timeout":{"!doc":"请求服务器超时时间,单位是毫秒","!type":"number","!url":"http://store.deviceone.net/documents/do_Http/5.4.html#timeout"},"url":{"!doc":"发送服务器请求地址","!type":"string","!url":"http://store.deviceone.net/documents/do_Http/5.4.html#url"}},"do_SlideView":{"looping":{"!doc":"左右无限循环滑动视图，设置值为true表示支持无限循环滑动，默认为false，windows不支持","!type":"bool","!url":"http://store.deviceone.net/documents/do_SlideView/5.5.html#looping"},"templates":{"!doc":"可以设置一个或多个UI模板文件，值为String类型，多个模板之间分别用“,”分隔，例如：“source://view/temp/t0.ui,source://view/temp/t1.ui”","!type":"Node","!url":"http://store.deviceone.net/documents/do_SlideView/5.5.html#templates"},"isAllCache":{"!doc":"（不论设置成true和false，效果都为设置成true时一样）为true的时候每一条数据缓存一个View，对应的ui文件和js文件只会加载一次，对应的dataRefresh事件只会触发一次，以后不管如何左右滑动都不再加载和触发事件。如果数据不多，建议设置为true\r\n为false时，可以复用View，对应的ui和js可能在来回滑动SlideView的时候会加载多次，而datarefreshed事件每次滑动到这一页就会触发一次。如果需要不想保留每一个页的状态变化，另外需加载较多数据的时候，建议使用false","!type":"bool","!url":"http://store.deviceone.net/documents/do_SlideView/5.5.html#isAllCache"},"index":{"!doc":"设置滑动视图索引值，默认为0","!type":"number","!url":"http://store.deviceone.net/documents/do_SlideView/5.5.html#index"},"allowGesture":{"!doc":"当属性值为true时，组件可通过手势左右滑动来切换页面；为false时，手势无法滑动，只能通过修改index来切换页面","!type":"bool","!url":"http://store.deviceone.net/documents/do_SlideView/5.5.html#allowGesture"}},"do_Button":{"fontSize":{"!doc":"","!type":"number","!url":"http://store.deviceone.net/documents/do_Button/2.8.html#fontSize"},"bgImage":{"!doc":"可设置本地文件：支持data://和source://两种方式。文件格式说明参考Storage类","!type":"string","!url":"http://store.deviceone.net/documents/do_Button/2.8.html#bgImage"},"text":{"!doc":"获取或设置与此控件关联的文本","!type":"string","!url":"http://store.deviceone.net/documents/do_Button/2.8.html#text"},"fontStyle":{"!doc":"包含4种类型：normal：常规bold：粗体italic：斜体bold_italic：粗斜体（iOS平台不支持）","!type":"string","!url":"http://store.deviceone.net/documents/do_Button/2.8.html#fontStyle"},"radius":{"!doc":"像素值，为0时表示不是圆角按钮；@deprecated，该属性为不建议使用，建议使用UI的基础属性border来替代","!type":"number","!url":"http://store.deviceone.net/documents/do_Button/2.8.html#radius"},"enabled":{"!doc":"控制button的点击事件，缺省为true，表示用户如果点击按钮会触发button的三种touch事件","!type":"bool","!url":"http://store.deviceone.net/documents/do_Button/2.8.html#enabled"},"fontColor":{"!doc":"设置字体显示颜色，值格式为：8位16进制字符，前6位是RGB颜色值，后两位是透明度（Alpha），例如：000000FF","!type":"string","!url":"http://store.deviceone.net/documents/do_Button/2.8.html#fontColor"},"textFlag":{"!doc":"包含3种类型：normal：常规underline ：下划线strikethrough ：删除线","!type":"string","!url":"http://store.deviceone.net/documents/do_Button/2.8.html#textFlag"}},"do_LinearLayout":{"padding":{"!doc":"0,0,0,0 分别表示上，右，下，左的内边距，通常只用于height和width为-1的情况","!type":"string","!url":"http://store.deviceone.net/documents/do_LinearLayout/1.3.html#padding"},"bgImageFillType":{"!doc":"背景图片填充方式，缺省为fillxy，win8不支持repeatxy方式：\r\nfillxy：拉伸图片（不按比例）以填充layout的宽高\r\nrepeatxy：按原图大小重复填充","!type":"string","!url":"http://store.deviceone.net/documents/do_LinearLayout/1.3.html#bgImageFillType"},"bgImage":{"!doc":"可设置本地文件：支持data://和source://两种方式。文件格式说明参考Storage类","!type":"string","!url":"http://store.deviceone.net/documents/do_LinearLayout/1.3.html#bgImage"},"enabled":{"!doc":"缺省为'true'，如果enable为true，则Layout是可以点击的，touch事件才有意义，否则不可点击","!type":"bool","!url":"http://store.deviceone.net/documents/do_LinearLayout/1.3.html#enabled"},"direction":{"!doc":"支持2种方向布局，只允许设计器修改：\r\nhorizontal：横向布局\r\nvertical：纵向布局","!type":"string","!url":"http://store.deviceone.net/documents/do_LinearLayout/1.3.html#direction"}},"do_ListView":{"isHeaderVisible":{"!doc":"缺省false不显示","!type":"bool","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#isHeaderVisible"},"isShowbar":{"!doc":"为true的时候，当listview内容超出listview的边界，会出现滚动条标识。","!type":"bool","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#isShowbar"},"isFooterVisible":{"!doc":"缺省false不显示","!type":"bool","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#isFooterVisible"},"templates":{"!doc":"一个ListView可以有多个cell模板，这个属性是一个json array，每一个元素都是一个source ui文件。这个属性的格式类似如下： source://view/cell1.ui,source://view/cell2.ui,source://view/cell3.ui","!type":"string","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#templates"},"canScrollToTop":{"!doc":"属性设置成true时可以通过点击手机状态栏返回内容的顶部；仅支持iOS平台","!type":"bool","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#canScrollToTop"},"bounces":{"!doc":"只支持iOS平台，为false时没有上拉下拉的反弹效果","!type":"bool","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#bounces"},"selectedColor":{"!doc":"","!type":"string","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#selectedColor"},"footerView":{"!doc":"设置要显示的表头视图地址，不填但isFooterVisible为true时有缺省样式","!type":"string","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#footerView"},"headerView":{"!doc":"设置要显示的表头视图地址，不填但isHeaderVisible为true时有缺省样式","!type":"string","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#headerView"}},"do_WebView":{"isShowLoadingProgress":{"!doc":"webview的顶部有一个绿色进度条，显示加载网页的进度，缺省false不显示","!type":"bool","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#isShowLoadingProgress"},"isHeaderVisible":{"!doc":"缺省false不显示","!type":"bool","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#isHeaderVisible"},"allowDeviceOne":{"!doc":"若想要WebView可以调用DeviceOne的函数，必须将该属性值设置为true，且在该页面的中将代码加到一个特定的函数window.onDeviceOneLoaded = function(){ //do something }方可","!type":"bool","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#allowDeviceOne"},"userAgent":{"!doc":"设置浏览器的User-Agent","!type":"string","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#userAgent"},"zoom":{"!doc":"设置webview是否支持手势缩小放大，设置为true时支持","!type":"bool","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#zoom"},"bounces":{"!doc":"只支持iOS平台，为false时没有上拉下拉的反弹效果","!type":"bool","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#bounces"},"allowVideoFullScreenPlayback":{"!doc":"为true时则播放HTML页面中视频时自动全屏，为false时则在播放的时候不改变原有视频窗口大小","!type":"bool","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#allowVideoFullScreenPlayback"},"cacheType":{"!doc":"改变WebView的缓存方式，缺省值为no_cache表示不使用缓存；为normal时根据cache-control决定是否获取新数据；windows平台不支持","!type":"string","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#cacheType"},"headerView":{"!doc":"设置要显示的表头视图地址，不填但isHeaderVisible为true时有缺省样式","!type":"string","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#headerView"},"url":{"!doc":"支持http://,https://,支持source://,data://文件格式。文件格式的说明可以参考Storage类","!type":"string","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#url"}},"do_ALayout":{"bgImageFillType":{"!doc":"背景图片填充方式，缺省为fillxy，win8不支持repeatxy方式。其中fillxy:表示无论图片大小，图片会自动拉伸平铺满整个layout；repeatxy:表示图片不会有任何自动拉伸，根据layout大小会重复很多个图片","!type":"string","!url":"http://store.deviceone.net/documents/do_ALayout/1.2.html#bgImageFillType"},"layoutAlign":{"!doc":"这个属性只有当isStretch为false的时候才有意义。正如isStretch属性描述，如果设计器设计的区域分辨率宽高比和运行的手机宽高比不一致的时候，通过设置isStretch为false可以确保ALayout比例不变形，但是有可能会有空白区域，这个属性就是设置这个空白区的停靠方式。总共有如下几种对齐方式：\r\n 'TopLeft'：'垂直居上，水平居左'\r\n'TopCenter'：'垂直居上，水平居中'\r\n'TopRight'：'垂直居上，水平居右'\r\n'MiddleLeft'：'垂直居中，水平居左'\r\n'MiddleCenter'：'垂直水平都居中'\r\n'MiddleRight'：'垂直居中，水平居右'\r\n'BottomLeft'：'垂直居下，水平居左'\r\n'BottomCenter'：'垂直居下，水平居中'\r\n'BottomRight'：'垂直居下，水平居右'","!type":"string","!url":"http://store.deviceone.net/documents/do_ALayout/1.2.html#layoutAlign"},"bgImage":{"!doc":"设置layout的背景图片，支持data://和source://两种方式；文件格式说明参考Storage类","!type":"string","!url":"http://store.deviceone.net/documents/do_ALayout/1.2.html#bgImage"},"isStretch":{"!doc":"通常ALayout包括ALayout内的所有组件都是按照设计器里设计的分辨率映射到手机屏幕的分辨率，按比例缩放的。比如设计器设计一个ui缺省是320*480，如果在ALayout是100*100的正方形，最后安装到640*960分辨率的手机上会是一个200*200的正方形区域；但是安装到分辨率比例和设计器比例不一致的手机上，正方形会变形为长方形，比如手机分辨率为640*1024，则正方形会变成200*213的长方形，为了确保不变形，可以通过设置这个属性来控制。通常isStretch为true，表示缺省是自动平铺拉伸，如果改为false，则layout的优先考虑比例，会自动拉伸，但是会拉伸到铺满横向或者纵向。比如上面的例子，安装到分辨率是640*1024，如果设置isStretch为false的话，layout还会是200*200的正方形，但是layout的父容器会多出13左右的空白","!type":"bool","!url":"http://store.deviceone.net/documents/do_ALayout/1.2.html#isStretch"},"enabled":{"!doc":"缺省为true，如果enable为true，则ALayout是可以点击的，否则不可点击","!type":"bool","!url":"http://store.deviceone.net/documents/do_ALayout/1.2.html#enabled"}},"do_HashData":{},"do_TextField":{"textAlign":{"!doc":"对齐方式为以下3种：left 左对齐（默认）；center 居中；right 右对齐。","!type":"string","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#textAlign"},"clearImg":{"!doc":"不设置或该属性为空时会显示默认图片，默认为在文本框右侧的一个叉号标记；否则显示设置的图片，支持data://和source://目录；windows平台不支持","!type":"string","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#clearImg"},"fontStyle":{"!doc":"包含4种类型：normal：常规；bold：粗体；italic：斜体；bold_italic：粗斜体（iOS平台不支持）","!type":"string","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#fontStyle"},"clearAll":{"!doc":"默认值为false，设置成true时在文本框右侧显示一个叉号标记，点击叉号可以删除所有文本内容","!type":"bool","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#clearAll"},"enabled":{"!doc":"控制文本框是否为可编辑状态，为false时不可编辑","!type":"bool","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#enabled"},"cursorColor":{"!doc":"修改输入框光标颜色，暂只支持iOS平台","!type":"string","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#cursorColor"},"hintColor":{"!doc":"text为空时显示的文字提示信息字体颜色，windows平台不支持","!type":"string","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#hintColor"},"password":{"!doc":"默认值为false，设置为true时将输入的字符显示为**","!type":"bool","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#password"},"hint":{"!doc":"text为空时显示的文字提示信息","!type":"string","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#hint"},"fontSize":{"!doc":"字体大小","!type":"number","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#fontSize"},"inputType":{"!doc":"输入类型，不设置这个属性的时候会使用系统默认键盘支持所有字符，可设置的值包括以下5种:\n\t\r\n\"ASC\" ：支持ASCII的默认键盘\n\r\n\"PHONENUMBER\" ：标准电话键盘，支持＋＊＃字符\n\r\n\"URL\" ：URL键盘，支持.com按钮 只支持URL字符\n\t\t\r\n\"ENG\" :英文键盘\r\n\"DECIMAL\" :数字与小数点键盘（仅支持iOS平台）","!type":"string","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#inputType"},"text":{"!doc":"获取或设置与此控件关联的文本","!type":"string","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#text"},"enterText":{"!doc":"修改软键盘上按钮显示文字，有以下枚举值：go前往、send发送、next下一项、done完成、search搜索、default由inputType属性控制，与系统相同","!type":"string","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#enterText"},"fontColor":{"!doc":"设置字体显示颜色，值格式为：8位16进制字符，前6位是RGB颜色值，后两位是透明度（Alpha），例如：000000FF","!type":"string","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#fontColor"},"maxLength":{"!doc":"","!type":"number","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#maxLength"},"textFlag":{"!doc":"包含3种类型：\r\nnormal：常规\r\nunderline ：下划线\r\nstrikethrough ：删除线","!type":"string","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#textFlag"}},"do_ViewShower":{},"do_ScrollView":{"isHeaderVisible":{"!doc":"设置是否显示顶部视图，只有滚动方向为纵向才有效，横向不支持；缺省false不显示","!type":"bool","!url":"http://store.deviceone.net/documents/do_ScrollView/4.8.html#isHeaderVisible"},"isShowbar":{"!doc":"为true的时候，当scrollview内内容超出scrollview的边界，会出现滚动条标识","!type":"bool","!url":"http://store.deviceone.net/documents/do_ScrollView/4.8.html#isShowbar"},"canScrollToTop":{"!doc":"属性设置成true时可以通过点击手机状态栏返回内容的顶部；仅支持iOS平台","!type":"bool","!url":"http://store.deviceone.net/documents/do_ScrollView/4.8.html#canScrollToTop"},"headerView":{"!doc":"可自定义下拉滑动显示顶部视图效果，通常用于动态加载数据过程，下拉顶部自定义视图是一个UI模板文件，例如source://view/head.ui，只有滚动方向为纵向才有效，横向不支持","!type":"string","!url":"http://store.deviceone.net/documents/do_ScrollView/4.8.html#headerView"},"direction":{"!doc":"设置视图滚动方向值，支持两种类型：horizontal（横向）、vertical（纵向）","!type":"string","!url":"http://store.deviceone.net/documents/do_ScrollView/4.8.html#direction"}}},"!ee":{"do_App":{"loaded":{"!doc":"App启动完成时触发，通常这个事件是整个程序的入口。","!type":"Event","!url":"http://store.deviceone.net/documents/do_App/1.3.html#loaded"}},"do_DataCache":{},"do_Label":{},"do_ImageView":{"touch":{"!doc":"点击触发这个事件","!type":"Event","!url":"http://store.deviceone.net/documents/do_ImageView/4.6.html#touch"}},"do_ListData":{},"do_InitData":{},"do_Algorithm":{},"do_Http":{"result":{"!doc":"请求结束事件","!type":"Event","!url":"http://store.deviceone.net/documents/do_Http/5.4.html#result"},"fail":{"!doc":"请求出错事件","!type":"Event","!url":"http://store.deviceone.net/documents/do_Http/5.4.html#fail"},"success":{"!doc":"请求成功事件","!type":"Event","!url":"http://store.deviceone.net/documents/do_Http/5.4.html#success"},"progress":{"!doc":"响应请求事件","!type":"Event","!url":"http://store.deviceone.net/documents/do_Http/5.4.html#progress"}},"do_SlideView":{"indexChanged":{"!doc":"滑动显示当前视图后触发该事件","!type":"Event","!url":"http://store.deviceone.net/documents/do_SlideView/5.5.html#indexChanged"},"touch":{"!doc":"点击cell触发","!type":"Event","!url":"http://store.deviceone.net/documents/do_SlideView/5.5.html#touch"}},"do_Global":{"broadcast":{"!doc":"android原生系统广播会触发这个事件，当然只有android系统才支持","!type":"Event","!url":"http://store.deviceone.net/documents/do_Global/1.4.html#broadcast"},"background":{"!doc":"通常是按手机的home键应用进到后台会触发这个事件","!type":"Event","!url":"http://store.deviceone.net/documents/do_Global/1.4.html#background"},"launch":{"!doc":"应用被启动会触发这个事件，三种情况 1. 正常点击应用图标启动 2. 被启动应用通过唤醒ID被其他应用唤醒启动 3. 通过点击推送过来的消息来启动 这个事件只能在程序入口脚本代码中订阅才有意义，比如app.lua ,app.js","!type":"Event","!url":"http://store.deviceone.net/documents/do_Global/1.4.html#launch"},"foreground":{"!doc":"应用从后台回到前台会触发这个事件","!type":"Event","!url":"http://store.deviceone.net/documents/do_Global/1.4.html#foreground"}},"do_Button":{"touchDown":{"!doc":"按钮范围内按下即可触发","!type":"Event","!url":"http://store.deviceone.net/documents/do_Button/2.8.html#touchDown"},"touchUp":{"!doc":"一旦按下，手指离开即触发，不论是否在按钮范围内","!type":"Event","!url":"http://store.deviceone.net/documents/do_Button/2.8.html#touchUp"},"touch":{"!doc":"按下并在按钮范围抬起，触发该事件","!type":"Event","!url":"http://store.deviceone.net/documents/do_Button/2.8.html#touch"}},"do_LinearLayout":{"touch":{"!doc":"点击触发","!type":"Event","!url":"http://store.deviceone.net/documents/do_LinearLayout/1.3.html#touch"}},"do_Storage":{},"do_ListView":{"pull":{"!doc":"下拉headerview事件","!type":"Event","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#pull"},"longTouch":{"!doc":"长按cell触发","!type":"Event","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#longTouch"},"touch1":{"!doc":"点击cell触发","!type":"Event","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#touch1"},"scroll":{"!doc":"滑动事件","!type":"Event","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#scroll"},"touch":{"!doc":"点击cell触发","!type":"Event","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#touch"},"longTouch1":{"!doc":"长按cell触发","!type":"Event","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#longTouch1"},"push":{"!doc":"上拉footerview事件","!type":"Event","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#push"}},"do_WebView":{"loaded":{"!doc":"加载结束事件","!type":"Event","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#loaded"},"pull":{"!doc":"下拉headerview事件","!type":"Event","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#pull"},"start":{"!doc":"开始加载","!type":"Event","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#start"},"failed":{"!doc":"加载错误事件","!type":"Event","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#failed"}},"do_ALayout":{"longTouch":{"!doc":"长按事件","!type":"Event","!url":"http://store.deviceone.net/documents/do_ALayout/1.2.html#longTouch"},"touchDown":{"!doc":"alayout范围内按下即可触发，必须先订阅toch事件才会有效果","!type":"Event","!url":"http://store.deviceone.net/documents/do_ALayout/1.2.html#touchDown"},"touchUp":{"!doc":"一旦按下，手指离开即触发，不论是否在alayout范围内，必须先订阅toch事件才会有效果","!type":"Event","!url":"http://store.deviceone.net/documents/do_ALayout/1.2.html#touchUp"},"touch":{"!doc":"按下并在alayout范围抬起，触发该事件","!type":"Event","!url":"http://store.deviceone.net/documents/do_ALayout/1.2.html#touch"}},"do_HashData":{},"do_Notification":{},"do_Page":{"loaded":{"!doc":"页面加载完触发事件","!type":"Event","!url":"http://store.deviceone.net/documents/do_Page/1.3.html#loaded"},"result":{"!doc":"上层Page关闭时触发","!type":"Event","!url":"http://store.deviceone.net/documents/do_Page/1.3.html#result"},"resume":{"!doc":"回到前台、Page回到顶端时触发或打开当前页面","!type":"Event","!url":"http://store.deviceone.net/documents/do_Page/1.3.html#resume"},"back":{"!doc":"点击设备物理或虚拟返回按键触发事件（Android、WindowsPhone有效）","!type":"Event","!url":"http://store.deviceone.net/documents/do_Page/1.3.html#back"},"menu":{"!doc":"点击设备物理或虚拟菜单按键触发事件（Android、WindowsPhone有效）","!type":"Event","!url":"http://store.deviceone.net/documents/do_Page/1.3.html#menu"},"pause":{"!doc":"进入后台、被其他Page盖住或关闭当前页面时触发","!type":"Event","!url":"http://store.deviceone.net/documents/do_Page/1.3.html#pause"}},"do_TextField":{"focusIn":{"!doc":"进入编辑状态","!type":"Event","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#focusIn"},"focusOut":{"!doc":"离开编辑状态","!type":"Event","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#focusOut"},"enter":{"!doc":"点击键盘右下角按钮时触发","!type":"Event","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#enter"},"textChanged":{"!doc":"文字变化时触发","!type":"Event","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#textChanged"}},"do_ViewShower":{"viewChanged":{"!doc":"View切换完成时触发","!type":"Event","!url":"http://store.deviceone.net/documents/do_ViewShower/2.1.html#viewChanged"}},"do_ScrollView":{"pull":{"!doc":"下拉滑动显示顶部视图时触发事件","!type":"Event","!url":"http://store.deviceone.net/documents/do_ScrollView/4.8.html#pull"},"scroll":{"!doc":"控件滚动触发","!type":"Event","!url":"http://store.deviceone.net/documents/do_ScrollView/4.8.html#scroll"}}},"!MM":{"!type":"fn()","prototype":{"loadSync":{"!doc":"通过加载一个json文件或json字符串来构建Model实例的数据","!type":"fn(source: string)","!url":"http://store.deviceone.net/Documents/Base/MM.html#loadSync"},"set":{"!doc":"除了单独设置一个属性值外，可以通过这个方法设置一个MM组件的多个属性的属性值，比如\n<pre class=\"brush: js;toolbar:false;\">\n\tvar http1 = mm(\"do_Http\");\n\tvar values = {\n\t\t\"url\" : \"http://www.baidu.com\",\n\t\t\"method\" : \"GET\",\n\t\t\"timeout\" : 30000\n\t}\n\thttp1.set(values);\n\tdeviceone.print(http1.url);\n</pre>","!type":"fn(data: Node)","!url":"http://store.deviceone.net/Documents/Base/MM.html#set"},"load":{"!effects":["call !1 this=!this"],"!doc":"通过加载一个json文件或字符串来构建Model实例的数据","!type":"fn(source: string, f: fn(data: , e: ?)) -> !this","!url":"http://store.deviceone.net/Documents/Base/MM.html#load"},"setMapping":{"!doc":"bind方法可以指定mapping，而这个方法是设置缺省的映射关系，如果bind方法传递的mapping参数为空，则使用这个缺省的映射关系.<br />详细的文档参考<a href=\"http://doc.deviceone.net/web/doc/detail_course/databind.htm\">数据绑定</a>","!type":"fn(data: Node)","!url":"http://store.deviceone.net/Documents/Base/MM.html#setMapping"},"release":{"!doc":"调用该方法可将一个MM对象彻底释放","!type":"fn()","!url":"http://store.deviceone.net/Documents/Base/MM.html#release"},"get":{"!doc":"除了单独获取一个属性值外，可以通过这个方法获取一个MM组件的多个属性的属性值，比如<br /><br /><pre class=\"brush: js;toolbar:false;\">\n\tvar http1 = mm(\"do_Http\");\n\thttp1.url = \"http://www.baidu.com\";\n\thttp1.method = \"GET\";\n\thttp1.timeout = 30000;\n\tvar feature_name = [\"url\",\"method\",\"timeout\"];\n\tvar feature_value = http1.get(feature_name);\n\tdeviceone.print(JSON.stringify(feature_value));//打印出{\"url\":\"http://www.baidu.com\",\"method\":\"GET\",\"timeout\":30000}\n</pre>","!type":"fn(data: Node) -> Node","!url":"http://store.deviceone.net/Documents/Base/MM.html#get"},"!proto":"!Q.prototype","refreshData":{"!doc":"详细的文档参考<a href=\"http://doc.deviceone.net/web/doc/detail_course/databind.htm\">数据绑定</a>","!type":"fn()","!url":"http://store.deviceone.net/Documents/Base/MM.html#refreshData"},"bindData":{"!doc":"利用HashData和ListData绑定对象到一个数据源，详细的文档参考<a href=\"http://doc.deviceone.net/web/doc/detail_course/databind.htm\">数据绑定</a> ","!type":"fn(data: string, mapping: Node)","!url":"http://store.deviceone.net/Documents/Base/MM.html#bindData"}},"!url":""},"!$":"deviceone","!E":{"prototype":{"getType":{"!doc":"","!type":"fn() -> string","!url":""},"fire":{"!effects":["custom deviceone_ee"],"!doc":"","!type":"fn(name: string, data?: Node) -> !this","!url":""},"getAddress":{"!doc":"","!type":"fn() -> string","!url":""},"off":{"!effects":["custom deviceone_ee"],"!doc":"","!type":"fn(name: string) -> !this","!url":""},"on":{"!effects":["custom deviceone_ee","call !3 this=!this"],"!doc":"","!type":"fn(name: string, data: Node, delay: number, f: fn(data: Node, e: Node)) -> !this","!url":""}}},"Node":{},"require":{"!doc":"","!type":"fn(id: string) -> !custom:deviceone_rq","!url":""},"!Q":{"!doc":"","!type":"fn()","prototype":{"set":{"!type":"fn(data: Node) -> !custom:deviceone_pp"},"setMapping":{"!type":"fn(data: Node, mapping: Node) -> !this"},"get":{"!type":"fn(data: [string]) -> !custom:deviceone_pp"},"!proto":"!E.prototype","refreshData":{"!type":"fn() -> !this"},"bindData":{"!type":"fn(data: Node, mapping: Node) -> !this"}},"!url":""},"UI":{"do_Button":{"!type":"fn()","prototype":{"!proto":"!UI.prototype","fontSize":{"!doc":"","!type":"number","!url":"http://store.deviceone.net/documents/do_Button/2.8.html#fontSize"},"bgImage":{"!doc":"可设置本地文件：支持data://和source://两种方式。文件格式说明参考Storage类","!type":"string","!url":"http://store.deviceone.net/documents/do_Button/2.8.html#bgImage"},"text":{"!doc":"获取或设置与此控件关联的文本","!type":"string","!url":"http://store.deviceone.net/documents/do_Button/2.8.html#text"},"fontStyle":{"!doc":"包含4种类型：normal：常规bold：粗体italic：斜体bold_italic：粗斜体（iOS平台不支持）","!type":"string","!url":"http://store.deviceone.net/documents/do_Button/2.8.html#fontStyle"},"radius":{"!doc":"像素值，为0时表示不是圆角按钮；@deprecated，该属性为不建议使用，建议使用UI的基础属性border来替代","!type":"number","!url":"http://store.deviceone.net/documents/do_Button/2.8.html#radius"},"enabled":{"!doc":"控制button的点击事件，缺省为true，表示用户如果点击按钮会触发button的三种touch事件","!type":"bool","!url":"http://store.deviceone.net/documents/do_Button/2.8.html#enabled"},"fontColor":{"!doc":"设置字体显示颜色，值格式为：8位16进制字符，前6位是RGB颜色值，后两位是透明度（Alpha），例如：000000FF","!type":"string","!url":"http://store.deviceone.net/documents/do_Button/2.8.html#fontColor"},"textFlag":{"!doc":"包含3种类型：normal：常规underline ：下划线strikethrough ：删除线","!type":"string","!url":"http://store.deviceone.net/documents/do_Button/2.8.html#textFlag"}},"!url":""},"do_Label":{"!type":"fn()","prototype":{"linesSpace":{"!doc":"设置每行字之间的间距，windows平台不支持","!type":"number","!url":"http://store.deviceone.net/documents/do_Label/3.4.html#linesSpace"},"maxHeight":{"!doc":"设置文本框显示最大高度值，只有在设置Height属性值为-1时有效，否则不起作用","!type":"number","!url":"http://store.deviceone.net/documents/do_Label/3.4.html#maxHeight"},"textAlign":{"!doc":"对齐方式为以下3种：left 左对齐（默认）；center 居中；right 右对齐。","!type":"string","!url":"http://store.deviceone.net/documents/do_Label/3.4.html#textAlign"},"!proto":"!UI.prototype","maxLines":{"!doc":"最大行数，说明：设置文本内容显示最大行数，如显示内容超过了最大行值则结尾用省略号...表示（iOS只有设置成1时才会显示...）；缺省为1行，如果为小于或等于0表示不限行数；当高度为-1时设置该属性无效","!type":"number","!url":"http://store.deviceone.net/documents/do_Label/3.4.html#maxLines"},"fontSize":{"!doc":"","!type":"number","!url":"http://store.deviceone.net/documents/do_Label/3.4.html#fontSize"},"text":{"!doc":"获取或设置与此控件关联的文本。","!type":"string","!url":"http://store.deviceone.net/documents/do_Label/3.4.html#text"},"fontStyle":{"!doc":"包含4种类型：normal：常规bold：粗体italic：斜体bold_italic：粗斜体（iOS平台不支持）","!type":"string","!url":"http://store.deviceone.net/documents/do_Label/3.4.html#fontStyle"},"fontColor":{"!doc":"设置字体显示颜色，值格式为：8位16进制字符，前6位是RGB颜色值，后两位是透明度（Alpha），例如：000000FF","!type":"string","!url":"http://store.deviceone.net/documents/do_Label/3.4.html#fontColor"},"textFlag":{"!doc":"包含3种类型：normal：常规underline ：下划线strikethrough ：删除线","!type":"string","!url":"http://store.deviceone.net/documents/do_Label/3.4.html#textFlag"},"maxWidth":{"!doc":"label的width为\"－1\"的时候，label会根据text内容自动适配变宽，但是不会宽于maxWidth","!type":"number","!url":"http://store.deviceone.net/documents/do_Label/3.4.html#maxWidth"}},"!url":""},"do_LinearLayout":{"!type":"fn()","prototype":{"add":{"!doc":"可以在LinearLayout控件内动态插入新的ui组件，新的ui组件的脚本环境和LinearLayout所在的环境是一致的","!type":"fn(id: string, path: string, target: string) -> string","!url":"http://store.deviceone.net/documents/do_LinearLayout/1.3.html#add"},"getChildren":{"!doc":"获取当前组件内所有第一层子view的id","!type":"fn() -> Node","!url":"http://store.deviceone.net/documents/do_LinearLayout/1.3.html#getChildren"},"padding":{"!doc":"0,0,0,0 分别表示上，右，下，左的内边距，通常只用于height和width为-1的情况","!type":"string","!url":"http://store.deviceone.net/documents/do_LinearLayout/1.3.html#padding"},"bgImageFillType":{"!doc":"背景图片填充方式，缺省为fillxy，win8不支持repeatxy方式：\r\nfillxy：拉伸图片（不按比例）以填充layout的宽高\r\nrepeatxy：按原图大小重复填充","!type":"string","!url":"http://store.deviceone.net/documents/do_LinearLayout/1.3.html#bgImageFillType"},"!proto":"!UI.prototype","bgImage":{"!doc":"可设置本地文件：支持data://和source://两种方式。文件格式说明参考Storage类","!type":"string","!url":"http://store.deviceone.net/documents/do_LinearLayout/1.3.html#bgImage"},"enabled":{"!doc":"缺省为'true'，如果enable为true，则Layout是可以点击的，touch事件才有意义，否则不可点击","!type":"bool","!url":"http://store.deviceone.net/documents/do_LinearLayout/1.3.html#enabled"},"direction":{"!doc":"支持2种方向布局，只允许设计器修改：\r\nhorizontal：横向布局\r\nvertical：纵向布局","!type":"string","!url":"http://store.deviceone.net/documents/do_LinearLayout/1.3.html#direction"}},"!url":""},"do_ListView":{"!type":"fn()","prototype":{"scrollToPosition":{"!doc":"","!type":"fn(position: number, isSmooth: bool)","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#scrollToPosition"},"isHeaderVisible":{"!doc":"缺省false不显示","!type":"bool","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#isHeaderVisible"},"isShowbar":{"!doc":"为true的时候，当listview内容超出listview的边界，会出现滚动条标识。","!type":"bool","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#isShowbar"},"showHeader":{"!doc":"当设置isHeaderVisible=true，自动显示HeaderView，并触发pull事件","!type":"fn()","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#showHeader"},"templates":{"!doc":"一个ListView可以有多个cell模板，这个属性是一个json array，每一个元素都是一个source ui文件。这个属性的格式类似如下： source://view/cell1.ui,source://view/cell2.ui,source://view/cell3.ui","!type":"string","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#templates"},"!proto":"!UI.prototype","selectedColor":{"!doc":"","!type":"string","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#selectedColor"},"refreshItems":{"!doc":"","!type":"fn()","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#refreshItems"},"footerView":{"!doc":"设置要显示的表头视图地址，不填但isFooterVisible为true时有缺省样式","!type":"string","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#footerView"},"headerView":{"!doc":"设置要显示的表头视图地址，不填但isHeaderVisible为true时有缺省样式","!type":"string","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#headerView"},"rebound":{"!doc":"headerview或footerview复位，通常下拉或上拉刷新后处理数据后需要调用这个方法恢复状态","!type":"fn()","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#rebound"},"isFooterVisible":{"!doc":"缺省false不显示","!type":"bool","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#isFooterVisible"},"bindItems":{"!doc":"可绑定listData实例","!type":"fn(data: Node)","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#bindItems"},"canScrollToTop":{"!doc":"属性设置成true时可以通过点击手机状态栏返回内容的顶部；仅支持iOS平台","!type":"bool","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#canScrollToTop"},"bounces":{"!doc":"只支持iOS平台，为false时没有上拉下拉的反弹效果","!type":"bool","!url":"http://store.deviceone.net/documents/do_ListView/6.4.html#bounces"}},"!url":""},"do_WebView":{"!type":"fn()","prototype":{"isHeaderVisible":{"!doc":"缺省false不显示","!type":"bool","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#isHeaderVisible"},"forward":{"!doc":"","!type":"fn()","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#forward"},"allowDeviceOne":{"!doc":"若想要WebView可以调用DeviceOne的函数，必须将该属性值设置为true，且在该页面的中将代码加到一个特定的函数window.onDeviceOneLoaded = function(){ //do something }方可","!type":"bool","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#allowDeviceOne"},"canForward":{"!doc":"","!type":"fn() -> bool","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#canForward"},"getContentSize":{"!doc":"获取当前加载页面真实内容的宽高，windows平台不支持","!type":"fn()","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#getContentSize"},"!proto":"!UI.prototype","back":{"!doc":"","!type":"fn()","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#back"},"setCookie":{"!doc":"设置浏览器的cookie","!type":"fn(url: string, value: string)","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#setCookie"},"userAgent":{"!doc":"设置浏览器的User-Agent","!type":"string","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#userAgent"},"zoom":{"!doc":"设置webview是否支持手势缩小放大，设置为true时支持","!type":"bool","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#zoom"},"canBack":{"!doc":"","!type":"fn() -> bool","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#canBack"},"allowVideoFullScreenPlayback":{"!doc":"为true时则播放HTML页面中视频时自动全屏，为false时则在播放的时候不改变原有视频窗口大小","!type":"bool","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#allowVideoFullScreenPlayback"},"headerView":{"!doc":"设置要显示的表头视图地址，不填但isHeaderVisible为true时有缺省样式","!type":"string","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#headerView"},"setDefaultEncodingURL":{"!doc":"设置是否对url默认按照utf-8编码格式转码，仅支持iOS平台","!type":"fn(isEncode: bool)","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#setDefaultEncodingURL"},"url":{"!doc":"支持http://,https://,支持source://,data://文件格式。文件格式的说明可以参考Storage类","!type":"string","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#url"},"isShowLoadingProgress":{"!doc":"webview的顶部有一个绿色进度条，显示加载网页的进度，缺省false不显示","!type":"bool","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#isShowLoadingProgress"},"rebound":{"!doc":"headerview复位","!type":"fn()","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#rebound"},"reload":{"!doc":"","!type":"fn()","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#reload"},"eval":{"!effects":["call !1 this=!this"],"!doc":"在WebView页面执行一段Javascript代码，并返回值","!type":"fn(code: string, f: fn(data: string, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#eval"},"stop":{"!doc":"","!type":"fn()","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#stop"},"loadString":{"!effects":["call !1 this=!this"],"!doc":"","!type":"fn(text: string, f: fn(data: , e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#loadString"},"bounces":{"!doc":"只支持iOS平台，为false时没有上拉下拉的反弹效果","!type":"bool","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#bounces"},"setLoadingProgressColor":{"!doc":"设置加载html页面时，组件顶部进度条的颜色","!type":"fn(color: string)","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#setLoadingProgressColor"},"cacheType":{"!doc":"改变WebView的缓存方式，缺省值为no_cache表示不使用缓存；为normal时根据cache-control决定是否获取新数据；windows平台不支持","!type":"string","!url":"http://store.deviceone.net/documents/do_WebView/2.3.html#cacheType"}},"!url":""},"do_ImageView":{"!type":"fn()","prototype":{"setBitmap":{"!doc":"","!type":"fn(bitmap: string)","!url":"http://store.deviceone.net/documents/do_ImageView/4.6.html#setBitmap"},"!proto":"!UI.prototype","scale":{"!doc":"图片显示类型，有以下几种方式,缺省为fillxy；fillxy：拉伸图片（不按比例）以填充View的宽高；center：按原图大小显示图片，但图片宽高大于View的宽高时，截图图片中间部分显示；fillxory：按比例放大原图直至等于某边View的宽高显示；centercrop：当图片大于组件时按图片中心点比例缩小图片，直到图片的宽高大于或等于ImageView组件的宽高时截取图片中间部分显示、当图片小于组件时按比例放大直到填充ImageView的宽或高","!type":"string","!url":"http://store.deviceone.net/documents/do_ImageView/4.6.html#scale"},"source":{"!doc":"可设置网络或本地文件，支持：http:// https:// data:// source:// 打头的URI格式，不能包含@符号。其中文件格式说明可参考Storage类","!type":"string","!url":"http://store.deviceone.net/documents/do_ImageView/4.6.html#source"},"radius":{"!doc":"像素值，为0时表示不是圆角图片；当同时设置了border属性，则radius属性失效","!type":"number","!url":"http://store.deviceone.net/documents/do_ImageView/4.6.html#radius"},"cacheType":{"!doc":"只有当imageview的source是http或者https的网络图片时，这个属性才有意义。支持三种缓存方式：；always：表示只读本地缓存，缓存没有的时候从远程读取一次然后就缓存到本地。；never：表示永远不读本地缓存，永远都是读远程图片。；temporay：表示每次打开这个imageview都会先读缓存的本地图片，然后再读服务器的网络图片，然后再缓存到本地,然后再更新到imageview","!type":"string","!url":"http://store.deviceone.net/documents/do_ImageView/4.6.html#cacheType"},"defaultImage":{"!doc":"支持data://和source://","!type":"string","!url":"http://store.deviceone.net/documents/do_ImageView/4.6.html#defaultImage"},"enabled":{"!doc":"缺省为\"false\".控制imageview是否可点击，如果enable为true，则imageview是可以点击的，否则不可点击。","!type":"bool","!url":"http://store.deviceone.net/documents/do_ImageView/4.6.html#enabled"},"animation":{"!doc":"加载图片时的动画效果，支持none没有动画效果和fade淡入淡出效果","!type":"string","!url":"http://store.deviceone.net/documents/do_ImageView/4.6.html#animation"}},"!url":""},"do_ALayout":{"!type":"fn()","prototype":{"add":{"!doc":"可以在ALayout控件内在用户指定的x,y坐标上动态插入新的ui组件，这个ui文件可以有自己的脚本代码，但是和这个ui的所在Page共享一个脚本环境。","!type":"fn(id: string, path: string, x: string, y: string) -> string","!url":"http://store.deviceone.net/documents/do_ALayout/1.2.html#add"},"getChildren":{"!doc":"获取当前组件内所有第一层子view的id","!type":"fn() -> Node","!url":"http://store.deviceone.net/documents/do_ALayout/1.2.html#getChildren"},"bgImageFillType":{"!doc":"背景图片填充方式，缺省为fillxy，win8不支持repeatxy方式。其中fillxy:表示无论图片大小，图片会自动拉伸平铺满整个layout；repeatxy:表示图片不会有任何自动拉伸，根据layout大小会重复很多个图片","!type":"string","!url":"http://store.deviceone.net/documents/do_ALayout/1.2.html#bgImageFillType"},"layoutAlign":{"!doc":"这个属性只有当isStretch为false的时候才有意义。正如isStretch属性描述，如果设计器设计的区域分辨率宽高比和运行的手机宽高比不一致的时候，通过设置isStretch为false可以确保ALayout比例不变形，但是有可能会有空白区域，这个属性就是设置这个空白区的停靠方式。总共有如下几种对齐方式：\r\n 'TopLeft'：'垂直居上，水平居左'\r\n'TopCenter'：'垂直居上，水平居中'\r\n'TopRight'：'垂直居上，水平居右'\r\n'MiddleLeft'：'垂直居中，水平居左'\r\n'MiddleCenter'：'垂直水平都居中'\r\n'MiddleRight'：'垂直居中，水平居右'\r\n'BottomLeft'：'垂直居下，水平居左'\r\n'BottomCenter'：'垂直居下，水平居中'\r\n'BottomRight'：'垂直居下，水平居右'","!type":"string","!url":"http://store.deviceone.net/documents/do_ALayout/1.2.html#layoutAlign"},"!proto":"!UI.prototype","bgImage":{"!doc":"设置layout的背景图片，支持data://和source://两种方式；文件格式说明参考Storage类","!type":"string","!url":"http://store.deviceone.net/documents/do_ALayout/1.2.html#bgImage"},"isStretch":{"!doc":"通常ALayout包括ALayout内的所有组件都是按照设计器里设计的分辨率映射到手机屏幕的分辨率，按比例缩放的。比如设计器设计一个ui缺省是320*480，如果在ALayout是100*100的正方形，最后安装到640*960分辨率的手机上会是一个200*200的正方形区域；但是安装到分辨率比例和设计器比例不一致的手机上，正方形会变形为长方形，比如手机分辨率为640*1024，则正方形会变成200*213的长方形，为了确保不变形，可以通过设置这个属性来控制。通常isStretch为true，表示缺省是自动平铺拉伸，如果改为false，则layout的优先考虑比例，会自动拉伸，但是会拉伸到铺满横向或者纵向。比如上面的例子，安装到分辨率是640*1024，如果设置isStretch为false的话，layout还会是200*200的正方形，但是layout的父容器会多出13左右的空白","!type":"bool","!url":"http://store.deviceone.net/documents/do_ALayout/1.2.html#isStretch"},"enabled":{"!doc":"缺省为true，如果enable为true，则ALayout是可以点击的，否则不可点击","!type":"bool","!url":"http://store.deviceone.net/documents/do_ALayout/1.2.html#enabled"}},"!url":""},"do_SlideView":{"!type":"fn()","prototype":{"stopLoop":{"!doc":"停止轮播","!type":"fn()","!url":"http://store.deviceone.net/documents/do_SlideView/5.5.html#stopLoop"},"looping":{"!doc":"左右无限循环滑动视图，设置值为true表示支持无限循环滑动，默认为false，windows不支持","!type":"bool","!url":"http://store.deviceone.net/documents/do_SlideView/5.5.html#looping"},"startLoop":{"!doc":"当looping属性为true时，轮播会从右至左按index顺序循环；当looping为false时，顺序轮播完所有index页后再逆序轮播","!type":"fn(interval: number)","!url":"http://store.deviceone.net/documents/do_SlideView/5.5.html#startLoop"},"templates":{"!doc":"可以设置一个或多个UI模板文件，值为String类型，多个模板之间分别用“,”分隔，例如：“source://view/temp/t0.ui,source://view/temp/t1.ui”","!type":"Node","!url":"http://store.deviceone.net/documents/do_SlideView/5.5.html#templates"},"isAllCache":{"!doc":"（不论设置成true和false，效果都为设置成true时一样）为true的时候每一条数据缓存一个View，对应的ui文件和js文件只会加载一次，对应的dataRefresh事件只会触发一次，以后不管如何左右滑动都不再加载和触发事件。如果数据不多，建议设置为true\r\n为false时，可以复用View，对应的ui和js可能在来回滑动SlideView的时候会加载多次，而datarefreshed事件每次滑动到这一页就会触发一次。如果需要不想保留每一个页的状态变化，另外需加载较多数据的时候，建议使用false","!type":"bool","!url":"http://store.deviceone.net/documents/do_SlideView/5.5.html#isAllCache"},"!proto":"!UI.prototype","bindItems":{"!doc":"绑定数据类型为do_ListData实例","!type":"fn(data: Node)","!url":"http://store.deviceone.net/documents/do_SlideView/5.5.html#bindItems"},"index":{"!doc":"设置滑动视图索引值，默认为0","!type":"number","!url":"http://store.deviceone.net/documents/do_SlideView/5.5.html#index"},"getView":{"!doc":"获取某个子view对应的ui文件RootView地址","!type":"fn(index: string) -> string","!url":"http://store.deviceone.net/documents/do_SlideView/5.5.html#getView"},"refreshItems":{"!doc":"支持动态刷新当前视图显示数据","!type":"fn()","!url":"http://store.deviceone.net/documents/do_SlideView/5.5.html#refreshItems"},"allowGesture":{"!doc":"当属性值为true时，组件可通过手势左右滑动来切换页面；为false时，手势无法滑动，只能通过修改index来切换页面","!type":"bool","!url":"http://store.deviceone.net/documents/do_SlideView/5.5.html#allowGesture"}},"!url":""},"do_TextField":{"!type":"fn()","prototype":{"textAlign":{"!doc":"对齐方式为以下3种：left 左对齐（默认）；center 居中；right 右对齐。","!type":"string","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#textAlign"},"!proto":"!UI.prototype","setFocus":{"!doc":"设置是否得到焦点，得到焦点时软键盘弹出，失去焦点时软键盘收起","!type":"fn(value: bool)","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#setFocus"},"clearImg":{"!doc":"不设置或该属性为空时会显示默认图片，默认为在文本框右侧的一个叉号标记；否则显示设置的图片，支持data://和source://目录；windows平台不支持","!type":"string","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#clearImg"},"fontStyle":{"!doc":"包含4种类型：normal：常规；bold：粗体；italic：斜体；bold_italic：粗斜体（iOS平台不支持）","!type":"string","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#fontStyle"},"clearAll":{"!doc":"默认值为false，设置成true时在文本框右侧显示一个叉号标记，点击叉号可以删除所有文本内容","!type":"bool","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#clearAll"},"enabled":{"!doc":"控制文本框是否为可编辑状态，为false时不可编辑","!type":"bool","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#enabled"},"cursorColor":{"!doc":"修改输入框光标颜色，暂只支持iOS平台","!type":"string","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#cursorColor"},"hintColor":{"!doc":"text为空时显示的文字提示信息字体颜色，windows平台不支持","!type":"string","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#hintColor"},"password":{"!doc":"默认值为false，设置为true时将输入的字符显示为**","!type":"bool","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#password"},"setSelection":{"!doc":"","!type":"fn(position: number)","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#setSelection"},"hint":{"!doc":"text为空时显示的文字提示信息","!type":"string","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#hint"},"fontSize":{"!doc":"字体大小","!type":"number","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#fontSize"},"inputType":{"!doc":"输入类型，不设置这个属性的时候会使用系统默认键盘支持所有字符，可设置的值包括以下5种:\n\t\r\n\"ASC\" ：支持ASCII的默认键盘\n\r\n\"PHONENUMBER\" ：标准电话键盘，支持＋＊＃字符\n\r\n\"URL\" ：URL键盘，支持.com按钮 只支持URL字符\n\t\t\r\n\"ENG\" :英文键盘\r\n\"DECIMAL\" :数字与小数点键盘（仅支持iOS平台）","!type":"string","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#inputType"},"text":{"!doc":"获取或设置与此控件关联的文本","!type":"string","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#text"},"enterText":{"!doc":"修改软键盘上按钮显示文字，有以下枚举值：go前往、send发送、next下一项、done完成、search搜索、default由inputType属性控制，与系统相同","!type":"string","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#enterText"},"fontColor":{"!doc":"设置字体显示颜色，值格式为：8位16进制字符，前6位是RGB颜色值，后两位是透明度（Alpha），例如：000000FF","!type":"string","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#fontColor"},"maxLength":{"!doc":"","!type":"number","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#maxLength"},"textFlag":{"!doc":"包含3种类型：\r\nnormal：常规\r\nunderline ：下划线\r\nstrikethrough ：删除线","!type":"string","!url":"http://store.deviceone.net/documents/do_TextField/5.5.html#textFlag"}},"!url":""},"do_ViewShower":{"!type":"fn()","prototype":{"removeView":{"!doc":"","!type":"fn(id: string)","!url":"http://store.deviceone.net/documents/do_ViewShower/2.1.html#removeView"},"!proto":"!UI.prototype","showView":{"!doc":"","!type":"fn(id: string, animationType: string, animationTime: number)","!url":"http://store.deviceone.net/documents/do_ViewShower/2.1.html#showView"},"getView":{"!doc":"获取某个子view对应的ui文件RootView地址","!type":"fn(id: string) -> string","!url":"http://store.deviceone.net/documents/do_ViewShower/2.1.html#getView"},"addViews":{"!doc":"","!type":"fn(data: Node)","!url":"http://store.deviceone.net/documents/do_ViewShower/2.1.html#addViews"}},"!url":""},"do_ScrollView":{"!type":"fn()","prototype":{"toBegin":{"!doc":"当前滚动视图是横向则滚动到最左边，如果是纵向则滚到最顶部","!type":"fn()","!url":"http://store.deviceone.net/documents/do_ScrollView/4.8.html#toBegin"},"rebound":{"!doc":"如顶部视图当前属于可见状态，则将其变为不可见，恢复到没有下拉滑动之前视图效果","!type":"fn()","!url":"http://store.deviceone.net/documents/do_ScrollView/4.8.html#rebound"},"isHeaderVisible":{"!doc":"设置是否显示顶部视图，只有滚动方向为纵向才有效，横向不支持；缺省false不显示","!type":"bool","!url":"http://store.deviceone.net/documents/do_ScrollView/4.8.html#isHeaderVisible"},"isShowbar":{"!doc":"为true的时候，当scrollview内内容超出scrollview的边界，会出现滚动条标识","!type":"bool","!url":"http://store.deviceone.net/documents/do_ScrollView/4.8.html#isShowbar"},"toEnd":{"!doc":"当前滚动视图是横向则滚动到最右边，如果是纵向则滚到最底部","!type":"fn()","!url":"http://store.deviceone.net/documents/do_ScrollView/4.8.html#toEnd"},"screenShot":{"!effects":["call !0 this=!this"],"!doc":"截取当前ScrollView中所有内容","!type":"fn(f: fn(data: string, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_ScrollView/4.8.html#screenShot"},"!proto":"!UI.prototype","canScrollToTop":{"!doc":"属性设置成true时可以通过点击手机状态栏返回内容的顶部；仅支持iOS平台","!type":"bool","!url":"http://store.deviceone.net/documents/do_ScrollView/4.8.html#canScrollToTop"},"headerView":{"!doc":"可自定义下拉滑动显示顶部视图效果，通常用于动态加载数据过程，下拉顶部自定义视图是一个UI模板文件，例如source://view/head.ui，只有滚动方向为纵向才有效，横向不支持","!type":"string","!url":"http://store.deviceone.net/documents/do_ScrollView/4.8.html#headerView"},"scrollTo":{"!doc":"滚动方向跟ScrollView的方向一致","!type":"fn(offset: number)","!url":"http://store.deviceone.net/documents/do_ScrollView/4.8.html#scrollTo"},"direction":{"!doc":"设置视图滚动方向值，支持两种类型：horizontal（横向）、vertical（纵向）","!type":"string","!url":"http://store.deviceone.net/documents/do_ScrollView/4.8.html#direction"}},"!url":""}},"!UI":{"!type":"fn()","prototype":{"border":{"!doc":"属性值格式有两种，一种是“颜色，宽度，圆角”，比如'FF9999FF,1,20'，其中这个属性如果为空，则没有border效果；另一种是“颜色，宽度，[左上圆角,右上圆角,右下圆角,左下圆角]”，可单独设置四个角的圆角效果；windows平台不支持；若该属性设置在ImageVIew上，则只支持四个角相同，否则只取第一个值作为四边的圆角","!type":"string","!url":"http://store.deviceone.net/Documents/Base/UI.html#border"},"margin":{"!doc":"和父容器（必须是LinearLayout）的上，右，下，左边距","!type":"string","!url":"http://store.deviceone.net/Documents/Base/UI.html#margin"},"set":{"!doc":"除了单独获取一个属性值外，可以通过这个方法获取一个UI组件的多个属性的属性值，比如<br /><br /><pre class=\"brush: js;toolbar:false;\">\n\tvar button = ui(\"btn_hello\");\n\tbutton.x = 100;\n\tbutton.height = 200;\n\tbutton.text = \"test\";\n\tvar feature_name = [ \"x\", \"height\", \"text\" ];\n\tvar feature_value = button.get(feature_name);\n\tdeviceone.print(JSON.stringify(feature_value));//打印出{\"x\":100,\"height\":200,\"text\":\"test\"}\n</pre>","!type":"fn(data: Node)","!url":"http://store.deviceone.net/Documents/Base/UI.html#set"},"visible":{"!doc":"","!type":"bool","!url":"http://store.deviceone.net/Documents/Base/UI.html#visible"},"setMapping":{"!doc":"bind方法可以指定mapping，而这个方法是设置缺省的映射关系，如果bind方法传递的mapping参数为空，则使用这个缺省的映射关系.详细的文档参考<a href=\"http://doc.deviceone.net/web/doc/detail_course/databind.htm\">数据绑定</a>","!type":"fn(data: Node)","!url":"http://store.deviceone.net/Documents/Base/UI.html#setMapping"},"show":{"!doc":"UI组件被加载后可通过show方法增加动画来显示，若UI组件已是显示状态，再调该方法没有动画效果，默认没有动画","!type":"fn(animationType: string, animationTime: number)","!url":"http://store.deviceone.net/Documents/Base/UI.html#show"},"!proto":"!Q.prototype","type":{"!doc":"不可修改，通过getType()方法获取","!type":"string","!url":"http://store.deviceone.net/Documents/Base/UI.html#type"},"animate":{"!effects":["call !1 this=!this"],"!doc":"每一个UI组件都支持一些属性变化的动画效果","!type":"fn(animation: string, f: fn(data: , e: ?)) -> !this","!url":"http://store.deviceone.net/Documents/Base/UI.html#animate"},"off":{"!doc":"取消订阅消息,所有MM对象可以订阅消息也可以取消订阅，<br />订阅可以重复，触发一次就会触发所有的订阅，取消订阅执行一次就把所有订阅都取消了。","!type":"fn(name: string)","!url":"http://store.deviceone.net/Documents/Base/UI.html#off"},"remove":{"!doc":"把自身从父容器中删除","!type":"fn()","!url":"http://store.deviceone.net/Documents/Base/UI.html#remove"},"redraw":{"!doc":"重画组件，当组件的x，y、width，height, visible或者margin修改的时候，需要调用自身的redraw方法才能生效。<br />还有一些组件在一些特殊情况下,比如添加，删除一个子View或修改了内容，都有可能需要调用redraw重画。<br />这样设计的好处在于，如果一个父View里面有多个子View，每个子View都做了这几个属性的修改，然后再调用父View的redraw方法，比每一个组件自动的重新绘制，可以节省很多重绘制的次数，提高效率。比如<br /><br /><pre class=\"brush: js;toolbar:false;\">\nvar child1 = ui(\"child_view_id1\");\nvar child2 = ui(\"child_view_id2\");\nvar child3 = ui(\"child_view_id3\");\nchild1.x = child1.x+10;\nchild2.width = 22;\nchild3.visible = false;\nparent.redraw();//parent是child1,child2,child3的父容器\n</pre>","!type":"fn()","!url":"http://store.deviceone.net/Documents/Base/UI.html#redraw"},"hide":{"!doc":"UI组件被加载后可通过show方法增加动画来隐藏，若UI组件已是隐藏状态，再调该方法没有动画效果；默认没有动画效果","!type":"fn(animationType: string, animationTime: number)","!url":"http://store.deviceone.net/Documents/Base/UI.html#hide"},"bgColor":{"!doc":"颜色值 8位16进制","!type":"string","!url":"http://store.deviceone.net/Documents/Base/UI.html#bgColor"},"get":{"!doc":"除了单独获取一个属性值外，可以通过这个方法获取一个UI组件的多个属性的属性值，比如<br /><br /><pre class=\"brush: js;toolbar:false;\">\n\tvar button = ui(\"btn_hello\");\n\tbutton.x = 100;\n\tbutton.height = 200;\n\tbutton.text = \"test\";\n\tvar feature_name = [ \"x\", \"height\", \"text\" ];\n\tvar feature_value = button.get(feature_name);\n\tdeviceone.print(JSON.stringify(feature_value));//打印出{\"x\":100,\"height\":200,\"text\":\"test\"}\n</pre>","!type":"fn(data: Node) -> Node","!url":"http://store.deviceone.net/Documents/Base/UI.html#get"},"alpha":{"!doc":"设置组件透明度，若组件为一个容器类组件，则里面所有子组件的透明度一起变化，范围为0~1；当跟bgColor的透明度冲突时以后设置的为准","!type":"number","!url":"http://store.deviceone.net/Documents/Base/UI.html#alpha"},"x":{"!doc":"基于父容器的x轴坐标位置","!type":"number","!url":"http://store.deviceone.net/Documents/Base/UI.html#x"},"width":{"!doc":"组件的宽度","!type":"string","!url":"http://store.deviceone.net/Documents/Base/UI.html#width"},"y":{"!doc":"基于父容器的y轴坐标位置","!type":"number","!url":"http://store.deviceone.net/Documents/Base/UI.html#y"},"id":{"!doc":"","!type":"string","!url":"http://store.deviceone.net/Documents/Base/UI.html#id"},"tag":{"!doc":"","!type":"string","!url":"http://store.deviceone.net/Documents/Base/UI.html#tag"},"getRect":{"!doc":"获取UI组件在设备上显示的矩形真实大小，包括x，y，width，height。这几个值和UI对应的x,y,width,height属性的值有可能不一致","!type":"fn() -> Node","!url":"http://store.deviceone.net/Documents/Base/UI.html#getRect"},"bindData":{"!doc":"利用HashData和ListData绑定对象到一个数据源，详细的文档参考<a href=\"http://doc.deviceone.net/web/doc/detail_course/databind.htm\">数据绑定</a> ","!type":"fn(data: string, mapping: Node)","!url":"http://store.deviceone.net/Documents/Base/UI.html#bindData"},"height":{"!doc":"组件的高度","!type":"string","!url":"http://store.deviceone.net/Documents/Base/UI.html#height"}},"!url":""},"Event":{},"SM":{"do_App":{"!type":"fn()","prototype":{"openPage":{"!effects":["call !8 this=!this"],"!doc":"在目前的Page基础上弹出新的Page，每一个Page都是扩充全屏，多个Page一级级覆盖，只有关闭了上层Page，才能看到下层Page","!type":"fn(source: string, data: string, animationType: string, keyboardMode: string, scriptType: string, statusBarState: string, statusBarFgColor: string, id: string, f: fn(data: , e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_App/1.3.html#openPage"},"closePageToID":{"!effects":["call !3 this=!this"],"!doc":"可以关闭指定页面，指定的id为openPage时定义的；上层Page关闭的时候会触发下层Page一个result事件，这个事件可以把数据传递到下层Page；当id为空时只关闭一层页面，id找不到时会报错","!type":"fn(data: string, animationType: string, id: string, f: fn(data: , e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_App/1.3.html#closePageToID"},"!proto":"!SM.prototype","update":{"!effects":["call !2 this=!this"],"!doc":"支持从data目录下拷贝一个目录或文件到source目录下并覆盖原目录或文件；若为更新data目录下页面，则仅需先替换要更新的页面，再掉一下update方法，不用带参数即可","!type":"fn(source: Node, target: string, f: fn(data: bool, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_App/1.3.html#update"},"closePage":{"!effects":["call !3 this=!this"],"!doc":"上层Page关闭的时候会触发下层Page一个result事件，这个事件可以把数据传递到下层Page","!type":"fn(data: string, animationType: string, layer: number, f: fn(data: , e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_App/1.3.html#closePage"},"getAppID":{"!doc":"应用内可以用多个App实例，这个id作为多个App区分的唯一标识。","!type":"fn() -> string","!url":"http://store.deviceone.net/documents/do_App/1.3.html#getAppID"}},"!url":""},"do_DataCache":{"!type":"fn()","prototype":{"removeAll":{"!doc":"","!type":"fn() -> bool","!url":"http://store.deviceone.net/documents/do_DataCache/2.3.html#removeAll"},"hasData":{"!doc":"判断是否有数据","!type":"fn(key: string) -> bool","!url":"http://store.deviceone.net/documents/do_DataCache/2.3.html#hasData"},"saveData":{"!doc":"把数据写入缓存","!type":"fn(key: string, value: string) -> bool","!url":"http://store.deviceone.net/documents/do_DataCache/2.3.html#saveData"},"!proto":"!SM.prototype","loadData":{"!doc":"把数据从缓存取出","!type":"fn(key: string) -> string","!url":"http://store.deviceone.net/documents/do_DataCache/2.3.html#loadData"},"removeData":{"!doc":"清楚某个key的数据","!type":"fn(key: string) -> bool","!url":"http://store.deviceone.net/documents/do_DataCache/2.3.html#removeData"}},"!url":""},"do_Storage":{"!type":"fn()","prototype":{"copyFile":{"!effects":["call !2 this=!this"],"!doc":"拷贝指定文件","!type":"fn(source: string, target: string, f: fn(data: bool, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_Storage/1.6.html#copyFile"},"deleteFile":{"!effects":["call !1 this=!this"],"!doc":"删除指定文件","!type":"fn(path: string, f: fn(data: bool, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_Storage/1.6.html#deleteFile"},"zip":{"!effects":["call !2 this=!this"],"!doc":"将指定的路径或文件压缩成zip文件","!type":"fn(source: string, target: string, f: fn(data: bool, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_Storage/1.6.html#zip"},"getDirs":{"!effects":["call !1 this=!this"],"!doc":"获取指定目录下所有目录列表","!type":"fn(path: string, f: fn(data: Node, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_Storage/1.6.html#getDirs"},"fileExist":{"!doc":"判断指定文件是否存在","!type":"fn(path: string) -> bool","!url":"http://store.deviceone.net/documents/do_Storage/1.6.html#fileExist"},"readFileSync":{"!doc":"获取指定文件的内容的同步方法；使用需谨慎，若读取的数据较多会导致UI卡顿","!type":"fn(path: string, isSecurity: bool, encoding: string) -> string","!url":"http://store.deviceone.net/documents/do_Storage/1.6.html#readFileSync"},"!proto":"!SM.prototype","unzip":{"!effects":["call !2 this=!this"],"!doc":"将指定的zip文件解压到指定的路径","!type":"fn(source: string, target: string, f: fn(data: bool, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_Storage/1.6.html#unzip"},"getFiles":{"!effects":["call !1 this=!this"],"!doc":"获取指定目录下所有文件列表","!type":"fn(path: string, f: fn(data: Node, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_Storage/1.6.html#getFiles"},"getFileSize":{"!doc":"获取指定文件的大小","!type":"fn(path: string) -> string","!url":"http://store.deviceone.net/documents/do_Storage/1.6.html#getFileSize"},"readFile":{"!effects":["call !3 this=!this"],"!doc":"获取指定文件的内容","!type":"fn(path: string, isSecurity: bool, encoding: string, f: fn(data: string, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_Storage/1.6.html#readFile"},"dirExist":{"!doc":"判断指定目录是否存在","!type":"fn(path: string) -> bool","!url":"http://store.deviceone.net/documents/do_Storage/1.6.html#dirExist"},"copy":{"!effects":["call !2 this=!this"],"!doc":"将指定的一个或多个文件拷贝到一个目录下","!type":"fn(source: Node, target: string, f: fn(data: bool, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_Storage/1.6.html#copy"},"deleteDir":{"!effects":["call !1 this=!this"],"!doc":"删除指定目录以及这个目录下所有目录和文件，","!type":"fn(path: string, f: fn(data: bool, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_Storage/1.6.html#deleteDir"},"writeFile":{"!effects":["call !4 this=!this"],"!doc":"把指定字符串写入指定文件，完全覆盖","!type":"fn(path: string, data: string, isSecurity: bool, encoding: string, f: fn(data: bool, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_Storage/1.6.html#writeFile"},"zipFiles":{"!effects":["call !2 this=!this"],"!doc":"将指定的一个或多个文件压缩成zip文件","!type":"fn(source: Node, target: string, f: fn(data: bool, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_Storage/1.6.html#zipFiles"}},"!url":""},"do_InitData":{"!type":"fn()","prototype":{"copyFile":{"!effects":["call !2 this=!this"],"!doc":"拷贝指定文件","!type":"fn(source: string, target: string, f: fn(data: bool, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_InitData/1.1.html#copyFile"},"zip":{"!effects":["call !2 this=!this"],"!doc":"将指定的路径或文件压缩成zip文件","!type":"fn(source: string, target: string, f: fn(data: bool, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_InitData/1.1.html#zip"},"getDirs":{"!effects":["call !1 this=!this"],"!doc":"获取指定目录下所有目录列表","!type":"fn(path: string, f: fn(data: Node, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_InitData/1.1.html#getDirs"},"fileExist":{"!doc":"判断指定文件是否存在","!type":"fn(path: string) -> bool","!url":"http://store.deviceone.net/documents/do_InitData/1.1.html#fileExist"},"readFileSync":{"!doc":"获取指定文件的内容的同步方法；使用需谨慎，若读取的数据较多会导致UI卡顿","!type":"fn(path: string) -> string","!url":"http://store.deviceone.net/documents/do_InitData/1.1.html#readFileSync"},"readFile":{"!effects":["call !1 this=!this"],"!doc":"获取指定文件的内容","!type":"fn(path: string, f: fn(data: string, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_InitData/1.1.html#readFile"},"!proto":"!SM.prototype","dirExist":{"!doc":"判断指定目录是否存在","!type":"fn(path: string) -> bool","!url":"http://store.deviceone.net/documents/do_InitData/1.1.html#dirExist"},"copy":{"!effects":["call !2 this=!this"],"!doc":"将指定的一个或多个文件拷贝到一个目录下","!type":"fn(source: Node, target: string, f: fn(data: bool, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_InitData/1.1.html#copy"},"unzip":{"!effects":["call !2 this=!this"],"!doc":"将指定的zip文件解压到指定的路径","!type":"fn(source: string, target: string, f: fn(data: bool, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_InitData/1.1.html#unzip"},"getFiles":{"!effects":["call !1 this=!this"],"!doc":"获取指定目录下所有文件列表","!type":"fn(path: string, f: fn(data: Node, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_InitData/1.1.html#getFiles"},"zipFiles":{"!effects":["call !2 this=!this"],"!doc":"将指定的一个或多个文件压缩成zip文件","!type":"fn(source: Node, target: string, f: fn(data: bool, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_InitData/1.1.html#zipFiles"}},"!url":""},"do_Algorithm":{"!type":"fn()","prototype":{"sha1":{"!effects":["call !2 this=!this"],"!doc":"主要适用于数字签名标准","!type":"fn(type: string, value: string, f: fn(data: string, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_Algorithm/2.1.html#sha1"},"xml2Json":{"!effects":["call !1 this=!this"],"!doc":"把xml格式转换成标准Json格式","!type":"fn(source: string, f: fn(data: string, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_Algorithm/2.1.html#xml2Json"},"des3Sync":{"!doc":"windows平台不支持","!type":"fn(key: string, type: string, source: string) -> string","!url":"http://store.deviceone.net/documents/do_Algorithm/2.1.html#des3Sync"},"md5Sync":{"!doc":"同步md5算法，只支持字符串的处理","!type":"fn(value: string) -> string","!url":"http://store.deviceone.net/documents/do_Algorithm/2.1.html#md5Sync"},"base64":{"!effects":["call !3 this=!this"],"!doc":"","!type":"fn(type: string, sourceType: string, source: string, f: fn(data: string, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_Algorithm/2.1.html#base64"},"!proto":"!SM.prototype","base64Sync":{"!doc":"同步的Base64算法，只支持字符串的处理","!type":"fn(type: string, source: string) -> string","!url":"http://store.deviceone.net/documents/do_Algorithm/2.1.html#base64Sync"},"hex2Binary":{"!effects":["call !2 this=!this"],"!doc":"把十六进制数据转换成二进制并保存成文件放在指定目录下","!type":"fn(source: string, path: string, f: fn(data: bool, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_Algorithm/2.1.html#hex2Binary"},"hex2Str":{"!effects":["call !2 this=!this"],"!doc":"把十六进制数据按特定编码格式转成字符串","!type":"fn(source: string, encoding: string, f: fn(data: string, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_Algorithm/2.1.html#hex2Str"},"sha1Sync":{"!doc":"主要适用于数字签名标准","!type":"fn(type: string, value: string) -> string","!url":"http://store.deviceone.net/documents/do_Algorithm/2.1.html#sha1Sync"},"des3":{"!effects":["call !3 this=!this"],"!doc":"","!type":"fn(key: string, type: string, source: string, f: fn(data: string, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_Algorithm/2.1.html#des3"},"md5":{"!effects":["call !2 this=!this"],"!doc":"","!type":"fn(type: string, value: string, f: fn(data: string, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_Algorithm/2.1.html#md5"}},"!url":""},"do_Notification":{"!type":"fn()","prototype":{"confirm":{"!effects":["call !4 this=!this"],"!doc":"confirm窗口有2个按钮，可以自定义按钮的文本内容","!type":"fn(text: string, title: string, button1text: string, button2text: string, f: fn(data: number, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_Notification/3.2.html#confirm"},"toast":{"!doc":"支持类似Android的toast的方式，弹出一个提示框，但是很短时间内会自动消隐，x和y都不赋值，即显示默认位置","!type":"fn(text: string, x: number, y: number)","!url":"http://store.deviceone.net/documents/do_Notification/3.2.html#toast"},"alert":{"!effects":["call !2 this=!this"],"!doc":"通过alert来提示用户，alert是模态的，只有一个确定按钮","!type":"fn(text: string, title: string, f: fn(data: , e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_Notification/3.2.html#alert"},"!proto":"!SM.prototype"},"!url":""},"do_Page":{"!type":"fn()","prototype":{"hideKeyboard":{"!doc":"找到当前page是否有键盘弹出，然后把焦点释放，键盘隐藏","!type":"fn()","!url":"http://store.deviceone.net/documents/do_Page/1.3.html#hideKeyboard"},"!proto":"!SM.prototype","getData":{"!doc":"弹出新的page，通过data来传递数据。","!type":"fn() -> string","!url":"http://store.deviceone.net/documents/do_Page/1.3.html#getData"},"remove":{"!doc":"删除Page里一个子UI","!type":"fn(id: string)","!url":"http://store.deviceone.net/documents/do_Page/1.3.html#remove"},"supportPanClosePage":{"!doc":"可通过从左往右滑动手势关闭页面，并从当前页面传递data给下层页面，仅支持iOS平台","!type":"fn(data: string, support: bool)","!url":"http://store.deviceone.net/documents/do_Page/1.3.html#supportPanClosePage"}},"!url":""},"do_Global":{"!type":"fn()","prototype":{"getFromPasteboard":{"!doc":"从系统的粘帖板里获取内容","!type":"fn() -> string","!url":"http://store.deviceone.net/documents/do_Global/1.4.html#getFromPasteboard"},"getVersion":{"!doc":"原生应用安装包的版本，可以通过云打包的过程中设置。通常要实现安装包升级需要调用这个方法，通过比较当前应用的版本和远程服务上最新应用安装包的版本来确定是否需要提示用户升级安装包","!type":"fn() -> Node","!url":"http://store.deviceone.net/documents/do_Global/1.4.html#getVersion"},"exit":{"!doc":"直接kill进程，退出程序","!type":"fn()","!url":"http://store.deviceone.net/documents/do_Global/1.4.html#exit"},"setToPasteboard":{"!doc":"拷贝一个字符串到系统的粘贴板共享给其它程序","!type":"fn(data: string) -> bool","!url":"http://store.deviceone.net/documents/do_Global/1.4.html#setToPasteboard"},"getSignatureInfo":{"!doc":"获取签名证书信息，仅支持Android平台","!type":"fn() -> Node","!url":"http://store.deviceone.net/documents/do_Global/1.4.html#getSignatureInfo"},"install":{"!effects":["call !1 this=!this"],"!doc":"DeviceOne提供了程序内升级的功能，也就是不需要升级安装包就能升级业务代码和数据。通常升级包的目录结构必须和build.do文件解开后的目录结构一致，build.do实际上一个zip文件，是通过设计器的“Build Local Package”功能生成的文件，但是升级包只包含变化的文件，最后把升级包压缩成zip文件，再把升级包部署在网络服务上。通过http获取别的方式把升级包下载到我们的data目录下，然后再调用这个install方法，这个方法会解压升级包zip文件到系统目录的升级目录。重启程序，程序每次启动会检查这个升级目录，发现里面有文件就会自动拷贝内容到对应的目录从而实现程序内升级功能","!type":"fn(src: string, f: fn(data: bool, e: ?)) -> !this","!url":"http://store.deviceone.net/documents/do_Global/1.4.html#install"},"getTime":{"!doc":"根据用户传递的时间foramt返回格式化的时间。请使用标准的时间格式标记。","!type":"fn(format: string) -> string","!url":"http://store.deviceone.net/documents/do_Global/1.4.html#getTime"},"!proto":"!SM.prototype","setMemory":{"!doc":"设置全局变量值，整个应用程序全局的内存共享，在程序的任何位置都可以通过set Memory方法来设置共享数据。如有已经有这个变量名，会覆盖旧的变量值","!type":"fn(key: string, value: string)","!url":"http://store.deviceone.net/documents/do_Global/1.4.html#setMemory"},"getMemory":{"!doc":"获取全局变量值，整个应用程序全局的内存共享，在程序的任何位置都可以通过get Memory方法来获取共享数据","!type":"fn(key: string) -> string","!url":"http://store.deviceone.net/documents/do_Global/1.4.html#getMemory"},"getWakeupID":{"!doc":"应用可以被其它应用启动，这个唤醒ID可以在云打包中配置。这个值需要告诉其它第三方应用，让其它应用通过这个唤醒ID来启动我们自己的的应用。同时我们如果知道其它移动应用的唤醒ID，也可以通过我们的External类来启动其他应用","!type":"fn() -> string","!url":"http://store.deviceone.net/documents/do_Global/1.4.html#getWakeupID"}},"!url":""}},"!SM":{"!type":"fn()","prototype":{"!proto":"!E.prototype"},"!url":""},"Module":{"!type":"fn()","prototype":{"loaded":{"!doc":"","!type":"bool","!url":""},"parent":{"!doc":"","!type":"+Module","!url":""},"filename":{"!doc":"","!type":"string","!url":""},"children":{"!doc":"","!type":"[+Module]","!url":""},"exports":{"!doc":"","!type":"?","!url":""},"require":{"!doc":"","!type":"require","!url":""},"id":{"!doc":"","!type":"string","!url":""}}}}}});