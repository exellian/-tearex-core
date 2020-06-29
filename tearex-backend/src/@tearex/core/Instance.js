"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instance = void 0;
var internal_1 = require("@tearex/internal");
var _1 = require(".");
var Instance = /** @class */ (function () {
    function Instance(container) {
        this.injector = new internal_1.Injector();
        this.routes = new Map();
        this.init(container);
        this.validator = new internal_1.Validator(this.injector, container.getValidations());
    }
    Instance.prototype.init = function (container) {
        var e_1, _a, e_2, _b, e_3, _c, e_4, _d, e_5, _e, e_6, _f, e_7, _g, e_8, _h, e_9, _j, e_10, _k, e_11, _l, e_12, _m, e_13, _o, e_14, _p;
        try {
            /**
            * Checking if every intercept is at least registered as one route or control
            * and if every specified interceptor class exists
            */
            for (var _q = __values(container.getIntercepts().entries()), _r = _q.next(); !_r.done; _r = _q.next()) {
                var intercepts = _r.value;
                var controls = container.getControls().get(intercepts[0]);
                var routes = container.getRoutes().get(intercepts[0]);
                if (controls === undefined && routes === undefined) {
                    throw _1.error(intercepts[0], undefined, _1.TeapotError.INTERCEPT_MISSING_CONTROL_OR_ROUTE);
                }
                try {
                    for (var _s = (e_2 = void 0, __values(intercepts[1].getMethods().entries())), _t = _s.next(); !_t.done; _t = _s.next()) {
                        var metadata = _t.value;
                        var b0 = false;
                        var b1 = false;
                        if (controls !== undefined) {
                            b0 = controls.getMethods().has(metadata[0]);
                            //if (controls.getMethods().has(metadata[0])) {
                            //throw new Error(TeapotError.INTERCEPT_METHOD_GLOBAL_OVERRRIDE_NOT_SUPPORTED);
                            //}
                        }
                        if (routes !== undefined) {
                            b1 = routes.getMethods().has(metadata[0]);
                        }
                        if (b0 === b1) {
                            throw _1.error(intercepts[0], metadata[0], _1.TeapotError.INTERCEPT_MISSING_CONTROL_OR_ROUTE);
                        }
                        try {
                            /*
                            if (!b1) {
                                throw new Error(TeapotError.INTERCEPT_MISSING_CONTROL_OR_ROUTE);
                            }*/
                            for (var _u = (e_3 = void 0, __values(metadata[1])), _v = _u.next(); !_v.done; _v = _u.next()) {
                                var interceptor = _v.value;
                                if (!container.getInterceptors().has(interceptor)) {
                                    throw _1.error(intercepts[0], metadata[0], _1.TeapotError.INTERCEPTOR_NOT_FOUND);
                                }
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (_v && !_v.done && (_c = _u.return)) _c.call(_u);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_t && !_t.done && (_b = _s.return)) _b.call(_s);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_r && !_r.done && (_a = _q.return)) _a.call(_q);
            }
            finally { if (e_1) throw e_1.error; }
        }
        /**
        * Check for every sub controller that the controller exists
        * and searching for root controllers and checking
        * for circles in the controller structure
        */
        var rootControllerNames = new Map();
        try {
            for (var _w = __values(container.getControllers().entries()), _x = _w.next(); !_x.done; _x = _w.next()) {
                var controllers = _x.value;
                rootControllerNames.set(controllers[0], undefined);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_x && !_x.done && (_d = _w.return)) _d.call(_w);
            }
            finally { if (e_4) throw e_4.error; }
        }
        try {
            for (var _y = __values(container.getControls().entries()), _z = _y.next(); !_z.done; _z = _y.next()) {
                var controls = _z.value;
                if (!Instance.checkControls(container, controls[0], [])) {
                    throw _1.error(controls[0], undefined, _1.TeapotError.CIRCULAR_CONTROLLER_HIERACHY);
                }
                try {
                    for (var _0 = (e_6 = void 0, __values(controls[1].getMethods())), _2 = _0.next(); !_2.done; _2 = _0.next()) {
                        var metadata = _2.value;
                        if (controls[0] === metadata[1]) {
                            throw _1.error(controls[0], metadata[0], _1.TeapotError.CIRCULAR_CONTROLLER_HIERACHY);
                        }
                        if (!container.getControllers().has(metadata[1])) {
                            throw _1.error(controls[0], metadata[0], _1.TeapotError.CONTROLLER_NOT_FOUND);
                        }
                        rootControllerNames.delete(metadata[1]);
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (_2 && !_2.done && (_f = _0.return)) _f.call(_0);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_z && !_z.done && (_e = _y.return)) _e.call(_y);
            }
            finally { if (e_5) throw e_5.error; }
        }
        try {
            /**
            * Checking for all validation if the validator exists
            */
            for (var _3 = __values(container.getValidations().entries()), _4 = _3.next(); !_4.done; _4 = _3.next()) {
                var validaton = _4.value;
                try {
                    for (var _5 = (e_8 = void 0, __values(validaton[1].entries())), _6 = _5.next(); !_6.done; _6 = _5.next()) {
                        var methodValidations = _6.value;
                        try {
                            for (var _7 = (e_9 = void 0, __values(methodValidations[1])), _8 = _7.next(); !_8.done; _8 = _7.next()) {
                                var validator = _8.value;
                                if (!container.getValidators().has(validator)) {
                                    throw _1.error(validaton[0], methodValidations[0], _1.TeapotError.VALIDATOR_NOT_FOUND);
                                }
                            }
                        }
                        catch (e_9_1) { e_9 = { error: e_9_1 }; }
                        finally {
                            try {
                                if (_8 && !_8.done && (_j = _7.return)) _j.call(_7);
                            }
                            finally { if (e_9) throw e_9.error; }
                        }
                    }
                }
                catch (e_8_1) { e_8 = { error: e_8_1 }; }
                finally {
                    try {
                        if (_6 && !_6.done && (_h = _5.return)) _h.call(_5);
                    }
                    finally { if (e_8) throw e_8.error; }
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_4 && !_4.done && (_g = _3.return)) _g.call(_3);
            }
            finally { if (e_7) throw e_7.error; }
        }
        try {
            /**
            * Registering all controllers
            */
            for (var _9 = __values(container.getControllers().entries()), _10 = _9.next(); !_10.done; _10 = _9.next()) {
                var controllers = _10.value;
                this.injector.registerSealed(controllers[1]);
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (_10 && !_10.done && (_k = _9.return)) _k.call(_9);
            }
            finally { if (e_10) throw e_10.error; }
        }
        try {
            /**
            * Registering all interceptors
            */
            for (var _11 = __values(container.getInterceptors().entries()), _12 = _11.next(); !_12.done; _12 = _11.next()) {
                var interceptor = _12.value;
                this.injector.register(interceptor[1]);
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (_12 && !_12.done && (_l = _11.return)) _l.call(_11);
            }
            finally { if (e_11) throw e_11.error; }
        }
        try {
            /**
            * Registering all services
            */
            for (var _13 = __values(container.getServices().entries()), _14 = _13.next(); !_14.done; _14 = _13.next()) {
                var services = _14.value;
                this.injector.register(services[1]);
            }
        }
        catch (e_12_1) { e_12 = { error: e_12_1 }; }
        finally {
            try {
                if (_14 && !_14.done && (_m = _13.return)) _m.call(_13);
            }
            finally { if (e_12) throw e_12.error; }
        }
        try {
            /**
            * Registering all validators
            */
            for (var _15 = __values(container.getValidators().entries()), _16 = _15.next(); !_16.done; _16 = _15.next()) {
                var validator = _16.value;
                this.injector.register(validator[1]);
            }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (_16 && !_16.done && (_o = _15.return)) _o.call(_15);
            }
            finally { if (e_13) throw e_13.error; }
        }
        try {
            /**
            * Finally building the uri tree for every root component and adding intercepts if exist
            */
            for (var _17 = __values(rootControllerNames.keys()), _18 = _17.next(); !_18.done; _18 = _17.next()) {
                var controllerName = _18.value;
                this.initRoutesAndInterceptors(container, controllerName, "", []);
            }
        }
        catch (e_14_1) { e_14 = { error: e_14_1 }; }
        finally {
            try {
                if (_18 && !_18.done && (_p = _17.return)) _p.call(_17);
            }
            finally { if (e_14) throw e_14.error; }
        }
    };
    Instance.prototype.initRoutesAndInterceptors = function (container, controllerName, path, globalInterceptors) {
        var e_15, _a, e_16, _b, e_17, _c, e_18, _d, e_19, _e;
        var _this = this;
        var controller = undefined;
        var controls = container.getControls().get(controllerName);
        var interceptors = container.getIntercepts().get(controllerName);
        var routes = container.getRoutes().get(controllerName);
        if (routes === undefined) {
            return;
        }
        var _loop_1 = function (route) {
            var e_20, _a, e_21, _b, e_22, _c, e_23, _d;
            /**
            * Get interceptor
            */
            var interceptorsPerRoute = [];
            if (interceptors !== undefined) {
                var interceptorNames = interceptors.getMethods().get(route[0]);
                if (interceptorNames !== undefined) {
                    try {
                        for (var interceptorNames_3 = (e_20 = void 0, __values(interceptorNames)), interceptorNames_3_1 = interceptorNames_3.next(); !interceptorNames_3_1.done; interceptorNames_3_1 = interceptorNames_3.next()) {
                            var name_1 = interceptorNames_3_1.value;
                            try {
                                for (var globalInterceptors_2 = (e_21 = void 0, __values(globalInterceptors)), globalInterceptors_2_1 = globalInterceptors_2.next(); !globalInterceptors_2_1.done; globalInterceptors_2_1 = globalInterceptors_2.next()) {
                                    var global_1 = globalInterceptors_2_1.value;
                                    if (global_1.object.constructor.name === name_1) {
                                        throw _1.error(controllerName, route[0], _1.TeapotError.INTERCEPT_METHOD_GLOBAL_OVERRRIDE);
                                    }
                                }
                            }
                            catch (e_21_1) { e_21 = { error: e_21_1 }; }
                            finally {
                                try {
                                    if (globalInterceptors_2_1 && !globalInterceptors_2_1.done && (_b = globalInterceptors_2.return)) _b.call(globalInterceptors_2);
                                }
                                finally { if (e_21) throw e_21.error; }
                            }
                        }
                    }
                    catch (e_20_1) { e_20 = { error: e_20_1 }; }
                    finally {
                        try {
                            if (interceptorNames_3_1 && !interceptorNames_3_1.done && (_a = interceptorNames_3.return)) _a.call(interceptorNames_3);
                        }
                        finally { if (e_20) throw e_20.error; }
                    }
                    try {
                        for (var interceptorNames_4 = (e_22 = void 0, __values(interceptorNames)), interceptorNames_4_1 = interceptorNames_4.next(); !interceptorNames_4_1.done; interceptorNames_4_1 = interceptorNames_4.next()) {
                            var name_2 = interceptorNames_4_1.value;
                            var interceptor = this_1.injector.getLinkInstance(name_2);
                            interceptorsPerRoute.push(interceptor);
                        }
                    }
                    catch (e_22_1) { e_22 = { error: e_22_1 }; }
                    finally {
                        try {
                            if (interceptorNames_4_1 && !interceptorNames_4_1.done && (_c = interceptorNames_4.return)) _c.call(interceptorNames_4);
                        }
                        finally { if (e_22) throw e_22.error; }
                    }
                }
            }
            /**
            * Get controller
            */
            if (controller === undefined) {
                controller = this_1.injector.getLinkInstance(controllerName);
            }
            if (controller.cache === undefined) {
                controller.cache = new Map();
                this_1.injector.setCache(controllerName, controller.cache);
            }
            var controllerCache = controller.cache;
            var routeParameterConstructors = controllerCache.get(route[0]);
            if (routeParameterConstructors === undefined) {
                routeParameterConstructors = Instance.getParameterConstructors(routes.getObject(), route[0], false);
                controllerCache.set(route[0], routeParameterConstructors);
            }
            try {
                for (var _e = (e_23 = void 0, __values(route[1])), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var httpMethod = _f.value;
                    var handlers = this_1.routes.get(httpMethod);
                    if (handlers === undefined) {
                        handlers = new Map();
                        this_1.routes.set(httpMethod, handlers);
                    }
                    var handler = function (buffer, headers, client) {
                        var intercepts = globalInterceptors.concat(interceptorsPerRoute);
                        Instance.intercept(buffer, headers, client, intercepts, function () {
                            _this.injectNormal(0, [], buffer, headers, client, routeParameterConstructors, function (params) {
                                var _a;
                                (_a = controller.object)[route[0]].apply(_a, __spread(params));
                            });
                        });
                    };
                    if (route[0] !== "index") {
                        handlers.set(path + "/" + route[0], handler);
                    }
                    else {
                        handlers.set(path, handler);
                        handlers.set(path + "/", handler);
                    }
                }
            }
            catch (e_23_1) { e_23 = { error: e_23_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                }
                finally { if (e_23) throw e_23.error; }
            }
        };
        var this_1 = this;
        try {
            /**
            * Setup normal routes
            */
            for (var _f = __values(routes.getMethods().entries()), _g = _f.next(); !_g.done; _g = _f.next()) {
                var route = _g.value;
                _loop_1(route);
            }
        }
        catch (e_15_1) { e_15 = { error: e_15_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_a = _f.return)) _a.call(_f);
            }
            finally { if (e_15) throw e_15.error; }
        }
        /**
        * Setup sub controllers
        */
        if (controls === undefined) {
            return;
        }
        try {
            for (var _h = __values(controls.getMethods().entries()), _j = _h.next(); !_j.done; _j = _h.next()) {
                var control = _j.value;
                var controlInterceptors = [];
                if (interceptors !== undefined) {
                    var interceptorNames = interceptors.getMethods().get(control[0]);
                    if (interceptorNames !== undefined) {
                        try {
                            for (var interceptorNames_1 = (e_17 = void 0, __values(interceptorNames)), interceptorNames_1_1 = interceptorNames_1.next(); !interceptorNames_1_1.done; interceptorNames_1_1 = interceptorNames_1.next()) {
                                var name_3 = interceptorNames_1_1.value;
                                try {
                                    for (var globalInterceptors_1 = (e_18 = void 0, __values(globalInterceptors)), globalInterceptors_1_1 = globalInterceptors_1.next(); !globalInterceptors_1_1.done; globalInterceptors_1_1 = globalInterceptors_1.next()) {
                                        var global_2 = globalInterceptors_1_1.value;
                                        if (global_2.object.constructor.name === name_3) {
                                            throw _1.error(controllerName, control[0], _1.TeapotError.INTERCEPT_METHOD_GLOBAL_OVERRRIDE);
                                        }
                                    }
                                }
                                catch (e_18_1) { e_18 = { error: e_18_1 }; }
                                finally {
                                    try {
                                        if (globalInterceptors_1_1 && !globalInterceptors_1_1.done && (_d = globalInterceptors_1.return)) _d.call(globalInterceptors_1);
                                    }
                                    finally { if (e_18) throw e_18.error; }
                                }
                            }
                        }
                        catch (e_17_1) { e_17 = { error: e_17_1 }; }
                        finally {
                            try {
                                if (interceptorNames_1_1 && !interceptorNames_1_1.done && (_c = interceptorNames_1.return)) _c.call(interceptorNames_1);
                            }
                            finally { if (e_17) throw e_17.error; }
                        }
                        try {
                            for (var interceptorNames_2 = (e_19 = void 0, __values(interceptorNames)), interceptorNames_2_1 = interceptorNames_2.next(); !interceptorNames_2_1.done; interceptorNames_2_1 = interceptorNames_2.next()) {
                                var name_4 = interceptorNames_2_1.value;
                                var interceptor = this.injector.getLinkInstance(name_4);
                                controlInterceptors.push(interceptor);
                            }
                        }
                        catch (e_19_1) { e_19 = { error: e_19_1 }; }
                        finally {
                            try {
                                if (interceptorNames_2_1 && !interceptorNames_2_1.done && (_e = interceptorNames_2.return)) _e.call(interceptorNames_2);
                            }
                            finally { if (e_19) throw e_19.error; }
                        }
                    }
                }
                this.initRoutesAndInterceptors(container, control[1], path + "/" + control[0], globalInterceptors.concat(controlInterceptors));
            }
        }
        catch (e_16_1) { e_16 = { error: e_16_1 }; }
        finally {
            try {
                if (_j && !_j.done && (_b = _h.return)) _b.call(_h);
            }
            finally { if (e_16) throw e_16.error; }
        }
    };
    Instance.checkControls = function (container, controllerName, hierarchy) {
        var e_24, _a, e_25, _b;
        var _c;
        var controls = (_c = container.getControls().get(controllerName)) === null || _c === void 0 ? void 0 : _c.getMethods().values();
        if (controls === undefined) {
            return true;
        }
        var ret = true;
        try {
            for (var controls_1 = __values(controls), controls_1_1 = controls_1.next(); !controls_1_1.done; controls_1_1 = controls_1.next()) {
                var control = controls_1_1.value;
                try {
                    for (var hierarchy_1 = (e_25 = void 0, __values(hierarchy)), hierarchy_1_1 = hierarchy_1.next(); !hierarchy_1_1.done; hierarchy_1_1 = hierarchy_1.next()) {
                        var before = hierarchy_1_1.value;
                        if (before === control) {
                            return false;
                        }
                    }
                }
                catch (e_25_1) { e_25 = { error: e_25_1 }; }
                finally {
                    try {
                        if (hierarchy_1_1 && !hierarchy_1_1.done && (_b = hierarchy_1.return)) _b.call(hierarchy_1);
                    }
                    finally { if (e_25) throw e_25.error; }
                }
                var controlHierachy = __spread(hierarchy);
                controlHierachy.push(control);
                ret = Instance.checkControls(container, control, controlHierachy);
            }
        }
        catch (e_24_1) { e_24 = { error: e_24_1 }; }
        finally {
            try {
                if (controls_1_1 && !controls_1_1.done && (_a = controls_1.return)) _a.call(controls_1);
            }
            finally { if (e_24) throw e_24.error; }
        }
        return ret;
    };
    Instance.getParameterConstructors = function (object, key, subcontroller) {
        var types = Reflect.getMetadata("design:paramtypes", object, key);
        var constructors = [];
        if (types === undefined) {
            return constructors;
        }
        var headers = false;
        var client = false;
        var other = false;
        for (var i = 0; i < types.length; i++) {
            var typeConstructor = types[i]();
            var t = typeConstructor.name;
            if (t === "HttpHeaders") {
                if (headers) {
                    throw _1.error(object.constructor.name, key, _1.TeapotError.METHOD_FORM_INVALID);
                }
                headers = true;
            }
            else if (t === "Client") {
                if (client) {
                    throw _1.error(object.constructor.name, key, _1.TeapotError.METHOD_FORM_INVALID);
                }
                client = true;
            }
            else {
                if (other) {
                    throw _1.error(object.constructor.name, key, _1.TeapotError.METHOD_FORM_INVALID);
                }
                other = true;
            }
            constructors.push(typeConstructor);
        }
        if (subcontroller && types.length !== 0) {
            throw _1.error(object.constructor.name, key, _1.TeapotError.CONTROL_METHOD_INVALID_PARAMETER);
        }
        return constructors;
    };
    Instance.intercept = function (buffer, headers, client, intercepts, callback) {
        if (intercepts.length === 0) {
            callback();
            return;
        }
        var intercept = intercepts.shift();
        intercept.object.intercept(buffer, headers, client, function () {
            Instance.intercept(buffer, headers, client, intercepts, callback);
        });
    };
    Instance.prototype.injectNormal = function (i, params, body, headers, client, routeParameterConstructors, next) {
        var _this = this;
        if (i >= routeParameterConstructors.length) {
            next(params);
            return;
        }
        if (routeParameterConstructors[i].name === "HttpHeaders") {
            params.push(headers);
            this.injectNormal(++i, params, body, headers, client, routeParameterConstructors, next);
        }
        else if (routeParameterConstructors[i].name === "Client") {
            params.push(client);
            this.injectNormal(++i, params, body, headers, client, routeParameterConstructors, next);
        }
        else {
            this.parseBody(client, headers, routeParameterConstructors[i], body, function (object) {
                params.push(object);
                _this.injectNormal(++i, params, body, headers, client, routeParameterConstructors, next);
            });
        }
    };
    Instance.prototype.parseBody = function (client, headers, constructor, buffer, next) {
        if (buffer.length === 0) {
            next(undefined);
            return;
        }
        if (headers["content-type"] === "application/json") {
            try {
                var object = JSON.parse(buffer.toString());
                var validated = this.validator.validate(object, constructor);
                next(validated);
                return;
            }
            catch (error) { }
        }
        client.error(_1.HttpStatus.BAD_REQUEST);
    };
    Instance.prototype.route = function (path, method, buffer, headers, client) {
        var handlers = this.routes.get(method);
        if (handlers !== undefined) {
            var handler = handlers.get(path);
            if (handler !== undefined) {
                handler(buffer, headers, client);
            }
        }
    };
    Instance.new = function (port) {
        var instance = new Instance(internal_1.ApplicationContainer.getLinkInstance());
        var server = internal_1.HttpContainer.getLinkInstance().getLinkInstance(port, instance);
        server.serve();
    };
    return Instance;
}());
exports.Instance = Instance;
