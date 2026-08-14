/**
 * Datos de arranque: las cuatro cuentas de rol, dos grupos de ejemplo y
 * un puñado de clientas con crédito, para poder probar el sistema completo.
 *
 * Ejecutar con:  npm run seed
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

process.loadEnvFile?.(".env");

const db = new PrismaClient();

const MS_DIA = 86_400_000;

function fecha(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

function sumarDias(d: Date, n: number): Date {
  return new Date(d.getTime() + n * MS_DIA);
}

function primerSabado(entrega: Date): Date {
  const faltan = (6 - entrega.getUTCDay() + 7) % 7;
  return sumarDias(entrega, faltan === 0 ? 7 : faltan);
}

/** Lunes más reciente, tomando como base la fecha del sistema. */
function lunesReciente(semanasAtras: number): Date {
  const n = new Date();
  const h = new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()));
  const retroceso = (h.getUTCDay() - 1 + 7) % 7;
  return sumarDias(h, -retroceso - semanasAtras * 7);
}

async function main() {
  console.log("Sembrando datos de arranque…");

  const hash = await bcrypt.hash("Cambiar123", 12);

  const principal = await db.usuario.upsert({
    where: { usuario: "direccion" },
    update: {},
    create: { nombre: "Dirección Mujeres Unidas", usuario: "direccion", passwordHash: hash, rol: "PRINCIPAL" },
  });

  const supervisor = await db.usuario.upsert({
    where: { usuario: "viridiana" },
    update: {},
    create: {
      nombre: "Viridiana Ramírez",
      usuario: "viridiana",
      passwordHash: hash,
      rol: "SUPERVISOR",
      creadoPorId: principal.id,
    },
  });

  const capturista = await db.usuario.upsert({
    where: { usuario: "capturista" },
    update: {},
    create: {
      nombre: "Ana Lucía Sandoval",
      usuario: "capturista",
      passwordHash: hash,
      rol: "CAPTURISTA",
      creadoPorId: principal.id,
    },
  });

  const encargada = await db.usuario.upsert({
    where: { usuario: "encargada" },
    update: {},
    create: {
      nombre: "Rosa María Peña",
      usuario: "encargada",
      passwordHash: hash,
      rol: "ENCARGADA",
      creadoPorId: principal.id,
    },
  });

  const viri = await db.grupo.upsert({
    where: { nombre: "VIRI 1" },
    update: {},
    create: {
      nombre: "VIRI 1",
      plaza: "Mazatlán",
      supervisorId: supervisor.id,
      encargadaId: encargada.id,
      creadoPorId: supervisor.id,
    },
  });

  const chihuahua = await db.grupo.upsert({
    where: { nombre: "CHIHUAHUA 1" },
    update: {},
    create: {
      nombre: "CHIHUAHUA 1",
      plaza: "Chihuahua",
      supervisorId: supervisor.id,
      encargadaId: encargada.id,
      creadoPorId: supervisor.id,
    },
  });

  const muestra = [
    { nombre: "María Guadalupe Torres Ochoa", grupo: viri, prestado: 3_000_00, total: 3_600_00, aval: "José Luis Torres" },
    { nombre: "Alejandra Núñez Beltrán", grupo: viri, prestado: 5_000_00, total: 6_000_00, aval: "Marisol Núñez" },
    { nombre: "Claudia Elena Vega Ruiz", grupo: viri, prestado: 2_000_00, total: 2_400_00, aval: "Ramón Vega" },
    { nombre: "Silvia Patricia Ramos León", grupo: chihuahua, prestado: 4_000_00, total: 4_800_00, aval: "Elba Ramos" },
    { nombre: "Norma Angélica Duarte Gil", grupo: chihuahua, prestado: 6_000_00, total: 7_200_00, aval: "Sergio Duarte" },
  ];

  // Créditos entregados hace 3 semanas: ya tienen sábados vencidos.
  const entrega = lunesReciente(3);

  for (const [i, m] of muestra.entries()) {
    const clienta = await db.cliente.create({
      data: {
        nombre: m.nombre,
        telefono: `66912345${String(i).padStart(2, "0")}`,
        domicilio: `Calle ${10 + i} #${100 + i * 7}`,
        colonia: "Centro",
        ciudad: m.grupo.plaza,
        grupoId: m.grupo.id,
        avalNombre: m.aval,
        avalTelefono: `66998765${String(i).padStart(2, "0")}`,
        avalParentesco: i % 2 === 0 ? "Esposo" : "Hermana",
        avalDomicilio: `Avenida ${20 + i} #${200 + i * 5}`,
        avalColonia: "Centro",
        avalCiudad: m.grupo.plaza,
        capturadoPorId: capturista.id,
      },
    });

    const semanas = 12;
    const base = Math.floor(m.total / semanas);
    const montos = Array.from({ length: semanas }, (_, k) =>
      k === semanas - 1 ? base + (m.total - base * semanas) : base,
    );
    const inicio = primerSabado(entrega);

    const credito = await db.credito.create({
      data: {
        clienteId: clienta.id,
        grupoId: m.grupo.id,
        montoPrestado: m.prestado,
        montoTotal: m.total,
        abonoSemanal: montos[0]!,
        numSemanas: semanas,
        fechaEntrega: entrega,
        fechaPrimerAbono: inicio,
        fechaVencimiento: sumarDias(inicio, (semanas - 1) * 7),
        capturadoPorId: capturista.id,
        abonos: {
          create: montos.map((monto, k) => ({
            semana: k + 1,
            fechaProgramada: sumarDias(inicio, k * 7),
            montoEsperado: monto,
          })),
        },
      },
      include: { abonos: { orderBy: { semana: "asc" } } },
    });

    // Historial de pago: la mayoría al corriente, una clienta con atraso.
    const pagadas = i === 4 ? 1 : 3;
    for (const abono of credito.abonos.slice(0, pagadas)) {
      await db.pago.create({
        data: {
          creditoId: credito.id,
          abonoId: abono.id,
          monto: abono.montoEsperado,
          fecha: abono.fechaProgramada,
          registradoPorId: capturista.id,
        },
      });
      await db.abono.update({
        where: { id: abono.id },
        data: { montoPagado: abono.montoEsperado, estado: "PAGADO", pagadoEn: abono.fechaProgramada },
      });
    }
  }

  console.log("\nListo. Cuentas de acceso (contraseña: Cambiar123):");
  console.table([
    { rol: "Principal", usuario: principal.usuario },
    { rol: "Supervisor", usuario: supervisor.usuario },
    { rol: "Capturista", usuario: capturista.usuario },
    { rol: "Encargada", usuario: encargada.usuario },
  ]);
  console.log("\nCambia estas contraseñas antes de poner el sistema en producción.\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
