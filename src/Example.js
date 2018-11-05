export default class Example {
  element;

  constructor(element) {
    this.element = element;
  }
  init() {
    this.element.textContent = 'hello, world!';
    console.log('ehu!');
  }
}
