import { List, Map } from "immutable"
import { inspect } from "util";
import {get, log, readFile, split, splitAndFilter, sum, tap, toInt} from "../tools";

type Color = 'red'|'green'|'blue'
type Reading = Map<Color, number>

const parseLine = (line: string): [number, List<Reading>] =>
  tap(
    split(': ')(line),
    l => [
      toInt(get(split(' ')(get(l, 0)), 1)),
      split('; ')(get(l, 1)).map(
        r => Map<Color, number>(
          split(', ')(r).map(
            v => tap(
              split(' ')(v),
              v => [
                get(v, 1) as Color,
                toInt(get(v, 0))
              ]
            )
          )
        )
      )
    ]
  )

const combineReadings = (readings: List<Reading>): Reading =>
  readings.reduce(
    (m, r) => m.mergeWith(
      (a, b) => Math.max(a, b),
      r),
    Map()
  )

const fitsIn = (inner: Reading, outer: Reading): boolean =>
  inner.every((inner_amount, inner_color) =>
    outer.get(inner_color, 0) >= inner_amount
  )

const condition: Reading = Map([
  ['red', 12],
  ['green', 13],
  ['blue', 14]
])

readFile('./src/02/input')
  .then(splitAndFilter())
  .then(lines => Map(lines.map(parseLine).map(([n, readings]) => [n, combineReadings(readings)])))
  .then(lines => lines.filter(r => fitsIn(r, condition)))
  .then(lines => sum(lines.keySeq().toList()))
  .then(v => log(v, v => inspect(v, false, 10, true)))
