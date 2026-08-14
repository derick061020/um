module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
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
"[project]/src/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Raiz
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rbac$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/rbac.ts [app-rsc] (ecmascript)");
;
;
;
async function Raiz() {
    const sesion = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sesionActual"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(sesion ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rbac$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rutaInicio"])(sesion.usuario.rol) : "/entrar");
}
}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/page.tsx [app-rsc] (ecmascript)"));
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

//# sourceMappingURL=%5Broot-of-the-server%5D__0u4845j._.js.map