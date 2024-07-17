import { z } from 'zod';

export const adSchema = z.object({
    type: z.enum(['AUTO', 'STATIC','AB']),  
    value: z.string(),
});


export type ZodAd = z.infer<typeof adSchema>;
