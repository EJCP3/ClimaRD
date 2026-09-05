<template>
  <div class="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
    <!-- Header Section -->
    <div>
      <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-semibold mb-2">
        <AppIcon name="shield" class="w-3.5 h-3.5 text-zinc-800" />
        <span>Centro de Asistencia y Prevención</span>
      </div>
      <h2 class="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">Prevención y Asistencia Ciudadana</h2>
      <p class="text-xs sm:text-sm text-zinc-500 mt-1">
        Líneas directas de respuesta a emergencias y protocolos de seguridad ante inundaciones y vaguadas en RD.
      </p>
    </div>

    <!-- Direct Emergency Calling Hub (Moni UI moni-card, moni-shape & moni-button) -->
    <div class="space-y-3">
      <h3 class="text-xs font-bold text-zinc-400 uppercase tracking-wider">Líneas Telefónicas Directas</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- 911 -->
        <moni-card variant="elevated" class="p-5 rounded-[28px] bg-white border border-zinc-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 block">
          <div class="flex items-center justify-between">
            <moni-shape name="burst" color="surface" style="--_shape-bg: #EAEAEB; --_shape-fg: #111111;" size="medium" class="shrink-0">
              <AppIcon name="siren" class="w-6 h-6 text-zinc-900" />
            </moni-shape>
            <span class="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800 text-[10px] font-extrabold uppercase border border-zinc-200/60">24 Horas</span>
          </div>
          <div>
            <h4 class="text-2xl font-black text-zinc-950">9-1-1</h4>
            <p class="text-xs font-bold text-zinc-700 mt-0.5">Emergencias Nacional</p>
            <p class="text-[11px] text-zinc-500 mt-1 leading-snug">Policía, ambulancias y auxilio vial inmediato.</p>
          </div>
          <moni-button
            href="tel:911"
            variant="filled"
            shape="round"
            class="w-full"
          >
            <AppIcon slot="icon" name="phone" class="w-3.5 h-3.5 mr-2" />
            Llamar al 911
          </moni-button>
        </moni-card>

        <!-- COE -->
        <moni-card variant="elevated" class="p-5 rounded-[28px] bg-white border border-zinc-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 block">
          <div class="flex items-center justify-between">
            <moni-shape name="12-sided-cookie" color="surface" style="--_shape-bg: #EAEAEB; --_shape-fg: #111111;" size="medium" class="shrink-0">
              <AppIcon name="alert-triangle" class="w-6 h-6 text-zinc-900" />
            </moni-shape>
            <span class="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800 text-[10px] font-extrabold uppercase border border-zinc-200/60">Oficial</span>
          </div>
          <div>
            <h4 class="text-xl font-black text-zinc-950">COE</h4>
            <p class="text-xs font-bold text-zinc-700 mt-0.5">Operaciones Emergencias</p>
            <p class="text-[11px] text-zinc-500 mt-1 leading-snug">Reporte y coordinación de alertas provinciales.</p>
          </div>
          <moni-button
            href="tel:8094720909"
            variant="filled"
            shape="round"
            class="w-full"
          >
            <AppIcon slot="icon" name="phone" class="w-3.5 h-3.5 mr-2" />
            (809) 472-0909
          </moni-button>
        </moni-card>

        <!-- Defensa Civil -->
        <moni-card variant="elevated" class="p-5 rounded-[28px] bg-white border border-zinc-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 block">
          <div class="flex items-center justify-between">
            <moni-shape name="flower" color="surface" style="--_shape-bg: #EAEAEB; --_shape-fg: #111111;" size="medium" class="shrink-0">
              <AppIcon name="life-buoy" class="w-6 h-6 text-zinc-900" />
            </moni-shape>
            <span class="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800 text-[10px] font-extrabold uppercase border border-zinc-200/60">Rescate</span>
          </div>
          <div>
            <h4 class="text-xl font-black text-zinc-950">Defensa Civil</h4>
            <p class="text-xs font-bold text-zinc-700 mt-0.5">Albergues y Evacuación</p>
            <p class="text-[11px] text-zinc-500 mt-1 leading-snug">Ubicación de albergues y brigadas de rescate.</p>
          </div>
          <moni-button
            href="tel:8094728614"
            variant="filled"
            shape="round"
            class="w-full"
          >
            <AppIcon slot="icon" name="phone" class="w-3.5 h-3.5 mr-2" />
            (809) 472-8614
          </moni-button>
        </moni-card>

        <!-- Cuerpo de Bomberos -->
        <moni-card variant="elevated" class="p-5 rounded-[28px] bg-white border border-zinc-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 block">
          <div class="flex items-center justify-between">
            <moni-shape name="sunny" color="surface" style="--_shape-bg: #EAEAEB; --_shape-fg: #111111;" size="medium" class="shrink-0">
              <AppIcon name="flame" class="w-6 h-6 text-zinc-900" />
            </moni-shape>
            <span class="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800 text-[10px] font-extrabold uppercase border border-zinc-200/60">Central</span>
          </div>
          <div>
            <h4 class="text-xl font-black text-zinc-950">Bomberos D.N.</h4>
            <p class="text-xs font-bold text-zinc-700 mt-0.5">Rescate Urbano</p>
            <p class="text-[11px] text-zinc-500 mt-1 leading-snug">Árboles caídos, cables eléctricos y desagües.</p>
          </div>
          <moni-button
            href="tel:8096822000"
            variant="filled"
            shape="round"
            class="w-full"
          >
            <AppIcon slot="icon" name="phone" class="w-3.5 h-3.5 mr-2" />
            (809) 682-2000
          </moni-button>
        </moni-card>
      </div>
    </div>

    <moni-divider inset="none" class="opacity-40"></moni-divider>

    <!-- Protocols & Safety Guidelines -->
    <div class="space-y-4">
      <h3 class="text-xs font-bold text-zinc-400 uppercase tracking-wider">Protocolos Oficiales ante Vaguadas y Lluvias Intensas</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Protocol 1: Driving -->
        <moni-card variant="outlined" class="p-6 rounded-[28px] bg-white border border-zinc-200/80 shadow-sm space-y-3 block">
          <div class="flex items-center space-x-3">
            <moni-shape name="arch" color="surface" style="--_shape-bg: #EAEAEB; --_shape-fg: #111111;" size="small" class="shrink-0">
              <AppIcon name="car" class="w-4 h-4 text-zinc-900" />
            </moni-shape>
            <h4 class="text-sm font-bold text-zinc-950 leading-snug">
              Si te encuentras conduciendo durante aguaceros
            </h4>
          </div>
          <p class="text-xs text-zinc-600 leading-relaxed font-normal">
            Nunca intentes cruzar calles o pasos a desnivel anegados con corriente visible. Tan solo 30 centímetros de agua pueden arrastrar la mayoría de los vehículos ligeros. Si el motor se apaga, no insistas en encenderlo; sal del vehículo y dirígete a un punto elevado seguro.
          </p>
          <div class="pt-2 flex items-center space-x-2 text-[11px] text-zinc-700 font-semibold">
            <AppIcon name="shield" class="w-3.5 h-3.5 text-zinc-800" />
            <span>Mantén las luces intermitentes y distancia prudente.</span>
          </div>
        </moni-card>

        <!-- Protocol 2: Vulnerable Home -->
        <moni-card variant="outlined" class="p-6 rounded-[28px] bg-white border border-zinc-200/80 shadow-sm space-y-3 block">
          <div class="flex items-center space-x-3">
            <moni-shape name="puffy" color="surface" style="--_shape-bg: #EAEAEB; --_shape-fg: #111111;" size="small" class="shrink-0">
              <AppIcon name="home" class="w-4 h-4 text-zinc-900" />
            </moni-shape>
            <h4 class="text-sm font-bold text-zinc-950 leading-snug">
              Si habitas cerca de cañadas, ríos o zonas de ladera
            </h4>
          </div>
          <p class="text-xs text-zinc-600 leading-relaxed font-normal">
            Prepara una mochila con documentos familiares protegidos en bolsas plásticas herméticas, medicamentos indispensables y linterna con baterías recargables. Corta el suministro de energía eléctrica y gas si el nivel de agua comienza a entrar a la vivienda.
          </p>
          <div class="pt-2 flex items-center space-x-2 text-[11px] text-zinc-700 font-semibold">
            <AppIcon name="shield" class="w-3.5 h-3.5 text-zinc-800" />
            <span>Ubica con antelación el albergue oficial de tu sector.</span>
          </div>
        </moni-card>

        <!-- Protocol 3: Electrical & Tree Hazards -->
        <moni-card variant="outlined" class="p-6 rounded-[28px] bg-white border border-zinc-200/80 shadow-sm space-y-3 block">
          <div class="flex items-center space-x-3">
            <moni-shape name="12-sided-cookie" color="surface" style="--_shape-bg: #EAEAEB; --_shape-fg: #111111;" size="small" class="shrink-0">
              <AppIcon name="tree" class="w-4 h-4 text-zinc-900" />
            </moni-shape>
            <h4 class="text-sm font-bold text-zinc-950 leading-snug">
              Cables del tendido eléctrico y árboles caídos
            </h4>
          </div>
          <p class="text-xs text-zinc-600 leading-relaxed font-normal">
            Asume siempre que todo cable caído sobre la acera o sumergido en agua está energizado y es potencialmente letal. Aléjate un mínimo de 15 metros, advierte a los transeúntes y repórtalo inmediatamente al 9-1-1 o la distribuidora eléctrica correspondiente.
          </p>
          <div class="pt-2 flex items-center space-x-2 text-[11px] text-zinc-700 font-semibold">
            <AppIcon name="shield" class="w-3.5 h-3.5 text-zinc-800" />
            <span>No manipules ramas caídas sobre líneas eléctricas.</span>
          </div>
        </moni-card>

        <!-- Protocol 4: Flash Floods & Drainage -->
        <moni-card variant="outlined" class="p-6 rounded-[28px] bg-white border border-zinc-200/80 shadow-sm space-y-3 block">
          <div class="flex items-center space-x-3">
            <moni-shape name="flower" color="surface" style="--_shape-bg: #EAEAEB; --_shape-fg: #111111;" size="small" class="shrink-0">
              <AppIcon name="water" class="w-4 h-4 text-zinc-900" />
            </moni-shape>
            <h4 class="text-sm font-bold text-zinc-950 leading-snug">
              Colaboración comunitaria con imbornales y desechos
            </h4>
          </div>
          <p class="text-xs text-zinc-600 leading-relaxed font-normal">
            No arrojes fundas de basura ni escombros a la calle durante o previo al paso de aguaceros. Los residuos taponan los imbornales y alcantarillados de la ciudad en menos de 10 minutos, provocando inundaciones repentinas en calles principales.
          </p>
          <div class="pt-2 flex items-center space-x-2 text-[11px] text-zinc-700 font-semibold">
            <AppIcon name="shield" class="w-3.5 h-3.5 text-zinc-800" />
            <span>Colabora reportando alcantarillas obstruidas en Clima RD.</span>
          </div>
        </moni-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// All emergency contacts and protocols follow COE & INDOMET official standards.
</script>
