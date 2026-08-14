module.exports = [
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[project]/src/app/(sistema)/acciones.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"001737ba0a54f32cf0da0b589e32ebb4a13f1225db":{"name":"salir"}},"src/app/(sistema)/acciones.ts",""] */ __turbopack_context__.s([
    "salir",
    ()=>salir
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function salir() {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cerrarSesion"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/entrar");
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    salir
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(salir, "001737ba0a54f32cf0da0b589e32ebb4a13f1225db", null);
}),
"[project]/src/app/(sistema)/layout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LayoutSistema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rbac$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/rbac.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Marca$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Marca.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$sistema$292f$acciones$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(sistema)/acciones.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$sistema$292f$nav$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(sistema)/nav.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
const MENU = [
    {
        href: "/panel",
        texto: "Panel",
        permiso: "reportes.ver"
    },
    {
        href: "/corte",
        texto: "Cobro del día",
        permiso: "corte.dia"
    },
    {
        href: "/cobranza",
        texto: "Cobranza",
        permiso: "cobranza.ver"
    },
    {
        href: "/clientas",
        texto: "Clientas",
        permiso: "clientas.ver"
    },
    {
        href: "/creditos",
        texto: "Créditos",
        permiso: "creditos.ver"
    },
    {
        href: "/grupos",
        texto: "Grupos",
        permiso: "grupos.ver"
    },
    {
        href: "/usuarios",
        texto: "Usuarios",
        permiso: "usuarios.ver"
    },
    {
        href: "/bitacora",
        texto: "Bitácora",
        permiso: "auditoria.ver"
    }
];
async function LayoutSistema({ children }) {
    const { usuario } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["exigirSesion"])();
    const menu = MENU.filter((m)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rbac$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["puede"])(usuario.rol, m.permiso));
    const iniciales = usuario.nombre.split(/\s+/).slice(0, 2).map((p)=>p[0]).join("").toUpperCase();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-dvh",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "sticky top-0 z-30 border-b border-niebla bg-white/95 backdrop-blur",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: "shrink-0",
                                "aria-label": "Inicio",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Marca$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Marca"], {
                                    ancho: 104,
                                    prioridad: true
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(sistema)/layout.tsx",
                                    lineNumber: 36,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(sistema)/layout.tsx",
                                lineNumber: 35,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "ml-auto flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hidden text-right sm:block",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-semibold leading-tight text-patrimonio",
                                                children: usuario.nombre
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(sistema)/layout.tsx",
                                                lineNumber: 41,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-tinta/55",
                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rbac$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ETIQUETA_ROL"][usuario.rol]
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(sistema)/layout.tsx",
                                                lineNumber: 42,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(sistema)/layout.tsx",
                                        lineNumber: 40,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-patrimonio text-sm font-bold text-white",
                                        "aria-hidden": true,
                                        children: iniciales
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(sistema)/layout.tsx",
                                        lineNumber: 44,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                        action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$sistema$292f$acciones$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["salir"],
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            className: "btn-fantasma px-3 py-2 text-xs",
                                            children: "Salir"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(sistema)/layout.tsx",
                                            lineNumber: 51,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(sistema)/layout.tsx",
                                        lineNumber: 50,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(sistema)/layout.tsx",
                                lineNumber: 39,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(sistema)/layout.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this),
                    menu.length > 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$sistema$292f$nav$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NavPrincipal"], {
                        items: menu.map(({ href, texto })=>({
                                href,
                                texto
                            }))
                    }, void 0, false, {
                        fileName: "[project]/src/app/(sistema)/layout.tsx",
                        lineNumber: 58,
                        columnNumber: 28
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(sistema)/layout.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "marca-agua mx-auto max-w-7xl px-4 py-8 sm:px-6",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/app/(sistema)/layout.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "border-t border-niebla px-4 py-6 text-center text-xs text-tinta/40",
                children: "Mujeres Unidas · Sistema interno de control de crédito"
            }, void 0, false, {
                fileName: "[project]/src/app/(sistema)/layout.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(sistema)/layout.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/(sistema)/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/(sistema)/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/(sistema)/nav.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NavPrincipal",
    ()=>NavPrincipal
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const NavPrincipal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call NavPrincipal() from the server but NavPrincipal is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/(sistema)/nav.tsx", "NavPrincipal");
}),
"[project]/src/app/(sistema)/nav.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NavPrincipal",
    ()=>NavPrincipal
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const NavPrincipal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call NavPrincipal() from the server but NavPrincipal is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/(sistema)/nav.tsx <module evaluation>", "NavPrincipal");
}),
"[project]/src/app/(sistema)/nav.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$sistema$292f$nav$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/(sistema)/nav.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$sistema$292f$nav$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/app/(sistema)/nav.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$sistema$292f$nav$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/components/Marca.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Marca",
    ()=>Marca
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-rsc] (ecmascript)");
;
;
const ARCHIVOS = {
    principal: "/brand/um-principal.png",
    invertido: "/brand/um-invertido.png",
    monocromatico: "/brand/um-monocromatico.png"
};
function Marca({ variante = "principal", ancho = 140, className, prioridad }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
        src: ARCHIVOS[variante],
        alt: "Mujeres Unidas",
        width: ancho,
        height: Math.round(ancho * 0.62),
        className: className,
        style: {
            width: ancho,
            height: "auto"
        },
        priority: prioridad
    }, void 0, false, {
        fileName: "[project]/src/components/Marca.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cerrarSesion",
    ()=>cerrarSesion,
    "exigirPermiso",
    ()=>exigirPermiso,
    "exigirPermisoAccion",
    ()=>exigirPermisoAccion,
    "exigirSesion",
    ()=>exigirSesion,
    "hashPassword",
    ()=>hashPassword,
    "iniciarSesion",
    ()=>iniciarSesion,
    "ipCliente",
    ()=>ipCliente,
    "limpiarSesionesVencidas",
    ()=>limpiarSesionesVencidas,
    "sesionActual",
    ()=>sesionActual,
    "tieneRol",
    ()=>tieneRol,
    "verificarPassword",
    ()=>verificarPassword
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$sign$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/jwt/sign.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$verify$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/jwt/verify.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$bcryptjs$29$__ = __turbopack_context__.i("[externals]/bcryptjs [external] (bcryptjs, cjs, [project]/node_modules/bcryptjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rbac$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/rbac.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
const COOKIE = "um_sesion";
const DIAS_SESION = 30;
function secreto() {
    const s = process.env.AUTH_SECRET;
    if (!s || s.length < 32) {
        throw new Error("Falta AUTH_SECRET (mínimo 32 caracteres). Genera uno con: openssl rand -base64 48");
    }
    return new TextEncoder().encode(s);
}
async function hashPassword(plano) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$bcryptjs$29$__["default"].hash(plano, 12);
}
async function verificarPassword(plano, hash) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$bcryptjs$29$__["default"].compare(plano, hash);
}
async function iniciarSesion(usuarioId) {
    const h = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["headers"])();
    const expiraEn = new Date(Date.now() + DIAS_SESION * 86_400_000);
    const sesion = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].sesion.create({
        data: {
            usuarioId,
            expiraEn,
            agente: h.get("user-agent")?.slice(0, 250) ?? null,
            ip: ipCliente(h)
        }
    });
    const token = await new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$sign$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SignJWT"]({
        sid: sesion.id,
        uid: usuarioId
    }).setProtectedHeader({
        alg: "HS256"
    }).setIssuedAt().setExpirationTime(expiraEn).sign(secreto());
    const jar = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    jar.set(COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: ("TURBOPACK compile-time value", "development") === "production",
        path: "/",
        expires: expiraEn
    });
}
async function cerrarSesion() {
    const jar = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const token = jar.get(COOKIE)?.value;
    if (token) {
        try {
            const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$verify$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jwtVerify"])(token, secreto());
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].sesion.deleteMany({
                where: {
                    id: String(payload.sid)
                }
            });
        } catch  {
        // token inválido o vencido: basta con borrar la cookie
        }
    }
    jar.delete(COOKIE);
}
async function sesionActual() {
    const jar = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const token = jar.get(COOKIE)?.value;
    if (!token) return null;
    let sid;
    try {
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$verify$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jwtVerify"])(token, secreto());
        sid = String(payload.sid);
    } catch  {
        return null;
    }
    const sesion = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].sesion.findUnique({
        where: {
            id: sid
        },
        select: {
            id: true,
            expiraEn: true,
            usuario: {
                select: {
                    id: true,
                    nombre: true,
                    usuario: true,
                    rol: true,
                    activo: true
                }
            }
        }
    });
    if (!sesion || sesion.expiraEn < new Date() || !sesion.usuario.activo) return null;
    return {
        sesionId: sesion.id,
        usuario: sesion.usuario
    };
}
async function exigirSesion() {
    const s = await sesionActual();
    if (!s) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/entrar");
    return s;
}
async function exigirPermiso(permiso) {
    const s = await exigirSesion();
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rbac$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["puede"])(s.usuario.rol, permiso)) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rbac$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rutaInicio"])(s.usuario.rol));
    return s;
}
async function exigirPermisoAccion(permiso) {
    const s = await sesionActual();
    if (!s) throw new Error("Tu sesión expiró. Vuelve a entrar.");
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rbac$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["puede"])(s.usuario.rol, permiso)) throw new Error("No tienes permiso para esta acción.");
    return s;
}
function tieneRol(s, ...roles) {
    return roles.includes(s.usuario.rol);
}
function ipCliente(h) {
    const xff = h.get("x-forwarded-for");
    if (xff) return xff.split(",")[0].trim().slice(0, 64);
    return h.get("x-real-ip")?.slice(0, 64) ?? null;
}
async function limpiarSesionesVencidas() {
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].sesion.deleteMany({
        where: {
            expiraEn: {
                lt: new Date()
            }
        }
    });
}
}),
"[project]/src/lib/db.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const globalForPrisma = globalThis;
const db = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
    log: ("TURBOPACK compile-time truthy", 1) ? [
        "warn",
        "error"
    ] : "TURBOPACK unreachable"
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = db;
}),
"[project]/src/lib/rbac.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DESCRIPCION_ROL",
    ()=>DESCRIPCION_ROL,
    "ETIQUETA_ROL",
    ()=>ETIQUETA_ROL,
    "PERMISOS",
    ()=>PERMISOS,
    "permisosDe",
    ()=>permisosDe,
    "puede",
    ()=>puede,
    "puedeAlguno",
    ()=>puedeAlguno,
    "rutaInicio",
    ()=>rutaInicio
]);
const PERMISOS = [
    "usuarios.ver",
    "usuarios.crear",
    "usuarios.editar",
    "grupos.ver",
    "grupos.crear",
    "grupos.editar",
    "clientas.ver",
    "clientas.crear",
    "clientas.editar",
    "clientas.historial",
    "creditos.ver",
    "creditos.crear",
    "creditos.editar",
    "creditos.tarjeton",
    "cobranza.ver",
    "cobranza.marcar",
    "cobranza.anular",
    "documentos.ver",
    "documentos.subir",
    "corte.dia",
    "reportes.ver",
    "auditoria.ver"
];
const MATRIZ = {
    // Dirección: hace todo, y es la única que da de alta usuarios.
    PRINCIPAL: [
        ...PERMISOS
    ],
    // Supervisor: arma y administra los grupos (VIRI 1, CHIHUAHUA 1...) y su cartera.
    SUPERVISOR: [
        "grupos.ver",
        "grupos.crear",
        "grupos.editar",
        "clientas.ver",
        "clientas.crear",
        "clientas.editar",
        "clientas.historial",
        "creditos.ver",
        "creditos.crear",
        "creditos.editar",
        "creditos.tarjeton",
        "cobranza.ver",
        "cobranza.marcar",
        "cobranza.anular",
        "documentos.ver",
        "documentos.subir",
        "corte.dia",
        "reportes.ver",
        "usuarios.ver"
    ],
    // Capturista: alta de clienta y aval, consulta de historial y marcado de abonos del sábado.
    CAPTURISTA: [
        "grupos.ver",
        "clientas.ver",
        "clientas.crear",
        "clientas.editar",
        "clientas.historial",
        "creditos.ver",
        "creditos.crear",
        "creditos.tarjeton",
        "cobranza.ver",
        "cobranza.marcar",
        "documentos.ver",
        "documentos.subir"
    ],
    // Encargada: únicamente el total a cobrar del día.
    ENCARGADA: [
        "corte.dia"
    ]
};
function permisosDe(rol) {
    return MATRIZ[rol];
}
function puede(rol, permiso) {
    return MATRIZ[rol].includes(permiso);
}
function puedeAlguno(rol, permisos) {
    return permisos.some((p)=>puede(rol, p));
}
const ETIQUETA_ROL = {
    PRINCIPAL: "Principal",
    SUPERVISOR: "Supervisor",
    CAPTURISTA: "Capturista",
    ENCARGADA: "Encargada"
};
const DESCRIPCION_ROL = {
    PRINCIPAL: "Dirección. Crea usuarios y ve toda la operación.",
    SUPERVISOR: "Crea y administra grupos, clientas, créditos y cobranza.",
    CAPTURISTA: "Da de alta clientas y avales, consulta historial y marca los abonos del sábado.",
    ENCARGADA: "Solo consulta el total a cobrar del día."
};
function rutaInicio(rol) {
    if (rol === "ENCARGADA") return "/corte";
    if (rol === "CAPTURISTA") return "/cobranza";
    return "/panel";
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__05mw0vv._.js.map