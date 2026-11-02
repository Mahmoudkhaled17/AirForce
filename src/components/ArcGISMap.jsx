import { useEffect, useRef } from 'react'
import ArcGISMapView from '@arcgis/core/Map.js'
import MapView from '@arcgis/core/views/MapView.js'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js'
import Legend from '@arcgis/core/widgets/Legend.js'
import esriConfig from '@arcgis/core/config.js'
import { BASE_URL, LAYERS, WEB_SCENE_ITEM_ID } from '../utils/arcgisConfig'

esriConfig.apiKey = import.meta.env.VITE_ARCGIS_API_KEY || ''

const makeLayer = (id, options = {}) => new FeatureLayer({
  url: `${BASE_URL}/${id}`,
  outFields: ['*'],
  ...options,
})

const cleanText = (value) => String(value ?? '').normalize('NFKC').replace(/[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, '').trim()
const cleanSearch = (value) => cleanText(value).toLocaleLowerCase('ar').replace(/[ًٌٍَُِّْـ]/g, '')
const escapeHtml = (value) => String(value ?? '—').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
const isNumericField = (field) => ['small-integer', 'integer', 'single', 'double', 'long'].includes(field?.type)
const fieldLabel = (field, value) => field?.domain?.codedValues?.find((item) => String(item.code) === String(value))?.name ?? String(value ?? '')
const whereForValue = (field, fieldName, value) => isNumericField(field) || typeof value === 'number'
  ? `${fieldName} = ${Number(value)}`
  : `${fieldName} = '${String(value).replaceAll("'", "''")}'`

const discoverLayerId = async (fallback) => {
  try {
    const response = await fetch(`${BASE_URL}?f=pjson`)
    if (!response.ok) return fallback
    const service = await response.json()
    const layer = (service.layers || []).find((item) => /goverment|government|محافظ/.test(String(item.name).toLowerCase()))
    return layer?.id ?? fallback
  } catch {
    return fallback
  }
}

const classifyStatus = (value, field) => {
  const status = cleanText(fieldLabel(field, value))
  if (status.includes('مرفوض') || status.includes('رفض') || /reject/i.test(status)) return 'rejected'
  if (status.includes('تم التصريح') || status.includes('مصرح') || status.includes('تصريح') || /approv/i.test(status)) return 'approved'
  if (typeof value === 'number' || /^\d+$/.test(String(value))) return Number(value) === 1 ? 'approved' : Number(value) === 0 ? 'rejected' : 'other'
  return 'other'
}

const queryAllFeatures = async (layer, outFields = ['*']) => {
  try {
    const objectIds = await layer.queryObjectIds({ where: '1=1' })
    if (objectIds?.length) {
      const pages = []
      for (let index = 0; index < objectIds.length; index += 200) pages.push(objectIds.slice(index, index + 200))
      const results = await Promise.all(pages.map((ids) => layer.queryFeatures({ objectIds: ids, outFields, returnGeometry: false })))
      return results.flatMap((result) => result.features)
    }
  } catch {
    console.warn('Could not page layer features', layer.title)
  }
  try {
    const result = await layer.queryFeatures({ where: '1=1', outFields, returnGeometry: false })
    return result.features
  } catch (error) {
    console.warn('Could not query layer features', layer.title, error)
    return []
  }
}

export default function ArcGISMap({ onStats, onGovernorates, onCatalog, onSearchResults, onServiceState, onReady, visibility, viewMode = '2d' }) {
  const containerRef = useRef(null)
  const layersRef = useRef(null)
  const visibilityRef = useRef(visibility)

  useEffect(() => {
    visibilityRef.current = visibility
  }, [visibility])

  useEffect(() => {
    let view
    let disposed = false
    let searchTimer
    let activeTowerStatus = 'all'
    let activeTowerGovernment = null

    let airportLayer = makeLayer(LAYERS.AIRPORTS, {
      title: 'المطارات',
      popupTemplate: { title: '{name}', content: [{ type: 'fields', fieldInfos: [
        { fieldName: 'name', label: 'اسم المطار' },
        { fieldName: 'goverment', label: 'المحافظة' },
      ] }] },
    })
    let towerLayer = makeLayer(LAYERS.TOWERS, {
      title: 'أبراج الاتصالات',
      popupTemplate: { title: '{company}', content: [{ type: 'fields', fieldInfos: [
        { fieldName: 'code', label: 'كود البرج' },
        { fieldName: 'company', label: 'الشركة' },
        { fieldName: 'approviation', label: 'حالة التصريح' },
        { fieldName: 'height', label: 'الارتفاع الفعلي (متر)', format: { places: 1, digitSeparator: true } },
        { fieldName: 'notice', label: 'ملاحظات النظام' },
        { fieldName: 'goverment', label: 'المحافظة' },
      ] }] },
    })
    let towerDisplayLayer = towerLayer
    let ringsLayer = makeLayer(LAYERS.BUFFER_RINGS, { title: 'نطاقات الحماية' })
    // No renderer is supplied so ArcGIS keeps the published goverment symbology.
    let governoratesLayer = makeLayer(LAYERS.GOVERNMENT, { title: 'goverment' })
    let airportDataLayer = airportLayer
    let governmentDataLayer = governoratesLayer

    const start = async () => {
      try {
        onServiceState('loading')
        let map
        let SceneViewClass
        if (viewMode === '3d') {
          const [{ default: WebScene }, { default: SceneView }] = await Promise.all([
            import('@arcgis/core/WebScene.js'),
            import('@arcgis/core/views/SceneView.js'),
          ])
          SceneViewClass = SceneView
          map = new WebScene({ portalItem: { id: WEB_SCENE_ITEM_ID } })
          view = new SceneView({
            container: containerRef.current,
            map,
            qualityProfile: 'high',
            environment: { atmosphereEnabled: true, starsEnabled: false },
            popup: { dockEnabled: false, collapseEnabled: false },
            ui: { components: ['zoom', 'compass', 'navigation-toggle'] },
          })
        } else {
          map = new ArcGISMapView({ basemap: 'satellite', layers: [governoratesLayer, ringsLayer, airportLayer, towerLayer] })
          view = new MapView({ container: containerRef.current, map, center: [30.8, 26.8], zoom: 6, constraints: { minZoom: 5, maxZoom: 17 }, popup: { dockEnabled: false, collapseEnabled: false }, ui: { components: ['zoom', 'compass'] } })
        }
        layersRef.current = { airportLayer, towerLayer: towerDisplayLayer, ringsLayer, governoratesLayer }
        if (viewMode === '3d') {
          try {
            await view.when()
            await map.load()
          } catch (sceneError) {
            // A private/unavailable portal item must not leave the map as a
            // white canvas. Keep the live FeatureServer layers and open a
            // local SceneView as a graceful 3D fallback.
            console.warn('Web Scene could not be loaded; using live 3D fallback', sceneError)
            view?.destroy()
            map = new ArcGISMapView({ basemap: 'osm', ground: 'world-elevation', layers: [governoratesLayer, ringsLayer, airportLayer, towerLayer] })
            view = new SceneViewClass({
              container: containerRef.current,
              map,
              qualityProfile: 'high',
              environment: { atmosphereEnabled: true, starsEnabled: false },
              popup: { dockEnabled: false, collapseEnabled: false },
              ui: { components: ['zoom', 'compass', 'navigation-toggle'] },
            })
            await view.when()
          }
        } else {
          await view.when()
          try {
            await map.basemap.load()
          } catch {
            map.basemap = 'osm'
          }
        }

        if (viewMode === '3d') {
          const sceneLayers = map.allLayers?.toArray?.() || map.layers?.toArray?.() || []
          const matchesSceneLayer = (layer, ids, labels) => {
            const url = String(layer.url || '').replace(/\/+$/, '').toLowerCase()
            const title = cleanText(layer.title).toLocaleLowerCase('ar')
            return ids.some((id) => url.endsWith(`/featureserver/${id}`) || url.endsWith(`/sceneserver/${id}`)) || labels.some((label) => title.includes(label))
          }
          const pickSceneLayer = (fallback, ids, labels) => sceneLayers.find((layer) => matchesSceneLayer(layer, ids, labels)) || fallback
          airportLayer = pickSceneLayer(airportLayer, [LAYERS.AIRPORTS], ['المطارات', 'airport'])
          towerLayer = pickSceneLayer(towerLayer, [LAYERS.TOWERS], ['الأبراج', 'الابراج', 'tower'])
          towerDisplayLayer = towerLayer
          // The published scene uses a SceneServer layer for the 3D tower models.
          // SceneServer query endpoints are not available on this item, so keep
          // the scene layer for rendering and use the live FeatureServer layer
          // for counts, search, filters, and attribute-driven popups.
          if (/sceneserver/i.test(String(towerDisplayLayer.url || ''))) towerLayer = makeLayer(LAYERS.TOWERS, { title: 'أبراج الاتصالات' })
          ringsLayer = pickSceneLayer(ringsLayer, [LAYERS.BUFFER_RINGS], ['multipleringbuffer', 'multiple ring', 'نطاقات الحماية'])
          governoratesLayer = pickSceneLayer(governoratesLayer, [LAYERS.GOVERNMENT], ['goverment', 'government', 'محافظ'])
          airportDataLayer = makeLayer(LAYERS.AIRPORTS, {
            title: 'المطارات',
            popupTemplate: { title: '{name}', content: [{ type: 'fields', fieldInfos: [
              { fieldName: 'name', label: 'اسم المطار' },
              { fieldName: 'goverment', label: 'المحافظة' },
            ] }] },
          })
          governmentDataLayer = makeLayer(LAYERS.GOVERNMENT, { title: 'goverment' })
          const loadedSceneLayers = map.allLayers?.toArray?.() || []
          ;[governoratesLayer, ringsLayer, airportLayer, towerDisplayLayer].forEach((layer) => {
            if (!loadedSceneLayers.includes(layer)) map.add(layer)
          })
          layersRef.current = { airportLayer, towerLayer: towerDisplayLayer, ringsLayer, governoratesLayer }
        }

        const airportLayersToLoad = [airportLayer, airportDataLayer].filter((layer, index, list) => list.indexOf(layer) === index)
        const towerLayersToLoad = [towerLayer, towerDisplayLayer].filter((layer, index, list) => list.indexOf(layer) === index)
        const governmentLayersToLoad = [governoratesLayer, governmentDataLayer].filter((layer, index, list) => list.indexOf(layer) === index)
        const [airportLoads, towerLoads, governmentLoads] = await Promise.all([
          Promise.allSettled(airportLayersToLoad.map((layer) => layer.load())),
          Promise.allSettled(towerLayersToLoad.map((layer) => layer.load())),
          Promise.allSettled(governmentLayersToLoad.map((layer) => layer.load())),
        ])
        const airportDataLoad = airportLoads[airportLayersToLoad.indexOf(airportDataLayer)]
        const towerDataLoad = towerLoads[towerLayersToLoad.indexOf(towerLayer)]
        if (airportDataLoad?.status === 'rejected' || towerDataLoad?.status === 'rejected') {
          throw airportDataLoad?.reason || towerDataLoad?.reason || new Error('Airport or tower layer could not be loaded')
        }
        const ringsLoad = await ringsLayer.load().then(() => true).catch(() => false)
        let governmentAvailable = governmentLoads[governmentLayersToLoad.indexOf(governoratesLayer)]?.status === 'fulfilled'
        if (towerDisplayLayer !== towerLayer) towerDisplayLayer.popupTemplate = towerLayer.popupTemplate
        if (airportLayer !== airportDataLayer) airportLayer.popupTemplate = airportDataLayer.popupTemplate
        if (!ringsLoad) map.remove(ringsLayer)
        if (!governmentAvailable) {
          const discoveredId = await discoverLayerId(LAYERS.GOVERNMENT)
          if (discoveredId !== LAYERS.GOVERNMENT) {
            map.remove(governoratesLayer)
            governoratesLayer = makeLayer(discoveredId, { title: 'goverment' })
            map.add(governoratesLayer, 0)
            governmentAvailable = await governoratesLayer.load().then(() => true).catch(() => false)
            if (layersRef.current) layersRef.current.governoratesLayer = governoratesLayer
          }
        }
        if (!governmentAvailable) map.remove(governoratesLayer)
        if (governmentAvailable) governoratesLayer.visible = true
        airportLayer.visible = visibilityRef.current.airport
        towerDisplayLayer.visible = visibilityRef.current.towers
        ringsLayer.visible = visibilityRef.current.rings
        governoratesLayer.visible = visibilityRef.current.government && governmentAvailable
        if (viewMode === '3d' && towerLayer.fullExtent) {
          try { await view.goTo({ target: towerLayer.fullExtent.expand(1.25), tilt: 52, heading: 0 }, { duration: 0 }) } catch { /* keep the Web Scene viewpoint */ }
        }
        if (disposed) return

        const field = (layer, name) => (layer.fields || []).find((item) => item.name.toLowerCase() === name)
        const statusFieldInfo = field(towerLayer, 'approviation')
        const statusField = statusFieldInfo?.name || 'approviation'
        const towerNameFieldInfo = field(towerLayer, 'name')
        const towerNameField = towerNameFieldInfo?.name
        const codeFieldInfo = field(towerLayer, 'code')
        const codeField = codeFieldInfo?.name || 'code'
        const companyFieldInfo = field(towerLayer, 'company')
        const companyField = companyFieldInfo?.name || 'company'
        const towerGovernmentFieldInfo = field(towerLayer, 'goverment')
        const towerGovernmentField = towerGovernmentFieldInfo?.name || 'goverment'
        const airportNameFieldInfo = field(airportDataLayer, 'name')
        const airportNameField = airportNameFieldInfo?.name || 'name'
        const airportGovernmentFieldInfo = field(airportDataLayer, 'goverment')
        const airportGovernmentField = airportGovernmentFieldInfo?.name || 'goverment'
        const governmentFieldInfo = governmentAvailable ? (field(governmentDataLayer, 'goverment') || field(governmentDataLayer, 'name')) : null
        const governmentField = governmentFieldInfo?.name || 'goverment'

        const [towerRecords, airportRecords, governmentRecords] = await Promise.all([
          queryAllFeatures(towerLayer),
          queryAllFeatures(airportDataLayer),
          governmentAvailable ? queryAllFeatures(governmentDataLayer) : Promise.resolve([]),
        ])
        if (disposed) return

        const boundaryNameField = governmentAvailable ? (governmentDataLayer.fields || []).find((item) => item.name.toLowerCase() === 'name' && item.name.toLowerCase() !== governmentField.toLowerCase()) : null
        const boundaryNames = new Map(governmentRecords.map((feature) => [String(feature.attributes[governmentField]), boundaryNameField ? feature.attributes[boundaryNameField.name] : null]).filter(([, value]) => value))
        const governmentLabel = (value) => fieldLabel(towerGovernmentFieldInfo, value) !== String(value) ? fieldLabel(towerGovernmentFieldInfo, value) : fieldLabel(governmentFieldInfo, value) !== String(value) ? fieldLabel(governmentFieldInfo, value) : boundaryNames.get(String(value)) || String(value ?? '')

        const groups = new Map()
        towerRecords.forEach((feature) => {
          const attrs = feature.attributes
          const governmentValue = attrs[towerGovernmentField]
          if (governmentValue === null || governmentValue === undefined || governmentValue === '') return
          const governmentKey = String(governmentValue)
          if (!groups.has(governmentKey)) groups.set(governmentKey, { value: governmentKey, label: governmentLabel(governmentValue), count: 0, companies: new Map() })
          const government = groups.get(governmentKey)
          government.count += 1
          const companyValue = attrs[companyField]
          if (companyValue === null || companyValue === undefined || companyValue === '') return
          const companyKey = String(companyValue)
          if (!government.companies.has(companyKey)) government.companies.set(companyKey, { value: companyKey, label: fieldLabel(companyFieldInfo, companyValue), count: 0, towers: [] })
          const company = government.companies.get(companyKey)
          company.count += 1
          company.towers.push({ id: feature.attributes[towerLayer.objectIdField] ?? feature.attributes.OBJECTID, code: attrs[codeField] ?? feature.attributes[towerLayer.objectIdField], codeLabel: fieldLabel(codeFieldInfo, attrs[codeField]), name: towerNameField ? attrs[towerNameField] : '' })
        })
        const towerGovernorates = [...groups.values()].map((group) => ({ ...group, companies: [...group.companies.values()] })).sort((a, b) => a.label.localeCompare(b.label, 'ar'))
        const airports = airportRecords.map((feature) => ({ id: feature.attributes[airportDataLayer.objectIdField] ?? feature.attributes.OBJECTID, name: feature.attributes[airportNameField], government: fieldLabel(airportGovernmentFieldInfo, feature.attributes[airportGovernmentField]) })).filter((item) => item.name)
        onCatalog({ towerGovernorates, airports })
        onGovernorates(towerGovernorates.map(({ value, label }) => ({ value, label })))

        const statusValues = { approved: [], rejected: [] }
        let approved = 0
        let rejected = 0
        const seenStatusValues = new Set()
        towerRecords.forEach((feature) => {
          const raw = feature.attributes[statusField]
          const type = classifyStatus(raw, statusFieldInfo)
          const key = String(raw)
          if (type !== 'other' && !seenStatusValues.has(`${type}|${key}`)) { statusValues[type].push(raw); seenStatusValues.add(`${type}|${key}`) }
          if (type === 'approved') approved += 1
          if (type === 'rejected') rejected += 1
        })
        onStats({ approved, rejected, airports: airports.length, towers: towerRecords.length, namedAirports: airports.length, airportGovernorates: new Set(airports.map((item) => item.government)).size })
        onServiceState('ready')
        const legendLayers = [governmentAvailable && governoratesLayer, ringsLoad && ringsLayer, airportLayer, towerDisplayLayer].filter(Boolean)
        const legend = new Legend({ view, layerInfos: legendLayers.map((layer) => ({ layer })) })
        view.ui.add(legend, 'bottom-right')

        const selectedGovernmentGroup = () => towerGovernorates.find((item) => String(item.value) === String(activeTowerGovernment))
        const matchesSelectedGovernment = (feature, fieldInfo, fieldName) => {
          if (activeTowerGovernment === null || activeTowerGovernment === '') return true
          const raw = feature.attributes[fieldName]
          const group = selectedGovernmentGroup()
          return String(raw) === String(activeTowerGovernment) || cleanText(fieldLabel(fieldInfo, raw)) === cleanText(group?.label)
        }
        const applyTowerFilter = () => {
          const clauses = []
          if (activeTowerStatus !== 'all') {
            const values = statusValues[activeTowerStatus] || []
            clauses.push(values.length
              ? `${statusField} IN (${values.map((value) => isNumericField(statusFieldInfo) ? Number(value) : `'${String(value).replaceAll("'", "''")}'`).join(',')})`
              : `${statusField} = ${activeTowerStatus === 'approved' ? 1 : 0}`)
          }
          if (activeTowerGovernment !== null && activeTowerGovernment !== '') clauses.push(whereForValue(towerGovernmentFieldInfo, towerGovernmentField, activeTowerGovernment))
          const expression = clauses.length ? clauses.join(' AND ') : null
          towerLayer.definitionExpression = expression
          if (towerDisplayLayer !== towerLayer) towerDisplayLayer.definitionExpression = expression
        }

        const popupContentForFeature = (type, attributes) => {
          const rows = type === 'tower'
            ? [
              ['كود البرج', attributes[codeField]],
              ['الشركة', fieldLabel(companyFieldInfo, attributes[companyField])],
              ['حالة التصريح', fieldLabel(statusFieldInfo, attributes[statusField])],
              ['الارتفاع الفعلي', `${attributes.height ?? '—'} متر`],
              ['ملاحظات النظام', attributes.notice || 'مطابق للاشتراطات'],
              ['المحافظة', governmentLabel(attributes[towerGovernmentField])],
            ]
            : [
              ['اسم المطار', attributes[airportNameField]],
              ['المحافظة', fieldLabel(airportGovernmentFieldInfo, attributes[airportGovernmentField])],
            ]
          const safety = type === 'tower' ? (cleanText(attributes.notice).includes('تجاوز') ? 'يتطلب مراجعة' : 'مطابق للاشتراطات') : null
          const safetyRow = safety ? `<div class="airnav-popup-safety ${safety === 'يتطلب مراجعة' ? 'alert' : 'ok'}"><span>تقييم السلامة</span><b>${escapeHtml(safety)}</b></div>` : ''
          return `<div class="airnav-popup-details" dir="rtl"><table><tbody>${rows.map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join('')}</tbody></table>${safetyRow}</div>`
        }

        const focusFeature = async (type, id) => {
          const layer = type === 'airport' ? airportDataLayer : towerLayer
          const result = await layer.queryFeatures({ objectIds: [id], outFields: ['*'], returnGeometry: true })
          const feature = result.features[0]
          if (!feature?.geometry) return
          const location = feature.geometry.type === 'point' ? feature.geometry : feature.geometry.extent.center
          await view.goTo({ target: location, zoom: type === 'airport' ? 12 : 14 }, { duration: 650 })
          const title = type === 'airport' ? feature.attributes[airportNameField] : fieldLabel(companyFieldInfo, feature.attributes[companyField])
          view.openPopup({ title, content: popupContentForFeature(type, feature.attributes), location })
        }
        const search = (raw) => {
          clearTimeout(searchTimer)
          const term = cleanSearch(raw)
          if (!term) { onSearchResults?.([]); return }
          searchTimer = window.setTimeout(() => {
            const searchable = (feature, layer) => (layer.fields || []).some((item) => {
              if (item.type === 'geometry' || item.name.toLowerCase() === 'shape') return false
              const value = feature.attributes[item.name]
              return cleanSearch(value).includes(term) || cleanSearch(fieldLabel(item, value)).includes(term)
            })
            const towerSuggestions = towerRecords.filter((feature) => (activeTowerStatus === 'all' || classifyStatus(feature.attributes[statusField], statusFieldInfo) === activeTowerStatus) && matchesSelectedGovernment(feature, towerGovernmentFieldInfo, towerGovernmentField) && searchable(feature, towerLayer)).map((feature) => {
              const attrs = feature.attributes
              const id = attrs[towerLayer.objectIdField] ?? attrs.OBJECTID
              const code = attrs[codeField]
              const company = fieldLabel(companyFieldInfo, attrs[companyField])
              const government = towerGovernorates.find((item) => String(item.value) === String(attrs[towerGovernmentField]))?.label || fieldLabel(towerGovernmentFieldInfo, attrs[towerGovernmentField])
              return { type: 'tower', id, label: towerNameField ? attrs[towerNameField] || company : company, meta: `برج · ${code ?? id} · ${government}` }
            })
            const airportSuggestions = airportRecords.filter((feature) => matchesSelectedGovernment(feature, airportGovernmentFieldInfo, airportGovernmentField) && searchable(feature, airportDataLayer)).map((feature) => {
              const attrs = feature.attributes
              const id = attrs[airportDataLayer.objectIdField] ?? attrs.OBJECTID
              return { type: 'airport', id, label: attrs[airportNameField], meta: `مطار · ${fieldLabel(airportGovernmentFieldInfo, attrs[airportGovernmentField])}` }
            })
            const suggestions = [...towerSuggestions, ...airportSuggestions].filter((item, index, list) => list.findIndex((other) => `${other.type}-${other.id}` === `${item.type}-${item.id}`) === index).slice(0, 8)
            onSearchResults?.(suggestions)
          }, 120)
        }
        const selectSearchResult = (suggestion) => focusFeature(suggestion.type, suggestion.id)
        const boundaryValueForTowerGovernment = (value) => {
          const towerGovernment = towerGovernorates.find((item) => String(item.value) === String(value))
          if (!towerGovernment) return null
          const boundary = governmentRecords.find((feature) => {
            const attrs = feature.attributes
            return [attrs.name, attrs.name_ar, attrs.name_local, attrs.name_en].some((item) => cleanText(item) === cleanText(towerGovernment.label))
          })
          return boundary?.attributes[governmentField] ?? null
        }
        const filterGovernorate = async (value) => {
          activeTowerGovernment = value || null
          applyTowerFilter()
          if (!value) {
            airportLayer.definitionExpression = null
            if (airportDataLayer !== airportLayer) airportDataLayer.definitionExpression = null
            await view.goTo({ center: [30.8, 26.8], zoom: 6 }, { duration: 500 })
            return
          }
          const airportHasSameCode = airportRecords.some((feature) => String(feature.attributes[airportGovernmentField]) === String(value))
          const airportExpression = airportHasSameCode ? whereForValue(airportGovernmentFieldInfo, airportGovernmentField, value) : null
          airportLayer.definitionExpression = airportExpression
          if (airportDataLayer !== airportLayer) airportDataLayer.definitionExpression = airportExpression
          const boundaryValue = boundaryValueForTowerGovernment(value)
          if (governmentAvailable && boundaryValue !== null) {
            const boundaryWhere = whereForValue(governmentFieldInfo, governmentField, boundaryValue)
            const result = await governmentDataLayer.queryFeatures({ where: boundaryWhere, outFields: ['*'], returnGeometry: true })
            if (result.features[0]?.geometry) await view.goTo(result.features[0].geometry.extent.expand(1.3), { duration: 650 })
            return
          }
          if (!governmentAvailable) {
            const towerWhere = whereForValue(towerGovernmentFieldInfo, towerGovernmentField, value)
            const result = await towerLayer.queryFeatures({ where: towerWhere, outFields: ['*'], returnGeometry: true })
            const points = result.features.map((feature) => feature.geometry).filter(Boolean)
            if (points.length) await view.goTo(points.length === 1 ? { target: points[0], zoom: 12 } : points, { duration: 650 })
            return
          }
          const result = await towerLayer.queryFeatures({ where: whereForValue(towerGovernmentFieldInfo, towerGovernmentField, value), outFields: ['*'], returnGeometry: true })
          const points = result.features.map((feature) => feature.geometry).filter(Boolean)
          if (points.length) await view.goTo(points.length === 1 ? { target: points[0], zoom: 12 } : points, { duration: 650 })
        }
        const filterStatus = (status) => {
          activeTowerStatus = status
          applyTowerFilter()
        }
        const companiesForGovernorate = async (governmentValue) => towerGovernorates.find((item) => String(item.value) === String(governmentValue))?.companies || []
        const focusTowerGroup = async (companyValue, governmentValue) => {
          const governmentWhere = whereForValue(towerGovernmentFieldInfo, towerGovernmentField, governmentValue)
          const companyWhere = whereForValue(companyFieldInfo, companyField, companyValue)
          const result = await towerLayer.queryFeatures({ where: `(${governmentWhere}) AND (${companyWhere})`, outFields: ['*'], returnGeometry: true })
          const feature = result.features[0]
          if (feature) await focusFeature('tower', feature.attributes[towerLayer.objectIdField] ?? feature.attributes.OBJECTID)
        }
        onReady({ search, selectSearchResult, filterGovernorate, filterStatus, focusFeature, focusGovernorate: filterGovernorate, focusTowerGroup, companiesForGovernorate, home: () => view.goTo({ center: [30.8, 26.8], zoom: 6 }, { duration: 500 }) })
        view.on('click', async (event) => {
          // Restrict the 2D hit test to the two clickable point layers. Without
          // this, a government polygon (which also has a `name` field) can win
          // the hit test and the airport popup is opened with empty attributes.
          const response = viewMode === '2d'
            ? await view.hitTest(event, { include: [towerDisplayLayer, airportLayer] })
            : await view.hitTest(event)
          const graphics = response.results.map((item) => item.graphic).filter(Boolean)
          const graphic = graphics.find((item) => item.layer === towerDisplayLayer || item.layer === airportLayer || item.layer?.title === towerDisplayLayer.title || item.layer?.title === airportLayer.title)
          if (!graphic) { view.closePopup(); return }
          const isTowerGraphic = graphic.layer === towerDisplayLayer || graphic.layer?.title === towerDisplayLayer.title
          const dataLayer = isTowerGraphic ? towerLayer : airportDataLayer
          let popupGraphic = graphic
          const objectIdField = graphic.layer?.objectIdField || 'OBJECTID'
          const objectId = graphic.attributes?.[objectIdField] ?? graphic.attributes?.OBJECTID ?? graphic.attributes?.FID
          if (dataLayer !== graphic.layer && objectId !== undefined && objectId !== null) {
            const result = await dataLayer.queryFeatures({ objectIds: [objectId], outFields: ['*'], returnGeometry: true })
            popupGraphic = result.features[0] || graphic
          }
          const title = isTowerGraphic ? fieldLabel(companyFieldInfo, popupGraphic.attributes[companyField]) : popupGraphic.attributes[airportNameField]
          view.openPopup({ title, content: popupContentForFeature(isTowerGraphic ? 'tower' : 'airport', popupGraphic.attributes), location: event.mapPoint })
        })
      } catch (error) {
        console.error('ArcGIS service could not be loaded', error)
        onServiceState('error')
      }
    }
    start()
    return () => { disposed = true; clearTimeout(searchTimer); view?.destroy() }
  }, [onStats, onGovernorates, onCatalog, onSearchResults, onServiceState, onReady, viewMode])

  useEffect(() => {
    if (!layersRef.current) return
    layersRef.current.airportLayer.visible = visibility.airport
    layersRef.current.towerLayer.visible = visibility.towers
    layersRef.current.ringsLayer.visible = visibility.rings
    layersRef.current.governoratesLayer.visible = visibility.government
  }, [visibility])

  return <div className="arcgis-map" ref={containerRef} aria-label="الخريطة المكانية لمواقع المطارات والأبراج" />
}
