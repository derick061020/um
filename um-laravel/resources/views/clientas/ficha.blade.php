@extends('base')
@section('titulo', $clienta->nombre)

@php
    use App\Support\Dinero;
    use App\Support\Documentos;
@endphp

@section('contenido')
    <nav class="migas">
        <a href="{{ route('clientas') }}">Clientas</a>
        <span aria-hidden="true">/</span>
        <span class="actual">{{ $clienta->nombre }}</span>
    </nav>

    <div style="display:flex; justify-content:space-between; align-items:start; gap:1rem; flex-wrap:wrap;">
        <div class="titulo">
            <h1>{{ $clienta->nombre }}</h1>
            <p>
                {{ $clienta->idPublico() }}
                @if ($clienta->grupo) · {{ $clienta->grupo->nombre }} @endif
                @unless ($clienta->activo)
                    · <span class="insignia insignia-neutro">inactiva</span>
                @endunless
            </p>
        </div>
        @can('creditos.crear')
            <a href="{{ route('creditos.nuevo', ['clienta' => $clienta->id]) }}" class="btn">Dar crédito</a>
        @endcan
    </div>

    @if ($faltantes)
        <div class="aviso aviso-ojo">
            <strong>Faltan documentos obligatorios:</strong>
            {{ implode(', ', array_map(fn ($t) => Documentos::etiqueta($t), $faltantes)) }}.
            No se debe entregar el crédito con el expediente incompleto.
        </div>
    @endif

    {{-- Créditos ------------------------------------------------------------ --}}
    <section class="tarjeta" style="margin-bottom:1.5rem;">
        <header><h2>Créditos</h2></header>

        @if ($clienta->creditos->isEmpty())
            <div class="vacio">
                <p>Todavía no tiene créditos.</p>
                @can('creditos.crear')
                    <a href="{{ route('creditos.nuevo', ['clienta' => $clienta->id]) }}" class="btn-secundario">
                        Registrar el primero
                    </a>
                @endcan
            </div>
        @else
            <div class="tabla-envoltura">
                <table class="tabla">
                    <thead>
                    <tr>
                        <th class="num">Folio</th>
                        <th>Entrega</th>
                        <th>Vence</th>
                        <th class="num">Total</th>
                        <th class="num">Pagado</th>
                        <th class="num">Saldo</th>
                        <th>Estado</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach ($clienta->creditos as $c)
                        @php $pagado = (int) $c->abonos->sum('monto_pagado'); @endphp
                        <tr>
                            <td class="num">
                                <a href="{{ route('creditos.ficha', $c) }}"
                                   style="font-weight:500; color:var(--patrimonio); text-decoration:none;">
                                    {{ $c->folioFormateado() }}
                                </a>
                            </td>
                            <td style="white-space:nowrap;">{{ $c->fecha_entrega->format('d/m/Y') }}</td>
                            <td style="white-space:nowrap;">{{ $c->fecha_vencimiento->format('d/m/Y') }}</td>
                            <td class="num">{{ Dinero::pesos($c->monto_total) }}</td>
                            <td class="num">{{ Dinero::pesos($pagado) }}</td>
                            <td class="num">{{ Dinero::pesos(max(0, $c->monto_total - $pagado)) }}</td>
                            <td><span class="insignia e-{{ $c->estado }}">{{ $c->estado }}</span></td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </section>

    {{-- Expediente ----------------------------------------------------------- --}}
    <section class="tarjeta" style="margin-bottom:1.5rem;">
        <header>
            <h2>Expediente</h2>
            <span class="apagado" style="font-size:.75rem;">
                {{ $clienta->documentos->count() }} documento(s)
            </span>
        </header>

        @if ($clienta->documentos->isEmpty())
            <div class="vacio"><p>Sin documentos todavía.</p></div>
        @else
            <div class="relleno documentos">
                @foreach ($clienta->documentos as $d)
                    <div class="documento">
                        <a href="{{ route('documentos.ver', $d) }}" target="_blank">
                            <img src="{{ route('documentos.ver', $d) }}" alt="{{ $d->etiquetaTipo() }}" loading="lazy">
                        </a>
                        <div class="pie-doc">
                            <strong style="color:var(--patrimonio);">{{ $d->etiquetaTipo() }}</strong>
                            <div class="apagado" style="font-size:.6875rem;">
                                {{ $d->pesoLegible() }} · {{ $d->created_at?->format('d/m/y') }}
                            </div>
                            @can('documentos.subir')
                                <form method="POST" action="{{ route('documentos.borrar', $d) }}"
                                      onsubmit="return confirm('¿Eliminar este documento del expediente?')">
                                    @csrf @method('DELETE')
                                    <button type="submit" class="btn-peligro btn-chico" style="margin-top:.375rem;">
                                        Eliminar
                                    </button>
                                </form>
                            @endcan
                        </div>
                    </div>
                @endforeach
            </div>
        @endif
    </section>

    {{-- Escáner -------------------------------------------------------------- --}}
    @can('documentos.subir')
        <section class="tarjeta no-imprimir" style="margin-bottom:1.5rem;">
            <header><h2>Escanear documento</h2></header>

            <form method="POST" action="{{ route('documentos.subir', $clienta) }}"
                  enctype="multipart/form-data" class="relleno" id="forma-escaner">
                @csrf

                <div class="rejilla rejilla-2">
                    <div class="grupo-campo">
                        <label class="etiqueta-campo" for="tipo">Tipo de documento</label>
                        <select id="tipo" name="tipo" required>
                            @foreach ($tiposDocumento as $t)
                                <option value="{{ $t['valor'] }}">{{ $t['texto'] }}</option>
                            @endforeach
                        </select>
                    </div>

                    <div class="grupo-campo">
                        <label class="etiqueta-campo" for="descripcion">Descripción (opcional)</label>
                        <input type="text" id="descripcion" name="descripcion">
                    </div>
                </div>

                <div style="display:flex; gap:.75rem; flex-wrap:wrap; margin-bottom:.75rem;">
                    <button type="button" class="btn" id="btn-camara">Abrir cámara</button>
                    <label class="btn-secundario" style="margin:0; cursor:pointer;">
                        Subir archivo
                        <input type="file" name="archivo" accept="image/*,application/pdf" style="display:none;"
                               onchange="document.getElementById('forma-escaner').submit()">
                    </label>
                </div>

                {{-- La cámara solo abre en https:// o en localhost: es una regla
                     del navegador, no del sistema. --}}
                <div id="zona-camara" style="display:none;">
                    <video id="camara-vista" autoplay playsinline muted></video>
                    <div class="guia">
                        <p class="ayuda" style="margin:0 0 .5rem;">
                            Encuadra el documento dentro de la pantalla y toma la foto.
                        </p>
                        <label class="casilla">
                            <input type="checkbox" id="realce" checked>
                            Realzar: blanco y negro con más contraste (se lee mejor)
                        </label>
                        <div style="display:flex; gap:.75rem; margin-top:.75rem;">
                            <button type="button" class="btn" id="btn-tomar">Tomar foto</button>
                            <button type="button" class="btn-secundario" id="btn-cerrar">Cerrar cámara</button>
                        </div>
                    </div>
                </div>

                <canvas id="lienzo" style="display:none;"></canvas>
                <input type="hidden" name="imagen" id="imagen">
            </form>
        </section>
    @endcan

    {{-- Datos ---------------------------------------------------------------- --}}
    @can('clientas.editar')
        <section class="tarjeta">
            <header><h2>Datos de la clienta</h2></header>
            <form method="POST" action="{{ route('clientas.actualizar', $clienta) }}" class="relleno">
                @csrf
                @include('clientas._formulario')
                <button type="submit" class="btn" style="margin-top:1rem;">Guardar cambios</button>
            </form>
        </section>
    @endcan
@endsection

@push('scripts')
<script>
// Escáner con la cámara trasera de la tablet. Todo el procesado ocurre en el
// navegador; al servidor solo llega la imagen final ya recortada y optimizada.
(function () {
    const btnCamara = document.getElementById('btn-camara');
    if (!btnCamara) return;

    const zona   = document.getElementById('zona-camara');
    const video  = document.getElementById('camara-vista');
    const lienzo = document.getElementById('lienzo');
    const campo  = document.getElementById('imagen');
    const forma  = document.getElementById('forma-escaner');
    let flujo = null;

    btnCamara.addEventListener('click', async () => {
        if (!navigator.mediaDevices?.getUserMedia) {
            alert('Este navegador no permite abrir la cámara. Usa "Subir archivo".');
            return;
        }
        try {
            flujo = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 } },
                audio: false,
            });
            video.srcObject = flujo;
            zona.style.display = 'block';
        } catch (e) {
            // Sin HTTPS el navegador bloquea la cámara: hay que decirlo claro.
            alert(
                'No se pudo abrir la cámara.\n\n' +
                'Recuerda que los navegadores solo la permiten en sitios https:// ' +
                'o en localhost. Mientras tanto puedes usar "Subir archivo".'
            );
        }
    });

    document.getElementById('btn-cerrar').addEventListener('click', cerrar);

    function cerrar() {
        flujo?.getTracks().forEach((t) => t.stop());
        flujo = null;
        zona.style.display = 'none';
    }

    document.getElementById('btn-tomar').addEventListener('click', () => {
        if (!flujo) return;

        // Se limita el lado mayor a 1600 px: suficiente para leer una INE y
        // evita subidas enormes desde la tablet.
        const maximo = 1600;
        const { videoWidth: an, videoHeight: al } = video;
        const escala = Math.min(1, maximo / Math.max(an, al));
        lienzo.width  = Math.round(an * escala);
        lienzo.height = Math.round(al * escala);

        const ctx = lienzo.getContext('2d');
        ctx.drawImage(video, 0, 0, lienzo.width, lienzo.height);

        if (document.getElementById('realce').checked) {
            const img = ctx.getImageData(0, 0, lienzo.width, lienzo.height);
            const d = img.data;
            for (let i = 0; i < d.length; i += 4) {
                const gris = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
                // Curva de contraste centrada en el gris medio.
                const v = Math.max(0, Math.min(255, (gris - 128) * 1.6 + 128));
                d[i] = d[i + 1] = d[i + 2] = v;
            }
            ctx.putImageData(img, 0, 0);
        }

        campo.value = lienzo.toDataURL('image/jpeg', 0.82);
        cerrar();
        forma.submit();
    });
})();
</script>
@endpush
