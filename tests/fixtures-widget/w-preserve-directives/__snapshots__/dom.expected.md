# Render {"id":1}
```html
<div
  data-id="1"
>
  1
</div>
<div
  data-id="1"
>
  1
</div>
<div
  data-id="1"
>
  1
</div>
<div
  data-id="1"
>
  1
</div>
<div
  data-id="1"
>
  1
</div>
<div
  data-id="1"
>
  1
</div>
<div
  a="1"
  b="1"
  c="1"
/>
```

# Render {"id":2}
```html
<div
  data-id="1"
>
  1
</div>
<div
  data-id="1"
>
  1
</div>
<div
  data-id="2"
>
  2
</div>
<div
  data-id="2"
>
  1
</div>
<div
  data-id="2"
>
  1
</div>
<div
  data-id="2"
>
  2
</div>
<div
  a="1"
  b="1"
  c="2"
/>
```

# Mutations
```
div3: attr(data-id) "1" => "2"
div3/#text0: "1" => "2"
div4: attr(data-id) "1" => "2"
div5: attr(data-id) "1" => "2"
div6: attr(data-id) "1" => "2"
div6/#text0: "1" => "2"
div7: attr(c) "1" => "2"
```