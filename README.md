```javascript
# graphql-parse-relations-fields
This is a package that helps you sort out your graphql client query fields so they can be used for relational or non-relational(scalar) sql database querie.

## Usage

Example of Graphql Resolver


const gprf = require("graphql-parse-relations-fields");
//the array dbRelationFields contains all the schema fields that are in relation //to other schemas, these would be called by the client in the query object
const dbRelationFields = ["posts", "author", "comments", "links"];
const Query = {
   
    async users(parent, args, ctx, info){
     let {prisma} = ctx;
     let opArgs = {};
     //the variable type refers to the relation query call type you want to use
     //example it could be "select" or "include"
     let relationType = "select"
     let queryFields = gprf({info, dbRelationalFields, type:relationType})
   
     opArgs.select = queryFields.select
  
     let users = await prisma.user.findMany(opArgs)
   
    console.log(users)
    return users
    }
}
```



Query

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



Result

```javascript
{
 select:
 {
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








database query results

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
}{
  "profile": {
    "firstName": {},
    "lastName": {},
    "middleName": {}
  },
  "email": {},
  "id": {}
}

```
