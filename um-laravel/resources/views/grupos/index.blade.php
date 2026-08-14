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
                        <th>Grupo</th>
                        <th>Plaza</th>
                        <th>Supervisor</th>
                        <th>Encargada</th>
                        <th class="num">Clientas</th>
                        <th>Estado</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach ($grupos as $g)
                        <tr>
                            <td style="font-weight:500; color:var(--patrimonio);">{{ $g->nombre }}</td>
                            <td>{{ $g->plaza ?? '—' }}</td>
                            <td>{{ $g->supervisor->nombre ?? '—' }}</td>
                            <td>{{ $g->encargada->nombre ?? '—' }}</td>
                            <td class="num">{{ $g->clientas_count }}</td>
                            <td>
                                <span class="insignia {{ $g->activo ? 'insignia-verde' : 'insignia-neutro' }}">
                                    {{ $g->activo ? 'activo' : 'inactivo' }}
                                </span>
                            </td>
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
                <div class="rejilla rejilla-2">
                    <div class="grupo-campo">
                        <label class="etiqueta-campo" for="nombre">Nombre *</label>
                        <input type="text" id="nombre" name="nombre" required placeholder="VIRI 1" value="{{ old('nombre') }}">
                    </div>
                    <div class="grupo-campo">
                        <label class="etiqueta-campo" for="plaza">Plaza</label>
                        <input type="text" id="plaza" name="plaza" placeholder="Mazatlán" value="{{ old('plaza') }}">
                    </div>
                    <div class="grupo-campo">
                        <label class="etiqueta-campo" for="supervisor_id">Supervisor</label>
                        <select id="supervisor_id" name="supervisor_id">
                            <option value="">Sin asignar</option>
                            @foreach ($supervisores as $u)
                                <option value="{{ $u->id }}">{{ $u->nombre }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="grupo-campo">
                        <label class="etiqueta-campo" for="encargada_id">Encargada</label>
                        <select id="encargada_id" name="encargada_id">
                            <option value="">Sin asignar</option>
                            @foreach ($encargadas as $u)
                                <option value="{{ $u->id }}">{{ $u->nombre }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <button type="submit" class="btn">Crear grupo</button>
            </form>
        </section>
    @endcan
@endsection
