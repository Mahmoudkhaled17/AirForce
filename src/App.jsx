import { lazy, Suspense, useEffect, useState } from 'react'
import { Activity, Airplay, Bell, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Clock3, Crosshair, Database, Globe2, Layers3, Map as MapIcon, MapPinned, RadioTower, Search, ShieldCheck, ShieldX, Signal, SlidersHorizontal } from 'lucide-react'
import './App.css'

const ArcGISMap = lazy(() => import('./components/ArcGISMap'))
const initialStats = { approved: null, rejected: null, airports: null, towers: null, namedAirports: null, airportGovernorates: null }
const formatCount = (count) => Number.isFinite(count) ? count.toLocaleString('ar-EG') : '—'

export default function App() {
  const [stats, setStats] = useState(initialStats)
  const [search, setSearch] = useState('')
  const [governorate, setGovernorate] = useState('')
  const [mapTools, setMapTools] = useState({ airport: true, towers: true, rings: true, government: true })
  const [towerStatus, setTowerStatus] = useState('all')
  const [serviceState, setServiceState] = useState('loading')
  const [governorates, setGovernorates] = useState([])
  const [catalog, setCatalog] = useState({ towerGovernorates: [], airports: [] })
  const [selectedTowerGovernorate, setSelectedTowerGovernorate] = useState(null)
  const [selectedTowerCompany, setSelectedTowerCompany] = useState(null)
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [overviewOpen, setOverviewOpen] = useState(true)
  const [filterOpen, setFilterOpen] = useState(true)
  const [mapActions, setMapActions] = useState(null)
  const [viewMode, setViewMode] = useState('2d')

  const handleSearch = (event) => {
    const value = event.target.value
    setSearch(value)
    mapActions?.search(value)
  }

  const handleSuggestion = (suggestion) => {
    setSearch(suggestion.label)
    setSearchSuggestions([])
    mapActions?.selectSearchResult(suggestion)
  }

  const handleGovernorate = (event) => {
    const value = event.target.value
    setGovernorate(value)
    mapActions?.filterGovernorate(value)
  }

  const toggleViewMode = () => {
    setMapActions(null)
    setViewMode((value) => value === '2d' ? '3d' : '2d')
  }

  const handleTowerGovernorate = async (item) => {
    if (selectedTowerGovernorate?.value === item.value) {
      setSelectedTowerGovernorate(null)
      setSelectedTowerCompany(null)
      return
    }
    setSelectedTowerGovernorate(item)
    setSelectedTowerCompany(null)
  }

  useEffect(() => {
    mapActions?.filterStatus(towerStatus)
    if (governorate) mapActions?.filterGovernorate(governorate)
    if (search) mapActions?.search(search)
  }, [mapActions, towerStatus, search, governorate])

  const cards = [
    { label: 'إجمالي الأبراج', count: stats.towers, icon: RadioTower, tone: 'amber', foot: 'من طبقة الأبراج' },
    { label: 'أبراج مصرح بها', count: stats.approved, icon: ShieldCheck, tone: 'green', foot: 'مطابقة للاشتراطات' },
    { label: 'أبراج مرفوضة', count: stats.rejected, icon: ShieldX, tone: 'red', foot: 'تتطلب مراجعة' },
    { label: 'المطارات المشمولة', count: stats.airports, icon: Airplay, tone: 'amber', foot: 'من طبقة المطارات' },
  ]

  return (
    <main className="app-shell immersive-layout" dir="rtl">
      <header className="topbar">
        <div className="identity identity-right">
          <div className="crest"><Crosshair size={24} strokeWidth={1.5} /></div>
          <div><span className="identity-kicker">مكتب إعداد الدولة</span><strong>شعبة الملاحة الجوية</strong></div>
        </div>
        <div className="title-block">
          <div className="eyebrow"><span className="eyebrow-line" /> منظومة المراقبة المكانية <span className="eyebrow-line" /></div>
          <h1>منظومة الرقابة المكانية وارتفاعات أبراج الاتصالات</h1>
          <p>قطاع المطارات <span>•</span> جمهورية مصر العربية</p>
        </div>
        <div className="identity identity-left">
          <div className="secure-chip"><span className="live-dot" /> نظام مباشر</div>
          <div className="crest crest-muted"><Signal size={21} strokeWidth={1.5} /></div>
        </div>
      </header>

      <section className="command-row">
        <div className="command-label"><span className="command-mark"><Activity size={16} /></span><div><b>لوحة العمليات</b><small>متابعة المجال الجوي</small></div></div>
        <div className="command-meta"><span className={`connection ${serviceState}`}><i />{serviceState === 'ready' ? 'متصل بقاعدة البيانات' : serviceState === 'error' ? 'تعذر الاتصال بالخدمة' : 'جارٍ الاتصال بالخدمة'}</span><span className="meta-divider" /><span><Clock3 size={14} /> تحديث مباشر</span><button className="icon-button" aria-label="الإشعارات"><Bell size={17} /><i /></button></div>
      </section>

      <section className={`overview-grid ${overviewOpen ? '' : 'overview-panel-collapsed'} ${filterOpen ? '' : 'filter-panel-collapsed'}`}>
        <div className={`overview-left floating-panel ${overviewOpen ? '' : 'collapsed'}`}>
          <button className="panel-toggle overview-toggle" type="button" aria-label={overviewOpen ? 'طي لوحة المؤشرات' : 'فتح لوحة المؤشرات'} aria-expanded={overviewOpen} onClick={() => setOverviewOpen((value) => !value)}><span className="panel-toggle-label">لوحة المؤشرات</span>{overviewOpen ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}</button>
          <div className="metrics-grid">
            {cards.map(({ label, count, icon: Icon, tone, foot }, index) => <article className={`metric-card ${tone}`} key={label} style={{ animationDelay: `${index * 70}ms` }}>
              <div className="metric-top"><span>{label}</span><span className="metric-icon"><Icon size={18} strokeWidth={1.8} /></span></div>
              <div className="metric-value">{formatCount(count)}<small>عنصر</small></div>
              <div className="metric-foot"><span className="foot-dot" />{foot}<span className="metric-footline" /></div>
            </article>)}
          </div>
          <div className="directory-grid">
            <article className="directory-card tower-summary-card"><div className="directory-title"><RadioTower size={15} /><b>الأبراج حسب المحافظة</b><small>{catalog.towerGovernorates.length.toLocaleString('ar-EG')} محافظة</small></div>
              {selectedTowerCompany ? <div className="directory-subtitle"><button onClick={() => setSelectedTowerCompany(null)}>رجوع إلى الشركات</button><b>{selectedTowerCompany.label}</b></div> : selectedTowerGovernorate ? <div className="directory-subtitle"><button onClick={() => { setSelectedTowerGovernorate(null); setSelectedTowerCompany(null) }}>رجوع إلى المحافظات</button><b>{selectedTowerGovernorate.label}</b></div> : null}
              <div className="directory-list">{selectedTowerCompany ? selectedTowerCompany.towers.length ? selectedTowerCompany.towers.map((tower) => <button className="tower-directory-item tower-code-item" key={tower.id ?? tower.code} onClick={() => mapActions?.focusFeature('tower', tower.id)}><span>{tower.codeLabel || tower.code}</span><small>{tower.name || 'برج اتصالات'}</small><i>⌖</i></button>) : <span className="directory-empty">لا توجد أكواد مسجلة لهذه الشركة</span> : selectedTowerGovernorate ? selectedTowerGovernorate.companies.length ? selectedTowerGovernorate.companies.map((company) => <button className="tower-directory-item" key={company.value} onClick={() => { setSelectedTowerCompany(company); mapActions?.focusTowerGroup(company.value, selectedTowerGovernorate.value) }}><span>{company.label}</span><small>{formatCount(company.count)} برج · رمز {company.value}</small><i>›</i></button>) : <span className="directory-empty">لا توجد شركات مسجلة لهذه المحافظة</span> : catalog.towerGovernorates.length ? catalog.towerGovernorates.map((item) => <button className="tower-directory-item" key={item.value} onClick={() => handleTowerGovernorate(item)}><span>{item.label}</span><small>{formatCount(item.count)} برج · رمز {item.value}</small><i>›</i></button>) : <span className="directory-empty">جارٍ تحميل المحافظات</span>}</div>
            </article>
            <article className="directory-card"><div className="directory-title"><Airplay size={15} /><b>أسماء المطارات</b><small>{catalog.airports.length.toLocaleString('ar-EG')}</small></div><div className="directory-list">{catalog.airports.length ? catalog.airports.map((airport) => <button key={airport.id ?? airport.name} onClick={() => mapActions?.focusFeature('airport', airport.id)}>{airport.name}<span>⌖</span></button>) : <span className="directory-empty">جارٍ تحميل المطارات</span>}</div></article>
          </div>
        </div>
        <div className={`filter-panel floating-panel ${filterOpen ? '' : 'collapsed'}`}>
          <button className="panel-toggle filter-toggle" type="button" aria-label={filterOpen ? 'طي لوحة البحث' : 'فتح لوحة البحث'} aria-expanded={filterOpen} onClick={() => setFilterOpen((value) => !value)}><span className="panel-toggle-label">البحث والتصفية</span>{filterOpen ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}</button>
          <div className="panel-heading"><span className="heading-icon"><SlidersHorizontal size={17} /></span><div><b>البحث والتصفية</b><small>ابحث عن برج أو مطار</small></div><span className="panel-count">{formatCount(stats.towers)} برج</span></div>
          <div className="tower-filter-group"><div className="search-box"><label className="search-field"><Search size={17} /><input value={search} onChange={handleSearch} placeholder="ابحث عن برج أو مطار أو كود" /><kbd>⌕</kbd></label>{searchSuggestions.length ? <div className="search-suggestions" role="listbox">{searchSuggestions.map((suggestion) => <button key={`${suggestion.type}-${suggestion.id}`} type="button" role="option" onClick={() => handleSuggestion(suggestion)}><span className={`suggestion-icon ${suggestion.type}`}>{suggestion.type === 'airport' ? <Airplay size={15} /> : <RadioTower size={15} />}</span><span className="suggestion-copy"><b>{suggestion.label}</b><small>{suggestion.meta}</small></span><span className="suggestion-arrow">⌖</span></button>)}</div> : null}</div><div className="classification-filter" aria-label="تصفية الأبراج حسب التصنيف"><span>تصنيف الأبراج</span><div className="classification-options"><button className={towerStatus === 'all' ? 'selected' : ''} onClick={() => setTowerStatus('all')}>الكل <b>{formatCount(stats.towers)}</b></button><button className={`approved ${towerStatus === 'approved' ? 'selected' : ''}`} onClick={() => setTowerStatus('approved')}>تم التصريح <b>{formatCount(stats.approved)}</b></button><button className={`rejected ${towerStatus === 'rejected' ? 'selected' : ''}`} onClick={() => setTowerStatus('rejected')}>مرفوض <b>{formatCount(stats.rejected)}</b></button></div></div></div>
          <label className="select-field"><MapPinned size={17} /><select value={governorate} onChange={handleGovernorate}><option value="">جميع المحافظات</option>{governorates.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select><ChevronDown size={15} /></label>
        </div>
      </section>

      <section className="map-section">
        <div className="map-heading">
          <div className="map-heading-title"><div className="map-icon"><MapPinned size={19} /></div><div><h2>الخريطة التشغيلية</h2><p>مراقبة الأبراج ومناطق القيود حول المطارات</p></div></div>
          <div className="map-heading-actions"><span className="map-status"><i /> بث مكاني نشط</span><button className="map-action" onClick={() => mapActions?.home()}><Crosshair size={15} /> نطاق مصر</button></div>
        </div>
        <div className="map-frame">
          <Suspense fallback={<div className="map-loading"><span className="radar-spinner" />جارٍ تجهيز الخريطة التشغيلية</div>}><ArcGISMap viewMode={viewMode} onStats={setStats} onGovernorates={setGovernorates} onCatalog={setCatalog} onSearchResults={setSearchSuggestions} onServiceState={setServiceState} onReady={setMapActions} visibility={mapTools} /></Suspense>
          {serviceState === 'loading' ? <div className="map-transition" aria-live="polite"><span className="radar-spinner" />جارٍ تجهيز {viewMode === '3d' ? 'المشهد ثلاثي الأبعاد' : 'الخريطة التشغيلية'}</div> : null}
          <div className="map-side-tools"><button title="إظهار المحافظات" className={mapTools.government ? 'active' : ''} onClick={() => setMapTools((v) => ({ ...v, government: !v.government }))}><MapPinned size={17} /><span>المحافظات</span></button><button title="إظهار المطارات" className={mapTools.airport ? 'active' : ''} onClick={() => setMapTools((v) => ({ ...v, airport: !v.airport }))}><Airplay size={17} /><span>المطارات</span></button><button title="إظهار الأبراج" className={mapTools.towers ? 'active' : ''} onClick={() => setMapTools((v) => ({ ...v, towers: !v.towers }))}><RadioTower size={17} /><span>الأبراج</span></button><button title="إظهار نطاقات الحماية" className={mapTools.rings ? 'active' : ''} onClick={() => setMapTools((v) => ({ ...v, rings: !v.rings }))}><Layers3 size={17} /><span>نطاقات الحماية</span></button></div>
          <div className="map-coordinates">30°02′N &nbsp; 31°14′E <span>WGS 84</span></div>
        </div>
        <div className="map-footer"><span><Database size={14} /> مصدر البيانات: ArcGIS FeatureServer</span><span>آخر مزامنة: مباشر <i className="live-dot" /></span><a href="https://www.esri.com/" target="_blank" rel="noreferrer"><CircleHelp size={14} /> حول الخريطة</a></div>
      </section>

      <button className={`view-mode-switch ${viewMode === '3d' ? 'scene-active' : ''}`} type="button" onClick={toggleViewMode} aria-label={viewMode === '2d' ? 'فتح المشهد ثلاثي الأبعاد' : 'العودة إلى الخريطة ثنائية الأبعاد'}>
        <span className="view-mode-switch-icon">{viewMode === '2d' ? <Globe2 size={19} /> : <MapIcon size={19} />}</span>
        <span className="view-mode-switch-copy"><b>{viewMode === '2d' ? 'المشهد ثلاثي الأبعاد' : 'الخريطة ثنائية الأبعاد'}</b><small>{viewMode === '2d' ? 'Web Scene · عرض مجسم' : 'Satellite · عرض علوي'}</small></span>
        <span className="view-mode-switch-badge">{viewMode === '2d' ? '3D' : '2D'}</span>
      </button>

      <footer className="app-footer"><span>مكتب إعداد الدولة <i>•</i> شعبة الملاحة الجوية</span><span>نظام الرقابة المكانية <b>v1.0</b></span><span>للاستخدام الرسمي</span></footer>
    </main>
  )
}
