import {
  Point,
  get,
  getValueFromPoint,
  log,
  readFile,
  splitAndFilter,
  sum,
  tap,
  toInt,
  pointRight,
  pointLeft, pointAbove, pointBelow, PointFactory
} from "../tools";
import { inspect } from "util";
import { List, update } from "immutable";

const isNumber = (char: string): boolean => !!char.match(/^\d$/)

readFile('./src/03/input')
  .then(input => splitAndFilter()(input).map(line => List(Array.from(line))))
  .then(data =>
    tap(
      data.reduce(
        (m, row, rowId) => tap(
          row.reduce<[string, List<[string, Point]>]>(
            ([lastChar, results], char, columnId) => [
              char,
              isNumber(char) ? (
                isNumber(lastChar) ? (
                  tap(
                    get(results, results.size - 1),
                    ([v, c]) => results.slice(0, -1).push([v + char, c])
                  )
                ) : results.push([char, PointFactory({row: rowId, column: columnId})])
              ) : results
            ],
            ['.', List()]
          ),
          ([_, results]) => m.merge(results.map<[number, Point]>(
            ([v, c]) => [toInt(v), c]
          ))
        ),
        List<[number, Point]>()
      ),
      (foundNumbers): List<[number, Point, List<[string, Point]>]> => foundNumbers.map(
        ([v, c]) =>
          tap(
            tap(
              List<string>(Array.from(v.toString()))
                .map<Point>((_, k) => pointRight(c, k)),
              numberCoords => List([
                pointLeft(c),
                pointAbove(pointLeft(c)),
                pointBelow(pointLeft(c)),
                pointRight(c, v.toString().length),
                pointAbove(pointRight(c, v.toString().length)),
                pointBelow(pointRight(c, v.toString().length)),
              ]).merge(
                numberCoords.map(c => pointAbove(c))
              ).merge(
                numberCoords.map(c => pointBelow(c))
              )
            ).reduce<List<[string, Point]>>(
              (m, c) => tap(
                getValueFromPoint<string>(data, c),
                v => (v === undefined || v.match(/^[\d.]/)) ? m : m.push([v, c])
              ),
              List()
            ),
            x => [v, c, x]
          )
      )
    )
  )
  .then(v =>
    v
      .filter(([n, c, s]) => s.size > 0)
      .map(([n, c, s]) => n)
  )
  .then(v => sum(v))
  .then(v => log(v, v => inspect(v, false, 10, true)))
