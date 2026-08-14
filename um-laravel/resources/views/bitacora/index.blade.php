@extends('base')
@section('titulo', 'Bitácora')

@section('contenido')
    <h1>Bitácora</h1>
    <p class="sub">Todo movimiento queda firmado con su autor, fecha y hora.</p>

    <form method="GET" class="tarjeta no-imprimir" style="display:flex; gap:10px; align-items:end; flex-wrap:wrap;">
        <div>
            <label for="accion">Acción</label>
            <input type="text" id="accion" name="accion" value="{{ $accion }}" placeholder="credito.crear">
        </div>
        <div>
            <label for="entidad">Entidad</label>
            <select id="entidad" name="entidad">
                <option value="">Todas</option>
                @foreach ($entidades as $e)
                    <option value="{{ $e }}" @selected($entidad === $e)>{{ $e }}</option>
                @endforeach
            </select>
        </div>
        <button type="submit" class="btn btn-secundario">Filtrar</button>
    </form>

    <div class="tabla-envoltura tarjeta" style="padding:0;">
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
            @forelse ($movimientos as $m)
                <tr>
                    <td>{{ $m->created_at?->format('d/m/Y H:i') }}</td>
                    <td>{{ $m->usuario->nombre ?? 'sistema' }}</td>
                    <td><code>{{ $m->accion }}</code></td>
                    <td class="apagado">{{ $m->entidad }}</td>
                    <td class="apagado" style="font-size:12px;">{{ $m->detalleLegible() }}</td>
                    <td class="apagado" style="font-size:12px;">{{ $m->ip }}</td>
                </tr>
            @empty
                <tr><td colspan="6" class="apagado">Todavía no hay movimientos registrados.</td></tr>
            @endforelse
            </tbody>
        </table>
    </div>

    <div class="paginacion">{{ $movimientos->links() }}</div>
@endsection
