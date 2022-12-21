// Whilst Zod can be used with JS it's really aimed for use with TypeScript
// Zod is a validation library with helpful errors & things like .infer
import {z} from "zod";
// Library for less ugly error messages
import {fromZodError} from "zod-validation-error"

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
}).omit({age:true}).pick({name:true})
const user3 = {name: "Tim"}
console.log(UserSchema3.safeParse(user3).success)

const UserSchema4 = z.object({
  name: z.string(),
  age: z.number()
}).deepPartial()
const user4 = {name: "Jane"}
console.log(UserSchema4.safeParse(user4).success)


// extend and merge doing the same thing
const UserSchema5 = z.object({
  name: z.string()
}).extend({age: z.number()}).merge(z.object({username: z.string()}))
const user5 = {name: "Johnny", age: 5, username: "short-circuit"}
console.log(UserSchema5.safeParse(user5).success)

// passthrough is used so we can add additional keys in the object user6
// otherwise additional stuff like "name" would be ignored when parased
const UserSchema6 = z.object({
  username: z.string()
}).passthrough()
// if we want to throw errors when additonal keys are added to the object
// use .strict() which does the opposite to passthrough()

const user6 = {
  username: "Mr Username",
  name: "Mr Name"
}
console.log(UserSchema6.parse(user6))


const UserSchema7 = z.object({
  friends: z.array(z.string()).nonempty(),
  coords: z.tuple([z.number(),z.number(),z.string()]).rest(z.number())
})
// Show the type of the array
// UserSchema7.shape.friends.element
const user7 = {
   friends: ["Abby","Bob","Carl"],
   // Our tuple must be a number, number, string then any amount of numbers after that to work
   coords: [1,2,"Hello Mr Tuple",3,4,5]
}
console.log(UserSchema7.safeParse(user7).success)


//union lets you use one of two types, "or" does the same job
const UserSchema8 = z.object({
  id: z.union([z.string(), z.number()]),
  id2: z.string().or(z.number())
})
const user8 ={
id: "IDNumUNIONString",
id2: "IDNumORString"
}
console.log(UserSchema8.safeParse(user8).success)


// A discriminated union is a union of object schemas that all share a particular key.
// discriminatedUnion is good for performance
const UserSchema9 = z.object({
  id: z.discriminatedUnion("status",[
    z.object({status: z.literal("success"), data: z.string()}),
    z.object({status: z.literal("failed"), data: z.instanceof(Error)}),
  ])
})
const user9 ={
id: {status: "success", data: "hello world"}
}
console.log(UserSchema9.safeParse(user9).success)


// use records to validate values if you don't care about keys
const UserMap = z.record(z.string())
const user10 = {
  keyDoesNotMatter: "Some string that matters",
  keyDoesNotMatter2: "Some string that matters",
}
console.log(UserMap.safeParse(user10).success)

// if you do care about keys then include it so you have 2 params
const UserMap2 = z.record(z.string(),z.string())
const user11 = {
  keyDoesNotMatter: "Some string that matters",
  keyDoesNotMatter2: "Some string that matters",
}
console.log(UserMap.safeParse(user11).success)


// maps tend to be handier than records
const StringNumberMap = z.map(z.string(), z.number());
const stringNumMap = new Map([
  ["abc",123],
  ["abc",123],
  ["abc",123],
  ["abc",123],
])
console.log(StringNumberMap.safeParse(stringNumMap).success)

const SetSchema = z.set(z.string());
const setDemo = new Set(["I am unique","so am I","me too","snowflake here","I am unique","I am unique","I am unique"])
console.log(SetSchema.parse(setDemo))


const PromiseSchema = z.promise(z.string())
const prom = Promise.resolve("abc")
console.log(PromiseSchema.parse(prom))


// use refine to validate a custom types like company emails
// superRefine is an improved version of fine with low level access & more methods
const BrandEmailSchema = z
.string()
.email()
.refine(val=>val.endsWith("@someCustomEmail.com"),{
  message: "Email just end with @someCustomEmail.com"
})
const email = "johnny@someCustomEmail.com";
console.log(BrandEmailSchema.safeParse(email).success)


const ErrorDemo = z
.object({
  username: z.string().min(3,"min length must be 3")
})
const errorUser = {
  username: "12"
}
console.log(ErrorDemo.safeParse(errorUser))

const results = ErrorDemo.safeParse(errorUser)

if(!results.success){
  console.log(fromZodError(results.error))
}