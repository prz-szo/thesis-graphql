GraphQL 
=========

General features 
--------
##### Field
_Sub-selection_ if a given field is an object.

##### Arguments
For each field. Arguments may have different types.

##### Aliases
We can use it when querying for the for the same field with different arguments.

##### Fragments
Reusable units. Let you construct sets of fields, and then include them in queries.

##### Variables
To perfom dynamic queries. `opType OpName($variableName: VariableType = defaultValue)`. Separated values out of the query, and passed as a dictionary. Interpolating string to construct query from user-supplied values is not so wise idea...

##### Operation type
Either query, mutation, or subscription and describes what type of operation you're intending to do.

##### Operation name
E.g. SomeQueryNameForBeingDescriptive as operation name: `query SomeQueryNameForBeingDescriptive`.

##### Directives
Dynamically change the structure and shape of our queries using variables. `@include` `@skip`

##### Mutations
If the mutation field returns an object type, you can ask for nested fields. Input object type, a special kind of object type that can be passed in as an argument. While query fields are executed in parallel, mutation fields run in series, one after the other.

##### Inline Fragments
If we're querying a field that returns an interface or a union type, you will need to use  those to access data on the underlying concrete type. `... on TYPE {}`

##### Metafields
E.g. `__typename`, `__type`, `__schema`, `__typekind`, `__field`, and so on see Introspections

Schema
--------

- Types:

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

