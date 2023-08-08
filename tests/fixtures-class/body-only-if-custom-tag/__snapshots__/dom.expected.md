# Render
```html
<div
  id="no-body"
>
  Child 1Child 2Child 3Child 4
</div>
<div
  id="with-body"
>
  Child 1Body 1Child 2Body 2Child 3Body 3Child 4Body 4
</div>
<div
  id="revisit"
>
  Child 1
</div>
Referenced Global true
```

# Render {"show1":true}
```html
<div
  id="no-body"
>
  Child 2Child 3Child 4
</div>
<div
  id="with-body"
>
  Body 1Child 2Body 2Child 3Body 3Child 4Body 4
</div>
<div
  id="revisit"
/>
Referenced Global true
```

# Mutations
```
removed #text before #text
removed #text before #text
removed #text before div1/#text0
removed #text before #text
removed #text before #text
removed #text before #text
removed #text before #text
removed #text before #text
removed #text before div2/#text1
inserted div2/#text0
removed div2/#text1 before div2/#text2
inserted div2/#text1
removed div2/#text2 before div2/#text3
inserted div2/#text2
removed div2/#text3 before div2/#text4
inserted div2/#text3
removed div2/#text4 before div2/#text5
inserted div2/#text4
removed div2/#text5 before div2/#text6
inserted div2/#text5
removed div2/#text6 before div2/#text7
inserted div2/#text6
removed div2/#text7 before div2/#text8
inserted div2/#text7
removed div2/#text8 before div2/#text9
inserted div2/#text8
removed div2/#text9 before div2/#text10
inserted div2/#text9
removed div2/#text10 before div2/#text11
inserted div2/#text10
removed div2/#text11 before div2/#text12
inserted div2/#text11
removed div2/#text12 before div2/#text13
inserted div2/#text12
removed div2/#text13 before div2/#text14
inserted div2/#text13
removed div2/#text14 before div2/#text15
inserted div2/#text14
removed div2/#text15 before div2/#text16
inserted div2/#text15
removed div2/#text16 before div2/#text17
inserted div2/#text16
removed div2/#text17 before div2/#text18
inserted div2/#text17
removed div2/#text18 before div2/#text0
inserted div2/#text18
removed #text before #text
removed #text before #text
removed #text in div3
```

# Render {"show2":true}
```html
<div
  id="no-body"
>
  Child 1Child 3Child 4
</div>
<div
  id="with-body"
>
  Child 1Body 1Body 2Child 3Body 3Child 4Body 4
</div>
<div
  id="revisit"
>
  Child 1
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
inserted div2/#text0
inserted div2/#text5
inserted div2/#text1
inserted div2/#text2
inserted div2/#text4
inserted div2/#text3
div2/#text6: "Body 1" => "Body 2"
removed #text after div2/#text6
removed #text after div2/#text6
removed #text after div2/#text6
removed #text after div2/#text6
removed #text after div2/#text6
removed #text after div2/#text6
inserted div3/#text0
inserted div3/#text2
inserted div3/#text1
```

# Render {"show3":true}
```html
<div
  id="no-body"
>
  Child 1Child 2Child 4
</div>
<div
  id="with-body"
>
  Child 1Body 1Child 2Body 2Body 3Child 4Body 4
</div>
<div
  id="revisit"
>
  Child 1
</div>
Referenced Global true
```

# Mutations
```
inserted div1/#text3
inserted div1/#text5
inserted div1/#text4
removed #text after div1/#text5
removed #text after div1/#text5
removed #text after div1/#text5
inserted div2/#text6
inserted div2/#text11
inserted div2/#text7
inserted div2/#text8
inserted div2/#text10
inserted div2/#text9
div2/#text12: "Body 2" => "Body 3"
removed #text after div2/#text12
removed #text after div2/#text12
removed #text after div2/#text12
removed #text after div2/#text12
removed #text after div2/#text12
removed #text after div2/#text12
```

# Render {"show4":true}
```html
<div
  id="no-body"
>
  Child 1Child 2Child 3
</div>
<div
  id="with-body"
>
  Child 1Body 1Child 2Body 2Child 3Body 3Body 4
</div>
<div
  id="revisit"
>
  Child 1
</div>
Referenced Global true
```

# Mutations
```
inserted div1/#text6
inserted div1/#text8
inserted div1/#text7
removed #text after div1/#text8
removed #text after div1/#text8
removed #text after div1/#text8
inserted div2/#text12
inserted div2/#text17
inserted div2/#text13
inserted div2/#text14
inserted div2/#text16
inserted div2/#text15
div2/#text18: "Body 3" => "Body 4"
removed #text after div2/#text18
removed #text after div2/#text18
removed #text after div2/#text18
removed #text after div2/#text18
removed #text after div2/#text18
removed #text after div2/#text18
```