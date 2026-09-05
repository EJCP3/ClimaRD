<template>
  <div class="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-slate-900">Prevención y Asistencia Ciudadana</h2>
      <p class="text-xs text-slate-500 mt-1">Líneas telefónicas de emergencia directa y protocolos de seguridad.</p>
    </div>

    <!-- Direct Emergency Calling Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <a
        href="tel:911"
        class="p-4 rounded-2xl bg-red-500 text-white flex flex-col items-center justify-center text-center shadow-md hover:bg-red-600 transition-colors"
      >
        <span class="text-2xl font-black">911</span>
        <span class="text-xs font-semibold mt-1">Emergencias Nacional</span>
      </a>

      <a
        href="tel:8094720909"
        class="p-4 rounded-2xl bg-amber-500 text-white flex flex-col items-center justify-center text-center shadow-md hover:bg-amber-600 transition-colors"
      >
        <span class="text-xl font-bold">COE</span>
        <span class="text-[11px] font-medium mt-1">Operaciones Emergencias</span>
      </a>

      <a
        href="tel:8094728614"
        class="p-4 rounded-2xl bg-orange-500 text-white flex flex-col items-center justify-center text-center shadow-md hover:bg-orange-600 transition-colors"
      >
        <span class="text-xl font-bold">Defensa Civil</span>
        <span class="text-[11px] font-medium mt-1">Rescate y Albergues</span>
      </a>

      <a
        href="tel:8096822000"
        class="p-4 rounded-2xl bg-slate-800 text-white flex flex-col items-center justify-center text-center shadow-md hover:bg-slate-900 transition-colors"
      >
        <span class="text-xl font-bold">Bomberos</span>
        <span class="text-[11px] font-medium mt-1">Estación Central</span>
      </a>
    </div>

    <!-- Preventive Guides Accordions -->
    <div class="space-y-4">
      <h3 class="text-sm font-bold text-slate-800">Protocolos ante Inundaciones Urbanas</h3>

      <div class="space-y-3">
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <h4 class="text-xs font-bold text-slate-900 flex items-center space-x-2">
            <span>🚗</span>
            <span>Si te encuentras conduciendo durante lluvias intensas</span>
          </h4>
          <p class="text-xs text-slate-600 leading-relaxed">
            Nunca intentes cruzar calles anegadas con corriente de agua visible. Tan solo 30 centímetros de agua en movimiento pueden arrastrar la mayoría de los vehículos pequeños. Si el vehículo se apaga, sal inmediatamente y busca terreno alto.
          </p>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <h4 class="text-xs font-bold text-slate-900 flex items-center space-x-2">
            <span>🏠</span>
            <span>Si vives cerca de cañadas o zonas bajas vulnerables</span>
          </h4>
          <p class="text-xs text-slate-600 leading-relaxed">
            Ten a mano los documentos familiares en bolsas plásticas selladas, medicamentos indispensables, linterna con baterías y desactiva los interruptores principales de electricidad y gas si el nivel de agua comienza a subir.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
