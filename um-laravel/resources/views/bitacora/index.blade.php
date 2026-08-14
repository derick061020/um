@extends('base')
@section('titulo', 'Bitácora')

@section('contenido')
    <div class="titulo">
        <h1>Bitácora</h1>
        <p>Todo movimiento queda firmado con su autor, fecha y hora.</p>
    </div>

    <form method="GET" class="tarjeta relleno no-imprimir"
          style="display:flex; gap:.75rem; align-items:end; flex-wrap:wrap; margin-bottom:1.5rem;">
        <div>
            <label class="etiqueta-campo" for="accion">Acción</label>
            <input type="text" id="accion" name="accion" value="{{ $accion }}" placeholder="credito.crear">
        </div>
        <div>
            <label class="etiqueta-campo" for="entidad">Entidad</label>
            <select id="entidad" name="entidad">
                <option value="">Todas</option>
                @foreach ($entidades as $e)
                    <option value="{{ $e }}" @selected($entidad === $e)>{{ $e }}</option>
                @endforeach
            </select>
        </div>
        <button type="submit" class="btn-secundario">Filtrar</button>
    </form>

    <section class="tarjeta">
        <header><h2>Movimientos</h2></header>

        @if ($movimientos->isEmpty())
            <div class="vacio"><p>Todavía no hay movimientos registrados.</p></div>
        @else
            <div class="tabla-envoltura">
                <table class="tabla">
                    <thead>
                    <tr>
                        <th>Cuándo</th>
                        <th>Quién</th>
                        <th>Acción</th>
                        <th>Entidad</th>
                        <th>Detalle</th>
                        <th>IP</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach ($movimientos as $m)
                        <tr>
                            <td style="white-space:nowrap;">{{ $m->created_at?->format('d/m/Y H:i') }}</td>
                            <td>{{ $m->usuario->nombre ?? 'sistema' }}</td>
                            <td><span class="insignia insignia-neutro">{{ $m->accion }}</span></td>
                            <td class="apagado">{{ $m->entidad }}</td>
                            <td class="apagado" style="font-size:.75rem;">{{ $m->detalleLegible() }}</td>
                            <td class="apagado" style="font-size:.75rem;">{{ $m->ip }}</td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </section>

    <div class="paginacion">{{ $movimientos->links() }}</div>
@endsection
