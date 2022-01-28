
declare global {
  namespace JSX {

    interface IntrinsicElements {
      [elem: string]: any
    }
    interface IntrinsicAttributes {
      key?: string | number
    }
    interface IntrinsicClassAttributes<T>{
      ref:T
    }
  }

}
export {}