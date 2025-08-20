# kinL API

## Develop

First of all, to start the API to develop, you can follow the steps from the [README.md](../../README.md#start-the-project) file.

You need to start by creating a module, you can use the NestJS CLI to do that:

```bash
cd apps/api
pnpm nest g module <feature-name>
pnpm nest g service <feature-name>
pnpm nest g controller <feature-name>
```

### OpenAPI types

Once the module is created, you should create the contract file: `modules/<features>/contracts/<module>.controller.ts` like:

```ts
export const mySchema = z.object({
  id: z.string(),
  // ...
}).openapi({
  title: '<Schema name>',
  description: '<Schema description>',
});

export type MyType = z.infer<typeof mySchema>;
```

After that, you can use it in the controller with TypedRoute and TypedBody decorators. Here an example:

```
@TypedRoute.Get('', linksSchema)
getAllLinks(@CurrentUser() user: User, @FilteringParams(linksFilteringSchema) filter?: LinksFiltering) {
  return this.linksService.getAllLinksFromUser(user.id, filter);
}

@TypedRoute.Post('', linkSchema)
createLink(
  @CurrentUser() user: User,
  @TypedBody(createLinkSchema) body: CreateLinkInput,
) {
  return this.linksService.createLink(body, user.id);
}

@TypedRoute.Patch(':id', linkSchema)
updateLink(
  @CurrentUser() user: User,
  @TypedBody(updateLinkSchema) body: UpdateLinkInput,
  @TypedParam('id') linkId: string,
) {
  return this.linksService.updateLink(body, linkId, user.id);
}

@TypedRoute.Delete(':id')
deleteLink(@CurrentUser() user: User, @TypedParam('id') linkId: string) {
  return this.linksService.deleteLink(linkId, user.id);
}
```

There is a lot of other types of decorators from Nzoth, here is the documentation for this library: [Nzoth](https://github.com/lonestone/nzoth)

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## NestJS Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).
