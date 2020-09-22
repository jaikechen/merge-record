import { mergeRecord } from './mergeRecord';


class Car {
    constructor (public id:number, 
        public name:string,
        public color:string ){
    }
}

const src = [
    new Car(1, 'Car1', 'red'),
    new Car(2, 'Car2', 'light yellow'),
    new Car(3, 'Car3', 'green'),
]

let target = [
    new Car(1, 'Car1', 'red'),
    new Car(2, 'Car2', 'yellow'),
    new Car(4, 'Car4', 'green'),
]

mergeRecord(src,target,'id',['name','color'],
    x => target.push(x), 
    x => {
        target = target.filter(t=>t.id !== x.id)
        target.push({...x})
   },
    x => {target = target.filter(t=>t.id !==x.id)}
    ).then(result => {
        console.log(result)
        console.log(target)
    })
