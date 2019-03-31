$(window).load(function() {

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
        }, 400);
      }
      $('[data-scroll]').on('click', scrollToSection);


    const width = window.innerWidth;


    const parseDate = d3.timeParse("%Y-%m-%d");
    const dayformat= d3.timeFormat('%y년 %_m월 %_d일');


    const container=d3.select('.container');

    d3.csv("data.csv", type, function(error, data) {
      if (error) throw error;
      
      container.append('div')
            .attr('class','axis');
        d3.select('.axis').append('div')
            .attr('class','axisline')
            .style('width',width+'px')
            .html("<span>'나쁨' 기준 (35㎍/㎥)</span>");


        container.append('div').attr('class','itemcontainer')
            .selectAll('div')
            .data(data)
            .enter()
            .append('div')
            .attr('class','flexitem')
            .attr('id',function(d,i){
                return 'item'+i;
            });
  
        const flexitem=d3.selectAll('.flexitem');

        flexitem.append('div')
            .attr('class','date')
            .html(function(d,i){
                return '<span>'+dayformat(parseDate(d.date))+'</span>';
            })
        const picture=flexitem.append('div')
            .attr('class',function(d){
                return 'picture';
            })    
    
        picture.append('div').attr('class','skyimg')
            .style('background-image',function(d,i){
                return 'url("image/img'+(i+1)+'.png")';
            });

        flexitem.append('div')
            .attr('class','Palette')
            .attr('id',function(d,i){
                return 'palette'+i;
            })
            .style('background-color',function(d,i){
               if(d.R==''){
                    d3.select(this).style('background-image','url("img/line.png")')
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
        d3.selectAll('.pm25bar')
            .style('height',function(d){
                return d.pm25+'px';
            });

       var baraxis = flexitem.append('div')
            .attr('class','baraxis');

            d3.selectAll('.pm25bar').html(function(d,i){
                if(d.pm25<16){
                    return "<span class='status'>&#x1F606; "+d.pm25+"</span>"
                }else if(d.pm25>=16 && d.pm25<36){
                    return "<span class='status'>&#x1F644; "+d.pm25+"</span>"
                }else if(d.pm25>=36 && d.pm25<76){
                    return "<span class='status'>&#x1F61F; "+d.pm25+"</span>"
                }else{
                    return "<span class='status'>&#x1F631; "+d.pm25+"</span>"
                }
            });
        

    container.append('div')
            .attr('class','label')
            .style('top','30px')
            .html('하늘 사진');
    container.append('div')
            .attr('class','label')
            .style('top','190px')
            .html('하늘 색상 추출');
    container.append('div')
            .attr('class','label')
            .style('top','255px')
            .html('PM2.5 초미세먼지 농도');


            var cardwidth=$('#item0').width();

            var slider=$('.slider');
            var plag=0;
            
            slider.on('input', function() {
                plag=1;
                var val = slider.val();
                var trans=cardwidth*val;
                $('.itemcontainer').scrollLeft(trans);
            });
            slider.on('change',function(){
                plag=0;              
            })

        if(plag==0){
            $('.itemcontainer').scroll(function(){
                d3.selectAll('.flexitem')
                .transition().duration(300).ease(d3.easeLinear)
                .style('opacity',function(d,i){
                    var offset=$('#item'+i).offset();
                    if(offset.left>-width/2 && offset.left<width/2){
                        slider.val(i);
                        return '1';
                    }else{return '.3'}
                })
                d3.selectAll('.pm25bar')
                .transition().duration(300).ease(d3.easeLinear)
                .style('background-color',function(d,i){
                    var offset=$('#item'+i).offset();
                    if(offset.left>-width/2 && offset.left<width/2){
                        if(d.pm25<16){
                        return "#99e6d8"
                        }else if(d.pm25>=16 && d.pm25<36){
                        return "#f3efa1"
                        }else if(d.pm25>=36 && d.pm25<76){
                        return "#ff9d6c"
                        }else{
                        return "#ff4713"
                        }
                    }else{return '#888'}
                })


            })
        }
    });


    function type(d) {
        d.pm25 = +d.pm25;
        return d;
    }
    
    
  });  