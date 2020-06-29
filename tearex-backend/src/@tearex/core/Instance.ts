import { Router, Injector, Validator, ApplicationContainer, ReadonlyApplicationMethodMetadata, Injectable, HttpServer, HttpContainer } from "@tearex/internal";
import { HttpMethod, Client, HttpHeaders, error, TeapotError, Interception, HttpStatus } from ".";

export class Instance implements Router {

    private readonly injector: Injector;
    private readonly validator: Validator;
    private readonly routes: Map<HttpMethod, Map<string, (buffer: Buffer, headers: HttpHeaders, client: Client) => void>>;

    private constructor(container: ApplicationContainer) {
        this.injector = new Injector();
        this.routes = new Map();
        this.init(container);
        this.validator = new Validator(this.injector, container.getValidations());
    }

    private init(container: ApplicationContainer): void {
        /**
        * Checking if every intercept is at least registered as one route or control
        * and if every specified interceptor class exists
        */
        for (const intercepts of container.getIntercepts().entries()) {
            let controls: ReadonlyApplicationMethodMetadata<string> | undefined = container.getControls().get(intercepts[0]);
            let routes: ReadonlyApplicationMethodMetadata<readonly HttpMethod[]> | undefined = container.getRoutes().get(intercepts[0]);

            if (controls === undefined && routes === undefined) {
                throw error(intercepts[0], undefined, TeapotError.INTERCEPT_MISSING_CONTROL_OR_ROUTE);
            }

            for (const metadata of intercepts[1].getMethods().entries()) {

                let b0: boolean = false;
                let b1: boolean = false;

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
                    throw error(intercepts[0], metadata[0], TeapotError.INTERCEPT_MISSING_CONTROL_OR_ROUTE);
                }
                /*
                if (!b1) {
                    throw new Error(TeapotError.INTERCEPT_MISSING_CONTROL_OR_ROUTE);
                }*/

                for (const interceptor of metadata[1]) {
                    if (!container.getInterceptors().has(interceptor)) {
                        throw error(intercepts[0], metadata[0], TeapotError.INTERCEPTOR_NOT_FOUND);
                    }
                }

            }
        }

        /**
        * Check for every sub controller that the controller exists
        * and searching for root controllers and checking
        * for circles in the controller structure
        */
        const rootControllerNames: Map<string, undefined> = new Map();

        for (const controllers of container.getControllers().entries()) {
            rootControllerNames.set(controllers[0], undefined);
        }

        for (const controls of container.getControls().entries()) {

            if (!Instance.checkControls(container, controls[0], [])) {
                throw error(controls[0], undefined, TeapotError.CIRCULAR_CONTROLLER_HIERACHY);
            }

            for (const metadata of controls[1].getMethods()) {

                if (controls[0] === metadata[1]) {
                    throw error(controls[0], metadata[0], TeapotError.CIRCULAR_CONTROLLER_HIERACHY);
                }
                if (!container.getControllers().has(metadata[1])) {
                    throw error(controls[0], metadata[0], TeapotError.CONTROLLER_NOT_FOUND);
                }
                rootControllerNames.delete(metadata[1]);
            }
        }

        /**
        * Checking for all validation if the validator exists
        */
        for (const validaton of container.getValidations().entries()) {

            for (const methodValidations of validaton[1].entries()) {
                for (const validator of methodValidations[1]) {

                    if (!container.getValidators().has(validator)) {
                        throw error(validaton[0], methodValidations[0], TeapotError.VALIDATOR_NOT_FOUND);
                    }
                }
            }
        }

        /**
        * Registering all controllers
        */
        for (const controllers of container.getControllers().entries()) {
            this.injector.registerSealed(controllers[1]);
        }
        /**
        * Registering all interceptors
        */
        for (const interceptor of container.getInterceptors().entries()) {
            this.injector.register(interceptor[1]);
        }
        /**
        * Registering all services
        */
        for (const services of container.getServices().entries()) {
            this.injector.register(services[1]);
        }

        /**
        * Registering all validators
        */
        for (const validator of container.getValidators().entries()) {
            this.injector.register(validator[1]);
        }

        /**
        * Finally building the uri tree for every root component and adding intercepts if exist
        */
        for (const controllerName of rootControllerNames.keys()) {
            this.initRoutesAndInterceptors(container, controllerName, "", []);
        }
    }

    private initRoutesAndInterceptors(container: ApplicationContainer, controllerName: string, path: string, globalInterceptors: Injectable<Interception>[]): void {
        let controller: Injectable<any> | undefined = undefined;
        let controls: ReadonlyApplicationMethodMetadata<string> | undefined = container.getControls().get(controllerName);
        let interceptors: ReadonlyApplicationMethodMetadata<readonly string[]> | undefined = container.getIntercepts().get(controllerName);
        let routes: ReadonlyApplicationMethodMetadata<readonly HttpMethod[]> | undefined = container.getRoutes().get(controllerName);

        if (routes === undefined) {
            return;
        }

        /**
        * Setup normal routes
        */
        for (const route of routes.getMethods().entries()) {

            /**
            * Get interceptor
            */
            let interceptorsPerRoute: Injectable<Interception>[] = [];

            if (interceptors !== undefined) {
                let interceptorNames: readonly string[] | undefined = interceptors.getMethods().get(route[0]);

                if (interceptorNames !== undefined) {
                    for (const name of interceptorNames) {

                        for (const global of globalInterceptors) {
                            if (global.object.constructor.name === name) {
                                throw error(controllerName, route[0], TeapotError.INTERCEPT_METHOD_GLOBAL_OVERRRIDE);
                            }
                        }
                    }
                    for (const name of interceptorNames) {
                        let interceptor: Injectable<Interception> =  this.injector.getLinkInstance(name);
                        interceptorsPerRoute.push(interceptor);
                    }
                }
            }

            /**
            * Get controller
            */

            if (controller === undefined) {
                controller = this.injector.getLinkInstance(controllerName);
            }

            if (controller.cache === undefined) {
                controller.cache = new Map();
                this.injector.setCache(controllerName, controller.cache);
            }

            let controllerCache: Map<string, { new(): {} }[]> = <Map<string, { new(): {} }[]>>controller.cache;
            let routeParameterConstructors: { new(): {} }[] | undefined = controllerCache.get(route[0]);

            if (routeParameterConstructors === undefined) {
                routeParameterConstructors = Instance.getParameterConstructors(routes.getObject(), route[0], false);
                controllerCache.set(route[0], routeParameterConstructors);
            }

            for (const httpMethod of route[1]) {
                let handlers: Map<string, (buffer: Buffer, headers: HttpHeaders, client: Client) => void> | undefined = this.routes.get(httpMethod);

                if (handlers === undefined) {
                    handlers = new Map();
                    this.routes.set(httpMethod, handlers);
                }

                let handler: (buffer: Buffer, headers: HttpHeaders, client: Client) => void = (buffer: Buffer, headers: HttpHeaders, client: Client) => {

                    let intercepts: Injectable<Interception>[] = globalInterceptors.concat(interceptorsPerRoute);

                    Instance.intercept(buffer, headers, client, intercepts, () => {
                        this.injectNormal(0, [], buffer, headers, client, <{ new(): {} }[]>routeParameterConstructors, (params: any[]) => {
                            (<any>controller).object[route[0]](...params);
                        });
                    });
                };
                if (route[0] !== "index") {
                    handlers.set(path + "/" + route[0], handler);
                } else {
                    handlers.set(path, handler);
                    handlers.set(path + "/", handler);
                }

            }
        }

        /**
        * Setup sub controllers
        */
        if (controls === undefined) {
            return;
        }

        for (const control of controls.getMethods().entries()) {

            let controlInterceptors: Injectable<Interception>[] = [];

            if (interceptors !== undefined) {
                let interceptorNames: readonly string[] | undefined = interceptors.getMethods().get(control[0]);

                if (interceptorNames !== undefined) {

                    for (const name of interceptorNames) {

                        for (const global of globalInterceptors) {
                            if (global.object.constructor.name === name) {
                                throw error(controllerName, control[0], TeapotError.INTERCEPT_METHOD_GLOBAL_OVERRRIDE);
                            }
                        }
                    }
                    for (const name of interceptorNames) {
                        let interceptor: Injectable<Interception> =  this.injector.getLinkInstance(name);
                        controlInterceptors.push(interceptor);
                    }
                }
            }
            this.initRoutesAndInterceptors(container, control[1], path + "/" + control[0], globalInterceptors.concat(controlInterceptors));
        }
    }

    private static checkControls(container: ApplicationContainer, controllerName: string, hierarchy: string[]): boolean {
        let controls: IterableIterator<string> | undefined = container.getControls().get(controllerName)?.getMethods().values();

        if (controls === undefined) {
            return true;
        }

        let ret: boolean = true;

        for (const control of controls) {

            for (const before of hierarchy) {
                if (before === control) {
                    return false;
                }
            }

            let controlHierachy: string[] = [...hierarchy];
            controlHierachy.push(control);
            ret = Instance.checkControls(container, control, controlHierachy);
        }

        return ret;
    }

    private static getParameterConstructors(object: Object, key: string, subcontroller: boolean): { new(): {} }[] {

        let types: any = Reflect.getMetadata("design:paramtypes", object, key);

        let constructors: { new(): {} }[] = [];

        if (types === undefined) {
            return constructors;
        }

        let headers: boolean = false;
        let client: boolean = false;
        let other: boolean = false;

        for (let i = 0;i < types.length;i++) {
            const typeConstructor: { new(): {} } = types[i]();
            let t: string = typeConstructor.name;
            if (t === "HttpHeaders") {
                if (headers) {
                    throw error(object.constructor.name, key, TeapotError.METHOD_FORM_INVALID);
                }
                headers = true;
            } else if (t === "Client") {
                if (client) {
                    throw error(object.constructor.name, key, TeapotError.METHOD_FORM_INVALID);
                }
                client = true;
            } else {
                if (other) {
                    throw error(object.constructor.name, key, TeapotError.METHOD_FORM_INVALID);
                }
                other = true;
            }
            constructors.push(typeConstructor);
        }
        if (subcontroller && types.length !== 0) {
            throw error(object.constructor.name, key, TeapotError.CONTROL_METHOD_INVALID_PARAMETER);
        }
        return constructors;
    }

    private static intercept(buffer: Buffer, headers: HttpHeaders, client: Client, intercepts: Injectable<Interception>[], callback: () => void): void {
        if (intercepts.length === 0) {
            callback();
            return;
        }
        let intercept: Injectable<Interception> = <Injectable<Interception>>intercepts.shift();
        intercept.object.intercept(buffer, headers, client, () => {
            Instance.intercept(buffer, headers, client, intercepts, callback);
        });
    }

    private injectNormal(i: number, params: any[], body: Buffer, headers: HttpHeaders, client: Client, routeParameterConstructors: { new(): {} }[], next: (params: any[]) => void): void {

        if (i >= routeParameterConstructors.length) {
            next(params);
            return;
        }
        if (routeParameterConstructors[i].name === "HttpHeaders") {
            params.push(headers);
            this.injectNormal(++i, params, body, headers, client, routeParameterConstructors, next);
        } else if (routeParameterConstructors[i].name === "Client") {
            params.push(client);
            this.injectNormal(++i, params, body, headers, client, routeParameterConstructors, next);
        } else {
            this.parseBody(client, headers, routeParameterConstructors[i], body, (object: Object | undefined) => {
                params.push(object);
                this.injectNormal(++i, params, body, headers, client, routeParameterConstructors, next);
            });
        }
    }

    private parseBody(client: Client, headers: HttpHeaders, constructor: { new(): {} }, buffer: Buffer, next: (object: Object | undefined) => void): void {
        if (buffer.length === 0) {
            next(undefined);
            return;
        }
        if (headers["content-type"] === "application/json") {
            try {
                const object: any = JSON.parse(buffer.toString());
                const validated: {} = this.validator.validate(object, constructor);
                next(validated);
                return;
            } catch(error) {}
        }
        client.error(HttpStatus.BAD_REQUEST);
    }

    route(path: string, method: HttpMethod, buffer: Buffer, headers: HttpHeaders, client: Client): void {
        let handlers: Map<string, (buffer: Buffer, headers: HttpHeaders, client: Client) => void> | undefined = this.routes.get(method);

        if (handlers !== undefined) {
            let handler: ((buffer: Buffer, headers: HttpHeaders, client: Client) => void) | undefined = handlers.get(path);

            if (handler !== undefined) {
                handler(buffer, headers, client);
            }
        }
    }

    static new(port: number): void {
        let instance: Instance = new Instance(ApplicationContainer.getLinkInstance());
        let server: HttpServer = HttpContainer.getLinkInstance().getLinkInstance(port, instance);
        server.serve();
    }
}
