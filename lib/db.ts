import { prisma } from "./prisma"

export const db = prisma

export type { User, Workflow, WorkflowRun, NodeRun } from "@prisma/client"
