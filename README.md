

# graphql-parse-relation-fields

This is a package that helps you sort out your graphql client requested fields into a neat Javascript object and format so they can be used for a Prisma 2 relational or non-relational(scalar) sql database query.



## Usage

Installation

```
npm i graphql-parse-relation-fields

```

An Example of a Prisma 2 Schema Below

schema.prisma

```javascript
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}


model User {
  
  id String @id 
  name String @db.VarChar(255)
  email String @unique @db.VarChar(255)
  password String? @db.VarChar(255)
  links Link[]
  posts Post[] 
  comments Comment[] 
  createdAt DateTime @default(now())
  updatedAt DateTime @default(now())
  verified Boolean @default(false)
}
model Post {
  id String @id 
  title String @db.VarChar(100)
  body String 
  published Boolean?
  authorId String 
  author User @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments Comment[] 
  
 
  
}

model Comment {
  id String @id 
  text String
  authorId String 
  postId String 
  author User @relation(fields: [authorId], references: [id], onDelete: Cascade)
  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)


  
}

model Link {
  id String @id
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  text String 
  name String
  userId String 
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  
}

```

Example of a Graphql Yoga Users Query Resolver Function

```javascript
const gprf = require("graphql-parse-relation-fields");

/****
the dbRelationFields array contains some the schema fields as written in the schema.prisma
file above that are in relation to other schemas,
these fields would be called by the graphql client in the
query most probably from a frontend application
***/
const dbRelationFields = ["posts", "author", "comments", "links"];
const Query = {
   
    async users(parent, args, ctx, info){
     let {prisma} = ctx;
     let opArgs = {};
     /****
     the variable type refers to the relation query call type
     you want to use, for example, it could be "select" or "include"


  example: 
  {
    select: {
      name: true,
      email:true,
      posts:{
        select:{
         title: true,
         body: true
        }
      }

    }
  }
     ****/
     let relationType = "select"
     let queryFields = gprf({info, dbRelationalFields, type:relationType})
   
     opArgs.select = queryFields.select
  
     let users = await prisma.user.findMany(opArgs)
   
    console.log(users)
    return users
    }
}
```

Graphql Playground / Graphiql Query

```graphql
users {
    id
    name
    email
  
    posts {
      title
      body
      author {
        name
        links {
          text
        }
      }
  
    }
   comments {
        text
      }
  
 }
```

Result Showing the Javascript Object Returned From The Package

```javascript
{
 select:{
 id:true,
 name:true,
 email:true,
 posts:{
  select:{
   title:true,
   body:true,
   author:{
    select:{
    name:true,
    links:{
     select:{
      text:true
      }
     }
    }
   }
  }
 },
 comments:{
  select:{
   text:true
   }
  }
 }
}
```

Prisma 2 Database Query Results

```json
{
  "data": {
    "users": [
      {
        "id": "0b1bab18-6b02-4f91-9f60-ca050a17fcf4",
        "name": "tony",
        "email": "tonyt1@outlook.com",
        "posts": [],
        "comments": []
      },
      {
        "id": "e1d01500-9480-4051-8d55-71b9f0c77d0a",
        "name": "tonia",
        "email": "toniat1@outlook.com",
        "posts": [
          {
            "title": "the new",
            "body": "I am the new boss",
            "author": {
              "name": "tonia",
              "links": []
            }
          }
        ],
        "comments": []
      },
      {
        "id": "57cc1c4b-9b23-4a62-99f1-0e8cfda6d0dd",
        "name": "tonnel",
        "email": "tonnel1@outlook.com",
        "posts": [
          {
            "title": "john wickr",
            "body": "the baba yaga",
            "author": {
              "name": "tonnel",
              "links": []
            }
          },
          {
            "title": "john wickr",
            "body": "the baba yaga",
            "author": {
              "name": "tonnel",
              "links": []
            }
          },
          {
            "title": "john wickr",
            "body": "the baba yaga",
            "author": {
              "name": "tonnel",
              "links": []
            }
          }
        ],
        "comments": []
      }
    ]
  }
}

```
