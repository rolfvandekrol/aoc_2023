import { List, Record } from "immutable";
import { inspect } from "util";
import {get, log, min, readFile, splitAndFilter, tap, toInt} from "../tools";

type MappingProperties = {
  sourceStart: number,
  destinationStart: number,
  length: number,
}

type Mapping = Record<MappingProperties>
const MappingFactory = Record<MappingProperties>({
  sourceStart: 0,
  destinationStart: 0,
  length: 0,
})

const executeMappings = (v: number, mappings: List<Mapping>): number =>
  tap(
    mappings.find(m => (v >= m.get('sourceStart')) && (v < (m.get('sourceStart') + m.get('length')))),
    m => m === undefined ?
      v :
      v - m.get('sourceStart') + m.get('destinationStart')
  )

readFile('./src/05/input')
  .then(splitAndFilter("\n\n"))
  .then<[string, List<string>]>(a => [a.first(), a.rest()])
  .then<[List<number>, List<List<Mapping>>]>(([seedsInfo, categoryInfo]) => [
    splitAndFilter(' ')(get(splitAndFilter(': ')(seedsInfo), 1)).map(toInt),
    categoryInfo.map(v => splitAndFilter()(v).rest().map(v => tap(
      splitAndFilter(' ')(v),
      v => MappingFactory({
        destinationStart: toInt(get(v, 0)),
        sourceStart: toInt(get(v, 1)),
        length: toInt(get(v, 2))
      })
    )))
  ])
  .then(([seeds, mappings]) => seeds.map(
    seed =>
      mappings.reduce(
        (v, mapping) => executeMappings(v, mapping),
        seed
      )
  ))
  .then(min)
  .then(v => log(v, v => inspect(v, false, 10, true)))
