import equal from 'deep-equal'

export const toMap = <T>(src: T[], keys: (keyof T)[]) => 
  src.reduce((x, y) => x.set(getKey(y, keys), y), new Map<string, T>())
export const getKey = <T>(item: T, keys: (keyof T)[]) =>
  keys.reduce((x, y) => `${x}:${item[y]}`, '')

export const mergeRecord = async <T>(src: T[], target: T[],
  keyFields: (keyof T)[] | (keyof T),
  valueFields: (keyof T)[] | (keyof T) | undefined = undefined,
  insertFunc: ((p: T) => void) | undefined = undefined,
  updateFunc: ((p: T) => void) | undefined = undefined,
  deleteFunc: ((p: T) => void) | undefined = undefined
  ) => {

  const keys = Array.isArray(keyFields) ? keyFields : [keyFields]
  let fields = valueFields === undefined ? undefined : Array.isArray(valueFields) ? valueFields : [valueFields]

  const srcMap = toMap(src, keys)
  src = Array.from(srcMap.values())
  const targetMap = toMap(target, keys)
  const toAdd: T[] = src.filter(x => !targetMap.has(getKey(x, keys)))
  const toDelete: T[] = target.filter(x => !srcMap.has(getKey(x, keys)))

  const toUpdate: T[] = src.filter(x => {
    const target = targetMap.get(getKey(x, keys))
    if (!target) {
      return false
    }
    if (fields && fields.length > 0) {
      return fields.find(k => !equal(target[k], x[k]))
    }
    else {
      return !equal(x, target)
    }
  })

  if (insertFunc) {
    for (const p of toAdd) {
      await insertFunc(p)
    }
  }

  if (updateFunc) {
    for (const p of toUpdate) {
      await updateFunc(p)
    }
  }

  if (deleteFunc) {
    for (const p of toDelete) {
      await deleteFunc(p)
    }
  }
  return [toAdd, toUpdate, toDelete]
} 