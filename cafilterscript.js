f (typeof(Worker) !== "undefined") {
  // Yes! Web worker support!
  // Some code.....
  var filterWebWorker = new Worker("cafilterwebworker.js");
} else {
  // Sorry! No Web Worker support..
}
