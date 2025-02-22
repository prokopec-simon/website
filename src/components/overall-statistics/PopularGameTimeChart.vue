<template>
  <bar-chart :chart-data="gameHourChartData" />
</template>
<script lang="ts">
import { Component, Prop } from "vue-property-decorator";

import { PopularGameHour } from "@/store/overallStats/types";
import { ChartData } from "chart.js";
import moment from "moment";
import BarChart from "@/components/overall-statistics/BarChart.vue";
import Vue from "vue";

@Component({
  components: { BarChart },
})
export default class PopularGameTimeChart extends Vue {
  @Prop() public popularGameHour!: PopularGameHour;

  getTrimmedTimes() {
    const gameHour = this.popularGameHour;
    if (!gameHour) return [];

    const times = gameHour?.playTimePerHour.slice(0);

    return times;
  }

  get passedTime() {
    return this.getTrimmedTimes().map((g) =>
      moment
        .utc(
          moment
            .duration(g.hours, "hours")
            .add(moment.duration(g.minutes, "minutes"))
            .asMilliseconds()
        )
        .format("HH:mm")
    );
  }

  get utcTimeOffset() {
    const time = new Date();
    const timeOffset = time.getTimezoneOffset() / 60;

    return timeOffset;
  }

  private shiftGameCount(gamesCount: number[]) {
    const numberOfBarsToOffset = this.utcTimeOffset * 4;

    for (let i = 0; i < numberOfBarsToOffset; i++) {
      const firstItem = gamesCount.shift()!;
      gamesCount.push(firstItem);
    }
    return gamesCount;
  }

  get gamesCount() {
    return this.getTrimmedTimes().map((g) => g.games);
  }

  get gameHourChartData(): ChartData {
    return {
      labels: this.passedTime,
      datasets: [
        {
          label: String(
            this.$t(
              "components_overall-statistics_populargametimechart.accgameslast2weeks"
            )
          ),
          data: this.shiftGameCount(this.gamesCount),
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };
  }
}
</script>
