<script lang="ts">
import {
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  PropType,
  ref,
  toRef,
  toRefs,
  watch,
} from "vue";
import {
  CalendarItem,
  Heatmap,
  Locale,
  Month,
  TooltipFormatter,
  Value,
} from "@/components/Heatmap";
import tippy, {
  createSingleton,
  CreateSingletonInstance,
  Instance,
} from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/dist/svg-arrow.css";

export default /*#__PURE__*/ defineComponent({
  name: "CalendarHeatmap",
  props: {
    endDate: {
      required: true,
    },
    max: {
      type: Number,
    },
    rangeColor: {
      type: Array as PropType<string[]>,
    },
    values: {
      type: Array as PropType<Value[]>,
      required: true,
    },
    locale: {
      type: Object as PropType<Partial<Locale>>,
    },
    tooltip: {
      type: Boolean,
      default: true,
    },
    tooltipUnit: {
      type: String,
      default: Heatmap.DEFAULT_TOOLTIP_UNIT,
    },
    tooltipFormatter: {
      type: Function as PropType<TooltipFormatter>,
    },
    noDataText: {
      type: [Boolean, String],
      default: null,
    },
    round: {
      type: Number,
      default: 0,
    },
    darkMode: Boolean,
    showLegend: {
      type: Boolean,
      default: true,
    },
    showWeekdays: {
      type: Boolean,
      default: true,
    },
    asDots: {
      type: Boolean,
      default: false,
    },
    dayClasses: {
      type: [String, Array] as PropType<string | string[]>,
      default: "",
    },
  },
  emits: ["dayClick"],
  setup(props) {
    const SQUARE_BORDER_SIZE = Heatmap.SQUARE_SIZE / 5,
      SQUARE_SIZE = Heatmap.SQUARE_SIZE + SQUARE_BORDER_SIZE,
      LEFT_SECTION_WIDTH = props.showWeekdays
        ? Math.ceil(Heatmap.SQUARE_SIZE * 2.5)
        : 0,
      RIGHT_SECTION_WIDTH = SQUARE_SIZE * 3,
      TOP_SECTION_HEIGHT = Heatmap.SQUARE_SIZE + Heatmap.SQUARE_SIZE / 2,
      BOTTOM_SECTION_HEIGHT = Heatmap.SQUARE_SIZE + Heatmap.SQUARE_SIZE / 2,
      yearWrapperTransform = `translate(${LEFT_SECTION_WIDTH}, ${TOP_SECTION_HEIGHT})`,
      svg = ref<null | SVGElement>(null),
      now = ref(new Date()),
      heatmap = ref(
        new Heatmap(props.endDate as Date, props.values, props.max)
      ),
      width = ref(0),
      height = ref(0),
      viewbox = ref("0 0 0 0"),
      legendViewbox = ref("0 0 0 0"),
      daysLabelWrapperTransform = ref(""),
      monthsLabelWrapperTransform = ref(""),
      legendWrapperTransform = ref(""),
      lo = ref<Locale>({} as any),
      rangeColor = ref<string[]>(
        props.rangeColor ||
          (props.darkMode
            ? Heatmap.DEFAULT_RANGE_COLOR_DARK
            : Heatmap.DEFAULT_RANGE_COLOR_LIGHT)
      );

    const rounding = ref(props.round);

    if (props.asDots) {
      rounding.value = 20;
    }

    const { values, tooltipUnit, tooltipFormatter, noDataText, max, locale } =
        toRefs(props),
      tippyInstances = new Map<HTMLElement, Instance>();

    let tippySingleton: CreateSingletonInstance;

    function initTippy() {
      tippyInstances.clear();
      if (tippySingleton) {
        tippySingleton.setInstances(Array.from(tippyInstances.values()));
      } else {
        tippySingleton = createSingleton(Array.from(tippyInstances.values()), {
          overrides: [],
          moveTransition: "transform 0.1s ease-out",
          allowHTML: true,
        });
      }
    }

    function tooltipOptions(day: CalendarItem) {
      if (props.tooltip) {
        if (day.count !== undefined) {
          if (props.tooltipFormatter) {
            return props.tooltipFormatter(day, props.tooltipUnit!);
          }
          return `<b>${day.count} ${props.tooltipUnit}</b> ${lo.value.on} ${
            lo.value.months[day.date.getMonth()]
          } ${day.date.getDate()}, ${day.date.getFullYear()}`;
        } else if (props.noDataText) {
          return `${props.noDataText}`;
        } else if (props.noDataText !== false) {
          return `<b>No ${props.tooltipUnit}</b> ${lo.value.on} ${
            lo.value.months[day.date.getMonth()]
          } ${day.date.getDate()}, ${day.date.getFullYear()}`;
        }
      }
      return undefined;
    }

    function getWeekPosition(index: number) {
      return `translate(${index * SQUARE_SIZE}, 0)`;
    }

    function getDayPosition(index: number) {
      return `translate(0, ${index * SQUARE_SIZE})`;
    }

    function getMonthLabelPosition(month: Month) {
      return {
        x: SQUARE_SIZE * (month.index - 1),
        y: SQUARE_SIZE - SQUARE_BORDER_SIZE,
      };
    }

    watch(
      [toRef(props, "rangeColor"), toRef(props, "darkMode")],
      ([rc, dm]) => {
        rangeColor.value =
          rc ||
          (dm
            ? Heatmap.DEFAULT_RANGE_COLOR_DARK
            : Heatmap.DEFAULT_RANGE_COLOR_LIGHT);
      }
    );

    width.value =
      LEFT_SECTION_WIDTH +
      SQUARE_SIZE * heatmap.value.weekCount +
      SQUARE_BORDER_SIZE;
    height.value = TOP_SECTION_HEIGHT + SQUARE_SIZE * Heatmap.DAYS_IN_WEEK;
    daysLabelWrapperTransform.value = `translate(0, ${TOP_SECTION_HEIGHT})`;
    monthsLabelWrapperTransform.value = `translate(${LEFT_SECTION_WIDTH}, 0)`;

    watch([width, height], ([w, h]) => (viewbox.value = ` 0 0 ${w} ${h}`), {
      immediate: true,
    });
    watch(
      [width, height, rangeColor],
      ([w, h, rc]) => {
        legendWrapperTransform.value = `translate(${
          w - SQUARE_SIZE * rc.length - 30
        }, ${h - BOTTOM_SECTION_HEIGHT})`;
      },
      { immediate: true }
    );

    watch(
      locale,
      (l) =>
        (lo.value = l
          ? { ...Heatmap.DEFAULT_LOCALE, ...l }
          : Heatmap.DEFAULT_LOCALE),
      { immediate: true }
    );
    watch(
      rangeColor,
      (rc) =>
        (legendViewbox.value = `0 0 ${Heatmap.SQUARE_SIZE * (rc.length + 1)} ${
          Heatmap.SQUARE_SIZE
        }`),
      { immediate: true }
    );

    watch(
      [values, tooltipUnit, tooltipFormatter, noDataText, max, rangeColor],
      () => {
        heatmap.value = new Heatmap(
          props.endDate as Date,
          props.values,
          props.max
        );
        tippyInstances.forEach((item) => item.destroy());
        nextTick(initTippy);
      }
    );

    onMounted(initTippy);
    onBeforeUnmount(() => {
      tippySingleton?.destroy();
      tippyInstances.forEach((item) => item.destroy());
    });

    function initTippyLazy(e: MouseEvent) {
      if (
        tippySingleton &&
        e.target &&
        (e.target as HTMLElement).classList.contains("vch__day__square") &&
        (e.target as HTMLElement).dataset.weekIndex !== undefined &&
        (e.target as HTMLElement).dataset.dayIndex !== undefined
      ) {
        const weekIndex = Number((e.target as HTMLElement).dataset.weekIndex),
          dayIndex = Number((e.target as HTMLElement).dataset.dayIndex);

        if (!isNaN(weekIndex) && !isNaN(dayIndex)) {
          const tooltip = tooltipOptions(
            heatmap.value.calendar[weekIndex][dayIndex]
          );
          if (tooltip) {
            const instance = tippyInstances.get(e.target as HTMLElement);

            if (instance) {
              instance.setContent(tooltip);
            } else if (!instance) {
              tippyInstances.set(
                e.target as HTMLElement,
                tippy(e.target as HTMLElement, { content: tooltip } as any)
              );
              tippySingleton.setInstances(Array.from(tippyInstances.values()));
            }
          }
        }
      }
    }

    return {
      SQUARE_BORDER_SIZE,
      SQUARE_SIZE,
      LEFT_SECTION_WIDTH,
      RIGHT_SECTION_WIDTH,
      TOP_SECTION_HEIGHT,
      BOTTOM_SECTION_HEIGHT,
      svg,
      heatmap,
      now,
      width,
      height,
      viewbox,
      daysLabelWrapperTransform,
      monthsLabelWrapperTransform,
      yearWrapperTransform,
      legendWrapperTransform,
      lo,
      legendViewbox,
      curRangeColor: rangeColor,
      getWeekPosition,
      getDayPosition,
      getMonthLabelPosition,
      initTippyLazy,
      rounding,
      asDots: props.asDots,
    };
  },
});
</script>

<template>
  <div :class="{ vch__container: true, 'dark-mode': darkMode }">
    <svg class="vch__wrapper" ref="svg" :viewBox="viewbox">
      <g
        class="vch__months__labels__wrapper"
        :transform="monthsLabelWrapperTransform"
      >
        <text
          class="vch__month__label"
          v-for="(month, index) in heatmap.firstFullWeekOfMonths"
          :key="index"
          :x="getMonthLabelPosition(month).x"
          :y="getMonthLabelPosition(month).y"
        >
          {{ lo.months[month.value] }}
        </text>
      </g>

      <g
        class="vch__days__labels__wrapper"
        :transform="daysLabelWrapperTransform"
        v-if="showWeekdays"
      >
        <text class="vch__day__label" :x="0" :y="20">
          {{ lo.days[1] }}
        </text>
        <text class="vch__day__label" :x="0" :y="44">
          {{ lo.days[3] }}
        </text>
        <text class="vch__day__label" :x="0" :y="69">
          {{ lo.days[5] }}
        </text>
      </g>

      <g
        class="vch__year__wrapper"
        :transform="yearWrapperTransform"
        @mouseover="initTippyLazy"
      >
        <g
          class="vch__month__wrapper"
          v-for="(week, weekIndex) in heatmap.calendar"
          :key="weekIndex"
          :transform="getWeekPosition(weekIndex)"
        >
          <template v-for="(day, dayIndex) in week" :key="dayIndex">
            <rect
              class="vch__day__square"
              :class="dayClasses"
              v-if="day.date < now"
              :rx="rounding"
              :ry="rounding"
              :transform="getDayPosition(dayIndex)"
              :width="SQUARE_SIZE - SQUARE_BORDER_SIZE"
              :height="SQUARE_SIZE - SQUARE_BORDER_SIZE"
              :style="{ fill: curRangeColor[day.colorIndex] }"
              :data-week-index="weekIndex"
              :data-day-index="dayIndex"
              @click="$emit('dayClick', day)"
            />
          </template>
        </g>
      </g>
    </svg>
    <div class="vch__legend" v-if="showLegend">
      <slot name="legend">
        <div class="vch__legend-left">
          <slot name="vch__legend-left"></slot>
        </div>
        <div class="vch__legend-right">
          <slot name="legend-right">
            <div class="vch__legend">
              <div>{{ lo.less }}</div>
              <svg
                class="vch__external-legend-wrapper"
                :viewBox="legendViewbox"
                :height="SQUARE_SIZE - SQUARE_BORDER_SIZE"
              >
                <g class="vch__legend__wrapper">
                  <rect
                    v-for="(color, index) in curRangeColor"
                    :key="index"
                    :rx="rounding"
                    :ry="rounding"
                    :style="{ fill: color }"
                    :width="SQUARE_SIZE - SQUARE_BORDER_SIZE"
                    :height="SQUARE_SIZE - SQUARE_BORDER_SIZE"
                    :x="SQUARE_SIZE * index"
                  />
                </g>
              </svg>
              <div>{{ lo.more }}</div>
            </div>
          </slot>
        </div>
      </slot>
    </div>
  </div>
</template>

<style lang="scss">
.vch__container {
  .vch__legend {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .vch__external-legend-wrapper {
    margin: 0 8px;
  }
}

svg.vch__wrapper {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  line-height: 10px;
  width: 100%;

  .vch__months__labels__wrapper text.vch__month__label {
    font-size: 10px;
  }

  .vch__days__labels__wrapper text.vch__day__label,
  .vch__legend__wrapper text {
    font-size: 9px;
  }

  text.vch__month__label,
  text.vch__day__label,
  .vch__legend__wrapper text {
    fill: #767676;
  }

  rect.vch__day__square:hover {
    stroke: #555;
    stroke-width: 2px;
    paint-order: stroke;
  }

  rect.vch__day__square:focus {
    outline: none;
  }

  &.dark-mode {
    text.vch__month__label,
    text.vch__day__label,
    .vch__legend__wrapper text {
      fill: #fff;
    }
  }
}
</style>
