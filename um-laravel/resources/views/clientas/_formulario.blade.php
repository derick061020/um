{{-- Campos de la clienta y su aval. El aval es obligatorio en la operación
     de Mujeres Unidas: nombre y domicilio no pueden quedar vacíos. --}}

<h3 style="margin:0 0 1rem; font-family:var(--serif); font-weight:400; font-size:1.0625rem; color:var(--patrimonio);">Datos de la clienta</h3>

<div class="rejilla rejilla-2">
    <div class="grupo-campo">
        <label class="etiqueta-campo" for="nombre">Nombre completo *</label>
        <input type="text" id="nombre" name="nombre" required
               value="{{ old('nombre', $clienta->nombre ?? '') }}">
    </div>

    <div class="grupo-campo">
        <label class="etiqueta-campo" for="telefono">Teléfono</label>
        <input type="tel" id="telefono" name="telefono"
               value="{{ old('telefono', $clienta->telefono ?? '') }}">
    </div>

    <div class="grupo-campo">
        <label class="etiqueta-campo" for="domicilio">Domicilio</label>
        <input type="text" id="domicilio" name="domicilio"
               value="{{ old('domicilio', $clienta->domicilio ?? '') }}">
    </div>

    <div class="grupo-campo">
        <label class="etiqueta-campo" for="colonia">Colonia</label>
        <input type="text" id="colonia" name="colonia"
               value="{{ old('colonia', $clienta->colonia ?? '') }}">
    </div>

    <div class="grupo-campo">
        <label class="etiqueta-campo" for="ciudad">Ciudad</label>
        <input type="text" id="ciudad" name="ciudad"
               value="{{ old('ciudad', $clienta->ciudad ?? '') }}">
    </div>

    <div class="grupo-campo">
        <label class="etiqueta-campo" for="curp">CURP</label>
        <input type="text" id="curp" name="curp" maxlength="18"
               value="{{ old('curp', $clienta->curp ?? '') }}">
    </div>

    <div class="grupo-campo">
        <label class="etiqueta-campo" for="grupo_id">Grupo</label>
        <select id="grupo_id" name="grupo_id">
            <option value="">Sin grupo</option>
            @foreach ($grupos as $g)
                <option value="{{ $g->id }}" @selected(old('grupo_id', $clienta->grupo_id ?? null) == $g->id)>
                    {{ $g->nombre }}@if ($g->plaza) — {{ $g->plaza }} @endif
                </option>
            @endforeach
        </select>
    </div>
</div>

<h3 style="margin:1.5rem 0 .25rem; font-family:var(--serif); font-weight:400; font-size:1.0625rem; color:var(--patrimonio);">Aval</h3>
<p class="ayuda" style="margin:0 0 1rem;">Sin aval no se puede entregar el crédito.</p>

<div class="rejilla rejilla-2">
    <div class="grupo-campo">
        <label class="etiqueta-campo" for="aval_nombre">Nombre del aval *</label>
        <input type="text" id="aval_nombre" name="aval_nombre" required
               value="{{ old('aval_nombre', $clienta->aval_nombre ?? '') }}">
    </div>

    <div class="grupo-campo">
        <label class="etiqueta-campo" for="aval_telefono">Teléfono del aval</label>
        <input type="tel" id="aval_telefono" name="aval_telefono"
               value="{{ old('aval_telefono', $clienta->aval_telefono ?? '') }}">
    </div>

    <div class="grupo-campo">
        <label class="etiqueta-campo" for="aval_parentesco">Parentesco</label>
        <input type="text" id="aval_parentesco" name="aval_parentesco"
               value="{{ old('aval_parentesco', $clienta->aval_parentesco ?? '') }}">
    </div>

    <div class="grupo-campo">
        <label class="etiqueta-campo" for="aval_domicilio">Domicilio del aval *</label>
        <input type="text" id="aval_domicilio" name="aval_domicilio" required
               value="{{ old('aval_domicilio', $clienta->aval_domicilio ?? '') }}">
    </div>

    <div class="grupo-campo">
        <label class="etiqueta-campo" for="aval_colonia">Colonia del aval</label>
        <input type="text" id="aval_colonia" name="aval_colonia"
               value="{{ old('aval_colonia', $clienta->aval_colonia ?? '') }}">
    </div>

    <div class="grupo-campo">
        <label class="etiqueta-campo" for="aval_ciudad">Ciudad del aval</label>
        <input type="text" id="aval_ciudad" name="aval_ciudad"
               value="{{ old('aval_ciudad', $clienta->aval_ciudad ?? '') }}">
    </div>
</div>

<div class="grupo-campo">
    <label class="etiqueta-campo" for="notas">Notas</label>
    <textarea id="notas" name="notas" rows="2">{{ old('notas', $clienta->notas ?? '') }}</textarea>
</div>

@isset($clienta)
    <div class="grupo-campo">
        <label class="casilla">
            <input type="checkbox" name="activo" value="1" @checked(old('activo', $clienta->activo))>
            Clienta activa
        </label>
    </div>
@endisset
