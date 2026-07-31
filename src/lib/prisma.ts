import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Safe database query wrapper that catches missing/unreachable DB errors during Vercel builds
 */
export async function safeDbQuery<T>(queryFn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await queryFn();
  } catch (error) {
    console.warn("⚠️ Database query bypassed (using fallback data):", (error as any)?.message || error);
    return fallback;
  }
}
