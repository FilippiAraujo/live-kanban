// ========================================
// Mastra Configuration - Orquestração de Agentes
// ========================================

import { Mastra } from '@mastra/core/mastra';
import { ConsoleLogger } from '@mastra/core/logger';
import { taskEnhancerAgent } from './agents/task-enhancer.js';

export const mastra = new Mastra({
  agents: {
    taskEnhancer: taskEnhancerAgent,
  },
  logger: new ConsoleLogger(),
});

export { taskEnhancerAgent };
