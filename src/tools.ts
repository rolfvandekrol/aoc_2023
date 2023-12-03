import * as fs from "fs/promises"
import {Collection, List, Stack, Range} from "immutable"

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
