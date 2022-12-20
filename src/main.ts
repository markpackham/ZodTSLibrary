// Whilst Zod can be used with JS it's really aimed for use with TypeScript
// Zod is a validation library with helpful errors & things like .infer
import {z} from "zod";

const UserSchema = z.object({
  username: z.string()
})

type User = z.infer<typeof UserSchema>;

const user = {username: "123"}

console.log(UserSchema.parse(user))
// safeParse gives a true or false response if succesful, handy for form validation
console.log(UserSchema.safeParse(user))