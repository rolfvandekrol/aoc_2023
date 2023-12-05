import { List } from "immutable"
import {log, sum, max, readFile, splitAndFilter, toInt, tap} from "../tools"
import {inspect} from "util";

const replacements = List<[string, string]>([
  ['one', '1'],
  ['two', '2'],
  ['three', '3'],
  ['four', '4'],
  ['five', '5'],
  ['six', '6'],
  ['seven', '7'],
  ['eight', '8'],
  ['nine', '9'],
])

const extractFirstDigit = (line: string): number =>
  tap(
    replacements.reduce(
      (line, [from, to]): string => line.slice(0, from.length) === from ? (to + line.slice(from.length)) : line,
      line
    ),
    newline => tap(
      toInt(newline.slice(0, 1)),
      v => !isNaN(v) ? v : extractFirstDigit(line.slice(1))
    )
  )

const extractLastDigit = (line: string): number =>
  tap(
    replacements.reduce(
      (line, [from, to]): string => line.slice(-1 * from.length) === from ? (line.slice(0, -1 * from.length) + to) : line,
      line
    ),
    newline => tap(
      toInt(newline.slice(-1)),
      v => !isNaN(v) ? v : extractLastDigit(line.slice(0, -1))
    )
  )

readFile("./src/01/input").
  then(splitAndFilter()).
  then(lines => lines.
    map(line => [extractFirstDigit(line), extractLastDigit(line)]).
    map(([a, b]) => toInt(a.toString() + b.toString()))
  ).
  then(sum).
  then(v => log(v, v => inspect(v, false, 10, true)))
  // then(lines => lines.
  //   map(line => List(Array.from(line)).map(toInt).filter(v => !isNaN(v))).
  //   map(line =>
  //     toInt(line.first(0).toString() + line.last(0).toString())
  //   )
  // ).
  // then(sum).
  // then(v => log(v, v => inspect(v, false, 10, true)))
