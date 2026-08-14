(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This file must be bundled in the app's client layer, it shouldn't be directly
// imported by the server.
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    callServer: null,
    createServerReference: null,
    findSourceMapURL: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    callServer: function() {
        return _appcallserver.callServer;
    },
    createServerReference: function() {
        return _client.createServerReference;
    },
    findSourceMapURL: function() {
        return _appfindsourcemapurl.findSourceMapURL;
    }
});
const _appcallserver = __turbopack_context__.r("[project]/node_modules/next/dist/client/app-call-server.js [app-client] (ecmascript)");
const _appfindsourcemapurl = __turbopack_context__.r("[project]/node_modules/next/dist/client/app-find-source-map-url.js [app-client] (ecmascript)");
const _client = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react-server-dom-turbopack/client.js [app-client] (ecmascript)");
}),
"[project]/src/app/(sistema)/creditos/data:d40061 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "registrarCredito",
    ()=>$$RSC_SERVER_ACTION_0
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"60b616ceb19a486cf4796392d4628c4f7f9990199a":{"name":"registrarCredito"}},"src/app/(sistema)/creditos/acciones.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("60b616ceb19a486cf4796392d4628c4f7f9990199a", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "registrarCredito");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FormularioCredito",
    ()=>FormularioCredito
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$sistema$292f$creditos$2f$data$3a$d40061__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/app/(sistema)/creditos/data:d40061 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$FormularioAccion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/FormularioAccion.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$campos$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/campos.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fechas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/fechas.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dinero$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/dinero.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
function FormularioCredito({ clientas, grupos, clientaInicial, semanasPorDefecto }) {
    _s();
    const [entrega, setEntrega] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [semanas, setSemanas] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(semanasPorDefecto);
    const [total, setTotal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const calendario = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FormularioCredito.useMemo[calendario]": ()=>{
            if (!/^\d{4}-\d{2}-\d{2}$/.test(entrega)) return null;
            try {
                const d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fechas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseFecha"])(entrega);
                return {
                    lunes: d,
                    filas: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fechas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generarCalendario"])(d, semanas),
                    esLunes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fechas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["esLunes"])(d)
                };
            } catch  {
                return null;
            }
        }
    }["FormularioCredito.useMemo[calendario]"], [
        entrega,
        semanas
    ]);
    const montos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FormularioCredito.useMemo[montos]": ()=>{
            try {
                const centavos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dinero$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["aCentavos"])(total);
                if (centavos <= 0) return null;
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dinero$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["repartirAbonos"])(centavos, semanas);
            } catch  {
                return null;
            }
        }
    }["FormularioCredito.useMemo[montos]"], [
        total,
        semanas
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid gap-6 lg:grid-cols-[1fr_20rem]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "tarjeta",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$FormularioAccion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormularioAccion"], {
                        accion: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$sistema$292f$creditos$2f$data$3a$d40061__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["registrarCredito"],
                        textoBoton: "Registrar crédito",
                        limpiarAlExito: false,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$campos$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Seccion"], {
                                titulo: "Clienta",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$campos$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selector"], {
                                            etiqueta: "Clienta",
                                            nombre: "clienteId",
                                            requerido: true,
                                            opciones: clientas,
                                            valor: clientaInicial,
                                            vacio: "— Selecciona la clienta —"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                                            lineNumber: 61,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$campos$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selector"], {
                                            etiqueta: "Grupo",
                                            nombre: "grupoId",
                                            opciones: grupos,
                                            vacio: "— El grupo de la clienta —",
                                            ayuda: "Déjalo vacío para usar el grupo que ya tiene asignado."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                                            lineNumber: 69,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                                    lineNumber: 60,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                                lineNumber: 59,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$campos$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Seccion"], {
                                titulo: "Importes",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$campos$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Rejilla"], {
                                        cols: 3,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$campos$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Campo"], {
                                                etiqueta: "Monto prestado",
                                                nombre: "montoPrestado",
                                                requerido: true,
                                                inputMode: "decimal",
                                                placeholder: "3000"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                                                lineNumber: 81,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$campos$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Campo"], {
                                                etiqueta: "Total a pagar",
                                                nombre: "montoTotal",
                                                requerido: true,
                                                inputMode: "decimal",
                                                placeholder: "3600",
                                                ayuda: "Capital más interés.",
                                                alCambiar: setTotal
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                                                lineNumber: 88,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$campos$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Campo"], {
                                                etiqueta: "Semanas",
                                                nombre: "numSemanas",
                                                requerido: true,
                                                tipo: "number",
                                                inputMode: "numeric",
                                                valor: semanasPorDefecto,
                                                alCambiar: (v)=>setSemanas(Number(v) || 0)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                                                lineNumber: 97,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                                        lineNumber: 80,
                                        columnNumber: 15
                                    }, this),
                                    montos ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-3 rounded-lg bg-marfil px-4 py-3 text-sm text-patrimonio",
                                        children: [
                                            "Abono semanal: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                className: "font-semibold",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dinero$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pesos"])(montos[0])
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                                                lineNumber: 110,
                                                columnNumber: 34
                                            }, this),
                                            montos[montos.length - 1] !== montos[0] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-tinta/60",
                                                children: [
                                                    " ",
                                                    "(el último abono queda en ",
                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dinero$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pesos"])(montos[montos.length - 1]),
                                                    " para cuadrar el total)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                                                lineNumber: 112,
                                                columnNumber: 21
                                            }, this) : null
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                                        lineNumber: 109,
                                        columnNumber: 17
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                                lineNumber: 79,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$campos$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Seccion"], {
                                titulo: "Fechas",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$campos$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Campo"], {
                                        etiqueta: "Fecha de entrega (lunes)",
                                        nombre: "fechaEntrega",
                                        tipo: "date",
                                        requerido: true,
                                        ayuda: "Captura el lunes de entrega; el sistema arma solo los sábados de abono.",
                                        alCambiar: setEntrega
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                                        lineNumber: 122,
                                        columnNumber: 15
                                    }, this),
                                    calendario && !calendario.esLunes ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-3",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Aviso"], {
                                            tono: "info",
                                            children: [
                                                "La fecha que elegiste es ",
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fechas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fechaLarga"])(calendario.lunes),
                                                ", no un lunes. El primer abono se programará el sábado siguiente."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                                            lineNumber: 133,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                                        lineNumber: 132,
                                        columnNumber: 17
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                                lineNumber: 121,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$campos$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Seccion"], {
                                titulo: "Observaciones",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$campos$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AreaTexto"], {
                                    etiqueta: "Notas",
                                    nombre: "notas"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                                    lineNumber: 142,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                                lineNumber: 141,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                        lineNumber: 58,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                    lineNumber: 57,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: "tarjeta h-fit lg:sticky lg:top-32",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "border-b border-niebla px-5 py-3.5",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "font-serif text-lg text-patrimonio",
                            children: "Calendario de abonos"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                            lineNumber: 150,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, this),
                    !calendario ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "px-5 py-10 text-center text-sm text-tinta/50",
                        children: [
                            "Elige la fecha de entrega para ver los ",
                            semanasPorDefecto,
                            " sábados."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                        lineNumber: 154,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                                className: "max-h-[26rem] overflow-y-auto scroll-suave",
                                children: calendario.filas.map((f, i)=>{
                                    const ultimo = i === calendario.filas.length - 1;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: `flex items-center justify-between gap-3 border-b border-niebla/70 px-5 py-2.5 text-sm last:border-b-0 ${ultimo ? "bg-oro/10 font-semibold text-patrimonio" : ""}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "tabular-nums text-tinta/50",
                                                children: String(f.semana).padStart(2, "0")
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                                                lineNumber: 169,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex-1",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fechas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fechaCorta"])(f.fecha)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                                                lineNumber: 172,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "tabular-nums",
                                                children: montos ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dinero$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pesos"])(montos[i]) : "—"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                                                lineNumber: 173,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, f.iso, true, {
                                        fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                                        lineNumber: 163,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                                lineNumber: 159,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border-t border-niebla bg-marfil px-5 py-4 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-tinta/60",
                                        children: "Vence el"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                                        lineNumber: 179,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-serif text-base text-patrimonio",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fechas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fechaLarga"])(calendario.filas[calendario.filas.length - 1].fecha)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                                        lineNumber: 180,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                                lineNumber: 178,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                        lineNumber: 158,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
                lineNumber: 148,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(sistema)/creditos/nuevo/formulario.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
_s(FormularioCredito, "zXK9FGBQZU+pX5ajwoCx1SO65y4=");
_c = FormularioCredito;
var _c;
__turbopack_context__.k.register(_c, "FormularioCredito");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/FormularioAccion.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FormularioAccion",
    ()=>FormularioAccion
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
function Boton({ texto, variante }) {
    _s();
    const { pending } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFormStatus"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "submit",
        className: variante === "primario" ? "btn-primario" : "btn-secundario",
        disabled: pending,
        children: pending ? "Guardando…" : texto
    }, void 0, false, {
        fileName: "[project]/src/components/FormularioAccion.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_s(Boton, "ChN3pfldoIBH4a0f1nBGB7ED+p0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFormStatus"]
    ];
});
_c = Boton;
function FormularioAccion({ accion, children, textoBoton = "Guardar", variante = "primario", limpiarAlExito = true, pie, className = "" }) {
    _s1();
    const [estado, despachar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useActionState"])(accion, {});
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FormularioAccion.useEffect": ()=>{
            if (estado.exito && limpiarAlExito) ref.current?.reset();
        }
    }["FormularioAccion.useEffect"], [
        estado.exito,
        limpiarAlExito
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        ref: ref,
        action: despachar,
        className: className,
        children: [
            estado.error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Aviso"], {
                    tono: "error",
                    children: estado.error
                }, void 0, false, {
                    fileName: "[project]/src/components/FormularioAccion.tsx",
                    lineNumber: 55,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/FormularioAccion.tsx",
                lineNumber: 54,
                columnNumber: 9
            }, this) : null,
            estado.exito ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Aviso"], {
                    tono: "exito",
                    children: estado.exito
                }, void 0, false, {
                    fileName: "[project]/src/components/FormularioAccion.tsx",
                    lineNumber: 60,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/FormularioAccion.tsx",
                lineNumber: 59,
                columnNumber: 9
            }, this) : null,
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-5 flex flex-wrap items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Boton, {
                        texto: textoBoton,
                        variante: variante
                    }, void 0, false, {
                        fileName: "[project]/src/components/FormularioAccion.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this),
                    pie
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/FormularioAccion.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/FormularioAccion.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_s1(FormularioAccion, "ZHYD3thju+bCda6kt//byVpCvkA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useActionState"]
    ];
});
_c1 = FormularioAccion;
var _c, _c1;
__turbopack_context__.k.register(_c, "Boton");
__turbopack_context__.k.register(_c1, "FormularioAccion");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/campos.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AreaTexto",
    ()=>AreaTexto,
    "Campo",
    ()=>Campo,
    "Rejilla",
    ()=>Rejilla,
    "Seccion",
    ()=>Seccion,
    "Selector",
    ()=>Selector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function Campo({ etiqueta, nombre, tipo = "text", requerido, ayuda, valor, placeholder, inputMode, autoFocus, maxLength, alCambiar }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "etiqueta",
                htmlFor: nombre,
                children: [
                    etiqueta,
                    requerido ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-1 text-oro",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/src/components/campos.tsx",
                        lineNumber: 33,
                        columnNumber: 22
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/campos.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                id: nombre,
                name: nombre,
                type: tipo,
                className: "campo",
                required: requerido,
                defaultValue: valor ?? undefined,
                placeholder: placeholder,
                inputMode: inputMode,
                autoFocus: autoFocus,
                maxLength: maxLength,
                onChange: alCambiar ? (e)=>alCambiar(e.target.value) : undefined
            }, void 0, false, {
                fileName: "[project]/src/components/campos.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            ayuda ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "ayuda",
                children: ayuda
            }, void 0, false, {
                fileName: "[project]/src/components/campos.tsx",
                lineNumber: 48,
                columnNumber: 16
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/campos.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
_c = Campo;
function Selector({ etiqueta, nombre, opciones, requerido, ayuda, valor, vacio = "— Selecciona —" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "etiqueta",
                htmlFor: nombre,
                children: [
                    etiqueta,
                    requerido ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-1 text-oro",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/src/components/campos.tsx",
                        lineNumber: 74,
                        columnNumber: 22
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/campos.tsx",
                lineNumber: 72,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                id: nombre,
                name: nombre,
                className: "campo",
                required: requerido,
                defaultValue: valor ?? "",
                children: [
                    vacio !== null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "",
                        children: vacio
                    }, void 0, false, {
                        fileName: "[project]/src/components/campos.tsx",
                        lineNumber: 77,
                        columnNumber: 27
                    }, this) : null,
                    opciones.map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: o.valor,
                            children: o.texto
                        }, o.valor, false, {
                            fileName: "[project]/src/components/campos.tsx",
                            lineNumber: 79,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/campos.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            ayuda ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "ayuda",
                children: ayuda
            }, void 0, false, {
                fileName: "[project]/src/components/campos.tsx",
                lineNumber: 84,
                columnNumber: 16
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/campos.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
}
_c1 = Selector;
function AreaTexto({ etiqueta, nombre, ayuda, valor, filas = 3 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "etiqueta",
                htmlFor: nombre,
                children: etiqueta
            }, void 0, false, {
                fileName: "[project]/src/components/campos.tsx",
                lineNumber: 104,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                id: nombre,
                name: nombre,
                rows: filas,
                className: "campo",
                defaultValue: valor ?? undefined
            }, void 0, false, {
                fileName: "[project]/src/components/campos.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, this),
            ayuda ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "ayuda",
                children: ayuda
            }, void 0, false, {
                fileName: "[project]/src/components/campos.tsx",
                lineNumber: 108,
                columnNumber: 16
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/campos.tsx",
        lineNumber: 103,
        columnNumber: 5
    }, this);
}
_c2 = AreaTexto;
function Rejilla({ children, cols = 2 }) {
    const clases = {
        1: "sm:grid-cols-1",
        2: "sm:grid-cols-2",
        3: "sm:grid-cols-3"
    }[cols];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `grid grid-cols-1 gap-4 ${clases}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/campos.tsx",
        lineNumber: 115,
        columnNumber: 10
    }, this);
}
_c3 = Rejilla;
function Seccion({ titulo, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
        className: "mt-6 first:mt-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                className: "mb-3 font-serif text-base text-patrimonio",
                children: titulo
            }, void 0, false, {
                fileName: "[project]/src/components/campos.tsx",
                lineNumber: 121,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/campos.tsx",
        lineNumber: 120,
        columnNumber: 5
    }, this);
}
_c4 = Seccion;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "Campo");
__turbopack_context__.k.register(_c1, "Selector");
__turbopack_context__.k.register(_c2, "AreaTexto");
__turbopack_context__.k.register(_c3, "Rejilla");
__turbopack_context__.k.register(_c4, "Seccion");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Aviso",
    ()=>Aviso,
    "Dato",
    ()=>Dato,
    "Insignia",
    ()=>Insignia,
    "Migas",
    ()=>Migas,
    "Tarjeta",
    ()=>Tarjeta,
    "Titulo",
    ()=>Titulo,
    "Vacio",
    ()=>Vacio
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
;
function Titulo({ children, sub }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mb-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "font-display text-3xl leading-tight text-patrimonio sm:text-4xl",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui.tsx",
                lineNumber: 7,
                columnNumber: 7
            }, this),
            sub ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1.5 max-w-2xl text-sm text-tinta/65",
                children: sub
            }, void 0, false, {
                fileName: "[project]/src/components/ui.tsx",
                lineNumber: 8,
                columnNumber: 14
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui.tsx",
        lineNumber: 6,
        columnNumber: 5
    }, this);
}
_c = Titulo;
function Tarjeta({ titulo, accion, children, className = "" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: `tarjeta ${className}`,
        children: [
            titulo ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "flex items-center justify-between gap-3 border-b border-niebla px-5 py-3.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "font-serif text-lg text-patrimonio",
                        children: titulo
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui.tsx",
                        lineNumber: 28,
                        columnNumber: 11
                    }, this),
                    accion
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui.tsx",
                lineNumber: 27,
                columnNumber: 9
            }, this) : null,
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_c1 = Tarjeta;
function Dato({ etiqueta, valor }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                className: "text-xs font-semibold uppercase tracking-wider text-patrimonio/60",
                children: etiqueta
            }, void 0, false, {
                fileName: "[project]/src/components/ui.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                className: "mt-0.5 text-sm text-tinta",
                children: valor || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-tinta/35",
                    children: "—"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui.tsx",
                    lineNumber: 41,
                    columnNumber: 59
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
_c2 = Dato;
const TONOS = {
    verde: "bg-crecimiento/10 text-crecimiento",
    oro: "bg-oro/20 text-[#7a6122]",
    rojo: "bg-riesgo/10 text-riesgo",
    neutro: "bg-niebla text-tinta/70",
    tinta: "bg-patrimonio text-white"
};
function Insignia({ children, tono = "neutro" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `insignia ${TONOS[tono]}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui.tsx",
        lineNumber: 61,
        columnNumber: 10
    }, this);
}
_c3 = Insignia;
function Vacio({ children, accion }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center gap-3 px-6 py-14 text-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "max-w-sm text-sm text-tinta/55",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            accion
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_c4 = Vacio;
function Aviso({ tono = "info", children }) {
    const estilos = {
        info: "border-salvia bg-salvia/20 text-patrimonio",
        error: "border-riesgo/30 bg-riesgo/5 text-riesgo",
        exito: "border-crecimiento/30 bg-crecimiento/5 text-crecimiento"
    }[tono];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-lg border px-4 py-3 text-sm ${estilos}`,
        role: tono === "error" ? "alert" : undefined,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui.tsx",
        lineNumber: 86,
        columnNumber: 5
    }, this);
}
_c5 = Aviso;
function Migas({ items }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "mb-4 flex flex-wrap items-center gap-1.5 text-xs text-tinta/55",
        children: items.map((it, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "flex items-center gap-1.5",
                children: [
                    i > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": true,
                        children: "/"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui.tsx",
                        lineNumber: 97,
                        columnNumber: 20
                    }, this) : null,
                    it.href ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: it.href,
                        className: "hover:text-patrimonio hover:underline",
                        children: it.texto
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui.tsx",
                        lineNumber: 99,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-tinta/80",
                        children: it.texto
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui.tsx",
                        lineNumber: 103,
                        columnNumber: 13
                    }, this)
                ]
            }, i, true, {
                fileName: "[project]/src/components/ui.tsx",
                lineNumber: 96,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/ui.tsx",
        lineNumber: 94,
        columnNumber: 5
    }, this);
}
_c6 = Migas;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "Titulo");
__turbopack_context__.k.register(_c1, "Tarjeta");
__turbopack_context__.k.register(_c2, "Dato");
__turbopack_context__.k.register(_c3, "Insignia");
__turbopack_context__.k.register(_c4, "Vacio");
__turbopack_context__.k.register(_c5, "Aviso");
__turbopack_context__.k.register(_c6, "Migas");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/dinero.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Los importes viven en CENTAVOS (enteros) en toda la aplicación.
 * Se convierten a pesos únicamente al mostrar o al leer un formulario.
 */ __turbopack_context__.s([
    "aCentavos",
    ()=>aCentavos,
    "aPesos",
    ()=>aPesos,
    "pesos",
    ()=>pesos,
    "pesosCompacto",
    ()=>pesosCompacto,
    "repartirAbonos",
    ()=>repartirAbonos
]);
function aCentavos(valor) {
    if (typeof valor === "number") {
        if (!Number.isFinite(valor)) throw new Error("Importe inválido.");
        return Math.round(valor * 100);
    }
    const limpio = valor.replace(/[$,\s]/g, "").trim();
    if (limpio === "") throw new Error("Importe vacío.");
    if (!/^-?\d+(\.\d{1,2})?$/.test(limpio)) throw new Error(`Importe inválido: "${valor}".`);
    return Math.round(Number(limpio) * 100);
}
function aPesos(centavos) {
    return centavos / 100;
}
const NF = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2
});
function pesos(centavos) {
    return NF.format(centavos / 100);
}
function pesosCompacto(centavos) {
    const v = centavos / 100;
    return Number.isInteger(v) ? new Intl.NumberFormat("es-MX").format(v) : new Intl.NumberFormat("es-MX", {
        minimumFractionDigits: 2
    }).format(v);
}
function repartirAbonos(totalCentavos, n) {
    if (n < 1) throw new Error("Número de abonos inválido.");
    const base = Math.floor(totalCentavos / n);
    const abonos = Array(n).fill(base);
    abonos[n - 1] += totalCentavos - base * n;
    return abonos;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/fechas.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Utilidades de fecha para el calendario de cobranza.
 *
 * Regla de negocio (Mujeres Unidas):
 *   se captura el LUNES de entrega del crédito y el sistema genera
 *   automáticamente los 12 sábados de abono. El crédito vence el sábado 12.
 *
 * Todas las fechas "de calendario" se manejan a mediodía UTC para que el
 * cambio de horario o la zona del servidor nunca corra un día.
 */ __turbopack_context__.s([
    "DIA",
    ()=>DIA,
    "diaSemana",
    ()=>diaSemana,
    "diasEntre",
    ()=>diasEntre,
    "esLunes",
    ()=>esLunes,
    "esSabado",
    ()=>esSabado,
    "fechaColumna",
    ()=>fechaColumna,
    "fechaCorta",
    ()=>fechaCorta,
    "fechaISO",
    ()=>fechaISO,
    "fechaLarga",
    ()=>fechaLarga,
    "fechaVencimiento",
    ()=>fechaVencimiento,
    "generarCalendario",
    ()=>generarCalendario,
    "hoy",
    ()=>hoy,
    "parseFecha",
    ()=>parseFecha,
    "primerSabado",
    ()=>primerSabado,
    "sabadoDeCobro",
    ()=>sabadoDeCobro,
    "sumarDias",
    ()=>sumarDias
]);
const DIA = {
    DOMINGO: 0,
    LUNES: 1,
    MARTES: 2,
    MIERCOLES: 3,
    JUEVES: 4,
    VIERNES: 5,
    SABADO: 6
};
const MS_DIA = 86_400_000;
function parseFecha(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
    if (!m) throw new Error(`Fecha inválida: "${iso}". Se espera AAAA-MM-DD.`);
    const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
    if (Number.isNaN(d.getTime())) throw new Error(`Fecha inválida: "${iso}".`);
    return d;
}
function fechaISO(d) {
    return d.toISOString().slice(0, 10);
}
function sumarDias(d, dias) {
    return new Date(d.getTime() + dias * MS_DIA);
}
function diaSemana(d) {
    return d.getUTCDay();
}
function esLunes(d) {
    return diaSemana(d) === DIA.LUNES;
}
function esSabado(d) {
    return diaSemana(d) === DIA.SABADO;
}
function hoy() {
    const n = new Date();
    return new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()));
}
function primerSabado(entrega) {
    const dow = diaSemana(entrega);
    const faltan = (DIA.SABADO - dow + 7) % 7;
    return sumarDias(entrega, faltan === 0 ? 7 : faltan);
}
function sabadoDeCobro(referencia = hoy()) {
    return sumarDias(referencia, (DIA.SABADO - diaSemana(referencia) + 7) % 7);
}
function generarCalendario(entrega, semanas = 12) {
    if (semanas < 1 || semanas > 104) throw new Error("El número de semanas debe estar entre 1 y 104.");
    const inicio = primerSabado(entrega);
    const filas = [];
    for(let i = 0; i < semanas; i++){
        const fecha = sumarDias(inicio, i * 7);
        filas.push({
            semana: i + 1,
            fecha,
            iso: fechaISO(fecha)
        });
    }
    return filas;
}
function fechaVencimiento(entrega, semanas = 12) {
    const cal = generarCalendario(entrega, semanas);
    return cal[cal.length - 1].fecha;
}
const MESES = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre"
];
const DIAS = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado"
];
function fechaLarga(d) {
    return `${DIAS[d.getUTCDay()]} ${d.getUTCDate()} de ${MESES[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}
function fechaCorta(d) {
    const dd = String(d.getUTCDate()).padStart(2, "0");
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const yy = String(d.getUTCFullYear()).slice(2);
    return `${dd}/${mm}/${yy}`;
}
function fechaColumna(d) {
    const dd = String(d.getUTCDate()).padStart(2, "0");
    return `${dd} ${MESES[d.getUTCMonth()].slice(0, 3).toUpperCase()}`;
}
function diasEntre(a, b) {
    return Math.round((b.getTime() - a.getTime()) / MS_DIA);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_1qcukqb._.js.map