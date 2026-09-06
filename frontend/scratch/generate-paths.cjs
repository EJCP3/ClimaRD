const fs = require('fs');
const path = require('path');

const geojsonPath = path.resolve(__dirname, '../app/assets/data/dr-optimized.geojson.json');
const outputPath = path.resolve(__dirname, '../app/assets/data/provincias-dr-paths.json');

const geojsonData = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));

// 1. Projection function identical to DominicanGo
function computeProjection(data, width = 960, height = 500) {
  let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;

  data.features.forEach((f) => {
    if (!f.geometry || !f.geometry.coordinates) return;
    const coords = f.geometry.type === 'MultiPolygon'
      ? f.geometry.coordinates
      : [f.geometry.coordinates];

    coords.forEach((p) =>
      p.forEach((r) =>
        r.forEach(([lng, lat]) => {
          if (lng < minLng) minLng = lng;
          if (lng > maxLng) maxLng = lng;
          if (lat < minLat) minLat = lat;
          if (lat > maxLat) maxLat = lat;
        })
      )
    );
  });

  const PADDING = 20;
  const scaleX = (width - 2 * PADDING) / (maxLng - minLng);
  const scaleY = (height - 2 * PADDING) / (maxLat - minLat);
  const scale = Math.min(scaleX, scaleY);

  const offX = PADDING + ((width - 2 * PADDING) - (maxLng - minLng) * scale) / 2;
  const offY = PADDING + ((height - 2 * PADDING) - (maxLat - minLat) * scale) / 2;

  return {
    project: (coord) => {
      const px = offX + ((coord[0] - minLng) * scale);
      const py = offY + ((maxLat - coord[1]) * scale);
      return [Number(px.toFixed(1)), Number(py.toFixed(1))];
    },
    bounds: { minLng, maxLng, minLat, maxLat, scale, offX, offY }
  };
}

function computeRingCenter(ring) {
  let signedArea = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const x0 = ring[i][0];
    const y0 = ring[i][1];
    const x1 = ring[i + 1][0];
    const y1 = ring[i + 1][1];
    const a = x0 * y1 - x1 * y0;
    signedArea += a;
    cx += (x0 + x1) * a;
    cy += (y0 + y1) * a;
  }
  signedArea *= 0.5;
  if (signedArea === 0) return ring[0];
  cx /= 6 * signedArea;
  cy /= 6 * signedArea;
  return [Number(cx.toFixed(1)), Number(cy.toFixed(1))];
}

const nameToSlug = {
  'DISTRITO NACIONAL': 'distrito-nacional',
  'AZUA': 'azua',
  'BAHORUCO': 'bahoruco',
  'BAORUCO': 'bahoruco',
  'BARAHONA': 'barahona',
  'DAJABON': 'dajabon',
  'DAJABÓN': 'dajabon',
  'DUARTE': 'duarte',
  'ELIAS PIÑA': 'elias-pina',
  'ELÍAS PIÑA': 'elias-pina',
  'EL SEIBO': 'el-seibo',
  'ESPAILLAT': 'espaillat',
  'HATO MAYOR': 'hato-mayor',
  'HERMANAS MIRABAL': 'hermanas-mirabal',
  'INDEPENDENCIA': 'independencia',
  'LA ALTAGRACIA': 'la-altagracia',
  'LA ROMANA': 'la-romana',
  'LA VEGA': 'la-vega',
  'MARIA TRINIDAD SANCHEZ': 'maria-trinidad-sanchez',
  'MARÍA TRINIDAD SÁNCHEZ': 'maria-trinidad-sanchez',
  'MONSEÑOR NOUEL': 'monsenor-nouel',
  'MONTE CRISTI': 'monte-cristi',
  'MONTE PLATA': 'monte-plata',
  'PEDERNALES': 'pedernales',
  'PERAVIA': 'peravia',
  'PUERTO PLATA': 'puerto-plata',
  'SALCEDO': 'salcedo',
  'SAMANA': 'samana',
  'SAMANÁ': 'samana',
  'SANCHEZ RAMIREZ': 'sanchez-ramirez',
  'SÁNCHEZ RAMÍREZ': 'sanchez-ramirez',
  'SAN CRISTOBAL': 'san-cristobal',
  'SAN CRISTÓBAL': 'san-cristobal',
  'SAN JOSE DE OCOA': 'san-jose-de-ocoa',
  'SAN JOSÉ DE OCOA': 'san-jose-de-ocoa',
  'SAN JUAN': 'san-juan',
  'SAN PEDRO DE MACORIS': 'san-pedro-de-macoris',
  'SAN PEDRO DE MACORÍS': 'san-pedro-de-macoris',
  'SANTIAGO': 'santiago',
  'SANTIAGO RODRIGUEZ': 'santiago-rodriguez',
  'SANTIAGO RODRÍGUEZ': 'santiago-rodriguez',
  'SANTO DOMINGO': 'santo-domingo',
  'VALVERDE': 'valverde',
};

const provinceOfficialNames = {
  'distrito-nacional': 'Distrito Nacional',
  'azua': 'Azua',
  'bahoruco': 'Baoruco',
  'barahona': 'Barahona',
  'dajabon': 'Dajabón',
  'duarte': 'Duarte',
  'elias-pina': 'Elías Piña',
  'el-seibo': 'El Seibo',
  'espaillat': 'Espaillat',
  'hato-mayor': 'Hato Mayor',
  'hermanas-mirabal': 'Hermanas Mirabal',
  'independencia': 'Independencia',
  'la-altagracia': 'La Altagracia',
  'la-romana': 'La Romana',
  'la-vega': 'La Vega',
  'maria-trinidad-sanchez': 'María Trinidad Sánchez',
  'monsenor-nouel': 'Monseñor Nouel',
  'monte-cristi': 'Monte Cristi',
  'monte-plata': 'Monte Plata',
  'pedernales': 'Pedernales',
  'peravia': 'Peravia',
  'puerto-plata': 'Puerto Plata',
  'samana': 'Samaná',
  'sanchez-ramirez': 'Sánchez Ramírez',
  'san-cristobal': 'San Cristóbal',
  'san-jose-de-ocoa': 'San José de Ocoa',
  'san-juan': 'San Juan',
  'san-pedro-de-macoris': 'San Pedro de Macorís',
  'santiago': 'Santiago',
  'santiago-rodriguez': 'Santiago Rodríguez',
  'santo-domingo': 'Santo Domingo',
  'valverde': 'Valverde',
};

const shortLabels = {
  'distrito-nacional': 'D.N.',
  'santo-domingo': 'SANTO DOMINGO',
  'la-altagracia': 'LA ALTAGRACIA',
  'puerto-plata': 'PUERTO PLATA',
  'samana': 'SAMANÁ',
  'santiago': 'SANTIAGO',
  'la-romana': 'LA ROMANA',
  'barahona': 'BARAHONA',
  'la-vega': 'LA VEGA',
  'pedernales': 'PEDERNALES',
  'monte-cristi': 'MONTE CRISTI',
  'azua': 'AZUA',
  'duarte': 'DUARTE',
  'san-juan': 'SAN JUAN',
  'independencia': 'INDEPENDENCIA',
  'bahoruco': 'BAHORUCO',
  'san-cristobal': 'S. CRISTÓBAL',
  'monte-plata': 'MONTE PLATA',
  'hato-mayor': 'HATO MAYOR',
  'el-seibo': 'EL SEIBO',
  'san-pedro-de-macoris': 'S.P. MACORÍS',
  'peravia': 'PERAVIA',
  'espaillat': 'ESPAILLAT',
  'maria-trinidad-sanchez': 'M.T. SÁNCHEZ',
  'valverde': 'VALVERDE',
  'dajabon': 'DAJABÓN',
  'santiago-rodriguez': 'S. RODRÍGUEZ',
  'elias-pina': 'E. PIÑA',
  'sanchez-ramirez': 'S. RAMÍREZ',
  'monsenor-nouel': 'M. NOUEL',
  'san-jose-de-ocoa': 'S.J. OCOA',
  'hermanas-mirabal': 'H. MIRABAL',
};

const centroidOverrides = {
  'distrito-nacional': [522.0, 294.0],
  'santo-domingo': [565.0, 268.0],
  'espaillat': [428.0, 76.0],
  'hermanas-mirabal': [444.0, 118.0]
};

const provinceCodes = {
  'distrito-nacional': '01',
  'azua': '02',
  'bahoruco': '03',
  'barahona': '04',
  'dajabon': '05',
  'duarte': '06',
  'elias-pina': '07',
  'el-seibo': '08',
  'espaillat': '09',
  'independencia': '10',
  'la-altagracia': '11',
  'la-romana': '12',
  'la-vega': '13',
  'maria-trinidad-sanchez': '14',
  'monte-cristi': '15',
  'pedernales': '16',
  'peravia': '17',
  'puerto-plata': '18',
  'hermanas-mirabal': '19',
  'samana': '20',
  'san-cristobal': '21',
  'san-juan': '22',
  'san-pedro-de-macoris': '23',
  'sanchez-ramirez': '24',
  'santiago': '25',
  'santiago-rodriguez': '26',
  'valverde': '27',
  'monsenor-nouel': '28',
  'monte-plata': '29',
  'hato-mayor': '30',
  'san-jose-de-ocoa': '31',
  'santo-domingo': '32',
};

const provinceColors = {
  'puerto-plata': '#6D8E9A',
  'santiago': '#5E7D8C',
  'valverde': '#7A9DAA',
  'monte-cristi': '#688A98',
  'dajabon': '#627F8E',
  'santiago-rodriguez': '#6F8D98',
  'espaillat': '#7D9BA6',
  'hermanas-mirabal': '#7898A3',
  'la-vega': '#6A8B9A',
  'monsenor-nouel': '#7494A2',
  'sanchez-ramirez': '#809FA9',
  'duarte': '#6E8C9A',
  'maria-trinidad-sanchez': '#607A8A',
  'samana': '#6B909E',
  'azua': '#8AB87A',
  'barahona': '#7DAE6E',
  'pedernales': '#96C486',
  'independencia': '#85B475',
  'bahoruco': '#79A86A',
  'san-juan': '#82B072',
  'elias-pina': '#74A465',
  'peravia': '#9ECC8E',
  'san-jose-de-ocoa': '#8BBC7C',
  'san-cristobal': '#92C082',
  'la-altagracia': '#7ABABE',
  'la-romana': '#88C4C0',
  'san-pedro-de-macoris': '#94CCC6',
  'hato-mayor': '#84C0B8',
  'el-seibo': '#78B6AE',
  'monte-plata': '#8EC8C0',
  'distrito-nacional': '#80BABA',
  'santo-domingo': '#92C8C2',
};

const { project } = computeProjection(geojsonData, 960, 500);

const result = [];

geojsonData.features.forEach((feature) => {
  const rawProp = feature.properties ? (feature.properties.province_name || feature.properties.PROV || '') : '';
  const rawName = String(rawProp).trim().normalize('NFC').toUpperCase();
  const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();
  const normalizedMap = {};
  for (const [k, v] of Object.entries(nameToSlug)) {
    normalizedMap[norm(k)] = v;
  }
  const slug = normalizedMap[norm(rawName)];
  if (!slug) {
    console.warn('Unmapped province:', rawName);
    return;
  }

  let d = '';
  let largestRing = null;
  let maxArea = 0;

  const checkRing = (ring) => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    ring.forEach(c => {
      if (c[0] < minX) minX = c[0]; if (c[0] > maxX) maxX = c[0];
      if (c[1] < minY) minY = c[1]; if (c[1] > maxY) maxY = c[1];
    });
    const area = (maxX - minX) * (maxY - minY);
    if (area > maxArea) {
      maxArea = area;
      largestRing = ring;
    }
  };

  if (feature.geometry.type === 'Polygon') {
    feature.geometry.coordinates.forEach((ring) => {
      const projRing = ring.map(project);
      d += 'M' + projRing.map((c) => `${c[0]},${c[1]}`).join('L') + 'Z ';
    });
    checkRing(feature.geometry.coordinates[0]);
  } else if (feature.geometry.type === 'MultiPolygon') {
    feature.geometry.coordinates.forEach((polygon) => {
      polygon.forEach((ring) => {
        const projRing = ring.map(project);
        d += 'M' + projRing.map((c) => `${c[0]},${c[1]}`).join('L') + 'Z ';
      });
      checkRing(polygon[0]);
    });
  }

  const projLargestRing = largestRing ? largestRing.map(project) : [];
  let rawCentroid = projLargestRing.length ? computeRingCenter(projLargestRing) : [480, 250];
  if (centroidOverrides[slug]) {
    rawCentroid = centroidOverrides[slug];
  }

  result.push({
    code: provinceCodes[slug] || '00',
    slug,
    name: provinceOfficialNames[slug] || rawProp,
    shortLabel: shortLabels[slug] || rawProp,
    path: d.trim(),
    centroid: rawCentroid,
    color: provinceColors[slug] || '#80BABA'
  });
});

result.sort((a, b) => a.code.localeCompare(b.code));

fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
console.log(`Successfully generated ${result.length} provinces to ${outputPath}`);
