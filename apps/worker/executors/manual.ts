export const manualTriggerHandler = async ({ userId }: { userId: string }) => {
  return {
    triggeredBy: userId,
    triggeredAt: new Date().toISOString(),
  };
};
