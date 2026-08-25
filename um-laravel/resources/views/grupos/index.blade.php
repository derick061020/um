@extends('base')
@section('titulo', 'Grupos')

@section('contenido')
    <div class="titulo">
        <h1>Grupos</h1>
        <p>Cada grupo tiene un supervisor y una encargada.</p>
    </div>

    <section class="tarjeta" style="margin-bottom:1.5rem;">
        <header><h2>Grupos registrados</h2></header>

        @if ($grupos->isEmpty())
            <div class="vacio"><p>Todavía no hay grupos. Crea el primero abajo.</p></div>
        @else
            <div class="tabla-envoltura">
                <table class="tabla">
                    <thead>
                    <tr>
                        <th>Código</th>
                        <th>Grupo</th>
                        <th>Ubicación</th>
                        <th>Supervisor</th>
                        <th>Encargada</th>
                        <th class="num">Clientas</th>
                        <th>Estado</th>
                        @can('grupos.editar')<th class="no-imprimir">Acciones</th>@endcan
                    </tr>
                    </thead>
                    <tbody>
                    @foreach ($grupos as $g)
                        <tr>
                            <td class="apagado">{{ $g->codigoFormateado() }}</td>
                            <td style="font-weight:500; color:var(--patrimonio);">{{ $g->nombre }}</td>
                            <td>
                                {{ $g->municipio ?? $g->plaza ?? '—' }}
                                @if ($g->zona)<div class="apagado" style="font-size:.6875rem;">Zona {{ $g->zona }}</div>@endif
                            </td>
                            <td>{{ $g->supervisor->nombre ?? '—' }}</td>
                            <td>{{ $g->encargada->nombre ?? '—' }}</td>
                            <td class="num">{{ $g->clientas_count }}</td>
                            <td>
                                <span class="insignia {{ $g->activo ? 'insignia-verde' : 'insignia-neutro' }}">
                                    {{ $g->activo ? 'activo' : 'archivado' }}
                                </span>
                            </td>
                            @can('grupos.editar')
                                <td class="no-imprimir" style="white-space:nowrap;">
                                    @if ($g->activo)
                                        <form method="POST" action="{{ route('grupos.archivar', $g) }}" style="display:inline;"
                                              onsubmit="return confirm('¿Archivar {{ $g->nombre }}? Deja de estar activo pero conserva su historial.')">
                                            @csrf
                                            <button type="submit" class="btn-secundario btn-chico">Archivar</button>
                                        </form>
                                    @else
                                        <form method="POST" action="{{ route('grupos.reactivar', $g) }}" style="display:inline;">
                                            @csrf
                                            <button type="submit" class="btn-secundario btn-chico">Reactivar</button>
                                        </form>
                                    @endif
                                    @can('correcciones.aplicar')
                                        <form method="POST" action="{{ route('grupos.borrar', $g) }}" style="display:inline;"
                                              onsubmit="return confirm('¿BORRAR {{ $g->nombre }} definitivamente? Solo se puede si no tiene historial. Esta acción no se puede deshacer.')">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="btn-peligro btn-chico">Borrar</button>
                                        </form>
                                    @endcan
                                </td>
                            @endcan
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </section>

    @can('grupos.crear')
        <section class="tarjeta">
            <header><h2>Nuevo grupo</h2></header>
            <form method="POST" action="{{ route('grupos.guardar') }}" class="relleno">
                @csrf
                <p class="ayuda" style="margin-top:0;">Un grupo no se crea sin ubicación, zona y encargada. El código se genera solo si lo dejas en blanco.</p>
                <div class="rejilla rejilla-3">
                    <div class="grupo-campo">
                        <label class="etiqueta-campo" for="codigo">Código</label>
                        <input type="text" id="codigo" name="codigo" placeholder="GR-000001 (auto)" value="{{ old('codigo') }}">
                    </div>
                    <div class="grupo-campo">
                        <label class="etiqueta-campo" for="nombre">Nombre *</label>
                        <input type="text" id="nombre" name="nombre" required placeholder="VIRI 1" value="{{ old('nombre') }}">
                    </div>
                    <div class="grupo-campo">
                        <label class="etiqueta-campo" for="estado">Estado</label>
                        <input type="text" id="estado" name="estado" placeholder="Sinaloa" value="{{ old('estado') }}">
                    </div>
                    <div class="grupo-campo">
                        <label class="etiqueta-campo" for="municipio">Municipio</label>
                        <input type="text" id="municipio" name="municipio" placeholder="Mazatlán" value="{{ old('municipio') }}">
                    </div>
                    <div class="grupo-campo">
                        <label class="etiqueta-campo" for="colonia">Colonia</label>
                        <input type="text" id="colonia" name="colonia" placeholder="Santa Fe" value="{{ old('colonia') }}">
                    </div>
                    <div class="grupo-campo">
                        <label class="etiqueta-campo" for="zona">Zona *</label>
                        <input type="text" id="zona" name="zona" required placeholder="Norte" value="{{ old('zona') }}">
                    </div>
                    <div class="grupo-campo" style="grid-column:1/-1;">
                        <label class="etiqueta-campo" for="ubicacion">Ubicación *</label>
                        <input type="text" id="ubicacion" name="ubicacion" required
                               placeholder="Referencia del punto de reunión" value="{{ old('ubicacion') }}">
                    </div>
                    <div class="grupo-campo">
                        <label class="etiqueta-campo" for="supervisor_id">Supervisor</label>
                        <select id="supervisor_id" name="supervisor_id">
                            <option value="">Sin asignar</option>
                            @foreach ($supervisores as $u)
                                <option value="{{ $u->id }}" @selected(old('supervisor_id') == $u->id)>{{ $u->nombre }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="grupo-campo">
                        <label class="etiqueta-campo" for="encargada_id">Encargada *</label>
                        <select id="encargada_id" name="encargada_id" required>
                            <option value="">Elige una encargada…</option>
                            @foreach ($encargadas as $u)
                                <option value="{{ $u->id }}" @selected(old('encargada_id') == $u->id)>{{ $u->nombre }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <button type="submit" class="btn">Crear grupo</button>
            </form>
        </section>
    @endcan
@endsection
