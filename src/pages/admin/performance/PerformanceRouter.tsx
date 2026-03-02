import { lazy } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { PerformanceLayout } from './PerformanceLayout';
import { PerformanceDashboard } from './PerformanceDashboard';
import { Card, CardBody } from '../../../components/ui/Card';

function CategoryLanding({ title, items }: { title: string, items: { path: string, name: string, desc: string }[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{title}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link key={item.path} to={item.path}>
            <Card className="h-full hover:border-primary-500 transition-colors cursor-pointer">
              <CardBody className="p-6">
                <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-2">{item.name}</h3>
                <p className="text-sm text-neutral-500">{item.desc}</p>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

const RealTimeTraffic = lazy(() => import('./monitoring/RealTimeTraffic').then(m => ({ default: m.RealTimeTraffic })));
const ServerHealth = lazy(() => import('./monitoring/ServerHealth').then(m => ({ default: m.ServerHealth })));
const DatabasePerformance = lazy(() => import('./monitoring/DatabasePerformance').then(m => ({ default: m.DatabasePerformance })));
const APILatency = lazy(() => import('./monitoring/APILatency').then(m => ({ default: m.APILatency })));
const ErrorLogs = lazy(() => import('./monitoring/ErrorLogs').then(m => ({ default: m.ErrorLogs })));
const UserSessions = lazy(() => import('./monitoring/UserSessions').then(m => ({ default: m.UserSessions })));
const PageLoadTimes = lazy(() => import('./monitoring/PageLoadTimes').then(m => ({ default: m.PageLoadTimes })));
const ResourceUsage = lazy(() => import('./monitoring/ResourceUsage').then(m => ({ default: m.ResourceUsage })));
const NetworkRequests = lazy(() => import('./monitoring/NetworkRequests').then(m => ({ default: m.NetworkRequests })));
const CacheHitRate = lazy(() => import('./monitoring/CacheHitRate').then(m => ({ default: m.CacheHitRate })));
const CDNStatus = lazy(() => import('./monitoring/CDNStatus').then(m => ({ default: m.CDNStatus })));
const IntegrationStatus = lazy(() => import('./monitoring/IntegrationStatus').then(m => ({ default: m.IntegrationStatus })));
const SecurityAlerts = lazy(() => import('./monitoring/SecurityAlerts').then(m => ({ default: m.SecurityAlerts })));
const AuditLogs = lazy(() => import('./monitoring/AuditLogs').then(m => ({ default: m.AuditLogs })));
const BusinessMetrics = lazy(() => import('./monitoring/BusinessMetrics').then(m => ({ default: m.BusinessMetrics })));
const ImageCompressor = lazy(() => import('./optimization/ImageCompressor').then(m => ({ default: m.ImageCompressor })));
const DatabaseAnalyzer = lazy(() => import('./optimization/DatabaseAnalyzer').then(m => ({ default: m.DatabaseAnalyzer })));
const QueryOptimizer = lazy(() => import('./optimization/QueryOptimizer').then(m => ({ default: m.QueryOptimizer })));
const AssetMinifier = lazy(() => import('./optimization/AssetMinifier').then(m => ({ default: m.AssetMinifier })));
const CacheManager = lazy(() => import('./optimization/CacheManager').then(m => ({ default: m.CacheManager })));
const SEOAnalyzer = lazy(() => import('./optimization/SEOAnalyzer').then(m => ({ default: m.SEOAnalyzer })));
const BundleAnalyzer = lazy(() => import('./optimization/BundleAnalyzer').then(m => ({ default: m.BundleAnalyzer })));
const DeadCodeDetector = lazy(() => import('./optimization/DeadCodeDetector').then(m => ({ default: m.DeadCodeDetector })));
const MemoryLeakDetector = lazy(() => import('./optimization/MemoryLeakDetector').then(m => ({ default: m.MemoryLeakDetector })));
const NetworkThrottler = lazy(() => import('./optimization/NetworkThrottler').then(m => ({ default: m.NetworkThrottler })));
const UnitTests = lazy(() => import('./testing/UnitTests').then(m => ({ default: m.UnitTests })));
const IntegrationTests = lazy(() => import('./testing/IntegrationTests').then(m => ({ default: m.IntegrationTests })));
const E2EStatus = lazy(() => import('./testing/E2EStatus').then(m => ({ default: m.E2EStatus })));
const LoadTesting = lazy(() => import('./testing/LoadTesting').then(m => ({ default: m.LoadTesting })));
const StressTesting = lazy(() => import('./testing/StressTesting').then(m => ({ default: m.StressTesting })));
const APITester = lazy(() => import('./testing/APITester').then(m => ({ default: m.APITester })));
const ComponentPlayground = lazy(() => import('./testing/ComponentPlayground').then(m => ({ default: m.ComponentPlayground })));
const AccessibilityTester = lazy(() => import('./testing/AccessibilityTester').then(m => ({ default: m.AccessibilityTester })));
const BrowserCompatibility = lazy(() => import('./testing/BrowserCompatibility').then(m => ({ default: m.BrowserCompatibility })));
const ResponsivenessChecker = lazy(() => import('./testing/ResponsivenessChecker').then(m => ({ default: m.ResponsivenessChecker })));
const APIReference = lazy(() => import('./docs/APIReference').then(m => ({ default: m.APIReference })));
const ComponentLibrary = lazy(() => import('./docs/ComponentLibrary').then(m => ({ default: m.ComponentLibrary })));
const DatabaseSchema = lazy(() => import('./docs/DatabaseSchema').then(m => ({ default: m.DatabaseSchema })));
const Architecture = lazy(() => import('./docs/Architecture').then(m => ({ default: m.Architecture })));
const DeploymentGuide = lazy(() => import('./docs/DeploymentGuide').then(m => ({ default: m.DeploymentGuide })));
const SecurityPolicy = lazy(() => import('./docs/SecurityPolicy').then(m => ({ default: m.SecurityPolicy })));
const CodingStandards = lazy(() => import('./docs/CodingStandards').then(m => ({ default: m.CodingStandards })));
const ContributionGuide = lazy(() => import('./docs/ContributionGuide').then(m => ({ default: m.ContributionGuide })));
const Troubleshooting = lazy(() => import('./docs/Troubleshooting').then(m => ({ default: m.Troubleshooting })));
const Onboarding = lazy(() => import('./docs/Onboarding').then(m => ({ default: m.Onboarding })));
const FeatureFlags = lazy(() => import('./docs/FeatureFlags').then(m => ({ default: m.FeatureFlags })));
const EnvironmentVariables = lazy(() => import('./docs/EnvironmentVariables').then(m => ({ default: m.EnvironmentVariables })));
const ThirdPartyServices = lazy(() => import('./docs/ThirdPartyServices').then(m => ({ default: m.ThirdPartyServices })));
const UserRoles = lazy(() => import('./docs/UserRoles').then(m => ({ default: m.UserRoles })));
const ReleaseNotes = lazy(() => import('./docs/ReleaseNotes').then(m => ({ default: m.ReleaseNotes })));

export function PerformanceRouter() {
  return (
    <Routes>
      <Route element={<PerformanceLayout />}>
        <Route index element={<PerformanceDashboard />} />
        <Route path="monitoring" element={<CategoryLanding title="Monitoring" items={[{ path: 'real-time-traffic', name: 'Real Time Traffic', desc: "Monitor real-time traffic statistics and active users." }, { path: 'server-health', name: 'Server Health', desc: "Track server uptime, CPU, and memory usage." }, { path: 'database-performance', name: 'Database Performance', desc: "Analyze database query performance and latency." }, { path: 'a-p-i-latency', name: 'A P I Latency', desc: "Monitor API response times and endpoint health." }, { path: 'error-logs', name: 'Error Logs', desc: "View and analyze system error logs." }, { path: 'user-sessions', name: 'User Sessions', desc: "Track active user sessions and session duration." }, { path: 'page-load-times', name: 'Page Load Times', desc: "Analyze page load times across different devices." }, { path: 'resource-usage', name: 'Resource Usage', desc: "Monitor resource consumption trends." }, { path: 'network-requests', name: 'Network Requests', desc: "Inspect network requests and bandwidth usage." }, { path: 'cache-hit-rate', name: 'Cache Hit Rate', desc: "Analyze cache hit/miss rates for better performance." }, { path: 'c-d-n-status', name: 'C D N Status', desc: "Monitor Content Delivery Network status and latency." }, { path: 'integration-status', name: 'Integration Status', desc: "Check the status of third-party integrations." }, { path: 'security-alerts', name: 'Security Alerts', desc: "View security alerts and potential threats." }, { path: 'audit-logs', name: 'Audit Logs', desc: "Review system audit logs for compliance." }, { path: 'business-metrics', name: 'Business Metrics', desc: "Track key business performance indicators." }]} />} />
        <Route path="optimization" element={<CategoryLanding title="Optimization" items={[{ path: 'image-compressor', name: 'Image Compressor', desc: "Tool to compress and optimize images." }, { path: 'database-analyzer', name: 'Database Analyzer', desc: "Analyze database schema and indexes." }, { path: 'query-optimizer', name: 'Query Optimizer', desc: "Optimize slow database queries." }, { path: 'asset-minifier', name: 'Asset Minifier', desc: "Minify CSS and JavaScript assets." }, { path: 'cache-manager', name: 'Cache Manager', desc: "Manage and clear system caches." }, { path: 's-e-o-analyzer', name: 'S E O Analyzer', desc: "Analyze pages for SEO performance." }, { path: 'bundle-analyzer', name: 'Bundle Analyzer', desc: "Visualize and analyze application bundle size." }, { path: 'dead-code-detector', name: 'Dead Code Detector', desc: "Identify unused code and dependencies." }, { path: 'memory-leak-detector', name: 'Memory Leak Detector', desc: "Detect potential memory leaks in the application." }, { path: 'network-throttler', name: 'Network Throttler', desc: "Simulate network conditions for testing." }]} />} />
        <Route path="testing" element={<CategoryLanding title="Testing" items={[{ path: 'unit-tests', name: 'Unit Tests', desc: "Run and view unit test results." }, { path: 'integration-tests', name: 'Integration Tests', desc: "Run and view integration test results." }, { path: 'e2-e-status', name: 'E2 E Status', desc: "Check the status of End-to-End tests." }, { path: 'load-testing', name: 'Load Testing', desc: "Perform load testing on the application." }, { path: 'stress-testing', name: 'Stress Testing', desc: "Perform stress testing to find breaking points." }, { path: 'a-p-i-tester', name: 'A P I Tester', desc: "Test API endpoints directly from the dashboard." }, { path: 'component-playground', name: 'Component Playground', desc: "Interactive playground for UI components." }, { path: 'accessibility-tester', name: 'Accessibility Tester', desc: "Check pages for accessibility compliance." }, { path: 'browser-compatibility', name: 'Browser Compatibility', desc: "Verify compatibility across different browsers." }, { path: 'responsiveness-checker', name: 'Responsiveness Checker', desc: "Check page responsiveness on various devices." }]} />} />
        <Route path="docs" element={<CategoryLanding title="Docs" items={[{ path: 'a-p-i-reference', name: 'A P I Reference', desc: "Comprehensive API documentation." }, { path: 'component-library', name: 'Component Library', desc: "Documentation for the UI component library." }, { path: 'database-schema', name: 'Database Schema', desc: "Detailed database schema documentation." }, { path: 'architecture', name: 'Architecture', desc: "System architecture overview." }, { path: 'deployment-guide', name: 'Deployment Guide', desc: "Guide for deploying the application." }, { path: 'security-policy', name: 'Security Policy', desc: "Security policies and procedures." }, { path: 'coding-standards', name: 'Coding Standards', desc: "Coding standards and best practices." }, { path: 'contribution-guide', name: 'Contribution Guide', desc: "Guide for contributing to the project." }, { path: 'troubleshooting', name: 'Troubleshooting', desc: "Common issues and troubleshooting steps." }, { path: 'onboarding', name: 'Onboarding', desc: "Onboarding checklist for new developers." }, { path: 'feature-flags', name: 'Feature Flags', desc: "Documentation for feature flags." }, { path: 'environment-variables', name: 'Environment Variables', desc: "List of required environment variables." }, { path: 'third-party-services', name: 'Third Party Services', desc: "Documentation for third-party services." }, { path: 'user-roles', name: 'User Roles', desc: "Explanation of user roles and permissions." }, { path: 'release-notes', name: 'Release Notes', desc: "Changelog and release notes." }]} />} />
        <Route path="monitoring/real-time-traffic" element={<RealTimeTraffic />} />
        <Route path="monitoring/server-health" element={<ServerHealth />} />
        <Route path="monitoring/database-performance" element={<DatabasePerformance />} />
        <Route path="monitoring/a-p-i-latency" element={<APILatency />} />
        <Route path="monitoring/error-logs" element={<ErrorLogs />} />
        <Route path="monitoring/user-sessions" element={<UserSessions />} />
        <Route path="monitoring/page-load-times" element={<PageLoadTimes />} />
        <Route path="monitoring/resource-usage" element={<ResourceUsage />} />
        <Route path="monitoring/network-requests" element={<NetworkRequests />} />
        <Route path="monitoring/cache-hit-rate" element={<CacheHitRate />} />
        <Route path="monitoring/c-d-n-status" element={<CDNStatus />} />
        <Route path="monitoring/integration-status" element={<IntegrationStatus />} />
        <Route path="monitoring/security-alerts" element={<SecurityAlerts />} />
        <Route path="monitoring/audit-logs" element={<AuditLogs />} />
        <Route path="monitoring/business-metrics" element={<BusinessMetrics />} />
        <Route path="optimization/image-compressor" element={<ImageCompressor />} />
        <Route path="optimization/database-analyzer" element={<DatabaseAnalyzer />} />
        <Route path="optimization/query-optimizer" element={<QueryOptimizer />} />
        <Route path="optimization/asset-minifier" element={<AssetMinifier />} />
        <Route path="optimization/cache-manager" element={<CacheManager />} />
        <Route path="optimization/s-e-o-analyzer" element={<SEOAnalyzer />} />
        <Route path="optimization/bundle-analyzer" element={<BundleAnalyzer />} />
        <Route path="optimization/dead-code-detector" element={<DeadCodeDetector />} />
        <Route path="optimization/memory-leak-detector" element={<MemoryLeakDetector />} />
        <Route path="optimization/network-throttler" element={<NetworkThrottler />} />
        <Route path="testing/unit-tests" element={<UnitTests />} />
        <Route path="testing/integration-tests" element={<IntegrationTests />} />
        <Route path="testing/e2-e-status" element={<E2EStatus />} />
        <Route path="testing/load-testing" element={<LoadTesting />} />
        <Route path="testing/stress-testing" element={<StressTesting />} />
        <Route path="testing/a-p-i-tester" element={<APITester />} />
        <Route path="testing/component-playground" element={<ComponentPlayground />} />
        <Route path="testing/accessibility-tester" element={<AccessibilityTester />} />
        <Route path="testing/browser-compatibility" element={<BrowserCompatibility />} />
        <Route path="testing/responsiveness-checker" element={<ResponsivenessChecker />} />
        <Route path="docs/a-p-i-reference" element={<APIReference />} />
        <Route path="docs/component-library" element={<ComponentLibrary />} />
        <Route path="docs/database-schema" element={<DatabaseSchema />} />
        <Route path="docs/architecture" element={<Architecture />} />
        <Route path="docs/deployment-guide" element={<DeploymentGuide />} />
        <Route path="docs/security-policy" element={<SecurityPolicy />} />
        <Route path="docs/coding-standards" element={<CodingStandards />} />
        <Route path="docs/contribution-guide" element={<ContributionGuide />} />
        <Route path="docs/troubleshooting" element={<Troubleshooting />} />
        <Route path="docs/onboarding" element={<Onboarding />} />
        <Route path="docs/feature-flags" element={<FeatureFlags />} />
        <Route path="docs/environment-variables" element={<EnvironmentVariables />} />
        <Route path="docs/third-party-services" element={<ThirdPartyServices />} />
        <Route path="docs/user-roles" element={<UserRoles />} />
        <Route path="docs/release-notes" element={<ReleaseNotes />} />
      </Route>
    </Routes>
  );
}
