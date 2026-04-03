/**
 * 西凤·终端通 — 核心交互逻辑
 * App.js v1.0
 */

/* ========================================
   全局状态
   ======================================== */
const AppState = {
  currentUser: null,   // 'manager' | 'sales'
  currentPage: 'page-login',
  prevPage: null,
  currentTerminalId: null,
  fenceMode: false,
  visitedCount: 0,
  stockCount: 2
};

/* ========================================
   数据 Mock
   ======================================== */
const DATA = {
  // 分公司数据
  branches: [
    { id: 'b001', name: '宝鸡分公司', terminals: 628, active: 512, risk: 8, turnover: '72%', growth: '+5.2%', trend: 'up', dealer: 14 },
    { id: 'b002', name: '西安分公司', terminals: 1024, active: 834, risk: 12, turnover: '68.5%', growth: '+2.1%', trend: 'up', dealer: 22 },
    { id: 'b003', name: '咸阳分公司', terminals: 487, active: 381, risk: 7, turnover: '65.3%', growth: '-1.2%', trend: 'down', dealer: 11 },
    { id: 'b004', name: '渭南分公司', terminals: 378, active: 289, risk: 6, turnover: '61.8%', growth: '-0.5%', trend: 'down', dealer: 9 },
    { id: 'b005', name: '榆林分公司', terminals: 330, active: 214, risk: 4, turnover: '58.2%', growth: '+3.8%', trend: 'up', dealer: 8 },
  ],

  // 终端数据
  terminals: {
    t001: {
      id: 't001', icon: '🏪', name: '鑫源烟酒超市·西关店',
      addr: '宝鸡市凤翔区西关北路88号', type: '烟酒超市', level: 'A级',
      credit: '★★★★', owner: '王建国', phone: '138****8888',
      stock: 2, sales: 18, visit: 0, scan: '72%',
      peak: '3月上旬', replenish: '立即补货', turnover: '断货风险',
      risk: { level: 'high', title: '库存告急预警', desc: '已18天未补货，当前库存仅剩2件，建议立即联系补货' },
      dealer: '凤翔鸿达商贸', branch: '宝鸡分公司', sales_rep: '李明',
    },
    t002: {
      id: 't002', icon: '🍽️', name: '福源大酒店',
      addr: '宝鸡市渭滨区宝福路155号', type: '餐饮酒店', level: 'B级',
      credit: '★★★', owner: '陈老板', phone: '139****6666',
      stock: 24, sales: 31, visit: 2, scan: '45%',
      peak: '节假日前', replenish: '下月初', turnover: '23天',
      risk: { level: 'warning', title: '业绩持续下滑', desc: '近3个月销量同比下滑32%，需重点关注维护策略' },
      dealer: '渭滨宏达酒业', branch: '宝鸡分公司', sales_rep: '赵强',
    },
    t003: {
      id: 't003', icon: '🏬', name: '盛世名品名酒行',
      addr: '西安市碑林区南院门商业街12号', type: '名品酒行', level: 'A级',
      credit: '★★★★★', owner: '刘总', phone: '136****9999',
      stock: 86, sales: 67, visit: 0, scan: '88%',
      peak: '月底', replenish: '月中', turnover: '38天',
      risk: { level: 'info', title: '业务员长期未拜访', desc: '已超30天无拜访记录，客情维护存在风险' },
      dealer: '碑林鑫利酒业', branch: '西安分公司', sales_rep: '张磊',
    },
    t004: {
      id: 't004', icon: '🏬', name: '丰收商贸超市·凤翔总店',
      addr: '宝鸡市凤翔区柳林镇工业路1号', type: '综合超市', level: 'A级',
      credit: '★★★★', owner: '孙经理', phone: '137****5555',
      stock: 48, sales: 56, visit: 4, scan: '65%',
      peak: '节前旺季', replenish: '按时补货', turnover: '21天',
      risk: null,
      dealer: '凤翔鸿达商贸', branch: '宝鸡分公司', sales_rep: '李明',
    },
    t005: {
      id: 't005', icon: '🍷', name: '渭滨名品行',
      addr: '宝鸡市渭滨区金陵大道58号', type: '名品酒行', level: 'S级',
      credit: '★★★★★', owner: '马老板', phone: '135****7777',
      stock: 120, sales: 98, visit: 5, scan: '82%',
      peak: '中秋/春节', replenish: '按需补货', turnover: '36天',
      risk: null,
      dealer: '渭滨宏达酒业', branch: '宝鸡分公司', sales_rep: '赵强',
    },
    t006: {
      id: 't006', icon: '🏪', name: '金台便民超市连锁',
      addr: '宝鸡市金台区龙山路200号', type: '连锁超市', level: 'B级',
      credit: '★★★', owner: '连锁运营', phone: '400-XXX-XXXX',
      stock: 16, sales: 22, visit: 3, scan: '41%',
      peak: '月初', replenish: '月底', turnover: '18天',
      risk: { level: 'info', title: '扫码参与率偏低', desc: '消费者扫码率仅41%，低于行业均值68%，建议加强消费者互动推广' },
      dealer: '金台嘉华商贸', branch: '宝鸡分公司', sales_rep: '吴浩',
    },
    t007: {
      id: 't007', icon: '🍽️', name: '东门宴会厅',
      addr: '宝鸡市金台区东风路88号', type: '宴会酒店', level: 'A级',
      credit: '★★★★', owner: '张老板', phone: '138****4444',
      stock: 64, sales: 88, visit: 6, scan: '75%',
      peak: '婚宴旺季', replenish: '按时补货', turnover: '17天',
      risk: null,
      dealer: '金台嘉华商贸', branch: '宝鸡分公司', sales_rep: '吴浩',
    },
  },

  // 经销商数据
  dealers: [
    { id: 'd001', name: '凤翔鸿达商贸有限公司', owner: '王鸿达', terminals: 28, active: 24, stock: 1280, riskTerminals: 2, trend: 'up' },
    { id: 'd002', name: '渭滨宏达酒业经销商', owner: '陈宏大', terminals: 22, active: 20, stock: 960, riskTerminals: 1, trend: 'up' },
    { id: 'd003', name: '金台嘉华商贸', owner: '赵嘉华', terminals: 18, active: 14, stock: 740, riskTerminals: 2, trend: 'down' },
    { id: 'd004', name: '陈仓区明达贸易', owner: '李明达', terminals: 15, active: 11, stock: 520, riskTerminals: 1, trend: 'down' },
    { id: 'd005', name: '千阳县乡镇配送站', owner: '张站长', terminals: 12, active: 9, stock: 380, riskTerminals: 0, trend: 'up' },
    { id: 'd006', name: '麟游县综合商贸', owner: '胡老板', terminals: 8, active: 5, stock: 220, riskTerminals: 2, trend: 'down' },
  ],

  // 风险预警
  warnings: [
    { id: 'w001', terminal: '鑫源烟酒超市·西关店', type: '库存告急', level: 'high', desc: '已18天未补货，库存仅2件', time: '2小时前', branch: '宝鸡', tid: 't001' },
    { id: 'w002', terminal: '金台金星烟酒', type: '库存告急', level: 'high', desc: '连续3周未补货，预计今日断货', time: '4小时前', branch: '宝鸡', tid: 't006' },
    { id: 'w003', terminal: '福源大酒店', type: '业绩下滑', level: 'warning', desc: '本月动销同比下滑32%', time: '昨日', branch: '宝鸡', tid: 't002' },
    { id: 'w004', terminal: '盛世名品名酒行', type: '未拜访', level: 'info', desc: '业务员已30天未访店', time: '3天前', branch: '西安', tid: 't003' },
    { id: 'w005', terminal: '麟游大众超市', type: '库存告急', level: 'high', desc: '库存告急 + 业务员本月0拜访', time: '昨日', branch: '宝鸡', tid: null },
    { id: 'w006', terminal: '凤翔酒业批发部', type: '业绩下滑', level: 'warning', desc: '周转率降至38%，低于60%预警线', time: '昨日', branch: '宝鸡', tid: null },
    { id: 'w007', terminal: '西关路口便利店', type: '未补货', level: 'warning', desc: '预测补货期已过12天', time: '2天前', branch: '宝鸡', tid: null },
    { id: 'w008', terminal: '渭滨商业广场旗舰店', type: '未拜访', level: 'info', desc: '本月仅拜访1次，低于频次标准4次/月', time: '3天前', branch: '宝鸡', tid: 't005' },
  ],

  // 任务数据（管理者端）
  tasks: [
    { id: 'tk001', title: '鑫源西关店紧急补货', type: '🚚 紧急补货', terminal: '鑫源烟酒超市·西关店', assignee: '李明', deadline: '2026-03-24', status: 'pending', priority: 'high', desc: '请立即联系门店补货，库存仅余2件，48小时内完成' },
    { id: 'tk002', title: '凤翔片区陈列整改', type: '📸 陈列整改', terminal: '凤翔片区 8家门店', assignee: '李明', deadline: '2026-03-25', status: 'doing', priority: 'medium', desc: '春节后陈列混乱，请按标准重新整改并拍照存档' },
    { id: 'tk003', title: '福源大酒店客情跟进', type: '🤝 客情拜访', terminal: '福源大酒店', assignee: '赵强', deadline: '2026-03-23', status: 'doing', priority: 'high', desc: '业绩下滑严重，需与店主深度沟通，了解竞品动态' },
    { id: 'tk004', title: '西安片区月度盘点', type: '📊 库存盘点', terminal: '西安分公司全部门店', assignee: '张磊', deadline: '2026-03-31', status: 'pending', priority: 'medium', desc: '完成Q1季度终端库存全面盘点，数据录入系统' },
    { id: 'tk005', title: '盛世名品客情拜访', type: '🤝 客情拜访', terminal: '盛世名品名酒行', assignee: '张磊', deadline: '2026-03-22', status: 'done', priority: 'high', desc: '已完成，门店情况稳定，建立良好客情关系' },
  ],

  // 业务员任务
  salesTasks: [
    { id: 'st001', icon: '🚚', title: '鑫源西关店紧急补货', from: '张伟大区经理', time: '今天 09:15', urgent: true, desc: '请立即联系门店，配合经销商完成补货，务必今日处理' },
    { id: 'st002', icon: '📸', title: '陈列照片上传（凤翔片区）', from: '系统自动任务', time: '今天 08:00', urgent: false, desc: '请对管辖区域8家门店进行陈列拍照并上传系统' },
    { id: 'st003', icon: '📊', title: '月度库存盘点', from: '王芳片区经理', time: '3月20日', urgent: false, desc: 'Q1季度库存盘点，完成后录入系统' },
    { id: 'st004', icon: '🤝', title: '新终端开发 · 凤翔县城区', from: '张伟大区经理', time: '3月18日', urgent: false, desc: '在凤翔县城区开发2家新终端，录入门头照和基本信息' },
  ],

  // 业务员终端列表
  salesTerminals: [
    { name: '鑫源烟酒超市·西关店', type: '烟酒超市', stock: 2, lastVisit: '22天前', risk: 'high', tid: 't001' },
    { name: '福源大酒店', type: '餐饮酒店', stock: 24, lastVisit: '15天前', risk: 'warning', tid: 't002' },
    { name: '丰收商贸超市·凤翔总店', type: '综合超市', stock: 48, lastVisit: '3天前', risk: 'ok', tid: 't004' },
    { name: '凤翔朝阳超市', type: '连锁超市', stock: 32, lastVisit: '5天前', risk: 'ok', tid: null },
    { name: '西关南路烟酒行', type: '烟酒行', stock: 14, lastVisit: '8天前', risk: 'info', tid: null },
    { name: '城关农贸市场烟酒摊', type: '摊贩', stock: 6, lastVisit: '10天前', risk: 'warning', tid: null },
    { name: '凤翔酒业批发部', type: '批发', stock: 180, lastVisit: '6天前', risk: 'ok', tid: null },
  ],

  // 今日拜访路线
  visitRoute: [
    { name: '鑫源烟酒超市·西关店', addr: '西关北路88号', dist: '230m', type: '🏪', status: 'pending', urgent: true, tid: 't001' },
    { name: '城西便利烟酒', addr: '城西大道32号', dist: '580m', type: '🏪', status: 'pending', urgent: false, tid: null },
    { name: '北关粮油超市', addr: '北关路12号', dist: '1.2km', type: '🏬', status: 'pending', urgent: false, tid: null },
    { name: '福源大酒店', addr: '渭滨路155号', dist: '2.1km', type: '🍽️', status: 'pending', urgent: false, tid: 't002' },
    { name: '东风路便利店', addr: '东风路88号', dist: '2.8km', type: '🏪', status: 'pending', urgent: false, tid: null },
  ],
};

/* ========================================
   路由 & 页面切换
   ======================================== */
function goTo(pageId) {
  AppState.prevPage = AppState.currentPage;
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
    AppState.currentPage = pageId;
  }
  // 更新状态栏颜色
  updateStatusBar(pageId);
}

function goBack() {
  if (AppState.prevPage) {
    goTo(AppState.prevPage);
  } else {
    goTo(AppState.currentUser === 'manager' ? 'page-home' : 'page-sales-home');
  }
}

function switchTab(pageId, btn) {
  goTo(pageId);
  // 更新底部导航激活状态
  const parentNav = btn.closest('.bottom-nav');
  if (parentNav) {
    parentNav.querySelectorAll('.bottom-nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  initPageData(pageId);
}

function switchSalesTab(pageId, btn) {
  switchTab(pageId, btn);
}

function updateStatusBar(pageId) {
  const bar = document.getElementById('statusBar');
  if (!bar) return;
  // 登录页特殊处理
  if (pageId === 'page-login') {
    bar.style.background = 'linear-gradient(135deg, #8B1A1A, #C0392B)';
  } else {
    bar.style.background = '';
  }
}

/* ========================================
   登录逻辑
   ======================================== */
let loginType = 'manager';

function setLoginType(type) {
  loginType = type;
  document.querySelectorAll('.login-tab').forEach((t, i) => {
    t.classList.toggle('active', (i === 0 && type === 'manager') || (i === 1 && type === 'sales'));
  });
  document.getElementById('loginUser').value = type === 'manager' ? 'zhang.wei' : 'li.ming';
}

function doLogin() {
  AppState.currentUser = loginType;
  const targetPage = loginType === 'manager' ? 'page-home' : 'page-sales-home';
  goTo(targetPage);
  setTimeout(() => {
    initAllCharts();
    initPageData(targetPage);
    if (loginType === 'manager') {
      initBranchRankList();
      initWarningList();
      initTaskList();
    } else {
      initSalesTaskList();
      initVisitList();
      initSalesTerminalList();
    }
  }, 100);
}

/* ========================================
   终端详情
   ======================================== */
function goToTerminal(tid) {
  const t = DATA.terminals[tid];
  if (!t) return;
  AppState.currentTerminalId = tid;
  
  // 填充数据
  document.getElementById('shopPhoto').textContent = t.icon;
  document.getElementById('shopName').textContent = t.name;
  document.getElementById('shopAddr').textContent = '📍 ' + t.addr;
  
  // 标签
  const tagsEl = document.getElementById('shopTags');
  tagsEl.innerHTML = `
    <span class="shop-tag">${t.type}</span>
    <span class="shop-tag">${t.level}</span>
    <span class="shop-tag">信用${t.credit}</span>
  `;
  
  // 数值
  document.getElementById('shopStock').textContent = t.stock;
  document.getElementById('shopSales').textContent = t.sales;
  document.getElementById('shopVisit').textContent = t.visit + '次';
  document.getElementById('shopScan').textContent = t.scan;
  
  // 峰值
  document.getElementById('shopPeak').textContent = t.peak;
  document.getElementById('shopReplenish').textContent = t.replenish;
  document.getElementById('shopTurnover').textContent = t.turnover;
  
  // 风险
  const riskEl = document.getElementById('riskAlert');
  if (t.risk) {
    riskEl.style.display = 'block';
    document.getElementById('riskTitle').textContent = t.risk.title;
    document.getElementById('riskDesc').textContent = t.risk.desc;
    const bgMap = { high: 'linear-gradient(135deg,#FDF0EF,#FADBD8)', warning: 'linear-gradient(135deg,#FFFBF0,#FEF0C8)', info: 'linear-gradient(135deg,#F0F8FF,#DBEAFE)' };
    const borderMap = { high: 'var(--danger)', warning: 'var(--warning)', info: 'var(--info)' };
    const wrapper = riskEl.querySelector('div');
    if (wrapper) {
      wrapper.style.background = bgMap[t.risk.level] || bgMap.info;
      wrapper.style.borderLeftColor = borderMap[t.risk.level] || 'var(--info)';
    }
  } else {
    riskEl.style.display = 'none';
  }
  
  AppState.prevPage = AppState.currentPage;
  goTo('page-terminal');
  
  // 渲染进销存图表
  setTimeout(() => renderTerminalChart(t), 100);
}

function renderTerminalChart(t) {
  const ctx = document.getElementById('terminalChart');
  if (!ctx) return;
  if (ctx._chart) { ctx._chart.destroy(); }
  const months = ['10月', '11月', '12月', '1月', '2月', '3月'];
  const inStock = t.stock < 10
    ? [62, 88, 125, 96, 74, 12]
    : [55, 72, 88, 76, 65, 48];
  const sold = t.stock < 10
    ? [58, 85, 120, 92, 70, 18]
    : [52, 68, 84, 72, 62, t.sales];
  ctx._chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        { label: '进货', data: inStock, backgroundColor: 'rgba(192,57,43,0.7)', borderRadius: 4 },
        { label: '动销', data: sold, backgroundColor: 'rgba(21,101,192,0.6)', borderRadius: 4 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
        y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 10 } } }
      }
    }
  });
}

/* ========================================
   地图交互
   ======================================== */
let currentPinTerminalId = null;

function showPinDetail(tid) {
  const t = DATA.terminals[tid];
  currentPinTerminalId = tid;
  
  // 清除所有选中状态
  document.querySelectorAll('.map-pin').forEach(p => p.classList.remove('selected'));
  const pinEl = document.getElementById('pin-' + tid);
  if (pinEl) pinEl.classList.add('selected');
  
  if (!t) {
    // 没有详细数据的点位
    showToast('正在加载终端数据...');
    return;
  }
  
  const riskBadge = t.risk
    ? `<span class="badge ${t.risk.level === 'high' ? 'badge-danger' : t.risk.level === 'warning' ? 'badge-warning' : 'badge-blue'}">${t.risk.title}</span>`
    : `<span class="badge badge-green">状态正常</span>`;
  
  document.getElementById('pinDetailContent').innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
      <div style="font-size:32px;">${t.icon}</div>
      <div>
        <div style="font-size:15px;font-weight:700;">${t.name}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${t.addr}</div>
      </div>
    </div>
    <div style="display:flex;gap:6px;margin-bottom:12px;">
      <span class="badge badge-gray">${t.type}</span>
      <span class="badge badge-gold">${t.level}</span>
      ${riskBadge}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px;">
      <div style="background:var(--gray-50);border-radius:8px;padding:8px;text-align:center;">
        <div style="font-size:18px;font-weight:700;color:${t.stock < 10 ? 'var(--danger)' : 'var(--text-primary)'};">${t.stock}</div>
        <div style="font-size:10px;color:var(--text-muted);">库存(件)</div>
      </div>
      <div style="background:var(--gray-50);border-radius:8px;padding:8px;text-align:center;">
        <div style="font-size:18px;font-weight:700;">${t.sales}</div>
        <div style="font-size:10px;color:var(--text-muted);">动销(件)</div>
      </div>
      <div style="background:var(--gray-50);border-radius:8px;padding:8px;text-align:center;">
        <div style="font-size:18px;font-weight:700;color:${t.visit === 0 ? 'var(--danger)' : 'var(--text-primary)'};">${t.visit}次</div>
        <div style="font-size:10px;color:var(--text-muted);">本月拜访</div>
      </div>
    </div>
    <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px;">
      <span>👤 ${t.owner}</span>
      <span style="margin:0 8px;">|</span>
      <span>🤝 ${t.dealer}</span>
      <span style="margin:0 8px;">|</span>
      <span>👨‍💼 ${t.sales_rep}</span>
    </div>
  `;
  
  showSheet('pinDetailOverlay', 'pinDetailSheet');
}

function goToCurrentTerminal() {
  closeSheet('pinDetailOverlay');
  if (currentPinTerminalId) {
    setTimeout(() => goToTerminal(currentPinTerminalId), 200);
  }
}

function toggleFenceMode() {
  AppState.fenceMode = !AppState.fenceMode;
  const fence = document.getElementById('efence');
  const countEl = document.getElementById('fenceCount');
  if (AppState.fenceMode) {
    fence.style.display = 'block';
    countEl.textContent = '4个终端';
    showToast('电子围栏已启用 · 圈定4个终端');
  } else {
    fence.style.display = 'none';
    countEl.textContent = '—';
    showToast('电子围栏已关闭');
  }
}

function filterMap(el, type) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  
  const messages = {
    all: '显示全部2847个终端',
    risk: '已筛选37个风险终端',
    active: '已筛选2230个活跃终端',
    inactive: '已筛选580个预警终端'
  };
  showToast(messages[type] || '筛选已更新');
}

function showMapList() {
  const content = document.getElementById('mapSheetContent');
  content.innerHTML = Object.values(DATA.terminals).slice(0, 6).map(t => `
    <div class="terminal-card" style="margin-bottom:8px;" onclick="closeSheet('mapListOverlay');setTimeout(()=>showPinDetail('${t.id}'),100)">
      <div class="terminal-card-header">
        <div class="terminal-icon" style="background:${t.risk ? (t.risk.level === 'high' ? 'rgba(231,76,60,0.1)' : 'rgba(243,156,18,0.1)') : 'rgba(39,174,96,0.1)'};">${t.icon}</div>
        <div class="terminal-info">
          <div class="terminal-name">${t.name}</div>
          <div class="terminal-addr">${t.addr}</div>
        </div>
        ${t.risk ? `<span class="badge ${t.risk.level === 'high' ? 'badge-danger' : 'badge-warning'}">${t.risk.level === 'high' ? '高危' : '预警'}</span>` : '<span class="badge badge-green">正常</span>'}
      </div>
    </div>
  `).join('');
  showSheet('mapListOverlay', 'mapListSheet');
}

/* ========================================
   分公司穿透
   ======================================== */
function initBranchList() {
  const el = document.getElementById('branchList');
  if (!el) return;
  el.innerHTML = DATA.branches.map((b, idx) => `
    <div class="list-item" onclick="goDealerPage('${b.id}', '${b.name}')">
      <div class="list-avatar" style="background:var(--brand-red-bg);font-size:20px;color:var(--brand-red);font-weight:700;">${idx + 1}</div>
      <div class="list-info">
        <div class="list-title">${b.name}</div>
        <div class="list-subtitle">
          <span>终端 ${b.terminals}</span>
          <span>·</span>
          <span>经销商 ${b.dealer}家</span>
          <span>·</span>
          <span style="color:${b.risk > 5 ? 'var(--danger)' : 'var(--text-muted)'};">风险 ${b.risk}</span>
        </div>
      </div>
      <div class="list-right">
        <span style="font-size:14px;font-weight:700;color:${b.trend === 'up' ? 'var(--success)' : 'var(--danger)'};">${b.growth}</span>
        <span style="font-size:11px;color:var(--text-muted);">动销 ${b.turnover}</span>
      </div>
    </div>
  `).join('');
}

function initBranchRankList() {
  const el = document.getElementById('branchRankList');
  if (!el) return;
  el.innerHTML = DATA.branches.map((b, idx) => `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
      <span style="width:18px;height:18px;background:${idx < 3 ? 'var(--brand-red)' : 'var(--gray-200)'};color:${idx < 3 ? 'white' : 'var(--gray-600)'};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0;">${idx + 1}</span>
      <span style="flex:1;font-size:12px;">${b.name}</span>
      <span style="font-size:12px;color:var(--text-muted);min-width:40px;text-align:right;">${b.turnover}</span>
      <div style="width:80px;">
        <div class="progress-bar">
          <div class="progress-fill" style="width:${b.turnover};background:${b.trend === 'up' ? 'var(--success)' : 'var(--danger)'};"></div>
        </div>
      </div>
      <span style="font-size:11px;font-weight:600;color:${b.trend === 'up' ? 'var(--success)' : 'var(--danger)'};">${b.growth}</span>
    </div>
  `).join('');
}

function goDealerPage(bid, bname) {
  document.getElementById('dealerPageTitle').textContent = bname;
  AppState.prevPage = 'page-branch';
  initDealerList();
  goTo('page-dealer');
}

function initDealerList() {
  const el = document.getElementById('dealerList');
  if (!el) return;
  el.innerHTML = DATA.dealers.map(d => `
    <div class="list-item" onclick="showToast('${d.name} · ${d.terminals}家终端')">
      <div class="list-avatar" style="background:var(--brand-gold-bg);font-size:20px;">🤝</div>
      <div class="list-info">
        <div class="list-title">${d.name}</div>
        <div class="list-subtitle">
          <span>${d.owner}</span>·
          <span>终端${d.terminals}家</span>·
          <span>活跃${d.active}家</span>
          ${d.riskTerminals > 0 ? `<span style="color:var(--danger);">风险${d.riskTerminals}</span>` : ''}
        </div>
      </div>
      <div class="list-right">
        <span style="font-size:13px;font-weight:700;">${d.stock}<span style="font-size:10px;font-weight:400;color:var(--text-muted);">件</span></span>
        <span class="badge ${d.trend === 'up' ? 'badge-green' : 'badge-danger'}" style="font-size:10px;">${d.trend === 'up' ? '▲正常' : '▼预警'}</span>
      </div>
    </div>
  `).join('');
}

/* ========================================
   风险预警列表
   ======================================== */
function initWarningList() {
  const el = document.getElementById('warningList');
  if (!el) return;
  const levelConfig = {
    high: { icon: '🚨', color: 'var(--danger)', bg: 'rgba(231,76,60,0.06)', badge: 'badge-danger', label: '高风险' },
    warning: { icon: '⚠️', color: 'var(--warning)', bg: 'rgba(243,156,18,0.06)', badge: 'badge-warning', label: '中风险' },
    info: { icon: 'ℹ️', color: 'var(--info)', bg: 'rgba(41,128,185,0.06)', badge: 'badge-blue', label: '低风险' },
  };
  el.innerHTML = DATA.warnings.map(w => {
    const cfg = levelConfig[w.level];
    return `
      <div class="card" style="overflow:visible;" onclick="${w.tid ? `goToTerminal('${w.tid}')` : `showToast('查看中...')`}">
        <div style="padding:14px;display:flex;gap:12px;align-items:flex-start;background:${cfg.bg};border-radius:var(--radius-md);">
          <span style="font-size:22px;flex-shrink:0;">${cfg.icon}</span>
          <div style="flex:1;">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
              <span style="font-size:13px;font-weight:600;">${w.terminal}</span>
              <span class="badge ${cfg.badge}">${w.type}</span>
            </div>
            <div style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;">${w.desc}</div>
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <div style="font-size:10px;color:var(--text-muted);">${w.branch} · ${w.time}</div>
              <div style="display:flex;gap:6px;">
                <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();showTaskSheet()">下达任务</button>
                <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();dismissWarning(this)">忽略</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function dismissWarning(btn) {
  const card = btn.closest('.card');
  card.style.opacity = '0.4';
  card.style.pointerEvents = 'none';
  showToast('已标记为忽略');
}

/* ========================================
   任务管理（管理者端）
   ======================================== */
function initTaskList() {
  const el = document.getElementById('taskList');
  if (!el) return;
  const statusConfig = {
    pending: { label: '待接收', color: 'var(--warning)', badge: 'badge-warning' },
    doing: { label: '进行中', color: 'var(--tech-blue)', badge: 'badge-blue' },
    done: { label: '已完成', color: 'var(--success)', badge: 'badge-green' },
  };
  const priorityIcon = { high: '🔴', medium: '🟡', low: '🟢' };
  el.innerHTML = DATA.tasks.map(t => {
    const cfg = statusConfig[t.status];
    return `
      <div class="task-card">
        <div class="task-header">
          <div class="task-icon" style="background:${t.status === 'done' ? 'rgba(39,174,96,0.1)' : 'rgba(192,57,43,0.1)'};">${t.type.split(' ')[0]}</div>
          <div class="task-title-wrap">
            <div class="task-title">${priorityIcon[t.priority]} ${t.title}</div>
            <div class="task-meta">${t.terminal} · 指派: ${t.assignee}</div>
          </div>
          <span class="badge ${cfg.badge}">${cfg.label}</span>
        </div>
        <div class="task-desc">${t.desc}</div>
        <div class="task-footer">
          <span style="font-size:11px;color:var(--text-muted);">⏰ 截止: ${t.deadline}</span>
          ${t.status !== 'done'
            ? `<button class="btn btn-primary btn-sm" onclick="showToast('已催促${t.assignee}')">催促</button>`
            : `<span class="badge badge-green">✅ 已完成</span>`
          }
        </div>
      </div>
    `;
  }).join('');
}

/* ========================================
   业务员端数据渲染
   ======================================== */
function initSalesTaskList() {
  const el = document.getElementById('salesTaskList');
  if (!el) return;
  el.innerHTML = DATA.salesTasks.map(t => `
    <div style="background:white;border-radius:var(--radius-md);padding:12px 14px;box-shadow:var(--shadow-card);display:flex;gap:10px;align-items:flex-start;cursor:pointer;border-left:3px solid ${t.urgent ? 'var(--danger)' : 'var(--gray-200)'};" onclick="showToast('任务详情: ${t.title}')">
      <span style="font-size:20px;flex-shrink:0;">${t.icon}</span>
      <div style="flex:1;">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px;">
          <span style="font-size:13px;font-weight:600;">${t.title}</span>
          ${t.urgent ? '<span class="badge badge-danger">紧急</span>' : ''}
        </div>
        <div style="font-size:11px;color:var(--text-muted);">来自: ${t.from} · ${t.time}</div>
      </div>
      <span style="font-size:16px;color:var(--gray-400);">›</span>
    </div>
  `).join('');
}

function initVisitList() {
  const el = document.getElementById('visitList');
  if (!el) return;
  el.innerHTML = DATA.visitRoute.map((v, i) => `
    <div style="background:white;border-radius:var(--radius-md);padding:10px 12px;box-shadow:var(--shadow-card);display:flex;align-items:center;gap:10px;cursor:pointer;" onclick="${v.tid ? `goToTerminal('${v.tid}')` : "showToast('查看终端详情')"}">
      <div style="width:28px;height:28px;background:${v.urgent ? 'var(--brand-red)' : 'var(--gray-100)'};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:${v.urgent ? 'white' : 'var(--gray-600)'};flex-shrink:0;">${i + 1}</div>
      <span style="font-size:18px;">${v.type}</span>
      <div style="flex:1;">
        <div style="font-size:13px;font-weight:500;">${v.name}</div>
        <div style="font-size:11px;color:var(--text-muted);">${v.addr} · ${v.dist}</div>
      </div>
      ${v.urgent ? '<span class="badge badge-danger">紧急</span>' : ''}
      <span style="font-size:14px;color:var(--gray-400);">›</span>
    </div>
  `).join('');
}

function initSalesTerminalList() {
  const el = document.getElementById('salesTerminalList');
  if (!el) return;
  const riskConfig = {
    high: { color: 'var(--danger)', badge: 'badge-danger', label: '高风险' },
    warning: { color: 'var(--warning)', badge: 'badge-warning', label: '预警' },
    info: { color: 'var(--info)', badge: 'badge-blue', label: '关注' },
    ok: { color: 'var(--success)', badge: 'badge-green', label: '正常' },
  };
  el.innerHTML = DATA.salesTerminals.map(t => {
    const cfg = riskConfig[t.risk];
    return `
      <div class="terminal-card" onclick="${t.tid ? `goToTerminal('${t.tid}')` : "showToast('终端详情')"}">
        <div class="terminal-card-header">
          <div class="terminal-icon" style="background:${t.risk === 'ok' ? 'rgba(39,174,96,0.1)' : 'rgba(243,156,18,0.1)'};">🏪</div>
          <div class="terminal-info">
            <div class="terminal-name">${t.name}</div>
            <div class="terminal-addr">${t.type} · 上次拜访 ${t.lastVisit}</div>
          </div>
          <span class="badge ${cfg.badge}">${cfg.label}</span>
        </div>
        <div class="terminal-stats">
          <div class="terminal-stat">
            <div class="terminal-stat-val" style="color:${t.stock < 10 ? 'var(--danger)' : 'var(--text-primary)'};">${t.stock}</div>
            <div class="terminal-stat-key">库存(件)</div>
          </div>
          <div class="terminal-stat">
            <div class="terminal-stat-val">${t.lastVisit}</div>
            <div class="terminal-stat-key">最近拜访</div>
          </div>
          <div class="terminal-stat">
            <div class="terminal-stat-val">${t.risk === 'ok' ? '✅' : '⚠️'}</div>
            <div class="terminal-stat-key">风险状态</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* ========================================
   拜访打卡
   ======================================== */
let stockVal = 2;

function adjustStock(delta) {
  stockVal = Math.max(0, stockVal + delta);
  document.getElementById('stockCount').textContent = stockVal;
}

function selectOpt(el, val) {
  document.querySelectorAll('.visit-opt-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

function submitVisit() {
  AppState.visitedCount++;
  const btn = document.getElementById('checkinBtn');
  const text = document.getElementById('checkinText');
  const info = document.getElementById('checkinInfo');
  const badge = document.getElementById('visitedBadge');
  
  if (btn) {
    btn.classList.add('checked');
    document.getElementById('checkinIcon').textContent = '✅';
  }
  if (text) text.textContent = '今日已打卡签到';
  if (info) info.textContent = `今日 ${AppState.visitedCount}/8 家已拜访`;
  if (badge) badge.textContent = `已完成 ${AppState.visitedCount}家`;
  
  showToast('✅ 拜访打卡成功！数据已上传');
  setTimeout(() => {
    switchSalesTab('page-sales-home', document.querySelector('#page-sales-visit .bottom-nav .bottom-nav-item'));
  }, 1200);
}

function doCheckin() {
  const btn = document.getElementById('checkinBtn');
  if (btn && !btn.classList.contains('checked')) {
    AppState.visitedCount = 1;
    btn.classList.add('checked');
    document.getElementById('checkinIcon').textContent = '✅';
    document.getElementById('checkinText').textContent = '今日已签到 · 开始拜访';
    document.getElementById('checkinInfo').textContent = `今日 1/8 家已拜访`;
    document.getElementById('visitedBadge').textContent = '已完成 1家';
    showToast('📍 签到成功！定位: 宝鸡市凤翔区');
  }
}

/* ========================================
   Sheet 弹出层
   ======================================== */
function showSheet(overlayId, sheetId) {
  const overlay = document.getElementById(overlayId);
  const sheet = document.getElementById(sheetId);
  if (overlay) { overlay.classList.add('show'); }
  if (sheet) { sheet.style.display = 'block'; }
}

function closeSheet(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;
  overlay.classList.remove('show');
  // 找对应sheet
  const sheetMap = {
    mapListOverlay: 'mapListSheet',
    pinDetailOverlay: 'pinDetailSheet',
    taskSheetOverlay: 'taskSheet',
    newTaskOverlay: 'newTaskSheet',
  };
  const sheetId = sheetMap[overlayId];
  if (sheetId) {
    const sheet = document.getElementById(sheetId);
    if (sheet) sheet.style.display = 'none';
  }
  // 清除地图选中
  document.querySelectorAll('.map-pin').forEach(p => p.classList.remove('selected'));
}

function showTaskSheet() {
  closeSheet('pinDetailOverlay');
  setTimeout(() => showSheet('taskSheetOverlay', 'taskSheet'), 100);
}

function showNewTaskSheet() {
  showSheet('newTaskOverlay', 'newTaskSheet');
}

function submitTask() {
  closeSheet('taskSheetOverlay');
  showToast('✅ 任务已下达！李明将收到通知');
}

function submitNewTask() {
  closeSheet('newTaskOverlay');
  showToast('✅ 任务已创建并下达');
}

/* ========================================
   Toast 提示
   ======================================== */
function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2000);
}

/* ========================================
   辅助函数
   ======================================== */
function setActiveTab(el) {
  const parent = el.closest('.filter-tabs') || el.closest('#taskTypeList');
  if (parent) {
    parent.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  }
  el.classList.add('active');
}

/* ========================================
   图表初始化
   ======================================== */
function initAllCharts() {
  initTrendChart();
  initBranchChart();
  initDonutChart();
}

function initTrendChart() {
  const ctx = document.getElementById('trendChart');
  if (!ctx) return;
  if (ctx._chart) ctx._chart.destroy();
  ctx._chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['3/1', '3/5', '3/8', '3/12', '3/15', '3/18', '3/22'],
      datasets: [
        {
          label: '实际动销',
          data: [1820, 2240, 2580, 2190, 2860, 3120, 2847],
          borderColor: '#C0392B',
          backgroundColor: 'rgba(192,57,43,0.08)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#C0392B',
          pointRadius: 3,
          borderWidth: 2,
        },
        {
          label: '目标',
          data: [2000, 2200, 2400, 2600, 2800, 3000, 3000],
          borderColor: '#1565C0',
          borderDash: [5, 4],
          backgroundColor: 'transparent',
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 1.5,
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
        y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 10 } } }
      },
      interaction: { mode: 'nearest', axis: 'x', intersect: false }
    }
  });
}

function initBranchChart() {
  const ctx = document.getElementById('branchChart');
  if (!ctx) return;
  if (ctx._chart) ctx._chart.destroy();
  ctx._chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['宝鸡', '西安', '咸阳', '渭南', '榆林'],
      datasets: [
        { label: '动销率', data: [72, 68.5, 65.3, 61.8, 58.2], backgroundColor: ['rgba(192,57,43,0.8)', 'rgba(192,57,43,0.7)', 'rgba(192,57,43,0.6)', 'rgba(192,57,43,0.5)', 'rgba(192,57,43,0.4)'], borderRadius: 6 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: {
          grid: { color: 'rgba(0,0,0,0.04)' },
          ticks: { font: { size: 10 }, callback: v => v + '%' },
          min: 40, max: 80,
        }
      }
    }
  });
}

function initDonutChart() {
  const ctx = document.getElementById('donutChart');
  if (!ctx) return;
  if (ctx._chart) ctx._chart.destroy();
  ctx._chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [68.2, 31.8],
        backgroundColor: ['#C0392B', '#EEEEEE'],
        borderWidth: 0,
      }]
    },
    options: {
      responsive: false,
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      }
    },
    plugins: [{
      id: 'centerText',
      afterDraw(chart) {
        const { ctx, width, height } = chart;
        ctx.save();
        ctx.font = 'bold 16px Noto Sans SC, sans-serif';
        ctx.fillStyle = '#C0392B';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('68%', width / 2, height / 2);
        ctx.restore();
      }
    }]
  });
}

function initSalesChart() {
  const ctx = document.getElementById('salesChart');
  if (!ctx) return;
  if (ctx._chart) ctx._chart.destroy();
  ctx._chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['3/1', '3/5', '3/8', '3/12', '3/15', '3/18', '3/22'],
      datasets: [
        { label: '实际拜访', data: [7, 8, 6, 7, 8, 7, 0], backgroundColor: 'rgba(192,57,43,0.7)', borderRadius: 4 },
        { label: '计划', data: [8, 8, 8, 8, 8, 8, 8], backgroundColor: 'rgba(21,101,192,0.2)', borderRadius: 4 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
        y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 10 } } }
      }
    }
  });
}

/* ========================================
   页面数据初始化
   ======================================== */
function initPageData(pageId) {
  switch (pageId) {
    case 'page-home': initBranchRankList(); break;
    case 'page-branch': initBranchList(); initBranchChart(); break;
    case 'page-warning': initWarningList(); break;
    case 'page-task': initTaskList(); break;
    case 'page-sales-home': initSalesTaskList(); initVisitList(); break;
    case 'page-sales-terminal': initSalesTerminalList(); break;
    case 'page-sales-report': setTimeout(initSalesChart, 100); break;
  }
}

/* ========================================
   时钟更新
   ======================================== */
function updateClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  el.textContent = `${h}:${m}`;
}

/* ========================================
   初始化
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  setInterval(updateClock, 30000);

  // 阻止默认触摸行为（防止页面滚动外溢）
  document.querySelector('.device-screen')?.addEventListener('touchmove', (e) => {
    if (e.target.closest('.page-content') || e.target.closest('.map-container') || e.target.closest('.sheet')) return;
    e.preventDefault();
  }, { passive: false });

  // 预渲染登录页后的首页数据（提升切换流畅度）
  setTimeout(() => {
    initBranchRankList();
    initWarningList();
    initTaskList();
    initSalesTaskList();
    initVisitList();
    initSalesTerminalList();
    initDealerList();
  }, 200);
});
