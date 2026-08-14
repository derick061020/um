@extends('base')
@section('titulo', 'Nueva clienta')

@section('contenido')
    <nav class="migas">
        <a href="{{ route('clientas') }}">Clientas</a>
        <span aria-hidden="true">/</span>
        <span class="actual">Nueva</span>
    </nav>

    <div class="titulo">
        <h1>Nueva clienta</h1>
        <p>El folio se asigna solo al guardar. El aval es obligatorio.</p>
    </div>

    <form method="POST" action="{{ route('clientas.guardar') }}">
        @csrf

        <section class="tarjeta" style="margin-bottom:1.5rem;">
            <div class="relleno">
                @include('clientas._formulario')
            </div>
        </section>

        <div style="display:flex; gap:.75rem;">
            <button type="submit" class="btn">Guardar clienta</button>
            <a href="{{ route('clientas') }}" class="btn-secundario">Cancelar</a>
        </div>
    </form>
@endsection
