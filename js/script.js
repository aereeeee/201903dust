window.onload = function () {


    d3.selection.prototype.moveToFront = function() {
        return this.each(function(){
          this.parentNode.appendChild(this);
        });
      };
    
    var tooltipfix = floatingTooltip('tooltip-fix', 240);
    var margin = {top: 0, right: 40, bottom: 0, left: 20},
    width = window.innerWidth,
    height = window.innerHeight,
    corewidth=width-margin.left-margin.right;
    
    const imagewidth=height*0.58;
    const monthdata=[3,4,5,6,7,8,9,10,11,12,1,2];
    const parseDate = d3.timeParse("%Y-%m-%d");

    var x = d3.scaleBand()
          .range([0,corewidth,height])
          .padding(0);
    var x2 = d3.scaleBand()
          .range([0,corewidth,height])
          .domain(monthdata)
          .padding(0.01);

    const monthformat = d3.timeFormat('%_m월');
    const dayformat= d3.timeFormat('%_m월 %_d일');
    const yearformat= d3.timeFormat('%_y년 %_m월 %_d일');
    
    const firstwidth=corewidth/365;
    const maxextent=imagewidth/firstwidth;
    
    const extent = [[0,0], [corewidth,height]];       
    var zoom=d3.zoom()
            .scaleExtent([1, maxextent])
            .translateExtent(extent)
            .extent(extent)
            // .duration()
            .on("zoom", zoomed);
    
    var brush = d3.brushX()
            .extent(extent)
            .on("brush end", brushed);

    var ts = d3.transition()
            .duration(350)
            .ease(d3.easeLinear);

    const container=d3.select('.container').call(zoom);

    d3.select('.reset').on('click',function(){
        container.call(zoom.transform, d3.zoomIdentity
        .scale(1)
        .translate(0, 0));
    });
    d3.select('.help').on('mouseover',function(){
        d3.select('.guide').style('display','block')
        .transition(ts)
        .style('opacity','1')
    }).on('mouseout',function(){
        d3.select('.guide').style('opacity','0').style('display','none')
    });
    

    d3.csv("data.csv", type, function(error, data) {
      if (error) throw error;

        x.domain(data.map(function(d) { return d.date; }));

// 나쁨기준선
        container.append('div')
            .attr('class','axis')
            .style('top','65%');
        d3.select('.axis').append('div')
            .attr('class','axisline')
            .style('width',width+'px')
            .html("<span>'나쁨' 기준 (35㎍/㎥)</span>");

// 365개아이템
        container.selectAll('.flexitem')
            .data(data)
            .enter()
            .append('div')
            .attr('class','flexitem')
            .style('transform', function(d){
                return 'translateX('+x(d.date)+'px)'
            })
            .style("width", x.bandwidth()+'px')
            .on('mouseover',function(d){
                var content = '<div><span class="name">날짜: </span><span class="value">' +
                            d.date +
                            '</span></div>' +
                            '<div><span class="name">초미세먼지 농도: </span><span class="value">' +
                            d.pm25+
                            '㎍/㎥</span></div>';
                if(x.bandwidth()<80){
                d3.select(this).select('.pm25').style('background-color',"#f1f3f5");
                d3.select(this).select('.pm25bar').style('background-color',"#212529");
                 tooltipfix.showTooltip(content, d3.event);
                }
            })
            .on('mouseout', function(d){
                d3.select(this).select('.pm25').style('background-color',"transparent");
                tooltipfix.hideTooltip();
                if(x.bandwidth()<80){
                    d3.select(this).select('.pm25bar').style('background-color',"#888");
                 }
            })
            .on('click',function(d,i){
                var item=d3.select(this);

                item.moveToFront();
                d3.selectAll('.flexitem').attr('id',null);
                d3.selectAll('.pm25bar').style('background-color','#888')
                d3.selectAll('.date').style('opacity','0');
            
                // 변형
                if(d.pm25<16){
                    item.select('.date').transition(ts).style('opacity','1');
                    item.select('.pm25bar').transition(ts).style('background-color','#99e6d8');
                }else if(d.pm25>=16 && d.pm25<36){
                    item.select('.date').transition(ts).style('opacity','1');
                    item.select('.pm25bar').transition(ts).style('background-color','#f3efa1');
                }else if(d.pm25>=36 && d.pm25<76){
                    item.select('.date').transition(ts).style('opacity','1');
                    item.select('.pm25bar').transition(ts).style('background-color','#ff9d6c');
                }else{
                    item.select('.date').transition(ts).style('opacity','1');
                    item.select('.pm25bar').transition(ts).style('background-color','#ff4713');
                }
                if(x.bandwidth()<80){             
                    item.transition().delay(300).attr('id','active');}
                else{
                    item.transition().attr('id','active');
                }
            });
        

// 브러쉬구역
        const rectheight=height*0.05;
        var svg=container.append('div').attr('class','brushsec')
                .append('svg')
                .attr('width',corewidth)
                .attr('height',rectheight)

        var context = svg.append("g")
            .style('transform','translateX('+margin.left+')')
            .attr("class", "context");

        context.append('g')
                .selectAll('rect')
                .data(monthdata)
                .enter() 
                .append('rect')
                .attr("class", "monthrect")
                .attr("x", function(d) { return x2(d); })
                .attr("width", x2.bandwidth())
                .attr("height",rectheight)
                .attr('fill','#dee2e6');
            
            context.append('g')
                .attr("class", "brush")
                .call(brush)
                .call(brush.move, x.range());



        const flexitem=d3.selectAll('.flexitem');


        flexitem.append('div')
            .attr('class','date')
            .html(function(d,i){                         
                if(d.pm25<16){
                    return "<span class='status'>&#x1F606; 좋음</span>"
                }else if(d.pm25>=16 && d.pm25<36){
                    return "<span class='status'>&#x1F644; 보통</span>"
                }else if(d.pm25>=36 && d.pm25<76){
                    return "<span class='status'>&#x1F61F; 나쁨</span>"
                }else{
                    return "<span class='status'>&#x1F631; 매우 나쁨</span>"
                }
            });

// 사진       - 스프라이트로 백그라운드유알엘 써야할지도 
        var picture=flexitem.append('div')
            .attr('class','picture');

            picture.append('div')
            .style('background',function(d){
                return "url('css_sprites.jpg') -"+d.x+"px -"+d.y+"px";
            });

// 팔레트  - 빗금이미지 다시
        flexitem.append('div')
            .attr('class','Palette')
            .attr('id',function(d,i){
                return 'palette'+i;
            })
            .style('background-color',function(d,i){
                if(d.R==''){
                    d3.select(this).style('background-image','url("line.png")')
                    .html(function(){
                        if(i==27||i==28||i==43||i==52||i==62||i==66||i==107){
                            return '<span class="outitem">&#8251; 하늘 미촬영<span>'; 
                        }else{
                            return '<span class="outitem">&#8251; 뉴스 결방<span>';}  
                    });
                }else{
                return 'rgb('+d.R+','+d.G+','+d.B+')';
                }
            })
// 수치바
        const bar=flexitem.append('div')
            .attr('class','pm25')
            .attr('id',function(d,i){
                return 'pm25'+i;
            })
            bar.append('div')
                .attr('class','pm25bar')
                .attr('id',function(d,i){
                    return 'pm25bar'+i;
                })
                .style('height',function(d){
                    return d.pm25+'px';
                })
                .html(function(d,i){
                return '<span class="pmlabel">'+d.pm25+'</span>';
                });

        flexitem.append('div')
            .attr('class','baraxis')
            .html(function(d,i){
                if(i%30==1)
                return monthformat(parseDate(d.date));
            });
// 라벨
    container.append('div')
            .attr('class','label')
            .style('top','5%')
            .html('하늘 사진');
    container.append('div')
            .attr('class','label')
            .style('top','45%')
            .html('하늘 색상 추출');
    container.append('div')
            .attr('class','label')
            .style('top','65%')
            .html('PM2.5 초미세먼지 농도');
    
    });


function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
        var s = d3.event.selection || x2.range();
        // x.range(s.map(s.invertX, s));
        // var r0 = x2.range()[0];
        // var r1 = x2.range()[1];
        // var s0= s[0];
        // var s1= s[1];
        //     var p=maxextent-r0;
        //     // var left=Math.pow((s0-r0),(s0-r0)*0.0005)*p;
        //     // var right=Math.pow((r1-s1),(r1-s1)*0.0005)*p;
        //     var left=Math.pow((s0-r0),2)*p*0.0001;
        //     var right=Math.pow((r1-s1),2)*p*0.0001;
        // var mul=(width-margin.left-margin.right) / (s[1] - s[0]);
        // console.log(mul)
        // console.log(s[1])
        // console.log(s[0])
        // x.range([-s0*mul,mul*(r1)]);

  container.selectAll(".flexitem")
        .style('transform', function(d){
        return 'translateX('+x(d.date)+'px)'
        })
        .style("width", (x.bandwidth())+'px');


        if(x.bandwidth()>120){
            d3.selectAll('.baraxis').html(function(d,i){
            return yearformat(parseDate(d.date));
            });
            d3.selectAll('.pmlabel').style('opacity','1');
            d3.selectAll('.outitem').style('display','block');
        }
        else if(x.bandwidth()>80 && x.bandwidth()<=120 ){
            d3.selectAll('.baraxis').html(function(d,i){
            return dayformat(parseDate(d.date));
            });
            d3.selectAll('.pmlabel').style('opacity','1');
            d3.selectAll('.outitem').style('display','none');
        }else{
            d3.selectAll('.baraxis').html(function(d,i){
            if(i%30==1){
            return monthformat(parseDate(d.date));}
            else return;
            });

            d3.selectAll('.pm25bar').style('background-color','#888')
            d3.selectAll('.date').style('opacity','0');
            d3.selectAll('.pmlabel').style('opacity','0');
            d3.selectAll('.outitem').style('display','none');
            d3.selectAll('.flexitem').attr('id',null);
        }

        container.call(zoom.transform, d3.zoomIdentity
        .scale((width-margin.left-margin.right) / (s[1] - s[0]))
        .translate(-s[0], 0));

}
    function zoomed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return;
        x.range([0, width - margin.right-margin.left].map(d => d3.event.transform.applyX(d)));
        var t = d3.event.transform;
        container.selectAll(".flexitem")
        .style('transform', function(d){
        return 'translateX('+x(d.date)+'px)'
        })
        .style("width", (x.bandwidth())+'px');

        if(x.bandwidth()>120){
            d3.selectAll('.baraxis').html(function(d,i){
            return yearformat(parseDate(d.date));
            });
            d3.selectAll('.pmlabel').style('opacity','1');
            d3.selectAll('.outitem').style('display','block');
        }
        else if(x.bandwidth()>80 && x.bandwidth()<=120 ){
            d3.selectAll('.baraxis').html(function(d,i){
            return dayformat(parseDate(d.date));
            });
            d3.selectAll('.pmlabel').style('opacity','1');
            d3.selectAll('.outitem').style('display','none');
        }else{
            d3.selectAll('.baraxis').html(function(d,i){
            if(i%30==1){
            return monthformat(parseDate(d.date));}
            else return;
            });

            d3.selectAll('.pm25bar').style('background-color','#888')
            d3.selectAll('.date').style('opacity','0');
            d3.selectAll('.pmlabel').style('opacity','0');
            d3.selectAll('.outitem').style('display','none');
            d3.selectAll('.flexitem').attr('id',null);
        }

        d3.select(".brush").call(brush.move, x2.range().map(t.invertX, t));
    }


    function type(d) {
        d.pm25 = +d.pm25;
        return d;
    }


    // 투엔티투엔티
    $("#diff").twentytwenty({
        default_offset_pct: 0.2, 
        before_label: 'January 2017',
        after_label: 'March 2017',
        no_overlay: true,
    
      });
    // 스크롤내브
      function scrollToSection(event) {
        event.preventDefault();
        var $section = $($(this).attr('href')); 
        $('html, body').animate({
          scrollTop: $section.offset().top
        }, 400,'easeInCubic');
      }
      $('[data-scroll]').on('click', scrollToSection);
    
    //   스크롤내브호버
      $('#navigation a').hover(
      function() {
            $( this ).addClass( "hover" );
            $(this).children().css( "display", "block" )
            .animate({
                right:'30px',
                opacity: 1,
            }, 100,'easeInCubic' );
      }, function() {
            $( this ).removeClass( "hover" );
            $(this).children().css( "display", "none" )
            .animate({
                right:'0px',
                opacity: 0,
            }, 100 );
      }
    );
    
    //스크롤내브 위치에서 커렌트
    let mainNavLinks = document.querySelectorAll("#navigation a");
      
    window.addEventListener("scroll", event => {
        let fromTop = window.scrollY;
    
        if($(document).scrollTop()>$('#section1').offset().top-200){
            $('#navigation').css({opacity:'1'});
        }else{
            $('#navigation').css({opacity:'0'});
        }
      mainNavLinks.forEach(link => {
        let section = document.querySelector(link.hash);
    
        if (
          section.offsetTop-10 <= fromTop 
          &&
          section.offsetTop + section.offsetHeight-9 > fromTop
        ) {
          link.classList.add("current");
        } else {
          link.classList.remove("current");
        }
      });
    });

 };   