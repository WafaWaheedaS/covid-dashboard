import { Component, OnInit } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { StatsService } from '../shared/stats.service';
import { Country, CountryStats } from '../shared/country.model';


@Component({
  selector: 'covid-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor(private statsService: StatsService) { }

  map!: am5map.MapChart;
  countriesStats: CountryStats[] = [];
  
  ngOnInit(): void {
    this.getStats();
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
      min: am5.color(0xff33a0),
      max: am5.color(0x990052),
      key: "fill"
    }]);

    let heatLegend = map.children.push(am5.HeatLegend.new(root, {
      orientation: "vertical",
      position: 'relative',
      startColor: am5.color(0xff33a0),
      endColor: am5.color(0x990052),
      startText: "Lowest",
      endText: "Highest",
      stepCount: 3
    }));

    
    polygonSeries.mapPolygons.template.events.on("pointerover", function(ev) {
      console.log(ev)
      // heatLegend.showValue(ev.target.dataItem.get("value"));
    });

    polygonSeries.events.on("datavalidated", function () {
      heatLegend.set("startValue", polygonSeries.getPrivate("valueLow"));
      heatLegend.set("endValue", polygonSeries.getPrivate("valueHigh"));
    });
    
    heatLegend.startLabel.setAll({
      fontSize: 12,
      fill: heatLegend.get("startColor")
    });
    
    heatLegend.endLabel.setAll({
      fontSize: 12,
      fill: heatLegend.get("endColor")
    });
    
    let mapData = this.countriesStats.map((countryStat: CountryStats) => {
      return ({ name: countryStat.name, id: countryStat.id, value: countryStat?.cases?.total });
    })
    polygonSeries.data.setAll(mapData)

    this.map = map;
  }

  getStats(): void {
    this.statsService.getAll().subscribe((countriesStatsRes: CountryStats[]) => {
      this.countriesStats = countriesStatsRes;
    }, (error) => console.log("Failed to get stats.", error), () => this.initialize() )
  }

}
