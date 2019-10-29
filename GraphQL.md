GraphQL 
=========

Queries and Mutations 
--------
- ##### Field
    _Sub-selection_ if a given field is non-scalar type.

- ##### Arguments
    For each field. Arguments may have different types.

- ##### Aliases
    We can use it when querying for the for the same field with different arguments.

- ##### Fragments
    Reusable units. Let you construct sets of fields, and then include them in queries.

-   ##### Variables
    To perform dynamic queries. `opType OpName($variableName: VariableType = defaultValue)`. Separated values out of the query, and passed as a dictionary. Interpolating string to construct query from user-supplied values is not so wise idea...

- ##### Operation type
    Either query, mutation, or subscription and describes what type of operation you're intending to do.

- ##### Operation name
    E.g. SomeQueryNameForBeingDescriptive as operation name: `query SomeQueryNameForBeingDescriptive`.

- ##### Directives
    Dynamically change the structure and shape of our queries using variables. `@include` `@skip`

- ##### Mutations
    If the mutation field returns an object type, you can ask for nested fields. Input object type, a special kind of object type that can be passed in as an argument. While query fields are executed in parallel, mutation fields run in series, one after the other.

- ##### Inline Fragments
    If we're querying a field that returns an interface or a union type, you will need to use those to access data on the underlying concrete type. `... on TYPE {}`

- ##### Metafields
    E.g. `__typename`, `__type`, `__schema`, `__typekind`, `__field`, and so on see Introspections

Schemas and Types
--------

- #### Types:
   - Int: A signed 32‐bit integer.
   - Float: A signed double-precision floating-point value.
   - String: A UTF‐8 character sequence.
   - Boolean: true or false.
   - ID    
   - Enumeration type

    `enum Episode {
        NEWHOPE
        EMPIRE
        JEDI
    }`
    
     _In most implementations: scalar Date but it depends on the implrementation_
    - **!** - means non-nullable field
    - **[Type]** - means an array of given type
    - **[Type!]** - array of non-nullable type (Array will containt at least one element)
    - **[Type!]!** - non-nullable array of non-nullable type (As above + array won't be null)

- #### Interfaces
    An _Interface_ is an abstract type that includes a certain set of fields that a type must include
to implement the interface. Those are useful while aiming to return the list of elements that has some specific common fields.

- #### Union types
    Union types are very similar to interfaces, but they don't get to specify any common fields between the types.
`union SearchResult = Human | Droid | Starship`. Here we can benefit from metadata field `__typename`.
It resolves to a String which lets you differentiate different data types from each other on the client.
```
{
  search(text: "an") {
    __typename
    ... on Human {
      name
      height
    }
    ... on Droid {
      name
      primaryFunction
    }
    ... on Starship {
      name
      length
    }
  }
}
```
    
   Also, in this case, since Human and Droid share a common interface (Character), you can query their common fields in one place rather than having to repeat the same fields across multiple types:

```
{
  search(text: "an") {
    __typename
    ... on Character {
      name
    }
    ... on Human {
      height
    }
    ... on Droid {
      primaryFunction
    }
    ... on Starship {
      name
      length
    }
  }
}
```

- #### Input type
    While querying we can pass some complex object. This is particularly valuable in the case of mutations,
where you might want to pass in a whole object to be created. The keyword input instead of type:
```
input ReviewInput {
  stars: Int!
  commentary: String
}
```


Validation
------------

- We cannot make query fragments that refer to themselves. No circular references are permitted.
- We have to query for a field that exists on the given type.
- Whenever we query for a field and it returns something other than a scalar or an enum,
we need to specify what data we want to get back from the field.
 - If a field is a scalar, it doesn't make sense to query for additional fields on it.
 - when we query for `hero` which returns a `Character`, we can only query for fields that exist on `Character`.
 But we can use the fragments we introduced earlier to do this.
 
 
Execution
----------

After being validated, a GraphQL query is executed by a GraphQL server which returns a result that mirrors
 the shape of the requested query, typically as JSON.
 
Each field on each type is backed by a function called the resolver which is provided by the GraphQL server developer. 
When a field is executed, the corresponding resolver is called to produce the next value.

If a field produces a scalar value like a string or number, then the execution completes. However if a field produces 
an object value then the query will contain another selection of fields which apply to that object. 

### Root fields & resolvers

At the top level of every GraphQL server is a type that represents all of the possible entry points into the GraphQL API, 
it's often called the Root type or the Query type.

A resolver function receives four arguments:

 - `obj` The previous object, which for a field on the root Query type is often not used.
 - `args` The arguments provided to the field in the GraphQL query.
 - `context` A value which is provided to every resolver and holds important contextual information like the currently logged in user, or access to a database.
 - `info` A value which holds field-specific information relevant to the current query as well as the schema details.
 
### Asynchronous resolvers
 
 Notice that while the resolver function needs to be aware of Promises, the GraphQL query does not. 
 It simply expects the field to return something which it can then ask the name of. During execution, GraphQL will wait for Promises to complete before continuing and will do so with optimal concurrency.

### Trivial resolvers

```
Human: {
  name(obj, args, context, info) {
    return obj.name
  }
}
```

In fact, many GraphQL libraries will let you omit resolvers this simple and will just assume that if a resolver isn't provided for a field, that a property of the same name should be read and returned.

### Scalar coercion

```
Human: {
  appearsIn(obj) {
    return obj.appearsIn // returns [ 4, 5, 6 ]
  }
}
```

This is an example of scalar coercion. The type system knows what to expect and will convert the values returned by a resolver function into something that upholds the API contract.
In this case, there may be an Enum defined on our server which uses numbers like 4, 5, and 6 internally, but represents them as Enum values in the GraphQL type system.

Introspection
---------------

If we don't know the what types are available, we can ask GraphQL, by querying the `__schema` field, always available on the root type of a Query.

```
{
  __type(name: "Employee") {
    name
    fields {
      name
      type {
        name
        kind
        ofType {
          name
          kind
        }
      }
    }
  }
}
```

Best practices
---------------

#### Serving via HTTP
 - Web Request Pipeline
    GraphQL should be placed after all authentication middleware, so that you have access to the same session and user information you would in your HTTP endpoint handlers.
 - URIs, Routes
    Entities in GraphQL are not identified by URLs. Instead, a GraphQL server operates on a single URL/endpoint, usually /graphql, and all GraphQL requests for a given service should be directed at this endpoint.
 - HTTP Methods, Headers, and Body
    Your GraphQL HTTP server should handle the HTTP GET and POST methods.
    - GET request
        When receiving an HTTP GET request, the GraphQL query should be specified in the "query" query string.
        
        ```
          {
            me {
              name
            }
          }
      ```
      `http://myapi/graphql?query={me{name}}`
      
      Query variables can be sent as a JSON-encoded string in an additional query parameter called `variables`. If the query contains several named operations, 
      an `operationName` query parameter can be used to control which one should be executed.
    - POST request
        A standard GraphQL POST request should use the `application/json` content type, and include a JSON-encoded body of the following form:
        ```
        {
          "query": "...",
          "operationName": "...",
          "variables": { "myVariable": "someValue", ... }
        }
        ```
        `operationName` and `variables` are optional fields. `operationName` is only required if multiple operations are present in the query.

        In addition to the above, we recommend supporting two additional cases:
         - If the `"query"` query string parameter is present (as in the GET example above), it should be parsed and handled in the same way as the HTTP GET case.
         - If the `"application/graphql"` Content-Type header is present, treat the HTTP POST body contents as the GraphQL query string.
  - Response
    Regardless of the method by which the query and variables were sent, the response should be returned in the body of the request in JSON format.
    As mentioned in the spec, a query might result in some data and some errors, and those should be returned in a JSON object of the form:
    ```
    {
      "data": { ... },
      "errors": [ ... ]
    }
    ```
    If there were no errors returned, the `"errors"` field should not be present on the response. 
    If no data is returned, according to the GraphQL spec, the `"data"` field should only be included if the error occurred during execution.

#### JSON (with GZIP)

GraphQL services typically respond using `JSON`, however the GraphQL spec does not require it. 
`JSON` may seem like an odd choice for an API layer promising better network performance, however because it is mostly text, it compresses exceptionally well with `GZIP`.

It's encouraged that any production GraphQL services enable `GZIP` and encourage their clients to send the header: `Accept-Encoding: gzip`

#### Pagination

Typically fields that could return long lists accept arguments `"first"` and `"after"` to allow for specifying a specific region of a list, where `"after"` is a unique identifier of each of the values in the list.

Ultimately designing APIs with feature-rich pagination led to a best practice pattern called `"Connections"`. Some client tools for GraphQL, 
such as Relay, know about the Connections pattern and can automatically provide automatic support for client-side pagination when a GraphQL API employs this pattern.

 - We could do something like `friends(first:2 offset:2)` to ask for the next two in the list.
 - We could do something like `friends(first:2 after:$friendId)`, to ask for the next two after the last friend we fetched.
 - We could do something like `friends(first:2 after:$friendCursor)`, where we get a cursor from the last item and use that to paginate.
 
 ```
{
  hero {
    name
    friends(first:2) {
      totalCount
      edges {
        node {
          name
        }
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
}
```

#### Caching

One possible pattern for this is reserving a field, like `id`, to be a globally unique identifier.

If the backend uses something like UUIDs for identifiers, then exposing this globally unique ID may be very straightforward! 

If the backend doesn't have a globally unique ID for every object already, the GraphQL layer might have to construct this. Oftentimes, that's as simple as appending the name of the type to the ID and using that as the identifier; the server might then make that ID opaque by base64-encoding it.
