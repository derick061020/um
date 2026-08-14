module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/app/(sistema)/panel/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PaginaPanel,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dinero$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/dinero.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fechas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/fechas.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$creditos$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/creditos.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
const metadata = {
    title: "Panel"
};
async function PaginaPanel() {
    const sesion = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["exigirPermiso"])("reportes.ver");
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$creditos$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["actualizarVencidos"])();
    const referencia = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fechas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hoy"])();
    const sabado = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fechas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sabadoDeCobro"])(referencia);
    const [abonosSabado, activos, vencidos, atrasados, clientas, ultimos] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].abono.findMany({
            where: {
                fechaProgramada: sabado,
                credito: {
                    estado: {
                        in: [
                            "ACTIVO",
                            "VENCIDO"
                        ]
                    }
                }
            },
            select: {
                montoEsperado: true,
                montoPagado: true
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].credito.findMany({
            where: {
                estado: "ACTIVO"
            },
            select: {
                montoTotal: true,
                abonos: {
                    select: {
                        montoPagado: true
                    }
                }
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].credito.count({
            where: {
                estado: "VENCIDO"
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].abono.findMany({
            where: {
                fechaProgramada: {
                    lt: referencia
                },
                estado: {
                    not: "PAGADO"
                },
                credito: {
                    estado: {
                        in: [
                            "ACTIVO",
                            "VENCIDO"
                        ]
                    }
                }
            },
            select: {
                montoEsperado: true,
                montoPagado: true
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].cliente.count({
            where: {
                activo: true
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].pago.findMany({
            where: {
                anulado: false
            },
            orderBy: {
                creadoEn: "desc"
            },
            take: 8,
            include: {
                registradoPor: {
                    select: {
                        nombre: true
                    }
                },
                credito: {
                    select: {
                        id: true,
                        cliente: {
                            select: {
                                nombre: true
                            }
                        }
                    }
                }
            }
        })
    ]);
    const esperadoSabado = abonosSabado.reduce((s, a)=>s + a.montoEsperado, 0);
    const cobradoSabado = abonosSabado.reduce((s, a)=>s + a.montoPagado, 0);
    const carteraActiva = activos.reduce((s, c)=>{
        const pagado = c.abonos.reduce((x, a)=>x + a.montoPagado, 0);
        return s + Math.max(0, c.montoTotal - pagado);
    }, 0);
    const atrasoTotal = atrasados.reduce((s, a)=>s + (a.montoEsperado - a.montoPagado), 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Titulo"], {
                sub: `Hola, ${sesion.usuario.nombre.split(" ")[0]}. Esto es lo que hay al ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fechas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fechaLarga"])(referencia)}.`,
                children: "Panel general"
            }, void 0, false, {
                fileName: "[project]/src/app/(sistema)/panel/page.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Indicador, {
                        etiqueta: "A cobrar el sábado",
                        valor: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dinero$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pesos"])(esperadoSabado),
                        nota: `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fechas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fechaLarga"])(sabado).replace(/^\w/, (c)=>c.toUpperCase())} · cobrado ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dinero$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pesos"])(cobradoSabado)}`,
                        href: `/cobranza?fecha=${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fechas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fechaISO"])(sabado)}`
                    }, void 0, false, {
                        fileName: "[project]/src/app/(sistema)/panel/page.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Indicador, {
                        etiqueta: "Cartera activa",
                        valor: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dinero$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pesos"])(carteraActiva),
                        nota: `${activos.length} créditos vigentes`,
                        href: "/creditos"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(sistema)/panel/page.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Indicador, {
                        etiqueta: "Atraso acumulado",
                        valor: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dinero$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pesos"])(atrasoTotal),
                        tono: atrasoTotal > 0 ? "rojo" : "verde",
                        nota: `${vencidos} crédito(s) vencido(s)`,
                        href: "/creditos?estado=VENCIDO"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(sistema)/panel/page.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Indicador, {
                        etiqueta: "Clientas activas",
                        valor: String(clientas),
                        nota: "Con expediente abierto",
                        href: "/clientas"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(sistema)/panel/page.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(sistema)/panel/page.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6 lg:grid-cols-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Tarjeta"], {
                        titulo: "Últimos abonos capturados",
                        accion: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                            href: "/cobranza",
                            className: "btn-fantasma px-3 py-1.5 text-xs",
                            children: "Ir a cobranza"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(sistema)/panel/page.tsx",
                            lineNumber: 85,
                            columnNumber: 13
                        }, this),
                        children: ultimos.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Vacio"], {
                            children: "Todavía no se ha capturado ningún abono."
                        }, void 0, false, {
                            fileName: "[project]/src/app/(sistema)/panel/page.tsx",
                            lineNumber: 91,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "divide-y divide-niebla",
                            children: ultimos.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "flex items-center justify-between gap-3 px-5 py-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "min-w-0",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                                    href: `/creditos/${p.credito.id}`,
                                                    className: "truncate text-sm font-medium text-patrimonio hover:underline",
                                                    children: p.credito.cliente.nombre
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(sistema)/panel/page.tsx",
                                                    lineNumber: 97,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "truncate text-xs text-tinta/50",
                                                    children: [
                                                        p.registradoPor?.nombre ?? "—",
                                                        " · ",
                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fechas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fechaLarga"])(p.fecha).replace(/ de \d{4}$/, "")
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(sistema)/panel/page.tsx",
                                                    lineNumber: 103,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(sistema)/panel/page.tsx",
                                            lineNumber: 96,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "shrink-0 tabular-nums font-medium text-crecimiento",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dinero$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pesos"])(p.monto)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(sistema)/panel/page.tsx",
                                            lineNumber: 107,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, p.id, true, {
                                    fileName: "[project]/src/app/(sistema)/panel/page.tsx",
                                    lineNumber: 95,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/(sistema)/panel/page.tsx",
                            lineNumber: 93,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(sistema)/panel/page.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Tarjeta"], {
                        titulo: "Accesos rápidos",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-3 p-5 sm:grid-cols-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Acceso, {
                                    href: "/clientas/nueva",
                                    texto: "Dar de alta una clienta"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(sistema)/panel/page.tsx",
                                    lineNumber: 116,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Acceso, {
                                    href: "/creditos/nuevo",
                                    texto: "Registrar un crédito"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(sistema)/panel/page.tsx",
                                    lineNumber: 117,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Acceso, {
                                    href: "/cobranza",
                                    texto: "Capturar la cobranza"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(sistema)/panel/page.tsx",
                                    lineNumber: 118,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Acceso, {
                                    href: "/grupos",
                                    texto: "Administrar grupos"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(sistema)/panel/page.tsx",
                                    lineNumber: 119,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Acceso, {
                                    href: "/corte",
                                    texto: "Ver el cobro del día"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(sistema)/panel/page.tsx",
                                    lineNumber: 120,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Acceso, {
                                    href: "/usuarios",
                                    texto: "Usuarios del sistema"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(sistema)/panel/page.tsx",
                                    lineNumber: 121,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(sistema)/panel/page.tsx",
                            lineNumber: 115,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(sistema)/panel/page.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(sistema)/panel/page.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(sistema)/panel/page.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
function Indicador({ etiqueta, valor, nota, href, tono = "neutro" }) {
    const color = {
        neutro: "text-patrimonio",
        verde: "text-crecimiento",
        rojo: "text-riesgo"
    }[tono];
    const contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs font-semibold uppercase tracking-wider text-patrimonio/60",
                children: etiqueta
            }, void 0, false, {
                fileName: "[project]/src/app/(sistema)/panel/page.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: `mt-1 font-display text-3xl tabular-nums ${color}`,
                children: valor
            }, void 0, false, {
                fileName: "[project]/src/app/(sistema)/panel/page.tsx",
                lineNumber: 146,
                columnNumber: 7
            }, this),
            nota ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1 text-xs text-tinta/50",
                children: nota
            }, void 0, false, {
                fileName: "[project]/src/app/(sistema)/panel/page.tsx",
                lineNumber: 147,
                columnNumber: 15
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(sistema)/panel/page.tsx",
        lineNumber: 144,
        columnNumber: 5
    }, this);
    return href ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
        href: href,
        className: "tarjeta block px-5 py-4 transition hover:border-salvia hover:shadow",
        children: contenido
    }, void 0, false, {
        fileName: "[project]/src/app/(sistema)/panel/page.tsx",
        lineNumber: 152,
        columnNumber: 5
    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "tarjeta px-5 py-4",
        children: contenido
    }, void 0, false, {
        fileName: "[project]/src/app/(sistema)/panel/page.tsx",
        lineNumber: 156,
        columnNumber: 5
    }, this);
}
function Acceso({ href, texto }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
        href: href,
        className: "rounded-lg border border-niebla px-4 py-3 text-sm font-medium text-patrimonio transition hover:border-salvia hover:bg-marfil",
        children: texto
    }, void 0, false, {
        fileName: "[project]/src/app/(sistema)/panel/page.tsx",
        lineNumber: 162,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/(sistema)/panel/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/(sistema)/panel/page.tsx [app-rsc] (ecmascript)"));
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
"[project]/src/lib/creditos.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "actualizarVencidos",
    ()=>actualizarVencidos,
    "anularUltimoPago",
    ()=>anularUltimoPago,
    "crearCredito",
    ()=>crearCredito,
    "estadoDeAbono",
    ()=>estadoDeAbono,
    "marcarAbonoCompleto",
    ()=>marcarAbonoCompleto,
    "registrarPago",
    ()=>registrarPago,
    "resumirCredito",
    ()=>resumirCredito
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fechas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/fechas.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dinero$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/dinero.ts [app-rsc] (ecmascript)");
;
;
;
async function crearCredito(datos) {
    const entrega = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fechas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseFecha"])(datos.fechaEntregaISO);
    const calendario = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fechas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generarCalendario"])(entrega, datos.numSemanas);
    const montos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dinero$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["repartirAbonos"])(datos.montoTotal, datos.numSemanas);
    const abonoSemanal = montos[0];
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].$transaction(async (tx)=>{
        const credito = await tx.credito.create({
            data: {
                clienteId: datos.clienteId,
                grupoId: datos.grupoId ?? null,
                montoPrestado: datos.montoPrestado,
                montoTotal: datos.montoTotal,
                abonoSemanal,
                numSemanas: datos.numSemanas,
                fechaEntrega: entrega,
                fechaPrimerAbono: calendario[0].fecha,
                fechaVencimiento: calendario[calendario.length - 1].fecha,
                notas: datos.notas ?? null,
                capturadoPorId: datos.capturadoPorId
            }
        });
        await tx.abono.createMany({
            data: calendario.map((fila, i)=>({
                    creditoId: credito.id,
                    semana: fila.semana,
                    fechaProgramada: fila.fecha,
                    montoEsperado: montos[i]
                }))
        });
        return credito;
    });
}
async function registrarPago(opciones) {
    const { abonoId, monto, nota, registradoPorId } = opciones;
    if (monto <= 0) throw new Error("El monto del abono debe ser mayor a cero.");
    const fecha = opciones.fechaISO ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fechas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseFecha"])(opciones.fechaISO) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fechas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hoy"])();
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].$transaction(async (tx)=>{
        const abono = await tx.abono.findUnique({
            where: {
                id: abonoId
            }
        });
        if (!abono) throw new Error("No se encontró el abono.");
        await tx.pago.create({
            data: {
                creditoId: abono.creditoId,
                abonoId: abono.id,
                monto,
                fecha,
                nota: nota ?? null,
                registradoPorId
            }
        });
        const pagado = abono.montoPagado + monto;
        const actualizado = await tx.abono.update({
            where: {
                id: abono.id
            },
            data: {
                montoPagado: pagado,
                estado: estadoDeAbono(pagado, abono.montoEsperado),
                pagadoEn: pagado >= abono.montoEsperado ? new Date() : abono.pagadoEn
            }
        });
        await refrescarCredito(tx, abono.creditoId);
        return actualizado;
    });
}
async function marcarAbonoCompleto(opciones) {
    const abono = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].abono.findUnique({
        where: {
            id: opciones.abonoId
        }
    });
    if (!abono) throw new Error("No se encontró el abono.");
    const falta = abono.montoEsperado - abono.montoPagado;
    if (falta <= 0) return abono;
    return registrarPago({
        ...opciones,
        monto: falta,
        nota: "Abono completo"
    });
}
async function anularUltimoPago(opciones) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].$transaction(async (tx)=>{
        const abono = await tx.abono.findUnique({
            where: {
                id: opciones.abonoId
            }
        });
        if (!abono) throw new Error("No se encontró el abono.");
        const ultimo = await tx.pago.findFirst({
            where: {
                abonoId: abono.id,
                anulado: false
            },
            orderBy: {
                creadoEn: "desc"
            }
        });
        if (!ultimo) throw new Error("Este abono no tiene movimientos que anular.");
        await tx.pago.update({
            where: {
                id: ultimo.id
            },
            data: {
                anulado: true,
                nota: `${ultimo.nota ?? ""} (anulado)`.trim()
            }
        });
        const pagado = Math.max(0, abono.montoPagado - ultimo.monto);
        const actualizado = await tx.abono.update({
            where: {
                id: abono.id
            },
            data: {
                montoPagado: pagado,
                estado: estadoDeAbono(pagado, abono.montoEsperado),
                pagadoEn: pagado >= abono.montoEsperado ? abono.pagadoEn : null
            }
        });
        await refrescarCredito(tx, abono.creditoId);
        return actualizado;
    });
}
function estadoDeAbono(pagado, esperado) {
    if (pagado <= 0) return "PENDIENTE";
    if (pagado >= esperado) return "PAGADO";
    return "PARCIAL";
}
/** Recalcula si el crédito quedó liquidado o vencido tras un movimiento. */ async function refrescarCredito(tx, creditoId) {
    const credito = await tx.credito.findUnique({
        where: {
            id: creditoId
        },
        include: {
            abonos: {
                select: {
                    montoPagado: true
                }
            }
        }
    });
    if (!credito || credito.estado === "CANCELADO") return;
    const pagado = credito.abonos.reduce((s, a)=>s + a.montoPagado, 0);
    const liquidado = pagado >= credito.montoTotal;
    const vencido = !liquidado && credito.fechaVencimiento < (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fechas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hoy"])();
    const estado = liquidado ? "LIQUIDADO" : vencido ? "VENCIDO" : "ACTIVO";
    if (estado !== credito.estado) {
        await tx.credito.update({
            where: {
                id: creditoId
            },
            data: {
                estado,
                liquidadoEn: liquidado ? new Date() : null
            }
        });
    }
}
function resumirCredito(credito, abonos, referencia = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fechas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hoy"])()) {
    const totalPagado = abonos.reduce((s, a)=>s + a.montoPagado, 0);
    const vencidos = abonos.filter((a)=>a.fechaProgramada <= referencia);
    const esperadoALaFecha = vencidos.reduce((s, a)=>s + a.montoEsperado, 0);
    const pagadoDeVencidos = vencidos.reduce((s, a)=>s + a.montoPagado, 0);
    return {
        totalPagado,
        saldo: Math.max(0, credito.montoTotal - totalPagado),
        abonosPagados: abonos.filter((a)=>a.estado === "PAGADO").length,
        abonosPendientes: abonos.filter((a)=>a.estado !== "PAGADO").length,
        atrasoCentavos: Math.max(0, esperadoALaFecha - pagadoDeVencidos),
        semanasAtrasadas: vencidos.filter((a)=>a.estado !== "PAGADO").length
    };
}
async function actualizarVencidos() {
    const { count } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].credito.updateMany({
        where: {
            estado: "ACTIVO",
            fechaVencimiento: {
                lt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fechas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hoy"])()
            }
        },
        data: {
            estado: "VENCIDO"
        }
    });
    return count;
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

//# sourceMappingURL=%5Broot-of-the-server%5D__0vl6rs9._.js.map