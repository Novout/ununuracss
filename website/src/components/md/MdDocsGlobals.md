# Globals

Any identifiers can receive generic resources that interfere with resource resolution:


### !

Important: Applies `!important` in all resources:

`text[! red]` -> `color: red !important;`

### ?

None: Remove all implicit resources from specific identifiers:

`flex[? flex-1]` -> Removes `display: flex;`

### content-

Content: Inserts `content: ""` item:

`before(grid[content-a_some_test ...])` -> `content: "a some test"`