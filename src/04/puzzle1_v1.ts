import { List, Set } from "immutable";
import { inspect } from "util";
import {get, log, readFile, split, splitAndFilter, sum, tap, toInt} from "../tools";

type Card = [number, Set<number>, Set<number>]

readFile('./src/04/input')
  .then(splitAndFilter())
  .then(lines => lines.map(
    line =>
      tap(
        split(': ')(line),
        l =>
          tap<[List<string>, List<Set<number>>], Card>(
            [
              split(' ')(get(l, 0)),
              split(' | ')(get(l, 1)).map(x => splitAndFilter(' ')(x.trim()).map(v => toInt(v.trim())).toSet())
            ],
            ([n, d]): Card => [
              toInt(get(n, 1)),
              get(d, 0),
              get(d, 1)
            ]
          )
      )
  ))
  .then(cards =>
    cards
      .map(
        ([n, w, h]) =>
          w.intersect(h).size
      )
      .map(
        s => s > 0 ? Math.pow(2, s-1) : s
      )
  )
  .then(sum)
  .then(v => log(v, v => inspect(v, false, 10, true)))
