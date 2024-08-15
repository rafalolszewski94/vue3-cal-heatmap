<script setup>
import Demo from './components/Demo.vue'
import Links from './components/Links.vue'
</script>

# Vue 3 Calendar Heatmap

<br/>

A lightweight calendar heatmap Vuejs component built on SVG, inspired by github's contribution calendar graph. With tooltip powered by [Tippy.js](https://github.com/atomiks/tippyjs).

<Demo :initial-round="2"/>

## Installation

::: code-group

```bash:no-line-numbers [Yarn]
# install in your project
yarn add vue3-cal-heatmap tippy.js
```

```bash:no-line-numbers [NPM]
# install in your project
npm install -D vue3-cal-heatmap tippy.js
```

:::

## Import

### Global install

```typescript:no-line-numbers v-pre
import VueCalendarHeatmap from 'vue3-cal-heatmap'

app.use(VueCalendarHeatmap)
```

### Use specific components

```typescript:no-line-numbers v-pre
import { CalendarHeatmap } from 'vue3-cal-heatmap'

app.component('CalendarHeatmap', CalendarHeatmap)
```

### Use directly in component

```typescript:no-line-numbers v-pre
import { CalendarHeatmap } from 'vue3-cal-heatmap'

export default {
    components: {
        CalendarHeatmap
    },
    // ...
}
```

::: warning
A css file is included when importing the package. You may have to setup your bundler to embed the css in your page.
:::

## Usage

### values

- Type: `Array<{ date: Date | string; count: number; }>`
- Required: true
- Details:

  Array of objects with `date` and `count` keys. `date` values can be a date parseable string, a millisecond timestamp, or a Date object. `count` value should
  be a number.

```vue:no-line-numbers v-pre
<calendar-heatmap :values="[{ date: '2018-9-22', count: 6 }]" />
```

### endDate

- Type: `string`
- Required: true
- Details:

  Can be a date parseable string, a millisecond timestamp, or a Date object. The calendar will start automatically one year before this date.

```vue:no-line-numbers v-pre
<calendar-heatmap :end-date="2018-9-22" />
```

### round

- Type: `number` between `0` and `5`
- Details:

  Number to create rounded corners or cirlces in heatmap. `0` by default.

```vue:no-line-numbers v-pre
<calendar-heatmap :round="0" .../>
```

#### Example `:round="0"`

<Demo :initialRound="0"/>

#### Example `:round="5"`

<Demo :initialRound="5"/>

### darkMode

- Type: `boolean`
- Details:

  Boolean to toggle default color range between dark and light mode.
  Toggle page between light and dark mode to see in action.

```vue:no-line-numbers v-pre
<calendar-heatmap dark-mode .../>
```

#### Example

<Demo dark-mode />

### rangeColor

- Type: `Array<string>`
- Details:

  Array of strings which represents the colors of the progression.

  - The color at `rangeColor[0]` will always represent the values for a `count: null`
  - The color at `rangeColor[1]` will always represent the values for a `count: 0`
  - The others are automatically distributed over the maximum value of count, unless you specify `max` props.

```vue:no-line-numbers v-pre
<calendar-heatmap :range-color="['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']" .../>
```

::: tip
This overwrites the `darkMode`option. If you use this option, you have to handle dark mode yourself by using `rangeColor`.
:::

#### Example

<Demo :range-color="[ '#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39' ]"/>

### max

- Type: `number`
- Details:

  Any number which should be the max color.

```vue:no-line-numbers v-pre
<calendar-heatmap :max="10" .../>
```

### noDataText

- Type: `string`
- Details:

  Tooltip text to display on days without data. null by default (shows no tooltip at all).

```vue:no-line-numbers v-pre
<calendar-heatmap :no-data-text="no data for this day" .../>
```

### tooltip

- Type: `boolean`
- Details:

  Boolean for enable/disable tooltip on square hover. true by default.

```vue:no-line-numbers v-pre
<calendar-heatmap :tooltip="false" .../>
```

### tooltipUnit

- Type: `string`
- Details:

  String representing heatmap's unit of measure. Value is "contributions" by default.

```vue:no-line-numbers v-pre
<calendar-heatmap tooltip-unit="stars" .../>
```

### tooltipFormatter

- Type: `function(value: { date: Date | string; count: number; }): string`
- Details:

  A method to have full control about tooltip content.

```vue:no-line-numbers v-pre
<calendar-heatmap :tooltip-formatter="(v) => v.count" .../>
```
