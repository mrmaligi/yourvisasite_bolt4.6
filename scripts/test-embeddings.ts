/**
 * Embeddings Test Script
 * Tests OpenAI embeddings API integration
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface EmbeddingTest {
  text: string;
  expectedDimensions: number;
}

const testCases: EmbeddingTest[] = [
  { text: "Australian visa application process", expectedDimensions: 1536 },
  { text: "Skilled independent visa subclass 189", expectedDimensions: 1536 },
  { text: "Partner visa processing times", expectedDimensions: 1536 },
  { text: "Migration lawyer consultation", expectedDimensions: 1536 },
];

async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

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

async function runTests() {
  console.log('🧪 Testing OpenAI Embeddings API\n');
  console.log('=' .repeat(50));
  
  const embeddings: { text: string; embedding: number[] }[] = [];
  
  // Test 1: Generate embeddings
  console.log('\n📊 Test 1: Generating embeddings...\n');
  for (const testCase of testCases) {
    try {
      const embedding = await generateEmbedding(testCase.text);
      embeddings.push({ text: testCase.text, embedding });
      
      console.log(`✅ "${testCase.text.substring(0, 40)}..."`);
      console.log(`   Dimensions: ${embedding.length}`);
      console.log(`   First 5 values: [${embedding.slice(0, 5).map(v => v.toFixed(4)).join(', ')}]`);
      console.log();
      
      if (embedding.length !== testCase.expectedDimensions) {
        console.error(`❌ Expected ${testCase.expectedDimensions} dimensions, got ${embedding.length}`);
      }
    } catch (error) {
      console.error(`❌ Failed to generate embedding for: ${testCase.text}`);
    }
  }
  
  // Test 2: Calculate similarities
  if (embeddings.length >= 2) {
    console.log('\n📊 Test 2: Calculating cosine similarities...\n');
    
    const similarities = [
      { 
        a: embeddings[0].text, 
        b: embeddings[1].text, 
        similarity: cosineSimilarity(embeddings[0].embedding, embeddings[1].embedding)
      },
      { 
        a: embeddings[0].text, 
        b: embeddings[2].text, 
        similarity: cosineSimilarity(embeddings[0].embedding, embeddings[2].embedding)
      },
      { 
        a: embeddings[1].text, 
        b: embeddings[3].text, 
        similarity: cosineSimilarity(embeddings[1].embedding, embeddings[3].embedding)
      },
    ];
    
    for (const sim of similarities) {
      console.log(`Similarity:`);
      console.log(`  A: "${sim.a.substring(0, 40)}..."`);
      console.log(`  B: "${sim.b.substring(0, 40)}..."`);
      console.log(`  Score: ${(sim.similarity * 100).toFixed(2)}%`);
      console.log();
    }
  }
  
  // Test 3: Search simulation
  if (embeddings.length >= 3) {
    console.log('\n📊 Test 3: Semantic search simulation...\n');
    
    const query = "How long does a 189 visa take?";
    console.log(`Query: "${query}"\n`);
    
    const queryEmbedding = await generateEmbedding(query);
    
    const results = embeddings.map(doc => ({
      text: doc.text,
      score: cosineSimilarity(queryEmbedding, doc.embedding)
    })).sort((a, b) => b.score - a.score);
    
    console.log('Results (sorted by relevance):');
    results.forEach((result, i) => {
      console.log(`${i + 1}. "${result.text.substring(0, 40)}..." (${(result.score * 100).toFixed(2)}%)`);
    });
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ Embeddings tests completed!');
}

// Run if executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

export { generateEmbedding, cosineSimilarity, runTests };
