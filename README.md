# ParallelWorker
HTML5 WebWorkers easy to use implementation


<h3>Phase 1:</h3>
<h4>Register Callback</h4>{STATUS==80%}
  <ul>
  <li>Single Callback</li>
  <li>Multiple Callback</li>
  </ul>
<h4>UnRegister Callback</h4>{STATUS==33%}
  <ul>
  <li>Single Callback Unregister</li>
  <li>Multiple Callback Unregister</li>
  <li>All Callback Unregister</li>
  </ul>
  
<h4>Execution Time</h4> : Ability to add time constraint to the worker job execution and existance.{STATUS==Not Started}
  <ul>
  <li>Job Execution TimeLimit</li>
  <li>Worker Existance Period</li>
  </ul>
  
<h4>Result of the job to be passed automatically to the Worker.postMesage()</h4>.{STATUS==0%}

<h3>Phase 2:</h3>
<h4>Check feasiblity to include ArrayBuffer so as to avoid data cloning.</h4>{STATUS==Not Started}
 <ul>Verify UseCase:
      <li>Can we forward the same object to child workers.</li>
      <li>Is is possible to create a clone of the ArrayBuffer Data in the Worker as a local Copy.</li>
      <li>Browser support for ArrayBuffer</li>
  </ul>
<h4>Check feasibility of a worker to invoke a child worker execution from within.</h4>{STATUS==Not Started}

<h3>Phase 3:</h3>
<h4>Worker and Job pooling concept.</h4>{STATUS==Not Started}
