import { List } from "immutable"
import {log, sum, max, readFile, splitAndFilter, toInt, findTopN} from "../tools"
import {inspect} from "util";

readFile("./src/01/input").
  then(splitAndFilter()).
  then(lines => lines.
    map(line => List(Array.from(line)).map(toInt).filter(v => !isNaN(v))).
    map(line =>
      toInt(line.first(0).toString() + line.last(0).toString())
    )
  ).
  then(sum).
  then(v => log(v, v => inspect(v, false, 10, true)))
