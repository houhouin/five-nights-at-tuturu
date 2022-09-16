class a {
  constructor(name = "bob") {
    this.player = name;
    this.ayyy = "ayyyyy";
  }

  hehe() {
    console.log(`Hello ${this.player}`);
  }
}

class b extends a {
  constructor() {
    super("sam");
  }
}



let myB = new b();
myB.hehe();
console.log(myB.ayyy);