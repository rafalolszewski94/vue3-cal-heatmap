<template>
  <div>
    <h4>Unit Select</h4>
    <div>
      <input type="radio" id="one" value="Dings" v-model="picked" />
      <label for="one">Dings</label>
      <br />
      <input type="radio" id="two" value="Da" v-model="picked" />
      <label for="two">Da</label>
      <br />
      <span>Current Unit: {{ picked }}</span
      ><br />
    </div>
    <br />
    <h4>None</h4>
    <calendar-heatmap
      :values="[]"
      :end-date="endDate"
      :style="{ 'max-width': '675px' }"
      :no-data-text="false"
    />
    <br />
    <h4>Some</h4>
    <calendar-heatmap
      :values="values"
      :end-date="endDate"
      :style="{ 'max-width': '675px' }"
      no-data-text="NOTHING"
    />
    <br />
    <h4>Some (rounded corners)</h4>
    <calendar-heatmap
      :values="values"
      :end-date="endDate"
      :style="{ 'max-width': '675px' }"
      :round="2"
    />
    <br />
    <h4>Some (circles)</h4>
    <calendar-heatmap
      :values="values"
      :end-date="endDate"
      :style="{ 'max-width': '675px' }"
      :round="5"
    />
    <br />
    <h4>Locale</h4>
    <calendar-heatmap
      :values="values"
      :end-date="endDate"
      :style="{ 'max-width': '675px' }"
      :locale="{
        months: [
          'Jan',
          'Feb',
          'Mär',
          'Apr',
          'Mai',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Okt',
          'Nov',
          'Dez',
        ],
        days: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        on: 'am',
        less: 'Weniger',
        more: 'Mehr',
      }"
    />
    <br />
    <h4>Tooltip Unit</h4>
    <calendar-heatmap
      :values="values"
      :end-date="endDate"
      :style="{ 'max-width': '675px' }"
      :tooltip-unit="picked"
    />
    <br />
    <h4>TooltipFormatter</h4>
    <calendar-heatmap
      :values="values"
      :end-date="endDate"
      :style="{ 'max-width': '675px' }"
      :tooltip-formatter="
        (c, u) => (c.count ? c.count / 3600 / 1000 + ' ' + u : 'NÖX')
      "
      no-data-text="NIX"
      :tooltip-unit="picked"
    />
    <br />
    <h4>No legend</h4>
    <calendar-heatmap
      :values="values"
      :end-date="endDate"
      :style="{ 'max-width': '675px' }"
      :show-legend="false"
    />
    <br />
    <h4>No weekdays shown</h4>
    <calendar-heatmap
      :values="values"
      :end-date="endDate"
      :style="{ 'max-width': '675px' }"
      :show-legend="false"
      :show-weekdays="false"
    />
    <br />
    <h4>As Dots</h4>
    <calendar-heatmap
      :values="values"
      :end-date="endDate"
      :style="{ 'max-width': '675px' }"
      :show-legend="false"
      :show-weekdays="false"
      :as-dots="true"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Vue3CalendarHeatmap from "@/components/CalendarHeatmap.vue";
import CalendarHeatmap from "@/components/CalendarHeatmap.vue";
import { data } from "./data";

export default defineComponent({
  name: "ServeDev",
  components: {
    CalendarHeatmap,
    Vue3CalendarHeatmap,
  },
  data() {
    return {
      values: data,
      endDate: new Date("2021-08-01"),
      picked: "Dings",
      orientation: "horizontal",
    };
  },
});
</script>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 12px;
}
</style>
