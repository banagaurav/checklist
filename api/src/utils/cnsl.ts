class cnsl {
  static log(...args: any) {
    console.log('==================================================');
    for (const arg of args) {
      console.log(arg);
    }
    console.log('==================================================');
  }

  static json(...args: any) {
    console.log('==================================================');
    for (const arg of args) {
      console.log(JSON.stringify(arg, null, 4));
    }
    console.log('==================================================');
  }
}

export default cnsl;
