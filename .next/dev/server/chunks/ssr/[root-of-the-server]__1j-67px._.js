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
"[project]/.next-internal/server/app/entrar/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/entrar/acciones.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "60bdf595e6372a6ccf375d7cf87296c48a64e8ef91",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$entrar$2f$acciones$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["entrar"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$entrar$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$entrar$2f$acciones$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/entrar/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/entrar/acciones.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$entrar$2f$acciones$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/entrar/acciones.ts [app-rsc] (ecmascript)");
}),
"[project]/.next-internal/server/app/entrar/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/entrar/acciones.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$entrar$2f$acciones$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/entrar/acciones.ts [app-rsc] (ecmascript)");
;
}),
"[project]/src/app/entrar/acciones.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"60bdf595e6372a6ccf375d7cf87296c48a64e8ef91":{"name":"entrar"}},"src/app/entrar/acciones.ts",""] */ __turbopack_context__.s([
    "entrar",
    ()=>entrar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auditoria$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auditoria.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rbac$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/rbac.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
const Entrada = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    usuario: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1, "Escribe tu usuario.").max(60),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Escribe tu contraseña.").max(200)
});
async function entrar(_prev, form) {
    const datos = Entrada.safeParse({
        usuario: form.get("usuario"),
        password: form.get("password")
    });
    if (!datos.success) {
        return {
            error: datos.error.issues[0].message
        };
    }
    const { usuario, password } = datos.data;
    const cuenta = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].usuario.findUnique({
        where: {
            usuario: usuario.toLowerCase()
        }
    });
    // Mensaje idéntico en ambos casos para no revelar qué usuarios existen.
    const generico = "Usuario o contraseña incorrectos.";
    if (!cuenta) {
        // Comparación falsa para que el tiempo de respuesta no delate la cuenta.
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verificarPassword"])(password, "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv");
        return {
            error: generico
        };
    }
    if (!await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verificarPassword"])(password, cuenta.passwordHash)) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auditoria$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditar"])({
            usuarioId: cuenta.id,
            accion: "sesion.fallida",
            entidad: "Usuario",
            entidadId: cuenta.id
        });
        return {
            error: generico
        };
    }
    if (!cuenta.activo) {
        return {
            error: "Tu cuenta está desactivada. Habla con la dirección."
        };
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["limpiarSesionesVencidas"])();
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["iniciarSesion"])(cuenta.id);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auditoria$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditar"])({
        usuarioId: cuenta.id,
        accion: "sesion.iniciar",
        entidad: "Usuario",
        entidadId: cuenta.id
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rbac$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rutaInicio"])(cuenta.rol));
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    entrar
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(entrar, "60bdf595e6372a6ccf375d7cf87296c48a64e8ef91", null);
}),
"[project]/src/lib/auditoria.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "auditar",
    ()=>auditar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-rsc] (ecmascript)");
;
;
;
;
async function auditar(r) {
    try {
        const h = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["headers"])();
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].auditoria.create({
            data: {
                usuarioId: r.usuarioId ?? null,
                accion: r.accion,
                entidad: r.entidad,
                entidadId: r.entidadId ?? null,
                detalle: r.detalle ?? null,
                ip: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ipCliente"])(h)
            }
        });
    } catch (e) {
        console.error("[auditoría] no se pudo registrar:", r.accion, e);
    }
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

//# sourceMappingURL=%5Broot-of-the-server%5D__1j-67px._.js.map