# Render
```html
<div
  id="no-body"
/>
<div
  id="with-body"
>
  Body 1Body 2Body 3Body 4
</div>
Referenced Global true
```

# Render {"show1":true}
```html
<div
  id="no-body"
>
  Child 1
</div>
<div
  id="with-body"
>
  Child 1Body 1Body 2Body 3Body 4
</div>
Referenced Global true
```

# Mutations
```
inserted div1/#text0
inserted div1/#text2
inserted div1/#text1
inserted div2/#text0
inserted div2/#text5
inserted div2/#text1
inserted div2/#text2
inserted div2/#text4
inserted div2/#text3
div2/#text6: "Body 1" => "Body 2"
div2/#text7: "Body 2" => "Body 3"
div2/#text8: "Body 3" => "Body 4"
removed #text after div2/#text8
```

# Render {"show2":true}
```html
<div
  id="no-body"
>
  Child 2
</div>
<div
  id="with-body"
>
  Body 1Child 2Body 2Body 3Body 4
</div>
Referenced Global true
```

# Mutations
```
inserted div1/#text0
inserted div1/#text2
inserted div1/#text1
removed #text after div1/#text2
removed #text after div1/#text2
removed #text after div1/#text2
removed #text before #text
removed #text before #text
removed #text before #text
removed #text before #text
removed #text before #text
removed #text before div2/#text0
div2/#text0: "Body 2" => "Body 1"
inserted div2/#text1
inserted div2/#text6
inserted div2/#text2
inserted div2/#text3
inserted div2/#text5
inserted div2/#text4
```

# Render {"show3":true}
```html
<div
  id="no-body"
>
  Child 3
</div>
<div
  id="with-body"
>
  Body 1Body 2Child 3Body 3Body 4
</div>
Referenced Global true
```

# Mutations
```
inserted div1/#text0
inserted div1/#text2
inserted div1/#text1
removed #text after div1/#text2
removed #text after div1/#text2
removed #text after div1/#text2
removed #text after div2/#text0
removed #text after div2/#text0
removed #text after div2/#text0
removed #text after div2/#text0
removed #text after div2/#text0
removed #text after div2/#text0
div2/#text1: "Body 3" => "Body 2"
inserted div2/#text2
inserted div2/#text7
inserted div2/#text3
inserted div2/#text4
inserted div2/#text6
inserted div2/#text5
```

# Render {"show4":true}
```html
<div
  id="no-body"
>
  Child 4
</div>
<div
  id="with-body"
>
  Body 1Body 2Body 3Child 4Body 4
</div>
Referenced Global true
```

# Mutations
```
inserted div1/#text0
inserted div1/#text2
inserted div1/#text1
removed #text after div1/#text2
removed #text after div1/#text2
removed #text after div1/#text2
removed #text after div2/#text1
removed #text after div2/#text1
removed #text after div2/#text1
removed #text after div2/#text1
removed #text after div2/#text1
removed #text after div2/#text1
div2/#text2: "Body 4" => "Body 3"
inserted div2/#text3
inserted div2/#text8
inserted div2/#text4
inserted div2/#text5
inserted div2/#text7
inserted div2/#text6
```