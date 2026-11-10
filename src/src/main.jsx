import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-700.css'
import '@fontsource/poppins/latin-500.css'
import '@fontsource/poppins/latin-600.css'
import { figmaAssets, iconDimensions } from './assets'
import './styles.css'

const routes = [
  ['inicio', 'Início', 'House'], ['dashboard', 'Dashboard', 'ChartPie'],
  ['contas', 'Contas conectadas', 'Wallet1'], ['metas', 'Metas financeiras', 'Target'],
  ['categorias', 'Categorias', 'Tags'], ['transferencias', 'Transferências', 'ArrowRightLeft'],
  ['personalizar', 'Personalizar app', 'Palette'],
]
const mobileIcons = ['Inicio', 'Busca', 'Transferencias', 'Contas']
const desktopId = '55:21830'
const categoryId = '55:22790'
const mobileFrames = {
  dashboard: '3:8352', contas: '25:368', metas: '25:467', 'criar-meta': '32:616',
  conectar: '32:693', personalizar: '32:775', categorias: categoryId, esqueleto: '55:22940',
}
const colors = [['Azul', '#2563eb'], ['Verde', '#0f766e'], ['Violeta', '#7c3aed'], ['Rosa', '#be185d'], ['Âmbar', '#a16207']]
const modes = [['Claro', 'Sun'], ['Escuro', 'Moon'], ['Sistema', 'Smartphone']]
const banks = [['Inter', 'in'], ['Santander', 'S'], ['Bradesco', 'B'], ['Caixa', 'CX']]
const initialAccounts = [
  { name: 'Nubank', initials: 'Nu', until: '06/10/2027', sync: 'hoje, 09:32' },
  { name: 'Itaú', initials: 'I', until: '20/08/2027', sync: 'hoje, 09:30' },
  { name: 'Banco do Brasil', initials: 'BB', until: '05/10/2026', sync: '05/10, 18:45', expired: true },
]
const initialGoals = [
  { id: '1', name: 'Reserva de emergência', saved: 9000, target: 15000, date: '2026-12-31', icon: 'Shield' },
  { id: '2', name: 'Viagem de férias', saved: 3500, target: 7000, date: '2027-07-31', icon: 'Plane' },
  { id: '3', name: 'Notebook novo', saved: 2000, target: 5000, date: '2027-03-31', icon: 'Laptop' },
  { id: '4', name: 'Fundo para estudos', saved: 1500, target: 1500, date: '2026-10-31', icon: 'Laptop' },
]
const categoryIcons = [
  ['GraduationCap', 'Educação'], ['Utensils', 'Alimentação'], ['ShoppingBag', 'Compras'],
  ['House', 'Moradia'], ['Car', 'Transporte'], ['HeartPulse', 'Saúde'],
  ['Plane', 'Viagem'], ['Coffee', 'Café'], ['Briefcase', 'Trabalho'],
  ['Gift', 'Presentes'], ['Gamepad2', 'Lazer'], ['Dumbbell', 'Esporte'],
]
const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const money = (value) => currency.format(value).replace('\u00a0', ' ')
const compactMoney = (value) => money(value).replace('R$ ', 'R$')
const percent = (saved, target) => target > 0 ? Math.min(100, Math.round(100 * saved / target)) : 0
const dateLabel = (value) => value ? new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(value)) : 'Sem prazo'
const href = (page) => '#' + page

function useLocal(key, initialValue) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem('organize:' + key)) ?? initialValue }
    catch { return initialValue }
  })
  useEffect(() => {
    try { localStorage.setItem('organize:' + key, JSON.stringify(value)) }
    catch { /* Storage can be unavailable in private contexts. */ }
  }, [key, value])
  return [value, setValue]
}

function Asset({ name, frame = desktopId, tone, label = '', className = '' }) {
  const file = figmaAssets[frame + '/img' + name]
  if (!file) return null
  const url = import.meta.env.BASE_URL + 'figma/' + file
  const [width, height] = iconDimensions[file] ?? []
  if (tone) return <span aria-hidden="true" className={'asset asset-mask ' + className} style={{ '--icon-url': 'url(' + url + ')', '--icon-width': width + 'px', '--icon-height': height + 'px' }} />
  return <img className={'asset ' + className} src={url} alt={label} />
}

function Brand({ frame = desktopId }) {
  return <a className="brand" href={href('inicio')}><span className="brand-mark"><Asset frame={frame} name="Wallet" /></span>Organize</a>
}

function PhoneStatus({ frame }) {
  if (frame === '4:8896') return <div className="phone-status dashboard-status" aria-hidden="true">
    <Asset frame={frame} name="Time" /><Asset frame={frame} name="RightSide" />
  </div>
  if (frame === '3:8352') return <div className="phone-status dashboard-status" aria-hidden="true">
    <Asset frame={frame} name="Time" />
    <span className="status-icons"><Asset frame={frame} name="MobileSignal" /><Asset frame={frame} name="Wifi" />
      <span className="dashboard-battery"><Asset frame={frame} name="Rectangle" /><Asset frame={frame} name="Rectangle1" /><Asset frame={frame} name="CombinedShape" /></span>
    </span>
  </div>
  const custom = figmaAssets[frame + '/imgIosSignal']
  const standard = figmaAssets[frame + '/imgBateria']
  return <div className="phone-status" aria-hidden="true">
    {standard ? <Asset frame={frame} name="Horario" /> : <span>9:41</span>}
    <span className="status-icons">
      {custom ? <Asset frame={frame} name="IosSignal" /> : <span className="signal"><i /><i /><i /><i /></span>}
      <Asset frame={custom || standard ? frame : '25:368'} name={custom ? 'IosWifiSignal' : 'WiFi'} />
      <Asset frame={custom || standard ? frame : '25:368'} name={custom ? 'IosBatteryFull' : 'Bateria'} />
    </span>
  </div>
}

function Sidebar({ page }) {
  const active = { 'criar-meta': 'metas', conectar: 'contas', esqueleto: 'inicio', busca: 'dashboard' }[page] ?? page
  return <aside className="sidebar">
    <Brand />
    <nav aria-label="Menu principal">
      <div className="nav-caption">SUAS FINANÇAS</div>
      {routes.map(([id, title, icon]) => <a key={id} className={'nav-item ' + (active === id ? 'active' : '')} href={href(id)} aria-current={active === id ? 'page' : undefined}><Asset name={icon} tone />{title}</a>)}
    </nav>
    <div className="security-tip"><Asset name="ShieldCheck" tone /><strong>Seu dinheiro, seu controle</strong><p>Suas informações protegidas com segurança.</p></div>
  </aside>
}

function Header({ page }) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(false)
  const frame = mobileFrames[page] ?? '25:368'
  const avatarName = page === 'dashboard' ? 'Image2' : 'Perfil'
  return <>
    <PhoneStatus frame={frame} />
    <header className={'topbar topbar-' + page}>
      <span className="desktop-only muted">Meu espaço financeiro</span>
      <div className="user-actions">
        <button className="icon-button notification desktop-only" aria-label="Notificações" aria-expanded={notifications} onClick={() => { setNotifications(!notifications); setOpen(false) }}><Asset name="Bell" /></button>
        <div className="desktop-only header-divider" />
        <Asset name="FotoDePerfil" className="desktop-only avatar" />
        <Asset frame={frame} name={avatarName} className="mobile-only avatar" />
        <div className="user-name"><small className={page === 'dashboard' ? 'desktop-only' : ''}>Bem vinda</small><strong>Lauanda</strong></div>
        <button className="icon-button profile-menu" aria-label="Abrir menu" aria-expanded={open} onClick={() => { setOpen(!open); setNotifications(false) }}>
          <Asset name="ChevronDown" className="desktop-only" />
          <Asset frame={frame} name={page === 'dashboard' ? 'IconMenu' : 'Menu'} className="mobile-only" />
        </button>
      </div>
      {notifications && <div className="dropdown" role="status">Você está em dia com suas notificações.</div>}
      {open && <nav className="dropdown" aria-label="Menu da conta">
        {routes.map(([id, title]) => <a key={id} href={href(id)} onClick={() => setOpen(false)}>{title}</a>)}
        <a href={href('boas-vindas')} onClick={() => setOpen(false)}>Primeiro acesso</a>
      </nav>}
    </header>
  </>
}

function BottomNav({ page }) {
  const items = [['inicio', 'Início'], ['busca', 'Busca'], ['transferencias', 'Transferências'], ['contas', 'Contas']]
  const frame = mobileFrames[page] ?? '25:368'
  const fallbackIcons = ['Home', 'Search', 'ArrowRightLeft', 'Wallet']
  const hasNamedIcons = !!figmaAssets[frame + '/imgInicio']
  return <nav className={'bottom-nav bottom-' + page} aria-label="Navegação inferior">
    <div>{items.map(([id, label], index) => {
      const active = id === page || (id === 'contas' && page === 'conectar') || (id === 'inicio' && !items.some(([key]) => key === page) && page !== 'conectar')
      const icon = hasNamedIcons ? mobileIcons[index] : index === 0 && frame === categoryId ? 'House1' : index === 0 && frame === '55:22940' ? 'House' : fallbackIcons[index]
      const source = figmaAssets[frame + '/img' + icon] ? frame : '3:8352'
      return <a key={id} href={href(id)} aria-label={label} aria-current={active ? 'page' : undefined}><Asset frame={source} name={icon} tone /><span>{label}</span></a>
    })}</div>
    <span className="home-indicator" aria-hidden="true" />
  </nav>
}

function Title({ title, subtitle, children }) {
  return <div className="page-title"><div><h1>{title}</h1><p>{subtitle}</p></div>{children}</div>
}

function Action({ to, children, className = '', secondary = false, ...props }) {
  const classes = 'button ' + (secondary ? 'secondary ' : 'primary ') + className
  return to ? <a href={href(to)} className={classes} {...props}>{children}</a> :
    <button type="button" className={classes} {...props}>{children}</button>
}

function Tabs({ values, selected, onChange, label }) {
  return <div className="pills" role="group" aria-label={label}>{values.map((value) =>
    <button type="button" key={value} aria-pressed={selected === value} onClick={() => onChange(value)}>{value}</button>)}</div>
}

function Back({ to, children }) {
  return <a className="back" href={href(to)}><Asset frame={categoryId} name="ArrowLeft" tone />{children}</a>
}

function Progress({ value, label }) {
  return <div className="progress" role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}><span style={{ width: value + '%' }} /></div>
}

function SecureNote({ frame, title, children }) {
  return <aside className="secure-note"><Asset frame={frame} name="ShieldCheck" tone /><div>{title && <strong>{title}</strong>}<p>{children}</p></div></aside>
}

function Dashboard({ categories }) {
  const [period, setPeriod] = useState('Semana')
  const [type, setType] = useState('Despesas')
  const total = (type === 'Despesas' ? 5678.9 : 55678.9) * { Semana: 1, Mês: 4, Ano: 52 }[period]
  const filter = <Tabs values={['Semana', 'Mês', 'Ano']} selected={period} onChange={setPeriod} label="Período do dashboard" />
  return <>
    <div className="desktop-only"><Title title="Dashboard" subtitle="Uma visão clara das suas despesas.">
      <Action to="categorias"><Asset name="Plus" />Criar categoria</Action>
    </Title></div>
    <div className="dashboard-filters desktop-only">{filter}<label className="select-wrap">
      <select aria-label="Tipo de movimentação" value={type} onChange={(event) => setType(event.target.value)}><option>Despesas</option><option>Entradas</option></select><Asset name="ChevronDown" />
    </label></div>
    <section className="panel chart-card" aria-labelledby="chart-title">
      <div className="chart-heading">
        <div><h2 id="chart-title">{type} por categoria</h2><p className="desktop-only muted">Distribuição das suas {type.toLowerCase()}</p></div>
        <div className="chart-total"><span className="muted">Total</span><strong>{compactMoney(total)}</strong></div>
      </div>
      <div className="chart-body">
        <div className="pie-slot">
          <Asset name="GraficoDePizza" className="desktop-only pie" label="Gráfico de pizza com quatro fatias" />
          <Asset frame="3:8352" name="GraficoDePizza" className="mobile-only pie" label="Gráfico de pizza com quatro fatias" />
        </div>
        <div className="chart-legend">
          <h3 className="desktop-only">CATEGORIAS</h3>
          {Array.from({ length: 4 }, (_, index) => <div className="legend-row" key={index}>
            <Asset name="Marcador" className="desktop-only" /><Asset frame="3:8352" name="Ellipse" className="mobile-only" />
            <strong>{type === 'Despesas' ? 'Alimentação' : 'Receitas'}</strong><span className="muted">40% · {compactMoney(total * 0.4)}</span>
          </div>)}
        </div>
      </div>
      <div className="mobile-only chart-mobile-filters">{filter}</div>
    </section>
    {categories.length > 0 && <section className="category-saved" aria-label="Categorias criadas">
      {categories.map(({ name, type, icon, color }) => <span key={type + ':' + name} title={type} style={{ color: colors[color][1] }}><Asset frame={categoryId} name={icon} tone />{name}</span>)}
    </section>}
    <aside className="chart-note desktop-only"><Asset name="Tags1" /><div><strong>Organize do seu jeito</strong><p className="muted">Crie categorias para identificar melhor suas receitas e despesas.</p></div><Action to="categorias" secondary>Nova categoria</Action></aside>
  </>
}

const activities = Array.from({ length: 8 }, (_, index) => ({
  id: index, name: 'Starbucks Coffee', category: 'Alimentação', value: 32.56,
  date: '0' + (8 - index) + '/10/2026',
}))

function Activities({ results = activities }) {
  return <section className="panel activities">
    <header><h2>Atividades Recentes</h2><a className="desktop-only" href={href('busca')}>Ver atividades</a></header>
    <div className="activity-columns desktop-only"><span>Movimentação</span><span>Categoria</span><span>Data</span><span>Valor</span></div>
    {results.length ? results.map((item) => <div className="activity-row" key={item.id}>
      <div className="activity-name"><span className="merchant"><Asset frame={categoryId} name="Coffee" tone /></span><div><strong>{item.name}</strong><small className="mobile-only muted">{item.category}</small></div></div>
      <span className="desktop-only muted">{item.category}</span><span className="desktop-only muted">{item.date}</span>
      <strong className="negative">-{compactMoney(item.value)}</strong>
    </div>) : <p className="empty">Nenhuma movimentação encontrada.</p>}
    <footer className="desktop-only muted">{results.length} movimentações</footer>
  </section>
}

function Home() {
  const [visible, setVisible] = useState(true)
  return <>
    <div className="desktop-only"><Title title="Início" subtitle="Acompanhe suas finanças em um só lugar." /></div>
    <div className="balances">
      {[['Saldo Atual', 45678.9, 'Wallet1'], ['Entradas', 55678.9, 'ArrowDownLeft', '+35% mês'], ['Saídas', 5678.9, 'ArrowUpRight', '+5% mês']].map(([label, amount, icon, variation], index) =>
        <section className="panel balance" key={label}>
          <div><h2>{label}</h2>{index === 0 ? <button className="icon-button visibility" type="button" aria-label={visible ? 'Ocultar valores' : 'Mostrar valores'} aria-pressed={!visible} onClick={() => setVisible(!visible)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M2 12s3.6-5 10-5 10 5 10 5-3.6 5-10 5-10-5-10-5Z"/><circle cx="12" cy="12" r="2"/></svg></button> : <Asset frame={categoryId} name={icon} className="desktop-only" tone />}</div>
          <strong>{visible ? compactMoney(amount) : 'R$ ••••'}</strong>
          {variation && <small className="muted">{variation}</small>}
        </section>)}
    </div>
    <div className="home-actions">
      <div className="pills"><a href={href('dashboard')} className="selected">Dashboard</a><a href={href('metas')}>Metas</a></div>
      <Action to="conectar" className="desktop-only"><Asset name="Plus" />Conectar instituição</Action>
    </div>
    <Activities />
  </>
}

function SearchPage() {
  const [query, setQuery] = useState('')
  return <><Title title="Busca" subtitle="Encontre suas movimentações." />
    <label className="search-box"><Asset frame="32:693" name="Search" tone /><input type="search" placeholder="Buscar movimentação" aria-label="Buscar movimentação" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
    <Activities results={activities.filter((item) => (item.name + ' ' + item.category + ' ' + item.date).toLowerCase().includes(query.trim().toLowerCase()))} />
  </>
}


function Accounts({ accounts, openDialog }) {
  return <>
    <Title title="Contas conectadas" subtitle="Suas instituições em um só lugar.">
      <Action to="conectar" className="desktop-only"><Asset name="Plus" />Conectar nova instituição</Action>
    </Title>
    <section className="account-list">
      <header><strong>Instituições vinculadas</strong><span className="muted">{accounts.length} {accounts.length === 1 ? 'instituição' : 'instituições'}</span></header>
      {accounts.map((bank) => <article className="panel account" key={bank.name}>
        <div className="bank-name"><span className="bank-mark">{bank.initials}</span><strong>{bank.name}</strong><span className={'badge ' + (bank.expired ? 'expired' : '')}>{bank.expired ? 'Expirado' : 'Autorizado'}</span></div>
        <div className="account-meta muted"><p>Consentimento {bank.expired ? 'expirou em' : 'até'} {bank.until}</p><p>Última sincronização: {bank.sync}</p></div>
        <button className="account-action" type="button" onClick={() => openDialog({ kind: 'account', bank })}>{bank.expired ? 'Renovar consentimento' : 'Gerenciar consentimento'}<Asset frame="25:368" name="ChevronRight" /></button>
      </article>)}
    </section>
    <Action to="conectar" className="mobile-only accounts-add"><Asset frame="25:368" name="Plus" />Conectar nova instituição</Action>
    <SecureNote frame="25:368" title={<span className="desktop-only">Você está no controle</span>}>Você autoriza o compartilhamento no seu banco e pode revogar o consentimento quando quiser.</SecureNote>
  </>
}

function Connect({ accounts, onConnect }) {
  const [bank, setBank] = useState(banks[0][0])
  const [query, setQuery] = useState('')
  const available = banks.filter(([name]) => !accounts.some((account) => account.name === name))
  const matching = available.filter(([name]) => name.toLowerCase().includes(query.trim().toLowerCase()))
  const selected = matching.find(([name]) => name === bank)
  return <>
    <div className="desktop-only"><Back to="contas">Contas conectadas</Back></div>
    <Title title="Conectar instituição" subtitle="Escolha o banco que deseja adicionar." />
    <div className="split-layout">
      <section className="form-panel bank-picker">
        <h2 className="desktop-only">Instituições disponíveis</h2>
        <label className="search-box"><Asset frame="32:693" name="Search" tone /><input type="search" placeholder="Buscar instituição" aria-label="Buscar instituição" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <div className="bank-options" role="group" aria-label="Instituições disponíveis">
          {matching.map(([name, initials]) => <button className="bank-option" type="button" key={name} aria-pressed={name === bank} onClick={() => setBank(name)}>
            <span className="bank-mark">{initials}</span><span>{name}</span><span className="radio">{name === bank && <Asset frame="32:693" name="Check" tone />}</span>
          </button>)}
          {!matching.length && <p className="empty">Nenhuma instituição disponível.</p>}
        </div>
      </section>
      <section className="form-panel bank-next">
        <SecureNote frame="32:693" title="Você está no controle">Compartilhe saldos e movimentações via Open Finance. Autorize no ambiente do banco. O Organize não pede senhas bancárias.</SecureNote>
        <Action disabled={!selected} onClick={() => onConnect(selected)}>{selected ? 'Continuar com ' + bank : 'Selecione uma instituição'}</Action>
      </section>
    </div>
  </>
}

function Goals({ goals, openDialog }) {
  const [done, setDone] = useState(false)
  const ongoing = goals.filter((goal) => goal.saved < goal.target)
  const completed = goals.filter((goal) => goal.saved >= goal.target)
  const visible = done ? completed : ongoing
  return <>
    <Title title="Metas financeiras" subtitle="Cada economia te aproxima de um objetivo.">
      <Action to="criar-meta" className="desktop-only"><Asset name="Plus" />Criar meta</Action>
    </Title>
    <Tabs values={['Em andamento (' + ongoing.length + ')', 'Concluídas (' + completed.length + ')']} selected={done ? 'Concluídas (' + completed.length + ')' : 'Em andamento (' + ongoing.length + ')'} onChange={(value) => setDone(value.startsWith('Concluídas'))} label="Situação das metas" />
    <section className="panel goal-summary">
      <span className="goal-symbol desktop-only"><Asset name="Target" tone /></span>
      <div><p>Total guardado nas metas</p><div><strong>{money(visible.reduce((sum, goal) => sum + goal.saved, 0))}</strong><span>de {money(visible.reduce((sum, goal) => sum + goal.target, 0))}</span></div></div>
    </section>
    <section className="goal-list" aria-label="Suas metas">
      <h2 className="desktop-only">Minhas metas</h2>
      {visible.length ? visible.map((goal) => <article className="panel goal-card" key={goal.id}>
        <button className="goal-head" type="button" onClick={() => openDialog({ kind: 'goal', goal })}>
          <Asset frame={goal.icon === 'Target' ? desktopId : '25:467'} name={goal.icon} tone /><span>{goal.name}</span><strong>{percent(goal.saved, goal.target)}%</strong><Asset frame="25:467" name="ChevronRight" tone />
        </button>
        <div className="goal-amount"><strong>{money(goal.saved)}</strong><span className="muted">de {money(goal.target)}</span></div>
        <Progress value={percent(goal.saved, goal.target)} label={'Progresso de ' + goal.name} />
        <div className="goal-caption muted"><span>{goal.date ? 'Até ' + dateLabel(goal.date) : 'Sem prazo'}</span><span className={done ? '' : 'negative'}>{done ? 'Meta alcançada' : 'Faltam ' + money(goal.target - goal.saved)}</span></div>
      </article>) : <p className="empty">Nenhuma meta nesta situação.</p>}
    </section>
    <Action to="criar-meta" className="mobile-only goal-add"><Asset frame="25:467" name="Plus" />Criar meta</Action>
  </>
}

function GoalForm({ onCreate }) {
  const [name, setName] = useState('Curso de especialização')
  const [target, setTarget] = useState('6.000,00')
  const [saved, setSaved] = useState('1.200,00')
  const [date, setDate] = useState('2027-10-31')
  const parseAmount = (amount) => {
    const value = amount.trim().replace(/^R\$\s*/, '')
    return /^\d+(?:\.\d{3})*(?:,\d{1,2})?$/.test(value) ? Number(value.replaceAll('.', '').replace(',', '.')) : NaN
  }
  const desired = parseAmount(target)
  const starting = saved.trim() ? parseAmount(saved) : 0
  const value = percent(starting, desired)
  const valid = name.trim() && Number.isFinite(desired) && Number.isFinite(starting) && desired > 0 && starting >= 0 && starting <= desired
  return <>
    <div className="desktop-only"><Back to="metas">Metas financeiras</Back></div>
    <Title title="Criar meta" subtitle="Dê um destino à sua próxima economia." />
    <form className="split-layout goal-form" onSubmit={(event) => {
      event.preventDefault()
      if (valid) onCreate({ id: crypto.getRandomValues(new Uint32Array(4)).join('-'), name: name.trim(), target: desired, saved: starting, date, icon: 'Target' })
    }}>
      <div className="form-panel field-grid">
        <h2 className="desktop-only">Dados da meta</h2>
        <label>Nome da meta<input required value={name} onChange={(event) => setName(event.target.value)} maxLength={64} /></label>
        <label>Valor desejado<span className="currency-input"><span>R$</span><input required inputMode="decimal" value={target} onChange={(event) => setTarget(event.target.value)} /></span></label>
        <label>Valor já guardado<span className="currency-input"><span>R$</span><input inputMode="decimal" value={saved} onChange={(event) => setSaved(event.target.value)} /></span></label>
        <label>Prazo<span className="date-input"><span aria-hidden="true">{date ? new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(date)) : 'dd/mm/aaaa'}</span><input aria-label="Prazo" type="date" value={date} onChange={(event) => setDate(event.target.value)} /><Asset frame="32:616" name="Calendar" /></span></label>
      </div>
      <div className="form-panel goal-preview">
        <h2 className="desktop-only">Resumo da meta</h2>
        <section className="panel goal-progress">
          <div><strong>Seu ponto de partida</strong><strong>{Number.isFinite(value) ? value : 0}%</strong></div>
          <Progress value={Number.isFinite(value) ? value : 0} label="Progresso inicial da meta" />
          <p className="muted">{valid ? 'Faltam ' + money(desired - starting) + ' para chegar lá.' : 'Informe valores válidos para calcular seu progresso.'}</p>
        </section>
        <Action type="submit" disabled={!valid}>Criar meta</Action>
      </div>
    </form>
  </>
}

function Swatches({ value, onChange, title, frame }) {
  return <section className="swatches">
    <div className="section-heading"><h2>{title}</h2><span className="muted">{colors[value][0]}</span></div>
    <div className="swatch-options" role="group" aria-label={title}>
      {colors.map(([name, color], index) => <button type="button" key={name} aria-pressed={index === value} onClick={() => onChange(index)} style={{ '--swatch': color }}>
        <span><i>{index === value && <Asset frame={frame} name={frame === categoryId ? "Check1" : "Check"} tone />}</i></span>{name}
      </button>)}
    </div>
  </section>
}

function Settings({ preferences, onSave, notify }) {
  const [color, setColor] = useState(preferences.color)
  const [mode, setMode] = useState(preferences.mode)
  return <>
    <Title title="Personalizar app" subtitle="Deixe o Organize com a sua cara." />
    <div className="split-layout settings-layout">
      <div className="form-panel preferences">
        <Swatches value={color} onChange={setColor} title="Cor de destaque" frame="32:775" />
        <section className="appearance"><h2>Modo de aparência</h2><div role="group" aria-label="Modo de aparência">
          {modes.map(([name, icon], index) => <button type="button" key={name} aria-pressed={index === mode} onClick={() => setMode(index)}><Asset frame="32:775" name={icon} tone />{name}</button>)}
        </div></section>
        <Action className="desktop-only" onClick={() => onSave({ color, mode })}>Salvar preferências</Action>
      </div>
      <div className="form-panel settings-preview">
        <div className="section-heading"><h2>Prévia</h2><span className="muted">{colors[color][0]} · {modes[mode][0]}</span></div>
        <div className={'panel sample sample-mode-' + mode} style={{ '--sample-accent': colors[color][1] }}>
          <div className="sample-heading"><Asset frame="32:775" name="Target" /><strong>Meu próximo objetivo</strong><b>25%</b></div>
          <div className="sample-amount"><strong>R$ 500,00</strong><span className="muted">de R$ 2.000,00</span></div>
          <Progress value={25} label="Progresso da meta de exemplo" />
          <Action onClick={() => notify('Este botão faz parte da prévia.')}>Adicionar economia</Action>
        </div>
        <Action className="mobile-only" onClick={() => onSave({ color, mode })}>Salvar preferências</Action>
      </div>
    </div>
  </>
}

function CategoryForm({ onCreate }) {
  const [name, setName] = useState('Educação')
  const [type, setType] = useState('Despesa')
  const [icon, setIcon] = useState(0)
  const [color, setColor] = useState(0)
  return <>
    <div className="desktop-only"><Back to="dashboard">Dashboard</Back></div>
    <div className="category-title"><a className="icon-button mobile-only" aria-label="Voltar ao dashboard" href={href('dashboard')}><Asset frame={categoryId} name="ArrowLeft" tone /></a><Title title="Nova categoria" subtitle="Organize suas movimentações do seu jeito." /></div>
    <form className="split-layout category-form" onSubmit={(event) => {
      event.preventDefault()
      if (name.trim()) onCreate({ name: name.trim(), type, icon: categoryIcons[icon][0], color })
    }}>
      <div className="form-panel field-grid">
        <h2 className="desktop-only">Dados da categoria</h2>
        <label>Nome da categoria<input required maxLength={48} value={name} onChange={(event) => setName(event.target.value)} /></label>
        <section className="category-type"><h2>Tipo</h2><div role="group" aria-label="Tipo da categoria">
          {['Receita', 'Despesa'].map((label, index) => <button type="button" key={label} aria-pressed={label === type} onClick={() => setType(label)}><Asset frame={categoryId} name={index ? 'ArrowUpRight' : 'ArrowDownLeft'} tone />{label}{label === type && <Asset frame={categoryId} name="Check" tone />}</button>)}
        </div></section>
        <section><div className="section-heading"><h2>Ícone</h2><span className="muted">{categoryIcons[icon][1]}</span></div>
          <div className="category-icons" role="group" aria-label="Ícone da categoria">{categoryIcons.map(([symbol, label], index) =>
            <button type="button" key={symbol} aria-label={label} aria-pressed={icon === index} onClick={() => setIcon(index)}><Asset frame={categoryId} name={symbol} tone /></button>)}</div>
        </section>
        <Swatches value={color} onChange={setColor} title="Cor" frame={categoryId} />
      </div>
      <div className="form-panel category-preview">
        <h2>Prévia</h2>
        <div className="panel category-sample" style={{ '--category-color': colors[color][1] }}>
          <span><Asset frame={categoryId} name={icon === 0 ? "GraduationCap1" : categoryIcons[icon][0]} tone /></span><div><strong>{name.trim() || 'Sua categoria'}</strong><p className="muted">{type}</p></div>{color === 0 ? <Asset frame={categoryId} name="CorEscolhida" /> : <i />}
        </div>
        <div className="category-actions"><Action type="submit" disabled={!name.trim()}>Criar categoria</Action><Action to="dashboard" secondary>Cancelar</Action></div>
      </div>
    </form>
  </>
}


function Welcome({ compact }) {
  return <div className={compact ? "welcome welcome-compact" : "welcome"}>
    <PhoneStatus frame="25:368" />
    <header className="welcome-header"><Brand /><Action to="cadastro" secondary className="desktop-only">Criar uma conta</Action></header>
    <main className="welcome-body">
      <div className="welcome-art" aria-hidden="true">
        <div className="orbit orbit-outer" /><div className="orbit orbit-inner" />
        <span className="coin coin-yellow">R$</span><span className="coin coin-green">$</span><span className="coin coin-orange">R$</span><span className="coin coin-blue">$</span>
        <div className="orbit-logo"><Asset frame="55:21653" name="Wallet1" tone /></div>
      </div>
      <div className="welcome-copy">
        <p className="eyebrow">SEU DINHEIRO, COM CLAREZA.</p>
        <h1>Organize suas finanças pessoais como nunca</h1>
        <p className="desktop-only muted">Acompanhe suas contas, entenda seus gastos e dê o próximo passo em direção aos seus objetivos.</p>
        <Action to="cadastro">Vamos lá</Action>
        <div className="desktop-only welcome-safe"><Asset name="ShieldCheck" tone />Seus dados protegidos. Sempre.</div>
      </div>
    </main>
    <footer className="welcome-footer desktop-only"><span>© Organize</span><a href={href('cadastro')}>Privacidade e termos de serviço</a></footer>
    <div className="mobile-only auth-indicator"><span className="home-indicator" /></div>
  </div>
}

function Signup({ start, openDialog }) {
  return <div className="signup">
    <PhoneStatus frame="4:8896" />
    <aside className="signup-brand desktop-only">
      <Brand frame="55:21653" />
      <div><span className="signup-wallet"><Asset frame="55:21653" name="Wallet1" /></span><h1>Um novo começo para suas finanças.</h1><p className="muted">Acompanhe suas contas, entenda seus gastos e dê o próximo passo em direção aos seus objetivos.</p></div>
      <div className="welcome-safe"><Asset frame="55:21653" name="LockKeyhole" />Seus dados protegidos. Sempre.</div>
    </aside>
    <main className="signup-main">
      <div className="mobile-only signup-mobile-brand"><span className="brand-mark"><Asset frame="4:8896" name="Wallet" /></span>Organize</div>
      <form className="signup-form" onSubmit={(event) => { event.preventDefault(); start() }}>
        <h2>Criar uma conta</h2><p className="signup-description">Insira seu e-mail para se cadastrar neste aplicativo</p>
        <label className="signup-field"><span className="desktop-only">E-mail</span><span><input type="email" autoComplete="email" required aria-label="E-mail" placeholder="email@dominio.com" /><Asset frame="55:21653" name="Mail" className="desktop-only" /></span></label>
        <Action type="submit">Continuar</Action>
        <div className="or-divider muted">ou</div>
        <button type="button" className="social google" onClick={start}><Asset frame="55:21653" name="Google" className="desktop-only" /><Asset frame="4:8896" name="Logo" className="mobile-only" />Continuar com o Google</button>
        <button type="button" className="social apple" onClick={start}><span className="apple-logo"><Asset frame="55:21653" name="LogoApple" className="desktop-only" /><Asset frame="4:8896" name="Logo1" className="mobile-only" /></span>Continuar com a Apple</button>
        <p className="signup-legal muted">Ao clicar em continuar, você concorda com os nossos <button type="button" onClick={() => openDialog({ kind: 'terms' })}>Termos de Serviço</button> e com a <button type="button" onClick={() => openDialog({ kind: 'privacy' })}>Política de Privacidade</button></p>
      </form>
    </main>
    <div className="mobile-only auth-indicator"><span className="home-indicator" /></div>
  </div>
}

function Loading() {
  const frame = '55:22913'
  return <div className="loading-screen">
    <PhoneStatus frame={frame} /><header><Brand frame={frame} /></header>
    <main aria-live="polite">
      <div className="loading-symbol"><Asset frame={frame} name="Trilha" /><Asset frame={frame} name="TrechoAtivo" /><span><Asset frame={frame} name="Wallet1" /></span></div>
      <h1>Organizando tudo para você</h1><p className="muted">Carregando suas informações financeiras. Só um instante.</p>
      <div className="loading-safe"><Asset frame={frame} name="ShieldCheck" /><span>Suas informações estão protegidas.</span></div>
    </main>
    <div className="mobile-only auth-indicator"><span className="home-indicator" /></div>
  </div>
}

function Skeleton() {
  return <div className="skeleton" role="status" aria-label="Carregando suas informações">
    <div className="desktop-only skeleton-heading"><i /><i /></div>
    <div className="balances">{[0, 1, 2].map((key) => <div className="panel balance" key={key}><i /><i /><i /></div>)}</div>
    <div className="pills"><span className="selected">Dashboard</span><span>Metas</span></div>
    <section className="panel activities"><header><h2>Atividades Recentes</h2></header>
      {Array.from({ length: 8 }, (_, key) => <div className="skeleton-row" key={key}><i /><div><i /><i /></div><i /></div>)}
    </section>
  </div>
}

function Dialog({ dialog, close, updateAccount }) {
  const ref = React.useRef(null)
  useEffect(() => {
    const element = ref.current
    element.showModal()
    return () => element.close()
  }, [])
  const { kind, bank, goal } = dialog
  const title = { account: bank?.name, goal: goal?.name, terms: 'Termos de Serviço', privacy: 'Política de Privacidade' }[kind]
  return <dialog ref={ref} onCancel={close} onClick={(event) => { if (event.target === event.currentTarget) close() }} aria-labelledby="dialog-title">
    <div className="dialog-content"><h2 id="dialog-title">{title}</h2>
      {kind === 'account' && <p className="muted">Consentimento {bank.expired ? 'expirado' : 'ativo até ' + bank.until}. As alterações nesta demonstração são guardadas no navegador.</p>}
      {kind === 'goal' && <><p className="muted">{money(goal.saved)} guardados de {money(goal.target)}.</p><Progress value={percent(goal.saved, goal.target)} label="Progresso da meta" /></>}
      {kind === 'terms' && <p className="muted">O Organize é uma demonstração de gestão financeira com dados de exemplo.</p>}
      {kind === 'privacy' && <p className="muted">Metas, categorias e preferências ficam neste navegador. O e-mail digitado não é enviado nem armazenado.</p>}
      <div className="dialog-actions">
        <Action secondary onClick={close}>Fechar</Action>
        {kind === 'account' && <Action onClick={() => updateAccount(bank)}>{bank.expired ? 'Renovar consentimento' : 'Revogar consentimento'}</Action>}
      </div>
    </div>
  </dialog>
}

const allPages = new Set([...routes.map(([id]) => id), 'boas-vindas', 'apresentacao', 'cadastro', 'criar-meta', 'conectar', 'busca', 'carregando', 'esqueleto'])
function readPage() {
  const id = window.location.hash.slice(1)
  return allPages.has(id) ? id : 'boas-vindas'
}

function App() {
  const [page, setPage] = useState(readPage)
  const [goals, setGoals] = useLocal('goals', initialGoals)
  const [accounts, setAccounts] = useLocal('accounts', initialAccounts)
  const [categories, setCategories] = useLocal('categories', [])
  const [preferences, setPreferences] = useLocal('preferences', { color: 0, mode: 0 })
  const [dialog, setDialog] = useState(null)
  const [message, setMessage] = useState('')
  const [onboarding, setOnboarding] = useState(false)
  const notify = (text) => setMessage({ text })
  const navigate = (next) => { window.location.hash = next }
  useEffect(() => {
    const changePage = () => { setPage(readPage()); setDialog(null); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', changePage)
    return () => window.removeEventListener('hashchange', changePage)
  }, [])
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => setMessage(''), 3500)
    return () => clearTimeout(timer)
  }, [message])
  useEffect(() => {
    if (!onboarding) return
    if (page === 'carregando' || page === 'esqueleto') {
      const timer = setTimeout(() => {
        navigate(page === 'carregando' ? 'esqueleto' : 'inicio')
        if (page === 'esqueleto') setOnboarding(false)
      }, page === 'carregando' ? 700 : 400)
      return () => clearTimeout(timer)
    }
    if (page !== 'cadastro') setOnboarding(false)
  }, [page, onboarding])

  function connect([name, initials]) {
    if (accounts.some((bank) => bank.name === name)) return
    const nextYear = new Date()
    nextYear.setFullYear(nextYear.getFullYear() + 1)
    setAccounts([...accounts, { name, initials, until: nextYear.toLocaleDateString('pt-BR'), sync: 'agora' }])
    navigate('contas')
    notify(name + ' adicionado em modo de demonstração.')
  }
  function updateAccount(bank) {
    setAccounts(accounts.map((item) => item.name !== bank.name ? item : {
      ...item, expired: !bank.expired, until: bank.expired ? new Date(Date.now() + 365 * 86400000).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR'),
    }))
    setDialog(null)
    notify(bank.expired ? 'Consentimento de demonstração renovado.' : 'Consentimento de demonstração revogado.')
  }

  const views = {
    inicio: <Home />, dashboard: <Dashboard categories={categories} />, busca: <SearchPage />,
    contas: <Accounts accounts={accounts} openDialog={setDialog} />, conectar: <Connect accounts={accounts} onConnect={connect} />,
    metas: <Goals goals={goals} openDialog={setDialog} />,
    'criar-meta': <GoalForm onCreate={(goal) => { setGoals([...goals, goal]); navigate('metas'); notify('Meta criada.') }} />,
    personalizar: <Settings preferences={preferences} onSave={(next) => { setPreferences(next); notify('Preferências salvas.') }} notify={notify} />,
    categorias: <CategoryForm onCreate={(category) => {
      if (categories.some((item) => item.name.toLowerCase() === category.name.toLowerCase() && item.type === category.type)) {
        notify('Já existe uma categoria com esse nome e tipo.'); return
      }
      setCategories([...categories, category]); navigate('dashboard'); notify('Categoria criada.')
    }} />,
    transferencias: <><Title title="Transferências" subtitle="Acompanhe suas transferências em um só lugar." /><p className="panel empty">Nenhuma transferência nesta demonstração.</p></>,
    esqueleto: <Skeleton />,
  }

  return <div className={'app theme-' + preferences.mode} style={{ '--accent': colors[preferences.color][1] }}>
    {page === 'boas-vindas' || page === 'apresentacao' ? <Welcome compact={page === 'apresentacao'} /> : page === 'cadastro' ?
      <Signup openDialog={setDialog} start={() => { setOnboarding(true); navigate('carregando') }} /> :
      page === 'carregando' ? <Loading /> :
      <div className="app-shell">
        <Sidebar page={page} />
        <div className="workspace">
          <Header key={"header-" + page} page={page} />
          <main key={"main-" + page} className={'content page-' + page}>{views[page]}</main>
          <BottomNav page={page} />
        </div>
      </div>}
    {dialog && <Dialog dialog={dialog} close={() => setDialog(null)} updateAccount={updateAccount} />}
    {message && <div className="toast" role="status">{message.text}</div>}
  </div>
}

createRoot(document.getElementById('root')).render(<App />)

