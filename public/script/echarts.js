function generateDataPolygon(type, data) {
    var title = '', html = ''
    const id = Math.random().toString(36).substring(7)
    title = `<p class="cardtitle">${data.title}</p>`
    if(!data.title || data.title == '') title = ''
    if(type == 'datalabel') {
      html = `<div class="d-block"><p class="fit${id} display-4 font-weight-bold mt-4 mb-1 mr-2">${thousandSeparator(data.value)}</p><span class="lead nowrap">${data.unit}</span></div>`
    }
    if(type == 'dataicon') {
      html = `<div class="d-block"><p class="fit${id} display-4 font-weight-bold mt-4 mb-1"><i class="fa fa-${data.icon} ml-2 mr-3" style="color:${data.iconcolor}"></i>${thousandSeparator(data.value)}</p><span class="lead ml-2 nowrap">${data.unit}</span></div>`
    }
    if(type == 'multilabel') {
      for(let i = 0; i < data.value.length; i++) {
        html += `<div class="col-4 text-right"><div class="d-block"><p class="fit${id} h5 mb-0">${thousandSeparator(data.value[i])}</p></div></div>`
        html += `<div class="col-8"><small>${data.unit[i]}</small></div>`
      }
      html = `<div class="row">${html}</div>`
    }
    if(type == 'datatable') {
      var thead = data.columntitle.reduce((thead, i) => {
          return thead + `<th class="align-middle border-top-0">${i}</th>`
      }, '')
      var tbody = data.value.reduce((tbody, i) =>{
        tbody += '<tr>'
        i.forEach(j =>{ tbody += `<td>${j}</td>` })
        return tbody + `</tr>`
      }, '') 
      html += `<table id="dt${id}" class="table cardtable table-sm text-sm"><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table>`
    }
    if(type == 'image') {
      if(Array.isArray(data.value)) {
        var slider = ''
        data.value.forEach(i => {
          var src = i
          if(data.subtype == 'base64') src = 'data:image/jpeg;base64,' + data.value
          slider += `<img src="${src}" class="polyimage" alt="${data.title}">`
        })
        html = `<div class="imgslideshow">${slider}</div>`
      } else {
        var src = data.value
        if(data.subtype == 'base64') src = 'data:image/jpeg;base64,' + data.value
        html = `<img src="${src}" class="polyimage" alt="${data.title}">`
      }
    }
    if(type == 'video') {
      var src = data.value
      var srctype = 'video/mp4'
      if(data.subtype == 'base64') src = 'data:video/mp4;base64,' + data.value
      if(data.subtype == 'hls') srctype = 'application/x-mpegURL'
      html = `<video id="v${id}" class="video-js" autoplay controls poster="${data.cover}" preload="auto" data-setup="{}" style="width:100%;height:auto;position:relative;line-height:0"><source src="${src}" type="${srctype}"></video>`
    }
    if(type == 'label') $(`#dashboard-data`).append(`<div class="col-12 mb-3"><div class="datacardlabel">${data.title}</div></div>`)
    else $(`#dashboard-data`).append(`<div class="col-12 col-md-6 col-lg-4 col-xl-3 mb-3"><div class="datacard">${title}${html}</div></div>`)
    // apply plugin
    if(type == 'datalabel') fitty(`.fit${id}`,{minSize:20,maxSize:80})
    if(type == 'dataicon') fitty(`.fit${id}`,{minSize:20,maxSize:70})
    if(type == 'multilabel') fitty(`.fit${id}`,{minSize:5,maxSize:20})
    if(type == 'datatable') {
      $(`#dt${id}`).DataTable({
        "paging": true, "lengthChange": false, "searching": false, "ordering": true, "info": false, "autoWidth": true, "pageLength": data.pagination,
        "language": { "paginate": { "previous": "<i class='fa fa-chevron-left'></i>", "next": "<i class='fa fa-chevron-right'></i>" }}
      });
    }
    if(type == 'video' && data.subtype == 'hls') {
      var cardplayer = videojs(`v${id}`,{errorDisplay: false});
      cardplayer.play();
    }
    if(type == 'image' && Array.isArray(data.value)) {
      if(data.value.length > 1) {
        $(".imgslideshow > img:gt(0)").hide();
        var slideInterval = setInterval(function() { 
          $('.imgslideshow > img:first').fadeOut(1000).next().fadeIn(1000).end().appendTo('.imgslideshow');
          if($(".imgslideshow > img").length == 0) clearInterval(slideInterval)
        }, 4000);
      }
    }
  }
  
  function generateChartPolygon(data) {
    var fullwidth = false, chartHeight = 200
    if(data.fullwidth && (data.fullwidth == 1 || data.fullwidth == true || data.fullwidth == 'true')) { fullwidth = true; chartHeight = 300 }
    //const color = ['#dc3545','#793f4e','#044855','#022e39','#0c0a3e']
    //const color = ['#a72834','#c22f3d','#dc3545','#e04d5b','#e46572','#e97e88','#ed969e','#f1aeb5','#f5c6cb','#f9dfe1']
    const color = ['#385170','#8675A9','#9DAD7F','#A0937D','#A6DCEF','#C8C2BC','#D35D6E','#E8E9A1','#F6D186','#F6DFEB']
    const id = Math.random().toString(36).substring(7)
    const title = `<p class="cardtitle">${data.title}</p>`
    const html = `<div id="${id}" class="polychart" style="width:100%;height:${chartHeight}px"></div></div>`
    $(`#dashboard-data`).append(`<div class="${fullwidth?'col-12':'col-12 col-md-6 col-lg-4 col-xl-3'} mb-15"><div class="datacard">${title}${html}</div></div>`)
  
    var option = {}, seriesData = [], radarValue = []
    var tooltipOpt = { trigger: 'item', backgroundColor: '#ffffffbb', borderWidth: 0, appendToBody: true, textStyle: { fontSize: 13 } }
    var textStyle = { fontFamily: 'Manrope' }
  
    const chartType = (data.type).toLowerCase().replace('chart-','')
    const chartSubType = (data.subtype)?.toLowerCase()
    if(Array.isArray(data.series)) seriesData = data.series
    else seriesData.push(data.series)
    if(chartType == 'bar' || chartType == 'line') { // horizontal
      option = {
        textStyle: textStyle,
        tooltip: { ...tooltipOpt, trigger: 'axis' },
        legend: { show: true, textStyle: { fontSize: 9 }, bottom: -5 },
        grid: { left: 50, top: 15, right: 10, bottom: 50 },
        xAxis: {
          type: 'category',
          data: seriesData[0].title.map(i => i.replace(' ','\n')),
          axisLabel: { rotate: 40, fontSize: 10, showMinLabel: true, showMaxLabel: true }
        },
        yAxis: {
          type: 'value',
          axisLabel: { fontSize: 10 }
        },
        series: seriesData.map((i,idx) => ({
          name: i.unit,
          data: i.value,
          type: chartType,
          color: color[idx],
          smooth: true,
          areaStyle: chartType == 'line' && chartSubType == 'area' ? {} : null,
          tooltip: { valueFormatter: (value) => chartType == 'line' ? value : value + ` (${(value/(seriesData[idx].value.reduce((a, b) => Number(a)+Number(b), 0))*100).toFixed(0)}%)` },
        }))
      }
      if(chartType == 'bar' && chartSubType == 'vertical') {
        option.grid = { left: 80, top: 15, right: 10, bottom: 50 }
        option.yAxis = {
          type: 'category',
          data: seriesData[0].title.map(i => i.replace(' ','\n')),
          axisLabel: { fontSize: 10, showMinLabel: true, showMaxLabel: true }
        }
        option.xAxis = {
          type: 'value',
          axisLabel: { rotate: 30,fontSize: 10 }
        }
      } 
    }
    if(chartType == 'pie') {
      var tvalue = seriesData[0].value.reduce((a, b) => Number(a)+Number(b), 0)
      seriesData = seriesData[0]
      option = {
        textStyle: textStyle,
        tooltip: { ...tooltipOpt, position: ['20%', '80%'], valueFormatter: (value) => value + ` (${value==0?0:(value/tvalue*100).toFixed(0)}%)` },
        legend: { show: seriesData.value.length<5 ? true : false, textStyle: { fontSize: 9 }, bottom: 0 },
        series: [
          {
            name: seriesData.unit,
            type: 'pie',
            radius: chartSubType == 'donut' ? ['40%', '70%'] : chartSubType == 'rose' ? fullwidth?[20, 100]:[10, 80] : [0, '75%'],
            roseType: chartSubType == 'rose' ? 'area' : null,
            //label: { show: false },
            label: { textStyle: { fontSize: 10 } },
            labelLine: { length: 3 },
            itemStyle: {
              shadowBlur: 20,
              shadowColor: 'rgba(0, 0, 0, 0.2)'
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 20,
                shadowColor: 'rgba(0, 0, 0, 0.4)'
              }
            },
            data: seriesData.value.map((i,idx) => ({
              value: i,
              name: seriesData.title[idx],
              itemStyle: { color: color[idx] }
            })),
          }
        ]
      }
    }
    if(chartType == 'radar') {
      seriesData.map(i => radarValue.push(...i.value))
      //tooltipOpt.position = ['80%','-15%']
      tooltipOpt.textStyle.fontSize = seriesData[0].value.length > 8 ? 11 : 13
      option = {
        textStyle: textStyle,
        tooltip: tooltipOpt,
        grid: { top: 150, bottom: 60 },
        radar: {
          // shape: 'circle',
          radius: '60%',
          name: { fontSize: 9 },
          indicator: seriesData[0].title.map(i => i = {name: i.replace(' ','\n'), max: Math.max(...radarValue)}),
          splitArea: { show: false },
          splitLine: { lineStyle: { opacity: 0.3 } },
          axisLine: { lineStyle: { opacity: 0.3 } },
        },
        series: [{
          type: 'radar',
          avoidLabelOverlap: true,
          lineStyle: { width: 1 },
          symbolSize: 2,
          data: seriesData.map((i,idx) => ({
            value: i.value,
            name: i.unit,
            itemStyle: { color: color[idx] },
            areaStyle: { color: color[idx], opacity: 0.2 },
            tooltip: { valueFormatter: (value) => value + ` (${(value/(seriesData[idx].value.reduce((a, b) => Number(a)+Number(b), 0))*100).toFixed(0)}%)` },
          }))
        }]
      }
    }
    // render chart
    var chartDiv = document.getElementById(id)
    charts[id] = echarts.init(chartDiv)
    charts[id].setOption(option)
    chartsID.push(id)
  }
  
  function thousandSeparator(num) {
    if(abbr) return numeral(num).format('0,0[.]0 a')
    else {
      var num_parts = num.toString().split(".");
      num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return num_parts.join(".");
    }
  }