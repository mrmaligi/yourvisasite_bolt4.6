export function TestPage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Deployment Test Page</h1>
      <p>If you see this, the new deployment is working!</p>
      <p>Timestamp: {new Date().toISOString()}</p>
    </div>
  );
}
