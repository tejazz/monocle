const os = require("os");
const cluster = require("cluster");
if (cluster.isMaster) {
  const numbeOfCpus = os.cpus().length;
  const numberOfClusters = Math.min(4, numbeOfCpus);

  console.log(`Master ${process.pid} is running`);

  // We are limiting to a maximum of 4 children for the time being.
  console.log(`Forking Server for ${numberOfClusters} CPUs\n`);
  // Create a Worker Process for each Available CPU
  for (let index = 0; index < numberOfClusters; index++) {
    cluster.fork();
  }
  
  // When Worker process has died, Log the worker
  cluster.on("exit", (worker, code, signal) => {
    /**
     * The condition checks if worker actually crashed and
     * wasn't manually disconnected or killed by master process.
     *
     * The condition can be changed by desired error code,
     * and condition.
     */
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(`Worker (child process) ${worker.process.pid} died`);
      cluster.fork();
    }
  });
} else {
  // if Worker process, master is false, cluster.isWorker is true
  // worker starts server for individual cpus
  // the worker created above is starting server
  require("./bin/www");
}
