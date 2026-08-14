/**
 * Pruebas de las reglas de negocio críticas.
 *
 *   npm run pruebas
 *
 * Trabajan sobre la base de datos configurada en .env y limpian sus propios
 * datos al terminar, así que se pueden correr las veces que haga falta.
 */
import { PrismaClient } from "@prisma/client";

import {
  generarCalendario,
  fechaVencimiento,
  parseFecha,
  fechaISO,
  esSabado,
  primerSabado,
  diasEntre,
} from "../src/lib/fechas.js";
import { aCentavos, pesos, repartirAbonos } from "../src/lib/dinero.js";
import { crearCredito, marcarAbonoCompleto, registrarPago, resumirCredito } from "../src/lib/creditos.js";

process.loadEnvFile?.(".env");

const db = new PrismaClient();

let pasadas = 0;
const fallas: string[] = [];

function ok(titulo: string, condicion: boolean, detalle = "") {
  if (condicion) {
    pasadas++;
    console.log(`  ✓ ${titulo}`);
  } else {
    fallas.push(`${titulo}${detalle ? ` — ${detalle}` : ""}`);
    console.log(`  ✗ ${titulo}${detalle ? ` — ${detalle}` : ""}`);
  }
}

function igual<T>(titulo: string, obtenido: T, esperado: T) {
  ok(titulo, Object.is(obtenido, esperado), `obtenido ${String(obtenido)}, esperado ${String(esperado)}`);
}

// ---------------------------------------------------------------------------

function pruebasDeFechas() {
  console.log("\nCalendario de abonos");

  // Lunes 17 de agosto de 2026.
  const lunes = parseFecha("2026-08-17");
  const cal = generarCalendario(lunes, 12);

  igual("genera 12 semanas", cal.length, 12);
  ok("todas las fechas caen en sábado", cal.every((f) => esSabado(f.fecha)));
  igual("el primer abono es el sábado siguiente al lunes", cal[0]!.iso, "2026-08-22");
  igual("hay 5 días entre la entrega y el primer abono", diasEntre(lunes, cal[0]!.fecha), 5);
  ok(
    "los abonos van de 7 en 7 días",
    cal.every((f, i) => i === 0 || diasEntre(cal[i - 1]!.fecha, f.fecha) === 7),
  );
  igual("el sábado 12 es el vencimiento", fechaISO(fechaVencimiento(lunes, 12)), cal[11]!.iso);
  igual("vence el 7 de noviembre de 2026", fechaISO(fechaVencimiento(lunes, 12)), "2026-11-07");

  // Si se entrega en sábado, el primer abono es hasta el sábado siguiente.
  igual("entrega en sábado ⇒ primer abono a los 7 días", fechaISO(primerSabado(parseFecha("2026-08-22"))), "2026-08-29");

  // El cambio de horario no debe correr las fechas.
  const octubre = generarCalendario(parseFecha("2026-10-19"), 12);
  ok("el horario de verano no corre las fechas", octubre.every((f) => esSabado(f.fecha)));
}

function pruebasDeDinero() {
  console.log("\nImportes");

  igual("$3,000 son 300000 centavos", aCentavos("3000"), 300_000);
  igual("acepta separadores y símbolo", aCentavos("$3,600.50"), 360_050);

  const parejo = repartirAbonos(360_000, 12);
  igual("12 abonos parejos de $300", parejo[0], 30_000);
  igual("la suma cuadra con el total", parejo.reduce((s, v) => s + v, 0), 360_000);

  const disparejo = repartirAbonos(100_000, 12);
  igual("el redondeo se carga al último abono", disparejo.reduce((s, v) => s + v, 0), 100_000);
  ok("el último abono absorbe el sobrante", disparejo[11]! > disparejo[0]!);
  igual("formato mexicano", pesos(100_000), "$1,000.00");
}

async function pruebasDeCredito() {
  console.log("\nCiclo de vida del crédito");

  const usuario = await db.usuario.findFirst({ where: { rol: "CAPTURISTA" } });
  if (!usuario) {
    fallas.push("no hay usuario capturista — corre `npm run seed` antes de las pruebas");
    return;
  }

  const clienta = await db.cliente.create({
    data: { nombre: `PRUEBA ${Date.now()}`, capturadoPorId: usuario.id },
  });

  try {
    const credito = await crearCredito({
      clienteId: clienta.id,
      montoPrestado: aCentavos("3000"),
      montoTotal: aCentavos("3600"),
      numSemanas: 12,
      fechaEntregaISO: "2026-08-17",
      capturadoPorId: usuario.id,
    });

    const abonos = await db.abono.findMany({
      where: { creditoId: credito.id },
      orderBy: { semana: "asc" },
    });

    igual("se crearon 12 abonos", abonos.length, 12);
    igual("el abono semanal es $300", credito.abonoSemanal, 30_000);
    igual("el primer abono queda el 22/08/2026", fechaISO(abonos[0]!.fechaProgramada), "2026-08-22");
    igual("el vencimiento queda el 07/11/2026", fechaISO(credito.fechaVencimiento), "2026-11-07");
    igual(
      "la suma de los abonos es el total",
      abonos.reduce((s, a) => s + a.montoEsperado, 0),
      credito.montoTotal,
    );

    // Abono parcial
    await registrarPago({ abonoId: abonos[0]!.id, monto: aCentavos("150"), registradoPorId: usuario.id });
    const parcial = await db.abono.findUniqueOrThrow({ where: { id: abonos[0]!.id } });
    igual("un abono incompleto queda PARCIAL", parcial.estado, "PARCIAL");

    // Se completa el mismo abono
    await marcarAbonoCompleto({ abonoId: abonos[0]!.id, registradoPorId: usuario.id });
    const completo = await db.abono.findUniqueOrThrow({ where: { id: abonos[0]!.id } });
    igual("al cubrirlo queda PAGADO", completo.estado, "PAGADO");
    igual("no se cobra de más", completo.montoPagado, completo.montoEsperado);

    // Atraso a la fecha de la semana 3
    const resumenParcial = resumirCredito(
      credito,
      await db.abono.findMany({ where: { creditoId: credito.id } }),
      parseFecha("2026-09-05"),
    );
    igual("marca 2 semanas de atraso", resumenParcial.semanasAtrasadas, 2);
    igual("el atraso son $600", resumenParcial.atrasoCentavos, 60_000);

    // Se liquida el resto
    for (const a of abonos.slice(1)) {
      await marcarAbonoCompleto({ abonoId: a.id, registradoPorId: usuario.id });
    }
    const liquidado = await db.credito.findUniqueOrThrow({ where: { id: credito.id } });
    igual("al cubrir todo queda LIQUIDADO", liquidado.estado, "LIQUIDADO");

    const resumenFinal = resumirCredito(
      liquidado,
      await db.abono.findMany({ where: { creditoId: credito.id } }),
      parseFecha("2026-11-07"),
    );
    igual("el saldo queda en cero", resumenFinal.saldo, 0);
    igual("no queda atraso", resumenFinal.atrasoCentavos, 0);
    igual("el total pagado es $3,600", resumenFinal.totalPagado, 360_000);
  } finally {
    await db.cliente.delete({ where: { id: clienta.id } }); // arrastra crédito, abonos y pagos
  }
}

// ---------------------------------------------------------------------------

pruebasDeFechas();
pruebasDeDinero();
await pruebasDeCredito();
await db.$disconnect();

console.log(`\n${pasadas} prueba(s) correcta(s), ${fallas.length} falla(s).`);
if (fallas.length > 0) {
  console.error("\nFallas:\n" + fallas.map((f) => `  · ${f}`).join("\n"));
  process.exit(1);
}
