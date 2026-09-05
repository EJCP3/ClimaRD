<template>
  <div class="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
    <!-- Header Section -->
    <div>
      <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
        <AppIcon name="shield" class="w-3.5 h-3.5 text-emerald-600" />
        <span>Centro de Asistencia y Prevención</span>
      </div>
      <h2 class="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">Prevención y Asistencia Ciudadana</h2>
      <p class="text-xs sm:text-sm text-slate-500 mt-1">
        Líneas directas de respuesta a emergencias y protocolos de seguridad ante inundaciones y vaguadas en RD.
      </p>
    </div>

    <!-- Direct Emergency Calling Hub (M3 Elevated Cards) -->
    <div class="space-y-3">
      <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Líneas Telefónicas Directas</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- 911 -->
        <div class="p-5 rounded-[28px] bg-white border border-rose-150 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div class="flex items-center justify-between">
            <div class="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-inner">
              <AppIcon name="siren" class="w-6 h-6" />
            </div>
            <span class="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-extrabold uppercase">24 Horas</span>
          </div>
          <div>
            <h4 class="text-2xl font-black text-slate-950">9-1-1</h4>
            <p class="text-xs font-bold text-slate-700 mt-0.5">Emergencias Nacional</p>
            <p class="text-[11px] text-slate-500 mt-1 leading-snug">Policía, ambulancias y auxilio vial inmediato.</p>
          </div>
          <a
            href="tel:911"
            class="inline-flex items-center justify-center space-x-2 w-full py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <AppIcon name="phone" class="w-3.5 h-3.5" />
            <span>Llamar al 911</span>
          </a>
        </div>

        <!-- COE -->
        <div class="p-5 rounded-[28px] bg-white border border-amber-150 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div class="flex items-center justify-between">
            <div class="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
              <AppIcon name="alert-triangle" class="w-6 h-6" />
            </div>
            <span class="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase">Oficial</span>
          </div>
          <div>
            <h4 class="text-xl font-black text-slate-950">COE</h4>
            <p class="text-xs font-bold text-slate-700 mt-0.5">Operaciones Emergencias</p>
            <p class="text-[11px] text-slate-500 mt-1 leading-snug">Reporte y coordinación de alertas provinciales.</p>
          </div>
          <a
            href="tel:8094720909"
            class="inline-flex items-center justify-center space-x-2 w-full py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <AppIcon name="phone" class="w-3.5 h-3.5" />
            <span>(809) 472-0909</span>
          </a>
        </div>

        <!-- Defensa Civil -->
        <div class="p-5 rounded-[28px] bg-white border border-sky-150 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div class="flex items-center justify-between">
            <div class="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shadow-inner">
              <AppIcon name="life-buoy" class="w-6 h-6" />
            </div>
            <span class="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-extrabold uppercase">Rescate</span>
          </div>
          <div>
            <h4 class="text-xl font-black text-slate-950">Defensa Civil</h4>
            <p class="text-xs font-bold text-slate-700 mt-0.5">Albergues y Evacuación</p>
            <p class="text-[11px] text-slate-500 mt-1 leading-snug">Ubicación de albergues y brigadas de rescate.</p>
          </div>
          <a
            href="tel:8094728614"
            class="inline-flex items-center justify-center space-x-2 w-full py-2.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <AppIcon name="phone" class="w-3.5 h-3.5" />
            <span>(809) 472-8614</span>
          </a>
        </div>

        <!-- Cuerpo de Bomberos -->
        <div class="p-5 rounded-[28px] bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div class="flex items-center justify-between">
            <div class="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 shadow-inner">
              <AppIcon name="flame" class="w-6 h-6" />
            </div>
            <span class="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-extrabold uppercase">Central</span>
          </div>
          <div>
            <h4 class="text-xl font-black text-slate-950">Bomberos D.N.</h4>
            <p class="text-xs font-bold text-slate-700 mt-0.5">Rescate Urbano</p>
            <p class="text-[11px] text-slate-500 mt-1 leading-snug">Árboles caídos, cables eléctricos y desagües.</p>
          </div>
          <a
            href="tel:8096822000"
            class="inline-flex items-center justify-center space-x-2 w-full py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <AppIcon name="phone" class="w-3.5 h-3.5" />
            <span>(809) 682-2000</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Protocols & Safety Guidelines -->
    <div class="space-y-4">
      <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Protocolos Oficiales ante Vaguadas y Lluvias Intensas</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Protocol 1: Driving -->
        <div class="bg-white p-6 rounded-[28px] border border-slate-150 shadow-sm space-y-3">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
              <AppIcon name="car" class="w-5 h-5" />
            </div>
            <h4 class="text-sm font-bold text-slate-900 leading-snug">
              Si te encuentras conduciendo durante aguaceros
            </h4>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed font-normal">
            Nunca intentes cruzar calles o pasos a desnivel anegados con corriente visible. Tan solo 30 centímetros de agua pueden arrastrar la mayoría de los vehículos ligeros. Si el motor se apaga, no insistas en encenderlo; sal del vehículo y dirígete a un punto elevado seguro.
          </p>
          <div class="pt-2 flex items-center space-x-2 text-[11px] text-sky-700 font-semibold">
            <AppIcon name="shield" class="w-3.5 h-3.5" />
            <span>Mantén las luces intermitentes y distancia prudente.</span>
          </div>
        </div>

        <!-- Protocol 2: Vulnerable Home -->
        <div class="bg-white p-6 rounded-[28px] border border-slate-150 shadow-sm space-y-3">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <AppIcon name="home" class="w-5 h-5" />
            </div>
            <h4 class="text-sm font-bold text-slate-900 leading-snug">
              Si habitas cerca de cañadas, ríos o zonas de ladera
            </h4>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed font-normal">
            Prepara una mochila con documentos familiares protegidos en bolsas plásticas herméticas, medicamentos indispensables y linterna con baterías recargables. Corta el suministro de energía eléctrica y gas si el nivel de agua comienza a entrar a la vivienda.
          </p>
          <div class="pt-2 flex items-center space-x-2 text-[11px] text-amber-700 font-semibold">
            <AppIcon name="shield" class="w-3.5 h-3.5" />
            <span>Ubica con antelación el albergue oficial de tu sector.</span>
          </div>
        </div>

        <!-- Protocol 3: Electrical & Tree Hazards -->
        <div class="bg-white p-6 rounded-[28px] border border-slate-150 shadow-sm space-y-3">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <AppIcon name="tree" class="w-5 h-5" />
            </div>
            <h4 class="text-sm font-bold text-slate-900 leading-snug">
              Cables del tendido eléctrico y árboles caídos
            </h4>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed font-normal">
            Asume siempre que todo cable caído sobre la acera o sumergido en agua está energizado y es potencialmente letal. Aléjate un mínimo de 15 metros, advierte a los transeúntes y repórtalo inmediatamente al 9-1-1 o la distribuidora eléctrica correspondiente.
          </p>
          <div class="pt-2 flex items-center space-x-2 text-[11px] text-emerald-700 font-semibold">
            <AppIcon name="shield" class="w-3.5 h-3.5" />
            <span>No manipules ramas caídas sobre líneas eléctricas.</span>
          </div>
        </div>

        <!-- Protocol 4: Flash Floods & Drainage -->
        <div class="bg-white p-6 rounded-[28px] border border-slate-150 shadow-sm space-y-3">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <AppIcon name="water" class="w-5 h-5" />
            </div>
            <h4 class="text-sm font-bold text-slate-900 leading-snug">
              Colaboración comunitaria con imbornales y desechos
            </h4>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed font-normal">
            No arrojes fundas de basura ni escombros a la calle durante o previo al paso de aguaceros. Los residuos taponan los imbornales y alcantarillados de la ciudad en menos de 10 minutos, provocando inundaciones repentinas en calles principales.
          </p>
          <div class="pt-2 flex items-center space-x-2 text-[11px] text-indigo-700 font-semibold">
            <AppIcon name="shield" class="w-3.5 h-3.5" />
            <span>Colabora reportando alcantarillas obstruidas en Clima RD.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// All emergency contacts and protocols follow COE & INDOMET official standards.
</script>
