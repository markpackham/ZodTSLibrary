// Whilst Zod can be used with JS it's really aimed for use with TypeScript
// Zod is a validation library with helpful errors & things like .infer
import {z} from "zod";

// the default for types is "required" hence the use of "optional"
const UserSchema = z.object({
  username: z.string().min(1).max(1000000),
  age: z.number().gt(0).lt(10000000),
  age2: z.bigint(),
  age3: z.bigint(),
  age4: z.number().optional().default(Math.random),
  // nullish lets you use both "null" and "undefined"
  birthday: z.date().optional().nullish(),
  isProgrammer: z.boolean().nullable().default(false),
  hobby: z.enum(["Fishing","Shooting","Running"]),
  // in this case must always be "true"
  aLiteralTrue: z.literal(true),
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

const user = {username: "123", age:1000, age2:9007199254740991n, age3:12n, brithday: new Date(), 
isProgrammer:true, aLiteralTrue: true, hobby: "Running"}

console.log(UserSchema.parse(user))
// safeParse gives a true or false response if succesful, handy for form validation
console.log(UserSchema.safeParse(user))
console.log(UserSchema.safeParse(user).success)


enum Hobbies{
Reading = "Reading", Writing = "Writing",Singing = "Singing",
}

// to use an array as an enum we need to use "as const" with the array to show it won't change/read only
const Hobbies2 = ["Swimming","Darts","Snooker","Tennis"] as const;

const UserSchema2 = z.object({
  hobby: z.nativeEnum(Hobbies),
  hobby2: z.enum(Hobbies2),
})


const user2 = {hobby: Hobbies.Singing, hobby2: "Darts"}
console.log(UserSchema2.safeParse(user2).success)
console.log(UserSchema2.shape)
console.log(UserSchema2.shape.hobby)
// a partial makes everything optional
console.log(UserSchema2.partial().parse(user2))


// const UserSchema3 = z.object({
//   name: z.string(),
//   age: z.number()
// }).partial()

const UserSchema3 = z.object({
  name: z.string(),
  age: z.number()
}).pick({name:true})

const user3 = {name: "Tim"}
console.log(UserSchema3.safeParse(user3).success)