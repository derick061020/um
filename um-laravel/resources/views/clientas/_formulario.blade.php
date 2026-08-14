{{-- Campos de la clienta y su aval. El aval es obligatorio en la operación
     de Mujeres Unidas: nombre y domicilio no pueden quedar vacíos. --}}

<h2 style="margin-top:0;">Datos de la clienta</h2>

<div class="rejilla rejilla-2">
    <div class="campo">
        <label for="nombre">Nombre completo *</label>
        <input type="text" id="nombre" name="nombre" required
               value="{{ old('nombre', $clienta->nombre ?? '') }}">
    </div>

    <div class="campo">
        <label for="telefono">Teléfono</label>
        <input type="tel" id="telefono" name="telefono"
               value="{{ old('telefono', $clienta->telefono ?? '') }}">
    </div>

    <div class="campo">
        <label for="domicilio">Domicilio</label>
        <input type="text" id="domicilio" name="domicilio"
               value="{{ old('domicilio', $clienta->domicilio ?? '') }}">
    </div>

    <div class="campo">
        <label for="colonia">Colonia</label>
        <input type="text" id="colonia" name="colonia"
               value="{{ old('colonia', $clienta->colonia ?? '') }}">
    </div>

    <div class="campo">
        <label for="ciudad">Ciudad</label>
        <input type="text" id="ciudad" name="ciudad"
               value="{{ old('ciudad', $clienta->ciudad ?? '') }}">
    </div>

    <div class="campo">
        <label for="curp">CURP</label>
        <input type="text" id="curp" name="curp" maxlength="18"
               value="{{ old('curp', $clienta->curp ?? '') }}">
    </div>

    <div class="campo">
        <label for="grupo_id">Grupo</label>
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

<h2>Aval</h2>
<p class="pista" style="margin-top:-6px;">Sin aval no se puede entregar el crédito.</p>

<div class="rejilla rejilla-2">
    <div class="campo">
        <label for="aval_nombre">Nombre del aval *</label>
        <input type="text" id="aval_nombre" name="aval_nombre" required
               value="{{ old('aval_nombre', $clienta->aval_nombre ?? '') }}">
    </div>

    <div class="campo">
        <label for="aval_telefono">Teléfono del aval</label>
        <input type="tel" id="aval_telefono" name="aval_telefono"
               value="{{ old('aval_telefono', $clienta->aval_telefono ?? '') }}">
    </div>

    <div class="campo">
        <label for="aval_parentesco">Parentesco</label>
        <input type="text" id="aval_parentesco" name="aval_parentesco"
               value="{{ old('aval_parentesco', $clienta->aval_parentesco ?? '') }}">
    </div>

    <div class="campo">
        <label for="aval_domicilio">Domicilio del aval *</label>
        <input type="text" id="aval_domicilio" name="aval_domicilio" required
               value="{{ old('aval_domicilio', $clienta->aval_domicilio ?? '') }}">
    </div>

    <div class="campo">
        <label for="aval_colonia">Colonia del aval</label>
        <input type="text" id="aval_colonia" name="aval_colonia"
               value="{{ old('aval_colonia', $clienta->aval_colonia ?? '') }}">
    </div>

    <div class="campo">
        <label for="aval_ciudad">Ciudad del aval</label>
        <input type="text" id="aval_ciudad" name="aval_ciudad"
               value="{{ old('aval_ciudad', $clienta->aval_ciudad ?? '') }}">
    </div>
</div>

<div class="campo">
    <label for="notas">Notas</label>
    <textarea id="notas" name="notas" rows="2">{{ old('notas', $clienta->notas ?? '') }}</textarea>
</div>

@isset($clienta)
    <div class="campo">
        <label style="display:flex; align-items:center; gap:8px; font-size:14px;">
            <input type="checkbox" name="activo" value="1" style="width:auto;"
                   @checked(old('activo', $clienta->activo))>
            Clienta activa
        </label>
    </div>
@endisset
