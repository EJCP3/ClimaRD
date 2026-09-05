<template>
  <div class="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
    <!-- Header Section -->
    <div>
      <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-zinc-100 text-zinc-700 text-xs font-semibold mb-2 border border-zinc-200/60">
        <AppIcon name="shield" class="w-3.5 h-3.5 text-zinc-800" />
        <span>Centro de Asistencia y Prevención</span>
      </div>
      <h2 class="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight">Prevención y Asistencia Ciudadana</h2>
      <p class="text-xs sm:text-sm text-zinc-500 mt-1 max-w-2xl leading-relaxed">
        Líneas directas de respuesta a emergencias y protocolos de seguridad ante inundaciones y vaguadas en RD.
      </p>
    </div>

    <!-- Direct Emergency Calling Bento Grid -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-[11px] font-extrabold uppercase tracking-widest text-zinc-400">CONTACTO INMEDIATO</span>
          <h3 class="text-xl font-bold text-zinc-950 tracking-tight">Directorio Nacional de Emergencias</h3>
        </div>
        <span class="text-xs font-bold text-zinc-600 hidden sm:inline-flex items-center space-x-1.5 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200/60">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Líneas activas 24/7 sin costo</span>
        </span>
      </div>

      <!-- Bento Grid (Asymmetric, dynamic and modern) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        <!-- Bento Tile 1: 9-1-1 Hero Tile (Spans 7 cols on desktop) -->
        <div class="lg:col-span-7 bg-white p-6 sm:p-8 rounded-[32px] border border-zinc-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group relative overflow-hidden">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <moni-shape name="burst" color="surface" style="--_shape-bg: #EAEAEB; --_shape-fg: #111111;" size="large" class="shrink-0 group-hover:scale-105 transition-transform">
                <AppIcon name="siren" class="w-7 h-7 text-zinc-900" />
              </moni-shape>
              <div class="flex items-center space-x-2">
                <span class="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-wider">
                  Prioridad Nacional
                </span>
                <span class="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 text-[10px] font-bold uppercase border border-zinc-200/60">
                  24 Horas
                </span>
              </div>
            </div>

            <div class="space-y-1.5">
              <div class="flex items-baseline space-x-3">
                <h4 class="text-4xl sm:text-5xl font-black text-zinc-950 tracking-tight">9-1-1</h4>
                <span class="text-xs font-bold text-zinc-500 uppercase tracking-wider">Línea Única</span>
              </div>
              <h5 class="text-base font-bold text-zinc-900">Sistema Nacional de Atención a Emergencias y Seguridad</h5>
              <p class="text-xs text-zinc-600 leading-relaxed max-w-md">
                Despacho unificado de la Policía Nacional, ambulancias de soporte vital (DAEH), Cuerpo de Bomberos y auxilio vial inmediato en todo el país.
              </p>
            </div>
          </div>

          <div class="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <moni-button
              href="tel:911"
              variant="filled"
              shape="round"
              size="large"
              style="--primary: #18181b; --on-primary: #ffffff;"
              class="w-full sm:w-auto"
            >
              <AppIcon slot="icon" name="phone" class="w-4 h-4 mr-2" />
              Llamar al 911 (Línea Rápida)
            </moni-button>
            <span class="text-[11px] text-zinc-400 font-medium">Llamada prioritaria sin saldo</span>
          </div>
        </div>

        <!-- Bento Tile 2: COE Operaciones Central (Spans 5 cols on desktop) -->
        <div class="lg:col-span-5 bg-white p-6 sm:p-7 rounded-[32px] border border-zinc-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <moni-shape name="12-sided-cookie" color="surface" style="--_shape-bg: #EAEAEB; --_shape-fg: #111111;" size="medium" class="shrink-0 group-hover:scale-105 transition-transform">
                <AppIcon name="alert-triangle" class="w-6 h-6 text-zinc-900" />
              </moni-shape>
              <span class="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 text-[10px] font-extrabold uppercase border border-zinc-200/60">
                Mando Operativo
              </span>
            </div>

            <div class="space-y-1">
              <span class="text-xs font-mono font-bold text-zinc-500 block">TEL: (809) 472-0909</span>
              <h4 class="text-2xl font-black text-zinc-950">COE Central</h4>
              <p class="text-xs text-zinc-600 leading-relaxed">
                Coordinación técnica de alertas provinciales, reportes de ríos desbordados, comunidades incomunicadas y enlaces con comités de mitigación.
              </p>
            </div>
          </div>

          <div class="pt-5">
            <moni-button
              href="tel:8094720909"
              variant="filled"
              shape="round"
              style="--primary: #18181b; --on-primary: #ffffff;"
              class="w-full"
            >
              <AppIcon slot="icon" name="phone" class="w-3.5 h-3.5 mr-2" />
              (809) 472-0909
            </moni-button>
          </div>
        </div>

        <!-- Bento Tile 3: Defensa Civil (Spans 4 cols) -->
        <div class="lg:col-span-4 bg-white p-5 sm:p-6 rounded-[28px] border border-zinc-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <moni-shape name="flower" color="surface" style="--_shape-bg: #EAEAEB; --_shape-fg: #111111;" size="medium" class="shrink-0 group-hover:scale-105 transition-transform">
                <AppIcon name="life-buoy" class="w-6 h-6 text-zinc-900" />
              </moni-shape>
              <span class="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800 text-[10px] font-bold uppercase border border-zinc-200/60">
                Albergues
              </span>
            </div>
            <div>
              <h4 class="text-lg font-black text-zinc-950">Defensa Civil</h4>
              <p class="text-[11px] text-zinc-500 font-semibold mt-0.5">Albergues y Evacuación</p>
              <p class="text-xs text-zinc-600 mt-1 leading-snug">
                Localización inmediata de albergues oficiales y brigadas comunitarias de auxilio.
              </p>
            </div>
          </div>
          <div class="pt-4">
            <moni-button
              href="tel:8094728614"
              variant="filled"
              shape="round"
              style="--primary: #18181b; --on-primary: #ffffff;"
              class="w-full"
            >
              <AppIcon slot="icon" name="phone" class="w-3.5 h-3.5 mr-2" />
              (809) 472-8614
            </moni-button>
          </div>
        </div>

        <!-- Bento Tile 4: Bomberos (Spans 4 cols) -->
        <div class="lg:col-span-4 bg-white p-5 sm:p-6 rounded-[28px] border border-zinc-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <moni-shape name="sunny" color="surface" style="--_shape-bg: #EAEAEB; --_shape-fg: #111111;" size="medium" class="shrink-0 group-hover:scale-105 transition-transform">
                <AppIcon name="flame" class="w-6 h-6 text-zinc-900" />
              </moni-shape>
              <span class="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800 text-[10px] font-bold uppercase border border-zinc-200/60">
                Urbano
              </span>
            </div>
            <div>
              <h4 class="text-lg font-black text-zinc-950">Bomberos D.N.</h4>
              <p class="text-[11px] text-zinc-500 font-semibold mt-0.5">Rescate Urbano y Despeje</p>
              <p class="text-xs text-zinc-600 mt-1 leading-snug">
                Retiro de ramas caídas sobre tendido eléctrico, bombas de achique e imbornales.
              </p>
            </div>
          </div>
          <div class="pt-4">
            <moni-button
              href="tel:8096822000"
              variant="filled"
              shape="round"
              style="--primary: #18181b; --on-primary: #ffffff;"
              class="w-full"
            >
              <AppIcon slot="icon" name="phone" class="w-3.5 h-3.5 mr-2" />
              (809) 682-2000
            </moni-button>
          </div>
        </div>

        <!-- Bento Tile 5: Asistencia Vial COMIPOL (Spans 4 cols) -->
        <div class="lg:col-span-4 bg-white p-5 sm:p-6 rounded-[28px] border border-zinc-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <moni-shape name="arch" color="surface" style="--_shape-bg: #EAEAEB; --_shape-fg: #111111;" size="medium" class="shrink-0 group-hover:scale-105 transition-transform">
                <AppIcon name="car" class="w-6 h-6 text-zinc-900" />
              </moni-shape>
              <span class="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800 text-[10px] font-bold uppercase border border-zinc-200/60">
                Autopistas
              </span>
            </div>
            <div>
              <h4 class="text-lg font-black text-zinc-950">Asistencia Vial MOPC</h4>
              <p class="text-[11px] text-zinc-500 font-semibold mt-0.5">COMIPOL Carreteras</p>
              <p class="text-xs text-zinc-600 mt-1 leading-snug">
                Grúas gratuitas y auxilio a conductores varados en autopistas y pasos a desnivel.
              </p>
            </div>
          </div>
          <div class="pt-4">
            <moni-button
              href="tel:8095674920"
              variant="filled"
              shape="round"
              style="--primary: #18181b; --on-primary: #ffffff;"
              class="w-full"
            >
              <AppIcon slot="icon" name="phone" class="w-3.5 h-3.5 mr-2" />
              (809) 567-4920
            </moni-button>
          </div>
        </div>

        <!-- Bento Tile 6: Informative Safety Banner (Full 12 cols) -->
        <div class="lg:col-span-12 p-4 sm:p-5 rounded-[24px] bg-zinc-100/90 border border-zinc-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-800 shrink-0">
              <AppIcon name="shield" class="w-4 h-4" />
            </div>
            <p class="text-zinc-600 font-medium">
              <strong class="text-zinc-950">Aviso Oficial:</strong> Todas las llamadas de auxilio al <strong class="text-zinc-950 font-bold">9-1-1</strong> son gratuitas y entran directamente sin importar el operador de telecomunicaciones ni el balance de tu móvil.
            </p>
          </div>
          <span class="text-[10px] font-extrabold uppercase tracking-wider text-zinc-600 bg-white px-3 py-1 rounded-full border border-zinc-200/60 shrink-0">
            Llamada Gratuita
          </span>
        </div>
      </div>
    </div>

    <moni-divider inset="none" class="opacity-40"></moni-divider>

    <!-- Protocols Bento Grid -->
    <div class="space-y-4">
      <div>
        <span class="text-[11px] font-extrabold uppercase tracking-widest text-zinc-400">MEDIDAS DE SEGURIDAD</span>
        <h3 class="text-xl font-bold text-zinc-950 tracking-tight">Protocolos Oficiales ante Vaguadas y Lluvias Intensas</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Protocol 1: Driving (Highlight Tile) -->
        <div class="p-6 md:p-7 rounded-[32px] bg-white border border-zinc-200/80 shadow-sm space-y-3 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <moni-shape name="arch" color="surface" style="--_shape-bg: #EAEAEB; --_shape-fg: #111111;" size="small" class="shrink-0">
                <AppIcon name="car" class="w-4 h-4 text-zinc-900" />
              </moni-shape>
              <h4 class="text-sm font-bold text-zinc-950 leading-snug">
                Si te encuentras conduciendo durante aguaceros
              </h4>
            </div>
            <span class="text-[10px] font-bold bg-zinc-100 text-zinc-700 px-2.5 py-0.5 rounded-full border border-zinc-200/60">Vial</span>
          </div>
          <p class="text-xs text-zinc-600 leading-relaxed font-normal">
            Nunca intentes cruzar calles o pasos a desnivel anegados con corriente visible. Tan solo 30 centímetros de agua pueden arrastrar la mayoría de los vehículos ligeros. Si el motor se apaga, no insistas en encenderlo; sal del vehículo y dirígete a un punto elevado seguro.
          </p>
          <div class="pt-2 flex items-center space-x-2 text-[11px] text-zinc-700 font-semibold border-t border-zinc-100">
            <AppIcon name="shield" class="w-3.5 h-3.5 text-zinc-800" />
            <span>Mantén las luces intermitentes y distancia prudente de frenado.</span>
          </div>
        </div>

        <!-- Protocol 2: Vulnerable Home -->
        <div class="p-6 md:p-7 rounded-[32px] bg-white border border-zinc-200/80 shadow-sm space-y-3 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <moni-shape name="puffy" color="surface" style="--_shape-bg: #EAEAEB; --_shape-fg: #111111;" size="small" class="shrink-0">
                <AppIcon name="home" class="w-4 h-4 text-zinc-900" />
              </moni-shape>
              <h4 class="text-sm font-bold text-zinc-950 leading-snug">
                Si habitas cerca de cañadas, ríos o zonas de ladera
              </h4>
            </div>
            <span class="text-[10px] font-bold bg-zinc-100 text-zinc-700 px-2.5 py-0.5 rounded-full border border-zinc-200/60">Hogar</span>
          </div>
          <p class="text-xs text-zinc-600 leading-relaxed font-normal">
            Prepara una mochila con documentos familiares protegidos en bolsas plásticas herméticas, medicamentos indispensables y linterna con baterías recargables. Corta el suministro de energía eléctrica y gas si el nivel de agua comienza a entrar a la vivienda.
          </p>
          <div class="pt-2 flex items-center space-x-2 text-[11px] text-zinc-700 font-semibold border-t border-zinc-100">
            <AppIcon name="shield" class="w-3.5 h-3.5 text-zinc-800" />
            <span>Ubica con antelación el albergue oficial de tu sector.</span>
          </div>
        </div>

        <!-- Protocol 3: Electrical & Tree Hazards -->
        <div class="p-6 md:p-7 rounded-[32px] bg-white border border-zinc-200/80 shadow-sm space-y-3 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <moni-shape name="12-sided-cookie" color="surface" style="--_shape-bg: #EAEAEB; --_shape-fg: #111111;" size="small" class="shrink-0">
                <AppIcon name="tree" class="w-4 h-4 text-zinc-900" />
              </moni-shape>
              <h4 class="text-sm font-bold text-zinc-950 leading-snug">
                Cables del tendido eléctrico y árboles caídos
              </h4>
            </div>
            <span class="text-[10px] font-bold bg-zinc-100 text-zinc-700 px-2.5 py-0.5 rounded-full border border-zinc-200/60">Peligro</span>
          </div>
          <p class="text-xs text-zinc-600 leading-relaxed font-normal">
            Asume siempre que todo cable caído sobre la acera o sumergido en agua está energizado y es potencialmente letal. Aléjate un mínimo de 15 metros, advierte a los transeúntes y repórtalo inmediatamente al 9-1-1 o la distribuidora eléctrica correspondiente.
          </p>
          <div class="pt-2 flex items-center space-x-2 text-[11px] text-zinc-700 font-semibold border-t border-zinc-100">
            <AppIcon name="shield" class="w-3.5 h-3.5 text-zinc-800" />
            <span>No manipules ramas caídas sobre líneas eléctricas.</span>
          </div>
        </div>

        <!-- Protocol 4: Flash Floods & Drainage -->
        <div class="p-6 md:p-7 rounded-[32px] bg-white border border-zinc-200/80 shadow-sm space-y-3 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <moni-shape name="flower" color="surface" style="--_shape-bg: #EAEAEB; --_shape-fg: #111111;" size="small" class="shrink-0">
                <AppIcon name="water" class="w-4 h-4 text-zinc-900" />
              </moni-shape>
              <h4 class="text-sm font-bold text-zinc-950 leading-snug">
                Colaboración comunitaria con imbornales y desechos
              </h4>
            </div>
            <span class="text-[10px] font-bold bg-zinc-100 text-zinc-700 px-2.5 py-0.5 rounded-full border border-zinc-200/60">Comunidad</span>
          </div>
          <p class="text-xs text-zinc-600 leading-relaxed font-normal">
            No arrojes fundas de basura ni escombros a la calle durante o previo al paso de aguaceros. Los residuos taponan los imbornales y alcantarillados de la ciudad en menos de 10 minutos, provocando inundaciones repentinas en calles principales.
          </p>
          <div class="pt-2 flex items-center space-x-2 text-[11px] text-zinc-700 font-semibold border-t border-zinc-100">
            <AppIcon name="shield" class="w-3.5 h-3.5 text-zinc-800" />
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
