module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/app/(sistema)/corte/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PaginaCorte,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dinero$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/dinero.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fechas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/fechas.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
const metadata = {
    title: "Cobro del día"
};
async function PaginaCorte({ searchParams }) {
    const sesion = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["exigirPermiso"])("corte.dia");
    const { fecha } = await searchParams;
    // Por omisión muestra el sábado de cobro vigente: entre semana permite
    // preparar el efectivo del día, y el mismo sábado es el total en curso.
    const referencia = fecha ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fechas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseFecha"])(fecha) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fechas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sabadoDeCobro"])();
    // Si la encargada tiene grupos asignados, solo ve el cobro de esos grupos.
    const misGrupos = sesion.usuario.rol === "ENCARGADA" ? await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].grupo.findMany({
        where: {
            encargadaId: sesion.usuario.id
        },
        select: {
            id: true,
            nombre: true
        }
    }) : [];
    const filtroGrupo = misGrupos.length > 0 ? {
        grupoId: {
            in: misGrupos.map((g)=>g.id)
        }
    } : {};
    const abonos = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].abono.findMany({
        where: {
            fechaProgramada: referencia,
            credito: {
                estado: {
                    in: [
                        "ACTIVO",
                        "VENCIDO"
                    ]
                },
                ...filtroGrupo
            }
        },
        select: {
            montoEsperado: true,
            montoPagado: true,
            credito: {
                select: {
                    grupo: {
                        select: {
                            id: true,
                            nombre: true
                        }
                    }
                }
            }
        }
    });
    const esperado = abonos.reduce((s, a)=>s + a.montoEsperado, 0);
    const cobrado = abonos.reduce((s, a)=>s + a.montoPagado, 0);
    const falta = Math.max(0, esperado - cobrado);
    // Desglose por grupo, sin datos personales.
    const porGrupo = new Map();
    for (const a of abonos){
        const clave = a.credito.grupo?.id ?? "sin-grupo";
        const actual = porGrupo.get(clave) ?? {
            nombre: a.credito.grupo?.nombre ?? "Sin grupo",
            esperado: 0,
            cobrado: 0
        };
        actual.esperado += a.montoEsperado;
        actual.cobrado += a.montoPagado;
        porGrupo.set(clave, actual);
    }
    const grupos = [
        ...porGrupo.values()
    ].sort((a, b)=>b.esperado - a.esperado);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mx-auto max-w-2xl",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "tarjeta overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-patrimonio px-8 py-12 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs uppercase tracking-[0.25em] text-salvia",
                                children: "Total a cobrar"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                                lineNumber: 72,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-3 font-display text-6xl leading-none text-white tabular-nums sm:text-7xl",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dinero$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pesos"])(esperado)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                                lineNumber: 73,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-4 font-serif text-base text-salvia",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fechas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fechaLarga"])(referencia)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                                lineNumber: 76,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 divide-x divide-niebla border-b border-niebla",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-6 py-5 text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-semibold uppercase tracking-wider text-patrimonio/60",
                                        children: "Cobrado"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                                        lineNumber: 81,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 font-display text-2xl text-crecimiento tabular-nums",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dinero$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pesos"])(cobrado)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                                        lineNumber: 82,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                                lineNumber: 80,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-6 py-5 text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-semibold uppercase tracking-wider text-patrimonio/60",
                                        children: "Falta"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                                        lineNumber: 85,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: `mt-1 font-display text-2xl tabular-nums ${falta > 0 ? "text-riesgo" : "text-crecimiento"}`,
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dinero$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pesos"])(falta)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                                        lineNumber: 86,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                                lineNumber: 84,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        className: "flex items-end gap-3 px-6 py-5",
                        action: "/corte",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "etiqueta",
                                        htmlFor: "fecha",
                                        children: "Consultar otro día"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                                        lineNumber: 98,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "fecha",
                                        type: "date",
                                        name: "fecha",
                                        defaultValue: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fechas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fechaISO"])(referencia),
                                        className: "campo"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                                        lineNumber: 101,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                                lineNumber: 97,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: "btn-secundario",
                                children: "Ver"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                                lineNumber: 109,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            grupos.length > 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Tarjeta"], {
                    titulo: "Por grupo",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "divide-y divide-niebla",
                        children: grupos.map((g)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "flex items-center justify-between px-5 py-3.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-patrimonio",
                                        children: g.nombre
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                                        lineNumber: 121,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "tabular-nums text-tinta/70",
                                        children: [
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dinero$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pesos"])(g.cobrado),
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-tinta/35",
                                                children: "de"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                                                lineNumber: 123,
                                                columnNumber: 40
                                            }, this),
                                            " ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dinero$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pesos"])(g.esperado)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                                        lineNumber: 122,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, g.nombre, true, {
                                fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                                lineNumber: 120,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                        lineNumber: 118,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                    lineNumber: 117,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                lineNumber: 116,
                columnNumber: 9
            }, this) : null,
            abonos.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-6 text-center text-sm text-tinta/55",
                children: [
                    "No hay cobros programados para este día.",
                    misGrupos.length === 0 && sesion.usuario.rol === "ENCARGADA" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                                lineNumber: 137,
                                columnNumber: 15
                            }, this),
                            "Pide a tu supervisor que te asigne un grupo."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                        lineNumber: 136,
                        columnNumber: 13
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                lineNumber: 133,
                columnNumber: 9
            }, this) : null,
            sesion.usuario.rol !== "ENCARGADA" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-6 text-center text-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                    href: "/cobranza",
                    className: "text-patrimonio underline",
                    children: "Ir a la captura de cobranza"
                }, void 0, false, {
                    fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                    lineNumber: 146,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(sistema)/corte/page.tsx",
                lineNumber: 145,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(sistema)/corte/page.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/(sistema)/corte/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/(sistema)/corte/page.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/components/ui.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
;
;
function Titulo({ children, sub }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mb-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "font-display text-3xl leading-tight text-patrimonio sm:text-4xl",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui.tsx",
                lineNumber: 7,
                columnNumber: 7
            }, this),
            sub ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
function Tarjeta({ titulo, accion, children, className = "" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: `tarjeta ${className}`,
        children: [
            titulo ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "flex items-center justify-between gap-3 border-b border-niebla px-5 py-3.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
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
function Dato({ etiqueta, valor }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                className: "text-xs font-semibold uppercase tracking-wider text-patrimonio/60",
                children: etiqueta
            }, void 0, false, {
                fileName: "[project]/src/components/ui.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                className: "mt-0.5 text-sm text-tinta",
                children: valor || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
const TONOS = {
    verde: "bg-crecimiento/10 text-crecimiento",
    oro: "bg-oro/20 text-[#7a6122]",
    rojo: "bg-riesgo/10 text-riesgo",
    neutro: "bg-niebla text-tinta/70",
    tinta: "bg-patrimonio text-white"
};
function Insignia({ children, tono = "neutro" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `insignia ${TONOS[tono]}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui.tsx",
        lineNumber: 61,
        columnNumber: 10
    }, this);
}
function Vacio({ children, accion }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center gap-3 px-6 py-14 text-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
function Aviso({ tono = "info", children }) {
    const estilos = {
        info: "border-salvia bg-salvia/20 text-patrimonio",
        error: "border-riesgo/30 bg-riesgo/5 text-riesgo",
        exito: "border-crecimiento/30 bg-crecimiento/5 text-crecimiento"
    }[tono];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-lg border px-4 py-3 text-sm ${estilos}`,
        role: tono === "error" ? "alert" : undefined,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui.tsx",
        lineNumber: 86,
        columnNumber: 5
    }, this);
}
function Migas({ items }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "mb-4 flex flex-wrap items-center gap-1.5 text-xs text-tinta/55",
        children: items.map((it, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "flex items-center gap-1.5",
                children: [
                    i > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": true,
                        children: "/"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui.tsx",
                        lineNumber: 97,
                        columnNumber: 20
                    }, this) : null,
                    it.href ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        href: it.href,
                        className: "hover:text-patrimonio hover:underline",
                        children: it.texto
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui.tsx",
                        lineNumber: 99,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
}),
"[project]/src/lib/dinero.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/lib/fechas.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__13kjgnn._.js.map