# 201903dust

- rgbaster
     
- image and color wheel (horizon) + chart
- heatmap of year color + search local
- compare two pictures  
- how can load image faster?
- 
  
https://bl.ocks.org/mbostock/34f08d5e11952a80609169b7917d4172  
https://observablehq.com/@d3/zoomable-bar-chart

#### 0318
- ^^줌+tX+포지션absolute.......
- container height 잡고 absolute로 라벨 붙이기
- d3chart brush 붙이기
  
#### 0319
- 모바일 carousel
- 웹 line chart, brush
- 웹 scroll -> focusing
- 스크롤 애니메이션. 고정 필수
- 로딩프로세스
---------
# transform.scale(k) <>

Returns a transform whose scale k₁ is equal to k₀k, where k₀ is this transform’s scale.

# transform.translate(x, y) <>

Returns a transform whose translation tx1 and ty1 is equal to tx0 + x and ty0 + y, where tx0 and ty0 is this transform’s translation.

# transform.apply(point) <>

Returns the transformation of the specified point which is a two-element array of numbers [x, y]. The returned point is equal to [xk + tx, yk + ty].

# transform.applyX(x) <>

Returns the transformation of the specified x-coordinate, xk + tx.

# transform.applyY(y) <>

Returns the transformation of the specified y-coordinate, yk + ty.

# transform.invert(point) <>

Returns the inverse transformation of the specified point which is a two-element array of numbers [x, y]. The returned point is equal to [(x - tx) / k, (y - ty) / k].

# transform.invertX(x) <>

Returns the inverse transformation of the specified x-coordinate, (x - tx) / k.

# transform.invertY(y) <>

Returns the inverse transformation of the specified y-coordinate, (y - ty) / k.

# transform.rescaleX(x) <>

Returns a copy of the continuous scale x whose domain is transformed. This is implemented by first applying the inverse x-transform on the scale’s range, and then applying the inverse scale to compute the corresponding domain: