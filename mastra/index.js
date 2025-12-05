// ========================================
// Mastra Configuration - Orquestração de Agentes
// ========================================

import { Mastra } from '@mastra/core/mastra';
import { ConsoleLogger } from '@mastra/core/logger';

// Agents
import { taskEnhancerAgent as originalTaskEnhancer } from './agents/task-enhancer.js';
import { promptGeneratorAgent } from './agents/prompt-generator-agent.js';
import { taskEnricherAgent } from './agents/task-enricher-agent.js';
import { taskCreatorAgent } from './agents/task-creator-agent.js';

// Tools
import { readProjectFiles } from './tools/read-project-files.js';
import { readTask } from './tools/read-task.js';
import { readMilestones } from './tools/read-milestones.js';
import { listProjectStructure } from './tools/list-project-structure.js';

export const mastra = new Mastra({
  agents: {
    taskEnhancer: originalTaskEnhancer, // Agente original (ainda em uso)
    promptGenerator: promptGeneratorAgent,
    taskEnricher: taskEnricherAgent,
    taskCreator: taskCreatorAgent,
  },
  tools: {
    readProjectFiles,
    readTask,
    readMilestones,
    listProjectStructure,
  },
  logger: new ConsoleLogger(),
});

// Exports individuais (backwards compatibility)
export { originalTaskEnhancer as taskEnhancerAgent };
export { promptGeneratorAgent, taskEnricherAgent, taskCreatorAgent };
export { readProjectFiles, readTask, readMilestones, listProjectStructure };
