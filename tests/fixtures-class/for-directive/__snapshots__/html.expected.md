# Write
  <!--M#s0-0--><div class=array><div><li>red</li></div><div><li>green</li></div><div><li>blue</li></div></div><div class=array-iterator><div><li>red</li></div><div><li>blue</li></div></div><div class=array-separator><div><li>red</li></div>, <div><li>green</li></div>, <div><li>blue</li></div></div><div class=array-status-var><div>red1) of 3<div> - FIRST</div> - NOT LAST</div><div>green2) of 3 - NOT LAST</div><div>blue3) of 3 - LAST</div></div><div class=array-iterator-and-status-var><div><li>red</li></div>, <div><li>blue</li></div></div><div class=array-status-var-and-iterator><div>red1) of 2 - FIRST</div><div>blue2) of 2 - LAST</div></div><div class=array-status-var-and-separator><div>red1) of 3 - FIRST</div>, <div>green2) of 3</div>, <div>blue3) of 3 - LAST</div></div><div class=array-status-var-and-iterator-and-separator><div>red1) of 2 - FIRST</div>, <div>blue2) of 2 - LAST</div></div><div class=props><div><li>red: #FF0000</li></div><div><li>green: #00FF00</li></div><div><li>blue: #0000FF</li></div></div><div class=props-separator><div><li>red: #FF0000</li></div>, <div><li>green: #00FF00</li></div>, <div><li>blue: #0000FF</li></div></div><div class=props-status-var><div><li>red: #FF0000</li>1) of 3 - FIRST</div><div><li>green: #00FF00</li>2) of 3</div><div><li>blue: #0000FF</li>3) of 3 - LAST</div></div><div class=props-status-var-and-separator><div><li>red: #FF0000</li>1) of 3 - FIRST</div>, <div><li>green: #00FF00</li>2) of 3</div>, <div><li>blue: #0000FF</li>3) of 3 - LAST</div></div><div class=range><div><li>0</li></div><div><li>1</li></div><div><li>2</li></div><div><li>3</li></div><div><li>4</li></div><div><li>5</li></div><div><li>6</li></div><div><li>7</li></div><div><li>8</li></div><div><li>9</li></div><div><li>10</li></div></div><div class=statement-basic-increment><div>0</div><div>1</div><div>2</div></div><div class=statement-basic-increment-by-2><div>0</div><div>2</div></div><div class=statement-missing-declaration><div>0</div><div>2</div></div><div class=statement-backwards-test><div>0</div><div>1</div><div>2</div><div>3</div></div><div class=statement-iterate-backwards><div>3</div><div>2</div><div>1</div><div>0</div></div><div class=statement-iterate-backwards-by-2><div>3</div><div>1</div></div><div class=statement-multi-declaration><div>0 2</div><div>1 2</div><div>2 2</div></div><div class=statement-init-expression><div>0</div><div>1</div><div>2</div></div><div class=statement-test-expression></div><div class=statement-update-expression><div>1</div><div>2</div><div>3</div></div><div class=statement-update-only><div>2</div><div>1</div><div>0</div></div><!--M/--><script>$MC=(window.$MC||[]).concat({"w":[["s0-0",0,{"renderBody":null},{"f":1,"r":null}]],"t":["<fixture-dir>/template.marko"]})</script>

# Render
```html
<div
  class="array"
>
  <div>
    <li>
      red
    </li>
  </div>
  <div>
    <li>
      green
    </li>
  </div>
  <div>
    <li>
      blue
    </li>
  </div>
</div>
<div
  class="array-iterator"
>
  <div>
    <li>
      red
    </li>
  </div>
  <div>
    <li>
      blue
    </li>
  </div>
</div>
<div
  class="array-separator"
>
  <div>
    <li>
      red
    </li>
  </div>
  , 
  <div>
    <li>
      green
    </li>
  </div>
  , 
  <div>
    <li>
      blue
    </li>
  </div>
</div>
<div
  class="array-status-var"
>
  <div>
    red1) of 3
    <div>
       - FIRST
    </div>
     - NOT LAST
  </div>
  <div>
    green2) of 3 - NOT LAST
  </div>
  <div>
    blue3) of 3 - LAST
  </div>
</div>
<div
  class="array-iterator-and-status-var"
>
  <div>
    <li>
      red
    </li>
  </div>
  , 
  <div>
    <li>
      blue
    </li>
  </div>
</div>
<div
  class="array-status-var-and-iterator"
>
  <div>
    red1) of 2 - FIRST
  </div>
  <div>
    blue2) of 2 - LAST
  </div>
</div>
<div
  class="array-status-var-and-separator"
>
  <div>
    red1) of 3 - FIRST
  </div>
  , 
  <div>
    green2) of 3
  </div>
  , 
  <div>
    blue3) of 3 - LAST
  </div>
</div>
<div
  class="array-status-var-and-iterator-and-separator"
>
  <div>
    red1) of 2 - FIRST
  </div>
  , 
  <div>
    blue2) of 2 - LAST
  </div>
</div>
<div
  class="props"
>
  <div>
    <li>
      red: #FF0000
    </li>
  </div>
  <div>
    <li>
      green: #00FF00
    </li>
  </div>
  <div>
    <li>
      blue: #0000FF
    </li>
  </div>
</div>
<div
  class="props-separator"
>
  <div>
    <li>
      red: #FF0000
    </li>
  </div>
  , 
  <div>
    <li>
      green: #00FF00
    </li>
  </div>
  , 
  <div>
    <li>
      blue: #0000FF
    </li>
  </div>
</div>
<div
  class="props-status-var"
>
  <div>
    <li>
      red: #FF0000
    </li>
    1) of 3 - FIRST
  </div>
  <div>
    <li>
      green: #00FF00
    </li>
    2) of 3
  </div>
  <div>
    <li>
      blue: #0000FF
    </li>
    3) of 3 - LAST
  </div>
</div>
<div
  class="props-status-var-and-separator"
>
  <div>
    <li>
      red: #FF0000
    </li>
    1) of 3 - FIRST
  </div>
  , 
  <div>
    <li>
      green: #00FF00
    </li>
    2) of 3
  </div>
  , 
  <div>
    <li>
      blue: #0000FF
    </li>
    3) of 3 - LAST
  </div>
</div>
<div
  class="range"
>
  <div>
    <li>
      0
    </li>
  </div>
  <div>
    <li>
      1
    </li>
  </div>
  <div>
    <li>
      2
    </li>
  </div>
  <div>
    <li>
      3
    </li>
  </div>
  <div>
    <li>
      4
    </li>
  </div>
  <div>
    <li>
      5
    </li>
  </div>
  <div>
    <li>
      6
    </li>
  </div>
  <div>
    <li>
      7
    </li>
  </div>
  <div>
    <li>
      8
    </li>
  </div>
  <div>
    <li>
      9
    </li>
  </div>
  <div>
    <li>
      10
    </li>
  </div>
</div>
<div
  class="statement-basic-increment"
>
  <div>
    0
  </div>
  <div>
    1
  </div>
  <div>
    2
  </div>
</div>
<div
  class="statement-basic-increment-by-2"
>
  <div>
    0
  </div>
  <div>
    2
  </div>
</div>
<div
  class="statement-missing-declaration"
>
  <div>
    0
  </div>
  <div>
    2
  </div>
</div>
<div
  class="statement-backwards-test"
>
  <div>
    0
  </div>
  <div>
    1
  </div>
  <div>
    2
  </div>
  <div>
    3
  </div>
</div>
<div
  class="statement-iterate-backwards"
>
  <div>
    3
  </div>
  <div>
    2
  </div>
  <div>
    1
  </div>
  <div>
    0
  </div>
</div>
<div
  class="statement-iterate-backwards-by-2"
>
  <div>
    3
  </div>
  <div>
    1
  </div>
</div>
<div
  class="statement-multi-declaration"
>
  <div>
    0 2
  </div>
  <div>
    1 2
  </div>
  <div>
    2 2
  </div>
</div>
<div
  class="statement-init-expression"
>
  <div>
    0
  </div>
  <div>
    1
  </div>
  <div>
    2
  </div>
</div>
<div
  class="statement-test-expression"
/>
<div
  class="statement-update-expression"
>
  <div>
    1
  </div>
  <div>
    2
  </div>
  <div>
    3
  </div>
</div>
<div
  class="statement-update-only"
>
  <div>
    2
  </div>
  <div>
    1
  </div>
  <div>
    0
  </div>
</div>
```