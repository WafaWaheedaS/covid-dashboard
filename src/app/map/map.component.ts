import { Component, OnInit } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { StatsService } from '../shared/stats.service';
import { Country, CountryStats } from '../shared/model';
import { Subject, takeUntil } from 'rxjs';
import { CountryService } from '../shared/country.service';


@Component({
  selector: 'covid-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor(private statsService: StatsService, private countryService: CountryService) { }

  map!: am5map.MapChart;
  mapPolygon!: am5map.MapPolygonSeries | void;
  showSelectCountries: boolean = false;
  selectedCountry!: string;
  countriesStats: CountryStats[] = [];
  _onDestroy = new Subject<void>();

  ngOnInit(): void {
    this.getStats()
    this.countryService.getSelectedCountry()
    .pipe(takeUntil(this._onDestroy))
    .subscribe((country: Country) => { if (country?.name) {
        this.selectedCountry = country.name;
        if(this.mapPolygon) { 
          console.log(this.selectedCountry)
          this.getStats()
          this.populateMapData(this.mapPolygon)
        }
      }
      })
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    if (this.map) {
      this.map.dispose();
    }
  }
  
  initialize(): am5map.MapPolygonSeries | void {
    let map: am5map.MapChart;
    if(!this.map) 
    { 
      let root = am5.Root.new("covid-world-map");
      map =  root.container.children.push(
        am5map.MapChart.new(root, {
          panX: "rotateX",
          projection: am5map.geoMercator(),
          animationDuration: 500,
        })
      );

      root.setThemes([
        am5themes_Animated.new(root)
      ]);

      var polygonSeries = map.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: am5geodata_worldLow,
          exclude: ["AQ"],
          valueField: "value",
          calculateAggregates: true
        })
      );
      
      polygonSeries.set("heatRules", [{
        target: polygonSeries.mapPolygons.template,
        dataField: "value",
        min: am5.color(0xff99cf),
        max: am5.color(0x990052),
        key: "fill"
      }]);

      let heatLegend = map.children.push(am5.HeatLegend.new(root, {
        orientation: "vertical",
        position: 'relative',
        startColor: am5.color(0xff99cf),
        endColor: am5.color(0x990052),
        startText: "Lowest",
        endText: "Highest",
        stepCount: 3
      }));

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
      this.populateMapData(polygonSeries)
      this.map = map;
      return polygonSeries;
    }
  }

  populateMapData(polygonSeries: am5map.MapPolygonSeries) {
    this.getStats()
    let mapData = this.countriesStats.map((countryStat: CountryStats) => {
      return ({ name: countryStat.name, id: countryStat.id, value: countryStat?.cases?.total });
    })
    polygonSeries.data.setAll(mapData)
  }

  getStats(): void {
    this.statsService.getAll({'country': this.selectedCountry})
    .pipe(takeUntil(this._onDestroy)).subscribe((countriesStatsRes: CountryStats[]) => {
      this.countriesStats = countriesStatsRes;
    }, (error) => console.log("Failed to get stats.", error), () => {
       if(!this.map) this.mapPolygon = this.initialize(); })
  }

}