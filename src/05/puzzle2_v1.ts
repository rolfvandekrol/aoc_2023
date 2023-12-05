import { List, Record } from "immutable";
import { inspect } from "util";
import {applyUntilSimple, chunk, get, log, mapList, min, readFile, splitAndFilter, tap, toInt} from "../tools";

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

type RProps = {
  start: number,
  end: number,
}

type R = Record<RProps>
const RFactory = Record<RProps>({
  start: 0,
  end: 0,
})

const getROverlap = (a: R, b: R): [R|undefined, R|undefined, R|undefined] =>
  tap(
    [
      a.get('start') < b.get('end'),
      b.get('start') < a.get('end'),
      a.get('start') < b.get('start'),
      a.get('end') > b.get('end')
    ],
    ([a_start_before_b_end, b_start_before_a_end, a_start_before_b_start, b_end_before_a_end]) => [
      a_start_before_b_start ? RFactory({
        start: a.get('start'),
        end: b_start_before_a_end ? b.get('start') : a.get('end')
      }) : undefined,
      a_start_before_b_end && b_start_before_a_end ? RFactory({
        start: a_start_before_b_start ? b.get('start'): a.get('start'),
        end: b_end_before_a_end ? b.get('end') : a.get('end')
      }) : undefined,
      b_end_before_a_end ? RFactory({
        start: a_start_before_b_end ? b.get('end') : a.get('start'),
        end: a.get('end')
      }) : undefined
    ]
  )

const rHasOverlap = (a: R, b: R): boolean =>
  a.get('start') < b.get('end') &&
  b.get('start') < a.get('end')

const executeMappingsR = (ranges: List<R>, mappings: List<Mapping>): List<R> =>
  tap(
    mappings.reduce<[List<R>, List<R>]>(
      ([unmapped, mapped], mapping) =>
        tap(
          RFactory({ start: mapping.get('sourceStart'), end: mapping.get('sourceStart') + mapping.get('length')}),
          mappingR =>
            unmapped.reduce(
              ([mUnmapped, mMapped], r) => tap(
                getROverlap(r, mappingR),
                ([rBefore, rOverlap, rAfter]) => [
                  mUnmapped.concat([
                    ...(rBefore !== undefined ? [rBefore] : []),
                    ...(rAfter !== undefined ? [rAfter] : [])
                  ]),
                  rOverlap !== undefined ? mMapped.push(RFactory({
                    start: rOverlap.get('start') - mapping.get('sourceStart') + mapping.get('destinationStart'),
                    end: rOverlap.get('end') - mapping.get('sourceStart') + mapping.get('destinationStart'),
                  })) : mMapped
                ]
              ),
              [List(), mapped]
            ),
        ),

      [ranges, List()]
    ),
    ([a, b]) => a.concat(b)
  )

const formatRanges = (rs: List<R>): [number, number][] =>
  rs.map<[number, number]>(r => [r.get('start'), r.get('end')]).toArray()

readFile('./src/05/input')
  .then(splitAndFilter("\n\n"))
  .then<[string, List<string>]>(a => [a.first(), a.rest()])
  .then<[List<R>, List<List<Mapping>>]>(([seedsInfo, categoryInfo]) => [
    chunk(splitAndFilter(' ')(get(splitAndFilter(': ')(seedsInfo), 1)).map(toInt), 2).map(
      s => RFactory({
        start: get(s, 0),
        end: get(s, 0) + get(s, 1)
      })
    ),
    categoryInfo.map(v => splitAndFilter()(v).rest().map(v => tap(
      splitAndFilter(' ')(v),
      v => MappingFactory({
        destinationStart: toInt(get(v, 0)),
        sourceStart: toInt(get(v, 1)),
        length: toInt(get(v, 2))
      })
    )))
  ])
  // .then(v => log(v, v => formatRanges(v[0])))
  .then(([seedsRanges, mappings]) => mappings.reduce(
    (r, m) => executeMappingsR(r, m),
    seedsRanges
  ))
  .then(
    ranges => min(ranges.map(r => r.get('start')))
  )
  .then(log)
