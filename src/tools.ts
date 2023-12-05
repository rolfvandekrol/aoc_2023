import * as fs from "fs/promises"
import {Collection, List, Stack, Range, Record, Map} from "immutable"

export const tap = <T, U>(v: T, cb: (v: T) => U): U => cb(v)

export const log = <T>(a: T, cb?: (v: T) => any): T => {
  console.log(cb !== undefined ? cb(a) : a)
  return a
}

export const get = <T, U>(m: Collection<T, U>, k: T): U => m.get(k) as U
export const getKey = <T, U>(m: Collection<T, U>, v: U): T => m.findKey(vv => vv == v) as T
export const head = <T, V extends Stack<T> | List<T>>(c: V): [T | undefined, V] => tap(
  c.first(),
  first => first === undefined ? [undefined, c] : [first, c.shift() as V]
)
export const tail = <T>(c: List<T>): [List<T>, T | undefined] => tap<T | undefined, [List<T>, T | undefined]>(
  c.last(),
  last => last === undefined ? [c, undefined] : [c.pop(), last]
)

export const findTopN = <V>(list: List<V>, n: number, comparator?: (valueA: V, valueB: V) => number): List<V> => list.sort(comparator).reverse().slice(0, n)

export const toJS = <T, U>(m: Collection<T, U>): any => m.toJS()

export const sum = (lines: List<number>): number => lines.reduce<number>((s: number, m: number): number => s+m, 0)
export const product = (lines: List<number>): number => lines.reduce<number>((s: number, m: number): number => s*m, lines.size > 0 ? 1 : 0)
export const max = (numbers: List<number>): number => numbers.max() ?? 0
export const min = (numbers: List<number>): number => numbers.min() ?? 0

export type PointProperties = {
  row: number,
  column: number,
}

export type Point = Record<PointProperties>
export const PointFactory = Record<PointProperties>({row: 0, column: 0})

export const getValueFromPoint = <T>(data: Collection<number, Collection<number, T>>, point: Point): T | undefined =>
  tap(
    point.get('row') >= 0 ? data.get(point.get('row')) : undefined,
    v => (v === undefined || point.get('column') < 0) ? undefined : v.get(point.get('column'))
  )

export const pointAbove = (point: Point, d: number = 1): Point => point.update('row', v => v - d)
export const pointBelow = (point: Point, d: number = 1): Point => point.update('row', v => v + d)
export const pointLeft = (point: Point, d: number = 1): Point => point.update('column', v => v - d)
export const pointRight = (point: Point, d: number = 1): Point => point.update('column', v => v + d)

export const chunk = <T>(l: List<T>, size: number): List<List<T>> =>
  Range(0, l.size, size).map(s => l.slice(s, s+size)).toList()

export const applyUntil = <T>(v: T, callback: (v: T) => T, predicate: (v: T) => boolean): T =>
  predicate(v) ? v : applyUntil(callback(v), callback, predicate)

export const applyUntilSimple = <T>(v: T, callback: (v: T) => T, predicate: (v: T) => boolean): T => {
  let x = v;
  while(!predicate(x)) {
    x = callback(x);
  }
  return x;
}

export const readFile = (path: string): Promise<string> =>
  fs.readFile(path).then(b => b.toString())

export const split = (separator: string = "\n") => (v: string): List<string> =>
  List<string>(v.split(separator))

export const splitAndFilter = (separator: string = "\n") => (v: string): List<string> =>
  split(separator)(v).map(v => v.trim()).filter(v => v.length > 0)

export const toInt = (v: string): number => parseInt(v, 10)

export const mapList = <K, V>(l: List<V>, cb: (v: V) => K): Map<K, List<V>> =>
  l.reduce(
    (m, i) => m.update(cb(i), List(), x => x.push(i)),
    Map()
  )
