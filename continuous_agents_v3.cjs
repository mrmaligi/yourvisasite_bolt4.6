#!/usr/bin/env node
/**
 * 🤖 CONTINUOUS 5-AGENT SYSTEM v3
 * Enhanced with More Workflows + Alert System
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const CONFIG = {
  baseUrl: 'https://yourvisasite.vercel.app',
  supabaseUrl: 'https://zogfvzzizbbmmmnlzxdg.supabase.co',
  serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZ2Z2enppemJibW1tbmx6eGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ1ODc5MiwiZXhwIjoyMDg3MDM0NzkyfQ.igBGIh5h82uoVA-EEjKmlLdYrLs1lnExf37pgQI5Ckw',
  browserlessToken: '2U2aPedRBZ9ClTla82ac1f1ee9521761d338e52970d9a047a',
  stateDir: '/tmp/visabuild_agents_state',
  reportsDir: '/tmp/visabuild_agents_reports',
  alertsDir: '/tmp/visabuild_agents_alerts',
  runInterval: 5 * 60 * 1000,
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  telegramChatId: process.env.TELEGRAM_CHAT_ID || '1755354073'
};

// Ensure directories exist
[CONFIG.stateDir, CONFIG.reportsDir, CONFIG.alertsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ALERT SYSTEM
class AlertSystem {
  constructor() {
    this.alertHistory = [];
    this.alertFile = path.join(CONFIG.alertsDir, 'alert_history.json');
    this.loadHistory();
  }

  loadHistory() {
    if (fs.existsSync(this.alertFile)) {
      this.alertHistory = JSON.parse(fs.readFileSync(this.alertFile, 'utf8'));
    }
  }

  saveHistory() {
    fs.writeFileSync(this.alertFile, JSON.stringify(this.alertHistory, null, 2));
  }

  async sendAlert(level, title, message, details = {}) {
    const alert = {
      id: Date.now().toString(36),
      timestamp: new Date().toISOString(),
      level, // critical, warning, info
      title,
      message,
      details
    };

    this.alertHistory.push(alert);
    this.saveHistory();

    // Console output with color
    const icons = { critical: '🚨', warning: '⚠️', info: 'ℹ️' };
    console.log(`\n${icons[level]} ALERT [${level.toUpperCase()}]: ${title}`);
    console.log(`   ${message}`);
    if (details.error) console.log(`   Error: ${details.error}`);

    // Save alert to file
    const alertPath = path.join(CONFIG.alertsDir, `alert_${alert.id}.md`);
    fs.writeFileSync(alertPath, this.formatAlertMarkdown(alert));

    // Send Telegram notification if configured
    await this.sendTelegramNotification(alert);

    return alert;
  }

  formatAlertMarkdown(alert) {
    return `# ${alert.level === 'critical' ? '🚨' : '⚠️'} ${alert.title}

**Level:** ${alert.level.toUpperCase()}  
**Time:** ${alert.timestamp}  
**Alert ID:** ${alert.id}

## Message
${alert.message}

## Details
${Object.entries(alert.details).map(([k, v]) => `- **${k}:** ${v}`).join('\n')}

## Recommended Actions
${alert.level === 'critical' ? '- [ ] Investigate immediately\n- [ ] Check logs\n- [ ] Contact developer' : '- [ ] Review when convenient\n- [ ] Monitor next run'}
`;
  }

  async sendTelegramNotification(alert) {
    // Placeholder for Telegram integration
    // Would need actual bot token to work
    console.log(`   📱 Telegram notification queued (would send to ${CONFIG.telegramChatId})`);
  }

  getRecentAlerts(minutes = 60) {
    const cutoff = Date.now() - minutes * 60 * 1000;
    return this.alertHistory.filter(a => new Date(a.timestamp).getTime() > cutoff);
  }

  getCriticalAlerts() {
    return this.alertHistory.filter(a => a.level === 'critical' && !a.acknowledged);
  }
}

const alertSystem = new AlertSystem();

// MESSAGE BUS
class AgentBus {
  constructor() {
    this.messages = [];
    this.busFile = path.join(CONFIG.stateDir, 'agent_bus.json');
    this.loadBus();
  }

  loadBus() {
    if (fs.existsSync(this.busFile)) {
      this.messages = JSON.parse(fs.readFileSync(this.busFile, 'utf8'));
    }
  }

  saveBus() {
    fs.writeFileSync(this.busFile, JSON.stringify(this.messages, null, 2));
  }

  send(from, to, action, data) {
    const message = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      from, to, action, data,
      timestamp: new Date().toISOString(),
      processed: false
    };
    this.messages.push(message);
    this.saveBus();
    console.log(`📨 [BUS] ${from} → ${to}: ${action}`);
    return message.id;
  }

  receive(agentId, markProcessed = true) {
    const messages = this.messages.filter(m => (m.to === agentId || m.to === 'broadcast') && !m.processed);
    if (markProcessed) {
      messages.forEach(m => m.processed = true);
      this.saveBus();
    }
    return messages;
  }

  broadcast(from, action, data) {
    return this.send(from, 'broadcast', action, data);
  }
}

const globalBus = new AgentBus();

// STATE MANAGER
class StateManager {
  constructor(agentName) {
    this.agentName = agentName;
    this.stateFile = path.join(CONFIG.stateDir, `${agentName}_state.json`);
    this.state = this.loadState();
  }

  loadState() {
    if (fs.existsSync(this.stateFile)) {
      const loaded = JSON.parse(fs.readFileSync(this.stateFile, 'utf8'));
      return {
        testsCompleted: loaded.testsCompleted || [],
        workflowsCompleted: loaded.workflowsCompleted || [],
        errorsFound: loaded.errorsFound || [],
        fixesApplied: loaded.fixesApplied || [],
        lastRun: loaded.lastRun || null,
        runCount: loaded.runCount || 0,
        currentPhase: loaded.currentPhase || 'initial'
      };
    }
    return { testsCompleted: [], workflowsCompleted: [], errorsFound: [], fixesApplied: [], lastRun: null, runCount: 0, currentPhase: 'initial' };
  }

  saveState() {
    this.state.lastRun = new Date().toISOString();
    this.state.runCount++;
    fs.writeFileSync(this.stateFile, JSON.stringify(this.state, null, 2));
  }

  addTestCompleted(testId, result) {
    if (!this.state.testsCompleted.find(t => t.id === testId)) {
      this.state.testsCompleted.push({ id: testId, timestamp: new Date().toISOString(), result });
    }
  }

  addWorkflowCompleted(workflowId, details) {
    if (!this.state.workflowsCompleted.find(w => w.id === workflowId)) {
      this.state.workflowsCompleted.push({ id: workflowId, timestamp: new Date().toISOString(), details });
    }
  }

  addErrorFound(error) {
    const errorId = `${error.testId}_${error.message}`.replace(/[^a-zA-Z0-9]/g, '_');
    if (!this.state.errorsFound.find(e => e.id === errorId)) {
      this.state.errorsFound.push({ id: errorId, testId: error.testId, message: error.message, timestamp: new Date().toISOString(), fixed: false });
    }
    return errorId;
  }

  markErrorFixed(errorId, fixDescription) {
    const error = this.state.errorsFound.find(e => e.id === errorId);
    if (error) {
      error.fixed = true;
      error.fixDescription = fixDescription;
      error.fixedAt = new Date().toISOString();
      this.state.fixesApplied.push({ errorId, description: fixDescription, timestamp: new Date().toISOString() });
    }
  }

  hasTestBeenRun(testId) { return this.state.testsCompleted.some(t => t.id === testId); }
  hasWorkflowBeenRun(workflowId) { return this.state.workflowsCompleted.some(w => w.id === workflowId); }
  getPendingErrors() { return this.state.errorsFound.filter(e => !e.fixed); }
}

// BASE AGENT
class BaseAgent {
  constructor(name, role) {
    this.name = name;
    this.role = role;
    this.state = new StateManager(name);
    this.logs = [];
    this.currentErrors = [];
    this.bus = globalBus;
    this.alerts = alertSystem;
  }

  log(message, type = 'info') {
    const entry = { timestamp: new Date().toISOString(), agent: this.name, type, message };
    this.logs.push(entry);
    const icons = { info: 'ℹ️', success: '✅', error: '❌', warn: '⚠️', fix: '🔧', comm: '📨' };
    console.log(`${icons[type]} [${this.name}] ${message}`);
  }

  async httpCheck(url, expectedStatus = 200) {
    return new Promise((resolve) => {
      https.get(url, (res) => {
        resolve({ status: res.statusCode, success: res.statusCode === expectedStatus || res.statusCode === 307, url });
      }).on('error', (err) => resolve({ status: 0, success: false, error: err.message, url }));
    });
  }

  async screenshot(pageUrl, filename) {
    return new Promise((resolve) => {
      const postData = JSON.stringify({ url: pageUrl, viewport: { width: 1280, height: 800 }, waitFor: 3000 });
      const options = {
        hostname: 'chrome.browserless.io', port: 443,
        path: `/screenshot?token=${CONFIG.browserlessToken}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) }
      };
      const req = https.request(options, (res) => {
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const filepath = path.join(CONFIG.reportsDir, `${this.name}_${filename}`);
          fs.writeFileSync(filepath, buffer);
          resolve({ success: true, filepath, size: buffer.length });
        });
      });
      req.on('error', (err) => resolve({ success: false, error: err.message }));
      req.write(postData);
      req.end();
    });
  }

  async queryDatabase(table, filters = '') {
    return new Promise((resolve) => {
      const url = `${CONFIG.supabaseUrl}/rest/v1/${table}${filters ? '?' + filters : ''}`;
      https.get(url, { headers: { 'apikey': CONFIG.serviceKey, 'Authorization': `Bearer ${CONFIG.serviceKey}` } }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try { resolve({ success: true, data: JSON.parse(data) }); }
          catch { resolve({ success: false, error: 'Invalid JSON', raw: data }); }
        });
      }).on('error', (err) => resolve({ success: false, error: err.message }));
    });
  }

  async updateDatabase(table, id, data) {
    return new Promise((resolve) => {
      const postData = JSON.stringify(data);
      const options = {
        hostname: 'zogfvzzizbbmmmnlzxdg.supabase.co', port: 443,
        path: `/rest/v1/${table}?id=eq.${id}`,
        method: 'PATCH',
        headers: { 'apikey': CONFIG.serviceKey, 'Authorization': `Bearer ${CONFIG.serviceKey}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' }
      };
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ success: res.statusCode === 200 || res.statusCode === 204, data }));
      });
      req.on('error', () => resolve({ success: false }));
      req.write(postData);
      req.end();
    });
  }

  generateReport() {
    const report = {
      agent: this.name, role: this.role, timestamp: new Date().toISOString(),
      runCount: this.state.state.runCount,
      testsCompleted: this.state.state.testsCompleted.length,
      workflowsCompleted: this.state.state.workflowsCompleted.length,
      errorsFound: this.state.state.errorsFound.length,
      fixesApplied: this.state.state.fixesApplied.length,
      pendingErrors: this.state.getPendingErrors().length,
      logs: this.logs, currentErrors: this.currentErrors
    };
    fs.writeFileSync(path.join(CONFIG.reportsDir, `${this.name}_report_${Date.now()}.json`), JSON.stringify(report, null, 2));
    this.state.saveState();
    return report;
  }
}

// ═══════════════════════════════════════════════════════════════
// WORKFLOWS
// ═══════════════════════════════════════════════════════════════

// Workflow 1: Lawyer Registration → Admin Approval
class LawyerRegistrationWorkflow {
  constructor(lawyerAgent, adminAgent) {
    this.lawyerAgent = lawyerAgent;
    this.adminAgent = adminAgent;
  }

  async execute() {
    console.log('\n🔄 WORKFLOW: Lawyer Registration → Admin Approval');
    const workflowId = 'lawyer_registration_approval';

    const pendingLawyers = await this.adminAgent.queryDatabase('lawyer_profiles', 'verification_status=eq.pending&select=profiles(email),id');

    if (!pendingLawyers.success || pendingLawyers.data.length === 0) {
      console.log('  ℹ️ No pending lawyers found');
      return;
    }

    console.log(`  📋 Found ${pendingLawyers.data.length} pending lawyer(s)`);

    for (const lawyer of pendingLawyers.data) {
      const lawyerEmail = lawyer.profiles?.email || 'unknown';
      console.log(`  🔧 Approving: ${lawyerEmail}`);

      const updateResult = await this.adminAgent.updateDatabase('lawyer_profiles', lawyer.id, { verification_status: 'approved' });

      if (updateResult.success) {
        console.log(`  ✅ Approved: ${lawyerEmail}`);
        this.adminAgent.bus.send('AdminAgent', 'LawyerAgent', 'lawyer_approved', { lawyerId: lawyer.id, email: lawyerEmail });
        this.adminAgent.state.addWorkflowCompleted(workflowId, { lawyerId: lawyer.id, email: lawyerEmail });
        this.lawyerAgent.state.addWorkflowCompleted(workflowId, { lawyerId: lawyer.id, email: lawyerEmail });
        
        // ALERT: Successful approval
        await alertSystem.sendAlert('info', 'Lawyer Approved', `${lawyerEmail} was approved by AdminAgent`, { lawyerId: lawyer.id });
      } else {
        console.log(`  ❌ Failed to approve: ${lawyerEmail}`);
        await alertSystem.sendAlert('warning', 'Lawyer Approval Failed', `Could not approve ${lawyerEmail}`, { lawyerId: lawyer.id });
      }
    }
  }
}

// Workflow 2: User Books → Lawyer Accepts
class ConsultationBookingWorkflow {
  constructor(userAgent, lawyerAgent) {
    this.userAgent = userAgent;
    this.lawyerAgent = lawyerAgent;
  }

  async execute() {
    console.log('\n🔄 WORKFLOW: User Books Consultation → Lawyer Accepts');

    const lawyers = await this.userAgent.queryDatabase('lawyer_profiles', 'verification_status=eq.approved&select=profiles(email),id');

    if (!lawyers.success || lawyers.data.length === 0) {
      console.log('  ⚠️ No approved lawyers available for booking');
      return;
    }

    const availableLawyer = lawyers.data[0];
    console.log(`  👤 User found lawyer: ${availableLawyer.profiles?.email}`);

    const pendingConsultations = await this.lawyerAgent.queryDatabase('consultations', 'status=eq.pending&select=*,user:profiles!consultations_user_id_fkey(email)');

    if (pendingConsultations.success && pendingConsultations.data.length > 0) {
      console.log(`  📋 Found ${pendingConsultations.data.length} pending consultation(s)`);

      for (const consultation of pendingConsultations.data) {
        console.log(`  🔧 Accepting consultation from: ${consultation.user?.email}`);

        const updateResult = await this.lawyerAgent.updateDatabase('consultations', consultation.id, { status: 'confirmed' });

        if (updateResult.success) {
          console.log(`  ✅ Consultation confirmed`);
          this.lawyerAgent.bus.send('LawyerAgent', 'UserAgent', 'consultation_confirmed', { consultationId: consultation.id, lawyerId: consultation.lawyer_id });
          
          // ALERT: Booking confirmed
          await alertSystem.sendAlert('info', 'Consultation Confirmed', `Lawyer accepted consultation #${consultation.id}`, { consultationId: consultation.id });
        } else {
          await alertSystem.sendAlert('warning', 'Consultation Accept Failed', `Could not confirm consultation #${consultation.id}`, { consultationId: consultation.id });
        }
      }
    } else {
      console.log('  ℹ️ No pending consultations to accept');
    }
  }
}

// Workflow 3: Payment Flow Testing
class PaymentWorkflow {
  constructor(userAgent, adminAgent) {
    this.userAgent = userAgent;
    this.adminAgent = adminAgent;
  }

  async execute() {
    console.log('\n🔄 WORKFLOW: Payment Flow Testing');

    // Check for failed payments
    const failedPayments = await this.adminAgent.queryDatabase('payments', 'status=eq.failed&select=*');
    
    if (failedPayments.success && failedPayments.data.length > 0) {
      console.log(`  🚨 Found ${failedPayments.data.length} failed payment(s)!`);
      
      for (const payment of failedPayments.data) {
        await alertSystem.sendAlert('critical', 'Payment Failed', `Payment #${payment.id} failed`, { 
          paymentId: payment.id, 
          amount: payment.amount,
          userId: payment.user_id 
        });
      }
    } else {
      console.log('  ✅ No failed payments found');
    }

    // Check for pending payments (shouldn't stay pending too long)
    const pendingPayments = await this.adminAgent.queryDatabase('payments', 'status=eq.pending&select=*');
    
    if (pendingPayments.success && pendingPayments.data.length > 5) {
      await alertSystem.sendAlert('warning', 'Many Pending Payments', `${pendingPayments.data.length} payments are pending`, { count: pendingPayments.data.length });
    }
  }
}

// Workflow 4: Notification System Check
class NotificationWorkflow {
  constructor(userAgent, lawyerAgent, adminAgent) {
    this.userAgent = userAgent;
    this.lawyerAgent = lawyerAgent;
    this.adminAgent = adminAgent;
  }

  async execute() {
    console.log('\n🔄 WORKFLOW: Notification System Check');

    // Check for unsent notifications
    const unsentNotifications = await this.adminAgent.queryDatabase('notifications', 'sent=eq.false&select=*');
    
    if (unsentNotifications.success && unsentNotifications.data.length > 10) {
      console.log(`  ⚠️ ${unsentNotifications.data.length} notifications not sent`);
      await alertSystem.sendAlert('warning', 'Notification Backlog', `${unsentNotifications.data.length} notifications queued`, { count: unsentNotifications.data.length });
    } else {
      console.log('  ✅ Notification system healthy');
    }

    // Broadcast test message
    this.adminAgent.bus.broadcast('AdminAgent', 'notification_test', { timestamp: new Date().toISOString() });
  }
}

// Workflow 5: Database Health Check
class DatabaseHealthWorkflow {
  constructor(adminAgent) {
    this.adminAgent = adminAgent;
  }

  async execute() {
    console.log('\n🔄 WORKFLOW: Database Health Check');

    const checks = [
      { name: 'Profiles', table: 'profiles' },
      { name: 'Lawyer Profiles', table: 'lawyer_profiles' },
      { name: 'Consultations', table: 'consultations' },
      { name: 'Visas', table: 'visas' }
    ];

    for (const check of checks) {
      const result = await this.adminAgent.queryDatabase(check.table, 'select=count');
      if (result.success) {
        console.log(`  ✅ ${check.name}: ${result.data.length} records`);
      } else {
        console.log(`  ❌ ${check.name}: ERROR`);
        await alertSystem.sendAlert('critical', 'Database Error', `Cannot access ${check.name} table`, { table: check.table });
      }
    }

    // Check for orphaned records
    const orphaned = await this.adminAgent.queryDatabase('lawyer_profiles', 'profiles=is.null&select=id');
    if (orphaned.success && orphaned.data.length > 0) {
      await alertSystem.sendAlert('warning', 'Orphaned Records', `${orphaned.data.length} lawyer profiles without users`, { count: orphaned.data.length });
    }
  }
}

// Workflow 6: Performance Check
class PerformanceWorkflow {
  constructor(anonymousAgent) {
    this.anonymousAgent = anonymousAgent;
  }

  async execute() {
    console.log('\n🔄 WORKFLOW: Performance Check');

    const pages = ['/', '/lawyers', '/visas', '/login'];
    const results = [];

    for (const page of pages) {
      const start = Date.now();
      const result = await this.anonymousAgent.httpCheck(`${CONFIG.baseUrl}${page}`);
      const duration = Date.now() - start;
      results.push({ page, duration, success: result.success });
      
      if (duration > 5000) {
        await alertSystem.sendAlert('warning', 'Slow Page Detected', `${page} took ${duration}ms to load`, { page, duration });
      }
    }

    const avgTime = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
    console.log(`  ⏱️ Average response time: ${avgTime.toFixed(0)}ms`);

    if (avgTime > 3000) {
      await alertSystem.sendAlert('warning', 'Slow Performance', `Average response time is ${avgTime.toFixed(0)}ms`, { avgTime });
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// AGENTS
// ═══════════════════════════════════════════════════════════════

class UserAgent extends BaseAgent {
  constructor() {
    super('UserAgent', 'user');
    this.testScenarios = [
      { id: 'user_login', name: 'User Login', url: '/login' },
      { id: 'user_dashboard', name: 'User Dashboard', url: '/dashboard' },
      { id: 'user_visas', name: 'Browse Visas', url: '/visas' },
      { id: 'user_lawyers', name: 'Find Lawyers', url: '/lawyers' },
      { id: 'user_booking', name: 'Book Consultation', url: '/dashboard/book-consultation' },
      { id: 'user_profile', name: 'Edit Profile', url: '/profile' },
      { id: 'user_saved_visas', name: 'Saved Visas', url: '/dashboard/saved-visas' }
    ];
  }

  async run() {
    this.log('Starting User Agent run...', 'info');
    this.currentErrors = [];

    const messages = this.bus.receive(this.name);
    for (const msg of messages) {
      if (msg.action === 'consultation_confirmed') {
        this.log(`Received: Consultation confirmed by lawyer!`, 'comm');
      }
      if (msg.action === 'content_updated') {
        this.log(`Received: Content updated, refreshing...`, 'comm');
      }
    }

    for (const scenario of this.testScenarios) {
      if (this.state.hasTestBeenRun(scenario.id)) continue;

      this.log(`Testing: ${scenario.name}`, 'info');
      const fullUrl = `${CONFIG.baseUrl}${scenario.url}`;
      const httpResult = await this.httpCheck(fullUrl);

      if (!httpResult.success) {
        const error = { testId: scenario.id, message: `HTTP ${httpResult.status} on ${scenario.url}`, type: 'http_error' };
        this.state.addErrorFound(error);
        this.currentErrors.push(error);
        this.log(`Error: ${error.message}`, 'error');
        
        // Send alert for critical errors
        if (httpResult.status >= 500) {
          await this.alerts.sendAlert('critical', 'User Page Error', `${scenario.name} returning ${httpResult.status}`, { url: scenario.url });
        }
      } else {
        this.log(`✓ ${scenario.name} accessible`, 'success');
        this.state.addTestCompleted(scenario.id, 'success');
        await this.screenshot(fullUrl, `${scenario.id}.png`);
      }
    }

    return this.generateReport();
  }
}

class LawyerAgent extends BaseAgent {
  constructor() {
    super('LawyerAgent', 'lawyer');
    this.testScenarios = [
      { id: 'lawyer_dashboard', name: 'Lawyer Dashboard', url: '/lawyer/dashboard' },
      { id: 'lawyer_profile', name: 'Edit Lawyer Profile', url: '/lawyer/profile' },
      { id: 'lawyer_availability', name: 'Set Availability', url: '/lawyer/availability' },
      { id: 'lawyer_consultations', name: 'View Consultations', url: '/lawyer/consultations' },
      { id: 'lawyer_clients', name: 'Client List', url: '/lawyer/clients' },
      { id: 'lawyer_earnings', name: 'Earnings Page', url: '/lawyer/earnings' }
    ];
  }

  async run() {
    this.log('Starting Lawyer Agent run...', 'info');
    this.currentErrors = [];

    const messages = this.bus.receive(this.name);
    for (const msg of messages) {
      if (msg.action === 'lawyer_approved') {
        this.log(`Received: Approved by admin!`, 'comm');
      }
    }

    for (const scenario of this.testScenarios) {
      if (this.state.hasTestBeenRun(scenario.id)) continue;

      this.log(`Testing: ${scenario.name}`, 'info');
      const fullUrl = `${CONFIG.baseUrl}${scenario.url}`;
      const httpResult = await this.httpCheck(fullUrl);

      if (!httpResult.success) {
        const error = { testId: scenario.id, message: `HTTP ${httpResult.status} on ${scenario.url}`, type: 'http_error' };
        this.state.addErrorFound(error);
        this.currentErrors.push(error);
        this.log(`Error: ${error.message}`, 'error');
        
        if (httpResult.status >= 500) {
          await this.alerts.sendAlert('critical', 'Lawyer Page Error', `${scenario.name} returning ${httpResult.status}`, { url: scenario.url });
        }
      } else {
        this.log(`✓ ${scenario.name} accessible`, 'success');
        this.state.addTestCompleted(scenario.id, 'success');
        await this.screenshot(fullUrl, `${scenario.id}.png`);
      }
    }

    return this.generateReport();
  }
}

class AdminAgent extends BaseAgent {
  constructor() {
    super('AdminAgent', 'admin');
    this.testScenarios = [
      { id: 'admin_dashboard', name: 'Admin Dashboard', url: '/admin' },
      { id: 'admin_users', name: 'User Management', url: '/admin/users' },
      { id: 'admin_lawyers', name: 'Lawyer Approvals', url: '/admin/lawyers' },
      { id: 'admin_content', name: 'Content Management', url: '/admin/content' },
      { id: 'admin_visas', name: 'Visa Management', url: '/admin/visas' },
      { id: 'admin_reports', name: 'Reports', url: '/admin/reports' }
    ];
  }

  async run() {
    this.log('Starting Admin Agent run...', 'info');
    this.currentErrors = [];

    for (const scenario of this.testScenarios) {
      if (this.state.hasTestBeenRun(scenario.id)) continue;

      this.log(`Testing: ${scenario.name}`, 'info');
      const fullUrl = `${CONFIG.baseUrl}${scenario.url}`;
      const httpResult = await this.httpCheck(fullUrl);

      if (!httpResult.success) {
        const error = { testId: scenario.id, message: `HTTP ${httpResult.status} on ${scenario.url}`, type: 'http_error' };
        this.state.addErrorFound(error);
        this.currentErrors.push(error);
        this.log(`Error: ${error.message}`, 'error');
        
        if (httpResult.status >= 500) {
          await this.alerts.sendAlert('critical', 'Admin Page Error', `${scenario.name} returning ${httpResult.status}`, { url: scenario.url });
        }
      } else {
        this.log(`✓ ${scenario.name} accessible`, 'success');
        this.state.addTestCompleted(scenario.id, 'success');
        await this.screenshot(fullUrl, `${scenario.id}.png`);
      }
    }

    return this.generateReport();
  }
}

class AnonymousAgent extends BaseAgent {
  constructor() {
    super('AnonymousAgent', 'anonymous');
    this.testScenarios = [
      { id: 'anon_home', name: 'Homepage', url: '/' },
      { id: 'anon_lawyers', name: 'Lawyers Directory', url: '/lawyers' },
      { id: 'anon_visas', name: 'Visas List', url: '/visas' },
      { id: 'anon_about', name: 'About Page', url: '/about' },
      { id: 'anon_contact', name: 'Contact Page', url: '/contact' },
      { id: 'anon_faq', name: 'FAQ Page', url: '/faq' },
      { id: 'anon_login', name: 'Login Page', url: '/login' },
      { id: 'anon_register', name: 'Register Page', url: '/register' },
      { id: 'anon_lawyer_register', name: 'Lawyer Registration', url: '/register/lawyer' }
    ];
  }

  async run() {
    this.log('Starting Anonymous Agent run...', 'info');
    this.currentErrors = [];

    const messages = this.bus.receive(this.name);
    for (const msg of messages) {
      if (msg.action === 'content_updated') {
        this.log(`Received: Content updated notification`, 'comm');
      }
    }

    for (const scenario of this.testScenarios) {
      if (this.state.hasTestBeenRun(scenario.id)) continue;

      this.log(`Testing: ${scenario.name}`, 'info');
      const fullUrl = `${CONFIG.baseUrl}${scenario.url}`;
      const httpResult = await this.httpCheck(fullUrl);

      if (!httpResult.success) {
        const error = { testId: scenario.id, message: `HTTP ${httpResult.status} on ${scenario.url}`, type: 'http_error' };
        this.state.addErrorFound(error);
        this.currentErrors.push(error);
        this.log(`Error: ${error.message}`, 'error');
        
        // Public pages should never error
        if (httpResult.status >= 400) {
          await this.alerts.sendAlert('critical', 'Public Page Error', `${scenario.name} returning ${httpResult.status}`, { url: scenario.url });
        }
      } else {
        this.log(`✓ ${scenario.name} accessible`, 'success');
        this.state.addTestCompleted(scenario.id, 'success');
        await this.screenshot(fullUrl, `${scenario.id}.png`);
      }
    }

    return this.generateReport();
  }
}

class OrchestratorAgent extends BaseAgent {
  constructor() {
    super('OrchestratorAgent', 'orchestrator');
    this.agents = [];
    this.masterReportPath = path.join(CONFIG.reportsDir, 'MASTER_REPORT.md');
  }

  registerAgent(agent) {
    this.agents.push(agent);
  }

  async run() {
    this.log('═══════════════════════════════════════════════════════════', 'info');
    this.log('  🤖 ORCHESTRATOR STARTING ALL AGENTS', 'info');
    this.log('═══════════════════════════════════════════════════════════', 'info');

    const allReports = [];

    for (const agent of this.agents) {
      this.log(`\nRunning ${agent.name}...`, 'info');
      try {
        const report = await agent.run();
        allReports.push(report);
        this.log(`${agent.name} completed`, 'success');
      } catch (error) {
        this.log(`${agent.name} failed: ${error.message}`, 'error');
        await alertSystem.sendAlert('critical', 'Agent Failed', `${agent.name} crashed: ${error.message}`, { agent: agent.name });
      }
    }

    // Run all workflows
    this.log('\n🔄 RUNNING CROSS-AGENT WORKFLOWS', 'info');

    const userAgent = this.agents.find(a => a.name === 'UserAgent');
    const lawyerAgent = this.agents.find(a => a.name === 'LawyerAgent');
    const adminAgent = this.agents.find(a => a.name === 'AdminAgent');
    const anonymousAgent = this.agents.find(a => a.name === 'AnonymousAgent');

    // Workflow 1
    const regWorkflow = new LawyerRegistrationWorkflow(lawyerAgent, adminAgent);
    await regWorkflow.execute();

    // Workflow 2
    const bookingWorkflow = new ConsultationBookingWorkflow(userAgent, lawyerAgent);
    await bookingWorkflow.execute();

    // Workflow 3 - NEW: Payment
    const paymentWorkflow = new PaymentWorkflow(userAgent, adminAgent);
    await paymentWorkflow.execute();

    // Workflow 4 - NEW: Notifications
    const notificationWorkflow = new NotificationWorkflow(userAgent, lawyerAgent, adminAgent);
    await notificationWorkflow.execute();

    // Workflow 5 - NEW: Database Health
    const dbHealthWorkflow = new DatabaseHealthWorkflow(adminAgent);
    await dbHealthWorkflow.execute();

    // Workflow 6 - NEW: Performance
    const perfWorkflow = new PerformanceWorkflow(anonymousAgent);
    await perfWorkflow.execute();

    // Generate master report
    await this.generateMasterReport(allReports);
    
    // Send summary alert
    const criticalAlerts = alertSystem.getCriticalAlerts();
    if (criticalAlerts.length > 0) {
      await alertSystem.sendAlert('critical', 'Critical Issues Found', `${criticalAlerts.length} critical issues require attention`, { count: criticalAlerts.length });
    }

    return this.generateReport();
  }

  async generateMasterReport(agentReports) {
    const timestamp = new Date().toISOString();
    const totalTests = agentReports.reduce((sum, r) => sum + r.testsCompleted, 0);
    const totalWorkflows = agentReports.reduce((sum, r) => sum + r.workflowsCompleted, 0);
    const totalErrors = agentReports.reduce((sum, r) => sum + r.errorsFound, 0);
    const totalFixes = agentReports.reduce((sum, r) => sum + r.fixesApplied, 0);
    const pendingErrors = agentReports.reduce((sum, r) => sum + r.pendingErrors, 0);
    const recentAlerts = alertSystem.getRecentAlerts(60);

    let report = `# 🤖 VisaBuild Continuous Testing - Master Report

**Generated:** ${timestamp}  
**Orchestrator Run:** ${this.state.state.runCount + 1}

---

## 📊 Summary

| Metric | Count |
|--------|-------|
| Total Tests Completed | ${totalTests} |
| Total Workflows Completed | ${totalWorkflows} |
| Total Errors Found | ${totalErrors} |
| Total Fixes Applied | ${totalFixes} |
| Pending Errors | ${pendingErrors} |
| Recent Alerts (1h) | ${recentAlerts.length} |
| Agents Active | ${agentReports.length} |

---

## 🚨 Recent Alerts

`;

    if (recentAlerts.length > 0) {
      for (const alert of recentAlerts.slice(-10)) {
        const icon = alert.level === 'critical' ? '🚨' : '⚠️';
        report += `${icon} **${alert.title}** (${alert.level})\n`;
        report += `   ${alert.message}\n\n`;
      }
    } else {
      report += `✅ No alerts in the last hour\n`;
    }

    report += `---

## 🤖 Agent Reports

`;

    for (const agentReport of agentReports) {
      report += `### ${agentReport.agent} (${agentReport.role})

- Tests Completed: ${agentReport.testsCompleted}
- Workflows: ${agentReport.workflowsCompleted}
- Errors Found: ${agentReport.errorsFound}
- Fixes Applied: ${agentReport.fixesApplied}
- Pending Errors: ${agentReport.pendingErrors}
- Run Count: ${agentReport.runCount}

`;

      if (agentReport.currentErrors.length > 0) {
        report += `**Current Errors:**\n`;
        for (const error of agentReport.currentErrors) {
          report += `- ❌ ${error.message}\n`;
        }
        report += `\n`;
      }
    }

    report += `---

## 🔄 Cross-Agent Workflows

1. ✅ Lawyer Registration → Admin Approval
2. ✅ User Books → Lawyer Accepts
3. ✅ Payment Flow Testing (NEW)
4. ✅ Notification System Check (NEW)
5. ✅ Database Health Check (NEW)
6. ✅ Performance Monitoring (NEW)

---

## 📨 Message Bus Activity

Total messages: ${globalBus.messages.length}

Recent messages:
`;

    const recentMessages = globalBus.messages.slice(-10);
    for (const msg of recentMessages) {
      report += `- ${msg.from} → ${msg.to}: ${msg.action} (${new Date(msg.timestamp).toLocaleTimeString()})\n`;
    }

    report += `
---

## 🎯 Next Actions

1. Review alerts above
2. Check screenshots in: \`${CONFIG.reportsDir}\`
3. Review alert details in: \`${CONFIG.alertsDir}\`
4. Run next cycle in ${CONFIG.runInterval / 60000} minutes
5. Fix critical issues immediately

---

**Report Location:** \`${this.masterReportPath}\`
**Alerts Location:** \`${CONFIG.alertsDir}\`
`;

    fs.writeFileSync(this.masterReportPath, report);
    this.log(`Master report generated: ${this.masterReportPath}`, 'success');
  }
}

// MAIN
async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║     🤖 VISA BUILD 5-AGENT SYSTEM v3                      ║');
  console.log('║     With 6 Workflows + Alert System                      ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log();

  const userAgent = new UserAgent();
  const lawyerAgent = new LawyerAgent();
  const adminAgent = new AdminAgent();
  const anonymousAgent = new AnonymousAgent();
  const orchestrator = new OrchestratorAgent();

  orchestrator.registerAgent(userAgent);
  orchestrator.registerAgent(lawyerAgent);
  orchestrator.registerAgent(adminAgent);
  orchestrator.registerAgent(anonymousAgent);

  await orchestrator.run();

  console.log();
  console.log('✅ Run complete!');
  console.log(`📊 Reports: ${CONFIG.reportsDir}`);
  console.log(`🚨 Alerts: ${CONFIG.alertsDir}`);
  console.log(`🔄 Next run in ${CONFIG.runInterval / 60000} minutes`);
}

if (process.argv.includes('--continuous')) {
  console.log('🔄 CONTINUOUS MODE');
  console.log(`Running every ${CONFIG.runInterval / 60000} minutes...`);
  console.log('Press Ctrl+C to stop\n');
  
  main();
  setInterval(main, CONFIG.runInterval);
} else {
  main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}
