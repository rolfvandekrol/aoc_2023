import { List, Set, Map } from "immutable";
import { inspect } from "util";
import {applyUntil, applyUntilSimple, get, log, readFile, split, splitAndFilter, sum, tap, toInt} from "../tools";

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
              splitAndFilter(' ')(get(l, 0)),
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
    cards.reduce(
      (m, [n, w, h]) =>
        tap(
          w.intersect(h).size,
          i => applyUntilSimple<[number, Map<number, number>]>(
            [i, m],
              ([i, m]) => [
                i - 1,
                m.has(n+1) ?
                  m.update(n+i, 0, v => v + get(m, n)) :
                  m
              ],
            ([i, m]) => i <= 0
          )
        )[1],
      Map<number, number>(cards.valueSeq().map(([n, w, h]) => [n, 1]))
    )
  )
  .then(v => sum(v.valueSeq().toList()))
  .then(v => log(v, v => inspect(v, false, 10, true)))
