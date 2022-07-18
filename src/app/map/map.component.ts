import { Component, OnInit } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";


@Component({
  selector: 'covid-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor() { }

  map!: am5map.MapChart;

  ngOnInit(): void {
    if (!this.map) {
      this.initialize();
    }
  }

  
  private initialize() {
    var root = am5.Root.new("covid-world-map");
    var map = root.container.children.push(
      am5map.MapChart.new(root, {})
    );

    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    
    root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        projection: am5map.geoMercator(),
        animationDuration: 500,
      })
    );

    var polygonSeries = map.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ["AQ"],
        valueField: "value",
        calculateAggregates: true
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}: {value}",
      interactive: true,
      fill: am5.color(0xaaaaaa)
    });
    
    polygonSeries.set("heatRules", [{
      target: polygonSeries.mapPolygons.template,
      dataField: "value",
      min: am5.color(0xff621f),
      max: am5.color(0x661f00),
      key: "fill"
    }]);

    let heatLegend = map.children.push(am5.HeatLegend.new(root, {
      orientation: "vertical",
      startColor: am5.color(0xff621f),
      endColor: am5.color(0x661f00),
      startText: "Lowest",
      endText: "Highest",
      stepCount: 5
    }));
    
    heatLegend.startLabel.setAll({
      fontSize: 12,
      fill: heatLegend.get("startColor")
    });
    
    heatLegend.endLabel.setAll({
      fontSize: 12,
      fill: heatLegend.get("endColor")
    });
        
    polygonSeries.data.setAll([
      { name: "Afghanistan", value: 4447100 },
      { name: "India", value: 626932 },
      { name: "Qatar", value: 5130632 },
      { name: "France", value: 2673400 },
      { name: "Yemen", value: 33871648 },
      { name: "Taiwan", value: 4301261 },
      { name: "Tunisia", value: 3405565 },
      { name: "Finland", value: 783600 },
      { name: "Pakistan", value: 15982378 },
      { name: "Ghana", value: 8186453 },
    ]);
    
    this.map = map;
  }

}
