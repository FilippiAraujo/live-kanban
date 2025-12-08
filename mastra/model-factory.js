import { openai } from '@ai-sdk/openai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

/**
 * Resolve modelo (OpenAI, OpenRouter ou compat) com fallback seguro.
 * - Se existir OPENROUTER_API_KEY, usa openai-compatible (chat.completions compatível).
 * - DeepSeek/Anthropic/X.ai usam openai-compatible com bases específicas.
 * - OpenAI direto usa openai() (rota responses) com fallback para gpt-4o se for gpt-5*.
 */
export function resolveModel({ preferredModel, defaultModel = 'gpt-4o' } = {}) {
  const envModel = preferredModel || process.env.OPENAI_MODEL || defaultModel;
  let modelId = process.env.OPENROUTER_MODEL || envModel;
  const providerPrefix = modelId.split('/')[0];

  const PROVIDER_BASE = {
    deepseek: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
    anthropic: process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com',
    xai: process.env.XAI_BASE_URL || 'https://api.x.ai',
  };

  // 1) OpenRouter: chat.completions compat (suporta deepseek/claude/etc.)
  if (process.env.OPENROUTER_API_KEY) {
    const client = createOpenAICompatible({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
      headers: {
        'HTTP-Referer': process.env.OPENROUTER_HTTP_REFERER || 'http://localhost',
        'X-Title': process.env.OPENROUTER_APP_TITLE || 'live-kanban',
      },
    });
    return client.chatModel(modelId);
  }

  // 2) Provedores compatíveis (DeepSeek, Anthropic, X.ai/Grok)
  if (providerPrefix !== 'openai') {
    const baseURL = PROVIDER_BASE[providerPrefix] || process.env.OPENAI_COMPAT_BASE_URL;
    const apiKey =
      (providerPrefix === 'deepseek' && process.env.DEEPSEEK_API_KEY) ||
      (providerPrefix === 'anthropic' && process.env.ANTHROPIC_API_KEY) ||
      (providerPrefix === 'xai' && process.env.XAI_API_KEY) ||
      process.env.OPENAI_API_KEY; // fallback

    if (!baseURL || !apiKey) {
      throw new Error('Faltam BASE_URL ou API_KEY para provedor compatível');
    }

    const client = createOpenAICompatible({
      apiKey,
      baseURL,
    });
    return client.chatModel(modelId);
  }

  // 3) OpenAI: se for gpt-5*, use chat.completions (openai-compatible) para tool-calls legacy.
  if (modelId.includes('gpt-5')) {
    const client = createOpenAICompatible({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_COMPAT_BASE_URL || 'https://api.openai.com/v1',
    });
    return client.chatModel(modelId);
  }

  // OpenAI responses (gpt-4o/mini, etc.)
  return openai(modelId);
}
