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

### List resolvers


