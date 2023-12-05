const wait = (duration: number) => new Promise(res => setTimeout(() => res(true), duration))

export default wait