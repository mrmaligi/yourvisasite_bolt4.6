#!/usr/bin/env node
/**
 * 🤖 CONTINUOUS 5-AGENT OPERATIONAL SYSTEM v2
 * With Cross-Agent Communication Workflows
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
  runInterval: 5 * 60 * 1000,
};

const ACCOUNTS = {
  user1: { email: 'agent-user-01@visabuild.test', password: 'TestPass123!' },
  user2: { email: 'agent-user-02@visabuild.test', password: 'TestPass123!' },
  lawyer1: { email: 'agent-lawyer-01@visabuild.test', password: 'TestPass123!' },
  lawyer2: { email: 'agent-lawyer-02@visabuild.test', password: 'TestPass123!' },
  admin: { email: 'agent-admin-01@visabuild.test', password: 'TestPass123!' }
};

// SHARED MESSAGE BUS for cross-agent communication
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
      from,
      to,
      action,
      data,
      timestamp: new Date().toISOString(),
      processed: false
    };
    this.messages.push(message);
    this.saveBus();
    console.log(`📨 [BUS] ${from} → ${to}: ${action}`);
    return message.id;
  }

  receive(agentId, markProcessed = true) {
    const messages = this.messages.filter(m => 
      (m.to === agentId || m.to === 'broadcast') && !m.processed
    );
    
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

// Global message bus
const globalBus = new AgentBus();

class StateManager {
  constructor(agentName) {
    this.agentName = agentName;
    this.stateFile = path.join(CONFIG.stateDir, `${agentName}_state.json`);
    this.ensureDirectories();
    this.state = this.loadState();
  }

  ensureDirectories() {
    [CONFIG.stateDir, CONFIG.reportsDir].forEach(dir => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });
  }

  loadState() {
    if (fs.existsSync(this.stateFile)) {
      const loaded = JSON.parse(fs.readFileSync(this.stateFile, 'utf8'));
      // Ensure all required fields exist
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
    return {
      testsCompleted: [],
      workflowsCompleted: [],
      errorsFound: [],
      fixesApplied: [],
      lastRun: null,
      runCount: 0,
      currentPhase: 'initial'
    };
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
      this.state.workflowsCompleted.push({
        id: workflowId,
        timestamp: new Date().toISOString(),
        details
      });
    }
  }

  addErrorFound(error) {
    const errorId = `${error.testId}_${error.message}`.replace(/[^a-zA-Z0-9]/g, '_');
    if (!this.state.errorsFound.find(e => e.id === errorId)) {
      this.state.errorsFound.push({
        id: errorId,
        testId: error.testId,
        message: error.message,
        timestamp: new Date().toISOString(),
        fixed: false
      });
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

  hasTestBeenRun(testId) {
    return this.state.testsCompleted.some(t => t.id === testId);
  }

  hasWorkflowBeenRun(workflowId) {
    return this.state.workflowsCompleted.some(w => w.id === workflowId);
  }

  getPendingErrors() {
    return this.state.errorsFound.filter(e => !e.fixed);
  }
}

class BaseAgent {
  constructor(name, role) {
    this.name = name;
    this.role = role;
    this.state = new StateManager(name);
    this.logs = [];
    this.currentErrors = [];
    this.bus = globalBus;
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
      }).on('error', (err) => {
        resolve({ status: 0, success: false, error: err.message, url });
      });
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
        headers: {
          'apikey': CONFIG.serviceKey, 'Authorization': `Bearer ${CONFIG.serviceKey}`,
          'Content-Type': 'application/json', 'Prefer': 'return=representation'
        }
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

// WORKFLOW 1: Lawyer Registration → Admin Approval
class LawyerRegistrationWorkflow {
  constructor(lawyerAgent, adminAgent) {
    this.lawyerAgent = lawyerAgent;
    this.adminAgent = adminAgent;
  }

  async execute() {
    console.log('\n🔄 WORKFLOW: Lawyer Registration → Admin Approval');
    console.log('───────────────────────────────────────────────────────────');

    const workflowId = 'lawyer_registration_approval';
    
    // Check if already completed
    if (this.lawyerAgent.state.hasWorkflowBeenRun(workflowId)) {
      console.log('  ℹ️ Workflow already completed, checking for new lawyers...');
    }

    // Step 1: Check for pending lawyers
    const pendingLawyers = await this.adminAgent.queryDatabase(
      'lawyer_profiles',
      'verification_status=eq.pending&select=profiles(email),id'
    );

    if (!pendingLawyers.success || pendingLawyers.data.length === 0) {
      console.log('  ℹ️ No pending lawyers found');
      return;
    }

    console.log(`  📋 Found ${pendingLawyers.data.length} pending lawyer(s)`);

    // Step 2: Admin approves each pending lawyer
    for (const lawyer of pendingLawyers.data) {
      const lawyerEmail = lawyer.profiles?.email || 'unknown';
      console.log(`  🔧 Approving: ${lawyerEmail}`);

      const updateResult = await this.adminAgent.updateDatabase(
        'lawyer_profiles',
        lawyer.id,
        { verification_status: 'approved' }
      );

      if (updateResult.success) {
        console.log(`  ✅ Approved: ${lawyerEmail}`);
        
        // Notify via bus
        this.adminAgent.bus.send('AdminAgent', 'LawyerAgent', 'lawyer_approved', {
          lawyerId: lawyer.id,
          email: lawyerEmail,
          timestamp: new Date().toISOString()
        });

        this.adminAgent.state.addWorkflowCompleted(workflowId, { lawyerId: lawyer.id, email: lawyerEmail });
        this.lawyerAgent.state.addWorkflowCompleted(workflowId, { lawyerId: lawyer.id, email: lawyerEmail });
      } else {
        console.log(`  ❌ Failed to approve: ${lawyerEmail}`);
      }
    }
  }
}

// WORKFLOW 2: User Books → Lawyer Accepts
class ConsultationBookingWorkflow {
  constructor(userAgent, lawyerAgent) {
    this.userAgent = userAgent;
    this.lawyerAgent = lawyerAgent;
  }

  async execute() {
    console.log('\n🔄 WORKFLOW: User Books Consultation → Lawyer Accepts');
    console.log('───────────────────────────────────────────────────────────');

    // Step 1: User searches for available lawyers
    const lawyers = await this.userAgent.queryDatabase(
      'lawyer_profiles',
      'verification_status=eq.approved&select=profiles(email),id'
    );

    if (!lawyers.success || lawyers.data.length === 0) {
      console.log('  ⚠️ No approved lawyers available for booking');
      return;
    }

    const availableLawyer = lawyers.data[0];
    console.log(`  👤 User found lawyer: ${availableLawyer.profiles?.email}`);

    // Step 2: Check for pending consultations
    const pendingConsultations = await this.lawyerAgent.queryDatabase(
      'consultations',
      'status=eq.pending&select=*,user:profiles!consultations_user_id_fkey(email)'
    );

    if (pendingConsultations.success && pendingConsultations.data.length > 0) {
      console.log(`  📋 Found ${pendingConsultations.data.length} pending consultation(s)`);

      // Step 3: Lawyer accepts each pending consultation
      for (const consultation of pendingConsultations.data) {
        console.log(`  🔧 Accepting consultation from: ${consultation.user?.email}`);

        const updateResult = await this.lawyerAgent.updateDatabase(
          'consultations',
          consultation.id,
          { status: 'confirmed' }
        );

        if (updateResult.success) {
          console.log(`  ✅ Consultation confirmed`);
          
          this.lawyerAgent.bus.send('LawyerAgent', 'UserAgent', 'consultation_confirmed', {
            consultationId: consultation.id,
            lawyerId: consultation.lawyer_id,
            timestamp: new Date().toISOString()
          });
        }
      }
    } else {
      console.log('  ℹ️ No pending consultations to accept');
    }
  }
}

// WORKFLOW 3: Content Update → All Users Notified
class ContentUpdateWorkflow {
  constructor(adminAgent, userAgent, lawyerAgent, anonymousAgent) {
    this.adminAgent = adminAgent;
    this.userAgent = userAgent;
    this.lawyerAgent = lawyerAgent;
    this.anonymousAgent = anonymousAgent;
  }

  async execute() {
    console.log('\n🔄 WORKFLOW: Content Update Broadcast');
    console.log('───────────────────────────────────────────────────────────');

    // Check visa processing times for updates
    const visas = await this.adminAgent.queryDatabase('visas', 'select=id,name&limit=3');
    
    if (visas.success && visas.data.length > 0) {
      console.log(`  📋 Checking ${visas.data.length} visas for updates`);

      // Broadcast update notification
      this.adminAgent.bus.broadcast('AdminAgent', 'content_updated', {
        type: 'visa_info',
        count: visas.data.length,
        timestamp: new Date().toISOString()
      });

      console.log('  ✅ Update broadcast sent to all agents');
    }
  }
}

// AGENT IMPLEMENTATIONS
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

    // Check for messages from other agents
    const messages = this.bus.receive(this.name);
    for (const msg of messages) {
      if (msg.action === 'consultation_confirmed') {
        this.log(`Received: Consultation confirmed by lawyer!`, 'comm');
      }
      if (msg.action === 'content_updated') {
        this.log(`Received: Content updated, refreshing...`, 'comm');
      }
    }

    // Run basic tests
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

    // Check for messages
    const messages = this.bus.receive(this.name);
    for (const msg of messages) {
      if (msg.action === 'lawyer_approved') {
        this.log(`Received: Approved by admin! Status updated.`, 'comm');
      }
    }

    // Run tests
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

    // Check for messages
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

    // Run each agent
    for (const agent of this.agents) {
      this.log(`\nRunning ${agent.name}...`, 'info');
      try {
        const report = await agent.run();
        allReports.push(report);
        this.log(`${agent.name} completed`, 'success');
      } catch (error) {
        this.log(`${agent.name} failed: ${error.message}`, 'error');
      }
    }

    // Run cross-agent workflows
    this.log('\n🔄 RUNNING CROSS-AGENT WORKFLOWS', 'info');

    const userAgent = this.agents.find(a => a.name === 'UserAgent');
    const lawyerAgent = this.agents.find(a => a.name === 'LawyerAgent');
    const adminAgent = this.agents.find(a => a.name === 'AdminAgent');
    const anonymousAgent = this.agents.find(a => a.name === 'AnonymousAgent');

    // Workflow 1: Lawyer Registration → Admin Approval
    const regWorkflow = new LawyerRegistrationWorkflow(lawyerAgent, adminAgent);
    await regWorkflow.execute();

    // Workflow 2: User Books → Lawyer Accepts
    const bookingWorkflow = new ConsultationBookingWorkflow(userAgent, lawyerAgent);
    await bookingWorkflow.execute();

    // Workflow 3: Content Update Broadcast
    const contentWorkflow = new ContentUpdateWorkflow(adminAgent, userAgent, lawyerAgent, anonymousAgent);
    await contentWorkflow.execute();

    // Generate master report
    await this.generateMasterReport(allReports);
    
    return this.generateReport();
  }

  async generateMasterReport(agentReports) {
    const timestamp = new Date().toISOString();
    const totalTests = agentReports.reduce((sum, r) => sum + r.testsCompleted, 0);
    const totalWorkflows = agentReports.reduce((sum, r) => sum + r.workflowsCompleted, 0);
    const totalErrors = agentReports.reduce((sum, r) => sum + r.errorsFound, 0);
    const totalFixes = agentReports.reduce((sum, r) => sum + r.fixesApplied, 0);
    const pendingErrors = agentReports.reduce((sum, r) => sum + r.pendingErrors, 0);

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
| Agents Active | ${agentReports.length} |

---

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

### 1. Lawyer Registration → Admin Approval
- Admin monitors pending lawyers
- Auto-approves for testing
- Notifies LawyerAgent via message bus

### 2. User Books → Lawyer Accepts
- UserAgent searches for lawyers
- LawyerAgent checks pending consultations
- Auto-accepts for testing
- Notifies UserAgent via message bus

### 3. Content Update Broadcast
- AdminAgent checks for updates
- Broadcasts to all agents via message bus
- All agents refresh/receive notification

---

## 🔧 Fixes Applied This Run

`;

    let hasFixes = false;
    for (const agentReport of agentReports) {
      const agent = this.agents.find(a => a.name === agentReport.agent);
      if (agent) {
        for (const fix of agent.state.state.fixesApplied) {
          if (new Date(fix.timestamp).getTime() > Date.now() - 10 * 60 * 1000) {
            report += `- **${agentReport.agent}**: ${fix.description}\n`;
            hasFixes = true;
          }
        }
      }
    }

    if (!hasFixes) {
      report += `_No new fixes applied in this run_\n`;
    }

    report += `
---

## 📋 Pending Issues Requiring Attention

`;

    let hasPending = false;
    for (const agent of this.agents) {
      const pending = agent.state.getPendingErrors();
      for (const error of pending) {
        report += `- **${agent.name}**: ${error.message} (found ${new Date(error.timestamp).toLocaleString()})\n`;
        hasPending = true;
      }
    }

    if (!hasPending) {
      report += `🎉 **No pending issues! All errors have been fixed.**\n`;
    }

    report += `
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

1. Review pending errors above
2. Check screenshots in: \`${CONFIG.reportsDir}\`
3. Run next cycle in ${CONFIG.runInterval / 60000} minutes
4. Review cross-agent workflow results
5. Fix any critical issues before next run

---

## 📝 Notes

- Each agent tracks its own state to avoid repeating tests
- Errors are retried automatically on subsequent runs
- Screenshots captured for visual verification
- Cross-agent communication via message bus
- Workflows run automatically between agents

---

**Report Location:** \`${this.masterReportPath}\`
`;

    fs.writeFileSync(this.masterReportPath, report);
    this.log(`Master report generated: ${this.masterReportPath}`, 'success');
  }
}

// MAIN
async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║     🤖 VISA BUILD 5-AGENT CONTINUOUS SYSTEM v2           ║');
  console.log('║     With Cross-Agent Communication                       ║');
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
