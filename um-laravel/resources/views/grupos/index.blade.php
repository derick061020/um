@extends('base')
@section('titulo', 'Grupos')

@section('contenido')
    <h1>Grupos</h1>
    <p class="sub">Cada grupo tiene un supervisor y una encargada.</p>

    <div class="tabla-envoltura tarjeta" style="padding:0;">
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
            @forelse ($grupos as $g)
                <tr>
                    <td><strong>{{ $g->nombre }}</strong></td>
                    <td>{{ $g->plaza ?? '—' }}</td>
                    <td>{{ $g->supervisor->nombre ?? '—' }}</td>
                    <td>{{ $g->encargada->nombre ?? '—' }}</td>
                    <td class="num">{{ $g->clientas_count }}</td>
                    <td>
                        <span class="etiqueta {{ $g->activo ? 'e-ACTIVO' : 'e-CANCELADO' }}">
                            {{ $g->activo ? 'activo' : 'inactivo' }}
                        </span>
                    </td>
                </tr>
            @empty
                <tr><td colspan="6" class="apagado">Todavía no hay grupos.</td></tr>
            @endforelse
            </tbody>
        </table>
    </div>

    @can('grupos.crear')
        <h2>Nuevo grupo</h2>
        <form method="POST" action="{{ route('grupos.guardar') }}" class="tarjeta">
            @csrf
            <div class="rejilla rejilla-2">
                <div class="campo">
                    <label for="nombre">Nombre *</label>
                    <input type="text" id="nombre" name="nombre" required placeholder="VIRI 1" value="{{ old('nombre') }}">
                </div>
                <div class="campo">
                    <label for="plaza">Plaza</label>
                    <input type="text" id="plaza" name="plaza" placeholder="Mazatlán" value="{{ old('plaza') }}">
                </div>
                <div class="campo">
                    <label for="supervisor_id">Supervisor</label>
                    <select id="supervisor_id" name="supervisor_id">
                        <option value="">Sin asignar</option>
                        @foreach ($supervisores as $u)
                            <option value="{{ $u->id }}">{{ $u->nombre }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="campo">
                    <label for="encargada_id">Encargada</label>
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
    @endcan
@endsection
