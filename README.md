SeriesGraph
===========

SVG-based Graphing Library

Dependencies

    <script src="js/jquery-1.10.2.min.js"></script> <!-- jQuery dependency -->
    <script src="js/seriesGraph.js"></script> <!-- seriesGraph dependency -->

Use with a idle svg DOM container...

    <section class="chart-holder">
        <svg class="chart" version="1.1" ></svg>
    </section>

The data is constructed as an array:

    <script>
        var dataSet = [
            {
                key: '2014-04-29',
                value: 0
            },
            {
                key: '2014-04-30',
                value: 1
            },
            {
                key: '2014-05-01',
                value: 5
            },
            {
                key: '2014-05-02',
                value: 4
            }
        ];
    </script>

Configure the Graph:

    var $chartHolder = $('.chart-holder');
    var $svg = $('.chart');
    var zeroFunc = function() { return 0; }
    var sameFunc = function(v) { return v; }

    /*
        defining the series to be plotted, including the data array
     */
    var series = new Series({
        data: dataSet,
        type: 'line',
        className: 'series1',
        axis: {
            position: 'left',
            unique: true,
            line_count: 10,
            start: zeroFunc,
            end: sameFunc
        }
    });

        var graph = new Graph({
        series : [series], // can take an array of series to overlay them
        $container : $chartHolder, // for responsive considerations
        labelSpacing : {
            top: 10,
            right: 50,
            bottom: 20,
            left: 100
        },
        rePaintOnResize: true
    });

    // draws the chart to the base container
    $svg.html(graph.get$Root());