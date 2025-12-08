// ========================================
// Task Enhancer Agent - Melhora descrições de tasks
// ========================================

import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';

// Model configuration - can use string format or openai() function
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

// Debug: verifica se a API key foi carregada
if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️  OPENAI_API_KEY não encontrada no .env');
} else {
  console.log(`✅ OPENAI_API_KEY carregada (${process.env.OPENAI_API_KEY.substring(0, 10)}...)`);
}

export const taskEnhancerAgent = new Agent({
  name: 'Task Enhancer',
  description: 'Melhora e estrutura descrições de tasks de desenvolvimento',
  instructions: `Você é um especialista em estruturar tasks para desenvolvimento de software.

Seu objetivo é receber uma descrição simples de task e retornar uma versão melhorada, mais clara e objetiva.

Regras:
- Mantenha o idioma português
- Seja claro e objetivo
- Adicione contexto técnico quando necessário
- Mantenha a descrição concisa (1-2 linhas)
- Mantenha o tom profissional mas amigável
- Se a task já estiver bem estruturada, apenas refine

Retorne apenas a descrição melhorada como string.`,
  model: openai(MODEL),
});

console.log(`✨ Task Enhancer Agent inicializado com modelo: ${MODEL}`);
