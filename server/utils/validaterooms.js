const { z } = require('zod');

const createRoomSchema = z.object({
  roomId: z
    .string()
    .regex(
      /^[a-zA-Z0-9]{3}-[a-zA-Z0-9]{3}-[a-zA-Z0-9]{3}$/,
      'Room ID must be in the format xxx-xxx-xxx with alphanumeric characters only'
    ),
  participants: z.array(z.string()),
  started_at: z.date().optional(),
  ended_at: z.date().nullable().optional(),
  host:z.string(),
  duration: z.number().min(0, 'Duration must be a non-negative number'),
});
const validateRoomSchema=z.object({
  roomId: z
    .string()
    .regex(
      /^[a-zA-Z0-9]{3}-[a-zA-Z0-9]{3}-[a-zA-Z0-9]{3}$/,
      'Room ID must be in the format xxx-xxx-xxx with alphanumeric characters only'
    )
})
const endCallSchema=z.object({
  roomId: z
    .string()
    .regex(
      /^[a-zA-Z0-9]{3}-[a-zA-Z0-9]{3}-[a-zA-Z0-9]{3}$/,
      'Room ID must be in the format xxx-xxx-xxx with alphanumeric characters only'
    ),
      duration: z.number().min(0, 'Duration must be a non-negative number'),
})

module.exports ={createRoomSchema,endCallSchema,validateRoomSchema};
