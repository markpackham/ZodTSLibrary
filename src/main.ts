// Whilst Zod can be used with JS it's really aimed for use with TypeScript
// Zod is a validation library with helpful errors & things like .infer
import {z} from "zod";

// the default for types is "required" hence the use of "optional"
const UserSchema = z.object({
  username: z.string(),
  age: z.number(),
  age2: z.bigint(),
  age3: z.bigint(),
  birthday: z.date().optional(),
  isProgrammer: z.boolean(),
  // null is a primitive value
  test: z.null().optional(),
  // undefined is a global property & default for types or a primitive value
  test2: z.undefined().optional(),
  // void is an operator
  test3: z.void().optional(),
  test4: z.any().optional(),
  // same as "any"
  test5: z.unknown().optional(),
  // must never be defined
  test6: z.never().optional(),
})

type User = z.infer<typeof UserSchema>;

const user = {username: "123",age:1,age2:9007199254740991n,age3:12n,isProgrammer:true}

console.log(UserSchema.parse(user))
// safeParse gives a true or false response if succesful, handy for form validation
console.log(UserSchema.safeParse(user))
console.log(UserSchema.safeParse(user).success)