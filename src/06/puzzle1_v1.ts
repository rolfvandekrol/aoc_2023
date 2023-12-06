import { List } from "immutable";
import { inspect } from "util";
import {get, log, product, readFile, splitAndFilter, tap, toInt} from "../tools";

const parseFile = (data: string): List<[number, number]> =>
  tap(
    splitAndFilter()(data).map(
      line => splitAndFilter(' ')(get(splitAndFilter(': ')(line), 1).trim()).map(v => toInt(v.trim()))
    ),
    data => get(data, 0).zipWith(
      (t, d) => [t, d],
      get(data, 1)
    )
  )

const holdingRange = (t: number, s: number, d: number): [number, number] =>
  tap(
    Math.sqrt(s*s*t*t - 4*s*d),
    den => [(s*t - den) / 2 / s, (s*t + den) / 2 / s]
  )

readFile('./src/06/input')
  .then(parseFile)
  .then(races => races.map(
    ([t, d]) => holdingRange(t, 1, d))
  )
  .then(races => races.map(
    ([from, to]) => [
      tap(
        Math.ceil(from),
        cFrom => cFrom === from ? from + 1 : cFrom
      ),
      tap(
        Math.floor(to),
        fTo => fTo === to ? to - 1 : fTo
      ),
    ],
  ))
  .then(races => races.map(
    ([from, to]) => to - from + 1
  ))
  .then(product)
  .then(v => log(v, v => inspect(v, false, 10, true)))
