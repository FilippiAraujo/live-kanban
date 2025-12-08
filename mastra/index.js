// ========================================
// Mastra Configuration - Orquestração de Agentes
// ========================================

import './env.js';
import { Mastra } from '@mastra/core';

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
import { exploreCodebase } from './tools/explore-codebase.js';
import { readProjectMap } from './tools/read-project-map.js';

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
    exploreCodebase,
    readProjectMap,
  },
});

// Exports individuais (backwards compatibility)
export { originalTaskEnhancer as taskEnhancerAgent };
export { promptGeneratorAgent, taskEnricherAgent, taskCreatorAgent };
export { readProjectFiles, readTask, readMilestones, listProjectStructure, exploreCodebase, readProjectMap };
