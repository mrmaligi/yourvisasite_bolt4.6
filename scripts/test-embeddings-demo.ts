/**
 * Embeddings Test - Demonstration
 * Shows how embeddings work for visa-related content
 */

// Mock embeddings (normally these would come from OpenAI API)
// Each array represents a 1536-dimensional vector (simplified to 10 for demo)
const mockEmbeddings: Record<string, number[]> = {
  "Australian visa application process": [0.23, -0.15, 0.88, 0.12, -0.44, 0.67, 0.33, -0.21, 0.55, 0.91],
  "Skilled independent visa subclass 189": [0.25, -0.12, 0.85, 0.15, -0.42, 0.69, 0.35, -0.18, 0.52, 0.89],
  "Partner visa processing times": [0.18, -0.08, 0.45, 0.22, -0.33, 0.55, 0.28, -0.15, 0.48, 0.72],
  "Migration lawyer consultation": [-0.12, 0.25, 0.35, 0.55, -0.28, 0.42, 0.15, -0.08, 0.33, 0.65],
  "Student visa requirements": [0.15, -0.05, 0.42, 0.18, -0.25, 0.48, 0.22, -0.12, 0.38, 0.68],
  "Work visa sponsorship": [0.22, -0.18, 0.75, 0.08, -0.38, 0.62, 0.31, -0.25, 0.45, 0.82],
};

function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function findSimilarDocuments(query: string, topK: number = 3): { text: string; score: number }[] {
  const queryEmbedding = mockEmbeddings[query];
  
  if (!queryEmbedding) {
    console.error(`❌ Query "${query}" not found in mock database`);
    return [];
  }
  
  const similarities = Object.entries(mockEmbeddings)
    .filter(([text]) => text !== query)
    .map(([text, embedding]) => ({
      text,
      score: cosineSimilarity(queryEmbedding, embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
  
  return similarities;
}

function runEmbeddingTests() {
  console.log('🧪 Embeddings Test - Visa Content Similarity\n');
  console.log('='.repeat(60));
  
  // Test 1: Show all embeddings
  console.log('\n📊 Available Documents:\n');
  Object.keys(mockEmbeddings).forEach((doc, i) => {
    console.log(`  ${i + 1}. ${doc}`);
  });
  
  // Test 2: Compare similar documents
  console.log('\n\n📊 Test 1: Similar Document Comparison\n');
  const similarPairs = [
    ["Australian visa application process", "Skilled independent visa subclass 189"],
    ["Australian visa application process", "Partner visa processing times"],
    ["Skilled independent visa subclass 189", "Work visa sponsorship"],
  ];
  
  similarPairs.forEach(([doc1, doc2]) => {
    const similarity = cosineSimilarity(mockEmbeddings[doc1], mockEmbeddings[doc2]);
    console.log(`Similarity:`);
    console.log(`  A: "${doc1}"`);
    console.log(`  B: "${doc2}"`);
    console.log(`  Score: ${(similarity * 100).toFixed(1)}% ${similarity > 0.8 ? '🔥 High' : similarity > 0.5 ? '➡️ Medium' : '💤 Low'}`);
    console.log();
  });
  
  // Test 3: Semantic search
  console.log('\n📊 Test 2: Semantic Search\n');
  
  const searchQueries = [
    "Australian visa application process",
    "Skilled independent visa subclass 189",
    "Migration lawyer consultation"
  ];
  
  searchQueries.forEach(query => {
    console.log(`Query: "${query}"\n`);
    const results = findSimilarDocuments(query, 3);
    
    console.log('Top matches:');
    results.forEach((result, i) => {
      const bar = '█'.repeat(Math.round(result.score * 20));
      console.log(`  ${i + 1}. ${result.text}`);
      console.log(`     Score: ${(result.score * 100).toFixed(1)}% ${bar}`);
    });
    console.log();
  });
  
  // Test 4: Explain embeddings
  console.log('\n📊 Test 3: Understanding Embeddings\n');
  console.log(`
What are embeddings?
--------------------
Embeddings convert text into high-dimensional vectors (1536 numbers
for OpenAI's text-embedding-3-small). Similar texts have vectors
that point in similar directions.

Use cases for VisaBuild:
------------------------
1. Semantic Search: Find similar visa cases by meaning, not keywords
2. Clustering: Group similar visa applications automatically
3. Recommendations: Suggest similar visa types based on profile
4. Anomaly Detection: Flag unusual visa processing patterns

Example in your app:
--------------------
- User searches "how long for partner visa"
- System finds embeddings for "Partner visa processing times"
- Returns relevant results even with different wording
  `);
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Embeddings demonstration complete!');
}

// Run the tests
runEmbeddingTests();

export { cosineSimilarity, findSimilarDocuments, mockEmbeddings };
