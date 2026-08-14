@extends('base')
@section('titulo', 'Nueva clienta')

@section('contenido')
    <h1>Nueva clienta</h1>
    <p class="sub">El folio se asigna solo al guardar.</p>

    <form method="POST" action="{{ route('clientas.guardar') }}" class="tarjeta">
        @csrf
        @include('clientas._formulario')

        <div style="display:flex; gap:10px; margin-top:16px;">
            <button type="submit" class="btn">Guardar clienta</button>
            <a href="{{ route('clientas') }}" class="btn btn-secundario">Cancelar</a>
        </div>
    </form>
@endsection
