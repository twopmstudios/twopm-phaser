import { Observable, from, Subject, Subscription } from 'rxjs'

export type EventStream<T> = {
  name: string
  emit: (e: T) => void
  close: () => void
  stream: Observable<T>
}

const zero = <T>(): EventStream<T> => ({
  name: 'null',
  emit: () => {},
  close: () => {},
  stream: from([]),
})

export const makeEventStream = <T>(name: string): EventStream<T> => {
  const subject = new Subject<T>()

  return {
    name,
    stream: subject.asObservable(),
    emit: (e: T) => subject.next(e),
    close: () => subject.complete(),
  }
}
